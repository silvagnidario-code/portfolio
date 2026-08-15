'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { duration } from '@/tokens/brand'

import { useMotionPreferences } from './motion-preferences'

/**
 * WebGL hover distortion on a cover image, §8.
 *
 * The image itself is always the real `next/image` underneath: this component
 * lays a canvas over it and only when everything lines up — a pointer, no
 * reduced-motion request, a working WebGL context, and the element actually on
 * screen. If any of those fails, what stays is the picture, which is the whole
 * fallback story.
 *
 * OGL is imported dynamically and the canvas is created on first intersection,
 * so a grid of twelve covers costs nothing until it is scrolled to. That is the
 * "lazy mount outside the viewport" §10 asks for.
 */

type HoverDistortionProps = {
  /** URL of the texture. The same file the `img` underneath is showing. */
  src: string
  children: ReactNode
  className?: string
}

const VERTEX = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

/**
 * A soft radial push around the pointer. Deliberately gentle: the direction of
 * this project is slow and quiet, and a strong ripple would read as a gimmick.
 */
const FRAGMENT = `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uPointer;
uniform float uStrength;
uniform vec2 uCover;
varying vec2 vUv;

void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  vec2 toPointer = uv - uPointer;
  float distance = length(toPointer);
  float influence = smoothstep(0.45, 0.0, distance) * uStrength;

  uv -= normalize(toPointer + 1e-6) * influence * 0.06;

  gl_FragColor = texture2D(tMap, uv);
}
`

export function HoverDistortion({ src, children, className }: HoverDistortionProps) {
  const { reducedMotion, coarsePointer, ready } = useMotionPreferences()
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const eligible = ready && !reducedMotion && !coarsePointer

  // Mounted only once the cover is close to the viewport.
  useEffect(() => {
    const container = containerRef.current
    if (!eligible || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [eligible])

  useEffect(() => {
    const container = containerRef.current
    if (!active || !container) return

    let dispose = () => {}
    let cancelled = false

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle, Texture } = await import('ogl')
      if (cancelled) return

      let renderer: InstanceType<typeof Renderer>
      try {
        renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
      } catch {
        // No WebGL context: the image underneath is already the fallback.
        return
      }

      const gl = renderer.gl
      const canvas = gl.canvas as HTMLCanvasElement
      canvas.className = 'absolute inset-0 h-full w-full opacity-0'
      canvas.style.transition = `opacity ${duration.base}ms`
      container.appendChild(canvas)

      const texture = new Texture(gl)
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = src
      image.onload = () => {
        texture.image = image
        resize()
      }

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          tMap: { value: texture },
          uPointer: { value: [0.5, 0.5] },
          uStrength: { value: 0 },
          uCover: { value: [1, 1] },
        },
      })

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

      const resize = () => {
        const { width, height } = container.getBoundingClientRect()
        renderer.setSize(width, height)

        // Emulates object-fit: cover, so the canvas frames the picture exactly
        // as the img underneath does and the swap is invisible.
        const imageRatio = image.naturalWidth / Math.max(image.naturalHeight, 1)
        const boxRatio = width / Math.max(height, 1)
        const cover: [number, number] =
          imageRatio > boxRatio ? [boxRatio / imageRatio, 1] : [1, imageRatio / boxRatio]

        program.uniforms.uCover!.value = cover
      }

      const pointer = { x: 0.5, y: 0.5 }
      let strength = 0
      let target = 0
      let frame = 0

      const onEnter = () => {
        target = 1
        canvas.style.opacity = '1'
      }

      const onLeave = () => {
        target = 0
        canvas.style.opacity = '0'
      }

      const onMove = (event: PointerEvent) => {
        const box = container.getBoundingClientRect()
        pointer.x = (event.clientX - box.left) / box.width
        pointer.y = 1 - (event.clientY - box.top) / box.height
      }

      const tick = () => {
        strength += (target - strength) * 0.08
        program.uniforms.uStrength!.value = strength
        program.uniforms.uPointer!.value = [pointer.x, pointer.y]
        renderer.render({ scene: mesh })
        frame = window.requestAnimationFrame(tick)
      }

      const observer = new ResizeObserver(resize)
      observer.observe(container)

      container.addEventListener('pointerenter', onEnter)
      container.addEventListener('pointerleave', onLeave)
      container.addEventListener('pointermove', onMove)
      resize()
      frame = window.requestAnimationFrame(tick)

      dispose = () => {
        window.cancelAnimationFrame(frame)
        observer.disconnect()
        container.removeEventListener('pointerenter', onEnter)
        container.removeEventListener('pointerleave', onLeave)
        container.removeEventListener('pointermove', onMove)
        canvas.remove()
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }

    void start()

    return () => {
      cancelled = true
      dispose()
    }
  }, [active, src])

  return (
    <div ref={containerRef} data-webgl="hover-distortion" className={`relative ${className ?? ''}`}>
      {children}
    </div>
  )
}

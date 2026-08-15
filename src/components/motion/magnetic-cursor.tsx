'use client'

import { useEffect, useRef } from 'react'

import { GlassSurface } from '@/components/glass/glass-surface'

import { useMotionPreferences } from './motion-preferences'

/**
 * The glass cursor, §8.
 *
 * It follows the pointer by interpolation rather than by assignment — a
 * fraction of the remaining distance every frame — which is what gives it the
 * weight of a physical disc instead of the twitch of a crosshair.
 *
 * Elements marked `data-magnetic` pull it in: inside the catch radius the disc
 * snaps to their centre and the element itself leans back a few pixels. The
 * effect only reads if it is small.
 *
 * It disables itself entirely on touch and under reduced motion — and it only
 * hides the system cursor once it is actually running, because a hidden cursor
 * with nothing in its place is a broken page.
 */

const LERP = 0.15
const CATCH_RADIUS = 80
const MAX_ELEMENT_SHIFT = 8

export function MagneticCursor() {
  const { reducedMotion, coarsePointer, ready } = useMotionPreferences()
  const cursorRef = useRef<HTMLDivElement>(null)

  const enabled = ready && !reducedMotion && !coarsePointer

  useEffect(() => {
    const cursor = cursorRef.current
    if (!enabled || !cursor) return

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const position = { ...pointer }
    let magnet: HTMLElement | null = null
    let frame = 0
    let visible = false

    document.documentElement.dataset.customCursor = 'true'

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY

      if (!visible) {
        visible = true
        cursor.style.opacity = '1'
      }

      // Nearest magnetic element whose centre is inside the catch radius.
      let closest: HTMLElement | null = null
      let closestDistance = CATCH_RADIUS

      for (const candidate of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
        const box = candidate.getBoundingClientRect()
        const centreX = box.left + box.width / 2
        const centreY = box.top + box.height / 2
        const distance = Math.hypot(pointer.x - centreX, pointer.y - centreY)

        if (distance < closestDistance) {
          closest = candidate
          closestDistance = distance
        }
      }

      if (magnet && magnet !== closest) {
        magnet.style.transform = ''
        magnet = null
      }

      if (closest) {
        magnet = closest
        const box = closest.getBoundingClientRect()
        const centreX = box.left + box.width / 2
        const centreY = box.top + box.height / 2
        const pull = Math.min(1, (CATCH_RADIUS - closestDistance) / CATCH_RADIUS)

        closest.style.transform = `translate(${(pointer.x - centreX) * pull * (MAX_ELEMENT_SHIFT / CATCH_RADIUS)}px, ${
          (pointer.y - centreY) * pull * (MAX_ELEMENT_SHIFT / CATCH_RADIUS)
        }px)`

        pointer.x = centreX + (pointer.x - centreX) * (1 - pull)
        pointer.y = centreY + (pointer.y - centreY) * (1 - pull)
      }
    }

    const onPointerLeave = () => {
      visible = false
      cursor.style.opacity = '0'
    }

    const tick = () => {
      position.x += (pointer.x - position.x) * LERP
      position.y += (pointer.y - position.y) * LERP
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      if (magnet) magnet.style.transform = ''
      delete document.documentElement.dataset.customCursor
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <GlassSurface
      variant="cursor"
      aria-hidden="true"
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-100 h-48 w-48 opacity-0"
    />
  )
}

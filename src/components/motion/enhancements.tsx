'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { duration } from '@/tokens/brand'

import { registerRevealEase } from './gsap-ease'
import { useMayAnimate } from './motion-preferences'

/**
 * The behaviours phase 6 marked in the markup and left inert: counters that
 * count, a marquee that moves, a row that can be dragged.
 *
 * All three are enhancements in the strict sense — the block already renders
 * its final state, and these only change how it gets there. Which is also why
 * the first two switch off under reduced motion and the third does not:
 * dragging is an input, not an animation.
 */

/** Counts a number up when it scrolls into view. */
export function Counters() {
  const mayAnimate = useMayAnimate()
  const pathname = usePathname()

  useEffect(() => {
    if (!mayAnimate) return

    let dispose = () => {}
    let cancelled = false

    const start = async () => {
      const [gsapModule, { ScrollTrigger }, customEase] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/CustomEase'),
      ])

      if (cancelled) return

      const { gsap } = gsapModule
      gsap.registerPlugin(ScrollTrigger)
      const ease = registerRevealEase(gsapModule, customEase)

      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]'))
      const triggers: Array<{ kill: () => void }> = []

      for (const target of targets) {
        const final = target.dataset.counter ?? target.textContent ?? ''
        // Only the digits move; the sign, the unit and the separators stay put.
        const match = /-?[\d.,]+/.exec(final)
        if (!match) continue

        const raw = match[0]
        const value = Number(raw.replace(/\./g, '').replace(',', '.'))
        if (Number.isNaN(value)) continue

        const decimals = raw.includes(',') ? (raw.split(',')[1]?.length ?? 0) : 0
        const state = { current: 0 }

        triggers.push(
          ScrollTrigger.create({
            trigger: target,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              gsap.to(state, {
                current: value,
                duration: duration.slowest / 1000,
                ease,
                onUpdate: () => {
                  const rendered = state.current.toLocaleString(document.documentElement.lang, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  })
                  target.textContent = final.replace(raw, rendered)
                },
                onComplete: () => {
                  target.textContent = final
                },
              })
            },
          }),
        )
      }

      dispose = () => {
        for (const trigger of triggers) trigger.kill()
      }
    }

    void start()

    return () => {
      cancelled = true
      dispose()
    }
  }, [mayAnimate, pathname])

  return null
}

/** Loops a row of logos sideways, forever, slowly. */
export function Marquee() {
  const mayAnimate = useMayAnimate()
  const pathname = usePathname()

  useEffect(() => {
    if (!mayAnimate) return

    const tracks = Array.from(document.querySelectorAll<HTMLElement>('[data-marquee]'))
    if (tracks.length === 0) return

    const cleanups = tracks.map((track) => {
      // Duplicated so the seam never shows; the copy is decorative.
      const clone = track.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      for (const child of clone.children) child.setAttribute('tabindex', '-1')
      track.append(...Array.from(clone.children))

      let offset = 0
      let frame = 0
      let paused = false

      const half = () => track.scrollWidth / 2

      const tick = () => {
        if (!paused) {
          offset = (offset + 0.35) % Math.max(half(), 1)
          track.style.transform = `translate3d(${-offset}px, 0, 0)`
        }
        frame = window.requestAnimationFrame(tick)
      }

      // A reader who wants to look at a logo can stop the row.
      const pause = () => {
        paused = true
      }
      const resume = () => {
        paused = false
      }

      track.addEventListener('pointerenter', pause)
      track.addEventListener('pointerleave', resume)
      track.addEventListener('focusin', pause)
      track.addEventListener('focusout', resume)
      // The track is wider than the page once doubled: it must not add a
      // horizontal scrollbar of its own.
      track.style.overflow = 'hidden'
      frame = window.requestAnimationFrame(tick)

      return () => {
        window.cancelAnimationFrame(frame)
        track.removeEventListener('pointerenter', pause)
        track.removeEventListener('pointerleave', resume)
        track.removeEventListener('focusin', pause)
        track.removeEventListener('focusout', resume)
        track.style.transform = ''
        track.style.overflow = ''
      }
    })

    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }, [mayAnimate, pathname])

  return null
}

/** Click-and-drag on a horizontal scroll track, for pointers without a wheel tilt. */
export function DragScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const tracks = Array.from(
      document.querySelectorAll<HTMLElement>('[data-draggable="horizontal"]'),
    )

    const cleanups = tracks.map((track) => {
      let pointerId: number | null = null
      let startX = 0
      let startScroll = 0

      const onPointerDown = (event: PointerEvent) => {
        // Never steal a click from a link inside the track.
        if (event.button !== 0 || event.pointerType === 'touch') return

        pointerId = event.pointerId
        startX = event.clientX
        startScroll = track.scrollLeft
        track.style.cursor = 'grabbing'
      }

      const onPointerMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return

        const delta = event.clientX - startX
        if (Math.abs(delta) > 3) track.setPointerCapture(event.pointerId)
        track.scrollLeft = startScroll - delta
      }

      const onPointerUp = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return
        pointerId = null
        track.style.cursor = ''
        if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
      }

      track.addEventListener('pointerdown', onPointerDown)
      track.addEventListener('pointermove', onPointerMove)
      track.addEventListener('pointerup', onPointerUp)
      track.addEventListener('pointercancel', onPointerUp)

      return () => {
        track.removeEventListener('pointerdown', onPointerDown)
        track.removeEventListener('pointermove', onPointerMove)
        track.removeEventListener('pointerup', onPointerUp)
        track.removeEventListener('pointercancel', onPointerUp)
      }
    })

    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }, [pathname])

  return null
}

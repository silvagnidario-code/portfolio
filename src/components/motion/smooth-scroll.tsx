'use client'

import { useEffect } from 'react'

import { useMayAnimate } from './motion-preferences'

/**
 * Lenis, kept in step with ScrollTrigger.
 *
 * Both libraries are loaded dynamically: they are useless to a reader who asked
 * for reduced motion, and this way they are never fetched for one.
 *
 * The two are synchronised through GSAP's ticker rather than through
 * `ScrollTrigger.scrollerProxy`. The proxy exists to teach ScrollTrigger about
 * a *different* scroller — a scrolling `div` — and Lenis here drives the window
 * itself, which ScrollTrigger already measures correctly. What actually matters
 * is that they share one clock and that ScrollTrigger recomputes on every Lenis
 * frame, which is exactly what is wired below; a proxy on top would add an
 * indirection that reports the same numbers.
 */
export function SmoothScroll() {
  const mayAnimate = useMayAnimate()

  useEffect(() => {
    if (!mayAnimate) return

    let dispose = () => {}
    let cancelled = false

    const start = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        // Slow, decelerated, quiet: the same character as the reveals.
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      // One clock: GSAP must not skip frames to "catch up" with Lenis.
      gsap.ticker.lagSmoothing(0)

      dispose = () => {
        lenis.off('scroll', onScroll)
        gsap.ticker.remove(raf)
        gsap.ticker.lagSmoothing(500, 33)
        lenis.destroy()
      }
    }

    void start()

    return () => {
      cancelled = true
      dispose()
    }
  }, [mayAnimate])

  return null
}

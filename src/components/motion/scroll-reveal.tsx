'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { duration, revealDistance, stagger } from '@/tokens/brand'

import { registerRevealEase } from './gsap-ease'
import { useMayAnimate } from './motion-preferences'

/**
 * The one scroll reveal on the site.
 *
 * It is declarative and central: blocks mark themselves with `data-animate`
 * (BlockSection already emits it) and this component finds them. No component
 * animates itself, so there is exactly one place where the timing, the
 * distance and the easing live — and exactly one place to switch off.
 *
 * Elements are *not* hidden in the markup: the hidden state is set from
 * JavaScript, a frame before the trigger is built. Without that, a reader with
 * JavaScript disabled or a bot with no scripting would meet a blank page.
 */
const SELECTOR = '[data-animate="true"]:not([data-revealed])'

export function ScrollReveal() {
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

      const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
      if (targets.length === 0) return

      for (const target of targets) target.dataset.revealed = 'pending'

      gsap.set(targets, { opacity: 0, y: revealDistance.max })

      const triggers = ScrollTrigger.batch(targets, {
        // Enough of the section visible to be worth announcing, not so much
        // that the reveal happens after the reader has already read it.
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: duration.slow / 1000,
            ease,
            stagger: stagger.base / 1000,
            onComplete: () => {
              for (const element of batch) {
                if (element instanceof HTMLElement) element.dataset.revealed = 'true'
              }
            },
          })
        },
      })

      // Anything already on screen at load must not wait for a scroll event.
      ScrollTrigger.refresh()

      dispose = () => {
        for (const trigger of triggers) trigger.kill()
        gsap.set(targets, { clearProps: 'opacity,transform' })
        for (const target of targets) delete target.dataset.revealed
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

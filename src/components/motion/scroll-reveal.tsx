'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { duration, revealBlur, revealDistance, stagger } from '@/tokens/brand'

import { registerRevealEase } from './gsap-ease'
import { useMayAnimate } from './motion-preferences'

/**
 * The scroll reveals — four flavours sharing one clock.
 *
 * It is declarative and central: elements mark themselves in the markup and
 * this component finds them. No component animates itself, so there is
 * exactly one place where the timing, the distances and the easing live —
 * and exactly one place to switch off.
 *
 * `rise` (opacity + a lift) is the original and still the fallback: a
 * `data-animate="true"` section — BlockSection already emits it, gated by
 * the editor's own toggle — that carries no more specific marker inside it
 * reveals as one `rise` unit, exactly as before. An element can instead opt
 * into a treatment that suits what it actually is, with its own
 * `data-reveal`: `rise` on its own (a card, a stat, a list row), `blur` for a
 * photograph settling into focus, `mask` for a banner unveiled edge to edge
 * rather than faded, or `lines` for a heading that rises in one line at a
 * time. All four share the site's one easing, and pull their distances and
 * timings from the same tokens `rise` always used.
 *
 * Elements are *not* hidden in the markup: the hidden state is set from
 * JavaScript, a frame before the trigger is built. Without that, a reader with
 * JavaScript disabled or a bot with no scripting would meet a blank page.
 */
const START = 'top 85%'

export function ScrollReveal() {
  const mayAnimate = useMayAnimate()
  const pathname = usePathname()

  useEffect(() => {
    if (!mayAnimate) return

    let dispose = () => {}
    let cancelled = false

    const start = async () => {
      const [gsapModule, { ScrollTrigger }, customEase, splitTextModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/CustomEase'),
        import('gsap/SplitText'),
      ])

      if (cancelled) return

      const { gsap } = gsapModule
      const { SplitText } = splitTextModule
      gsap.registerPlugin(ScrollTrigger, SplitText)
      const ease = registerRevealEase(gsapModule, customEase)

      const disposers: Array<() => void> = []

      const markRevealed = (batch: Element[]) => {
        for (const element of batch) {
          if (element instanceof HTMLElement) element.dataset.revealed = 'true'
        }
      }

      // `rise`: an explicit `data-reveal="rise"` element, or — the original
      // behaviour — a `data-animate="true"` section with no more specific
      // marker inside it, revealed as one piece.
      const explicitRise = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal="rise"]:not([data-revealed])'),
      )
      const implicitSections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-animate="true"]:not([data-revealed])'),
      ).filter((section) => !section.querySelector('[data-reveal]'))
      const riseTargets = [...explicitRise, ...implicitSections]

      if (riseTargets.length > 0) {
        for (const target of riseTargets) target.dataset.revealed = 'pending'
        gsap.set(riseTargets, { opacity: 0, y: revealDistance.max })

        const triggers = ScrollTrigger.batch(riseTargets, {
          // Enough of the section visible to be worth announcing, not so much
          // that the reveal happens after the reader has already read it.
          start: START,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: duration.slow / 1000,
              ease,
              stagger: stagger.base / 1000,
              onComplete: () => markRevealed(batch),
            })
          },
        })

        disposers.push(() => {
          for (const trigger of triggers) trigger.kill()
          gsap.set(riseTargets, { clearProps: 'opacity,transform' })
          for (const target of riseTargets) delete target.dataset.revealed
        })
      }

      // `blur`: a photograph settling into focus. A shorter lift than
      // `rise` and a tighter stagger — it's meant to read as one grid
      // filling in, not as separate arrivals.
      const blurTargets = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal="blur"]:not([data-revealed])'),
      )

      if (blurTargets.length > 0) {
        for (const target of blurTargets) target.dataset.revealed = 'pending'
        gsap.set(blurTargets, {
          opacity: 0,
          y: revealDistance.min,
          filter: `blur(${revealBlur.max}px)`,
        })

        const triggers = ScrollTrigger.batch(blurTargets, {
          start: START,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: duration.slow / 1000,
              ease,
              stagger: stagger.min / 1000,
              onComplete: () => markRevealed(batch),
            })
          },
        })

        disposers.push(() => {
          for (const trigger of triggers) trigger.kill()
          gsap.set(blurTargets, { clearProps: 'opacity,transform,filter' })
          for (const target of blurTargets) delete target.dataset.revealed
        })
      }

      // `mask`: an edge-to-edge banner unveiled rather than faded in, by a
      // solid curtain sliding off it — see the `[data-reveal="mask"]::after`
      // rule in blocks.css for the curtain itself and why it's a CSS
      // variable driving a pseudo-element rather than a `clip-path`
      // animated directly on the target: the target is very often a video,
      // and clipping a video's own ancestor is what used to flash it black
      // mid-transition.
      const maskTargets = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal="mask"]:not([data-revealed])'),
      )

      if (maskTargets.length > 0) {
        for (const target of maskTargets) target.dataset.revealed = 'pending'
        gsap.set(maskTargets, { '--mask-hidden': 1 })

        const triggers = ScrollTrigger.batch(maskTargets, {
          start: START,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              '--mask-hidden': 0,
              duration: duration.slow / 1000,
              ease,
              stagger: stagger.base / 1000,
              onComplete: () => markRevealed(batch),
            })
          },
        })

        disposers.push(() => {
          for (const trigger of triggers) trigger.kill()
          gsap.set(maskTargets, { clearProps: '--mask-hidden' })
          for (const target of maskTargets) delete target.dataset.revealed
        })
      }

      // `lines`: text split into its own lines and lifted in one at a time.
      // Each heading is its own sequence, triggered independently when it
      // individually crosses the threshold, rather than a batch of separate
      // elements arriving together.
      const lineTargets = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal="lines"]:not([data-revealed])'),
      )

      for (const target of lineTargets) {
        target.dataset.revealed = 'pending'
        const split = SplitText.create(target, { type: 'lines', mask: 'lines' })
        gsap.set(split.lines, { opacity: 0, y: revealDistance.max })

        const trigger = ScrollTrigger.create({
          trigger: target,
          start: START,
          once: true,
          onEnter: () => {
            gsap.to(split.lines, {
              opacity: 1,
              y: 0,
              duration: duration.slow / 1000,
              ease,
              stagger: stagger.min / 1000,
              onComplete: () => {
                target.dataset.revealed = 'true'
              },
            })
          },
        })

        disposers.push(() => {
          trigger.kill()
          split.revert()
          delete target.dataset.revealed
        })
      }

      // Anything already on screen at load must not wait for a scroll event.
      ScrollTrigger.refresh()

      dispose = () => {
        for (const teardown of disposers) teardown()
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

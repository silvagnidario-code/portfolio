'use client'

import { Counters, DragScroll, Marquee } from './enhancements'
import { MagneticCursor } from './magnetic-cursor'
import { ScrollReveal } from './scroll-reveal'
import { SmoothScroll } from './smooth-scroll'

/**
 * Everything that moves, mounted once.
 *
 * All of it reads the same two preferences and all of it imports its libraries
 * dynamically, so a reader who asked for reduced motion downloads neither GSAP
 * nor Lenis nor OGL — the switch is not a flag checked after loading, it is the
 * reason the load never happens.
 */
export function MotionRuntime() {
  return (
    <>
      <SmoothScroll />
      <ScrollReveal />
      <MagneticCursor />
      <Counters />
      <Marquee />
      <DragScroll />
    </>
  )
}

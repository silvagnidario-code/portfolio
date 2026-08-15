'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * The two questions every animated thing on this site has to ask before it
 * moves: does the reader want motion, and do they have a pointer to chase.
 *
 * Answered once, in one place. A component that reads `matchMedia` on its own
 * is a component that will forget to listen for the change event.
 */

type MotionPreferences = {
  /** `prefers-reduced-motion: reduce`. */
  reducedMotion: boolean
  /** `pointer: coarse` — touch, no cursor to replace. */
  coarsePointer: boolean
  /** True once the queries have been read on the client. */
  ready: boolean
}

const defaults: MotionPreferences = { reducedMotion: true, coarsePointer: true, ready: false }

const MotionPreferencesContext = createContext<MotionPreferences>(defaults)

/**
 * Defaults are the conservative answers: until the client has measured, the
 * site behaves as if motion were unwanted and there were no cursor. Guessing
 * the other way would start an animation and then take it away.
 */
export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<MotionPreferences>(defaults)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')

    const read = () =>
      setPreferences({ reducedMotion: reduced.matches, coarsePointer: coarse.matches, ready: true })

    read()
    reduced.addEventListener('change', read)
    coarse.addEventListener('change', read)

    return () => {
      reduced.removeEventListener('change', read)
      coarse.removeEventListener('change', read)
    }
  }, [])

  return <MotionPreferencesContext value={preferences}>{children}</MotionPreferencesContext>
}

export function useMotionPreferences(): MotionPreferences {
  return useContext(MotionPreferencesContext)
}

/** Shorthand for the common case: may this component animate at all? */
export function useMayAnimate(): boolean {
  const { reducedMotion, ready } = useMotionPreferences()
  return ready && !reducedMotion
}

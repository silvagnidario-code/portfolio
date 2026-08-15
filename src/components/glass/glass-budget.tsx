'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

import { glass } from '@/tokens/brand'

/**
 * Counts the glass surfaces alive at the same time.
 *
 * `backdrop-filter` is among the most expensive properties in CSS, and on this
 * site it shares the frame with smooth scroll and a WebGL canvas. The
 * specification caps simultaneous glass elements at four; this makes going over
 * the cap loud instead of invisible.
 */

type GlassBudgetValue = {
  claim: () => () => void
  limit: number
}

const GlassBudgetContext = createContext<GlassBudgetValue | null>(null)

type ProviderProps = {
  children: ReactNode
  /**
   * Only the styleguide raises this, to display every variant over every test
   * backdrop at once. The site itself always runs on the default.
   */
  limit?: number
  label?: string
}

export function GlassBudgetProvider({
  children,
  limit = glass.maxSimultaneous,
  label = 'page',
}: ProviderProps) {
  const [value] = useState<GlassBudgetValue>(() => {
    let live = 0

    return {
      limit,
      claim: () => {
        live += 1

        if (live > limit) {
          console.error(
            `Glass budget exceeded in ${label}: ${live} surfaces mounted, limit is ${limit}. ` +
              `backdrop-filter is expensive enough that this is a rendering cost, not a style choice.`,
          )
        }

        return () => {
          live -= 1
        }
      },
    }
  })

  return <GlassBudgetContext value={value}>{children}</GlassBudgetContext>
}

/** Claims one slot for as long as the calling component is mounted. */
export function useGlassBudget(): void {
  const budget = useContext(GlassBudgetContext)
  const claimed = useRef(false)

  useEffect(() => {
    if (!budget || claimed.current) return

    claimed.current = true
    const release = budget.claim()

    return () => {
      claimed.current = false
      release()
    }
  }, [budget])
}

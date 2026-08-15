'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Page transition: a slow dissolve with a short translation, §8.
 *
 * Keyed on the pathname, so React remounts the subtree on every navigation and
 * the entry animation runs again. The animation itself lives in CSS — it uses
 * the shared easing and the reveal distance from the tokens, and the global
 * `prefers-reduced-motion` rule flattens it with everything else.
 *
 * Only the incoming half is animated here. Coordinating the outgoing half with
 * the View Transitions API needs the router-level hook that arrives with the
 * animation system in phase 8; `@view-transition` is already declared in the
 * stylesheet, so a cross-document navigation gets the dissolve today.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    // `tabIndex={-1}` lets the skip link move focus here, not just the scroll.
    <div key={pathname} id="main" tabIndex={-1} className="page-enter pt-128">
      {children}
    </div>
  )
}

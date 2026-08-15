import type { ReactNode } from 'react'

export type BlockSettings = {
  background?: ('paper' | 'sumi' | 'accent') | null
  spacing?: ('compact' | 'normal' | 'wide') | null
  animate?: boolean | null
} | null

/**
 * The frame every block sits in.
 *
 * Background, vertical rhythm and the animation flag are resolved once here
 * rather than in eleven components — that is what makes them common properties
 * instead of a convention. `data-animate` is read by the scroll reveal in phase
 * 8; nothing moves yet.
 */
export function BlockSection({
  settings,
  children,
  className,
  labelledBy,
}: {
  settings: BlockSettings
  children: ReactNode
  className?: string
  labelledBy?: string
}) {
  return (
    <section
      data-background={settings?.background ?? 'paper'}
      data-spacing={settings?.spacing ?? 'normal'}
      data-animate={settings?.animate ? 'true' : 'false'}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  )
}

/**
 * The page grid, 12/6/4. Blocks align to it and then break the balance on
 * purpose: a heading on columns 2-7 with 8-12 left empty is the norm here, not
 * the exception.
 */
export function BlockGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`page-grid ${className ?? ''}`}>{children}</div>
}

/** Eyebrow: monospaced, uppercase, wide tracking. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-caption uppercase text-ink-muted">{children}</p>
}

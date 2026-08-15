'use client'

import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'

import type { GlassVariant } from '@/tokens/glass'

import { useGlassBudget } from './glass-budget'

/**
 * The single implementation of the glass material.
 *
 * Every translucent element on the site goes through here: navbar, language and
 * theme switchers, filter pills on the work index, lightbox chrome, the
 * floating CTA. No other component may reimplement it — the three layers,
 * the opacity floor that keeps text at AA, the fallback and the cost budget all
 * live in one place precisely so they cannot be forgotten one element at a time.
 *
 * Content blocks stay opaque and flat: the interface is glass, the content is
 * paper.
 */

type GlassElement = 'div' | 'nav' | 'header' | 'aside' | 'span' | 'section'

type GlassSurfaceProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  variant?: GlassVariant
  /** Element to render. Pick the one the surface means, not a div by default. */
  as?: GlassElement
  children?: ReactNode
  /** The cursor needs a handle to move the surface every frame. */
  ref?: Ref<HTMLDivElement>
}

export function GlassSurface({
  variant = 'chrome',
  as: Tag = 'div',
  className,
  children,
  ref,
  ...rest
}: GlassSurfaceProps) {
  useGlassBudget()

  return (
    <Tag
      ref={ref}
      className={['glass', `glass--${variant}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  )
}

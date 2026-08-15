import { glass, grey } from './brand'
import { compositeOver, contrastRatio, requiredRatio } from './contrast'
import { semanticColors, type ThemeName } from './semantic'

/**
 * The glass layer, level 2.
 *
 * The one value that cannot be chosen freely here is the fill opacity. Glass
 * text sits on whatever happens to scroll underneath it, so its real contrast
 * is measured against the fill *composited over that backdrop* — and the worst
 * case is not a photograph, it is pure white under the dark theme and pure
 * black under the light one.
 *
 * So the minimum is computed from the palette rather than declared, and the
 * token generator refuses to emit a fill that sits below it. This is the point
 * the specification calls out as the one where glass breaks accessibility: it
 * is blocked by construction, not sampled.
 */

/**
 * The extremes any backdrop can reach. Nothing is brighter or darker, so a fill
 * that holds AA over both holds it over every photograph that will ever scroll
 * under it. The styleguide paints its test backdrops with the same two values.
 */
export const WORST_CASE_BACKDROPS = ['#FFFFFF', '#000000'] as const

/**
 * The three places glass is allowed to appear. Declared here rather than in the
 * component so server components can read the list: values exported from a
 * 'use client' module arrive as client references, not as data.
 */
export const glassVariants = ['navbar', 'pill', 'chrome'] as const

export type GlassVariant = (typeof glassVariants)[number]

/** Floor stated by the specification, independent of the palette. */
export const SPEC_MIN_FILL_OPACITY = 0.55

/** Text on glass is body copy: AA asks for 4.5. */
const GLASS_TEXT_RATIO = requiredRatio('text') ?? 4.5

/**
 * Smallest opacity at which `fg-primary` still holds AA over every possible
 * backdrop, to three decimals.
 */
export function requiredFillOpacity(theme: ThemeName): number {
  const foreground = semanticColors[theme]['fg-primary']
  const fill = glass.fill[theme]

  for (let alpha = 0.3; alpha <= 1; alpha += 0.001) {
    const holds = WORST_CASE_BACKDROPS.every(
      (backdrop) =>
        contrastRatio(foreground, compositeOver(fill, backdrop, alpha)) >= GLASS_TEXT_RATIO,
    )

    if (holds) return Math.ceil(alpha * 1000) / 1000
  }

  return 1
}

/**
 * Chosen opacities, pushed as close to the floor as the measurement allows —
 * a thinner fill is what makes glass read as glass.
 *
 * Light sits at the bottom of the 60–70% the specification asks for.
 *
 * Dark does not: the specification asks for 45–55%, but its own AA rule makes
 * that impossible — over a white backdrop the dark fill needs 0.63 before
 * `fg-primary` reaches 4.5:1. The accessibility rule is the one described as
 * non-negotiable, so it wins, and the value carries a small margin over the
 * computed floor.
 */
export const fillOpacity: Record<ThemeName, number> = {
  light: 0.6,
  dark: 0.65,
}

/**
 * The specular edge. The highlight is always the paper tint and the shade
 * always the ink one, whatever the theme: light falls on the top corner of a
 * pane from above in both.
 */
export const glassLift: Record<ThemeName, string> = {
  light: `0 ${glass.lift.light.y}px ${glass.lift.light.blur}px ${glass.lift.light.spread}px ${withAlpha(grey.sumi900, glass.lift.light.alpha)}`,
  dark: `0 ${glass.lift.dark.y}px ${glass.lift.dark.blur}px ${glass.lift.dark.spread}px ${withAlpha(grey.sumi950, glass.lift.dark.alpha)}`,
}

export const glassEdges: Record<ThemeName, { highlight: string; shade: string; border: string }> = {
  light: {
    highlight: withAlpha(grey.paper50, glass.edge.light.highlight),
    shade: withAlpha(grey.sumi900, glass.edge.light.shade),
    border: withAlpha(grey.sumi900, glass.edge.light.border),
  },
  dark: {
    highlight: withAlpha(grey.paper50, glass.edge.dark.highlight),
    shade: withAlpha(grey.sumi950, glass.edge.dark.shade),
    border: withAlpha(grey.paper50, glass.edge.dark.border),
  },
}

export type GlassAudit = {
  theme: ThemeName
  backdrop: string
  composite: string
  ratio: number
  passes: boolean
}

/** Every worst case, measured. Rendered on the styleguide, checked at build. */
export function auditGlass(): GlassAudit[] {
  return (['light', 'dark'] as const).flatMap((theme) =>
    WORST_CASE_BACKDROPS.map((backdrop) => {
      const composite = compositeOver(glass.fill[theme], backdrop, fillOpacity[theme])
      const ratio = contrastRatio(semanticColors[theme]['fg-primary'], composite)

      return { theme, backdrop, composite, ratio, passes: ratio >= GLASS_TEXT_RATIO }
    }),
  )
}

/** Throws rather than emitting CSS that would let glass break AA. */
export function assertFillOpacities(): void {
  for (const theme of ['light', 'dark'] as const) {
    const chosen = fillOpacity[theme]
    const computed = requiredFillOpacity(theme)
    const floor = Math.max(computed, SPEC_MIN_FILL_OPACITY)

    if (chosen < floor) {
      throw new Error(
        `Glass fill for the ${theme} theme is ${chosen}, below the ${floor} needed to keep AA ` +
          `(palette floor ${computed}, spec floor ${SPEC_MIN_FILL_OPACITY}). ` +
          `Raise it in tokens/glass.ts or lighten fg-primary.`,
      )
    }
  }
}

/** `rgb(... / alpha)` string for a hex colour, for the generated CSS. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16))

  return `rgb(${channels.join(' ')} / ${alpha})`
}

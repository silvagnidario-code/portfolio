import { accent, grey } from './brand'

/**
 * LEVEL 2 — SEMANTIC
 *
 * Role names, one value per theme. This module is the single source of truth
 * for `src/styles/tokens.generated.css` (see `scripts/generate-tokens.ts`) and
 * for the contrast checks on the styleguide, so what the page verifies and
 * what the browser paints can never drift apart.
 *
 * Components never read this file: they read the CSS custom properties.
 */

export const colorRoles = [
  'bg-primary',
  'bg-secondary',
  'bg-inverse',
  'fg-primary',
  'fg-secondary',
  'fg-muted',
  'fg-inverse',
  'border-subtle',
  'border-strong',
  'accent',
  'accent-fg',
] as const

export type ColorRole = (typeof colorRoles)[number]

export type ThemeName = 'light' | 'dark'

export const semanticColors: Record<ThemeName, Record<ColorRole, string>> = {
  light: {
    'bg-primary': grey.paper100,
    'bg-secondary': grey.paper200,
    'bg-inverse': grey.sumi900,
    'fg-primary': grey.sumi900,
    'fg-secondary': grey.clay700,
    'fg-muted': grey.clay600,
    'fg-inverse': grey.paper100,
    'border-subtle': grey.paper300,
    'border-strong': grey.clay500,
    accent: accent.onLight,
    'accent-fg': accent.fgOnLight,
  },
  dark: {
    'bg-primary': grey.sumi950,
    'bg-secondary': grey.sumi850,
    'bg-inverse': grey.paper100,
    'fg-primary': grey.ink100,
    'fg-secondary': grey.ink200,
    'fg-muted': grey.ink300,
    'fg-inverse': grey.sumi950,
    'border-subtle': grey.sumi800,
    'border-strong': grey.clay500,
    accent: accent.onDark,
    'accent-fg': accent.fgOnDark,
  },
}

/**
 * LEVEL 3 — COMPONENT
 *
 * Tailwind utility name → semantic role. Components write `bg-surface` or
 * `text-ink-muted`; they never touch a primitive and never write a literal.
 * Consumed both by the CSS generator and by the styleguide, so the documented
 * mapping and the generated one cannot diverge.
 */
export const colorAliases = {
  surface: 'bg-primary',
  'surface-2': 'bg-secondary',
  'surface-inverse': 'bg-inverse',
  ink: 'fg-primary',
  'ink-2': 'fg-secondary',
  'ink-muted': 'fg-muted',
  'ink-inverse': 'fg-inverse',
  line: 'border-subtle',
  'line-strong': 'border-strong',
  accent: 'accent',
  'accent-ink': 'accent-fg',
} as const satisfies Record<string, ColorRole>

export type ColorAlias = keyof typeof colorAliases

/**
 * Pairs that must hold contrast, checked on both themes by the styleguide.
 * `large` marks text rendered at 24px+ (or 19px+ bold), where AA is 3:1;
 * `nonText` marks meaningful borders and controls, where AA is 3:1 too;
 * `decorative` is measured and shown but carries no requirement.
 */
export type ContrastPair = {
  foreground: ColorRole
  background: ColorRole
  kind: 'text' | 'large' | 'nonText' | 'decorative'
}

export const contrastPairs: readonly ContrastPair[] = [
  { foreground: 'fg-primary', background: 'bg-primary', kind: 'text' },
  { foreground: 'fg-primary', background: 'bg-secondary', kind: 'text' },
  { foreground: 'fg-secondary', background: 'bg-primary', kind: 'text' },
  { foreground: 'fg-secondary', background: 'bg-secondary', kind: 'text' },
  { foreground: 'fg-muted', background: 'bg-primary', kind: 'text' },
  { foreground: 'fg-muted', background: 'bg-secondary', kind: 'text' },
  { foreground: 'accent', background: 'bg-primary', kind: 'text' },
  { foreground: 'accent', background: 'bg-secondary', kind: 'text' },
  { foreground: 'accent-fg', background: 'accent', kind: 'text' },
  { foreground: 'fg-inverse', background: 'bg-inverse', kind: 'text' },
  { foreground: 'border-strong', background: 'bg-primary', kind: 'nonText' },
  { foreground: 'border-strong', background: 'bg-secondary', kind: 'nonText' },
  { foreground: 'border-subtle', background: 'bg-primary', kind: 'decorative' },
] as const

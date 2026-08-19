/**
 * Theme contract, shared by the no-flash script, the provider and the switcher.
 *
 * Three states, not two: `system` follows `prefers-color-scheme`, `light` and
 * `dark` are explicit choices that override it in both directions.
 */

export const THEME_STORAGE_KEY = 'theme'

/** Attribute set on <html>. The generated CSS keys its overrides off this. */
export const THEME_ATTRIBUTE = 'data-theme'

export const themeModes = ['system', 'light', 'dark'] as const

export type ThemeMode = (typeof themeModes)[number]

export const defaultThemeMode: ThemeMode = 'system'

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (themeModes as readonly string[]).includes(value)
}

/**
 * Applies the resolved light/dark value directly, always as an explicit
 * attribute. `system` is never applied as "no attribute": leaving it unset
 * makes the visible theme depend on a native `prefers-color-scheme` CSS
 * fallback, which can go out of sync with what React believes is showing
 * across a route change. Setting it explicitly, every time, removes that gap.
 */
export function applyResolvedTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, resolved)
}

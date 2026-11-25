/**
 * Theme contract, shared by the no-flash script, the provider and the switcher.
 *
 * Three states, not two: `system` is "no explicit choice yet", `light` and
 * `dark` are explicit choices the reader made. `system` no longer means
 * "follow prefers-color-scheme" — a first-time visitor lands on
 * `DEFAULT_RESOLVED_THEME` regardless of their OS setting, and stays there
 * until they pick a mode themselves via the switcher.
 */

export const THEME_STORAGE_KEY = 'theme'

/** Attribute set on <html>. The generated CSS keys its overrides off this. */
export const THEME_ATTRIBUTE = 'data-theme'

export const themeModes = ['system', 'light', 'dark'] as const

export type ThemeMode = (typeof themeModes)[number]

export const defaultThemeMode: ThemeMode = 'system'

/** What a reader with no stored preference sees on their first visit. */
export const DEFAULT_RESOLVED_THEME: 'light' | 'dark' = 'dark'

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

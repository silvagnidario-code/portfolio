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

/** Applies a mode to the document. `system` means: no attribute at all. */
export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement

  if (mode === 'system') {
    root.removeAttribute(THEME_ATTRIBUTE)
  } else {
    root.setAttribute(THEME_ATTRIBUTE, mode)
  }
}

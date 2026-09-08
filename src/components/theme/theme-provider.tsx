'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import {
  applyResolvedTheme,
  DEFAULT_RESOLVED_THEME,
  defaultThemeMode,
  isThemeMode,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/lib/theme'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  /**
   * What the reader is actually looking at. `mode` can be `system`, which is
   * not a colour — a control that offers light and dark needs to know which of
   * the two the system resolved to.
   */
  resolved: 'light' | 'dark'
  /** False until the stored preference has been read on the client. */
  ready: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultThemeMode)
  const [ready, setReady] = useState(false)

  // The document attribute is already correct at this point: the inline script
  // in <head> set it. This only syncs the React state with what was stored.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (isThemeMode(stored)) {
        setModeState(stored)
      }
    } catch {
      // Storage unavailable (private mode, blocked cookies): stay on the default.
    }
    setReady(true)
  }, [])

  // `system` means "no explicit choice yet", which resolves to the site
  // default rather than the reader's OS preference — see DEFAULT_RESOLVED_THEME.
  const resolved: 'light' | 'dark' = mode === 'system' ? DEFAULT_RESOLVED_THEME : mode

  // The single source of truth for what is painted. Re-applied on every
  // render of `resolved` — mount, a route change, or an explicit choice — so
  // the attribute can never drift from what React believes is showing.
  useEffect(() => {
    applyResolvedTheme(resolved)
  }, [resolved])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)

    try {
      if (next === defaultThemeMode) {
        window.localStorage.removeItem(THEME_STORAGE_KEY)
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, next)
      }
    } catch {
      // Preference simply does not persist.
    }
  }, [])

  return <ThemeContext value={{ mode, setMode, resolved, ready }}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}

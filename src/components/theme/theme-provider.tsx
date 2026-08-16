'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import {
  applyThemeMode,
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
  const [systemDark, setSystemDark] = useState(false)
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
      // Storage unavailable (private mode, blocked cookies): stay on system.
    }
    setReady(true)
  }, [])

  // The system preference can change while the page is open.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const read = () => setSystemDark(query.matches)

    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    applyThemeMode(next)

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

  const resolved: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  return <ThemeContext value={{ mode, setMode, resolved, ready }}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}

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
      // Storage unavailable (private mode, blocked cookies): stay on system.
    }
    setReady(true)
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

  return <ThemeContext value={{ mode, setMode, ready }}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}

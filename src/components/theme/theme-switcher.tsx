'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'

import { themeModes } from '@/lib/theme'

import { useTheme } from './theme-provider'

/**
 * Three real radio inputs rather than a cycling button: the three states are
 * visible at once and the whole control is reachable with the keyboard by
 * default. The glass styling arrives in phase 5 — this is the mechanism.
 */
export function ThemeSwitcher() {
  const t = useTranslations('Theme')
  const { mode, setMode, ready } = useTheme()
  const name = useId()

  return (
    <fieldset className="border border-line p-16">
      <legend className="text-caption font-mono uppercase text-ink-muted px-8">
        {t('legend')}
      </legend>
      <div className="flex gap-24">
        {themeModes.map((value) => (
          <label key={value} className="flex items-center gap-8 text-body">
            <input
              type="radio"
              name={name}
              value={value}
              checked={mode === value}
              disabled={!ready}
              onChange={() => setMode(value)}
              className="accent-accent"
            />
            {t(value)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

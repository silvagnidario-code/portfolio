'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'

import { themeModes } from '@/lib/theme'

import { useTheme } from './theme-provider'

/**
 * Three real radio inputs rather than a cycling button: the three states are
 * visible at once, the group is one tab stop with arrow keys inside it, and the
 * current state is announced without any ARIA of our own.
 *
 * It renders on the navbar's glass, so it is not a glass surface itself:
 * blurring a backdrop that is already blurred costs a second expensive layer
 * and reads as a smudge.
 */
export function ThemeSwitcher() {
  const t = useTranslations('Theme')
  const { mode, setMode, ready } = useTheme()
  const name = useId()

  return (
    <fieldset className="flex items-center gap-4" disabled={!ready}>
      <legend className="sr-only">{t('legend')}</legend>

      {themeModes.map((value) => (
        <label
          key={value}
          className="cursor-pointer rounded-glass-sm px-12 py-8 font-mono text-caption uppercase text-ink-muted transition ease-reveal duration-fast hover:text-ink has-[:checked]:bg-ink has-[:checked]:text-ink-inverse has-[:focus-visible]:focus-ring"
        >
          <input
            type="radio"
            name={name}
            value={value}
            checked={mode === value}
            onChange={() => setMode(value)}
            className="sr-only"
          />
          {t(value)}
        </label>
      ))}
    </fieldset>
  )
}

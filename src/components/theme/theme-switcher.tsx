'use client'

import { useTranslations } from 'next-intl'
import { useId, type ComponentType, type SVGProps } from 'react'

import { AutoIcon, MoonIcon, SunIcon } from '@/components/icons'
import { themeModes, type ThemeMode } from '@/lib/theme'

import { useTheme } from './theme-provider'

/**
 * Three icons, three radio inputs.
 *
 * The icons carry the meaning to the eye; the input carries it to everything
 * else. Each label keeps its word in a visually hidden span, so the control is
 * announced as "Chiaro, radio button" rather than as an unnamed graphic, and
 * the group stays one tab stop with arrow keys inside it.
 *
 * Never disabled: a disabled fieldset greys its labels below AA and takes them
 * out of the tab order, and before hydration the checked value is the default
 * anyway, so an early click changes nothing.
 *
 * It renders on the navbar's glass, so it is not a glass surface itself:
 * blurring a backdrop that is already blurred costs a second expensive layer
 * and reads as a smudge.
 */
const icons: Record<ThemeMode, ComponentType<SVGProps<SVGSVGElement>>> = {
  system: AutoIcon,
  light: SunIcon,
  dark: MoonIcon,
}

export function ThemeSwitcher() {
  const t = useTranslations('Theme')
  const { mode, setMode } = useTheme()
  const name = useId()

  return (
    <fieldset className="flex items-center gap-4">
      <legend className="sr-only">{t('legend')}</legend>

      {themeModes.map((value) => {
        const Glyph = icons[value]

        return (
          <label
            key={value}
            title={t(value)}
            className="flex cursor-pointer items-center rounded-glass-sm p-8 text-ink-muted transition ease-reveal duration-fast hover:text-ink has-[:checked]:bg-ink has-[:checked]:text-ink-inverse has-[:focus-visible]:focus-ring"
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={mode === value}
              onChange={() => setMode(value)}
              className="sr-only"
            />
            <Glyph />
            <span className="sr-only">{t(value)}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

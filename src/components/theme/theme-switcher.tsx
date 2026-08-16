'use client'

import { useTranslations } from 'next-intl'
import { useId, type ComponentType, type SVGProps } from 'react'

import { MoonIcon, SunIcon } from '@/components/icons'
import type { ThemeMode } from '@/lib/theme'

import { useTheme } from './theme-provider'

/**
 * Two icons, two radio inputs: light and dark.
 *
 * `system` is still the starting state — nothing is stored until the reader
 * picks — but it is not offered as a third button. What the control shows is
 * the theme the reader is *looking at*: with no choice made, that is whatever
 * the operating system resolved to, and picking either icon simply makes it
 * explicit.
 *
 * The icons carry the meaning to the eye; the inputs carry it to everything
 * else, and each label keeps its word in a visually hidden span so the control
 * is announced by name rather than as an unnamed graphic.
 *
 * It renders on the navbar's glass, so it is not a glass surface itself:
 * blurring a backdrop that is already blurred costs a second expensive layer
 * and reads as a smudge.
 */
const choices = ['light', 'dark'] as const satisfies ReadonlyArray<ThemeMode>

const icons: Record<(typeof choices)[number], ComponentType<SVGProps<SVGSVGElement>>> = {
  light: SunIcon,
  dark: MoonIcon,
}

export function ThemeSwitcher() {
  const t = useTranslations('Theme')
  const { resolved, setMode } = useTheme()
  const name = useId()

  return (
    <fieldset className="flex items-center gap-4">
      <legend className="sr-only">{t('legend')}</legend>

      {choices.map((value) => {
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
              checked={resolved === value}
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

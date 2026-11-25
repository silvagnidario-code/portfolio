'use client'

import { useTranslations } from 'next-intl'

import { MoonIcon, SunIcon } from '@/components/icons'

import { useTheme } from './theme-provider'

/**
 * One round button, one icon: it shows where a click takes you. On the dark
 * default that is the sun (switch to light); on light it is the moon.
 *
 * Until the stored preference has been read the button renders the default's
 * icon, which is what the inline theme script painted too, so nothing flips
 * on hydration for a reader with no stored choice.
 */
export function ThemeSwitcher() {
  const t = useTranslations('Theme')
  const { resolved, setMode } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'
  const Glyph = resolved === 'dark' ? SunIcon : MoonIcon
  const label = t(next === 'light' ? 'switchToLight' : 'switchToDark')

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={label}
      title={label}
      className="grid size-[2.75rem] shrink-0 place-items-center rounded-full border border-line text-ink transition ease-reveal duration-fast hover:border-line-strong hover:bg-surface-2"
    >
      <Glyph aria-hidden="true" />
    </button>
  )
}

import { defineRouting } from 'next-intl/routing'

export const locales = ['it', 'en', 'zh'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

/**
 * How each language calls itself.
 *
 * Deliberately not in the translation files: a language menu that renames the
 * languages into the language you are already reading is useless to the one
 * person who needs it — someone who does not read that language and is looking
 * for their own. These stay identical whatever locale is active.
 */
export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  zh: '中文',
}

/**
 * The locale prefix is always explicit, including for the default locale
 * (`/it/...`), so every URL has exactly one canonical form.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Detected from `Accept-Language` on the first visit, then persisted.
  localeDetection: true,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
})

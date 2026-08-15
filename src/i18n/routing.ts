import { defineRouting } from 'next-intl/routing'

export const locales = ['it', 'en', 'zh'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

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

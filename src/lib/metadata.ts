import type { Metadata } from 'next'

import { routing, type Locale } from '@/i18n/routing'

import { env } from './env'

/**
 * Reciprocal `hreflang`, §9.
 *
 * Every page declares every language including itself, plus an `x-default`
 * pointing at the default locale — that reciprocity is the part search engines
 * check, and a one-way declaration is worse than none.
 *
 * Paths are given without the locale prefix, exactly as the router takes them.
 */

const absolute = (locale: string, path: string): string =>
  `${env.NEXT_PUBLIC_SERVER_URL}/${locale}${path === '/' ? '' : path}`

export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  return {
    canonical: absolute(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((code) => [code, absolute(code, path)])),
      'x-default': absolute(routing.defaultLocale, path),
    },
  }
}

/** Same, when the path itself differs per language (localized slugs). */
export function alternatesForPaths(
  paths: Partial<Record<Locale, string>>,
  locale: Locale,
  fallbackPath: string,
): Metadata['alternates'] {
  const languages = Object.fromEntries(
    routing.locales
      .filter((code) => paths[code])
      .map((code) => [code, absolute(code, paths[code]!)]),
  )

  return {
    canonical: absolute(locale, paths[locale] ?? fallbackPath),
    languages: {
      ...languages,
      'x-default': absolute(routing.defaultLocale, paths[routing.defaultLocale] ?? fallbackPath),
    },
  }
}

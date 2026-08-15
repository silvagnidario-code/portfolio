'use client'

import { useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { locales } from '@/i18n/routing'

/**
 * Switches language keeping the reader where they are.
 *
 * `usePathname` returns the path without the locale prefix, so the link is the
 * same page in another language — as long as the segments are the same in both.
 * Case-study slugs are localized, so those pages will hand this component an
 * explicit alternates map when they arrive in phase 7; until then the fallback
 * is correct for every route that exists.
 */
export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const t = useTranslations('Layout')
  const tLocales = useTranslations('Locales')

  return (
    <nav aria-label={t('localeLabel')} className="flex items-center gap-4">
      {locales.map((code) => {
        const isCurrent = code === locale

        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={tLocales(code)}
            className={`rounded-glass-sm px-12 py-8 font-mono text-caption uppercase transition ease-reveal duration-fast ${
              isCurrent ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {code}
          </Link>
        )
      })}
    </nav>
  )
}

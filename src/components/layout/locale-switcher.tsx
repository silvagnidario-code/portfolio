'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Link, usePathname } from '@/i18n/navigation'
import { locales } from '@/i18n/routing'

/**
 * Switches language keeping the reader where they are.
 *
 * For most routes the path is the same in every language, so `usePathname` —
 * which strips the locale prefix — is the whole answer. Case-study slugs are
 * localized, and those pages already declare their translations as `hreflang`
 * links for crawlers: rather than duplicating that map through a second
 * channel, the switcher reads it back from the document. One declaration, two
 * consumers.
 */
function useAlternatePaths(pathname: string): Record<string, string> {
  const [alternates, setAlternates] = useState<Record<string, string>>({})

  useEffect(() => {
    const found: Record<string, string> = {}

    for (const link of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
      const code = link.getAttribute('hreflang')
      const href = link.getAttribute('href')
      if (!code || !href || code === 'x-default') continue

      try {
        // Strip origin and locale prefix: the router adds them back.
        const path = new URL(href, window.location.origin).pathname.replace(`/${code}`, '')
        found[code] = path || '/'
      } catch {
        // A malformed alternate is worth ignoring, not crashing over.
      }
    }

    setAlternates(found)
  }, [pathname])

  return alternates
}

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const alternates = useAlternatePaths(pathname)
  const t = useTranslations('Layout')
  const tLocales = useTranslations('Locales')

  return (
    <nav aria-label={t('localeLabel')} className="flex items-center gap-4">
      {locales.map((code) => {
        const isCurrent = code === locale

        return (
          <Link
            key={code}
            href={alternates[code] ?? pathname}
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

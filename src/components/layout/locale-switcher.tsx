'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import { CheckIcon, GlobeIcon } from '@/components/icons'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, localeNames, type Locale } from '@/i18n/routing'

/**
 * Switches language keeping the reader where they are.
 *
 * A globe opens the list; the languages themselves are named, not iconised. A
 * flag is a country and several countries share a language — the only honest
 * icon for "language" is the one that means all of them.
 *
 * Each language is written in itself — Italiano, English, 中文 — and stays that
 * way whatever locale is active. Translating the list into the language the
 * reader is already reading is useless to the only person who needs it: the one
 * who does not read it and is looking for their own.
 *
 * For most routes the path is identical in every language, so `usePathname` —
 * which strips the locale prefix — is the whole answer. Case-study slugs are
 * localized, and those pages already declare their translations as `hreflang`
 * links for crawlers: the switcher reads that same declaration back from the
 * document rather than carrying a second copy of the map.
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

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const alternates = useAlternatePaths(pathname)
  const t = useTranslations('Layout')

  const [open, setOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  // A navigation closes the menu; without this it survives the route change.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t('localeLabel')}: ${localeNames[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-8 rounded-glass-sm px-12 py-8 text-ink-2 transition ease-reveal duration-fast hover:text-ink"
      >
        <GlobeIcon />
        <span className="font-mono text-caption uppercase">{locale}</span>
      </button>

      <ul
        id={menuId}
        hidden={!open}
        className="absolute left-0 z-50 mt-8 min-w-[12rem] rounded-glass-sm border border-line bg-surface p-8 shadow-lg tablet:left-auto tablet:right-0"
      >
        {locales.map((code) => {
          const isCurrent = code === locale

          return (
            <li key={code}>
              <Link
                href={alternates[code] ?? pathname}
                locale={code}
                hrefLang={code}
                aria-current={isCurrent ? 'true' : undefined}
                className={`flex items-center justify-between gap-16 rounded-glass-sm px-12 py-8 text-body transition ease-reveal duration-fast hover:bg-surface-2 ${
                  isCurrent ? 'text-ink' : 'text-ink-2'
                }`}
              >
                {localeNames[code]}
                {isCurrent ? <CheckIcon width={16} height={16} /> : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

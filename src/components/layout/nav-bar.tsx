'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'
import { GlassSurface } from '@/components/glass/glass-surface'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Link, usePathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { LocaleSwitcher } from './locale-switcher'

export type NavItem = {
  label: string
  href: string
  external: boolean
}

type NavBarProps = {
  locale: Locale
  wordmark: string
  logo?: {
    url: string
    width?: number
    height?: number
  } | null
  items: NavItem[]
}

/**
 * The sticky navbar: one glass surface, floating over the content.
 *
 * Everything inside it — links, switchers — sits on that single surface rather
 * than carrying its own. Nesting glass inside glass doubles the most expensive
 * property in the stylesheet and reads as a smudge, and the specification caps
 * simultaneous glass elements at four for exactly that reason.
 */
export function NavBar({ locale, wordmark, logo, items }: NavBarProps) {
  const t = useTranslations('Layout')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const links = items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
      {item.external ? (
        <a
          href={item.href}
          rel="noreferrer"
          target="_blank"
          className="block px-12 py-8 text-body text-ink-2 transition ease-reveal duration-fast hover:text-ink"
        >
          {item.label}
        </a>
      ) : (
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={`block px-12 py-8 text-body transition ease-reveal duration-fast hover:text-ink ${
            pathname === item.href ? 'text-ink' : 'text-ink-2'
          }`}
        >
          {item.label}
        </Link>
      )}
    </li>
  ))

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 page-margin pt-24">
      <GlassSurface
        as="nav"
        variant="navbar"
        className="glass--refract pointer-events-auto flex flex-col gap-16 px-24 py-16 tablet:flex-row tablet:items-center tablet:justify-between"
      >
        <div className="flex items-center justify-between gap-24">
          <Link href="/" className="flex items-center">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={wordmark}
                width={logo.width ?? 120}
                height={logo.height ?? 32}
                className="h-32 w-auto tablet:h-40 desktop:h-48"
                priority
              />
            ) : (
              <span className="font-mono text-caption uppercase text-ink">{wordmark}</span>
            )}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
            className="rounded-glass-sm px-12 py-8 font-mono text-caption uppercase text-ink transition ease-reveal duration-fast tablet:hidden"
          >
            {open ? t('menuClose') : t('menuOpen')}
          </button>
        </div>
        <div
          id={menuId}
          className={`flex-col gap-16 tablet:flex tablet:flex-row tablet:items-center tablet:gap-24 ${
            open ? 'flex' : 'hidden'
          }`}
        >
          <ul
            aria-label={t('menuLabel')}
            className="flex flex-col gap-4 tablet:flex-row tablet:items-center"
          >
            {links}
          </ul>
          <div className="flex flex-wrap items-center gap-16">
            <LocaleSwitcher locale={locale} />
            <ThemeSwitcher />
          </div>
        </div>
      </GlassSurface>
    </header>
  )
}

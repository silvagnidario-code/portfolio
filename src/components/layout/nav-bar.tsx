'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'
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
 * The header: a full-width bar that sticks to the top of the viewport and
 * stays in the document flow, so nothing below it has to guess its height.
 *
 * Small monospaced links, the language and theme controls, and one filled
 * call to action that is always within reach. The bar is translucent with a
 * backdrop blur; the blur is a single, cheap layer on a thin strip, never on
 * content.
 *
 * Below the tablet breakpoint the links and controls fold into a panel that
 * opens under the bar; Escape and any navigation close it.
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

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const link = (item: NavItem, variant: 'bar' | 'panel') => {
    const base =
      variant === 'bar'
        ? 'link-underline block py-12 font-mono text-caption uppercase'
        : 'block border-b border-line py-16 text-h3'
    const current = !item.external && isCurrent(item.href)

    return item.external ? (
      <a
        href={item.href}
        rel="noreferrer"
        target="_blank"
        className={`${base} text-ink-2 hover:text-ink`}
      >
        {item.label} ↗
      </a>
    ) : (
      <Link
        href={item.href}
        aria-current={current ? 'page' : undefined}
        className={`${base} transition ease-reveal duration-fast hover:text-ink ${
          current ? 'text-ink' : 'text-ink-2'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  const contact = (
    <Link
      href="/contact"
      className="inline-flex min-h-[2.75rem] items-center bg-ink px-16 font-mono text-caption uppercase text-surface transition ease-reveal duration-fast hover:bg-accent hover:text-accent-ink"
    >
      {t('contactCta')}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <nav
        aria-label={t('menuLabel')}
        className="page-margin flex min-h-[4.25rem] items-center justify-between gap-24"
      >
        <Link
          href="/"
          aria-label={wordmark}
          className="flex min-h-[2.75rem] shrink-0 items-center gap-12"
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt=""
              width={logo.width ?? 120}
              height={logo.height ?? 32}
              className="h-32 w-auto"
              priority
            />
          ) : null}
          <span className="font-mono text-caption uppercase text-ink">{wordmark}</span>
        </Link>

        <ul className="hidden items-center gap-24 tablet:flex">
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`}>{link(item, 'bar')}</li>
          ))}
        </ul>

        <div className="hidden items-center gap-12 tablet:flex">
          <LocaleSwitcher locale={locale} />
          <ThemeSwitcher />
          {contact}
        </div>

        <div className="flex items-center gap-8 tablet:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
            className="min-h-[2.75rem] border border-line px-16 font-mono text-caption uppercase text-ink"
          >
            {open ? t('menuClose') : t('menuOpen')}
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        hidden={!open}
        className="page-margin border-t border-line bg-surface pb-32 tablet:hidden"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`}>{link(item, 'panel')}</li>
          ))}
        </ul>
        <div className="mt-24 flex flex-wrap items-center justify-between gap-16">
          <LocaleSwitcher locale={locale} />
          {contact}
        </div>
      </div>
    </header>
  )
}

import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'

/**
 * Opaque, flat, square-cornered: the footer is content, not interface, so it
 * carries no glass.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations('Layout')

  const [footer, settings, seo] = await Promise.all([
    getGlobal('footer', locale),
    getGlobal('settings', locale),
    getGlobal('seo-defaults', locale),
  ])

  const year = new Date().getFullYear()

  // Two lines and no more: who and how to reach him on the first, the
  // links folded into one row, then the legal line. Every column the CMS
  // defines still appears — flattened into the row rather than stacked.
  const links = (footer.columns ?? []).flatMap((column) => column.links ?? [])

  return (
    <footer className="page-margin border-t border-line py-32">
      <div className="flex flex-col gap-24 desktop:flex-row desktop:items-baseline desktop:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-24 gap-y-8">
          <p className="font-mono text-caption uppercase text-ink">{seo.siteName}</p>
          {settings.contact?.email ? (
            <a href={`mailto:${settings.contact.email}`} className="link-underline text-body text-ink">
              {settings.contact.email}
            </a>
          ) : null}
        </div>

        <nav aria-label={t('links')}>
          <ul className="flex flex-wrap gap-x-24 gap-y-8 font-mono text-caption uppercase text-ink-2">
            {links.map((link) => (
              <li key={link.id ?? link.url}>
                <Link href={link.url} className="link-underline inline-block py-4 hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            {(settings.social ?? []).map((entry) => (
              <li key={entry.id ?? entry.url}>
                <a
                  href={entry.url}
                  rel="noreferrer"
                  target="_blank"
                  className="link-underline inline-block py-4 hover:text-ink"
                >
                  {entry.platform} ↗
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-24 flex flex-wrap items-center justify-between gap-16 font-mono text-caption uppercase text-ink-muted">
        <p>
          © {year} {footer.legalText}
        </p>
        <a href="#main" className="link-underline">
          {t('toTop')} ↑
        </a>
      </div>
    </footer>
  )
}

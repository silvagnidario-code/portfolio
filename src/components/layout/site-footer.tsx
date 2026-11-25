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

  return (
    <footer className="page-margin border-t border-line pb-32 pt-64">
      <div className="grid gap-48 tablet:grid-cols-2 desktop:grid-cols-4">
        <div className="desktop:col-span-2">
          <p className="font-mono text-caption uppercase text-ink">{seo.siteName}</p>
          <p className="mt-16 max-w-[40ch] text-body text-ink-muted">{seo.description}</p>
          {settings.contact?.email ? (
            <a
              href={`mailto:${settings.contact.email}`}
              className="link-underline mt-24 inline-block text-body-lg text-ink"
            >
              {settings.contact.email}
            </a>
          ) : null}
        </div>

        {(footer.columns ?? []).map((column) => (
          <nav key={column.id ?? column.title} aria-label={column.title}>
            <p className="font-mono text-caption uppercase text-ink-muted">{column.title}</p>
            <ul className="mt-16 flex flex-col">
              {(column.links ?? []).map((link) => (
                <li key={link.id ?? link.url}>
                  <Link
                    href={link.url}
                    className="link-underline inline-block py-4 text-body text-ink-2 transition ease-reveal duration-fast hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {(settings.social ?? []).length > 0 ? (
          <nav aria-label={t('social')}>
            <p className="font-mono text-caption uppercase text-ink-muted">{t('social')}</p>
            <ul className="mt-16 flex flex-col">
              {(settings.social ?? []).map((entry) => (
                <li key={entry.id ?? entry.url}>
                  <a
                    href={entry.url}
                    rel="noreferrer"
                    target="_blank"
                    className="link-underline inline-block py-4 text-body text-ink-2 transition ease-reveal duration-fast hover:text-ink"
                  >
                    {entry.platform} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      <div className="mt-64 flex flex-wrap items-center justify-between gap-16 border-t border-line pt-24 font-mono text-caption uppercase text-ink-muted">
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

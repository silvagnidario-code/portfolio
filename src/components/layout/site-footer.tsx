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
    <footer className="page-margin border-t border-line py-96">
      <div className="flex flex-col gap-64 tablet:flex-row tablet:justify-between">
        <div className="max-w-measure">
          <p className="font-mono text-caption uppercase text-ink-muted">{seo.siteName}</p>
          <p className="mt-16 text-body-lg text-ink-2">{seo.description}</p>

          {settings.contact?.email ? (
            <a
              href={`mailto:${settings.contact.email}`}
              className="mt-24 inline-block text-body-lg text-ink underline"
            >
              {settings.contact.email}
            </a>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-64">
          {(footer.columns ?? []).map((column) => (
            <nav key={column.id ?? column.title} aria-label={column.title}>
              <p className="font-mono text-caption uppercase text-ink-muted">{column.title}</p>
              <ul className="mt-16 flex flex-col gap-8">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.url}>
                    <Link
                      href={link.url}
                      className="text-body text-ink-2 transition ease-reveal duration-fast hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {(settings.offices ?? []).length > 0 ? (
            <div>
              <p className="font-mono text-caption uppercase text-ink-muted">{t('offices')}</p>
              <ul className="mt-16 flex flex-col gap-16">
                {(settings.offices ?? []).map((office) => (
                  <li key={office.id ?? office.city} className="text-body text-ink-2">
                    <span className="block text-ink">{office.city}</span>
                    <span className="block whitespace-pre-line">{office.address}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {(settings.social ?? []).length > 0 ? (
            <nav aria-label={t('social')}>
              <p className="font-mono text-caption uppercase text-ink-muted">{t('social')}</p>
              <ul className="mt-16 flex flex-col gap-8">
                {(settings.social ?? []).map((entry) => (
                  <li key={entry.id ?? entry.url}>
                    <a
                      href={entry.url}
                      rel="noreferrer"
                      target="_blank"
                      className="text-body text-ink-2 transition ease-reveal duration-fast hover:text-ink"
                    >
                      {entry.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      <p className="mt-96 font-mono text-caption uppercase text-ink-muted">
        © {year} {footer.legalText}
      </p>
    </footer>
  )
}

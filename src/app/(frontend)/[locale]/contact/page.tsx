import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BriefForm } from '@/components/contact/brief-form'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'

import { submitBrief } from './actions'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ContactPage' })

  return { title: t('title'), description: t('intro') }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('ContactPage')
  const settings = await getGlobal('settings', locale)

  return (
    <main className="page-grid pb-96">
      <header className="col-span-4 tablet:col-span-6 desktop:col-span-5">
        <h1 className="text-h1 text-balance">{t('title')}</h1>
        <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>

        {settings.contact?.email ? (
          <p className="mt-48">
            <span className="block font-mono text-caption uppercase text-ink-muted">
              {t('writeUs')}
            </span>
            <a href={`mailto:${settings.contact.email}`} className="text-body-lg underline">
              {settings.contact.email}
            </a>
          </p>
        ) : null}

        {(settings.offices ?? []).length > 0 ? (
          <ul className="mt-48 flex flex-col gap-24">
            {(settings.offices ?? []).map((office) => (
              <li key={office.id ?? office.city} className="text-body text-ink-2">
                <span className="block text-ink">{office.city}</span>
                <span className="block whitespace-pre-line">{office.address}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="col-span-4 tablet:col-span-6 desktop:col-span-6 desktop:col-start-7">
        <BriefForm locale={locale} action={submitBrief} />
      </div>
    </main>
  )
}

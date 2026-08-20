import { getTranslations } from 'next-intl/server'

import { submitBrief } from '@/app/(frontend)/[locale]/contact/actions'
import { BriefForm } from '@/components/contact/brief-form'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'
import type { ContactFormBlock as ContactFormBlockType } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'

/**
 * Wraps the brief form in the block system so the heading, the lead and
 * whether to show contact info are editable like any other page — the form's
 * validation, rate limit and honeypot are untouched, imported from the same
 * action the page used before this block existed.
 */
export async function ContactFormBlock({
  block,
  locale,
}: {
  block: ContactFormBlockType
  locale: Locale
}) {
  const { eyebrow, heading, lead, showContactInfo, settings } = block

  const [globalSettings, t] = await Promise.all([
    showContactInfo ? getGlobal('settings', locale) : Promise.resolve(null),
    getTranslations({ locale, namespace: 'ContactPage' }),
  ])

  return (
    <BlockSection settings={settings}>
      <div className="page-grid pb-96">
        <header className="col-span-4 tablet:col-span-6 desktop:col-span-5">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-16 text-h1 text-balance">{heading}</h1>
          {lead ? <p className="mt-32 max-w-measure text-body-lg text-ink-2">{lead}</p> : null}

          {globalSettings?.contact?.email ? (
            <p className="mt-48">
              <span className="block font-mono text-caption uppercase text-ink-muted">
                {t('writeUs')}
              </span>
              <a href={`mailto:${globalSettings.contact.email}`} className="text-body-lg underline">
                {globalSettings.contact.email}
              </a>
            </p>
          ) : null}

          {globalSettings && (globalSettings.offices ?? []).length > 0 ? (
            <ul className="mt-48 flex flex-col gap-24">
              {(globalSettings.offices ?? []).map((office) => (
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
      </div>
    </BlockSection>
  )
}

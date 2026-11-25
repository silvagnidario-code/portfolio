import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'
import type { CtaBlock } from '@/payload-types'

import { BlockSection } from './block-section'
import { CopyEmail } from './copy-email'

/**
 * The one block with a commercial job: get the reader to the brief form. The
 * inline-form variant renders the entry point only — the form itself belongs to
 * the contact page in phase 7, and duplicating it here would duplicate its
 * validation too.
 */
export async function Cta({ block, locale }: { block: CtaBlock; locale: Locale }) {
  const { variant, heading, body, action, settings } = block

  if (variant === 'minimalRow') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid items-baseline">
          <h2 className="col-span-4 tablet:col-span-4 desktop:col-span-8 text-h3 text-balance">
            {heading}
          </h2>
          {action?.label && action.href ? (
            <Link
              href={action.href}
              className="col-span-4 tablet:col-span-2 desktop:col-span-3 desktop:col-start-10 inline-flex min-h-[3rem] items-center justify-self-start border border-current px-24 font-mono text-caption uppercase transition ease-reveal duration-fast hover:bg-ink hover:text-surface"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
      </BlockSection>
    )
  }

  if (variant === 'inlineForm') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">
          <div className="col-span-4 tablet:col-span-6 desktop:col-span-7">
            <h2 className="text-h1 text-balance">{heading}</h2>
            {body ? <p className="mt-32 max-w-measure text-body-lg">{body}</p> : null}
          </div>
          <div className="col-span-4 tablet:col-span-6 desktop:col-span-4 desktop:col-start-9">
            <Link
              href="/contact"
              className="mt-48 inline-flex min-h-[3rem] items-center border border-current px-24 font-mono text-caption uppercase transition ease-reveal duration-fast hover:bg-ink hover:text-surface"
            >
              {action?.label ?? heading}
            </Link>
          </div>
        </div>
      </BlockSection>
    )
  }

  // `typographicBanner`: the closing call. A live "available" line, the
  // heading at display size, then the action and the address, copyable.
  const [settingsGlobal, t] = await Promise.all([
    getGlobal('settings', locale),
    getTranslations('Contact'),
  ])
  const email = settingsGlobal.contact?.email
  // A heading of several sentences keeps only the first at display size;
  // the rest follows at a reading size, so the call stays one line of sight.
  const [headline, ...restOfHeading] = heading.split(/(?<=[.!?])\s+/)
  const subline = restOfHeading.join(' ')

  return (
    <BlockSection settings={settings}>
      <div className="page-margin">
        <p className="flex flex-wrap items-center justify-between gap-12 font-mono text-caption uppercase text-ink-muted">
          <span>{t('label')}</span>
          <span className="flex items-center gap-8">
            <span
              aria-hidden="true"
              className="size-[0.5rem] animate-blink rounded-full bg-current"
            />
            {t('available')}
          </span>
        </p>
        <h2 className="mt-48 max-w-[16ch] text-display text-balance">
          {headline}
          {subline ? <span className="mt-24 block text-h3 text-ink-2">{subline}</span> : null}
        </h2>
        {body ? <p className="mt-32 max-w-[44ch] text-body-lg text-ink-2">{body}</p> : null}
        <div className="mt-48 flex flex-wrap items-center gap-12">
          {action?.label && action.href ? (
            <Link
              href={action.href}
              className="inline-flex min-h-[3.25rem] items-center bg-ink px-24 font-mono text-caption uppercase text-surface transition ease-reveal duration-fast hover:opacity-85"
            >
              {action.label} ↗
            </Link>
          ) : null}
          {email ? <CopyEmail email={email} /> : null}
        </div>
      </div>
    </BlockSection>
  )
}

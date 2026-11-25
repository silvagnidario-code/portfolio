import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Industry, Service } from '@/payload-types'

export type WorkFilter = { service?: string; industry?: string }

/**
 * The filters on the work index.
 *
 * They are links, not buttons: filtering happens on the server through the
 * query string, so the index works without JavaScript, every state has its own
 * URL, and a reader can go back out of a filter.
 *
 * Deliberately quiet: plain text set directly on the page, no glass tray, no
 * filled pills. An active filter is marked by an underline and nothing
 * louder — the work below is what's meant to carry visual weight, not the
 * controls above it.
 */
export async function WorkFilters({
  services,
  industries,
  active,
}: {
  services: Service[]
  industries: Industry[]
  active: WorkFilter
}) {
  const t = await getTranslations('WorkPage')

  const href = (next: WorkFilter) => {
    const params = new URLSearchParams()
    if (next.service) params.set('service', next.service)
    if (next.industry) params.set('industry', next.industry)
    const query = params.toString()

    return query ? `/work?${query}` : '/work'
  }

  const pill = (label: string, target: string, isActive: boolean) => (
    <Link
      key={`${label}-${target}`}
      href={target}
      aria-current={isActive ? 'true' : undefined}
      className={`-mb-px -mr-px inline-flex min-h-[2.75rem] items-center border border-line-strong px-16 font-mono text-caption uppercase transition ease-reveal duration-fast ${
        isActive ? 'bg-ink text-surface' : 'text-ink hover:bg-surface-2'
      }`}
    >
      {label}
    </Link>
  )

  const hasFilter = Boolean(active.service ?? active.industry)

  const groups = (
    <>
      <div className="flex flex-col gap-12">
        <span className="font-mono text-caption uppercase text-ink-muted">{t('byService')}</span>
        <div className="flex flex-wrap">
          {pill(t('allProjects'), href({ industry: active.industry }), !active.service)}
          {services.map((service) =>
            pill(
              service.title,
              href({ service: service.slug, industry: active.industry }),
              active.service === service.slug,
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <span className="font-mono text-caption uppercase text-ink-muted">{t('byIndustry')}</span>
        <div className="flex flex-wrap">
          {pill(t('allProjects'), href({ service: active.service }), !active.industry)}
          {industries.map((industry) =>
            pill(
              industry.title,
              href({ service: active.service, industry: industry.slug }),
              active.industry === industry.slug,
            ),
          )}
        </div>
      </div>

      {hasFilter ? (
        <Link
          href="/work"
          className="link-underline self-end py-12 font-mono text-caption uppercase text-ink-muted transition ease-reveal duration-fast hover:text-ink"
        >
          {t('clear')}
        </Link>
      ) : null}
    </>
  )

  // Open by default from the tablet up; on a phone the same filters fold
  // into a disclosure so they do not push the work below the fold.
  return (
    <section aria-label={t('filters')}>
      <details className="group border-y border-line tablet:hidden">
        <summary className="flex min-h-[3rem] cursor-pointer list-none items-center justify-between font-mono text-caption uppercase text-ink">
          {t('filters')}
          <span
            aria-hidden="true"
            className="transition ease-reveal duration-fast group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <div className="flex flex-col gap-24 pb-24">{groups}</div>
      </details>
      <div className="hidden flex-wrap items-start gap-48 tablet:flex">{groups}</div>
    </section>
  )
}

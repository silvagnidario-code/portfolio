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
      className={`border-b py-8 font-mono text-caption uppercase transition ease-reveal duration-fast ${
        isActive
          ? 'border-ink text-ink'
          : 'border-transparent text-ink-muted hover:border-line-strong hover:text-ink'
      }`}
    >
      {label}
    </Link>
  )

  const hasFilter = Boolean(active.service ?? active.industry)

  return (
    <section
      aria-label={t('filters')}
      className="flex flex-col gap-16 border-b border-line pb-24 tablet:flex-row tablet:items-center tablet:gap-32"
    >
      <div className="flex flex-wrap items-center gap-16">
        <span className="font-mono text-caption uppercase text-ink-muted">
          {t('byService')}
        </span>
        {pill(t('allProjects'), href({ industry: active.industry }), !active.service)}
        {services.map((service) =>
          pill(
            service.title,
            href({ service: service.slug, industry: active.industry }),
            active.service === service.slug,
          ),
        )}
      </div>

      <div className="flex flex-wrap items-center gap-16">
        <span className="font-mono text-caption uppercase text-ink-muted">
          {t('byIndustry')}
        </span>
        {pill(t('allProjects'), href({ service: active.service }), !active.industry)}
        {industries.map((industry) =>
          pill(
            industry.title,
            href({ service: active.service, industry: industry.slug }),
            active.industry === industry.slug,
          ),
        )}
      </div>

      {hasFilter ? (
        <Link
          href="/work"
          className="font-mono text-caption uppercase text-ink-muted underline transition ease-reveal duration-fast hover:text-ink"
        >
          {t('clear')}
        </Link>
      ) : null}
    </section>
  )
}

import { getTranslations } from 'next-intl/server'

import { GlassSurface } from '@/components/glass/glass-surface'
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
 * The specification calls the pills glass. One tray of glass holds all of them
 * instead of one surface per pill: eight glass surfaces would blow the budget
 * of four on their own, and a pane inside a pane blurs an already blurred
 * backdrop.
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
      className={`rounded-glass-sm px-16 py-8 font-mono text-caption uppercase transition ease-reveal duration-fast ${
        isActive ? 'bg-ink text-ink-inverse' : 'text-ink-2 hover:text-ink'
      }`}
    >
      {label}
    </Link>
  )

  const hasFilter = Boolean(active.service ?? active.industry)

  return (
    <GlassSurface
      as="section"
      variant="pill"
      aria-label={t('filters')}
      className="flex flex-col gap-16 px-24 py-16 tablet:flex-row tablet:items-center tablet:gap-32"
    >
      <div className="flex flex-wrap items-center gap-8">
        <span className="pr-8 font-mono text-caption uppercase text-ink-muted">
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

      <div className="flex flex-wrap items-center gap-8">
        <span className="pr-8 font-mono text-caption uppercase text-ink-muted">
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
    </GlassSurface>
  )
}

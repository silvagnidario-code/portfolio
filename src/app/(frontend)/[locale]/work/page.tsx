import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ProjectIndex } from '@/components/work/project-index'
import { WorkFilters, type WorkFilter } from '@/components/work/work-filters'
import type { Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'
import { toProjectIndexItems } from '@/lib/project-index'
import { getIndustriesList, getProjectsList, getServicesList } from '@/lib/queries'
import type { Industry, Service } from '@/payload-types'

type PageProps = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const single = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'WorkPage' })

  return { title: t('title'), description: t('intro'), alternates: alternatesFor('/work', locale) }
}

export default async function WorkIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const query = await searchParams
  const active: WorkFilter = { service: single(query.service), industry: single(query.industry) }

  const t = await getTranslations('WorkPage')

  // Every published project is read once; the filters then run in memory.
  // That is what lets the filter bar offer only the services and sectors
  // some project actually carries — a filter that leads to an empty page is
  // never shown — and there are a few dozen projects, not thousands.
  const [all, services, industries] = await Promise.all([
    getProjectsList(locale, {
      limit: 100,
      sort: ['order', '-year'],
      where: { _status: { equals: 'published' } },
    }),
    getServicesList(locale),
    getIndustriesList(locale),
  ])

  const slugOf = (value: number | Service | Industry | null | undefined) =>
    value && typeof value === 'object' ? value.slug : undefined

  const usedServices = new Set(all.docs.flatMap((project) => (project.services ?? []).map(slugOf)))
  const usedIndustries = new Set(all.docs.map((project) => slugOf(project.industry)))

  const projects = all.docs.filter(
    (project) =>
      (!active.service ||
        (project.services ?? []).some((service) => slugOf(service) === active.service)) &&
      (!active.industry || slugOf(project.industry) === active.industry),
  )

  return (
    <main className="pb-96">
      <header className="page-margin pb-48">
        <h1 className="text-display text-balance">{t('title')}</h1>
        <p className="mt-32 max-w-[48ch] text-body-lg text-ink-2">{t('intro')}</p>
      </header>

      <div className="page-margin pb-48">
        <WorkFilters
          services={services.filter((service) => usedServices.has(service.slug))}
          industries={industries.filter((industry) => usedIndustries.has(industry.slug))}
          active={active}
        />
      </div>

      <div className="page-margin">
        <p aria-live="polite" className="pb-24 font-mono text-caption uppercase text-ink-muted">
          {t('count', { count: projects.length })}
        </p>
        {projects.length === 0 ? (
          <p className="text-body-lg text-ink-2">{t('empty')}</p>
        ) : (
          <ProjectIndex items={toProjectIndexItems(projects)} headingLevel="h2" />
        )}
      </div>
    </main>
  )
}

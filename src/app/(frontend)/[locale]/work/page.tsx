import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ProjectCard } from '@/components/blocks/project-card'
import { WorkFilters, type WorkFilter } from '@/components/work/work-filters'
import type { Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'
import { getIndustriesList, getProjectsList, getServicesList } from '@/lib/queries'
import type { Where } from 'payload'

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

  const conditions: Where[] = [{ _status: { equals: 'published' } }]
  if (active.service) conditions.push({ 'services.slug': { equals: active.service } })
  if (active.industry) conditions.push({ 'industry.slug': { equals: active.industry } })

  const [projects, services, industries] = await Promise.all([
    getProjectsList(locale, { limit: 50, sort: ['order', '-year'], where: { and: conditions } }),
    getServicesList(locale),
    getIndustriesList(locale),
  ])

  return (
    <main className="pb-96">
      <header className="page-grid pb-64">
        <div className="col-span-4 tablet:col-span-5 desktop:col-span-8">
          <h1 className="text-display text-balance">{t('title')}</h1>
          <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>
        </div>
      </header>

      <div className="page-margin pb-64">
        <WorkFilters services={services} industries={industries} active={active} />
      </div>

      <p className="page-margin pb-32 font-mono text-caption uppercase text-ink-muted">
        {t('count', { count: projects.totalDocs })}
      </p>

      {projects.docs.length === 0 ? (
        <p className="page-margin text-body-lg text-ink-2">{t('empty')}</p>
      ) : (
        <div className="page-grid gap-y-96">
          {projects.docs.map((project, index) => (
            <div
              key={project.id}
              className={
                index % 3 === 0
                  ? 'col-span-4 tablet:col-span-4 desktop:col-span-7'
                  : 'col-span-4 tablet:col-span-3 desktop:col-span-5 desktop:mt-64'
              }
            >
              <ProjectCard
                project={project}
                headingLevel="h2"
                sizes="(min-width: 1180px) 55vw, (min-width: 768px) 60vw, 100vw"
                aspect={index % 3 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'

import { BlockSection, Eyebrow } from '@/components/blocks/block-section'
import { ProjectCard } from '@/components/blocks/project-card'
import { RenderBlocks } from '@/components/blocks/render-blocks'
import { RichText } from '@/components/blocks/rich-text'
import { MediaImage } from '@/components/media/media-image'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { CreativeWorkJsonLd } from '@/components/seo/json-ld'
import { resolveProjectAccent } from '@/lib/accent'
import { env } from '@/lib/env'
import { alternatesForPaths } from '@/lib/metadata'
import { ogSize } from '@/lib/og'
import { getProjectAlternates, getProjectBySlug } from '@/lib/queries'
import type { Industry, Project, Service, TeamMember, Testimonial } from '@/payload-types'

type PageProps = { params: Promise<{ locale: Locale; slug: string }> }

const populated = <T,>(value: number | T | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug, locale)

  if (!project) return {}

  const alternates = await getProjectAlternates(project.id, routing.locales)

  // An editor-supplied OG image wins; otherwise the card is generated from the
  // document itself.
  const supplied = populated(project.meta?.ogImage)
  const generated = `${env.NEXT_PUBLIC_SERVER_URL}/${locale}/work/${slug}/og`

  return {
    title: project.meta?.title ?? project.title,
    description: project.meta?.description ?? project.claim,
    alternates: alternatesForPaths(alternates, locale, `/work/${slug}`),
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.claim,
      images: [
        supplied?.url
          ? { url: supplied.url }
          : { url: generated, width: ogSize.width, height: ogSize.height },
      ],
    },
  }
}

/**
 * The case study — the page the whole site exists to deliver a reader to.
 *
 * It is built out of the project's own fields rather than the block library:
 * the narrative order (context, challenge, approach, execution, results) is the
 * argument the page makes, and it should not be re-composable per document.
 */
export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = await getProjectBySlug(slug, locale)
  if (!project) notFound()

  const t = await getTranslations('CaseStudy')

  const accent = resolveProjectAccent(project.accentColor)
  const industry = populated<Industry>(project.industry)
  const services = (project.services ?? []).filter(
    (service): service is Service => typeof service === 'object',
  )
  const team = (project.team ?? []).filter(
    (member): member is TeamMember => typeof member === 'object',
  )
  const related = (project.related ?? []).filter(
    (item): item is Project => typeof item === 'object',
  )
  const testimonial = populated<Testimonial>(project.testimonial)

  const narrative: Array<{ label: string; body: Project['context'] }> = [
    { label: t('context'), body: project.context },
    { label: t('challenge'), body: project.challenge },
    { label: t('approach'), body: project.approach },
  ]

  return (
    <main
      className="project-accent pb-96"
      style={{ '--accent-light': accent.light, '--accent-dark': accent.dark } as CSSProperties}
    >
      <CreativeWorkJsonLd project={project} locale={locale} path={`/work/${slug}`} />

      <header className="page-grid pb-64">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-9">
          <Eyebrow>{project.client}</Eyebrow>
          <h1 className="mt-24 text-display text-balance">{project.title}</h1>
          <p className="mt-32 max-w-measure text-h3 text-ink-2">{project.claim}</p>
        </div>
      </header>

      {project.heroMedia ? (
        <figure className="mb-96">
          <MediaImage media={project.heroMedia} sizes="100vw" priority className="w-full" />
        </figure>
      ) : null}

      <dl className="page-grid pb-96">
        {[
          { label: t('client'), value: project.client },
          { label: t('year'), value: String(project.year) },
          { label: t('industry'), value: industry?.title ?? null },
          { label: t('services'), value: services.map((service) => service.title).join(', ') },
        ]
          .filter((entry) => entry.value)
          .map((entry) => (
            <div
              key={entry.label}
              className="col-span-2 tablet:col-span-3 desktop:col-span-3 border-t border-line pt-16"
            >
              <dt className="font-mono text-caption uppercase text-ink-muted">{entry.label}</dt>
              <dd className="mt-8 text-body">{entry.value}</dd>
            </div>
          ))}
      </dl>

      {narrative
        .filter((section) => section.body)
        .map((section) => (
          <BlockSection key={section.label} settings={{ background: 'paper', spacing: 'compact' }}>
            <div className="page-grid">
              <h2 className="col-span-4 tablet:col-span-2 desktop:col-span-3 font-mono text-caption uppercase text-ink-muted">
                {section.label}
              </h2>
              <div className="col-span-4 tablet:col-span-4 desktop:col-span-8 desktop:col-start-5">
                <RichText data={section.body} />
              </div>
            </div>
          </BlockSection>
        ))}

      <RenderBlocks blocks={project.execution} locale={locale} />

      {(project.results ?? []).length > 0 ? (
        <BlockSection settings={{ background: 'sumi', spacing: 'wide' }}>
          <h2 className="page-margin mb-64 text-h2">{t('results')}</h2>
          <dl className="page-grid gap-y-48">
            {(project.results ?? []).map((result) => (
              <div
                key={result.id ?? result.value}
                className="col-span-4 tablet:col-span-2 desktop:col-span-4 border-t border-line pt-24"
              >
                <dt className="text-display">{result.value}</dt>
                {/* The delta lives inside the description: a `p` between the
                    pairs of a definition list is not allowed there. */}
                <dd className="mt-16 text-body-lg">
                  {result.label}
                  {result.delta ? (
                    <span className="mt-8 block font-mono text-caption uppercase text-ink-muted">
                      {result.delta}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </BlockSection>
      ) : null}

      {testimonial ? (
        <BlockSection settings={{ background: 'paper', spacing: 'wide' }}>
          <blockquote className="page-grid">
            <div className="col-span-4 tablet:col-span-6 desktop:col-span-9 desktop:col-start-3">
              <p className="text-h1 text-balance">{testimonial.quote}</p>
              <footer className="mt-32 font-mono text-caption uppercase text-ink-muted">
                {[testimonial.author, testimonial.role, testimonial.company]
                  .filter(Boolean)
                  .join(' · ')}
              </footer>
            </div>
          </blockquote>
        </BlockSection>
      ) : null}

      <RenderBlocks blocks={project.gallery} locale={locale} />

      {team.length > 0 ||
      (project.partners ?? []).length > 0 ||
      (project.awards ?? []).length > 0 ||
      project.liveUrl ? (
        <BlockSection settings={{ background: 'paper', spacing: 'normal' }}>
          <h2 className="page-margin mb-48 font-mono text-caption uppercase text-ink-muted">
            {t('credits')}
          </h2>
          <div className="page-grid gap-y-48">
            {team.length > 0 ? (
              <div className="col-span-4 tablet:col-span-3 desktop:col-span-4">
                <h3 className="font-mono text-caption uppercase text-ink-muted">{t('team')}</h3>
                <ul className="mt-16 flex flex-col gap-8">
                  {team.map((member) => (
                    <li key={member.id} className="text-body">
                      {member.name} — <span className="text-ink-2">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(project.partners ?? []).length > 0 ? (
              <div className="col-span-4 tablet:col-span-3 desktop:col-span-4">
                <h3 className="font-mono text-caption uppercase text-ink-muted">
                  {t('partners')}
                </h3>
                <ul className="mt-16 flex flex-col gap-8">
                  {(project.partners ?? []).map((partner) => (
                    <li key={partner.id ?? partner.name} className="text-body">
                      {partner.name} — <span className="text-ink-2">{partner.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(project.awards ?? []).length > 0 ? (
              <div className="col-span-4 tablet:col-span-3 desktop:col-span-3">
                <h3 className="font-mono text-caption uppercase text-ink-muted">{t('awards')}</h3>
                <ul className="mt-16 flex flex-col gap-8">
                  {(project.awards ?? []).map((award) => (
                    <li key={award.id ?? award.name} className="text-body">
                      {award.name}
                      {award.category ? (
                        <span className="text-ink-2"> — {award.category}</span>
                      ) : null}
                      {award.year ? (
                        <span className="text-ink-muted"> · {award.year}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {project.liveUrl ? (
            <p className="page-margin mt-48">
              <a
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
                className="text-body-lg text-accent underline"
              >
                {t('liveUrl')}
              </a>
            </p>
          ) : null}
        </BlockSection>
      ) : null}

      {related.length > 0 ? (
        <BlockSection settings={{ background: 'paper', spacing: 'wide' }}>
          <h2 className="page-margin mb-64 text-h2">{t('related')}</h2>
          <div className="page-grid gap-y-64">
            {related.map((item) => (
              <div key={item.id} className="col-span-4 tablet:col-span-3 desktop:col-span-6">
                <ProjectCard project={item} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
            ))}
          </div>
        </BlockSection>
      ) : null}

      <p className="page-margin">
        <Link href="/work" className="text-body-lg underline">
          {t('backToWork')}
        </Link>
      </p>
    </main>
  )
}

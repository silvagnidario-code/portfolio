import type { Locale } from '@/i18n/routing'
import { env } from '@/lib/env'
import { getGlobal } from '@/lib/payload'
import type { Media, Project } from '@/payload-types'

/**
 * Structured data, §9.
 *
 * Rendered as a plain script tag rather than through a helper library: the
 * shape is small, and a serializer that quietly drops a field is worse than a
 * literal you can read.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built here from CMS values, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const mediaUrl = (media: number | Media | null | undefined): string | undefined =>
  media && typeof media === 'object' ? (media.url ?? undefined) : undefined

export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const [settings, seo] = await Promise.all([
    getGlobal('settings', locale),
    getGlobal('seo-defaults', locale),
  ])

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.legalName ?? seo.siteName,
        alternateName: seo.siteName,
        url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}`,
        description: seo.description,
        logo: mediaUrl(settings.logoLight) ?? mediaUrl(seo.ogImage),
        email: settings.contact?.email,
        telephone: settings.contact?.phone,
        vatID: settings.vatId,
        sameAs: (settings.social ?? []).map((entry) => entry.url),
        address: (settings.offices ?? []).map((office) => ({
          '@type': 'PostalAddress',
          addressLocality: office.city,
          streetAddress: office.address,
        })),
      }}
    />
  )
}

export function CreativeWorkJsonLd({
  project,
  locale,
  path,
}: {
  project: Project
  locale: Locale
  path: string
}) {
  const industry = typeof project.industry === 'object' ? project.industry : null

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        abstract: project.claim,
        description: project.meta?.description ?? project.claim,
        inLanguage: locale,
        url: `${env.NEXT_PUBLIC_SERVER_URL}/${locale}${path}`,
        image: mediaUrl(project.cover),
        dateCreated: String(project.year),
        dateModified: project.updatedAt,
        genre: industry?.title,
        creator: { '@type': 'Organization', name: project.client },
        keywords: (project.services ?? [])
          .filter((service) => typeof service === 'object')
          .map((service) => service.title)
          .join(', '),
        award: (project.awards ?? []).map((award) =>
          [award.name, award.category, award.year].filter(Boolean).join(' — '),
        ),
      }}
    />
  )
}

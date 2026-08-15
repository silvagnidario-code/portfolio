import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { CmsPage, cmsPageMetadata } from '@/components/pages/cms-page'
import type { Locale } from '@/i18n/routing'

/** Only these two documents are reachable under /legal. */
const legalSlugs = ['privacy', 'cookie'] as const

type LegalSlug = (typeof legalSlugs)[number]

type PageProps = { params: Promise<{ locale: Locale; slug: string }> }

const isLegalSlug = (value: string): value is LegalSlug =>
  (legalSlugs as readonly string[]).includes(value)

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLegalSlug(slug)) return {}

  return cmsPageMetadata({ slug, locale })
}

export default async function LegalPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  if (!isLegalSlug(slug)) notFound()

  return <CmsPage slug={slug} locale={locale} />
}

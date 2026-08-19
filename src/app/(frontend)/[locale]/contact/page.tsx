import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { CmsPage, cmsPageMetadata } from '@/components/pages/cms-page'
import type { Locale } from '@/i18n/routing'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  return cmsPageMetadata({ slug: 'contact', locale, path: '/contact' })
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CmsPage slug="contact" locale={locale} />
}

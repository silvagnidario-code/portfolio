import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'
import { getPageBySlug } from '@/lib/queries'

/**
 * A page composed in the CMS. Home, services, about and the legal pages are all
 * this: the difference between them lives in the admin panel, not in the code.
 */
export async function CmsPage({ slug, locale }: { slug: string; locale: Locale }) {
  const page = await getPageBySlug(slug, locale)

  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} locale={locale} />
}

export async function cmsPageMetadata({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): Promise<Metadata> {
  const [page, seo] = await Promise.all([
    getPageBySlug(slug, locale),
    getGlobal('seo-defaults', locale),
  ])

  if (!page) return {}

  const image = typeof page.meta?.ogImage === 'object' ? page.meta.ogImage : null
  const fallbackImage = typeof seo.ogImage === 'object' ? seo.ogImage : null

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? seo.description,
    openGraph: {
      title: page.meta?.title ?? page.title,
      description: page.meta?.description ?? seo.description,
      images:
        (image?.url ?? fallbackImage?.url) ? [{ url: (image ?? fallbackImage)!.url! }] : undefined,
    },
  }
}

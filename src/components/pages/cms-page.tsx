import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import type { Locale } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'
import { getGlobal } from '@/lib/payload'
import { getPageBySlug } from '@/lib/queries'

/**
 * A page composed in the CMS. Home, services, about and the legal pages are all
 * this: the difference between them lives in the admin panel, not in the code.
 */
export async function CmsPage({ slug, locale }: { slug: string; locale: Locale }) {
  const page = await getPageBySlug(slug, locale)

  if (!page) notFound()

  // The blocks are the page's content, so they need the landmark: without it
  // a screen reader has no "skip to main" target and axe reports the page as
  // having no main region at all.
  return (
    <main>
      <RenderBlocks blocks={page.layout} locale={locale} />
    </main>
  )
}

export async function cmsPageMetadata({
  slug,
  locale,
  path,
}: {
  slug: string
  locale: Locale
  /** Route path without the locale prefix, for canonical and hreflang. */
  path: string
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
    alternates: alternatesFor(path, locale),
    openGraph: {
      title: page.meta?.title ?? page.title,
      description: page.meta?.description ?? seo.description,
      images:
        (image?.url ?? fallbackImage?.url) ? [{ url: (image ?? fallbackImage)!.url! }] : undefined,
    },
  }
}

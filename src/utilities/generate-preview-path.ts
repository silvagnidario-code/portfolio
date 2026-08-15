import { env } from '../lib/env'

type PreviewablecCollection = 'projects' | 'pages'

const routeFor = (collection: PreviewablecCollection, slug: string, locale: string): string => {
  if (collection === 'projects') return `/${locale}/work/${slug}`

  // The home page lives at the locale root, not at `/home`.
  return slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
}

/**
 * URL the admin panel opens for draft preview and live preview.
 *
 * It does not point at the page directly: it goes through `/next/preview`,
 * which checks the editor's session and turns Next draft mode on. Without that
 * hop the page would render the published version and the preview would be a
 * lie.
 */
export function generatePreviewPath({
  collection,
  slug,
  locale,
}: {
  collection: PreviewablecCollection
  slug: string
  locale: string
}): string {
  const params = new URLSearchParams({
    collection,
    slug,
    locale,
    path: routeFor(collection, slug, locale),
    previewSecret: env.PREVIEW_SECRET,
  })

  return `${env.NEXT_PUBLIC_SERVER_URL}/next/preview?${params.toString()}`
}

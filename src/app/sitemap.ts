import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload'

/**
 * Multilingual sitemap, §9.
 *
 * One file, one entry per language per document, each carrying the alternates
 * of its siblings — which is what makes the hreflang declaration reciprocal
 * from the crawler's side as well as from the page's.
 *
 * It lives at the app root rather than inside the `(frontend)` group: a
 * metadata route next to the `[locale]` segment gets shadowed by it, and the
 * locale ends up being the literal string "sitemap.xml".
 */

/**
 * Generated per request, like the pages themselves: it reads the case studies
 * from the database, which the container image does not carry at build time —
 * and a sitemap frozen at build would go stale the first time an editor
 * publishes.
 */
export const dynamic = 'force-dynamic'

const url = (locale: string, path: string): string =>
  `${env.NEXT_PUBLIC_SERVER_URL}/${locale}${path === '/' ? '' : path}`

/** Routes that exist under the same path in every language. */
const staticPaths = [
  '/',
  '/work',
  '/services',
  '/about',
  '/contact',
  '/legal/privacy',
  '/legal/cookie',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const entries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      changeFrequency:
        path === '/' || path === '/work' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : path === '/work' ? 0.9 : 0.5,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((code) => [code, url(code, path)])),
      },
    })),
  )

  // Case studies: the slug differs per language, so every translation is looked
  // up rather than assumed.
  const published = await payload.find({
    collection: 'projects',
    locale: routing.defaultLocale,
    depth: 0,
    limit: 200,
    where: { _status: { equals: 'published' } },
  })

  for (const project of published.docs) {
    const paths: Record<string, string> = {}

    for (const code of routing.locales) {
      const translated = await payload.findByID({
        collection: 'projects',
        id: project.id,
        locale: code,
        depth: 0,
        disableErrors: true,
      })

      if (translated?.slug) paths[code] = `/work/${translated.slug}`
    }

    const languages = Object.fromEntries(
      Object.entries(paths).map(([code, path]) => [code, url(code, path)]),
    )

    for (const [code, path] of Object.entries(paths)) {
      entries.push({
        url: url(code, path),
        lastModified: project.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages },
      })
    }
  }

  return entries
}

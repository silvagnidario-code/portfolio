import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'

/**
 * Lives at the app root for the same reason the sitemap does: a metadata route
 * placed next to the `[locale]` segment gets shadowed by it, and the locale
 * ends up being the literal string "robots.txt".
 *
 * The two internal tools — the styleguide and the block catalogue — are kept
 * out of the index here as well as through their own `noindex`, because a
 * crawler that never fetches them cannot leak them.
 */
export default function robots(): MetadataRoute.Robots {
  const internal = routing.locales.flatMap((locale) => [
    `/${locale}/styleguide`,
    `/${locale}/blocks`,
  ])

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/next/', ...internal],
    },
    sitemap: `${env.NEXT_PUBLIC_SERVER_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_SERVER_URL,
  }
}

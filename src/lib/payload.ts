import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'
import type { Config } from '@/payload-types'

/**
 * Server-side access to the CMS.
 *
 * Wrapped in React `cache` so a page that needs the navigation, the footer and
 * the settings pays for one query each per request, not one per component that
 * happens to ask.
 */

type GlobalSlug = keyof Config['globals']

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getGlobal = cache(
  async <T extends GlobalSlug>(slug: T, locale: Locale): Promise<Config['globals'][T]> => {
    const payload = await getPayloadClient()

    const result = await payload.findGlobal({
      slug,
      locale,
      depth: 1,
      // Globals carry no drafts; the fallback fills untranslated fields from `it`.
      fallbackLocale: 'it',
    })

    return result as Config['globals'][T]
  },
)

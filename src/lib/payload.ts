import config from '@payload-config'
import { unstable_cache } from 'next/cache'
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

/**
 * Fase 9 — globals non hanno bozze ("Globals carry no drafts" sotto), quindi
 * possono passare da `unstable_cache` incondizionatamente: nessun ramo di
 * anteprima da preservare qui, a differenza di `getPageBySlug`/
 * `getProjectBySlug` in `queries.ts`.
 *
 * Il wrapper `unstable_cache` va creato dentro la funzione, non a livello di
 * modulo: è quello che lega tag e chiave di cache allo `slug` effettivo di
 * ogni chiamata invece che a un unico tag fisso condiviso da tutti i globals.
 * Il tag corrispondente viene invalidato dall'hook `afterChange` di ogni
 * global (vedi `src/globals/*.ts`).
 */
export const getGlobal = cache(
  async <T extends GlobalSlug>(slug: T, locale: Locale): Promise<Config['globals'][T]> => {
    const read = unstable_cache(
      async () => {
        const payload = await getPayloadClient()

        return payload.findGlobal({
          slug,
          locale,
          depth: 1,
          // Globals carry no drafts; the fallback fills untranslated fields from `it`.
          fallbackLocale: 'it',
        })
      },
      ['global', slug, locale],
      { tags: [`global:${slug}`] },
    )

    return (await read()) as Config['globals'][T]
  },
)

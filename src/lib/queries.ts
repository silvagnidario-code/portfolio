import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'
import type { Client, Industry, Project, Page, Service, TeamMember } from '@/payload-types'

import { getPayloadClient } from './payload'

/**
 * Content reads for the public site.
 *
 * The local API bypasses access control, so "published only" has to be stated
 * here explicitly: forgetting it would serve drafts to everyone. Draft mode —
 * which only an authenticated editor can turn on, see `/next/preview` — lifts
 * the condition.
 *
 * Fase 9: la lettura pubblica (published, `draft: false`) passa da
 * `unstable_cache`, taggata per collection e invalidata dall'hook
 * `afterChange`/`afterDelete` di quella collection (vedi `src/lib/revalidate.ts`
 * e `src/collections/Pages.ts` / `Projects.ts`).
 *
 * L'anteprima bozze resta intenzionalmente FUORI da `unstable_cache`: è una
 * dynamic API di Next (chiama `draftMode()`), e una bozza deve sempre
 * riflettere l'ultimo salvataggio per l'editor che la sta guardando, mai una
 * versione cacheata. Il ramo bozza qui sotto è lo stesso codice, byte per
 * byte, di prima di questa modifica.
 */

async function isDraft(): Promise<boolean> {
  const { isEnabled } = await draftMode()
  return isEnabled
}

async function fetchPageBySlug(slug: string, locale: Locale, draft: boolean): Promise<Page | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    locale,
    draft,
    depth: 2,
    limit: 1,
    pagination: false,
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })

  return result.docs[0] ?? null
}

export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  if (await isDraft()) return fetchPageBySlug(slug, locale, true)

  const read = unstable_cache(() => fetchPageBySlug(slug, locale, false), ['page', slug, locale], {
    tags: ['pages'],
  })

  return read()
})

async function fetchProjectBySlug(
  slug: string,
  locale: Locale,
  draft: boolean,
): Promise<Project | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'projects',
    locale,
    draft,
    depth: 2,
    limit: 1,
    pagination: false,
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })

  return result.docs[0] ?? null
}

export const getProjectBySlug = cache(
  async (slug: string, locale: Locale): Promise<Project | null> => {
    if (await isDraft()) return fetchProjectBySlug(slug, locale, true)

    const read = unstable_cache(
      () => fetchProjectBySlug(slug, locale, false),
      ['project', slug, locale],
      { tags: ['projects'] },
    )

    return read()
  },
)

/**
 * The same document in the other languages, so the language switcher can point
 * at the translated slug instead of at a 404. Case-study slugs are localized:
 * `/it/work/ferro-vivo` and `/en/work/living-iron` are one project.
 */
async function fetchProjectAlternates(
  id: number,
  locales: readonly Locale[],
): Promise<Record<string, string>> {
  const payload = await getPayloadClient()

  const entries = await Promise.all(
    locales.map(async (locale) => {
      const doc = await payload.findByID({
        collection: 'projects',
        id,
        locale,
        depth: 0,
        disableErrors: true,
      })

      return [locale, doc?.slug ? `/work/${doc.slug}` : null] as const
    }),
  )

  return Object.fromEntries(
    entries.filter((entry): entry is [Locale, string] => Boolean(entry[1])),
  )
}

export const getProjectAlternates = cache(
  async (id: number, locales: readonly Locale[]): Promise<Record<string, string>> => {
    const read = unstable_cache(
      () => fetchProjectAlternates(id, locales),
      ['project-alternates', String(id), locales.join(',')],
      { tags: ['projects'] },
    )

    return read()
  },
)

/**
 * Fase 9 — le stesse liste che `clients-block.tsx`, `services-block.tsx`,
 * `team-block.tsx`, `project-grid.tsx` e la pagina `/work` interrogavano
 * direttamente con `getPayloadClient()`, spostate qui perché la cache con tag
 * ha senso in un solo posto. Nessuna di queste collection ha bozze (vedi
 * `src/collections/*.ts`), quindi possono essere cacheate incondizionatamente.
 */

export const getClientsList = cache(async (locale: Locale): Promise<Client[]> => {
  const read = unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'clients',
        locale,
        depth: 1,
        limit: 30,
        sort: 'order',
      })
      return result.docs
    },
    ['clients-list', locale],
    { tags: ['clients'] },
  )

  return read()
})

export const getServicesList = cache(async (locale: Locale): Promise<Service[]> => {
  const read = unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        locale,
        depth: 0,
        limit: 20,
        sort: 'order',
      })
      return result.docs
    },
    ['services-list', locale],
    { tags: ['services'] },
  )

  return read()
})

export const getTeamMembersList = cache(async (locale: Locale): Promise<TeamMember[]> => {
  const read = unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'team-members',
        locale,
        depth: 1,
        limit: 30,
        sort: 'order',
      })
      return result.docs
    },
    ['team-members-list', locale],
    { tags: ['team-members'] },
  )

  return read()
})

export const getIndustriesList = cache(async (locale: Locale): Promise<Industry[]> => {
  const read = unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'industries',
        locale,
        depth: 0,
        limit: 20,
        sort: 'title',
      })
      return result.docs
    },
    ['industries-list', locale],
    { tags: ['industries'] },
  )

  return read()
})

/**
 * Elenco progetti filtrato: usato sia dal blocco griglia progetti (`featured`
 * o per servizio) sia dall'indice `/work` (filtri da query string). `where` e
 * `sort` entrano nella chiave di cache così combinazioni di filtri diverse non
 * si sovrascrivono a vicenda; non sono JSON-safe per natura ma qui i valori
 * restano sempre id, slug e stringhe letterali, mai input libero dell'utente.
 */
export const getProjectsList = cache(
  async (
    locale: Locale,
    options: { where: Where; limit: number; sort?: string | string[] },
  ) => {
    const { where, limit, sort = ['order', '-year'] } = options

    const read = unstable_cache(
      async () => {
        const payload = await getPayloadClient()
        return payload.find({ collection: 'projects', locale, depth: 1, limit, sort, where })
      },
      ['projects-list', locale, JSON.stringify(where), String(limit), JSON.stringify(sort)],
      { tags: ['projects'] },
    )

    return read()
  },
)

import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'
import type { Page, Project } from '@/payload-types'

import { getPayloadClient } from './payload'

/**
 * Content reads for the public site.
 *
 * The local API bypasses access control, so "published only" has to be stated
 * here explicitly: forgetting it would serve drafts to everyone. Draft mode —
 * which only an authenticated editor can turn on, see `/next/preview` — lifts
 * the condition.
 */

async function isDraft(): Promise<boolean> {
  const { isEnabled } = await draftMode()
  return isEnabled
}

export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const draft = await isDraft()

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
})

export const getProjectBySlug = cache(
  async (slug: string, locale: Locale): Promise<Project | null> => {
    const payload = await getPayloadClient()
    const draft = await isDraft()

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
  },
)

/**
 * The same document in the other languages, so the language switcher can point
 * at the translated slug instead of at a 404. Case-study slugs are localized:
 * `/it/work/ferro-vivo` and `/en/work/living-iron` are one project.
 */
export const getProjectAlternates = cache(
  async (id: number, locales: readonly Locale[]): Promise<Record<string, string>> => {
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
  },
)

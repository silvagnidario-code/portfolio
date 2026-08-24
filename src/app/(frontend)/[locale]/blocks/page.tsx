import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { hasLocale } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import type { Page, Project } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

/**
 * The block catalogue: every block of the library, in every variant, filled
 * with the real content of the CMS.
 *
 * It cycles the `variant` field on the *same* block object rather than
 * building one fixture per variant — which is what makes it a proof rather than
 * a demo: if switching variant lost content or translations, this page would
 * show it immediately.
 *
 * Internal tooling, never indexed.
 */

const variantsByBlock: Record<string, string[]> = {
  hero: ['typographic', 'webglImage', 'videoFullscreen'],
  statement: ['asymmetric', 'twoColumns', 'horizontalScroll'],
  projectGrid: ['staggeredTwo', 'compactThree', 'draggableRow'],
  media: ['fullBleed', 'pair', 'gallery', 'videoLoop', 'beforeAfter'],
  services: ['accordion', 'cards', 'numberedList'],
  results: ['animatedCounters', 'staticGrid'],
  testimonial: ['fullPage', 'slider', 'quoteWithLogo'],
  clients: ['staticGrid', 'marquee'],
  team: ['photoGrid', 'listReveal'],
  cta: ['typographicBanner', 'inlineForm', 'minimalRow'],
  faq: ['accordion'],
}

const order = Object.keys(variantsByBlock)

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'BlocksPage' })

  return { title: t('title'), robots: { index: false, follow: false } }
}

/** Picks one instance of every block type out of the seeded pages. */
async function collectBlocks(locale: Locale): Promise<Map<string, LayoutBlock>> {
  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'pages',
    locale,
    depth: 2,
    limit: 20,
  })

  const found = new Map<string, LayoutBlock>()

  for (const page of pages.docs) {
    for (const block of page.layout ?? []) {
      if (!found.has(block.blockType)) found.set(block.blockType, block)
    }
  }

  // `media` and `results` live inside case studies, not inside pages.
  const projects = await payload.find({ collection: 'projects', locale, depth: 2, limit: 1 })
  const project: Project | undefined = projects.docs[0]

  if (project) {
    const media = (project.gallery ?? [])[0]
    if (media && !found.has('media')) found.set('media', media as LayoutBlock)

    if (!found.has('results') && (project.results ?? []).length > 0) {
      found.set('results', {
        blockType: 'results',
        variant: 'staticGrid',
        heading: project.title,
        items: project.results,
        settings: { background: 'paper', spacing: 'normal', animate: true },
      } as LayoutBlock)
    }
  }

  return found
}

export default async function BlocksPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  if (!hasLocale(routing.locales, locale)) return null

  const t = await getTranslations('BlocksPage')
  const blocks = await collectBlocks(locale)

  return (
    <main className="pb-96">
      <header className="page-margin pb-64">
        <h1 className="text-display">{t('title')}</h1>
        <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>
      </header>

      {order.map((blockType) => {
        const block = blocks.get(blockType)

        return (
          <section key={blockType} className="border-t border-line">
            <h2 className="page-margin py-32 font-mono text-caption uppercase text-ink-muted">
              {blockType}
            </h2>

            {block ? (
              (variantsByBlock[blockType] ?? []).map((variant) => (
                <div key={variant}>
                  <p className="page-margin border-t border-line py-16 font-mono text-caption uppercase text-ink-muted">
                    {blockType} · {variant}
                  </p>
                  <RenderBlocks blocks={[{ ...block, variant } as LayoutBlock]} locale={locale} />
                </div>
              ))
            ) : (
              <p className="page-margin pb-32 text-body text-ink-muted">{t('empty')}</p>
            )}
          </section>
        )
      })}
    </main>
  )
}

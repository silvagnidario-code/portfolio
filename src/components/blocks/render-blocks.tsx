import type { Locale } from '@/i18n/routing'
import type { Page, Project } from '@/payload-types'

import { ClientsBlock } from './clients-block'
import { ContactFormBlock } from './contact-form'
import { Cta } from './cta'
import { Faq } from './faq'
import { Hero } from './hero'
import { MediaBlock } from './media-block'
import { ProjectGrid } from './project-grid'
import { Prose } from './prose'
import { Results } from './results'
import { ServicesBlock } from './services-block'
import { Statement } from './statement'
import { TeamBlock } from './team-block'
import { TestimonialBlock } from './testimonial-block'

type LayoutBlock = NonNullable<Page['layout']>[number]
type NarrativeBlock = NonNullable<Project['execution']>[number]

/**
 * The block engine.
 *
 * One switch, one place. A block that is not in the map renders nothing rather
 * than crashing the page: content added in the admin panel before its renderer
 * exists should leave a hole, not a stack trace.
 */
function renderBlock(block: LayoutBlock | NarrativeBlock, locale: Locale) {
  switch (block.blockType) {
    case 'hero':
      return <Hero block={block} />
    case 'statement':
      return <Statement block={block} />
    case 'projectGrid':
      return <ProjectGrid block={block} locale={locale} />
    case 'media':
      return <MediaBlock block={block} />
    case 'services':
      return <ServicesBlock block={block} locale={locale} />
    case 'results':
      return <Results block={block} />
    case 'testimonial':
      return <TestimonialBlock block={block} />
    case 'clients':
      return <ClientsBlock block={block} locale={locale} />
    case 'team':
      return <TeamBlock block={block} locale={locale} />
    case 'cta':
      return <Cta block={block} />
    case 'faq':
      return <Faq block={block} />
    case 'prose':
      return <Prose block={block} />
    default:
      return null
  }
}

export function RenderBlocks({
  blocks,
  locale,
}: {
  blocks?: Array<LayoutBlock | NarrativeBlock> | null
  locale: Locale
}) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => (
        <div key={block.id ?? `${block.blockType}-${index}`}>{renderBlock(block, locale)}</div>
      ))}
    </>
  )
}

import type { Block } from 'payload'

import { ClientsBlock } from './clients'
import { ContactForm } from './contact-form'
import { Cta } from './cta'
import { Faq } from './faq'
import { Hero } from './hero'
import { MediaBlock } from './media'
import { ProjectGrid } from './project-grid'
import { Results } from './results'
import { ServicesBlock } from './services'
import { Statement } from './statement'
import { TeamBlock } from './team'
import { TestimonialBlock } from './testimonial'

/**
 * The block library, §5. Every page is composed from these; the renderer that
 * turns them into markup arrives in phase 6.
 *
 * Each block owns a `variant` select rather than existing in several flavours:
 * changing the look of a section must never cost its content or translations.
 */
export const layoutBlocks: Block[] = [
  Hero,
  Statement,
  ProjectGrid,
  MediaBlock,
  ServicesBlock,
  Results,
  TestimonialBlock,
  ClientsBlock,
  TeamBlock,
  Cta,
  Faq,
]

export {
  ClientsBlock,
  Cta,
  Faq,
  Hero,
  MediaBlock,
  ProjectGrid,
  Results,
  ServicesBlock,
  Statement,
  TeamBlock,
  TestimonialBlock,
}

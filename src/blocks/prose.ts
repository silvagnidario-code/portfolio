import type { Block } from 'payload'

/**
 * A run of prose inside a case study. Deliberately minimal: it exists so the
 * `execution` field can alternate text and media without either becoming a
 * second-class citizen of the other.
 */
export const Prose: Block = {
  slug: 'prose',
  interfaceName: 'ProseBlock',
  labels: { singular: 'Testo', plural: 'Testi' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'body', type: 'richText', required: true, localized: true },
  ],
}

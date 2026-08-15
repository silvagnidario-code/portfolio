import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const Statement: Block = {
  slug: 'statement',
  interfaceName: 'StatementBlock',
  labels: { singular: 'Dichiarazione', plural: 'Dichiarazioni' },
  fields: [
    variantField([
      { label: 'Titolo asimmetrico', value: 'asymmetric' },
      { label: 'Due colonne con eyebrow', value: 'twoColumns' },
      { label: 'Scorrimento orizzontale', value: 'horizontalScroll' },
    ]),
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', required: true, localized: true },
    { name: 'body', type: 'richText', localized: true },
    blockSettings,
  ],
}

import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const Results: Block = {
  slug: 'results',
  interfaceName: 'ResultsBlock',
  labels: { singular: 'Risultati', plural: 'Risultati' },
  fields: [
    variantField([
      { label: 'Contatori animati', value: 'animatedCounters' },
      { label: 'Griglia statica', value: 'staticGrid' },
    ]),
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true },
        { name: 'delta', type: 'text', localized: true },
      ],
    },
    blockSettings,
  ],
}

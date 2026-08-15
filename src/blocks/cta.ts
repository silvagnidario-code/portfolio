import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const Cta: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'CTA', plural: 'CTA' },
  fields: [
    variantField([
      { label: 'Banner tipografico', value: 'typographicBanner' },
      { label: 'Con form inline', value: 'inlineForm' },
      { label: 'Riga minimale', value: 'minimalRow' },
    ]),
    { name: 'heading', type: 'textarea', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'action',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
      admin: { condition: (_, siblings) => siblings?.variant !== 'inlineForm' },
    },
    blockSettings,
  ],
}

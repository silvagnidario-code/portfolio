import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const MediaBlock: Block = {
  slug: 'media',
  interfaceName: 'MediaBlockType',
  labels: { singular: 'Media', plural: 'Media' },
  fields: [
    variantField([
      { label: 'Full bleed', value: 'fullBleed' },
      { label: 'Coppia affiancata', value: 'pair' },
      { label: 'Loop video', value: 'videoLoop' },
      { label: 'Confronto prima/dopo', value: 'beforeAfter' },
    ]),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      admin: {
        condition: (_, siblings) =>
          siblings?.variant === 'fullBleed' || siblings?.variant === 'pair',
      },
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblings) => siblings?.variant === 'videoLoop' },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblings) => siblings?.variant === 'videoLoop',
        description: 'Obbligatorio: il video non parte mai senza poster.',
      },
    },
    {
      name: 'before',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblings) => siblings?.variant === 'beforeAfter' },
    },
    {
      name: 'after',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblings) => siblings?.variant === 'beforeAfter' },
    },
    { name: 'caption', type: 'text', localized: true },
    blockSettings,
  ],
}

import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const MediaBlock: Block = {
  slug: 'media',
  interfaceName: 'MediaBlockType',
  labels: { singular: 'Media', plural: 'Media' },
  fields: [
    variantField([
      { label: 'Full bleed', value: 'fullBleed' },
      { label: 'Coppia o griglia', value: 'pair' },
      { label: 'Galleria (griglia dinamica con zoom)', value: 'gallery' },
      { label: 'Loop video', value: 'videoLoop' },
      { label: 'Confronto prima/dopo', value: 'beforeAfter' },
    ]),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      admin: {
        condition: (_, siblings) =>
          siblings?.variant === 'fullBleed' ||
          siblings?.variant === 'pair' ||
          siblings?.variant === 'gallery',
        description:
          'Con uno o due elementi è la coppia affiancata. Da tre in su diventa una griglia: 3 colonne su desktop, 2 su tablet, 1 su mobile. "Galleria" le dispone invece in una griglia dinamica in stile masonry, rispettando le proporzioni reali di ogni foto, e apre ogni immagine a schermo intero al click, con zoom e navigazione tra le foto. Ogni elemento può essere una foto o un video.',
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

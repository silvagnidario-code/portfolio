import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    variantField([
      { label: 'Video a tutto schermo', value: 'videoFullscreen' },
      { label: 'Distorsione WebGL su immagine', value: 'webglImage' },
      { label: 'Solo tipografico', value: 'typographic' },
    ]),
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', required: true, localized: true },
    { name: 'lead', type: 'textarea', localized: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblings) => siblings?.variant !== 'typographic' },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblings) => siblings?.variant === 'videoFullscreen',
        description: 'H.264 + WebM, loop entro 10-15s. Il poster e la immagine qui sopra.',
      },
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    blockSettings,
  ],
}

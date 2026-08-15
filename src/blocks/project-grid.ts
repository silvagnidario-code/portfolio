import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const ProjectGrid: Block = {
  slug: 'projectGrid',
  interfaceName: 'ProjectGridBlock',
  labels: { singular: 'Griglia progetti', plural: 'Griglie progetti' },
  fields: [
    variantField([
      { label: 'Due colonne sfalsate', value: 'staggeredTwo' },
      { label: 'Tre colonne compatte', value: 'compactThree' },
      { label: 'Lista orizzontale trascinabile', value: 'draggableRow' },
    ]),
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'featured',
      options: [
        { label: 'In evidenza', value: 'featured' },
        { label: 'Selezione manuale', value: 'manual' },
        { label: 'Per servizio', value: 'byService' },
      ],
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { condition: (_, siblings) => siblings?.source === 'manual' },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { condition: (_, siblings) => siblings?.source === 'byService' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 24,
      admin: { condition: (_, siblings) => siblings?.source !== 'manual' },
    },
    blockSettings,
  ],
}

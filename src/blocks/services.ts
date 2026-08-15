import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlockType',
  labels: { singular: 'Servizi', plural: 'Servizi' },
  fields: [
    variantField([
      { label: 'Accordion', value: 'accordion' },
      { label: 'Griglia di card', value: 'cards' },
      { label: 'Lista numerata', value: 'numberedList' },
    ]),
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Se vuoto mostra tutti i servizi, nel loro ordine.' },
    },
    blockSettings,
  ],
}

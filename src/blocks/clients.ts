import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const ClientsBlock: Block = {
  slug: 'clients',
  interfaceName: 'ClientsBlockType',
  labels: { singular: 'Clienti', plural: 'Clienti' },
  fields: [
    variantField([
      { label: 'Griglia statica', value: 'staticGrid' },
      { label: 'Marquee infinito', value: 'marquee' },
    ]),
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      admin: { description: 'Se vuoto mostra tutti i clienti, nel loro ordine.' },
    },
    blockSettings,
  ],
}

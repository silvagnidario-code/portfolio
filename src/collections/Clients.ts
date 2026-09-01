import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'
import { revalidateOnChange, revalidateOnDelete } from '../lib/revalidate'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Cliente', plural: 'Clienti' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Contenuti' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  defaultSort: 'order',
  // Il blocco Clienti può incorporare un cliente scelto a mano dentro una
  // pagina, quindi il salvataggio invalida anche la cache delle pagine.
  hooks: {
    afterChange: [revalidateOnChange('clients', 'pages')],
    afterDelete: [revalidateOnDelete('clients', 'pages')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'SVG monocromatico, che possa vivere su carta e su inchiostro.' },
    },
    { name: 'url', type: 'text' },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

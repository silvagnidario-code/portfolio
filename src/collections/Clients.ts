import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Cliente', plural: 'Clienti' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Contenuti' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  defaultSort: 'order',
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

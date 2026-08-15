import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Persona', plural: 'Team' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'], group: 'Contenuti' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true, localized: true },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Link' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

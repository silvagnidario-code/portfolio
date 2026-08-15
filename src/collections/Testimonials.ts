import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonianza', plural: 'Testimonianze' },
  admin: { useAsTitle: 'author', defaultColumns: ['author', 'company'], group: 'Contenuti' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'author', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'company', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
  ],
}

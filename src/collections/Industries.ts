import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'
import { slugField, slugFromTitle } from '../fields/slug'
import { revalidateOnChange, revalidateOnDelete } from '../lib/revalidate'

/** Sectors a project belongs to. Feeds the filters on the work index. */
export const Industries: CollectionConfig = {
  slug: 'industries',
  labels: { singular: 'Settore', plural: 'Settori' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'], group: 'Tassonomie' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  // Ogni progetto porta un settore obbligatorio ("industry") — il salvataggio
  // invalida anche la cache dei progetti.
  hooks: {
    beforeValidate: [slugFromTitle('title')],
    afterChange: [revalidateOnChange('industries', 'projects')],
    afterDelete: [revalidateOnDelete('industries', 'projects')],
  },
  fields: [{ name: 'title', type: 'text', required: true, localized: true }, slugField('title')],
}

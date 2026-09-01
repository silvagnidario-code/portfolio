import type { CollectionConfig } from 'payload'

import { admins, anyone, authenticated } from '../access/roles'
import { metaGroup } from '../fields/meta'
import { slugField, slugFromTitle } from '../fields/slug'
import { revalidateOnChange, revalidateOnDelete } from '../lib/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Servizio', plural: 'Servizi' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'slug'],
    group: 'Contenuti',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: admins },
  defaultSort: 'order',
  // Referenziato dal blocco Servizi nelle pagine e dal campo "services" nei
  // progetti (filtri dell'indice) — il salvataggio invalida entrambe le cache.
  hooks: {
    beforeValidate: [slugFromTitle('title')],
    afterChange: [revalidateOnChange('services', 'pages', 'projects')],
    afterDelete: [revalidateOnDelete('services', 'pages', 'projects')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      required: true,
      admin: { description: 'Una riga. Compare nelle griglie e negli elenchi.' },
    },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'SVG monocromatico.' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    metaGroup,
  ],
}

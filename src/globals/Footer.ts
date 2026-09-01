import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access/roles'
import { revalidateGlobalOnChange } from '../lib/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Configurazione' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobalOnChange('global:footer')] },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Colonne',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'legalText',
      type: 'textarea',
      localized: true,
      admin: { description: 'Riga legale in fondo. Anno e ragione sociale esclusi.' },
    },
  ],
}

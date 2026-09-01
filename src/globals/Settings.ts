import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access/roles'
import { revalidateGlobalOnChange } from '../lib/revalidate'

/** Identity and contact data, everything the site needs to say who it is. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Impostazioni',
  admin: { group: 'Configurazione' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobalOnChange('global:settings')] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logoLight',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'SVG per il tema chiaro.' },
        },
        {
          name: 'logoDark',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'SVG per il tema scuro.' },
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contatti',
      fields: [
        { name: 'email', type: 'email', required: true },
        {
          name: 'briefRecipient',
          type: 'email',
          required: true,
          admin: { description: 'Dove arrivano i brief inviati dal form contatti.' },
        },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Sedi',
      fields: [
        { name: 'city', type: 'text', required: true, localized: true },
        { name: 'address', type: 'textarea', required: true, localized: true },
        { name: 'timezone', type: 'text' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Social',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'legalName',
      type: 'text',
      admin: { description: 'Ragione sociale, usata nel JSON-LD e nel footer.' },
    },
    { name: 'vatId', type: 'text' },
  ],
}

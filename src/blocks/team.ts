import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlockType',
  labels: { singular: 'Team', plural: 'Team' },
  fields: [
    variantField([
      { label: 'Griglia fotografica', value: 'photoGrid' },
      { label: 'Lista con reveal', value: 'listReveal' },
    ]),
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      admin: { description: 'Se vuoto mostra tutto il team, nel suo ordine.' },
    },
    blockSettings,
  ],
}

import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access/roles'

/** Menu items, ordered by the editor, localized label by label. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigazione',
  admin: { group: 'Configurazione' },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Voci',
      required: true,
      minRows: 1,
      admin: { description: "Trascinare per riordinare: l'ordine qui e l'ordine nel menu." },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'internal',
          options: [
            { label: 'Percorso interno', value: 'internal' },
            { label: 'Pagina', value: 'page' },
            { label: 'URL esterno', value: 'external' },
          ],
        },
        {
          name: 'path',
          type: 'text',
          admin: {
            condition: (_, siblings) => siblings?.type === 'internal',
            description: 'Senza prefisso di lingua, es. /work.',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: { condition: (_, siblings) => siblings?.type === 'page' },
        },
        {
          name: 'url',
          type: 'text',
          admin: { condition: (_, siblings) => siblings?.type === 'external' },
        },
      ],
    },
  ],
}

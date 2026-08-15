import type { Field } from 'payload'

/**
 * Per-document SEO overrides. Everything is optional and localized: when a
 * field is empty the page falls back to `seo-defaults` and to the document's
 * own title, which is the right answer most of the time.
 */
export const metaGroup: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Se vuoto usa il titolo del documento.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      maxLength: 200,
      admin: { description: '150–160 caratteri circa.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Se vuota viene generata dal titolo del documento.' },
    },
  ],
}

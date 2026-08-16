import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access/roles'
/** Fallback metadata: what a page says about itself when it says nothing. */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO di default',
  admin: { group: 'Configurazione' },
  access: { read: anyone, update: authenticated },
  fields: [
    { name: 'siteName', type: 'text', required: true, localized: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (header)',
      admin: {
        description: 'SVG o PNG con sfondo trasparente. Se vuoto, resta il testo del sito.',
      },
    },
    {
      name: 'titleTemplate',
      type: 'text',
      required: true,
      defaultValue: '%s - Studio',
      admin: { description: '%s viene sostituito dal titolo della pagina.' },
    },
    { name: 'description', type: 'textarea', required: true, localized: true, maxLength: 200 },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}

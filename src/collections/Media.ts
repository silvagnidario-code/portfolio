import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Sistema',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    // Files live on S3/R2 (see the storage plugin in payload.config.ts),
    // never on the app filesystem.
    focalPoint: true,
    /**
     * Widths chosen against the grid rather than against round numbers: a card
     * in the three-column variant, a half-page pair, and the full-bleed case.
     * `withoutEnlargement` keeps a small logo from being blown up into mush.
     */
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true },
      { name: 'card', width: 768, withoutEnlargement: true },
      { name: 'wide', width: 1280, withoutEnlargement: true },
      { name: 'full', width: 1920, withoutEnlargement: true },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Testo alternativo, obbligatorio e tradotto in ogni lingua.',
      },
    },
  ],
}

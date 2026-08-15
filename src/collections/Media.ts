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
    // Image sizes are added in phase 2, once the breakpoints of the design
    // system exist. Adding them earlier would mean re-generating every asset.
    imageSizes: [],
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

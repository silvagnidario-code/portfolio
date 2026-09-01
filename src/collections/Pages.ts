import type { CollectionConfig } from 'payload'

import { admins, authenticated, authenticatedOrPublished } from '../access/roles'
import { layoutBlocks } from '../blocks'
import { metaGroup } from '../fields/meta'
import { slugField, slugFromTitle } from '../fields/slug'
import { revalidateOnChange, revalidateOnDelete } from '../lib/revalidate'
import { generatePreviewPath } from '../utilities/generate-preview-path'

/**
 * Free pages, composed from the block library: home, services, about and
 * anything added later without a deploy.
 *
 * The home page is the document with slug `home`, served at the locale root.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Contenuti',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'pages',
          slug: typeof data?.slug === 'string' ? data.slug : '',
          locale: req.locale ?? 'it',
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'pages',
        slug: typeof data?.slug === 'string' ? data.slug : '',
        locale: req.locale ?? 'it',
      }),
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: admins,
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
    maxPerDoc: 25,
  },
  hooks: {
    beforeValidate: [slugFromTitle('title')],
    afterChange: [revalidateOnChange('pages')],
    afterDelete: [revalidateOnDelete('pages')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    metaGroup,
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: layoutBlocks,
      admin: { initCollapsed: true },
    },
  ],
}

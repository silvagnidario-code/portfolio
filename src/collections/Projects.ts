import type { CollectionConfig } from 'payload'

import { admins, authenticated, authenticatedOrPublished } from '../access/roles'
import { MediaBlock } from '../blocks/media'
import { Prose } from '../blocks/prose'
import { metaGroup } from '../fields/meta'
import { slugField, slugFromTitle } from '../fields/slug'
import { revalidateOnChange, revalidateOnDelete } from '../lib/revalidate'
import { generatePreviewPath } from '../utilities/generate-preview-path'

/**
 * Case studies — the most important model in the project.
 *
 * Every piece of running text is localized: a case study is the one page a
 * prospect is expected to read end to end, so it has to read as if it had been
 * written in their language, not translated into it.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Progetto', plural: 'Progetti' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'year', 'featured', '_status'],
    group: 'Contenuti',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'projects',
          slug: typeof data?.slug === 'string' ? data.slug : '',
          locale: req.locale ?? 'it',
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'projects',
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
  defaultSort: ['order', '-year'],
  versions: {
    drafts: { autosave: { interval: 375 } },
    maxPerDoc: 25,
  },
  hooks: {
    beforeValidate: [slugFromTitle('title')],
    afterChange: [revalidateOnChange('projects')],
    afterDelete: [revalidateOnDelete('projects')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Ordinamento manuale, crescente.' },
    },
    metaGroup,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identità',
          fields: [
            { name: 'client', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  min: 1990,
                  max: 2100,
                  admin: { width: '50%' },
                },
                {
                  name: 'industry',
                  type: 'relationship',
                  relationTo: 'industries',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              required: true,
              admin: { description: "Alimenta i filtri dell'indice progetti." },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Immagine di griglia. Il focal point si imposta sul media.' },
            },
            {
              name: 'coverVideo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: "Loop breve per l'hover in griglia. Opzionale." },
            },
            {
              name: 'heroMedia',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Apertura della pagina di dettaglio.' },
            },
            {
              name: 'accentColor',
              type: 'text',
              validate: (value: string | null | undefined) => {
                if (!value) return true
                return /^#[0-9a-fA-F]{6}$/.test(value)
                  ? true
                  : 'Deve essere un colore esadecimale, es. #A83A15.'
              },
              admin: {
                description:
                  'Hex estratto dal progetto: tinge la pagina di dettaglio. Il contrasto va verificato in styleguide.',
              },
            },
            {
              name: 'gallery',
              type: 'blocks',
              blocks: [MediaBlock],
              admin: { description: 'Galleria libera, con le stesse varianti del blocco Media.' },
            },
          ],
        },
        {
          label: 'Narrazione',
          fields: [
            {
              name: 'claim',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'Apertura breve. Una frase, non un paragrafo.' },
            },
            { name: 'context', type: 'richText', localized: true },
            { name: 'challenge', type: 'richText', localized: true },
            { name: 'approach', type: 'richText', localized: true },
            {
              name: 'execution',
              type: 'blocks',
              blocks: [Prose, MediaBlock],
              admin: { description: "Testo e media alternati, nell'ordine in cui si leggono." },
            },
            {
              name: 'results',
              type: 'array',
              labels: { singular: 'Risultato', plural: 'Risultati' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'value', type: 'text', required: true },
                { name: 'delta', type: 'text', localized: true },
              ],
            },
            { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
          ],
        },
        {
          label: 'Crediti',
          fields: [
            { name: 'team', type: 'relationship', relationTo: 'team-members', hasMany: true },
            {
              name: 'partners',
              type: 'array',
              labels: { singular: 'Partner', plural: 'Partner' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', required: true, localized: true },
              ],
            },
            { name: 'liveUrl', type: 'text' },
            {
              name: 'awards',
              type: 'array',
              labels: { singular: 'Premio', plural: 'Premi' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'category', type: 'text', localized: true },
                { name: 'year', type: 'number', min: 1990, max: 2100 },
              ],
            },
            {
              name: 'related',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
      ],
    },
  ],
}

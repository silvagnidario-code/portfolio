import type { Block } from 'payload'

import { blockSettings } from './shared'

/**
 * A single portrait alongside a header and a bio: the "chi sono" block. One
 * photo, one heading, one longer piece of running text, and an optional list
 * of links (social, portfolio elsewhere, a CV) the person wants next to it.
 *
 * No variant here on purpose — unlike the rest of the library this block has
 * exactly one composition (photo one side, text the other) with only the
 * side itself as a choice, so a `variant` select would just be `imagePosition`
 * wearing a costume.
 */
export const Bio: Block = {
  slug: 'bio',
  interfaceName: 'BioBlockType',
  labels: { singular: 'Foto e bio', plural: 'Foto e bio' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Eyebrow (opzionale)' },
    { name: 'heading', type: 'text', required: true, localized: true, label: 'Titolo' },
    { name: 'body', type: 'richText', localized: true, label: 'Bio' },
    {
      name: 'links',
      type: 'array',
      label: 'Link (social, sito, CV...)',
      labels: { singular: 'Link', plural: 'Link' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media', required: true, label: 'Foto' },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posizione foto',
      required: true,
      defaultValue: 'right',
      options: [
        { label: 'Destra', value: 'right' },
        { label: 'Sinistra', value: 'left' },
      ],
    },
    blockSettings,
  ],
}

export default Bio

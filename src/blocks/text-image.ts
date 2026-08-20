import type { Block } from 'payload'

/**
 * Salva come: src/blocks/text-image.ts
 * (sostituisce/elimina la vecchia cartella src/blocks/text-image-block/)
 */
export const TextImage: Block = {
  slug: 'textImage',
  interfaceName: 'TextImageBlockType',
  labels: { singular: 'Testo + Immagine', plural: 'Testo + Immagine' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Eyebrow' },
    { name: 'title', type: 'text', required: true, localized: true, label: 'Titolo' },
    { name: 'description', type: 'textarea', localized: true, label: 'Descrizione' },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to action (opzionale)',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Immagine',
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posizione immagine',
      defaultValue: 'right',
      options: [
        { label: 'Destra', value: 'right' },
        { label: 'Sinistra', value: 'left' },
      ],
    },
    {
      name: 'fullBleed',
      type: 'checkbox',
      label: 'Immagine a piena larghezza (senza raggio agli angoli)',
      defaultValue: false,
    },
  ],
}

export default TextImage

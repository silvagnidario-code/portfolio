import type { Block } from 'payload'

import { blockSettings, variantField } from './shared'

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlockType',
  labels: { singular: 'Testimonianza', plural: 'Testimonianze' },
  fields: [
    variantField([
      { label: 'Singola a tutta pagina', value: 'fullPage' },
      { label: 'Slider', value: 'slider' },
      { label: 'Citazione con logo', value: 'quoteWithLogo' },
    ]),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
    },
    blockSettings,
  ],
}

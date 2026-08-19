import type { Block } from 'payload'

import { blockSettings } from './shared'

/**
 * The brief form itself stays in code — honeypot, rate limit and Zod
 * validation live in one place, per the note on the `cta` block's inline-form
 * variant. What becomes editable here is everything around it: the heading,
 * the lead, and whether to show the email/offices already managed in
 * Impostazioni globali. There is only one contact page, so no variant field.
 */
export const ContactForm: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Form di contatto', plural: 'Form di contatto' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', required: true, localized: true },
    { name: 'lead', type: 'textarea', localized: true },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      label: 'Mostra email e sedi',
      defaultValue: true,
      admin: { description: 'Letti dalle Impostazioni globali, non duplicati qui.' },
    },
    blockSettings,
  ],
}
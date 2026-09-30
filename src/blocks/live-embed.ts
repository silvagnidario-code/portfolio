import type { Block } from 'payload'

import { blockSettings } from './shared'

/**
 * A live, navigable window onto another site — the case study's own project,
 * typically — embedded directly in the page via `<iframe>`.
 *
 * Caveat that can't be engineered away: many sites refuse to be framed
 * (`X-Frame-Options` / `frame-ancestors`), and a blocked frame fails silently
 * — no error a script can catch, just an empty box. There is no reliable way
 * to detect that from the parent page, so the fallback link is never
 * conditional on failure; it always sits with the frame, not behind it.
 */
export const LiveEmbed: Block = {
  slug: 'liveEmbed',
  interfaceName: 'LiveEmbedBlock',
  labels: { singular: 'Sito live (iframe)', plural: 'Siti live (iframe)' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description:
          'URL completo (con https://). Alcuni siti rifiutano di essere incorporati: se il riquadro resta vuoto, è quello — non un errore di questo blocco.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Obbligatorio.'
        try {
          const parsed = new URL(value)
          return parsed.protocol === 'https:' || parsed.protocol === 'http:'
            ? true
            : "Deve iniziare con 'https://' o 'http://'."
        } catch {
          return "URL non valido — deve includere 'https://'."
        }
      },
    },
    {
      name: 'height',
      type: 'number',
      required: true,
      defaultValue: 640,
      min: 320,
      max: 1200,
      admin: {
        description: 'Altezza del riquadro in pixel (desktop). Si adatta da solo sotto i tablet.',
      },
    },
    {
      name: 'fallbackLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Apri il sito in una nuova scheda',
      admin: { description: 'Testo del link che affianca il riquadro, sempre visibile.' },
    },
    blockSettings,
  ],
}

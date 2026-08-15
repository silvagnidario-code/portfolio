import type { CollectionBeforeValidateHook, Field } from 'payload'

/**
 * URL-safe slug, unique per locale. Localized on purpose: `/it/work/rinascita`
 * and `/en/work/rebirth` are the same document, and a shared slug would force
 * one language to carry the other's words.
 */

export function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      // Strip combining accents: "identità" becomes "identita", not "identit".
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      // Han characters survive: a chinese slug is a legitimate URL.
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

/** Fills an empty slug from the tracked field, per locale. */
export const slugFromTitle =
  (trackedField: string): CollectionBeforeValidateHook =>
  ({ data }) => {
    if (!data) return data

    const current = data[trackedField]
    if (!data.slug && typeof current === 'string' && current.length > 0) {
      data.slug = slugify(current)
    }

    return data
  }

export const slugField = (trackedField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  localized: true,
  admin: {
    position: 'sidebar',
    description: `Generato da "${trackedField}" se lasciato vuoto. Cambiarlo cambia l'URL.`,
  },
})

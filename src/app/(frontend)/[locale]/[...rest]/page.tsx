import { notFound } from 'next/navigation'

/**
 * Catch-all for unknown paths inside a locale segment. Without it, Next falls
 * back to its own untranslated 404 page instead of `[locale]/not-found.tsx`.
 */
export default function CatchAllPage() {
  notFound()
}

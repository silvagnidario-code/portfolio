import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Locale-aware replacements for the Next navigation primitives. Components must
 * import from here, never from `next/link` or `next/navigation`, otherwise the
 * locale prefix is lost.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)

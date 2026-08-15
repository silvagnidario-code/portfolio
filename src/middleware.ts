import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Everything except the Payload admin panel, the Payload API, Next internals
   * and files with an extension.
   *
   * `admin`, `api` and `next` MUST stay excluded: routing them through the
   * locale middleware rewrites them to `/it/admin` and breaks the CMS, and
   * `/next/preview` has to reach its route handler unprefixed.
   */
  matcher: ['/((?!admin|api|next|_next|_vercel|media|.*\\..*).*)'],
}

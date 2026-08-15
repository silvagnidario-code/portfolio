import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Everything except the Payload admin panel, the Payload API, Next internals
   * and files with an extension.
   *
   * `admin` and `api` MUST stay excluded: routing them through the locale
   * middleware rewrites them to `/it/admin` and breaks the CMS.
   */
  matcher: ['/((?!admin|api|_next|_vercel|media|.*\\..*).*)'],
}

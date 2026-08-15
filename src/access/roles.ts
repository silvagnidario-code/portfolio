import type { Access, FieldAccess, PayloadRequest } from 'payload'

/** Anyone with a valid session. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/**
 * Who may open the admin panel. Separate from `authenticated` because the
 * `admin` access function may only return a boolean, never a query.
 */
export const canAccessAdminUI = ({ req: { user } }: { req: PayloadRequest }): boolean =>
  Boolean(user)

/** Only users with the `admin` role. */
export const admins: Access = ({ req: { user } }) => user?.role === 'admin'

/** Admins, or the user acting on their own document. */
export const adminsOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.id === id
}

/** Field-level guard: only admins may change the value. */
export const adminsFieldAccess: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

/** Public read access, used for content that the site renders anonymously. */
export const anyone: Access = () => true

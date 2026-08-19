import { z } from 'zod'

/**
 * The brief, §11. Validated on the server — a client-side check is a courtesy,
 * not a guarantee, and this form reaches an inbox.
 */

export const timelines = ['asap', 'quarter', 'halfYear', 'exploring'] as const

export const briefSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.email(),
  timeline: z.enum(timelines),
  message: z.string().trim().min(20).max(4000),
})

/**
 * Honeypot field name. It is checked before validation and outside the schema:
 * a bot that fills it must get the same answer as a person who succeeded, not
 * a form error pointing at the trap.
 */
export const HONEYPOT_FIELD = 'website'

export type Brief = z.infer<typeof briefSchema>

export type BriefFieldName = keyof Brief

export type BriefState = {
  status: 'idle' | 'success' | 'error'
  /** Translation keys, resolved by the form: the action never returns prose. */
  errors?: Partial<Record<BriefFieldName, 'invalid'>>
  message?: 'sent' | 'invalid' | 'rateLimited' | 'notConfigured' | 'failed'
}

'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'

import type { Locale } from '@/i18n/routing'
import { briefSchema, HONEYPOT_FIELD, type BriefFieldName, type BriefState } from '@/lib/brief'
import { env } from '@/lib/env'
import { getGlobal } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'

/**
 * Receives a brief and emails it. Nothing is written to the database, as §11
 * requires — the inbox is the record.
 *
 * Three defences, in order of cost: the honeypot rejects the cheapest bots, the
 * rate limit blunts the rest, and Zod makes sure whatever reaches the inbox is
 * shaped like a brief.
 */
export async function submitBrief(
  locale: Locale,
  _previous: BriefState,
  formData: FormData,
): Promise<BriefState> {
  // Checked first, and answered as a success: a bot that learns it tripped a
  // honeypot simply stops filling it.
  if (String(formData.get(HONEYPOT_FIELD) ?? '').length > 0) {
    return { status: 'success', message: 'sent' }
  }

  const parsed = briefSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    projectType: formData.get('projectType'),
    budget: formData.get('budget'),
    timeline: formData.get('timeline'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    const errors: Partial<Record<BriefFieldName, 'invalid'>> = {}

    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string') errors[field as BriefFieldName] = 'invalid'
    }

    return { status: 'error', errors, message: 'invalid' }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const limit = rateLimit(`brief:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })

  if (!limit.allowed) {
    return { status: 'error', message: 'rateLimited' }
  }

  const settings = await getGlobal('settings', locale)
  const recipient = settings.contact?.briefRecipient

  if (!recipient) {
    console.error('No brief recipient configured in the settings global.')
    return { status: 'error', message: 'notConfigured' }
  }

  const { name, company, email, projectType, budget, timeline, message } = parsed.data

  const body = [
    `Nome: ${name}`,
    company ? `Azienda: ${company}` : null,
    `Email: ${email}`,
    `Tipo di progetto: ${projectType}`,
    `Budget: ${budget}`,
    `Tempistiche: ${timeline}`,
    `Lingua: ${locale}`,
    '',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n')

  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === 'development') {
      console.warn(`RESEND_API_KEY missing; brief not sent. It would have been:\n${body}`)
      return { status: 'success', message: 'sent' }
    }

    console.error('RESEND_API_KEY missing: the brief could not be sent.')
    return { status: 'error', message: 'notConfigured' }
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: recipient,
      replyTo: email,
      subject: `Brief — ${name}${company ? ` (${company})` : ''}`,
      text: body,
    })

    if (error) {
      console.error('Resend refused the brief:', error)
      return { status: 'error', message: 'failed' }
    }
  } catch (error) {
    console.error('Sending the brief failed:', error)
    return { status: 'error', message: 'failed' }
  }

  return { status: 'success', message: 'sent' }
}

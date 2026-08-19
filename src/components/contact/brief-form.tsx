'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useId } from 'react'

import type { Locale } from '@/i18n/routing'
import { HONEYPOT_FIELD, timelines, type BriefState } from '@/lib/brief'

type BriefFormProps = {
  locale: Locale
  action: (locale: Locale, previous: BriefState, formData: FormData) => Promise<BriefState>
}

const initial: BriefState = { status: 'idle' }

/**
 * The brief form.
 *
 * Confirmation is inline, never a redirect: what the reader wrote stays on
 * screen next to the answer. Errors are announced through a live region and
 * each field points at its own message with `aria-describedby`, so a screen
 * reader hears what to fix without hunting.
 */
export function BriefForm({ locale, action }: BriefFormProps) {
  const t = useTranslations('ContactPage')
  const [state, formAction, pending] = useActionState(action.bind(null, locale), initial)
  const formId = useId()

  const fieldId = (name: string) => `${formId}-${name}`
  const errorId = (name: string) => `${formId}-${name}-error`

  const invalid = (name: keyof NonNullable<BriefState['errors']>) => Boolean(state.errors?.[name])

  const fieldClasses =
    'mt-8 w-full border border-line-strong bg-surface px-16 py-12 text-body text-ink'

  const Label = ({ name, children }: { name: string; children: React.ReactNode }) => (
    <label htmlFor={fieldId(name)} className="font-mono text-caption uppercase text-ink-muted">
      {children}
    </label>
  )

  const Error = ({ name }: { name: keyof NonNullable<BriefState['errors']> }) =>
    invalid(name) ? (
      <p id={errorId(name)} className="mt-8 text-caption text-accent">
        {t('invalidField')}
      </p>
    ) : null

  if (state.status === 'success') {
    return (
      <p role="status" className="max-w-measure text-h3 text-balance">
        {t('status.sent')}
      </p>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-32">
      <p role="status" aria-live="polite" className="sr-only">
        {pending ? t('sending') : ''}
      </p>

      {state.status === 'error' && state.message ? (
        <p role="alert" className="max-w-measure text-body-lg text-accent">
          {t(`status.${state.message}`)}
        </p>
      ) : null}

      <div className="grid gap-32 tablet:grid-cols-2">
        <div>
          <Label name="name">{t('name')}</Label>
          <input
            id={fieldId('name')}
            name="name"
            required
            autoComplete="name"
            aria-invalid={invalid('name')}
            aria-describedby={invalid('name') ? errorId('name') : undefined}
            className={fieldClasses}
          />
          <Error name="name" />
        </div>

        <div>
          <Label name="company">
            {t('company')} <span className="normal-case">({t('optional')})</span>
          </Label>
          <input
            id={fieldId('company')}
            name="company"
            autoComplete="organization"
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <Label name="email">{t('email')}</Label>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={invalid('email')}
          aria-describedby={invalid('email') ? errorId('email') : undefined}
          className={fieldClasses}
        />
        <Error name="email" />
      </div>

      <div className="max-w-xs">
        <Label name="timeline">{t('timeline')}</Label>
        <select id={fieldId('timeline')} name="timeline" className={fieldClasses}>
          {timelines.map((value) => (
            <option key={value} value={value}>
              {t(`timelines.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label name="message">{t('message')}</Label>
        <textarea
          id={fieldId('message')}
          name="message"
          required
          rows={8}
          aria-invalid={invalid('message')}
          aria-describedby={invalid('message') ? errorId('message') : `${formId}-message-hint`}
          className={fieldClasses}
        />
        <p id={`${formId}-message-hint`} className="mt-8 text-caption text-ink-muted">
          {t('messageHint')}
        </p>
        <Error name="message" />
      </div>

      {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={fieldId(HONEYPOT_FIELD)}>{t('honeypot')}</label>
        <input
          id={fieldId(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="border border-line-strong px-32 py-16 text-body-lg transition ease-reveal duration-fast hover:bg-surface-2 disabled:opacity-60"
        >
          {pending ? t('sending') : t('submit')}
        </button>
      </div>
    </form>
  )
}

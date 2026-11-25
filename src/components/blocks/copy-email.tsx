'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

/**
 * The address as a button: one click copies it, and a polite live region
 * says so. Where the clipboard is unavailable (an insecure context, an old
 * browser) the click falls back to opening the mail client instead, so the
 * button never does nothing.
 */
export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations('Contact')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[3.25rem] items-center gap-12 border border-current px-24 font-mono text-caption transition ease-reveal duration-fast hover:bg-ink hover:text-surface"
      >
        {copied ? t('copied') : `${email} — ${t('copy')}`}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t('copiedStatus') : ''}
      </span>
    </>
  )
}

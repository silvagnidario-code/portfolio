import { getTranslations } from 'next-intl/server'

/**
 * First stop for a keyboard, invisible until it is focused. Without it every
 * page starts with the whole menu before the content.
 */
export async function SkipLink() {
  const t = await getTranslations('Layout')

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-24 focus:left-24 focus:z-100 focus:rounded-glass-sm focus:bg-ink focus:px-24 focus:py-16 focus:text-body focus:text-ink-inverse"
    >
      {t('skipToContent')}
    </a>
  )
}

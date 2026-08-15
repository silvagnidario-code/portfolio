import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

/**
 * Known Next 15 limitation: a `notFound()` raised below a root layout that
 * lives inside a dynamic segment (`[locale]`) is rendered in Next's own
 * `__next_error__` HTML shell, so this page inherits neither the `lang`
 * attribute nor the `<body>` of the layout. To be revisited in phase 5, when
 * the theme class starts living on those elements.
 */

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <main className="page-margin py-128">
      <h1 className="text-h1">{t('title')}</h1>
      <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('description')}</p>
      <Link href="/" className="mt-48 inline-block text-body-lg underline">
        {t('backHome')}
      </Link>
    </main>
  )
}

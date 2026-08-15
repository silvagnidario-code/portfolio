import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('HomePage')
  const tNav = await getTranslations('Navigation')

  return (
    <main className="page-margin pb-96">
      <h1 className="text-display">{t('title')}</h1>
      <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>

      <nav className="mt-48 flex flex-wrap gap-24" aria-label={tNav('home')}>
        <Link href="/work" className="text-body-lg underline">
          {tNav('work')}
        </Link>
        <Link href="/styleguide" className="text-body-lg underline">
          {t('styleguide')}
        </Link>
      </nav>
    </main>
  )
}

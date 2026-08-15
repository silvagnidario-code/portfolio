import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'WorkPage' })

  return { title: t('title') }
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('WorkPage')
  const tNav = await getTranslations('Navigation')

  return (
    <main className="page-margin pb-96">
      <h1 className="text-h1">{t('title')}</h1>
      <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>
      <Link href="/" className="mt-48 inline-block text-body-lg underline">
        {tNav('home')}
      </Link>
    </main>
  )
}

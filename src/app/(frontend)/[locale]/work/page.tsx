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
    <main>
      <h1>{t('title')}</h1>
      <p>{t('intro')}</p>
      <Link href="/">{tNav('home')}</Link>
    </main>
  )
}

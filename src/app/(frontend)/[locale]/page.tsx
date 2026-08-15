import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('HomePage')
  const tNav = await getTranslations('Navigation')

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('intro')}</p>
      <nav aria-label={tNav('work')}>
        <ul>
          <li>
            <Link href="/work">{tNav('work')}</Link>
          </li>
        </ul>
      </nav>
      <ul>
        {routing.locales.map((code) => (
          <li key={code}>
            <Link href="/" locale={code}>
              {code}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

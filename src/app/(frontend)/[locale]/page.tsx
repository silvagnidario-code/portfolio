import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ThemeSwitcher } from '@/components/theme/theme-switcher'
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
    <main className="page-margin py-96">
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

      <div className="mt-48 flex flex-wrap items-start gap-32">
        <ThemeSwitcher />
        <ul className="flex gap-16">
          {routing.locales.map((code) => (
            <li key={code}>
              <Link
                href="/"
                locale={code}
                className="border border-line-strong px-16 py-8 font-mono text-caption uppercase"
              >
                {code}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

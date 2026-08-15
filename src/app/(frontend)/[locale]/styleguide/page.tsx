import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AliasesSection } from '@/components/styleguide/aliases-section'
import { ColorSection } from '@/components/styleguide/color-section'
import { ContrastSection } from '@/components/styleguide/contrast-section'
import { GlassSection } from '@/components/styleguide/glass-section'
import { MotionSection } from '@/components/styleguide/motion-section'
import { ShapeSection } from '@/components/styleguide/shape-section'
import { SpacingSection } from '@/components/styleguide/spacing-section'
import { TypographySection } from '@/components/styleguide/typography-section'
import { Link } from '@/i18n/navigation'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Styleguide' })

  return {
    title: t('title'),
    // Internal tooling: never indexed.
    robots: { index: false, follow: false },
  }
}

export default async function StyleguidePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Styleguide')
  const tNav = await getTranslations('Navigation')

  return (
    <main>
      <header className="page-margin pb-96">
        <p className="font-mono text-caption uppercase text-ink-muted">{tNav('home')}</p>
        <h1 className="mt-24 text-display">{t('title')}</h1>
        <p className="mt-32 max-w-measure text-body-lg text-ink-2">{t('intro')}</p>
      </header>

      <ColorSection />
      <ContrastSection />
      <TypographySection />
      <SpacingSection />
      <MotionSection />
      <ShapeSection />
      <GlassSection />
      <AliasesSection />

      <footer className="page-margin border-t border-line py-96">
        <Link href="/" className="text-body-lg underline">
          {tNav('home')}
        </Link>
      </footer>
    </main>
  )
}

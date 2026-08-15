import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { GlassBudgetProvider } from '@/components/glass/glass-budget'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeScript } from '@/components/theme/theme-script'
import { CjkStylesheet, FontLinks } from '@/components/typography/font-links'
import { routing } from '@/i18n/routing'
import { geistMono } from '@/lib/fonts'

import '@/styles/globals.css'

type LayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Site' })

  return {
    title: { default: t('name'), template: `%s — ${t('name')}` },
    description: t('tagline'),
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enables static rendering for this locale segment.
  setRequestLocale(locale)

  return (
    // The inline theme script mutates data-theme before React hydrates.
    <html lang={locale} className={geistMono.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <FontLinks />
        {/* Han glyphs are requested only where they are read. */}
        {locale === 'zh' ? <CjkStylesheet /> : null}
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <GlassBudgetProvider>{children}</GlassBudgetProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

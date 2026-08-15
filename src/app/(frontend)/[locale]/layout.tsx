import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { GlassBudgetProvider } from '@/components/glass/glass-budget'
import { PageTransition } from '@/components/layout/page-transition'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
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

/**
 * Rendered per request.
 *
 * The layout reads the navigation, the footer and the settings from the CMS, so
 * prerendering at build time would need a database inside the build — the
 * container image has none, and a portfolio whose menu is editable should not
 * need a redeploy to change it anyway.
 *
 * The cost is real and it is paid back in phase 9, which adds cached reads with
 * tag-based revalidation on publish; the pages become static again, only
 * refreshed by an edit instead of by a build.
 */
export const dynamic = 'force-dynamic'

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
            <GlassBudgetProvider>
              <SkipLink />
              <SiteHeader locale={locale} />
              <PageTransition>{children}</PageTransition>
              <SiteFooter locale={locale} />
            </GlassBudgetProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

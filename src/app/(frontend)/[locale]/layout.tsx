import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { GlassBudgetProvider } from '@/components/glass/glass-budget'
import { PageTransition } from '@/components/layout/page-transition'
import { MotionPreferencesProvider } from '@/components/motion/motion-preferences'
import { MotionRuntime } from '@/components/motion/motion-runtime'
import { OrganizationJsonLd } from '@/components/seo/json-ld'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeScript } from '@/components/theme/theme-script'
import { CjkStylesheet } from '@/components/typography/cjk-stylesheet'
import { FontLinks } from '@/components/typography/font-links'
import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { getGlobal } from '@/lib/payload'
import { geistMono } from '@/lib/fonts'

import '@/styles/globals.css'

type LayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Fase 9.
 *
 * `force-dynamic` è stato tolto: le letture del CMS (`getGlobal`, `getPageBySlug`,
 * `getProjectBySlug` e le liste in `lib/queries.ts`) passano ora da
 * `unstable_cache`, taggate per collection/global e invalidate dall'hook
 * `afterChange`/`afterDelete` di quella collection — vedi `src/lib/revalidate.ts`.
 * Alla pubblicazione la pagina si aggiorna da sola, non a un timeout arbitrario.
 *
 * Una precisazione onesta su cosa NON cambia: ogni pagina di contenuto chiama
 * `draftMode()` (in `isDraft()`, per sapere se servire una bozza) prima di
 * decidere se leggere dalla cache — ed è una "dynamic API" di Next, che tiene
 * la route dinamica lato rendering indipendentemente da questo flag. La
 * funzione Vercel gira quindi ad ogni richiesta comunque; il guadagno reale è
 * che il lavoro che fa dentro è passato da una query al database (quello che
 * costava ~1.3s) a una lettura dalla Data Cache di Next (quasi istantanea). Il
 * container Docker resta senza database in fase di build, quindi niente
 * generazione statica lì — nessun cambiamento nemmeno su quel fronte.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const seo = await getGlobal('seo-defaults', locale)
  const ogImage = typeof seo.ogImage === 'object' ? seo.ogImage : null

  return {
    // Lets every page declare its metadata with a path instead of a full URL.
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL),
    title: {
      default: seo.siteName,
      // The template is editorial, so it lives in the CMS with the site name.
      template: seo.titleTemplate.replace('%s', '%s'),
    },
    description: seo.description,
    openGraph: {
      type: 'website',
      siteName: seo.siteName,
      locale,
      images: ogImage?.url ? [{ url: ogImage.url }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
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
        {/*
          Hidden filter for the experimental "glass--refract" class in
          glass.css — registers #glass-refraction for backdrop-filter to
          reference. Renders nothing by itself and costs nothing unless a
          surface actually opts in via that class.
        */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation={2} result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={16}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <NextIntlClientProvider>
          <ThemeProvider>
            <MotionPreferencesProvider>
              <GlassBudgetProvider>
                <OrganizationJsonLd locale={locale} />
                <SkipLink />
                <SiteHeader locale={locale} />
                <PageTransition>{children}</PageTransition>
                <SiteFooter locale={locale} />
                <MotionRuntime />
              </GlassBudgetProvider>
            </MotionPreferencesProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

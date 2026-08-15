import { Geist_Mono } from 'next/font/google'

/**
 * Geist Mono — metadata, labels and project numbering. Latin-only family, so
 * `next/font` costs almost nothing here.
 *
 * The two other faces are self-hosted instead: Zen Kaku Gothic New (display and
 * body) and Noto Sans SC (simplified chinese) are japanese and chinese families,
 * and `next/font` would inline every one of their unicode-range rules into the
 * layout stylesheet — 90 KB gzipped, render-blocking, on every page.
 * See `scripts/fetch-fonts.ts` and `components/typography/font-links.tsx`.
 */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

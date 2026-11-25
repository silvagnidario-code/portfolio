import { IBM_Plex_Mono } from 'next/font/google'

/**
 * IBM Plex Mono — metadata, labels, numbering and the interface's small type.
 * Latin-only, so `next/font` costs almost nothing here.
 *
 * Inter Tight (display and body) and Noto Sans SC (simplified chinese) are
 * self-hosted instead — see `scripts/fetch-fonts.ts` and
 * `components/typography/font-links.tsx`.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

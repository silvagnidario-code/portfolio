import { ImageResponse } from 'next/og'

import type { Locale } from '@/i18n/routing'
import { formatYearRange } from '@/lib/format'
import { needsCjkFont, ogFont, ogPalette, ogSize } from '@/lib/og'
import { getProjectBySlug } from '@/lib/queries'

/**
 * The share card for a case study, drawn from the document itself.
 *
 * Typographic on purpose: the cover is an image the reader is about to see
 * anyway, while the title and the numbers are what make a link worth opening.
 *
 * A route handler rather than the `opengraph-image` file convention: metadata
 * file conventions do not resolve inside this project's `(frontend)` route
 * group — `robots.ts` had to move to the app root for the same reason — and an
 * explicit URL referenced from `generateMetadata` is one less piece of magic to
 * debug when a share card goes missing.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: Locale; slug: string }> },
) {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug, locale)
  const font = await ogFont()

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: ogPalette.background,
        }}
      />,
      ogSize,
    )
  }

  // The latin face cannot draw han; the client's name can stand in for a title
  // that would otherwise be a row of empty boxes.
  const headline = needsCjkFont(project.title) ? project.client : project.title
  const services = (project.services ?? [])
    .filter((service) => typeof service === 'object')
    .map((service) => service.title)
    .filter((title) => !needsCjkFont(title))

  const results = (project.results ?? [])
    .slice(0, 3)
    .filter((result) => !needsCjkFont(result.value))

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: ogPalette.background,
        color: ogPalette.ink,
        padding: 72,
        fontFamily: 'OG',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22 }}>
        <span style={{ color: ogPalette.muted, letterSpacing: 3, textTransform: 'uppercase' }}>
          {project.client}
        </span>
        <span style={{ color: ogPalette.muted, letterSpacing: 3 }}>
          {formatYearRange(project.year, project.yearEnd)}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
        <div style={{ fontSize: 76, lineHeight: 1.15 }}>{headline}</div>
        {services.length > 0 ? (
          <div style={{ marginTop: 28, fontSize: 24, color: ogPalette.muted }}>
            {services.join('  ·  ')}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 64,
          borderTop: `2px solid ${ogPalette.rule}`,
          paddingTop: 28,
        }}
      >
        {results.map((result) => (
          <div key={result.value} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 44, color: ogPalette.accent }}>{result.value}</span>
          </div>
        ))}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [{ name: 'OG', data: font, weight: 400, style: 'normal' }],
    },
  )
}

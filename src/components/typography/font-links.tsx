import { fontManifest } from '@/lib/font-manifest.generated'

const zenKaku = fontManifest['zen-kaku']
const notoSansSC = fontManifest['noto-sans-sc']

/**
 * Stylesheets for the two self-hosted faces (see `scripts/fetch-fonts.ts`).
 * The basic-latin slices of the body and display weights are preloaded, so the
 * first paint does not swap.
 */
export function FontLinks() {
  return (
    <>
      {zenKaku.preload.map((href) => (
        <link
          key={href}
          rel="preload"
          as="font"
          type="font/woff2"
          href={href}
          crossOrigin="anonymous"
        />
      ))}
      <link rel="stylesheet" href={zenKaku.css} precedence="default" />
    </>
  )
}

/**
 * Han glyphs, requested only where they are read: the `zh` locale, and the
 * styleguide, which shows chinese specimens in whatever language it is opened.
 * React hoists and de-duplicates the link by href, so rendering it twice is safe.
 */
export function CjkStylesheet() {
  return <link rel="stylesheet" href={notoSansSC.css} precedence="default" />
}

import { fontManifest } from '@/lib/font-manifest.generated'

const zenKaku = fontManifest['zen-kaku']

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

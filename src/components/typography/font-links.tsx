import { fontManifest } from '@/lib/font-manifest.generated'

const interTight = fontManifest['inter-tight']

/**
 * Stylesheet for the self-hosted latin face (see `scripts/fetch-fonts.ts`).
 * The basic-latin slice of the regular weight is preloaded, so the
 * first paint does not swap.
 */
export function FontLinks() {
  return (
    <>
      {interTight.preload.map((href) => (
        <link
          key={href}
          rel="preload"
          as="font"
          type="font/woff2"
          href={href}
          crossOrigin="anonymous"
        />
      ))}
      <link rel="stylesheet" href={interTight.css} precedence="default" />
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'

import { fontManifest } from '@/lib/font-manifest.generated'

const notoSansSC = fontManifest['noto-sans-sc']

/**
 * Han glyphs, requested only where they are read — and never in front of the
 * first paint.
 *
 * The sheet is 110 KB of unicode-range declarations. Loaded normally it blocks
 * rendering, and it measurably did: the same contact page scored 96 on mobile
 * in italian and 70 in chinese, with first paint moving from 1.2s to 3.5s.
 * Nothing in it is needed to *start* painting — `font-display: swap` means the
 * text appears in the fallback face either way — so it is fetched with
 * `media="print"`, which the browser treats as non-blocking, and switched to
 * `all` once it has arrived.
 *
 * The `noscript` copy keeps the blocking behaviour for a reader without
 * JavaScript, who would otherwise never get the face at all.
 */
export function CjkStylesheet() {
  const linkRef = useRef<HTMLLinkElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return

    if (link.sheet) {
      link.media = 'all'
      return
    }

    const promote = () => {
      link.media = 'all'
    }

    link.addEventListener('load', promote)
    return () => link.removeEventListener('load', promote)
  }, [])

  return (
    <>
      <link ref={linkRef} rel="stylesheet" href={notoSansSC.css} media="print" />
      <noscript>
        <link rel="stylesheet" href={notoSansSC.css} />
      </noscript>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'

import type { Model3DBlock as Model3DBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

function mediaUrl(media: Model3DBlockType['model'] | Model3DBlockType['poster']): string | null {
  if (!media || typeof media !== 'object') return null
  return media.url ?? null
}

/**
 * `<model-viewer>` is a browser custom element, not a React component —
 * importing `@google/model-viewer` at module scope runs `customElements
 * .define(...)` on load, which touches `document` and breaks Next's server
 * render of this (client) component. Deferring the import to `useEffect`
 * keeps it off the server pass entirely; `ready` only flips once the
 * import has resolved, so the element isn't written into the DOM — as a
 * plain, inert tag — before the browser knows what it is.
 */
export function Model3DBlock({ block }: { block: Model3DBlockType }) {
  const { eyebrow, heading, model, poster, autoRotate, settings } = block
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import('@google/model-viewer').then(() => setReady(true))
  }, [])

  const src = mediaUrl(model)
  const posterUrl = mediaUrl(poster)
  if (!src) return null

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
          {eyebrow ? (
            <p className="font-mono text-caption uppercase text-ink-muted">{eyebrow}</p>
          ) : null}
          {heading ? <h2 className="mt-8 text-h3 text-balance">{heading}</h2> : null}

          <div className="mt-24 h-[70vh] max-h-[800px] min-h-[420px] w-full overflow-hidden rounded-glass-lg border border-line-strong bg-surface-2">
            {ready ? (
              <model-viewer
                src={src}
                poster={posterUrl ?? undefined}
                alt={heading || 'Modello 3D'}
                camera-controls
                auto-rotate={autoRotate ?? undefined}
                auto-rotate-delay="0"
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                loading="eager"
                reveal="auto"
                style={{ width: '100%', height: '100%' }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </BlockSection>
  )
}

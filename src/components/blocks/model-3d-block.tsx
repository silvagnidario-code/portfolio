'use client'

import { useTranslations } from 'next-intl'
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
 * import has resolved.
 *
 * Below the site's `desktop` breakpoint (1180px):
 * - with a `mobileFallbackVideo`, the video replaces the viewer entirely;
 * - without one, the reader gets a visible "tap to explore" button (over
 *   the poster, when there is one) and the heavy model is only fetched and
 *   mounted after that tap. Before, `reveal="interaction"` with no poster
 *   left an empty frame with nothing to tap.
 *
 * `isDesktop` starts `false` and only flips to `true` once `matchMedia`
 * confirms a desktop width, so a phone never mounts the heavy path first.
 */
export function Model3DBlock({ block }: { block: Model3DBlockType }) {
  const t = useTranslations('Model3D')
  const { eyebrow, heading, model, poster, autoRotate, mobileFallbackVideo, settings } = block
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    import('@google/model-viewer').then(() => setReady(true))
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1180px)')
    setIsDesktop(query.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const src = mediaUrl(model)
  const posterUrl = mediaUrl(poster)
  const videoUrl = mediaUrl(mobileFallbackVideo)
  if (!src) return null

  const showVideo = !isDesktop && Boolean(videoUrl)
  const showStart = !isDesktop && !videoUrl && !started
  const showViewer = ready && !showVideo && !showStart

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
          {eyebrow ? (
            <p className="font-mono text-caption uppercase text-ink-muted">{eyebrow}</p>
          ) : null}
          {heading ? <h2 className="mt-8 text-h3 text-balance">{heading}</h2> : null}

          <div
            // data-lenis-prevent-wheel: Lenis (src/components/motion/smooth-scroll.tsx)
            // binds to the whole window and would otherwise capture a wheel
            // scroll meant for model-viewer's own zoom. Lenis 1.3 reads this
            // attribute itself.
            className="relative mt-24 h-[70vh] max-h-[800px] min-h-[420px] w-full overflow-hidden rounded-glass-lg border border-line-strong bg-surface-2"
            data-lenis-prevent-wheel
          >
            {showVideo ? (
              // A pre-rendered turntable, not the live model: the crash it
              // replaces is often silent (an OOM kill), with no error event
              // to catch.
              <video
                src={videoUrl ?? undefined}
                poster={posterUrl ?? undefined}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            ) : showStart ? (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
                style={posterUrl ? { backgroundImage: `url(${posterUrl})` } : undefined}
              >
                <span className="rounded-full border border-line-strong bg-surface px-24 py-12 font-mono text-caption uppercase">
                  {t('start')}
                </span>
              </button>
            ) : showViewer ? (
              <model-viewer
                src={src}
                poster={posterUrl ?? undefined}
                alt={heading || t('alt')}
                camera-controls
                auto-rotate={autoRotate ?? undefined}
                auto-rotate-delay="0"
                interaction-prompt="none"
                // Pivot on the centre of the model's bounding box (the .glb's
                // own origin sits at a corner), no panning, so it can never
                // drift off-centre; polar angle capped to stay above the floor.
                camera-target="auto auto auto"
                camera-orbit="30deg 72deg 85%"
                min-camera-orbit="auto 40deg auto"
                max-camera-orbit="auto 90deg auto"
                disable-pan
                // Vertical swipes keep scrolling the page on touch screens.
                touch-action="pan-y"
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                loading="eager"
                reveal="auto"
                style={{ width: '100%', height: '100%' }}
              />
            ) : null}
          </div>

          {showVideo ? null : (
            <p className="mt-16 font-mono text-caption text-ink-muted">
              <span className="[@media(pointer:coarse)]:hidden">{t('hintMouse')}</span>
              <span className="hidden [@media(pointer:coarse)]:inline">{t('hintTouch')}</span>
            </p>
          )}
        </div>
      </div>
    </BlockSection>
  )
}

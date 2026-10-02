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
 *
 * `isDesktop` gates two things, both below this site's own `desktop`
 * breakpoint (1180px, matching every other `desktop:` utility class on the
 * page) and both there because desktop itself never had a problem:
 *
 * - Whenever a fallback video is provided, it replaces `<model-viewer>`
 *   entirely below that breakpoint — not interactivity lost to a budget,
 *   the viewer simply never mounts there, so there is nothing for a
 *   phone's GPU to choke on decompressing a model this size.
 * - Without one, the viewer still mounts, but `loading`/`reveal` differ by
 *   breakpoint too (see the comment further down) — eager and automatic on
 *   desktop, deferred to a tap below it.
 *
 * The check starts `false` (not `null`) and only ever flips to `true` once
 * `matchMedia` has explicitly confirmed a desktop width: the failure mode
 * that matters is a phone that briefly mounts the heavier desktop path
 * before JS corrects it, not a desktop reader seeing the lighter mobile
 * one flash for a frame, so the safer default is the one a narrow screen
 * already wants.
 */
export function Model3DBlock({ block }: { block: Model3DBlockType }) {
  const { eyebrow, heading, model, poster, autoRotate, mobileFallbackVideo, settings } = block
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

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

  const showVideo = !isDesktop && videoUrl

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
            // scroll meant for model-viewer's own zoom, turning "zoom the
            // model" into "scroll the page" the moment the pointer is over
            // this frame. Lenis 1.3 reads this attribute itself — no
            // `prevent` callback to wire up on the Lenis side.
            className="mt-24 h-[70vh] max-h-[800px] min-h-[420px] w-full overflow-hidden rounded-glass-lg border border-line-strong bg-surface-2"
            data-lenis-prevent-wheel
          >
            {showVideo ? (
              // A pre-rendered turntable, not the live model: chosen over
              // trying to detect a failed load, which isn't reliable
              // either — the crash this replaces is often silent (an OOM
              // kill), with no error event for anything here to catch.
              // Autoplay/loop/muted/playsInline is the standard combo for
              // an ambient looping clip that mobile browsers will actually
              // autoplay without a tap.
              <video
                src={videoUrl}
                poster={posterUrl ?? undefined}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              // Desktop never crashed — only a phone trying to decompress
              // this model did — so only the mobile/tablet case (reached
              // whenever no fallback video is set) defers to a tap:
              // loading="lazy" reveal="interaction" keeps that
              // decompression off the critical path until the reader asks
              // for it. Applying that same deferral to desktop too, in an
              // earlier version of this block, was the actual bug behind
              // "doesn't work on desktop either" — reveal="interaction"
              // with no `poster` set shows nothing at all until tapped, no
              // visible cue that there's anything there to tap. Desktop
              // goes back to loading="eager" reveal="auto": immediate,
              // automatic, exactly as it was before mobile ever had a
              // problem.
              ready && (
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
                  loading={isDesktop ? 'eager' : 'lazy'}
                  reveal={isDesktop ? 'auto' : 'interaction'}
                  style={{ width: '100%', height: '100%' }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </BlockSection>
  )
}

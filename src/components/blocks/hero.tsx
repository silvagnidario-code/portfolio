'use client'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from '@/components/icons'
import { MediaImage } from '@/components/media/media-image'
import { Link } from '@/i18n/navigation'
import type { HeroBlock } from '@/payload-types'
import { BlockSection, Eyebrow } from './block-section'
/**
 * Hero, three variants.
 *
 * The typographic one is the default of this direction: the heading occupies
 * columns 1-9 and leaves the rest empty. `webglImage` renders a plain still
 * image — the WebGL hover distortion that used to sit on top of it has been
 * removed in favor of a minimal, no-JS treatment.
 * `videoFullscreen` always carries a poster and autoplays muted.
 */
export function Hero({ block }: { block: HeroBlock }) {
  const { variant, eyebrow, heading, lead, image, video, cta, settings } = block
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useTranslations('Hero')
  const [paused, setPaused] = useState(false)
  const togglePlayback = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      void el.play().catch(() => {})
      setPaused(false)
    } else {
      el.pause()
      setPaused(true)
    }
  }
  // iOS Safari (e altri mobile browser) a volte controllano la presenza
  // dell'attributo HTML `muted` nel markup iniziale, non solo la proprietà JS
  // che React imposta dopo l'hydration — per questo lo forziamo esplicitamente
  // con setAttribute, oltre alla proprietà, e ritentiamo play() quando i
  // metadati del video sono pronti (nel caso il primo tentativo sia troppo
  // precoce su una connessione lenta).
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const attemptPlay = () => {
      el.muted = true
      el.defaultMuted = true
      el.setAttribute('muted', '')
      el.setAttribute('playsinline', '')
      const playPromise = el.play()
      if (playPromise) playPromise.catch(() => {})
    }
    attemptPlay()
    el.addEventListener('loadedmetadata', attemptPlay)
    return () => el.removeEventListener('loadedmetadata', attemptPlay)
  }, [])
  const text = (
    <div className="col-span-4 tablet:col-span-6 desktop:col-span-9">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-24 text-display text-balance">{heading}</h1>
      {lead ? <p className="mt-32 max-w-measure text-body-lg text-ink-2">{lead}</p> : null}
      {cta?.label && cta.href ? (
        <Link
          href={cta.href}
          className="mt-48 inline-flex min-h-[3rem] items-center border border-ink px-24 font-mono text-caption uppercase transition ease-reveal duration-fast hover:bg-ink hover:text-surface"
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  )
  if (variant === 'typographic') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">{text}</div>
      </BlockSection>
    )
  }
  if (variant === 'videoFullscreen') {
    const hasVideo = typeof video === 'object' && Boolean(video?.url)
    // Full-bleed under the sticky header: the negative margin cancels the
    // page's top padding, so the frame starts flush against the bar. The
    // text sits at the bottom, over a scrim that keeps it legible on any
    // frame of the footage; the light ink is fixed rather than themed,
    // because what is underneath is a video, not the page.
    return (
      <section className="relative -mt-48 flex h-[clamp(34rem,calc(100svh-4.25rem),56rem)] w-full flex-col justify-between overflow-hidden bg-surface-inverse text-[#F2EEE6] desktop:-mt-64">
        <div className="absolute inset-0 h-full w-full">
          {hasVideo && typeof video === 'object' && video ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
              loop
              preload="auto"
              aria-hidden="true"
              poster={typeof image === 'object' ? (image?.url ?? undefined) : undefined}
            >
              <source src={video.url ?? undefined} type={video.mimeType ?? undefined} />
            </video>
          ) : (
            <MediaImage
              media={image}
              sizes="100vw"
              priority
              className="h-full w-full object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[rgb(10_10_12/0.78)] via-[rgb(10_10_12/0.3)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[rgb(10_10_12/0.35)] to-transparent"
          />
        </div>

        <div className="page-margin relative z-10 flex items-start justify-between gap-16 pt-24 font-mono text-caption uppercase">
          {eyebrow ? <p>{eyebrow}</p> : <span />}
          {hasVideo ? (
            <button
              type="button"
              onClick={togglePlayback}
              aria-pressed={paused}
              className="flex min-h-[2.75rem] items-center gap-8 border border-[rgb(242_238_230/0.45)] bg-[rgb(10_10_12/0.25)] px-12 transition ease-reveal duration-fast hover:bg-[rgb(10_10_12/0.5)]"
            >
              {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
              <span>{paused ? t('play') : t('pause')}</span>
            </button>
          ) : null}
        </div>

        <div className="page-margin relative z-10 pb-32 desktop:pb-48">
          <h1 className="max-w-[18ch] text-display text-balance">{heading}</h1>
          <div className="mt-32 flex flex-wrap items-end justify-between gap-24">
            {lead ? (
              <p className="max-w-[44ch] text-body-lg text-[rgb(242_238_230/0.85)]">{lead}</p>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap gap-8">
              {cta?.label && cta.href ? (
                <Link
                  href={cta.href}
                  className="inline-flex min-h-[3rem] items-center bg-[#F2EEE6] px-24 font-mono text-caption uppercase text-[#0E0E0D] transition ease-reveal duration-fast hover:bg-accent hover:text-accent-ink"
                >
                  {cta.label} →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <BlockSection settings={settings}>
      <div className="page-grid">{text}</div>
      {/* Edge-to-edge like the videoFullscreen variant above — a hero banner,
          not content in the grid — so it stays square-cornered too. */}
      <figure className="mt-96 aspect-[16/9] w-full overflow-hidden" data-reveal="mask">
        <MediaImage media={image} sizes="100vw" priority className="h-full w-full object-cover" />
      </figure>
    </BlockSection>
  )
}

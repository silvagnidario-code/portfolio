'use client'
import { useEffect, useRef } from 'react'
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
          className="mt-48 inline-block border border-line-strong px-24 py-16 text-body transition ease-reveal duration-fast hover:bg-surface-2"
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
    // Full-bleed background, not content on its own — stays square-cornered
    // like every other layout container, unlike the media rounding below.
    return (
      <section className="relative -mt-128 flex min-h-dvh w-full items-center overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          {typeof video === 'object' && video?.url ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
              loop
              preload="auto"
              poster={typeof image === 'object' ? (image?.url ?? undefined) : undefined}
            >
              <source src={video.url} type={video.mimeType ?? undefined} />
            </video>
          ) : (
            <MediaImage
              media={image}
              sizes="100vw"
              priority
              className="h-full w-full object-cover"
            />
          )}
          {/* Overlay scuro per garantire contrasto al testo sopra il video */}
          <div className="absolute inset-0 bg-surface-inverse/40" />
        </div>
        <div className="page-grid relative z-10 w-full text-ink-inverse [&_.text-ink-2]:text-ink-inverse/80 [&_.text-ink-muted]:text-ink-inverse/70">
          {text}
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

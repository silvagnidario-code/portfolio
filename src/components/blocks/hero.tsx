import { MediaImage } from '@/components/media/media-image'
import { HoverDistortion } from '@/components/motion/hover-distortion'
import { Link } from '@/i18n/navigation'
import type { HeroBlock } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'

/**
 * Hero, three variants.
 *
 * The typographic one is the default of this direction: the heading occupies
 * columns 1-9 and leaves the rest empty. `webglImage` renders the still image
 * here — the distortion is bolted on in phase 8 and degrades to exactly this.
 * `videoFullscreen` always carries a poster and never autoplays without one.
 */
export function Hero({ block }: { block: HeroBlock }) {
  const { variant, eyebrow, heading, lead, image, video, cta, settings } = block

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
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">{text}</div>
        <figure className="mt-96 aspect-video w-full overflow-hidden">
          {typeof video === 'object' && video?.url ? (
            <video
              className="h-full w-full object-cover"
              playsInline
              muted
              loop
              preload="none"
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
        </figure>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">{text}</div>
      <figure className="mt-96">
        <HoverDistortion
          src={typeof image === 'object' ? (image?.url ?? '') : ''}
          className="aspect-[16/9] w-full overflow-hidden"
        >
          <MediaImage media={image} sizes="100vw" priority className="h-full w-full object-cover" />
        </HoverDistortion>
      </figure>
    </BlockSection>
  )
}

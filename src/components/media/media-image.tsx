import Image from 'next/image'

import type { Media } from '@/payload-types'

import { MediaVideo } from './media-video'

type MediaImageProps = {
  media?: number | Media | null
  /** Sizes attribute: how much of the viewport the image occupies. */
  sizes: string
  className?: string
  priority?: boolean
  /** Poster shown while a video loads and before the first frame paints. */
  poster?: number | Media | null
  /** Adds a play/pause + mute overlay when a video is intentionally being viewed. */
  controls?: boolean | 'hover'
}

/**
 * Every image on the site goes through `next/image`, and every image carries
 * the localized alt text the CMS stores. A media reference that was not
 * populated renders nothing rather than a broken frame.
 *
 * A media reference can also point at a video: every media field in the CMS is
 * a generic upload, so nothing stops an editor picking an mp4 for a cover, a
 * hero or a gallery item. `next/image` cannot decode a video stream, so those
 * used to render as a broken-image icon showing only the alt text. Here the
 * mime type decides: a video becomes a muted, looping `<video>` — silent by
 * default, since that is what most placements want. Passing `controls` (or
 * `'hover'` for a reveal-on-hover bar) adds a minimal play/pause + mute
 * overlay for the placements — the gallery lightbox — where the viewer is
 * meant to be able to stop or unmute the clip.
 */
export function MediaImage({
  media,
  sizes,
  className,
  priority,
  poster,
  controls = false,
}: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) return null

  const { url, alt, width, height, focalX, focalY, mimeType } = media
  const objectPosition =
    typeof focalX === 'number' && typeof focalY === 'number' ? `${focalX}% ${focalY}%` : undefined

  if (mimeType?.startsWith('video/')) {
    const posterUrl = poster && typeof poster === 'object' ? (poster.url ?? undefined) : undefined

    if (controls) {
      return (
        <MediaVideo
          src={url}
          mimeType={mimeType}
          className={className}
          style={{ objectPosition }}
          ariaLabel={alt ?? undefined}
          poster={posterUrl}
          chrome={controls === 'hover' ? 'hover' : 'always'}
        />
      )
    }

    return (
      <video
        className={className}
        style={{ objectPosition }}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        poster={posterUrl}
        aria-label={alt ?? undefined}
      >
        <source src={url} type={mimeType} />
      </video>
    )
  }

  return (
    <Image
      src={url}
      alt={alt ?? ''}
      width={width ?? 1600}
      height={height ?? 1200}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectPosition }}
    />
  )
}

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
  /** Adds the browser's native `<video controls>` bar when a video is intentionally being viewed. */
  controls?: boolean
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
 * mime type decides: a video renders through `MediaVideo`, which is what
 * keeps a page of many clips — a gallery grid, a reel — from decoding all of
 * them at once regardless of `controls`. Silent, muted, looping is the
 * default, since that's what most placements want; passing `controls` adds
 * the browser's native control bar for the placements — the gallery
 * lightbox — where the viewer is meant to be able to stop, unmute or seek
 * the clip.
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

    return (
      <MediaVideo
        src={url}
        mimeType={mimeType}
        className={className}
        style={{ objectPosition }}
        ariaLabel={alt ?? undefined}
        poster={posterUrl}
        controls={controls}
      />
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

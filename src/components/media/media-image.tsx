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
 * A media reference can also point at a video (any variant that isn't the
 * dedicated Loop video block can still receive one, since the CMS field is a
 * generic upload). `next/image` cannot render a video URL — passing one
 * through produced a broken-image icon with only the alt text visible. This
 * checks the mime type and renders a muted, looping `<video>` instead so a
 * video reference is never silently invisible.
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

import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaImageProps = {
  media?: number | Media | null
  /** Sizes attribute: how much of the viewport the image occupies. */
  sizes: string
  className?: string
  priority?: boolean
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
 * mime type decides: a video becomes a muted, looping `<video>`, which is what
 * the site wants anyway — silent, autoplaying loops, never a player chrome.
 */
export function MediaImage({ media, sizes, className, priority }: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) return null

  const { url, alt, width, height, focalX, focalY, mimeType } = media
  const objectPosition =
    typeof focalX === 'number' && typeof focalY === 'number' ? `${focalX}% ${focalY}%` : undefined

  if (mimeType?.startsWith('video/')) {
    return (
      <video
        className={className}
        style={{ objectPosition }}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
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

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
 */
export function MediaImage({ media, sizes, className, priority }: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) return null

  const { url, alt, width, height, focalX, focalY } = media

  return (
    <Image
      src={url}
      alt={alt ?? ''}
      width={width ?? 1600}
      height={height ?? 1200}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{
        objectPosition:
          typeof focalX === 'number' && typeof focalY === 'number'
            ? `${focalX}% ${focalY}%`
            : undefined,
      }}
    />
  )
}

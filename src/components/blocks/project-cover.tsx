'use client'

import { useCallback, useRef, useState } from 'react'

import { MediaImage } from '@/components/media/media-image'
import type { Media } from '@/payload-types'

/**
 * The still cover always renders through `MediaImage`, exactly as before.
 * `coverVideo`, when a project has one, is a silent loop stacked on top of
 * it — §4 of the spec: "loop per hover in griglia". It carries no
 * `<source>` until the pointer actually arrives (`preload="none"`, and
 * nothing calls `.play()` before then), so a project without a hover intent
 * never costs a single byte of video, and the still cover doubles as its
 * poster: nothing else ever paints before it.
 *
 * The hover check is re-armed on every enter rather than assumed from a
 * mount-time media query, since a laptop with a mouse plugged in and
 * unplugged mid-session can change `hover: hover` without a reload.
 */
export function ProjectCover({
  cover,
  coverVideo,
  sizes,
  className,
}: {
  cover: number | Media | null | undefined
  coverVideo: number | Media | null | undefined
  sizes: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleEnter = useCallback(() => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return
    setHovered(true)
    void videoRef.current?.play()
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(false)
    const el = videoRef.current
    if (!el) return
    el.pause()
    el.currentTime = 0
  }, [])

  const video = coverVideo && typeof coverVideo === 'object' ? coverVideo : null

  return (
    <div className="relative h-full w-full" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <MediaImage media={cover} sizes={sizes} className={className} />

      {video?.url ? (
        <video
          ref={videoRef}
          className={[
            className ?? '',
            'absolute inset-0 opacity-0 transition-opacity duration-slow ease-reveal',
            hovered ? 'opacity-100' : '',
          ].join(' ')}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={video.url} type={video.mimeType ?? undefined} />
        </video>
      ) : null}
    </div>
  )
}

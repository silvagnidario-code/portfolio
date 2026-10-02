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
 *
 * `className` and `imageHoverClassName` are deliberately separate props,
 * not one string a caller might reuse for both elements. ProjectCard's own
 * card-hover micro-interaction (a slight scale and a dim to 90% opacity)
 * is meant for the still image only — applying it to the video too, as an
 * earlier version of this component did by giving both elements the same
 * className, capped the video at 90% opacity for the whole time it was
 * playing: `group-hover:opacity-90` and this component's own `opacity-0`
 * → `opacity-100` crossfade were fighting over the same property, and the
 * group-hover rule was winning. The video never actually reached full
 * opacity, so the cover image stayed visibly bleeding through underneath
 * it, not just during the brief gap before the video has a frame to show,
 * but for as long as the card stayed hovered. The video's own opacity is
 * this component's alone to drive now; `imageHoverClassName` never reaches
 * it.
 */
export function ProjectCover({
  cover,
  coverVideo,
  sizes,
  className,
  imageHoverClassName,
}: {
  cover: number | Media | null | undefined
  coverVideo: number | Media | null | undefined
  sizes: string
  className?: string
  /** Applied to the still image only — never the video. See the block comment above. */
  imageHoverClassName?: string
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
      <MediaImage
        media={cover}
        sizes={sizes}
        className={[className ?? '', imageHoverClassName ?? ''].join(' ')}
      />

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

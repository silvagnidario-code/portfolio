'use client'

import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

/**
 * One video's audio at a time. Every `MediaVideo` on the page listens for
 * this event; unmuting one broadcasts its id so every other instance mutes
 * itself, instead of a viewer stacking three audio tracks by unmuting three
 * thumbnails in a row.
 */
const UNMUTED_EVENT = 'media-video:unmuted'

type MediaVideoProps = {
  src: string
  mimeType?: string | null
  poster?: string
  className?: string
  style?: CSSProperties
  ariaLabel?: string
  /** The browser's native control bar. Off for silent autoplay loops. */
  controls?: boolean
}

/**
 * Silent autoplay loops that never cost more than the one clip being watched.
 *
 * Two separate states, on purpose:
 *
 * - `near` (observer margin ~400px): the `<source>` is mounted and only the
 *   metadata is fetched. That is a few KB, it is all that is needed to learn
 *   the aspect ratio (no layout jump), and once mounted it is never removed.
 * - `inView` (observer margin 0, at least 30% visible): the only state allowed
 *   to download the file (`preload="auto"`) and decode it (`play()`).
 *
 * The previous version used a single 700px margin for both, so on a page of
 * 25-140 MB clips several of them started downloading and decoding at the
 * same time while Lenis was animating the scroll. Leaving the viewport now
 * just pauses the video: no `load()`, so no teardown, no re-download and no
 * decoder thrash when the viewer scrolls back.
 */
export function MediaVideo({
  src,
  mimeType,
  poster,
  className,
  style,
  ariaLabel,
  controls = true,
}: MediaVideoProps) {
  const instanceId = useId()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  // Learned once from the metadata and kept: see the stable-box note above.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  // Paused on purpose by the viewer (as opposed to idle because it scrolled
  // out of view): only that stays paused when it comes back into view.
  const userPausedRef = useRef(false)
  // Set right before we pause the video ourselves, so the resulting `pause`
  // event is not mistaken for the viewer pressing the native pause button.
  const autoPausingRef = useRef(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onPause = () => {
      if (autoPausingRef.current) {
        autoPausingRef.current = false
        return
      }
      userPausedRef.current = true
    }
    const onPlay = () => {
      userPausedRef.current = false
    }
    const onVolumeChange = () => {
      if (!el.muted) window.dispatchEvent(new CustomEvent(UNMUTED_EVENT, { detail: instanceId }))
    }
    const onLoadedMetadata = () => {
      if (el.videoWidth > 0 && el.videoHeight > 0) {
        setAspectRatio(el.videoWidth / el.videoHeight)
      }
    }

    el.addEventListener('pause', onPause)
    el.addEventListener('play', onPlay)
    el.addEventListener('volumechange', onVolumeChange)
    el.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      el.removeEventListener('pause', onPause)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('volumechange', onVolumeChange)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [instanceId])

  // Another video just unmuted itself: mute this one if it is audible.
  useEffect(() => {
    const onOtherUnmuted = (event: Event) => {
      const otherId = (event as CustomEvent<string>).detail
      if (otherId === instanceId) return
      const el = videoRef.current
      if (el && !el.muted) el.muted = true
    }

    window.addEventListener(UNMUTED_EVENT, onOtherUnmuted)
    return () => window.removeEventListener(UNMUTED_EVENT, onOtherUnmuted)
  }, [instanceId])

  // Two observers on the same element: a wide one for `near`, a tight one for
  // `inView`.
  useEffect(() => {
    const el = videoRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      setInView(true)
      return
    }

    const nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: '400px 0px' },
    )
    const viewObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setInView(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    nearObserver.observe(el)
    viewObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  // Play when visible, pause (never unload) when not.
  useEffect(() => {
    const el = videoRef.current
    if (!el || !near) return

    if (inView) {
      if (!userPausedRef.current) el.play().catch(() => {})
    } else if (!el.paused) {
      autoPausingRef.current = true
      el.pause()
    }
  }, [inView, near])

  return (
    <video
      ref={videoRef}
      className={className}
      style={aspectRatio ? { ...style, aspectRatio: String(aspectRatio) } : style}
      controls={controls}
      playsInline
      muted
      loop
      // `none` until near, `metadata` while near, `auto` only while actually
      // on screen: this is what keeps the big files from all downloading at
      // once.
      preload={inView ? 'auto' : near ? 'metadata' : 'none'}
      poster={poster}
      aria-label={ariaLabel}
    >
      {near ? <source src={src} type={mimeType ?? undefined} /> : null}
    </video>
  )
}

'use client'

import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

/**
 * One video's audio at a time. Every `MediaVideo` on the page listens for
 * this event; unmuting one broadcasts its id so every other instance mutes
 * itself, instead of a viewer stacking three audio tracks by unmuting three
 * thumbnails in a row. A plain DOM event is enough — these instances don't
 * share a React tree, and there's nothing here worth a context provider.
 * Firing it from the `volumechange` listener rather than a dedicated toggle
 * handler means it fires the same way whether the viewer unmutes through the
 * browser's own controls or the video is unmuted some other way.
 */
const UNMUTED_EVENT = 'media-video:unmuted'

type MediaVideoProps = {
  src: string
  mimeType?: string | null
  poster?: string
  className?: string
  style?: CSSProperties
  ariaLabel?: string
  /**
   * The browser's native control bar, for placements where the viewer is
   * meant to be able to stop, unmute or seek the clip (the gallery
   * lightbox). Off by default: a silent autoplay loop — a thumbnail, a
   * grid cover — has nothing for a bar to control.
   */
  controls?: boolean
}

/**
 * Gallery and showcase videos stay silent autoplay loops by default, and use
 * the browser's own native `<video controls>` bar for anything beyond that —
 * pausing, unmuting, seeking, going fullscreen. Only carries a `<source>` —
 * and therefore only decodes — near the viewport; see the `active` effect
 * below for why.
 *
 * Sizing is deliberately not left to the video itself: an element with no
 * known dimensions collapses to the browser's placeholder box (300×150) until
 * its metadata arrives, and with no width or height set here — `h-auto
 * w-auto` throughout, on purpose, since the media can be any shape — that
 * collapse-then-snap is a layout jump the viewer feels as the page lurching
 * while they scroll. `aspectRatio` is learned once, the first time the
 * metadata for *this* source has ever loaded, and then held in state for
 * good: unlike `preload` and the `<source>` itself, it does not get undone by
 * scrolling the video back out of range and losing its buffer again.
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
  // A page can carry a dozen of these; mobile browsers cap how many videos
  // can decode at once (iOS Safari's hardware decoder tops out around 4-6),
  // and the ones over that limit just never play. `active` gates the actual
  // <source> — only videos near the viewport carry one — so a grid of eleven
  // never asks the decoder for more than a handful at a time.
  const [active, setActive] = useState(false)
  // Once a video has been near the viewport, its `<source>` stays mounted
  // for good — see the sizing comment above for why that matters.
  const [everActive, setEverActive] = useState(false)
  // The video's own aspect ratio, learned the first time its metadata loads
  // and then never forgotten — see the sizing comment above.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  // Whether the viewer paused this one on purpose, as opposed to it going
  // idle because it scrolled out of view — only the former should stay
  // paused once it scrolls back in.
  const userPausedRef = useRef(false)
  // Set right before the deactivation effect below stops the video itself so
  // the resulting `pause` event isn't mistaken for the viewer reaching for
  // the native pause button — see that effect for why only that edge needs
  // it.
  const autoPausingRef = useRef(false)
  // Debounces the *deactivate* edge only — see the observer effect below.
  const deactivateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    // Learned once and kept: see the sizing comment above.
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

  // Another video just unmuted itself: if this one is currently audible,
  // mute it so the two tracks don't play over each other.
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

  // Only decode video that's actually near the viewport. `rootMargin` starts
  // it well before it's on screen — long enough, on a typical mobile
  // connection, for the source to actually finish buffering before the
  // viewer scrolls it into view, instead of them watching it load. Dropping
  // it again once it's well past frees that decoder slot for whichever
  // thumbnail the viewer has scrolled to next.
  //
  // The *deactivate* edge is debounced: a fast flick that carries a video
  // out of the margin and back again shouldn't tear its source down and
  // force a full reload from zero — that thrash was the other half of the
  // scroll jank, on top of the buffering itself. Activation stays immediate;
  // only losing the source is worth delaying.
  useEffect(() => {
    const el = videoRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      setEverActive(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          if (deactivateTimeoutRef.current) {
            clearTimeout(deactivateTimeoutRef.current)
            deactivateTimeoutRef.current = null
          }
          setActive(true)
          setEverActive(true)
        } else if (!deactivateTimeoutRef.current) {
          deactivateTimeoutRef.current = setTimeout(() => {
            deactivateTimeoutRef.current = null
            setActive(false)
          }, 1000)
        }
      },
      { rootMargin: '700px 0px' },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (deactivateTimeoutRef.current) {
        clearTimeout(deactivateTimeoutRef.current)
        deactivateTimeoutRef.current = null
      }
    }
  }, [])

  // Fires on every activation and deactivation: `load()` is what actually
  // makes the browser re-evaluate `preload` and either fetch the full source
  // or fall back to metadata-only, and resumes playback on the way back in
  // unless the viewer paused it. It does not cost the learned `aspectRatio`
  // above — that stays in state regardless of what the source is doing.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    if (active) {
      el.load()
      if (!userPausedRef.current) void el.play()
    } else {
      // `load()` itself stops playback (by dropping the buffered source), so
      // mark that pause as ours before triggering it — otherwise `onPause`
      // above would read it as the viewer reaching for the native pause
      // button and refuse to auto-resume next time this scrolls back into
      // view.
      if (!el.paused) autoPausingRef.current = true
      el.load()
    }
  }, [active])

  return (
    <video
      ref={videoRef}
      className={className}
      style={aspectRatio ? { ...style, aspectRatio: String(aspectRatio) } : style}
      controls={controls}
      playsInline
      muted
      loop
      // `metadata` once the source has ever been active, not `none`: a
      // metadata-only fetch is a handful of bytes, not the video, and it's
      // what lets `aspectRatio` above get learned (and re-learned, cheaply,
      // from cache) without paying for a full decode.
      preload={active ? 'auto' : everActive ? 'metadata' : 'none'}
      poster={poster}
      aria-label={ariaLabel}
    >
      {everActive ? <source src={src} type={mimeType ?? undefined} /> : null}
    </video>
  )
}

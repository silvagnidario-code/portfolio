'use client'

import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'

import { GlassSurface } from '@/components/glass/glass-surface'
import {
  CollapseIcon,
  ExpandIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  UnmuteIcon,
} from '@/components/icons'

/**
 * One video's audio at a time. Every `MediaVideo` on the page listens for
 * this event; unmuting one broadcasts its id so every other instance mutes
 * itself, instead of a viewer stacking three audio tracks by unmuting three
 * thumbnails in a row. A plain DOM event is enough — these instances don't
 * share a React tree, and there's nothing here worth a context provider.
 */
const UNMUTED_EVENT = 'media-video:unmuted'

/** Safari on iOS never implemented the standard Fullscreen API on anything
 * but the video element itself; it exposes its own method instead. */
type SafariVideoElement = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

type MediaVideoProps = {
  src: string
  mimeType?: string | null
  poster?: string
  className?: string
  style?: CSSProperties
  ariaLabel?: string
  /**
   * `hover` reveals the bar only on mouse-over (it falls back to
   * always-visible on touch, where there is no hover gesture to reveal it
   * with); `always` keeps it visible regardless of input. Every current
   * placement — gallery thumbnails and the lightbox alike — uses `hover`.
   */
  chrome?: 'always' | 'hover'
}

/**
 * Gallery and showcase videos stay silent autoplay loops by default, but they
 * gain a minimal glass control bar when the viewer needs to pause, unmute or
 * go fullscreen. The bar is always visible on touch (there's no hover to
 * reveal it there) and reveals on hover only where a mouse is actually
 * present — `pointer-fine` distinguishes the two instead of guessing from
 * screen width, since a touch laptop or a desktop with a stylus doesn't
 * split neatly along a breakpoint.
 *
 * Only carries a `<source>` — and therefore only decodes — near the
 * viewport; see the `active` effect below for why. The glass control bar is
 * gated the same way, for the same reason: see the comment above it.
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
  chrome = 'always',
}: MediaVideoProps) {
  const t = useTranslations('MediaVideo')
  const instanceId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // A page can carry a dozen of these; mobile browsers cap how many videos
  // can decode at once (iOS Safari's hardware decoder tops out around 4-6),
  // and the ones over that limit just never play. `active` gates the actual
  // <source> — only videos near the viewport carry one — so a grid of eleven
  // never asks the decoder for more than a handful at a time.
  const [active, setActive] = useState(false)
  // Once a video has been near the viewport, its `<source>` stays mounted
  // for good — see the sizing comment below for why that matters.
  const [everActive, setEverActive] = useState(false)
  // The video's own aspect ratio, learned the first time its metadata loads
  // and then never forgotten — see the sizing comment below.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  // Whether the viewer paused this one on purpose, as opposed to it going
  // idle because it scrolled out of view — only the former should stay
  // paused once it scrolls back in.
  const userPausedRef = useRef(false)
  // Debounces the *deactivate* edge only — see the observer effect below.
  const deactivateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onVolumeChange = () => setMuted(el.muted)
    // Learned once and kept: see the sizing comment on the container below.
    const onLoadedMetadata = () => {
      if (el.videoWidth > 0 && el.videoHeight > 0) {
        setAspectRatio(el.videoWidth / el.videoHeight)
      }
    }

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('volumechange', onVolumeChange)
    el.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('volumechange', onVolumeChange)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

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

  // Tracks fullscreen state for this instance specifically — `fullscreenchange`
  // is a document-level event shared by every video on the page.
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

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
    const container = containerRef.current
    if (!container || typeof IntersectionObserver === 'undefined') {
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
    observer.observe(container)
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

    el.load()
    if (active && !userPausedRef.current) {
      void el.play()
    } else if (!active) {
      setPlaying(false)
    }
  }, [active])

  const togglePlay = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    const el = videoRef.current
    if (!el) return

    if (el.paused) {
      userPausedRef.current = false
      void el.play()
    } else {
      userPausedRef.current = true
      el.pause()
    }
  }, [])

  const toggleMute = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      const el = videoRef.current
      if (!el) return

      el.muted = !el.muted
      if (!el.muted) {
        window.dispatchEvent(new CustomEvent(UNMUTED_EVENT, { detail: instanceId }))
      }
    },
    [instanceId],
  )

  const toggleFullscreen = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }

    // Fullscreening the wrapper, not the bare video, keeps this same control
    // bar on screen once fullscreen — the video-only API on iOS Safari is the
    // one exception, where the platform's own native player takes over.
    const container = containerRef.current
    if (container?.requestFullscreen) {
      void container.requestFullscreen()
      return
    }

    const el = videoRef.current as SafariVideoElement | null
    el?.webkitEnterFullscreen?.()
  }, [])

  return (
    <div
      ref={containerRef}
      className={[
        'relative',
        // Fullscreen takes over the whole screen at the container's own
        // aspect ratio; recentre the video and letterbox around it instead
        // of leaving it pinned to a corner or stretched out of shape.
        '[&:fullscreen]:flex [&:fullscreen]:h-full [&:fullscreen]:w-full',
        '[&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:bg-ink',
        '[&:fullscreen_video]:h-auto [&:fullscreen_video]:w-auto',
        '[&:fullscreen_video]:max-h-full [&:fullscreen_video]:max-w-full',
        // A rounded corner reads as a border when the video fills the whole
        // screen — square it off there regardless of what `className` asked
        // for outside fullscreen.
        '[&:fullscreen_video]:rounded-none',
        chrome === 'hover' ? 'group/video' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <video
        ref={videoRef}
        className={className}
        style={aspectRatio ? { ...style, aspectRatio: String(aspectRatio) } : style}
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

      {/*
       * Mounted only while `active`, not `everActive`: each button below is
       * a `GlassSurface`, and `backdrop-filter` is expensive enough that the
       * site caps how many can be alive at once (see glass-budget.tsx). A
       * page like a case study can carry eight or more of these videos: if
       * every one of them kept its three-button bar mounted for good the
       * first time it neared the viewport, a single scroll down the page
       * would blow through that budget many times over and the resulting
       * compositing cost was itself a source of the scroll jank this
       * component exists to avoid. Tying it to `active` instead means only
       * the videos actually near the viewport hold a glass slot, and the
       * bar remounts — cheaply, it's just buttons — the next time the video
       * comes back into range.
       */}
      {active ? (
        <div
          className={
            chrome === 'hover'
              ? 'pointer-events-none absolute inset-x-0 bottom-12 flex justify-center gap-16 opacity-100 transition duration-fast ease-reveal pointer-fine:opacity-0 pointer-fine:group-hover/video:opacity-100 pointer-fine:group-focus-within/video:opacity-100'
              : 'pointer-events-none absolute inset-x-0 bottom-16 flex justify-center gap-16 tablet:bottom-24'
          }
        >
          <GlassSurface
            variant="chrome"
            className="pointer-events-auto rounded-glass-sm border border-line/80 shadow-none"
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? t('pause') : t('play')}
              aria-pressed={playing}
              className="flex h-40 w-40 items-center justify-center rounded-glass-sm text-ink transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </GlassSurface>

          <GlassSurface
            variant="chrome"
            className="pointer-events-auto rounded-glass-sm border border-line/80 shadow-none"
          >
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? t('unmute') : t('mute')}
              aria-pressed={muted}
              className="flex h-40 w-40 items-center justify-center rounded-glass-sm text-ink transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {muted ? <MuteIcon /> : <UnmuteIcon />}
            </button>
          </GlassSurface>

          <GlassSurface
            variant="chrome"
            className="pointer-events-auto rounded-glass-sm border border-line/80 shadow-none"
          >
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
              aria-pressed={isFullscreen}
              className="flex h-40 w-40 items-center justify-center rounded-glass-sm text-ink transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
            </button>
          </GlassSurface>
        </div>
      ) : null}
    </div>
  )
}

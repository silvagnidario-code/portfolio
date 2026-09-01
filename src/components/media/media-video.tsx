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
  /** `always` for lightbox/full-size views, `hover` for gallery thumbnails. */
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
 * viewport; see the `active` effect below for why.
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

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('volumechange', onVolumeChange)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('volumechange', onVolumeChange)
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
  // makes a browser let go of a dropped source instead of holding onto it,
  // and resumes playback on the way back in unless the viewer paused it.
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
        style={style}
        playsInline
        muted
        loop
        preload={active ? 'auto' : 'none'}
        poster={poster}
        aria-label={ariaLabel}
      >
        {active ? <source src={src} type={mimeType ?? undefined} /> : null}
      </video>

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
    </div>
  )
}

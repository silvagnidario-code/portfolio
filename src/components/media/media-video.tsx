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
import { MuteIcon, PauseIcon, PlayIcon, UnmuteIcon } from '@/components/icons'

/**
 * One video's audio at a time. Every `MediaVideo` on the page listens for
 * this event; unmuting one broadcasts its id so every other instance mutes
 * itself, instead of a viewer stacking three audio tracks by unmuting three
 * thumbnails in a row. A plain DOM event is enough — these instances don't
 * share a React tree, and there's nothing here worth a context provider.
 */
const UNMUTED_EVENT = 'media-video:unmuted'

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
 * gain a minimal glass control bar when the viewer needs to pause or unmute.
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

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

  const togglePlay = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    const el = videoRef.current
    if (!el) return

    if (el.paused) {
      void el.play()
    } else {
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

  return (
    <div className={chrome === 'hover' ? 'group/video relative' : 'relative'}>
      <video
        ref={videoRef}
        className={className}
        style={style}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        poster={poster}
        aria-label={ariaLabel}
      >
        <source src={src} type={mimeType ?? undefined} />
      </video>

      <div
        className={
          chrome === 'hover'
            ? 'pointer-events-none absolute inset-x-0 bottom-12 flex justify-center gap-16 opacity-0 transition duration-fast ease-reveal group-hover/video:opacity-100 group-focus-within/video:opacity-100'
            : 'pointer-events-none absolute inset-x-0 bottom-16 flex justify-center gap-16 tablet:bottom-24'
        }
      >
        <GlassSurface
          variant="chrome"
          className={
            chrome === 'hover'
              ? 'pointer-events-auto rounded-glass-sm border border-line/80 shadow-none'
              : 'pointer-events-auto rounded-glass-sm border border-line/80 shadow-none'
          }
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
          className={
            chrome === 'hover'
              ? 'pointer-events-auto rounded-glass-sm border border-line/80 shadow-none'
              : 'pointer-events-auto rounded-glass-sm border border-line/80 shadow-none'
          }
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
      </div>
    </div>
  )
}

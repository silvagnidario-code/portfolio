'use client'

import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'

import { GlassSurface } from '@/components/glass/glass-surface'
import { MuteIcon, PauseIcon, PlayIcon, UnmuteIcon } from '@/components/icons'

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

  const toggleMute = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    const el = videoRef.current
    if (!el) return

    el.muted = !el.muted
  }, [])

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
            ? 'pointer-events-none absolute inset-x-0 bottom-12 flex justify-center gap-6 opacity-0 transition duration-fast ease-reveal group-hover/video:opacity-100 group-focus-within/video:opacity-100'
            : 'pointer-events-none absolute inset-x-0 bottom-16 flex justify-center gap-6 tablet:bottom-24'
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

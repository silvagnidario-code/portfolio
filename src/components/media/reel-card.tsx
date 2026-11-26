'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

/**
 * An Instagram-style HUD laid over a vertical video: a story-style progress
 * bar on top (no profile row: the work is not a social account), reel-style
 * actions on the right, a mute toggle
 * at the bottom. It wraps whatever renders the <video> (MediaImage /
 * MediaVideo), finds that element and only reads from or toggles it, so the
 * lazy loading, autoplay-in-view and "one unmuted at a time" logic in
 * MediaVideo keep working untouched.
 */
export function ReelCard({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    const video = rootRef.current?.querySelector('video')
    if (!video) return

    let frame = 0
    const paint = () => {
      const bar = barRef.current
      if (bar && video.duration > 0) {
        bar.style.transform = `scaleX(${video.currentTime / video.duration})`
      }
    }
    const loop = () => {
      paint()
      frame = requestAnimationFrame(loop)
    }
    const onPlay = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }
    const onPause = () => {
      cancelAnimationFrame(frame)
      paint()
    }
    const onVolume = () => setMuted(video.muted)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('volumechange', onVolume)
    if (!video.paused) onPlay()

    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('volumechange', onVolume)
    }
  }, [])

  const toggleMute = () => {
    const video = rootRef.current?.querySelector('video')
    if (!video) return
    video.muted = !video.muted
    if (!video.muted && video.paused) void video.play().catch(() => {})
  }

  const like = () => {
    setLiked((v) => !v)
    setBurst((n) => n + 1)
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ url })
      else await navigator.clipboard.writeText(url)
    } catch {
      /* dismissed */
    }
  }

  return (
    <div ref={rootRef} className="reel-card relative overflow-hidden rounded-glass-lg bg-black">
      {children}

      <div className="reel-hud">
        <div className="reel-top">
          <span className="reel-track">
            <span ref={barRef} className="reel-fill" />
          </span>
        </div>

        <div className="reel-actions">
          <button
            type="button"
            className={`reel-btn${liked ? ' is-liked' : ''}`}
            aria-pressed={liked}
            aria-label="Like"
            onClick={like}
          >
            <svg key={burst} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
            </svg>
          </button>
          <span className="reel-btn reel-static" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3A8.5 8.5 0 1 1 20.5 11.5z" />
            </svg>
          </span>
          <button type="button" className="reel-btn" aria-label="Share" onClick={share}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 3 10 14" />
              <path d="M21 3 14.5 21l-4.5-7-7-4.5z" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="reel-btn reel-mute"
          aria-pressed={!muted}
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={toggleMute}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="m16 9 5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.reel-card video{display:block;width:100%;aspect-ratio:9/16;object-fit:cover}
.reel-hud{position:absolute;inset:0;pointer-events:none;color:#fff;font-family:inherit}
.reel-hud button{pointer-events:auto;cursor:pointer}
.reel-top{position:absolute;inset:0 0 auto 0;padding:10px 12px 28px;background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,0))}
.reel-track{display:block;height:2px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden}
.reel-fill{display:block;height:100%;background:#fff;transform:scaleX(0);transform-origin:left center;will-change:transform}
.reel-actions{position:absolute;right:10px;bottom:60px;display:flex;flex-direction:column;gap:16px;align-items:center}
.reel-btn{display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;background:none;color:#fff;
  filter:drop-shadow(0 1px 3px rgba(0,0,0,.45));transition:transform .2s cubic-bezier(.2,.7,.2,1)}
.reel-btn svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.reel-btn:hover{transform:scale(1.1)}
.reel-btn:active{transform:scale(.92)}
.reel-btn.is-liked svg{fill:#ff3040;stroke:#ff3040;animation:reel-pop .45s cubic-bezier(.2,.7,.2,1.4)}
@keyframes reel-pop{0%{transform:scale(.6)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
.reel-mute{position:absolute;left:10px;bottom:12px;width:32px;height:32px;border-radius:999px;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);filter:none}
.reel-mute svg{width:16px;height:16px}
.reel-card .reel-actions,.reel-card .reel-mute{opacity:.9;transition:opacity .25s}
.reel-card:hover .reel-actions,.reel-card:hover .reel-mute{opacity:1}
@media (max-width:767px){
  .reel-top{padding:8px 8px 20px}
  .reel-actions{right:4px;bottom:48px;gap:8px}
  .reel-btn{width:30px;height:30px}
  .reel-btn svg{width:20px;height:20px}
  .reel-mute{left:8px;bottom:8px;width:28px;height:28px}
}
@media (prefers-reduced-motion:reduce){
  .reel-btn,.reel-btn.is-liked svg{transition:none;animation:none}
}
`

export default ReelCard

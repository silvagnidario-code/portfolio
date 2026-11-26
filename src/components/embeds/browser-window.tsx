'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A live site inside a browser window: a title bar with the address and a
 * link out, and under it the site rendered at a laptop width (1280px) —
 * shown at its real size once the column is that wide, and scaled down to
 * fit below that — so the reader sees the whole layout, as on a laptop, rather
 * than a zoomed-in corner of it. Below the tablet breakpoint the frame is
 * too narrow for a scaled desktop to be legible, so the site renders at a
 * phone width (390px) instead and shows its own mobile layout.
 *
 * The window is narrower than the content column and sits on a soft shadow,
 * so it reads as an object placed on the page, not a hole cut into it.
 */
const DESKTOP_WIDTH = 1280
const DESKTOP_HEIGHT = 800
const PHONE_WIDTH = 390
const PHONE_HEIGHT = 760

export function BrowserWindow({ url, title }: { url: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ width: number; phone: boolean } | null>(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth
      setBox({ width, phone: window.innerWidth < 768 })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const frameWidth = box?.phone ? PHONE_WIDTH : DESKTOP_WIDTH
  const frameHeight = box?.phone ? PHONE_HEIGHT : DESKTOP_HEIGHT
  const scale = box ? Math.min(1, box.width / frameWidth) : 0
  const host = (() => {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  })()

  return (
    <div className="mx-auto w-full max-w-[80rem] overflow-hidden border border-line-strong bg-surface shadow-[0_24px_60px_-42px_rgb(0_0_0/0.5),0_0_50px_-28px_rgb(236_232_223/0.14)]">
      <div
        className="flex items-center gap-12 border-b border-line bg-surface-2 px-16 py-12"
        aria-hidden="true"
      >
        <span className="flex gap-8" aria-hidden="true">
          <span className="size-[0.625rem] rounded-full bg-[#E8442E]/80" />
          <span className="size-[0.625rem] rounded-full bg-ink-muted/40" />
          <span className="size-[0.625rem] rounded-full bg-ink-muted/40" />
        </span>
        <span
          aria-hidden="true"
          className="mx-auto truncate px-12 font-mono text-caption text-ink-muted"
        >
          {host}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-caption uppercase text-ink-muted transition ease-reveal duration-fast hover:text-ink"
        >
          ↗<span className="sr-only">{title}</span>
        </a>
      </div>
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-surface-2"
        style={{
          height: box ? frameHeight * scale : undefined,
          aspectRatio: box ? undefined : '16 / 10',
        }}
        data-lenis-prevent-wheel
      >
        {box ? (
          <iframe
            src={url}
            title={title}
            loading="eager"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})` }}
          />
        ) : null}
      </div>
    </div>
  )
}

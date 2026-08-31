'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { GlassSurface } from '@/components/glass/glass-surface'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from '@/components/icons'
import { MediaImage } from '@/components/media/media-image'
import type { MediaBlockType } from '@/payload-types'

type GalleryItem = NonNullable<MediaBlockType['items']>[number]

/**
 * The `gallery` variant of the media block: photos keep their natural
 * proportions and interlock in CSS columns instead of sitting in equal-height
 * grid rows, so mismatched portraits and landscapes still fit together
 * without gaps. Every photo opens full-screen to be examined at size, with
 * keyboard and glass-chrome navigation between the others in the set.
 *
 * Client-only on purpose: the grid is inert without the click handlers, so
 * unlike the rest of `MediaBlock` this branch pays the JS cost deliberately
 * instead of leaking it into the server-rendered variants.
 */
export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const t = useTranslations('PhotoGallery')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])

  const showPrev = useCallback(() => {
    setActiveIndex((index) => (index === null ? null : (index - 1 + items.length) % items.length))
  }, [items.length])

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index === null ? null : (index + 1) % items.length))
  }, [items.length])

  // Escape and the arrow keys drive the viewer; the document is frozen while
  // it's open so the page behind it can't scroll along with it.
  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      root.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, close, showPrev, showNext])

  if (items.length === 0) return null

  const active = activeIndex !== null ? items[activeIndex] : null

  return (
    <>
      <div className="columns-1 gap-16 tablet:columns-2 desktop:columns-3 [&>*]:mb-16">
        {items.map((item, index) => (
          <button
            key={item.id ?? index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-haspopup="dialog"
            aria-label={t('open', { index: index + 1, total: items.length })}
            className="group relative block w-full break-inside-avoid text-left"
          >
            <MediaImage
              media={item.media}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="w-full"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface-inverse/0 text-ink-inverse opacity-0 transition duration-fast ease-reveal group-hover:bg-surface-inverse/40 group-hover:opacity-100"
            >
              <ExpandIcon width="28" height="28" />
            </span>
            {item.caption ? (
              <span className="mt-16 block font-mono text-caption uppercase text-ink-muted">
                {item.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('dialogLabel')}
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-inverse/90 p-24"
          onClick={close}
        >
          <GlassSurface variant="chrome" className="absolute right-24 top-24">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                close()
              }}
              aria-label={t('close')}
              className="flex p-12"
            >
              <CloseIcon />
            </button>
          </GlassSurface>

          {items.length > 1 ? (
            <>
              <GlassSurface
                variant="chrome"
                className="absolute left-16 top-1/2 -translate-y-1/2 tablet:left-24"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    showPrev()
                  }}
                  aria-label={t('previous')}
                  className="flex p-12"
                >
                  <ChevronLeftIcon />
                </button>
              </GlassSurface>
              <GlassSurface
                variant="chrome"
                className="absolute right-16 top-1/2 -translate-y-1/2 tablet:right-24"
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    showNext()
                  }}
                  aria-label={t('next')}
                  className="flex p-12"
                >
                  <ChevronRightIcon />
                </button>
              </GlassSurface>
            </>
          ) : null}

          <figure
            className="flex max-h-full max-w-full flex-col items-center gap-16"
            onClick={(event) => event.stopPropagation()}
          >
            <MediaImage
              media={active.media}
              sizes="90vw"
              className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
              priority
              controls
            />
            {active.caption || items.length > 1 ? (
              <figcaption className="text-center font-mono text-caption uppercase text-ink-inverse">
                {active.caption}
                {items.length > 1 ? (
                  <span className="text-ink-inverse/70">
                    {active.caption ? ' — ' : null}
                    {t('counter', {
                      current: activeIndex !== null ? activeIndex + 1 : 0,
                      total: items.length,
                    })}
                  </span>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  )
}

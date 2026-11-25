'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { MediaImage } from '@/components/media/media-image'
import { Link } from '@/i18n/navigation'
import type { Media } from '@/payload-types'

export type ProjectIndexItem = {
  id: number
  slug: string
  title: string
  claim: string | null
  client: string
  services: Array<{ id: number; title: string }>
  year: string
  cover: number | Media | null | undefined
  coverVideo: number | Media | null | undefined
}

/**
 * The project index: a numbered list on the left and, from the desktop
 * breakpoint up, a large preview that stays in view on the right and follows
 * whichever row the pointer or the keyboard focus is on.
 *
 * Every row is a real link to the case study; the preview only mirrors it,
 * so nothing is reachable by hover alone. Below the desktop breakpoint the
 * preview is gone and each row carries its own thumbnail instead — a phone
 * still sees the work, not just its names.
 *
 * The images here are decorative: each row's link already says which
 * project it is, so reading the cover's alt text as well would announce the
 * same project twice.
 *
 * `filterable` adds a row of client-side filters by service, built from the
 * services the listed projects actually carry — a filter that would match
 * nothing never appears. Non-matching rows fade rather than disappear, so
 * the list does not jump under the pointer.
 */
export function ProjectIndex({
  items,
  headingLevel = 'h3',
  filterable = false,
}: {
  items: ProjectIndexItem[]
  headingLevel?: 'h2' | 'h3'
  filterable?: boolean
}) {
  const t = useTranslations('ProjectIndex')
  const [activeId, setActiveId] = useState(items[0]?.id ?? null)
  const [filter, setFilter] = useState<number | null>(null)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)')
    const update = () => setCanPlay(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const filters = useMemo(() => {
    const seen = new Map<number, string>()
    for (const item of items)
      for (const service of item.services) seen.set(service.id, service.title)
    return [...seen].map(([id, title]) => ({ id, title }))
  }, [items])

  const matches = (item: ProjectIndexItem) =>
    filter === null || item.services.some((service) => service.id === filter)

  const visibleCount = items.filter(matches).length
  const active = items.find((item) => item.id === activeId) ?? items[0]
  const Heading = headingLevel

  if (items.length === 0) return <p className="text-body-lg text-ink-2">{t('empty')}</p>

  return (
    <div>
      {filterable && filters.length > 1 ? (
        <div className="mb-32 flex flex-wrap items-center justify-between gap-16">
          <div role="group" aria-label={t('filterLabel')} className="flex flex-wrap">
            {[{ id: null, title: t('all') }, ...filters].map((option) => {
              const pressed = filter === option.id
              return (
                <button
                  key={option.id ?? 'all'}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setFilter(option.id)}
                  className={`-mb-px -mr-px min-h-[2.75rem] border border-line-strong px-16 font-mono text-caption uppercase transition ease-reveal duration-fast ${
                    pressed ? 'bg-ink text-surface' : 'text-ink hover:bg-surface-2'
                  }`}
                >
                  {option.title}
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="font-mono text-caption uppercase text-ink-muted">
            {t('count', { count: visibleCount })}
          </p>
        </div>
      ) : null}

      <div className="grid gap-48 desktop:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] desktop:gap-64">
        <div>
          <div
            aria-hidden="true"
            className="hidden grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_5rem] gap-24 border-b border-line pb-12 font-mono text-caption uppercase text-ink-muted desktop:grid"
          >
            <span>{t('number')}</span>
            <span>{t('project')}</span>
            <span>{t('services')}</span>
            <span className="text-right">{t('year')}</span>
          </div>

          <ul className="border-t border-line desktop:border-t-0">
            {items.map((item, index) => {
              const isActive = item.id === active?.id
              const dimmed = !matches(item)

              return (
                <li key={item.id}>
                  <Link
                    href={`/work/${item.slug}`}
                    onMouseEnter={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                    className={`group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-16 border-b border-line py-16 transition-[padding,opacity,filter] ease-reveal duration-base hover:pl-12 focus-visible:pl-12 desktop:grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_5rem] desktop:gap-24 desktop:py-24 desktop:hover:pl-24 ${
                      dimmed ? 'opacity-25 grayscale' : ''
                    }`}
                  >
                    <span
                      className={`hidden font-mono text-caption desktop:block ${
                        isActive ? 'text-accent' : 'text-ink-muted'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      aria-hidden="true"
                      className="block size-[3.5rem] overflow-hidden bg-surface-2 desktop:hidden"
                    >
                      <MediaImage
                        media={item.cover}
                        sizes="56px"
                        className="h-full w-full object-cover"
                        decorative
                      />
                    </span>

                    <span className="min-w-0">
                      <Heading className="text-h3 text-balance">{item.title}</Heading>
                      {item.claim ? (
                        <span className="mt-4 block text-body text-ink-muted">{item.claim}</span>
                      ) : null}
                    </span>

                    <span className="hidden font-mono text-caption uppercase text-ink-muted desktop:block">
                      {item.services.map((service) => service.title).join(' · ')}
                    </span>

                    <span className="flex items-center justify-end gap-8 font-mono text-caption text-ink-muted">
                      {item.year}
                      <span
                        aria-hidden="true"
                        className="translate-x-[-0.5rem] text-accent opacity-0 transition ease-reveal duration-base group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      >
                        ↗
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {active ? (
          <div aria-hidden="true" className="hidden desktop:block">
            <div className="sticky top-[6rem]">
              <Link
                href={`/work/${active.slug}`}
                tabIndex={-1}
                className="relative block aspect-[4/5] overflow-hidden bg-surface-2"
              >
                {items.map((item) => (
                  <span
                    key={item.id}
                    className={`absolute inset-0 transition-opacity ease-reveal duration-slow ${
                      item.id === active.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <MediaImage
                      media={item.cover}
                      sizes="(min-width: 1180px) 36vw, 0px"
                      className="h-full w-full object-cover"
                      decorative
                    />
                  </span>
                ))}

                {canPlay &&
                active.coverVideo &&
                typeof active.coverVideo === 'object' &&
                active.coverVideo.url ? (
                  <video
                    key={active.id}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source
                      src={active.coverVideo.url}
                      type={active.coverVideo.mimeType ?? undefined}
                    />
                  </video>
                ) : null}

                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-16 bg-gradient-to-t from-[rgb(10_10_12/0.7)] to-transparent p-24 pt-96 text-[#F2EEE6]">
                  <span className="text-h3">{active.client}</span>
                  <span className="shrink-0 font-mono text-caption uppercase">{t('open')} ↗</span>
                </span>
              </Link>
              <p className="mt-16 font-mono text-caption uppercase text-ink-muted">
                {active.services.map((service) => service.title).join(' · ')}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

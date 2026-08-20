import { MediaImage } from '@/components/media/media-image'
import type { MediaBlockType } from '@/payload-types'
import { BlockSection } from './block-section'

function Caption({ children }: { children?: string | null }) {
  if (!children) return null
  return (
    <figcaption className="page-margin mt-16 font-mono text-caption uppercase text-ink-muted">
      {children}
    </figcaption>
  )
}

/**
 * Media, four variants. Containers are square-cornered and never rounded:
 * content is paper.
 */
export function MediaBlock({ block }: { block: MediaBlockType }) {
  const { variant, items, video, poster, before, after, caption, settings } = block

  if (variant === 'videoLoop') {
    return (
      <BlockSection settings={settings}>
        <figure>
          <div className="aspect-video w-full overflow-hidden">
            {typeof video === 'object' && video?.url ? (
              <video
                className="h-full w-full object-cover"
                autoPlay
                playsInline
                muted
                loop
                preload="auto"
                poster={typeof poster === 'object' ? (poster?.url ?? undefined) : undefined}
              >
                <source src={video.url} type={video.mimeType ?? undefined} />
              </video>
            ) : (
              <MediaImage media={poster} sizes="100vw" className="h-full w-full object-cover" />
            )}
          </div>
          <Caption>{caption}</Caption>
        </figure>
      </BlockSection>
    )
  }

  if (variant === 'beforeAfter') {
    return (
      <BlockSection settings={settings}>
        <figure>
          <div className="page-grid">
            <div className="col-span-4 tablet:col-span-3 desktop:col-span-6">
              <MediaImage
                media={before}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full"
              />
            </div>
            <div className="col-span-4 tablet:col-span-3 desktop:col-span-6">
              <MediaImage media={after} sizes="(min-width: 768px) 50vw, 100vw" className="w-full" />
            </div>
          </div>
          <Caption>{caption}</Caption>
        </figure>
      </BlockSection>
    )
  }

  if (variant === 'pair') {
    return (
      <BlockSection settings={settings}>
        <figure>
          <div className="page-grid items-end">
            {(items ?? []).map((item, index) => (
              <div
                key={item.id ?? index}
                className={
                  index === 0
                    ? 'col-span-4 tablet:col-span-4 desktop:col-span-7'
                    : 'col-span-4 tablet:col-span-2 desktop:col-span-4 desktop:col-start-9'
                }
              >
                <MediaImage
                  media={item.media}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full"
                />
                {item.caption ? (
                  <p className="mt-16 font-mono text-caption uppercase text-ink-muted">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <Caption>{caption}</Caption>
        </figure>
      </BlockSection>
    )
  }

  const first = (items ?? [])[0]
  return (
    <BlockSection settings={settings}>
      <figure>
        <MediaImage media={first?.media} sizes="100vw" className="w-full" />
        <Caption>{first?.caption ?? caption}</Caption>
      </figure>
    </BlockSection>
  )
}

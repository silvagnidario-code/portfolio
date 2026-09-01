import { MediaImage } from '@/components/media/media-image'
import { MediaVideo } from '@/components/media/media-video'
import { PhotoGallery } from '@/components/media/photo-gallery'
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
 * Media, four variants. The layout containers stay square-cornered — content
 * is paper — but the photo or video itself carries `rounded-glass-lg`, same
 * as the navbar: see `radius` in `tokens/brand.ts`. The one exception is the
 * default variant below, which runs edge-to-edge like the hero rather than
 * sitting in the grid — that one stays square too.
 *
 * Each variant reveals as what it is rather than all reaching for the same
 * `rise`: a single video unveils like a banner (`mask`), photos settle into
 * focus (`blur`) — see `ScrollReveal` for what the four flavours mean. Still
 * gated by the editor's own `settings.animate` toggle, same as `rise` always
 * was.
 */
export function MediaBlock({ block }: { block: MediaBlockType }) {
  const { variant, items, video, poster, before, after, caption, settings } = block
  const reveal = (kind: 'blur' | 'mask') => (settings?.animate ? kind : undefined)

  if (variant === 'videoLoop') {
    return (
      <BlockSection settings={settings}>
        <figure className="page-margin">
          <div
            className="mx-auto max-w-full overflow-hidden"
            style={{ width: 'fit-content' }}
            data-reveal={reveal('mask')}
          >
            {typeof video === 'object' && video?.url ? (
              <MediaVideo
                src={video.url}
                mimeType={video.mimeType}
                className="block h-auto max-h-[80vh] w-auto max-w-full rounded-glass-lg"
                poster={typeof poster === 'object' ? (poster?.url ?? undefined) : undefined}
              />
            ) : (
              <MediaImage
                media={poster}
                sizes="100vw"
                className="h-auto max-h-[80vh] w-auto max-w-full rounded-glass-lg"
              />
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
            <div
              className="col-span-4 tablet:col-span-3 desktop:col-span-6"
              data-reveal={reveal('blur')}
            >
              <MediaImage
                media={before}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full rounded-glass-lg"
              />
            </div>
            <div
              className="col-span-4 tablet:col-span-3 desktop:col-span-6"
              data-reveal={reveal('blur')}
            >
              <MediaImage
                media={after}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full rounded-glass-lg"
              />
            </div>
          </div>
          <Caption>{caption}</Caption>
        </figure>
      </BlockSection>
    )
  }

  if (variant === 'gallery') {
    return (
      <BlockSection settings={settings}>
        <figure>
          <div className="page-margin">
            <PhotoGallery items={items ?? []} reveal={Boolean(settings?.animate)} />
          </div>
          <Caption>{caption}</Caption>
        </figure>
      </BlockSection>
    )
  }

  if (variant === 'pair') {
    const pairItems = items ?? []
    /**
     * Up to two items keep the deliberately unbalanced pair — a wide left and
     * a narrow right, offset. From three on that asymmetry stops reading as a
     * composition and starts reading as a mistake, so the same variant lays
     * the items out as an even grid instead: 3 across on desktop, 2 on tablet,
     * 1 on mobile.
     */
    const isGrid = pairItems.length > 2

    return (
      <BlockSection settings={settings}>
        <figure>
          <div className={isGrid ? 'page-grid' : 'page-grid items-end'}>
            {pairItems.map((item, index) => (
              <div
                key={item.id ?? index}
                className={
                  isGrid
                    ? 'col-span-4 tablet:col-span-3 desktop:col-span-4'
                    : index === 0
                      ? 'col-span-4 tablet:col-span-4 desktop:col-span-7'
                      : 'col-span-4 tablet:col-span-2 desktop:col-span-4 desktop:col-start-9'
                }
                data-reveal={reveal('blur')}
              >
                <MediaImage
                  media={item.media}
                  sizes={
                    isGrid
                      ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
                      : '(min-width: 768px) 50vw, 100vw'
                  }
                  className="w-full rounded-glass-lg"
                  controls="hover"
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
      <figure data-reveal={reveal('mask')}>
        {/* Edge-to-edge, no page-margin — this reads as a full-bleed banner
            like the hero, not a photo in the flow, so it stays square. */}
        <MediaImage media={first?.media} sizes="100vw" className="w-full" controls="hover" />
        <Caption>{first?.caption ?? caption}</Caption>
      </figure>
    </BlockSection>
  )
}

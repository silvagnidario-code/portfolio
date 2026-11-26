import { BrowserWindow } from '@/components/embeds/browser-window'
import { PhoneFrame, isInstagram } from '@/components/embeds/phone-frame'
import { getYouTubeId } from '@/lib/youtube'
import type { LiveEmbedBlock as LiveEmbedBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

/**
 * A live, navigable window onto another site, via `<iframe>`.
 *
 * YouTube links are the exception: they render as a 16:9 player on
 * youtube-nocookie.com, with no fallback link (the player has its own).
 * `page.tsx` leaves them out of the hero hoist, so they stay where the
 * editor put them in `execution`.
 *
 * For any other site, the fallback link is never conditional on the frame
 * failing to load: a site that refuses to be framed (`X-Frame-Options` /
 * CSP) just renders an empty box, with no error a script on this page can
 * observe. So the link always sits next to the frame, described as the
 * safety net it is, not swapped in after a failure this component cannot
 * detect.
 */
export function LiveEmbedBlock({ block }: { block: LiveEmbedBlockType }) {
  const { eyebrow, heading, url, fallbackLabel, settings } = block

  if (!url) return null

  const youtubeId = getYouTubeId(url)

  if (youtubeId) {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">
          <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
            {eyebrow ? (
              <p className="font-mono text-caption uppercase text-ink-muted">{eyebrow}</p>
            ) : null}
            {heading ? <h2 className="mt-8 text-h3 text-balance">{heading}</h2> : null}
            <div
              className="mt-24 aspect-video w-full overflow-hidden rounded-glass-lg border border-line-strong bg-surface-2"
              data-lenis-prevent-wheel
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                title={heading || 'YouTube'}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
          {eyebrow ? (
            <p className="font-mono text-caption uppercase text-ink-muted">{eyebrow}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-16">
            {heading ? <h2 className="text-h3 text-balance">{heading}</h2> : <span />}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-caption uppercase text-ink-muted hover:text-ink"
            >
              {fallbackLabel || 'Apri il sito in una nuova scheda'} ↗
            </a>
          </div>
          <div className="mt-32">
            {isInstagram(url) ? (
              <PhoneFrame url={url} title={heading || url} />
            ) : (
              <BrowserWindow url={url} title={heading || url} />
            )}
          </div>
        </div>
      </div>
    </BlockSection>
  )
}

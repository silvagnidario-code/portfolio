import type { LiveEmbedBlock as LiveEmbedBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

/**
 * A live, navigable window onto another site, via `<iframe>`.
 *
 * The fallback link is never conditional on the frame failing to load: a
 * site that refuses to be framed (`X-Frame-Options` / CSP) just renders an
 * empty box, with no error a script on this page can observe. So the link
 * always sits next to the frame, described as the safety net it is, not
 * swapped in after a failure this component cannot detect.
 */
export function LiveEmbedBlock({ block }: { block: LiveEmbedBlockType }) {
  const { eyebrow, heading, url, height, fallbackLabel, settings } = block

  if (!url) return null

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
              className="text-body-sm underline text-ink-muted hover:text-ink"
            >
              {fallbackLabel || 'Apri il sito in una nuova scheda'} ↗
            </a>
          </div>
          <div
            className="mt-24 w-full overflow-hidden rounded-glass-lg border border-line-strong bg-surface-2"
            style={{ height: `${height ?? 640}px` }}
          >
            <iframe
              src={url}
              title={heading || url}
              className="h-full w-full"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      </div>
    </BlockSection>
  )
}

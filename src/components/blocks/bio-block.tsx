import { MediaImage } from '@/components/media/media-image'
import type { BioBlockType } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'
import { RichText } from './rich-text'

/**
 * One photo, one heading, one bio: the "chi sono" block. Text always comes
 * first in the markup — a screen reader meets the name and the words before
 * the picture whichever side it sits on — and `imagePosition` only ever
 * changes where the two columns land on a wide screen.
 *
 * Below the `tablet` breakpoint, where the two columns stack instead of
 * sitting side by side, the photo is moved visually ahead of the text with
 * `order-first` (reset by `tablet:order-none`, where `imagePosition`'s own
 * `desktop:col-start-*` placement takes back over) and held narrower than
 * the full column with `w-4/5 mx-auto`, by request — a visitor on a phone
 * sees a smaller photo before the bio text rather than after it. DOM order
 * is untouched, so a screen reader's reading order is unaffected either
 * way; this only changes what sighted mobile visitors see first.
 */
export function BioBlock({ block }: { block: BioBlockType }) {
  const { eyebrow, heading, body, links, photo, imagePosition, settings } = block

  const isLeft = imagePosition === 'left'
  const reveal = (kind: 'lines' | 'blur') => (settings?.animate ? kind : undefined)

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div
          className={`col-span-4 tablet:col-span-3 desktop:col-span-6 ${
            isLeft ? 'desktop:col-start-7' : 'desktop:col-start-1'
          }`}
        >
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="mt-16 text-h1 text-balance" data-reveal={reveal('lines')}>
            {heading}
          </h2>

          <div data-reveal={settings?.animate ? 'rise' : undefined}>
            <RichText data={body} className="mt-32" />

            {links && links.length > 0 ? (
              <ul className="mt-32 flex flex-wrap gap-24">
                {links.map((link) => (
                  <li key={link.id ?? link.url}>
                    <a
                      href={link.url}
                      rel="noreferrer"
                      target="_blank"
                      className="font-mono text-caption uppercase text-ink-2 underline underline-offset-4 transition ease-reveal duration-fast hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div
          className={`order-first col-span-4 mx-auto mb-32 w-4/5 tablet:order-none tablet:col-span-3 tablet:mb-0 tablet:w-full desktop:col-span-5 ${
            isLeft ? 'desktop:col-start-1' : 'desktop:col-start-8'
          }`}
          data-reveal={reveal('blur')}
        >
          <MediaImage
            media={photo}
            sizes="(min-width: 1180px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="w-full rounded-glass-lg"
          />
        </div>
      </div>
    </BlockSection>
  )
}

export default BioBlock

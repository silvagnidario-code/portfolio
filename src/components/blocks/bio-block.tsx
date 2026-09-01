import { MediaImage } from '@/components/media/media-image'
import type { BioBlockType } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'
import { RichText } from './rich-text'

/**
 * One photo, one heading, one bio: the "chi sono" block. Text always comes
 * first in the markup — a screen reader meets the name and the words before
 * the picture whichever side it sits on — and `imagePosition` only ever
 * changes where the two columns land on a wide screen.
 */
export function BioBlock({ block }: { block: BioBlockType }) {
  const { eyebrow, heading, body, links, photo, imagePosition, settings } = block

  const isLeft = imagePosition === 'left'

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div
          className={`col-span-4 tablet:col-span-3 desktop:col-span-6 ${
            isLeft ? 'desktop:col-start-7' : 'desktop:col-start-1'
          }`}
        >
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="mt-16 text-h1 text-balance">{heading}</h2>
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

        <div
          className={`col-span-4 mt-32 tablet:col-span-3 tablet:mt-0 desktop:col-span-5 ${
            isLeft ? 'desktop:col-start-1' : 'desktop:col-start-8'
          }`}
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

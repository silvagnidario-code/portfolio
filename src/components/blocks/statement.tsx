import type { StatementBlock } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'
import { RichText } from './rich-text'

/**
 * A statement is the block that carries the studio's voice, so all three
 * variants are compositions of one heading and one paragraph — the difference
 * is where the empty columns fall.
 */
export function Statement({ block }: { block: StatementBlock }) {
  const { variant, eyebrow, heading, body, settings } = block

  if (variant === 'twoColumns') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">
          <div className="col-span-4 tablet:col-span-2 desktop:col-span-3">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          </div>
          <div className="col-span-4 tablet:col-span-4 desktop:col-span-8 desktop:col-start-5">
            <h2 className="text-h2 text-balance">{heading}</h2>
            <RichText data={body} className="mt-32" />
          </div>
        </div>
      </BlockSection>
    )
  }

  if (variant === 'horizontalScroll') {
    return (
      <BlockSection settings={settings}>
        <div className="page-margin">{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}</div>
        {/* Scrolls inside itself: the page never scrolls sideways. */}
        <div tabIndex={0} role="group" className="mt-24 overflow-x-auto">
          <h2 className="page-margin w-max text-h1 whitespace-nowrap">{heading}</h2>
        </div>
        <div className="page-grid mt-32">
          <div className="col-span-4 tablet:col-span-4 desktop:col-span-6 desktop:col-start-7">
            <RichText data={body} />
          </div>
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-5 desktop:col-span-7 desktop:col-start-2">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="mt-24 text-h1 text-balance">{heading}</h2>
        </div>
        <div className="col-span-4 tablet:col-span-4 tablet:col-start-3 desktop:col-span-5 desktop:col-start-6">
          <RichText data={body} className="mt-48" />
        </div>
      </div>
    </BlockSection>
  )
}

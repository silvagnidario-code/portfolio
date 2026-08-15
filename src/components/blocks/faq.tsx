import type { FaqBlock } from '@/payload-types'

import { BlockSection } from './block-section'
import { RichText } from './rich-text'

/**
 * Native `details`, so the accordion works before JavaScript arrives and is
 * operable from the keyboard without a single ARIA attribute of our own.
 */
export function Faq({ block }: { block: FaqBlock }) {
  const { heading, items, settings } = block

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        {heading ? (
          <h2 className="col-span-4 tablet:col-span-2 desktop:col-span-4 text-h2 text-balance">
            {heading}
          </h2>
        ) : null}

        <div className="col-span-4 tablet:col-span-4 desktop:col-span-7 desktop:col-start-6">
          {(items ?? []).map((item, index) => (
            <details
              key={item.id ?? index}
              className="border-t border-line last:border-b [&[open]>summary]:text-ink"
            >
              <summary className="cursor-pointer list-none py-24 text-h3 text-ink-2 transition ease-reveal duration-fast hover:text-ink">
                {item.question}
              </summary>
              <RichText data={item.answer} className="pb-32" />
            </details>
          ))}
        </div>
      </div>
    </BlockSection>
  )
}

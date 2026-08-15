import type { ResultsBlock } from '@/payload-types'

import { BlockSection } from './block-section'

/**
 * Numbers. The animated variant counts up in phase 8 — it is marked here and
 * renders its final value until then, which is also what a reader with
 * `prefers-reduced-motion` will always see.
 */
export function Results({ block }: { block: ResultsBlock }) {
  const { variant, heading, items, settings } = block

  return (
    <BlockSection settings={settings}>
      {heading ? <h2 className="page-margin mb-64 text-h2 text-balance">{heading}</h2> : null}

      <dl className="page-grid gap-y-48">
        {(items ?? []).map((item, index) => (
          <div
            key={item.id ?? index}
            className="col-span-4 tablet:col-span-2 desktop:col-span-4 border-t border-line pt-24"
          >
            <dd
              data-counter={variant === 'animatedCounters' ? item.value : undefined}
              className="text-display"
            >
              {item.value}
            </dd>
            <dt className="mt-16 text-body-lg">{item.label}</dt>
            {item.delta ? (
              <p className="mt-8 font-mono text-caption uppercase text-ink-muted">{item.delta}</p>
            ) : null}
          </div>
        ))}
      </dl>
    </BlockSection>
  )
}

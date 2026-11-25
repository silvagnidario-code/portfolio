import { getTranslations } from 'next-intl/server'

import type { StatementBlock } from '@/payload-types'

import { BlockSection, Eyebrow } from './block-section'
import { RichText } from './rich-text'

/**
 * A statement is the block that carries the studio's voice, so all three
 * variants are compositions of one heading and one paragraph — the difference
 * is where the empty columns fall.
 */
export async function Statement({
  block,
  showMethod = false,
}: {
  block: StatementBlock
  /** Pages composed in the CMS show the method steps under `asymmetric`; a
      statement inside a case study's narrative never does. */
  showMethod?: boolean
}) {
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

  // `asymmetric`: the method. A label column, the statement at a large
  // light size, the body under it, then the three steps of the method.
  const t = await getTranslations('Method')
  const steps = showMethod ? (t.raw('steps') as Array<{ title: string; body: string }>) : []

  return (
    <BlockSection settings={settings}>
      <div className="page-margin">
        <div className="grid gap-x-24 gap-y-32 border-t border-line pt-16 desktop:grid-cols-4">
          <div>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}</div>
          <div className="desktop:col-span-3">
            <h2 className="max-w-[20ch] text-h1 text-balance">{heading}</h2>
            <RichText data={body} className="mt-32 [&_p]:text-ink-muted" />
          </div>
        </div>
        {steps.length > 0 ? (
          <ol className="mt-64 grid gap-24 tablet:grid-cols-3 desktop:ml-[25%] desktop:pl-24">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-line pt-16">
                <p className="font-mono text-caption uppercase text-accent">
                  {String(index + 1).padStart(2, '0')} — {step.title}
                </p>
                <p className="mt-8 text-body text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </BlockSection>
  )
}

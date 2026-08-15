import { Link } from '@/i18n/navigation'
import type { CtaBlock } from '@/payload-types'

import { BlockSection } from './block-section'

/**
 * The one block with a commercial job: get the reader to the brief form. The
 * inline-form variant renders the entry point only — the form itself belongs to
 * the contact page in phase 7, and duplicating it here would duplicate its
 * validation too.
 */
export function Cta({ block }: { block: CtaBlock }) {
  const { variant, heading, body, action, settings } = block

  if (variant === 'minimalRow') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid items-baseline">
          <h2 className="col-span-4 tablet:col-span-4 desktop:col-span-8 text-h3 text-balance">
            {heading}
          </h2>
          {action?.label && action.href ? (
            <Link
              href={action.href}
              className="col-span-4 tablet:col-span-2 desktop:col-span-3 desktop:col-start-10 text-body-lg underline"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
      </BlockSection>
    )
  }

  if (variant === 'inlineForm') {
    return (
      <BlockSection settings={settings}>
        <div className="page-grid">
          <div className="col-span-4 tablet:col-span-6 desktop:col-span-7">
            <h2 className="text-h1 text-balance">{heading}</h2>
            {body ? <p className="mt-32 max-w-measure text-body-lg">{body}</p> : null}
          </div>
          <div className="col-span-4 tablet:col-span-6 desktop:col-span-4 desktop:col-start-9">
            <Link
              href="/contact"
              data-magnetic
              className="mt-48 inline-block border border-line-strong px-24 py-16 text-body-lg transition ease-reveal duration-fast hover:bg-surface-2"
            >
              {action?.label ?? heading}
            </Link>
          </div>
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={settings}>
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
          <h2 className="text-display text-balance">{heading}</h2>
          {body ? <p className="mt-32 max-w-measure text-body-lg">{body}</p> : null}
          {action?.label && action.href ? (
            <Link href={action.href} className="mt-48 inline-block text-body-lg underline">
              {action.label}
            </Link>
          ) : null}
        </div>
      </div>
    </BlockSection>
  )
}

import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import type { Service, ServicesBlockType } from '@/payload-types'

import { BlockSection } from './block-section'
import { RichText } from './rich-text'

async function resolveServices(block: ServicesBlockType, locale: Locale): Promise<Service[]> {
  const selected = (block.services ?? []).filter(
    (service): service is Service => typeof service === 'object',
  )

  if (selected.length > 0) return selected

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    locale,
    depth: 0,
    limit: 20,
    sort: 'order',
  })

  return result.docs
}

export async function ServicesBlock({
  block,
  locale,
}: {
  block: ServicesBlockType
  locale: Locale
}) {
  const services = await resolveServices(block, locale)

  // Without a block heading there is no h2 above these, so they become the h2.
  const ServiceHeading = block.heading ? 'h3' : 'h2'

  // A block with neither heading nor intro must not reserve the space for them.
  const intro =
    !block.heading && !block.intro ? null : (
      <div className="page-grid mb-64">
        <div className="col-span-4 tablet:col-span-4 desktop:col-span-6">
          {block.heading ? <h2 className="text-h2 text-balance">{block.heading}</h2> : null}
        </div>
        {block.intro ? (
          <p className="col-span-4 tablet:col-span-4 tablet:col-start-3 desktop:col-span-5 desktop:col-start-8 text-body-lg text-ink-2">
            {block.intro}
          </p>
        ) : null}
      </div>
    )

  if (block.variant === 'cards') {
    return (
      <BlockSection settings={block.settings}>
        {intro}
        <div className="page-grid gap-y-32">
          {services.map((service) => (
            <article
              key={service.id}
              className="col-span-4 tablet:col-span-3 desktop:col-span-4 border-t border-line pt-24"
            >
              <ServiceHeading className="text-h3">{service.title}</ServiceHeading>
              <p className="mt-16 text-body text-ink-2">{service.summary}</p>
            </article>
          ))}
        </div>
      </BlockSection>
    )
  }

  if (block.variant === 'numberedList') {
    return (
      <BlockSection settings={block.settings}>
        {intro}
        <ol className="page-grid gap-y-48">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2 border-t border-line pt-24"
            >
              <div className="flex flex-col gap-16 tablet:flex-row tablet:gap-48">
                <span className="font-mono text-caption uppercase text-ink-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <ServiceHeading className="text-h2 text-balance">{service.title}</ServiceHeading>
                  <p className="mt-16 max-w-measure text-body-lg text-ink-2">{service.summary}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={block.settings}>
      {intro}
      <div className="page-grid">
        <div className="col-span-4 tablet:col-span-6 desktop:col-span-10 desktop:col-start-2">
          {services.map((service) => (
            <details key={service.id} className="border-t border-line last:border-b">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-24 py-24">
                <span className="text-h3">{service.title}</span>
                <span className="max-w-measure text-body text-ink-muted">{service.summary}</span>
              </summary>
              <RichText data={service.description} className="pb-32" />
            </details>
          ))}
        </div>
      </div>
    </BlockSection>
  )
}

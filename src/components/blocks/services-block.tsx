import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'

import { ServicesBento } from './services-bento'
import { getServicesList } from '@/lib/queries'
import type { Service, ServicesBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

async function resolveServices(block: ServicesBlockType, locale: Locale): Promise<Service[]> {
  const selected = (block.services ?? []).filter(
    (service): service is Service => typeof service === 'object',
  )

  if (selected.length > 0) return selected

  return getServicesList(locale)
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

  // The default (`accordion` in the CMS) is now a bento grid: five cells of
  // unequal width on a hairline grid, each turning to the accent on hover.
  // The widths repeat every five services — wide, narrow, narrow / narrow,
  // wide — so the grid closes cleanly on four columns whatever the count.
  const t = await getTranslations('Services')

  return (
    <BlockSection settings={block.settings}>
      <div className="page-margin">
        <div className="mb-32 flex flex-wrap items-baseline justify-between gap-16 border-t border-line pt-16">
          {block.heading ? <h2 className="text-h2 text-balance">{block.heading}</h2> : <span />}
          <span className="font-mono text-caption text-ink-muted">
            ({String(services.length).padStart(2, '0')})
          </span>
        </div>
        {block.intro ? (
          <p className="mb-48 max-w-[40ch] text-body-lg text-ink-2">{block.intro}</p>
        ) : null}

        <ServicesBento
          headingLevel={block.heading ? 'h3' : 'h2'}
          services={services.map((service) => {
            const key = `deliverables.${service.id}`
            return {
              id: service.id,
              title: service.title,
              summary: service.summary ?? null,
              deliverables: t.has(key) ? t(key) : null,
            }
          })}
        />
      </div>
    </BlockSection>
  )
}

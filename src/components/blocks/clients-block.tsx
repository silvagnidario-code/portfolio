import { MediaImage } from '@/components/media/media-image'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import type { Client, ClientsBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

async function resolveClients(block: ClientsBlockType, locale: Locale): Promise<Client[]> {
  const selected = (block.clients ?? []).filter(
    (client): client is Client => typeof client === 'object',
  )

  if (selected.length > 0) return selected

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'clients',
    locale,
    depth: 1,
    limit: 30,
    sort: 'order',
  })

  return result.docs
}

export async function ClientsBlock({ block, locale }: { block: ClientsBlockType; locale: Locale }) {
  const clients = await resolveClients(block, locale)

  if (clients.length === 0) return null

  const heading = block.heading ? (
    <h2 className="page-margin mb-48 text-h3 text-ink-muted">{block.heading}</h2>
  ) : null

  if (block.variant === 'marquee') {
    return (
      <BlockSection settings={block.settings}>
        {heading}
        {/* The loop itself is driven in phase 8; a static row is what it
            enhances, and what a reader with reduced motion keeps. */}
        {/* A scrollable region has to be reachable by keyboard, so it takes
            focus and says what it is. */}
        <div
          data-marquee
          tabIndex={0}
          role="group"
          aria-label={block.heading ?? undefined}
          className="flex gap-64 overflow-x-auto page-margin"
        >
          {clients.map((client) => (
            <MediaImage
              key={client.id}
              media={client.logo}
              sizes="200px"
              className="h-32 w-auto shrink-0 opacity-70"
            />
          ))}
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={block.settings}>
      {heading}
      <ul className="page-grid gap-y-48">
        {clients.map((client) => (
          <li
            key={client.id}
            className="col-span-2 tablet:col-span-2 desktop:col-span-3 flex items-center"
          >
            <MediaImage media={client.logo} sizes="240px" className="h-32 w-auto opacity-70" />
          </li>
        ))}
      </ul>
    </BlockSection>
  )
}

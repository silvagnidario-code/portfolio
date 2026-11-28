'use client'

import { useState } from 'react'

export type BentoService = {
  id: number
  title: string
  summary: string | null
  deliverables: string | null
}

/**
 * The services grid, interactive. Each cell is a button: a click or a tap
 * turns it to the accent and slides open what that service delivers, with
 * a "+" that turns into a "×". One cell is open at a time; a second tap
 * closes it. On a pointer that hovers, hovering previews the accent too.
 *
 * Widths repeat every five services — wide, narrow, narrow / narrow, wide —
 * so the grid closes cleanly on four columns whatever the count.
 */
const SPANS = [
  'tablet:col-span-2 desktop:col-span-2',
  'desktop:col-span-1',
  'desktop:col-span-1',
  'desktop:col-span-1',
  'desktop:col-span-3',
]

export function ServicesBento({
  services,
  headingLevel = 'h3',
}: {
  services: BentoService[]
  headingLevel?: 'h2' | 'h3'
}) {
  const [open, setOpen] = useState<number | null>(null)
  const Heading = headingLevel

  return (
    <ul className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4">
      {services.map((service, index) => {
        const isOpen = open === service.id
        const panelId = `service-${service.id}`

        return (
          <li key={service.id} className={`-mb-px -mr-px ${SPANS[index % 5]}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : service.id)}
              className={`group flex h-full w-full flex-col justify-between gap-16 border border-line p-16 text-left transition-colors ease-reveal duration-base tablet:min-h-[11rem] tablet:p-24 [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-accent-ink ${
                isOpen ? 'bg-accent text-accent-ink' : ''
              }`}
            >
              <span className="flex items-center justify-between font-mono text-caption">
                ({String(index + 1).padStart(2, '0')})
                <span
                  aria-hidden="true"
                  className={`text-h3 leading-none transition-transform ease-reveal duration-base ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </span>
              <span className="block">
                <Heading className="text-h3 font-light">{service.title}</Heading>
                {service.summary ? (
                  <span className="mt-4 block max-w-[40ch] text-body opacity-80">
                    {service.summary}
                  </span>
                ) : null}
                {service.deliverables ? (
                  <span
                    id={panelId}
                    className={`grid transition-[grid-template-rows,opacity] ease-reveal duration-base ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-12 font-mono text-caption uppercase">
                        {service.deliverables}
                      </span>
                    </span>
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

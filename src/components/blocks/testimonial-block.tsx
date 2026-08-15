import { MediaImage } from '@/components/media/media-image'
import type { Testimonial, TestimonialBlockType } from '@/payload-types'

import { BlockSection } from './block-section'

function Attribution({ testimonial }: { testimonial: Testimonial }) {
  return (
    <footer className="mt-32 font-mono text-caption uppercase text-ink-muted">
      {[testimonial.author, testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
    </footer>
  )
}

/**
 * Testimonials, three variants. The slider is a scroll-snap track: it works
 * with a finger, a trackpad and a keyboard before any script runs, and phase 8
 * only adds the drag.
 */
export function TestimonialBlock({ block }: { block: TestimonialBlockType }) {
  const testimonials = (block.testimonials ?? []).filter(
    (item): item is Testimonial => typeof item === 'object',
  )

  if (testimonials.length === 0) return null

  if (block.variant === 'slider') {
    return (
      <BlockSection settings={block.settings}>
        <div className="flex snap-x snap-mandatory gap-24 overflow-x-auto page-margin page-snap-margin pb-24">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.id}
              className="w-[85vw] shrink-0 snap-start border-t border-line pt-24 tablet:w-[45vw]"
            >
              <p className="text-h3 text-balance">{testimonial.quote}</p>
              <Attribution testimonial={testimonial} />
            </blockquote>
          ))}
        </div>
      </BlockSection>
    )
  }

  const first = testimonials[0]!

  if (block.variant === 'quoteWithLogo') {
    return (
      <BlockSection settings={block.settings}>
        <div className="page-grid items-start">
          <div className="col-span-4 tablet:col-span-2 desktop:col-span-3">
            <MediaImage media={first.logo} sizes="200px" className="w-[160px]" />
          </div>
          <blockquote className="col-span-4 tablet:col-span-4 desktop:col-span-8 desktop:col-start-5">
            <p className="text-h2 text-balance">{first.quote}</p>
            <Attribution testimonial={first} />
          </blockquote>
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={block.settings}>
      <div className="page-grid">
        <blockquote className="col-span-4 tablet:col-span-6 desktop:col-span-9 desktop:col-start-3">
          <p className="text-h1 text-balance">{first.quote}</p>
          <Attribution testimonial={first} />
        </blockquote>
      </div>
    </BlockSection>
  )
}

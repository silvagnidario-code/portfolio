import { MediaImage } from '@/components/media/media-image'
import { HoverDistortion } from '@/components/motion/hover-distortion'
import { Link } from '@/i18n/navigation'
import type { Media, Project } from '@/payload-types'

/**
 * One project in a grid. The cover video, when there is one, is the hover loop
 * of §4 — it stays `preload="none"` and never starts without a poster, which is
 * what the still cover is.
 */
export function ProjectCard({
  project,
  sizes,
  aspect = 'aspect-[4/3]',
  headingLevel = 'h3',
}: {
  project: Project
  sizes: string
  aspect?: string
  /**
   * A card under a block that has its own heading is an h3; the same card on
   * the work index, where the page title is the only heading above it, is an
   * h2. Skipping a level is a real navigation problem for a screen reader.
   */
  headingLevel?: 'h2' | 'h3'
}) {
  const services = (project.services ?? []).filter(
    (service): service is Exclude<typeof service, number> => typeof service === 'object',
  )

  const Heading = headingLevel

  const cover: Media | null =
    project.cover && typeof project.cover === 'object' ? project.cover : null

  return (
    <article>
      <Link href={`/work/${project.slug}`} className="group block">
        <HoverDistortion
          src={cover?.url ?? ''}
          className={`w-full overflow-hidden rounded-glass-lg ${aspect}`}
        >
          <MediaImage
            media={project.cover}
            sizes={sizes}
            className="h-full w-full object-cover transition ease-reveal duration-slow group-hover:opacity-90"
          />
        </HoverDistortion>

        <div className="mt-24 flex flex-wrap items-baseline justify-between gap-16">
          <Heading className="text-h3 text-balance">{project.title}</Heading>
          <span className="font-mono text-caption uppercase text-ink-muted">{project.year}</span>
        </div>

        <p className="mt-8 font-mono text-caption uppercase text-ink-muted">
          {[project.client, ...services.map((service) => service.title)].join(' · ')}
        </p>
      </Link>
    </article>
  )
}

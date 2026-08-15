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
}: {
  project: Project
  sizes: string
  aspect?: string
}) {
  const services = (project.services ?? []).filter(
    (service): service is Exclude<typeof service, number> => typeof service === 'object',
  )

  const cover: Media | null =
    project.cover && typeof project.cover === 'object' ? project.cover : null

  return (
    <article>
      <Link href={`/work/${project.slug}`} className="group block">
        <HoverDistortion src={cover?.url ?? ''} className={`w-full overflow-hidden ${aspect}`}>
          <MediaImage
            media={project.cover}
            sizes={sizes}
            className="h-full w-full object-cover transition ease-reveal duration-slow group-hover:opacity-90"
          />
        </HoverDistortion>

        <div className="mt-24 flex flex-wrap items-baseline justify-between gap-16">
          <h3 className="text-h3 text-balance">{project.title}</h3>
          <span className="font-mono text-caption uppercase text-ink-muted">{project.year}</span>
        </div>

        <p className="mt-8 font-mono text-caption uppercase text-ink-muted">
          {[project.client, ...services.map((service) => service.title)].join(' · ')}
        </p>
      </Link>
    </article>
  )
}

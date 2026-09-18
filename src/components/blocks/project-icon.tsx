import { Link } from '@/i18n/navigation'
import type { Project } from '@/payload-types'

import { ProjectCover } from './project-cover'

/**
 * One project as a home-screen icon.
 *
 * The reveal is split in two, on purpose: the outer tile (`data-reveal="pop"`)
 * carries the inward-converging translate and the fade, while the inner
 * `data-pop-scale` cover is the only thing that actually scales. If the
 * label scaled with the icon, the spring's overshoot would briefly blow the
 * text up past its box and clip it — see `scroll-reveal.tsx`. The cover
 * itself sits narrower than its grid cell (not full-width) so the icons read
 * as smaller, deliberately, leaving more paper between them; the label stays
 * full-width so the name doesn't shrink along with it.
 */
export function ProjectIcon({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal="pop"
      className="group flex flex-col items-center gap-8 text-center"
    >
      <div
        data-pop-scale
        className="mx-auto aspect-square w-[78%] overflow-hidden rounded-glass-md transition ease-reveal duration-slow group-hover:scale-[1.04]"
      >
        <ProjectCover
          cover={project.cover}
          coverVideo={project.coverVideo}
          sizes="(min-width: 768px) 26vw, 39vw"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="line-clamp-1 w-full font-mono text-caption uppercase text-ink-muted">
        {project.title}
      </span>
    </Link>
  )
}

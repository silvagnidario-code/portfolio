import { Link } from '@/i18n/navigation'
import type { Project } from '@/payload-types'

import { ProjectCover } from './project-cover'

/**
 * One project as a home-screen icon.
 *
 * Unlike `ProjectCard`, the cover and the label are not two separate reveal
 * units — the whole tile carries one `data-reveal="pop"`, because a real
 * icon and its name arrive together, not half a beat apart. No hover video:
 * an icon this small has no room for a second read.
 */
export function ProjectIcon({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal="pop"
      className="group flex flex-col items-center gap-8 text-center"
    >
      <div className="aspect-square w-full overflow-hidden rounded-glass-md transition ease-reveal duration-slow group-hover:scale-[1.04]">
        <ProjectCover
          cover={project.cover}
          coverVideo={null}
          sizes="(min-width: 1180px) 11vw, (min-width: 768px) 15vw, 22vw"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="line-clamp-1 w-full font-mono text-caption uppercase text-ink-muted">
        {project.title}
      </span>
    </Link>
  )
}

import type { Locale } from '@/i18n/routing'
import { getProjectsList } from '@/lib/queries'
import type { Project, ProjectGridBlock } from '@/payload-types'

import { BlockSection } from './block-section'
import { ProjectCard } from './project-card'
import { ProjectIcon } from './project-icon'

async function resolveProjects(block: ProjectGridBlock, locale: Locale): Promise<Project[]> {
  if (block.source === 'manual') {
    return (block.projects ?? []).filter(
      (project): project is Project => typeof project === 'object',
    )
  }

  const service = typeof block.service === 'object' ? block.service?.id : block.service

  const result = await getProjectsList(locale, {
    limit: block.limit ?? 6,
    sort: ['order', '-year'],
    where:
      block.source === 'byService' && service
        ? { services: { in: [service] } }
        : { featured: { equals: true } },
  })

  return result.docs
}

/**
 * The project grid, four variants.
 *
 * `staggeredTwo` offsets the second column downwards — the asymmetry the
 * specification asks for, made with the grid rather than against it.
 * `draggableRow` scrolls inside itself; the drag-to-scroll behaviour is added
 * with the animation system in phase 8 and this is the version it enhances.
 * `iconGrid` reads as a phone's home screen: fixed 4/6/8 columns rather than
 * the page's structural 12/6/4, so a project is always a square icon and
 * never a fraction of one. Purely CMS-driven — the tile count is `limit`,
 * not a layout decision — so adding a project later is a new icon in the
 * grid, not a change to this component.
 */
export async function ProjectGrid({ block, locale }: { block: ProjectGridBlock; locale: Locale }) {
  const projects = await resolveProjects(block, locale)

  if (projects.length === 0) return null

  const heading = block.heading ? (
    <h2 className="page-margin mb-64 text-h2 text-balance">{block.heading}</h2>
  ) : null

  if (block.variant === 'compactThree') {
    return (
      <BlockSection settings={block.settings}>
        {heading}
        <div className="page-grid gap-y-64">
          {projects.map((project) => (
            <div key={project.id} className="col-span-4 tablet:col-span-3 desktop:col-span-4">
              <ProjectCard
                project={project}
                sizes="(min-width: 1180px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </BlockSection>
    )
  }

  if (block.variant === 'iconGrid') {
    return (
      <BlockSection settings={block.settings}>
        {heading}
        <div
          data-reveal-group
          className="page-margin grid grid-cols-4 gap-16 tablet:grid-cols-6 tablet:gap-24 desktop:grid-cols-8 desktop:gap-32"
        >
          {projects.map((project) => (
            <ProjectIcon key={project.id} project={project} />
          ))}
        </div>
      </BlockSection>
    )
  }

  if (block.variant === 'draggableRow') {
    return (
      <BlockSection settings={block.settings}>
        {heading}
        <div
          data-draggable="horizontal"
          tabIndex={0}
          role="group"
          aria-label={block.heading ?? undefined}
          className="flex snap-x snap-mandatory gap-24 overflow-x-auto page-margin page-snap-margin pb-24"
        >
          {projects.map((project) => (
            <div key={project.id} className="w-[80vw] shrink-0 snap-start tablet:w-[40vw]">
              <ProjectCard
                project={project}
                sizes="(min-width: 768px) 40vw, 80vw"
                aspect="aspect-[3/4]"
              />
            </div>
          ))}
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection settings={block.settings}>
      {heading}
      <div className="page-grid gap-y-96">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={
              index % 2 === 0
                ? 'col-span-4 tablet:col-span-4 desktop:col-span-7'
                : 'col-span-4 tablet:col-span-4 tablet:col-start-3 desktop:col-span-5 desktop:col-start-8 desktop:mt-128'
            }
          >
            <ProjectCard
              project={project}
              sizes="(min-width: 1180px) 55vw, (min-width: 768px) 65vw, 100vw"
              aspect={index % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}
            />
          </div>
        ))}
      </div>
    </BlockSection>
  )
}

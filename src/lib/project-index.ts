import type { ProjectIndexItem } from '@/components/work/project-index'
import { formatYearRange } from '@/lib/format'
import type { Project, Service } from '@/payload-types'

/**
 * Narrows full project documents to what the index renders, on the server:
 * the client component receives a handful of fields per project instead of
 * every rich-text body of every case study.
 */
export function toProjectIndexItems(projects: Project[]): ProjectIndexItem[] {
  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    claim: project.claim ?? null,
    client: project.client,
    services: (project.services ?? [])
      .filter((service): service is Service => typeof service === 'object')
      .map((service) => ({ id: service.id, title: service.title })),
    year: formatYearRange(project.year, project.yearEnd),
    cover: project.cover,
    coverVideo: project.coverVideo,
  }))
}

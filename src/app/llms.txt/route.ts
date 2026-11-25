import { env } from '@/lib/env'
import { getGlobal } from '@/lib/payload'
import { getProjectsList, getServicesList } from '@/lib/queries'

/**
 * `/llms.txt`: a plain-text summary of the site for language models and the
 * assistants built on them — who this is, what he does, and a link to every
 * published case study. Built from the CMS, in italian (the default locale),
 * with the english pages linked alongside.
 *
 * It lives at the app root, like `robots.ts` and `sitemap.ts`: under the
 * `[locale]` segment the path would be read as a locale and fail.
 */
// Rendered on request (the CMS reads are cached and tag-invalidated), so a
// build without a database — the Docker image — still succeeds.
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const base = env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')

  const [seo, settings, services, projects] = await Promise.all([
    getGlobal('seo-defaults', 'it'),
    getGlobal('settings', 'it'),
    getServicesList('it'),
    getProjectsList('it', {
      limit: 100,
      sort: ['order', '-year'],
      where: { _status: { equals: 'published' } },
    }),
  ])

  const lines = [
    `# ${seo.siteName}`,
    '',
    `> ${seo.description}`,
    '',
    '## Servizi',
    ...services.map(
      (service) => `- ${service.title}${service.summary ? `: ${service.summary}` : ''}`,
    ),
    '',
    '## Progetti',
    ...projects.docs.map(
      (project) =>
        `- [${project.title}](${base}/it/work/${project.slug}): ${project.claim} (${project.client}, ${project.year})`,
    ),
    '',
    '## Pagine',
    `- [Progetti](${base}/it/work)`,
    `- [Chi sono](${base}/it/about)`,
    `- [Servizi](${base}/it/services)`,
    `- [Contatti](${base}/it/contact)`,
    `- [English version](${base}/en)`,
    '',
    '## Contatti',
    ...(settings.contact?.email ? [`- Email: ${settings.contact.email}`] : []),
    ...(settings.social ?? []).map((entry) => `- ${entry.platform}: ${entry.url}`),
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

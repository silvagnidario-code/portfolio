import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { locales, type Locale } from '../i18n/routing'
import { aboutCopy, globalsCopy, homeCopy, legalCopy, servicesCopy } from './content/pages'
import { clients, team, testimonials } from './content/people'
import { projects } from './content/projects'
import { industries, services, type Localized } from './content/taxonomy'
import { generateImage, generateLogo } from './images'
import { richText } from './lexical'

/**
 * Seeds a full, plausible dataset in all three languages.
 *
 * It exists to test layouts, so the copy has realistic lengths: italian runs
 * long, english about 15% shorter, chinese 30-50% shorter. That difference is
 * what breaks a design built on vertical rhythm, and lorem ipsum hides it.
 *
 * Destructive: it clears the content collections first. It never touches users.
 *
 *   npm run seed
 */

type Ids = Record<string, number>

const otherLocales = locales.filter((locale) => locale !== 'it') as Locale[]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Copies row ids from the document as it already exists onto the translation
 * about to be written.
 *
 * Arrays and blocks are *not* localized: their structure is shared and only the
 * fields inside them carry one value per language. Sending rows without their
 * ids makes Payload treat them as new rows, which silently drops the language
 * that was written first. Matching by position is safe here because the seed is
 * the only writer.
 */
function withRowIds(existing: unknown, incoming: unknown): unknown {
  if (Array.isArray(incoming)) {
    const rows = Array.isArray(existing) ? existing : []
    return incoming.map((item, index) => withRowIds(rows[index], item))
  }

  if (isRecord(incoming)) {
    const base = isRecord(existing) ? existing : {}
    const merged: Record<string, unknown> = { ...incoming }

    if (typeof base.id === 'string' || typeof base.id === 'number') {
      merged.id = base.id
    }

    for (const [key, value] of Object.entries(incoming)) {
      if (Array.isArray(value) || isRecord(value)) {
        merged[key] = withRowIds(base[key], value)
      }
    }

    return merged
  }

  return incoming
}

/** Creates in italian, then fills the other two languages. */
async function createLocalized<
  T extends 'projects' | 'pages' | 'services' | 'industries' | 'team-members' | 'testimonials',
>(
  payload: Payload,
  collection: T,
  base: Record<string, unknown>,
  translations: Partial<Record<Locale, Record<string, unknown>>>,
): Promise<number> {
  const doc = await payload.create({
    collection,
    locale: 'it',
    // The seed data is authored by hand against the schema; Payload validates
    // it on the way in, which is what makes this cast safe in practice.
    data: { ...base, ...(translations.it ?? {}) } as never,
  })

  for (const locale of otherLocales) {
    const translation = translations[locale]
    if (!translation) continue

    await payload.update({
      collection,
      id: doc.id,
      locale,
      data: withRowIds(doc, translation) as never,
    })
  }

  return doc.id as number
}

/**
 * Globals have the same trap as collections: their arrays are not localized,
 * so a translation written without the existing row ids replaces the rows and
 * takes the previous language's labels with it.
 */
async function updateGlobalLocalized<
  T extends 'settings' | 'navigation' | 'footer' | 'seo-defaults',
>(payload: Payload, slug: T, dataFor: (locale: Locale) => Record<string, unknown>): Promise<void> {
  const created = await payload.updateGlobal({
    slug,
    locale: 'it',
    data: dataFor('it') as never,
  })

  for (const locale of otherLocales) {
    await payload.updateGlobal({
      slug,
      locale,
      data: withRowIds(created, dataFor(locale)) as never,
    })
  }
}

async function uploadImage(
  payload: Payload,
  {
    width,
    height,
    seed,
    alt,
  }: { width: number; height: number; seed: number; alt: Localized<string> },
): Promise<number> {
  const buffer = await generateImage(width, height, seed)

  const doc = await payload.create({
    collection: 'media',
    locale: 'it',
    data: { alt: alt.it },
    file: {
      data: buffer,
      mimetype: 'image/jpeg',
      name: `seed-${seed}-${width}x${height}.jpg`,
      size: buffer.length,
    },
  })

  for (const locale of otherLocales) {
    await payload.update({ collection: 'media', id: doc.id, locale, data: { alt: alt[locale] } })
  }

  return doc.id as number
}

async function uploadLogo(payload: Payload, name: string): Promise<number> {
  const buffer = generateLogo(name)

  const doc = await payload.create({
    collection: 'media',
    locale: 'it',
    data: { alt: `Logo ${name}` },
    file: {
      data: buffer,
      mimetype: 'image/svg+xml',
      name: `logo-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`,
      size: buffer.length,
    },
  })

  for (const locale of otherLocales) {
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale,
      data: { alt: `Logo ${name}` },
    })
  }

  return doc.id as number
}

const blockSettings = (
  background: 'paper' | 'sumi' | 'accent',
  spacing: 'compact' | 'normal' | 'wide',
) => ({
  settings: { background, spacing, animate: true },
})

async function clear(payload: Payload): Promise<void> {
  const collections = [
    'projects',
    'pages',
    'testimonials',
    'services',
    'team-members',
    'clients',
    'industries',
    'media',
  ] as const

  for (const collection of collections) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
}

async function seed(): Promise<void> {
  const payload = await getPayload({ config })

  payload.logger.info('Clearing content collections...')
  await clear(payload)

  // ---- taxonomy -----------------------------------------------------------
  payload.logger.info('Industries and services...')

  const industryIds: Ids = {}
  for (const industry of industries) {
    industryIds[industry.key] = await createLocalized(
      payload,
      'industries',
      {},
      {
        it: { title: industry.title.it },
        en: { title: industry.title.en },
        zh: { title: industry.title.zh },
      },
    )
  }

  const serviceIds: Ids = {}
  for (const service of services) {
    serviceIds[service.key] = await createLocalized(
      payload,
      'services',
      { order: service.order },
      {
        it: {
          title: service.title.it,
          summary: service.summary.it,
          description: richText(...service.description.it),
        },
        en: {
          title: service.title.en,
          summary: service.summary.en,
          description: richText(...service.description.en),
        },
        zh: {
          title: service.title.zh,
          summary: service.summary.zh,
          description: richText(...service.description.zh),
        },
      },
    )
  }

  // ---- people and clients -------------------------------------------------
  payload.logger.info('Team and clients...')

  const teamIds: Ids = {}
  for (const [index, person] of team.entries()) {
    const photo = await uploadImage(payload, {
      width: 900,
      height: 1200,
      seed: 100 + index,
      alt: {
        it: `Ritratto di ${person.name}`,
        en: `Portrait of ${person.name}`,
        zh: `${person.name} 的肖像`,
      },
    })

    teamIds[person.key] = await createLocalized(
      payload,
      'team-members',
      { name: person.name, order: person.order, photo, links: person.links },
      {
        it: { role: person.role.it, bio: person.bio.it },
        en: { role: person.role.en, bio: person.bio.en },
        zh: { role: person.role.zh, bio: person.bio.zh },
      },
    )
  }

  const clientIds: Ids = {}
  for (const client of clients) {
    const logo = await uploadLogo(payload, client.name)

    const doc = await payload.create({
      collection: 'clients',
      data: { name: client.name, order: client.order, logo, url: client.url ?? null },
    })

    clientIds[client.key] = doc.id as number
  }

  // ---- projects -----------------------------------------------------------
  payload.logger.info('Case studies...')

  const projectIds: Ids = {}

  for (const [index, project] of projects.entries()) {
    const cover = await uploadImage(payload, {
      width: 1600,
      height: 1200,
      seed: 10 + index,
      alt: {
        it: `${project.client}, immagine di copertina`,
        en: `${project.client}, cover image`,
        zh: `${project.client}，封面图`,
      },
    })

    const hero = await uploadImage(payload, {
      width: 2400,
      height: 1350,
      seed: 20 + index,
      alt: {
        it: `${project.client}, apertura del caso studio`,
        en: `${project.client}, case study opening`,
        zh: `${project.client}，案例开篇图`,
      },
    })

    const executionMedia: number[] = []
    for (const [step, item] of project.execution.entries()) {
      if (item.kind !== 'media') continue

      executionMedia.push(
        await uploadImage(payload, {
          width: 2000,
          height: 1250,
          seed: 30 + index * 10 + step,
          alt: {
            it: item.caption.it,
            en: item.caption.en,
            zh: item.caption.zh,
          },
        }),
      )
    }

    const galleryMedia: number[] = []
    for (const step of [0, 1]) {
      galleryMedia.push(
        await uploadImage(payload, {
          width: 1600,
          height: 2000,
          seed: 60 + index * 10 + step,
          alt: {
            it: `${project.client}, galleria ${step + 1}`,
            en: `${project.client}, gallery ${step + 1}`,
            zh: `${project.client}，图集 ${step + 1}`,
          },
        }),
      )
    }

    const executionFor = (locale: Locale) => {
      let mediaIndex = 0

      return project.execution.map((item) => {
        if (item.kind === 'prose') {
          return {
            blockType: 'prose' as const,
            heading: item.heading[locale],
            body: richText(...item.body[locale]),
          }
        }

        const media = executionMedia[mediaIndex]
        mediaIndex += 1

        return {
          blockType: 'media' as const,
          variant: 'fullBleed' as const,
          items: [{ media, caption: item.caption[locale] }],
          caption: item.caption[locale],
          ...blockSettings('paper', 'normal'),
        }
      })
    }

    const localizedFor = (locale: Locale) => ({
      title: project.title[locale],
      slug: project.slug[locale],
      claim: project.claim[locale],
      context: richText(...project.context[locale]),
      challenge: richText(...project.challenge[locale]),
      approach: richText(...project.approach[locale]),
      execution: executionFor(locale),
      results: project.results.map((result) => ({
        value: result.value,
        label: result.label[locale],
        delta: result.delta[locale],
      })),
      partners: project.partners.map((partner) => ({
        name: partner.name,
        role: partner.role[locale],
      })),
      awards: project.awards.map((award) => ({
        name: award.name,
        year: award.year,
        category: award.category[locale],
      })),
      gallery: [
        {
          blockType: 'media' as const,
          variant: 'pair' as const,
          items: galleryMedia.map((media) => ({ media })),
          ...blockSettings('paper', 'normal'),
        },
      ],
    })

    projectIds[project.key] = await createLocalized(
      payload,
      'projects',
      {
        _status: 'published',
        client: project.client,
        year: project.year,
        featured: project.featured,
        order: project.order,
        industry: industryIds[project.industryKey],
        services: project.serviceKeys.map((key) => serviceIds[key]),
        team: project.teamKeys.map((key) => teamIds[key]),
        cover,
        heroMedia: hero,
        accentColor: project.accentColor,
        liveUrl: project.liveUrl ?? null,
      },
      {
        it: localizedFor('it'),
        en: localizedFor('en'),
        zh: localizedFor('zh'),
      },
    )
  }

  // Related projects: every case study points at the other two.
  for (const project of projects) {
    await payload.update({
      collection: 'projects',
      id: projectIds[project.key]!,
      data: {
        related: projects
          .filter((other) => other.key !== project.key)
          .map((other) => projectIds[other.key]!),
      },
    })
  }

  // ---- testimonials -------------------------------------------------------
  payload.logger.info('Testimonials...')

  const testimonialIds: Ids = {}
  for (const testimonial of testimonials) {
    const clientDoc = await payload.findByID({
      collection: 'clients',
      id: clientIds[testimonial.clientKey]!,
    })

    testimonialIds[testimonial.key] = await createLocalized(
      payload,
      'testimonials',
      {
        author: testimonial.author,
        company: testimonial.company,
        logo: typeof clientDoc.logo === 'number' ? clientDoc.logo : clientDoc.logo?.id,
        project: projectIds[testimonial.projectKey],
      },
      {
        it: { quote: testimonial.quote.it, role: testimonial.role.it },
        en: { quote: testimonial.quote.en, role: testimonial.role.en },
        zh: { quote: testimonial.quote.zh, role: testimonial.role.zh },
      },
    )

    await payload.update({
      collection: 'projects',
      id: projectIds[testimonial.projectKey]!,
      data: { testimonial: testimonialIds[testimonial.key]! },
    })
  }

  // ---- pages --------------------------------------------------------------
  payload.logger.info('Pages...')

  const aboutHero = await uploadImage(payload, {
    width: 2400,
    height: 1350,
    seed: 200,
    alt: { it: 'Lo studio, Milano', en: 'The studio, Milan', zh: '工作室，米兰' },
  })

  const homeLayout = (locale: Locale) => [
    {
      blockType: 'hero' as const,
      variant: 'typographic' as const,
      eyebrow: homeCopy.hero.eyebrow[locale],
      heading: homeCopy.hero.heading[locale],
      lead: homeCopy.hero.lead[locale],
      cta: { label: homeCopy.hero.ctaLabel[locale], href: '/work' },
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'statement' as const,
      variant: 'asymmetric' as const,
      eyebrow: homeCopy.statement.eyebrow[locale],
      heading: homeCopy.statement.heading[locale],
      body: richText(...homeCopy.statement.body[locale]),
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'projectGrid' as const,
      variant: 'staggeredTwo' as const,
      heading: homeCopy.projects.heading[locale],
      source: 'featured' as const,
      limit: 4,
      ...blockSettings('paper', 'normal'),
    },
    {
      blockType: 'services' as const,
      variant: 'accordion' as const,
      heading: homeCopy.services.heading[locale],
      intro: homeCopy.services.intro[locale],
      ...blockSettings('sumi', 'wide'),
    },
    {
      blockType: 'testimonial' as const,
      variant: 'fullPage' as const,
      testimonials: [testimonialIds.kaisu!, testimonialIds.nebbia!],
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'clients' as const,
      variant: 'marquee' as const,
      heading: homeCopy.clients.heading[locale],
      ...blockSettings('paper', 'compact'),
    },
    {
      blockType: 'cta' as const,
      variant: 'typographicBanner' as const,
      heading: homeCopy.cta.heading[locale],
      body: homeCopy.cta.body[locale],
      action: { label: homeCopy.cta.label[locale], href: '/contact' },
      ...blockSettings('accent', 'wide'),
    },
  ]

  await createLocalized(
    payload,
    'pages',
    { _status: 'published' },
    {
      it: { title: homeCopy.title.it, slug: 'home', layout: homeLayout('it') },
      en: { title: homeCopy.title.en, slug: 'home', layout: homeLayout('en') },
      zh: { title: homeCopy.title.zh, slug: 'home', layout: homeLayout('zh') },
    },
  )

  const servicesLayout = (locale: Locale) => [
    {
      blockType: 'hero' as const,
      variant: 'typographic' as const,
      eyebrow: servicesCopy.hero.eyebrow[locale],
      heading: servicesCopy.hero.heading[locale],
      lead: servicesCopy.hero.lead[locale],
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'services' as const,
      variant: 'numberedList' as const,
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'faq' as const,
      variant: 'accordion' as const,
      heading: servicesCopy.faq.heading[locale],
      items: servicesCopy.faq.items.map((item) => ({
        question: item.question[locale],
        answer: richText(...item.answer[locale]),
      })),
      ...blockSettings('paper', 'normal'),
    },
    {
      blockType: 'cta' as const,
      variant: 'minimalRow' as const,
      heading: servicesCopy.cta.heading[locale],
      action: { label: servicesCopy.cta.label[locale], href: '/contact' },
      ...blockSettings('sumi', 'normal'),
    },
  ]

  await createLocalized(
    payload,
    'pages',
    { _status: 'published' },
    {
      it: { title: servicesCopy.title.it, slug: 'services', layout: servicesLayout('it') },
      en: { title: servicesCopy.title.en, slug: 'services', layout: servicesLayout('en') },
      zh: { title: servicesCopy.title.zh, slug: 'services', layout: servicesLayout('zh') },
    },
  )

  const aboutLayout = (locale: Locale) => [
    {
      blockType: 'hero' as const,
      variant: 'webglImage' as const,
      eyebrow: aboutCopy.hero.eyebrow[locale],
      heading: aboutCopy.hero.heading[locale],
      lead: aboutCopy.hero.lead[locale],
      image: aboutHero,
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'statement' as const,
      variant: 'twoColumns' as const,
      eyebrow: aboutCopy.statement.eyebrow[locale],
      heading: aboutCopy.statement.heading[locale],
      body: richText(...aboutCopy.statement.body[locale]),
      ...blockSettings('paper', 'wide'),
    },
    {
      blockType: 'team' as const,
      variant: 'photoGrid' as const,
      heading: aboutCopy.team.heading[locale],
      intro: aboutCopy.team.intro[locale],
      ...blockSettings('paper', 'normal'),
    },
    {
      blockType: 'clients' as const,
      variant: 'staticGrid' as const,
      heading: aboutCopy.clients.heading[locale],
      ...blockSettings('sumi', 'normal'),
    },
    {
      blockType: 'cta' as const,
      variant: 'typographicBanner' as const,
      heading: aboutCopy.cta.heading[locale],
      action: { label: aboutCopy.cta.label[locale], href: '/contact' },
      ...blockSettings('accent', 'wide'),
    },
  ]

  await createLocalized(
    payload,
    'pages',
    { _status: 'published' },
    {
      it: { title: aboutCopy.title.it, slug: 'about', layout: aboutLayout('it') },
      en: { title: aboutCopy.title.en, slug: 'about', layout: aboutLayout('en') },
      zh: { title: aboutCopy.title.zh, slug: 'about', layout: aboutLayout('zh') },
    },
  )

  for (const page of [legalCopy.privacy, legalCopy.cookie]) {
    const layout = (locale: Locale) => [
      {
        blockType: 'hero' as const,
        variant: 'typographic' as const,
        eyebrow: page.title[locale],
        heading: page.heading[locale],
        lead: page.lead[locale],
        ...blockSettings('paper', 'wide'),
      },
      {
        blockType: 'statement' as const,
        variant: 'twoColumns' as const,
        heading: page.heading[locale],
        body: richText(...page.body[locale]),
        ...blockSettings('paper', 'normal'),
      },
    ]

    await createLocalized(
      payload,
      'pages',
      { _status: 'published' },
      {
        it: { title: page.title.it, slug: page.slug, layout: layout('it') },
        en: { title: page.title.en, slug: page.slug, layout: layout('en') },
        zh: { title: page.title.zh, slug: page.slug, layout: layout('zh') },
      },
    )
  }

  // ---- globals ------------------------------------------------------------
  payload.logger.info('Globals...')

  const ogImage = await uploadImage(payload, {
    width: 1200,
    height: 630,
    seed: 300,
    alt: { it: 'Studio', en: 'Studio', zh: '工作室' },
  })

  await updateGlobalLocalized(payload, 'settings', (locale) => ({
    legalName: globalsCopy.settings.legalName,
    vatId: globalsCopy.settings.vatId,
    contact: {
      email: globalsCopy.settings.email,
      briefRecipient: globalsCopy.settings.briefRecipient,
      phone: globalsCopy.settings.phone,
    },
    offices: globalsCopy.settings.offices.map((office) => ({
      city: office.city[locale],
      address: office.address[locale],
      timezone: office.timezone,
    })),
    social: globalsCopy.settings.social,
  }))

  await updateGlobalLocalized(payload, 'navigation', (locale) => ({
    items: globalsCopy.navigation.map((item) => ({
      label: item.label[locale],
      type: 'internal' as const,
      path: item.path,
    })),
  }))

  await updateGlobalLocalized(payload, 'footer', (locale) => ({
    columns: globalsCopy.footer.columns.map((column) => ({
      title: column.title[locale],
      links: column.links.map((link) => ({ label: link.label[locale], url: link.url })),
    })),
    legalText: globalsCopy.footer.legalText[locale],
  }))

  await updateGlobalLocalized(payload, 'seo-defaults', (locale) => ({
    siteName: globalsCopy.seo.siteName[locale],
    titleTemplate: globalsCopy.seo.titleTemplate,
    description: globalsCopy.seo.description[locale],
    ogImage,
  }))

  payload.logger.info('Seed complete.')
}

try {
  await seed()
  process.exit(0)
} catch (error) {
  // Payload validation errors carry the offending fields in `data.errors`;
  // without printing them the failure is a wall of stack trace.
  const details = (error as { data?: { errors?: unknown } })?.data?.errors
  console.error(error instanceof Error ? error.message : error)
  if (details) console.error(JSON.stringify(details, null, 2))
  process.exit(1)
}

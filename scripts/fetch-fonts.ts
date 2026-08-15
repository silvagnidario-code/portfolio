/**
 * Self-hosts the two Google faces this project uses, and writes the stylesheets
 * and the preload manifest the app links to.
 *
 * Why not `next/font` for these two: it downloads the family's *entire*
 * stylesheet and uses `subsets` only to decide what to preload. Zen Kaku Gothic
 * New is a japanese face, so that means 364 unicode-range rules — 274 KB, 90 KB
 * gzipped — render-blocking on every page, for a site that only ever draws
 * latin with it. Noto Sans SC has the same problem in reverse: its rules were
 * being served to italian and english readers who never need a han glyph.
 *
 * Here each family is filtered to the ranges that are actually used, weights
 * that share a file are collapsed into one rule, and the result is linked
 * exactly where it is needed. The unicode-range slicing itself is preserved,
 * which is what keeps CJK subsetting dynamic.
 *
 * Geist Mono stays on `next/font`: it is latin-only and already small.
 *
 * Runs before `dev` and `build`; does nothing when the output already exists.
 */

import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Google serves woff2 with unicode-range only to browsers it recognises.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

type FamilySpec = {
  family: string
  slug: string
  weights: readonly number[]
  /** `latin` drops every range that carries no latin, punctuation or symbols. */
  keep: 'latin' | 'all'
  /** Weights whose basic-latin slice should be preloaded. */
  preloadWeights: readonly number[]
}

const families: readonly FamilySpec[] = [
  {
    family: 'Zen Kaku Gothic New',
    slug: 'zen-kaku',
    weights: [300, 400, 500],
    keep: 'latin',
    preloadWeights: [300, 400],
  },
  {
    family: 'Noto Sans SC',
    slug: 'noto-sans-sc',
    weights: [300, 400, 500],
    keep: 'all',
    preloadWeights: [],
  },
]

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicFonts = path.join(root, 'public', 'fonts')
const ogFonts = path.join(publicFonts, 'og')
const manifestPath = path.join(root, 'src', 'lib', 'font-manifest.generated.ts')

/**
 * Open Graph images are drawn by Satori, which needs a whole font file — it
 * cannot use the unicode-range slices above, and it does not read woff2.
 * Google's legacy stylesheet still serves a single latin woff, which is small
 * enough to sit in memory for the lifetime of the process.
 */
const LEGACY_UA =
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'

const OG_FONT = { family: 'Zen Kaku Gothic New', weight: 400, file: 'og-body.woff' }

async function fetchOgFont(): Promise<void> {
  const target = path.join(ogFonts, OG_FONT.file)
  if (existsSync(target)) return

  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css?family=${encodeURIComponent(OG_FONT.family).replace(/%20/g, '+')}:${OG_FONT.weight}`,
      { headers: { 'User-Agent': LEGACY_UA } },
    )
  ).text()

  const url = /https:\/\/fonts\.gstatic\.com\/[^)]+\.woff/.exec(css)?.[0]
  if (!url) throw new Error('No woff found for the Open Graph font')

  const response = await fetch(url, { headers: { 'User-Agent': LEGACY_UA } })
  if (!response.ok) throw new Error(`Open Graph font responded ${response.status}`)

  await mkdir(ogFonts, { recursive: true })
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
  console.log(`Open Graph font: ${OG_FONT.file}`)
}

/** Ranges worth keeping for a latin-only usage: latin, punctuation, currency. */
const LATIN_INTERVALS: ReadonlyArray<readonly [number, number]> = [
  [0x0020, 0x02ff],
  [0x2000, 0x206f],
  [0x20a0, 0x20bf],
  [0x2122, 0x2122],
]

const BASIC_LATIN: readonly [number, number] = [0x0041, 0x005a]

type Face = {
  weight: number
  range: string
  filename: string
  intervals: ReadonlyArray<readonly [number, number]>
}

function parseUnicodeRange(value: string): Array<readonly [number, number]> {
  return value.split(',').flatMap((entry) => {
    const token = entry.trim().replace(/^u\+/i, '')

    if (token.includes('-')) {
      const [from, to] = token.split('-')
      return from && to ? [[parseInt(from, 16), parseInt(to, 16)] as const] : []
    }

    if (token.includes('?')) {
      const from = parseInt(token.replace(/\?/g, '0'), 16)
      const to = parseInt(token.replace(/\?/g, 'f'), 16)
      return [[from, to] as const]
    }

    const code = parseInt(token, 16)
    return Number.isNaN(code) ? [] : [[code, code] as const]
  })
}

function intersects(
  intervals: ReadonlyArray<readonly [number, number]>,
  target: ReadonlyArray<readonly [number, number]>,
): boolean {
  return intervals.some(([from, to]) => target.some(([start, end]) => from <= end && to >= start))
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })

  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`)
  }

  return response.text()
}

async function collectFaces(spec: FamilySpec): Promise<Face[]> {
  const faces: Face[] = []

  // One request for all weights: a variable family answers with the same slice
  // three times, which is what lets the rules collapse into a weight range.
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    spec.family,
  )}:wght@${spec.weights.join(';')}&display=swap`

  for (const block of (await fetchText(url)).match(/@font-face\s*\{[^}]*\}/g) ?? []) {
    const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1]?.trim()
    const source = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/.exec(block)?.[1]
    const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1])

    if (!range || !source || Number.isNaN(weight)) continue

    const intervals = parseUnicodeRange(range)

    if (spec.keep === 'latin' && !intersects(intervals, LATIN_INTERVALS)) continue

    const filename = path.basename(new URL(source).pathname)

    faces.push({ weight, range, filename, intervals })
    facesToDownload.set(filename, source)
  }

  return faces
}

const facesToDownload = new Map<string, string>()

async function download(slug: string): Promise<number> {
  const dir = path.join(publicFonts, slug)
  await mkdir(dir, { recursive: true })

  let downloaded = 0

  // Sequential on purpose: a few hundred parallel requests get throttled.
  for (const [filename, url] of facesToDownload) {
    const target = path.join(dir, filename)

    if (existsSync(target)) continue

    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })

    if (!response.ok) {
      throw new Error(`Slice ${filename} responded ${response.status}`)
    }

    await writeFile(target, Buffer.from(await response.arrayBuffer()))
    downloaded += 1
  }

  return downloaded
}

function buildCss(spec: FamilySpec, faces: Face[]): string {
  // Variable families return the same slice for every weight; one rule with a
  // weight range then says the same thing in a third of the bytes.
  const byRange = new Map<string, Face[]>()

  for (const face of faces) {
    byRange.set(face.range, [...(byRange.get(face.range) ?? []), face])
  }

  const rules: string[] = []

  for (const [range, group] of byRange) {
    const files = new Set(group.map((face) => face.filename))
    const weights = group.map((face) => face.weight)
    const min = Math.min(...weights)
    const max = Math.max(...weights)

    const emit = (filename: string, weight: string) =>
      rules.push(`@font-face {
  font-family: '${spec.family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(/fonts/${spec.slug}/${filename}) format('woff2');
  unicode-range: ${range};
}`)

    if (files.size === 1) {
      emit([...files][0]!, min === max ? `${min}` : `${min} ${max}`)
    } else {
      for (const face of group) emit(face.filename, `${face.weight}`)
    }
  }

  return `/* Generated by scripts/fetch-fonts.ts — do not edit. */\n${rules.join('\n')}\n`
}

function preloadHrefs(spec: FamilySpec, faces: Face[]): string[] {
  const hrefs = new Set<string>()

  for (const weight of spec.preloadWeights) {
    const face = faces.find(
      (candidate) => candidate.weight === weight && intersects(candidate.intervals, [BASIC_LATIN]),
    )

    if (face) hrefs.add(`/fonts/${spec.slug}/${face.filename}`)
  }

  return [...hrefs]
}

async function main(): Promise<void> {
  const upToDate =
    existsSync(manifestPath) &&
    existsSync(path.join(ogFonts, OG_FONT.file)) &&
    families.every((spec) => existsSync(path.join(publicFonts, `${spec.slug}.css`)))

  if (upToDate && process.env.FORCE_FONT_FETCH !== 'true') {
    return
  }

  await mkdir(publicFonts, { recursive: true })
  await fetchOgFont()

  const manifest: Record<string, { css: string; preload: string[] }> = {}

  for (const spec of families) {
    facesToDownload.clear()

    const faces = await collectFaces(spec)
    const downloaded = await download(spec.slug)

    await writeFile(path.join(publicFonts, `${spec.slug}.css`), buildCss(spec, faces), 'utf8')

    manifest[spec.slug] = {
      css: `/fonts/${spec.slug}.css`,
      preload: preloadHrefs(spec, faces),
    }

    console.log(`${spec.family}: ${faces.length} rules, ${downloaded} slices downloaded`)
  }

  await writeFile(
    manifestPath,
    `/* GENERATED FILE — do not edit. Run: npm run fonts */

export const fontManifest = ${JSON.stringify(manifest, null, 2)} as const
`,
    'utf8',
  )
}

try {
  await main()
} catch (error) {
  // A missing face degrades to the fallback stack; it must not take a deploy
  // down over a transient network error.
  console.warn(`Could not self-host fonts: ${(error as Error).message}`)
}

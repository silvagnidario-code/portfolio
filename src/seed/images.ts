import sharp from 'sharp'

import { grey } from '../tokens/brand'

/**
 * Placeholder imagery, generated rather than downloaded.
 *
 * The seed exists to test layouts, so what matters is that the files are real
 * uploads with real dimensions and real aspect ratios. They are built from the
 * brand palette and deliberately abstract: nobody should mistake them for
 * finished work.
 */

const palettes = [
  [grey.paper200, grey.clay400, grey.clay700],
  [grey.sumi850, grey.clay600, grey.paper300],
  [grey.paper100, grey.clay500, grey.sumi800],
  [grey.clay400, grey.paper50, grey.clay700],
] as const

/** Deterministic pseudo-random, so re-seeding produces the same images. */
function rng(seed: number): () => number {
  let state = seed * 9301 + 49297

  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

function composition(width: number, height: number, seed: number): string {
  const random = rng(seed)
  const palette = palettes[seed % palettes.length]!
  const [background, mid, ink] = palette

  const bands = Array.from({ length: 5 }, (_, index) => {
    const x = Math.round(random() * width * 0.7)
    const w = Math.round(width * (0.08 + random() * 0.22))
    const y = Math.round(random() * height)
    const h = Math.round(height * (0.1 + random() * 0.5))
    const fill = index % 2 === 0 ? mid : ink
    const opacity = 0.25 + random() * 0.5

    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  const disc = `<circle cx="${Math.round(width * (0.2 + random() * 0.6))}" cy="${Math.round(
    height * (0.2 + random() * 0.6),
  )}" r="${Math.round(Math.min(width, height) * (0.12 + random() * 0.18))}" fill="${ink}" opacity="0.35"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${background}"/>
    ${bands}
    ${disc}
  </svg>`
}

export async function generateImage(width: number, height: number, seed: number): Promise<Buffer> {
  return sharp(Buffer.from(composition(width, height, seed)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
}

/** Monochrome wordmark, the shape a real client logo would arrive in. */
export function generateLogo(name: string): Buffer {
  const width = 320
  const height = 80
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <text x="0" y="56" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="500" letter-spacing="2" fill="currentColor">${name}</text>
</svg>`

  return Buffer.from(svg)
}

import { easing } from '@/tokens/brand'

/**
 * The site's single easing, in the one form GSAP understands.
 *
 * The token is a CSS `cubic-bezier(...)`; GSAP wants either a named ease or a
 * CustomEase built from an SVG path. Rather than eyeballing a GSAP equivalent —
 * which would mean the CSS transitions and the scripted animations moved
 * slightly differently — the control points are parsed out of the token and
 * turned into the path. One value, two consumers.
 */

const CUSTOM_EASE_NAME = 'reveal'

function controlPoints(): [number, number, number, number] {
  const numbers = easing
    .replace(/cubic-bezier\(|\)/g, '')
    .split(',')
    .map((value) => Number(value.trim()))

  const [x1, y1, x2, y2] = numbers

  if ([x1, y1, x2, y2].some((value) => typeof value !== 'number' || Number.isNaN(value))) {
    throw new Error(`Cannot read control points from the easing token: ${easing}`)
  }

  return [x1!, y1!, x2!, y2!]
}

type CustomEaseModule = { CustomEase: { create: (name: string, path: string) => unknown } }
type GsapModule = { gsap: { registerPlugin: (...plugins: object[]) => void } }

let registered = false

/** Registers the ease once per document and returns its name. */
export function registerRevealEase(gsapModule: GsapModule, customEase: CustomEaseModule): string {
  if (registered) return CUSTOM_EASE_NAME

  const [x1, y1, x2, y2] = controlPoints()

  gsapModule.gsap.registerPlugin(customEase.CustomEase)
  customEase.CustomEase.create(CUSTOM_EASE_NAME, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`)
  registered = true

  return CUSTOM_EASE_NAME
}

import { fluidViewport } from './brand'

/**
 * Builds a `clamp()` that interpolates linearly between two viewport widths,
 * so every grade of the scale is fluid instead of stepping at breakpoints.
 */
export function fluidClamp(minPx: number, maxPx: number): string {
  const { min: minVw, max: maxVw } = fluidViewport

  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw

  const round = (value: number): number => Math.round(value * 10000) / 10000

  const minRem = round(minPx / 16)
  const maxRem = round(maxPx / 16)
  const interceptRem = round(intercept / 16)
  const slopeVw = round(slope * 100)

  return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`
}

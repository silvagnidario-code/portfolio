/**
 * WCAG 2.1 contrast maths. Pure functions over hex strings, so the styleguide
 * can verify the palette from the same values the CSS is generated from
 * instead of eyeballing screenshots.
 */

export type Rgb = { r: number; g: number; b: number }

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Not a hex colour: ${hex}`)
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function toHexChannel(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0')
}

/**
 * Flattens a semi-transparent colour onto an opaque one — what the eye actually
 * sees through a pane of glass. Contrast can only be judged on this result,
 * never on the fill alone.
 */
export function compositeOver(fill: string, backdrop: string, alpha: number): string {
  const f = hexToRgb(fill)
  const b = hexToRgb(backdrop)
  const blend = (a: number, c: number): number => alpha * a + (1 - alpha) * c

  return `#${toHexChannel(blend(f.r, b.r))}${toHexChannel(blend(f.g, b.g))}${toHexChannel(blend(f.b, b.b))}`
}

/** Relative luminance, WCAG 2.1 definition. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)

  const channel = (value: number): number => {
    const srgb = value / 255
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  }

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Contrast ratio between two opaque colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)

  return (lighter + 0.05) / (darker + 0.05)
}

export type ContrastKind = 'text' | 'large' | 'nonText' | 'decorative'

/** Minimum AA ratio for a given kind of element. `null` means unconstrained. */
export function requiredRatio(kind: ContrastKind): number | null {
  switch (kind) {
    case 'text':
      return 4.5
    case 'large':
    case 'nonText':
      return 3
    case 'decorative':
      return null
  }
}

export function passesAA(ratio: number, kind: ContrastKind): boolean {
  const required = requiredRatio(kind)
  return required === null || ratio >= required
}

/** Rounded down, so a displayed 4.5 is never actually a 4.49. */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 100) / 100).toFixed(2)
}

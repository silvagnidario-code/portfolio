/**
 * LEVEL 1 — PRIMITIVES
 *
 * The only file to touch when the brand identity changes. Nothing in the app
 * reads from here directly: primitives are consumed by `semantic.ts`, which is
 * what components (through CSS custom properties) actually see.
 *
 * PLACEHOLDER VALUES: the greys and the accent below are a stand-in set,
 * warm-toned and saturated as the specification requires, to be replaced once
 * the real brand values exist. Replacing them requires no change anywhere else.
 */

/**
 * Warm greys. No pure white, no pure black: unbleached paper against ink.
 * Every step keeps the same warm hue — a cool grey inside this palette reads
 * as a printing error.
 */
export const grey = {
  paper50: '#FDFCF9',
  paper100: '#F7F5F0',
  paper200: '#EFEBE2',
  paper300: '#E3DED2',
  clay400: '#C7BFAF',
  clay500: '#8C826C',
  clay600: '#6F6757',
  clay700: '#4E4838',
  sumi800: '#332F29',
  sumi850: '#232220',
  sumi900: '#1A1A18',
  sumi950: '#131211',
  ink100: '#EDEAE3',
  ink200: '#CFC9BC',
  ink300: '#A79E8C',
} as const

/**
 * Brand accent. Two variants are mandatory: the original one reads on paper,
 * a lighter and more saturated one is needed to survive on ink.
 * Both are contrast-checked on the styleguide, not assumed.
 */
export const accent = {
  onLight: '#A83A15',
  onDark: '#FF8452',
  /** Foreground used on top of a filled accent surface. */
  fgOnLight: '#FDFCF9',
  fgOnDark: '#1A1A18',
} as const

/** Base unit of the spacing scale, in pixels. */
export const baseUnit = 4

/**
 * Spacing scale: base 4 with geometric jumps, extended upwards because empty
 * space is content. Keys are the pixel values, so an off-scale value simply
 * does not exist as a utility.
 */
export const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 320] as const

export type SpacingStep = (typeof spacing)[number]

/** Viewport range the fluid typographic scale interpolates between. */
export const fluidViewport = { min: 360, max: 1440 } as const

export type TypeGrade = {
  /** Font size in px at the smallest viewport. */
  min: number
  /** Font size in px at the largest viewport. */
  max: number
  lineHeight: number
  /** Letter spacing in em. Never negative: tracking is neutral or positive. */
  tracking: number
  weight: 300 | 400 | 500
  uppercase?: boolean
}

/**
 * Seven grades. Hierarchy is built with scale and space, never with weight —
 * only 300, 400 and 500 exist.
 */
export const typeScale = {
  display: { min: 44, max: 124, lineHeight: 1.15, tracking: 0, weight: 300 },
  h1: { min: 34, max: 72, lineHeight: 1.15, tracking: 0, weight: 300 },
  h2: { min: 27, max: 48, lineHeight: 1.2, tracking: 0, weight: 400 },
  h3: { min: 22, max: 32, lineHeight: 1.25, tracking: 0, weight: 400 },
  bodyLg: { min: 18, max: 22, lineHeight: 1.8, tracking: 0.01, weight: 400 },
  body: { min: 16, max: 18, lineHeight: 1.8, tracking: 0, weight: 400 },
  caption: { min: 12, max: 13, lineHeight: 1.4, tracking: 0.12, weight: 500, uppercase: true },
} as const satisfies Record<string, TypeGrade>

export type TypeGradeName = keyof typeof typeScale

/**
 * CJK compensation. Han glyphs read smaller than latin ones at the same
 * font-size, and need more leading to stay legible.
 */
export const cjk = {
  /** Optical size compensation, within the 5–8% required by the spec. */
  sizeFactor: 1.06,
  bodyLineHeight: 2,
} as const

/** Durations in ms. Slow, decelerated, quiet. */
export const duration = { fast: 200, base: 400, slow: 800, slowest: 1600 } as const

/** One easing for every reveal. No bounce, no overshoot, no spring. */
export const easing = 'cubic-bezier(0.32, 0.72, 0, 1)'

/** Delay between elements revealed in sequence, in ms. */
export const stagger = { min: 80, base: 100, max: 120 } as const

/** Translation distance for reveal animations. Never scale, never rotation. */
export const revealDistance = { min: 16, max: 24 } as const

/**
 * Radii. Content and media containers are square: content is paper.
 * Wide continuous corners exist only on the glass interface layer (§7).
 */
export const radius = { none: 0, glassSm: 20, glassMd: 24, glassLg: 28 } as const

/** 12 columns on desktop, 6 on tablet, 4 on mobile, with a fixed gutter. */
export const grid = {
  columns: { mobile: 4, tablet: 6, desktop: 12 },
  gutter: 24,
  /** Page margins are fluid and generous. */
  margin: { min: 24, max: 128 },
} as const

/**
 * Glass. Applies to the floating interface layer only — never to content.
 * The fill opacities live in `glass.ts`, because they are not free values:
 * they are derived from the contrast the text above them has to keep.
 *
 * §7 describes a fourth layer, an SVG displacement filter, applied to the
 * cursor alone. The custom cursor was removed, and with it that layer's only
 * justified consumer: on a navbar or a pill the filter costs a full-surface
 * repaint for an effect nobody sees.
 */
export const glass = {
  /**
   * A heavier blur and a stronger saturation than §7's starting point: asked
   * for explicitly, and the room was there. What could not move is the fill
   * opacity — see `glass.ts`, where the floor is computed rather than chosen.
   */
  blur: 36,
  saturate: 2.1,
  borderWidth: 1,
  /** Tint of the fill, per theme. */
  fill: { light: grey.paper50, dark: grey.sumi950 },
  /**
   * Alpha of the specular edge, per theme: brighter on top, darker underneath,
   * to read as refraction on the corner rather than as a drawn outline.
   */
  edge: {
    light: { highlight: 0.85, shade: 0.26, border: 0.18 },
    dark: { highlight: 0.45, shade: 0.6, border: 0.22 },
  },
  /**
   * The pane casts a shadow: without it a translucent surface reads as a hole
   * in the page rather than as something floating above it.
   */
  lift: {
    light: { blur: 48, spread: -12, y: 16, alpha: 0.12 },
    dark: { blur: 48, spread: -12, y: 16, alpha: 0.4 },
  },
  /**
   * `backdrop-filter` is one of the most expensive properties in CSS and here
   * it already shares the frame with smooth scroll and a WebGL canvas.
   */
  maxSimultaneous: 4,
} as const

/**
 * Vertical breathing room between sections, the `spacing` property every block
 * exposes. Fluid: the specification asks for at least 128px on desktop, which
 * would swallow a phone screen whole.
 */
export const sectionSpacing = {
  compact: { min: 48, max: 96 },
  normal: { min: 64, max: 128 },
  wide: { min: 96, max: 192 },
} as const

export type SectionSpacing = keyof typeof sectionSpacing

/** Comfortable reading measure for running text. */
export const measure = '62ch'

/** Breakpoints in px. */
export const breakpoint = { tablet: 768, desktop: 1180 } as const

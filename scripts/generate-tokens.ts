/**
 * Turns `src/tokens/*.ts` into the CSS the browser actually reads.
 *
 * Two files are written:
 *   - `tokens.generated.css` — level 1 and 2: raw values and semantic roles,
 *     per theme, as CSS custom properties.
 *   - `theme.generated.css`  — the Tailwind `@theme` mapping, so utilities and
 *     tokens can never drift apart.
 *
 * Run with `npm run tokens`. Both files are committed and regenerated
 * automatically before `dev` and `build`.
 */

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  accent,
  baseUnit,
  breakpoint,
  cjk,
  duration,
  easing,
  glass,
  grey,
  grid,
  measure,
  radius,
  revealDistance,
  spacing,
  stagger,
  typeScale,
} from '../src/tokens/brand'
import { compositeOver } from '../src/tokens/contrast'
import { fluidClamp } from '../src/tokens/fluid'
import { assertFillOpacities, fillOpacity, glassEdges, withAlpha } from '../src/tokens/glass'
import { colorAliases, colorRoles, semanticColors, type ThemeName } from '../src/tokens/semantic'

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/styles')

const BANNER = `/*\n * GENERATED FILE — do not edit.\n * Source: src/tokens/*.ts · Regenerate with: npm run tokens\n */\n`

/** camelCase grade names become kebab-case CSS names. */
const kebab = (value: string): string => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

function colorBlock(theme: ThemeName, indent: string): string {
  const roles = colorRoles.map((role) => `${indent}--${role}: ${semanticColors[theme][role]};`)

  // The glass layer is theme-dependent too, and its fill opacity is the value
  // `assertFillOpacities` refuses to let drop below what AA needs.
  const glassVars = [
    `${indent}--glass-fill: ${withAlpha(glass.fill[theme], fillOpacity[theme])};`,
    `${indent}--glass-fill-opaque: ${compositeOver(
      glass.fill[theme],
      semanticColors[theme]['bg-primary'],
      fillOpacity[theme],
    )};`,
    `${indent}--glass-highlight: ${glassEdges[theme].highlight};`,
    `${indent}--glass-shade: ${glassEdges[theme].shade};`,
    `${indent}--glass-border: ${glassEdges[theme].border};`,
  ]

  return [...roles, ...glassVars].join('\n')
}

function buildTokensCss(): string {
  const primitives = [
    ...Object.entries(grey).map(([name, value]) => `  --grey-${kebab(name)}: ${value};`),
    `  --accent-on-light: ${accent.onLight};`,
    `  --accent-on-dark: ${accent.onDark};`,
  ].join('\n')

  const spacingVars = spacing.map((step) => `  --space-${step}: ${step}px;`).join('\n')

  const typeVars = Object.entries(typeScale)
    .map(([name, grade]) => {
      const key = kebab(name)
      return [
        `  --fs-${key}: ${fluidClamp(grade.min, grade.max)};`,
        `  --lh-${key}: ${grade.lineHeight};`,
        `  --ls-${key}: ${grade.tracking}em;`,
        `  --fw-${key}: ${grade.weight};`,
      ].join('\n')
    })
    .join('\n')

  const motionVars = [
    ...Object.entries(duration).map(([name, value]) => `  --duration-${kebab(name)}: ${value}ms;`),
    `  --easing-reveal: ${easing};`,
    ...Object.entries(stagger).map(([name, value]) => `  --stagger-${kebab(name)}: ${value}ms;`),
    `  --reveal-distance-min: ${revealDistance.min}px;`,
    `  --reveal-distance-max: ${revealDistance.max}px;`,
  ].join('\n')

  // Named `--corner-*` so the Tailwind `--radius-*` namespace can point at them
  // without a variable referencing itself.
  const radiusVars = Object.entries(radius)
    .map(([name, value]) => `  --corner-${kebab(name)}: ${value}px;`)
    .join('\n')

  const glassVars = [
    `  --glass-blur: ${glass.blur}px;`,
    `  --glass-saturate: ${glass.saturate};`,
    `  --glass-border-width: ${glass.borderWidth}px;`,
  ].join('\n')

  const gridVars = [
    `  --grid-columns: ${grid.columns.mobile};`,
    `  --grid-gutter: ${grid.gutter}px;`,
    `  --page-margin: ${fluidClamp(grid.margin.min, grid.margin.max)};`,
  ].join('\n')

  return `${BANNER}
:root {
  color-scheme: light;

  /* Level 1 — primitives */
  --base-unit: ${baseUnit}px;
${primitives}

  /* Level 2 — semantic roles (light) */
${colorBlock('light', '  ')}

  /* Spacing */
${spacingVars}

  /* Typography */
${typeVars}
  /* Optical compensation, overridden for CJK below */
  --type-scale-factor: 1;
  --leading-body-override: var(--lh-body);

  /* Motion */
${motionVars}

  /* Radii */
${radiusVars}
  --corner-round: 9999px;

  /* Glass — theme-dependent values live in the colour blocks */
${glassVars}

  /* Grid */
${gridVars}
}

/* System preference, unless the reader explicitly asked for light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${colorBlock('dark', '    ')}
  }
}

/* Explicit choice always wins, in both directions */
:root[data-theme='dark'] {
  color-scheme: dark;
${colorBlock('dark', '  ')}
}

:root[data-theme='light'] {
  color-scheme: light;
${colorBlock('light', '  ')}
}

/* Han glyphs read smaller at the same font-size and need more leading.
   Applies to any subtree marked lang="zh", not just the zh locale. */
:lang(zh) {
  --type-scale-factor: ${cjk.sizeFactor};
  --leading-body-override: ${cjk.bodyLineHeight};
}

@media (min-width: ${breakpoint.tablet}px) {
  :root {
    --grid-columns: ${grid.columns.tablet};
  }
}

@media (min-width: ${breakpoint.desktop}px) {
  :root {
    --grid-columns: ${grid.columns.desktop};
  }
}
`
}

function buildThemeCss(): string {
  const colors = Object.entries(colorAliases)
    .map(([alias, role]) => `  --color-${alias}: var(--${role});`)
    .join('\n')

  const spacings = [
    // Zero is not a step of the scale, but the utilities that clamp an element
    // to an edge (`inset-0`, `top-0`) resolve through the spacing namespace,
    // and the default multiplier was deliberately removed above.
    '  --spacing-0: 0px;',
    ...spacing.map((step) => `  --spacing-${step}: var(--space-${step});`),
  ].join('\n')

  const texts = Object.entries(typeScale)
    .map(([name, grade]) => {
      const key = kebab(name)
      const leading = name === 'body' ? 'var(--leading-body-override)' : `var(--lh-${key})`
      return [
        `  --text-${key}: calc(var(--fs-${key}) * var(--type-scale-factor));`,
        `  --text-${key}--line-height: ${leading};`,
        `  --text-${key}--letter-spacing: var(--ls-${key});`,
        `  --text-${key}--font-weight: ${grade.weight};`,
      ].join('\n')
    })
    .join('\n')

  const radii = Object.keys(radius)
    .map((name) => `  --radius-${kebab(name)}: var(--corner-${kebab(name)});`)
    .join('\n')

  const breakpoints = Object.entries(breakpoint)
    .map(([name, value]) => `  --breakpoint-${name}: ${value}px;`)
    .join('\n')

  return `${BANNER}
@theme {
  /* Nothing from the default palette survives: every visual value in a
     component must come from a token. */
  --color-*: initial;
  --text-*: initial;
  --font-*: initial;
  --font-weight-*: initial;
  --radius-*: initial;
  --ease-*: initial;
  --breakpoint-*: initial;
  --spacing: initial;
  --spacing-*: initial;

${breakpoints}
}

@theme inline {
  /* Colours — resolved at runtime so the theme can switch without a rebuild */
${colors}

  /* Typefaces. Zen Kaku and Noto Sans SC are self-hosted (scripts/fetch-fonts.ts),
     Geist Mono comes from next/font. */
  --font-body: 'Zen Kaku Gothic New', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Zen Kaku Gothic New', ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --font-cjk: 'Noto Sans SC', 'Zen Kaku Gothic New', ui-sans-serif, sans-serif;

  /* Only the three weights this direction allows */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;

  /* Spacing */
${spacings}

  /* Typographic scale */
${texts}

  /* Radii */
${radii}

  /* Reading measure */
  --container-measure: ${measure};

  /* Motion — one easing for every reveal */
  --ease-reveal: var(--easing-reveal);
}
`
}

async function main(): Promise<void> {
  // Refuses to emit a glass fill transparent enough to break AA.
  assertFillOpacities()

  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'tokens.generated.css'), buildTokensCss(), 'utf8')
  await writeFile(path.join(outDir, 'theme.generated.css'), buildThemeCss(), 'utf8')
  console.log(`Tokens written to ${outDir}`)
}

await main()

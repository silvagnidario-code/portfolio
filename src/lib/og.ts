import { readFile } from 'fs/promises'
import path from 'path'

import { grey } from '@/tokens/brand'
import { semanticColors } from '@/tokens/semantic'

/**
 * Shared pieces of the generated Open Graph images, §9.
 *
 * Satori needs a complete font file: it cannot use the unicode-range slices the
 * site serves, and it does not read woff2. The latin face is fetched at build
 * time (`scripts/fetch-fonts.ts`) and kept in memory for the life of the
 * process — 13 KB, paid once.
 *
 * A full simplified-chinese face is a different order of cost: ten megabytes
 * resident per instance, to draw a picture nobody reads at full size. So the
 * chinese card leads with the client's name, which is latin, instead of
 * rendering a row of tofu. It is a deliberate substitution, not a bug.
 */

const OG_FONT_PATH = path.join(process.cwd(), 'public', 'fonts', 'og', 'og-body.woff')

let cachedFont: Buffer | null = null

export async function ogFont(): Promise<Buffer> {
  cachedFont ??= await readFile(OG_FONT_PATH)
  return cachedFont
}

/** True when the string needs a CJK face the Open Graph renderer does not carry. */
export function needsCjkFont(value: string): boolean {
  return /[　-〿㐀-䶿一-鿿豈-﫿]/.test(value)
}

export const ogSize = { width: 1200, height: 630 }

/** The card paints the light theme, whatever the reader's preference is. */
export const ogPalette = {
  background: semanticColors.light['bg-primary'],
  ink: semanticColors.light['fg-primary'],
  muted: semanticColors.light['fg-muted'],
  accent: semanticColors.light.accent,
  rule: grey.paper300,
}

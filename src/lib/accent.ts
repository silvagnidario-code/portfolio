import { contrastRatio, requiredRatio } from '@/tokens/contrast'
import { semanticColors } from '@/tokens/semantic'

/**
 * A case study can tint its page with a colour pulled out of the project. The
 * colour is editorial, so it arrives unverified — and an accent that fails
 * contrast is not a styling problem, it is unreadable link text.
 *
 * Each theme is judged on its own: a deep green reads on paper and disappears
 * on ink. Where it fails, the brand accent stays.
 */

const TEXT_RATIO = requiredRatio('text') ?? 4.5

export type ResolvedAccent = { light: string; dark: string; usable: boolean }

export function resolveProjectAccent(hex?: string | null): ResolvedAccent {
  const fallback = { light: 'var(--accent-on-light)', dark: 'var(--accent-on-dark)', usable: false }

  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback

  const holds = (theme: 'light' | 'dark'): boolean =>
    contrastRatio(hex, semanticColors[theme]['bg-primary']) >= TEXT_RATIO

  const light = holds('light') ? hex : fallback.light
  const dark = holds('dark') ? hex : fallback.dark

  return { light, dark, usable: light === hex || dark === hex }
}

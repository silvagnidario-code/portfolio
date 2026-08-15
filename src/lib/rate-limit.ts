/**
 * Sliding-window rate limit, in memory.
 *
 * Deliberately not in the database: §11 says the brief form persists nothing,
 * and a spam counter is not worth a table. The trade-off is that the window is
 * per process — behind several instances the effective limit multiplies. That
 * is acceptable for a contact form whose real defence is the honeypot plus a
 * human reading the inbox; a shared store belongs to whoever scales this out.
 */

type Window = { hits: number[] }

const windows = new Map<string, Window>()

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number }

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  const existing = windows.get(key) ?? { hits: [] }
  const hits = existing.hits.filter((time) => now - time < windowMs)

  if (hits.length >= limit) {
    const oldest = hits[0] ?? now
    windows.set(key, { hits })

    return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000) }
  }

  hits.push(now)
  windows.set(key, { hits })

  // Keeps the map from growing without bound on a long-lived process.
  if (windows.size > 5000) {
    for (const [entry, value] of windows) {
      if (value.hits.every((time) => now - time >= windowMs)) windows.delete(entry)
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

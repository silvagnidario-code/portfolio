/**
 * A project's year, optionally spanning several — "2020" on its own, or
 * "2020–2024" when `yearEnd` is set and actually differs. An en dash, not a
 * hyphen: the same mark the rest of the site's running text uses for a range.
 */
export function formatYearRange(year: number, yearEnd?: number | null): string {
  if (!yearEnd || yearEnd === year) return String(year)
  return `${year}–${yearEnd}`
}

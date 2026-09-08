import { DEFAULT_RESOLVED_THEME, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme'

/**
 * Applies the stored theme before the first paint. Without this the page
 * renders in the default theme and then swaps, which on a paper-and-ink
 * palette is a full-screen flash.
 *
 * A first-time visitor (nothing in storage yet) always gets
 * `DEFAULT_RESOLVED_THEME`, not whatever their OS prefers.
 *
 * Must stay in <head>, above everything else.
 */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var attr=${JSON.stringify(THEME_ATTRIBUTE)};var m=localStorage.getItem(k);var resolved=(m==="light"||m==="dark")?m:${JSON.stringify(DEFAULT_RESOLVED_THEME)};document.documentElement.setAttribute(attr,resolved)}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

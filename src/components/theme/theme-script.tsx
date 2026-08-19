import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme'

/**
 * Applies the stored theme before the first paint. Without this the page
 * renders in the system theme and then swaps, which on a paper-and-ink palette
 * is a full-screen flash.
 *
 * Must stay in <head>, above everything else.
 */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var attr=${JSON.stringify(THEME_ATTRIBUTE)};var m=localStorage.getItem(k);var resolved=(m==="light"||m==="dark")?m:((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");document.documentElement.setAttribute(attr,resolved)}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme'

/**
 * Applies the stored theme before the first paint. Without this the page
 * renders in the system theme and then swaps, which on a paper-and-ink palette
 * is a full-screen flash.
 *
 * Must stay in <head>, above everything else.
 */
export function ThemeScript() {
  const script = `(function(){try{var m=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(m==="light"||m==="dark"){document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},m)}}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

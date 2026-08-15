import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'

import { NavBar, type NavItem } from './nav-bar'

/**
 * Reads the menu from the CMS and hands it to the navbar. Nothing here is
 * hardcoded: labels come from `navigation`, the wordmark from `seo-defaults`.
 */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const [navigation, seo] = await Promise.all([
    getGlobal('navigation', locale),
    getGlobal('seo-defaults', locale),
  ])

  const items: NavItem[] = (navigation.items ?? []).flatMap<NavItem>((item) => {
    // An untranslated entry would render as an empty link; better absent.
    if (!item.label) return []

    if (item.type === 'external' && item.url) {
      return [{ label: item.label, href: item.url, external: true }]
    }

    if (item.type === 'page' && item.page && typeof item.page === 'object') {
      const slug = item.page.slug
      return [{ label: item.label, href: slug === 'home' ? '/' : `/${slug}`, external: false }]
    }

    if (item.type === 'internal' && item.path) {
      return [{ label: item.label, href: item.path, external: false }]
    }

    return []
  })

  return <NavBar locale={locale} wordmark={seo.siteName} items={items} />
}

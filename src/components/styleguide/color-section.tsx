import { getTranslations } from 'next-intl/server'

import { accent, grey } from '@/tokens/brand'
import { colorRoles, semanticColors } from '@/tokens/semantic'

import { Mono, Section, SubHeading } from './section'

const primitives: ReadonlyArray<[string, string]> = [
  ...Object.entries(grey),
  ['accentOnLight', accent.onLight],
  ['accentOnDark', accent.onDark],
  ['accentFgOnLight', accent.fgOnLight],
  ['accentFgOnDark', accent.fgOnDark],
]

export async function ColorSection() {
  const t = await getTranslations('Styleguide.colors')

  return (
    <Section id="colour" title={t('title')} description={t('description')}>
      <SubHeading>{t('primitives')}</SubHeading>
      <ul className="mb-64 grid grid-cols-2 gap-24 tablet:grid-cols-4 desktop:grid-cols-5">
        {primitives.map(([name, value]) => (
          <li key={name}>
            <div
              className="h-64 w-full border border-line"
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <p className="mt-8 text-body">{name}</p>
            <Mono>{value}</Mono>
          </li>
        ))}
      </ul>

      <SubHeading>{t('semantic')}</SubHeading>
      <p className="mb-24 max-w-measure text-body text-ink-muted">{t('currentTheme')}</p>
      <ul className="grid grid-cols-2 gap-24 tablet:grid-cols-3 desktop:grid-cols-4">
        {colorRoles.map((role) => (
          <li key={role}>
            <div
              className="h-64 w-full border border-line"
              style={{ backgroundColor: `var(--${role})` }}
              aria-hidden="true"
            />
            <p className="mt-8 text-body">--{role}</p>
            <Mono>
              {semanticColors.light[role]} · {semanticColors.dark[role]}
            </Mono>
          </li>
        ))}
      </ul>
    </Section>
  )
}

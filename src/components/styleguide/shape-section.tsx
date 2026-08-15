import { getTranslations } from 'next-intl/server'

import { grid, radius } from '@/tokens/brand'

import { Mono, Section, SubHeading } from './section'

type RadiusName = keyof typeof radius

/** Static class names so Tailwind can see the utilities. */
const radiusClass: Record<RadiusName, string> = {
  none: 'rounded-none',
  glassSm: 'rounded-glass-sm',
  glassMd: 'rounded-glass-md',
  glassLg: 'rounded-glass-lg',
}

const radiusNames = Object.keys(radiusClass) as RadiusName[]

const gridCells = Array.from({ length: grid.columns.desktop }, (_, index) => index)

export async function ShapeSection() {
  const t = await getTranslations('Styleguide.shape')

  return (
    <Section id="shape" title={t('title')} description={t('description')}>
      <SubHeading>{t('radius')}</SubHeading>
      <ul className="mb-64 grid grid-cols-2 gap-24 tablet:grid-cols-4">
        {radiusNames.map((name) => (
          <li key={name}>
            <div
              className={`h-96 w-full border border-line-strong bg-surface-2 ${radiusClass[name]}`}
              aria-hidden="true"
            />
            <p className="mt-8 text-body">{name}</p>
            <Mono>{radius[name]}px</Mono>
          </li>
        ))}
      </ul>

      <SubHeading>{t('grid')}</SubHeading>
      <div
        className="mb-16 grid"
        style={{
          gridTemplateColumns: 'repeat(var(--grid-columns), minmax(0, 1fr))',
          gap: 'var(--grid-gutter)',
        }}
        aria-hidden="true"
      >
        {gridCells.map((cell) => (
          <div key={cell} className="h-64 bg-surface-2" />
        ))}
      </div>
      <p className="max-w-measure text-body text-ink-muted">{t('gridNote')}</p>
      <ul className="mt-24 flex flex-wrap gap-32">
        <li>
          <Mono>
            {t('columns')}: {grid.columns.mobile} / {grid.columns.tablet} / {grid.columns.desktop}
          </Mono>
        </li>
        <li>
          <Mono>
            {t('gutter')}: {grid.gutter}px
          </Mono>
        </li>
        <li>
          <Mono>
            {t('margin')}: {grid.margin.min}–{grid.margin.max}px
          </Mono>
        </li>
      </ul>
    </Section>
  )
}

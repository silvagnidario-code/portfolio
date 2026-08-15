import { getTranslations } from 'next-intl/server'

import { spacing } from '@/tokens/brand'

import { Mono, Section } from './section'

export async function SpacingSection() {
  const t = await getTranslations('Styleguide.spacing')

  return (
    <Section id="spacing" title={t('title')} description={t('description')}>
      <ul className="flex flex-col gap-16">
        {spacing.map((step) => (
          <li key={step} className="flex items-center gap-24">
            <Mono>{`--space-${step}`}</Mono>
            <span
              className="h-16 bg-accent"
              style={{ width: `var(--space-${step})` }}
              aria-hidden="true"
            />
            <Mono>{step}px</Mono>
          </li>
        ))}
      </ul>
    </Section>
  )
}

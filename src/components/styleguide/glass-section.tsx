import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { GlassBudgetProvider } from '@/components/glass/glass-budget'
import { GlassSurface } from '@/components/glass/glass-surface'
import { glass } from '@/tokens/brand'
import { formatRatio } from '@/tokens/contrast'
import {
  auditGlass,
  fillOpacity,
  glassVariants,
  requiredFillOpacity,
  SPEC_MIN_FILL_OPACITY,
  WORST_CASE_BACKDROPS,
} from '@/tokens/glass'

import { Mono, Section, SubHeading, Table, Td, Th } from './section'

const [WHITE, BLACK] = WORST_CASE_BACKDROPS

/**
 * Three test backdrops, as the specification asks: a bright image, a dark one,
 * dense text. The two "images" are built from the palette plus the two extreme
 * values the contrast proof uses, so the surface really does pass over pure
 * white and pure black at some point along its width — the hardest case there
 * is, not a comfortable photograph.
 */
const backdrops = {
  light: {
    backgroundImage: `radial-gradient(60% 120% at 20% 20%, ${WHITE} 0%, var(--grey-paper200) 45%, var(--grey-clay400) 100%),
      repeating-linear-gradient(115deg, ${WHITE} 0 6px, var(--grey-clay400) 6px 12px)`,
    backgroundBlendMode: 'multiply',
  },
  dark: {
    backgroundImage: `radial-gradient(60% 120% at 80% 10%, var(--grey-clay600) 0%, var(--grey-sumi850) 40%, ${BLACK} 100%),
      repeating-linear-gradient(115deg, ${BLACK} 0 6px, var(--grey-clay700) 6px 12px)`,
    backgroundBlendMode: 'screen',
  },
} as const

type BackdropKey = 'light' | 'dark' | 'text'

export async function GlassSection() {
  const t = await getTranslations('Styleguide.glass')
  const tSpecimen = await getTranslations('Specimen')

  const audit = auditGlass()
  const everythingPasses = audit.every((row) => row.passes)

  const surfaces = (
    <div className="flex flex-wrap items-center gap-24">
      {glassVariants.map((variant) => (
        <GlassSurface key={variant} variant={variant} className="px-24 py-16 text-body">
          <span>
            <span className="font-mono text-caption uppercase">{t(`variants.${variant}`)}</span>
            <span className="block">{t('sample')}</span>
          </span>
        </GlassSurface>
      ))}
    </div>
  )

  const panels: Array<{ key: BackdropKey; body: ReactNode }> = [
    {
      key: 'light',
      body: (
        <div className="p-48" style={backdrops.light}>
          {surfaces}
        </div>
      ),
    },
    {
      key: 'dark',
      body: (
        <div className="p-48" style={backdrops.dark}>
          {surfaces}
        </div>
      ),
    },
    {
      key: 'text',
      body: (
        <div className="relative overflow-hidden bg-surface p-48">
          <p aria-hidden="true" className="absolute inset-0 p-16 text-body text-ink">
            {Array.from({ length: 12 }, () => tSpecimen('paragraph')).join(' ')}
          </p>
          <div className="relative">{surfaces}</div>
        </div>
      ),
    },
  ]

  return (
    <Section id="glass" title={t('title')} description={t('description')}>
      {/* The site runs on the four-surface budget; only this page raises it,
          to show every variant over every backdrop at once. */}
      <GlassBudgetProvider limit={glassVariants.length * panels.length} label="styleguide">
        <div className="mb-64 flex flex-col gap-32">
          {panels.map((panel) => (
            <div key={panel.key}>
              <SubHeading>{t(`backdrops.${panel.key}`)}</SubHeading>
              <div className="border border-line">{panel.body}</div>
            </div>
          ))}
        </div>
      </GlassBudgetProvider>

      <SubHeading>{t('proof.title')}</SubHeading>
      <p className="mb-24 max-w-measure text-body text-ink-2">{t('proof.description')}</p>
      <p
        className={`mb-32 max-w-measure text-body-lg ${everythingPasses ? 'text-ink' : 'text-accent'}`}
      >
        {everythingPasses ? t('proof.allPass') : t('proof.someFail')}
      </p>

      <Table
        head={
          <>
            <Th>{t('proof.theme')}</Th>
            <Th>{t('proof.backdrop')}</Th>
            <Th>{t('proof.fill')}</Th>
            <Th>{t('proof.composite')}</Th>
            <Th>{t('proof.ratio')}</Th>
            <Th>{t('proof.result')}</Th>
          </>
        }
      >
        {audit.map((row) => (
          <tr key={`${row.theme}-${row.backdrop}`}>
            <Td>
              <Mono>{row.theme}</Mono>
            </Td>
            <Td>
              <span className="flex items-center gap-12">
                <span
                  className="inline-block h-24 w-24 border border-line"
                  style={{ backgroundColor: row.backdrop }}
                  aria-hidden="true"
                />
                <Mono>{row.backdrop}</Mono>
              </span>
            </Td>
            <Td>
              <Mono>
                {glass.fill[row.theme]} · {fillOpacity[row.theme]}
              </Mono>
            </Td>
            <Td>
              <Mono>{row.composite}</Mono>
            </Td>
            <Td>
              <Mono>{formatRatio(row.ratio)}</Mono>
            </Td>
            <Td>
              <span className={row.passes ? 'text-ink' : 'text-accent'}>
                {row.passes ? t('proof.pass') : t('proof.fail')}
              </span>
            </Td>
          </tr>
        ))}
      </Table>

      <ul className="mt-48 flex flex-col gap-16">
        <li className="max-w-measure text-body text-ink-muted">
          {t('floors', {
            light: requiredFillOpacity('light'),
            dark: requiredFillOpacity('dark'),
            spec: SPEC_MIN_FILL_OPACITY,
          })}
        </li>
        <li className="max-w-measure text-body text-ink-muted">
          {t('budget', { limit: glass.maxSimultaneous })}
        </li>
        <li className="max-w-measure text-body text-ink-muted">{t('fallback')}</li>
        <li className="max-w-measure text-body text-ink-muted">{t('noBlurAnimation')}</li>
      </ul>
    </Section>
  )
}

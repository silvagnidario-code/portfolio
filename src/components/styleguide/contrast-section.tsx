import { getTranslations } from 'next-intl/server'

import { contrastRatio, formatRatio, passesAA, requiredRatio } from '@/tokens/contrast'
import { contrastPairs, semanticColors, type ThemeName } from '@/tokens/semantic'

import { Mono, Section, SubHeading, Table, Td, Th } from './section'

const themes: readonly ThemeName[] = ['light', 'dark']

type Row = {
  key: string
  foreground: string
  background: string
  fgHex: string
  bgHex: string
  ratio: number
  required: number | null
  passes: boolean
}

function rowsFor(theme: ThemeName): Row[] {
  return contrastPairs.map((pair) => {
    const fgHex = semanticColors[theme][pair.foreground]
    const bgHex = semanticColors[theme][pair.background]
    const ratio = contrastRatio(fgHex, bgHex)

    return {
      key: `${pair.foreground}-on-${pair.background}`,
      foreground: pair.foreground,
      background: pair.background,
      fgHex,
      bgHex,
      ratio,
      required: requiredRatio(pair.kind),
      passes: passesAA(ratio, pair.kind),
    }
  })
}

export async function ContrastSection() {
  const t = await getTranslations('Styleguide.contrast')
  const tTheme = await getTranslations('Theme')

  const tables = themes.map((theme) => ({ theme, rows: rowsFor(theme) }))
  const everythingPasses = tables.every(({ rows }) => rows.every((row) => row.passes))

  return (
    <Section id="contrast" title={t('title')} description={t('description')}>
      <p
        className={`mb-48 max-w-measure text-body-lg ${everythingPasses ? 'text-ink' : 'text-accent'}`}
      >
        {everythingPasses ? t('allPass') : t('someFail')}
      </p>

      {tables.map(({ theme, rows }) => (
        <div key={theme} className="mb-64">
          <SubHeading>{tTheme(theme)}</SubHeading>
          <Table
            head={
              <>
                <Th>{t('pair')}</Th>
                <Th>{t('ratio')}</Th>
                <Th>{t('required')}</Th>
                <Th>{t('result')}</Th>
              </>
            }
          >
            {rows.map((row) => (
              <tr key={row.key}>
                <Td>
                  <span className="flex items-center gap-12">
                    <span
                      className="flex h-32 w-64 items-center justify-center border border-line text-caption"
                      style={{ backgroundColor: row.bgHex, color: row.fgHex }}
                    >
                      Aa
                    </span>
                    <Mono>
                      {row.foreground} / {row.background}
                    </Mono>
                  </span>
                </Td>
                <Td>
                  <Mono>{formatRatio(row.ratio)}</Mono>
                </Td>
                <Td>
                  <Mono>{row.required === null ? '—' : row.required.toFixed(1)}</Mono>
                </Td>
                <Td>
                  {row.required === null ? (
                    <span className="text-ink-muted">{t('notRequired')}</span>
                  ) : (
                    <span className={row.passes ? 'text-ink' : 'text-accent'}>
                      {row.passes ? t('pass') : t('fail')}
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </div>
      ))}
    </Section>
  )
}

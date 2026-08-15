import { getTranslations } from 'next-intl/server'

import { CjkStylesheet } from '@/components/typography/cjk-stylesheet'
import enMessages from '@/messages/en.json'
import itMessages from '@/messages/it.json'
import zhMessages from '@/messages/zh.json'
import { typeScale, type TypeGradeName } from '@/tokens/brand'
import { fluidClamp } from '@/tokens/fluid'

import { Mono, Section, SubHeading, Table, Td, Th } from './section'

/**
 * Static class names, one per grade: Tailwind only generates a utility it can
 * see in the source, so these cannot be built by string concatenation.
 */
const gradeClass: Record<TypeGradeName, string> = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  bodyLg: 'text-body-lg',
  body: 'text-body',
  caption: 'text-caption uppercase',
}

/**
 * The three languages are shown side by side on every grade: chinese strings
 * run 30–50% shorter than italian ones and turn two-line headings into one,
 * which breaks the vertical rhythm this direction is built on.
 */
const specimens = [
  { locale: 'it', ...itMessages.Specimen },
  { locale: 'en', ...enMessages.Specimen },
  { locale: 'zh', ...zhMessages.Specimen },
] as const

export async function TypographySection() {
  const t = await getTranslations('Styleguide.typography')

  const grades = Object.entries(typeScale) as Array<
    [TypeGradeName, (typeof typeScale)[TypeGradeName]]
  >

  return (
    <Section id="typography" title={t('title')} description={t('description')}>
      <Table
        head={
          <>
            <Th>{t('grade')}</Th>
            <Th>{t('size')}</Th>
            <Th>{t('lineHeight')}</Th>
            <Th>{t('tracking')}</Th>
            <Th>{t('weight')}</Th>
          </>
        }
      >
        {grades.map(([name, grade]) => (
          <tr key={name}>
            <Td>
              <Mono>{name}</Mono>
            </Td>
            <Td>
              <Mono>{fluidClamp(grade.min, grade.max)}</Mono>
            </Td>
            <Td>
              <Mono>{grade.lineHeight}</Mono>
            </Td>
            <Td>
              <Mono>{grade.tracking}em</Mono>
            </Td>
            <Td>
              <Mono>{grade.weight}</Mono>
            </Td>
          </tr>
        ))}
      </Table>

      <p className="mt-48 mb-48 max-w-measure text-body text-ink-muted">{t('cjkNote')}</p>

      {/* The CJK face is loaded here too, so the chinese specimen renders with
          it even when the page is being read in italian or english. */}
      <CjkStylesheet />
      <div>
        {grades.map(([name]) => (
          <div key={name} className="mb-64 border-t border-line pt-24">
            <SubHeading>{name}</SubHeading>
            {specimens.map((specimen) => (
              <p
                key={specimen.locale}
                lang={specimen.locale}
                className={`${gradeClass[name]} mb-16 max-w-measure`}
              >
                {specimen.sentence}
              </p>
            ))}
          </div>
        ))}

        <div className="border-t border-line pt-24">
          <SubHeading>body</SubHeading>
          {specimens.map((specimen) => (
            <p
              key={specimen.locale}
              lang={specimen.locale}
              className="mb-32 max-w-measure text-body"
            >
              {specimen.paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

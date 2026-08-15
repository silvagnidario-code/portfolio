import { getTranslations } from 'next-intl/server'

import { colorAliases } from '@/tokens/semantic'

import { Mono, Section, Table, Td, Th } from './section'

/** Utilities the alias produces, spelled out so the mapping is unambiguous. */
const utilityFor = (alias: string): string => `bg-${alias} · text-${alias} · border-${alias}`

export async function AliasesSection() {
  const t = await getTranslations('Styleguide.aliases')

  return (
    <Section id="aliases" title={t('title')} description={t('description')}>
      <Table
        head={
          <>
            <Th>{t('role')}</Th>
            <Th>{t('utility')}</Th>
          </>
        }
      >
        {Object.entries(colorAliases).map(([alias, role]) => (
          <tr key={alias}>
            <Td>
              <Mono>--{role}</Mono>
            </Td>
            <Td>
              <Mono>{utilityFor(alias)}</Mono>
            </Td>
          </tr>
        ))}
      </Table>
    </Section>
  )
}

import config from '@payload-config'
import { getPayload } from 'payload'

import { locales, type Locale } from '../src/i18n/routing'

/**
 * One-off content fix, not a design change.
 *
 * Several projects' Contesto / Sfida / Approccio were pasted into the editor
 * with a hard line break after every line. Lexical stores each of those
 * lines as its own paragraph, and `.prose` gives every paragraph the same
 * top margin it gives a real paragraph break (`--space-32`) — so what should
 * read as one flowing paragraph renders as five or six, each shoved apart by
 * 32px on top of the line-height. No amount of tuning `--lh-body` fixes
 * that: the gap is paragraph spacing, not line spacing.
 *
 * This merges every run of adjacent paragraph nodes back into a single
 * paragraph, per field, per locale. It only touches a field when ALL of its
 * top-level nodes are paragraphs — one that mixes in a heading or a list is
 * left untouched rather than risk collapsing something that was never meant
 * to be one block.
 *
 * Dry-run by default — prints what it would change without writing anything.
 * Pass --write to actually save.
 *
 *   npm run fix:narrative-paragraphs           # dry run
 *   npm run fix:narrative-paragraphs -- --write
 */

const NARRATIVE_FIELDS = ['context', 'challenge', 'approach'] as const

type LexicalNode = Record<string, unknown> & { type?: string; children?: LexicalNode[] }
type LexicalState = { root: LexicalNode } | null | undefined

const WRITE = process.argv.includes('--write')

function spaceNode(): LexicalNode {
  return { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: ' ', version: 1 }
}

function plainText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join('')
}

function mergeParagraphs(state: LexicalState): {
  changed: boolean
  state: LexicalState
  preview?: string
} {
  const children = state?.root?.children
  if (!Array.isArray(children) || children.length < 2) return { changed: false, state }

  const allParagraphs = children.every((node) => node?.type === 'paragraph')
  if (!allParagraphs) return { changed: false, state }

  const mergedChildren: LexicalNode[] = []
  children.forEach((paragraph, index) => {
    if (index > 0) mergedChildren.push(spaceNode())
    mergedChildren.push(...(paragraph.children ?? []))
  })

  const merged: LexicalNode = { ...children[0], children: mergedChildren }
  const nextState = {
    root: { ...(state as { root: LexicalNode }).root, children: [merged] },
  } as LexicalState

  return { changed: true, state: nextState, preview: plainText(merged) }
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  let touchedDocs = 0
  let touchedFieldLocales = 0
  let page = 1
  let hasNextPage = true

  console.log(
    WRITE ? 'Writing changes.\n' : 'Dry run — nothing will be saved. Pass --write to apply.\n',
  )

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'projects',
      locale: 'all',
      depth: 0,
      limit: 50,
      page,
      overrideAccess: true,
    })

    for (const doc of result.docs) {
      const label = (doc as { slug?: string; id: unknown }).slug ?? doc.id
      let docChanged = false

      for (const field of NARRATIVE_FIELDS) {
        const byLocale = (doc as unknown as Record<string, unknown>)[field] as
          Partial<Record<Locale, LexicalState>> | undefined
        if (!byLocale || typeof byLocale !== 'object') continue

        for (const locale of locales) {
          const { changed, state, preview } = mergeParagraphs(byLocale[locale])
          if (!changed) continue

          docChanged = true
          touchedFieldLocales += 1
          console.log(`${label} · ${field} · ${locale}`)
          if (preview) console.log(`  → ${preview.slice(0, 140)}${preview.length > 140 ? '…' : ''}`)

          if (WRITE) {
            try {
              await payload.update({
                collection: 'projects',
                id: doc.id,
                locale,
                overrideAccess: true,
                data: { [field]: state },
              })
            } catch (error) {
              console.error(`  ✗ failed to save ${label} · ${field} · ${locale}:`, error)
            }
          }
        }
      }

      if (docChanged) touchedDocs += 1
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  console.log(
    `\n${WRITE ? 'Done' : 'Would change'}: ${touchedDocs} project(s), ${touchedFieldLocales} field/locale pair(s).`,
  )
  process.exit(0)
}

await main()

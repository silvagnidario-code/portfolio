import type { ProseBlock } from '@/payload-types'

import { Eyebrow } from './block-section'
import { RichText } from './rich-text'

/**
 * A run of prose inside a case study. It carries no section frame: it sits
 * inside the narrative of a project, which owns the rhythm around it.
 */
export function Prose({ block }: { block: ProseBlock }) {
  const { eyebrow, heading, body } = block

  return (
    <div className="page-grid">
      <div className="col-span-4 tablet:col-span-6 desktop:col-span-7 desktop:col-start-4">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {heading ? <h3 className="mt-16 text-h3 text-balance">{heading}</h3> : null}
        <RichText data={body} className="mt-32" />
      </div>
    </div>
  )
}

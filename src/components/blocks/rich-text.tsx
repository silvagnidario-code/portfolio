import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Editor content, rendered with the shared prose styles. Blocks never style
 * running text themselves.
 */
export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data) return null

  return (
    <div className={`prose ${className ?? ''}`}>
      <LexicalRichText data={data} />
    </div>
  )
}

import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'

/**
 * Whether a Lexical field has any text in it — not just whether the field is
 * non-null.
 *
 * Payload only stores `null` for a richText field that has never been
 * touched. Once an editor opens it and clears the text, what's saved is an
 * empty-but-structured document instead — `{ root: { children: [{ type:
 * 'paragraph', children: [] }], ... } }` — which is a perfectly truthy
 * object. Code that gates a section's whole heading-plus-body on `Boolean(
 * project.challenge)` (as this page's `narrative` array did) keeps showing
 * the heading forever after the first edit, text or no text — which is
 * exactly what happened on /work/peng-zhang: the heading ("La sfida")
 * survived clearing the body because the clear left this truthy husk behind
 * rather than `null`.
 */
export function hasRichText(value?: SerializedEditorState | null): boolean {
  const children = value?.root?.children
  if (!children?.length) return false

  const nodeHasText = (node: SerializedLexicalNode): boolean => {
    if ('text' in node && typeof node.text === 'string' && node.text.trim().length > 0) {
      return true
    }
    const kids = (node as { children?: SerializedLexicalNode[] }).children
    return Array.isArray(kids) && kids.some(nodeHasText)
  }

  return children.some(nodeHasText)
}

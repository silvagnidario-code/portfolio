import type { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * `@google/model-viewer` registers `<model-viewer>` as a browser custom
 * element — it ships no React component, so JSX has no idea what props it
 * takes without this. Attribute names stay kebab-case (`camera-controls`,
 * not `cameraControls`): React passes unrecognised hyphenated props on a
 * lowercase tag straight through as DOM attributes, which is exactly what
 * the custom element reads, but only if the casing matches.
 *
 * Augmenting `declare global { namespace JSX }` doesn't reach this
 * project's actual JSX checking: `@types/react` 19 moved
 * `IntrinsicElements` to live under `React.JSX`, with no global `JSX`
 * namespace left for anything to bridge to (confirmed by grepping
 * `@types/react` for a `declare global` block — there is none). Module
 * augmentation has to target `react`'s own `JSX` namespace directly.
 */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        poster?: string
        exposure?: string
        'shadow-intensity'?: string
        'environment-image'?: string
        'camera-controls'?: boolean
        'auto-rotate'?: boolean
        'auto-rotate-delay'?: string
        ar?: boolean
        loading?: 'auto' | 'lazy' | 'eager'
        reveal?: 'auto' | 'interaction' | 'manual'
      }
    }
  }
}

export {}

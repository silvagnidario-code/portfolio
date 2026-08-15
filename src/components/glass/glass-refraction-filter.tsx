import { glass } from '@/tokens/brand'

export const GLASS_REFRACTION_ID = 'glass-refraction'

/**
 * The displacement filter referenced by the cursor variant, §7 layer 4.
 *
 * Rendered once per document, next to the element that uses it. Anything
 * heavier than this — displacement on a navbar, on pills, on the lightbox —
 * costs more than it shows, which is why the specification restricts it to the
 * cursor.
 */
export function GlassRefractionFilter() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <defs>
        <filter id={GLASS_REFRACTION_ID} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={glass.refraction.frequency}
            numOctaves={2}
            seed={4}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={glass.refraction.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

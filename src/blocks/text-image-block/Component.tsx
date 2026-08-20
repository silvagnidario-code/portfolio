import TextImageModule from '@/components/TextImageModule'

/**
 * Renderer del block "Testo + Immagine".
 * Salva come: src/blocks/text-image-block/Component.tsx
 */

type MediaDoc = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type TextImageBlockData = {
  eyebrow?: string | null
  title: string
  description?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  image: MediaDoc | string
  imagePosition?: ('left' | 'right') | null
  fullBleed?: boolean | null
}

export function TextImageBlock({ block }: { block: TextImageBlockData }) {
  const { eyebrow, title, description, cta, image, imagePosition, fullBleed } = block

  // "image" arriva come oggetto Media popolato da Payload (depth >= 1),
  // o come stringa/id se non popolato: gestiamo entrambi i casi.
  const media: MediaDoc = typeof image === 'string' ? { url: image } : image ?? {}

  return (
    <TextImageModule
      eyebrow={eyebrow ?? undefined}
      title={title}
      description={description ?? undefined}
      cta={cta?.label && cta?.href ? { label: cta.label, href: cta.href } : undefined}
      image={{
        src: media.url ?? '',
        alt: media.alt ?? title,
        width: media.width ?? 1200,
        height: media.height ?? 900,
      }}
      imagePosition={imagePosition ?? 'right'}
      fullBleed={Boolean(fullBleed)}
    />
  )
}

export default TextImageBlock

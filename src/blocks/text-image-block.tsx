import TextImageModule from '@/components/TextImageModule'

/**
 * Salva come: src/components/blocks/text-image-block.tsx
 * (sostituisce/elimina la vecchia cartella src/blocks/text-image-block/)
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

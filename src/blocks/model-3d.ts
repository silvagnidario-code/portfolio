import type { Block } from 'payload'

import { blockSettings } from './shared'

/**
 * An interactive, orbit-and-zoom 3D model — a .glb, rendered client-side
 * with Google's `<model-viewer>` — rather than a flat render of one. Built
 * for the Oway/Cosmoprof stand model, which only existed as a 60MB
 * SketchUp file: converting that to .glb (preserving the flat SketchUp
 * materials, not just textures) and compressing it with Draco geometry
 * compression took it from 287MB to roughly 8-9MB. That conversion and
 * compression happen before the file ever reaches this block — `model`
 * just wants an already-web-ready .glb, the same way `MediaBlock` wants an
 * already-sized image. No format validation here: Payload's `media`
 * collection has no mimeType allowlist (see Media.ts), so this takes
 * whatever file is uploaded on faith, same as a PDF ends up there today.
 */
export const Model3D: Block = {
  slug: 'model3d',
  interfaceName: 'Model3DBlock',
  labels: { singular: 'Modello 3D', plural: 'Modelli 3D' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'model',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          '.glb, già pronto per il web (texture/colori inclusi, compresso). Non .skp — nessun browser lo legge.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Immagine mostrata finché il modello (alcuni MB) non ha finito di caricare. Facoltativa ma consigliata.',
      },
    },
    {
      name: 'autoRotate',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Ruota lentamente da solo finché il visitatore non lo tocca.' },
    },
    {
      name: 'mobileFallbackVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Video di un giro a 360° (sfondo a tinta unita, non trasparente — non affidabile su Safari/iOS), mostrato al posto del modello interattivo sotto il breakpoint desktop. Un modello di questo peso può mandare in crash la pagina su molti telefoni; senza un video qui, il modello interattivo resta l’unica opzione anche su mobile.',
      },
    },
    blockSettings,
  ],
}

import type { Field } from 'payload'

/**
 * The three properties every block exposes, §5.
 *
 * They live in one place so a new block cannot forget them, and so the renderer
 * can handle them once instead of per block.
 */
export const blockSettings: Field = {
  name: 'settings',
  type: 'group',
  label: 'Impostazioni',
  admin: { description: 'Fondo, respiro verticale e animazione di ingresso.' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          required: true,
          defaultValue: 'paper',
          options: [
            { label: 'Carta', value: 'paper' },
            { label: 'Inchiostro', value: 'sumi' },
            { label: 'Accento', value: 'accent' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'spacing',
          type: 'select',
          required: true,
          defaultValue: 'normal',
          options: [
            { label: 'Compatto', value: 'compact' },
            { label: 'Normale', value: 'normal' },
            { label: 'Ampio', value: 'wide' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'animate',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
      ],
    },
  ],
}

/**
 * Builds the variant selector.
 *
 * The variant is a field inside the block, never a separate block type:
 * switching it must never lose content or translations, which is exactly what
 * swapping one block for another would do.
 */
export const variantField = (options: Array<{ label: string; value: string }>): Field => ({
  name: 'variant',
  type: 'select',
  required: true,
  defaultValue: options[0]?.value,
  options,
  admin: {
    description: 'Cambiare variante non perde contenuti né traduzioni.',
  },
})

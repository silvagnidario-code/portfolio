import type { CollectionConfig } from 'payload'

import {
  admins,
  adminsFieldAccess,
  adminsOrSelf,
  authenticated,
  canAccessAdminUI,
} from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Sistema',
  },
  auth: true,
  access: {
    admin: canAccessAdminUI,
    read: authenticated,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // An editor must not be able to promote themselves.
        create: adminsFieldAccess,
        update: adminsFieldAccess,
      },
    },
  ],
}

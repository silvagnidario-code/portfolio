import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { env } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Admin panel UI language. Content locales are configured below.
  i18n: {
    fallbackLanguage: 'it',
    supportedLanguages: { it, en },
  },
  // Field-level content localization. Every localized field carries one value
  // per locale; `fallback` serves the default locale when a translation is missing.
  localization: {
    locales: [
      { code: 'it', label: 'Italiano' },
      { code: 'en', label: 'English' },
      { code: 'zh', label: '简体中文' },
    ],
    defaultLocale: 'it',
    fallback: true,
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URI },
    // Schema is pushed automatically in development and applied through
    // versioned migrations everywhere else.
    push: env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          // Files are served straight from the bucket (CDN in production)
          // rather than proxied through the Next server.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [env.S3_PUBLIC_URL, prefix, filename].filter(Boolean).join('/'),
        },
      },
      bucket: env.S3_BUCKET,
      config: {
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: env.S3_FORCE_PATH_STYLE,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
      },
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})

import path from 'path'
import { fileURLToPath } from 'url'

import { config as loadDotenv } from 'dotenv'
import { z } from 'zod'

/**
 * Server-side environment. Parsed once, at import time, so a missing or
 * malformed variable fails at boot with a readable message instead of
 * surfacing later as a connection or upload error.
 *
 * Never import this from a client component.
 */

// Next loads `.env` on its own, the Payload CLI (migrate, generate:types) does not.
// `dotenv` never overrides variables that are already set, so this is a no-op
// when the process was started by Next or by Docker.
loadDotenv({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env'),
  quiet: true,
})

const booleanFromString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true')

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  DATABASE_URI: z.string().min(1, 'DATABASE_URI is required'),
  PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters long'),

  NEXT_PUBLIC_SERVER_URL: z.url(),

  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1).default('auto'),
  S3_ENDPOINT: z.url(),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  // MinIO and some S3-compatible providers require path-style addressing.
  S3_FORCE_PATH_STYLE: booleanFromString,
  // Public base URL the media files are served from (CDN in production).
  S3_PUBLIC_URL: z.url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(`Invalid environment variables:\n${issues}\n\nSee .env.example.`)
}

export const env = parsed.data

export type Env = typeof env

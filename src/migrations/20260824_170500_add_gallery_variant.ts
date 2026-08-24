ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `gallery` variant to the Media block's `variant` enum, on both the
 * live tables and their draft-version counterparts, for the two collections
 * that embed the block (`pages`, `projects`). The `IF NOT EXISTS` clause
 * makes re-running this migration harmless.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_media_variant" ADD VALUE IF NOT EXISTS 'gallery';
  ALTER TYPE "public"."enum__pages_v_blocks_media_variant" ADD VALUE IF NOT EXISTS 'gallery';
  ALTER TYPE "public"."enum_projects_blocks_media_variant" ADD VALUE IF NOT EXISTS 'gallery';
  ALTER TYPE "public"."enum__projects_v_blocks_media_variant" ADD VALUE IF NOT EXISTS 'gallery';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Postgres has no `ALTER TYPE ... DROP VALUE`: removing an enum value
  // cleanly means recreating the type and every column that uses it. Not
  // attempted here — rolling back past this migration needs a manual fix if
  // any document was saved with `variant: 'gallery'` in the meantime.
}

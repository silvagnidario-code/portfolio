import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `iconGrid` variant to the Project Grid block's `variant` enum, on
 * both the live table and its draft-version counterpart, for the `pages`
 * collection that embeds the block. The `IF NOT EXISTS` clause makes
 * re-running this migration harmless.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_project_grid_variant" ADD VALUE IF NOT EXISTS 'iconGrid';
  ALTER TYPE "public"."enum__pages_v_blocks_project_grid_variant" ADD VALUE IF NOT EXISTS 'iconGrid';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Postgres has no `ALTER TYPE ... DROP VALUE`: removing an enum value
  // cleanly means recreating the type and every column that uses it. Not
  // attempted here — rolling back past this migration needs a manual fix if
  // any document was saved with `variant: 'iconGrid'` in the meantime.
}

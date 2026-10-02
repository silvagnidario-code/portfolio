import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds `mobile_fallback_video_id` to `projects_blocks_model3d` and
 * `_projects_v_blocks_model3d` — the new `mobileFallbackVideo` field on
 * `src/blocks/model-3d.ts`, a third upload relation alongside `model_id`
 * and `poster_id`. A separate `ALTER TABLE` migration, not a rewrite of
 * `20261002_120000_add_model_3d_block`'s `CREATE TABLE`: that migration had
 * already run against the live database — the model3d block itself
 * shipped first, without this field — so the only way to add a column at
 * this point is to alter the existing table, the same as
 * `20260902_120032_add_project_year_end` did for `projects.year_end`.
 *
 * Same FK shape as `model_id` / `poster_id` in the original migration:
 * `ON DELETE set null`, not `cascade` — deleting the fallback video clears
 * the reference rather than deleting the block.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_model3d" ADD COLUMN "mobile_fallback_video_id" integer;
  ALTER TABLE "_projects_v_blocks_model3d" ADD COLUMN "mobile_fallback_video_id" integer;

  ALTER TABLE "projects_blocks_model3d" ADD CONSTRAINT "projects_blocks_model3d_mobile_fallback_video_id_media_id_fk" FOREIGN KEY ("mobile_fallback_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_model3d" ADD CONSTRAINT "_projects_v_blocks_model3d_mobile_fallback_video_id_media_id_fk" FOREIGN KEY ("mobile_fallback_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "projects_blocks_model3d_mobile_fallback_video_idx" ON "projects_blocks_model3d" USING btree ("mobile_fallback_video_id");
  CREATE INDEX "_projects_v_blocks_model3d_mobile_fallback_video_idx" ON "_projects_v_blocks_model3d" USING btree ("mobile_fallback_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_model3d" DROP COLUMN "mobile_fallback_video_id";
  ALTER TABLE "_projects_v_blocks_model3d" DROP COLUMN "mobile_fallback_video_id";`)
}

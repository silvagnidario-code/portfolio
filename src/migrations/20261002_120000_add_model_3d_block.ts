import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the tables for the new `model3d` block on `projects.execution`
 * (`src/blocks/model-3d.ts`) — live and draft-version, same pair as every
 * other block on that field. Hand-written for the same reason as
 * `20260930_190000_add_live_embed_block`: no live database to diff against
 * from here.
 *
 * Modelled on `projects_blocks_live_embed` for the shape (one simple block
 * table + a locales table for the translated text fields), but with two
 * upload relations (`model_id`, `poster_id`) instead of live-embed's plain
 * `url` text column — copied from how `projects_blocks_media` points at
 * `video_id` / `poster_id` in `20260815_181959_cms_schema`: an integer
 * column with a `media(id)` foreign key, `ON DELETE set null` rather than
 * `cascade`, so deleting a Media document clears the reference instead of
 * deleting the block that pointed to it. `model_id` has no `NOT NULL`
 * despite being `required` in the Payload config, for the same reason nothing
 * else in this migration is `NOT NULL` either: Payload enforces `required`
 * at the application layer, not with a DB constraint.
 *
 * A third upload relation on this same block, `mobileFallbackVideo`, is
 * migrated separately in `20261002_130000_add_model_3d_mobile_fallback_video`
 * rather than added here: this migration had already run against the live
 * database by the time that field existed, so its column has to arrive as
 * an `ALTER TABLE`, not by editing the `CREATE TABLE` below.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_model3d_settings_background" AS ENUM('paper', 'sumi', 'accent');
  CREATE TYPE "public"."enum_projects_blocks_model3d_settings_spacing" AS ENUM('compact', 'normal', 'wide');
  CREATE TYPE "public"."enum__projects_v_blocks_model3d_settings_background" AS ENUM('paper', 'sumi', 'accent');
  CREATE TYPE "public"."enum__projects_v_blocks_model3d_settings_spacing" AS ENUM('compact', 'normal', 'wide');

  CREATE TABLE "projects_blocks_model3d" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"model_id" integer,
  	"poster_id" integer,
  	"auto_rotate" boolean DEFAULT true,
  	"settings_background" "enum_projects_blocks_model3d_settings_background" DEFAULT 'paper',
  	"settings_spacing" "enum_projects_blocks_model3d_settings_spacing" DEFAULT 'normal',
  	"settings_animate" boolean DEFAULT true,
  	"block_name" varchar
  );

  CREATE TABLE "projects_blocks_model3d_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "_projects_v_blocks_model3d" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"model_id" integer,
  	"poster_id" integer,
  	"auto_rotate" boolean DEFAULT true,
  	"settings_background" "enum__projects_v_blocks_model3d_settings_background" DEFAULT 'paper',
  	"settings_spacing" "enum__projects_v_blocks_model3d_settings_spacing" DEFAULT 'normal',
  	"settings_animate" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_projects_v_blocks_model3d_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "projects_blocks_model3d" ADD CONSTRAINT "projects_blocks_model3d_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_model3d" ADD CONSTRAINT "projects_blocks_model3d_model_id_media_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_model3d" ADD CONSTRAINT "projects_blocks_model3d_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_model3d_locales" ADD CONSTRAINT "projects_blocks_model3d_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_model3d"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_model3d" ADD CONSTRAINT "_projects_v_blocks_model3d_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_model3d" ADD CONSTRAINT "_projects_v_blocks_model3d_model_id_media_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_model3d" ADD CONSTRAINT "_projects_v_blocks_model3d_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_model3d_locales" ADD CONSTRAINT "_projects_v_blocks_model3d_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_model3d"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "projects_blocks_model3d_order_idx" ON "projects_blocks_model3d" USING btree ("_order");
  CREATE INDEX "projects_blocks_model3d_parent_id_idx" ON "projects_blocks_model3d" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_model3d_path_idx" ON "projects_blocks_model3d" USING btree ("_path");
  CREATE INDEX "projects_blocks_model3d_model_idx" ON "projects_blocks_model3d" USING btree ("model_id");
  CREATE INDEX "projects_blocks_model3d_poster_idx" ON "projects_blocks_model3d" USING btree ("poster_id");
  CREATE UNIQUE INDEX "projects_blocks_model3d_locales_locale_parent_id_unique" ON "projects_blocks_model3d_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_model3d_order_idx" ON "_projects_v_blocks_model3d" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_model3d_parent_id_idx" ON "_projects_v_blocks_model3d" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_model3d_path_idx" ON "_projects_v_blocks_model3d" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_model3d_model_idx" ON "_projects_v_blocks_model3d" USING btree ("model_id");
  CREATE INDEX "_projects_v_blocks_model3d_poster_idx" ON "_projects_v_blocks_model3d" USING btree ("poster_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_model3d_locales_locale_parent_id_unique" ON "_projects_v_blocks_model3d_locales" USING btree ("_locale","_parent_id");

  ALTER TABLE "projects_blocks_model3d" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_model3d_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_model3d" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_model3d_locales" DISABLE ROW LEVEL SECURITY;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_blocks_model3d" CASCADE;
  DROP TABLE "projects_blocks_model3d_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_model3d" CASCADE;
  DROP TABLE "_projects_v_blocks_model3d_locales" CASCADE;
  DROP TYPE "public"."enum_projects_blocks_model3d_settings_background";
  DROP TYPE "public"."enum_projects_blocks_model3d_settings_spacing";
  DROP TYPE "public"."enum__projects_v_blocks_model3d_settings_background";
  DROP TYPE "public"."enum__projects_v_blocks_model3d_settings_spacing";`)
}

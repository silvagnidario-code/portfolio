import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_projects_blocks_media_variant" ADD VALUE 'grid';
  ALTER TYPE "public"."enum__projects_v_blocks_media_variant" ADD VALUE 'grid';
  ALTER TYPE "public"."enum_pages_blocks_media_variant" ADD VALUE 'grid';
  ALTER TYPE "public"."enum__pages_v_blocks_media_variant" ADD VALUE 'grid';
  CREATE TABLE "projects_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"poster_id" integer
  );
  
  CREATE TABLE "projects_blocks_media_grid_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"poster_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_media_grid_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"poster_id" integer
  );
  
  CREATE TABLE "pages_blocks_media_grid_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"poster_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_grid_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects_blocks_media_grid_items" ADD CONSTRAINT "projects_blocks_media_grid_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_grid_items" ADD CONSTRAINT "projects_blocks_media_grid_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_grid_items" ADD CONSTRAINT "projects_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_grid_items_locales" ADD CONSTRAINT "projects_blocks_media_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_media_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_grid_items" ADD CONSTRAINT "_projects_v_blocks_media_grid_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_grid_items" ADD CONSTRAINT "_projects_v_blocks_media_grid_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_grid_items" ADD CONSTRAINT "_projects_v_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_grid_items_locales" ADD CONSTRAINT "_projects_v_blocks_media_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_media_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid_items" ADD CONSTRAINT "pages_blocks_media_grid_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid_items" ADD CONSTRAINT "pages_blocks_media_grid_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid_items" ADD CONSTRAINT "pages_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid_items_locales" ADD CONSTRAINT "pages_blocks_media_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid_items" ADD CONSTRAINT "_pages_v_blocks_media_grid_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid_items" ADD CONSTRAINT "_pages_v_blocks_media_grid_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid_items" ADD CONSTRAINT "_pages_v_blocks_media_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid_items_locales" ADD CONSTRAINT "_pages_v_blocks_media_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_blocks_media_grid_items_order_idx" ON "projects_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_media_grid_items_parent_id_idx" ON "projects_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_media_grid_items_video_idx" ON "projects_blocks_media_grid_items" USING btree ("video_id");
  CREATE INDEX "projects_blocks_media_grid_items_poster_idx" ON "projects_blocks_media_grid_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "projects_blocks_media_grid_items_locales_locale_parent_id_un" ON "projects_blocks_media_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_media_grid_items_order_idx" ON "_projects_v_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_media_grid_items_parent_id_idx" ON "_projects_v_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_media_grid_items_video_idx" ON "_projects_v_blocks_media_grid_items" USING btree ("video_id");
  CREATE INDEX "_projects_v_blocks_media_grid_items_poster_idx" ON "_projects_v_blocks_media_grid_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_media_grid_items_locales_locale_parent_id" ON "_projects_v_blocks_media_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_grid_items_order_idx" ON "pages_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_grid_items_parent_id_idx" ON "pages_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_grid_items_video_idx" ON "pages_blocks_media_grid_items" USING btree ("video_id");
  CREATE INDEX "pages_blocks_media_grid_items_poster_idx" ON "pages_blocks_media_grid_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "pages_blocks_media_grid_items_locales_locale_parent_id_uniqu" ON "pages_blocks_media_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_grid_items_order_idx" ON "_pages_v_blocks_media_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_grid_items_parent_id_idx" ON "_pages_v_blocks_media_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_grid_items_video_idx" ON "_pages_v_blocks_media_grid_items" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_media_grid_items_poster_idx" ON "_pages_v_blocks_media_grid_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_grid_items_locales_locale_parent_id_un" ON "_pages_v_blocks_media_grid_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_blocks_media_grid_items" CASCADE;
  DROP TABLE "projects_blocks_media_grid_items_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_media_grid_items" CASCADE;
  DROP TABLE "_projects_v_blocks_media_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_media_grid_items" CASCADE;
  DROP TABLE "pages_blocks_media_grid_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_media_grid_items_locales" CASCADE;
  ALTER TABLE "projects_blocks_media" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "projects_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::text;
  DROP TYPE "public"."enum_projects_blocks_media_variant";
  CREATE TYPE "public"."enum_projects_blocks_media_variant" AS ENUM('fullBleed', 'pair', 'videoLoop', 'beforeAfter');
  ALTER TABLE "projects_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::"public"."enum_projects_blocks_media_variant";
  ALTER TABLE "projects_blocks_media" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_projects_blocks_media_variant" USING "variant"::"public"."enum_projects_blocks_media_variant";
  ALTER TABLE "_projects_v_blocks_media" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_projects_v_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::text;
  DROP TYPE "public"."enum__projects_v_blocks_media_variant";
  CREATE TYPE "public"."enum__projects_v_blocks_media_variant" AS ENUM('fullBleed', 'pair', 'videoLoop', 'beforeAfter');
  ALTER TABLE "_projects_v_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::"public"."enum__projects_v_blocks_media_variant";
  ALTER TABLE "_projects_v_blocks_media" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__projects_v_blocks_media_variant" USING "variant"::"public"."enum__projects_v_blocks_media_variant";
  ALTER TABLE "pages_blocks_media" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::text;
  DROP TYPE "public"."enum_pages_blocks_media_variant";
  CREATE TYPE "public"."enum_pages_blocks_media_variant" AS ENUM('fullBleed', 'pair', 'videoLoop', 'beforeAfter');
  ALTER TABLE "pages_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::"public"."enum_pages_blocks_media_variant";
  ALTER TABLE "pages_blocks_media" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_media_variant" USING "variant"::"public"."enum_pages_blocks_media_variant";
  ALTER TABLE "_pages_v_blocks_media" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::text;
  DROP TYPE "public"."enum__pages_v_blocks_media_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_media_variant" AS ENUM('fullBleed', 'pair', 'videoLoop', 'beforeAfter');
  ALTER TABLE "_pages_v_blocks_media" ALTER COLUMN "variant" SET DEFAULT 'fullBleed'::"public"."enum__pages_v_blocks_media_variant";
  ALTER TABLE "_pages_v_blocks_media" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_media_variant" USING "variant"::"public"."enum__pages_v_blocks_media_variant";`)
}

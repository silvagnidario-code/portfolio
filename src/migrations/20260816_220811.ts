import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "seo_defaults" ADD COLUMN "logo_id" integer;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "seo_defaults_logo_idx" ON "seo_defaults" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "seo_defaults" DROP CONSTRAINT "seo_defaults_logo_id_media_id_fk";
  
  DROP INDEX "seo_defaults_logo_idx";
  ALTER TABLE "seo_defaults" DROP COLUMN "logo_id";`)
}

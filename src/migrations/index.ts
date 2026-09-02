import * as migration_20260815_155850_initial from './20260815_155850_initial';
import * as migration_20260815_181959_cms_schema from './20260815_181959_cms_schema';
import * as migration_20260816_220811 from './20260816_220811';
import * as migration_20260819_171003 from './20260819_171003';
import * as migration_20260824_170500_add_gallery_variant from './20260824_170500_add_gallery_variant';
import * as migration_20260824_170600_add_bio_block from './20260824_170600_add_bio_block';
import * as migration_20260902_120032_add_project_year_end from './20260902_120032_add_project_year_end';

export const migrations = [
  {
    up: migration_20260815_155850_initial.up,
    down: migration_20260815_155850_initial.down,
    name: '20260815_155850_initial',
  },
  {
    up: migration_20260815_181959_cms_schema.up,
    down: migration_20260815_181959_cms_schema.down,
    name: '20260815_181959_cms_schema',
  },
  {
    up: migration_20260816_220811.up,
    down: migration_20260816_220811.down,
    name: '20260816_220811',
  },
  {
    up: migration_20260819_171003.up,
    down: migration_20260819_171003.down,
    name: '20260819_171003',
  },
  {
    up: migration_20260824_170500_add_gallery_variant.up,
    down: migration_20260824_170500_add_gallery_variant.down,
    name: '20260824_170500_add_gallery_variant',
  },
  {
    up: migration_20260824_170600_add_bio_block.up,
    down: migration_20260824_170600_add_bio_block.down,
    name: '20260824_170600_add_bio_block',
  },
  {
    up: migration_20260902_120032_add_project_year_end.up,
    down: migration_20260902_120032_add_project_year_end.down,
    name: '20260902_120032_add_project_year_end',
  },
];

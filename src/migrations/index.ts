import * as migration_20260815_155850_initial from './20260815_155850_initial';
import * as migration_20260815_181959_cms_schema from './20260815_181959_cms_schema';
import * as migration_20260816_220811 from './20260816_220811';
import * as migration_20260819_171003 from './20260819_171003';
import * as migration_20260821_130104_add_media_grid_variant from './20260821_130104_add_media_grid_variant';

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
    up: migration_20260821_130104_add_media_grid_variant.up,
    down: migration_20260821_130104_add_media_grid_variant.down,
    name: '20260821_130104_add_media_grid_variant'
  },
];

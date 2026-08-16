import * as migration_20260815_155850_initial from './20260815_155850_initial';
import * as migration_20260815_181959_cms_schema from './20260815_181959_cms_schema';
import * as migration_20260816_220811 from './20260816_220811';

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
    name: '20260816_220811'
  },
];

import * as migration_20260815_155850_initial from './20260815_155850_initial';

export const migrations = [
  {
    up: migration_20260815_155850_initial.up,
    down: migration_20260815_155850_initial.down,
    name: '20260815_155850_initial'
  },
];

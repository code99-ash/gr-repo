import { getDB } from '.';

export const DB = 'DBProvider';

export const DrizzleProvider = [
  {
    provide: DB,
    useFactory: async () => (await getDB()).db,
    exports: [DB],
  },
];

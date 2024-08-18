import * as schema from './schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';

export type DatabaseTransaction = Parameters<
  Parameters<Database['transaction']>[0]
>[0];

export type DatabaseSchema = typeof schema;
export type Database = NodePgDatabase<DatabaseSchema>;

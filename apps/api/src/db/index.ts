import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';
import { DatabaseSchema } from './db.types';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { DB_OPTIONS } from '../config/app.config';

export const connection = new Client(DB_OPTIONS);

export let dbInstance: NodePgDatabase<DatabaseSchema> | null = null;
let connectionInstance: Client | null = null;

export async function getDB() {
  if (!dbInstance || !connectionInstance) {
    connectionInstance = new Client(DB_OPTIONS);
    await connectionInstance.connect();
    dbInstance = drizzle(connectionInstance, { schema });
  }
  return { db: dbInstance, connection: connectionInstance };
}

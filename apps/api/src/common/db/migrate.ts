import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDB } from '.';
import drizzleConfig from 'drizzle.config';

async function runMigration() {
  const { db, connection } = await getDB();

  if (!drizzleConfig.out) {
    throw new Error('Migration out path is not defined in drizzle.config.ts');
  }

  await migrate(db, {
    migrationsFolder: drizzleConfig.out,
  }).then(() => console.log('Migrations complete'));

  await connection.end();
}

runMigration();

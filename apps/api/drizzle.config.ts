import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from 'src/common/env/env.schema';

config();

export default defineConfig({
  schema: './src/db/schemas.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

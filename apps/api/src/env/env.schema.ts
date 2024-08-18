import { z } from 'zod';
import { config } from 'dotenv';
config();

const ENV_SCHEMA = z.object({
  DATABASE_URL: z.string().min(1),
});

export const env = ENV_SCHEMA.parse({
  DATABASE_URL: process.env.DATABASE_URL,
});

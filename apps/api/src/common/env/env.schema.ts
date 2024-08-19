import { z } from 'zod';
import { config } from 'dotenv';
config();

const ENV_SCHEMA = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC: z.coerce.number(),
});

export const env = ENV_SCHEMA.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC:
    process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
});

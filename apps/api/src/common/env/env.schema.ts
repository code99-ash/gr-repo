import { z } from 'zod';
import { config } from 'dotenv';
config();

const ENV_SCHEMA = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC: z.coerce.number(),

  ENCRYPTION_KEY: z.string().min(1),
  ENCRYPTION_IV: z.string().min(1),

  SHOPIFY_CLIENT_ID: z.string(),
  SHOPIFY_CLIENT_SECRET: z.string(),
  SHOPIFY_SCOPES: z.string(),
  SHOPIFY_REDIRECT_URL: z.string(),

  WEBHOOK_BASE_URL: z.string(),
});

export const env = ENV_SCHEMA.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC:
    process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_IV: process.env.ENCRYPTION_IV, 

  SHOPIFY_CLIENT_ID: process.env.SHOPIFY_CLIENT_ID,
  SHOPIFY_CLIENT_SECRET: process.env.SHOPIFY_CLIENT_SECRET,
  SHOPIFY_SCOPES: process.env.SHOPIFY_SCOPES, 
  SHOPIFY_REDIRECT_URL: process.env.SHOPIFY_REDIRECT_URL, 

  WEBHOOK_BASE_URL: process.env.WEBHOOK_BASE_URL
});

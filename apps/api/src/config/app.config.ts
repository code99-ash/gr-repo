import { config } from 'dotenv';
import { env } from '../env/env.schema';
config();

export const CORE_SERVER_PORT = 8090;
export const WORKER_SERVER_PORT = 8091;
export const CORE_SERVER_API_DEFAULT_VERSION = '1';
export const PASSWORD_ROUNDS = 10;
export const DB_OPTIONS = {
  connectionString: env.DATABASE_URL,
};

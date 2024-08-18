import { relations } from 'drizzle-orm';
import { return_requests } from 'src/modules/return_requests/db/return_requests.db';
import { customers } from './customers.db';

export const customerRelations = relations(customers, ({ many }) => ({
  return_requests: many(return_requests),
}));

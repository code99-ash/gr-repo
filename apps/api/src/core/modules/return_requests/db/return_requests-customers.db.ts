import { relations } from 'drizzle-orm';
import { customers } from 'src/core/modules/customers/db/customers.db';
import { return_requests } from './return_requests.db';

export const returnRequestCustomersRelations = relations(
  return_requests,
  ({ one }) => ({
    customer: one(customers, {
      fields: [return_requests.customer_uid],
      references: [customers.uid],
    }),
  }),
);

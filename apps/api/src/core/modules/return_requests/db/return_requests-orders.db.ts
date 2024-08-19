import { relations } from 'drizzle-orm';
import { orders } from 'src/core/modules/orders/db/orders.db';
import { return_requests } from './return_requests.db';

export const singleReturnRequestOrdersRelations = relations(
  return_requests,
  ({ one }) => ({
    order: one(orders, {
      fields: [return_requests.uid],
      references: [orders.uid],
    }),
  }),
);

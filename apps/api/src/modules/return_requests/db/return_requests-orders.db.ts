import { relations } from 'drizzle-orm';
import { orders } from 'src/modules/orders/db/orders.db';

export const singleReturnRequestOrdersRelations = relations(
  orders,
  ({ one }) => ({
    order: one(orders),
  }),
);

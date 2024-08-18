import { relations } from 'drizzle-orm';
import { orders } from './orders.db';
import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { customers } from '../../customers/db/customers.db';

export const manyOrdersCustomersRelations = relations(orders, ({ many }) => ({
  ordersToCustomers: many(ordersToCustomers),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  ordersToCustomers: many(ordersToCustomers),
}));

export const ordersToCustomers = pgTable(
  'orders_to_customers',
  {
    order_uid: text('order_uid')
      .notNull()
      .references(() => orders.uid),
    customer_uid: text('customer_uid')
      .notNull()
      .references(() => customers.uid),
  },
  (t) => ({
    primaryKey: primaryKey({ columns: [t.order_uid, t.customer_uid] }),
  }),
);

export const ordersToCustomersRelations = relations(
  ordersToCustomers,
  ({ one }) => ({
    orders: one(orders, {
      fields: [ordersToCustomers.order_uid],
      references: [orders.uid],
    }),
    user: one(customers, {
      fields: [ordersToCustomers.customer_uid],
      references: [customers.uid],
    }),
  }),
);

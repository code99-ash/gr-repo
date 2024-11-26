import { relations } from 'drizzle-orm';
import { orders } from './orders.db';
import { pgTable, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { products } from '../../products/db/products.db';

export const manyOrdersProductRelations = relations(orders, ({ many }) => ({
  ordersToProducts: many(ordersToProducts),
}));

export const productsRelations = relations(products, ({ many }) => ({
  ordersToProducts: many(ordersToProducts),
}));

export const ordersToProducts = pgTable(
  'orders_to_products',
  {
    order_id: varchar('order_id')
      .notNull()
      .references(() => orders.id, {onDelete: 'cascade'}),
    product_id: varchar('product_id')
      .notNull()
      .references(() => products.uid, {onDelete: 'cascade'}),
  },
  (t) => ({
    primaryKey: primaryKey({ columns: [t.order_id, t.product_id] }),
  }),
);

export const ordersToProductsRelations = relations(
  ordersToProducts,
  ({ one }) => ({
    orders: one(orders, {
      fields: [ordersToProducts.order_id],
      references: [orders.uid],
    }),
    products: one(products, {
      fields: [ordersToProducts.product_id],
      references: [products.uid],
    }),
  }),
);

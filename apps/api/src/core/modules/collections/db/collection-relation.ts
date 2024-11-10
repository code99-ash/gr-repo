import { relations } from 'drizzle-orm';
import { collections } from './collections.db';
import { stores } from '../../stores/db/stores.db';
import { collectionOnProducts } from './collections-products.db';
import { products } from '../../products/db/products.db';

export const collectionRelations = relations(collections, ({ one, many }) => ({
  store: one(stores, {
    fields: [collections.store_uid],
    references: [stores.uid],
  }),

  collection_products: many(collectionOnProducts),
}));

export const collectionOnProductsRelation = relations(collectionOnProducts, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionOnProducts.collection_id],
        references: [collections.id]
    }),
    products: one(products, {
        fields: [collectionOnProducts.product_id],
        references: [products.id]
    })
}))

export const productRelations = relations(products, ({ many }) => ({
  collection_products: many(collectionOnProducts)
}))
import { relations } from 'drizzle-orm';
import { collections } from './collections.db';
import { stores } from '../../stores/db/stores.db';
import { collectionOnProducts } from './collections-products.db';
import { products } from '../../products/db/products.db';
import { collectionOnPolicies } from './collection-policies.db';
import { policies } from '../../policies/db/policies.db';
import { productsOnpolicies } from 'src/common/db/schemas';

export const collectionRelations = relations(collections, ({ one, many }) => ({
  store: one(stores, {
    fields: [collections.store_uid],
    references: [stores.uid],
  }),
  collection_products: many(collectionOnProducts),
  collection_policies: many(collectionOnPolicies)
}));

export const collectionOnProductsRelation = relations(collectionOnProducts, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionOnProducts.collection_id],
        references: [collections.id]
    }),
    product: one(products, {
        fields: [collectionOnProducts.product_id],
        references: [products.id]
    })
}))

export const collectionOnPoliciesRelation = relations(collectionOnPolicies, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionOnPolicies.collection_id],
        references: [collections.id]
    }),
    policies: one(policies, {
      fields: [collectionOnPolicies.policy_uid],
      references: [policies.uid]
    })
}))


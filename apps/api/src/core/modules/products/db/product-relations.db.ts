import { relations } from "drizzle-orm";
import { products } from "./products.db";
import { productsOnpolicies } from "./products-policies.db";
import { policies } from "src/common/db/schemas";
import { collectionOnProducts } from '../../collections/db/collections-products.db';

export const productRelations = relations(products, ({ many }) => ({
    product_policies: many(productsOnpolicies),
    collection_products: many(collectionOnProducts)
}));
  
export const productsOnpoliciesRelation = relations(productsOnpolicies, ({ one }) => ({
    policy: one(policies, {
        fields: [productsOnpolicies.policy_uid],
        references: [policies.uid]
    }),
    product: one(products, {
        fields: [productsOnpolicies.product_id],
        references: [products.id]
    })
}))

DROP TABLE "collection_to_policies";--> statement-breakpoint
ALTER TABLE "products_policies" DROP CONSTRAINT "products_policies_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products_policies" DROP CONSTRAINT "products_policies_policy_uid_policies_uid_fk";
--> statement-breakpoint
ALTER TABLE "collections_to_products" DROP CONSTRAINT "collections_to_products_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collections_to_products" DROP CONSTRAINT "collections_to_products_product_id_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_policies" ADD CONSTRAINT "products_policies_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_policies" ADD CONSTRAINT "products_policies_policy_uid_policies_uid_fk" FOREIGN KEY ("policy_uid") REFERENCES "public"."policies"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collections_to_products" ADD CONSTRAINT "collections_to_products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collections_to_products" ADD CONSTRAINT "collections_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "orders_to_products" DROP CONSTRAINT "orders_to_products_order_id_orders_uid_fk";
--> statement-breakpoint
ALTER TABLE "orders_to_products" DROP CONSTRAINT "orders_to_products_product_id_products_uid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_order_id_orders_uid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_product_id_products_uid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("uid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

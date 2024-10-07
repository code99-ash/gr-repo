DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."return_request_statuses" AS ENUM('submitted', 'in_review', 'approved', 'rejected', 'picked_up', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"organization_uid" text NOT NULL,
	"user_uid" text NOT NULL,
	"email" text NOT NULL,
	"type" "type" NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"password" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "accounts_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "customers_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"quantity" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"shipping_fee" integer NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"return_request_uid" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "orders_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_customers" (
	"order_uid" text NOT NULL,
	"customer_uid" text NOT NULL,
	CONSTRAINT "orders_to_customers_order_uid_customer_uid_pk" PRIMARY KEY("order_uid","customer_uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_to_products" (
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	CONSTRAINT "orders_to_products_order_id_product_id_pk" PRIMARY KEY("order_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"name" text NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "organizations_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "products_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "return_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"customer_uid" text,
	"shipping_fee" integer NOT NULL,
	"status" "return_request_statuses" DEFAULT 'submitted',
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "return_requests_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(256) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_organization_uid_organizations_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organizations"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_uid_users_uid_fk" FOREIGN KEY ("user_uid") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_return_request_uid_return_requests_uid_fk" FOREIGN KEY ("return_request_uid") REFERENCES "public"."return_requests"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_customers" ADD CONSTRAINT "orders_to_customers_order_uid_orders_uid_fk" FOREIGN KEY ("order_uid") REFERENCES "public"."orders"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_customers" ADD CONSTRAINT "orders_to_customers_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_order_id_orders_uid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_to_products" ADD CONSTRAINT "orders_to_products_product_id_products_uid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

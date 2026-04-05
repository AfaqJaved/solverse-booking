CREATE TYPE "public"."business_plan" AS ENUM('free', 'starter', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."business_status" AS ENUM('pending_verification', 'active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(16),
	"timezone" varchar(100) NOT NULL,
	"status" "business_status" DEFAULT 'pending_verification' NOT NULL,
	"plan" "business_plan" DEFAULT 'free' NOT NULL,
	"currency" varchar(3) NOT NULL,
	"logo_url" text,
	"description" varchar(500),
	"website" text,
	"suspended_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "businesses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
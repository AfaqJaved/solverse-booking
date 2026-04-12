CREATE TYPE "public"."timeoff_cadence" AS ENUM('once', 'daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."timeoff_status" AS ENUM('active', 'cancelled');--> statement-breakpoint
CREATE TABLE "timeoffs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"business_id" uuid NOT NULL,
	"label" varchar(200) NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"cadence" timeoff_cadence DEFAULT 'once' NOT NULL,
	"status" timeoff_status DEFAULT 'active' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"start_time" varchar(5),
	"end_time" varchar(5),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timeoffs" ADD CONSTRAINT "timeoffs_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;
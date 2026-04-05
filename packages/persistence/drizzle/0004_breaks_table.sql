CREATE TABLE "breaks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"working_hours_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "breaks" ADD CONSTRAINT "breaks_working_hours_id_working_hours_id_fk" FOREIGN KEY ("working_hours_id") REFERENCES "public"."working_hours"("id") ON DELETE no action ON UPDATE no action;
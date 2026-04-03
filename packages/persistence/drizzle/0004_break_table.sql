CREATE TABLE "breaks" (
  "id"               uuid PRIMARY KEY,
  "working_hours_id" uuid NOT NULL REFERENCES "working_hours"("id"),
  "start_time"       varchar(5) NOT NULL,
  "end_time"         varchar(5) NOT NULL,
  "created_at"       timestamp NOT NULL DEFAULT now(),
  "created_by"       uuid REFERENCES "users"("id"),
  "updated_at"       timestamp NOT NULL DEFAULT now(),
  "updated_by"       uuid REFERENCES "users"("id"),
  "deleted_at"       timestamp,
  "deleted_by"       uuid REFERENCES "users"("id"),
  "is_deleted"       boolean NOT NULL DEFAULT false
);

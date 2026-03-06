CREATE TABLE "friendships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_one_id" uuid NOT NULL,
	"user_two_id" uuid NOT NULL,
	"status" text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"timezone" text DEFAULT 'UTC',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weekly_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"week_start_date" text NOT NULL,
	"planned_days" integer[] NOT NULL,
	CONSTRAINT "day_range" CHECK (0 <= ALL("weekly_schedules"."planned_days") AND 6 >= ALL("weekly_schedules"."planned_days"))
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"schedule_id" integer,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"local_date" text NOT NULL,
	"recorded_timezone" text NOT NULL,
	"muscles_worked" text[],
	CONSTRAINT "time_check" CHECK ("workouts"."start_time" < "workouts"."end_time")
);
--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_one_id_users_user_id_fk" FOREIGN KEY ("user_one_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_two_id_users_user_id_fk" FOREIGN KEY ("user_two_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_schedules" ADD CONSTRAINT "weekly_schedules_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_schedule_id_weekly_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."weekly_schedules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_friendship" ON "friendships" USING btree ("user_one_id","user_two_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_week_idx" ON "weekly_schedules" USING btree ("user_id","week_start_date");--> statement-breakpoint
CREATE INDEX "workouts_user_date_idx" ON "workouts" USING btree ("user_id","local_date");
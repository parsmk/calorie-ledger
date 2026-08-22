CREATE TABLE "entry" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"consumed" integer NOT NULL,
	"burned" integer NOT NULL,
	"balance" integer GENERATED ALWAYS AS ("entry"."consumed" - "entry"."burned") STORED NOT NULL,
	CONSTRAINT "entry_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"age" integer NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
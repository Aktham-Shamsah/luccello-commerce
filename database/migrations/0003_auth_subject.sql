-- Preserve existing user subjects while removing the provider-specific column name.
ALTER TABLE "users" RENAME COLUMN "cognito_sub" TO "auth_subject";--> statement-breakpoint
ALTER INDEX "users_cognito_sub_idx" RENAME TO "users_auth_subject_idx";

CREATE TABLE `ai_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`original_text` text NOT NULL,
	`rewritten_text` text NOT NULL,
	`risk_highlights` text,
	`accepted_disclaimer` integer DEFAULT false,
	`exported` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`content` text NOT NULL,
	`prompt_used` text,
	`entry_type` text DEFAULT 'daily',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`legal_situation` text,
	`child_details` text,
	`emergency_contacts` text,
	`under_avo` integer,
	`onboarding_completed` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_user_id_unique` ON `profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `templates_used` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`template_type` text NOT NULL,
	`phase` text,
	`downloaded_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

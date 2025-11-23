export * from "./auth-schema";

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./auth-schema";

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  legalSituation: text("legal_situation"),
  childDetails: text("child_details"),
  emergencyContacts: text("emergency_contacts"),
  underAvo: integer("under_avo", { mode: "boolean" }),
  onboardingCompleted: integer("onboarding_completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const journalEntries = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  content: text("content").notNull(),
  promptUsed: text("prompt_used"),
  entryType: text("entry_type").default("daily"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const aiDrafts = sqliteTable("ai_drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  originalText: text("original_text").notNull(),
  rewrittenText: text("rewritten_text").notNull(),
  riskHighlights: text("risk_highlights"),
  acceptedDisclaimer: integer("accepted_disclaimer", { mode: "boolean" }).default(false),
  exported: integer("exported", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const templatesUsed = sqliteTable("templates_used", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  templateType: text("template_type").notNull(),
  phase: text("phase"),
  downloadedAt: text("downloaded_at").default(sql`(CURRENT_TIMESTAMP)`),
});




import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalPostsTable = pgTable("journal_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  authorName: text("author_name"),
  authorRole: text("author_role"),
  authorImageUrl: text("author_image_url"),
  imageUrl: text("image_url"),
  readTimeMinutes: integer("read_time_minutes"),
  tags: text("tags"),
  published: boolean("published").notNull().default(true),
  publishedAt: text("published_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertJournalPostSchema = createInsertSchema(journalPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;
export type JournalPost = typeof journalPostsTable.$inferSelect;

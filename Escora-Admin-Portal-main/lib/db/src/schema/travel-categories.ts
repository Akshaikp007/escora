import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const travelCategoriesTable = pgTable("travel_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  priceFrom: text("price_from"),
  priceLabel: text("price_label"),
  journeyCount: text("journey_count"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTravelCategorySchema = createInsertSchema(travelCategoriesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTravelCategory = z.infer<typeof insertTravelCategorySchema>;
export type TravelCategory = typeof travelCategoriesTable.$inferSelect;

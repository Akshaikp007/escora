import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
  shortDesc: text("short_desc"),
  durationNights: integer("duration_nights").notNull(),
  route: text("route"),
  bestFor: text("best_for"),
  season: text("season"),
  priceFrom: integer("price_from"),
  heroImageUrl: text("hero_image_url"),
  galleryImages: text("gallery_images"),
  itinerary: text("itinerary"),
  inclusions: text("inclusions"),
  exclusions: text("exclusions"),
  faqs: text("faqs"),
  accommodations: text("accommodations"),
  tags: text("tags"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPackageSchema = createInsertSchema(packagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packagesTable.$inferSelect;

import { pgTable, serial, text, boolean, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  region: text("region").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  shortDesc: text("short_desc"),
  imageUrl: text("image_url"),
  galleryImages: text("gallery_images"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  bestSeason: text("best_season"),
  elevation: text("elevation"),
  nightsMin: integer("nights_min"),
  nightsMax: integer("nights_max"),
  highlights: text("highlights"),
  howToReach: text("how_to_reach"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;

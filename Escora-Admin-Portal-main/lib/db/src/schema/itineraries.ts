import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const itinerariesTable = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  shareToken: text("share_token").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  title: text("title").notNull(),
  destination: text("destination"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  coverImageUrl: text("cover_image_url"),
  summary: text("summary"),
  days: text("days").notNull().default("[]"),
  stays: text("stays").notNull().default("[]"),
  inclusions: text("inclusions"),
  exclusions: text("exclusions"),
  pricing: text("pricing").notNull().default("{}"),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("draft"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertItinerarySchema = createInsertSchema(itinerariesTable).omit({
  id: true,
  shareToken: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itinerariesTable.$inferSelect;

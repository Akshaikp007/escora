import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id"),
  packageName: text("package_name"),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  travelStyle: text("travel_style"),
  destinations: text("destinations"),
  travelDate: text("travel_date"),
  departureDate: text("departure_date"),
  guestCount: integer("guest_count"),
  budgetRange: text("budget_range"),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("enquiry"),
  totalAmount: integer("total_amount"),
  notes: text("notes"),
  // Session / tracking metadata
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrerUrl: text("referrer_url"),
  landingPage: text("landing_page"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  browserLanguage: text("browser_language"),
  screenResolution: text("screen_resolution"),
  timezone: text("timezone"),
  geoCountry: text("geo_country"),
  geoRegion: text("geo_region"),
  geoCity: text("geo_city"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

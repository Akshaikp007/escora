import { Router, type IRouter } from "express";
import { db, destinationsTable, packagesTable, ordersTable, journalPostsTable, enquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/stats", async (_req, res): Promise<void> => {
  let destinations: typeof destinationsTable.$inferSelect[] = [];
  let packages: typeof packagesTable.$inferSelect[] = [];
  let orders: typeof ordersTable.$inferSelect[] = [];
  let journalPosts: typeof journalPostsTable.$inferSelect[] = [];
  let contactEnquiries: typeof enquiriesTable.$inferSelect[] = [];

  try {
    [destinations, packages, orders, journalPosts, contactEnquiries] = await Promise.all([
      db.select().from(destinationsTable),
      db.select().from(packagesTable),
      db.select().from(ordersTable),
      db.select().from(journalPostsTable),
      db.select().from(enquiriesTable),
    ]);
  } catch {
    // DB unavailable — return zeroed stats
  }

  const enquiries = orders.filter((o) => o.status === "enquiry").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const newContactEnquiries = contactEnquiries.filter((e) => e.status === "new").length;

  const recentOrders = orders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map(serializeDates);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  const stats = {
    totalDestinations: destinations.length,
    publishedDestinations: destinations.filter((d) => d.published).length,
    totalPackages: packages.length,
    publishedPackages: packages.filter((p) => p.published).length,
    totalOrders: orders.length,
    enquiries,
    confirmed,
    totalRevenue,
    newContactEnquiries,
    totalJournalPosts: journalPosts.length,
    publishedJournalPosts: journalPosts.filter((p) => p.published).length,
    recentOrders,
    ordersByStatus,
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

export default router;

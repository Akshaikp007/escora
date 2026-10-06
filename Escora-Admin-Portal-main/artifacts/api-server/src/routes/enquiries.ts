import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, enquiriesTable } from "@workspace/db";
import {
  ListEnquiriesQueryParams,
  ListEnquiriesResponse,
  CreateEnquiryBody,
  GetEnquiryParams,
  GetEnquiryResponse,
  UpdateEnquiryParams,
  UpdateEnquiryBody,
  UpdateEnquiryResponse,
  DeleteEnquiryParams,
} from "@workspace/api-zod";
import { sendContactConfirmation, sendAdminContactNotification } from "../lib/email";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [enquiry] = await db.insert(enquiriesTable).values(parsed.data).returning();
  const serialized = serializeDates(enquiry);

  // Send emails asynchronously — don't block the response
  Promise.all([
    sendContactConfirmation(enquiry),
    sendAdminContactNotification(enquiry),
  ]).catch(() => { /* non-fatal */ });

  res.status(201).json(GetEnquiryResponse.parse(serialized));
});

router.get("/enquiries", async (req, res): Promise<void> => {
  const query = ListEnquiriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.status) {
    conditions.push(eq(enquiriesTable.status, query.data.status));
  }

  try {
    const rows = conditions.length
      ? await db.select().from(enquiriesTable).where(and(...conditions)).orderBy(enquiriesTable.createdAt)
      : await db.select().from(enquiriesTable).orderBy(enquiriesTable.createdAt);
    res.json(ListEnquiriesResponse.parse(rows.map(serializeDates)));
  } catch {
    res.json([]);
  }
});

router.get("/enquiries/:id", async (req, res): Promise<void> => {
  const params = GetEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(enquiriesTable).where(eq(enquiriesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json(GetEnquiryResponse.parse(serializeDates(row)));
});

router.patch("/enquiries/:id", async (req, res): Promise<void> => {
  const params = UpdateEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(enquiriesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(enquiriesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json(UpdateEnquiryResponse.parse(serializeDates(row)));
});

router.delete("/enquiries/:id", async (req, res): Promise<void> => {
  const params = DeleteEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.delete(enquiriesTable).where(eq(enquiriesTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

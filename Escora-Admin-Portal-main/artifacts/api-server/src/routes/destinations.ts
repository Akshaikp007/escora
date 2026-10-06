import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, destinationsTable } from "@workspace/db";
import {
  ListDestinationsQueryParams,
  ListDestinationsResponse,
  CreateDestinationBody,
  GetDestinationParams,
  GetDestinationResponse,
  UpdateDestinationParams,
  UpdateDestinationBody,
  UpdateDestinationResponse,
  DeleteDestinationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/destinations", async (req, res): Promise<void> => {
  const query = ListDestinationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.type !== undefined) {
    conditions.push(eq(destinationsTable.type, query.data.type));
  }
  if (query.data.published !== undefined) {
    conditions.push(eq(destinationsTable.published, query.data.published));
  }

  try {
    const destinations = conditions.length
      ? await db.select().from(destinationsTable).where(and(...conditions)).orderBy(destinationsTable.name)
      : await db.select().from(destinationsTable).orderBy(destinationsTable.name);
    res.json(ListDestinationsResponse.parse(destinations.map(serializeDates)));
  } catch {
    res.json([]);
  }
});

router.post("/destinations", async (req, res): Promise<void> => {
  const parsed = CreateDestinationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dest] = await db.insert(destinationsTable).values(parsed.data).returning();
  res.status(201).json(GetDestinationResponse.parse(serializeDates(dest)));
});

router.get("/destinations/:id", async (req, res): Promise<void> => {
  const params = GetDestinationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dest] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, params.data.id));
  if (!dest) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }
  res.json(GetDestinationResponse.parse(serializeDates(dest)));
});

router.patch("/destinations/:id", async (req, res): Promise<void> => {
  const params = UpdateDestinationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateDestinationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dest] = await db
    .update(destinationsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(destinationsTable.id, params.data.id))
    .returning();
  if (!dest) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }
  res.json(UpdateDestinationResponse.parse(serializeDates(dest)));
});

router.delete("/destinations/:id", async (req, res): Promise<void> => {
  const params = DeleteDestinationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dest] = await db.delete(destinationsTable).where(eq(destinationsTable.id, params.data.id)).returning();
  if (!dest) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

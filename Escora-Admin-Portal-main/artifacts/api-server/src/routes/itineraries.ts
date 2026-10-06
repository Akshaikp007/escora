import { Router, type IRouter } from "express";
import { eq, type SQL } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, itinerariesTable } from "@workspace/db";
import {
  ListItinerariesQueryParams,
  ListItinerariesResponse,
  CreateItineraryBody,
  GetItineraryParams,
  GetItineraryResponse,
  GetItineraryByShareTokenParams,
  GetItineraryByShareTokenResponse,
  UpdateItineraryParams,
  UpdateItineraryBody,
  UpdateItineraryResponse,
  DeleteItineraryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/itineraries", async (req, res): Promise<void> => {
  const query = ListItinerariesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.status !== undefined) {
    conditions.push(eq(itinerariesTable.status, query.data.status));
  }

  try {
    const itineraries = conditions.length
      ? await db.select().from(itinerariesTable).where(conditions[0]).orderBy(itinerariesTable.createdAt)
      : await db.select().from(itinerariesTable).orderBy(itinerariesTable.createdAt);
    res.json(ListItinerariesResponse.parse(itineraries.map(serializeDates)));
  } catch {
    res.json([]);
  }
});

router.post("/itineraries", async (req, res): Promise<void> => {
  const parsed = CreateItineraryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [itinerary] = await db
    .insert(itinerariesTable)
    .values({ ...parsed.data, shareToken: nanoid() })
    .returning();
  res.status(201).json(GetItineraryResponse.parse(serializeDates(itinerary)));
});

router.get("/itineraries/share/:token", async (req, res): Promise<void> => {
  const params = GetItineraryByShareTokenParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [itinerary] = await db
      .select()
      .from(itinerariesTable)
      .where(eq(itinerariesTable.shareToken, params.data.token));
    if (!itinerary) {
      res.status(404).json({ error: "Itinerary not found" });
      return;
    }
    res.json(GetItineraryByShareTokenResponse.parse(serializeDates(itinerary)));
  } catch {
    res.status(404).json({ error: "Itinerary not found" });
  }
});

router.get("/itineraries/:id", async (req, res): Promise<void> => {
  const params = GetItineraryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [itinerary] = await db.select().from(itinerariesTable).where(eq(itinerariesTable.id, params.data.id));
    if (!itinerary) {
      res.status(404).json({ error: "Itinerary not found" });
      return;
    }
    res.json(GetItineraryResponse.parse(serializeDates(itinerary)));
  } catch {
    res.status(404).json({ error: "Itinerary not found" });
  }
});

router.patch("/itineraries/:id", async (req, res): Promise<void> => {
  const params = UpdateItineraryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateItineraryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [itinerary] = await db
    .update(itinerariesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(itinerariesTable.id, params.data.id))
    .returning();
  if (!itinerary) {
    res.status(404).json({ error: "Itinerary not found" });
    return;
  }
  res.json(UpdateItineraryResponse.parse(serializeDates(itinerary)));
});

router.delete("/itineraries/:id", async (req, res): Promise<void> => {
  const params = DeleteItineraryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [itinerary] = await db.delete(itinerariesTable).where(eq(itinerariesTable.id, params.data.id)).returning();
  if (!itinerary) {
    res.status(404).json({ error: "Itinerary not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

import { Router, type IRouter } from "express";
import { eq, and, asc, type SQL } from "drizzle-orm";
import { db, travelCategoriesTable } from "@workspace/db";
import {
  ListTravelCategoriesQueryParams,
  ListTravelCategoriesResponse,
  CreateTravelCategoryBody,
  GetTravelCategoryParams,
  GetTravelCategoryResponse,
  UpdateTravelCategoryParams,
  UpdateTravelCategoryBody,
  UpdateTravelCategoryResponse,
  DeleteTravelCategoryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/travel-categories", async (req, res): Promise<void> => {
  const query = ListTravelCategoriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.published !== undefined) {
    conditions.push(eq(travelCategoriesTable.published, query.data.published));
  }

  const categories = conditions.length
    ? await db.select().from(travelCategoriesTable).where(and(...conditions)).orderBy(asc(travelCategoriesTable.sortOrder), asc(travelCategoriesTable.label))
    : await db.select().from(travelCategoriesTable).orderBy(asc(travelCategoriesTable.sortOrder), asc(travelCategoriesTable.label));

  res.json(ListTravelCategoriesResponse.parse(categories.map(serializeDates)));
});

router.post("/travel-categories", async (req, res): Promise<void> => {
  const parsed = CreateTravelCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [cat] = await db.insert(travelCategoriesTable).values(parsed.data).returning();
  res.status(201).json(GetTravelCategoryResponse.parse(serializeDates(cat)));
});

router.get("/travel-categories/:id", async (req, res): Promise<void> => {
  const params = GetTravelCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cat] = await db.select().from(travelCategoriesTable).where(eq(travelCategoriesTable.id, params.data.id));
  if (!cat) {
    res.status(404).json({ error: "Travel category not found" });
    return;
  }
  res.json(GetTravelCategoryResponse.parse(serializeDates(cat)));
});

router.patch("/travel-categories/:id", async (req, res): Promise<void> => {
  const params = UpdateTravelCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTravelCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [cat] = await db
    .update(travelCategoriesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(travelCategoriesTable.id, params.data.id))
    .returning();
  if (!cat) {
    res.status(404).json({ error: "Travel category not found" });
    return;
  }
  res.json(UpdateTravelCategoryResponse.parse(serializeDates(cat)));
});

router.delete("/travel-categories/:id", async (req, res): Promise<void> => {
  const params = DeleteTravelCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cat] = await db.delete(travelCategoriesTable).where(eq(travelCategoriesTable.id, params.data.id)).returning();
  if (!cat) {
    res.status(404).json({ error: "Travel category not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

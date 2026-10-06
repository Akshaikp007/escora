import { Router, type IRouter } from "express";
import { eq, and, like, type SQL } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import {
  ListJournalPostsQueryParams,
  ListJournalPostsResponse,
  CreateJournalPostBody,
  GetJournalPostParams,
  GetJournalPostResponse,
  UpdateJournalPostParams,
  UpdateJournalPostBody,
  UpdateJournalPostResponse,
  DeleteJournalPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/journal", async (req, res): Promise<void> => {
  const query = ListJournalPostsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.category !== undefined) {
    conditions.push(eq(journalPostsTable.category, query.data.category));
  }
  if (query.data.published !== undefined) {
    conditions.push(eq(journalPostsTable.published, query.data.published));
  }
  if (query.data.tag !== undefined) {
    conditions.push(like(journalPostsTable.tags, `%${query.data.tag}%`));
  }

  try {
    const posts = conditions.length
      ? await db.select().from(journalPostsTable).where(and(...conditions)).orderBy(journalPostsTable.createdAt)
      : await db.select().from(journalPostsTable).orderBy(journalPostsTable.createdAt);
    res.json(ListJournalPostsResponse.parse(posts.map(serializeDates)));
  } catch {
    res.json([]);
  }
});

router.post("/journal", async (req, res): Promise<void> => {
  const parsed = CreateJournalPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.insert(journalPostsTable).values(parsed.data).returning();
  res.status(201).json(GetJournalPostResponse.parse(serializeDates(post)));
});

router.get("/journal/:id", async (req, res): Promise<void> => {
  const params = GetJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.select().from(journalPostsTable).where(eq(journalPostsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Journal post not found" });
    return;
  }
  res.json(GetJournalPostResponse.parse(serializeDates(post)));
});

router.patch("/journal/:id", async (req, res): Promise<void> => {
  const params = UpdateJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateJournalPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .update(journalPostsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(journalPostsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Journal post not found" });
    return;
  }
  res.json(UpdateJournalPostResponse.parse(serializeDates(post)));
});

router.delete("/journal/:id", async (req, res): Promise<void> => {
  const params = DeleteJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.delete(journalPostsTable).where(eq(journalPostsTable.id, params.data.id)).returning();
  if (!post) {
    res.status(404).json({ error: "Journal post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

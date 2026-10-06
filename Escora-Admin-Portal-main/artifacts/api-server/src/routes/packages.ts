import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, packagesTable } from "@workspace/db";
import {
  ListPackagesQueryParams,
  ListPackagesResponse,
  CreatePackageBody,
  GetPackageParams,
  GetPackageResponse,
  UpdatePackageParams,
  UpdatePackageBody,
  UpdatePackageResponse,
  DeletePackageParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends { createdAt: Date; updatedAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

router.get("/packages", async (req, res): Promise<void> => {
  const query = ListPackagesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (query.data.category !== undefined) {
    conditions.push(eq(packagesTable.category, query.data.category));
  }
  if (query.data.published !== undefined) {
    conditions.push(eq(packagesTable.published, query.data.published));
  }
  if (query.data.featured !== undefined) {
    conditions.push(eq(packagesTable.featured, query.data.featured));
  }

  try {
    const packages = conditions.length
      ? await db.select().from(packagesTable).where(and(...conditions)).orderBy(packagesTable.name)
      : await db.select().from(packagesTable).orderBy(packagesTable.name);
    res.json(ListPackagesResponse.parse(packages.map(serializeDates)));
  } catch {
    res.json([]);
  }
});

router.post("/packages", async (req, res): Promise<void> => {
  const parsed = CreatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [pkg] = await db.insert(packagesTable).values(parsed.data).returning();
  res.status(201).json(GetPackageResponse.parse(serializeDates(pkg)));
});

router.get("/packages/:id", async (req, res): Promise<void> => {
  const params = GetPackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [pkg] = await db.select().from(packagesTable).where(eq(packagesTable.id, params.data.id));
    if (!pkg) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json(GetPackageResponse.parse(serializeDates(pkg)));
  } catch {
    res.status(404).json({ error: "Package not found" });
  }
});

router.patch("/packages/:id", async (req, res): Promise<void> => {
  const params = UpdatePackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [pkg] = await db
    .update(packagesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(packagesTable.id, params.data.id))
    .returning();
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.json(UpdatePackageResponse.parse(serializeDates(pkg)));
});

router.delete("/packages/:id", async (req, res): Promise<void> => {
  const params = DeletePackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [pkg] = await db.delete(packagesTable).where(eq(packagesTable.id, params.data.id)).returning();
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

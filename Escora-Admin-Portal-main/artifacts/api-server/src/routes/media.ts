import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { db, mediaTable } from "@workspace/db";
import {
  ListMediaResponse,
  DeleteMediaParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function serializeMediaDates<T extends { createdAt: Date }>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

router.get("/media", async (_req, res): Promise<void> => {
  const media = await db.select().from(mediaTable).orderBy(mediaTable.createdAt);
  res.json(ListMediaResponse.parse(media.map(serializeMediaDates)));
});

router.post("/media", async (req, res): Promise<void> => {
  const contentType = req.headers["content-type"] ?? "application/octet-stream";
  const filename = (req.headers["x-filename"] as string) || `upload-${Date.now()}`;
  const ext = path.extname(filename) || ".bin";
  const savedName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadsDir, savedName);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const buffer = Buffer.concat(chunks);
  fs.writeFileSync(filePath, buffer);

  const [media] = await db
    .insert(mediaTable)
    .values({
      filename,
      url: `/api/media/files/${savedName}`,
      mimeType: contentType,
      sizeBytes: buffer.length,
    })
    .returning();

  res.status(201).json(serializeMediaDates(media));
});

router.get("/media/files/:name", (req, res): void => {
  const name = req.params.name as string;
  if (!name || /[^a-zA-Z0-9.\-_]/.test(name)) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const filePath = path.join(uploadsDir, name);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.sendFile(filePath);
});

router.delete("/media/:id", async (req, res): Promise<void> => {
  const params = DeleteMediaParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [media] = await db.delete(mediaTable).where(eq(mediaTable.id, params.data.id)).returning();
  if (!media) {
    res.status(404).json({ error: "Media not found" });
    return;
  }
  const savedName = path.basename(media.url);
  const filePath = path.join(uploadsDir, savedName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  res.sendStatus(204);
});

export default router;

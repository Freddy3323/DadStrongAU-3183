import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { aiDrafts } from "../db/schema";

export const aiDraftsRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  
  .get("/", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");

    const drafts = await db
      .select()
      .from(aiDrafts)
      .where(eq(aiDrafts.userId, user.id))
      .orderBy(desc(aiDrafts.createdAt))
      .all();

    return c.json({ drafts });
  })

  .get("/:id", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");
    const id = c.req.param("id");

    const draft = await db
      .select()
      .from(aiDrafts)
      .where(eq(aiDrafts.id, id))
      .get();

    if (!draft || draft.userId !== user.id) {
      return c.json({ error: "Draft not found" }, 404);
    }

    return c.json({ draft });
  })

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        originalText: z.string().min(1),
        rewrittenText: z.string().min(1),
        riskHighlights: z.string().optional(),
        acceptedDisclaimer: z.boolean().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const db = c.get("db");
      const data = c.req.valid("json");

      const draft = await db
        .insert(aiDrafts)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          ...data,
        })
        .returning()
        .get();

      return c.json({ draft });
    }
  )

  .patch(
    "/:id",
    zValidator(
      "json",
      z.object({
        acceptedDisclaimer: z.boolean().optional(),
        exported: z.boolean().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const db = c.get("db");
      const id = c.req.param("id");
      const data = c.req.valid("json");

      const existing = await db
        .select()
        .from(aiDrafts)
        .where(eq(aiDrafts.id, id))
        .get();

      if (!existing || existing.userId !== user.id) {
        return c.json({ error: "Draft not found" }, 404);
      }

      await db
        .update(aiDrafts)
        .set(data)
        .where(eq(aiDrafts.id, id))
        .run();

      const updated = await db
        .select()
        .from(aiDrafts)
        .where(eq(aiDrafts.id, id))
        .get();

      return c.json({ draft: updated });
    }
  );

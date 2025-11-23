import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { journalEntries } from "../db/schema";

export const journalRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  
  .get("/", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");

    const entries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, user.id))
      .orderBy(desc(journalEntries.date))
      .all();

    return c.json({ entries });
  })

  .get("/:id", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");
    const id = c.req.param("id");

    const entry = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .get();

    if (!entry || entry.userId !== user.id) {
      return c.json({ error: "Entry not found" }, 404);
    }

    return c.json({ entry });
  })

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        content: z.string().min(1),
        promptUsed: z.string().optional(),
        entryType: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const db = c.get("db");
      const data = c.req.valid("json");

      const entry = await db
        .insert(journalEntries)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          ...data,
        })
        .returning()
        .get();

      return c.json({ entry });
    }
  )

  .patch(
    "/:id",
    zValidator(
      "json",
      z.object({
        content: z.string().min(1).optional(),
        promptUsed: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const db = c.get("db");
      const id = c.req.param("id");
      const data = c.req.valid("json");

      const existing = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, id))
        .get();

      if (!existing || existing.userId !== user.id) {
        return c.json({ error: "Entry not found" }, 404);
      }

      await db
        .update(journalEntries)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(journalEntries.id, id))
        .run();

      const updated = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, id))
        .get();

      return c.json({ entry: updated });
    }
  )

  .delete("/:id", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");
    const id = c.req.param("id");

    const existing = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .get();

    if (!existing || existing.userId !== user.id) {
      return c.json({ error: "Entry not found" }, 404);
    }

    await db.delete(journalEntries).where(eq(journalEntries.id, id)).run();

    return c.json({ success: true });
  });

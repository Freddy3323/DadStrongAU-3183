import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { profiles } from "../db/schema";

export const profileRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  
  .get("/", async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .get();

    return c.json({ profile });
  })

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        legalSituation: z.string().optional(),
        childDetails: z.string().optional(),
        emergencyContacts: z.string().optional(),
        underAvo: z.boolean().optional(),
        onboardingCompleted: z.boolean().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const db = c.get("db");
      const data = c.req.valid("json");

      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .get();

      if (existingProfile) {
        await db
          .update(profiles)
          .set(data)
          .where(eq(profiles.userId, user.id))
          .run();

        const updated = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, user.id))
          .get();

        return c.json({ profile: updated });
      }

      const newProfile = await db
        .insert(profiles)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          ...data,
        })
        .returning()
        .get();

      return c.json({ profile: newProfile });
    }
  );

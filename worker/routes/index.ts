import { Hono } from "hono";
import type { HonoContext } from "../types";
import { adminRoutes } from "./admin-routes";
import { aiRoutes } from "./ai-routes";
import { authRoutes } from "./auth-routes";
import { profileRoutes } from "./profile-routes";
import { journalRoutes } from "./journal-routes";
import { aiDraftsRoutes } from "./ai-drafts-routes";

export const apiRoutes = new Hono<HonoContext>()
.route("/admin", adminRoutes)
.route("/ai", aiRoutes)
.route("/auth", authRoutes)
.route("/profile", profileRoutes)
.route("/journals", journalRoutes)
.route("/drafts", aiDraftsRoutes)
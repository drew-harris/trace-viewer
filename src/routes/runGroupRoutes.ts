import { Hono } from "hono";
import { safeRoute } from "../safeRoute";
import { parseZipPath } from "../files";
import { MomenticTestSchema } from "../schemas";

export const runGroupRoutes = new Hono().get(
  "/",
  safeRoute((c) => {
    return parseZipPath(c.var.directory, "metadata.json", MomenticTestSchema);
  }),
);

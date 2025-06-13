import { Hono } from "hono";
import { safeRoute } from "../safeRoute";
import { parseZipPath } from "../files";
import { errAsync } from "neverthrow";
import { attemptSchema } from "../schemas/attempts";
import { MomenticTestSchema } from "../schemas/testGroup";

export const runGroupRoutes = new Hono()
  .get(
    "/",
    safeRoute((c) => {
      return parseZipPath(c.var.directory, "metadata.json", MomenticTestSchema);
    }, undefined),
  )
  .get(
    "/attempt/:id",
    safeRoute((c) => {
      const attemptId = c.req.param("id");
      if (!attemptId) {
        return errAsync(new Error("No Attempt ID Given"));
      }
      return parseZipPath(
        c.var.directory,
        `attempts/${attemptId}/metadata.json`,
        attemptSchema,
      );
    }),
  );

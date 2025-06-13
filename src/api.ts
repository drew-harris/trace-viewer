import { Hono } from "hono";
import type { CentralDirectory } from "unzipper";
import { runGroupRoutes } from "./routes/runGroupRoutes";

export type ApiType = typeof api;

export const api = (directory: CentralDirectory) =>
  new Hono()
    .basePath("/api")
    // Logging middleware
    .use((c, next) => {
      console.log("Request received:", c.req.url.toString());
      c.set("directory", directory);
      return next();
    })
    .onError((err, c) => {
      console.error(err);
      if (err instanceof Error) {
        return c.json({ error: err.message }, 500);
      } else {
        return c.json({ error: "Unknown error" }, 500);
      }
    })
    .get("/test", async (c) => {
      const directory = c.get("directory");
      console.log("Directory:", directory);
      return c.json({ hello: "world" });
    })
    .route("/runGroup", runGroupRoutes);

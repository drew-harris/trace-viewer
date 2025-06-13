import { Hono } from "hono";
import type { CentralDirectory } from "unzipper";
import { runGroupRoutes } from "./routes/runGroupRoutes";

export type ApiType = ReturnType<typeof api>;

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
      return c.json({ hello: "world" });
    })
    .get("/snapshot/:id/:step/:filename", async (c) => {
      const directory = c.get("directory");
      const id = c.req.param("id");
      const step = c.req.param("step");
      const filename = c.req.param("filename");
      console.log(id, step, filename);
      const file = directory.files.find(
        (f) => f.path === `attempts/${id}/steps/${step}/${filename}`,
      );
      if (!file) {
        c.status(404);
        return c.json({ error: "File not found" }, 500);
      }

      const textContent = (await file.buffer("text")).toString();

      return c.html(textContent);
    })
    .get("/image/:id/:step/:filename", async (c) => {
      console.log("image route");
      const directory = c.get("directory");
      const id = c.req.param("id");
      const step = c.req.param("step");
      const filename = c.req.param("filename");
      console.log(id, step, filename);
      const file = directory.files.find(
        (f) => f.path.includes(`/${step}/${filename}`),
      );
      if (!file) {
        c.status(404);
        return c.json({ error: "File not found" }, 500);
      }

      const buffer = await file.buffer();
      c.header("Content-Type", "image/jpeg");
      return c.body(buffer);
    })
    .route("/runGroup", runGroupRoutes);

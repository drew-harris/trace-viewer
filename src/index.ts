import { parseArgs } from "util";
import indexHtml from "../public/index.html";
import { parseZipPath, unzipFile } from "./files";
import { mustAsync } from "./errors";
import { MomenticTestSchema } from "./schemas";
import { serve } from "bun";
import { api } from "./api";
import open from "open";
import { unzip, type CentralDirectory } from "unzipper";

declare module "hono" {
  interface ContextVariableMap {
    directory: CentralDirectory;
  }
}

const { positionals } = parseArgs({
  allowPositionals: true,
});

if (!positionals[0]) {
  console.error("No file specified");
  process.exit(1);
}

const file = positionals[0];
const unzipped = await mustAsync(unzipFile(file));

const testRun = await parseZipPath(
  unzipped,
  "metadata.json",
  MomenticTestSchema,
);

serve({
  websocket: {
    message() {},
  },
  routes: {
    "/": indexHtml,
    "/api/**": async (req) => {
      return api(unzipped).fetch(req);
    },
    "/*": indexHtml,
  },
  fetch(req) {
    if (req.url.includes("/api/")) {
      return api(unzipped).fetch(req);
    }
    return new Response("Not found", { status: 404 });
  },
  port: 3000,
  development: process.env.NODE_ENV !== "production",
});

// Open the browser after server starts
await open("http://localhost:3000");

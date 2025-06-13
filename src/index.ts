import { parseArgs } from "util";
import indexHtml from "../public/index.html";
import { parseZipPath, unzipFile } from "./files";
import { mustAsync } from "./errors";
import { serve } from "bun";
import { api } from "./api";
import open from "open";
import { type CentralDirectory } from "unzipper";
import { MomenticTestSchema } from "./schemas/testGroup";

declare module "hono" {
  interface ContextVariableMap {
    directory: CentralDirectory;
  }
}

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    noOpen: {
      type: "boolean",
      short: "n",
      default: false,
    },
    noServer: {
      type: "boolean",
      short: "s",
      default: false,
    },
  },
});

if (!positionals[0]) {
  console.error("No file specified");
  process.exit(1);
}

const file = positionals[0];
const unzipped = await mustAsync(unzipFile(file));

// Sanity check that the metadata will parse
const result = await parseZipPath(
  unzipped,
  "metadata.json",
  MomenticTestSchema,
);
if (result.isErr()) {
  console.error(result.error);
  process.exit(1);
}

if (!values.noServer) {
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
}

// Open the browser after server starts
if (!values.noOpen && !values.noServer) {
  await open("http://localhost:3000");
}

import { parseArgs } from "util";
import { parseZipPath, unzipFile } from "./files";
import { mustAsync } from "./errors";
import { MomenticTestSchema } from "./schemas";

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

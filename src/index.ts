import { z } from "zod";
import { parseArgs } from "node:util";
import { sdks } from "@/sdk";
import { isValidPath } from "@/utils/path";
import { search } from "@/utils/search";
import { printAsTable } from "@/utils/output";
import type { SearchResult } from "@/types";

const argSchema = z.object({
  path: z.string(),
  fileName: z.string(),
});

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    path: {
      type: "string",
    },
    fileName: {
      type: "string",
      default: "Podfile.lock",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { path, fileName } = argSchema.parse(values);

if (!(await isValidPath(path))) {
  console.log(`The path "${path}" is not valid.`);
  process.exit(1);
}

console.log("\n\nSearching for SDKs in the path:", path);
const output = await Promise.allSettled(
  sdks.map((s) => search({ sdk: s, path, fileName }))
);

console.log("\n\nResults:");

const filteredOutput = output.filter(
  ({ status }) => status === "fulfilled"
) as PromiseFulfilledResult<SearchResult>[];

printAsTable(filteredOutput);

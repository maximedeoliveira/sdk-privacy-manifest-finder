import { $ } from "bun";
import { Spinner } from "@topcli/spinner";
import type { SearchResult } from "@/types";

type SearchParams = {
  sdk: string;
  path: string;
  fileName: string;
};

export const search = async ({
  sdk,
  path,
  fileName,
}: SearchParams): Promise<SearchResult> => {
  const spinner = new Spinner().start("Start working!", {
    withPrefix: `[${sdk}] `,
  });

  spinner.text = "Work in progress...";

  try {
    const output: string[] = [];
    for await (let line of $`grep --include=${fileName} -Rw '${path}' -e '${sdk}'`.lines()) {
      const splittedLine = line.split(":");

      if (!output.includes(splittedLine[0]) && splittedLine[0] !== "") {
        output.push(splittedLine[0]);
      }
    }

    spinner.succeed(`Search done in ${spinner.elapsedTime.toFixed(2)}ms !`);

    return { sdk, results: output };
  } catch (error) {
    spinner.failed("Something wrong happened !");

    return { sdk, results: [] };
  }
};

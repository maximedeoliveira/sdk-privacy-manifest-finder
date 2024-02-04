import { Table } from "console-table-printer";
import type { SearchResult } from "@/types";

export const printAsTable = (
  results: PromiseFulfilledResult<SearchResult>[]
) => {
  const table = new Table({
    columns: [
      { name: "sdk", title: "SDK", alignment: "left" },
      { name: "location", title: "Location", alignment: "left" },
    ],
  });

  results.forEach(({ value }) => {
    value.results.forEach((location) => {
      table.addRow({ sdk: value.sdk, location });
    });
  });

  table.printTable();
};

import { $ } from "bun";

export const isValidPath = async (path: string) => {
  const res = await $`[ -d "${path}" ] && echo "true" || echo "false";`.text();

  return res.includes("true");
};

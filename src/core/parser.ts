import type { ParsedInput } from "@/core/types";

export function parse(raw: string): ParsedInput {
  const trimmed = raw.trim();
  if (trimmed === "") return { raw, name: "", args: [] };
  const [first, ...args] = trimmed.split(/\s+/);
  return { raw, name: first.toLowerCase(), args };
}

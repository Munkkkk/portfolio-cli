import type { Command } from "@/core/types";

export const clearCommand: Command = {
  name: "clear",
  description: "Clear the terminal",
  run: (_args, ctx) => {
    ctx.clear();
    return null;
  },
};

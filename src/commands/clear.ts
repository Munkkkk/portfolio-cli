import type { Command } from "@/core/types";

export const clearCommand: Command = {
  name: "clear",
  description: "Effacer le terminal",
  run: (_args, ctx) => {
    ctx.clear();
    return null;
  },
};

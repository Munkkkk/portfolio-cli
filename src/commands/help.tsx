import type { Command } from "@/core/types";

export const helpCommand: Command = {
  name: "help",
  description: "List available commands",
  run: (_args, ctx) => (
    <ul>
      {ctx.commands.map((c) => (
        <li key={c.name}>
          <strong>{c.name}</strong> - {c.description}
        </li>
      ))}
    </ul>
  ),
};

import { createElement } from "react";
import type {
  Command,
  CommandContext,
  CommandOutput,
  ParsedInput,
} from "@/core/types";

export interface Registry {
  list(): readonly Command[];
  execute(input: ParsedInput, ctx: CommandContext): CommandOutput;
}

function errorLine(text: string): CommandOutput {
  return createElement("span", { className: "text-error" }, text);
}

export function createRegistry(commands: Command[]): Registry {
  const byName = new Map<string, Command>();
  for (const cmd of commands) {
    if (byName.has(cmd.name)) {
      throw new Error(`Duplicate command name: ${cmd.name}`);
    }
    byName.set(cmd.name, cmd);
  }
  const ordered: readonly Command[] = [...commands];

  return {
    list: () => ordered,
    execute(input, ctx) {
      if (input.name === "") return null;
      const cmd = byName.get(input.name);
      if (!cmd) {
        return errorLine(
          `command not found: ${input.name}. Type "help" to see available commands.`,
        );
      }
      try {
        return cmd.run(input.args, ctx);
      } catch {
        return errorLine(`error: ${input.name} failed`);
      }
    },
  };
}

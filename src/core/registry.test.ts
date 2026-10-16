import { describe, it, expect, vi } from "vitest";
import { parse } from "@/core/parser";
import { createRegistry } from "@/core/registry";
import type { Command, CommandContext } from "@/core/types";
import { renderOutput } from "@/test/renderOutput";

const echo: Command = {
  name: "echo",
  description: "echo args",
  run: (args) => args.join(" "),
};
const boom: Command = {
  name: "boom",
  description: "throws",
  run: () => {
    throw new Error("kaboom");
  },
};
const ctx: CommandContext = { commands: [], clear: vi.fn() };

describe("createRegistry", () => {
  it("throws on duplicate command names", () => {
    expect(() => createRegistry([echo, echo])).toThrow(/echo/);
  });

  it("throws on non-lowercase command names", () => {
    expect(() => createRegistry([{ ...echo, name: "Echo" }])).toThrow(/lowercase/);
  });

  it("lists commands in order", () => {
    expect(createRegistry([echo, boom]).list()).toEqual([echo, boom]);
  });

  it("executes a known command", () => {
    expect(createRegistry([echo, boom]).execute(parse("echo a b"), ctx)).toBe("a b");
  });

  it("returns null for empty input", () => {
    expect(createRegistry([echo, boom]).execute(parse(""), ctx)).toBeNull();
  });

  it("renders command-not-found for unknown commands", () => {
    const out = createRegistry([echo, boom]).execute(parse("nope"), ctx);
    const { container } = renderOutput(out);
    expect(container.textContent).toContain(
      'command not found: nope. Type "help" to see available commands.',
    );
  });

  it("catches errors thrown by a command", () => {
    const reg = createRegistry([echo, boom]);
    let out: ReturnType<typeof reg.execute>;
    expect(() => {
      out = reg.execute(parse("boom"), ctx);
    }).not.toThrow();
    const { container } = renderOutput(out!);
    expect(container.textContent).toContain("error: boom failed");
  });
});

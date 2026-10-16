import { describe, it, expect } from "vitest";
import { parse } from "@/core/parser";

describe("parse", () => {
  it("parses a bare command", () => {
    expect(parse("help")).toEqual({ raw: "help", name: "help", args: [] });
  });
  it("trims and lowercases the name", () => {
    expect(parse("  HELP  ")).toEqual({ raw: "  HELP  ", name: "help", args: [] });
  });
  it("splits args on whitespace and keeps their case", () => {
    expect(parse("experience   2  Foo")).toEqual({
      raw: "experience   2  Foo",
      name: "experience",
      args: ["2", "Foo"],
    });
  });
  it("handles empty input", () => {
    expect(parse("")).toEqual({ raw: "", name: "", args: [] });
  });
  it("handles whitespace-only input", () => {
    expect(parse("   ")).toEqual({ raw: "   ", name: "", args: [] });
  });
});

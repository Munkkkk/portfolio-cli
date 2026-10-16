import { describe, it, expect, vi } from "vitest";
import { renderOutput } from "@/test/renderOutput";
import type { CommandContext } from "@/core/types";
import { commands } from "./index";
import { profile } from "@/content/profile";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { education } from "@/content/education";

function setup() {
  const ctx: CommandContext = { commands, clear: vi.fn() };
  const run = (name: string, args: string[] = []) => {
    const cmd = commands.find((c) => c.name === name);
    if (!cmd) throw new Error(`missing ${name}`);
    return cmd.run(args, ctx);
  };
  return { ctx, run };
}

describe("commands registry", () => {
  it("has the 8 commands in order, unique, described", () => {
    expect(commands.map((c) => c.name)).toEqual([
      "help", "about", "experience", "projects", "skills", "education", "contact", "clear",
    ]);
    expect(new Set(commands.map((c) => c.name)).size).toBe(commands.length);
    commands.forEach((c) => expect(c.description.length).toBeGreaterThan(0));
  });
  it("experience usage", () => {
    expect(commands.find((c) => c.name === "experience")?.usage).toBe("experience [n]");
  });
});

describe("outputs", () => {
  it("help lists names and descriptions", () => {
    const { run } = setup();
    const { container } = renderOutput(run("help"));
    commands.forEach((c) => {
      expect(container.textContent).toContain(c.name);
      expect(container.textContent).toContain(c.description);
    });
  });
  it("about", () => {
    const { run } = setup();
    const { container } = renderOutput(run("about"));
    expect(container.textContent).toContain(profile.name);
    expect(container.textContent).toContain(profile.title);
  });
  it("about ignores extra args", () => {
    const { run } = setup();
    const a = renderOutput(run("about")).container.innerHTML;
    const b = renderOutput(run("about", ["extra"])).container.innerHTML;
    expect(b).toBe(a);
  });
  it("experience lists all", () => {
    const { run } = setup();
    const { container } = renderOutput(run("experience"));
    experiences.forEach((e) => {
      expect(container.textContent).toContain(e.role);
      expect(container.textContent).toContain(e.company);
    });
  });
  it("experience 1 shows detail only", () => {
    const { run } = setup();
    const { container } = renderOutput(run("experience", ["1"]));
    expect(container.textContent).toContain(experiences[0].highlights[0]);
    expect(container.textContent).not.toContain(experiences[1].company);
  });
  it.each(["0", "-1", "abc", "99"])("experience %s shows usage", (arg) => {
    const { run } = setup();
    const { container } = renderOutput(run("experience", [arg]));
    expect(container.textContent).toContain("experience [n]");
  });
  it("projects", () => {
    const { run } = setup();
    const { container } = renderOutput(run("projects"));
    projects.forEach((p) => expect(container.textContent).toContain(p.name));
  });
  it("skills", () => {
    const { run } = setup();
    const { container } = renderOutput(run("skills"));
    skills.forEach((s) => expect(container.textContent).toContain(s.category));
  });
  it("education", () => {
    const { run } = setup();
    const { container } = renderOutput(run("education"));
    education.forEach((e) => expect(container.textContent).toContain(e.degree));
  });
  it("contact has 3 safe links, mailto email", () => {
    const { run } = setup();
    const { container } = renderOutput(run("contact"));
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(3);
    links.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    });
    expect(links[0].getAttribute("href")).toMatch(/^mailto:/);
  });
  it("clear calls ctx.clear and returns null", () => {
    const { ctx, run } = setup();
    expect(run("clear")).toBeNull();
    expect(ctx.clear).toHaveBeenCalledTimes(1);
  });
});

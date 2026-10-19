import { describe, it, expect, vi } from "vitest";
import { renderOutput } from "@/test/renderOutput";
import type { CommandContext } from "@/core/types";
import { commands } from "./index";
import { profile } from "@/content/profile";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { education } from "@/content/education";
import { languages } from "@/content/languages";
import { interests, strengths } from "@/content/interests";
import { contact } from "@/content/contact";

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
  it("has the 10 commands in order, unique, described", () => {
    expect(commands.map((c) => c.name)).toEqual([
      "help", "about", "experience", "projects", "skills", "education", "languages", "interests", "contact", "clear",
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
  it("about shows name, title, bio, location and mobility", () => {
    const { run } = setup();
    const { container } = renderOutput(run("about"));
    [profile.name, profile.title, profile.bio, profile.location, profile.mobility].forEach((t) =>
      expect(container.textContent).toContain(t),
    );
  });
  it("about ignores extra args", () => {
    const { run } = setup();
    const a = renderOutput(run("about")).container.innerHTML;
    const b = renderOutput(run("about", ["extra"])).container.innerHTML;
    expect(b).toBe(a);
  });
  it("experience lists role, company, type and dates", () => {
    const { run } = setup();
    const { container } = renderOutput(run("experience"));
    experiences.forEach((e) => {
      expect(container.textContent).toContain(e.role);
      expect(container.textContent).toContain(e.company);
      if (e.type) expect(container.textContent).toContain(`(${e.type})`);
      expect(container.textContent).toContain(`${e.start} - ${e.end}`);
    });
  });
  it("experience 1 shows detail only, with type and stack", () => {
    const { run } = setup();
    const { container } = renderOutput(run("experience", ["1"]));
    expect(container.textContent).toContain(experiences[0].role);
    expect(container.textContent).toContain(experiences[0].company);
    experiences[0].highlights.forEach((h) => expect(container.textContent).toContain(h));
    expect(container.textContent).toContain(`${experiences[0].start} - ${experiences[0].end}`);
    expect(experiences[0].type).toBeTruthy();
    expect(container.textContent).toContain(`(${experiences[0].type})`);
    expect(experiences[0].stack?.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(experiences[0].stack!.join(", "));
    expect(container.textContent).not.toContain(experiences[1].company);
  });
  it("experience detail without stack omits the stack line", () => {
    const { run } = setup();
    const i = experiences.findIndex((e) => !e.stack);
    expect(i).toBeGreaterThanOrEqual(0);
    const { container } = renderOutput(run("experience", [String(i + 1)]));
    expect(container.textContent).not.toContain("Stack");
    experiences[i].highlights.forEach((h) => expect(container.textContent).toContain(h));
  });
  it.each(["0", "-1", "abc", "99"])("experience %s shows a clear error with usage", (arg) => {
    const { run } = setup();
    const { container } = renderOutput(run("experience", [arg]));
    expect(container.textContent).toContain("erreur : numéro d'expérience invalide");
    expect(container.textContent).toContain(`"${arg}"`);
    expect(container.textContent).toContain(`1-${experiences.length}`);
    expect(container.textContent).toContain("experience [n]");
    expect(container.querySelector(".text-error")).not.toBeNull();
  });
  it("projects shows description, stack and safe link", () => {
    const { run } = setup();
    const { container } = renderOutput(run("projects"));
    projects.forEach((p) => {
      expect(container.textContent).toContain(p.name);
      expect(container.textContent).toContain(p.description);
      expect(container.textContent).toContain(p.stack.join(", "));
    });
    const withUrl = projects.filter((p) => p.url);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(withUrl.length);
    links.forEach((a, i) => {
      expect(a.getAttribute("href")).toBe(withUrl[i].url);
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });
  it("skills shows category and every item", () => {
    const { run } = setup();
    const { container } = renderOutput(run("skills"));
    skills.forEach((s) => {
      expect(container.textContent).toContain(`${s.category} : ${s.items.join(", ")}`);
      s.items.forEach((i) => expect(container.textContent).toContain(i));
    });
  });
  it("education shows degree, school, years, type and mention", () => {
    const { run } = setup();
    const { container } = renderOutput(run("education"));
    education.forEach((e) => {
      expect(container.textContent).toContain(e.degree);
      expect(container.textContent).toContain(e.school);
      expect(container.textContent).toContain(`${e.start} - ${e.end}`);
      if (e.type) expect(container.textContent).toContain(`(${e.type})`);
      if (e.mention) expect(container.textContent).toContain(e.mention);
    });
    expect(education.some((e) => e.type)).toBe(true);
    expect(education.some((e) => e.mention)).toBe(true);
  });
  it("languages shows every name and level", () => {
    const { run } = setup();
    const { container } = renderOutput(run("languages"));
    languages.forEach((l) => {
      expect(container.textContent).toContain(l.name);
      expect(container.textContent).toContain(l.level);
    });
  });
  it("interests shows name, detail and strengths", () => {
    const { run } = setup();
    const { container } = renderOutput(run("interests"));
    interests.forEach((i) => {
      expect(container.textContent).toContain(i.name);
      expect(container.textContent).toContain(i.detail);
    });
    expect(container.textContent).toContain("Atouts");
    strengths.forEach((s) => expect(container.textContent).toContain(s));
  });
  it("contact has 2 safe external links, no mailto", () => {
    const { run } = setup();
    const { container } = renderOutput(run("contact"));
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect([...links].map((a) => a.getAttribute("href"))).toEqual([
      contact.github, contact.linktree,
    ]);
    links.forEach((a) => {
      expect(a.getAttribute("href")).not.toMatch(/^mailto:/);
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    });
    ["GitHub", "Linktree"].forEach((l) =>
      expect(container.textContent).toContain(`${l} : https://`),
    );
    expect(container.textContent).not.toMatch(/artstation/i);
  });
  it("clear calls ctx.clear and returns null", () => {
    const { ctx, run } = setup();
    expect(run("clear")).toBeNull();
    expect(ctx.clear).toHaveBeenCalledTimes(1);
  });
});

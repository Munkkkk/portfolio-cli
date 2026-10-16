// TODO: remplacer par vraies données
export interface SkillGroup { category: string; items: string[] }

export const skills: SkillGroup[] = [
  { category: "Frontend", items: ["TypeScript", "React", "Next.js", "CSS", "Accessibility"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "GraphQL", "Redis"] },
  { category: "Tooling", items: ["Git", "Docker", "GitHub Actions", "Vitest", "Playwright"] },
];

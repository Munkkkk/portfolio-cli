export interface SkillGroup { category: string; items: string[] }

export const skills: SkillGroup[] = [
  { category: "Front-end", items: ["React", "Vue.js"] },
  { category: "Back-end", items: ["Node.js", "Express.js", "Laravel"] },
  { category: "Langages", items: ["JavaScript", "TypeScript", "Java"] },
  { category: "Bases de données", items: ["MongoDB", "MySQL"] },
  { category: "Outils", items: ["Git", "Docker"] },
];

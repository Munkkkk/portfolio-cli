import type { Command } from "@/core/types";
import { skills } from "@/content/skills";

export const skillsCommand: Command = {
  name: "skills",
  description: "Compétences techniques",
  run: () => (
    <ul>
      {skills.map((s) => (
        <li key={`${s.category}-${s.items.join()}`}>
          <strong>{s.category}</strong> : {s.items.join(", ")}
        </li>
      ))}
    </ul>
  ),
};

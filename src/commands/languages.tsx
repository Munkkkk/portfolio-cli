import type { Command } from "@/core/types";
import { languages } from "@/content/languages";

export const languagesCommand: Command = {
  name: "languages",
  description: "Langues parlées",
  run: () => (
    <ul>
      {languages.map((l) => (
        <li key={l.name}>
          <strong>{l.name}</strong> ({l.level})
        </li>
      ))}
    </ul>
  ),
};

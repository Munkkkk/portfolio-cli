import type { Command } from "@/core/types";
import { education } from "@/content/education";

export const educationCommand: Command = {
  name: "education",
  description: "Education and degrees",
  run: () => (
    <ul>
      {education.map((e) => (
        <li key={e.degree}>
          <strong>{e.degree}</strong> - {e.school} ({e.start} - {e.end})
        </li>
      ))}
    </ul>
  ),
};

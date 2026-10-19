import type { Command } from "@/core/types";
import { education } from "@/content/education";

export const educationCommand: Command = {
  name: "education",
  description: "Formations",
  run: () => (
    <ul>
      {education.map((e) => (
        <li key={`${e.degree}-${e.school}-${e.start}`}>
          <strong>{e.degree}</strong> - {e.school}
          {e.type && <> ({e.type})</>} ({e.start} - {e.end})
          {e.mention && <> - {e.mention}</>}
        </li>
      ))}
    </ul>
  ),
};

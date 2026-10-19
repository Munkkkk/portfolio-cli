import type { Command } from "@/core/types";
import { projects } from "@/content/projects";

export const projectsCommand: Command = {
  name: "projects",
  description: "Projets",
  run: () => (
    <ul>
      {projects.map((p) => (
        <li key={`${p.name}-${p.url ?? ""}`}>
          <strong>{p.name}</strong> - {p.description}
          <br />
          Stack : {p.stack.join(", ")}
          {p.url && (
            <>
              <br />
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.url}
              </a>
            </>
          )}
        </li>
      ))}
    </ul>
  ),
};

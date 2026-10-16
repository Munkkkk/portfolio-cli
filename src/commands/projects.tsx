import type { Command } from "@/core/types";
import { projects } from "@/content/projects";

export const projectsCommand: Command = {
  name: "projects",
  description: "Selected projects",
  run: () => (
    <ul>
      {projects.map((p) => (
        <li key={`${p.name}-${p.url ?? ""}`}>
          <strong>{p.name}</strong> - {p.description}
          <br />
          Stack: {p.stack.join(", ")}
          {p.url && (
            <>
              <br />
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ overflowWrap: "anywhere" }}
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

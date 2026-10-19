import type { Command } from "@/core/types";
import { contact } from "@/content/contact";

const links = [
  { label: "GitHub", href: contact.github },
  { label: "Linktree", href: contact.linktree },
];

export const contactCommand: Command = {
  name: "contact",
  description: "GitHub et liens",
  run: () => (
    <ul>
      {links.map((l) => (
        <li key={l.label}>
          <strong>{l.label}</strong> :{" "}
          <a href={l.href} target="_blank" rel="noopener noreferrer">
            {l.href}
          </a>
        </li>
      ))}
    </ul>
  ),
};

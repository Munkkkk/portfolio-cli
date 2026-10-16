import type { Command } from "@/core/types";
import { contact } from "@/content/contact";

export const contactCommand: Command = {
  name: "contact",
  description: "Email, GitHub and LinkedIn",
  run: () => (
    <ul>
      <li>
        <strong>Email</strong>:{" "}
        <a href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </li>
      <li>
        <strong>GitHub</strong>:{" "}
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          {contact.github}
        </a>
      </li>
      <li>
        <strong>LinkedIn</strong>:{" "}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          {contact.linkedin}
        </a>
      </li>
    </ul>
  ),
};

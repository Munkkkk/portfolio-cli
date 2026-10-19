import type { Command } from "@/core/types";
import { experiences } from "@/content/experience";

const USAGE = "experience [n]";

export const experienceCommand: Command = {
  name: "experience",
  description: "Expériences (experience [n] pour le détail)",
  usage: USAGE,
  run: (args) => {
    if (args.length === 0) {
      return (
        <ul>
          {experiences.map((e, i) => (
            <li key={`${e.company}-${e.start}`}>
              {i + 1}. <strong>{e.role}</strong> @ {e.company}
              {e.type && <> ({e.type})</>} ({e.start} - {e.end})
            </li>
          ))}
        </ul>
      );
    }
    const n = Number(args[0]);
    if (!/^\d+$/.test(args[0]) || n < 1 || n > experiences.length) {
      return (
        <p className="text-error">
          erreur : numéro d&apos;expérience invalide &quot;{args[0]}&quot; (1-{experiences.length}).
          Usage : {USAGE}
        </p>
      );
    }
    const e = experiences[n - 1];
    return (
      <div>
        <strong>{e.role}</strong> @ {e.company}
        {e.type && <> ({e.type})</>} ({e.start} - {e.end})
        {e.stack && <p>Stack : {e.stack.join(", ")}</p>}
        <ul>
          {e.highlights.map((h) => (
            <li key={`${n}-${h}`}>{h}</li>
          ))}
        </ul>
      </div>
    );
  },
};

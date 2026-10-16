import type { Command } from "@/core/types";
import { experiences } from "@/content/experience";

const USAGE = "experience [n]";

export const experienceCommand: Command = {
  name: "experience",
  description: "Work experience (experience [n] for details)",
  usage: USAGE,
  run: (args) => {
    if (args.length === 0) {
      return (
        <ul>
          {experiences.map((e, i) => (
            <li key={`${e.company}-${e.start}`}>
              {i + 1}. <strong>{e.role}</strong> @ {e.company} ({e.start} - {e.end})
            </li>
          ))}
        </ul>
      );
    }
    const n = Number(args[0]);
    if (!/^\d+$/.test(args[0]) || n < 1 || n > experiences.length) {
      return (
        <p>
          error: invalid experience number &quot;{args[0]}&quot; (1-{experiences.length}).
          Usage: {USAGE}
        </p>
      );
    }
    const e = experiences[n - 1];
    return (
      <div>
        <strong>{e.role}</strong> @ {e.company} ({e.start} - {e.end})
        <ul>
          {e.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
    );
  },
};

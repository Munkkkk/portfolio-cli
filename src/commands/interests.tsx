import type { Command } from "@/core/types";
import { interests, strengths } from "@/content/interests";

export const interestsCommand: Command = {
  name: "interests",
  description: "Centres d'intérêt et atouts",
  run: () => (
    <div>
      <ul>
        {interests.map((i) => (
          <li key={i.name}>
            <strong>{i.name}</strong> - {i.detail}
          </li>
        ))}
      </ul>
      <p>
        <strong>Atouts</strong>
      </p>
      <ul>
        {strengths.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  ),
};

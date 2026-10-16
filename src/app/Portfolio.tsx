"use client";

import { createRegistry } from "@/core/registry";
import { commands } from "@/commands";
import { profile } from "@/content/profile";
import { Terminal } from "@/components/Terminal/Terminal";
import { Welcome } from "@/components/Terminal/Welcome";

const registry = createRegistry(commands);
const suggestions = ["help", "about", "experience", "projects", "contact"];

export function Portfolio() {
  return (
    <Terminal
      registry={registry}
      welcome={(run) => <Welcome name={profile.name} suggestions={suggestions} onRun={run} />}
    />
  );
}

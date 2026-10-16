import type { ReactNode } from "react";

export interface ParsedInput {
  raw: string;            // saisie brute
  name: string;           // premier mot, en minuscules ("" si vide)
  args: string[];         // mots suivants, casse conservée
}

export type CommandOutput = ReactNode;

export interface CommandContext {
  commands: readonly Command[]; // pour `help`
  clear: () => void;            // pour `clear`
}

export interface Command {
  name: string;                 // minuscules, unique
  description: string;          // une ligne, affichée par `help`
  usage?: string;               // ex. "experience [n]"
  run: (args: string[], ctx: CommandContext) => CommandOutput;
}

export interface HistoryEntry {
  id: number;
  input: string;                // ligne tapée (affichée avec le prompt)
  output: CommandOutput;
}

import type { Command } from "@/core/types";
import { helpCommand } from "./help";
import { aboutCommand } from "./about";
import { experienceCommand } from "./experience";
import { projectsCommand } from "./projects";
import { skillsCommand } from "./skills";
import { educationCommand } from "./education";
import { contactCommand } from "./contact";
import { clearCommand } from "./clear";

export const commands: Command[] = [
  helpCommand,
  aboutCommand,
  experienceCommand,
  projectsCommand,
  skillsCommand,
  educationCommand,
  contactCommand,
  clearCommand,
];

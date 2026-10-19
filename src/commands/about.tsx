import type { Command } from "@/core/types";
import { profile } from "@/content/profile";

export const aboutCommand: Command = {
  name: "about",
  description: "Qui je suis",
  run: () => (
    <div>
      <strong>{profile.name}</strong>
      <p>{profile.title}</p>
      <p>{profile.bio}</p>
      <p>{profile.location}</p>
      <p>{profile.mobility}</p>
    </div>
  ),
};

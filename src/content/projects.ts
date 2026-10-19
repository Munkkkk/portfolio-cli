export interface Project { name: string; description: string; stack: string[]; url?: string }

export const projects: Project[] = [
  {
    name: "portfolio-cli",
    description: "Portfolio interactif façon terminal : on tape des commandes pour découvrir le profil.",
    stack: ["TypeScript", "JavaScript", "CSS"],
    url: "https://github.com/Munkkkk/portfolio-cli",
  },
  {
    name: "f1-predictions",
    description: "Probabilités de titre pilotes F1, mises à jour après chaque Grand Prix (deux modèles LightGBM et simulations Monte Carlo de la fin de saison).",
    stack: ["Python", "HTML"],
    url: "https://github.com/Munkkkk/f1-predictions",
  },
  {
    name: "mon-prochain-jeu",
    description: "Site de suggestions de jeux vidéo : on saisit les jeux déjà joués, avec un avis facultatif, et le site propose d'autres jeux proches.",
    stack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/Munkkkk/mon-prochain-jeu",
  },
];

export interface Experience {
  role: string;
  company: string;
  type?: string;
  start: string;
  end: string;
  stack?: string[];
  highlights: string[];
}

export const experiences: Experience[] = [
  {
    role: "Développeur Full Stack",
    company: "Monar.IO",
    type: "Stage",
    start: "2024",
    end: "2025",
    stack: ["React", "TypeScript", "MongoDB"],
    highlights: ["Mise en place de l'interface utilisateur"],
  },
  {
    role: "Assistant des achats",
    company: "IONIS Group",
    start: "Août 2021",
    end: "Décembre 2022",
    highlights: [
      "Élaboration des budgets",
      "Achats presse",
      "Gestion de la mise en place des salons et de la presse",
    ],
  },
  {
    role: "Chargé de développement et d'admission",
    company: "ICS Bégué",
    start: "Septembre 2020",
    end: "Août 2021",
    highlights: [
      "Prospection",
      "Mise en place d'actions et d'événements",
      "Processus d'admission",
    ],
  },
  {
    role: "Gestion de projet",
    company: "Vadris & Shiny",
    type: "Stage",
    start: "Mars 2019",
    end: "Septembre 2019",
    highlights: ["Recherche de collaborations", "Création de contenu"],
  },
  {
    role: "Conseiller de vente",
    company: "Leroy Merlin",
    type: "Alternance",
    start: "Octobre 2016",
    end: "Septembre 2018",
    highlights: ["Relation clients", "Gestion des stocks", "Vente B to C"],
  },
];

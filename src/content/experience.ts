// TODO: remplacer par vraies données
export interface Experience { role: string; company: string; start: string; end: string; highlights: string[] }

export const experiences: Experience[] = [
  {
    role: "Senior Full-Stack Developer",
    company: "Nimbus Labs",
    start: "2023",
    end: "Present",
    highlights: [
      "Led the migration of a monolith to a Next.js and Node.js architecture",
      "Cut average page load time by 45% with caching and code splitting",
      "Mentored four junior developers through code reviews and pairing",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Brightwave Studio",
    start: "2021",
    end: "2023",
    highlights: [
      "Built a real-time booking platform used by 30,000 monthly users",
      "Designed a REST and GraphQL API consumed by web and mobile clients",
      "Introduced end-to-end testing that reduced regressions by 60%",
    ],
  },
  {
    role: "Junior Web Developer",
    company: "Pixelforge",
    start: "2019",
    end: "2021",
    highlights: [
      "Delivered responsive front-ends for more than 15 client websites",
      "Automated deployments with a CI pipeline",
    ],
  },
];

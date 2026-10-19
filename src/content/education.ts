export interface Education {
  degree: string;
  school: string;
  start: string;
  end: string;
  type?: string;
  mention?: string;
}

export const education: Education[] = [
  { degree: "Concepteur Développeur d'Applications", school: "Wild School", start: "2026", end: "2027" },
  { degree: "Développeur Web", school: "OpenClassrooms", start: "2024", end: "2025" },
  { degree: "Master Stratégie Marketing", school: "ISEFAC", start: "2020", end: "2022", type: "Alternance" },
  { degree: "Bachelor Marketing digital", school: "ISEFAC", start: "2018", end: "2019" },
  { degree: "BTS MUC", school: "IDRAC Business School", start: "2016", end: "2018", type: "Alternance", mention: "Major de promo" },
  { degree: "Licence de droit", school: "Université Paris II Panthéon-Assas", start: "2012", end: "2015" },
];

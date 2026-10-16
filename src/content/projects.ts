// TODO: remplacer par vraies données
export interface Project { name: string; description: string; stack: string[]; url?: string }

export const projects: Project[] = [
  {
    name: "TaskFlow",
    description: "A collaborative kanban board with real-time sync and offline support.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "WebSocket"],
    url: "https://github.com/alexmorgan-dev/taskflow-collaborative-kanban-board/tree/main/apps/web",
  },
  {
    name: "Pulse API",
    description: "A monitoring service that tracks uptime and latency for public endpoints.",
    stack: ["Node.js", "Fastify", "Redis", "Docker"],
    url: "https://github.com/alexmorgan-dev/pulse-api",
  },
  {
    name: "Palette CLI",
    description: "A command-line tool that generates accessible color palettes from an image.",
    stack: ["TypeScript", "Node.js"],
  },
];

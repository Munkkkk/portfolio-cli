# portfolio-cli

Portfolio interactif façon terminal : on tape des commandes (`help`, `about`, `experience`, `projects`, `skills`, `education`, `contact`, `clear`) pour découvrir le profil.

**Stack :** Next.js 16 (App Router) · React 19 · TypeScript strict · CSS Modules · Vitest · Playwright

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests unitaires
npm run test:e2e   # tests E2E (desktop + mobile 375 px)
```

## Modifier le contenu

Tout le contenu est dans `src/content/*.ts`. Le terminal et les commandes n'ont pas besoin d'être touchés.

## Architecture

- `src/core/` : contrat (`types.ts`), parser, registre de commandes
- `src/commands/` : une commande par fichier
- `src/components/Terminal/` : interface du terminal, sans aucune commande codée en dur
- `src/app/Portfolio.tsx` : assemble registre, commandes et terminal

Design et plan : `docs/superpowers/`.

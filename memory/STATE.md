# État actuel

Phase : **V1 terminée — 5/5 Déploiement à faire**

Plan : `docs/superpowers/plans/2026-10-16-cli-portfolio.md` · Spec : `docs/superpowers/specs/2026-10-16-cli-portfolio-design.md` · Rapports : `docs/reviews/`

## Ledger (ne PAS relancer une tâche marquée complete)

- Task 0: complete (f1a5f2a) — Next 16.4.2, React 19.3, vitest 5, @types/node 24
- Task 1: complete (2f6773a) — parser + registre ; erreurs en `<span className="text-error">`
- Task 2: complete (406719a) — persona fictive « Alex Morgan » + 8 commandes
- Task 3: complete (b252d5d) — Terminal UI
- Task 4: complete (63df3ec) — intégration dans `src/app/Portfolio.tsx`
- Task 5: complete (29b6c11, de55288) — E2E, a11y, code review
- Task 6: complete (2e58023..af32e8a) — 3 importants + mineurs simples corrigés
- Vérif finale (orchestrateur) : 35 tests unitaires, 26/26 E2E sur build de prod, tsc/lint/build OK, contrôle visuel mobile OK

## Backlog (mineurs non corrigés, volontairement)

- Pas d'ErrorBoundary React autour du terminal (CR M1) — le registre attrape déjà les erreurs des commandes.
- Pas de test liant les suggestions du bienvenue aux commandes existantes (CR M5).
- Refocus auto au clic aussi sur mobile (CR M9) — décision de design, spec §6.5.
- `viewport.interactiveWidget` non défini (UX M3) — non testable sur iOS ici.
- Boutons de bienvenue sans texte d'aide (UX M4) — choix de copy.
- Hors V1 (spec §2) : historique ↑/↓, Tab, easter eggs, thèmes, `resume` PDF, FR/EN.

## Rulings (décisions prises en cours d'exécution)

- Ruling: Tâches 1-3 en parallèle — demandé par l'utilisateur, fichiers disjoints.
- Ruling: pas de revue par tâche ; revue groupée en T5 — économie de tokens.
- Ruling: travail sur `main` (dépôt neuf, sans remote).
- Ruling: `@types/node` ^20 → ^24 — exigé par vitest 5.
- Ruling: assemblage dans `src/app/Portfolio.tsx` (pas `components/`) — règle de dépendance.
- Ruling: fix lint `react-hooks/refs` par l'orchestrateur (composant WelcomeSlot).
- Ruling: 5 mineurs reportés au backlog — décisions de design ou plus qu'un fix de 2 lignes.

## Prochaines actions possibles

1. Remplacer les données fictives : éditer uniquement `src/content/*.ts` (chercher `TODO`).
2. Déployer sur Vercel (remote GitHub ou CLI `vercel` ; le connecteur Vercel demande une autorisation).
3. Fonctions V2 (voir backlog).

## Notes pour les agents

- Next.js 16 : lire `node_modules/next/dist/docs/` avant d'écrire du code Next (voir AGENTS.md).
- Lancer : `npm run dev` · Tests : `npm test` et `npm run test:e2e`.
- Après modif de code : `graphify update .` (consigne utilisateur globale).

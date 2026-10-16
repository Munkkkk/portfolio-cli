# État actuel

Phase : **V1 en preview Vercel — production en attente des vraies données**

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

## Déploiement

- GitHub : https://github.com/Munkkkk/portfolio-cli (public). Branches `main` et `preview` (même commit 0c03104).
- Commits réécrits avec l'email noreply GitHub (`104200504+Munkkkk@users.noreply.github.com`, config locale du repo) — GitHub bloque l'email perso.
- Vercel : projet `portfolio-cli` (prj_2KvtGWx9ncRiawNGmjcxqTUgzhl7, team munk-build-project), PAS relié à Git (pas d'auto-deploy).
- Preview : https://portfolio-cli-git-preview-munk-build-project.vercel.app — protégé par Vercel Authentication (visible seulement connecté).
- Un premier déploiement depuis `main` est parti en production → annulé avant la fin du build (dpl_8VYD…, CANCELED). Déployer depuis `main` = production.
- Production : quand les vraies données sont dans `src/content/`, déployer depuis `main` (target production).
- Hook local : `code-review` obligatoire avant tout push (SHA relus dans ~/.claude/reviewed-shas.txt).

## Backlog (mineurs non corrigés, volontairement)

- Pas d'ErrorBoundary React autour du terminal (CR M1) — le registre attrape déjà les erreurs des commandes.
- Pas de test liant les suggestions du bienvenue aux commandes existantes (CR M5).
- Refocus auto au clic aussi sur mobile (CR M9) — décision de design, spec §6.5.
- `viewport.interactiveWidget` non défini (UX M3) — non testable sur iOS ici.
- Boutons de bienvenue sans texte d'aide (UX M4) — choix de copy.
- Code review pré-push (skipped) : refocus input après clic sur suggestion ouvre le clavier mobile ; suggestions codées en dur ; clés React trop complexes ; historique non borné.
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
2. Passer en production (voir section Déploiement).
3. Fonctions V2 (voir backlog).

## Notes pour les agents

- Next.js 16 : lire `node_modules/next/dist/docs/` avant d'écrire du code Next (voir AGENTS.md).
- Lancer : `npm run dev` · Tests : `npm test` et `npm run test:e2e`.
- Après modif de code : `graphify update .` (consigne utilisateur globale).

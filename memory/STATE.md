# État actuel

Phase : **EN PRODUCTION — https://portfolio-cli-omega.vercel.app (ea8e833)**

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

## Contenu réel (2026-10-19)

- Données du CV de Ludwig Marais dans `src/content/` ; tout le texte affiché en français, `lang="fr"`.
- Nouvelles commandes : `languages`, `interests` (10 commandes au total).
- Confidentialité (décision utilisateur) : PAS de téléphone, PAS d'email, PAS de RQTH sur le site. Permis B affiché. Contact = GitHub + Linktree + ArtStation.
- Projets = repos GitHub portfolio-cli, f1-predictions, mon-prochain-jeu (seuls avec un README exploitable).
- Process : 1 agent de saisie + 1 agent de relecture séparé (0 bloquant, 2 importants corrigés). Brief et rapports : `.superpowers/sdd/cv-content/` (non versionné).
- Tests : 38 unitaires, 30 E2E, tsc/lint OK.
- Code review pré-push (ea8e833) : rugby, README, spec corrigés. Non faits (choix utilisateur) : guillemets « » dans les messages d'erreur, mois manquants pour Monar.IO (2024-2025), stack visible seulement dans `experience <n>`.
- Poussé sur `main` et `preview` ; preview redéployé (dpl_68xeRHu1…, READY).
- À relire par l'utilisateur : la bio (`src/content/profile.ts`) est une première version rédigée à partir du CV.

## Déploiement

- GitHub : https://github.com/Munkkkk/portfolio-cli (public). Branches `main` et `preview` (même commit 0c03104).
- Commits réécrits avec l'email noreply GitHub (`104200504+Munkkkk@users.noreply.github.com`, config locale du repo) — GitHub bloque l'email perso.
- Vercel : projet `portfolio-cli` (prj_2KvtGWx9ncRiawNGmjcxqTUgzhl7, team munk-build-project), PAS relié à Git (pas d'auto-deploy).
- Preview : https://portfolio-cli-git-preview-munk-build-project.vercel.app — protégé par Vercel Authentication (visible seulement connecté).
- Un premier déploiement depuis `main` est parti en production → annulé avant la fin du build (dpl_8VYD…, CANCELED). Déployer depuis `main` = production.
- **Production (2026-10-19)** : https://portfolio-cli-omega.vercel.app — public (200), dpl_GpsxiAm81…, commit ea8e833. Les autres alias `*-munk-build-project.vercel.app` restent protégés par Vercel Authentication (normal). Projet non relié à Git : pour mettre à jour, code review → push → `create_deployment` (ref main, target production).
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

1. Partager le lien https://portfolio-cli-omega.vercel.app (CV, LinkedIn, Linktree).
2. Optionnel : domaine perso, relier le projet Vercel à GitHub pour l'auto-deploy.
3. Fonctions V2 (voir backlog).

## Notes pour les agents

- Next.js 16 : lire `node_modules/next/dist/docs/` avant d'écrire du code Next (voir AGENTS.md).
- Lancer : `npm run dev` · Tests : `npm test` et `npm run test:e2e`.
- Après modif de code : `graphify update .` (consigne utilisateur globale).

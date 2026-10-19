# Portfolio CLI Implementation Plan

> **Mise à jour 2026-10-19 :** le site est passé en français avec le vrai CV et 10 commandes (+ `languages`, `interests`). Les messages exacts en anglais de ce document sont remplacés par : `commande introuvable : <name>. Tapez "help" pour voir les commandes disponibles.` · `erreur : <name> a échoué` · `Tapez "help" pour commencer.` · aria-label `Commande du terminal`. Le contact n'affiche ni email ni téléphone (décision de l'utilisateur). Le code et les tests font foi.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site Next.js qui imite un terminal ; le visiteur tape 8 commandes pour lire un portfolio (données fictives).

**Architecture:** Un contrat figé (`src/core/types.ts`) sépare trois zones indépendantes : moteur (parser + registre), commandes + contenu, UI terminal. Le terminal ne connaît aucune commande ; il reçoit un registre. `src/app/page.tsx` assemble le tout.

**Tech Stack:** Next.js (App Router, dernière version stable), React, TypeScript strict, CSS Modules, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-16-cli-portfolio-design.md` — chaque agent lit la spec ET sa tâche.

## Global Constraints

- TypeScript `strict: true`, aucun `any`, aucun `// @ts-ignore`.
- Règle de dépendance : `components → core ← commands → content`. `components/` n'importe jamais `commands/` ni `content/`. `core/` n'importe rien du projet sauf `core/`.
- `src/core/types.ts` est figé après la Tâche 0. Un agent qui a besoin de le changer s'arrête et le signale.
- Dossier de routes : `src/app/` (la spec §4 écrit `app/` ; on utilise `--src-dir`).
- Pas de librairie de terminal ni de librairie UI. Styles en CSS Modules + `globals.css`.
- Prompt exact : `visitor@portfolio:~$`
- Message commande inconnue exact : `command not found: <name>. Type "help" to see available commands.`
- Message exception exact : `error: <name> failed`
- Liens externes : `target="_blank" rel="noopener noreferrer"`.
- Données fictives marquées `// TODO: remplacer par vraies données` en tête de chaque fichier `src/content/*.ts`.
- Lisible à 375 px de large sans scroll horizontal.
- Fin de chaque tâche : ajouter 1-3 lignes dans `memory/STATE.md` (section « Fait »).
- **Commits pendant le travail parallèle (Tâches 1-3)** : les agents NE commitent PAS (conflit de `.git/index.lock`). L'orchestrateur commite les fichiers de chaque agent quand il a fini.

## Review Focus

1. Saisie en majuscules ou avec espaces autour (`  HELP  `) → doit exécuter `help`. Test : Tâche 1.
2. `experience 0`, `experience -1`, `experience abc`, `experience 99` → message clair + usage, jamais de crash. Test : Tâche 2.
3. Longues lignes (URL, description de projet) à 375 px → retour à la ligne, pas de scroll horizontal. Test : Tâche 5 (e2e).
4. Entrée vide répétée → n'ajoute qu'une ligne de prompt, pas d'erreur. Test : Tâche 3.
5. Sélectionner du texte dans la sortie avec la souris → la sélection n'est pas perdue par le focus automatique. Test : Tâche 5 (e2e).

---

## Ordre d'exécution

| Phase | Tâches | Mode |
|---|---|---|
| 0 | Tâche 0 | Séquentiel (orchestrateur) |
| 1 | Tâches 1, 2, 3 | **Parallèle** — fichiers disjoints |
| 2 | Tâche 4 | Séquentiel (intégration) |
| 3 | Tâche 5 (5a, 5b, 5c) | **Parallèle** — vérification, lecture + rapport |
| 4 | Tâche 6 | Séquentiel (corrections) |

---

### Task 0: Scaffold + contrat

**Files:**
- Create: projet Next.js à la racine, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `src/core/types.ts`, `src/test/renderOutput.tsx`, `.gitignore`
- Keep: `memory/`, `docs/`

**Interfaces:**
- Produces: `src/core/types.ts` exactement comme la spec §5 (`ParsedInput`, `CommandOutput`, `CommandContext`, `Command`, `HistoryEntry`). Alias d'import `@/*` → `src/*`.
- Produces: `renderOutput(output: CommandOutput): RenderResult` dans `src/test/renderOutput.tsx` (wrap `render(<>{output}</>)` de Testing Library).
- Produces: scripts npm `dev`, `build`, `start`, `lint`, `test` (= `vitest run --passWithNoTests`), `test:e2e` (= `playwright test`).

- [ ] **Step 1:** `git init` à la racine.
- [ ] **Step 2:** Le dossier n'est pas vide → générer dans un sous-dossier puis remonter :
  ```bash
  npx create-next-app@latest scaffold --ts --app --src-dir --eslint --no-tailwind --import-alias "@/*" --use-npm --yes
  ```
  Déplacer le contenu de `scaffold/` (fichiers cachés compris) à la racine, supprimer `scaffold/`. Vérifier que `memory/` et `docs/` sont intacts.
- [ ] **Step 3:** Installer les outils de test :
  ```bash
  npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
  npx playwright install chromium
  ```
- [ ] **Step 4:** `vitest.config.ts` : plugins react + tsconfigPaths, `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]` (importe `@testing-library/jest-dom/vitest`), `include: ["src/**/*.test.{ts,tsx}"]`.
- [ ] **Step 5:** `playwright.config.ts` : `testDir: "tests/e2e"`, `webServer: { command: "npm run build && npm run start", url: "http://localhost:3000", reuseExistingServer: true }`, projets `desktop` (Desktop Chrome) et `mobile` (viewport 375×812).
- [ ] **Step 6:** Écrire `src/core/types.ts` (copie exacte spec §5) et `src/test/renderOutput.tsx`.
- [ ] **Step 7:** Vider `src/app/page.tsx` en un placeholder `<main>Portfolio</main>`, supprimer les assets de démo et `page.module.css`.
- [ ] **Step 8:** Vérifier : `npm run build` → succès ; `npm test` → exit 0 (aucun test encore).
- [ ] **Step 9:** Commit : `chore: scaffold Next.js, test tooling and core contract`.

---

### Task 1: Moteur — parser + registre (Agent A)

**Files:**
- Create: `src/core/parser.ts`, `src/core/registry.ts`
- Test: `src/core/parser.test.ts`, `src/core/registry.test.ts`

**Interfaces:**
- Consumes: `ParsedInput`, `Command`, `CommandContext`, `CommandOutput` de `@/core/types`.
- Produces:
  - `parse(raw: string): ParsedInput`
  - `createRegistry(commands: Command[]): Registry`
  - `export interface Registry { list(): readonly Command[]; execute(input: ParsedInput, ctx: CommandContext): CommandOutput }`

- [ ] **Step 1: Tests parser** (`parser.test.ts`) :
  ```ts
  expect(parse("help")).toEqual({ raw: "help", name: "help", args: [] });
  expect(parse("  HELP  ")).toEqual({ raw: "  HELP  ", name: "help", args: [] });
  expect(parse("experience   2  Foo")).toEqual({ raw: "experience   2  Foo", name: "experience", args: ["2", "Foo"] });
  expect(parse("")).toEqual({ raw: "", name: "", args: [] });
  expect(parse("   ")).toEqual({ raw: "   ", name: "", args: [] });
  ```
- [ ] **Step 2:** `npm test -- parser` → FAIL (module introuvable).
- [ ] **Step 3:** Implémenter `parse` (trim, split `/\s+/`, nom en minuscules, args casse conservée).
- [ ] **Step 4:** `npm test -- parser` → PASS.
- [ ] **Step 5: Tests registre** (`registry.test.ts`), avec deux commandes factices `echo` (renvoie `args.join(" ")`) et `boom` (lève une `Error`) et un `ctx = { commands: [], clear: vi.fn() }` :
  - `createRegistry([echo, echo])` lève une erreur dont le message contient `"echo"`.
  - `list()` renvoie `[echo, boom]` dans l'ordre.
  - `execute(parse("echo a b"), ctx)` → `"a b"`.
  - `execute(parse(""), ctx)` → `null`.
  - `renderOutput(execute(parse("nope"), ctx))` contient le texte exact `command not found: nope. Type "help" to see available commands.`
  - `renderOutput(execute(parse("boom"), ctx))` contient `error: boom failed`, et l'appel ne lève pas.
- [ ] **Step 6:** `npm test -- registry` → FAIL.
- [ ] **Step 7:** Implémenter `createRegistry` (Map par nom ; try/catch autour de `run`). Messages d'erreur rendus dans un élément avec `className` CSS d'erreur optionnel — un `<span>` simple suffit.
- [ ] **Step 8:** `npm test -- core` → PASS. `npx tsc --noEmit` → 0 erreur.
- [ ] **Step 9:** Mettre à jour `memory/STATE.md`. **Ne pas commiter** (l'orchestrateur le fait).

---

### Task 2: Contenu + 8 commandes (Agent C)

**Files:**
- Create: `src/content/{profile,experience,projects,skills,education,contact}.ts`
- Create: `src/commands/{help,about,experience,projects,skills,education,contact,clear}.ts`, `src/commands/index.ts`
- Test: `src/commands/commands.test.tsx`

**Interfaces:**
- Consumes: `Command`, `CommandContext` de `@/core/types` ; `renderOutput` de `@/test/renderOutput`. N'importe PAS `@/core/registry` (le test construit `ctx` à la main).
- Produces — types et constantes de contenu :
  - `profile.ts` : `interface Profile { name: string; title: string; bio: string; location: string }` · `export const profile: Profile`
  - `experience.ts` : `interface Experience { role: string; company: string; start: string; end: string; highlights: string[] }` · `export const experiences: Experience[]` (3 entrées, plus récente en premier)
  - `projects.ts` : `interface Project { name: string; description: string; stack: string[]; url?: string }` · `export const projects: Project[]` (3 entrées)
  - `skills.ts` : `interface SkillGroup { category: string; items: string[] }` · `export const skills: SkillGroup[]` (3 groupes)
  - `education.ts` : `interface Education { degree: string; school: string; start: string; end: string }` · `export const education: Education[]` (2 entrées)
  - `contact.ts` : `interface Contact { email: string; github: string; linkedin: string }` · `export const contact: Contact`
- Produces — commandes : chaque fichier `export const <nom>Command: Command` (ex. `helpCommand`, `experienceCommand`). `src/commands/index.ts` : `export const commands: Command[]` dans l'ordre `help, about, experience, projects, skills, education, contact, clear`.
- `experienceCommand.usage = "experience [n]"`.

- [ ] **Step 1: Écrire le contenu fictif** (6 fichiers, en-tête TODO, une URL de projet longue ≥ 60 caractères pour tester le retour à la ligne).
- [ ] **Step 2: Tests** (`commands.test.tsx`), `ctx = { commands, clear: vi.fn() }` :
  - `commands.map(c => c.name)` égal à `["help","about","experience","projects","skills","education","contact","clear"]` ; noms uniques ; chaque `description` non vide.
  - `help` : la sortie contient chaque nom et chaque description.
  - `about` : contient `profile.name` et `profile.title`.
  - `experience` sans arg : contient chaque `role` et chaque `company`.
  - `experience 1` : contient `experiences[0].highlights[0]` ; ne contient pas `experiences[1].company`.
  - `experience 0`, `experience -1`, `experience abc`, `experience 99` : contient `experience [n]` (usage) et ne lève pas.
  - `projects`, `skills`, `education` : contiennent chaque nom / catégorie / diplôme.
  - `contact` : 3 liens `<a>` ; chacun a `target="_blank"` et `rel="noopener noreferrer"` ; l'email est un lien `mailto:`.
  - `clear` : appelle `ctx.clear` une fois et renvoie `null`.
  - Un argument en trop (`about extra`) ne change pas la sortie.
- [ ] **Step 3:** `npm test -- commands` → FAIL.
- [ ] **Step 4:** Implémenter les 8 commandes. Sortie JSX sémantique (`<ul>/<li>`, `<strong>` pour les titres). Classes CSS : aucune obligatoire ; si besoin, un `src/commands/output.module.css` partagé (fichier possédé par l'Agent C).
- [ ] **Step 5:** `npm test -- commands` → PASS. `npx tsc --noEmit` → 0 erreur.
- [ ] **Step 6:** Mettre à jour `memory/STATE.md`. **Ne pas commiter.**

---

### Task 3: Terminal UI (Agent B)

**Files:**
- Create: `src/components/Terminal/{Terminal.tsx,Prompt.tsx,OutputLine.tsx,Welcome.tsx,Terminal.module.css}`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Test: `src/components/Terminal/Terminal.test.tsx`

**Interfaces:**
- Consumes: `HistoryEntry`, `CommandContext`, `CommandOutput` de `@/core/types` ; **type** `Registry` et `parse` de `@/core/*` (Tâche 1). En parallèle, l'Agent B développe contre un registre factice défini dans son test ; il importe `parse` réel seulement si Tâche 1 est finie, sinon un stub local dans le test.
- Produces (précision de spec §6.5 : le bienvenue a besoin d'exécuter des commandes, d'où un render-prop) :
  - `Terminal({ registry, welcome }: { registry: Registry; welcome: (run: (input: string) => void) => ReactNode })` — `"use client"`.
  - `Welcome({ name, suggestions, onRun }: { name: string; suggestions: string[]; onRun: (input: string) => void })` — affiche `name`, la ligne `Type "help" to get started.`, puis chaque suggestion en `<button>`.
- Comportement :
  - Entrée → `parse` → `registry.execute(parsed, ctx)` → ajout `HistoryEntry` (id incrémental) → scroll en bas.
  - Entrée vide → ajoute une entrée avec `output: null` (ligne de prompt seule).
  - `ctx.clear` → vide l'historique ET masque le bienvenue ; l'entrée `clear` n'est pas ajoutée.
  - Clic dans le terminal → focus input, sauf si `window.getSelection()?.toString()` est non vide.
  - Input : `aria-label="Terminal command"`, `autoComplete="off"`, `spellCheck={false}`, `autoCapitalize="none"`. Zone historique : `role="log"`, `aria-live="polite"`.
- Style : fond sombre, police monospace via `next/font/google` (JetBrains Mono) dans `layout.tsx`, une couleur d'accent, `overflow-wrap: anywhere` sur les sorties, pas de largeur fixe.

- [ ] **Step 1: Tests** (`Terminal.test.tsx`), registre factice avec `echo` et un `clear` qui appelle `ctx.clear()`, `welcome = run => <Welcome name="Test" suggestions={["echo hi"]} onRun={run} />` :
  - Taper `echo hello` + Entrée → le log contient `visitor@portfolio:~$ echo hello` et `hello` ; l'input est vidé.
  - Entrée vide deux fois → 2 lignes de prompt dans le log, aucune erreur.
  - Taper `clear` + Entrée → le log est vide et le texte `Type "help" to get started.` n'est plus présent.
  - Clic sur le bouton `echo hi` → le log contient `hi`.
  - `getByRole("textbox", { name: "Terminal command" })` existe ; `getByRole("log")` existe.
- [ ] **Step 2:** `npm test -- Terminal` → FAIL.
- [ ] **Step 3:** Implémenter `Prompt`, `OutputLine`, `Welcome`, `Terminal`, CSS, police dans `layout.tsx` (title `Portfolio — Terminal`).
- [ ] **Step 4:** `npm test -- Terminal` → PASS. `npx tsc --noEmit` → 0 erreur (si Tâche 1 pas encore finie, l'import du type `Registry` peut échouer : se baser sur la signature de l'Interfaces block et revérifier en Tâche 4).
- [ ] **Step 5:** Mettre à jour `memory/STATE.md`. **Ne pas commiter.**

---

### Task 4: Intégration

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `createRegistry` (Tâche 1), `commands` (Tâche 2), `profile` (Tâche 2), `Terminal`, `Welcome` (Tâche 3).

- [ ] **Step 1:** Commiter séparément le travail des Tâches 1, 2, 3 (un commit par agent : `feat(core): …`, `feat(commands): …`, `feat(ui): …`).
- [ ] **Step 2:** `page.tsx` : registre créé au niveau module (`createRegistry(commands)`), rendu `<Terminal registry={registry} welcome={run => <Welcome name={profile.name} suggestions={["help","about","experience","projects","contact"]} onRun={run} />} />`. `page.tsx` reste un Server Component si possible ; sinon déplacer l'assemblage dans `src/components/Portfolio.tsx` (`"use client"`) — le render-prop ne peut pas traverser la frontière serveur→client.
- [ ] **Step 3:** `npm test` → tout PASS. `npx tsc --noEmit` → 0. `npm run lint` → 0 erreur. `npm run build` → succès.
- [ ] **Step 4:** `npm run dev`, ouvrir `http://localhost:3000`, taper les 8 commandes à la main → chaque sortie s'affiche.
- [ ] **Step 5:** Mettre à jour `memory/STATE.md` ; commit `feat: wire terminal, registry and commands`.

---

### Task 5: Équipe de vérification (3 agents en parallèle)

Chaque agent rédige un rapport `docs/reviews/2026-10-16-<nom>.md` : liste de problèmes, chacun avec fichier:ligne, reproduction, gravité (bloquant / important / mineur). **Ils ne modifient pas le code applicatif.**

#### 5a — Tests E2E
**Files:** Create `tests/e2e/terminal.spec.ts` (seul fichier que 5a écrit hors rapport).
- [ ] Tests (projets desktop + mobile) :
  - Chaque commande des 8 → tapée + Entrée → texte attendu visible (ex. `help` → `experience`; `about` → nom du profil).
  - `foo` → `command not found: foo. Type "help" to see available commands.`
  - `experience 99` → `experience [n]`.
  - Mobile 375 px : après `projects`, `document.documentElement.scrollWidth <= 375`.
  - Sélection : après `about`, triple-clic sur la ligne de bio → `window.getSelection().toString()` non vide.
  - Clavier seul : Tab atteint les boutons de bienvenue puis l'input ; Entrée sur un bouton exécute la commande.
- [ ] `npm run test:e2e` → rapporter résultats (PASS/FAIL par test) dans le rapport.

#### 5b — UX / accessibilité / responsive
- [ ] Ouvrir le site (navigateur intégré), vérifier : contrastes AA (outil ou calcul), navigation clavier complète, rôles ARIA (§6.6), 375 px sans scroll horizontal, prompt visible quand le clavier mobile s'ouvre (viewport réduit en hauteur à 400 px), lisibilité du bienvenue pour un recruteur non-tech.
- [ ] Rapport.

#### 5c — Revue de code
- [ ] Vérifier : contrat §5 inchangé, règle de dépendance (grep des imports `components/` → aucun `@/commands` / `@/content`), pas de `any`, messages exacts des Global Constraints, `rel="noopener noreferrer"`, en-têtes TODO du contenu, couverture de chaque ligne du tableau §6.3 et §8 de la spec.
- [ ] Rapport.

---

### Task 6: Corrections

- [ ] **Step 1:** Lire les 3 rapports, trier : bloquant → important → mineur.
- [ ] **Step 2:** Un seul agent corrige, un problème à la fois : test qui reproduit → correction → test vert.
- [ ] **Step 3:** `npm test && npm run test:e2e && npm run lint && npm run build` → tout vert.
- [ ] **Step 4:** Mettre à jour `memory/STATE.md` (phase 4/5 terminée) ; commit `fix: address verification findings`.

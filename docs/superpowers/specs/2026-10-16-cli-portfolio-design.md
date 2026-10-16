# Portfolio CLI — Spec de design

Date : 2026-10-16 · Statut : en revue

## 1. Objectif

Un portfolio personnel sous forme de **site web qui imite un terminal**. Le visiteur tape des commandes (`help`, `experience`…) pour découvrir le profil.

- **Public** : recruteurs (doivent trouver l'info en < 30 s, sans connaître les terminaux) et développeurs (apprécient l'esthétique).
- **Succès V1** : les 8 commandes marchent sur desktop et mobile, build Vercel OK, tous les tests verts, contenu modifiable en éditant uniquement `src/content/`.

## 2. Périmètre

**V1 (inclus)** : commandes `help`, `about`, `experience`, `projects`, `skills`, `education`, `contact`, `clear` · message de bienvenue statique · gestion des commandes inconnues · données fictives.

**Hors V1** (l'architecture doit les permettre sans refonte) : historique ↑/↓, autocomplétion Tab, easter eggs, thèmes, `resume` (PDF), bascule FR/EN.

## 3. Stack

- Next.js (App Router), TypeScript `strict`, rendu statique (`output: "export"` compatible).
- Styles : CSS Modules (pas de dépendance UI).
- Tests : Vitest + Testing Library (unitaires), Playwright (e2e).
- Déploiement : Vercel.
- Aucune librairie de terminal (pas de xterm.js).

## 4. Architecture

```
src/
  core/
    types.ts       contrat partagé — figé avant le travail parallèle
    parser.ts      string → ParsedInput
    registry.ts    enregistrement + exécution des commandes
  commands/
    index.ts       liste de toutes les commandes (seul point d'enregistrement)
    help.ts about.ts experience.ts projects.ts skills.ts education.ts contact.ts clear.ts
  content/
    profile.ts experience.ts projects.ts skills.ts education.ts contact.ts
  components/
    Terminal/      Terminal.tsx, Prompt.tsx, OutputLine.tsx, Terminal.module.css
app/
  layout.tsx page.tsx globals.css
tests/e2e/         specs Playwright
```

Règle de dépendance (sens unique) : `components → core ← commands → content`. Le terminal ne connaît aucune commande en dur ; les commandes ne connaissent pas le terminal.

## 5. Contrat (`src/core/types.ts`)

```ts
import type { ReactNode } from "react";

export interface ParsedInput {
  raw: string;            // saisie brute
  name: string;           // premier mot, en minuscules ("" si vide)
  args: string[];         // mots suivants, casse conservée
}

export type CommandOutput = ReactNode;

export interface CommandContext {
  commands: readonly Command[]; // pour `help`
  clear: () => void;            // pour `clear`
}

export interface Command {
  name: string;                 // minuscules, unique
  description: string;          // une ligne, affichée par `help`
  usage?: string;               // ex. "experience [n]"
  run: (args: string[], ctx: CommandContext) => CommandOutput;
}

export interface HistoryEntry {
  id: number;
  input: string;                // ligne tapée (affichée avec le prompt)
  output: CommandOutput;
}
```

## 6. Composants

### 6.1 Parser (`core/parser.ts`)
- `parse(raw: string): ParsedInput`
- Trim, découpe sur espaces multiples. Guillemets non gérés en V1.
- `name` en minuscules. Entrée vide → `name: ""`, `args: []`.

### 6.2 Registry (`core/registry.ts`)
- `createRegistry(commands: Command[])` → `{ list(): readonly Command[]; execute(input: ParsedInput, ctx): CommandOutput }`
- Noms dupliqués → erreur levée à la création.
- `name === ""` → retourne `null` (ligne vide affichée, pas d'erreur).
- Nom inconnu → `command not found: <name>. Type "help" to see available commands.`
- Si `run` lève une exception → message `error: <name> failed` (le terminal ne plante jamais).

### 6.3 Commandes (`commands/`)
Une commande = un fichier exportant un `Command`. Sortie en JSX sémantique (listes `<ul>`, titres, liens `<a>`).

| Commande | Sortie |
|---|---|
| `help` | Liste nom + description de toutes les commandes (via `ctx.commands`) |
| `about` | Nom, titre, courte bio, localisation |
| `experience` | Liste des postes (rôle, entreprise, dates, 2-3 points). `experience <n>` → détail du poste n (1-indexé) ; n invalide → message + usage |
| `projects` | Liste (nom, description, stack, lien) |
| `skills` | Compétences groupées par catégorie |
| `education` | Diplômes (titre, école, années) |
| `contact` | Email, GitHub, LinkedIn — liens cliquables, `target="_blank" rel="noopener noreferrer"` |
| `clear` | Appelle `ctx.clear()`, retourne `null` |

Arguments inattendus sur une commande qui n'en prend pas → ignorés.

### 6.4 Contenu (`content/`)
Données typées, fictives en V1, clairement marquées `// TODO: remplacer par vraies données`. Chaque fichier exporte un type + une constante (ex. `export const experiences: Experience[]`). Les types de contenu vivent dans leur fichier `content/*.ts`.

### 6.5 Terminal UI (`components/Terminal/`)
- Props : `{ registry: Registry; welcome: (run: (input: string) => void) => ReactNode }` (render-prop : le bienvenue doit pouvoir exécuter une commande au clic).
- Affiche le message de bienvenue, puis l'historique `HistoryEntry[]`, puis le prompt actif.
- Prompt : `visitor@portfolio:~$` + `<input>` texte. Entrée → parse → execute → ajout à l'historique → scroll en bas.
- Clic n'importe où dans le terminal → focus sur l'input (sauf si sélection de texte en cours).
- Message de bienvenue : nom + `Type "help" to get started.` + liste cliquable des commandes principales (cliquer exécute la commande — aide les recruteurs et le mobile).
- Esthétique : fond sombre, police monospace (Google Font via `next/font`), une couleur d'accent.

### 6.6 Accessibilité
- `<input>` avec `aria-label="Terminal command"`, `autoComplete="off"`, `spellCheck={false}`, `autoCapitalize="none"`.
- Zone de sortie : `role="log"` + `aria-live="polite"`.
- Contrastes AA minimum. Utilisable au clavier seul.

### 6.7 Responsive
- Lisible à 375 px de large sans scroll horizontal (retour à la ligne des longues lignes).
- Le clavier mobile ne doit pas masquer le prompt.

## 7. Flux de données

```
saisie → parse() → registry.execute(parsed, ctx) → CommandOutput
       → setHistory([...history, {id, input, output}]) → rendu → scroll
clear  → ctx.clear() → setHistory([]) et masque le message de bienvenue ;
         l'entrée "clear" elle-même n'est PAS ajoutée à l'historique
```

## 8. Gestion des erreurs

| Cas | Comportement |
|---|---|
| Entrée vide | Nouvelle ligne de prompt, rien d'autre |
| Commande inconnue | `command not found: …` |
| Argument invalide (`experience 99`) | Message clair + `usage` |
| Exception dans `run` | `error: <name> failed`, terminal toujours utilisable |

## 9. Tests

- **Unitaires (Vitest)** : parser (vide, espaces multiples, casse) · registry (inconnu, doublon, exception) · chaque commande rend sans erreur et contient les données attendues · `experience <n>` valide/invalide.
- **Composant (Testing Library)** : taper + Entrée ajoute une entrée · `clear` vide · clic sur commande de bienvenue l'exécute.
- **E2E (Playwright)** : chaque commande tapée dans un vrai navigateur, desktop + viewport 375 px · commande inconnue · navigation clavier.
- `npm run build` doit passer sans erreur ni warning TypeScript.

## 10. Organisation du travail par agents

**Étape 0 (agent principal, séquentiel)** : scaffold Next.js, config TS/Vitest/Playwright, écriture de `core/types.ts`. Figé ensuite — toute modification passe par l'agent principal.

**Étape 1 (3 agents en parallèle, fichiers disjoints)** :

| Agent | Fichiers possédés |
|---|---|
| A — Moteur | `src/core/parser.ts`, `src/core/registry.ts` + tests |
| B — Terminal UI | `src/components/**`, `app/**` (avec registre factice pour développer) |
| C — Contenu + commandes | `src/content/**`, `src/commands/**` + tests |

**Étape 2 (1 agent)** : intégration — brancher le vrai registre dans `app/page.tsx`, build, corriger.

**Étape 3 (équipe de vérification en parallèle, lecture + rapport)** :
- Tests : écrit/lance Vitest + Playwright, rapporte les échecs.
- UX/a11y : clavier, lecteur d'écran, 375 px, contrastes.
- Revue de code : respect du contrat §5, règle de dépendance §4, typage strict.

Les corrections issues de l'étape 3 sont faites par un agent unique pour éviter les conflits.

**Mémoire** : chaque agent met à jour `memory/STATE.md` en fin de tâche.

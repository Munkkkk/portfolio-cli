# Revue de code — Tâche 5c (2026-10-16)

Périmètre : `src/**` (`git diff f1a5f2a..HEAD`, HEAD = 63df3ec). Référence : spec §4, §5, §6, §8 ; Global Constraints du plan ; Rulings de `memory/STATE.md`.

Vérifications exécutées :
- `npx tsc --noEmit` → 0 erreur.
- `npm test` → 4 fichiers, 32 tests, tous verts.
- `npx eslint src` → aucune sortie (0 problème).
- `git diff f1a5f2a..HEAD -- src/core/types.ts` → vide ; le fichier est identique à la spec §5 (contrat inchangé).
- `grep any|ts-ignore|ts-expect-error|eslint-disable` dans `src/` → aucun résultat.
- Règle de dépendance : `src/components/**` n'importe que `@/core/*` (parser, registry en type, types) ; `src/core/**` n'importe que `@/core/*` et `react` ; `src/commands/**` n'importe que `@/core/types` et `@/content/*` ; `src/content/**` n'importe rien. Le câblage est dans `src/app/Portfolio.tsx` (Ruling accepté : correct, `app/` est la racine de composition).
- Chaînes exactes : prompt `visitor@portfolio:~$` (Prompt.tsx:4), commande inconnue (registry.ts:35), exception `error: <name> failed` (registry.ts:41), bienvenue `Type "help" to get started.` (Welcome.tsx:13) — conformes.
- Liens externes : les 3 liens de `contact.tsx` et le lien de `projects.tsx:17-22` ont `target="_blank" rel="noopener noreferrer"`. Les 6 fichiers `src/content/*.ts` commencent par `// TODO: remplacer par vraies données`.
- État du terminal (Terminal.tsx) : pas de stale closure (mise à jour fonctionnelle `setHistory(h => …)`, effets de bord — `nextId.current++` — hors de l'updater, donc sûrs en StrictMode) ; clés React d'historique = `id` unique et monotone (non réinitialisé par `clear`, ce qui est correct) ; `clear` détecté par drapeau local, n'ajoute pas d'entrée et masque le bienvenue (spec §7). Hydratation : rendu initial déterministe (history `[]`, `showWelcome` true), `window` n'est lu que dans un handler ; le registre (qui contient des fonctions) est créé dans un module client (`Portfolio.tsx`) et ne traverse donc pas la frontière serveur/client.

Note : la consigne globale graphify (`/graphify .`) n'a pas été appliquée — elle écrirait `graphify-out/`, ce que le brief 5c interdit (seul ce rapport peut être créé).

## Synthèse

| Sévérité | Nombre |
|---|---|
| bloquant | 0 |
| important | 1 |
| mineur | 9 |

## Important

### I1 — Plusieurs lignes du tableau §6.3 ne sont que partiellement testées (dont le `rel` des liens projets)
- **Fichier** : `src/commands/commands.test.tsx:43-88`
- **Constat** : les tests n'assertent qu'un champ par commande. Non couverts : `about` bio + localisation (l.43-48) ; `experience` dates (l.55-62) ; `projects` description, stack, lien, et surtout `target`/`rel` du lien (l.74-78) — la Global Constraint « liens externes » n'est testée que pour `contact` ; `skills` items (l.79-83) ; `education` école + années (l.84-88) ; `experience <n>` invalide : seul l'usage est vérifié, pas le « message clair » (l.69-73). Côté §8 : « exception dans run → terminal toujours utilisable » n'est testé qu'au niveau registre (registry.test.ts:46-54), jamais via `Terminal` ; commande inconnue idem (registry.test.ts:38-44).
- **Scénario d'échec** : quelqu'un retire `rel="noopener noreferrer"` de `projects.tsx:20`, ou supprime `{p.url && …}` / `{profile.location}` → tous les tests restent verts.
- **Fix** : ajouter, par commande, une assertion sur chaque champ du tableau §6.3 et, pour `projects`, `querySelectorAll("a")` avec `target`/`rel` ; ajouter un test `Terminal` avec un registre qui lève puis une seconde commande qui s'exécute.

## Mineur

### M1 — Aucun ErrorBoundary autour des sorties
- `src/components/Terminal/OutputLine.tsx:13` / `src/components/Terminal/Terminal.tsx:65-67`. Le `try/catch` de `registry.ts:38-42` ne couvre que `run()`. Si une future commande renvoie un composant qui lève au rendu, toute l'app démonte (spec §6.2 « le terminal ne plante jamais »). Aucune commande actuelle ne le fait (toutes renvoient du JSX hôte).
- **Fix** : envelopper `entry.output` dans un petit ErrorBoundary qui affiche `error: <name> failed`.

### M2 — Classe CSS `styles.log` inexistante
- `src/components/Terminal/Terminal.tsx:64` référence `styles.log`, absente de `Terminal.module.css` → `className={undefined}`. Sans effet visible, code mort.
- **Fix** : supprimer le `className` ou ajouter `.log {}` si un style est prévu.

### M3 — Clés React dérivées du contenu
- `src/commands/education.tsx:10` (`e.degree`), `projects.tsx:10` (`p.name`), `skills.tsx:10` (`s.category`), `experience.tsx:37` (`h`). Si l'utilisateur, en éditant `src/content/`, met deux diplômes au même intitulé (ex. deux « BSc »), React émet un warning de clé dupliquée et peut mal réconcilier.
- **Fix** : clé composite (`${e.degree}-${e.school}-${e.start}`) ou index pour des listes statiques.

### M4 — Message d'argument invalide non stylé en erreur
- `src/commands/experience.tsx:25-28` : `<p>error: invalid …</p>` sans `className="text-error"`, alors que les autres erreurs (registry.ts:15) sont rouges. Incohérence visuelle §8.
- **Fix** : `<p className="text-error">`.

### M5 — Suggestions du bienvenue non liées au registre
- `src/app/Portfolio.tsx:10` : liste de noms en dur. Si une commande est renommée dans `src/commands/`, le bouton affiche `command not found` ; aucun test ne le détecte.
- **Fix** : test `suggestions.every(s => registry.list().some(c => c.name === s))` ou dériver la liste du registre.

### M6 — `createRegistry` n'impose pas les noms en minuscules
- `src/core/registry.ts:20-24`. Le contrat §5 exige `name` en minuscules ; une commande `"About"` serait enregistrée mais injoignable (le parser met `name` en minuscules) et apparaîtrait quand même dans `help`.
- **Fix** : lever une erreur si `cmd.name !== cmd.name.toLowerCase()` (comme pour les doublons).

### M7 — Exception avalée sans trace
- `src/core/registry.ts:40` : `catch {}` sans `console.error`. En prod, une commande cassée n'affiche que `error: x failed` sans aucune info de débogage.
- **Fix** : `catch (err) { console.error(err); return errorLine(…) }`.

### M8 — Indicateur de focus supprimé sur l'input
- `src/components/Terminal/Terminal.module.css:81` : `outline: 0` ; seul le caret signale le focus (spec §6.6 « utilisable au clavier seul »). À confirmer par 5b.
- **Fix** : style `:focus-visible` sur `.promptRow` (ex. `:has(.input:focus-visible)` souligné accent).

### M9 — Refocus systématique de l'input après chaque exécution / clic
- `src/components/Terminal/Terminal.tsx:48` et `:56-58`. Un clic sur une suggestion (ou n'importe où) appelle `focus()` dans un geste utilisateur → sur mobile, le clavier virtuel s'ouvre et réduit la zone où s'affiche la sortie qu'on vient de demander. Conforme à la lettre de §6.5, mais va contre l'intention « aide le mobile » du bienvenue. À valider en e2e/UX (5a/5b).
- **Fix** : ne pas refocus après un `run` déclenché par une suggestion sur pointeur tactile (`matchMedia("(pointer: coarse)")`).

## Rulings

Aucun désaccord : l'assemblage dans `src/app/Portfolio.tsx` respecte la règle de dépendance ; le composant `WelcomeSlot` (Terminal.tsx:16-18) est correct.

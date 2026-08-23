# calorie-ledger

A SvelteKit app for tracking daily nutrition and energy balance. The main UI is a single-entry form
grouping the day's figures (date, weight, macros, calories, TEF/NEAT/EAT/BMR, maintenance) into
`EntryCard` sections.

## Status
Early-stage. Drizzle is wired up against Postgres, the `user`, `session`, and `entry` tables are
defined under [src/lib/server/db/models/](src/lib/server/db/models/), and their migrations are
committed under [drizzle/](drizzle/). The auth endpoints in
[src/routes/api/auth/](src/routes/api/auth/) are implemented; the ledger routes under
[src/routes/api/ledger/](src/routes/api/ledger/) are still empty skeletons, and the entry form in
[src/routes/+page.svelte](src/routes/+page.svelte) is local state only — nothing reads or writes the
ledger yet. Calories and TEF are `$derived` from the macro inputs; the remaining figures are entered
by hand.

## Stack

- **SvelteKit 2** with `adapter-auto`, **Svelte 5**, **Vite 8**, **TypeScript** (`strict`, `checkJs`)
- There is no `svelte.config.js` — SvelteKit is configured through the `sveltekit()` plugin options
  in [vite.config.ts](vite.config.ts).
- **Runes mode is forced** for all project files (see the `compilerOptions.runes` callback in
  [vite.config.ts](vite.config.ts)). Never use legacy `export let`, `$:`, or stores-as-state in
  `src/`.
- **Drizzle ORM** over `postgres-js`, against the Postgres service in [compose.yaml](compose.yaml).
  `DATABASE_URL` is required and read from `$env/dynamic/private`.
- **Tailwind CSS v4** via `@tailwindcss/vite` — CSS-first config, no `tailwind.config.js`. Theme
  tokens are declared in the `@theme inline` block of [src/app.css](src/app.css) and map onto plain
  `:root` custom properties that are swapped under `prefers-color-scheme`, so every token is
  theme-aware. Style from those tokens (`bg-surface`, `text-muted`, `border-line`, …) rather than
  hard-coded palette colours, and add a new look by adding a token pair, not a one-off colour.

## Commands

- `npm run dev` — dev server
- `npm run check` — `svelte-check` type checking. This is the verification command; run it after
  non-trivial changes.
- `npm run build` / `npm run preview`
- `npm run db:start` — bring up the Postgres container
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — drizzle-kit

**Do not run `npm run lint`, `npm run format`, `prettier`, or `eslint` unless I explicitly ask.**
Write code that already matches the Prettier config instead (see below).

## Formatting

Match [prettier.config.js](prettier.config.js) by hand: **tabs** for indentation, single quotes,
trailing commas everywhere, 100-char print width. Editor `formatOnSave` is on, so files may be
reformatted out from under you — don't fight it, just write conforming code.

Tailwind class order follows `prettier-plugin-tailwindcss`. Multi-line `class` strings are fine;
keep related variants grouped on a line.

Write minimal comments. Don't add step-by-step or line-by-line comments explaining what code does;
prefer code that's clear enough not to need them. Where a comment does earn its place it explains
*why* — a security property, an ordering constraint, a non-obvious workaround.

## Imports

Anything under `src/lib` is imported through the `$lib` alias, never a relative path that climbs out
of a directory. Modules that live beside a route (e.g. `src/routes/api/auth/utils.ts`) are imported
relatively from that route's siblings. The one hard exception is models, which import each other by
same-directory relative path — see below.

## Model conventions

Every database table lives in its own file at `src/lib/server/db/models/{model_name}.ts` — one
`pgTable` per file, the file named in snake_case after the table and the exported const in camelCase.
Never add a second table to an existing model file; add a new file.

- Alongside the table, export its inferred row types: `export type X = typeof x.$inferSelect` and
  `NewX` from `$inferInsert`.
- [drizzle.config.ts](drizzle.config.ts) picks the directory up by glob, so a new model needs no
  config change.
- [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts) is a barrel that re-exports every model.
  Add the new one there too, so relational queries on `db` can see it.
- Models reference each other by same-directory relative path (`./user`) — `drizzle-kit` loads these
  files outside Vite and can't resolve aliases. Everything *outside* the models directory imports
  through the `$lib/server/db/schema` barrel.
- Foreign keys to `user` cascade on delete. Values the database can compute (e.g. `entry.balance`)
  are generated columns rather than application code, and multi-column uniqueness is a named
  `unique()` constraint.
- Schema changes are captured as generated migrations that get committed; don't hand-edit the files
  under `drizzle/`.

## API route conventions

Routes live at `src/routes/api/.../+server.ts` and export handlers typed as `RequestHandler`.

- Validate the request body before touching the database, with a local `isBodyValid`-style predicate
  that narrows `unknown`; reply `400` with a short lowercase `{ message }` when it fails.
- Wrap database work in `try`/`catch` and funnel errors through `parseDBError` from
  [src/lib/server/db/errorHandler.ts](src/lib/server/db/errorHandler.ts), returning its `message` at
  its `status`. That module maps Postgres error codes to responses and logs the schema detail rather
  than leaking it to the caller — extend the map there instead of hand-writing error branches.


## Component conventions

Follow the pattern established by [InputField.svelte](src/lib/components/ui-kit/InputField.svelte).
Generic, reusable fields live in `src/lib/components/ui-kit/`; components specific to this app's
layout sit directly in `src/lib/components/`.

# calorie-ledger

A SvelteKit app for tracking daily nutrition and energy balance. The main UI is a spreadsheet-like
table of daily entries (date, weight, calories, macros, TEF/NEAT/EAT/BMR, maintenance, balance).
Early-stage: no data layer, persistence, or server routes yet — only the table skeleton in
[src/routes/+page.svelte](src/routes/+page.svelte) and field components in
[src/lib/components/](src/lib/components/).

## Stack

- **SvelteKit 2** with `adapter-auto`, **Svelte 5**, **Vite 8**, **TypeScript** (`strict`, `checkJs`)
- **Tailwind CSS v4** via `@tailwindcss/vite` — CSS-first config, no `tailwind.config.js`. Theme
  tokens live in the `@theme` block of [src/app.css](src/app.css) (`--color-primary`,
  `--color-secondary`); light/dark values are plain `:root` custom properties under
  `prefers-color-scheme`.
- **Runes mode is forced** for all project files (see the `compilerOptions.runes` callback in
  [vite.config.ts](vite.config.ts)). Never use legacy `export let`, `$:`, or stores-as-state in
  `src/`.

## Commands

- `npm run dev` — dev server
- `npm run check` — `svelte-check` type checking. This is the verification command; run it after
  non-trivial changes.
- `npm run build` / `npm run preview`

**Do not run `npm run lint`, `npm run format`, `prettier`, or `eslint` unless I explicitly ask.**
Write code that already matches the Prettier config instead (see below).

## Formatting

Match [prettier.config.js](prettier.config.js) by hand: **tabs** for indentation, single quotes,
trailing commas everywhere, 100-char print width. Editor `formatOnSave` is on, so files may be
reformatted out from under you — don't fight it, just write conforming code.

Tailwind class order follows `prettier-plugin-tailwindcss`. Multi-line `class` strings (as in the
table in `+page.svelte`) are fine; keep related variants grouped on a line.

## Component conventions

Follow the pattern established by [InputField.svelte](src/lib/components/InputField.svelte):

- Public types and any static lookup tables go in `<script module lang="ts">` and are exported, so
  wrappers can import them: `import InputField, { type InputFieldProps } from './InputField.svelte'`.
- Props are declared as an exported `interface XProps` and destructured with
  `const { ... }: XProps = $props()` — `const`, not `let`, unless the value is actually reassigned.
- Style variants use a `Record<Variant, Record<Part, string>>` map keyed by variant name and by
  named part of the component (`label`, `wrapper`, `input`), with a default variant in the props
  destructuring. Add new looks as entries in that map rather than conditional class logic in markup.
- Slots are Svelte 5 `Snippet` props (e.g. `leftAdornment`, `rightAdornment`), rendered by
  interpolating the snippet.
- Wrapper components (e.g. [NumberField.svelte](src/lib/components/NumberField.svelte)) `Omit` the
  base prop they retype and spread the rest through.
- Import via the `$lib` alias, never relative paths that climb out of a directory.

## Commit style

Short, lowercase, imperative-ish subject lines with a bare prefix and no colon: `feat InputField`,
`feat data table skeleton`, `init prettier`. No body unless the change needs one.

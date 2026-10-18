# Development

How development is performed in this repository, for both humans and AI agents.
User-facing setup lives in the README; this document is for people changing the code.

## Setup

All tools are managed by mise.

```bash
mise install
```

| Tool      | Purpose           | Managed via |
| --------- | ----------------- | ----------- |
| node 24   | Runtime (LTS)     | `mise.toml` |
| pnpm 12   | Package manager   | `mise.toml` |
| oxlint    | Linter            | `mise.toml` |
| oxfmt     | Formatter         | `mise.toml` |
| prek      | Pre-commit hooks  | `mise.toml` |
| cocogitto | Commit validation | `mise.toml` |

Do not substitute tools without explicit approval (see the guidelines repository's toolchain standards).

## Commands

```bash
mise run dev                # dev server (builds tokens first)
mise run build              # tokens + production site build
mise run check              # full validation — what CI runs
```

`mise run` lists every task.

## Workflow

1. Branch from `main`
2. Make the smallest complete change
3. `mise run check` must pass
4. Commit with Conventional Commits (validated by Cocogitto)
5. Open a PR following [CONTRIBUTING.md](./CONTRIBUTING.md)

## Token pipeline

Edit only `tokens/**/*.json` (DTCG format, `$value`/`$type`, `{group.token}` references). Then:

```bash
mise run build
```

`scripts/build-tokens.mjs` writes three committed artifacts to `dist/`:
`tokens.css` (`:root` light + `.dark` overrides, palette + semantics + typography),
`tailwind.css` (`@theme inline` adapter for Tailwind v4),
`tokens.flat.json` (resolved color data for the preview site).

The Style Dictionary warning about filtered references in `tokens.dark.css` is intentional: the `.dark` block references palette variables that live in the `:root` block of the same file.

## Regenerating the Plex SC stylesheet

`site/src/styles/plex-sans-sc.css` slices the official `@ibm/plex-sans-sc` package
(Fontsource has no SC build; the package's own `all.css` ships unsliced multi-megabyte fallbacks).
After upgrading the package, regenerate it (weights 400 and 600, split subsets only):

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('node_modules/@ibm/plex-sans-sc/css/ibm-plex-sans-sc-all.css','utf8');
const blocks = css.match(/@font-face\s*{[^}]*}/g) ?? [];
const keep = blocks.filter(b => b.includes('unicode-range') && /font-weight: (400|600);/.test(b))
  .map(b => b.replaceAll('../fonts/', '@ibm/plex-sans-sc/fonts/'));
fs.writeFileSync('site/src/styles/plex-sans-sc.css',
  '/* Generated from @ibm/plex-sans-sc/css/ibm-plex-sans-sc-all.css: sliced rules for weights 400 and 600 only. */\n' + keep.join('\n') + '\n');
"
```

## Layout

- `tokens/` — DTCG sources (primitives + semantic light/dark)
- `scripts/` — Style Dictionary build pipeline
- `dist/` — committed token artifacts
- `site/` — Vite + Tailwind v4 preview site; entry `site/src/main.ts`, i18n in `site/src/i18n.ts`

## Validation

`mise run check` is the entry point: oxlint (with Tailwind class sorting), oxfmt check, tsc --noEmit.
The same command runs in CI via mise.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: build, then deploy `site/dist` to
GitHub Pages at https://fang2hou.github.io/design-tokens/ . CI (`.github/workflows/ci.yml`)
validates every push and pull request.

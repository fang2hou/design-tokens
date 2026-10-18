# AGENTS.md

Guidance for AI agents working in this repository. Read this before making changes.

A personal design token system (DTCG sources → CSS variables + Tailwind v4 theme) with a trilingual preview site.

## Commands

```bash
mise install                 # set up the toolchain
mise run dev                 # start the preview site dev server
mise run build               # build tokens (dist/) and the site (site/dist/)
mise run lint                # oxlint, includes Tailwind class sorting
mise run typecheck           # tsc --noEmit
mise run format              # oxfmt --write .
mise run check               # lint + format check + typecheck — run before every commit
```

Use `pnpm` for package operations, never npm or yarn. Node and all tools come from `mise.toml`.

## Engineering Standards

This project follows the shared engineering guidelines:

> https://github.com/fang2hou/ai-coding-guidelines (see PORTAL.md reading recipes)

Repository documentation always takes precedence over remembered summaries.

Project-specific overrides:

- `dist/` is generated but **committed** (consumers use git dependencies without a build step). Regenerate with `mise run build:tokens` after editing tokens; never hand-edit `dist/`.
- `site/src/styles/plex-sans-sc.css` is generated from the `@ibm/plex-sans-sc` package (sliced @font-face rules, weights 400/600 only). Regenerate after upgrading that package — see DEVELOPMENT.md.

## Layout

- `tokens/primitives/` — DTCG sources: palette, typography, radius, spacing
- `tokens/semantic/` — DTCG sources: light/dark color roles
- `scripts/build-tokens.mjs` — Style Dictionary pipeline producing `dist/`
- `dist/` — committed build artifacts (tokens.css, tailwind.css, tokens.flat.json)
- `site/` — Vite + Tailwind v4 preview site (trilingual, light/dark, corner demos)

## Boundaries

Always:

- Run `mise run check` before every commit
- Keep each change minimal and scoped to the request
- Edit token values only in `tokens/`, then rebuild

Never:

- Hand-edit files under `dist/`
- Add SVG/JS polyfills for `corner-shape` (progressive enhancement only; this is a standing guideline)
- Load font weights beyond what the site uses

Ask first:

- New dependencies
- Renaming semantic tokens (consumers depend on the names)
- Changing the two-tier primitive/semantic split

## Confirmed Language Policy

| Item                      | Value                                       |
| ------------------------- | ------------------------------------------- |
| Conversation              | `follows the user`                          |
| Code / comments / commits | English                                     |
| UI language               | `switchable zh-CN / ja / en, default zh-CN` |
| Tone                      | `neutral, concise`                          |

UI text lives in `site/src/i18n.ts` as parallel dictionaries; keep all three languages in sync. Do not infer UI language from conversation language.

## Project Conventions

- Semantic color names align with shadcn/ui conventions plus DaisyUI status colors (info/success/warning); document any deviation in the token `$description`.
- Dark mode is a `.dark` class on `<html>` overriding the same semantic variables; light values live in `:root`.
- Font stacks and reading metrics come from CLREQ/JLREQ research — see the research repository's `2026-10_design-token-system/notes/fonts-typography-research.md` before changing typography tokens.
- Corner radius follows the guideline token scale (6/8/12/20/9999) with the concentric rule `r = R − p` for nesting.

Depth: [DEVELOPMENT.md](./DEVELOPMENT.md) for workflow and toolchain, [CONTRIBUTING.md](./CONTRIBUTING.md) for PR rules.

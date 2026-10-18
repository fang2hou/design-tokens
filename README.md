<div align="center">

# design-tokens

Personal design token system: DTCG sources compiled to CSS variables and a Tailwind v4 theme, previewed on a trilingual site.

[![CI](https://github.com/fang2hou/design-tokens/actions/workflows/ci.yml/badge.svg)](https://github.com/fang2hou/design-tokens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

One DTCG token source drives everything: light/dark semantic colors on a Gruvbox Material (mix / hard) base, per-script font stacks for Chinese, Japanese, and English, a radius scale with continuous corners, and reading-typography parameters from CLREQ/JLREQ. The same source compiles to plain CSS variables, a Tailwind v4 `@theme` adapter, and the data behind the preview site.

## 🚀 Quick Start

**With an AI coding agent** — paste this into the agent to hand it the repository:

```text
Work in this repository. Read AGENTS.md at the repository root first and follow it.
```

**As a human** — requires [mise](https://mise.jdx.dev/) on macOS or Linux. Runtime versions are pinned in `mise.toml`.

```bash
mise install
mise run dev
```

The preview site starts on the printed Vite URL. `mise run` lists every other task (`build`, `check`, `lint`, `typecheck`).

<details>
<summary>Consume the tokens from another project</summary>

The `dist/` artifacts are committed, so a git dependency works without a build step:

```bash
pnpm add design-tokens@github:fang2hou/design-tokens
```

```css
@import "tailwindcss";
@import "design-tokens/dist/tokens.css";
@import "design-tokens/dist/tailwind.css";
```

Plain CSS variables without Tailwind: import `design-tokens/dist/tokens.css` only.

</details>

## 💡 Concepts

- **Two token tiers** — `tokens/primitives/` holds raw values (the Gruvbox-based palette, font stacks, scales); `tokens/semantic/` maps them to UI roles (`--background`, `--primary`, …) per light/dark mode.
- **One source, three artifacts** — `scripts/build-tokens.mjs` compiles the DTCG JSON into `dist/tokens.css` (CSS variables), `dist/tailwind.css` (`@theme inline` adapter), and `dist/tokens.flat.json` (site data).
- **Continuous corners** — the radius scale pairs with `corner-shape: squircle`; Chromium renders it, other browsers fall back to plain round corners.

## ✨ Features

- **Trilingual by construction** — UI text switches between 简体中文 / 日本語 / English; font stacks and reading metrics (measure, leading, paragraph spacing) are per-script tokens.
- **Commercial-safe fonts** — IBM Plex (OFL) for sans and mono, Source Serif 4 + Noto Serif CJK (OFL) for long-form reading.
- **Click-to-copy palette** — every swatch on the site copies its CSS variable name.

## 📚 Learn More

| Goal                 | Read                                 |
| -------------------- | ------------------------------------ |
| Develop and validate | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change  | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Give it to an agent  | [AGENTS.md](./AGENTS.md)             |

## 📄 License

MIT — see [LICENSE](./LICENSE). Colors derive from [gruvbox-material](https://github.com/sainnhe/gruvbox-material) (MIT); bundled webfonts are OFL-1.1 (IBM Plex, Source Serif 4, Noto Serif).

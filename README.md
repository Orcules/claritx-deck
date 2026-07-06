# ClaritX — Investor Pitch Deck

**An interactive, code-driven pitch deck built as React components — slides as JSX, with runtime layout, scaling, navigation, and fullscreen play mode.**

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![open-slide](https://img.shields.io/badge/open--slide-1e293b) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**▶ Live demo:** [orcules.github.io/claritx-deck](https://orcules.github.io/claritx-deck/)

---

<p align="center">
  <img src="slides/claritx-pitch-v5/assets/home-hero.png" alt="ClaritX — the AI market-research & portfolio platform this deck pitches" width="760">
</p>

## 🎯 Overview

This is the investor / product pitch deck for **ClaritX** (an AI-powered stock-analysis platform), built not in slide software but as a **React application**. Each slide is a component, so the deck is version-controlled, themeable, responsive, and deployable as a static site — and content like charts, tables, and interactive elements are real code rather than static images.

It's built on the [`open-slide`](https://www.npmjs.com/package/@open-slide/core) framework: you write pages as React components and the runtime handles layout, scaling to any screen, thumbnails, keyboard navigation, and fullscreen presentation mode.

## ✨ Highlights

- **Slides as components** — every page under `slides/claritx-pitch-v5/` is JSX; layout and scaling are handled by the `@open-slide/core` runtime.
- **Responsive & self-scaling** — the deck fits any display without manual resizing.
- **Presentation mode** — keyboard navigation, thumbnails, and fullscreen play.
- **Static deployment** — ships as a static build (Netlify / Vercel configs included).

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React, TypeScript |
| Deck runtime | `@open-slide/core` |
| Build | Vite |
| Deployment | Netlify / Vercel (static) |

## 🚀 Getting Started

```bash
# install
npm ci

# run the dev server
npm run dev

# build the static site
npm run build
```

Slides live under `slides/claritx-pitch-v5/index.tsx`. Presentation config is in `open-slide.config.ts`.

## 📁 Structure

```
claritx-deck/
├── slides/claritx-pitch-v5/   # the deck — pages as React components + assets
├── public/                    # static assets + research pages
├── open-slide.config.ts       # deck configuration
└── netlify.toml / vercel.json # static deployment
```

## License

Released under the [MIT License](LICENSE). Personal portfolio project.

# SmartXChain — Frontier

A specialist publication for Web3, AI, and deep tech. **Signal from the frontier.**

Built with [Astro](https://astro.build) + MDX + Tailwind. Hosted on Cloudflare Pages.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output → ./dist
npm run preview      # serve the build locally
npm run check        # type + content schema check
npm run format       # prettier
```

Requires Node 18.17.1+ (we currently pin Astro to 4.x for that compatibility).
Cloudflare Pages provisions Node automatically — see `.nvmrc`.

## Layout

```
.
├── src/
│   ├── pages/            # routes (file-based)
│   ├── layouts/          # shared page shells
│   ├── components/       # reusable .astro components
│   ├── content/          # MDX articles + author profiles
│   └── styles/           # global CSS
├── public/               # static assets (favicon, OG fallbacks, robots.txt)
├── docs/
│   ├── specs/            # design specs (markdown)
│   ├── plans/            # implementation plans (markdown)
│   └── EDITORIAL.md      # house style for writers (added in Phase 2)
├── concepts.html         # original brand concept comparison
└── spec.html             # canonical visual spec (Frontier-aesthetic)
```

## Publishing a post

1. Create `src/content/posts/YYYY-MM-DD-slug.mdx`
2. Fill in frontmatter — full reference in [`docs/EDITORIAL.md`](docs/EDITORIAL.md)
3. `git push` — Cloudflare Pages builds and deploys automatically (~2 min)

Quick frontmatter cheatsheet:

```yaml
---
title: "Your headline"
date: 2026-05-23T06:14:00Z
author: hector-garza
category: chain-watch    # or ai-lab, deep-tech, markets, research, opinion
tags: ["tag-one", "tag-two"]
excerpt: "One-sentence hook (max 280 chars)."
featured: false
---
```

## Deploys

| Branch | URL |
|---|---|
| `main` | https://smartxchain.com (after Phase 11) |
| `main` | https://smartxchain.pages.dev (always) |
| any PR | unique preview URL from Cloudflare Pages |

## Stack

- **Astro 4** — static site generator
- **MDX** — markdown with embedded components
- **Tailwind CSS** — utility-first styling
- **Pagefind** — static, in-browser full-text search (added in Phase 6)
- **Buttondown** — newsletter (added in Phase 8)
- **Cloudflare Pages** — hosting + edge CDN
- **Cloudflare Web Analytics** — privacy-friendly analytics

No database. No server. See `docs/specs/2026-05-23-frontier-design.md` for the full rationale.

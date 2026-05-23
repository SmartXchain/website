# SmartXChain — Frontier · Design Spec

**Status:** Approved · 2026-05-23
**Visual companion:** `spec.html` (canonical visual reference)
**Owner:** Hector Garza (hectorg@smartxchain.com)

## Summary

A specialist tech publication for the convergence of **Web3, AI, and deep tech**. Statically generated, edge-served, no database in v1. Built on Astro + MDX + Tailwind, hosted on Cloudflare Pages, domain on Route 53 (nameservers cut over to Cloudflare).

**Tagline:** "Signal from the frontier."

## Editorial structure

Six sections, each becoming a category page, sidebar feed, and tag namespace:

| Section | Slug | Covers |
|---|---|---|
| Chain Watch | `/chain-watch` | L1/L2 protocols, onchain flows, regulation |
| AI Lab | `/ai-lab` | Frontier models, agents, benchmarks, alignment |
| Deep Tech | `/deep-tech` | Fusion, quantum, biotech, robotics, hard tech |
| Markets | `/markets` | Funding, M&A, public-market signal |
| Research | `/research` | Long-form deep dives, original analysis |
| Opinion | `/opinion` | Editor's note, guest essays |

## Architecture

```
Author → GitHub repo → Cloudflare Pages (build) → Cloudflare Edge CDN → Reader

Static output: HTML + Pagefind search index + RSS + sitemap + OG images
Runtime client fetches: CoinGecko (ticker), Buttondown (newsletter), CF Web Analytics
```

Every page is built ahead of time. No backend to maintain.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** | Zero-JS by default, first-class MDX, ideal for content sites |
| Styling | **Tailwind CSS** | Token-driven, ~10KB after purge, easy theme maintenance |
| Content | **MDX in Git** | Markdown + components, version-controlled, no CMS lock-in |
| Search | **Pagefind** | Static index, in-browser query, zero server cost |
| Newsletter | **Buttondown** | Indie, free up to 100 subs, $9/mo to 1K, simple API |
| Analytics | **CF Web Analytics** | Privacy-friendly, free, no cookie banner |
| Hosting | **Cloudflare Pages** | Free tier covers our needs, edge CDN, auto SSL, preview deploys |
| Repo | **GitHub** (private until launch) | Standard, integrates natively with CF Pages |

## Storage

**No database in v1.** Decision rationale and data placement:

| Data | Where it lives |
|---|---|
| Articles | `src/content/posts/*.mdx` (Git) |
| Categories/tags | Post frontmatter |
| Author bios | `src/content/authors/*.md` (Git) |
| Archive index | Built at build time |
| Search index | Pagefind static JSON |
| Live ticker | Client-side fetch (CoinGecko) |
| Newsletter subs | Buttondown's DB |
| Analytics | Cloudflare Web Analytics |

Add Cloudflare D1 (SQLite at edge, free tier 5M reads/mo) later if/when we add gated content, self-hosted comments, user accounts, or paid tiers.

## Content schema

Astro content collection with typed frontmatter:

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title:     z.string().max(120),
    slug:      z.string(),
    date:      z.date(),
    updatedAt: z.date().optional(),
    author:    z.string(),
    category:  z.enum(['chain-watch','ai-lab','deep-tech','markets','research','opinion']),
    tags:      z.array(z.string()).default([]),
    excerpt:   z.string().max(280),
    hero:      image().optional(),
    featured:  z.boolean().default(false),
    draft:     z.boolean().default(false),
  }),
});

export const collections = { posts };
```

## Sitemap

| Route | Purpose |
|---|---|
| `/` | Homepage (hero featured + signal sidebar + category grid + signal-of-the-week) |
| `/<section>` | Category index (6 routes, paginated 20/page) |
| `/posts/[slug]` | Article page |
| `/archive` | Full archive (paginated, filterable by category/year, searchable) |
| `/tags/[tag]` | Tag pages |
| `/authors/[slug]` | Author bio + posts |
| `/search` | Pagefind-powered search |
| `/newsletter` | Subscription landing |
| `/about`, `/contact`, `/privacy` | Standard pages |
| `/rss.xml`, `/sitemap-index.xml`, `/og/[slug].png` | Auto-generated |

## Archive design

- Reverse-chronological list, 20 per page
- Filter chips: category + year (URL-state preserved)
- Pagefind search bar
- Pagination at `/archive/1`, `/archive/2`, … (SEO-friendly static)

## DNS plan

**Option B (approved):** Keep registrar at AWS Route 53, move nameservers to Cloudflare.

Cutover steps (Phase 11):
1. Add `smartxchain.com` to Cloudflare (free plan)
2. Note CF nameservers (e.g., `*.ns.cloudflare.com`)
3. Audit existing Route 53 records — **preserve any MX records for email**
4. In Route 53 console → Registered domains → replace AWS nameservers with CF's
5. Wait 1–24h for propagation
6. Add custom domains in Pages: `smartxchain.com` + `www.smartxchain.com`
7. Set redirect: `www → apex`
8. Delete Route 53 Hosted Zone

## Cost

| Item | Monthly |
|---|---|
| Cloudflare Pages | $0 |
| Cloudflare DNS | $0 |
| CF Web Analytics | $0 |
| Domain renewal (R53) | ~$1.25 |
| Buttondown (≤100 subs) | $0 |
| GitHub | $0 |
| **Total v1** | **~$1.25/mo** |

## Approved defaults

User approved with all §11 defaults from `spec.html`:

1. Tagline: "Signal from the frontier."
2. Six categories as listed above
3. Newsletter: Buttondown
4. Solo author, schema team-ready
5. Typographic logo (`▲ SMARTXCHAIN` in IBM Plex Mono) — no separate logo design for v1
6. Nameserver cutover to Cloudflare approved (executed in Phase 11)
7. Repo private until launch

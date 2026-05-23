# SmartXChain — Frontier · Implementation Plan

**Spec:** `docs/specs/2026-05-23-frontier-design.md`
**Visual:** `spec.html`
**Approved:** 2026-05-23 — proceeding with all §11 defaults.

## Build order

12 phases, each independently shippable. Commit at the end of each phase. User reviews the deployed preview before moving to the next phase.

---

## Phase 0 — Tooling & first deploy

**Goal:** Live Astro site at `smartxchain.pages.dev`. Empty homepage, but the full pipeline (Git push → CF Pages build → edge serve) is verified end-to-end.

**Tasks:**
1. Scaffold Astro project at repo root using TypeScript "Strict" template
2. Install integrations: `@astrojs/mdx`, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`
3. Install Tailwind dependencies + create `tailwind.config.mjs` with Frontier color/font tokens
4. Install dev deps: Prettier (with Astro plugin), ESLint with Astro config
5. Add `.gitignore`, `.editorconfig`, `.nvmrc` (node 20)
6. Create a placeholder homepage (`src/pages/index.astro`) — title only, blank body
7. Verify local dev (`npm run dev`) and build (`npm run build`)
8. **User action:** create private GitHub repo `smartxchain-site`, push initial commit
9. **User action:** connect repo to Cloudflare Pages (framework preset: Astro)
10. Verify first deploy at `smartxchain.pages.dev`

**Deliverable:** Live URL, screenshot.

---

## Phase 1 — Design system

**Goal:** Reusable components and tokens matching the Frontier aesthetic from `concepts.html`.

**Tasks:**
1. Tailwind config: extend with frontier colors (`bg-frontier`, `accent-signal-green`, etc.), fonts (Fraunces/Inter/IBM Plex Mono), spacing scale
2. Load Google Fonts via Astro `<link>` in base layout (preconnect + preload)
3. Base layout component `src/layouts/Base.astro` (HTML shell + meta + body wrapper)
4. `<Header>` component — wordmark, primary nav (six categories + Archive + Search), live ticker bar (static placeholder for now)
5. `<Footer>` component — secondary nav, newsletter snippet, social, copyright
6. Typography utilities — `<H1>`, `<H2>`, `<Kicker>`, `<Mono>` helpers if needed
7. Per-section accent color tokens (Chain Watch / AI Lab / etc.) — subtle differentiator
8. Storybook-equivalent: a `/styleguide` route showing all components (dev-only via env flag)

**Deliverable:** Deployed preview showing header/footer + style guide.

---

## Phase 2 — Content schema + seed posts

**Goal:** Type-checked content collection ready to receive articles; design has real content to render.

**Tasks:**
1. `src/content/config.ts` — define `posts` collection with schema from spec §05
2. Define `authors` collection (`name`, `slug`, `bio`, `avatar`, `twitter`, `github`)
3. Write 3 author entries: one real (Hector), two placeholders
4. Write 5 seed posts spanning all 6 categories (one shared between Markets/Opinion):
   - `2026-05-23-opus-4-7-agent-economy.mdx` (AI Lab, featured)
   - `2026-05-22-solana-stress-test.mdx` (Chain Watch)
   - `2026-05-21-fusion-grid-moment.mdx` (Deep Tech)
   - `2026-05-20-evals-as-a-service.mdx` (AI Lab)
   - `2026-05-19-intent-dex-volumes.mdx` (Research)
5. `docs/EDITORIAL.md` — house style guide, frontmatter reference, MDX components reference
6. README updates with content authoring instructions

**Deliverable:** `npm run build` passes with content present, drafts excluded.

---

## Phase 3 — Homepage

**Goal:** Production homepage matching the Concept A mockup in `concepts.html`.

**Tasks:**
1. Hero block: latest `featured: true` post — kicker (category), large headline, dek, byline, hero image
2. Signal sidebar: 4 latest non-featured posts, terminal style, with timestamps
3. Category grid: top story from each of 3 priority categories (configurable), 3-up
4. "Signal of the Week" block: editor pick + simple SVG bar chart placeholder + pull quote
5. Ticker bar (still static — moves to live in Phase 7)
6. Responsive breakpoints: mobile collapses everything to single column
7. View Transitions API for smooth nav (Astro built-in)

**Deliverable:** Production-quality homepage at preview URL.

---

## Phase 4 — Article, category, tag, author pages

**Goal:** All content-rendering routes complete.

**Tasks:**
1. `src/pages/posts/[slug].astro` — article template
   - Header: kicker, title, dek, byline (author component), publish date, updated date, read time
   - Body: MDX rendered with prose styles
   - Footer: tag pills, share buttons (Twitter, copy link), prev/next, "related" (3 posts from same category)
2. MDX components mounted globally:
   - `<Callout type="note|warn|signal">` — boxed asides
   - `<Quote attribution="...">` — pull quote
   - `<Figure src="..." caption="...">` — image with caption
   - `<Ticker symbols={...}>` — embedded mini ticker (uses Phase 7 fetcher)
   - `<Chart data={...}>` — simple SVG bar/line chart
3. `src/pages/[category]/index.astro` — dynamic category page (one route, six categories via getStaticPaths)
4. `src/pages/[category]/[page].astro` — paginated category pages (20/page)
5. `src/pages/tags/[tag].astro` — tag pages
6. `src/pages/authors/[slug].astro` — author bio + their posts

**Deliverable:** Browse from homepage → category → article → tag → author works end-to-end.

---

## Phase 5 — Archive (the one user explicitly asked for)

**Goal:** Comprehensive, scannable, filterable archive of every post.

**Tasks:**
1. `src/pages/archive/[page].astro` — paginated list, 20/page, reverse chronological
2. Each row: date · category badge · headline · author · read time. Dense, Bloomberg-feel.
3. Filter chips at top: All, Chain Watch, AI Lab, Deep Tech, Markets, Research, Opinion
4. Year filter dropdown (auto-populated from post dates)
5. URL state: `/archive/2?category=ai-lab&year=2026` — shareable, back-button safe
6. Filtering implemented with `URLSearchParams` and DOM hide/show (no JS framework needed)
7. "No results" empty state with helpful copy
8. JSON-LD `CollectionPage` schema

**Deliverable:** Functional, filterable archive.

---

## Phase 6 — Search

**Goal:** Fast, accurate search across all posts. Zero server cost.

**Tasks:**
1. Install Pagefind: `npm i -D pagefind`
2. Add post-build script: `pagefind --site dist`
3. `src/pages/search.astro` — dedicated search page with input + results
4. Header-mounted quick search: Cmd-K / Ctrl-K opens modal
5. Snippet highlighting, category filter passthrough
6. Index excludes drafts, sitemap, RSS pages

**Deliverable:** Search works on preview URL.

---

## Phase 7 — Live ticker

**Goal:** Real prices in the header ticker, updating every 60s.

**Tasks:**
1. `src/scripts/ticker.ts` — fetches CoinGecko `/simple/price` endpoint
2. Default symbols: BTC, ETH, SOL, plus an "AI chip" composite (NVDA via Yahoo Finance free endpoint as secondary fetch)
3. Symbols configurable via `src/data/ticker.json`
4. Initial fetch shows skeleton; subsequent updates animate change (green up, red down)
5. Caches result in `sessionStorage` (60s TTL) so nav doesn't re-fetch
6. Graceful degradation: if API fails, last cached value persists; if no cache, ticker hides
7. Re-usable `<Ticker>` component for embedding in articles

**Deliverable:** Live ticker on every page.

---

## Phase 8 — Newsletter signup

**Goal:** "The Chain Letter" subscription flow live.

**Tasks:**
1. User creates Buttondown account, configures sender + reply-to
2. Get embed snippet / API key
3. `src/components/SubscribeBox.astro` — minimal email input form (POST to Buttondown)
4. Embed: footer of every page, full block on `/newsletter` landing page, end of every article
5. Welcome email template ("The Chain Letter — welcome") configured in Buttondown
6. Privacy page mentions Buttondown as data processor
7. Confirmation flow: user gets confirm email, double opt-in (Buttondown default)

**Deliverable:** Working subscribe → confirm → welcome email flow.

---

## Phase 9 — SEO, RSS, sitemap, social images

**Goal:** Discoverable and shareable.

**Tasks:**
1. Per-page `<title>`, meta description, canonical URL
2. Open Graph tags + Twitter card on every page
3. JSON-LD `Article` schema on posts (helps Google News + Discover)
4. JSON-LD `Organization` + `Website` schema on homepage
5. `@astrojs/rss` — main feed `/rss.xml` (full content) + per-category feeds (`/<category>/rss.xml`)
6. `@astrojs/sitemap` — auto-generated; submit to Google Search Console
7. Dynamic OG images per post via Satori (build-time): `/og/[slug].png` — title + author + category accent
8. `robots.txt` allows all, points to sitemap
9. Verify with Twitter Card Validator + LinkedIn Post Inspector

**Deliverable:** Shareable links generate rich previews everywhere.

---

## Phase 10 — Performance + accessibility pass

**Goal:** Lighthouse 95+ across the board, accessibility audit clean.

**Tasks:**
1. Audit images: every `<img>` uses Astro `<Image>` with width/height/loading=lazy, AVIF+WebP output
2. Run Lighthouse on homepage, category page, article — fix anything below 95
3. Font loading: `font-display: swap` + preload critical weights
4. Inline above-the-fold CSS where Astro doesn't already
5. Keyboard navigation: tab order, focus rings visible against dark bg, skip-to-content link
6. Color contrast: run axe DevTools, fix anything below WCAG AA on dark bg
7. Alt text on every image, role/aria-label on icon buttons
8. Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>` used correctly
9. Reduced motion: respect `prefers-reduced-motion` for view transitions + ticker animations

**Deliverable:** Lighthouse + axe reports attached to PR.

---

## Phase 11 — Domain cutover + launch

**Goal:** smartxchain.com serves the production site over HTTPS.

**Pre-cutover audit:**
- List every existing Route 53 DNS record for `smartxchain.com`
- Critical: any MX records used for email? If yes, recreate in Cloudflare BEFORE nameserver switch
- Any TXT records (SPF, DKIM, domain verification)? Recreate.

**Tasks:**
1. User signs up for Cloudflare (free plan)
2. Add `smartxchain.com` site — let CF auto-import DNS, verify everything
3. CF provides 2 nameservers
4. User changes Route 53 nameservers to CF's
5. Wait for CF to email "site is active" (1–24h)
6. In Pages → Custom domains: add `smartxchain.com` + `www.smartxchain.com`
7. Cloudflare auto-issues SSL cert (Universal SSL)
8. Page Rule or Bulk Redirect: `www → apex`
9. Smoke test: site loads on apex, SSL valid, redirects work, RSS valid, sitemap valid
10. Delete Route 53 Hosted Zone (save the ~$0.50/mo)
11. Submit sitemap to Google Search Console
12. Announce launch (Twitter, newsletter, Hacker News if you're feeling brave)

**Deliverable:** smartxchain.com loads the production site.

---

## Open user actions during build

These are the only things I can't do for you. I'll flag each clearly when we reach it.

| When | Action |
|---|---|
| Phase 0 | Create GitHub repo `smartxchain-site` (private) |
| Phase 0 | Push initial commit (I'll prep, you authenticate + push) |
| Phase 0 | Sign in to Cloudflare, create Pages project, connect to repo |
| Phase 8 | Sign up at buttondown.email, share API key (or do the embed yourself) |
| Phase 11 | Sign up for Cloudflare (if not already), add the site |
| Phase 11 | Change Route 53 nameservers to Cloudflare's |
| Phase 11 | Submit sitemap to Google Search Console |

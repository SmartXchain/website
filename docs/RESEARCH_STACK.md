# Research stack — `/admin/research`

A private, server-rendered reading dashboard for editorial input. Aggregates:

- **AI papers** — arXiv (`cs.AI`, `cs.LG`, `cs.CL`)
- **AI company news (RSS)** — Google DeepMind, Hugging Face directly; Anthropic, Meta AI, OpenAI via Google News (none publish an RSS feed)
- **Markets** — Finnhub (preferred, real-time) with Alpha Vantage fallback

Nothing on this page is published. To publish commentary, write a normal post in `src/content/posts/`.

## Local development

1. Install the new deps (added in this scaffold):

   ```sh
   npm install
   ```

2. Create `.dev.vars` at the repo root (already gitignored by Wrangler convention; add it to `.gitignore` if not):

   ```ini
   FINNHUB_KEY=your_finnhub_key
   ALPHA_VANTAGE_KEY=your_alpha_vantage_key
   ```

3. Run the dev server:

   ```sh
   npm run dev
   ```

4. Visit http://localhost:4321/admin/research.

The page is `output: 'hybrid'` + `prerender = false`, so it server-renders on every request (live data, no caching beyond what the upstream APIs send).

## Production secrets (Cloudflare Workers)

Set the same env vars as Worker secrets so they're available at runtime:

```sh
npx wrangler secret put FINNHUB_KEY
npx wrangler secret put ALPHA_VANTAGE_KEY
```

Or via the Cloudflare dashboard → Workers & Pages → your project → Settings → Variables → "Encrypted".

## Locking down `/admin/*` with Cloudflare Access

The page is already excluded from `robots.txt` and `sitemap.xml`, and emits `<meta name="robots" content="noindex,nofollow">`. That hides it from search, but it's still public if someone guesses the URL. Add real auth with Cloudflare Access (free for up to 50 users):

1. Cloudflare dashboard → **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**.
2. **Application name**: `SmartXChain Admin`
3. **Session duration**: pick something sane (e.g., 24 hours).
4. **Application domain**: `smartxchain.com` with path `/admin/*`.
5. **Identity providers**: enable Google (or whichever you use) under Zero Trust → Settings → Authentication.
6. Add a policy:
   - **Policy name**: `Owner only`
   - **Action**: Allow
   - **Include**: Emails → `hectorg@smartxchain.com`
7. Save. Visiting `/admin/research` now requires Google login as `hectorg@smartxchain.com`.

## Tuning sources

- **Stocks watchlist**: edit `WATCHLIST` in `src/lib/research/sources.ts`.
- **AI feeds**: edit `RSS_SOURCES` in the same file. If Anthropic/Meta/OpenAI ever publish a real RSS feed, swap the Google News URL for it.
- **arXiv categories**: edit `CATEGORIES` in `src/lib/research/arxiv.ts`.

## Promotion flow (research → publication)

1. Read on `/admin/research`.
2. Decide what's worth commenting on.
3. Create `src/content/posts/<slug>.mdx` with `published: true` and your take.
4. Build & deploy — the post appears on the public site; the research page stays private.

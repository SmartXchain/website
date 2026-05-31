# SmartXChain — Claude Code instructions

## Project context
Solo project (owner: Hector Garza). No team review needed. No PR review step.

## Git workflow
This is a one-person project. When merging a feature branch to main:
- Use `gh pr merge --merge` directly from the CLI. Do NOT ask the owner to review in the GitHub UI first.
- Always merge with `--merge` (not squash or rebase) to preserve commit history.
- After merging, run `git switch main && git pull` to sync local main.
- Commit message format is enforced by a hook — subject ≤ 72 chars, body must have What/Why/Who/Where sections, Co-Authored-By line required.

## GitHub auth
Two accounts in `gh`: active must be `SmartXchain` (org owner) to have push access.
If a push is denied, run: `gh auth switch -h github.com -u SmartXchain`

## Content schema — critical rules

### Excerpt length
The `excerpt` field in post frontmatter has a hard 280-character Zod limit.
`astro check` does NOT catch this — it only fails at `npm run build` time (Cloudflare build).
**Always verify with Python before committing any new post:**
```bash
python3 -c "
import re, glob
for path in glob.glob('src/content/posts/*.mdx'):
    with open(path) as f:
        for line in f:
            if line.startswith('excerpt:'):
                m = re.match(r'excerpt: \"(.*)\"', line)
                if m:
                    n = len(m.group(1))
                    status = '✅' if n <= 280 else f'❌ {n} chars (over by {n-280})'
                    print(f'{status}  {path.split(\"/\")[-1]}')
"
```

### Publishing workflow
- New posts are created with `draft: true` for review, then flipped to `draft: false` to publish.
- Draft posts are invisible on the live site but accessible in dev at `/posts/<slug>` (the slug route includes drafts in dev mode via `import.meta.env.DEV`).
- The `sourceUrl` field (optional) adds a "Source →" button in the post byline — always include it for news commentary posts.

## Deployment
- Cloudflare auto-deploys on every merge to `main` via `npx wrangler deploy`.
- Build requires `wrangler.jsonc` (Worker name: `website`, main: `dist/_worker.js/index.js`) and `public/.assetsignore` containing `_worker.js`.
- Hybrid SSR: `/admin/*` routes through the Worker; all other routes are static assets.
- Worker secrets needed for research stack: `FINNHUB_KEY`, `ALPHA_VANTAGE_KEY` (set via `npx wrangler secret put`).

## Research stack (`/admin/research`)
- Private SSR dashboard — never auto-publishes to the public site.
- Aggregates arXiv (cs.AI/cs.LG/cs.CL), AI company RSS feeds, Finnhub + Alpha Vantage stocks.
- Requires Cloudflare Access on `/admin/*` (setup in `docs/RESEARCH_STACK.md`).
- Page is `noindex`, excluded from sitemap, disallowed in robots.txt.

## Theme
- Light Editorial palette anchored on Behr 2026 Hidden Gem (`#596D69`).
- `frontier-bg` = `#F8F6F1` (cream), `frontier-signal` = `#596D69` (jade), `frontier-nav` = `#1A2320` (dark nav/footer).
- Section accent colors in `src/lib/sections.ts` are light-mode mid-tones (not neons).

## Key files
- `tailwind.config.mjs` — all design tokens
- `src/lib/sections.ts` — 6 section definitions + accentHex
- `src/lib/site.ts` — site name, tagline, Buttondown username
- `src/content/config.ts` — post schema (includes `sourceUrl`, `draft`, `excerpt` max 280)
- `src/components/RotatingHero.astro` — homepage rotating hero (one slide per category)
- `src/styles/global.css` — global styles including `.hero-slide` rotation CSS
- `wrangler.jsonc` — Cloudflare Worker deploy config
- `public/.assetsignore` — excludes `_worker.js` from asset upload
- `docs/RESEARCH_STACK.md` — research stack setup + Cloudflare Access instructions

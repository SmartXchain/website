# Editorial — house style & publishing guide

This doc is the source of truth for how SmartXChain articles are written and published. It's also the file every new writer/contributor should read on day one.

## Voice

- **Analytical, not breathless.** We don't use words like "stunning," "revolutionary," or "game-changing." If a thing is important, the evidence makes that obvious.
- **Signal over noise.** Every article should answer: *what changed, why does it matter, what do I do with it.* If you can't answer the third question, the article isn't ready.
- **Builders and investors.** Reader is technical and busy. They know what an L2 is. They don't need to be re-taught market structure.
- **Confident, never hedged into meaninglessness.** "We think X is happening" beats "some observers have speculated that X may potentially be a thing."
- **Brevity.** Default length: 400–800 words. Long-form deep dives (Research section) can go to 2,500. Above that, ask if you're really writing one piece or three.

## Sections

Pick exactly one. If a piece could go in two, pick the one closer to the *consequence* you're writing about, not the *topic*.

| Slug | When to use |
|---|---|
| `chain-watch` | L1/L2 protocols, onchain flows, regulatory news affecting crypto |
| `ai-lab` | Frontier model releases, agent infra, evals, alignment, AI safety |
| `deep-tech` | Fusion, quantum, biotech, robotics, semiconductors, hard sciences |
| `markets` | Funding rounds, M&A, public-market signal, IPOs |
| `research` | Long-form original analysis, multi-week deep dives, original data |
| `opinion` | Editor's note, guest essays, deliberately argumentative takes |

## File naming

```
src/content/posts/YYYY-MM-DD-kebab-case-slug.mdx
```

Date is the article's *publish* date, not the date you started writing. Slug is short, lowercase, hyphenated, evocative.

The URL becomes `/posts/kebab-case-slug`. The date in the filename is purely organizational — it doesn't appear in the URL.

## Frontmatter reference

```yaml
---
title: "Anthropic's Opus 4.7 makes a quiet claim on the agent economy"
date: 2026-05-23T06:14:00Z          # ISO datetime, UTC
updatedAt: 2026-05-23T10:00:00Z     # optional, only if you've updated
author: hector-garza                # references src/content/authors/<slug>.yaml
category: ai-lab                    # one of the six section slugs above
tags: ["anthropic", "agents"]       # lowercase, short, reusable
excerpt: "One-sentence hook. Max 280 chars. Appears in cards and OG."
featured: false                     # true = candidate for homepage hero
draft: false                        # true = excluded from production build
hero: ./hero.jpg                    # optional, colocated image file
heroAlt: "Description for screen readers"
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | ✓ | Max 120 chars. Sentence case, period if it's a full sentence. |
| `date` | ✓ | ISO 8601 UTC. Use the time the article actually went live. |
| `updatedAt` | | Set when material edits are made post-publish. |
| `author` | ✓ | Filename of an entry in `src/content/authors/`. |
| `category` | ✓ | One of the six section slugs. |
| `tags` | | 2–5 tags. Lowercase, hyphenated, semantically tight. |
| `excerpt` | ✓ | The one-sentence summary. Max 280 chars. Show, don't tease. |
| `featured` | | Only one post should be `true` at a time. |
| `draft` | | Set `true` while you're writing. Drafts are excluded from production. |
| `hero` / `heroAlt` | | Optional. If you provide `hero`, you must provide `heroAlt`. |

## Body — Markdown + MDX

Use Markdown. MDX is supported (Phase 4 adds the components below), but Markdown alone is fine for most articles.

Headings: use `##` for main sections, `###` for subsections. Don't use `#` — the article title is auto-rendered above the body.

### Components (available from Phase 4 onward)

```mdx
<Callout type="note">A boxed aside in body color.</Callout>
<Callout type="signal">Aside in section accent color.</Callout>
<Callout type="warn">Warning-toned aside.</Callout>

<Quote attribution="Vitalik, on the L2 fragmentation thesis">
  "The fragmentation thesis is wrong, but the reason it's wrong matters."
</Quote>

<Figure src="./chart.png" caption="Daily intent-DEX volume, 12W trailing." />

<Ticker symbols={["BTC","ETH","NVDA"]} />

<Chart type="bar" data={[{x:"W1",y:30},{x:"W2",y:42}]} />
```

## Authors

Add yourself to `src/content/authors/<your-slug>.yaml`:

```yaml
name: First Last
role: Editor / Reporter / Contributor / etc.
bio: |
  One short paragraph in second person or third. Max 400 chars.
twitter: handle-without-the-@        # optional
github: github-handle                # optional
site: https://your-personal-site.com # optional, must be HTTPS
email: you@smartxchain.com           # optional
```

`author:` in post frontmatter must match the filename (without `.yaml`).

## Publishing

```bash
# while writing — preview locally
npm run dev

# when ready to publish
git add src/content/posts/2026-MM-DD-slug.mdx
git commit -m "post: <category> — <title>"
git push origin main
```

Cloudflare Pages rebuilds and deploys within ~2 minutes of the push.

## Editorial review (optional, recommended)

For pieces above 800 words, open a pull request instead of pushing to main directly. PR previews give you a unique URL you can share with a second pair of eyes before it ships.

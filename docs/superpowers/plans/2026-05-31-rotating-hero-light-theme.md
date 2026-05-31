# Rotating Hero + Light Editorial Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static homepage hero with a per-category rotating carousel and retheme the entire site from pure-black to a light editorial palette anchored on Behr 2026 Hidden Gem (#596D69).

**Architecture:** Update Tailwind color tokens and section accents first (Tasks 1–2) so all downstream components auto-update via class resolution. Fix `text-white` hardcodes globally (Task 3). Add dark nav/footer bookends (Task 4). Add slide CSS utilities to global.css (Task 5). Build `RotatingHero.astro` (Task 6). Wire it into `index.astro` (Task 7). Verify visually and push (Task 8).

**Tech Stack:** Astro 4.16, Tailwind CSS 3.4, Cloudflare Workers, vanilla JS (no framework for the rotation logic), `astro:content` collections.

---

## File Map

| Action | File |
|--------|------|
| Modify | `tailwind.config.mjs` |
| Modify | `src/lib/sections.ts` |
| Modify | `src/styles/global.css` |
| Modify | `src/components/Header.astro` |
| Modify | `src/components/Footer.astro` |
| Create | `src/components/RotatingHero.astro` |
| Modify | `src/pages/index.astro` |

---

## Task 1: Update Tailwind color tokens

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Replace the entire `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        frontier: {
          bg: '#F8F6F1',           // warm cream — page background
          surface: '#EEEAE3',      // cards, sidebar
          'surface-deep': '#E6E2DB', // code blocks, ticker
          border: '#D4CFC8',       // all borders
          'border-strong': '#B0AA9F', // hover borders
          nav: '#1A2320',          // dark bookend — nav + footer bg
          text: '#1A2320',         // primary text (same dark ink)
          'text-muted': '#5C6B67', // body copy, excerpts
          'text-dim': '#8FA49E',   // meta, kickers, timestamps
          signal: '#596D69',       // Hidden Gem — primary accent
          'signal-deep': '#3D5C55', // gradient stop, bar chart
          danger: '#B85555',       // error states
          warn: '#B87D1A',         // warning states
        },
        section: {
          'chain-watch': '#3D7A6B',
          'ai-lab': '#3B6FA0',
          'deep-tech': '#7C4CA8',
          markets: '#B87D1A',
          research: '#2B7A6D',
          opinion: '#B54B85',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.2em',
        ui: '0.12em',
      },
      maxWidth: {
        prose: '70ch',
        wide: '1400px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Verify Astro type-checks with new tokens**

```bash
npx astro check 2>&1 | tail -5
```

Expected: `Result (N files): - 1 error` (only the pre-existing pagefind warning).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs
git commit -m "$(cat <<'EOF'
feat(theme): update Tailwind tokens to Light Editorial palette

What: Replaces all frontier-* hex values with the Light Editorial
scheme anchored on Behr 2026 Hidden Gem (#596D69). Adds frontier-nav
token for dark bookend header/footer. Adjusts section accent colors
for readability on cream backgrounds.

Why: Switching from pure-black terminal theme to a wider-audience
light editorial scheme.

Who: Hector Garza.

Where: tailwind.config.mjs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Update section accent colors in sections.ts

**Files:**
- Modify: `src/lib/sections.ts:17-59`

- [ ] **Step 1: Replace accentHex values for all 6 sections**

In `src/lib/sections.ts`, update only the `accentHex` lines — leave all other fields unchanged:

```ts
export const sections: Section[] = [
  {
    slug: 'chain-watch',
    name: 'Chain Watch',
    short: 'Chain',
    blurb: 'L1/L2 protocols, onchain flows, regulation.',
    accentHex: '#3D7A6B',
  },
  {
    slug: 'ai-lab',
    name: 'AI Lab',
    short: 'AI',
    blurb: 'Frontier models, agents, benchmarks, alignment.',
    accentHex: '#3B6FA0',
  },
  {
    slug: 'deep-tech',
    name: 'Deep Tech',
    short: 'Deep',
    blurb: 'Fusion, quantum, biotech, robotics, hard tech.',
    accentHex: '#7C4CA8',
  },
  {
    slug: 'markets',
    name: 'Markets',
    short: 'Markets',
    blurb: 'Funding, M&A, public-market signal.',
    accentHex: '#B87D1A',
  },
  {
    slug: 'research',
    name: 'Research',
    short: 'Research',
    blurb: 'Long-form deep dives, original analysis.',
    accentHex: '#2B7A6D',
  },
  {
    slug: 'opinion',
    name: 'Opinion',
    short: 'Opinion',
    blurb: "Editor's note, guest essays, hot takes.",
    accentHex: '#B54B85',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/sections.ts
git commit -m "$(cat <<'EOF'
feat(theme): update section accent colors for light backgrounds

What: Shifts all 6 section accentHex values from neon dark-mode colors
to muted mid-tone equivalents readable on the cream #F8F6F1 background.

Why: Original neons (e.g. #4ade80, #60a5fa) wash out on light bg.

Who: Hector Garza.

Where: src/lib/sections.ts.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Replace text-white hardcodes + fix global.css

**Files:**
- Modify: `src/styles/global.css`
- Modify: all `src/**/*.astro` files with `text-white`

- [ ] **Step 1: Global sed replace — text-white → text-frontier-text**

```bash
find /home/hgarza/smartxchain/src -name "*.astro" -o -name "*.css" | \
  xargs sed -i 's/\btext-white\b/text-frontier-text/g'
```

- [ ] **Step 2: Verify the count dropped to 0**

```bash
grep -rn "text-white" /home/hgarza/smartxchain/src --include="*.astro" --include="*.css"
```

Expected: no output.

- [ ] **Step 3: Fix ::selection in global.css**

The `::selection` rule currently has `text-frontier-text` after the sed pass (was `text-white`). On a cream page with a jade selection highlight that's correct — keep it as-is.

Verify it looks right:
```bash
grep -A2 "::selection" /home/hgarza/smartxchain/src/styles/global.css
```

Expected:
```
::selection {
  @apply bg-frontier-signal/30 text-frontier-text;
}
```

- [ ] **Step 4: Update prose-frontier code block colors in global.css**

The code block uses `bg-frontier-surface-deep` which is now `#E6E2DB` (light beige). On a light background that works. But `text-frontier-text` in `pre code` is now dark on light — correct. No change needed here; the token update handles it.

Run a quick sanity check to confirm no hardcoded dark hex values remain in global.css:

```bash
grep -n "#0a\|#0d\|#05\|#1c\|text-white" /home/hgarza/smartxchain/src/styles/global.css
```

Expected: no output.

- [ ] **Step 5: Run astro check**

```bash
npx astro check 2>&1 | tail -5
```

Expected: 1 error (pre-existing pagefind warning only).

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/
git commit -m "$(cat <<'EOF'
feat(theme): replace text-white with text-frontier-text site-wide

What: Global sed pass replaces all 34 instances of text-white with
text-frontier-text across *.astro and *.css files. On the new cream
background text-white would be invisible; text-frontier-text resolves
to #1A2320 (dark ink).

Why: Completing the light-mode migration.

Who: Hector Garza.

Where: src/**/*.astro, src/styles/global.css.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Dark bookend — Header and Footer

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update Header.astro**

Replace the full file content:

```astro
---
import Ticker from './Ticker.astro';
import { sections } from '../lib/sections';

const now = new Date();
const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '.');
---

<header
  transition:persist
  class="sticky top-0 z-50 border-b border-frontier-border bg-frontier-nav/95 backdrop-blur supports-[backdrop-filter]:bg-frontier-nav/80"
>
  <div
    class="container-wide flex items-center justify-between gap-6 py-4 font-mono text-xs uppercase tracking-kicker text-frontier-text-dim"
  >
    <a
      href="/"
      class="font-bold tracking-[0.2em] text-frontier-bg transition-opacity hover:opacity-80"
    >
      <span aria-hidden>▲</span> SMARTXCHAIN
    </a>
    <nav class="hidden gap-5 md:flex" aria-label="Primary">
      {
        sections.map((s) => (
          <a
            href={`/${s.slug}`}
            class="transition-colors hover:text-frontier-bg"
          >
            {s.short}
          </a>
        ))
      }
      <a href="/archive" class="transition-colors hover:text-frontier-bg">Archive</a>
      <a href="/search" class="transition-colors hover:text-frontier-bg">Search</a>
    </nav>
    <div class="hidden text-frontier-text-dim md:block">{dateStr}</div>
  </div>
  <Ticker />
</header>
```

Key changes:
- `bg-frontier-bg/95` → `bg-frontier-nav/95` (dark ink background)
- `text-frontier-signal` on logo → `text-frontier-bg` (cream text, high contrast on dark)
- `hover:text-frontier-signal` on nav links → `hover:text-frontier-bg`

- [ ] **Step 2: Update Footer.astro**

Replace the full file content:

```astro
---
import { sections } from '../lib/sections';
import SubscribeBox from './SubscribeBox.astro';
const year = new Date().getFullYear();
---

<footer class="mt-32 border-t border-frontier-border bg-frontier-nav">
  <div class="container-wide grid gap-12 py-16 md:grid-cols-4">
    <div class="md:col-span-2">
      <a
        href="/"
        class="font-mono text-sm font-bold tracking-[0.2em] text-frontier-bg"
      >
        <span aria-hidden>▲</span> SMARTXCHAIN
      </a>
      <p class="mt-4 max-w-prose text-sm text-frontier-text-dim">
        Signal from the frontier. A specialist publication covering the
        convergence of Web3, AI, and deep tech.
      </p>
      <div class="mt-6">
        <SubscribeBox compact />
      </div>
      <a
        href="/newsletter"
        class="mt-3 inline-block font-mono text-xs uppercase tracking-ui text-frontier-text-dim hover:text-frontier-bg"
      >
        → More about The Chain Letter
      </a>
    </div>
    <div>
      <h4 class="kicker mb-4">Sections</h4>
      <ul class="space-y-2 text-sm">
        {
          sections.map((s) => (
            <li>
              <a
                href={`/${s.slug}`}
                class="text-frontier-text-dim transition-colors hover:text-frontier-bg"
              >
                {s.name}
              </a>
            </li>
          ))
        }
      </ul>
    </div>
    <div>
      <h4 class="kicker mb-4">Site</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="/archive" class="text-frontier-text-dim hover:text-frontier-bg">Archive</a></li>
        <li><a href="/search" class="text-frontier-text-dim hover:text-frontier-bg">Search</a></li>
        <li><a href="/about" class="text-frontier-text-dim hover:text-frontier-bg">About</a></li>
        <li><a href="/rss.xml" class="text-frontier-text-dim hover:text-frontier-bg">RSS</a></li>
        <li><a href="/privacy" class="text-frontier-text-dim hover:text-frontier-bg">Privacy</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-frontier-border">
    <div
      class="container-wide flex flex-wrap items-center justify-between gap-2 py-6 font-mono text-xs uppercase tracking-ui text-frontier-text-dim"
    >
      <span>© {year} SmartXChain</span>
      <span>// Signal from the frontier</span>
    </div>
  </div>
</footer>
```

Key changes:
- `bg-frontier-surface` → `bg-frontier-nav` (dark)
- Logo `text-frontier-signal` → `text-frontier-bg` (cream)
- Nav links `text-frontier-text-muted hover:text-frontier-text` → `text-frontier-text-dim hover:text-frontier-bg`

- [ ] **Step 3: Run astro check**

```bash
npx astro check 2>&1 | tail -5
```

Expected: 1 error (pagefind only).

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "$(cat <<'EOF'
feat(theme): dark bookend nav and footer

What: Updates Header and Footer to use bg-frontier-nav (#1A2320) for
a dark bookend effect that frames the cream content area. Logo text
changed from jade signal color to cream frontier-bg for contrast.
Nav link hover changed from jade to cream.

Why: Matches the approved Light Editorial mockup — dark top/bottom
bars frame the cream content, making the jade accent read crisply.

Who: Hector Garza.

Where: src/components/Header.astro, src/components/Footer.astro.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Add slide/rotation CSS utilities to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append rotation utility classes to global.css**

Add this block at the end of `src/styles/global.css`, after the closing of `@layer components { }`:

```css
/* ── Rotating hero ────────────────────────────────────────────────── */
.hero-slide {
  opacity: 0;
  transition: opacity 600ms ease;
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  top: 0;
}
.hero-slide.active {
  opacity: 1;
  pointer-events: auto;
  position: relative;
}
@keyframes hero-tick {
  from { width: 0 }
  to   { width: 100% }
}
.hero-slide.active .hero-progress {
  animation: hero-tick 10s linear forwards;
}
.hero-rotate-wrap:hover .hero-progress {
  animation-play-state: paused;
}
.hero-rotate-wrap:hover .hero-slide.active .hero-pause-badge {
  display: block;
}
```

- [ ] **Step 2: Verify the append landed correctly**

```bash
tail -20 /home/hgarza/smartxchain/src/styles/global.css
```

Expected: the CSS block above is visible.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "$(cat <<'EOF'
feat(rotating-hero): add slide/rotation CSS utilities to global.css

What: Adds .hero-slide, .hero-slide.active, @keyframes hero-tick, and
hover-pause rules. Lives in global.css so JavaScript class manipulation
(classList.add/remove) works without Astro scoped-style hash issues.

Why: RotatingHero.astro needs these to be globally accessible.

Who: Hector Garza.

Where: src/styles/global.css.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Create RotatingHero.astro

**Files:**
- Create: `src/components/RotatingHero.astro`

- [ ] **Step 1: Create the component**

```astro
---
import type { Post } from '../lib/posts';
import { getEntry } from 'astro:content';
import { getSection } from '../lib/sections';
import { readTime, formatStamp } from '../lib/posts';

interface Props {
  posts: Post[];
}

const { posts } = Astro.props;

const slides = await Promise.all(
  posts.map(async (post) => {
    const author = await getEntry(post.data.author);
    const section = getSection(post.data.category);
    const mins = readTime(post.body);
    const stamp = formatStamp(post.data.updatedAt ?? post.data.date);
    return { post, author, section, mins, stamp };
  }),
);
---

<div class="hero-rotate-wrap relative border-b-2 border-frontier-signal pb-6" id="rotating-hero">
  {
    slides.map(({ post, author, section, mins, stamp }, i) => (
      <div class:list={['hero-slide', i === 0 && 'active']}>
        <a href={`/posts/${post.slug}`} class="block group">
          <div
            class="mb-5 font-mono text-xs uppercase tracking-kicker"
            style={`color:${section.accentHex}`}
          >
            // Lead Story — {section.name}
          </div>
          <h2 class="mt-0 max-w-[22ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-frontier-text transition-colors group-hover:text-frontier-signal md:text-6xl">
            {post.data.title}
          </h2>
          <p class="mt-5 max-w-prose text-lg text-frontier-text-muted md:text-xl">
            {post.data.excerpt}
          </p>
          <div class="ui-text mt-7">
            {mins.toLocaleString()} MIN READ · BY {author.data.name.toUpperCase()} · {stamp}
          </div>
        </a>
        <div class="mt-5 h-[2px] overflow-hidden bg-frontier-border">
          <div
            class="hero-progress h-full w-0 rounded-sm"
            style={`background:${section.accentHex}`}
          />
        </div>
        <p class="hero-pause-badge mt-2 hidden font-mono text-xs uppercase tracking-ui text-frontier-text-dim">
          ⏸ paused
        </p>
      </div>
    ))
  }
</div>

<script>
  const wrap = document.getElementById('rotating-hero');
  if (wrap) {
    const slides = wrap.querySelectorAll<HTMLElement>('.hero-slide');
    const INTERVAL = 10_000;
    let current = 0;
    let timer: ReturnType<typeof setInterval> | null = null;
    let paused = false;

    function goTo(idx: number) {
      slides[current].classList.remove('active');
      current = ((idx % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      const bar = slides[current].querySelector<HTMLElement>('.hero-progress');
      if (bar) {
        bar.style.animation = 'none';
        bar.getBoundingClientRect(); // force reflow to restart animation
        bar.style.animation = '';
      }
      restartTimer();
    }

    function restartTimer() {
      if (timer) clearInterval(timer);
      if (!paused) timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    wrap.addEventListener('mouseenter', () => {
      paused = true;
      if (timer) clearInterval(timer);
    });
    wrap.addEventListener('mouseleave', () => {
      paused = false;
      restartTimer();
    });

    restartTimer();
  }
</script>
```

- [ ] **Step 2: Run astro check**

```bash
npx astro check 2>&1 | tail -5
```

Expected: 1 error (pagefind only) — no TypeScript errors in the new component.

- [ ] **Step 3: Commit**

```bash
git add src/components/RotatingHero.astro
git commit -m "$(cat <<'EOF'
feat(rotating-hero): add RotatingHero.astro component

What: New component that renders one slide per category (latest post),
cross-fades every 10s, shows a per-category-colored progress bar, and
pauses on mouseenter. Rotation logic is vanilla JS with setInterval
and a force-reflow animation reset trick.

Why: Replaces the static HeroPost so every active category gets
regular homepage exposure.

Who: Hector Garza.

Where: src/components/RotatingHero.astro.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Update index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the full index.astro**

```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import Base from '../layouts/Base.astro';
import RotatingHero from '../components/RotatingHero.astro';
import SignalSidebar from '../components/SignalSidebar.astro';
import PostCard from '../components/PostCard.astro';
import SignalOfWeek from '../components/SignalOfWeek.astro';
import { sections } from '../lib/sections';
import { sortByDateDesc } from '../lib/posts';

type Post = CollectionEntry<'posts'>;

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const sorted = sortByDateDesc(allPosts);

// One slide per category that has at least one published post
const heroSlides = sections
  .map((s) => sorted.find((p) => p.data.category === s.slug))
  .filter((p): p is Post => p !== undefined);

// Sidebar: 4 most recent posts overall (static, doesn't track the rotating hero)
const signalItems = sorted.slice(0, 4);

// Category grid: latest per section, top 3 by date
const categoryGrid = sortByDateDesc(
  sections
    .map((s) => sorted.find((p) => p.data.category === s.slug))
    .filter((p): p is Post => p !== undefined),
).slice(0, 3);

// Signal of week: latest research post, fallback to second-most-recent overall
const signalOfWeek =
  sorted.find((p) => p.data.category === 'research') ?? sorted[1];
---

<Base title="SmartXChain — Signal from the frontier">
  {
    heroSlides.length > 0 ? (
      <section
        class={`container-wide grid gap-12 py-16 md:py-20 ${signalItems.length > 0 ? 'md:grid-cols-[2.2fr_1fr]' : ''}`}
      >
        <RotatingHero posts={heroSlides} />
        {signalItems.length > 0 && <SignalSidebar items={signalItems} />}
      </section>
    ) : (
      <section class="container-wide py-32">
        <p class="kicker">// no posts yet</p>
        <h1 class="mt-6 max-w-[18ch] font-display text-5xl font-extrabold tracking-tight text-frontier-text md:text-7xl">
          Signal from the frontier.
        </h1>
        <p class="mt-6 max-w-prose text-lg text-frontier-text-muted">
          First issue inbound. Subscribe to The Chain Letter to know when it ships.
        </p>
      </section>
    )
  }

  {
    categoryGrid.length > 0 && (
      <section class="container-wide pb-16">
        <div class="kicker">// Across the Frontier</div>
        <div class="mt-6 grid gap-6 md:grid-cols-3">
          {categoryGrid.map((p) => (
            <PostCard post={p} />
          ))}
        </div>
      </section>
    )
  }

  {signalOfWeek && <SignalOfWeek post={signalOfWeek} />}

  <section class="container-wide py-16">
    <div class="kicker">// Sections</div>
    <div class="mt-6 grid gap-3 md:grid-cols-3">
      {
        sections.map((s) => (
          <a
            href={`/${s.slug}`}
            class="group border border-frontier-border bg-frontier-surface p-5 transition-colors hover:border-frontier-border-strong"
          >
            <div
              class="font-mono text-xs uppercase tracking-kicker"
              style={`color:${s.accentHex}`}
            >
              // {s.slug}
            </div>
            <div class="mt-2 font-display text-xl font-bold text-frontier-text group-hover:text-frontier-signal">
              {s.name} →
            </div>
            <div class="mt-1 text-sm text-frontier-text-muted">{s.blurb}</div>
          </a>
        ))
      }
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Run astro check**

```bash
npx astro check 2>&1 | tail -5
```

Expected: 1 error (pagefind only).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat(homepage): wire RotatingHero — one slide per category

What: Replaces featured/remainder hero logic with heroSlides (latest
post per active category). Swaps <HeroPost> for <RotatingHero>.
Sidebar now shows 4 most recent posts regardless of hero state.
Removes HeroPost import (file kept for future use).

Why: Every category with content now gets homepage rotation exposure.

Who: Hector Garza.

Where: src/pages/index.astro.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Visual verification + build check

**Files:** none modified — verification only

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:4321 in a browser.

- [ ] **Step 2: Verify rotating hero**

Check these on the homepage:
- [ ] 4 category slides rotate every 10 seconds (AI Lab → Markets → Research → Opinion)
- [ ] Progress bar below each slide advances and matches the category accent color
- [ ] Hovering the hero pauses the bar and shows `⏸ paused`
- [ ] Mouse-out resumes from current position
- [ ] Crossfade is smooth (not a jump)
- [ ] Sidebar "Today's Signal" shows 4 recent posts, static while hero rotates

- [ ] **Step 3: Verify color theme**

- [ ] Homepage background is warm cream, not black
- [ ] Nav bar is dark jade/ink, logo is cream
- [ ] Footer is dark jade/ink
- [ ] Section kicker text (e.g. `// AI Lab`) is jade/green, not bright neon
- [ ] Post card borders are visible but subtle on cream background
- [ ] Signal of the Week bar chart uses jade gradient

- [ ] **Step 4: Verify category + post pages**

- [ ] Visit `/ai-lab` — accent color is readable blue `#3B6FA0`, not bright blue
- [ ] Visit `/posts/2026-05-31-anthropic-65b-series-h` — headline is dark, not white-on-cream
- [ ] Visit `/markets` — amber accent `#B87D1A` on cream

- [ ] **Step 5: Production build check**

```bash
npm run build 2>&1 | tail -15
```

Expected: `[build] Complete!` with all 7 post routes + `/admin/*` in `_routes.json`. No errors.

- [ ] **Step 6: Create branch, push, and merge**

```bash
git switch main
git switch -c feat/rotating-hero-light-theme
git push -u origin feat/rotating-hero-light-theme
```

Then:
```bash
gh pr create --base main --head feat/rotating-hero-light-theme \
  --title "feat: rotating hero + Light Editorial theme (Hidden Gem)" \
  --body "$(cat <<'EOF'
## Summary

- Replaces static homepage hero with a rotating carousel — latest post per active category, crossfade, 10s interval, progress bar, hover-pause
- Rethemes the entire site to Light Editorial palette anchored on Behr 2026 Color of the Year Hidden Gem (#596D69)
- Dark bookend nav + footer frame the cream content area
- 34 text-white instances replaced with text-frontier-text

## Test plan

- [x] astro check passes (only pre-existing pagefind warning)
- [x] npm run build succeeds
- [x] Dev server: rotation, progress bar, hover-pause verified
- [x] Category pages: accent colors readable on cream
- [x] Post pages: headlines dark on cream

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Then merge:
```bash
gh pr merge --merge --repo SmartXchain/website \
  $(gh pr list --head feat/rotating-hero-light-theme --json number --jq '.[0].number')
```

---

## Self-Review Notes

- **Spec §3 (RotatingHero)** → Task 6 ✅
- **Spec §2 color tokens** → Tasks 1–2 ✅
- **Spec §4 index.astro changes** → Task 7 ✅
- **Spec §5 tailwind.config** → Task 1 ✅
- **Spec §6 sections.ts** → Task 2 ✅
- **Spec §7 text-white / prose-frontier** → Task 3 ✅
- **Spec §7 Header/Footer** → Task 4 ✅ (dark nav bookend)
- **Spec §8 edge cases** → RotatingHero handles 0-posts via `heroSlides.length > 0` conditional ✅
- **Spec §9 testing** → Task 8 ✅
- **Type consistency** — `Post` type used as `CollectionEntry<'posts'>` alias in index.astro, same as `lib/posts.ts` definition ✅

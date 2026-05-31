# Design Spec: Rotating Hero + Light Editorial Theme

**Date:** 2026-05-31  
**Author:** Hector Garza  
**Status:** Approved for implementation

---

## 1. Goals

1. Replace the static single-post hero on the homepage with a rotating carousel that cycles through the latest published post per active category (10 s per slide, crossfade, pause on hover, progress bar).
2. Retheme the entire site from the current pure-black terminal palette to a **Light Editorial** scheme anchored on Behr's 2026 Color of the Year — **Hidden Gem** (`#596D69`, a smoky jade) — to appeal to a wider, non-technical audience.

Both changes ship together because they touch the same token system.

---

## 2. Color Palette

### Design tokens (replace existing `frontier-*` values in `tailwind.config.mjs`)

| Token | Hex | Usage |
|---|---|---|
| `frontier-bg` | `#F8F6F1` | Page background (warm cream) |
| `frontier-surface` | `#EEEAE3` | Cards, sidebar, Signal of Week band |
| `frontier-surface-2` | `#E6E2DB` | Ticker bar, demo controls |
| `frontier-border` | `#D4CFC8` | All borders |
| `frontier-border-strong` | `#B0AA9F` | Hover borders |
| `frontier-text` | `#1A2320` | Primary text, nav background, footer |
| `frontier-text-muted` | `#5C6B67` | Body copy, excerpts |
| `frontier-text-dim` | `#8FA49E` | Meta, kickers, timestamps |
| `frontier-signal` | `#596D69` | Hidden Gem — primary accent, progress bars, quote lines, hover states |
| `frontier-signal-dark` | `#3D5C55` | Progress bar gradient stop, bar chart bottom |

### Section accent colors (light-mode adjusted)

Each section keeps a distinct hue, shifted to be readable on cream backgrounds:

| Section | Old (dark-mode) | New (light-mode) |
|---|---|---|
| chain-watch | `#4ade80` | `#3D7A6B` |
| ai-lab | `#60a5fa` | `#3B6FA0` |
| deep-tech | `#c084fc` | `#7C4CA8` |
| markets | `#fbbf24` | `#B87D1A` |
| research | `#2dd4bf` | `#2B7A6D` |
| opinion | `#f472b6` | `#B54B85` |

Update `accentHex` values in `src/lib/sections.ts`.

### Typography

Swap the display/body font stack to use **Georgia serif** for headlines and body, keeping **Courier New monospace** for kickers, meta, UI labels. This is more inviting and editorial. Update `tailwind.config.mjs` font families:

- `font-display`: `'Fraunces', Georgia, serif` (keep Fraunces if loaded; Georgia is the fallback)
- `font-body`: `Georgia, 'Times New Roman', serif`
- `font-mono`: keep as-is

---

## 3. New Component: `RotatingHero.astro`

### Location
`src/components/RotatingHero.astro`

### Props
```typescript
interface Props {
  posts: Post[];  // one per category, latest first; only categories with posts
}
```

### Behavior
- Renders all slides stacked (`position: absolute`) with `opacity: 0`; the active slide uses `position: relative; opacity: 1`
- CSS `transition: opacity 0.6s ease` on each `.slide`
- Auto-advances every **10 000 ms** via `setInterval`
- On `mouseenter` → `clearInterval`, set `paused = true`; on `mouseleave` → restart timer
- Progress bar: a `<div class="h-[2px]">` with a child `<div>` animated from `width: 0` to `width: 100%` over 10 s via CSS `@keyframes tick`. On slide change, reset animation using the force-reflow trick: `el.style.animation = 'none'; el.getBoundingClientRect(); el.style.animation = ''`
- Progress bar color = the current category's `accentHex`
- Kicker label = `// Lead Story — {section.name}` in the category accent color
- The bottom border of the hero wrapper is `2px solid var(--frontier-signal)` (Hidden Gem) — constant, not per-category

### HTML structure (simplified)
```html
<article class="hero-wrap border-b-2 border-frontier-signal …">
  {posts.map((post, i) => (
    <div class:list={['slide', i === 0 && 'active']} data-index={i}>
      <!-- kicker, h2, excerpt, byline -->
      <div class="progress-track h-[2px] bg-frontier-border mt-5 overflow-hidden">
        <div class="progress-fill h-full w-0 rounded-sm" style={`background:${accentHex}`} />
      </div>
      <p class="pause-badge hidden …">⏸ paused</p>
    </div>
  ))}
</article>
<script>/* rotation logic */</script>
```

### CSS classes needed (add to global.css or Tailwind utilities)
- `.slide` — `opacity-0 transition-opacity duration-[600ms] pointer-events-none absolute inset-x-0 top-0`
- `.slide.active` — `opacity-100 pointer-events-auto relative`
- `.hero-wrap:hover .progress-fill` — `animation-play-state: paused`
- `.hero-wrap:hover .pause-badge` — `display: block`

---

## 4. Changes to `src/pages/index.astro`

### Data computation changes

**Remove:** `featured` / `remainder` split logic.

**Replace with:**
```typescript
// Latest published post per section, only sections that have posts
const heroSlides = sections
  .map(s => sorted.find(p => p.data.category === s.slug))
  .filter((p): p is Post => p !== undefined);

// Sidebar: 4 most recent overall (static, doesn't track hero)
const signalItems = sorted.slice(0, 4);

// Category grid: latest per section, up to 3. May overlap with heroSlides — that's fine,
// the grid serves as a persistent "browse by section" entry point regardless of which hero is active.
const categoryGrid = sortByDateDesc(
  sections
    .map(s => sorted.find(p => p.data.category === s.slug))
    .filter(Boolean)
).slice(0, 3);

// Signal of week: unchanged
const signalOfWeek = sorted.find(p => p.data.category === 'research') ?? sorted[1];
```

**Hero JSX:** Replace `<HeroPost post={featured} />` with `<RotatingHero posts={heroSlides} />`.

**Import:** Add `import RotatingHero from '../components/RotatingHero.astro';`

**Remove:** `import HeroPost from '../components/HeroPost.astro';` (HeroPost is no longer used on the homepage; keep the file for potential future single-post use.)

The `{featured ? … : <empty state>}` conditional becomes:
```astro
{heroSlides.length > 0 ? (
  <section class="container-wide grid gap-12 py-16 md:py-20 md:grid-cols-[2.2fr_1fr]">
    <RotatingHero posts={heroSlides} />
    <SignalSidebar items={signalItems} />
  </section>
) : (
  /* existing empty state */
)}
```

---

## 5. Changes to `tailwind.config.mjs`

Replace all `frontier-*` color values per the palette table in §2. No structural changes to the config and no token renames — only the hex values change. This means all 75 existing class usages across components continue to work without modification.

---

## 6. Changes to `src/lib/sections.ts`

Update `accentHex` for all 6 sections per the table in §2. No interface changes.

---

## 7. Other Component Changes

### `src/layouts/Base.astro`
- Remove `background: #0a0a0f` (or equivalent dark bg) from `global.css` / the body selector — the Tailwind `bg-frontier-bg` now resolves to cream.
- No structural changes.

### `src/styles/global.css`
- Update body background, text color, and any hardcoded dark values to use the new token names.
- Add `.slide`, `.slide.active`, `.pause-badge` utility rules if not expressible via Tailwind alone.

### `src/components/PostCard.astro`, `SignalSidebar.astro`, `SignalOfWeek.astro`
- No structural changes. Color updates flow through Tailwind token replacement automatically.
- Verify `bg-frontier-surface`, `border-frontier-border`, `text-frontier-text-muted` class names still exist (they will — token names are unchanged, only values).

### `src/components/HeroPost.astro`
- Keep file unchanged. Not used on homepage post this change but may be used elsewhere.

---

## 8. Edge Cases

| Case | Behaviour |
|---|---|
| Only 1 category has posts | `heroSlides.length === 1` — single slide shown, no rotation, progress bar still animates (cosmetic only) |
| 0 published posts | Falls through to the existing empty-state UI (`// no posts yet`) |
| 5 or 6 categories with posts | All slides included, rotation cycles through all of them |
| Post with very long title | `max-w-[22ch]` wrapping already handles this; test at 6xl sizes |

---

## 9. Testing

- `npm run dev` — visually verify rotation, progress bar reset, hover pause on all 4 current category slides
- `npm run build` — confirm no TypeScript errors on the new component
- Spot-check `/markets`, `/ai-lab`, `/research`, `/opinion` category pages — section accent colors should be readable on cream backgrounds
- Check `/posts/<slug>` — post body, kicker colors, metadata line all use updated tokens
- Run `npx astro check` — expect only the pre-existing pagefind warning

---

## 10. Out of Scope

- Dark mode toggle (not requested; could be added later)
- Per-post color customisation
- Animation speed control
- Manual slide skip arrows on the hero (rotation only; no user navigation needed)

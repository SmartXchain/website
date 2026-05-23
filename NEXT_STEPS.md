# Phase 0 — Your turn (3 things, ~10 minutes)

Local scaffold is done. The site builds. Initial commit is on `main`. Your three remaining Phase 0 actions are below.

---

## 1. Create the GitHub repo

Go to **https://github.com/new** and create:

- **Repository name:** `smartxchain-site`
- **Visibility:** Private (we'll make it public if/when you want)
- **Do NOT** initialize with README, .gitignore, or license — we already have those

Click *Create repository*.

GitHub will show you a "push an existing repository" snippet. Use these commands (replace `YOUR-USERNAME` if it's not `hgarza`):

```bash
cd /home/hgarza/smartxchain
git remote add origin git@github.com:YOUR-USERNAME/smartxchain-site.git
git push -u origin main
```

If you use HTTPS instead of SSH:

```bash
git remote add origin https://github.com/YOUR-USERNAME/smartxchain-site.git
git push -u origin main
```

> **If you don't have SSH set up yet:** run `gh auth login` (after `sudo apt install gh` if missing) and follow the prompts.

---

## 2. Connect Cloudflare Pages

1. Sign in to **https://dash.cloudflare.com** (sign up free if you don't have an account)
2. Left nav → **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**
3. Authorize Cloudflare to read your GitHub account
4. Pick the `smartxchain-site` repo
5. **Build configuration:**
   - Production branch: `main`
   - Framework preset: **Astro** (auto-detected)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
6. Click **Save and Deploy**

First build takes 2–3 minutes. Your site lands at `https://smartxchain-site.pages.dev` (or similar — Cloudflare will tell you the exact URL).

---

## 3. Send me the URL

Once the deploy succeeds, paste the `.pages.dev` URL into chat and I'll:
- Verify the live build matches local
- Close out Phase 0
- Start **Phase 1 — Design system** (header, footer, typography, theme — the look of the Frontier mockup ported into real components)

---

## Heads up: your Node version is slightly behind

You're on Node 18.19.1. Cloudflare Pages will use Node 20 (per `.nvmrc`), so production is fine. But for local dev, upgrading to Node 20 LTS would give a smoother experience and let us use the latest Astro 5 later. Not blocking — purely a nice-to-have.

```bash
# install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# then
nvm install 20 && nvm use 20
```

---

## What you can do locally right now

```bash
cd /home/hgarza/smartxchain
npm run dev        # http://localhost:4321 — placeholder homepage
npm run build      # static output → ./dist
npm run preview    # serve the dist locally
```

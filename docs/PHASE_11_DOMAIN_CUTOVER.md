# Phase 11 — Domain cutover walkthrough

Goal: `smartxchain.com` serves the production site over HTTPS, via Cloudflare's edge.

**Total active time:** ~30 minutes
**Total clock time:** 1–24 hours (waiting for nameserver propagation)
**Reversible:** yes — you can flip nameservers back to AWS at any point

---

## Step 1 — Get into Cloudflare

If you already have a Cloudflare account (the one you used to deploy this site, since it's running at `hectorg.workers.dev`), use that.

If you only have the Workers/Pages auto-account that Cloudflare may have created when GitHub connected: that's fine too, it's a real account. Log in at https://dash.cloudflare.com.

If you don't have one at all: sign up at https://dash.cloudflare.com/sign-up — Free plan, no credit card.

**Confirm to me:** "I'm logged into Cloudflare." (We don't need any account info.)

---

## Step 2 — Audit Route 53 DNS *before* anything else

This is the only step where we can break something. **If `@smartxchain.com` email is forwarding anywhere right now, MX records in Route 53 are how that works** — and we need to preserve them when we move nameservers.

1. Go to https://console.aws.amazon.com/route53/v2/hostedzones
2. Click on the hosted zone for `smartxchain.com` (if no hosted zone is listed but the domain is in *Registered domains*, then there are no custom DNS records at all — you can skip to Step 3)
3. Look at the records table. Ignore the auto-created `NS` and `SOA` records. List back to me everything else — specifically anything of type:
   - `MX` (email routing — critical)
   - `TXT` (SPF, DKIM, domain verification — important)
   - `A`, `AAAA`, `CNAME` (any existing redirects/services)

**Paste to me:** the list of non-NS, non-SOA records and their values, or "none — it's empty."

I'll tell you which need to be recreated in Cloudflare before we flip nameservers.

---

## Step 3 — Add smartxchain.com as a site in Cloudflare

1. Cloudflare dashboard → home page → big **+ Add** button (top right) → **Connect a domain**
2. Enter `smartxchain.com` → **Continue**
3. Choose **Free** plan → **Continue**
4. Cloudflare will try to auto-scan existing DNS records. Since AWS Route 53 doesn't expose AXFR transfers, it'll likely come up empty. That's expected — we'll add records manually if needed (Step 4).
5. **Continue** through to the screen that shows two Cloudflare nameservers, e.g.:
   ```
   elliot.ns.cloudflare.com
   tina.ns.cloudflare.com
   ```
   *(They'll be different — Cloudflare assigns from a pool.)*

**Paste both nameservers to me.** I'll verify they look right.

---

## Step 4 — Recreate any critical records in Cloudflare DNS

Only relevant if Step 2 found MX/TXT/A records.

In Cloudflare, your new site → **DNS** → **Records** → **Add record** for each one you found in Route 53.

I'll give you exact record-by-record instructions once you've pasted the Step 2 list.

If Step 2 was empty, skip this step entirely.

---

## Step 5 — Change nameservers in Route 53

This is the actual cutover moment.

1. Go to https://console.aws.amazon.com/route53/domains/home — *Registered domains* (not *Hosted zones*)
2. Click on `smartxchain.com`
3. Scroll to **Name servers** section
4. Click **Edit**
5. Replace AWS's four nameservers (they look like `ns-123.awsdns-XX.com`) with Cloudflare's two from Step 3
6. **Save**

You'll get an email confirmation from AWS about a "name server change for smartxchain.com." That's normal — accept it.

**Tell me when done.** Propagation usually takes 1–4 hours, max 24h. Cloudflare emails you when it sees the change.

---

## Step 6 — Wait

This is unavoidable. DNS propagation. Make a coffee.

You can monitor with `dig smartxchain.com NS` from any terminal — once it returns Cloudflare's nameservers, you're propagated.

Cloudflare will also email you "Your domain is now active."

---

## Step 7 — Wire smartxchain.com to your Pages/Workers project

Once Cloudflare confirms the domain is active:

1. Cloudflare dashboard → **Workers & Pages**
2. Open your `website` project (the one currently serving `website.hectorg.workers.dev`)
3. **Settings** tab → **Domains & Routes** → **Add custom domain**
4. Add `smartxchain.com` → **Add domain**
5. Repeat: add `www.smartxchain.com`

Cloudflare auto-creates the DNS records and issues an SSL cert (takes a few minutes).

---

## Step 8 — Redirect www → apex (or whichever you prefer)

Convention these days is apex (`smartxchain.com` is the canonical, `www.smartxchain.com` redirects to it).

1. Cloudflare → your `smartxchain.com` site (not the Pages project) → **Rules** → **Redirect Rules** → **Create rule**
2. Name: `www to apex`
3. **When incoming requests match:** `Hostname` equals `www.smartxchain.com`
4. **Then:** Static redirect, 301, target: `https://smartxchain.com${1}` (use `${uri}` for full path preservation)
5. **Save**

---

## Step 9 — Smoke test

I'll run this for you once you tell me Step 8 is done:

- `curl -I https://smartxchain.com` → expect 200 + CF headers
- `curl -I https://www.smartxchain.com` → expect 301 → smartxchain.com
- Visit https://smartxchain.com/rss.xml → valid feed
- Visit https://smartxchain.com/sitemap-index.xml → valid sitemap

---

## Step 10 — Clean up + submit to Google

1. **Delete the Route 53 Hosted Zone** (not the registration — just the hosted zone). Route 53 → Hosted zones → smartxchain.com → Delete. Saves ~$0.50/month and removes the now-orphaned nameservers.
2. **Google Search Console:** add `smartxchain.com` as a property, verify via DNS TXT record (Cloudflare DNS, takes 30 seconds), submit `https://smartxchain.com/sitemap-index.xml`. Optional but recommended.

---

## When something goes wrong

- **Cloudflare says "not active yet" after 24h:** check `dig smartxchain.com NS` — if AWS nameservers still resolve, the Step 5 change didn't save. Re-do it.
- **Site loads but SSL warning:** wait 5–10 min, CF is still issuing the cert. Hard refresh.
- **Email stopped working:** flip nameservers back to AWS (Step 5 in reverse), email starts working again immediately. Then we figure out which MX record we missed before re-trying.

Anything else — paste the symptom to me and I'll diagnose.

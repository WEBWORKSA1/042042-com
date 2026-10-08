# 042042.com — The 042 Hub

One area code, three countries: Lahore (+92 42), Daejeon (+82 42) and Tama, Tokyo (+81 42). Free 042 number checker, scam shield, city guides, dialing calculator and money-transfer estimator — monetised with Google AdSense, YouTube, affiliate partners, a multi-step lead-generation funnel, sponsorships, contests and donations.

Pure static HTML/CSS/JS. Hosts free on GitHub Pages.

## Structure
```
src/pages/*.html      page bodies (edit these; run `python3 build.py --extract` once to create them)
build.py              wraps pages with shared head/banner/header/footer → root *.html + sitemap.xml
assets/css/site.css   design system
assets/js/config.js   ← ONE file for ad slots, payments, YouTube, affiliate links
assets/js/data.js     region data, dialing codes, risk signals, number lore
assets/js/main.js     checker, reports, dialing calc, transfer estimator, lead wizard, forms, donations, videos
docs/RESEARCH.md      research, idea scoring, revenue model, competitor teardown
docs/BUILD-PROMPTS.md phase-wise build prompts (1–7 built, 8–12 roadmap)
```
First run on a fresh clone: `python3 build.py --extract` recreates `src/pages/` from the published pages. Then edit a page in `src/pages/`, run `python3 build.py`, commit. Add a page by creating a new file there.

## Go-live checklist
1. **GitHub Pages** publishes from the `gh-pages` branch (a copy of `main`). Live at https://webworksa1.github.io/042042-com/ until the domain is attached. Simplest workflow: Settings → Pages → Source → *Deploy from a branch* → `main` / `(root)`, then every push to `main` goes live.
2. **Custom domain:** Settings → Pages → Custom domain → `042042.com`. At the registrar: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`. Tick *Enforce HTTPS*.
3. **Forms:** submit any form once on the live site; FormSubmit emails a one-time activation link to the inbox. Click it. Optionally paste the random alias FormSubmit issues into `formAlias` in `config.js`.
4. **AdSense:** add 042042.com in AdSense (`ads.txt` is at the root; it only counts on the custom domain). Turn on Auto Ads and the Google-certified consent message for EEA/UK.
5. **Payments:** paste Stripe / PayPal / Buy Me a Coffee / Ko-fi / Patreon / UPI links into `config.js → payments`.
6. **YouTube:** channel URL and video IDs in `config.js → youtube`.
7. **Affiliates:** referral URLs in `config.js → partners` (Wise, Remitly, WorldRemit, Western Union, Rebtel, Boss Revolution, VoIP, call-blocking).

## Trademark & copyright
"042042" is used as a domain name and a descriptive numeric identifier only; no trademark is claimed in it. No affiliation with any operator, regulator, government body, bank or money-transfer company named on the site; third-party names are used nominatively. Original content © 042042.com.

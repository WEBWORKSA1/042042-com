# 042042.com — Phase-wise build prompts

Copy each prompt into an AI coding assistant in order. Each phase assumes the previous one is merged. Phases 1–7 are already implemented in this repo; phases 8–12 are the expansion roadmap.

**Global constraints (prepend to every prompt):**
> Static HTML/CSS/vanilla JS only, deployable on GitHub Pages free plan. Domain: 042042.com. AdSense client `ca-pub-6620975821265271`. On top of every page show: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linking to https://web.works/contact. All forms deliver to the owner's inbox through FormSubmit's AJAX endpoint; the inbox address must never appear in markup, link text, `mailto:` or visible copy — store it as reversed char codes in `assets/js/config.js` and assemble it only at submit time. Do not use "042042" as a trademark; include the trademark/copyright disclosure in the footer and on `disclaimer.html`. WCAG AA, mobile-first, no horizontal scroll at 360px, respects `prefers-reduced-motion`, light/dark themes.

---

### Phase 1 — Foundation & design system
> Create the repo skeleton: `src/pages/` (page bodies with a first-line metadata comment `<!-- title: … | description: … -->`), `build.py` that wraps each page in a shared head (meta, Open Graph, canonical, AdSense script, Google Fonts), interest banner, sticky header nav, footer and scripts, and writes root HTML + `sitemap.xml`. Design concept "one trunk code, three cities": paper #EEF2F5, ink #10233A, Lahore green #0E7C5A, Daejeon blue #1F4FBF, Tama plum #A8326A, signal yellow #F2B705. Display type Big Shoulders Display (condensed, switchboard feel), body Familjen Grotesk. Add `ads.txt`, `robots.txt`, `.nojekyll`, manifest, SVG favicon and OG image.

### Phase 2 — The 042 number checker (traffic engine)
> Build a client-side checker in `main.js`: normalise input; detect +92/+82/+81 followed by 42; validate subscriber length (Lahore 8 or 9 for 111 UAN, Daejeon 7–8, Tama 7); for local 042 numbers list every country whose plan fits; recognise mobile ranges (PK 03xx, KR 010, JP 070/080/090); add risk points for wangiri/premium ranges and spoofing patterns; compute a 1–9 score with green/amber/red verdict. Add a report form (category + details) that stores reports in localStorage and sends them for review, plus a recent-reports feed. Support `?n=` deep links. Embed a compact checker in the home hero and in every city-guide sidebar.

### Phase 3 — City guides (topical authority)
> Create `lahore.html`, `daejeon.html`, `tama.html`: fact grid (population with census year, code, formats, time zone, currency, airports), how-to-dial list, `#scams` section with that country's top 5 scam scripts, hotline table, money/calling section, business or relocation section, FAQ using `<details>` (build.py auto-emits FAQPage JSON-LD). Cite figures in copy. Each page ends in a quote CTA.

### Phase 4 — Money tools (affiliate revenue)
> `send-money.html`: estimator (amount, source currency, destination PKR/KRW/JPY, optional quoted rate) pulling live mid-market rates from `open.er-api.com` with a static fallback; show four transfer profiles (low-fee online, promo app, wallet/cash pickup, bank wire) with estimated amount received. Provider table with `data-partner="group:index"` buttons that use affiliate URLs from config, else route to the quote wizard. `call-042.html`: dialing calculator for 36 countries (exit code + country + 42 + number, domestic case), live local time and "good hour to call" hint, quick-reference table.

### Phase 5 — Lead generation (primary revenue)
> `get-a-number.html`: 4-step wizard with progress bar — (1) need: business 042 number, transfers, calling, relocation, protection, other; (2) region + current location + timeline; (3) company, team size, monthly budget, preferred contact (email/phone/WhatsApp), message; (4) name, email, phone, WhatsApp, consent to be contacted by up to 3 providers. Validate per step, preselect via `?need=`, honeypot field, fire `generate_lead` analytics event. Every page links into it; add a dismissible sticky mobile CTA after 900px scroll.

### Phase 6 — Community, donations, contests, careers, advertising
> `support.html`: tier buttons ($5/$25/$100/$500 with concrete impact), payment buttons for Stripe, PayPal, Buy Me a Coffee, Ko-fi, Patreon, UPI read from config (fallback to pledge form), fundraising meter, allocation table (operations, promotions & marketing, hiring talent, contests & prizes), pledge form with currency/frequency/purpose. `contests.html`: current challenge, countdown, prize table, entry form, rules. `careers.html`: 8 remote roles + application form. `advertise.html`: six sponsorship products, domain/website acquisition callout, media-kit form. `videos.html`: click-to-load YouTube (nocookie) grid from config + suggestion form.

### Phase 7 — Trust, legal & SEO
> `about.html`, `contact.html` (topic-routed form, no address exposed), `privacy.html` (AdSense cookies, rights under GDPR/PIPEDA/Law 25/CCPA/PIPA/APPI), `terms.html`, `disclaimer.html` (trademark disclosure, nominative use, copyright, affiliate disclosure), `404.html`, cookie notice, WebSite + Organization + SearchAction JSON-LD on home, FAQPage on guides, sitemap. Verify: no console errors, no horizontal scroll, address absent from built HTML.

---

### Phase 8 — Languages (bold path, biggest traffic multiplier)
> Add `/ur/`, `/ko/`, `/ja/` versions of home, checker and the matching city guide, with `hreflang` alternates and a language switch. Extend build.py to read `src/pages/<lang>/`. Native-speaker review before publishing.

### Phase 9 — Shared report database + programmatic number pages
> Move reports to a free Supabase table (anon insert with RLS, moderated flag). Nightly GitHub Action fetches approved reports and generates `/n/<number>.html` pages (score, categories, anonymised comments, related numbers) plus a "trending 042 numbers" page and sitemap shards. Never store or show caller names.

### Phase 10 — Exchange-prefix pages
> Generate pages for each published exchange prefix (e.g. Lahore 042-35xx, Tama 042-6xx Hachioji, 042-7xx Machida) from a CSV of numbering-plan data: locality, typical line type, local time, scams seen. Internal-link from city guides.

### Phase 11 — Monetisation tuning
> Create manual AdSense units (header, in-content, sidebar, footer) and paste slot IDs into config. A/B test wizard step order and CTA copy with a lightweight query-param split. Add a monthly "best transfer to Pakistan" page updated by a GitHub Action that snapshots rates.

### Phase 12 — Growth loops
> Shareable result cards (Open Graph image per checked region), "warn my family" WhatsApp share button on scam results, embeddable checker widget (`<iframe>` snippet) for community sites, and the monthly 042 Scam Report email from collected scam scripts.

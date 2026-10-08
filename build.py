#!/usr/bin/env python3
"""
042042.com static builder.

Each page's unique content lives in src/pages/<name>.html. The first line is a
metadata comment:  <!-- title: ... | description: ... -->
Running `python3 build.py` wraps every page in the shared head, interest banner,
header, footer and scripts, writes <name>.html to the repo root (what GitHub
Pages serves), and regenerates sitemap.xml.

To add a page: create src/pages/new-page.html, run the build, commit.

If src/pages/ is missing (e.g. a fresh clone that only has the published
pages), `python3 build.py --extract` recreates it from the root *.html files.
"""
import html, pathlib, re, datetime

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src" / "pages"
SITE = "https://042042.com"
ADSENSE = "ca-pub-6620975821265271"

NAV = [
    ("check.html", "Check a number"),
    ("lahore.html", "Lahore"),
    ("daejeon.html", "Daejeon"),
    ("tama.html", "Tama"),
    ("send-money.html", "Send money"),
    ("call-042.html", "Call 042"),
    ("videos.html", "Videos"),
]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{robots}">
<meta name="theme-color" content="#10233A">
<meta name="google-adsense-account" content="{adsense}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="042042">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/assets/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Familjen+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={adsense}" crossorigin="anonymous"></script>
{jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="interest" role="note">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership — <a href="https://web.works/contact" target="_blank" rel="noopener">contact here</a></div>
<header class="top">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="042042 home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><b>042042</b></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
{nav}
      <button class="theme-btn" type="button" aria-label="Switch light or dark theme"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor"/></svg></button>
      <a class="btn signal small" href="get-a-number.html">Get free quotes</a>
    </nav>
  </div>
</header>
<div class="ad-slot" data-slot="header"></div>
<main id="main">
"""

FOOT = """
</main>
<div class="ad-slot" data-slot="footer"></div>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html" style="color:#fff"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><b>042042</b></a>
        <p style="margin-top:12px">One dialing code, three cities. Free tools to check 042 numbers, stop phone scams, call home for less and send money smarter.</p>
        <a class="btn signal small" href="support.html">Support the project</a>
      </div>
      <div><h4>Tools</h4><ul>
        <li><a href="check.html">042 number checker</a></li>
        <li><a href="call-042.html">Dialing calculator</a></li>
        <li><a href="send-money.html">Transfer estimator</a></li>
        <li><a href="scam-shield.html">Scam shield</a></li>
        <li><a href="get-a-number.html">Free quotes</a></li></ul></div>
      <div><h4>Regions</h4><ul>
        <li><a href="lahore.html">Lahore · +92 42</a></li>
        <li><a href="daejeon.html">Daejeon · +82 42</a></li>
        <li><a href="tama.html">Tama, Tokyo · +81 42</a></li>
        <li><a href="meaning.html">What 042 means</a></li></ul></div>
      <div><h4>Get involved</h4><ul>
        <li><a href="support.html">Donate</a></li>
        <li><a href="contests.html">Contests &amp; prizes</a></li>
        <li><a href="careers.html">Careers</a></li>
        <li><a href="advertise.html">Advertise &amp; sponsor</a></li>
        <li><a href="videos.html">Videos</a></li></ul></div>
      <div><h4>About</h4><ul>
        <li><a href="about.html">About 042042</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="disclaimer.html">Disclaimer &amp; trademarks</a></li></ul></div>
    </div>
    <div class="legal">
      <p>© <span data-year>2026</span> 042042.com. Original content and design are copyright of the site owner. "042042" is used here only as a domain name and a descriptive numeric identifier; it is not a registered trademark of this site, and the site is not affiliated with any telecom operator, government, regulator, bank or money-transfer company named on it. Third-party names are used only to identify their own services. Some outbound links are affiliate links; we may earn a commission at no cost to you. Number checks are pattern-based guidance, not a database lookup or legal advice. See the <a href="disclaimer.html">disclaimer</a>.</p>
    </div>
  </div>
</footer>
<div class="sticky-cta" id="sticky-cta"><span>Need a 042 line, cheaper calls or a transfer quote?</span><a class="btn signal small" href="get-a-number.html">Get quotes</a><button type="button" aria-label="Dismiss">×</button></div>
<div class="consent" id="consent" role="dialog" aria-label="Cookie notice">
  <strong>Cookies on 042042</strong>
  <p style="margin:6px 0 0">We use cookies for ads (Google AdSense), basic analytics and to remember your settings. See our <a href="privacy.html">privacy policy</a>.</p>
  <div class="btns"><button class="btn small" type="button" data-consent="all">Accept</button><button class="btn ghost small" type="button" data-consent="essential">Essential only</button></div>
</div>
<script src="assets/js/config.js"></script>
<script src="assets/js/data.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
"""

ORG_LD = """<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"042042","url":"https://042042.com/","potentialAction":{"@type":"SearchAction","target":"https://042042.com/check.html?n={query}","query-input":"required name=query"}},{"@type":"Organization","name":"042042","url":"https://042042.com/","logo":"https://042042.com/assets/img/favicon.svg"}]}</script>"""


def faq_ld(body):
    qs = re.findall(r"<details><summary>(.*?)</summary>\s*<p>(.*?)</p>", body, re.S)
    if not qs:
        return ""
    import json
    strip = lambda s: re.sub(r"<[^>]+>", "", s).strip()
    data = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": strip(q),
                            "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in qs]}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"


def build():
    pages = []
    for f in sorted(SRC.glob("*.html")):
        raw = f.read_text(encoding="utf-8")
        first, body = raw.split("\n", 1)
        m = re.match(r"<!--\s*title:\s*(.*?)\s*\|\s*description:\s*(.*?)\s*-->", first)
        if not m:
            raise SystemExit(f"{f.name}: first line must be the metadata comment")
        title, desc = m.group(1), m.group(2)
        name = f.name
        url = SITE + "/" + ("" if name == "index.html" else name)
        robots = "noindex,follow" if name == "404.html" else "index,follow,max-image-preview:large"
        nav = "\n".join(f'      <a href="{h}">{html.escape(t)}</a>' for h, t in NAV)
        jsonld = (ORG_LD if name == "index.html" else "") + faq_ld(body)
        out = HEAD.format(title=html.escape(title), desc=html.escape(desc), url=url, robots=robots,
                          site=SITE, adsense=ADSENSE, nav=nav, jsonld=jsonld) + body + FOOT
        (ROOT / name).write_text(out, encoding="utf-8")
        pages.append(name)
    today = datetime.date.today().isoformat()
    urls = "".join(
        f"  <url><loc>{SITE}/{'' if p == 'index.html' else p}</loc><lastmod>{today}</lastmod>"
        f"<priority>{'1.0' if p == 'index.html' else '0.8'}</priority></url>\n"
        for p in pages if p != "404.html")
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls + "</urlset>\n", encoding="utf-8")
    print(f"Built {len(pages)} pages")


def extract():
    """Recreate src/pages/*.html from the published root pages."""
    SRC.mkdir(parents=True, exist_ok=True)
    start, end = '<main id="main">\n', "\n</main>\n<div class=\"ad-slot\" data-slot=\"footer\">"
    n = 0
    for f in sorted(ROOT.glob("*.html")):
        page = f.read_text(encoding="utf-8")
        if start not in page or end not in page:
            continue
        title = html.unescape(re.search(r"<title>(.*?)</title>", page, re.S).group(1))
        desc = html.unescape(re.search(r'<meta name="description" content="(.*?)">', page, re.S).group(1))
        body = page.split(start, 1)[1].rsplit(end, 1)[0]
        (SRC / f.name).write_text(f"<!-- title: {title} | description: {desc} -->\n" + body, encoding="utf-8")
        n += 1
    print(f"Extracted {n} pages into {SRC}")


if __name__ == "__main__":
    import sys
    if "--extract" in sys.argv or not SRC.exists():
        extract()
    build()

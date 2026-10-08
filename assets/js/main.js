/* =========================================================
   042042.com — site behaviour (no dependencies)
   ========================================================= */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {}, D = window.DATA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function toast(msg) {
    var t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- Theme + menu ---------- */
  var savedTheme = store.get("theme", null);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  $$(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next); store.set("theme", next);
    });
  });
  var menuBtn = $(".menu-btn"), nav = $(".nav");
  if (menuBtn && nav) menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", open);
  });
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(function (a) { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });
  $$(".interest a").forEach(function (a) { if (C.interestUrl) a.href = C.interestUrl; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Consent notice ---------- */
  var consent = $("#consent");
  if (consent && !store.get("consent", null)) consent.classList.add("show");
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () { store.set("consent", b.getAttribute("data-consent")); consent.classList.remove("show"); });
  });

  /* ---------- AdSense manual units (Auto Ads covers the rest) ---------- */
  $$(".ad-slot[data-slot]").forEach(function (box) {
    var id = (C.adSlots || {})[box.getAttribute("data-slot")];
    if (!id) return;
    box.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' +
      esc(C.adsenseClient) + '" data-ad-slot="' + esc(id) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  /* ---------- Form delivery (inbox never present in markup) ---------- */
  function inbox() {
    if (C.formAlias) return C.formAlias;
    return (C._r || []).map(function (c) { return String.fromCharCode(c); }).reverse().join("");
  }
  function send(subject, data) {
    var payload = Object.assign({ _subject: "[042042] " + subject, _template: "table", _captcha: "false", page: location.href }, data);
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(inbox()), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload)
    }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  window.__send042 = send;
  function formData(form) {
    var out = {};
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.classList.contains("hp-field")) return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      out[el.name] = out[el.name] ? out[el.name] + ", " + el.value : el.value;
    });
    return out;
  }
  function msg(form, ok, text) {
    var m = $(".form-msg", form); if (!m) return;
    m.className = "form-msg " + (ok ? "ok" : "err"); m.textContent = text; m.setAttribute("role", "status");
  }
  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var hp = $(".hp-field", form); if (hp && hp.value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = $("button[type=submit]", form); if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
      var data = formData(form);
      if (form.id === "lead-form") Object.assign(data, store.get("wizard", {}));
      send(form.getAttribute("data-form"), data).then(function () {
        msg(form, true, form.getAttribute("data-ok") || "Received. We reply within one business day.");
        form.reset(); if (window.gtag) gtag("event", "generate_lead", { form: form.getAttribute("data-form") });
      }).catch(function () {
        msg(form, false, "That didn't go through. Check your connection and press the button again.");
      }).then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
    });
  });

  /* ---------- 042 number checker ---------- */
  function digits(s) { return String(s).replace(/[^\d+]/g, ""); }
  function analyse(raw) {
    var s = digits(raw), plain = s.replace(/^\+/, "").replace(/^00/, ""), intl = /^\+|^00/.test(s);
    var R = D.regions, out = { input: raw, matches: [], notes: [], score: 1 };
    if (plain.length < 6) { out.error = "Enter at least 6 digits — for example 042 3575 1234 or +82 42 123 4567."; return out; }
    function add(key, sub, confidence, why) {
      var r = R[key];
      out.matches.push({ key: key, r: r, sub: sub, confidence: confidence, why: why,
        pretty: "+" + r.cc + " " + r.area + " " + sub.replace(/(\d{3,4})(\d{4})$/, "$1 $2") });
    }
    if (intl) {
      [["92", "lahore"], ["82", "daejeon"], ["81", "tama"]].forEach(function (p) {
        var r = R[p[1]];
        if (plain.indexOf(p[0] + "42") === 0) {
          var sub = plain.slice(p[0].length + 2);
          var okLen = r.localLen.indexOf(sub.length) > -1;
          add(p[1], sub, okLen ? "Exact" : "Partial", okLen ? "Country code +" + p[0] + " and area 42 with a valid length." : "Country and area match but the subscriber part has " + sub.length + " digits (expected " + r.localLen.join(" or ") + ").");
        } else if (plain.indexOf(p[0]) === 0 && r.mobile.test(plain.slice(p[0].length))) {
          out.notes.push("This is a " + r.country + " mobile number, not a 042 landline. " + r.mobileNote);
        }
      });
      if (!out.matches.length && !out.notes.length) out.notes.push("This international number does not belong to any 042 region.");
    } else {
      var n = plain.replace(/^0/, "");
      if (n.indexOf("42") === 0) {
        var sub = n.slice(2);
        ["lahore", "daejeon", "tama"].forEach(function (k) {
          if (R[k].localLen.indexOf(sub.length) > -1) add(k, sub, "Possible", "042 followed by " + sub.length + " digits fits " + R[k].country + "'s numbering plan.");
        });
        if (!out.matches.length) out.notes.push("Starts with 042 but has " + sub.length + " digits after it. Lahore uses 8 (9 for 111 business numbers), Daejeon 7–8, Tama 7.");
        if (out.matches.length > 1) out.notes.push("Several countries share 042. Look at how the call arrived: an international call usually shows +92, +82 or +81 in front.");
      } else {
        ["lahore", "daejeon", "tama"].forEach(function (k) { if (R[k].mobile.test(n)) out.notes.push("Looks like a " + R[k].country + " mobile number. " + R[k].mobileNote); });
        if (!out.notes.length) out.notes.push("This number does not start with 042, so it is outside the three 042 regions.");
      }
    }
    D.riskSignals.forEach(function (sig) { if (sig.re.test(s)) { out.score += sig.pts; out.notes.push(sig.msg); } });
    var key = plain.replace(/^0+/, "");
    var reps = (store.get("reports", {})[key] || []);
    if (reps.length) { out.score += Math.min(4, reps.length * 2); out.notes.push("Reported " + reps.length + " time(s) from this device: " + reps.map(function (r) { return r.cat; }).join(", ") + "."); }
    out.reports = reps; out.key = key;
    out.score = Math.max(1, Math.min(9, out.score));
    return out;
  }
  function renderResult(box, res) {
    if (res.error) { box.innerHTML = '<p class="form-msg err" style="display:block">' + esc(res.error) + "</p>"; box.classList.add("show"); return; }
    var lvl = res.score >= 6 ? "high" : res.score >= 3 ? "mid" : "low";
    var verdict = { low: "No warning signs in the number itself", mid: "Some warning signs — be careful", high: "High risk — don't call back or share codes" }[lvl];
    var html = '<div class="verdict"><div class="score ' + lvl + '" aria-label="Risk score ' + res.score + ' of 9">' + res.score + '</div><div><strong>' + verdict + '</strong><br><span class="muted">Risk score out of 9, from the number pattern and reports made on this device.</span></div></div>';
    if (res.matches.length) {
      html += '<div class="matches">' + res.matches.map(function (m) {
        return '<div class="match ' + m.key + '"><span class="bar ' + m.key + '"></span><div><strong>' + esc(m.r.name) + "</strong> · " + esc(m.confidence) +
          "<p>" + esc(m.why) + " International format: <b>" + esc(m.pretty) + '</b>.</p><p><a href="' + m.r.url + '#scams">Common scams in ' + esc(m.r.short) + '</a> · <a href="call-042.html">How to call it</a></p></div></div>';
      }).join("") + "</div>";
    }
    if (res.notes.length) html += '<ul class="mt">' + res.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>";
    html += '<p class="mt"><a class="btn small" href="check.html?n=' + encodeURIComponent(res.input) + '#report">Report this number</a> <a class="btn small ghost" href="scam-shield.html">What to do next</a></p>';
    box.innerHTML = html; box.classList.add("show");
  }
  $$("form[data-checker]").forEach(function (f) {
    var input = $("input", f), box = $(f.getAttribute("data-checker"));
    f.addEventListener("submit", function (e) {
      e.preventDefault(); renderResult(box, analyse(input.value));
      var hist = store.get("searches", 0) + 1; store.set("searches", hist);
      if (window.gtag) gtag("event", "number_check");
    });
    var q = new URLSearchParams(location.search).get("n");
    if (q && input) { input.value = q; renderResult(box, analyse(q)); }
  });

  /* ---------- Report a number ---------- */
  var rep = $("#report-form");
  if (rep) {
    var q2 = new URLSearchParams(location.search).get("n"); if (q2) rep.number.value = q2;
    rep.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!rep.checkValidity()) { rep.reportValidity(); return; }
      var key = digits(rep.number.value).replace(/^\+/, "").replace(/^0+/, "");
      var all = store.get("reports", {}); all[key] = all[key] || [];
      all[key].push({ cat: rep.category.value, t: Date.now() }); store.set("reports", all);
      send("Number report", formData(rep)).catch(function () {});
      msg(rep, true, "Thanks — your report is saved and sent for review. Reports help others spot the same caller.");
      renderFeed(); rep.reset();
    });
  }
  function renderFeed() {
    var feed = $("#report-feed"); if (!feed) return;
    var all = store.get("reports", {}), rows = [];
    Object.keys(all).forEach(function (k) { all[k].forEach(function (r) { rows.push([k, r]); }); });
    rows.sort(function (a, b) { return b[1].t - a[1].t; });
    feed.innerHTML = rows.length ? rows.slice(0, 10).map(function (x) {
      return "<li><b>" + esc(x[0].replace(/^(\d{2,3})(\d{2})(\d+)$/, "+$1 $2 $3")) + "</b> — " + esc(x[1].cat) + ' <span class="muted">' + new Date(x[1].t).toLocaleDateString() + "</span></li>";
    }).join("") : "<li class='muted'>No reports yet on this device. Check a number above, then report it if it bothered you.</li>";
  }
  renderFeed();

  /* ---------- Dialing calculator ---------- */
  var dial = $("#dial-form");
  if (dial) {
    var from = dial.from;
    D.countries.forEach(function (c, i) { var o = document.createElement("option"); o.value = i; o.textContent = c[0]; from.appendChild(o); });
    var guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
    D.countries.forEach(function (c, i) { if (c[3] === guess) from.value = i; });
    function fmtTime(tz) { try { return new Intl.DateTimeFormat([], { timeZone: tz, hour: "2-digit", minute: "2-digit", weekday: "short" }).format(new Date()); } catch (e) { return "—"; } }
    function update() {
      var c = D.countries[from.value], r = D.regions[dial.to.value], num = digits(dial.num.value).replace(/^0?42/, "");
      var sub = num || "XXXXXXXX", out;
      if (c[1] === r.cc) out = "0" + r.area + " " + sub + "  (domestic call: keep the leading 0)";
      else out = c[2] + " " + r.cc + " " + r.area + " " + sub + "   or from a mobile: +" + r.cc + " " + r.area + " " + sub;
      $("#dial-out").textContent = out;
      var hr = new Date().toLocaleString("en-US", { timeZone: r.tz, hour: "numeric", hour12: false });
      var h = parseInt(hr, 10), good = h >= 9 && h < 21;
      $("#dial-time").innerHTML = "Your time: <b>" + esc(fmtTime(c[3])) + "</b> · Time in " + esc(r.short) + ": <b>" + esc(fmtTime(r.tz)) + "</b> — " + (good ? "a reasonable hour to call." : "outside 9am–9pm there; consider a message instead.");
    }
    ["change", "input"].forEach(function (ev) { dial.addEventListener(ev, update); });
    dial.addEventListener("submit", function (e) { e.preventDefault(); update(); });
    update();
  }

  /* ---------- Money-transfer estimator (live reference rates) ---------- */
  var fx = $("#fx-form");
  if (fx) {
    var rates = null;
    var dest = { lahore: "PKR", daejeon: "KRW", tama: "JPY" };
    fetch("https://open.er-api.com/v6/latest/USD").then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.rates) { rates = j.rates; $("#fx-status").textContent = "Reference mid-market rates updated " + new Date(j.time_last_update_unix * 1000).toLocaleString() + "."; calc(); }
    }).catch(function () { rates = { USD: 1, GBP: 0.74, EUR: 0.86, SAR: 3.75, AED: 3.6725, CAD: 1.37, AUD: 1.52, QAR: 3.64, KWD: 0.306, PKR: 281, KRW: 1380, JPY: 148 };
      $("#fx-status").textContent = "Live rates unavailable — showing approximate fallback rates. Enter the rate you were quoted for accuracy."; calc(); });
    var profiles = [
      ["Low-fee online transfer", 0.006, 0.0, "Bank deposit, 0–1 day"],
      ["App with first-transfer promo", 0.012, 0.0, "Wallet or bank, minutes"],
      ["Mobile-wallet / cash pickup", 0.02, 2.99, "Cash pickup, minutes"],
      ["Traditional bank wire", 0.035, 25, "Bank, 1–3 days"]
    ];
    function calc() {
      var amt = parseFloat(fx.amount.value) || 0, cur = fx.cur.value, to = dest[fx.to.value];
      var manual = parseFloat(fx.rate.value);
      var mid = manual || (rates && rates[to] && rates[cur] ? rates[to] / rates[cur] : 0);
      var body = $("#fx-body"); if (!mid) { body.innerHTML = "<tr><td colspan='4'>Enter a rate to estimate.</td></tr>"; return; }
      body.innerHTML = profiles.map(function (p) {
        var feeConv = p[2] * (rates && rates[cur] ? rates[cur] : 1);
        var got = Math.max(0, (amt - feeConv) * mid * (1 - p[1]));
        return "<tr><td><b>" + esc(p[0]) + "</b></td><td>" + (p[1] * 100).toFixed(1) + "% + " + feeConv.toFixed(2) + " " + esc(cur) + "</td><td>" + esc(p[3]) + "</td><td><b>" + Math.round(got).toLocaleString() + " " + esc(to) + "</b></td></tr>";
      }).join("");
      $("#fx-mid").textContent = "1 " + cur + " = " + mid.toFixed(mid > 10 ? 2 : 4) + " " + to + " (mid-market)";
    }
    ["input", "change"].forEach(function (ev) { fx.addEventListener(ev, calc); });
    fx.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
  }
  $$("[data-partner]").forEach(function (a) {
    var group = a.getAttribute("data-partner").split(":"), list = (C.partners || {})[group[0]] || [], p = list[+group[1]];
    if (p && p.url) { a.href = p.url; a.target = "_blank"; a.rel = "sponsored noopener"; }
    else a.href = "get-a-number.html?need=" + group[0];
  });

  /* ---------- Lead wizard ---------- */
  var wiz = $("#wizard");
  if (wiz) {
    var steps = $$(".wiz-step", wiz), i = 0, bar = $(".wiz-progress i", wiz);
    var need = new URLSearchParams(location.search).get("need");
    if (need) { var pre = $('input[name=need][value="' + need + '"]', wiz); if (pre) pre.checked = true; }
    function show(n) {
      steps.forEach(function (s, k) { s.classList.toggle("active", k === n); });
      bar.style.width = ((n + 1) / steps.length * 100) + "%";
      var f = $("input,select,textarea", steps[n]); if (f && n) f.focus({ preventScroll: true });
      i = n;
    }
    $$("[data-next]", wiz).forEach(function (b) {
      b.addEventListener("click", function () {
        var cur = steps[i], req = $$("[required]", cur), ok = true;
        req.forEach(function (el) { if (!el.checkValidity()) { ok = false; } });
        var radios = $$("input[type=radio]", cur);
        if (radios.length && !radios.some(function (r) { return r.checked; })) ok = false;
        if (!ok) { toast("Pick an option to continue."); return; }
        var sel = {}; $$("input:checked,select", wiz).forEach(function (el) { if (el.name) sel[el.name] = el.value; });
        store.set("wizard", sel); show(Math.min(i + 1, steps.length - 1));
      });
    });
    $$("[data-back]", wiz).forEach(function (b) { b.addEventListener("click", function () { show(Math.max(i - 1, 0)); }); });
    show(0);
  }

  /* ---------- Donations ---------- */
  var tiers = $$(".tier"), amountField = $("#pledge-amount");
  tiers.forEach(function (t) {
    t.addEventListener("click", function () {
      tiers.forEach(function (x) { x.classList.remove("sel"); x.setAttribute("aria-pressed", "false"); });
      t.classList.add("sel"); t.setAttribute("aria-pressed", "true");
      if (amountField) amountField.value = t.getAttribute("data-amount");
    });
  });
  $$("[data-pay]").forEach(function (a) {
    var url = (C.payments || {})[a.getAttribute("data-pay")];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = "#pledge"; }
  });
  var fr = C.fundraising, meter = $("#meter");
  if (fr && meter) {
    var pct = Math.min(100, fr.goal ? fr.raised / fr.goal * 100 : 0);
    $("i", meter).style.width = Math.max(pct, 2) + "%";
    $("#meter-text").textContent = fr.raised.toLocaleString() + " of " + fr.goal.toLocaleString() + " " + fr.currency + " raised for this year's operations";
  }

  /* ---------- Videos (click-to-load for speed) ---------- */
  var vg = $("#video-grid");
  if (vg) {
    var vids = ((C.youtube || {}).videos) || [];
    if (vids.length) {
      vg.innerHTML = vids.map(function (v) {
        return '<div><div class="video"><button type="button" data-yt="' + esc(v.id) + '" style="background-image:url(https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg)"><span>' + esc(v.title) + "</span></button></div></div>";
      }).join("");
    }
    vg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-yt]"); if (!b) return;
      b.parentNode.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.getAttribute("data-yt")) + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    });
  }
  $$("[data-channel]").forEach(function (a) { if ((C.youtube || {}).channelUrl) a.href = C.youtube.channelUrl; });

  /* ---------- Contest countdown ---------- */
  var cd = $("#countdown");
  if (cd) {
    var end = new Date(cd.getAttribute("data-end"));
    var tick = function () {
      var ms = end - new Date(); if (ms < 0) { cd.textContent = "Entries closed — winners announced soon."; return; }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      cd.textContent = d + " days " + h + " hours " + m + " minutes left to enter";
    };
    tick(); setInterval(tick, 30000);
  }

  /* ---------- Sticky mobile CTA ---------- */
  var sticky = $("#sticky-cta");
  if (sticky && !store.get("stickyClosed", false) && !/get-a-number|contact/.test(here)) {
    var shown = false;
    addEventListener("scroll", function () { if (!shown && scrollY > 900) { sticky.classList.add("show"); shown = true; } }, { passive: true });
    $("button", sticky).addEventListener("click", function () { sticky.classList.remove("show"); store.set("stickyClosed", true); });
  }
})();

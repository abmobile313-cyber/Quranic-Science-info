/* Quranic Science · course-page urgency: real offer countdown, real seats left (Firestore voice/seats), sticky enroll bar.
   Honest only: the deadline is the real first-batch deadline and the seats are the real counts. */
(function () {
  var me = document.currentScript || document.querySelector('script[src*="qs-urgency.js"]');
  var DEADLINE = Date.parse("2026-11-30T23:59:59+05:30"), CAP = 100;
  var can = (document.querySelector('link[rel=canonical]') || {}).href || location.pathname;
  var m = String(can).match(/course-([a-z0-9-]+?)(?:-(?:ur|hi|ar))?(?:\.html)?$/);
  var KEY = (me && me.dataset.course) || (m && m[1]) || "";
  var L = (me && me.dataset.lang) || (document.documentElement.lang || "en").slice(0, 2);
  var AFTER = me && me.dataset.after;
  var T = {
    en: { ends: "First-batch price ends in", afa: "40% off ends in", d: "d", h: "h", m: "m", s: "s", seats: "Only " + CAP + " seats per batch", left: "seats left", hot: "Only {n} seats left!", full: "Batch full", mor: "☀️ Morning batch", eve: "🌙 Evening batch", joined: "{n} students joined", fcfs: "First come, first served", enroll: "Enroll now", closed: "The 40% offer has ended", price: "Price goes up after 30 November", one: "Live batch" },
    ur: { ends: "پہلے بیچ کی قیمت ختم ہونے میں", afa: "40% رعایت ختم ہونے میں", d: "دن", h: "گھنٹے", m: "منٹ", s: "سیکنڈ", seats: "ہر بیچ میں صرف " + CAP + " سیٹیں", left: "سیٹیں باقی", hot: "صرف {n} سیٹیں باقی!", full: "بیچ مکمل", mor: "☀️ صبح کا بیچ", eve: "🌙 شام کا بیچ", joined: "{n} طلبہ شامل ہو چکے", fcfs: "جو پہلے آئے، اسے سیٹ", enroll: "ابھی داخلہ لیں", closed: "40% آفر ختم ہو گئی", price: "30 نومبر کے بعد قیمت بڑھ جائے گی", one: "لائیو بیچ" },
    hi: { ends: "पहले बैच की क़ीमत ख़त्म होने में", afa: "40% छूट ख़त्म होने में", d: "दिन", h: "घंटे", m: "मिनट", s: "सेकंड", seats: "हर बैच में सिर्फ़ " + CAP + " सीटें", left: "सीटें बाक़ी", hot: "सिर्फ़ {n} सीटें बाक़ी!", full: "बैच फ़ुल", mor: "☀️ सुबह का बैच", eve: "🌙 शाम का बैच", joined: "{n} स्टूडेंट्स जुड़ चुके", fcfs: "जो पहले आए, उसे सीट", enroll: "अभी दाख़िला लें", closed: "40% ऑफ़र ख़त्म हो गया", price: "30 नवंबर के बाद क़ीमत बढ़ जाएगी", one: "लाइव बैच" },
    ar: { ends: "ينتهي سعر الدفعة الأولى خلال", afa: "ينتهي خصم 40% خلال", d: "ي", h: "س", m: "د", s: "ث", seats: "فقط " + CAP + " مقعد في كل دفعة", left: "مقعدًا متبقيًا", hot: "بقي {n} مقاعد فقط!", full: "الدفعة مكتملة", mor: "☀️ الدفعة الصباحية", eve: "🌙 الدفعة المسائية", joined: "انضم {n} طالبًا", fcfs: "الأولوية لمن يسجّل أولًا", enroll: "سجّل الآن", closed: "انتهى عرض 40%", price: "يرتفع السعر بعد 30 نوفمبر", one: "دفعة مباشرة" }
  }[L] || null;
  if (!T || !KEY) return;
  var price = document.querySelector(".hero .price"), isAfa = !!(price && price.dataset.afa);
  var discounted = !!(price && price.querySelector("s"));
  var css = document.createElement("style");
  css.textContent = ".qsu{margin-top:14px;display:grid;gap:10px}.qsu-cd{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,#7a1424,#a01d34);color:#fff;box-shadow:0 10px 26px -14px rgba(122,20,36,.8)}.qsu-cd span{font-weight:600;font-size:14px;opacity:.95}.qsu-t{display:flex;gap:6px;direction:ltr}.qsu-t b{min-width:44px;text-align:center;padding:6px 4px;border-radius:10px;background:rgba(255,255,255,.16);font:700 18px/1.1 Outfit,system-ui,sans-serif}.qsu-t b small{display:block;font:500 10px/1.2 Manrope,system-ui,sans-serif;opacity:.85}.qsu-note{font-size:13px;color:#a01d34;font-weight:600}.qsu-seats{padding:12px 14px;border-radius:16px;border:1.5px solid rgba(160,29,52,.25);background:rgba(255,255,255,.7)}.qsu-top{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:14px}.qsu-top small{opacity:.75}.qsu-row{margin-top:8px;font-size:13.5px}.qsu-row div{display:flex;justify-content:space-between;gap:8px}.qsu-bar{height:7px;border-radius:9px;background:rgba(160,29,52,.12);overflow:hidden;margin-top:4px}.qsu-bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#d4a017,#a01d34)}.qsu-row.hot span{color:#c0392b;font-weight:700}.qsu-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#e74c3c;margin-inline-end:6px;animation:qsuP 1.4s infinite}@keyframes qsuP{0%{box-shadow:0 0 0 0 rgba(231,76,60,.6)}100%{box-shadow:0 0 0 10px rgba(231,76,60,0)}}.qsu-bar-s{position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px max(16px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:rgba(122,20,36,.96);color:#fff;backdrop-filter:blur(12px);transform:translateY(110%);transition:transform .35s cubic-bezier(.2,.9,.3,1.2)}.qsu-bar-s.on{transform:none}.qsu-bar-s div{display:flex;flex-direction:column;min-width:0}.qsu-bar-s b{font:700 16px Outfit,system-ui,sans-serif}.qsu-bar-s small{font-size:12px;opacity:.9;direction:ltr;text-align:start}.qsu-bar-s a{flex:none;padding:11px 18px;border-radius:999px;background:#d4a017;color:#2a0a10;font-weight:800;text-decoration:none}@media (prefers-color-scheme:dark){.qsu-seats{background:rgba(30,10,14,.55);border-color:rgba(212,160,23,.35)}.qsu-note{color:#f0b4bd}}";
  document.head.appendChild(css);
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function parts(ms) { var s = Math.floor(ms / 1000); return [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60]; }

  /* after the deadline the AI Film course switches to its full fee (the enroll links go through /go/ pages that switch too) */
  function afterDeadline() {
    if (!isAfa || !price) return;
    var b = price.querySelector("b"); if (b) b.textContent = "₹11,665";
    price.querySelectorAll("s,em").forEach(function (x) { x.remove(); });
    var u = price.querySelectorAll(".lbl b"); if (u.length) u[u.length - 1].textContent = "$140";
    var chip = document.querySelector(".hero .chip"); if (chip) chip.textContent = "Enrolling";
  }
  var live = Date.now() < DEADLINE;
  if (!live) afterDeadline();

  var host = document.createElement("div"); host.className = "qsu";
  if (live && price) {
    host.innerHTML = '<div class="qsu-cd"><span>⏳ ' + (isAfa ? T.afa : T.ends) + '</span><div class="qsu-t" data-qsu-cd></div></div>' +
      (discounted && AFTER ? '<div class="qsu-note">' + AFTER + '</div>' : discounted ? '<div class="qsu-note">' + T.price + '</div>' : "");
  }
  var seatsBox = document.createElement("div"); seatsBox.className = "qsu-seats"; seatsBox.hidden = true; host.appendChild(seatsBox);
  if (price) price.parentNode.insertBefore(host, (price.nextElementSibling && price.nextElementSibling.classList.contains("acts")) ? price.nextElementSibling.nextSibling : price.nextSibling);

  /* sticky enroll bar, only while the hero buttons are off screen */
  var first = document.querySelector(".hero .acts a");
  var bar = document.createElement("div"); bar.className = "qsu-bar-s";
  var pb = price && price.querySelector("b");
  bar.innerHTML = '<div><b>' + (pb ? pb.textContent : "") + '</b><small data-qsu-mini></small></div><a href="' + (first ? first.getAttribute("href") : "#main") + '" rel="noopener">' + T.enroll + '</a>';
  document.body.appendChild(bar);
  var acts = document.querySelector(".hero .acts");
  if (acts && "IntersectionObserver" in window) new IntersectionObserver(function (e) { bar.classList.toggle("on", !e[0].isIntersecting && e[0].boundingClientRect.top < 0); }).observe(acts);
  document.querySelector("footer") && (document.querySelector("footer").style.paddingBottom = "80px");

  function tick() {
    var left = DEADLINE - Date.now();
    if (left <= 0 && live) { live = false; afterDeadline(); var c = host.querySelector(".qsu-cd"); if (c) c.remove(); var n = host.querySelector(".qsu-note"); if (n) n.remove(); var mm = bar.querySelector("[data-qsu-mini]"); if (mm) mm.textContent = ""; if (pb) bar.querySelector("b").textContent = pb.textContent; return; }
    if (!live) return;
    var p = parts(left), el = host.querySelector("[data-qsu-cd]");
    if (el) el.innerHTML = '<b>' + p[0] + '<small>' + T.d + '</small></b><b>' + pad(p[1]) + '<small>' + T.h + '</small></b><b>' + pad(p[2]) + '<small>' + T.m + '</small></b><b>' + pad(p[3]) + '<small>' + T.s + '</small></b>';
    var mini = bar.querySelector("[data-qsu-mini]"); if (mini) mini.innerHTML = "⏳ <bdi>" + p[0] + " " + T.d + "</bdi> · <bdi dir=\"ltr\">" + pad(p[1]) + ":" + pad(p[2]) + ":" + pad(p[3]) + "</bdi>";
  }
  tick(); setInterval(tick, 1000);

  /* real seat counts */
  fetch("https://firestore.googleapis.com/v1/projects/quranicscience-682ff/databases/(default)/documents/voice/seats?key=AIzaSyCCoqjw2BzgWcal6OVBqONYOB7x--WP12g", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    .then(function (j) {
      var f = (j && j.fields) || {}, num = function (o) { return +(o && (o.integerValue || o.doubleValue) || 0); };
      var cap = num(f.cap) || CAP, c = ((f[KEY] || {}).mapValue || {}).fields || {};
      var M = num(c.M), E = num(c.E), tot = M + E;
      var row = function (lab, n) { var l = Math.max(0, cap - n), hot = l > 0 && l <= 20; return '<div class="qsu-row' + (hot ? " hot" : "") + '"><div><b>' + lab + '</b><span>' + (l === 0 ? T.full : hot ? T.hot.replace("{n}", l) : l + " / " + cap + " " + T.left) + '</span></div><div class="qsu-bar"><i style="width:' + Math.max(3, Math.round(Math.min(n, cap) / cap * 100)) + '%"></i></div></div>'; };
      seatsBox.innerHTML = '<div class="qsu-top"><b><span class="qsu-dot"></span>' + T.seats + '</b><small>' + (tot ? T.joined.replace("{n}", tot) : T.fcfs) + '</small></div>' +
        (isAfa ? row(T.one, tot) : row(T.mor, M) + row(T.eve, E));
      seatsBox.hidden = false;
    });
})();

/* Quranic Science · "easy mode" for visitors (Nov 2026: viewers said the website felt complicated).
   Adds one clear start bar with 4 big choices on top of every main page, keeps all features, and makes the help popup wait. */
(function () {
  var TX = {
    en: { h: "What would you like to do?", c: ["Courses & fees", "Join a class"], m: ["My classes", "For students"], v: ["Watch videos", "Quran & science"], w: ["Ask on WhatsApp", "We reply fast"] },
    ur: { h: "آپ کیا کرنا چاہتے ہیں؟", c: ["کورسز اور فیس", "کلاس میں داخلہ"], m: ["میری کلاسیں", "طلبہ کے لیے"], v: ["ویڈیوز دیکھیں", "قرآن اور سائنس"], w: ["واٹس ایپ پر پوچھیں", "فوراً جواب"] },
    hi: { h: "आप क्या करना चाहते हैं?", c: ["कोर्स और फ़ीस", "क्लास में दाख़िला"], m: ["मेरी क्लासें", "स्टूडेंट्स के लिए"], v: ["वीडियो देखें", "क़ुरआन और साइंस"], w: ["व्हाट्सऐप पर पूछें", "फ़ौरन जवाब"] },
    ar: { h: "ماذا تريد أن تفعل؟", c: ["الدورات والرسوم", "سجّل في درس"], m: ["دروسي", "للطلاب"], v: ["شاهد الفيديوهات", "القرآن والعلم"], w: ["اسأل على واتساب", "نرد بسرعة"] }
  };
  var L = function () { try { var c = typeof curLang === "function" ? curLang() : "en"; c = String(c || "en").slice(0, 2); return TX[c] ? c : "en"; } catch (e) { return "en"; } };
  var css = document.createElement("style");
  css.textContent = ".qse{margin:10px auto 14px;max-width:1100px;padding:14px;border-radius:22px;background:rgba(255,255,255,.08);border:1px solid rgba(201,154,69,.35);backdrop-filter:blur(14px)}" +
    ".qse h2{margin:0 0 10px;font-size:clamp(17px,4.4vw,22px);text-align:center}.qse-g{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}" +
    "@media(max-width:720px){.qse-g{grid-template-columns:1fr 1fr}}" +
    ".qse a,.qse button{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:96px;padding:12px 8px;border-radius:18px;text-align:center;background:linear-gradient(160deg,rgba(201,154,69,.22),rgba(122,20,36,.18));border:1px solid rgba(201,154,69,.4);box-shadow:0 8px 22px -14px rgba(0,0,0,.55);transition:transform .18s}" +
    ".qse a:active,.qse button:active{transform:scale(.96)}.qse i{font-style:normal;font-size:30px;line-height:1}.qse b{font-size:15.5px}.qse small{font-size:12px;opacity:.75}" +
    ".qse .wa{background:linear-gradient(160deg,rgba(37,211,102,.25),rgba(18,140,126,.2));border-color:rgba(37,211,102,.45)}" +
    "[data-mode=light] .qse{background:rgba(255,255,255,.75)}" +
    /* less noise: hide the decorative scroll cue */
    ".qcx{margin:6px auto 18px;max-width:1100px;padding:16px;border-radius:24px;background:rgba(255,255,255,.1);border:1px solid rgba(201,154,69,.35);backdrop-filter:blur(14px)}[data-mode=light] .qcx{background:rgba(255,255,255,.78)}" +
    ".qcx-h{display:flex;flex-wrap:wrap;align-items:center;gap:10px;justify-content:space-between;margin-bottom:12px}.qcx-h b{font-size:clamp(18px,4.6vw,24px)}.qcx-h b span{font-size:.7em;opacity:.6;margin-inline-start:4px}" +
    ".qcx-in{flex:1 1 220px;max-width:420px;min-height:48px;box-sizing:border-box;padding:0 18px;border-radius:999px;border:1.5px solid rgba(201,154,69,.5);background:rgba(255,255,255,.9);color:#1d1416;font:500 16px system-ui,sans-serif}" +
    ".qcx-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}@media(max-width:640px){.qcx-g{grid-template-columns:1fr 1fr}}" +
    ".qcx-g button{all:unset;box-sizing:border-box;cursor:pointer;min-height:58px;padding:12px 14px;border-radius:16px;text-align:center;font:700 15.5px/1.3 system-ui,sans-serif;background:linear-gradient(160deg,rgba(201,154,69,.24),rgba(122,20,36,.16));border:1px solid rgba(201,154,69,.45);display:flex;align-items:center;justify-content:center;transition:transform .15s}.qcx-g button:active{transform:scale(.97)}.qcx-g button[hidden]{display:none}" +
    ".qcx-no{margin:8px 0 0;opacity:.7}.qcx-hit{outline:3px solid #c99a45;outline-offset:4px;border-radius:24px;transition:outline-color 2s}" +
    /* phone header: the extra courses icon moves out of the way (Courses is in the big bar below) and the icon captions go */
    "@media(max-width:640px){.topctl .qsmenu-w,.topctl .qh-open-btn{display:none!important}.topctl .ctlw>small,.topctl .ctlw>.cap,.topctl .ctlw>span:not(.ibtn):not(.lang){display:none!important}}" +
    "#app>.cue{display:none!important}[data-sec=learn] #app>.qs-ds,[data-sec=learn] #qsChips{display:none!important}[data-sec=learn] #qsFabC{display:none!important}";
  document.head.appendChild(css);

  function bar() {
    var t = TX[L()] || TX.en, d = document.createElement("section"); d.className = "qse"; d.id = "qsEasy";
    d.setAttribute("dir", /ur|ar/.test(L()) ? "rtl" : "ltr"); if (L() !== "en") d.setAttribute("translate", "no");
    d.innerHTML = '<h2>' + t.h + '</h2><div class="qse-g">' +
      '<button type="button" data-qse="learn"><i>🎓</i><b>' + t.c[0] + '</b><small>' + t.c[1] + '</small></button>' +
      '<button type="button" data-qse="app"><i>📚</i><b>' + t.m[0] + '</b><small>' + t.m[1] + '</small></button>' +
      '<button type="button" data-qse="videos"><i>▶️</i><b>' + t.v[0] + '</b><small>' + t.v[1] + '</small></button>' +
      '<a class="wa" href="https://wa.me/919272527913?text=' + encodeURIComponent("Assalamu Alaikum, I need help with the Quranic Science website.") + '" target="_blank" rel="noopener"><i>💬</i><b>' + t.w[0] + '</b><small>' + t.w[1] + '</small></a></div>';
    d.addEventListener("click", function (e) {
      var b = e.target.closest("[data-qse]"); if (!b) return; var k = b.dataset.qse;
      try { if (window.play) play("tap"); } catch (x) {}
      if (k === "learn") { var t1 = document.querySelector('.tab[data-tab="learn"]'); if (t1) t1.click(); else location.hash = "#learn"; }
      else if (k === "app") { if (window.qsHub) qsHub("home"); else location.hash = "#app"; }
      else if (k === "videos") { var tq = document.querySelector('.tab[data-tab="quran"]'); var go = function () { var v = [].slice.call(document.querySelectorAll("#app section.sec")).find(function (x) { return x.querySelector(".shead") && /Video|PDF|ویڈیو|वीडियो|فيديو/i.test((x.querySelector(".shead .chip") || x).textContent); }); if (v) v.scrollIntoView({ behavior: "smooth", block: "start" }); };
        if (document.documentElement.dataset.sec !== "quran" && tq) { tq.click(); setTimeout(go, 1300); } else go(); }
    });
    return d;
  }
  /* Courses page: every course name as a big button + a search box; tap or type to jump straight to that course */
  var CXT = { en: ["All our courses", "Type a course name…", "No course found"], ur: ["ہمارے تمام کورسز", "کورس کا نام لکھیں…", "کوئی کورس نہیں ملا"], hi: ["हमारे सभी कोर्स", "कोर्स का नाम लिखें…", "कोई कोर्स नहीं मिला"], ar: ["جميع دوراتنا", "اكتب اسم الدورة…", "لا توجد دورة"] };
  function courseIndex() {
    var cards = [].slice.call(document.querySelectorAll("#app article.ccard")).filter(function (c) { return c.querySelector("h3,h2"); });
    if (!cards.length) return null;
    var seen = {}, items = [];
    cards.forEach(function (c, i) { var n = (c.querySelector("h3,h2").textContent || "").trim(); if (!n || seen[n]) return; seen[n] = 1; c.id = c.id || ("qsc-" + i); items.push([n, c.id]); });
    var t = CXT[L()] || CXT.en, d = document.createElement("section"); d.id = "qsCx"; d.className = "qcx"; d.setAttribute("dir", /ur|ar/.test(L()) ? "rtl" : "ltr");
    d.innerHTML = '<div class="qcx-h"><b>' + t[0] + ' <span>' + items.length + '</span></b><input type="search" class="qcx-in" placeholder="' + t[1] + '" aria-label="' + t[1] + '" translate="no"></div><div class="qcx-g">' +
      items.map(function (x) { return '<button type="button" data-go="' + x[1] + '">' + x[0].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</button>'; }).join("") + '</div><p class="qcx-no" hidden>' + t[2] + '</p>';
    var go = function (id) { var el = document.getElementById(id); if (!el) return; try { if (window.play) play("tap"); } catch (x) {} var y = el.getBoundingClientRect().top + scrollY - 150; scrollTo({ top: y, behavior: "smooth" }); el.classList.add("qcx-hit"); setTimeout(function () { el.classList.remove("qcx-hit"); }, 2200); };
    d.addEventListener("click", function (e) { var b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });
    var inp = d.querySelector(".qcx-in");
    inp.addEventListener("input", function () { var q = inp.value.trim().toLowerCase(), any = 0; [].forEach.call(d.querySelectorAll("[data-go]"), function (b) { var ok = !q || b.textContent.toLowerCase().indexOf(q) > -1; b.hidden = !ok; if (ok) any++; }); d.querySelector(".qcx-no").hidden = !!any; });
    inp.addEventListener("keydown", function (e) { if (e.key !== "Enter") return; var b = [].filter.call(d.querySelectorAll("[data-go]"), function (x) { return !x.hidden; })[0]; if (b) { inp.blur(); go(b.dataset.go); } });
    return d;
  }
  function place() {
    var app = document.getElementById("app"); if (!app || !app.firstElementChild) return;
    var sec = document.documentElement.dataset.sec, have0 = document.getElementById("qsEasy");
    if (sec === "learn") { /* Courses page: the course list comes first, then the offer countdown; the long intro moves below */
      if (have0) have0.remove();
      var list = [].slice.call(app.children).find(function (x) { return x.tagName === "SECTION" && x.querySelector("[data-enr]"); });
      if (list && app.firstElementChild !== list) app.insertBefore(list, app.firstElementChild);
      var urg = [].slice.call(app.children).find(function (x) { return x !== list && x.tagName === "SECTION" && x.querySelector("[data-cd]"); });
      if (list && urg && list.nextElementSibling !== urg) app.insertBefore(urg, list.nextElementSibling);
      var cx = document.getElementById("qsCx");
      if (!cx) cx = courseIndex();
      if (cx && app.firstElementChild !== cx) app.insertBefore(cx, app.firstElementChild);
      return; }
    if (sec !== "quran") { if (have0) have0.remove(); return; }
    var have = document.getElementById("qsEasy");
    if (have && have.parentNode === app && app.firstElementChild === have) return;
    if (have) have.remove();
    app.insertBefore(bar(), app.firstElementChild);
  }
  var t0 = 0;
  new MutationObserver(function () { clearTimeout(t0); t0 = setTimeout(place, 120); }).observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(place, 600);

  /* the "shall I teach you this website?" popup: wait 20 s (let people look first), then go away by itself after 15 s */
  var seen = false;
  new MutationObserver(function () {
    var g = document.getElementById("qsGuide"); if (!g || seen) return; seen = true;
    if (performance.now() > 9000) return; /* opened by the visitor (How to use this website): show at once */
    g.style.display = "none";
    setTimeout(function () { if (!document.body.contains(g)) return; g.style.display = ""; setTimeout(function () { if (document.body.contains(g) && !g.matches(":hover")) g.remove(); }, 15000); }, 20000);
  }).observe(document.body, { childList: true });
})();

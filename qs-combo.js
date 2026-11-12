/* All-in-One + AI Film combo (till 30 Nov 2026): when someone taps "Enroll" for the All-in-One course, offer the AI Film,
   Ads & Video Editing course with an extra 20% off (₹6,999 → ₹5,599 · $84 → $67). Yes = one combo payment, No = All-in-One only. */
(function () {
  var END = Date.parse("2026-11-30T23:59:59+05:30");
  if (Date.now() > END) return;
  var AIO = { "https://rzp.io/rzp/2VNS8ZX": "in", "https://rzp.io/rzp/90s9UY3M": "intl" };
  var COMBO = { in: "https://rzp.io/rzp/VJqLBHuT", intl: "https://rzp.io/rzp/BEkkEyu" };
  var lang = (document.documentElement.lang || "en").slice(0, 2);
  try { if (typeof curLang === "function" && /^(ur|hi|ar)/.test(curLang())) lang = curLang().slice(0, 2); } catch (e) {}
  var T = {
    en: { h: "Add the AI Film course too?", p: "Learn AI films, AI ads and AI video editing live with founder Arsalan Ahmed Shaikh. With All-in-One you get an extra 20% off on top of the 40% off.", was: "AI Film course", yes: "Yes, add it · total", no: "No, only All-in-One", save: "You save", note: "Offer only till 30 November" },
    ur: { h: "کیا اے آئی فلم کورس بھی لیں گے؟", p: "خود فاؤنڈر ارسلان احمد شیخ سے اے آئی فلم، اے آئی ایڈز اور اے آئی ویڈیو ایڈیٹنگ لائیو سیکھیں۔ آل اِن وَن کے ساتھ 40% کے اوپر مزید 20% رعایت۔", was: "اے آئی فلم کورس", yes: "ہاں، شامل کریں · کل", no: "نہیں، صرف آل اِن وَن", save: "آپ کی بچت", note: "آفر صرف 30 نومبر تک" },
    hi: { h: "क्या AI फ़िल्म कोर्स भी लेंगे?", p: "ख़ुद फ़ाउंडर अरसलान अहमद शेख़ से AI फ़िल्म, AI ऐड्स और AI वीडियो एडिटिंग लाइव सीखें। ऑल-इन-वन के साथ 40% के ऊपर और 20% छूट।", was: "AI फ़िल्म कोर्स", yes: "हाँ, जोड़ें · कुल", no: "नहीं, सिर्फ़ ऑल-इन-वन", save: "आपकी बचत", note: "ऑफ़र सिर्फ़ 30 नवंबर तक" },
    ar: { h: "هل تضيف دورة أفلام الذكاء الاصطناعي؟", p: "تعلّم الأفلام والإعلانات والمونتاج بالذكاء الاصطناعي مباشرة مع المؤسس أرسلان أحمد شيخ. مع الدورة الشاملة خصم إضافي 20% فوق خصم 40%.", was: "دورة الأفلام", yes: "نعم، أضفها · المجموع", no: "لا، الدورة الشاملة فقط", save: "توفيرك", note: "العرض حتى 30 نوفمبر فقط" }
  }[lang] || null;
  if (!T) return;
  var P = { in: { aio: "₹13,999", film: "₹6,999", filmC: "₹5,599", tot: "₹19,598", save: "₹1,400" }, intl: { aio: "$175", film: "$84", filmC: "$67", tot: "$242", save: "$17" } };
  var css = document.createElement("style");
  css.textContent = ".qcb{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(6,8,14,.62);backdrop-filter:blur(6px)}" +
    ".qcb>div{max-width:440px;width:100%;border-radius:24px;padding:22px;background:#fffaf2;color:#1d1416;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);animation:qcbIn .35s cubic-bezier(.2,.9,.3,1.2)}@keyframes qcbIn{from{transform:translateY(24px) scale(.96);opacity:0}}" +
    ".qcb h3{margin:0 0 8px;font:700 21px/1.3 Outfit,system-ui,sans-serif}.qcb p{margin:0 0 12px;font-size:14.5px;line-height:1.55;opacity:.85}" +
    ".qcb .pr{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:6px 0 14px;padding:10px 12px;border-radius:14px;background:rgba(201,154,69,.14)}.qcb .pr s{opacity:.55}.qcb .pr b{font-size:20px;color:#7a1424}.qcb .pr em{font-style:normal;font-weight:700;color:#1e8e4f;font-size:13px}" +
    ".qcb a,.qcb button{display:block;width:100%;box-sizing:border-box;text-align:center;padding:14px;border-radius:999px;font:700 15.5px system-ui,sans-serif;text-decoration:none;border:0;cursor:pointer;margin-top:8px}" +
    ".qcb .y{background:linear-gradient(135deg,#7a1424,#a01d34);color:#fff}.qcb .n{background:transparent;color:#7a1424;border:1.5px solid rgba(122,20,36,.35)}.qcb small{display:block;text-align:center;margin-top:10px;font-size:12px;color:#a01d34;font-weight:600}";
  document.head.appendChild(css);
  function ask(kind, href, target) {
    var p0 = P[kind], p = {}; Object.keys(p0).forEach(function (k) { p[k] = "<bdi dir=\"ltr\">" + p0[k] + "</bdi>"; }); var d = document.createElement("div"); d.className = "qcb"; d.setAttribute("role", "dialog"); d.setAttribute("dir", /ur|ar/.test(lang) ? "rtl" : "ltr"); d.setAttribute("translate", lang === "en" ? "yes" : "no");
    d.innerHTML = '<div><h3>🎬 ' + T.h + '</h3><p>' + T.p + '</p><div class="pr"><span>' + T.was + ':</span><s>' + p.film + '</s><b>' + p.filmC + '</b><em>−20%</em></div>' +
      '<a class="y" href="' + COMBO[kind] + '" rel="noopener">' + T.yes + ' ' + p.tot + '</a><a class="n" href="' + href + '" rel="noopener">' + T.no + ' · ' + p.aio + '</a><small>' + T.save + ' ' + p.save + ' · ' + T.note + '</small></div>';
    d.addEventListener("click", function (e) { if (e.target === d) d.remove(); else if (e.target.closest("a")) { if (target) { e.preventDefault(); window.open(e.target.closest("a").href, target); } setTimeout(function () { d.remove(); }, 300); } });
    document.body.appendChild(d);
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || window.QS_DEMO) return; var a = e.target.closest && e.target.closest("a[href]"); if (!a || a.closest(".qcb")) return;
    var href = a.href.replace(/\/$/, ""), kind = AIO[href]; if (!kind) return;
    e.preventDefault(); e.stopPropagation(); ask(kind, a.href, a.target === "_blank" ? "_blank" : "");
  }, true);
})();

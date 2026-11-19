/* Quranic Science · instalments (kist), 19 Nov 2026.
   Adds a "Pay in parts" button next to the Enroll button of the courses that allow it. The amounts and rules come from the server
   (worker /inst/*): the browser never decides what is paid. Part 1 opens the classes; later parts are paid from the banner here. */
(function () {
  var W = "https://quranic-science-automation.quranicscience01.workers.dev";
  var L = { "2VNS8ZX": ["all-in-one-creator-course", "INR"], "90s9UY3M": ["all-in-one-creator-course", "USD"], "5DylqOi": ["tajweed-arabic-combo", "INR"], "zxc9IPtU": ["tajweed-arabic-combo", "USD"],
    "0VZVIVW0": ["video-editing-course", "INR"], "SYpk5BE": ["video-editing-course", "USD"], "riuzsnEH": ["arabic-speaking-class", "INR"], "KcWrPBh": ["arabic-speaking-class", "USD"], "QeLOdNC": ["tajweed-class", "INR"], "aa85jnG5": ["tajweed-class", "USD"] };
  var N = { "all-in-one-creator-course": "All-in-One Creator Course", "tajweed-arabic-combo": "Tajweed + Arabic Combo", "video-editing-course": "Video Editing Course", "arabic-speaking-class": "Arabic Speaking Class", "tajweed-class": "Tajweed Class" };
  var KH = (location.search.match(/[?&]kist=([^&]+)/) || [])[1] || "";
  var lang = (document.documentElement.lang || "en").slice(0, 2); try { if (typeof curLang === "function" && /^(ur|hi|ar)/.test(curLang())) lang = curLang().slice(0, 2); } catch (e) {}
  if (!/^(en|ur|hi|ar)$/.test(lang)) lang = "en";
  var T = {
    en: { btn: "📆 Pay in instalments (kist)", sub: "Same fee · no extra charge", h: "Pay in instalments", total: "Total fee (unchanged)", part: "Part", now: "Pay today", by: "within {n} days", rules: ["The total is exactly the normal fee. Nothing extra is charged.", "Part 1 opens your classes at once.", "Pay each part by its date. If a part is 3 days late, new classes pause until you pay it, then everything opens again.", "The certificate and any extra material are given after the last part.", "Paid parts follow our refund policy; a part you have not paid is never charged."], pay: "Pay part 1 securely", login: "Please log in first (Google) – we will bring you back here.", wait: "Confirming your payment…", ok: "Part paid ✓ Your classes are open. Next part reminders will come on the app and WhatsApp.", late: "Payment is received by the bank; it can take a minute to show. Check My classes.", err: "Could not start. Please try again.", na: "Instalments are not available for this course.", close: "Close", due: "Instalment due", paynow: "Pay now", locked: "Classes paused – pay this part to open again", of: "of" },
    ur: { btn: "📆 قسطوں میں ادا کریں (کِشت)", sub: "فیس وہی · کوئی اضافی چارج نہیں", h: "قسطوں میں فیس", total: "کل فیس (بدلی نہیں)", part: "قسط", now: "آج ادا کریں", by: "{n} دن کے اندر", rules: ["کل رقم بالکل عام فیس کے برابر ہے۔ کوئی اضافی چارج نہیں۔", "پہلی قسط دیتے ہی آپ کی کلاسیں کھل جاتی ہیں۔", "ہر قسط اپنی تاریخ تک دیں۔ 3 دن دیر ہو جائے تو نئی کلاسیں رُک جاتی ہیں، قسط دیتے ہی سب دوبارہ کھل جاتا ہے۔", "سرٹیفکیٹ اور اضافی مواد آخری قسط کے بعد ملتا ہے۔", "ادا شدہ قسطوں پر ہماری ریفنڈ پالیسی لاگو ہے؛ جو قسط آپ نے نہیں دی وہ کبھی نہیں کٹتی۔"], pay: "پہلی قسط محفوظ طریقے سے ادا کریں", login: "پہلے لاگ اِن کریں (گوگل) – ہم آپ کو یہیں واپس لائیں گے۔", wait: "ادائیگی کی تصدیق ہو رہی ہے…", ok: "قسط ادا ✓ آپ کی کلاسیں کھل گئیں۔ اگلی قسط کی یاد دہانی ایپ اور واٹس ایپ پر آئے گی۔", late: "ادائیگی موصول ہو گئی ہے، دکھنے میں ایک منٹ لگ سکتا ہے۔ میری کلاسیں دیکھیں۔", err: "شروع نہ ہو سکا۔ دوبارہ کوشش کریں۔", na: "اس کورس میں قسطیں دستیاب نہیں۔", close: "بند کریں", due: "قسط کی تاریخ", paynow: "ابھی ادا کریں", locked: "کلاسیں رُکی ہیں – یہ قسط دیتے ہی کھل جائیں گی", of: "از" },
    hi: { btn: "📆 किस्तों में भरें", sub: "फीस वही · कोई एक्स्ट्रा चार्ज नहीं", h: "किस्तों में फीस", total: "कुल फीस (बदली नहीं)", part: "किस्त", now: "आज भरें", by: "{n} दिन के अंदर", rules: ["कुल रकम बिल्कुल सामान्य फीस के बराबर है। कोई एक्स्ट्रा चार्ज नहीं।", "पहली किस्त देते ही आपकी क्लासें खुल जाती हैं।", "हर किस्त उसकी तारीख तक दें। 3 दिन देर हो तो नई क्लासें रुक जाती हैं; किस्त देते ही सब फिर खुल जाता है।", "सर्टिफिकेट और एक्स्ट्रा सामग्री आख़िरी किस्त के बाद मिलती है।", "भरी हुई किस्तों पर हमारी रिफंड पॉलिसी लागू है; जो किस्त आपने नहीं दी वह कभी नहीं कटती।"], pay: "पहली किस्त सुरक्षित तरीके से भरें", login: "पहले लॉग इन करें (Google) – हम आपको यहीं वापस लाएँगे।", wait: "पेमेंट की पुष्टि हो रही है…", ok: "किस्त जमा ✓ आपकी क्लासें खुल गईं। अगली किस्त की याद ऐप और WhatsApp पर आएगी।", late: "पेमेंट मिल गया है; दिखने में एक मिनट लग सकता है। मेरी क्लासें देखें।", err: "शुरू नहीं हो सका। फिर कोशिश करें।", na: "इस कोर्स में किस्तें उपलब्ध नहीं हैं।", close: "बंद करें", due: "किस्त की तारीख", paynow: "अभी भरें", locked: "क्लासें रुकी हैं – यह किस्त भरते ही खुल जाएँगी", of: "में से" },
    ar: { btn: "📆 الدفع على أقساط", sub: "نفس الرسوم · بلا أي زيادة", h: "الدفع على أقساط", total: "إجمالي الرسوم (دون تغيير)", part: "القسط", now: "ادفع اليوم", by: "خلال {n} يومًا", rules: ["المجموع يساوي الرسوم المعتادة تمامًا، بلا أي زيادة.", "القسط الأول يفتح حصصك فورًا.", "ادفع كل قسط في موعده. إذا تأخر 3 أيام تتوقف الحصص الجديدة حتى تدفعه ثم يُفتح كل شيء.", "الشهادة والمواد الإضافية بعد القسط الأخير.", "الأقساط المدفوعة تخضع لسياسة الاسترداد؛ والقسط الذي لم تدفعه لا يُخصم أبدًا."], pay: "ادفع القسط الأول بأمان", login: "سجّل الدخول أولًا (Google) – سنعيدك إلى هنا.", wait: "جارٍ تأكيد الدفع…", ok: "تم دفع القسط ✓ حصصك مفتوحة. سيصلك تذكير القسط التالي.", late: "وصل الدفع وقد يستغرق ظهوره دقيقة. افتح حصصي.", err: "تعذّر البدء. حاول مرة أخرى.", na: "الأقساط غير متاحة لهذه الدورة.", close: "إغلاق", due: "موعد القسط", paynow: "ادفع الآن", locked: "الحصص متوقفة – ادفع هذا القسط لتُفتح", of: "من" } }[lang];
  var sym = function (c) { return c === "USD" ? "$" : "₹"; }, fmt = function (c, n) { return sym(c) + Number(n).toLocaleString("en-IN"); };
  var inApp = function () { return typeof AUTH !== "undefined" && AUTH && typeof requireLogin === "function"; };
  var user = function () { try { return AUTH.fb && AUTH.fb.auth && AUTH.fb.auth.currentUser; } catch (e) { return null; } };
  var tok = async function () { var u = user(); return u ? u.getIdToken() : ""; };
  var api = async function (path, body) { var t = await tok(); var r = await fetch(W + path, { method: body ? "POST" : "GET", headers: Object.assign({ authorization: "Bearer " + t }, body ? { "content-type": "application/json" } : {}), body: body ? JSON.stringify(body) : undefined }); return r.json(); };
  var css = document.createElement("style"); css.textContent = ".qsk-btn{display:flex;flex-direction:column;align-items:center;gap:2px;margin:10px 0 0;padding:12px 16px;border-radius:16px;border:1.5px solid rgba(227,170,60,.7);background:rgba(227,170,60,.1);color:inherit;font:700 15px/1.25 system-ui,sans-serif;text-decoration:none;cursor:pointer;width:100%;box-sizing:border-box}.qsk-btn small{font-weight:500;opacity:.8;font-size:12px}.qsk-ov{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.66);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}.qsk-card{max-width:440px;width:100%;max-height:92vh;overflow:auto;background:#fff;color:#1b1b1b;border-radius:20px;padding:20px 18px;font:15px/1.5 system-ui,sans-serif;box-sizing:border-box}.qsk-card h3{margin:0 0 4px;font-size:21px}.qsk-card table{width:100%;border-collapse:collapse;margin:10px 0}.qsk-card td{padding:8px 4px;border-bottom:1px solid #e8e2d4}.qsk-card td:last-child{text-align:end;font-weight:700}.qsk-card ul{padding-inline-start:20px;margin:8px 0;font-size:14px}.qsk-go{display:block;width:100%;margin-top:12px;padding:14px;border:0;border-radius:14px;background:linear-gradient(135deg,#a01d34,#7a1424);color:#fff;font:700 16px system-ui,sans-serif;cursor:pointer}.qsk-go[disabled]{opacity:.6}.qsk-x{display:block;margin:10px auto 0;background:none;border:0;color:#555;cursor:pointer;font-size:14px}.qsk-msg{margin-top:10px;font-weight:600}.qsk-bar{position:fixed;left:12px;right:12px;bottom:78px;z-index:9998;max-width:520px;margin:0 auto;display:flex;align-items:center;gap:10px;background:#fff7e0;color:#2a2200;border:1.5px solid #e3aa3c;border-radius:16px;padding:10px 12px;font:600 14px/1.35 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35)}.qsk-bar button{margin-inline-start:auto;border:0;border-radius:12px;padding:10px 14px;background:#a01d34;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer;white-space:nowrap}";
  document.head.appendChild(css);
  var rzp = function () { return window.Razorpay ? Promise.resolve() : new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function overlay(html) { var o = document.createElement("div"); o.className = "qsk-ov"; o.dir = lang === "ur" || lang === "ar" ? "rtl" : "ltr"; o.innerHTML = '<div class="qsk-card">' + html + "</div>"; document.body.appendChild(o); o.addEventListener("click", function (e) { if (e.target === o) o.remove(); }); return o; }
  async function waitPaid(course, idx, msg) {
    msg.textContent = T.wait;
    for (var i = 0; i < 10; i++) { await new Promise(function (r) { setTimeout(r, 2500); }); try { var m = await api("/inst/mine"); var p = (m.plans || []).find(function (x) { return x.course === course; }); if (p && p.parts[idx] && p.parts[idx].paid) { msg.textContent = T.ok; return true; } } catch (e) {} }
    msg.textContent = T.late; return false;
  }
  async function checkout(co, plan, msg, after) {
    await rzp();
    var rz = new Razorpay({ key: co.key, amount: co.amount, currency: co.currency, name: co.name, description: co.description, notes: co.notes, prefill: co.prefill, theme: { color: "#a01d34" },
      handler: async function () { var ok = await waitPaid(plan.course, co.idx, msg); if (after) after(ok); } });
    rz.open();
  }
  window.qsKist = async function (course, cur) {
    if (!inApp()) { location.href = "/?kist=" + encodeURIComponent(course + ":" + cur); return; }
    var q = await fetch(W + "/inst/quote?course=" + encodeURIComponent(course) + "&cur=" + cur).then(function (r) { return r.json(); }).catch(function () { return {}; });
    if (!q.ok) { var o0 = overlay("<h3>" + esc(T.h) + "</h3><p>" + esc(T.na) + '</p><button class="qsk-x">' + esc(T.close) + "</button>"); o0.querySelector(".qsk-x").onclick = function () { o0.remove(); }; return; }
    var p = q.plan, rows = p.parts.map(function (x) { return "<tr><td>" + esc(T.part) + " " + (x.idx + 1) + "</td><td>" + (x.idx === 0 ? esc(T.now) : esc(T.by.replace("{n}", x.offset))) + "</td><td>" + fmt(p.cur, x.amt) + "</td></tr>"; }).join("");
    var o = overlay("<h3>" + esc(T.h) + "</h3><div>" + esc(N[course] || course) + "</div><table>" + rows + "<tr><td colspan='2'><b>" + esc(T.total) + "</b></td><td>" + fmt(p.cur, p.total) + "</td></tr></table><ul>" + T.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul><button class="qsk-go">' + esc(T.pay) + " · " + fmt(p.cur, p.parts[0].amt) + '</button><div class="qsk-msg"></div><button class="qsk-x">' + esc(T.close) + "</button>");
    var go = o.querySelector(".qsk-go"), msg = o.querySelector(".qsk-msg"); o.querySelector(".qsk-x").onclick = function () { o.remove(); };
    go.onclick = function () {
      var run = async function () { go.disabled = true; msg.textContent = ""; try { var r = await api("/inst/start", { course: course, cur: cur }); if (!r.ok || !r.checkout) { msg.textContent = r.error || T.err; go.disabled = false; return; } await checkout(r.checkout, r.plan, msg, function () { bar(); }); } catch (e) { msg.textContent = T.err; } go.disabled = false; };
      if (!user()) { msg.textContent = T.login; try { requireLogin(run); } catch (e) {} return; }
      run();
    };
  };
  /* "Pay now" banner for the next unpaid part (only for the logged-in student who has an open plan) */
  async function bar() {
    var old = document.querySelector(".qsk-bar"); if (old) old.remove();
    if (!user()) return;
    var m; try { m = await api("/inst/mine"); } catch (e) { return; }
    var plan = (m.plans || []).find(function (x) { return x.status === "active" || x.status === "locked"; }); if (!plan || plan.next < 0) return;
    var p = plan.parts[plan.next], d = new Date(p.dueAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    var b = document.createElement("div"); b.className = "qsk-bar"; b.dir = lang === "ur" || lang === "ar" ? "rtl" : "ltr";
    b.innerHTML = "<span>" + (plan.status === "locked" ? "🔒 " + esc(T.locked) : "📆 " + esc(T.due) + ": " + esc(d)) + "<br>" + esc(N[plan.course] || plan.course) + " · " + esc(T.part) + " " + (plan.next + 1) + " " + esc(T.of) + " " + plan.parts.length + " · " + fmt(plan.cur, p.amt) + '</span><button type="button">' + esc(T.paynow) + "</button>";
    document.body.appendChild(b);
    b.querySelector("button").onclick = async function () { var r = await api("/inst/next?course=" + encodeURIComponent(plan.course)); if (r.checkout) checkout(r.checkout, r.plan, b.firstChild, function () { bar(); }); };
  }
  function inject() {
    document.querySelectorAll('a[href*="rzp.io/rzp/"]').forEach(function (a) {
      if (a.dataset.qsk || !(/(^|\s)(btn|enr2)(\s|$)/.test(a.className) || a.hasAttribute("data-enr"))) return; var id = (a.getAttribute("href").match(/rzp\.io\/rzp\/([A-Za-z0-9]+)/) || [])[1], m = L[id]; if (!m) return; a.dataset.qsk = "1";
      var b = document.createElement("button"); b.type = "button"; b.className = "qsk-btn"; b.innerHTML = esc(T.btn) + "<small>" + esc(T.sub) + "</small>";
      b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); window.qsKist(m[0], m[1]); };
      a.insertAdjacentElement("afterend", b);
    });
  }
  var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(inject, 150); }).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", function () { inject();
    var h = KH ? decodeURIComponent(KH) : "";
    if (h && inApp()) { var t = 0, iv = setInterval(function () { t++; if (AUTH.ready || t > 20) { clearInterval(iv); var p = h.split(":"); try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {} window.qsKist(p[0], p[1] || "INR"); } }, 500); }
    if (inApp()) { var n = 0, iv2 = setInterval(function () { n++; if (user()) { clearInterval(iv2); bar(); } else if (n > 30) clearInterval(iv2); }, 1000); } });
})();

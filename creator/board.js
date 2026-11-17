/* Teacher's board: for lesson moments that are talk (no software screen), the board is written live, point by point,
   exactly as the voice reaches each word - like a teacher writing on a whiteboard while explaining.
   v = { ui: "board", txt: {en,ur,hi} }.  livesync.js calls QSBoard.tick(audio.currentTime, wordStarts, duration) every frame. */
(function () {
  "use strict";
  var ICONS = [
    [/homework/i, "📝"], [/\bhook\b/i, "🎣"], [/\btest\b|questions?\b|quiz/i, "✅"], [/project/i, "🏁"], [/reel|shorts?\b/i, "🎬"], [/caption|subtitle/i, "💬"], [/sound|music|audio|voice|nasheed/i, "🔊"],
    [/instagram|insta\b/i, "📸"], [/youtube|thumbnail/i, "▶️"], [/money|pay|price|earn|client|rate|budget|income/i, "💰"], [/colou?r|look|grade/i, "🎨"], [/zoom|camera|shoot|light|frame/i, "🎥"],
    [/idea|niche|audience|topic|plan/i, "💡"], [/script|write|story|brief/i, "✍️"], [/post|share|upload|publish|deliver/i, "🚀"], [/profile|name|bio|photo/i, "👤"], [/day|lesson|today|week/i, "📅"], [/cut|trim|clip|edit/i, "✂️"],
    [/never|don.?t|do not|avoid/i, "⛔"], [/first|start|begin|welcome/i, "👋"], [/1\b|one\b|two\b|three\b|four\b|five\b|\d/i, "🔢"]
  ];
  function icon(s) { for (var i = 0; i < ICONS.length; i++) if (ICONS[i][0].test(s)) return ICONS[i][1]; return "▸"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function split(text) { /* sentences, long ones are cut at commas/colons so every written line stays short */
    var raw = String(text || "").replace(/\s+/g, " ").trim().match(/[^.!?؟।]+[.!?؟।]*["”)]*\s*/g) || [text], out = [];
    raw.forEach(function (s) {
      s = s.trim(); if (!s) return;
      if (s.length <= 96) { out.push(s); return; }
      var parts = s.split(/(?<=[,;:])\s+/), cur = "";
      parts.forEach(function (p) { if ((cur + " " + p).trim().length > 90 && cur) { out.push(cur.trim()); cur = p; } else cur = (cur + " " + p).trim(); });
      if (cur) out.push(cur.trim());
    });
    return out;
  }
  var cur = null;
  function html(v) {
    var T = typeof pick === "function" ? pick(v.txt || {}) : ((v.txt || {}).en || ""), rows = split(T), wi = 0, body = "";
    rows.forEach(function (r, k) {
      var ws = r.match(/\S+/g) || [], first = wi;
      body += '<div class="bp" data-w="' + first + '"><span class="bi">' + icon(r) + '</span><span class="bt">' + ws.map(function (w, j) { return '<span class="bw" data-i="' + (first + j) + '">' + esc(w) + "</span>"; }).join(" ") + "</span></div>";
      wi += ws.length;
    });
    return '<figure class="viz uboard" data-n="' + wi + '"><div class="ubh"><span class="ubd"></span><b>' + (typeof pick === "function" ? pick({ en: "AI Teacher · board", ur: "اے آئی ٹیچر · بورڈ", hi: "ए आई टीचर · बोर्ड" }) : "AI Teacher · board") + '</b></div><div class="ubb">' + body + '</div><div class="ubp"><i></i></div></figure>';
  }
  function tick(t, wt, d) {
    [].forEach.call(document.querySelectorAll(".uboard"), function (b) {
      var n = +b.getAttribute("data-n"); if (!n) return;
      var M = wt && wt.length ? wt.length : 0;
      var ws = b.__ws; if (!ws) { ws = b.__ws = [].slice.call(b.querySelectorAll(".bw")); b.__ps = [].slice.call(b.querySelectorAll(".bp")); }
      var start = function (i) { return M ? (wt[M === n ? i : Math.min(M - 1, Math.floor(i / n * M))] / 1000 * d) : (i / n) * (d - .4); };
      var cw = -1; for (var i = 0; i < n; i++) { if (start(i) <= t + .02) cw = i; else break; }
      b.__ws.forEach(function (w, i) { var c = i < cw ? "past" : i === cw ? "now" : "next"; if (w.__c !== c) { w.className = "bw " + c; w.__c = c; } });
      var cp = -1; b.__ps.forEach(function (p, k) { var f = +p.getAttribute("data-w"); if (f <= cw) cp = k; });
      /* show the last 5 lines, the line being spoken highlighted; lines not yet spoken stay hidden (written as the voice reaches them) */
      b.__ps.forEach(function (p, k) { var c = k > cp ? "hid" : k === cp ? "cur" : k >= cp - 4 ? "old" : "gone"; if (p.__c !== c) { p.className = "bp " + c; p.__c = c; } });
      var bar = b.querySelector(".ubp i"); if (bar) bar.style.width = Math.min(100, Math.max(0, t / d * 100)).toFixed(1) + "%";
    });
  }
  function reset() { [].forEach.call(document.querySelectorAll(".uboard"), function (b) { [].forEach.call(b.querySelectorAll(".bw"), function (w) { w.className = "bw"; w.__c = null; }); [].forEach.call(b.querySelectorAll(".bp"), function (p) { p.className = "bp"; p.__c = null; }); var bar = b.querySelector(".ubp i"); if (bar) bar.style.width = "0"; }); }
  window.QSBoard = { html: html, tick: tick, reset: reset, split: split };
  var css = document.createElement("style"); css.textContent = [
    ".uboard{margin:12px 0;border-radius:18px;overflow:hidden;background:radial-gradient(120% 90% at 20% 0%,#16294a,#0b1424 70%);border:1px solid rgba(255,255,255,.1);box-shadow:0 10px 30px rgba(0,0,0,.35);color:#eef3ff;font-family:Outfit,inherit}",
    ".ubh{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:12px;letter-spacing:.04em;background:rgba(255,255,255,.05);color:#cfe3ff}.ubd{width:9px;height:9px;border-radius:50%;background:#31e8e0;box-shadow:0 0 10px #31e8e0}",
    ".ubb{padding:14px 16px 10px;min-height:190px;display:flex;flex-direction:column;gap:9px;justify-content:flex-start}",
    ".bp{display:flex;gap:10px;align-items:flex-start;font-size:clamp(16px,2.6vw,21px);line-height:1.45;transition:opacity .4s,transform .4s,max-height .4s;max-height:140px}",
    ".bp .bi{flex:0 0 auto;width:30px;text-align:center;font-size:20px;filter:saturate(1.2)}",
    ".bp.hid{opacity:0;transform:translateY(10px);max-height:0;overflow:hidden;margin:0}.bp.gone{opacity:0;max-height:0;overflow:hidden}.bp.old{opacity:.5}.bp.cur{opacity:1}",
    ".bw{transition:color .15s,text-shadow .2s;color:#9fb3d6}.bw.past{color:#eef3ff}.bw.now{color:#0b1424;background:linear-gradient(90deg,#ffc43c,#ffe08a);border-radius:5px;padding:0 4px;margin:0 -4px;box-shadow:0 0 14px rgba(255,196,60,.55)}.bw.next{color:#7f93b8}",
    ".bp.old .bw{color:#aebde0}.bp.old .bw.now{background:none;color:#aebde0;box-shadow:none}",
    ".ubp{height:4px;background:rgba(255,255,255,.08)}.ubp i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffc43c,#31e8e0)}",
    "[dir=rtl] .bp{direction:rtl}"].join("\n");
  document.head.appendChild(css);
})();

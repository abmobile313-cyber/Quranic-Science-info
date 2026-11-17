/* Scene: the real CapCut screenshot comes ALIVE while the teacher talks.
   We read the narration, find the editing words in it (cut, delete, jump cut, text, filter, zoom, export …) and, at the moment each word is spoken,
   the cursor clicks the real button AND the editing really happens on the screen: the clip splits at the playhead, the piece is selected and deleted,
   the picture jerks on a jump cut, text types in, a filter wipes across, the picture zooms, the export bar fills.
   Everything is a pure function of the voice's current time, so pause / replay / seek always show the right picture. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg", BASE = "cc/", IV = "?v=1";
  var L = function (en, ur, hi) { return { en: en, ur: ur, hi: hi }; };
  var LAB = {
    import: L("Import", "امپورٹ", "इम्पोर्ट"), select: L("Select the clip", "کلپ منتخب کریں", "क्लिप चुनें"), split: L("Split", "اسپلٹ (کٹ)", "स्प्लिट (कट)"), delete: L("Delete", "ڈیلیٹ", "डिलीट"), trim: L("Trim the end", "سرا چھوٹا کریں", "सिरा छोटा करें"),
    jumpcut: L("Jump cut", "جمپ کٹ", "जंप कट"), speed: L("Speed", "سپیڈ", "स्पीड"), text: L("Add text", "ٹیکسٹ شامل کریں", "टेक्स्ट जोड़ें"), caption: L("Captions", "کیپشنز", "कैप्शन"), filter: L("Filter", "فلٹر", "फ़िल्टर"),
    zoom: L("Zoom in", "زوم اِن", "ज़ूम इन"), fade: L("Transition", "ٹرانزیشن", "ट्रांज़िशन"), effect: L("Effect", "ایفیکٹ", "इफ़ेक्ट"), audio: L("Audio", "آڈیو", "ऑडियो"), export: L("Export", "ایکسپورٹ", "एक्सपोर्ट"), play: L("Play", "پلے", "प्ले"), undo: L("Undo", "انڈو", "अनडू"), volume: L("Volume", "والیوم", "वॉल्यूम")
  };
  var DUR = { import: 1.6, select: .5, split: 1.3, delete: 1.3, trim: 1.6, jumpcut: 4.2, speed: 1.6, text: 2.8, caption: 3.2, filter: 1.8, zoom: 2.2, fade: 1.6, effect: 1.5, export: 5, play: .8, undo: .8, volume: .8, audio: 3.2 };

  /* ---------- words in the narration → editing actions ---------- */
  var RULES = [
    ["jumpcut", /jump[- ]?cuts?/ig], ["import", /\b(import(?:ing)?|upload(?:ing)?|bring(?:ing)? in|add(?:ing)? (?:your |the |a |our )?(?:video|clip|footage|media|photo)s?)\b/ig],
    ["select", /\b(?:select(?:ing)?|tap(?:ping)? on|click(?:ing)? on|choose|pick)\b[^.,;]{0,22}\b(?:clip|video|layer|track|part|piece)\b/ig], ["split", /\b(split(?:ting)?|cut(?:ting|s)?|slic(?:e|ing)|chop(?:ping)?)\b/ig],
    ["delete", /\b(delet(?:e|ing)|remov(?:e|ing)|eras(?:e|ing)|get(?:ting)? rid of|trash)\b/ig], ["trim", /\b(trim(?:ming)?|shorten(?:ing)?)\b/ig], ["speed", /\b(speed(?:ing)?(?: up)?|slow(?:ing)?[- ]?(?:down|motion|mo)|faster|slower)\b/ig],
    ["caption", /\b(captions?|subtitles?)\b/ig], ["text", /\b(text|titles?|fonts?)\b/ig], ["filter", /\b(filters?|colou?r grad(?:e|ing)|colou?r correction)\b/ig], ["zoom", /\b(zoom(?:ing)?|scale|enlarge|punch[- ]in)\b/ig],
    ["fade", /\b(transitions?|fade|dissolve)\b/ig], ["effect", /(?<!sound )(?<!audio )\b(effects?|glitch|shake|shaky|blur)\b(?! sounds?)/ig], ["export", /\b(export(?:ing)?|render(?:ing)?|save the video|publish)\b/ig], ["undo", /\bundo\b/ig], ["audio", /\b(?:go to|open|tap|click|select|add|choose|pick|use|search|find|drag|import)\s+(?:on\s+)?(?:the\s+|your\s+|some\s+|a\s+)?(?:audio|music|sound ?effects?|sounds?|sfx|song)\b/ig], ["volume", /\b(volume|louder|quieter|mute)\b/ig]
  ];
  function extract(text, steps) {
    var out = [], src = text || "";
    function scan(s, mapPos) {
      RULES.forEach(function (r) { r[1].lastIndex = 0; var m; while ((m = r[1].exec(s))) { if (/\b(not|never|don'?t|avoid|without|stop|no|mistake)\s+(\w+\s+)?(\w+\s+)?$/i.test(s.slice(Math.max(0, m.index - 28), m.index))) continue; out.push({ k: r[0], pos: mapPos(m.index), idx: m.index }); } });
    }
    scan(src, function (i) { return i / Math.max(1, src.length); });
    if (!out.length && steps && steps.length) { /* the narration says nothing editable: use the step list, each step gets its share of time */
      var tot = steps.reduce(function (a, s) { return a + s.length + 14; }, 0), acc = 0;
      steps.forEach(function (s) { var st = acc / tot; acc += s.length + 14; RULES.forEach(function (r) { r[1].lastIndex = 0; var m = r[1].exec(s); if (m) out.push({ k: r[0], pos: st + .5 * (s.length + 14) / tot * .6, idx: 0, st: 1 }); }); });
    }
    out.sort(function (a, b) { return a.pos - b.pos; });
    var res = [];
    out.forEach(function (e) {
      var last = res[res.length - 1];
      if (last && last.k === "jumpcut" && (e.k === "split" || e.k === "delete") && e.pos - last.pos < .06) return; /* "jump cut" already covers its own cut */
      if (last && last.k === e.k && e.pos - last.pos < .1) return;
      if (res.some(function (x) { return x.k === e.k && Math.abs(x.pos - e.pos) < .05; })) return;
      res.push(e);
    });
    return res.slice(0, 9);
  }

  /* ---------- device layouts (pixel coordinates of the real screenshots) ---------- */
  var CFG = {
    pc: {
      W: 1919, H: 1079, base: "edit", img: { edit: "pc-edit", import: "pc-import", dialog: "pc-export", text: "pc-text", trans: "pc-trans", audio: "pc-audio" },
      strip: { x: 270, y: 906, w: 542, h: 108 }, mask: [266, 905, 552, 113], maskCol: "rgb(47,47,47)", PH: 450, gap: 9, jL: 150, player: [690, 192, 640, 358], fs: 46,
      btn: { split: [220, 745, 34, 34], delete: [382, 745, 34, 34], text: [164, 58, 64, 56], caption: [474, 58, 70, 56], filter: [552, 58, 64, 56], effect: [312, 58, 64, 56], fade: [382, 58, 86, 56], export: [1640, 8, 106, 46], speed: [1446, 64, 74, 42], play: [992, 678, 34, 36], undo: [112, 745, 34, 34], volume: [92, 58, 62, 56], audio: [92, 58, 62, 56] },
      aclip: [450, 1022, 250, 26], aSearch: [212, 134, 376, 36], aSong: [610, 388, 40, 40], aDrop: [520, 1035],
      importBtn: [380, 288, 150, 52], dlgExport: [1246, 898, 112, 44], dlgBar: [430, 884, 1060, 72], dlgCol: "rgb(38,38,38)", filterThumb: [365, 225, 130, 130], knob: [1428, 294, 22, 28], knobEnd: 1580,
      tl: [200, 730, 820, 330], plr: [660, 150, 700, 440], textClip: [300, 862, 210, 34], capClip: [300, 862, 150, 34], badge: [282, 912]
    },
    mob: {
      W: 320, H: 698, base: "edit", img: { edit: "m-edit", clip: "m-clip", tools2: "m-tools2", filters: "m-filters", export: "m-export", home: "m-home", sound: "m-sound", audio: "m-audio" },
      strip: { x: 0, y: 449, w: 320, h: 42 }, mask: [0, 445, 320, 50], maskCol: "rgb(10,10,10)", PH: 161, gap: 5, jL: 56, player: [0, 125, 320, 180], fs: 17,
      btn: { split: [42, 606, 48, 58], delete: [236, 606, 48, 58], text: [99, 606, 46, 58], caption: [242, 606, 46, 58], filter: [195, 606, 44, 58], effect: [194, 606, 46, 58], fade: [147, 606, 46, 58], export: [266, 40, 40, 40], speed: [90, 606, 48, 58], play: [142, 350, 36, 36], undo: [284, 355, 24, 24], volume: [143, 606, 48, 58], audio: [51, 606, 46, 58] },
      aclip: [161, 497, 130, 16], aSearch: [15, 82, 298, 30], aSong: [14, 452, 300, 56], aDrop: [200, 505],
      importBtn: [13, 160, 295, 96], dlgExport: null, dlgBar: [10, 342, 300, 40], dlgCol: "rgb(14,14,14)", filterThumb: [128, 516, 56, 76], knob: null, knobEnd: 0,
      tl: [0, 380, 320, 170], plr: [0, 110, 320, 210], textClip: [20, 424, 110, 18], capClip: [20, 424, 80, 18], badge: [8, 452]
    }
  };
  var cx = function (r) { return [r[0] + r[2] / 2, r[1] + r[3] / 2]; };
  var ease = function (p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
  var cl = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- what each action does to the picture (pure, from progress p 0..1) ---------- */
  function splitAt(S, x, g) {
    for (var i = 0; i < S.pieces.length; i++) {
      var P = S.pieces[i]; if (!(x > P.x + 4 && x < P.x + P.w - 4)) continue;
      var fL = (x - 3 - P.x) / P.w, fR = (x + 3 - P.x) / P.w;
      var A = { s0: P.s0, sw: P.sw * fL, x: P.x, w: P.w * fL, op: 1, sel: false }, B = { s0: P.s0 + P.sw * fR, sw: P.sw * (1 - fR), x: x + 3 + g, w: P.w * (1 - fR), op: 1, sel: false };
      for (var j = i + 1; j < S.pieces.length; j++) S.pieces[j].x += g;
      S.pieces.splice(i, 1, A, B); return i;
    }
    return -1;
  }
  var HND = {
    import: function (S, e, p, C) {
      S.touched = true; var q = ease(p), st = C.strip;
      if (!S.pieces.length) S.pieces.push({ s0: st.x, sw: st.w, x: st.x + (1 - q) * st.w * .12, w: st.w, op: q, sel: false });
      else { var last = S.pieces[S.pieces.length - 1], x0 = last.x + last.w + 6, w = Math.min(st.w * .3, st.x + st.w - x0); if (w > 20) S.pieces.push({ s0: st.x, sw: w, x: x0, w: w, op: q, sel: false }); }
    },
    select: function (S, e, p) { var i = e.idx < 0 ? S.pieces.length - 1 : Math.min(e.idx, S.pieces.length - 1); S.pieces.forEach(function (P) { P.sel = false; }); if (S.pieces[i]) S.pieces[i].sel = true; },
    split: function (S, e, p, C) { S.touched = true; splitAt(S, C.PH, C.gap * ease(p)); if (p < 1) S.flash = { x: C.PH, a: 1 - p }; },
    delete: function (S, e, p) {
      S.touched = true; var i = -1; S.pieces.forEach(function (P, k) { if (P.sel) i = k; }); if (i < 0) i = S.pieces.length - 1; if (i < 0) return;
      var P = S.pieces[i], q = ease(p), w0 = P.w; P.sel = true; P.w = w0 * (1 - q); P.op = 1 - q;
      for (var j = i + 1; j < S.pieces.length; j++) S.pieces[j].x -= w0 * q;
      if (p >= 1) S.pieces.splice(i, 1);
    },
    trim: function (S, e, p) { S.touched = true; var P = S.pieces[S.pieces.length - 1]; if (!P) return; var d = .32 * ease(p); P.w *= 1 - d; P.sw *= 1 - d; P.sel = true; },
    speed: function (S, e, p) {
      S.touched = true; var q = ease(p), nx = null, prevEnd = null; S.spd = q;
      S.pieces.forEach(function (P) { var gap = prevEnd === null ? 0 : P.x - prevEnd; prevEnd = P.x + P.w; if (nx === null) nx = P.x; else nx += gap; P.x = nx; P.w *= 1 - .4 * q; nx += P.w; });
    },
    jumpcut: function (S, e, p, C) {
      S.touched = true; var P = S.pieces[0], a = C.PH, Ln = C.jL;
      if (!P || !(a > P.x + 8 && a + Ln < P.x + P.w - 8)) { var st = C.strip; P = { s0: st.x, sw: st.w, x: st.x, w: st.w, op: 1, sel: false }; S.pieces = [P]; }
      var g1 = C.gap * ease(p / .3), g2 = C.gap * ease((p - .3) / .2), q3 = ease((p - .5) / .3);
      if (!(a > P.x + 8 && a + Ln < P.x + P.w - 8)) return;
      var f = function (x) { return (x - P.x) / P.w; };
      var A = { s0: P.s0, sw: P.sw * f(a - 3), x: P.x, w: P.w * f(a - 3), op: 1, sel: false };
      var M = { s0: P.s0 + P.sw * f(a + 3), sw: P.sw * (f(a + Ln - 3) - f(a + 3)), x: a + 3 + g1, w: P.w * (f(a + Ln - 3) - f(a + 3)), op: 1 - q3, sel: q3 < 1 && p > .3 };
      var B0 = a + Ln + 3 + g1 + g2, Bt = A.x + A.w + 5, B = { s0: P.s0 + P.sw * f(a + Ln + 3), sw: P.sw * (1 - f(a + Ln + 3)), x: B0 + (Bt - B0) * q3, w: P.w * (1 - f(a + Ln + 3)), op: 1, sel: false };
      M.w *= 1 - q3; S.pieces.splice(0, 1, A, M, B); if (q3 >= 1) S.pieces.splice(1, 1);
      if (p < .3) S.flash = { x: a, a: 1 - p / .3 }; else if (p < .5) S.flash = { x: a + Ln, a: 1 - (p - .3) / .2 };
      if (p > .74) S.jump = 1; if (p > .74 && p < .8) S.white = 1 - (p - .74) / .06; if (p > .74 && p < .96) S.shake = (p - .74) / .22;
    },
    text: function (S, e, p) { S.textClip = ease(p / .25); S.txt = cl((p - .25) / .6, 0, 1); },
    caption: function (S, e, p) { S.capClip = ease(p / .2); S.cap = cl((p - .15) / .8, 0, 1); },
    filter: function (S, e, p) { S.flt = cl((p - .35) / .55, 0, 1); },
    zoom: function (S, e, p) { S.zoom = ease(p); },
    fade: function (S, e, p) { S.fade = Math.sin(Math.PI * p); },
    effect: function (S, e, p) { S.shake = p; },
    export: function (S, e, p) { S.exp = cl((p - .42) / .5, 0, 1); },
    undo: function (S, e, p) {
      S.undo = Math.sin(Math.PI * p); if (p < .5) return; var k = S.lastVis;
      if (k === "text") { S.textClip = 0; S.txt = 0; } else if (k === "caption") { S.capClip = 0; S.cap = 0; } else if (k === "filter") S.flt = 0; else if (k === "speed") S.spd = 0; else if (k === "zoom") S.zoom = 0;
    },
    audio: function (S, e, p) { S.aud = p > .78 ? ease((p - .78) / .22) : 0; },
    volume: function (S, e, p) { S.vol = Math.sin(Math.PI * cl(p, 0, 1)); S.volv = 1 - .6 * ease(p); }
  };
  function replay(C, evs, t) {
    var S = { pieces: [], touched: false, flash: null, spd: 0, jump: 0, white: 0, textClip: 0, txt: 0, capClip: 0, cap: 0, flt: 0, zoom: 0, fade: 0, shake: 0, exp: -1, aud: 0, undo: 0, vol: 0, volv: 1, lastVis: "" }, st = C.strip;
    if (!(evs.length && evs[0].k === "import")) S.pieces.push({ s0: st.x, sw: st.w, x: st.x, w: st.w, op: 1, sel: false });
    evs.forEach(function (e) { var p = (t - e.tc) / e.dur; if (p <= 0) return; p = Math.min(1, p); var h = HND[e.k]; if (h) h(S, e, p, C); if (/^(text|caption|filter|speed|zoom)$/.test(e.k)) S.lastVis = e.k; });
    return S;
  }

  /* ---------- plan: for each action, where the cursor goes, what is shown, where we zoom ---------- */
  function plan(C, plat, evs) {
    var mob = plat === "mob", W = C.W, H = C.H;
    evs.forEach(function (e, i) {
      var S0 = replay(C, evs.slice(0, i), 1e9), tc = e.tc, tr = .9, B = C.btn, ps = S0.pieces, stc = cx([C.strip.x, C.strip.y, C.strip.w, C.strip.h]);
      var lastP = ps[ps.length - 1], selP = null; ps.forEach(function (P) { if (P.sel) selP = P; });
      var pcen = function (P) { return P ? [P.x + P.w / 2, C.strip.y + C.strip.h / 2] : stc; };
      e.cur = []; e.clicks = [tc]; e.frames = []; e.ring = null; e.label = pick(LAB[e.k] || L("", "", "")); e.zoom = null;
      var go = function (pt, t0) { e.cur.push({ t: t0 === undefined ? tc - tr : t0, x: pt[0], y: pt[1] }); };
      var click = function (r, t0, ringPad) { var c = cx(r); e.cur.push({ t: t0 - 0.02, x: c[0], y: c[1] }); e.cur.push({ t: t0, x: c[0], y: c[1] }); e.ring = e.ring || []; e.ring.push({ r: r, t0: t0 - .35, t1: t0 + .6 }); };
      var zr = function (r) { e.zoom = r; };
      switch (e.k) {
        case "import":
          if (mob) { e.frames = [{ t: tc - 1, f: "home" }, { t: tc + .55, f: "edit" }]; click(C.importBtn, tc); zr(null); }
          else { e.frames = [{ t: tc - 1, f: "import" }, { t: tc + .55, f: "edit" }]; click(C.importBtn, tc); zr([14, 118, 654, 612]); }
          break;
        case "select": { var tg = pcen(selP || lastP); if (!ps.length) tg = stc; e.idx = -1; click([tg[0] - 16, tg[1] - 14, 32, 28], tc); e.frames = mob ? [{ t: tc - 1, f: "edit" }, { t: tc + .3, f: "clip" }] : [{ t: tc - 1, f: "edit" }]; zr(C.tl); break; }
        case "split": click(B.split, tc); e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; zr(C.tl); break;
        case "delete": click(B.delete, tc); e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; zr(C.tl); break;
        case "trim": { var P = lastP || { x: C.strip.x, w: C.strip.w }, x1 = P.x + P.w - 2, y1 = C.strip.y + C.strip.h / 2, x2 = P.x + P.w * (1 - .32) - 2; e.cur.push({ t: tc - tr, x: x1, y: y1 }, { t: tc, x: x1, y: y1 }, { t: tc + e.dur * .85, x: x2, y: y1 }); e.clicks = [tc]; e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; zr(C.tl); break; }
        case "jumpcut": {
          var sp = cx(B.split), dl = cx(B.delete), pl = cx(C.player); e.clicks = [tc, tc + e.dur * .3, tc + e.dur * .5];
          e.cur.push({ t: tc - tr, x: sp[0], y: sp[1] }, { t: tc, x: sp[0], y: sp[1] }, { t: tc + e.dur * .3 - .05, x: sp[0], y: sp[1] }, { t: tc + e.dur * .3, x: sp[0], y: sp[1] }, { t: tc + e.dur * .5, x: dl[0], y: dl[1] }, { t: tc + e.dur * .82, x: pl[0], y: pl[1] });
          e.ring = [{ r: B.split, t0: tc - .3, t1: tc + .5 }, { r: B.split, t0: tc + e.dur * .3 - .3, t1: tc + e.dur * .3 + .5 }, { r: B.delete, t0: tc + e.dur * .5 - .3, t1: tc + e.dur * .5 + .5 }];
          e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; zr(null); break; }
        case "speed": click(B.speed, tc); e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; zr(C.tl); break;
        case "text": click(B.text, tc); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break;
        case "caption": click(B.caption, tc); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break;
        case "filter":
          if (mob) { click(B.filter, tc - .2); e.cur.push({ t: tc + .4, x: cx(C.filterThumb)[0], y: cx(C.filterThumb)[1] }); e.clicks = [tc - .2, tc + .55]; e.cur.push({ t: tc + .55, x: cx(C.filterThumb)[0], y: cx(C.filterThumb)[1] }); e.frames = [{ t: tc - 1.1, f: "tools2" }, { t: tc + .2, f: "filters" }]; zr(null); }
          else { click(B.filter, tc - .5); var fc = cx(C.filterThumb); e.cur.push({ t: tc, x: fc[0], y: fc[1] }, { t: tc + .1, x: fc[0], y: fc[1] }); e.clicks = [tc - .5, tc + .1]; e.ring.push({ r: C.filterThumb, t0: tc - .2, t1: tc + .6 }); e.frames = [{ t: tc - 1.4, f: "edit" }]; zr(null); }
          break;
        case "zoom":
          if (mob) { var pc = cx(C.player); e.cur.push({ t: tc - tr, x: pc[0] - 30, y: pc[1] + 20 }, { t: tc, x: pc[0] - 30, y: pc[1] + 20 }, { t: tc + e.dur * .8, x: pc[0] + 40, y: pc[1] - 24 }); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); }
          else { var k = cx(C.knob); e.cur.push({ t: tc - tr, x: k[0], y: k[1] }, { t: tc, x: k[0], y: k[1] }, { t: tc + e.dur * .8, x: C.knobEnd, y: k[1] }); e.ring = [{ r: [1368, 262, 520, 60], t0: tc - .3, t1: tc + e.dur }]; e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); }
          break;
        case "audio": {
          var fk = mob ? "sound" : "audio", dd2 = e.dur;
          click(B.audio, tc); click(C.aSearch, tc + dd2 * .27); click(C.aSong, tc + dd2 * .5);
          e.cur.push({ t: tc + dd2 * .78, x: C.aDrop[0], y: C.aDrop[1] }); e.clicks = [tc, tc + dd2 * .27, tc + dd2 * .5];
          e.frames = [{ t: tc - 1, f: "edit" }, { t: tc + .35, f: fk }, { t: tc + dd2 * .74, f: "edit" }]; zr(null); break; }
        case "fade": click(B.fade, tc); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break;
        case "effect": click(B.effect, tc); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break;
        case "export":
          if (mob) { click(B.export, tc); e.frames = [{ t: tc - 1, f: "edit" }, { t: tc + .6, f: "export" }]; zr(null); }
          else { var dx = C.dlgExport; click(B.export, tc); click(dx, tc + 1.5); e.clicks = [tc, tc + 1.5]; e.frames = [{ t: tc - 1, f: "edit" }, { t: tc + .55, f: "dialog" }]; zr(null); }
          break;
        default: if (B[e.k]) click(B[e.k], tc); e.frames = [{ t: tc - 1, f: "edit" }]; zr(null);
      }
    });
  }

  /* ---------- build + draw ---------- */
  function el(tag, at, par) { var n = document.createElementNS(NS, tag), sa = n.setAttribute; n.setAttribute = function (k, v) { if (k === "display") { this.style.display = v; return; } return sa.call(this, k, v); }; for (var k in at) n.setAttribute(k, at[k]); if (par) par.appendChild(n); return n; }

  /* word-level timing: wt = start of every spoken word as thousandths of the clip length (made by aligning the voice file with its text) */
  function wordTime(narr, e, wt, d) {
    if (!wt || !wt.length || !e || !(e.idx >= 0) || !narr) return null;
    var re = /\S+/g, m, n = 0, wi = -1; while ((m = re.exec(narr))) { if (wi < 0 && m.index + m[0].length > e.idx) wi = n; n++; }
    if (wi < 0 || !n) return null;
    var j = wt.length === n ? wi : Math.min(wt.length - 1, Math.floor(wi / n * wt.length));
    return wt[j] / 1000 * d;
  }
  function start(pane, narr, steps, dur, lang, wt) {
    var plat = pane.getAttribute("data-p"), C = CFG[plat], zm = pane.querySelector(".uzoom"), cu = pane.querySelector(".ucur"), tip = pane.querySelector(".uclk"); if (!C || !zm || !cu) return null;
    var evs = extract(narr, steps); if (!evs.length) return null;
    /* real times: leave a little silence at the start, then spread by position in the narration */
    var d = dur, tcs = evs.map(function (e) { var wtm = e.st ? null : wordTime(narr, e, wt, d); return wtm != null ? Math.max(.45, wtm + .05) : Math.max(1.0, .25 + e.pos * (d - .6)); });
    var list = [], prevEnd = 0;
    evs.forEach(function (e, i) {
      var tc = Math.max(tcs[i], prevEnd + (wt ? .6 : 1.0)), dd = DUR[e.k] || 1.2;
      if (e.k === "delete") { var hasSel = list.some(function (x) { return x.k === "select" || x.k === "jumpcut"; }); var splitBefore = list.some(function (x) { return x.k === "split"; }); if (splitBefore && !hasSel) { var ts = Math.max(prevEnd + .3, tc - 1.7); if (ts + 1.2 < tc) { list.push({ k: "select", tc: ts, dur: DUR.select, idx: -1 }); } else { tc = Math.max(tc, prevEnd + 2.2); list.push({ k: "select", tc: tc - 1.6, dur: DUR.select, idx: -1 }); } } }
      if (tc + Math.min(dd, 1.6) > d - .1) { tc = d - Math.min(dd, 1.6) - .15; if (tc < prevEnd + .2) return; }
      list.push({ k: e.k, tc: tc, dur: Math.min(dd, Math.max(.8, d - tc)), idx: -1 }); prevEnd = tc + (e.k === "select" || e.k === "split" || e.k === "delete" ? 1.0 : Math.min(dd, 2.2));
    });
    if (!list.length) return null;
    list.sort(function (a, b) { return a.tc - b.tc; });
    plan(C, plat, list);

    /* DOM: overlay svg, extra frame images */
    pane.classList.add("sceneon"); var W = C.W, H = C.H, urlOf = function (n) { return BASE + C.img[n] + ".webp" + IV; };
    var frames = {}; [].forEach.call(pane.querySelectorAll(".uimg"), function (im) { var k = im.getAttribute("data-sf"); if (k) frames[k] = im; });
    Object.keys(C.img).forEach(function (n) { if (!C.img[n] || frames[n]) return; var used = list.some(function (e) { return e.frames.some(function (f) { return f.f === n; }); }); if (!used && n !== "edit") return; var im = document.createElement("img"); im.className = "uimg"; im.setAttribute("data-sf", n); im.src = urlOf(n); im.alt = ""; im.style.position = "absolute"; zm.insertBefore(im, zm.querySelector(".uov") || zm.querySelector(".uhl")); frames[n] = im; });
    var svg = el("svg", { class: "uov", viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "none" }); svg.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;pointer-events:none;display:block"; zm.insertBefore(svg, zm.querySelector(".uhl"));
    var src = urlOf("edit"), gS = el("g", {}, svg), strip = C.strip;
    var mask = el("rect", { x: C.mask[0], y: C.mask[1], width: C.mask[2], height: C.mask[3], fill: C.maskCol, display: "none" }, gS), pool = [];
    for (var i = 0; i < 4; i++) { var ps = el("svg", { overflow: "hidden", display: "none", preserveAspectRatio: "none" }, gS); el("image", { href: src, width: W, height: H, preserveAspectRatio: "none" }, ps); var bd = el("rect", { fill: "none", stroke: "#fff", "stroke-width": plat === "pc" ? 3 : 2, display: "none" }, gS); pool.push({ s: ps, b: bd }); }
    var phl = el("rect", { x: C.PH - 1.5, y: strip.y - 2, width: 3, height: strip.h + 4, fill: "#fff", display: "none" }, gS);
    var flash = el("rect", { y: strip.y - 6, width: plat === "pc" ? 4 : 2, height: strip.h + 12, fill: "#fff", opacity: 0 }, gS);
    var ac = C.aclip, aclip = el("g", { display: "none" }, gS), arc = el("rect", { x: ac[0], y: ac[1], width: ac[2], height: ac[3], rx: plat === "pc" ? 5 : 3, fill: "#1b8a6b", stroke: "#7ff0cb", "stroke-width": plat === "pc" ? 1.5 : 1 }, aclip), awv = (function () { var d = "", n = Math.floor(ac[2] / (plat === "pc" ? 5 : 3)); for (var q = 0; q < n; q++) { var hh = (.25 + .65 * Math.abs(Math.sin(q * 1.7) * Math.cos(q * .53))) * ac[3] * .8, xx = ac[0] + 4 + q * (plat === "pc" ? 5 : 3), yy = ac[1] + ac[3] / 2; d += "M" + xx + " " + (yy - hh / 2) + "V" + (yy + hh / 2); } return el("path", { d: d, stroke: "#c9fff0", "stroke-width": plat === "pc" ? 2 : 1.2, fill: "none", "stroke-linecap": "round" }, aclip); })(), aclp = el("clipPath", { id: "acl" + plat }, svg); el("rect", { x: ac[0], y: ac[1], width: ac[2], height: ac[3] }, aclp); awv.setAttribute("clip-path", "url(#acl" + plat + ")");
    var badge = el("g", { display: "none" }, gS); el("rect", { x: C.badge[0], y: C.badge[1], width: plat === "pc" ? 56 : 30, height: plat === "pc" ? 28 : 16, rx: 8, fill: "#ffc43c" }, badge); var bt = el("text", { x: C.badge[0] + (plat === "pc" ? 28 : 15), y: C.badge[1] + (plat === "pc" ? 21 : 12), "text-anchor": "middle", "font-size": plat === "pc" ? 19 : 10, "font-weight": 800, fill: "#1b1306", "font-family": "Outfit,Arial,sans-serif" }, badge); bt.textContent = "2×";
    if (plat === "mob") { var plus = el("svg", { x: 284, y: 448, width: 36, height: 42, viewBox: "284 448 36 42", overflow: "hidden", preserveAspectRatio: "none" }, gS); el("image", { href: src, width: W, height: H, preserveAspectRatio: "none" }, plus); }
    var tclip = el("g", { display: "none" }, gS), tcr = el("rect", { x: C.textClip[0], y: C.textClip[1], width: C.textClip[2], height: C.textClip[3], rx: 6, fill: "#c4574a" }, tclip), tct = el("text", { x: C.textClip[0] + 10, y: C.textClip[1] + C.textClip[3] * .68, "font-size": plat === "pc" ? 20 : 10, fill: "#fff", "font-weight": 700, "font-family": "Outfit,Arial,sans-serif" }, tclip);
    var pr = C.player, mk = function (flt) { var s = el("svg", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], overflow: "hidden", preserveAspectRatio: "none", display: "none" }, gS); var im = el("image", { href: urlOf("edit"), width: W, height: H, preserveAspectRatio: "none" }, s); if (flt) im.style.filter = "sepia(.55) saturate(1.9) contrast(1.15) hue-rotate(-14deg) brightness(1.04)"; return s; };
    var pBase = mk(false), pFilt = mk(true);
    var white = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#fff", opacity: 0 }, gS), black = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#000", opacity: 0 }, gS);
    var tx = el("g", { display: "none" }, gS), tbox = el("rect", { fill: "none", stroke: "#fff", "stroke-width": plat === "pc" ? 2 : 1, "stroke-dasharray": "6 4" }, tx), ttx = el("text", { "text-anchor": "middle", "font-size": C.fs, "font-weight": 800, fill: "#fff", stroke: "#000", "stroke-width": C.fs * .08, "paint-order": "stroke", "font-family": "Outfit,Arial,sans-serif" }, tx);
    var vg = el("g", { display: "none" }, gS), vbg = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 190 : 100), y: pr[1] + 10, width: plat === "pc" ? 180 : 90, height: plat === "pc" ? 34 : 20, rx: 10, fill: "rgba(0,0,0,.7)" }, vg), vtr = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 150 : 76), y: pr[1] + (plat === "pc" ? 24 : 18), width: plat === "pc" ? 120 : 60, height: plat === "pc" ? 6 : 3, rx: 3, fill: "#555" }, vg), vfl = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 150 : 76), y: pr[1] + (plat === "pc" ? 24 : 18), width: 100, height: plat === "pc" ? 6 : 3, rx: 3, fill: "#2fe0d8" }, vg), vkn = el("circle", { cy: pr[1] + (plat === "pc" ? 27 : 19.5), r: plat === "pc" ? 8 : 4, fill: "#fff" }, vg), vtx = el("text", { x: pr[0] + pr[2] - (plat === "pc" ? 176 : 94), y: pr[1] + (plat === "pc" ? 33 : 17), "font-size": plat === "pc" ? 18 : 9, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, vg); vtx.textContent = "🔊";
    var ug = el("g", { display: "none" }, gS), ubg = el("rect", { x: pr[0] + 10, y: pr[1] + 10, width: plat === "pc" ? 120 : 64, height: plat === "pc" ? 34 : 20, rx: 10, fill: "rgba(255,196,60,.95)" }, ug), utx = el("text", { x: pr[0] + (plat === "pc" ? 70 : 42), y: pr[1] + (plat === "pc" ? 33 : 24), "text-anchor": "middle", "font-size": plat === "pc" ? 19 : 10, "font-weight": 800, fill: "#1b1306", "font-family": "Outfit,Arial,sans-serif" }, ug); utx.textContent = "↶ Undo";
    var cg = el("g", { display: "none" }, gS), cbg = el("rect", { fill: "rgba(0,0,0,.62)", rx: 8 }, cg), ctx = el("text", { "text-anchor": "middle", "font-size": C.fs * .72, "font-weight": 700, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, cg);
    var ex = el("g", { display: "none" }, svg), D = C.dlgBar; el("rect", { x: D[0], y: D[1], width: D[2], height: D[3], fill: C.dlgCol }, ex); var etx = el("text", { x: D[0] + 14, y: D[1] + D[3] * (plat === "pc" ? .42 : .5), "font-size": plat === "pc" ? 26 : 12, "font-weight": 700, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, ex), ebg = el("rect", { x: D[0] + 14, y: D[1] + D[3] * .62, width: D[2] - 28, height: plat === "pc" ? 14 : 6, rx: 7, fill: "#444" }, ex), ebar = el("rect", { x: D[0] + 14, y: D[1] + D[3] * .62, width: 0, height: plat === "pc" ? 14 : 6, rx: 7, fill: "#31e8e0" }, ex);
    var ring = document.createElement("i"); ring.className = "uhl show usr"; ring.style.display = "none"; zm.appendChild(ring);

    var curKF = []; list.forEach(function (e) { e.cur.forEach(function (k) { curKF.push(k); }); }); curKF.sort(function (a, b) { return a.t - b.t; });
    var frameKF = []; list.forEach(function (e) { e.frames.forEach(function (f) { frameKF.push(f); }); }); frameKF.sort(function (a, b) { return a.t - b.t; });
    var zKF = []; list.forEach(function (e) { zKF.push({ t: e.tc - 1.0, r: e.zoom }, { t: e.tc + e.dur + .4, r: e.zoom }); }); var endT = list[list.length - 1].tc + list[list.length - 1].dur + 1.6; zKF.push({ t: endT, r: null }, { t: endT + .8, r: null }); zKF.sort(function (a, b) { return a.t - b.t; });
    var clicks = []; list.forEach(function (e) { e.clicks.forEach(function (t) { clicks.push({ t: t, lab: e.label }); }); }); clicks.sort(function (a, b) { return a.t - b.t; });
    var rings = []; list.forEach(function (e) { (e.ring || []).forEach(function (r) { rings.push(r); }); });
    var full = [0, 0, W, H], lastClick = -1, lastFrame = null;
    var rect = function (r) { return r || full; };
    function cursorAt(t) {
      if (!curKF.length || t < curKF[0].t) return null; var a = curKF[0], b = null;
      for (var i = 0; i < curKF.length; i++) { if (curKF[i].t <= t) a = curKF[i]; else { b = curKF[i]; break; } }
      if (!b) return [a.x, a.y]; var q = ease((t - a.t) / Math.max(.05, b.t - a.t)); return [a.x + (b.x - a.x) * q, a.y + (b.y - a.y) * q];
    }
    function zoomAt(t) {
      var a = null, b = null; for (var i = 0; i < zKF.length; i++) { if (zKF[i].t <= t) a = zKF[i]; else { b = zKF[i]; break; } }
      if (!a) return full; if (!b) return rect(a.r); var A = rect(a.r), B = rect(b.r), q = ease((t - a.t) / Math.max(.05, b.t - a.t)); if (a.r === b.r) return A;
      return [0, 1, 2, 3].map(function (k) { return A[k] + (B[k] - A[k]) * q; });
    }
    function frameAt(t) { var f = C.base; for (var i = 0; i < frameKF.length; i++) { if (frameKF[i].t <= t) f = frameKF[i].f; else break; } return f; }
    function place(r, mobil) {
      var fw = r[2] / W, fh = r[3] / H, s = cl(.62 / Math.max(fw, fh * (mobil ? .55 : .8)), 1, mobil ? 1.9 : 2.1); if (s < 1.12) s = 1;
      var cxx = (r[0] + r[2] / 2) / W, cyy = (r[1] + r[3] / 2) / H, tx0 = cl(.5 - cxx * s, 1 - s, 0), ty0 = cl(.5 - cyy * s, 1 - s, 0);
      zm.style.setProperty("--z", s.toFixed(3)); zm.style.transform = "translate(" + (tx0 * 100).toFixed(2) + "%," + (ty0 * 100).toFixed(2) + "%) scale(" + s.toFixed(3) + ")";
    }
    var mobil = plat === "mob", setR = function (n, r) { n.setAttribute("x", r[0]); n.setAttribute("y", r[1]); n.setAttribute("width", r[2]); n.setAttribute("height", r[3]); };
    var vbPlayer = function (sc, dx, dy) { var vw = pr[2] / sc, vh = pr[3] / sc; return (pr[0] + (pr[2] - vw) / 2 - dx) + " " + (pr[1] + (pr[3] - vh) / 2 - dy) + " " + vw + " " + vh; };

    function update(t) {
      var S = replay(C, list, t), i;
      /* real frames */
      var fn = frameAt(t); if (fn !== lastFrame) { lastFrame = fn; [].forEach.call(zm.querySelectorAll(".uimg"), function (im) { im.classList.toggle("on", im.getAttribute("data-sf") === fn); }); }
      /* the timeline */
      var ovOn = fn === "edit" || fn === "clip" || fn === "tools2"; gS.style.display = ovOn ? "" : "none";
      var show = S.touched; mask.setAttribute("display", show ? "" : "none"); phl.setAttribute("display", show ? "" : "none");
      pool.forEach(function (p, k) {
        var P = show ? S.pieces[k] : null; if (!P || P.w < 1) { p.s.setAttribute("display", "none"); p.b.setAttribute("display", "none"); return; }
        p.s.setAttribute("display", ""); p.s.setAttribute("x", P.x); p.s.setAttribute("y", strip.y); p.s.setAttribute("width", Math.max(1, P.w)); p.s.setAttribute("height", strip.h); p.s.setAttribute("viewBox", P.s0 + " " + strip.y + " " + Math.max(1, P.sw) + " " + strip.h); p.s.style.opacity = P.op;
        p.b.setAttribute("display", P.sel ? "" : "none"); p.b.setAttribute("x", P.x + 1); p.b.setAttribute("y", strip.y + 1); p.b.setAttribute("width", Math.max(1, P.w - 2)); p.b.setAttribute("height", strip.h - 2);
      });
      if (S.flash && S.flash.a > .02) { flash.setAttribute("x", S.flash.x - 2); flash.setAttribute("opacity", S.flash.a); } else flash.setAttribute("opacity", 0);
      if (S.aud > .02) { aclip.setAttribute("display", ""); arc.setAttribute("width", Math.max(1, C.aclip[2] * S.aud)); aclp.firstChild.setAttribute("width", Math.max(1, C.aclip[2] * S.aud)); } else aclip.setAttribute("display", "none");
      badge.setAttribute("display", S.spd > .3 ? "" : "none");
      var tcs2 = S.textClip > 0 || S.capClip > 0; tclip.setAttribute("display", tcs2 ? "" : "none");
      if (tcs2) { var w2 = (S.textClip > 0 ? C.textClip[2] : C.capClip[2]) * (S.textClip > 0 ? S.textClip : S.capClip); tcr.setAttribute("width", Math.max(1, w2)); tct.textContent = S.textClip > 0 ? "Your text" : "Captions"; tct.setAttribute("opacity", w2 > 60 ? 1 : 0); }
      /* the player */
      var sc = (1 + .35 * S.zoom) * (S.jump ? 1.22 : 1), dx = 0, dy = 0;
      if (S.shake > 0 && S.shake < 1) { var a = 1 - S.shake; dx = Math.sin(S.shake * 90) * (mobil ? 5 : 22) * a; dy = Math.cos(S.shake * 70) * (mobil ? 3 : 14) * a; }
      var playerOn = S.zoom > 0 || S.jump || S.flt > 0 || (S.shake > 0 && S.shake < 1);
      pBase.setAttribute("display", playerOn ? "" : "none"); pFilt.setAttribute("display", S.flt > 0 ? "" : "none");
      if (playerOn) { var vb = vbPlayer(sc, dx, dy); pBase.setAttribute("viewBox", vb); pFilt.setAttribute("viewBox", vb); pFilt.style.clipPath = "inset(0 " + ((1 - S.flt) * 100).toFixed(1) + "% 0 0)"; }
      var vw = plat === "pc" ? 120 : 60, vx0 = pr[0] + pr[2] - (plat === "pc" ? 150 : 76); vg.setAttribute("display", S.vol > .02 ? "" : "none"); if (S.vol > .02) { vfl.setAttribute("width", vw * S.volv); vkn.setAttribute("cx", vx0 + vw * S.volv); }
      ug.setAttribute("display", S.undo > .05 ? "" : "none");
      white.setAttribute("opacity", (S.white || 0) * .9); black.setAttribute("opacity", S.fade * .95);
      /* typed text and captions on the picture */
      var showT = S.txt > 0; tx.setAttribute("display", showT ? "" : "none");
      if (showT) { var ft = "Your text here", n = Math.max(1, Math.round(S.txt * ft.length)), tw = ft.length * C.fs * .56, cxp = pr[0] + pr[2] / 2, cyp = pr[1] + pr[3] * .78; ttx.textContent = ft.slice(0, n); ttx.setAttribute("x", cxp); ttx.setAttribute("y", cyp); tbox.setAttribute("x", cxp - tw / 2 - 10); tbox.setAttribute("y", cyp - C.fs * .95); tbox.setAttribute("width", tw + 20); tbox.setAttribute("height", C.fs * 1.4); }
      var lines = ["Hello everyone, welcome", "Today we learn editing", "Let's start now"], ci = S.cap > 0 ? Math.min(2, Math.floor(S.cap * 3)) : -1; cg.setAttribute("display", ci >= 0 ? "" : "none");
      if (ci >= 0) { var tx3 = lines[ci], fw3 = tx3.length * C.fs * .42 + 26, cxc = pr[0] + pr[2] / 2, cyc = pr[1] + pr[3] * .9; ctx.textContent = tx3; ctx.setAttribute("x", cxc); ctx.setAttribute("y", cyc); cbg.setAttribute("x", cxc - fw3 / 2); cbg.setAttribute("y", cyc - C.fs * .75); cbg.setAttribute("width", fw3); cbg.setAttribute("height", C.fs * 1.05); }
      /* the export bar */
      var showE = S.exp >= 0 && fn !== "edit" && fn !== "clip" && fn !== "home" && S.exp > 0; ex.setAttribute("display", showE ? "" : "none");
      if (showE) { var pe = Math.round(S.exp * 100); etx.textContent = pe >= 100 ? "✔  Export successful" : "Exporting…  " + pe + "%"; ebar.setAttribute("width", (D[2] - 28) * S.exp); }
      /* cursor, ring, label */
      var c = cursorAt(t);
      if (c) { cu.style.left = (c[0] / W * 100).toFixed(3) + "%"; cu.style.top = (c[1] / H * 100).toFixed(3) + "%"; cu.style.opacity = 1; } else cu.style.opacity = 0;
      var ci2 = -1; for (i = 0; i < clicks.length; i++) { if (clicks[i].t <= t) ci2 = i; else break; }
      if (ci2 !== lastClick) { lastClick = ci2; if (ci2 >= 0 && t - clicks[ci2].t < 1) { cu.classList.remove("click"); void cu.getBoundingClientRect(); cu.classList.add("click"); } }
      var rg = null; for (i = 0; i < rings.length; i++) { if (t >= rings[i].t0 && t <= rings[i].t1) rg = rings[i]; }
      if (rg) { ring.style.display = "block"; var z = rg.r; ring.style.left = (z[0] / W * 100) + "%"; ring.style.top = (z[1] / H * 100) + "%"; ring.style.width = (z[2] / W * 100) + "%"; ring.style.height = (z[3] / H * 100) + "%"; } else ring.style.display = "none";
      if (ci2 >= 0 && t - clicks[ci2].t < 1.6 && t >= clicks[ci2].t - .05 && clicks[ci2].lab) { tip.textContent = "👆 " + clicks[ci2].lab; tip.classList.add("on"); } else tip.classList.remove("on");
      place(zoomAt(t), mobil);
    }
    function stop() { pane.classList.remove("sceneon"); if (svg.parentNode) svg.remove(); if (ring.parentNode) ring.remove(); [].forEach.call(zm.querySelectorAll(".uimg"), function (im) { var k = im.getAttribute("data-sf"); if (k && !im.hasAttribute("data-keep")) { /* leave frames */ } }); cu.classList.remove("click"); cu.style.opacity = 0; zm.style.setProperty("--z", 1); zm.style.transform = ""; }
    return { update: update, stop: stop, events: list };
  }
  window.QSScene = { wordTime: wordTime, start: start, extract: extract, CFG: CFG, replay: replay };

  var st = document.createElement("style"); st.textContent = ".sceneon .uhl:not(.usr){display:none!important}.sceneon .uzoom{transition:none!important}.sceneon .usr{border-color:#ffc43c}.sceneon .ucur{transition:none!important}";
  document.head.appendChild(st);
})();

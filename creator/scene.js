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
    zoom: L("Zoom in", "زوم اِن", "ज़ूम इन"), fade: L("Transition", "ٹرانزیشن", "ट्रांज़िशन"), effect: L("Effect", "ایفیکٹ", "इफ़ेक्ट"), audio: L("Audio", "آڈیو", "ऑडियो"), export: L("Export", "ایکسپورٹ", "एक्सपोर्ट"), play: L("Play", "پلے", "प्ले"), undo: L("Undo", "انڈو", "अनडू"), volume: L("Volume", "والیوم", "वॉल्यूम"), broll: L("Drag the clip to the upper track", "کلپ کو اوپر والے ٹریک پر کھینچیں", "क्लिप को ऊपर वाले ट्रैक पर खींचें"), pip: L("Make it small", "اسے چھوٹا کریں", "इसे छोटा करें"), exportdlg: L("Export", "ایکسپورٹ", "एक्सपोर्ट"), xres: L("Resolution", "ریزولوشن", "रेज़ोल्यूशन"), xfps: L("Frame rate", "فریم ریٹ", "फ़्रेम रेट"), xfmt: L("Format", "فارمیٹ", "फ़ॉर्मेट"), kbd: L("Keyboard shortcut", "کی بورڈ شارٹ کٹ", "कीबोर्ड शॉर्टकट"), marker: L("Beat markers", "بیٹ مارکر", "बीट मार्कर"), move: L("Drag the picture", "تصویر کھینچیں", "तस्वीर खींचें")
  };
  var DUR = { import: 1.6, select: .5, split: 1.3, delete: 1.3, trim: 1.6, jumpcut: 4.2, speed: 1.6, text: 2.8, caption: 3.2, filter: 1.8, zoom: 2.2, fade: 1.6, effect: 1.5, export: 5, play: 3.2, undo: .8, volume: .8, audio: 3.2, broll: 3, pip: 3, exportdlg: 1.8, xres: 2.2, xfps: 1.6, xfmt: 1.6, kbd: 1.6, marker: 4, move: 2.4, adj: 1.1, kf: 3.4, freeze: 2.2, dup: 1.8, reorder: 2.4, adjl: 2.2, preset: 3 };

  /* ---------- words in the narration → editing actions ---------- */
  var RULES = [
    ["jumpcut", /jump[- ]?cuts?/ig], ["import", /\b(import(?:ing)?|upload(?:ing)?|bring(?:ing)? in|add(?:ing)? (?:your |the |a |our )?(?:video|clip|footage|media|photo)s?)\b/ig],
    ["select", /\b(?:select(?:ing)?|tap(?:ping)? on|click(?:ing)? on|choose|pick)\b[^.,;]{0,22}\b(?:clip|video|layer|track|part|piece)\b/ig], ["split", /\b(split(?:ting)?|cut(?:ting|s)?|slic(?:e|ing)|chop(?:ping)?)\b/ig],
    ["delete", /\b(delet(?:e|ing)|remov(?:e|ing)|eras(?:e|ing)|get(?:ting)? rid of|trash)\b/ig], ["trim", /\b(trim(?:ming)?|shorten(?:ing)?)\b/ig], ["speed", /\b(speed(?:ing)?(?: up)?|slow(?:ing)?[- ]?(?:down|motion|mo)|faster|slower)\b/ig],
    ["caption", /\b(captions?|subtitles?)\b/ig], ["text", /\b(text|titles?|fonts?)\b/ig], ["filter", /\b(filters?|colou?r grad(?:e|ing)|colou?r correction)\b/ig], ["zoom", /\b(zoom(?:ing)?|scale|enlarge|punch[- ]in)\b/ig],
    ["fade", /\b(transitions?|fade|dissolve)\b/ig], ["effect", /(?<!sound )(?<!audio )\b(effects?|glitch|shake|shaky|blur)\b(?! sounds?)/ig], ["export", /\b(export(?:ing)?|render(?:ing)?|save the video|publish)\b(?!\s+(?:settings|dialog|window|panel|menu))/ig], ["exportdlg", /\bexport(?:ing)? (?:settings|dialog|window|panel|menu)\b/ig], ["xres", /\b(resolution|1080p?|720p?)\b/ig], ["xfps", /\b(frame ?rate|fps)\b/ig], ["xfmt", /\b(?:format|mp4)\b/ig], ["play", /\b(?:watch|play|preview)\b/ig], ["kbd", /\bctrl ?\+ ?[a-z]\b/ig], ["marker", /\bpress m\b|\bmark(?:ing)? the beats?\b|\bbeat markers?\b/ig], ["move", /\bdrag(?:ging)? (?:the |your )?(?:video|picture|clip|image) (?:down|up|left|right|a little)/ig], ["undo", /\bundo\b/ig], ["audio", /\b(?:go to|open|tap|click|select|add|choose|pick|use|search|find|drag|import)\s+(?:on\s+)?(?:the\s+|your\s+|some\s+|a\s+)?(?:(?:background|calm|natural|free|good|soft)\s+)?(?:audio|music|sound ?effects?|sounds?|sfx|song)\b/ig], ["volume", /\b(volume|louder|quieter|mute)\b/ig], ["broll", /\b(?:b-?roll|overlay)\b|\b(?:track|layer) above|\bupper (?:track|layer)|\bon top of (?:your|the) (?:main )?(?:clip|video)/ig], ["pip", /picture[- ]in[- ]picture|\bpip\b|\bin (?:a|the) corner/ig],
    ["adj", /\b(temp(?:erature)?|tint|saturation|exposure|brightness|contrast|highlights|shadows?)\b/ig], ["kf", /(?<!volume )(?<!audio )\bkeyframes?\b|\bsmall diamond\b/ig], ["freeze", /\bfreeze(?: frame)?\b/ig], ["dup", /\bduplicat(?:e|ing)\b(?! (?:the )?project| it\b)/ig],
    ["reorder", /\bpress and hold (?:a |the )?clips?\b|\bpress and hold to move\b|\bhold (?:&|and) drag\b|\bre-?order(?:ing)?\b|\brearrang(?:e|ing)\b/ig], ["adjl", /\badjustment layer\b/ig], ["preset", /\bsave (?:it as |a |the |your )?preset\b/ig]
  ];
  function extract(text, steps) {
    var out = [], src = text || "";
    function scan(s, mapPos) {
      RULES.forEach(function (r) { r[1].lastIndex = 0; var m; while ((m = r[1].exec(s))) { if (/\b(not|never|don'?t|avoid|without|stop|no|mistake|before)\s+(\w+\s+)?(\w+\s+)?$/i.test(s.slice(Math.max(0, m.index - 28), m.index))) continue; if (/^(split|delete|trim)$/.test(r[0]) && /\b(be|been|being|is|are|was|were|get|gets|got)\s+$/i.test(s.slice(Math.max(0, m.index - 14), m.index))) continue; out.push({ k: r[0], pos: mapPos(m.index), idx: m.index, txt: m[0], ctx: s.slice(m.index + m[0].length, m.index + m[0].length + 70).split(/[.;?!]|\b(?:temp(?:erature)?|tint|saturation|exposure|contrast|highlights?|shadows?|brightness)\b/i)[0] }); } });
    }
    scan(src, function (i) { return i / Math.max(1, src.length); });
    if (!out.length && steps && steps.length) { /* the narration says nothing editable: use the step list, each step gets its share of time */
      var tot = steps.reduce(function (a, s) { return a + s.length + 14; }, 0), acc = 0;
      steps.forEach(function (s) { var st = acc / tot; acc += s.length + 14; RULES.forEach(function (r) { r[1].lastIndex = 0; var m = r[1].exec(s); if (m) out.push({ k: r[0], pos: st + .5 * (s.length + 14) / tot * .6, idx: 0, st: 1 }); }); });
    }
    if (/chroma|remove bg/i.test(src) || (!/\b(adjust|colou?r|exposure|brightness|temp(?:erature)?|tint|saturation)\b/i.test(src) && out.filter(function (e) { return e.k === "adj"; }).length < 2)) out = out.filter(function (e) { return e.k !== "adj"; });
    if (!/export/i.test(src)) out = out.filter(function (e) { return !/^(xres|xfps|xfmt)$/.test(e.k); });
    out.sort(function (a, b) { return a.pos - b.pos; });
    var res = [];
    out.forEach(function (e) {
      var last = res[res.length - 1];
      if (last && last.k === "jumpcut" && (e.k === "split" || e.k === "delete") && e.pos - last.pos < .06) return; /* "jump cut" already covers its own cut */
      if ((e.k === "broll" || e.k === "pip" || e.k === "marker") && res.some(function (x) { return x.k === e.k; })) return;
      if (last && last.k === e.k && e.k !== "adj" && e.pos - last.pos < .1) return;
      if (res.some(function (x) { return x.k === e.k && Math.abs(x.pos - e.pos) < .05 && (e.k !== "adj" || x.txt === e.txt); })) return;
      if (/^(kf|freeze|dup|reorder|adjl|preset)$/.test(e.k) && res.some(function (x) { return x.k === e.k; })) return;
      res.push(e);
    });
    return res.slice(0, 12);
  }

  /* ---------- device layouts (pixel coordinates of the real screenshots) ---------- */
  var CFG = {
    pc: {
      W: 1919, H: 1079, base: "edit", img: { edit: "pc-edit", import: "pc-import", dialog: "pc-export", text: "pc-text", trans: "pc-trans", audio: "pc-audio" },
      strip: { x: 270, y: 906, w: 542, h: 108 }, mask: [266, 905, 552, 113], maskCol: "rgb(47,47,47)", PH: 450, gap: 9, jL: 150, player: [690, 192, 640, 358], fs: 46,
      btn: { freeze: [543, 745, 34, 34], split: [220, 745, 34, 34], delete: [382, 745, 34, 34], text: [164, 58, 64, 56], caption: [474, 58, 70, 56], filter: [552, 58, 64, 56], effect: [312, 58, 64, 56], fade: [382, 58, 86, 56], export: [1640, 8, 106, 46], speed: [1446, 64, 74, 42], play: [992, 678, 34, 36], undo: [112, 745, 34, 34], volume: [92, 58, 62, 56], audio: [92, 58, 62, 56] },
      aclip: [450, 1022, 250, 26], aSearch: [212, 134, 376, 36], aSong: [610, 388, 40, 40], aDrop: [520, 1035],
      importBtn: [380, 288, 150, 52], dlgExport: [1246, 898, 112, 44], dlgBar: [430, 884, 1060, 72], dlgCol: "rgb(38,38,38)", filterThumb: [365, 225, 130, 130], knob: [1428, 294, 22, 28], knobEnd: 1580,
      over: [286, 792, 300, 82], phY: [783, 1047], phCol: "rgb(38,38,38)", phW: 10, kfB: [1850, 294, 26, 28], ap: { box: [1351, 56, 552, 682], tabs: [["Video", 1392], ["Speed", 1483], ["Animation", 1592], ["Adjust", 1702], ["AI stylize", 1806]], y0: 214, pitch: 62, x0: 1372, x1: 1716, bx: 1727, save: [1370, 668, 520, 38], tab: [1668, 64, 68, 42], sc: { x0: 1370, x1: 1698, y: 308, a: 1439, b: 1462 } }, chev: [637, 62, 26, 46], ovFrom: [365, 225, 130, 130], ovBtn: null, xr: { res: [1116, 389, 336, 34], br: [1116, 446, 336, 34], codec: [1116, 503, 336, 34], fmt: [1116, 560, 336, 34], fps: [1116, 617, 336, 34] }, xpatch: [1124, 392, 120, 28], xpatchCol: "rgb(59,59,59)", xtxt: [1130, 413, 22], tl: [200, 730, 820, 330], plr: [660, 150, 700, 440], textClip: [300, 862, 210, 34], capClip: [300, 862, 150, 34], badge: [282, 912]
    },
    mob: {
      W: 320, H: 698, base: "edit", img: { edit: "m-edit", clip: "m-clip", tools2: "m-tools2", filters: "m-filters", export: "m-export", home: "m-home", sound: "m-sound", audio: "m-audio" },
      strip: { x: 0, y: 449, w: 320, h: 42 }, mask: [0, 445, 320, 50], maskCol: "rgb(10,10,10)", PH: 161, gap: 5, jL: 56, player: [0, 125, 320, 180], fs: 17,
      btn: { adjust: [243, 606, 44, 58], split: [42, 606, 48, 58], delete: [236, 606, 48, 58], text: [99, 606, 46, 58], caption: [242, 606, 46, 58], filter: [195, 606, 44, 58], effect: [194, 606, 46, 58], fade: [147, 606, 46, 58], export: [266, 40, 40, 40], speed: [90, 606, 48, 58], play: [142, 350, 36, 36], undo: [284, 355, 24, 24], volume: [143, 606, 48, 58], audio: [51, 606, 46, 58] },
      aclip: [161, 497, 130, 16], aSearch: [15, 82, 298, 30], aSong: [14, 452, 300, 56], aDrop: [200, 505],
      importBtn: [13, 160, 295, 96], dlgExport: null, dlgBar: [10, 342, 300, 40], dlgCol: "rgb(14,14,14)", filterThumb: [128, 516, 56, 76], knob: null, knobEnd: 0,
      over: [20, 402, 130, 38], phY: [426, 545], phCol: "rgb(10,10,10)", phW: 4, kfB: [236, 355, 30, 26], ap: { box: [0, 437, 320, 261], tab: [128, 444, 46, 26], items: [38, 66, 506], slider: [60, 254, 604], check: [284, 634, 36, 36] }, ovFrom: [60, 520, 70, 80], ovBtn: [8, 606, 46, 58], xr: { res: [8, 90, 304, 50], br: [8, 258, 304, 50], codec: [8, 258, 304, 50], fmt: [8, 175, 304, 50], fps: [8, 175, 304, 50] }, xk: { y: 126, x0: 113, x1: 206 }, tl: [0, 380, 320, 170], plr: [0, 110, 320, 210], textClip: [20, 424, 110, 18], capClip: [20, 424, 80, 18], badge: [8, 452]
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
    kbd: function (S, e, p) { S.kbd = Math.sin(Math.PI * cl(p, 0, 1)) * 1.2; S.kbdT = String(e.txt || "").replace(/\s*\+\s*/, " + ").replace(/^ctrl/i, "Ctrl").replace(/ ([a-z])$/, function (m, c) { return " " + c.toUpperCase(); }); },
    marker: function (S, e, p) { S.touched = true; S.mk = ease(p); S.kbd = p < .96 ? 1 : 0; S.kbdT = "M"; },
    move: function (S, e, p) { S.mv = ease(p); },
    xres: function (S, e, p) { S.xres = ease(cl((p - .35) / .5, 0, 1)); },
    play: function (S, e, p, C) { S.touched = true; var x0 = C.PH, x1 = C.strip.x + C.strip.w * .94; S.ph = p < 1 ? x0 + (x1 - x0) * p : null; },
    broll: function (S, e, p) { S.touched = true; S.over = ease(p); },
    pip: function (S, e, p) { S.touched = true; S.over = 1; S.pip = ease(p); },
    adj: function (S, e, p) { S.adjOn = 1; S.adjCur = e.nm; if (p > 0) { S.adjV[e.nm] = (e.v0 || 0) + (e.tg - (e.v0 || 0)) * ease(cl((p - .12) / .75, 0, 1)); } },
    preset: function (S, e, p) { S.adjOn = 1; S.touched = true; if (p > 0) { S.pst = cl(p / .8, 0, 1); S.toast = p > .8 ? 1 : 0; } },
    kf: function (S, e, p, C) {
      S.touched = true; S.kf1 = p > .2 ? 1 : 0; S.kfS = ease(cl((p - .55) / .3, 0, 1)); S.kf2 = p > .88 ? 1 : 0;
      var x0 = C.PH, x1 = C.strip.x + C.strip.w * .52; S.ph = p < .28 ? null : x0 + (x1 - x0) * ease(cl((p - .28) / .25, 0, 1)); S.kfX2 = x1;
    },
    freeze: function (S, e, p, C) { S.touched = true; if (e.lp != null && p <= 0) { S.tb = ease(e.lp); S.tbSel = 3; return; } S.tb = 1; S.tbSel = 3; var w = (C.W > 1000 ? 120 : 46) * ease(cl((p - .3) / .5, 0, 1)); if (w > 1) { splitAt(S, C.PH, w); S.fzX = C.PH + 3; S.fzW = w; } if (p < .3) S.flash = { x: C.PH, a: 1 - p / .3 }; },
    dup: function (S, e, p, C) {
      if (p <= 0) { S.tb = ease(e.lp || 0); S.tbSel = 1; return; } S.touched = true; S.tb = 1; S.tbSel = 1; var st = C.strip, q = ease(cl((p - .2) / .5, 0, 1)), P = S.pieces[S.pieces.length - 1]; if (!P) return;
      if (S.pieces.length === 1 && P.w > st.w * .8) { var hw = P.w * .5; P.sw = P.sw * .5; P.w = hw - 2; S.pieces.push({ s0: P.s0, sw: P.sw, x: P.x + hw + 2, w: (hw - 2) * q, op: q, sel: true }); }
      else { var x0 = P.x + P.w + 4, w = Math.min(P.w, st.x + st.w - x0); if (w > 12) S.pieces.push({ s0: P.s0, sw: P.sw * w / P.w, x: x0, w: w * q, op: q, sel: true }); }
    },
    reorder: function (S, e, p, C) {
      S.touched = true; var st = C.strip, q = ease(cl((p - .25) / .6, 0, 1));
      if (S.pieces.length < 3) { var P = S.pieces.length ? S.pieces[0] : { s0: st.x, sw: st.w, x: st.x, w: st.w }, t3 = (P.w - 2 * C.gap) / 3, ts = P.sw / 3; S.pieces = [0, 1, 2].map(function (k) { return { s0: P.s0 + ts * k, sw: ts, x: P.x + k * (t3 + C.gap), w: t3, op: 1, sel: false }; }); }
      var A = S.pieces[0], B = S.pieces[1]; if (!A || !B) return; var d0 = B.x - A.x; A.x += d0 * q; B.x -= d0 * q; B.sel = p > .15 && p < .95; B.lift = p > .15 && p < .95 ? 1 : 0; if (p >= 1) { S.pieces[0] = B; S.pieces[1] = A; }
    },
    adjl: function (S, e, p) { S.touched = true; S.adjl = ease(cl((p - .3) / .5, 0, 1)); },
    volume: function (S, e, p) { S.vol = Math.sin(Math.PI * cl(p, 0, 1)); S.volv = 1 - .6 * ease(p); }
  };
  function replay(C, evs, t) {
    var S = { pieces: [], touched: false, flash: null, spd: 0, jump: 0, white: 0, textClip: 0, txt: 0, capClip: 0, cap: 0, flt: 0, zoom: 0, fade: 0, shake: 0, exp: -1, aud: 0, over: 0, pip: 0, xres: 0, ph: null, kbd: 0, kbdT: "", mk: 0, mv: 0, undo: 0, vol: 0, volv: 1, lastVis: "", adjOn: 0, adjCur: "", adjV: {}, pst: 0, toast: 0, kf1: 0, kf2: 0, kfS: 0, tb: 0, tbSel: 0, fzW: 0, adjl: 0 }, st = C.strip;
    if (!(evs.length && evs[0].k === "import")) S.pieces.push({ s0: st.x, sw: st.w, x: st.x, w: st.w, op: 1, sel: false });
    evs.forEach(function (e) { var p = (t - e.tc) / e.dur; if (p <= 0) { if (e.lead && t >= e.tc - e.lead && HND[e.k]) { e.lp = (t - (e.tc - e.lead)) / e.lead; HND[e.k](S, e, 0, C); } return; } p = Math.min(1, p); var h = HND[e.k]; if (h) h(S, e, p, C); if (/^(text|caption|filter|speed|zoom)$/.test(e.k)) S.lastVis = e.k; });
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
        case "exportdlg": if (mob) { click(B.export, tc); e.frames = [{ t: tc - 1, f: "edit" }, { t: tc + .6, f: "export" }]; } else { click(B.export, tc); e.frames = [{ t: tc - 1, f: "edit" }, { t: tc + .55, f: "dialog" }]; } zr(null); break;
        case "xres": case "xfps": case "xfmt": {
          var opened = evs.slice(0, i).some(function (x) { return /^(xres|xfps|xfmt|exportdlg|export)$/.test(x.k); }), row = C.xr[e.k === "xres" ? "res" : e.k === "xfps" ? "fps" : "fmt"], rc = cx(row);
          if (!opened) { click(B.export, tc - 1.5); e.frames = mob ? [{ t: tc - 2.2, f: "edit" }, { t: tc - .9, f: "export" }] : [{ t: tc - 2.2, f: "edit" }, { t: tc - .9, f: "dialog" }]; e.clicks = [tc - 1.5, tc]; }
          else { e.frames = [{ t: tc - .5, f: mob ? "export" : "dialog" }]; e.clicks = [tc]; }
          var rx0 = mob && e.k === "xres" ? C.xk.x0 : rc[0]; var ry0 = mob && e.k === "xres" ? C.xk.y : rc[1]; e.cur.push({ t: tc - .5, x: rx0, y: ry0 }, { t: tc, x: rx0, y: ry0 });
          if (mob && e.k === "xres") e.cur.push({ t: tc + e.dur * .6, x: C.xk.x1, y: C.xk.y });
          e.ring = (e.ring || []).concat([{ r: row, t0: tc - .3, t1: tc + e.dur + .4 }]); zr(null); break; }
        case "kbd": e.frames = [{ t: tc - 1, f: "edit" }]; e.clicks = []; e.cur = []; zr(null); break;
        case "marker": { var m0 = cx(C.strip); e.cur.push({ t: tc - tr, x: C.strip.x + C.strip.w * .2, y: C.strip.y - 20 }, { t: tc + e.dur * .8, x: C.strip.x + C.strip.w * .86, y: C.strip.y - 20 }); e.clicks = [tc]; e.frames = [{ t: tc - 1, f: "edit" }]; zr(C.tl); break; }
        case "move": { var pm = cx(C.player); e.cur.push({ t: tc - tr, x: pm[0], y: pm[1] - 24 }, { t: tc, x: pm[0], y: pm[1] - 24 }, { t: tc + e.dur * .8, x: pm[0], y: pm[1] + 24 }); e.clicks = [tc]; e.ring = [{ r: C.player, t0: tc - .3, t1: tc + e.dur }]; e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break; }
        case "adj": {
          var AK = { temp: "temp", temperature: "temp", tint: "tint", saturation: "sat", exposure: "exp", brightness: "exp", contrast: "con", highlight: "hi", highlights: "hi", shadow: "sh", shadows: "sh" }, nm = AK[String(e.txt || "").toLowerCase()] || "exp", cxt = String(e.ctx || "").toLowerCase();
          var neg = /\b(blue|cool|cold|down|lower|less|reduce|deeper|darker|minus|decrease)\b/.test(cxt), pos = /\b(yellow|warm|up|raise|more|higher|boost|brighter|increase|stronger)\b/.test(cxt);
          var DEF = { temp: -.5, tint: .35, sat: .4, exp: .3, con: .35, hi: -.3, sh: .3 }, sg = neg && !pos ? -1 : pos && !neg ? 1 : (DEF[nm] < 0 ? -1 : 1), mag = Math.max(.3, Math.min(.6, Math.abs(DEF[nm]) + .1)); e.nm = nm; e.tg = sg * mag;
          var prevE = null; evs.slice(0, i).forEach(function (x) { if (x.k === "adj" && x.nm === nm) prevE = x; }); e.v0 = prevE ? prevE.tg : 0;
          var firstA = !evs.slice(0, i).some(function (x) { return x.k === "adj" || x.k === "preset"; }), AP = C.ap, idx = 0;
          if (!mob) {
            var rows = ["temp", "tint", "sat", "exp", "con", "hi", "sh"], ri = Math.max(0, rows.indexOf(nm)), ys = AP.y0 + ri * AP.pitch + 30, tx0 = AP.x0 + (AP.x1 - AP.x0) * (.5 + e.v0 * .5), tx1 = AP.x0 + (AP.x1 - AP.x0) * (.5 + e.tg * .5);
            e.frames = [{ t: tc - 1, f: "edit" }]; if (firstA) { click(AP.tab, tc - .85); e.lead = 1.0; e.clicks = [tc - .85, tc]; }
            e.cur.push({ t: tc - .08, x: tx0, y: ys }, { t: tc + .1, x: tx0, y: ys }, { t: tc + e.dur * .85, x: tx1, y: ys }); if (!firstA) e.clicks = [tc + .1];
            e.ring = (e.ring || []).concat([{ r: [AP.x0 - 6, ys - 38, AP.bx + 90 - AP.x0, 66], t0: tc - .3, t1: tc + e.dur + .5 }]); zr(null);
          } else {
            var order = ["exp", "con", "sat", "sharp", "hi", "sh", "temp", "tint"], oi = Math.max(0, order.indexOf(nm)), scr = Math.max(0, Math.min(oi * 66 - 110, 8 * 66 - 290)), ix = AP.items[0] + oi * AP.items[1] - scr, sy = AP.slider[2], sx = AP.slider[0] + (AP.slider[1] - AP.slider[0]) * (.5 + e.v0 * .5), sx1 = AP.slider[0] + (AP.slider[1] - AP.slider[0]) * (.5 + e.tg * .5);
            e.lead = firstA ? 1.7 : .6;
            if (firstA) { click(B.adjust, tc - 1.6); click(AP.tab, tc - .85); e.frames = [{ t: tc - 2.2, f: "tools2" }, { t: tc - 1.1, f: "filters" }]; e.clicks = [tc - 1.6, tc - .85, tc - .3]; }
            else { e.frames = [{ t: tc - 1, f: "filters" }]; e.clicks = [tc - .3]; }
            e.cur.push({ t: tc - .3, x: ix, y: AP.items[2] }, { t: tc + .02, x: sx, y: sy }, { t: tc + .12, x: sx, y: sy }, { t: tc + e.dur * .85, x: sx1, y: sy }); e.clicks.push(tc + .12);
            e.ring = (e.ring || []).concat([{ r: [ix - 28, AP.items[2] - 26, 56, 70], t0: tc - .4, t1: tc + .5 }]); zr(null);
          }
          break; }
        case "preset": {
          var firstP = !evs.slice(0, i).some(function (x) { return x.k === "adj" || x.k === "preset"; }), APp = C.ap;
          if (!mob) { e.frames = [{ t: tc - 1, f: "edit" }]; if (firstP) { click(APp.tab, tc - .85); e.lead = 1; } var sv = APp.save; e.cur.push({ t: tc - .1, x: cx(sv)[0], y: cx(sv)[1] }, { t: tc, x: cx(sv)[0], y: cx(sv)[1] }); e.clicks = [tc]; e.ring = (e.ring || []).concat([{ r: sv, t0: tc - .3, t1: tc + .8 }]); }
          else { e.frames = [{ t: tc - 1, f: "filters" }]; var ck = cx(APp.check); e.cur.push({ t: tc - .1, x: ck[0], y: ck[1] }, { t: tc, x: ck[0], y: ck[1] }); e.clicks = [tc]; e.ring = [{ r: APp.check, t0: tc - .3, t1: tc + .8 }]; }
          zr(null); break; }
        case "kf": {
          var kb = C.kfB, kc = cx(kb), plA = C.strip.x + C.strip.w * .52, tlY = C.strip.y - 14;
          e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; e.clicks = [tc + e.dur * .2, tc + e.dur * .88];
          e.cur.push({ t: tc - tr, x: kc[0], y: kc[1] }, { t: tc + e.dur * .2, x: kc[0], y: kc[1] }, { t: tc + e.dur * .3, x: C.PH, y: tlY }, { t: tc + e.dur * .53, x: plA, y: tlY });
          if (!mob) { var sc = C.ap.sc; e.cur.push({ t: tc + e.dur * .58, x: sc.a, y: sc.y }, { t: tc + e.dur * .85, x: sc.b, y: sc.y }); e.ring = [{ r: kb, t0: tc + e.dur * .1, t1: tc + e.dur * .45 }, { r: [1360, 280, 510, 56], t0: tc + e.dur * .5, t1: tc + e.dur }]; }
          else { e.cur.push({ t: tc + e.dur * .86, x: kc[0], y: kc[1] }); e.ring = [{ r: kb, t0: tc + e.dur * .1, t1: tc + e.dur * .45 }, { r: kb, t0: tc + e.dur * .8, t1: tc + e.dur }]; }
          zr(null); break; }
        case "freeze": {
          if (!mob) { click(B.freeze, tc + .3); e.frames = [{ t: tc - 1, f: "edit" }]; zr(C.tl); }
          else { var tb = [34 + 49 * 3 - 12, 606, 49, 58]; e.lead = 1.4; e.cur.push({ t: tc - 1.4, x: 250, y: 636 }, { t: tc - .4, x: 90, y: 636 }, { t: tc + .05, x: 232, y: 636 }); e.clicks = [tc]; e.ring = [{ r: [207, 606, 49, 58], t0: tc - .2, t1: tc + .7 }]; e.frames = [{ t: tc - 1.5, f: "clip" }]; zr(null); }
          break; }
        case "dup": {
          if (!mob) { e.cur.push({ t: tc - tr, x: cx(C.strip)[0], y: C.strip.y + 20 }, { t: tc, x: cx(C.strip)[0], y: C.strip.y + 20 }); e.clicks = [tc]; e.frames = [{ t: tc - 1, f: "edit" }]; zr(C.tl); }
          else { e.lead = 1.4; e.cur.push({ t: tc - 1.4, x: 250, y: 636 }, { t: tc - .4, x: 90, y: 636 }, { t: tc + .05, x: 134, y: 636 }); e.clicks = [tc]; e.ring = [{ r: [109, 606, 49, 58], t0: tc - .2, t1: tc + .7 }]; e.frames = [{ t: tc - 1.5, f: "clip" }]; zr(null); }
          break; }
        case "reorder": {
          var st3 = C.strip, w3 = (st3.w - 2 * C.gap) / 3, yy3 = st3.y + st3.h / 2, ax = st3.x + w3 * .5, bx2 = st3.x + w3 * 1.5 + C.gap;
          e.cur.push({ t: tc - tr, x: bx2, y: yy3 }, { t: tc, x: bx2, y: yy3 }, { t: tc + e.dur * .2, x: bx2, y: yy3 }, { t: tc + e.dur * .85, x: ax, y: yy3 }); e.clicks = [tc]; e.ring = [{ r: [bx2 - w3 / 2, st3.y - 3, w3, st3.h + 6], t0: tc - .3, t1: tc + .6 }]; e.frames = [{ t: tc - 1, f: mob ? "clip" : "edit" }]; e.label = L("Press & hold, then drag", "دبائے رکھیں، پھر ڈریگ کریں", "दबाए रखें, फिर ड्रैग करें").en; zr(C.tl); break; }
        case "adjl": {
          if (!mob) { click(C.chev, tc - .8); var ob = cx([C.over[0], C.over[1], 400, 60]); e.cur.push({ t: tc + .5, x: ob[0] - 60, y: ob[1] }, { t: tc + e.dur * .85, x: ob[0] + 120, y: ob[1] }); e.frames = [{ t: tc - 1, f: "edit" }]; e.lead = 0; }
          else { var oc = cx(C.over); e.cur.push({ t: tc - tr, x: oc[0], y: oc[1] }, { t: tc, x: oc[0], y: oc[1] }, { t: tc + e.dur * .8, x: oc[0] + 120, y: oc[1] }); e.clicks = [tc]; e.frames = [{ t: tc - 1, f: "edit" }]; }
          e.ring = (e.ring || []).concat([{ r: [C.over[0] - 6, C.over[1] - 6, C.strip.w - 20, C.over[3] * .75 + 12], t0: tc + .2, t1: tc + e.dur + .4 }]); e.label = "Adjustment layer"; zr(C.tl); break; }
        case "play": click(B.play, tc); e.frames = [{ t: tc - 1, f: mob ? "edit" : "edit" }]; zr(C.tl); break;
        case "broll": {
          if (mob) { click(C.ovBtn, tc - .25); e.frames = [{ t: tc - 1, f: "tools2" }, { t: tc + .5, f: "edit" }]; }
          var ms = cx(C.ovFrom), ov = C.over, ox = ov[0] + ov[2] * .15, oy = ov[1] + ov[3] / 2;
          e.cur.push({ t: tc - tr, x: ms[0], y: ms[1] }, { t: tc, x: ms[0], y: ms[1] }, { t: tc + e.dur * .75, x: ox + 40, y: oy }); e.clicks = [tc];
          e.ring = (e.ring || []).concat(mob ? [{ r: ov, t0: tc + e.dur * .45, t1: tc + e.dur + .6 }] : [{ r: C.ovFrom, t0: tc - .3, t1: tc + .5 }, { r: ov, t0: tc + e.dur * .45, t1: tc + e.dur + .6 }]); if (mob) e.label = "Overlay → Add overlay"; if (!mob) e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break; }
        case "pip": {
          var pr0 = C.player, cn = [pr0[0] + pr0[2] * .98, pr0[1] + pr0[3] * .98], cn2 = [pr0[0] + pr0[2] * .72, pr0[1] + pr0[3] * .6];
          e.cur.push({ t: tc - tr, x: cn[0], y: cn[1] }, { t: tc, x: cn[0], y: cn[1] }, { t: tc + e.dur * .8, x: cn2[0], y: cn2[1] }); e.clicks = [tc];
          e.ring = [{ r: [cn[0] - 22, cn[1] - 22, 44, 44], t0: tc - .3, t1: tc + .6 }]; e.frames = [{ t: tc - 1, f: "edit" }]; zr(null); break; }
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
    if (pane.querySelectorAll(".uhl").length >= 3) steps = null; /* a map/tour moment: the zone rings walk through the areas */
    var evs = extract(narr, steps); if (!evs.length) return null;
    /* real times: leave a little silence at the start, then spread by position in the narration */
    var d = dur, tcs = evs.map(function (e) { var wtm = e.st ? null : wordTime(narr, e, wt, d); return wtm != null ? Math.max(.45, wtm + .05) : Math.max(1.0, .25 + e.pos * (d - .6)); });
    var list = [], prevEnd = 0;
    evs.forEach(function (e, i) {
      var tc = Math.max(tcs[i], prevEnd + (wt ? .6 : 1.0)), dd = DUR[e.k] || 1.2;
      if (e.k === "delete") { var hasSel = list.some(function (x) { return x.k === "select" || x.k === "jumpcut"; }); var splitBefore = list.some(function (x) { return x.k === "split"; }); if (splitBefore && !hasSel) { var ts = Math.max(prevEnd + .3, tc - 1.7); if (ts + 1.2 < tc) { list.push({ k: "select", tc: ts, dur: DUR.select, idx: -1 }); } else { tc = Math.max(tc, prevEnd + 2.2); list.push({ k: "select", tc: tc - 1.6, dur: DUR.select, idx: -1 }); } } }
      if (tc + Math.min(dd, 1.6) > d - .1) { tc = d - Math.min(dd, 1.6) - .15; if (tc < prevEnd + .2) return; }
      list.push({ k: e.k, tc: tc, dur: Math.min(dd, Math.max(.8, d - tc)), idx: -1, txt: e.txt, ctx: e.ctx }); prevEnd = tc + (e.k === "select" || e.k === "split" || e.k === "delete" ? 1.0 : Math.min(dd, 2.2));
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
    var phCv = el("rect", { fill: C.phCol, display: "none" }, gS); gS.insertBefore(phCv, pool[0].s); var phHd = el("rect", { width: plat === "pc" ? 14 : 7, height: plat === "pc" ? 20 : 9, rx: 3, fill: "#fff", display: "none" }, gS);
    var flash = el("rect", { y: strip.y - 6, width: plat === "pc" ? 4 : 2, height: strip.h + 12, fill: "#fff", opacity: 0 }, gS);
    var ovG = el("g", { display: "none" }, gS), ovS = el("svg", { overflow: "hidden", preserveAspectRatio: "none" }, ovG); el("image", { href: src, width: W, height: H, preserveAspectRatio: "none" }, ovS); var ovB = el("rect", { fill: "none", stroke: "#a78bfa", "stroke-width": plat === "pc" ? 3 : 2 }, ovG), ovT = el("text", { "font-size": plat === "pc" ? 18 : 9, fill: "#fff", "font-weight": 800, "font-family": "Outfit,Arial,sans-serif" }, ovG); ovT.textContent = "B-roll";
    var pipG = el("g", { display: "none" }, gS), pipS = el("svg", { overflow: "hidden", preserveAspectRatio: "none" }, pipG), pipB = el("rect", { fill: "none", stroke: "#fff", "stroke-width": plat === "pc" ? 4 : 2 }, pipG); el("image", { href: urlOf("edit"), width: W, height: H, preserveAspectRatio: "none" }, pipS);
    var xg = el("g", { display: "none" }, svg), xpr = el("rect", { fill: plat === "pc" ? C.xpatchCol : "rgb(24,24,24)" }, xg), xtx = el("text", { "font-size": plat === "pc" ? 22 : 12, "font-weight": 600, fill: "#ececec", "font-family": "Segoe UI,Outfit,Arial,sans-serif" }, xg), xtr = el("line", { stroke: "rgb(95,164,173)", "stroke-width": 3, "stroke-linecap": "round" }, xg), xtg = el("line", { stroke: "rgb(52,52,52)", "stroke-width": 3, "stroke-linecap": "round" }, xg), xkn = el("circle", { r: 8, fill: "#fff" }, xg); xtx.textContent = "1080p";
    var ac = C.aclip, aclip = el("g", { display: "none" }, gS), arc = el("rect", { x: ac[0], y: ac[1], width: ac[2], height: ac[3], rx: plat === "pc" ? 5 : 3, fill: "#1b8a6b", stroke: "#7ff0cb", "stroke-width": plat === "pc" ? 1.5 : 1 }, aclip), awv = (function () { var d = "", n = Math.floor(ac[2] / (plat === "pc" ? 5 : 3)); for (var q = 0; q < n; q++) { var hh = (.25 + .65 * Math.abs(Math.sin(q * 1.7) * Math.cos(q * .53))) * ac[3] * .8, xx = ac[0] + 4 + q * (plat === "pc" ? 5 : 3), yy = ac[1] + ac[3] / 2; d += "M" + xx + " " + (yy - hh / 2) + "V" + (yy + hh / 2); } return el("path", { d: d, stroke: "#c9fff0", "stroke-width": plat === "pc" ? 2 : 1.2, fill: "none", "stroke-linecap": "round" }, aclip); })(), aclp = el("clipPath", { id: "acl" + plat }, svg); el("rect", { x: ac[0], y: ac[1], width: ac[2], height: ac[3] }, aclp); awv.setAttribute("clip-path", "url(#acl" + plat + ")");
    var mkG = el("g", { display: "none" }, gS), mks = []; for (var mi = 0; mi < 6; mi++) mks.push(el("path", { fill: "#ff9f1c", stroke: "#fff", "stroke-width": plat === "pc" ? 1.5 : 1 }, mkG));
    var kbG = el("g", { display: "none" }, svg), kbR = el("rect", { rx: C.fs * .3, fill: "rgba(20,20,20,.92)", stroke: "#fff", "stroke-width": plat === "pc" ? 3 : 1.5 }, kbG), kbT = el("text", { "text-anchor": "middle", "font-size": C.fs * 1.05, "font-weight": 800, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, kbG);
    var badge = el("g", { display: "none" }, gS); el("rect", { x: C.badge[0], y: C.badge[1], width: plat === "pc" ? 56 : 30, height: plat === "pc" ? 28 : 16, rx: 8, fill: "#ffc43c" }, badge); var bt = el("text", { x: C.badge[0] + (plat === "pc" ? 28 : 15), y: C.badge[1] + (plat === "pc" ? 21 : 12), "text-anchor": "middle", "font-size": plat === "pc" ? 19 : 10, "font-weight": 800, fill: "#1b1306", "font-family": "Outfit,Arial,sans-serif" }, badge); bt.textContent = "2×";
    if (plat === "mob") { var plus = el("svg", { x: 284, y: 448, width: 36, height: 42, viewBox: "284 448 36 42", overflow: "hidden", preserveAspectRatio: "none" }, gS); el("image", { href: src, width: W, height: H, preserveAspectRatio: "none" }, plus); }
    var tclip = el("g", { display: "none" }, gS), tcr = el("rect", { x: C.textClip[0], y: C.textClip[1], width: C.textClip[2], height: C.textClip[3], rx: 6, fill: "#c4574a" }, tclip), tct = el("text", { x: C.textClip[0] + 10, y: C.textClip[1] + C.textClip[3] * .68, "font-size": plat === "pc" ? 20 : 10, fill: "#fff", "font-weight": 700, "font-family": "Outfit,Arial,sans-serif" }, tclip);
    var pr = C.player, mk = function (flt) { var s = el("svg", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], overflow: "hidden", preserveAspectRatio: "none", display: "none" }, gS); var im = el("image", { href: urlOf("edit"), width: W, height: H, preserveAspectRatio: "none" }, s); if (flt) im.style.filter = "sepia(.55) saturate(1.9) contrast(1.15) hue-rotate(-14deg) brightness(1.04)"; s.__im = im; return s; };
    var pBase = mk(false), pFilt = mk(true);
    var white = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#fff", opacity: 0 }, gS), black = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#000", opacity: 0 }, gS);
    var tx = el("g", { display: "none" }, gS), tbox = el("rect", { fill: "none", stroke: "#fff", "stroke-width": plat === "pc" ? 2 : 1, "stroke-dasharray": "6 4" }, tx), ttx = el("text", { "text-anchor": "middle", "font-size": C.fs, "font-weight": 800, fill: "#fff", stroke: "#000", "stroke-width": C.fs * .08, "paint-order": "stroke", "font-family": "Outfit,Arial,sans-serif" }, tx);
    var vg = el("g", { display: "none" }, gS), vbg = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 190 : 100), y: pr[1] + 10, width: plat === "pc" ? 180 : 90, height: plat === "pc" ? 34 : 20, rx: 10, fill: "rgba(0,0,0,.7)" }, vg), vtr = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 150 : 76), y: pr[1] + (plat === "pc" ? 24 : 18), width: plat === "pc" ? 120 : 60, height: plat === "pc" ? 6 : 3, rx: 3, fill: "#555" }, vg), vfl = el("rect", { x: pr[0] + pr[2] - (plat === "pc" ? 150 : 76), y: pr[1] + (plat === "pc" ? 24 : 18), width: 100, height: plat === "pc" ? 6 : 3, rx: 3, fill: "#2fe0d8" }, vg), vkn = el("circle", { cy: pr[1] + (plat === "pc" ? 27 : 19.5), r: plat === "pc" ? 8 : 4, fill: "#fff" }, vg), vtx = el("text", { x: pr[0] + pr[2] - (plat === "pc" ? 176 : 94), y: pr[1] + (plat === "pc" ? 33 : 17), "font-size": plat === "pc" ? 18 : 9, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, vg); vtx.textContent = "🔊";
    var ug = el("g", { display: "none" }, gS), ubg = el("rect", { x: pr[0] + 10, y: pr[1] + 10, width: plat === "pc" ? 120 : 64, height: plat === "pc" ? 34 : 20, rx: 10, fill: "rgba(255,196,60,.95)" }, ug), utx = el("text", { x: pr[0] + (plat === "pc" ? 70 : 42), y: pr[1] + (plat === "pc" ? 33 : 24), "text-anchor": "middle", "font-size": plat === "pc" ? 19 : 10, "font-weight": 800, fill: "#1b1306", "font-family": "Outfit,Arial,sans-serif" }, ug); utx.textContent = "↶ Undo";
    var cg = el("g", { display: "none" }, gS), cbg = el("rect", { fill: "rgba(0,0,0,.62)", rx: 8 }, cg), ctx = el("text", { "text-anchor": "middle", "font-size": C.fs * .72, "font-weight": 700, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, cg);
    var ex = el("g", { display: "none" }, svg), D = C.dlgBar; el("rect", { x: D[0], y: D[1], width: D[2], height: D[3], fill: C.dlgCol }, ex); var etx = el("text", { x: D[0] + 14, y: D[1] + D[3] * (plat === "pc" ? .42 : .5), "font-size": plat === "pc" ? 26 : 12, "font-weight": 700, fill: "#fff", "font-family": "Outfit,Arial,sans-serif" }, ex), ebg = el("rect", { x: D[0] + 14, y: D[1] + D[3] * .62, width: D[2] - 28, height: plat === "pc" ? 14 : 6, rx: 7, fill: "#444" }, ex), ebar = el("rect", { x: D[0] + 14, y: D[1] + D[3] * .62, width: 0, height: plat === "pc" ? 14 : 6, rx: 7, fill: "#31e8e0" }, ex);
    /* ---- colour sliders (Adjust panel), grade preview, keyframes, freeze, duplicate, toolbar, adjustment layer, preset ---- */
    var T = plat === "pc", FF = "Segoe UI,Outfit,Arial,sans-serif", AP = C.ap, SR = { pc: [["temp", "Temp"], ["tint", "Tint"], ["sat", "Saturation"], ["exp", "Exposure"], ["con", "Contrast"], ["hi", "Highlights"], ["sh", "Shadows"]], mob: [["exp", "Brightness"], ["con", "Contrast"], ["sat", "Saturation"], ["sharp", "Sharpen"], ["hi", "Highlight"], ["sh", "Shadow"], ["temp", "Temp"], ["tint", "Hue"]] }[plat];
    var defs = el("defs", {}, svg); [["gT", "#3b7bff", "#f5c542"], ["gN", "#3fc46a", "#e04fb7"], ["gS", "#7d7d7d", "#ff7a3c"]].forEach(function (g) { var lg = el("linearGradient", { id: g[0] + plat, x1: 0, x2: 1, y1: 0, y2: 0 }, defs); el("stop", { offset: 0, "stop-color": g[1] }, lg); el("stop", { offset: 1, "stop-color": g[2] }, lg); });
    var apG = el("g", { display: "none" }, svg), apRows = [], apIt = [], apTb = [];
    var tf = function (x, y, sz, fill, anchor, wt, par) { return el("text", { x: x, y: y, "font-size": sz, fill: fill, "text-anchor": anchor || "start", "font-weight": wt || 500, "font-family": FF }, par || apG); };
    if (T) {
      var bx0 = AP.box; el("rect", { x: bx0[0], y: bx0[1], width: bx0[2], height: bx0[3], rx: 10, fill: "rgb(38,38,38)" }, apG);
      AP.tabs.forEach(function (tb) { var t = tf(tb[1], 92, 20, tb[0] === "Adjust" ? "#25c8cf" : "#e8e8e8", "middle", 500); t.textContent = tb[0]; });
      el("rect", { x: 1370, y: 138, width: 520, height: 38, rx: 8, fill: "rgb(30,30,30)" }, apG); el("rect", { x: 1372, y: 140, width: 126, height: 34, rx: 7, fill: "rgb(62,62,62)" }, apG);
      [["Basic", 1435, "#fff"], ["HSL", 1565, "#c9c9c9"], ["Curves", 1695, "#c9c9c9"], ["Color wheels", 1825, "#c9c9c9"]].forEach(function (a) { var t = tf(a[1], 164, 18, a[2], "middle", 500); t.textContent = a[0]; });
      SR.forEach(function (r, k) {
        var ys = AP.y0 + k * AP.pitch + 30, lab = tf(AP.x0, ys - 22, 20, "#b8b8b8", "start", 500), gk = r[0] === "temp" ? "gT" : r[0] === "tint" ? "gN" : r[0] === "sat" ? "gS" : null;
        lab.textContent = r[1]; var trk = el("rect", { x: AP.x0, y: ys - 3, width: AP.x1 - AP.x0, height: 6, rx: 3, fill: gk ? "url(#" + gk + plat + ")" : "rgb(88,88,88)" }, apG), fl = el("rect", { y: ys - 3, height: 6, rx: 3, fill: "#e6e6e6", display: "none" }, apG), th = el("circle", { cy: ys, r: 9, fill: "#fff", stroke: "rgb(30,30,30)", "stroke-width": 2 }, apG);
        el("rect", { x: AP.bx, y: ys - 18, width: 82, height: 36, rx: 7, fill: "rgb(30,30,30)" }, apG); var vt = tf(AP.bx + 41, ys + 7, 20, "#e8e8e8", "middle", 500); vt.textContent = "0"; apRows.push({ k: r[0], lab: lab, fl: fl, th: th, vt: vt, ys: ys, grad: !!gk });
      });
      var sv = AP.save; el("rect", { x: sv[0], y: sv[1], width: sv[2], height: sv[3], rx: 8, fill: "none", stroke: "rgb(95,95,95)", "stroke-width": 2 }, apG); var svt = tf(sv[0] + sv[2] / 2, sv[1] + 25, 19, "#25c8cf", "middle", 600); svt.textContent = "Save preset";
    } else {
      var bm = AP.box; el("rect", { x: bm[0], y: bm[1], width: bm[2], height: bm[3], fill: "rgb(36,36,36)" }, apG);
      [["Presets", 37, "#9a9a9a"], ["Filters", 93, "#9a9a9a"], ["Adjust", 148, "#fff"]].forEach(function (a) { var t = tf(a[1], 462, 12.5, a[2], "middle", a[0] === "Adjust" ? 700 : 500); t.textContent = a[0]; });
      var itSvg = el("svg", { x: 0, y: 482, width: 320, height: 84, overflow: "hidden" }, apG);
      SR.forEach(function (r, k) { var g = el("g", {}, itSvg); var c = el("circle", { cy: 30, r: 17, fill: "rgb(52,52,52)", stroke: "none" }, g); var ic = el("text", { y: 36, "font-size": 15, fill: "#ddd", "text-anchor": "middle", "font-family": FF }, g); ic.textContent = ["☀", "◐", "◍", "△", "◑", "◒", "🌡", "◉"][k] === "🌡" ? "T" : ["☀", "◐", "◍", "△", "◑", "◒", "T", "◉"][k]; var lb = el("text", { y: 66, "font-size": 10.5, fill: "#bdbdbd", "text-anchor": "middle", "font-family": FF }, g); lb.textContent = r[1]; apIt.push({ k: r[0], g: g, c: c, ic: ic, lb: lb }); });
      el("line", { x1: AP.slider[0], x2: AP.slider[1], y1: AP.slider[2], y2: AP.slider[2], stroke: "rgb(95,95,95)", "stroke-width": 2.5, "stroke-linecap": "round" }, apG);
      var mf = el("line", { y1: AP.slider[2], y2: AP.slider[2], stroke: "rgb(52,222,214)", "stroke-width": 2.5, "stroke-linecap": "round" }, apG), mth = el("circle", { cy: AP.slider[2], r: 8, fill: "#fff" }, apG), mvt = tf(0, AP.slider[2] - 16, 11, "#fff", "middle", 600);
      el("path", { d: "M287 650l6 6 13-13", stroke: "#e8e8e8", "stroke-width": 2, fill: "none", "stroke-linecap": "round" }, apG); apRows.mob = { f: mf, th: mth, vt: mvt };
    }
    var pGr = (function () { var sv2 = el("svg", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], overflow: "hidden", preserveAspectRatio: "none", display: "none", viewBox: pr.join(" ") }, svg); var im2 = el("image", { href: urlOf(plat === "pc" ? "edit" : "filters"), width: W, height: H, preserveAspectRatio: "none" }, sv2); var tr = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#000", opacity: 0, "style": "mix-blend-mode:soft-light" }, sv2), tn = el("rect", { x: pr[0], y: pr[1], width: pr[2], height: pr[3], fill: "#000", opacity: 0, "style": "mix-blend-mode:soft-light" }, sv2); return { s: sv2, im: im2, t: tr, n: tn }; })();
    var kfG = el("g", { display: "none" }, gS), kfd = [el("path", { fill: "#25e0e8", stroke: "#fff", "stroke-width": plat === "pc" ? 1.6 : 1 }, kfG), el("path", { fill: "#25e0e8", stroke: "#fff", "stroke-width": plat === "pc" ? 1.6 : 1 }, kfG)];
    var kfP = el("g", { display: "none" }, svg), kfPd = el("path", { fill: "#25c8cf", stroke: "#25c8cf", "stroke-width": 1.5 }, kfP), ksr = el("rect", { fill: "rgb(38,38,38)" }, kfP), ktr = el("rect", { height: 5, rx: 2.5, fill: "rgb(88,88,88)" }, kfP), kfl = el("rect", { height: 5, rx: 2.5, fill: "#eee" }, kfP), kth = el("circle", { r: 8, fill: "#fff" }, kfP), kvb = el("rect", { fill: "rgb(30,30,30)" }, kfP), kvt = el("text", { "font-size": 20, fill: "#e8e8e8", "text-anchor": "middle", "font-family": FF }, kfP); kvt.textContent = "100%";
    var fzG = el("g", { display: "none" }, gS), fzS = el("svg", { overflow: "hidden", preserveAspectRatio: "none" }, fzG); el("image", { href: src, width: W, height: H, preserveAspectRatio: "none" }, fzS); var fzB = el("rect", { fill: "rgba(37,200,207,.22)", stroke: "#25c8cf", "stroke-width": plat === "pc" ? 3 : 1.5 }, fzG), fzT = el("text", { "font-size": plat === "pc" ? 18 : 9, "font-weight": 800, fill: "#fff", "font-family": FF }, fzG); fzT.textContent = "❄ 3s";
    var adG = el("g", { display: "none" }, gS), adR = el("rect", { rx: plat === "pc" ? 8 : 4, fill: "rgba(139,92,246,.88)", stroke: "#fff", "stroke-width": plat === "pc" ? 2 : 1 }, adG), adT = el("text", { "font-size": plat === "pc" ? 20 : 10, "font-weight": 700, fill: "#fff", "font-family": FF }, adG); adT.textContent = "Adjustment layer";
    var tbG = el("g", { display: "none" }, svg); if (!T) { el("rect", { x: 0, y: 604, width: 320, height: 66, fill: "rgb(12,12,12)" }, tbG); var tbSv = el("svg", { x: 34, y: 604, width: 286, height: 66, overflow: "hidden" }, tbG); var TBN = ["Split", "Speed", "Animations", "Style", "Delete", "Enhance", "Duplicate", "Replace", "Freeze", "Crop"]; TBN.forEach(function (n, k) { var g = el("g", {}, tbSv), r1 = el("rect", { x: -9, y: 12, width: 18, height: 18, rx: 4, fill: "none", stroke: "#e8e8e8", "stroke-width": 1.6 }, g); if (n === "Duplicate") el("rect", { x: -5, y: 16, width: 18, height: 18, rx: 4, fill: "rgb(12,12,12)", stroke: "#e8e8e8", "stroke-width": 1.6 }, g); if (n === "Freeze") el("path", { d: "M0 10v22M-10 21h20M-7 14l14 14M7 14l-14 14", stroke: "#e8e8e8", "stroke-width": 1.4, fill: "none" }, g); var lb = el("text", { y: 48, "font-size": 10, fill: "#e8e8e8", "text-anchor": "middle", "font-family": FF }, g); lb.textContent = n; apTb.push(g); }); el("path", { d: "M17 640l-6-8 6-8", stroke: "#e8e8e8", "stroke-width": 2, fill: "none", "stroke-linecap": "round" }, tbG); }
    var psG = el("g", { display: "none" }, svg), psR = el("rect", { x: 1392, y: 300, width: 476, height: 190, rx: 12, fill: "rgb(52,52,52)", stroke: "rgb(96,96,96)", "stroke-width": 2 }, psG), psT = el("text", { x: 1420, y: 346, "font-size": 22, "font-weight": 700, fill: "#fff", "font-family": FF }, psG), psI = el("rect", { x: 1420, y: 372, width: 420, height: 44, rx: 8, fill: "rgb(30,30,30)", stroke: "#25c8cf", "stroke-width": 2 }, psG), psN = el("text", { x: 1436, y: 402, "font-size": 21, fill: "#fff", "font-family": FF }, psG), psB = el("rect", { x: 1740, y: 432, width: 100, height: 40, rx: 8, fill: "#25c8cf" }, psG), psBt = el("text", { x: 1790, y: 459, "font-size": 20, "font-weight": 700, fill: "#06292b", "text-anchor": "middle", "font-family": FF }, psG); psT.textContent = "Save as preset"; psBt.textContent = "Save";
    var tsG = el("g", { display: "none" }, svg), tsR = el("rect", { x: pr[0] + pr[2] * .5 - (T ? 150 : 74), y: pr[1] + pr[3] * .45, width: T ? 300 : 148, height: T ? 48 : 24, rx: T ? 24 : 12, fill: "rgba(0,0,0,.78)" }, tsG), tsT = el("text", { x: pr[0] + pr[2] * .5, y: pr[1] + pr[3] * .45 + (T ? 32 : 16), "font-size": T ? 21 : 10.5, fill: "#fff", "text-anchor": "middle", "font-weight": 700, "font-family": FF }, tsG); tsT.textContent = "✔ Preset saved";
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
      phl.setAttribute("x", (S.ph != null ? S.ph : C.PH) - 1.5);
      var show = S.touched; mask.setAttribute("display", show ? "" : "none"); phl.setAttribute("display", show ? "" : "none");
      var phMoved = show && S.ph != null && Math.abs(S.ph - C.PH) > 5; phCv.setAttribute("display", phMoved ? "" : "none"); phHd.setAttribute("display", phMoved ? "" : "none");
      if (phMoved) { var pY = C.phY; phCv.setAttribute("x", C.PH - C.phW); phCv.setAttribute("width", C.phW * 2); phCv.setAttribute("y", pY[0]); phCv.setAttribute("height", pY[1] - pY[0]); phl.setAttribute("y", pY[0] + (plat === "pc" ? 14 : 4)); phl.setAttribute("height", pY[1] - pY[0] - (plat === "pc" ? 14 : 4)); phHd.setAttribute("x", S.ph - (plat === "pc" ? 7 : 3.5)); phHd.setAttribute("y", pY[0]); }
      else { phl.setAttribute("y", strip.y - 2); phl.setAttribute("height", strip.h + 4); }
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
      /* b-roll on the upper track / picture-in-picture */
      if (S.over > 0) { var Ov = C.over, q1 = S.over, mx = C.ovFrom, ox0 = mx[0], oy0 = mx[1], ox1 = Ov[0], oy1 = Ov[1], ow0 = mx[2] * .8, oh0 = mx[3] * .55, ox = ox0 + (ox1 - ox0) * q1, oy = oy0 + (oy1 - oy0) * q1, ow = ow0 + (Ov[2] - ow0) * q1, oh = oh0 + (Ov[3] - oh0) * q1; ovG.setAttribute("display", ""); ovS.setAttribute("x", ox); ovS.setAttribute("y", oy); ovS.setAttribute("width", ow); ovS.setAttribute("height", oh); ovS.setAttribute("viewBox", strip.x + " " + strip.y + " " + strip.w * .5 + " " + strip.h); ovB.setAttribute("x", ox); ovB.setAttribute("y", oy); ovB.setAttribute("width", ow); ovB.setAttribute("height", oh); ovT.setAttribute("x", ox + 8); ovT.setAttribute("y", oy + (plat === "pc" ? 24 : 12)); ovT.setAttribute("display", q1 > .95 ? "" : "none"); } else ovG.setAttribute("display", "none");
      if (S.pip > 0) { var pq = S.pip, pw = pr[2] * (1 - .62 * pq), ph = pr[3] * (1 - .62 * pq), px = pr[0] + (pr[2] * .96 - pw) * pq + (1 - pq) * 0, py = pr[1] + (pr[3] * .94 - ph) * pq; pipG.setAttribute("display", ""); pipS.setAttribute("x", px); pipS.setAttribute("y", py); pipS.setAttribute("width", pw); pipS.setAttribute("height", ph); pipS.setAttribute("viewBox", pr.join(" ")); pipB.setAttribute("x", px); pipB.setAttribute("y", py); pipB.setAttribute("width", pw); pipB.setAttribute("height", ph); } else pipG.setAttribute("display", "none");
      /* the player */
      var sc = (1 + .35 * S.zoom) * (S.jump ? 1.22 : 1), dx = 0, dy = 0;
      if (S.shake > 0 && S.shake < 1) { var a = 1 - S.shake; dx = Math.sin(S.shake * 90) * (mobil ? 5 : 22) * a; dy = Math.cos(S.shake * 70) * (mobil ? 3 : 14) * a; }
      dy += S.mv * (mobil ? 7 : 30);
      var pimg = urlOf(mobil && (fn === "filters" || fn === "tools2") ? fn : "edit"); if (pBase.__im.getAttribute("href") !== pimg) { pBase.__im.setAttribute("href", pimg); pFilt.__im.setAttribute("href", pimg); }
      var playerOn = S.mv > 0 || S.zoom > 0 || S.jump || S.flt > 0 || (S.shake > 0 && S.shake < 1);
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
      /* beat markers, keyboard key pill */
      mkG.setAttribute("display", S.mk > 0 && ovOn ? "" : "none");
      if (S.mk > 0) { var nmk = Math.min(6, Math.floor(S.mk * 6.4)), mw = plat === "pc" ? 14 : 8, my = strip.y - (plat === "pc" ? 26 : 12); mks.forEach(function (pth, q) { if (q >= nmk) { pth.setAttribute("display", "none"); return; } var mxk = strip.x + strip.w * (q + 1) / 7; pth.setAttribute("display", ""); pth.setAttribute("d", "M" + (mxk - mw / 2) + " " + my + "h" + mw + "v" + mw * .8 + "l-" + mw / 2 + " " + mw * .6 + "l-" + mw / 2 + " -" + mw * .6 + "z"); }); }
      var kon = S.kbd > .05; kbG.setAttribute("display", kon ? "" : "none");
      if (kon) { var ktx = S.kbdT || "", kw = Math.max(C.fs * 1.6, ktx.length * C.fs * .72 + C.fs), kh = C.fs * 1.7, kx = pr[0] + pr[2] / 2, ky = pr[1] + pr[3] * .42; kbR.setAttribute("x", kx - kw / 2); kbR.setAttribute("y", ky - kh / 2); kbR.setAttribute("width", kw); kbR.setAttribute("height", kh); kbT.setAttribute("x", kx); kbT.setAttribute("y", ky + C.fs * .36); kbT.textContent = ktx; kbG.setAttribute("opacity", Math.min(1, S.kbd)); }
      /* the export settings: resolution changes to 1080p */
      var xon = S.xres > 0 && (fn === "dialog" || fn === "export"); xg.setAttribute("display", xon ? "" : "none");
      if (xon) {
        if (plat === "pc") { var xp = C.xpatch, xt = C.xtxt; xpr.setAttribute("x", xp[0]); xpr.setAttribute("y", xp[1]); xpr.setAttribute("width", xp[2]); xpr.setAttribute("height", xp[3]); xtx.setAttribute("x", xt[0]); xtx.setAttribute("y", xt[1]); xtx.setAttribute("opacity", S.xres); xpr.setAttribute("opacity", S.xres > .5 ? 1 : S.xres * 2); xtr.setAttribute("display", "none"); xtg.setAttribute("display", "none"); xkn.setAttribute("display", "none"); }
        else { var kx = C.xk.x0 + (C.xk.x1 - C.xk.x0) * S.xres, ky = C.xk.y; xpr.setAttribute("x", 12); xpr.setAttribute("y", ky - 12); xpr.setAttribute("width", 296); xpr.setAttribute("height", 24); xtx.setAttribute("display", "none"); xtg.setAttribute("x1", 18); xtg.setAttribute("x2", 300); xtg.setAttribute("y1", ky); xtg.setAttribute("y2", ky); xtr.setAttribute("x1", 18); xtr.setAttribute("x2", kx); xtr.setAttribute("y1", ky); xtr.setAttribute("y2", ky); xkn.setAttribute("cx", kx); xkn.setAttribute("cy", ky); xkn.setAttribute("r", 7); xkn.setAttribute("display", ""); xtr.setAttribute("display", ""); xtg.setAttribute("display", ""); }
      }
      /* ---- colour sliders / grade preview ---- */
      var gAny = false, gv = S.adjV || {}; for (var gk2 in gv) if (Math.abs(gv[gk2]) > .01) gAny = true;
      var apOn = S.adjOn && (T ? fn === "edit" : fn === "filters"); apG.setAttribute("display", apOn ? "" : "none");
      if (apOn) {
        if (T) { apRows.forEach(function (r) { var v = gv[r.k] || 0, x0a = AP.x0, x1a = AP.x1, cxm = (x0a + x1a) / 2, txp = x0a + (x1a - x0a) * (.5 + v * .5); r.th.setAttribute("cx", txp); r.vt.textContent = Math.round(v * 100); r.lab.setAttribute("fill", r.k === S.adjCur ? "#fff" : "#b8b8b8"); r.th.setAttribute("r", r.k === S.adjCur ? 10 : 8); if (r.grad) r.fl.setAttribute("display", "none"); else { r.fl.setAttribute("display", ""); r.fl.setAttribute("x", Math.min(cxm, txp)); r.fl.setAttribute("width", Math.abs(txp - cxm)); } }); }
        else {
          var curI = Math.max(0, SR.findIndex(function (r) { return r[0] === S.adjCur; })), scr = Math.max(0, Math.min(curI * 66 - 110, SR.length * 66 - 290)), cv = gv[S.adjCur] || 0, sx0 = AP.slider[0], sx1 = AP.slider[1], sxm = (sx0 + sx1) / 2, sxp = sx0 + (sx1 - sx0) * (.5 + cv * .5);
          apIt.forEach(function (it, k) { it.g.setAttribute("transform", "translate(" + (AP.items[0] + k * AP.items[1] - scr) + ",0)"); var on = it.k === S.adjCur; it.c.setAttribute("fill", on ? "rgb(40,150,150)" : "rgb(52,52,52)"); it.c.setAttribute("stroke", on ? "#31e8e0" : "none"); it.lb.setAttribute("fill", on ? "#fff" : "#bdbdbd"); });
          var mR = apRows.mob; mR.f.setAttribute("x1", sxm); mR.f.setAttribute("x2", sxp); mR.th.setAttribute("cx", sxp); mR.vt.setAttribute("x", sxp); mR.vt.textContent = Math.round(cv * 100);
        }
      }
      var gOn = gAny && ((T && (fn === "edit" || fn === "dialog")) || (!T && fn === "filters")) && S.adjOn; pGr.s.setAttribute("display", gOn && !(T && fn === "dialog") ? "" : "none");
      if (gOn) { var gt = gv.temp || 0, gn = gv.tint || 0, ge = gv.exp || 0, gc = gv.con || 0, gs = gv.sat || 0, gh = gv.hi || 0, gsh = gv.sh || 0; pGr.im.style.filter = (S.flt > 0 ? "sepia(.55) saturate(1.9) contrast(1.15) hue-rotate(-14deg) brightness(1.04) " : "") + "saturate(" + (1 + gs * 1.1).toFixed(2) + ") contrast(" + (1 + gc * .45 + (gh < 0 ? -gh * .1 : 0)).toFixed(2) + ") brightness(" + (1 + ge * .35 + gsh * .12).toFixed(2) + ")"; pGr.t.setAttribute("fill", gt < 0 ? "rgb(40,110,255)" : "rgb(255,170,30)"); pGr.t.setAttribute("opacity", Math.min(1, Math.abs(gt) * 1.5)); pGr.n.setAttribute("fill", gn < 0 ? "rgb(30,200,90)" : "rgb(230,60,190)"); pGr.n.setAttribute("opacity", Math.min(1, Math.abs(gn) * 1.2)); }
      /* ---- keyframes ---- */
      var kfOn = (S.kf1 || S.kf2) && ovOn; kfG.setAttribute("display", kfOn ? "" : "none");
      if (kfOn) { var dsz = T ? 9 : 5, dy2 = strip.y + strip.h - (T ? 14 : 8); [[C.PH, S.kf1], [S.kfX2 || C.PH, S.kf2]].forEach(function (a, k) { kfd[k].setAttribute("display", a[1] ? "" : "none"); kfd[k].setAttribute("d", "M" + a[0] + " " + (dy2 - dsz) + "l" + dsz + " " + dsz + "l-" + dsz + " " + dsz + "l-" + dsz + " -" + dsz + "z"); }); }
      var kpOn = T && (S.kf1 || S.kfS > 0) && fn === "edit" && !apOn; kfP.setAttribute("display", kpOn ? "" : "none");
      if (kpOn) { var scc = AP.sc, tx2 = scc.a + (scc.b - scc.a) * S.kfS; kfPd.setAttribute("d", "M1863 296l11 12l-11 12l-11 -12z"); kfPd.setAttribute("fill", S.kf1 ? "#25c8cf" : "none"); ksr.setAttribute("x", 1366); ksr.setAttribute("y", 294); ksr.setAttribute("width", 356); ksr.setAttribute("height", 30); ktr.setAttribute("x", scc.x0); ktr.setAttribute("y", scc.y - 2.5); ktr.setAttribute("width", scc.x1 - scc.x0); kfl.setAttribute("x", scc.x0); kfl.setAttribute("y", scc.y - 2.5); kfl.setAttribute("width", tx2 - scc.x0); kth.setAttribute("cx", tx2); kth.setAttribute("cy", scc.y); kvb.setAttribute("x", 1731); kvb.setAttribute("y", 296); kvb.setAttribute("width", 72); kvb.setAttribute("height", 26); kvt.setAttribute("x", 1767); kvt.setAttribute("y", 316); kvt.textContent = Math.round(100 + 30 * S.kfS) + "%"; ksr.setAttribute("display", S.kfS > 0 ? "" : "none"); ktr.setAttribute("display", S.kfS > 0 ? "" : "none"); kfl.setAttribute("display", S.kfS > 0 ? "" : "none"); kth.setAttribute("display", S.kfS > 0 ? "" : "none"); kvb.setAttribute("display", S.kfS > 0 ? "" : "none"); kvt.setAttribute("display", S.kfS > 0 ? "" : "none"); }
      /* ---- freeze, adjustment layer, toolbar, preset ---- */
      var fzOn = S.fzW > 2 && ovOn; fzG.setAttribute("display", fzOn ? "" : "none");
      if (fzOn) { fzS.setAttribute("x", S.fzX); fzS.setAttribute("y", strip.y); fzS.setAttribute("width", S.fzW); fzS.setAttribute("height", strip.h); fzS.setAttribute("viewBox", (C.PH - 20) + " " + strip.y + " 40 " + strip.h); fzB.setAttribute("x", S.fzX + 1); fzB.setAttribute("y", strip.y + 1); fzB.setAttribute("width", Math.max(1, S.fzW - 2)); fzB.setAttribute("height", strip.h - 2); fzT.setAttribute("x", S.fzX + 6); fzT.setAttribute("y", strip.y + (T ? 24 : 12)); fzT.setAttribute("display", S.fzW > (T ? 90 : 36) ? "" : "none"); }
      var alOn = S.adjl > 0 && ovOn; adG.setAttribute("display", alOn ? "" : "none");
      if (alOn) { var ab = [C.over[0], C.over[1], C.strip.w - 24, C.over[3] * (T ? .75 : .8)]; adR.setAttribute("x", ab[0]); adR.setAttribute("y", ab[1]); adR.setAttribute("width", Math.max(1, ab[2] * S.adjl)); adR.setAttribute("height", ab[3]); adT.setAttribute("x", ab[0] + 12); adT.setAttribute("y", ab[1] + ab[3] * .62); adT.setAttribute("display", S.adjl > .6 ? "" : "none"); }
      var tbOn = !T && S.tb > 0 && fn === "clip"; tbG.setAttribute("display", tbOn ? "" : "none");
      if (tbOn) { var tsc = S.tb * 49 * 4.6; apTb.forEach(function (g, k) { g.setAttribute("transform", "translate(" + (31 + k * 49 - tsc) + ",0)"); }); }
      var pOn = T && S.pst > 0 && S.toast < 1 && fn === "edit"; psG.setAttribute("display", pOn ? "" : "none");
      if (pOn) { var nm0 = "My Brand Look"; psN.textContent = nm0.slice(0, Math.max(0, Math.round(cl((S.pst - .1) / .65, 0, 1) * nm0.length))); }
      var tsOn = S.toast > 0 && (T ? fn === "edit" : fn === "filters"); tsG.setAttribute("display", tsOn ? "" : "none");
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

/* CapCut lessons use REAL CapCut screenshots (PC + mobile) — CapCut's own official help-centre pictures with the tutorial markings removed.
   A lesson step is { ui: "desk" | "phone", hl: [zones], btn: "Button name", steps: [{en,ur,hi}], tab, sub, alt: {same fields for the other device} }.
   We pick the right real screenshot from the words in the step, find the real button on it, and (see livesync.js) a teacher-style cursor glides to it and clicks while the voice speaks. */
(function () {
  "use strict";
  var oldUI = uiHTML, BASE = "cc/", IV = "?v=1";
  var L = function (en, ur, hi) { return { en: en, ur: ur, hi: hi }; };

  /* ---------- zones the lessons talk about (x,y,w,h in screenshot pixels) ---------- */
  var PZ = { top: [0, 0, 1919, 52], export: [1640, 8, 106, 46], media: [14, 118, 654, 612], player: [678, 55, 662, 675], props: [1352, 55, 553, 675], toolbar: [14, 740, 1891, 46], timeline: [14, 790, 1891, 289] };
  var MZ = { top: [0, 30, 320, 60], export: [264, 38, 42, 42], player: [0, 120, 320, 250], timeline: [0, 385, 320, 160], toolbar: [0, 598, 320, 86] };
  var ZN = {
    media: L("Media panel", "میڈیا پینل", "मीडिया पैनल"), player: L("Player", "پلیئر", "प्लेयर"), props: L("Settings panel", "سیٹنگز پینل", "सेटिंग्स पैनल"),
    toolbar: L("Tools", "ٹولز", "टूल्स"), timeline: L("Timeline", "ٹائم لائن", "टाइमलाइन"), export: L("Export", "ایکسپورٹ", "एक्सपोर्ट"), top: L("Top bar", "اوپر کی پٹی", "ऊपर की पट्टी")
  };
  var TABN = { pc: L("💻 PC / Laptop", "💻 پی سی / لیپ ٹاپ", "💻 पीसी / लैपटॉप"), mob: L("📱 Mobile", "📱 موبائل", "📱 मोबाइल") };
  var CAP = { pc: "CapCut · PC", mob: "CapCut · Mobile" };
  var T = function (o) { return esc(pick(o)); };

  /* ---------- real buttons on each real screenshot ---------- */
  var PCC = { /* the same on every PC screenshot */
    menu: [114, 8, 86, 40], share: [1538, 8, 94, 40], export: [1640, 8, 106, 46], title: [830, 12, 100, 28],
    media: [22, 58, 56, 56], audio: [92, 58, 62, 56], text: [164, 58, 64, 56], stickers: [236, 58, 68, 56], effects: [312, 58, 64, 56], transitions: [382, 58, 86, 56], captions: [474, 58, 70, 56], filters: [552, 58, 64, 56],
    play: [992, 678, 34, 36], ratio: [1236, 682, 50, 28], full: [1296, 678, 44, 36],
    ptab_video: [1362, 64, 64, 42], ptab_speed: [1446, 64, 74, 42], ptab_anim: [1540, 64, 104, 42], ptab_adjust: [1668, 64, 68, 42], ptab_ai: [1760, 64, 96, 42],
    select: [20, 745, 52, 36], undo: [112, 745, 34, 34], redo: [166, 745, 34, 34], split: [220, 745, 34, 34], delete: [382, 745, 34, 34], crop: [490, 745, 34, 34], mic: [1244, 745, 34, 34], snap: [1318, 745, 34, 34], zoom: [1700, 750, 160, 26]
  };
  var PCS = {
    import: { src: "pc-import", W: 1919, H: 1079, hs: { side_import: [26, 138, 160, 36], side_media: [26, 186, 160, 36], dropzone: [210, 135, 444, 400], importbtn: [380, 288, 150, 52], aibtns: [235, 600, 360, 80], timelinedrop: [14, 830, 1891, 200] } },
    edit: { src: "pc-edit", W: 1919, H: 1079, hs: { videotab: [1362, 64, 64, 42], basic: [1368, 138, 130, 34], transform: [1368, 210, 520, 28], scale: [1368, 262, 520, 60], uniform: [1368, 346, 520, 38], position: [1368, 400, 520, 46], rotate: [1368, 458, 520, 46], align: [1368, 516, 444, 44], blend: [1368, 598, 520, 40], clip: [270, 905, 545, 112], playhead: [430, 788, 40, 262], filtersgrid: [206, 184, 452, 544] } },
    reframe: { src: "pc-reframe", W: 1919, H: 1079, hs: { autoreframe: [1368, 208, 300, 42], aspect: [1368, 262, 520, 44], stabilize: [1368, 320, 520, 44], moving: [1368, 376, 520, 70], apply: [1770, 478, 120, 38], flicker: [1368, 560, 320, 36], clip: [270, 905, 545, 112], filtersgrid: [206, 184, 452, 544] } },
    trans: { src: "pc-trans", W: 1919, H: 1079, hs: { grid: [206, 184, 452, 544], cats: [26, 138, 166, 590], search: [212, 134, 376, 36], clip: [270, 905, 545, 112], style: [1368, 130, 520, 360] } },
    text: { src: "pc-text", W: 1919, H: 1079, hs: { autocap: [26, 138, 160, 36], language: [208, 172, 440, 36], bilingual: [208, 240, 440, 72], generate: [530, 680, 128, 38], textbox: [1368, 130, 520, 110], font: [1368, 495, 520, 40], textclip: [370, 880, 250, 34], clip: [270, 905, 545, 112] } },
    audio: { src: "pc-audio", W: 1919, H: 1079, hs: { side_import: [26, 138, 160, 36], search: [212, 134, 376, 36], musiclist: [210, 190, 446, 530], addsong: [610, 388, 40, 40], voicetab: [1446, 62, 130, 44], voicefilters: [1368, 130, 520, 460], pitch: [1368, 598, 520, 52], timbre: [1368, 662, 520, 52], audioclip: [270, 978, 552, 70], clip: [270, 858, 540, 110] } },
    dialog: { src: "pc-export", W: 1919, H: 1079, hs: { name: [958, 193, 520, 38], path: [958, 248, 520, 38], resolution: [958, 388, 498, 38], bitrate: [958, 445, 498, 38], codec: [958, 502, 498, 38], format: [958, 559, 498, 38], fps: [958, 616, 498, 38], exportbtn: [1246, 898, 112, 44], cancel: [1366, 898, 112, 44], cover: [444, 195, 480, 270], size: [444, 902, 330, 36] } }
  };
  var MS = {
    home: { src: "m-home", hs: { newproject: [13, 160, 295, 96], projects: [13, 275, 300, 44], tools: [13, 80, 295, 72], edit: [10, 620, 60, 54] } },
    edit: { src: "m-edit", hs: { tool_edit: [4, 606, 46, 58], tool_audio: [51, 606, 46, 58], tool_text: [99, 606, 46, 58], tool_overlay: [147, 606, 46, 58], tool_effects: [194, 606, 46, 58], tool_captions: [242, 606, 46, 58], exportarrow: [266, 40, 40, 40], res: [196, 44, 66, 30], close: [8, 42, 34, 34], play: [142, 350, 36, 36], plus: [284, 450, 36, 36], clip: [0, 448, 320, 44] } },
    clip: { src: "m-clip", hs: { split: [42, 606, 48, 58], speed: [90, 606, 48, 58], animations: [139, 606, 48, 58], style: [188, 606, 48, 58], delete: [236, 606, 48, 58], back: [4, 610, 30, 56], clip: [0, 448, 320, 44], exportarrow: [266, 40, 40, 40] } },
    tools2: { src: "m-tools2", hs: { overlay: [0, 606, 44, 58], effects: [47, 606, 44, 58], captions: [94, 606, 44, 58], aspect: [141, 606, 52, 58], filters: [195, 606, 44, 58], adjust: [243, 606, 44, 58], sticker: [288, 606, 32, 58], addaudio: [150, 497, 104, 26], plus: [284, 450, 36, 36], cover: [96, 448, 44, 36] } },
    audio: { src: "m-audio", hs: { split: [47, 606, 48, 58], fade: [94, 606, 48, 58], volume: [143, 606, 48, 58], voicefx: [194, 606, 50, 58], delete: [248, 606, 48, 58], back: [4, 610, 30, 56], audiotrack: [0, 470, 320, 40], clip: [0, 420, 320, 46] } },
    filters: { src: "m-filters", hs: { ftab_presets: [14, 444, 46, 26], ftab_filters: [72, 444, 46, 26], ftab_adjust: [128, 444, 46, 26], fcats: [10, 484, 300, 28], fthumbs: [8, 516, 310, 76], fslider: [60, 598, 250, 32], fcheck: [284, 634, 36, 36] } },
    sound: { src: "m-sound", hs: { search: [15, 82, 298, 30], tiles: [14, 122, 300, 245], list: [14, 452, 300, 230], close: [8, 42, 34, 34] } },
    export: { src: "m-export", hs: { exportarrow: [266, 40, 40, 40], res: [10, 92, 300, 60], fps: [10, 174, 300, 60], bitrate: [10, 257, 300, 60], hdr: [10, 342, 300, 40] } }
  };

  /* ---------- words in a lesson step → the real button ---------- */
  var KWP = [ /* PC */
    [/export|render|save the video|download/, "export"], [/split|cut|trim|razor/, "split"], [/delete|remove clip|trash/, "delete"], [/undo/, "undo"], [/crop/, "crop"], [/record|voice ?over|mic/, "mic"], [/magnet|snap/, "snap"],
    [/import/, "side_import"], [/sticker/, "stickers"], [/transition/, "transitions"], [/caption|subtitle|auto ?cap/, "captions"], [/effect/, "effects"], [/filter|colou?r|grade/, "filters"], [/\btext\b|title|font/, "text"],
    [/audio|music|sound|song|voice/, "audio"], [/media|library|stock/, "media"], [/speed/, "ptab_speed"], [/anim/, "ptab_anim"], [/adjust/, "ptab_adjust"], [/scale|resize|zoom in/, "scale"], [/position|move/, "position"], [/rotate/, "rotate"], [/blend|opacity/, "blend"],
    [/play|preview/, "play"], [/ratio|9:16|16:9|aspect/, "ratio"], [/timeline|clip|track/, "clip"], [/project|menu/, "menu"]
  ];
  var KWM = [ /* mobile */
    [/export|save|upload|share|1080|resolution|quality/, "exportarrow"], [/new project|start|create/, "newproject"], [/split|cut|trim/, "split"], [/speed/, "speed"], [/anim/, "animations"], [/style/, "style"], [/delete|remove/, "delete"], [/fade/, "fade"], [/volume/, "volume"], [/voice ?(fx|effect|chang)/, "voicefx"],
    [/overlay|pip|picture/, "tool_overlay"], [/effect/, "tool_effects"], [/caption|subtitle/, "tool_captions"], [/aspect|ratio|9:16|16:9/, "aspect"], [/filter/, "filters"], [/adjust|colou?r/, "adjust"], [/sticker/, "sticker"], [/\btext\b|title|font/, "tool_text"],
    [/audio|music|sound|song/, "tool_audio"], [/edit/, "tool_edit"], [/add (clip|video|media)|plus|\+/, "plus"], [/play|preview/, "play"]
  ];
  var FOLLOW = { /* after you press it, what opens */
    pc: {
      export: [{ s: "dialog", hs: ["resolution", "format", "fps", "exportbtn"], l: [L("Resolution", "ریزولوشن", "रिज़ॉल्यूशन"), L("Format", "فارمیٹ", "फ़ॉर्मेट"), L("Frame rate", "فریم ریٹ", "फ़्रेम रेट"), L("Export", "ایکسپورٹ", "एक्सपोर्ट")] }]
    },
    mob: {
      exportarrow: [{ s: "export", hs: ["res", "fps", "bitrate"], l: [L("Resolution", "ریزولوشن", "रिज़ॉल्यूशन"), L("Frame rate", "فریم ریٹ", "फ़्रेम रेट"), L("Bitrate", "بٹ ریٹ", "बिटरेट")] }],
      filters: [{ s: "filters", hs: ["fcats", "fthumbs", "fslider", "fcheck"], l: [L("Categories", "کیٹیگریز", "कैटेगरी"), L("Pick a filter", "فلٹر چنیں", "फ़िल्टर चुनें"), L("Strength", "شدت", "तीव्रता"), L("Confirm", "تصدیق", "कन्फ़र्म")] }],
      adjust: [{ s: "filters", hs: ["ftab_adjust", "fslider", "fcheck"], l: [L("Adjust", "ایڈجسٹ", "एडजस्ट"), L("Strength", "شدت", "तीव्रता"), L("Confirm", "تصدیق", "कन्फ़र्म")] }],
      tool_audio: [{ s: "sound", hs: ["search", "tiles", "list"], l: [L("Search sounds", "آواز تلاش کریں", "साउंड खोजें"), L("Sound types", "آواز کی اقسام", "साउंड के प्रकार"), L("Recommended", "تجویز کردہ", "सुझाए गए")] }]
    }
  };

  /* ---------- pick the real screenshot ---------- */
  function words(d) { return ((d.btn || "") + " " + (d.tab || "") + " " + (d.sub || "")).toLowerCase(); }
  function pcBase(d, hl) {
    var w = words(d), z = hl[0] || "";
    if (/caption|subtitle|\btext\b|title|font/.test(w)) return "text";
    if (/audio|music|sound|voice|song/.test(w)) return "audio";
    if (/transition/.test(w)) return "trans";
    if (/filter|colou?r|grade|effect|adjust|reframe|stabil/.test(w)) return /reframe|stabil|ratio/.test(w) ? "reframe" : "edit";
    if (/import|new project|start|open capcut|media|library/.test(w) || z === "media") return "import";
    return "edit";
  }
  function mobBase(d, hl) {
    var w = words(d), s = (d.sub || "").toLowerCase();
    if (/new project|home|open capcut|start/.test(w)) return "home";
    if (s === "audio" || /volume|fade|voice ?(fx|effect|chang)|audio track/.test(w)) return "audio";
    if (/overlay|effect|aspect|ratio|sticker|filter|adjust/.test(w)) return "tools2";
    if (s === "edit" || /split|speed|anim|style|delete|duplicate|crop|trim|freeze|reverse/.test(w)) return "clip";
    return "edit";
  }

  /* ---------- one pane: frames (real screenshots) + rings (what to look at / click, in speech order) ---------- */
  function buildPane(plat, d) {
    var isPC = plat === "pc", SC = isPC ? PCS : MS, Z = isPC ? PZ : MZ, KW = isPC ? KWP : KWM, hl = [].concat(d.hl || []);
    var base = isPC ? pcBase(d, hl) : mobBase(d, hl), frames = [base], rings = [], w = words(d) + " " + hl.join(" "), btnHs = null, btnFrame = 0;
    function hsOf(sc, name) { var s = SC[sc]; if (!s) return null; if (s.hs[name]) return s.hs[name]; return isPC && PCC[name] ? PCC[name] : null; }
    function add(z, f, l) { rings.push({ z: z, f: f, l: l }); }
    for (var i = 0; i < KW.length; i++) { if (KW[i][0].test(w)) { var h = hsOf(base, KW[i][1]); if (h) { btnHs = KW[i][1]; break; } } }
    hl.forEach(function (k) { if (Z[k]) add(Z[k], 0, pick(ZN[k])); });
    if (btnHs) {
      var bz = hsOf(base, btnHs), lab = d.btn || btnHs, cx = bz[0] + bz[2] / 2, cy = bz[1] + bz[3] / 2;
      if (rings.length > 1) { var last = rings[rings.length - 1].z; if (cx > last[0] && cx < last[0] + last[2] && cy > last[1] && cy < last[1] + last[3]) rings.pop(); }
      add(bz, 0, lab);
      var fo = (FOLLOW[plat] || {})[btnHs];
      if (fo) fo.forEach(function (o) { var fi = frames.indexOf(o.s); if (fi < 0) { frames.push(o.s); fi = frames.length - 1; } o.hs.forEach(function (n, j) { var hz = hsOf(o.s, n); if (hz) add(hz, fi, pick(o.l[j])); }); });
    }
    if (!rings.length) add(isPC ? PZ.player : MZ.player, 0, "");
    return { base: base, frames: frames, rings: rings, btn: d.btn || "", W: isPC ? 1919 : 320, H: isPC ? 1079 : 698 };
  }
  function pct(v, t) { return (v / t * 100).toFixed(3) + "%"; }
  function pane(plat, d) {
    var P = buildPane(plat, d), SC = plat === "pc" ? PCS : MS, i;
    var imgs = P.frames.map(function (f, k) { return '<img class="uimg' + (k === 0 ? " on" : "") + '" data-f="' + k + '" src="' + BASE + SC[f].src + ".webp" + IV + '" alt="" decoding="async"' + (k ? ' loading="lazy"' : "") + ">"; }).join("");
    var rings = P.rings.map(function (r) {
      var z = r.z; return '<i class="uhl' + (r.f ? "" : " f0") + '" data-z="' + z.join(",") + '" data-f="' + r.f + '" data-l="' + esc(r.l || "") + '" style="left:' + pct(z[0], P.W) + ";top:" + pct(z[1], P.H) + ";width:" + pct(z[2], P.W) + ";height:" + pct(z[3], P.H) + '"></i>';
    }).join("");
    var cur = '<b class="ucur" style="left:0;top:0"><svg viewBox="0 0 40 44"><g transform="translate(8 8)"><circle class="uclick" cx="0" cy="0" r="9"/><path d="M0 0v18.5l4.6-4.3 3.4 7.9 3.4-1.5-3.3-7.7H14.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></g></svg></b>';
    var tip = P.btn ? '<div class="uclk on" data-i="👆 ' + esc(P.btn) + '">👆 ' + esc(P.btn) + "</div>" : '<div class="uclk"></div>';
    var steps = d.steps && d.steps.length ? '<ol class="usteps">' + d.steps.map(function (s) { return "<li>" + T(s) + "</li>"; }).join("") + "</ol>" : "";
    var where = (d.hl || []).filter(function (k) { return ZN[k]; }).map(function (k) { return T(ZN[k]); }).join(" · ");
    return '<div class="upane" data-p="' + plat + '" data-c="' + plat + '"><div class="uscr ' + plat + '" style="aspect-ratio:' + P.W + "/" + P.H + '" role="img" aria-label="' + CAP[plat] + '"><div class="uzoom" data-w="' + P.W + '" data-h="' + P.H + '">' + imgs + rings + cur + "</div>" + tip + "</div>" + (where ? '<div class="uwhere">📍 ' + where + "</div>" : "") + steps + "</div>";
  }

  function platDefault(own) { var p = null; try { p = localStorage.getItem("qscr-plat"); } catch (e) {} if (p === "pc" || p === "mob") return p; try { if (matchMedia("(pointer:coarse)").matches && innerWidth < 800) return "mob"; } catch (e) {} return own; }

  uiHTML = function (v) {
    if (v.ui !== "desk" && v.ui !== "phone") return oldUI(v);
    var own = v.ui === "desk" ? "pc" : "mob", other = own === "pc" ? "mob" : "pc";
    var main = { hl: v.hl, btn: v.btn, steps: v.steps, sub: v.sub, tab: v.tab }, alt = v.alt || null;
    var panes = {}; panes[own] = main; if (alt) panes[other] = alt;
    var cur = platDefault(own); if (!panes[cur]) cur = own;
    var tabs = alt ? '<div class="uitabs" role="tablist">' + ["pc", "mob"].map(function (p) { return '<button type="button" role="tab" data-p="' + p + '" aria-selected="' + (p === cur) + '">' + T(TABN[p]) + "</button>"; }).join("") + "</div>" : '<div class="uicap">' + (own === "pc" ? "🖥️ " : "📱 ") + CAP[own] + "</div>";
    var body = ["pc", "mob"].filter(function (p) { return panes[p]; }).map(function (p) { return pane(p, panes[p]).replace('class="upane"', 'class="upane"' + (p === cur ? "" : " hidden")); }).join("");
    return '<figure class="viz uimap cc" data-cur="' + cur + '">' + tabs + body + "</figure>";
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".uitabs button"); if (!b) return;
    var p = b.dataset.p; try { localStorage.setItem("qscr-plat", p); } catch (er) {}
    document.querySelectorAll(".uimap.cc").forEach(function (f) { var has = f.querySelector('.upane[data-p="' + p + '"]'); if (!has) return; f.dataset.cur = p;
      f.querySelectorAll(".upane").forEach(function (x) { x.hidden = x.dataset.p !== p; }); f.querySelectorAll(".uitabs button").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.p === p); }); });
  });
  window.QSCC = { PCS: PCS, MS: MS, PCC: PCC, PZ: PZ, MZ: MZ, build: buildPane };

  var st = document.createElement("style"); st.textContent = [
    ".uimap.cc{padding:10px 10px 12px}.uitabs{display:flex;gap:6px;margin:0 0 10px}.uitabs button{flex:1;padding:9px 8px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--mut);font:700 14px Outfit,inherit}",
    ".uitabs button[aria-selected=true]{background:linear-gradient(135deg,var(--gold),#c98a26);color:#1a0f08;border:0}.uicap{font:700 13px Outfit,inherit;color:var(--mut);margin:0 0 8px}",
    ".uscr{position:relative;width:100%;margin:0 auto;overflow:hidden;background:#111214;direction:ltr;box-shadow:0 6px 22px rgba(0,0,0,.45);touch-action:manipulation;-webkit-user-select:none;user-select:none}",
    ".uscr.pc{max-width:640px;border-radius:10px;border:1px solid #3a3d44}.uscr.mob{max-width:270px;border-radius:26px;border:3px solid #2c2f35}",
    ".uzoom{position:relative;width:100%;height:100%;transform-origin:0 0;transition:transform 1s cubic-bezier(.45,.05,.2,1);--z:1;will-change:transform}",
    ".uimg{position:absolute;left:0;top:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .45s}.uimg.on{opacity:1}.uimg[data-f='0']{position:relative;height:auto}",
    ".uhl{position:absolute;display:none;box-sizing:border-box;border:calc(3px / var(--z)) solid #ffc43c;border-radius:calc(8px / var(--z));background:rgba(255,196,60,.13);pointer-events:none;animation:uhlp 1.5s ease-in-out infinite;transition:opacity .35s}",
    ".uhl.f0{display:block}.uhl.show{display:block}.uhl.hide{display:none}@keyframes uhlp{50%{border-color:rgba(255,196,60,.4);background:rgba(255,196,60,.04)}}",
    ".uhl.press{animation:upress .55s ease-out 1}@keyframes upress{0%{transform:scale(1);background:rgba(255,196,60,.55)}40%{transform:scale(.965);background:rgba(255,196,60,.5)}100%{transform:scale(1);background:rgba(255,196,60,.13)}}",
    ".ucur{position:absolute;display:block;width:var(--cw,5.5%);aspect-ratio:40/44;margin:0;opacity:0;transform-origin:0 0;transform:scale(calc(1 / var(--z)));transition:left .9s cubic-bezier(.45,.05,.2,1),top .9s cubic-bezier(.45,.05,.2,1),opacity .3s;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.6));z-index:5}",
    ".uscr.mob .ucur{--cw:14%}.ucur svg{display:block;overflow:visible;width:100%;height:auto;transform:translate(-20%,-18.2%)}",
    ".ucur .uclick{fill:rgba(255,196,60,.28);stroke:#ffc43c;stroke-width:2.2;opacity:0;transform-box:fill-box;transform-origin:center}.ucur.click .uclick{animation:uclk .75s ease-out 1}.ucur.click svg path{animation:ucp .3s ease-out 1}",
    "@keyframes uclk{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(2.8)}}@keyframes ucp{40%{transform:scale(.86) translate(1px,1px)}}",
    ".uclk{position:absolute;left:50%;top:8px;transform:translate(-50%,-6px);opacity:0;transition:opacity .25s,transform .25s;background:#ffc43c;color:#1b1306;font:800 13px Outfit,Arial,sans-serif;padding:5px 12px;border-radius:99px;box-shadow:0 3px 10px rgba(0,0,0,.45);white-space:nowrap;max-width:92%;overflow:hidden;text-overflow:ellipsis;z-index:6;pointer-events:none}",
    ".uclk.on{opacity:1;transform:translate(-50%,0)}.uscr.mob .uclk{top:14px;font-size:12px}",
    ".uwhere{margin:8px 2px 0;font:600 13px Outfit,inherit;color:var(--gold2)}",
    "@media (prefers-reduced-motion:reduce){.uhl,.uhl.press{animation:none}.uzoom,.ucur{transition:none}}"].join("\n");
  document.head.appendChild(st);
})();

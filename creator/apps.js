/* Realistic app screens for the creator lessons: Canva (laptop), Instagram (phone), ChatGPT (laptop), Zoom (laptop).
   Drawn as vector screens (so they stay sharp when the cursor zooms in). Each lesson step { ui:"canva"|"insta"|"gpt"|"zoom", hl:[zones], btn } gets the right screen,
   a teacher-style cursor + click (see livesync.js) and the screens that open after the click. window.autoV(moment) gives a step to lessons that only mention a tool in words. */
(function () {
  "use strict";
  var L = function (en, ur, hi) { return { en: en, ur: ur, hi: hi }; };
  var FF = "Outfit,Inter,'Segoe UI',Roboto,Arial,sans-serif";
  var R = function (x, y, w, h, f, rx, s) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + f + '"' + (s ? ' stroke="' + s + '"' : "") + "/>"; };
  var Tx = function (x, y, size, t, f, wt, an, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || "#111") + '" font-weight="' + (wt || 500) + '"' + (an ? ' text-anchor="' + an + '"' : "") + (extra || "") + ">" + String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</text>"; };
  var C = function (x, y, r, f, s) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (s ? ' stroke="' + s + '"' : "") + "/>"; };
  var Ln = function (x1, y1, x2, y2, s, w) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>'; };
  var Pa = function (d, f, s, w) { return '<path d="' + d + '" fill="' + (f || "none") + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' : "") + "/>"; };
  var G = function (inner, tr) { return "<g" + (tr ? ' transform="' + tr + '"' : "") + ">" + inner + "</g>"; };
  function svg(W, H, inner, defs) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" font-family="' + FF + '" style="display:block;width:100%;height:100%;max-width:none;max-height:none;margin:0">' + (defs ? "<defs>" + defs + "</defs>" : "") + inner + "</svg>"; }

  /* ============================== CANVA (laptop 1600x900) ============================== */
  var CW = 1600, CH = 900;
  var CDEF = '<linearGradient id="cvg" x1="0" x2="1"><stop offset="0" stop-color="#00c4cc"/><stop offset=".55" stop-color="#5b5bd6"/><stop offset="1" stop-color="#7d2ae8"/></linearGradient><linearGradient id="cvp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd8a8"/><stop offset="1" stop-color="#ff7aa8"/></linearGradient>';
  function cvTop(extra) {
    return R(0, 0, CW, 56, "url(#cvg)") + Pa("M22 20h22M22 28h22M22 36h22", 0, "#fff", 2.4) + Tx(64, 35, 17, "Home", "#fff", 600) + Tx(130, 35, 17, "File", "#fff", 600) + Tx(180, 35, 17, "Resize", "#fff", 600) +
      R(262, 14, 96, 28, "rgba(255,255,255,.18)", 14) + Tx(279, 33, 14, "Editing", "#fff", 600) + Pa("M333 26l5 5 5-5", 0, "#fff", 2) +
      Pa("M390 36a9 9 0 1 1 3 -9M394 22v6h-6", 0, "#fff", 2.2) + Pa("M426 36a9 9 0 1 0 -3 -9M422 22v6h6", 0, "#fff", 2.2) +
      Tx(700, 34, 16, "Untitled design – Instagram Post (1:1)", "#fff", 500) + C(1230, 28, 15, "rgba(255,255,255,.22)") + Tx(1230, 33, 13, "A", "#fff", 700, "middle") +
      R(1262, 11, 92, 34, "rgba(255,255,255,.2)", 8) + Tx(1308, 34, 16, "Share", "#fff", 700, "middle") + R(1366, 11, 130, 34, "#fff", 8) + Tx(1431, 34, 15, "Create a design", "#6a1fd0", 700, "middle") + Pa("M1512 27l6 7 6-7", 0, "#fff", 2.2) + (extra || "");
  }
  var RAIL = [["Design", 0], ["Elements", 1], ["Text", 2], ["Brand", 3], ["Uploads", 4], ["Tools", 5], ["Projects", 6], ["Apps", 7]];
  function railIcon(i, x, y, on) {
    var c = on ? "#fff" : "#c8cdd6", s = "";
    if (i === 0) s = R(x - 11, y - 11, 22, 22, "none", 4, c) + Ln(x - 11, y - 1, x + 11, y - 1, c, 1.6) + Ln(x - 2, y - 1, x - 2, y + 11, c, 1.6);
    else if (i === 1) s = C(x - 5, y + 5, 7, "none", c) + Pa("M" + (x + 1) + " " + (y - 11) + "l8 14h-16z", 0, c, 1.8) + R(x + 2, y + 2, 10, 10, "none", 2, c);
    else if (i === 2) s = Tx(x, y + 9, 28, "T", c, 700, "middle");
    else if (i === 3) s = Pa("M" + (x - 11) + " " + (y + 8) + "l2-14l6 7l3-10l3 10l6-7l2 14z", 0, c, 1.8);
    else if (i === 4) s = Pa("M" + x + " " + (y + 10) + "v-18M" + (x - 8) + " " + (y - 3) + "l8-8l8 8M" + (x - 11) + " " + (y + 12) + "h22", 0, c, 2);
    else if (i === 5) s = R(x - 11, y - 11, 10, 10, "none", 2, c) + R(x + 1, y - 11, 10, 10, "none", 2, c) + R(x - 11, y + 1, 10, 10, "none", 2, c) + R(x + 1, y + 1, 10, 10, "none", 2, c);
    else if (i === 6) s = R(x - 11, y - 8, 22, 18, "none", 3, c) + Pa("M" + (x - 11) + " " + (y - 8) + "l5-4h6l3 4", 0, c, 1.8);
    else s = R(x - 11, y - 11, 8, 8, "none", 2, c) + R(x + 3, y - 11, 8, 8, "none", 2, c) + R(x - 11, y + 3, 8, 8, "none", 2, c) + C(x + 7, y + 7, 5, "none", c);
    return s;
  }
  function cvRail(act) {
    var s = R(0, 56, 88, 844, "#0e1318");
    RAIL.forEach(function (r, k) { var y = 56 + 14 + k * 82, on = r[0] === act; if (on) s += R(8, y - 4, 72, 76, "rgba(255,255,255,.12)", 10); s += railIcon(r[1], 44, y + 26, on) + Tx(44, y + 62, 13, r[0], on ? "#fff" : "#c8cdd6", 500, "middle"); });
    return s;
  }
  function cvProps(font) {
    var s = R(440, 56, 1160, 50, "#fff", 0, "#e4e6eb");
    s += R(460, 66, 170, 30, "#fff", 6, "#cfd3da") + Tx(474, 87, 16, font || "Cairo", "#0e1318", 500) + Pa("M608 78l5 5 5-5", 0, "#333", 2);
    s += Ln(648, 71, 648, 91, "#d6d9df", 1.5) + Ln(662, 81, 674, 81, "#333", 2) + R(680, 66, 52, 30, "#fff", 6, "#cfd3da") + Tx(706, 87, 16, "64", "#0e1318", 500, "middle") + Ln(738, 81, 750, 81, "#333", 2) + Ln(744, 75, 744, 87, "#333", 2);
    s += Ln(766, 71, 766, 91, "#d6d9df", 1.5) + Tx(790, 89, 22, "A", "#0e1318", 700, "middle") + R(776, 93, 28, 4, "#7d2ae8") + Ln(822, 71, 822, 91, "#d6d9df", 1.5);
    s += Tx(846, 88, 19, "B", "#0e1318", 800, "middle") + Tx(880, 88, 19, "I", "#0e1318", 500, "middle", ' font-style="italic"') + Tx(914, 88, 19, "U", "#0e1318", 500, "middle", ' text-decoration="underline"') + Tx(952, 88, 17, "aa", "#0e1318", 500, "middle");
    s += Ln(980, 71, 980, 91, "#d6d9df", 1.5) + Pa("M996 74h22M996 81h14M996 88h22", 0, "#333", 2) + Pa("M1040 74h22M1040 81h22M1040 88h22", 0, "#333", 2) + Ln(1080, 71, 1080, 91, "#d6d9df", 1.5) + Tx(1096, 88, 15, "Spacing", "#0e1318", 500) + Tx(1172, 88, 15, "Effects", "#0e1318", 500) + Tx(1244, 88, 15, "Animate", "#0e1318", 500) + Tx(1328, 88, 15, "Position", "#0e1318", 500);
    return s;
  }
  function cvPage(x, y, s, showRuler, bleed) {
    var p = R(x, y, s, s, "url(#cvp)");
    p += R(x + s * .1, y + s * .1, s * .8, s * .8, "rgba(255,255,255,.88)", 18) + Tx(x + s / 2, y + s * .38, s * .12, "GRAND SALE", "#4a1fa8", 800, "middle") + Tx(x + s / 2, y + s * .5, s * .045, "Up to 50% off · this weekend", "#333", 500, "middle") + R(x + s * .3, y + s * .6, s * .4, s * .1, "#7d2ae8", s * .05) + Tx(x + s / 2, y + s * .665, s * .045, "Shop now", "#fff", 700, "middle");
    if (bleed) p += R(x - 10, y - 10, s + 20, s + 20, "none", 0, "#ff4d6a").replace("<rect", '<rect stroke-dasharray="6 5"') + Tx(x, y - 16, 12, "Bleed", "#ff4d6a", 600);
    return p;
  }
  function cvBottom(pages) {
    var s = R(440, 780, 1160, 120, "#fff", 0, "#e4e6eb") + Tx(470, 806, 14, "Notes", "#444", 500) + Tx(1480, 806, 14, "Pages", "#444", 600) + R(1420, 818, 150, 4, "#cfd3da", 2) + R(1420, 818, 62, 4, "#7d2ae8", 2) + C(1482, 820, 8, "#7d2ae8") + Tx(1542, 806, 14, "45%", "#444", 600) + Tx(1572, 806, 14, "▦", "#444", 600);
    for (var i = 0; i < pages; i++) { var x = 600 + i * 130; s += R(x, 818, 110, 66, i ? "#e9d5ff" : "url(#cvp)", 6, i ? "#cfd3da" : "#7d2ae8") + Tx(x + 55, 858, 14, "" + (i + 1), "#333", 700, "middle"); }
    s += R(600 + pages * 130, 818, 110, 66, "#f1f2f5", 6) + Tx(655 + pages * 130, 859, 26, "+", "#555", 500, "middle");
    return s;
  }
  function cvEditor(opts) {
    opts = opts || {};
    var s = cvTop() + cvRail(opts.rail || "Design");
    /* side panel */
    var panel = "";
    if (opts.panel === "color") panel = cvColorPanel();
    else if (opts.panel === "fonts") panel = cvFontPanel();
    else if (opts.panel === "brand") panel = cvBrandPanel();
    else panel = cvTemplatePanel();
    s += R(88, 56, 352, 844, "#fff", 0, "#e4e6eb") + panel + R(440, 56, 1160, 844, "#ebecf0") + cvProps(opts.font) + R(440, 106, 1160, 674, "#ebecf0");
    s += cvPage(660, 150, 560, opts.rulers, opts.bleed);
    if (opts.rulers) s += R(440, 106, 1160, 22, "#fff", 0, "#d6d9df") + R(440, 106, 22, 674, "#fff", 0, "#d6d9df");
    s += R(660, 150, 560, 560, "none", 0, "#7d2ae8").replace("<rect", '<rect stroke-width="2"');
    s += cvBottom(opts.pages || 2);
    return s;
  }
  function cvTemplatePanel() {
    var s = R(108, 74, 312, 44, "#f1f2f5", 22) + Tx(150, 102, 15, "Search Instagram post templates", "#6b7280", 400) + C(132, 96, 7, "none", "#6b7280") + Ln(137, 101, 142, 106, "#6b7280", 2);
    var cols = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#ff9f1c", "#8338ec", "#3a86ff", "#fb5607"];
    for (var i = 0; i < 8; i++) { var x = 108 + (i % 2) * 160, y = 140 + Math.floor(i / 2) * 160; s += R(x, y, 150, 150, cols[i], 8) + R(x + 18, y + 18, 114, 114, "rgba(255,255,255,.82)", 8) + Tx(x + 75, y + 82, 17, "Template", "#222", 700, "middle"); }
    return s;
  }
  function cvFontPanel() {
    var s = Tx(108, 90, 18, "Fonts", "#0e1318", 700) + R(108, 106, 312, 40, "#f1f2f5", 20) + Tx(140, 132, 15, "Search fonts", "#6b7280", 400) + Tx(108, 176, 13, "Document fonts", "#6b7280", 600);
    var f = [["Cairo", 600], ["Amiri", 400], ["Noto Nastaliq Urdu", 400], ["Poppins", 600], ["Montserrat", 700], ["Playfair Display", 700], ["Open Sans", 400]];
    f.forEach(function (n, i) { s += (i === 0 ? R(100, 190 + i * 56, 328, 50, "#f1ecff", 8) : "") + Tx(120, 224 + i * 56, 24, n[0], "#0e1318", n[1]) + (i === 0 ? Pa("M392 " + (214 + i * 56) + "l6 6l12-12", 0, "#7d2ae8", 3) : ""); });
    return s;
  }
  function cvColorPanel() {
    var s = Tx(108, 90, 18, "Colors", "#0e1318", 700) + R(108, 106, 312, 40, "#f1f2f5", 20) + Tx(140, 132, 15, "Try \"blue\" or \"#00c4cc\"", "#6b7280", 400) + Tx(108, 176, 13, "Photo colors", "#6b7280", 600);
    ["#f3b57d", "#c2574a", "#4a1fa8", "#ffd8a8", "#ff7aa8", "#2b2d42"].forEach(function (c, i) { s += C(130 + i * 50, 208, 19, c, "#e0e0e0"); });
    s += Tx(108, 262, 13, "Document colors", "#6b7280", 600);
    ["#7d2ae8", "#00c4cc", "#ffc43c", "#ffffff", "#111111", "#ef476f"].forEach(function (c, i) { s += C(130 + i * 50, 294, 19, c, "#d0d0d0"); });
    s += Tx(108, 348, 13, "Default solid colors", "#6b7280", 600);
    var sw = ["#000", "#545454", "#737373", "#a6a6a6", "#d9d9d9", "#fff", "#ff3131", "#ff5757", "#ff66c4", "#cb6ce6", "#8c52ff", "#5e17eb", "#0097b2", "#0cc0df", "#5ce1e6", "#38b6ff", "#5271ff", "#004aad", "#00bf63", "#7ed957", "#c1ff72", "#ffde59", "#ffbd59", "#ff914d"];
    sw.forEach(function (c, i) { s += R(108 + (i % 6) * 53, 366 + Math.floor(i / 6) * 53, 46, 46, c, 8, "#d8d8d8"); });
    /* hex picker */
    s += R(108, 600, 312, 190, "#fff", 12, "#dfe1e6") + R(120, 612, 288, 100, "url(#cvhue)", 8) + C(330, 640, 8, "none", "#fff") + R(120, 724, 288, 12, "url(#cvhue2)", 6) + R(120, 752, 220, 30, "#fff", 6, "#cfd3da") + Tx(132, 774, 16, "#7D2AE8", "#0e1318", 500) + R(350, 752, 58, 30, "#7d2ae8", 6);
    return s;
  }
  function cvBrandPanel() {
    var s = Tx(108, 90, 18, "Brand", "#0e1318", 700) + R(108, 106, 312, 44, "#f1ecff", 10) + Tx(264, 134, 16, "My brand kit", "#6a1fd0", 700, "middle") + Tx(108, 190, 14, "Brand logos", "#444", 700);
    s += R(108, 204, 100, 100, "#f1f2f5", 10) + Tx(158, 262, 30, "Q", "#7d2ae8", 800, "middle") + R(220, 204, 100, 100, "#111", 10) + Tx(270, 262, 30, "Q", "#ffc43c", 800, "middle") + Tx(108, 340, 14, "Brand colors", "#444", 700);
    ["#7d2ae8", "#00c4cc", "#ffc43c", "#ffffff", "#111111"].forEach(function (c, i) { s += R(108 + i * 62, 354, 54, 54, c, 10, "#d8d8d8"); });
    s += Tx(108, 446, 14, "Brand fonts", "#444", 700) + R(108, 460, 312, 54, "#f7f7f8", 8) + Tx(124, 496, 24, "Cairo Bold", "#0e1318", 700) + R(108, 524, 312, 44, "#f7f7f8", 8) + Tx(124, 554, 18, "Amiri Regular", "#0e1318", 400);
    return s;
  }
  var CDEF2 = CDEF + '<linearGradient id="cvhue" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#7d2ae8"/></linearGradient><linearGradient id="cvhue2" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset=".17" stop-color="#ff0"/><stop offset=".33" stop-color="#0f0"/><stop offset=".5" stop-color="#0ff"/><stop offset=".67" stop-color="#00f"/><stop offset=".83" stop-color="#f0f"/><stop offset="1" stop-color="#f00"/></linearGradient>';
  var dim = function () { return R(0, 0, CW, CH, "rgba(0,0,0,.45)"); };
  function cvFile() {
    var s = cvEditor({ rulers: true, bleed: true }) + R(112, 52, 330, 470, "#fff", 12, "#dfe1e6");
    var it = [["Save", 0], ["Make a copy", 0], ["Download", 0], ["View settings", 1], ["Show rulers and guides", 2], ["Show print bleed", 2], ["Show margins", 2], ["Version history", 0], ["Settings", 0]];
    it.forEach(function (r, i) { var y = 84 + i * 46; if (i === 3) s += R(120, y - 28, 314, 40, "#f1ecff", 6); if (r[1] === 2) s += R(132, y - 18, 20, 20, i === 5 ? "#7d2ae8" : (i === 4 ? "#7d2ae8" : "#fff"), 4, "#7d2ae8") + (i === 4 || i === 5 ? Pa("M137 " + (y - 8) + "l4 4l7-8", 0, "#fff", 2.4) : ""); s += Tx(r[1] === 2 ? 164 : 136, y, 16, r[0], "#0e1318", r[1] === 1 ? 700 : 500); });
    return s;
  }
  function cvDownload() {
    var s = cvEditor({ rulers: false });
    s += R(1060, 56, 520, 600, "#fff", 14, "#dfe1e6") + Tx(1090, 96, 22, "Download", "#0e1318", 700) + Tx(1090, 136, 14, "File type", "#444", 600) + R(1090, 146, 460, 46, "#fff", 8, "#cfd3da") + Tx(1106, 176, 16, "PDF Print", "#0e1318", 500) + Pa("M1520 164l6 7 6-7", 0, "#333", 2);
    s += R(1090, 210, 20, 20, "#7d2ae8", 4) + Pa("M1094 220l4 4l8-9", 0, "#fff", 2.4) + Tx(1124, 226, 16, "Crop marks and bleed", "#0e1318", 500) + Tx(1090, 268, 14, "Color profile", "#444", 600) + R(1090, 278, 460, 46, "#fff", 8, "#cfd3da") + Tx(1106, 308, 16, "CMYK (best for professional printing)", "#0e1318", 500);
    s += Tx(1090, 360, 14, "Select pages", "#444", 600) + R(1090, 370, 460, 46, "#fff", 8, "#cfd3da") + Tx(1106, 400, 16, "All pages (2)", "#0e1318", 500) + R(1090, 450, 460, 52, "#7d2ae8", 10) + Tx(1320, 484, 18, "Download", "#fff", 700, "middle");
    return s;
  }
  function cvHome() {
    var s = R(0, 0, CW, CH, "#fff") + R(0, 0, CW, 70, "url(#cvg)") + Tx(40, 45, 22, "Home", "#fff", 700) + R(420, 14, 700, 42, "rgba(255,255,255,.95)", 21) + Tx(450, 42, 16, "Search your content, Canva’s, and the web", "#6b7280", 400) + R(1330, 14, 200, 42, "#fff", 8) + Tx(1430, 42, 16, "Create a design", "#6a1fd0", 700, "middle");
    s += Tx(800, 190, 40, "What will you design today?", "#0e1318", 800, "middle");
    var tiles = [["Doc", "#3a86ff"], ["Whiteboard", "#06d6a0"], ["Presentation", "#ffa62b"], ["Social media", "#ef476f"], ["Video", "#8338ec"], ["Print products", "#118ab2"]];
    tiles.forEach(function (t, i) { var x = 270 + i * 180; s += C(x + 40, 300, 44, t[1]) + Tx(x + 40, 395, 16, t[0], "#0e1318", 600, "middle"); });
    s += R(108, 470, 1384, 6, "#f1f2f5") + Tx(108, 530, 22, "Recent designs", "#0e1318", 700);
    for (var i = 0; i < 5; i++) s += R(108 + i * 280, 556, 256, 256, ["#ffe5ec", "#e8f0ff", "#e8fbf3", "#fff3dd", "#f1ecff"][i], 12, "#e4e6eb");
    return s;
  }
  function cvSize() {
    var s = cvHome() + dim() + R(380, 110, 840, 680, "#fff", 18) + Tx(420, 168, 26, "Create a design", "#0e1318", 800);
    var pr = [["Instagram Post", "1080 × 1080 px", "#ef476f"], ["YouTube Thumbnail", "1280 × 720 px", "#ff3b3b"], ["Poster", "42 × 59.4 cm", "#8338ec"], ["Logo", "500 × 500 px", "#00c4cc"], ["Facebook Post", "940 × 788 px", "#3a86ff"], ["Story", "1080 × 1920 px", "#ffa62b"]];
    pr.forEach(function (p, i) { var x = 420 + (i % 3) * 258, y = 200 + Math.floor(i / 3) * 190; s += R(x, y, 238, 170, "#f7f7f8", 14, i === 1 ? "#7d2ae8" : "#e4e6eb") + R(x + 69, y + 24, 100, 70, p[2], 10) + Tx(x + 119, y + 126, 16, p[0], "#0e1318", 700, "middle") + Tx(x + 119, y + 148, 13, p[1], "#6b7280", 400, "middle"); });
    s += Tx(420, 620, 15, "Custom size", "#0e1318", 700) + R(420, 636, 150, 44, "#fff", 8, "#cfd3da") + Tx(436, 665, 16, "1280", "#0e1318", 500) + R(590, 636, 150, 44, "#fff", 8, "#cfd3da") + Tx(606, 665, 16, "720", "#0e1318", 500) + R(760, 636, 110, 44, "#fff", 8, "#cfd3da") + Tx(776, 665, 16, "px ▾", "#0e1318", 500) + R(920, 630, 260, 52, "#7d2ae8", 10) + Tx(1050, 664, 17, "Create new design", "#fff", 700, "middle");
    return s;
  }
  var CF = {
    editor: function () { return cvEditor({}); },
    fonts: function () { return cvEditor({ panel: "fonts", rail: "Text", font: "Cairo" }); },
    color: function () { return cvEditor({ panel: "color", rail: "Design" }); },
    brand: function () { return cvEditor({ panel: "brand", rail: "Brand" }); },
    file: cvFile, download: cvDownload, size: cvSize, home: cvHome
  };
  var CAPP = {
    key: "canva", W: CW, H: CH, plat: "pc", cap: "Canva · laptop", defs: CDEF2,
    zones: { top: [0, 0, 1600, 56], side: [0, 56, 440, 844], canvas: [440, 106, 1160, 674], props: [440, 56, 1160, 50], pages: [440, 780, 1160, 120] },
    zn: { top: L("Top bar", "اوپر کی پٹی", "ऊपर की पट्टी"), side: L("Side menu", "سائیڈ مینو", "साइड मेनू"), canvas: L("Design page", "ڈیزائن پیج", "डिज़ाइन पेज"), props: L("Text settings bar", "ٹیکسٹ سیٹنگز بار", "टेक्स्ट सेटिंग्स बार"), pages: L("Pages", "پیجز", "पेज") },
    frames: {
      editor: { hs: { file: [118, 14, 56, 28], resize: [170, 14, 80, 28], share: [1262, 11, 92, 34], create: [1366, 11, 130, 34], font: [460, 66, 170, 30], fsize: [680, 66, 52, 30], tcolor: [770, 62, 40, 38], dup: [1480, 796, 40, 24], pages: [600, 818, 240, 66], addpage: [740, 818, 110, 66], text: [8, 224, 72, 76], brand: [8, 306, 72, 76], elements: [8, 142, 72, 76], uploads: [8, 388, 72, 76], design: [8, 60, 72, 76], templates: [108, 74, 312, 44], page: [660, 150, 560, 560] } },
      fonts: { hs: { list: [100, 190, 328, 330], search: [108, 106, 312, 40], font: [460, 66, 170, 30], cairo: [100, 190, 328, 50], amiri: [100, 246, 328, 50], nastaliq: [100, 302, 328, 50] } },
      color: { hs: { doc: [108, 276, 312, 40], photo: [108, 190, 312, 40], hex: [120, 752, 220, 30], picker: [120, 612, 288, 100], swatches: [108, 366, 312, 210], search: [108, 106, 312, 40] } },
      brand: { hs: { colors: [108, 354, 312, 54], fonts: [108, 460, 312, 108], logos: [108, 204, 212, 100], kit: [108, 106, 312, 44] } },
      file: { hs: { view: [120, 150, 314, 40], rulers: [120, 196, 314, 40], bleed: [120, 242, 314, 40], download: [120, 150, 314, 40] } },
      download: { hs: { type: [1090, 146, 460, 46], bleed: [1090, 206, 300, 28], profile: [1090, 278, 460, 46], pages: [1090, 370, 460, 46], dl: [1090, 450, 460, 52] } },
      size: { hs: { insta: [420, 200, 238, 170], yt: [678, 200, 238, 170], poster: [936, 200, 238, 170], logo: [420, 390, 238, 170], custom: [420, 636, 450, 44], create: [920, 630, 260, 52] } },
      home: { hs: { create: [1330, 14, 200, 42], search: [420, 14, 700, 42], recent: [108, 556, 1384, 256] } }
    },
    /* [regex on words, start frame, hotspot list [frame, name, label]] ... first match wins */
    kw: [
      [/bleed|margin/, "editor", [["editor", "file", "File"], ["file", "view", "View settings"], ["file", "bleed", "Show print bleed"]]],
      [/ruler|guide/, "editor", [["editor", "file", "File"], ["file", "view", "View settings"], ["file", "rulers", "Show rulers and guides"]]],
      [/pdf|download|print|export|crop/, "editor", [["editor", "share", "Share"], ["download", "type", "File type"], ["download", "bleed", "Crop marks and bleed"], ["download", "dl", "Download"]]],
      [/duplicate|add page|page\b|pages/, "editor", [["editor", "dup", "Duplicate page"]]],
      [/photo colou?rs|hex|colou?r|palette/, "editor", [["editor", "design", "Design → Colors"], ["color", "photo", "Photo colors"], ["color", "hex", "Hex code"]]],
      [/font|nastaliq|amiri|cairo|typeface/, "editor", [["editor", "text", "Text"], ["fonts", "cairo", "Pick a font"]]],
      [/thumbnail|youtube|1280|resize|size|custom/, "home", [["home", "create", "Create a design"], ["size", "yt", "YouTube Thumbnail"], ["size", "create", "Create new design"]]],
      [/1080|instagram|post|story/, "home", [["home", "create", "Create a design"], ["size", "insta", "Instagram Post"], ["size", "create", "Create new design"]]],
      [/logo|brand/, "editor", [["editor", "brand", "Brand"], ["brand", "logos", "Logos"], ["brand", "colors", "Brand colors"]]]
    ]
  };

  /* ============================== INSTAGRAM (phone 360x780) ============================== */
  var IW = 360, IH = 780, IBG = "#000", IFG = "#f5f5f5", IMU = "#a8a8a8";
  function inStatus() { return Tx(24, 26, 14, "9:41", "#fff", 600) + R(290, 14, 28, 13, "none", 4, "#fff") + R(292, 16, 20, 9, "#fff", 2) + C(330, 21, 5, "#fff"); }
  function inNav(act) {
    var s = R(0, 724, IW, 56, "#000") + Ln(0, 724, IW, 724, "#262626", 1), x = [36, 108, 180, 252, 324];
    s += Pa("M24 746l12-10l12 10v14h-8v-8h-8v8h-8z", act === 0 ? "#fff" : 0, "#fff", 2);
    s += Pa("M96 752l12-10l12 10M100 750v10h16v-10", 0, "#fff", 0) + R(97, 737, 22, 22, "none", 5, "#fff") + Pa("M105 744l8 5l-8 5z", "#fff") ;
    s += R(169, 737, 22, 22, "none", 5, act === 2 ? "#fff" : "#fff") + Pa("M172 755l5-5l4 3l6-6", 0, "#fff", 2);
    s += Pa("M240 748l22-8l-6 20l-5-8z", 0, "#fff", 2);
    s += C(324, 748, 13, "#6a4cff") + Tx(324, 754, 14, "Q", "#fff", 700, "middle") + (act === 4 ? C(324, 748, 15, "none", "#fff") : "");
    return s;
  }
  function inGrid(y0) {
    var cols = ["#2b6cb0", "#c05621", "#2f855a", "#702459", "#2c5282", "#975a16", "#285e61", "#553c9a", "#742a2a"], s = "";
    for (var i = 0; i < 9; i++) { var x = (i % 3) * 120, y = y0 + Math.floor(i / 3) * 120; s += R(x + 1, y + 1, 118, 118, cols[i]) + Tx(x + 60, y + 70, 16, i % 2 ? "▶" : "", "rgba(255,255,255,.8)", 600, "middle"); }
    return s;
  }
  function inProfile() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Tx(24, 66, 20, "quranicscience", IFG, 700) + Pa("M171 58l5 5 5-5", 0, "#fff", 2) + R(268, 50, 22, 22, "none", 6, "#fff") + Ln(279, 55, 279, 67, "#fff", 2) + Ln(273, 61, 285, 61, "#fff", 2) + Pa("M308 54h24M308 61h24M308 68h24", 0, "#fff", 2.2);
    s += C(52, 128, 38, "#6a4cff") + Tx(52, 140, 34, "Q", "#fff", 800, "middle") + C(52, 128, 42, "none", "#c13584");
    [["128", "Posts"], ["12.4K", "Followers"], ["86", "Following"]].forEach(function (t, i) { s += Tx(164 + i * 70, 124, 17, t[0], IFG, 700, "middle") + Tx(164 + i * 70, 144, 13, t[1], IFG, 400, "middle"); });
    s += Tx(18, 192, 14, "Quranic Science", IFG, 700) + Tx(18, 212, 14, "Educator", IMU, 400) + Tx(18, 232, 14, "Science in the Quran · simple videos", IFG, 400) + Tx(18, 252, 14, "Learn, create, earn · free classes ↓", IFG, 400) + Tx(18, 272, 14, "quranicscience.info", "#6aa9ff", 500);
    s += R(14, 290, 332, 52, "#1a1a1a", 10) + Tx(28, 312, 14, "Professional dashboard", IFG, 700) + Tx(28, 331, 12, "12.4K accounts reached in the last 30 days", IMU, 400);
    s += R(14, 354, 160, 34, "#262626", 8) + Tx(94, 377, 14, "Edit profile", IFG, 700, "middle") + R(184, 354, 160, 34, "#262626", 8) + Tx(264, 377, 14, "Share profile", IFG, 700, "middle");
    var hl = ["Edits", "Hooks", "Tips", "Results", "New"];
    hl.forEach(function (h, i) { var x = 40 + i * 70; s += C(x, 430, 28, "#1a1a1a", "#555") + Tx(x, 436, 18, i === 4 ? "+" : "▶", "#ddd", 500, "middle") + Tx(x, 480, 11, h, IFG, 400, "middle"); });
    s += Ln(0, 504, IW, 504, "#262626", 1) + Pa("M56 530h20v20h-20zM60 526h12", 0, "#fff", 2) + Pa("M172 538l12-6v12z", 0, "#777", 2) + Pa("M284 528a8 8 0 1 0 0 .1", 0, "#777", 2) + Ln(0, 560, IW / 3, 560, "#fff", 2);
    s += inGrid(562).replace(/<rect/g, "<rect") + R(0, 724, IW, 56, "#000") + inNav(4);
    return s;
  }
  function inSettings() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + Tx(180, 78, 18, "Settings and activity", IFG, 700, "middle") + R(16, 104, 328, 42, "#1a1a1a", 21) + Tx(52, 131, 15, "Search", IMU, 400);
    var it = [["Your account", ""], ["Notifications", ""], ["Account type and tools", "hl"], ["Privacy", ""], ["Close Friends", ""], ["Blocked", ""], ["Messages and story replies", ""]];
    it.forEach(function (r, i) { var y = 190 + i * 62; if (r[1]) s += R(0, y - 28, IW, 56, "#1b1b2a"); s += C(34, y, 14, "#2a2a2a") + Tx(64, y + 5, 15, r[0], IFG, r[1] ? 700 : 400) + Pa("M326 " + (y - 6) + "l7 6l-7 6", 0, "#777", 2); });
    s += R(14, 636, 332, 52, "#0095f6", 10) + Tx(180, 668, 16, "Switch to professional account", "#fff", 700, "middle") + R(14, 698, 332, 8, "#000");
    return s;
  }
  function inType() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + Tx(180, 78, 18, "Account type", IFG, 700, "middle");
    s += Tx(180, 150, 22, "Which describes you best?", IFG, 800, "middle");
    s += R(18, 190, 324, 150, "#1a1a1a", 14, "#0095f6") + C(60, 240, 18, "#6a4cff") + Tx(92, 236, 17, "Creator", IFG, 700) + Tx(92, 258, 13, "Best for public figures, content", IMU, 400) + Tx(92, 276, 13, "producers, artists and influencers.", IMU, 400) + Tx(30, 318, 13, "● Insights · ● Growth tools · ● Creator inbox", IFG, 400);
    s += R(18, 356, 324, 120, "#1a1a1a", 14, "#333") + C(60, 400, 18, "#0095f6") + Tx(92, 396, 17, "Business", IFG, 700) + Tx(92, 418, 13, "Best for retailers, local businesses, brands.", IMU, 400);
    s += R(18, 660, 324, 48, "#0095f6", 10) + Tx(180, 691, 16, "Next", "#fff", 700, "middle");
    return s;
  }
  function inReel() {
    var s = R(0, 0, IW, IH, "#111") + R(0, 0, IW, IH, "url(#inv)") + inStatus();
    s += Tx(180, 300, 30, "Stop doing THIS", "#fff", 800, "middle", ' stroke="#000" stroke-width="1.2" paint-order="stroke"') + Tx(180, 338, 30, "in your reels", "#ffc43c", 800, "middle", ' stroke="#000" stroke-width="1.2" paint-order="stroke"');
    s += Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + R(130, 52, 100, 30, "rgba(0,0,0,.5)", 15) + Tx(180, 73, 13, "♪ Add audio", "#fff", 600, "middle");
    var tools = [["Aa", "Text"], ["☺", "Stickers"], ["♪", "Audio"], ["✦", "Effects"], ["✂", "Edit"]];
    tools.forEach(function (t, i) { s += C(326, 130 + i * 60, 20, "rgba(0,0,0,.45)") + Tx(326, 138 + i * 60, 18, t[0], "#fff", 600, "middle") + Tx(326, 162 + i * 60, 10, t[1], "#fff", 500, "middle"); });
    s += R(14, 640, 332, 44, "rgba(0,0,0,.55)", 10); for (var i = 0; i < 6; i++) s += R(20 + i * 52, 646, 46, 32, ["#2b6cb0", "#c05621", "#2f855a", "#702459", "#2c5282", "#975a16"][i], 5);
    s += R(54, 640, 3, 44, "#fff") + R(14, 698, 106, 44, "rgba(255,255,255,.18)", 22) + Tx(67, 726, 15, "Preview", "#fff", 700, "middle") + R(246, 698, 100, 44, "#0095f6", 22) + Tx(296, 726, 15, "Next →", "#fff", 700, "middle");
    return s;
  }
  function inCaption() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + Tx(180, 78, 18, "New reel", IFG, 700, "middle");
    s += R(16, 104, 84, 132, "#2b6cb0", 8) + Tx(58, 176, 11, "Edit cover", "#fff", 600, "middle");
    s += Tx(112, 126, 14, "Stop doing THIS in your reels 👇", IFG, 500) + Tx(112, 148, 14, "Save this for later.", IFG, 400) + Tx(112, 178, 14, "#reels #contentcreator #editing", "#6aa9ff", 500) + Tx(112, 202, 14, "Follow for daily tips", IFG, 400);
    var rows = [["Tag people", ""], ["Add topic", ""], ["Add audio", ""], ["Invite collaborator", "hl"], ["Add paid partnership label", "tg"], ["Share to Facebook", "tg"]];
    rows.forEach(function (r, i) { var y = 284 + i * 56; s += Ln(16, y - 24, 344, y - 24, "#1f1f1f", 1); if (r[1] === "hl") s += R(0, y - 24, IW, 56, "#10161f"); s += Tx(20, y + 4, 15, r[0], IFG, 500); if (r[1] === "tg") s += R(290, y - 12, 48, 26, i === 5 ? "#0095f6" : "#3a3a3c", 13) + C(i === 5 ? 325 : 303, y + 1, 10, "#fff"); else s += Pa("M326 " + (y - 6) + "l7 6l-7 6", 0, "#777", 2); });
    s += R(14, 690, 332, 46, "#0095f6", 10) + Tx(180, 720, 16, "Share", "#fff", 700, "middle");
    return s;
  }
  function inInsights() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + Tx(180, 78, 18, "Reel insights", IFG, 700, "middle");
    s += R(16, 104, 66, 108, "#2b6cb0", 8) + Tx(96, 126, 13, "Stop doing THIS in your reels", IFG, 600) + Tx(96, 146, 12, "Posted 3 days ago", IMU, 400);
    s += Tx(180, 258, 38, "48,210", IFG, 800, "middle") + Tx(180, 282, 13, "Views", IMU, 400, "middle");
    [["Likes", "3.1K"], ["Comments", "212"], ["Shares", "1.4K"], ["Saves", "2.0K"]].forEach(function (t, i) { s += Tx(48 + i * 88, 330, 16, t[1], IFG, 700, "middle") + Tx(48 + i * 88, 350, 11, t[0], IMU, 400, "middle"); });
    s += Tx(18, 400, 15, "Average watch time", IFG, 700) + Tx(342, 400, 15, "0:11", IFG, 700, "end") + Tx(18, 424, 12, "of 0:18 · 61% watched to the end", IMU, 400);
    s += Tx(18, 468, 15, "Retention", IFG, 700) + R(18, 484, 324, 130, "#0c0c0c", 8, "#1f1f1f") + Pa("M28 496C80 500 120 530 160 550S250 590 330 600", 0, "#0095f6", 3);
    s += Tx(18, 650, 15, "Where views came from", IFG, 700) + R(18, 662, 324, 8, "#262626", 4) + R(18, 662, 214, 8, "#0095f6", 4) + Tx(18, 692, 12, "Followers 34% · Non-followers 66%", IMU, 400);
    return s;
  }
  function inActive() {
    var s = R(0, 0, IW, IH, "#000") + inStatus() + Pa("M26 62l-10 10l10 10", 0, "#fff", 2.4) + Tx(180, 78, 18, "Total followers", IFG, 700, "middle") + Tx(180, 146, 30, "12,412", IFG, 800, "middle");
    s += Tx(18, 214, 15, "Most active times", IFG, 700) + R(16, 224, 80, 30, "#262626", 15) + Tx(56, 244, 13, "Days", IFG, 600, "middle") + R(104, 224, 90, 30, "#0095f6", 15) + Tx(149, 244, 13, "Hours", "#fff", 600, "middle");
    var h = [20, 26, 34, 48, 70, 96, 130, 150, 120, 80, 50, 30];
    h.forEach(function (v, i) { s += R(26 + i * 26, 440 - v * 1.4, 18, v * 1.4, i === 7 ? "#0095f6" : "#2a5d8f", 3) + Tx(35 + i * 26, 462, 9, ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"][i], IMU, 400, "middle"); });
    s += Tx(18, 520, 13, "Best time to post: 6 PM – 9 PM", IFG, 600) + Tx(18, 552, 15, "Top locations", IFG, 700) + Tx(18, 578, 13, "India 58% · UAE 14% · UK 9%", IMU, 400);
    return s;
  }
  function inViewReel() {
    var s = R(0, 0, IW, IH, "#1a1a2a") + R(0, 0, IW, IH, "url(#inv)") + inStatus() + Tx(24, 66, 20, "Reels", "#fff", 700);
    s += R(0, 0, IW, 120, "rgba(255,0,100,.0)") + Tx(180, 380, 26, "Stop doing THIS", "#fff", 800, "middle", ' stroke="#000" stroke-width="1.2" paint-order="stroke"');
    [["♡", "48K"], ["◌", "212"], ["➤", "1.4K"], ["⋯", ""]].forEach(function (t, i) { s += Tx(328, 480 + i * 60, 26, t[0], "#fff", 600, "middle") + Tx(328, 500 + i * 60, 11, t[1], "#fff", 500, "middle"); });
    s += C(32, 640, 16, "#6a4cff") + Tx(60, 645, 14, "quranicscience", "#fff", 700) + R(180, 630, 62, 24, "none", 6, "#fff") + Tx(211, 647, 12, "Follow", "#fff", 700, "middle") + Tx(20, 676, 13, "Stop doing THIS in your reels 👇 …more", "#fff", 400) + Tx(20, 698, 12, "♪ Original audio", "#ddd", 400) + inNav(1);
    return s;
  }
  var IDEF = '<linearGradient id="inv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b5998"/><stop offset=".5" stop-color="#6b3fa0"/><stop offset="1" stop-color="#12121c"/></linearGradient>';
  var IAPP = {
    key: "insta", W: IW, H: IH, plat: "mob", cap: "Instagram · phone", defs: IDEF,
    zones: { top: [0, 36, 360, 60], side: [300, 100, 60, 320], player: [0, 96, 300, 500], caption: [0, 100, 360, 120], bottom: [0, 724, 360, 56] },
    zn: { top: L("Top bar", "اوپر کی پٹی", "ऊपर की पट्टी"), side: L("Side buttons", "سائیڈ بٹن", "साइड बटन"), player: L("Video", "ویڈیو", "वीडियो"), caption: L("Caption area", "کیپشن ایریا", "कैप्शन एरिया"), bottom: L("Bottom bar", "نیچے کی پٹی", "नीचे की पट्टी") },
    frames: {
      profile: { hs: { menu: [306, 48, 34, 28], edit: [14, 354, 160, 34], dash: [14, 290, 332, 52], highlights: [8, 400, 344, 100], bio: [10, 176, 340, 106], avatar: [10, 86, 84, 84], plus: [264, 46, 30, 30] } },
      settings: { hs: { type: [0, 392, 360, 56], pro: [14, 636, 332, 52] } },
      type: { hs: { creator: [18, 190, 324, 150], business: [18, 356, 324, 120], next: [18, 660, 324, 48] } },
      reel: { hs: { audio: [130, 52, 100, 30], text: [306, 110, 40, 40], next: [246, 698, 100, 44], clips: [14, 640, 332, 44], side: [300, 100, 60, 320] } },
      caption: { hs: { caption: [112, 108, 232, 110], collab: [0, 482, 360, 56], paid: [0, 538, 360, 56], share: [14, 690, 332, 46], cover: [16, 104, 84, 132] } },
      insights: { hs: { views: [18, 232, 324, 60], watch: [18, 384, 324, 50], retention: [18, 484, 324, 130], source: [18, 640, 324, 60], eng: [18, 310, 324, 56] } },
      active: { hs: { chart: [16, 270, 330, 210], hours: [104, 224, 90, 30], best: [18, 504, 324, 28] } },
      viewreel: { hs: { side: [300, 450, 60, 240], caption: [10, 620, 280, 90], nav: [0, 724, 360, 56] } }
    },
    kw: [
      [/professional|creator|switch|account type/, "profile", [["profile", "menu", "Menu"], ["settings", "type", "Account type and tools"], ["settings", "pro", "Switch to professional account"], ["type", "creator", "Creator"]]],
      [/name|bio|photo|link|edit profile/, "profile", [["profile", "edit", "Edit profile"]]],
      [/highlight/, "profile", [["profile", "highlights", "Highlights"]]],
      [/collab/, "caption", [["caption", "collab", "Invite collaborator"]]],
      [/paid|partnership/, "caption", [["caption", "paid", "Paid partnership label"]]],
      [/hook line|hashtag|cta|caption/, "caption", [["caption", "caption", "Caption"]]],
      [/most active|active times|audience/, "profile", [["profile", "dash", "Professional dashboard"], ["active", "hours", "Most active times"]]],
      [/insight|view/, "profile", [["profile", "dash", "Professional dashboard"], ["insights", "views", "Insights"]]],
      [/watch time|sends|original|\b3 min/, "viewreel", [["viewreel", "side", "Likes · Shares"]]],
      [/keep these areas|safe/, "viewreel", [["viewreel", "side", "Buttons area"], ["viewreel", "caption", "Caption area"]]],
      [/words|picture|text/, "reel", [["reel", "text", "Text"]]]
    ]
  };

  /* ============================== CHATGPT (laptop 1600x900, dark) ============================== */
  var GW = 1600, GH = 900;
  function gptShell(inner, sideOpen) {
    var s = R(0, 0, GW, GH, "#212121") + R(0, 0, 300, GH, "#171717") + Tx(26, 52, 19, "ChatGPT", "#ececec", 700) + R(16, 80, 268, 42, "#212121", 10) + Tx(46, 107, 15, "＋  New chat", "#ececec", 500) + Tx(46, 152, 15, "⌕  Search chats", "#b4b4b4", 400) + Tx(46, 190, 15, "▤  Library", "#b4b4b4", 400) + Tx(26, 250, 13, "Today", "#8e8e8e", 600);
    ["Product photos for perfume", "YouTube thumbnail ideas", "Remove background help", "Logo concepts"].forEach(function (t, i) { s += (i === 0 ? R(12, 266, 276, 38, "#2a2a2a", 8) : "") + Tx(26, 291 + i * 40, 15, t, "#ececec", 400); });
    s += C(40, 850, 16, "#6a4cff") + Tx(40, 856, 14, "Q", "#fff", 700, "middle") + Tx(66, 856, 15, "Quranic Science", "#ececec", 500);
    s += Tx(330, 52, 18, "ChatGPT ▾", "#ececec", 600) + R(1470, 24, 110, 36, "none", 18, "#555") + Tx(1525, 48, 14, "Share", "#ececec", 500, "middle") + G(inner, "translate(150 0)");
    return s;
  }
  function gptComposer(txt, attach) {
    var s = R(420, 770, 760, 84, "#303030", 28) + Tx(466, 826, 18, txt || "Message ChatGPT", txt ? "#ececec" : "#8e8e8e", 400) + R(440, 790, 34, 34, "none", 17, "#8e8e8e") + Tx(457, 814, 24, "+", "#ececec", 400, "middle") + C(1148, 806, 20, txt ? "#fff" : "#8e8e8e") + Pa("M1148 815v-18M1140 804l8-8l8 8", 0, "#171717", 2.6);
    if (attach) s += R(440, 700, 100, 62, "#8a6a4a", 10) + Tx(490, 738, 11, "photo.png", "#fff", 500, "middle") + R(1060, 700, 0, 0, "none");
    return s;
  }
  function gptChat() {
    var s = Tx(800, 150, 36, "What can I help with?", "#ececec", 700, "middle") + gptComposer("Remove the background, transparent PNG", true);
    [["Create image", "#5ce1e6"], ["Analyze data", "#6aa9ff"], ["Summarize text", "#f2b84b"], ["Brainstorm", "#c084fc"]].forEach(function (t, i) { s += R(430 + i * 190, 876, 176, 0, "none"); });
    s += R(440, 690, 150, 0, "none");
    s += Tx(470, 640, 16, "You attached a photo and typed your instruction below ↓", "#8e8e8e", 400);
    return gptShell(s);
  }
  function gptResult() {
    var s = R(760, 130, 420, 70, "#303030", 20) + Tx(780, 172, 17, "Make a product photo of my perfume bottle, luxury black background", "#ececec", 400);
    s += C(440, 250, 16, "#10a37f") + Tx(440, 256, 13, "G", "#fff", 700, "middle") + Tx(480, 256, 16, "Here is your image.", "#ececec", 400);
    s += R(440, 276, 360, 360, "#0a0a0a", 14) + R(560, 340, 120, 220, "#c9a227", 18) + R(590, 296, 60, 56, "#222", 8) + R(574, 400, 92, 60, "rgba(0,0,0,.45)", 8) + Tx(620, 438, 20, "AL ASWAD", "#fff", 700, "middle") + Ln(440, 636, 800, 636, "#2a2a2a", 1);
    s += R(830, 276, 90, 36, "#303030", 18) + Tx(875, 300, 14, "Download", "#ececec", 500, "middle");
    s += Tx(440, 668, 15, "⧉   👍   👎   ↻", "#b4b4b4", 400) + gptComposer("", false);
    return gptShell(s);
  }
  var GAPP = {
    key: "gpt", W: GW, H: GH, plat: "pc", cap: "ChatGPT · laptop", defs: "",
    zones: { side: [0, 0, 300, 900], chat: [330, 80, 880, 680], composer: [420, 770, 760, 84], top: [300, 0, 1300, 72] },
    zn: { side: L("History", "ہسٹری", "हिस्ट्री"), chat: L("Chat", "چیٹ", "चैट"), composer: L("Message box", "میسج باکس", "मैसेज बॉक्स"), top: L("Top bar", "اوپر کی پٹی", "ऊपर की पट्टी") },
    frames: {
      chat: { hs: { attach: [440, 790, 34, 34], box: [466, 806, 650, 40], send: [1128, 786, 40, 40], photo: [440, 700, 100, 62], newchat: [16, 80, 268, 42] } },
      result: { hs: { image: [440, 276, 360, 360], download: [830, 276, 90, 36], box: [466, 806, 650, 40], attach: [440, 790, 34, 34], send: [1128, 786, 40, 40] } }
    },
    kw: [
      [/download|save the image|png/, "chat", [["chat", "photo", "Upload photo"], ["chat", "send", "Send"], ["result", "download", "Download"]]],
      [/upload|attach|photo|remove the background/, "chat", [["chat", "attach", "＋ Attach photo"], ["chat", "box", "Type your prompt"], ["chat", "send", "Send"]]],
      [/prompt|ask|write|type|image|picture|generate|create|product|logo/, "chat", [["chat", "box", "Type your prompt"], ["chat", "send", "Send"], ["result", "image", "Your image"]]]
    ]
  };

  /* ============================== ZOOM (laptop 1600x900, dark) ============================== */
  var ZW = 1600, ZH = 900;
  function zmMeeting(share) {
    var s = R(0, 0, ZW, ZH, "#1a1a1a") + R(0, 0, ZW, 48, "#232323") + Tx(24, 31, 15, "🔒 Zoom Meeting", "#fff", 600) + Tx(800, 31, 15, "AI Class · 1:02:11", "#ccc", 500, "middle") + Tx(1520, 31, 14, "View ▦", "#fff", 500);
    var tiles = [["Teacher", "#3a4a6a"], ["Aisha", "#5a3a4a"], ["Rahul", "#3a5a4a"], ["Imran", "#5a4a3a"], ["Sara", "#4a3a5a"], ["Dev", "#3a5a5a"]];
    tiles.forEach(function (t, i) { var x = 60 + (i % 3) * 490, y = 80 + Math.floor(i / 3) * 330; s += R(x, y, 480, 320, t[1], 10, i === 0 ? "#2fe085" : "none") + C(x + 240, y + 130, 52, "rgba(255,255,255,.18)") + Tx(x + 240, y + 146, 40, t[0][0], "#fff", 600, "middle") + Tx(x + 16, y + 304, 14, t[0], "#fff", 500); });
    if (share) s += R(0, 48, ZW, 760, "rgba(0,0,0,.55)") + R(300, 110, 1000, 600, "#2b2b2b", 14) + Tx(800, 160, 24, "Select a window or an application that you want to share", "#fff", 600, "middle") + [0, 1, 2].map(function (i) { return R(340 + i * 320, 200, 300, 220, i === 1 ? "#1f3a5a" : "#3a3a3a", 10, i === 1 ? "#2d8cff" : "#555") + Tx(490 + i * 320, 440, 15, ["Screen 1", "CapCut", "Canva"][i], "#ddd", 500, "middle"); }).join("") + R(340, 470, 20, 20, "#2d8cff", 4) + Tx(372, 487, 15, "Share sound", "#ddd", 400) + R(1130, 640, 140, 44, "#2d8cff", 8) + Tx(1200, 668, 16, "Share", "#fff", 700, "middle");
    s += R(0, 808, ZW, 92, "#232323");
    var bar = [["Mute", "🎤"], ["Stop Video", "🎥"], ["Participants", "👥"], ["Chat", "💬"], ["Share Screen", "⬆"], ["Record", "⏺"], ["Reactions", "☺"], ["Apps", "▦"]];
    bar.forEach(function (b, i) { var x = 200 + i * 130; s += Tx(x, 848, 24, b[1], i === 4 ? "#2fe085" : "#fff", 500, "middle") + Tx(x, 878, 13, b[0], i === 4 ? "#2fe085" : "#ddd", 500, "middle"); });
    s += R(1420, 828, 130, 44, "#e02828", 8) + Tx(1485, 857, 16, "Leave", "#fff", 700, "middle");
    return s;
  }
  var ZAPP = {
    key: "zoom", W: ZW, H: ZH, plat: "pc", cap: "Zoom · laptop", defs: "",
    zones: { video: [40, 60, 1520, 740], bar: [0, 808, 1600, 92], share: [1000, 808, 130, 92], people: [585, 808, 130, 92], rec: [1260, 808, 130, 92], chat: [840, 808, 130, 92] },
    zn: { video: L("Class video", "کلاس ویڈیو", "क्लास वीडियो"), bar: L("Control bar", "کنٹرول بار", "कंट्रोल बार"), share: L("Share Screen", "شیئر اسکرین", "शेयर स्क्रीन"), people: L("Participants", "شرکاء", "प्रतिभागी"), rec: L("Record", "ریکارڈ", "रिकॉर्ड"), chat: L("Chat", "چیٹ", "चैट") },
    frames: {
      meeting: { hs: { mute: [135, 820, 130, 80], video: [265, 820, 130, 80], people: [395, 820, 130, 80], chat: [525, 820, 130, 80], share: [655, 820, 130, 80], rec: [785, 820, 130, 80], react: [915, 820, 130, 80], leave: [1420, 828, 130, 44] } },
      share: { hs: { screen: [340, 200, 300, 220], app: [660, 200, 300, 220], sound: [340, 470, 200, 24], go: [1130, 640, 140, 44] } }
    },
    kw: [
      [/share/, "meeting", [["meeting", "share", "Share Screen"], ["share", "app", "Pick the window"], ["share", "go", "Share"]]],
      [/record/, "meeting", [["meeting", "rec", "Record"]]],
      [/chat|message/, "meeting", [["meeting", "chat", "Chat"]]],
      [/participant|people|raise/, "meeting", [["meeting", "people", "Participants"]]],
      [/mute|mic/, "meeting", [["meeting", "mute", "Mute"]]],
      [/camera|video/, "meeting", [["meeting", "video", "Start Video"]]]
    ]
  };
  (function () { /* the chat column is drawn 150px further right: move its hotspots with it */
    var f = GAPP.frames; for (var n in f) for (var h in f[n].hs) { var z = f[n].hs[h]; if (h !== "newchat") z[0] += 150; }
    GAPP.zones.chat = [480, 80, 880, 680]; GAPP.zones.composer = [570, 770, 760, 84];
  })();

  /* ============================== PLAY STORE / APP STORE (phone 360x780) ============================== */
  var SW = 360, SH = 780;
  function stBar(txt, focus) {
    return R(0, 0, SW, SH, "#fff") + R(0, 0, SW, 30, "#fff") + Tx(18, 20, 12, "9:41", "#111", 600) + R(16, 44, 328, 46, "#f1f3f4", 23) + Tx(46, 73, 16, txt || "Search apps & games", txt ? "#111" : "#5f6368", 400) + C(34, 67, 6, "none", "#5f6368") + Ln(38, 72, 43, 77, "#5f6368", 1.6) + (focus ? R(16, 44, 328, 46, "none", 23, "#1a73e8") : "");
  }
  function stIcon(x, y, s) { return R(x, y, s, s, "#000", s * .22) + Pa("M" + (x + s * .3) + " " + (y + s * .3) + "l" + s * .4 + " " + s * .2 + "l-" + s * .4 + " " + s * .2 + "z", "#fff") + Pa("M" + (x + s * .22) + " " + (y + s * .76) + "h" + s * .56, 0, "#00e5ff", 2.5); }
  function stSearch() {
    var s = stBar("CapCut", true) + Tx(18, 126, 13, "Suggested for you", "#5f6368", 500);
    var rows = [["CapCut - Video Editor", "ByteDance Pte. Ltd.", "4.6 ★ · 500M+"], ["CapCut Templates", "Video maker", "4.3 ★ · 10M+"], ["InShot Video Editor", "InShot Inc.", "4.8 ★ · 500M+"]];
    rows.forEach(function (r, i) { var y = 146 + i * 96; s += stIcon(18, y, 64) + Tx(98, y + 24, 16, r[0], "#111", 600) + Tx(98, y + 46, 13, r[1], "#5f6368", 400) + Tx(98, y + 66, 12, r[2], "#5f6368", 400) + R(262, y + 14, 80, 34, i === 0 ? "#1a73e8" : "#fff", 17, "#1a73e8") + Tx(302, y + 36, 13, "Install", i === 0 ? "#fff" : "#1a73e8", 600, "middle"); });
    s += R(0, 724, SW, 56, "#fff", 0, "#e0e0e0"); ["Games", "Apps", "Search", "Books"].forEach(function (t, i) { s += Tx(45 + i * 90, 758, 12, t, t === "Apps" ? "#1a73e8" : "#5f6368", 500, "middle"); });
    return s;
  }
  function stPage(state) {
    var s = R(0, 0, SW, SH, "#fff") + Tx(18, 20, 12, "9:41", "#111", 600) + Pa("M24 60l-10 8 10 8", 0, "#444", 2.4) + stIcon(18, 100, 84) + Tx(116, 126, 20, "CapCut - Video Editor", "#111", 700) + Tx(116, 150, 14, "ByteDance Pte. Ltd.", "#1a73e8", 500) + Tx(116, 172, 12, "Contains ads · In-app purchases", "#5f6368", 400);
    s += Tx(60, 232, 15, "4.6 ★", "#111", 700, "middle") + Tx(60, 250, 11, "12M reviews", "#5f6368", 400, "middle") + Tx(180, 232, 15, "500M+", "#111", 700, "middle") + Tx(180, 250, 11, "Downloads", "#5f6368", 400, "middle") + Tx(300, 232, 15, "3+", "#111", 700, "middle") + Tx(300, 250, 11, "Rated for 3+", "#5f6368", 400, "middle");
    if (state === "installing") s += R(18, 280, 270, 44, "#e8f0fe", 22) + R(18, 280, 150, 44, "#a8c7fa", 22) + Tx(153, 308, 15, "Installing… 56%", "#0b57d0", 600, "middle") + R(298, 280, 44, 44, "#fff", 22, "#cfd3da") + Tx(320, 309, 16, "✕", "#444", 600, "middle");
    else if (state === "done") s += R(18, 280, 154, 44, "#fff", 22, "#cfd3da") + Tx(95, 308, 15, "Uninstall", "#1a73e8", 600, "middle") + R(186, 280, 156, 44, "#1a73e8", 22) + Tx(264, 308, 15, "Open", "#fff", 600, "middle");
    else s += R(18, 280, 324, 44, "#1a73e8", 22) + Tx(180, 308, 16, "Install", "#fff", 600, "middle");
    s += R(18, 350, 324, 2, "#eee");
    [0, 1, 2].forEach(function (i) { s += R(18 + i * 112, 372, 100, 190, ["#222", "#3a2a5a", "#0b3b4a"][i], 12) + Tx(68 + i * 112, 470, 12, ["Edit", "Captions", "Export"][i], "#fff", 600, "middle"); });
    s += Tx(18, 596, 16, "About this app", "#111", 700) + Tx(18, 620, 13, "Free video editor with templates, auto captions,", "#5f6368", 400) + Tx(18, 640, 13, "effects, music and one-tap export.", "#5f6368", 400);
    return s;
  }
  function stLogin() {
    var s = R(0, 0, SW, SH, "#fff") + Tx(18, 20, 12, "9:41", "#111", 600) + stIcon(138, 90, 84) + Tx(180, 220, 22, "Welcome to CapCut", "#111", 700, "middle") + Tx(180, 246, 13, "Sign in to save your projects", "#5f6368", 400, "middle");
    [["Continue with Google", "#fff", "#111"], ["Continue with TikTok", "#fff", "#111"], ["Continue with Facebook", "#fff", "#111"]].forEach(function (b, i) { var y = 296 + i * 64; s += R(28, y, 304, 50, b[1], 25, "#cfd3da") + Tx(180, y + 31, 15, b[0], b[2], 600, "middle"); });
    s += Tx(180, 530, 12, "By continuing you agree to Terms and Privacy Policy", "#8a8f98", 400, "middle");
    return s;
  }
  var SAPP = {
    key: "store", W: SW, H: SH, plat: "mob", cap: "Play Store · phone", defs: "",
    zones: { top: [16, 44, 328, 46], list: [0, 120, 360, 300], bottom: [0, 724, 360, 56] },
    zn: { top: L("Search box", "سرچ باکس", "सर्च बॉक्स"), list: L("Results", "نتائج", "नतीजे"), bottom: L("Menu", "مینو", "मेन्यू") },
    frames: {
      search: { hs: { box: [16, 44, 328, 46], first: [18, 146, 324, 64], inst: [262, 160, 80, 34] } },
      page: { hs: { inst: [18, 280, 324, 44], icon: [18, 100, 84, 84], shots: [18, 372, 324, 190] } },
      installing: { hs: { bar: [18, 280, 270, 44] } },
      done: { hs: { open: [186, 280, 156, 44] } },
      login: { hs: { google: [28, 296, 304, 50] } }
    },
    kw: [
      [/log ?in|sign ?in|google account|account/, "search", [["search", "box", "Search CapCut"], ["page", "inst", "Install"], ["done", "open", "Open"], ["login", "google", "Log in with Google"]]],
      [/open/, "done", [["done", "open", "Open"]]],
      [/./, "search", [["search", "box", "Search CapCut"], ["page", "inst", "Install"], ["installing", "bar", "Installing"], ["done", "open", "Open"]]]
    ]
  };

  /* ============================== CAMERA / SHOT LIST (phone 360x780) ============================== */
  function tileArt(k, x, y, w) {
    var h = w * .78, bg = { wide: "#cfe3f4", medium: "#e8dccb", close: "#e9e0f0", move: "#dbeee3", talk: "#f6e3d4", hero: "#1d1d22", detail: "#2a2430", hand: "#efe3d6", use: "#e0ecf2", around: "#1f2530", owner: "#f0dfd0" }[k] || "#ddd", s = R(x, y, w, h, bg, 10), cxm = x + w / 2, cym = y + h / 2;
    var bottle = function (bx, by, bw, bh, col) { return R(bx, by, bw, bh, col, bw * .18) + R(bx + bw * .3, by - bh * .18, bw * .4, bh * .2, "#222", 3); };
    if (k === "wide") s += R(x, y + h * .66, w, h * .34, "#7fae7a", 0) + C(cxm, y + h * .52, 7, "#444") + R(cxm - 6, y + h * .58, 12, 24, "#44608a", 4) + Pa("M" + x + " " + (y + h * .66) + "l" + w * .25 + " -22l" + w * .2 + " 14l" + w * .25 + " -30l" + w * .3 + " 38z", "#9dc6a0");
    else if (k === "medium") s += C(cxm, y + h * .34, 14, "#8a5a3c") + R(cxm - 26, y + h * .5, 52, h * .5, "#2d4f7a", 14);
    else if (k === "close") s += R(cxm - 22, y + h * .42, 44, 40, "#d9a07a", 14) + R(cxm - 24, y + h * .34, 14, 30, "#d9a07a", 7) + R(cxm - 8, y + h * .3, 14, 32, "#d9a07a", 7) + R(cxm + 8, y + h * .34, 14, 30, "#d9a07a", 7) + R(cxm - 36, y + h * .72, 72, 18, "#8d6a4a", 6);
    else if (k === "move") s += Pa("M" + (x + 16) + " " + (y + h * .7) + "C" + (x + w * .3) + " " + (y + h * .1) + "," + (x + w * .7) + " " + (y + h * .1) + "," + (x + w - 16) + " " + (y + h * .7), 0, "#2f9e6e", 3) + Pa("M" + (x + w - 26) + " " + (y + h * .6) + "l10 12l-14 4", 0, "#2f9e6e", 3) + bottle(cxm - 10, y + h * .4, 20, 34, "#c9a227");
    else if (k === "talk") s += C(cxm - 14, y + h * .5, 16, "#8a5a3c") + R(cxm - 38, y + h * .66, 48, h * .34, "#44608a", 12) + R(cxm + 6, y + 10, 40, 24, "#fff", 8) + Tx(cxm + 26, y + 27, 12, "Hi!", "#111", 700, "middle");
    else if (k === "hero") s += bottle(cxm - 16, y + h * .3, 32, 56, "#c9a227") + R(cxm - 36, y + h * .86, 72, 4, "rgba(255,255,255,.25)", 2);
    else if (k === "detail") s += R(cxm - 36, y + h * .26, 72, 50, "#c9a227", 8) + Tx(cxm, y + h * .58, 12, "AL ASWAD", "#222", 800, "middle") + Tx(cxm, y + h * .74, 8, "EAU DE PARFUM · 50 ML", "#4a3a10", 600, "middle");
    else if (k === "hand") s += bottle(cxm - 12, y + h * .22, 24, 44, "#c9a227") + R(cxm - 26, y + h * .58, 52, 22, "#d9a07a", 11) + R(cxm - 30, y + h * .72, 60, 30, "#d9a07a", 10);
    else if (k === "use") s += C(cxm - 10, y + h * .36, 13, "#8a5a3c") + R(cxm - 30, y + h * .5, 44, h * .5, "#2d4f7a", 12) + Pa("M" + (cxm + 10) + " " + (y + h * .56) + "l20 -14", 0, "#d9a07a", 8) + bottle(cxm + 26, y + h * .26, 14, 26, "#c9a227") + Pa("M" + (cxm + 46) + " " + (y + h * .2) + "l8 -8M" + (cxm + 50) + " " + (y + h * .34) + "l12 0M" + (cxm + 46) + " " + (y + h * .46) + "l8 8", 0, "#6a8caa", 2);
    else if (k === "around") s += bottle(cxm - 10, y + h * .36, 20, 34, "#c9a227") + '<ellipse cx="' + cxm + '" cy="' + (y + h * .6) + '" rx="' + w * .36 + '" ry="' + h * .24 + '" fill="none" stroke="#5fe0c0" stroke-width="3" stroke-dasharray="7 6"/>' + Pa("M" + (cxm + w * .36 - 4) + " " + (y + h * .56) + "l8 10l-12 3", 0, "#5fe0c0", 3);
    else if (k === "owner") s += C(cxm, y + h * .4, 18, "#b8825e") + R(cxm - 32, y + h * .62, 64, h * .38, "#8a3a3a", 14) + Pa("M" + (cxm - 8) + " " + (y + h * .45) + "q8 8 16 0", 0, "#5a2a1a", 2);
    return s;
  }
  var CAMZ = { grid: [0, 80, 360, 620], top: [0, 30, 360, 50], shutter: [110, 706, 140, 70], timer: [110, 36, 140, 36] };
  var SHOTPOS = [0, 1, 2, 3, 4, 5].map(function (i) { return [20 + (i % 2) * 170, 120 + Math.floor(i / 2) * 200, 150, 176]; });
  function camBase(rec) {
    var s = R(0, 0, 360, 780, "#000") + R(0, 80, 360, 620, "#4a5560") + R(0, 80, 360, 620, "rgba(120,150,180,.18)") + R(0, 520, 360, 180, "#2f353b");
    s += Ln(120, 80, 120, 700, "rgba(255,255,255,.5)", 1.2) + Ln(240, 80, 240, 700, "rgba(255,255,255,.5)", 1.2) + Ln(0, 287, 360, 287, "rgba(255,255,255,.5)", 1.2) + Ln(0, 493, 360, 493, "rgba(255,255,255,.5)", 1.2);
    s += C(180, 300, 54, "#c89a74") + R(88, 358, 184, 200, "#35557f", 60) + Pa("M158 345q22 24 44 0", 0, "#a67a58", 3);
    s += C(165, 292, 4, "#222") + C(195, 292, 4, "#222") + Pa("M168 318q12 8 24 0", 0, "#7a3b2b", 2.4) + Tx(40, 284, 11, "eyes here", "#ffd86b", 700) + Ln(100, 287, 148, 287, "#ffd86b", 1.4);
    s += Tx(18, 20, 12, "9:41", "#fff", 600) + Tx(180, 62, 13, "⚙", "#fff", 500, "middle") + Tx(40, 62, 18, "⚡", "#fff", 500, "middle") + Tx(320, 62, 16, "▦", "#ffd86b", 700, "middle");
    s += Tx(120, 692, 12, "PHOTO", "#ccc", 600, "middle") + Tx(180, 692, 12, "VIDEO", "#ffd86b", 700, "middle") + Tx(240, 692, 12, "MORE", "#ccc", 600, "middle");
    s += C(180, 744, 30, "none", "#fff") + (rec ? R(166, 730, 28, 28, "#e53935", 6) : C(180, 744, 24, "#e53935"));
    if (rec) s += R(110, 36, 140, 34, "rgba(229,57,53,.92)", 17) + C(134, 53, 6, "#fff") + Tx(186, 59, 17, "00:12", "#fff", 700, "middle");
    return s;
  }
  function camList(six) {
    var s = R(0, 0, 360, 780, "#f4f6f8") + R(0, 0, 360, 74, "#fff") + Tx(18, 20, 12, "9:41", "#111", 600) + Tx(20, 62, 22, six ? "6 product shots" : "Shot list", "#111", 700) + Tx(20, 106, 13, six ? "Tick each one while you shoot" : "Tick each one while you shoot", "#5f6368", 400);
    var set = six ? [["hero", "1 · Hero"], ["detail", "2 · Detail"], ["hand", "3 · In hand"], ["use", "4 · In use"], ["around", "5 · Moving"], ["owner", "6 · Owner"]] : [["wide", "Wide · 1"], ["medium", "Medium · 1"], ["close", "Close · 3–4"], ["move", "Moving · 2"], ["talk", "Talking · 1–2"]];
    set.forEach(function (t, i) { var p = SHOTPOS[i]; s += R(p[0] - 2, p[1] - 2, p[2] + 4, p[3] + 4, "#fff", 14, "#e1e5ea") + tileArt(t[0], p[0], p[1], p[2]) + Tx(p[0] + 8, p[1] + p[3] - 12, 15, t[1], "#111", 700) + C(p[0] + p[2] - 16, p[1] + p[3] - 18, 9, "none", "#2f9e6e"); });
    return s;
  }
  var KAPP = {
    key: "camera", W: 360, H: 780, plat: "mob", cap: "Phone camera", defs: "",
    zones: { grid: CAMZ.grid, top: CAMZ.top, shutter: CAMZ.shutter, timer: CAMZ.timer, s1: SHOTPOS[0], s2: SHOTPOS[1], s3: SHOTPOS[2], s4: SHOTPOS[3], s5: SHOTPOS[4], s6: SHOTPOS[5], w1: SHOTPOS[0], w2: SHOTPOS[1], w3: SHOTPOS[2], w4: SHOTPOS[3], w5: SHOTPOS[4] },
    zn: { grid: L("Grid", "گرڈ", "ग्रिड"), top: L("Camera settings", "کیمرہ سیٹنگز", "कैमरा सेटिंग्स"), shutter: L("Record button", "ریکارڈ بٹن", "रिकॉर्ड बटन"), timer: L("Timer", "ٹائمر", "टाइमर"), s1: L("Hero", "ہیرو", "हीरो"), s2: L("Detail", "تفصیل", "डिटेल"), s3: L("Hand", "ہاتھ", "हाथ"), s4: L("Used", "استعمال", "इस्तेमाल"), s5: L("Moving", "حرکت", "मूविंग"), s6: L("Owner", "مالک", "मालिक"), w1: L("Wide", "وائیڈ", "वाइड"), w2: L("Medium", "میڈیم", "मीडियम"), w3: L("Close", "کلوز", "क्लोज़"), w4: L("Moving", "حرکت", "मूविंग"), w5: L("Talking", "بات", "बात") },
    frames: { cam: { hs: { grid: CAMZ.grid, top: CAMZ.top, shutter: CAMZ.shutter } }, rec: { hs: { timer: CAMZ.timer, shutter: CAMZ.shutter } }, list5: { hs: {} }, list6: { hs: {} } },
    kw: [[/\brec\b/, "rec", []], [/\blist5\b/, "list5", []], [/\blist6\b/, "list6", []]]
  };
  /* ============================== GOOGLE FORMS / GOOGLE DRIVE / YOUTUBE STUDIO (laptop 1600x900) ============================== */
  var GW = 1600, GH = 900, GOOG = ["#4285f4", "#ea4335", "#fbbc05", "#34a853"];
  var RAD = function (x, y, on) { return C(x, y, 9, "#fff", "#5f6368") + (on ? C(x, y, 5, "#673ab7") : ""); };
  function fmTop() { return R(0, 0, GW, 64, "#fff", 0, "#e0e0e0") + R(24, 16, 26, 32, "#673ab7", 4) + Tx(66, 40, 19, "Client Brief", "#202124", 500) + Tx(1250, 40, 15, "Questions  ·  Responses", "#5f6368", 500) + R(1470, 12, 110, 40, "#673ab7", 20) + Tx(1525, 38, 16, "Send", "#fff", 600, "middle"); }
  function fmForm() {
    var s = R(0, 0, GW, GH, "#f0ebf8") + fmTop() + R(400, 100, 800, 170, "#fff", 10) + R(400, 100, 800, 10, "#673ab7", 0) + Tx(430, 170, 36, "Client Brief", "#202124", 400) + Tx(430, 215, 16, "Please fill this before we start. It takes 2 minutes.", "#5f6368", 400);
    s += R(400, 290, 800, 110, "#fff", 10, "#dadce0") + Tx(430, 330, 18, "Brand name", "#202124", 500) + Ln(430, 376, 760, 376, "#bdc1c6", 1.5) + Tx(430, 368, 14, "Short answer text", "#80868b", 400);
    s += R(400, 420, 800, 130, "#fff", 10, "#dadce0") + Tx(430, 460, 18, "What do you sell, and to whom?", "#202124", 500) + Ln(430, 520, 1000, 520, "#bdc1c6", 1.5) + Tx(430, 512, 14, "Long answer text", "#80868b", 400);
    s += R(400, 570, 800, 180, "#fff", 10, "#673ab7") + Tx(430, 610, 18, "Which platform?", "#202124", 500) + ["Instagram", "YouTube", "Facebook"].map(function (p, i) { return RAD(442, 648 + i * 36, i === 0) + Tx(466, 654 + i * 36, 16, p, "#202124", 400); }).join("");
    s += R(400, 770, 800, 110, "#fff", 10, "#dadce0") + Tx(430, 810, 18, "How many videos a month?", "#202124", 500) + Ln(430, 856, 640, 856, "#bdc1c6", 1.5);
    s += R(1230, 580, 56, 150, "#fff", 8, "#dadce0") + Tx(1258, 616, 24, "+", "#5f6368", 400, "middle") + Tx(1258, 662, 20, "T", "#5f6368", 500, "middle") + Tx(1258, 708, 18, "▭", "#5f6368", 500, "middle");
    return s;
  }
  function fmSend() { return fmForm() + R(0, 64, GW, GH - 64, "rgba(0,0,0,.45)") + R(520, 200, 560, 330, "#fff", 12) + Tx(552, 250, 22, "Send form", "#202124", 500) + Tx(552, 300, 15, "Send via   ✉ Email    🔗 Link    </>", "#5f6368", 500) + Tx(552, 350, 15, "Link", "#5f6368", 500) + R(552, 364, 496, 44, "#f1f3f4", 6) + Tx(566, 392, 14, "https://forms.gle/brief-client", "#202124", 400) + R(552, 450, 140, 44, "#673ab7", 22) + Tx(622, 478, 15, "Copy", "#fff", 600, "middle") + Tx(990, 478, 15, "Cancel", "#673ab7", 600, "middle"); }
  var FMAPP = {
    key: "forms", W: GW, H: GH, plat: "pc", cap: "Google Forms · laptop", defs: "",
    zones: { form: [400, 100, 800, 650], send: [1470, 12, 110, 40], q1: [400, 290, 800, 110], q2: [400, 420, 800, 130], q3: [400, 570, 800, 180] },
    zn: { form: L("Your form", "آپ کا فارم", "आपका फ़ॉर्म"), send: L("Send", "بھیجیں", "भेजें"), q1: L("Question 1", "سوال 1", "सवाल 1"), q2: L("Question 2", "سوال 2", "सवाल 2"), q3: L("Question 3", "سوال 3", "सवाल 3") },
    frames: { form: { hs: { send: [1470, 12, 110, 40], q1: [400, 290, 800, 110], q3: [400, 570, 800, 180] } }, send: { hs: { copy: [552, 450, 140, 44], link: [552, 364, 496, 44] } } },
    kw: [[/send|share|link|agree|write it/, "form", [["form", "send", "Send"], ["send", "copy", "Copy link"]]], [/./, "form", [["form", "q1", "Add a question"]]]]
  };
  function drTop() { return R(0, 0, GW, GH, "#f8fafd") + R(0, 0, GW, 64, "#f8fafd") + R(24, 14, 36, 36, "#fff", 8) + GOOG.map(function (c, i) { return R(30 + (i % 2) * 14, 20 + Math.floor(i / 2) * 14, 12, 12, c, 3); }).join("") + Tx(76, 40, 22, "Drive", "#5f6368", 500) + R(300, 10, 700, 44, "#e9eef6", 22) + Tx(340, 38, 16, "Search in Drive", "#5f6368", 400); }
  function drFiles() {
    var s = drTop() + R(24, 90, 150, 56, "#c2e7ff", 16) + Tx(99, 125, 17, "+ New", "#001d35", 600, "middle");
    ["My Drive", "Computers", "Shared with me", "Recent", "Starred"].forEach(function (t, i) { s += Tx(48, 190 + i * 44, 16, t, i === 0 ? "#001d35" : "#444746", i === 0 ? 700 : 400); });
    s += R(230, 90, 1340, 780, "#fff", 18) + Tx(260, 140, 22, "My Drive", "#1f1f1f", 400) + Ln(250, 170, 1550, 170, "#e0e0e0", 1) + Tx(260, 200, 14, "Name", "#5f6368", 600) + Tx(1100, 200, 14, "Owner", "#5f6368", 600) + Tx(1300, 200, 14, "Last modified", "#5f6368", 600);
    [["brand-reel1-v1.mp4", 1], ["brand-reel1-final.mp4", 0], ["Client Brief (Responses)", 0], ["Raw clips", 0]].forEach(function (f, i) { var y = 220 + i * 56; s += R(240, y, 1320, 52, f[1] ? "#c2e7ff" : "#fff", 8) + R(262, y + 14, 24, 24, i === 3 ? "#5f6368" : "#d93025", 4) + Tx(304, y + 33, 17, f[0], "#1f1f1f", 400) + Tx(1100, y + 33, 15, "me", "#5f6368", 400) + Tx(1300, y + 33, 15, "Today", "#5f6368", 400); });
    s += R(1360, 120, 44, 44, "#e8eaed", 22) + Tx(1382, 150, 20, "👤+", "#444746", 500, "middle");
    return s;
  }
  function drShare() {
    return drFiles() + R(0, 0, GW, GH, "rgba(0,0,0,.4)") + R(480, 170, 640, 500, "#fff", 24) + Tx(520, 230, 24, "Share “brand-reel1-v1.mp4”", "#1f1f1f", 400) + R(520, 260, 560, 48, "#fff", 6, "#747775") + Tx(536, 290, 16, "Add people, groups, and calendar events", "#5f6368", 400) +
      Tx(520, 360, 17, "General access", "#1f1f1f", 600) + R(520, 380, 560, 76, "#f0f4f9", 10) + C(560, 418, 20, "#c4eed0") + Tx(560, 424, 16, "🌐", "#0b6a0b", 500, "middle") + Tx(600, 412, 16, "Anyone with the link", "#1f1f1f", 600) + Tx(600, 436, 13, "Anyone on the internet with the link can view", "#5f6368", 400) + Tx(1010, 424, 15, "Viewer ▾", "#1f1f1f", 500) +
      R(520, 600, 160, 44, "#fff", 22, "#747775") + Tx(600, 628, 15, "🔗 Copy link", "#0b57d0", 600, "middle") + R(980, 600, 100, 44, "#0b57d0", 22) + Tx(1030, 628, 15, "Done", "#fff", 600, "middle");
  }
  var DRAPP = {
    key: "drive", W: GW, H: GH, plat: "pc", cap: "Google Drive · laptop", defs: "",
    zones: { list: [240, 220, 1320, 220], share: [1360, 120, 44, 44], file: [240, 220, 1320, 52] },
    zn: { list: L("Your files", "آپ کی فائلیں", "आपकी फ़ाइलें"), share: L("Share", "شیئر", "शेयर"), file: L("The video file", "ویڈیو فائل", "वीडियो फ़ाइल") },
    frames: { files: { hs: { file: [240, 220, 1320, 52], share: [1360, 120, 44, 44] } }, share: { hs: { access: [520, 380, 560, 76], copy: [520, 600, 160, 44], done: [980, 600, 100, 44] } } },
    kw: [[/./, "files", [["files", "file", "Right-click the file"], ["files", "share", "Share"], ["share", "access", "Anyone with the link"], ["share", "copy", "Copy link"]]]]
  };
  function ytTop() { return R(0, 0, GW, GH, "#f9f9f9") + R(0, 0, GW, 56, "#fff", 0, "#e0e0e0") + R(24, 16, 36, 26, "#ff0000", 7) + Pa("M38 22l10 7-10 7z", "#fff") + Tx(72, 38, 20, "Studio", "#0f0f0f", 600) + R(1440, 10, 120, 38, "#fff", 19, "#cfcfcf") + Tx(1500, 35, 15, "＋ Create", "#0f0f0f", 600, "middle"); }
  function ytDialog(body, step) {
    return ytTop() + R(0, 56, GW, GH - 56, "rgba(0,0,0,.45)") + R(220, 90, 1160, 740, "#fff", 12) + Tx(250, 140, 22, "brand-reel1-final.mp4", "#0f0f0f", 600) + Ln(220, 170, 1380, 170, "#e0e0e0", 1) +
      ["Details", "Video elements", "Checks", "Visibility"].map(function (t, i) { return C(420 + i * 250, 206, 11, i <= step ? "#065fd4" : "#cfcfcf") + Tx(420 + i * 250, 211, 12, i + 1, "#fff", 700, "middle") + Tx(440 + i * 250, 211, 15, t, i === step ? "#0f0f0f" : "#606060", i === step ? 700 : 400); }).join("") + Ln(220, 240, 1380, 240, "#e0e0e0", 1) + body +
      R(1250, 770, 100, 40, "#065fd4", 20) + Tx(1300, 796, 15, step === 3 ? "Publish" : "Next", "#fff", 600, "middle");
  }
  function ytDetails() {
    return ytDialog(Tx(250, 290, 24, "Details", "#0f0f0f", 700) + R(250, 310, 700, 90, "#fff", 8, "#909090") + Tx(266, 336, 12, "Title (required)", "#606060", 400) + Tx(266, 374, 17, "How I made this reel in CapCut | Easy tutorial", "#0f0f0f", 400) + R(250, 420, 700, 160, "#fff", 8, "#909090") + Tx(266, 446, 12, "Description", "#606060", 400) + Tx(266, 482, 15, "In this video you will learn…", "#0f0f0f", 400) +
      Tx(250, 625, 17, "Thumbnail", "#0f0f0f", 700) + R(250, 640, 190, 106, "#fff", 8, "#909090").replace("<rect", '<rect stroke-dasharray="5 4"') + Tx(345, 700, 13, "Upload thumbnail", "#606060", 500, "middle") + R(980, 290, 340, 190, "#222", 8) + Pa("M1130 360l50 25-50 25z", "#fff") + Tx(980, 505, 13, "Video link", "#606060", 400) + Tx(980, 527, 14, "https://youtu.be/AbC123", "#065fd4", 400), 0);
  }
  function ytVis() {
    return ytDialog(Tx(250, 290, 24, "Visibility", "#0f0f0f", 700) + Tx(250, 322, 15, "Choose when to publish and who can see your video", "#606060", 400) + R(250, 350, 700, 250, "#fff", 8, "#cfcfcf") + ["Private", "Unlisted", "Public"].map(function (p, i) { return RAD(290, 400 + i * 70, i === 2) + Tx(320, 406 + i * 70, 17, p, "#0f0f0f", 600) + Tx(420, 406 + i * 70, 14, ["Only you and people you choose", "Anyone with the link", "Everyone can watch"][i], "#606060", 400); }).join(""), 3);
  }
  var YTAPP = {
    key: "yt", W: GW, H: GH, plat: "pc", cap: "YouTube Studio · laptop", defs: "",
    zones: { title: [250, 310, 700, 90], thumb: [250, 640, 190, 106], vis: [250, 350, 700, 250], next: [1250, 770, 100, 40] },
    zn: { title: L("Title", "ٹائٹل", "टाइटल"), thumb: L("Thumbnail", "تھمب نیل", "थंबनेल"), vis: L("Visibility", "ویزیبلٹی", "विज़िबिलिटी"), next: L("Next", "اگلا", "अगला") },
    frames: { details: { hs: { title: [250, 310, 700, 90], thumb: [250, 640, 190, 106], next: [1250, 770, 100, 40] } }, vis: { hs: { public: [250, 510, 700, 60], publish: [1250, 770, 100, 40] } } },
    kw: [[/publish|public|visib|schedule/, "details", [["details", "next", "Next"], ["vis", "public", "Public"], ["vis", "publish", "Publish"]]], [/thumb/, "details", [["details", "thumb", "Upload thumbnail"]]], [/./, "details", [["details", "title", "Write a clear title"]]]]
  };
  var APPS = { canva: CAPP, insta: IAPP, gpt: GAPP, zoom: ZAPP, store: SAPP, camera: KAPP, forms: FMAPP, drive: DRAPP, yt: YTAPP };
  var DRAW = {
    canva: CF, insta: { profile: inProfile, settings: inSettings, type: inType, reel: inReel, caption: inCaption, insights: inInsights, active: inActive, viewreel: inViewReel },
    gpt: { chat: gptChat, result: gptResult }, store: { search: stSearch, page: function () { return stPage(); }, installing: function () { return stPage('installing'); }, done: function () { return stPage('done'); }, login: stLogin }, camera: { cam: function () { return camBase(false); }, rec: function () { return camBase(true); }, list5: function () { return camList(false); }, list6: function () { return camList(true); } }, zoom: { meeting: function () { return zmMeeting(false); }, share: function () { return zmMeeting(true); } },
    forms: { form: fmForm, send: fmSend }, drive: { files: drFiles, share: drShare }, yt: { details: ytDetails, vis: ytVis }
  };
  var DEFAULT_FRAME = { canva: "editor", insta: "profile", gpt: "chat", zoom: "meeting", store: "search", camera: "cam", forms: "form", drive: "files", yt: "details" };
  var HLZ = { canva: { top: "file" }, insta: {}, gpt: {}, zoom: {}, store: {}, camera: {}, forms: {}, drive: {}, yt: {} };

  /* ============================== build a pane ============================== */
  var esc2 = function (s) { return (typeof esc === "function" ? esc(s) : String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; })); };
  var pickL = function (o) { return typeof pick === "function" ? pick(o) : (o && o.en) || ""; };
  var pct = function (v, t) { return (v / t * 100).toFixed(3) + "%"; };
  function words(d) { return ((d.btn || "") + " " + (d.tab || "") + " " + (d.sub || "")).toLowerCase(); }
  function build(app, d) {
    var A = APPS[app], w = words(d), hl = [].concat(d.hl || []), frames = [], rings = [], hsFlow = null;
    function fi(name) { var i = frames.indexOf(name); if (i < 0) { frames.push(name); i = frames.length - 1; } return i; }
    for (var i = 0; i < A.kw.length; i++) { if (A.kw[i][0].test(w)) { hsFlow = A.kw[i]; break; } }
    var base = hsFlow ? hsFlow[1] : DEFAULT_FRAME[app]; fi(base);
    hl.forEach(function (k) {
      if (!A.zones[k]) return;
      if (hsFlow && hsFlow[2].some(function (st) { return st[1] === k && st[0] === base; })) return; /* frame has its own, more exact zone */
      rings.push({ z: A.zones[k], f: 0, k: k, l: A.zn[k] ? pickL(A.zn[k]) : "" });
    });
    if (hsFlow) hsFlow[2].forEach(function (st, j) {
      var h = A.frames[st[0]] && A.frames[st[0]].hs[st[1]]; if (!h) return;
      var f = fi(st[0]); rings.push({ z: h, f: f, l: st[2] });
    });
    if (!rings.length) rings.push({ z: [0, 0, A.W, A.H], f: 0, l: "" });
    return { A: A, base: base, frames: frames, rings: rings };
  }
  function appPane(app, d) {
    var P = build(app, d), A = P.A, W = A.W, H = A.H;
    var imgs = P.frames.map(function (f, k) { return '<div class="uimg app' + (k === 0 ? " on" : "") + '" data-f="' + k + '" data-sf="' + f + '">' + svg(W, H, DRAW[app][f](), A.defs) + "</div>"; }).join("");
    var rg = P.rings.map(function (r) { var z = r.z; return '<i class="uhl' + (r.f ? "" : " f0") + '"' + (r.k ? ' data-k="' + r.k + '"' : "") + ' data-z="' + z.join(",") + '" data-f="' + r.f + '" data-l="' + esc2(r.l || "") + '" style="left:' + pct(z[0], W) + ";top:" + pct(z[1], H) + ";width:" + pct(z[2], W) + ";height:" + pct(z[3], H) + '"></i>'; }).join("");
    var cur = '<b class="ucur" style="left:0;top:0"><svg viewBox="0 0 40 44"><g transform="translate(8 8)"><circle class="uclick" cx="0" cy="0" r="9"/><path d="M0 0v18.5l4.6-4.3 3.4 7.9 3.4-1.5-3.3-7.7H14.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></g></svg></b>';
    var tip = d.btn ? '<div class="uclk on" data-i="👆 ' + esc2(d.btn) + '">👆 ' + esc2(d.btn) + "</div>" : '<div class="uclk"></div>';
    var steps = d.steps && d.steps.length ? '<ol class="usteps">' + d.steps.map(function (s) { return '<li data-en="' + esc2(s.en || "") + '">' + esc2(pickL(s)) + "</li>"; }).join("") + "</ol>" : "";
    var where = (d.hl || []).filter(function (k) { return A.zn[k]; }).map(function (k) { return esc2(pickL(A.zn[k])); }).join(" · ");
    return '<div class="upane" data-p="' + A.plat + '" data-app="' + app + '"><div class="uscr ' + A.plat + ' app" style="aspect-ratio:' + W + "/" + H + '" role="img" aria-label="' + esc2(A.cap) + '"><div class="uzoom" data-w="' + W + '" data-h="' + H + '">' + imgs + rg + cur + "</div>" + tip + "</div>" + (where ? '<div class="uwhere">📍 ' + where + "</div>" : "") + steps + "</div>";
  }
  function appHTML(v) {
    var app = v.ui, A = APPS[app];
    return '<figure class="viz uimap cc" data-cur="' + A.plat + '"><div class="uicap">' + (A.plat === "mob" ? "📱 " : "🖥️ ") + esc2(A.cap) + "</div>" + appPane(app, { hl: v.hl, btn: v.btn, steps: v.steps, sub: v.sub, tab: v.tab }) + "</figure>";
  }
  window.QSApps = { html: appHTML, has: function (ui) { return !!APPS[ui]; }, apps: APPS, draw: DRAW, svg: svg };

  window.camV = function (m) {
    var t = ((m && m.en) || "").toLowerCase(), lid = ""; try { lid = (LESSON && LESSON.id) || ""; } catch (e) {}
    if (lid[0] === "v") return null;
    if (/phone standing up|eye level|one third from the top|grid in (the )?camera/.test(t)) return { ui: "camera", hl: ["grid", "top"], tab: "cam", btn: "" };
    if (/to your camera|watch it back/.test(t)) return { ui: "camera", hl: ["timer", "shutter"], tab: "rec", btn: "" };
    if (/shot list|wide shot|medium shot|close shots/.test(t)) return { ui: "camera", hl: ["w1", "w2", "w3", "w4", "w5"], tab: "list5", btn: "" };
    if (/six shots|hero shot|product being used|camera going around/.test(t)) return { ui: "camera", hl: /\b(four|five|six)\b/.test(t) ? ["s4", "s5", "s6"] : ["s1", "s2", "s3"], tab: "list6", btn: "" };
    return null;
  };
  window.storeV = function (m) {
    var t = ((m && m.en) || "").toLowerCase();
    if (!/play store|app store|\binstall\b|download capcut|download (the )?app/.test(t)) return null;
    if (/export|save (the )?video|gallery/.test(t) && !/play store|app store|install/.test(t)) return null;
    return { ui: "store", hl: ["top"], btn: /log ?in|sign ?in|google/.test(t) ? "Log in with Google" : "Install CapCut" };
  };
  /* a lesson step that only mentions a tool in words gets a screen too */
  window.autoV = function (m) {
    if (!m || m.v) return null;
    var t = ((m.en || "") + " ").toLowerCase(), lid = "";
    try { lid = (LESSON && LESSON.id) || ""; } catch (e) {}
    var first = function (res) { var best = null, bi = 1e9; res.forEach(function (r) { var i = t.search(r[0]); if (i >= 0 && i < bi) { bi = i; best = r[1]; } }); return best; };
    if (/\b(homework|project \d|test \d|final project|your practice|practice today)\b/.test(t)) return { ui: "board", txt: { en: m.en, ur: m.ur, hi: m.hi } };
    var talk = /^(today|homework|project|week|end of|look back|what next|welcome|assalamu|quick revision|then answer|bring|final project)\b/.test(t.trim());
    if (talk) return { ui: "board", txt: { en: m.en, ur: m.ur, hi: m.hi } };
    var igUi = lid[0] === "v" ? /insight|trial reel|collab|paid partnership|professional account/.test(t) : /insight|profile|bio|hashtag|caption|trial|collab|paid partnership|highlight|professional account|algorithm|watch time|sends|swipe|followers|most active|reach/.test(t);
    var tool = first([[/chatgpt|chat gpt/, "gpt"], [/\bzoom (meeting|class|pro|call|link|room)|\bon zoom\b/, "zoom"], [/canva/, "canva"], [/google forms?/, "forms"], [/google drive/, "drive"], [/youtube (studio|upload|title|description)|upload (it |the video )?to youtube|publish (it )?(on|to) youtube/, "yt"], [/instagram|insta\b|trial reel|\breels?\b/, "insta"], [/capcut/, "desk"]]);
    var edit = /\b(cut|trim|split|clip|zoom in|zoom out|transition|speed|slow motion|caption|subtitle|filter|colou?r grade|keyframe|effect|b-roll|overlay|volume|beat|timeline|export|jump cut|ducking|stabili[sz]e|crop|ratio)\b/.test(t);
    if (tool === "gpt") return { ui: "gpt", hl: /upload|photo|background|prompt|image|picture/.test(t) ? ["composer"] : ["chat"], btn: /upload|photo|background/.test(t) ? "Upload your photo" : "Type your prompt" };
    if (tool === "zoom") return { ui: "zoom", hl: /record/.test(t) ? ["rec"] : /share/.test(t) ? ["share"] : ["bar"], btn: /record/.test(t) ? "Record" : /share/.test(t) ? "Share Screen" : "" };
    if (tool === "forms") return { ui: "forms", hl: ["form"], btn: /send|share|link/.test(t) ? "Send" : "Add a question" };
    if (tool === "drive") return { ui: "drive", hl: ["list"], btn: "Share" };
    if (tool === "yt") return { ui: "yt", hl: /thumb/.test(t) ? ["thumb"] : ["title"], btn: /thumb/.test(t) ? "Upload thumbnail" : "Write a clear title" };
    if (tool === "canva") return { ui: "canva", hl: ["canvas"], btn: /upload/.test(t) ? "Uploads" : /download|export/.test(t) ? "Share → Download" : "" };
    if (tool === "insta" && !edit && igUi) return { ui: "insta", hl: /signals|swipe|watch time|sends|likes|reach/.test(t) ? ["side"] : ["top"], btn: /signals|swipe|watch time|sends|likes|reach/.test(t) ? "Watch time · Sends" : /insight|views|analytics/.test(t) ? "Insights" : /profile|bio|name|photo/.test(t) ? "Edit profile" : /caption|hashtag/.test(t) ? "Caption" : /trial|collab|paid/.test(t) ? "Invite collaborator" : "" };
    if ((lid[0] === "v" && (edit || tool === "desk"))) return { ui: "desk", hl: ["timeline"], btn: "" };
    if (/^(?:today|homework|project)/.test(t.trim()) || true) return { ui: "board", txt: { en: m.en, ur: m.ur, hi: m.hi } };
    return null;
  };

  var css = document.createElement("style"); css.textContent = ".uscr.app,.uimg.app,.uimg.app svg{direction:ltr}.uimg.app{background:#111}.uimg.app svg{display:block;width:100%;height:100%}.uscr.app{background:#111}.uscr.mob.app{max-width:340px;margin:0 auto}";
  document.head.appendChild(css);
})();

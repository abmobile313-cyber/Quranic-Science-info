/* CapCut screens for PC and mobile — our own drawing that follows the real CapCut layout (menus, panels, timeline, bottom toolbar),
   with a PC / Mobile switch on every screen. A lesson step is { ui: "desk" | "phone", hl: [zones], btn: "Button name", steps: [{en,ur,hi}], alt: {same fields for the other device} } */
(function () {
  "use strict";
  var oldUI = uiHTML;
  var PZ = { top: [0, 0, 480, 24], export: [408, 3, 66, 18], media: [6, 26, 146, 146], player: [156, 26, 172, 146], props: [332, 26, 142, 146], toolbar: [6, 174, 468, 18], timeline: [6, 194, 468, 102] };
  var MZ = { top: [8, 8, 284, 28], export: [226, 10, 64, 24], player: [14, 40, 272, 158], timeline: [8, 222, 284, 92], toolbar: [6, 326, 288, 84] };
  var ZN = {
    media: { en: "Media panel", ur: "میڈیا پینل", hi: "मीडिया पैनल" }, player: { en: "Player", ur: "پلیئر", hi: "प्लेयर" }, props: { en: "Settings panel", ur: "سیٹنگز پینل", hi: "सेटिंग्स पैनल" },
    toolbar: { en: "Tools", ur: "ٹولز", hi: "टूल्स" }, timeline: { en: "Timeline", ur: "ٹائم لائن", hi: "टाइमलाइन" }, export: { en: "Export", ur: "ایکسپورٹ", hi: "एक्सपोर्ट" }, top: { en: "Top bar", ur: "اوپر کی پٹی", hi: "ऊपर की पट्टी" }
  };
  var TABN = { pc: { en: "💻 PC / Laptop", ur: "💻 پی سی / لیپ ٹاپ", hi: "💻 पीसी / लैपटॉप" }, mob: { en: "📱 Mobile", ur: "📱 موبائل", hi: "📱 मोबाइल" } };
  var CAP = { pc: "CapCut · PC", mob: "CapCut · Mobile" };
  var T = function (o) { return esc(pick(o)); };
  var gid = 0;

  /* ---------------- shared bits ---------------- */
  function frameArt(x, y, w, h, id) { /* a pretend video frame: sky, hills, a person */
    return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#sk' + id + ')"/>' +
      '<path d="M' + x + ' ' + (y + h * .72) + 'Q' + (x + w * .3) + ' ' + (y + h * .52) + ' ' + (x + w * .55) + ' ' + (y + h * .7) + 'T' + (x + w) + ' ' + (y + h * .62) + 'V' + (y + h) + 'H' + x + 'Z" fill="#2c5d4a"/>' +
      '<circle cx="' + (x + w * .5) + '" cy="' + (y + h * .42) + '" r="' + (h * .1) + '" fill="#e9b88f"/><path d="M' + (x + w * .5 - h * .17) + ' ' + (y + h * .78) + 'q' + (h * .17) + ' -' + (h * .3) + ' ' + (h * .34) + ' 0V' + (y + h) + 'H' + (x + w * .5 - h * .17) + 'Z" fill="#b5532f"/></g>';
  }
  function defs(id) {
    return '<defs><linearGradient id="sk' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8e6"/><stop offset="1" stop-color="#d8e8f5"/></linearGradient>' +
      '<linearGradient id="ex' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#31e8e0"/><stop offset="1" stop-color="#1aa7ff"/></linearGradient>' +
      '<linearGradient id="th' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b7aa8"/><stop offset="1" stop-color="#d7a98a"/></linearGradient></defs>';
  }
  function icon(kind, x, y, s, col) { /* tiny line icons, s = size */
    var c = col || "#cfd6dd", h = s / 2, st = 'fill="none" stroke="' + c + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"';
    var g = '<g transform="translate(' + x + ' ' + y + ')" ' + st + '>';
    switch (kind) {
      case "edit": g += '<path d="M' + (s * .2) + ' ' + (s * .8) + 'L' + (s * .2) + ' ' + (s * .62) + 'L' + (s * .66) + ' ' + (s * .16) + 'L' + (s * .84) + ' ' + (s * .34) + 'L' + (s * .38) + ' ' + (s * .8) + 'Z"/>'; break;
      case "audio": g += '<path d="M' + (s * .35) + ' ' + (s * .75) + 'V' + (s * .22) + 'L' + (s * .78) + ' ' + (s * .14) + 'V' + (s * .66) + '"/><circle cx="' + (s * .27) + '" cy="' + (s * .76) + '" r="' + (s * .1) + '"/><circle cx="' + (s * .7) + '" cy="' + (s * .67) + '" r="' + (s * .1) + '"/>'; break;
      case "text": g += '<path d="M' + (s * .2) + ' ' + (s * .24) + 'H' + (s * .8) + 'M' + (s * .5) + ' ' + (s * .24) + 'V' + (s * .8) + '"/>'; break;
      case "sticker": g += '<circle cx="' + h + '" cy="' + h + '" r="' + (s * .32) + '"/><path d="M' + (s * .36) + ' ' + (s * .56) + 'q' + (s * .14) + ' ' + (s * .12) + ' ' + (s * .28) + ' 0"/>'; break;
      case "overlay": g += '<rect x="' + (s * .16) + '" y="' + (s * .2) + '" width="' + (s * .46) + '" height="' + (s * .46) + '" rx="3"/><rect x="' + (s * .36) + '" y="' + (s * .36) + '" width="' + (s * .46) + '" height="' + (s * .46) + '" rx="3"/>'; break;
      case "effects": g += '<path d="M' + h + ' ' + (s * .14) + 'L' + (s * .6) + ' ' + (s * .4) + 'L' + (s * .86) + ' ' + h + 'L' + (s * .6) + ' ' + (s * .6) + 'L' + h + ' ' + (s * .86) + 'L' + (s * .4) + ' ' + (s * .6) + 'L' + (s * .14) + ' ' + h + 'L' + (s * .4) + ' ' + (s * .4) + 'Z"/>'; break;
      case "captions": g += '<rect x="' + (s * .14) + '" y="' + (s * .24) + '" width="' + (s * .72) + '" height="' + (s * .52) + '" rx="3"/><path d="M' + (s * .26) + ' ' + (s * .46) + 'H' + (s * .5) + 'M' + (s * .26) + ' ' + (s * .6) + 'H' + (s * .7) + '"/>'; break;
      case "filters": g += '<circle cx="' + (s * .38) + '" cy="' + (s * .4) + '" r="' + (s * .22) + '"/><circle cx="' + (s * .62) + '" cy="' + (s * .4) + '" r="' + (s * .22) + '"/><circle cx="' + h + '" cy="' + (s * .64) + '" r="' + (s * .22) + '"/>'; break;
      case "format": g += '<rect x="' + (s * .2) + '" y="' + (s * .16) + '" width="' + (s * .6) + '" height="' + (s * .68) + '" rx="3"/><path d="M' + (s * .2) + ' ' + (s * .4) + 'H' + (s * .8) + '"/>'; break;
      case "adjust": g += '<path d="M' + (s * .2) + ' ' + (s * .3) + 'H' + (s * .8) + 'M' + (s * .2) + ' ' + (s * .7) + 'H' + (s * .8) + '"/><circle cx="' + (s * .4) + '" cy="' + (s * .3) + '" r="' + (s * .08) + '"/><circle cx="' + (s * .6) + '" cy="' + (s * .7) + '" r="' + (s * .08) + '"/>'; break;
      case "media": g += '<rect x="' + (s * .14) + '" y="' + (s * .22) + '" width="' + (s * .72) + '" height="' + (s * .56) + '" rx="3"/><path d="M' + (s * .2) + ' ' + (s * .7) + 'L' + (s * .42) + ' ' + (s * .46) + 'L' + (s * .56) + ' ' + (s * .6) + 'L' + (s * .66) + ' ' + (s * .5) + 'L' + (s * .82) + ' ' + (s * .7) + '"/>'; break;
      case "trans": g += '<path d="M' + (s * .16) + ' ' + (s * .3) + 'H' + (s * .62) + 'L' + (s * .5) + ' ' + (s * .18) + 'M' + (s * .84) + ' ' + (s * .7) + 'H' + (s * .38) + 'L' + (s * .5) + ' ' + (s * .82) + '"/>'; break;
      case "split": g += '<path d="M' + h + ' ' + (s * .12) + 'V' + (s * .88) + '"/><path d="M' + (s * .22) + ' ' + (s * .3) + 'L' + (s * .4) + ' ' + h + 'L' + (s * .22) + ' ' + (s * .7) + 'M' + (s * .78) + ' ' + (s * .3) + 'L' + (s * .6) + ' ' + h + 'L' + (s * .78) + ' ' + (s * .7) + '"/>'; break;
      case "trash": g += '<path d="M' + (s * .22) + ' ' + (s * .28) + 'H' + (s * .78) + 'M' + (s * .4) + ' ' + (s * .28) + 'V' + (s * .18) + 'H' + (s * .6) + 'V' + (s * .28) + 'M' + (s * .28) + ' ' + (s * .28) + 'L' + (s * .33) + ' ' + (s * .84) + 'H' + (s * .67) + 'L' + (s * .72) + ' ' + (s * .28) + '"/>'; break;
      case "speed": g += '<path d="M' + (s * .16) + ' ' + (s * .72) + 'A' + (s * .34) + ' ' + (s * .34) + ' 0 1 1 ' + (s * .84) + ' ' + (s * .72) + '"/><path d="M' + h + ' ' + (s * .66) + 'L' + (s * .66) + ' ' + (s * .36) + '"/>'; break;
      case "vol": g += '<path d="M' + (s * .18) + ' ' + (s * .4) + 'H' + (s * .34) + 'L' + (s * .56) + ' ' + (s * .22) + 'V' + (s * .78) + 'L' + (s * .34) + ' ' + (s * .6) + 'H' + (s * .18) + 'Z"/><path d="M' + (s * .68) + ' ' + (s * .38) + 'q' + (s * .1) + ' ' + (s * .12) + ' 0 ' + (s * .24) + '"/>'; break;
      case "anim": g += '<path d="M' + (s * .2) + ' ' + (s * .7) + 'L' + h + ' ' + (s * .2) + 'L' + (s * .8) + ' ' + (s * .7) + 'Z"/>'; break;
      case "copy": g += '<rect x="' + (s * .3) + '" y="' + (s * .3) + '" width="' + (s * .5) + '" height="' + (s * .5) + '" rx="3"/><path d="M' + (s * .2) + ' ' + (s * .62) + 'V' + (s * .2) + 'H' + (s * .62) + '"/>'; break;
      case "freeze": g += '<path d="M' + h + ' ' + (s * .14) + 'V' + (s * .86) + 'M' + (s * .18) + ' ' + (s * .3) + 'L' + (s * .82) + ' ' + (s * .7) + 'M' + (s * .82) + ' ' + (s * .3) + 'L' + (s * .18) + ' ' + (s * .7) + '"/>'; break;
      case "mic": g += '<rect x="' + (s * .38) + '" y="' + (s * .14) + '" width="' + (s * .24) + '" height="' + (s * .4) + '" rx="' + (s * .12) + '"/><path d="M' + (s * .26) + ' ' + (s * .46) + 'q' + (s * .24) + ' ' + (s * .36) + ' ' + (s * .48) + ' 0M' + h + ' ' + (s * .78) + 'V' + (s * .9) + '"/>'; break;
      case "mask": g += '<circle cx="' + h + '" cy="' + h + '" r="' + (s * .34) + '"/><circle cx="' + h + '" cy="' + h + '" r="' + (s * .16) + '"/>'; break;
      case "crop": g += '<path d="M' + (s * .3) + ' ' + (s * .12) + 'V' + (s * .7) + 'H' + (s * .88) + 'M' + (s * .12) + ' ' + (s * .3) + 'H' + (s * .7) + 'V' + (s * .88) + '"/>'; break;
      case "key": g += '<path d="M' + h + ' ' + (s * .16) + 'L' + (s * .84) + ' ' + h + 'L' + h + ' ' + (s * .84) + 'L' + (s * .16) + ' ' + h + 'Z"/>'; break;
      default: g += '<circle cx="' + h + '" cy="' + h + '" r="' + (s * .3) + '"/>';
    }
    return g + "</g>";
  }
  function ring(z, label, sc) { /* highlight around a zone, with its name */
    var x = z[0], y = z[1], w = z[2], h = z[3];
    return '<g class="uhl"><rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (w + 4) + '" height="' + (h + 4) + '" rx="' + (sc ? 8 : 6) + '"/></g>';
  }
  function chip(z, text, W, H) {
    if (!text) return "";
    var cx = Math.min(W - 78, Math.max(78, z[0] + z[2] / 2)), below = z[1] + z[3] + 24 < H - 2, cy = below ? z[1] + z[3] + 14 : z[1] - 12;
    if (!below && cy < 12) cy = z[1] + 22;
    var w = Math.max(70, Math.min(W - 8, text.length * 6.4 + 22));
    return '<g class="ubtn"><rect x="' + (cx - w / 2) + '" y="' + (cy - 12) + '" width="' + w + '" height="23" rx="11.5"/><text x="' + cx + '" y="' + (cy + 4) + '">' + esc(text) + "</text></g>";
  }

  /* ---------------- PC screen ---------------- */
  function pcSVG(hl, btn, tab) {
    var id = ++gid, s = defs(id), i;
    s += '<rect class="ufr" x="1" y="1" width="478" height="298" rx="10"/>';
    /* top bar */
    s += '<rect x="1" y="1" width="478" height="24" rx="10" fill="#1b1c20"/><rect x="1" y="14" width="478" height="11" fill="#1b1c20"/>';
    s += '<path d="M12 8l7 4-7 4z" fill="#fff"/><text x="26" y="17" class="ut b">CapCut</text><text x="70" y="17" class="ut">Menu ▾</text><text x="220" y="17" class="ut c">0117 · Untitled</text>';
    s += '<rect x="410" y="5" width="62" height="16" rx="5" fill="url(#ex' + id + ')"/><text x="441" y="16.5" class="ut ex">Export</text><circle cx="396" cy="13" r="5" fill="none" stroke="#8d96a0"/>';
    /* left media panel */
    s += '<rect x="6" y="26" width="146" height="146" rx="6" fill="#1f2025"/>';
    var tabs = [["media", "Media"], ["audio", "Audio"], ["text", "Text"], ["sticker", "Sticker"], ["effects", "Effects"], ["trans", "Transitions"], ["captions", "Captions"], ["filters", "Filters"], ["adjust", "Adjust"]];
    for (i = 0; i < 5; i++) { var ac = (tab === tabs[i][0]); s += icon(tabs[i][0], 12 + i * 28, 30, 13, ac ? "#31e8e0" : "#cfd6dd") + '<text x="' + (18.5 + i * 28) + '" y="52" class="ut s t' + (ac ? " a" : "") + '">' + tabs[i][1] + "</text>"; }
    s += '<line x1="10" y1="56" x2="148" y2="56" stroke="#33353b"/><rect x="12" y="62" width="48" height="14" rx="4" fill="#2b2d34"/><text x="36" y="72.5" class="ut s t">Import</text><text x="68" y="72.5" class="ut s">Local ▾</text>';
    for (i = 0; i < 6; i++) { var cx = 12 + (i % 3) * 46, cy = 82 + Math.floor(i / 3) * 42; s += '<rect x="' + cx + '" y="' + cy + '" width="42" height="36" rx="4" fill="url(#th' + id + ')" opacity="' + (.55 + (i % 3) * .15) + '"/><text x="' + (cx + 3) + '" y="' + (cy + 32) + '" class="ut s">00:0' + (3 + i) + "</text>"; }
    /* player */
    s += '<rect x="156" y="26" width="172" height="146" rx="6" fill="#1f2025"/><text x="164" y="37" class="ut s">Player</text>' + frameArt(168, 42, 148, 104, id) +
      '<path d="M236 156l8 5-8 5z" fill="#fff"/><text x="168" y="166" class="ut s">00:03 / 00:15</text><rect x="262" y="154" width="34" height="14" rx="4" fill="#2b2d34"/><text x="279" y="164" class="ut s">Ratio ▾</text><text x="306" y="165" class="ut s">⛶</text>';
    /* right details panel */
    s += '<rect x="332" y="26" width="142" height="146" rx="6" fill="#1f2025"/>';
    var rt = ["Video", "Audio", "Speed", "Anim.", "Adjust"]; for (i = 0; i < rt.length; i++) s += '<text x="' + (338 + i * 27) + '" y="39" class="ut s' + (i === 0 ? " a" : "") + '">' + rt[i] + "</text>";
    s += '<line x1="336" y1="44" x2="470" y2="44" stroke="#33353b"/>';
    var rows = [["Scale", "100%", .5], ["Position", "X 0   Y 0", 0], ["Rotate", "0°", .1], ["Opacity", "100%", 1], ["Volume", "0 dB", .6]];
    for (i = 0; i < rows.length; i++) { var ry = 56 + i * 22; s += '<text x="340" y="' + ry + '" class="ut s">' + rows[i][0] + '</text><text x="452" y="' + ry + '" class="ut s b" text-anchor="end">' + rows[i][1] + '</text><path d="M458 ' + (ry - 7) + 'l4 4-4 4-4-4z" fill="none" stroke="#31e8e0" stroke-width="1"/>';
      if (rows[i][2]) s += '<rect x="340" y="' + (ry + 4) + '" width="120" height="3" rx="1.5" fill="#33353b"/><rect x="340" y="' + (ry + 4) + '" width="' + (120 * rows[i][2]) + '" height="3" rx="1.5" fill="#31e8e0"/>'; }
    /* timeline toolbar */
    s += '<rect x="6" y="174" width="468" height="18" rx="4" fill="#1b1c20"/>' + icon("copy", 12, 177, 12) + icon("copy", 30, 177, 12) + icon("split", 52, 177, 12) + '<text x="66" y="187" class="ut s">Split</text>' + icon("trash", 94, 177, 12) + '<text x="108" y="187" class="ut s">Delete</text>' + icon("freeze", 140, 177, 12) + '<text x="154" y="187" class="ut s">Freeze</text><text x="420" y="187" class="ut s">🧲 ⌕ ━●━</text>';
    /* timeline */
    s += '<rect x="6" y="194" width="468" height="102" rx="6" fill="#17181b"/>';
    for (i = 0; i < 12; i++) s += '<text x="' + (36 + i * 36) + '" y="204" class="ut s d">00:' + (i < 5 ? "0" : "") + (i * 2) + "</text><line x1=\"" + (36 + i * 36) + "\" y1=\"206\" x2=\"" + (36 + i * 36) + "\" y2=\"209\" stroke=\"#4a4d55\"/>";
    s += '<rect x="60" y="213" width="70" height="12" rx="3" fill="#b26b2d"/><text x="64" y="222" class="ut s">Hello everyone</text><rect x="140" y="213" width="50" height="12" rx="3" fill="#b26b2d"/>';
    for (i = 0; i < 4; i++) { var bx = 40 + i * 92, bw = i === 3 ? 70 : 88; s += '<rect x="' + bx + '" y="230" width="' + bw + '" height="32" rx="4" fill="#2f5d8a"/><rect x="' + bx + '" y="230" width="' + bw + '" height="32" rx="4" fill="url(#th' + id + ')" opacity="' + (.5 + (i % 2) * .2) + '"/>'; }
    s += '<rect x="40" y="268" width="330" height="18" rx="4" fill="#1f5a45"/><path d="M42 277' + (function () { var p = ""; for (var k = 0; k < 82; k++) p += "l4 " + ((k % 3 === 0 ? -1 : 1) * (k % 5 + 1) * (k % 2 ? 1 : -1)); return p; })() + '" fill="none" stroke="#3fcf8e" stroke-width=".8"/>';
    s += '<line x1="152" y1="206" x2="152" y2="290" stroke="#fff" stroke-width="1.5"/><path d="M147 204h10l-5 7z" fill="#fff"/>';
    return s;
  }

  /* ---------------- mobile screen ---------------- */
  function mobSVG(hl, btn, sub) {
    var id = ++gid, s = defs(id), i;
    s += '<rect x="2" y="2" width="296" height="416" rx="30" fill="#0a0a0b" stroke="#3a3d44" stroke-width="2"/><rect x="118" y="6" width="64" height="5" rx="2.5" fill="#222"/>';
    /* top bar */
    s += '<path d="M24 22l-6 6 6 6" fill="none" stroke="#e8edf2" stroke-width="2" stroke-linecap="round"/><text x="150" y="27" class="ut c">1080P ▾</text><rect x="230" y="12" width="58" height="22" rx="6" fill="url(#ex' + id + ')"/><text x="259" y="27" class="ut ex m">Export</text><text x="208" y="27" class="ut s">?</text>';
    /* player */
    s += '<rect x="14" y="40" width="272" height="158" rx="6" fill="#16171a"/>' + frameArt(94, 40, 112, 158, id) + '<text x="24" y="190" class="ut s">Captions will show here</text>';
    /* controls */
    s += '<text x="20" y="216" class="ut s">00:03 / 00:15</text><path d="M146 207l9 5-9 5z" fill="#fff"/><text x="206" y="216" class="ut s">↶  ↷  ⛶</text>';
    /* timeline */
    s += '<rect x="8" y="222" width="284" height="92" rx="6" fill="#131416"/>';
    for (i = 0; i < 7; i++) s += '<text x="' + (36 + i * 38) + '" y="233" class="ut s d">00:' + (i < 3 ? "0" : "") + (i * 2) + "</text>";
    s += '<rect x="30" y="238" width="150" height="14" rx="3" fill="#b26b2d"/><text x="34" y="248.5" class="ut s">Hello everyone</text>';
    for (i = 0; i < 3; i++) { var bx = 30 + i * 70; s += '<rect x="' + bx + '" y="256" width="66" height="30" rx="4" fill="url(#th' + id + ')" opacity="' + (.55 + (i % 2) * .2) + '"/>'; }
    s += '<rect x="244" y="258" width="26" height="26" rx="5" fill="#fff"/><path d="M257 264v14M250 271h14" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>';
    s += '<rect x="30" y="291" width="190" height="16" rx="4" fill="#1f5a45"/><path d="M32 299' + (function () { var p = ""; for (var k = 0; k < 46; k++) p += "l4 " + ((k % 3 === 0 ? -1 : 1) * (k % 4 + 1) * (k % 2 ? 1 : -1)); return p; })() + '" fill="none" stroke="#3fcf8e" stroke-width=".8"/>';
    s += '<line x1="112" y1="236" x2="112" y2="310" stroke="#fff" stroke-width="1.6"/>';
    /* bottom toolbar */
    s += '<rect x="6" y="326" width="288" height="84" rx="14" fill="#101113"/>';
    var main = [["edit", "Edit"], ["audio", "Audio"], ["text", "Text"], ["overlay", "Overlay"], ["captions", "Captions"], ["filters", "Filters"]];
    var edit = [["split", "Split"], ["speed", "Speed"], ["vol", "Volume"], ["anim", "Animations"], ["trash", "Delete"], ["copy", "Duplicate"]];
    var list = sub === "edit" ? edit : sub === "audio" ? [["audio", "Sounds"], ["vol", "Volume"], ["mic", "Voiceover"], ["effects", "Effects"], ["anim", "Fade"], ["trash", "Delete"]] : sub === "text" ? [["text", "Add text"], ["captions", "Auto captions"], ["sticker", "Sticker"], ["anim", "Animation"], ["format", "Templates"], ["trash", "Delete"]] : sub === "adjust" ? [["adjust", "Adjust"], ["filters", "Filters"], ["mask", "Mask"], ["crop", "Crop"], ["key", "Chroma key"], ["effects", "Effects"]] : main;
    s += '<text x="150" y="341" class="ut s d" text-anchor="middle">' + (sub ? "◂  " + (sub === "edit" ? "Edit" : sub === "audio" ? "Audio" : sub === "text" ? "Text" : "Adjust") + "  tools" : "Tap a clip, then pick a tool") + "</text>";
    for (i = 0; i < 6; i++) { var tx = 16 + i * 46; s += icon(list[i][0], tx + 6, 352, 22, "#e8edf2") + '<text x="' + (tx + 17) + '" y="388" class="ut s t">' + list[i][1] + "</text>"; }
    return s;
  }

  /* ---------------- one pane ---------------- */
  function pane(plat, d, W, H) {
    var Z = plat === "pc" ? PZ : MZ, hl = [].concat(d.hl || []), svg, target = hl.length ? Z[hl[0]] : null, i;
    svg = plat === "pc" ? pcSVG(hl, d.btn, d.tab) : mobSVG(hl, d.btn, d.sub);
    var rings = "", names = "";
    hl.forEach(function (k) { if (Z[k]) { rings += ring(Z[k], "", plat === "mob"); } });
    var ch = d.btn && target ? chip(target, d.btn, W, H) : "";
    var steps = d.steps && d.steps.length ? '<ol class="usteps">' + d.steps.map(function (s) { return "<li>" + T(s) + "</li>"; }).join("") + "</ol>" : "";
    var where = hl.filter(function (k) { return ZN[k]; }).map(function (k) { return T(ZN[k]); }).join(" · ");
    return '<div class="upane" data-p="' + plat + '"><svg class="usvg ' + plat + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + CAP[plat] + '">' + svg + rings + ch + "</svg>" + (where ? '<div class="uwhere">📍 ' + where + "</div>" : "") + steps + "</div>";
  }

  function platDefault(own) { var p = null; try { p = localStorage.getItem("qscr-plat"); } catch (e) {} if (p === "pc" || p === "mob") return p; try { if (matchMedia("(pointer:coarse)").matches && innerWidth < 800) return "mob"; } catch (e) {} return own; }

  uiHTML = function (v) {
    if (v.ui !== "desk" && v.ui !== "phone") return oldUI(v);
    var own = v.ui === "desk" ? "pc" : "mob", other = own === "pc" ? "mob" : "pc";
    var main = { hl: v.hl, btn: v.btn, steps: v.steps, sub: v.sub, tab: v.tab }, alt = v.alt || null;
    var panes = {}; panes[own] = main; if (alt) panes[other] = alt;
    var cur = platDefault(own); if (!panes[cur]) cur = own;
    var tabs = alt ? '<div class="uitabs" role="tablist">' + ["pc", "mob"].map(function (p) { return '<button type="button" role="tab" data-p="' + p + '" aria-selected="' + (p === cur) + '">' + T(TABN[p]) + "</button>"; }).join("") + "</div>" : '<div class="uicap">' + (own === "pc" ? "🖥️ " : "📱 ") + CAP[own] + "</div>";
    var body = ["pc", "mob"].filter(function (p) { return panes[p]; }).map(function (p) { return pane(p, panes[p], p === "pc" ? 480 : 300, p === "pc" ? 300 : 420).replace('class="upane"', 'class="upane"' + (p === cur ? "" : " hidden")); }).join("");
    return '<figure class="viz uimap cc" data-cur="' + cur + '">' + tabs + body + "</figure>";
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".uitabs button"); if (!b) return;
    var p = b.dataset.p; try { localStorage.setItem("qscr-plat", p); } catch (er) {}
    document.querySelectorAll(".uimap.cc").forEach(function (f) { var has = f.querySelector('.upane[data-p="' + p + '"]'); if (!has) return; f.dataset.cur = p;
      f.querySelectorAll(".upane").forEach(function (x) { x.hidden = x.dataset.p !== p; }); f.querySelectorAll(".uitabs button").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.p === p); }); });
  });

  var st = document.createElement("style"); st.textContent = [
    ".uimap.cc{padding:10px 10px 12px}.uitabs{display:flex;gap:6px;margin:0 0 10px}.uitabs button{flex:1;padding:9px 8px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--mut);font:700 14px Outfit,inherit}",
    ".uitabs button[aria-selected=true]{background:linear-gradient(135deg,var(--gold),#c98a26);color:#1a0f08;border:0}",
    ".uimap.cc .usvg{width:100%;height:auto;display:block;margin:0 auto}.uimap.cc .usvg.pc{max-width:620px}.uimap.cc .usvg.mob{max-width:290px}",
    ".usvg{direction:ltr}.usvg .ufr{fill:#121316;stroke:#3a3d44;stroke-width:1.5}",
    ".usvg .ut{fill:#dfe5eb;font:600 9px Outfit,Arial,sans-serif}.usvg .ut.b{font-weight:800;font-size:11px}.usvg .ut.c{text-anchor:middle;fill:#cfd6dd}.usvg .ut.s{font-size:7.2px;fill:#aab2bb}.usvg .ut.s.a{fill:#31e8e0}.usvg .ut.s.b{fill:#e9eef3;font-weight:700}.usvg .ut.s.d{fill:#6d7480}.usvg .ut.s.t{text-anchor:middle;fill:#cfd6dd}",
    ".usvg .ut.ex{fill:#04222b;font-weight:800;font-size:9px;text-anchor:middle}.usvg .ut.ex.m{font-size:10.5px}",
    ".usvg .uhl rect{fill:rgba(255,196,60,.12);stroke:#ffc43c;stroke-width:2.4;animation:uhlp 1.5s ease-in-out infinite}@keyframes uhlp{50%{stroke-opacity:.35;fill-opacity:.04}}",
    ".usvg .ubtn rect{fill:#ffc43c;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}.usvg .ubtn text{fill:#1b1306;font:800 10.5px Outfit,Arial,sans-serif;text-anchor:middle}",
    ".uwhere{margin:8px 2px 0;font:600 13px Outfit,inherit;color:var(--gold2)}",
    "@media (prefers-reduced-motion:reduce){.usvg .uhl rect{animation:none}}"].join("\n");
  document.head.appendChild(st);
})();

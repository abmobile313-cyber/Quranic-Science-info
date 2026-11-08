/* Makharij Lab — a live, animated side view of the mouth and throat.
   Tongue, lips, jaw and soft palate move to each letter's articulation point;
   the touching point blinks, air flows through the mouth or nose, and the qari is heard. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  /* ---------- pose model ---------- */
  // tongue upper contour P0 (tip) … P8 (vallecula), lower contour L0 (under tip) … L2
  const REST = {
    P: [[299, 222], [286, 213], [266, 205], [241, 199], [216, 201], [196, 212], [186, 236], [190, 262], [203, 284]],
    L: [[297, 229], [282, 243], [252, 265]],
    jaw: 2, vel: 1, ul: [0, 0], ll: [0, 0], round: 0,
    c: null, air: "none", glow: null
  };
  const set = (o, k, v) => { o[k] = v; return o; };
  function pose(over) {
    const p = JSON.parse(JSON.stringify(REST));
    if (over.P) for (const [i, v] of Object.entries(over.P)) p.P[i] = v;
    if (over.L) for (const [i, v] of Object.entries(over.L)) p.L[i] = v;
    for (const k of ["jaw", "vel", "ul", "ll", "round", "c", "air", "glow"]) if (k in over) p[k] = over[k];
    return p;
  }
  // articulation zones (keys match ZONES in app.js)
  const Z = {
    jawf: pose({ jaw: 9, vel: 0, P: { 0: [298, 230], 1: [284, 224], 2: [262, 220], 3: [238, 218], 4: [214, 220], 5: [196, 228] }, air: "mouth", glow: "jawf" }),
    h1: pose({ jaw: 5, vel: 0, c: [186, 341], air: "mouth" }),
    h2: pose({ jaw: 5, vel: 0, P: { 5: [190, 214], 6: [177, 240], 7: [180, 264] }, c: [171, 268], air: "mouth" }),
    h3: pose({ jaw: 4, vel: 0, P: { 3: [238, 196], 4: [210, 190], 5: [188, 196], 6: [180, 222] }, c: [174, 196], air: "mouth" }),
    l1: pose({ jaw: 4, vel: 0, P: { 3: [236, 192], 4: [208, 178], 5: [190, 183], 6: [181, 212] }, c: [197, 177], air: "mouth" }),
    l2: pose({ jaw: 4, vel: 0, P: { 2: [262, 196], 3: [234, 178], 4: [212, 172], 5: [194, 186], 6: [184, 214] }, c: [216, 170], air: "mouth" }),
    l3: pose({ jaw: 3, vel: 0, P: { 0: [298, 222], 1: [284, 206], 2: [262, 182], 3: [240, 170], 4: [218, 176], 5: [198, 194] }, c: [242, 166], air: "mouth" }),
    l4: pose({ jaw: 4, vel: 0, P: { 1: [285, 208], 2: [266, 190], 3: [244, 180], 4: [220, 182], 5: [198, 196] }, c: [256, 178], air: "mouth", glow: "side" }),
    l5: pose({ jaw: 4, vel: 0, P: { 0: [292, 188], 1: [281, 196], 2: [264, 204], 3: [241, 203] }, L: { 0: [287, 200], 1: [279, 224] }, c: [292, 185], air: "mouth" }),
    l6: pose({ jaw: 4, vel: 0, P: { 0: [300, 191], 1: [287, 197], 2: [266, 204] }, L: { 0: [294, 202], 1: [282, 226] }, c: [301, 189], air: "mouth" }),
    l7: pose({ jaw: 3, vel: 0, P: { 0: [304, 212], 1: [292, 203], 2: [270, 198] }, L: { 0: [301, 220] }, c: [306, 211], air: "teeth" }),
    l8: pose({ jaw: 5, vel: 0, P: { 0: [313, 212], 1: [300, 207], 2: [276, 203] }, L: { 0: [308, 219], 1: [288, 236] }, c: [312, 210], air: "teeth" }),
    s1: pose({ jaw: 3, vel: 0, ll: [-14, -5], c: [311, 209], air: "lips" }),
    s2: pose({ jaw: 1, vel: 0, ul: [0, 3], ll: [0, -3], c: [335, 209], air: "none" }),
    kh: pose({ jaw: 1, vel: 1, ul: [0, 3], ll: [0, -3], c: [297, 147], air: "nose", glow: "nose" })
  };
  const HEAVY = "خصضغطقظ";
  function letterPose(ch, zone) {
    let p = JSON.parse(JSON.stringify(Z[zone] || REST));
    if (HEAVY.includes(ch) && !["l1", "h3"].includes(zone)) { // isti'la: back of tongue rises
      p.P[4] = [p.P[4][0] - 2, Math.min(p.P[4][1], 182)]; p.P[5] = [p.P[5][0], Math.min(p.P[5][1], 192)]; p.P[3] = [p.P[3][0], Math.min(p.P[3][1], 190)];
    }
    if (ch === "ر") { p.P[0] = [288, 184]; p.P[1] = [279, 194]; p.c = [289, 182]; }
    if (ch === "ن") { p.P[0] = [295, 189]; p.c = [295, 186]; p.vel = 1; p.air = "nose"; }
    if (ch === "م") { p.vel = 1; p.air = "nose"; }
    if (ch === "و") { p.ul = [7, 1]; p.ll = [7, -1]; p.round = 1; p.c = [342, 208]; p.air = "round"; p.jaw = 3; p.P[3] = [236, 186]; p.P[4] = [212, 180]; }
    if (ch === "ب") { p.air = "burst"; }
    if (ch === "ي") { p.P[0] = [298, 224]; p.air = "mouth"; }
    if (ch === "ش") p.air = "spread";
    return p;
  }
  /* ---------- geometry helpers ---------- */
  function crClosed(pts) {
    const n = pts.length; let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + "Z";
  }
  function crOpen(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d;
  }
  const PIV = [222, 168];
  function rot(pt, deg, w = 1) {
    const a = deg * w * Math.PI / 180, x = pt[0] - PIV[0], y = pt[1] - PIV[1];
    return [PIV[0] + x * Math.cos(a) - y * Math.sin(a), PIV[1] + x * Math.sin(a) + y * Math.cos(a)];
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function mix(a, b, t) {
    return {
      P: a.P.map((p, i) => [lerp(p[0], b.P[i][0], t), lerp(p[1], b.P[i][1], t)]),
      L: a.L.map((p, i) => [lerp(p[0], b.L[i][0], t), lerp(p[1], b.L[i][1], t)]),
      jaw: lerp(a.jaw, b.jaw, t), vel: lerp(a.vel, b.vel, t), round: lerp(a.round, b.round, t),
      ul: [lerp(a.ul[0], b.ul[0], t), lerp(a.ul[1], b.ul[1], t)], ll: [lerp(a.ll[0], b.ll[0], t), lerp(a.ll[1], b.ll[1], t)],
      c: t < .5 ? a.c : b.c, air: t < .5 ? a.air : b.air, glow: t < .5 ? a.glow : b.glow
    };
  }
  /* ---------- static artwork ---------- */
  const ART = `
<defs>
 <linearGradient id="mlSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d3b3"/><stop offset="1" stop-color="#e9b48d"/></linearGradient>
 <linearGradient id="mlTis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaa0a0"/><stop offset="1" stop-color="#d9837f"/></linearGradient>
 <radialGradient id="mlAir" cx=".6" cy=".35" r=".8"><stop offset="0" stop-color="#fff8f3"/><stop offset="1" stop-color="#f6dcd3"/></radialGradient>
 <linearGradient id="mlTongueGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f27b8d"/><stop offset=".55" stop-color="#e05a71"/><stop offset="1" stop-color="#c2405a"/></linearGradient>
 <linearGradient id="mlBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef2f8"/><stop offset="1" stop-color="#cdd6e3"/></linearGradient>
 <linearGradient id="mlTooth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e8ee"/></linearGradient>
 <linearGradient id="mlLip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9757a"/><stop offset="1" stop-color="#c85a64"/></linearGradient>
 <radialGradient id="mlGlow"><stop offset="0" stop-color="#fff59a" stop-opacity="1"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".85"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient>
 <filter id="mlSoft" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="#5a2a1a" flood-opacity=".25"/></filter>
</defs>
<rect width="400" height="420" rx="22" fill="#fbf3ea"/>
<!-- head & neck -->
<path fill="url(#mlSkin)" stroke="#c98f6a" stroke-width="1.4" filter="url(#mlSoft)" d="M92,420 C96,380 100,350 96,322 C72,300 52,262 50,214 C48,150 74,82 128,48 C178,16 252,14 292,46 C318,68 326,98 323,122 C327,132 338,146 352,160 C356,166 352,172 344,175 C338,178 332,180 324,182 L322,188 L318,232 C324,248 330,262 326,272 C320,282 300,288 268,290 C252,292 244,300 246,320 C248,350 252,385 256,420 Z"/>
<!-- ear hint -->
<path d="M120,178 C104,170 98,196 106,214 C112,228 126,226 128,212" fill="none" stroke="#c98f6a" stroke-width="2" opacity=".55"/>
<!-- inner soft tissue -->
<path fill="url(#mlTis)" opacity=".95" d="M162,128 C200,118 260,120 300,132 L322,172 L320,240 C310,262 280,282 246,290 C232,300 226,330 226,420 L150,420 C150,360 148,300 150,250 C150,200 150,160 162,128 Z"/>
<!-- vertebrae -->
<g fill="url(#mlBone)" stroke="#a9b7ca" stroke-width="1.2">
 <rect x="112" y="176" width="34" height="30" rx="8"/><rect x="110" y="212" width="35" height="31" rx="8"/><rect x="108" y="249" width="36" height="31" rx="8"/>
 <rect x="107" y="286" width="37" height="31" rx="8"/><rect x="107" y="323" width="37" height="31" rx="8"/><rect x="107" y="360" width="37" height="31" rx="8"/><rect x="107" y="397" width="37" height="23" rx="8"/>
</g>
<!-- nasal cavity -->
<path id="mlNasal" fill="url(#mlAir)" stroke="#d59a92" stroke-width="1.2" d="M342,173 C334,160 322,146 304,136 C276,124 236,124 200,128 C180,131 166,140 162,156 L160,176 C176,170 196,166 210,162 C240,158 270,160 296,170 C312,174 330,176 342,173 Z"/>
<g fill="none" stroke="#d59a92" stroke-width="1.2" opacity=".8"><path d="M300,142 C276,136 246,138 222,146"/><path d="M296,156 C272,150 244,151 220,156"/></g>
<!-- oral cavity + pharynx + larynx (airway) -->
<path id="mlOral" fill="url(#mlAir)" stroke="#d59a92" stroke-width="1.2" d="M318,204 C312,196 304,190 296,186 C284,180 268,170 248,166 C230,163 214,164 206,166 C192,170 176,172 166,178 C160,200 158,240 160,290 C162,306 168,320 174,330 L200,330 C204,316 205,300 206,290 C214,280 238,276 262,268 C286,258 304,242 314,226 Z"/>
<path id="mlTrachea" fill="url(#mlAir)" stroke="#d59a92" stroke-width="1.2" d="M172,330 L202,330 C204,360 206,390 206,420 L176,420 C174,390 172,360 172,330 Z"/>
<g stroke="#d59a92" stroke-width="1" opacity=".7"><path d="M176,366 L204,366"/><path d="M176,380 L205,380"/><path d="M177,394 L205,394"/><path d="M177,408 L206,408"/></g>
<!-- esophagus -->
<path d="M160,322 C162,360 164,390 166,420" stroke="#c9787a" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>
<!-- vocal folds -->
<g id="mlFolds"><path d="M174,341 L186,337 L186,343 Z" fill="#f4c1c1" stroke="#c46a6f" stroke-width="1"/><path d="M202,341 L190,337 L190,343 Z" fill="#f4c1c1" stroke="#c46a6f" stroke-width="1"/></g>
<!-- epiglottis -->
<path d="M205,292 C198,282 192,270 188,258 C192,262 198,272 210,286 Z" fill="#f0b0ae" stroke="#c46a6f" stroke-width="1.1"/>
<!-- hard palate (bone) -->
<path fill="url(#mlBone)" stroke="#9fb0c6" stroke-width="1.2" d="M300,186 C288,178 268,166 246,162 C230,160 216,161 206,164 L206,157 C220,153 240,152 262,155 C280,158 296,166 304,178 Z"/>
<!-- upper molar (side teeth, behind) -->
<path d="M246,166 L266,170 L264,180 C258,183 252,183 246,180 Z" fill="#ffffff" stroke="#b9c2cc" stroke-width="1" opacity=".75"/>
<!-- upper incisor -->
<path fill="url(#mlTooth)" stroke="#aab4c0" stroke-width="1.2" d="M298,184 C304,183 309,184 312,186 C316,194 316,203 313,210 L307,210 C304,202 301,193 298,184 Z"/>
<path d="M298,184 C303,180 309,180 313,184" fill="#f0a6a6" stroke="#d07c80" stroke-width="1"/>
<!-- soft palate (dynamic) -->
<path id="mlVel" fill="#f3a7ad" stroke="#c46a6f" stroke-width="1.2"/>
<!-- airflow -->
<g id="mlAirG" fill="none" stroke-linecap="round"></g>
<!-- floor of mouth (moves with jaw) -->
<path id="mlFloor" fill="url(#mlTis)" d="M304,236 C296,246 282,254 262,266 C244,276 226,286 206,292 L204,304 L306,304 Z"/>
<!-- tongue (dynamic) -->
<path id="mlTongue" fill="url(#mlTongueGr)" stroke="#a83350" stroke-width="1.3"/>
<path id="mlTongueHi" fill="none" stroke="#ffd0d8" stroke-width="2" stroke-linecap="round" opacity=".6"/>
<!-- jaw group -->
<g id="mlJaw">
 <path fill="url(#mlTooth)" stroke="#aab4c0" stroke-width="1.2" d="M300,236 C300,228 302,220 304,212 L309,212 C311,220 311,229 309,236 Z"/>
 <path d="M298,238 C303,242 309,242 312,236" fill="#f0a6a6" stroke="#d07c80" stroke-width="1"/>
 <path fill="url(#mlSkin)" stroke="#c98f6a" stroke-width="1.4" d="M316,226 C322,236 330,252 328,266 C326,278 312,286 290,288 L262,290 C258,282 262,262 286,252 C300,246 308,238 312,228 Z"/>
 <path d="M240,286 C262,284 290,276 300,262 C304,256 306,248 304,240" fill="none" stroke="#a9b7ca" stroke-width="4" stroke-linecap="round" opacity=".3"/>
</g>
<!-- lips (dynamic) -->
<path id="mlUL" fill="url(#mlLip)" stroke="#a8434f" stroke-width="1.2"/>
<path id="mlLL" fill="url(#mlLip)" stroke="#a8434f" stroke-width="1.2"/>
<!-- jawf glow / side / nose -->
<ellipse id="mlJawfG" cx="236" cy="205" rx="70" ry="22" fill="#9be7ff" opacity="0"/>
<ellipse id="mlPharG" cx="172" cy="250" rx="12" ry="60" fill="#9be7ff" opacity="0"/>
<!-- contact point -->
<g id="mlC" opacity="0"><circle r="16" fill="url(#mlGlow)" class="mlPulse"/><circle r="5" fill="#ffe14d" stroke="#b77900" stroke-width="1.5"/><circle r="10" fill="none" stroke="#ffb000" stroke-width="2" class="mlRing"/></g>
<!-- part labels -->
<g id="mlLabels" font-family="Outfit,'Noto Sans Devanagari','Noto Nastaliq Urdu',sans-serif" font-size="10.5" font-weight="600" fill="#5b3a2e"></g>`;
  const LBL = {
    lips: { en: "Lips", ur: "ہونٹ", hi: "होंठ", at: [362, 214], to: [340, 210] },
    teeth: { en: "Teeth", ur: "دانت", hi: "दाँत", at: [340, 248], to: [310, 214] },
    tongue: { en: "Tongue", ur: "زبان", hi: "ज़बान", at: [262, 312], to: [250, 248] },
    palate: { en: "Hard palate", ur: "سخت تالو", hi: "सख़्त तालू", at: [272, 100], to: [258, 158] },
    soft: { en: "Soft palate", ur: "نرم تالو", hi: "नर्म तालू", at: [190, 84], to: [192, 172] },
    nose: { en: "Nose", ur: "ناک", hi: "नाक", at: [370, 140], to: [338, 160] },
    throat: { en: "Throat", ur: "حلق", hi: "हल्क़", at: [70, 290], to: [166, 262] },
    folds: { en: "Voice box", ur: "آواز کی ڈوریاں", hi: "आवाज़ की डोरियाँ", at: [242, 360], to: [194, 340] }
  };
  /* airflow paths */
  const AIR = {
    mouth: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,190 C236,186 270,196 300,206 C318,212 336,212 360,210",
    teeth: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,192 C236,188 270,194 296,206 C308,210 318,212 362,212",
    lips: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,192 C236,188 270,196 298,206 C312,210 322,212 362,214",
    round: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,190 C236,186 270,196 300,206 C320,210 340,208 366,206",
    burst: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,190 C236,186 270,196 300,206 C318,210 336,210 362,210",
    spread: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,240 C170,214 180,196 206,190 C236,184 270,190 300,206 C318,212 336,212 362,212",
    nose: "M190,420 C189,390 188,360 187,340 C184,310 172,280 170,230 C168,200 166,168 172,150 C186,136 230,134 270,140 C300,146 330,160 360,172"
  };
  /* ---------- component ---------- */
  function build(svg) {
    svg.setAttribute("viewBox", "0 0 400 420"); svg.innerHTML = ART;
    const q = id => svg.querySelector("#" + id);
    return { svg, floor: q("mlFloor"), tongue: q("mlTongue"), hi: q("mlTongueHi"), vel: q("mlVel"), jaw: q("mlJaw"), ul: q("mlUL"), ll: q("mlLL"), c: q("mlC"), air: q("mlAirG"), jawf: q("mlJawfG"), phar: q("mlPharG"), labels: q("mlLabels") };
  }
  function draw(E, p) {
    // tongue follows the jaw (front more than back)
    const w = pt => Math.max(0, Math.min(1, (pt[0] - 186) / 110));
    const P = p.P.map(pt => rot(pt, p.jaw - 2, w(pt))), L = p.L.map(pt => rot(pt, p.jaw - 2, w(pt)));
    const floor = [[226, 286], [214, 290]];
    E.tongue.setAttribute("d", crClosed([...P, ...floor, ...L.slice().reverse()]));
    E.hi.setAttribute("d", crOpen(P.slice(1, 6).map(pt => [pt[0], pt[1] + 5])));
    // soft palate: raised (0) closes the nose, lowered (1) opens it
    const v = p.vel, tip = [lerp(166, 180, v), lerp(170, 198, v)], mid = [lerp(186, 194, v), lerp(160, 178, v)];
    E.vel.setAttribute("d", `M206,157 C200,${lerp(156, 160, v)} ${mid[0]},${mid[1] - 6} ${tip[0]},${tip[1] - 3} C${tip[0] - 3},${tip[1] + 3} ${tip[0] + 4},${tip[1] + 6} ${tip[0] + 6},${tip[1] + 2} C${mid[0] + 6},${mid[1] + 6} 200,${lerp(170, 174, v)} 208,167 Z`);
    E.jaw.setAttribute("transform", `rotate(${(p.jaw - 2).toFixed(2)} ${PIV[0]} ${PIV[1]})`); E.floor.setAttribute("transform", `rotate(${((p.jaw - 2) * .6).toFixed(2)} ${PIV[0]} ${PIV[1]})`);
    // lips
    const r = p.round, [ux, uy] = p.ul, [lx0, ly0] = p.ll, J = rot([318, 216], p.jaw - 2), lx = lx0 + J[0] - 318, ly = ly0 + J[1] - 216;
    E.ul.setAttribute("d", `M${318 + ux},184 C${328 + ux},186 ${337 + ux + r * 3},194 ${337 + ux + r * 4},${202 + uy} C${336 + ux + r * 3},${208 + uy} ${328 + ux},${210 + uy} ${316 + ux},${208 + uy} C${314},${200} ${316},${192} ${318 + ux},184 Z`);
    E.ll.setAttribute("d", `M${314 + lx},${213 + ly} C${326 + lx},${211 + ly} ${336 + lx + r * 3},${213 + ly} ${337 + lx + r * 4},${221 + ly} C${337 + lx + r * 3},${230 + ly} ${330 + lx},${236 + ly} ${320 + lx * .6},${238 + ly * .6} C${316 + lx * .6},${232 + ly * .6} ${313 + lx},${222 + ly} ${314 + lx},${213 + ly} Z`);
  }
  function setStatic(E, p, labelsOn) {
    E.c.style.opacity = p.c ? 1 : 0; if (p.c) E.c.setAttribute("transform", `translate(${p.c[0]},${p.c[1]})`);
    E.jawf.style.opacity = p.glow === "jawf" ? .45 : 0; E.phar.style.opacity = p.glow === "jawf" ? .4 : 0;
    E.air.innerHTML = p.air && AIR[p.air] ? `<path d="${AIR[p.air]}" stroke="#7fd8ff" stroke-width="7" opacity=".25"/><path d="${AIR[p.air]}" class="mlFlow${p.air === "burst" ? " burst" : ""}" stroke="#1fa8e0" stroke-width="3" stroke-dasharray="3 11"/>` : "";
  }
  function labels(E, lang, on) {
    E.labels.innerHTML = on ? Object.values(LBL).map(l => {
      const t = l[lang] || l.en, wd = Math.max(34, t.length * (lang === "en" ? 6 : 7) + 12), [x, y] = l.at;
      return `<line x1="${x}" y1="${y}" x2="${l.to[0]}" y2="${l.to[1]}" stroke="#8a6250" stroke-width=".8" stroke-dasharray="2 2"/><rect x="${x - wd / 2}" y="${y - 9}" width="${wd}" height="18" rx="9" fill="#fff" stroke="#e2c6b0"/><text x="${x}" y="${y + 4}" text-anchor="middle"${lang === "ur" ? ' direction="rtl"' : ""}>${t}</text>`;
    }).join("") : "";
  }
  function Lab(svg, lang) {
    const E = build(svg); let cur = JSON.parse(JSON.stringify(REST)), raf = 0;
    draw(E, cur); setStatic(E, cur); labels(E, lang, true);
    function go(target, ms) {
      cancelAnimationFrame(raf); const from = cur, t0 = performance.now();
      E.c.style.opacity = 0; E.air.innerHTML = ""; E.jawf.style.opacity = 0; E.phar.style.opacity = 0;
      return new Promise(res => {
        const step = now => { const k = Math.min(1, (now - t0) / ms), m = mix(from, target, ease(k)); draw(E, m);
          if (k < 1) raf = requestAnimationFrame(step); else { cur = target; setStatic(E, target); res(); } };
        raf = requestAnimationFrame(step);
      });
    }
    return {
      to(ch, zone, ms) { return go(letterPose(ch, zone), ms || 600); },
      rest(ms) { return go(JSON.parse(JSON.stringify(REST)), ms || 500); },
      labels(on, lg) { labels(E, lg || lang, on); }
    };
  }
  window.MLab = { Lab };
})();

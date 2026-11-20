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
  const DEFS = `<defs>
 <radialGradient id="mlBg" cx=".62" cy=".38" r=".85"><stop offset="0" stop-color="#22303d"/><stop offset=".6" stop-color="#121a23"/><stop offset="1" stop-color="#06090d"/></radialGradient>
 <linearGradient id="mlSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efc29f"/><stop offset=".55" stop-color="#d99b74"/><stop offset="1" stop-color="#b8785a"/></linearGradient>
 <linearGradient id="mlMus" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9534c"/><stop offset="1" stop-color="#8e3434"/></linearGradient>
 <linearGradient id="mlMus2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93303f"/><stop offset="1" stop-color="#7a2634"/></linearGradient>
 <linearGradient id="mlFat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c98e"/><stop offset="1" stop-color="#ddab6d"/></linearGradient>
 <linearGradient id="mlMuc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f09aa0"/><stop offset="1" stop-color="#d4707c"/></linearGradient>
 <radialGradient id="mlCav" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#2a0d12"/><stop offset=".75" stop-color="#4a1820"/><stop offset="1" stop-color="#7a2b35"/></radialGradient>
 <linearGradient id="mlBrain" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1cfc6"/><stop offset=".6" stop-color="#ddb0a6"/><stop offset="1" stop-color="#c7958d"/></linearGradient>
 <linearGradient id="mlTongueGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f294a0"/><stop offset=".22" stop-color="#dd6a7c"/><stop offset=".55" stop-color="#ad3b4f"/><stop offset="1" stop-color="#7f2737"/></linearGradient>
 <linearGradient id="mlBone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf3df"/><stop offset=".6" stop-color="#eadcbc"/><stop offset="1" stop-color="#cdbb94"/></linearGradient>
 <linearGradient id="mlDisc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfe3ee"/><stop offset="1" stop-color="#a9c7d8"/></linearGradient>
 <linearGradient id="mlCord" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3e2b0"/><stop offset="1" stop-color="#ddc283"/></linearGradient>
 <linearGradient id="mlTooth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffdf7"/><stop offset=".6" stop-color="#f2ece0"/><stop offset="1" stop-color="#d9d0bf"/></linearGradient>
 <linearGradient id="mlLip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d99b78"/><stop offset=".38" stop-color="#d48272"/><stop offset=".5" stop-color="#d0677a"/><stop offset="1" stop-color="#b44a5c"/></linearGradient>
 <linearGradient id="mlLipL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf6276"/><stop offset=".55" stop-color="#c25866"/><stop offset=".72" stop-color="#cf8a74"/><stop offset="1" stop-color="#c98a66"/></linearGradient>
 <linearGradient id="mlGum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4a5ab"/><stop offset="1" stop-color="#df7f8a"/></linearGradient>
 <radialGradient id="mlGlow"><stop offset="0" stop-color="#fff9c4" stop-opacity="1"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient>
 <clipPath id="mlHeadC"><path d="M62,420 C64,384 66,350 70,322 C58,300 50,262 50,214 C48,150 74,82 128,48 C178,16 252,14 292,46 C318,68 326,98 323,122 C327,132 338,146 352,160 C356,166 352,172 344,175 C338,178 332,180 324,182 L322,188 L318,232 C324,248 330,262 326,272 C320,282 300,288 268,290 C252,292 244,300 246,320 C248,350 252,385 256,420 Z"/></clipPath>
 <!-- volumetric light: soft dome shading + broad highlight -->
 <filter id="mlVol" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="b"/>
  <feDiffuseLighting in="b" surfaceScale="4.5" diffuseConstant="1.12" result="d"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting>
  <feSpecularLighting in="b" surfaceScale="4.5" specularConstant=".4" specularExponent="14" result="s"><fePointLight x="340" y="20" z="260"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".55" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <!-- fibrous muscle texture + light -->
 <filter id="mlFib" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".012 .22" numOctaves="3" seed="3" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .9 0 0 0 -.15" result="na"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="b"/>
  <feComposite in="b" in2="na" operator="arithmetic" k2="1" k3=".16" result="bump"/>
  <feDiffuseLighting in="bump" surfaceScale="4" diffuseConstant="1.15" result="d"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting>
  <feSpecularLighting in="bump" surfaceScale="4" specularConstant=".45" specularExponent="20" result="s"><fePointLight x="340" y="20" z="240"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".3" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <!-- porous bone -->
 <filter id="mlOs" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="2" seed="9" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 -.2" result="na"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="b"/>
  <feComposite in="b" in2="na" operator="arithmetic" k2="1" k3=".06" result="bump"/>
  <feDiffuseLighting in="bump" surfaceScale="4" diffuseConstant="1.12" result="d"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting>
  <feSpecularLighting in="bump" surfaceScale="4" specularConstant=".6" specularExponent="22" result="s"><fePointLight x="340" y="20" z="220"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".45" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <!-- wet mucosa: papillae bumps + sharp glossy highlight (tongue, lips, palate) -->
 <filter id="mlWet" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="1" seed="5" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .8 0 0 0 -.1" result="na"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>
  <feComposite in="b" in2="na" operator="arithmetic" k2="1" k3=".045" result="bump"/>
  <feDiffuseLighting in="bump" surfaceScale="4.5" diffuseConstant="1.15" result="d"><feDistantLight azimuth="225" elevation="54"/></feDiffuseLighting>
  <feSpecularLighting in="bump" surfaceScale="4.5" specularConstant="1.1" specularExponent="38" result="s"><fePointLight x="330" y="40" z="160"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".75" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <!-- skin with pores -->
 <filter id="mlDerm" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .6 0 0 0 -.05" result="na"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/>
  <feComposite in="b" in2="na" operator="arithmetic" k2="1" k3=".07" result="bump"/>
  <feDiffuseLighting in="bump" surfaceScale="5" diffuseConstant="1.15" result="d"><feDistantLight azimuth="225" elevation="50"/></feDiffuseLighting>
  <feSpecularLighting in="bump" surfaceScale="5" specularConstant=".45" specularExponent="20" result="s"><fePointLight x="340" y="20" z="240"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".4" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <filter id="mlGyri" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".035 .05" numOctaves="2" seed="11" result="n"/>
  <feComponentTransfer in="n" result="g"><feFuncR type="table" tableValues="0 1 0 1 0 1 0 1 0 1 0"/></feComponentTransfer>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="ga"/>
  <feGaussianBlur in="ga" stdDeviation="1.6" result="gb"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="b"/>
  <feComposite in="b" in2="gb" operator="arithmetic" k2="1" k3=".35" result="bump"/>
  <feDiffuseLighting in="bump" surfaceScale="5" diffuseConstant="1.12" result="d"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting>
  <feSpecularLighting in="bump" surfaceScale="5" specularConstant=".5" specularExponent="18" result="s"><fePointLight x="340" y="20" z="240"/></feSpecularLighting>
  <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sm"/>
  <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3=".4" result="o"/>
  <feComposite in="o" in2="SourceAlpha" operator="in"/>
 </filter>
 <filter id="mlRim" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter>
 <filter id="mlShade" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>
 <clipPath id="mlTC"><path id="mlTongueClip"/></clipPath>
</defs>`;
  // static layers are baked once into bitmaps (fast on phones); the vector stays as fallback
  const BACK = `
<rect width="400" height="420" rx="22" fill="url(#mlBg)"/>
<g opacity=".35" stroke="#3a5368" stroke-width=".5"><path d="M0,105H400M0,210H400M0,315H400M100,0V420M200,0V420M300,0V420"/></g>
<!-- rim light behind head -->
<path d="M62,420 C64,384 66,350 70,322 C58,300 50,262 50,214 C48,150 74,82 128,48 C178,16 252,14 292,46 C318,68 326,98 323,122 C327,132 338,146 352,160 C356,166 352,172 344,175" fill="none" stroke="#7fc8ff" stroke-width="5" opacity=".45" filter="url(#mlRim)"/>
<g clip-path="url(#mlHeadC)">
 <!-- whole section base: subcutaneous fat / connective tissue -->
 <rect x="40" y="0" width="330" height="420" fill="#c98472" filter="url(#mlVol)"/>
 <!-- muscle masses -->
 <path fill="url(#mlMus)" filter="url(#mlFib)" d="M70,240 C84,236 98,236 106,240 L104,420 L60,420 C62,360 64,300 70,240 Z"/>
 <path fill="url(#mlMus)" filter="url(#mlFib)" d="M150,176 C200,170 260,172 300,186 L322,190 L322,250 C318,268 300,282 270,288 C250,292 240,302 238,330 L236,420 L150,420 C150,360 148,300 150,250 C150,214 148,194 150,176 Z"/>
 <path fill="url(#mlMus)" filter="url(#mlFib)" d="M300,40 C320,62 330,96 326,124 L314,124 C316,100 308,72 290,50 Z" opacity=".75"/>
 <!-- calvarium (bone) and brain -->
 <path fill="url(#mlBone)" filter="url(#mlOs)" d="M60,214 C58,150 82,90 132,60 C180,30 250,28 288,56 C312,76 318,100 314,124 L300,128 C280,124 250,122 222,124 C200,126 182,132 172,140 C160,152 150,166 140,178 C120,188 96,200 80,214 Z"/>
 <path id="mlBrainP" fill="url(#mlBrain)" filter="url(#mlGyri)" d="M74,204 C70,150 90,100 134,72 C176,46 244,44 278,68 C298,82 302,100 298,114 C278,110 252,110 228,113 C206,116 188,122 178,130 C166,142 156,156 146,168 C124,178 98,190 74,204 Z"/>
 <!-- cerebellum -->
 <ellipse cx="108" cy="182" rx="28" ry="17" fill="#d9a59c" filter="url(#mlVol)"/>
 <g fill="none" stroke="#a9716d" stroke-width="1.1" opacity=".8"><path d="M84,182 C96,170 120,168 132,178"/><path d="M86,188 C98,178 120,176 134,186"/><path d="M90,194 C102,186 118,186 130,192"/></g>
 <!-- brainstem → spinal cord -->
 <path fill="url(#mlCord)" filter="url(#mlVol)" d="M168,138 C176,146 166,164 150,176 C136,186 120,192 110,204 L104,420 L92,420 L94,206 C100,190 118,176 134,166 C150,156 156,146 168,138 Z"/>
 <!-- sinuses -->
 <path fill="url(#mlCav)" d="M286,72 C296,76 302,88 300,100 C292,102 282,98 280,88 C278,80 280,74 286,72 Z"/>
 <path fill="url(#mlCav)" d="M186,134 C198,130 212,132 216,140 C212,150 196,152 188,148 C182,144 182,138 186,134 Z"/>
 <!-- vertebral column -->
 <g fill="url(#mlBone)" filter="url(#mlOs)">
  <path d="M120,176 C126,168 140,166 148,172 L150,210 L118,210 Z"/>
  <rect x="112" y="214" width="36" height="30" rx="7"/><rect x="110" y="250" width="37" height="30" rx="7"/><rect x="108" y="286" width="38" height="30" rx="7"/>
  <rect x="107" y="322" width="38" height="30" rx="7"/><rect x="107" y="358" width="38" height="30" rx="7"/><rect x="107" y="394" width="38" height="30" rx="7"/>
  <path d="M78,236 C84,230 92,232 92,240 L90,256 C84,258 78,254 76,248 Z"/><path d="M74,272 C80,266 90,268 90,276 L88,294 C82,296 74,292 72,284 Z"/>
  <path d="M72,310 C78,304 88,306 88,314 L86,332 C80,334 72,330 70,322 Z"/><path d="M72,348 C78,342 88,344 88,352 L86,370 C80,372 72,368 70,360 Z"/>
 </g>
 <g fill="url(#mlDisc)" opacity=".95"><rect x="113" y="244" width="34" height="6" rx="3"/><rect x="111" y="280" width="35" height="6" rx="3"/><rect x="109" y="316" width="36" height="6" rx="3"/><rect x="108" y="352" width="37" height="6" rx="3"/><rect x="108" y="388" width="37" height="6" rx="3"/></g>
 <!-- pharyngeal wall mucosa -->
 <path fill="url(#mlMuc)" filter="url(#mlWet)" d="M152,140 L172,138 L170,330 C170,370 172,400 172,420 L152,420 C152,360 150,300 152,240 Z"/>
 <!-- nasal cavity (air) with turbinates -->
 <path id="mlNasal" fill="url(#mlCav)" stroke="#e98f98" stroke-width="2" d="M342,173 C334,160 322,146 304,136 C276,124 236,124 200,128 C180,131 166,140 162,156 L160,176 C176,170 196,166 210,162 C240,158 270,160 296,170 C312,174 330,176 342,173 Z"/>
 <g fill="url(#mlMuc)" filter="url(#mlWet)">
  <path d="M300,140 C280,132 250,132 226,138 C222,142 226,146 232,145 C254,141 278,141 296,146 Z"/>
  <path d="M302,154 C282,146 252,146 222,152 C218,157 222,161 230,160 C254,156 280,157 298,160 Z"/>
  <path d="M300,166 C284,162 260,160 236,164 C234,168 238,170 246,169 C266,167 284,168 296,170 Z"/>
 </g>
 <!-- oral cavity + pharynx + larynx (air) -->
 <path id="mlOral" fill="url(#mlCav)" stroke="#e98f98" stroke-width="2" d="M318,204 C312,196 304,190 296,186 C284,180 268,170 248,166 C230,163 214,164 206,166 C192,170 176,172 166,178 C160,200 158,240 160,290 C162,306 168,320 174,330 L200,330 C204,316 205,300 206,290 C214,280 238,276 262,268 C286,258 304,242 314,226 Z"/>
 <!-- trachea + cartilage rings -->
 <path id="mlTrachea" fill="url(#mlCav)" stroke="#e98f98" stroke-width="2" d="M172,330 L202,330 C204,360 206,390 206,420 L176,420 C174,390 172,360 172,330 Z"/>
 <g fill="url(#mlBone)" filter="url(#mlOs)"><rect x="202" y="360" width="9" height="8" rx="3"/><rect x="203" y="374" width="9" height="8" rx="3"/><rect x="204" y="388" width="9" height="8" rx="3"/><rect x="204" y="402" width="9" height="8" rx="3"/><path d="M200,334 C212,334 220,340 220,352 L206,354 C206,346 204,340 200,338 Z"/></g>
 <!-- esophagus -->
 <path d="M164,326 C166,360 168,390 170,420" stroke="#c76a72" stroke-width="7" stroke-linecap="round" fill="none" filter="url(#mlVol)"/>
 <!-- hyoid -->
 <ellipse cx="226" cy="300" rx="9" ry="5" fill="url(#mlBone)" filter="url(#mlOs)"/>
</g>
<!-- vocal folds -->
<g id="mlFolds" filter="url(#mlWet)"><path d="M173,342 L187,336 L187,345 Z" fill="#f7d0cf"/><path d="M203,342 L189,336 L189,345 Z" fill="#f7d0cf"/></g>
<!-- epiglottis (cartilage) -->
<path d="M205,292 C198,282 192,270 187,256 C193,261 199,271 211,285 Z" fill="#f5d5c8" filter="url(#mlWet)"/>
<!-- hard palate: bone with mucosa beneath -->
<path fill="url(#mlMuc)" filter="url(#mlWet)" d="M302,188 C290,180 268,169 246,165 C230,163 216,164 206,166 L206,160 C222,157 242,157 262,160 C282,164 298,172 306,182 Z"/>
<path fill="url(#mlBone)" filter="url(#mlOs)" d="M304,182 C292,172 270,162 246,158 C230,156 216,156 206,158 L206,151 C220,148 242,148 264,152 C284,156 300,166 308,176 Z"/>
<!-- upper molar (behind) -->
<path d="M246,166 L266,170 L264,181 C258,184 252,184 246,181 Z" fill="url(#mlTooth)" opacity=".85" filter="url(#mlOs)"/>
<!-- upper incisor: root + crown + gum -->
<path fill="url(#mlBone)" d="M298,176 C304,171 313,172 319,178 L318,190 L299,190 Z" filter="url(#mlOs)"/>
<path d="M297,183 C302,178 309,177 314,182 L313,188 L298,188 Z" fill="url(#mlGum)" filter="url(#mlWet)"/>
<path fill="url(#mlTooth)" filter="url(#mlOs)" d="M298,186 C304,184 310,185 313,188 C316,195 316,203 314,211 C312,213 308,213 306,211 C303,203 300,195 298,186 Z"/>
<path d="M309,189 C311,195 311,201 310,207" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8" fill="none"/>`;
  const JAW = `
 <path fill="url(#mlSkin)" filter="url(#mlDerm)" d="M316,226 C322,236 330,252 328,266 C326,278 312,286 290,288 L262,290 C258,282 262,262 286,252 C300,246 308,238 312,228 Z"/>
 <path fill="url(#mlBone)" filter="url(#mlOs)" d="M310,240 C316,250 318,262 314,272 C308,280 294,282 276,282 C272,276 276,266 290,260 C300,256 306,250 308,240 Z"/>
 <path d="M298,236 C303,232 310,232 313,236 L312,244 L299,244 Z" fill="url(#mlGum)" filter="url(#mlWet)"/>
 <path fill="url(#mlTooth)" filter="url(#mlOs)" d="M300,237 C300,229 302,221 304,213 L309,213 C311,221 311,230 309,237 Z"/>
 <path d="M306,216 C307,222 307,228 306,233" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".75" fill="none"/>`;
  const FRONT = `
<!-- skin layer of the section edge -->
<g clip-path="url(#mlHeadC)"><path fill="none" stroke="url(#mlFat)" stroke-width="22" opacity=".95" d="M62,420 C64,384 66,350 70,322 C58,300 50,262 50,214 C48,150 74,82 128,48 C178,16 252,14 292,46 C318,68 326,98 323,122 C327,132 338,146 352,160 C356,166 352,172 344,175 C338,178 332,180 324,182 M326,250 C329,258 329,266 326,272 C320,282 300,288 268,290 C252,292 244,300 246,320 C248,350 252,385 256,420"/><path fill="none" stroke="url(#mlSkin)" stroke-width="11" filter="url(#mlDerm)" d="M62,420 C64,384 66,350 70,322 C58,300 50,262 50,214 C48,150 74,82 128,48 C178,16 252,14 292,46 C318,68 326,98 323,122 C327,132 338,146 352,160 C356,166 352,172 344,175 C338,178 332,180 324,182 M326,250 C329,258 329,266 326,272 C320,282 300,288 268,290 C252,292 244,300 246,320 C248,350 252,385 256,420"/></g>`;
  const ART = DEFS + `<g data-bake="back">` + BACK + `</g>
<!-- soft palate (dynamic) -->
<path id="mlVel" fill="url(#mlMuc)" filter="url(#mlWet)"/>
<!-- airflow -->
<g id="mlAirG" fill="none" stroke-linecap="round"></g>
<!-- floor of mouth (moves with jaw) -->
<g id="mlFloor"><g data-bake="floor"><path fill="url(#mlMus2)" filter="url(#mlFib)" d="M305,230 C297,238 285,247 268,257 C250,269 228,281 206,289 C203,296 206,302 214,306 C240,306 268,302 290,296 C304,290 310,276 310,262 C310,250 308,238 305,230 Z"/></g></g>
<!-- tongue (dynamic): shadow, body, muscle fibres -->
<path id="mlTongueSh" fill="#12040a" opacity=".5" filter="url(#mlShade)"/>
<path id="mlTongue" fill="url(#mlTongueGr)" filter="url(#mlWet)"/>
<g clip-path="url(#mlTC)"><path id="mlTFib" fill="none" stroke="#6e1a2c" stroke-width="1" opacity=".42"/><path id="mlTongueHi" fill="none" stroke="#ffe3e8" stroke-width="2.2" stroke-linecap="round" opacity=".35" filter="url(#mlRim)"/></g>
<g id="mlJaw"><g data-bake="jaw">` + JAW + `</g></g>
<g data-bake="front">` + FRONT + `</g>
<!-- lips (dynamic) -->
<path id="mlUL" fill="url(#mlLip)" filter="url(#mlWet)"/>
<path id="mlLL" fill="url(#mlLipL)" filter="url(#mlWet)"/>
<!-- jawf glow -->
<ellipse id="mlJawfG" cx="236" cy="205" rx="70" ry="22" fill="#7fe0ff" opacity="0" filter="url(#mlRim)"/>
<ellipse id="mlPharG" cx="172" cy="250" rx="12" ry="60" fill="#7fe0ff" opacity="0" filter="url(#mlRim)"/>
<!-- contact point -->
<g id="mlC" opacity="0"><circle r="18" fill="url(#mlGlow)" class="mlPulse"/><circle r="5" fill="#ffe14d" stroke="#fff6c0" stroke-width="1.5"/><circle r="10" fill="none" stroke="#ffcf3a" stroke-width="2" class="mlRing"/></g>
<!-- part labels -->
<g id="mlLabels" font-family="Outfit,'Noto Sans Devanagari','Noto Nastaliq Urdu',sans-serif" font-size="10.5" font-weight="600" fill="#1d2731"></g>`;
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
  function bake(svg) {
    // turn each static, filter-heavy layer into one bitmap so animation stays smooth
    const k = Math.min(3, Math.max(1.5, (window.devicePixelRatio || 1) * ((svg.clientWidth || 400) / 400)));
    svg.querySelectorAll("[data-bake]").forEach(g => {
      try {
        const src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420" width="${400 * k}" height="${420 * k}">${DEFS}${g.innerHTML}</svg>`;
        const img = new Image();
        img.onload = () => {
          try {
            const cv = document.createElement("canvas"); cv.width = Math.round(400 * k); cv.height = Math.round(420 * k);
            cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
            cv.toBlob(bl => { if (!bl) return; const im = document.createElementNS(NS, "image");
              im.setAttribute("href", URL.createObjectURL(bl)); im.setAttribute("width", "400"); im.setAttribute("height", "420");
              g.replaceChildren(im); }, "image/png");
          } catch (e) { /* keep vector */ }
        };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(src);
      } catch (e) { /* keep vector */ }
    });
  }
  function build(svg) {
    svg.setAttribute("viewBox", "0 0 400 420"); svg.innerHTML = ART;
    const q = id => svg.querySelector("#" + id);
    requestAnimationFrame(() => bake(svg));
    return { svg, floor: q("mlFloor"), tongue: q("mlTongue"), clip: q("mlTongueClip"), fib: q("mlTFib"), hi: q("mlTongueHi"), sh: q("mlTongueSh"), vel: q("mlVel"), jaw: q("mlJaw"), ul: q("mlUL"), ll: q("mlLL"), c: q("mlC"), air: q("mlAirG"), jawf: q("mlJawfG"), phar: q("mlPharG"), labels: q("mlLabels") };
  }
  function draw(E, p) {
    // tongue follows the jaw (front more than back)
    const w = pt => Math.max(0, Math.min(1, (pt[0] - 186) / 110));
    const P = p.P.map(pt => rot(pt, p.jaw - 2, w(pt))), L = p.L.map(pt => rot(pt, p.jaw - 2, w(pt)));
    const floor = [[226, 286], [214, 290]];
    const td = crClosed([...P, ...floor, ...L.slice().reverse()]);
    E.tongue.setAttribute("d", td); E.clip.setAttribute("d", td); E.sh.setAttribute("d", td); E.sh.setAttribute("transform", "translate(-3,6)");
    // genioglossus fibres fan from the chin to the tongue surface
    const O = rot([292, 270], p.jaw - 2), F = [];
    for (let i = 1; i < 8; i++) for (const t of [0, .5]) { const a = P[i], b = P[i + 1] || P[i], x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t);
      F.push(`M${O[0].toFixed(1)},${O[1].toFixed(1)} Q${((O[0] + x) / 2 + 6).toFixed(1)},${((O[1] + y) / 2 + 4).toFixed(1)} ${x.toFixed(1)},${(y + 6).toFixed(1)}`); }
    E.fib.setAttribute("d", F.join(""));
    E.hi.setAttribute("d", crOpen(P.slice(1, 6).map(pt => [pt[0] - 1, pt[1] + 4])));
    // soft palate: raised (0) closes the nose, lowered (1) opens it
    const v = p.vel, tip = [lerp(166, 180, v), lerp(170, 198, v)], mid = [lerp(186, 194, v), lerp(160, 178, v)];
    E.vel.setAttribute("d", `M206,157 C200,${lerp(156, 160, v)} ${mid[0]},${mid[1] - 8} ${tip[0]},${tip[1] - 4} C${tip[0] - 5},${tip[1] + 4} ${tip[0] + 4},${tip[1] + 9} ${tip[0] + 8},${tip[1] + 3} C${mid[0] + 9},${mid[1] + 8} 202,${lerp(172, 177, v)} 210,170 Z`);
    E.jaw.setAttribute("transform", `rotate(${(p.jaw - 2).toFixed(2)} ${PIV[0]} ${PIV[1]})`); E.floor.setAttribute("transform", `rotate(${((p.jaw - 2) * .6).toFixed(2)} ${PIV[0]} ${PIV[1]})`);
    // lips
    const r = p.round, [ux, uy] = p.ul, [lx0, ly0] = p.ll, J = rot([318, 216], p.jaw - 2), lx = lx0 + J[0] - 318, ly = ly0 + J[1] - 216;
    E.ul.setAttribute("d", `M${320 + ux * .4},180 C${327 + ux * .6},183 ${331 + ux},189 ${334 + ux + r * 3},196 C${338 + ux + r * 4},${201 + uy} ${337 + ux + r * 3},${207 + uy} ${330 + ux},${209 + uy} C${324 + ux},${210 + uy} ${318 + ux * .5},${209 + uy} ${314},${206 + uy * .5} C${314},${196} ${316},${188} ${320 + ux * .4},180 Z`);
    E.ll.setAttribute("d", `M${314 + lx},${213 + ly} C${326 + lx},${211 + ly} ${336 + lx + r * 3},${213 + ly} ${337 + lx + r * 4},${221 + ly} C${337 + lx + r * 3},${230 + ly} ${330 + lx},${236 + ly} ${320 + lx * .6},${238 + ly * .6} C${316 + lx * .6},${232 + ly * .6} ${313 + lx},${222 + ly} ${314 + lx},${213 + ly} Z`);
  }
  function setStatic(E, p, labelsOn) {
    E.c.style.opacity = p.c ? 1 : 0; if (p.c) E.c.setAttribute("transform", `translate(${p.c[0]},${p.c[1]})`);
    E.jawf.style.opacity = p.glow === "jawf" ? .45 : 0; E.phar.style.opacity = p.glow === "jawf" ? .4 : 0;
    E.air.innerHTML = p.air && AIR[p.air] ? `<path d="${AIR[p.air]}" stroke="#7fd8ff" stroke-width="8" opacity=".28" filter="url(#mlRim)"/><path d="${AIR[p.air]}" class="mlFlow${p.air === "burst" ? " burst" : ""}" stroke="#8fe6ff" stroke-width="3" stroke-dasharray="3 11"/>` : "";
  }
  function labels(E, lang, on) {
    E.labels.innerHTML = on ? Object.values(LBL).map(l => {
      const t = l[lang] || l.en, wd = Math.max(34, t.length * (lang === "en" ? 6 : 7) + 12), [x, y] = l.at;
      return `<line x1="${x}" y1="${y}" x2="${l.to[0]}" y2="${l.to[1]}" stroke="#bfe3ff" stroke-width=".9" stroke-dasharray="2 2" opacity=".9"/><circle cx="${l.to[0]}" cy="${l.to[1]}" r="2.2" fill="#bfe3ff"/><rect x="${x - wd / 2}" y="${y - 9}" width="${wd}" height="18" rx="9" fill="#f4f8fb" fill-opacity=".94" stroke="#8fc6ea" stroke-width=".8"/><text x="${x}" y="${y + 4}" text-anchor="middle"${lang === "ur" ? ' direction="rtl"' : ""}>${t}</text>`;
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

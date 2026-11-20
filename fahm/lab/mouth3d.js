/* Makharij Lab 3D — a photo-real medical section of the head (ChatGPT image) brought to life in WebGL.
   The tongue, soft palate and lips are cut out with masks and bent with a mesh, so they move like real tissue.
   On top: the letter, a glowing contact point with a gold line, airflow, and part labels. */
(function () {
  "use strict";
  const SRC = (document.currentScript && document.currentScript.src) || "mouth3d.js";
  const NS = "http://www.w3.org/2000/svg", O = [400, 330], S = 800; // the 800×800 crop of the 1254 px render
  const DORSUM = [[978, 630], [955, 606], [900, 587], [850, 575], [800, 569], [750, 569], [700, 577], [650, 592], [615, 615], [590, 645], [575, 690], [572, 725]];
  const UVULA = [576, 646], UVUP = [556, 600], VATT = [640, 520];
  const clone = a => a.map(p => p.slice());
  function P(o) {
    const p = { d: clone(DORSUM), vel: 0, u: [0, 0], l: [0, 0], c: null, glow: null, air: "mouth", thr: 0, tc: [540, 800], lar: 0, jaw: 6, vib: "" };
    if (o.d) for (const [i, v] of Object.entries(o.d)) p.d[i] = v;
    for (const k of ["vel", "u", "l", "c", "glow", "air", "thr", "tc", "lar", "jaw", "vib"]) if (k in o) p[k] = o[k];
    return p;
  }
  const REST = P({ vel: 1, air: null, jaw: 0 });
  const Z = {
    jawf: P({ jaw: 16,  d: { 2: [900, 596], 3: [850, 586], 4: [800, 582], 5: [750, 582], 6: [700, 588] }, glow: "jawf" }),
    h1: P({ c: [535, 945], thr: 1, tc: [538, 935], lar: 14, jaw: 10, vib: "throat" }),
    h2: P({ d: { 9: [585, 646], 10: [565, 690], 11: [561, 726] }, c: [528, 790], thr: 1, tc: [532, 790], lar: 6, jaw: 10, vib: "throat" }),
    h3: P({ d: { 7: [650, 588], 8: [613, 604], 9: [592, 630] }, c: [556, 636], thr: .8, tc: [556, 660], lar: 2, jaw: 8, vib: "throat" }),
    l1: P({ d: { 5: [750, 566], 6: [700, 560], 7: [652, 550], 8: [613, 588], 9: [592, 628] }, c: [606, 590] }),
    l2: P({ d: { 4: [800, 560], 5: [750, 550], 6: [700, 537], 7: [656, 545], 8: [619, 582] }, c: [690, 538] }),
    l3: P({ d: { 0: [976, 641], 1: [952, 616], 2: [900, 570], 3: [850, 541], 4: [800, 536], 5: [750, 541], 6: [700, 557] }, c: [818, 537] }),
    l4: P({ d: { 1: [952, 588], 2: [900, 566], 3: [850, 561], 4: [800, 563] }, c: [905, 571] }),
    l5: P({ d: { 0: [962, 556], 1: [940, 557], 2: [896, 565], 3: [850, 569] }, c: [960, 553] }),
    l6: P({ d: { 0: [970, 562], 1: [948, 563], 2: [900, 569], 3: [850, 569] }, c: [972, 560] }),
    l7: P({ d: { 0: [985, 637], 1: [957, 583], 2: [905, 569], 3: [850, 569] }, c: [984, 628], air: "teeth" }),
    l8: P({ d: { 0: [1012, 622], 1: [986, 612], 2: [930, 598], 3: [872, 584] }, c: [1010, 619], air: "teeth" }),
    s1: P({ l: [-26, -16], c: [1019, 621], air: "lips", jaw: 2 }),
    s2: P({ u: [2, 7], l: [-2, -14], c: [1062, 624], air: null, jaw: 0, vib: "lips" }),
    kh: P({ vel: 1, u: [2, 7], l: [-2, -14], c: [1000, 425], glow: "nose", air: "nose", jaw: 0, vib: "nose" })
  };
  const HEAVY = "خصضغطقظ", HUSH = "فحثهشخصسكت"; // mahmoosah (whispered) letters: the voice box does not buzz
  /* lips + jaw for every letter: [upper dx, upper dy, lower dx, lower dy, jaw].  dx>0 = pushed forward (rounded), dx<0 = pulled back (spread),
     dy<0 = upper lip lifts, dy>0 = lower lip drops. ف ب م keep their closing presets from the zone. */
  const LIP = {
    "ا": [0, -6, 0, 9, 17], "ء": [0, -2, 0, 5, 10], "ه": [0, -3, 0, 6, 13], "ع": [0, -5, 0, 8, 15], "ح": [0, -3, 0, 6, 12],
    "غ": [7, -1, 7, 2, 7], "خ": [5, -1, 5, 2, 7], "ق": [8, -1, 8, 1, 6], "ك": [-3, -1, -3, 3, 6],
    "ج": [3, -1, 3, 1, 5], "ش": [11, -1, 11, -2, 4], "ي": [-9, -2, -9, 1, 4],
    "ض": [7, 0, 7, -2, 5], "ل": [-2, -2, -2, 4, 6], "ن": [-1, -1, -1, 2, 4], "ر": [3, -2, 3, 3, 5],
    "ط": [9, 0, 9, -3, 5], "د": [0, -1, 0, 3, 5], "ت": [-2, -1, -2, 2, 4],
    "ص": [10, -1, 10, -2, 3], "س": [-6, -1, -6, 0, 3], "ز": [-6, -1, -6, 0, 3],
    "ظ": [9, -1, 9, -1, 5], "ذ": [0, -3, 0, 4, 5], "ث": [0, -3, 0, 4, 5],
    "و": [18, 2, 18, -6, 4]
  };
  /* vowel (harakat) shapes, applied once the letter is released: a = open, u = rounded, i = spread */
  function addVowel(p, v) {
    if (!v || v === "0") return p;
    p.c = null; p.air = p.air === "nose" ? "nose" : "mouth";
    const lipLetter = p.l[1] < -8; // ف ب م: the lips open from the closure
    if (v === "a") { p.jaw = Math.max(p.jaw, 14); p.u = [p.u[0], Math.min(p.u[1], 0) - 7]; p.l = [Math.min(p.l[0], 0), 11]; for (const i of [3, 4, 5, 6, 7]) p.d[i] = [p.d[i][0], Math.max(p.d[i][1], 600 + (i - 3) * 2)]; }
    if (v === "u") { p.jaw = 3; p.u = [34, 4]; p.l = [34, -10]; for (const i of [5, 6, 7, 8]) p.d[i] = [p.d[i][0], p.d[i][1] - 14]; }
    if (v === "i") { p.jaw = 5; p.u = [-14, -1]; p.l = [-14, 2]; for (const i of [1, 2, 3, 4]) p.d[i] = [p.d[i][0], p.d[i][1] - 12]; }
    if (lipLetter && v === "a") p.l = [0, 10];
    return p;
  }
  function letterPose(ch, zone, vowel) {
    const p = JSON.parse(JSON.stringify(Z[zone] || REST));
    if (HEAVY.includes(ch) && !["l1", "h3"].includes(zone)) // isti'la: the back of the tongue rises toward the palate
      for (const i of [5, 6, 7]) p.d[i] = [p.d[i][0], Math.max(p.d[i][1] - 20, 546)];
    if (ch === "ر") { p.d[0] = [953, 551]; p.d[1] = [934, 560]; p.c = [952, 549]; p.vib = "trill"; }
    if (ch === "ن") { p.vel = 1; p.air = "nose"; }
    if (ch === "م") { p.vel = 1; p.air = "nose"; }
    if (LIP[ch]) { const t = LIP[ch], g = 1.7; p.u = [t[0] * g, t[1] * g]; p.l = [t[2] * g, t[3] * g]; p.jaw = t[4] * 1.15; }
    if (ch === "و") { p.c = [1074, 623]; p.air = "lips"; for (const i of [5, 6, 7]) p.d[i] = [p.d[i][0], p.d[i][1] - 14]; }
    if (ch === "ب") { p.air = "burst"; p.vib = "burst"; }
    if (ch === "ق" || ch === "ك") p.vib = "tap";
    if (!HUSH.includes(ch) && !p.vib) p.vib = "voice";
    if (ch === "ي") p.d[0] = [976, 643];
    return addVowel(p, vowel);
  }
  /* ---------- labels & paths (image coordinates) ---------- */
  const LBL = {
    lips: { en: "Lips", ur: "ہونٹ", hi: "होंठ", at: [1140, 700], to: [1078, 645] },
    teeth: { en: "Teeth", ur: "دانت", hi: "दाँत", at: [1140, 520], to: [1004, 600] },
    tongue: { en: "Tongue", ur: "زبان", hi: "ज़बान", at: [800, 760], to: [790, 650] },
    palate: { en: "Hard palate", ur: "سخت تالو", hi: "सख़्त तालू", at: [820, 470], to: [820, 522] },
    soft: { en: "Soft palate", ur: "نرم تالو", hi: "नर्म तालू", at: [600, 450], to: [610, 545] },
    nose: { en: "Nose", ur: "ناک", hi: "नाक", at: [1110, 380], to: [960, 440] },
    throat: { en: "Throat", ur: "حلق", hi: "हल्क़", at: [450, 700], to: [530, 720] },
    jaw: { en: "Lower jaw", ur: "نچلا جبڑا", hi: "निचला जबड़ा", at: [1120, 860], to: [1010, 790] },
    folds: { en: "Voice box", ur: "آواز کی ڈوریاں", hi: "आवाज़ की डोरियाँ", at: [700, 950], to: [545, 945] }
  };
  const AIR = {
    base: "M540,1120 C538,1040 536,980 535,945 C534,880 528,820 530,780 C532,720 548,670 575,640 C610,600 660,560 720,553",
    mouth: " C800,548 900,552 960,575 C1000,592 1040,615 1150,622",
    teeth: " C800,548 900,552 965,580 C995,596 1020,612 1150,618",
    lips: " C800,548 900,552 965,580 C1000,598 1040,614 1150,624",
    burst: " C800,548 900,552 960,575 C1000,592 1040,615 1170,622",
    nose: ""
  };
  const AIRNOSE = "M540,1120 C538,1040 536,980 535,945 C534,880 528,820 530,780 C532,720 548,660 560,600 C572,540 600,500 660,470 C760,430 880,425 960,440 C1020,452 1080,470 1160,470";
  /* ---------- WebGL ---------- */
  const VS = "attribute vec2 p;attribute vec2 t;uniform vec2 o;uniform float s;varying vec2 v;void main(){v=(t-o)/s;vec2 q=(p-o)/s;gl_Position=vec4(q.x*2.-1.,1.-q.y*2.,0.,1.);}";
  const FS = "precision mediump float;varying vec2 v;uniform sampler2D tex;uniform sampler2D msk;uniform vec3 sel;uniform float um;void main(){vec4 c=texture2D(tex,v);float a=um>.5?dot(texture2D(msk,v).rgb,sel):1.;gl_FragColor=vec4(c.rgb*a,a);}";
  function grid(x0, y0, x1, y1, st) {
    const nx = Math.ceil((x1 - x0) / st), ny = Math.ceil((y1 - y0) / st), V = [], I = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) V.push([x0 + (x1 - x0) * i / nx, y0 + (y1 - y0) * j / ny]);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; I.push(a, b, c, b, d, c); }
    return { V, I: new Uint16Array(I) };
  }
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function mix(a, b, t) {
    return { d: a.d.map((p, i) => [lerp(p[0], b.d[i][0], t), lerp(p[1], b.d[i][1], t)]), vel: lerp(a.vel, b.vel, t),
      u: [lerp(a.u[0], b.u[0], t), lerp(a.u[1], b.u[1], t)], l: [lerp(a.l[0], b.l[0], t), lerp(a.l[1], b.l[1], t)],
      thr: lerp(a.thr || 0, b.thr || 0, t), tc: [lerp((a.tc || b.tc)[0], b.tc[0], t), lerp((a.tc || b.tc)[1], b.tc[1], t)], lar: lerp(a.lar || 0, b.lar || 0, t), jaw: lerp(a.jaw || 0, b.jaw || 0, t) };
  }
  function ok() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (e) { return false; } }
  function load(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }

  function Lab(svgEl, lang) {
    const base = SRC;
    const wrap = document.createElement("div"); wrap.className = "ml3";
    const cv = document.createElement("canvas"); cv.className = "ml3c";
    const ov = document.createElementNS(NS, "svg"); ov.setAttribute("viewBox", `${O[0]} ${O[1]} ${S} ${S}`); ov.setAttribute("class", "ml3o");
    ov.addEventListener("click", e => { const g = e.target.closest && e.target.closest("[data-part]"); if (g) wrap.dispatchEvent(new CustomEvent("mlpart", { detail: g.getAttribute("data-part"), bubbles: true })); });
    ov.innerHTML = `<defs><radialGradient id="m3g"><stop offset="0" stop-color="#fff7c2"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient>
      <filter id="m3b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="m3t" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffb000" flood-opacity=".75"/></filter></defs>
      <style>.m3buzz{animation:m3bz .09s linear infinite alternate;transform-origin:545px 948px}@keyframes m3bz{to{transform:scaleY(1.35)}}</style><g id="m3air" fill="none" stroke-linecap="round"></g><g id="m3glow"></g><g id="m3lbl" font-family="Outfit,'Noto Sans Devanagari','Noto Nastaliq Urdu',sans-serif" font-size="19" font-weight="600"></g>
      <g id="m3pt" opacity="0"><line id="m3ln" stroke="#ffd56a" stroke-width="2.5" stroke-dasharray="1 0" opacity=".9"/><circle r="34" fill="url(#m3g)" class="mlPulse"/><circle r="9" fill="#ffe36a" stroke="#fff8d0" stroke-width="2.5"/><circle r="20" fill="none" stroke="#ffd23f" stroke-width="3" class="mlRing"/></g>
      <text id="m3ch" x="1075" y="1050" text-anchor="middle" font-size="104" fill="#ffe08a" filter="url(#m3t)" font-family="'Amiri Quran','Noto Naskh Arabic',serif"></text>`;
    wrap.append(cv, ov); svgEl.replaceWith(wrap);
    const q = id => ov.querySelector("#" + id);
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: false, antialias: true });
    let cur = JSON.parse(JSON.stringify(REST)), raf = 0, ready = false, showLbl = true, L = lang;
    // meshes in image coordinates
    const MT = grid(540, 512, 1036, 852, 9), MV = grid(546, 500, 660, 656, 6), MU = grid(1018, 550, 1122, 628, 5), ML = grid(1014, 622, 1112, 708, 5);
    let prog, prog2, buf, ibuf, texB, texP, texM, U = {};
    function setup(imB, imP, imM) {
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
      prog2 = gl.createProgram(); gl.attachShader(prog2, sh(gl.VERTEX_SHADER, "attribute vec2 p;attribute vec4 k;uniform vec2 o;uniform float s;varying vec4 c;void main(){c=k;vec2 q=(p-o)/s;gl_Position=vec4(q.x*2.-1.,1.-q.y*2.,0.,1.);}"));
      gl.attachShader(prog2, sh(gl.FRAGMENT_SHADER, "precision mediump float;varying vec4 c;void main(){gl_FragColor=c;}")); gl.linkProgram(prog2);
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
      ["o", "s", "tex", "msk", "sel", "um"].forEach(n => U[n] = gl.getUniformLocation(prog, n));
      const tx = (im, unit) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
        return t; };
      texB = tx(imB, 0); texP = tx(imP, 1); texM = tx(imM, 2);
      buf = gl.createBuffer(); ibuf = gl.createBuffer();
      gl.uniform2f(U.o, O[0], O[1]); gl.uniform1f(U.s, S); gl.uniform1i(U.msk, 2);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      ready = true; resize(); frame(cur);
    }
    function resize() {
      const w = Math.round(Math.min(1100, (wrap.clientWidth || 400) * Math.min(2, window.devicePixelRatio || 1)));
      if (cv.width !== w) { cv.width = cv.height = w; }
      gl && gl.viewport(0, 0, cv.width, cv.height);
    }
    function drawMesh(M, pos, texUnit, sel) {
      const n = M.V.length, data = new Float32Array(n * 4);
      for (let k = 0; k < n; k++) { data[k * 4] = pos[k][0]; data[k * 4 + 1] = pos[k][1]; data[k * 4 + 2] = M.V[k][0]; data[k * 4 + 3] = M.V[k][1]; }
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      const ap = gl.getAttribLocation(prog, "p"), at = gl.getAttribLocation(prog, "t");
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 16, 8);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, M.I, gl.DYNAMIC_DRAW);
      gl.uniform1i(U.tex, texUnit); gl.uniform1f(U.um, sel ? 1 : 0); gl.uniform3fv(U.sel, sel || [0, 0, 0]);
      gl.drawElements(gl.TRIANGLES, M.I.length, gl.UNSIGNED_SHORT, 0);
    }
    /* the dark space between open lips (the plate behind it is only a smear): soft maroon that fades out at both ends, drawn under the lips */
    function gapFill(p) {
      const top = 604 + Math.min(0, p.u[1]) * .6, bot = 640 + p.l[1] + (p.jaw || 0), a = [0, .95, .95, 0], xs = [1026, 1048, 1086 + p.u[0] * .3, 1104 + p.u[0] * .3], D = [];
      for (let i = 0; i < 4; i++) for (const y of [top, bot]) D.push(xs[i], y, .10 * a[i], .03 * a[i], .04 * a[i], a[i]);
      gl.useProgram(prog2); gl.uniform2f(gl.getUniformLocation(prog2, "o"), O[0], O[1]); gl.uniform1f(gl.getUniformLocation(prog2, "s"), S);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(D), gl.DYNAMIC_DRAW);
      const ap = gl.getAttribLocation(prog2, "p"), ak = gl.getAttribLocation(prog2, "k");
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 24, 0); gl.enableVertexAttribArray(ak); gl.vertexAttribPointer(ak, 4, gl.FLOAT, false, 24, 8);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8); gl.disableVertexAttribArray(ak); gl.useProgram(prog);
    }
    const MP = grid(O[0], O[1], O[0] + S, O[1] + S, 16);
    /* the plate itself moves too: throat walls close in (halq letters), the voice box rises, the lower jaw opens */
    function plateWarp(v, p) {
      let x = v[0], y = v[1];
      if (p.thr) { const dx = v[0] - p.tc[0], dy = v[1] - p.tc[1], w = Math.exp(-(dx * dx) / (2 * 60 * 60) - (dy * dy) / (2 * 55 * 55)); x -= dx * .42 * p.thr * w; }
      if (p.lar) { const dx = v[0] - 545, dy = v[1] - 960, w = Math.exp(-(dx * dx + dy * dy) / (2 * 85 * 85)); y -= p.lar * w; }
      if (p.jaw) { const w = sm(640, 760, v[1]) * sm(690, 860, v[0]) * (1 - sm(1150, 1200, v[0])); y += p.jaw * w; x -= p.jaw * .25 * w; }
      return [x, y];
    }
    const jawW = v => sm(640, 760, v[1]) * sm(690, 860, v[0]);
    function frame(p0) {
      if (!ready) return;
      /* lips and jaw are drawn a little bigger than anatomy so a student can SEE round (و ُ), spread (ي ِ), open (ا َ) and closed (ب م) from a phone */
      const p = Object.assign({}, p0, { jaw: (p0.jaw || 0) * 2.5, u: [p0.u[0] * 1.8, p0.u[1] * 1.6], l: [p0.l[0] * 1.8, p0.l[1] * 1.6] });
      gl.clearColor(0.04, 0.06, 0.09, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      drawMesh(MP, MP.V.map(v => plateWarp(v, p)), 1, null);            // plate (tongue, velum and lips removed), warped
      // soft palate: lowered = 1 (breathing / nasal), raised = 0 (closes the nose)
      const dv = [(UVUP[0] - UVULA[0]) * (1 - p.vel), (UVUP[1] - UVULA[1]) * (1 - p.vel)];
      drawMesh(MV, MV.V.map(v => { const w = sm(0, 150, Math.hypot(v[0] - VATT[0], v[1] - VATT[1])); return [v[0] + dv[0] * w, v[1] + dv[1] * w]; }), 0, [0, 0, 1]);
      // tongue: each dorsum point pulls the tissue near it; the floor of the mouth stays fixed
      const D = p.d.map((c, i) => [c[0] - DORSUM[i][0], c[1] - DORSUM[i][1]]);
      drawMesh(MT, MT.V.map(v => {
        let sw = 0, dx = 0, dy = 0, dmin = 1e9;
        for (let i = 0; i < DORSUM.length; i++) { const ex = v[0] - DORSUM[i][0], ey = v[1] - DORSUM[i][1], d2 = ex * ex + ey * ey, w = Math.exp(-d2 / 3200) + 1e-9;
          sw += w; dx += w * D[i][0]; dy += w * D[i][1]; if (d2 < dmin) dmin = d2; }
        const H = 75 + 150 * sm(895, 965, v[0]), f = Math.exp(-dmin / (2 * H * H));
        const jw = (p.jaw || 0) * sm(600, 760, v[1]) * .6;
        return [v[0] + f * dx / sw, v[1] + f * dy / sw + jw];
      }), 0, [1, 0, 0]);
      if (p.jaw > 8 || p.u[1] < -4 || p.l[1] > 4) gapFill(p);
      // lips: the inner edge stays on the teeth, the outer part moves
      drawMesh(MU, MU.V.map(v => { const w = sm(1020, 1085, v[0]); return [v[0] + p.u[0] * w, v[1] + p.u[1] * w * sm(560, 615, v[1])]; }), 0, [0, 1, 0]);
      drawMesh(ML, ML.V.map(v => { const w = sm(1016, 1080, v[0]) * (0.25 + 0.75 * sm(705, 640, v[1])); return [v[0] + p.l[0] * w - (p.jaw || 0) * .25, v[1] + p.l[1] * w + (p.jaw || 0)]; }), 0, [0, 1, 0]);
    }
    function overlay(p, ch) {
      const pt = q("m3pt"), chEl = q("m3ch");
      chEl.textContent = ch || "";
      if (p.c) { pt.setAttribute("transform", `translate(${p.c[0]},${p.c[1]})`); pt.style.opacity = 1;
        const ln = q("m3ln"); ln.setAttribute("x1", 0); ln.setAttribute("y1", 0); ln.setAttribute("x2", 1075 - p.c[0]); ln.setAttribute("y2", 975 - p.c[1]); ln.style.display = ch ? "" : "none"; }
      else pt.style.opacity = 0;
      q("m3glow").innerHTML = p.glow === "jawf" ? `<ellipse cx="790" cy="560" rx="210" ry="26" fill="#7fe0ff" opacity=".35" filter="url(#m3b)"/><ellipse cx="540" cy="760" rx="22" ry="170" fill="#7fe0ff" opacity=".3" filter="url(#m3b)"/>`
        : p.glow === "nose" ? `<ellipse cx="900" cy="440" rx="140" ry="40" fill="#7fe0ff" opacity=".3" filter="url(#m3b)"/>` : "";
      const a = p.air === "nose" ? AIRNOSE : p.air && AIR[p.air] != null ? AIR.base + AIR[p.air] : null;
      q("m3air").innerHTML = a ? `<path d="${a}" stroke="#7fd8ff" stroke-width="12" opacity=".22" filter="url(#m3b)"/><path d="${a}" class="mlFlow${p.air === "burst" ? " burst" : ""}" stroke="#a8ecff" stroke-width="4" stroke-dasharray="4 16" opacity=".9"/>` : "";
    }
    function labels() {
      q("m3lbl").innerHTML = showLbl ? Object.entries(LBL).map(([key, l]) => {
        const t = l[L] || l.en, wd = Math.max(70, t.length * (L === "en" ? 11 : 12) + 26), [x, y] = l.at;
        return `<g class="m3part" data-part="${key}" style="cursor:pointer"><rect x="${x - wd / 2 - 8}" y="${y - 38}" width="${wd + 16}" height="76" rx="24" fill="rgba(0,0,0,.01)"/><line x1="${x}" y1="${y}" x2="${l.to[0]}" y2="${l.to[1]}" stroke="#d9f1ff" stroke-width="1.6" opacity=".8"/><circle cx="${l.to[0]}" cy="${l.to[1]}" r="4.5" fill="#d9f1ff"/><rect x="${x - wd / 2}" y="${y - 17}" width="${wd}" height="34" rx="17" fill="#0d151d" fill-opacity=".82" stroke="#8fd3ff" stroke-width="1.4"/><text x="${x}" y="${y + 7}" text-anchor="middle" fill="#eaf6ff"${L === "ur" ? ' direction="rtl"' : ""}>${t}</text></g>`;
      }).join("") : "";
    }
    function go(target, ms, ch) {
      cancelAnimationFrame(raf); const from = cur, t0 = performance.now();
      q("m3pt").style.opacity = 0; q("m3air").innerHTML = ""; q("m3glow").innerHTML = ""; q("m3ch").textContent = ch || "";
      return new Promise(res => {
        const step = now => { const k = Math.min(1, (now - t0) / ms), m = mix(from, target, ease(k)); frame(m);
          if (k < 1) raf = requestAnimationFrame(step); else { cur = JSON.parse(JSON.stringify(target)); overlay(target, ch); alive(target); res(); } };
        raf = requestAnimationFrame(step);
      });
    }
    /* natural speech: one smooth, continuous run through a whole word — every letter's lip/jaw/tongue shape blends into the next, no stops.
       segs = [{ch, zone, v}] (v = fatha "a" / damma "u" / kasra "i" / "" sukun); total = ms for the whole word (the length of the recording) */
    function flow(segs, total) {
      cancelAnimationFrame(raf); q("m3pt").style.opacity = 0; q("m3air").innerHTML = ""; q("m3glow").innerHTML = "";
      const n = segs.length || 1, per = (total || 1200) / n, K = [{ t: 0, p: cur, ch: "" }]; let t = 0;
      segs.forEach(sg => { const c = letterPose(sg.ch, sg.zone, ""); c.c = null; c.air = null;
        K.push({ t: t + per * .38, p: c, ch: sg.ch });                       // the letter itself (lips shape first)
        t += per; K.push({ t: t - per * .06, p: letterPose(sg.ch, sg.zone, sg.v || ""), ch: sg.ch }); });  // then its vowel opens / rounds / spreads
      K.push({ t: t + per * .5, p: JSON.parse(JSON.stringify(REST)), ch: "" });
      const t0 = performance.now(), end = K[K.length - 1].t;
      return new Promise(res => {
        const step = now => { const e = now - t0; let i = 1; while (i < K.length - 1 && K[i].t < e) i++;
          const a = K[i - 1], b = K[i], k = Math.max(0, Math.min(1, (e - a.t) / Math.max(1, b.t - a.t)));
          const m = mix(a.p, b.p, k < .5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k)); frame(m); q("m3ch").textContent = (k < .5 ? a.ch : b.ch) || "";
          if (e < end) raf = requestAnimationFrame(step); else { cur = JSON.parse(JSON.stringify(REST)); frame(cur); q("m3ch").textContent = ""; res(); } };
        raf = requestAnimationFrame(step); });
    }
    /* REAL speech for one Arabic word: segs = [{ch, zone, v: "a"|"u"|"i"|"", long, dbl}] from phonemize(); getP() = how far the real recording is (0..1, >1 = finished).
       Every sound gets time by its true length (a long vowel / a doubled letter lasts longer), the lips take the shape of the vowel while the tongue is still on the letter
       (only ب م ف و really decide the lips), so "ya-lid", "a-had", "wa-n-naas" move exactly as they are said, and follow the recording itself (never a fixed clock). */
    let pend = null;
    function speak(segs, getP) {
      cancelAnimationFrame(raf); if (pend) { const r0 = pend; pend = null; r0(); }
      q("m3pt").style.opacity = 0; q("m3air").innerHTML = ""; q("m3glow").innerHTML = "";
      const LOCK = "بمفو", cl = o => JSON.parse(JSON.stringify(o)), K = [{ t: 0, p: cl(cur), ch: "" }]; let t = 0;
      segs.forEach(sg => {
        const V = letterPose(sg.ch, sg.zone, sg.v || ""), C = letterPose(sg.ch, sg.zone, ""); C.air = null;
        if (!LOCK.includes(sg.ch) && sg.v) { const k = .6; C.u = [lerp(C.u[0], V.u[0], k), lerp(C.u[1], V.u[1], k)]; C.l = [lerp(C.l[0], V.l[0], k), lerp(C.l[1], V.l[1], k)]; C.jaw = lerp(C.jaw || 0, V.jaw || 0, k); } /* lips already go to the coming vowel */
        const cw = sg.dbl ? 1.7 : sg.ch === "ء" ? .7 : 1;
        t += cw * .7; K.push({ t, p: cl(C), ch: sg.ch }); t += cw * .3;                       /* the letter is reached, then held (longer when doubled) */
        if (sg.dbl) { t += .5; K.push({ t, p: cl(C), ch: sg.ch }); }                           /* tashdeed: the closure is kept, then released */
        if (sg.v) { const vw = sg.long ? 2.6 : 1.15; t += vw * .4; K.push({ t, p: cl(V), ch: sg.ch }); t += vw * .6; K.push({ t, p: cl(V), ch: sg.ch }); }  /* vowel opens, rounds or spreads, and a madd keeps it */
        else if (!sg.dbl) { t += .35; K.push({ t, p: cl(C), ch: sg.ch }); }                    /* final letter with sukun: held shut/touching */
      });
      const END = t, R = cl(REST);
      return new Promise(res => {
        pend = res; let done = 0, lp = null;
        const fin = () => { if (done++) return; pend = null; if (lp) cur = lp; go(R, 380, "").then(res); };
        const step = () => {
          if (!pend) return; const p = getP();
          if (p >= 1.02) return fin();
          const e = Math.max(0, Math.min(1, p)) * END; let i = 1; while (i < K.length - 1 && K[i].t < e) i++;
          const a = K[i - 1], b = K[i], k = Math.max(0, Math.min(1, (e - a.t) / Math.max(1e-6, b.t - a.t)));
          lp = mix(a.p, b.p, k < .5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k)); frame(lp); q("m3ch").textContent = (k < .5 ? a.ch : b.ch) || "";
          raf = requestAnimationFrame(step); };
        raf = requestAnimationFrame(step); });
    }
    /* after the pose is reached the organs keep moving for a moment, like a real voice:
       throat walls pulse (halq letters), the voice box buzzes (voiced letters), the tongue tip trills (ر), lips burst (ب) */
    function alive(T) {
      const t0 = performance.now(), dur = 1700, v = T.vib || "";
      const buzz = /voice|throat|trill|nose|lips|burst|tap/.test(v) && !(T.c === null);
      q("m3glow").insertAdjacentHTML("beforeend", buzz && v !== "tap" ? `<g class="m3buzz"><ellipse cx="545" cy="948" rx="26" ry="11" fill="#ffd23f" opacity=".55" filter="url(#m3b)"/><path d="M515,948 q8,-9 15,0 t15,0 t15,0 t15,0" fill="none" stroke="#ffe48a" stroke-width="2.5"/></g>` : "");
      const step = now => {
        const e = (now - t0) / 1000; if (now - t0 > dur) { frame(T); return; }
        const p = JSON.parse(JSON.stringify(T)), fade = 1 - sm(.7, 1, (now - t0) / dur);
        if (v === "throat") { p.thr = T.thr * (.78 + .22 * Math.sin(e * 16)); p.lar = (T.lar || 0) + 3 * Math.sin(e * 28) * fade; }
        if (v === "voice" || v === "nose" || v === "lips") p.lar = (T.lar || 0) + 1.6 * Math.sin(e * 70) * fade;
        if (v === "trill") { p.d[0] = [T.d[0][0], T.d[0][1] + 7 * Math.sin(e * 48) * fade]; p.d[1] = [T.d[1][0], T.d[1][1] + 4 * Math.sin(e * 48) * fade]; }
        if (v === "tap") { const k = Math.min(1, e / .18); p.d.forEach((d, i) => { if (i >= 2 && i <= 7) d[1] += 10 * sm(0, 1, k) * fade; }); }
        if (v === "burst" || v === "lips") { const o = v === "burst" ? sm(.25, .45, e) : (.5 + .5 * Math.sin(e * 9)) * .4; p.u = [T.u[0], T.u[1] - 8 * o]; p.l = [T.l[0], T.l[1] + 14 * o]; p.jaw = (T.jaw || 0) + 6 * o; }
        if (v === "nose") p.vel = 1;
        frame(p); raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    labels();
    if (gl) Promise.all([load(base.replace(/mouth3d\.js.*$/, "mk/mkb.webp")), load(base.replace(/mouth3d\.js.*$/, "mk/mkp.webp")), load(base.replace(/mouth3d\.js.*$/, "mk/mkm.png"))]).then(a => setup(...a)).catch(() => {});
    const onResize = () => { if (ready) { resize(); frame(cur); } }; window.addEventListener("resize", onResize);
    return {
      to(ch, zone, ms, vowel) { return go(letterPose(ch, zone, vowel), ms || 650, ch); },
      flow, speak,
      rest(ms) { return go(JSON.parse(JSON.stringify(REST)), ms || 500, ""); },
      labels(on, lg) { showLbl = on; if (lg) L = lg; labels(); },
      destroy() { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); try { const e = gl && gl.getExtension("WEBGL_lose_context"); e && e.loseContext(); } catch (e) {} },
      at(ch, zone) { const c = letterPose(ch, zone).c; return c ? [(c[0] - O[0]) / S, (c[1] - O[1]) / S] : [.5, .4]; }
    };
  }
  window.MLab3 = { Lab, ok };
})();

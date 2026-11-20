/* Makharij Lab — X-RAY USTAD.
   The AI Ustad's own face, seen through like an X-ray: cranium, brain, jaw bone, teeth, tongue, throat and voice box move inside it,
   letter by letter and harakat by harakat, while the Ustad's voice plays. A small side-view section sits in the corner and moves together with it.
   Same interface as the other labs (to / flow / speak / rest / labels / destroy), so it works on the lab page, in lessons, classes and the coach. */
(function () {
  "use strict";
  const SRC = (document.currentScript && document.currentScript.src) || "xray.js";
  const DIR = SRC.replace(/xray\.js.*$/, ""), NS = "http://www.w3.org/2000/svg";
  const W = 450, S = 2, ZM = 1.22; /* picture size, sharpness, zoom on the mouth */
  const SX = x => 1 + 223 + (x - 223) * ZM, SY = y => -22 + 270 + (y - 270) * ZM;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = t => t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
  const ok = () => { try { return !!document.createElement("canvas").getContext("2d"); } catch (e) { return false; } };
  const face = new Image(); let faceOK = false; face.onload = () => { faceOK = true; }; face.src = DIR + "ustad/v_closed.webp?v=2";

  /* qari terms of each makhraj */
  const ZT = { jawf: "الجوف", h1: "أقصى الحلق", h2: "وسط الحلق", h3: "أدنى الحلق", l1: "أقصى اللسان + الحنك اللين", l2: "أقصى اللسان + الحنك", l3: "وسط اللسان + الحنك الصلب", l4: "حافة اللسان + الأضراس", l5: "طرف اللسان + اللثة", l6: "طرف اللسان + أصول الثنايا العليا", l7: "طرف اللسان + الثنايا السفلى", l8: "طرف اللسان + أطراف الثنايا العليا", s1: "الشفة السفلى + الثنايا العليا", s2: "الشفتان", kh: "الخيشوم" };
  /* what the inside does: j jaw open, up tip to gum, fwd tip to the teeth, low tip down, back/mid/side tongue raised, close lips shut, round, wide, tuck lower lip, nas nose, air breath, thr throat glow at thrY (1 deep .. 3 high), g contact glow */
  const KEYS = ["j", "up", "fwd", "low", "back", "mid", "side", "close", "round", "wide", "tuck", "nas", "air", "thr", "thrY", "g"];
  const P0 = () => { const o = { z: null, ch: "" }; KEYS.forEach(k => { o[k] = 0; }); o.thrY = 2; return o; };
  const ZP = { jawf: { j: .78, air: 1, g: 1 }, h1: { j: .55, thr: 1, thrY: 1, air: 1, g: 1 }, h2: { j: .55, thr: 1, thrY: 2, air: 1, back: .25, g: 1 }, h3: { j: .5, thr: 1, thrY: 3, air: 1, back: .5, g: 1 },
    l1: { j: .5, back: 1, g: 1 }, l2: { j: .45, back: .7, g: 1 }, l3: { j: .3, mid: 1, g: 1 }, l4: { j: .3, side: 1, g: 1 }, l5: { j: .35, up: 1, g: 1 }, l6: { j: .3, up: .8, fwd: .35, g: 1 },
    l7: { j: .12, low: 1, air: 1, g: 1 }, l8: { j: .3, fwd: 1, g: 1 }, s1: { j: .2, tuck: 1, g: 1 }, s2: { j: 0, close: 1, g: 1 }, kh: { j: .1, nas: 1, close: 1, g: 1 } };
  const REL = ["up", "fwd", "low", "back", "mid", "side", "tuck", "nas", "thr"];
  function target(ch, zone, vowel) {
    const p = Object.assign(P0(), ZP[zone] || {}); p.z = zone || null; p.ch = ch || "";
    if (ch === "و") { p.close = 0; p.round = 1; p.j = .3; }
    if (ch === "ب" || ch === "م") p.close = 1;
    if (ch === "م") p.nas = .8; else if (ch === "ن") p.nas = .5;
    if (ch === "ر") { p.up = 1; p.fwd = .2; }
    if (vowel) { REL.forEach(k => { p[k] *= .4; }); p.g *= .6; p.close = 0; p.air = Math.min(p.air, .4);
      if (vowel === "a") { p.j = Math.max(p.j, .6); p.wide = Math.max(p.wide, .15); } else if (vowel === "u") { p.round = 1; p.j = Math.max(p.j, .3); } else if (vowel === "i") { p.wide = 1; p.j = clamp(Math.max(p.j, .2), .2, .35); } }
    return p;
  }
  function mixv(a, b, k) { const o = {}; KEYS.forEach(n => { o[n] = lerp(a[n], b[n], k); }); o.z = k < .5 ? a.z : b.z; o.ch = k < .5 ? a.ch : b.ch; return o; }
  const cloneP = p => Object.assign({}, p);

  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); }
  function smooth(c, pts, close) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
    const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]); if (close) c.closePath(); }

  function Lab(svgEl, lang) {
    let L = lang, showLbl = true, dead = false, state = P0(), act = null, raf = 0, dr = 0, hold = 0;
    const wrap = document.createElement("div"); wrap.className = "ml3 mlx"; wrap.style.cssText = "position:relative;overflow:hidden;background:#06121c";
    const cv = document.createElement("canvas"); cv.className = "ml3c"; cv.width = cv.height = W * S; cv.style.cssText = "width:100%;height:100%;display:block;background:#06121c";
    wrap.appendChild(cv); svgEl.replaceWith(wrap);
    const ctx = cv.getContext("2d");
    /* side-view section in the corner, moving together */
    let mini = null;
    try { const Eng = window.MLab3 && MLab3.ok() ? MLab3 : window.MLab; if (Eng) { const d = document.createElement("div"); d.className = "mlmini"; d.style.cssText = "position:absolute;right:6px;bottom:6px;width:35%;aspect-ratio:1/1;border-radius:14px;overflow:hidden;border:2px solid #e3aa3c;box-shadow:0 6px 18px rgba(0,0,0,.55);pointer-events:none;background:#0a0f16";
      const s2 = document.createElementNS(NS, "svg"); d.appendChild(s2); wrap.appendChild(d); mini = Eng.Lab(s2, lang); mini.labels && mini.labels(false, lang); } } catch (e) { mini = null; }

    /* ---------- the picture ---------- */
    function draw(now) {
      if (dead) return; dr = requestAnimationFrame(draw);
      const t = now / 1000, s = state, c = ctx; c.setTransform(S, 0, 0, S, 0, 0); c.clearRect(0, 0, W, W); c.save(); c.translate(1, -22); c.translate(223, 270); c.scale(ZM, ZM); c.translate(-223, -270);
      /* face, tinted like a scan */
      c.fillStyle = "#06121c"; c.fillRect(-60, -40, 570, 560);
      if (faceOK) c.drawImage(face, 0, 0, 448, 470);
      c.fillStyle = "rgba(4,26,48,.55)"; c.fillRect(-60, -40, 570, 560);
      const dy = s.j * 26, yu = 277, yl = 278 + dy, cx = 223, pulse = .5 + .5 * Math.sin(t * 6);
      const bone = a => `rgba(214,238,255,${a})`;
      c.globalCompositeOperation = "lighter"; c.lineJoin = "round"; c.lineCap = "round";
      /* cranium + brain */
      let g = c.createRadialGradient(cx, 112, 10, cx, 112, 110); g.addColorStop(0, "rgba(255,120,160,.34)"); g.addColorStop(.6, "rgba(160,110,255,.16)"); g.addColorStop(1, "rgba(90,170,255,.05)");
      c.fillStyle = g; c.beginPath(); c.ellipse(cx, 118, 108, 92, 0, 0, 6.2832); c.fill();
      c.strokeStyle = bone(.7); c.lineWidth = 2.5; c.stroke();
      c.strokeStyle = "rgba(255,170,200,.32)"; c.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const yy = 72 + i * 16, w = 70 - Math.abs(i - 2.5) * 9; c.beginPath(); c.moveTo(cx - w, yy); c.quadraticCurveTo(cx - w / 2, yy - 10, cx, yy + 2); c.quadraticCurveTo(cx + w / 2, yy + 12, cx + w, yy - 2); c.stroke(); }
      c.strokeStyle = "rgba(255,200,220,.28)"; c.beginPath(); c.moveTo(cx, 54); c.lineTo(cx, 170); c.stroke();
      /* eye sockets, nose, cheek bones */
      c.strokeStyle = bone(.62); c.lineWidth = 2; [180, 267].forEach(x => { c.beginPath(); c.ellipse(x, 185, 25, 21, 0, 0, 6.2832); c.stroke(); });
      c.beginPath(); c.moveTo(cx, 208); c.lineTo(207, 240); c.quadraticCurveTo(cx, 246, 239, 240); c.closePath(); c.stroke();
      c.strokeStyle = bone(.4); c.beginPath(); c.moveTo(150, 204); c.quadraticCurveTo(128, 214, 126, 238); c.moveTo(296, 204); c.quadraticCurveTo(318, 214, 320, 238); c.stroke();
      c.beginPath(); c.moveTo(178, 252); c.quadraticCurveTo(cx, 238, 268, 252); c.stroke();
      /* neck: pharynx, spine, windpipe, voice box */
      c.fillStyle = "rgba(255,110,140,.13)"; rr(c, 200, 330, 46, 46, 10); c.fill();
      for (let i = 0; i < 5; i++) { c.fillStyle = bone(.16); rr(c, 200, 360 + i * 20, 46, 15, 5); c.fill(); }
      c.strokeStyle = bone(.55); c.lineWidth = 1.6; for (let y = 396; y < 452; y += 11) { c.beginPath(); c.moveTo(210, y); c.quadraticCurveTo(cx, y + 5, 236, y); c.stroke(); }
      c.strokeStyle = bone(.7); c.lineWidth = 2; c.beginPath(); c.moveTo(205, 368); c.lineTo(cx, 359); c.lineTo(241, 368); c.lineTo(238, 390); c.lineTo(cx, 397); c.lineTo(208, 390); c.closePath(); c.stroke();
      c.strokeStyle = `rgba(255,150,170,${.5 + .3 * s.thr})`; c.beginPath(); c.moveTo(214, 380); c.quadraticCurveTo(cx, 376 + 4 * Math.sin(t * 30) * s.thr, 232, 380); c.stroke();
      /* jaw bone follows the opening */
      const J = (x, y) => [x, y + dy * clamp((y - 230) / 110, 0, 1)];
      const jp = [J(127, 228), J(134, 280), J(150, 318), J(190, 343), J(cx, 351), J(256, 343), J(296, 318), J(312, 280), J(319, 228)];
      c.strokeStyle = bone(.78); c.lineWidth = 4; smooth(c, jp, false); c.stroke();
      c.strokeStyle = bone(.35); c.lineWidth = 1.5; c.beginPath(); [[127, 228], [134, 280], [150, 318]].forEach((p, i) => { const q = J(p[0] + 9, p[1] - (i ? 0 : 0)); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke();
      c.beginPath(); [[319, 228], [312, 280], [296, 318]].forEach((p, i) => { const q = J(p[0] - 9, p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke();
      c.fillStyle = "rgba(120,200,255,.07)"; smooth(c, jp, true); c.fill();
      /* mouth cavity */
      c.globalCompositeOperation = "source-over";
      if (dy > .6) { c.fillStyle = "rgba(14,2,10,.82)"; c.beginPath(); c.ellipse(cx, (yu + yl) / 2, 45 - 10 * s.round, (yl - yu) / 2 + 3, 0, 0, 6.2832); c.fill(); }
      c.globalCompositeOperation = "lighter";
      /* tongue */
      const bw = 48 + 6 * s.side, topC = yl - 5 - 10 * s.mid - 8 * s.back - 4 * s.side - 5 * s.up, tipY = lerp(topC, yu + 3, s.up) - 4 * s.fwd;
      const tg = c.createLinearGradient(0, tipY, 0, yl + 14); tg.addColorStop(0, "rgba(255,150,170,.95)"); tg.addColorStop(1, "rgba(220,80,110,.8)");
      c.fillStyle = tg; c.beginPath(); c.moveTo(cx - bw, yl + 14); c.quadraticCurveTo(cx - bw - 4, yl - 4, cx - bw * .55, topC + 3); c.quadraticCurveTo(cx - 8, tipY - 2, cx, tipY); c.quadraticCurveTo(cx + 8, tipY - 2, cx + bw * .55, topC + 3);
      c.quadraticCurveTo(cx + bw + 4, yl - 4, cx + bw, yl + 14); c.closePath(); c.fill(); c.strokeStyle = "rgba(255,210,220,.7)"; c.lineWidth = 1.4; c.stroke();
      c.strokeStyle = "rgba(255,230,235,.35)"; c.beginPath(); c.moveTo(cx, tipY + 4); c.lineTo(cx, yl + 8); c.stroke();
      /* teeth: upper fixed, lower with the jaw */
      const teeth = (y0, h, up) => { for (let i = -3; i < 3; i++) { const x = cx + i * 8.8 + 0.4; const tg2 = c.createLinearGradient(0, y0, 0, y0 + h); tg2.addColorStop(0, up ? "rgba(255,255,255,.95)" : "rgba(235,246,255,.7)"); tg2.addColorStop(1, up ? "rgba(220,240,255,.6)" : "rgba(255,255,255,.95)");
          c.fillStyle = tg2; rr(c, x, y0, 8.2, h, 3); c.fill(); c.strokeStyle = "rgba(200,230,255,.5)"; c.lineWidth = .8; c.stroke(); }
        for (let side = -1; side <= 1; side += 2) for (let i = 1; i <= 3; i++) { const x = cx + side * (26.4 + i * 9.4) - (side < 0 ? 8.6 : 0), hh = h - i * 2.2; c.fillStyle = up ? "rgba(235,246,255,.7)" : "rgba(235,246,255,.62)"; rr(c, x, up ? y0 : y0 + (h - hh), 8.6, hh, 3); c.fill(); c.strokeStyle = "rgba(200,230,255,.4)"; c.stroke(); } };
      teeth(yu - 19, 19, true); teeth(yl - 1, 17, false);
      /* tongue tip between the teeth (ث ذ ظ) */
      if (s.fwd > .05) { c.fillStyle = "rgba(255,140,165,.92)"; c.beginPath(); c.ellipse(cx, lerp(yl - 2, yu + dy * .45, .6), 18 * s.fwd + 4, 5 + dy * .22 * s.fwd + 2, 0, 0, 6.2832); c.fill(); }
      /* lips outline: shuts, rounds, widens */
      const hw = 42 + 10 * s.wide - 15 * s.round - 4 * s.close, ly = 277 + dy * .5, up2 = ly - 3 - dy * .5 - 2 * s.round - 1 * s.close, lo = ly + 3 + dy * .5 + 2 * s.round - 9 * s.tuck * (1 - .3 * s.j);
      c.strokeStyle = "rgba(255,150,170,.92)"; c.lineWidth = 2.6; c.beginPath(); c.moveTo(cx - hw, ly); c.quadraticCurveTo(cx, up2 - 6, cx + hw, ly); c.quadraticCurveTo(cx, lo + 7 + dy * .3, cx - hw, ly); c.stroke();
      if (s.close > .5) { c.strokeStyle = `rgba(255,230,160,${.35 + .4 * pulse})`; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - hw + 4, ly); c.lineTo(cx + hw - 4, ly); c.stroke(); }
      /* breath: rings leaving the mouth, light in the nose */
      if (s.air > .1) { for (let i = 0; i < 3; i++) { const r = 8 + ((t * 38 + i * 14) % 42); c.strokeStyle = `rgba(150,235,255,${.45 * s.air * (1 - (r - 8) / 42)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(cx, ly, r * 1.2, r * .55, 0, 0, 6.2832); c.stroke(); } }
      if (s.nas > .1) { [205, 241].forEach(x => { const rg = c.createRadialGradient(x, 214, 2, x, 214, 26); rg.addColorStop(0, `rgba(130,230,255,${(.55 + .3 * pulse) * s.nas})`); rg.addColorStop(1, "rgba(130,230,255,0)"); c.fillStyle = rg; c.beginPath(); c.arc(x, 214, 26, 0, 6.2832); c.fill(); }); }
      /* contact glow + label */
      const CPy = { jawf: (yu + yl) / 2, l1: yu - 8, l2: yu - 6, l3: yu - 3, l4: yl - 8, l5: yu + 3, l6: yu + 3, l7: yl + 2, l8: (yu + yl) / 2, s1: lo, s2: ly, kh: 232 };
      const pts = []; const z = s.z;
      if (z && s.g > .12) {
        if (z === "h1") pts.push([cx, 384]); else if (z === "h2") pts.push([cx, 366]); else if (z === "h3") pts.push([cx, 352]);
        else if (z === "l4") { pts.push([190, CPy.l4]); pts.push([256, CPy.l4]); } else if (CPy[z] != null) pts.push([cx, CPy[z]]);
      }
      if (s.thr > .1) { const gy = lerp(384, 352, (s.thrY - 1) / 2); pts.push([cx, gy]); }
      const seen = {}; pts.forEach(p => { const k = p[0] + "," + (p[1] | 0); if (seen[k]) return; seen[k] = 1; const a = Math.max(s.g, s.thr);
        const gg = c.createRadialGradient(p[0], p[1], 1, p[0], p[1], 24); gg.addColorStop(0, `rgba(255,240,150,${.95 * a})`); gg.addColorStop(.4, `rgba(255,190,50,${.55 * a})`); gg.addColorStop(1, "rgba(255,160,0,0)");
        c.fillStyle = gg; c.beginPath(); c.arc(p[0], p[1], 24 + 3 * pulse, 0, 6.2832); c.fill();
        c.fillStyle = `rgba(255,248,200,${a})`; c.beginPath(); c.arc(p[0], p[1], 5, 0, 6.2832); c.fill();
        c.strokeStyle = `rgba(255,210,70,${.8 * a})`; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], 11 + 5 * pulse, 0, 6.2832); c.stroke(); });
      c.globalCompositeOperation = "source-over";
      /* scan lines and a moving scan bar, like the X-ray mirror */
      c.fillStyle = "rgba(160,220,255,.05)"; for (let y = -40; y < 520; y += 4) c.fillRect(-60, y, 570, 1);
      const sy = (t * 70) % 520 - 20, sg = c.createLinearGradient(0, sy - 14, 0, sy + 14); sg.addColorStop(0, "rgba(120,210,255,0)"); sg.addColorStop(.5, "rgba(120,210,255,.16)"); sg.addColorStop(1, "rgba(120,210,255,0)"); c.fillStyle = sg; c.fillRect(-60, sy - 14, 570, 28);
      c.restore();
      /* name of the makhraj + the letter (screen coordinates) */
      c.setTransform(S, 0, 0, S, 0, 0);
      if (act && act.z && showLbl && pts.length) { const term = ZT[act.z] || "", p0 = pts[0], py = 24, wd = Math.min(300, Math.max(110, term.length * 8.6 + 28)), px = 10;
        c.strokeStyle = "rgba(255,210,100,.85)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px + 30, py + 13); c.lineTo(SX(p0[0]), SY(p0[1])); c.stroke();
        c.fillStyle = "#ffd36a"; c.beginPath(); c.arc(SX(p0[0]), SY(p0[1]), 3, 0, 6.2832); c.fill();
        c.fillStyle = "rgba(10,18,26,.88)"; rr(c, px, py - 13, wd, 26, 13); c.fill(); c.strokeStyle = "#e3aa3c"; c.lineWidth = 1.2; c.stroke();
        c.fillStyle = "#ffe08a"; c.font = "15px 'Amiri Quran','Noto Naskh Arabic',serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(term, px + wd / 2, py + 1); }
      if (act && act.ch) { c.save(); c.shadowColor = "rgba(255,176,0,.8)"; c.shadowBlur = 10; c.fillStyle = "#ffe08a"; c.font = "64px 'Amiri Quran','Noto Naskh Arabic',serif"; c.textAlign = "center"; c.textBaseline = "alphabetic"; c.fillText(act.ch, 392, 428); c.restore(); }
    }
    dr = requestAnimationFrame(draw);

    /* ---------- motion ---------- */
    const REST = () => P0();
    function go(tg, ms, then) { cancelAnimationFrame(raf); const from = cloneP(state), t0 = performance.now();
      return new Promise(res => { const step = now => { if (dead) return res(); const k = clamp((now - t0) / (ms || 1), 0, 1); state = mixv(from, tg, ease(k)); if (k < 1) raf = requestAnimationFrame(step); else { then && then(); res(); } }; raf = requestAnimationFrame(step); }); }
    function speak(segs, getP) {
      cancelAnimationFrame(raf); act = null;
      const K = [{ t: 0, p: cloneP(state) }]; let t = 0;
      segs.forEach(sg => {
        const C = target(sg.ch, sg.zone, ""), V = sg.v ? target(sg.ch, sg.zone, sg.v) : null;
        if (V && !"بمفو".includes(sg.ch)) { C.round = V.round; C.wide = V.wide; C.j = Math.max(C.j, V.j * .6); }
        const cw = sg.dbl ? 1.7 : sg.ch === "ء" ? .7 : 1;
        t += cw * .7; K.push({ t, p: cloneP(C) }); t += cw * .3;
        if (sg.dbl) { t += .5; K.push({ t, p: cloneP(C) }); }
        if (V) { const vw = sg.long ? 2.6 : 1.15; t += vw * .4; K.push({ t, p: cloneP(V) }); t += vw * .6; K.push({ t, p: cloneP(V) }); }
        else if (!sg.dbl) { t += .35; K.push({ t, p: cloneP(C) }); }
      });
      const END = t, R = REST();
      return new Promise(res => { let done = 0, lp = null; const fin = () => { if (done++) return; if (lp) state = cloneP(lp); act = null; go(R, 380).then(res); };
        const step = () => { if (dead) return res(); const p = getP(); if (p >= 1.02) return fin();
          const e = clamp(p, 0, 1) * END; let i = 1; while (i < K.length - 1 && K[i].t < e) i++;
          const a = K[i - 1], b = K[i], k = clamp((e - a.t) / Math.max(1e-6, b.t - a.t), 0, 1); lp = mixv(a.p, b.p, ease(k)); state = lp;
          act = lp.z ? { z: lp.z, ch: lp.ch } : null; raf = requestAnimationFrame(step); };
        raf = requestAnimationFrame(step); });
    }
    return {
      to(ch, zone, ms, vowel) { const tg = target(ch, zone, vowel); act = null; mini && mini.to && mini.to(ch, zone, ms, vowel); return go(tg, ms || 650, () => { act = { z: zone, ch }; }); },
      flow(segs, total) { const t0 = performance.now(); mini && mini.flow && mini.flow(segs.map(s => Object.assign({}, s)), total); return speak(segs.map(s => Object.assign({}, s)), () => (performance.now() - t0) / (total || 1200)); },
      speak(segs, getP) { mini && mini.speak && mini.speak(segs, getP); return speak(segs, getP); },
      rest(ms) { act = null; mini && mini.rest && mini.rest(ms); return go(REST(), ms || 500); },
      labels(on, lg) { showLbl = on; if (lg) L = lg; },
      destroy() { dead = true; cancelAnimationFrame(raf); cancelAnimationFrame(dr); try { mini && mini.destroy && mini.destroy(); } catch (e) {} }
    };
  }
  window.MLabXray = { Lab, ok };
})();

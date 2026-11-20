/* Fahm Toon3D v2 — cinematic stylised 3D built entirely from code (three.js + generated textures).
   No model/video files. Post-processing: HDR, bloom, depth-of-field, grade, grain. */
(function () {
'use strict';
const T = window.THREE; if (!T) return;
const TAU = Math.PI * 2, PI = Math.PI, clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t, sstep = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
const R = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const C = c => new T.Color(c);
const mixHex = (a, b, t) => '#' + C(a).lerp(C(b), t).getHexString();
function ctex(w, h, fn, o) { o = o || {}; const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); if (!o.linear) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; if (o.repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; } return t; }
const mesh = (g, m, o) => { const x = new T.Mesh(g, m); x.castShadow = !(o && o.cast === false); x.receiveShadow = !(o && o.recv === false); return x; };
const ell = (rx, ry, rz, m, seg) => { const x = mesh(new T.SphereGeometry(1, seg || 28, Math.max(8, (seg || 28) * .75 | 0)), m); x.scale.set(rx, ry, rz); return x; };
const cap = (r, len, m, seg) => mesh(new T.CapsuleGeometry(r, len, 5, seg || 12), m);
const L1 = o => { o.layers.set(1); o.traverse && o.traverse(c => c.layers.set(1)); return o; };

/* ================= textures ================= */
const TX = {};
const MEMO = {}; const memo = (k, f) => MEMO[k] || (MEMO[k] = f());
TX.glow = () => memo('glow', () => ctex(128, 128, (g, w, h) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.2, 'rgba(255,255,255,.5)'); r.addColorStop(.55, 'rgba(255,255,255,.12)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }));
TX.bokeh = () => memo('bokeh', () => ctex(128, 128, (g, w, h) => { g.beginPath(); g.arc(64, 64, 58, 0, TAU); const r = g.createRadialGradient(64, 64, 20, 64, 64, 58); r.addColorStop(0, 'rgba(255,255,255,.35)'); r.addColorStop(.85, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fill(); }));
TX.star = () => memo('star', () => ctex(64, 64, (g, w, h) => { g.translate(32, 32); const q = g.createRadialGradient(0, 0, 0, 0, 0, 30); q.addColorStop(0, 'rgba(255,255,255,1)'); q.addColorStop(.3, 'rgba(255,255,255,.35)'); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.beginPath(); g.arc(0, 0, 30, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4, r = i % 2 ? 2.5 : 22; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }));
TX.fabric = () => memo('fabric', () => ctex(128, 128, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); const r = R(5); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(${y % 4 ? 150 : 100},${y % 4 ? 150 : 100},${y % 4 ? 150 : 100},.5)`; g.fillRect(0, y, w, 1); } for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(${x % 4 ? 160 : 90},${x % 4 ? 160 : 90},${x % 4 ? 160 : 90},.35)`; g.fillRect(x, 0, 1, h); } for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${r() * 255 | 0},${r() * 255 | 0},${r() * 255 | 0},.12)`; g.fillRect(r() * w, r() * h, 2, 2); } }, { linear: true, repeat: true }));
TX.cloud = () => memo('cloud', () => ctex(256, 128, (g, w, h) => { const r = R(9); for (let i = 0; i < 34; i++) { const x = 40 + r() * 176, y = 52 + r() * 34 - Math.abs(x - 128) * .1, rad = 22 + r() * 26; const gr = g.createRadialGradient(x, y - rad * .25, rad * .1, x, y, rad); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.6, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill(); } g.globalCompositeOperation = 'source-atop'; const sh = g.createLinearGradient(0, 30, 0, 110); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(150,120,170,.55)'); g.fillStyle = sh; g.fillRect(0, 0, w, h); }));
TX.rays = () => memo('rays', () => ctex(512, 512, (g, w, h) => { const r = R(2); g.translate(256, 256); for (let i = 0; i < 46; i++) { const a = r() * TAU, wd = .02 + r() * .06, l = 150 + r() * 106; const gr = g.createLinearGradient(0, 0, Math.cos(a) * l, Math.sin(a) * l); gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, l, a - wd, a + wd); g.closePath(); g.fill(); } const rg = g.createRadialGradient(0, 0, 0, 0, 0, 256); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = rg; g.fillRect(-256, -256, 512, 512); }));
TX.sky = stops => ctex(8, 256, (g, w, h) => { const l = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => l.addColorStop(o, c)); g.fillStyle = l; g.fillRect(0, 0, w, h); });
TX.mat = (a, b) => ctex(256, 384, (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); const r = R(7); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(0,0,0,${r() * .08})`; g.fillRect(r() * w, r() * h, 2, 1); } g.strokeStyle = b; g.lineWidth = 6; g.strokeRect(12, 12, w - 24, h - 24); g.lineWidth = 2; g.strokeRect(26, 26, w - 52, h - 52); g.fillStyle = b; g.globalAlpha = .85; g.beginPath(); g.moveTo(w / 2 - 54, 170); g.lineTo(w / 2 - 54, 120); g.quadraticCurveTo(w / 2, 36, w / 2 + 54, 120); g.lineTo(w / 2 + 54, 170); g.closePath(); g.fill(); g.globalAlpha = 1; g.fillStyle = a; g.beginPath(); g.moveTo(w / 2 - 34, 170); g.lineTo(w / 2 - 34, 124); g.quadraticCurveTo(w / 2, 62, w / 2 + 34, 124); g.lineTo(w / 2 + 34, 170); g.closePath(); g.fill(); g.strokeStyle = b; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(w / 2 - 70, 215 + i * 20); g.lineTo(w / 2 + 70, 215 + i * 20); g.stroke(); } for (let x = 14; x < w - 12; x += 8) { g.fillStyle = b; g.fillRect(x, 0, 3, 10); g.fillRect(x, h - 10, 3, 10); } });
TX.page = () => memo('page', () => ctex(256, 256, (g, w, h) => { g.fillStyle = '#fbf3df'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9972f'; g.lineWidth = 4; g.strokeRect(10, 10, w - 20, h - 20); g.lineWidth = 1.5; g.strokeRect(18, 18, w - 36, h - 36); g.strokeStyle = '#2a1a50'; g.lineWidth = 2.4; const r = R(3); for (let i = 0; i < 10; i++) { g.beginPath(); g.moveTo(w - 30, 38 + i * 20); let x = w - 30; while (x > 36) { const l = 10 + r() * 22; g.quadraticCurveTo(x - l / 2, 38 + i * 20 + (r() - .5) * 12, x - l, 38 + i * 20 + (r() - .5) * 3); x -= l + 3; } g.stroke(); } }));
TX.cap = () => memo('cap', () => ctex(256, 128, (g, w, h) => { g.fillStyle = '#fbf8f2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#cfc4df'; g.lineWidth = 2; for (let i = 0; i < 32; i++) { g.beginPath(); g.moveTo(i * 8, 0); g.lineTo(i * 8, h); g.stroke(); } for (let j = 0; j < 14; j++) { g.beginPath(); g.moveTo(0, j * 9); g.lineTo(w, j * 9); g.stroke(); } g.fillStyle = 'rgba(220,171,64,.9)'; for (let i = 0; i < 8; i++) { g.fillRect(i * 32 + 12, 20, 8, 8); } }));

/* ---- face ---- */
const FACE = { phiLen: 1.7, th0: PI / 2 - .75, thLen: 1.85 };
const FW = 512, FH = Math.round(512 * FACE.thLen / FACE.phiLen);
const fx = a => (a + FACE.phiLen / 2) / FACE.phiLen * FW, fy = o => (o + .75) / FACE.thLen * FH, fs = FW / FACE.phiLen;
function paintFace(g, o) {
  g.clearRect(0, 0, FW, FH); const skin = o.skin, dk = mixHex(skin, '#5a1a10', .4), lite = mixHex(skin, '#fff2e0', .35);
  if (o.oval) { g.save(); g.beginPath(); g.ellipse(fx(0), fy(.2), .56 * fs, .72 * fs, 0, 0, TAU); g.fillStyle = skin; g.shadowColor = skin; g.shadowBlur = 6; g.fill(); g.restore(); g.save(); g.beginPath(); g.ellipse(fx(0), fy(.2), .56 * fs, .72 * fs, 0, 0, TAU); g.clip(); const sh = g.createRadialGradient(fx(0), fy(.22), .3 * fs, fx(0), fy(.22), .76 * fs); sh.addColorStop(0, 'rgba(120,40,20,0)'); sh.addColorStop(1, 'rgba(90,30,20,.5)'); g.fillStyle = sh; g.fillRect(0, 0, FW, FH); const hl = g.createRadialGradient(fx(-.1), fy(-.12), 5, fx(-.1), fy(-.12), .35 * fs); hl.addColorStop(0, 'rgba(255,240,225,.28)'); hl.addColorStop(1, 'rgba(255,240,225,0)'); g.fillStyle = hl; g.fillRect(0, 0, FW, FH); g.restore(); }
  /* cheeks */ [-1, 1].forEach(s => { const bx = fx(s * .43), by = fy(.34), r = g.createRadialGradient(bx, by, 0, bx, by, .22 * fs); r.addColorStop(0, 'rgba(240,90,95,.42)'); r.addColorStop(1, 'rgba(240,90,95,0)'); g.fillStyle = r; g.fillRect(bx - .25 * fs, by - .25 * fs, .5 * fs, .5 * fs); });
  /* eye sockets AO */ [-1, 1].forEach(s => { const ex = fx(s * .4), ey = fy(.02), r = g.createRadialGradient(ex, ey - 4, 4, ex, ey, .27 * fs); r.addColorStop(0, 'rgba(110,50,30,0)'); r.addColorStop(.6, 'rgba(110,50,30,.18)'); r.addColorStop(1, 'rgba(110,50,30,0)'); g.fillStyle = r; g.fillRect(ex - .3 * fs, ey - .3 * fs, .6 * fs, .6 * fs); });
  /* eyes */ [-1, 1].forEach(s => {
    const ex = fx(s * .4), ey = fy(.02), rx = .2 * fs, ry = o.blink ? 0 : .175 * fs;
    if (!o.blink) {
      g.save(); g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, TAU); g.clip();
      g.fillStyle = '#fbf3ea'; g.fillRect(ex - rx, ey - ry, rx * 2, ry * 2);
      const ix = ex + s * -2 + (o.gaze || 0) * 10, iy = ey + 4, ir = .152 * fs;
      const ig = g.createRadialGradient(ix - 4, iy - 8, 3, ix, iy, ir); ig.addColorStop(0, '#d79a5a'); ig.addColorStop(.45, '#8c4f25'); ig.addColorStop(.85, '#3c1c0f'); ig.addColorStop(1, '#1b0a05'); g.fillStyle = ig; g.beginPath(); g.arc(ix, iy, ir, 0, TAU); g.fill();
      g.fillStyle = '#0a0403'; g.beginPath(); g.arc(ix, iy, ir * .45, 0, TAU); g.fill();
      const lg = g.createLinearGradient(0, ey - ry, 0, ey - ry * .2); lg.addColorStop(0, 'rgba(60,25,18,.65)'); lg.addColorStop(1, 'rgba(60,25,18,0)'); g.fillStyle = lg; g.fillRect(ex - rx, ey - ry, rx * 2, ry * .8);
      g.fillStyle = 'rgba(255,255,255,.98)'; g.beginPath(); g.ellipse(ix - ir * .38, iy - ir * .4, ir * .26, ir * .3, -.4, 0, TAU); g.fill(); g.beginPath(); g.arc(ix + ir * .4, iy + ir * .42, ir * .11, 0, TAU); g.fill();
      g.restore();
      g.strokeStyle = '#33160d'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, PI * 1.07, PI * 1.93); g.stroke();
      g.lineWidth = 3.5; for (let i = 0; i < 4; i++) { const a = PI * (1.85 + i * .045) * (s > 0 ? 1 : 1); const px = ex + Math.cos(s > 0 ? a : PI - a + PI) * rx, py = ey + Math.sin(a) * ry; g.beginPath(); g.moveTo(px, py); g.lineTo(px + s * (8 + i * 2), py - 7); g.stroke(); }
      g.strokeStyle = 'rgba(70,30,20,.4)'; g.lineWidth = 2; g.beginPath(); g.ellipse(ex, ey - 6, rx * .9, ry * 1.08, 0, PI * 1.15, PI * 1.85); g.stroke();
      g.strokeStyle = 'rgba(255,230,210,.5)'; g.lineWidth = 2; g.beginPath(); g.ellipse(ex, ey, rx * .95, ry * .95, 0, .25, PI - .25); g.stroke();
    } else { g.strokeStyle = '#33160d'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex - rx * .92, ey); g.quadraticCurveTo(ex, ey + 14, ex + rx * .92, ey); g.stroke(); }
  });
  /* brows */ [-1, 1].forEach(s => { const bx = fx(s * .42), by = fy(-.27); g.strokeStyle = o.brow || '#3a1d12'; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { g.lineWidth = 9 - k * 2.5; g.globalAlpha = .55 + k * .15; g.beginPath(); g.moveTo(bx - s * .2 * fs, by + 8 - k); g.quadraticCurveTo(bx, by - 6 - k, bx + s * .17 * fs, by + 6 + k * 2); g.stroke(); } g.globalAlpha = 1; });
  /* nose */ { const nx = fx(0), ny = fy(.3); const r = g.createRadialGradient(nx, ny + 4, 2, nx, ny, .1 * fs); r.addColorStop(0, 'rgba(255,225,205,.55)'); r.addColorStop(1, 'rgba(255,225,205,0)'); g.fillStyle = r; g.fillRect(nx - .12 * fs, ny - .12 * fs, .24 * fs, .24 * fs); g.fillStyle = 'rgba(110,45,30,.5)'; [-1, 1].forEach(s => { g.beginPath(); g.ellipse(nx + s * 9, ny + 11, 5, 3.2, 0, 0, TAU); g.fill(); }); g.strokeStyle = 'rgba(120,50,35,.3)'; g.lineWidth = 3; g.beginPath(); g.arc(nx, ny + 6, 17, .25, PI - .25); g.stroke(); }
  /* mouth */ { const mx = fx(0), my = fy(.57), w = .17 * fs; const gr = g.createLinearGradient(0, my - 8, 0, my + 18); gr.addColorStop(0, '#c4575a'); gr.addColorStop(1, '#a8444b'); if (o.open) { g.fillStyle = '#5a1a20'; g.beginPath(); g.moveTo(mx - w, my - 4); g.quadraticCurveTo(mx, my + 52, mx + w, my - 4); g.quadraticCurveTo(mx, my + 4, mx - w, my - 4); g.fill(); g.fillStyle = '#fbeee6'; g.beginPath(); g.moveTo(mx - w * .8, my - 3); g.quadraticCurveTo(mx, my + 7, mx + w * .8, my - 3); g.lineTo(mx + w * .7, my + 6); g.quadraticCurveTo(mx, my + 14, mx - w * .7, my + 6); g.fill(); } else { g.fillStyle = gr; g.beginPath(); g.moveTo(mx - w, my - 3); g.quadraticCurveTo(mx, my + 4, mx + w, my - 3); g.quadraticCurveTo(mx + w * .5, my + 22, mx, my + 22); g.quadraticCurveTo(mx - w * .5, my + 22, mx - w, my - 3); g.fill(); g.strokeStyle = '#7a2c34'; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - w * 1.05, my - 7); g.quadraticCurveTo(mx - w * .98, my - 1, mx - w, my - 3); g.quadraticCurveTo(mx, my + 7, mx + w, my - 3); g.quadraticCurveTo(mx + w * .98, my - 1, mx + w * 1.05, my - 7); g.stroke(); g.fillStyle = 'rgba(255,200,190,.5)'; g.beginPath(); g.ellipse(mx, my + 12, w * .3, 3.4, 0, 0, TAU); g.fill(); } }
}
const faceCache = {};
function faceTex(o) { const k = [o.skin, o.oval ? 1 : 0, o.blink ? 1 : 0, o.open ? 1 : 0, o.gaze || 0].join('|'); return faceCache[k] || (faceCache[k] = ctex(FW, FH, g => paintFace(g, o))); }

/* ================= geometry helpers ================= */
function deform(x, y, z, rx, ry, rz) { let s = 1; if (y < 0) { const q = -y; s = 1 - .24 * q * q * (.55 + .45 * q); } const cheek = 1 + .05 * Math.exp(-Math.pow((y + .25) / .3, 2)); return [x * s * rx * cheek, y * ry, z * s * rz * (y < -.2 ? 1 - .06 * (-y - .2) : 1)]; }
function headGeo(rx, ry, rz, k, part) {
  const g = part ? new T.SphereGeometry(1, 40, 40, PI / 2 - FACE.phiLen / 2, FACE.phiLen, FACE.th0, FACE.thLen) : new T.SphereGeometry(1, 56, 42); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const d = deform(p.getX(i), p.getY(i), p.getZ(i), rx, ry, rz); p.setXYZ(i, d[0] * k, d[1] * k, d[2] * k); }
  g.computeVertexNormals(); return g;
}
function surf(phi, theta, rx, ry, rz, k) { const x = -Math.cos(phi) * Math.sin(theta), y = Math.cos(theta), z = Math.sin(phi) * Math.sin(theta); const d = deform(x, y, z, rx, ry, rz); return new T.Vector3(d[0] * k, d[1] * k, d[2] * k); }
function foldLathe(prof, seg, folds, amp, seed, hMax) {
  const g = new T.LatheGeometry(prof.map(p => new T.Vector2(p[0], p[1])), seg), pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), k = amp * (1 - clamp(y / hMax, 0, 1)); const f = Math.sin(a * folds + seed) * .55 + Math.sin(a * (folds * 2 + 1) + seed * 2) * .3 + Math.sin(a * 3 + seed) * .15; const s = 1 + k * f; pos.setXYZ(i, x * s, y, z * s); }
  g.computeVertexNormals(); return g;
}
const cloth = (c, o) => { const m = new T.MeshPhysicalMaterial(Object.assign({ color: c, roughness: .88, metalness: 0, sheen: .7, sheenRoughness: .55, sheenColor: C(mixHex(c, '#ffffff', .5)), bumpMap: TX.fabric(), bumpScale: .8 }, o || {})); m.bumpMap.repeat.set(5, 5); return m; };
const skinMat = c => new T.MeshPhysicalMaterial({ color: c, roughness: .52, metalness: 0, sheen: .6, sheenRoughness: .4, sheenColor: C('#ff9a78'), emissive: C(mixHex(c, '#b04a20', .6)), emissiveIntensity: .1 });

/* ================= kid ================= */
const HEAD = [.165, .175, .16];
function makeHand(skin, side) {
  const h = new T.Group(); const palm = ell(.03, .034, .015, skin, 12); h.add(palm);
  for (let i = 0; i < 4; i++) { const f = cap(.0085, .028 - Math.abs(i - 1.5) * .004, skin, 6); f.position.set((i - 1.5) * .0125, -.04, 0); h.add(f); }
  const th = cap(.0095, .02, skin, 6); th.position.set(-side * .03, -.01, .004); th.rotation.z = side * .7; h.add(th); h.userData.fingers = h.children.slice(1, 5); return h;
}
function makeKid(o) {
  const girl = (o.kind || 'girl') === 'girl', sit = o.pose === 'read' || o.pose === 'dua' || o.pose === 'sit' || o.pose === 'sujood';
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const skinC = o.skin || '#e9b48a', skin = skinMat(skinC), robeC = o.robe || '#f4eadb', robe = cloth(robeC), hijC = o.hij || '#8e2440', hijab = cloth(hijC, { sheenColor: C(mixHex(hijC, '#ffffff', .55)) });
  const P = {}, upper = new T.Group(); root.add(upper); const dropY = sit ? -.33 : 0; upper.position.y = dropY; P.upper = upper;
  /* lower body */
  if (sit) {
    const prof = [[0, 0], [.3, .0], [.34, .06], [.3, .16], [.22, .26], [.14, .34], [0, .36]];
    const mound = mesh(foldLathe(prof, 48, 7, .12, o.seed || 0, .36), robe); mound.scale.z = .9; root.add(mound);
    [-1, 1].forEach(s => { const kn = ell(.1, .075, .12, robe, 14); kn.position.set(s * .2, .1, .24); root.add(kn); const ft = ell(.05, .03, .075, skin, 10); ft.position.set(s * .08, .035, .33); root.add(ft); });
  } else {
    const prof = [[0, .0], [.22, .0], [.235, .03], [.21, .18], [.17, .34], [.14, .5], [.12, .58], [0, .6]];
    const sk = mesh(foldLathe(prof, 56, 9, .14, o.seed || 0, .6), robe); sk.scale.z = .78; root.add(sk);
    const hemC = mesh(new T.TorusGeometry(.228, .008, 8, 56), new T.MeshStandardMaterial({ color: C('#d9a93e'), metalness: .6, roughness: .35 })); hemC.rotation.x = PI / 2; hemC.position.y = .034; hemC.scale.set(1, .78, 1); root.add(hemC);
    P.legs = [-1, 1].map(s => { const sh = ell(.055, .03, .09, new T.MeshStandardMaterial({ color: C(girl ? '#5a3040' : '#7a5a3a'), roughness: .6 }), 12); sh.position.set(s * .075, .03, .05); root.add(sh); return sh; });
  }
  /* torso */
  const tp = [[0, .48], [.125, .5], [.135, .6], [.145, .7], [.135, .79], [.1, .85], [.055, .88], [0, .89]];
  const torso = mesh(foldLathe(tp, 40, 5, .02, 2, 1), robe); torso.scale.z = .72; upper.add(torso); P.torso = torso;
  [-1, 1].forEach(s => { const sh = ell(.052, .05, .05, robe, 12); sh.position.set(s * .14, .79, 0); upper.add(sh); });
  const neck = cap(.04, .06, skin, 10); neck.position.y = .9; upper.add(neck);
  /* arms */
  const arm = s => { const sh = new T.Group(); sh.position.set(s * .15, .79, 0); const up = cap(.036, .12, robe, 10); up.position.y = -.1; sh.add(up); const el = new T.Group(); el.position.y = -.2; sh.add(el); const joint = ell(.04, .04, .04, robe, 10); el.add(joint); const lo = cap(.034, .11, robe, 10); lo.position.y = -.1; el.add(lo); const cuff = mesh(new T.CylinderGeometry(.037, .04, .025, 12), robe); cuff.position.y = -.19; el.add(cuff); const wr = new T.Group(); wr.position.y = -.2; el.add(wr); const hand = makeHand(skin, s); hand.position.y = -.035; wr.add(hand); upper.add(sh); return { sh, el, wr, hand, s }; };
  P.aL = arm(-1); P.aR = arm(1);
  /* head */
  const head = new T.Group(); head.position.set(0, 1.03, .0); upper.add(head); P.head = head;
  const hd = mesh(headGeo(HEAD[0], HEAD[1], HEAD[2], 1), skin); head.add(hd);
  [-1, 1].forEach(s => { const e = ell(.026, .04, .018, skin, 10); e.position.set(s * HEAD[0] * .97, -.01, -.005); e.rotation.z = s * -.2; head.add(e); });
  const mk = (blink, open) => { const m = new T.MeshStandardMaterial({ map: faceTex({ skin: skinC, oval: girl, blink, open, gaze: o.gaze || 0 }), transparent: true, roughness: .55, metalness: 0, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, depthWrite: false }); m.emissive = C('#ffffff'); m.emissiveMap = m.map; m.emissiveIntensity = .22; return m; };
  P.faceOpen = mk(false, false); P.faceBlink = mk(true, false); P.faceTalk = mk(false, true);
  const face = mesh(headGeo(HEAD[0], HEAD[1], HEAD[2], girl ? 1.11 : 1.006, true), P.faceOpen, { cast: false }); head.add(face); P.face = face; if (girl) face.position.z = .0;
  if (girl) {
    const hj = mesh(headGeo(HEAD[0], HEAD[1], HEAD[2], 1.1), hijab); hj.scale.set(1.04, 1.02, 1.06); hj.position.set(0, .004, -.012); head.add(hj);
    const pts = []; for (let i = 0; i < 48; i++) { const t = i / 48 * TAU; pts.push(surf(PI / 2 + .565 * Math.sin(t), PI / 2 + .2 - .725 * Math.cos(t), HEAD[0], HEAD[1], HEAD[2], 1.117)); }
    const ring = mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts, true), 96, .012, 8, true), hijab); head.add(ring);
    const dp = [[.125, .0], [.15, -.03], [.21, -.075], [.285, -.14], [.315, -.25], [.32, -.4], [.33, -.55], [.34, -.7]];
    const geo = new T.LatheGeometry(dp.map(p => new T.Vector2(p[0], p[1])), 64), pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), k = .16 * sstep(-.1, -.5, y); const f = Math.sin(a * 5 + 1) * .5 + Math.sin(a * 9 + 2) * .35 + Math.sin(a * 3) * .15; const s = 1 + k * f; pos.setXYZ(i, x * s, y, z * s * .8); } geo.computeVertexNormals();
    const drape = mesh(geo, hijab); drape.position.set(0, -.1, -.03); head.add(drape); P.drape = drape; drape.material.side = T.DoubleSide;
    
  } else {
    const hair = mesh(headGeo(HEAD[0], HEAD[1], HEAD[2], 1.045), new T.MeshStandardMaterial({ color: C(o.hair || '#1e1016'), roughness: .5 })); hair.scale.set(1, 1, 1); hair.position.set(0, .012, -.012); head.add(hair);
    const fr = new T.Mesh(new T.SphereGeometry(1, 28, 14, PI / 2 - 1.0, 2.0, 0, .62), new T.MeshStandardMaterial({ color: C(o.hair || '#1e1016'), roughness: .5, side: T.DoubleSide })); fr.scale.set(HEAD[0] * 1.06, HEAD[1] * 1.07, HEAD[2] * 1.06); fr.position.y = .0; fr.castShadow = true; head.add(fr);
    const cp = mesh(new T.SphereGeometry(1, 40, 20, 0, TAU, 0, 1.05), new T.MeshStandardMaterial({ map: TX.cap(), roughness: .9, bumpMap: TX.fabric(), bumpScale: 1 })); cp.scale.set(HEAD[0] * 1.09, HEAD[1] * 1.1, HEAD[2] * 1.1); cp.position.set(0, .018, -.01); cp.rotation.x = -.18; head.add(cp);
    const col = mesh(new T.TorusGeometry(.078, .014, 8, 24), cloth('#efe7dc')); col.rotation.x = PI / 2; col.position.y = .875; upper.add(col);
  }
  g.userData = { parts: P, pose: o.pose || 'stand', seed: o.seed || 0, sit, look: o.look || '', girl, book: null };
  return g;
}
const POSES = {
  stand: { L: [.05, .12, -.15, 0], Rr: [.05, -.12, -.15, 0] }, walk: { L: [0, .1, -.1, 0], Rr: [0, -.1, -.1, 0] }, wave: { L: [.05, .12, -.15, 0], Rr: [0, -1.55, -.5, 0] },
  read: { L: [-.62, .08, -1.25, .0], Rr: [-.62, -.08, -1.25, 0] }, dua: { L: [-.78, .16, -1.4, 1.15], Rr: [-.78, -.16, -1.4, 1.15] }, fold: { L: [-.6, -.1, -1.55, 0], Rr: [-.6, .1, -1.55, 0] }, sit: { L: [-.3, .15, -.7, 0], Rr: [-.3, -.15, -.7, 0] },
  point: { L: [.05, .12, -.15, 0], Rr: [-1.3, -.1, -.3, 0] }, hold: { L: [-.5, .1, -1.0, 0], Rr: [-.5, -.1, -1.0, 0] }
};
function animKid(g, t) {
  const u = g.userData, p = u.parts, ph = u.seed, P = POSES[u.pose] || POSES.stand, walk = u.pose === 'walk', sw = walk ? Math.sin(t * 5.2 + ph) : 0;
  p.upper.scale.y = 1 + Math.sin(t * 1.9 + ph) * .008; p.upper.position.y = (u.sit ? -.33 : 0) + (walk ? Math.abs(Math.sin(t * 5.2 + ph)) * .02 : 0);
  if (walk && p.legs) { p.legs[0].position.z = .05 + sw * .09; p.legs[1].position.z = .05 - sw * .09; }
  const set = (a, v, add) => { a.sh.rotation.set(v[0] + add, 0, v[1]); a.el.rotation.x = v[2]; a.wr.rotation.x = v[3] * (a.s); a.wr.rotation.x = v[3]; };
  set(p.aL, P.L, walk ? sw * .55 : Math.sin(t * 1.3 + ph) * .02); set(p.aR, P.Rr, walk ? -sw * .55 : Math.sin(t * 1.3 + ph + 1) * .02);
  if (u.pose === 'wave') p.aR.sh.rotation.z = -1.55 + Math.sin(t * 7) * .22;
  if (u.pose === 'dua') { const up = Math.sin(t * 1.2 + ph) * .03; p.aL.sh.rotation.x += up; p.aR.sh.rotation.x += up; p.aL.wr.rotation.z = -.08; p.aR.wr.rotation.z = .08; }
  p.head.rotation.set(Math.sin(t * .7 + ph) * .02 + (u.look === 'up' ? -.14 : u.look === 'down' ? .22 : 0), Math.sin(t * .5 + ph) * .06 + (u.look === 'side' ? .3 : u.look === 'sideR' ? -.3 : 0), Math.sin(t * .8 + ph) * .02);
  const bl = (t * .27 + ph * .17) % 1 > .965; const want = bl ? p.faceBlink : (u.talk && Math.sin(t * 9) > .3 ? p.faceTalk : p.faceOpen); if (p.face.material !== want) p.face.material = want;
}

/* ================= props ================= */
function tubeAlong(pts, r, m, seg) { return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), seg || 24, r, 6, false), m); }
function lantern(col, scale) {
  const g = new T.Group(), dark = new T.MeshStandardMaterial({ color: C('#3b2230'), roughness: .5, metalness: .3 }), gold = new T.MeshStandardMaterial({ color: C('#dcab40'), metalness: .75, roughness: .3 });
  const glass = new T.MeshStandardMaterial({ color: C(col), emissive: C(col), emissiveIntensity: 2.4, roughness: .35, transparent: true, opacity: .96 });
  const base = mesh(new T.CylinderGeometry(.075, .09, .04, 20), dark); base.position.y = .02; g.add(base);
  const gl = mesh(new T.LatheGeometry([[0, 0], [.085, 0], [.115, .1], [.12, .2], [.095, .28], [0, .28]].map(p => new T.Vector2(p[0], p[1])), 28), glass, { cast: false }); gl.position.y = .04; g.add(gl);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6; const bar = mesh(new T.CylinderGeometry(.006, .006, .27, 5), gold); bar.position.set(Math.cos(a) * .11, .17, Math.sin(a) * .11); bar.rotation.z = Math.cos(a) * -.1; bar.rotation.x = Math.sin(a) * .1; g.add(bar); }
  const top = mesh(new T.ConeGeometry(.13, .1, 20), gold); top.position.y = .37; g.add(top); const bulb = ell(.03, .03, .03, gold, 10); bulb.position.y = .43; g.add(bulb); const ring = mesh(new T.TorusGeometry(.04, .007, 8, 16), gold); ring.position.y = .49; g.add(ring);
  const pl = new T.PointLight(C(col), 2.2, 4, 1.7); pl.position.y = .22; g.add(pl); g.userData.light = pl;
  const gs = new T.Sprite(new T.SpriteMaterial({ map: TX.glow(), color: C(col), blending: T.AdditiveBlending, depthWrite: false, opacity: .8, fog: false })); gs.scale.set(.9, .9, 1); gs.position.y = .2; L1(gs); g.add(gs); g.userData.gs = gs;
  g.scale.setScalar(scale || 1); return g;
}
function archTex(wall, glow, cols, rows) { return ctex(512, 256, (g, w, h) => { g.fillStyle = wall; g.fillRect(0, 0, w, h); const r = R(4); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(80,50,40,${r() * .07})`; g.fillRect(r() * w, r() * h, 3, 2); } const cw = w / cols; for (let c = 0; c < cols; c++) { const x = c * cw + cw / 2, ww = cw * .34, top = 40, bot = 200; g.fillStyle = glow; g.beginPath(); g.moveTo(x - ww, bot); g.lineTo(x - ww, top + ww); g.quadraticCurveTo(x - ww, top - 8, x, top - 24); g.quadraticCurveTo(x + ww, top - 8, x + ww, top + ww); g.lineTo(x + ww, bot); g.closePath(); g.fill(); g.strokeStyle = 'rgba(120,70,50,.6)'; g.lineWidth = 5; g.stroke(); g.fillStyle = 'rgba(90,50,40,.5)'; g.fillRect(x - 1.5, top, 3, bot - top); } g.fillStyle = 'rgba(200,150,70,.7)'; g.fillRect(0, 12, w, 5); g.fillRect(0, h - 18, w, 5); }); }
function mosque(wall, dome, glowC, big) {
  const g = new T.Group(), w = new T.MeshStandardMaterial({ color: C(wall), roughness: .9 }), d = new T.MeshStandardMaterial({ color: C(dome), roughness: .4, metalness: .15 }), gold = new T.MeshStandardMaterial({ color: C('#e0b550'), metalness: .8, roughness: .28 });
  const front = new T.MeshStandardMaterial({ map: archTex(wall, glowC, 5, 1), roughness: .9, emissive: C('#ffffff'), emissiveIntensity: .5 }); front.emissiveMap = front.map;
  const mats = [w, w, w, w, front, w];
  const base = mesh(new T.BoxGeometry(3.2, 1.2, 1.8), mats); base.position.y = .6; g.add(base);
  const dp = [[0, 0], [1.0, 0], [1.08, .18], [1.0, .45], [.78, .78], [.45, 1.04], [.2, 1.2], [0, 1.26]];
  const dm = mesh(new T.LatheGeometry(dp.map(p => new T.Vector2(p[0], p[1])), 40), d); dm.position.y = 1.2; g.add(dm);
  const dr = mesh(new T.CylinderGeometry(.82, .95, .28, 32), w); dr.position.y = 1.3; g.add(dr);
  const sp = mesh(new T.CylinderGeometry(.015, .03, .5, 8), gold); sp.position.y = 2.7; g.add(sp); const cr = mesh(new T.TorusGeometry(.09, .018, 8, 20, 4.7), gold); cr.position.y = 3.0; cr.rotation.z = -.4; g.add(cr);
  [[-2.0, 3.0], [2.0, 3.0], [-1.45, 1.8], [1.45, 1.8]].forEach(([x, hh], i) => { const mn = mesh(new T.CylinderGeometry(.1 * (hh / 3) + .04, .15 * (hh / 3) + .04, hh, 18), w); mn.position.set(x, hh / 2, i > 1 ? -.35 : 0); g.add(mn); const bal = mesh(new T.CylinderGeometry(.19 * (hh / 3) + .04, .19 * (hh / 3) + .04, .07, 18), gold); bal.position.set(x, hh * .78, i > 1 ? -.35 : 0); g.add(bal); const tip = mesh(new T.ConeGeometry(.17 * (hh / 3) + .03, .55 * (hh / 3), 18), d); tip.position.set(x, hh + .26 * (hh / 3), i > 1 ? -.35 : 0); g.add(tip); const fn = mesh(new T.CylinderGeometry(.01, .01, .3, 5), gold); fn.position.set(x, hh + .62 * (hh / 3), i > 1 ? -.35 : 0); g.add(fn); });
  [-1.25, 1.25].forEach(x => { const sd = ell(.5, .4, .5, d, 20); sd.scale.y = .55; sd.position.set(x, 1.2, .35); g.add(sd); });
  return g;
}
function bokehField(n, colors, area, seed, size) {
  const r = R(seed || 1), g = new T.Group(); for (let i = 0; i < n; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: TX.bokeh(), color: C(colors[(r() * colors.length) | 0]), blending: T.AdditiveBlending, depthWrite: false, opacity: .1 + r() * .22, fog: false })); const sz = (size || .4) * (.5 + r() * 1.4); s.scale.set(sz, sz, 1); s.position.set((r() - .5) * area[0], r() * area[1], area[2] + r() * area[3]); s.userData.b = [s.position.x, s.position.y, r() * 9]; L1(s); g.add(s); }
  g.userData.upd = t => g.children.forEach(s => { const b = s.userData.b; s.position.y = b[1] + Math.sin(t * .4 + b[2]) * .08; s.position.x = b[0] + Math.sin(t * .25 + b[2] * 2) * .06; }); return g;
}
function sparkle(n, col, area, seed, size) {
  const r = R(seed || 3), geo = new T.BufferGeometry(), pos = new Float32Array(n * 3), base = []; for (let i = 0; i < n; i++) { const p = [(r() - .5) * area[0], r() * area[1], (r() - .5) * area[2] + area[3]]; base.push(p, r()); pos.set(p, i * 3); }
  geo.setAttribute('position', new T.BufferAttribute(pos, 3)); const m = new T.PointsMaterial({ map: TX.star(), color: C(col), size: size || .13, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: .85 });
  const pts = new T.Points(geo, m); L1(pts); pts.frustumCulled = false; pts.userData.upd = t => { const a = geo.attributes.position; for (let i = 0; i < n; i++) { const b = base[i * 2], ph = base[i * 2 + 1], k = (t * .07 + ph) % 1; a.setXYZ(i, b[0] + Math.sin(t * .5 + ph * 9) * .2, b[1] + k * .8 - .2, b[2] + Math.cos(t * .4 + ph * 7) * .15); } a.needsUpdate = true; }; return pts;
}
function butterfly(col, seed) {
  const g = new T.Group(), m = new T.MeshStandardMaterial({ color: C(col), emissive: C(col), emissiveIntensity: .35, side: T.DoubleSide, roughness: .6 });
  const shape = new T.Shape(); shape.moveTo(0, 0); shape.bezierCurveTo(.05, .09, .14, .1, .12, .03); shape.bezierCurveTo(.12, -.04, .05, -.08, 0, 0);
  const w1 = new T.Group(), w2 = new T.Group(); const a = mesh(new T.ShapeGeometry(shape), m, { cast: false }), b = mesh(new T.ShapeGeometry(shape), m, { cast: false }); b.scale.x = -1; w1.add(a); w2.add(b); g.add(w1, w2); g.userData = { w1, w2, seed };
  const bd = cap(.006, .05, new T.MeshStandardMaterial({ color: C('#2a1a30') }), 5); bd.rotation.x = PI / 2; g.add(bd); g.scale.setScalar(1.2); return g;
}
function flutterB(b, t) { const u = b.userData, f = Math.sin(t * 18 + u.seed) * .9; u.w1.rotation.y = f; u.w2.rotation.y = -f; }
function cloudSprite(x, y, z, s, tint, op) { const m = new T.Sprite(new T.SpriteMaterial({ map: TX.cloud(), color: C(tint || '#ffffff'), transparent: true, opacity: op == null ? .9 : op, depthWrite: false, fog: false })); m.position.set(x, y, z); m.scale.set(s * 2, s, 1); L1(m); return m; }
function terrain(w, d, segW, segD, hfn, c0, c1, y0, noise) {
  const geo = new T.PlaneGeometry(w, d, segW, segD); geo.rotateX(-PI / 2); const p = geo.attributes.position, col = new Float32Array(p.count * 3), a = C(c0), b = C(c1), tmp = new T.Color(), rn = R(13);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), h = hfn(x, z); p.setY(i, h); const k = clamp(.5 + h / 5 + (Math.sin(x * 1.3) * Math.sin(z * 1.1) * .15) + (rn() - .5) * (noise == null ? .1 : noise), 0, 1); tmp.copy(a).lerp(b, k); col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b; }
  geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals(); const m = mesh(geo, new T.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 1 }), { cast: false }); m.position.y = y0 || 0; return m;
}
function lavenderField(opt) {
  const r = R(11), N = opt.n, g = new T.Group();
  const stemG = new T.CylinderGeometry(.004, .008, .3, 4, 1); stemG.translate(0, .15, 0);
  const parts = []; for (let i = 0; i < 6; i++) { const s = new T.SphereGeometry(.017 - i * .0017, 6, 4); s.scale(1, 1.35, 1); s.translate(0, .2 + i * .03, 0); parts.push(s); }
  const merge = gs => { let pos = [], idx = [], off = 0; gs.forEach(gg => { const p = gg.attributes.position.array, ix = gg.index.array; for (let i = 0; i < p.length; i++) pos.push(p[i]); for (let i = 0; i < ix.length; i++) idx.push(ix[i] + off); off += p.length / 3; }); const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); mg.setIndex(idx); mg.computeVertexNormals(); return mg; };
  const bloomG = merge(parts);
  const stem = new T.InstancedMesh(stemG, new T.MeshStandardMaterial({ color: C('#5f8c48'), roughness: .9 }), N), bloom = new T.InstancedMesh(bloomG, new T.MeshStandardMaterial({ color: 0xffffff, roughness: .75, emissive: C('#4a2a80'), emissiveIntensity: .12 }), N), m = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), s = new T.Vector3();
  const cols = ['#8a5cc8', '#9d73d8', '#7448b0', '#b394e6', '#6a3fa6', '#a07ad8'];
  for (let i = 0; i < N; i++) {
    const z = opt.zNear - Math.pow(r(), 1.5) * opt.depth, x = (r() - .5) * (opt.width + (opt.zNear - z) * 1.5), y = opt.h(x, z), sc = (.7 + r() * .55) * (z < -4 ? 1.25 : 1) * (opt.scale || 1); if (z > 2.0 && r() > .3) continue;
    const clear = opt.clear && opt.clear(x, z); e.set((r() - .5) * .35, r() * TAU, (r() - .5) * .35); q.setFromEuler(e); v.set(x, y, z); s.set(sc, clear ? sc * .3 : sc * (.8 + r() * .7), sc); m.compose(v, q, s); stem.setMatrixAt(i, m); bloom.setMatrixAt(i, m); bloom.setColorAt(i, C(cols[(r() * 6) | 0]).multiplyScalar(.8 + r() * .35));
  }
  stem.castShadow = false; bloom.castShadow = true; stem.receiveShadow = true; bloom.receiveShadow = true; g.add(stem, bloom); return g;
}
function grass(n, area, hfn, c0, c1, seed) {
  const r = R(seed || 8), gg = new T.ConeGeometry(.006, .15, 3, 1); gg.translate(0, .075, 0); const im = new T.InstancedMesh(gg, new T.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }), n), m = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), s = new T.Vector3(), a = C(c0), b = C(c1);
  for (let i = 0; i < n; i++) { const x = (r() - .5) * area[0], z = area[2] - r() * area[1]; e.set((r() - .5) * .5, r() * TAU, (r() - .5) * .5); q.setFromEuler(e); v.set(x, hfn(x, z), z); const k = .6 + r() * 1.2; s.set(k, k * (.7 + r() * .9), k); m.compose(v, q, s); im.setMatrixAt(i, m); im.setColorAt(i, a.clone().lerp(b, r())); }
  im.castShadow = false; im.receiveShadow = true; return im;
}
function rehal(){
  const g = new T.Group(), wood = new T.MeshStandardMaterial({ color: C('#7a4a2a'), roughness: .5, metalness: .05 });
  [-1, 1].forEach(s => { const leg = mesh(new T.BoxGeometry(.024, .4, .018), wood); leg.position.set(s * .05, .19, 0); leg.rotation.set(0, 0, s * -.35); g.add(leg); });
  const bk = new T.Group(); const cov = new T.MeshStandardMaterial({ color: C('#7a1a2c'), roughness: .55 }), gold = new T.MeshStandardMaterial({ color: C('#dcab40'), metalness: .7, roughness: .3 });
  const spine = mesh(new T.BoxGeometry(.03, .26, .02), cov); bk.add(spine);
  [-1, 1].forEach(s => { const side = new T.Group(); const pg = mesh(new T.BoxGeometry(.17, .26, .012), new T.MeshStandardMaterial({ map: TX.page(), roughness: .8, emissive: C('#ffd890'), emissiveIntensity: .15 })); pg.position.x = s * .09; const cv = mesh(new T.BoxGeometry(.18, .27, .008), cov); cv.position.set(s * .09, 0, -.01); side.add(pg, cv); side.rotation.y = -s * .34; bk.add(side); });
  bk.position.set(0, .42, 0); bk.rotation.x = -.52; g.add(bk); return g;
}
function seatMat(a, b, w, d, rot) { const m = mesh(new T.BoxGeometry(w, .016, d), new T.MeshStandardMaterial({ map: TX.mat(a, b), roughness: .95 })); m.rotation.y = rot || 0; m.receiveShadow = true; m.castShadow = false; return m; }

/* ================= post-processing ================= */
const FS_VS = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }';
function mkPass(frag, uniforms) { return new T.ShaderMaterial({ vertexShader: FS_VS, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false }); }
const BLUR_F = 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vUv; void main(){ vec3 c=texture2D(tex,vUv).rgb*.2270270270; c+=texture2D(tex,vUv+dir*1.3846153846).rgb*.3162162162; c+=texture2D(tex,vUv-dir*1.3846153846).rgb*.3162162162; c+=texture2D(tex,vUv+dir*3.2307692308).rgb*.0702702703; c+=texture2D(tex,vUv-dir*3.2307692308).rgb*.0702702703; gl_FragColor=vec4(c,1.); }';
const THR_F = 'uniform sampler2D tex; uniform float thr; varying vec2 vUv; void main(){ vec3 c=texture2D(tex,vUv).rgb; float l=max(c.r,max(c.g,c.b)); float k=smoothstep(thr,thr+1.2,l); gl_FragColor=vec4(c*k,1.); }';
const COPY_F = 'uniform sampler2D tex; varying vec2 vUv; void main(){ gl_FragColor=vec4(texture2D(tex,vUv).rgb,1.); }';
const COMP_F = `#include <packing>
uniform sampler2D tScene,tB1,tB2,tB3,tBlur,tDepth; uniform float time,bloomK,focus,fRange,maxCoc,near,far,exposure,vig,grain,dofOn; uniform vec3 lift,gain; varying vec2 vUv;
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
float rnd(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec3 c=texture2D(tScene,vUv).rgb;
  if(dofOn>.5){ float dp=unpackRGBAToDepth(texture2D(tDepth,vUv)); float vz=-perspectiveDepthToViewZ(dp,near,far); if(dp>.9999) vz=far; float coc=clamp((abs(vz-focus)-fRange)/(focus*2.2),0.,1.)*maxCoc; if(vz>focus) coc*=.4; c=mix(c,texture2D(tBlur,vUv).rgb,coc); }
  vec3 b=texture2D(tB1,vUv).rgb*.5+texture2D(tB2,vUv).rgb*.35+texture2D(tB3,vUv).rgb*.5; c+=b*bloomK;
  c*=exposure; c=aces(c);
  float l=dot(c,vec3(.299,.587,.114)); c=mix(c*gain+lift*(1.-l),c,.0)+lift*(1.-l)*.0; c=c*gain+lift*(1.-smoothstep(0.,.6,l));
  vec2 d=vUv-.5; float v=1.-dot(d,d)*vig; c*=clamp(v,0.,1.);
  c+= (rnd(vUv*vec2(1733.,1291.)+time)-.5)*grain;
  c=pow(max(c,0.),vec3(1./2.2)); gl_FragColor=vec4(c,1.); }`;
function makePost(renderer, scene, camera, W, H, o) {
  const hasHalf = renderer.capabilities.isWebGL2 && (renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float'));
  const type = hasHalf ? T.HalfFloatType : T.UnsignedByteType, lin = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, type, format: T.RGBAFormat, depthBuffer: false };
  const rtS = new T.WebGLRenderTarget(W, H, Object.assign({}, lin, { depthBuffer: true, samples: o.msaa === false ? 0 : 4 }));
  const rtD = o.dof ? new T.WebGLRenderTarget(W >> 1, H >> 1, { minFilter: T.NearestFilter, magFilter: T.NearestFilter, type: T.UnsignedByteType, format: T.RGBAFormat, depthBuffer: true }) : null;
  const sz = [[W >> 1, H >> 1], [W >> 2, H >> 2], [W >> 3, H >> 3]];
  const mk = (w, h) => new T.WebGLRenderTarget(Math.max(2, w), Math.max(2, h), lin), chain = sz.map(([w, h]) => ({ a: mk(w, h), b: mk(w, h), w, h }));
  const dofA = o.dof ? mk(W >> 2, H >> 2) : null, dofB = o.dof ? mk(W >> 2, H >> 2) : null;
  const geo = new T.PlaneGeometry(2, 2), thrM = mkPass(THR_F, { tex: { value: null }, thr: { value: o.thr == null ? .85 : o.thr } }), copyM = mkPass(COPY_F, { tex: { value: null } }), blurM = mkPass(BLUR_F, { tex: { value: null }, dir: { value: new T.Vector2() } });
  const compM = mkPass(COMP_F, { tScene: { value: rtS.texture }, tB1: { value: chain[0].a.texture }, tB2: { value: chain[1].a.texture }, tB3: { value: chain[2].a.texture }, tBlur: { value: dofA ? dofA.texture : null }, tDepth: { value: rtD ? rtD.texture : null }, time: { value: 0 }, bloomK: { value: o.bloom == null ? .55 : o.bloom }, focus: { value: 6 }, fRange: { value: 2.5 }, maxCoc: { value: .9 }, near: { value: camera.near }, far: { value: camera.far }, exposure: { value: o.exposure || 1 }, vig: { value: 1.1 }, grain: { value: .035 }, dofOn: { value: o.dof ? 1 : 0 }, lift: { value: new T.Vector3(.012, .004, .02) }, gain: { value: new T.Vector3(1.03, 1.0, .97) } });
  const quad = new T.Mesh(geo, copyM); quad.frustumCulled = false; const ps = new T.Scene(), pc = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1); ps.add(quad);
  const pass = (mat, rt) => { quad.material = mat; renderer.setRenderTarget(rt); renderer.render(ps, pc); };
  const blur = (src, tmp, w, h, k) => { blurM.uniforms.tex.value = src.texture; blurM.uniforms.dir.value.set(k / w, 0); pass(blurM, tmp); blurM.uniforms.tex.value = tmp.texture; blurM.uniforms.dir.value.set(0, k / h); pass(blurM, src); };
  const depthMat = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking });
  return {
    resize(w, h) { rtS.setSize(w, h); if (rtD) rtD.setSize(w >> 1, h >> 1); const s = [[w >> 1, h >> 1], [w >> 2, h >> 2], [w >> 3, h >> 3]]; chain.forEach((c, i) => { c.w = Math.max(2, s[i][0]); c.h = Math.max(2, s[i][1]); c.a.setSize(c.w, c.h); c.b.setSize(c.w, c.h); }); if (dofA) { dofA.setSize(w >> 2, h >> 2); dofB.setSize(w >> 2, h >> 2); } },
    render(t, focus) {
      renderer.setRenderTarget(rtS); renderer.clear(); renderer.render(scene, camera);
      if (rtD) { camera.layers.set(0); scene.overrideMaterial = depthMat; const bg = scene.background; scene.background = null; renderer.setClearColor(0xffffff, 1); renderer.setRenderTarget(rtD); renderer.clear(); renderer.render(scene, camera); scene.overrideMaterial = null; scene.background = bg; camera.layers.enable(1); renderer.setClearColor(0x000000, 1); pass(copyM.clone && (copyM.uniforms.tex.value = rtS.texture, copyM), dofA); blur(dofA, dofB, W >> 2, H >> 2, 2.2); blur(dofA, dofB, W >> 2, H >> 2, 3.4); }
      thrM.uniforms.tex.value = rtS.texture; pass(thrM, chain[0].a); blur(chain[0].a, chain[0].b, chain[0].w, chain[0].h, 1.4);
      copyM.uniforms.tex.value = chain[0].a.texture; pass(copyM, chain[1].a); blur(chain[1].a, chain[1].b, chain[1].w, chain[1].h, 1.6);
      copyM.uniforms.tex.value = chain[1].a.texture; pass(copyM, chain[2].a); blur(chain[2].a, chain[2].b, chain[2].w, chain[2].h, 1.8);
      const u = compM.uniforms; u.time.value = t % 7.3; u.focus.value = focus || 6; u.near.value = camera.near; u.far.value = camera.far; pass(compM, null);
    },
    set(k, v) { compM.uniforms[k].value = v; }, u: compM.uniforms, rtD, rtS,
    dispose() { [rtS, rtD, dofA, dofB].concat(chain.flatMap(c => [c.a, c.b])).forEach(r => r && r.dispose()); }
  };
}

/* ================= scenes ================= */
const SCENES = {};
function sunSetup(ctx, o) {
  const { scene, add } = ctx;
  const sun = new T.DirectionalLight(C(o.sunCol || '#ffc890'), o.sunI || 2.6); sun.position.copy(o.sunDir || new T.Vector3(3, 3, -6)).multiplyScalar(1); sun.target.position.set(0, .3, 0); sun.castShadow = true; const ms = ctx.low ? 1024 : 2048; sun.shadow.mapSize.set(ms, ms);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -4, near: .5, far: 30 }); sun.shadow.bias = -.0005; sun.shadow.normalBias = .02; sun.shadow.radius = 5; add(sun, sun.target); return sun;
}
function sunDisc(ctx, pos, col, size, glowCol) {
  const d = new T.Mesh(new T.CircleGeometry(size, 48), new T.MeshBasicMaterial({ color: C(col), fog: false, toneMapped: false })); d.position.copy(pos); d.material.color.multiplyScalar(4); ctx.add(L1(d));
  const gl = new T.Sprite(new T.SpriteMaterial({ map: TX.glow(), color: C(glowCol || col), blending: T.AdditiveBlending, depthWrite: false, fog: false, opacity: .9 })); gl.scale.set(size * 12, size * 12, 1); gl.position.copy(pos); gl.position.z += .1; ctx.add(L1(gl));
  const ry = new T.Sprite(new T.SpriteMaterial({ map: TX.rays(), color: C(glowCol || col), blending: T.AdditiveBlending, depthWrite: false, fog: false, opacity: .5 })); ry.scale.set(size * 26, size * 26, 1); ry.position.copy(pos); ry.position.z += .2; ctx.add(L1(ry)); ctx.upd.push(t => { ry.material.rotation = t * .02; ry.material.opacity = .42 + Math.sin(t * .6) * .06; });
}
SCENES['1:5'] = ctx => {
  const { scene, camera, add } = ctx;
  scene.background = TX.sky([[0, '#f0a883'], [.42, '#f9c4b0'], [.72, '#fddccb'], [1, '#fff0e4']]); scene.fog = new T.FogExp2(0xf3c3b6, .034);
  const H = (x, z) => { const k = Math.max(0, -z - 4); return k * .12 * (1 + .5 * Math.sin(x * .35 + k * .25)) + Math.max(0, -z - 12) * .05; }; ctx.ground = H;
  const tr = terrain(70, 70, 120, 120, H, '#6f5a98', '#a98fd0', -.02); tr.position.z = -20; add(tr);
  const lav = lavenderField({ n: ctx.low ? 3500 : 7500, depth: 17, zNear: 3.8, width: 13, h: H, clear: (x, z) => Math.abs(x) < 2.4 && z > -.7 && z < 2.0 }); add(lav);
  add(grass(ctx.low ? 2000 : 5000, [14, 16, 3.4], H, '#6c8a4a', '#9bb46a', 5));
  add(new T.HemisphereLight(C('#ffd9c8'), C('#8458b8'), .9));
  const sun = sunSetup(ctx, { sunDir: new T.Vector3(4, 3, -7), sunCol: '#ffbe84', sunI: 2.9 });
  const key = new T.DirectionalLight(C('#fff0e6'), 1.25); key.position.set(-3, 3.2, 5); add(key); const rim = new T.DirectionalLight(C('#ff9cbc'), 1.6); rim.position.set(2.5, 2.2, -4); add(rim);
  sunDisc(ctx, new T.Vector3(4.6, 2.4, -26), '#fff0c4', 1.3, '#ffcf96');
  const mq = mosque('#efd6cf', '#7566bb', '#ffd57a'); mq.position.set(-5.6, 0, -18); mq.scale.setScalar(1.35); mq.rotation.y = .4; add(mq);
  const far = terrain(80, 14, 70, 10, (x, z) => 1.4 + 1.5 * Math.sin(x * .13) * Math.sin(x * .05 + 1) + 1.2 * Math.sin(x * .31 + z), '#9884c0', '#d2b8e0', 0, .05); far.position.set(0, 0, -34); add(far);
  [[-14, 12, -42, 14, '#ffd9cf', .8], [10, 15, -46, 17, '#ffe6d9', .7], [-2, 9, -40, 11, '#ffdcd0', .55], [18, 11, -38, 10, '#ffd0c8', .6]].forEach(c => add(cloudSprite(c[0], c[1], c[2], c[3], c[4], c[5])));
  const mat1 = seatMat('#7a1a2c', '#dcab40', 1.3, .85, .14); mat1.position.set(-.7, .012, .1); mat1.rotation.y = PI - .22; add(mat1); const mat2 = seatMat('#1f6a86', '#dcab40', 1.15, .8, -.2); mat2.position.set(.7, .012, .15); mat2.rotation.y = PI + .25; add(mat2);
  const girl = makeKid({ kind: 'girl', pose: 'dua', robe: '#d6c7ac', hij: '#7c1a38', seed: 1, look: 'up', skin: '#e8b48c' }); girl.position.set(-.7, .02, .1); girl.rotation.y = PI - .22; add(girl); ctx.kids.push(girl);
  const boy = makeKid({ kind: 'boy', pose: 'sit', robe: '#dccfb6', seed: 2, look: 'up', skin: '#d99f74', hair: '#1c1018' }); boy.position.set(.7, .02, .15); boy.rotation.y = PI + .25; add(boy); ctx.kids.push(boy);
  const rh = rehal(); rh.position.set(-.82, .012, .72); rh.rotation.y = .38; rh.visible = false; add(rh);
  const bl = new T.PointLight(C('#ffd790'), 1.1, 2.6, 1.5); bl.position.set(-.8, .5, .85); add(bl);
  const l1 = lantern('#ffd36a', 1.2); l1.position.set(.02, .012, 1.1); add(l1); const l2 = lantern('#7fe6f2', 1.0); l2.position.set(-1.5, .012, -.5); add(l2);
  ctx.upd.push(t => { l1.userData.light.intensity = 2.0 + Math.sin(t * 3.1) * .35; l2.userData.light.intensity = 1.8 + Math.sin(t * 2.7 + 2) * .3; });
  const sp = sparkle(ctx.low ? 40 : 90, '#ffe3a0', [9, 3, 7, -.5], 3); add(sp); ctx.upd.push(t => sp.userData.upd(t)); const sp2 = sparkle(34, '#8aeaf5', [8, 3, 6, -.2], 8); add(sp2); ctx.upd.push(t => sp2.userData.upd(t + 3));
  const bk = bokehField(14, ['#ffd9a0', '#ffc2d8', '#fff0d0'], [7, 2.6, 2.4, 1.6], 5, .42); add(bk); ctx.upd.push(t => bk.userData.upd(t));
  const bf = [butterfly('#ff9acb', 1), butterfly('#ffd06a', 2)]; bf.forEach(b => add(b)); ctx.upd.push(t => { bf.forEach((b, i) => { b.position.set(Math.sin(t * .35 + i * 2) * 1.7 + (i ? .6 : -.3), .9 + Math.sin(t * .9 + i) * .15 + i * .1, .2 + Math.cos(t * .3 + i * 3) * .8 + 1); b.rotation.y = Math.cos(t * .35 + i * 2) > 0 ? -1.2 : 1.2; b.rotation.z = Math.sin(t * .9) * .2; flutterB(b, t + i); }); });
  camera.fov = 34; camera.near = .2; camera.far = 90;
  ctx.focus = t => 5.0; ctx.cam = t => { const k = sstep(0, 8, t); camera.position.set(Math.sin(t * .2) * .35 - k * .15, .95 + Math.sin(t * .28) * .02, 4.6 - k * .4); camera.lookAt(0, .72, -1); };
  ctx.post = { exposure: .98, bloom: .6, thr: 1.0 };
};
SCENES['106:2'] = ctx => {
  const { scene, camera, add } = ctx;
  scene.background = TX.sky([[0, '#f6a56e'], [.4, '#ffd09a'], [.78, '#ffe8c8'], [1, '#fff4de']]); scene.fog = new T.FogExp2(0xffdcae, .028);
  const H = (x, z) => 1.0 * Math.sin(x * .22 + z * .12) * Math.sin(z * .18 + 1) + .4 * Math.sin(x * .5 + z * .35) + Math.max(0, -z - 6) * .11; ctx.ground = H;
  const gr = terrain(90, 80, 160, 140, (x, z) => (z > -2 ? .05 * Math.sin(x * .8 + z) : Math.max(0, H(x, z) - .4) * 1.0), '#d9a867', '#f3d49c', -.02, .06); gr.position.z = -22; add(gr);
  add(new T.HemisphereLight(C('#ffe4bc'), C('#c78a52'), 1.0));
  sunSetup(ctx, { sunDir: new T.Vector3(-6, 3.4, -5), sunCol: '#ffc07a', sunI: 3 });
  const fill = new T.DirectionalLight(C('#fff0e0'), 1.1); fill.position.set(3, 3, 6); add(fill);
  sunDisc(ctx, new T.Vector3(-7, 3.6, -28), '#fff0c4', 1.4, '#ffd08a');
  [[8, 11, -36, 15, '#fff0d8', .8], [-12, 10, -40, 14, '#ffe6c8', .7]].forEach(c => add(cloudSprite(c[0], c[1], c[2], c[3], c[4], c[5])));
  ctx.caravan = []; for (let i = 0; i < 3; i++) { const c = makeCamel(i * 1.3); c.position.set(-4 + i * 2.9, 0, -.4 - (i % 2) * .6); add(c); ctx.caravan.push(c); }
  const boy = makeKid({ kind: 'boy', pose: 'walk', robe: '#fbf4e8', seed: 4, skin: '#d99f74', hair: '#1c1018' }); boy.position.set(-2, 0, 1.9); boy.rotation.y = PI / 2; add(boy); ctx.kids.push(boy);
  const rr = R(21); for (let i = 0; i < 14; i++) { const rk = ell(.12 + rr() * .2, .08 + rr() * .1, .12 + rr() * .15, new T.MeshStandardMaterial({ color: C('#c48b52'), roughness: 1 }), 10); rk.position.set((rr() - .5) * 9, .02, 1 + rr() * 3 - (i % 3) * 3); add(rk); }
  const sp = sparkle(40, '#fff0c0', [10, 3, 6, -.5], 5); add(sp); ctx.upd.push(t => sp.userData.upd(t));
  camera.fov = 36; camera.near = .2; camera.far = 100; ctx.focus = t => 9.2; ctx.cam = t => { camera.position.set(Math.sin(t * .2) * .5, 1.3 + Math.sin(t * .3) * .03, 9.4 - Math.min(t, 8) * .05); camera.lookAt(0, .95, 0); };
  ctx.upd.push(t => { ctx.caravan.forEach((c, i) => { c.position.x = ((i * 2.7 + t * .7) % 8.1) - 4.4; animCamel(c, t); }); boy.position.x = ((t * .7 + 1.2) % 8.1) - 4.4; });
  ctx.post = { exposure: 1.05, bloom: .6, thr: .9 };
};
function makeCamel(seed) {
  const g = new T.Group(), body = new T.MeshStandardMaterial({ color: C('#d9a46a'), roughness: .85 }), dk = new T.MeshStandardMaterial({ color: C('#b87a46'), roughness: .85 }), root = new T.Group(); g.add(root);
  const bd = ell(.62, .36, .3, body, 30); bd.position.y = 1.0; root.add(bd); const hump = ell(.2, .2, .18, body, 20); hump.position.set(-.05, 1.34, 0); root.add(hump);
  const blanket = mesh(new T.BoxGeometry(.56, .05, .6), cloth('#8a1f36')); blanket.position.set(-.02, 1.3, 0); root.add(blanket);
  const bundle = ell(.2, .15, .22, cloth('#2fb0c0'), 16); bundle.position.set(-.02, 1.5, 0); root.add(bundle);
  const neck = new T.Group(); neck.position.set(.5, 1.1, 0); root.add(neck); const nk = cap(.12, .5, body, 14); nk.rotation.z = -.9; nk.position.set(.2, .26, 0); neck.add(nk);
  const hd = new T.Group(); hd.position.set(.55, .62, 0); neck.add(hd); const sk = ell(.19, .14, .14, body, 18); hd.add(sk); const sn = ell(.14, .105, .115, body, 16); sn.position.set(.17, -.04, 0); hd.add(sn);
  const eyeM = new T.MeshStandardMaterial({ color: C('#1a0d08'), roughness: .2 }); [-1, 1].forEach(s => { const e = ell(.04, .07, .025, dk, 10); e.position.set(-.05, .14, s * .1); e.rotation.z = -.4; hd.add(e); const eye = ell(.026, .026, .02, eyeM, 10); eye.position.set(.06, .04, s * .12); hd.add(eye); (g.userData.eyes = g.userData.eyes || []).push(eye); });
  const legs = []; [[.38, .16], [.38, -.16], [-.38, .16], [-.38, -.16]].forEach(([x, z], i) => { const hip = new T.Group(); hip.position.set(x, .88, z); const up = cap(.095, .3, i < 2 ? body : dk, 12); up.position.y = -.22; hip.add(up); const kn = new T.Group(); kn.position.y = -.46; hip.add(kn); const lo = cap(.062, .28, i < 2 ? body : dk, 10); lo.position.y = -.2; kn.add(lo); const hoof = ell(.075, .04, .08, new T.MeshStandardMaterial({ color: C('#6a4226') }), 10); hoof.position.y = -.4; kn.add(hoof); root.add(hip); legs.push({ hip, kn }); });
  const tail = cap(.025, .3, dk, 6); tail.position.set(-.64, 1.0, 0); tail.rotation.z = .5; root.add(tail);
  g.userData.camel = { legs, neck, hd, seed, root }; return g;
}
function animCamel(g, t) {
  const u = g.userData.camel, ph = u.seed, w = t * 3.6 + ph; u.root.position.y = Math.abs(Math.sin(w)) * .025;
  u.legs.forEach((l, i) => { const s = Math.sin(w + (i % 2 ? PI : 0) + (i > 1 ? PI * .5 : 0)); l.hip.rotation.z = s * .45; l.kn.rotation.z = Math.max(0, -Math.cos(w + (i % 2 ? PI : 0))) * .55; });
  u.neck.rotation.z = Math.sin(w) * .04; u.hd.rotation.z = Math.sin(w + 1) * .06;
}

/* ================= public API ================= */
function create(canvas, key, opts) {
  opts = opts || {}; const build = SCENES[key]; if (!build) return null;
  const renderer = new T.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: !!opts.keep, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.NoToneMapping; renderer.autoClear = false;
  const dpr = Math.min(opts.dpr || window.devicePixelRatio || 1, opts.maxDpr || 2); renderer.setPixelRatio(dpr);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(36, 1, .1, 120), ctx = { scene, camera, add: o => scene.add(o), kids: [], upd: [], low: !!opts.low };
  camera.layers.enable(1); build(ctx);
  let w = opts.w || canvas.clientWidth || 400, h = opts.h || canvas.clientHeight || 500; renderer.setSize(w, h, false);
  const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
  const post = makePost(renderer, scene, camera, pw, ph, Object.assign({ dof: opts.dof !== false && !opts.low, msaa: !opts.low }, ctx.post || {}));
  const api = {
    resize(cw, ch) { w = cw; h = ch; renderer.setSize(cw, ch, false); camera.aspect = cw / ch; camera.updateProjectionMatrix(); post.resize(Math.round(cw * dpr), Math.round(ch * dpr)); },
    render(t) { ctx.cam(t); ctx.upd.forEach(f => f(t)); ctx.kids.forEach(k => animKid(k, t)); post.render(t, ctx.focus ? ctx.focus(t) : 6); },
    post, renderer, dispose() { post.dispose(); renderer.dispose(); scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
  };
  api.resize(w, h); return api;
}
window.FahmToon3D = { has: k => !!SCENES[k], keys: () => Object.keys(SCENES), create, reg: (k, f) => { SCENES[k] = f; }, kit: { T, R, C, PI, TAU, clamp, lerp, sstep, mixHex, mesh, ell, cap, cloth, skinMat, terrain, grass, lavenderField, makeKid, animKid, POSES, sunSetup, sunDisc, cloudSprite, mosque, lantern, makeCamel, animCamel, butterfly, flutterB, sparkle, bokehField, seatMat, rehal, TX, L1, ctex, foldLathe } };
})();

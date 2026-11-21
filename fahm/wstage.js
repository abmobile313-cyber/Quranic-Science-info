/* Fahm Word Stage — full-screen word-by-word learning stage (ayah ruler, meaning, root, line-art visual) in the app's maroon / gold / cyan theme.
   The same line-art library also draws the small word box under the ayah. Everything is drawn with canvas 2D (tiny, works offline, any screen). */
(function () {
'use strict';
const TAU = Math.PI * 2, PI = Math.PI;
const GOLD = '#dcab40', GOLD2 = '#f3d98b', CY = '#33cbe0', ROSE = '#e0587a', MAR = '#7a1a2c', INK = '#f3e9d2';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
const lerp = (a, b, k) => a + (b - a) * k;
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

/* ---------- drawing helpers ---------- */
function glow(c, x, y, r, col, a = 1) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, .95 * a)); g.addColorStop(.25, rgba(col, .45 * a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.fillStyle = rgba('#ffffff', .9 * a); c.beginPath(); c.arc(x, y, Math.max(2, r * .09), 0, TAU); c.fill(); }
function path(c, pts, col, w = 1, a = 1) { c.strokeStyle = rgba(col, a); c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
let MIR = 0;
function lab(c, txt, x, y, al, col, P, sz = 11) {
  if (!txt) return; c.save(); c.fillStyle = col || rgba(INK, .85); c.textAlign = al || 'left'; c.textBaseline = 'middle';
  if (MIR) { c.translate(x, y); c.scale(-1, 1); x = 0; y = 0; c.textAlign = al === 'left' || !al ? 'right' : al === 'right' ? 'left' : al; }
  if (P && P.rtl) { c.font = `${sz + 3}px NastaliqU, AmiriQ, serif`; c.fillText(txt, x, y); } else { c.font = `600 ${sz}px ui-monospace,Menlo,Consolas,monospace`; if ('letterSpacing' in c) c.letterSpacing = '2px'; c.fillText(String(txt).toUpperCase(), x, y); }
  c.restore();
}
function leader(c, x1, y1, x2, y2, col, p = 1) { const xe = lerp(x1, x2, p), ye = lerp(y1, y2, p); path(c, [[x1, y1], [xe, ye]], col, 1, .8); }
function dotsArc(c, cx, cy, r0, r1, a0, a1, n, col, p, t) { // radiant dotted wedge
  for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / (n - 1)); for (let k = 0; k < 9; k++) { const kk = k / 8, rr = lerp(r0, r1, kk); if (kk > p) break; const s = 1 + 1.6 * (1 - kk) + .4 * Math.sin(t * 2 + i * .7 + k); c.fillStyle = rgba(col, .25 + .7 * (1 - kk)); c.beginPath(); c.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, s * .75, 0, TAU); c.fill(); } }
}

/* ---------- archetypes: draw(c, W, H, t, p, P)  (t = seconds, p = entrance progress 0..1, P = {l:[labels], seed, rtl}) ---------- */
const AR = {};
AR.waves = (c, W, H, t, p, P) => {
  const y0 = H * .62, n = 22, A = H * .2;
  glow(c, W * .15, y0 - H * .3, H * .12, ROSE, p); glow(c, W * .85, y0 - H * .22, H * .1, CY, p);
  for (let i = 0; i < n; i++) { const k = i / n; c.strokeStyle = rgba(lerp(0, 1, k) < .5 ? ROSE : CY, .35 + .5 * (1 - k)); c.lineWidth = 1.1; c.beginPath();
    for (let x = 0; x <= W; x += 6) { const u = x / W, env = Math.exp(-Math.pow((u - .5) * 2.4, 2)); const y = y0 + k * H * .3 + Math.sin(u * 7 + t * 1.2 - k * 2) * 4 * (1 + k) - env * A * (1 - k * .7) * p * (1 + .12 * Math.sin(t + k * 3)); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
  lab(c, P.l[0], W * .13, y0 - H * .17, 'left', ROSE, P); lab(c, P.l[1], W * .87, y0 - H * .1, 'right', CY, P); lab(c, P.l[2], W * .5, y0 - A * 1.15, 'center', INK, P);
};
AR.rings = (c, W, H, t, p, P) => {
  const cx = W * .78, cy = H * .98, R = Math.min(W, H) * 1.05;
  for (let i = 1; i < 26; i++) { const r = R * i / 26 * p; c.strokeStyle = rgba(i % 5 === 0 ? GOLD2 : CY, .3 + .5 * (i / 26)); c.lineWidth = i % 5 === 0 ? 1.6 : 1; c.beginPath(); const st = PI + .15 * Math.sin(i), en = TAU - .1 * Math.cos(i * 1.3);
    for (let a = st; a <= en; a += .05) { const rr = r + Math.sin(a * 9 + i * 2) * 2.2 + Math.sin(t * 1.5 + i) * .8; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; a === st ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
  [0, 1, 2].forEach(k => { const y = H * (.2 + .13 * k); leader(c, 8, y, W * (k ? .3 : .96), y, rgba(INK, .8), ease(p * 1.3 - k * .2)); lab(c, P.l[k], 8, y - 12, 'left', INK, P); });
};
AR.orbits = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .55; glow(c, cx, cy, H * .16, '#9fd8ff', p);
  for (let i = 1; i <= 5; i++) { const rx = W * (.1 + .09 * i) * p, ry = rx * .36; c.strokeStyle = rgba('#bcd8ff', .22 + .08 * i); c.lineWidth = 1; c.beginPath(); c.ellipse(cx, cy, rx, ry, -.18, 0, TAU); c.stroke();
    const a = t * (.9 / i) + i * 1.7; const x = cx + Math.cos(a) * rx * Math.cos(-.18) - Math.sin(a) * ry * Math.sin(-.18), y = cy + Math.cos(a) * rx * Math.sin(-.18) + Math.sin(a) * ry * Math.cos(-.18); glow(c, x, y, 7 + i, i % 2 ? GOLD : CY, p * .8); }
  leader(c, W * .86, H * .3, W * .72, H * .43, rgba(INK, .8), ease(p * 1.2)); lab(c, P.l[0], W * .86, H * .27, 'right', INK, P);
};
AR.crescent = (c, W, H, t, p, P) => {
  const cx = W * .22, cy = H * .78, R = H * .55; c.save();
  dotsArc(c, cx, cy, R * .35, R * 1.0, -PI * .95, PI * .1, 60, '#f0a64a', p, t);
  dotsArc(c, cx, cy, R * .12, R * .35, -PI * .95, PI * .1, 36, '#ffd48a', p, t);
  c.restore(); glow(c, cx + R * .2, cy - R * .5, R * .22, GOLD2, p * .7);
  leader(c, W * .62, H * .52, W * .34, H * .52, rgba(INK, .85), ease(p * 1.2)); lab(c, P.l[0], W * .64, H * .52, 'left', INK, P);
  lab(c, P.l[1], W * .5, H * .3, 'center', GOLD2, P);
};
AR.path = (c, W, H, t, p, P) => {
  const hz = H * .38; for (let i = 0; i < 12; i++) { const k = i / 12; path(c, [[W * .5 + (k - .5) * W * .02, hz], [W * (.5 + (k - .5) * 1.9), H]], CY, 1, .12 + .3 * k); }
  for (let i = 0; i < 10; i++) { const k = ((i + t * .25) % 10) / 10, y = lerp(hz, H, k * k), w = lerp(8, W * .46, k * k); path(c, [[W * .5 - w, y], [W * .5 + w, y]], GOLD, 1 + k, (.15 + .6 * k) * p); }
  glow(c, W * .5, hz, H * .12, GOLD2, p); const px = W * .5, py = lerp(H * .95, hz + 10, ease(p)); lab(c, P.l[0], px + 14, hz - 16, 'left', GOLD2, P);
  c.fillStyle = rgba(INK, .9); c.beginPath(); c.arc(px, py, 4, 0, TAU); c.fill();
};
AR.flame = (c, W, H, t, p, P) => {
  const cx = W * .5, base = H * .95; for (let i = 0; i < 30; i++) { const k = i / 30, x0 = lerp(W * .2, W * .8, k), h = (H * .35 + H * .35 * Math.sin(k * PI) * (.7 + .3 * Math.sin(t * 2 + i))) * p; c.strokeStyle = rgba(i % 3 ? '#ff8a3d' : '#ffd36a', .45 + .4 * Math.sin(k * PI)); c.lineWidth = 1.2; c.beginPath();
    for (let y = 0; y <= h; y += 6) { const u = y / h; const x = x0 + Math.sin(u * 5 + t * 3 + i) * 10 * u + (cx - x0) * u * .5; y ? c.lineTo(x, base - y) : c.moveTo(x, base); } c.stroke(); }
  glow(c, cx, base - H * .2, H * .25, '#ff7a30', p * .5); lab(c, P.l[0], W * .5, H * .12, 'center', '#ffb070', P);
};
AR.drops = (c, W, H, t, p, P) => {
  const R = rnd(P.seed); for (let i = 0; i < 28; i++) { const x = R() * W, sp = .3 + R() * .5, ph = R(), y = ((t * sp * .6 + ph) % 1) * H * .78, l = 8 + R() * 14; path(c, [[x, y], [x - 1, y + l]], CY, 1.2, (.25 + .6 * R()) * p); }
  const gy = H * .84; for (let k = 0; k < 4; k++) { const r = ((t * .5 + k / 4) % 1); c.strokeStyle = rgba(CY, (1 - r) * .7 * p); c.lineWidth = 1.2; c.beginPath(); c.ellipse(W * .5, gy, W * .06 + r * W * .32, (W * .06 + r * W * .32) * .22, 0, 0, TAU); c.stroke(); }
  path(c, [[0, gy], [W, gy]], CY, 1, .35 * p); lab(c, P.l[0], W * .5, H * .1, 'center', CY, P);
};
AR.burst = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .62; glow(c, cx, cy, H * .3 * (.8 + .2 * p), '#ffcf70', p);
  for (let i = 0; i < 64; i++) { const a = -PI + i / 63 * PI, l = H * (.2 + .5 * ((i * 37) % 7) / 7) * p; path(c, [[cx + Math.cos(a) * H * .12, cy + Math.sin(a) * H * .12], [cx + Math.cos(a) * (H * .12 + l), cy + Math.sin(a) * (H * .12 + l)]], i % 2 ? GOLD2 : '#ff9f4a', 1, .3 + .4 * Math.abs(Math.sin(t + i))); }
  path(c, [[0, cy], [W, cy]], GOLD, 1, .5); lab(c, P.l[0], W * .5, H * .93, 'center', GOLD2, P);
};
AR.scales = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .3, tilt = Math.sin(t * .9) * .09 * p, L = W * .3; path(c, [[cx, cy], [cx, H * .92]], GOLD, 2, .9 * p); path(c, [[cx - W * .12, H * .92], [cx + W * .12, H * .92]], GOLD, 2, .9 * p);
  const ax = Math.cos(tilt) * L, ay = Math.sin(tilt) * L; path(c, [[cx - ax, cy - ay], [cx + ax, cy + ay]], GOLD2, 2.4, p);
  [[-1, '#e0587a', 0], [1, CY, 2]].forEach(([s, col, k]) => { const x = cx + s * ax, y = cy + s * ay; path(c, [[x, y], [x - 38, y + H * .3], [x + 38, y + H * .3]], col, 1, .6 * p); c.strokeStyle = rgba(col, .9 * p); c.beginPath(); c.ellipse(x, y + H * .3, 44, 9, 0, 0, TAU); c.stroke(); glow(c, x, y + H * .26, 16, col, p * .7); lab(c, P.l[k], x, y + H * .4, 'center', col, P); });
};
AR.mountain = (c, W, H, t, p, P) => {
  const R = rnd(P.seed); for (let L = 0; L < 4; L++) { const base = H * (.5 + L * .1), amp = H * (.38 - L * .07); c.strokeStyle = rgba(L % 2 ? CY : GOLD, .35 + L * .14); c.lineWidth = 1.2; c.beginPath(); const R2 = rnd(P.seed + L * 7);
    for (let x = 0; x <= W; x += 8) { const u = x / W; const y = base - amp * p * (Math.abs(Math.sin(u * (3 + L) + R2() * .4 + L)) * .8 + .2 * Math.sin(u * 17)) * (L ? 1 : 1.2); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); for (let y = base + 6; y < H; y += 7 + L * 2) path(c, [[0, y], [W, y]], L % 2 ? CY : GOLD, 1, .05); }
  lab(c, P.l[0], W * .5, H * .1, 'center', GOLD2, P);
};
AR.seed = (c, W, H, t, p, P) => {
  const cx = W * .5, base = H * .88; path(c, [[W * .1, base], [W * .9, base]], GOLD, 1, .6); const h = H * .62 * ease(p); c.strokeStyle = rgba('#7fe0a0', .9); c.lineWidth = 2; c.beginPath(); for (let y = 0; y <= h; y += 4) { const x = cx + Math.sin(y * .04 + t) * 4 * (y / h); y ? c.lineTo(x, base - y) : c.moveTo(cx, base); } c.stroke();
  for (let i = 0; i < 6; i++) { const y = base - h * (.25 + i * .12), s = i % 2 ? 1 : -1, l = (28 + i * 4) * ease(p * 1.3 - i * .08); c.strokeStyle = rgba('#7fe0a0', .8); c.beginPath(); c.moveTo(cx, y); c.quadraticCurveTo(cx + s * l * .6, y - l * .8, cx + s * l, y - l * .3); c.quadraticCurveTo(cx + s * l * .5, y - l * .1, cx, y); c.stroke(); }
  glow(c, cx, base - h - 6, 16 + 4 * Math.sin(t * 2), GOLD2, p); for (let k = 0; k < 8; k++) { c.strokeStyle = rgba(GOLD, .2); c.beginPath(); c.arc(cx, base, 20 + k * 9, PI, TAU); c.stroke(); } lab(c, P.l[0], cx + 40, base - h * .5, 'left', '#9fe8b0', P);
};
AR.birds = (c, W, H, t, p, P) => {
  const R = rnd(P.seed); for (let i = 0; i < 18; i++) { const sp = .25 + R() * .3, y0 = H * (.15 + R() * .6), ph = R(), x = ((t * sp * .3 + ph) % 1.2 - .1) * W, y = y0 + Math.sin(t + i) * 8, f = Math.sin(t * 6 + i) * 7, s = 8 + R() * 10; c.strokeStyle = rgba(i % 3 ? INK : GOLD2, .85 * p); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - s, y - f); c.quadraticCurveTo(x - s * .4, y - s * .5, x, y); c.quadraticCurveTo(x + s * .4, y - s * .5, x + s, y - f); c.stroke(); }
  lab(c, P.l[0], W * .5, H * .93, 'center', INK, P);
};
AR.wind = (c, W, H, t, p, P) => {
  for (let i = 0; i < 12; i++) { const y = H * (.15 + i * .07); c.strokeStyle = rgba(i % 2 ? CY : INK, .55 * p); c.lineWidth = 1.2; c.beginPath(); for (let x = 0; x <= W * p; x += 6) { const u = x / W, yy = y + Math.sin(u * 8 - t * 2 + i) * 10 * Math.sin(u * PI) + Math.sin(u * 3 + i) * 5; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke(); const k = (t * .3 + i * .13) % 1; glow(c, k * W, y + Math.sin(k * 8 * PI - t * 2 + i) * 6, 5, CY, p * .7); }
  lab(c, P.l[0], W * .5, H * .08, 'center', CY, P);
};
AR.heart = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .48, s = H * .015 * (1 + .06 * Math.sin(t * 3.2)) * (.4 + .6 * ease(p)); for (let k = 0; k < 7; k++) { c.strokeStyle = rgba(k % 2 ? ROSE : GOLD2, .85 - k * .1); c.lineWidth = 1.3; c.beginPath(); for (let a = 0; a <= TAU + .05; a += .06) { const x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); const q = 1 + k * .17; a ? c.lineTo(cx + x * s * q, cy + y * s * q) : c.moveTo(cx + x * s * q, cy + y * s * q); } c.stroke(); }
  glow(c, cx, cy, H * .1, ROSE, p * .6); const pl = Math.sin(t * 3.2) > .8 ? 1 : 0; path(c, [[0, H * .9], [W * .3, H * .9], [W * .36, H * (.9 - .08 * pl)], [W * .42, H * (.9 + .06 * pl)], [W * .5, H * .9], [W, H * .9]], ROSE, 1.2, .6); lab(c, P.l[0], W * .5, H * .08, 'center', ROSE, P);
};
AR.gate = (c, W, H, t, p, P) => {
  const cx = W * .5, bw = Math.min(W * .3, H * .3), top = H * .22, base = H * .92; for (let k = 0; k < 6; k++) { const o = k * 12 * p; c.strokeStyle = rgba(k % 2 ? CY : GOLD, .85 - k * .1); c.lineWidth = 1.3; c.beginPath(); c.moveTo(cx - bw - o, base); c.lineTo(cx - bw - o, top + bw); c.arc(cx, top + bw, bw + o, PI, 0); c.lineTo(cx + bw + o, base); c.stroke(); }
  glow(c, cx, base - H * .3, H * .22 * (.7 + .3 * Math.sin(t * 1.5)), GOLD2, p * .6); path(c, [[cx - W * .4, base], [cx + W * .4, base]], GOLD, 1, .6); lab(c, P.l[0], cx, H * .08, 'center', GOLD2, P);
};
AR.lamp = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .5; glow(c, cx, cy, H * .3 * (.85 + .1 * Math.sin(t * 2)), '#ffcf70', p); c.strokeStyle = rgba(GOLD2, .95); c.lineWidth = 1.6; c.beginPath(); c.ellipse(cx, cy, H * .1, H * .16, 0, 0, TAU); c.stroke(); path(c, [[cx - H * .06, cy + H * .15], [cx + H * .06, cy + H * .15], [cx + H * .04, cy + H * .24], [cx - H * .04, cy + H * .24], [cx - H * .06, cy + H * .15]], GOLD, 1.4, .9);
  for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, l = H * (.3 + .08 * Math.sin(t * 2 + i)) * p; path(c, [[cx + Math.cos(a) * H * .2, cy + Math.sin(a) * H * .25], [cx + Math.cos(a) * l, cy + Math.sin(a) * l]], GOLD2, 1, .25); } lab(c, P.l[0], cx, H * .94, 'center', GOLD2, P);
};
AR.book = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .55, w = Math.min(W * .36, H * .5), h = w * .72, o = ease(p); [-1, 1].forEach(s => { c.strokeStyle = rgba(GOLD2, .9); c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx, cy - h); c.quadraticCurveTo(cx + s * w * .5, cy - h - 14 * o, cx + s * w, cy - h * .8); c.lineTo(cx + s * w, cy + h * .8); c.quadraticCurveTo(cx + s * w * .5, cy + h - 14 * o, cx, cy + h); c.closePath(); c.stroke();
    for (let i = 0; i < 9; i++) { const y = cy - h * .6 + i * h * .15, k = ease(p * 1.5 - i * .06); path(c, [[cx + s * 12, y], [cx + s * (12 + (w - 30) * k * (.6 + .4 * ((i * 7) % 3) / 2)), y]], i % 4 === 0 ? CY : INK, 1.2, .6); } });
  glow(c, cx, cy - h * 1.15, 14, GOLD2, p * (.6 + .3 * Math.sin(t * 3))); lab(c, P.l[0], cx, H * .94, 'center', GOLD2, P);
};
AR.hands = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .7, s = Math.min(W, H) * .0026; [-1, 1].forEach(d => { c.strokeStyle = rgba(GOLD2, .9); c.lineWidth = 1.5; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(cx + d * 6, cy); c.quadraticCurveTo(cx + d * (60 + k * 18) * s * ease(p), cy - (120 + k * 14) * s * ease(p), cx + d * (24 + k * 26) * s * ease(p), cy - (230 + (2 - Math.abs(k - 2)) * 24) * s * ease(p)); c.stroke(); } });
  for (let i = 0; i < 20; i++) { const a = ((t * .22 + i / 20) % 1); glow(c, cx + Math.sin(i * 2.1) * W * .12, cy - a * H * .6, 3 + 2 * (1 - a), CY, (1 - a) * p); } lab(c, P.l[0], cx, H * .94, 'center', GOLD2, P);
};
AR.eye = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .5, w = Math.min(W * .34, H * .6), o = ease(p), bl = 1 - Math.pow(Math.max(0, Math.sin(t * .9)), 40) * .9;
  for (let k = 0; k < 4; k++) { c.strokeStyle = rgba(k % 2 ? CY : GOLD2, .9 - k * .18); c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - w - k * 6, cy); c.quadraticCurveTo(cx, cy - (w * .6 + k * 8) * o * bl, cx + w + k * 6, cy); c.quadraticCurveTo(cx, cy + (w * .6 + k * 8) * o * bl, cx - w - k * 6, cy); c.stroke(); }
  for (let k = 1; k < 7; k++) { c.strokeStyle = rgba(GOLD2, .8 - k * .1); c.beginPath(); c.arc(cx + Math.sin(t) * 6, cy, k * w * .06 * o, 0, TAU); c.stroke(); } glow(c, cx + Math.sin(t) * 6, cy, w * .22, CY, o); lab(c, P.l[0], cx, H * .92, 'center', CY, P);
};
AR.ear = (c, W, H, t, p, P) => {
  const cy = H * .52; glow(c, W * .12, cy, 18, GOLD2, p); for (let k = 0; k < 9; k++) { const r = ((t * .45 + k / 9) % 1) * W * .85; c.strokeStyle = rgba(k % 2 ? CY : GOLD2, (1 - r / (W * .85)) * .8 * p); c.lineWidth = 1.3; c.beginPath(); c.arc(W * .12, cy, r, -.9, .9); c.stroke(); }
  c.strokeStyle = rgba(INK, .8); c.beginPath(); for (let x = W * .2; x < W * .95; x += 4) { const u = (x - W * .2) / (W * .75), a = Math.sin(u * PI) * H * .08 * Math.sin(u * 30 - t * 8) * p; x === W * .2 ? c.moveTo(x, H * .86 + a) : c.lineTo(x, H * .86 + a); } c.stroke(); lab(c, P.l[0], W * .55, H * .12, 'center', GOLD2, P);
};
AR.arrow = (c, W, H, t, p, P) => {
  const y = H * .52, x1 = W * .86, x2 = W * .14, k = ease(p * 1.1); glow(c, x1, y, 16, GOLD2, p); glow(c, x2, y, 16, CY, p);
  path(c, [[x1, y], [lerp(x1, x2, k), y]], INK, 1.2, .85); for (let i = 0; i < 6; i++) { const q = ((t * .35 + i / 6) % 1); glow(c, lerp(x1, x2, q * k), y, 4, GOLD2, (1 - Math.abs(q - .5) * 2) * p * .9); }
  const ax = lerp(x1, x2, k); path(c, [[ax + 10, y - 7], [ax, y], [ax + 10, y + 7]], INK, 1.3, .9 * p);
  lab(c, P.l[0], x1, y + 30, 'right', GOLD2, P); lab(c, P.l[1], x2, y + 30, 'left', CY, P); lab(c, P.l[2], W * .5, y - 18, 'center', INK, P);
};
AR.negate = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .5, r = Math.min(W, H) * .26; c.strokeStyle = rgba(ROSE, .9); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r, -.8, -.8 + TAU * ease(p)); c.stroke(); const k = ease(p * 1.4 - .3); path(c, [[cx - r * .7, cy + r * .7], [lerp(cx - r * .7, cx + r * .7, k), lerp(cy + r * .7, cy - r * .7, k)]], ROSE, 2.2, 1);
  for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; path(c, [[cx + Math.cos(a) * (r + 10), cy + Math.sin(a) * (r + 10)], [cx + Math.cos(a) * (r + 10 + 6 + 4 * Math.sin(t * 2 + i)), cy + Math.sin(a) * (r + 10 + 6 + 4 * Math.sin(t * 2 + i))]], ROSE, 1, .35 * p); } lab(c, P.l[0], cx, H * .92, 'center', ROSE, P);
};
AR.crowd = (c, W, H, t, p, P) => {
  const R = rnd(P.seed); for (let r = 0; r < 6; r++) for (let i = 0; i < 14; i++) { const x = W * (.1 + .8 * (i + (r % 2) * .5) / 14), y = H * (.3 + r * .1) + Math.sin(t * 1.4 + i + r) * 2, s = 5 + r * 1.3; const k = ease(p * 1.6 - (i + r) * .03); c.fillStyle = rgba(i % 5 === 0 ? GOLD2 : CY, (.25 + r * .1) * k); c.beginPath(); c.arc(x, y - s * 1.6, s * .55, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x - s, y + s); c.quadraticCurveTo(x, y - s * 1.1, x + s, y + s); c.fill(); }
  lab(c, P.l[0], W * .5, H * .12, 'center', INK, P);
};
AR.star = (c, W, H, t, p, P) => {
  const R = rnd(P.seed); for (let i = 0; i < 90; i++) { const x = R() * W, y = R() * H, r = .6 + R() * 1.8, tw = .4 + .6 * Math.abs(Math.sin(t * (.6 + R()) + i)); c.fillStyle = rgba(i % 7 ? INK : GOLD2, tw * p); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  const pts = [[.2, .62], [.34, .45], [.5, .52], [.64, .3], [.8, .38]]; pts.forEach((q, i) => { if (i) path(c, [[pts[i - 1][0] * W, pts[i - 1][1] * H], [q[0] * W, q[1] * H]], CY, 1, .5 * p); glow(c, q[0] * W, q[1] * H, 10 + 3 * Math.sin(t * 2 + i), i % 2 ? GOLD2 : CY, p); }); lab(c, P.l[0], W * .5, H * .1, 'center', GOLD2, P);
};
AR.rope = (c, W, H, t, p, P) => {
  const n = 3; for (let k = 0; k < n; k++) { c.strokeStyle = rgba(k === 1 ? GOLD2 : GOLD, .9); c.lineWidth = 2.4; c.beginPath(); for (let x = 0; x <= W * ease(p); x += 4) { const y = H * .5 + Math.sin(x * .05 - t * 1.4 + k * TAU / n) * H * .07; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
  glow(c, W * .1, H * .5, 14, CY, p); glow(c, W * .9, H * .5, 14, ROSE, p); lab(c, P.l[0], W * .5, H * .82, 'center', GOLD2, P);
};
AR.kaaba = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .56, s = Math.min(W, H) * .22 * ease(p); const f = [[-1, -1], [1, -1], [1, 1], [-1, 1]]; c.strokeStyle = rgba(GOLD2, .95); c.lineWidth = 1.6; c.strokeRect(cx - s, cy - s * .9, s * 2, s * 1.8); path(c, [[cx - s, cy - s * .55], [cx + s, cy - s * .55]], GOLD, 5, .9); for (let i = 1; i < 6; i++) path(c, [[cx - s + i * s / 3, cy - s * .9], [cx - s + i * s / 3, cy + s * .9]], INK, 1, .12); path(c, [[cx + s * .15, cy + s * .9], [cx + s * .15, cy + s * .1], [cx + s * .55, cy + s * .1], [cx + s * .55, cy + s * .9]], GOLD2, 1.4, .8);
  for (let k = 1; k < 5; k++) { c.strokeStyle = rgba(CY, .6 / k); c.beginPath(); c.ellipse(cx, cy + s * 1.02, s * (1.1 + k * .55) * ease(p), s * (.22 + k * .1), 0, 0, TAU); c.stroke(); const a = t * .5 / k; glow(c, cx + Math.cos(a + k) * s * (1.1 + k * .55), cy + s * 1.02 + Math.sin(a + k) * s * (.22 + k * .1), 4, CY, p * .8); } lab(c, P.l[0], cx, H * .1, 'center', GOLD2, P);
};
AR.timearc = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .9, R = Math.min(W * .42, H * .8); c.strokeStyle = rgba(GOLD, .5); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, PI, TAU); c.stroke(); for (let i = 0; i <= 24; i++) { const a = PI + i / 24 * PI; path(c, [[cx + Math.cos(a) * R, cy + Math.sin(a) * R], [cx + Math.cos(a) * (R - (i % 6 ? 6 : 14)), cy + Math.sin(a) * (R - (i % 6 ? 6 : 14))]], GOLD, 1, .6); }
  const a = PI + ((t * .12) % 1) * PI * ease(p) + (1 - ease(p)) * 0; glow(c, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 18, a < PI * 1.5 ? GOLD2 : '#9fb8ff', p); path(c, [[cx, cy], [cx + Math.cos(a) * R * .8, cy + Math.sin(a) * R * .8]], GOLD2, 1, .5); lab(c, P.l[0], cx, H * .12, 'center', GOLD2, P);
};
AR.one = (c, W, H, t, p, P) => {
  const cx = W * .5, cy = H * .52; for (let k = 1; k < 9; k++) { c.strokeStyle = rgba(k % 2 ? GOLD : CY, (.7 - k * .07) * p); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, Math.max(.5, k * H * .05 * ease(p) + Math.sin(t * 1.5 - k) * 2), 0, TAU); c.stroke(); } glow(c, cx, cy, H * .16, '#fff1c8', p); lab(c, P.l[0], cx, H * .93, 'center', GOLD2, P);
};
AR.split = (c, W, H, t, p, P) => {
  const R = rnd(P.seed), cx = W * .5, cy = H * .5, k = ease(p); for (let i = 0; i < 40; i++) { const a = R() * TAU, d = (30 + R() * H * .3) * k, s = 6 + R() * 18; const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d + Math.sin(t * 2 + i) * 2; c.strokeStyle = rgba(i % 3 ? GOLD : ROSE, .8 - d / (H * .6)); c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a + 1) * s, y + Math.sin(a + 1) * s); c.lineTo(x + Math.cos(a + 2.2) * s * .8, y + Math.sin(a + 2.2) * s * .8); c.closePath(); c.stroke(); }
  glow(c, cx, cy, H * .1 * (1 - k * .4), GOLD2, p); lab(c, P.l[0], cx, H * .93, 'center', ROSE, P);
};

AR.flow = (c, W, H, t, p, P) => {   // running / flowing / sailing: streamlines with a travelling orb, right-to-left like the script
  const n = 9, cy = H * .55;
  for (let i = 0; i < n; i++) { const k = i / (n - 1), amp = H * (.05 + .06 * k), y0 = cy + (k - .5) * H * .42; c.strokeStyle = rgba(i % 2 ? CY : GOLD2, .28 + .4 * (1 - Math.abs(k - .5) * 2)); c.lineWidth = 1.1; c.beginPath();
    for (let x = W; x >= 0; x -= 5) { const u = x / W, y = y0 + Math.sin(u * 6 + t * .9 + i) * amp * Math.min(1, p * 1.4); x === W ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    for (let q = 0; q < 3; q++) { const u = 1 - (((t * .16 + q / 3 + i * .07) % 1)), x = u * W, y = y0 + Math.sin(u * 6 + t * .9 + i) * amp * Math.min(1, p * 1.4); glow(c, x, y, 9 + 4 * k, i % 2 ? CY : GOLD2, .8 * p); } }
  const u = 1 - ((t * .12) % 1), ox = u * W, oy = cy + Math.sin(u * 6 + t * .9 + 4) * H * .08; glow(c, ox, oy, H * .1, GOLD2, p); c.fillStyle = rgba('#fff4d0', .95); c.beginPath(); c.arc(ox, oy, 5, 0, TAU); c.fill();
  lab(c, P.l[0], W * .5, H * .12, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .9, 'center', rgba(INK, .85), P);
};
AR.measure = (c, W, H, t, p, P) => {   // decree / measure / ordain: a drawn scale with a compass sweeping a fixed arc
  const cx = W * .5, cy = H * .62, R = Math.min(W * .42, H * .5), e = ease(p);
  c.strokeStyle = rgba(GOLD, .75); c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, R * e, PI, TAU); c.stroke();
  for (let i = 0; i <= 60; i++) { const a = PI + i / 60 * PI, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 5; if (i / 60 > e) break; path(c, [[cx + Math.cos(a) * R, cy + Math.sin(a) * R], [cx + Math.cos(a) * (R - L), cy + Math.sin(a) * (R - L)]], i % 10 === 0 ? GOLD2 : GOLD, 1, .85); }
  const a = PI + (.15 + .7 * ((Math.sin(t * .8) + 1) / 2)) * PI * e; path(c, [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], CY, 1.8, .95); glow(c, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 16, CY, p);
  c.strokeStyle = rgba(ROSE, .7); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * .62 * e, PI, a); c.stroke();
  glow(c, cx, cy, 10, GOLD2, p); lab(c, P.l[0], W * .5, H * .16, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .88, 'center', rgba(INK, .85), P);
};
AR.rosette = (c, W, H, t, p, P) => {   // generative Islamic star pattern, unique per word
  const R = rnd(P.seed), n = 5 + (P.seed % 8), cx = W * .5, cy = H * .5, r0 = Math.min(W, H) * .34, k = 2 + (P.seed >> 3) % Math.max(1, Math.floor(n / 2) - 1);
  for (let L = 0; L < 4; L++) { const rr = r0 * (1 - L * .2) * ease(p), rot = t * (L % 2 ? .08 : -.08) + L * .2; c.strokeStyle = rgba(L % 2 ? CY : GOLD, .85 - L * .15); c.lineWidth = 1.2; c.beginPath(); for (let i = 0; i <= n; i++) { const a = rot + (i * k % n) / n * TAU; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.strokeStyle = rgba(L % 2 ? CY : GOLD, .2); c.stroke(); }
  for (let i = 0; i < n; i++) { const a = i / n * TAU + t * .15; glow(c, cx + Math.cos(a) * r0 * 1.12, cy + Math.sin(a) * r0 * 1.12, 6, i % 2 ? GOLD2 : CY, p * .7); } glow(c, cx, cy, r0 * .22, GOLD2, p * .8); lab(c, P.l[0], cx, H * .94, 'center', GOLD2, P);
};


/* ---------- Build 28: cinematic backdrop under every word scene (unique per word from its seed) ---------- */
const PALS = [[GOLD2, CY], [GOLD2, ROSE], ['#9fd8ff', GOLD], ['#ffd48a', '#57e0b4'], ['#f6b8c8', GOLD2], ['#b9a8ff', GOLD2], [CY, '#ffd48a'], ['#ff9f72', GOLD2]];
function backdrop(c, W, H, t, p, P) {
  const R = rnd(P.seed), pal = PALS[P.seed % PALS.length], A1 = pal[0], A2 = pal[1];
  const fold = [8, 10, 12, 6, 16, 9][(P.seed >> 4) % 6], cx = W * (.38 + R() * .24), cy = H * (.4 + R() * .16), RR = Math.min(W, H) * (.5 + R() * .18), ep = ease(p);
  c.save();
  /* 1 soft nebula */
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, RR * 1.5); g.addColorStop(0, rgba(A2, .16 * ep)); g.addColorStop(.5, rgba(A1, .05 * ep)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  /* 2 light rays sweeping from above */
  const rn = 5 + (P.seed % 4), sx = W * (.2 + R() * .6);
  for (let i = 0; i < rn; i++) { const a = Math.PI * .5 + (i - (rn - 1) / 2) * .17 + Math.sin(t * .35 + i) * .05, L = H * 1.3, w2 = .045 + .02 * Math.sin(t * .6 + i * 1.7);
    const x1 = sx + Math.cos(a - w2) * L, y1 = -8 + Math.sin(a - w2) * L, x2 = sx + Math.cos(a + w2) * L, y2 = -8 + Math.sin(a + w2) * L;
    const lg = c.createLinearGradient(sx, 0, sx + Math.cos(a) * L, Math.sin(a) * L); lg.addColorStop(0, rgba(A1, .13 * ep)); lg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = lg; c.beginPath(); c.moveTo(sx, -8); c.lineTo(x1, y1); c.lineTo(x2, y2); c.closePath(); c.fill(); }
  /* 3 rotating khatam mandala, three counter-rotating layers */
  for (let L = 0; L < 3; L++) {
    const r = RR * (1 - L * .27) * ep, rot = t * (L % 2 ? -.06 : .05) + L * .3 + (P.seed % 7); c.lineWidth = 1; c.strokeStyle = rgba(L % 2 ? A2 : A1, .2 - L * .04);
    const k = 2 + (L + (P.seed >> 5)) % Math.max(2, Math.floor(fold / 2) - 1);
    c.beginPath(); for (let i = 0; i <= fold; i++) { const a = rot + (i * k) / fold * TAU, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    c.beginPath(); for (let i = 0; i < fold; i++) { const a0 = rot + i / fold * TAU, a1 = rot + (i + 1) / fold * TAU, am = (a0 + a1) / 2; const x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r, x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r, xm = cx + Math.cos(am) * r * .62, ym = cy + Math.sin(am) * r * .62; c.moveTo(x0, y0); c.quadraticCurveTo(xm, ym, x1, y1); } c.stroke();
    c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.setLineDash([3, 7]); c.stroke(); c.setLineDash([]);
  }
  /* 4 pointed mihrab arch drawing itself in */
  { const aw = Math.min(W * .86, H * .78) / 2, top = H * .04, bot = H * .98, sh = top + (bot - top) * .3; c.lineWidth = 1.2; c.strokeStyle = rgba(A1, .34 * ep);
    for (let q = 0; q < 2; q++) { const o = q * 7; c.beginPath(); c.setLineDash([2000]); c.lineDashOffset = 2000 * (1 - ep);
      c.moveTo(W / 2 - aw + o, bot); c.lineTo(W / 2 - aw + o, sh); c.bezierCurveTo(W / 2 - aw + o, sh - (sh - top) * .5, W / 2 - aw * .25, top + (sh - top) * .22, W / 2, top + o); c.bezierCurveTo(W / 2 + aw * .25, top + (sh - top) * .22, W / 2 + aw - o, sh - (sh - top) * .5, W / 2 + aw - o, sh); c.lineTo(W / 2 + aw - o, bot); c.stroke(); }
    c.setLineDash([]); }
  /* 5 rising luminous motes with parallax + twinkle */
  c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const dep = .3 + R() * .9, x0 = R() * W, y0 = R() * H, sp = (6 + R() * 16) * dep, sw = 8 + R() * 22, ph = R() * TAU;
    const y = ((y0 - t * sp) % H + H) % H, x = x0 + Math.sin(t * .5 * dep + ph) * sw, tw = .35 + .65 * Math.abs(Math.sin(t * 1.4 * dep + ph)); const rr = (.7 + R() * 2.1) * dep;
    c.fillStyle = rgba(i % 3 ? A1 : A2, .55 * tw * ep); c.beginPath(); c.arc(x, y, rr, 0, TAU); c.fill(); if (rr > 1.9) glow(c, x, y, rr * 5, i % 3 ? A1 : A2, .25 * tw * ep); }
  /* 6 shock-ring on entrance */
  if (p < 1) { const k = ease(p); c.strokeStyle = rgba(A1, (1 - k) * .7); c.lineWidth = 2.2 * (1 - k) + .4; c.beginPath(); c.arc(cx, cy, RR * 1.4 * k, 0, TAU); c.stroke(); }
  c.restore();
}

/* ---------- word -> archetype (English gloss / lemma motif / root) ---------- */
const MOTIF = { prep: 'arrow', pron: 'arrow', rain: 'drops', oneness: 'one', crowd: 'crowd', shatter: 'split', path: 'path', ripple: 'waves', push: 'arrow', descend: 'arrow', converge: 'orbits', caravan: 'path', whisper: 'ear', sphere: 'crescent', scales: 'scales', flames: 'flame', fade: 'timearc', day: 'burst', spiral: 'orbits', show: 'eye', rope: 'rope', river: 'waves', orbit: 'orbits', negate: 'negate', house: 'kaaba', globe: 'orbits', feed: 'seed', envy: 'eye', duo: 'waves', dawn: 'burst', coins: 'scales', beads: 'rope', elephants: 'crowd', link: 'arrow', rings: 'rings' };
const RULES = [
  [/\ballah\b|\bgod\b/, 'crescent'], [/\brun|\bruns|runn|\bflow|\bsail|\bcourse\b|\bfloat|\bswim|\bmov(e|es|ing)\b|\bpass(es|ing)?\b|\btravers/, 'flow'], [/measure|decree|ordain|destin|determin|proportion|\bextent|appoint|\bplan\b|\bpower\b|\bcapab|\bable\b/, 'measure'], [/know|knowledge|knower|wise|wisdom|aware|learn|teach|\bmind\b|understand|intellect|reason|ponder|reflect/, 'lamp'], [/\blord\b|\bmaster\b|\bowner\b|\bking\b|sustain|cherish|nurtur|\bcreator\b|\bsovereign/, 'rings'],
  [/praise|thank|grate|glori|hymn|extol|exalt/, 'waves'], [/mercy|merciful|gracious|compassion|kind|forgiv|pardon|bless/, 'drops'],
  [/worlds?\b|universe|creation|heavens?\b|\bsky|skies|stars?\b|planet|galax|cosmos/, 'star'],
  [/light|bright|shin|illumin|\bsun\b|dawn|morning|daybreak|radian|\bnoor\b/, 'burst'], [/fire|hell|blaz|flame|burn|scorch|blaze|inferno|hot/, 'flame'],
  [/water|rain|river|\bsea\b|flood|spring|drink|stream|ocean|fountain|drop|cloud/, 'drops'], [/guide|straight|\bpath|\bway\b|road|follow|journey|travel|caravan/, 'path'],
  [/book|writ|\bpen\b|recit|read|scripture|\bverses?\b|\bsigns?\b|revelation|quran|tablet|record/, 'book'], [/scale|weigh|balanc|deeds?\b|reckon|account|judg|justice|reward|recompense|\bdebt|\bgain|\bloss/, 'scales'],
  [/mountain|\bhills?\b|\bearth\b|\bland\b|rock|stone|valley|desert/, 'mountain'], [/\bplant|\bseed|\bgrow|\btree|fruit|garden|crop|sprout|harvest|vegetation|\bgrain|palm|olive|fig\b/, 'seed'],
  [/\bbirds?\b|\bfly|flock|wing/, 'birds'], [/wind|blow|storm|breeze|gale|tempest/, 'wind'], [/heart|love|\bfear|\bhope|\bsoul|chest|breast|\bpious|piety|conscious|patien|\bsad|grief/, 'heart'],
  [/\bdoor|gate|\benter|paradise|abode|\bhome\b|dwell|reside/, 'gate'], [/\bsee\b|\beyes?\b|\blook|behold|witness|sight|watch|observ|\bshow|\bvisible|\bsaw\b|\bseen/, 'eye'],
  [/hear|listen|\bears?\b|\bsay\b|speak|\bcall|\bword|voice|\btell|\bask|\bsaid\b|announce|whisper|proclaim|\bcry\b/, 'ear'],
  [/\bnot\b|\bno\b|never|\bnone|\bnor\b|without|deny|disbelie|reject|except|\bnothing|\bwill not|\bdid not|\bdo not/, 'negate'],
  [/people|\bmen\b|mankind|nation|folk|those who|believer|disbeliev|communit|\bparty\b|\bthey\b|\bthem\b|humans?\b|\bhumanity|\bwho\b|\bwe\b|\bus\b/, 'crowd'],
  [/pray|worship|prostrat|\bserve|\bbow|\bhouse\b|temple|mosque|sanctuary|kaaba|ka'ba|\bcharity|\bzakat/, 'kaaba'], [/\bhands?\b|supplicat|\bdua\b|invoke|beseech/, 'hands'],
  [/night|\btime\b|\bhour\b|moon|\bera\b|\bage\b|\byears?\b|month|before|after|\bwhen\b|\bday\b|\bdays\b|until|\bsoon\b|\bnow\b|\bthen\b|\bonce\b|eternal|forever/, 'timearc'],
  [/\bone\b|\bonly\b|\balone\b|unique|single|\bfirst\b|\bsole\b|\bunity|\bone god/, 'one'], [/rope|\bbind|\bhold|\bfast\b|chain|\btie|\bneck|\bgrasp|cling|bond|covenant|\bpact/, 'rope'],
  [/split|break|shatter|scatter|destroy|ruin|perish|\btorn|cleave|burst|\bend\b|\bcollaps|\bdestruct/, 'split'],
  [/^\W*(and|but|so|then|for|from|in|on|with|by|of|upon|to|towards|that|if|indeed|surely|verily|what|which|it|he|she|you|i|his|her|their|your|my|our|this|these|those|such|as|at|into|out|over|under|between|against|about|than|or|so that|because)\b/, 'arrow']
];
const CROWD_STRONG = /people|\bmen\b|mankind|nation|folk|believer|disbeliev|communit|\bparty\b|humans?\b|humanity|those who/;
function glossOf(W) { return String(W.en || '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/\[[^\]]*\]/g, ' ').replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function motifFor(W, lem) {
  const SG = window.FahmSig;
  if (lem && lem.m && MOTIF[lem.m] && !(SG && MOTIF[lem.m] === 'arrow')) return MOTIF[lem.m];
  const g = glossOf(W);
  if (SG) { try { const m = SG.pre(W, g); if (m && AR[m]) return m; } catch (e) { } }
  for (const [re, m] of RULES) { if (!re.test(g)) continue; if (SG && m === 'arrow') continue; if (SG && m === 'crowd' && !CROWD_STRONG.test(g)) continue; return m; }
  if (SG) { try { const m = SG.post(W, g); if (m && AR[m]) return m; } catch (e) { } }
  return 'rosette';
}

/* ---------- small multilingual UI strings ---------- */
const S = {
  ur: { word: 'لفظ', of: 'از', root: 'مادہ', begin: 'آغاز کریں', tap: 'کسی لفظ کو چھوئیں', sum: 'پوری آیت کا مفہوم', play: 'چلائیں', close: 'بند', notes: {} },
  ru: { word: 'LAFZ', of: 'MEIN SE', root: 'ROOT', begin: 'Shuru karein', tap: 'Kisi lafz ko chhuein', sum: 'Poori ayat ka mafhoom', play: 'Chalayein', close: 'Band' },
  en: { word: 'WORD', of: 'OF', root: 'ROOT', begin: 'Begin', tap: 'Tap any word', sum: 'The whole ayah', play: 'Play', close: 'Close' }
};
const NOTES = {   // short meaning note per archetype: ur / ru / en
  crescent: ['وہ ایک ذات جس کی روشنی ہر طرف', 'Woh ek zaat jis ka noor har taraf', 'The One whose light reaches everywhere'],
  rings: ['مالک، پالنے والا، سنبھالنے والا', 'Maalik, paalne wala, sambhalne wala', 'The One who owns, nurtures and sustains'],
  waves: ['محبت اور شکر کی لہریں', 'Mohabbat aur shukr ki lehrein', 'Waves of love and gratitude'],
  drops: ['رحمت اور پانی کی بوندیں', 'Rehmat aur paani ki boondein', 'Mercy falling like rain'],
  star: ['آسمان، ستارے اور جہان', 'Aasmaan, sitare aur jahaan', 'Heavens, stars and worlds'],
  orbits: ['ہر جہان اپنے خالق کی نشانی', 'Har jahaan apne Khaaliq ki nishani', 'Every realm, a sign of its Maker'],
  burst: ['روشنی جو اندھیرا مٹاتی ہے', 'Roshni jo andhera mitati hai', 'Light that dispels the darkness'],
  flame: ['بھڑکتی ہوئی آگ', 'Bhadakti hui aag', 'A blazing fire'],
  path: ['سیدھی راہ کی طرف', 'Seedhi raah ki taraf', 'Toward the straight path'],
  book: ['کتاب اور آیات', 'Kitaab aur aayaat', 'The Book and its verses'],
  scales: ['عدل، حساب اور میزان', 'Adl, hisaab aur meezaan', 'Justice, reckoning and the balance'],
  mountain: ['زمین اور پہاڑ', 'Zameen aur pahaad', 'Earth and mountains'],
  seed: ['اگنا، بڑھنا، پھل دینا', 'Ugna, badhna, phal dena', 'Growing and bearing fruit'],
  birds: ['اڑتے پرندے', 'Udte parinde', 'Birds in flight'],
  wind: ['چلتی ہوا', 'Chalti hawa', 'The moving wind'],
  heart: ['دل کی دھڑکن اور احساس', 'Dil ki dhadkan aur ehsaas', 'The heartbeat and its feeling'],
  gate: ['دروازہ اور داخل ہونا', 'Darwaza aur daakhil hona', 'A gate and entering'],
  eye: ['دیکھنا اور گواہی', 'Dekhna aur gawaahi', 'Seeing and witnessing'],
  ear: ['سننا، بولنا، پکارنا', 'Sunna, bolna, pukaarna', 'Hearing, speaking, calling'],
  negate: ['نفی: “نہیں”', 'Nafi: “nahin”', 'Negation: “not”'],
  crowd: ['لوگ اور جماعت', 'Log aur jamaat', 'People and community'],
  kaaba: ['عبادت اور اللہ کا گھر', 'Ibaadat aur Allah ka ghar', 'Worship and the House of Allah'],
  hands: ['دعا میں اٹھے ہاتھ', 'Dua mein uthe haath', 'Hands raised in prayer'],
  timearc: ['وقت، دن اور رات', 'Waqt, din aur raat', 'Time, day and night'],
  one: ['ایک، یکتا', 'Ek, yakta', 'One, unique'],
  rope: ['رسی اور بندھن', 'Rassi aur bandhan', 'A rope and a bond'],
  split: ['بکھرنا اور ٹوٹنا', 'Bikharna aur tootna', 'Shattering apart'],
  arrow: ['ایک لفظ جو دو چیزوں کو جوڑتا ہے', 'Ek lafz jo do cheezon ko jodta hai', 'A small word that links two things'],
  flow: ['بہنا، چلنا اور رواں رہنا', 'Behna, chalna aur rawan rehna', 'Flowing, running and moving on'],
  measure: ['اندازہ، مقدار اور تقدیر', 'Andaza, miqdaar aur taqdeer', 'Measure, proportion and decree'],
  lamp: ['علم اور روشنی', 'Ilm aur roshni', 'Knowledge and light'],
  rosette: ['اس لفظ کی اپنی نشانی', 'Is lafz ki apni nishani', 'This word’s own pattern']
};
const UI_I = { ur: 0, ru: 1, en: 2 };
const POSN = { N: ['اسم', 'Ism (naam)', 'Noun'], V: ['فعل', "Fe'l (kaam)", 'Verb'], P: ['حرفِ جر', 'Harf-e-jarr', 'Preposition'], PN: ['اسمِ علم', 'Ism-e-alam (khaas naam)', 'Proper name'], REL: ['اسمِ موصول', 'Ism-e-mausool (jo / jis)', 'Relative pronoun'], PRON: ['ضمیر', 'Zameer', 'Pronoun'], NEG: ['حرفِ نفی', 'Harf-e-nafi', 'Negation particle'], ACC: ['حرفِ نصب', 'Harf-e-nasb', 'Accusative particle'], ADJ: ['صفت', 'Sifat', 'Adjective'], T: ['ظرفِ زمان', 'Zarf-e-zamaan', 'Time adverb'], DEM: ['اسمِ اشارہ', 'Ism-e-ishaara', 'Demonstrative'], COND: ['حرفِ شرط', 'Harf-e-shart', 'Conditional particle'], CONJ: ['حرفِ عطف', 'Harf-e-atf', 'Conjunction'], LOC: ['ظرفِ مکان', 'Zarf-e-makaan', 'Place adverb'], SUB: ['حرفِ مصدری', 'Harf-e-masdari', 'Subordinating particle'], RES: ['حرفِ حصر', 'Harf-e-hasr', 'Restriction particle'], INTG: ['حرفِ استفہام', 'Harf-e-istifhaam', 'Question particle'], CERT: ['حرفِ تحقیق', 'Harf-e-tahqeeq', 'Certainty particle'], PRO: ['حرفِ نہی', 'Harf-e-nahi', 'Prohibition particle'], PREV: ['حرفِ کاف', 'Harf-e-kaaf', 'Preventive particle'], RET: ['حرفِ اضراب', 'Harf-e-izraab', 'Retraction particle'], EXP: ['حرفِ استثنا', 'Harf-e-istisna', 'Exceptive particle'], INC: ['حرفِ ابتدا', 'Harf-e-ibtida', 'Inceptive particle'], EXL: ['حرفِ تفصیل', 'Harf-e-tafseel', 'Explanation particle'], AMD: ['حرفِ استدراک', 'Harf-e-istidraak', 'Amendment particle'], INT: ['حرفِ تفسیر', 'Harf-e-tafseer', 'Interpretation particle'], FUT: ['حرفِ استقبال', 'Harf-e-istiqbaal', 'Future particle'], ANS: ['حرفِ جواب', 'Harf-e-jawaab', 'Answer particle'], EXH: ['حرفِ تحضیض', 'Harf-e-tahdeez', 'Exhortation particle'], SUR: ['حرفِ فجائیہ', 'Harf-e-fujaaiya', 'Surprise particle'], VOC: ['حرفِ ندا', 'Harf-e-nida', 'Vocative particle'], EQ: ['حرفِ تسویہ', 'Harf-e-taswiya', 'Equalization particle'], CIRC: ['حالیہ', 'Haaliya', 'Circumstantial particle'], COM: ['واوِ معیت', 'Waaw-e-maiyyat', 'Comitative'], REM: ['حرفِ استیناف', 'Harf-e-istinaaf', 'Resumption particle'], CAUS: ['حرفِ سببیہ', 'Harf-e-sababiya', 'Cause particle'], PRP: ['لامِ تعلیل', 'Laam-e-ta\u2019leel', 'Purpose particle'], IMPN: ['اسمِ فعل', 'Ism-e-fe\u2019l', 'Imperative noun'], AVR: ['حرفِ ردع', 'Harf-e-rad\u2019', 'Aversion particle'], INL: ['حروفِ مقطعات', 'Huroof-e-muqatta\u2019aat', 'Disconnected letters'], LOC2: ['', '', ''] };
const FORMN = { PERF: ['ماضی', 'maazi (guzra hua)', 'perfect / past'], IMPF: ['مضارع', 'mudhaari (haal/mustaqbil)', 'imperfect / present-future'], IMPV: ['امر', 'amr (hukm)', 'imperative / command'], VN: ['مصدر', 'masdar', 'verbal noun'], 'ACT|PCPL': ['اسمِ فاعل', 'ism-e-faail', 'active participle'], 'PASS|PCPL': ['اسمِ مفعول', 'ism-e-maf\u2019ool', 'passive participle'], PASS: ['مجہول', 'majhool', 'passive'] };
function gramOf(W, ui) {
  const k = UI_I[ui], p = POSN[W.pos]; if (!p) return ''; let o = p[k];
  const f = String(W.form || ''); if (f) { const fl = f.split('|'), bab = fl.filter(x => /^\(/.test(x)).join(''), core = fl.filter(x => !/^\(/.test(x)).join('|'); const fm = FORMN[core] || (FORMN[fl[0]]); const parts = []; if (fm) parts.push(fm[k]); if (bab) parts.push((ui === 'ur' ? 'باب ' : 'baab ') + bab.replace(/[()]/g, '')); if (parts.length) o += ' · ' + parts.join(' · '); }
  return o;
}


/* ---------- stage ---------- */
const Q = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let API = null, el = null, cv = null, ctx = null, raf = 0, t0 = 0, idx = -1, isOpen = false, mini = null;
const letters = r => r ? [...r].join(' – ') : '';
const rootSp = r => r ? [...r].join(' · ') : '';

function specFor(W, S_, A, i) {
  const key = `${S_.n}:${A.v}:${i}`, st = API.st(), ar = API.lemKey(W.ar);
  const spec = (window.FAHM_LAB || {})[key] || (window.FAHM_LEM || {})[ar] || null;
  return spec;
}
function dataFor(i) {
  const { S: S_, A } = API.cur(), W = A.words[i], st = API.st(), u = st.ui, lem = specFor(W, S_, A, i);
  const m = motifFor(W, lem), [mm, mc] = API.wordMeaning(W), rtl = u === 'ur';
  const tl = String(W.tl || '').replace(/'/g, '’');
  const l1 = rtl ? W.ar : tl, l2 = mm;
  let labs;
  const note = lem && lem.n ? (u === 'ur' ? lem.n.ur : u === 'ru' ? lem.n.ru : lem.n.en) : '', gram = gramOf(W, u);
  labs = m === 'arrow' ? [W.ar, rtl ? '' : tl, mm] : m === 'waves' ? [rtl ? '' : tl ? 'love' : '', '', rtl ? W.ar : tl] : [rtl ? W.ar : tl, mm, rtl ? '' : tl];
  if (m === 'waves') labs = [u === 'ur' ? 'محبت' : u === 'ru' ? 'mohabbat' : 'love', u === 'ur' ? 'شکر' : u === 'ru' ? 'shukr' : 'gratitude', rtl ? W.ar : tl];
  if (m === 'rings') labs = u === 'ur' ? ['مالک', 'پرورش', 'سہارا'] : u === 'ru' ? ['Maalik', 'Parvarish', 'Sahaara'] : ['owns', 'nurtures', 'sustains'];
  if (m === 'orbits') labs = [(u === 'ur' ? 'نشانی' : u === 'ru' ? 'nishani' : 'a sign'), '', ''];
  if (m === 'crescent') labs = [rtl ? W.ar : tl, mm, ''];
  let alt = 0; if (i > 0) { try { const W0 = A.words[i - 1]; if (motifFor(W0, specFor(W0, S_, A, i - 1)) === m) alt = 1; } catch (e) { } }
  return { W, m, mm, mc, rtl, tl, note, gram, labs, alt, seed: hash(W.ar + (W.root || '')) };
}

function buildDom() {
  if (el) return;
  el = document.createElement('div'); el.id = 'ws'; el.hidden = true;
  el.innerHTML = `<div class="ws-bg"></div>
  <div class="ws-top"><button class="ws-x" data-ws="close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="ws-cnt" id="wsCnt"></div><span class="ws-sp"></span></div>
  <div class="ws-ayw"><div class="ws-ref" id="wsRef"></div><div class="ws-ay" id="wsAy" dir="rtl"></div></div>
  <div class="ws-body" id="wsBody"></div>
  <canvas id="wsCv"></canvas>
  <div class="ws-bar"><button data-ws="prev" aria-label="Prev"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button class="ws-play" data-ws="play" aria-label="Play"><svg id="wsIcoP" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg id="wsIcoS" viewBox="0 0 24 24" style="display:none"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg></button><button data-ws="next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>`;
  document.body.appendChild(el);
  cv = Q('#wsCv'); ctx = cv.getContext('2d');
  el.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { const q = g.dataset.go.split(',').map(Number); close(); try { window.__fahm.goTo(q[0], q[1], q[2] || 0); } catch (er) { } return; }
    const b = e.target.closest('[data-ws]'), w = e.target.closest('.wsw');
    if (w) { API.pickWord(+w.dataset.i); return; }
    const pk = e.target.closest('[data-pick]'); if (pk) { API.pickWord(+pk.dataset.pick); return; }
    if (!b) return; const a = b.dataset.ws;
    if (a === 'close') close(); else if (a === 'play') API.togglePlay(); else if (a === 'next') step(1); else if (a === 'prev') step(-1); else if (a === 'begin') { API.playAyah(); } else if (a === 'det') { toggleSheet(); } else if (a === 'sx') { hideSheet(); }
  });
  window.addEventListener('resize', () => { if (isOpen) { sizeCv(); } });
}
function sizeCv() {
  const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); const w = Math.max(10, Math.round(r.width * d)), h = Math.max(10, Math.round(r.height * d));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } cv._w = r.width; cv._h = r.height; cv._d = d;
}
function step(d) {
  const { A } = API.cur(), n = A.words.length; let i = idx + d;
  if (i < -1) { API.prevAyah(); return; } if (i > n) { API.nextAyah(); return; }
  API.stopAudio(); set(i);
}
function buildAyah() {
  const { S: S_, A } = API.cur(), st = API.st(), L = S[st.ui] || S.en;
  const wts = A.words.map(w => Math.max(1, API.strip(w.ar).length));
  Q('#wsAy').innerHTML = A.words.map((w, i) => `<button class="wsw" data-i="${i}" style="flex:${wts[i]} 1 auto"><span class="a">${esc(w.ar)}</span><i class="rl"></i><b class="ix">${String(i + 1).padStart(2, '0')}</b><em>${st.ui === 'ur' ? '' : esc(String(w.tl || '').replace(/'/g, '’'))}</em></button>`).join('');
  Q('#wsRef').textContent = `${API.sName(S_)[0]} ${S_.n}:${A.v}`;
  const nn = A.words.length; el.classList.toggle('d1', nn > 9 && nn <= 16); el.classList.toggle('d2', nn > 16 && nn <= 26); el.classList.toggle('d3', nn > 26);
}
function set(i) {
  idx = i; if (!isOpen) return; t0 = performance.now();
  const { A } = API.cur(), st = API.st(), L = S[st.ui] || S.en, n = A.words.length;
  document.querySelectorAll('#wsAy .wsw').forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('seen', i >= 0 && k < i); b.classList.toggle('all', i < 0 || i >= n); });
  const cnt = Q('#wsCnt'), body = Q('#wsBody'); el.classList.toggle('intro', i < 0); el.classList.toggle('outro', i >= n);
  if (i < 0) {
    cnt.textContent = ''; body.innerHTML = `<div class="ws-hint">${esc(L.tap)}</div><button class="ws-begin" data-ws="begin">${esc(L.begin)}</button>`; drawMeta = null; return;
  }
  if (i >= n) {
    const code = st.tl.find(c => A.tr[c]) || 'en', rtl = ['ur', 'urj', 'urm', 'urh', 'urk', 'urq', 'urg', 'urn', 'urz', 'ar', 'fa'].includes(code);
    cnt.textContent = `— ${L.sum}`; body.innerHTML = `<p class="ws-sumt ${rtl ? 'rtl u' : ''}" ${rtl ? 'dir="rtl"' : ''}>${esc(A.tr[code] || '')}</p>`; drawMeta = null; return;
  }
  const d = dataFor(i); drawMeta = d;
  cnt.textContent = `— ${L.word} ${i + 1} ${L.of} ${n}`;
  body.innerHTML = `<div class="ws-m ${d.rtl ? 'u' : ''}" ${d.rtl ? 'dir="rtl"' : ''} data-ws="det">${esc(d.mm)}</div><button class="ws-more" data-ws="det"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg><span>${esc((SH[st.ui] || SH.en).more)}</span></button>`;
  if (sheetOn) fillSheet();
  const ac = Q('#wsAy .wsw.on'); if (ac && ac.scrollIntoView) { try { ac.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { } }
}

/* ---------- details sheet: opens only on tap, transparent glass ---------- */
const SH = {
  ur: { more: 'لفظ کی تفصیل', pos: 'قسمِ کلمہ', root: 'مادّہ (روٹ)', pic: 'مادّے کے حروف', cnt: 'قرآن میں کتنی بار', ex: 'یہی لفظ (اسی اعراب کے ساتھ)', sm: 'یہی حروف (کسی بھی اعراب میں)', rt: 'اسی مادّے کے الفاظ', where: 'کہاں کہاں آیا', langs: 'دوسری زبانوں میں', same: 'اسی آیت میں اسی مادّے کے الفاظ', pos2: 'لفظ نمبر', of: 'از', times: 'بار', first: 'پہلی بار یہاں', note: 'نکتہ', tr: 'تلفظ' },
  ru: { more: 'Lafz ki tafseel', pos: 'Qism-e-kalima', root: 'Root (maadda)', pic: 'Root ke huroof', cnt: 'Quran mein kitni baar', ex: 'Yahi lafz (isi irab ke saath)', sm: 'Yahi huroof (kisi bhi irab mein)', rt: 'Isi root ke alfaaz', where: 'Kahan kahan aaya', langs: 'Doosri zubaanon mein', same: 'Isi ayat mein isi root ke alfaaz', pos2: 'Lafz number', of: 'mein se', times: 'baar', first: 'Pehli baar yahan', note: 'Nukta', tr: 'Talaffuz' },
  en: { more: 'Word details', pos: 'Word type', root: 'Root', pic: 'Root letters', cnt: 'How often in the Quran', ex: 'This exact word (same vowels)', sm: 'These letters (any vowels)', rt: 'Words from this root', where: 'Where it occurs', langs: 'In other languages', same: 'Same root in this ayah', pos2: 'Word', of: 'of', times: 'times', first: 'First appears at', note: 'Insight', tr: 'Pronunciation' }
};
let sheetOn = false;
function sheetEl() { let e = Q('#wsSheet'); if (!e) { e = document.createElement('div'); e.id = 'wsSheet'; e.hidden = true; el.appendChild(e); } return e; }
function fillSheet() {
  if (idx < 0) return; const { S: S_, A } = API.cur(), n = A.words.length; if (idx >= n) return;
  const st = API.st(), u = st.ui, T = SH[u] || SH.en, d = dataFor(idx), W = d.W, nu = x => u === 'ur' ? String(x).replace(/\d/g, k => '۰۱۲۳۴۵۶۷۸۹'[k]) : String(x);
  const tl = String(W.tl || '').replace(/'/g, '’'), gram = d.gram, sn = k => { try { const S0 = FahmData.D.surahs[k - 1]; return u === 'ur' ? S0.ur : S0.en; } catch (e) { return k; } };
  const rootL = W.root ? [...W.root].map(c => `<i class="ar">${esc(c)}</i>`).join('<u></u>') : '';
  const c = window.FahmCnt && FahmCnt.get ? FahmCnt.get(W.ar, W.root) : null;
  const tile = (lab, v) => `<div class="sh-t"><b>${nu(v)}</b><span>${esc(lab)}</span></div>`;
  const stats = c ? `<div class="sh-sec">${esc(T.cnt)}</div><div class="sh-tiles">${tile(T.ex, c.exact)}${c.same !== c.exact ? tile(T.sm, c.same) : ''}${W.root ? tile(T.rt, c.root) : ''}</div>` : '';
  const where = c && c.refs.length ? `<div class="sh-sec">${esc(T.where)}</div><div class="sh-go">${c.refs.slice(0, 24).map(x => { const s1 = Math.floor(x / 1000), v1 = x % 1000; return `<button data-go="${s1 - 1},${v1 - 1},0">${esc(sn(s1))} ${nu(v1)}</button>`; }).join('')}</div>` : '';
  const lang = []; if (W.en) lang.push(['En', W.en]); if (W.ur) lang.push(['اردو', W.ur]); if (W.ru) lang.push(['Ru', W.ru]); if (W.hi) lang.push(['हिं', W.hi]);
  const langs = lang.length ? `<div class="sh-sec">${esc(T.langs)}</div><div class="sh-lg">${lang.map(([k, v]) => `<div><em>${esc(k)}</em><span>${esc(v)}</span></div>`).join('')}</div>` : '';
  const same = A.words.map((w2, k) => ({ w2, k })).filter(o => W.root && o.k !== idx && o.w2.root === W.root);
  const sameH = same.length ? `<div class="sh-sec">${esc(T.same)}</div><div class="sh-same">${same.map(o => `<button class="ar" data-pick="${o.k}">${esc(o.w2.ar)}</button>`).join('')}</div>` : '';
  const chips = `<div class="sh-chips">${gram ? `<span>${esc(gram)}</span>` : ''}<span>${esc(T.pos2)} ${nu(idx + 1)} ${esc(T.of)} ${nu(n)}</span><span>${esc(API.sName(S_)[0])} ${nu(S_.n)}:${nu(A.v)}</span></div>`;
  const note = d.note ? `<div class="sh-note ${d.rtl ? 'u' : ''}" ${d.rtl ? 'dir="rtl"' : ''}><em>${esc(T.note)}</em> ${esc(d.note)}</div>` : '';
  let ij = ''; try { ij = window.FahmIjaz ? FahmIjaz.html(S_.n, A.v, W.ar, u, esc) : ''; } catch (er) { } try { if (window.FahmMiracle) ij += FahmMiracle.html(S_.n, A.v, W.ar, u, esc, W.root); } catch (er) { } try { if (window.FahmEjaz) ij += FahmEjaz.html(S_.n, A.v, W, u, esc); } catch (er) { } try { if (window.FahmTajweed) ij += FahmTajweed.html(A.words, idx, u, esc); } catch (er) { }
  const e = sheetEl();
  e.innerHTML = `<div class="sh-grab" data-ws="sx"></div><button class="sh-x" data-ws="sx" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <div class="sh-head"><div class="sh-ar ar">${esc(W.ar)}</div><div class="sh-tl">${rtlSafe(tl, u)}</div><div class="sh-mm ${d.rtl ? 'u' : ''}" ${d.rtl ? 'dir="rtl"' : ''}>${esc(d.mm)}</div></div>
  ${chips}${ij}${W.root ? `<div class="sh-sec">${esc(T.pic)}</div><div class="sh-root" dir="rtl">${rootL}</div>` : ''}${note}${stats}${langs}${sameH}${where}`;
}
const rtlSafe = (t, u) => u === 'ur' ? '' : esc(t);
function showSheet() { if (!el || idx < 0) return; sheetOn = true; fillSheet(); const e = sheetEl(); e.hidden = false; requestAnimationFrame(() => e.classList.add('on')); e.scrollTop = 0; }
function hideSheet() { sheetOn = false; const e = Q('#wsSheet'); if (e) { e.classList.remove('on'); setTimeout(() => { if (!sheetOn) e.hidden = true; }, 260); } }
function toggleSheet() { sheetOn ? hideSheet() : showSheet(); }
let drawMeta = null;
function frame() {
  raf = requestAnimationFrame(frame); if (!isOpen) return; sizeCv();
  const w = cv._w, h = cv._h, d = cv._d; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h);
  const t = (performance.now() - t0) / 1000;
  if (!drawMeta) { // intro / summary: calm rosette
    const P = { l: ['', '', ''], seed: 99, rtl: false }; try { backdrop(ctx, w, h, t, ease(t * .7), P); } catch (e) { } AR.rosette(ctx, w, h, t + 1, ease(t * .7), P); return;
  }
  const P = { l: drawMeta.labs, seed: drawMeta.seed, rtl: drawMeta.rtl, W: drawMeta.W, g: glossOf(drawMeta.W) };
  try { backdrop(ctx, w, h, t, ease(t / 1.4), P); } catch (e) { }
  drawWord(ctx, w, h, t, drawMeta, P, false);
}
function drawWord(c, w, h, t, d, P, small) {
  const SG = window.FahmSig;
  if (SG && SG.under) { try { SG.under(c, w, h, t, ease(t / 1.4), d, small); } catch (e) { } }
  c.save(); if (d.alt) { c.translate(w, 0); c.scale(-1, 1); MIR = 1; }
  try { (AR[d.m] || AR.rosette)(c, w, h, t, ease(t / 1.4), P); } catch (e) { try { AR.rosette(c, w, h, t, ease(t / 1.4), P); } catch (e2) { } }
  MIR = 0; c.restore();
  if (SG && SG.over) { try { SG.over(c, w, h, t, ease(t / 1.4), d, small); } catch (e) { } }
}
/* story / external: draw a word's unique visual into any canvas (no backdrop) */
function renderWord(c, w, h, t, W, i, words) {
  const st = API.st(), u = st.ui, lem = (window.FAHM_LEM || {})[API.lemKey(W.ar)] || null, m = motifFor(W, lem), mm = API.wordMeaning(W)[0], rtl = u === 'ur', tl = String(W.tl || '').replace(/'/g, '’');
  let alt = 0; if (words && i > 0) { const W0 = words[i - 1]; if (motifFor(W0, (window.FAHM_LEM || {})[API.lemKey(W0.ar)] || null) === m) alt = 1; }
  const d = { W, m, mm, rtl, tl, alt, seed: hash(W.ar + (W.root || '')) };
  const P = { l: [rtl ? W.ar : tl, mm, ''], seed: d.seed, rtl, W, g: glossOf(W) };
  drawWord(c, w, h, t, d, P, true);
  return m;
}
function open(i) {
  buildDom(); isOpen = true; el.hidden = false; document.documentElement.classList.add('ws-on'); buildAyah(); sizeCv(); set(i == null ? -1 : i);
  if (!raf) raf = requestAnimationFrame(frame); updPlay();
}
function close() { if (!isOpen) return; sheetOn = false; const sh = Q('#wsSheet'); if (sh) { sh.hidden = true; sh.classList.remove('on'); } isOpen = false; el.hidden = true; document.documentElement.classList.remove('ws-on'); cancelAnimationFrame(raf); raf = 0; if (API && API.onClose) API.onClose(); }
function updPlay() { if (!el) return; const p = API.isPlaying(); Q('#wsIcoP').style.display = p ? 'none' : ''; Q('#wsIcoS').style.display = p ? '' : 'none'; }

/* ---------- compact word box under the ayah (same line-art, small) ---------- */
function miniInit(canvas) { try { const bx = canvas.parentElement; if (bx && !bx._tap) { bx._tap = 1; bx.addEventListener('click', e => { if (e.target.closest('button')) return; const f = document.getElementById('btnFull'); if (f) f.click(); setTimeout(() => { if (isOpen) showSheet(); }, 350); }); } } catch (er) { } mini = { cv: canvas, ctx: canvas.getContext('2d'), t0: performance.now(), d: null, raf: 0 }; }
function miniSet(i) {
  if (!mini || !API) return; const { A } = API.cur(); if (i < 0 || i >= A.words.length) return; mini.d = dataFor(i); mini.t0 = performance.now();
  if (!mini.raf) { const f = () => { mini.raf = requestAnimationFrame(f); const c = mini.cv; if (!c.offsetParent) return; const r = c.getBoundingClientRect(), dd = Math.min(2, devicePixelRatio || 1), w = Math.round(r.width * dd), h = Math.round(r.height * dd); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } const x = mini.ctx; x.setTransform(dd, 0, 0, dd, 0, 0); x.clearRect(0, 0, r.width, r.height); const t = (performance.now() - mini.t0) / 1000, d = mini.d; if (!d) return; drawWord(x, r.width, r.height, t, d, { l: ['', '', ''], seed: d.seed, rtl: d.rtl, W: d.W, g: glossOf(d.W) }, true);}; mini.raf = requestAnimationFrame(f); }
}
function miniInfo(i) { const d = dataFor(i); return { m: d.m, note: d.note || d.gram, meaning: d.mm, rtl: d.rtl }; }

window.FahmWS = {
  init(api) { API = api; }, open, close, set(i, fromAudio) { if (isOpen) set(i); }, isOpen: () => isOpen, refresh(i) { if (isOpen) { buildAyah(); set(i == null ? -1 : i); } }, updPlay,
  miniInit, miniSet, miniInfo, showSheet, hideSheet, archetypes: AR, motifFor, renderWord, glossOf, curWords() { try { return API.cur().A.words; } catch (e) { return null; } },
  helpers: { glow, path, lab, leader, rgba, ease, lerp, rnd, hash, clamp, dotsArc }
};
})();

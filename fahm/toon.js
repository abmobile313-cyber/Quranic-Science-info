/* Fahm "Toon" — hand-coded 2D cartoon scenes (no video files, ~0 storage).
   Virtual canvas 400x500. Everything is drawn with canvas paths, so colours follow the app palette. */
(function () {
'use strict';
const W = 400, H = 500, TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
const R = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const hx = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };
const PAL = { gold: '#dcab40', cyan: '#33cbe0', maroon: '#7a1a2c', skin: '#f7d3b4', ink: '#4a2a1c' };

/* ---------- sky & celestial ---------- */
const SKY = {
  dawn: ['#f6a47a', '#f9c3b2', '#fde4d8'], day: ['#79c6ee', '#bfe5f6', '#fff3da'], dusk: ['#3b2a6e', '#c4557c', '#ffb87c'],
  night: ['#060f2b', '#13295a', '#2b4c80'], holy: ['#1a0509', '#4c1022', '#c08a2e'], fire: ['#1a0508', '#6c1b1a', '#e57422'],
  cool: ['#8fa6c4', '#c3d0e0', '#eef1f5'], warm: ['#ffb26b', '#ffd69a', '#fff1cf'], storm: ['#2b2a3c', '#5a4a58', '#a8685a']
};
function sky(c, name, h) {
  const s = SKY[name] || SKY.dawn, g = c.createLinearGradient(0, 0, 0, h || H * .8);
  g.addColorStop(0, s[0]); g.addColorStop(.55, s[1]); g.addColorStop(1, s[2]); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function sun(c, t, x, y, r, col) {
  col = col || '#ffe29a';
  let g = c.createRadialGradient(x, y, 0, x, y, r * 4.2); g.addColorStop(0, rgba(col, .75)); g.addColorStop(.35, rgba(col, .28)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
  c.save(); c.translate(x, y); c.rotate(t * .05); c.fillStyle = rgba(col, .13);
  for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); c.beginPath(); c.moveTo(0, 0); c.lineTo(-r * .6, -r * 7); c.lineTo(r * .6, -r * 7); c.closePath(); c.fill(); }
  c.restore();
  c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.fillStyle = '#fff6cf'; c.beginPath(); c.arc(x - r * .15, y - r * .15, r * .78, 0, TAU); c.fill();
}
function moon(c, t, x, y, r) {
  let g = c.createRadialGradient(x, y, 0, x, y, r * 3.4); g.addColorStop(0, 'rgba(255,240,190,.5)'); g.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = g; c.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  c.fillStyle = '#ffecb0'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.arc(x + r * .5, y - r * .12, r * .86, 0, TAU, true); c.fill('evenodd');
}
function stars(c, t, n, ymax, seed) {
  const r = R(seed || 7);
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * ymax, k = .4 + r() * .9, ph = r() * 6, a = .45 + .55 * Math.sin(t * (1 + k) + ph) * .5 + .25; c.fillStyle = `rgba(255,243,200,${clamp(a, .1, 1)})`; star(c, x, y, k * 2.4, 4, 0); }
}
function star(c, x, y, r, n, rot) {
  c.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n - Math.PI / 2, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill();
}
function cloud(c, t, x0, y, s, sp, tint, face) {
  const x = ((x0 + t * sp) % (W + 180) + W + 180) % (W + 180) - 90; c.save(); c.translate(x, y); c.scale(s, s);
  const base = tint || '#ffffff';
  c.fillStyle = rgba(mix(base, '#9a86b8', .35), .5); c.beginPath(); c.ellipse(2, 7, 46, 11, 0, 0, TAU); c.fill();
  c.fillStyle = rgba(base, .96);
  [[-24, 0, 16], [-6, -9, 20], [16, -3, 17], [32, 2, 12], [-34, 4, 10]].forEach(([a, b, r]) => { c.beginPath(); c.arc(a, b, r, 0, TAU); c.fill(); });
  c.fillRect(-34, 0, 66, 12);
  if (face) { c.fillStyle = '#6a4a58'; c.beginPath(); c.ellipse(-8, 1, 2.2, 2.8, 0, 0, TAU); c.ellipse(8, 1, 2.2, 2.8, 0, 0, TAU); c.fill(); c.strokeStyle = '#6a4a58'; c.lineWidth = 1.6; c.beginPath(); c.arc(0, 3, 4, .15 * Math.PI, .85 * Math.PI); c.stroke(); c.fillStyle = 'rgba(255,130,150,.45)'; c.beginPath(); c.arc(-16, 6, 4, 0, TAU); c.arc(16, 6, 4, 0, TAU); c.fill(); }
  c.restore();
}
const CAM = { x: 0, y: 0 };
function hills(c, kind, y0, n, seed, fog) {
  const r = R(seed || 3), P = {
    lav: ['#e6d8f6', '#8e66c4'], dune: ['#f3d49c', '#c58a4c'], meadow: ['#b4dc96', '#3c8a4a'], snow: ['#f6f9fc', '#a9b9d0'], night: ['#27406e', '#0f1c3d'], rock: ['#c9a78a', '#7a5238']
  }[kind] || ['#e6d8f6', '#8e66c4'];
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1 || 1), yb = y0 + i * 44, amp = 14 + i * 3, base = mix(P[0], P[1], f), col = fog ? mix(base, fog, (1 - f) * .55) : base, dx = -CAM.x * (.15 + f * .9);
    c.save(); c.translate(dx, 0);
    const yy = x => yb + Math.sin(x * .011 + i * 1.9) * amp + Math.sin(x * .029 + i * 3) * amp * .38;
    c.fillStyle = col; c.beginPath(); c.moveTo(-40, H); for (let x = -40; x <= W + 40; x += 8) c.lineTo(x, yy(x)); c.lineTo(W + 40, H); c.closePath(); c.fill();
    const g = c.createLinearGradient(0, yb - amp, 0, yb + 40); g.addColorStop(0, rgba('#ffffff', .22 * (1 - f * .5))); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fill();
    if (kind === 'lav') {
      const dark = mix(P[1], '#2a1050', .35 + (1 - f) * .1), mid = mix(P[1], '#c8a8f0', .35), lite = mix(P[1], '#e0c8ff', .55), sway = Math.sin(performance.now() / 1400 + i) * 1.2;
      const cnt = 90 + i * 40; for (let k = 0; k < cnt; k++) {
        const x = -30 + r() * (W + 60), y = yy(x) + 2 + r() * (30 + i * 10), sz = .7 + f * 1.8 + i * .35, col2 = r() < .3 ? lite : (r() < .55 ? mid : dark), lean = (r() - .5) * .5 + Math.sin(x * .05 + sway) * .1;
        c.strokeStyle = 'rgba(70,110,60,.45)'; c.lineWidth = .6 + sz * .25; c.beginPath(); c.moveTo(x, y + sz * 5); c.lineTo(x + lean * 3, y); c.stroke();
        c.fillStyle = col2; c.globalAlpha = .85; c.beginPath(); c.ellipse(x + lean * 3, y - sz * 2.2, sz * .9, sz * 3.1, lean, 0, TAU); c.fill(); c.globalAlpha = 1;
      }
    }
    if (kind === 'meadow') { for (let k = 0; k < 20; k++) { const x = r() * W, y = yy(x) + 6 + r() * 30; c.fillStyle = ['#fff', '#ffd9e8', '#fff1a8'][k % 3]; c.beginPath(); c.arc(x, y, 1.8, 0, TAU); c.fill(); } }
    c.restore();
  }
}
function mist(c, t, y, a) { const g = c.createLinearGradient(0, y - 40, 0, y + 40); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, `rgba(255,240,235,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, y - 40, W, 80); }
function rays(c, t, x, y, col, a) {
  c.save(); c.translate(x, y); for (let i = 0; i < 7; i++) { const ang = Math.PI * .55 + i * .16 + Math.sin(t * .4 + i) * .02; const g = c.createLinearGradient(0, 0, Math.cos(ang) * 520, Math.sin(ang) * 520); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(ang - .035) * 560, Math.sin(ang - .035) * 560); c.lineTo(Math.cos(ang + .035) * 560, Math.sin(ang + .035) * 560); c.closePath(); c.fill(); } c.restore();
}
function sparkles(c, t, n, col2, seed, region) {
  const r = R(seed || 11), rg = region || [0, 0, W, H];
  for (let i = 0; i < n; i++) {
    const bx = rg[0] + r() * rg[2], by = rg[1] + r() * rg[3], sp = .15 + r() * .25, ph = r() * 9, k = (t * sp + ph) % 1;
    const x = bx + Math.sin(t * .8 + ph) * 8, y = by - k * 60, a = Math.sin(k * Math.PI), col = i % 3 === 0 ? (col2 || PAL.cyan) : '#ffe08a';
    c.fillStyle = rgba(col, a * .95); star(c, x, y, 1.6 + r() * 2.6, 4, t * .5 + ph); c.fillStyle = rgba(col, a * .25); c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill();
  }
}

/* ---------- props ---------- */
function lantern(c, t, x, y, s, col) {
  col = col || '#ffd36a'; c.save(); c.translate(x, y); c.scale(s, s);
  const pulse = .8 + .2 * Math.sin(t * 3 + x);
  let g = c.createRadialGradient(0, -26, 0, 0, -26, 54); g.addColorStop(0, rgba(col, .6 * pulse)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-60, -90, 120, 120);
  c.fillStyle = '#3b2230'; c.beginPath(); c.roundRect(-11, -4, 22, 5, 2); c.fill();
  c.fillStyle = '#4a2a3a'; c.beginPath(); c.roundRect(-14, -44, 28, 40, 6); c.fill();
  c.fillStyle = mix(col, '#fff4c8', .3); c.beginPath(); c.moveTo(-8, -8); c.lineTo(-8, -32); c.quadraticCurveTo(0, -44, 8, -32); c.lineTo(8, -8); c.closePath(); c.fill();
  c.fillStyle = '#e0ad45'; c.beginPath(); c.moveTo(-17, -44); c.lineTo(17, -44); c.lineTo(9, -54); c.lineTo(-9, -54); c.closePath(); c.fill();
  c.strokeStyle = '#e0ad45'; c.lineWidth = 2; c.beginPath(); c.arc(0, -59, 5, 0, TAU); c.stroke(); c.restore();
}
function mosque(c, t, x, y, s, wall, dome, glow) {
  wall = wall || '#e9d6c4'; dome = dome || '#6f8fc4'; glow = glow || '#ffd36a'; c.save(); c.translate(x, y); c.scale(s, s);
  const sh = mix(wall, '#6a4a6a', .28);
  const mn = (mx, hgt) => { c.fillStyle = wall; c.fillRect(mx - 7, -hgt, 14, hgt); c.fillStyle = sh; c.fillRect(mx + 2, -hgt, 5, hgt); c.fillStyle = dome; c.beginPath(); c.moveTo(mx - 10, -hgt); c.quadraticCurveTo(mx, -hgt - 34, mx + 10, -hgt); c.closePath(); c.fill(); c.fillStyle = '#e8bd55'; c.fillRect(mx - 1, -hgt - 40, 2, 10); c.beginPath(); c.arc(mx, -hgt - 41, 3, 0, TAU); c.fill(); c.fillStyle = glow; c.beginPath(); c.roundRect(mx - 2.5, -hgt + 14, 5, 9, 2.5); c.fill(); };
  mn(-62, 96); mn(62, 96);
  c.fillStyle = wall; c.fillRect(-48, -48, 96, 48); c.fillStyle = sh; c.fillRect(24, -48, 24, 48);
  c.fillStyle = dome; c.beginPath(); c.moveTo(-34, -48); c.bezierCurveTo(-36, -96, 36, -96, 34, -48); c.closePath(); c.fill();
  c.fillStyle = mix(dome, '#ffffff', .22); c.beginPath(); c.moveTo(-34, -48); c.bezierCurveTo(-36, -96, -4, -94, -4, -78); c.bezierCurveTo(-12, -70, -26, -62, -34, -48); c.fill();
  c.fillStyle = '#e8bd55'; c.fillRect(-1.2, -112, 2.4, 20); c.beginPath(); c.arc(0, -108, 5, 0, TAU); c.fill(); c.fillStyle = dome; c.beginPath(); c.arc(1.8, -108, 4, 0, TAU); c.fill();
  [[-30, -28], [0, -28], [30, -28]].forEach(([a, b], i) => { c.fillStyle = glow; c.beginPath(); c.moveTo(a - 7, b + 20); c.lineTo(a - 7, b); c.quadraticCurveTo(a, b - 12, a + 7, b); c.lineTo(a + 7, b + 20); c.fill(); });
  c.restore();
}
function kaaba(c, t, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  let g = c.createRadialGradient(0, -40, 0, 0, -40, 120); g.addColorStop(0, 'rgba(255,225,140,.35)'); g.addColorStop(1, 'rgba(255,225,140,0)'); c.fillStyle = g; c.fillRect(-130, -170, 260, 220);
  c.fillStyle = '#26202c'; c.beginPath(); c.moveTo(-46, 0); c.lineTo(-46, -78); c.lineTo(22, -78); c.lineTo(22, 0); c.closePath(); c.fill();
  c.fillStyle = '#3a3340'; c.beginPath(); c.moveTo(22, 0); c.lineTo(22, -78); c.lineTo(50, -92); c.lineTo(50, -12); c.closePath(); c.fill();
  c.fillStyle = '#4a3d52'; c.beginPath(); c.moveTo(-46, -78); c.lineTo(-24, -92); c.lineTo(50, -92); c.lineTo(22, -78); c.closePath(); c.fill();
  c.fillStyle = '#e0b04a'; c.fillRect(-46, -62, 68, 6); c.beginPath(); c.moveTo(22, -62); c.lineTo(50, -76); c.lineTo(50, -70); c.lineTo(22, -56); c.fill();
  c.fillStyle = '#e8bd55'; c.beginPath(); c.roundRect(-30, -42, 22, 42, [8, 8, 0, 0]); c.fill(); c.fillStyle = '#9a6b24'; c.beginPath(); c.roundRect(-26, -38, 14, 38, [6, 6, 0, 0]); c.fill();
  c.restore();
}
function palm(c, t, x, y, s, sway) {
  c.save(); c.translate(x, y); c.scale(s, s); const a = Math.sin(t * 1.2 + x) * (sway || .03);
  c.strokeStyle = '#8a5a34'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(10, -50, 4 + a * 40, -100); c.stroke();
  c.translate(4 + a * 40, -100); c.fillStyle = '#4f9a52';
  for (let i = 0; i < 6; i++) { c.save(); c.rotate(-1.35 + i * .54 + a); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(24, -26, 58, -10); c.quadraticCurveTo(26, -12, 0, 0); c.fill(); c.restore(); }
  c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(-4, 4, 4, 0, TAU); c.arc(5, 5, 4, 0, TAU); c.fill(); c.restore();
}
function mat(c, x, y, w, col1, col2) {
  col1 = col1 || '#7a1a2c'; col2 = col2 || '#dcab40'; c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(40,10,30,.28)'; c.beginPath(); c.ellipse(0, 6, w * .56, 12, 0, 0, TAU); c.fill();
  c.fillStyle = col1; c.beginPath(); c.moveTo(-w / 2 + 14, -22); c.lineTo(w / 2 - 14, -22); c.lineTo(w / 2 + 8, 6); c.lineTo(-w / 2 - 8, 6); c.closePath(); c.fill();
  c.strokeStyle = col2; c.lineWidth = 2; c.stroke();
  c.fillStyle = rgba(col2, .55); c.beginPath(); c.moveTo(-w / 6, 0); c.lineTo(-w / 6, -10); c.quadraticCurveTo(0, -22, w / 6, -10); c.lineTo(w / 6, 0); c.closePath(); c.fill();
  c.fillStyle = col2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * w / 8, 0, 1.4, 0, TAU); c.fill(); }
  c.restore();
}
function rehal(c, t, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  let g = c.createRadialGradient(0, -14, 0, 0, -14, 46); g.addColorStop(0, 'rgba(255,225,140,.55)'); g.addColorStop(1, 'rgba(255,225,140,0)'); c.fillStyle = g; c.fillRect(-50, -60, 100, 80);
  c.fillStyle = '#7a4a2a'; c.beginPath(); c.moveTo(-18, 0); c.lineTo(0, -14); c.lineTo(18, 0); c.lineTo(10, 0); c.lineTo(0, -8); c.lineTo(-10, 0); c.fill();
  c.fillStyle = '#fff7e2'; c.beginPath(); c.moveTo(0, -26); c.lineTo(-26, -20); c.lineTo(-26, -2); c.lineTo(0, -8); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, -26); c.lineTo(26, -20); c.lineTo(26, -2); c.lineTo(0, -8); c.closePath(); c.fillStyle = '#fffbee'; c.fill();
  c.strokeStyle = '#d9b25a'; c.lineWidth = 1.2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-22, -17 + i * 4); c.lineTo(-4, -21 + i * 4 + 4); c.moveTo(22, -17 + i * 4); c.lineTo(4, -21 + i * 4 + 4); c.stroke(); }
  c.restore();
}

/* ---------- cute kids (soft-shaded, glossy eyes, rim/key light) ---------- */
const KC = document.createElement('canvas'); KC.width = 450; KC.height = 570; const KX = KC.getContext('2d');
function rg(c, x, y, r0, x2, y2, r1, stops) { const g = c.createRadialGradient(x, y, r0, x2, y2, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function lg(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function eye(c, x, y, blink, lx, ly, side) {
  if (blink < .5) { c.strokeStyle = '#3a1c12'; c.lineWidth = 2.4; c.lineCap = 'round'; c.beginPath(); c.arc(x, y - 1, 5.5, .15 * Math.PI, .85 * Math.PI); c.stroke(); return; }
  c.fillStyle = '#fffaf4'; c.beginPath(); c.ellipse(x, y, 6.6, 7.6, 0, 0, TAU); c.fill();
  c.fillStyle = 'rgba(120,70,60,.18)'; c.beginPath(); c.ellipse(x, y - 4.5, 6.6, 3.4, 0, 0, TAU); c.fill();
  const ix = x + lx, iy = y + ly + .6;
  c.fillStyle = rg(c, ix - 1, iy - 1.5, .5, ix, iy, 5.4, [[0, '#c98a4c'], [.55, '#7a421f'], [1, '#2a120a']]); c.beginPath(); c.arc(ix, iy, 5.2, 0, TAU); c.fill();
  c.fillStyle = '#140806'; c.beginPath(); c.arc(ix, iy, 2.5, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,.96)'; c.beginPath(); c.arc(ix - 2, iy - 2.2, 2.1, 0, TAU); c.fill(); c.beginPath(); c.arc(ix + 2, iy + 2.4, 1, 0, TAU); c.fill();
  c.strokeStyle = '#2a1410'; c.lineWidth = 2.1; c.lineCap = 'round'; c.beginPath(); c.arc(x, y + .5, 7, 1.12 * Math.PI, 1.88 * Math.PI); c.stroke();
  c.lineWidth = 1.3; for (let i = 0; i < 3; i++) { const a = (side > 0 ? 1.78 : 1.22) + (side > 0 ? 1 : -1) * i * .07; c.beginPath(); c.moveTo(x + Math.cos(a * Math.PI) * 6.6, y + .5 + Math.sin(a * Math.PI) * 6.6); c.lineTo(x + Math.cos(a * Math.PI) * 9.4 + side * 1, y + .5 + Math.sin(a * Math.PI) * 9.4 - 1); c.stroke(); }
}
function kidRaw(c, t, o) {
  const kind = o.kind || 'girl', pose = o.pose || 'stand', robe = o.robe || '#f4eefc', hij = o.hij || '#a98fdc', skin = o.skin || PAL.skin, ph = o.seed || 0;
  const sitting = pose === 'read' || pose === 'dua' || pose === 'sit', walk = pose === 'walk';
  const breath = 1 + Math.sin(t * 2.1 + ph) * .012, sw = walk ? Math.sin(t * 6 + ph) : Math.sin(t * 1.3 + ph) * .25;
  const hy = sitting ? -70 : -86, tilt = o.look === 'up' ? -.1 : Math.sin(t * .9 + ph) * .03;
  const blink = (t * .33 + ph * .13) % 1 > .965 ? .1 : 1;
  const dark = mix(robe, '#4a2a6a', .26), light = mix(robe, '#ffffff', .4), sh = sitting ? -42 : -58, hem = sitting ? -14 : -6;
  c.save(); c.scale(1, breath);
  /* legs / seat */
  if (sitting) { c.fillStyle = dark; c.beginPath(); c.ellipse(0, -9, 40, 13, 0, 0, TAU); c.fill(); c.fillStyle = lg(c, 0, -26, 0, 0, [[0, light], [1, robe]]); c.beginPath(); c.ellipse(0, -14, 37, 11, 0, 0, TAU); c.fill(); c.fillStyle = rg(c, -32, -10, 1, -31, -8, 7, [[0, '#ffe0c4'], [1, skin]]); c.beginPath(); c.ellipse(-33, -8, 7, 5, 0, 0, TAU); c.ellipse(33, -8, 7, 5, 0, 0, TAU); c.fill(); }
  else { const l = sw * 6; c.fillStyle = rg(c, -9, -6, 1, -9, -3, 10, [[0, '#7a5068'], [1, '#3a2030']]); c.beginPath(); c.ellipse(-9 + l, -3, 10, 5.5, 0, 0, TAU); c.ellipse(9 - l, -3, 10, 5.5, 0, 0, TAU); c.fill(); }
  /* body */
  c.fillStyle = lg(c, -26, 0, 26, 0, [[0, light], [.45, robe], [1, dark]]); c.beginPath(); c.moveTo(-16, sh); c.quadraticCurveTo(0, sh - 7, 16, sh); c.lineTo(sitting ? 28 : 27, hem); c.quadraticCurveTo(0, hem + 7, sitting ? -28 : -27, hem); c.closePath(); c.fill();
  c.strokeStyle = rgba(dark, .55); c.lineWidth = 1.6; c.lineCap = 'round'; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 7, sh + 14); c.quadraticCurveTo(i * 10 + 2, (sh + hem) / 2, i * 14, hem - 2); c.stroke(); }
  if (kind === 'boy') { c.fillStyle = '#e6dcf2'; c.beginPath(); c.moveTo(-9, sh); c.lineTo(0, sh + 9); c.lineTo(9, sh); c.lineTo(5, sh - 2); c.lineTo(0, sh + 3); c.lineTo(-5, sh - 2); c.fill(); c.fillStyle = '#d8b25a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(0, sh + 12 + i * 8, 1.5, 0, TAU); c.fill(); } }
  else { c.strokeStyle = rgba(PAL.gold, .95); c.lineWidth = 2.4; c.beginPath(); c.moveTo(-26, hem - 3); c.quadraticCurveTo(0, hem + 4, 26, hem - 3); c.stroke(); c.fillStyle = rgba(PAL.gold, .9); for (let i = -2; i <= 2; i++) { c.beginPath(); c.arc(i * 10, hem - 1 + Math.abs(i) * .4, 1.3, 0, TAU); c.fill(); } }
  const arm = (side, hx, hy2) => {
    const sx = side * 16, sy = sh + 3, mx = sx + (hx - sx) * .35 + side * 5, my = (sy + hy2) / 2 + 5;
    c.lineCap = 'round'; c.strokeStyle = dark; c.lineWidth = 12; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(mx, my, hx, hy2); c.stroke();
    c.strokeStyle = lg(c, sx - 6, sy, sx + 6, sy, [[0, light], [1, robe]]); c.lineWidth = 10; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(mx, my, hx, hy2); c.stroke();
    c.fillStyle = rg(c, hx - 1.5, hy2 - 1.5, .5, hx, hy2, 6.4, [[0, '#ffe6cf'], [1, skin]]); c.beginPath(); c.arc(hx, hy2, 5.6, 0, TAU); c.fill();
  };
  if (pose === 'read') { arm(-1, -15, -27); arm(1, 15, -27); }
  else if (pose === 'dua') { const up = Math.sin(t * 1.4 + ph) * 1.5; arm(-1, -9, -48 + up); arm(1, 9, -48 + up); c.fillStyle = rg(c, 0, -52 + up, 1, 0, -50 + up, 11, [[0, '#ffe6cf'], [1, skin]]); c.beginPath(); c.ellipse(-8, -52 + up, 7, 4, -.5, 0, TAU); c.ellipse(8, -52 + up, 7, 4, .5, 0, TAU); c.fill(); }
  else if (pose === 'fold') { arm(-1, 3, -44); arm(1, -3, -46); }
  else if (pose === 'wave') { arm(-1, -25, -30); arm(1, 31, -82 + Math.sin(t * 7 + ph) * 5); }
  else if (pose === 'hold') { arm(-1, -23, -36); arm(1, 26, -34); }
  else if (walk) { arm(-1, -25 + sw * 4, -32 - sw * 3); arm(1, 25 - sw * 4, -32 + sw * 3); }
  else { arm(-1, -27, -30 + sw * 2); arm(1, 27, -30 - sw * 2); }
  /* head */
  c.save(); c.translate(0, hy); c.rotate(tilt); c.translate(0, -hy);
  if (kind === 'girl') {
    c.fillStyle = lg(c, -36, hy - 30, 36, hy + 50, [[0, mix(hij, '#ffffff', .22)], [.5, hij], [1, mix(hij, '#2a1040', .4)]]); c.beginPath(); c.ellipse(0, hy + 2, 36, 37, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, -34, hy, 34, hy + 52, [[0, mix(hij, '#ffffff', .1)], [.55, mix(hij, '#40285a', .12)], [1, mix(hij, '#1a0a30', .5)]]); c.beginPath(); c.moveTo(-35, hy + 8); c.quadraticCurveTo(-45, hy + 42, -22, hy + 56); c.lineTo(22, hy + 56); c.quadraticCurveTo(45, hy + 42, 35, hy + 8); c.closePath(); c.fill();
    c.strokeStyle = rgba(mix(hij, '#1a0a30', .55), .5); c.lineWidth = 1.6; c.beginPath(); c.moveTo(-24, hy + 28); c.quadraticCurveTo(-26, hy + 44, -14, hy + 52); c.moveTo(24, hy + 28); c.quadraticCurveTo(28, hy + 44, 16, hy + 52); c.moveTo(0, hy + 40); c.quadraticCurveTo(2, hy + 48, 0, hy + 55); c.stroke();
    c.fillStyle = rgba(mix(hij, '#ffffff', .6), .35); c.beginPath(); c.ellipse(-14, hy - 22, 12, 5, -.5, 0, TAU); c.fill();
    c.fillStyle = rg(c, -5, hy - 2, 2, 0, hy + 6, 30, [[0, '#ffe8d2'], [.6, skin], [1, '#e8b48e']]); c.beginPath(); c.ellipse(0, hy + 6, 26.5, 25.5, 0, 0, TAU); c.fill();
    c.strokeStyle = mix(hij, '#ffffff', .3); c.lineWidth = 5.5; c.beginPath(); c.ellipse(0, hy + 6, 28, 27, 0, Math.PI * 1.04, Math.PI * 1.96); c.stroke();
    c.fillStyle = 'rgba(70,30,60,.22)'; c.beginPath(); c.ellipse(0, hy - 18, 26, 6, 0, 0, Math.PI); c.fill();
  } else {
    c.fillStyle = skin; c.beginPath(); c.arc(-27, hy + 7, 5.5, 0, TAU); c.arc(27, hy + 7, 5.5, 0, TAU); c.fill();
    c.fillStyle = '#241622'; c.beginPath(); c.ellipse(0, hy + 1, 29, 28, 0, 0, TAU); c.fill();
    c.fillStyle = rg(c, -5, hy, 2, 0, hy + 8, 30, [[0, '#ffe8d2'], [.6, skin], [1, '#e8b48e']]); c.beginPath(); c.ellipse(0, hy + 8, 26, 24, 0, 0, TAU); c.fill();
    c.fillStyle = '#241622'; c.beginPath(); c.moveTo(-23, hy - 5); c.quadraticCurveTo(-8, hy - 1, 0, hy - 13); c.quadraticCurveTo(10, hy - 1, 23, hy - 5); c.lineTo(23, hy - 18); c.lineTo(-23, hy - 18); c.closePath(); c.fill();
    c.fillStyle = lg(c, -28, hy - 40, 28, hy - 8, [[0, '#ffffff'], [1, '#e6dcf2']]); c.beginPath(); c.moveTo(-28, hy - 9); c.quadraticCurveTo(-25, hy - 42, 0, hy - 42); c.quadraticCurveTo(25, hy - 42, 28, hy - 9); c.quadraticCurveTo(0, hy - 15, -28, hy - 9); c.fill();
    c.strokeStyle = '#cdbfe0'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-27, hy - 12); c.quadraticCurveTo(0, hy - 17, 27, hy - 12); c.stroke(); for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 8, hy - 38); c.lineTo(i * 6.4, hy - 15); c.stroke(); }
  }
  const lx = o.look === 'up' ? 0 : (o.look === 'side' ? 1.5 : 0), ly = o.look === 'up' ? -1.6 : .3;
  eye(c, -11, hy + 9, blink, lx, ly, -1); eye(c, 11, hy + 9, blink, lx, ly, 1);
  c.strokeStyle = '#6a3a2a'; c.lineWidth = 1.8; c.lineCap = 'round'; const br = o.look === 'up' ? -2 : 0; c.beginPath(); c.arc(-11, hy + 1 + br, 7, 1.15 * Math.PI, 1.8 * Math.PI); c.stroke(); c.beginPath(); c.arc(11, hy + 1 + br, 7, 1.2 * Math.PI, 1.85 * Math.PI); c.stroke();
  c.strokeStyle = 'rgba(160,90,70,.55)'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, hy + 14, 2, .2 * Math.PI, .9 * Math.PI); c.stroke();
  c.fillStyle = rg(c, -16, hy + 18, 0, -16, hy + 18, 8, [[0, 'rgba(255,110,120,.5)'], [1, 'rgba(255,110,120,0)']]); c.fillRect(-26, hy + 8, 20, 20); c.fillStyle = rg(c, 16, hy + 18, 0, 16, hy + 18, 8, [[0, 'rgba(255,110,120,.5)'], [1, 'rgba(255,110,120,0)']]); c.fillRect(6, hy + 8, 20, 20);
  if (o.face === 'o') { c.fillStyle = '#9c3b3b'; c.beginPath(); c.ellipse(0, hy + 21, 3, 3.6, 0, 0, TAU); c.fill(); }
  else { c.fillStyle = '#b0453f'; c.beginPath(); c.moveTo(-5.5, hy + 18.5); c.quadraticCurveTo(0, hy + 27, 5.5, hy + 18.5); c.quadraticCurveTo(0, hy + 21, -5.5, hy + 18.5); c.fill(); c.strokeStyle = '#8a3a30'; c.lineWidth = 1.3; c.beginPath(); c.arc(0, hy + 16, 6, .15 * Math.PI, .85 * Math.PI); c.stroke(); }
  c.restore(); c.restore();
}
function kid(c, t, o) {
  const s = o.s || 1, ph = o.seed || 0, walk = o.pose === 'walk', bob = walk ? -Math.abs(Math.sin(t * 6 + ph)) * 3 : 0, sitting = o.pose === 'read' || o.pose === 'dua' || o.pose === 'sit';
  KX.setTransform(1, 0, 0, 1, 0, 0); KX.clearRect(0, 0, 450, 570); KX.globalCompositeOperation = 'source-over'; KX.setTransform(3, 0, 0, 3, 225, 540);
  kidRaw(KX, t, o);
  /* key light (from the sun side), ambient occlusion and rim */
  const L = o.light == null ? 1 : o.light; KX.setTransform(3, 0, 0, 3, 225, 540); KX.globalCompositeOperation = 'source-atop';
  KX.fillStyle = lg(KX, -40 * L, -150, 40 * L, 0, [[0, 'rgba(255,224,170,.26)'], [.5, 'rgba(255,224,170,0)'], [1, 'rgba(60,30,100,.3)']]); KX.fillRect(-75, -180, 150, 190);
  KX.fillStyle = lg(KX, 0, -30, 0, 4, [[0, 'rgba(40,10,50,0)'], [1, 'rgba(40,10,50,.28)']]); KX.fillRect(-75, -30, 150, 40);
  KX.globalCompositeOperation = 'source-over';
  c.save(); c.translate(o.x, o.y + bob); c.scale(s * (o.flip || 1), s);
  c.fillStyle = rg(c, 0, 0, 2, 0, 0, sitting ? 48 : 30, [[0, 'rgba(30,8,40,.38)'], [1, 'rgba(30,8,40,0)']]); c.beginPath(); c.ellipse(0, 1, sitting ? 48 : 30, sitting ? 11 : 8, 0, 0, TAU); c.fill();
  c.drawImage(KC, -75, -180, 150, 190); c.restore();
}

/* ---------- camel ---------- */
function camel(c, t, x, y, s, dir, seed, load) {
  const ph = seed || 0, sp = Math.sin(t * 4 + ph), bob = Math.abs(Math.sin(t * 4 + ph)) * -2.5;
  c.save(); c.translate(x, y); c.scale(s * (dir || 1), s);
  c.fillStyle = 'rgba(60,30,20,.2)'; c.beginPath(); c.ellipse(4, 1, 52, 7, 0, 0, TAU); c.fill();
  c.translate(0, bob); const body = '#e9b873', dk = '#cf9558';
  const leg = (lx, a, back) => { c.strokeStyle = back ? dk : body; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(lx, -34); c.lineTo(lx + a * 8, -16); c.lineTo(lx + a * 12 - 1, 0 - Math.max(0, -a) * 3); c.stroke(); c.fillStyle = '#7a4a2a'; c.beginPath(); c.ellipse(lx + a * 12 + 1, 1 - Math.max(0, -a) * 3, 6, 3, 0, 0, TAU); c.fill(); };
  leg(-26, -sp, 1); leg(22, sp, 1);
  c.fillStyle = lg(c, 0, -70, 0, -20, [[0, '#f6cc8e'], [.6, body], [1, '#c98a50']]); c.beginPath(); c.ellipse(0, -44, 44, 24, 0, 0, TAU); c.fill();
  c.fillStyle = body; c.beginPath(); c.ellipse(-8, -66, 15, 17, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(16, -62, 13, 14, 0, 0, TAU); c.fill();
  c.fillStyle = rgba(dk, .35); c.beginPath(); c.ellipse(4, -30, 40, 11, 0, 0, TAU); c.fill();
  /* blanket */
  c.fillStyle = '#7a1a2c'; c.beginPath(); c.moveTo(-26, -66); c.quadraticCurveTo(0, -74, 24, -64); c.lineTo(28, -30); c.lineTo(-30, -30); c.closePath(); c.fill();
  c.fillStyle = '#dcab40'; c.fillRect(-29, -40, 57, 4); for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-24 + i * 10, -36); c.lineTo(-19 + i * 10, -32); c.lineTo(-14 + i * 10, -36); c.fill(); }
  if (load) { c.fillStyle = '#33a9b8'; c.beginPath(); c.roundRect(-16, -90, 32, 20, 8); c.fill(); c.fillStyle = '#e8bd55'; c.fillRect(-16, -82, 32, 3); }
  leg(-14, sp, 0); leg(32, -sp, 0);
  /* neck + head */
  c.strokeStyle = body; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(38, -52); c.quadraticCurveTo(58, -66, 56, -88); c.stroke();
  c.fillStyle = body; c.beginPath(); c.ellipse(60, -94, 16, 12, -.2, 0, TAU); c.fill(); c.beginPath(); c.ellipse(72, -90, 9, 8, 0, 0, TAU); c.fill();
  c.fillStyle = dk; c.beginPath(); c.ellipse(53, -104, 4, 6, -.4, 0, TAU); c.fill();
  c.fillStyle = '#fffaf0'; c.beginPath(); c.ellipse(60, -96, 4.6, 5.2, 0, 0, TAU); c.fill(); c.fillStyle = rg(c, 60, -96, .5, 60.5, -95.5, 3.8, [[0, '#a86a3a'], [1, '#2a120a']]); c.beginPath(); c.arc(60.5, -95.8, 3.6, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(59, -97.6, 1.4, 0, TAU); c.fill(); c.strokeStyle = '#3a1c12'; c.lineWidth = 1.2; c.beginPath(); c.arc(60, -95.6, 5, 1.15 * Math.PI, 1.85 * Math.PI); c.stroke();
  c.fillStyle = 'rgba(255,120,130,.4)'; c.beginPath(); c.ellipse(66, -86, 3.6, 2.4, 0, 0, TAU); c.fill();
  c.strokeStyle = '#8a4a3a'; c.lineWidth = 1.4; c.beginPath(); c.arc(74, -88, 3, .1 * Math.PI, .9 * Math.PI); c.stroke();
  c.strokeStyle = body; c.lineWidth = 5; c.beginPath(); c.moveTo(-42, -50); c.quadraticCurveTo(-52, -40, -48, -26); c.stroke();
  c.restore();
}

/* ---------- scene helpers ---------- */
function ground(c, col, y) { c.fillStyle = col; c.fillRect(0, y, W, H - y); }
function vignette(c) { const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .78); g.addColorStop(0, 'rgba(20,6,20,0)'); g.addColorStop(1, 'rgba(20,6,20,.34)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function grain(c, t) { const r = R(Math.floor(t * 8) + 5); c.fillStyle = 'rgba(255,255,255,.035)'; for (let i = 0; i < 40; i++) c.fillRect(r() * W, r() * H, 1.4, 1.4); }

/* ---------- scenes ---------- */
const SC = {};
/* 1:5  "Iyyaka na'budu" — we worship only You (children at dawn in a lavender field) */
SC['1:5'] = (c, t) => {
  blurred(c, 1.3, o => {
    sky(o, 'dawn'); sun(o, t, 258, 222, 26, '#ffe2a2');
    cloud(o, t, 40, 72, 1.0, 5, '#fff4ee', true); cloud(o, t, 250, 120, .8, 3.5, '#ffe6e0'); cloud(o, t, 340, 52, .6, 4, '#fff');
    mist(o, t, 250, .35); mosque(o, t, 96 - CAM.x * .1, 262, .66, '#f1d9d2', '#8a74c4', '#ffd36a');
    hills(o, 'lav', 238, 3, 5, '#f4c4bc');
  });
  hills(c, 'lav', 238 + 88, 2, 8); mist(c, t, 330, .2);
  rays(c, t, 258, 222, '#fff0b0', .17);
  mat(c, 108 - CAM.x * .6, 448, 190, '#7a1a2c', '#dcab40'); mat(c, 292 - CAM.x * .6, 452, 170, '#2a6f8c', '#dcab40');
  kid(c, t, { x: 108 - CAM.x * .6, y: 444, s: 1.5, kind: 'girl', pose: 'read', robe: '#fff6e6', hij: '#a02a48', look: 'side', seed: 1, light: 1 });
  rehal(c, t, 108 - CAM.x * .6, 450, 1.7);
  kid(c, t, { x: 292 - CAM.x * .6, y: 448, s: 1.4, kind: 'boy', pose: 'dua', robe: '#fff8ea', seed: 2, look: 'up', light: 1 });
  lantern(c, t, 200 - CAM.x * .8, 468, 1.1, '#ffd36a'); lantern(c, t, 28 - CAM.x * .8, 478, .8, '#7fe3f0');
  sparkles(c, t, 34, PAL.cyan, 3, [0, 180, W, 300]);
  blurred(c, 4, o => { fgBokeh(o, t, 9, 5, ['#ffe08a', '#e8c9ff', '#ffb0c8']); lavFg(o, t); });
  vignette(c); grain(c, t);
};
function lavFg(c, t) { const r = R(31); for (let i = 0; i < 16; i++) { const x = (i < 8 ? r() * 70 : W - r() * 70), y = 440 + r() * 70, h = 60 + r() * 60, lean = (x < W / 2 ? 1 : -1) * (.2 + r() * .3); c.save(); c.translate(x - CAM.x * 1.6, y + 40); c.rotate(lean + Math.sin(t + i) * .03); c.strokeStyle = '#4c7a46'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -h); c.stroke(); c.fillStyle = i % 2 ? '#a07ad8' : '#7a52b4'; for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse((k % 2 ? 2 : -2), -h + k * 6, 4, 6, 0, 0, TAU); c.fill(); } c.restore(); } }
/* 106:2  winter and summer caravans */
SC['106:2'] = (c, t) => {
  const split = W / 2 + Math.sin(t * .6) * 4;
  blurred(c, 1.2, o => {
    sky(o, 'warm'); o.save(); o.beginPath(); o.rect(0, 0, split, H); o.clip(); sky(o, 'cool'); o.restore();
    moon(o, t, 60, 62, 20); cloud(o, t, 90, 160, .9, 4, '#e7edf6'); cloud(o, t, 180, 110, .7, 3, '#dfe7f2');
    o.save(); o.beginPath(); o.rect(split, 0, W, H); o.clip(); sun(o, t, 320, 92, 24, '#ffd37a'); o.restore();
    hills(o, 'dune', 250, 3, 9, '#ffe2c0'); o.save(); o.beginPath(); o.rect(0, 0, split, H); o.clip(); hills(o, 'snow', 250, 3, 9, '#dfe8f4'); o.restore();
  });
  hills(c, 'dune', 250 + 88, 2, 12); c.save(); c.beginPath(); c.rect(0, 0, split, H); c.clip(); hills(c, 'snow', 250 + 88, 2, 12); c.restore();
  const r = R(4); c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 40; i++) { const k = (t * (.12 + r() * .1) + r()) % 1, x = r() * split + Math.sin(t + i) * 6, y = k * 330; c.beginPath(); c.arc(x, y, 1.4 + r() * 1.6, 0, TAU); c.fill(); }
  c.fillStyle = `rgba(255,220,150,${.18 + Math.sin(t * 3) * .04})`; c.fillRect(split, 280, W - split, 50);
  const off = (t * 22) % 140;
  for (let i = -1; i < 4; i++) { const x = -60 + i * 140 + off; camel(c, t, x, 400 + (i % 2) * 8, .78, 1, i * 1.3, i % 2 === 0); }
  kid(c, t, { x: 40 + off, y: 470, s: .8, kind: 'boy', pose: 'walk', robe: '#fff8ea', seed: 4 });
  sparkles(c, t, 18, '#fff', 12, [W / 2, 200, W / 2, 200]);
  blurred(c, 4, o => fgBokeh(o, t, 8, 9, ['#ffe08a', '#ffffff', '#cfe4ff']));
  vignette(c); grain(c, t);
};

/* ---------- post: bloom, soft focus and grade ---------- */
const BL = document.createElement('canvas'); BL.width = 90; BL.height = 112; const BX = BL.getContext('2d');
const OFF = document.createElement('canvas');
function blurred(c, px, fn) {
  const k = FahmToon._k, ox = OFF.getContext('2d'); if (OFF.width !== c.canvas.width || OFF.height !== c.canvas.height) { OFF.width = c.canvas.width; OFF.height = c.canvas.height; }
  ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, OFF.width, OFF.height); ox.setTransform(c.getTransform()); fn(ox);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); if (FahmToon.soft) c.filter = `blur(${px * k}px)`; c.drawImage(OFF, 0, 0); c.restore();
}
function post(c) {
  const cv = c.canvas; BX.clearRect(0, 0, 90, 112); BX.drawImage(cv, 0, 0, 90, 112);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.globalAlpha = .38; c.drawImage(BL, 0, 0, cv.width, cv.height); c.globalAlpha = 1; c.globalCompositeOperation = 'soft-light'; c.fillStyle = 'rgba(255,190,140,.16)'; c.fillRect(0, 0, cv.width, cv.height); c.restore();
}
function fgBokeh(c, t, n, seed, cols) {
  const r = R(seed || 21); for (let i = 0; i < n; i++) { const x = r() * W, y = 330 + r() * 170, rad = 6 + r() * 14, ph = r() * 6, a = .1 + .1 * Math.sin(t * .8 + ph), col = cols[i % cols.length]; c.fillStyle = rgba(col, a); c.beginPath(); c.arc(x + Math.sin(t * .3 + ph) * 8, y, rad, 0, TAU); c.fill(); }
}

/* ---------- public API ---------- */
window.FahmToon = {
  soft: true, _k: 1,
  has: k => !!SC[k], keys: () => Object.keys(SC), W, H,
  draw(canvas, key, t) {
    const f = SC[key]; if (!f) return false; const c = canvas.getContext('2d'), k = canvas.width / W; this._k = k;
    CAM.x = Math.sin(t * .35) * 7; CAM.y = Math.sin(t * .27) * 2; const z = 1.045 + Math.sin(t * .2) * .006;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, canvas.width, canvas.height); c.setTransform(k * z, 0, 0, k * z * (canvas.height / canvas.width) / (H / W), -canvas.width * (z - 1) / 2, -canvas.height * (z - 1) / 2);
    f(c, t); post(c); c.setTransform(1, 0, 0, 1, 0, 0); return true;
  }
};
})();

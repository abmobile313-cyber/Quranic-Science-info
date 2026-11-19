/* Fahm scene engine: stateless procedural canvas animation. No faces are drawn on any figure. */
(function () {
const W = 400, H = 300, TAU = Math.PI * 2;
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(Array.isArray(r) ? r[0] : r, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); };
}
const fr = x => x - Math.floor(x);
const h = (i, s = 0) => fr(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const mix = (a, b, t) => a + (b - a) * t;
const C = { gold: '#e8b84a', cyan: '#35d0e6', maroon: '#8a1c2e', ember: '#ff7a2a', ink: '#070d1c', ink2: '#0d1830', white: '#f5efe0', red: '#c4302b', green: '#3ec28f' };
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const SKY = {
  night: ['#04070f', '#0e1a38', true],
  dawn: ['#0a1130', '#e0905a', false, '#5a3a78'],
  day: ['#1a5d9e', '#a8d8ea', false],
  dusk: ['#120d2c', '#c0562e', false, '#5a2a52'],
  void: ['#010208', '#070b1c', true],
  fire: ['#150404', '#7a1c08', false, '#3c0c0a'],
  holy: ['#06142a', '#1d4f6e', true, '#0b2a48']
};

function glow(c, x, y, r, col, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
}

function drawSky(c, spec, G) {
  const s = SKY[spec.sky || 'night'];
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, s[0]); if (s[3]) g.addColorStop(0.55, s[3]); g.addColorStop(1, s[1]);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  if (s[2]) {
    for (let i = 0; i < 70; i++) {
      const x = h(i) * W, y = h(i, 1) * H * 0.7, tw = 0.5 + 0.5 * Math.sin(G * (0.8 + h(i, 2) * 2) + i);
      c.fillStyle = `rgba(255,248,220,${0.15 + 0.6 * tw * h(i, 3)})`;
      c.fillRect(x, y, 1 + h(i, 4) * 1.2, 1 + h(i, 4) * 1.2);
    }
  }
  if (spec.moon) {
    const m = spec.moon; glow(c, m[0], m[1], 60, '#cfe6ff', 0.25);
    c.fillStyle = '#eaf2ff'; c.beginPath(); c.arc(m[0], m[1], 13, 0, TAU); c.fill();
    c.fillStyle = s[0]; c.beginPath(); c.arc(m[0] + 6, m[1] - 3, 12, 0, TAU); c.fill();
  }
}

function drawGround(c, spec, G) {
  const gr = spec.gr; if (!gr || gr === 'none') return;
  const hy = spec.hy || 212;
  const sk = spec.sky || 'night';
  const tint = { night: ['#0a1226', '#060b19'], dawn: ['#3a2440', '#1c1228'], day: ['#c9a56a', '#a8844c'], dusk: ['#2c1630', '#150a1c'], fire: ['#2a0a08', '#140404'], holy: ['#0a2036', '#061324'], void: ['#05070f', '#02030a'] }[sk];
  if (gr === 'dunes') {
    for (let l = 0; l < 2; l++) {
      c.fillStyle = tint[l]; c.beginPath(); c.moveTo(0, H);
      for (let x = 0; x <= W; x += 10) c.lineTo(x, hy - 6 + l * 14 - Math.sin(x * 0.018 + l * 2) * (10 - l * 3) - Math.sin(x * 0.007 + l) * 6);
      c.lineTo(W, H); c.fill();
    }
  } else if (gr === 'flat') {
    c.fillStyle = tint[1]; c.fillRect(0, hy, W, H - hy);
    const g = c.createLinearGradient(0, hy - 2, 0, hy + 12); g.addColorStop(0, rgba('#e8b84a', 0.18)); g.addColorStop(1, rgba('#e8b84a', 0));
    c.fillStyle = g; c.fillRect(0, hy - 2, W, 14);
  }
}

/* ---------- drawing helpers ---------- */
function elephant(c, x, y, s, ph, col) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round';
  const lg = (lx, p) => { c.save(); c.translate(lx, -20); c.rotate(Math.sin(p) * 0.32); c.fillRect(-4.5, 0, 9, 22); c.restore(); };
  lg(-20, ph); lg(-9, ph + Math.PI); lg(12, ph + Math.PI); lg(23, ph);
  c.beginPath(); c.ellipse(1, -34, 34, 21, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(35, -39, 14, 14, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(27, -37, 8, 13, 0.25, 0, TAU); c.fill();
  c.lineWidth = 8; c.beginPath(); c.moveTo(44, -41); c.quadraticCurveTo(55 + Math.sin(ph * 0.5) * 2, -26, 49 + Math.sin(ph * 0.5) * 4, -4); c.stroke();
  c.lineWidth = 2; c.beginPath(); c.moveTo(-33, -40); c.quadraticCurveTo(-41, -30, -38 + Math.sin(ph) * 2, -17); c.stroke();
  c.strokeStyle = '#efe3c4'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(43, -34); c.quadraticCurveTo(54, -31, 57, -40); c.stroke();
  c.restore();
}
function camel(c, x, y, s, ph, col) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round';
  const lg = (lx, p) => { c.save(); c.translate(lx, -26); c.rotate(Math.sin(p) * 0.28); c.fillRect(-2.2, 0, 4.4, 28); c.restore(); };
  lg(-16, ph); lg(-8, ph + Math.PI); lg(11, ph + Math.PI); lg(19, ph);
  c.beginPath(); c.ellipse(1, -36, 26, 11, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(-4, -49, 8, 9, 0, 0, TAU); c.fill();
  c.lineWidth = 6; c.beginPath(); c.moveTo(22, -40); c.quadraticCurveTo(34, -52, 35, -70); c.stroke();
  c.beginPath(); c.ellipse(39, -73, 8, 4, 0.25, 0, TAU); c.fill();
  c.lineWidth = 1.6; c.beginPath(); c.moveTo(-24, -40); c.quadraticCurveTo(-30, -30, -28, -20); c.stroke();
  c.restore();
}
function bird(c, x, y, s, fl, col) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; const w = Math.sin(fl) * 6;
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-7, -5 - w, -15, -1 - w * 0.7); c.quadraticCurveTo(-7, -1, 0, 2); c.quadraticCurveTo(7, -1, 15, -1 - w * 0.7); c.quadraticCurveTo(7, -5 - w, 0, 0); c.fill();
  c.beginPath(); c.ellipse(0, 1.5, 2.3, 4, 0, 0, TAU); c.fill(); c.restore();
}
function person(c, x, y, s, pose, col, face = 1) {
  c.save(); c.translate(x, y); c.scale(s * face, s); c.fillStyle = col;
  const k1 = clamp(pose), k2 = clamp(pose - 1);
  const hipY = mix(-24, -9, k2), th = mix(0, 1.38, k1) - k2 * 0.2;
  c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.lineTo(5, hipY); c.lineTo(-5, hipY); c.fill();
  c.save(); c.translate(0, hipY); c.rotate(th);
  c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.lineTo(5, -22); c.lineTo(-5, -22); c.closePath(); c.fill();
  c.beginPath(); c.arc(0, -27, 5.2, 0, TAU); c.fill();
  c.restore(); c.restore();
}
function flameParticles(c, x, y, w, ht, n, G, seed = 0, cols = ['255,235,140', '255,150,40', '200,40,20']) {
  const pc = c.globalCompositeOperation; c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const t = fr(G * (0.5 + h(i, seed) * 0.5) + h(i, seed + 1));
    const px = x + (h(i, seed + 2) - 0.5) * w * (1 - t * 0.7) + Math.sin(G * 3 + i) * 3 * t, py = y - t * ht;
    const r = (1 - t) * (9 + h(i, seed + 3) * 16), ci = t < 0.3 ? 0 : t < 0.65 ? 1 : 2;
    const g = c.createRadialGradient(px, py, 0, px, py, r * 2);
    g.addColorStop(0, `rgba(${cols[ci]},${0.95 * (1 - t) * Math.min(1, t * 7)})`); g.addColorStop(1, `rgba(${cols[ci]},0)`);
    c.fillStyle = g; c.fillRect(px - r * 2, py - r * 2, r * 4, r * 4);
  }
  c.globalCompositeOperation = pc;
}
function handShape(c, x, y, s, col, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col;
  c.beginPath(); c.roundRect(-11, -4, 22, 24, 6); c.fill();
  [[-8, 15], [-2.7, 19], [2.7, 18], [8, 14]].forEach(f => { c.beginPath(); c.roundRect(f[0] - 2.2, -4 - f[1], 4.4, f[1] + 3, 2.2); c.fill(); });
  c.save(); c.rotate(-0.9); c.beginPath(); c.roundRect(-18, 2, 4.6, 14, 2.3); c.fill(); c.restore();
  c.restore();
}
function treeShape(c, x, y, s, wither, col, G) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineCap = 'round';
  const br = (bx, by, len, ang, wd, d) => {
    if (d > 4 || wd < 0.6) return;
    const sw = Math.sin(G * 0.8 + d) * 0.03 * (1 - wither);
    const ex = bx + Math.cos(ang + sw) * len, ey = by + Math.sin(ang + sw) * len;
    c.lineWidth = wd; c.beginPath(); c.moveTo(bx, by); c.lineTo(ex, ey); c.stroke();
    if (d >= 3 && wither < 0.8) { c.fillStyle = rgba(wither > 0.4 ? '#8a6a2a' : '#3ec28f', 0.8 * (1 - wither)); c.beginPath(); c.arc(ex, ey, 4 * (1 - wither * 0.7), 0, TAU); c.fill(); }
    const sp = 0.5 + wither * 0.35;
    br(ex, ey, len * 0.74, ang - sp, wd * 0.7, d + 1); br(ex, ey, len * 0.74, ang + sp, wd * 0.7, d + 1);
  };
  br(0, 0, 32 * (1 - wither * 0.25), -Math.PI / 2, 8, 0);
  c.restore();
}
function sparkle(c, x, y, r, col, a) {
  c.save(); c.translate(x, y); c.fillStyle = rgba(col, a);
  c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.fill(); c.restore();
}

/* ---------- actors: (c, p, t, A, G) ; t = seconds since revealed, A = fade-in 0..1 ---------- */
const AC = {
  bloom(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, r = (p.r ?? 70) * (0.85 + 0.15 * Math.sin(G * 1.6)) * ease(t / 1.2), col = p.col || C.gold;
    glow(c, x, y, r * 1.6, col, 0.35 * A); glow(c, x, y, r * 0.55, '#fff6d8', 0.55 * A);
    const n = p.rays ?? 14; c.save(); c.translate(x, y); c.rotate(G * 0.06);
    for (let i = 0; i < n; i++) { c.rotate(TAU / n); const g = c.createLinearGradient(0, 0, 0, -r * 1.5); g.addColorStop(0, rgba(col, 0.28 * A)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.moveTo(-3, 0); c.lineTo(3, 0); c.lineTo(0.8, -r * 1.5); c.lineTo(-0.8, -r * 1.5); c.fill(); }
    c.restore();
  },
  rain(c, p, t, A, G) {
    const n = p.n ?? 40, col = p.col || C.gold, rev = p.rev ? -1 : 1, x0 = p.x ?? 0, wd = p.wd ?? W;
    for (let i = 0; i < n; i++) {
      const u = fr(G * (0.18 + h(i) * 0.18) * rev + h(i, 1)), x = x0 + h(i, 2) * wd, y = (rev > 0 ? u : 1 - u) * (p.h ?? 230);
      const a = Math.sin(u * Math.PI) * A; c.fillStyle = rgba(col, 0.75 * a); c.beginPath(); c.ellipse(x, y, 1.6, 4.2, 0, 0, TAU); c.fill();
      glow(c, x, y, 9, col, 0.25 * a);
    }
  },
  orbits(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, n = p.n ?? 5; glow(c, x, y, 40, C.gold, 0.5 * A);
    c.fillStyle = rgba('#fff3c4', A); c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill();
    for (let i = 0; i < n; i++) {
      const rr = (26 + i * 22) * ease(t / 1.3), a = G * (0.7 / (1 + i * 0.5)) + i * 2.1;
      c.strokeStyle = rgba('#9fc8ff', 0.18 * A); c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, rr, rr * 0.34, 0, 0, TAU); c.stroke();
      const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.34, pr = 3 + h(i) * 4;
      glow(c, px, py, pr * 3, [C.cyan, C.gold, '#c9a0ff', '#7fe0a0', '#ff9a7a'][i % 5], 0.45 * A);
      c.fillStyle = rgba([C.cyan, C.gold, '#c9a0ff', '#7fe0a0', '#ff9a7a'][i % 5], A); c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill();
    }
  },
  sun(c, p, t, A, G) {
    const x = p.x ?? 200, y0 = p.y0 ?? 215, y1 = p.y1 ?? 80, y = mix(y0, y1, ease(t / (p.d ?? 4))), col = p.col || '#ffd27a', r = p.r ?? 20;
    glow(c, x, y, r * 4, col, 0.45 * A); c.fillStyle = rgba('#fff0c0', A); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = rgba(col, 0.4 * A); c.lineWidth = 1.5; for (let i = 0; i < 16; i++) { const a = i * TAU / 16 + G * 0.2; c.beginPath(); c.moveTo(x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5)); c.lineTo(x + Math.cos(a) * (r + 12 + Math.sin(G * 2 + i) * 3), y + Math.sin(a) * (r + 12 + Math.sin(G * 2 + i) * 3)); c.stroke(); }
  },
  scales(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, tilt = (p.tilt ?? 0.18) * Math.sin(Math.min(t, 3) * 1.1) + Math.sin(G * 1.3) * 0.02;
    c.save(); c.globalAlpha = A; c.translate(x, y + (1 - ease(t / 1)) * -20); glow(c, 0, 10, 70, C.gold, 0.25);
    c.strokeStyle = C.gold; c.fillStyle = C.gold; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 60); c.stroke();
    c.beginPath(); c.moveTo(-20, 60); c.lineTo(20, 60); c.stroke(); c.beginPath(); c.arc(0, -42, 4, 0, TAU); c.fill();
    c.save(); c.translate(0, -34); c.rotate(tilt); c.lineWidth = 3; c.beginPath(); c.moveTo(-60, 0); c.lineTo(60, 0); c.stroke();
    [-60, 60].forEach(sx => { c.save(); c.translate(sx, 0); c.rotate(-tilt); c.lineWidth = 1; c.beginPath(); c.moveTo(0, 0); c.lineTo(-18, 38); c.moveTo(0, 0); c.lineTo(18, 38); c.stroke();
      c.beginPath(); c.moveTo(-22, 38); c.quadraticCurveTo(0, 54, 22, 38); c.closePath(); c.fillStyle = rgba(C.gold, 0.85); c.fill(); c.restore(); });
    c.restore(); c.restore();
  },
  dome(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 212, s = p.s ?? 1; c.save(); c.translate(x, y); c.scale(s, s * ease(t / 1)); c.globalAlpha = A; c.fillStyle = '#050a16';
    c.fillRect(-46, -26, 92, 26); c.beginPath(); c.arc(0, -26, 30, Math.PI, 0); c.fill(); c.fillRect(-2, -66, 4, 10);
    [-62, 62].forEach(mx => { c.fillRect(mx - 5, -78, 10, 78); c.beginPath(); c.moveTo(mx - 7, -78); c.lineTo(mx, -98); c.lineTo(mx + 7, -78); c.fill(); });
    c.fillStyle = rgba(C.gold, 0.9); [[-62, -86], [62, -86], [0, -69]].forEach(m => { c.beginPath(); c.arc(m[0], m[1], 2, 0, TAU); c.fill(); });
    for (let i = -1; i <= 1; i++) { c.fillStyle = rgba('#ffd27a', 0.5 + 0.2 * Math.sin(G * 2 + i)); c.fillRect(i * 22 - 4, -20, 8, 14); }
    c.restore();
  },
  beam(c, p, t, A, G) {
    const x = p.x ?? 200, col = p.col || C.gold, dn = p.down, grow = ease(t / 1.2), y0 = dn ? 0 : (p.y ?? 200), y1 = dn ? (p.y ?? 200) : 0;
    const yy = mix(y0, y1, grow), g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, rgba(col, 0.6 * A)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.beginPath(); c.moveTo(x - 5, y0); c.lineTo(x + 5, y0); c.lineTo(x + (dn ? 30 : 22), yy); c.lineTo(x - (dn ? 30 : 22), yy); c.fill();
    for (let i = 0; i < 14; i++) { const u = fr(G * 0.3 + h(i)); const yy2 = dn ? u * (p.y ?? 200) : (p.y ?? 200) * (1 - u); sparkle(c, x + (h(i, 1) - 0.5) * 30, yy2, 2 + h(i, 2) * 2, col, 0.8 * A * Math.sin(u * Math.PI)); }
  },
  path(c, p, t, A, G) {
    const hy = p.hy ?? 130, cx = p.x ?? 200, kind = p.kind || 'straight', col = p.col || C.gold;
    c.save(); c.globalAlpha = A;
    if (kind === 'straight') {
      const g = c.createLinearGradient(0, H, 0, hy); g.addColorStop(0, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0.05)); c.fillStyle = g;
      c.beginPath(); c.moveTo(cx - 90, H); c.lineTo(cx + 90, H); c.lineTo(cx + 6, hy); c.lineTo(cx - 6, hy); c.fill();
      for (let i = 0; i < 9; i++) { const u = fr(i / 9 - G * 0.12), y = mix(H, hy, u * u); c.fillStyle = rgba('#fff6d8', 0.7 * (1 - u)); c.fillRect(cx - 1.5 * (1 - u) - 0.3, y, 3 * (1 - u) + 0.6, 7 * (1 - u) + 1); }
      glow(c, cx, hy, 40, col, 0.5);
    } else {
      c.lineWidth = 7; c.strokeStyle = rgba('#8a8fb0', 0.25); c.lineCap = 'round';
      for (let k = 0; k < 4; k++) { c.beginPath(); const sx = 60 + k * 90; c.moveTo(sx, H); c.bezierCurveTo(sx - 60 + h(k) * 120, 250, sx + 60 - h(k, 1) * 120, 190, 40 + h(k, 2) * 320, hy + h(k, 3) * 40); c.stroke(); }
    }
    c.restore();
  },
  figures(c, p, t, A, G) {
    const n = p.n ?? 5, y = p.y ?? 212, x0 = p.x ?? 200, gap = p.gap ?? 36, s = p.s ?? 1, mode = p.mode || 'pray', col = p.col || '#04060d';
    for (let i = 0; i < n; i++) {
      const x = x0 + (i - (n - 1) / 2) * gap, appear = ease((t - i * 0.12) / 0.6); if (appear <= 0) continue;
      let pose = 0, a = A * appear, dx = 0;
      if (mode === 'pray') { const cyc = (G * 0.22 + 0) % 1; pose = cyc < 0.3 ? 0 : cyc < 0.45 ? ease((cyc - 0.3) / 0.15) : cyc < 0.6 ? 1 : cyc < 0.75 ? 1 + ease((cyc - 0.6) / 0.15) : 2; if (cyc > 0.9) pose = 2 * (1 - ease((cyc - 0.9) / 0.1)); }
      if (mode === 'neglect') { pose = (i % 2) * 0.4 + 0.1 * Math.sin(G + i); a *= 0.55 + 0.4 * Math.sin(G * 0.9 + i * 1.7); }
      if (mode === 'walk') { dx = Math.sin(G * 1.5 + i) * 2; pose = 0; }
      if (mode === 'spot') { a *= i === (p.hero ?? 2) ? 1 : 0.35; }
      glow(c, x + dx, y - 22 * s, 18 * s, p.aura || C.gold, (mode === 'spot' && i === (p.hero ?? 2) ? 0.55 : 0.18) * a);
      c.globalAlpha = a; person(c, x + dx, y, s, pose, col); c.globalAlpha = 1;
    }
    if (mode === 'spot') { const x = x0 + (((p.hero ?? 2) - (n - 1) / 2) * gap); const g = c.createLinearGradient(0, 0, 0, y); g.addColorStop(0, rgba('#fff2c0', 0.55 * A)); g.addColorStop(1, rgba('#fff2c0', 0.05 * A)); c.fillStyle = g; c.beginPath(); c.moveTo(x - 6, 0); c.lineTo(x + 6, 0); c.lineTo(x + 34, y); c.lineTo(x - 34, y); c.fill(); }
  },
  kaaba(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 212, s = p.s ?? 1; c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = A;
    glow(c, 0, -30, 90, C.gold, 0.18 + 0.05 * Math.sin(G * 2));
    c.fillStyle = '#07070c'; c.fillRect(-30, -54, 52, 54); c.fillStyle = '#030306'; c.beginPath(); c.moveTo(22, -54); c.lineTo(40, -47); c.lineTo(40, 7); c.lineTo(22, 0); c.fill();
    c.fillStyle = C.gold; c.fillRect(-30, -44, 52, 5); c.beginPath(); c.moveTo(22, -44); c.lineTo(40, -37); c.lineTo(40, -32); c.lineTo(22, -39); c.fill();
    c.fillStyle = rgba(C.gold, 0.9); c.fillRect(-10, -24, 13, 24); c.fillStyle = '#07070c'; c.fillRect(-8, -22, 9, 22);
    c.restore();
  },
  elephants(c, p, t, A, G) {
    const n = p.n ?? 3, y = p.y ?? 214, mode = p.mode || 'march', s = p.s ?? 0.85;
    for (let i = 0; i < n; i++) {
      let x = (p.x ?? 70) + i * (p.gap ?? 78), a = A, yy = y + (i % 2) * 6, face = 1, ph = G * 4 + i, col = p.col || '#05070e';
      if (mode === 'march') { x += Math.min(t, 4) * (p.v ?? 14); if (p.still) { x = (p.x ?? 70) + i * (p.gap ?? 78) + 14; } }
      if (mode === 'wander') { face = Math.sin(G * 0.6 + i) > 0 ? 1 : -1; x += Math.sin(G * 0.5 + i * 2) * 22; }
      if (mode === 'crumble') { const k = clamp(t / 2.5); a *= 1 - k; yy += k * 8; ph = 0; x += 14; }
      c.globalAlpha = a; if (face < 0) { c.save(); c.translate(x * 2, 0); c.scale(-1, 1); } elephant(c, x, yy, s, ph, col); if (face < 0) c.restore(); c.globalAlpha = 1;
    }
  },
  birds(c, p, t, A, G) {
    const n = p.n ?? 16, col = p.col || '#0a0f1e', tx = p.tx ?? 190, ty = p.ty ?? 190;
    for (let i = 0; i < n; i++) {
      const u = fr(G * 0.12 + h(i, 5)), ph = h(i, 6) * 6;
      const sx = 420 + h(i, 1) * 60, sy = -10 + h(i, 2) * 70, x = mix(sx, tx + (h(i, 3) - 0.5) * 120, ease(u)), y = mix(sy, ty + (h(i, 4) - 0.5) * 30, ease(u)) + Math.sin(u * 14 + i) * 4;
      const a = A * ease(t / 0.6 - i * 0.04) * Math.sin(u * Math.PI) ** 0.4; c.globalAlpha = clamp(a); bird(c, x, y, 0.8 + h(i, 7) * 0.5, G * 14 + ph, col); c.globalAlpha = 1;
    }
  },
  stones(c, p, t, A, G) {
    const n = p.n ?? 22, tx = p.tx ?? 150, ty = p.ty ?? 205;
    for (let i = 0; i < n; i++) {
      const u = fr(G * (0.35 + h(i) * 0.25) + h(i, 1)), sx = 330 + h(i, 2) * 70, sy = -10, ex = tx + (h(i, 3) - 0.5) * 220, ey = ty + (h(i, 4) - 0.5) * 16;
      const x = mix(sx, ex, u), y = mix(sy, ey, u * u), a = A * ease(t / 0.5);
      const trail = c.createLinearGradient(x, y, mix(sx, x, 0.9), mix(sy, y, 0.9)); trail.addColorStop(0, rgba(C.ember, 0.6 * a)); trail.addColorStop(1, rgba(C.ember, 0));
      c.strokeStyle = trail; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (sx - ex) * 0.06, y - 18); c.stroke();
      c.fillStyle = rgba('#3a2418', a); c.beginPath(); c.arc(x, y, 2.6 + h(i, 5) * 2, 0, TAU); c.fill();
      if (u > 0.93) glow(c, x, y, 16, C.ember, 0.6 * a);
    }
  },
  straw(c, p, t, A, G) {
    const n = p.n ?? 60, y0 = p.y ?? 214;
    for (let i = 0; i < n; i++) {
      const x = h(i) * W, y = y0 + h(i, 1) * 70 - (Math.sin(G * 0.6 + i) * 3), ang = h(i, 2) * 3, len = 6 + h(i, 3) * 10;
      c.strokeStyle = rgba(p.eaten ? '#6a5a3a' : '#c9a85a', 0.85 * A * ease(t / 0.8 - h(i, 4) * 0.5)); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len * 0.3); c.stroke();
    }
    for (let i = 0; i < 12; i++) { const u = fr(G * 0.1 + h(i, 8)); glow(c, h(i, 9) * W + u * 30, 190 - u * 80, 14, '#d9c9a0', 0.12 * A); }
  },
  camels(c, p, t, A, G) {
    const n = p.n ?? 3, y = p.y ?? 214, s = p.s ?? 0.75, dir = p.dir ?? 1;
    for (let i = 0; i < n; i++) {
      let x = (p.x ?? 60) + i * (p.gap ?? 80); if (!p.still) x += dir * Math.min(t, 6) * 12;
      const xx = dir > 0 ? x : 400 - x;
      c.globalAlpha = A; if (dir < 0) { c.save(); c.translate(400, 0); c.scale(-1, 1); }
      if (p.aura) glow(c, x, y - 40 * s, 60, p.aura, 0.4 * A);
      camel(c, x, y + (i % 2) * 5, s, p.still ? 0 : G * 3 + i * 1.3, '#05070e'); if (dir < 0) c.restore(); c.globalAlpha = 1;
    }
  },
  food(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 190, away = p.away ? Math.min(t, 3) * 12 : 0, full = p.empty ? 0 : 1;
    c.save(); c.translate(x + away, y); c.scale(1.5, 1.5); c.globalAlpha = A; glow(c, 0, -8, 40, C.gold, 0.25 * full);
    c.fillStyle = '#17120a'; c.beginPath(); c.ellipse(0, 4, 24, 7, 0, 0, TAU); c.fill(); c.fillStyle = '#2a2012'; c.beginPath(); c.moveTo(-24, 4); c.quadraticCurveTo(0, 34, 24, 4); c.closePath(); c.fill();
    if (full) for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#8a5a24' : '#c98a3c'; c.beginPath(); c.ellipse(-14 + i * 4.6, -2 - Math.sin(i * 1.7) * 3, 4.5, 3, 0.3, 0, TAU); c.fill(); }
    if (full) for (let i = 0; i < 4; i++) { const u = fr(G * 0.4 + i / 4); c.strokeStyle = rgba('#fff', 0.25 * (1 - u) * A); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-8 + i * 5, -8 - u * 22); c.quadraticCurveTo(-4 + i * 5 + Math.sin(u * 6) * 4, -14 - u * 22, -8 + i * 5, -20 - u * 22); c.stroke(); }
    c.restore();
  },
  shield(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, s = (p.s ?? 1) * (0.9 + 0.1 * ease(t / 0.8)); c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = A;
    glow(c, 0, 0, 70, C.cyan, 0.3 + 0.1 * Math.sin(G * 2)); c.beginPath(); c.moveTo(0, -34); c.quadraticCurveTo(26, -28, 30, -22); c.quadraticCurveTo(30, 18, 0, 38); c.quadraticCurveTo(-30, 18, -30, -22); c.quadraticCurveTo(-26, -28, 0, -34);
    const g = c.createLinearGradient(0, -34, 0, 38); g.addColorStop(0, '#2ab5cc'); g.addColorStop(1, '#0c3a5a'); c.fillStyle = g; c.fill(); c.strokeStyle = C.gold; c.lineWidth = 2.4; c.stroke();
    c.strokeStyle = '#fff6d8'; c.lineWidth = 3.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(-10, 2); c.lineTo(-2, 11); c.lineTo(12, -8); c.stroke(); c.restore();
  },
  child(c, p, t, A, G) {
    const x = p.x ?? 160, y = p.y ?? 214, push = p.shove ? Math.min(t, 2.6) : 0;
    c.globalAlpha = A; c.shadowColor = 'rgba(140,170,255,0.55)'; c.shadowBlur = 8; glow(c, x - push * 8, y - 12, 26, C.cyan, 0.16);
    person(c, x - push * 8, y, 0.95, 0.35 + 0.1 * Math.sin(G), '#04060d'); // small, hunched
    if (p.shove) { const bx = x - 50 + push * 8; person(c, bx - 40, y, 1.9, 0, '#04060d'); c.fillStyle = '#04060d'; c.save(); c.translate(bx - 30, y - 70); c.rotate(-0.35 + Math.sin(G * 6) * 0.05 * (push < 2.4 ? 1 : 0)); c.fillRect(0, -4, 40 + push * 4, 7); c.restore(); }
    c.shadowBlur = 0; c.globalAlpha = 1;
  },
  river(c, p, t, A, G) {
    const y0 = p.y ?? 150, grow = ease(t / 1.5);
    c.save(); c.globalAlpha = A * grow;
    for (let k = 0; k < 6; k++) {
      c.beginPath(); c.moveTo(0, H);
      const yb = y0 + k * 14;
      for (let x = 0; x <= W; x += 8) c.lineTo(x, yb + Math.sin(x * 0.025 + G * (1 + k * 0.3) + k) * (4 + k) - (x / W) * 18);
      c.lineTo(W, H); const g = c.createLinearGradient(0, yb - 10, 0, H); g.addColorStop(0, rgba(k % 2 ? C.cyan : '#7fe0ff', 0.32)); g.addColorStop(1, rgba('#0a2a50', 0.5)); c.fillStyle = g; c.fill();
    }
    for (let i = 0; i < 26; i++) { const u = fr(G * (0.12 + h(i) * 0.1) + h(i, 1)); sparkle(c, u * W, y0 + 12 + h(i, 2) * 90 - u * 14, 2 + h(i, 3) * 3, i % 3 ? '#fff6d8' : C.gold, 0.9 * Math.sin(u * Math.PI)); }
    c.restore();
  },
  tree(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 214, k = clamp((t - (p.delay ?? 0.4)) / 3.5) * (p.wither ?? 0); c.globalAlpha = A;
    if (p.cut) { const w = ease(clamp(t / 2)); treeShape(c, x, y, p.s ?? 1.3, 0.9, '#05070e', G); c.fillStyle = '#05070e'; c.fillRect(x - 6, y - 8, 12, 8); c.fillStyle = '#0c1020'; c.fillRect(x - 12, y - 50 * (1 - w) - 4, 24, 5); }
    else treeShape(c, x, y, p.s ?? 1.3, k, '#05070e', G);
    c.globalAlpha = 1;
  },
  split(c, p, t, A, G) {
    const hy = p.hy ?? 130, cx = 200, k = ease(t / 1.4), c1 = p.c1 || C.cyan, c2 = p.c2 || C.gold; c.save(); c.globalAlpha = A;
    [[-1, c1], [1, c2]].forEach(([sd, col]) => {
      const g = c.createLinearGradient(0, H, 0, hy); g.addColorStop(0, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0.04)); c.fillStyle = g;
      c.beginPath(); c.moveTo(cx + sd * 6, H); c.lineTo(cx + sd * 150 * k, H); c.lineTo(cx + sd * 16 * k, hy); c.lineTo(cx + sd * 3, hy); c.fill();
      glow(c, cx + sd * 90 * k, 190, 50, col, 0.25);
    });
    const g2 = c.createLinearGradient(0, hy, 0, H); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(1, 'rgba(255,255,255,0.7)'); c.strokeStyle = g2; c.lineWidth = 1.5; c.setLineDash([5, 5]); c.lineDashOffset = -G * 8; c.beginPath(); c.moveTo(cx, hy); c.lineTo(cx, H); c.stroke(); c.setLineDash([]);
    c.restore();
  },
  gate(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 212, s = p.s ?? 1, open = ease(t / 2);
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = A; glow(c, 0, -40, 90 * open + 10, '#ffe9a8', 0.55 * open);
    c.fillStyle = '#05070e'; c.beginPath(); c.moveTo(-70, 0); c.lineTo(-70, -92); c.lineTo(70, -92); c.lineTo(70, 0); c.lineTo(34, 0); c.lineTo(34, -54); c.arc(0, -54, 34, 0, Math.PI, true); c.lineTo(-34, 0); c.closePath(); c.fill();
    c.fillStyle = rgba('#ffe9a8', 0.85 * open); c.beginPath(); c.moveTo(-34, 0); c.lineTo(-34, -54); c.arc(0, -54, 34, Math.PI, 0); c.lineTo(34, 0); c.fill();
    c.fillStyle = '#05070e'; [-1, 1].forEach(sd => { c.fillRect(sd * 76 - 7, -110, 14, 110); });
    c.restore();
    if (p.crowd) {
      const n = p.crowd;
      for (let i = 0; i < n; i++) { const u = fr(G * 0.09 + i / n + h(i) * 0.05), lane = i % 3; const sx = (i % 2 ? 450 : -50), ex = x, px = mix(sx, ex, u) + (lane - 1) * 6, py = y + 12 + lane * 6 - u * (lane + 1) * 3; if (u > 0.95) continue; c.globalAlpha = A * Math.min(1, (1 - u) * 5); person(c, px, py, 0.5 + lane * 0.06, 0, '#04060d'); c.globalAlpha = 1; }
    }
  },
  beads(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, r = 56 * ease(t / 1.2), n = 33; c.save(); c.globalAlpha = A; glow(c, x, y, r * 1.6, C.gold, 0.18);
    for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2, on = ((G * 2.2) % n); const d = Math.abs(((i - on + n * 1.5) % n) - n / 2); const l = clamp(1 - Math.abs(((i - on + n) % n)) / 6);
      const bx = x + Math.cos(a) * r, by = y + Math.sin(a) * r; glow(c, bx, by, 12, C.gold, 0.7 * l); c.fillStyle = l > 0.2 ? '#ffe9a8' : '#a07a30'; c.beginPath(); c.arc(bx, by, 3.2, 0, TAU); c.fill(); }
    c.restore();
  },
  flames(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 235, k = ease(t / 1.2); glow(c, x, y - 30, (p.wd ?? 120) * 1.1 * k, C.ember, 0.35 * A);
    c.globalAlpha = A; flameParticles(c, x, y, (p.wd ?? 120) * k, (p.h ?? 110) * k, p.n ?? 46, G, p.seed ?? 0); c.globalAlpha = 1;
  },
  hand(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 140, k = clamp((t - 0.8) / 2.6), a = A * (1 - k * 0.9), rot = p.rot ?? 0;
    c.globalAlpha = a; c.shadowColor = C.ember; c.shadowBlur = 14; handShape(c, x, y + k * 12, 2.2, '#150a0c', rot); c.shadowBlur = 0; c.globalAlpha = 1;
    if (k > 0) for (let i = 0; i < 26; i++) { const u = fr(i / 26 + G * 0.5); const px = x + (h(i) - 0.5) * 50 + u * (h(i, 1) - 0.5) * 30, py = y + 10 - u * 60 * k; c.fillStyle = rgba('#7a5a4a', 0.6 * (1 - u) * k * A); c.fillRect(px, py, 2.2, 2.2); }
    glow(c, x, y + 10, 45, C.ember, 0.25 * A);
  },
  coins(c, p, t, A, G) {
    const n = p.n ?? 18, x0 = p.x ?? 200, w = p.wd ?? 230;
    for (let i = 0; i < n; i++) { const u = fr(G * 0.22 + h(i, 1)), x = x0 + (h(i) - 0.5) * w, y = 30 + u * 190, a = A * ease(t / 0.6 - i * 0.03) * (u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3), sq = Math.abs(Math.cos(G * 3 + i));
      c.fillStyle = rgba(C.gold, a); c.beginPath(); c.ellipse(x, y, 6 * Math.max(0.15, sq), 6, 0, 0, TAU); c.fill(); c.strokeStyle = rgba('#7a5a14', a); c.lineWidth = 1; c.stroke();
      if (u > 0.7) for (let j = 0; j < 3; j++) { c.fillStyle = rgba('#b0a080', 0.4 * a); c.fillRect(x + (h(i, j) - 0.5) * 20 * (u - 0.7) * 4, y + (h(i, j + 3)) * 12, 1.6, 1.6); }
    }
  },
  rope(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 130, r = 34 * ease(t / 1.2); c.save(); c.globalAlpha = A; glow(c, x, y, 60, C.ember, 0.2);
    for (let k = 0; k < 3; k++) { c.strokeStyle = ['#7a5a2e', '#9a7440', '#5a4020'][k]; c.lineWidth = 4.2; c.beginPath(); for (let a = 0; a <= TAU + 0.05; a += 0.1) { const rr = r + Math.sin(a * 14 + k * 2.1 + G * 0.6) * 3.2, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.7; a === 0 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke(); }
    c.restore();
  },
  firewood(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 200, k = ease(t / 1); c.save(); c.globalAlpha = A * k; c.translate(x, y);
    for (let i = 0; i < 14; i++) { c.strokeStyle = i % 2 ? '#3a2412' : '#5a3a1c'; c.lineWidth = 3.2; c.lineCap = 'round'; const ang = -0.5 + h(i) * 1, len = 40 + h(i, 1) * 30; c.beginPath(); c.moveTo((h(i, 2) - 0.5) * 20, 0); c.lineTo((h(i, 2) - 0.5) * 20 + Math.sin(ang) * len, -Math.cos(ang) * len * 0.8); c.stroke(); }
    c.strokeStyle = '#8a6a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-18, -14); c.lineTo(18, -22); c.stroke();
    c.restore(); flameParticles(c, x, y - 26, 40, 40, 10, G, 7);
  },
  core(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 120, mode = p.mode || 'one', k = ease(t / 1.4);
    if (mode === 'one') {
      for (let i = 0; i < 4; i++) { const u = fr(G * 0.22 + i / 4); c.strokeStyle = rgba(C.gold, 0.5 * (1 - u) * A); c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, 14 + u * 120, 0, TAU); c.stroke(); }
      glow(c, x, y, 80 * k, C.gold, 0.55 * A); c.fillStyle = rgba('#fff7dc', A); c.beginPath(); c.arc(x, y, 9 * k, 0, TAU); c.fill();
    } else if (mode === 'samad') {
      glow(c, x, y, 70, C.gold, 0.5 * A); c.fillStyle = rgba('#fff7dc', A); c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill();
      for (let i = 0; i < 9; i++) { const a = G * 0.4 + i * TAU / 9, rr = 40 + (i % 3) * 26 + Math.sin(G + i) * 4, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.55;
        c.strokeStyle = rgba(C.gold, 0.18 * A); c.lineWidth = 1; c.beginPath(); c.moveTo(px, py); c.lineTo(x, y); c.stroke(); glow(c, px, py, 12, C.cyan, 0.6 * A); c.fillStyle = rgba('#d8f6ff', A); c.beginPath(); c.arc(px, py, 3, 0, TAU); c.fill(); }
    } else if (mode === 'lineage') {
      glow(c, x, y, 60, C.gold, 0.5 * A); c.fillStyle = rgba('#fff7dc', A); c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill();
      for (let i = 0; i < 3; i++) { const u = fr(G * 0.25 + i / 3), dir = [-1, 0.4, 1][i]; const px = x + dir * u * 90, py = y + u * 70; c.fillStyle = rgba('#d8f6ff', 0.8 * (1 - u) * A); c.beginPath(); c.arc(px, py, 3 * (1 - u * 0.5), 0, TAU); c.fill(); c.strokeStyle = rgba(C.gold, 0.3 * (1 - u) * A); c.beginPath(); c.moveTo(x, y); c.lineTo(px, py); c.stroke(); }
      c.strokeStyle = rgba(C.cyan, 0.3 * A); c.setLineDash([3, 5]); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y - 14); c.stroke(); c.setLineDash([]);
    } else if (mode === 'equal') {
      glow(c, x, y, 90, C.gold, 0.55 * A); c.fillStyle = rgba('#fff7dc', A); c.beginPath(); c.arc(x, y, 12, 0, TAU); c.fill();
      for (let i = 0; i < 6; i++) { const u = fr(G * 0.2 + i / 6), a = i * TAU / 6, rr = 150 * (1 - u), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.6; glow(c, px, py, 14, C.cyan, 0.5 * (1 - u) * A * (u < 0.7 ? 1 : (1 - (u - 0.7) / 0.3))); c.fillStyle = rgba('#d8f6ff', (u < 0.65 ? 0.9 : 0.9 * (1 - (u - 0.65) / 0.35)) * A); c.beginPath(); c.arc(px, py, 3.2 * (1 - u * 0.6), 0, TAU); c.fill(); }
    }
  },
  dawnsplit(c, p, t, A, G) {
    const k = ease(t / 2.2), y = p.y ?? 190;
    const g = c.createLinearGradient(0, y - 10, 0, 0); g.addColorStop(0, rgba('#ffd9a0', 0.8 * A * k)); g.addColorStop(1, rgba('#ff9a6a', 0));
    c.fillStyle = g; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.lineTo(W * (0.5 + 0.5 * k), 0); c.lineTo(W * (0.5 - 0.5 * k), 0); c.fill();
    c.fillStyle = rgba('#05070e', A); c.beginPath(); c.moveTo(0, 0); c.lineTo(W * (0.5 - 0.5 * k), 0); c.lineTo(0, y); c.fill(); c.beginPath(); c.moveTo(W, 0); c.lineTo(W * (0.5 + 0.5 * k), 0); c.lineTo(W, y); c.fill();
    glow(c, W / 2, y, 140 * k, '#ffd9a0', 0.55 * A);
  },
  dark(c, p, t, A, G) {
    const k = ease(t / (p.d ?? 3)) * (p.full ?? 1), edge = W * k;
    c.save(); c.globalAlpha = A;
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(1,2,6,0.97)'); g.addColorStop(0.7, 'rgba(1,2,6,0.9)'); g.addColorStop(1, 'rgba(1,2,6,0.0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0);
    for (let y = 0; y <= H; y += 8) c.lineTo(edge + Math.sin(y * 0.045 + G * 1.2) * 14 + Math.sin(y * 0.11 - G) * 6, y);
    c.lineTo(0, H); c.fill();
    c.strokeStyle = rgba('#9a6ad0', 0.35); c.lineWidth = 2; c.beginPath();
    for (let y = 0; y <= H; y += 8) { const x = edge + Math.sin(y * 0.045 + G * 1.2) * 14 + Math.sin(y * 0.11 - G) * 6; y === 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    for (let i = 0; i < 14; i++) { const u = fr(G * 0.12 + h(i)), x = edge * (0.5 + 0.5 * u), y = h(i, 1) * H, r = 14 + h(i, 2) * 22; const gg = c.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, 'rgba(60,20,90,0.5)'); gg.addColorStop(1, 'rgba(60,20,90,0)'); c.fillStyle = gg; c.fillRect(x - r, y - r, r * 2, r * 2); }
    c.restore();
  },
  knots(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 150, k = ease(t / 1.4); c.save(); c.globalAlpha = A; glow(c, x, y, 90, '#6a3aa0', 0.2);
    c.strokeStyle = '#7a5a3a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); for (let a = 0; a <= 1; a += 0.02) { const px = x - 140 + a * 280 * k, py = y + Math.sin(a * 9 + G * 0.5) * 12; a === 0 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke();
    for (let i = 0; i < 5; i++) { const a = (i + 0.5) / 5, px = x - 140 + a * 280 * k, py = y + Math.sin(a * 9 + G * 0.5) * 12; if (a * 280 * k > a * 280 - 1) { c.strokeStyle = '#3a2a1a'; c.lineWidth = 3; c.beginPath(); c.arc(px, py, 8, 0, TAU); c.stroke(); c.fillStyle = '#5a4026'; c.beginPath(); c.arc(px, py, 5, 0, TAU); c.fill(); } }
    c.restore();
  },
  smoke(c, p, t, A, G) {
    const col = p.col || '#8a3aa8', x = p.x ?? 80, y = p.y ?? 190, tx = p.tx ?? 280, ty = p.ty ?? 140, n = p.n ?? 26, retreat = p.retreat;
    for (let i = 0; i < n; i++) {
      let u = fr(G * (0.12 + h(i) * 0.08) + h(i, 1)); if (retreat) u = 1 - u;
      const px = mix(x, tx, u) + Math.sin(u * 8 + i) * 14, py = mix(y, ty, u) + Math.cos(u * 6 + i * 2) * 10, r = 6 + u * 16;
      const a = A * Math.sin(u * Math.PI) * 0.5 * ease(t / 0.8); const g = c.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(px - r, py - r, r * 2, r * 2);
    }
    if (p.orb) { glow(c, tx, ty, 50, p.orb, 0.5 * A); c.fillStyle = rgba('#fff6d8', A); c.beginPath(); c.arc(tx, ty, 8, 0, TAU); c.fill(); }
  },
  humans(c, p, t, A, G) {
    const n = p.n ?? 40, y0 = p.y ?? 215, col = p.col || '#e8f6ff';
    c.fillStyle = 'rgba(2,4,12,0.55)'; c.fillRect(0, y0 + 4, W, H);
    for (let i = 0; i < n; i++) { const x = 20 + h(i) * 360, y = y0 - h(i, 1) * 8 + (i % 4) * 4, tw = 0.5 + 0.5 * Math.sin(G * 1.5 + i); const a = A * ease(t / 1 - h(i, 2) * 0.6);
      glow(c, x, y - 18, 22, i % 3 ? C.cyan : C.gold, 0.55 * a * tw); c.globalAlpha = a; person(c, x, y, 0.8 + h(i, 3) * 0.2, 0, '#04060d'); c.globalAlpha = 1; }
  },
  crown(c, p, t, A, G) {
    const x = p.x ?? 200, y = (p.y ?? 80) + (1 - ease(t / 1)) * -20; c.save(); c.translate(x, y); c.globalAlpha = A; glow(c, 0, 0, 70, C.gold, 0.45);
    c.fillStyle = C.gold; c.beginPath(); c.moveTo(-26, 12); c.lineTo(-30, -14); c.lineTo(-14, -2); c.lineTo(0, -22); c.lineTo(14, -2); c.lineTo(30, -14); c.lineTo(26, 12); c.closePath(); c.fill();
    c.fillStyle = '#fff3c4'; [[-30, -14], [0, -22], [30, -14]].forEach(m => { c.beginPath(); c.arc(m[0], m[1], 3, 0, TAU); c.fill(); }); c.fillStyle = C.maroon; c.fillRect(-26, 4, 52, 5); c.restore();
  },
  chest(c, p, t, A, G) {
    const x = p.x ?? 200, y = p.y ?? 215, dim = p.dim ?? 0; c.save(); c.globalAlpha = A; c.fillStyle = '#04060d';
    c.beginPath(); c.moveTo(x - 62, y + 40); c.quadraticCurveTo(x - 62, y - 22, x - 24, y - 30); c.lineTo(x + 24, y - 30); c.quadraticCurveTo(x + 62, y - 22, x + 62, y + 40); c.fill();
    c.beginPath(); c.arc(x, y - 50, 24, 0, TAU); c.fill();
    const pulse = 0.8 + 0.2 * Math.sin(G * 3); glow(c, x, y - 2, 46 * pulse, C.gold, 0.55 * (1 - dim * 0.5)); c.fillStyle = rgba('#fff3c4', 0.95); c.beginPath(); c.arc(x, y - 2, 8, 0, TAU); c.fill(); c.restore();
  },
  frost(c, p, t, A, G) {
    for (let i = 0; i < 26; i++) { const u = fr(G * 0.1 + h(i)), x = h(i, 1) * W, y = 20 + u * 220; sparkle(c, x, y, 3 + h(i, 2) * 3, '#cfeeff', 0.8 * A * Math.sin(u * Math.PI)); }
  },
  haze(c, p, t, A, G) {
    const col = p.col || C.red, x = p.x ?? 70, y = p.y ?? 190;
    for (let i = 0; i < 18; i++) { const u = fr(G * 0.1 + h(i)), px = x + (h(i, 1) - 0.5) * 120 + Math.sin(G + i) * 8, py = y - u * 80, r = 14 + h(i, 2) * 22; const a = A * 0.35 * Math.sin(u * Math.PI) * (p.dissolve ? 1 - clamp(t / 3) : 1); const g = c.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(px - r, py - r, r * 2, r * 2); }
  },
  lost(c, p, t, A, G) {
    const x0 = p.x ?? 300, y0 = p.y ?? 205, n = p.n ?? 6;
    for (let i = 0; i < n; i++) { const x = x0 + Math.sin(G * 0.7 + i * 2) * 44 + Math.cos(G * 0.3 + i) * 20, y = y0 + Math.cos(G * 0.9 + i * 3) * 8, a = A * (0.5 + 0.3 * Math.sin(G + i)); c.globalAlpha = a; person(c, x, y, 0.62, 0.15, '#04060d'); c.globalAlpha = 1; glow(c, x, y - 14, 14, '#8a8fb0', 0.18 * a); }
    for (let i = 0; i < 8; i++) { const u = fr(G * 0.07 + i / 8); c.fillStyle = rgba('#b8b8d0', 0.1 * A); c.beginPath(); c.arc(x0 - 70 + u * 160, y0 - 20 + Math.sin(i) * 30, 30 + h(i) * 20, 0, TAU); c.fill(); }
  },
  /* tiny keyword stars: a soft light pulse to mark small particle words */
  pulse(c, p, t, A, G) { const x = p.x ?? 200, y = p.y ?? 120; for (let i = 0; i < 3; i++) { const u = fr(G * 0.4 + i / 3); c.strokeStyle = rgba(p.col || C.gold, 0.5 * (1 - u) * A); c.lineWidth = 2; c.beginPath(); c.arc(x, y, 6 + u * (p.r ?? 40), 0, TAU); c.stroke(); } glow(c, x, y, 26, p.col || C.gold, 0.5 * A); }
};

/* ---------- Scene runtime ---------- */
class Scene {
  constructor(canvas) {
    this.cv = canvas; this.c = canvas.getContext('2d'); this.spec = { sky: 'night', items: [] }; this.reveal = -1; this.born = []; this.t0 = performance.now(); this.running = false; this.dpr = 1;
    this.resize(); this._raf = this._raf.bind(this);
  }
  resize() {
    const r = this.cv.getBoundingClientRect(); this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.cv.width = Math.max(2, Math.round(r.width * this.dpr)); this.cv.height = Math.max(2, Math.round(r.height * this.dpr));
  }
  set(spec) { this.spec = spec || { sky: 'night', items: [] }; this.reveal = -1; this.born = (this.spec.items || []).map(() => null); this.t0 = performance.now(); this.show(0); }
  show(w) { // reveal every item whose word index <= w
    const now = performance.now() / 1000; if (w > this.reveal) this.reveal = w;
    (this.spec.items || []).forEach((it, i) => { if (this.born[i] == null && it.w <= this.reveal) this.born[i] = now; });
  }
  all() { this.show(99); }
  start() { if (!this.running) { this.running = true; requestAnimationFrame(this._raf); } }
  stop() { this.running = false; }
  _raf() { if (!this.running) return; this.draw(); requestAnimationFrame(this._raf); }
  draw() {
    const c = this.c, k = this.cv.width / W, G = (performance.now() - this.t0) / 1000;
    c.setTransform(k, 0, 0, k, 0, 0); c.clearRect(0, 0, W, this.cv.height / k);
    drawSky(c, this.spec, G); drawGround(c, this.spec, G);
    const now = performance.now() / 1000;
    (this.spec.items || []).forEach((it, i) => {
      if (this.born[i] == null) return; const t = now - this.born[i], A = ease(t / 0.9), fn = AC[it.a]; if (!fn) return;
      c.save(); try { fn(c, it, t, A, G); } catch (e) { console.warn('actor', it.a, e); } c.restore();
    });
    const v = c.createRadialGradient(W / 2, H / 2, 90, W / 2, H / 2, 260); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.45)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  }
}
window.FahmScene = Scene; window.FahmActors = AC;
})();

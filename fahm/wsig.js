/* Fahm Word Signatures (Build 31)
   1) ~45 new meaning-scenes so grammar words (from, in, to, who, if, this, he, indeed...) and common nouns/verbs each get
      a visual that SHOWS their meaning instead of one generic arrow / rosette.
   2) A per-word signature layer: the word's own root letters as living calligraphy + a medallion whose barcode ring,
      star polygon and letter-orbit are built from that exact word, so no two different words ever look the same.
   Canvas 2D only, offline, light enough for phones. */
(function () {
'use strict';
const WS = window.FahmWS; if (!WS || !WS.helpers) return;
const { glow, path, lab, rgba, ease, lerp, rnd, hash, clamp } = WS.helpers;
const AR = WS.archetypes, TAU = Math.PI * 2, PI = Math.PI;
const GOLD = '#dcab40', GOLD2 = '#f3d98b', CY = '#33cbe0', ROSE = '#e0587a', INK = '#f3e9d2', JADE = '#57e0b4', EMB = '#ff8a3d', RED = '#d8434e', LIL = '#b9a8ff';
const PAL = [[GOLD2, CY], [CY, GOLD2], [GOLD2, ROSE], [JADE, GOLD2], [CY, ROSE], [GOLD2, LIL]];
const pal = P => PAL[(P.seed >>> 3) % PAL.length];
const dot = (c, x, y, r, col, a) => { if (a <= 0) return; c.fillStyle = rgba(col, Math.min(1, a)); c.beginPath(); c.arc(x, y, Math.max(.2, r), 0, TAU); c.fill(); };
const ring = (c, x, y, r, col, a, w = 1.2, dash) => { if (a <= 0 || r <= 0) return; c.strokeStyle = rgba(col, Math.min(1, a)); c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); if (dash) c.setLineDash([]); };
const orb = (c, x, y, r, col, p = 1) => { if (p <= 0) return; glow(c, x, y, r * 3.2, col, .5 * p); const g = c.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r); g.addColorStop(0, rgba('#ffffff', .95 * p)); g.addColorStop(.4, rgba(col, .9 * p)); g.addColorStop(1, rgba(col, .2 * p)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
const head = (c, x, y, a, s, col, al) => { c.fillStyle = rgba(col, al); c.beginPath(); c.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s); c.lineTo(x + Math.cos(a + 2.5) * s * .8, y + Math.sin(a + 2.5) * s * .8); c.lineTo(x + Math.cos(a - 2.5) * s * .8, y + Math.sin(a - 2.5) * s * .8); c.closePath(); c.fill(); };
const q = (x0, y0, cx, cy, x1, y1, u) => [(1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1];
const curve = (c, x0, y0, cx, cy, x1, y1, col, a, w = 1.2, k = 1) => { c.strokeStyle = rgba(col, a); c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); for (let i = 1; i <= 24; i++) { const u = i / 24 * k, pt = q(x0, y0, cx, cy, x1, y1, u); c.lineTo(pt[0], pt[1]); } c.stroke(); };
const pill = (c, x, y, w, h, r, col, a, fill) => { c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - h / 2, w, h, r) : c.rect(x - w / 2, y - h / 2, w, h); if (fill) { c.fillStyle = rgba(fill, a * .18); c.fill(); } c.strokeStyle = rgba(col, a); c.lineWidth = 1.2; c.stroke(); };
const has = (g, re) => re.test(g);
/* a faceless light-pillar standing for a person (no face, no features) */
function pillar(c, x, y, h, col, a) { const g = c.createLinearGradient(x, y - h, x, y); g.addColorStop(0, rgba(col, .9 * a)); g.addColorStop(1, rgba(col, .05 * a)); c.fillStyle = g; c.beginPath(); c.moveTo(x - h * .09, y); c.lineTo(x - h * .055, y - h * .78); c.quadraticCurveTo(x, y - h * .86, x + h * .055, y - h * .78); c.lineTo(x + h * .09, y); c.closePath(); c.fill(); orb(c, x, y - h * .92, h * .075, col, a * .9); c.strokeStyle = rgba(col, .35 * a); c.beginPath(); c.ellipse(x, y, h * .16, h * .035, 0, 0, TAU); c.stroke(); }

/* ======================= PREPOSITIONS ======================= */
AR.from = (c, W, H, t, p, P) => { // origin: everything streams OUT of a source
  const [A1, A2] = pal(P), R = rnd(P.seed), sx = W * (.2 + R() * .06), sy = H * (.52 + R() * .08);
  for (let k = 0; k < 4; k++) ring(c, sx, sy, (16 + k * 13 + Math.sin(t * 2 + k) * 2.5) * p, A1, .55 - k * .12);
  orb(c, sx, sy, 10, A1, p);
  for (let i = 0; i < 34; i++) { const a = (R() - .5) * 1.7, sp = .18 + R() * .3, u = (t * sp + R()) % 1, L = W * .78 * u * p, x = sx + Math.cos(a) * L, y = sy + Math.sin(a) * L * .7, al = (1 - u) * p, col = i % 3 ? A1 : A2;
    path(c, [[x - Math.cos(a) * 14, y - Math.sin(a) * 10], [x, y]], col, 1.3, .65 * al); dot(c, x, y, 1.6 + (i % 4) * .4, col, al); }
  lab(c, P.l[0], sx, sy + H * .2, 'center', A1, P); lab(c, P.l[1], W * .06, H * .16, 'left', INK, P);
};
AR.inside = (c, W, H, t, p, P) => { // in: something held within a glass vessel
  const [A1, A2] = pal(P), R = rnd(P.seed), cx = W * (.46 + R() * .08), cy = H * .58, w = Math.min(W * .24, H * .42), h = H * .36 * p, top = cy - h / 2, bot = cy + h / 2;
  const g = c.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, rgba(A1, .04)); g.addColorStop(.5, rgba(A1, .14 * p)); g.addColorStop(1, rgba(A1, .04)); c.fillStyle = g;
  c.beginPath(); c.moveTo(cx - w, top); c.lineTo(cx - w * .78, bot); c.ellipse(cx, bot, w * .78, w * .16, 0, PI, 0, true); c.lineTo(cx + w, top); c.closePath(); c.fill();
  c.strokeStyle = rgba(A1, .85 * p); c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - w, top); c.lineTo(cx - w * .78, bot); c.moveTo(cx + w, top); c.lineTo(cx + w * .78, bot); c.stroke();
  c.beginPath(); c.ellipse(cx, top, w, w * .2, 0, 0, TAU); c.stroke(); c.beginPath(); c.ellipse(cx, bot, w * .78, w * .16, 0, 0, PI); c.stroke();
  const lv = top + h * .35; c.strokeStyle = rgba(A2, .55 * p); for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(cx, lv + k * 4, w * (.9 - k * .03) * (.9 + .1 * Math.sin(t * 2 + k)), w * .15, 0, 0, TAU); c.stroke(); }
  const oy = cy + h * .12 + Math.sin(t * 1.6) * h * .1; orb(c, cx, oy, 9, A2, p);
  for (let i = 0; i < 14; i++) { const u = (t * (.1 + R() * .15) + R()) % 1, x = cx + (R() - .5) * w * 1.3, y = bot - u * h * .9; dot(c, x, y, 1.3, A1, (1 - u) * .8 * p); }
  lab(c, P.l[0], cx, top - w * .35, 'center', A1, P); lab(c, P.l[1], W * .94, H * .9, 'right', INK, P);
};
AR.toward = (c, W, H, t, p, P) => { // to: many paths converge on a destination
  const [A1, A2] = pal(P), R = rnd(P.seed), tx = W * (.76 + R() * .06), ty = H * (.46 + R() * .1);
  for (let k = 0; k < 4; k++) ring(c, tx, ty, 9 + k * 11 + Math.sin(t * 2.5 - k) * 2, k % 2 ? A2 : A1, (.8 - k * .15) * p);
  orb(c, tx, ty, 6, A2, p);
  for (let i = 0; i < 6; i++) { const sx = W * .05, sy = H * (.15 + i * .14), cx2 = W * (.35 + R() * .2), cy2 = sy + (ty - sy) * .2 + (R() - .5) * H * .2;
    curve(c, sx, sy, cx2, cy2, tx - 12, ty, A1, .28 * p, 1, p);
    for (let j = 0; j < 3; j++) { const u = ((t * .35 + j / 3 + i * .13) % 1) * p, pt = q(sx, sy, cx2, cy2, tx - 12, ty, u); dot(c, pt[0], pt[1], 2.2, j % 2 ? A2 : A1, Math.sin(u * PI) * p); } }
  head(c, tx - 20, ty, 0, 9, A1, .9 * p);
  lab(c, P.l[0], tx, ty + H * .2, 'center', A2, P); lab(c, P.l[1], W * .05, H * .07, 'left', INK, P);
};
AR.upon = (c, W, H, t, p, P) => { // on / upon / over: resting on (or hovering over) a surface
  const [A1, A2] = pal(P), R = rnd(P.seed), over = has(P.g || '', /\bover\b|\babove\b/), cx = W * (.45 + R() * .1), sy = H * .72;
  c.strokeStyle = rgba(A1, .5 * p); c.lineWidth = 1; c.beginPath(); c.moveTo(W * .08, sy + H * .12); c.lineTo(W * .26, sy - H * .06); c.lineTo(W * .92, sy - H * .06); c.lineTo(W * .74, sy + H * .12); c.closePath(); c.stroke();
  for (let i = 1; i < 6; i++) { const k = i / 6; path(c, [[lerp(W * .08, W * .74, k), sy + H * .12], [lerp(W * .26, W * .92, k), sy - H * .06]], A1, .8, .18 * p); }
  const land = over ? sy - H * .3 : sy - 8, k = ease(clamp(t / 1.3)), bounce = over ? Math.sin(t * 1.7) * 5 : Math.abs(Math.sin(k * PI * 2.5)) * (1 - k) * H * .12, y = lerp(-20, land, k) - bounce;
  c.fillStyle = rgba('#000000', .35 * k); c.beginPath(); c.ellipse(cx, sy + 2, 26 * (over ? .6 : 1) * k, 6 * k, 0, 0, TAU); c.fill();
  if (over) { c.setLineDash([2, 5]); path(c, [[cx, y + 12], [cx, sy]], A2, 1, .6 * p); c.setLineDash([]); }
  c.save(); c.translate(cx, y); c.rotate(t * .4); c.strokeStyle = rgba(A2, .95 * p); c.lineWidth = 1.5; c.strokeRect(-11, -11, 22, 22); c.restore(); orb(c, cx, y, 5, A2, p);
  lab(c, P.l[0], cx + 30, y - 16, 'left', A2, P); lab(c, P.l[1], W * .5, H * .95, 'center', INK, P);
};
AR.under = (c, W, H, t, p, P) => { // under / beneath: a canopy above, the thing below it
  const [A1, A2] = pal(P), cx = W * .5, ty = H * .3, w = W * .32;
  c.strokeStyle = rgba(A1, .8 * p); c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - w, ty + 18); c.quadraticCurveTo(cx, ty - 40 * p, cx + w, ty + 18); c.stroke();
  for (let i = 0; i < 9; i++) { const x = cx - w + i * w / 4, l = 14 + 8 * Math.sin(t * 2 + i); path(c, [[x, ty + 18 - Math.sin(i / 8 * PI) * 34 * p], [x, ty + 18 - Math.sin(i / 8 * PI) * 34 * p + l]], A1, 1, .35 * p); }
  const y = H * .7 + Math.sin(t * 1.4) * 6; orb(c, cx, y, 10, A2, p); c.setLineDash([2, 6]); path(c, [[cx, ty + 20], [cx, y - 14]], A2, 1, .55 * p); c.setLineDash([]);
  lab(c, P.l[0], cx + 18, y + 22, 'left', A2, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.together = (c, W, H, t, p, P) => { // with: two travelling side by side, joined
  const [A1, A2] = pal(P), R = rnd(P.seed), u = (t * .12 + R()) % 1, x = lerp(W * .12, W * .88, u), y = H * .55 + Math.sin(u * TAU * 1.5) * H * .12, d = 18 + 4 * Math.sin(t * 2);
  for (let k = 1; k < 30; k++) { const uu = u - k * .008; if (uu < 0) break; const xx = lerp(W * .12, W * .88, uu), yy = H * .55 + Math.sin(uu * TAU * 1.5) * H * .12; dot(c, xx, yy - d, 1.6, A1, (1 - k / 30) * .6 * p); dot(c, xx, yy + d, 1.6, A2, (1 - k / 30) * .6 * p); }
  path(c, [[x, y - d], [x, y + d]], INK, 1.2, .5 * p); orb(c, x, y - d, 8, A1, p); orb(c, x, y + d, 8, A2, p);
  lab(c, P.l[0], W * .5, H * .16, 'center', A1, P); lab(c, P.l[1], W * .5, H * .9, 'center', INK, P);
};
AR.belong = (c, W, H, t, p, P) => { // of: a small thing linked by a chain to what it belongs to
  const [A1, A2] = pal(P), bx = W * .7, by = H * .5, sx = W * .26, sy = H * .56 + Math.sin(t * 1.3) * 6;
  ring(c, bx, by, 34, A1, .5 * p, 1, [3, 4]); orb(c, bx, by, 18, A1, p); orb(c, sx, sy, 8, A2, p);
  const n = 7; for (let i = 0; i < n; i++) { const k = (i + .5) / n; if (k > p) break; const x = lerp(sx + 10, bx - 20, k), y = lerp(sy, by, k) + Math.sin(k * PI) * 8, a = Math.atan2(by - sy, bx - sx);
    c.save(); c.translate(x, y); c.rotate(a + (i % 2 ? PI / 2 : 0) * 0); c.strokeStyle = rgba(i % 2 ? A2 : A1, .85); c.lineWidth = 1.3; c.beginPath(); c.ellipse(0, 0, 7, i % 2 ? 2 : 4, i % 2 ? 0 : 0, 0, TAU); c.stroke(); c.restore(); }
  lab(c, P.l[0], sx, sy + 26, 'center', A2, P); lab(c, P.l[1], bx, by - 50, 'center', INK, P);
};
AR.forr = (c, W, H, t, p, P) => { // for: something offered and received in an open bowl
  const [A1, A2] = pal(P), bx = W * .7, by = H * .7, ax = W * .2, ay = H * .7, u = (t * .35) % 1, pt = q(ax, ay, W * .45, H * .05, bx, by - 10, ease(u));
  c.strokeStyle = rgba(A1, .9 * p); c.lineWidth = 1.6; c.beginPath(); c.ellipse(bx, by - 10, 34, 10, 0, 0, PI); c.stroke(); c.beginPath(); c.ellipse(bx, by - 10, 34, 6, 0, PI, TAU); c.stroke();
  glow(c, bx, by - 10, 40, A1, (u > .9 ? 1 : .4) * p); curve(c, ax, ay, W * .45, H * .05, bx, by - 10, A2, .25 * p, 1);
  orb(c, pt[0], pt[1], 7, A2, p); orb(c, ax, ay, 5, A2, .5 * p);
  lab(c, P.l[0], bx, by + 18, 'center', A1, P); lab(c, P.l[1], W * .06, H * .14, 'left', INK, P);
};
AR.between = (c, W, H, t, p, P) => { // between: held between two
  const [A1, A2] = pal(P), x1 = W * .25, x2 = W * .75, y = H * .55;
  [x1, x2].forEach(x => { c.strokeStyle = rgba(A1, .8 * p); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - H * .28 * p); c.lineTo(x, y + H * .28 * p); c.stroke(); glow(c, x, y - H * .28 * p, 12, A1, p); });
  const x = lerp(x1 + 20, x2 - 20, .5 + .5 * Math.sin(t * 1.4)); orb(c, x, y, 9, A2, p); c.setLineDash([2, 5]); path(c, [[x1, y], [x2, y]], A2, 1, .35 * p); c.setLineDash([]);
  lab(c, P.l[0], W * .5, y + H * .3, 'center', A2, P); lab(c, P.l[1], W * .5, H * .1, 'center', INK, P);
};
AR.among = (c, W, H, t, p, P) => { // among: one in the midst of many
  const [A1, A2] = pal(P), R = rnd(P.seed), cx = W * .5, cy = H * .55;
  for (let i = 0; i < 40; i++) { const a = R() * TAU + t * .05 * (i % 2 ? 1 : -1), r = (30 + R() * Math.min(W, H) * .32) * p; dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * .7, 2 + R() * 1.5, i % 3 ? A1 : INK, .55); }
  orb(c, cx, cy, 10, A2, p); ring(c, cx, cy, 22 + 3 * Math.sin(t * 2), A2, .6 * p);
  lab(c, P.l[0], cx, cy + H * .34, 'center', A2, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.against = (c, W, H, t, p, P) => { // against: two forces pushing on each other
  const [A1, A2] = pal(P), y = H * .55, sh = Math.sin(t * 6) * 2, m = W * .5 + Math.sin(t * .9) * W * .04;
  for (let k = 0; k < 3; k++) { const yy = y + (k - 1) * 18; path(c, [[W * .08, yy], [m - 10 + sh, yy]], A1, 2.2, (.85 - k * .2) * p); head(c, m - 6 + sh, yy, 0, 10, A1, .9 * p); path(c, [[W * .92, yy], [m + 10 - sh, yy]], A2, 2.2, (.85 - k * .2) * p); head(c, m + 6 - sh, yy, PI, 10, A2, .9 * p); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * 3, r = 10 + 8 * ((t * 3 + i) % 1); dot(c, m + Math.cos(a) * r, y + Math.sin(a) * r * 1.6, 1.4, GOLD2, (1 - ((t * 3 + i) % 1)) * p); }
  lab(c, P.l[0], W * .5, y + H * .28, 'center', INK, P); lab(c, P.l[1], W * .5, H * .12, 'center', A1, P);
};
AR.about = (c, W, H, t, p, P) => { // about / concerning: the topic, with words orbiting it
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .52; orb(c, cx, cy, 13, A1, p);
  for (let k = 0; k < 3; k++) { const rx = (50 + k * 28) * p, ry = rx * .32, rot = -.3 + k * .3; c.save(); c.translate(cx, cy); c.rotate(rot); c.strokeStyle = rgba(A2, .35); c.lineWidth = 1; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.stroke();
    const a = t * (.6 - k * .12) + k * 2; c.translate(Math.cos(a) * rx, Math.sin(a) * ry); c.rotate(-rot); for (let j = 0; j < 3; j++) path(c, [[-10, -4 + j * 4], [10 - j * 4, -4 + j * 4]], A2, 1.4, .8); c.restore(); }
  lab(c, P.l[0], cx, cy + H * .32, 'center', A1, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.besides = (c, W, H, t, p, P) => { // besides / except / other than: one set apart from the group
  const [A1, A2] = pal(P), R = rnd(P.seed), cx = W * .38, cy = H * .55, r = Math.min(W, H) * .28 * p;
  ring(c, cx, cy, r, A1, .6, 1.2, [4, 5]); for (let i = 0; i < 26; i++) { const a = R() * TAU, rr = R() * r * .85; dot(c, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2.2, A1, .6 * p); }
  const ox = W * .8 + Math.sin(t) * 4, oy = H * .42; orb(c, ox, oy, 11, A2, p); c.setLineDash([2, 5]); path(c, [[cx + r, cy], [ox - 16, oy]], A2, 1, .5 * p); c.setLineDash([]);
  lab(c, P.l[0], ox, oy + 28, 'center', A2, P); lab(c, P.l[1], cx, cy + r + 18, 'center', INK, P);
};
AR.like = (c, W, H, t, p, P) => { // like / as: a thing and its likeness across a mirror
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55, d = W * .2;
  c.strokeStyle = rgba(INK, .4 * p); c.lineWidth = 1; c.beginPath(); for (let y = H * .15; y < H * .9; y += 4) { const x = cx + Math.sin(y * .05 + t * 3) * 2; y === H * .15 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  const s = 1 + .08 * Math.sin(t * 2); [[cx - d, A1, 1], [cx + d, A2, .55]].forEach(([x, col, a]) => { c.save(); c.translate(x, cy); c.scale(s, s); c.strokeStyle = rgba(col, a * p); c.lineWidth = 1.6; c.beginPath(); for (let i = 0; i <= 10; i++) { const an = -PI / 2 + i / 10 * TAU, rr = i % 2 ? 12 : 28; i ? c.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : c.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); } c.stroke(); c.restore(); glow(c, x, cy, 24, col, a * p * .6); });
  lab(c, P.l[0], cx, H * .1, 'center', A1, P); lab(c, P.l[1], cx, H * .94, 'center', INK, P);
};

/* ======================= LINKS, CONDITIONS, POINTERS ======================= */
AR.bridge = (c, W, H, t, p, P) => { // who / which / that (relative): a bridge joining a thing to what is said about it
  const [A1, A2] = pal(P), y = H * .6, x1 = W * .2, x2 = W * .8;
  [[x1, A1], [x2, A2]].forEach(([x, col]) => { pill(c, x, y, W * .2, H * .2, 8, col, .85 * p, col); for (let j = 0; j < 3; j++) path(c, [[x - W * .07, y - 10 + j * 9], [x + W * (.07 - j * .02), y - 10 + j * 9]], col, 1.6, .7 * p); });
  const bx0 = x1 + W * .1, bx1 = x2 - W * .1; curve(c, bx0, y - H * .06, W * .5, y - H * .45, bx1, y - H * .06, INK, .8, 1.6, p);
  for (let i = 1; i < 8; i++) { const pt = q(bx0, y - H * .06, W * .5, y - H * .45, bx1, y - H * .06, i / 8); if (i / 8 > p) break; path(c, [[pt[0], pt[1]], [pt[0], y - H * .06]], INK, .8, .3); }
  const u = (t * .4) % 1, pt = q(bx0, y - H * .06, W * .5, y - H * .45, bx1, y - H * .06, u); orb(c, pt[0], pt[1], 6, GOLD2, p);
  lab(c, P.l[0], W * .5, y - H * .34, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .92, 'center', INK, P);
};
AR.link = (c, W, H, t, p, P) => { // and / then / so: a chain of steps, each lighting the next
  const [A1, A2] = pal(P), R = rnd(P.seed), n = 5 + (P.seed % 3), then = has(P.g || '', /^(then|so|and then)\b/);
  const pts = []; for (let i = 0; i < n; i++) { const k = i / (n - 1); pts.push([W * (.1 + .8 * k), then ? H * (.3 + .45 * k) : H * (.55 + Math.sin(k * PI * 1.2 + R()) * .14)]); }
  for (let i = 0; i < n - 1; i++) { if (i / (n - 1) > p) break; path(c, [pts[i], pts[i + 1]], A1, 1.2, .45); }
  const cur = (t * 1.2) % n; pts.forEach((pt, i) => { const on = Math.max(0, 1 - Math.abs(cur - i)); ring(c, pt[0], pt[1], 9 + on * 5, A1, .6 * p); orb(c, pt[0], pt[1], 4 + on * 3, on > .3 ? A2 : A1, p); });
  lab(c, P.l[0], W * .5, H * .12, 'center', A2, P); lab(c, P.l[1], W * .5, H * .93, 'center', INK, P);
};
AR.fork = (c, W, H, t, p, P) => { // if / when: the road splits; one branch lights up as the result
  const [A1, A2] = pal(P), jx = W * .5, jy = H * .58, side = Math.floor(t / 1.8) % 2;
  path(c, [[jx, H * .98], [jx, jy]], INK, 2, .7 * p);
  [[-1, A1], [1, A2]].forEach(([d, col], k) => { const on = k === side; curve(c, jx, jy, jx + d * W * .05, jy - H * .25, jx + d * W * .34, H * .12, col, (on ? .95 : .25) * p, on ? 2.2 : 1.2, p); if (on) { const u = (t / 1.8) % 1, pt = q(jx, jy, jx + d * W * .05, jy - H * .25, jx + d * W * .34, H * .12, u); orb(c, pt[0], pt[1], 6, col, p); } });
  c.save(); c.translate(jx, jy); c.rotate(PI / 4); c.strokeStyle = rgba(GOLD2, .9 * p); c.lineWidth = 1.5; c.strokeRect(-7, -7, 14, 14); c.restore();
  lab(c, P.l[0], jx + 16, jy + 18, 'left', GOLD2, P); lab(c, P.l[1], W * .5, H * .95, 'center', INK, P);
};
AR.choice = (c, W, H, t, p, P) => { // or: two options, attention swings between them
  const [A1, A2] = pal(P), y = H * .55, s = Math.sin(t * 1.6); path(c, [[W * .2, y], [W * .8, y]], INK, 1.2, .5 * p);
  [[W * .25, A1, s > 0], [W * .75, A2, s <= 0]].forEach(([x, col, on]) => { c.save(); c.translate(x, y - 22); c.rotate(PI / 4 + t * .3); c.strokeStyle = rgba(col, (on ? 1 : .35) * p); c.lineWidth = on ? 2 : 1; c.strokeRect(-13, -13, 26, 26); c.restore(); if (on) glow(c, x, y - 22, 34, col, .6 * p); });
  dot(c, W * .5 + s * W * .22, y, 3, GOLD2, p); lab(c, P.l[0], W * .5, y + 30, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .12, 'center', INK, P);
};
AR.turn = (c, W, H, t, p, P) => { // but / rather / nay-rather: a road that turns sharply
  const [A1, A2] = pal(P), bx = W * .58, by = H * .66, k = ease(clamp(t / 1.6));
  path(c, [[W * .06, by], [bx, by]], A1, 2, .8 * p); const ex = bx + W * .22 * k, ey = by - H * .5 * k; path(c, [[bx, by], [ex, ey]], A2, 2.4, .95 * p); head(c, ex, ey, Math.atan2(-H * .5, W * .22), 10, A2, p);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = 8 + ((t * 2 + i * .1) % 1) * 22; dot(c, bx + Math.cos(a) * r, by + Math.sin(a) * r, 1.4, GOLD2, (1 - ((t * 2 + i * .1) % 1)) * p); }
  lab(c, P.l[0], bx - 10, by + 22, 'right', A1, P); lab(c, P.l[1], W * .06, H * .12, 'left', INK, P);
};
AR.near = (c, W, H, t, p, P) => { // this / these: right here, close to you
  const [A1, A2] = pal(P), many = has(P.g || '', /these/), cx = W * .38, cy = H * .62;
  path(c, [[W * .5, H * 1.02], [cx + 8, cy + 26]], INK, 1.4, .6 * p); head(c, cx + 6, cy + 24, Math.atan2(cy + 24 - H, cx - W * .5), 9, INK, .8 * p);
  (many ? [[-30, 6], [0, -10], [30, 4]] : [[0, 0]]).forEach(([dx, dy], i) => { orb(c, cx + dx, cy + dy, many ? 12 : 22, i % 2 ? A2 : A1, p); ring(c, cx + dx, cy + dy, (many ? 20 : 34) + 4 * Math.sin(t * 2 + i), A1, .5 * p); });
  lab(c, P.l[0], cx, cy - H * .25, 'center', A1, P); lab(c, P.l[1], W * .94, H * .9, 'right', INK, P);
};
AR.far = (c, W, H, t, p, P) => { // that / those: over there, far away
  const [A1, A2] = pal(P), many = has(P.g || '', /those/), vx = W * .7, vy = H * .34;
  for (let i = 0; i < 9; i++) { const x = lerp(-W * .2, W * 1.2, i / 8); path(c, [[x, H], [vx, vy]], A1, .8, .16 * p); } path(c, [[0, vy], [W, vy]], A1, .8, .25 * p);
  c.setLineDash([3, 6]); path(c, [[W * .3, H * .98], [vx - 6, vy + 8]], INK, 1.2, .6 * p); c.setLineDash([]);
  (many ? [-14, 0, 14] : [0]).forEach((dx, i) => orb(c, vx + dx, vy - 4 - (i % 2) * 3, 4.5, i % 2 ? A2 : GOLD2, p));
  lab(c, P.l[0], vx, vy - 26, 'center', GOLD2, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.pron = (c, W, H, t, p, P) => { // he / she / you / I / we / they: who is being spoken about (faceless pillars of light)
  const [A1, A2] = pal(P), g = P.g || '', gy = H * .86, hh = H * .5;
  const me = /\b(i|me|my|myself)\b/.test(g), we = /\b(we|us|our|ourselves)\b/.test(g), you = /\b(you|your|yours|yourselves|yourself)\b/.test(g), they = /\b(they|them|their|themselves)\b/.test(g);
  path(c, [[W * .04, gy], [W * .96, gy]], INK, 1, .25 * p);
  if (we) { [-.18, -.06, .06, .18].forEach((d, i) => pillar(c, W * (.5 + d), gy, hh * (i === 1 ? 1 : .86), i === 1 ? A1 : A2, p)); }
  else if (me) { pillar(c, W * .5, gy, hh, A1, p); ring(c, W * .5, gy - hh * .92, 22 + 3 * Math.sin(t * 2), A1, .5 * p); }
  else if (you) { pillar(c, W * .26, gy, hh * .8, A2, p * .7); pillar(c, W * .72, gy, hh, A1, p); for (let i = 0; i < 3; i++) { const u = ((t * .6 + i / 3) % 1); c.strokeStyle = rgba(GOLD2, (1 - u) * .8 * p); c.lineWidth = 1.4; c.beginPath(); c.arc(W * .3, gy - hh * .72, 18 + u * W * .34, -.25, .25); c.stroke(); } }
  else { const n = they ? 3 : 1, vx = W * .72; for (let i = 0; i < n; i++) pillar(c, vx + (i - (n - 1) / 2) * W * .09, gy - H * .1, hh * .55, i % 2 ? A2 : A1, p * .85); pillar(c, W * .22, gy, hh * .7, INK, p * .3); c.setLineDash([2, 6]); path(c, [[W * .28, gy - hh * .5], [vx - W * .1, gy - H * .1 - hh * .4]], INK, 1, .5 * p); c.setLineDash([]); }
  lab(c, P.l[0], W * .5, H * .1, 'center', A1, P); lab(c, P.l[1], W * .5, H * .96, 'center', INK, P);
};
AR.seal = (c, W, H, t, p, P) => { // indeed / verily / certainly: a seal pressed down — this is certain
  const [A1, A2] = pal(P), cx = W * .5, base = H * .66, k = ease(clamp(t / .9)), y = lerp(-40, base - 34, k);
  path(c, [[W * .12, base], [W * .88, base]], A1, 1.4, .7 * p);
  if (k >= 1) { const u = (t - .9) % 2.2 / 2.2; ring(c, cx, base, 30 + u * W * .4, A1, (1 - u) * .7, 1.5); }
  c.save(); c.translate(cx, y); c.rotate(t * .2); for (let s = 0; s < 2; s++) { c.save(); c.rotate(s * PI / 4); c.strokeStyle = rgba(s ? A2 : A1, .95 * p); c.lineWidth = 1.8; c.strokeRect(-24, -24, 48, 48); c.restore(); } c.restore();
  ring(c, cx, y, 16, GOLD2, .9 * p, 1.5); orb(c, cx, y, 6, GOLD2, p);
  lab(c, P.l[0], cx, base + 24, 'center', A1, P); lab(c, P.l[1], cx, H * .1, 'center', INK, P);
};
AR.question = (c, W, H, t, p, P) => { // what / how / why: a question gathering towards its answer
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .5;
  for (let i = 0; i < 70; i++) { const k = i / 70, a = k * TAU * 3 + t * .8, r = (1 - k) * Math.min(W, H) * .38 * p + 14; dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * .8, 1 + k * 2, k > .6 ? A2 : A1, (.2 + .7 * k) * p); }
  c.save(); c.font = `700 ${Math.round(H * .22)}px Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 1.6; c.strokeStyle = rgba(GOLD2, .9 * p); c.setLineDash([300]); c.lineDashOffset = 300 * (1 - p); c.strokeText('?', cx, cy); c.restore();
  lab(c, P.l[0], cx, cy + H * .36, 'center', A2, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.call = (c, W, H, t, p, P) => { // O / O you: a call that travels out to the listener
  const [A1, A2] = pal(P), sx = W * .16, sy = H * .55;
  orb(c, sx, sy, 8, A1, p); for (let i = 0; i < 5; i++) { const u = ((t * .5 + i / 5) % 1); c.strokeStyle = rgba(i % 2 ? A2 : A1, (1 - u) * .85 * p); c.lineWidth = 2 - u; c.beginPath(); c.arc(sx, sy, 14 + u * W * .7, -.55, .55); c.stroke(); }
  pillar(c, W * .82, H * .86, H * .42, A2, p * .7);
  lab(c, P.l[0], sx, sy + 30, 'center', A1, P); lab(c, P.l[1], W * .5, H * .1, 'center', INK, P);
};
AR.wall = (c, W, H, t, p, P) => { // nay / never: a firm wall — the claim is rejected
  const [A1] = pal(P), wx = W * .62, k = ease(clamp(t / 1.2));
  for (let r = 0; r < 6; r++) for (let j = 0; j < 2; j++) { const y = H * .85 - (r + 1) * H * .1 * k; c.strokeStyle = rgba(r % 2 ? A1 : ROSE, .8 * p); c.lineWidth = 1.3; c.strokeRect(wx - 26 + (r % 2) * 13 + j * 26 - 13, y, 26, H * .1 * k); }
  const u = (t * .5) % 1, x = u < .6 ? lerp(W * .05, wx - 40, u / .6) : lerp(wx - 40, W * .2, (u - .6) / .4); path(c, [[x - 24, H * .55], [x, H * .55]], INK, 2, .8 * p); head(c, x, H * .55, u < .6 ? 0 : PI, 9, INK, .9 * p);
  if (u > .55 && u < .7) glow(c, wx - 38, H * .55, 30, ROSE, p);
  lab(c, P.l[0], wx, H * .12, 'center', ROSE, P); lab(c, P.l[1], W * .06, H * .92, 'left', INK, P);
};
AR.compass = (c, W, H, t, p, P) => { // where / wherever: every direction
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55, r = Math.min(W, H) * .32 * p;
  ring(c, cx, cy, r, A1, .6); ring(c, cx, cy, r * .7, A1, .3, 1, [2, 4]);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, l = i % 4 ? .85 : 1.12; path(c, [[cx + Math.cos(a) * r * .74, cy + Math.sin(a) * r * .74], [cx + Math.cos(a) * r * l, cy + Math.sin(a) * r * l]], i % 4 ? A1 : GOLD2, i % 4 ? 1 : 2, .8); }
  const a = Math.sin(t * .9) * 2.4; c.save(); c.translate(cx, cy); c.rotate(a); c.fillStyle = rgba(A2, .9 * p); c.beginPath(); c.moveTo(0, -r * .6); c.lineTo(6, 0); c.lineTo(0, r * .6); c.lineTo(-6, 0); c.closePath(); c.fill(); c.restore(); orb(c, cx, cy, 4, GOLD2, p);
  lab(c, P.l[0], cx, cy + r + 18, 'center', A2, P); lab(c, P.l[1], W * .06, H * .08, 'left', INK, P);
};
AR.cause = (c, W, H, t, p, P) => { // because / so that / lest: one thing sets off the next
  const [A1, A2] = pal(P), u = (t * .4) % 1, y = H * .62, ax = lerp(W * .08, W * .44, ease(Math.min(1, u / .5))), bx = u < .5 ? W * .5 : lerp(W * .5, W * .86, ease((u - .5) / .5));
  path(c, [[W * .04, y + 12], [W * .96, y + 12]], INK, 1, .3 * p); orb(c, ax, y, 10, A1, p); orb(c, bx, y, 10, A2, p);
  if (u > .48 && u < .62) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; dot(c, W * .47 + Math.cos(a) * 16, y + Math.sin(a) * 16, 1.5, GOLD2, p); }
  ring(c, W * .9, y, 16, A2, .6 * p, 1.2, [3, 3]); lab(c, P.l[0], W * .5, H * .2, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .9, 'center', INK, P);
};

/* ======================= QUANTITY & QUALITY ======================= */
AR.all = (c, W, H, t, p, P) => { // every / all / each: the whole set, lit one by one until none is left out
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55, r = Math.min(W, H) * .34, sweep = (t * .9) % (TAU + 1);
  ring(c, cx, cy, r + 8, A1, .7 * p, 1.5); let i = 0;
  for (let y = -r; y <= r; y += 12) for (let x = -r; x <= r; x += 12) { if (x * x + y * y > r * r) continue; const a = (Math.atan2(y, x) + PI); const on = a < sweep; dot(c, cx + x + ((y / 12) % 2 ? 6 : 0) * 0, cy + y, on ? 2.4 : 1.3, on ? (i++ % 5 ? A1 : A2) : INK, (on ? .9 : .2) * p); }
  lab(c, P.l[0], cx, cy + r + 22, 'center', A1, P); lab(c, P.l[1], W * .06, H * .08, 'left', INK, P);
};
AR.thing = (c, W, H, t, p, P) => { // thing / anything / whatever: varied things, any one of them
  const [A1, A2] = pal(P), R = rnd(P.seed), n = 9, hi = Math.floor(t * .8) % n;
  for (let i = 0; i < n; i++) { const x = W * (.12 + R() * .76), y = H * (.25 + R() * .55) + Math.sin(t + i) * 5, s = 9 + R() * 8, sides = 3 + (i % 4), on = i === hi; c.save(); c.translate(x, y); c.rotate(t * .3 * (i % 2 ? 1 : -1) + i); c.strokeStyle = rgba(on ? A2 : A1, (on ? 1 : .55) * p); c.lineWidth = on ? 2 : 1.2; c.beginPath();
    if (sides === 6) c.arc(0, 0, s, 0, TAU); else for (let k = 0; k <= sides; k++) { const a = k / sides * TAU; k ? c.lineTo(Math.cos(a) * s, Math.sin(a) * s) : c.moveTo(Math.cos(a) * s, Math.sin(a) * s); } c.stroke(); c.restore(); if (on) glow(c, x, y, s * 3, A2, .7 * p); }
  lab(c, P.l[0], W * .5, H * .1, 'center', A2, P); lab(c, P.l[1], W * .5, H * .95, 'center', INK, P);
};
AR.great = (c, W, H, t, p, P) => { // great / many / much: growing beyond the frame
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55;
  for (let k = 0; k < 9; k++) { const u = ((t * .25 + k / 9) % 1), s = 10 + u * Math.max(W, H) * .9; c.save(); c.translate(cx, cy); c.rotate(PI / 4 + u * .4); c.strokeStyle = rgba(k % 2 ? A2 : A1, (1 - u) * .8 * p); c.lineWidth = 1 + u * 2; c.strokeRect(-s / 2, -s / 2, s, s); c.restore(); }
  orb(c, cx, cy, 12, GOLD2, p); lab(c, P.l[0], cx, H * .1, 'center', GOLD2, P); lab(c, P.l[1], cx, H * .95, 'center', INK, P);
};
AR.little = (c, W, H, t, p, P) => { // little / few: very small, look closely
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55; orb(c, cx, cy, 3.2, A2, p);
  ring(c, cx - 2, cy - 2, 26 + Math.sin(t * 2) * 2, A1, .85 * p, 1.6); path(c, [[cx + 17, cy + 17], [cx + 44, cy + 44]], A1, 3, .85 * p);
  for (let i = -5; i <= 5; i++) path(c, [[cx + i * 6, H * .82], [cx + i * 6, H * .82 - (i % 5 ? 4 : 9)]], INK, 1, .5 * p);
  lab(c, P.l[0], cx, H * .18, 'center', A2, P); lab(c, P.l[1], cx, H * .94, 'center', INK, P);
};
AR.compare = (c, W, H, t, p, P) => { // better / best / more / than: one rises above the others
  const [A1, A2] = pal(P), R = rnd(P.seed), n = has(P.g || '', /\bthan\b/) ? 2 : 4, base = H * .86, top = H * .22, best = n - 1 - (P.seed % n);
  for (let i = 0; i < n; i++) { const x = W * (.2 + .6 * i / (n - 1)), hgt = (i === best ? 1 : .35 + R() * .35) * (base - top) * ease(clamp(t / 1.2 - i * .08)), on = i === best;
    const g = c.createLinearGradient(0, base - hgt, 0, base); g.addColorStop(0, rgba(on ? GOLD2 : A1, on ? .9 : .5)); g.addColorStop(1, rgba(on ? GOLD : A1, .08)); c.fillStyle = g; c.fillRect(x - 14, base - hgt, 28, hgt); c.strokeStyle = rgba(on ? GOLD2 : A1, .8 * p); c.strokeRect(x - 14, base - hgt, 28, hgt);
    if (on) { glow(c, x, base - hgt - 10, 26, GOLD2, p); dot(c, x, base - hgt - 10, 4, '#ffffff', p); } }
  path(c, [[W * .08, base], [W * .92, base]], INK, 1, .5 * p); lab(c, P.l[0], W * .5, H * .1, 'center', GOLD2, P); lab(c, P.l[1], W * .06, H * .94, 'left', INK, P);
};
AR.good = (c, W, H, t, p, P) => { // good / righteous: something good grows upward, branch by branch
  const [A1] = pal(P), R = rnd(P.seed), grow = ease(clamp(t / 2.2));
  const br = (x, y, a, l, d) => { if (d > 6 || l < 3) return; const k = clamp(grow * 7 - d); if (k <= 0) return; const x2 = x + Math.cos(a) * l * k, y2 = y + Math.sin(a) * l * k; path(c, [[x, y], [x2, y2]], d < 2 ? GOLD : A1, Math.max(.6, 3 - d * .45), .85); if (k < 1) return; if (d >= 4) { dot(c, x2, y2, 2.4, GOLD2, .9); glow(c, x2, y2, 8, GOLD2, .5 + .3 * Math.sin(t * 2 + x2)); }
    const sp = .35 + R() * .25; br(x2, y2, a - sp + Math.sin(t * .8 + d) * .03, l * (.7 + R() * .12), d + 1); br(x2, y2, a + sp + Math.sin(t * .8 + d) * .03, l * (.7 + R() * .12), d + 1); };
  br(W * .5, H * .96, -PI / 2, H * .22, 0); lab(c, P.l[0], W * .06, H * .1, 'left', GOLD2, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.evil = (c, W, H, t, p, P) => { // evil / wrongdoers / criminals: the ground cracks and things fall apart
  const R = rnd(P.seed), gy = H * .7; path(c, [[W * .03, gy], [W * .97, gy]], '#8a5a5a', 1.2, .6 * p);
  const k = ease(clamp(t / 1.6)); for (let j = 0; j < 4; j++) { let x = W * (.2 + .2 * j + R() * .08), y = gy; c.strokeStyle = rgba(RED, .8 * p); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y); for (let s = 0; s < 6 * k; s++) { x += (R() - .5) * 22; y += 8 + R() * 8; c.lineTo(x, y); } c.stroke(); }
  for (let i = 0; i < 26; i++) { const u = (t * (.08 + R() * .08) + R()) % 1, x = W * (.1 + R() * .8) + Math.sin(t + i) * 10, y = gy - u * H * .6; c.fillStyle = rgba('#3a2a30', (1 - u) * .55 * p); c.beginPath(); c.arc(x, y, 6 + u * 16, 0, TAU); c.fill(); }
  const fy = lerp(H * .15, gy - 14, (t * .35) % 1); c.strokeStyle = rgba(EMB, .8 * p); c.lineWidth = 1.5; c.beginPath(); c.arc(W * .66, fy, 12, .5, TAU - .3); c.stroke();
  lab(c, P.l[0], W * .06, H * .1, 'left', ROSE, P); lab(c, P.l[1], W * .94, H * .94, 'right', INK, P);
};
AR.truth = (c, W, H, t, p, P) => { // truth / clear: fog on one side, a crystal, and clean straight light on the other
  const [A1, A2] = pal(P), R = rnd(P.seed), cx = W * .48, cy = H * .52;
  for (let i = 0; i < 22; i++) { const x = W * (.03 + R() * .3) + Math.sin(t * .5 + i) * 8, y = H * (.2 + R() * .6); c.fillStyle = rgba('#9aa4b8', .09 * p * (1 - clamp(t / 6) * .6)); c.beginPath(); c.arc(x, y, 14 + R() * 16, 0, TAU); c.fill(); }
  path(c, [[W * .02, cy + 6], [cx - 20, cy]], INK, 1.4, .5 * p);
  for (let i = -3; i <= 3; i++) { const a = i * .09, l = W * .5 * p; path(c, [[cx + 20, cy], [cx + 20 + Math.cos(a) * l, cy + Math.sin(a) * l]], i % 2 ? A2 : A1, 1.5, .8); }
  c.save(); c.translate(cx, cy); c.rotate(Math.sin(t * .6) * .08); c.strokeStyle = rgba(GOLD2, .95 * p); c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -32); c.lineTo(22, 0); c.lineTo(0, 32); c.lineTo(-22, 0); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-22, 0); c.lineTo(22, 0); c.moveTo(0, -32); c.lineTo(0, 32); c.stroke(); c.restore(); glow(c, cx, cy, 30, GOLD2, .6 * p);
  lab(c, P.l[0], cx, cy - 48, 'center', GOLD2, P); lab(c, P.l[1], W * .94, H * .92, 'right', INK, P);
};
AR.iman = (c, W, H, t, p, P) => { // believe: a seed of light planted in the heart, roots below, flame above
  const [A1] = pal(P), cx = W * .5, cy = H * .6, s = Math.min(W, H) * .26;
  c.strokeStyle = rgba(ROSE, .75 * p); c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx, cy + s * .9); c.bezierCurveTo(cx - s * 1.4, cy + s * .1, cx - s * .8, cy - s * .9, cx, cy - s * .35); c.bezierCurveTo(cx + s * .8, cy - s * .9, cx + s * 1.4, cy + s * .1, cx, cy + s * .9); c.stroke();
  const k = ease(clamp(t / 2)); for (let i = 0; i < 5; i++) { const a = PI / 2 + (i - 2) * .32; curve(c, cx, cy + s * .2, cx + Math.cos(a) * s * .3, cy + s * .5, cx + Math.cos(a) * s * .55, cy + s * .2 + Math.sin(a) * s * .6, A1, .6 * p, 1, k); }
  orb(c, cx, cy + s * .15, 6, GOLD2, p); const fh = s * .7 * k * (1 + .08 * Math.sin(t * 6)); c.fillStyle = rgba(GOLD2, .85 * p); c.beginPath(); c.moveTo(cx, cy + s * .05); c.quadraticCurveTo(cx - 10, cy - fh * .4, cx, cy - fh); c.quadraticCurveTo(cx + 10, cy - fh * .4, cx, cy + s * .05); c.fill(); glow(c, cx, cy - fh * .5, fh * .7, GOLD2, .5 * p);
  lab(c, P.l[0], cx, H * .1, 'center', GOLD2, P); lab(c, P.l[1], cx, H * .95, 'center', INK, P);
};
AR.thorns = (c, W, H, t, p, P) => { // punishment / painful / severe: a ring of thorns closing in
  const cx = W * .5, cy = H * .55, R0 = Math.min(W, H) * (.38 - .05 * Math.sin(t * .8)) * p, n = 22;
  c.strokeStyle = rgba(RED, .85); c.lineWidth = 1.5; c.beginPath(); for (let i = 0; i <= n * 2; i++) { const a = i / (n * 2) * TAU + t * .1, r = i % 2 ? R0 * .78 : R0; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .8; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  for (let i = 0; i < 18; i++) { const u = (t * .4 + i / 18) % 1, a = i / 18 * TAU; dot(c, cx + Math.cos(a) * R0 * (1 - u * .5), cy + Math.sin(a) * R0 * .8 * (1 - u * .5), 1.6, EMB, (1 - u) * p); }
  glow(c, cx, cy, R0 * .5, RED, .35 * p); lab(c, P.l[0], cx, cy, 'center', ROSE, P); lab(c, P.l[1], cx, H * .96, 'center', INK, P);
};

/* ======================= THE UNSEEN WORLD, LIFE & BEING ======================= */
AR.messenger = (c, W, H, t, p, P) => { // messenger / warner / reminder: a message descends in light and is carried to the people (no person drawn)
  const [A1, A2] = pal(P), bx = W * .3, k = ease(clamp(t / 1.4)), u = (t * .18) % 1;
  const g = c.createLinearGradient(0, 0, 0, H * .7); g.addColorStop(0, rgba(GOLD2, .5 * p)); g.addColorStop(1, rgba(GOLD2, 0)); c.fillStyle = g; c.beginPath(); c.moveTo(bx - 6, 0); c.lineTo(bx + 6, 0); c.lineTo(bx + 30, H * .7 * k); c.lineTo(bx - 30, H * .7 * k); c.fill();
  const sx = lerp(bx, W * .78, ease(u)), sy = H * .68 - Math.sin(u * PI) * H * .08; c.save(); c.translate(sx, sy); c.strokeStyle = rgba(A1, .95 * p); c.lineWidth = 1.5; c.strokeRect(-16, -9, 32, 18); [-1, 1].forEach(d => { c.beginPath(); c.ellipse(d * 17, 0, 3.5, 10, 0, 0, TAU); c.stroke(); }); for (let j = 0; j < 3; j++) path(c, [[-10, -4 + j * 4], [10, -4 + j * 4]], A2, 1, .7); c.restore();
  for (let i = 0; i < 7; i++) dot(c, W * (.74 + (i % 4) * .05), H * (.82 + Math.floor(i / 4) * .06), 3, INK, .45 * p);
  lab(c, P.l[0], bx + 36, H * .12, 'left', GOLD2, P); lab(c, P.l[1], W * .94, H * .94, 'right', INK, P);
};
AR.angels = (c, W, H, t, p, P) => { // angels: wings of light, two, three and four (no figure)
  const [A1, A2] = pal(P), cx = W * .5, cy = H * .55 - Math.sin(t * .8) * 6, pairs = 2 + (P.seed % 3);
  for (let k = 0; k < pairs; k++) { const sp = (.55 + k * .3) + Math.sin(t * 2 + k) * .06; [-1, 1].forEach(d => { c.save(); c.translate(cx, cy + (k - (pairs - 1) / 2) * 16); c.scale(d, 1); c.rotate(-sp + .6); for (let f = 0; f < 7; f++) { const l = (40 + f * 7) * p * (1 - k * .15), a = -.2 + f * .14; c.strokeStyle = rgba(k % 2 ? A2 : A1, .75 - f * .06); c.lineWidth = 1.3; c.beginPath(); c.moveTo(4, 0); c.quadraticCurveTo(l * .5, -l * .45 + a * 30, l, a * 40 - 10); c.stroke(); } c.restore(); }); }
  orb(c, cx, cy, 8, '#ffffff', p); glow(c, cx, cy, 70, A1, .35 * p);
  lab(c, P.l[0], cx, H * .1, 'center', A1, P); lab(c, P.l[1], cx, H * .95, 'center', INK, P);
};
AR.shaitan = (c, W, H, t, p, P) => { // shaitan / enemy: a dark smoke that creeps and whispers, then slips back
  const R = rnd(P.seed), n = 40, back = (Math.sin(t * .7) + 1) / 2;
  for (let i = 0; i < n; i++) { const k = i / n, x = lerp(W * .9, W * .15 + back * W * .25, k * p), y = H * .55 + Math.sin(k * 9 - t * 2) * H * .12 * k; c.fillStyle = rgba(i % 5 ? '#2b2030' : '#4a1c24', (.65 * (1 - k * .4)) * p); c.beginPath(); c.arc(x, y, 4 + (1 - k) * 12 + R() * 3, 0, TAU); c.fill(); }
  for (let i = 0; i < 8; i++) { const u = (t * .7 + i / 8) % 1; dot(c, lerp(W * .9, W * .2, u), H * .55 + Math.sin(u * 9 - t * 2) * H * .1, 1.2, RED, (1 - u) * .8 * p); }
  lab(c, P.l[0], W * .9, H * .2, 'right', ROSE, P); lab(c, P.l[1], W * .06, H * .92, 'left', INK, P);
};
AR.unseen = (c, W, H, t, p, P) => { // the unseen: a veil with light moving behind it
  const [A1, A2] = pal(P), lx = W * (.5 + .25 * Math.sin(t * .5)), ly = H * .5;
  glow(c, lx, ly, H * .4, A2, .55 * p);
  for (let i = 0; i < 22; i++) { const x0 = W * (.08 + i * .04); c.strokeStyle = rgba(A1, .35 + .2 * Math.sin(i)); c.lineWidth = 1.2; c.beginPath(); for (let y = H * .05; y <= H * .95; y += 6) { const x = x0 + Math.sin(y * .03 + t * 1.2 + i * .5) * 6; y === H * .05 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
  lab(c, P.l[0], W * .5, H * .96, 'center', A1, P); lab(c, P.l[1], W * .06, H * .06, 'left', INK, P);
};
AR.life = (c, W, H, t, p, P) => { // life: a sprout rising, a heartbeat running under it
  const [A1] = pal(P), gx = W * .5, gy = H * .74, k = ease(clamp(t / 2.4)), hgt = H * .5 * k;
  path(c, [[W * .1, gy], [W * .9, gy]], '#9b7a4a', 1.2, .6 * p);
  c.strokeStyle = rgba(JADE, .95 * p); c.lineWidth = 2.2; c.beginPath(); c.moveTo(gx, gy); c.bezierCurveTo(gx - 14, gy - hgt * .4, gx + 14, gy - hgt * .7, gx, gy - hgt); c.stroke();
  [[.45, -1], [.62, 1], [.8, -1]].forEach(([f, d]) => { if (k < f) return; const y = gy - hgt * f, s = 16 * clamp((k - f) * 4); c.fillStyle = rgba(JADE, .7 * p); c.beginPath(); c.ellipse(gx + d * s * .8, y, s, s * .38, d * -.5, 0, TAU); c.fill(); });
  orb(c, gx, gy - hgt, 4, GOLD2, k * p);
  c.strokeStyle = rgba(A1, .8 * p); c.lineWidth = 1.4; c.beginPath(); for (let x = 0; x <= W; x += 3) { const ph = (x / W * 4 - t * 1.2) % 1, b = ph > .45 && ph < .55 ? Math.sin((ph - .45) * 10 * TAU) * 14 : 0; const y = H * .9 - b; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  lab(c, P.l[0], gx + 20, gy - hgt, 'left', JADE, P); lab(c, P.l[1], W * .06, H * .1, 'left', INK, P);
};
AR.death = (c, W, H, t, p, P) => { // death / dead: a lamp dimming, the pulse falling flat
  const [A1] = pal(P), cx = W * .5, cy = H * .48, fade = Math.max(.15, 1 - t / 5);
  c.strokeStyle = rgba(A1, .7 * p); c.lineWidth = 1.4; c.beginPath(); c.ellipse(cx, cy + 22, 22, 7, 0, 0, TAU); c.stroke(); path(c, [[cx, cy + 15], [cx, cy + 4]], A1, 1.4, .7 * p);
  const fh = 22 * fade * (1 + .1 * Math.sin(t * 8)); c.fillStyle = rgba(GOLD2, .85 * fade * p); c.beginPath(); c.moveTo(cx, cy + 4); c.quadraticCurveTo(cx - 8, cy - fh * .4, cx, cy - fh); c.quadraticCurveTo(cx + 8, cy - fh * .4, cx, cy + 4); c.fill(); glow(c, cx, cy - 8, 50, GOLD2, .5 * fade * p);
  for (let i = 0; i < 6; i++) { const u = (t * .3 + i / 6) % 1; dot(c, cx + Math.sin(u * 6 + i) * 6, cy - fh - u * H * .25, 3 + u * 6, '#6a6f7a', (1 - u) * .3 * p); }
  c.strokeStyle = rgba(INK, .6 * p); c.lineWidth = 1.2; c.beginPath(); for (let x = 0; x <= W; x += 3) { const amp = Math.max(0, 1 - x / (W * .55)) * 12, ph = (x / W * 5) % 1, b = ph > .45 && ph < .55 ? Math.sin((ph - .45) * 10 * TAU) * amp : 0; x ? c.lineTo(x, H * .86 - b) : c.moveTo(x, H * .86 - b); } c.stroke();
  lab(c, P.l[0], cx, H * .12, 'center', INK, P); lab(c, P.l[1], W * .94, H * .96, 'right', INK, P);
};
AR.rise = (c, W, H, t, p, P) => { // resurrection / raised / return: the earth opens and light rises up
  const [A1, A2] = pal(P), R = rnd(P.seed), gy = H * .78; path(c, [[W * .03, gy], [W * .97, gy]], '#9b7a4a', 1.3, .7 * p);
  for (let j = 0; j < 5; j++) { const x = W * (.14 + j * .18); c.strokeStyle = rgba('#9b7a4a', .7 * p); c.beginPath(); c.ellipse(x, gy, 18, 6, 0, PI, TAU); c.stroke();
    const k = ease(clamp(t / 1.5 - j * .2)), g = c.createLinearGradient(0, gy, 0, gy - H * .7 * k); g.addColorStop(0, rgba(j % 2 ? A2 : A1, .55 * p)); g.addColorStop(1, rgba(j % 2 ? A2 : A1, 0)); c.fillStyle = g; c.fillRect(x - 5, gy - H * .7 * k, 10, H * .7 * k);
    for (let i = 0; i < 4; i++) { const u = (t * .4 + i / 4 + R()) % 1; dot(c, x + (R() - .5) * 14, gy - u * H * .6 * k, 1.6, GOLD2, (1 - u) * k * p); } }
  lab(c, P.l[0], W * .5, H * .1, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .94, 'center', INK, P);
};
AR.being = (c, W, H, t, p, P) => { // is / was / be: two things joined as one statement; "was" sits in the past, "be" in the future
  const [A1, A2] = pal(P), g = P.g || '', past = /\b(was|were|had been)\b/.test(g), fut = /\b(be|will be|become)\b/.test(g) && !past, y = H * .5;
  orb(c, W * .28, y, 12, A1, p); orb(c, W * .72, y, 12, A2, p); [-5, 5].forEach(d => path(c, [[W * .4, y + d], [lerp(W * .4, W * .6, p), y + d]], GOLD2, 2, .9));
  const ty = H * .82; path(c, [[W * .08, ty], [W * .92, ty]], INK, 1, .45 * p); head(c, W * .92, ty, 0, 7, INK, .5 * p);
  const mx = past ? W * .25 : fut ? W * .75 : W * .5; if (fut) c.setLineDash([3, 4]); ring(c, mx, ty, 7 + Math.sin(t * 2) * 1.5, GOLD2, .9 * p, 1.5); c.setLineDash([]); dot(c, mx, ty, 2.5, GOLD2, p);
  lab(c, P.l[0], W * .5, H * .16, 'center', GOLD2, P); lab(c, P.l[1], W * .5, H * .95, 'center', INK, P);
};

/* ======================= VERBS, NAMES, NOUNS (fallbacks that still show grammar) ======================= */
AR.action = (c, W, H, t, p, P) => { // a verb: drawn by its tense and its form
  const [A1, A2] = pal(P), Wd = P.W || {}, f = String(Wd.form || ''), cx = W * .5, cy = H * .52, r = Math.min(W, H) * .26;
  const PERF = /PERF/.test(f), IMPV = /IMPV/.test(f), PASS = /PASS/.test(f), fm = (f.match(/\((\w+)\)/) || [])[1] || 'I';
  if (IMPV) { // command: a strong forward beam with pulses
    for (let k = 0; k < 3; k++) { const u = (t * .8 + k / 3) % 1; path(c, [[W * .1 + u * W * .6, cy], [W * .1 + u * W * .6 + 40, cy]], A2, 4 - k, (1 - u) * p); }
    path(c, [[W * .08, cy], [W * .84, cy]], A1, 2.4, .9 * p); head(c, W * .86, cy, 0, 14, A1, p); glow(c, W * .86, cy, 30, A1, .5 * p);
  } else if (PERF) { // done: the circle completes and is sealed
    const k = ease(clamp(t / 1.6)); c.strokeStyle = rgba(A1, .95 * p); c.lineWidth = 2.4; c.beginPath(); c.arc(cx, cy, r, -PI / 2, -PI / 2 + TAU * k); c.stroke();
    if (k >= 1) { c.strokeStyle = rgba(GOLD2, p); c.lineWidth = 3; c.beginPath(); c.moveTo(cx - r * .35, cy); c.lineTo(cx - r * .08, cy + r * .28); c.lineTo(cx + r * .4, cy - r * .3); c.stroke(); glow(c, cx, cy, r, GOLD2, .25 * p); }
    else orb(c, cx + Math.cos(-PI / 2 + TAU * k) * r, cy + Math.sin(-PI / 2 + TAU * k) * r, 6, A2, p);
  } else { // ongoing: the loop keeps turning
    for (let k = 0; k < 3; k++) { const a0 = t * 1.4 + k * TAU / 3; c.strokeStyle = rgba(k % 2 ? A2 : A1, .9 * p); c.lineWidth = 2.2; c.beginPath(); c.arc(cx, cy, r, a0, a0 + 1.6); c.stroke(); head(c, cx + Math.cos(a0 + 1.6) * r, cy + Math.sin(a0 + 1.6) * r, a0 + 1.6 + PI / 2, 8, k % 2 ? A2 : A1, p); }
  }
  if (PASS) { c.setLineDash([3, 5]); path(c, [[cx, H * .02], [cx, cy - r - 12]], INK, 1.4, .7 * p); c.setLineDash([]); head(c, cx, cy - r - 10, PI / 2, 8, INK, .8 * p); }
  // verb-form marker: II doubles, IV hands over, V/VI turn back, VIII inner effort, X reaches up
  if (fm === 'II') ring(c, cx, cy, r + 9, A1, .45 * p, 1); else if (fm === 'IV') { const u = (t * .5) % 1; orb(c, lerp(W * .12, cx - r, u), cy + r * .9, 4, A2, p * (1 - u)); } else if (fm === 'V' || fm === 'VI') { c.strokeStyle = rgba(A2, .6 * p); c.beginPath(); c.arc(cx + r + 10, cy, 10, PI, PI * 2.6); c.stroke(); } else if (fm === 'VIII') { c.strokeStyle = rgba(A2, .6 * p); c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 3, rr = 3 + i * .35; i ? c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : c.moveTo(cx, cy); } c.stroke(); } else if (fm === 'X') { for (let i = 0; i < 5; i++) path(c, [[cx + r + 18, cy + 20 - i * 12], [cx + r + 30, cy + 20 - i * 12]], A2, 1.5, .7 * p); head(c, cx + r + 24, cy - 44, -PI / 2, 7, A2, p); }
  lab(c, P.l[0], cx, cy + r + 22, 'center', A1, P); lab(c, P.l[1], W * .5, H * .08, 'center', INK, P);
};
/* proper names: an emblem from the story (never a person) */
const NAME = [
  [/musa|moses/, 'staff'], [/ibrahim|abraham/, 'coolfire'], [/fir.?aun|pharaoh/, 'fallcrown'], [/\bnuh\b|noah/, 'ark'], [/maryam|mary/, 'palm'], [/\bisa\b|jesus|maseeh|messiah/, 'star'],
  [/israel|bani/, 'springs'], [/adam/, 'clay'], [/yusuf|joseph/, 'stars11'], [/dawud|david/, 'mail'], [/sulaiman|solomon/, 'windant'], [/yunus|jonah|dhun.?nun/, 'whale'], [/harun|aaron/, 'twin'],
  [/\blut\b|\blot\b/, 'overturn'], [/\bhud\b|\baad\b/, 'wind2'], [/salih|thamud/, 'rock'], [/ismail|ishmael|makkah|bakkah|kabah/, 'cube'], [/yaqub|jacob/, 'twelve'], [/jibril|gabriel/, 'wing'], [/misr|egypt/, 'nile'], [/qarun|korah/, 'keys'], [/haman/, 'tower'], [/yajuj|majuj|gog/, 'barrier'], [/muhammad|ahmad/, 'light']
];
function emblem(c, k, x, y, s, t, A1, A2, p) {
  c.save(); c.translate(x, y); c.lineWidth = 1.6; c.strokeStyle = rgba(A1, .95 * p); c.fillStyle = rgba(A2, .8 * p);
  const L = (pts, col = A1) => { c.strokeStyle = rgba(col, .95 * p); c.beginPath(); pts.forEach((q2, i) => i ? c.lineTo(q2[0] * s, q2[1] * s) : c.moveTo(q2[0] * s, q2[1] * s)); c.stroke(); };
  const wav = (yy, col) => { c.strokeStyle = rgba(col, .8 * p); c.beginPath(); for (let i = -10; i <= 10; i++) { const xx = i / 10 * s, y2 = yy * s + Math.sin(i * .9 + t * 2) * s * .06; i === -10 ? c.moveTo(xx, y2) : c.lineTo(xx, y2); } c.stroke(); };
  switch (k) {
    case 'staff': L([[-.1, .8], [.1, -.7], [.25, -.8]]); wav(.3, CY); wav(.5, CY); c.clearRect(-s * .08, s * .2, s * .16, s * .4); break;
    case 'coolfire': for (let i = 0; i < 5; i++) { const xx = (i - 2) * .25 * s, hh = s * (.4 + .2 * Math.sin(t * 3 + i)); c.fillStyle = rgba(i % 2 ? EMB : GOLD2, .7 * p); c.beginPath(); c.moveTo(xx - 8, s * .5); c.quadraticCurveTo(xx, s * .5 - hh, xx + 8, s * .5); c.fill(); } for (let i = 0; i < 4; i++) dot(c, (i - 1.5) * .3 * s, -s * .4 + Math.sin(t + i) * 3, 4, JADE, p); break;
    case 'fallcrown': c.save(); c.rotate(.5 + Math.sin(t) * .05); L([[-.4, .1], [-.4, -.3], [-.2, -.1], [0, -.4], [.2, -.1], [.4, -.3], [.4, .1], [-.4, .1]], GOLD2); c.restore(); wav(.5, CY); wav(.65, CY); break;
    case 'ark': L([[-.6, .1], [-.45, .35], [.45, .35], [.6, .1], [-.6, .1]]); L([[0, .1], [0, -.5]]); L([[0, -.45], [.35, -.05], [0, -.05]], GOLD2); wav(.45, CY); wav(.6, CY); break;
    case 'palm': L([[0, .7], [.05, -.3]], JADE); for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 2.5) * .45; c.strokeStyle = rgba(JADE, .9 * p); c.beginPath(); c.moveTo(.05 * s, -.3 * s); c.quadraticCurveTo(Math.cos(a) * s * .35, -.3 * s + Math.sin(a) * s * .35 - 6, Math.cos(a) * s * .55, -.3 * s + Math.sin(a) * s * .3 + 10); c.stroke(); } for (let i = 0; i < 5; i++) dot(c, (i - 2) * 5 + 3, -.18 * s, 3, '#c9772f', p); break;
    case 'star': for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; L([[0, 0], [Math.cos(a) * (i % 2 ? .3 : .6), Math.sin(a) * (i % 2 ? .3 : .6)]], i % 2 ? A2 : GOLD2); } orb(c, 0, 0, 6, GOLD2, p); break;
    case 'springs': L([[-.5, .3], [-.2, -.2], [.3, -.25], [.5, .3], [-.5, .3]], '#b8a27a'); for (let i = 0; i < 12; i++) { const a = PI + i / 11 * PI, u = (t * .6 + i / 12) % 1; dot(c, Math.cos(a) * s * (.4 + u * .5), .1 * s + Math.sin(a) * -s * .1 + u * s * .5, 2, CY, (1 - u) * p); } break;
    case 'clay': c.fillStyle = rgba('#9b7a4a', .6 * p); c.beginPath(); c.ellipse(0, s * .4, s * .5, s * .18, 0, PI, TAU); c.fill(); glow(c, 0, -s * .1, s * .5, GOLD2, (.4 + .3 * Math.sin(t * 2)) * p); orb(c, 0, -s * .15, 6, GOLD2, p); break;
    case 'stars11': for (let i = 0; i < 11; i++) { const a = PI + i / 10 * PI; dot(c, Math.cos(a) * s * .6, Math.sin(a) * s * .45, 2.4, GOLD2, (.5 + .5 * Math.sin(t * 2 + i)) * p); } orb(c, -s * .3, s * .3, 7, GOLD, p); c.fillStyle = rgba(INK, .9 * p); c.beginPath(); c.arc(s * .3, s * .3, 7, 0, TAU); c.fill(); c.fillStyle = 'rgba(0,0,0,.9)'; c.beginPath(); c.arc(s * .3 + 3, s * .3 - 2, 6, 0, TAU); c.fill(); break;
    case 'mail': for (let r2 = 0; r2 < 4; r2++) for (let k2 = 0; k2 < 5; k2++) ring(c, (k2 - 2) * s * .2 + (r2 % 2) * s * .1, (r2 - 1.5) * s * .18, s * .09, '#c0c8d8', .8 * p); break;
    case 'windant': for (let i = 0; i < 4; i++) { c.strokeStyle = rgba(CY, .7 * p); c.beginPath(); c.arc(0, -s * .15, s * (.15 + i * .1), t + i, t + i + 2.4); c.stroke(); } for (let i = 0; i < 7; i++) { const xx = ((t * .1 + i / 7) % 1 - .5) * s * 1.2; dot(c, xx, s * .5, 2, '#c9772f', p); dot(c, xx + 3, s * .5, 1.4, '#c9772f', p); } break;
    case 'whale': c.fillStyle = rgba('#2a5a7a', .85 * p); c.beginPath(); c.ellipse(0, s * .1, s * .55, s * .22, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(s * .5, s * .1); c.lineTo(s * .75, -s * .12); c.lineTo(s * .75, s * .3); c.fill(); wav(.35, CY); orb(c, -s * .15, s * .05, 3, GOLD2, p); break;
    case 'twin': orb(c, -s * .22, 0, 8, A1, p); orb(c, s * .22, 0, 8, A2, p); path(c, [[-s * .1, 0], [s * .1, 0]], INK, 1.4, .7 * p); break;
    case 'overturn': c.save(); c.rotate(PI * clamp(t / 2) ); for (let i = 0; i < 5; i++) c.strokeRect((i - 2.5) * s * .18, -s * .3 + (i % 2) * 8, s * .14, s * .3); c.restore(); break;
    case 'wind2': for (let i = 0; i < 6; i++) { c.strokeStyle = rgba(CY, .7 * p); c.beginPath(); const yy = (i - 2.5) * s * .14; c.moveTo(-s * .6, yy); c.bezierCurveTo(-s * .2, yy - 10, s * .2, yy + 10, s * .6 + Math.sin(t * 3 + i) * 6, yy); c.stroke(); } break;
    case 'rock': L([[-.5, .4], [-.4, -.1], [-.1, -.35], [.3, -.25], [.5, .4], [-.5, .4]], '#b8a27a'); L([[0, -.35], [.05, .4]], RED); break;
    case 'cube': c.fillStyle = rgba('#0b0b0b', .95 * p); c.fillRect(-s * .32, -s * .3, s * .64, s * .64); c.strokeStyle = rgba(GOLD, .95 * p); c.strokeRect(-s * .32, -s * .3, s * .64, s * .64); path(c, [[-s * .32, -s * .12], [s * .32, -s * .12]], GOLD, 2.5, p); break;
    case 'twelve': for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .15; dot(c, Math.cos(a) * s * .5, Math.sin(a) * s * .5, 3, i === 0 ? GOLD2 : A2, p); } orb(c, 0, 0, 6, A1, p); break;
    case 'wing': for (let f = 0; f < 7; f++) { c.strokeStyle = rgba(A1, .8 - f * .08); c.beginPath(); c.moveTo(0, s * .2); c.quadraticCurveTo(s * .3, -s * .2 - f * 4, s * (.4 + f * .05), -s * (.5 - f * .08)); c.stroke(); c.beginPath(); c.moveTo(0, s * .2); c.quadraticCurveTo(-s * .3, -s * .2 - f * 4, -s * (.4 + f * .05), -s * (.5 - f * .08)); c.stroke(); } break;
    case 'nile': wav(.1, CY); wav(.22, CY); L([[-.6, -.05], [-.35, -.5], [-.1, -.05]], GOLD2); L([[0, -.05], [.2, -.38], [.4, -.05]], GOLD2); break;
    case 'keys': for (let i = 0; i < 4; i++) { ring(c, (i - 1.5) * s * .25, -s * .1 + clamp(t / 3) * s * .4, 6, GOLD, .9 * p); path(c, [[(i - 1.5) * s * .25, -s * .1 + clamp(t / 3) * s * .4 + 6], [(i - 1.5) * s * .25, s * .2 + clamp(t / 3) * s * .4]], GOLD, 1.4, .9 * p); } path(c, [[-s * .6, s * .45], [s * .6, s * .45]], '#9b7a4a', 2, p); break;
    case 'tower': for (let i = 0; i < 6; i++) c.strokeRect(-s * (.3 - i * .04), s * (.5 - i * .17), s * (.6 - i * .08), s * .17); c.save(); c.rotate(Math.sin(t) * .03); c.restore(); break;
    case 'barrier': c.fillStyle = rgba('#6f6a7a', .8 * p); c.fillRect(-s * .55, -s * .4, s * 1.1, s * .8); c.strokeStyle = rgba(EMB, .9 * p); for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-s * .55, -s * .4 + i * s * .2); c.lineTo(s * .55, -s * .4 + i * s * .2); c.stroke(); } break;
    case 'light': glow(c, 0, 0, s * .8, GOLD2, .6 * p); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .1; L([[Math.cos(a) * .2, Math.sin(a) * .2], [Math.cos(a) * .55, Math.sin(a) * .55]], GOLD2); } orb(c, 0, 0, 7, '#ffffff', p); break;
    default: { const R = rnd(hash(k)); c.beginPath(); for (let i = 0; i <= 8; i++) { const a = i / 8 * TAU, rr = s * (i % 2 ? .25 : .5); i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke(); orb(c, 0, 0, 5 + R() * 3, A2, p); }
  }
  c.restore();
}
AR.name = (c, W, H, t, p, P) => { // a proper name: an ornamental cartouche with an emblem from its story
  const [A1, A2] = pal(P), g = P.g || '', cx = W * .5, cy = H * .5, w = Math.min(W * .6, H * 1.1), h = H * .62;
  let k = 'gen:' + (P.W && P.W.root || g); for (const [re, e] of NAME) if (re.test(g)) { k = e; break; }
  c.strokeStyle = rgba(A1, .85 * p); c.lineWidth = 1.5; c.beginPath(); c.roundRect ? c.roundRect(cx - w / 2, cy - h / 2, w, h, h * .45) : c.rect(cx - w / 2, cy - h / 2, w, h); c.stroke();
  c.strokeStyle = rgba(A1, .35 * p); c.beginPath(); c.roundRect ? c.roundRect(cx - w / 2 + 6, cy - h / 2 + 6, w - 12, h - 12, h * .4) : c.rect(cx - w / 2 + 6, cy - h / 2 + 6, w - 12, h - 12); c.stroke();
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => { c.save(); c.translate(cx + dx * w * .42, cy + dy * h * .36); c.rotate(PI / 4 + t * .3); c.strokeStyle = rgba(GOLD2, .8 * p); c.strokeRect(-4, -4, 8, 8); c.restore(); });
  emblem(c, k, cx, cy - h * .04, h * .42, t, A1, A2, p);
  lab(c, P.l[0], cx, cy + h / 2 + 18, 'center', GOLD2, P); lab(c, P.l[1], cx, H * .08, 'center', INK, P);
};
AR.quality = (c, W, H, t, p, P) => { // an adjective: a cut gem whose facets catch the light
  const [A1, A2] = pal(P), R = rnd(P.seed), cx = W * .5, cy = H * .52, s = Math.min(W, H) * .26 * p, n = 6 + (P.seed % 5), rot = t * .25;
  const top = [], mid = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; top.push([cx + Math.cos(a) * s * .55, cy - s * .35 + Math.sin(a) * s * .12]); mid.push([cx + Math.cos(a) * s, cy + Math.sin(a) * s * .2]); }
  for (let i = 0; i < n; i++) { const j = (i + 1) % n, lit = .25 + .6 * Math.max(0, Math.sin(rot * 3 + i)); c.fillStyle = rgba(i % 2 ? A1 : A2, .18 * lit); c.beginPath(); c.moveTo(mid[i][0], mid[i][1]); c.lineTo(mid[j][0], mid[j][1]); c.lineTo(cx, cy + s * 1.1); c.closePath(); c.fill();
    path(c, [top[i], top[j]], A1, 1, .8); path(c, [top[i], mid[i]], A1, 1, .6); path(c, [mid[i], mid[j]], A2, 1.2, .9); path(c, [mid[i], [cx, cy + s * 1.1]], A1, .8, .4 + lit * .4); }
  const sp = (t * .7) % 1; glow(c, cx + Math.cos(sp * TAU) * s * .5, cy - s * .3, 14, '#ffffff', .7 * p);
  lab(c, P.l[0], cx, H * .1, 'center', A2, P); lab(c, P.l[1], cx, H * .95, 'center', INK, P);
};
AR.crystal = (c, W, H, t, p, P) => { // a noun: a 3D crystal whose corners are its root letters (doer: light flows out, done-to: light flows in, action-noun: light circulates)
  const [A1, A2] = pal(P), Wd = P.W || {}, f = String(Wd.form || ''), letters = rootLetters(Wd), n = Math.max(3, letters.length), R = rnd(P.seed), cx = W * .5, cy = H * .52, s = Math.min(W, H) * .3 * p;
  const v = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; v.push([Math.cos(a), (i % 2 ? .25 : -.25) * (1 + R() * .5), Math.sin(a)]); } v.push([0, 1.2, 0]); v.push([0, -1.2, 0]);
  const ay = t * .5, ax = .35 + .1 * Math.sin(t * .4), pr = ([x, y, z]) => { const x1 = x * Math.cos(ay) - z * Math.sin(ay), z1 = x * Math.sin(ay) + z * Math.cos(ay), y1 = y * Math.cos(ax) - z1 * Math.sin(ax), z2 = y * Math.sin(ax) + z1 * Math.cos(ax), k = 3 / (3 + z2); return [cx + x1 * s * k, cy + y1 * s * k, z2]; };
  const P2 = v.map(pr); for (let i = 0; i < n; i++) { const j = (i + 1) % n; path(c, [P2[i], P2[j]], A1, 1.3, .85); path(c, [P2[i], P2[n]], A2, 1, .5); path(c, [P2[i], P2[n + 1]], A1, 1, .45); }
  const ACT = /ACT/.test(f), PASS = /PASS/.test(f), VN = /VN/.test(f);
  for (let i = 0; i < 16; i++) { const u = (t * .45 + i / 16) % 1, a = i / 16 * TAU + R(), rr = ACT ? 12 + u * s * 1.6 : PASS ? s * 1.6 - u * s * 1.4 : s * .9, aa = VN ? a + t : a; dot(c, cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr * .6, 1.6, i % 2 ? A2 : GOLD2, (ACT ? 1 - u : PASS ? u : .6) * p); }
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `${Math.round(Math.min(W, H) * .07 + 6)}px AmiriQ, serif`;
  P2.slice(0, n).forEach((q2, i) => { if (!letters[i]) return; const fr2 = (q2[2] + 1.5) / 3; glow(c, q2[0], q2[1], 12, A2, .4 * fr2 * p); c.fillStyle = rgba(INK, (.35 + .6 * (1 - fr2)) * p); c.fillText(letters[i], q2[0], q2[1] - 12); dot(c, q2[0], q2[1], 2.6, GOLD2, p); }); c.restore();
  lab(c, P.l[0], cx, H * .08, 'center', A2, P); lab(c, P.l[1], cx, H * .96, 'center', INK, P);
};

/* ======================= per-word SIGNATURE layer ======================= */
const HARAKA = /[ً-ٰٟۖ-ۭـ]/g;
const ABJ = { 'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ٱ': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000 };
function rootLetters(W) { const r = String(W.root || '').replace(/[^ء-ي]/g, ''); if (r) return [...r]; return [...String(W.ar || '').replace(HARAKA, '').replace(/[^ء-يٱ]/g, '')].slice(0, 6); }
const cacheS = new Map();
function sigOf(W) {
  const key = W.ar + '|' + (W.root || ''); let s = cacheS.get(key); if (s) return s;
  const L = rootLetters(W), ab = L.reduce((a, ch) => a + (ABJ[ch] || 1), 0), h1 = hash(W.ar), h2 = hash(String(W.ar).replace(HARAKA, '') + '#' + (W.form || '') + (W.pos || ''));
  const bars = []; for (let i = 0; i < 40; i++) bars.push(((i < 32 ? h1 >>> i : h2 >>> (i - 32)) & 1) ? 1 : (((h2 >>> (i % 32)) & 3) / 6));
  const cols = [[GOLD2, CY], [CY, ROSE], [GOLD2, JADE], [ROSE, GOLD2], [CY, GOLD2], [LIL, GOLD2], [JADE, CY]][ab % 7];
  s = { L, ab, n: 5 + (ab % 7), k: 2 + (h2 % 3), bars, cols, spin: ((h1 >>> 5) % 2 ? 1 : -1) * (.12 + (h1 % 9) / 60), word: String(W.ar).replace(HARAKA, ''), sd: h1 };
  cacheS.set(key, s); if (cacheS.size > 600) cacheS.delete(cacheS.keys().next().value); return s;
}
function under(c, W, H, t, p, d, small) { // root letters as living calligraphy watermark + word constellation
  if (!d || !d.W) return; const s = sigOf(d.W), R = rnd(s.sd), txt = s.L.join(small ? ' ' : '   ');
  c.save(); const fs = Math.round(Math.min(H * (small ? .5 : .36), W * (small ? .5 : .36) / Math.max(1, s.L.length * .55))); c.font = `${fs}px AmiriQ, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  const x = W * (.5 + (R() - .5) * .16), y = H * (.56 + (R() - .5) * .1);
  const g = c.createLinearGradient(x - W * .4, 0, x + W * .4, 0), u = (t * .18) % 1.6 - .3; g.addColorStop(0, rgba(s.cols[0], .07)); g.addColorStop(clamp(u), rgba('#ffffff', .2)); g.addColorStop(clamp(u + .15), rgba(s.cols[1], .08)); g.addColorStop(1, rgba(s.cols[0], .06));
  c.fillStyle = g; c.fillText(txt, x, y); c.lineWidth = 1; c.strokeStyle = rgba(s.cols[0], .22 * p); c.setLineDash([900]); c.lineDashOffset = 900 * (1 - clamp(t / 2.4)); c.strokeText(txt, x, y); c.setLineDash([]);
  if (!small) { const n = s.L.length + 4, pts = []; for (let i = 0; i < n; i++) pts.push([W * (.06 + R() * .88), H * (.08 + R() * .5)]); c.strokeStyle = rgba(s.cols[1], .14 * p); c.lineWidth = .8; c.beginPath(); pts.forEach((q2, i) => i ? c.lineTo(q2[0], q2[1]) : c.moveTo(q2[0], q2[1])); c.stroke(); pts.forEach((q2, i) => dot(c, q2[0], q2[1], 1.2 + (i % 3) * .5, s.cols[i % 2], (.3 + .4 * Math.abs(Math.sin(t * 1.3 + i))) * p)); }
  c.restore();
}
function medallion(c, cx, cy, r, t, p, s, small) {
  c.save(); c.translate(cx, cy);
  c.fillStyle = 'rgba(8,10,24,.55)'; c.beginPath(); c.arc(0, 0, r * 1.06, 0, TAU); c.fill();
  c.rotate(t * s.spin); const nb = s.bars.length; for (let i = 0; i < nb; i++) { const a = i / nb * TAU, l = r * (.12 + .16 * s.bars[i]) * p; c.strokeStyle = rgba(i % 8 === 0 ? GOLD2 : s.cols[0], .85); c.lineWidth = small ? 1 : 1.4; c.beginPath(); c.moveTo(Math.cos(a) * r, Math.sin(a) * r); c.lineTo(Math.cos(a) * (r - l), Math.sin(a) * (r - l)); c.stroke(); }
  c.rotate(-t * s.spin * 2); c.strokeStyle = rgba(s.cols[1], .9 * p); c.lineWidth = small ? 1 : 1.3; c.beginPath(); for (let i = 0; i <= s.n; i++) { const a = -PI / 2 + i * s.k / s.n * TAU, rr = r * .6; i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke();
  c.rotate(t * s.spin); const nL = s.L.length || 1, fs = Math.max(8, Math.round(r * .3)); c.font = `${fs}px AmiriQ, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  s.L.forEach((ch, i) => { const a = -PI / 2 + i / nL * TAU + t * .3, x = Math.cos(a) * r * .36, y = Math.sin(a) * r * .36; dot(c, x, y, fs * .62, '#0a0e20', .85); c.strokeStyle = rgba(GOLD2, .7 * p); c.lineWidth = .8; c.beginPath(); c.arc(x, y, fs * .62, 0, TAU); c.stroke(); c.fillStyle = rgba(INK, .95 * p); c.fillText(ch, x, y + fs * .05); });
  glow(c, 0, 0, r * .25, s.cols[0], .45 * p); c.restore();
  c.strokeStyle = rgba(GOLD, .7 * p); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r * 1.06, 0, TAU); c.stroke();
}
function over(c, W, H, t, p, d, small) {
  if (!d || !d.W) return; const s = sigOf(d.W), r = small ? Math.min(W, H) * .16 : Math.min(W, H) * .105;
  const top = small ? r + 6 : (window.FahmSig.medTop || 0) + r + 10;
  medallion(c, d.alt ? r + 10 : W - r - 10, top, r, t, ease(clamp(t / 1.2)), s, small);
}

/* ======================= gloss / grammar -> scene ======================= */
function prep(g) {
  g = g.replace(/^(and|so|then|indeed|verily|surely|but)\s+/, '');
  if (/^from\b|\bfrom\b/.test(g)) return 'from';
  if (/\b(in|therein|inside|within|wherein|in it)\b/.test(g)) return 'inside';
  if (/\b(to|towards|toward|unto|into)\b/.test(g)) return 'toward';
  if (/\b(upon|on|over|above|at)\b/.test(g)) return 'upon';
  if (/\b(under|beneath|below|underneath)\b/.test(g)) return 'under';
  if (/\bwith\b/.test(g)) return 'together';
  if (/\bfor\b/.test(g)) return 'forr';
  if (/\bamong\b/.test(g)) return 'among';
  if (/\bbetween\b/.test(g)) return 'between';
  if (/\bagainst\b/.test(g)) return 'against';
  if (/\b(about|concerning|regarding)\b/.test(g)) return 'about';
  if (/\b(besides|other than|except|apart)\b/.test(g)) return 'besides';
  if (/\bthan\b/.test(g)) return 'compare';
  if (/\b(like|as)\b/.test(g)) return 'like';
  if (/\bof\b/.test(g)) return 'belong';
  if (/\bby\b/.test(g)) return 'seal';
  if (/\b(before|after|until|till)\b/.test(g)) return 'timearc';
  return 'link';
}
function pre(W, g) {
  const pos = W.pos || '', root = String(W.root || '').replace(/[^ء-ي]/g, '');
  if (/\ballah\b|\bgod\b/.test(g)) return null;
  if (pos === 'PN') return 'name';
  if (/\bangels?\b/.test(g)) return 'angels';
  if (/sha[iy]t[a]+n|satan|devils?\b|iblis|\benem(y|ies)\b/.test(g)) return 'shaitan';
  if (/\bmessengers?\b|\bwarners?\b|\bprophets?\b|\breminder\b|bearers? of glad/.test(g)) return 'messenger';
  if (/\bunseen\b|\bhidden\b|\bsecrets?\b/.test(g)) return 'unseen';
  if (/resurrect|\braised?\b|\braise[sd]\b|\breturn(ed|s)?\b/.test(g)) return 'rise';
  if (/\bdead\b|\bdeath\b|\bdie[sd]?\b|\bdying\b|cause[sd]? (you|them|him) to die/.test(g)) return 'death';
  if (/\blife\b|\blive[sd]?\b|\balive\b|\bliving\b|gives? life/.test(g)) return 'life';
  if (/\bpunish|\bpainful\b|\bsevere\b|\btorment|\bpenalt/.test(g)) return 'thorns';
  if (/\btruth\b|\btrue\b|\bclear(ly)?\b|\btruthful|\bevident|\bmanifest|\bthe right\b/.test(g)) return 'truth';
  if (pos === 'V' && /\bbeliev/.test(g)) return 'iman';
  if (/\bevil\b|wrongdoer|criminal|polytheist|\blosers?\b|corrupt|\bsinners?\b|transgress|\bunjust\b|hypocrit|oppress/.test(g)) return 'evil';
  if (/\bgood\b|righteous|good-doer|\bvirtu|\bpure\b|\bpurif|\bdeeds of right/.test(g)) return 'good';
  if (/\bbetter\b|\bbest\b|\bmore\b|\bmost\b(?! (gracious|merciful))|\bthan\b|\bgreater\b|\bless\b/.test(g)) return 'compare';
  if (/\bevery\b|\ball\b(?!-)|\beach\b|\bwhole\b|\bentire/.test(g)) return 'all';
  if (/\bthings?\b|\banything\b|\bwhatever\b|\bany\b|\bsomething\b/.test(g)) return 'thing';
  if (/\ba little\b|\blittle\b|\bfew\b|\bsmall\b|\bslight/.test(g)) return 'little';
  if (/\bgreat\b|\bmany\b|\bmuch\b|\bhuge\b|\bvast\b|abundan/.test(g) && !/all-/.test(g)) return 'great';
  if (/^(and )?nay\b/.test(g)) return 'wall';
  if (/^(and )?o\b|^o you\b/.test(g) || pos === 'VOC') return 'call';
  if (root === 'كون') return 'being';
  switch (pos) {
    case 'P': return prep(g);
    case 'PRON': return 'pron';
    case 'REL': case 'SUB': case 'EXL': return 'bridge';
    case 'DEM': return /\bth(at|ose)\b/.test(g) ? 'far' : 'near';
    case 'COND': return 'fork';
    case 'CONJ': return /\bor\b/.test(g) ? 'choice' : /\bbut\b/.test(g) ? 'turn' : 'link';
    case 'ACC': case 'CERT': case 'EMPH': case 'SUP': return 'seal';
    case 'INTG': return 'question';
    case 'RES': case 'EXP': return 'besides';
    case 'AMD': case 'RET': return /\bnay\b/.test(g) ? 'wall' : 'turn';
    case 'INC': return 'call';
    case 'SUR': return 'burst';
    case 'FUT': return 'timearc';
    case 'CAUS': case 'PRP': return 'cause';
    case 'LOC': return /\bwith\b/.test(g) ? 'together' : /\bbetween\b/.test(g) ? 'between' : /\bwhere/.test(g) ? 'compass' : /\bunder|beneath|below/.test(g) ? 'under' : /\bover|above/.test(g) ? 'upon' : null;
    case 'INT': case 'PREV': case 'REM': return 'link';
  }
  if (/^(and )?(because|so that|lest|in order)\b/.test(g)) return 'cause';
  if (/\bwhere(ver)?\b/.test(g)) return 'compass';
  return null;
}
function post(W, g) {
  const pos = W.pos || '';
  if (pos === 'V') return 'action';
  if (pos === 'ADJ') return 'quality';
  if (pos === 'PN') return 'name';
  if (pos === 'PRON') return 'pron';
  return 'crystal';
}
window.FahmSig = { pre, post, under, over, sigOf, rootLetters, medTop: 0 };
})();

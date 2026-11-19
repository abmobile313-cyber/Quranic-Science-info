/* Fahm Lab motif library 2b: speech, people, negation, ruin, gifts, ways, fire, ropes, whispers — one scene per word. */
(function () {
  'use strict';
  const L = window.FahmLab; if (!L || !L.api) return;
  const { T, V, clamp, sm, glow, textSprite, pts, lineMat, loop, orb, col } = L.api;
  const M = L.motifs, PI = Math.PI, PI2 = Math.PI * 2;
  const hex = (c) => '#' + new T.Color(col(c)).getHexString();
  const ln = (a, c, o) => { const l = new T.Line(new T.BufferGeometry().setFromPoints(a), lineMat(col(c), o)); l.frustumCulled = false; return l; };
  const ring = (r, c, o, cx = 0, cy = 0, n = 64) => loop(Array.from({ length: n }, (_, k) => V(cx + Math.cos(k / n * PI2) * r, cy + Math.sin(k / n * PI2) * r, 0)), c, o);
  const lab = (ctx, p, at) => { if (p.l) ctx.label(p.l, at || V(0, -2.1, .5), { color: hex(p.color || 'gold') }); };
  function swarm(ctx, n, color, size, fn, op = 1) {
    const a = new Float32Array(n * 3), P = pts(a, col(color), size * 2.3, op); ctx.add(P); const o = [0, 0, 0];
    return (t, k) => { t = Math.max(0, t); for (let i = 0; i < n; i++) { fn(i, t, o, k); a[i * 3] = o[0]; a[i * 3 + 1] = o[1]; a[i * 3 + 2] = o[2]; } P.geometry.attributes.position.needsUpdate = true; P.material.opacity = op * sm(k * 2); };
  }
  const rnd = (ctx, n) => Array.from({ length: n }, () => ctx.r());
  const cube = (ctx, s, c, o, pos) => { const h = s / 2, P = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]].map(a => V(a[0], a[1], a[2])); const g = new T.Group(); [[0, 1, 2, 3, 0], [4, 5, 6, 7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(e => g.add(ln(e.map(i => P[i]), c, o))); if (pos) g.position.copy(pos); ctx.add(g); return g; };

  /* ---------- calls & speech: 9 ---------- */
  M.call = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'how') { /* KAYFA: a question mark of light, a path of steps */
      const pathPts = []; for (let i = 0; i < 70; i++) { const u = i / 69; pathPts.push(u < .8 ? [Math.cos((1 - u / .8) * 4.2 + 1.2) * .9, 1 + Math.sin((1 - u / .8) * 4.2 + 1.2) * .9] : [0, -.2 - (u - .8) / .2 * .9]); }
      const q = swarm(ctx, 70, c, .1, (i, t, o) => { const w = Math.sin(t * 2 + i * .2) * .04; o[0] = pathPts[i][0] * 1 + w; o[1] = pathPts[i][1] - .3 + w; o[2] = 0; }); const dot = glow(c, .5, V(0, -1.5, 0), .9); ctx.add(dot);
      fn = (t, k) => { q(t, k); dot.scale.setScalar(.5 + .1 * Math.sin(t * 4)); };
    } else if (m === 'urge') { /* YAHUDDU: nudging a smaller orb toward a goal, again and again */
      const a = orb(ctx, c, .34, V(-1.8, 0, 0)), b = orb(ctx, 0xcfd8ee, .2, V(0, 0, 0)), goal = ring(.45, 0x57e08a, .6, 2.2, 0); ctx.add(goal);
      fn = (t, k) => { a.step(t, sm(k * 2)); const q = (t * .6) % 1, push = Math.sin(Math.min(1, q * 2) * PI) * .5; a.g.position.x = -1.8 + push; b.g.position.x = -.2 + ((t * .12) % 1) * 2.3; b.step(t, sm(k * 2)); goal.scale.setScalar(1 + .08 * Math.sin(t * 3)); };
    } else if (m === 'be') { /* YAKUN: 'be' — void becomes bloom */
      const f = swarm(ctx, 200, c, .07, (i, t, o) => { const u = sm(((t * .3) % 1.5) / 1), a = i * 2.399, r = (.1 + (i % 50) / 50 * 1.8) * u; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .8; o[2] = Math.sin(a * 2) * .3; }); const flash = glow(0xffffff, 1, V(0, 0, 0), 1); ctx.add(flash);
      fn = (t, k) => { f(t, k); const u = ((t * .3) % 1.5); flash.scale.setScalar(.4 + (u < .3 ? u * 6 : Math.max(0, 2.2 - u * 3))); flash.material.opacity = u < 1 ? .9 : .2; };
    } else if (m === 'seal') { /* INNA: a seal — emphasis rings lock around a core */
      const r1 = ring(1.2, c, .9), r2 = ring(.8, c, .8); r2.rotation.x = 1; ctx.add(r1, r2, glow(c, 1.3, V(0, 0, 0), .9));
      const tk = swarm(ctx, 4, 0xffffff, .12, (i, t, o) => { const a = t * 1.2 + i * 1.57; o[0] = Math.cos(a) * 1.2; o[1] = Math.sin(a) * 1.2; o[2] = 0; });
      fn = (t, k) => { r2.rotation.y = t * .8; r1.rotation.z = -t * .3; tk(t, k); };
    } else if (m === 'what') { /* MA: a ring of points scanning, a question */
      const f = swarm(ctx, 90, c, .07, (i, t, o) => { const a = i / 90 * PI2 + t * .3, r = 1.4 + .15 * Math.sin(a * 4 + t * 2); o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .7; o[2] = 0; }); const sc = glow(0xffffff, .6, V(0, 0, 0), .9); ctx.add(sc);
      fn = (t, k) => { f(t, k); const a = t * 1.4; sc.position.set(Math.cos(a) * 1.4, Math.sin(a) * 1.4 * .7, 0); const hum = glow; };
    } else if (m === 'andno') { /* WA-MA: two chained rings, "and what" */
      const r1 = ring(.9, c, .8, -1.1, 0), r2 = ring(.9, 0x7aa8ff, .8, 1.1, 0); ctx.add(r1, r2); const ch = swarm(ctx, 14, 0xffffff, .08, (i, t, o) => { const u = (t * .3 + i / 14) % 1; o[0] = -.2 + .4 * Math.sin(u * PI2 * 2); o[1] = (u - .5) * 1.4; o[2] = 0; });
      fn = (t, k) => { ch(t, k); r1.scale.setScalar(1 + .05 * Math.sin(t * 2)); r2.scale.setScalar(1 + .05 * Math.sin(t * 2 + 2)); };
    } else if (m === 'call') { /* YA AYYUHA: a call that makes a crowd turn */
      const s = orb(ctx, c, .36, V(-2.2, 0, 0)), n = 14, R = rnd(ctx, n * 2); const cr = [];
      for (let i = 0; i < n; i++) { const g = glow(0xcfd8ee, .32, V(.2 + R[i] * 2.6, -1.1 + R[n + i] * 2.1, 0), .5); ctx.add(g); cr.push(g); }
      const rs = [0, 1, 2].map(() => { const r = ring(1, c, .6, -2.2, 0); ctx.add(r); return r; });
      fn = (t, k) => { s.step(t, sm(k * 2)); rs.forEach((r, i) => { const u = (t * .35 + i / 3) % 1; r.scale.set(.4 + u * 4.5, (.4 + u * 4.5) * .8, 1); r.material.opacity = .6 * (1 - u); }); cr.forEach((g, i) => { const hit = clamp((((t * .35) % 1) * 4.7 - (g.position.x + 2.2)) * 2); g.material.opacity = .4 + .55 * hit; g.scale.setScalar(.32 + .25 * hit); }); };
    } else if (m === 'say') { /* QUL: a command — voice bars issuing toward the listener */
      const mouth = orb(ctx, c, .3, V(-2.3, 0, 0)); const bars = []; for (let i = 0; i < 18; i++) { const l = ln([V(-1.7 + i * .22, 0, 0), V(-1.7 + i * .22, 0, 0)], c, .85); ctx.add(l); bars.push(l); }
      fn = (t, k) => { mouth.step(t, sm(k * 2)); bars.forEach((l, i) => { const h = (.2 + .7 * Math.abs(Math.sin(t * 3 - i * .45))) * (1 - i / 22), q = l.geometry.attributes.position; q.setXYZ(0, -1.7 + i * .22, -h, 0); q.setXYZ(1, -1.7 + i * .22, h, 0); q.needsUpdate = true; }); };
    }
    lab(ctx, p, V(0, -2.2, .5));
    return fn;
  };

  /* ---------- people: 7 ---------- */
  M.people = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'cyan'); let fn = () => { };
    if (m === 'rel') { /* ALLADHINA: a group inside a bracket */
      const n = 26, R = rnd(ctx, n * 2), f = swarm(ctx, n, c, .12, (i, t, o) => { o[0] = (R[i] - .5) * 2.4 + Math.sin(t + i) * .04; o[1] = (R[n + i] - .5) * 1.6; o[2] = 0; });
      const br = (s) => ln([V(s * 1.7, 1.1, 0), V(s * 1.45, 1.1, 0), V(s * 1.45, -1.1, 0), V(s * 1.7, -1.1, 0)], 0xcfd8ee, .7); ctx.add(br(-1), br(1));
      fn = (t, k) => f(t, k);
    } else if (m === 'army') { /* ASHAB: companions — a column marching in rows */
      const f = swarm(ctx, 40, c, .11, (i, t, o) => { const r = i % 5, q = Math.floor(i / 5); o[0] = -2.4 + ((q * .62 + t * .35) % 5.2); o[1] = -.9 + r * .45; o[2] = 0; }); ctx.add(ln([V(-2.8, -1.1, 0), V(2.8, -1.1, 0)], 0x44506a, .4));
      fn = (t, k) => f(t, k);
    } else if (m === 'quraysh') { /* QURAYSH: a tribe gathered around a house */
      const h = cube(ctx, .7, 0xffc65a, .8, V(0, 0, 0)), f = swarm(ctx, 60, c, .1, (i, t, o) => { const a = i * 2.399 + t * .12, r = 1.3 + (i % 4) * .35; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .55; o[2] = Math.sin(a) * .3; });
      fn = (t, k) => { f(t, k); h.rotation.y = t * .25; };
    } else if (m === 'all') { /* AN-NAS: all humanity, many hues around a globe */
      const hs = [0x35d0e6, 0xffc65a, 0xff944d, 0xa57bff, 0x57e08a, 0xff4f9d], gl = new T.Group(); ctx.add(gl);
      const arr = hs.map(h => swarm(ctx, 24, h, .1, (i, t, o) => { const a = i * 2.399 + t * .12 * (h & 1 ? 1 : -1), r = 1.9 + (hs.indexOf(h)) * .12; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .55; o[2] = Math.sin(a) * .8; }));
      ctx.add(glow(0x2f7ad9, 1.5, V(0, 0, 0), .7), ring(.7, 0x35d0e6, .5)); fn = (t, k) => arr.forEach(f => f(t, k));
    } else if (m === 'all2') { /* WAN-NAS: humanity as concentric turning rings */
      const rs = [1, 1.6, 2.2].map((r, i) => { const q = ring(r, hex(i ? 'cyan' : 'gold'), .3, 0, 0, 80); q.scale.y = .5; ctx.add(q); return q; });
      const f = swarm(ctx, 54, 0xcfd8ee, .09, (i, t, o) => { const ri = i % 3, a = i * 1.13 + t * (.25 - ri * .07) * (ri % 2 ? -1 : 1), r = [1, 1.6, 2.2][ri]; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .5; o[2] = 0; });
      fn = (t, k) => f(t, k);
    } else if (m === 'enter') { /* YADKHULUN: people stream through a doorway into light */
      const f = swarm(ctx, 90, c, .1, (i, t, o) => { const u = ((t * .2 + i / 90) % 1); o[0] = -2.8 + u * 5.2; o[1] = -.8 + ((i * 1.7) % 1.6) * (1 - u) * .8 + (u > .5 ? 0 : 0); o[2] = ((i * .37) % 1 - .5) * (1 - u); }); ctx.add(glow(0xffd27a, 3.4, V(1.9, -.1, 0), .55), ln([V(1.3, -1.1, 0), V(1.3, 1.1, 0), V(2.5, 1.1, 0), V(2.5, -1.1, 0)], 0xffd27a, .7));
      fn = (t, k) => f(t, k);
    } else if (m === 'waves') { /* AFWAJA: successive waves — whole groups arriving */
      const gs = [0, 1, 2, 3].map(w => swarm(ctx, 36, w % 2 ? 0xffc65a : 0x35d0e6, .1, (i, t, o) => { const u = (((t * .22 - w * .25) % 1) + 1) % 1; o[0] = -2.8 + u * 4.4 + Math.cos(i * 2.4) * .25; o[1] = -.2 + Math.sin(i * 2.4) * .45; o[2] = (w - 1.5) * .25; }));
      ctx.add(glow(0xffd27a, 3, V(2, 0, 0), .35)); fn = (t, k) => gs.forEach(f => f(t, k));
    }
    lab(ctx, p, V(0, -2.1, 1));
    return fn;
  };

  /* ---------- negation & denial: 6 ---------- */
  M.no = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'orange'); let fn = () => { };
    if (m === 'ghayr') { /* GHAYR: a path that branches off another */
      ctx.add(ln(Array.from({ length: 30 }, (_, i) => V(-2.6 + i / 29 * 5.2, Math.sin(i / 29 * 3) * .15 - .1, 0)), 0x7aa8ff, .7));
      ctx.add(ln(Array.from({ length: 24 }, (_, i) => V(-.3 + i / 23 * 2.6, -.1 - i / 23 * i / 23 * 1.7, 0)), c, .9));
      const a = swarm(ctx, 20, 0x7aa8ff, .09, (i, t, o) => { const u = (t * .3 + i / 20) % 1; o[0] = -2.6 + 5.2 * u; o[1] = Math.sin(u * 3) * .15 - .1; o[2] = 0; }), b = swarm(ctx, 14, c, .09, (i, t, o) => { const u = (t * .3 + i / 14) % 1; o[0] = -.3 + 2.6 * u; o[1] = -.1 - u * u * 1.7; o[2] = 0; });
      fn = (t, k) => { a(t, k); b(t, k); };
    } else if (m === 'wala') { /* WA-LA: a barred ring joined by a second one — "and not" */
      const g = (cx) => { const r = ring(.85, c, .9, cx, 0); ctx.add(r, ln([V(cx - .6, .6, 0), V(cx + .6, -.6, 0)], c, .95)); }; g(-1.2); g(1.2); const bar = ln([V(-.35, 0, 0), V(.35, 0, 0)], 0xcfd8ee, .8); ctx.add(bar);
      const o = glow(0xffffff, .4, V(0, 0, 0), .9); ctx.add(o); fn = (t, k) => { const u = (t * .5) % 1; o.position.set(-1.8 + u * 3.6, Math.sin(u * PI) * .7, 0); };
    } else if (m === 'la') { /* LA: the classic barred circle (kept) */
      const r = ring(1.3, c, .9, 0, 0, 80), s = ln([V(-.95, .95, 0), V(.95, -.95, 0)], c, 1), sp = glow(0xffffff, .5, null, 1); ctx.add(r, s, sp, glow(c, 3.4, V(0, 0, 0), .2));
      fn = (t, k) => { const u = (t * .5) % 1.4; sp.position.set(-.95 + Math.min(1, u) * 1.9, .95 - Math.min(1, u) * 1.9, 0); sp.material.opacity = u < 1 ? 1 : 0; };
    } else if (m === 'lam') { /* LAM: it stopped short and never happened — a path that dissolves before its end */
      const f = swarm(ctx, 50, c, .09, (i, t, o) => { const u = ((t * .3 + i / 50) % 1), x = -2.5 + u * 3.4; o[0] = x; o[1] = Math.sin(u * 6) * .15; o[2] = 0; }); const goal = ring(.4, 0x57e08a, .35, 2.2, 0); goal.material.opacity = .15; ctx.add(goal, ln([V(.95, -.5, 0), V(.95, .5, 0)], c, .9));
      fn = (t, k) => f(t, k);
    } else if (m === 'walam') { /* WA-LAM: two attempts, both stopped at the same wall */
      ctx.add(ln([V(.6, -1.3, 0), V(.6, 1.3, 0)], c, .9));
      const f = [-.5, .5].map((y, j) => swarm(ctx, 26, j ? 0xcfd8ee : c, .09, (i, t, o) => { const u = ((t * .35 + i / 26 + j * .4) % 1); o[0] = -2.6 + u * 3.1; o[1] = y + Math.sin(u * 7) * .1; o[2] = 0; }));
      const sp = glow(c, .8, V(.5, 0, 0), .5); ctx.add(sp); fn = (t, k) => { f.forEach(q => q(t, k)); sp.material.opacity = .25 + .25 * Math.sin(t * 6); };
    } else if (m === 'alam') { /* ALAM: "did He not" — a question ring around a barred light */
      const r = ring(1.4, c, .6, 0, 0, 80), r2 = ring(1.1, c, .3, 0, 0, 80); ctx.add(r, r2, glow(0xffe0a0, 1.2, V(0, 0, 0), .8), ln([V(-.5, .5, 0), V(.5, -.5, 0)], c, .95));
      const q = swarm(ctx, 18, 0xcfd8ee, .08, (i, t, o) => { const a = i / 18 * PI2 + t * .6; o[0] = Math.cos(a) * 1.4; o[1] = Math.sin(a) * 1.4; o[2] = 0; }); fn = (t, k) => { q(t, k); r2.scale.setScalar(1 + .08 * Math.sin(t * 2)); };
    } else if (m === 'deny') { /* YUKADHDHIB: an orb turns its back to the light */
      const s = glow(0xffe0a0, 3, V(-2, 0, 0), .7), o = orb(ctx, 0x8a94ac, .3, V(1, 0, 0)); ctx.add(s); const shade = swarm(ctx, 24, 0x2a3040, .15, (i, t, oo) => { const u = (i / 24); oo[0] = 1.1 + u * 1.8; oo[1] = Math.sin(i * 2) * .25 * u; oo[2] = -.3; }, .9);
      const rays = swarm(ctx, 30, 0xffe0a0, .06, (i, t, oo) => { const u = ((t * .35 + i / 30) % 1); oo[0] = -2 + u * 2.7; oo[1] = Math.sin(i * 4) * .5 * (1 - u * .6); oo[2] = 0; }, .7);
      fn = (t, k) => { o.step(t, sm(k * 2)); shade(t, k); rays(t, k); };
    }
    lab(ctx, p, V(0, -2, .5));
    return fn;
  };

  /* ---------- ruin: 7 ---------- */
  M.ruin = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'red'); let fn = () => { };
    if (m === 'wrath') { /* AL-MAGHDUB: a red storm with jagged bolts */
      const f = swarm(ctx, 160, c, .09, (i, t, o) => { const a = i * 2.399 + t * .8, r = .3 + (i % 40) / 40 * 1.8; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .6; o[2] = Math.sin(a * 3) * .3; }); const bolt = ln(Array.from({ length: 8 }, () => V(0, 0, 0)), 0xffd0a0, .95); ctx.add(bolt, glow(c, 4, V(0, 0, 0), .3));
      fn = (t, k) => { f(t, k); const q = bolt.geometry.attributes.position, ph = Math.floor(t * 5); for (let i = 0; i < 8; i++) { const u = i / 7; q.setXYZ(i, Math.sin(ph * 12.9 + i * 7.1) * .5 * u, 2 - u * 3.4, 0); } q.needsUpdate = true; bolt.material.opacity = (Math.sin(t * 5) > .3) ? .95 : .1; };
    } else if (m === 'made') { /* FAJA'ALAHUM: a solid body falls to straw-like shreds */
      const n = 150, R = rnd(ctx, n * 3), f = swarm(ctx, n, c, .08, (i, t, o) => { const u = sm(((t * .3) % 1.6) / 1 > 1 ? 1 : ((t * .3) % 1.6)), x0 = (R[i] - .5) * 1.4, y0 = (R[n + i] - .5) * 1; o[0] = x0 + (R[2 * n + i] - .5) * 3.2 * u; o[1] = y0 - u * u * 1.3 + Math.sin(t * 2 + i) * .04 * u; o[2] = 0; });
      fn = (t, k) => f(t, k);
    } else if (m === 'woe') { /* FAWAYL: things fall down a dark funnel */
      const f = swarm(ctx, 90, c, .09, (i, t, o) => { const u = ((t * .25 + i / 90) % 1), a = i * 2.4 + u * 6, r = (1 - u) * 1.9; o[0] = Math.cos(a) * r; o[1] = 1.3 - u * 2.8; o[2] = Math.sin(a) * r * .5; });
      const fr = [0, 1, 2, 3].map(i => { const q = ring(1.9 - i * .45, 0x6a2a2a, .4, 0, 1.2 - i * .9); q.scale.y = .3; ctx.add(q); return q; }); ctx.add(glow(0x300808, 2.6, V(0, -1.6, 0), .9));
      fn = (t, k) => f(t, k);
    } else if (m === 'tabbat') { /* TABBAT: two arcs (hands) break in the middle */
      const a = ln(Array.from({ length: 30 }, (_, i) => V(-2 + i / 29 * 2, Math.sin(i / 29 * PI) * .9, 0)), c, .9), b = ln(Array.from({ length: 30 }, (_, i) => V(2 - i / 29 * 2, Math.sin(i / 29 * PI) * .9, 0)), c, .9); ctx.add(a, b);
      const sp = swarm(ctx, 40, 0xffb080, .07, (i, t, o) => { const u = (((t * .3) % 1.5) - .5); const k2 = Math.max(0, u); o[0] = Math.cos(i * 2.4) * k2 * 2.2; o[1] = Math.sin(i * 2.4) * k2 * 1.4 - k2 * k2; o[2] = 0; });
      fn = (t, k) => { const u = clamp(((t * .3) % 1.5) * 1.6 - .2); a.position.x = u * .9; b.position.x = -u * .9; a.rotation.z = -u * .5; b.rotation.z = u * .5; sp(t, k); };
    } else if (m === 'watab') { /* WA-TABB: a cracked sphere that comes apart */
      const f = swarm(ctx, 220, c, .07, (i, t, o) => { const u = clamp(((t * .3) % 1.5) * 1.2 - .3), y = 1 - 2 * (i + .5) / 220, r = Math.sqrt(1 - y * y), a = i * 2.399; const s = 1.2 + u * (1.5 + (i % 7) * .3); o[0] = Math.cos(a) * r * s; o[1] = y * s - u * u * .6; o[2] = Math.sin(a) * r * s; });
      const cr = ln([V(-.2, 1.2, 0), V(.1, .6, 0), V(-.1, 0, 0), V(.2, -.6, 0), V(0, -1.2, 0)], 0xffd0a0, .9); ctx.add(cr); fn = (t, k) => { f(t, k); cr.material.opacity = .9 * (((t * .3) % 1.5) < .5 ? 1 : 0); };
    } else if (m === 'yada') { /* YADA: two open palms of light, they crumble to dust */
      const hand = (sx) => swarm(ctx, 50, c, .07, (i, t, o) => { const u = clamp(((t * .3) % 1.5) - .4), f = i % 5, q = Math.floor(i / 5) / 9; o[0] = sx * (.4 + q * 1.2 + (f - 2) * 0 ) + (u * (Math.cos(i * 2.4)) * 1.2); o[1] = (f - 2) * .22 + q * .4 - u * u * 1.5; o[2] = 0; });
      const h1 = hand(-1), h2 = hand(1); fn = (t, k) => { h1(t, k); h2(t, k); };
    } else if (m === 'shar') { /* SHARR: a dark spiked star, ink spreading */
      const sp = []; for (let i = 0; i < 9; i++) { const a = i / 9 * PI2, l = ln([V(0, 0, 0), V(Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0)], c, .85); ctx.add(l); sp.push(l); }
      const ink = swarm(ctx, 90, 0x401018, .22, (i, t, o) => { const u = ((t * .25 + i / 90) % 1), a = i * 2.399; o[0] = Math.cos(a) * u * 2.4; o[1] = Math.sin(a) * u * 1.4; o[2] = -.3; }, .8); ctx.add(glow(c, 1.6, V(0, 0, 0), .8));
      fn = (t, k) => { ink(t, k); sp.forEach((l, i) => { l.scale.setScalar(.7 + .4 * Math.abs(Math.sin(t * 2 + i * .7))); l.rotation.z = t * .15; }); };
    }
    lab(ctx, p, V(0, -2.1, .5));
    return fn;
  };
})();

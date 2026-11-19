/* Fahm Lab motif library 2c: gifts, ways, fire, cords, whispers, lord, loneliness, aid, sight, force, shelter, wealth, time, nature variants. */
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
  const bez = (a, b, h, n = 30) => Array.from({ length: n }, (_, i) => { const u = i / (n - 1); return V(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u + Math.sin(u * PI2 / 2) * h, 0); });

  /* ---------- mercy & gifts: 4 ---------- */
  M.gift = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'raheem') { /* AR-RAHIM: warm rain focused on a few believing lights */
      const os = [-1.3, 0, 1.3].map(x => orb(ctx, 0xffe2a8, .24, V(x, -1.1, 0))); const f = swarm(ctx, 80, c, .08, (i, t, o) => { const u = ((t * .3 + i * .618) % 1), tx = [-1.3, 0, 1.3][i % 3]; o[0] = tx + Math.sin(u * 8 + i) * .5 * (1 - u); o[1] = 2.1 - u * 3.1; o[2] = 0; }); ctx.add(glow(c, 4, V(0, 2.2, 0), .5));
      fn = (t, k) => { os.forEach((o, i) => o.step(t + i, sm(k * 2))); f(t, k); };
    } else if (m === 'favour') { /* AN'AMTA: rings of blessing land on a small light */
      const o = orb(ctx, 0xcfd8ee, .26, V(0, -.9, 0)); const rs = [0, 1, 2, 3].map(() => { const r = ring(.9, c, .8); ctx.add(r); return r; });
      fn = (t, k) => { o.step(t, sm(k * 2)); rs.forEach((r, i) => { const u = ((t * .3 + i / 4) % 1); r.position.y = 2.2 - u * 3.1; r.scale.set(1 - u * .5, (1 - u * .5) * .3, 1); r.material.opacity = .9 * Math.sin(u * PI); }); };
    } else if (m === 'maun') { /* AL-MA'UN: tiny things handed from one to another down a line */
      const n = 5, os = []; for (let i = 0; i < n; i++) { const g = orb(ctx, i % 2 ? 0xcfd8ee : c, .17, V(-2.3 + i * 1.15, -.2, 0), 10); os.push(g); }
      const f = swarm(ctx, 16, c, .09, (i, t, o) => { const u = ((t * .3 + i / 16) % 1) * (n - 1), s = Math.floor(u), q = u - s; o[0] = -2.3 + (s + q) * 1.15; o[1] = -.2 + Math.sin(q * PI) * .6; o[2] = 0; });
      fn = (t, k) => { os.forEach((o, i) => o.step(t + i, sm(k * 2))); f(t, k); };
    } else if (m === 'given') { /* A'TAYNAKA: a great light hands a gift to a small one */
      const a = orb(ctx, c, .55, V(-1.9, .3, 0)), b = orb(ctx, 0xcfd8ee, .2, V(1.9, -.4, 0)); const arc = bez(V(-1.5, .3, 0), V(1.7, -.4, 0), .9); ctx.add(ln(arc, c, .3));
      const g = swarm(ctx, 14, 0xfff0c0, .12, (i, t, o) => { const u = ((t * .25 + i / 14) % 1), q = arc[Math.floor(u * 29)]; o[0] = q.x; o[1] = q.y; o[2] = 0; }); ctx.add(ring(.55, c, .6, 1.9, -.4));
      fn = (t, k) => { a.step(t, sm(k * 2)); b.step(t + 1, sm(k * 2)); g(t, k); };
    }
    lab(ctx, p, V(0, -2.1, .5)); return fn;
  };

  /* ---------- ways: 6 ---------- */
  M.way = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    const road = (fnY, w, o) => { const A = [], B = []; for (let i = 0; i < 40; i++) { const u = i / 39, x = -3 + u * 6, y = fnY(u); A.push(V(x, y - w, 0)); B.push(V(x, y + w, 0)); } ctx.add(ln(A, c, o), ln(B, c, o)); };
    if (m === 'guide') { /* IHDINA: a lantern leads a small light along the road */
      road(u => Math.sin(u * 5) * .5 - .2, .28, .45); const lan = orb(ctx, c, .3, V(0, 0, 0)), me = orb(ctx, 0xcfd8ee, .14, V(0, 0, 0), 8);
      fn = (t, k) => { const u = (t * .12) % 1, ux = -3 + u * 6; lan.g.position.set(ux + .7, Math.sin((u + .12) * 5) * .5 - .2 + .35, 0); me.g.position.set(ux - .1, Math.sin(u * 5) * .5 - .2, 0); lan.step(t, sm(k * 2)); me.step(t, sm(k * 2)); };
    } else if (m === 'sirat') { /* AS-SIRAT: a long bridge with posts */
      road(() => 0, .35, .6); for (let i = 0; i < 9; i++) { const x = -3 + i * .75; ctx.add(ln([V(x, -.35, 0), V(x, .35, 0)], c, .25)); }
      const f = swarm(ctx, 30, c, .09, (i, t, o) => { const u = ((t * .2 + i / 30) % 1); o[0] = -3 + u * 6; o[1] = Math.sin(i * 2) * .18; o[2] = 0; }); ctx.add(glow(c, 4, V(2.7, 0, -.5), .4));
      fn = (t, k) => f(t, k);
    } else if (m === 'thread') { /* SIRAT (no article): a single thread of light into the distance */
      const f = swarm(ctx, 70, c, .09, (i, t, o) => { const u = ((t * .2 + i / 70) % 1); o[0] = -1.6 + u * 1.8 + Math.sin(u * 3) * .2; o[1] = -1.2 + u * 2.2; o[2] = u * -2.5; }); ctx.add(ln(Array.from({ length: 30 }, (_, i) => { const u = i / 29; return V(-1.6 + u * 1.8 + Math.sin(u * 3) * .2, -1.2 + u * 2.2, u * -2.5); }), c, .35)); ctx.add(glow(c, 2, V(.2, 1, -2.5), .6));
      fn = (t, k) => f(t, k);
    } else if (m === 'straight') { /* AL-MUSTAQIM: one ruler-straight beam among crooked dim lines */
      ctx.add(ln([V(-3, 0, 0), V(3, 0, 0)], 0xffffff, .95), glow(c, 3.4, V(0, 0, 0), .25));
      for (let j = 0; j < 4; j++) ctx.add(ln(Array.from({ length: 40 }, (_, i) => V(-3 + i / 39 * 6, (j < 2 ? 1 : -1) * (.6 + (j % 2) * .5) + Math.sin(i * .4 + j * 2) * .35, 0)), 0x6a748c, .35));
      const f = swarm(ctx, 24, c, .1, (i, t, o) => { const u = ((t * .3 + i / 24) % 1); o[0] = -3 + 6 * u; o[1] = 0; o[2] = 0; });
      fn = (t, k) => f(t, k);
    } else if (m === 'yours') { /* DINUKUM: a road with a crowd, their way */
      road(u => -.3 + u * .3, .5, .35); const f = swarm(ctx, 40, 0x7aa8ff, .1, (i, t, o) => { const u = ((t * .1 + i / 40) % 1); o[0] = -3 + 6 * u; o[1] = -.3 + u * .3 + Math.sin(i * 4) * .38; o[2] = 0; });
      fn = (t, k) => f(t, k);
    } else if (m === 'mine') { /* DINI: my narrow way, a single light */
      road(u => Math.sin(u * 3) * .3, .12, .6); const o = orb(ctx, c, .3, V(0, 0, 0)); fn = (t, k) => { const u = (t * .14) % 1; o.g.position.set(-3 + u * 6, Math.sin(u * 3) * .3, 0); o.step(t, sm(k * 2)); };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };

  /* ---------- losing, returning: 3 ---------- */
  M.turn2 = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'orange'); let fn = () => { };
    if (m === 'misled') { /* TADLIL: a road that bends away, a light follows the false branch */
      ctx.add(ln(Array.from({ length: 30 }, (_, i) => V(-2.6 + i / 29 * 5, 0, 0)), 0x7aa8ff, .6), ln(Array.from({ length: 24 }, (_, i) => V(-.3 + i / 23 * 2.2, -(i / 23) * (i / 23) * 1.5, 0)), c, .8));
      const o = orb(ctx, c, .24, V(0, 0, 0)); fn = (t, k) => { const u = (t * .2) % 1.2; if (u < .45) o.g.position.set(-2.6 + u / .45 * 2.4, 0, 0); else { const q = (u - .45) / .75; o.g.position.set(-.2 + q * 1.9, -q * q * 1.3, 0); } o.step(t, sm(k * 2)); };
    } else if (m === 'plan') { /* KAYDUHUM: a net of threads that unravel */
      const lines = []; for (let i = 0; i < 6; i++) { const a = ln([V(-2, -1 + i * .4, 0), V(2, -1 + i * .4, 0)], c, .7), b = ln([V(-1.6 + i * .64, -1.1, 0), V(-1.6 + i * .64, 1.1, 0)], c, .7); ctx.add(a, b); lines.push(a, b); }
      fn = (t, k) => lines.forEach((l, i) => { const u = clamp(((t * .3) % 1.6) - .4 - i * .02); l.rotation.z = (i % 2 ? 1 : -1) * u * .9 * Math.sin(i); l.position.y = -u * u * 1.2 * (i % 3); l.material.opacity = .7 * (1 - u * .8); });
    } else if (m === 'door') { /* TAWWAB: an open door of light that always receives the returning */
      ctx.add(ln([V(-.9, -1.3, 0), V(-.9, 1.3, 0), V(.9, 1.3, 0), V(.9, -1.3, 0)], c, .8), glow(0xffe2a8, 4, V(0, 0, -.3), .6));
      const f = swarm(ctx, 40, 0xcfd8ee, .09, (i, t, o) => { const u = ((t * .22 + i / 40) % 1); o[0] = (i % 2 ? -1 : 1) * (2.8 - u * 2.7) * (1 - u * .1); o[1] = -.9 + Math.sin(u * 3 + i) * .5 * (1 - u); o[2] = 0; });
      fn = (t, k) => f(t, k);
    }
    lab(ctx, p, V(0, -2.1, .5)); return fn;
  };

  /* ---------- fire: 3 new ---------- */
  M.fire2 = (ctx, p) => {
    const m = p.mode; let fn = () => { };
    const flame = (cx, w, h, n, ph) => swarm(ctx, n, 0xff7a1a, .12, (i, t, o) => { const u = ((t * (.4 + (i % 7) * .05) + i * .618 + ph) % 1), a = i * 2.399; const r = (1 - u) * w * Math.sqrt((i % 13) / 13); o[0] = cx + Math.cos(a) * r + Math.sin(t * 2 + i) * .08 * u; o[1] = -1.4 + u * h; o[2] = Math.sin(a) * r * .5; }, .85);
    if (m === 'enter') { /* SAYASLA: a light sinks into a fire */
      const f = flame(1.2, 1.2, 2.8, 200, 0), f2 = swarm(ctx, 120, 0xffd23a, .09, (i, t, o) => { const u = ((t * .5 + i * .618) % 1); o[0] = 1.2 + Math.cos(i * 2.4) * (1 - u) * .6; o[1] = -1.4 + u * 1.8; o[2] = 0; }, .8); const o = orb(ctx, 0xcfd8ee, .22, V(-2, .8, 0)); ctx.add(glow(0xff6a1a, 4.4, V(1.2, -.5, 0), .3));
      fn = (t, k) => { f(t, k); f2(t, k); const u = (t * .22) % 1.3, q = Math.min(1, u); o.g.position.set(-2 + q * 3, .8 - q * q * 1.7 + Math.sin(q * 6) * .1, 0); o.g.scale.setScalar(Math.max(.05, 1 - Math.max(0, u - .9) * 4)); o.step(t, sm(k * 2)); };
    } else if (m === 'blaze') { /* NARAN: one tall blaze with rising embers */
      const f = flame(0, 1.5, 3.2, 320, 0), e = swarm(ctx, 50, 0xffe0a0, .05, (i, t, o) => { const u = ((t * .2 + i * .37) % 1); o[0] = Math.sin(i * 7 + t) * (.4 + u); o[1] = -1 + u * 3.6; o[2] = 0; }, .9); ctx.add(glow(0xff6a1a, 5.5, V(0, -.6, 0), .35));
      fn = (t, k) => { f(t, k); e(t, k); };
    } else if (m === 'wood') { /* AL-HATAB: logs piled, fire eating them */
      const logs = []; for (let i = 0; i < 6; i++) { const a = ln([V(-1.3 + (i % 3) * .4, -1.3 + Math.floor(i / 3) * .3, 0), V(.7 + (i % 3) * .4, -1.1 + Math.floor(i / 3) * .3, 0)], 0xa8743a, .9); a.rotation.z = (i - 2.5) * .12; ctx.add(a); logs.push(a); }
      const f = flame(0, 1.3, 2.3, 220, 0.3); ctx.add(glow(0xff6a1a, 4, V(0, -.7, 0), .3));
      fn = (t, k) => { f(t, k); logs.forEach((l, i) => l.material.color.setRGB(1, .4 + .3 * Math.sin(t * 3 + i), .1)); };
    }
    lab(ctx, p, V(0, -2.1, .5)); return fn;
  };

  /* ---------- cords: 5 ---------- */
  M.cord = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'orange'); let fn = () => { };
    const strand = (n, st, rad, y0, y1, ph) => Array.from({ length: st }, (_, s) => { const l = ln(Array.from({ length: n }, () => V(0, 0, 0)), c, .9); ctx.add(l); return (t, ox = 0, oy = 0) => { const a = l.geometry.attributes.position; for (let i = 0; i < n; i++) { const u = i / (n - 1), ang = u * 14 + s * PI2 / st + t * .8; a.setXYZ(i, ox + Math.cos(ang) * rad, oy + y0 + (y1 - y0) * u, Math.sin(ang) * rad); } a.needsUpdate = true; }; });
    if (m === 'carrier') { /* HAMMALAT: a light bent under a bundle of sticks */
      const o = orb(ctx, c, .3, V(0, -.9, 0)), st = swarm(ctx, 40, 0xa8743a, .07, (i, t, oo) => { oo[0] = (i % 10 - 4.5) * .16; oo[1] = -.2 + Math.floor(i / 10) * .13 + (i % 10 - 4.5) * .03; oo[2] = 0; }, .95);
      fn = (t, k) => { o.step(t, sm(k * 2)); st(t, k); };
    } else if (m === 'neck') { /* JIDIHA: a twisted cord circling a neck */
      const o = glow(0xcfd8ee, .7, V(0, 0, 0), .8); ctx.add(o); const l = ln(Array.from({ length: 120 }, (_, i) => { const a = i / 119 * PI2 * 3; return V(Math.cos(a) * .9, Math.sin(a) * .35 - .2, Math.sin(a) * .9); }), c, .9); ctx.add(l); fn = (t, k) => { l.rotation.y = t * .5; };
    } else if (m === 'rope') { /* HABL: a single plaited rope hanging */
      const S = strand(80, 3, .3, -2, 1.8); const f = swarm(ctx, 40, 0xffe0b0, .05, (i, t, o) => { o[0] = Math.sin(i * 3.1 + t) * .6; o[1] = -2 + i / 40 * 4; o[2] = Math.cos(i * 2.3) * .3; }, .5); fn = (t, k) => { S.forEach(s => s(t)); f(t, k); };
    } else if (m === 'braid') { /* MASAD: strands of palm fibre braiding together */
      const S = strand(70, 5, .32, -1.8, 1.8); const g = swarm(ctx, 60, 0xa8743a, .06, (i, t, o) => { const u = i / 60, a = u * 20 + t; o[0] = Math.cos(a) * .55; o[1] = -1.8 + u * 3.6; o[2] = Math.sin(a) * .55; }, .6); fn = (t, k) => { S.forEach(s => s(-t * 1.2)); g(t, k); };
    } else if (m === 'knot') { /* AL-'UQAD: knots tied along a cord */
      const base = ln(Array.from({ length: 40 }, (_, i) => V(-2.6 + i / 39 * 5.2, Math.sin(i * .5) * .1, 0)), c, .7); ctx.add(base); const ks = [-1.6, -.5, .6, 1.7].map(x => { const r = ring(.3, c, .95, x, 0); ctx.add(r); return r; });
      fn = (t, k) => ks.forEach((r, i) => { r.rotation.x = t * 1.2 + i; r.scale.setScalar(.8 + .25 * Math.sin(t * 2 + i)); });
    }
    lab(ctx, p, V(0, -2.4, .5)); return fn;
  };

  /* ---------- whispers: 4 ---------- */
  M.hush = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'violet'); let fn = () => { };
    if (m === 'blow') { /* AN-NAFFATHAT: puffs blown onto knots */
      const f = swarm(ctx, 60, c, .07, (i, t, o) => { const u = ((t * .35 + i / 60) % 1); o[0] = -2.2 + u * 3.6; o[1] = Math.sin(i * 3) * .3 * u; o[2] = 0; }, .7); const r = [1.5, 2.1].map(x => { const q = ring(.28, c, .8, x, 0); ctx.add(q); return q; }); const mo = orb(ctx, c, .22, V(-2.4, 0, 0));
      fn = (t, k) => { mo.step(t, sm(k * 2)); f(t, k); r.forEach((q, i) => { q.rotation.x = t * 2 + i; }); };
    } else if (m === 'waswas') { /* AL-WASWAS: whisper waves tiptoe toward a listening ring */
      const rs = [0, 1, 2].map(() => { const r = ring(1, c, .5, -2.2, 0); ctx.add(r); return r; }); const ear = ring(.5, 0xcfd8ee, .8, 1.9, 0); ctx.add(ear); const o = orb(ctx, c, .2, V(-2.2, 0, 0));
      fn = (t, k) => { o.step(t, sm(k * 2)); rs.forEach((r, i) => { const u = (t * .3 + i / 3) % 1; r.scale.set(.2 + u * 2.4, (.2 + u * 2.4) * .8, 1); r.position.x = u * 3.2 * 0 + u * 2; r.material.opacity = .5 * (1 - u); }); ear.scale.setScalar(1 + .08 * Math.sin(t * 4)); };
    } else if (m === 'verb') { /* YUWASWISU: a dark thread slips into a chest */
      const ch = orb(ctx, 0xcfd8ee, .34, V(1.5, 0, 0)); const th = swarm(ctx, 40, c, .09, (i, t, o) => { const u = ((t * .3 + i / 40) % 1); o[0] = -2.6 + u * 3.6; o[1] = Math.sin(u * 8) * .35 * (1 - u); o[2] = 0; }, .9); ctx.add(ring(.8, c, .4, 1.5, 0));
      fn = (t, k) => { ch.step(t, sm(k * 2)); th(t, k); };
    } else if (m === 'chests') { /* AS-SUDUR: a row of hearts, wisps winding around them */
      const os = [-1.8, 0, 1.8].map(x => orb(ctx, 0xffc65a, .24, V(x, -.2, 0))); const w = swarm(ctx, 60, c, .06, (i, t, o) => { const h = i % 3, a = i * .7 + t * 1.3; o[0] = (h - 1) * 1.8 + Math.cos(a) * .7; o[1] = -.2 + Math.sin(a) * .5; o[2] = 0; }, .8);
      fn = (t, k) => { os.forEach((o, i) => o.step(t + i, sm(k * 2))); w(t, k); };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };
})();

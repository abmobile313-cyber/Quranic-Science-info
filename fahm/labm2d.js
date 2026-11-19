/* Fahm Lab motif library 2d: lordship, loneliness, aid, sight, force, shelter, wealth, nature & time variants. */
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

  /* ---------- Lord: 3 ---------- */
  M.lord = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'teal'); let fn = () => { };
    const rings3 = (cx, cy, s) => [1.2, 1.9, 2.6].map((r, i) => { const q = ring(r * s, c, .5 - i * .1, cx, cy, 80); q.scale.y = .55; ctx.add(q); return q; });
    if (m === 'yours') { /* RABBUKA: great rings around ONE small light — you */
      const me = orb(ctx, 0xcfd8ee, .24, V(0, 0, 0)), rs = rings3(0, 0, 1); ctx.add(glow(c, 4, V(0, 0, 0), .25)); fn = (t, k) => { me.step(t, sm(k * 2)); rs.forEach((q, i) => { q.rotation.z = t * (.15 + i * .06) * (i % 2 ? -1 : 1); }); };
    } else if (m === 'for') { /* LIRABBIKA: an offering rises to the rings */
      const rs = rings3(0, 1.1, .8), f = swarm(ctx, 36, 0xffe2a8, .09, (i, t, o) => { const u = ((t * .25 + i / 36) % 1); o[0] = Math.sin(i * 5 + t) * .3 * (1 - u); o[1] = -1.6 + u * 2.6; o[2] = 0; }); const me = orb(ctx, 0xcfd8ee, .2, V(0, -1.6, 0));
      fn = (t, k) => { me.step(t, sm(k * 2)); f(t, k); rs.forEach((q, i) => { q.rotation.z = t * .1 * (i % 2 ? -1 : 1); }); };
    } else if (m === 'within') { /* BIRABBI: a light sheltered within the rings */
      const rs = rings3(0, 0, .7), me = orb(ctx, 0xcfd8ee, .18, V(0, 0, 0)), f = swarm(ctx, 24, c, .07, (i, t, o) => { const a = i / 24 * PI2 + t * .5; o[0] = Math.cos(a) * .6; o[1] = Math.sin(a) * .35; o[2] = 0; });
      fn = (t, k) => { me.step(t, sm(k * 2)); f(t, k); rs.forEach((q, i) => { q.rotation.z = t * (.3 - i * .08); }); };
    }
    lab(ctx, p, V(0, -2.2, .5)); return fn;
  };

  /* ---------- need & loneliness: 3 ---------- */
  M.alone = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'cyan'); let fn = () => { };
    if (m === 'bowl') { /* AL-MISKIN: a small light beside an empty bowl */
      const o = orb(ctx, 0xcfd8ee, .22, V(-1.2, -.3, 0)); ctx.add(ln(Array.from({ length: 24 }, (_, i) => V(.9 + Math.cos(PI + PI * i / 23) * .8, -.3 + Math.sin(PI + PI * i / 23) * .6, 0)), c, .8), ln([V(.1, -.3, 0), V(1.7, -.3, 0)], c, .8));
      const rs = swarm(ctx, 20, 0xffe2a8, .06, (i, t, oo) => { const u = ((t * .1 + i / 20) % 1); oo[0] = .9 + Math.cos(i * 2.4) * (1 - u) * .6; oo[1] = .6 + u * 1.2; oo[2] = 0; }, .3);
      fn = (t, k) => { o.step(t, sm(k * 2) * (.8 + .2 * Math.sin(t))); rs(t, k); };
    } else if (m === 'flicker') { /* SAHUN: a flame that flickers, forgetting itself */
      const g = glow(0xffc65a, 1.6, V(0, 0, 0), .9); ctx.add(g, ring(1.1, 0x6a748c, .35)); const f = swarm(ctx, 24, 0xffc65a, .07, (i, t, o) => { const a = i * 2.4 + t * .4; o[0] = Math.cos(a) * 1.1; o[1] = Math.sin(a) * 1.1; o[2] = 0; }, .5);
      fn = (t, k) => { const fl = .35 + .65 * Math.abs(Math.sin(t * 5.3) * Math.sin(t * 2.1)); g.material.opacity = fl; g.scale.setScalar(1.2 + fl * .6); f(t, k); };
    } else if (m === 'cut') { /* AL-ABTAR: a line is severed, the far part falls away */
      const a = ln([V(-2.6, 0, 0), V(0, 0, 0)], c, .9), b = ln([V(0, 0, 0), V(2.6, 0, 0)], c, .9); ctx.add(a, b); const f = swarm(ctx, 20, 0xcfd8ee, .08, (i, t, o) => { const u = ((t * .3 + i / 20) % 1) * 1.2; o[0] = -2.6 + u * 2.6; o[1] = 0; o[2] = 0; if (u > 1) o[1] = -9; });
      fn = (t, k) => { const u = clamp(((t * .3) % 1.6) - .3); b.position.set(u * .9, -u * u * 1.8, 0); b.rotation.z = -u * .8; b.material.opacity = .9 * (1 - u * .6); f(t, k); };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };

  /* ---------- aid & sending & victory: 3 ---------- */
  M.aid = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'ask') { /* NASTA'IN: a call rises, help descends and lifts */
      const o = orb(ctx, 0xcfd8ee, .24, V(0, -1.1, 0)), S = glow(c, 3.4, V(0, 2, -.3), .5); ctx.add(S);
      const up = swarm(ctx, 20, 0xcfd8ee, .07, (i, t, oo) => { const u = ((t * .25 + i / 20) % 1); oo[0] = Math.sin(u * 8 + i) * .1; oo[1] = -1 + u * 3; oo[2] = 0; }), dn = swarm(ctx, 40, c, .09, (i, t, oo) => { const u = ((t * .3 + i / 40) % 1); oo[0] = Math.cos(i * 2.4) * .5 * (1 - u); oo[1] = 2 - u * 3; oo[2] = 0; });
      fn = (t, k) => { o.step(t, sm(k * 2)); o.g.position.y = -1.1 + Math.max(0, Math.sin(t * .6)) * .35; up(t, k); dn(t, k); };
    } else if (m === 'sent') { /* WA-ARSALA: a messenger line sent from the sky to the ground */
      const s = glow(0xffffff, 1.2, V(-2, 1.9, 0), .9); ctx.add(s); const path = Array.from({ length: 40 }, (_, i) => { const u = i / 39; return V(-2 + u * 4, 1.9 - u * 3.3 + Math.sin(u * PI) * .6, 0); }); ctx.add(ln(path, c, .35));
      const f = swarm(ctx, 22, c, .1, (i, t, o) => { const u = ((t * .3 + i / 22) % 1), q = path[Math.min(39, Math.floor(u * 39))]; o[0] = q.x; o[1] = q.y; o[2] = 0; }); const land = ring(.5, c, .6, 2, -1.4); ctx.add(land);
      fn = (t, k) => { f(t, k); land.scale.setScalar(1 + .15 * Math.sin(t * 3)); s.scale.setScalar(1.2 + .2 * Math.sin(t * 2)); };
    } else if (m === 'victory') { /* NASR: a light descends and lifts a small one on top of a ridge */
      ctx.add(ln(Array.from({ length: 40 }, (_, i) => V(-3 + i / 39 * 6, -1 + Math.exp(-Math.pow((i / 39 - .5) * 5, 2)) * 1.6, 0)), 0x6a748c, .6));
      const o = orb(ctx, 0xcfd8ee, .2, V(0, 0, 0)), S = glow(c, 4, V(0, 2, -.3), .6); ctx.add(S);
      const dn = swarm(ctx, 36, c, .09, (i, t, oo) => { const u = ((t * .3 + i / 36) % 1); oo[0] = Math.cos(i * 2.4) * .3 * (1 - u); oo[1] = 2 - u * 2.4; oo[2] = 0; });
      fn = (t, k) => { const u = sm(((t * .15) % 1.2) / 1); o.g.position.set(-2.4 + u * 2.4, -1 + Math.exp(-Math.pow((-2.4 + u * 2.4) / 3 * 5 / 2 * 2 / 5 * 1, 2) * 0) * 0 + Math.exp(-Math.pow(((-2.4 + u * 2.4) + 3) / 6 - .5, 2) * 25) * 1.6 + .25, 0); o.step(t, sm(k * 2)); dn(t, k); };
    }
    lab(ctx, p, V(0, -2.1, .5)); return fn;
  };

  /* ---------- sight: 3 ---------- */
  M.look2 = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'cyan'); let fn = () => { };
    const eye = (cx) => { const e1 = ln(Array.from({ length: 30 }, (_, i) => V(cx + (i / 29 - .5) * 2.2, Math.sin(i / 29 * PI) * .6, 0)), c, .9), e2 = ln(Array.from({ length: 30 }, (_, i) => V(cx + (i / 29 - .5) * 2.2, -Math.sin(i / 29 * PI) * .6, 0)), c, .9), ir = glow(0xffffff, .7, V(cx, 0, 0), .9); ctx.add(e1, e2, ir); return ir; };
    if (m === 'consider') { /* TARA: an eye whose gaze travels far */
      const ir = eye(-1.8), f = swarm(ctx, 30, c, .07, (i, t, o) => { const u = ((t * .3 + i / 30) % 1); o[0] = -1.8 + u * 4.4; o[1] = u * .5; o[2] = -u * 2; }); const far = glow(0xffc65a, 1, V(2.6, .5, -2), .8); ctx.add(far);
      fn = (t, k) => { f(t, k); ir.position.x = -1.8 + Math.sin(t) * .15; };
    } else if (m === 'havesee') { /* ARA'AYTA: an eye with a question ring */
      const ir = eye(0), qr = ring(1.5, 0xcfd8ee, .35, 0, 0, 80); ctx.add(qr); const f = swarm(ctx, 18, 0xcfd8ee, .07, (i, t, o) => { const a = i / 18 * PI2 + t * .5; o[0] = Math.cos(a) * 1.5; o[1] = Math.sin(a) * 1.5; o[2] = 0; });
      fn = (t, k) => { f(t, k); ir.scale.setScalar(.7 + .15 * Math.sin(t * 2)); };
    } else if (m === 'saw') { /* WA-RA'AYTA: an object appears under the gaze */
      const ir = eye(-1.6), o = orb(ctx, 0xffc65a, .3, V(1.8, 0, -.5)); const f = swarm(ctx, 26, c, .07, (i, t, oo) => { const u = ((t * .3 + i / 26) % 1); oo[0] = -1.6 + u * 3.4; oo[1] = 0; oo[2] = -u * .5; });
      fn = (t, k) => { f(t, k); const a = sm(Math.min(1, (t * .5) % 2)); o.step(t, sm(k * 2) * a); };
    }
    lab(ctx, p, V(0, -1.9, .5)); return fn;
  };

  /* ---------- force: 3 ---------- */
  M.force = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'orange'); let fn = () => { };
    if (m === 'dealt') { /* FA'ALA: a strike and its shockwave on a cluster */
      const a = orb(ctx, c, .34, V(-2.2, 0, 0)); const cl = swarm(ctx, 30, 0xcfd8ee, .1, (i, t, o) => { const u = clamp(((t * .35) % 1.6) - .55), d = u * (1 + (i % 5) * .5); o[0] = 1.4 + Math.cos(i * 2.4) * (.5 + d); o[1] = Math.sin(i * 2.4) * (.5 + d); o[2] = 0; });
      const sw = ring(1, c, .7, 1.4, 0); ctx.add(sw);
      fn = (t, k) => { a.step(t, sm(k * 2)); const q = (t * .35) % 1.6, ap = q < .55 ? -2.2 + q / .55 * 2.9 : .7 - (q - .55) * .5; a.g.position.x = ap; cl(t, k); const u = clamp((q - .55) * 1.5); sw.scale.setScalar(.2 + u * 3); sw.material.opacity = .8 * (1 - u) * (q > .55 ? 1 : 0); };
    } else if (m === 'repel') { /* YADU'U: a hand pushes a small light away */
      const a = orb(ctx, c, .38, V(-1.4, 0, 0)), b = orb(ctx, 0xcfd8ee, .18, V(.4, 0, 0)); const f = swarm(ctx, 20, c, .08, (i, t, o) => { const u = ((t * .3 + i / 20) % 1); o[0] = -1 + u * 1.6; o[1] = Math.sin(i * 2) * .4 * u; o[2] = 0; });
      fn = (t, k) => { a.step(t, sm(k * 2)); const u = ((t * .2) % 1); b.g.position.set(.4 + u * 2.2, Math.sin(u * 4) * .2, 0); b.g.scale.setScalar(Math.max(.2, 1 - u * .7)); b.step(t, sm(k * 2)); f(t, k); };
    } else if (m === 'withhold') { /* YAMNA'UN: a closed fist-ring holds back a flow */
      const f = swarm(ctx, 50, 0xffc65a, .08, (i, t, o) => { const u = ((t * .3 + i / 50) % 1); o[0] = -2.6 + u * 2.2; o[1] = Math.sin(i * 3) * .6 * (1 - u * .3); o[2] = 0; if (u > .98) o[1] = 9; }); const wall = ln([V(-.2, -1.2, 0), V(-.2, 1.2, 0)], c, .95), cl = ring(.55, c, .8, .3, 0); ctx.add(wall, cl);
      const kept = swarm(ctx, 12, 0xffc65a, .1, (i, t, o) => { const a = i / 12 * PI2 + t * .3; o[0] = .9 + Math.cos(a) * .28; o[1] = Math.sin(a) * .28; o[2] = 0; });
      fn = (t, k) => { f(t, k); kept(t, k); cl.rotation.z = t * .4; };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };

  /* ---------- shelter & fear: 3 ---------- */
  M.shelter = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'cyan'); let fn = () => { };
    const dome = (r, o) => { const g = new T.Group(); for (let i = 0; i < 6; i++) { const l = ln(Array.from({ length: 24 }, (_, j) => { const a = PI * j / 23; return V(Math.cos(a) * r, Math.sin(a) * r * .9, 0); }), c, o); l.rotation.y = i * PI / 6; g.add(l); } g.position.y = -1; ctx.add(g); return g; };
    if (m === 'secure') { /* WA-AMANAHUM: a dome slowly closes over them */
      const os = [-.6, 0, .6].map(x => orb(ctx, 0xffe2a8, .16, V(x, -.9, 0), 8)), d = dome(1.6, .6);
      fn = (t, k) => { const u = sm(((t * .2) % 1.4) / 1); d.scale.setScalar(.3 + u * .7); d.rotation.y = t * .2; os.forEach((o, i) => o.step(t + i, sm(k * 2))); };
    } else if (m === 'fear') { /* KHAWF: lights trembling, shadows pressing */
      const f = swarm(ctx, 18, 0xff5a4a, .13, (i, t, o) => { o[0] = (i % 6 - 2.5) * .55 + Math.sin(t * 17 + i) * .05; o[1] = -.3 + Math.floor(i / 6) * .5 + Math.cos(t * 19 + i) * .05; o[2] = 0; }); const sh = swarm(ctx, 50, 0x1a0e14, .24, (i, t, o) => { const u = (t * .2 + i / 50) % 1, a = i * 2.4; o[0] = Math.cos(a) * (3.2 - u * 1.7); o[1] = Math.sin(a) * (2 - u); o[2] = -.5; }, .8);
      fn = (t, k) => { sh(t, k); f(t, k); };
    } else if (m === 'refuge') { /* A'UDHU: threats outside, a light ducks into a dome */
      const d = dome(1.2, .8), o = orb(ctx, c, .22, V(0, -.9, 0)); const th = swarm(ctx, 30, 0xff5a4a, .1, (i, t, oo) => { const u = ((t * .25 + i / 30) % 1), a = i * 2.4; const r = 3 - u * 1.9; oo[0] = Math.cos(a) * r; oo[1] = -1 + Math.abs(Math.sin(a)) * r * .6; oo[2] = 0; if (r < 1.45) { oo[0] = Math.cos(a) * 3; oo[1] = 9; } });
      fn = (t, k) => { o.step(t, sm(k * 2)); th(t, k); d.rotation.y = t * .3; d.children.forEach(l => l.material.opacity = .55 + .25 * Math.sin(t * 3)); };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };

  /* ---------- wealth, hatred, journey, food: 6 ---------- */
  M.misc = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'pile') { /* MALUHU: a pile of coins growing, held */
      const f = swarm(ctx, 60, c, .12, (i, t, o) => { const u = Math.min(1, ((t * .25 - i * .02) % 2.2)), k2 = i % 10, h = Math.floor(i / 10); o[0] = (k2 - 4.5) * .22 + (h % 2) * .1; o[1] = -1.4 + h * .2 - (1 - u) * 2; o[2] = 0; }); ctx.add(glow(c, 3, V(0, -.8, 0), .3));
      fn = (t, k) => f(t, k);
    } else if (m === 'earn') { /* KASABA: coins rising out of work's motion */
      const o = orb(ctx, 0xcfd8ee, .24, V(-1.8, -.3, 0)); const f = swarm(ctx, 36, c, .12, (i, t, oo) => { const u = ((t * .3 + i / 36) % 1); oo[0] = -1.8 + u * 3.6; oo[1] = -.3 + Math.sin(u * PI) * 1.1; oo[2] = 0; }); const pile = swarm(ctx, 16, c, .12, (i, t, oo) => { oo[0] = 1.8 + (i % 4 - 1.5) * .25; oo[1] = -1.3 + Math.floor(i / 4) * .22; oo[2] = 0; });
      fn = (t, k) => { o.step(t, sm(k * 2)); f(t, k); pile(t, k); };
    } else if (m === 'hater') { /* SHANI'UKA: a dark thorned light aimed at a gold one, and it withers */
      const a = orb(ctx, 0x57e08a, .26, V(-1.9, 0, 0), 10), b = orb(ctx, c, .38, V(1.9, 0, 0)); for (let i = 0; i < 8; i++) { const an = i / 8 * PI2; a.g.add(ln([V(Math.cos(an) * .3, Math.sin(an) * .3, 0), V(Math.cos(an) * .7, Math.sin(an) * .7, 0)], 0x57e08a, .8)); }
      const f = swarm(ctx, 26, 0x57e08a, .07, (i, t, o) => { const u = ((t * .35 + i / 26) % 1); o[0] = -1.9 + u * 3.2; o[1] = Math.sin(u * 9 + i) * .15 * (1 - u); o[2] = 0; }, .8);
      fn = (t, k) => { a.step(t, sm(k * 2)); b.step(t, sm(k * 2)); f(t, k); a.g.rotation.z = t; a.g.scale.setScalar(1 - .25 * Math.max(0, Math.sin(t * .8))); };
    } else if (m === 'burn') { /* HASAD: green fire on the envier himself */
      const f = swarm(ctx, 200, 0x57e08a, .1, (i, t, o) => { const u = ((t * (.35 + (i % 5) * .05) + i * .618) % 1), a = i * 2.4, r = (1 - u) * .9 * Math.sqrt((i % 11) / 11); o[0] = Math.cos(a) * r - 1.8; o[1] = -1.2 + u * 2.6; o[2] = Math.sin(a) * r * .5; }, .85); const b = orb(ctx, 0xffc65a, .38, V(1.9, 0, 0)); ctx.add(glow(0x57e08a, 3, V(-1.8, -.3, 0), .3));
      fn = (t, k) => { f(t, k); b.step(t, sm(k * 2)); };
    } else if (m === 'journey') { /* RIHLAT: a route between two lands */
      const A = glow(0xffc65a, .9, V(-2.4, -.4, 0), .8), B = glow(0x35d0e6, .9, V(2.4, .4, 0), .8); ctx.add(A, B); const arc = Array.from({ length: 40 }, (_, i) => { const u = i / 39; return V(-2.4 + u * 4.8, -.4 + u * .8 + Math.sin(u * PI) * .8, 0); }); ctx.add(ln(arc, 0xcfd8ee, .4));
      const f = swarm(ctx, 16, c, .11, (i, t, o) => { const u = ((t * .18 + i / 16) % 1), q = arc[Math.min(39, Math.floor(u * 39))]; o[0] = q.x; o[1] = q.y; o[2] = 0; }), g = swarm(ctx, 10, 0x35d0e6, .09, (i, t, o) => { const u = 1 - ((t * .18 + i / 10) % 1), q = arc[Math.min(39, Math.floor(u * 39))]; o[0] = q.x; o[1] = q.y - .2; o[2] = 0; });
      fn = (t, k) => { f(t, k); g(t, k); };
    } else if (m === 'food') { /* TA'AM: round loaves stacked, steam rising */
      const lo = []; for (let i = 0; i < 6; i++) { const r = ring(.55 - (i % 3) * .05, c, .85, (i % 3 - 1) * .95, -.6 + Math.floor(i / 3) * .35); r.scale.y = .45; ctx.add(r); lo.push(r); }
      const st = swarm(ctx, 40, 0xffe2a8, .07, (i, t, o) => { const u = ((t * .2 + i / 40) % 1); o[0] = Math.sin(i * 5) * 1.5 + Math.sin(u * 6 + i) * .1; o[1] = -.2 + u * 1.8; o[2] = 0; }, .5);
      fn = (t, k) => { st(t, k); lo.forEach((r, i) => r.scale.x = 1 + .03 * Math.sin(t * 2 + i)); };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };

  /* ---------- nature/time variants: 7 ---------- */
  M.nat2 = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'ababil') { /* ABABIL: a dense V-swarm sweeping across */
      const f = swarm(ctx, 90, 0xcfd8ee, .09, (i, t, o) => { const u = ((t * .2 + i * .013) % 1), row = i % 9, col2 = Math.floor(i / 9); o[0] = -3 + u * 6 - Math.abs(row - 4) * .18 - col2 * .1; o[1] = 1 - (row - 4) * .22 * .5 + Math.sin(t * 7 + i) * .08 - u * .8; o[2] = (row - 4) * .15; }); ctx.add(glow(0xffe2a8, 4, V(0, 2, -.5), .25));
      fn = (t, k) => f(t, k);
    } else if (m === 'hijara') { /* BI-HIJARA: stones in a heap, arrows of throw */
      const f = swarm(ctx, 40, 0xcfa070, .14, (i, t, o) => { const u = ((t * .25 + i / 40) % 1); o[0] = -2.4 + u * 4.4; o[1] = -.6 + Math.sin(u * PI) * (1.1 + (i % 4) * .2); o[2] = 0; }); const heap = swarm(ctx, 24, 0xa88050, .2, (i, t, o) => { o[0] = -2.5 + (i % 6) * .22 - Math.floor(i / 6) * .05; o[1] = -1.3 + Math.floor(i / 6) * .22; o[2] = 0; });
      fn = (t, k) => { f(t, k); heap(t, k); };
    } else if (m === 'eaten') { /* MA'KUL: straw with bite marks, fragments flying */
      const f = swarm(ctx, 120, 0xd8c070, .06, (i, t, o) => { const u = ((t * .2 + i * .008) % 1), a = i * 2.4; o[0] = Math.cos(a) * (.4 + u * 2.2); o[1] = -.3 + Math.sin(a) * .3 * u + u * .5 - u * u * .9; o[2] = 0; }, .9); const bite = ring(.4, 0x0a0f1a, .0, 0, 0); ctx.add(glow(0xd8c070, 2.2, V(0, -.3, 0), .15));
      fn = (t, k) => f(t, k);
    } else if (m === 'fath') { /* AL-FATH: a key turns, light flows out of a lock */
      const lk = ring(.6, c, .85, 0, 0); ctx.add(lk, ln([V(-.25, -.2, 0), V(.25, -.2, 0), V(.25, -.8, 0), V(-.25, -.8, 0), V(-.25, -.2, 0)], c, .85)); const rays = swarm(ctx, 70, c, .07, (i, t, o) => { const u = ((t * .3 + i / 70) % 1), a = (i / 70 - .5) * 2.6; o[0] = Math.sin(a) * u * 3.2; o[1] = .3 + Math.cos(a) * u * 2.2 - .6; o[2] = 0; });
      fn = (t, k) => { const op = sm(((t * .3) % 1.6) / 1); lk.position.y = op * .25; rays(t, k); };
    } else if (m === 'waqab') { /* WAQAB: darkness enters and covers everything */
      const f = swarm(ctx, 120, 0x1a1a3a, .5, (i, t, o) => { const u = sm(((t * .15) % 1.2) / 1), a = i * 2.4; o[0] = Math.cos(a) * 3.2 * (.2 + .8 * ((i * .37) % 1)); o[1] = (2.2 - u * 3.8) + Math.sin(a) * .6; o[2] = -.4; }, .85); const m1 = glow(0xcfd8ee, .8, V(1.7, 1.4, -.5), .8); ctx.add(m1);
      fn = (t, k) => { f(t, k); m1.material.opacity = .9 - sm(((t * .15) % 1.2) / 1) * .6; };
    } else if (m === 'idha') { /* IDHA: a clock hand sweeps toward the appointed moment */
      const cl = ring(1.5, c, .7, 0, 0, 80); ctx.add(cl); for (let i = 0; i < 12; i++) { const a = i / 12 * PI2; ctx.add(ln([V(Math.sin(a) * 1.3, Math.cos(a) * 1.3, 0), V(Math.sin(a) * 1.5, Math.cos(a) * 1.5, 0)], c, .7)); }
      const hd = ln([V(0, 0, 0), V(0, 1.25, 0)], 0xffffff, .95); ctx.add(hd, glow(c, 3.4, V(0, 0, 0), .25)); const mk = glow(0xffe2a8, .8, V(0, 1.5, 0), .9); ctx.add(mk);
      fn = (t, k) => { const u = (t * .12) % 1; hd.rotation.z = -u * PI2; mk.material.opacity = u > .9 ? 1 : .4; mk.scale.setScalar(.8 + (u > .9 ? .5 * Math.sin(t * 12) : 0)); };
    } else if (m === 'dyn') { /* BID-DIN: scales with a record weighed */
      const beam = new T.Group(); beam.add(ln([V(-1.5, 0, 0), V(1.5, 0, 0)], c, .95)); beam.position.y = .6; ctx.add(beam, ln([V(0, -1.5, 0), V(0, .6, 0)], c, .9)); const L1 = ring(.45, c, .8, -1.5, -.5), L2 = ring(.45, 0x7aa8ff, .8, 1.5, -.5); beam.add(L1, L2);
      const bk = ln([V(1.1, -.2, 0), V(1.9, -.2, 0), V(1.9, -.9, 0), V(1.1, -.9, 0), V(1.1, -.2, 0)], 0x7aa8ff, .8); beam.add(bk); const g = glow(c, .6, V(-1.5, -.5, 0), .9); beam.add(g);
      fn = (t, k) => { beam.rotation.z = Math.sin(t * .8) * .12; };
    }
    lab(ctx, p, V(0, -2, .5)); return fn;
  };
})();

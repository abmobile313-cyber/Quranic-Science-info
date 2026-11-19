/* Fahm Lab motif library 2a: worship/prayer, pronouns, prepositions — every word its own scene. */
(function () {
  'use strict';
  const L = window.FahmLab; if (!L || !L.api) return;
  const { T, V, clamp, sm, glow, textSprite, pts, lineMat, loop, orb, col } = L.api;
  const M = L.motifs, PI = Math.PI, PI2 = Math.PI * 2;
  const hex = (c) => '#' + new T.Color(col(c)).getHexString();
  const ln = (a, c, o) => { const l = new T.Line(new T.BufferGeometry().setFromPoints(a), lineMat(col(c), o)); l.frustumCulled = false; return l; };
  const ring = (r, c, o, cx = 0, cy = 0, n = 64) => loop(Array.from({ length: n }, (_, k) => V(cx + Math.cos(k / n * PI2) * r, cy + Math.sin(k / n * PI2) * r, 0)), c, o);
  const lab = (ctx, p, at) => { if (p.l) ctx.label(p.l, at || V(0, -2.1, .5), { color: hex(p.color || 'gold') }); };
  /* particle swarm: fn(i,t,out,k) */
  function swarm(ctx, n, color, size, fn, op = 1) {
    const a = new Float32Array(n * 3), P = pts(a, col(color), size * 2.3, op); ctx.add(P); const o = [0, 0, 0];
    return (t, k) => { t = Math.max(0, t); for (let i = 0; i < n; i++) { fn(i, t, o, k); a[i * 3] = o[0]; a[i * 3 + 1] = o[1]; a[i * 3 + 2] = o[2]; } P.geometry.attributes.position.needsUpdate = true; P.material.opacity = op * sm(k * 2); };
  }
  const cube = (ctx, s, c, o, pos) => { const h = s / 2, P = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]].map(a => V(a[0], a[1], a[2])); const g = new T.Group(); [[0, 1, 2, 3, 0], [4, 5, 6, 7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(e => g.add(ln(e.map(i => P[i]), c, o))); if (pos) g.position.copy(pos); ctx.add(g); return g; };
  const rnd = (ctx, n) => Array.from({ length: n }, () => ctx.r());
  const arrow = (ctx, a, b, c, o = .9) => { ctx.add(ln([a, b], c, o)); const d = b.clone().sub(a), cone = new T.Mesh(new T.ConeGeometry(.09, .26, 10), new T.MeshBasicMaterial({ color: col(c), transparent: true, opacity: o })); cone.position.copy(b); cone.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize()); ctx.add(cone); };

  /* ---------- worship & prayer: 15 distinct scenes ---------- */
  M.worship = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'), R = rnd(ctx, 200); let fn = () => { };
    if (m === 'only') { /* IYYAKA: one beam from a small orb to the single centre, everything else dim */
      const A = orb(ctx, 0xcfd8ee, .22, V(-2.3, -.8, 0)), Bc = orb(ctx, c, .5, V(1.2, .3, 0)); const dims = []; for (let i = 0; i < 6; i++) { const d = glow(0x44506a, .7, V(-.2 + (i % 3) * .9, 1.2 - Math.floor(i / 3) * 2.3, -.5), .35); ctx.add(d); dims.push(d); }
      const beam = swarm(ctx, 40, 0xffe2a8, .08, (i, t, o) => { const u = ((t * .5 + i / 40) % 1); o[0] = -2.3 + 3.5 * u; o[1] = -.8 + 1.1 * u + Math.sin(u * 9 + t * 4) * .06; o[2] = 0; });
      fn = (t, k) => { A.step(t, sm(k * 2)); Bc.step(t + 1, sm(k * 2)); beam(t, k); dims.forEach((d, i) => d.material.opacity = .2 + .15 * Math.sin(t + i)); };
    } else if (m === 'help') { /* WA IYYAKA NASTA'IN: call goes up, help comes down */
      const A = orb(ctx, 0xcfd8ee, .26, V(0, -1.2, 0)), S = glow(c, 3.4, V(0, 2.1, -.3), .6); ctx.add(S);
      const up = swarm(ctx, 26, 0xcfd8ee, .07, (i, t, o) => { const u = ((t * .25 + i / 26) % 1); o[0] = Math.sin(u * 8 + i) * .12; o[1] = -1.1 + u * 3.1; o[2] = 0; });
      const dn = swarm(ctx, 36, c, .09, (i, t, o) => { const u = ((t * .3 + i / 36) % 1); o[0] = Math.sin(u * 6 + i * 2) * .5 * (1 - u * .5); o[1] = 2 - u * 3; o[2] = 0; });
      fn = (t, k) => { A.step(t, sm(k * 2)); up(t, k); dn(t, k); S.scale.setScalar(3.4 + .4 * Math.sin(t * 2)); };
    } else if (m === 'turn') { /* FALYA'BUDU: tiny arrows rotate one by one to face the centre */
      const n = 9, arr = [], C = glow(c, 2.2, V(0, 0, 0), .8); ctx.add(C);
      for (let i = 0; i < n; i++) { const a = i / n * PI2, g = new T.Group(); g.position.set(Math.cos(a) * 2.1, Math.sin(a) * 1.4, 0); const cone = new T.Mesh(new T.ConeGeometry(.12, .4, 10), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: .9 })); g.add(cone); ctx.add(g); arr.push([g, a]); }
      fn = (t, k) => arr.forEach(([g, a], i) => { const u = sm(((t * .35 - i * .09) % 2.4) / 1); const face = Math.atan2(-Math.sin(a) * 1.4, -Math.cos(a) * 2.1) - Math.PI / 2, away = face + Math.PI * (1 - Math.min(1, u)); g.rotation.z = away; });
    } else if (m === 'chain') { /* LI-ILAF: interlocked rings */
      const rs = [0, 1, 2].map(i => { const r = ring(.85, c, .9, (i - 1) * 1.1, 0); r.rotation.y = i % 2 ? 1.3 : 0; ctx.add(r); return r; }); ctx.add(glow(c, 3, V(0, 0, 0), .25));
      fn = (t, k) => rs.forEach((r, i) => { r.rotation.y = (i % 2 ? 1.3 : 0) + Math.sin(t * .8 + i) * .5; r.position.y = Math.sin(t + i) * .08; });
    } else if (m === 'bond') { /* ILAFIHIM: two groups bound by a bundle of threads */
      const g1 = swarm(ctx, 20, 0xcfd8ee, .1, (i, t, o) => { o[0] = -2.2 + Math.cos(i * 2.4) * .5; o[1] = Math.sin(i * 1.7 + t * .4) * .5; o[2] = 0; }), g2 = swarm(ctx, 20, c, .1, (i, t, o) => { o[0] = 2.2 + Math.cos(i * 2.1) * .5; o[1] = Math.sin(i * 1.3 + t * .4) * .5; o[2] = 0; });
      const th = [-.5, -.2, .1, .4].map(y => { const l = ln(Array.from({ length: 30 }, (_, i) => V(-1.7 + i / 29 * 3.4, y * (1 - Math.abs(i / 29 - .5) * 1.2), 0)), c, .5); ctx.add(l); return l; });
      fn = (t, k) => { g1(t, k); g2(t, k); th.forEach((l, i) => l.material.opacity = .35 + .3 * Math.sin(t * 2 + i)); };
    } else if (m === 'saff') { /* AL-MUSALLIN: orderly rows facing a cube (Kaaba) */
      const kb = cube(ctx, .9, c, .9, V(0, 1.15, -.6)); ctx.add(glow(c, 2.6, V(0, 1.15, -.6), .25));
      const rows = []; for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) rows.push([(i - 3) * .62, -.9 - r * .55 + 0, r]);
      fn = swarm(ctx, rows.length, 0xcfd8ee, .11, (i, t, o) => { const [x, y, r] = rows[i], ph = ((t * .22 + r * -.0) % 1); const bow = Math.max(0, Math.sin((t * .45) * PI2 / 1.5)); o[0] = x; o[1] = y + .7 - bow * .45 * (r === 0 ? 1 : .9); o[2] = r * .4; });
    } else if (m === 'heedless') { /* SALATIHIM SAHUN: one by one drift out of the row and dim */
      const n = 8, os = []; for (let i = 0; i < n; i++) { const g = glow(0xcfd8ee, .55, V(0, 0, 0), .9); ctx.add(g); os.push(g); } ctx.add(ln([V(-2.8, -.3, 0), V(2.8, -.3, 0)], 0x44506a, .5));
      fn = (t, k) => os.forEach((g, i) => { const d = clamp(((t * .3 + i * .13) % 2.2 - 1) * 1.2), drift = sm(d); g.position.set((i - 3.5) * .7 + Math.sin(t + i) * .4 * drift, -.3 + drift * (.9 + (i % 3) * .3), 0); g.material.opacity = .9 * (1 - drift * .85); });
    } else if (m === 'cycle') { /* FASALLI: stand - bow - prostrate loop */
      const o = orb(ctx, c, .3, V(0, 1, 0)), trail = swarm(ctx, 30, c, .06, (i, t, oo) => { const tt = t - i * .06, q = Math.sin(tt * .9); oo[0] = Math.sin(tt * .9 + 1.5) * 1.6; oo[1] = .9 - Math.abs(Math.sin(tt * .9)) * 1.9; oo[2] = 0; }, .6);
      ctx.add(ln([V(-2.6, -1.2, 0), V(2.6, -1.2, 0)], 0x44506a, .6));
      fn = (t, k) => { const q = (t * .45) % 1, y = q < .3 ? 1 : q < .55 ? 1 - sm((q - .3) / .25) * .9 : q < .8 ? .1 - sm((q - .55) / .25) * 1.0 : -.9 + sm((q - .8) / .2) * 1.9; o.g.position.set(0, y, 0); o.step(t, sm(k * 2)); trail(t * 0, k); };
    } else if (m === 'abd') { /* AUBUDU: small orb tethered to a great light */
      const big = orb(ctx, c, .7, V(0, 0, 0)), sm1 = orb(ctx, 0xcfd8ee, .17, V(2, 0, 0)), tether = ln([V(0, 0, 0), V(2, 0, 0)], c, .5); ctx.add(tether);
      fn = (t, k) => { big.step(t, sm(k * 2)); const a = t * .6, r = 2 + .06 * Math.sin(t * 3); sm1.g.position.set(Math.cos(a) * r, Math.sin(a) * r * .5, Math.sin(a) * .6); sm1.step(t, sm(k * 2)); const q = tether.geometry.attributes.position; q.setXYZ(1, sm1.g.position.x, sm1.g.position.y, sm1.g.position.z); q.needsUpdate = true; };
    } else if (m === 'idols') { /* TA'BUDUN: orbs facing dead grey cubes, the living light stays apart */
      const cs = [-2.4, -.9].map((x, i) => cube(ctx, .7, 0x6a748c, .6, V(x, .3 - i * .5, 0))), me = orb(ctx, c, .38, V(2, 0, 0));
      const q = swarm(ctx, 24, 0x8a94ac, .07, (i, t, o) => { const u = ((t * .2 + i / 24) % 1); o[0] = 1.4 - u * 3; o[1] = .4 * Math.sin(u * 4 + i); o[2] = 0; }, .5);
      fn = (t, k) => { cs.forEach((x, i) => { x.rotation.y = t * .3 * (i ? -1 : 1); x.rotation.x = .4; }); me.step(t, sm(k * 2)); q(t, k); };
    } else if (m === 'only1') { /* 'ABDUN: I worship — one orb faces the viewer, the others walk away */
      const me = orb(ctx, c, .45, V(0, 0, .5)), away = swarm(ctx, 12, 0x6a748c, .09, (i, t, o) => { const u = ((t * .12 + i / 12) % 1), a = i / 12 * PI2; o[0] = Math.cos(a) * (1.3 + u * 2.2); o[1] = Math.sin(a) * (.8 + u * 1.3); o[2] = -u; }, .8);
      fn = (t, k) => { me.step(t, sm(k * 2)); away(t, k); };
    } else if (m === 'halo') { /* ABID: a bowed worshipper with a halo of light */
      const o = orb(ctx, 0xcfd8ee, .28, V(0, -.5, 0)), h = ring(.7, c, .8, 0, 0), h2 = ring(1.1, c, .35, 0, 0); h.position.y = -.2; h2.position.y = -.2; ctx.add(h, h2); ctx.add(ln([V(-1.8, -1.05, 0), V(1.8, -1.05, 0)], 0x44506a, .6));
      fn = (t, k) => { o.step(t, sm(k * 2)); const s = 1 + .08 * Math.sin(t * 2); h.scale.setScalar(s); h2.scale.setScalar(1 + .15 * Math.sin(t * 2 + 1)); h.rotation.y = t * .5; };
    } else if (m === 'past') { /* 'ABADTUM: ghost trail — worship that already went toward other things */
      const o = glow(c, .8, V(0, 0, 0), .95); ctx.add(o); const tr = swarm(ctx, 50, c, .08, (i, t, oo) => { const tt = t - i * .07, a = tt * .8; oo[0] = 2.3 - ((tt * .5) % 1 + 1) % 1 * 4.6 * 0 + Math.cos(a) * 2.2; oo[1] = Math.sin(a * 1.3) * .8; oo[2] = 0; }, .7);
      const tomb = cube(ctx, .6, 0x6a748c, .5, V(2.3, -.8, 0));
      fn = (t, k) => { const a = t * .8; o.position.set(Math.cos(a) * 2.2, Math.sin(a * 1.3) * .8, 0); o.material.opacity = .9; tr(t, k); tomb.rotation.y = t * .2; };
    } else if (m === 'throne') { /* ILAH: a column of light on high, the rest gathered beneath */
      const col1 = swarm(ctx, 70, c, .08, (i, t, o) => { const u = ((t * .3 + i / 70) % 1); o[0] = Math.cos(i * 2.4) * .22 * (1 - u * .4); o[1] = 2 - u * 3.4; o[2] = Math.sin(i * 2.4) * .22; }, .9);
      ctx.add(glow(c, 3, V(0, 1.9, 0), .8)); const crowd = swarm(ctx, 36, 0xcfd8ee, .09, (i, t, o) => { const a = i * 2.4; o[0] = Math.cos(a) * (.5 + i * .07); o[1] = -1.5 + Math.abs(Math.sin(t + i)) * .05; o[2] = Math.sin(a) * .5; });
      fn = (t, k) => { col1(t, k); crowd(t, k); };
    } else if (m === 'nahr') { /* WANHAR: red drops poured, then spread as golden drops to many small lights */
      const o = orb(ctx, 0xff5a4a, .3, V(-1.8, .5, 0)); const drops = swarm(ctx, 36, 0xff5a4a, .09, (i, t, oo) => { const u = ((t * .35 + i / 36) % 1); oo[0] = -1.8 + u * .4; oo[1] = .3 - u * 1.4; oo[2] = 0; }, .8);
      const gold = swarm(ctx, 50, c, .09, (i, t, oo) => { const u = ((t * .25 + i / 50) % 1), a = i * 2.4; oo[0] = -1.2 + u * 3.4; oo[1] = -1.1 + Math.sin(u * PI) * .9 * (.4 + (i % 5) * .2); oo[2] = Math.sin(a) * .3; }, .8);
      const rec = []; for (let i = 0; i < 5; i++) { const g = glow(0xcfd8ee, .35, V(1.1 + i * .45, -1.25, 0), .8); ctx.add(g); rec.push(g); }
      fn = (t, k) => { o.step(t, sm(k * 2)); drops(t, k); gold(t, k); rec.forEach((g, i) => g.material.opacity = .4 + .5 * Math.max(0, Math.sin(t * 1.2 - i * .6))); };
    }
    lab(ctx, p, V(0, -2.1, .5));
    return fn;
  };

  /* ---------- pronouns: 12 distinct scenes ---------- */
  M.pron2 = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'this') { /* HADHA: pointer to something near */
      const near = cube(ctx, .8, c, .9, V(1.1, 0, 0)); arrow(ctx, V(-2.5, -1, 0), V(.2, -.1, 0), 0xcfd8ee); ctx.add(glow(c, 2.4, V(1.1, 0, 0), .35));
      fn = (t, k) => { near.rotation.y = t * .6; near.rotation.x = .5; near.scale.setScalar(1 + .06 * Math.sin(t * 3)); };
    } else if (m === 'rel') { /* ALLADHI: a relative link — arc from the subject to the clause */
      const s = orb(ctx, c, .3, V(-2, 0, 0)), cl = ring(1.2, 0x7aa8ff, .6, 1.5, 0); ctx.add(cl);
      const arc = Array.from({ length: 30 }, (_, i) => V(-1.7 + i / 29 * 2.4, Math.sin(i / 29 * PI) * 1.1, 0)); ctx.add(ln(arc, 0xcfd8ee, .6));
      const dots = swarm(ctx, 10, 0x7aa8ff, .08, (i, t, o) => { const a = i / 10 * PI2 + t * .5; o[0] = 1.5 + Math.cos(a) * .8; o[1] = Math.sin(a) * .8; o[2] = 0; });
      const tr = swarm(ctx, 14, 0xffe2a8, .07, (i, t, o) => { const u = (t * .3 + i / 14) % 1, q = arc[Math.min(29, Math.floor(u * 29))]; o[0] = q.x; o[1] = q.y; o[2] = 0; });
      fn = (t, k) => { s.step(t, sm(k * 2)); dots(t, k); tr(t, k); };
    } else if (m === 'that') { /* DHALIKA: pointer to something far, fading into depth */
      const far = cube(ctx, .5, 0x8a94ac, .55, V(1.6, .5, -2.6)); arrow(ctx, V(-2.5, -1, 0), V(.6, .2, -1), 0xcfd8ee, .7);
      const tr = swarm(ctx, 16, 0xffe2a8, .07, (i, t, o) => { const u = (t * .3 + i / 16) % 1; o[0] = -2.5 + 4.1 * u; o[1] = -1 + 1.5 * u; o[2] = -2.6 * u; });
      fn = (t, k) => { far.rotation.y = t * .3; tr(t, k); };
    } else if (m === 'he') { /* HUWA: a single third-person orb off to the side, the viewer gestures to it */
      const o = orb(ctx, c, .42, V(1.7, .2, 0)); arrow(ctx, V(-2.4, -.9, 0), V(.9, .05, 0), 0xcfd8ee, .6); ctx.add(ring(.9, c, .3, 1.7, .2));
      fn = (t, k) => o.step(t, sm(k * 2));
    } else if (m === 'zat') { /* DHAT: an essence with shells */
      const core = glow(c, 1, V(0, 0, 0), 1); ctx.add(core); const sh = [.8, 1.3, 1.9].map((r, i) => { const q = pts(L.api.fib(300 + i * 160, r), c, .045, .6 - i * .1); ctx.add(q); return q; });
      fn = (t, k) => { sh.forEach((q, i) => { q.rotation.y = t * (.3 + i * .12) * (i % 2 ? -1 : 1); q.rotation.x = .3 * i; }); core.scale.setScalar(1 + .1 * Math.sin(t * 2)); };
    } else if (m === 'they') { /* HUM: five at a distance, to the right, small and many */
      const g = swarm(ctx, 5, 0xcfd8ee, .17, (i, t, o) => { o[0] = 1 + i * .55 + Math.sin(t + i) * .05; o[1] = .35 * Math.sin(i * 1.9); o[2] = -1 - i * .15; }); arrow(ctx, V(-2.5, -1, 0), V(.5, -.2, -.5), 0x7a8cb0, .5);
      fn = (t, k) => g(t, k);
    } else if (m === 'we') { /* ANA/NAHNU (majesty): great golden light with satellites */
      const big = orb(ctx, c, .6, V(0, 0, 0)), sats = [0, 1, 2, 3].map(i => glow(0xfff0c0, .5, V(0, 0, 0), .9)); sats.forEach(s => ctx.add(s)); ctx.add(ring(1.6, c, .3, 0, 0), ring(2.3, c, .2, 0, 0));
      fn = (t, k) => { big.step(t, sm(k * 2)); sats.forEach((s, i) => { const a = t * .5 + i * PI2 / 4, r = 1.6 + (i % 2) * .7; s.position.set(Math.cos(a) * r, Math.sin(a) * r * .5, Math.sin(a) * .4); }); };
    } else if (m === 'you') { /* ANTUM: a row faces the viewer, arrows aimed at them */
      const os = [-2.1, -.7, .7, 2.1].map(x => orb(ctx, 0x7aa8ff, .22, V(x, 0, 0))); os.forEach((o, i) => arrow(ctx, V(-2.5 + i * .3, -1.8, 1.2), V(-2.1 + i * 1.4, -.5, 0), 0xcfd8ee, .4));
      fn = (t, k) => os.forEach((o, i) => o.step(t + i, sm(k * 2)));
    } else if (m === 'inna') { /* INNAHU: emphatic stamp — rings pulse onto an orb */
      const o = orb(ctx, c, .34, V(0, 0, 0)), rs = [0, 1, 2].map(i => { const r = ring(1, c, .8); ctx.add(r); return r; });
      fn = (t, k) => { o.step(t, sm(k * 2)); rs.forEach((r, i) => { const u = ((t * .5 + i / 3) % 1); r.scale.setScalar(3.4 - u * 3); r.material.opacity = .85 * u * sm(k * 2); }); };
    } else if (m === 'kana') { /* KANA: "was" — a solid trail behind, the orb stands at the present */
      const o = orb(ctx, c, .3, V(.9, 0, 0)); const tr = swarm(ctx, 70, c, .07, (i, t, oo) => { oo[0] = .9 - i * .055; oo[1] = Math.sin(i * .3) * .1; oo[2] = 0; }, .8); ctx.add(ln([V(-2.8, -.7, 0), V(2.4, -.7, 0)], 0x44506a, .5));
      fn = (t, k) => { o.step(t, sm(k * 2)); tr(t, k); };
    } else if (m === 'father') { /* ABI: a great orb sheltering a small one under an arc */
      const f = orb(ctx, c, .5, V(0, .7, 0)), s = orb(ctx, 0xcfd8ee, .18, V(0, -.8, 0)); const arc = ln(Array.from({ length: 40 }, (_, i) => V(Math.cos(PI * i / 39) * 1.4, -1 + Math.sin(PI * i / 39) * 1.7, 0)), c, .6); ctx.add(arc);
      fn = (t, k) => { f.step(t, sm(k * 2)); s.step(t + 1, sm(k * 2)); arc.material.opacity = .45 + .2 * Math.sin(t * 2); };
    } else if (m === 'wife') { /* WA-IMRA'ATUHU: two orbs bound by a thread, one carries a bundle */
      const a = orb(ctx, 0x7aa8ff, .3, V(-1.5, 0, 0)), b = orb(ctx, 0xff944d, .3, V(1.5, 0, 0)); const th = ln(Array.from({ length: 30 }, (_, i) => V(-1.3 + i / 29 * 2.6, Math.sin(i / 29 * PI) * -.35, 0)), 0xcfd8ee, .6); ctx.add(th);
      const bundle = swarm(ctx, 18, 0xa8743a, .06, (i, t, o) => { o[0] = 1.5 + (i % 6 - 2.5) * .08; o[1] = .35 + Math.floor(i / 6) * .09; o[2] = 0; }, .9);
      fn = (t, k) => { a.step(t, sm(k * 2)); b.step(t + 1, sm(k * 2)); bundle(t, k); };
    }
    lab(ctx, p, V(0, -2.0, .5));
    return fn;
  };

  /* ---------- prepositions: each its own relation ---------- */
  M.prep2 = (ctx, p) => {
    const m = p.mode, c = col(p.color || 'gold'); let fn = () => { };
    if (m === 'upon') { /* ALAYHIM: light falls onto a small group */
      const g = [-1.2, 0, 1.2].map(x => orb(ctx, 0x7aa8ff, .2, V(x, -1, 0))); const rain = swarm(ctx, 60, c, .07, (i, t, o) => { const u = ((t * .35 + i * .618) % 1); o[0] = ((i * 1.37) % 3.2) - 1.6; o[1] = 2 - u * 3; o[2] = 0; });
      fn = (t, k) => { g.forEach((o, i) => o.step(t + i, sm(k * 2))); rain(t, k); };
    } else if (m === 'make') { /* YAJ'AL: raw cloud takes a shape */
      const n = 140, tgt = Array.from({ length: n }, (_, i) => { const a = i / n * PI2; return [Math.cos(a) * 1.2, Math.sin(a) * 1.2]; }), R = rnd(ctx, n * 2);
      const f = swarm(ctx, n, c, .08, (i, t, o) => { const u = sm(((t * .3) % 1.6) * 1.2 > 1 ? 1 : ((t * .3) % 1.6) * 1.2); o[0] = (R[i] - .5) * 4 * (1 - u) + tgt[i][0] * u; o[1] = (R[n + i] - .5) * 2.4 * (1 - u) + tgt[i][1] * u; o[2] = 0; }); ctx.add(glow(c, 2, V(0, 0, 0), .2));
      fn = (t, k) => f(t, k);
    } else if (m === 'for') { /* LAKUM: gifts flow from a source toward the viewer's side */
      const s = orb(ctx, c, .4, V(-2, .4, 0)), r = orb(ctx, 0xcfd8ee, .25, V(2, -.3, 0)); const f = swarm(ctx, 30, c, .09, (i, t, o) => { const u = ((t * .3 + i / 30) % 1); o[0] = -2 + 4 * u; o[1] = .4 - .7 * u + Math.sin(u * PI) * .9; o[2] = Math.sin(i) * .2; });
      fn = (t, k) => { s.step(t, sm(k * 2)); r.step(t + 1, sm(k * 2)); f(t, k); };
    } else if (m === 'mine') { /* LI: belonging — stream into a small ring on the left */
      const r = ring(.8, c, .8, -1.5, 0), o = orb(ctx, c, .25, V(-1.5, 0, 0)); ctx.add(r); const f = swarm(ctx, 24, c, .08, (i, t, oo) => { const u = ((t * .35 + i / 24) % 1); oo[0] = 2.5 - 4 * u; oo[1] = Math.sin(u * 5) * .3; oo[2] = 0; });
      fn = (t, k) => { o.step(t, sm(k * 2)); f(t, k); r.scale.setScalar(1 + .06 * Math.sin(t * 3)); };
    } else if (m === 'his') { /* LAHU: belonging — a halo claims an orb on the right */
      const o = orb(ctx, c, .4, V(1.6, 0, 0)), r1 = ring(.9, c, .8, 1.6, 0), r2 = ring(1.35, c, .35, 1.6, 0); ctx.add(r1, r2); const f = swarm(ctx, 20, 0xcfd8ee, .07, (i, t, oo) => { const u = ((t * .3 + i / 20) % 1); oo[0] = -2.6 + 3.5 * u; oo[1] = -.8 + .8 * u; oo[2] = 0; });
      fn = (t, k) => { o.step(t, sm(k * 2)); f(t, k); r1.rotation.z = t * .4; };
    } else if (m === 'away') { /* AN: leaving, dimming */
      const o = glow(c, .8, V(-1.5, 0, 0), .9), r = ring(.9, c, .4, -1.5, 0); ctx.add(o, r);
      fn = (t, k) => { const u = ((t * .25) % 1); o.position.set(-1.5 + u * 4, Math.sin(u * 5) * .25, 0); o.material.opacity = .95 * (1 - u * .9); o.scale.setScalar(.8 * (1 - u * .5)); };
    } else if (m === 'frm') { /* ANHU: a thread snaps from him */
      const a = orb(ctx, c, .35, V(-1.8, 0, 0)), b = glow(0xcfd8ee, .5, V(1.8, 0, 0), .9); ctx.add(b); const th = ln(Array.from({ length: 24 }, (_, i) => V(-1.5 + i / 23 * 3, 0, 0)), 0xcfd8ee, .6); ctx.add(th);
      fn = (t, k) => { a.step(t, sm(k * 2)); const u = (t * .3) % 1.2, br = u > .6; const q = th.geometry.attributes.position; for (let i = 0; i < 24; i++) q.setXYZ(i, -1.5 + i / 23 * 3 * (br ? (i < 12 ? 1 : 1) : 1) + (br ? (i < 12 ? -u * .6 : u * .9) : 0), Math.sin(i * .6 + t * 4) * (br ? .3 : .02), 0); q.needsUpdate = true; th.material.opacity = br ? Math.max(0, 1.2 - u) * .8 : .7; b.position.x = 1.8 + (br ? (u - .6) * 1.4 : 0); };
    } else if (m === 'and-from') { /* WA-MIN: two sources, one toward the centre */
      const a = orb(ctx, c, .28, V(-2, .9, 0)), b = orb(ctx, 0x7aa8ff, .28, V(-2, -.9, 0)), z = glow(0xffffff, 1.4, V(1.8, 0, 0), .8); ctx.add(z);
      const f = swarm(ctx, 36, 0xcfd8ee, .08, (i, t, o) => { const u = ((t * .3 + i / 36) % 1), top = i % 2; o[0] = -2 + 3.8 * u; o[1] = (top ? .9 : -.9) * (1 - u); o[2] = 0; });
      fn = (t, k) => { a.step(t, sm(k * 2)); b.step(t + 1, sm(k * 2)); f(t, k); };
    }
    lab(ctx, p, V(0, -1.9, .5));
    return fn;
  };
})();

/* Fahm Lab motif library: ~35 reusable 3D concept scenes. */
(function () {
  'use strict';
  const L = window.FahmLab; if (!L || !L.api) return;
  const { T, V, clamp, sm, glow, textSprite, pts, lineMat, loop, fib, terrain, orb, col } = L.api;
  const M = L.motifs, PI2 = Math.PI * 2;
  const hex = (c) => '#' + new T.Color(col(c)).getHexString();
  const seeds = (ctx, n) => Array.from({ length: n }, () => ctx.r());
  const line = (a, c, o) => new T.Line(new T.BufferGeometry().setFromPoints(a), lineMat(col(c), o));
  function segs(arr, c, o) { const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(arr, 3)); const s = new T.LineSegments(g, lineMat(col(c), o)); s.frustumCulled = false; return s; }
  /* generic particle system: fn(i, t, out, k) fills out=[x,y,z] */
  function particles(ctx, n, color, size, fn, op = 1) {
    const a = new Float32Array(n * 3), P = pts(a, col(color), size * 2.3, op); ctx.add(P); const o = [0, 0, 0];
    return (t, k) => { for (let i = 0; i < n; i++) { fn(i, t, o, k); a[i * 3] = o[0]; a[i * 3 + 1] = o[1]; a[i * 3 + 2] = o[2]; } P.geometry.attributes.position.needsUpdate = true; P.material.opacity = op * sm(k * 2); };
  }
  const lab = (ctx, p, at, o) => { if (p.l) ctx.label(p.l, at || V(0, -2.1, 0.5), Object.assign({ color: hex(p.color || 'gold') }, o)); if (p.l2) ctx.label(p.l2, V(0, -2.5, 0.5), { cls: 'dim' }); };
  const group = (ctx, y = 0) => { const g = new T.Group(); g.position.y = y; ctx.add(g); return g; };

  /* sphere of light: Allah / noor / the name */
  M.sphere = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, .1);
    const S = pts(fib(2400, 1.2), c, .05, .95), S2 = pts(fib(600, 1.7), c, .03, .5); g.add(S, S2, glow(c, 5, null, .35));
    const rays = new Float32Array(36 * 6); const R = segs(rays, c, .5); g.add(R);
    if (p.text) { const tx = textSprite(p.text, { scale: p.ts || 2.2, px: 190, w: 640 }); tx.position.z = .8; g.add(tx); }
    lab(ctx, p, V(0, -1.9, 0.5));
    return (t, k) => { S.rotation.y = t * .25; S2.rotation.y = -t * .15; g.scale.setScalar(.3 + .7 * sm(k * 1.6));
      for (let i = 0; i < 36; i++) { const a = i / 36 * PI2 + t * .05, r0 = 1.5, r1 = 1.9 + .45 * Math.sin(t * 1.5 + i * 2.1) ** 2; rays.set([Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * r1, Math.sin(a) * r1, 0], i * 6); } R.geometry.attributes.position.needsUpdate = true; };
  };

  /* falling light: mercy, rain, gifts, stones */
  M.rain = (ctx, p) => {
    const n = p.n || 380, c = col(p.color || 'cyan'), sd = seeds(ctx, n * 3), slant = p.slant || 0, sp = p.speed || .28, sz = p.size || .11;
    const gy = -1.7, up = particles(ctx, n, c, sz, (i, t, o) => { const u = (t * sp * (.7 + sd[i] * .6) + sd[n + i]) % 1; o[0] = (sd[i] - .5) * 6 + slant * (u - .5) * 3; o[1] = 2.4 - u * (2.4 - gy); o[2] = (sd[2 * n + i] - .5) * 3; });
    const trail = particles(ctx, n, c, sz * .55, (i, t, o) => { const u = (t * sp * (.7 + sd[i] * .6) + sd[n + i]) % 1 - .035; o[0] = (sd[i] - .5) * 6 + slant * (u - .5) * 3; o[1] = 2.4 - u * (2.4 - gy); o[2] = (sd[2 * n + i] - .5) * 3; }, .5);
    const rings = []; for (let i = 0; i < 5; i++) { const r = loop(Array.from({ length: 60 }, (_, k) => V(Math.cos(k / 60 * PI2), 0, Math.sin(k / 60 * PI2))), c, .5); r.position.y = gy; ctx.add(r); rings.push(r); }
    if (p.target) { const o = orb(ctx, col(p.target), .22, V(0, gy + .35, 0)); p._o = o; }
    lab(ctx, p);
    return (t, k) => { up(t, k); trail(t, k); rings.forEach((r, i) => { const u = (t * .35 + i / 5) % 1; r.scale.set(.2 + u * 2.6, 1, (.2 + u * 2.6) * .55); r.material.opacity = .5 * (1 - u) * sm(k * 2); }); if (p._o) p._o.step(t, sm(k * 2)); };
  };

  /* a glowing path receding to the horizon (sirat / guidance) */
  M.path = (ctx, p) => {
    const lit = p.mode !== 'wind', c = col(p.color || 'gold'), y = -1.4, N = 70, g = group(ctx, 0);
    const cl = (z, w) => V((p.mode === 'wind' ? Math.sin(z * .7 + w) * 1.3 : 0) + w * (lit ? 0 : 0), y, z);
    const L1 = [], L2 = []; for (let i = 0; i <= N; i++) { const z = 3.2 - i * .22, w = lit ? .5 + (3.2 - z) * .06 : .35; const q = cl(z, 0); L1.push(V(q.x - w, y, z)); L2.push(V(q.x + w, y, z)); }
    g.add(line(L1, c, .9), line(L2, c, .9));
    const tick = new Float32Array(30 * 6), TK = segs(tick, c, .35); g.add(TK);
    const sides = [];
    if (lit && p.sides !== false) for (const s of [-1, 1]) { const A = []; for (let i = 0; i <= N; i++) { const z = 3.2 - i * .22; A.push(V(s * (1.8 + Math.sin(z * .9 + s) * .6 + (3.2 - z) * .1), y, z)); } const l = line(A, s < 0 ? 0xff5a4a : 0xb08bff, .28); g.add(l); sides.push(l); }
    const N2 = 40, tp = particles(ctx, N2, 0xffffff, .1, (i, t, o) => { const u = (t * .22 + i / N2) % 1, z = 3.2 - u * 15; const q = cl(z, 0); o[0] = q.x; o[1] = y + .05; o[2] = z; });
    lab(ctx, p, V(0, -2.2, 1.5));
    return (t, k) => { for (let i = 0; i < 30; i++) { const z = 3.2 - ((t * .5 + i * .5) % 15), q = cl(z, 0), w = (.5 + (3.2 - z) * .06) * 1.3; tick.set([q.x - w, y, z, q.x + w, y, z], i * 6); } TK.geometry.attributes.position.needsUpdate = true; tp(t, k); g.children.forEach(o => { if (o.material) o.material.opacity = (o === TK ? .35 : o.material.opacity) ; }); };
  };

  /* balance scales (justice / recompense) */
  M.scales = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, .3); g.add(line([V(0, -1.7, 0), V(0, 1.2, 0)], c, .8), glow(c, 1.1, V(0, 1.25, 0), .8));
    const beam = new T.Group(); beam.position.y = 1.2; g.add(beam); beam.add(line([V(-1.9, 0, 0), V(1.9, 0, 0)], c, .95));
    const pans = [-1, 1].map(s => { const pg = new T.Group(); pg.position.x = s * 1.9; beam.add(pg); [-.6, 0, .6].forEach(dx => pg.add(line([V(0, 0, 0), V(dx, -1.1, 0)], c, .55))); const pan = loop(Array.from({ length: 40 }, (_, k) => V(Math.cos(k / 40 * PI2) * .75, -1.1, Math.sin(k / 40 * PI2) * .3)), c, .9); pg.add(pan); const o = glow(s < 0 ? 0xffd27a : 0x7fd4ff, s < 0 ? .5 : .9, V(0, -.85, 0), 1); pg.add(o); return pg; });
    lab(ctx, p);
    const lean = p.lean == null ? 1 : p.lean;
    return (t, k) => { const a = (Math.sin(t * .8) * .06 + .22 * lean) * sm(k * 2) * (p.settle ? Math.exp(-t * .4) + .1 : 1); beam.rotation.z = a; pans.forEach(pg => pg.rotation.z = -a); };
  };

  /* sun crossing the sky: day */
  M.day = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, -.5), arc = []; for (let i = 0; i <= 60; i++) { const a = Math.PI * i / 60; arc.push(V(Math.cos(a) * 2.8, Math.sin(a) * 2.2, 0)); }
    g.add(line(arc, c, .35)); g.add(line([V(-3.2, 0, 0), V(3.2, 0, 0)], 0x6fa8ff, .6));
    const sun = glow(c, 1.3, null, 1), halo = glow(c, 3.4, null, .5); g.add(sun, halo);
    const rays = new Float32Array(24 * 6), R = segs(rays, c, .5); g.add(R); lab(ctx, p, V(0, -1.4, 0.5));
    const gr = particles(ctx, 160, 0x4a78c8, .05, (i, t, o) => { o[0] = ((i * 37) % 160 / 160 - .5) * 6.4; o[1] = -.05 - ((i * 13) % 7) * .12; o[2] = ((i * 7) % 5) * .3 - .6; }, .6);
    return (t, k) => { const u = (t * .12) % 1, a = Math.PI * (1 - u), x = Math.cos(a) * 2.8, y = Math.sin(a) * 2.2; sun.position.set(x, y, 0); halo.position.set(x, y, 0); for (let i = 0; i < 24; i++) { const an = i / 24 * PI2 + t * .2, r0 = .35, r1 = .6 + .25 * Math.sin(t * 2 + i); rays.set([x + Math.cos(an) * r0, y + Math.sin(an) * r0, 0, x + Math.cos(an) * r1, y + Math.sin(an) * r1, 0], i * 6); } R.geometry.attributes.position.needsUpdate = true; gr(t, k); };
  };

  /* globe of dominion with a crown */
  M.globe = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, -.2), gl = new T.Group(); g.add(gl);
    for (let i = -4; i <= 4; i++) { const y = i / 5 * 1.25, r = Math.sqrt(1.25 * 1.25 - y * y); gl.add(loop(Array.from({ length: 60 }, (_, k) => V(Math.cos(k / 60 * PI2) * r, y, Math.sin(k / 60 * PI2) * r)), 0x4fb3ff, .45)); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI, l = loop(Array.from({ length: 60 }, (_, k) => V(Math.cos(k / 60 * PI2) * 1.25 * Math.cos(a), Math.sin(k / 60 * PI2) * 1.25, Math.cos(k / 60 * PI2) * 0 + Math.cos(k / 60 * PI2) * 1.25 * Math.sin(a))), 0x4fb3ff, .35); gl.add(l); }
    g.add(glow(0x4fb3ff, 4, null, .25));
    const cr = new T.Group(); cr.position.y = 2; g.add(cr); const pp = []; for (let i = 0; i < 5; i++) { const a = i / 5 * PI2; pp.push(V(Math.cos(a) * .7, .7, Math.sin(a) * .7), V(Math.cos(a + PI2 / 10) * .45, 0, Math.sin(a + PI2 / 10) * .45)); } cr.add(loop(pp, c, 1)); cr.add(loop(Array.from({ length: 40 }, (_, k) => V(Math.cos(k / 40 * PI2) * .45, 0, Math.sin(k / 40 * PI2) * .45)), c, .9)); cr.add(glow(c, 2.2, V(0, .35, 0), .6));
    lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => { gl.rotation.y = t * .2; cr.position.y = 1.9 + Math.sin(t * 1.2) * .07 + (1 - sm(k * 2)) * 1.5; cr.rotation.y = -t * .3; };
  };

  /* streams that converge on a centre: worship, asking, the one worshipped */
  M.converge = (ctx, p) => {
    const n = p.n || 520, c = col(p.color || 'gold'), sd = seeds(ctx, n * 2), rev = !!p.rev;
    const up = particles(ctx, n, c, .06, (i, t, o) => { let u = (t * .2 + sd[i]) % 1; if (rev) u = 1 - u; const a = sd[n + i] * PI2 + u * 3.2, r = 3 * Math.pow(1 - u, 1.25) + .05; o[0] = Math.cos(a) * r; o[1] = (sd[i] - .5) * 1.5 * (1 - u) + Math.sin(a) * r * .5; o[2] = Math.sin(a) * r * .6; });
    const ctr = glow(c, 1.8, V(0, 0, 0), .95), ctr2 = glow(0xffffff, .6, V(0, 0, 0), 1); ctx.add(ctr, ctr2);
    if (p.text) { const tx = textSprite(p.text, { scale: p.ts || 1.5, px: 190, w: 640 }); tx.position.set(0, .0, .3); ctx.add(tx); }
    lab(ctx, p, V(0, -2.0, .5));
    return (t, k) => { up(t, k); const pu = 1 + .12 * Math.sin(t * 3); ctr.scale.setScalar(1.8 * pu * sm(k * 2)); };
  };

  /* beams from above: help arriving */
  M.descend = (ctx, p) => {
    const c = col(p.color || 'cyan'), n = 22, B = [], g = group(ctx, 0);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1) - .5) * 5, l = line([V(x, 2.4, -.5), V(x * .2, -1.1, 0)], c, .12); g.add(l); B.push(l); }
    const up = particles(ctx, 160, 0xffffff, .09, (i, t, o) => { const j = i % n, x = (j / (n - 1) - .5) * 5, u = (t * .3 + i * .137) % 1; o[0] = x + (x * .2 - x) * u; o[1] = 2.4 - 3.5 * u; o[2] = -.5 + .5 * u; });
    const o = orb(ctx, c, .3, V(0, -1.2, 0)); ctx.add(glow(c, 2.5, V(0, -1.2, 0), .5)); lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => { up(t, k); o.step(t, sm(k * 2)); B.forEach((l, i) => l.material.opacity = (.1 + .15 * Math.sin(t * 1.5 + i)) * sm(k * 2)); };
  };

  /* flames */
  M.flames = (ctx, p) => {
    const cols = p.colors || [0xff3a1a, 0xff8a1a, 0xffd23a], n = p.n || 380, sd = seeds(ctx, n * 3), W = p.wd || 1;
    const ups = cols.map((c, ci) => particles(ctx, n, c, .11 - ci * .02, (i, t, o) => { const u = (t * (.35 + sd[i] * .35) + sd[n + i]) % 1, a = sd[2 * n + i] * PI2, r = (1 - u) * (.95 + ci * -.18) * W * Math.sqrt(sd[i]); o[0] = Math.cos(a) * r + Math.sin(t * 2 + i) * .1 * u; o[1] = -1.6 + u * (2.9 - ci * .6); o[2] = Math.sin(a) * r * .6; }, .85));
    ctx.add(glow(0xff6a1a, 4.5, V(0, -.7, 0), .3)); lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => ups.forEach(f => f(t, k));
  };

  /* twisted rope */
  M.rope = (ctx, p) => {
    const c = col(p.color || 'orange'), g = group(ctx, 0), N = 90, ST = 3, S = [];
    for (let s = 0; s < ST; s++) { const l = new T.Line(new T.BufferGeometry().setFromPoints(Array.from({ length: N }, () => V(0, 0, 0))), lineMat(c, .9)); l.frustumCulled = false; g.add(l); S.push(l); }
    const f = particles(ctx, 60, 0xffe0b0, .05, (i, t, o) => { o[0] = Math.sin(i * 3.1 + t) * .6; o[1] = -2.2 + (i / 60) * 4.4; o[2] = Math.cos(i * 2.3) * .3; }, .5);
    lab(ctx, p, V(0, -2.4, .5));
    return (t, k) => { S.forEach((l, s) => { const a = l.geometry.attributes.position; for (let i = 0; i < N; i++) { const u = i / (N - 1), y = -2.2 + u * 4.4 * sm(k * 2 + 0.2), ang = u * 14 + s * PI2 / ST + t * .8; a.setXYZ(i, Math.cos(ang) * .38, y, Math.sin(ang) * .38); } a.needsUpdate = true; }); g.rotation.z = Math.sin(t * .4) * .05; f(t, k); };
  };

  /* elephant army (hologram point-cloud) */
  function elephantCloud(r) {
    const a = []; const E = (cx, cy, cz, rx, ry, rz, n) => { for (let i = 0; i < n; i++) { const u = r() * 2 - 1, th = r() * PI2, s = Math.sqrt(1 - u * u); a.push(cx + rx * s * Math.cos(th), cy + ry * u, cz + rz * s * Math.sin(th)); } };
    E(0, .1, 0, .95, .62, .5, 520); E(1.05, .42, 0, .4, .38, .36, 220); E(-.95, .25, 0, .12, .18, .1, 20);
    for (let i = 0; i < 26; i++) { const u = i / 25; E(1.35 + u * .15, .3 - u * .8 + Math.sin(u * 3) * .1, 0, .13 - u * .06, .13 - u * .06, .13 - u * .06, 6); }
    [[-.55, .3], [-.55, -.3], [.55, .3], [.55, -.3]].forEach(([x, z]) => E(x, -.75, z, .17, .5, .17, 70));
    E(.95, .38, .38, .03, .3, .3, 70); E(.95, .38, -.38, .03, .3, .3, 70);
    return new Float32Array(a);
  }
  M.elephants = (ctx, p) => {
    const base = elephantCloud(ctx.r), c = col(p.color || 'orange'), E = [];
    [[-1.8, -.8, -1.5, .75], [0.2, -.8, -.2, 1], [-.9, -.8, 1.1, .85]].forEach(([x, y, z, s], i) => { const P = pts(base.slice(), c, .085, .95); P.position.set(x, y, z); P.scale.setScalar(s * .9); ctx.add(P); E.push({ P, x, z, i }); });
    lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => E.forEach(({ P, x, z, i }) => { P.position.x = x + Math.sin(t * .3 + i) * .5 + (1 - sm(k * 1.6)) * -3; P.position.y = -.8 + Math.abs(Math.sin(t * 2 + i)) * .09; P.rotation.y = -.35; });
  };

  /* flock of birds */
  M.birds = (ctx, p) => {
    const n = p.n || 26, c = col(p.color || 'white'), arr = new Float32Array(n * 12), S = segs(arr, c, .95), sd = seeds(ctx, n * 3); ctx.add(S);
    return (t, k) => { for (let i = 0; i < n; i++) { const u = (t * .08 + sd[i] * .15 + i / n * .6) % 1, x = 3.6 - u * 7.2 + Math.sin(sd[i] * 9) * .3, y = 1.6 - u * 2.2 + Math.sin(sd[n + i] * 9 + u * 6) * .5, z = -1 + sd[2 * n + i] * 2.5, f = Math.sin(t * 8 + i) * .22, w = .25 + sd[i] * .08; arr.set([x - w, y + f, z, x, y, z, x, y, z, x + w, y + f, z, x, y, z, x - w * .8, y - f * .9, z, x, y, z, x + w * .8, y - f * .9, z].slice(0, 12), i * 12); } S.geometry.attributes.position.needsUpdate = true; S.material.opacity = sm(k * 2); lab._b = 0; };
  };

  /* beaten flock + stones */
  M.stones = (ctx, p) => {
    const b = M.birds(ctx, { n: 14, color: 'white' }), r = M.rain(ctx, { n: 80, color: 'orange', slant: -1.2, size: .16, speed: .35, l: p.l });
    return (t, k) => { b(t, k); r(t, k); };
  };

  /* chewed straw: scattered strands */
  M.straw = (ctx, p) => {
    const n = p.n || 180, c = col(p.color || 'gold'), sd = seeds(ctx, n * 4), arr = new Float32Array(n * 6), S = segs(arr, c, .8); ctx.add(S);
    lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => { const e = sm(k * 1.2); for (let i = 0; i < n; i++) { const a = sd[i] * PI2, r = 2.8 * Math.sqrt(sd[n + i]) * (.3 + .7 * e), x = Math.cos(a) * r, z = Math.sin(a) * r * .6, y = -1.5 + Math.sin(t * .5 + sd[i] * 9) * .04, ang = sd[2 * n + i] * PI2 + Math.sin(t * .3 + i) * .2, l = .18; arr.set([x - Math.cos(ang) * l, y, z - Math.sin(ang) * l, x + Math.cos(ang) * l, y, z + Math.sin(ang) * l], i * 6); } S.geometry.attributes.position.needsUpdate = true; S.material.opacity = .8 * sm(k * 2); };
  };

  /* flowing river of abundance */
  M.river = (ctx, p) => {
    const c = col(p.color || 'cyan'), N = 9, M2 = 90, R = [], g = group(ctx, -1.5);
    for (let r = 0; r < N; r++) { const l = new T.Line(new T.BufferGeometry().setFromPoints(Array.from({ length: M2 }, () => V(0, 0, 0))), lineMat(c, .35 + (r % 3) * .15)); l.frustumCulled = false; g.add(l); R.push(l); }
    const stars = particles(ctx, 120, 0xffe8a0, .07, (i, t, o) => { const u = (t * .12 + i * .0831) % 1; o[0] = Math.sin(i * 12.9) * 3; o[1] = -1.4 + u * 3.6; o[2] = Math.cos(i * 7.3) * 1.2; }, .8);
    lab(ctx, p, V(0, -2.3, .5));
    return (t, k) => { R.forEach((l, r) => { const a = l.geometry.attributes.position, z = -1.5 + r * .45; for (let i = 0; i < M2; i++) { const u = i / (M2 - 1), x = -3.4 + u * 6.8; a.setXYZ(i, x, Math.sin(x * 1.3 + t * 1.1 + r) * .14 + Math.sin(x * 3 - t) * .05, z + Math.sin(x * .8 + t * .6 + r) * .2); } a.needsUpdate = true; }); stars(t, k); };
  };

  /* dawn: light cracks the dark */
  M.dawn = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, -.8), n = 34, rays = [];
    for (let i = 0; i < n; i++) { const a = Math.PI * (.06 + .88 * i / (n - 1)), l = line([V(0, 0, 0), V(Math.cos(a) * 4.5, Math.sin(a) * 4.5, 0)], i % 2 ? 0xffd27a : 0xff9a5a, .25); g.add(l); rays.push(l); }
    g.add(line([V(-4, 0, 0), V(4, 0, 0)], 0xffd27a, .8)); const sun = glow(c, 3, null, .9); g.add(sun, glow(0xffffff, .9, null, 1));
    const dark = particles(ctx, 220, 0x5a4a9a, .12, (i, t, o, k) => { const u = clamp(t * .15 - (i % 11) * .01); o[0] = Math.sin(i * 5.7) * 3.6; o[1] = -.9 + Math.abs(Math.sin(i * 3.3)) * 3 + u * 3.2; o[2] = Math.cos(i * 2.1) * 1.4; }, .5);
    lab(ctx, p, V(0, -1.6, .5));
    return (t, k) => { rays.forEach((l, i) => l.material.opacity = (.12 + .35 * Math.pow(Math.sin(t * 1.2 + i * .7) * .5 + .5, 2)) * sm(k * 2)); sun.scale.setScalar(3 * (1 + .06 * Math.sin(t * 2))); dark(t, k); };
  };

  /* night spreading */
  M.night = (ctx, p) => {
    const c = col(p.color || 'violet'), sd = seeds(ctx, 400);
    const f = particles(ctx, 400, c, .35, (i, t, o) => { const u = clamp(t * .12 + sd[i] * .2), a = sd[200 + (i % 200)] * PI2, r = 4 * (1 - u * .9) * Math.sqrt(sd[i]); o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .55; o[2] = sd[(i + 7) % 400] * 1.5 - .8; }, .4);
    const m = glow(0xcfe0ff, .5, V(0, 0, 0), .9); ctx.add(m); lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => { f(t, k); m.scale.setScalar(.8 * Math.max(.15, 1 - t * .06)); };
  };

  /* whisper: wisps seep into the chest (or withdraw) */
  M.whisper = (ctx, p) => {
    const c = col(p.color || 'violet'), sd = seeds(ctx, 240), rev = !!p.rev, heart = glow(0xff4f7a, 1.6, V(0, 0, 0), .8); ctx.add(heart, pts(fib(500, .55), 0xff7a9a, .05, .9));
    const f = particles(ctx, 90, c, .09, (i, t, o) => { let u = (t * .25 + sd[i]) % 1; if (rev) u = 1 - u; const a = sd[90 + i] * PI2, r = 3.2 * (1 - u) + .55; o[0] = Math.cos(a + u * 2) * r; o[1] = Math.sin(a * 1.7 + u * 3) * r * .5; o[2] = Math.sin(a + u * 2) * r * .4; });
    lab(ctx, p, V(0, -1.9, .5));
    return (t, k) => { f(t, k); heart.scale.setScalar(1.6 * (1 + .15 * Math.pow(Math.sin(t * 3), 2))); };
  };

  /* oneness family */
  M.oneness = (ctx, p) => {
    const c = col(p.color || 'white'), mode = p.mode || 'one', g = group(ctx, 0);
    const core = pts(fib(1800, mode === 'samad' ? .8 : 1.1), c, .05, .95); g.add(core, glow(c, 3.6, null, .5), glow(0xffffff, .9, null, 1));
    let ex = null, dep = [];
    if (mode === 'samad') for (let i = 0; i < 16; i++) { const s = glow(0x7fd4ff, .22, null, .9); g.add(s); const ln = new T.Line(new T.BufferGeometry().setFromPoints([V(0, 0, 0), V(1, 0, 0)]), lineMat(0x7fd4ff, .25)); ln.frustumCulled = false; g.add(ln); dep.push({ s, ln, a: i / 16 * PI2, r: 1.7 + (i % 3) * .55 }); }
    if (mode === 'begets') ex = glow(0xffe0a0, .5, null, .9), g.add(ex);
    if (mode === 'blocked') { ex = glow(0xffe0a0, .4, V(-3, 0, 0), .9); g.add(ex); g.add(line([V(-1.9, -1, 0), V(-1.9, 1, 0)], 0xff5a4a, .9)); }
    if (mode === 'equal') for (let i = 0; i < 5; i++) { const s = glow(0x9fb8e0, .35 + i * .12, V(-3 + i * .0, 1.8 - i * .8, 0), .6); g.add(s); s.position.x = -2.6 + i * .15; }
    lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => { core.rotation.y = t * .3; g.scale.setScalar(.3 + .7 * sm(k * 1.6));
      dep.forEach((d, i) => { const a = d.a + t * .35, x = Math.cos(a) * d.r, y = Math.sin(a) * d.r * .7; d.s.position.set(x, y, 0); const pp = d.ln.geometry.attributes.position; pp.setXYZ(1, x, y, 0); pp.needsUpdate = true; });
      if (mode === 'begets' && ex) { const u = (t * .3) % 1; ex.position.set(1.1 + u * 1.2, 0, 0); ex.material.opacity = .9 * (1 - u); ex.scale.setScalar(.5 * (1 - u * .6)); }
      if (mode === 'blocked' && ex) { const u = (t * .3) % 1; ex.position.x = -3 + Math.min(u * 1.5, .75) * 1.0 + (u > .6 ? -(u - .6) * 1.2 : 0); }
    };
  };

  /* coins of wealth */
  M.coins = (ctx, p) => {
    const c = col(p.color || 'gold'), n = 26, C = [], sd = seeds(ctx, n * 3);
    for (let i = 0; i < n; i++) { const l = loop(Array.from({ length: 22 }, (_, k) => V(Math.cos(k / 22 * PI2) * .22, Math.sin(k / 22 * PI2) * .22, 0)), c, .95); ctx.add(l); C.push(l); }
    ctx.add(glow(c, 4, V(0, -1.2, 0), .2)); lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => C.forEach((l, i) => { const u = (t * (.14 + sd[i] * .08) + sd[n + i]) % 1; l.position.set((sd[i] - .5) * 4.6, 2.2 - u * 4, (sd[2 * n + i] - .5) * 2); l.rotation.set(t * (1 + sd[i]) + i, t * 1.4, 0); l.material.opacity = (p.vanish ? 1 - u : 1) * .95 * sm(k * 2); });
  };

  /* shattering: perish / ruin / wrath */
  M.shatter = (ctx, p) => {
    const c = col(p.color || 'red'), n = 70, sd = seeds(ctx, n * 4), base = []; const ico = fib(n, 1.2);
    const arr = new Float32Array(n * 6), S = segs(arr, c, .95); ctx.add(S); ctx.add(glow(c, 3.6, V(0, 0, 0), .25)); lab(ctx, p, V(0, -2.1, .5));
    return (t, k) => { const u = clamp(((t * .35) % 1.4) / 1.1), e = u * u; for (let i = 0; i < n; i++) { const x = ico[i * 3], y = ico[i * 3 + 1], z = ico[i * 3 + 2], l = .22 * (1 - u * .6), d = 1 + e * (1.4 + sd[i] * 1.2), ax = sd[n + i] * PI2; arr.set([x * d - Math.cos(ax) * l, y * d - Math.sin(ax) * l - e * 1.1, z * d, x * d + Math.cos(ax) * l, y * d + Math.sin(ax) * l - e * 1.1, z * d], i * 6); } S.geometry.attributes.position.needsUpdate = true; S.material.opacity = .95 * (1 - u * .8) * sm(k * 2); S.rotation.y = t * .2; };
  };

  /* caravan over dunes */
  M.caravan = (ctx, p) => {
    const c = col(p.color || 'gold'), tr = terrain(ctx, { amp: .22, color: p.color || 'gold', peaks: [{ x: -1.5, h: .45, s: 1.2 }, { x: 1.8, h: .35, s: 1 }], y: -1.2 });
    const cam = particles(ctx, 21, 0xffe6a8, .14, (i, t, o) => { const g = Math.floor(i / 3), u = (t * .06 + g * .11) % 1; o[0] = 3.4 - u * 6.8 + (i % 3) * .08; o[1] = -.95 + Math.abs(Math.sin(t * 3 + i)) * .05 + (i % 3 === 0 ? .12 : 0); o[2] = -.3; });
    let sky;
    if (p.season === 'winter') sky = particles(ctx, 120, 0xbfe4ff, .08, (i, t, o) => { o[0] = Math.sin(i * 12.9) * 3.4 + Math.sin(t + i) * .1; o[1] = 2.4 - ((t * .18 + i * .0837) % 1) * 3.6; o[2] = Math.cos(i * 7.1) * 1.4; }, .8);
    else { const s = glow(0xff9a3a, 3.2, V(2, 1.6, -1), .9); ctx.add(s, glow(0xffffff, .8, V(2, 1.6, -1), 1)); sky = (t, k) => { s.scale.setScalar(3.2 * (1 + .05 * Math.sin(t * 2))); }; }
    lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => { tr.step(t, sm(k * 2)); cam(t, k); sky(t, k); };
  };

  /* the House: a cube with a gold band, circled by particles */
  M.house = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, -.1), box = new T.Mesh(new T.BoxGeometry(1.5, 1.7, 1.5), new T.MeshBasicMaterial({ color: 0x14141c })); g.add(box);
    const e = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.5, 1.7, 1.5)), lineMat(c, .95)); g.add(e);
    const band = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.52, .16, 1.52)), lineMat(c, 1)); band.position.y = .45; g.add(band, glow(c, 4.5, null, .25));
    const ring = particles(ctx, 260, c, .07, (i, t, o) => { const a = i / 260 * PI2 + t * .45, r = 2.3 + Math.sin(i * 7) * .15; o[0] = Math.cos(a) * r; o[1] = -.1 + Math.sin(i * 3.7) * .25; o[2] = Math.sin(a) * r * .55; });
    lab(ctx, p, V(0, -1.9, .8));
    return (t, k) => { g.rotation.y = .4 + Math.sin(t * .2) * .2; ring(t, k); box.scale.setScalar(.2 + .8 * sm(k * 2)); e.scale.copy(box.scale); };
  };

  /* dome of safety */
  M.dome = (ctx, p) => {
    const c = col(p.color || 'cyan'), g = group(ctx, -.9), R = 1.9;
    for (let i = 1; i <= 5; i++) { const a = i / 6 * Math.PI / 2, r = Math.cos(a) * R, y = Math.sin(a) * R; g.add(loop(Array.from({ length: 60 }, (_, k) => V(Math.cos(k / 60 * PI2) * r, y, Math.sin(k / 60 * PI2) * r)), c, .45)); }
    for (let i = 0; i < 10; i++) { const a = i / 10 * PI2; g.add(line(Array.from({ length: 24 }, (_, k) => { const b = k / 23 * Math.PI / 2; return V(Math.cos(a) * Math.cos(b) * R, Math.sin(b) * R, Math.sin(a) * Math.cos(b) * R); }), c, .35)); }
    const o = orb(ctx, 0xfff0c0, .2, V(0, -.7, 0)); const sd = seeds(ctx, 90);
    const th = particles(ctx, 40, 0xff5a4a, .1, (i, t, o2) => { const u = (t * .4 + sd[i]) % 1, a = sd[45 + i] * PI2, el = .15 + sd[i] * .9, r0 = 4.2, r = u < .5 ? r0 - (r0 - R) * (u * 2) : R + (u - .5) * 2 * 2.3; o2[0] = Math.cos(a) * Math.cos(el) * r; o2[1] = -.9 + Math.sin(el) * r; o2[2] = Math.sin(a) * Math.cos(el) * r; }, .9);
    lab(ctx, p, V(0, -2.2, .8));
    return (t, k) => { o.step(t, sm(k * 2)); th(t, k); g.rotation.y = t * .1; };
  };

  /* feeding: grains fill a bowl (or an empty bowl for hunger) */
  M.feed = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, -.9), hungry = !!p.hungry;
    for (let i = 0; i <= 5; i++) { const a = i / 5 * Math.PI / 2, r = Math.cos(a) * 1.5, y = -Math.sin(a) * 1.1 + 1.1; g.add(loop(Array.from({ length: 50 }, (_, k) => V(Math.cos(k / 50 * PI2) * r, y - 1.1, Math.sin(k / 50 * PI2) * r)), c, .55)); }
    const f = hungry ? () => { } : particles(ctx, 150, c, .08, (i, t, o) => { const u = (t * .22 + i * .0713) % 1, a = i * 2.4, r = 1.0 * Math.sqrt((i % 17) / 17); o[0] = Math.cos(a) * r * u * .8; o[1] = 2.4 - u * (2.4 + 1.8 - .3 * Math.min(1, (t * .1) % 1)); o[2] = Math.sin(a) * r * u * .8; });
    const dim = hungry ? glow(0xff5a4a, 1.2, V(0, -.9, 0), .35) : glow(c, 3, V(0, -.7, 0), .4); ctx.add(dim); lab(ctx, p, V(0, -2.5, .8));
    return (t, k) => { f(t, k); if (hungry) dim.material.opacity = .15 + .2 * Math.abs(Math.sin(t * 1.5)); };
  };

  /* push away (the orphan is repulsed) / neglect */
  M.push = (ctx, p) => {
    const big = orb(ctx, 0xff8a5a, .38, V(-2, 0, 0)), small = orb(ctx, 0x9fd8ff, .18, V(1, 0, 0), 14); lab(ctx, p, V(0, -1.9, .5));
    return (t, k) => { const u = (t * .3) % 1, e = sm(u * 1.6); big.g.position.x = -2.2 + e * 1.6; small.g.position.x = 1 + e * 1.8 * (u > .35 ? 1 : 0) + Math.min(1, e) * .6; small.g.position.y = Math.sin(u * PI2 * 2) * .05 - e * .3; small.g.scale.setScalar(Math.max(.2, 1 - Math.max(0, u - .6))); big.step(t, sm(k * 2)); small.step(t, sm(k * 2)); };
  };

  /* neglect / hollow: a light that flickers and fades */
  M.fade = (ctx, p) => {
    const c = col(p.color || 'gold'), o = orb(ctx, c, .4, V(0, 0, 0)), sd = seeds(ctx, 3); lab(ctx, p, V(0, -2, .5));
    return (t, k) => { o.step(t, sm(k * 2)); const f = .35 + .65 * Math.abs(Math.sin(t * 2.2) * Math.sin(t * .7)); o.g.children.forEach(ch => { if (ch.material) ch.material.opacity = Math.min(1, ch.material.opacity) ; }); o.g.scale.setScalar(.5 + f * .6); o.g.position.x = Math.sin(t * .5) * .6; o.g.position.y = Math.cos(t * .4) * .4; };
  };

  /* show-off: light turned outward at watching eyes */
  M.show = (ctx, p) => {
    const o = orb(ctx, 0xffc65a, .3, V(-1.6, 0, 0)), eyes = []; for (let i = 0; i < 5; i++) { const e = loop(Array.from({ length: 24 }, (_, k) => { const a = k / 24 * PI2; return V(Math.cos(a) * .32, Math.sin(a) * .16, 0); }), 0xffffff, .8); e.position.set(1.4 + (i % 2) * .5, 1.4 - i * .7, 0); ctx.add(e); ctx.add(glow(0xaad4ff, .22, e.position, .9)); eyes.push(e); }
    const f = particles(ctx, 100, 0xffd27a, .07, (i, t, oo) => { const u = (t * .3 + i * .1) % 1, j = i % 5, tx = 1.4 + (j % 2) * .5, ty = 1.4 - j * .7; oo[0] = -1.6 + (tx + 1.6) * u; oo[1] = ty * u; oo[2] = 0; }, .8); lab(ctx, p, V(0, -2, .5));
    return (t, k) => { o.step(t, sm(k * 2)); f(t, k); eyes.forEach((e, i) => e.scale.y = Math.max(.1, Math.abs(Math.cos(t * .8 + i)))); };
  };

  /* the seeing eye */
  M.eye = (ctx, p) => {
    const c = col(p.color || 'cyan'), g = group(ctx, 0), shape = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * 2 - 1; shape.push(V(u * 2.3, Math.sqrt(1 - u * u) * .95, 0)); }
    const low = shape.map(v => V(v.x, -v.y, 0)); g.add(line(shape, c, .95), line(low, c, .95));
    for (let i = 1; i <= 4; i++) g.add(loop(Array.from({ length: 50 }, (_, k) => V(Math.cos(k / 50 * PI2) * i * .17, Math.sin(k / 50 * PI2) * i * .17, 0)), c, .8 - i * .12)); g.add(glow(0xffffff, .5, null, 1), glow(c, 2.2, null, .5));
    const rays = new Float32Array(30 * 6), R = segs(rays, c, .35); g.add(R); lab(ctx, p, V(0, -1.7, .5));
    return (t, k) => { const b = 1 - Math.pow(Math.max(0, Math.sin(t * 1.1) * 8 - 7), 2); g.scale.set(sm(k * 2), sm(k * 2) * Math.max(.08, b), 1); for (let i = 0; i < 30; i++) { const a = i / 30 * PI2, r0 = 1.1, r1 = 1.4 + .6 * Math.pow(Math.sin(t * 2 + i), 2); rays.set([Math.cos(a) * r0 * 2, Math.sin(a) * r0, 0, Math.cos(a) * r1 * 2, Math.sin(a) * r1, 0], i * 6); } R.geometry.attributes.position.needsUpdate = true; };
  };

  /* negation: a ring crossed out */
  M.negate = (ctx, p) => {
    const c = col(p.color || 'red'), g = group(ctx, 0); g.add(loop(Array.from({ length: 80 }, (_, k) => V(Math.cos(k / 80 * PI2) * 1.3, Math.sin(k / 80 * PI2) * 1.3, 0)), c, .9), glow(c, 3.4, null, .25));
    const s = line([V(-.95, .95, 0), V(.95, -.95, 0)], c, 1), s2 = glow(0xffffff, .5, null, 1); g.add(s, s2); const o = orb(ctx, 0xffe0a0, .22, V(0, 0, 0)); lab(ctx, p, V(0, -2, .5));
    return (t, k) => { o.step(t, sm(k * 2)); const u = (t * .5) % 1.4; s2.position.set(-.95 + Math.min(1, u) * 1.9, .95 - Math.min(1, u) * 1.9, 0); s2.material.opacity = u < 1 ? 1 : 0; s.material.opacity = sm(u * 4) ; g.rotation.z = Math.sin(t) * .03; };
  };

  /* ripples: speech, glorification */
  M.ripple = (ctx, p) => {
    const c = col(p.color || 'gold'), R = [], up = !!p.up;
    for (let i = 0; i < 6; i++) { const r = loop(Array.from({ length: 70 }, (_, k) => V(Math.cos(k / 70 * PI2), Math.sin(k / 70 * PI2), 0)), c, .6); ctx.add(r); R.push(r); }
    if (p.text) { const tx = textSprite(p.text, { scale: p.ts || 1.7, px: 190, w: 640 }); ctx.add(tx); } else ctx.add(glow(c, 1.2, V(0, 0, 0), .9));
    lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => R.forEach((r, i) => { const u = (t * .3 + i / 6) % 1; r.scale.set(.3 + u * 3.2, (.3 + u * 3.2) * (up ? .35 : 1), 1); if (up) { r.rotation.x = -1.1; r.position.y = -1 + u * 2.6; } r.material.opacity = .7 * (1 - u) * sm(k * 2); });
  };

  /* gate opens to light (victory, coming) */
  M.gate = (ctx, p) => {
    const c = col(p.color || 'gold'), g = group(ctx, 0), pan = []; const light = glow(c, 5, V(0, 0, -.5), .7); g.add(light);
    const rays = []; for (let i = 0; i < 14; i++) { const a = (i / 13 - .5) * 1.1, l = line([V(0, 0, -.5), V(Math.sin(a) * 4, Math.cos(a) * 4 - 2, 3)], c, .2); g.add(l); rays.push(l); }
    [-1, 1].forEach(s => { const gp = new T.Group(); g.add(gp); const box = [V(0, -1.8, 0), V(0, 1.8, 0), V(s * 1.2, 1.8, 0), V(s * 1.2, -1.8, 0), V(0, -1.8, 0)]; gp.add(line(box, 0xcfd8ee, .9)); for (let i = 1; i < 6; i++) gp.add(line([V(s * 1.2 * i / 6, -1.8, 0), V(s * 1.2 * i / 6, 1.8, 0)], 0xcfd8ee, .25)); gp.userData.s = s; pan.push(gp); });
    lab(ctx, p, V(0, -2.4, .5));
    return (t, k) => { const o = sm(t * .35); pan.forEach(gp => gp.position.x = gp.userData.s * (.02 + o * 1.7)); light.scale.setScalar(2 + o * 4); rays.forEach((l, i) => l.material.opacity = (.05 + .3 * o) * (.6 + .4 * Math.sin(t * 2 + i))); };
  };

  /* spiral: returning (repentance) or wandering (lost) */
  M.spiral = (ctx, p) => {
    const c = col(p.color || 'gold'), n = 300, sd = seeds(ctx, n * 3), lost = p.mode === 'lost';
    const f = particles(ctx, n, c, .06, (i, t, o) => { if (lost) { const a = sd[i] * 9 + Math.sin(t * .6 + i) * 1.4, r = 1 + sd[n + i] * 2 + Math.sin(t * .4 + i * 3) * .4; o[0] = Math.cos(a + t * .1 * (sd[i] - .5)) * r * 1.2; o[1] = Math.sin(a * 1.3 + t * .2) * r * .7; o[2] = Math.sin(a) * .8; return; } const u = (t * .16 + sd[i]) % 1, a = sd[n + i] * PI2 + u * 6, r = 3.2 * Math.pow(1 - u, 1.3) + .1; o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * .55; o[2] = (sd[2 * n + i] - .5) * .6; });
    if (!lost) ctx.add(glow(c, 2, V(0, 0, 0), .9), glow(0xffffff, .6, V(0, 0, 0), 1)); lab(ctx, p, V(0, -2.2, .5));
    return (t, k) => f(t, k);
  };

  /* crowd of people (as small lights) */
  M.crowd = (ctx, p) => {
    const c = col(p.color || 'cyan'), n = p.n || 170, sd = seeds(ctx, n * 3), stream = !!p.stream;
    const f = particles(ctx, n, c, .13, (i, t, o) => { const a = sd[i] * PI2, r = 2.8 * Math.sqrt(sd[n + i]); let x = Math.cos(a) * r, z = Math.sin(a) * r * .5; if (stream) { const u = clamp((t * .15 - sd[i] * .6) * 1.6); x *= 1 - u; z *= 1 - u; o[1] = -1.2 + u * 1.5 * u; } else o[1] = -1.2 + Math.abs(Math.sin(t * 1.4 + i)) * .06; o[0] = x; o[2] = z; });
    if (stream) ctx.add(glow(0xffd27a, 3, V(0, .3, 0), .5)); lab(ctx, p, V(0, -2.1, 1));
    return (t, k) => f(t, k);
  };

  /* preposition / relation between two things */
  M.prep = (ctx, p) => {
    const kind = p.kind || 'to', cA = col(p.a || 'gold'), cB = col(p.b || 'cyan'), A = V(-1.9, 0, 0), B = V(1.9, 0, 0);
    const a = orb(ctx, cA, .28, A), b = orb(ctx, cB, kind === 'in' ? .22 : .28, kind === 'in' ? V(-1.9, 0, 0) : B);
    let ringB = null; if (kind === 'in') { ringB = loop(Array.from({ length: 70 }, (_, k) => V(Math.cos(k / 70 * PI2) * 1.2 + 1.2, Math.sin(k / 70 * PI2) * 1.2, 0)), cB, .9); ctx.add(ringB); ctx.add(glow(cB, 3, V(1.2, 0, 0), .2)); }
    const path = []; for (let i = 0; i <= 30; i++) { const u = i / 30; path.push(V(A.x + (B.x - A.x) * u, Math.sin(u * Math.PI) * (kind === 'on' ? 1.1 : .5), 0)); }
    if (kind !== 'in') ctx.add(line(path, 0xcfd8ee, .5));
    const tp = particles(ctx, 18, 0xffe2a8, .09, (i, t, o) => { const u = (((t * .3 + i / 18) % 1) + 1) % 1; if (kind === 'in') { o[0] = -1.9 + 3.1 * u; o[1] = Math.sin(u * 3) * .2; o[2] = 0; } else { const q = path[Math.min(30, Math.floor(u * 30))]; o[0] = q.x; o[1] = q.y; o[2] = 0; } });
    if (kind === 'from') ctx.add(loop(Array.from({ length: 60 }, (_, k) => V(Math.cos(k / 60 * PI2) * .8 - 1.9, Math.sin(k / 60 * PI2) * .8, 0)), cA, .6));
    lab(ctx, p, V(0, -1.9, .5));
    return (t, k) => { a.step(t, sm(k * 2)); b.step(t + 1, sm(k * 2)); tp(t, k); if (kind === 'in') b.g.position.x = -.6 + Math.min(1, t * .35) * 1.8 * 0 + 1.2 + Math.sin(t) * .3 - 0; };
  };

  /* pronoun: a group of lights, one pointed at */
  M.pron = (ctx, p) => {
    const n = p.n || 1, c = col(p.color || 'gold'), os = []; for (let i = 0; i < n; i++) { const a = i / n * PI2, r = n > 1 ? 1.2 : 0; os.push(orb(ctx, i === 0 ? c : col('cyan'), n > 1 ? .2 : .42, V(Math.cos(a) * r, Math.sin(a) * r * .7, 0))); }
    const ptr = p.point ? line([V(-3, -1.5, 0), V(-1.3, -.3, 0)], 0xcfd8ee, .8) : null; if (ptr) { ctx.add(ptr); const cone = new T.Mesh(new T.ConeGeometry(.1, .3, 12), new T.MeshBasicMaterial({ color: 0xcfd8ee })); cone.position.set(-1.25, -.25, 0); cone.rotation.z = -2.1; ctx.add(cone); }
    lab(ctx, p, V(0, -2, .5));
    return (t, k) => os.forEach((o, i) => o.step(t + i, sm(k * 2)));
  };

  /* simple "named light" (e.g. disbelievers, people): sphere of points with a ring */
  M.beads = (ctx, p) => { return M.crowd(ctx, Object.assign({ n: 90 }, p)); };

  /* envy: a green light draining a golden one */
  M.envy = (ctx, p) => {
    const a = orb(ctx, 0x57e08a, .3, V(-1.9, 0, 0)), b = orb(ctx, 0xffc65a, .34, V(1.9, 0, 0));
    const f = particles(ctx, 60, 0x57e08a, .08, (i, t, o) => { const u = (t * .3 + i / 60) % 1; o[0] = 1.9 - 3.8 * u; o[1] = Math.sin(u * PI2 + i) * .25; o[2] = 0; }, .9); lab(ctx, p, V(0, -1.9, .5));
    return (t, k) => { a.step(t, sm(k * 2)); b.step(t, sm(k * 2)); f(t, k); b.g.scale.setScalar(Math.max(.35, 1 - ((t * .2) % 1) * .6)); a.g.scale.setScalar(1 + ((t * .2) % 1) * .4); };
  };
})();

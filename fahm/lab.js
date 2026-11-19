/* Fahm Lab — 3D per-word concept scenes (three.js). Each word gets its own generative 3D scene. */
(function () {
  'use strict';
  const T = window.THREE;
  const Lab = { ok: false, lang: 'ru', V: {} };
  const LI = { ur: 0, ru: 1, en: 2 };
  Lab.tr = (k) => { if (Array.isArray(k)) return k[LI[Lab.lang]]; const v = Lab.V[k]; return v ? (v[Lab.lang] || v.en || k) : k; };
  window.FahmLab = Lab;
  if (!T) return;

  let host, cv, R, scene, cam, grp, lblBox, fade, upd = null, labels = [], t0 = 0, last = 0, raf = 0, running = false;
  let yaw = 0, pitch = 0, dyaw = 0, dpitch = 0, dragging = false, px = 0, py = 0, autoK = 1;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ---------- textures ---------- */
  let glowT = null;
  function glowTex() {
    if (glowT) return glowT;
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.18, 'rgba(255,255,255,.7)'); g.addColorStop(.45, 'rgba(255,255,255,.16)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); glowT = new T.CanvasTexture(c); return glowT;
  }
  function glow(color, size, pos, op = 1) {
    const m = new T.SpriteMaterial({ map: glowTex(), color, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: op });
    const s = new T.Sprite(m); s.scale.set(size, size, 1); if (pos) s.position.copy(pos); return s;
  }
  function textSprite(str, o = {}) {
    const c = document.createElement('canvas'); const W = o.w || 512, H = o.h || 256; c.width = W; c.height = H; const x = c.getContext('2d');
    x.font = `${o.px || 170}px ${o.font || 'AmiriQ'}, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = o.dir || 'rtl';
    x.shadowColor = o.glow || 'rgba(255,220,140,.9)'; x.shadowBlur = o.blur == null ? 26 : o.blur; x.fillStyle = o.color || '#fff';
    x.fillText(str, W / 2, H / 2 + (o.dy || 0)); x.fillText(str, W / 2, H / 2 + (o.dy || 0));
    const tx = new T.CanvasTexture(c); tx.anisotropy = 4;
    const m = new T.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: o.op == null ? 1 : o.op });
    const s = new T.Sprite(m); const sc = o.scale || 2; s.scale.set(sc, sc * H / W, 1); return s;
  }
  function pts(arr, color, size, op = 1) {
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(arr, 3));
    const m = new T.PointsMaterial({ color, size, map: glowTex(), transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: op, sizeAttenuation: true });
    const P = new T.Points(g, m); P.frustumCulled = false; return P;
  }
  function lineMat(color, op = 1) { return new T.LineBasicMaterial({ color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false }); }
  function loop(pts3, color, op) { const g = new T.BufferGeometry().setFromPoints(pts3); return new T.LineLoop(g, lineMat(color, op)); }
  function fib(n, r) { const a = new Float32Array(n * 3), ga = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + .5) / n, rr = Math.sqrt(1 - y * y), t = ga * i; a[i * 3] = Math.cos(t) * rr * r; a[i * 3 + 1] = y * r; a[i * 3 + 2] = Math.sin(t) * rr * r; } return a; }

  /* ---------- context handed to every motif ---------- */
  function mk() {
    const ctx = {
      T, V, clamp, sm, glow, textSprite, pts, lineMat, loop, fib,
      add: (o) => { grp.add(o); return o; },
      label: (text, at, o = {}) => { const e = document.createElement('div'); e.className = 'lb ' + (o.cls || ''); e.textContent = Lab.tr(text); if (o.color) e.style.color = o.color; lblBox.appendChild(e); const L = { e, at, dx: o.dx || 0, dy: o.dy || 0, t: o.t || 0, v: V(0, 0, 0) }; labels.push(L); return L; },
      r: rng(hashStr(Lab.key || 'x')),
      c: (hex) => new T.Color(hex),
    };
    return ctx;
  }

  /* ---------- motifs ---------- */
  const M = {};
  const palette = { pink: 0xff4f9d, blue: 0x36a8ff, gold: 0xffc65a, cyan: 0x35d0e6, teal: 0x2fe0c4, white: 0xe8f1ff, red: 0xff5a4a, green: 0x57e08a, violet: 0xa57bff, orange: 0xff944d };
  const col = (c) => (typeof c === 'string' ? (palette[c] != null ? palette[c] : new T.Color(c).getHex()) : c);
  Lab.palette = palette; Lab.motifs = M; Lab.util = { col, rng, hashStr };

  /* wavy terrain made of glowing lines; orbs hover above it */
  function terrain(ctx, opt) {
    const NZ = opt.nz || 30, NX = opt.nx || 110, W = opt.w || 8, D = opt.d || 4.4, base = col(opt.color || 'cyan');
    const nSeg = (NX - 1) * NZ, pos = new Float32Array(nSeg * 6), colr = new Float32Array(nSeg * 6);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(colr, 3));
    const m = new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: .95 });
    const mesh = new T.LineSegments(g, m); mesh.frustumCulled = false; mesh.position.y = opt.y == null ? -1.55 : opt.y; ctx.add(mesh);
    const bc = new T.Color(base), peaks = opt.peaks || [];
    const hf = (x, z, t) => { let h = opt.amp * (.55 * Math.sin(x * 1.15 + t * .7 + z * .55) + .35 * Math.sin(x * 2.3 - t * 1.05 + z * 1.3) + .2 * Math.sin(z * 2.1 + t * .6 + x * .4)); for (const p of peaks) h += p.h * Math.exp(-((x - p.x) * (x - p.x) / (p.s * p.s) + (z - (p.z || 0)) * (z - (p.z || 0)) / 2)); return h; };
    const tmp = new T.Color();
    function step(t, k) {
      let q = 0, c = 0;
      for (let zi = 0; zi < NZ; zi++) {
        const z = -D / 2 + D * zi / (NZ - 1), fade = .25 + .75 * (zi / (NZ - 1)); let prev = null;
        for (let xi = 0; xi < NX; xi++) {
          const x = -W / 2 + W * xi / (NX - 1), y = hf(x, z, t) * k, ed = 1 - Math.pow(Math.abs(x) / (W / 2), 3);
          const br = clamp((.18 + y * .9 + .35) * fade * ed, 0, 1);
          tmp.copy(bc).multiplyScalar(br);
          if (prev) { pos[q++] = prev[0]; pos[q++] = prev[1]; pos[q++] = prev[2]; pos[q++] = x; pos[q++] = y; pos[q++] = z; colr[c++] = prev[3]; colr[c++] = prev[4]; colr[c++] = prev[5]; colr[c++] = tmp.r; colr[c++] = tmp.g; colr[c++] = tmp.b; }
          prev = [x, y, z, tmp.r, tmp.g, tmp.b];
        }
      }
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    }
    step(0, 1); return { step, mesh, hf };
  }

  function orb(ctx, color, size, pos, nOrbit = 36) {
    const g = new T.Group(); g.position.copy(pos); ctx.add(g);
    const halo = glow(color, size * 4.2, null, .55), core = glow(0xffffff, size * 1.2, null, .95), mid = glow(color, size * 2.2, null, .9);
    g.add(halo, mid, core);
    const a = new Float32Array(nOrbit * 3), ph = []; for (let i = 0; i < nOrbit; i++) ph.push([ctx.r() * 6.28, .6 + ctx.r() * .9, (ctx.r() - .5) * 1.4, .4 + ctx.r() * .8]);
    const P = pts(a, color, .07, .9); g.add(P);
    return {
      g, step(t, k) {
        g.scale.setScalar(.01 + .99 * k);
        for (let i = 0; i < nOrbit; i++) { const p = ph[i], an = p[0] + t * p[3]; a[i * 3] = Math.cos(an) * p[1] * size * 1.5; a[i * 3 + 1] = p[2] * size * .9; a[i * 3 + 2] = Math.sin(an) * p[1] * size * 1.5; }
        P.geometry.attributes.position.needsUpdate = true; const pulse = 1 + .07 * Math.sin(t * 2.2); halo.scale.setScalar(size * 4.2 * pulse); mid.scale.setScalar(size * 2.2 * pulse);
      }
    };
  }

  /* duo: two glowing qualities over a flowing terrain (e.g. praise = love + gratitude) */
  M.duo = (ctx, p) => {
    const orbs = p.orbs || [{ x: -2.0, c: 'pink', l: 'love' }, { x: 2.0, c: 'blue', l: 'gratitude' }];
    const tr = terrain(ctx, { amp: .34, color: p.color || 'cyan', peaks: orbs.map(o => ({ x: o.x, h: .55, s: .9 })) });
    const os = orbs.map((o, i) => { const O = orb(ctx, col(o.c), .22, V(o.x, .55 + (i % 2) * .15, 0)); const stalk = new T.Line(new T.BufferGeometry().setFromPoints([V(o.x, -1.4, 0), V(o.x, .4, 0)]), lineMat(col(o.c), .35)); ctx.add(stalk); ctx.label(o.l, V(o.x, -.35, 0), { dx: 12, color: '#' + new T.Color(col(o.c)).getHexString() }); return O; });
    if (p.wave) ctx.label(p.wave, V(0, -1.2, 1.9), { cls: 'dim' });
    return (t, k) => { tr.step(t, sm(k * 2)); os.forEach((o, i) => { o.step(t + i, sm(k * 1.5 - i * .2)); o.g.position.y = .5 + (i % 2) * .15 + Math.sin(t * 1.3 + i * 2) * .08; }); };
  };

  /* link: a particle thing on one side, an arrow/line to a letter-or-thing on the other (e.g. lillahi: for/belongs → Allah) */
  M.link = (ctx, p) => {
    const sphere = pts(fib(2600, 1.15), col(p.color || 'gold'), .05, .9); sphere.position.set(-2.0, .1, 0); ctx.add(sphere);
    const shell = pts(fib(500, 1.55), col(p.color || 'gold'), .03, .45); shell.position.copy(sphere.position); ctx.add(shell);
    const hal = glow(col(p.color || 'gold'), 4.4, V(-2.0, .1, 0), .35); ctx.add(hal);
    const target = textSprite(p.to || 'ٱللَّه', { scale: 2.1, px: 190 }); target.position.set(-2.0, .1, .6); ctx.add(target);
    const src = textSprite(p.from || 'لِ', { scale: 1.7, px: 200, glow: 'rgba(255,255,255,.9)' }); src.position.set(2.2, .1, 0); ctx.add(src);
    const A = V(1.4, .1, 0), B = V(-.7, .1, 0);
    ctx.add(new T.Line(new T.BufferGeometry().setFromPoints([A, B]), lineMat(0xffd48a, .55)));
    const cone = new T.Mesh(new T.ConeGeometry(.07, .2, 12), new T.MeshBasicMaterial({ color: 0xffd48a, transparent: true, opacity: .9 })); cone.rotation.z = Math.PI / 2; cone.position.copy(B).add(V(-.08, 0, 0)); ctx.add(cone);
    const N = 26, a = new Float32Array(N * 3), tp = pts(a, 0xffe2a8, .09, 1); ctx.add(tp);
    ctx.label(p.l1 || 'allah', V(-2.0, -1.5, 0), { color: '#ffc65a' }); ctx.label(p.l2 || 'for_belongs', V(1.1, -1.0, 0), { dx: 0, color: '#cfd8ee' }); ctx.label(p.mid || 'belongs_to', V(.35, .42, 0), { cls: 'dim' });
    return (t, k) => {
      sphere.rotation.y = t * .25; shell.rotation.y = -t * .18; sphere.scale.setScalar(.2 + .8 * sm(k * 1.6)); shell.scale.copy(sphere.scale); hal.material.opacity = .35 * sm(k * 2);
      target.material.opacity = sm(k * 2 - .4); src.material.opacity = sm(k * 3);
      for (let i = 0; i < N; i++) { const u = ((t * .35 + i / N) % 1); a[i * 3] = A.x + (B.x - A.x) * u; a[i * 3 + 1] = .1 + Math.sin(u * 30 + i) * .02; a[i * 3 + 2] = 0; }
      tp.geometry.attributes.position.needsUpdate = true;
    };
  };

  /* rings: cross-section growth rings + rising filaments (e.g. Rabb: owns, nurtures, sustains) */
  M.rings = (ctx, p) => {
    const col0 = col(p.color || 'teal'), N = p.n || 26, g = new T.Group(); g.rotation.x = -1.05; g.position.set(0, -.4, 0); ctx.add(g);
    const rings = [];
    for (let i = 0; i < N; i++) {
      const r = .16 + i * .1, pp = [], ph = ctx.r() * 6.28, am = .03 + ctx.r() * .05;
      for (let k = 0; k < 150; k++) { const a = k / 150 * Math.PI * 2, rr = r * (1 + am * Math.sin(a * 3 + ph) + am * .6 * Math.sin(a * 7 + i)); pp.push(V(Math.cos(a) * rr, Math.sin(a) * rr, 0)); }
      const L = loop(pp, col0, .15 + .55 * (i % 3 === 0 ? 1 : .55)); L.scale.setScalar(.01); g.add(L); rings.push(L);
    }
    const sweep = loop(Array.from({ length: 120 }, (_, k) => V(Math.cos(k / 120 * 6.283), Math.sin(k / 120 * 6.283), 0)), 0xffffff, .5); g.add(sweep);
    const fil = new T.Group(); fil.position.set(0, -.1, 0); ctx.add(fil); const fl = [];
    for (let i = 0; i < 16; i++) { const x = (ctx.r() - .5) * 4.4, z = (ctx.r() - .5) * 1.6, h = 1.2 + ctx.r() * 1.5, pp = []; for (let k = 0; k <= 30; k++) { const u = k / 30; pp.push(V(x + Math.sin(u * 4 + i) * .18, u * h, z)); } const L = new T.Line(new T.BufferGeometry().setFromPoints(pp), lineMat(col0, .12 + ctx.r() * .3)); fil.add(L); fl.push(L); }
    const lbs = p.labels || ['owns', 'nurtures', 'sustains']; lbs.forEach((s, i) => ctx.label(s, V(-1.7, -1.9 + i * .34, 0.6), { cls: 'dim', dx: 0 }));
    ctx.label(p.l0 || '', V(0, 1.6, 0), { color: '#' + new T.Color(col0).getHexString() });
    return (t, k) => {
      rings.forEach((L, i) => { const s = sm(t * .8 - i * .07) * (1 + .012 * Math.sin(t * 2 - i * .4)); L.scale.setScalar(Math.max(.01, s)); });
      const u = (t * .45) % 1.4; sweep.scale.setScalar(.2 + u * 2.4); sweep.material.opacity = .5 * (1 - u / 1.4);
      fl.forEach((L, i) => { L.material.opacity = (.12 + .25 * ((Math.sin(t * .8 + i) + 1) / 2)) * sm(t * .6 - .4); });
      g.rotation.z = t * .04;
    };
  };

  /* orbit: a sun and orbiting worlds (e.g. al-ʿālamīn) */
  M.orbit = (ctx, p) => {
    const sunC = col(p.sun || 'white'), g = new T.Group(); g.rotation.x = -.5; g.position.y = -.15; ctx.add(g);
    g.add(glow(0x7fb8ff, 3.2, null, .55), glow(sunC, 1.5, null, 1)); g.add(pts(fib(500, .38), 0xdfeaff, .045, .95));
    const orb = []; const n = p.n || 6;
    for (let i = 0; i < n; i++) {
      const rx = 1 + i * .42, rz = rx * (.55 + .2 * ctx.r()), tilt = (ctx.r() - .5) * .5, sp = .5 / Math.sqrt(rx) + .1, pp = [];
      for (let k = 0; k < 120; k++) { const a = k / 120 * 6.283; pp.push(V(Math.cos(a) * rx, 0, Math.sin(a) * rz)); }
      const L = loop(pp, 0x5fc7ff, .28); L.rotation.z = tilt; g.add(L);
      const pl = glow(i % 2 ? 0x9fd8ff : 0xffe0a0, .22 + ctx.r() * .16, null, 1); g.add(pl); orb.push({ pl, rx, rz, tilt, sp, ph: ctx.r() * 6.28 });
    }
    ctx.label(p.l || 'alam_sign', V(.6, 1.9, 0), { color: '#cfe5ff' });
    return (t, k) => { orb.forEach(o => { const a = o.ph + t * o.sp; const x = Math.cos(a) * o.rx, z = Math.sin(a) * o.rz; o.pl.position.set(x * Math.cos(o.tilt), x * Math.sin(o.tilt), z); o.pl.material.opacity = sm(k * 3 - .3); }); g.rotation.y = t * .05; };
  };

  /* glyph: fallback for any word without its own scene — the root letters float as light around the word */
  M.glyph = (ctx, p) => {
    const letters = [...(p.root || '')], main = textSprite(p.ar || '', { scale: 3.2, px: 190, w: 768, h: 256 }); main.position.set(0, .15, 0); ctx.add(main);
    const cloud = new Float32Array(700 * 3); for (let i = 0; i < 700; i++) { const a = ctx.r() * 6.283, r = 1.2 + ctx.r() * 2.2; cloud[i * 3] = Math.cos(a) * r; cloud[i * 3 + 1] = (ctx.r() - .5) * 1.8; cloud[i * 3 + 2] = Math.sin(a) * r; }
    const C = pts(cloud, 0xffc65a, .035, .6); ctx.add(C);
    const ls = letters.map((ch, i) => { const s = textSprite(ch, { scale: 1.1, px: 170, w: 256, h: 256, glow: 'rgba(53,208,230,.9)' }); ctx.add(s); return { s, i }; });
    return (t, k) => { C.rotation.y = t * .08; main.material.opacity = sm(k * 2.5); ls.forEach(({ s, i }) => { const a = t * .5 + i * 6.283 / Math.max(1, letters.length); s.position.set(Math.cos(a) * 2.2, -.9 + Math.sin(a * 1.3) * .3, Math.sin(a) * 1.2); s.material.opacity = sm(k * 2 - .5); }); };
  };

  /* ---------- engine ---------- */
  function starfield() {
    const r = rng(7), a = new Float32Array(520 * 3); for (let i = 0; i < 520; i++) { a[i * 3] = (r() - .5) * 22; a[i * 3 + 1] = (r() - .5) * 12; a[i * 3 + 2] = -3 - r() * 12; }
    const s = pts(a, 0x8fb4ff, .045, .55); s.userData.star = 1; return s;
  }
  function clear() {
    labels.forEach(l => l.e.remove()); labels = [];
    while (grp.children.length) {
      const o = grp.children.pop();
      o.traverse && o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map && x.material.map !== glowT) x.material.map.dispose(); x.material.dispose(); } });
    }
  }
  function resize() {
    if (!R || !host) return; const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    R.setSize(w, h, false); cam.aspect = w / h; cam.position.z = w / h < .9 ? 10.6 : 7.4; cam.updateProjectionMatrix();
  }
  function frame(now) {
    raf = requestAnimationFrame(frame); if (!running) return;
    const t = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!dragging) { dyaw *= .94; dpitch *= .94; yaw += dyaw; pitch += dpitch; }
    const ay = Math.sin(t * .22) * .12 * autoK;
    grp.rotation.y = yaw + ay; grp.rotation.x = clamp(pitch, -.5, .5) + Math.sin(t * .17) * .03;
    if (upd) upd(t, clamp(t / 1.6));
    scene.children.forEach(o => { if (o.userData.star) o.rotation.y = t * .01; });
    R.render(scene, cam);
    const w = host.clientWidth, h = host.clientHeight; grp.updateMatrixWorld();
    for (const L of labels) {
      const p = L.v.copy(L.at.isVector3 ? L.at : L.at()).applyMatrix4(grp.matrixWorld).project(cam);
      L.e.style.transform = `translate(${(p.x * .5 + .5) * w + L.dx}px,${(-p.y * .5 + .5) * h + L.dy}px) translate(-50%,-50%)`;
      L.e.style.opacity = String(sm(t * 1.1 - .5 - L.t));
    }
  }

  Lab.api = { T, V, clamp, sm, glow, textSprite, pts, lineMat, loop, fib, terrain, orb, col, rng, palette, hashStr };
  Lab.init = function (hostEl) {
    host = hostEl;
    try {
      cv = host.querySelector('canvas');
      R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (e) { Lab.ok = false; return false; }
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); R.setClearColor(0x03050b, 1);
    scene = new T.Scene(); scene.fog = new T.FogExp2(0x03050b, .028);
    cam = new T.PerspectiveCamera(48, 1, .1, 60); cam.position.set(0, .5, 6.6); cam.lookAt(0, -.55, 0);
    grp = new T.Group(); scene.add(grp); scene.add(starfield());
    lblBox = host.querySelector('.lbs'); fade = host.querySelector('.fade');
    const down = (e) => { dragging = true; px = e.clientX; py = e.clientY; dyaw = dpitch = 0; try { cv.setPointerCapture(e.pointerId); } catch (_) { } };
    const move = (e) => { if (!dragging) return; dyaw = (e.clientX - px) * .006; dpitch = (e.clientY - py) * .004; yaw += dyaw; pitch += dpitch; px = e.clientX; py = e.clientY; };
    const up = () => { dragging = false; };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    window.addEventListener('resize', resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);
    Lab.ok = true; resize(); Lab.start(); return true;
  };
  Lab.start = function () { if (!Lab.ok) return; running = true; last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); };
  Lab.stop = function () { running = false; };
  Lab.resize = resize;

  /* show the scene of one word. spec = {m, p}; info = {key, ar, root} */
  Lab.show = function (spec, info) {
    if (!Lab.ok) return;
    Lab.key = info.key; clear(); upd = null; yaw = pitch = 0;
    const ctx = mk(); const m = M[(spec && spec.m) || 'glyph'] || M.glyph;
    const p = Object.assign({ ar: info.ar, root: info.root }, (spec && spec.p) || {});
    try { upd = m(ctx, p); } catch (e) { console.error('lab', e); clear(); upd = M.glyph(mk(), { ar: info.ar, root: info.root }); }
    t0 = performance.now();
    if (fade) { fade.style.transition = 'none'; fade.style.opacity = '1'; requestAnimationFrame(() => { fade.style.transition = 'opacity .7s'; fade.style.opacity = '0'; }); }
  };
  Lab.replay = function () { t0 = performance.now(); };
})();

/* Fahm Story 3D actors. Each builder(p, S) -> { g: THREE.Group, u?(t, A, G, now) }.  Params mirror the 2D engine (400x300 space). */
(function () {
'use strict';
if (!window.FahmStory) return;
const H = FahmStory.helpers, T = H.T, { K, X, Y, Z, TAU, clamp, ease, mix, fr, hs, col, TX, M, G_, mesh, sprite, pts, light } = H;
const V2 = (a, b) => new T.Vector2(a, b), V3 = (a, b, c) => new T.Vector3(a, b, c);
const GOLD = '#e8b84a', CYAN = '#35d0e6', EMBER = '#ff7a2a';
const B = {}; window.FAHM3D = B;
B.onGround = new Set(['cast', 'figures', 'camels', 'elephants', 'kaaba', 'tree', 'gate', 'child', 'food', 'chest', 'humans', 'firewood', 'flames', 'lost', 'dome', 'straw', 'stones', 'river']);
const grp = (...c) => { const g = new T.Group(); c.forEach(x => g.add(x)); return g; };
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const lt = (L, A) => { L.intensity = L.userData.base * A; };

/* ================= light & energy ================= */
B.bloom = (p) => {
  const x = X(p.x ?? 200), y = Y(p.y ?? 120), r = (p.r ?? 70) * K, c = p.col || GOLD, n = p.rays ?? 14, g = new T.Group(); g.position.set(x, y, 0);
  const s1 = sprite(c, r * 4.2, .55), s2 = sprite('#fff6d8', r * 1.5, .9); g.add(s1, s2);
  const rays = new T.Group(); for (let i = 0; i < n; i++) { const pl = new T.Mesh(new T.PlaneGeometry(r * .17, r * 2.4).translate(0, r * 1.2, 0), G_(c, { map: TX.ray(), opacity: .4 })); pl.rotation.z = i / n * TAU; rays.add(pl); } g.add(rays);
  const L = light(c, 5, 12); L.position.set(0, 0, 1.2); g.add(L);
  return { g, u: (t, A, G) => { const k = ease(t / 1.2) * (.88 + .12 * Math.sin(G * 1.6)); g.scale.setScalar(Math.max(.01, k)); rays.rotation.z = G * .08; lt(L, A); } };
};
B.rain = (p) => {
  const n = (p.n ?? 40) * 5, c = p.col || GOLD, rev = p.rev ? -1 : 1, P = pts(n, c, .16, .95), pos = P.userData.pos, g = new T.Group(); g.add(P);
  return { g, u: (t, A, G) => { for (let i = 0; i < n; i++) { const u = fr(G * (.1 + hs(i) * .1) * rev + hs(i, 1)), uu = rev > 0 ? u : 1 - u; pos[i * 3] = (hs(i, 2) - .5) * 12; pos[i * 3 + 1] = 5.6 - uu * 6.4; pos[i * 3 + 2] = (hs(i, 3) - .5) * 5 - 1; } P.geometry.attributes.position.needsUpdate = true; } };
};
B.beam = (p) => {
  const x = X(p.x ?? 200), c = p.col || GOLD, dn = !!p.down, base = Y(p.y ?? 200), top = 7.2, hgt = top - base, g = new T.Group(); g.position.set(x, 0, -.3);
  const cyl = new T.Mesh(new T.CylinderGeometry(dn ? .85 : .5, dn ? .12 : .12, 1, 28, 1, true), G_(c, { map: TX.beam(), opacity: .55 })); if (dn) cyl.rotation.x = Math.PI; g.add(cyl);
  const cyl2 = new T.Mesh(new T.CylinderGeometry(dn ? .3 : .2, .05, 1, 20, 1, true), G_('#fff6d8', { map: TX.beam(), opacity: .5 })); if (dn) cyl2.rotation.x = Math.PI; g.add(cyl2);
  const spr = sprite(c, 2.4, .8); spr.position.y = base; g.add(spr); const P = pts(40, '#fff6d8', .12, .9), pos = P.userData.pos; g.add(P); const L = light(c, 5, 10); L.position.set(0, base + .3, 1); g.add(L);
  return { g, u: (t, A, G) => { const k = ease(t / 1.2); [cyl, cyl2].forEach(m => { m.scale.set(1, Math.max(.01, hgt * k), 1); m.position.y = base + hgt * k / 2; }); for (let i = 0; i < 40; i++) { const u = fr(G * .22 + hs(i)), yy = dn ? top - u * hgt : base + u * hgt; pos[i * 3] = (hs(i, 1) - .5) * (dn ? .4 + (1 - u) * 1.1 : .9); pos[i * 3 + 1] = yy; pos[i * 3 + 2] = (hs(i, 2) - .5) * .8; } P.geometry.attributes.position.needsUpdate = true; spr.scale.setScalar(2.4 * (.9 + .1 * Math.sin(G * 3))); lt(L, A); } };
};
B.orbits = (p) => {
  const n = p.n ?? 5, g = new T.Group(); g.position.set(X(p.x ?? 200), Y(p.y ?? 120), 0);
  g.add(sprite(GOLD, 2.4, .7)); g.add(mesh(new T.SphereGeometry(.2, 24, 16), M('#fff3c4', { emissive: '#ffd27a', emissiveIntensity: 1.2 }), { cast: false }));
  const tilt = new T.Group(); tilt.rotation.x = -1.15; g.add(tilt); const cs = [CYAN, GOLD, '#c9a0ff', '#7fe0a0', '#ff9a7a'], pl = [], rings = [];
  for (let i = 0; i < n; i++) { const rr = (26 + i * 22) * K * 1.25, pg = []; for (let a = 0; a <= 64; a++) pg.push(V3(Math.cos(a / 64 * TAU) * rr, Math.sin(a / 64 * TAU) * rr, 0));
    const ln = new T.Line(new T.BufferGeometry().setFromPoints(pg), reg1(new T.LineBasicMaterial({ color: '#9fc8ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false }), .35)); tilt.add(ln); rings.push(ln);
    const pr = (.1 + hs(i) * .12), c = cs[i % 5], pm = grp(mesh(new T.SphereGeometry(pr, 20, 14), M(c, { emissive: c, emissiveIntensity: .7, roughness: .3 })), sprite(c, pr * 7, .8)); tilt.add(pm); pl.push([pm, rr, i]); }
  return { g, u: (t, A, G) => { const k = ease(t / 1.3); rings.forEach(r => r.scale.setScalar(Math.max(.01, k))); pl.forEach(([pm, rr, i]) => { const a = G * (.7 / (1 + i * .5)) + i * 2.1; pm.position.set(Math.cos(a) * rr * k, Math.sin(a) * rr * k, 0); }); } };
};
function reg1(m, base) { m.userData.base = base; m.opacity = 0; curList().push(m); return m; }
function curList() { return H.cur() || []; }
B.pulse = (p) => {
  const g = new T.Group(), c = p.col || GOLD; g.position.set(X(p.x ?? 200), Y(p.y ?? 120), 0); const rs = [0, 1, 2].map(() => { const m = new T.Mesh(new T.RingGeometry(.92, 1, 64), G_(c, { opacity: .7 })); g.add(m); return m; }); g.add(sprite(c, 1.6, .8));
  return { g, u: (t, A, G) => { rs.forEach((m, i) => { const u = fr(G * .4 + i / 3); m.scale.setScalar(.2 + u * (p.r ?? 90) * K * 1.5); m.material.opacity = .7 * (1 - u) * A; }); } };
};
B.crown = (p) => {
  const g = new T.Group(), gold = M(GOLD, { metalness: .9, roughness: .25, emissive: '#7a5410', emissiveIntensity: .35 }), by = Y(p.y ?? 80); g.position.set(X(p.x ?? 200), by, 0);
  g.add(mesh(new T.CylinderGeometry(.62, .52, .42, 40, 1, true), (gold.side = T.DoubleSide, gold))); g.add(at(mesh(new T.TorusGeometry(.6, .05, 10, 40), gold), 0, .21, 0).rotateX(Math.PI / 2)); g.children[g.children.length - 1].position.y = .21;
  const band = mesh(new T.CylinderGeometry(.635, .535, .12, 40, 1, true), M('#8a1c2e', { side: T.DoubleSide, roughness: .5 })); band.position.y = -.05; g.add(band);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU, sp = mesh(new T.ConeGeometry(.11, .5, 8), gold); sp.position.set(Math.cos(a) * .58, .6, Math.sin(a) * .58); g.add(sp); const gm = mesh(new T.SphereGeometry(.07, 12, 10), M('#fff3c4', { emissive: '#ffe9a8', emissiveIntensity: 1 })); gm.position.set(Math.cos(a) * .58, .88, Math.sin(a) * .58); g.add(gm); }
  const sp = sprite(GOLD, 4.4, .6); sp.position.z = -.4; g.add(sp); const L = light(GOLD, 6, 10); L.position.set(0, .5, 1.6); g.add(L);
  return { g, u: (t, A, G) => { g.position.y = by + (1 - ease(t)) * .8 + Math.sin(G * 1.3) * .06; g.rotation.y = G * .45; g.rotation.x = .18; lt(L, A); } };
};
B.sun = (p) => {
  const g = new T.Group(), c = p.col || '#ffd27a', r = (p.r ?? 20) * K * 1.6; g.add(mesh(new T.SphereGeometry(r, 32, 24), M('#fff0c0', { emissive: '#ffcf70', emissiveIntensity: 1.6 }), { cast: false })); g.add(sprite(c, r * 9, .6)); g.add(sprite('#fff', r * 3, .9));
  const rays = new T.Group(); for (let i = 0; i < 16; i++) { const pl = new T.Mesh(new T.PlaneGeometry(r * .3, r * 2.8).translate(0, r * 1.6, 0), G_(c, { map: TX.ray(), opacity: .35 })); pl.rotation.z = i / 16 * TAU; rays.add(pl); } g.add(rays);
  const L = light(c, 7, 16); L.position.z = 1; g.add(L); const y0 = Y(p.y0 ?? 215), y1 = Y(p.y1 ?? 80), x = X(p.x ?? 200);
  return { g, u: (t, A, G) => { g.position.set(x, mix(y0, y1, ease(t / (p.d ?? 4))), -2); rays.rotation.z = G * .2; lt(L, A); } };
};
B.scales = (p) => {
  const g = new T.Group(), gold = M(GOLD, { metalness: .9, roughness: .25, emissive: '#6a4808', emissiveIntensity: .3 }), bx = X(p.x ?? 200), by = Y(p.y ?? 120) - .5; g.position.set(bx, by, 0);
  g.add(at(mesh(new T.CylinderGeometry(.06, .08, 2.6, 16), gold), 0, 0, 0)); g.add(at(mesh(new T.CylinderGeometry(.5, .62, .12, 24), gold), 0, -1.3, 0)); g.add(at(mesh(new T.SphereGeometry(.12, 16, 12), gold), 0, 1.35, 0));
  const beam = new T.Group(); beam.position.y = 1.15; g.add(beam); beam.add(mesh(new T.BoxGeometry(3.1, .08, .1), gold)); const pans = [];
  [-1.5, 1.5].forEach(sx => { const pv = new T.Group(); pv.position.set(sx, 0, 0); beam.add(pv); [-1, 1].forEach(d => { const ch = mesh(new T.CylinderGeometry(.012, .012, .95, 6), gold); ch.position.set(d * .26, -.45, 0); ch.rotation.z = -d * .26; pv.add(ch); }); const pan = mesh(new T.SphereGeometry(.42, 24, 12, 0, TAU, Math.PI / 2, Math.PI / 2), (gold.side = T.DoubleSide, gold)); pan.position.y = -.95; pan.scale.y = .5; pv.add(pan); pans.push(pv); });
  g.add(sprite(GOLD, 6, .3)); const L = light(GOLD, 4, 9); L.position.set(0, 1, 2); g.add(L);
  return { g, u: (t, A, G) => { const tilt = (p.tilt ?? .18) * Math.sin(Math.min(t, 3) * 1.1) + Math.sin(G * 1.3) * .02; beam.rotation.z = tilt; pans.forEach(pv => pv.rotation.z = -tilt); g.position.y = by + (1 - ease(t)) * .8; lt(L, A); } };
};
B.core = (p) => {
  const mode = p.mode || 'one', g = new T.Group(); g.position.set(X(p.x ?? 200), Y(p.y ?? 120), 0);
  g.add(mesh(new T.SphereGeometry(.28, 28, 20), M('#fff7dc', { emissive: '#ffe9a8', emissiveIntensity: 1.6 }), { cast: false })); const hl = sprite(GOLD, 4.6, .75); g.add(hl); const L = light(GOLD, 5, 12); L.position.z = 1; g.add(L);
  const rings = [0, 1, 2, 3].map(() => { const m = new T.Mesh(new T.RingGeometry(.97, 1, 80), G_(GOLD, { opacity: .5 })); g.add(m); return m; });
  const sats = []; const ns = mode === 'samad' ? 9 : mode === 'equal' ? 6 : mode === 'lineage' ? 3 : 0;
  for (let i = 0; i < ns; i++) { const s = grp(mesh(new T.SphereGeometry(.09, 14, 10), M('#d8f6ff', { emissive: CYAN, emissiveIntensity: 1 })), sprite(CYAN, .9, .7)); g.add(s); sats.push(s); }
  const lines = sats.map(() => { const l = new T.Line(new T.BufferGeometry().setFromPoints([V3(0, 0, 0), V3(1, 0, 0)]), (() => { const m = new T.LineBasicMaterial({ color: GOLD, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false }); m.userData.base = .25; m.opacity = 0; curList().push(m); return m; })()); g.add(l); return l; });
  return { g, u: (t, A, G) => {
    const k = ease(t / 1.4); hl.scale.setScalar(4.6 * k * (.9 + .1 * Math.sin(G * 2))); lt(L, A);
    rings.forEach((m, i) => { const u = fr(G * .22 + i / 4); m.visible = mode === 'one' || mode === 'lineage'; m.scale.setScalar(.2 + u * 3.2); m.material.opacity = .5 * (1 - u) * A; });
    sats.forEach((s, i) => { let px, py;
      if (mode === 'samad') { const a = G * .4 + i * TAU / 9, rr = (40 + (i % 3) * 26) * K * 1.3 + Math.sin(G + i) * .1; px = Math.cos(a) * rr; py = Math.sin(a) * rr * .55; }
      else if (mode === 'equal') { const u = fr(G * .2 + i / 6), a = i * TAU / 6, rr = 3.6 * (1 - u); px = Math.cos(a) * rr; py = Math.sin(a) * rr * .6; s.visible = u < .92; }
      else { const u = fr(G * .25 + i / 3), dir = [-1, .4, 1][i]; px = dir * u * 2.4; py = -u * 1.8; s.visible = true; }
      s.position.set(px, py, 0); const pa = lines[i].geometry.attributes.position; pa.setXYZ(1, px, py, 0); pa.needsUpdate = true; lines[i].visible = mode !== 'lineage'; });
  } };
};
B.haze = (p) => {
  const c = p.col || '#c4302b', g = new T.Group(), n = 14, sps = []; g.position.set(X(p.x ?? 70), Math.max(0, Y(p.y ?? 190)), Z(p.y ?? 190));
  for (let i = 0; i < n; i++) { const s = new T.Sprite(H.reg(new T.SpriteMaterial({ map: TX.smoke(), color: c, depthWrite: false, fog: true }), .45)); g.add(s); sps.push(s); }
  return { g, u: (t, A, G) => { sps.forEach((s, i) => { const u = fr(G * .1 + hs(i)); s.position.set((hs(i, 1) - .5) * 3 + Math.sin(G + i) * .2, u * 2.3, (hs(i, 3) - .5) * 1.5); s.scale.setScalar(1.2 + hs(i, 2) * 1.6); s.material.opacity = .5 * Math.sin(u * Math.PI) * (p.dissolve ? 1 - clamp(t / 4) : 1) * A; }); } };
};
B.smoke = (p) => {
  const c = p.col || '#8a3aa8', n = p.n ?? 26, g = new T.Group(), sps = [], P0 = V3(X(p.x ?? 80), Y(p.y ?? 190), 0), P1 = V3(X(p.tx ?? 280), Y(p.ty ?? 140), 0);
  for (let i = 0; i < n; i++) { const s = new T.Sprite(H.reg(new T.SpriteMaterial({ map: TX.smoke(), color: c, depthWrite: false, fog: false, blending: (c === '#e8b84a' || c === EMBER) ? T.AdditiveBlending : T.NormalBlending }), .55)); g.add(s); sps.push(s); }
  let orb = null; if (p.orb) { orb = grp(sprite(p.orb, 2.2, .8), mesh(new T.SphereGeometry(.18, 16, 12), M('#fff6d8', { emissive: p.orb, emissiveIntensity: 1.2 }), { cast: false })); orb.position.copy(P1); g.add(orb); }
  return { g, u: (t, A, G) => { sps.forEach((s, i) => { let u = fr(G * (.12 + hs(i) * .08) + hs(i, 1)); if (p.retreat) u = 1 - u; s.position.set(mix(P0.x, P1.x, u) + Math.sin(u * 8 + i) * .35, mix(P0.y, P1.y, u) + Math.cos(u * 6 + i * 2) * .25, mix(P0.z, P1.z, u) + (hs(i, 4) - .5)); s.scale.setScalar((6 + u * 16) * K * 3.2); s.material.opacity = .55 * Math.sin(u * Math.PI) * A; }); } };
};
B.dark = (p) => {
  const g = new T.Group(), n = 26, sps = []; for (let i = 0; i < n; i++) { const s = new T.Sprite(H.reg(new T.SpriteMaterial({ map: TX.smoke(), color: i % 5 === 0 ? '#2a1450' : '#04020a', depthWrite: false, fog: false }), .85)); s.renderOrder = 5; g.add(s); sps.push(s); }
  const edge = sprite('#9a6ad0', 5, .3); g.add(edge);
  return { g, u: (t, A, G) => { const k = ease(t / (p.d ?? 3)) * (p.full ?? 1), ex = -7 + 14 * k; sps.forEach((s, i) => { const row = i % 13, lay = (i / 13) | 0; s.position.set(ex - lay * 1.5 - hs(i) * 1.5 + Math.sin(G * 1.2 + row) * .3, -1 + row * .72, 2.5 + lay * .05); s.scale.setScalar(2.6 + hs(i, 1) * 1.6); }); edge.position.set(ex + .5, 2, 2.6); edge.scale.set(3, 9, 1); } };
};
B.frost = () => { const P = pts(90, '#cfeeff', .2, .9), pos = P.userData.pos, g = grp(P); return { g, u: (t, A, G) => { for (let i = 0; i < 90; i++) { const u = fr(G * .1 + hs(i)); pos[i * 3] = (hs(i, 1) - .5) * 13; pos[i * 3 + 1] = 5.5 - u * 6; pos[i * 3 + 2] = (hs(i, 2) - .5) * 5; } P.geometry.attributes.position.needsUpdate = true; } }; };
B.dawnsplit = (p) => {
  const g = new T.Group(), y = Y(p.y ?? 190); const wedge = new T.Mesh(new T.PlaneGeometry(1, 1).translate(0, .5, 0), G_('#ffd9a0', { map: TX.beam(), opacity: .8 })); wedge.position.set(0, y, -12); g.add(wedge); const hz = sprite('#ffd9a0', 22, .8); hz.position.set(0, y + .5, -12); g.add(hz);
  return { g, u: (t, A, G) => { const k = ease(t / 2.2); wedge.scale.set(70 * k + .1, 40, 1); hz.scale.setScalar(2 + 24 * k); } };
};
B.split = (p) => {
  const g = new T.Group(), ms = [];
  [[-1, p.c1 || CYAN], [1, p.c2 || GOLD]].forEach(([sd, c]) => { const v = new Float32Array([sd * .1, 0, -9, sd * .6, 0, -9, sd * 4.6, 0, 3.2, sd * .12, 0, 3.2]), gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(v, 3)); gg.setAttribute('uv', new T.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 1, 0, 1]), 2)); gg.setIndex([0, 1, 2, 0, 2, 3]); const m = new T.Mesh(gg, G_(c, { map: TX.beam(), opacity: .8 })); m.position.y = .03; g.add(m); const sp = sprite(c, 4, .5); sp.position.set(sd * 2.6, .6, 1); g.add(sp); ms.push(m, sp); });
  return { g, u: (t, A, G) => { const k = ease(t / 1.4); ms.forEach(m => m.scale.x = k + .01); } };
};
B.path = (p) => {
  const g = new T.Group(), c = p.col || GOLD;
  if ((p.kind || 'straight') === 'straight') {
    const v = new Float32Array([-1.1, .03, 3.4, 1.1, .03, 3.4, .12, .03, -10, -.12, .03, -10]), gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(v, 3)); gg.setAttribute('uv', new T.BufferAttribute(new Float32Array([0, 1, 0, 1, 0, 0, 0, 0]), 2)); gg.setIndex([0, 1, 2, 0, 2, 3]);
    g.add(new T.Mesh(gg, G_(c, { map: TX.beam(), opacity: .8 }))); const e = sprite(c, 4, .8); e.position.set(0, .8, -10); g.add(e); const P = pts(40, '#fff6d8', .13, .9), pos = P.userData.pos; g.add(P);
    return { g, u: (t, A, G) => { for (let i = 0; i < 40; i++) { const u = fr(i / 40 - G * .1); pos[i * 3] = (hs(i) - .5) * .2 * (1 - u) * 6; pos[i * 3 + 1] = .08; pos[i * 3 + 2] = mix(3.2, -10, u * u); } P.geometry.attributes.position.needsUpdate = true; } };
  }
  for (let k = 0; k < 4; k++) { const pg = [], sx = (-4 + k * 2.6); const cu = new T.CatmullRomCurve3([V3(sx, .05, 3), V3(sx + (hs(k) - .5) * 4, .05, 0), V3(sx + (hs(k, 1) - .5) * 5, .05, -3), V3((hs(k, 2) - .5) * 9, .05, -8)]); g.add(new T.Mesh(new T.TubeGeometry(cu, 40, .07, 6), G_('#8a8fb0', { opacity: .5 }))); }
  return { g };
};
B.beads = (p) => {
  const g = new T.Group(), r = 56 * K * 1.35, n = 33, bs = []; g.position.set(X(p.x ?? 200), Y(p.y ?? 110), 0); g.add(sprite(GOLD, r * 3.6, .22));
  g.add(mesh(new T.TorusGeometry(r, .012, 6, 90), M('#8a6a30'), { cast: false }));
  for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2, m = mesh(new T.SphereGeometry(.09, 16, 12), M('#caa04a', { metalness: .6, roughness: .3, emissive: '#ffcf6a', emissiveIntensity: 0 })); m.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); g.add(m); bs.push(m); }
  return { g, u: (t, A, G) => { const on = (G * 2.2) % n; bs.forEach((m, i) => { const l = clamp(1 - Math.abs(((i - on + n) % n)) / 6); m.material.emissiveIntensity = l * 1.6; m.scale.setScalar(1 + l * .4); }); g.rotation.y = Math.sin(G * .5) * .25; g.scale.setScalar(ease(t / 1.2) + .01); } };
};
B.coins = (p) => {
  const n = p.n ?? 18, g = new T.Group(), cs = [], x0 = X(p.x ?? 200), w = (p.wd ?? 230) * K, gm = new T.CylinderGeometry(.17, .17, .035, 20), mt = M(GOLD, { metalness: .9, roughness: .25, emissive: '#6a4808', emissiveIntensity: .25 });
  for (let i = 0; i < n; i++) { const m = mesh(gm, mt); g.add(m); cs.push(m); }
  return { g, u: (t, A, G) => { cs.forEach((m, i) => { const u = fr(G * .2 + hs(i, 1)); m.position.set(x0 + (hs(i) - .5) * w, 5.6 - u * 5.4, (hs(i, 2) - .5) * 2.4); m.rotation.set(G * 3 + i, 0, G * 2 + i * 1.3); m.visible = u < .98; }); } };
};
B.knots = (p) => {
  const g = new T.Group(); g.position.set(X(p.x ?? 200), Y(p.y ?? 150), 0); g.add(sprite('#6a3aa0', 6, .35)); const pts_ = []; for (let i = 0; i <= 40; i++) { const a = i / 40; pts_.push(V3(-3.4 + a * 6.8, Math.sin(a * 9) * .3, 0)); }
  g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts_), 80, .06, 8), M('#7a5a3a', { roughness: .9 }))); for (let i = 0; i < 5; i++) { const a = (i + .5) / 5; g.add(at(mesh(new T.SphereGeometry(.14, 14, 10), M('#3a2a1a')), -3.4 + a * 6.8, Math.sin(a * 9) * .3, 0)); }
  return { g, u: (t, A, G) => { g.scale.x = ease(t / 1.4) + .01; g.children[1].position.y = Math.sin(G * .5) * .05; } };
};
B.rope = (p) => {
  const g = new T.Group(); g.position.set(X(p.x ?? 200), Y(p.y ?? 130), 0); g.add(sprite(EMBER, 3.4, .25)); const r = 34 * K * 1.3; ['#7a5a2e', '#9a7440', '#5a4020'].forEach((c, k) => { const pg = []; for (let a = 0; a <= 120; a++) { const th = a / 120 * TAU, rr = r + Math.sin(th * 14 + k * 2.1) * .06; pg.push(V3(Math.cos(th) * rr, Math.sin(th) * rr * 1.1, Math.sin(th * 14 + k * 2.1) * .05)); } g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pg, true), 160, .055, 6, true), M(c, { roughness: .95 }))); });
  return { g, u: (t, A, G) => { g.scale.setScalar(ease(t / 1.2) + .01); g.rotation.y = Math.sin(G * .6) * .5; } };
};

/* ================= fire ================= */
function fireParticles(n, wd, hgt, seed) {
  n = Math.min(n, 60); const g = new T.Group(), sps = [];
  for (let i = 0; i < n; i++) { const s = sprite('#ffffff', 1, .55); g.add(s); sps.push(s); }
  const upd = (k, G, A = 1) => { sps.forEach((s, i) => { const u = fr(G * (.55 + hs(i, seed) * .5) + hs(i, 1 + seed)), hh = hgt * k * (.55 + hs(i, 4) * .6);
    s.position.set((hs(i, 2 + seed) - .5) * wd * (1 - u * .7) + Math.sin(G * 3 + i) * .06, .1 + u * hh, (hs(i, 5 + seed) - .5) * wd * .4);
    const sz = (.3 + hs(i, 6) * .5) * (Math.min(wd, 3) * .4 + .5) * (1 - u * .65); s.scale.setScalar(Math.max(.02, sz)); s.material.color.setRGB(1, Math.max(.12, .62 - u * .55), Math.max(.02, .16 - u * .16)); s.material.opacity = (s.material.userData.base) * (1 - u * u) * A; }); };
  return { P: g, upd, sps };
}
B.flames = (p) => {
  const wd = (p.wd ?? 120) * K, hg = (p.h ?? 110) * K, n = (p.n ?? 46) * 9, f = fireParticles(n, wd, hg, p.seed ?? 0), g = new T.Group(); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 235)); g.add(f.P);
  const L = light(EMBER, 9, 14); L.position.set(0, 1, 1); g.add(L); const gl = sprite(EMBER, wd * 2, .25); gl.position.y = .6; g.add(gl);
  return { g, u: (t, A, G) => { const k = ease(t / 1.2); f.upd(k, G, A); L.intensity = L.userData.base * A * k * (.8 + .2 * Math.sin(G * 17) + .1 * Math.sin(G * 9)); gl.scale.setScalar(wd * 2.2 * k + .1); } };
};
B.firewood = (p) => {
  const g = new T.Group(); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 200)); const mt = M('#4a2e16', { roughness: .95 });
  for (let i = 0; i < 12; i++) { const l = mesh(new T.CylinderGeometry(.07, .08, 1.3, 8), mt); l.rotation.set(0, hs(i) * 3, Math.PI / 2 - .3 + hs(i, 1) * .6); l.position.set((hs(i, 2) - .5) * .5, .12 + (i % 3) * .1, (hs(i, 3) - .5) * .4); g.add(l); }
  const f = fireParticles(60, .8, 1.1, 7); g.add(f.P); const L = light(EMBER, 6, 10); L.position.y = .8; g.add(L);
  return { g, u: (t, A, G) => { f.upd(ease(t), G, A); L.intensity = L.userData.base * A * (.8 + .2 * Math.sin(G * 15)); } };
};
B.hand = (p) => {
  const g = new T.Group(), mt = M('#2a1a18', { roughness: .8, emissive: '#7a2a10', emissiveIntensity: .35 }); g.position.set(X(p.x ?? 200), Y(p.y ?? 140), 0); g.rotation.z = -(p.rot ?? 0);
  g.add(mesh(new T.BoxGeometry(.46, .5, .16), mt)); [-.17, -.057, .057, .17].forEach((fx, i) => { const f = mesh(new T.CapsuleGeometry(.05, .34 + (i === 1 || i === 2 ? .06 : 0), 4, 8), mt); f.position.set(fx, .5, 0); g.add(f); }); const th = mesh(new T.CapsuleGeometry(.055, .24, 4, 8), mt); th.position.set(-.3, .1, 0); th.rotation.z = .9; g.add(th);
  g.add(sprite(EMBER, 2.2, .45)); const P = pts(26, '#8a6a58', .14, .6), pos = P.userData.pos; g.add(P); const L = light(EMBER, 3, 6); L.position.z = 1; g.add(L);
  return { g, u: (t, A, G) => { const k = clamp((t - .8) / 2.6); g.scale.setScalar(1.6 * (1 - k * .5)); g.position.y = Y(p.y ?? 140) - k * .3; for (let i = 0; i < 26; i++) { const u = fr(i / 26 + G * .5); pos[i * 3] = (hs(i) - .5) * 1.1; pos[i * 3 + 1] = .2 + u * 1.8; pos[i * 3 + 2] = (hs(i, 1) - .5) * .5; } P.material.opacity = .6 * k * A; P.geometry.attributes.position.needsUpdate = true; lt(L, A * (1 - k)); } };
};

/* ================= people ================= */
function person(o = {}) {
  const g = new T.Group(), robe = M(o.robe || '#d9cfb5', { roughness: .85 }), skin = M('#b88a64', { roughness: .7 }), tb = M(o.turban || '#f1ead4', { roughness: .8 });
  const lower = mesh(new T.LatheGeometry([V2(.0, 0), V2(.22, 0), V2(.2, .22), V2(.17, .55)], 16), robe); g.add(lower);
  const torso = new T.Group(); torso.position.y = .55; g.add(torso); torso.add(mesh(new T.LatheGeometry([V2(.0, 0), V2(.17, 0), V2(.2, .16), V2(.17, .38), V2(.08, .48), V2(0, .5)], 16), robe));
  const head = mesh(new T.SphereGeometry(.105, 18, 14), skin); head.position.y = .6; torso.add(head); const turb = mesh(new T.SphereGeometry(.115, 18, 12), tb); turb.scale.set(1.1, .72, 1.1); turb.position.y = .67; torso.add(turb);
  const arms = [-1, 1].map(d => { const a = new T.Group(); a.position.set(d * .19, .42, 0); torso.add(a); const ar = mesh(new T.CapsuleGeometry(.04, .3, 4, 8), robe); ar.position.y = -.19; a.add(ar); const hd = mesh(new T.SphereGeometry(.043, 10, 8), skin); hd.position.y = -.39; a.add(hd); return a; });
  g.userData = { lower, torso, arms, setPose(pose) { const r = Math.min(pose, 1), s = clamp(pose - 1); torso.rotation.x = -1.45 * r - .15 * s; lower.scale.y = 1 - .5 * s; torso.position.y = .55 * lower.scale.y; g.position.y = 0; arms.forEach((a, i) => { a.rotation.z = (i ? -1 : 1) * (.08 + .18 * s); a.rotation.x = r * -.6; }); } };
  return g;
}
B.figures = (p) => {
  const n = p.n ?? 5, s = (p.s ?? 1) * 1.05, mode = p.mode || 'pray', gap = (p.gap ?? 36) * K, x0 = X(p.x ?? 200), z = Z(p.y ?? 212), g = new T.Group(), ps = [], robes = ['#e8dfc6', '#cfd8c8', '#d8c9a8', '#c8cfdc', '#e2d4b4'];
  for (let i = 0; i < n; i++) { const pr = person({ robe: robes[i % 5] }); pr.scale.setScalar(s); pr.position.set(x0 + (i - (n - 1) / 2) * gap, 0, z); if (mode === 'pray') pr.rotation.y = Math.PI; if (mode === 'neglect') pr.rotation.y = (i % 2 ? 1 : -1) * 1.2; g.add(pr); const au = sprite(p.aura || GOLD, s * 1.9, mode === 'spot' ? (i === (p.hero ?? 2) ? .6 : .1) : .22); au.position.set(pr.position.x, .6 * s, pr.position.z); g.add(au); ps.push([pr, au]); }
  let spot = null; if (mode === 'spot') { const hx = x0 + (((p.hero ?? 2) - (n - 1) / 2) * gap); spot = new T.SpotLight('#fff2c0', 40, 14, .32, .5, 1.2); spot.position.set(hx, 8, z + 1); spot.target.position.set(hx, 0, z); spot.castShadow = true; spot.userData.base = 40; g.add(spot, spot.target); const cone = new T.Mesh(new T.CylinderGeometry(.25, 1.1, 8, 24, 1, true), G_('#fff2c0', { map: TX.beam(), opacity: .35 })); cone.position.set(hx, 4, z); g.add(cone); }
  return { g, u: (t, A, G) => {
    ps.forEach(([pr, au], i) => { const ap = ease((t - i * .12) / .6); pr.scale.setScalar(Math.max(.01, s * ap)); au.visible = ap > 0;
      if (mode === 'pray') { const cyc = (G * .22) % 1; let pose = cyc < .3 ? 0 : cyc < .45 ? ease((cyc - .3) / .15) : cyc < .6 ? 1 : cyc < .75 ? 1 + ease((cyc - .6) / .15) : 2; if (cyc > .9) pose = 2 * (1 - ease((cyc - .9) / .1)); pr.userData.setPose(pose); }
      else if (mode === 'walk') { pr.position.x = x0 + (i - (n - 1) / 2) * gap + Math.sin(G * 1.5 + i) * .5; pr.position.y = Math.abs(Math.sin(G * 6 + i)) * .04; pr.rotation.y = Math.cos(G * 1.5 + i) > 0 ? 1.4 : -1.4; }
      else if (mode === 'neglect') { pr.userData.torso.rotation.x = .25 * Math.sin(G + i); pr.scale.setScalar(Math.max(.01, s * ap * (.85 + .15 * Math.sin(G * .9 + i * 1.7)))); }
      else { pr.userData.torso.rotation.z = Math.sin(G * .9 + i) * .02; } });
    if (spot) spot.intensity = spot.userData.base * A; } };
};
B.humans = (p) => {
  const n = p.n ?? 40, g = new T.Group(), ps = [], y0 = p.y ?? 215;
  for (let i = 0; i < n; i++) { const c = i % 3 ? CYAN : GOLD, pr = person({ robe: '#e8f6ff', turban: '#e8f6ff' }); const sc = (.7 + hs(i, 3) * .25); pr.scale.setScalar(sc); pr.position.set((hs(i) - .5) * 11, 0, Z(y0) - hs(i, 1) * 1.2 + (i % 4) * .25); g.add(pr); const au = sprite(c, 1.5, .5); au.position.set(pr.position.x, .5, pr.position.z); g.add(au); ps.push([pr, au, sc]); }
  return { g, u: (t, A, G) => ps.forEach(([pr, au, sc], i) => { const a = ease(t / 1 - hs(i, 2) * .6); pr.scale.setScalar(Math.max(.01, sc * a)); au.material.opacity = (.35 + .35 * Math.sin(G * 1.5 + i)) * A; pr.userData.torso.rotation.z = Math.sin(G + i) * .03; }) };
};
B.lost = (p) => {
  const n = p.n ?? 6, g = new T.Group(), ps = [], x0 = X(p.x ?? 300), z0 = Z(p.y ?? 205);
  for (let i = 0; i < n; i++) { const pr = person({ robe: '#a8aabc', turban: '#b8bacb' }); pr.scale.setScalar(.7); g.add(pr); ps.push(pr); }
  for (let i = 0; i < 6; i++) { const s = new T.Sprite(H.reg(new T.SpriteMaterial({ map: TX.smoke(), color: '#b8b8d0', depthWrite: false }), .18)); s.scale.setScalar(2.6); s.position.set(x0 + (i - 3) * .9, 1, z0 - .4); g.add(s); }
  return { g, u: (t, A, G) => ps.forEach((pr, i) => { pr.position.set(x0 + Math.sin(G * .7 + i * 2) * 1.1 + Math.cos(G * .3 + i) * .5, 0, z0 + Math.cos(G * .9 + i * 3) * .4); pr.rotation.y = Math.sin(G * .8 + i * 1.7) * 2.5; pr.userData.torso.rotation.z = Math.sin(G * 1.3 + i) * .08; }) };
};
B.child = (p) => {
  const g = new T.Group(), kid = person({ robe: '#c9d6e6', turban: '#c9d6e6' }), x = X(p.x ?? 160), z = Z(p.y ?? 214); kid.scale.setScalar(.62); g.add(kid); const au = sprite(CYAN, 1.5, .25); g.add(au); let big = null;
  if (p.shove) { big = person({ robe: '#4a3a3a', turban: '#2a2020' }); big.scale.setScalar(1.45); g.add(big); }
  return { g, u: (t, A, G) => { const push = p.shove ? Math.min(t, 2.6) : 0; kid.position.set(x - push * .3, 0, z); kid.userData.torso.rotation.x = .25 + .06 * Math.sin(G); au.position.set(kid.position.x, .45, z); if (big) { big.position.set(x + 1.3 - push * .3, 0, z); big.rotation.y = -1.2; big.userData.arms[0].rotation.z = -1.3 + Math.sin(G * 6) * .05 * (push < 2.4 ? 1 : 0); } } };
};
B.chest = (p) => {
  const g = new T.Group(), dim = p.dim ?? 0, mt = M('#1a2238', { roughness: .6 }); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 215)); g.scale.setScalar(1.4);
  g.add(mesh(new T.LatheGeometry([V2(0, 0), V2(.9, 0), V2(1, .4), V2(.8, 1.0), V2(.5, 1.3), V2(.2, 1.45), V2(0, 1.5)], 24), mt)); g.add(at(mesh(new T.SphereGeometry(.4, 20, 16), mt), 0, 1.9, 0));
  const hv = grp(mesh(new T.SphereGeometry(.17, 18, 14), M('#fff3c4', { emissive: '#ffe9a8', emissiveIntensity: 1.6 }), { cast: false }), sprite(GOLD, 2.6, .8)); hv.position.set(0, .85, .62); g.add(hv); const L = light(GOLD, 4, 8); L.position.set(0, 1, 1.4); g.add(L);
  return { g, u: (t, A, G) => { const pu = .8 + .2 * Math.sin(G * 3); hv.scale.setScalar(pu); L.intensity = L.userData.base * A * pu * (1 - dim * .5); } };
};

/* ================= places & objects ================= */
B.kaaba = (p) => {
  const s = p.s ?? 1, g = new T.Group(), blk = M('#0c0c12', { roughness: .45, metalness: .25 }), gold = M(GOLD, { metalness: .85, roughness: .3, emissive: '#5a3c06', emissiveIntensity: .4 }); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 212)); g.scale.setScalar(s * 1.15);
  g.add(at(mesh(new T.BoxGeometry(1.3, 1.5, 1.2), blk), 0, .75, 0)); g.add(at(mesh(new T.BoxGeometry(1.32, .12, 1.22), gold), 0, 1.1, 0)); g.add(at(mesh(new T.BoxGeometry(.34, .75, .06), gold), -.25, .4, .62)); g.add(at(mesh(new T.BoxGeometry(.26, .67, .04), M('#2a1a08')), -.25, .38, .64));
  g.add(at(mesh(new T.CylinderGeometry(2.3, 2.4, .05, 48), M('#d8d2c0', { roughness: .5 })), 0, .02, 0)); const tw = []; for (let i = 0; i < 22; i++) { const c = mesh(new T.ConeGeometry(.07, .26, 8), M(i % 3 ? '#f1ead4' : '#d9cfb5'), { cast: false }); g.add(c); tw.push(c); }
  g.add(at(sprite(GOLD, 6, .3), 0, .8, 0)); const L = light('#ffe0a0', 3, 9); L.position.set(0, 2.2, 2.4); g.add(L);
  return { g, u: (t, A, G) => { tw.forEach((c, i) => { const a = G * .22 + i / 22 * TAU, rr = 1.9 + (i % 2) * .22; c.position.set(Math.cos(a) * rr, .15, Math.sin(a) * rr); }); lt(L, A); } };
};
B.dome = (p) => {
  const s = p.s ?? 1, g = new T.Group(), st = M('#cbbf9d', { roughness: .8 }), gold = M(GOLD, { metalness: .85, roughness: .3, emissive: '#6a4808', emissiveIntensity: .35 }); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 212) - 1); g.scale.setScalar(s * 1.05);
  g.add(at(mesh(new T.BoxGeometry(3.4, .95, 1.8), st), 0, .475, 0)); g.add(at(mesh(new T.SphereGeometry(.95, 32, 20, 0, TAU, 0, Math.PI / 2), M('#8fb8c0', { roughness: .45, metalness: .3 })), 0, .95, 0)); g.add(at(mesh(new T.CylinderGeometry(.02, .02, .45, 6), gold), 0, 2.15, 0)); g.add(at(mesh(new T.SphereGeometry(.07, 10, 8), gold), 0, 2.4, 0));
  [-2.4, 2.4].forEach(mx => { g.add(at(mesh(new T.CylinderGeometry(.16, .2, 3.1, 14), st), mx, 1.55, 0)); g.add(at(mesh(new T.ConeGeometry(.24, .7, 14), M('#8fb8c0', { metalness: .3 })), mx, 3.45, 0)); g.add(at(mesh(new T.SphereGeometry(.08, 10, 8), gold), mx, 3.88, 0)); g.add(at(mesh(new T.BoxGeometry(.3, .07, .3), gold), mx, 2.55, 0)); });
  for (let i = -1; i <= 1; i++) { const w = new T.Mesh(new T.PlaneGeometry(.26, .5), G_('#ffd27a', { opacity: .85 })); w.position.set(i * .8, .5, .92); g.add(w); } const L = light('#ffd27a', 2.5, 8); L.position.set(0, 1.2, 2); g.add(L);
  return { g, u: (t, A) => { g.scale.y = s * 1.05 * (ease(t) + .01); lt(L, A); } };
};
B.gate = (p) => {
  const s = (p.s ?? 1) * .62, g = new T.Group(), st = M('#26283a', { roughness: .8 }), gold = M(GOLD, { metalness: .85, roughness: .3, emissive: '#5a3c06', emissiveIntensity: .3 }); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 212)); g.scale.setScalar(s);
  [-1, 1].forEach(sd => { g.add(at(mesh(new T.BoxGeometry(.5, 3.1, .6), st), sd * 1.9, 1.55, 0)); g.add(at(mesh(new T.BoxGeometry(.7, .2, .75), gold), sd * 1.9, 3.15, 0)); g.add(at(mesh(new T.BoxGeometry(1.3, 2.1, .5), st), sd * 1.28, 1.05, 0)); });
  g.add(at(mesh(new T.BoxGeometry(4.5, 1.2, .6), st), 0, 2.55 + .5, 0)); g.add(at(mesh(new T.BoxGeometry(2.4, 1.0, .5), st), 0, 2.1 + .0, 0)); const arch = mesh(new T.TorusGeometry(1.1, .12, 10, 36, Math.PI), gold); arch.position.set(0, 1.6, .05); g.add(arch);
  const door = new T.Mesh(new T.PlaneGeometry(2.2, 2.9), G_('#ffe9a8', { opacity: .9 })); door.position.set(0, 1.45, -.1); g.add(door); const gl = sprite('#ffe9a8', 7, .3); gl.position.set(0, 1.6, .3); g.add(gl); const L = light('#ffe9a8', 8, 12); L.position.set(0, 1.6, 2); g.add(L);
  const cr = []; for (let i = 0; i < (p.crowd || 0); i++) { const m = mesh(new T.ConeGeometry(.12, .5, 8), M(i % 2 ? '#e8dfc6' : '#cfd8c8'), { cast: false }); g.add(m); cr.push(m); }
  return { g, u: (t, A, G) => { const o = ease(t / 2); door.material.opacity = .75 * o * A; gl.scale.setScalar(7 * o + .1); L.intensity = L.userData.base * A * o; cr.forEach((m, i) => { const n = cr.length, u = fr(G * .09 + i / n + hs(i) * .05), lane = i % 3, sx = i % 2 ? 9 : -9; m.position.set(mix(sx, 0, u) + (lane - 1) * .2, .25, 1.2 + lane * .3 - u * 1.4); m.visible = u < .9; }); } };
};
B.food = (p) => {
  const g = new T.Group(), full = !p.empty; g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 190)); g.scale.setScalar(1.5); const pl = M('#2a2012', { roughness: .5 });
  g.add(at(mesh(new T.CylinderGeometry(.62, .45, .16, 28), pl), 0, .22, 0)); g.add(at(mesh(new T.CylinderGeometry(.5, .5, .02, 24), M('#3a2c18')), 0, .31, 0)); g.add(at(mesh(new T.CylinderGeometry(.35, .5, .12, 24), pl), 0, .1, 0));
  if (full) { for (let i = 0; i < 7; i++) { const m = mesh(new T.SphereGeometry(.12, 12, 10), M(i % 2 ? '#8a5a24' : '#c98a3c', { roughness: .6 })); m.scale.set(1.3, .8, 1); m.position.set((hs(i) - .5) * .6, .42 + (i % 3) * .06, (hs(i, 1) - .5) * .4); g.add(m); } g.add(at(sprite(GOLD, 2.4, .25), 0, .5, 0)); }
  const P = full ? pts(14, '#ffffff', .1, .3) : null, pos = P && P.userData.pos; if (P) g.add(P);
  return { g, u: (t, A, G) => { const aw = p.away ? Math.min(t, 3) * .5 : 0; g.position.x = X(p.x ?? 200) + aw; if (P) { for (let i = 0; i < 14; i++) { const u = fr(G * .4 + i / 14); pos[i * 3] = (hs(i) - .5) * .5 + Math.sin(u * 6 + i) * .08; pos[i * 3 + 1] = .5 + u * .9; pos[i * 3 + 2] = (hs(i, 1) - .5) * .3; } P.geometry.attributes.position.needsUpdate = true; } } };
};
B.shield = (p) => {
  const sh = new T.Shape(); sh.moveTo(0, 1.1); sh.quadraticCurveTo(.8, .9, .95, .7); sh.quadraticCurveTo(.95, -.55, 0, -1.25); sh.quadraticCurveTo(-.95, -.55, -.95, .7); sh.quadraticCurveTo(-.8, .9, 0, 1.1);
  const g = new T.Group(); g.position.set(X(p.x ?? 200), Y(p.y ?? 120), 0); g.add(mesh(new T.ExtrudeGeometry(sh, { depth: .14, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }), M('#22a8c4', { metalness: .7, roughness: .22, emissive: '#0a4a64', emissiveIntensity: .5 })));
  const rim = mesh(new T.ExtrudeGeometry(sh, { depth: .08, bevelEnabled: false, curveSegments: 20 }), M(GOLD, { metalness: .9, roughness: .25 })); rim.scale.set(1.12, 1.1, 1); rim.position.z = -.06; g.add(rim);
  g.add(at(mesh(new T.TubeGeometry(new T.CatmullRomCurve3([V3(-.35, .02, 0), V3(-.07, -.3, 0), V3(.4, .35, 0)]), 20, .06, 8), M('#fff6d8', { emissive: '#fff6d8', emissiveIntensity: .6 })), 0, 0, .3)); g.add(at(sprite(CYAN, 5, .45), 0, 0, -.3)); const L = light(CYAN, 4, 9); L.position.set(0, 0, 2); g.add(L);
  return { g, u: (t, A, G) => { g.scale.setScalar((p.s ?? 1) * 1.1 * (.9 + .1 * ease(t / .8))); g.rotation.y = Math.sin(G * .8) * .35; lt(L, A); } };
};
B.tree = (p) => {
  const s = (p.s ?? 1.3) * .95, g = new T.Group(), bark = M('#4a3220', { roughness: .95 }), leaf = M('#2f7a3a', { roughness: .85 }); g.position.set(X(p.x ?? 200), 0, Z(p.y ?? 214)); g.scale.setScalar(s);
  const trunk = mesh(new T.CylinderGeometry(.16, .3, 2.1, 10), bark); trunk.position.y = 1.05; g.add(trunk); const br = []; [[-.5, 2.0, .5], [.55, 2.2, -.45], [0, 2.5, .1]].forEach(([x, y, z]) => { const b = mesh(new T.CylinderGeometry(.05, .12, 1.0, 6), bark); b.position.set(x * .6, y, z * .6); b.rotation.z = -x * .8; b.rotation.x = z * .6; g.add(b); });
  const fol = []; if (!p.cut) for (let i = 0; i < 9; i++) { const f = mesh(new T.IcosahedronGeometry(.55 + hs(i) * .25, 1), leaf.clone()); f.material.userData.base = 1; f.material.transparent = true; CUR_push(f.material); f.position.set((hs(i, 1) - .5) * 1.7, 2.3 + hs(i, 2) * 1.0, (hs(i, 3) - .5) * 1.4); g.add(f); fol.push(f); }
  let stump = null; if (p.cut) { trunk.scale.y = .2; trunk.position.y = .2; const lg = mesh(new T.CylinderGeometry(.15, .26, 1.9, 10), bark); lg.rotation.z = 1.5; lg.position.set(1.4, .3, .6); g.add(lg); for (let i = 0; i < 6; i++) { const f = mesh(new T.IcosahedronGeometry(.4, 1), leaf); f.position.set(2 + hs(i) * .8, .35, .5 + (hs(i, 1) - .5)); g.add(f); } }
  return { g, u: (t, A, G) => { const k = clamp((t - (p.delay ?? .4)) / 3.5) * (p.wither ?? 0), lc = col('#2f7a3a').lerp(col('#7a5a2a'), k); fol.forEach((f, i) => { f.material.color.copy(lc); f.scale.setScalar(1 - k * .55); f.position.y -= 0; f.rotation.y = G * .1 + i; }); g.rotation.z = Math.sin(G * .7) * .012; } };
};
function CUR_push(m) { curList().push(m); }
B.river = (p) => {
  const g = new T.Group(), w = new T.PlaneGeometry(26, 14, 52, 28); w.rotateX(-Math.PI / 2); const pos = w.attributes.position, base = pos.array.slice(); const mt = M('#1a8fb0', { roughness: .12, metalness: .55, emissive: '#0a3a5a', emissiveIntensity: .6, opacity: .88 }); const wm = mesh(w, mt, { cast: false }); wm.position.set(0, .06, -2.8 + Math.max(0, (Y(p.y ?? 150) - 1.6)) * .0); g.add(wm);
  const P = pts(70, '#fff6d8', .13, .9), pp = P.userData.pos; g.add(P);
  return { g, u: (t, A, G) => { const k = ease(t / 1.5); for (let i = 0; i < pos.count; i++) { const x = base[i * 3], z = base[i * 3 + 2]; pos.setY(i, Math.sin(x * .6 + G * 1.6) * .05 + Math.sin(z * .8 - G * 1.3) * .05); } pos.needsUpdate = true; w.computeVertexNormals(); wm.scale.set(1, 1, k + .01); for (let i = 0; i < 70; i++) { const u = fr(G * (.06 + hs(i) * .05) + hs(i, 1)); pp[i * 3] = (u - .5) * 24; pp[i * 3 + 1] = .14 + Math.sin(G * 3 + i) * .03; pp[i * 3 + 2] = -2.8 + (hs(i, 2) - .5) * 12; } P.material.opacity = .9 * A * (.5 + .5 * Math.sin(G * 2)); P.geometry.attributes.position.needsUpdate = true; } };
};

/* ================= animals ================= */
function camel() {
  const g = new T.Group(), c = M('#a88556', { roughness: .9 }), d = M('#7a5e38', { roughness: .9 });
  const body = mesh(new T.SphereGeometry(.5, 20, 14), c); body.scale.set(1.5, .75, .62); body.position.y = 1.0; g.add(body); const hump = mesh(new T.SphereGeometry(.3, 14, 10), d); hump.scale.set(1, 1.2, .9); hump.position.set(-.1, 1.5, 0); g.add(hump);
  const neck = mesh(new T.CylinderGeometry(.09, .15, .95, 10), c); neck.position.set(.88, 1.5, 0); neck.rotation.z = -.42; g.add(neck); const head = mesh(new T.SphereGeometry(.17, 14, 10), d); head.scale.set(1.7, .85, .8); head.position.set(1.17, 1.98, 0); head.rotation.z = -.25; g.add(head);
  const legs = []; [[.55, .22], [.55, -.22], [-.55, .22], [-.55, -.22]].forEach(([x, z], i) => { const lg = new T.Group(); lg.position.set(x, .88, z); const l = mesh(new T.CylinderGeometry(.06, .045, .9, 8), d); l.position.y = -.45; lg.add(l); g.add(lg); legs.push(lg); }); const tail = mesh(new T.CylinderGeometry(.015, .03, .5, 6), d); tail.position.set(-.82, .95, 0); tail.rotation.z = .4; g.add(tail);
  g.userData = { legs, neck, head, walk(ph) { legs.forEach((l, i) => l.rotation.z = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? 1.2 : 0)) * .35); g.position.y = Math.abs(Math.sin(ph)) * .03; } }; return g;
}
B.camels = (p) => {
  const n = p.n ?? 3, s = (p.s ?? .75) * .72, dir = p.dir ?? 1, g = new T.Group(), cs = [], z0 = Z(p.y ?? 214);
  for (let i = 0; i < n; i++) { const c = camel(); c.scale.setScalar(s); c.rotation.y = dir > 0 ? 0 : Math.PI; g.add(c); cs.push(c); if (p.aura) { const a = sprite(p.aura, 3.4 * s, .35); a.userData.i = i; c.add(a); a.position.y = 1.2; a.scale.setScalar(4); } }
  const L = p.aura ? light(p.aura, 3, 8) : null; if (L) { L.position.set(0, 2, 2); g.add(L); }
  return { g, u: (t, A, G) => { cs.forEach((c, i) => { let x = (p.x ?? 60) + i * (p.gap ?? 80); if (!p.still) x += dir * Math.min(t, 6) * 12; const xx = dir > 0 ? x : 400 - x; c.position.set(X(xx), 0, z0 + (i % 2) * .22); if (!p.still) c.userData.walk(G * 3 + i * 1.3); else { c.userData.neck.rotation.z = -.42 + Math.sin(G + i) * .05; } }); if (L) lt(L, A); } };
};
function elephant() {
  const g = new T.Group(), c = M('#948f8b', { roughness: .9 }), d = M('#7c7774', { roughness: .9 }), iv = M('#efe3c4', { roughness: .4 });
  const body = mesh(new T.SphereGeometry(.8, 22, 16), c); body.scale.set(1.5, .92, .8); body.position.y = 1.3; g.add(body); const head = new T.Group(); head.position.set(1.4, 1.6, 0); g.add(head); head.add(mesh(new T.SphereGeometry(.52, 20, 14), c));
  [-1, 1].forEach(sd => { const e = mesh(new T.SphereGeometry(.5, 14, 10), d); e.scale.set(.1, 1, .85); e.position.set(-.18, .02, sd * .52); e.rotation.y = sd * .3; head.add(e); const t = mesh(new T.ConeGeometry(.055, .75, 8), iv); t.position.set(.42, -.3, sd * .26); t.rotation.z = -1.1; t.rotation.x = sd * .25; head.add(t); });
  const trunk = new T.Group(); trunk.position.set(.45, -.1, 0); head.add(trunk); const tb = mesh(new T.TubeGeometry(new T.CatmullRomCurve3([V3(0, 0, 0), V3(.3, -.35, 0), V3(.42, -.8, 0), V3(.3, -1.15, 0)]), 14, .13, 8), c); trunk.add(tb);
  const legs = []; [[.9, .36], [.9, -.36], [-.9, .36], [-.9, -.36]].forEach(([x, z]) => { const lg = new T.Group(); lg.position.set(x, 1.05, z); const l = mesh(new T.CylinderGeometry(.2, .16, 1.05, 12), d); l.position.y = -.52; lg.add(l); g.add(lg); legs.push(lg); });
  const tail = mesh(new T.CylinderGeometry(.015, .03, .7, 6), d); tail.position.set(-1.25, 1.3, 0); tail.rotation.z = .15; g.add(tail);
  g.userData = { legs, trunk, walk(ph) { legs.forEach((l, i) => l.rotation.z = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? .9 : 0)) * .28); g.position.y = Math.abs(Math.sin(ph)) * .025; trunk.rotation.z = Math.sin(ph * .5) * .12; } }; return g;
}
B.elephants = (p) => {
  const n = p.n ?? 3, s = (p.s ?? .85) * .7, mode = p.mode || 'march', g = new T.Group(), es = [], z0 = Z(p.y ?? 214), mats = [];
  for (let i = 0; i < n; i++) { const e = elephant(); e.scale.setScalar(s); g.add(e); es.push(e); }
  const L = light('#ffb070', 2.5, 9); L.position.set(0, 3, 3); g.add(L);
  return { g, u: (t, A, G) => { es.forEach((e, i) => { let x = (p.x ?? 70) + i * (p.gap ?? 78), face = 1, ph = G * 3.4 + i, sink = 0, a = 1; if (mode === 'march') { x += Math.min(t, 4) * (p.v ?? 14); if (p.still) x = (p.x ?? 70) + i * (p.gap ?? 78) + 14; } else if (mode === 'wander') { face = Math.sin(G * .6 + i) > 0 ? 1 : -1; x += Math.sin(G * .5 + i * 2) * 22; } else if (mode === 'crumble') { const k = clamp(t / 2.5); sink = k; ph = 0; x += 14; a = 1 - k; }
      e.position.set(X(x), -sink * .9, z0 + (i % 2) * .3); e.rotation.y = face > 0 ? 0 : Math.PI; e.rotation.z = sink * .4; e.scale.setScalar(Math.max(.01, s * (1 - sink * .4))); e.userData.walk(ph); }); lt(L, A); } };
};
B.birds = (p) => {
  const n = p.n ?? 16, g = new T.Group(), bs = [], bm = M('#6a7a78', { roughness: .7, emissive: '#2a3a3a', emissiveIntensity: .6 }), wm = M('#8a9a96', { side: T.DoubleSide, roughness: .8, emissive: '#3a4a46', emissiveIntensity: .5 }), tx = X(p.tx ?? 190), ty = Y(p.ty ?? 190);
  for (let i = 0; i < n; i++) { const b = new T.Group(); b.add(mesh(new T.SphereGeometry(.11, 10, 8), bm)); b.children[0].scale.set(1.8, .8, .8); const hd = mesh(new T.SphereGeometry(.06, 8, 6), bm); hd.position.x = .24; b.add(hd); const ws = [-1, 1].map(d => { const w = new T.Group(); const pl = mesh(new T.PlaneGeometry(.34, .17), wm); pl.position.z = d * .17; pl.rotation.x = -Math.PI / 2; w.add(pl); b.add(w); return [w, d]; }); const st = mesh(new T.SphereGeometry(.035, 8, 6), M('#3a2418', { emissive: EMBER, emissiveIntensity: .6 })); st.position.set(.15, -.1, 0); b.add(st); b.scale.setScalar(1.05 + hs(i, 7) * .35); g.add(b); bs.push([b, ws, i]); }
  return { g, u: (t, A, G) => bs.forEach(([b, ws, i]) => { const u = fr(G * .12 + hs(i, 5)), e = ease(u), sx = 7 + hs(i, 1) * 2, sy = 5.5 - hs(i, 2) * 2, ex = tx + (hs(i, 3) - .5) * 4.5, ey = ty + (hs(i, 4) - .5) * 1.4; const px = mix(sx, ex, e), py = mix(sy, ey, e) + Math.sin(u * 14 + i) * .15; b.position.set(px, py, (hs(i, 8) - .5) * 3 - .5); b.rotation.z = Math.atan2(mix(sy, ey, e + .02) - mix(sy, ey, e), -(mix(sx, ex, e + .02) - mix(sx, ex, e)) + 1e-4) * .5; b.rotation.y = Math.PI; const fl = .55 + Math.sin(G * 14 + hs(i, 6) * 6) * .75; ws.forEach(([w, d]) => w.rotation.x = d * fl); b.visible = u > .02 && u < .98 && A * ease(t / .6 - i * .04) > .01; }) };
};
B.stones = (p) => {
  const n = p.n ?? 22, g = new T.Group(), ss = [], tx = X(p.tx ?? 150), tz = Z(p.ty ?? 205), gm = new T.SphereGeometry(.1, 10, 8), mt = M('#3a2418', { emissive: EMBER, emissiveIntensity: .8, roughness: .6 });
  for (let i = 0; i < n; i++) { const m = mesh(gm, mt); const sp = sprite(EMBER, .9, .7); m.add(sp); g.add(m); ss.push(m); }
  const L = light(EMBER, 4, 9); g.add(L);
  return { g, u: (t, A, G) => { let mx = 0, my = 3; ss.forEach((m, i) => { const u = fr(G * (.35 + hs(i) * .25) + hs(i, 1)), sx = 7 + hs(i, 2) * 3, ex = tx + (hs(i, 3) - .5) * 5.5, ey = .12; const e = u * u; m.position.set(mix(sx, ex, u), mix(7, ey, e), mix(-1, tz, u) + (hs(i, 6) - .5) * 1.5); m.scale.setScalar(1 + hs(i, 5) * .9); if (u > .93) { mx = m.position.x; my = m.position.y; } }); L.position.set(tx, 1.2, tz + 1); L.intensity = L.userData.base * A * (.6 + .4 * Math.sin(G * 12)); } };
};
B.straw = (p) => {
  const n = p.n ?? 60, g = new T.Group(), gm = new T.CylinderGeometry(.012, .012, .3, 4), mt = M(p.eaten ? '#6a5a3a' : '#c9a85a', { roughness: .9 });
  for (let i = 0; i < n; i++) { const m = mesh(gm, mt, { cast: false }); m.position.set((hs(i) - .5) * 11, .04 + hs(i, 4) * .05, Z(p.y ?? 214) + hs(i, 1) * 3.2); m.rotation.set(Math.PI / 2 + (hs(i, 6) - .5) * .5, 0, hs(i, 2) * 3); m.scale.y = .6 + hs(i, 3) * .8; g.add(m); }
  const P = pts(18, '#d9c9a0', .6, .15), pos = P.userData.pos; g.add(P);
  return { g, u: (t, A, G) => { for (let i = 0; i < 18; i++) { const u = fr(G * .1 + hs(i, 8)); pos[i * 3] = (hs(i, 9) - .5) * 11 + u * 1.2; pos[i * 3 + 1] = .3 + u * 1.8; pos[i * 3 + 2] = (hs(i) - .5) * 3; } P.geometry.attributes.position.needsUpdate = true; } };
};
/* Build 32: the CAST — faceless people who act the ayah out, word by word.
   p.tl = [[wordIndex, group 'a'|'b'|'*', state], ...]; group a = those addressed / believers (warm robes, left),
   group b = deniers / wrongdoers (dark robes, right). States: stand, listen, pray, dua, give, walk, turn, fear, joy, fall, look, gather, hide. */
B.cast = (p, S) => {
  const g = new T.Group(), groups = {}, s = 1.35, z = Z(p.y ?? 214);
  const mk = (key, n, x, robes, aura) => { const L = []; for (let i = 0; i < n; i++) { const pr = person({ robe: robes[i % robes.length], turban: key === 'b' ? '#3a3440' : undefined }); pr.scale.setScalar(.01); const bx = X(x) + (i - (n - 1) / 2) * 40 * K * (key === 'b' ? -1 : 1), bz = z + (i % 2) * .35; pr.position.set(bx, 0, bz); pr.rotation.y = key === 'b' ? -.35 : .35; g.add(pr); const au = sprite(aura, s * 1.7, .2); au.position.set(bx, .6, bz); g.add(au); L.push({ pr, au, bx, bz, i }); } groups[key] = { L, st: p.a0 && key === 'a' ? p.a0 : 'stand', t0: 0, prev: 'stand' }; };
  if (p.na) mk('a', p.na, p.xa ?? 135, ['#e8dfc6', '#cfd8c8', '#d8c9a8', '#c8cfdc', '#e2d4b4'], GOLD);
  if (p.nb) mk('b', p.nb, p.xb ?? 295, ['#4a3a46', '#3c3a4a', '#523a3a', '#3a4040'], '#c4302b');
  const coin = sprite(GOLD, .5, 0); g.add(coin);
  const tl = (p.tl || []).slice().sort((a, b) => a[0] - b[0]);
  let lastIdx = -9, born = -1;
  const stateAt = (key, w) => { let st = key === 'a' && p.a0 ? p.a0 : 'stand'; for (const [ww, gk, s2] of tl) { if (ww > w) break; if (gk === key || gk === '*') st = s2; } return st; };
  return { g, u: (t, A, G, now) => {
    let w = S && typeof S.reveal === 'number' ? S.reveal : 99; if (w >= 99) { const mx = tl.length ? tl[tl.length - 1][0] + 3 : 3; w = Math.floor(G / 1.4) % (mx + 2); }  /* idle: the little story keeps replaying */
    if (w !== lastIdx) { lastIdx = w; Object.keys(groups).forEach(k => { const gr = groups[k], ns = stateAt(k, w); if (ns !== gr.st) { gr.prev = gr.st; gr.st = ns; gr.t0 = G; } }); }
    if (born < 0) born = G;
    Object.keys(groups).forEach(k => {
      const gr = groups[k], e = ease((G - gr.t0) / .8), st = gr.st;
      gr.L.forEach(({ pr, au, bx, bz, i }) => {
        const ap = ease((G - born - i * .15) / .7), u = pr.userData; let sc = s * ap, px = bx, py = 0, ry = k === 'b' ? -.35 : .35, tx = 0, tz = 0, aO = .2, pose = 0, armX = 0, armZ = 0;
        const sway = Math.sin(G * 1.1 + i) * .02;
        if (st === 'listen') { tx = -.12 * e; ry = (k === 'b' ? -1 : 1) * .15; aO = .45; }
        else if (st === 'pray') { const cyc = ((G - gr.t0) * .3 + i * .05) % 1; pose = cyc < .3 ? 0 : cyc < .45 ? ease((cyc - .3) / .15) : cyc < .6 ? 1 : cyc < .75 ? 1 + ease((cyc - .6) / .15) : cyc < .9 ? 2 : 2 * (1 - ease((cyc - .9) / .1)); ry = Math.PI; aO = .5; }
        else if (st === 'dua') { armX = -2.3 * e; armZ = .25 * e; aO = .55; }
        else if (st === 'give') { if (i === 0) { armX = -1.2 * e; } aO = .4; }
        else if (st === 'walk') { px = bx + (k === 'b' ? -1 : 1) * Math.min(1.6, (G - gr.t0) * .45); py = Math.abs(Math.sin(G * 6 + i)) * .04; ry = (k === 'b' ? -1 : 1) * 1.45; }
        else if (st === 'turn') { ry = (k === 'b' ? 1 : -1) * (Math.PI * .85) * e; aO = .08; sc *= 1 - .08 * e; }
        else if (st === 'fear') { tx = .18 * e; px = bx + Math.sin(G * 30 + i) * .025 * e; aO = .1; }
        else if (st === 'joy') { py = Math.abs(Math.sin(G * 5 + i)) * .12 * e; armX = -2.6 * e; armZ = .5 * e; aO = .7; }
        else if (st === 'fall') { tx = -1.35 * e; sc *= 1 - .35 * e; aO = .02; }
        else if (st === 'look') { tx = .3 * e; aO = .4; }
        else if (st === 'gather') { px = bx + (200 - (k === 'b' ? 295 : 135)) * K * .35 * e; aO = .35; }
        else if (st === 'hide') { sc *= Math.max(.01, 1 - e); }
        pr.scale.setScalar(Math.max(.01, sc)); pr.position.set(px, py, bz); pr.rotation.y += (ry - pr.rotation.y) * .12;
        if (st === 'pray') u.setPose(pose); else { u.setPose(0); u.torso.rotation.x = tx; u.torso.rotation.z = sway; }
        u.arms.forEach((a, j) => { if (st === 'pray') return; a.rotation.x += (armX - a.rotation.x) * .15; a.rotation.z += (((j ? -1 : 1) * (.08 + armZ)) - a.rotation.z) * .15; });
        au.position.set(px, .6 * sc, bz); au.material.opacity = aO * ap * A;
        if (st === 'give' && i === 0 && k === 'a') { const q = ((G - gr.t0) * .45) % 1; coin.position.set(px + q * 2.2, .9 + Math.sin(q * Math.PI) * .9, bz); coin.material.opacity = (1 - q) * A; coin.scale.setScalar(.35 + .1 * Math.sin(G * 6)); }
      });
    });
    if (!groups.a || groups.a.st !== 'give') coin.material.opacity = 0;
  } };
};

})();

/* Build 31: word hologram — every recited word shows its own unique meaning-scene + signature, on a floating glass panel */
(function () {
  const FS = window.FahmStory; if (!FS || !window.FAHM3D) return; const H = FS.helpers, T = H.T, B = window.FAHM3D;
  B.wholo = (p, S) => {
    const cw = 640, ch = 400, cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const cx = cv.getContext('2d');
    const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace;
    const w = 2.9, h = w * ch / cw, g = new T.Group(), by = H.Y(p.y ?? 104); g.position.set(H.X(p.x ?? 262), by, 1.2);
    const back = new T.Mesh(new T.PlaneGeometry(w * 1.05, h * 1.08), H.reg(new T.MeshBasicMaterial({ color: '#070b1c', transparent: true, depthWrite: false, fog: false }), .5)); back.position.z = -.02; g.add(back);
    const face = new T.Mesh(new T.PlaneGeometry(w, h), H.G_('#ffffff', { map: tex, opacity: 1 })); g.add(face);
    const edge = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(w * 1.05, h * 1.08)), H.reg(new T.LineBasicMaterial({ color: '#dcab40', transparent: true, depthWrite: false, fog: false }), .8)); g.add(edge);
    const halo = H.sprite('#33cbe0', w * 1.5, .18); halo.position.z = -.05; g.add(halo);
    let last = -2, t0 = 0, lastDraw = 0;
    return { g, u: (t, A, G, now) => {
      g.position.y = by + Math.sin(G * .9) * .05; g.rotation.y = Math.sin(G * .23) * .06;
      if (now - lastDraw < 1 / 30) return; lastDraw = now;
      const words = FahmWS.curWords(); if (!words || !words.length) return;
      let i = -1; const sw = document.querySelector('#sw .ar'), tx = sw && sw.textContent.trim();
      if (tx) { for (let k = Math.max(0, last); k < words.length && i < 0; k++) if (words[k].ar === tx) i = k; for (let k = 0; k < words.length && i < 0; k++) if (words[k].ar === tx) i = k; }
      if (i < 0) { i = S.reveal; if (i < 0) i = 0; if (i >= words.length) i = Math.floor(G / 2.8) % words.length; }
      if (i !== last) { last = i; t0 = now; }
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cw, ch); cx.setTransform(2, 0, 0, 2, 0, 0);
      try { FahmWS.renderWord(cx, cw / 2, ch / 2, now - t0, words[i], i, words); } catch (e) { }
      tex.needsUpdate = true;
    } };
  };
})();

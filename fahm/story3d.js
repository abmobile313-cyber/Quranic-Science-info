/* Fahm Story 3D: lit, shadowed, cinematic 3D scenes for the tafsiri story (three.js).
   Same interface as FahmScene: set(spec) show(w) all() start() stop() resize().  No faces are modelled on any figure. */
(function () {
'use strict';
const T = window.THREE; if (!T) return;
const TAU = Math.PI * 2, K = 0.0247;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ease = x => { x = clamp(x); return x * x * (3 - 2 * x); }, mix = (a, b, t) => a + (b - a) * t, fr = x => x - Math.floor(x);
const hs = (i, s = 0) => fr(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);
const X = x => (x - 200) * K, Y = y => 1.6 + (150 - y) * K, Z = y => (y - 215) * 0.045;
const col = c => new T.Color(c);

/* ---------- textures ---------- */
const TX = {};
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }
TX.glow = () => TX._g || (TX._g = canvasTex(128, 128, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.55)'); r.addColorStop(.6, 'rgba(255,255,255,.12)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }));
TX.dot = () => TX._d || (TX._d = canvasTex(64, 64, (g, w, h) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.8)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }));
TX.ray = () => TX._r || (TX._r = canvasTex(32, 128, (g, w, h) => { const l = g.createLinearGradient(0, h, 0, 0); l.addColorStop(0, 'rgba(255,255,255,.9)'); l.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = l; g.fillRect(0, 0, w, h); const m = g.createLinearGradient(0, 0, w, 0); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.5, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = m; g.fillRect(0, 0, w, h); }));
TX.beam = () => TX._b || (TX._b = canvasTex(8, 128, (g, w, h) => { const l = g.createLinearGradient(0, 0, 0, h); l.addColorStop(0, 'rgba(255,255,255,.0)'); l.addColorStop(.15, 'rgba(255,255,255,.55)'); l.addColorStop(1, 'rgba(255,255,255,.05)'); g.fillStyle = l; g.fillRect(0, 0, w, h); }));
TX.smoke = () => TX._s || (TX._s = canvasTex(128, 128, (g, w, h) => { for (let i = 0; i < 9; i++) { const x = 64 + (hs(i) - .5) * 40, y = 64 + (hs(i, 1) - .5) * 40, r = 30 + hs(i, 2) * 24, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } }));
TX.sand = () => TX._sd || (TX._sd = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { const v = 200 + hs(i) * 55 | 0; g.fillStyle = `rgba(${v},${v},${v},.5)`; g.fillRect(hs(i, 1) * w, hs(i, 2) * h, 1 + hs(i, 3) * 2, 1); } }));

/* ---------- per-actor material registry (fade-in) ---------- */
let CUR = null;
const reg = (m, base = 1) => { m.userData.base = base; m.userData.add = m.blending === T.AdditiveBlending; m.transparent = true; m.opacity = 0; if (CUR) CUR.push(m); return m; };
const M = (c, o = {}) => reg(new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .72, metalness: .04 }, o)), o.opacity != null ? o.opacity : 1);
const G_ = (c, o = {}) => reg(new T.MeshBasicMaterial(Object.assign({ color: c, blending: T.AdditiveBlending, depthWrite: false, fog: false, side: T.DoubleSide }, o)), o.opacity != null ? o.opacity : 1);
const mesh = (geo, mat, o = {}) => { const m = new T.Mesh(geo, mat); m.castShadow = o.cast !== false; m.receiveShadow = o.recv !== false; return m; };
function sprite(c, size, op = 1, tex) { const m = reg(new T.SpriteMaterial({ map: tex || TX.glow(), color: c, blending: T.AdditiveBlending, depthWrite: false, fog: false }), op); const s = new T.Sprite(m); s.scale.set(size, size, 1); return s; }
function pts(n, c, size, op = 1, o = {}) {
  const g = new T.BufferGeometry(), pos = new Float32Array(n * 3); g.setAttribute('position', new T.BufferAttribute(pos, 3));
  const m = reg(new T.PointsMaterial(Object.assign({ color: c, size, map: TX.dot(), transparent: true, blending: T.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false }, o)), op);
  const p = new T.Points(g, m); p.frustumCulled = false; p.userData.pos = pos; return p;
}
const light = (c, i, d = 14) => { const l = new T.PointLight(c, i, d, 1.6); l.userData.base = i; return l; };

/* ---------- environment presets ---------- */
const SKY = {
  night: { top: '#03060e', mid: '#0a1430', bot: '#16264d', stars: 1, hemi: ['#8aa4dc', '#141a30', .8], key: ['#a8c0ff', 2.2, [-4, 7, 6]], rim: '#5a8ae0', gr: '#4a4640', fog: '#0c1632' },
  dawn: { top: '#0a1130', mid: '#5a3a78', bot: '#f0a068', stars: .3, hemi: ['#ffc99a', '#2a1c38', .7], key: ['#ffb27a', 2.1, [6, 4, 6]], rim: '#7a5ac8', gr: '#6a4a52', fog: '#c07a6a' },
  day: { top: '#1a5d9e', mid: '#5aa3d0', bot: '#cde6ee', stars: 0, hemi: ['#cfe8ff', '#8a6a3a', .9], key: ['#fff1d0', 2.6, [-5, 9, 6]], rim: '#aaccff', gr: '#c9a56a', fog: '#bcd8e2' },
  dusk: { top: '#120d2c', mid: '#5a2a52', bot: '#d0652e', stars: .2, hemi: ['#ff9a6a', '#1a1030', .6], key: ['#ff8a50', 1.9, [6, 3, 5]], rim: '#8a5ad0', gr: '#4a2c3c', fog: '#8a3e3a' },
  void: { top: '#010208', mid: '#03040e', bot: '#070b1c', stars: .6, hemi: ['#7a8ac0', '#0a0c18', .6], key: ['#9ab0ff', 1.6, [-3, 6, 6]], rim: '#4a5aaa', gr: '#1a2030', fog: '#05070f' },
  fire: { top: '#150404', mid: '#3c0c0a', bot: '#8a2208', stars: 0, hemi: ['#ff7a40', '#200606', .6], key: ['#ff6a30', 2.0, [0, 5, 7]], rim: '#ff9a4a', gr: '#3a1008', fog: '#4a0e08' },
  holy: { top: '#06142a', mid: '#0b2a48', bot: '#2a6a8a', stars: 1, hemi: ['#aee6ff', '#0a1a30', .75], key: ['#d8f2ff', 1.7, [-3, 8, 6]], rim: '#e8c46a', gr: '#16405a', fog: '#164864' }
};
const SKYV = 'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const SKYF = 'varying vec3 vP;uniform vec3 top,mid,bot;void main(){float h=clamp(vP.y*1.35+.08,0.,1.);vec3 c=h<.45?mix(bot,mid,h/.45):mix(mid,top,(h-.45)/.55);gl_FragColor=vec4(c,1.);}';

let ctxOK = null;
function ok() { if (ctxOK != null) return ctxOK; try { const c = document.createElement('canvas'); ctxOK = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { ctxOK = false; } return ctxOK; }

class Story {
  constructor(cv) {
    this.cv = cv; this.spec = { sky: 'night', items: [] }; this.reveal = -1; this.running = false; this.t0 = performance.now(); this.acts = []; this.gtype = '';
    const r = this.r = new T.WebGLRenderer({ canvas: cv, antialias: (window.devicePixelRatio || 1) < 2, powerPreference: 'high-performance' }); try { r.debug.checkShaderErrors = false; } catch (e) { }
    r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.15; r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    const sc = this.sc = new T.Scene(); sc.fog = new T.Fog('#101c3e', 14, 46);
    this.cam = new T.PerspectiveCamera(45, 4 / 3, .1, 200);
    this.skyM = new T.ShaderMaterial({ vertexShader: SKYV, fragmentShader: SKYF, side: T.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: col('#000') }, mid: { value: col('#000') }, bot: { value: col('#000') } } });
    this.sky = new T.Mesh(new T.SphereGeometry(90, 24, 16), this.skyM); this.sky.renderOrder = -10; sc.add(this.sky);
    this.hemi = new T.HemisphereLight('#fff', '#222', .6); sc.add(this.hemi);
    this.key = new T.DirectionalLight('#fff', 1.5); this.key.castShadow = true; this.key.shadow.mapSize.set(1024, 1024); const sh = this.key.shadow.camera; sh.left = -9; sh.right = 9; sh.top = 7; sh.bottom = -5; sh.near = 1; sh.far = 30; this.key.shadow.bias = -.0006; this.key.shadow.normalBias = .03; sc.add(this.key); sc.add(this.key.target);
    this.fill = new T.DirectionalLight('#dfe8ff', .55); this.fill.position.set(0, 3, 10); sc.add(this.fill);
    this.rim = new T.DirectionalLight('#48f', .7); this.rim.position.set(4, 4, -8); sc.add(this.rim);
    this.stars = pts(500, '#fff', .22, 1); { const p = this.stars.userData.pos; for (let i = 0; i < 500; i++) { const a = hs(i) * TAU, e = .12 + hs(i, 1) * 1.05, R = 80; p[i * 3] = Math.cos(a) * Math.cos(e) * R; p[i * 3 + 1] = Math.sin(e) * R * .9; p[i * 3 + 2] = -Math.abs(Math.sin(a)) * Math.cos(e) * R - 8; } this.stars.geometry.attributes.position.needsUpdate = true; this.stars.material.opacity = 1; this.stars.material.userData.base = 1; CUR = null; }
    sc.add(this.stars);
    this.moon = sprite('#cfe6ff', 6, 1); this.moon.material.opacity = 1; sc.add(this.moon); this.moon.visible = false;
    this.world = new T.Group(); sc.add(this.world); this.ground = null;
    this.resize(); this._raf = this._raf.bind(this);
  }
  resize() {
    const b = this.cv.getBoundingClientRect(), w = Math.max(2, Math.round(b.width)), h = Math.max(2, Math.round(b.height));
    this.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.aspect = w / h;
  }
  /* ---- ground ---- */
  buildGround(type, tint) {
    if (this.ground) { this.sc.remove(this.ground); this.ground.geometry.dispose(); this.ground.material.dispose(); this.ground = null; }
    if (type === 'none') return;
    const sx = 70, sz = 60, nx = 110, nz = 90, g = new T.PlaneGeometry(sx, sz, nx, nz); g.rotateX(-Math.PI / 2); g.translate(0, 0, -20);
    const p = g.attributes.position, colr = new Float32Array(p.count * 3), base = col(tint);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i); let y = 0;
      if (type === 'dunes') { const far = clamp((-z - 3) / 10); y = far * (Math.sin(x * .17 + z * .05) * 1.5 + Math.sin(x * .07 - z * .11 + 1.3) * 2.1 + Math.sin(x * .41 + z * .23) * .22) + (1 - far) * (Math.sin(x * .6 + z * .4) * .02); y = Math.max(y, -.05) - .02; }
      p.setY(i, y); const shade = .8 + .35 * clamp(y / 2.4) + (hs(i) - .5) * .06; colr[i * 3] = base.r * shade; colr[i * 3 + 1] = base.g * shade; colr[i * 3 + 2] = base.b * shade;
    }
    g.setAttribute('color', new T.BufferAttribute(colr, 3)); g.computeVertexNormals();
    const m = new T.MeshStandardMaterial({ color: '#fff', vertexColors: true, roughness: type === 'flat' ? .85 : .95, metalness: 0, map: TX.sand() }); m.map.wrapS = m.map.wrapT = T.RepeatWrapping; m.map.repeat.set(24, 20);
    this.ground = new T.Mesh(g, m); this.ground.receiveShadow = true; this.sc.add(this.ground);
  }
  /* ---- spec ---- */
  set(spec) {
    this.spec = spec || { sky: 'night', items: [] }; this.reveal = -1; this.t0 = performance.now();
    this.acts.forEach(a => { this.world.remove(a.g); a.g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose && m.dispose()); } if (o.isLight) o.dispose && o.dispose(); }); });
    this.acts = [];
    const P = SKY[this.spec.sky || 'night'] || SKY.night, items = this.spec.items || [], B = window.FAHM3D || {};
    const needGround = items.some(it => B.onGround && B.onGround.has(it.a));
    let gt = this.spec.gr && this.spec.gr !== 'none' ? this.spec.gr : (needGround ? 'flat' : 'none');
    const gtint = (this.spec.sky === 'day' ? P.gr : P.gr); if (this.gtype !== gt + this.spec.sky) { this.buildGround(gt, gtint); this.gtype = gt + this.spec.sky; }
    const U = this.skyM.uniforms; U.top.value.set(P.top); U.mid.value.set(P.mid); U.bot.value.set(P.bot);
    this.sc.fog.color.set(P.fog); this.sc.fog.near = gt === 'none' ? 18 : 16; this.sc.fog.far = gt === 'none' ? 60 : 58;
    this.hemi.color.set(P.hemi[0]); this.hemi.groundColor.set(P.hemi[1]); this.hemi.intensity = P.hemi[2] * 1.3;
    this.key.color.set(P.key[0]); this.key.intensity = P.key[1]; this.key.position.set(...P.key[2]); this.key.target.position.set(0, 0, 0); this.rim.color.set(P.rim); this.rim.intensity = .8;
    this.stars.visible = P.stars > 0; this.stars.material.opacity = P.stars; this.stars.material.userData.base = P.stars;
    if (this.spec.moon) { this.moon.visible = true; this.moon.position.set(X(this.spec.moon[0]) * 4, Y(this.spec.moon[1]) * 4 + 8, -30); this.moon.scale.set(14, 14, 1); } else this.moon.visible = false;
    this.zoom = 0; this.items = items; this.fx = null; this.fT = 0;
    items.forEach(it => {
      const bld = B[it.a]; let a = null;
      if (bld) { CUR = []; try { a = bld(it, this); } catch (e) { console.warn('3d actor', it.a, e); } a = a && a.g ? a : null; if (a) { a.mats = CUR; a.born = null; a.it = it; a.g.visible = false; this.world.add(a.g); this.acts.push(a); } CUR = null; }
      else if (it) this.acts.push({ g: new T.Group(), mats: [], born: null, it, dead: true });
    });
    this.show(0);
  }
  show(w) { const now = performance.now() / 1000; if (w > this.reveal) this.reveal = w; this.acts.forEach(a => { if (a.born == null && a.it.w <= this.reveal) { a.born = now; a.fin = false; if (a.it.a !== 'cast' && a.it.x !== undefined && w < 99) { this.fx = X(a.it.x); this.fT = now; } if (this.onBorn) try { this.onBorn(a.it); } catch (e) { } } }); }
  all() { this.show(99); }
  start() { if (!this.running) { this.running = true; requestAnimationFrame(this._raf); } }
  stop() { this.running = false; }
  _raf(ts) { if (!this.running) return; requestAnimationFrame(this._raf); const cv = this.r && this.r.domElement; if (!this._io && window.IntersectionObserver && cv) { this._vis = true; this._io = new IntersectionObserver(en => { this._vis = en[0].isIntersecting; }); this._io.observe(cv); } if (document.hidden || this._vis === false || (window.__fahmCovered && window.__fahmCovered())) return; const big = cv && cv.closest && cv.closest('.big'); if (!big && ts && this._lt && ts - this._lt < 30) return; this._lt = ts; try { this.draw(); } catch (e) { console.warn('story draw', e); } }
  draw() {
    const now = performance.now() / 1000, G = (performance.now() - this.t0) / 1000;
    this.acts.forEach(a => {
      if (a.born == null || a.dead) return; const t = now - a.born, A = ease(t / 0.9);
      a.g.visible = A > 0.001;
      if (A < 1 || !a.fin) {
        a.mats.forEach(m => { m.opacity = m.userData.base * A; });
        if (A >= 1) { a.fin = true; a.mats.forEach(m => { const bs = m.userData.base; if (!m.userData.add && bs >= 1) { m.transparent = false; m.opacity = 1; m.needsUpdate = true; } }); }
      }
      if (a.u) a.u(t, A, G, now);
    });
    /* cinematic camera: slow push-in + gentle sway */
    /* Build 33: the camera follows the story — it eases toward whatever the current word brought in, with a short push-in on each new beat */
    if (this.cfx == null) this.cfx = 0; const tfx = this.fx != null ? Math.max(-3.2, Math.min(3.2, this.fx * .55)) : 0; this.cfx += (tfx - this.cfx) * .045; const bump = this.fT ? Math.exp(-(now - this.fT) / 1.6) : 0;
    const asp = this.aspect, zc = 9 * Math.pow(1.333 / Math.max(asp, .72), .85) - Math.min(G, 18) * .045 - bump * .9, sw = Math.sin(G * .17) * .45 + this.cfx, cam = this.cam;
    cam.position.set(sw, 2.3 + Math.sin(G * .11) * .12, zc); cam.lookAt(sw * .35, 1.5 + (asp < 1 ? .5 : 0), 0);
    if (this.stars.visible) this.stars.rotation.y = G * .004;
    this.r.render(this.sc, cam);
  }
}
Story.ok = ok; Story.helpers = { T, K, X, Y, Z, TAU, clamp, ease, mix, fr, hs, col, TX, M, G_, mesh, sprite, pts, light, reg, cur: () => CUR };
window.FahmStory = Story;
})();

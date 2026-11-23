/* Fahm "Tafsiri kahani" — cinematic story, Build 34.
   Every word of the ayah gets its own shot: a realistic photograph (made with Meta AI) chosen from the word's root / meaning,
   with its own camera move. Inside a word the camera steps forward letter by letter while the Arabic word is written
   letter by letter, so the picture moves on with each harf. Particles (rain, embers, dust, stars, light rays, mist, petals)
   come from the concept. Words without their own picture (particles, pronouns) carry the previous shot further. */
(function () {
'use strict';
const TAU = Math.PI * 2, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), mix = (a, b, t) => a + (b - a) * t;
const eio = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, eo = t => 1 - Math.pow(1 - t, 3);
function hs(a, b, c) { let h = 2166136261 ^ (a * 374761393) ^ ((b || 0) * 668265263) ^ ((c || 0) * 2246822519); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
const strip = s => String(s || '').replace(/[ً-ٰٟۖ-ۭ࣓-ࣿـ]/g, '');

let MAP = null, MAPP = null;
function loadMap() { if (MAPP) return MAPP; MAPP = fetch('q/cine.json').then(r => r.json()).then(j => { MAP = { c: j.c.map(x => ({ id: x[0], roots: new Set(x[1]), rx: new RegExp(x[2], 'i'), fx: x[3] })), n: j.n || {} }; MAP.byId = {}; MAP.c.forEach(c => MAP.byId[c.id] = c); return MAP; }).catch(() => null); return MAPP; }
loadMap();

function conceptOf(w) {
  if (!MAP || !w) return null; const g = String(w.en || '');
  for (const c of MAP.c) if (MAP.n[c.id] && c.rx.test(g)) return c.id;
  if (w.root) for (const c of MAP.c) if (MAP.n[c.id] && c.roots.has(w.root)) return c.id;
  return null;
}

const IMG = new Map();
function img(src) { let e = IMG.get(src); if (!e) { e = new Image(); e.decoding = 'async'; e.src = src; IMG.set(src, e); if (IMG.size > 40) { const k = IMG.keys().next().value; IMG.delete(k); } } return e; }
const srcOf = (cid, v) => `story/img/${cid}_${v}.webp`;

class Cine {
  constructor(cv) {
    this.cv = cv; this.c = cv.getContext('2d', { alpha: false }); this.spec = { items: [] }; this.reveal = -1; this.running = false;
    this.plan = null; this.cur = -1; this.shot = null; this.prev = null; this.pt = []; this.lastL = -1; this.flash = 0; this.idleT = 0;
    this._raf = this._raf.bind(this); this.resize();
  }
  static ok() { return !!document.createElement('canvas').getContext('2d'); }
  resize() { const b = this.cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 1.5); this.w = Math.max(2, Math.round(b.width * d)); this.h = Math.max(2, Math.round(b.height * d)); this.cv.width = this.w; this.cv.height = this.h; this.d = d; }
  start() { if (this.running) return; this.running = true; requestAnimationFrame(this._raf); }
  stop() { this.running = false; }
  set(spec) { this.spec = spec || { items: [] }; this.plan = null; this.cur = -1; this.reveal = -1; this.prev = this.shot; this.shot = null; this.pt = []; }
  all() { this.reveal = 99; this.idleT = performance.now() / 1000; }
  show(i) { if (i < 0) return; this.reveal = i; this.go(i); }
  key() { try { const F = window.__fahm, st = F.st, D = typeof F.D === 'function' ? F.D() : F.D, S = D.surahs[st.s], A = S.ayat[st.a]; return { S, A }; } catch (e) { return null; } }
  build() {
    if (!MAP) return null; const k = this.key(); if (!k) return null; const { S, A } = k, W = A.words || [];
    const ids = W.map(conceptOf); let first = ids.find(Boolean) || 'signs';
    let prev = null; const shots = [];
    W.forEach((w, i) => {
      const own = ids[i], cid = own || prev || first, vs = MAP.n[cid] || [0], n = vs.length, r = (j) => hs(S.n * 1000 + A.v, i + 1, j);
      const cont = !own && shots.length && shots[shots.length - 1].cid === cid;
      const L = Math.max(1, strip(w.ar).replace(/\s/g, '').length);
      let s;
      if (cont) { const p = shots[shots.length - 1]; s = { cid, v: p.v, z0: p.z1, z1: Math.min(1.75, p.z1 + .08 + r(1) * .08), fx0: p.fx1, fy0: p.fy1, fx1: clamp(p.fx1 + (r(2) - .5) * .18, .25, .75), fy1: clamp(p.fy1 + (r(3) - .5) * .12, .3, .7), L, ar: w.ar, own: false }; }
      else { const z0 = 1.04 + r(1) * .1, dir = r(4) < .5 ? 1 : -1; s = { cid, v: vs[Math.floor(r(0) * n) % n], z0, z1: z0 + .14 + r(5) * .16, fx0: .5 - dir * (.06 + r(2) * .08), fy0: .45 + (r(3) - .5) * .1, fx1: .5 + dir * (.06 + r(6) * .08), fy1: .5 + (r(7) - .5) * .1, L, ar: w.ar, own: !!own }; }
      shots.push(s); prev = cid;
    });
    shots.forEach(s => img(srcOf(s.cid, s.v)));
    return { key: S.n + ':' + A.v, shots };
  }
  go(i) {
    if (!this.plan) this.plan = this.build(); if (!this.plan) return; const s = this.plan.shots[Math.min(i, this.plan.shots.length - 1)]; if (!s || s === this.shot) return;
    const now = performance.now() / 1000; this.prev = this.shot ? Object.assign({}, this.shot, { tEnd: now }) : this.prev; this.shot = Object.assign({}, s, { t0: now, i }); this.cur = i; this.lastL = -1;
    const nx = this.plan.shots[i + 1]; if (nx) img(srcOf(nx.cid, nx.v));
    if (this.onBorn) try { this.onBorn({ a: s.cid }); } catch (e) { }
  }
  _raf(ts) {
    if (!this.running) return; requestAnimationFrame(this._raf);
    if (document.hidden || (window.__fahmCovered && window.__fahmCovered())) return;
    const r = this.cv.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    if (ts && this._lt && ts - this._lt < 30) return; this._lt = ts;
    if (Math.abs(r.width * this.d - this.w) > 2 || Math.abs(r.height * this.d - this.h) > 2) this.resize();
    try { this.draw(); } catch (e) { }
  }
  frame(s, now, alpha) {
    const c = this.c, W = this.w, H = this.h, im = img(srcOf(s.cid, s.v)); if (!im.complete || !im.naturalWidth) return false;
    const dur = Math.max(1.1, s.L * .16 + .5), p = clamp((now - s.t0) / dur);
    /* camera steps forward letter by letter */
    const lf = p * s.L, li = Math.floor(lf), fr = lf - li, step = (li + eo(clamp(fr * 2.2))) / s.L, k = s.own ? step : eio(p);
    const drift = Math.max(0, now - s.t0 - dur) * .006, z = mix(s.z0, s.z1, k) + drift, fx = mix(s.fx0, s.fx1, k), fy = mix(s.fy0, s.fy1, k);
    const iw = im.naturalWidth, ih = im.naturalHeight, base = Math.max(W / iw, H / ih) * z, dw = iw * base, dh = ih * base;
    const x = clamp(W / 2 - fx * dw, W - dw, 0), y = clamp(H / 2 - fy * dh, H - dh, 0);
    c.globalAlpha = alpha; c.drawImage(im, x, y, dw, dh); c.globalAlpha = 1; return { li, p, fx: (fx * dw + x) / W, fy: (fy * dh + y) / H };
  }
  draw() {
    const c = this.c, W = this.w, H = this.h, now = performance.now() / 1000;
    if (!this.plan) { this.plan = this.build(); if (this.plan && this.cur < 0) this.go(this.reveal >= 0 && this.reveal < 99 ? this.reveal : 0); }
    if (this.reveal >= 99 && this.plan) { const s = this.shot, dur = s ? Math.max(1.1, s.L * .16 + .5) + 1.1 : 0; if (!s || now - s.t0 > dur) this.go(s ? (s.i + 1) % this.plan.shots.length : 0); }
    c.fillStyle = '#07090f'; c.fillRect(0, 0, W, H);
    const s = this.shot; let st = null;
    if (s) {
      const ft = clamp((now - s.t0) / .55), same = this.prev && this.prev.cid === s.cid && this.prev.v === s.v;
      if (this.prev && ft < 1 && !same) this.frame(Object.assign({}, this.prev, { t0: this.prev.t0 }), now, 1);
      st = this.frame(s, now, same ? 1 : eio(ft)) || (this.prev ? this.frame(this.prev, now, 1) : null);
    }
    /* colour grade + vignette */
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(10,6,20,.18)'); g.addColorStop(.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,6,16,.55)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    g = c.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (s && st) {
      /* a soft golden pulse on every new letter */
      if (st.li !== this.lastL && st.li < s.L) { this.lastL = st.li; this.flash = now; }
      const fa = Math.max(0, 1 - (now - this.flash) / .35) * .22; if (fa > .01) { const gx = st.fx * W, gy = st.fy * H; g = c.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * .45); g.addColorStop(0, `rgba(255,214,140,${fa})`); g.addColorStop(1, 'rgba(255,214,140,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; }
      this.fx(MAP && MAP.byId[s.cid] ? MAP.byId[s.cid].fx : '', now);
      this.word(s, st);
    }
  }
  fx(kind, now) {
    if (!kind) return; const c = this.c, W = this.w, H = this.h, d = this.d;
    if (this.ptKind !== kind) { this.ptKind = kind; this.pt = []; const n = kind === 'rays' ? 6 : kind === 'mist' ? 7 : kind === 'rain' ? 90 : 46; for (let i = 0; i < n; i++) this.pt.push({ x: Math.random(), y: Math.random(), s: Math.random(), p: Math.random() * TAU }); }
    c.save();
    if (kind === 'rain') { c.strokeStyle = 'rgba(190,220,255,.35)'; c.lineWidth = 1.2 * d; c.beginPath(); this.pt.forEach(q => { const y = ((q.y + now * (1.1 + q.s)) % 1.1) - .05, x = q.x + y * .05; c.moveTo(x * W, y * H); c.lineTo((x + .006) * W, y * H + 18 * d); }); c.stroke(); }
    else if (kind === 'embers' || kind === 'dust' || kind === 'petals') {
      c.globalCompositeOperation = kind === 'embers' ? 'lighter' : 'source-over';
      this.pt.forEach(q => { const up = kind === 'embers' ? -1 : kind === 'petals' ? .35 : -.15, y = (((q.y + up * now * (.04 + q.s * .06)) % 1) + 1) % 1, x = (q.x + Math.sin(now * .6 + q.p) * .02 + now * .008 * (kind === 'dust' ? 1 : 0)) % 1, r = (kind === 'petals' ? 2.6 : 1.4 + q.s * 1.8) * d;
        c.fillStyle = kind === 'embers' ? `rgba(255,${120 + q.s * 90 | 0},40,${.5 + .5 * Math.sin(now * 3 + q.p)})` : kind === 'petals' ? 'rgba(255,215,225,.75)' : `rgba(240,214,160,${.25 + q.s * .3})`; c.beginPath(); c.arc(x * W, y * H, r, 0, TAU); c.fill(); });
    } else if (kind === 'stars') { c.globalCompositeOperation = 'lighter'; this.pt.forEach(q => { const a = .3 + .7 * Math.max(0, Math.sin(now * (1 + q.s * 2) + q.p)); c.fillStyle = `rgba(220,235,255,${a * .8})`; c.fillRect(q.x * W, q.y * H * .6, 1.6 * d, 1.6 * d); }); }
    else if (kind === 'rays') { c.globalCompositeOperation = 'lighter'; this.pt.forEach((q, i) => { const a = .05 + .05 * Math.sin(now * .7 + q.p), x0 = W * (.2 + q.x * .6); c.fillStyle = `rgba(255,226,160,${a})`; c.beginPath(); c.moveTo(x0 - W * .02, 0); c.lineTo(x0 + W * .02, 0); c.lineTo(x0 + W * (.12 + q.s * .1), H); c.lineTo(x0 - W * (.02 + q.s * .06), H); c.fill(); }); }
    else if (kind === 'mist') { this.pt.forEach(q => { const x = ((q.x + now * .015 * (q.s + .3)) % 1.4) - .2, y = .45 + q.y * .5; const g = c.createRadialGradient(x * W, y * H, 0, x * W, y * H, W * .35); g.addColorStop(0, 'rgba(200,210,225,.13)'); g.addColorStop(1, 'rgba(200,210,225,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }); }
    c.restore();
  }
  word(s, st) {
    /* the Arabic word is written letter by letter at the bottom, in gold */
    const c = this.c, W = this.w, H = this.h, d = this.d; const ar = String(s.ar || ''); if (!ar) return;
    const n = Math.min(s.L, st.li + 1), parts = []; let cnt = 0, cut = ar.length;
    for (let i = 0; i < ar.length; i++) { if (!/[ً-ٰٟۖ-ۭ࣓-ࣿـ\s]/.test(ar[i])) { cnt++; if (cnt > n) { cut = i; break; } } }
    const shown = ar.slice(0, cut), fs = Math.round(Math.min(W * .11, H * .16));
    c.save(); c.font = `${fs}px DKIP, AmiriQ, serif`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.direction = 'rtl';
    const y = H - Math.max(14 * d, H * .07); c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 18 * d;
    c.fillStyle = 'rgba(243,217,139,.18)'; c.fillText(ar, W / 2, y);
    c.shadowBlur = 22 * d; c.shadowColor = 'rgba(220,171,64,.8)'; c.fillStyle = '#ffe9b0'; c.fillText(shown, W / 2 + (c.measureText(ar).width - c.measureText(shown).width) / 2, y);
    c.restore();
  }
}
Cine.loadMap = loadMap; Cine.conceptOf = conceptOf;
window.FahmCine = Cine;
})();

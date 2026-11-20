/* Fahm opening animation + generated sound (no asset files). Gold geometric star draws itself, calligraphy appears, soft chimes. */
(function () {
'use strict';
const D = document, TAU = Math.PI * 2;
let sfx = 1, ui = 'ru'; try { const s = JSON.parse(localStorage.getItem('fahm.v1') || '{}'); if (s.sfx != null) sfx = +s.sfx; if (s.ui) ui = s.ui; } catch (e) { }
const TAG = { ur: 'قرآن کو لفظ بہ لفظ سمجھیں', ru: 'Quran ko lafz ba lafz samjhein', en: 'Understand the Quran, word by word' }[ui] || '';
const EMB = '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs>\n<radialGradient id="eg1" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5a1426"/><stop offset=".7" stop-color="#2a0a14"/><stop offset="1" stop-color="#1a050c"/></radialGradient>\n<linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".55" stop-color="#e8b84a"/><stop offset="1" stop-color="#a8761f"/></linearGradient>\n<linearGradient id="eg3" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#33cbe0" stop-opacity=".75"/><stop offset="1" stop-color="#33cbe0" stop-opacity="0"/></linearGradient>\n<linearGradient id="eg4" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#e8b84a" stop-opacity="0"/></linearGradient>\n<filter id="egl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>\n<circle cx="200" cy="200" r="192" fill="none" stroke="#dcab40" stroke-width="2.2" filter="url(#egl)"/>\n<circle cx="200" cy="200" r="182" fill="none" stroke="#33cbe0" stroke-width="1" stroke-dasharray="2 7" stroke-linecap="round" opacity=".8"/>\n<g fill="none" stroke="#dcab40" stroke-width="2.2" filter="url(#egl)"><rect x="82" y="82" width="236" height="236" transform="rotate(0 200 200)"/><rect x="82" y="82" width="236" height="236" transform="rotate(45 200 200)"/></g>\n<g fill="none" stroke="#33cbe0" stroke-width="1.2" opacity=".85"><circle cx="200" cy="200" r="118"/><path d="M318.0 200.0 Q347.0 229.8 308.7 246.0"/><path d="M309.0 245.2 Q324.4 283.8 282.8 284.0"/><path d="M283.4 283.4 Q282.9 325.0 244.4 309.3"/><path d="M245.2 309.0 Q228.7 347.2 199.1 318.0"/><path d="M200.0 318.0 Q170.2 347.0 154.0 308.7"/><path d="M154.8 309.0 Q116.2 324.4 116.0 282.8"/><path d="M116.6 283.4 Q75.0 282.9 90.7 244.4"/><path d="M91.0 245.2 Q52.8 228.7 82.0 199.1"/><path d="M82.0 200.0 Q53.0 170.2 91.3 154.0"/><path d="M91.0 154.8 Q75.6 116.2 117.2 116.0"/><path d="M116.6 116.6 Q117.1 75.0 155.6 90.7"/><path d="M154.8 91.0 Q171.3 52.8 200.9 82.0"/><path d="M200.0 82.0 Q229.8 53.0 246.0 91.3"/><path d="M245.2 91.0 Q283.8 75.6 284.0 117.2"/><path d="M283.4 116.6 Q325.0 117.1 309.3 155.6"/><path d="M309.0 154.8 Q347.2 171.3 318.0 200.9"/></g>\n<circle cx="200" cy="200" r="104" fill="url(#eg1)" stroke="#dcab40" stroke-width="2"/>\n<circle cx="200" cy="200" r="97" fill="none" stroke="#dcab40" stroke-width=".8" opacity=".6"/>\n<g opacity=".95"><path d="M200 168 L132 40 L150 40Z" fill="url(#eg4)" opacity=".0"/>\n<path d="M200 166 L150 62 L168 58Z M200 166 L188 52 L206 52Z M200 166 L232 58 L250 62Z M200 166 L112 96 L124 108Z M200 166 L288 96 L276 108Z" fill="url(#eg3)" opacity=".0"/></g>\n<g filter="url(#egl)"><path d="M200 150 L166 74 L180 72Z M200 150 L194 58 L206 58Z M200 150 L220 72 L234 74Z M200 150 L132 100 L140 112Z M200 150 L268 100 L260 112Z" fill="url(#eg4)" opacity=".85"/></g>\n<g stroke="#dcab40" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M128 252 L200 276 L272 252"/><path d="M158 262 L142 292 M242 262 L258 292 M200 276 L200 296"/></g>\n<path d="M200 244 C170 226 136 224 112 232 L112 164 C136 156 170 158 200 174 Z" fill="url(#eg2)" stroke="#fff1c4" stroke-width="1.2"/>\n<path d="M200 244 C230 226 264 224 288 232 L288 164 C264 156 230 158 200 174 Z" fill="url(#eg2)" stroke="#fff1c4" stroke-width="1.2"/>\n<g stroke="#7a1a2c" stroke-width="1.5" stroke-linecap="round" opacity=".75"><path d="M122 176 C142 172 166 176 190 188M122 190 C142 186 166 190 190 202M122 204 C142 200 166 204 190 216M122 218 C142 214 166 218 190 230M278 176 C258 172 234 176 210 188M278 190 C258 186 234 190 210 202M278 204 C258 200 234 204 210 216M278 218 C258 214 234 218 210 230"/></g>\n<path d="M200 174 L200 244" stroke="#7a1a2c" stroke-width="2.2"/>\n<g fill="#fff1c4" filter="url(#egl)"><circle cx="150" cy="120" r="2.2"/><circle cx="252" cy="110" r="2"/><circle cx="200" cy="96" r="2.6"/><circle cx="116" cy="150" r="1.6"/><circle cx="286" cy="146" r="1.8"/></g>\n</svg>';
const el = D.createElement('div'); el.id = 'splash';
el.innerHTML = '<canvas></canvas><div class="sp-em">'+EMB+'</div><div class="sp-txt"><div class="sp-ar">فہم القرآن</div><div class="sp-en">FAHMUL QURAAN</div><div class="sp-by">by Quranic Science</div><div class="sp-tag"></div></div><div class="sp-skip"></div>';
el.querySelector('.sp-tag').textContent = TAG;
D.body.appendChild(el);
const cv = el.querySelector('canvas'), g = cv.getContext('2d'); let W = 0, H = 0, dpr = 1;
function fit() { dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
fit(); addEventListener('resize', fit);
const GOLD = [220, 171, 64], CY = [51, 203, 224], MR = [122, 26, 44];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }, seg = (t, a, b) => ease((t - a) / (b - a));
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const P = []; for (let i = 0; i < 70; i++) { const a = rnd() * TAU, r = .5 + rnd() * .7; P.push({ a, r, s: .3 + rnd() * 1.4, c: rnd() > .55 ? CY : GOLD, ph: rnd() * 6 }); }
function poly(n, R, rot, k) { const pts = []; for (let i = 0; i < n; i++) { const a = rot + i * TAU / n; pts.push([Math.cos(a) * R, Math.sin(a) * R]); } return pts; }
function strokePart(pts, p, close) { /* draw polyline progressively up to fraction p */ const n = pts.length - (close ? 0 : 1); const tot = n * p; g.beginPath(); for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if (i > tot) break; const f = Math.min(1, tot - i); if (i === 0) g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); } g.stroke(); }
const DUR = 4.1; let t0 = 0, raf = 0, done = false;
function draw(t) {
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H * .42, S = Math.min(W, H) * .30, glow = seg(t, 0, 1.6);
  const bg = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .75); bg.addColorStop(0, rgba(MR, .55 * glow + .05)); bg.addColorStop(.5, 'rgba(40,8,18,' + (.5 * glow + .1) + ')'); bg.addColorStop(1, 'rgba(15,5,8,1)'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.save(); g.translate(cx, cy);
  /* dust drifting inward */
  P.forEach(p => { const k = seg(t, 0, 2.2), rr = (p.r * (1.5 - .75 * k)) * S * 1.6, a = p.a + t * .15 * p.s, x = Math.cos(a) * rr, y = Math.sin(a) * rr, al = Math.min(1, t * .8) * (.25 + .45 * Math.sin(t * 2 + p.ph) ** 2) * (1 - seg(t, 2.6, 3.4) * .6); g.fillStyle = rgba(p.c, al); g.beginPath(); g.arc(x, y, 1 + p.s * .9, 0, TAU); g.fill(); });
  g.lineCap = 'round'; g.lineJoin = 'round';
  const pulse = 1 + .018 * Math.sin(Math.max(0, t - 2) * 4) * seg(t, 2, 2.4) * (1 - seg(t, 3, 3.6));
  g.scale(pulse, pulse);
  /* light burst */
  const bt = seg(t, 1.9, 2.5) * (1 - seg(t, 2.5, 3.4)); if (bt > 0) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, S * 1.5); gr.addColorStop(0, rgba([255, 240, 200], .75 * bt)); gr.addColorStop(.4, rgba(GOLD, .28 * bt)); gr.addColorStop(1, rgba(GOLD, 0)); g.shadowBlur = 0; g.fillStyle = gr; g.beginPath(); g.arc(0, 0, S * 1.5, 0, TAU); g.fill(); }
  g.restore();
  const em = el.querySelector('.sp-em'), ep = seg(t, .2, 1.6); em.style.opacity = ep * (1 - seg(t, DUR - .6, DUR)); em.style.transform = `translate(-50%,-50%) scale(${.86 + .14 * ep + .012 * Math.sin(t * 2.2)})`; em.style.top = cy + 'px'; em.style.width = em.style.height = (S * 2.5) + 'px';
  /* text */
  const tt = el.querySelector('.sp-txt'), ta = seg(t, 2.0, 2.8); tt.style.opacity = ta * (1 - seg(t, DUR - .6, DUR)); tt.style.transform = `translateY(${(1 - ta) * 14}px)`; tt.style.top = (cy + S * 1.28) + 'px';
}
function loop(now) { if (done) return; if (!t0) t0 = now; const t = (now - t0) / 1000; draw(t); el.style.opacity = t > DUR - .55 ? Math.max(0, (DUR - t) / .55) : 1; if (t >= DUR) return finish(); raf = requestAnimationFrame(loop); }
function finish() { if (done) return; done = true; cancelAnimationFrame(raf); el.remove(); D.documentElement.classList.remove('splashing'); window.dispatchEvent(new Event('fahm-splash-done')); }
D.documentElement.classList.add('splashing');
el.addEventListener('click', () => { if (!audioOn) startAudio(true); else finish(); });
/* ---------- sound ---------- */
let AC = null, audioOn = false;
function startAudio(late) {
  if (sfx === 0) return; const level = sfx === 2 ? .5 : .3;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime + .05, off = late ? 1.7 : 0, master = AC.createGain(); master.gain.value = level; master.connect(AC.destination);
    const len = AC.sampleRate * 2.6, ir = AC.createBuffer(2, len, AC.sampleRate); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    const rev = AC.createConvolver(); rev.buffer = ir; const rg = AC.createGain(); rg.gain.value = .55; rev.connect(rg); rg.connect(master);
    const dry = AC.createGain(); dry.gain.value = .8; dry.connect(master); const bus = AC.createGain(); bus.connect(dry); bus.connect(rev);
    const tone = (f, st, dur, vol, type, hp) => { const o = AC.createOscillator(), gn = AC.createGain(); o.type = type || 'sine'; o.frequency.value = f; const s = Math.max(t, t + st - off); gn.gain.setValueAtTime(0, s); gn.gain.linearRampToValueAtTime(vol, s + (hp || .012)); gn.gain.exponentialRampToValueAtTime(.0001, s + dur); o.connect(gn); gn.connect(bus); o.start(s); o.stop(s + dur + .1); };
    /* pad swell */
    if (!late) [[110, .0], [164.81, .15], [220, .3]].forEach(([f, d]) => { const o = AC.createOscillator(), o2 = AC.createOscillator(), gn = AC.createGain(), lp = AC.createBiquadFilter(); o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 1.004; lp.type = 'lowpass'; lp.frequency.value = 700; gn.gain.setValueAtTime(0, t + d); gn.gain.linearRampToValueAtTime(.09, t + 1.8); gn.gain.linearRampToValueAtTime(.12, t + 2.6); gn.gain.exponentialRampToValueAtTime(.0001, t + 4.3); o.connect(lp); o2.connect(lp); lp.connect(gn); gn.connect(bus); o.start(t + d); o2.start(t + d); o.stop(t + 4.5); o2.stop(t + 4.5); });
    /* bells: A minor pentatonic rising, then chord */
    const N = [[.55, 440], [.95, 523.25], [1.32, 659.25], [1.7, 880], [2.05, 1318.5]];
    if (!late) N.forEach(([s, f]) => { tone(f, s, 2.2, .16, 'sine'); tone(f * 2.01, s, 1.2, .05, 'sine'); tone(f * 3.99, s, .5, .02, 'sine'); });
    tone(220, 2.35, 2.6, .12, 'sine'); tone(329.63, 2.35, 2.6, .1, 'sine'); tone(440, 2.35, 2.8, .12, 'sine'); tone(659.25, 2.4, 3, .08, 'sine'); tone(880, 2.45, 3, .06, 'sine');
    /* shimmer burst */
    if (!late) { const nb = AC.createBuffer(1, AC.sampleRate * 1.2, AC.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; const ns = AC.createBufferSource(); ns.buffer = nb; const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2; bp.frequency.setValueAtTime(900, t + 1.7); bp.frequency.exponentialRampToValueAtTime(7000, t + 2.7); const ng = AC.createGain(); ng.gain.setValueAtTime(0, t + 1.7); ng.gain.linearRampToValueAtTime(.05, t + 2.2); ng.gain.exponentialRampToValueAtTime(.0001, t + 2.9); ns.connect(bp); bp.connect(ng); ng.connect(bus); ns.start(t + 1.7); ns.stop(t + 2.9); }
    audioOn = AC.state === 'running';
  } catch (e) { }
}
if (sfx !== 0) { startAudio(false); setTimeout(() => { if (AC && AC.state === 'suspended') { audioOn = false; el.querySelector('.sp-skip').textContent = '🔊'; } }, 400); }
raf = requestAnimationFrame(loop);
window.__splashSkip = finish;
})();

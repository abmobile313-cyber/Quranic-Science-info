/* Fahm opening animation + generated sound (no asset files). Gold geometric star draws itself, calligraphy appears, soft chimes. */
(function () {
'use strict';
const D = document, TAU = Math.PI * 2;
let sfx = 1, ui = 'ru'; try { const s = JSON.parse(localStorage.getItem('fahm.v1') || '{}'); if (s.sfx != null) sfx = +s.sfx; if (s.ui) ui = s.ui; } catch (e) { }
const TAG = { ur: 'قرآن کو لفظ بہ لفظ سمجھیں', ru: 'Quran ko lafz ba lafz samjhein', en: 'Understand the Quran, word by word' }[ui] || '';
const el = D.createElement('div'); el.id = 'splash';
el.innerHTML = '<canvas></canvas><div class="sp-txt"><div class="sp-ar">فہم</div><div class="sp-en">FAHM</div><div class="sp-by">by Quranic Science</div><div class="sp-tag"></div></div><div class="sp-skip"></div>';
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
  /* outer ring */
  const rings = [[1.18, .0, 1.0, GOLD, .5], [1.0, .15, 1.2, GOLD, .9], [.78, .35, 1.3, CY, .6], [.52, .55, 1.4, GOLD, .7]];
  rings.forEach(([r, a, b, c, al], i) => { const p = seg(t, a + .1, a + b); if (p <= 0) return; g.strokeStyle = rgba(c, al * (.4 + .6 * p)); g.lineWidth = 1.4; g.shadowColor = rgba(c, .9); g.shadowBlur = 10; g.beginPath(); g.arc(0, 0, S * r, -Math.PI / 2, -Math.PI / 2 + TAU * p); g.stroke(); });
  /* eight-pointed star: two squares */
  [0, Math.PI / 4].forEach((rot, i) => { const p = seg(t, .5 + i * .35, 1.9 + i * .35); if (p <= 0) return; const pts = poly(4, S * .98, rot - Math.PI / 4, 0); g.strokeStyle = rgba(GOLD, .95); g.lineWidth = 2.2; g.shadowColor = rgba(GOLD, .95); g.shadowBlur = 16; strokePart(pts.concat([pts[0]]), p, false); });
  /* inner petals / girih */
  const pp = seg(t, 1.3, 2.6); if (pp > 0) { g.strokeStyle = rgba(CY, .75 * pp); g.lineWidth = 1.2; g.shadowColor = rgba(CY, .9); g.shadowBlur = 8; for (let i = 0; i < 16; i++) { const a = i * TAU / 16 + Math.PI / 16, r1 = S * .52, r2 = S * (.52 + .26 * pp); g.beginPath(); g.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); g.quadraticCurveTo(Math.cos(a + .18) * (r1 + r2) / 2, Math.sin(a + .18) * (r1 + r2) / 2, Math.cos(a) * r2, Math.sin(a) * r2); g.stroke(); } }
  /* light burst */
  const bt = seg(t, 1.9, 2.5) * (1 - seg(t, 2.5, 3.4)); if (bt > 0) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, S * 1.5); gr.addColorStop(0, rgba([255, 240, 200], .75 * bt)); gr.addColorStop(.4, rgba(GOLD, .28 * bt)); gr.addColorStop(1, rgba(GOLD, 0)); g.shadowBlur = 0; g.fillStyle = gr; g.beginPath(); g.arc(0, 0, S * 1.5, 0, TAU); g.fill(); }
  g.restore();
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

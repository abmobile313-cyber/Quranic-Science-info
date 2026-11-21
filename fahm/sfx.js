/* Fahm soft sound effects: tiny, synthesised with WebAudio (no files, free). Kept very quiet so tilawat stays clear. */
(function () {
'use strict';
const AC = window.AudioContext || window.webkitAudioContext; let ac = null, master = null, bed = null, nb = null, level = 1, last = 0;
const LV = [0, .09, .18];
function init() { if (ac) return ac; if (!AC) return null; try { ac = new AC(); master = ac.createGain(); master.gain.value = LV[level]; const cp = ac.createDynamicsCompressor(); master.connect(cp); cp.connect(ac.destination);
  nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = nb.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { b = b * .97 + (Math.random() * 2 - 1) * .03; d[i] = b * 8; } } catch (e) { ac = null; } return ac; }
function noise(loop) { const s = ac.createBufferSource(); s.buffer = nb; s.loop = !!loop; return s; }
function env(g, t, a, hold, r, peak) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, t + a + hold); g.gain.exponentialRampToValueAtTime(.0001, t + a + hold + r); }
function tone(f, dur, peak, type, t0) { const t = t0 || ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.value = f; env(g, t, .02, 0, dur, peak); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .1); }
function band(f, q, dur, peak, sweep, hp) { const t = ac.currentTime, s = noise(), flt = ac.createBiquadFilter(), g = ac.createGain(); flt.type = hp ? 'highpass' : 'bandpass'; flt.frequency.setValueAtTime(f, t); if (sweep) flt.frequency.exponentialRampToValueAtTime(sweep, t + dur); flt.Q.value = q; env(g, t, dur * .3, 0, dur * .7, peak); s.connect(flt); flt.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + .1); }
const PENT = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
const CUES = {
  chime() { const f = PENT[Math.floor(Math.random() * PENT.length)]; tone(f, 1.6, .28); tone(f * 2, 1.1, .08); },
  sparkle() { for (let i = 0; i < 4; i++) tone(PENT[(Math.random() * 6) | 0] * 2, .5, .08, 'sine', ac.currentTime + i * .09); },
  crackle() { for (let i = 0; i < 9; i++) setTimeout(() => ac && band(2500 + Math.random() * 3000, 2, .06, .35, 0, true), i * (90 + Math.random() * 160)); band(180, .6, 2.2, .18); },
  whoosh() { band(500, 1.2, 1.1, .3, 2400); },
  rumble() { tone(55, 1.6, .35, 'sine'); band(120, .8, 1.6, .16); },
  water() { band(900, .5, 2.6, .12, 500); },
  swell() { tone(110, 2.2, .26, 'triangle'); tone(165, 2.2, .12, 'sine'); },
  drone() { tone(65, 2.4, .26, 'sine'); band(200, .6, 2.2, .1); },
  tone() { tone(196, 2.2, .24); tone(293.66, 2.2, .1); }
};
const MAP = { bloom: 'chime', beam: 'chime', core: 'chime', pulse: 'chime', crown: 'chime', orbits: 'chime', beads: 'chime', sun: 'chime', shield: 'chime', scales: 'chime', rain: 'sparkle', frost: 'sparkle', coins: 'sparkle', flames: 'crackle', firewood: 'crackle', hand: 'crackle', stones: 'whoosh', birds: 'whoosh', elephants: 'rumble', camels: 'rumble', river: 'water', gate: 'swell', dark: 'drone', smoke: 'drone', haze: 'drone', kaaba: 'tone', dome: 'tone', split: 'swell', dawnsplit: 'swell', path: 'whoosh' };
const F = window.FahmSfx = {
  setLevel(l) { level = l; if (master) master.gain.setTargetAtTime(LV[l], ac.currentTime, .1); if (!l) F.stop(); },
  level() { return level; },
  unlock() { if (init() && ac.state === 'suspended') ac.resume(); },
  cue(kind) { if (!level || !init()) return; const c = CUES[MAP[kind]], now = performance.now(); if (!c || now - last < 260) return; last = now; try { c(); } catch (e) { } },
  start(sky) { if (!level || !init()) return; F.stop(); const t = ac.currentTime, s = noise(true), f = ac.createBiquadFilter(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
    f.type = 'lowpass'; f.frequency.value = sky === 'day' ? 700 : sky === 'fire' ? 420 : 320; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(sky === 'void' ? .12 : .3, t + 2);
    l.frequency.value = .12; lg.gain.value = .09; l.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(master); s.start(); l.start(); bed = { s, g, l }; },
  stop() { if (!bed || !ac) return; const b = bed; bed = null; try { b.g.gain.cancelScheduledValues(ac.currentTime); b.g.gain.setTargetAtTime(.0001, ac.currentTime, .25); setTimeout(() => { try { b.s.stop(); b.l.stop(); } catch (e) { } }, 1200); } catch (e) { } }
};
})();

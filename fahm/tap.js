/* Build 30: button-press sound effects. Synthesised with WebAudio (no files, free). Soft glass "tick";
   gold "ding" for main actions; low "thud" for close/back. Silent while Hafiz mode is on or while the user
   turned it off. Never starts audio before the first real touch (browser rule). */
(function () {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  let ac = null, master = null, last = 0;
    function lv() { try { return window.FahmSfx ? window.FahmSfx.level() : 1; } catch (e) { return 1; } }
  function on() { return lv() > 0; }
    function quiet() {
    // Hafiz (taraweeh) mode must never be disturbed
    try { if (document.body.classList.contains('hzon') || document.querySelector('#rpage.hz, .hz-on')) return true; } catch (e) { }
    try { if (window.FahmReader && window.FahmReader._hz && window.FahmReader._hz().on) return true; } catch (e) { }
    return false;
  }
  function init() {
    if (ac) return ac; if (!AC) return null;
    try {
      ac = new AC(); master = ac.createGain(); master.gain.value = .5;
      const cp = ac.createDynamicsCompressor(); master.connect(cp); cp.connect(ac.destination);
    } catch (e) { ac = null; }
    return ac;
  }
  function tone(f, dur, peak, type, delay, slide) {
    const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02);
  }
  const T = window.__sfx = {
    tick() { if (!init()) return; tone(1320, .07, .16, 'sine', 0, 980); tone(2640, .04, .05, 'sine'); },
    ding() { if (!init()) return; tone(784, .28, .17, 'sine'); tone(1175, .34, .09, 'sine', .035); tone(1568, .4, .04, 'sine', .07); },
    back() { if (!init()) return; tone(520, .09, .15, 'triangle', 0, 360); },
    toggle() { if (!init()) return; tone(988, .06, .13, 'sine'); tone(1480, .08, .1, 'sine', .05); },
    tap() { T.tick(); },
    get on() { return on(); }
  };
  const BTN = 'button, [role=button], .ib, .nb, .chip, .srow, .tab, label.sw, summary, a[href]';
  function kind(el) {
    const id = (el.id || '') + ' ' + (el.className && el.className.baseVal === undefined ? el.className : '');
    const a = (el.getAttribute('aria-label') || '') + ' ' + (el.dataset && el.dataset.a || '');
    const s = id + ' ' + a;
    if (/rPlay|play|btnPlay|bigplay/i.test(s)) return 'ding';
    if (/close|back|cancel|dismiss/i.test(s)) return 'back';
    if (/toggle|switch|\bsw\b|check/i.test(s)) return 'toggle';
    return 'tick';
  }
  function press(e) {
    if (!on() || quiet()) return;
    const el = e.target && e.target.closest && e.target.closest(BTN); if (!el) return;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('data-nosfx') || el.closest('[data-nosfx]')) return;
    const now = performance.now(); if (now - last < 70) return; last = now;
    if (!init()) return; if (ac.state === 'suspended') ac.resume();
    master.gain.value = lv() >= 2 ? .85 : .5;
    try { T[kind(el)](); } catch (err) { }
  }
  document.addEventListener('pointerdown', press, { capture: true, passive: true });
})();

/* Qaida "listen & check": the child reads, the phone's speech recogniser hears it, and we compare with the expected text.
   Works with the Android bridge (QaidaAndroid.startListen) or the browser's Web Speech API. Also: chime sounds and the teacher voice. */
(function () {
'use strict';
/* ---------- normalising and scoring ---------- */
const HAR = /[ً-ٰٟۖ-ۭـ࣓-ࣿ‌‍]/g;
function skel(s) {
  return String(s || '').replace(/[أإآٱ]/g, 'ا').replace(/[ؤ]/g, 'و').replace(/[ئ]/g, 'ي').replace(/ى|ی|ے/g, 'ي').replace(/ک/g, 'ك')
    .replace(/ہ|ھ|ة/g, 'ه').replace(HAR, '').replace(/[^ء-ي]/g, '');
}
/* expected pronunciation skeleton: short vowels become their long letter only where the sound needs one (single letters) */
const NAMES = { 'ا': ['الف', 'اليف', 'ا'], 'ب': ['باء', 'با', 'بي'], 'ت': ['تاء', 'تا', 'تي'], 'ث': ['ثاء', 'ثا', 'سا'], 'ج': ['جيم', 'جم'], 'ح': ['حاء', 'حا'], 'خ': ['خاء', 'خا'], 'د': ['دال', 'دل'], 'ذ': ['ذال', 'زال', 'ذل'], 'ر': ['راء', 'را'], 'ز': ['زاي', 'زاء', 'زا'], 'س': ['سين', 'سن'], 'ش': ['شين', 'شن'], 'ص': ['صاد', 'صد'], 'ض': ['ضاد', 'ضد'], 'ط': ['طاء', 'طا'], 'ظ': ['ظاء', 'ظا'], 'ع': ['عين', 'عن'], 'غ': ['غين', 'غن'], 'ف': ['فاء', 'فا'], 'ق': ['قاف', 'قف'], 'ك': ['كاف', 'كف'], 'ل': ['لام', 'لم'], 'م': ['ميم', 'مم'], 'ن': ['نون', 'نن'], 'و': ['واو', 'واؤ', 'وو'], 'ه': ['هاء', 'ها'], 'ء': ['همزه', 'همزة'], 'ي': ['ياء', 'يا'] };
function variants(ar) {
  const s = String(ar || '').trim(), k = skel(s), out = new Set([k]);
  const base = [...s.replace(HAR, '')].filter(c => /[ء-يکیہھے]/.test(c));
  if (base.length === 1 && !/[ً-ْٰ]/.test(s)) { (NAMES[skel(base[0])] || []).forEach(n => out.add(skel(n))); return [...out]; }
  /* syllables: map each vowel mark to a long letter, tanween to +n, so "بَ" ~ "با" / "ب" */
  let a = '', b = '';
  for (const ch of s) {
    if (/[ء-يکیہھے]/.test(ch)) { a += skel(ch); b += skel(ch); }
    else if (ch === 'َ' || ch === 'ٰ') { b += 'ا'; } else if (ch === 'ِ' || ch === 'ٖ') { b += 'ي'; } else if (ch === 'ُ' || ch === 'ٗ') { b += 'و'; }
    else if (ch === 'ً') { b += 'ن'; a += 'ن'; } else if (ch === 'ٍ') { b += 'ين'; a += 'ن'; } else if (ch === 'ٌ') { b += 'ون'; a += 'ن'; }
  }
  out.add(a); out.add(b); out.add(b.replace(/اا/g, 'ا').replace(/يي/g, 'ي').replace(/وو/g, 'و'));
  return [...out].filter(Boolean);
}
function lev(a, b) { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, j) => j); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
/* vowel quality check for short syllables: heard a different long vowel than expected -> wrong */
function vowelClash(exp, heard) {
  const v = s => (s.match(/[اوي]/g) || []).join('');
  if (exp.length > 3) return false; const ve = v(exp.slice(1)), vh = v(heard.slice(1));
  return ve && vh && ve[0] !== vh[0];
}
function score(ar, heardList) {
  const vs = variants(ar); let best = 0, bh = '';
  for (const raw of heardList) {
    const words = raw.split(/\s+/).map(skel).filter(Boolean), joined = words.join('');
    const cands = [joined, ...words];
    for (const h of cands) for (const e of vs) {
      if (!h || !e) continue;
      let r = 1 - lev(e, h) / Math.max(e.length, h.length);
      if (h.length > e.length + 2 && h.includes(e)) r = Math.max(r, .8);
      if (vowelClash(e, h)) r = Math.min(r, .4);
      if (r > best) { best = r; bh = raw; }
    }
  }
  const len = skel(ar).length, need = len <= 2 ? .5 : len <= 4 ? .6 : .66;
  return { ok: best >= need, score: best, heard: bh };
}

/* ---------- speech recognition ---------- */
let cb = null, partial = '', timer = 0, webRec = null;
const native = () => !!(window.QaidaAndroid && QaidaAndroid.startListen);
window.__qaidaSpeech = (type, text) => {
  if (!cb) return;
  if (type === 'partial') { partial = text; cb.onPartial && cb.onPartial(text.split('|')[0]); }
  else if (type === 'final') finish(text ? text.split('|') : (partial ? partial.split('|') : []));
  else if (type === 'perm') { } else if (type === 'permno') fail('mic');
  else if (type === 'permok') { const c = cb; cb = null; listen(c.ar, c).then(c.res); }
  else if (type === 'error') fail(text);
};
function finish(list) { clearTimeout(timer); const c = cb; cb = null; partial = ''; if (!c) return; c.res({ list: list || [], ...score(c.ar, list || []) }); }
function fail(why) { clearTimeout(timer); const c = cb; cb = null; if (c) c.res({ list: [], ok: false, score: 0, err: why || 'err' }); }
function available() { if (native()) { try { return QaidaAndroid.speechAvailable(); } catch (e) { return true; } } return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function listen(ar, opt) {
  opt = opt || {};
  return new Promise(res => {
    stopListen(); cb = { ar, res, onPartial: opt.onPartial }; partial = '';
    timer = setTimeout(() => { if (native()) { try { QaidaAndroid.stopListen(); } catch (e) { } } else if (webRec) try { webRec.stop(); } catch (e) { } setTimeout(() => finish(partial ? partial.split('|') : []), 400); }, opt.max || 7000);
    if (native()) { try { QaidaAndroid.startListen('ar-SA'); } catch (e) { fail('start'); } return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) { fail('nosr'); return; }
    webRec = new R(); webRec.lang = 'ar-SA'; webRec.interimResults = true; webRec.maxAlternatives = 5; webRec.continuous = false;
    webRec.onresult = e => { const r = e.results[e.results.length - 1]; const l = [...r].map(x => x.transcript); if (r.isFinal) finish(l); else { partial = l.join('|'); cb && cb.onPartial && cb.onPartial(l[0]); } };
    webRec.onerror = e => fail(e.error); webRec.onend = () => { if (cb) finish(partial ? partial.split('|') : []); };
    try { webRec.start(); } catch (e) { fail('start'); }
  });
}
function stopListen() { clearTimeout(timer); if (cb) { const c = cb; cb = null; c.res({ list: [], ok: false, score: 0, err: 'stopped' }); } try { native() ? QaidaAndroid.stopListen() : webRec && webRec.abort(); } catch (e) { } }

/* ---------- sounds (made in the phone, no files) ---------- */
let AC = null;
function tone(seq) {
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t0 = AC.currentTime + .02;
    seq.forEach(([f, d, w, at, v]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = w || 'sine'; o.frequency.setValueAtTime(f, t0 + at); g.gain.setValueAtTime(0, t0 + at); g.gain.linearRampToValueAtTime(v || .25, t0 + at + .02); g.gain.exponentialRampToValueAtTime(.001, t0 + at + d); o.connect(g).connect(AC.destination); o.start(t0 + at); o.stop(t0 + at + d + .05); });
  } catch (e) { }
}
const SFX = {
  ok: () => tone([[660, .18, 'sine', 0], [880, .22, 'sine', .12], [1320, .35, 'triangle', .24, .18]]),
  bad: () => tone([[220, .25, 'square', 0, .12], [160, .4, 'square', .2, .12]]),
  tick: () => tone([[1200, .06, 'sine', 0, .12]]),
  win: () => tone([[523, .2, 'triangle', 0], [659, .2, 'triangle', .15], [784, .2, 'triangle', .3], [1047, .5, 'triangle', .45, .3]]),
  mic: () => tone([[900, .08, 'sine', 0, .15], [1200, .1, 'sine', .08, .15]])
};

/* ---------- teacher voice (ElevenLabs clips) ---------- */
const VO = { ok: ['vo/ok1.mp3', 'vo/ok2.mp3'], bad: ['vo/bad.mp3'], again: ['vo/again.mp3'], you: ['vo/you.mp3'], listen: ['vo/listen.mp3'], done: ['vo/done.mp3'] };
const VA = new Audio(); let voOn = true;
function say(k) { return new Promise(r => { const l = VO[k]; if (!voOn || !l) return r(); VA.src = l[Math.floor(Math.random() * l.length)]; VA.onended = VA.onerror = () => r(); VA.play().catch(() => r()); setTimeout(r, 4000); }); }

/* ---------- phone TTS (fallback voice for items without a recording, and for hidayaat) ---------- */
let spokeCb = null;
window.__qaidaSpoke = ok => { const c = spokeCb; spokeCb = null; c && c(ok); };
function speak(text, lang, rate) {
  return new Promise(res => {
    if (window.QaidaAndroid && QaidaAndroid.speak) { spokeCb = res; try { QaidaAndroid.speak(text, lang, rate || .8); } catch (e) { res(false); } setTimeout(() => { if (spokeCb === res) { spokeCb = null; res(false); } }, Math.max(6000, text.length * 220)); return; }
    if (!window.speechSynthesis) return res(false);
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate || .8; const v = speechSynthesis.getVoices().find(v => v.lang.replace('_', '-').startsWith(lang.split('-')[0])); if (!v) return res(false); u.voice = v;
    u.onend = () => res(true); u.onerror = () => res(false); speechSynthesis.cancel(); speechSynthesis.speak(u);
  });
}
function stopSpeak() { try { window.QaidaAndroid && QaidaAndroid.stopSpeak ? QaidaAndroid.stopSpeak() : speechSynthesis.cancel(); } catch (e) { } spokeCb && spokeCb(false); spokeCb = null; }

window.QaidaCheck = { listen, stopListen, score, available, SFX, say, speak, stopSpeak, skel, variants, setVoice: v => voOn = v };
})();

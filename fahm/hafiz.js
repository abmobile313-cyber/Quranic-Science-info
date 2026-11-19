/* Fahm — Hafiz matching engine (pure logic, no DOM).
   Compares what the speech recogniser "heard" with the expected Quran words and reports progress / mistakes.
   Honest limits: word level only (not harakat / tajweed); quality depends on the recogniser. */
(function (root) {
  'use strict';
  const STRIP = /[ؐ-ًؚ-ٰٟۖ-ۭ࢘-࢟࣊-ࣿـ​-‏‪-‮⁦-⁩-︀-️]/g;
  const MAP = { 'ٱ': 'ا', 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ى': 'ي', 'ی': 'ي', 'ې': 'ي', 'ے': 'ي', 'ئ': 'ي', 'ؤ': 'و', 'ة': 'ه', 'ۃ': 'ه', 'ہ': 'ه', 'ھ': 'ه', 'ک': 'ك', 'ڪ': 'ك', 'گ': 'ك', 'ء': '' };
  const LET = /[ء-يٮ-ۓٱ]/;
  function norm(s) {
    s = String(s || '').replace(STRIP, ''); let o = '';
    for (const ch of s) { const m = MAP[ch]; if (m !== undefined) { o += m; continue; } if (LET.test(ch)) o += ch; }
    return o;
  }
  /* letters that recognisers often confuse; folded together only in normal / relaxed */
  const C1 = { 'ث': 'س', 'ص': 'س', 'ذ': 'ز', 'ظ': 'ز', 'ض': 'د', 'ط': 'ت' };
  const C2 = Object.assign({ 'ق': 'ك', 'ح': 'ه', 'ع': 'ا', 'غ': 'خ' }, C1);
  function fold(s, sens) { const m = sens === 'r' ? C2 : sens === 's' ? null : C1; if (!m) return s; let o = ''; for (const ch of s) o += m[ch] || ch; return o; }
  function skel(s) { const k = s.replace(/ا/g, ''); return k || s; }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]; let min = i;
      for (let j = 1; j <= b.length; j++) { const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); cur[j] = v; if (v < min) min = v; }
      if (min > max) return max + 1; prev = cur;
    }
    return prev[b.length];
  }
  function tol(L, sens) {
    if (sens === 's') return L >= 5 ? 1 : 0;
    if (sens === 'r') return L >= 6 ? 2 : (L >= 3 ? 1 : 0);
    return L >= 7 ? 2 : (L >= 4 ? 1 : 0);
  }
  function eq(a, b, sens) {
    if (a === b) return true; if (!a || !b) return false;
    a = fold(a, sens); b = fold(b, sens); if (a === b) return true;
    const A = skel(a), B = skel(b); if (A === B) return true;
    const t = tol(Math.max(A.length, B.length), sens); return t > 0 && lev(A, B, t) <= t;
  }
  const NEED = { s: 1, n: 2, r: 3 };
  const BISM = ['بسم', 'الله', 'الرحمن', 'الرحيم'];

  /* words: [{n:'normalised'}], starts: indices where a surah begins and Bismillah may be recited first */
  function Tracker(words, sens, starts) {
    this.w = words; this.p = 0; this.sens = sens || 'n'; this.bad = []; this.bm = 0;
    this.starts = starts || {}; this.bmDone = {};
  }
  Tracker.prototype.setPos = function (p) { this.p = Math.max(0, Math.min(this.w.length, p)); this.bad = []; this.bm = 0; };
  Tracker.prototype.done = function () { return this.p >= this.w.length; };
  /* tokens: normalised heard words (non-empty). fin: false when the last token may still change.
     returns {ev:[…], used:n}. Events: {t:'ok',from,to} {t:'mistake',idx,kind,heard} {t:'end'} */
  Tracker.prototype.feed = function (tok, fin) {
    const ev = [], w = this.w, sens = this.sens, need = NEED[sens] || 2; let i = 0;
    const adv = (n) => { const from = this.p; this.p += n; this.bad = []; ev.push({ t: 'ok', from, to: this.p }); };
    while (i < tok.length && this.p < w.length) {
      const h = tok[i], last = i === tok.length - 1, can = fin || !last;
      /* optional Bismillah at the start of a surah */
      if (this.starts[this.p] && !this.bmDone[this.p] && this.bm === 0 && eq(h, BISM[0], sens) && !eq(h, w[this.p].n, sens)) { this.bm = 1; i++; continue; }
      if (this.bm > 0) { this.bm++; if (this.bm >= 4) { this.bm = 0; this.bmDone[this.p] = 1; } i++; continue; }
      const e = w[this.p].n;
      if (eq(h, e, sens)) { adv(1); i++; continue; }
      if (i + 1 < tok.length && eq(h + tok[i + 1], e, sens)) { adv(1); i += 2; continue; }
      if (this.p + 1 < w.length && h.length >= 3 && eq(h, e + w[this.p + 1].n, sens)) { adv(2); i++; continue; }
      if (!can) break;                                     /* wait: the last interim word may still change */
      let k = 0;
      if (h.length >= 3) for (let j = 1; j <= 3 && this.p + j < w.length; j++) if (eq(h, w[this.p + j].n, sens)) { k = j; break; }
      if (k) {
        if (sens === 'r' ? k >= 3 : sens === 'n' ? k >= 2 : true) { const idx = this.p; this.bad = []; ev.push({ t: 'mistake', idx, kind: 'skip', heard: [h] }); i++; return { ev, used: i }; }
        this.p += k; adv(1); i++; continue;               /* a single skipped / garbled word is tolerated */
      }
      this.bad.push(h); i++;
      if (this.bad.length >= need) { const idx = this.p, hd = this.bad.slice(); this.bad = []; ev.push({ t: 'mistake', idx, kind: 'wrong', heard: hd }); return { ev, used: i }; }
    }
    if (this.p >= w.length) ev.push({ t: 'end' });
    return { ev, used: i };
  };
  root.FahmHafiz = { norm, eq, Tracker, BISM };
  if (typeof module !== 'undefined') module.exports = root.FahmHafiz;
})(typeof window !== 'undefined' ? window : globalThis);

/* Word-duration weights for live highlighting while a recitation plays.
   A word's spoken length depends on its letters AND on madd / shadda / ghunna, so we weigh those instead of just counting letters. */
(function () {
'use strict';
const MARK = /[ً-ٰٟۖ-ۭـ]/g;
function weight(ar) {
  const s = String(ar || ''), base = s.replace(MARK, '').replace(/[^ء-ۿ]/g, '');
  let w = 0;
  for (const ch of base) { if (ch === 'ا' || ch === 'ٱ') w += .55; else if (ch === 'و' || ch === 'ي' || ch === 'ى' || ch === 'ی') w += .75; else if (ch === 'ء' || ch === 'أ' || ch === 'إ' || ch === 'ؤ' || ch === 'ئ') w += .7; else w += 1; }
  (s.match(/ّ/g) || []).forEach(() => w += .9);            // shadda: doubled letter
  (s.match(/ٓ/g) || []).forEach(() => w += 2.6);           // maddah: long madd
  (s.match(/ٰ/g) || []).forEach(() => w += .9);            // dagger alif
  (s.match(/[ًٌٍ]/g) || []).forEach(() => w += .5); // tanween
  (s.match(/[ۖ-ۜ]/g) || []).forEach(() => w += .6);   // waqf signs: small pause
  if (/مّ|نّ/.test(s)) w += .6;             // ghunna
  return Math.max(1.4, w + .9);
}
window.FahmTiming = { weight, bounds(words) { const ws = words.map(w => weight(w.ar || w.t)), tot = ws.reduce((a, b) => a + b, 0); let acc = 0; return ws.map(x => (acc += x / tot)); } };
})();

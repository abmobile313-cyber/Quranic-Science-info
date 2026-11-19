/* Fahm — Mushaf page reader (15-line / 13-line Hafizi IndoPak) + Hafiz live-recitation mode.
   Text + font: DigitalKhatt IndoPak (OFL). Line layouts: Qudratullah 15 & 13 line, Taj 13 line. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(3, '0');
const H = window.FahmHafiz;
let A = null, M = null, loading = null;
let open = false, lay = '15', pi = 0, PG = [], LP = {}, SC = [], AY = [], AYI = {}, STARTS = {}, okSet = new Set();
let curAy = null, hot = null, playing = false, seqOn = false, tickT = null, rev = null;
let hz = { plan: null, cur: null, all: [], busyAt: 0, fi: 0, ti: 0, daur: 1, on: false, busy: false, tr: null, want: false, lastAct: 0, sil: null, proc: {}, prev: null, sess: 0, startedAt: 0, native: false, sr: null };

const RS = {
  ur: { lay15: '۱۵ لائن (حافظی)', lay13q: '۱۳ لائن · قدرت اللہ', lay13t: '۱۳ لائن · تاج', pg: 'صفحہ', hafiz: 'حافظ موڈ', look: 'دیکھ کر', mem: 'یاد سے', sens: 'سخت گیری', sS: 'سخت', sN: 'درمیانی', sR: 'نرم', sil: 'خاموشی کے بعد لقمہ', sec: 'سیکنڈ', listen: 'سن رہا ہوں… پڑھیے', wrong: 'غلطی! آیت دوبارہ سنیے', luq: 'لقمہ — آیت سنیے', done: 'ماشاء اللہ! مکمل', noRec: 'اس براؤزر میں آواز پہچاننا موجود نہیں۔ Chrome یا Android ایپ استعمال کیجیے۔', mic: 'مائیک کی اجازت نہیں ملی۔', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔', tap: 'کسی آیت پر ٹیپ کریں — وہیں سے شروع', audioErr: 'آڈیو نہیں چلی (انٹرنیٹ دیکھیں)', settings: 'ترتیب', layout: 'قرآن کی ترتیب', stop: 'رکیں', start: 'شروع', from: 'یہاں سے شروع', first: 'پہلا حصہ', page: 'صفحہ' },
  ru: { lay15: '15 Line (Hafizi)', lay13q: '13 Line · Qudratullah', lay13t: '13 Line · Taj', pg: 'Safha', hafiz: 'Hafiz Mode', look: 'Dekh kar', mem: 'Yaad se', sens: 'Sakhti', sS: 'Sakht', sN: 'Darmiyani', sR: 'Narm', sil: 'Khamoshi ke baad lukma', sec: 'second', listen: 'Sun raha hoon… padhiye', wrong: 'Galti! Ayat dobara suniye', luq: 'Lukma — ayat suniye', done: 'MashaAllah! Mukammal', noRec: 'Is browser mein awaaz pehchanna maujood nahin. Chrome ya Android app istemal karein.', mic: 'Mic ki ijazat nahin mili.', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin).', tap: 'Kisi ayat par tap karein — wahin se shuru', audioErr: 'Audio nahin chali (internet dekhein)', settings: 'Settings', layout: 'Quran ka format', stop: 'Rukein', start: 'Shuru', from: 'Yahan se shuru', first: 'Pehla hissa', page: 'Safha' },
  en: { lay15: '15-Line (Hafizi)', lay13q: '13-Line · Qudratullah', lay13t: '13-Line · Taj', pg: 'Page', hafiz: 'Hafiz Mode', look: 'Looking', mem: 'From memory', sens: 'Strictness', sS: 'Strict', sN: 'Normal', sR: 'Relaxed', sil: 'Prompt after silence', sec: 'sec', listen: 'Listening… recite', wrong: 'Mistake! Listen to the ayah', luq: 'Prompt — listen to the ayah', done: 'MashaAllah! Complete', noRec: 'Speech recognition is not available here. Use Chrome or the Android app.', mic: 'Microphone permission was not granted.', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed).', tap: 'Tap any ayah to start from there', audioErr: 'Audio failed (check internet)', settings: 'Settings', layout: 'Mushaf layout', stop: 'Stop', start: 'Start', from: 'Start here', first: 'First part', page: 'Page' }
};

Object.assign(RS.ur, { target: 'روزانہ ہدف', resume: 'جہاں چھوڑا تھا وہیں سے', from: 'کہاں سے', to: 'کہاں تک', reps: 'کتنے دَور', quick: 'جلدی چنیں', qFat: 'فاتحہ', qJuz: 'پارہ ۳۰ (موجودہ حصہ)', qAll: 'سب ۱۱ سورتیں', history: 'پچھلی رپورٹیں', daur: 'دَور', kWrong: 'لفظ بدلا', kSkip: 'لفظ چھوٹا', kJump: 'آیت بدلی', clean: 'درست آیات', hard: 'سخت غلطی', stall: 'اٹکا', doubt: 'شک', time: 'وقت', wpm: 'لفظ/منٹ', atka: 'یہاں اٹکے', secHard: 'سخت غلطیاں اور ان کا اثر', secStall: 'کہاں کہاں اٹکے (لقمہ)', secDoubt: 'شک والی جگہیں', doubtNote: 'یہاں ریکارڈر نے صاف نہیں سنا یا چھوٹا لفظ ہلکا چھوٹا؛ بہاؤ نہیں توڑا گیا، دوبارہ دیکھ لیں۔', secOk: 'کیا درست رہا', daurRep: 'دَور کی رپورٹ', ask: 'کیا آپ نے یہ ساری غلطیاں نوٹ کر لیں؟ کیا الگ دَور شروع کریں؟', noteNext: 'نوٹ کر لیں — اگلا دَور', noteFinal: 'نوٹ کر لیں — آخری رپورٹ', again: 'اسی دَور کو دوبارہ', stopFinal: 'رکیں — آخری رپورٹ دکھائیں', finalRep: 'آخری رپورٹ', copy: 'رپورٹ کاپی کریں', newPlan: 'نیا ہدف / دَور', close: 'بند کریں', daurs: 'دَور', avgClean: 'اوسط درست', trend: 'پہلے سے آخری دَور', secRange: 'ہدف', secPer: 'ہر دَور', secRep: 'بار بار کی غلطیاں', secImpact: 'غلطیوں سے ترجمے/معنی کا نقصان', secOkAll: 'ہر دَور میں درست رہی آیات', limits: 'نوٹ: غلطی صرف الفاظ کی سطح پر پکڑی جاتی ہے؛ زبر/زیر/تجوید کی پہچان ریکارڈر نہیں کر سکتا۔', times: 'بار', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔ حافظ موڈ صرف سخت غلطی (آیت بدلنا، لمبا چھوٹنا) پر روکتا ہے۔', sS: 'سخت', sN: 'درمیانی', sH: 'حافظ (تیز رفتار)' });
Object.assign(RS.ru, { target: 'Rozana target', resume: 'Jahan chhoda tha wahin se', from: 'Kahan se', to: 'Kahan tak', reps: 'Kitne daur', quick: 'Jaldi chunein', qFat: 'Fatiha', qJuz: 'Para 30 (maujooda hissa)', qAll: 'Sab 11 surah', history: 'Pichhli reports', daur: 'Daur', kWrong: 'Lafz badla', kSkip: 'Lafz chhoota', kJump: 'Ayat badli', clean: 'Durust ayat', hard: 'Sakht galti', stall: 'Atke', doubt: 'Shak', time: 'Waqt', wpm: 'lafz/min', atka: 'Yahan atke', secHard: 'Sakht galtiyan aur unka asar', secStall: 'Kahan kahan atke (lukma)', secDoubt: 'Shak wali jagahein', doubtNote: 'Yahan recogniser ne saaf nahin suna ya chhota lafz halka chhoota; rawani nahin todi gayi, dobara dekh lein.', secOk: 'Kya durust raha', daurRep: 'Daur ki report', ask: 'Kya aapne yeh saari galtiyan note kar li? Kya alag daur shuru karein?', noteNext: 'Note kar li — agla daur', noteFinal: 'Note kar li — final report', again: 'Isi daur ko dobara', stopFinal: 'Rukein — final report dikhayein', finalRep: 'Final report', copy: 'Report copy karein', newPlan: 'Naya target / daur', close: 'Band karein', daurs: 'Daur', avgClean: 'Ausat durust', trend: 'Pehle se aakhri daur', secRange: 'Target', secPer: 'Har daur', secRep: 'Baar baar ki galtiyan', secImpact: 'Galtiyon se tarjme/matlab ka nuksan', secOkAll: 'Har daur mein durust rahi ayat', limits: 'Note: galti sirf alfaaz ki satah par pakdi jaati hai; zabar/zer/tajweed ki pehchan recogniser nahin kar sakta.', times: 'baar', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin). Hafiz mode sirf sakht galti (ayat badalna, lamba chhootna) par rokta hai.', sS: 'Sakht', sN: 'Darmiyani', sH: 'Hafiz (tez raftar)' });
Object.assign(RS.en, { target: 'Daily target', resume: 'Continue where you left off', from: 'From', to: 'To', reps: 'Number of rounds', quick: 'Quick pick', qFat: 'Fatiha', qJuz: 'Juz 30 (available part)', qAll: 'All 11 surahs', history: 'Past reports', daur: 'Round', kWrong: 'Word changed', kSkip: 'Word skipped', kJump: 'Ayah changed', clean: 'Clean ayat', hard: 'Hard mistakes', stall: 'Stalls', doubt: 'Doubts', time: 'Time', wpm: 'words/min', atka: 'Stalled here', secHard: 'Hard mistakes and their effect', secStall: 'Where you stalled (prompt)', secDoubt: 'Doubtful spots', doubtNote: 'The recogniser did not hear these clearly or a small word slipped; the flow was not interrupted — please recheck.', secOk: 'What went right', daurRep: 'Round report', ask: 'Did you note all these mistakes? Start another round?', noteNext: 'Noted — next round', noteFinal: 'Noted — final report', again: 'Repeat this round', stopFinal: 'Stop — show final report', finalRep: 'Final report', copy: 'Copy report', newPlan: 'New target / rounds', close: 'Close', daurs: 'Rounds', avgClean: 'Avg clean', trend: 'First to last round', secRange: 'Target', secPer: 'Each round', secRep: 'Repeated mistakes', secImpact: 'Loss to translation / meaning', secOkAll: 'Ayat clean in every round', limits: 'Note: mistakes are caught at word level only; zabar/zer/tajweed cannot be detected by the recogniser.', times: 'times', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed). Hafiz mode interrupts only for hard mistakes (changed ayah, long skip).', sS: 'Strict', sN: 'Normal', sH: 'Hafiz (fast pace)' });
const R = k => (RS[A.st().ui] || RS.en)[k];
const rau = new Audio(); rau.preload = 'auto';
const rec = () => A.st().rec;
const auUrl = (s, a) => `https://everyayah.com/data/${rec()}/${pad(s)}${pad(a)}.mp3`;
const locOf = (s, a, w) => `${s}:${a}:${w}`;
const q = loc => document.querySelector(`#rpage [data-loc="${loc}"]`);
const qa = (s, a) => document.querySelectorAll(`#rpage [data-loc^="${s}:${a}:"]`);
const isMk = t => !H.norm(t);

/* ---------- data / layout index ---------- */
function load() {
  if (M) return Promise.resolve();
  return loading || (loading = fetch('mushaf.json').then(r => r.json()).then(j => { M = j; }));
}
function rangeLocs(a, b) {
  const [s, a1, w1] = a.split(':').map(Number), [s2, a2, w2] = b.split(':').map(Number), out = [];
  let ay = a1, w = w1;
  for (let guard = 0; guard < 400; guard++) {
    const t = M.w[s + ':' + ay]; if (!t) break;
    if (w > t.length) { ay++; w = 1; continue; }
    out.push({ s, a: ay, w, t: t[w - 1] });
    if (ay === a2 && w === w2) break; w++;
  }
  return out;
}
function lineParts(ln) { const p = ln.split(' '); return { k: p[0], a: p[1], b: p[2] }; }
function buildIndex() {
  const L = M.L[lay]; PG = Object.keys(L.pages); LP = {}; SC = []; AY = []; AYI = {}; STARTS = {};
  let pendingStart = false;
  PG.forEach((pg, i) => L.pages[pg].forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k[0] === 'h' && k.length > 1) { pendingStart = +k.slice(1) !== 1; return; }
    if (k === 't' || k === 'c') rangeLocs(a, b).forEach(x => {
      const loc = locOf(x.s, x.a, x.w); LP[loc] = i;
      const n = H.norm(x.t); if (!n) return;
      if (pendingStart) { STARTS[SC.length] = 1; pendingStart = false; }
      const key = x.s + ':' + x.a; let ai = AYI[key];
      if (ai === undefined) { ai = AYI[key] = AY.length; AY.push({ s: x.s, a: x.a, first: SC.length, last: SC.length }); }
      AY[ai].last = SC.length; SC.push({ s: x.s, a: x.a, w: x.w, loc, n, ai });
    });
  }));
}
function surahName(s) { const I = window.I18N; const e = (I.surah[s] || {})[A.st().ui]; return e ? e[0] : (M.n[s] || ''); }
function pageSurah(i) { const L = M.L[lay].pages[PG[i]]; for (const ln of L) { const { k, a } = lineParts(ln); if (k[0] === 'h' && k.length > 1) return +k.slice(1); if (a) return +a.split(':')[0]; } return 1; }

/* ---------- rendering ---------- */
function ratio() { const st = $('#rstage'); const r = (st.clientWidth - 16) / Math.max(1, st.clientHeight - 16); return r > 1.1 ? 0.66 : Math.max(0.56, Math.min(0.7, r)); }
function rowsOf() { return lay === '15' ? 15 : 13; }
function sizePage() {
  const st = $('#rstage'), z = A.st().rz || 1, sw = st.clientWidth - 16, sh = st.clientHeight - 16, r = ratio();
  const w = sw > sh * 1.1 ? Math.max(200, Math.min(sw, 640)) * z : Math.max(200, Math.min(sw, sh * r)) * z;   /* landscape: full-width page, scroll down */ const p = $('#rpage'); p.style.width = w + 'px'; p.style.height = (w / r) + 'px';
}
function fit() {
  const inner = $('#rin'); if (!inner) return; const rows = rowsOf();
  const W = inner.clientWidth, Hh = inner.clientHeight, rowH = Hh / rows;
  let fs = rowH * 0.78; $('#rpage').style.setProperty('--fs', fs + 'px');
  for (let it = 0; it < 3; it++) {
    let need = 0;
    inner.querySelectorAll('.ml:not(.e):not(.h)').forEach(l => {
      let s = 0; const ch = l.children; for (let i = 0; i < ch.length; i++) s += ch[i].offsetWidth; s += Math.max(0, ch.length - 1) * fs * 0.1; if (s > need) need = s;
    });
    if (!need) break; const f = fs * Math.min(1, (W * 0.995) / need); if (Math.abs(f - fs) < 0.3 && it) break; fs = f; $('#rpage').style.setProperty('--fs', fs + 'px');
  }
  $('#rpage').style.setProperty('--fs', Math.min(fs, rowH * 0.78) + 'px');
}
function wordHtml(x) {
  const loc = locOf(x.s, x.a, x.w), c = ['wd']; if (isMk(x.t)) c.push('mk');
  if (okSet.has(loc)) c.push('ok');
  return `<span class="${c.join(' ')}" data-loc="${loc}">${esc(x.t)}</span>`;
}
function renderPage(anim) {
  const L = M.L[lay], lines = L.pages[PG[pi]], rows = rowsOf();
  let h = '';
  lines.forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k === 'e') h += '<div class="ml e"></div>';
    else if (k === 'b') h += `<div class="ml b">${M.w['1:1'].slice(0, 4).map(esc).join(' ')}</div>`;
    else if (k[0] === 'h') h += `<div class="ml h"><span class="sb">${esc(M.n[k.slice(1)] || '')}</span></div>`;
    else h += `<div class="ml ${k}">${rangeLocs(a, b).map(wordHtml).join('')}</div>`;
  });
  const pg = $('#rpage'); pg.classList.toggle('mem', hz.on && A.st().hmode === 'mem');
  $('#rin').innerHTML = h; $('#rin').style.setProperty('--rows', rows);
  $('#rpn').textContent = A.st().ui === 'ur' ? ad(PG[pi]) : PG[pi];
  sizePage(); fit();
  $('#rTitle').textContent = surahName(pageSurah(pi)) + ' · ' + R('pg') + ' ' + (A.st().ui === 'ur' ? ad(PG[pi]) : PG[pi]);
  $('#rPg').textContent = (A.st().ui === 'ur' ? ad(pi + 1) + ' / ' + ad(PG.length) : (pi + 1) + ' / ' + PG.length);
  if (anim) { pg.classList.remove('flip'); void pg.offsetWidth; pg.classList.add('flip'); }
  paintState();
}
const AD = '٠١٢٣٤٥٦٧٨٩', ad = n => String(n).replace(/\d/g, d => AD[d]);
function paintState() {
  if (curAy && (playing || hz.on)) qa(curAy.s, curAy.a).forEach(e => e.classList.add('cur'));
  if (hot) { const e = q(hot); if (e) e.classList.add('hot'); }
  if (hz.on && hz.tr) markNext();
}
function goPage(i, anim) { i = Math.max(0, Math.min(PG.length - 1, i)); if (i === pi && $('#rin').children.length) return; pi = i; renderPage(anim !== false); }
function ensureLoc(loc) { const i = LP[loc]; if (i !== undefined && i !== pi) goPage(i); }

/* ---------- ayah audio + live word highlight ---------- */
function clearHl() { document.querySelectorAll('#rpage .cur,#rpage .hot').forEach(e => e.classList.remove('cur', 'hot')); }
function setCur(s, a) {
  clearHl(); hot = null; curAy = { s, a }; const key = s + ':' + a, ai = AYI[key];
  if (ai !== undefined) { const f = SC[AY[ai].first]; ensureLoc(f.loc); }
  qa(s, a).forEach(e => e.classList.add('cur'));
}
function ayWords(s, a) { const ai = AYI[s + ':' + a]; return ai === undefined ? [] : SC.slice(AY[ai].first, AY[ai].last + 1); }
function startTick() {
  clearInterval(tickT);
  tickT = setInterval(() => {
    if (!curAy || !rau.duration || rau.paused) return;
    const ws = ayWords(curAy.s, curAy.a); if (!ws.length) return;
    const tot = ws.reduce((x, y) => x + y.n.length + 1, 0), t = Math.max(0, Math.min(1, (rau.currentTime - 0.15) / Math.max(0.5, rau.duration - 0.35))) * tot;
    let acc = 0, pick = ws[ws.length - 1];
    for (const w of ws) { acc += w.n.length + 1; if (t <= acc) { pick = w; break; } }
    if (hot !== pick.loc) { const o = hot && q(hot); if (o) o.classList.remove('hot'); hot = pick.loc; ensureLoc(pick.loc); const e = q(pick.loc); if (e) e.classList.add('hot', 'cur'); if (rev) { qa(curAy.s, curAy.a).forEach(x => x.classList.add('rev')); } }
  }, 70);
}
function setPlaying(p) { playing = p; $('#rIcoP').style.display = p ? 'none' : ''; $('#rIcoS').style.display = p ? '' : 'none'; }
function stopAudio() { seqOn = false; rau.onended = null; rau.onerror = null; try { rau.pause(); } catch (e) { } clearInterval(tickT); setPlaying(false); clearHl(); document.querySelectorAll('#rpage .rev').forEach(e => e.classList.remove('rev')); hot = null; }
function playSeq(ai) {
  if (ai >= AY.length) { stopAudio(); return; }
  seqOn = true; const y = AY[ai]; setCur(y.s, y.a); setPlaying(true);
  rau.onerror = () => { stopAudio(); A.toast(R('audioErr')); };
  rau.onended = () => { if (seqOn) playSeq(ai + 1); };
  rau.src = auUrl(y.s, y.a); const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { stopAudio(); A.toast(R('audioErr')); });
  startTick();
}
/* play one ayah, then call cb (used by Hafiz mode) */
function playOnce(s, a, reveal, cb) {
  seqOn = false; rev = reveal; setCur(s, a); if (reveal) qa(s, a).forEach(x => x.classList.add('rev'));
  let fin = false; const done = () => { if (fin) return; fin = true; rau.onended = null; rau.onerror = null; clearInterval(tickT); qa(s, a).forEach(x => x.classList.remove('rev')); rev = null; clearHl(); hot = null; cb && cb(); };
  rau.onended = done; rau.onerror = () => { A.toast(R('audioErr')); done(); };
  rau.src = auUrl(s, a); const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { A.toast(R('audioErr')); done(); });
  startTick();
}

/* ---------- sounds ---------- */
let ac = null;
function unlockAc() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { } }
function beep() {
  unlockAc(); if (!ac) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), c = ac.createDynamicsCompressor();
  o.type = 'square'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.01); g.gain.setValueAtTime(1, t + 0.42); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  o.connect(g); g.connect(c); c.connect(ac.destination); o.start(t); o.stop(t + 0.52);
  try { if (navigator.vibrate) navigator.vibrate(180); } catch (e) { }
}

/* ---------- speech recognition layer ---------- */
function nativeOk() { try { return !!(window.FahmAndroid && window.FahmAndroid.speechAvailable && window.FahmAndroid.speechAvailable()); } catch (e) { return false; } }
function webOk() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function recStart() {
  if (!hz.want) return; hz.proc = {}; hz.prev = null; hz.sess++;
  if (hz.native) { try { window.FahmAndroid.startListen('ar-SA'); } catch (e) { fatal('noRec'); } return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const r = new SR(); const my = hz.sess; hz.sr = r;
  r.lang = 'ar-SA'; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
  r.onresult = e => { if (my !== hz.sess) return; for (let i = e.resultIndex; i < e.results.length; i++) onHeard(i, e.results[i][0].transcript, e.results[i].isFinal); };
  r.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') fatal('mic'); };
  r.onend = () => { if (my === hz.sess && hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy && my === hz.sess) recStart(); }, 120); };
  try { r.start(); } catch (e) { }
}
function recStop() {
  hz.sess++;
  if (hz.native) { try { window.FahmAndroid.stopListen(); } catch (e) { } return; }
  if (hz.sr) { try { hz.sr.onend = null; hz.sr.abort(); } catch (e) { } hz.sr = null; }
}
/* called by the Android shell: type = partial | final | end | error */
window.__fahmSpeech = function (type, text) {
  if (!hz.on || !hz.native) return;
  if (type === 'partial') onHeard(0, text, false);
  else if (type === 'final') onHeard(0, text, true);
  else if (type === 'permok') { if (hz.want && !hz.busy) recStart(); }
  else if (type === 'permno') fatal('mic');
  else if (type === 'perm') { /* waiting for the system permission dialog */ }
  else if (type === 'end') { if (hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy) recStart(); }, 60); }
  else if (type === 'error') { if (/denied|permission|insufficient/i.test(text || '')) fatal('mic'); else if (hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy) recStart(); }, 400); }
};
function fatal(k) { A.toast(R(k), 4200); hzStop(); }

/* ---------- Hafiz mode ---------- */
const sensOf = () => A.st().hs || 'h';
const silOf = () => A.st().hsil || 4;
const L3 = (u, r, e) => ({ ur: u, ru: r, en: e }[A.st().ui] || e);
let DICT = null;
function dictBuild() {
  DICT = {}; A.D().surahs.forEach(S => S.ayat.forEach(Ay => Ay.words.forEach(W => { const n = H.norm(W.ar); if (n && !DICT[n]) DICT[n] = W; })));
}
const mk3 = W => W ? (A.st().ui === 'ur' ? W.ur : A.st().ui === 'ru' ? W.ru : W.en) : '';
function wMean(w) {
  const S = A.D().surahs.find(x => x.n === w.s); const Ay = S && S.ayat.find(x => x.v === w.a); const W = Ay && Ay.words[w.w - 1];
  if (W && H.norm(W.ar) === w.n) return mk3(W);
  if (!DICT) dictBuild(); return mk3(DICT[w.n]);
}
function ayTr(s, a) {
  const S = A.D().surahs.find(x => x.n === s); const Ay = S && S.ayat.find(x => x.v === a); if (!Ay) return '';
  const tl = A.st().tl || []; for (const c of tl) if (Ay.tr && Ay.tr[c]) return Ay.tr[c]; return (Ay.tr && (Ay.tr.ur || Ay.tr.en)) || '';
}
const ayRef = ai => { const y = AY[ai]; return surahName(y.s) + ' ' + (A.st().ui === 'ur' ? ad(y.a) : y.a); };
function hzStatus(k, cls) { const e = $('#rhSt'); e.textContent = R(k); e.className = cls || ''; }
function markNext() {
  document.querySelectorAll('#rpage .nx').forEach(e => e.classList.remove('nx')); const w = SC[hz.tr.p];
  if (w) { const e = q(w.loc); if (e) { e.classList.add('nx'); const st = $('#rstage'); if (st.scrollHeight > st.clientHeight + 4) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
}
function setOk(i0, i1) {
  for (let i = i0; i < i1; i++) {
    const w = SC[i]; if (!w) continue; okSet.add(w.loc); const e = q(w.loc); if (e) { e.classList.add('ok'); e.classList.remove('bad'); }
    const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.add(m.dataset.loc); m.classList.add('ok'); }
  }
}
function clearAyahMarks(ai) {
  const y = AY[ai]; for (let i = y.first; i <= y.last; i++) { const w = SC[i]; okSet.delete(w.loc); const e = q(w.loc); if (e) e.classList.remove('ok', 'bad'); const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.delete(m.dataset.loc); m.classList.remove('ok'); } }
}
/* where the Hafiz stopped last time — mic starts from here again */
function savePos(ai) { const y = AY[ai]; if (!y) return; const st = A.st(); if (!st.hlast || st.hlast.s !== y.s || st.hlast.a !== y.a) { st.hlast = { s: y.s, a: y.a }; A.save(); } }
const posAi = () => Math.min(hz.tr.p, SC.length - 1);
function onHeard(idx, text, fin) {
  if (!hz.on || hz.busy || !hz.tr) return;
  const toks = String(text || '').trim().split(/\s+/).map(H.norm).filter(Boolean);
  let done = hz.proc[idx] || 0;
  if (hz.prev && hz.prev.idx !== idx) { const pt = hz.prev.toks; if (pt.length && toks.length >= pt.length && pt.every((t, j) => t === toks[j])) done = Math.max(done, pt.length); }
  hz.prev = { idx, toks };
  if (toks.length > done) hz.lastAct = Date.now();
  const nt = toks.slice(done); if (!nt.length) { if (fin) hz.proc[idx] = Math.max(done, toks.length); return; }
  const p0 = hz.tr.p, r = hz.tr.feed(nt, fin); hz.proc[idx] = fin ? toks.length : done + r.used;
  for (const ev of r.ev) {
    if (ev.t === 'ok') { setOk(ev.from, ev.to); hz.lastAct = Date.now(); hz.cur.words += ev.to - ev.from; }
    else if (ev.t === 'soft') { const w = SC[ev.idx]; if (w) hz.cur.soft.push({ ai: w.ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, heard: ev.heard, t: Date.now() - hz.cur.t0 }); }
    else if (ev.t === 'mistake') { hzMistake(ev); return; }
    else if (ev.t === 'end') { hzDaurEnd(); return; }
  }
  if (hz.tr.p !== p0) { const w = SC[posAi()]; if (w) ensureLoc(w.loc); markNext(); savePos(w.ai); }
}
function busyOn() { hz.busy = true; hz.busyAt = Date.now(); }
function busyOff() { hz.busy = false; if (hz.busyAt) { hz.cur.busyMs += Date.now() - hz.busyAt; hz.busyAt = 0; } }
function hzResume(ai) {
  const y = AY[ai]; clearAyahMarks(ai); hz.tr.setPos(y.first); markNext(); busyOff(); hz.lastAct = Date.now() + 600; hzStatus('listen'); recStart();
}
function hzMistake(ev) {
  busyOn(); recStop(); const w = SC[ev.idx], ai = w.ai, y = AY[ai];
  hz.cur.mist.push({ ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, to: ev.to, heard: ev.heard, t: Date.now() - hz.cur.t0 });
  const e = q(w.loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(w.loc);
  hzStatus('wrong', 'bad'); beep();
  setTimeout(() => { if (!hz.on) return; playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); }); }, 650);
}
function hzLukma() {
  if (hz.busy || !hz.tr || hz.tr.done()) return; busyOn(); recStop();
  const w = SC[hz.tr.p], ai = w.ai, y = AY[ai]; hzStatus('luq', 'warn');
  hz.cur.stalls.push({ ai, idx: hz.tr.p, t: Date.now() - hz.cur.t0, wait: silOf() });
  ensureLoc(w.loc); playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); });
}

/* ----- plan (daily target) ----- */
function planDefault() {
  const st = A.st(); if (st.hplan && AYI[st.hplan.fs + ':' + st.hplan.fa] != null && AYI[st.hplan.ts + ':' + st.hplan.ta] != null) return st.hplan;
  const f = AY[0], l = AY[AY.length - 1]; return { fs: f.s, fa: f.a, ts: l.s, ta: l.a, reps: 1 };
}
const surahsInScope = () => { const o = []; AY.forEach(y => { if (!o.includes(y.s)) o.push(y.s); }); return o; };
function popSetup() {
  const st = A.st(), pl = planDefault(), last = st.hlast && AYI[st.hlast.s + ':' + st.hlast.a] != null ? st.hlast : null;
  const sOpt = (sel) => surahsInScope().map(s => `<option value="${s}" ${s === sel ? 'selected' : ''}>${esc(surahName(s))}</option>`).join('');
  const aOpt = (s, sel) => AY.filter(y => y.s === s).map(y => `<option value="${y.a}" ${y.a === sel ? 'selected' : ''}>${st.ui === 'ur' ? ad(y.a) : y.a}</option>`).join('');
  const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').dataset.pk = 's';
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))} · ${esc(R('target'))}</h4>` +
    (last ? `<button class="po" data-hres="1">${esc(R('resume'))}: ${esc(surahName(last.s))} ${st.ui === 'ur' ? ad(last.a) : last.a}</button>` : '') +
    `<div class="pr"><span>${esc(R('from'))}</span><select id="tfS" class="sel">${sOpt(pl.fs)}</select><select id="tfA" class="sel">${aOpt(pl.fs, pl.fa)}</select></div>` +
    `<div class="pr"><span>${esc(R('to'))}</span><select id="ttS" class="sel">${sOpt(pl.ts)}</select><select id="ttA" class="sel">${aOpt(pl.ts, pl.ta)}</select></div>` +
    `<div class="pr"><span>${esc(R('reps'))}</span>${[1, 2, 3, 5, 7, 10].map(v => sw('reps', v, String(v), (pl.reps || 1) === v)).join('')}</div>` +
    `<div class="pr"><span>${esc(R('quick'))}</span><button class="po sm" data-q="fat">${esc(R('qFat'))}</button><button class="po sm" data-q="juz">${esc(R('qJuz'))}</button><button class="po sm" data-q="all">${esc(R('qAll'))}</button></div>` +
    `<button class="po on" data-hgo="1">${esc(R('start'))}</button><button class="po sm" data-hset="1">${esc(R('settings'))}</button><button class="po sm" data-hist="1">${esc(R('history'))}</button>`;
  $('#rpop').hidden = false;
}
function readPlan2() { const p = readPlan(); p.reps = (A.st().hplan && A.st().hplan.reps) || 1; return p; }
function hzStopAsk() { if (hz.cur && hz.cur.words >= 3) hzFinishAll(true); else hzStop(); }
function readPlan() {
  const g = id => +$(id).value; const pl = planDefault();
  let fs = g('#tfS'), fa = g('#tfA'), ts = g('#ttS'), ta = g('#ttA');
  let fi = AYI[fs + ':' + fa], ti = AYI[ts + ':' + ta]; if (fi == null || ti == null) return pl;
  if (ti < fi) { const t = fi; fi = ti; ti = t; }
  const y = AY[fi], z = AY[ti]; return { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1 };
}
function setPlanQuick(k) {
  const pl = Object.assign({}, planDefault());
  if (k === 'fat') { pl.fs = 1; pl.fa = 1; pl.ts = 1; pl.ta = 7; }
  else if (k === 'juz') { const a = AY.find(y => y.s === 105); const b = AY[AY.length - 1]; if (a) { pl.fs = a.s; pl.fa = a.a; pl.ts = b.s; pl.ta = b.a; } }
  else { pl.fs = AY[0].s; pl.fa = AY[0].a; pl.ts = AY[AY.length - 1].s; pl.ta = AY[AY.length - 1].a; }
  A.st().hplan = pl; A.save(); popSetup();
}

/* ----- start / daur loop ----- */
function newDaur(n) { return { n, t0: Date.now(), t1: 0, words: 0, busyMs: 0, mist: [], soft: [], stalls: [] }; }
function hzStart(fromAi, plan) {
  stopAudio(); unlockAc(); popClose();
  hz.native = nativeOk(); if (!hz.native && !webOk()) { A.toast(R('noRec'), 4500); return; }
  const st = A.st(); if (!st.hs) st.hs = 'h'; if (!st.hsil) st.hsil = 4; if (!st.hmode) st.hmode = 'look';
  const pl = plan || planDefault(); st.hplan = pl; A.save();
  hz.plan = pl; hz.fi = AYI[pl.fs + ':' + pl.fa]; hz.ti = AYI[pl.ts + ':' + pl.ta]; hz.all = []; hz.daur = 1; hz.startAi = fromAi != null ? Math.max(hz.fi, Math.min(hz.ti, fromAi)) : hz.fi;
  hz.on = true; hz.want = true; hz.started = Date.now();
  $('#rrep').hidden = true; $('#rhz').hidden = false; $('#rhMode').textContent = R(st.hmode); $('#rMic').classList.add('on'); $('#rpage').classList.toggle('mem', st.hmode === 'mem');
  clearInterval(hz.sil); hz.sil = setInterval(() => { if (hz.on && !hz.busy && Date.now() - hz.lastAct > silOf() * 1000) hzLukma(); }, 250);
  hzBeginDaur(hz.startAi);
}
function hzBeginDaur(ai) {
  hz.cur = newDaur(hz.daur); hz.tr = new H.Tracker(SC, sensOf(), STARTS); hz.tr.lim = AY[hz.ti].last + 1; hz.tr.setPos(AY[ai].first);
  okSet = new Set(); clearHl(); curAy = null; hz.busy = false; hz.lastAct = Date.now() + 3000; hz.proc = {}; hz.prev = null;
  renderPage(false); ensureLoc(SC[hz.tr.p].loc); markNext(); savePos(ai); hzStatus('listen'); $('#rhDaur').textContent = R('daur') + ' ' + hz.daur + '/' + (hz.plan.reps || 1);
  recStart();
}
function hzStop() {
  hz.on = false; hz.want = false; hz.busy = false; recStop(); clearInterval(hz.sil); stopAudio(); $('#rhz').hidden = true; $('#rMic').classList.remove('on');
  $('#rpage').classList.remove('mem'); document.querySelectorAll('#rpage .nx,#rpage .bad,#rpage .ok').forEach(e => e.classList.remove('nx', 'bad', 'ok')); okSet = new Set();
}
function hzDaurEnd() {
  busyOn(); recStop(); const d = hz.cur; d.t1 = Date.now(); hz.all.push(d); hzStatus('done', 'ok'); hz.busyAt = 0; hz.busy = true;
  A.st().hlast = { s: AY[hz.fi].s, a: AY[hz.fi].a }; A.save();
  setTimeout(() => showDaurReport(d), 700);
}

/* ----- reports ----- */
const fmtT = ms => { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); };
let VM = { fi: 0, ti: 0 };
function dStats(d) {
  const hi = d.reach != null ? Math.min(VM.ti, d.reach) : VM.ti, bad = new Set([...d.mist.map(m => m.ai), ...d.stalls.map(m => m.ai)]), n = Math.max(1, hi - VM.fi + 1), clean = [];
  for (let i = VM.fi; i <= hi; i++) if (!bad.has(i)) clean.push(i);
  const net = Math.max(1000, d.t1 - d.t0 - d.busyMs);
  return { n, clean, bad: [...bad], cleanPct: Math.round(clean.length * 100 / n), wpm: Math.round(d.words * 60000 / net), net };
}
function heardTxt(m) { return (m.heard || []).join(' '); }
function skippedWords(m, count) { const o = []; for (let i = m.idx; i < Math.min(SC.length, m.idx + count); i++) o.push(SC[i]); return o; }
function impact(m, soft) {
  if (!DICT) dictBuild();
  const w = SC[m.idx], y = AY[m.ai], mean = wMean(w), hm = m.heard && m.heard.length === 1 ? mk3(DICT[m.heard[0]]) : '';
  const ar = M.w[w.s + ':' + w.a][w.w - 1];
  if (m.kind === 'jump') {
    const t = SC[m.to], ya = y, yb = t && AY[t.ai];
    return L3(`آیت بدل گئی: ${ayRef(m.ai)} کی جگہ ${yb ? ayRef(t.ai) : ''} کی طرف چلے گئے۔ ترجمہ (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — اور ${yb ? ayTr(yb.s, yb.a) : ''}۔ یہ متشابہ/ترتیب کی غلطی ہے؛ ترجمے کا سلسلہ ٹوٹ جاتا ہے۔`,
      `Ayat badal gayi: ${ayRef(m.ai)} ki jagah ${yb ? ayRef(t.ai) : ''} ki taraf chale gaye. Tarjma (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — aur ${yb ? ayTr(yb.s, yb.a) : ''}. Yeh mutashabih/tarteeb ki galti hai; tarjme ka silsila toot jata hai.`,
      `Ayah changed: went to ${yb ? ayRef(t.ai) : ''} instead of ${ayRef(m.ai)}. Translation (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — vs ${yb ? ayTr(yb.s, yb.a) : ''}. This is a similar-verse/order error and breaks the flow of meaning.`);
  }
  if (m.kind === 'skip') {
    const k = m.n || 1, ws = skippedWords(m, k), ms = ws.map(wMean).filter(Boolean).join(' · ');
    return L3(`چھوٹے ہوئے الفاظ (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1].replace(/[۝].*/, '')).join(' ')}۔ ترجمے کا یہ حصہ غائب: ${ms}`,
      `Chhoote hue alfaaz (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1]).join(' ')}. Tarjme ka yeh hissa gayab: ${ms}`,
      `Skipped words (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1]).join(' ')}. Missing from the translation: ${ms}`);
  }
  return L3(`درست لفظ: ${ar} (${mean})۔ سنا گیا: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}۔ ${hm ? `مطلب بدل گیا: «${mean}» کی جگہ «${hm}»۔` : 'اس لفظ کا ترجمہ آیت میں ضائع/غلط ہو جاتا ہے۔'}`,
    `Sahi lafz: ${ar} (${mean}). Suna gaya: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}. ${hm ? `Matlab badal gaya: "${mean}" ki jagah "${hm}".` : 'Is lafz ka tarjma ayat mein zaya/ghalat ho jata hai.'}`,
    `Correct word: ${ar} (${mean}). Heard: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}. ${hm ? `Meaning shifts: "${mean}" becomes "${hm}".` : 'The meaning of this word is lost or wrong in the translation.'}`);
}
const kindTxt = k => ({ wrong: R('kWrong'), skip: R('kSkip'), jump: R('kJump') }[k] || k);
function section(title, body, cls) { return body ? `<div class="rs ${cls || ''}"><h5>${esc(title)}</h5>${body}</div>` : ''; }
function mistakeList(list, soft) {
  return list.map(m => { const y = AY[m.ai], w = SC[m.idx]; return `<div class="ri"><b>${esc(ayRef(m.ai))}</b> · ${esc(kindTxt(m.kind))} · ${esc(M.w[w.s + ':' + w.a][w.w - 1])}<br><small>${esc(impact(m, soft))}</small></div>`; }).join('');
}
function daurHtml(d, final) {
  if (!DICT) dictBuild(); const s = dStats(d);
  const cards = `<div class="rc"><div><b>${A.st().ui === 'ur' ? ad(s.cleanPct) : s.cleanPct}%</b><small>${esc(R('clean'))}</small></div><div><b>${d.mist.length}</b><small>${esc(R('hard'))}</small></div><div><b>${d.stalls.length}</b><small>${esc(R('stall'))}</small></div><div><b>${d.soft.length}</b><small>${esc(R('doubt'))}</small></div><div><b>${fmtT(d.t1 - d.t0)}</b><small>${esc(R('time'))}</small></div><div><b>${s.wpm}</b><small>${esc(R('wpm'))}</small></div></div>`;
  const stalls = d.stalls.map(x => `<div class="ri"><b>${esc(ayRef(x.ai))}</b> · ${esc(R('atka'))}: ${esc(M.w[SC[x.idx].s + ':' + SC[x.idx].a][SC[x.idx].w - 1])}</div>`).join('');
  const soft = d.soft.map(m => `<div class="ri"><b>${esc(ayRef(m.ai))}</b> · ${esc(M.w[SC[m.idx].s + ':' + SC[m.idx].a][SC[m.idx].w - 1])}${m.heard && m.heard.length ? ' ← ' + esc(heardTxt(m)) : ''}</div>`).join('');
  const clean = s.clean.length ? `<div class="ri">${s.clean.map(i => esc(ayRef(i))).join(' · ')}</div>` : '';
  return cards + section(R('secHard'), mistakeList(d.mist), 'bad') + section(R('secStall'), stalls, 'warn') + section(R('secDoubt'), soft && `<p class="pn">${esc(R('doubtNote'))}</p>` + soft) + section(R('secOk'), clean, 'ok');
}
function showDaurReport(d) {
  VM = { fi: hz.fi, ti: hz.ti }; const last = hz.daur >= (hz.plan.reps || 1);
  $('#rrep').innerHTML = `<div class="rrin"><h4>${esc(R('daurRep'))} ${hz.daur}/${hz.plan.reps || 1}</h4>${daurHtml(d)}<p class="rq">${esc(R('ask'))}</p>` +
    `<button class="po on" data-rn="${last ? 'final' : 'next'}">${esc(last ? R('noteFinal') : R('noteNext') + ' (' + (hz.daur + 1) + '/' + (hz.plan.reps || 1) + ')')}</button>` +
    `<button class="po" data-rn="again">${esc(R('again'))}</button><button class="po" data-rn="final">${esc(R('stopFinal'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; hz.busy = true;
}
function finalHtml(all, meta) {
  if (!DICT) dictBuild(); VM = { fi: meta.fi, ti: meta.ti }; const cnt = {}, st = {};
  all.forEach(d => { d.mist.forEach(m => { cnt[m.ai] = (cnt[m.ai] || 0) + 1; }); d.stalls.forEach(m => { st[m.ai] = (st[m.ai] || 0) + 1; }); });
  const rows = all.map(d => { const s = dStats(d); return `<div class="ri"><b>${esc(R('daur'))} ${d.n}</b> · ${s.cleanPct}% · ${esc(R('hard'))} ${d.mist.length} · ${esc(R('stall'))} ${d.stalls.length} · ${esc(R('doubt'))} ${d.soft.length} · ${fmtT(d.t1 - d.t0)} · ${s.wpm} ${esc(R('wpm'))}</div>`; }).join('');
  const rep = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${cnt[i]} ${esc(R('times'))}${st[i] ? ' + ' + esc(R('atka')) + ' ' + st[i] : ''}</div>`).join('');
  const stl = Object.keys(st).filter(i => !cnt[i]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${esc(R('atka'))} ${st[i]} ${esc(R('times'))}</div>`).join('');
  const everClean = []; for (let i = meta.fi; i <= meta.ti; i++) if (!cnt[i] && !st[i]) everClean.push(i);
  const tot = all.reduce((a, d) => a + dStats(d).cleanPct, 0), avg = Math.round(tot / all.length);
  const allMist = all.flatMap(d => d.mist.map(m => Object.assign({ daur: d.n }, m)));
  const imp = allMist.map(m => `<div class="ri"><b>${esc(R('daur'))} ${m.daur} · ${esc(ayRef(m.ai))}</b><br><small>${esc(impact(m))}</small></div>`).join('');
  const trend = all.length > 1 ? (() => { const a = dStats(all[0]).cleanPct, b = dStats(all[all.length - 1]).cleanPct; return `<p class="pn">${esc(R('trend'))}: ${a}% → ${b}%</p>`; })() : '';
  return `<div class="rc"><div><b>${all.length}</b><small>${esc(R('daurs'))}</small></div><div><b>${avg}%</b><small>${esc(R('avgClean'))}</small></div><div><b>${allMist.length}</b><small>${esc(R('hard'))}</small></div></div>${trend}` +
    section(R('secRange'), `<div class="ri">${esc(ayRef(meta.fi))} → ${esc(ayRef(meta.ti))}</div>`) + section(R('secPer'), rows) + section(R('secRep'), rep + stl, 'bad') + section(R('secImpact'), imp, 'bad') +
    section(R('secOkAll'), everClean.length ? `<div class="ri">${everClean.map(i => esc(ayRef(i))).join(' · ')}</div>` : '', 'ok') + `<p class="pn">${esc(R('limits'))}</p>`;
}
function reportText(all, meta) {
  const tmp = document.createElement('div'); tmp.innerHTML = finalHtml(all, meta).replace(/<\/(div|h5|p|small)>/g, '\n$&').replace(/<br>/g, '\n'); return tmp.textContent.replace(/\n{2,}/g, '\n').trim();
}
function showFinal(all, meta, fromHist) {
  $('#rrep').innerHTML = `<div class="rrin"><h4>${esc(R('finalRep'))}</h4>${finalHtml(all, meta)}` +
    `<button class="po" data-rn="copy">${esc(R('copy'))}</button>` + (fromHist ? '' : `<button class="po on" data-rn="new">${esc(R('newPlan'))}</button>`) + `<button class="po" data-rn="close">${esc(R('close'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; $('#rrep')._fin = { all, meta };
}
function hzFinishAll(partial) {
  hz.busy = true;
  const meta = { fi: hz.fi, ti: hz.ti, ps: hz.plan }; const all = hz.all.slice();
  if (partial && hz.cur && hz.cur.words >= 3 && !all.includes(hz.cur)) { hz.cur.t1 = Date.now(); hz.cur.reach = hz.tr ? SC[Math.min(hz.tr.p, SC.length - 1)].ai : hz.ti; all.push(hz.cur); }
  hzStop(); if (!all.length) return;
  try { const h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); h.unshift({ at: Date.now(), meta, all: all.map(d => Object.assign({}, d)), lay, names: [AY[meta.fi].s + ':' + AY[meta.fi].a, AY[meta.ti].s + ':' + AY[meta.ti].a] }); localStorage.setItem('fahm.hist', JSON.stringify(h.slice(0, 20))); } catch (e) { }
  showFinal(all, meta, false);
}
function hzRepAction(act) {
  if (act === 'next') { hz.daur++; $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'again') { hz.all.pop(); $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'final') { $('#rrep').hidden = true; hzFinishAll(); }
}
function popHist() {
  let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (e) { }
  const nm = loc => { const [s, a] = loc.split(':').map(Number); return surahName(s) + ' ' + a; };
  $('#rpop').dataset.pk = 'hist';
  $('#rpop').innerHTML = `<h4>${esc(R('history'))}</h4>` + (h.length ? h.map((x, i) => { return `<button class="po" data-hi="${i}">${esc(new Date(x.at).toLocaleDateString())} · ${esc(nm(x.names[0]))} → ${esc(nm(x.names[1]))} · ${x.all.length}×</button>`; }).join('') : `<p class="pn">—</p>`);
  $('#rpop').hidden = false;
}

/* ---------- UI ---------- */
function popClose() { $('#rpop').hidden = true; $('#rpop').dataset.pk = ''; }
function popLayout() {
  const st = A.st(); const row = (k, t, on) => `<button class="po ${on ? 'on' : ''}" data-lay="${k}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('layout'))}</h4>` + ['15', '13q', '13t'].map(k => row(k, R('lay' + k), lay === k)).join('') + `<p class="pn">${esc(R('first'))}: ` + `${A.st().ui === 'en' ? 'only the 11 surahs for now' : A.st().ui === 'ru' ? 'abhi sirf 11 surah' : 'ابھی صرف ۱۱ سورتیں'}</p>`;
  $('#rpop').hidden = false;
}
function popHafiz() {
  const st = A.st(); const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))}</h4><div class="pr"><span>${esc(R('sens'))}</span>${sw('hs', 'h', R('sH'), (st.hs || 'h') === 'h')}${sw('hs', 'n', R('sN'), st.hs === 'n')}${sw('hs', 's', R('sS'), st.hs === 's')}</div>` +
    `<div class="pr"><span>${esc(R('sil'))}</span>${[3.5, 4, 5].map(v => sw('hsil', v, v + ' ' + R('sec'), (st.hsil || 4) === v)).join('')}</div>` +
    `<div class="pr"><span></span>${sw('hmode', 'look', R('look'), (st.hmode || 'look') === 'look')}${sw('hmode', 'mem', R('mem'), st.hmode === 'mem')}</div><p class="pn">${esc(R('info'))}</p>`;
  $('#rpop').hidden = false;
}
function applyZoom(d) { const st = A.st(); st.rz = Math.max(1, Math.min(1.8, Math.round(((st.rz || 1) + d) * 100) / 100)); A.save(); sizePage(); fit(); }
function openAt(s, a) {
  return load().then(() => {
    lay = A.st().lay || '15'; if (!M.L[lay]) lay = '15'; buildIndex();
    let i = 0; const f = LP[locOf(s, a, 1)]; if (f !== undefined) i = f; else { const w = SC.find(x => x.s === s); if (w) i = LP[w.loc]; }
    pi = i; open = true; $('#reader').hidden = false; document.body.classList.add('noscroll'); $('#rhz').hidden = true; hz.on = false; applyRot();
    renderPage(false); if (AYI[s + ':' + a] != null) curAy = { s, a };
    requestAnimationFrame(() => { sizePage(); fit(); });
  });
}
function applyRot() { sizePage(); }
function close() { hzStop(); stopAudio(); open = false; $('#reader').hidden = true; popClose(); A.onClose(); }
function relayout(k) {
  const keep = curAy || (SC[0] && { s: SC[0].s, a: SC[0].a }); const was = hz.on; if (was) hzStop(); stopAudio();
  lay = k; A.st().lay = k; A.save(); buildIndex();
  const w = keep && SC.find(x => x.s === keep.s && x.a === keep.a); pi = w ? LP[w.loc] : 0; okSet = new Set(); renderPage(false);
}
function init(api) {
  A = api;
  $('#rClose').onclick = close; $('#rTitle').onclick = () => A.openMenu();
  $('#rLay').onclick = () => { if ($('#rpop').hidden || !$('#rpop').dataset.pk || $('#rpop').dataset.pk !== 'l') { $('#rpop').dataset.pk = 'l'; popLayout(); } else popClose(); };
  $('#rMinus').onclick = () => applyZoom(-0.15); $('#rPlus').onclick = () => applyZoom(0.15);
  $('#rPrev').onclick = () => goPage(pi - 1); $('#rNext').onclick = () => goPage(pi + 1);
  $('#rPlay').onclick = () => {
    if (hz.on) { hzStop(); return; }
    if (playing) { stopAudio(); return; }
    const st = curAy ? AYI[curAy.s + ':' + curAy.a] : null; let ai = st != null ? st : 0;
    if (st == null) { const w = SC.find(x => LP[x.loc] === pi); if (w) ai = w.ai; } playSeq(ai);
  };
  $('#rMic').onclick = () => { if (hz.on) { hzStopAsk(); return; } if ($('#rpop').dataset.pk === 's' && !$('#rpop').hidden) popClose(); else popSetup(); };
  $('#rhStop').onclick = hzStopAsk; $('#rhSet').onclick = () => { if ($('#rpop').hidden || $('#rpop').dataset.pk !== 'h') { $('#rpop').dataset.pk = 'h'; popHafiz(); } else popClose(); };
  $('#rhMode').onclick = () => { const st = A.st(); st.hmode = st.hmode === 'mem' ? 'look' : 'mem'; A.save(); $('#rpage').classList.toggle('mem', st.hmode === 'mem'); $('#rhMode').textContent = R(st.hmode); };
  $('#rrep').addEventListener('click', e => {
    const b = e.target.closest('[data-rn]'); if (!b) return; const k = b.dataset.rn;
    if (k === 'copy') { const f = $('#rrep')._fin; if (f) { const t = reportText(f.all, f.meta); try { navigator.clipboard.writeText(t); A.toast('✓'); } catch (x) { A.toast(t.slice(0, 200)); } } return; }
    if (k === 'close') { $('#rrep').hidden = true; return; }
    if (k === 'new') { $('#rrep').hidden = true; popSetup(); return; }
    hzRepAction(k);
  });
  $('#rpop').addEventListener('click', e => {
    const l = e.target.closest('[data-lay]'); if (l) { relayout(l.dataset.lay); popClose(); return; }
    const hk = e.target.closest('[data-hk]');
    if (hk && hk.dataset.hk === 'reps') { const pl = Object.assign({}, planDefault()); pl.reps = +hk.dataset.hv; A.st().hplan = pl; A.save(); popSetup(); return; }
    if (hk) { const st = A.st(), k = hk.dataset.hk; st[k] = k === 'hsil' ? +hk.dataset.hv : hk.dataset.hv; A.save(); if (hz.tr && k === 'hs') hz.tr.sens = st.hs; if (k === 'hmode') $('#rpage').classList.toggle('mem', st.hmode === 'mem'); popHafiz(); if (hz.on) $('#rhMode').textContent = R(st.hmode || 'look'); return; }
    if (e.target.closest('[data-hset]')) { $('#rpop').dataset.pk = 'h'; popHafiz(); return; }
    if (e.target.closest('[data-hist]')) { popHist(); return; }
    const q2 = e.target.closest('[data-q]'); if (q2) { setPlanQuick(q2.dataset.q); return; }
    const hi = e.target.closest('[data-hi]'); if (hi) { let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (x) { } const x = h[+hi.dataset.hi]; if (x) { popClose(); if (x.lay && x.lay !== lay) relayout(x.lay); showFinal(x.all, x.meta, true); } return; }
    if (e.target.closest('[data-hres]')) { const st = A.st(), la = st.hlast, pl = Object.assign({}, planDefault()); const fi = AYI[la.s + ':' + la.a]; let ti = AYI[pl.ts + ':' + pl.ta]; if (ti < fi) { let j = fi; while (j + 1 < AY.length && AY[j + 1].s === la.s) j++; ti = j; } const y = AY[fi], z = AY[ti]; hzStart(fi, { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1 }); return; }
    if (e.target.closest('[data-hgo]')) { hzStart(null, readPlan2()); return; }
  });
  $('#rpop').addEventListener('change', e => {
    const id = e.target.id; if (!/^t[ft][SA]$/.test(id)) return;
    if (id === 'tfS' || id === 'ttS') { const s = +e.target.value, sel = $(id === 'tfS' ? '#tfA' : '#ttA'); sel.innerHTML = AY.filter(y => y.s === s).map(y => `<option value="${y.a}">${A.st().ui === 'ur' ? ad(y.a) : y.a}</option>`).join(''); if (id === 'ttS') sel.selectedIndex = sel.options.length - 1; }
    const pl = readPlan(); pl.reps = (A.st().hplan && A.st().hplan.reps) || 1; A.st().hplan = pl; A.save();
  });
  $('#rin').addEventListener('click', e => {
    popClose(); const w = e.target.closest('.wd'); if (!w) return; const [s, a] = w.dataset.loc.split(':').map(Number); const ai = AYI[s + ':' + a]; if (ai == null) return;
    if (hz.on) { if (!hz.busy && ai >= hz.fi && ai <= hz.ti) { hz.tr.setPos(AY[ai].first); clearAyahMarks(ai); markNext(); savePos(ai); hz.lastAct = Date.now() + 1500; hzStatus('listen'); } return; }
    stopAudio(); playSeq(ai);
  });
  /* swipe + keys: RTL book — finger moving right = next page */
  let sx = null, sy = 0; const stg = $('#rstage');
  stg.addEventListener('touchstart', e => { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } else sx = null; }, { passive: true });
  stg.addEventListener('touchend', e => { if (sx == null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && (A.st().rz || 1) <= 1.01) goPage(pi + (dx > 0 ? 1 : -1)); }, { passive: true });
  document.addEventListener('keydown', e => { if (!open) return; if (e.key === 'ArrowLeft') goPage(pi + 1); else if (e.key === 'ArrowRight') goPage(pi - 1); else if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (open) { sizePage(); fit(); } });
  window.addEventListener('orientationchange', () => { if (open) setTimeout(() => { sizePage(); fit(); }, 250); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && hz.on) hzStop(); });
}
window.FahmReader = {
  init, isOpen: () => open,
  open: (s, a) => openAt(s || 1, a || 1),
  gotoSurah: s => { if (!open) return; stopAudio(); if (hz.on) hzStop(); const w = SC.find(x => x.s === s); if (w) { goPage(LP[w.loc]); } },
  back: () => { if (!$('#rpop').hidden) { popClose(); return true; } close(); return true; },
  /* test hooks */
  _hz: () => hz, _plan: () => hz.plan, _sc: () => SC, _heard: onHeard, _page: () => pi
};
})();

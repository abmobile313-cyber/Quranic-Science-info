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
let hz = { on: false, busy: false, tr: null, want: false, lastAct: 0, sil: null, proc: {}, prev: null, sess: 0, startedAt: 0, native: false, sr: null };

const RS = {
  ur: { lay15: '۱۵ لائن (حافظی)', lay13q: '۱۳ لائن · قدرت اللہ', lay13t: '۱۳ لائن · تاج', pg: 'صفحہ', hafiz: 'حافظ موڈ', look: 'دیکھ کر', mem: 'یاد سے', sens: 'سخت گیری', sS: 'سخت', sN: 'درمیانی', sR: 'نرم', sil: 'خاموشی کے بعد لقمہ', sec: 'سیکنڈ', listen: 'سن رہا ہوں… پڑھیے', wrong: 'غلطی! آیت دوبارہ سنیے', luq: 'لقمہ — آیت سنیے', done: 'ماشاء اللہ! مکمل', noRec: 'اس براؤزر میں آواز پہچاننا موجود نہیں۔ Chrome یا Android ایپ استعمال کیجیے۔', mic: 'مائیک کی اجازت نہیں ملی۔', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔', tap: 'کسی آیت پر ٹیپ کریں — وہیں سے شروع', audioErr: 'آڈیو نہیں چلی (انٹرنیٹ دیکھیں)', settings: 'ترتیب', layout: 'قرآن کی ترتیب', stop: 'رکیں', start: 'شروع', from: 'یہاں سے شروع', first: 'پہلا حصہ', page: 'صفحہ' },
  ru: { lay15: '15 Line (Hafizi)', lay13q: '13 Line · Qudratullah', lay13t: '13 Line · Taj', pg: 'Safha', hafiz: 'Hafiz Mode', look: 'Dekh kar', mem: 'Yaad se', sens: 'Sakhti', sS: 'Sakht', sN: 'Darmiyani', sR: 'Narm', sil: 'Khamoshi ke baad lukma', sec: 'second', listen: 'Sun raha hoon… padhiye', wrong: 'Galti! Ayat dobara suniye', luq: 'Lukma — ayat suniye', done: 'MashaAllah! Mukammal', noRec: 'Is browser mein awaaz pehchanna maujood nahin. Chrome ya Android app istemal karein.', mic: 'Mic ki ijazat nahin mili.', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin).', tap: 'Kisi ayat par tap karein — wahin se shuru', audioErr: 'Audio nahin chali (internet dekhein)', settings: 'Settings', layout: 'Quran ka format', stop: 'Rukein', start: 'Shuru', from: 'Yahan se shuru', first: 'Pehla hissa', page: 'Safha' },
  en: { lay15: '15-Line (Hafizi)', lay13q: '13-Line · Qudratullah', lay13t: '13-Line · Taj', pg: 'Page', hafiz: 'Hafiz Mode', look: 'Looking', mem: 'From memory', sens: 'Strictness', sS: 'Strict', sN: 'Normal', sR: 'Relaxed', sil: 'Prompt after silence', sec: 'sec', listen: 'Listening… recite', wrong: 'Mistake! Listen to the ayah', luq: 'Prompt — listen to the ayah', done: 'MashaAllah! Complete', noRec: 'Speech recognition is not available here. Use Chrome or the Android app.', mic: 'Microphone permission was not granted.', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed).', tap: 'Tap any ayah to start from there', audioErr: 'Audio failed (check internet)', settings: 'Settings', layout: 'Mushaf layout', stop: 'Stop', start: 'Start', from: 'Start here', first: 'First part', page: 'Page' }
};
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
function hzStatus(k, cls) { const e = $('#rhSt'); e.textContent = R(k); e.className = cls || ''; }
function markNext() { document.querySelectorAll('#rpage .nx').forEach(e => e.classList.remove('nx')); const w = SC[hz.tr.p]; if (w) { const e = q(w.loc); if (e) { e.classList.add('nx'); const st = $('#rstage'); if (st.scrollHeight > st.clientHeight + 4) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } } }
function setOk(i0, i1) {
  for (let i = i0; i < i1; i++) {
    const w = SC[i]; if (!w) continue; okSet.add(w.loc); const e = q(w.loc); if (e) { e.classList.add('ok'); e.classList.remove('bad'); }
    const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.add(m.dataset.loc); m.classList.add('ok'); }
  }
}
function clearAyahMarks(ai) {
  const y = AY[ai]; for (let i = y.first; i <= y.last; i++) { const w = SC[i]; okSet.delete(w.loc); const e = q(w.loc); if (e) e.classList.remove('ok', 'bad'); const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.delete(m.dataset.loc); m.classList.remove('ok'); } }
}
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
    if (ev.t === 'ok') { setOk(ev.from, ev.to); hz.lastAct = Date.now(); }
    else if (ev.t === 'mistake') { hzMistake(ev); return; }
    else if (ev.t === 'end') { hzFinish(); return; }
  }
  if (hz.tr.p !== p0) { const w = SC[Math.min(hz.tr.p, SC.length - 1)]; if (w) ensureLoc(w.loc); markNext(); }
}
function hzResume(ai) {
  const y = AY[ai]; clearAyahMarks(ai); hz.tr.setPos(y.first); markNext(); hz.busy = false; hz.lastAct = Date.now() + 600; hzStatus('listen'); recStart();
}
function hzMistake(ev) {
  hz.busy = true; recStop(); const w = SC[ev.idx], ai = w.ai, y = AY[ai];
  const e = q(w.loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(w.loc);
  hzStatus('wrong', 'bad'); beep();
  setTimeout(() => { if (!hz.on) return; playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); }); }, 650);
}
function hzLukma() {
  if (hz.busy || !hz.tr || hz.tr.done()) return; hz.busy = true; recStop();
  const w = SC[hz.tr.p], ai = w.ai, y = AY[ai]; hzStatus('luq', 'warn');
  ensureLoc(w.loc); playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); });
}
function hzFinish() { hz.busy = true; recStop(); hzStatus('done', 'ok'); A.toast(R('done'), 3500); setTimeout(() => { if (hz.on) hzStop(); }, 1800); }
function hzStart(fromAi) {
  stopAudio(); unlockAc();
  hz.native = nativeOk(); if (!hz.native && !webOk()) { A.toast(R('noRec'), 4500); return; }
  const st = A.st(); if (!st.hs) st.hs = 'n'; if (!st.hsil) st.hsil = 3.5; if (!st.hmode) st.hmode = 'look';
  hz.tr = new H.Tracker(SC, st.hs, STARTS); let ai = fromAi != null ? fromAi : (curAy && AYI[curAy.s + ':' + curAy.a] != null ? AYI[curAy.s + ':' + curAy.a] : AYI[(PG[pi] && SC.find(w => LP[w.loc] === pi) || SC[0]).s + ':' + (SC.find(w => LP[w.loc] === pi) || SC[0]).a]);
  if (ai == null) ai = 0; hz.tr.setPos(AY[ai].first); okSet = new Set(); clearHl(); curAy = null;
  hz.on = true; hz.want = true; hz.busy = false; hz.startedAt = Date.now(); hz.lastAct = Date.now() + 3000; $('#rhz').hidden = false; $('#rhMode').textContent = R(st.hmode); $('#rMic').classList.add('on'); $('#rpage').classList.toggle('mem', st.hmode === 'mem');
  renderPage(false); ensureLoc(SC[hz.tr.p].loc); markNext(); hzStatus('listen'); A.save();
  clearInterval(hz.sil); hz.sil = setInterval(() => { if (hz.on && !hz.busy && Date.now() - hz.lastAct > (A.st().hsil || 3.5) * 1000) hzLukma(); }, 250);
  recStart();
}
function hzStop() {
  hz.on = false; hz.want = false; hz.busy = false; recStop(); clearInterval(hz.sil); stopAudio(); $('#rhz').hidden = true; $('#rMic').classList.remove('on');
  $('#rpage').classList.remove('mem'); document.querySelectorAll('#rpage .nx,#rpage .bad,#rpage .ok').forEach(e => e.classList.remove('nx', 'bad', 'ok')); okSet = new Set();
}

/* ---------- UI ---------- */
function popClose() { $('#rpop').hidden = true; }
function popLayout() {
  const st = A.st(); const row = (k, t, on) => `<button class="po ${on ? 'on' : ''}" data-lay="${k}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('layout'))}</h4>` + ['15', '13q', '13t'].map(k => row(k, R('lay' + k), lay === k)).join('') + `<p class="pn">${esc(R('first'))}: ` + `${A.st().ui === 'en' ? 'only the 11 surahs for now' : A.st().ui === 'ru' ? 'abhi sirf 11 surah' : 'ابھی صرف ۱۱ سورتیں'}</p>`;
  $('#rpop').hidden = false;
}
function popHafiz() {
  const st = A.st(); const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))}</h4><div class="pr"><span>${esc(R('sens'))}</span>${sw('hs', 's', R('sS'), st.hs === 's')}${sw('hs', 'n', R('sN'), (st.hs || 'n') === 'n')}${sw('hs', 'r', R('sR'), st.hs === 'r')}</div>` +
    `<div class="pr"><span>${esc(R('sil'))}</span>${[2.5, 3.5, 5].map(v => sw('hsil', v, v + ' ' + R('sec'), (st.hsil || 3.5) === v)).join('')}</div>` +
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
  $('#rLay').onclick = () => { if ($('#rpop').hidden || !$('#rpop').dataset.k || $('#rpop').dataset.k !== 'l') { $('#rpop').dataset.k = 'l'; popLayout(); } else popClose(); };
  $('#rMinus').onclick = () => applyZoom(-0.15); $('#rPlus').onclick = () => applyZoom(0.15);
  $('#rPrev').onclick = () => goPage(pi - 1); $('#rNext').onclick = () => goPage(pi + 1);
  $('#rPlay').onclick = () => {
    if (hz.on) { hzStop(); return; }
    if (playing) { stopAudio(); return; }
    const st = curAy ? AYI[curAy.s + ':' + curAy.a] : null; let ai = st != null ? st : 0;
    if (st == null) { const w = SC.find(x => LP[x.loc] === pi); if (w) ai = w.ai; } playSeq(ai);
  };
  $('#rMic').onclick = () => { if (hz.on) { hzStop(); return; } hzStart(); A.toast(R('tap') + ' · ' + R('info'), 4200); };
  $('#rhStop').onclick = hzStop; $('#rhSet').onclick = () => { if ($('#rpop').hidden || $('#rpop').dataset.k !== 'h') { $('#rpop').dataset.k = 'h'; popHafiz(); } else popClose(); };
  $('#rhMode').onclick = () => { const st = A.st(); st.hmode = st.hmode === 'mem' ? 'look' : 'mem'; A.save(); $('#rpage').classList.toggle('mem', st.hmode === 'mem'); $('#rhMode').textContent = R(st.hmode); };
  $('#rpop').addEventListener('click', e => {
    const l = e.target.closest('[data-lay]'); if (l) { relayout(l.dataset.lay); popClose(); return; }
    const h = e.target.closest('[data-hk]'); if (h) { const st = A.st(), k = h.dataset.hk; st[k] = k === 'hsil' ? +h.dataset.hv : h.dataset.hv; A.save(); if (hz.tr && k === 'hs') hz.tr.sens = st.hs; if (k === 'hmode') $('#rpage').classList.toggle('mem', st.hmode === 'mem'); popHafiz(); $('#rhMode').textContent = R(st.hmode || 'look'); }
  });
  $('#rin').addEventListener('click', e => {
    popClose(); const w = e.target.closest('.wd'); if (!w) return; const [s, a] = w.dataset.loc.split(':').map(Number); const ai = AYI[s + ':' + a]; if (ai == null) return;
    if (hz.on) { if (!hz.busy) { hz.tr.setPos(AY[ai].first); clearAyahMarks(ai); for (let i = 0; i < ai; i++); markNext(); hz.lastAct = Date.now() + 1500; hzStatus('listen'); } return; }
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
  _hz: () => hz, _sc: () => SC, _heard: onHeard, _page: () => pi
};
})();

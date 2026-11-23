/* Ustad recording mode: the teacher reads every item of a page in order. Each tap on "Agla" marks where an item ends.
   Recordings stay on this phone (IndexedDB) and play at once inside the app; "Bhejein" exports one zip that is turned
   into per-item audio for everyone in the next update. */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const Q = () => window.Qaida;
const TX = {
  ru: { t: 'Ustad ki awaaz', start: '● Record shuru', next: 'Agla ▶', redo: '↺ Dobara', undo: '◀ Wapas', stop: '■ Ruk jayein', done: 'Safha record ho gaya', save: '✓ Mehfooz', play: '▶ Suniye', exp: '⬆ Saari recordings bhejein', expS: 'Ek zip file banegi. Use WhatsApp ya Claude chat mein bhej dijiye.', none: 'Abhi koi recording nahi', pages: 'Record shuda safhe', help: 'Har khane ko saaf aur thehar kar padhiye. Padhne ke baad "Agla" dabaiye. Galti ho to "Dobara" dabakar wahi khana phir padhiye.', mic: 'Mic ki ijazat dijiye', del: 'Is safhe ki recording mitayein', item: 'Khana', of: 'mein se', pg: 'Takhti', prev: '◀ Pichhla safha', nxp: 'Agla safha ▶', saved: 'Recording mehfooz ho gayi', exported: 'File tayyar hai' },
  ur: { t: 'استاد کی آواز', start: '● ریکارڈ شروع', next: 'اگلا ▶', redo: '↺ دوبارہ', undo: '◀ واپس', stop: '■ رک جائیں', done: 'صفحہ ریکارڈ ہو گیا', save: '✓ محفوظ', play: '▶ سنیے', exp: '⬆ ساری ریکارڈنگز بھیجیں', expS: 'ایک زپ فائل بنے گی، اسے واٹس ایپ یا Claude چیٹ میں بھیج دیجیے۔', none: 'ابھی کوئی ریکارڈنگ نہیں', pages: 'ریکارڈ شدہ صفحے', help: 'ہر خانے کو صاف اور ٹھہر کر پڑھیے۔ پڑھنے کے بعد "اگلا" دبائیے۔ غلطی ہو تو "دوبارہ" دبا کر وہی خانہ پھر پڑھیے۔', mic: 'مائک کی اجازت دیجیے', del: 'اس صفحے کی ریکارڈنگ مٹائیں', item: 'خانہ', of: 'میں سے', pg: 'تختی', prev: '◀ پچھلا صفحہ', nxp: 'اگلا صفحہ ▶', saved: 'ریکارڈنگ محفوظ ہو گئی', exported: 'فائل تیار ہے' },
  en: { t: 'Teacher voice', start: '● Start recording', next: 'Next ▶', redo: '↺ Again', undo: '◀ Back', stop: '■ Stop', done: 'Page recorded', save: '✓ Saved', play: '▶ Listen', exp: '⬆ Send all recordings', expS: 'Creates one zip file. Send it on WhatsApp or in the Claude chat.', none: 'No recordings yet', pages: 'Recorded pages', help: 'Read each box clearly with a short pause. Tap "Next" after each one. If you make a mistake, tap "Again" and read the same box again.', mic: 'Please allow the microphone', del: 'Delete this page recording', item: 'Box', of: 'of', pg: 'Lesson', prev: '◀ Previous page', nxp: 'Next page ▶', saved: 'Recording saved', exported: 'File ready' }
};
const t = k => (TX[(Q() && Q().S.ui) || 'ru'] || TX.ru)[k];

/* ---- IndexedDB ---- */
let dbp = null;
function db() { if (dbp) return dbp; dbp = new Promise((res, rej) => { const r = indexedDB.open('qaida-rec', 1); r.onupgradeneeded = () => r.result.createObjectStore('pages', { keyPath: 'p' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); return dbp; }
async function put(o) { const d = await db(); return new Promise(r => { const tx = d.transaction('pages', 'readwrite'); tx.objectStore('pages').put(o); tx.oncomplete = () => r(true); tx.onerror = () => r(false); }); }
async function all() { const d = await db(); return new Promise(r => { const q = d.transaction('pages').objectStore('pages').getAll(); q.onsuccess = () => r(q.result || []); q.onerror = () => r([]); }); }
async function del(p) { const d = await db(); return new Promise(r => { const tx = d.transaction('pages', 'readwrite'); tx.objectStore('pages').delete(p); tx.oncomplete = () => r(true); }); }

/* ---- local playback map: item id -> {url,start,end} from the teacher's own recordings ---- */
const MAP = {};
function index(rec) {
  if (!rec || !rec.blob) return; const url = URL.createObjectURL(rec.blob);
  segs(rec).forEach(s => { MAP[s.id] = { url, start: s.start, end: s.end, kind: 'u', blob: 1 }; });
}
function segs(rec) { /* events: [{i, a:'s'|'e', t}] — the last start of an item wins */
  const out = {}, ev = rec.ev || [];
  ev.forEach((e, k) => { if (e.a !== 's') return; const nx = ev.slice(k + 1).find(x => x.a === 'e' || x.a === 's'); out[e.id] = { id: e.id, start: Math.max(0, e.t - .08), end: nx ? nx.t + .12 : rec.dur || e.t + 3 }; });
  return Object.values(out);
}
all().then(rs => { rs.forEach(index); try { Q() && Q().refresh && document.getElementById('pg').classList.contains('on') && Q().refresh(); } catch (e) { } }).catch(() => { });

/* ---- recorder UI ---- */
let el = null, st = null, ONLY = false;
function open(p) {
  close(); const q = Q(); q.stop();
  el = document.createElement('div'); el.id = 'rec';
  el.innerHTML = `<div class="rtop"><button class="ib" data-r="close" aria-label="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>🎙 ${t('t')}</b><button class="ib" data-r="only" aria-label="only remaining" style="font-size:12px;width:auto;padding:0 10px">${ONLY ? '★ Baqi' : '☆ Sab'}</button><button class="ib" data-r="list" aria-label="list"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg></button></div>
  <div class="rpage"></div>
  <div class="rpanel"><div class="rinfo"><span class="ri"></span><span class="rt"></span></div><div class="lvl"><i></i></div><div class="cur"></div><div class="rbtns"></div><p class="rh" style="color:var(--mut);font-size:12px;margin:8px 0 0">${t('help')}</p></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', onClick);
  st = { p, i: 0, ids: [], ev: [], mr: null, chunks: [], t0: 0, on: false };
  load(p);
}
function load(p) {
  const q = Q(); st.p = p; st.i = 0; st.ev = []; st.on = false;
  el.querySelector('.rpage').innerHTML = q.takhtiHTML(q.BYT[p]); q.fit(el.querySelector('.rpage'));
  const EL = new Set((q.AU && q.AU()._el) || []);
  el.querySelectorAll('.rpage [data-id]').forEach(e => EL.has(e.dataset.id) && e.classList.add('elx'));
  st.ids = [...el.querySelectorAll('.rpage [data-id]')].map(e => e.dataset.id).filter(id => !ONLY || EL.has(id));
  paint();
}
function paint() {
  if (!el) return; const id = st.ids[st.i], q = Q();
  el.querySelectorAll('.rpage .on').forEach(e => e.classList.remove('on'));
  const c = id && el.querySelector(`.rpage [data-id="${id}"]`); if (c) { c.classList.add('on'); c.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  el.querySelector('.ri').textContent = `${t('pg')} ${st.p} · ${t('item')} ${Math.min(st.i + 1, st.ids.length)} ${t('of')} ${st.ids.length}`;
  el.querySelector('.cur').innerHTML = c ? c.innerHTML.replace(/<span class="nm">.*?<\/span>/, '') : '✓';
  const b = el.querySelector('.rbtns');
  if (!st.on) b.innerHTML = `<button data-r="prevp">${t('prev')}</button><button class="go" data-r="start">${t('start')}</button><button data-r="nextp">${t('nxp')}</button>`;
  else b.innerHTML = `<button data-r="redo">${t('redo')}</button><button class="nx" data-r="next">${t('next')}</button><button data-r="stop">${t('stop')}</button>`;
  el.querySelector('.rt').innerHTML = st.on ? '<span class="live"></span>REC' : '';
}
const now = () => (performance.now() - st.t0) / 1000;
async function start() {
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true, channelCount: 1 } }); }
  catch (e) { Q().toast(t('mic')); return; }
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 96000 } : undefined);
  st.mr = mr; st.chunks = []; st.stream = stream; st.mime = mr.mimeType || mime;
  mr.ondataavailable = e => e.data && e.data.size && st.chunks.push(e.data);
  mr.start(500); st.t0 = performance.now(); st.on = true; st.i = 0; st.ev = [{ id: st.ids[0], a: 's', t: 0 }];
  meter(stream); paint();
}
function meter(stream) {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)(), an = ac.createAnalyser(); an.fftSize = 512; ac.createMediaStreamSource(stream).connect(an); st.ac = ac;
    const buf = new Uint8Array(an.fftSize), bar = el.querySelector('.lvl i');
    const tick = () => { if (!st || !st.on) return; an.getByteTimeDomainData(buf); let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128)); bar.style.width = Math.min(100, m / 128 * 160) + '%'; requestAnimationFrame(tick); };
    tick();
  } catch (e) { }
}
function next() {
  const tm = now(); st.ev.push({ id: st.ids[st.i], a: 'e', t: tm }); st.i++;
  if (st.i >= st.ids.length) { finish(); return; }
  st.ev.push({ id: st.ids[st.i], a: 's', t: tm }); navigator.vibrate && navigator.vibrate(15); paint();
}
function redo() { const tm = now(); st.ev.push({ id: st.ids[st.i], a: 's', t: tm }); navigator.vibrate && navigator.vibrate([10, 40, 10]); Q().toast('↺'); }
function finish() {
  if (!st.mr) return; const mr = st.mr, p = st.p, ev = st.ev.slice(), dur = now(), mime = st.mime;
  st.on = false; mr.onstop = async () => {
    const blob = new Blob(st.chunks, { type: mime || 'audio/webm' });
    try { st.stream.getTracks().forEach(x => x.stop()); st.ac && st.ac.close(); } catch (e) { }
    const rec = { p, ev, dur, blob, mime: blob.type, at: Date.now() }; await put(rec); index(rec); Q().toast(t('saved'));
    st.mr = null; paint(); listView();
  };
  mr.stop();
}
async function listView() {
  if (!el) return; const rs = (await all()).sort((a, b) => a.p - b.p);
  const sh = document.getElementById('sheet');
  sh.innerHTML = `<div class="sh"><div class="sh-h"><button class="ib" data-x aria-label="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>${t('pages')}</b></div>
   ${rs.length ? rs.map(r => `<div class="row"><label>${t('pg')} ${r.p}<small>${new Date(r.at).toLocaleString()} · ${Math.round(r.dur)}s · ${segs(r).length}</small></label><div class="seg"><button data-pl="${r.p}">${t('play')}</button><button data-go="${r.p}">●</button><button data-del="${r.p}">✕</button></div></div>`).join('') : `<p>${t('none')}</p>`}
   <button class="btn g" data-exp>${t('exp')}</button><p style="color:var(--mut);font-size:12px">${t('expS')}</p></div>`;
  sh.hidden = false;
  sh.onclick = async e => {
    if (e.target === sh || e.target.closest('[data-x]')) { sh.hidden = true; sh.innerHTML = ''; return; }
    const pl = e.target.closest('[data-pl]'); if (pl) { const r = rs.find(x => x.p == pl.dataset.pl); const a = Q().A; a.src = URL.createObjectURL(r.blob); a.currentTime = 0; a.play().catch(() => { }); return; }
    const go = e.target.closest('[data-go]'); if (go) { sh.hidden = true; load(+go.dataset.go); return; }
    const d = e.target.closest('[data-del]'); if (d && confirm(t('del') + '?')) { await del(+d.dataset.del); Object.keys(MAP).forEach(k => k.startsWith(d.dataset.del + '-') && delete MAP[k]); listView(); return; }
    if (e.target.closest('[data-exp]')) exportAll(rs);
  };
}
/* zip (store) of every page recording + events json */
const CRC = (() => { const tb = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = tb[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }; })();
function zip(files) { const enc = new TextEncoder(), parts = [], cen = []; let off = 0; for (const [name, data] of files) { const nm = enc.encode(name), crc = CRC(data); const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nm.length, true); parts.push(new Uint8Array(h.buffer), nm, data); const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true); cen.push(new Uint8Array(c.buffer), nm); off += 30 + nm.length + data.length; } let cl = 0; cen.forEach(x => cl += x.length); const e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cl, true); e.setUint32(16, off, true); return new Blob([...parts, ...cen, new Uint8Array(e.buffer)], { type: 'application/zip' }); }
async function exportAll(rs) {
  if (!rs.length) { Q().toast(t('none')); return; }
  const files = [], meta = [];
  for (const r of rs) { const ext = /mp4/.test(r.mime) ? 'm4a' : /ogg/.test(r.mime) ? 'ogg' : 'webm'; files.push([`p${String(r.p).padStart(2, '0')}.${ext}`, new Uint8Array(await r.blob.arrayBuffer())]); meta.push({ p: r.p, file: `p${String(r.p).padStart(2, '0')}.${ext}`, dur: r.dur, ev: r.ev, at: r.at }); }
  files.push(['events.json', new TextEncoder().encode(JSON.stringify(meta))]);
  const blob = zip(files), name = 'qaida_awaaz_' + new Date().toISOString().slice(0, 10) + '.zip';
  if (window.QaidaAndroid && QaidaAndroid.saveBegin) {
    const b = new Uint8Array(await blob.arrayBuffer()); QaidaAndroid.saveBegin(name);
    for (let i = 0; i < b.length; i += 384 * 1024) { let s = ''; const part = b.subarray(i, i + 384 * 1024); for (let j = 0; j < part.length; j += 8192) s += String.fromCharCode.apply(null, part.subarray(j, j + 8192)); QaidaAndroid.saveChunk(btoa(s)); }
    QaidaAndroid.saveEnd(); Q().toast(t('exported'));
  } else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); Q().toast(t('exported')); }
}
function onClick(e) {
  const b = e.target.closest('[data-r]'); if (!b) return; const a = b.dataset.r;
  if (a === 'close') close(); else if (a === 'start') start(); else if (a === 'next') next(); else if (a === 'redo') redo(); else if (a === 'stop') finish();
  else if (a === 'list') listView();
  else if (a === 'only') { if (st.on) return; ONLY = !ONLY; b.textContent = ONLY ? '★ Baqi' : '☆ Sab'; load(st.p); }
  else if (a === 'prevp' || a === 'nextp') { const O = Q().ORDER, i = O.indexOf(st.p) + (a === 'nextp' ? 1 : -1); if (i >= 0 && i < O.length) load(O[i]); }
}
function close() { if (!el) return; if (st && st.on) finish(); el.remove(); el = null; const sh = document.getElementById('sheet'); if (sh && !sh.hidden && sh.querySelector('[data-exp]')) { sh.hidden = true; sh.innerHTML = ''; } try { Q().refresh(); } catch (e) { } }
window.QaidaRec = { open, close, isOpen: () => !!el, src: id => MAP[id] || null, all, segs };
})();

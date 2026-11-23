/* Noorani Qaida by Quranic Science — page-exact Noorani Qaida (Maulana Noor Muhammad Ludhianvi, takhti 1–17)
   with tap-to-hear for every letter, syllable and word. */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const LS = 'qaida.v1';
const S = Object.assign({ ui: 'ru', rep: 1, page: 2, heard: {}, done: {}, auto: 1, hid: 1, gap: 1 }, (() => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } };

/* ---------- texts ---------- */
const TK = {
  1: ['Huroof-e-Mufradaat', 'Single letters'], 2: ['Huroof-e-Murakkabaat', 'Joined letters'], 3: ['Huroof-e-Muqatta\'aat', 'Disjointed letters'],
  4: ['Harakaat', 'Short vowels'], 5: ['Tanween', 'Nunation'], 6: ['Mashq: Harakaat o Tanween', 'Practice: vowels & tanween'],
  7: ['Khara Zabar, Khari Zer, Ulta Pesh', 'Standing vowels'], 8: ['Madd o Leen', 'Long & soft letters'], 9: ['Mashq: sab qawaid', 'Practice: all rules'],
  10: ['Sukoon yaani Jazm', 'Sukoon (Jazm)'], 11: ['Mashq-e-Sukoon', 'Practice: sukoon'], 12: ['Tashdeed', 'Shaddah'], 13: ['Mashq-e-Tashdeed', 'Practice: shaddah'],
  14: ['Tashdeed ma\'a Sukoon', 'Shaddah with sukoon'], 15: ['Tashdeed ma\'a Tashdeed', 'Shaddah with shaddah'], 16: ['Tashdeed ba\'d Huroof-e-Madda', 'Shaddah after long letters'],
  17: ['Khatma: Ijra-e-Qawaid', 'Closing rules'], 0: ['Zameema: Rasm-ul-Khat', 'Appendix: Quranic spelling']
};
const L = {
  ru: { hT: 'Noorani Qaida — har harf ki awaaz ke saath', hD: 'Bilkul kitaab jaisa. Kisi bhi harf ya lafz par tap karein, woh padha jayega. Poora safha bhi chala sakte hain.', go: 'Shuru karein', cont: 'Jaari rakhein · safha ', sec: 'Takhtiyan', page: 'Safha', of: '', takhti: 'Takhti', done: 'mukammal', rep: 'Har lafz kitni baar', auto: 'Safha khatm ho to agla safha', on: 'Haan', off: 'Nahin', hid: 'Hidayaat dikhayein', set: 'Settings', lang: 'Zaban', rec: 'Ustad ki awaaz record karein', recS: 'Har lafz apni awaaz mein record karein (sirf ustad ke liye)', upd: 'Update check karein', noA: 'Is ki awaaz jald aa rahi hai', mash: 'MashaAllah! Safha mukammal', qz: 'Suno aur pehchano', qzS: 'Awaaz suniye aur sahi khana chuniye', score: 'Score', again: 'Phir se suniye', nextQ: 'Agla', qzNo: 'Is safhe par abhi awaaz wale khane kam hain', help: 'Is takhti ki hidayaat', lg: 'Rang ka matlab', gap: 'Lafzon ke beech waqfa', reset: 'Progress mitayein', resetQ: 'Sach mein saari progress mitani hai?', aud: 'Awaaz', audR: 'Ustad ki awaaz', audQ: 'Qari (Quran) ki awaaz', heard: 'suna', play: 'Poora safha suniye' },
  ur: { hT: 'نورانی قاعدہ — ہر حرف کی آواز کے ساتھ', hD: 'بالکل کتاب جیسا۔ کسی بھی حرف یا لفظ پر ٹیپ کریں، وہ پڑھا جائے گا۔ پورا صفحہ بھی چلا سکتے ہیں۔', go: 'شروع کریں', cont: 'جاری رکھیں · صفحہ ', sec: 'تختیاں', page: 'صفحہ', of: '', takhti: 'تختی', done: 'مکمل', rep: 'ہر لفظ کتنی بار', auto: 'صفحہ ختم ہو تو اگلا صفحہ', on: 'ہاں', off: 'نہیں', hid: 'ہدایات دکھائیں', set: 'ترتیبات', lang: 'زبان', rec: 'استاد کی آواز ریکارڈ کریں', recS: 'ہر لفظ اپنی آواز میں ریکارڈ کریں (صرف استاد کے لیے)', upd: 'اپڈیٹ چیک کریں', noA: 'اس کی آواز جلد آ رہی ہے', mash: 'ماشاءاللہ! صفحہ مکمل', qz: 'سنو اور پہچانو', qzS: 'آواز سنیں اور صحیح خانہ چنیں', score: 'اسکور', again: 'پھر سے سنیں', nextQ: 'اگلا', qzNo: 'اس صفحے پر ابھی آواز والے خانے کم ہیں', help: 'اس تختی کی ہدایات', lg: 'رنگ کا مطلب', gap: 'لفظوں کے بیچ وقفہ', reset: 'پروگریس مٹائیں', resetQ: 'کیا واقعی ساری پروگریس مٹانی ہے؟', aud: 'آواز', audR: 'استاد کی آواز', audQ: 'قاری (قرآن) کی آواز', heard: 'سنا', play: 'پورا صفحہ سنیں' },
  en: { hT: 'Noorani Qaida — every letter with sound', hD: 'Exactly like the book. Tap any letter or word to hear it, or play the whole page.', go: 'Start', cont: 'Continue · page ', sec: 'Lessons (Takhti)', page: 'Page', of: '', takhti: 'Lesson', done: 'done', rep: 'Repeat each item', auto: 'Go to next page automatically', on: 'On', off: 'Off', hid: 'Show teacher notes', set: 'Settings', lang: 'Language', rec: 'Record teacher voice', recS: 'Record every item in your own voice (teachers only)', upd: 'Check for update', noA: 'Audio for this is coming soon', mash: 'MashaAllah! Page complete', qz: 'Listen & find', qzS: 'Listen and tap the right box', score: 'Score', again: 'Listen again', nextQ: 'Next', qzNo: 'Not enough audio on this page yet', help: 'Notes for this lesson', lg: 'Colour key', gap: 'Pause between items', reset: 'Reset progress', resetQ: 'Really erase all progress?', aud: 'Audio', audR: 'Teacher voice', audQ: 'Qari (Quran) voice', heard: 'heard', play: 'Play whole page' }
};
const T = k => (L[S.ui] || L.ru)[k] || L.ru[k] || k;
const LEG = [['g', 'Mota (pur) harf', 'موٹا حرف', 'Heavy letter'], ['o', 'Ikhfa', 'اخفا', 'Ikhfa'], ['b', 'Qalqala', 'قلقلہ', 'Qalqalah'], ['r', 'Ghunna', 'غنہ', 'Ghunnah']];

/* ---------- data ---------- */
let D = null, AU = {}, QM = {}, HID = {}, PAGES = [], TAK = {}, ORDER = [];
const BYP = {};
async function load() {
  const j = u => fetch(u).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  [D, AU, QM, HID] = await Promise.all([j('q/qaida.json'), j('q/audio.json'), j('q/qmatch.json'), j('q/hid.json')]);
  PAGES = D.pages || []; PAGES.forEach(p => { BYP[p.p] = p; });
  let cur = 1;
  PAGES.forEach(p => { p.tk = []; let first = true; p.blocks.forEach(b => { if (b.t === 'head') { cur = b.n; if (!TAK[cur]) TAK[cur] = { n: cur, title: b.title, pages: [] }; if (first && !p.blocks.slice(0, p.blocks.indexOf(b)).some(x => x.t === 'grid' || x.t === 'lines')) first = false; } }); });
  /* which takhti each page belongs to (for the header) and each takhti's page range */
  cur = 1; PAGES.forEach(p => { const heads = p.blocks.filter(b => b.t === 'head').map(b => b.n); const startsWithContent = p.blocks.findIndex(b => b.t === 'grid' || b.t === 'lines' || b.t === 'table') < p.blocks.findIndex(b => b.t === 'head'); p.tks = []; if (!heads.length || startsWithContent) p.tks.push(cur); heads.forEach(h => { p.tks.push(h); cur = h; }); p.tks.forEach(t => TAK[t] && !TAK[t].pages.includes(p.p) && TAK[t].pages.push(p.p)); p.tk = p.tks[p.tks.length - 1]; });
  ORDER = PAGES.map(p => p.p);
}

/* ---------- tajweed colouring (same colour code as the printed qaida) ---------- */
const MARK = /[ً-ٰٟۖ-ۭ࣓-ࣿ]/;
const HEAVY = 'خصضغطقظ', QAL = 'قطبجد', IKH = 'تثجدذزسشصضطظفقك';
const NOLEFT = 'اأإآٱدذرزژوؤءةۀ', NOJOIN = 'ء';
const joinsNext = c => !NOLEFT.includes(c) && /[\u0620-\u064A\u066E-\u06D3\u06FA-\u06FF]/.test(c);
const joinsPrev = c => !NOJOIN.includes(c) && /[\u0620-\u064A\u066E-\u06D3\u06FA-\u06FF]/.test(c);
function graphemes(s) { const g = []; for (const ch of s) { if (MARK.test(ch) && g.length) g[g.length - 1] += ch; else g.push(ch); } return g; }
const has = (g, m) => g.indexOf(m) > 0;
function colourWord(s, mode, idx) {
  const g = graphemes(s), out = []; let alt = idx || 0;
  for (let i = 0; i < g.length; i++) {
    const x = g[i], c = x[0];
    if (c === ' ') { out.push(' '); continue; }
    let col = null;
    if (mode !== 'alt') {
      const sk = has(x, 'ْ'), sh = has(x, 'ّ'), kas = has(x, 'ِ') || has(x, 'ٍ');
      const tanw = /[ً-ٍ]/.test(x);
      let nx = ''; for (let j = i + 1; j < g.length; j++) { const b = g[j][0]; if (b === ' ' || 'اى'.includes(b) && !MARK.test(g[j].slice(1))) continue; nx = b; break; }
      if ((c === 'ن' && sk || tanw) && nx && IKH.includes(nx)) col = 'o';
      else if ((c === 'ن' || c === 'م') && sh) col = 'r';
      else if (QAL.includes(c) && sk) col = 'b';
      else if (HEAVY.includes(c)) col = 'g';
      else if (c === 'ر') { if (kas) col = 'k'; else if (sk) { const pv = g[i - 1] || ''; col = has(pv, 'ِ') ? 'k' : 'g'; } else col = 'g'; }
    }
    if (!col) col = mode === 'auto' ? 'm' : (alt++ % 2 ? 'k' : 'm');
    out.push([col, x]);
  }
  /* keep Arabic letters joined across colour changes: zero-width joiners at the span edges */
  let h = '';
  for (let i = 0; i < out.length; i++) {
    const it = out[i]; if (typeof it === 'string') { h += it; continue; }
    const pv = out[i - 1], nx = out[i + 1];
    const jp = pv && typeof pv !== 'string' && joinsNext(pv[1][0]) && joinsPrev(it[1][0]);
    const jn = nx && typeof nx !== 'string' && joinsNext(it[1][0]) && joinsPrev(nx[1][0]);
    h += `<span class="c-${it[0]}">${jp ? '\u200d' : ''}${esc(it[1])}${jn ? '\u200d' : ''}</span>`;
  }
  return h;
}

/* ---------- page rendering ---------- */
function fsFor(cols, cells, mode) {
  const W = Math.min(560, innerWidth - 16) - 40, len = Math.max(1, ...cells.map(c => graphemes(c.ar || '').length));
  const per = W / cols; let fs = per * (len <= 1 ? .6 : len <= 2 ? .56 : len <= 3 ? .52 : len <= 5 ? .46 : .4);
  return Math.max(20, Math.min(52, fs));
}
function bookHTML(p) {
  if (!p) return '';
  let h = `<div class="book" data-p="${p.p}"><span class="bno">${p.p}</span><div class="bin">`, wi = 0;
  for (const b of p.blocks) {
    if (b.t === 'head') h += `<div class="ban"><div>${b.n ? `تختی نمبر <span class="n">${b.n}</span> ` : ''}${esc(b.title)}</div></div>`;
    else if (b.t === 'bism') h += `<div class="ban bism"><div>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div></div>`;
    else if (b.t === 'hid' || b.t === 'note') { if (S.hid || b.t === 'note') h += `<div class="hid ${b.t === 'note' ? 'note' : ''}">${hidHTML(b.ur)}</div>`; }
    else if (b.t === 'foot') h += `<div class="foot">${footHTML(b.ur)}</div>`;
    else if (b.t === 'grid') {
      const cells = b.rows.flatMap(r => r.cells); const fs = fsFor(b.cols, cells, b.mode);
      h += `<div class="grid" style="grid-template-columns:repeat(${b.cols},1fr);--fs:${fs}px;--ch:${Math.round(fs * 1.75)}px">`;
      for (const r of b.rows) {
        let used = r.cells.reduce((a, c) => a + (c.span || 1), 0), pad = r.c ? Math.floor((b.cols - used) / 2) : 0;
        if (r.c) for (let k = 0; k < pad; k++) h += '<div class="cell"></div>';
        for (const c of r.cells) {
          if (c.mark) { h += `<div class="cell mk">${esc(c.mark)}</div>`; continue; }
          const inner = c.col ? `<span class="c-${c.col}">${esc(c.ar)}</span>` : b.quran ? `<span class="c-${wi++ % 2 ? 'g' : 'm'}">${esc(c.ar)}</span>` : colourWord(c.ar, b.mode, wi++);
          h += `<div class="cell ${S.heard[c.id] ? 'heard' : ''}" data-id="${c.id}"${c.span ? ` style="grid-column:span ${c.span}"` : ''}>${inner}${c.name ? `<span class="nm">${esc(c.name)}</span>` : ''}</div>`;
        }
        if (r.c) for (let k = 0; k < b.cols - used - pad; k++) h += '<div class="cell"></div>';
        else for (let k = used; k < b.cols; k++) h += '<div class="cell"></div>';
      }
      h += '</div>';
    } else if (b.t === 'lines') {
      const W = Math.min(560, innerWidth - 16) - 40; let maxw = 0;
      b.rows.forEach(r => { const n = r.cells.reduce((a, c) => a + (c.ar ? graphemes(c.ar).length + 1.2 : 1), 0); maxw = Math.max(maxw, n); });
      const fs = Math.max(22, Math.min(44, W / maxw * 2));
      h += `<div class="lines" style="--fs:${fs}px">`;
      for (const r of b.rows) {
        h += `<div class="ln ${r.cells.length < 4 ? 'c' : ''}">`;
        for (const c of r.cells) h += c.mark ? `<span class="mk">${esc(c.mark)}</span>` : `<span class="w ${S.heard[c.id] ? 'heard' : ''}" data-id="${c.id}">${colourWord(c.ar, 'word', wi++)}</span>`;
        h += '</div>';
      }
      h += '</div>';
    } else if (b.t === 'table') {
      h += `<table class="tbl"><tr><th>#</th><th>لکھنے کی صورت</th><th>پڑھنے کی صورت</th></tr>`;
      b.rows.forEach((r, i) => { h += `<tr><td class="n">${i + 1}</td><td class="w1">${esc(r.w)}</td><td class="w2 w" data-id="${r.id}">${esc(r.r)}</td></tr>`; });
      h += '</table>';
    }
  }
  return h + '</div></div>';
}
function hidHTML(t) {
  const s = esc(t).replace(/^(هدایات|ہدایات|قاعدہ نمبر \(۱\)|سوال|حروفِ لین|تنبیہ)\s*:?/, m => `<b class="h">${m}</b>`).replace(/(تنبیہ|نوٹ|قاعدہ نمبر \([۰-۹]+\)|قاعدہ)\s*:/g, m => `<b class="h">${m}</b>`);
  return s;
}
function footHTML(t) { return esc(t).replace('سبز', '<b class="c-g">سبز</b>').replace('مالٹا', '<b class="c-o">مالٹا</b>').replace('نیلے', '<b class="c-b">نیلے</b>').replace('سرخ', '<b class="c-r">سرخ</b>'); }

/* ---------- screens ---------- */
function show(id) { $$('.scr').forEach(s => s.classList.toggle('on', s.id === id)); }
function home() {
  stop(); show('home');
  $('#hTitle').textContent = T('hT'); $('#hDesc').textContent = T('hD'); $('#secT').textContent = T('sec');
  const started = Object.keys(S.heard).length > 0; $('#bGoT').textContent = started ? T('cont') + S.page : T('go');
  const nd = ORDER.filter(p => S.done[p]).length; $('#hStat').textContent = `${nd} / ${ORDER.length} ${T('page')} ${T('done')} · ${Object.keys(S.heard).length} ${T('heard')}`;
  $('#legend').innerHTML = `<span><b>${T('lg')}:</b></span>` + LEG.map(l => `<span><i style="background:var(--${l[0]})"></i>${S.ui === 'ur' ? l[2] : S.ui === 'en' ? l[3] : l[1]}</span>`).join('');
  const ks = Object.keys(TAK).map(Number).sort((a, b) => (a || 99) - (b || 99));
  $('#tlist').innerHTML = ks.map((k, i) => {
    const t = TAK[k], pg = t.pages, dn = pg.filter(p => S.done[p]).length, sub = TK[k] ? (S.ui === 'en' ? TK[k][1] : TK[k][0]) : '';
    const ex = firstText(pg[0], k);
    return `<button class="tk ${dn === pg.length ? 'done' : ''}" data-tk="${k}" style="animation-delay:${i * 35}ms"><span class="no"><b>${k || '★'}</b></span><span class="tt"><b class="nq">${esc(t.title)}</b><small>${esc(sub)} · ${T('page')} ${pg.join(', ')}</small></span><span class="ex">${esc(ex)}</span><i class="bar" style="width:${pg.length ? dn / pg.length * 100 : 0}%"></i></button>`;
  }).join('');
  $('#bUpd').textContent = T('upd'); $('#ver').textContent = verName();
  document.documentElement.dir = S.ui === 'ur' ? 'rtl' : 'ltr';
}
function firstText(pn, tk) {
  const p = BYP[pn]; if (!p) return ''; let on = false;
  for (const b of p.blocks) { if (b.t === 'head') on = b.n === tk; if ((on || tk === 1) && (b.t === 'grid' || b.t === 'lines')) { const c = b.rows[0].cells.filter(x => x.ar).slice(0, b.t === 'grid' ? 3 : 1).map(x => x.ar.split(':')[0]); return c.join(' '); } if (b.t === 'table') return b.rows[0].r; }
  return '';
}
function verName() { try { return window.QaidaAndroid && QaidaAndroid.appVersion ? 'v1.0.' + QaidaAndroid.appVersion() : 'web'; } catch (e) { return ''; } }

let curP = 2;
function openPage(p, dir) {
  if (!BYP[p]) return; stop(); curP = p; S.page = p; save(); show('pg');
  const tr = $('#ptrack'), sl = document.createElement('div'); sl.className = 'pslot'; sl.innerHTML = bookHTML(BYP[p]);
  const old = tr.firstElementChild;
  if (old && dir) {
    sl.style.position = 'absolute'; sl.style.inset = '0'; sl.style.transform = `translateX(${dir > 0 ? -100 : 100}%)`; tr.appendChild(sl);
    old.style.transition = sl.style.transition = 'transform .34s cubic-bezier(.2,.8,.2,1),opacity .34s'; sl.getBoundingClientRect();
    old.style.transform = `translateX(${dir > 0 ? 40 : -40}%)`; old.style.opacity = '0'; sl.style.transform = 'none';
    setTimeout(() => { old.remove(); sl.style.position = ''; sl.style.inset = ''; sl.style.transition = ''; }, 360);
  } else { tr.innerHTML = ''; tr.appendChild(sl); }
  const pp = BYP[p], tk = TAK[pp.tk];
  $('#pTitle').textContent = tk ? tk.title : ''; $('#pSub').textContent = `${pp.tk ? T('takhti') + ' ' + pp.tk + ' · ' : ''}${T('page')} ${p}`;
  $('#pNo').textContent = `${p} / ${ORDER[ORDER.length - 1]}`;
  $('#pDots').innerHTML = ORDER.map(x => `<i class="${x === p ? 'on' : S.done[x] ? 'dn' : ''}"></i>`).join('');
  $('#repN').textContent = S.rep;
  fit(sl); prefetch(p);
}
function fit(root) {
  root.querySelectorAll('.grid').forEach(g => { let fs = parseFloat(g.style.getPropertyValue('--fs')); const over = () => [...g.querySelectorAll('.cell')].some(c => c.scrollWidth > c.clientWidth + 1); let n = 0; while (over() && fs > 18 && n++ < 20) { fs -= 2; g.style.setProperty('--fs', fs + 'px'); g.style.setProperty('--ch', Math.round(fs * 1.75) + 'px'); } });
  root.querySelectorAll('.lines').forEach(L => { let fs = parseFloat(L.style.getPropertyValue('--fs')); const over = () => [...L.querySelectorAll('.ln')].some(r => r.scrollWidth > r.clientWidth + 1); let n = 0; while (over() && fs > 18 && n++ < 20) { fs -= 1.5; L.style.setProperty('--fs', fs + 'px'); } });
}
const pgItems = () => $$('.pslot:last-child [data-id]');
function step(d) { const i = ORDER.indexOf(curP) + d; if (i >= 0 && i < ORDER.length) openPage(ORDER[i], d); }

/* ---------- audio ---------- */
const A = new Audio(); A.preload = 'auto'; let playing = null, seq = null, endAt = 0, raf = 0;
function srcOf(id) {
  const r = window.QaidaRec && QaidaRec.src(id); if (r) return r;
  if (AU[id]) return { url: 'a/' + AU[id], kind: 'r' };
  if (QM[id]) return { url: 'https://audio.qurancdn.com/wbw/' + QM[id] + '.mp3', kind: 'q' };
  return null;
}
const hasAudio = id => !!srcOf(id);
function prefetch(p) { const ids = pgItems().map(e => e.dataset.id).slice(0, 8); ids.forEach(id => { const s = srcOf(id); if (s && !s.blob && !s.start) { const a = new Audio(); a.preload = 'auto'; a.src = s.url; } }); }
function highlight(id) { $$('.on[data-id]').forEach(e => e.classList.remove('on')); if (!id) return; const e = $(`.pslot:last-child [data-id="${id}"]`); if (e) { e.classList.add('on'); const r = e.getBoundingClientRect(), v = $('#pview').getBoundingClientRect(); if (r.top < v.top + 10 || r.bottom > v.bottom - 10) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
function playOne(id, times) {
  return new Promise(res => {
    const s = srcOf(id); highlight(id); playing = id;
    if (!s) { toastOnce(T('noA')); setTimeout(() => res(false), 450); return; }
    let left = Math.max(1, times || 1);
    const go = () => {
      cancelAnimationFrame(raf); A.onended = null; A.onerror = null;
      if (A.src !== s.url) A.src = s.url;
      const start = s.start || 0; endAt = s.end || 0;
      const done = () => { cancelAnimationFrame(raf); if (playing !== id) return res(false); markHeard(id); if (--left > 0) setTimeout(go, 250); else res(true); };
      A.onended = done; A.onerror = () => { if (s.kind === 'q') toastOnce('Internet check karein'); res(false); };
      try { A.currentTime = start; } catch (e) { }
      const pr = A.play(); if (pr && pr.catch) pr.catch(() => res(false));
      if (endAt) { const tick = () => { if (playing !== id) return; if (A.currentTime >= endAt) { A.pause(); done(); } else raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); }
    };
    go();
  });
}
function stop() { playing = null; seq = null; cancelAnimationFrame(raf); try { A.pause(); } catch (e) { } highlight(null); $('#bPlay') && $('#bPlay').classList.remove('on'); }
async function playAll(fromId) {
  if (seq) { stop(); return; }
  const tok = seq = {}; $('#bPlay').classList.add('on');
  let ids = pgItems().map(e => e.dataset.id); if (fromId) ids = ids.slice(ids.indexOf(fromId));
  for (const id of ids) {
    if (seq !== tok) return;
    if (!hasAudio(id)) continue;
    await playOne(id, S.rep);
    if (seq !== tok) return;
    await new Promise(r => setTimeout(r, S.gap ? 350 : 60));
  }
  if (seq !== tok) return;
  highlight(null); seq = null; $('#bPlay').classList.remove('on');
  if (S.auto && ORDER.indexOf(curP) < ORDER.length - 1) { step(1); setTimeout(() => playAll(), 700); }
}
function markHeard(id) {
  if (!S.heard[id]) { S.heard[id] = 1; save(); const e = $(`[data-id="${id}"]`); e && e.classList.add('heard'); }
  const all = pgItems().map(e => e.dataset.id).filter(hasAudio);
  if (all.length && !S.done[curP] && all.every(x => S.heard[x])) { S.done[curP] = 1; save(); cheer(T('mash')); $('#pDots').innerHTML = ORDER.map(x => `<i class="${x === curP ? 'on' : S.done[x] ? 'dn' : ''}"></i>`).join(''); }
}

/* ---------- effects ---------- */
function cheer(msg) {
  const fx = $('#fx'); for (let i = 0; i < 26; i++) { const s = document.createElement('span'); s.className = 'star'; s.textContent = ['✦', '★', '✧', '❁'][i % 4]; s.style.left = '50%'; s.style.top = '42%'; s.style.color = ['#f2d58a', '#e0b55c', '#4ed38a', '#ff8fc8'][i % 4]; const a = Math.random() * 6.28, r = 90 + Math.random() * 160; s.style.setProperty('--dx', Math.cos(a) * r + 'px'); s.style.setProperty('--dy', Math.sin(a) * r + 'px'); fx.appendChild(s); setTimeout(() => s.remove(), 1500); }
  const c = document.createElement('div'); c.className = 'cheer'; c.textContent = msg; document.body.appendChild(c); setTimeout(() => c.remove(), 1800);
}
let tT = 0; const shown = {};
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2200); }
function toastOnce(m) { if (shown[m] && Date.now() - shown[m] < 8000) return; shown[m] = Date.now(); toast(m); }

/* ---------- sheets: settings, help, quiz ---------- */
function sheet(html, onClick) { const s = $('#sheet'); s.innerHTML = `<div class="sh">${html}</div>`; s.hidden = false; s.onclick = e => { if (e.target === s || e.target.closest('[data-x]')) { closeSheet(); return; } onClick && onClick(e); }; }
function closeSheet() { const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; if (quiz) { quiz = null; stop(); } }
const head = t => `<div class="sh-h"><button class="ib" data-x aria-label="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>${esc(t)}</b></div>`;
const seg = (k, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-k="${k}" data-v="${v}" class="${String(S[k]) === String(v) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
function settings() {
  sheet(head(T('set')) +
    `<div class="row"><label>${T('lang')}</label>${seg('ui', [['ru', 'Roman Urdu'], ['ur', 'اردو'], ['en', 'English']])}</div>` +
    `<div class="row"><label>${T('rep')}</label>${seg('rep', [[1, '1'], [2, '2'], [3, '3'], [5, '5']])}</div>` +
    `<div class="row"><label>${T('gap')}</label>${seg('gap', [[1, T('on')], [0, T('off')]])}</div>` +
    `<div class="row"><label>${T('auto')}</label>${seg('auto', [[1, T('on')], [0, T('off')]])}</div>` +
    `<div class="row"><label>${T('hid')}</label>${seg('hid', [[1, T('on')], [0, T('off')]])}</div>` +
    `<button class="btn" data-a="upd">${T('upd')}</button>` +
    `<button class="btn g" data-a="rec">🎙 ${T('rec')}<small style="display:block;font-weight:400;opacity:.8">${T('recS')}</small></button>` +
    `<button class="btn r" data-a="reset">${T('reset')}</button>` +
    `<p style="color:var(--mut);font-size:12px;text-align:center;margin-top:14px">Noorani Qaida · Quranic Science · ${verName()}</p>`,
    e => {
      const b = e.target.closest('[data-k]'); if (b) { const k = b.dataset.k, v = b.dataset.v; S[k] = isNaN(+v) ? v : +v; save(); settings(); refresh(); return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'upd') window.QaidaUpdate && QaidaUpdate.check(true);
      if (a.dataset.a === 'rec') { closeSheet(); window.QaidaRec && QaidaRec.open(curP); }
      if (a.dataset.a === 'reset' && confirmBox(T('resetQ'))) { S.heard = {}; S.done = {}; save(); closeSheet(); refresh(); }
    });
}
function confirmBox(q) { try { return window.confirm(q); } catch (e) { return false; } }
function refresh() { if ($('#pg').classList.contains('on')) openPage(curP); else home(); }
function help() {
  const p = BYP[curP]; const tks = p.tks || [p.tk]; let h = head(T('help'));
  tks.forEach(n => {
    const pg = TAK[n] && TAK[n].pages[0]; const bp = BYP[pg]; if (!bp) return; let on = false;
    h += `<div class="ban" style="margin-top:10px"><div>${n ? `تختی نمبر <span class="n">${n}</span> ` : ''}${esc(TAK[n].title)}</div></div>`;
    let got = false;
    for (const b of bp.blocks) { if (b.t === 'head') on = b.n === n; if (on && (b.t === 'hid' || b.t === 'note')) { h += `<div class="hid">${hidHTML(b.ur)}</div>`; got = true; } }
    const tr = HID[n]; if (tr && S.ui !== 'ur') h += `<p style="font-size:14px">${esc(S.ui === 'en' ? tr.en : tr.ru)}</p>`; else if (tr && !got) h += `<p style="font-size:14px">${esc(tr.ru)}</p>`;
  });
  h += `<div class="row"><label>${T('lg')}</label></div><div class="legend">` + LEG.map(l => `<span><i style="background:var(--${l[0]})"></i>${S.ui === 'ur' ? l[2] : S.ui === 'en' ? l[3] : l[1]}</span>`).join('') + '</div>';
  sheet(h);
}
let quiz = null;
function startQuiz() {
  stop(); const ids = pgItems().map(e => e.dataset.id).filter(hasAudio); const uniq = [...new Set(ids)];
  if (uniq.length < 4) { toast(T('qzNo')); return; }
  quiz = { ids: uniq, score: 0, n: 0 }; nextQ();
}
function txt(id) { const e = $(`.pslot:last-child [data-id="${id}"]`); return e ? e.innerHTML.replace(/<span class="nm">.*?<\/span>/, '') : ''; }
function nextQ() {
  if (!quiz) return; const pool = quiz.ids.slice().sort(() => Math.random() - .5), opts = pool.slice(0, 4), ans = opts[Math.floor(Math.random() * 4)];
  quiz.ans = ans; quiz.n++; quiz.lock = false;
  sheet(head(T('qz')) + `<div class="qz"><p>${T('qzS')}</p><button class="btn g" data-q="again">🔊 ${T('again')}</button><div class="opts">${opts.map(o => `<button class="opt" data-o="${o}">${txt(o)}</button>`).join('')}</div><div class="sc">${T('score')}: ${quiz.score} / ${quiz.n - 1}</div></div>`,
    e => {
      if (e.target.closest('[data-q]')) { playQ(); return; }
      const o = e.target.closest('[data-o]'); if (!o || quiz.lock) return; quiz.lock = true;
      if (o.dataset.o === quiz.ans) { o.classList.add('ok'); quiz.score++; cheer('✓'); setTimeout(nextQ, 1100); }
      else { o.classList.add('no'); $(`[data-o="${quiz.ans}"]`).classList.add('ok'); setTimeout(nextQ, 1600); }
    });
  setTimeout(playQ, 300);
}
function playQ() { if (!quiz) return; const s = srcOf(quiz.ans); if (!s) return; playing = 'q'; A.src = s.url; try { A.currentTime = s.start || 0; } catch (e) { } A.play().catch(() => { }); endAt = s.end || 0; cancelAnimationFrame(raf); if (endAt) { const t = () => { if (A.currentTime >= endAt) A.pause(); else raf = requestAnimationFrame(t); }; raf = requestAnimationFrame(t); } }

/* ---------- input ---------- */
let pressT = 0, longId = null, sx = 0, sy = 0, moved = false;
function bind() {
  $('#bGo').onclick = () => openPage(S.page || 2);
  $('#bSet').onclick = settings;
  $('#tlist').onclick = e => { const t = e.target.closest('[data-tk]'); if (t) openPage(TAK[t.dataset.tk].pages[0]); };
  $('#bBack').onclick = () => home();
  $('#bNext').onclick = () => step(1); $('#bPrev').onclick = () => step(-1);
  $('#bPlay').onclick = () => playAll();
  $('#bRep').onclick = () => { const o = [1, 2, 3, 5]; S.rep = o[(o.indexOf(S.rep) + 1) % o.length]; save(); $('#repN').textContent = S.rep; toast(T('rep') + ': ' + S.rep); };
  $('#bHelp').onclick = help; $('#bQuiz').onclick = startQuiz;
  const v = $('#pview');
  v.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; moved = false; const c = e.target.closest('[data-id]'); clearTimeout(pressT); longId = null; if (c) pressT = setTimeout(() => { longId = c.dataset.id; loop(longId); }, 520); });
  v.addEventListener('pointermove', e => { if (Math.abs(e.clientX - sx) > 12 || Math.abs(e.clientY - sy) > 12) { moved = true; clearTimeout(pressT); } });
  v.addEventListener('pointerup', e => {
    clearTimeout(pressT); const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) { step(dx > 0 ? 1 : -1); return; } /* Urdu book: swipe right = next page */
    if (moved || longId) return;
    const c = e.target.closest('[data-id]'); if (!c) return;
    const wasSeq = !!seq; stop(); if (wasSeq) { playAll(c.dataset.id); return; }
    playOne(c.dataset.id, S.rep).then(() => { if (!seq) highlight(null); });
  });
  v.addEventListener('contextmenu', e => e.preventDefault());
  addEventListener('resize', () => { if ($('#pg').classList.contains('on')) { const y = $('.pslot') && $('.pslot').scrollTop; openPage(curP); if ($('.pslot')) $('.pslot').scrollTop = y; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') back(); });
}
async function loop(id) { stop(); navigator.vibrate && navigator.vibrate(20); const tok = seq = {}; $('#bPlay').classList.add('on'); toast('🔁'); while (seq === tok) { await playOne(id, 1); await new Promise(r => setTimeout(r, 500)); } }

/* back button (Android) */
function back() {
  if (document.getElementById('upd')) { document.getElementById('upd').remove(); return true; }
  if (!$('#sheet').hidden) { closeSheet(); return true; }
  if (window.QaidaRec && QaidaRec.isOpen()) { QaidaRec.close(); return true; }
  if ($('#pg').classList.contains('on')) { home(); return true; }
  return false;
}
window.__qaidaBack = back;
window.Qaida = { S, save, toast, BYP, ORDER, bookHTML, fit, srcOf, items: () => pgItems(), cur: () => curP, refresh, stop, T, A, graphemes };

(async () => {
  await load(); bind(); home();
  setTimeout(() => $('#splash').classList.add('out'), 600); setTimeout(() => $('#splash').remove(), 1200);
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.QaidaAndroid) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
})();

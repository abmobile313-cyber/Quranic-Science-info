/* Noorani Qaida by Quranic Science — "Mukammal Noorani Qaida" (Majlis Dawat-ul-Haq Hardoi), takhti 1–28 + azaan.
   Every letter, syllable and word: tap to hear, mic to check (green/red). Modes: Parhiye, Sabak Sunao, Ustad ke saath. */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const LS = 'qaida.v2';
const S = Object.assign({ ui: 'ru', rep: 1, tk: 1, heard: {}, good: {}, done: {}, auto: 1, gap: 1, vo: 1, tries: 2, hj: 0, th: 'l', sp: 1.1 }, (() => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } };
const C = () => window.QaidaCheck;

const TK = { 1: 'Mufradaat — akele huroof', 2: 'Murakkabaat — jude huroof', 3: 'Harakaat — zabar, zer, pesh', 4: 'Huroof-e-madda', 5: 'Huroof-e-leen', 6: 'Mashq: harakaat, madda, leen', 7: 'Tanween', 8: 'Tanween o noon saakin', 9: 'Izhaar', 10: 'Ikhfa', 11: 'Jazm — sukoon', 12: 'Mashq-e-sukoon', 13: 'Tashdeed', 14: 'Raa saakina o mushaddada', 15: 'Huroof qamari o shamsi', 16: 'Lafz Allah ka qaida', 17: 'Waqf ke qaide', 18: 'Tashdeed ma\'a tashdeed', 19: 'Madd ka bayan', 20: 'Tashdeed ba\'d huroof-e-madda', 21: 'Huroof-e-muqatta\'aat', 22: 'Meem saakin ke qaide', 23: 'Iqlaab', 24: 'Idgham yarmaloon', 25: 'Rasm-ul-khat', 26: 'Alamaat-e-waqf', 27: 'Ijra-e-qawaid', 28: 'Kalimaat-e-Islam', 29: 'Azaan o iqamat' };
const TKE = { 1: 'Single letters', 2: 'Joined letters', 3: 'Short vowels', 4: 'Long vowels', 5: 'Soft letters', 6: 'Practice', 7: 'Tanween', 8: 'Tanween & noon saakin', 9: 'Izhar', 10: 'Ikhfa', 11: 'Sukoon', 12: 'Sukoon practice', 13: 'Shaddah', 14: 'Raa rules', 15: 'Moon & sun letters', 16: 'The word Allah', 17: 'Stopping rules', 18: 'Double shaddah', 19: 'Madd', 20: 'Shaddah after madd', 21: 'Disjointed letters', 22: 'Meem saakin', 23: 'Iqlab', 24: 'Idgham', 25: 'Quranic spelling', 26: 'Stop signs', 27: 'Applying the rules', 28: 'Kalimas of Islam', 29: 'Adhan & iqamah' };
const L = {
  ru: { noH: 'Hidayaat ki awaaz abhi record nahi hui — Settings › Ustad ki awaaz record karein', louder: 'Thoda zor se padhiye…', moveOn: 'Koi baat nahi — aage chalte hain', sp: 'Qari ki raftaar', spS: 'Aahista', spM: 'Darmiyani', spF: 'Tez', th: 'Rang (theme)', thL: 'Roshan', thD: 'Andhera', hj: 'Hijje (baa zabar ba)', hjA: 'Takhti 3–13', hjY: 'Har jagah', hjN: 'Sirf rawaan', hT: 'Noorani Qaida — aap ka ustad', hD: 'Har harf aur lafz par tap karein — qari sahab ki awaaz suniye. Phir mic se padhiye: sahi ho to hara. Choti si chook par app dobara suna kar aage chalta hai.', go: 'Shuru karein', cont: 'Jaari rakhein · Takhti ', sec: 'Takhtiyan', takhti: 'Takhti', page: 'Safha', done: 'mukammal', m1: 'Parhiye', m1s: 'Tap karein aur suniye', m2: 'Sabak sunaiye', m2s: 'Bachcha padhe, app check kare', m3: 'Ustad ke saath', m3s: 'Ustad padhe, bachcha dohraye', hid: 'Hidayaat', hidAll: 'Hidayaat (shuru ki baatein)', listen: 'Suniye', set: 'Settings', lang: 'Zaban', rep: 'Har lafz kitni baar', auto: 'Agli takhti khud', on: 'Haan', off: 'Nahin', vo: 'Ustad ki awaaz (shabash wagaira)', tries: 'Ghalti par kitni baar dobara', rec: 'Ustad ki awaaz record karein', recS: 'Har khana apni awaaz mein record karein', upd: 'Update check karein', reset: 'Progress mitayein', resetQ: 'Sach mein saari progress mitani hai?', from: 'Kahan se', to: 'kahan tak', pickFrom: 'Jis khane se shuru karna hai us par tap karein', pickTo: 'Ab aakhri khane par tap karein', all: 'Poori takhti', stop: 'Rukein', speakNow: 'Ab padhiye…', listenNow: 'Ghaur se suniye…', wrong: 'Ghalat — dobara padhiye', right: 'Shabash!', heardT: 'Suna gaya', skip: 'Aage chalein', retry: 'Phir se koshish', result: 'Natija', firstTry: 'Pehli baar mein sahi', mistakes: 'Ghaltiyan', again: 'Ghalat khane phir se', close: 'Band karein', noMic: 'Is phone mein awaaz pehchanne ka system nahi mila. Google app / Speech Services update karein.', micNo: 'Mic ki ijazat dijiye', noA: 'Is khane ki awaaz abhi nahi hai — Settings se record kar sakte hain', heard: 'suna', good: 'sahi', tap: 'Tap: suniye · Lamba dabayein: padh kar check', play: 'Poori takhti suniye', mash: 'MashaAllah! Takhti mukammal', note: 'Note: akele harfon mein phone kabhi kabhi theek se nahi pehchanta — ustad saath ho to behtar.' },
  ur: { noH: 'ہدایات کی آواز ابھی ریکارڈ نہیں ہوئی', louder: 'تھوڑا زور سے پڑھیے…', moveOn: 'کوئی بات نہیں — آگے چلتے ہیں', sp: 'قاری کی رفتار', spS: 'آہستہ', spM: 'درمیانی', spF: 'تیز', th: 'رنگ', thL: 'روشن', thD: 'اندھیرا', hj: 'ہجے (با زبر بَ)', hjA: 'تختی ۳–۱۳', hjY: 'ہر جگہ', hjN: 'صرف رواں', hT: 'نورانی قاعدہ — آپ کا استاد', hD: 'ہر حرف اور لفظ پر ٹیپ کریں — قاری صاحب کی آواز سنیے۔ پھر مائک سے پڑھیے: صحیح ہو تو ہرا۔ چھوٹی سی چوک پر ایپ دوبارہ سنا کر آگے چلتی ہے۔', go: 'شروع کریں', cont: 'جاری رکھیں · تختی ', sec: 'تختیاں', takhti: 'تختی', page: 'صفحہ', done: 'مکمل', m1: 'پڑھیے', m1s: 'ٹیپ کریں اور سنیے', m2: 'سبق سنائیے', m2s: 'بچہ پڑھے، ایپ چیک کرے', m3: 'استاد کے ساتھ', m3s: 'استاد پڑھے، بچہ دہرائے', hid: 'ہدایات', hidAll: 'ہدایات (شروع کی باتیں)', listen: 'سنیے', set: 'ترتیبات', lang: 'زبان', rep: 'ہر لفظ کتنی بار', auto: 'اگلی تختی خود', on: 'ہاں', off: 'نہیں', vo: 'استاد کی آواز (شاباش وغیرہ)', tries: 'غلطی پر کتنی بار دوبارہ', rec: 'استاد کی آواز ریکارڈ کریں', recS: 'ہر خانہ اپنی آواز میں ریکارڈ کریں', upd: 'اپڈیٹ چیک کریں', reset: 'پروگریس مٹائیں', resetQ: 'کیا واقعی ساری پروگریس مٹانی ہے؟', from: 'کہاں سے', to: 'کہاں تک', pickFrom: 'جس خانے سے شروع کرنا ہے اس پر ٹیپ کریں', pickTo: 'اب آخری خانے پر ٹیپ کریں', all: 'پوری تختی', stop: 'رکیں', speakNow: 'اب پڑھیے…', listenNow: 'غور سے سنیے…', wrong: 'غلط — دوبارہ پڑھیے', right: 'شاباش!', heardT: 'سنا گیا', skip: 'آگے چلیں', retry: 'پھر سے کوشش', result: 'نتیجہ', firstTry: 'پہلی بار میں صحیح', mistakes: 'غلطیاں', again: 'غلط خانے پھر سے', close: 'بند کریں', noMic: 'اس فون میں آواز پہچاننے کا نظام نہیں ملا۔', micNo: 'مائک کی اجازت دیجیے', noA: 'اس خانے کی آواز ابھی نہیں ہے', heard: 'سنا', good: 'صحیح', tap: 'ٹیپ: سنیے · لمبا دبائیں: پڑھ کر چیک', play: 'پوری تختی سنیے', mash: 'ماشاءاللہ! تختی مکمل', note: 'نوٹ: اکیلے حرفوں میں فون کبھی کبھی ٹھیک سے نہیں پہچانتا۔' },
  en: { noH: 'Teacher notes are not recorded yet', louder: 'A little louder…', moveOn: 'No problem — let us move on', sp: 'Reciter speed', spS: 'Slow', spM: 'Medium', spF: 'Fast', th: 'Theme', thL: 'Light', thD: 'Dark', hj: 'Spelling (hijje)', hjA: 'Lessons 3–13', hjY: 'Everywhere', hjN: 'Fluent only', hT: 'Noorani Qaida — your teacher', hD: 'Tap any letter or word to hear the qari. Then read into the mic: green when right. After a small slip the app plays it again and moves on.', go: 'Start', cont: 'Continue · Lesson ', sec: 'Lessons (Takhti)', takhti: 'Lesson', page: 'Page', done: 'done', m1: 'Read', m1s: 'Tap and listen', m2: 'Recite lesson', m2s: 'Child reads, app checks', m3: 'With teacher', m3s: 'Teacher reads, child repeats', hid: 'Notes', hidAll: 'Teacher notes (introduction)', listen: 'Listen', set: 'Settings', lang: 'Language', rep: 'Repeat each item', auto: 'Next lesson automatically', on: 'On', off: 'Off', vo: 'Teacher voice (praise etc.)', tries: 'Retries on a mistake', rec: 'Record teacher voice', recS: 'Record every box in your own voice', upd: 'Check for update', reset: 'Reset progress', resetQ: 'Really erase all progress?', from: 'From', to: 'to', pickFrom: 'Tap the box to start from', pickTo: 'Now tap the last box', all: 'Whole lesson', stop: 'Stop', speakNow: 'Now read…', listenNow: 'Listen carefully…', wrong: 'Wrong — read again', right: 'Well done!', heardT: 'Heard', skip: 'Move on', retry: 'Try again', result: 'Result', firstTry: 'Right first time', mistakes: 'Mistakes', again: 'Practise mistakes', close: 'Close', noMic: 'No speech recognition on this phone.', micNo: 'Please allow the microphone', noA: 'No recording for this box yet', heard: 'heard', good: 'correct', tap: 'Tap: listen · Long press: read & check', play: 'Play whole lesson', mash: 'MashaAllah! Lesson complete', note: 'Note: for single letters the phone does not always recognise well.' }
};
const T = k => (L[S.ui] || L.ru)[k] || L.ru[k] || k;
const LEG = [['g', 'Mota harf', 'موٹا حرف', 'Heavy'], ['o', 'Ikhfa', 'اخفا', 'Ikhfa'], ['b', 'Qalqala', 'قلقلہ', 'Qalqalah'], ['r', 'Ghunna', 'غنہ', 'Ghunnah']];

/* ---------- data ---------- */
let D = null, AU = {}, QM = {}, TAKS = [], BYT = {}; const ORDER = [];
async function load() {
  const j = u => fetch(u).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  [D, AU, QM] = await Promise.all([j('q/qaida.json'), j('q/audio.json'), j('q/qmatch.json')]);
  document.documentElement.classList.toggle('noh', !Object.keys(AU).some(k => k.startsWith('h:')));
  TAKS = D.takhti || []; TAKS.forEach(t => BYT[t.n] = t); ORDER.length = 0; ORDER.push(...TAKS.map(t => t.n));
}

/* ---------- tajweed colouring ---------- */
const MARK = /[ً-ٰٟۖ-ۭ࣓-ࣿ]/;
const HEAVY = 'خصضغطقظ', QAL = 'قطبجد', IKH = 'تثجدذزسشصضطظفقك';
const NOLEFT = 'اأإآٱدذرزژوؤءةۀ';
const joinsNext = c => !NOLEFT.includes(c) && /[ؠ-يٮ-ۓۺ-ۿ]/.test(c);
const joinsPrev = c => c !== 'ء' && /[ؠ-يٮ-ۓۺ-ۿ]/.test(c);
function graphemes(s) { const g = []; for (const ch of s) { if ((MARK.test(ch) || ch === 'ـ') && g.length) g[g.length - 1] += ch; else g.push(ch); } return g; }
const has = (g, m) => g.indexOf(m) > 0;
function colourWord(s, mode, idx) {
  const g = graphemes(s), out = []; let alt = idx || 0;
  for (let i = 0; i < g.length; i++) {
    const x = g[i], c = x[0];
    if (c === ' ') { out.push(' '); continue; }
    /* laam + alif must stay in one span so the لا ligature is drawn */
    if (c === 'ل' && g[i + 1] && 'اآأإٱ'.includes(g[i + 1][0])) {
      out.push([mode === 'auto' ? 'm' : (alt++ % 2 ? 'k' : 'm'), x + g[i + 1], i, 2]); i++; continue;
    }
    let col = null;
    if (mode !== 'alt') {
      const sk = has(x, 'ْ'), sh = has(x, 'ّ'), kas = has(x, 'ِ') || has(x, 'ٍ'), tanw = /[ً-ٍ]/.test(x);
      let nx = ''; for (let j = i + 1; j < g.length; j++) { const b = g[j][0]; if (b === ' ' || ('اى'.includes(b) && !MARK.test(g[j].slice(1)))) continue; nx = b; break; }
      if ((c === 'ن' && sk || tanw) && nx && IKH.includes(nx)) col = 'o';
      else if ((c === 'ن' || c === 'م') && sh) col = 'r';
      else if (QAL.includes(c) && sk) col = 'b';
      else if (HEAVY.includes(c)) col = 'g';
      else if (c === 'ر') { if (kas) col = 'k'; else if (sk) { const pv = g[i - 1] || ''; col = has(pv, 'ِ') ? 'k' : 'g'; } else col = 'g'; }
    }
    if (!col) col = mode === 'auto' ? 'm' : (alt++ % 2 ? 'k' : 'm');
    out.push([col, x, i, 1]);
  }
  let h = '';
  for (let i = 0; i < out.length; i++) {
    const it = out[i]; if (typeof it === 'string') { h += it; continue; }
    const pv = out[i - 1], nx = out[i + 1];
    const jp = pv && typeof pv !== 'string' && pv[0] !== it[0] && joinsNext(pv[1][0]) && joinsPrev(it[1][0]);
    const lb = [...it[1]].filter(ch => !MARK.test(ch)).pop() || it[1][0];
    const jn = nx && typeof nx !== 'string' && nx[0] !== it[0] && joinsNext(lb) && joinsPrev(nx[1][0]);
    h += `<span class="c-${it[0]}" data-g="${it[2]}" data-gn="${it[3]}">${jp ? '‍' : ''}${esc(it[1])}${jn ? '‍' : ''}</span>`;
  }
  return h;
}
const clsOf = id => S.good[id] ? 'good' : S.heard[id] ? 'heard' : '';

/* ---------- takhti rendering ---------- */
function fsFor(cols, cells) {
  const W = Math.min(560, innerWidth - 16) - 40, len = Math.max(1, ...cells.filter(c => c.ar).map(c => graphemes(c.ar).length));
  return Math.max(20, Math.min(52, W / cols * (len <= 1 ? .6 : len <= 2 ? .56 : len <= 3 ? .52 : len <= 5 ? .46 : .4)));
}
function takhtiHTML(t, pn) {
  if (!t) return '';
  const first = pn === undefined || pn === t.pages[0];
  let h = `<div class="book" data-t="${t.n}"><i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i><span class="bno">${pn || t.pages[0] || ''}</span><div class="bin">`, wi = 0;
  if (first) h += `<div class="ban"><div><i class="bi">${t.n < 29 ? `<span class="tno">تختی نمبر</span><span class="n">${t.n}</span> ` : ''}${esc(t.title)}</i></div></div>`;
  else h += `<div class="ban sm"><div><i class="bi">${t.n < 29 ? `<span class="tno">تختی</span><span class="n">${t.n}</span> ` : ''}${esc(t.title)}</i></div></div>`;
  if (t.hid && first) h += `<button class="hidbtn" data-hid="${t.n}">📖 ${T('hid')} · ${T('takhti')} ${t.n < 29 ? t.n : ''}</button>`;
  let ri = 0;
  for (const b of t.blocks) {
    if (pn !== undefined && b.pg !== pn) { if (b.t === 'rule') ri++; continue; }
    if (b.t === 'bism') h += `<div class="ban bism"><div><i class="bi">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</i></div></div>`;
    else if (b.t === 'dua') h += `<div class="dua"><span class="w ${clsOf(b.it.id)}" data-id="${b.it.id}">${esc(b.it.ar)}</span></div>`;
    else if (b.t === 'rule') { h += `<div class="hid rule" data-rule="${t.n}-${ri}"><button class="rsay" aria-label="listen">🔊</button>${ruleHTML(b.ur)}</div>`; ri++; }
    else if (b.t === 'sub') h += `<div class="subh"><span>${esc(b.ur)}</span></div>`;
    else if (b.t === 'keys') h += `<div class="keys">${b.ks.map(k => `<b>${esc(k)}</b>`).join('')}</div>`;
    else if (b.t === 'grid') {
      const cells = b.rows.flatMap(r => r.cells); const fs = fsFor(b.cols, cells);
      h += `<div class="grid ${b.shapes ? 'shp' : ''}" style="grid-template-columns:repeat(${b.cols},1fr);--fs:${fs}px;--ch:${Math.round(fs * 1.75)}px">`;
      for (const r of b.rows) {
        const used = r.cells.reduce((a, c) => a + (c.span || 1), 0), pad = r.c ? Math.floor((b.cols - used) / 2) : 0;
        for (let k = 0; k < pad; k++) h += '<div class="cell e"></div>';
        for (const c of r.cells) {
          if (c.mark) { h += `<div class="cell mk">${esc(c.mark)}</div>`; continue; }
          if (c.deco) { h += `<div class="cell deco">✿</div>`; continue; }
          const inner = b.quran ? `<span class="c-${wi++ % 2 ? 'g' : 'm'}">${esc(c.ar)}</span>` : colourWord(c.ar, b.mode, wi++);
          h += `<div class="cell ${clsOf(c.id)}" data-id="${c.id}"${c.span ? ` style="grid-column:span ${c.span}"` : ''}><span class="wd">${inner}</span>${c.name ? `<span class="${b.shapes ? 'shx' : 'nm'}">${esc(c.name)}</span>` : ''}</div>`;
        }
        for (let k = used + pad; k < b.cols; k++) h += '<div class="cell e"></div>';
      }
      h += '</div>';
    } else if (b.t === 'lines') {
      const W = Math.min(560, innerWidth - 16) - 40; let maxw = 0;
      b.rows.forEach(r => { maxw = Math.max(maxw, r.cells.reduce((a, c) => a + (c.ar ? graphemes(c.ar).length + 1.5 : 1.2), 0)); });
      const fs = Math.max(20, Math.min(44, W / maxw * 2));
      h += `<div class="lines" style="--fs:${fs}px">`;
      for (const r of b.rows) {
        h += `<div class="ln ${r.cells.length < 4 ? 'c' : ''}">`;
        for (const c of r.cells) h += c.mark ? `<span class="mk">${esc(c.mark)}</span>` : `<span class="w ${clsOf(c.id)}" data-id="${c.id}">${colourWord(c.ar, b.mode, wi++)}</span>`;
        h += '</div>';
      }
      h += '</div>';
    } else if (b.t === 'table') {
      h += `<table class="tbl"><tr><th>لکھنے کی صورت</th><th>پڑھنے کی صورت</th></tr>`;
      b.rows.forEach(r => { h += `<tr><td class="w1">${esc(r.w)}</td><td class="w2"><span class="w ${clsOf(r.r.id)}" data-id="${r.r.id}">${esc(r.r.ar)}</span></td></tr>`; });
      h += '</table>';
    } else if (b.t === 'table2') {
      h += `<table class="tbl t2"><tr><th>علامت</th><th>تشریح</th></tr>`;
      b.rows.forEach(r => { h += `<tr><td class="m">${esc(r.m)}</td><td class="e">${esc(r.e)}</td></tr>`; });
      h += '</table>';
    } else if (b.t === 'kalima') {
      h += `<div class="kal"><div class="kn">${esc(b.name)}</div><div class="kt"><span class="w ${clsOf(b.it.id)}" data-id="${b.it.id}">${colourWord(b.it.ar, 'word', 0)}</span></div>${b.tr ? `<div class="ktr">${esc(b.tr)}</div>` : ''}</div>`;
    }
  }
  return h + `<div class="foot"><b class="c-g">سبز</b> موٹا · <b class="c-o">مالٹا</b> اخفا · <b class="c-b">نیلا</b> قلقلہ · <b class="c-r">سرخ</b> غنہ</div></div></div>`;
}
function ruleHTML(t) { return esc(t).replace(/(تنبیہ|نوٹ|ہدایت|قاعدہ|ہجے)\s*:/g, m => `<b class="h">${m}</b>`).replace(/(\([۰-۹0-9]+\))/g, '<b class="h">$1</b>'); }

/* ---------- screens ---------- */
function applyTheme() { const r = document.documentElement; r.classList.toggle('lt', S.th !== 'd'); r.classList.toggle('dk', S.th === 'd'); }
function show(id) { $$('.scr').forEach(s => s.classList.toggle('on', s.id === id)); }
function home() {
  stopAll(); show('home');
  $('#hTitle').textContent = T('hT'); $('#hDesc').textContent = T('hD'); $('#secT').textContent = T('sec');
  const started = Object.keys(S.heard).length > 0; $('#bGoT').textContent = started ? T('cont') + S.tk : T('go');
  const nd = ORDER.filter(n => S.done[n]).length; $('#hStat').textContent = `${nd} / ${ORDER.length} ${T('takhti')} ${T('done')} · ${Object.keys(S.good).length} ${T('good')} · ${Object.keys(S.heard).length} ${T('heard')}`;
  $('#modes').innerHTML = [['m1', '👆', 'read'], ['m2', '🎙', 'sabak'], ['m3', '🧑‍🏫', 'learn']].map(([k, ic, m]) => `<button class="mode ${m}" data-mode="${m}"><i>${ic}</i><b>${T(k)}</b><small>${T(k + 's')}</small></button>`).join('');
  $('#legend').innerHTML = LEG.map(l => `<span><i style="background:var(--${l[0]})"></i>${S.ui === 'ur' ? l[2] : S.ui === 'en' ? l[3] : l[1]}</span>`).join('');
  $('#tlist').innerHTML = `<button class="tk intro" data-intro="1"><span class="no"><b>📖</b></span><span class="tt"><b class="nq">ہدایات و طریقۂ تعلیم</b><small>${T('hidAll')}</small></span></button>` + TAKS.map((t, i) => {
    const ids = itemIds(t), g = ids.filter(x => S.good[x]).length, pct = ids.length ? g / ids.length * 100 : 0;
    return `<button class="tk ${S.done[t.n] ? 'done' : ''}" data-tk="${t.n}" style="animation-delay:${(i + 1) * 30}ms"><span class="no"><b>${t.n < 29 ? t.n : '★'}</b></span><span class="tt"><b class="nq">${esc(t.title)}</b><small>${esc(S.ui === 'en' ? TKE[t.n] : TK[t.n] || '')} · ${ids.length}</small></span><span class="ex">${esc(firstText(t))}</span><i class="bar" style="width:${pct}%"></i></button>`;
  }).join('');
  $('#bUpd').textContent = T('upd'); $('#ver').textContent = verName();
  document.documentElement.dir = S.ui === 'ur' ? 'rtl' : 'ltr'; applyTheme();
}
function itemIds(t) { const o = []; t.blocks.forEach(b => { if (b.it) o.push(b.it.id); (b.rows || []).forEach(r => { if (r.cells) r.cells.forEach(c => c.id && o.push(c.id)); if (r.r) o.push(r.r.id); }); }); return o; }
function firstText(t) { for (const b of t.blocks) { if (b.t === 'grid' || b.t === 'lines') { const c = b.rows[0].cells.filter(x => x.ar).slice(0, b.t === 'grid' ? 3 : 1).map(x => x.ar); return c.join(' '); } if (b.it && b.t !== 'dua') return b.it.ar.split(' ').slice(0, 2).join(' '); if (b.t === 'table') return b.rows[0].r.ar; } return ''; }
function verName() { try { return window.QaidaAndroid && QaidaAndroid.appVersion ? 'v1.0.' + QaidaAndroid.appVersion() : 'web'; } catch (e) { return ''; } }

let curT = 1, curP = 0;
function pagesOf(n) { const t = BYT[n]; const ps = t.pages.filter(p => t.blocks.some(b => b.pg === p)); return ps.length ? ps : [t.pages[0]]; }
function pageOfItem(n, id) { const t = BYT[n], ps = pagesOf(n); for (const b of t.blocks) { const has = (b.it && b.it.id === id) || (b.rows || []).some(r => (r.cells || []).some(c => c.id === id) || (r.r && r.r.id === id)); if (has) return Math.max(0, ps.indexOf(b.pg)); } return 0; }
function renderPage(n, pi, dir) {
  const ps = pagesOf(n); curT = n; curP = Math.max(0, Math.min(pi, ps.length - 1)); S.tk = n; save();
  const tr = $('#ptrack'), sl = document.createElement('div'); sl.className = 'pslot'; sl.innerHTML = `<div class="pfit">${takhtiHTML(BYT[n], ps[curP])}</div>`;
  const old = tr.firstElementChild;
  if (old && dir) {
    tr.appendChild(sl); sl.classList.add(dir > 0 ? 'in-next' : 'in-prev'); old.classList.add(dir > 0 ? 'out-next' : 'out-prev');
    setTimeout(() => { old.remove(); sl.classList.remove('in-next', 'in-prev'); }, 520);
  } else { tr.innerHTML = ''; tr.appendChild(sl); }
  const t = BYT[n];
  $('#pTitle').textContent = t.title; $('#pSub').textContent = `${n < 29 ? T('takhti') + ' ' + n + ' · ' : ''}${T('page')} ${ps[curP]}${ps.length > 1 ? ` (${curP + 1}/${ps.length})` : ''}`;
  $('#pNo').textContent = `${n < 29 ? n : '★'} / 28`;
  $('#repN').textContent = S.rep;
  fit(sl); fitPage(sl); prefetch();
}
function openTakhti(n, dir, pi) {
  if (!BYT[n]) return; stopAll(); pick = null; banner(null); show('pg');
  renderPage(n, pi === undefined ? (dir < 0 ? pagesOf(n).length - 1 : 0) : pi, dir);
}
/* the whole PDF page must be visible: scale the book down to the screen, never scroll */
function fitPage(sl) {
  const f = sl.querySelector('.pfit'), b = f && f.querySelector('.book'); if (!b) return;
  f.style.transform = ''; f.style.width = ''; const vw = sl.clientWidth - 8, vh = sl.clientHeight - 8;
  const bh = f.scrollHeight; const k = Math.min(1, vh / bh);
  f.style.width = (vw / k) + 'px'; fit(sl);
  const k2 = Math.min(1, vh / f.scrollHeight);
  f.style.transform = `scale(${k2})`; f.style.left = ((vw - vw / k * k2) / 2 + 4) + 'px';
}
addEventListener('resize', () => { const sl = $('.pslot:last-child'); if (sl && $('#pg').classList.contains('on')) fitPage(sl); });
function fit(root) {
  root.querySelectorAll('.grid').forEach(g => { let fs = parseFloat(g.style.getPropertyValue('--fs')); const over = () => [...g.querySelectorAll('.cell')].some(c => c.scrollWidth > c.clientWidth + 1); let n = 0; while (over() && fs > 16 && n++ < 24) { fs -= 2; g.style.setProperty('--fs', fs + 'px'); g.style.setProperty('--ch', Math.round(fs * 1.75) + 'px'); } });
  root.querySelectorAll('.lines').forEach(Ln => { let fs = parseFloat(Ln.style.getPropertyValue('--fs')); const over = () => [...Ln.querySelectorAll('.ln')].some(r => r.scrollWidth > r.clientWidth + 1); let n = 0; while (over() && fs > 15 && n++ < 24) { fs -= 1.5; Ln.style.setProperty('--fs', fs + 'px'); } });
}
const pgItems = () => $$('.pslot:last-child [data-id]');
const itemEl = id => $(`.pslot:last-child [data-id="${id}"]`);
let IDX = null;
function itemAr(id) { if (!IDX) { IDX = {}; TAKS.forEach(t => t.blocks.forEach(b => { if (b.it) IDX[b.it.id] = b.it; (b.rows || []).forEach(r => { (r.cells || []).forEach(c => c.id && (IDX[c.id] = c)); if (r.r) IDX[r.r.id] = r.r; }); })); } return IDX[id] || null; }
function step(d, keep) {
  const ps = pagesOf(curT), np = curP + d;
  if (np >= 0 && np < ps.length) { if (!keep) { stopAll(); pick = null; banner(null); } renderPage(curT, np, d); return true; }
  const i = ORDER.indexOf(curT) + d; if (i >= 0 && i < ORDER.length) { if (keep) renderPage(ORDER[i], d < 0 ? pagesOf(ORDER[i]).length - 1 : 0, d); else openTakhti(ORDER[i], d); return true; }
  return false;
}
/* modes may walk the whole takhti: bring the page that holds this box onto the screen */
function ensureItem(id) { if (itemEl(id)) return; const pi = pageOfItem(curT, id); if (pi !== curP) renderPage(curT, pi, pi > curP ? 1 : -1); }

/* ---------- audio ---------- */
const A = new Audio(); A.preload = 'auto';
function rate() { const r = +S.sp || 1.1; try { A.defaultPlaybackRate = r; A.playbackRate = r; A.preservesPitch = true; A.mozPreservesPitch = true; A.webkitPreservesPitch = true; } catch (e) { } } let playing = null, seq = null, raf = 0;
function srcOf(id) {
  const r = window.QaidaRec && QaidaRec.src(id); if (r) return r;
  if (AU[id]) return { url: 'a/' + AU[id], kind: 'r' };
  if (QM[id]) return { url: 'https://audio.qurancdn.com/wbw/' + QM[id] + '.mp3', kind: 'q' };
  return null;
}
function prefetch() { pgItems().slice(0, 8).forEach(e => { const s = srcOf(e.dataset.id); if (s && !s.blob) { const a = new Audio(); a.preload = 'auto'; a.src = s.url; } }); }
function highlight(id, cls) { $$('.on[data-id],.lis[data-id]').forEach(e => e.classList.remove('on', 'lis')); if (!id) return; const e = itemEl(id); if (e) { e.classList.add(cls || 'on'); const r = e.getBoundingClientRect(), v = $('#pview').getBoundingClientRect(); if (r.top < v.top + 10 || r.bottom > v.bottom - 130) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
/* spoken form for the phone voice: a lone letter is read by its name */
const LNAME = { 'ا': 'أَلِف', 'ب': 'بَاء', 'ت': 'تَاء', 'ث': 'ثَاء', 'ج': 'جِيم', 'ح': 'حَاء', 'خ': 'خَاء', 'د': 'دَال', 'ذ': 'ذَال', 'ر': 'رَاء', 'ز': 'زَاي', 'س': 'سِين', 'ش': 'شِين', 'ص': 'صَاد', 'ض': 'ضَاد', 'ط': 'طَاء', 'ظ': 'ظَاء', 'ع': 'عَيْن', 'غ': 'غَيْن', 'ف': 'فَاء', 'ق': 'قَاف', 'ك': 'كَاف', 'ل': 'لَام', 'م': 'مِيم', 'ن': 'نُون', 'و': 'وَاو', 'ه': 'هَاء', 'ء': 'هَمْزَة', 'ي': 'يَاء', 'ى': 'يَاء', 'ے': 'يَاء', 'ة': 'تَاء مَرْبُوطَة' };
function ttsText(ar) { const s = String(ar || '').trim(); return LNAME[s] || s.replace(/[ۖ-ۭ]/g, ''); }
function playOne(id, times) {
  return new Promise(res => {
    const s = srcOf(id); playing = id; let left = Math.max(1, times || 1);
    /* no phone/Google voice: a box without its own recording is spelled out (hijje) in the same qari's voice */
    const tts = () => { const h = hijjeList(id); if (h && h.length) { playUrls(id, h).then(ok => { if (ok) markHeard(id); res(ok); }); return; } toastOnce(T('noA')); res(false); };
    if (!s) { tts(); return; }
    const go = () => {
      cancelAnimationFrame(raf); A.onended = null; A.onerror = null;
      if (!A.src.endsWith(s.url)) A.src = s.url;
      const done = () => { cancelAnimationFrame(raf); if (playing !== id) return res(false); markHeard(id); if (--left > 0) setTimeout(go, 250); else res(true); };
      A.onended = done; A.onerror = () => { if (s.kind === 'q') toastOnce('Internet check karein'); res(false); };
      try { A.currentTime = s.start || 0; } catch (e) { }
      rate(); const pr = A.play(); if (pr && pr.catch) pr.catch(() => { });
      if (s.end) { const tick = () => { if (playing !== id) return; if (A.currentTime >= s.end) { A.pause(); done(); } else raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); }
    };
    go();
  });
}
/* ---------- hijje: "baa zabar ba" — letter name, mark name, syllable; then the whole word ---------- */
const MK = { 'َ': 'zabar', 'ِ': 'zer', 'ُ': 'pesh', 'ً': 'dozabar', 'ٍ': 'dozer', 'ٌ': 'dopesh', 'ْ': 'jazm', 'ۡ': 'jazm', 'ّ': 'tashdeed', 'ٰ': 'kzabar', 'ٖ': 'kzer', 'ٗ': 'upesh', 'ٓ': 'madd' };
const NORM = { 'ى': 'ي', 'ی': 'ي', 'ے': 'ي', 'ک': 'ك', 'ہ': 'ه', 'ھ': 'ه', 'أ': 'ء', 'إ': 'ء', 'ؤ': 'ء', 'ئ': 'ء', 'ٱ': 'ا', 'آ': 'ا' };
const clip = k => AU[k] ? 'a/' + AU[k] : null;
function hijjeOn(id) { if (S.hj === 2) return false; const n = +String(id).split('-')[0]; if (S.hj === 1) return n >= 2; return n >= 3 && n <= 13; }
function hijjeList(id) {
  const it = itemAr(id); if (!it || !it.ar) return null;
  const all = graphemes(it.ar.trim()); if (all.filter(x => x === ' ').length > 2) return null;
  const out = []; let any = false, prev = '';
  const push = (u, g, cap) => { if (u && !(out.length && out[out.length - 1].u === u)) out.push({ u, g, cap }); };
  all.forEach((x, gi) => {
    if (x === ' ' || x === 'ـ') { prev = ''; return; }
    if (out === null) return;
    const c = x[0], ms = [...x.slice(1)].map(ch => MK[ch]).filter(Boolean);
    /* alif carrying a vowel is read as hamza: "hamza zabar a" */
    const base = c === 'ا' && ms.some(m => m !== 'madd') ? 'ء' : NORM[c] || c; const nm = clip('n:' + base);
    if (!nm) { any = null; return; }
    push(nm, gi, [x, RN[base] || '']);
    /* tashdeed first, then the vowel — "baa tashdeed zabar" */
    ms.sort((a, b) => (b === 'tashdeed') - (a === 'tashdeed'));
    ms.forEach(m => { const u = clip('m:' + m), cp = [x, (RN[base] || '') + ' · ' + (MR[m] || m)]; if (u) push(u, gi, cp); else if (out.length) out[out.length - 1].cap = cp; if (any !== null) any = true; });
    let s = null;
    if (ms.some(m => m !== 'jazm' && m !== 'tashdeed')) { s = clip('t:' + x) || clip('t:' + x.replace('ّ', '')); prev = x; }
    else { prev += x; s = clip('t:' + prev); }
    if (s) push(s, gi, [prev || x, '']);
  });
  if (!any) return null;
  const whole = srcOf(id); if (whole && !whole.blob && !whole.start) push(whole.url, -1, [it.ar, '']);
  return out;
}
const RN = { 'ا': 'Alif', 'ب': 'Baa', 'ت': 'Taa', 'ث': 'Saa', 'ج': 'Jeem', 'ح': 'Haa', 'خ': 'Khaa', 'د': 'Daal', 'ذ': 'Zaal', 'ر': 'Raa', 'ز': 'Zaa', 'س': 'Seen', 'ش': 'Sheen', 'ص': 'Saad', 'ض': 'Zaad', 'ط': 'Toa', 'ظ': 'Zoa', 'ع': 'Ain', 'غ': 'Ghain', 'ف': 'Faa', 'ق': 'Qaaf', 'ك': 'Kaaf', 'ل': 'Laam', 'م': 'Meem', 'ن': 'Noon', 'و': 'Waao', 'ه': 'Haa', 'ء': 'Hamza', 'ي': 'Yaa' };
const MR = { zabar: 'zabar', zer: 'zer', pesh: 'pesh', dozabar: 'do zabar', dozer: 'do zer', dopesh: 'do pesh', jazm: 'jazm', tashdeed: 'tashdeed', kzabar: 'khada zabar', kzer: 'khadi zer', upesh: 'ulta pesh', madd: 'madd' };
function hjMark(id, g) {
  $$('.hjon').forEach(e => e.classList.remove('hjon'));
  const el = itemEl(id); if (!el || g < 0) return;
  const sp = [...el.querySelectorAll('[data-g]')].find(s => g >= +s.dataset.g && g < +s.dataset.g + (+s.dataset.gn || 1));
  if (sp) sp.classList.add('hjon');
}
function hjCap(cap) {
  let c = $('.hjcap'); if (!cap) { c && c.remove(); return; }
  if (!c) { c = document.createElement('div'); c.className = 'hjcap'; document.body.appendChild(c); }
  c.innerHTML = `<b>${esc(cap[0])}</b>${cap[1] ? `<span>${esc(cap[1])}</span>` : ''}`;
}
function playUrls(id, steps) {
  return new Promise(res => {
    let i = 0;
    const end = v => { hjMark(id, -1); hjCap(null); res(v); };
    const nx = () => {
      if (playing !== id) return end(false); if (i >= steps.length) return end(true);
      const s = typeof steps[i] === 'string' ? { u: steps[i], g: -1 } : steps[i]; i++;
      hjMark(id, s.g); hjCap(s.cap && s.g >= 0 ? s.cap : null);
      A.onended = () => setTimeout(nx, 120); A.onerror = () => nx(); A.src = s.u; rate(); const p = A.play(); if (p && p.catch) p.catch(() => { });
    };
    nx();
  });
}
async function playItem(id, times) {
  const h = hijjeOn(id) && hijjeList(id);
  if (!h) return playOne(id, times);
  playing = id; const ok = await playUrls(id, h); if (ok) markHeard(id); return ok;
}
function stopAudio() { playing = null; cancelAnimationFrame(raf); try { A.pause(); } catch (e) { } C() && C().stopSpeak(); }
function stopAll() { seq = null; stopAudio(); C() && C().stopListen(); highlight(null); $('#bPlay') && $('#bPlay').classList.remove('on'); hideCoach(); modeBar(null); }
async function playAll(fromId) {
  if (seq) { stopAll(); return; }
  const tok = seq = {}; $('#bPlay').classList.add('on');
  let ids = pgItems().map(e => e.dataset.id); if (fromId) ids = ids.slice(ids.indexOf(fromId));
  for (const id of ids) {
    if (seq !== tok) return; highlight(id);
    await playOne(id, S.rep); if (seq !== tok) return;
    await wait(S.gap ? 350 : 60);
  }
  if (seq !== tok) return; highlight(null); seq = null; $('#bPlay').classList.remove('on');
  if (S.auto && step(1)) setTimeout(() => playAll(), 900);
}
const wait = ms => new Promise(r => setTimeout(r, ms));
function markHeard(id) { if (!S.heard[id]) { S.heard[id] = 1; save(); const e = itemEl(id); e && !e.classList.contains('good') && e.classList.add('heard'); } }
function markGood(id) {
  S.good[id] = 1; S.heard[id] = 1; save(); const e = itemEl(id); if (e) { e.classList.remove('heard', 'bad'); e.classList.add('good'); }
  const ids = itemIds(BYT[curT]); if (!S.done[curT] && ids.every(x => S.good[x])) { S.done[curT] = 1; save(); C().SFX.win(); cheer(T('mash')); }
}

/* ---------- check one item with the mic ---------- */
let micOk = null;
function micReady() { if (micOk === null) micOk = C().available(); if (!micOk) toast(T('noMic')); return micOk; }
async function checkOne(id) {
  const it = itemAr(id); const ar = it ? it.ar : '';
  highlight(id, 'lis'); coach('mic', T('speakNow'), ''); C().SFX.mic(); await wait(180);
  const r = await C().listen(ar, { onPartial: t => coachHeard(t), max: Math.min(14000, 3800 + ar.length * 280) });
  if (r.err === 'stopped') return null;
  if (r.err && /perm|not-allowed|mic/.test(r.err)) { toast(T('micNo')); hideCoach(); return null; }
  return r;
}
async function feedback(ok, id, r) {
  const e = itemEl(id);
  if (ok) { markGood(id); flash('ok'); C().SFX.ok(); coach('ok', T('right'), r && r.heard ? T('heardT') + ': ' + r.heard : ''); if (S.vo && Math.random() < .45) await C().say('ok'); else await wait(650); }
  else { if (e) { e.classList.add('bad'); setTimeout(() => e.classList.remove('bad'), 1600); } flash('bad'); C().SFX.bad(); coach('bad', T('wrong'), r && r.heard ? T('heardT') + ': ' + r.heard : '—'); if (S.vo) await C().say('bad'); else await wait(900); }
}
/* long-press: practise one box until it is right */
async function practiseOne(id) {
  if (!micReady()) return; stopAll(); const tok = seq = {}; let n = 0;
  while (seq === tok) {
    const r = await checkOne(id); if (!r || seq !== tok) break;
    if (r.ok) { await feedback(true, id, r); break; }
    n++; await feedback(false, id, r); if (seq !== tok) break;
    coach('ear', T('listenNow'), ''); highlight(id); await playItem(id, 1); await wait(250);
    if (n >= 2 || r.empty) break;
  }
  if (seq === tok) { seq = null; hideCoach(); highlight(null); }
}
/* the shared loop for both modes: teacher=true plays the box first (Ustad ke saath) */
async function runMode(ids, teacher) {
  if (!ids.length || !micReady()) return; stopAll(); const tok = seq = {}; const R = { first: 0, mistakes: [], total: ids.length };
  $('#bPlay').classList.add('on'); modeBar(T(teacher ? 'm3' : 'm2'));
  if (S.vo) await C().say(teacher ? 'listen' : 'you');
  for (let i = 0; i < ids.length && seq === tok; i++) {
    const id = ids[i]; let fails = 0, quiet = 0; progress(i, ids.length); ensureItem(id); await wait(itemEl(id) ? 0 : 400);
    while (seq === tok) {
      if (teacher) { coach('ear', T('listenNow'), ''); highlight(id); await playItem(id, 1); if (seq !== tok) break; await wait(200); }
      const r = await checkOne(id); if (!r || seq !== tok) break;
      if (r.ok) { if (!fails) R.first++; await feedback(true, id, r); break; }
      /* nothing heard: not the child's mistake — ask once more, then carry on */
      if (r.empty) { if (++quiet >= 2) { markHeard(id); break; } coach('mic', T('louder'), ''); await wait(1200); continue; }
      fails++; if (fails === 1) R.mistakes.push(id);
      await feedback(false, id, r); if (seq !== tok) break;
      if (!teacher) { coach('ear', T('listenNow'), ''); highlight(id); await playItem(id, 1); await wait(300); }
      /* never get stuck: after a few tries the teacher reads it once more and the lesson moves on */
      if (fails >= S.tries) { coach('ear', T('moveOn'), ''); await wait(1100); break; }
    }
  }
  if (seq === tok) { progress(1, 1); seq = null; hideCoach(); modeBar(null); highlight(null); $('#bPlay').classList.remove('on'); result(R, teacher); }
}
let pick = null;
function modeSetup(teacher) {
  stopAll(); pick = null;
  sheet(head(T(teacher ? 'm3' : 'm2')) + `<p>${T(teacher ? 'm3s' : 'm2s')}</p><button class="btn g" data-s="all">▶ ${T('all')}</button><button class="btn" data-s="range">✋ ${T('from')} — ${T('to')}</button><p class="note">${T('note')}</p>`, e => {
    const b = e.target.closest('[data-s]'); if (!b) return; closeSheet();
    if (b.dataset.s === 'all') runMode(itemIds(BYT[curT]), teacher);
    else { pick = { stage: 'from', teacher }; banner(T('pickFrom')); }
  });
}
function result(R, teacher) {
  const pct = R.total ? Math.round(R.first / R.total * 100) : 0; if (pct >= 80) { C().SFX.win(); cheer('MashaAllah!'); if (S.vo) C().say('done'); }
  sheet(head(T('result')) + `<div class="res"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><p>${T('firstTry')}: <b>${R.first}</b> / ${R.total}</p><p>${T('mistakes')}: <b>${R.mistakes.length}</b></p><div class="mlist">${R.mistakes.map(id => `<span>${esc((itemAr(id) || {}).ar || '')}</span>`).join('')}</div></div>` +
    (R.mistakes.length ? `<button class="btn g" data-r="again">🔁 ${T('again')}</button>` : '') + `<button class="btn" data-x>${T('close')}</button>`,
    e => { if (e.target.closest('[data-r]')) { closeSheet(); runMode(R.mistakes, teacher); } });
}

/* ---------- coach overlay (green / red screens) ---------- */
function coach(kind, title, sub) {
  let c = $('#coach'); if (!c) { c = document.createElement('div'); c.id = 'coach'; document.body.appendChild(c); c.addEventListener('click', e => { if (e.target.closest('[data-stop]')) stopAll(); }); }
  c.className = 'on ' + kind; c.innerHTML = `<div class="ci">${kind === 'mic' ? '<span class="pulse"></span>🎙' : kind === 'ear' ? '👂' : kind === 'ok' ? '✓' : '✗'}</div><div class="ct"><b>${esc(title)}</b><small class="heardx">${esc(sub || '')}</small></div><button class="ib" data-stop aria-label="stop"><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg></button>`;
}
function coachHeard(t) { const h = $('#coach .heardx'); if (h) h.textContent = t; }
function hideCoach() { const c = $('#coach'); if (c) c.className = ''; }
function flash(k) { const f = document.createElement('div'); f.className = 'flash ' + k; document.body.appendChild(f); setTimeout(() => f.remove(), k === 'bad' ? 1200 : 700); if (k === 'bad' && navigator.vibrate) navigator.vibrate([60, 60, 60]); }
function progress(i, n) { const p = $('#mprog'); if (p) p.style.width = (i / n * 100) + '%'; }
function modeBar(t) { let m = $('#mbar'); if (!t) { m && m.remove(); return; } if (!m) { m = document.createElement('div'); m.id = 'mbar'; $('#pg').appendChild(m); } m.innerHTML = `<b>${esc(t)}</b><i><em id="mprog"></em></i>`; }
function banner(t) { let b = $('#pickb'); if (!t) { b && b.remove(); return; } if (!b) { b = document.createElement('div'); b.id = 'pickb'; $('#pg').appendChild(b); } b.textContent = t; }
let sheetCancel = null;
function ask(q, opts) { return new Promise(res => { sheet(head(q) + opts.map(([l, v]) => `<button class="btn ${v === 'r' ? 'g' : ''}" data-a="${v}">${esc(l)}</button>`).join(''), e => { const b = e.target.closest('[data-a]'); if (b) { sheetCancel = null; closeSheet(); res(b.dataset.a); } }); sheetCancel = () => res('s'); }); }

/* ---------- effects ---------- */
function cheer(msg) {
  const fx = $('#fx'); for (let i = 0; i < 28; i++) { const s = document.createElement('span'); s.className = 'star'; s.textContent = ['✦', '★', '✧', '❁'][i % 4]; s.style.left = '50%'; s.style.top = '42%'; s.style.color = ['#f2d58a', '#e0b55c', '#4ed38a', '#ff8fc8'][i % 4]; const a = Math.random() * 6.28, r = 90 + Math.random() * 170; s.style.setProperty('--dx', Math.cos(a) * r + 'px'); s.style.setProperty('--dy', Math.sin(a) * r + 'px'); fx.appendChild(s); setTimeout(() => s.remove(), 1500); }
  const c = document.createElement('div'); c.className = 'cheer'; c.textContent = msg; document.body.appendChild(c); setTimeout(() => c.remove(), 1800);
}
let tT = 0; const shown = {};
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2600); }
function toastOnce(m) { if (shown[m] && Date.now() - shown[m] < 15000) return; shown[m] = Date.now(); toast(m); }

/* ---------- sheets ---------- */
function sheet(html, onClick) { const s = $('#sheet'); s.innerHTML = `<div class="sh">${html}</div>`; s.hidden = false; sheetCancel = null; s.onclick = e => { if (e.target === s || e.target.closest('[data-x]')) { closeSheet(true); return; } onClick && onClick(e); }; }
function closeSheet(cancel) { const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; stopVoice(); if (cancel && sheetCancel) { const c = sheetCancel; sheetCancel = null; c(); } }
const head = t => `<div class="sh-h"><button class="ib" data-x aria-label="back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>${esc(t)}</b></div>`;
const seg = (k, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-k="${k}" data-v="${v}" class="${String(S[k]) === String(v) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
function settings() {
  sheet(head(T('set')) +
    `<div class="row"><label>${T('lang')}</label>${seg('ui', [['ru', 'Roman Urdu'], ['ur', 'اردو'], ['en', 'English']])}</div>` +
    `<div class="row"><label>${T('rep')}</label>${seg('rep', [[1, '1'], [2, '2'], [3, '3'], [5, '5']])}</div>` +
    `<div class="row"><label>${T('tries')}</label>${seg('tries', [[2, '2'], [3, '3'], [5, '5']])}</div>` +
    `<div class="row"><label>${T('th')}</label>${seg('th', [['l', '☀️ ' + T('thL')], ['d', '🌙 ' + T('thD')]])}</div>` +
    `<div class="row"><label>${T('sp')}</label>${seg('sp', [[0.9, T('spS')], [1.1, T('spM')], [1.3, T('spF')]])}</div>` +
    `<div class="row"><label>${T('hj')}</label>${seg('hj', [[0, T('hjA')], [1, T('hjY')], [2, T('hjN')]])}</div>` +
    `<div class="row"><label>${T('vo')}</label>${seg('vo', [[1, T('on')], [0, T('off')]])}</div>` +
    `<div class="row"><label>${T('auto')}</label>${seg('auto', [[1, T('on')], [0, T('off')]])}</div>` +
    `<button class="btn" data-a="upd">${T('upd')}</button>` +
    `<button class="btn g" data-a="rec">🎙 ${T('rec')}<small style="display:block;font-weight:400;opacity:.8">${T('recS')}</small></button>` +
    `<button class="btn r" data-a="reset">${T('reset')}</button>` +
    `<p class="note">Noorani Qaida · Quranic Science · ${verName()}<br>Mukammal Noorani Qaida — Majlis Dawat-ul-Haq, Hardoi</p>`,
    e => {
      const b = e.target.closest('[data-k]'); if (b) { const k = b.dataset.k, v = b.dataset.v; S[k] = isNaN(+v) ? v : +v; save(); applyTheme(); C().setVoice(!!S.vo); settings(); refresh(); return; }
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'upd') window.QaidaUpdate && QaidaUpdate.check(true);
      if (a.dataset.a === 'rec') { closeSheet(); window.QaidaRec && QaidaRec.open(curT); }
      if (a.dataset.a === 'reset' && confirmBox(T('resetQ'))) { S.heard = {}; S.good = {}; S.done = {}; save(); closeSheet(); refresh(); }
    });
}
function confirmBox(q) { try { return window.confirm(q); } catch (e) { return false; } }
function refresh() { if ($('#pg').classList.contains('on')) openTakhti(curT); else home(); }
/* spoken Urdu (hidayaat, rules): recorded clip h/<key>.mp3 if present, else the phone's Urdu voice */
const V = new Audio(); let voiceTok = 0;
function stopVoice() { voiceTok++; try { V.pause(); } catch (e) { } C() && C().stopSpeak(); $$('.speaking').forEach(e => e.classList.remove('speaking')); }
async function sayUrdu(key, text, el) {
  stopVoice(); stopAll(); const tok = ++voiceTok; el && el.classList.add('speaking');
  const url = AU['h:' + key];
  if (url) await new Promise(r => { V.src = 'a/' + url; V.onended = V.onerror = () => r(); V.play().catch(() => r()); });
  else if (tok === voiceTok) toastOnce(T('noH'));
  if (tok === voiceTok) el && el.classList.remove('speaking');
}
function hidSheet(title, key, paras) {
  sheet(head(title) + paras.map((p, i) => `<div class="hid big" data-say="${key}.${i}"><button class="rsay">🔊</button>${ruleHTML(p)}</div>`).join(''), async e => {
    const b = e.target.closest('[data-say]'); if (!b) return;
    if (b.classList.contains('speaking')) { stopVoice(); return; }
    /* play this paragraph and the following ones */
    const all = $$('#sheet [data-say]'); for (let i = all.indexOf(b); i < all.length; i++) { const t = voiceTok + 1; all[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); await sayUrdu(all[i].dataset.say, all[i].textContent.replace('🔊', ''), all[i]); if (voiceTok !== t) break; }
  });
}
function intro() { let n = 0; hidSheet(T('hidAll'), 'i', D.intro.flatMap(s => ['◆ ' + s.title, ...s.paras])); }

/* ---------- input ---------- */
let pressT = 0, longId = null, sx = 0, sy = 0, moved = false;
function onItemTap(id) {
  if (pick) {
    if (pick.stage === 'from') { pick = { stage: 'to', from: id, teacher: pick.teacher }; highlight(id); banner(T('pickTo')); return; }
    const ids = pgItems().map(e => e.dataset.id); let a = ids.indexOf(pick.from), b = ids.indexOf(id); if (a > b) [a, b] = [b, a];
    const teacher = pick.teacher; pick = null; banner(null); runMode(ids.slice(a, b + 1), teacher); return;
  }
  const wasSeq = !!seq; stopAll(); stopVoice(); if (wasSeq) return;
  highlight(id); playItem(id, S.rep).then(() => { if (!seq) highlight(null); });
}
function swipe() {
  const v = $('#pview'); let x0 = 0, y0 = 0, t0 = 0;
  v.addEventListener('touchstart', e => { const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); }, { passive: true });
  v.addEventListener('touchend', e => { const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - t0 < 700) { if (seq) return; C().SFX.tick && C().SFX.tick(); step(dx > 0 ? 1 : -1); } }, { passive: true });
}
function bind() { swipe();
  $('#bGo').onclick = () => openTakhti(S.tk || 1);
  $('#bSet').onclick = settings;
  $('#modes').onclick = e => { const m = e.target.closest('[data-mode]'); if (!m) return; openTakhti(S.tk || 1); const k = m.dataset.mode; if (k === 'sabak') setTimeout(() => modeSetup(false), 400); if (k === 'learn') setTimeout(() => modeSetup(true), 400); };
  $('#tlist').onclick = e => { if (e.target.closest('[data-intro]')) { intro(); return; } const t = e.target.closest('[data-tk]'); if (t) openTakhti(+t.dataset.tk); };
  $('#bBack').onclick = () => home();
  $('#bNext').onclick = () => step(1); $('#bPrev').onclick = () => step(-1);
  $('#bPlay').onclick = () => playAll();
  $('#bRep').onclick = () => { const o = [1, 2, 3, 5]; S.rep = o[(o.indexOf(S.rep) + 1) % o.length]; save(); $('#repN').textContent = S.rep; toast(T('rep') + ': ' + S.rep); };
  $('#bSabak').onclick = () => modeSetup(false); $('#bLearn').onclick = () => modeSetup(true);
  const openHid = n => { const t = BYT[n]; if (t && t.hid) hidSheet(T('hid') + ' · ' + T('takhti') + ' ' + t.n, 't' + t.n, t.hid.split('\n')); else toast(T('tap')); };
  $('#bHelp').onclick = () => openHid(curT);
  const v = $('#pview');
  v.addEventListener('click', e => {
    const h = e.target.closest('[data-hid]'); if (h) { openHid(+h.dataset.hid); return; }
    const r = e.target.closest('[data-rule]'); if (r) { if (r.classList.contains('speaking')) stopVoice(); else sayUrdu('r' + r.dataset.rule, r.textContent.replace('🔊', ''), r); }
  });
  v.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; moved = false; const c = e.target.closest('[data-id]'); clearTimeout(pressT); longId = null; if (c && !pick) pressT = setTimeout(() => { longId = c.dataset.id; navigator.vibrate && navigator.vibrate(25); practiseOne(longId); }, 480); });
  v.addEventListener('pointermove', e => { if (Math.abs(e.clientX - sx) > 12 || Math.abs(e.clientY - sy) > 12) { moved = true; clearTimeout(pressT); } });
  v.addEventListener('pointerup', e => {
    clearTimeout(pressT); const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) { step(dx > 0 ? 1 : -1); return; }
    if (moved || longId) return;
    const c = e.target.closest('[data-id]'); if (c) onItemTap(c.dataset.id);
  });
  v.addEventListener('contextmenu', e => e.preventDefault());
  addEventListener('resize', () => { if ($('#pg').classList.contains('on') && !seq) { const y = $('.pslot') && $('.pslot').scrollTop; openTakhti(curT); if ($('.pslot')) $('.pslot').scrollTop = y; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') back(); });
}
function back() {
  if (document.getElementById('upd')) { document.getElementById('upd').remove(); return true; }
  if (window.QaidaWudu && QaidaWudu.back()) return true;
  if (!$('#sheet').hidden) { closeSheet(true); return true; }
  if (window.QaidaRec && QaidaRec.isOpen()) { QaidaRec.close(); return true; }
  if (pick) { pick = null; banner(null); highlight(null); return true; }
  if (seq) { stopAll(); return true; }
  if ($('.speaking')) { stopVoice(); return true; }
  if ($('#pg').classList.contains('on')) { home(); return true; }
  return false;
}
window.__qaidaBack = back;
window.Qaida = { S, save, toast, BYT, ORDER, takhtiHTML, fit, srcOf, itemAr, items: () => pgItems(), cur: () => curT, refresh, stop: stopAll, T, A, graphemes, openTakhti, runMode, step, pagesOf, practiseOne, back, hijjeList, playItem, AU: () => AU };

(async () => {
  await load(); bind(); home(); C().setVoice(!!S.vo);
  const sp = $('#splash'); sp.classList.add('go'); try { C().SFX.win(); } catch (e) { }
  setTimeout(() => sp.classList.add('out'), 3000); setTimeout(() => { sp.remove(); window.QaidaWudu && QaidaWudu.ask(); }, 3500);
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.QaidaAndroid) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
})();

(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(3, '0');
const RTL = { ar: 1, ur: 1, fa: 1 };
const REC = ['Alafasy_128kbps', 'Husary_128kbps', 'Abdurrahmaan_As-Sudais_192kbps', 'Minshawy_Murattal_128kbps', 'Abdul_Basit_Murattal_192kbps'];
const I = window.I18N, STR = I.STR;
const KEY = 'fahm.v1';
let st = { s: 0, a: 0, w: 0, ui: 'ru', tl: null, rec: REC[0], auto: true, ios: 0, theme: 'dark', rfs: 30, sfx: 1, trw: true };
try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } };
if (!STR[st.ui]) st.ui = 'ru';
const MASLAK = [['d', 'ur'], ['b', 'urk'], ['a', 'urg'], ['j', 'urm'], ['s', 'urn']], URD = ['ur', 'urj', 'urm', 'urh', 'urk', 'urq', 'urg', 'urn', 'urz', 'rur'];
const DEF_TL = { ur: ['ur'], ru: ['rur'], en: ['en'] };
if (!st.tl || !st.tl.length) st.tl = DEF_TL[st.ui].slice();
const T = k => STR[st.ui][k];
const sName = S => {
  const o = (I.surah[S.n] || {})[st.ui]; if (o) return o;
  if (st.ui === 'ur') return [S.ur.replace(/^سورۃ\s*/, ''), S.meanUr || S.mean];
  if (st.ui === 'ru') { const mu = window.FahmConv && FahmConv.ok() ? FahmConv.roman(S.meanUr) : null; return [S.en, mu ? mu.charAt(0).toUpperCase() + mu.slice(1) : S.mean]; }
  return [S.en, S.mean];
};
/* extra UI strings (ur / ru / en) */
const X = {
  ur: { surahTab: 'سورتیں', juzTab: 'پارے', para: 'پارہ', ctxH: 'پس منظر اور شانِ نزول', tafH: 'تفسیر', tafBtn: 'اس آیت کی تفسیر پڑھیں', tafLoad: 'تفسیر لوڈ ہو رہی ہے…', tafErr: 'تفسیر کے لیے انٹرنیٹ درکار ہے', more: 'مزید پڑھیں', less: 'کم کریں', anim: 'لفظ بہ لفظ اینیمیشن', hzTr: 'حافظ موڈ شروع ہوتے ہی ترجمہ خودکار بند', loading: 'لوڈ ہو رہا ہے…', ctxSrc: 'ماخذ', ctxEn: 'اس زبان کے لیے پس منظر انگریزی میں دکھایا جا رہا ہے', juzOf: 'پارہ', makki: 'مکی', madani: 'مدنی' },
  ru: { surahTab: 'Surahs', juzTab: 'Paare (Juz)', para: 'Paara', ctxH: 'Pas-e-manzar aur Shaan-e-nuzool', tafH: 'Tafseer', tafBtn: 'Is ayat ki tafseer padhein', tafLoad: 'Tafseer load ho rahi hai…', tafErr: 'Tafseer ke liye internet zaroori hai', more: 'Mazeed padhein', less: 'Kam karein', anim: 'Lafz ba lafz animation', hzTr: 'Hafiz mode shuru hote hi tarjuma khud band', loading: 'Load ho raha hai…', ctxSrc: 'Mukhaiz', ctxEn: 'Is zubaan ke liye pas-e-manzar English mein hai', juzOf: 'Paara', makki: 'Makki', madani: 'Madani' },
  en: { surahTab: 'Surahs', juzTab: 'Juz (para)', para: 'Juz', ctxH: 'Background & context of revelation', tafH: 'Tafseer', tafBtn: 'Read tafseer of this ayah', tafLoad: 'Loading tafseer…', tafErr: 'Tafseer needs an internet connection', more: 'Read more', less: 'Show less', anim: 'Word-by-word animation', hzTr: 'Switch translation off automatically when Hafiz mode starts', loading: 'Loading…', ctxSrc: 'Source', ctxEn: 'Background is shown in English for this language', juzOf: 'Juz', makki: 'Makki', madani: 'Madani' }
};
const XT = k => (X[st.ui] || X.en)[k];
const lName = c => I.lang[st.ui][c] || c;
const tName = c => I.translator[st.ui][c] || '';
const RECS = window.FAHM_RECS || [];
const rName = r => { const e = RECS.find(x => x[0] === r); return e ? (st.ui === 'ur' ? e[2] : e[1]) : ((I.reciter[r] || {})[st.ui] || r); };
const pick = o => o ? (st.ui === 'ur' ? o.ur : st.ui === 'ru' ? o.ru : o.en) : '';
let VID = {}, D, scene, rootIdx = FahmData.roots, playing = false, timer = null, bounds = [], hist = [], exitAt = 0;
const codesNeeded = () => { const c = st.tl.slice(); if (c.includes('rur') && !c.includes('ur')) c.push('ur'); return c; };
async function ensureS(si) { try { await FahmData.load(si, codesNeeded()); } catch (e) { toast(T('audioErr')); throw e; } }
const au = new Audio(); au.preload = 'auto';
let wordAu = null;

function stripD(s) { return s.replace(/[ً-ٰٟۖ-ۭ࣓-ࣿ‏]/g, ''); }
function cur() { const S = D.surahs[st.s]; return { S, A: S.ayat[st.a], W: S.ayat[st.a].words[st.w] }; }
function toast(m, ms = 2800) { const e = $('#toast'); e.textContent = m; e.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => e.hidden = true, ms); }

function lemKey(s) { return stripD(s).replace(/ٱ/g, 'ا').replace(/ـ/g, ''); }
function wordMeaning(w) { return st.ui === 'ur' ? [w.ur, 'u'] : st.ui === 'ru' ? [w.ru, ''] : [w.en, '']; }
function capOf(spec, key) { return st.ui === 'ur' ? (window.FAHM_CX_UR[key] || spec.cx.uru || '') : st.ui === 'ru' ? spec.cx.ur : spec.cx.en; }

/* story caption = the translation the user selected (real translator) + a small scene explanation underneath */
function setCx(spec, S, A) {
  setCx.last = [spec, S, A];
  const c = st.tl.find(x => A.tr && A.tr[x]) || (st.ui === 'ur' ? 'ur' : st.ui === 'ru' ? 'rur' : 'en'), t = (A.tr && A.tr[c]) || '', rtl = RTL[c] || (URD.includes(c) && c !== 'rur'), cap = capOf(spec, `${S.n}:${A.v}`) || '';
  $('#cx').innerHTML = (t ? `<div class="cxt${rtl ? ' rtl' : ''}${URD.includes(c) && c !== 'rur' ? ' u' : ''}"${rtl ? ' dir="rtl"' : ''}>${esc(t)}<small>${esc(lName(c))} · ${esc(tName(c))}</small></div>` : '') + (cap ? `<div class="cxs">${esc(cap)}</div>` : '');
}
function setSw() { const e = $('#sw'); if (!e) return; const w = cur().W, [m, c] = wordMeaning(w); e.innerHTML = `<b class="ar">${esc(w.ar)}</b><span class="${c}">${esc(m)}</span>`; }
function renderAyah(keepPlay) {
  const { S, A } = cur(); if (st.w >= A.words.length) st.w = 0;
  const sn = sName(S); $('#tAr').textContent = sn[0]; $('#tSub').textContent = sn[1];
  $('#ayahNo').textContent = `${T('ayah')} \u2066${A.v} / ${S.ayat.length}\u2069`; $('#storyH').textContent = T('story');
  $('#words').innerHTML = A.words.map((w, i) => { const [m, c] = wordMeaning(w); return `<button class="w" data-i="${i}"><span class="a ar">${esc(w.ar)}</span><span class="m ${c}">${esc(m)}</span></button>`; }).join('');
  const spec = window.FAHM_SCENES[`${S.n}:${A.v}`] || (window.FahmCompose ? FahmCompose.spec(S, A) : { sky: 'night', items: [], cx: { ur: '', en: '' } });
  videoFor(`${S.n}:${A.v}`);
  scene.set(spec); scene.all(); setCx(spec, S, A);
  renderTrans(); renderNZ(); setWord(st.w, false, true); computeBounds(); save(); navUi();
  if (!keepPlay) stopAll();
  if (window.FahmWS && FahmWS.isOpen()) FahmWS.refresh(playing ? 0 : -1);
}

function setWord(i, fromAudio, silent) {
  st.w = i; scene.show(i);
  document.querySelectorAll('#words .w').forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('seen', k < i); });
  renderWordCard(); showLab(); setSw();
  if (window.FahmWS) FahmWS.set(i, !!fromAudio);
  if (!fromAudio && !silent) save();
}

function renderWordCard() {
  const { W, S, A } = cur(), [m, c] = wordMeaning(W);
  const roots = W.root ? [...W.root] : [];
  const rootHtml = roots.length ? `<div class="root"><span class="lbl">${T('root')}</span>${roots.map((l, k) => `<span class="lt" style="animation-delay:${k * 0.12}s">${l}</span>${k < roots.length - 1 ? '<span class="sep">–</span>' : ''}`).join('')}<button class="rmb" data-rmap="${esc(W.root)}">🌳 ${({ ur: 'روٹ میپ', ru: 'Root map', en: 'Root map' })[st.ui] || 'Root map'}</button></div>` : '';
  let same = '';
  if (W.root && rootIdx[W.root]) {
    const seen = new Set([stripD(W.ar)]), items = [];
    for (const r of rootIdx[W.root]) { const w = D.surahs[r.s].ayat[r.a].words[r.w], k = stripD(w.ar); if (seen.has(k)) continue; seen.add(k); items.push(r); if (items.length >= 8) break; }
    if (items.length) same = `<div class="hint">${T('same')}</div><div class="same">${items.map(r => { const w = D.surahs[r.s].ayat[r.a].words[r.w], [mm] = wordMeaning(w); return `<button data-go="${r.s},${r.a},${r.w}"><b class="ar">${esc(w.ar)}</b>${esc(mm)}</button>`; }).join('')}</div>`;
  }
  $('#wordcard').innerHTML = `<div class="wc-top"><div class="wc-ar ar">${esc(W.ar)}</div><div class="wc-info">${st.ui === 'ur' ? '' : `<div class="wc-tl">${esc(W.tl)}</div>`}<div class="wc-m ${c}">${esc(m)}</div></div><button class="spk" id="spkW" aria-label="${T('listen')}"><svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" style="stroke:currentColor;stroke-width:2;fill:none"/></svg></button></div>${rootHtml}${same}`;
}

function renderTrans() {
  const { S, A } = cur(); if (setCx.last && setCx.last[2] === A) setCx(setCx.last[0], S, A);
  $('#trans').innerHTML = st.tl.filter(c => A.tr[c]).map(c => {
    const L = D.langs.find(l => l.c === c), cls = (URD.includes(c) && c !== 'rur' ? 'u' : c === 'hi' ? 'h' : '') + ((RTL[c] || (URD.includes(c) && c !== 'rur')) ? ' rtl' : '');
    return `<div class="tr"><div class="lh"><span>${esc(lName(c))} · ${esc(tName(c))}</span><button class="sp" data-tts="${c}" aria-label="Listen"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></div><p class="${cls}" ${(RTL[c] || (URD.includes(c) && c !== 'rur')) ? 'dir="rtl"' : ''}>${esc(A.tr[c])}</p></div>`;
  }).join('');
}

/* Background (pas-e-manzar / shan-e-nuzool) and tafseer follow the FIRST selected translation:
   any Urdu translation -> Urdu, Roman Urdu -> Roman, Hindi -> Hindi (Devanagari), English and the other languages -> English. */
function ctxFam() { const c = st.tl[0] || (st.ui === 'ur' ? 'ur' : st.ui === 'ru' ? 'rur' : 'en'); return URD.includes(c) && c !== 'rur' ? 'ur' : c === 'rur' ? 'ru' : c === 'hi' ? 'hi' : c === 'en' ? 'en' : 'oth'; }
const famUi = f => f === 'ur' ? 'ur' : f === 'ru' ? 'ru' : f === 'hi' ? 'hi' : 'en';
function txtFam(urText, enText, fam) {   // pick / convert text for a language family
  if (fam === 'ur') return urText; if (fam === 'ru') return window.FahmConv && FahmConv.ok() ? FahmConv.roman(urText) : null; if (fam === 'hi') return window.FahmConv && FahmConv.ok() ? FahmConv.dev(urText) : null; return enText;
}
let nzTok = 0;
async function renderNZ() {
  const { S, A } = cur(), tok = ++nzTok, fam = ctxFam(), box = $('#nz'); $('#credits').innerHTML = brandHtml();
  if ((fam === 'ru' || fam === 'hi') && window.FahmConv && !FahmConv.ok()) { box.innerHTML = `<h4>${esc(XT('ctxH'))}</h4><p class="dim">${esc(XT('loading'))}</p>`; await FahmConv.load(); if (tok !== nzTok) return; }
  const nz = window.FAHM_NZ[S.n], dir = fam === 'ur' ? ' dir="rtl" class="u"' : '';
  let intro = null; try { intro = await FahmData.intro(S.n); } catch (e) { }
  if (tok !== nzTok) return;
  const fu = famUi(fam), nzTxt = nz ? (fam === 'en' || fam === 'oth' ? nz.en : fam === 'ur' ? (window.FAHM_NZ_UR[S.n] || '') : fam === 'ru' ? nz.ur : txtFam(window.FAHM_NZ_UR[S.n] || '', '', 'hi')) : '';
  const TB = { nz: { ur: 'شانِ نزول', ru: 'Shaan-e-nuzool', hi: 'शाने-नुज़ूल', en: 'Reason of revelation' }, bg: { ur: 'پس منظر', ru: 'Pas-e-manzar', hi: 'पृष्ठभूमि', en: 'Background' }, taf: { ur: 'تفسیر', ru: 'Tafseer', hi: 'तफ़सीर', en: 'Tafseer' } };
  let tab = st.nzt; if (!['nz', 'bg', 'taf'].includes(tab)) tab = nzTxt ? 'nz' : 'bg';
  let html = `<div class="nzt">${['nz', 'bg', 'taf'].map(k => `<button class="${k === tab ? 'on' : ''}" data-nzt="${k}">${esc(TB[k][fu])}</button>`).join('')}</div>`;
  if (tab === 'nz') {
    html += nzTxt ? `<p${dir}>${esc(nzTxt)}</p><small>${esc(XT('ctxSrc'))}: ${esc(TB.nz[fu])} · ${esc(S.ur || '')}</small>` : `<p class="dim">${esc({ ur: 'اس سورت کی شانِ نزول الگ سے محفوظ نہیں؛ پس منظر کا ٹیب دیکھیں۔', ru: 'Is surah ki shaan-e-nuzool alag se mehfooz nahin; Pas-e-manzar tab dekhein.', hi: 'इस सूरत की शाने-नुज़ूल अलग से नहीं है; पृष्ठभूमि टैब देखें।', en: 'No separate revelation note for this surah; see the Background tab.' }[fu])}</p>`;
  } else if (tab === 'bg') {
    if (intro) {
      const raw = fam === 'en' || fam === 'oth' ? intro.en : (fam === 'ur' ? intro.ur : (txtFam(intro.ur, '', fam) || ''));
      html += `<div class="intro fold" id="introBox"${dir}>${raw}</div><button class="more" data-more="1">${esc(XT('more'))}</button><small>${esc(XT('ctxSrc'))}: ${esc(intro.src || 'Tafheem-ul-Quran')} (S. Abul A'la Maududi)${fam === 'oth' ? ' · ' + esc(XT('ctxEn')) : ''}</small>`;
    } else html += `<p class="dim">${esc(T('nzn'))}</p>`;
  } else html += `<div class="taf"><div id="tafBody"></div></div>`;
  box.innerHTML = html;
  if (tab === 'taf') loadTafsir();
}
const TAF = {}; /* ayah tafseer from Quran.com (needs internet): Urdu = Tafsir Ibn Kathir (Urdu), everything else = Tafsir Ibn Kathir (English) */
async function loadTafsir() {
  const { S, A } = cur(), fam = ctxFam(), isUr = fam === 'ur' || fam === 'ru' || fam === 'hi', c0 = st.tl[0] || '', list = isUr ? TAFO.ur : TAFO.en, ov = (st.tafo || {})[c0], id = list.some(x => x[0] === ov) ? ov : (isUr ? (c0 === 'urm' ? 157 : 160) : 169), key = `${id}:${S.n}:${A.v}`, bx = $('#tafBody'); if (!bx) return;
  const chips = `<div class="tafc">${list.map(x => `<button class="${x[0] === id ? 'on' : ''}" data-tafid="${x[0]}">${esc(x[1])}</button>`).join('')}</div>`;
  const who = D.langs.find(l => l.c === c0), whoT = who ? `<small class="tafw">${esc({ ur: 'آپ کا ترجمہ', ru: 'Aap ka tarjuma', hi: 'आपका तर्जुमा', en: 'Your translation' }[famUi(fam)])}: ${esc(who.label)}</small>` : '';
  const msg = { ur: ['تفسیر لوڈ ہو رہی ہے…', 'تفسیر کے لیے انٹرنیٹ درکار ہے'], ru: ['Tafseer load ho rahi hai…', 'Tafseer ke liye internet zaroori hai'], hi: ['तफ़सीर लोड हो रही है…', 'तफ़सीर के लिए इंटरनेट ज़रूरी है'], en: ['Loading tafseer…', 'Tafseer needs an internet connection'] }[famUi(fam)];
  bx.innerHTML = whoT + chips + `<p class="dim">${msg[0]}</p>`;
  try {
    if (!TAF[key]) { const r = await fetch(`https://api.quran.com/api/v4/tafsirs/${id}/by_ayah/${S.n}:${A.v}`); if (!r.ok) throw 0; const j = await r.json(); TAF[key] = { t: (j.tafsir.text || '').replace(/<(?!\/?(p|br|b|i|h[1-6])\b)[^>]*>/gi, '').replace(/<(p|br|b|i|h[1-6])\b[^>]*>/gi, '<$1>'), n: j.tafsir.resource_name || '' }; }
    let t = TAF[key].t; if (isUr && fam !== 'ur') { await FahmConv.load(); t = fam === 'ru' ? FahmConv.roman(t) : FahmConv.dev(t); }
    if (key !== `${id}:${cur().S.n}:${cur().A.v}`) return;
    bx.innerHTML = whoT + chips + `<div class="tafx"${fam === 'ur' ? ' dir="rtl"' : ''}>${t}</div><small>${esc(TAF[key].n)} · Quran.com</small>`;
  } catch (e) { bx.innerHTML = whoT + chips + `<p class="dim">${msg[1]}</p>`; }
}
document.addEventListener('click', e => { const b = e.target.closest('[data-nzt]'); if (!b) return; st.nzt = b.dataset.nzt; save(); renderNZ(); });
const TAFO = { ur: [[160, 'Ibn Kathir'], [159, 'Bayan-ul-Quran (Dr Israr Ahmad)'], [818, 'Tazkir-ul-Quran (W. Khan)'], [157, 'Fi Zilal-al-Quran (S. Qutb)']], en: [[169, 'Ibn Kathir'], [168, "Ma'arif al-Qur'an (Mufti M. Shafi)"], [817, 'Tazkirul Quran (W. Khan)']] };
document.addEventListener('click', e => { const b = e.target.closest('[data-tafid]'); if (!b) return; const c0 = st.tl[0] || ''; st.tafo = st.tafo || {}; st.tafo[c0] = +b.dataset.tafid; save(); loadTafsir(); });

/* ---------- 3D word scene ---------- */
function showLab() {
  const { A, W } = cur(), [m] = wordMeaning(W);
  $('#labTop').textContent = `${T('word')} ${st.w + 1} ${T('of')} ${A.words.length}`;
  const inf = FahmWS.miniInfo(st.w);
  $('#labM').textContent = m; $('#labM').className = st.ui === 'ur' ? 'u' : '';
  $('#labN').textContent = inf.note || '';
  FahmWS.miniSet(st.w);
}

/* ---------- Quranic Science branding footer ---------- */
const BRAND = { fb: 'https://www.facebook.com/share/16J4k6RuE7n/', ig: 'https://www.instagram.com/quranicscienceofficial/', yt: 'https://www.youtube.com/@quranicscienceofficial01', web: 'https://quranicscience.info', wa: 'https://wa.me/919272527913', mail: 'quranicscience01@gmail.com', ph: '+91 92725 27913' };
const SUPT = {
  ur: { t: 'ہمیں سپورٹ کریں', b: 'یہ ایپ مکمل مفت ہے: نہ اشتہار، نہ کوئی فیس۔ قرآن کو لفظ بہ لفظ سمجھانے والی اینیمیشن، آڈیو اور حفظ کے اوزار بنانے اور انہیں مفت رکھنے میں وقت، محنت اور خرچ لگتا ہے۔ آپ کا تعاون نئی سورتوں کی اینیمیشن، مزید زبانوں اور علماء سے تصدیق کا کام جاری رکھنے میں ہماری مدد کرتا ہے۔', z: 'نوٹ: یہاں زکوٰۃ، صدقات اور خیرات نہ دیں۔ صرف اللہ کی رضا کے لیے اپنے پاک مال سے ہدیہ کریں۔ زکوٰۃ یا صدقات دینا چاہیں تو واٹس ایپ پر ہم سے رابطہ کریں یا کسی مستحق تک اپنے ہاتھ سے پہنچائیں۔', s: 'کسی بھی یو پی آئی ایپ سے اسکین کریں' },
  ru: { t: 'Hamein support karein', b: 'Yeh app bilkul muft hai: na ishtihaar, na koi fees. Quran ko lafz ba lafz samjhane wali animation, audio aur hifz ke auzaar banane aur unhein muft rakhne mein waqt, mehnat aur kharch lagta hai. Aap ka taawun nayi suraton ki animation, mazeed zubanon aur ulama se tasdeeq ka kaam jaari rakhne mein hamari madad karta hai.', z: 'Note: yahan zakat, sadqaat aur khairaat na dein. Sirf Allah ki raza ke liye apne paak maal se hadiya karein. Zakat ya sadqaat dena chahein to WhatsApp par hum se rabta karein ya kisi mustahiq tak apne haathon se pahunchayein.', s: 'Kisi bhi UPI app se scan karein' },
  en: { t: 'Support Quranic Science', b: 'This app is completely free: no ads, no fees. Building the word-by-word animations, audio and memorisation tools, and keeping them free, takes time, effort and running costs. Your support helps us keep adding animations for more surahs, more languages and scholar verification.', z: 'Note: please do not give Zakat, Sadaqah or Khairat here. Give only as a gift from your pure (halal) wealth, for the sake of Allah. If you wish to give Zakat or Sadaqah, contact us on WhatsApp or hand it directly to someone in need.', s: 'Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM)' }
};
function openSupport() {
  let o = document.getElementById('sup'); if (!o) { o = document.createElement('div'); o.id = 'sup'; document.body.appendChild(o); o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-sclose]')) o.hidden = true; }); }
  const u = st.ui, A1 = SUPT[u] || SUPT.en, A2 = u === 'en' ? SUPT.ur : SUPT.en, blk = (x, dir, cls) => `<div class="sb2 ${cls}" dir="${dir}"><h3>${x.t}</h3><p>${x.b}</p><p class="zk">${x.z}</p></div>`;
  o.innerHTML = `<div class="sbox"><button class="sx" data-sclose="1" aria-label="close">✕</button><div class="sqr"><img src="icons/qr-support.webp" alt="QR"><small>${A1.s}</small></div>` +
    blk(A1, u === 'ur' ? 'rtl' : 'ltr', u === 'ur' ? 'urd' : '') + '<hr>' + blk(A2, u === 'en' ? 'rtl' : 'ltr', u === 'en' ? 'urd' : '') + '</div>';
  o.hidden = false;
}
function brandHtml() {
  const u = st.ui, L = ({ ur: { tag: 'علم جو سوچ بدل دے', cr: 'رابطہ اور ماخذ', by: 'فہم القرآن — قرآنک سائنس کی طرف سے مفت', nm: 'قرآنک سائنس', fb: 'فیس بک', ig: 'انسٹاگرام', yt: 'یوٹیوب', web: 'ویب سائٹ', w: 'واٹس ایپ', e: 'ای میل', sup: 'سپورٹ کریں', ds: 'نماز کے اوقات کے لیے', dn: 'دین ساتھی ایپ', dd: 'ڈاؤن لوڈ' }, ru: { tag: 'Ilm Jo Soch Badal De', cr: 'Rabta aur mukhaiz', by: 'Fahmul Quraan — Quranic Science ki taraf se muft', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', w: 'WhatsApp', e: 'Email', sup: 'Support karein', ds: 'Namaz ke auqaat ke liye', dn: 'Deen Saathi app', dd: 'Download' }, en: { tag: 'Ilm Jo Soch Badal De', cr: 'Contact & credits', by: 'Fahmul Quraan — free from Quranic Science', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', w: 'WhatsApp', e: 'Email', sup: 'Support us', ds: 'For prayer times', dn: 'Deen Saathi app', dd: 'Download' } })[u] || {};
  const ic = {
    fb: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#1877F2"/><path d="M26.5 39V26h4.3l.7-5.2h-5V17.6c0-1.5.5-2.5 2.6-2.5H32v-4.6A35 35 0 0 0 28.3 10c-3.9 0-6.6 2.4-6.6 6.7v4.1H17.3V26h4.4v13z" fill="#fff"/></svg>',
    ig: '<svg viewBox="0 0 48 48"><defs><radialGradient id="igg" cx="30%" cy="107%" r="140%"><stop offset="0" stop-color="#fdf497"/><stop offset=".1" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset="1" stop-color="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="44" height="44" rx="12" fill="url(#igg)"/><rect x="11.5" y="11.5" width="25" height="25" rx="7.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31.4" cy="16.6" r="1.9" fill="#fff"/></svg>',
    yt: '<svg viewBox="0 0 48 48"><rect x="2" y="9" width="44" height="30" rx="9" fill="#FF0000"/><path d="M20 17v14l12-7z" fill="#fff"/></svg>',
    web: '<img src="icons/qs-logo.webp" alt="" width="46" height="46" style="border-radius:12px">',
    wa: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#25D366"/><path d="M13 36l1.9-6.9A11.5 11.5 0 1 1 19.2 34z" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><path d="M19.5 17c-.6 0-1.5.9-1.5 2.6 0 3.8 5.8 9.4 9.8 9.4 1.7 0 2.6-1.3 2.6-2l-3-1.6-1.3 1.1c-1.9-.6-3.6-2.3-4.3-4.1l1.1-1.2z" fill="#fff"/></svg>',
    bmail: '<svg viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="12" fill="#EA4335"/><rect x="11" y="14" width="26" height="20" rx="3" fill="#fff"/><path d="M12 16l12 9 12-9" fill="none" stroke="#EA4335" stroke-width="2.6" stroke-linejoin="round"/></svg>'
  };
  const tile = (k, t, h, web) => `<a class="tile ${k}" href="${h}" ${web ? `data-web="${h}"` : 'target="_blank" rel="noopener"'} aria-label="${t}"><span class="ti">${ic[k]}</span><span class="tn">${t}</span></a>`;
  const dsU = 'https://quranicscience.info/deen-saathi/';
  const dsCard = `<a class="dsaa" href="${dsU}" data-web="${dsU}"><span class="dsi">🕌</span><span class="dst"><small>${L.ds}</small><b>${L.dn}</b></span><span class="dsb">⬇ ${L.dd}</span></a>`;
  return dsCard + `<div class="brand"><div class="bhead"><img src="icons/qs-logo.webp" alt="Quranic Science" width="48" height="48"><div class="bn"><b>${L.nm}</b><em>${L.tag}</em></div></div>` +
    `<div class="tiles">${tile('web', L.web, BRAND.web, true)}${tile('yt', L.yt, BRAND.yt)}${tile('ig', L.ig, BRAND.ig)}${tile('fb', L.fb, BRAND.fb)}${tile('wa', L.w, BRAND.wa)}${tile('bmail', L.e, 'mailto:' + BRAND.mail)}</div>` +
    `<button class="bsup" data-bsup="1">❤ ${L.sup}</button>` +
    `<details class="bcr"><summary>${L.cr}</summary><div class="bct"><a href="mailto:${BRAND.mail}">✉ ${BRAND.mail}</a><a href="${BRAND.wa}" target="_blank" rel="noopener">${L.w} ${BRAND.ph}</a><a href="${BRAND.web}" data-web="${BRAND.web}">🌐 ${BRAND.web.replace('https://', '')}</a></div><p>${esc(T('credits'))}</p><p class="bby">${L.by}</p></details></div>`;
}
/* in-app website viewer: logo + working back button (never throws the user out of the app) */
function openWeb(u) { const w = $('#web'); $('#webf').src = u; w._u = u; w.hidden = false; document.body.classList.add('noscroll'); }
function closeWeb() { const w = $('#web'); w.hidden = true; $('#webf').src = 'about:blank'; document.body.classList.toggle('noscroll', anyFull()); }
document.addEventListener('click', e => { const a = e.target.closest('[data-web]'); if (a) { e.preventDefault(); openWeb(a.dataset.web); return; } if (e.target.closest('#webBack')) closeWeb(); else if (e.target.closest('#webOut')) { const u = $('#web')._u; try { window.open(u, '_blank', 'noopener'); } catch (x) { location.href = u; } } });
function brandHtmlOld() {
  const u = st.ui, L = { ur: { tag: 'علم جو سوچ بدل دے', c: 'ہم سے رابطہ', e: 'ای میل', w: 'واٹس ایپ', cr: 'رابطہ اور ماخذ', by: 'فہم — قرآنک سائنس کی طرف سے مفت', nm: 'قرآنک سائنس', fb: 'فیس بک', ig: 'انسٹاگرام', yt: 'یوٹیوب', web: 'ویب سائٹ', sup: 'سپورٹ کریں', ds: 'نماز کے اوقات کے لیے', dn: 'دین ساتھی ایپ', dd: 'ڈاؤن لوڈ کریں' }, ru: { tag: 'Ilm Jo Soch Badal De', c: 'Rabta', e: 'Email', w: 'WhatsApp', cr: 'Rabta aur mukhaiz', by: 'Fahm — Quranic Science ki taraf se muft', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', sup: 'Support karein', ds: 'Namaz ke auqaat ke liye', dn: 'Deen Saathi app', dd: 'Download karein' }, en: { tag: 'Ilm Jo Soch Badal De', c: 'Contact', e: 'Email', w: 'WhatsApp', cr: 'Contact & credits', by: 'Fahm — free from Quranic Science', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', sup: 'Support us', ds: 'For prayer times', dn: 'Deen Saathi app', dd: 'Download' } }[u] || {};
  const ic = {
    fb: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" style="fill:currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l5-2.8z" style="fill:currentColor"/></svg>',
    web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z"/><path d="M9 8.5c0 3 3.5 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5z" style="fill:currentColor"/></svg>',
    bmail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>'
  };
  const a = (k, t, h) => `<a class="bl ${k}" href="${h}" target="_blank" rel="noopener" aria-label="${t}" title="${t}">${ic[k]}</a>`;
  const dsCard = `<a class="dsaa" href="https://quranicscience.info/deen-saathi/" target="_blank" rel="noopener"><span class="dsi">🕌</span><span class="dst"><small>${L.ds}</small><b>${L.dn}</b></span><span class="dsb">⬇ ${L.dd}</span></a>`;
  return dsCard + `<div class="brand"><div class="bn"><b>${L.nm}</b><em>${L.tag}</em></div>` +
    `<div class="brow">${a('fb', L.fb, BRAND.fb)}${a('ig', L.ig, BRAND.ig)}${a('yt', L.yt, BRAND.yt)}${a('web', L.web, BRAND.web)}${a('wa', L.w, BRAND.wa)}<a class="bl bmail" href="mailto:${BRAND.mail}" aria-label="${L.e}" title="${L.e}">${ic.bmail}</a></div>` +
    `<button class="bsup" data-bsup="1">❤ ${L.sup}</button>` +
    `<details class="bcr"><summary>${L.cr}</summary><div class="bct"><a href="mailto:${BRAND.mail}">✉ ${BRAND.mail}</a><a href="${BRAND.wa}" target="_blank" rel="noopener">${L.w} ${BRAND.ph}</a><a href="${BRAND.web}" target="_blank" rel="noopener">🌐 ${BRAND.web.replace('https://', '')}</a></div><p>${esc(T('credits'))}</p><p class="bby">${L.by}</p></details></div>`;
}
document.addEventListener('click', e => { if (e.target.closest('[data-bsup]')) openSupport(); });

/* ---------- optional real-footage clip per ayah (video/manifest.json) ---------- */
function videoFor(key) {
  const v = $('#sv'), box = $('.story-box'), f = VID[key];
  if (!f) { box.classList.remove('hasv'); try { v.pause(); } catch (e) { } v.removeAttribute('src'); v.load(); return; }
  box.classList.add('hasv'); v.muted = true; v.loop = true; v.playsInline = true; v.src = (location.hostname === 'appassets.androidplatform.net' ? 'https://quranicscience.info/fahm/video/' : 'video/') + f; v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => { });
}
/* ---------- navigation ---------- */
function navUi() {
  const S = D.surahs[st.s]; $('#pickTxt').textContent = `${T('ayah')} \u2066${S.ayat[st.a].v} / ${S.ayat.length}\u2069`;
  $('#lPrev').textContent = T('prevL'); $('#lNext').textContent = T('nextL');
  $('#bPrev').disabled = atStart(); $('#bNext').disabled = atEnd();
}
function openStage(i) { stopAll(); FahmWS.open(i == null ? -1 : i); }
function openPick() {
  const S = D.surahs[st.s]; $('#pickT').textContent = `${sName(S)[0]} — ${T('pick')}`;
  $('#pickGrid').innerHTML = S.ayat.map((A, i) => `<button class="pk ${i === st.a ? 'on' : ''}" data-pa="${i}">${A.v}</button>`).join('');
  $('#pick').hidden = false; const on = $('#pickGrid .on'); if (on) on.scrollIntoView({ block: 'center' });
}
function anyFull() { return $('#stage').classList.contains('big') || $('#story').classList.contains('big'); }
function setFull(id, on) {
  const el = $(id); el.classList.toggle('big', on); document.body.classList.toggle('noscroll', anyFull());
  setTimeout(() => { if (window.FahmLab) FahmLab.resize(); scene.resize(); }, 40);
}
/* Build 32: "came from" stack — closing a screen opened from another screen (search -> reader, etc.) returns to that screen */
window.FahmNav = window.FahmNav || { st: [], push(fn) { this.st.push(fn); if (this.st.length > 12) this.st.shift(); }, clear() { this.st = []; } };
window.FahmOverlays = window.FahmOverlays || [];
function navPop() { const fn = window.FahmNav.st.pop(); if (fn) { try { fn(); } catch (e) { } } }
/* returns true when the app used the back press itself */
window.__fahmBack = function () {
  if (window.__fahmOnbOpen && window.__fahmOnbOpen()) return window.__fahmOnbBack ? window.__fahmOnbBack() : false;
  if (!$('#web').hidden) { closeWeb(); return true; }
  const sup = document.getElementById('sup'); if (sup && !sup.hidden) { sup.hidden = true; return true; }
  const mk = document.getElementById('mkh'); if (mk && !mk.hidden) { mk.hidden = true; return true; }
  if (window.FahmWS && FahmWS.isOpen()) { FahmWS.close(); return true; }
  { const ovs = window.FahmOverlays || []; for (let i = ovs.length - 1; i >= 0; i--) { try { if (ovs[i].isOpen()) { ovs[i].close(); return true; } } catch (e) { } } }
  if (FahmReader.isOpen()) { FahmReader.back(); if (!FahmReader.isOpen()) navPop(); return true; }
  { const sr = document.getElementById('sr'); if (sr && !sr.hidden) { sr.hidden = true; navPop(); return true; } }
  for (const id of ['#pick', '#settings', '#menu']) if (!$(id).hidden) { $(id).hidden = true; return true; }
  if ($('#stage').classList.contains('big')) { setFull('#stage', false); return true; }
  if ($('#story').classList.contains('big')) { setFull('#story', false); return true; }
  if (hist.length) { const [s, a] = hist.pop(); goTo(s, a, 0, false, true); return true; }
  const now = Date.now(); if (now - exitAt < 2500) return false; exitAt = now; toast(T('exit'), 2300); return true;
};

/* ---------- reading mode: mushaf pages live in reader.js ---------- */
const AD = '٠١٢٣٤٥٦٧٨٩', ad = n => String(n).replace(/\d/g, d => AD[d]);
function openReader() { stopAll(); const S = D.surahs[st.s]; FahmReader.open(S.n, S.ayat[st.a].v); }
function closeReader() { FahmReader.back(); }

function reloadTr() { if (st.tl.includes('rur') || ctxFam() === 'ru' || ctxFam() === 'hi') FahmConv.load(); return FahmData.tr(st.s, codesNeeded()).then(() => { renderTrans(); renderNZ(); }); }
let goTok = 0;
async function goTo(s, a, w = 0, play = false, noHist = false) {
  const tok = ++goTok; stopAll();
  if (!D.surahs[s].loaded) { $('#words').innerHTML = `<div class="ld">${esc(XT('loading'))}</div>`; }
  try { await ensureS(s); } catch (e) { return; }
  if (tok !== goTok) return;
  if (a === -1 || a >= D.surahs[s].ayat.length) a = D.surahs[s].ayat.length - 1;
  if (!noHist && (s !== st.s || a !== st.a)) { hist.push([st.s, st.a]); if (hist.length > 60) hist.shift(); }
  st.s = s; st.a = a; st.w = w; renderAyah(false); $('#main').scrollTo({ top: 0, behavior: 'smooth' }); if (play) playAyah();
  if (D.surahs[s + 1] && !D.surahs[s + 1].loaded && a > D.surahs[s].ayat.length - 4) FahmData.load(s + 1, codesNeeded()).catch(() => { });
}
function next(play) {
  const S = D.surahs[st.s];
  if (st.a < S.ayat.length - 1) return goTo(st.s, st.a + 1, 0, play);
  if (st.s < D.surahs.length - 1) return goTo(st.s + 1, 0, 0, play);
  setPlaying(false);
}
function atStart() { return st.s === 0 && st.a === 0; }
function atEnd() { return st.s === D.surahs.length - 1 && st.a === D.surahs[st.s].ayat.length - 1; }
function prev() { if (st.a > 0) goTo(st.s, st.a - 1); else if (st.s > 0) goTo(st.s - 1, -1); }

/* ---------- audio ---------- */
function setPlaying(p) { playing = p; if (window.FahmWS) FahmWS.updPlay(); $('#icoPlay').style.display = p ? 'none' : ''; $('#icoPause').style.display = p ? '' : 'none'; $('#sPlay').innerHTML = p ? '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" style="fill:currentColor;stroke:none"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" style="fill:currentColor;stroke:none"/></svg>'; }
function stopAll() { FahmSfx.stop(); try { $('#sv').pause(); } catch (e) { } clearInterval(timer); timer = null; try { au.pause(); } catch (e) { } if (wordAu) { try { wordAu.pause(); } catch (e) { } } try { speechSynthesis.cancel(); } catch (e) { } setPlaying(false); }
function computeBounds() {
  const { A } = cur(); if (window.FahmTiming) { bounds = FahmTiming.bounds(A.words); return; }
  const wts = A.words.map(w => stripD(w.ar).length + 1.2), tot = wts.reduce((x, y) => x + y, 0); bounds = []; let acc = 0;
  wts.forEach(x => { acc += x / tot; bounds.push(acc); });
}
function idxAt(frac) { for (let i = 0; i < bounds.length; i++) if (frac <= bounds[i]) return i; return bounds.length - 1; }
function ayahUrl() { const { S, A } = cur(); if (window.FahmWT) { FahmWT.load(st.rec, S.n); return FahmWT.url(st.rec, S.n, A.v); } return `https://everyayah.com/data/${st.rec}/${pad(S.n)}${pad(A.v)}.mp3`; }
/* Build 32: real word timings when the qari has them (16 qaris), otherwise the old estimate */
function wtIdx() { if (!window.FahmWT) return -1; const { S, A } = cur(), t = FahmWT.get(st.rec, S.n, A.v); if (!Array.isArray(t) || t.length < 2) return -1; const ms = au.currentTime * 1000 + 30, n = t.length - 1; let k = 0; for (let i = 0; i < n; i++) if (t[i] <= ms) k = i; return Math.min(A.words.length - 1, n === A.words.length ? k : Math.floor(k * A.words.length / n)); }
function playAyah() {
  stopAll(); FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); setPlaying(true); { const v = $('#sv'); if (v.getAttribute('src')) { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => { }); } } scene.set(scene.spec); setWord(0, true, true); if (st.sfx) FahmSfx.start(scene.spec.sky);
  const { A } = cur(); let failed = false;
  const fallback = () => {
    if (failed) return; failed = true; clearInterval(timer); toast(T('audioErr')); const per = 1100; let i = 0; setWord(0, true, true);
    timer = setInterval(() => { i++; if (i >= A.words.length) { clearInterval(timer); timer = null; onEnded(); } else setWord(i, true, true); }, per);
  };
  au.onerror = fallback; au.onended = onEnded;
  const sync = () => { if (!au.duration || failed || au.paused) return; { const k = wtIdx(); if (k >= 0) { if (k !== st.w) setWord(k, true, true); return; } } const lead = Math.min(0.18, au.duration * 0.04), tail = Math.min(0.3, au.duration * 0.05), f = Math.max(0, Math.min(1, (au.currentTime - lead) / Math.max(0.1, au.duration - lead - tail))); const i = idxAt(f); if (i !== st.w) setWord(i, true, true); };
  au.ontimeupdate = sync; clearInterval(timer); timer = setInterval(sync, 50);
  au.src = ayahUrl(); const pr = au.play(); if (pr && pr.catch) pr.catch(() => fallback());
}
function onEnded() {
  scene.all(); const wsOn = window.FahmWS && FahmWS.isOpen(); if (wsOn) FahmWS.set(cur().A.words.length);
  const go = () => { if (!playing) return; if (st.auto) setTimeout(() => { if (playing) next(true); }, wsOn ? 2200 : 500); else { setPlaying(false); FahmSfx.stop(); } };
  if (st.trw) { FahmSfx.stop(); speakTrList(go); } else go();
}
function playWord() {
  const { W } = cur(); stopAll(); if (wordAu) wordAu.pause();
  wordAu = new Audio('https://audio.qurancdn.com/wbw/' + W.au); wordAu.onerror = () => toast(T('audioErr')); const pr = wordAu.play(); if (pr && pr.catch) pr.catch(() => toast(T('audioErr')));
}
function ttsOf(c, A) { return c === 'rur' ? { text: A.tr.ur, lang: 'ur-PK' } : { text: A.tr[c], lang: (D.langs.find(l => l.c === c) || {}).tts || 'en-US' }; }
function pickVoice(lang) { try { const vs = speechSynthesis.getVoices(), p = lang.slice(0, 2); return vs.find(v => v.lang === lang) || vs.find(v => v.lang.slice(0, 2) === p) || (p === 'ur' ? vs.find(v => v.lang.slice(0, 2) === 'hi') : null) || null; } catch (e) { return null; } }
/* translation voice: real recorded human audio where it exists (EveryAyah, ayah by ayah), phone TTS otherwise */
const TRA = { ur: 'translations/urdu_shamshad_ali_khan_46kbps', rur: 'translations/urdu_shamshad_ali_khan_46kbps', en: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps', fa: 'translations/Makarem_Kabiri_16Kbps', bs: 'translations/besim_korkut_ajet_po_ajet' };
function trAudioUrl(c, S, A) { return TRA[c] ? `https://everyayah.com/data/${TRA[c]}/${pad(S.n)}${pad(A.v)}.mp3` : null; }
function speakTrList(done, test) {
  const { S, A } = cur(); let list = st.tl.filter(c => A.tr[c]);
  const seen = {}; list = list.filter(c => { const k = TRA[c] || c; if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 2);
  if (!list.length) { if (done) done(); return; }
  let i = 0; try { speechSynthesis.cancel(); } catch (e) { }
  const tts = (c) => {
    if (!('speechSynthesis' in window)) { toast(T('noVoice')); return nxt(); }
    const o = ttsOf(c, A); try { const u = new SpeechSynthesisUtterance(o.text); u.lang = o.lang; const v = pickVoice(o.lang); if (v) u.voice = v; else if (!speechSynthesis.getVoices().length) toast(T('noVoice')); u.rate = .95; u.onend = nxt; u.onerror = nxt; speechSynthesis.speak(u); } catch (e) { toast(T('noVoice')); nxt(); }
  };
  function nxt() {
    if (!playing && !test) return; if (i >= list.length || (test && i >= 1)) { au.ontimeupdate = null; if (done) done(); return; }
    const c = list[i++], url = trAudioUrl(c, S, A);
    if (!url) return tts(c);
    au.ontimeupdate = null; au.onended = nxt; au.onerror = () => tts(c); au.src = url; const pr = au.play(); if (pr && pr.catch) pr.catch(() => tts(c));
  }
  nxt();
}
function speakTr(c) {
  const { A } = cur(), L = D.langs.find(l => l.c === c); stopAll();
  try { const u = new SpeechSynthesisUtterance(A.tr[c]); u.lang = L.tts; u.rate = 0.95; speechSynthesis.speak(u); } catch (e) { toast(T('noVoice')); }
}

/* ---------- sheets ---------- */
let menuTab = 'surah';
const num = n => st.ui === 'ur' ? ad(n) : String(n);
function openMenu(tab) {
  if (typeof tab === 'string') menuTab = tab;
  $('#menuT').textContent = T('surahs');
  let html = `<div class="mtabs"><button data-mt="surah" class="${menuTab === 'surah' ? 'on' : ''}">${esc(XT('surahTab'))}</button><button data-mt="juz" class="${menuTab === 'juz' ? 'on' : ''}">${esc(XT('juzTab'))}</button></div>`;
  const place = p => p === 'madinah' ? XT('madani') : XT('makki');
  if (menuTab === 'surah') {
    D.surahs.forEach((s, si) => { const nm = sName(s); html += `<button class="srow ${si === st.s ? 'on' : ''}" data-s="${si}"><span class="n">${num(s.n)}</span><span class="t">${esc(nm[0])}<small>${esc(nm[1])} · ${num(s.count)} ${T('ayah')} · ${esc(place(s.place))}</small></span><span class="jz">${esc(XT('para'))} ${num(FahmData.juzOf(s.n, 1))}</span></button>`; });
  } else {
    FahmData.juz.forEach(([j, sn, an], k) => { const s = D.surahs[sn - 1], nm = sName(s); const nxt = FahmData.juz[k + 1]; const last = nxt ? (nxt[2] === 1 ? D.surahs[nxt[1] - 2] : D.surahs[nxt[1] - 1]) : D.surahs[113]; html += `<button class="srow juz" data-j="${sn},${an}"><span class="n">${num(j)}</span><span class="t">${esc(XT('para'))} ${num(j)}<small>${esc(nm[0])} ${num(sn)}:${num(an)} → ${esc(sName(last)[0])}</small></span></button>`; });
  }
  $('#menuList').innerHTML = html;
  $('#menu').hidden = false;
  const on = $('#menuList .srow.on'); if (on) on.scrollIntoView({ block: 'center' });
}
function openSettings() {
  $('#setT').textContent = T('settings');
  const seg = (items, cur, key) => `<div class="seg">${items.map(([v, l]) => `<button data-k="${key}" data-v="${v}" class="${cur === v ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  $('#setBody').innerHTML =
    `<div class="set-g"><button class="gd-open" data-guide="1">🧭 ${({ ur: 'گائیڈ — ایپ کیسے چلائیں', ru: 'Guide — app kaise chalayein', en: 'Guide — how to use the app' })[st.ui] || 'Guide'}</button><button class="gd-open" data-updchk="1" style="margin-top:8px">⬇ ${window.FahmUpdate ? FahmUpdate.label() : 'Update'}</button></div>` +
    `<div class="set-g"><h5>${T('ui')}</h5>${seg(I.ui, st.ui, 'ui')}</div>` +
    `<div class="set-g"><h5>${T('theme')}</h5>${seg([['dark', T('dark')], ['light', T('light')]], st.theme, 'theme')}</div>` +
    `<div class="set-g"><h5>${T('sfx')}</h5>${seg([['0', T('sfxOff')], ['1', T('sfxLow')], ['2', T('sfxMid')]], String(st.sfx), 'sfx')}</div>` +
    `<div class="set-g"><label class="chk"><input type="checkbox" id="autoNext" ${st.auto ? 'checked' : ''}><span>${esc(T('autoOpt'))}</span></label><label class="chk"><input type="checkbox" id="trVoice" ${st.trw ? 'checked' : ''}><span>${esc(T('trVoice'))}</span></label><label class="chk"><input type="checkbox" id="hzTr" ${st.hzTr ? 'checked' : ''}><span>${esc(XT('hzTr'))}</span></label></div>` +
    `<div class="set-g"><h5>${T('maslak')}</h5>${seg(MASLAK.map(([k, c]) => [c, T('mk')[k]]), (MASLAK.find(([k, c]) => st.tl.includes(c)) || [0, ''])[1], 'maslak')}</div>` +
    `<div class="set-g"><h5>${T('tr')}</h5>${D.langs.filter(l => l.c !== 'ar').map(l => `<label class="chk"><input type="checkbox" data-tl="${l.c}" ${st.tl.includes(l.c) ? 'checked' : ''}><span>${esc(lName(l.c))}<small>${esc(tName(l.c))}</small></span></label>`).join('')}</div>` +
    `<div class="set-g"><h5>${T('rec')}</h5><select id="recSel" class="sel">${['h','w'].map(g => `<optgroup label="${g === 'h' ? 'Hafs ‘an ‘Asim' : 'Warsh ‘an Nafi‘'}">${RECS.filter(r => r[3] === g).map(r => `<option value="${esc(r[0])}" ${st.rec === r[0] ? 'selected' : ''}>${esc(rName(r[0]))}</option>`).join('')}</optgroup>`).join('')}${RECS.some(r => r[0] === st.rec) ? '' : `<option value="${esc(st.rec)}" selected>${esc(st.rec)}</option>`}</select><input id="recCus" class="sel" dir="ltr" placeholder="${esc(T('recCus'))}" value=""></div>`;
  $('#settings').hidden = false;
}

/* ---------- events ---------- */
function bind() {
  $('#btnMenu').onclick = openMenu; $('#btnSet').onclick = openSettings;
  $('#btnLang').onclick = () => { const o = ['ur', 'ru', 'en'], n = o[(o.indexOf(st.ui) + 1) % 3]; setPref('ui', n); };
  $('#btnTheme').onclick = () => setPref('theme', st.theme === 'light' ? 'dark' : 'light');
  $('#bPrev').onclick = prev; $('#bNext').onclick = () => next(false);
  $('#bPlay').onclick = () => { if (playing) { stopAll(); } else playAyah(); };
  $('#btnReplay').onclick = () => playAyah();
  $('#bPick').onclick = openPick; $('#btnRead').onclick = openReader;
  $('#bMushaf').onclick = () => { stopAll(); const l = st.rlast || { s: 1, a: 1 }; FahmReader.open(l.s, l.a); };
  $('#btnFullS').onclick = () => setFull('#story', true); $('#sClose').onclick = () => setFull('#story', false);
  $('#sPrev').onclick = prev; $('#sNext').onclick = () => next(false); $('#sPlay').onclick = () => { if (playing) stopAll(); else playAyah(); };
  document.addEventListener('click', e => {
    if (e.target.id === 'autoNext') { st.auto = e.target.checked; save(); return; }
    if (e.target.id === 'trVoice') { st.trw = e.target.checked; save(); if (st.trw) speakTrList(null, true); return; }
    if (e.target.id === 'hzTr') { st.hzTr = e.target.checked; save(); return; }
    const pa = e.target.closest('[data-pa]'); if (pa) { $('#pick').hidden = true; goTo(st.s, +pa.dataset.pa); return; }
    const t = e.target.closest('button,label,input,aside'); if (!t) return;
    if (t.classList && t.classList.contains('sheet') && e.target === t) { t.hidden = true; return; }
    const w = e.target.closest('.w'); if (w && w.dataset.i != null) { setWord(+w.dataset.i); return; }
    const g = e.target.closest('[data-go]'); if (g) { const [s, a, ww] = g.dataset.go.split(',').map(Number); goTo(s, a, ww); return; }
    const sp = e.target.closest('#spkW'); if (sp) { playWord(); return; }
    const tt = e.target.closest('[data-tts]'); if (tt) { speakTr(tt.dataset.tts); return; }
    const mt = e.target.closest('[data-mt]'); if (mt) { openMenu(mt.dataset.mt); return; }
    const jr = e.target.closest('[data-j]'); if (jr) { const [sn, an] = jr.dataset.j.split(',').map(Number); $('#menu').hidden = true; stopAll(); if (FahmReader.isOpen()) FahmReader.open(sn, an); else goTo(sn - 1, an - 1); return; }
    const sr = e.target.closest('[data-s]'); if (sr) { $('#menu').hidden = true; if (FahmReader.isOpen()) FahmReader.gotoSurah(D.surahs[+sr.dataset.s].n); else goTo(+sr.dataset.s, 0); return; }
    const mo = e.target.closest('[data-more]'); if (mo) { const ib = $('#introBox'); const open = ib.classList.toggle('open'); mo.textContent = open ? XT('less') : XT('more'); return; }
    if (e.target.closest('[data-taf]')) { loadTafsir(); return; }
    if (e.target.closest('[data-anim]')) { openStage(-1); return; }
    const kv = e.target.closest('[data-k]'); if (kv && kv.dataset.k === 'maslak') { st.tl = st.tl.filter(x => !URD.includes(x)); st.tl.push(kv.dataset.v); st.tl.sort((x, y) => D.langs.findIndex(l => l.c === x) - D.langs.findIndex(l => l.c === y)); save(); reloadTr(); openSettings(); return; }
    if (kv) { setPref(kv.dataset.k, kv.dataset.v); openSettings(); return; }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'recSel') { st.rec = e.target.value; save(); return; }
    if (e.target.id === 'recCus') { const v = e.target.value.trim().replace(/^https?:\/\/everyayah\.com\/data\//, '').replace(/\/+$/, ''); if (v) { st.rec = v; save(); toast(v); } return; }
    const c = e.target.closest('[data-tl]'); if (!c) return;
    const code = c.dataset.tl; st.tl = st.tl.filter(x => x !== code); if (c.checked) st.tl.push(code); st.tl.sort((a, b) => D.langs.findIndex(l => l.c === a) - D.langs.findIndex(l => l.c === b)); save(); reloadTr();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { window.__fahmBack(); return; } if (e.key === 'ArrowRight') next(false); else if (e.key === 'ArrowLeft') prev(); else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); $('#bPlay').click(); } });
  let x0 = null; const stg = $('#story');
  stg.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  stg.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60) { dx < 0 ? next(false) : prev(); } }, { passive: true });
  const fit = () => { scene.resize(); if (window.FahmLab) FahmLab.resize(); };
  let ft = null; const fitSoon = () => { fit(); clearTimeout(ft); ft = setTimeout(fit, 250); };
  window.addEventListener('resize', fitSoon); window.addEventListener('orientationchange', () => { fitSoon(); setTimeout(fit, 600); });
  if (window.ResizeObserver) { const ro = new ResizeObserver(() => fit()); ro.observe($('#story')); ro.observe($('#stage')); }
  if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener('change', fitSoon);
  $('#btnLabR').onclick = e => { e.stopPropagation(); FahmWS.miniSet(st.w); };
  $('#btnFull').onclick = e => { e.stopPropagation(); openStage(st.w); };
  $('#stage').addEventListener('click', e => { if (!e.target.closest('button')) openStage(st.w); });
  window.addEventListener('visibilitychange', () => { if (document.hidden) scene.stop(); else scene.start(); });
}
function setPref(k, v) {
  st[k] = k === 'sfx' ? +v : v;
  if (k === 'sfx') { FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); if (st.sfx && playing) FahmSfx.start((scene.spec || {}).sky); }
  if (k === 'ui') { st.tl = DEF_TL[st.ui].slice(); if (st.ui === 'ru') FahmConv.load(); }
  save(); applyUi(); FahmData.tr(st.s, codesNeeded()).then(() => renderAyah(true));
}
function setMaslak(c) { st.tl = st.tl.filter(x => !URD.includes(x)); st.tl.push(c); st.tl.sort((x, y) => D.langs.findIndex(l => l.c === x) - D.langs.findIndex(l => l.c === y)); save(); reloadTr(); }
function applyUi() { { const bl = $('#btnLang'); if (bl) { bl.innerHTML = '<span>' + { ur: 'اردو', ru: 'Ru', en: 'En' }[st.ui] + '</span>'; bl.title = 'Language'; } const bt = $('#btnTheme'); if (bt) bt.innerHTML = st.theme === 'light' ? '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>' : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>'; } document.documentElement.lang = st.ui === 'en' ? 'en' : 'ur'; document.body.className = 'l-' + st.ui + (st.theme === 'light' ? ' light' : ''); const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = st.theme === 'light' ? '#f6f1e4' : '#05070e'; if (D) navUi(); $('#btnFullS').title = T('full'); $('#btnRead').title = T('reader'); if (window.FahmLab) FahmLab.lang = st.ui; $('#btnFull').title = T('full'); $('#btnReplay').title = T('replay'); $('#btnLabR').title = T('replay'); $('#bMushaf').innerHTML = '<b>' + ({ ur: 'پورا قرآن پڑھیں', ru: 'Poora Quran padhein', en: 'Read the whole Quran' }[st.ui] || '') + '</b><small>' + ({ ur: '۳ مصحف لے آؤٹ · حافظ موڈ · ہر آیت کے ساتھ آڈیو', ru: '3 mushaf layout · Hafiz mode · har ayat ki audio', en: '3 mushaf layouts · Hafiz mode · audio for every ayah' }[st.ui] || '') + '</small>'; }

/* ---------- install hint ---------- */
let deferred = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; const b = $('#install'); b.innerHTML = `<span style="flex:1">${T('installBar')}</span><button id="doInstall">${T('install')}</button>`; b.hidden = false; $('#doInstall').onclick = async () => { b.hidden = true; deferred.prompt(); }; });
function iosHint() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone;
  if (ios && !st.ios) { const b = $('#install'); b.innerHTML = `<span style="flex:1">${T('iosTip')}</span><button id="okI">${T('close')}</button>`; b.hidden = false; $('#okI').onclick = () => { b.hidden = true; st.ios = 1; save(); }; }
}

async function init() {
  window.FahmSfx = window.FahmSfx || { unlock() { }, setLevel() { }, cue() { }, start() { }, stop() { } };
  scene = (window.FahmStory && FahmStory.ok()) ? new FahmStory($('#cv')) : new FahmScene($('#cv')); if (window.FahmLab) FahmLab.lang = st.ui, FahmLab.init($('#stage'));
  D = await FahmData.init();
  if (!st.v2) { st.v2 = 1; st.s = 0; st.a = 0; st.w = 0; save(); }   /* surah index now covers all 114 surahs */
  if (st.hzTr === undefined) st.hzTr = true;
  if (st.s >= D.surahs.length) st.s = 0;
  if (st.ui === 'ru' || ctxFam() === 'ru' || ctxFam() === 'hi') FahmConv.load();
  try { await ensureS(st.s); } catch (e) { }
  if (st.a >= D.surahs[st.s].ayat.length) st.a = 0;
  FahmSfx.setLevel(st.sfx); scene.onBorn = it => { if (playing && st.sfx) FahmSfx.cue(it.a); };
  FahmReader.init({ D: () => D, st: () => st, save, toast, openMenu, onClose: () => { document.body.classList.toggle('noscroll', anyFull()); const l = st.rcur; if (l && D && D.surahs[l.s - 1] && (l.s - 1 !== st.s || l.a - 1 !== st.a)) goTo(l.s - 1, l.a - 1, 0, false, true); } });
  FahmWS.init({
    st: () => st, cur, wordMeaning, lemKey, strip: stripD, sName,
    pickWord: i => { stopAll(); setWord(i); try { playWord(); } catch (e) { } FahmWS.set(i); },
    togglePlay: () => { if (playing) { stopAll(); FahmWS.updPlay(); } else { playAyah(); FahmWS.updPlay(); } },
    playAyah: () => { playAyah(); FahmWS.updPlay(); }, stopAudio: stopAll, isPlaying: () => playing,
    nextAyah: () => { next(false); }, prevAyah: () => { prev(); }, onClose: () => { stopAll(); }
  });
  FahmWS.miniInit($('#wsMini'));
  applyUi(); bind(); renderAyah(false); scene.start(); iosHint();
  try { history.replaceState({ b: 1 }, ''); history.pushState({ a: 1 }, ''); window.addEventListener('popstate', () => { if (window.__fahmBack()) history.pushState({ a: 1 }, ''); }); } catch (e) { }
  window.__fahm = { scene, st, goTo, D, lemKey };
  window.__fahmApp = { st: () => st, save, setPref, setMaslak, T, MASLAK, URD, stopAll, toast };
  window.dispatchEvent(new Event('fahm-ready'));
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
}
init();
})();

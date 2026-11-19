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
const sName = S => (I.surah[S.n] || {})[st.ui] || [S.en, S.mean];
const lName = c => I.lang[st.ui][c] || c;
const tName = c => I.translator[st.ui][c] || '';
const RECS = window.FAHM_RECS || [];
const rName = r => { const e = RECS.find(x => x[0] === r); return e ? (st.ui === 'ur' ? e[2] : e[1]) : ((I.reciter[r] || {})[st.ui] || r); };
const pick = o => o ? (st.ui === 'ur' ? o.ur : st.ui === 'ru' ? o.ru : o.en) : '';
let VID = {}, D, scene, rootIdx = {}, playing = false, timer = null, bounds = [], hist = [], exitAt = 0;
const au = new Audio(); au.preload = 'auto';
let wordAu = null;

function stripD(s) { return s.replace(/[ً-ٰٟۖ-ۭ࣓-ࣿ‏]/g, ''); }
function cur() { const S = D.surahs[st.s]; return { S, A: S.ayat[st.a], W: S.ayat[st.a].words[st.w] }; }
function toast(m, ms = 2800) { const e = $('#toast'); e.textContent = m; e.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => e.hidden = true, ms); }

function lemKey(s) { return stripD(s).replace(/ٱ/g, 'ا').replace(/ـ/g, ''); }
function wordMeaning(w) { return st.ui === 'ur' ? [w.ur, 'u'] : st.ui === 'ru' ? [w.ru, ''] : [w.en, '']; }
function capOf(spec, key) { return st.ui === 'ur' ? (window.FAHM_CX_UR[key] || '') : st.ui === 'ru' ? spec.cx.ur : spec.cx.en; }

function renderAyah(keepPlay) {
  const { S, A } = cur(); if (st.w >= A.words.length) st.w = 0;
  const sn = sName(S); $('#tAr').textContent = sn[0]; $('#tSub').textContent = sn[1];
  $('#ayahNo').textContent = `${T('ayah')} \u2066${A.v} / ${S.ayat.length}\u2069`; $('#storyH').textContent = T('story');
  $('#words').innerHTML = A.words.map((w, i) => { const [m, c] = wordMeaning(w); return `<button class="w" data-i="${i}"><span class="a ar">${esc(w.ar)}</span><span class="m ${c}">${esc(m)}</span></button>`; }).join('');
  const spec = window.FAHM_SCENES[`${S.n}:${A.v}`] || { sky: 'night', items: [], cx: { ur: '', en: '' } };
  videoFor(`${S.n}:${A.v}`);
  scene.set(spec); scene.all(); $('#cx').textContent = capOf(spec, `${S.n}:${A.v}`) || '';
  renderTrans(); renderNZ(); setWord(st.w, false, true); computeBounds(); save(); navUi();
  if (!keepPlay) stopAll();
}

function setWord(i, fromAudio, silent) {
  st.w = i; scene.show(i);
  document.querySelectorAll('#words .w').forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('seen', k < i); });
  renderWordCard(); showLab();
  if (!fromAudio && !silent) save();
}

function renderWordCard() {
  const { W, S, A } = cur(), [m, c] = wordMeaning(W);
  const roots = W.root ? [...W.root] : [];
  const rootHtml = roots.length ? `<div class="root"><span class="lbl">${T('root')}</span>${roots.map((l, k) => `<span class="lt" style="animation-delay:${k * 0.12}s">${l}</span>${k < roots.length - 1 ? '<span class="sep">–</span>' : ''}`).join('')}</div>` : '';
  let same = '';
  if (W.root && rootIdx[W.root]) {
    const seen = new Set([stripD(W.ar)]), items = [];
    for (const r of rootIdx[W.root]) { const w = D.surahs[r.s].ayat[r.a].words[r.w], k = stripD(w.ar); if (seen.has(k)) continue; seen.add(k); items.push(r); if (items.length >= 8) break; }
    if (items.length) same = `<div class="hint">${T('same')}</div><div class="same">${items.map(r => { const w = D.surahs[r.s].ayat[r.a].words[r.w], [mm] = wordMeaning(w); return `<button data-go="${r.s},${r.a},${r.w}"><b class="ar">${esc(w.ar)}</b>${esc(mm)}</button>`; }).join('')}</div>`;
  }
  $('#wordcard').innerHTML = `<div class="wc-top"><div class="wc-ar ar">${esc(W.ar)}</div><div class="wc-info">${st.ui === 'ur' ? '' : `<div class="wc-tl">${esc(W.tl)}</div>`}<div class="wc-m ${c}">${esc(m)}</div></div><button class="spk" id="spkW" aria-label="${T('listen')}"><svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" style="stroke:currentColor;stroke-width:2;fill:none"/></svg></button></div>${rootHtml}${same}`;
}

function renderTrans() {
  const { S, A } = cur();
  $('#trans').innerHTML = st.tl.filter(c => A.tr[c]).map(c => {
    const L = D.langs.find(l => l.c === c), cls = (URD.includes(c) && c !== 'rur' ? 'u' : c === 'hi' ? 'h' : '') + ((RTL[c] || (URD.includes(c) && c !== 'rur')) ? ' rtl' : '');
    return `<div class="tr"><div class="lh"><span>${esc(lName(c))} · ${esc(tName(c))}</span><button class="sp" data-tts="${c}" aria-label="Listen"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></div><p class="${cls}" ${(RTL[c] || (URD.includes(c) && c !== 'rur')) ? 'dir="rtl"' : ''}>${esc(A.tr[c])}</p></div>`;
  }).join('');
}

function renderNZ() {
  const { S } = cur(), n = window.FAHM_NZ[S.n]; if (!n) { $('#nz').innerHTML = ''; return; }
  $('#nz').innerHTML = `<h4>${T('nzh')}</h4><p>${esc(st.ui === 'en' ? n.en : st.ui === 'ur' ? (window.FAHM_NZ_UR[S.n] || '') : n.ur)}</p><small>${T('nzn')}</small>`;
  $('#credits').innerHTML = brandHtml();
}

/* ---------- 3D word scene ---------- */
function showLab() {
  const { S, A, W } = cur(), key = `${S.n}:${A.v}:${st.w}`, spec = (window.FAHM_LAB || {})[key] || (window.FAHM_LEM || {})[lemKey(W.ar)] || null, [m] = wordMeaning(W);
  $('#labTop').textContent = `${T('word')} ${st.w + 1} ${T('of')} ${A.words.length}`;
  $('#labM').textContent = m; $('#labM').className = st.ui === 'ur' ? 'u' : '';
  $('#labN').textContent = spec && spec.n ? pick(spec.n) : '';
  if (window.FahmLab && FahmLab.ok) FahmLab.show(spec, { key, ar: W.ar, root: W.root });
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
  const u = st.ui, L = { ur: { tag: 'علم جو سوچ بدل دے', c: 'ہم سے رابطہ', e: 'ای میل', w: 'واٹس ایپ', cr: 'رابطہ اور ماخذ', by: 'فہم — قرآنک سائنس کی طرف سے مفت', nm: 'قرآنک سائنس', fb: 'فیس بک', ig: 'انسٹاگرام', yt: 'یوٹیوب', web: 'ویب سائٹ', sup: 'سپورٹ کریں' }, ru: { tag: 'Ilm Jo Soch Badal De', c: 'Rabta', e: 'Email', w: 'WhatsApp', cr: 'Rabta aur mukhaiz', by: 'Fahm — Quranic Science ki taraf se muft', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', sup: 'Support karein' }, en: { tag: 'Ilm Jo Soch Badal De', c: 'Contact', e: 'Email', w: 'WhatsApp', cr: 'Contact & credits', by: 'Fahm — free from Quranic Science', nm: 'Quranic Science', fb: 'Facebook', ig: 'Instagram', yt: 'YouTube', web: 'Website', sup: 'Support us' } }[u] || {};
  const ic = {
    fb: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" style="fill:currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l5-2.8z" style="fill:currentColor"/></svg>',
    web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z"/><path d="M9 8.5c0 3 3.5 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5z" style="fill:currentColor"/></svg>',
    bmail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>'
  };
  const a = (k, t, h) => `<a class="bl ${k}" href="${h}" target="_blank" rel="noopener" aria-label="${t}" title="${t}">${ic[k]}</a>`;
  return `<div class="brand"><div class="bn"><b>${L.nm}</b><em>${L.tag}</em></div>` +
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
/* returns true when the app used the back press itself */
window.__fahmBack = function () {
  if (FahmReader.isOpen()) { FahmReader.back(); return true; }
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

function goTo(s, a, w = 0, play = false, noHist = false) { if (!noHist && (s !== st.s || a !== st.a)) { hist.push([st.s, st.a]); if (hist.length > 60) hist.shift(); } st.s = s; st.a = a; st.w = w; renderAyah(false); $('#main').scrollTo({ top: 0, behavior: 'smooth' }); if (play) playAyah(); }
function next(play) {
  const S = D.surahs[st.s];
  if (st.a < S.ayat.length - 1) return goTo(st.s, st.a + 1, 0, play);
  if (st.s < D.surahs.length - 1) return goTo(st.s + 1, 0, 0, play);
  setPlaying(false);
}
function atStart() { return st.s === 0 && st.a === 0; }
function atEnd() { return st.s === D.surahs.length - 1 && st.a === D.surahs[st.s].ayat.length - 1; }
function prev() { if (st.a > 0) goTo(st.s, st.a - 1); else if (st.s > 0) goTo(st.s - 1, D.surahs[st.s - 1].ayat.length - 1); }

/* ---------- audio ---------- */
function setPlaying(p) { playing = p; $('#icoPlay').style.display = p ? 'none' : ''; $('#icoPause').style.display = p ? '' : 'none'; $('#sPlay').innerHTML = p ? '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" style="fill:currentColor;stroke:none"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" style="fill:currentColor;stroke:none"/></svg>'; }
function stopAll() { FahmSfx.stop(); try { $('#sv').pause(); } catch (e) { } clearInterval(timer); timer = null; try { au.pause(); } catch (e) { } if (wordAu) { try { wordAu.pause(); } catch (e) { } } try { speechSynthesis.cancel(); } catch (e) { } setPlaying(false); }
function computeBounds() {
  const { A } = cur(), wts = A.words.map(w => stripD(w.ar).length + 1.2), tot = wts.reduce((x, y) => x + y, 0); bounds = []; let acc = 0;
  wts.forEach(x => { acc += x / tot; bounds.push(acc); });
}
function idxAt(frac) { for (let i = 0; i < bounds.length; i++) if (frac <= bounds[i]) return i; return bounds.length - 1; }
function ayahUrl() { const { S, A } = cur(); return `https://everyayah.com/data/${st.rec}/${pad(S.n)}${pad(A.v)}.mp3`; }
function playAyah() {
  stopAll(); FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); setPlaying(true); { const v = $('#sv'); if (v.getAttribute('src')) { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => { }); } } scene.set(scene.spec); setWord(0, true, true); if (st.sfx) FahmSfx.start(scene.spec.sky);
  const { A } = cur(); let failed = false;
  const fallback = () => {
    if (failed) return; failed = true; toast(T('audioErr')); const per = 1100; let i = 0; setWord(0, true, true);
    timer = setInterval(() => { i++; if (i >= A.words.length) { clearInterval(timer); timer = null; onEnded(); } else setWord(i, true, true); }, per);
  };
  au.onerror = fallback; au.onended = onEnded;
  au.ontimeupdate = () => { if (!au.duration || failed) return; const lead = Math.min(0.45, au.duration * 0.06), tail = Math.min(0.35, au.duration * 0.05), f = Math.max(0, Math.min(1, (au.currentTime - lead) / Math.max(0.1, au.duration - lead - tail))); const i = idxAt(f); if (i !== st.w) setWord(i, true, true); };
  au.src = ayahUrl(); const pr = au.play(); if (pr && pr.catch) pr.catch(() => fallback());
}
function onEnded() {
  scene.all(); const go = () => { if (!playing) return; if (st.auto) setTimeout(() => { if (playing) next(true); }, 500); else { setPlaying(false); FahmSfx.stop(); } };
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
function openMenu() {
  $('#menuT').textContent = T('surahs');
  $('#menuList').innerHTML = D.surahs.map((s, i) => `<button class="srow ${i === st.s ? 'on' : ''}" data-s="${i}"><span class="n">${s.n}</span><span class="t">${esc(sName(s)[0])}<small>${esc(sName(s)[1])} · ${s.ayat.length} ${T('ayah')}</small></span></button>`).join('');
  $('#menu').hidden = false;
}
function openSettings() {
  $('#setT').textContent = T('settings');
  const seg = (items, cur, key) => `<div class="seg">${items.map(([v, l]) => `<button data-k="${key}" data-v="${v}" class="${cur === v ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  $('#setBody').innerHTML =
    `<div class="set-g"><h5>${T('ui')}</h5>${seg(I.ui, st.ui, 'ui')}</div>` +
    `<div class="set-g"><h5>${T('theme')}</h5>${seg([['dark', T('dark')], ['light', T('light')]], st.theme, 'theme')}</div>` +
    `<div class="set-g"><h5>${T('sfx')}</h5>${seg([['0', T('sfxOff')], ['1', T('sfxLow')], ['2', T('sfxMid')]], String(st.sfx), 'sfx')}</div>` +
    `<div class="set-g"><label class="chk"><input type="checkbox" id="autoNext" ${st.auto ? 'checked' : ''}><span>${esc(T('autoOpt'))}</span></label><label class="chk"><input type="checkbox" id="trVoice" ${st.trw ? 'checked' : ''}><span>${esc(T('trVoice'))}</span></label></div>` +
    `<div class="set-g"><h5>${T('maslak')}</h5>${seg(MASLAK.map(([k, c]) => [c, T('mk')[k]]), (MASLAK.find(([k, c]) => st.tl.includes(c)) || [0, ''])[1], 'maslak')}</div>` +
    `<div class="set-g"><h5>${T('tr')}</h5>${D.langs.filter(l => l.c !== 'ar').map(l => `<label class="chk"><input type="checkbox" data-tl="${l.c}" ${st.tl.includes(l.c) ? 'checked' : ''}><span>${esc(lName(l.c))}<small>${esc(tName(l.c))}</small></span></label>`).join('')}</div>` +
    `<div class="set-g"><h5>${T('rec')}</h5><select id="recSel" class="sel">${['h','w'].map(g => `<optgroup label="${g === 'h' ? 'Hafs ‘an ‘Asim' : 'Warsh ‘an Nafi‘'}">${RECS.filter(r => r[3] === g).map(r => `<option value="${esc(r[0])}" ${st.rec === r[0] ? 'selected' : ''}>${esc(rName(r[0]))}</option>`).join('')}</optgroup>`).join('')}${RECS.some(r => r[0] === st.rec) ? '' : `<option value="${esc(st.rec)}" selected>${esc(st.rec)}</option>`}</select><input id="recCus" class="sel" dir="ltr" placeholder="${esc(T('recCus'))}" value=""></div>`;
  $('#settings').hidden = false;
}

/* ---------- events ---------- */
function bind() {
  $('#btnMenu').onclick = openMenu; $('#btnSet').onclick = openSettings;
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
    const pa = e.target.closest('[data-pa]'); if (pa) { $('#pick').hidden = true; goTo(st.s, +pa.dataset.pa); return; }
    const t = e.target.closest('button,label,input,aside'); if (!t) return;
    if (t.classList && t.classList.contains('sheet') && e.target === t) { t.hidden = true; return; }
    const w = e.target.closest('.w'); if (w && w.dataset.i != null) { setWord(+w.dataset.i); return; }
    const g = e.target.closest('[data-go]'); if (g) { const [s, a, ww] = g.dataset.go.split(',').map(Number); goTo(s, a, ww); return; }
    const sp = e.target.closest('#spkW'); if (sp) { playWord(); return; }
    const tt = e.target.closest('[data-tts]'); if (tt) { speakTr(tt.dataset.tts); return; }
    const sr = e.target.closest('[data-s]'); if (sr) { $('#menu').hidden = true; if (FahmReader.isOpen()) FahmReader.gotoSurah(D.surahs[+sr.dataset.s].n); else goTo(+sr.dataset.s, 0); return; }
    const kv = e.target.closest('[data-k]'); if (kv && kv.dataset.k === 'maslak') { st.tl = st.tl.filter(x => !URD.includes(x)); st.tl.push(kv.dataset.v); st.tl.sort((x, y) => D.langs.findIndex(l => l.c === x) - D.langs.findIndex(l => l.c === y)); save(); renderTrans(); openSettings(); return; }
    if (kv) { st[kv.dataset.k] = kv.dataset.k === 'sfx' ? +kv.dataset.v : kv.dataset.v; if (kv.dataset.k === 'sfx') { FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); if (st.sfx && playing) FahmSfx.start((scene.spec || {}).sky); } if (kv.dataset.k === 'ui') st.tl = DEF_TL[st.ui].slice(); save(); applyUi(); renderAyah(true); openSettings(); return; }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'recSel') { st.rec = e.target.value; save(); return; }
    if (e.target.id === 'recCus') { const v = e.target.value.trim().replace(/^https?:\/\/everyayah\.com\/data\//, '').replace(/\/+$/, ''); if (v) { st.rec = v; save(); toast(v); } return; }
    const c = e.target.closest('[data-tl]'); if (!c) return;
    const code = c.dataset.tl; st.tl = st.tl.filter(x => x !== code); if (c.checked) st.tl.push(code); st.tl.sort((a, b) => D.langs.findIndex(l => l.c === a) - D.langs.findIndex(l => l.c === b)); save(); renderTrans();
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
  $('#btnLabR').onclick = () => FahmLab.replay();
  $('#btnFull').onclick = () => setFull('#stage', !$('#stage').classList.contains('big'));
  window.addEventListener('visibilitychange', () => { if (document.hidden) scene.stop(); else scene.start(); });
}
function applyUi() { document.documentElement.lang = st.ui === 'en' ? 'en' : 'ur'; document.body.className = 'l-' + st.ui + (st.theme === 'light' ? ' light' : ''); const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = st.theme === 'light' ? '#f6f1e4' : '#05070e'; if (D) navUi(); $('#btnFullS').title = T('full'); $('#btnRead').title = T('reader'); if (window.FahmLab) FahmLab.lang = st.ui; $('#btnFull').title = T('full'); $('#btnReplay').title = T('replay'); $('#btnLabR').title = T('replay'); $('#bMushaf').innerHTML = '<b>' + ({ ur: 'پورا قرآن پڑھیں', ru: 'Poora Quran padhein', en: 'Read the whole Quran' }[st.ui] || '') + '</b><small>' + ({ ur: '۳ مصحف لے آؤٹ · حافظ موڈ · ہر آیت کے ساتھ آڈیو', ru: '3 mushaf layout · Hafiz mode · har ayat ki audio', en: '3 mushaf layouts · Hafiz mode · audio for every ayah' }[st.ui] || '') + '</small>'; }

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
  D = await (await fetch('data.json')).json();
  D.surahs.forEach((S, si) => S.ayat.forEach((A, ai) => A.words.forEach((w, wi) => { if (w.root) (rootIdx[w.root] = rootIdx[w.root] || []).push({ s: si, a: ai, w: wi }); })));
  try { VID = await (await fetch('video/manifest.json')).json(); } catch (e) { VID = {}; }
  if (st.s >= D.surahs.length) st.s = 0;
  FahmSfx.setLevel(st.sfx); scene.onBorn = it => { if (playing && st.sfx) FahmSfx.cue(it.a); };
  FahmReader.init({ D: () => D, st: () => st, save, toast, openMenu, onClose: () => document.body.classList.toggle('noscroll', anyFull()) });
  applyUi(); bind(); renderAyah(false); scene.start(); iosHint();
  try { history.replaceState({ b: 1 }, ''); history.pushState({ a: 1 }, ''); window.addEventListener('popstate', () => { if (window.__fahmBack()) history.pushState({ a: 1 }, ''); }); } catch (e) { }
  window.__fahm = { scene, st, goTo, D, lemKey };
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
}
init();
})();

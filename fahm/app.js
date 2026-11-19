(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(3, '0');
const RTL = { ar: 1, ur: 1, fa: 1 };
const REC = ['Alafasy_128kbps', 'Husary_128kbps', 'Abdurrahmaan_As-Sudais_192kbps', 'Minshawy_Murattal_128kbps', 'Abdul_Basit_Murattal_192kbps'];
const I = window.I18N, STR = I.STR;
const KEY = 'fahm.v1';
let st = { s: 0, a: 0, w: 0, ui: 'ru', tl: null, rec: REC[0], auto: true, ios: 0, theme: 'dark', rfs: 30, sfx: 1, trv: false };
try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } };
if (!STR[st.ui]) st.ui = 'ru';
const DEF_TL = { ur: ['ur'], ru: ['rur'], en: ['en'] };
if (!st.tl || !st.tl.length) st.tl = DEF_TL[st.ui].slice();
const T = k => STR[st.ui][k];
const sName = S => (I.surah[S.n] || {})[st.ui] || [S.en, S.mean];
const lName = c => I.lang[st.ui][c] || c;
const tName = c => I.translator[st.ui][c] || '';
const rName = r => (I.reciter[r] || {})[st.ui] || r;
const pick = o => o ? (st.ui === 'ur' ? o.ur : st.ui === 'ru' ? o.ru : o.en) : '';
let D, scene, rootIdx = {}, playing = false, timer = null, bounds = [], hist = [], readerOn = false, rIdx = 0, rS = 0, rPlaying = false, exitAt = 0;
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
    const L = D.langs.find(l => l.c === c), cls = (c === 'ur' ? 'u' : c === 'hi' ? 'h' : '') + (RTL[c] ? ' rtl' : '');
    return `<div class="tr"><div class="lh"><span>${esc(lName(c))} · ${esc(tName(c))}</span><button class="sp" data-tts="${c}" aria-label="Listen"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></div><p class="${cls}" ${RTL[c] ? 'dir="rtl"' : ''}>${esc(A.tr[c])}</p></div>`;
  }).join('');
}

function renderNZ() {
  const { S } = cur(), n = window.FAHM_NZ[S.n]; if (!n) { $('#nz').innerHTML = ''; return; }
  $('#nz').innerHTML = `<h4>${T('nzh')}</h4><p>${esc(st.ui === 'en' ? n.en : st.ui === 'ur' ? (window.FAHM_NZ_UR[S.n] || '') : n.ur)}</p><small>${T('nzn')}</small>`;
  $('#credits').textContent = T('credits');
}

/* ---------- 3D word scene ---------- */
function showLab() {
  const { S, A, W } = cur(), key = `${S.n}:${A.v}:${st.w}`, spec = (window.FAHM_LAB || {})[key] || (window.FAHM_LEM || {})[lemKey(W.ar)] || null, [m] = wordMeaning(W);
  $('#labTop').textContent = `${T('word')} ${st.w + 1} ${T('of')} ${A.words.length}`;
  $('#labM').textContent = m; $('#labM').className = st.ui === 'ur' ? 'u' : '';
  $('#labN').textContent = spec && spec.n ? pick(spec.n) : '';
  if (window.FahmLab && FahmLab.ok) FahmLab.show(spec, { key, ar: W.ar, root: W.root });
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
  if (readerOn) { closeReader(); return true; }
  for (const id of ['#pick', '#settings', '#menu']) if (!$(id).hidden) { $(id).hidden = true; return true; }
  if ($('#stage').classList.contains('big')) { setFull('#stage', false); return true; }
  if ($('#story').classList.contains('big')) { setFull('#story', false); return true; }
  if (hist.length) { const [s, a] = hist.pop(); goTo(s, a, 0, false, true); return true; }
  const now = Date.now(); if (now - exitAt < 2500) return false; exitAt = now; toast(T('exit'), 2300); return true;
};

/* ---------- reading mode (Indo-Pak style) ---------- */
const rau = new Audio(); rau.preload = 'auto';
const AD = '٠١٢٣٤٥٦٧٨٩', ad = n => String(n).replace(/\d/g, d => AD[d]);
const BISM = 'بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِيۡمِ';
function renderReader(si) {
  rS = si; const S = D.surahs[si], sn = sName(S);
  $('#rTitle').textContent = sn[0] + ' · ' + sn[1];
  $('#rbody').innerHTML = `<div class="rh"><span class="rhn">${esc(sn[0])}</span></div>` + (S.n !== 1 && S.n !== 9 ? `<div class="rb">${BISM}</div>` : '') +
    `<div class="rt">${S.ayat.map((A, i) => `<span class="rv" data-r="${i}">${esc(A.ip || A.ar)} <span class="rn">${ad(A.v)}</span></span>`).join(' ')}</div>`;
  $('#rbody').style.setProperty('--rfs', st.rfs + 'px');
}
function rMark(i) {
  rIdx = i; document.querySelectorAll('#rbody .rv').forEach((e, k) => e.classList.toggle('on', k === i));
  const e = document.querySelector(`#rbody .rv[data-r="${i}"]`); if (e) e.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function rSetPlaying(p) { rPlaying = p; $('#rIcoP').style.display = p ? 'none' : ''; $('#rIcoS').style.display = p ? '' : 'none'; }
function rPlay(i) {
  const S = D.surahs[rS]; if (i >= S.ayat.length) { if (rS < D.surahs.length - 1) { renderReader(rS + 1); i = 0; } else { rSetPlaying(false); return; } }
  rMark(i); rSetPlaying(true); const S2 = D.surahs[rS];
  rau.onerror = () => { rSetPlaying(false); toast(T('audioErr')); };
  rau.onended = () => { if (rPlaying) rPlay(rIdx + 1); };
  rau.src = `https://everyayah.com/data/${st.rec}/${pad(S2.n)}${pad(S2.ayat[i].v)}.mp3`; const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { rSetPlaying(false); toast(T('audioErr')); });
}
function openReader() {
  stopAll(); readerOn = true; $('#reader').hidden = false; document.body.classList.add('noscroll'); renderReader(st.s); rMark(st.a); rSetPlaying(false); $('#rbody').scrollTop = 0;
  setTimeout(() => rMark(st.a), 60);
}
function closeReader() {
  try { rau.pause(); } catch (e) { } rSetPlaying(false); readerOn = false; $('#reader').hidden = true; document.body.classList.toggle('noscroll', anyFull());
  if (rS !== st.s || rIdx !== st.a) goTo(rS, rIdx, 0, false, true);
}
function rSize(d) { st.rfs = Math.max(20, Math.min(64, st.rfs + d)); $('#rbody').style.setProperty('--rfs', st.rfs + 'px'); save(); }

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
function stopAll() { FahmSfx.stop(); clearInterval(timer); timer = null; try { au.pause(); } catch (e) { } if (wordAu) { try { wordAu.pause(); } catch (e) { } } try { speechSynthesis.cancel(); } catch (e) { } setPlaying(false); }
function computeBounds() {
  const { A } = cur(), wts = A.words.map(w => stripD(w.ar).length + 1.2), tot = wts.reduce((x, y) => x + y, 0); bounds = []; let acc = 0;
  wts.forEach(x => { acc += x / tot; bounds.push(acc); });
}
function idxAt(frac) { for (let i = 0; i < bounds.length; i++) if (frac <= bounds[i]) return i; return bounds.length - 1; }
function ayahUrl() { const { S, A } = cur(); return `https://everyayah.com/data/${st.rec}/${pad(S.n)}${pad(A.v)}.mp3`; }
function playAyah() {
  stopAll(); FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); setPlaying(true); scene.set(scene.spec); setWord(0, true, true); if (st.sfx) FahmSfx.start(scene.spec.sky);
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
  if (st.trv && 'speechSynthesis' in window) { FahmSfx.stop(); speakTrList(go); } else go();
}
function playWord() {
  const { W } = cur(); stopAll(); if (wordAu) wordAu.pause();
  wordAu = new Audio('https://audio.qurancdn.com/wbw/' + W.au); wordAu.onerror = () => toast(T('audioErr')); const pr = wordAu.play(); if (pr && pr.catch) pr.catch(() => toast(T('audioErr')));
}
function ttsOf(c, A) { return c === 'rur' ? { text: A.tr.ur, lang: 'ur-PK' } : { text: A.tr[c], lang: (D.langs.find(l => l.c === c) || {}).tts || 'en-US' }; }
function pickVoice(lang) { try { const vs = speechSynthesis.getVoices(), p = lang.slice(0, 2); return vs.find(v => v.lang === lang) || vs.find(v => v.lang.slice(0, 2) === p) || (p === 'ur' ? vs.find(v => v.lang.slice(0, 2) === 'hi') : null) || null; } catch (e) { return null; } }
/* read the chosen translations aloud, one after another; done() runs when finished */
function speakTrList(done, test) {
  const { A } = cur(), list = st.tl.filter(c => A.tr[c]).slice(0, 2); let i = 0; try { speechSynthesis.cancel(); } catch (e) { }
  const nxt = () => { if (i >= list.length || (test && i >= 1)) { if (done) done(); return; } const o = ttsOf(list[i++], A); try { const u = new SpeechSynthesisUtterance(o.text); u.lang = o.lang; const v = pickVoice(o.lang); if (v) u.voice = v; u.rate = .95; u.onend = nxt; u.onerror = nxt; speechSynthesis.speak(u); } catch (e) { toast(T('noVoice')); if (done) done(); } };
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
    `<div class="set-g"><label class="chk"><input type="checkbox" id="autoNext" ${st.auto ? 'checked' : ''}><span>${esc(T('autoOpt'))}</span></label><label class="chk"><input type="checkbox" id="trVoice" ${st.trv ? 'checked' : ''}><span>${esc(T('trVoice'))}</span></label></div>` +
    `<div class="set-g"><h5>${T('tr')}</h5>${D.langs.filter(l => l.c !== 'ar').map(l => `<label class="chk"><input type="checkbox" data-tl="${l.c}" ${st.tl.includes(l.c) ? 'checked' : ''}><span>${esc(lName(l.c))}<small>${esc(tName(l.c))}</small></span></label>`).join('')}</div>` +
    `<div class="set-g"><h5>${T('rec')}</h5>${seg(REC.map(r => [r, rName(r)]), st.rec, 'rec')}</div>`;
  $('#settings').hidden = false;
}

/* ---------- events ---------- */
function bind() {
  $('#btnMenu').onclick = openMenu; $('#btnSet').onclick = openSettings;
  $('#bPrev').onclick = prev; $('#bNext').onclick = () => next(false);
  $('#bPlay').onclick = () => { if (playing) { stopAll(); } else playAyah(); };
  $('#btnReplay').onclick = () => playAyah();
  $('#bPick').onclick = openPick; $('#btnRead').onclick = openReader; $('#rClose').onclick = closeReader; $('#rTitle').onclick = openMenu;
  $('#rMinus').onclick = () => rSize(-3); $('#rPlus').onclick = () => rSize(3);
  $('#rPlay').onclick = () => { if (rPlaying) { rau.pause(); rSetPlaying(false); } else rPlay(rIdx); };
  $('#rbody').addEventListener('click', e => { const v = e.target.closest('.rv'); if (v) rPlay(+v.dataset.r); });
  $('#btnFullS').onclick = () => setFull('#story', true); $('#sClose').onclick = () => setFull('#story', false);
  $('#sPrev').onclick = prev; $('#sNext').onclick = () => next(false); $('#sPlay').onclick = () => { if (playing) stopAll(); else playAyah(); };
  document.addEventListener('click', e => {
    if (e.target.id === 'autoNext') { st.auto = e.target.checked; save(); return; }
    if (e.target.id === 'trVoice') { st.trv = e.target.checked; save(); if (st.trv) speakTrList(null, true); return; }
    const pa = e.target.closest('[data-pa]'); if (pa) { $('#pick').hidden = true; goTo(st.s, +pa.dataset.pa); return; }
    const t = e.target.closest('button,label,input,aside'); if (!t) return;
    if (t.classList && t.classList.contains('sheet') && e.target === t) { t.hidden = true; return; }
    const w = e.target.closest('.w'); if (w && w.dataset.i != null) { setWord(+w.dataset.i); return; }
    const g = e.target.closest('[data-go]'); if (g) { const [s, a, ww] = g.dataset.go.split(',').map(Number); goTo(s, a, ww); return; }
    const sp = e.target.closest('#spkW'); if (sp) { playWord(); return; }
    const tt = e.target.closest('[data-tts]'); if (tt) { speakTr(tt.dataset.tts); return; }
    const sr = e.target.closest('[data-s]'); if (sr) { $('#menu').hidden = true; if (readerOn) { try { rau.pause(); } catch (x) { } rSetPlaying(false); renderReader(+sr.dataset.s); rIdx = 0; $('#rbody').scrollTop = 0; } else goTo(+sr.dataset.s, 0); return; }
    const kv = e.target.closest('[data-k]'); if (kv) { st[kv.dataset.k] = kv.dataset.k === 'sfx' ? +kv.dataset.v : kv.dataset.v; if (kv.dataset.k === 'sfx') { FahmSfx.unlock(); FahmSfx.setLevel(st.sfx); if (st.sfx && playing) FahmSfx.start((scene.spec || {}).sky); } if (kv.dataset.k === 'ui') st.tl = DEF_TL[st.ui].slice(); save(); applyUi(); renderAyah(true); openSettings(); return; }
  });
  document.addEventListener('change', e => {
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
function applyUi() { document.documentElement.lang = st.ui === 'en' ? 'en' : 'ur'; document.body.className = 'l-' + st.ui + (st.theme === 'light' ? ' light' : ''); const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = st.theme === 'light' ? '#f6f1e4' : '#05070e'; if (D) navUi(); $('#btnFullS').title = T('full'); $('#btnRead').title = T('reader'); $('#rbody').dir = 'rtl'; if (window.FahmLab) FahmLab.lang = st.ui; $('#btnFull').title = T('full'); $('#btnReplay').title = T('replay'); $('#btnLabR').title = T('replay'); }

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
  if (st.s >= D.surahs.length) st.s = 0;
  FahmSfx.setLevel(st.sfx); scene.onBorn = it => { if (playing && st.sfx) FahmSfx.cue(it.a); };
  applyUi(); bind(); renderAyah(false); scene.start(); iosHint();
  try { history.replaceState({ b: 1 }, ''); history.pushState({ a: 1 }, ''); window.addEventListener('popstate', () => { if (window.__fahmBack()) history.pushState({ a: 1 }, ''); }); } catch (e) { }
  window.__fahm = { scene, st, goTo, D, lemKey };
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
}
init();
})();

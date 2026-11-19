(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(3, '0');
const RTL = { ar: 1, ur: 1, fa: 1 };
const REC = ['Alafasy_128kbps', 'Husary_128kbps', 'Abdurrahmaan_As-Sudais_192kbps', 'Minshawy_Murattal_128kbps', 'Abdul_Basit_Murattal_192kbps'];
const I = window.I18N, STR = I.STR;
const KEY = 'fahm.v1';
let st = { s: 0, a: 0, w: 0, ui: 'ru', tl: null, rec: REC[0], auto: true, ios: 0 };
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
let D, scene, rootIdx = {}, playing = false, timer = null, bounds = [];
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
  $('#ayahNo').textContent = `${T('ayah')} ${A.v} / ${S.ayat.length}`; $('#storyH').textContent = T('story');
  $('#words').innerHTML = A.words.map((w, i) => { const [m, c] = wordMeaning(w); return `<button class="w" data-i="${i}"><span class="a ar">${esc(w.ar)}</span><span class="m ${c}">${esc(m)}</span></button>`; }).join('');
  const spec = window.FAHM_SCENES[`${S.n}:${A.v}`] || { sky: 'night', items: [], cx: { ur: '', en: '' } };
  scene.set(spec); scene.all(); $('#cx').textContent = capOf(spec, `${S.n}:${A.v}`) || '';
  renderTrans(); renderNZ(); setWord(st.w, false, true); computeBounds(); save();
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
function goTo(s, a, w = 0, play = false) { st.s = s; st.a = a; st.w = w; renderAyah(false); $('#main').scrollTo({ top: 0, behavior: 'smooth' }); if (play) playAyah(); }
function next(play) {
  const S = D.surahs[st.s];
  if (st.a < S.ayat.length - 1) return goTo(st.s, st.a + 1, 0, play);
  if (st.s < D.surahs.length - 1) return goTo(st.s + 1, 0, 0, play);
  setPlaying(false);
}
function prev() { if (st.a > 0) goTo(st.s, st.a - 1); else if (st.s > 0) goTo(st.s - 1, D.surahs[st.s - 1].ayat.length - 1); }

/* ---------- audio ---------- */
function setPlaying(p) { playing = p; $('#icoPlay').style.display = p ? 'none' : ''; $('#icoPause').style.display = p ? '' : 'none'; }
function stopAll() { clearInterval(timer); timer = null; try { au.pause(); } catch (e) { } if (wordAu) { try { wordAu.pause(); } catch (e) { } } try { speechSynthesis.cancel(); } catch (e) { } setPlaying(false); }
function computeBounds() {
  const { A } = cur(), wts = A.words.map(w => stripD(w.ar).length + 1.2), tot = wts.reduce((x, y) => x + y, 0); bounds = []; let acc = 0;
  wts.forEach(x => { acc += x / tot; bounds.push(acc); });
}
function idxAt(frac) { for (let i = 0; i < bounds.length; i++) if (frac <= bounds[i]) return i; return bounds.length - 1; }
function ayahUrl() { const { S, A } = cur(); return `https://everyayah.com/data/${st.rec}/${pad(S.n)}${pad(A.v)}.mp3`; }
function playAyah() {
  stopAll(); scene.set(scene.spec); setWord(0, true, true); setPlaying(true);
  const { A } = cur(); let failed = false;
  const fallback = () => {
    if (failed) return; failed = true; toast(T('audioErr')); const per = 1100; let i = 0; setWord(0, true, true);
    timer = setInterval(() => { i++; if (i >= A.words.length) { clearInterval(timer); timer = null; onEnded(); } else setWord(i, true, true); }, per);
  };
  au.onerror = fallback; au.onended = onEnded;
  au.ontimeupdate = () => { if (!au.duration || failed) return; const lead = Math.min(0.45, au.duration * 0.06), tail = Math.min(0.35, au.duration * 0.05), f = Math.max(0, Math.min(1, (au.currentTime - lead) / Math.max(0.1, au.duration - lead - tail))); const i = idxAt(f); if (i !== st.w) setWord(i, true, true); };
  au.src = ayahUrl(); const pr = au.play(); if (pr && pr.catch) pr.catch(() => fallback());
}
function onEnded() { scene.all(); if (st.auto) { setTimeout(() => { if (playing) next(true); }, 500); } else setPlaying(false); }
function playWord() {
  const { W } = cur(); stopAll(); if (wordAu) wordAu.pause();
  wordAu = new Audio('https://audio.qurancdn.com/wbw/' + W.au); wordAu.onerror = () => toast(T('audioErr')); const pr = wordAu.play(); if (pr && pr.catch) pr.catch(() => toast(T('audioErr')));
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
  const ac = $('#autoNext'); ac.checked = !!st.auto; ac.onchange = () => { st.auto = ac.checked; save(); };
  document.addEventListener('click', e => {
    const t = e.target.closest('button,label,input,aside'); if (!t) return;
    if (t.classList && t.classList.contains('sheet') && e.target === t) { t.hidden = true; return; }
    const w = e.target.closest('.w'); if (w && w.dataset.i != null) { setWord(+w.dataset.i); return; }
    const g = e.target.closest('[data-go]'); if (g) { const [s, a, ww] = g.dataset.go.split(',').map(Number); goTo(s, a, ww); return; }
    const sp = e.target.closest('#spkW'); if (sp) { playWord(); return; }
    const tt = e.target.closest('[data-tts]'); if (tt) { speakTr(tt.dataset.tts); return; }
    const sr = e.target.closest('[data-s]'); if (sr) { $('#menu').hidden = true; goTo(+sr.dataset.s, 0); return; }
    const kv = e.target.closest('[data-k]'); if (kv) { st[kv.dataset.k] = kv.dataset.v; if (kv.dataset.k === 'ui') st.tl = DEF_TL[st.ui].slice(); save(); applyUi(); renderAyah(true); openSettings(); return; }
  });
  document.addEventListener('change', e => {
    const c = e.target.closest('[data-tl]'); if (!c) return;
    const code = c.dataset.tl; st.tl = st.tl.filter(x => x !== code); if (c.checked) st.tl.push(code); st.tl.sort((a, b) => D.langs.findIndex(l => l.c === a) - D.langs.findIndex(l => l.c === b)); save(); renderTrans();
  });
  document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') next(false); else if (e.key === 'ArrowLeft') prev(); else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); $('#bPlay').click(); } });
  let x0 = null; const stg = $('#story');
  stg.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  stg.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60) { dx < 0 ? next(false) : prev(); } }, { passive: true });
  window.addEventListener('resize', () => scene.resize());
  $('#btnLabR').onclick = () => FahmLab.replay();
  $('#btnFull').onclick = () => { $('#stage').classList.toggle('big'); document.body.classList.toggle('nofl', $('#stage').classList.contains('big')); setTimeout(() => FahmLab.resize(), 30); };
  window.addEventListener('visibilitychange', () => { if (document.hidden) scene.stop(); else scene.start(); });
}
function applyUi() { $('#autoLbl').textContent = T('auto'); document.documentElement.lang = st.ui === 'en' ? 'en' : 'ur'; document.body.className = 'l-' + st.ui; if (window.FahmLab) FahmLab.lang = st.ui; $('#btnFull').title = T('full'); $('#btnReplay').title = T('replay'); $('#btnLabR').title = T('replay'); }

/* ---------- install hint ---------- */
let deferred = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; const b = $('#install'); b.innerHTML = `<span style="flex:1">${T('installBar')}</span><button id="doInstall">${T('install')}</button>`; b.hidden = false; $('#doInstall').onclick = async () => { b.hidden = true; deferred.prompt(); }; });
function iosHint() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone;
  if (ios && !st.ios) { const b = $('#install'); b.innerHTML = `<span style="flex:1">${T('iosTip')}</span><button id="okI">${T('close')}</button>`; b.hidden = false; $('#okI').onclick = () => { b.hidden = true; st.ios = 1; save(); }; }
}

async function init() {
  scene = new FahmScene($('#cv')); if (window.FahmLab) FahmLab.lang = st.ui, FahmLab.init($('#stage'));
  D = await (await fetch('data.json')).json();
  D.surahs.forEach((S, si) => S.ayat.forEach((A, ai) => A.words.forEach((w, wi) => { if (w.root) (rootIdx[w.root] = rootIdx[w.root] || []).push({ s: si, a: ai, w: wi }); })));
  if (st.s >= D.surahs.length) st.s = 0;
  applyUi(); bind(); renderAyah(false); scene.start(); iosHint();
  window.__fahm = { scene, st, goTo, D, lemKey };
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
}
init();
})();

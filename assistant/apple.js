'use strict';
/* ===== Arsalan PA — "Apple" layer (v4): calm sounds, one voice at a time, simple home, iOS-style splash & banners.
   Only changes how things look and sound. All saved data (localStorage pa_*, IndexedDB vault) stays exactly as it is. ===== */

/* ---------- 1. ONE VOICE AT A TIME ----------
   Every <audio> that starts playing stops all the others, and stops the phone's text-to-speech too.
   So two voices can never play on top of each other. */
const AP_MEDIA = new Set();
(function () {
  const P = HTMLMediaElement.prototype, orig = P.play;
  P.play = function () {
    AP_MEDIA.add(this);
    AP_MEDIA.forEach(m => { if (m !== this && !m.paused) { try { m.pause(); } catch (e) {} } });
    try { if (typeof TTS !== 'undefined' && TTS.on) TTS.stop(); else if (window.speechSynthesis && speechSynthesis.speaking) speechSynthesis.cancel(); } catch (e) {}
    return orig.apply(this, arguments);
  };
})();
const apBusy = () => { /* is something already being read or recited? then a reminder voice waits its turn (we only show the banner) */
  for (const m of AP_MEDIA) if (!m.paused && !m.ended && m.currentTime > 0) return true;
  try { if (typeof TTS !== 'undefined' && TTS.on) return true; } catch (e) {}
  return false;
};

/* ---------- 2. CALM SOUND EFFECTS ----------
   No more clicks on every tap, no whoosh on every tab. Only meaningful sounds stay
   (tasbeeh bead, Quran page, success, error, reminders), and the same sound never repeats within a moment. */
const AP_SFX_OK = new Set(['bead', 'page', 'success', 'error', 'save', 'chime', 'ding', 'tick']);
(function () {
  const orig = AU.play.bind(AU); const last = {};
  AU.play = function (n) {
    if (!AP_SFX_OK.has(n)) return;
    const now = Date.now(); if (now - (last[n] || 0) < (n === 'bead' || n === 'tick' ? 60 : 900)) return; last[n] = now;
    if (AP.burst && (n === 'chime' || n === 'ding')) return;
    return orig(n);
  };
})();

/* ---------- 3. VOICE CLIPS: no repeats ----------
   The same voice clip is not played again within 15 minutes, the general "alert" clip at most once in 5 minutes,
   and a reminder voice never interrupts Quran recitation or read-aloud. Tests from Settings always play. */
const AP = { burst: 0, burstT: 0, lastVoice: store.get('ap_lv', {}) };
(function () {
  const orig = VO.say.bind(VO);
  VO.say = function (id, force) {
    if (!id || typeof id !== 'string') return;
    const user = force === true || id === 'test' || id === 'voice_on' || id.startsWith('dua_');
    if (!user) {
      const now = Date.now(), gap = id === 'alert' ? 5 * 60000 : 15 * 60000;
      if (now - (AP.lastVoice[id] || 0) < gap) return;
      if (apBusy()) return;
      AP.lastVoice[id] = now; try { store.set('ap_lv', AP.lastVoice); } catch (e) {}
    }
    return orig(id);
  };
})();
/* extras.js test buttons: always play */
if (typeof AX !== 'undefined' && AX.dmtest) AX.dmtest = el => { VO.stop(); VO.say(el.dataset.v, true); };

/* ---------- 4. NOTIFICATIONS: no pile-up ----------
   If several alerts arrive together (e.g. 6 new orders), only the first one speaks and rings;
   the rest are saved quietly and the banner shows "+N more". */
(function () {
  const orig = notify;
  notify = async function (title, body, o = {}) {
    const now = Date.now();
    if (now - AP.burstT < 8000) { AP.burst++; o = Object.assign({}, o, { silent: true }); } else { AP.burst = 0; }
    AP.burstT = now;
    const r = await orig(title, body, o);
    if (AP.burst) apBanner('🔔', title, T(`+${AP.burst} aur`, `+${AP.burst} more`, `+${AP.burst} اور`, `+${AP.burst} और`), 3600);
    return r;
  };
})();

/* ---------- 5. iOS-STYLE BANNER (replaces the old toast) ---------- */
function apBanner(icon, title, body, ms = 2800) {
  const t = $('#toast'); if (!t) return;
  t.innerHTML = `<div class="apb"><span class="apb-i">${icon ? esc(icon) : '<img src="icon-192.png" alt="">'}</span><span class="apb-t"><b>${esc(title || '')}</b>${body ? `<small>${esc(body)}</small>` : ''}</span><span class="apb-n">${T('abhi', 'now', 'ابھی', 'अभी')}</span></div>`;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
toast = function (m, ms = 2600) {
  m = String(m == null ? '' : m);
  const em = (m.match(/^(\p{Extended_Pictographic}️?)\s*/u) || [])[1] || '';
  let rest = em ? m.slice(m.indexOf(em) + em.length).trim() : m;
  let title = rest, body = '';
  const k = rest.indexOf(' — '); if (k > 0) { title = rest.slice(0, k); body = rest.slice(k + 3); }
  apBanner(em, title, body, ms);
};
/* swipe the banner up to close it */
(function () {
  let y0 = null; const t = $('#toast'); if (!t) return;
  t.addEventListener('pointerdown', e => { y0 = e.clientY; });
  t.addEventListener('pointerup', e => { if (y0 != null && e.clientY - y0 < -12) t.classList.remove('show'); else if (y0 != null) t.classList.remove('show'); y0 = null; });
})();

/* ---------- 6. APPLE SPLASH (about 1.6 s, no tapping needed) ----------
   Icon zooms in from a soft blur, the name fades in, a gentle chime.
   The "Assalamu Alaikum" voice plays only on the first open of the day, not every time. */
splash = async function () {
  const sp = $('#splash'); if (!sp) return;
  const salam = S.lang === 'ur' ? 'السلام علیکم' : S.lang === 'hi' ? 'अस्सलामु अलैकुम' : S.lang === 'ar' ? 'السلام عليكم' : 'Assalamu Alaikum';
  sp.innerHTML = `<div class="aps"><div class="aps-glow"></div><img class="aps-ic" src="icon-512.png" alt=""><div class="aps-name">Arsalan PA</div><div class="aps-sub">${esc(salam)}</div></div>`;
  sp.classList.add('apple');
  requestAnimationFrame(() => sp.classList.add('go'));
  setTimeout(() => {
    try { AU.unlock(); sfx('chime'); } catch (e) {}
    const d = dkey(); if (store.get('ap_salam', '') !== d && S.voice) { store.set('ap_salam', d); VO.say('open_salam', true); }
  }, 450);
  setTimeout(() => sp.classList.add('out'), 1500);
  setTimeout(() => sp.remove(), 2200);
};

/* ---------- 7. SIMPLE TAB BAR (equal width, like iPhone) ---------- */
layoutDock = function () {
  const d = $('#dock'); if (!d) return; const i = TABS.findIndex(t => t[0] === curTab);
  d.style.gridTemplateColumns = `repeat(${TABS.length},1fr)`;
  const p = $('#dpill'); if (p) p.style.display = 'none';
  $$('button', d).forEach((b, k) => b.classList.toggle('on', k === i));
};

/* ---------- 8. SIMPLE HOME ----------
   Home shows only: greeting, two widgets (next namaz + today), anything that needs you now,
   one grid of app icons to every section, and the hadith of the day.
   Everything that was on the old long home page is still there under the "Aaj" (Today) icon. */
const AP_ICONS = {
  namaz: ['🕌', 'g-teal'], quran: ['📖', 'g-green'], azkar: ['📿', 'g-indigo'], kutub: ['📚', 'g-brown'], khabar: ['📰', 'g-gray'],
  ramzan: ['🌙', 'g-night'], saal: ['📅', 'g-red'], parivar: ['👨‍👩‍👧', 'g-pink'],
  tasks: ['✅', 'g-blue'], calls: ['📞', 'g-green'], duty: ['🕘', 'g-orange'], deliv: ['🚚', 'g-yellow'], paisa: ['💰', 'g-gold'], waqt: ['⏱️', 'g-purple'], wallet: ['🔐', 'g-gray'],
  calc: ['🧮', 'g-gray'], biz: ['💼', 'g-blue'], office: ['🏢', 'g-indigo'], noor: ['✨', 'g-purple'], set: ['⚙️', 'g-gray'], today: ['📊', 'g-orange'], links: ['🔗', 'g-teal']
};
function apApps() {
  const L = [];
  L.push({ k: 'today', n: T('Aaj', 'Today', 'آج', 'आज'), a: 'apgo', v: 'home', s: 'today' });
  (SUBS.deen || []).forEach(x => L.push({ k: x[0], n: String(x[1]()).replace(/^\p{Extended_Pictographic}\S*\s*/u, ''), v: 'deen', s: x[0] }));
  L.push({ k: 'biz', n: T('Kaarobar', 'Business', 'کاروبار', 'कारोबार'), v: 'biz' });
  L.push({ k: 'office', n: T('Office', 'Office', 'آفس', 'ऑफ़िस'), v: 'office' });
  (SUBS.kaam || []).forEach(x => L.push({ k: x[0], n: x[1](), v: 'kaam', s: x[0] }));
  L.push({ k: 'calc', n: T('Calculator', 'Calculator', 'کیلکولیٹر', 'कैलकुलेटर'), a: 'calcopen' });
  L.push({ k: 'noor', n: 'Noor', v: 'more', s: 'noor' });
  L.push({ k: 'set', n: T('Settings', 'Settings', 'ترتیبات', 'सेटिंग्स'), v: 'more', s: 'set' });
  return L;
}
function apAppHTML(x) {
  const ic = AP_ICONS[x.k] || ['•', 'g-gray'];
  let badge = '';
  if (x.k === 'biz') { try { const n = pendingOf().length; if (n) badge = `<i class="apbd">${n > 99 ? '99+' : n}</i>`; } catch (e) {} }
  if (x.k === 'tasks') { try { const n = TASKS.filter(t => !t.done).length; if (n) badge = `<i class="apbd">${n}</i>`; } catch (e) {} }
  return `<button class="apapp" data-a="${x.a && x.a !== 'apgo' ? x.a : 'apgo'}" data-v="${x.v || ''}" ${x.s ? `data-s="${x.s}"` : ''}><span class="apic ${ic[1]}">${ic[0]}${badge}</span><span class="apnm">${esc(x.n)}</span></button>`;
}
A.apgo = el => { if (navigator.vibrate) navigator.vibrate(6); go(el.dataset.v, el.dataset.s || undefined); };
const AP_OLD_HOME = renderHome;
const apSafe = f => { try { return typeof f === 'function' ? (f() || '') : ''; } catch (e) { return ''; } };
renderHome = function (el) {
  if (subOf() === 'today') { /* the old, complete home page */
    el.innerHTML = `<button class="apback" data-a="apgo" data-v="home" data-s="main">‹ ${T('Ghar', 'Home', 'گھر', 'घर')}</button><div id="aptoday"></div>`;
    AP_OLD_HOME($('#aptoday')); return;
  }
  const np = typeof nextPrayer === 'function' ? nextPrayer() : null, d = dkey();
  let hz = 0, tl = 0, open = 0; try { hz = hzScore(d); tl = tlToday(); open = TASKS.filter(t => !t.done).length; } catch (e) {}
  const date = new Date().toLocaleDateString(LOC(), { weekday: 'long', day: 'numeric', month: 'long' });
  const w1 = np ? `<button class="apw apw-n" data-a="apgo" data-v="deen" data-s="namaz"><span class="apw-l">${T('Agli namaz', 'Next prayer', 'اگلی نماز', 'अगली नमाज़')}</span><b class="apw-big">${esc(pname(np.k))}</b><span class="apw-cd" data-cd="${+np.at}">--:--</span><span class="apw-s">${t12 ? esc(t12(hhmmOf(np.at))) : ''}</span></button>`
    : `<button class="apw apw-n" data-a="apgo" data-v="deen" data-s="namaz"><span class="apw-l">${T('Namaz', 'Prayer', 'نماز', 'नमाज़')}</span><b class="apw-big">🕌</b><span class="apw-s">${T('Waqt load ho raha hai', 'Loading times', 'اوقات لوڈ ہو رہے ہیں', 'औक़ात लोड हो रहे हैं')}</span></button>`;
  const w2 = `<button class="apw apw-t" data-a="apgo" data-v="home" data-s="today"><span class="apw-l">${T('Aaj', 'Today', 'آج', 'आज')}</span>
    <span class="apw-row"><i>🕌</i><b>${hz}/5</b></span><span class="apw-row"><i>📖</i><b>${tl}/${S.tilTarget || 0}</b></span><span class="apw-row"><i>✅</i><b>${open}</b> <small>${T('kaam baaki', 'tasks left', 'کام باقی', 'काम बाक़ी')}</small></span></button>`;
  let pq = ''; try { if (PQ.length) pq = `<div class="card"><h2>${T('Aap se sawal', 'Questions for you', 'آپ سے سوال', 'आप से सवाल')} (${PQ.length})</h2>${PQ.map(q => `<div class="pq"><b>${esc(q.title)}</b><div class="btns">${q.btns.map(b => `<button class="btn s ${b[0] === 'z' ? 'ghost' : ''}" data-a="qans" data-q="${q.id}" data-b="${b[0]}">${b[1]}</button>`).join('')}</div></div>`).join('')}</div>`; } catch (e) {}
  const now = apSafe(typeof newAlertsCard === 'function' ? newAlertsCard : null) + pq + apSafe(typeof jumaCard === 'function' ? () => jumaCard(1) : null) + apSafe(typeof mkBanner === 'function' ? mkBanner : null);
  let had = ''; try { const dh = hadeesOfDay(); had = `<div class="card aphad"><div class="apw-l">${T('Aaj ki hadees', 'Hadith of the day', 'آج کی حدیث', 'आज की हदीस')}</div><div class="had">${esc(dh[0])}</div><div class="muted sm mt">${esc(dh[1])}</div></div>`; } catch (e) {}
  let links = ''; try { const ls = store.get('links', DEFAULT_LINKS); links = `<div class="apsec">${T('Shortcuts', 'Shortcuts', 'شارٹ کٹس', 'शॉर्टकट्स')}</div><div class="aplinks">${ls.map(l => `<a class="aplk" target="_blank" rel="noopener" href="${esc(l.u)}">${linkIco(l)}<span>${esc(l.n)}</span></a>`).join('')}</div>`; } catch (e) {}
  el.innerHTML = `<div class="aphi"><div class="aphi-d">${esc(date)}${typeof TM !== 'undefined' && TM && TM.hijri ? ' · ' + esc(hijriTxt()) : ''}</div></div>
    <div class="apwg">${w1}${w2}</div>${now}
    <div class="apsec">${T('Sab kuch', 'Everything', 'سب کچھ', 'सब कुछ')}</div><div class="apgrid">${apApps().map(apAppHTML).join('')}</div>
    ${links}${had}`;
};
/* home has its own simple look; the eyebrow on top becomes the greeting */
(function () {
  const r0 = rerender;
  rerender = async function (reveal) {
    const out = await r0(reveal);
    if (curTab === 'home' && subOf() !== 'today') { const e = $('#hEye'); if (e) e.textContent = T('Assalamu Alaikum', 'Assalamu Alaikum', 'السلام علیکم', 'अस्सलामु अलैकुम'); }
    document.documentElement.classList.toggle('ap-home', curTab === 'home' && subOf() !== 'today');
    return out;
  };
})();
if (curTab === 'home' && curSub.home === 'today') { curSub.home = 'main'; }
document.documentElement.classList.add('apple');

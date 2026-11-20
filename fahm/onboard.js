/* After the opening animation:
   first run  -> 3D-Earth language screen -> theme / maslak -> wuzu question
   every run  -> wuzu question (spoken, in the user's own language), and a guided, spoken wudu if "No". */
(function () {
'use strict';
const D = document;
const L = {
  ur: { pick: 'اپنی زبان چنیں', pick2: 'زمین کو گھمائیں، پھر اپنی زبان دبائیں', hi: 'فہم القرآن میں خوش آمدید', sub: 'اپنی ترجیحات چن لیں (بعد میں بھی بدل سکتے ہیں)', theme: 'تھیم', dark: 'ڈارک', light: 'لائٹ', mk: 'ترجمہ / مسلک', go: 'آگے چلیں',
    q: 'کیا آپ نے وضو کیا ہے؟', qs: 'قرآنِ مجید کو چھونے سے پہلے باوضو ہونا بہتر ہے۔', yes: 'جی ہاں، وضو ہے', no: 'نہیں', st: 'وضو کا آسان طریقہ', done: 'وضو کر لیا، شروع کریں', look: 'ابھی صرف دیکھنا/سننا ہے', back: 'واپس', nx: 'اگلا قدم', rp: 'دوبارہ سنیں', stp: 'قدم',
    steps: ['نیت اور بسم اللہ پڑھیں', 'دونوں ہاتھ گٹوں تک تین بار دھوئیں', 'کلی کریں اور ناک میں پانی ڈالیں، تین بار', 'پورا چہرہ تین بار دھوئیں', 'دونوں بازو کہنیوں سمیت تین بار دھوئیں', 'پورے سر کا ایک بار مسح کریں', 'کانوں کا مسح کریں', 'دونوں پاؤں ٹخنوں سمیت تین بار دھوئیں'], mkl: { d: 'دیوبندی', b: 'بریلوی', a: 'اہلِ حدیث', j: 'جماعتِ اسلامی', s: 'شیعہ' }, hello: 'السلام علیکم، فہم القرآن میں خوش آمدید' },
  ru: { pick: 'Apni zubaan chunein', pick2: 'Zameen ko ghumayein, phir apni zubaan dabayein', hi: 'Fahmul Quraan mein khush aamdeed', sub: 'Apni tarjeehaat chun lein (baad mein bhi badal sakte hain)', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Tarjuma / Maslak', go: 'Aage chalein',
    q: 'Kya aapne wuzu kiya hai?', qs: 'Quran-e-Majeed ko chhoone se pehle baa-wuzu hona behtar hai.', yes: 'Ji haan, wuzu hai', no: 'Nahin', st: 'Wuzu ka aasaan tareeqa', done: 'Wuzu kar liya, shuru karein', look: 'Abhi sirf dekhna/sunna hai', back: 'Wapas', nx: 'Agla qadam', rp: 'Dobara sunein', stp: 'Qadam',
    steps: ['Niyyat aur Bismillah padhein', 'Dono haath gattoN tak teen baar dhoyein', 'Kulli karein aur naak mein paani daalein, teen baar', 'Poora chehra teen baar dhoyein', 'Dono baazu kohniyon samet teen baar dhoyein', 'Poore sar ka ek baar masah karein', 'Kaanon ka masah karein', 'Dono paaon takhnon samet teen baar dhoyein'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' }, hello: 'Assalamu alaikum, Fahmul Quraan mein khush aamdeed' },
  en: { pick: 'Choose your language', pick2: 'Spin the Earth, then tap your language', hi: 'Welcome to Fahmul Quraan', sub: 'Pick your preferences first (you can change them later)', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Translation / school', go: 'Continue',
    q: 'Have you made wudu (ablution)?', qs: 'It is best to be in wudu before touching the Quran.', yes: 'Yes, I have wudu', no: 'No', st: 'How to make wudu', done: 'Wudu done, start', look: 'Just viewing / listening for now', back: 'Back', nx: 'Next step', rp: 'Hear again', stp: 'Step',
    steps: ['Make the intention and say Bismillah', 'Wash both hands up to the wrists, 3 times', 'Rinse the mouth and nose, 3 times', 'Wash the whole face, 3 times', 'Wash both arms including the elbows, 3 times', 'Wipe the whole head once', 'Wipe the ears', 'Wash both feet including the ankles, 3 times'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' }, hello: 'Assalamu alaikum, welcome to Fahmul Quraan' }
};
const ICON = ['🤲', '🙌', '👄', '🙂', '💪', '🧑', '👂', '🦶'];
const drop = '<svg viewBox="0 0 64 64"><path d="M32 6C22 20 12 30 12 41a20 20 0 0 0 40 0C52 30 42 20 32 6z" fill="url(#ob1)" stroke="#33cbe0" stroke-width="2"/><path d="M22 42a10 10 0 0 0 8 9" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/><defs><linearGradient id="ob1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe6f2"/><stop offset="1" stop-color="#1b8ba0"/></linearGradient></defs></svg>';
const bubbles = '<div class="ob-bub">' + Array.from({ length: 9 }, (_, i) => `<i style="left:${8 + i * 10.5}%;animation-delay:${(i * 0.7).toFixed(1)}s;width:${8 + (i * 7) % 14}px;height:${8 + (i * 7) % 14}px"></i>`).join('') + '</div>';
let box = null, step = '', globe = null, si = 0;
const A = () => window.__fahmApp, ST = () => A().st(), lg = () => L[ST().ui] || L.ru;

/* ---------- voice (free: phone's own speech engine). Urdu text is spoken for both Urdu and Roman-Urdu users. ---------- */
const voiceOn = () => ST().onv !== 0;
function say(text, done) {
  stopV();
  if (!voiceOn() || !('speechSynthesis' in window) || !text) { if (done) done(); return; }
  try {
    const en = ST().ui === 'en', lang = en ? 'en-US' : 'ur-PK', u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = .92;
    const vs = speechSynthesis.getVoices(), p = lang.slice(0, 2), v = vs.find(x => x.lang === lang) || vs.find(x => x.lang.slice(0, 2) === p) || (!en ? vs.find(x => x.lang.slice(0, 2) === 'hi') : null);
    if (v) u.voice = v; if (done) { u.onend = done; u.onerror = done; } speechSynthesis.speak(u);
  } catch (e) { if (done) done(); }
}
let au = null;
function stopV() { try { speechSynthesis.cancel(); } catch (e) { } if (au) { try { au.pause(); } catch (e) { } au = null; } }
/* recorded voice-over made for the Quranic Science site (hu = Urdu/Hindustani, en = English) */
function clip(name, fb, done) {
  stopV(); if (!voiceOn()) { if (done) done(); return; }
  const l = ST().ui === 'en' ? 'en' : 'hu'; let fin = false; const end = () => { if (fin) return; fin = true; if (done) done(); };
  try { const a = new Audio('vo/v-' + name + '-' + l + '.mp3'); au = a; a.onended = end; a.onerror = () => { au = null; fin = true; say(fb, done); }; const p = a.play(); if (p && p.catch) p.catch(() => { au = null; if (!fin) { fin = true; say(fb, done); } }); }
  catch (e) { say(fb, done); }
}
const spoken = () => (ST().ui === 'en' ? L.en : L.ur);
const vbtn = () => `<button class="ob-vol" data-a="vol" aria-label="voice">${voiceOn() ? '🔊' : '🔇'}</button>`;
function killGlobe() { if (globe) { globe.stop(); globe = null; } }

/* ---------- 1. language on a 3D Earth ---------- */
function lang() {
  step = 'lang'; const s = ST();
  shell().innerHTML = `<div class="ob-in ob-lang">${bubbles}
    <div class="ob-logo">فہم القرآن</div><h2>${L.ur.pick} · ${L.ru.pick} · ${L.en.pick}</h2>
    <div class="ob-earth"><canvas id="obEarth"></canvas><div class="ob-fb"></div></div>
    <p class="ob-hint">${L.ur.pick2}<br>${L.en.pick2}</p>
    <div class="ob-lbtns">${[['ur', 'اردو', 'Urdu'], ['ru', 'Roman Urdu', 'Roman'], ['en', 'English', 'English']].map(([v, l, s2]) => `<button class="b3d" data-lang="${v}"><b>${l}</b><small>${s2}</small></button>`).join('')}</div></div>`;
  box.hidden = false; killGlobe();
  const cv = D.getElementById('obEarth'); globe = window.FahmGlobe ? FahmGlobe.mount(cv) : null; if (!globe) box.querySelector('.ob-earth').classList.add('nogl');
}

/* ---------- 2. theme + school ---------- */
function setup() {
  step = 'setup'; killGlobe(); const s = ST(), t = lg(), mk = A().MASLAK;
  const cur = (mk.find(([k, c]) => s.tl.includes(c)) || [0, ''])[1];
  shell().innerHTML = `<div class="ob-in">${bubbles}<div class="ob-logo">فہم القرآن</div><h2>${t.hi}</h2><p>${t.sub}</p>
  <h5>${t.theme}</h5><div class="ob-seg">${[['dark', t.dark], ['light', t.light]].map(([v, l]) => `<button data-p="theme" data-v="${v}" class="${s.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h5>${t.mk}</h5><div class="ob-seg wrap">${mk.map(([k, c]) => `<button data-p="mk" data-v="${c}" class="${cur === c ? 'on' : ''}">${t.mkl[k]}</button>`).join('')}</div>
  <button class="ob-go b3d gold" data-a="next">${t.go}</button></div>`;
  box.hidden = false;
}

/* ---------- 3. wuzu question (spoken) ---------- */
function wuzu() {
  step = 'wuzu'; killGlobe(); const t = lg();
  shell().innerHTML = `<div class="ob-in c">${bubbles}${vbtn()}<div class="ob-orb"><span class="rg r1"></span><span class="rg r2"></span><span class="rg r3"></span><div class="ob-drop">${drop}</div></div><h2>${t.q}</h2><p>${t.qs}</p>
  <button class="ob-go b3d gold" data-a="yes">${t.yes}</button><button class="ob-alt b3d" data-a="no">${t.no}</button></div>`;
  box.hidden = false; setTimeout(() => { if (step === 'wuzu') clip('wudu', spoken().q + ' ' + spoken().qs); }, 450);
}

/* ---------- 4. guided, spoken wudu ---------- */
function steps(i, quiet) {
  step = 'steps'; si = Math.max(0, Math.min(7, i || 0)); const t = lg(), rtl = ST().ui === 'ur', last = si === 7;
  shell().innerHTML = `<div class="ob-in c">${bubbles}${vbtn()}<h5>${t.st}</h5>
  <div class="ob-prog">${t.steps.map((_, k) => `<i class="${k < si ? 'd' : k === si ? 'n' : ''}"></i>`).join('')}</div>
  <div class="ob-step"><div class="ob-ic"><span>${ICON[si]}</span><em class="w1"></em><em class="w2"></em><em class="w3"></em></div>
  <div class="ob-sn">${t.stp} ${si + 1} / 8</div><h2 ${rtl ? 'dir="rtl"' : ''}>${t.steps[si]}</h2></div>
  <div class="ob-row"><button class="ob-alt b3d sm" data-a="rp">🔊 ${t.rp}</button></div>
  ${last ? `<button class="ob-go b3d gold" data-a="yes">${t.done}</button><button class="ob-alt b3d" data-a="yes">${t.look}</button>` : `<button class="ob-go b3d gold" data-a="nx">${t.nx}</button>`}
  <button class="ob-alt b3d" data-a="${si ? 'pv' : 'wuzu'}">${t.back}</button></div>`;
  box.hidden = false; if (!quiet) say(spoken().steps[si]);
}

function shell() { if (!box) { box = D.createElement('div'); box.id = 'onb'; D.body.appendChild(box); box.addEventListener('click', onClick); } return box; }
function close() { stopV(); killGlobe(); if (box) { box.classList.add('out'); setTimeout(() => { box && box.remove(); box = null; step = ''; }, 380); } }
function onClick(e) {
  const b = e.target.closest('button'); if (!b) return; const a = A(), s = ST();
  if (b.dataset.lang) { a.setPref('ui', b.dataset.lang); const h = (b.dataset.lang === 'en' ? L.en : L.ur).hello; setup(); say(h); return; }
  if (b.dataset.p === 'mk') { a.setMaslak(b.dataset.v); setup(); return; }
  if (b.dataset.p) { a.setPref(b.dataset.p, b.dataset.v); setup(); return; }
  const k = b.dataset.a; if (!k) return;
  if (k === 'vol') { s.onv = voiceOn() ? 0 : 1; a.save(); b.textContent = voiceOn() ? '🔊' : '🔇'; if (!voiceOn()) stopV(); else if (step === 'wuzu') clip('wudu', spoken().q); else if (step === 'steps') say(spoken().steps[si]); return; }
  if (k === 'rp') { say(spoken().steps[si]); return; }
  if (k === 'next') { s.onb = 1; a.save(); wuzu(); } else if (k === 'no') { steps(0, true); clip('wuduno', spoken().q, () => { if (step === 'steps' && si === 0) say(spoken().steps[0]); }); } else if (k === 'nx') steps(si + 1); else if (k === 'pv') steps(si - 1); else if (k === 'wuzu') wuzu(); else if (k === 'yes') close();
}
function start() { if (window.__fahmOnb) return; window.__fahmOnb = 1; if (!ST().onb) { shell(); lang(); } else { shell(); wuzu(); } }
let ready = false, splashGone = !D.documentElement.classList.contains('splashing') && !D.getElementById('splash');
const go = () => { if (ready && splashGone) start(); };
window.addEventListener('fahm-ready', () => { ready = !!window.__fahmApp; go(); });
window.addEventListener('fahm-splash-done', () => { splashGone = true; go(); });
if (window.__fahmApp) { ready = true; }
window.__fahmOnbOpen = () => !!box;
try { speechSynthesis.getVoices(); } catch (e) { }
})();

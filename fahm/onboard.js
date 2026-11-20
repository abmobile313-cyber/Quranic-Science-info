/* After the opening animation: (first run) language / theme / maslak setup, then EVERY launch the wuzu question. */
(function () {
'use strict';
const D = document;
const L = {
  ur: { hi: 'فہم القرآن میں خوش آمدید', sub: 'پہلے اپنی ترجیحات چن لیں (بعد میں بھی بدل سکتے ہیں)', lang: 'زبان', theme: 'تھیم', dark: 'ڈارک', light: 'لائٹ', mk: 'ترجمہ / مسلک', go: 'آگے چلیں',
    q: 'کیا آپ نے وضو کیا ہے؟', qs: 'قرآنِ مجید کو چھونے سے پہلے باوضو ہونا بہتر ہے۔', yes: 'جی ہاں، وضو ہے', no: 'نہیں', st: 'وضو کا آسان طریقہ', done: 'وضو کر لیا، شروع کریں', look: 'ابھی صرف دیکھنا/سننا ہے', back: 'واپس',
    steps: ['نیت اور بسم اللہ پڑھیں', 'دونوں ہاتھ گٹوں تک تین بار دھوئیں', 'کلی کریں اور ناک میں پانی ڈالیں (تین بار)', 'پورا چہرہ تین بار دھوئیں', 'دونوں بازو کہنیوں سمیت تین بار دھوئیں', 'پورے سر کا ایک بار مسح کریں', 'کانوں کا مسح کریں', 'دونوں پاؤں ٹخنوں سمیت تین بار دھوئیں'], mkl: { d: 'دیوبندی', b: 'بریلوی', a: 'اہلِ حدیث', j: 'جماعتِ اسلامی', s: 'شیعہ' } },
  ru: { hi: 'Fahmul Quraan mein khush aamdeed', sub: 'Pehle apni tarjeehaat chun lein (baad mein bhi badal sakte hain)', lang: 'Zubaan', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Tarjuma / Maslak', go: 'Aage chalein',
    q: 'Kya aapne wuzu kiya hai?', qs: 'Quran-e-Majeed ko chhoone se pehle baa-wuzu hona behtar hai.', yes: 'Ji haan, wuzu hai', no: 'Nahin', st: 'Wuzu ka aasaan tareeqa', done: 'Wuzu kar liya, shuru karein', look: 'Abhi sirf dekhna/sunna hai', back: 'Wapas',
    steps: ['Niyyat aur Bismillah padhein', 'Dono haath gattoN tak teen baar dhoyein', 'Kulli karein aur naak mein paani daalein (teen baar)', 'Poora chehra teen baar dhoyein', 'Dono baazu kohniyon samet teen baar dhoyein', 'Poore sar ka ek baar masah karein', 'Kaanon ka masah karein', 'Dono paaon takhnon samet teen baar dhoyein'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' } },
  en: { hi: 'Welcome to Fahmul Quraan', sub: 'Pick your preferences first (you can change them later)', lang: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Translation / school', go: 'Continue',
    q: 'Have you made wudu (ablution)?', qs: 'It is best to be in wudu before touching the Quran.', yes: 'Yes, I have wudu', no: 'No', st: 'How to make wudu', done: 'Wudu done, start', look: 'Just viewing / listening for now', back: 'Back',
    steps: ['Make the intention and say Bismillah', 'Wash both hands up to the wrists, 3 times', 'Rinse the mouth and nose, 3 times', 'Wash the whole face, 3 times', 'Wash both arms including the elbows, 3 times', 'Wipe the whole head once', 'Wipe the ears', 'Wash both feet including the ankles, 3 times'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' } }
};
const drop = '<svg viewBox="0 0 64 64"><path d="M32 6C22 20 12 30 12 41a20 20 0 0 0 40 0C52 30 42 20 32 6z" fill="url(#ob1)" stroke="#33cbe0" stroke-width="2"/><path d="M22 42a10 10 0 0 0 8 9" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/><defs><linearGradient id="ob1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe6f2"/><stop offset="1" stop-color="#1b8ba0"/></linearGradient></defs></svg>';
let box = null, step = '';
const A = () => window.__fahmApp, ST = () => A().st(), lg = () => L[ST().ui] || L.ru;
function shell() { if (!box) { box = D.createElement('div'); box.id = 'onb'; D.body.appendChild(box); box.addEventListener('click', onClick); } return box; }
function setup() {
  step = 'setup'; const s = ST(), t = lg(), mk = A().MASLAK;
  const cur = (mk.find(([k, c]) => s.tl.includes(c)) || [0, ''])[1];
  shell().innerHTML = `<div class="ob-in"><div class="ob-logo">فہم القرآن</div><h2>${t.hi}</h2><p>${t.sub}</p>
  <h5>${t.lang}</h5><div class="ob-seg">${[['ur', 'اردو'], ['ru', 'Roman Urdu'], ['en', 'English']].map(([v, l]) => `<button data-p="ui" data-v="${v}" class="${s.ui === v ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h5>${t.theme}</h5><div class="ob-seg">${[['dark', t.dark], ['light', t.light]].map(([v, l]) => `<button data-p="theme" data-v="${v}" class="${s.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h5>${t.mk}</h5><div class="ob-seg wrap">${mk.map(([k, c]) => `<button data-p="mk" data-v="${c}" class="${cur === c ? 'on' : ''}">${t.mkl[k]}</button>`).join('')}</div>
  <button class="ob-go" data-a="next">${t.go}</button></div>`;
  box.hidden = false;
}
function wuzu() {
  step = 'wuzu'; const t = lg();
  shell().innerHTML = `<div class="ob-in c"><div class="ob-drop">${drop}</div><h2>${t.q}</h2><p>${t.qs}</p>
  <button class="ob-go" data-a="yes">${t.yes}</button><button class="ob-alt" data-a="no">${t.no}</button></div>`;
  box.hidden = false;
}
function steps() {
  step = 'steps'; const t = lg(), rtl = ST().ui === 'ur';
  shell().innerHTML = `<div class="ob-in"><div class="ob-drop sm">${drop}</div><h2>${t.st}</h2><ol ${rtl ? 'dir="rtl"' : ''}>${t.steps.map(x => `<li>${x}</li>`).join('')}</ol>
  <button class="ob-go" data-a="yes">${t.done}</button><button class="ob-alt" data-a="yes">${t.look}</button><button class="ob-alt" data-a="wuzu">${t.back}</button></div>`;
}
function close() { if (box) { box.classList.add('out'); setTimeout(() => { box && box.remove(); box = null; step = ''; }, 380); } }
function onClick(e) {
  const b = e.target.closest('button'); if (!b) return; const a = A(), s = ST();
  if (b.dataset.p === 'mk') { a.setMaslak(b.dataset.v); setup(); return; }
  if (b.dataset.p) { a.setPref(b.dataset.p, b.dataset.v); setup(); return; }
  const k = b.dataset.a; if (!k) return;
  if (k === 'next') { s.onb = 1; a.save(); wuzu(); } else if (k === 'no') steps(); else if (k === 'wuzu') wuzu(); else if (k === 'yes') close();
}
function start() { if (window.__fahmOnb) return; window.__fahmOnb = 1; if (!ST().onb) setup(); else wuzu(); }
let ready = false, splashGone = !D.documentElement.classList.contains('splashing') && !D.getElementById('splash');
const go = () => { if (ready && splashGone) start(); };
window.addEventListener('fahm-ready', () => { ready = !!window.__fahmApp; go(); });
window.addEventListener('fahm-splash-done', () => { splashGone = true; go(); });
if (window.__fahmApp) { ready = true; }
window.__fahmOnbOpen = () => !!box;
})();

/* Fahmul Quraan — Build 32 guided tour.
   Runs once after the first-run screens, again any time from Settings or the "Guide" tile, and a short tour the first time reading mode opens. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const APP = () => window.__fahmApp, ST = () => APP().st(), UI = () => (ST().ui === 'ur' ? 'ur' : ST().ui === 'en' ? 'en' : 'ru');
const B = { ru: { next: 'Aage', back: 'Peeche', skip: 'Band karein', done: 'Shuru karein', of: 'mein se' }, ur: { next: 'آگے', back: 'پیچھے', skip: 'بند کریں', done: 'شروع کریں', of: 'میں سے' }, en: { next: 'Next', back: 'Back', skip: 'Skip', done: 'Start', of: 'of' } };
/* [selector, {ru, ur, en}] */
const MAIN = [
  [null, { ru: 'Assalamu alaikum! Yeh chhota sa guide aap ko Fahmul Quraan ki har cheez 1 minute mein dikhayega.', ur: 'السلام علیکم! یہ چھوٹا سا گائیڈ آپ کو فہم القرآن کی ہر چیز ایک منٹ میں دکھائے گا۔', en: 'Assalamu alaikum! This short guide shows you everything in Fahmul Quraan in a minute.' }],
  ['#btnMenu', { ru: 'Surahs aur paaron ki list — kisi bhi surah ya paare par seedha jayein.', ur: 'سورتوں اور پاروں کی فہرست — کسی بھی سورت یا پارے پر سیدھا جائیں۔', en: 'List of surahs and juz — jump straight to any surah or juz.' }],
  ['#btnFind', { ru: 'Talaash: mauzu (jaise hajj, nikah), lafz, tarjuma ya 2:255 jaisa number likhein. Har nateeje par padhna, qirat, tarjuma sunna aur tafseer hai.', ur: 'تلاش: موضوع (جیسے حج، نکاح)، لفظ، ترجمہ یا ۲:۲۵۵ جیسا نمبر لکھیں۔ ہر نتیجے پر پڑھنا، قراءت، ترجمہ سننا اور تفسیر ہے۔', en: 'Search: type a topic (hajj, marriage), a word, a translation or a number like 2:255. Each result lets you read, listen, hear the translation and open tafseer.' }],
  ['#btnLang', { ru: 'Zubaan badlein: Urdu, Roman Urdu ya English.', ur: 'زبان بدلیں: اردو، رومن اردو یا انگریزی۔', en: 'Change the language: Urdu, Roman Urdu or English.' }],
  ['#btnTheme', { ru: 'Dark aur light theme.', ur: 'ڈارک اور لائٹ تھیم۔', en: 'Dark and light theme.' }],
  ['#btnRead', { ru: 'Reading mode: asli 15 ya 13 line ka Quran, har line ke neeche tarjuma, Hafiz mode aur bookmark.', ur: 'ریڈنگ موڈ: اصل ۱۵ یا ۱۳ لائن کا قرآن، ہر لائن کے نیچے ترجمہ، حافظ موڈ اور بک مارک۔', en: 'Reading mode: the real 15 or 13-line Quran, translation under every line, Hafiz mode and bookmarks.' }],
  ['#btnSet', { ru: 'Settings: qari, tarjuma, maslak, aawazein — aur yahin "Guide" dobara chalane ka button bhi hai.', ur: 'سیٹنگز: قاری، ترجمہ، مسلک، آوازیں — اور یہیں "گائیڈ" دوبارہ چلانے کا بٹن بھی ہے۔', en: 'Settings: reciter, translation, school, sounds — and the button to replay this guide.' }],
  ['#words', { ru: 'Ayat ke alfaaz. Kisi lafz ko dabayein — us ka matlab, root aur aawaz neeche aa jayegi.', ur: 'آیت کے الفاظ۔ کسی لفظ کو دبائیں — اس کا مطلب، روٹ اور آواز نیچے آ جائے گی۔', en: 'The words of the ayah. Tap any word to see its meaning, root and hear it.' }],
  ['#stage', { ru: 'Har lafz ki animation. Is par dabayein to poori screen par "Lafz ki tafseel", root map aur maujizat milenge.', ur: 'ہر لفظ کی اینیمیشن۔ اس پر دبائیں تو پوری اسکرین پر "لفظ کی تفصیل"، روٹ میپ اور معجزات ملیں گے۔', en: 'Each word animated. Tap it for full screen with word details, the root map and its marvels.' }],
  ['#story', { ru: 'Ayat ki kahani: har lafz ka apna asli jaisa manzar, aur har harf ke saath camera aage badhta hai. Daayein-baayein swipe se agli/pichhli ayat.', ur: 'آیت کی کہانی: ہر لفظ کا اپنا حقیقی منظر، اور ہر حرف کے ساتھ کیمرہ آگے بڑھتا ہے۔ دائیں بائیں سوائپ سے اگلی/پچھلی آیت۔', en: "The ayah's story: every word gets its own realistic scene, and the camera moves on with every letter. Swipe left/right for the next/previous ayah." }],
  ['#trans', { ru: 'Aap ke chune hue alim ka tarjuma; ▶ dabane se tarjume ki aawaz.', ur: 'آپ کے چنے ہوئے عالم کا ترجمہ؛ ▶ دبانے سے ترجمے کی آواز۔', en: "Your chosen scholar's translation; ▶ plays the translation audio." }],
  ['#nz', { ru: 'Shaan-e-nuzool, pas-e-manzar aur tafseer.', ur: 'شانِ نزول، پس منظر اور تفسیر۔', en: 'Reason of revelation, background and tafseer.' }],
  ['#xtTools', { ru: 'Seekhne ke auzaar: Hifz planner (sabaq, sabqi, manzil), Root map aur bachon ka Quran quiz.', ur: 'سیکھنے کے اوزار: حفظ پلانر (سبق، سبقی، منزل)، روٹ میپ اور بچوں کا قرآن کوئز۔', en: 'Learning tools: Hifz planner (sabaq, sabqi, manzil), Root map and the kids Quran quiz.' }],
  ['#bPlay', { ru: 'Tilawat chalayein / rokein. Pichhli aur agli ayat ke button saath mein hain.', ur: 'تلاوت چلائیں / روکیں۔ پچھلی اور اگلی آیت کے بٹن ساتھ میں ہیں۔', en: 'Play / pause the recitation. Previous and next ayah buttons are beside it.' }]
];
const READER = [
  ['#rpage', { ru: 'Kisi lafz ko dabayein to wahin se tilawat. Kisi ayat ko 1 second daba kar rakhein — woh ayat tarjume ke saath poori screen par. Surah ke naam par dabane se poori surah shuru.', ur: 'کسی لفظ کو دبائیں تو وہیں سے تلاوت۔ کسی آیت کو ایک سیکنڈ دبا کر رکھیں — وہ آیت ترجمے کے ساتھ پوری اسکرین پر۔ سورت کے نام پر دبانے سے پوری سورت شروع۔', en: 'Tap a word to recite from there. Press and hold an ayah for a second to see it full screen with its translation. Tap a surah name to recite the whole surah.' }],
  ['#rLay', { ru: '15/13 line, tarjuma on/off, kis alim ka tarjuma, har ayat ke baad tarjume ki aawaz, qari aur rang — sab yahan.', ur: '۱۵/۱۳ لائن، ترجمہ آن/آف، کس عالم کا ترجمہ، ہر آیت کے بعد ترجمے کی آواز، قاری اور رنگ — سب یہاں۔', en: '15/13 lines, translation on/off, which scholar, translation voice after each ayah, reciter and colours — all here.' }],
  ['#rMic', { ru: 'Hafiz mode: aap zabani sunayein, app ghalti pakdegi aur report banayegi.', ur: 'حافظ موڈ: آپ زبانی سنائیں، ایپ غلطی پکڑے گی اور رپورٹ بنائے گی۔', en: 'Hafiz mode: recite from memory; the app catches mistakes and builds your report.' }],
  ['#rBm', { ru: 'Bookmark lagayein.', ur: 'بک مارک لگائیں۔', en: 'Add a bookmark.' }],
  ['#rList', { ru: 'Surah, paara aur safha chunein.', ur: 'سورت، پارہ اور صفحہ چنیں۔', en: 'Choose surah, juz and page.' }]
];
let box = null, i = 0, L = MAIN, key = '';
function finish() { if (box) box.remove(); box = null; try { const s = ST(); s.guide = s.guide || {}; s.guide[key] = 1; APP().save(); } catch (e) { } }
function show() {
  const u = UI(), b = B[u], [sel, txt] = L[i], el = sel ? $(sel) : null;
  if (sel && (!el || !el.getClientRects().length)) { if (i < L.length - 1) { i++; return show(); } return finish(); }
  if (!box) { box = document.createElement('div'); box.id = 'gd'; document.body.appendChild(box); box.addEventListener('click', e => { const a = e.target.closest('[data-g]'); if (!a) return; const k = a.dataset.g; if (k === 'x') return finish(); if (k === 'n') { if (i >= L.length - 1) return finish(); i++; show(); } if (k === 'p') { i = Math.max(0, i - 1); show(); } }); }
  if (el) { try { el.scrollIntoView({ block: 'center' }); } catch (e) { } }
  setTimeout(() => {
    if (!box) return; const r = el ? el.getBoundingClientRect() : null, vh = innerHeight, pad = 8;
    const hole = r ? `<div class="gd-h" style="left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${Math.min(r.height + pad * 2, vh * .6)}px"></div>` : '<div class="gd-h gd-none"></div>';
    const below = !r || r.top + Math.min(r.height, vh * .6) / 2 < vh / 2, top = !r ? vh * .3 : below ? Math.min(vh - 230, r.top + Math.min(r.height, vh * .6) + 18) : Math.max(12, r.top - 210);
    box.innerHTML = hole + `<div class="gd-c" style="top:${top}px" ${u === 'ur' ? 'dir="rtl"' : ''}><div class="gd-n">${i + 1} ${b.of} ${L.length}</div><p class="${u === 'ur' ? 'u' : ''}">${esc(txt[u] || txt.ru)}</p><div class="gd-b"><button data-g="x">${esc(b.skip)}</button>${i ? `<button data-g="p">${esc(b.back)}</button>` : ''}<button class="on" data-g="n">${esc(i >= L.length - 1 ? b.done : b.next)}</button></div></div>`;
  }, el ? 260 : 0);
}
function start(force, which) { key = which || 'main'; L = key === 'reader' ? READER : MAIN; try { const g = ST().guide || {}; if (!force && g[key]) return; } catch (e) { } if (box) box.remove(); box = null; i = 0; show(); }
window.FahmGuide = { start, close: finish, isOpen: () => !!box };
(window.FahmOverlays = window.FahmOverlays || []).push({ isOpen: () => !!box, close: finish });
/* first run: after the language/wudu screens are gone */
function auto() { let n = 0; const t = setInterval(() => { n++; if (n > 120) return clearInterval(t); if (window.__fahmOnbOpen && window.__fahmOnbOpen()) return; if (!window.__fahmApp || document.getElementById('splash')) return; clearInterval(t); setTimeout(() => start(false, 'main'), 900); }, 1000); }
let _au = 0; function au() { if (_au) return; _au = 1; auto(); }
window.addEventListener('fahm-ready', au); if (document.readyState === 'complete') au(); else window.addEventListener('load', au);
/* first time reading mode opens */
new MutationObserver(() => { const r = $('#reader'); if (r && !r.hidden) { try { if (!(ST().guide || {}).reader) setTimeout(() => { const rr = $('#reader'); if (rr && !rr.hidden && !box) start(false, 'reader'); }, 1500); } catch (e) { } } }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
})();
document.addEventListener('click', e => { if (e.target.closest('[data-guide]')) { const s = document.getElementById('settings'); if (s) s.hidden = true; window.FahmGuide && FahmGuide.start(true, 'main'); } });
/* reader mic label in the user's language */
(function () { const L = { ru: 'Hafiz: sunayein', ur: 'حافظ: سنائیں', en: 'Hafiz: recite' }; function set() { const t = document.querySelector('#rMic .rmic-t'); if (!t) return; let u = 'ru'; try { u = window.__fahmApp.st().ui || 'ru'; } catch (e) { } t.textContent = L[u] || L.ru; } setInterval(set, 1500); set(); })();

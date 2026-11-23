/* Fahmul Quraan — Build 32 tools: Hifz planner (sabaq / sabqi / manzil + reminder), Root map, Kids Quran quiz.
   All offline, data from the app itself. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const APP = () => window.__fahmApp, ST = () => APP().st(), SAVE = () => APP().save(), UI = () => (ST().ui === 'ur' ? 'ur' : ST().ui === 'en' ? 'en' : 'ru');
const AD = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]), NUM = n => UI() === 'ur' ? AD(n) : String(n);
const MARKS = /[ۖ-ۭ]/g, clean = s => String(s || '').replace(MARKS, '').trim();
const D = () => window.__fahm && window.__fahm.D;
const SN = n => { try { const S = D().surahs[n - 1]; return UI() === 'ur' ? S.ur.replace(/^سورۃ\s*/, '') : S.en; } catch (e) { return 'Surah ' + n; } };
const tap = () => { try { window.__sfx && __sfx.tap && __sfx.tap(); } catch (e) { } };

const TX = {
  ru: { tools: 'Seekhne ke auzaar', hifz: 'Hifz planner', hifzS: 'Sabaq · Sabqi · Manzil', root: 'Root map', rootS: 'Ek jad ke saare alfaaz', quiz: 'Bachon ka Quran quiz', quizS: 'Khel khel mein seekhein', guide: 'Guide', guideS: 'App kaise chalayein',
    close: 'Band karein', today: 'Aaj ka kaam', sabaq: 'Sabaq (naya)', sabqi: 'Sabqi (pichhle din)', manzil: 'Manzil (dohrayi)', done: 'Ho gaya', open: 'Padhein', hz: 'Hafiz mode mein sunayein', setup: 'Plan banayein', from: 'Kahan se shuru', per: 'Roz ka sabaq (ayat)', back: 'Sabqi kitne dinon ka', mz: 'Manzil roz', juz: 'para', rem: 'Yaad dihani ka waqt', save: 'Plan mehfooz karein', streak: 'din lagataar', edit: 'Plan badlein', none: 'Abhi koi plan nahin. Neeche plan banayein.', memo: 'Hifz ho chuka', remNote: 'Yaad dihani tab aati hai jab app khuli ho ya background mein chal rahi ho.', remTitle: 'Hifz ka waqt', remBody: 'Aaj ka sabaq, sabqi aur manzil baaqi hai.', hist: 'Pichhle din', ayat: 'ayat',
    rootH: 'Root map', rootPh: 'Root ke huroof likhein (jaise: ر ح م)', rootNo: 'Yeh root nahin mila', occ: 'baar', forms: 'alag shaklein', tot: 'kul', tapForm: 'Kisi shakal ko dabayein — us ki saari ayat dikhengi', goAy: 'Ayat kholein', cur: 'Is lafz ka root',
    quizH: 'Quran quiz', name: 'Tumhara naam', start: 'Shuru karein', q1: 'Is lafz ka matlab kya hai?', q2: 'Is surah ka naam kya hai?', q3: 'Yeh ayat kis surah ki hai?', q4: 'Is surah ka matlab kya hai?', right: 'Shabaash! Sahi jawab', wrong: 'Sahi jawab yeh tha:', next: 'Agla sawaal', score: 'Tumhare number', again: 'Phir khelein', lvl: 'Level', stars: 'sitare', badge: 'Naya badge mila!', badges: 'Tumhare badges', b: ['Pehla qadam', 'Lafz ka seekhne wala', 'Surah ka dost', 'Quran ka sitara', 'Chhota Hafiz'] },
  ur: { tools: 'سیکھنے کے اوزار', hifz: 'حفظ پلانر', hifzS: 'سبق · سبقی · منزل', root: 'روٹ میپ', rootS: 'ایک جڑ کے سارے الفاظ', quiz: 'بچوں کا قرآن کوئز', quizS: 'کھیل کھیل میں سیکھیں', guide: 'گائیڈ', guideS: 'ایپ کیسے چلائیں',
    close: 'بند کریں', today: 'آج کا کام', sabaq: 'سبق (نیا)', sabqi: 'سبقی (پچھلے دن)', manzil: 'منزل (دہرائی)', done: 'ہو گیا', open: 'پڑھیں', hz: 'حافظ موڈ میں سنائیں', setup: 'پلان بنائیں', from: 'کہاں سے شروع', per: 'روز کا سبق (آیات)', back: 'سبقی کتنے دنوں کا', mz: 'منزل روز', juz: 'پارہ', rem: 'یاد دہانی کا وقت', save: 'پلان محفوظ کریں', streak: 'دن لگاتار', edit: 'پلان بدلیں', none: 'ابھی کوئی پلان نہیں۔ نیچے پلان بنائیں۔', memo: 'حفظ ہو چکا', remNote: 'یاد دہانی تب آتی ہے جب ایپ کھلی ہو یا پس منظر میں چل رہی ہو۔', remTitle: 'حفظ کا وقت', remBody: 'آج کا سبق، سبقی اور منزل باقی ہے۔', hist: 'پچھلے دن', ayat: 'آیات',
    rootH: 'روٹ میپ', rootPh: 'روٹ کے حروف لکھیں (جیسے: ر ح م)', rootNo: 'یہ روٹ نہیں ملا', occ: 'بار', forms: 'الگ شکلیں', tot: 'کل', tapForm: 'کسی شکل کو دبائیں — اس کی ساری آیات دکھیں گی', goAy: 'آیت کھولیں', cur: 'اس لفظ کا روٹ',
    quizH: 'قرآن کوئز', name: 'تمہارا نام', start: 'شروع کریں', q1: 'اس لفظ کا مطلب کیا ہے؟', q2: 'اس سورت کا نام کیا ہے؟', q3: 'یہ آیت کس سورت کی ہے؟', q4: 'اس سورت کا مطلب کیا ہے؟', right: 'شاباش! صحیح جواب', wrong: 'صحیح جواب یہ تھا:', next: 'اگلا سوال', score: 'تمہارے نمبر', again: 'پھر کھیلیں', lvl: 'لیول', stars: 'ستارے', badge: 'نیا بیج ملا!', badges: 'تمہارے بیج', b: ['پہلا قدم', 'لفظ کا سیکھنے والا', 'سورت کا دوست', 'قرآن کا ستارہ', 'چھوٹا حافظ'] },
  en: { tools: 'Learning tools', hifz: 'Hifz planner', hifzS: 'Sabaq · Sabqi · Manzil', root: 'Root map', rootS: 'Every word from one root', quiz: 'Kids Quran quiz', quizS: 'Learn while playing', guide: 'Guide', guideS: 'How to use the app',
    close: 'Close', today: "Today's work", sabaq: 'Sabaq (new)', sabqi: 'Sabqi (recent days)', manzil: 'Manzil (revision)', done: 'Done', open: 'Read', hz: 'Recite in Hafiz mode', setup: 'Make a plan', from: 'Start from', per: 'Daily sabaq (ayat)', back: 'Sabqi covers how many days', mz: 'Manzil per day', juz: 'juz', rem: 'Reminder time', save: 'Save plan', streak: 'day streak', edit: 'Change plan', none: 'No plan yet. Make one below.', memo: 'Memorised', remNote: 'The reminder shows while the app is open or running in the background.', remTitle: 'Time for hifz', remBody: "Today's sabaq, sabqi and manzil are waiting.", hist: 'Past days', ayat: 'ayat',
    rootH: 'Root map', rootPh: 'Type root letters (e.g. ر ح م)', rootNo: 'Root not found', occ: 'times', forms: 'different forms', tot: 'total', tapForm: 'Tap a form to see all its ayat', goAy: 'Open ayah', cur: "This word's root",
    quizH: 'Quran quiz', name: 'Your name', start: 'Start', q1: 'What does this word mean?', q2: 'What is the name of this surah?', q3: 'Which surah is this ayah from?', q4: 'What does this surah name mean?', right: 'Well done! Correct', wrong: 'The right answer was:', next: 'Next question', score: 'Your score', again: 'Play again', lvl: 'Level', stars: 'stars', badge: 'New badge!', badges: 'Your badges', b: ['First step', 'Word learner', 'Friend of the surahs', 'Quran star', 'Little Hafiz'] }
};
const T = () => TX[UI()] || TX.ru;
const dirA = () => UI() === 'ur' ? ' dir="rtl"' : '';

/* ---------- shared overlay ---------- */
let ov = null, cur = '';
function sheet(id, title, body) {
  if (!ov) { ov = document.createElement('div'); ov.id = 'xt'; ov.hidden = true; document.body.appendChild(ov); ov.addEventListener('click', onClick); ov.addEventListener('change', onChange); ov.addEventListener('input', onInput);
    (window.FahmOverlays = window.FahmOverlays || []).push({ isOpen: () => ov && !ov.hidden, close: innerBack }); }
  cur = id; ov.className = 'x-' + id; ov.innerHTML = `<div class="xt-h"><button class="xt-x" data-x="close" aria-label="close">✕</button><b${dirA()}>${esc(title)}</b></div><div class="xt-b"${dirA()}>${body}</div>`; ov.hidden = false; document.body.classList.add('noscroll');
}
/* Build 34: the phone's back button steps back inside a tool before leaving it */
function innerBack() {
  if (!ov || ov.hidden) return;
  if (cur === 'quiz' && ov.querySelector('.kq-q, .kq-end')) { openQuiz(); return; }
  if (cur === 'hifz' && ov.querySelector('#hpS') && hp()) { openHifz(); return; }
  if (cur === 'root') { const o = $('#rmOcc'); if (o && o.innerHTML.trim()) { o.innerHTML = ''; ov.querySelector('.xt-b').scrollTop = 0; return; } }
  closeX();
}
function closeX() { if (ov) ov.hidden = true; document.body.classList.remove('noscroll'); try { window.FahmNav && FahmNav.st.length && FahmNav.st.pop()(); } catch (e) { } }
const reopen = fn => { try { window.FahmNav && FahmNav.push(fn); } catch (e) { } };

/* ---------- global ayah index ---------- */
let CNT = null; function counts() { if (CNT) return CNT; try { CNT = D().surahs.map(s => s.count); } catch (e) { CNT = []; } return CNT; }
function gi(s, a) { const c = counts(); let g = 0; for (let i = 0; i < s - 1; i++) g += c[i]; return g + a - 1; }
function sa(g) { const c = counts(); let s = 0; while (s < c.length && g >= c[s]) { g -= c[s]; s++; } return s >= c.length ? [114, 6] : [s + 1, g + 1]; }
const rng = (g0, g1) => { const [s0, a0] = sa(g0), [s1, a1] = sa(g1); return { s0, a0, s1, a1, txt: s0 === s1 ? `${SN(s0)} ${NUM(a0)}–${NUM(a1)}` : `${SN(s0)} ${NUM(a0)} → ${SN(s1)} ${NUM(a1)}` }; };
const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

/* ================= HIFZ PLANNER ================= */
function hp() { const s = ST(); s.hp = s.hp || null; return s.hp; }
function hifzToday(p) {
  const t = today(); p.days = p.days || {};
  if (!p.days[t]) { const g0 = Math.min(6235, p.pos); p.days[t] = { s0: g0, s1: Math.min(6235, g0 + p.per - 1), done: {} }; SAVE(); }
  return p.days[t];
}
function openHifz(edit) {
  tap(); const t = T(), p = hp();
  if (!p || edit) {
    const sOpt = Array.from({ length: 114 }, (_, i) => `<option value="${i + 1}" ${(p ? sa(p.pos)[0] : 78) === i + 1 ? 'selected' : ''}>${NUM(i + 1)}. ${esc(SN(i + 1))}</option>`).join('');
    sheet('hifz', t.hifz, `${p ? '' : `<p class="xt-n">${esc(t.none)}</p>`}<label class="xt-f"><span>${esc(t.from)}</span><span class="xt-r"><select id="hpS" class="sel">${sOpt}</select><input id="hpA" class="sel" type="number" min="1" value="${p ? sa(p.pos)[1] : 1}"></span></label>
      <label class="xt-f"><span>${esc(t.per)}</span><select id="hpP" class="sel">${[3, 5, 7, 10, 15, 20].map(n => `<option ${((p && p.per) || 5) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="xt-f"><span>${esc(t.back)}</span><select id="hpB" class="sel">${[3, 5, 7, 10, 15].map(n => `<option ${((p && p.back) || 7) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="xt-f"><span>${esc(t.mz)}</span><select id="hpM" class="sel">${[['0.25', '¼'], ['0.5', '½'], ['1', '1'], ['2', '2'], ['3', '3']].map(([v, l]) => `<option value="${v}" ${String((p && p.mz) || 0.5) === v ? 'selected' : ''}>${l} ${esc(t.juz)}</option>`).join('')}</select></label>
      <label class="xt-f"><span>${esc(t.rem)}</span><input id="hpR" class="sel" type="time" value="${(p && p.rem) || '05:30'}"></label><small class="xt-n">${esc(t.remNote)}</small>
      <button class="xt-go" data-x="hpsave">${esc(t.save)}</button>`); return;
  }
  const d = hifzToday(p), sab = rng(d.s0, d.s1);
  const st0 = p.start || 0, memEnd = p.pos - 1, bk = Math.max(st0, p.pos - p.per * p.back), sq = p.pos > st0 ? rng(bk, memEnd) : null;
  const mzLen = Math.max(1, Math.round(p.mz * 208)), mzFrom = Math.max(st0, p.mzPos || st0), mzTo = Math.min(bk - 1, mzFrom + mzLen - 1), mz = bk - st0 > 1 && mzTo >= mzFrom ? rng(mzFrom, mzTo) : null;
  const row = (k, lbl, r) => r ? `<div class="hp-c ${d.done[k] ? 'ok' : ''}"><div class="hp-t"><b>${esc(lbl)}</b><span>${esc(r.txt)}</span></div><div class="hp-a"><button class="po sm" data-x="hpopen" data-r="${r.s0}:${r.a0}">${esc(t.open)}</button><button class="po sm" data-x="hphz" data-r="${r.s0}:${r.a0}:${r.s1}:${r.a1}">${esc(t.hz)}</button><button class="po sm ${d.done[k] ? 'on' : ''}" data-x="hpdone" data-k="${k}">✓ ${esc(t.done)}</button></div></div>` : '';
  const streak = (() => { let n = 0; const dt = new Date(); for (let i = 0; i < 400; i++) { const k = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate(); const x = p.days[k]; if (x && x.done && x.done.sabaq) n++; else if (i) break; dt.setDate(dt.getDate() - 1); } return n; })();
  const pct = (Math.max(0, p.pos - (p.start || 0)) / 6236 * 100).toFixed(1);
  const hist = Object.keys(p.days).slice(-14).reverse().map(k => { const x = p.days[k], n = ['sabaq', 'sabqi', 'manzil'].filter(z => x.done && x.done[z]).length; return `<i class="hp-h l${n}" title="${k}"></i>`; }).join('');
  sheet('hifz', t.hifz, `<div class="hp-top"><div class="hp-ring" style="--p:${pct}"><b>${UI() === 'ur' ? AD(pct) : pct}%</b><small>${esc(t.memo)}</small></div><div class="hp-st"><b>🔥 ${NUM(streak)}</b><small>${esc(t.streak)}</small></div></div>
    <h4>${esc(t.today)}</h4>${row('sabaq', t.sabaq, sab)}${row('sabqi', t.sabqi, sq)}${row('manzil', t.manzil, mz)}
    <h4>${esc(t.hist)}</h4><div class="hp-hist">${hist}</div><button class="xt-alt" data-x="hpedit">${esc(t.edit)}</button>`);
}
function hpCheckReminder() {
  const p = hp(); if (!p || !p.rem) return; const [h, m] = p.rem.split(':').map(Number), n = new Date(), t = today();
  if (p.remDone === t || n.getHours() * 60 + n.getMinutes() < h * 60 + m) return; const d = p.days && p.days[t]; if (d && d.done && d.done.sabaq && d.done.sabqi && d.done.manzil) return;
  p.remDone = t; SAVE(); const tt = T();
  try { if ('Notification' in window && Notification.permission === 'granted') new Notification(tt.remTitle, { body: tt.remBody, icon: 'icons/icon-192.png' }); } catch (e) { }
  const b = document.createElement('div'); b.className = 'hp-rem'; b.innerHTML = `<b>⏰ ${esc(tt.remTitle)}</b><span>${esc(tt.remBody)}</span><button data-hpo="1">${esc(tt.open)}</button>`; document.body.appendChild(b); b.addEventListener('click', e => { if (e.target.closest('[data-hpo]')) openHifz(); b.remove(); }); setTimeout(() => b.remove(), 15000);
}
setInterval(hpCheckReminder, 60000); setTimeout(hpCheckReminder, 8000);

/* ================= ROOT MAP ================= */
let RM = null; const rmLoad = () => RM ? Promise.resolve(RM) : fetch('q/rmap.json').then(r => r.json()).then(j => (RM = j));
function openRoot(root) {
  tap(); const t = T(); sheet('root', t.rootH, `<div class="rm-in"><input id="rmQ" class="sel" dir="rtl" placeholder="ر ح م" value="${esc(root ? [...root].join(' ') : '')}"></div><div id="rmBody"><p class="xt-n">…</p></div>`);
  rmLoad().then(() => rmShow(root || (() => { try { return window.__fahm && __fahm.D && (() => { const st = ST(), S = D().surahs[st.s]; return S.ayat[st.a].words[st.w].root; })(); } catch (e) { return ''; } })()));
}
function rmShow(root) {
  const t = T(), box = $('#rmBody'); if (!box) return; root = String(root || '').replace(/[^ء-ي]/g, '');
  const E = RM && RM[root]; if (!E) { const pop = ['رحم', 'علم', 'كتب', 'صلو', 'سجد', 'نور', 'هدي', 'صبر', 'شكر', 'جنن', 'خلق', 'ذكر'].filter(r => RM && RM[r]); box.innerHTML = `<p class="xt-n">${esc(root ? t.rootNo : t.rootPh).replace(/([ء-ي](?:\s[ء-ي])+)/g, '<bdi dir="rtl">$1</bdi>')}</p><div class="rm-pop">${pop.map(r => `<button class="rm-pc ar" dir="rtl" data-x="rmpick" data-r="${r}">${[...r].join(' ')}</button>`).join('')}</div>`; return; }
  const f = E.f, tot = E.o.length, top = f.map((x, i) => [x, i]).sort((a, b) => b[0][4] - a[0][4]).slice(0, 24), mx = Math.max(...f.map(x => x[4])), N = top.length, W = 360, H = 360, cx = W / 2, cy = H / 2;
  const mean = x => UI() === 'ur' ? x[2] : UI() === 'en' ? x[1] : x[3];
  const nodes = top.map(([x, oi], i) => { const ring = N > 12 ? (i % 2 ? 1 : 0) : 0, R = 108 + ring * 50, a = -Math.PI / 2 + i / N * Math.PI * 2, r = 10 + 14 * Math.sqrt(x[4] / mx); return { i: oi, k: i, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, r, d: x }; });
  const svg = `<svg class="rm-svg" viewBox="0 0 ${W} ${H}">${nodes.map(n => `<line x1="${cx}" y1="${cy}" x2="${n.x.toFixed(1)}" y2="${n.y.toFixed(1)}" style="animation-delay:${(n.k * 0.04).toFixed(2)}s"/>`).join('')}
    <circle class="rm-core" cx="${cx}" cy="${cy}" r="44"/><text class="rm-ct" x="${cx}" y="${cy + 8}" text-anchor="middle">${esc([...root].join(' '))}</text>
    ${nodes.map(n => `<g class="rm-n" data-x="rmf" data-i="${n.i}" style="animation-delay:${(0.2 + n.k * 0.04).toFixed(2)}s"><circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}"/><text x="${n.x.toFixed(1)}" y="${(n.y + 4).toFixed(1)}" text-anchor="middle">${esc(clean(n.d[0]))}</text></g>`).join('')}</svg>`;
  box.innerHTML = `<div class="rm-sum"><b>${esc([...root].join('-'))}</b> · ${NUM(tot)} ${esc(t.tot)} · ${NUM(f.length)} ${esc(t.forms)}</div>${svg}<p class="xt-n">${esc(t.tapForm)}</p><div class="rm-list">${f.map((x, i) => `<button class="rm-f" data-x="rmf" data-i="${i}"><b class="ar">${esc(clean(x[0]))}</b><span>${esc(mean(x))}</span><em>${NUM(x[4])} ${esc(t.occ)}</em></button>`).join('')}</div><div id="rmOcc"></div>`;
  box.dataset.root = root;
}
function rmForm(i) {
  const t = T(), box = $('#rmBody'), root = box.dataset.root, E = RM[root], x = E.f[i], occ = E.o.filter(o => o[3] === +i).slice(0, 80);
  $('#rmOcc').innerHTML = `<h4><span class="ar">${esc(clean(x[0]))}</span> — ${NUM(x[4])} ${esc(t.occ)}</h4>` + occ.map(o => `<button class="rm-o" data-x="rmgo" data-r="${o[0]}:${o[1]}:${o[2]}"><b>${esc(SN(o[0]))} ${NUM(o[0])}:${NUM(o[1])}</b><span>${esc(t.goAy)} ›</span></button>`).join('');
  try { $('#rmOcc').scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { }
}

/* ================= KIDS QUIZ ================= */
let QW = null, qz = null; const qwLoad = () => QW ? Promise.resolve(QW) : fetch('q/quizw.json').then(r => r.json()).then(j => (QW = j));
const shuf = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function kq() { const s = ST(); s.kq = s.kq || { name: '', best: 0, played: 0, stars: 0, badges: [] }; return s.kq; }
function openQuiz() { try { if (UI() === 'ru' && window.FahmConv && !FahmConv.ok()) FahmConv.load(); } catch (e) { }
  tap(); const t = T(), k = kq();
  sheet('quiz', t.quizH, `<div class="kq-hero">🌙⭐📖</div><label class="xt-f"><span>${esc(t.name)}</span><input id="kqN" class="sel" value="${esc(k.name)}" maxlength="24"></label><button class="xt-go" data-x="kqstart">${esc(t.start)} ▶</button>
    <h4>${esc(t.badges)}</h4><div class="kq-bad">${t.b.map((b, i) => `<span class="${k.badges.includes(i) ? 'on' : ''}">${['🥇', '📘', '🕌', '🌟', '👑'][i]}<small>${esc(b)}</small></span>`).join('')}</div><p class="xt-n">⭐ ${NUM(k.stars)} ${esc(t.stars)}</p>`);
}
function surahsOk() { try { return D().surahs.length === 114; } catch (e) { return false; } }
async function qMake() {
  await qwLoad(); const t = T(), u = UI(), kind = Math.floor(Math.random() * (surahsOk() ? 4 : 1));
  const mean = x => u === 'ur' ? x[1] : u === 'en' ? x[3] : x[2];
  if (kind === 0) { // word meaning (from the most common words of the Quran)
    const pool = QW.slice(0, 160 + Math.min(240, qz.lvl * 40)), ans = pool[Math.floor(Math.random() * pool.length)], seen = new Set([mean(ans)]), opts = [ans];
    while (opts.length < 4) { const o = QW[Math.floor(Math.random() * QW.length)]; if (!seen.has(mean(o))) { seen.add(mean(o)); opts.push(o); } }
    return { q: t.q1, big: clean(ans[0]), opts: shuf(opts.map(o => mean(o))), ok: mean(ans) };
  }
  const S = D().surahs, juzAmma = S.slice(77), pick = (kind === 3 || qz.lvl < 3 ? juzAmma : S)[Math.floor(Math.random() * (kind === 3 || qz.lvl < 3 ? juzAmma.length : 114))];
  const nm = s => u === 'ur' ? s.ur.replace(/^سورۃ\s*/, '') : s.en, mn = s => { if (u === 'ur') return s.meanUr || s.mean; if (u === 'ru' && s.meanUr && window.FahmConv && FahmConv.ok()) { const r = FahmConv.roman(s.meanUr); return r.charAt(0).toUpperCase() + r.slice(1); } return s.mean; };
  const others = n => { const o = new Set([n(pick)]); const out = [n(pick)]; while (out.length < 4) { const x = S[Math.floor(Math.random() * 114)]; if (!o.has(n(x))) { o.add(n(x)); out.push(n(x)); } } return shuf(out); };
  if (kind === 1) return { q: t.q2, big: u === 'ur' ? `${AD(pick.n)} — ${mn(pick)}` : `${pick.n} — ${mn(pick)}`, opts: others(nm), ok: nm(pick) };
  if (kind === 3) return { q: t.q4, big: nm(pick), opts: others(mn), ok: mn(pick) };
  // which surah is this ayah from (first ayah of a short surah)
  try { await window.FahmData.load(pick.n - 1, ST().tl || ['rur']); } catch (e) { }
  const A = pick.ayat && pick.ayat[0]; const txt = A && A.words ? A.words.map(w => w.ar).join(' ') : '';
  if (!txt) return { q: t.q2, big: mn(pick), opts: others(nm), ok: nm(pick) };
  return { q: t.q3, big: txt, opts: others(nm), ok: nm(pick), ayah: 1 };
}
async function qNext() {
  const t = T(); if (qz.n >= 10) return qEnd(); qz.n++; const Q = await qMake(); qz.Q = Q;
  const b = ov.querySelector('.xt-b'); b.innerHTML = `<div class="kq-top"><span>${esc(t.lvl)} ${NUM(qz.lvl)}</span><span>${NUM(qz.n)} / ${NUM(10)}</span><span>⭐ ${NUM(qz.score)}</span></div>
    <p class="kq-q">${esc(Q.q)}</p><div class="kq-big ${Q.ayah ? 'ay' : ''} ar" dir="rtl">${esc(Q.big)}</div><div class="kq-opts">${Q.opts.map(o => `<button class="kq-o" data-x="kqans" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="kq-fb"></div>`;
}
function qAns(btn) {
  const t = T(), Q = qz.Q; if (Q.answered) return; Q.answered = 1; const ok = btn.dataset.v === Q.ok;
  ov.querySelectorAll('.kq-o').forEach(b => { if (b.dataset.v === Q.ok) b.classList.add('ok'); else if (b === btn) b.classList.add('no'); b.disabled = true; });
  if (ok) { qz.score++; qz.streak++; if (qz.streak % 3 === 0) qz.lvl++; try { __sfx && __sfx.ding && __sfx.ding(); } catch (e) { } confetti(); } else { qz.streak = 0; try { __sfx && __sfx.back && __sfx.back(); } catch (e) { } }
  ov.querySelector('.kq-fb').innerHTML = `<p class="${ok ? 'g' : 'r'}">${ok ? '🎉 ' + esc(t.right) + (kq().name ? ', ' + esc(kq().name) : '') + '!' : esc(t.wrong) + ' <b>' + esc(Q.ok) + '</b>'}</p><button class="xt-go" data-x="kqnext">${esc(t.next)} ›</button>`;
}
function qEnd() {
  const t = T(), k = kq(); k.played++; k.stars += qz.score; k.best = Math.max(k.best, qz.score); const nb = [];
  const award = (i, c) => { if (c && !k.badges.includes(i)) { k.badges.push(i); nb.push(i); } };
  award(0, true); award(1, k.stars >= 20); award(2, k.played >= 5); award(3, qz.score >= 9); award(4, k.stars >= 100); SAVE();
  ov.querySelector('.xt-b').innerHTML = `<div class="kq-end"><div class="kq-hero">${qz.score >= 8 ? '🏆' : qz.score >= 5 ? '🌟' : '📖'}</div><h3>${esc(t.score)}: ${NUM(qz.score)} / ${NUM(10)}</h3>${nb.length ? `<p class="g">${esc(t.badge)} ${nb.map(i => ['🥇', '📘', '🕌', '🌟', '👑'][i] + ' ' + esc(t.b[i])).join(' · ')}</p>` : ''}<button class="xt-go" data-x="kqstart">${esc(t.again)} ↻</button></div>`;
  if (qz.score >= 5) confetti();
}
function confetti() { const c = document.createElement('div'); c.className = 'kq-cf'; c.innerHTML = Array.from({ length: 26 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${['#dcab40', '#33cbe0', '#e0587a', '#57e0b4', '#f3d98b'][i % 5]};animation-delay:${(Math.random() * .3).toFixed(2)}s"></i>`).join(''); document.body.appendChild(c); setTimeout(() => c.remove(), 1800); }

/* ---------- events ---------- */
function onClick(e) {
  const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x, t = T();
  if (x === 'close') { closeX(); return; }
  if (x === 'hpsave') { const s = +$('#hpS').value, a = Math.max(1, Math.min(counts()[s - 1] || 1, +$('#hpA').value || 1)), p = hp() || { days: {} }; const g = gi(s, a); if (p.start == null || p.start > g || g !== p.pos) p.start = g; Object.assign(p, { pos: g, per: +$('#hpP').value, back: +$('#hpB').value, mz: +$('#hpM').value, rem: $('#hpR').value, mzPos: p.mzPos || 0 }); ST().hp = p; SAVE(); try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (er) { } const d = p.days[today()]; if (d && !d.done.sabaq) delete p.days[today()]; openHifz(); return; }
  if (x === 'hpedit') { openHifz(true); return; }
  if (x === 'hpdone') { const p = hp(), d = hifzToday(p), k = b.dataset.k; d.done[k] = !d.done[k]; if (k === 'sabaq') { if (d.done[k]) p.pos = Math.max(p.pos, d.s1 + 1); else p.pos = Math.min(p.pos, d.s0); } if (k === 'manzil' && d.done[k]) { const s0 = p.start || 0, bk = Math.max(s0, p.pos - p.per * p.back); p.mzPos = Math.max(s0, p.mzPos || s0) + Math.round(p.mz * 208); if (p.mzPos >= bk) p.mzPos = s0; } SAVE(); try { __sfx && __sfx.ding && __sfx.ding(); } catch (er) { } openHifz(); return; }
  if (x === 'hpopen' || x === 'hphz') { const r = b.dataset.r.split(':').map(Number); ov.hidden = true; document.body.classList.remove('noscroll'); reopen(() => openHifz()); try { if (x === 'hphz') window.FahmReader.hafizRange(r[0], r[1], r[2], r[3]); else window.FahmReader.openHl(r[0], r[1]); } catch (er) { } return; }
  if (x === 'rmf') { rmForm(b.dataset.i); return; }
  if (x === 'rmpick') { const q = $('#rmQ'); if (q) q.value = [...b.dataset.r].join(' '); rmShow(b.dataset.r); return; }
  if (x === 'rmgo') { const [s, a, w] = b.dataset.r.split(':').map(Number); const root = $('#rmBody').dataset.root; ov.hidden = true; document.body.classList.remove('noscroll'); reopen(() => openRoot(root)); try { window.__fahm.goTo(s - 1, a - 1, w - 1); } catch (er) { } return; }
  if (x === 'kqstart') { const n = $('#kqN'); if (n) { kq().name = n.value.trim(); SAVE(); } qz = { n: 0, score: 0, lvl: 1, streak: 0 }; qNext(); return; }
  if (x === 'kqans') { qAns(b); return; }
  if (x === 'kqnext') { qNext(); return; }
}
function onChange() { }
let rmT = 0; function onInput(e) { if (e.target.id === 'rmQ') { clearTimeout(rmT); rmT = setTimeout(() => rmLoad().then(() => rmShow(e.target.value)), 300); } }

/* ---------- entry tiles on the main screen ---------- */
function mount() {
  const m = document.getElementById('bMushaf'); if (!m || document.getElementById('xtTools')) return;
  const w = document.createElement('div'); w.id = 'xtTools'; m.after(w); paint();
}
function paint() {
  const w = document.getElementById('xtTools'); if (!w || !window.__fahmApp) return; const t = T();
  w.innerHTML = `<h5${dirA()}>${esc(t.tools)}</h5><div class="xt-g">${[['hifz', '📅', t.hifz, t.hifzS], ['root', '🌳', t.root, t.rootS], ['quiz', '🎈', t.quiz, t.quizS], ['guide', '🧭', t.guide, t.guideS]].map(([k, i, a, s]) => `<button class="xt-tile" data-xt="${k}"><span class="xi">${i}</span><b>${esc(a)}</b><small>${esc(s)}</small></button>`).join('')}</div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-xt]'); if (!b) return; const k = b.dataset.xt;
  if (k === 'hifz') openHifz(); else if (k === 'root') openRoot(); else if (k === 'quiz') openQuiz(); else if (k === 'guide') { try { window.FahmGuide && FahmGuide.start(true); } catch (er) { } }
});
window.addEventListener('fahm-ready', () => { mount(); setInterval(() => { const w = document.getElementById('xtTools'); if (w && w.dataset.ui !== ST().ui) { w.dataset.ui = ST().ui; paint(); } }, 800); });
if (window.__fahmApp) mount();
window.FahmTools = { hifz: openHifz, root: openRoot, quiz: openQuiz, _gi: gi, _sa: sa };
})();
document.addEventListener('click', e => { const b = e.target.closest('[data-rmap]'); if (b && window.FahmTools) { e.stopPropagation(); FahmTools.root(b.dataset.rmap); } }, true);
/* Build 33: tapping the ayah anywhere on the main screen (ayah number, story caption, translation text) recites it */
document.addEventListener('click', e => {
  const t = e.target; if (!t || !t.closest) return;
  if (t.closest('button, a, input, select, [data-rmap]')) return;
  const hit = t.closest('#ayahNo, #cx, #trans .tr, #trans p, #trans .tx, #trans');
  if (!hit || !hit.closest('#main')) return;
  try { const F = window.__fahm; F.goTo(F.st.s, F.st.a, 0, true, true); } catch (er) { }
});

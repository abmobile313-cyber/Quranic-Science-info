/* Fahm — Mushaf page reader (15-line / 13-line Hafizi IndoPak) + Hafiz live-recitation mode.
   Text + font: DigitalKhatt IndoPak (OFL). Line layouts: Qudratullah 15 & 13 line, Taj 13 line. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(3, '0');
const H = window.FahmHafiz;
let A = null, M = null, loading = null;
let open = false, lay = '15', pi = 0, PG = [], LP = {}, SC = [], AY = [], AYI = {}, STARTS = {}, okSet = new Set();
let curAy = null, hot = null, playing = false, seqOn = false, tickT = null, rev = null;
let hz = { plan: null, cur: null, all: [], busyAt: 0, fi: 0, ti: 0, daur: 1, on: false, busy: false, tr: null, want: false, lastAct: 0, sil: null, proc: {}, prev: null, sess: 0, startedAt: 0, native: false, sr: null };

const RS = {
  ur: { lay15: '۱۵ لائن (حافظی)', lay13q: '۱۳ لائن · قدرت اللہ', lay13t: '۱۳ لائن · تاج', pg: 'صفحہ', hafiz: 'حافظ موڈ', look: 'دیکھ کر', mem: 'یاد سے', sens: 'سخت گیری', sS: 'سخت', sN: 'درمیانی', sR: 'نرم', sil: 'خاموشی کے بعد لقمہ', sec: 'سیکنڈ', listen: 'سن رہا ہوں… پڑھیے', wrong: 'غلطی! آیت دوبارہ سنیے', luq: 'لقمہ — آیت سنیے', done: 'ماشاء اللہ! مکمل', noRec: 'اس براؤزر میں آواز پہچاننا موجود نہیں۔ کروم یا اینڈرائیڈ ایپ استعمال کیجیے۔', mic: 'مائیک کی اجازت نہیں ملی۔', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔', tap: 'کسی آیت پر ٹیپ کریں — وہیں سے شروع', audioErr: 'آڈیو نہیں چلی (انٹرنیٹ دیکھیں)', settings: 'ترتیب', layout: 'قرآن کی ترتیب', stop: 'رکیں', start: 'شروع', from: 'یہاں سے شروع', first: 'پہلا حصہ', page: 'صفحہ' },
  ru: { lay15: '15 Line (Hafizi)', lay13q: '13 Line · Qudratullah', lay13t: '13 Line · Taj', pg: 'Safha', hafiz: 'Hafiz Mode', look: 'Dekh kar', mem: 'Yaad se', sens: 'Sakhti', sS: 'Sakht', sN: 'Darmiyani', sR: 'Narm', sil: 'Khamoshi ke baad lukma', sec: 'second', listen: 'Sun raha hoon… padhiye', wrong: 'Galti! Ayat dobara suniye', luq: 'Lukma — ayat suniye', done: 'MashaAllah! Mukammal', noRec: 'Is browser mein awaaz pehchanna maujood nahin. Chrome ya Android app istemal karein.', mic: 'Mic ki ijazat nahin mili.', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin).', tap: 'Kisi ayat par tap karein — wahin se shuru', audioErr: 'Audio nahin chali (internet dekhein)', settings: 'Settings', layout: 'Quran ka format', stop: 'Rukein', start: 'Shuru', from: 'Yahan se shuru', first: 'Pehla hissa', page: 'Safha' },
  en: { lay15: '15-Line (Hafizi)', lay13q: '13-Line · Qudratullah', lay13t: '13-Line · Taj', pg: 'Page', hafiz: 'Hafiz Mode', look: 'Looking', mem: 'From memory', sens: 'Strictness', sS: 'Strict', sN: 'Normal', sR: 'Relaxed', sil: 'Prompt after silence', sec: 'sec', listen: 'Listening… recite', wrong: 'Mistake! Listen to the ayah', luq: 'Prompt — listen to the ayah', done: 'MashaAllah! Complete', noRec: 'Speech recognition is not available here. Use Chrome or the Android app.', mic: 'Microphone permission was not granted.', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed).', tap: 'Tap any ayah to start from there', audioErr: 'Audio failed (check internet)', settings: 'Settings', layout: 'Mushaf layout', stop: 'Stop', start: 'Start', from: 'Start here', first: 'First part', page: 'Page' }
};

Object.assign(RS.ur, { goto: 'کہاں جانا ہے', surahL: 'سورت', juzL: 'پارہ', go: 'جائیں', pickJuz: 'پارہ چنیں', target: 'روزانہ ہدف', resume: 'جہاں چھوڑا تھا وہیں سے', from: 'کہاں سے', to: 'کہاں تک', reps: 'کتنے دَور', quick: 'جلدی چنیں', qFat: 'فاتحہ', qJuz: 'پارہ', qAll: 'پورا قرآن', history: 'پچھلی رپورٹیں', daur: 'دَور', kWrong: 'لفظ بدلا', kSkip: 'لفظ چھوٹا', kJump: 'آیت بدلی', clean: 'درست آیات', hard: 'سخت غلطی', stall: 'اٹکا', doubt: 'شک', time: 'وقت', wpm: 'لفظ/منٹ', atka: 'یہاں اٹکے', secHard: 'سخت غلطیاں اور ان کا اثر', secStall: 'کہاں کہاں اٹکے (لقمہ)', secDoubt: 'شک والی جگہیں', doubtNote: 'یہاں ریکارڈر نے صاف نہیں سنا یا چھوٹا لفظ ہلکا چھوٹا؛ بہاؤ نہیں توڑا گیا، دوبارہ دیکھ لیں۔', secOk: 'کیا درست رہا', daurRep: 'دَور کی رپورٹ', ask: 'کیا آپ نے یہ ساری غلطیاں نوٹ کر لیں؟ کیا الگ دَور شروع کریں؟', noteNext: 'نوٹ کر لیں — اگلا دَور', noteFinal: 'نوٹ کر لیں — آخری رپورٹ', again: 'اسی دَور کو دوبارہ', stopFinal: 'رکیں — آخری رپورٹ دکھائیں', finalRep: 'آخری رپورٹ', copy: 'رپورٹ کاپی کریں', newPlan: 'نیا ہدف / دَور', close: 'بند کریں', daurs: 'دَور', avgClean: 'اوسط درست', trend: 'پہلے سے آخری دَور', secRange: 'ہدف', secPer: 'ہر دَور', secRep: 'بار بار کی غلطیاں', secImpact: 'غلطیوں سے ترجمے/معنی کا نقصان', secOkAll: 'ہر دَور میں درست رہی آیات', limits: 'نوٹ: غلطی صرف الفاظ کی سطح پر پکڑی جاتی ہے؛ زبر/زیر/تجوید کی پہچان ریکارڈر نہیں کر سکتا۔', times: 'بار', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔ حافظ موڈ صرف سخت غلطی (آیت بدلنا، لمبا چھوٹنا) پر روکتا ہے۔', sS: 'سخت', sN: 'درمیانی', sH: 'حافظ (تیز رفتار)' });
Object.assign(RS.ru, { goto: 'Kahan jana hai', surahL: 'Surah', juzL: 'Para', go: 'Jayein', pickJuz: 'Para chunein', target: 'Rozana target', resume: 'Jahan chhoda tha wahin se', from: 'Kahan se', to: 'Kahan tak', reps: 'Kitne daur', quick: 'Jaldi chunein', qFat: 'Fatiha', qJuz: 'Para', qAll: 'Poora Quran', history: 'Pichhli reports', daur: 'Daur', kWrong: 'Lafz badla', kSkip: 'Lafz chhoota', kJump: 'Ayat badli', clean: 'Durust ayat', hard: 'Sakht galti', stall: 'Atke', doubt: 'Shak', time: 'Waqt', wpm: 'lafz/min', atka: 'Yahan atke', secHard: 'Sakht galtiyan aur unka asar', secStall: 'Kahan kahan atke (lukma)', secDoubt: 'Shak wali jagahein', doubtNote: 'Yahan recogniser ne saaf nahin suna ya chhota lafz halka chhoota; rawani nahin todi gayi, dobara dekh lein.', secOk: 'Kya durust raha', daurRep: 'Daur ki report', ask: 'Kya aapne yeh saari galtiyan note kar li? Kya alag daur shuru karein?', noteNext: 'Note kar li — agla daur', noteFinal: 'Note kar li — final report', again: 'Isi daur ko dobara', stopFinal: 'Rukein — final report dikhayein', finalRep: 'Final report', copy: 'Report copy karein', newPlan: 'Naya target / daur', close: 'Band karein', daurs: 'Daur', avgClean: 'Ausat durust', trend: 'Pehle se aakhri daur', secRange: 'Target', secPer: 'Har daur', secRep: 'Baar baar ki galtiyan', secImpact: 'Galtiyon se tarjme/matlab ka nuksan', secOkAll: 'Har daur mein durust rahi ayat', limits: 'Note: galti sirf alfaaz ki satah par pakdi jaati hai; zabar/zer/tajweed ki pehchan recogniser nahin kar sakta.', times: 'baar', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin). Hafiz mode sirf sakht galti (ayat badalna, lamba chhootna) par rokta hai.', sS: 'Sakht', sN: 'Darmiyani', sH: 'Hafiz (tez raftar)' });
Object.assign(RS.en, { goto: 'Go to', surahL: 'Surah', juzL: 'Juz (Para)', go: 'Go', pickJuz: 'Pick a Juz', target: 'Daily target', resume: 'Continue where you left off', from: 'From', to: 'To', reps: 'Number of rounds', quick: 'Quick pick', qFat: 'Fatiha', qJuz: 'Para (Juz)', qAll: 'Whole Quran', history: 'Past reports', daur: 'Round', kWrong: 'Word changed', kSkip: 'Word skipped', kJump: 'Ayah changed', clean: 'Clean ayat', hard: 'Hard mistakes', stall: 'Stalls', doubt: 'Doubts', time: 'Time', wpm: 'words/min', atka: 'Stalled here', secHard: 'Hard mistakes and their effect', secStall: 'Where you stalled (prompt)', secDoubt: 'Doubtful spots', doubtNote: 'The recogniser did not hear these clearly or a small word slipped; the flow was not interrupted — please recheck.', secOk: 'What went right', daurRep: 'Round report', ask: 'Did you note all these mistakes? Start another round?', noteNext: 'Noted — next round', noteFinal: 'Noted — final report', again: 'Repeat this round', stopFinal: 'Stop — show final report', finalRep: 'Final report', copy: 'Copy report', newPlan: 'New target / rounds', close: 'Close', daurs: 'Rounds', avgClean: 'Avg clean', trend: 'First to last round', secRange: 'Target', secPer: 'Each round', secRep: 'Repeated mistakes', secImpact: 'Loss to translation / meaning', secOkAll: 'Ayat clean in every round', limits: 'Note: mistakes are caught at word level only; zabar/zer/tajweed cannot be detected by the recogniser.', times: 'times', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed). Hafiz mode interrupts only for hard mistakes (changed ayah, long skip).', sS: 'Strict', sN: 'Normal', sH: 'Hafiz (fast pace)' });
Object.assign(RS.ru, { wrongF: 'Galti note ho gayi — padhte rahein', flowL: 'Rawani', flowOn: 'Bina roke (beep + note)', flowOff: 'Ustad (ruk kar sunaye)', tickL: 'Chhoti galti par tik', on: 'On', off: 'Off', recL: 'Meri awaaz record (taqabul ke liye, tajurba)', cQari: 'Qari', cMine: 'Meri awaaz', noRecYet: 'Is jagah ki recording nahin mili (record On karke naya daur shuru karein).', secHk: 'Harkaat ki jaanch-list (mushaf se khud tasdeeq karein)', hkNote: 'Mic harkat nahin sunta. In lafzon par zabar/zer/pesh/shadda badalne se maani badal jate hain. ⚠ = is ayat mein aaj shak/galti bhi thi. Qari button se sahi tilawat sunkar milayein.' });
Object.assign(RS.en, { wrongF: 'Mistake noted — keep going', flowL: 'Flow', flowOn: 'No stopping (beep + note)', flowOff: 'Ustad (stops and recites)', tickL: 'Tick on small slips', on: 'On', off: 'Off', recL: 'Record my voice (to compare, experimental)', cQari: 'Qari', cMine: 'My voice', noRecYet: 'No recording for this spot (turn recording On and start a new round).', secHk: 'Harakat check-list (verify against the mushaf)', hkNote: 'The mic cannot hear harakat. For these words a wrong fatha/kasra/damma/shadda changes the meaning. ⚠ = this ayah also had a doubt/mistake today. Play the qari and compare.' });
Object.assign(RS.ur, { wrongF: 'غلطی نوٹ ہو گئی — پڑھتے رہیں', flowL: 'روانی', flowOn: 'بغیر روکے (بیپ + نوٹ)', flowOff: 'استاد (رک کر سنائے)', tickL: 'چھوٹی غلطی پر ٹِک', on: 'آن', off: 'آف', recL: 'میری آواز ریکارڈ (موازنے کے لیے، تجرباتی)', cQari: 'قاری', cMine: 'میری آواز', noRecYet: 'اس جگہ کی ریکارڈنگ نہیں ملی۔', secHk: 'حرکات کی جانچ فہرست (مصحف سے خود تصدیق کریں)', hkNote: 'مائیک حرکات نہیں سنتا۔ ان الفاظ پر زبر/زیر/پیش/شدّ بدلنے سے معنی بدل جاتے ہیں۔ ⚠ = اس آیت میں آج شک/غلطی بھی تھی۔ قاری سے سن کر ملائیں۔' });
Object.assign(RS.ur, { amt: 'کتنا حصہ', aq: 'چوتھائی پارہ', ah: 'آدھا پارہ', at: 'پون پارہ', a1: 'ایک پارہ', as: 'سوا پارہ', ad: 'ڈیڑھ پارہ', a2: 'دو پارے', fromPara: 'پارے کے آغاز سے', ayW: 'آیات', paraW: 'پارہ', fastL: 'غلطی بتانے والا تیز قاری', fastNote: 'غلطی یا لقمے پر یہ قاری تیز آواز میں آیت سناتا ہے تاکہ آپ کی روانی نہ ٹوٹے۔', rateL: 'قاری کی رفتار', myBtn: 'اپنی آواز میں ریکارڈ کریں', myList: 'میری ریکارڈنگز', myTitle: 'میری تلاوت (اپنی آواز میں)', myInfo: 'پورا قرآن اپنی آواز اور اپنی رفتار سے ریکارڈ کریں۔ جب چاہیں روکیں (ہولڈ) اور اگلی بار وہیں سے جاری رکھیں۔ ریکارڈنگ ایپ میں محفوظ رہتی ہے اور انٹرنیٹ کے بغیر دَور کے لیے چلتی ہے۔ ریکارڈنگ کے دوران غلطیاں بھی پکڑی جاتی ہیں۔', myProg: 'اب تک ریکارڈ ہوا', myNone: 'ابھی کچھ ریکارڈ نہیں ہوا', myCont: 'جہاں چھوڑا وہیں سے', myNew: 'ریکارڈنگ شروع کریں', myHold: 'روکیں (ہولڈ)', mySaved: 'محفوظ ہو گیا', myDelAsk: 'پکا؟ دوبارہ دبائیں', myEmpty: 'ابھی کوئی ریکارڈنگ نہیں', myDaur: 'سنیں / دَور', myNoMic: 'اس ڈیوائس پر ریکارڈنگ نہیں ہو سکتی', myMicBusy: 'ریکارڈنگ شروع نہ ہو سکی (مائیک مصروف یا اجازت نہیں)', myNothing: 'کچھ ریکارڈ نہیں ہوا', myNoAudio: 'ریکارڈنگ نہیں ملی', myReps: 'دَور کتنے', myMin: 'منٹ', myRec: 'ریکارڈ ہو رہا ہے' });
Object.assign(RS.ru, { amt: 'Kitna hissa', aq: 'Pav para', ah: 'Aadha para', at: 'Poona para', a1: '1 para', as: 'Sava para', ad: 'Dedh para', a2: '2 para', fromPara: 'Para ke aaghaz se', ayW: 'ayat', paraW: 'para', fastL: 'Galti batane wala tez qari', fastNote: 'Galti ya lukme par yeh qari tez awaaz mein ayat sunata hai taake aapki rawani na tootay.', rateL: 'Qari ki raftaar', myBtn: 'Apni awaaz mein record karein', myList: 'Meri recordings', myTitle: 'Meri tilawat (apni awaaz mein)', myInfo: 'Poora Quran apni awaaz aur apni raftaar se record karein. Jab chahein rokein (hold) aur agli baar wahin se jaari rakhein. Recording app mein mehfooz rehti hai aur internet ke baghair daur ke liye chalti hai. Recording ke dauran galtiyan bhi pakdi jaati hain.', myProg: 'Ab tak record hua', myNone: 'Abhi kuch record nahin hua', myCont: 'Jahan chhoda wahin se', myNew: 'Record shuru karein', myHold: 'Rokein (hold)', mySaved: 'Mehfooz ho gaya', myDelAsk: 'Pakka? Dobara dabayein', myEmpty: 'Abhi koi recording nahin', myDaur: 'Sunein / daur', myNoMic: 'Is device par recording nahin ho sakti', myMicBusy: 'Recording shuru na ho saki (mic masroof ya ijazat nahin)', myNothing: 'Kuch record nahin hua', myNoAudio: 'Recording nahin mili', myReps: 'Daur kitne', myMin: 'min', myRec: 'Record ho raha hai' });
Object.assign(RS.en, { amt: 'How much', aq: '¼ Juz', ah: '½ Juz', at: '¾ Juz', a1: '1 Juz', as: '1¼ Juz', ad: '1½ Juz', a2: '2 Juz', fromPara: 'From start of Juz', ayW: 'ayat', paraW: 'Juz', fastL: 'Fast reciter for mistakes', fastNote: 'On a mistake or a stall this reciter plays the ayah quickly so your rhythm is not broken.', rateL: 'Reciter speed', myBtn: 'Record in my own voice', myList: 'My recordings', myTitle: 'My recitation (own voice)', myInfo: 'Record the whole Quran in your own voice and pace. Hold whenever you like and continue from the same place next time. Recordings stay inside the app and play offline for revision. Mistakes are caught while you record.', myProg: 'Recorded so far', myNone: 'Nothing recorded yet', myCont: 'Continue where I stopped', myNew: 'Start recording', myHold: 'Hold', mySaved: 'Saved', myDelAsk: 'Sure? Tap again', myEmpty: 'No recordings yet', myDaur: 'Listen / revise', myNoMic: 'Recording is not possible on this device', myMicBusy: 'Could not start recording (mic busy or not allowed)', myNothing: 'Nothing was recorded', myNoAudio: 'Recording not found', myReps: 'Rounds', myMin: 'min', myRec: 'Recording' });
const R = k => (RS[A.st().ui] || RS.en)[k];
const rau = new Audio(); rau.preload = 'auto';
const rec = () => A.st().rec;
const FASTQ = ['Muhammad_Ayyoub_128kbps', 'Ibrahim_Akhdar_64kbps', 'Yasser_Ad-Dussary_128kbps', 'MaherAlMuaiqly128kbps'];
const fastOn = () => (A.st().hfast || 'on') === 'on';
const fastRate = () => fastOn() ? (A.st().hrate || 1.25) : 1;
const errUrl = (s, a) => fastOn() ? `https://everyayah.com/data/${A.st().hfq || FASTQ[0]}/${pad(s)}${pad(a)}.mp3` : auUrl(s, a);
const setRate = (au, r) => { try { au.defaultPlaybackRate = r; au.playbackRate = r; } catch (e) { } };
const recName = f => { const r = (window.FAHM_RECS || []).find(x => x[0] === f); return r ? (A.st().ui === 'ur' ? r[2] : r[1]) : f; };
const auUrl = (s, a) => `https://everyayah.com/data/${rec()}/${pad(s)}${pad(a)}.mp3`;
const locOf = (s, a, w) => `${s}:${a}:${w}`;
const q = loc => document.querySelector(`#rpage [data-loc="${loc}"]`);
const qa = (s, a) => document.querySelectorAll(`#rpage [data-loc^="${s}:${a}:"]`);
const isMk = t => !H.norm(t);

/* ---------- data / layout index ---------- */
function load() {
  if (M) return Promise.resolve();
  return loading || (loading = fetch('mushaf.json').then(r => r.json()).then(j => { M = j; }));
}
/* layouts are stored packed (one char per line = number of words); expand one layout into line specs on demand.
   char: digit/a-z = text line with n words (0-35), A-Z = centred line (1-26), # = surah banner, * = bismillah, _ = empty */
function ensureLay(k) {
  const L = M.L[k]; if (L.pages) return L;
  const pages = {}; let s = 1, a = 1, w = 1, hs = 0;
  const len = (S, A) => { const t = M.w[S + ':' + A]; return t ? t.length : 0; };
  L.p.split('\n').forEach((ln, i) => {
    const out = [];
    for (const ch of ln) {
      if (ch === '#') { hs++; s = hs; a = 1; w = 1; out.push('h' + hs); continue; }
      if (ch === '*') { out.push('b'); continue; }
      if (ch === '_') { out.push('e'); continue; }
      const cen = ch >= 'A' && ch <= 'Z', n = cen ? ch.charCodeAt(0) - 64 : parseInt(ch, 36);
      const a1 = `${s}:${a}:${w}`; let left = n - 1, s2 = s, a2 = a, w2 = w;
      while (left > 0) { if (w2 < len(s2, a2)) { w2++; left--; } else { a2++; w2 = 1; left--; if (!len(s2, a2)) { s2++; a2 = 1; } } }
      out.push((cen ? 'c ' : 't ') + a1 + ' ' + `${s2}:${a2}:${w2}`);
      if (w2 < len(s2, a2)) { s = s2; a = a2; w = w2 + 1; } else { s = s2; a = a2 + 1; w = 1; if (!len(s, a)) { s++; a = 1; } }
    }
    pages[i + 1] = out;
  });
  L.pages = pages; return L;
}
function rangeLocs(a, b) {
  const [s, a1, w1] = a.split(':').map(Number), [s2, a2, w2] = b.split(':').map(Number), out = [];
  let ay = a1, w = w1;
  for (let guard = 0; guard < 400; guard++) {
    const t = M.w[s + ':' + ay]; if (!t) break;
    if (w > t.length) { ay++; w = 1; continue; }
    out.push({ s, a: ay, w, t: t[w - 1] });
    if (ay === a2 && w === w2) break; w++;
  }
  return out;
}
function lineParts(ln) { const p = ln.split(' '); return { k: p[0], a: p[1], b: p[2] }; }
function buildIndex() {
  const L = ensureLay(lay); PG = Object.keys(L.pages); LP = {}; SC = []; AY = []; AYI = {}; STARTS = {}; const nm = new Map();
  let pendingStart = false;
  PG.forEach((pg, i) => L.pages[pg].forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k[0] === 'h' && k.length > 1) { pendingStart = +k.slice(1) !== 1; return; }
    if (k === 't' || k === 'c') rangeLocs(a, b).forEach(x => {
      const loc = locOf(x.s, x.a, x.w); LP[loc] = i;
      let n = nm.get(x.t); if (n === undefined) { n = H.norm(x.t); nm.set(x.t, n); } if (!n) return;
      if (pendingStart) { STARTS[SC.length] = 1; pendingStart = false; }
      const key = x.s + ':' + x.a; let ai = AYI[key];
      if (ai === undefined) { ai = AYI[key] = AY.length; AY.push({ s: x.s, a: x.a, first: SC.length, last: SC.length }); }
      AY[ai].last = SC.length; SC.push({ s: x.s, a: x.a, w: x.w, loc, n, ai });
    });
  }));
}
function surahName(s) { const I = window.I18N, ui = A.st().ui; const e = (I.surah[s] || {})[ui]; if (e) return e[0]; const N = window.FAHM_SN; return N ? (ui === 'ur' ? N.u[s - 1] : N.r[s - 1]) : ''; }
function pageSurah(i) { const L = M.L[lay].pages[PG[i]]; for (const ln of L) { const { k, a } = lineParts(ln); if (k[0] === 'h' && k.length > 1) return +k.slice(1); if (a) return +a.split(':')[0]; } return 1; }


/* ---------- juz / navigation ---------- */
function juzStartAi(j) { const f = M.meta.J[j - 1]; return AYI[f[0] + ':' + f[1]]; }
function juzOfAi(ai) { let j = 1; for (let k = 30; k >= 1; k--) { if (juzStartAi(k) <= ai) { j = k; break; } } return j; }
function juzRange(j) { const a = juzStartAi(j), b = j < 30 ? juzStartAi(j + 1) - 1 : AY.length - 1; return [a, b]; }
function pageOfAi(ai) { const y = AY[ai]; return LP[locOf(y.s, y.a, 1)]; }
function popGoto() {
  const st = A.st(), ur = st.ui === 'ur'; const cur = AY[(SC.find(x => LP[x.loc] === pi) || SC[0]).ai];
  const sOpt = Array.from({ length: 114 }, (_, i) => i + 1).map(n => `<option value="${n}" ${n === cur.s ? 'selected' : ''}>${ur ? ad(n) : n}. ${esc(surahName(n))}</option>`).join('');
  const jOpt = Array.from({ length: 30 }, (_, i) => i + 1).map(n => `<option value="${n}" ${n === juzOfAi(AYI[cur.s + ':' + cur.a]) ? 'selected' : ''}>${ur ? ad(n) : n}</option>`).join('');
  $('#rpop').dataset.pk = 'g';
  $('#rpop').innerHTML = `<h4>${esc(R('goto'))}</h4><div class="pr"><span>${esc(R('surahL'))}</span><select id="gS" class="sel">${sOpt}</select></div><div class="pr"><span>${esc(R('juzL'))}</span><select id="gJ" class="sel">${jOpt}</select></div><div class="pr"><span>${esc(R('pg'))} (1–${PG.length})</span><input id="gP" class="sel" type="number" inputmode="numeric" min="1" max="${PG.length}" value="${pi + 1}"><button class="po on" data-gp="1">${esc(R('go'))}</button></div>`;
  $('#rpop').hidden = false;
}

/* ---------- rendering ---------- */
function ratio() { const st = $('#rstage'); const r = (st.clientWidth - 16) / Math.max(1, st.clientHeight - 16); return r > 1.1 ? 0.66 : Math.max(0.56, Math.min(0.7, r)); }
function rowsOf() { return lay === '15' ? 15 : 13; }
function sizePage() {
  const st = $('#rstage'), z = A.st().rz || 1, sw = st.clientWidth - 16, sh = st.clientHeight - 16, r = ratio();
  const w = sw > sh * 1.1 ? Math.max(200, Math.min(sw, 640)) * z : Math.max(200, Math.min(sw, sh * r)) * z;   /* landscape: full-width page, scroll down */ const p = $('#rpage'); p.style.width = w + 'px'; p.style.height = (w / r) + 'px';
}
function fit() {
  const inner = $('#rin'); if (!inner) return; const rows = rowsOf();
  const W = inner.clientWidth, Hh = inner.clientHeight, rowH = Hh / rows;
  let fs = rowH * 0.78; $('#rpage').style.setProperty('--fs', fs + 'px');
  for (let it = 0; it < 3; it++) {
    let need = 0;
    inner.querySelectorAll('.ml:not(.e):not(.h)').forEach(l => {
      let s = 0; const ch = l.children; for (let i = 0; i < ch.length; i++) s += ch[i].offsetWidth; s += Math.max(0, ch.length - 1) * fs * 0.1; if (s > need) need = s;
    });
    if (!need) break; const f = fs * Math.min(1, (W * 0.995) / need); if (Math.abs(f - fs) < 0.3 && it) break; fs = f; $('#rpage').style.setProperty('--fs', fs + 'px');
  }
  $('#rpage').style.setProperty('--fs', Math.min(fs, rowH * 0.78) + 'px');
}
/* ---------- mushaf ornaments (header, surah banner, ruku/sajda marks, manzil) ---------- */
let RUKE = null, SAJ = null;
function ornSets() {
  if (RUKE) return; RUKE = new Set(); SAJ = new Set();
  const R = M.meta.R; for (let i = 1; i <= R.length; i++) { const e = i < R.length ? AYI[R[i][0] + ':' + R[i][1]] - 1 : AY.length - 1; if (e >= 0 && AY[e]) RUKE.add(AY[e].s + ':' + AY[e].a); }
  M.meta.SJ.forEach(x => SAJ.add(x[0] + ':' + x[1]));
}
function rukuInfo(s, a) { /* {n: ruku number inside the para} for the ruku that ends at this ayah */
  const R = M.meta.R, ai = AYI[s + ':' + a], jb = juzOfAi(ai), js = juzStartAi(jb);
  let n = 0; for (let i = 0; i < R.length; i++) { const e = i + 1 < R.length ? AYI[R[i + 1][0] + ':' + R[i + 1][1]] - 1 : AY.length - 1; if (e >= js && e <= ai) n++; if (e >= ai) break; }
  return n;
}
function manzilOfAi(ai) { let m = 1; M.meta.M.forEach((x, i) => { const k = AYI[x[0] + ':' + x[1]]; if (k !== undefined && k <= ai) m = i + 1; }); return m; }
function bannerHtml(sn) {
  const S = M.meta.S[sn] || [0, 0, 1, 0], nm = M.n[sn] || '';
  return `<div class="ml h"><div class="sbx"><span class="sbs"><i>آیاتھا</i><b>${adx(S[0])}</b></span><span class="sbc">${esc(nm)}<small>(${adx(sn)}) ${S[2] ? 'مکیۃ' : 'مدنیۃ'}</small></span><span class="sbs"><i>رکوعھا</i><b>${adx(S[1])}</b></span></div></div>`;
}
function headerHtml(lines) {
  const ps = lines.map(lineParts).filter(x => x.a).map(x => +x.a.split(':')[0]); if (!ps.length) return '';
  const s1 = ps[0], s2 = ps[ps.length - 1], f = lines.map(lineParts).find(x => x.a), [fs, fa] = f.a.split(':').map(Number), ai = AYI[fs + ':' + fa];
  const nmo = n => (M.n[n] || '').replace(/^سُورَةُ\s*|^سورة\s*/, '');
  const rng = s1 === s2 ? nmo(s1) + '-' + adx(s1) : nmo(s1) + '-' + adx(s1) + ' ' + nmo(s2) + '-' + adx(s2);
  return `<span class="hr1">پارہ ${adx(juzOfAi(ai))}</span><span class="hr2">${adx(PG[pi])} / ${adx(PG[PG.length - 1])}</span><span class="hr3">${esc(rng)}</span>`;
}
function wordHtml(x) {
  const loc = locOf(x.s, x.a, x.w), c = ['wd']; if (isMk(x.t)) c.push('mk');
  if (okSet.has(loc)) c.push('ok');
  if (isMk(x.t)) { ornSets(); const ak = x.s + ':' + x.a; if (RUKE.has(ak)) c.push('ruk'); if (SAJ.has(ak)) c.push('saj'); }
  return `<span class="${c.join(' ')}" data-loc="${loc}">${esc(x.t)}</span>`;
}
function renderPage(anim) {
  const L = M.L[lay], lines = L.pages[PG[pi]], rows = rowsOf();
  let h = '';
  lines.forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k === 'e') h += '<div class="ml e"></div>';
    else if (k === 'b') h += `<div class="ml b">${M.w['1:1'].slice(0, 4).map(esc).join(' ')}</div>`;
    else if (k[0] === 'h') h += bannerHtml(+k.slice(1));
    else { const ws = rangeLocs(a, b); let rm = ''; ws.forEach(x => { if (isMk(x.t)) { ornSets(); if (RUKE.has(x.s + ':' + x.a)) rm = `<span class="rm"><b>ع</b><i>${adx(x.a)}</i><u>${adx(rukuInfo(x.s, x.a))}</u></span>`; } }); h += `<div class="ml ${k}">${ws.map(wordHtml).join('')}${rm}</div>`; }
  });
  const pg = $('#rpage'); pg.classList.toggle('mem', hz.on && A.st().hmode === 'mem');
  $('#rin').innerHTML = h; $('#rin').style.setProperty('--rows', rows);
  { ornSets(); const f0 = lines.map(lineParts).find(x => x.a); const mz = f0 ? manzilOfAi(AYI[f0.a.split(':').slice(0, 2).join(':')]) : 0; $('#rpn').textContent = mz ? 'منزل ' + adx(mz) : ''; $('#rhd').innerHTML = headerHtml(lines); }
  sizePage(); fit();
  warm(pageSurah(pi));
  $('#rTitle').textContent = surahName(pageSurah(pi)) + ' · ' + R('pg') + ' ' + (A.st().ui === 'ur' ? ad(PG[pi]) : PG[pi]);
  $('#rPg').textContent = (A.st().ui === 'ur' ? ad(pi + 1) + ' / ' + ad(PG.length) : (pi + 1) + ' / ' + PG.length);
  if (anim) { pg.classList.remove('flip'); void pg.offsetWidth; pg.classList.add('flip'); }
  { const fl = lines.map(lineParts).find(x => x.a); if (fl) { const [s1, a1] = fl.a.split(':').map(Number); A.st().rlast = { s: s1, a: a1 }; A.save(); } }
  paintState();
}
const AD = '٠١٢٣٤٥٦٧٨٩', ad = n => String(n).replace(/\d/g, d => AD[d]);
const adx = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
function paintState() {
  if (curAy && (playing || hz.on)) qa(curAy.s, curAy.a).forEach(e => e.classList.add('cur'));
  if (hot) { const e = q(hot); if (e) e.classList.add('hot'); }
  if (hz.on && hz.tr) markNext();
}
function goPage(i, anim) { i = Math.max(0, Math.min(PG.length - 1, i)); if (i === pi && $('#rin').children.length) return; pi = i; renderPage(anim !== false); }
function ensureLoc(loc) { const i = LP[loc]; if (i !== undefined && i !== pi) goPage(i); }

/* ---------- ayah audio + live word highlight ---------- */
function clearHl() { document.querySelectorAll('#rpage .cur,#rpage .hot').forEach(e => e.classList.remove('cur', 'hot')); }
function setCur(s, a) {
  clearHl(); hot = null; curAy = { s, a }; const key = s + ':' + a, ai = AYI[key];
  if (ai !== undefined) { const f = SC[AY[ai].first]; ensureLoc(f.loc); }
  qa(s, a).forEach(e => e.classList.add('cur'));
}
function ayWords(s, a) { const ai = AYI[s + ':' + a]; return ai === undefined ? [] : SC.slice(AY[ai].first, AY[ai].last + 1); }
function startTick() {
  clearInterval(tickT);
  tickT = setInterval(() => {
    if (!curAy || !rau.duration || rau.paused) return;
    const ws = ayWords(curAy.s, curAy.a); if (!ws.length) return;
    const tot = ws.reduce((x, y) => x + y.n.length + 1, 0), t = Math.max(0, Math.min(1, (rau.currentTime - 0.15) / Math.max(0.5, rau.duration - 0.35))) * tot;
    let acc = 0, pick = ws[ws.length - 1];
    for (const w of ws) { acc += w.n.length + 1; if (t <= acc) { pick = w; break; } }
    if (hot !== pick.loc) { const o = hot && q(hot); if (o) o.classList.remove('hot'); hot = pick.loc; ensureLoc(pick.loc); const e = q(pick.loc); if (e) e.classList.add('hot', 'cur'); if (rev) { qa(curAy.s, curAy.a).forEach(x => x.classList.add('rev')); } }
  }, 70);
}
function setPlaying(p) { playing = p; $('#rIcoP').style.display = p ? 'none' : ''; $('#rIcoS').style.display = p ? '' : 'none'; }
function stopAudio() { stopMine(); seqOn = false; rau.onended = null; rau.onerror = null; try { rau.pause(); } catch (e) { } clearInterval(tickT); setPlaying(false); clearHl(); document.querySelectorAll('#rpage .rev').forEach(e => e.classList.remove('rev')); hot = null; }
function playSeq(ai) {
  if (ai >= AY.length) { stopAudio(); return; }
  seqOn = true; const y = AY[ai]; setCur(y.s, y.a); setPlaying(true);
  rau.onerror = () => { stopAudio(); A.toast(R('audioErr')); };
  rau.onended = () => { if (seqOn) playSeq(ai + 1); };
  rau.src = auUrl(y.s, y.a); setRate(rau, 1); const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { stopAudio(); A.toast(R('audioErr')); });
  startTick();
}
/* play one ayah, then call cb (used by Hafiz mode) */
function playOnce(s, a, reveal, cb) {
  seqOn = false; rev = reveal; setCur(s, a); if (reveal) qa(s, a).forEach(x => x.classList.add('rev'));
  let fin = false; const done = () => { if (fin) return; fin = true; rau.onended = null; rau.onerror = null; clearInterval(tickT); qa(s, a).forEach(x => x.classList.remove('rev')); rev = null; clearHl(); hot = null; cb && cb(); };
  rau.onended = done; rau.onerror = () => { A.toast(R('audioErr')); done(); };
  rau.src = errUrl(s, a); setRate(rau, fastRate()); const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { A.toast(R('audioErr')); done(); });
  startTick();
}

/* ---------- sounds ---------- */
let ac = null;
function unlockAc() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { } }
function beep() {
  unlockAc(); if (!ac) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), c = ac.createDynamicsCompressor();
  o.type = 'square'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.01); g.gain.setValueAtTime(1, t + 0.42); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  o.connect(g); g.connect(c); c.connect(ac.destination); o.start(t); o.stop(t + 0.52);
  try { if (navigator.vibrate) navigator.vibrate(180); } catch (e) { }
}

function beep2() {   /* hard mistake in flow mode: two short loud beeps, nothing stops */
  unlockAc(); if (!ac) return; const t0 = ac.currentTime, c = ac.createDynamicsCompressor(); c.connect(ac.destination);
  [0, 0.26].forEach(d => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(1, t0 + d + 0.01); g.gain.setValueAtTime(1, t0 + d + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.19); o.connect(g); g.connect(c); o.start(t0 + d); o.stop(t0 + d + 0.2); });
  try { if (navigator.vibrate) navigator.vibrate([120, 70, 120]); } catch (e) { }
}
function tick() {    /* small slip: one soft short tick */
  unlockAc(); if (!ac) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = 1400; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.1);
  try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) { }
}
const flowOn = () => (A.st().hflow || 'flow') === 'flow';
const tickOn = () => (A.st().htick || 'on') === 'on';

/* ---------- speech recognition layer ---------- */
function nativeOk() { try { return !!(window.FahmAndroid && window.FahmAndroid.speechAvailable && window.FahmAndroid.speechAvailable()); } catch (e) { return false; } }
function webOk() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function recStart() {
  if (!hz.want) return; hz.proc = {}; hz.prev = null; hz.sess++;
  if (hz.native) { try { window.FahmAndroid.startListen('ar-SA'); } catch (e) { fatal('noRec'); } return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const r = new SR(); const my = hz.sess; hz.sr = r;
  r.lang = 'ar-SA'; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
  r.onresult = e => { if (my !== hz.sess) return; for (let i = e.resultIndex; i < e.results.length; i++) onHeard(i, e.results[i][0].transcript, e.results[i].isFinal); };
  r.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') fatal('mic'); };
  r.onend = () => { if (my === hz.sess && hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy && my === hz.sess) recStart(); }, 120); };
  try { r.start(); } catch (e) { }
}
function recStop() {
  hz.sess++;
  if (hz.native) { try { window.FahmAndroid.stopListen(); } catch (e) { } return; }
  if (hz.sr) { try { hz.sr.onend = null; hz.sr.abort(); } catch (e) { } hz.sr = null; }
}
/* called by the Android shell: type = partial | final | end | error */
window.__fahmSpeech = function (type, text) {
  if (!hz.on || !hz.native) return;
  if (type === 'partial') onHeard(0, text, false);
  else if (type === 'final') onHeard(0, text, true);
  else if (type === 'permok') { if (hz.want && !hz.busy) recStart(); }
  else if (type === 'permno') fatal('mic');
  else if (type === 'perm') { /* waiting for the system permission dialog */ }
  else if (type === 'end') { if (hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy) recStart(); }, 60); }
  else if (type === 'error') { if (/denied|permission|insufficient/i.test(text || '')) fatal('mic'); else if (hz.want && !hz.busy) setTimeout(() => { if (hz.want && !hz.busy) recStart(); }, 400); }
};
function fatal(k) { A.toast(R(k), 4200); hzStop(); }

/* ---------- Hafiz mode ---------- */
const sensOf = () => A.st().hs || 'h';
const silOf = () => A.st().hsil || 4;
const L3 = (u, r, e) => ({ ur: u, ru: r, en: e }[A.st().ui] || e);
let DICT = null;
function warm(sn) { try { if (!sn || !window.FahmData) return; const si = sn - 1, S = FahmData.D.surahs[si]; if (S && !S.loaded) FahmData.load(si, A.st().tl || []).then(() => { DICT = null; }).catch(() => { }); } catch (e) { } }
function dictBuild() {
  DICT = {}; A.D().surahs.forEach(S => S.ayat.forEach(Ay => Ay.words.forEach(W => { const n = H.norm(W.ar); if (n && !DICT[n]) DICT[n] = W; })));
}
const mk3 = W => W ? (A.st().ui === 'ur' ? W.ur : A.st().ui === 'ru' ? W.ru : W.en) : '';
function wMean(w) {
  const S = A.D().surahs.find(x => x.n === w.s); const Ay = S && S.ayat.find(x => x.v === w.a); const W = Ay && Ay.words[w.w - 1];
  if (W && H.norm(W.ar) === w.n) return mk3(W);
  if (!DICT) dictBuild(); return mk3(DICT[w.n]);
}
function ayTr(s, a) {
  const S = A.D().surahs.find(x => x.n === s); const Ay = S && S.ayat.find(x => x.v === a); if (!Ay) return '';
  const tl = A.st().tl || []; for (const c of tl) if (Ay.tr && Ay.tr[c]) return Ay.tr[c]; return (Ay.tr && (Ay.tr.ur || Ay.tr.en)) || '';
}
const ayRef = ai => { const y = AY[ai]; return surahName(y.s) + ' ' + (A.st().ui === 'ur' ? ad(y.a) : y.a); };
function hzStatus(k, cls) { const e = $('#rhSt'); e.textContent = R(k); e.className = cls || ''; }
function markNext() {
  document.querySelectorAll('#rpage .nx').forEach(e => e.classList.remove('nx')); const w = SC[hz.tr.p];
  if (w) { const e = q(w.loc); if (e) { e.classList.add('nx'); const st = $('#rstage'); if (st.scrollHeight > st.clientHeight + 4) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
}
function setOk(i0, i1) {
  for (let i = i0; i < i1; i++) {
    const w = SC[i]; if (!w) continue; okSet.add(w.loc); const e = q(w.loc); if (e) { e.classList.add('ok'); e.classList.remove('bad'); }
    const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.add(m.dataset.loc); m.classList.add('ok'); }
  }
}
function clearAyahMarks(ai) {
  const y = AY[ai]; for (let i = y.first; i <= y.last; i++) { const w = SC[i]; okSet.delete(w.loc); const e = q(w.loc); if (e) e.classList.remove('ok', 'bad'); const m = q(locOf(w.s, w.a, w.w + 1)); if (m && m.classList.contains('mk')) { okSet.delete(m.dataset.loc); m.classList.remove('ok'); } }
}
/* where the Hafiz stopped last time — mic starts from here again */
function savePos(ai) { const y = AY[ai]; if (!y) return; const st = A.st(); if (!st.hlast || st.hlast.s !== y.s || st.hlast.a !== y.a) { st.hlast = { s: y.s, a: y.a }; A.save(); } }
const posAi = () => Math.min(hz.tr.p, SC.length - 1);
function onHeard(idx, text, fin) {
  if (!hz.on || hz.busy || !hz.tr) return;
  const toks = String(text || '').trim().split(/\s+/).map(H.norm).filter(Boolean);
  let done = hz.proc[idx] || 0;
  if (hz.prev && hz.prev.idx !== idx) { const pt = hz.prev.toks; if (pt.length && toks.length >= pt.length && pt.every((t, j) => t === toks[j])) done = Math.max(done, pt.length); }
  hz.prev = { idx, toks };
  if (toks.length > done) hz.lastAct = Date.now();
  const nt = toks.slice(done); if (!nt.length) { if (fin) hz.proc[idx] = Math.max(done, toks.length); return; }
  const p0 = hz.tr.p; let rest = nt, used = 0;
  while (rest.length) {
    const r = hz.tr.feed(rest, fin); used += r.used; let hard = false;
    for (const ev of r.ev) {
      if (ev.t === 'ok') { setOk(ev.from, ev.to); hz.lastAct = Date.now(); hz.cur.words += ev.to - ev.from; }
      else if (ev.t === 'soft') { const w = SC[ev.idx]; if (w) { hz.cur.soft.push({ ai: w.ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, heard: ev.heard, t: Date.now() - hz.cur.t0, abs: Date.now() }); if (flowOn() && tickOn()) tick(); } }
      else if (ev.t === 'mistake') { if (!flowOn()) { hz.proc[idx] = done + used; hzMistake(ev); return; } hzFlowMistake(ev); if (hz.tr.done()) { hz.proc[idx] = done + used; hzDaurEnd(); return; } hard = true; }
      else if (ev.t === 'end') { hz.proc[idx] = done + used; hzDaurEnd(); return; }
    }
    if (!hard || r.used <= 0) break;
    rest = rest.slice(r.used);
  }
  hz.proc[idx] = fin ? toks.length : done + used;
  if (hz.tr.p !== p0) { const w = SC[posAi()]; if (w) ensureLoc(w.loc); markNext(); savePos(w.ai); if (hz.own && w) ownAdvance(w.ai); }
}
function busyOn() { hz.busy = true; hz.busyAt = Date.now(); }
function busyOff() { hz.busy = false; if (hz.busyAt) { hz.cur.busyMs += Date.now() - hz.busyAt; hz.busyAt = 0; } }
function hzResume(ai) {
  const y = AY[ai]; clearAyahMarks(ai); hz.tr.setPos(y.first); markNext(); busyOff(); hz.lastAct = Date.now() + 600; hzStatus('listen'); recStart();
}
/* flow mode: hard mistake = two beeps + note, but the recitation is never interrupted */
function hzFlowMistake(ev) {
  const w = SC[ev.idx]; if (!w) return;
  const now = Date.now(), dup = hz.lastHard && now - hz.lastHard < 2000; hz.lastHard = now;
  let np = hz.tr.p, a = ev.idx, b = ev.idx + 1;
  if (ev.kind === 'skip') { b = ev.idx + (ev.n || 1); np = ev.idx + (ev.n || 1) + 1; }
  else if (ev.kind === 'wrong') { b = ev.idx + Math.max(1, (ev.heard || []).length); np = b; }
  else if (ev.kind === 'jump') { const to = ev.to || 0, ta = SC[to] && SC[to].ai; np = (ta != null && ta >= hz.fi && ta <= hz.ti) ? Math.min(hz.tr.lim, to + Math.max(2, (ev.heard || []).length)) : ev.idx; }
  if (!dup) {
    hz.cur.mist.push({ ai: w.ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, to: ev.to, heard: ev.heard, t: now - hz.cur.t0, abs: now });
    for (let i = a; i < Math.min(b, SC.length); i++) { const e = q(SC[i].loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(SC[i].loc); }
    beep2(); hzStatus('wrongF', 'bad'); setTimeout(() => { if (hz.on && !hz.busy) hzStatus('listen'); }, 1200);
  }
  hz.tr.setPos(Math.min(np, hz.tr.lim)); hz.lastAct = now;
}
function hzMistake(ev) {
  busyOn(); recStop(); const w = SC[ev.idx], ai = w.ai, y = AY[ai];
  hz.cur.mist.push({ ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, to: ev.to, heard: ev.heard, t: Date.now() - hz.cur.t0, abs: Date.now() });
  const e = q(w.loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(w.loc);
  hzStatus('wrong', 'bad'); beep();
  setTimeout(() => { if (!hz.on) return; playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); }); }, 650);
}
function hzLukma() {
  if (hz.busy || !hz.tr || hz.tr.done()) return; busyOn(); recStop();
  const w = SC[hz.tr.p], ai = w.ai, y = AY[ai]; hzStatus('luq', 'warn');
  hz.cur.stalls.push({ ai, idx: hz.tr.p, t: Date.now() - hz.cur.t0, abs: Date.now(), wait: silOf() });
  ensureLoc(w.loc); playOnce(y.s, y.a, true, () => { if (hz.on) hzResume(ai); });
}

/* ----- plan (daily target) ----- */
function planDefault() {
  const st = A.st(); if (st.hplan && AYI[st.hplan.fs + ':' + st.hplan.fa] != null && AYI[st.hplan.ts + ':' + st.hplan.ta] != null) return st.hplan;
  const f = AY[0], l = AY[AY.length - 1]; return { fs: f.s, fa: f.a, ts: l.s, ta: l.a, reps: 1 };
}
const surahsInScope = () => { const o = []; AY.forEach(y => { if (!o.includes(y.s)) o.push(y.s); }); return o; };
const AMTS = [['aq', .25], ['ah', .5], ['at', .75], ['a1', 1], ['as', 1.25], ['ad', 1.5], ['a2', 2]];
const avgJuz = () => SC.length / 30;
function endByWords(fi, words) { for (let i = fi; i < AY.length; i++) if (AY[i].last - AY[fi].first + 1 >= words) return i; return AY.length - 1; }
function endForAmt(fi, amt) {
  let j0 = 0; for (let j = 1; j <= 30; j++) if (juzStartAi(j) === fi) { j0 = j; break; }
  const whole = Math.floor(amt + 1e-9), frac = amt - whole;
  if (j0) {
    let cur = fi;
    if (whole >= 1) { cur = j0 + whole <= 30 ? juzStartAi(j0 + whole) : AY.length; if (cur >= AY.length) return AY.length - 1; if (frac < 0.01) return cur - 1; }
    return endByWords(cur, frac * avgJuz());
  }
  return endByWords(fi, amt * avgJuz());
}
function planSummary(fi, ti) { const w = AY[ti].last - AY[fi].first + 1, p = Math.round(w / avgJuz() * 100) / 100, ur = A.st().ui === 'ur'; return (ur ? ad(ti - fi + 1) : ti - fi + 1) + ' ' + R('ayW') + ' · ≈ ' + (ur ? String(p).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : p) + ' ' + R('paraW'); }
function popSetup() {
  const st = A.st(), pl = planDefault(), ur = st.ui === 'ur', last = st.hlast && AYI[st.hlast.s + ':' + st.hlast.a] != null ? st.hlast : null;
  const fi = AYI[pl.fs + ':' + pl.fa], ti = AYI[pl.ts + ':' + pl.ta];
  const sOpt = (sel) => surahsInScope().map(s => `<option value="${s}" ${s === sel ? 'selected' : ''}>${esc(surahName(s))}</option>`).join('');
  const aOpt = (s, sel) => AY.filter(y => y.s === s).map(y => `<option value="${y.a}" ${y.a === sel ? 'selected' : ''}>${ur ? ad(y.a) : y.a}</option>`).join('');
  const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  const am = AMTS.map(([k, v]) => `<button class="po sm ${pl.amt === v && endForAmt(fi, v) === ti ? 'on' : ''}" data-amt="${v}">${esc(R(k))}</button>`).join('');
  $('#rpop').dataset.pk = 's';
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))} · ${esc(R('target'))}</h4>` +
    (last ? `<button class="po" data-hres="1">${esc(R('resume'))}: ${esc(surahName(last.s))} ${ur ? ad(last.a) : last.a}</button>` : '') +
    `<div class="sec">${esc(R('from'))}</div><div class="card"><div class="pr"><select id="tfS" class="sel">${sOpt(pl.fs)}</select><select id="tfA" class="sel">${aOpt(pl.fs, pl.fa)}</select></div>` +
    `<div class="pr"><select id="tJ" class="sel"><option value="">${esc(R('fromPara'))}…</option>${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}">${esc(R('paraW'))} ${ur ? ad(i + 1) : i + 1}</option>`).join('')}</select></div></div>` +
    `<div class="sec">${esc(R('amt'))}</div><div class="chips">${am}<button class="po sm" data-q="fat">${esc(R('qFat'))}</button><button class="po sm" data-q="all">${esc(R('qAll'))}</button></div>` +
    `<div class="sec">${esc(R('to'))}</div><div class="card"><div class="pr"><select id="ttS" class="sel">${sOpt(pl.ts)}</select><select id="ttA" class="sel">${aOpt(pl.ts, pl.ta)}</select></div></div>` +
    `<div class="sum">${esc(planSummary(Math.min(fi, ti), Math.max(fi, ti)))}</div>` +
    `<div class="sec">${esc(R('reps'))}</div><div class="chips">${[1, 2, 3, 5, 7, 10].map(v => sw('reps', v, String(v), (pl.reps || 1) === v)).join('')}</div>` +
    `<button class="po on" data-hgo="1">${esc(R('start'))}</button><div class="chips"><button class="po sm" data-hset="1">${esc(R('settings'))}</button><button class="po sm" data-hist="1">${esc(R('history'))}</button><button class="po sm" data-mine="1">● ${esc(R('myBtn'))}</button></div>`;
  $('#rpop').hidden = false;
}
function readPlan2() { const p = readPlan(); p.reps = (A.st().hplan && A.st().hplan.reps) || 1; return p; }
function hzStopAsk() { if (hz.cur && hz.cur.words >= 3) hzFinishAll(true); else hzStop(); }
function readPlan() {
  const g = id => +$(id).value; const pl = planDefault();
  let fs = g('#tfS'), fa = g('#tfA'), ts = g('#ttS'), ta = g('#ttA');
  let fi = AYI[fs + ':' + fa], ti = AYI[ts + ':' + ta]; if (fi == null || ti == null) return pl;
  if (ti < fi) { const t = fi; fi = ti; ti = t; }
  const y = AY[fi], z = AY[ti]; return { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1, amt: pl.amt };
}
function setPlanQuick(k) {
  const pl = Object.assign({}, planDefault());
  if (k === 'fat') { pl.fs = 1; pl.fa = 1; pl.ts = 1; pl.ta = 7; pl.amt = 0; }
  else if (/^j\d+$/.test(k)) { const [a, b] = juzRange(+k.slice(1)); pl.fs = AY[a].s; pl.fa = AY[a].a; pl.ts = AY[b].s; pl.ta = AY[b].a; pl.amt = 0; }
  else { pl.fs = AY[0].s; pl.fa = AY[0].a; pl.ts = AY[AY.length - 1].s; pl.ta = AY[AY.length - 1].a; pl.amt = 0; }
  A.st().hplan = pl; A.save(); popSetup();
}

/* ----- start / daur loop ----- */
function newDaur(n) { return { n, t0: Date.now(), t1: 0, words: 0, busyMs: 0, mist: [], soft: [], stalls: [] }; }
function hzStart(fromAi, plan) {
  hz.own = !!hz.ownNext; hz.ownNext = false; hz.ownAi = null;
  stopAudio(); unlockAc(); popClose();
  hz.native = nativeOk(); if (!hz.native && !webOk()) { A.toast(R('noRec'), 4500); return; }
  const st = A.st(); if (!st.hs) st.hs = 'h'; if (!st.hsil) st.hsil = 4; if (!st.hmode) st.hmode = 'look';
  const pl = plan || planDefault(); st.hplan = pl; A.save();
  hz.plan = pl; hz.fi = AYI[pl.fs + ':' + pl.fa]; hz.ti = AYI[pl.ts + ':' + pl.ta]; hz.all = []; hz.daur = 1; hz.startAi = fromAi != null ? Math.max(hz.fi, Math.min(hz.ti, fromAi)) : hz.fi;
  hz.on = true; hz.want = true; hz.started = Date.now();
  { const S0 = A.st(); if (S0.hzTr !== false && S0.trw) { S0.trwWas = 1; S0.trw = false; A.save(); } try { speechSynthesis.cancel(); } catch (e) { } }
  $('#rrep').hidden = true; $('#rhz').hidden = false; $('#rhHold').hidden = !hz.own; $('#rhHold').textContent = '⏸ ' + R('myHold'); $('#rhMode').textContent = R(st.hmode); $('#rMic').classList.add('on'); $('#rpage').classList.toggle('mem', st.hmode === 'mem');
  clearInterval(hz.sil); hz.sil = setInterval(() => { if (hz.on && !hz.busy && Date.now() - hz.lastAct > silOf() * 1000) hzLukma(); }, 250);
  recBegin();
  hzBeginDaur(hz.startAi);
}
function hzBeginDaur(ai) {
  hz.cur = newDaur(hz.daur); hz.tr = new H.Tracker(SC, sensOf(), STARTS); hz.tr.lim = AY[hz.ti].last + 1; hz.tr.setPos(AY[ai].first);
  okSet = new Set(); clearHl(); curAy = null; hz.busy = false; hz.lastAct = Date.now() + 3000; hz.proc = {}; hz.prev = null;
  renderPage(false); ensureLoc(SC[hz.tr.p].loc); markNext(); savePos(ai); hzStatus('listen'); $('#rhDaur').textContent = R('daur') + ' ' + hz.daur + '/' + (hz.plan.reps || 1);
  recStart();
}
function hzStop() {
  { const S0 = A.st(); if (S0.trwWas) { S0.trw = true; delete S0.trwWas; A.save(); } }
  recEnd(); hz.on = false; hz.want = false; hz.busy = false; recStop(); clearInterval(hz.sil); stopAudio(); $('#rhz').hidden = true; $('#rMic').classList.remove('on');
  $('#rpage').classList.remove('mem'); document.querySelectorAll('#rpage .nx,#rpage .bad,#rpage .ok').forEach(e => e.classList.remove('nx', 'bad', 'ok')); okSet = new Set();
}
function hzDaurEnd() {
  if (hz.own) { ownAdvance(hz.ti + 1); recEnd(); }
  busyOn(); recStop(); const d = hz.cur; d.t1 = Date.now(); hz.all.push(d); hzStatus('done', 'ok'); hz.busyAt = 0; hz.busy = true;
  A.st().hlast = { s: AY[hz.fi].s, a: AY[hz.fi].a }; A.save();
  setTimeout(() => showDaurReport(d), 700);
}

/* ----- own-voice recording (optional, web only) + compare with the qari ----- */
function recBegin() {
  try { if (hz.rec) recEnd(); } catch (e) { } hz.rec = null; hz.recBuf = null;
  if (!navigator.mediaDevices || !window.MediaRecorder) { if (hz.own) A.toast(R('myNoMic'), 4500); return; }
  if (!hz.own && ((A.st().hrec || 'off') !== 'on' || hz.native)) return;
  navigator.mediaDevices.getUserMedia({ audio: true }).then(str => {
    if (!hz.on) { str.getTracks().forEach(t => t.stop()); return; }
    let mr; try { mr = hz.own ? new MediaRecorder(str, { audioBitsPerSecond: 32000 }) : new MediaRecorder(str); } catch (e) { mr = new MediaRecorder(str); }
    const r = { mr, str, chunks: [], t0: Date.now(), marks: [], lastB: 0, ended: false }; hz.rec = r;
    mr.ondataavailable = e => { if (e.data && e.data.size) r.chunks.push(e.data); }; mr.start(1000);
    if (hz.own) { hz.ownAi = hz.tr ? SC[posAi()].ai : hz.startAi; hz.ownM0 = mistTotal(); A.toast('● ' + R('myRec')); }
  }).catch(() => { if (hz.own) A.toast(R('myMicBusy'), 5000); });
}
function recEnd() {
  const r = hz.rec; if (!r || r.ended) return; r.ended = true;
  const stopTr = () => { try { r.str.getTracks().forEach(t => t.stop()); } catch (e) { } };
  if (hz.own) { r.mr.onstop = () => { stopTr(); ownSave(r); }; try { r.mr.stop(); } catch (e) { stopTr(); ownSave(r); } }
  else { try { r.mr.stop(); } catch (e) { } stopTr(); }
}
let cau = null, msrc = null;
function stopCmp() { if (cau) { try { cau.pause(); } catch (e) { } } if (msrc) { try { msrc.stop(); } catch (e) { } msrc = null; } }
function playQari(ai) { const y = AY[ai]; if (!y) return; stopCmp(); stopAudio(); cau = cau || new Audio(); cau.src = errUrl(y.s, y.a); setRate(cau, fastRate()); const pr = cau.play(); if (pr && pr.catch) pr.catch(() => A.toast(R('audioErr'))); }
async function playMine(offMs) {
  const r = hz.rec; if (!r || !r.chunks.length) { A.toast(R('noRecYet')); return; }
  stopCmp(); stopAudio(); unlockAc(); if (!ac) return;
  try {
    if (!hz.recBuf || hz.recBufN !== r.chunks.length) { const ab = await new Blob(r.chunks, { type: r.mr.mimeType || 'audio/webm' }).arrayBuffer(); hz.recBuf = await ac.decodeAudioData(ab); hz.recBufN = r.chunks.length; }
    const b = ac.createBufferSource(); b.buffer = hz.recBuf; b.connect(ac.destination); b.start(0, Math.max(0, offMs / 1000 - 3), 9); msrc = b;
  } catch (e) { A.toast(R('noRecYet')); }
}
function cmpBtns(m) {
  const mine = hz.rec && m.abs && m.abs >= hz.rec.t0 ? `<button class="po sm" data-hm="${m.abs - hz.rec.t0}">▶ ${esc(R('cMine'))}</button>` : '';
  return `<span class="cmp"><button class="po sm" data-hq="${m.ai}">▶ ${esc(R('cQari'))}</button>${mine}</span>`;
}
const hkNote = k => { const v = window.FahmHK && window.FahmHK[k]; return v ? (A.st().ui === 'en' ? v[1] : v[0]) : ''; };
function hkRows(flag, onlyFlag) {
  const out = [], seen = new Set();
  for (let ai = VM.fi; ai <= VM.ti; ai++) {
    const y = AY[ai], fl = flag.has(ai); if (onlyFlag && !fl) continue;
    for (let i = y.first; i <= y.last; i++) { const w = SC[i], k = w.s + ':' + w.a + ':' + w.w, n = hkNote(k); if (!n) continue;
      out.push({ fl, html: `<div class="ri"><b>${esc(ayRef(ai))}</b> · ${fl ? '⚠ ' : ''}<span class="ar">${esc(M.w[w.s + ':' + w.a][w.w - 1].replace(/[۝].*/, ''))}</span> <button class="po sm" data-hq="${ai}">▶ ${esc(R('cQari'))}</button><br><small>${esc(n)}</small></div>` }); }
  }
  out.sort((a, b) => (b.fl ? 1 : 0) - (a.fl ? 1 : 0)); return out.map(x => x.html).join('');
}
const flagSet = list => { const f = new Set(); list.forEach(d => { d.mist.forEach(m => f.add(m.ai)); d.stalls.forEach(m => f.add(m.ai)); d.soft.forEach(m => f.add(m.ai)); }); return f; };

/* ----- reports ----- */
const fmtT = ms => { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); };
let VM = { fi: 0, ti: 0 };
function dStats(d) {
  const hi = d.reach != null ? Math.min(VM.ti, d.reach) : VM.ti, bad = new Set([...d.mist.map(m => m.ai), ...d.stalls.map(m => m.ai)]), n = Math.max(1, hi - VM.fi + 1), clean = [];
  for (let i = VM.fi; i <= hi; i++) if (!bad.has(i)) clean.push(i);
  const net = Math.max(1000, d.t1 - d.t0 - d.busyMs);
  return { n, clean, bad: [...bad], cleanPct: Math.round(clean.length * 100 / n), wpm: Math.round(d.words * 60000 / net), net };
}
function heardTxt(m) { return (m.heard || []).join(' '); }
function skippedWords(m, count) { const o = []; for (let i = m.idx; i < Math.min(SC.length, m.idx + count); i++) o.push(SC[i]); return o; }
function impact(m, soft) {
  if (!DICT) dictBuild();
  const w = SC[m.idx], y = AY[m.ai], mean = wMean(w), hm = m.heard && m.heard.length === 1 ? mk3(DICT[m.heard[0]]) : '';
  const ar = M.w[w.s + ':' + w.a][w.w - 1];
  if (m.kind === 'jump') {
    const t = SC[m.to], ya = y, yb = t && AY[t.ai];
    return L3(`آیت بدل گئی: ${ayRef(m.ai)} کی جگہ ${yb ? ayRef(t.ai) : ''} کی طرف چلے گئے۔ ترجمہ (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — اور ${yb ? ayTr(yb.s, yb.a) : ''}۔ یہ متشابہ/ترتیب کی غلطی ہے؛ ترجمے کا سلسلہ ٹوٹ جاتا ہے۔`,
      `Ayat badal gayi: ${ayRef(m.ai)} ki jagah ${yb ? ayRef(t.ai) : ''} ki taraf chale gaye. Tarjma (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — aur ${yb ? ayTr(yb.s, yb.a) : ''}. Yeh mutashabih/tarteeb ki galti hai; tarjme ka silsila toot jata hai.`,
      `Ayah changed: went to ${yb ? ayRef(t.ai) : ''} instead of ${ayRef(m.ai)}. Translation (${ayRef(m.ai)}): ${ayTr(ya.s, ya.a)} — vs ${yb ? ayTr(yb.s, yb.a) : ''}. This is a similar-verse/order error and breaks the flow of meaning.`);
  }
  if (m.kind === 'skip') {
    const k = m.n || 1, ws = skippedWords(m, k), ms = ws.map(wMean).filter(Boolean).join(' · ');
    return L3(`چھوٹے ہوئے الفاظ (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1].replace(/[۝].*/, '')).join(' ')}۔ ترجمے کا یہ حصہ غائب: ${ms}`,
      `Chhoote hue alfaaz (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1]).join(' ')}. Tarjme ka yeh hissa gayab: ${ms}`,
      `Skipped words (${k}): ${ws.map(x => M.w[x.s + ':' + x.a][x.w - 1]).join(' ')}. Missing from the translation: ${ms}`);
  }
  return L3(`درست لفظ: ${ar} (${mean})۔ سنا گیا: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}۔ ${hm ? `مطلب بدل گیا: «${mean}» کی جگہ «${hm}»۔` : 'اس لفظ کا ترجمہ آیت میں ضائع/غلط ہو جاتا ہے۔'}`,
    `Sahi lafz: ${ar} (${mean}). Suna gaya: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}. ${hm ? `Matlab badal gaya: "${mean}" ki jagah "${hm}".` : 'Is lafz ka tarjma ayat mein zaya/ghalat ho jata hai.'}`,
    `Correct word: ${ar} (${mean}). Heard: ${heardTxt(m)}${hm ? ' (' + hm + ')' : ''}. ${hm ? `Meaning shifts: "${mean}" becomes "${hm}".` : 'The meaning of this word is lost or wrong in the translation.'}`);
}
const kindTxt = k => ({ wrong: R('kWrong'), skip: R('kSkip'), jump: R('kJump') }[k] || k);
function section(title, body, cls) { return body ? `<div class="rs ${cls || ''}"><h5>${esc(title)}</h5>${body}</div>` : ''; }
function mistakeList(list, soft) {
  return list.map(m => { const y = AY[m.ai], w = SC[m.idx]; return `<div class="ri"><b>${esc(ayRef(m.ai))}</b> · ${esc(kindTxt(m.kind))} · ${esc(M.w[w.s + ':' + w.a][w.w - 1])} ${cmpBtns(m)}<br><small>${esc(impact(m, soft))}</small></div>`; }).join('');
}
function daurHtml(d, final) {
  if (!DICT) dictBuild(); const s = dStats(d);
  const cards = `<div class="rc"><div><b>${A.st().ui === 'ur' ? ad(s.cleanPct) : s.cleanPct}%</b><small>${esc(R('clean'))}</small></div><div><b>${d.mist.length}</b><small>${esc(R('hard'))}</small></div><div><b>${d.stalls.length}</b><small>${esc(R('stall'))}</small></div><div><b>${d.soft.length}</b><small>${esc(R('doubt'))}</small></div><div><b>${fmtT(d.t1 - d.t0)}</b><small>${esc(R('time'))}</small></div><div><b>${s.wpm}</b><small>${esc(R('wpm'))}</small></div></div>`;
  const stalls = d.stalls.map(x => `<div class="ri"><b>${esc(ayRef(x.ai))}</b> · ${esc(R('atka'))}: ${esc(M.w[SC[x.idx].s + ':' + SC[x.idx].a][SC[x.idx].w - 1])} ${cmpBtns(x)}</div>`).join('');
  const soft = d.soft.map(m => `<div class="ri"><b>${esc(ayRef(m.ai))}</b> · ${esc(M.w[SC[m.idx].s + ':' + SC[m.idx].a][SC[m.idx].w - 1])}${m.heard && m.heard.length ? ' ← ' + esc(heardTxt(m)) : ''} ${cmpBtns(m)}</div>`).join('');
  const clean = s.clean.length ? `<div class="ri">${s.clean.map(i => esc(ayRef(i))).join(' · ')}</div>` : '';
  return cards + section(R('secHard'), mistakeList(d.mist), 'bad') + section(R('secStall'), stalls, 'warn') + section(R('secDoubt'), soft && `<p class="pn">${esc(R('doubtNote'))}</p>` + soft) + section(R('secOk'), clean, 'ok') + (() => { const h = hkRows(flagSet([d]), true); return h ? section(R('secHk'), `<p class="pn">${esc(R('hkNote'))}</p>` + h, 'warn') : ''; })();
}
function showDaurReport(d) {
  VM = { fi: hz.fi, ti: hz.ti }; const last = hz.daur >= (hz.plan.reps || 1);
  $('#rrep').innerHTML = `<div class="rrin"><h4>${esc(R('daurRep'))} ${hz.daur}/${hz.plan.reps || 1}</h4>${daurHtml(d)}<p class="rq">${esc(R('ask'))}</p>` +
    `<button class="po on" data-rn="${last ? 'final' : 'next'}">${esc(last ? R('noteFinal') : R('noteNext') + ' (' + (hz.daur + 1) + '/' + (hz.plan.reps || 1) + ')')}</button>` +
    `<button class="po" data-rn="again">${esc(R('again'))}</button><button class="po" data-rn="final">${esc(R('stopFinal'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; hz.busy = true;
}
function finalHtml(all, meta) {
  if (!DICT) dictBuild(); VM = { fi: meta.fi, ti: meta.ti }; const cnt = {}, st = {};
  all.forEach(d => { d.mist.forEach(m => { cnt[m.ai] = (cnt[m.ai] || 0) + 1; }); d.stalls.forEach(m => { st[m.ai] = (st[m.ai] || 0) + 1; }); });
  const rows = all.map(d => { const s = dStats(d); return `<div class="ri"><b>${esc(R('daur'))} ${d.n}</b> · ${s.cleanPct}% · ${esc(R('hard'))} ${d.mist.length} · ${esc(R('stall'))} ${d.stalls.length} · ${esc(R('doubt'))} ${d.soft.length} · ${fmtT(d.t1 - d.t0)} · ${s.wpm} ${esc(R('wpm'))}</div>`; }).join('');
  const rep = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${cnt[i]} ${esc(R('times'))}${st[i] ? ' + ' + esc(R('atka')) + ' ' + st[i] : ''}</div>`).join('');
  const stl = Object.keys(st).filter(i => !cnt[i]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${esc(R('atka'))} ${st[i]} ${esc(R('times'))}</div>`).join('');
  const everClean = []; for (let i = meta.fi; i <= meta.ti; i++) if (!cnt[i] && !st[i]) everClean.push(i);
  const tot = all.reduce((a, d) => a + dStats(d).cleanPct, 0), avg = Math.round(tot / all.length);
  const allMist = all.flatMap(d => d.mist.map(m => Object.assign({ daur: d.n }, m)));
  const imp = allMist.map(m => `<div class="ri"><b>${esc(R('daur'))} ${m.daur} · ${esc(ayRef(m.ai))}</b> ${cmpBtns(m)}<br><small>${esc(impact(m))}</small></div>`).join('');
  const trend = all.length > 1 ? (() => { const a = dStats(all[0]).cleanPct, b = dStats(all[all.length - 1]).cleanPct; return `<p class="pn">${esc(R('trend'))}: ${a}% → ${b}%</p>`; })() : '';
  return `<div class="rc"><div><b>${all.length}</b><small>${esc(R('daurs'))}</small></div><div><b>${avg}%</b><small>${esc(R('avgClean'))}</small></div><div><b>${allMist.length}</b><small>${esc(R('hard'))}</small></div></div>${trend}` +
    section(R('secRange'), `<div class="ri">${esc(ayRef(meta.fi))} → ${esc(ayRef(meta.ti))}</div>`) + section(R('secPer'), rows) + section(R('secRep'), rep + stl, 'bad') + section(R('secImpact'), imp, 'bad') +
    section(R('secOkAll'), everClean.length ? `<div class="ri">${everClean.map(i => esc(ayRef(i))).join(' · ')}</div>` : '', 'ok') + section(R('secHk'), `<p class="pn">${esc(R('hkNote'))}</p>` + hkRows(flagSet(all), false), 'warn') + `<p class="pn">${esc(R('limits'))}</p>`;
}
function reportText(all, meta) {
  const tmp = document.createElement('div'); tmp.innerHTML = finalHtml(all, meta).replace(/<\/(div|h5|p|small)>/g, '\n$&').replace(/<br>/g, '\n'); return tmp.textContent.replace(/\n{2,}/g, '\n').trim();
}
function showFinal(all, meta, fromHist) {
  $('#rrep').innerHTML = `<div class="rrin"><h4>${esc(R('finalRep'))}</h4>${finalHtml(all, meta)}` +
    `<button class="po" data-rn="copy">${esc(R('copy'))}</button>` + (fromHist ? '' : `<button class="po on" data-rn="new">${esc(R('newPlan'))}</button>`) + `<button class="po" data-rn="close">${esc(R('close'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; $('#rrep')._fin = { all, meta };
}
function hzFinishAll(partial) {
  hz.busy = true;
  const meta = { fi: hz.fi, ti: hz.ti, ps: hz.plan }; const all = hz.all.slice();
  if (partial && hz.cur && hz.cur.words >= 3 && !all.includes(hz.cur)) { hz.cur.t1 = Date.now(); hz.cur.reach = hz.tr ? SC[Math.min(hz.tr.p, SC.length - 1)].ai : hz.ti; all.push(hz.cur); }
  hzStop(); if (!all.length) return;
  try { const h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); h.unshift({ at: Date.now(), meta, all: all.map(d => Object.assign({}, d)), lay, names: [AY[meta.fi].s + ':' + AY[meta.fi].a, AY[meta.ti].s + ':' + AY[meta.ti].a] }); localStorage.setItem('fahm.hist', JSON.stringify(h.slice(0, 20))); } catch (e) { }
  showFinal(all, meta, false);
}
function hzRepAction(act) {
  if (act === 'next') { hz.daur++; $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'again') { hz.all.pop(); $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'final') { $('#rrep').hidden = true; hzFinishAll(); }
}
function popHist() {
  let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (e) { }
  const nm = loc => { const [s, a] = loc.split(':').map(Number); return surahName(s) + ' ' + a; };
  $('#rpop').dataset.pk = 'hist';
  $('#rpop').innerHTML = `<h4>${esc(R('history'))}</h4>` + (h.length ? h.map((x, i) => { return `<button class="po" data-hi="${i}">${esc(new Date(x.at).toLocaleDateString())} · ${esc(nm(x.names[0]))} → ${esc(nm(x.names[1]))} · ${x.all.length}×</button>`; }).join('') : `<p class="pn">—</p>`);
  $('#rpop').hidden = false;
}

/* ---------- UI ---------- */
function popClose() { $('#rpop').hidden = true; $('#rpop').dataset.pk = ''; }
function popLayout() {
  const st = A.st(); const row = (k, t, on) => `<button class="po ${on ? 'on' : ''}" data-lay="${k}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('layout'))}</h4>` + ['15', '13q', '13t'].map(k => row(k, R('lay' + k), lay === k)).join('') + ``;
  $('#rpop').hidden = false;
}
function popHafiz() {
  const st = A.st(); const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))}</h4><div class="pr"><span>${esc(R('sens'))}</span>${sw('hs', 'h', R('sH'), (st.hs || 'h') === 'h')}${sw('hs', 'n', R('sN'), st.hs === 'n')}${sw('hs', 's', R('sS'), st.hs === 's')}</div>` +
    `<div class="pr"><span>${esc(R('sil'))}</span>${[3.5, 4, 5].map(v => sw('hsil', v, v + ' ' + R('sec'), (st.hsil || 4) === v)).join('')}</div>` +
    `<div class="pr"><span></span>${sw('hmode', 'look', R('look'), (st.hmode || 'look') === 'look')}${sw('hmode', 'mem', R('mem'), st.hmode === 'mem')}</div>` +
    `<div class="pr"><span>${esc(R('flowL'))}</span>${sw('hflow', 'flow', R('flowOn'), (st.hflow || 'flow') === 'flow')}${sw('hflow', 'ustad', R('flowOff'), st.hflow === 'ustad')}</div>` +
    `<div class="pr"><span>${esc(R('tickL'))}</span>${sw('htick', 'on', R('on'), (st.htick || 'on') === 'on')}${sw('htick', 'off', R('off'), st.htick === 'off')}</div>` +
    `<div class="pr"><span>${esc(R('recL'))}</span>${sw('hrec', 'on', R('on'), st.hrec === 'on')}${sw('hrec', 'off', R('off'), (st.hrec || 'off') === 'off')}</div><div class="sec">${esc(R('fastL'))}</div><div class="chips">${sw('hfast', 'on', R('on'), fastOn())}${sw('hfast', 'off', R('off'), !fastOn())}</div>` +
    (fastOn() ? `<div class="chips">${FASTQ.map(f => sw('hfq', f, recName(f), (st.hfq || FASTQ[0]) === f)).join('')}</div><div class="pr"><span>${esc(R('rateL'))}</span>${[1, 1.25, 1.5].map(v => sw('hrate', v, v + '×', fastRate() === v)).join('')}</div><p class="pn">${esc(R('fastNote'))}</p>` : '') +
    `<p class="pn">${esc(R('info'))}</p>`;
  $('#rpop').hidden = false;
}
function applyZoom(d) { const st = A.st(); st.rz = Math.max(1, Math.min(1.8, Math.round(((st.rz || 1) + d) * 100) / 100)); A.save(); sizePage(); fit(); }
function openAt(s, a) {
  return load().then(() => {
    lay = A.st().lay || '15'; if (!M.L[lay]) lay = '15'; buildIndex();
    let i = 0; const f = LP[locOf(s, a, 1)]; if (f !== undefined) i = f; else { const w = SC.find(x => x.s === s); if (w) i = LP[w.loc]; }
    pi = i; open = true; $('#reader').hidden = false; document.body.classList.add('noscroll'); $('#rhz').hidden = true; hz.on = false; applyRot();
    renderPage(false); if (AYI[s + ':' + a] != null) curAy = { s, a };
    requestAnimationFrame(() => { sizePage(); fit(); });
  });
}
function applyRot() { sizePage(); }
function close() { hzStop(); stopAudio(); open = false; $('#reader').hidden = true; popClose(); A.onClose(); }
function relayout(k) {
  const keep = curAy || (SC[0] && { s: SC[0].s, a: SC[0].a }); const was = hz.on; if (was) hzStop(); stopAudio();
  lay = k; A.st().lay = k; A.save(); buildIndex();
  const w = keep && SC.find(x => x.s === keep.s && x.a === keep.a); pi = w ? LP[w.loc] : 0; okSet = new Set(); renderPage(false);
}
/* ====== own-voice recording: saved inside the app (IndexedDB), pause/resume, offline daur ====== */
const DB = {
  db: null,
  open() { return this.db ? Promise.resolve(this.db) : new Promise((res, rej) => { const q0 = indexedDB.open('fahm-rec', 1); q0.onupgradeneeded = () => { q0.result.createObjectStore('meta', { keyPath: 'id', autoIncrement: true }); q0.result.createObjectStore('blobs', { keyPath: 'id' }); }; q0.onsuccess = () => { this.db = q0.result; res(q0.result); }; q0.onerror = () => rej(q0.error); }); },
  run(stores, mode, fn) { return this.open().then(db => new Promise((res, rej) => { const t = db.transaction(stores, mode); let out; try { out = fn(t); } catch (e) { rej(e); return; } t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); })); },
  put(meta, blob) { return this.open().then(db => new Promise((res, rej) => { const t = db.transaction(['meta', 'blobs'], 'readwrite'); const rq = t.objectStore('meta').add(meta); rq.onsuccess = () => { t.objectStore('blobs').put({ id: rq.result, blob }); }; t.oncomplete = () => res(rq.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); })); },
  all() { return this.run(['meta'], 'readonly', t => t.objectStore('meta').getAll()); },
  blob(id) { return this.run(['blobs'], 'readonly', t => t.objectStore('blobs').get(id)).then(r => r && r.blob); },
  del(id) { return this.run(['meta', 'blobs'], 'readwrite', t => { t.objectStore('meta').delete(id); t.objectStore('blobs').delete(id); }); }
};
const mistTotal = () => hz.all.reduce((n, d) => n + d.mist.length, 0) + (hz.cur && !hz.all.includes(hz.cur) ? hz.cur.mist.length : 0);
function ownStart(ai) {
  if (!navigator.mediaDevices || !window.MediaRecorder) { A.toast(R('myNoMic'), 4500); return; }
  const y = AY[ai], z = AY[AY.length - 1]; hz.ownNext = true;
  hzStart(ai, { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: 1 });
}
/* an ayah is finished when the tracked position moves into a later ayah: remember its time slice */
function ownAdvance(newAi) {
  const r = hz.rec; if (!hz.own || !r || r.ended || hz.ownAi == null) return;
  newAi = Math.min(newAi, hz.ti + 1); if (newAi <= hz.ownAi) return;
  const now = Date.now() - r.t0;
  if (newAi - hz.ownAi > 3) { hz.ownAi = newAi; r.lastB = now; return; }
  let tot = 0; for (let ai = hz.ownAi; ai < newAi; ai++) tot += AY[ai].last - AY[ai].first + 1;
  let acc = 0; const t0 = r.lastB;
  for (let ai = hz.ownAi; ai < newAi; ai++) { const w = AY[ai].last - AY[ai].first + 1; acc += w; const b = Math.round(t0 + (now - t0) * acc / tot); r.marks.push([ai, r.lastB, b]); r.lastB = b; }
  hz.ownAi = newAi;
  if (now > 15 * 60000 && hz.on && newAi <= hz.ti) { recEnd(); hz.rec = null; recBegin(); }   /* keep each saved part short (<15 min) */
}
async function snapMarks(blob, marks) {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext; const ab = await blob.arrayBuffer();
  const buf = await new Ctx(1, 1, 16000).decodeAudioData(ab); const d = buf.getChannelData(0), F = 320, n = Math.floor(d.length / F), e = new Float32Array(n);
  for (let i = 0; i < n; i++) { let q1 = 0; for (let j = 0; j < F; j++) { const v = d[i * F + j]; q1 += v * v; } e[i] = Math.sqrt(q1 / F); }
  const sm = i => { let q1 = 0, c = 0; for (let k = -1; k <= 1; k++) { const v = e[i + k]; if (v !== undefined) { q1 += v; c++; } } return q1 / c; };
  const out = marks.map(m => m.slice());
  for (let k = 0; k < out.length - 1; k++) {
    const b = out[k][2], lo = Math.max(0, Math.round((b - 2000) / 20)), hi = Math.min(n - 1, Math.round((b + 300) / 20)); if (hi <= lo) continue;
    let best = lo, bv = 1e9, sum = 0; for (let i = lo; i <= hi; i++) { const v = sm(i); sum += v; if (v < bv) { bv = v; best = i; } }
    const nb = bv < (sum / (hi - lo + 1)) * 0.4 ? best * 20 + 10 : Math.max(out[k][1] + 300, b - 350); out[k][2] = nb; out[k + 1][1] = nb;
  }
  return out;
}
async function ownSave(r) {
  const marks = r.marks || []; if (!marks.length || !r.chunks.length) { A.toast(R('myNothing')); return; }
  const blob = new Blob(r.chunks, { type: r.mr.mimeType || 'audio/webm' }); let mk = marks;
  try { mk = await snapMarks(blob, marks); } catch (e) { }
  const first = marks[0][0], lastA = marks[marks.length - 1][0];
  const meta = { t: Date.now(), from: first, to: lastA, dur: Date.now() - r.t0, mime: blob.type, size: blob.size, marks: mk, mist: Math.max(0, mistTotal() - (hz.ownM0 || 0)) };
  try { await DB.put(meta, blob); const st = A.st(); st.mrec = { last: lastA }; A.save(); A.toast('✓ ' + R('mySaved') + ': ' + ayRef(first) + ' → ' + ayRef(lastA), 4500); }
  catch (e) { A.toast(R('myNoMic'), 4500); }
}
function popMine() {
  const st = A.st(), ur = st.ui === 'ur', last = st.mrec && st.mrec.last != null ? st.mrec.last : -1, next = Math.min(AY.length - 1, last + 1), y = AY[next];
  const sOpt = surahsInScope().map(s => `<option value="${s}" ${s === y.s ? 'selected' : ''}>${esc(surahName(s))}</option>`).join('');
  const aOpt = AY.filter(z => z.s === y.s).map(z => `<option value="${z.a}" ${z.a === y.a ? 'selected' : ''}>${ur ? ad(z.a) : z.a}</option>`).join('');
  $('#rpop').dataset.pk = 'm';
  $('#rpop').innerHTML = `<h4>● ${esc(R('myTitle'))}</h4><p class="pn">${esc(R('myInfo'))}</p>` +
    `<div class="card"><div class="sec" style="margin:0 0 4px">${esc(R('myProg'))}</div><b>${last >= 0 ? esc(ayRef(last)) + ' ✓' : esc(R('myNone'))}</b></div>` +
    (last >= 0 && last < AY.length - 1 ? `<button class="po on" data-mgo="${next}">▶ ${esc(R('myCont'))} — ${esc(ayRef(next))}</button>` : '') +
    `<div class="sec">${esc(R('from'))}</div><div class="pr"><select id="mfS" class="sel">${sOpt}</select><select id="mfA" class="sel">${aOpt}</select></div>` +
    `<button class="po ${last < 0 ? 'on' : ''}" data-mgo="sel">● ${esc(R('myNew'))}</button><div class="chips"><button class="po sm" data-mlist="1">${esc(R('myList'))}</button></div>`;
  $('#rpop').hidden = false;
}
let delPend = null;
async function popMyList() {
  const st = A.st(), reps = st.mreps || 1; $('#rpop').dataset.pk = 'ml'; $('#rpop').hidden = false;
  let parts = []; try { parts = await DB.all(); } catch (e) { }
  parts.sort((a, b) => a.from - b.from || a.t - b.t);
  const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('myList'))}</h4><div class="pr"><span>${esc(R('myReps'))}</span>${[1, 2, 3, 5].map(v => sw('mreps', v, String(v), reps === v)).join('')}</div>` +
    (parts.length ? parts.map(p => `<div class="card"><b>${esc(ayRef(p.from))} → ${esc(ayRef(p.to))}</b><div class="sum">${Math.max(1, Math.round(p.dur / 60000))} ${esc(R('myMin'))} · ${new Date(p.t).toLocaleDateString()}${p.mist ? ' · ' + p.mist + ' ' + esc(R('hard')) : ''}</div><div class="rowx"><button class="po sm on" data-mp="${p.id}">▶ ${esc(R('myDaur'))}</button><button class="po sm" data-mx="${p.id}">⬇</button><button class="po sm" data-md="${p.id}">🗑</button></div></div>`).join('') : `<p class="pn">${esc(R('myEmpty'))}</p>`) +
    `<div class="chips"><button class="po sm" data-mine="1">←</button></div>`;
}
function mineDel(btn) {
  const id = +btn.dataset.md;
  if (delPend !== id) { delPend = id; btn.textContent = R('myDelAsk'); setTimeout(() => { if (delPend === id) delPend = null; }, 4000); return; }
  delPend = null; DB.del(id).then(popMyList).catch(() => { });
}
async function mineExport(id) {
  try { const b = await DB.blob(id); if (!b) { A.toast(R('myNoAudio')); return; } const u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = 'fahm-recitation-' + id + '.webm'; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(u); }, 3000); } catch (e) { A.toast(R('myNoAudio')); }
}
/* offline daur: plays the Hafiz's own saved voice ayah by ayah with the page following along */
let mine = null, mineTok = 0;
function stopMine() { if (!mine) return; mine.tok = -1; try { mine.src.onended = null; mine.src.stop(); } catch (e) { } mine = null; }
function hotAt(y, frac) {
  const ws = ayWords(y.s, y.a); if (!ws.length) return; const tot = ws.reduce((x, w) => x + w.n.length + 1, 0), t = Math.max(0, Math.min(1, frac)) * tot; let acc = 0, pick = ws[ws.length - 1];
  for (const w of ws) { acc += w.n.length + 1; if (t <= acc) { pick = w; break; } }
  if (hot !== pick.loc) { const o = hot && q(hot); if (o) o.classList.remove('hot'); hot = pick.loc; ensureLoc(pick.loc); const e = q(pick.loc); if (e) e.classList.add('hot', 'cur'); }
}
async function minePlay(id) {
  stopAudio(); stopCmp(); popClose(); unlockAc(); if (!ac) return;
  let parts = []; try { parts = await DB.all(); } catch (e) { } const p = parts.find(x => x.id === id); if (!p) { A.toast(R('myNoAudio')); return; }
  let buf; try { const b = await DB.blob(id), Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext; buf = await new Ctx(1, 1, 16000).decodeAudioData(await b.arrayBuffer()); } catch (e) { A.toast(R('myNoAudio')); return; }
  const tok = ++mineTok; mine = { buf, list: p.marks, i: 0, rep: 1, reps: A.st().mreps || 1, tok }; setPlaying(true); mineStep(tok);
}
function mineStep(tok) {
  if (!mine || mine.tok !== tok) return;
  if (mine.i >= mine.list.length) { if (mine.rep < mine.reps) { mine.rep++; mine.i = 0; } else { stopAudio(); return; } }
  const m = mine.list[mine.i], y = AY[m[0]]; setCur(y.s, y.a);
  const off = Math.max(0, m[1] / 1000 - 0.05), dur = Math.max(0.3, (m[2] - m[1]) / 1000 + 0.12), src = ac.createBufferSource();
  src.buffer = mine.buf; src.connect(ac.destination); mine.src = src; mine.t0 = ac.currentTime; mine.dur = dur;
  src.onended = () => { if (mine && mine.tok === tok && mine.src === src) { mine.i++; setTimeout(() => mineStep(tok), 150); } };
  src.start(0, off, dur); clearInterval(tickT); tickT = setInterval(() => { if (mine && mine.tok === tok) hotAt(y, (ac.currentTime - mine.t0) / mine.dur); }, 70);
}
function init(api) {
  A = api;
  if ($('#rList')) $('#rList').onclick = () => A.openMenu();
  $('#rClose').onclick = close; $('#rTitle').onclick = () => { if ($('#rpop').dataset.pk === 'g' && !$('#rpop').hidden) popClose(); else popGoto(); }; $('#rPg').onclick = $('#rTitle').onclick;
  $('#rLay').onclick = () => { if ($('#rpop').hidden || !$('#rpop').dataset.pk || $('#rpop').dataset.pk !== 'l') { $('#rpop').dataset.pk = 'l'; popLayout(); } else popClose(); };
  $('#rMinus').onclick = () => applyZoom(-0.15); $('#rPlus').onclick = () => applyZoom(0.15);
  $('#rPrev').onclick = () => goPage(pi - 1); $('#rNext').onclick = () => goPage(pi + 1);
  $('#rPlay').onclick = () => {
    if (hz.on) { hzStop(); return; }
    if (playing) { stopAudio(); return; }
    const st = curAy ? AYI[curAy.s + ':' + curAy.a] : null; let ai = st != null ? st : 0;
    if (st == null) { const w = SC.find(x => LP[x.loc] === pi); if (w) ai = w.ai; } playSeq(ai);
  };
  $('#rMic').onclick = () => { if (hz.on) { hzStopAsk(); return; } if ($('#rpop').dataset.pk === 's' && !$('#rpop').hidden) popClose(); else popSetup(); };
  $('#rhHold').onclick = () => { hzStop(); };
  $('#rhStop').onclick = hzStopAsk; $('#rhSet').onclick = () => { if ($('#rpop').hidden || $('#rpop').dataset.pk !== 'h') { $('#rpop').dataset.pk = 'h'; popHafiz(); } else popClose(); };
  $('#rhMode').onclick = () => { const st = A.st(); st.hmode = st.hmode === 'mem' ? 'look' : 'mem'; A.save(); $('#rpage').classList.toggle('mem', st.hmode === 'mem'); $('#rhMode').textContent = R(st.hmode); };
  $('#rrep').addEventListener('click', e => {
    const q1 = e.target.closest('[data-hq]'); if (q1) { playQari(+q1.dataset.hq); return; }
    const m1 = e.target.closest('[data-hm]'); if (m1) { playMine(+m1.dataset.hm); return; }
    const b = e.target.closest('[data-rn]'); if (!b) return; const k = b.dataset.rn;
    if (k === 'copy') { const f = $('#rrep')._fin; if (f) { const t = reportText(f.all, f.meta); try { navigator.clipboard.writeText(t); A.toast('✓'); } catch (x) { A.toast(t.slice(0, 200)); } } return; }
    if (k === 'close') { $('#rrep').hidden = true; return; }
    if (k === 'new') { $('#rrep').hidden = true; popSetup(); return; }
    hzRepAction(k);
  });
  $('#rpop').addEventListener('click', e => {
    const l = e.target.closest('[data-lay]'); if (l) { relayout(l.dataset.lay); popClose(); return; }
    const hk = e.target.closest('[data-hk]');
    if (hk && hk.dataset.hk === 'mreps') { A.st().mreps = +hk.dataset.hv; A.save(); popMyList(); return; }
    if (hk && hk.dataset.hk === 'reps') { const pl = Object.assign({}, planDefault()); pl.reps = +hk.dataset.hv; A.st().hplan = pl; A.save(); popSetup(); return; }
    if (hk) { const st = A.st(), k = hk.dataset.hk; st[k] = (k === 'hsil' || k === 'hrate') ? +hk.dataset.hv : hk.dataset.hv; A.save(); if (hz.tr && k === 'hs') hz.tr.sens = st.hs; if (k === 'hmode') $('#rpage').classList.toggle('mem', st.hmode === 'mem'); popHafiz(); if (hz.on) $('#rhMode').textContent = R(st.hmode || 'look'); return; }
    if (e.target.closest('[data-hset]')) { $('#rpop').dataset.pk = 'h'; popHafiz(); return; }
    if (e.target.closest('[data-hist]')) { popHist(); return; }
    const q2 = e.target.closest('[data-q]'); if (q2) { setPlanQuick(q2.dataset.q); return; }
    const am = e.target.closest('[data-amt]'); if (am) { const pl = Object.assign({}, planDefault(), readPlan()); const v = +am.dataset.amt, fi = AYI[pl.fs + ':' + pl.fa], z = AY[endForAmt(fi, v)]; pl.ts = z.s; pl.ta = z.a; pl.amt = v; A.st().hplan = pl; A.save(); popSetup(); return; }
    if (e.target.closest('[data-mine]')) { popMine(); return; }
    if (e.target.closest('[data-mlist]')) { popMyList(); return; }
    const mg = e.target.closest('[data-mgo]'); if (mg) { const v = mg.dataset.mgo; const ai = v === 'sel' ? AYI[$('#mfS').value + ':' + $('#mfA').value] : +v; if (ai != null) ownStart(ai); return; }
    const mp = e.target.closest('[data-mp]'); if (mp) { minePlay(+mp.dataset.mp); return; }
    const mx = e.target.closest('[data-mx]'); if (mx) { mineExport(+mx.dataset.mx); return; }
    const md = e.target.closest('[data-md]'); if (md) { mineDel(md); return; }
    if (e.target.closest('[data-gp]')) { const n = parseInt($('#gP').value, 10); if (n >= 1 && n <= PG.length) { goPage(n - 1); popClose(); } return; }
    const hi = e.target.closest('[data-hi]'); if (hi) { let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (x) { } const x = h[+hi.dataset.hi]; if (x) { popClose(); if (x.lay && x.lay !== lay) relayout(x.lay); showFinal(x.all, x.meta, true); } return; }
    if (e.target.closest('[data-hres]')) { const st = A.st(), la = st.hlast, pl = Object.assign({}, planDefault()); const fi = AYI[la.s + ':' + la.a]; let ti = AYI[pl.ts + ':' + pl.ta]; if (ti < fi) { let j = fi; while (j + 1 < AY.length && AY[j + 1].s === la.s) j++; ti = j; } const y = AY[fi], z = AY[ti]; hzStart(fi, { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1 }); return; }
    if (e.target.closest('[data-hgo]')) { hzStart(null, readPlan2()); return; }
  });
  $('#rpop').addEventListener('change', e => {
    const id0 = e.target.id;
    if (id0 === 'tJ') { if (e.target.value) { const j = +e.target.value, pl = Object.assign({}, planDefault()), a = juzStartAi(j); pl.fs = AY[a].s; pl.fa = AY[a].a; const z = AY[pl.amt ? endForAmt(a, pl.amt) : juzRange(j)[1]]; pl.ts = z.s; pl.ta = z.a; A.st().hplan = pl; A.save(); popSetup(); } return; }
    if (id0 === 'mfS') { const s0 = +e.target.value, sel = $('#mfA'); sel.innerHTML = AY.filter(y => y.s === s0).map(y => `<option value="${y.a}">${A.st().ui === 'ur' ? ad(y.a) : y.a}</option>`).join(''); return; }
    if (id0 === 'gS') { const ai = AYI[e.target.value + ':1']; if (ai != null) { goPage(pageOfAi(ai)); popClose(); } return; }
    if (id0 === 'gJ') { goPage(pageOfAi(juzStartAi(+e.target.value))); popClose(); return; }
    const id = e.target.id; if (!/^t[ft][SA]$/.test(id)) return;
    if (id === 'tfS' || id === 'ttS') { const s = +e.target.value, sel = $(id === 'tfS' ? '#tfA' : '#ttA'); sel.innerHTML = AY.filter(y => y.s === s).map(y => `<option value="${y.a}">${A.st().ui === 'ur' ? ad(y.a) : y.a}</option>`).join(''); if (id === 'ttS') sel.selectedIndex = sel.options.length - 1; }
    const pl = readPlan(); pl.reps = (A.st().hplan && A.st().hplan.reps) || 1;
    if ((id === 'tfS' || id === 'tfA') && pl.amt) { const z = AY[endForAmt(AYI[pl.fs + ':' + pl.fa], pl.amt)]; pl.ts = z.s; pl.ta = z.a; A.st().hplan = pl; A.save(); popSetup(); return; }
    if (id === 'ttS' || id === 'ttA') pl.amt = 0;
    A.st().hplan = pl; A.save(); if (id === 'ttS' || id === 'ttA') popSetup();
  });
  $('#rin').addEventListener('click', e => {
    popClose(); const w = e.target.closest('.wd'); if (!w) return; const [s, a] = w.dataset.loc.split(':').map(Number); const ai = AYI[s + ':' + a]; if (ai == null) return;
    if (hz.on) { if (!hz.busy && ai >= hz.fi && ai <= hz.ti) { hz.tr.setPos(AY[ai].first); clearAyahMarks(ai); markNext(); savePos(ai); hz.lastAct = Date.now() + 1500; hzStatus('listen'); } return; }
    stopAudio(); playSeq(ai);
  });
  /* swipe + keys: RTL book — finger moving right = next page */
  let sx = null, sy = 0; const stg = $('#rstage');
  stg.addEventListener('touchstart', e => { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } else sx = null; }, { passive: true });
  stg.addEventListener('touchend', e => { if (sx == null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && (A.st().rz || 1) <= 1.01) goPage(pi + (dx > 0 ? 1 : -1)); }, { passive: true });
  document.addEventListener('keydown', e => { if (!open) return; if (e.key === 'ArrowLeft') goPage(pi + 1); else if (e.key === 'ArrowRight') goPage(pi - 1); else if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (open) { sizePage(); fit(); } });
  window.addEventListener('orientationchange', () => { if (open) setTimeout(() => { sizePage(); fit(); }, 250); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && hz.on) hzStop(); });
}
window.FahmReader = {
  init, isOpen: () => open,
  open: (s, a) => openAt(s || 1, a || 1),
  gotoSurah: s => { if (!open) return; stopAudio(); if (hz.on) hzStop(); const w = SC.find(x => x.s === s); if (w) { goPage(LP[w.loc]); } },
  back: () => { if (!$('#rpop').hidden) { popClose(); return true; } close(); return true; },
  /* test hooks */
  _RS: () => RS, _hz: () => hz, _plan: () => hz.plan, _sc: () => SC, _heard: onHeard, _page: () => pi
};
})();

/* Fahm — Mushaf page reader (15-line / 13-line Hafizi IndoPak) + Hafiz live-recitation mode.
   Text + font: DigitalKhatt IndoPak (OFL). Line layouts: Qudratullah 15 & 13 line, Taj 13 line. */
(function () {
'use strict';
let ROOT = null, spread = false, twoUp = false;
const PGID = /^#(rpage|rin|rhd|rpn|rtabs|rfr|rbmk)$/;
const $ = s => (ROOT && PGID.test(s)) ? ROOT.querySelector(s) : document.querySelector(s);
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

Object.assign(RS.ur, { tjDoubt: 'تجوید کا شک', secTj: 'تجوید / مخرج کے شک', tjNote: 'ریکارڈر نے مطلوبہ حرف کی جگہ ملتی جلتی آواز کا حرف سنا (مثلاً ث↔س، ق↔ك)۔ یہ صرف شک ہے، قاری سے ملا کر دیکھ لیں؛ غلطی میں شمار نہیں ہوتا۔', hkBad: 'حرکات کی غلطی (آپ کی نشاندہی)', hkOk: '✓ درست', hkNo: '✗ مجھ سے غلطی ہوئی', hkSelf: 'ہر لفظ قاری سے سن کر ایمانداری سے نشان لگائیں۔ آپ کے نشان رپورٹ اور ہسٹری میں محفوظ ہو جاتے ہیں۔', saveFile: 'فائل ڈاؤن لوڈ کریں', share: 'شیئر کریں', print: 'پرنٹ / PDF', savedApp: 'رپورٹ ہسٹری میں محفوظ ہو گئی', sTitle: 'میری کارکردگی', sDay: 'دن', sWeek: 'ہفتہ', sMonth: 'مہینہ', sYear: 'سال', sRounds: 'دَور', sMin: 'منٹ', sTop: 'سب سے زیادہ دہرائی گئی غلطیاں', sTimeline: 'ٹائم لائن — کب کیا غلطی ہوئی', sNone: 'اس مدت میں کوئی تلاوت نہیں', sReports: 'محفوظ رپورٹیں', micWeak: 'مائیک کی آواز کمزور لگ رہی ہے — فون منہ کے قریب رکھیں۔ شک والی جگہیں غلطی نہیں گنی جائیں گی۔', goto: 'کہاں جانا ہے', surahL: 'سورت', juzL: 'پارہ', go: 'جائیں', pickJuz: 'پارہ چنیں', target: 'روزانہ ہدف', resume: 'جہاں چھوڑا تھا وہیں سے', from: 'کہاں سے', to: 'کہاں تک', reps: 'کتنے دَور', quick: 'جلدی چنیں', qFat: 'فاتحہ', qJuz: 'پارہ', qAll: 'پورا قرآن', history: 'پچھلی رپورٹیں', daur: 'دَور', kWrong: 'لفظ بدلا', kSkip: 'لفظ چھوٹا', kJump: 'آیت بدلی', clean: 'درست آیات', hard: 'سخت غلطی', stall: 'اٹکا', doubt: 'شک', time: 'وقت', wpm: 'لفظ/منٹ', atka: 'یہاں اٹکے', secHard: 'سخت غلطیاں اور ان کا اثر', secStall: 'کہاں کہاں اٹکے (لقمہ)', secDoubt: 'شک والی جگہیں', doubtNote: 'یہاں ریکارڈر نے صاف نہیں سنا یا چھوٹا لفظ ہلکا چھوٹا؛ بہاؤ نہیں توڑا گیا، دوبارہ دیکھ لیں۔', secOk: 'کیا درست رہا', daurRep: 'دَور کی رپورٹ', ask: 'کیا آپ نے یہ ساری غلطیاں نوٹ کر لیں؟ کیا الگ دَور شروع کریں؟', noteNext: 'نوٹ کر لیں — اگلا دَور', noteFinal: 'نوٹ کر لیں — آخری رپورٹ', again: 'اسی دَور کو دوبارہ', stopFinal: 'رکیں — آخری رپورٹ دکھائیں', finalRep: 'آخری رپورٹ', copy: 'رپورٹ کاپی کریں', newPlan: 'نیا ہدف / دَور', close: 'بند کریں', daurs: 'دَور', avgClean: 'اوسط درست', trend: 'پہلے سے آخری دَور', secRange: 'ہدف', secPer: 'ہر دَور', secRep: 'بار بار کی غلطیاں', secImpact: 'غلطیوں سے ترجمے/معنی کا نقصان', secOkAll: 'ہر دَور میں درست رہی آیات', limits: 'نوٹ: غلطی صرف الفاظ کی سطح پر پکڑی جاتی ہے؛ زبر/زیر/تجوید کی پہچان ریکارڈر نہیں کر سکتا۔', times: 'بار', info: 'نوٹ: آواز کی پہچان انٹرنیٹ سے ہوتی ہے، صرف الفاظ جانچتی ہے (حرکات/تجوید نہیں)۔ حافظ موڈ صرف سخت غلطی (آیت بدلنا، لمبا چھوٹنا) پر روکتا ہے۔', sS: 'سخت', sN: 'درمیانی', sH: 'حافظ (تیز رفتار)' });
Object.assign(RS.ru, { tjDoubt: 'Tajweed ka shak', secTj: 'Tajweed / makhraj ke shak', tjNote: 'Recogniser ne matlooba harf ki jagah milti-julti awaaz ka harf suna (masalan ث↔س, ق↔ك). Yeh sirf shak hai, qari se mila kar dekh lein; galti mein shamil nahin hota.', hkBad: 'Harakat ki galti (aapki nishandahi)', hkOk: '✓ Durust', hkNo: '✗ Mujh se galti hui', hkSelf: 'Har lafz qari se sun kar imandari se nishan lagayein. Aapke nishan report aur history mein mehfooz ho jate hain.', saveFile: 'File download karein', share: 'Share karein', print: 'Print / PDF', savedApp: 'Report history mein mehfooz ho gayi', sTitle: 'Meri karkardagi', sDay: 'Din', sWeek: 'Hafta', sMonth: 'Mahina', sYear: 'Saal', sRounds: 'Daur', sMin: 'Minute', sTop: 'Sab se ziyada dohrai gayi galtiyan', sTimeline: 'Timeline — kab kya galti hui', sNone: 'Is muddat mein koi tilawat nahin', sReports: 'Mehfooz reports', micWeak: 'Mic ki awaaz kamzor lag rahi hai — phone munh ke qareeb rakhein. Shak wali jagahein galti nahin ginni jayengi.', goto: 'Kahan jana hai', surahL: 'Surah', juzL: 'Para', go: 'Jayein', pickJuz: 'Para chunein', target: 'Rozana target', resume: 'Jahan chhoda tha wahin se', from: 'Kahan se', to: 'Kahan tak', reps: 'Kitne daur', quick: 'Jaldi chunein', qFat: 'Fatiha', qJuz: 'Para', qAll: 'Poora Quran', history: 'Pichhli reports', daur: 'Daur', kWrong: 'Lafz badla', kSkip: 'Lafz chhoota', kJump: 'Ayat badli', clean: 'Durust ayat', hard: 'Sakht galti', stall: 'Atke', doubt: 'Shak', time: 'Waqt', wpm: 'lafz/min', atka: 'Yahan atke', secHard: 'Sakht galtiyan aur unka asar', secStall: 'Kahan kahan atke (lukma)', secDoubt: 'Shak wali jagahein', doubtNote: 'Yahan recogniser ne saaf nahin suna ya chhota lafz halka chhoota; rawani nahin todi gayi, dobara dekh lein.', secOk: 'Kya durust raha', daurRep: 'Daur ki report', ask: 'Kya aapne yeh saari galtiyan note kar li? Kya alag daur shuru karein?', noteNext: 'Note kar li — agla daur', noteFinal: 'Note kar li — final report', again: 'Isi daur ko dobara', stopFinal: 'Rukein — final report dikhayein', finalRep: 'Final report', copy: 'Report copy karein', newPlan: 'Naya target / daur', close: 'Band karein', daurs: 'Daur', avgClean: 'Ausat durust', trend: 'Pehle se aakhri daur', secRange: 'Target', secPer: 'Har daur', secRep: 'Baar baar ki galtiyan', secImpact: 'Galtiyon se tarjme/matlab ka nuksan', secOkAll: 'Har daur mein durust rahi ayat', limits: 'Note: galti sirf alfaaz ki satah par pakdi jaati hai; zabar/zer/tajweed ki pehchan recogniser nahin kar sakta.', times: 'baar', info: 'Note: awaaz ki pehchan internet se hoti hai aur sirf alfaaz jaanchti hai (harakat/tajweed nahin). Hafiz mode sirf sakht galti (ayat badalna, lamba chhootna) par rokta hai.', sS: 'Sakht', sN: 'Darmiyani', sH: 'Hafiz (tez raftar)' });
Object.assign(RS.en, { tjDoubt: 'Tajweed doubt', secTj: 'Tajweed / makhraj doubts', tjNote: 'The recogniser heard a similar-sounding letter instead of the expected one (for example ث↔س, ق↔ك). This is only a doubt to verify with the qari — it is not counted as a mistake.', hkBad: 'Harakat mistake (marked by you)', hkOk: '✓ Correct', hkNo: '✗ I made a mistake', hkSelf: 'Listen to the qari for each word and mark honestly. Your marks are saved in the report and in your history.', saveFile: 'Download file', share: 'Share', print: 'Print / PDF', savedApp: 'Report saved in your history', sTitle: 'My progress', sDay: 'Day', sWeek: 'Week', sMonth: 'Month', sYear: 'Year', sRounds: 'Rounds', sMin: 'Minutes', sTop: 'Most repeated mistakes', sTimeline: 'Timeline — what went wrong and when', sNone: 'No recitation in this period', sReports: 'Saved reports', micWeak: 'The mic sounds weak — hold the phone closer. Doubtful spots are not counted as mistakes.', goto: 'Go to', surahL: 'Surah', juzL: 'Juz (Para)', go: 'Go', pickJuz: 'Pick a Juz', target: 'Daily target', resume: 'Continue where you left off', from: 'From', to: 'To', reps: 'Number of rounds', quick: 'Quick pick', qFat: 'Fatiha', qJuz: 'Para (Juz)', qAll: 'Whole Quran', history: 'Past reports', daur: 'Round', kWrong: 'Word changed', kSkip: 'Word skipped', kJump: 'Ayah changed', clean: 'Clean ayat', hard: 'Hard mistakes', stall: 'Stalls', doubt: 'Doubts', time: 'Time', wpm: 'words/min', atka: 'Stalled here', secHard: 'Hard mistakes and their effect', secStall: 'Where you stalled (prompt)', secDoubt: 'Doubtful spots', doubtNote: 'The recogniser did not hear these clearly or a small word slipped; the flow was not interrupted — please recheck.', secOk: 'What went right', daurRep: 'Round report', ask: 'Did you note all these mistakes? Start another round?', noteNext: 'Noted — next round', noteFinal: 'Noted — final report', again: 'Repeat this round', stopFinal: 'Stop — show final report', finalRep: 'Final report', copy: 'Copy report', newPlan: 'New target / rounds', close: 'Close', daurs: 'Rounds', avgClean: 'Avg clean', trend: 'First to last round', secRange: 'Target', secPer: 'Each round', secRep: 'Repeated mistakes', secImpact: 'Loss to translation / meaning', secOkAll: 'Ayat clean in every round', limits: 'Note: mistakes are caught at word level only; zabar/zer/tajweed cannot be detected by the recogniser.', times: 'times', info: 'Note: recognition needs internet and checks words only (not harakat/tajweed). Hafiz mode interrupts only for hard mistakes (changed ayah, long skip).', sS: 'Strict', sN: 'Normal', sH: 'Hafiz (fast pace)' });
Object.assign(RS.ru, { rgT: 'Ayat ka daur (range) chalayein', rgH: 'Shuruaati aur aakhri ayat chunein.', rgS: 'Shuru ki ayat', rgE: 'Aakhri ayat', rgSu: 'Surah', rgAy: 'Ayat', rgGo: 'Shuru karein', rgNo: 'Wapas', rgRep: 'Kitni baar dohrayein' });
Object.assign(RS.en, { rgT: 'Play Ayah Range', rgH: 'Configure the start and end ayah for your playback.', rgS: 'Start Ayah', rgE: 'End Ayah', rgSu: 'Surah', rgAy: 'Ayah', rgGo: 'Start', rgNo: 'Cancel', rgRep: 'Repeat' });
Object.assign(RS.ur, { rgT: 'آیات کی رینج چلائیں', rgH: 'شروع اور آخری آیت منتخب کریں۔', rgS: 'ابتدائی آیت', rgE: 'آخری آیت', rgSu: 'سورت', rgAy: 'آیت', rgGo: 'شروع کریں', rgNo: 'منسوخ', rgRep: 'کتنی بار دہرائیں' });
Object.assign(RS.ru, { wrL: 'Sakht galti par awaaz', wrAll: 'Teeno (Eng+Urdu+Arabi)', wrUr: 'Urdu', wrEn: 'English', wrAr: 'Arabi', wrOff: 'Band' });
Object.assign(RS.en, { wrL: 'Voice on a serious mistake', wrAll: 'All three (Eng+Urdu+Arabic)', wrUr: 'Urdu', wrEn: 'English', wrAr: 'Arabic', wrOff: 'Off' });
Object.assign(RS.ur, { wrL: 'سخت غلطی پر آواز', wrAll: 'تینوں (انگریزی+اردو+عربی)', wrUr: 'اردو', wrEn: 'انگریزی', wrAr: 'عربی', wrOff: 'بند' });
Object.assign(RS.ru, { rsT: 'Reader settings', rsLay: 'Mushaf', dmL: 'Page palatne ka andaaz', dmC: 'Kagaz palatna', dmS: 'Slide', dmI: 'Seedha', qrL: 'Qari (tilawat ka qari)', hlL: 'Tilawat ke saath ayat highlight', bgL: 'Background playback (screen band ho tab bhi)', bgN: 'APK mein screen band hone ya app chhupane par bhi awaaz chalti rahegi.', thL: 'Theme', thD: 'Dark', thLt: 'Light' });
Object.assign(RS.en, { rsT: 'Reader settings', rsLay: 'Mushaf', dmL: 'Page-turn style', dmC: 'Page curl', dmS: 'Slide', dmI: 'Instant', qrL: 'Reciter (Qari)', hlL: 'Highlight the ayah while reciting', bgL: 'Background playback (screen off)', bgN: 'In the Android app audio keeps playing with the screen off or the app minimised.', thL: 'Theme', thD: 'Dark', thLt: 'Light' });
Object.assign(RS.ur, { rsT: 'ریڈر ترتیبات', rsLay: 'مصحف', dmL: 'صفحہ پلٹنے کا انداز', dmC: 'کاغذ پلٹنا', dmS: 'سلائیڈ', dmI: 'سیدھا', qrL: 'قاری (تلاوت کا قاری)', hlL: 'تلاوت کے ساتھ آیت ہائی لائٹ', bgL: 'بیک گراؤنڈ پلے بیک (اسکرین بند ہو تب بھی)', bgN: 'اینڈرائیڈ ایپ میں اسکرین بند ہونے یا ایپ چھپانے پر بھی آواز چلتی رہے گی۔', thL: 'تھیم', thD: 'ڈارک', thLt: 'لائٹ' });
Object.assign(RS.ru, { spL: 'Wide screen (do safhe)', spA: 'Auto', spOn: 'On', spOff: 'Off', trL: 'Ayat ke neeche tarjuma', trN: 'Reading mein ayat ke neeche tarjuma ki patti dikhegi (jo tarjuma Settings mein chuna hai).' });
Object.assign(RS.en, { spL: 'Wide screen (two pages)', spA: 'Auto', spOn: 'On', spOff: 'Off', trL: 'Translation under the ayah', trN: 'Shows a translation strip below the page (the translation you picked in Settings).' });
Object.assign(RS.ur, { spL: 'وائڈ اسکرین (دو صفحے)', spA: 'آٹو', spOn: 'آن', spOff: 'آف', trL: 'آیت کے نیچے ترجمہ', trN: 'ریڈنگ میں صفحے کے نیچے ترجمے کی پٹی دکھے گی (جو ترجمہ سیٹنگ میں چنا ہے)۔' });
Object.assign(RS.ru, { bmT: 'Bookmark', bmAdd: 'Is page par bookmark lagao', bmDel: 'Is page ka bookmark hatao', bmNone: 'Abhi koi bookmark nahin', bmP: 'Safha' });
Object.assign(RS.en, { bmT: 'Bookmarks', bmAdd: 'Bookmark this page', bmDel: 'Remove bookmark from this page', bmNone: 'No bookmarks yet', bmP: 'Page' });
Object.assign(RS.ur, { bmT: 'بک مارک', bmAdd: 'اس صفحے پر بک مارک لگائیں', bmDel: 'اس صفحے کا بک مارک ہٹائیں', bmNone: 'ابھی کوئی بک مارک نہیں', bmP: 'صفحہ' });
Object.assign(RS.ru, { rkS: 'Ruku ke hisaab se', rkW: 'Ruku', rkF: 'Kis ruku se', rkT: 'Kis ruku tak', rkN: 'ruku', rkP: 'Para' });
Object.assign(RS.en, { rkS: 'By ruku', rkW: 'Ruku', rkF: 'From ruku', rkT: 'To ruku', rkN: 'ruku', rkP: 'Para' });
Object.assign(RS.ur, { rkS: 'رکوع کے حساب سے', rkW: 'رکوع', rkF: 'کس رکوع سے', rkT: 'کس رکوع تک', rkN: 'رکوع', rkP: 'پارہ' });
Object.assign(RS.ru, { corL: 'Galti par sahi ayat kaun sunaye', corQ: 'Qari', corM: 'Meri apni awaaz', corN: 'Apni awaaz tabhi bajegi jab us ayat ki apni recording save ho; warna Qari sunaayega.' });
Object.assign(RS.en, { corL: 'Who recites the fix after a mistake', corQ: 'Qari', corM: 'My own voice', corN: 'Your own voice plays only if that ayah was saved in your recordings; otherwise the Qari recites it.' });
Object.assign(RS.ur, { corL: 'غلطی پر صحیح آیت کون سنائے', corQ: 'قاری', corM: 'میری اپنی آواز', corN: 'اپنی آواز تبھی چلے گی جب اس آیت کی ریکارڈنگ محفوظ ہو؛ ورنہ قاری سنائے گا۔' });
Object.assign(RS.ru, { backF: 'Peeche se dohra rahe hain — theek hai', resBar: 'Hafiz mode: wahin se shuru karein', resGo: 'Shuru', resNew: 'Naye sire se', snapSaved: 'Aapka sabaq save hai' });
Object.assign(RS.en, { backF: 'Re-reading from earlier — fine', resBar: 'Hafiz mode: continue from where you stopped', resGo: 'Start', resNew: 'Start over', snapSaved: 'Your progress is saved' });
Object.assign(RS.ur, { backF: 'پیچھے سے دوبارہ پڑھ رہے ہیں — ٹھیک ہے', resBar: 'حافظ موڈ: وہیں سے شروع کریں', resGo: 'شروع', resNew: 'نئے سرے سے', snapSaved: 'آپ کا سبق محفوظ ہے' });
Object.assign(RS.ru, { wrongF: 'Galti note ho gayi — padhte rahein', flowL: 'Rawani', flowOn: 'Bina roke (beep + note)', flowOff: 'Ustad (ruk kar sunaye)', tickL: 'Chhoti galti par tik', on: 'On', off: 'Off', recL: 'Meri awaaz record (taqabul ke liye, tajurba)', cQari: 'Qari', cMine: 'Meri awaaz', noRecYet: 'Is jagah ki recording nahin mili (record On karke naya daur shuru karein).', secHk: 'Harkaat ki jaanch-list (mushaf se khud tasdeeq karein)', hkNote: 'Mic harkat nahin sunta. In lafzon par zabar/zer/pesh/shadda badalne se maani badal jate hain. ⚠ = is ayat mein aaj shak/galti bhi thi. Qari button se sahi tilawat sunkar milayein.' });
Object.assign(RS.en, { wrongF: 'Mistake noted — keep going', flowL: 'Flow', flowOn: 'No stopping (beep + note)', flowOff: 'Ustad (stops and recites)', tickL: 'Tick on small slips', on: 'On', off: 'Off', recL: 'Record my voice (to compare, experimental)', cQari: 'Qari', cMine: 'My voice', noRecYet: 'No recording for this spot (turn recording On and start a new round).', secHk: 'Harakat check-list (verify against the mushaf)', hkNote: 'The mic cannot hear harakat. For these words a wrong fatha/kasra/damma/shadda changes the meaning. ⚠ = this ayah also had a doubt/mistake today. Play the qari and compare.' });
Object.assign(RS.ur, { wrongF: 'غلطی نوٹ ہو گئی — پڑھتے رہیں', flowL: 'روانی', flowOn: 'بغیر روکے (بیپ + نوٹ)', flowOff: 'استاد (رک کر سنائے)', tickL: 'چھوٹی غلطی پر ٹِک', on: 'آن', off: 'آف', recL: 'میری آواز ریکارڈ (موازنے کے لیے، تجرباتی)', cQari: 'قاری', cMine: 'میری آواز', noRecYet: 'اس جگہ کی ریکارڈنگ نہیں ملی۔', secHk: 'حرکات کی جانچ فہرست (مصحف سے خود تصدیق کریں)', hkNote: 'مائیک حرکات نہیں سنتا۔ ان الفاظ پر زبر/زیر/پیش/شدّ بدلنے سے معنی بدل جاتے ہیں۔ ⚠ = اس آیت میں آج شک/غلطی بھی تھی۔ قاری سے سن کر ملائیں۔' });
Object.assign(RS.ur, { rakat: 'رکعت', forkL: 'متشابہات کی نشانی', forkOn: 'سنہری نقطہ', forkN: 'جن لفظوں پر دوسری آیت سے ملتے جلتے الفاظ ہیں (لقمہ کی جگہ) وہاں چھوٹا سنہری نقطہ آتا ہے — کوئی آواز نہیں۔' });
Object.assign(RS.ru, { rakat: 'Rakat', forkL: 'Mutashabihat ki nishani', forkOn: 'Sunehri nuqta', forkN: 'Jin lafzon par doosri ayat se milte-julte alfaz hain (lukme ki jagah) wahan chhota sunehri nuqta aata hai — koi awaaz nahin.' });
Object.assign(RS.en, { rakat: 'Rakat', forkL: 'Similar-verse markers', forkOn: 'Gold dot', forkN: 'A small gold dot sits on words where another ayah has near-identical text (the usual place to slip) — no sound.' });
Object.assign(RS.ur, { amt: 'کتنا حصہ', aq: 'چوتھائی پارہ', ah: 'آدھا پارہ', at: 'پون پارہ', a1: 'ایک پارہ', as: 'سوا پارہ', ad: 'ڈیڑھ پارہ', a2: 'دو پارے', fromPara: 'پارے کے آغاز سے', ayW: 'آیات', paraW: 'پارہ', fastL: 'غلطی بتانے والا تیز قاری', fastNote: 'غلطی یا لقمے پر یہ قاری تیز آواز میں آیت سناتا ہے تاکہ آپ کی روانی نہ ٹوٹے۔', rateL: 'قاری کی رفتار', myBtn: 'اپنی آواز میں ریکارڈ کریں', myList: 'میری ریکارڈنگز', myTitle: 'میری تلاوت (اپنی آواز میں)', myInfo: 'پورا قرآن اپنی آواز اور اپنی رفتار سے ریکارڈ کریں۔ جب چاہیں روکیں (ہولڈ) اور اگلی بار وہیں سے جاری رکھیں۔ ریکارڈنگ ایپ میں محفوظ رہتی ہے اور انٹرنیٹ کے بغیر دَور کے لیے چلتی ہے۔ ریکارڈنگ کے دوران غلطیاں بھی پکڑی جاتی ہیں۔', myProg: 'اب تک ریکارڈ ہوا', myNone: 'ابھی کچھ ریکارڈ نہیں ہوا', myCont: 'جہاں چھوڑا وہیں سے', myNew: 'ریکارڈنگ شروع کریں', myHold: 'روکیں (ہولڈ)', mySaved: 'محفوظ ہو گیا', myDelAsk: 'پکا؟ دوبارہ دبائیں', myEmpty: 'ابھی کوئی ریکارڈنگ نہیں', myDaur: 'سنیں / دَور', myNoMic: 'اس ڈیوائس پر ریکارڈنگ نہیں ہو سکتی', myMicBusy: 'ریکارڈنگ شروع نہ ہو سکی (مائیک مصروف یا اجازت نہیں)', myNothing: 'کچھ ریکارڈ نہیں ہوا', myNoAudio: 'ریکارڈنگ نہیں ملی', myReps: 'دَور کتنے', myMin: 'منٹ', myRec: 'ریکارڈ ہو رہا ہے' });
Object.assign(RS.ru, { amt: 'Kitna hissa', aq: 'Pav para', ah: 'Aadha para', at: 'Poona para', a1: '1 para', as: 'Sava para', ad: 'Dedh para', a2: '2 para', fromPara: 'Para ke aaghaz se', ayW: 'ayat', paraW: 'para', fastL: 'Galti batane wala tez qari', fastNote: 'Galti ya lukme par yeh qari tez awaaz mein ayat sunata hai taake aapki rawani na tootay.', rateL: 'Qari ki raftaar', myBtn: 'Apni awaaz mein record karein', myList: 'Meri recordings', myTitle: 'Meri tilawat (apni awaaz mein)', myInfo: 'Poora Quran apni awaaz aur apni raftaar se record karein. Jab chahein rokein (hold) aur agli baar wahin se jaari rakhein. Recording app mein mehfooz rehti hai aur internet ke baghair daur ke liye chalti hai. Recording ke dauran galtiyan bhi pakdi jaati hain.', myProg: 'Ab tak record hua', myNone: 'Abhi kuch record nahin hua', myCont: 'Jahan chhoda wahin se', myNew: 'Record shuru karein', myHold: 'Rokein (hold)', mySaved: 'Mehfooz ho gaya', myDelAsk: 'Pakka? Dobara dabayein', myEmpty: 'Abhi koi recording nahin', myDaur: 'Sunein / daur', myNoMic: 'Is device par recording nahin ho sakti', myMicBusy: 'Recording shuru na ho saki (mic masroof ya ijazat nahin)', myNothing: 'Kuch record nahin hua', myNoAudio: 'Recording nahin mili', myReps: 'Daur kitne', myMin: 'min', myRec: 'Record ho raha hai' });
Object.assign(RS.en, { amt: 'How much', aq: '¼ Juz', ah: '½ Juz', at: '¾ Juz', a1: '1 Juz', as: '1¼ Juz', ad: '1½ Juz', a2: '2 Juz', fromPara: 'From start of Juz', ayW: 'ayat', paraW: 'Juz', fastL: 'Fast reciter for mistakes', fastNote: 'On a mistake or a stall this reciter plays the ayah quickly so your rhythm is not broken.', rateL: 'Reciter speed', myBtn: 'Record in my own voice', myList: 'My recordings', myTitle: 'My recitation (own voice)', myInfo: 'Record the whole Quran in your own voice and pace. Hold whenever you like and continue from the same place next time. Recordings stay inside the app and play offline for revision. Mistakes are caught while you record.', myProg: 'Recorded so far', myNone: 'Nothing recorded yet', myCont: 'Continue where I stopped', myNew: 'Start recording', myHold: 'Hold', mySaved: 'Saved', myDelAsk: 'Sure? Tap again', myEmpty: 'No recordings yet', myDaur: 'Listen / revise', myNoMic: 'Recording is not possible on this device', myMicBusy: 'Could not start recording (mic busy or not allowed)', myNothing: 'Nothing was recorded', myNoAudio: 'Recording not found', myReps: 'Rounds', myMin: 'min', myRec: 'Recording' });
Object.assign(RS.ur, { weak: 'کمزور آیات', weakNote: 'جن آیات میں غلطی یا اٹکن ہوئی وہ یہاں جمع ہوتی ہیں۔ تین بار صاف پڑھنے پر خود ہٹ جاتی ہیں۔', weakEmpty: 'ابھی کوئی کمزور آیت نہیں — ماشاءاللہ!', weakGo: 'یہاں سے شروع', weakOk: 'یاد ہو گئی', weakAll: 'سب کمزور آیات دہرائیں', weakN: 'بار', weakClr: 'فہرست صاف', weakPage: 'صفحہ کھولیں' });
Object.assign(RS.ru, { weak: 'Kamzor ayaat', weakNote: 'Jin ayaat mein ghalti ya atkan hui woh yahan jama hoti hain. Teen baar saaf parhne par khud hat jati hain.', weakEmpty: 'Abhi koi kamzor ayat nahin — MashaAllah!', weakGo: 'Yahan se shuru', weakOk: 'Yaad ho gayi', weakAll: 'Sab kamzor ayaat dohrayein', weakN: 'baar', weakClr: 'Fehrist saaf', weakPage: 'Safha kholein' });
Object.assign(RS.en, { weak: 'Weak verses', weakNote: 'Verses where you slipped or stalled collect here. Three clean recitations remove them automatically.', weakEmpty: 'No weak verses yet — MashaAllah!', weakGo: 'Start here', weakOk: 'Mastered', weakAll: 'Revise all weak verses', weakN: 'times', weakClr: 'Clear list', weakPage: 'Open page' });
Object.assign(RS.ru, { trV: 'Har ayat ke baad tarjume ki aawaz', trW: 'Kis alim ka tarjuma', trN: 'On karne par har ayat ke neeche uska tarjuma aata hai. Kisi ayat ko 1 second daba kar rakhein to woh ayat tarjume ke saath poori screen par khulegi.', fsPlay: 'Yeh ayat sunein' });
Object.assign(RS.en, { trV: 'Translation voice after each ayah', trW: 'Whose translation', trN: 'When on, every ayah shows its translation underneath. Press and hold an ayah for a second to open it full screen with its translation.', fsPlay: 'Listen to this ayah' });
Object.assign(RS.ur, { trV: 'ہر آیت کے بعد ترجمے کی آواز', trW: 'کس عالم کا ترجمہ', trN: 'آن کرنے پر ہر آیت کے نیچے اس کا ترجمہ آتا ہے۔ کسی آیت کو ایک سیکنڈ دبا کر رکھیں تو وہ آیت ترجمے کے ساتھ پوری اسکرین پر کھلے گی۔', fsPlay: 'یہ آیت سنیں' });
const R = k => (RS[A.st().ui] || RS.en)[k];
let rau = new Audio(); rau.preload = 'auto';
const rec = () => A.st().rec;
const FASTQ = ['Muhammad_Ayyoub_128kbps', 'Ibrahim_Akhdar_64kbps', 'Yasser_Ad-Dussary_128kbps', 'MaherAlMuaiqly128kbps'];
const fastOn = () => (A.st().hfast || 'on') === 'on';
const fastRate = () => fastOn() ? (A.st().hrate || 1.25) : 1;
const errUrl = (s, a) => fastOn() ? `https://everyayah.com/data/${A.st().hfq || FASTQ[0]}/${pad(s)}${pad(a)}.mp3` : auUrl(s, a);
const setRate = (au, r) => { try { au.defaultPlaybackRate = r; au.playbackRate = r; } catch (e) { } };
const recName = f => { const r = (window.FAHM_RECS || []).find(x => x[0] === f); return r ? (A.st().ui === 'ur' ? r[2] : r[1]) : f; };
/* Build 32: real word timings (CC-BY quran-align / QUL data) for 16 qaris; their audio is played from the exact files the timings were made on */
const TIMED = { Alafasy_128kbps: 'https://audio-cdn.tarteel.ai/quran/alafasy/', Husary_128kbps: 'https://audio-cdn.tarteel.ai/quran/husary/', Husary_128kbps_Mujawwad: 'https://audio-cdn.tarteel.ai/quran/husaryMujawwad/', Husary_Muallim_128kbps: 'https://audio-cdn.tarteel.ai/quran/husaryMuallim/', 'Abdurrahmaan_As-Sudais_192kbps': 'https://audio-cdn.tarteel.ai/quran/abdulrahmanAlSudais/', 'Saood_ash-Shuraym_128kbps': 'https://audio-cdn.tarteel.ai/quran/saudAlShuraim/', Minshawy_Murattal_128kbps: 'https://audio-cdn.tarteel.ai/quran/minshawyMurattal/', Abdul_Basit_Murattal_192kbps: 'https://audio-cdn.tarteel.ai/quran/abdulBasitMurattal/', Abdul_Basit_Mujawwad_128kbps: 'https://audio-cdn.tarteel.ai/quran/abdulBasitMujawwad/', Mohammad_al_Tablaway_128kbps: 'https://everyayah.com/data/Mohammad_al_Tablaway_128kbps/', Ghamadi_40kbps: 'https://audio-cdn.tarteel.ai/quran/ghamadi/', 'Abu_Bakr_Ash-Shaatree_128kbps': 'https://audio-cdn.tarteel.ai/quran/abuBakrAlShatri/', Hani_Rifai_192kbps: 'https://audio.qurancdn.com/Rifai/mp3/', khalefa_al_tunaiji_64kbps: 'https://audio-cdn.tarteel.ai/quran/khalifaAlTunaiji/', MaherAlMuaiqly128kbps: 'https://audio-cdn.tarteel.ai/quran/maherAlMuaiqly/', 'Yasser_Ad-Dussary_128kbps': 'https://audio-cdn.tarteel.ai/quran/yasserAlDosari/' };
const auUrlFor = (r, s, a) => (TIMED[r] || `https://everyayah.com/data/${r}/`) + `${pad(s)}${pad(a)}.mp3`;
const auUrl = (s, a) => auUrlFor(rec(), s, a);
const WT = {}, WTP = {};
function wtLoad(r, s) { const k = r + '/' + s; if (!TIMED[r]) return Promise.resolve(null); if (WT[k]) return Promise.resolve(WT[k]); if (WTP[k]) return WTP[k]; WTP[k] = fetch(`q/wt/${r}/${pad(s)}.json`).then(x => x.ok ? x.json() : null).then(j => { WT[k] = j; return j; }).catch(() => null); return WTP[k]; }
function wtGet(s, a) { const j = WT[rec() + '/' + s]; const t = j && j[a - 1]; return Array.isArray(t) && t.length > 1 ? t : null; }
window.FahmWT = { trUrl: (s, a, u) => { const k = u === 'en' ? 'en' : 'ur'; return `https://everyayah.com/data/${({ ur: 'translations/urdu_shamshad_ali_khan_46kbps', en: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps' })[k]}/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`; }, load: wtLoad, get: (r, s, a) => { const j = WT[r + '/' + s]; return j && j[a - 1]; }, url: auUrlFor, timed: r => !!TIMED[r] };
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
      AY[ai].last = SC.length; SC.push({ s: x.s, a: x.a, w: x.w, loc, n, ai, wt: window.FahmTiming ? FahmTiming.weight(x.t) : n.length + 1 });
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
function ratio() { const st = $('#rstage'); if (twoUp) return Math.max(0.56, Math.min(0.7, ((st.clientWidth - 16) / 2) / Math.max(1, st.clientHeight - 16))); const r = (st.clientWidth - 16) / Math.max(1, st.clientHeight - 16); return r > 1.1 ? 0.66 : Math.max(0.56, Math.min(0.7, r)); }
let archRows = 0;
let rowX = 0;
function rowsOf() { return (archRows || (lay === '15' ? 15 : 13)) + rowX; }
function sizePage() {
  const st = $('#rstage'), z = A.st().rz || 1, sw = st.clientWidth - 16, sh = st.clientHeight - 16, r = ratio();
  const w = twoUp ? Math.max(200, Math.min(sw * 0.955 / 2, sh * r * 0.94)) * z : sw > sh * 1.1 ? Math.max(200, Math.min(sw, 640)) * z : Math.max(200, Math.min(sw, sh * r)) * z;   /* landscape: full-width page, scroll down */ const p = $('#rpage'); p.style.width = w + 'px'; p.style.height = (w / r) + 'px'; p.style.setProperty('--pw', w + 'px'); drawFrame(w, w / r); fitHdr();
}
function fitHdr() { fitKit(); }
function fit() {
  const inner = $('#rin'); if (!inner || pi < 0) return; trlStrip(); const rows = rowsOf();
  const W = inner.clientWidth, Hh = inner.clientHeight, rowH = Hh / rows;
  let fs = rowH * 0.78; $('#rpage').style.setProperty('--fs', fs + 'px');
  for (let it = 0; it < 3; it++) {
    let need = 0;
    inner.querySelectorAll('.ml:not(.e):not(.h):not(.b):not(.dua)').forEach(l => {
      let s = 0; const ch = l.children; for (let i = 0; i < ch.length; i++) s += ch[i].offsetWidth; const gp = parseFloat(getComputedStyle(l).columnGap); s += Math.max(0, ch.length - 1) * (isNaN(gp) ? fs * 0.1 : gp); if (s > need) need = s;
    });
    if (!need) break; const f = fs * Math.min(1, (W * 0.972) / need); if (Math.abs(f - fs) < 0.3 && it) break; fs = f; $('#rpage').style.setProperty('--fs', fs + 'px');
  }
  $('#rpage').style.setProperty('--fs', Math.min(fs, rowH * 0.78) + 'px'); $('#rpage').style.setProperty('--hb', (rowH * .92).toFixed(1) + 'px'); $('#rpage').style.setProperty('--rh', rowH.toFixed(2) + 'px'); placeTabs(); fitKit(); trlApply();
}
/* side badges of the Ottoman (arch) pages that would stick out above / below the text area are nudged back inside */
function clampBadges() {
  const rin = $('#rin'); if (!rin) return; const rr = rin.getBoundingClientRect();
  rin.querySelectorAll('.ml').forEach(ml => {
    ml.style.removeProperty('--bdy'); const bs = ml.querySelectorAll('.bg'); if (!bs.length) return; let t = 1e9, b = -1e9;
    bs.forEach(e => { const q = e.getBoundingClientRect(); t = Math.min(t, q.top); b = Math.max(b, q.bottom); });
    let dy = 0; if (t < rr.top) dy = rr.top - t; else if (b > rr.bottom) dy = rr.bottom - b; if (Math.abs(dy) > .5) ml.style.setProperty('--bdy', dy.toFixed(1) + 'px');
  });
}

/* Build 30: measure where the ink of ع really sits inside its line box, so every ruku mark is optically centred (x and y), whatever the font metrics */
let __inkC = null;
function inkOff() {
  if (__inkC) return __inkC; try {
    const c = document.createElement('canvas').getContext('2d'); c.font = "400 200px AmiriQ, ArefR, serif"; c.textBaseline = 'alphabetic';
    const m = c.measureText('ع'), fa = m.fontBoundingBoxAscent || 200 * .9, fd = m.fontBoundingBoxDescent || 200 * .4;
    const ox = (m.width / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2) / 200;
    const base = (200 - (fa + fd)) / 2 + fa, cy = base - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2, oy = (100 - cy) / 200;
    if (isFinite(ox) && isFinite(oy)) __inkC = { ox: +ox.toFixed(4), oy: +oy.toFixed(4) };
  } catch (e) { } return __inkC || { ox: 0, oy: 0 };
}
/* Build 22 tabs: kit vertical boxes in the page margin, at the height of their line. right edge = ruku (ع + 3 numbers) / sajda, left edge = para fractions */
function placeTabs() {
  const pg = $('#rpage'), rin = $('#rin'); if (!pg || !rin) return; let L = $('#rtabs'); if (!L) { L = document.createElement('div'); L.id = 'rtabs'; pg.appendChild(L); } L.innerHTML = '';
  if (pg.classList.contains('cover') || pi < 0) return;
  const pr = pg.getBoundingClientRect(), sc = pr.height / Math.max(1, pg.offsetHeight), pw = pg.offsetWidth, H = pg.offsetHeight;
  const cs = getComputedStyle(pg), pL = parseFloat(cs.paddingLeft) || pw * .1, pR = parseFloat(cs.paddingRight) || pw * .1, pT = parseFloat(cs.paddingTop) || 0, pB = parseFloat(cs.paddingBottom) || 0;
  const items = { R: [], L: [] };
  rin.querySelectorAll('.ml .tg').forEach(b => {
    const r = b.parentElement.getBoundingClientRect(), cy = ((r.top + r.bottom) / 2 - pr.top) / sc, d = b.dataset, k = d.k;
    const w = pw * .06, h = pw * (k === 'rq' ? .225 : k === 'sj' ? .17 : .2);
    let html, cls = k === 'rq' ? 'rk' : k;
    if (k === 'rq') html = `<span class="rt">${d.sr}</span><span class="re"><span class="ra">ع</span></span><b class="rc l${String(d.ay).length}">${d.ay}</b><span class="rb2">${d.pr}</span>`;
    else if (k === 'sj') { html = `<span>السجدة</span>`; cls = 'sj vt'; }
    else { html = `<span>${d.lab}</span>${d.n ? `<span>${d.n}</span>` : ''}`; cls = 'rb vt'; }
    items[d.sd].push({ cy, w, h, html, cls, tip: d.tip || '' });
  });
  const lo = pT * .8, hi = H - pB * .8, gap = pw * .008, ed = pw * .012;
  Object.keys(items).forEach(sd => {
    const a = items[sd].sort((x, y) => x.cy - y.cy); let prev = lo; { const sum = a.reduce((q, t) => q + t.h, 0), avail = hi - lo - gap * Math.max(0, a.length - 1); if (sum > avail && sum > 0) { const f = avail / sum; a.forEach(t => { t.h *= f; }); } }
    a.forEach(t => { t.top = Math.max(prev, t.cy - t.h / 2); prev = t.top + t.h + gap; });
    { let lim2 = hi; for (let i = a.length - 1; i >= 0; i--) { if (a[i].top + a[i].h > lim2) a[i].top = lim2 - a[i].h; lim2 = a[i].top - gap; } let pv = lo; a.forEach(t => { if (t.top < pv) t.top = pv; pv = t.top + t.h + gap; }); }
    let lim = hi; for (let i = a.length - 1; i >= 0; i--) { if (a[i].top + a[i].h > lim) a[i].top = lim - a[i].h; lim = a[i].top - gap; }
    a.forEach(t => {
      const sm = parseFloat(cs.getPropertyValue('--sm')) || pw * .058, x = Math.max(0, (sm - t.w) / 2);
      L.insertAdjacentHTML('beforeend', `<div class="kv ${t.cls}" style="--bw:${t.w.toFixed(2)}px;height:${t.h.toFixed(2)}px;top:${t.top.toFixed(2)}px;${sd === 'R' ? 'right' : 'left'}:${x.toFixed(2)}px" title="${esc(t.tip)}"><div class="in">${t.html}</div></div>`);
      if (t.cls === 'rk') { const kk = L.lastElementChild, io = inkOff(); kk.style.setProperty('--ox', io.ox + 'em'); kk.style.setProperty('--oy', io.oy + 'em'); }
    });
  });
}
/* shrink the text of every kit box until it sits inside the cream area (never touches the ornaments / never leaves the box) */
function fitZone(z, wMax, hMax) {
  z.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(z).fontSize) || 12;
  for (let i = 0; i < 14; i++) {
    let w = 0, h = 0; const ch = z.children;
    for (let k = 0; k < ch.length; k++) { const r = ch[k].getBoundingClientRect(); w = Math.max(w, r.width); h += r.height; }
    if (!ch.length) { const r = document.createRange(); r.selectNodeContents(z); const b = r.getBoundingClientRect(); w = b.width; h = b.height; }
    const f = Math.min(w > wMax ? wMax / w : 1, h > hMax ? hMax / h : 1); if (f >= .995) break; fs = Math.max(5, fs * f * .985); z.style.setProperty('font-size', fs.toFixed(2) + 'px');
  }
}
function fitKit() {
  const pg = $('#rpage'); if (!pg || pg.classList.contains('cover') || pi < 0) return;
  /* header row: shrink the font of all three boxes together, then the box height, until the row fits between the frame bands */
  /* header: three kit boxes share the row (flex); every text grows up to the biggest size that stays inside its cream area */
  pg.querySelectorAll('#rhd .kb').forEach(k => {
    const z = k.querySelector('.in'), bh = k.clientHeight || parseFloat(getComputedStyle(k).height); z.style.removeProperty('font-size');
    const maxFs = bh * (k.classList.contains('hg') ? .5 : .46); z.style.setProperty('font-size', maxFs + 'px');
    const cw = parseFloat(getComputedStyle(k).borderLeftWidth) || 0, room = k.getBoundingClientRect().width - 2 * cw - bh * .5;
    for (let i = 0; i < 14; i++) { const r = document.createRange(); r.selectNodeContents(z); const w = r.getBoundingClientRect().width; if (w <= room) break; z.style.setProperty('font-size', (parseFloat(getComputedStyle(z).fontSize) * Math.max(.7, room / w) * .985) + 'px'); }
  });
  pg.querySelectorAll('.kb.bn .bz').forEach(z => fitZone(z, z.clientWidth * .96, z.clientHeight * .9));
  pg.querySelectorAll('.kb.bm>.in').forEach(z => { z.style.removeProperty('font-size'); const k = z.parentElement, room = k.clientWidth + (parseFloat(getComputedStyle(k).borderLeftWidth) || 0) * .55; for (let i = 0; i < 10 && z.scrollWidth > room; i++) z.style.setProperty('font-size', (parseFloat(getComputedStyle(z).fontSize) * .94) + 'px'); });
  pg.querySelectorAll('.hx>.in').forEach(z => {
    z.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(z).fontSize) || 12; const row = z.parentElement.classList.contains('bc') || z.parentElement.classList.contains('bw');
    for (let i = 0; i < 16; i++) {
      let f = 1;
      if (row) { if (z.scrollWidth > z.clientWidth + .5) f = (z.clientWidth / z.scrollWidth) * .985; }
      else { const ch = z.children; let w = 0, h = 0; for (let k = 0; k < ch.length; k++) { const r = ch[k].getBoundingClientRect(); w = Math.max(w, r.width); h += r.height; } f = Math.min(w > z.clientWidth * .96 ? z.clientWidth * .96 / w : 1, h > z.clientHeight * .98 ? z.clientHeight * .98 / h : 1); }
      if (f >= .995) break; fs = Math.max(5, fs * f); z.style.setProperty('font-size', fs.toFixed(2) + 'px');
    }
  });
  const hq = pg.querySelector('#rhd .hq'); if (hq) { hq.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(hq).fontSize) || 12; for (let i = 0; i < 12; i++) { const ks = Array.from(hq.children); let tot = 0; ks.forEach(k => { tot += k.getBoundingClientRect().width; }); if (tot <= hq.clientWidth * .96) break; fs *= .94; hq.style.setProperty('font-size', fs + 'px'); } }
  pg.querySelectorAll('.dua .dt').forEach(z => { z.style.removeProperty('font-size'); const box = z.parentElement, avail = box.clientHeight - (box.querySelector('.dh') ? box.querySelector('.dh').offsetHeight : 0) - 4; let fs = parseFloat(getComputedStyle(z).fontSize); for (let i = 0; i < 20 && z.scrollHeight > avail && fs > 7; i++) { fs *= .95; z.style.setProperty('font-size', fs + 'px'); } });
  document.querySelectorAll('#rtabs .kv>.in').forEach(z => {
    z.style.removeProperty('font-size'); let fs = z.parentElement.clientWidth * .82; z.style.setProperty('font-size', fs + 'px');
    for (let i = 0; i < 16; i++) { const fh = z.scrollHeight > z.clientHeight + .5 ? z.clientHeight / z.scrollHeight : 1, fw = z.scrollWidth > z.clientWidth * 1.35 ? z.clientWidth * 1.35 / z.scrollWidth : 1, f = Math.min(fh, fw); if (f >= .995) break; fs = Math.max(5, fs * f * .985); z.style.setProperty('font-size', fs + 'px'); }
  });
}
/* ---------- mushaf ornaments (header, surah banner, ruku/sajda marks, manzil) ---------- */
let RUBI = null;
function rubSet() { if (RUBI) return; RUBI = {}; FAHM_RUB.forEach((x, i) => RUBI[x[0] + ':' + x[1]] = i); }
/* Royal Ottoman side badge: pointed shield, small label on top, number below (ruku / sajda / hizb / juz / quarter marks) */
function bdg(cls, lab, num, tip) { return `<span class="bg ${cls}" title="${esc(tip || lab + ' ' + num)}"><i>${esc(lab)}</i><b>${num}</b></span>`; }
function rubMark(i) {
  const k = i % 4, jz = i % 8 === 0, hz = Math.floor(i / 4) + 1, lab = jz ? 'پارہ' : ['حزب', 'الربع', 'النصف', 'الثلثة'][k], num = jz ? adx(i / 8 + 1) : (k === 0 ? adx(hz) : '');
  return `<i class="tg" data-sd="L" data-k="rb" data-lab="${lab}" data-n="${num}" data-tip="${lab} ${num}"></i>`;
}
let RUKE = null, SAJ = null;
function ornSets() {
  if (RUKE) return; RUKE = new Set(); SAJ = new Map();
  const R = M.meta.R; for (let i = 1; i <= R.length; i++) { const e = i < R.length ? AYI[R[i][0] + ':' + R[i][1]] - 1 : AY.length - 1; if (e >= 0 && AY[e]) RUKE.add(AY[e].s + ':' + AY[e].a); }
  M.meta.SJ.forEach((x, i) => SAJ.set(x[0] + ':' + x[1], i + 1));
}
function rukuInfo(s, a) { /* {n: ruku number inside the para} for the ruku that ends at this ayah */
  const R = M.meta.R, ai = AYI[s + ':' + a], jb = juzOfAi(ai), js = juzStartAi(jb);
  let n = 0; for (let i = 0; i < R.length; i++) { const e = i + 1 < R.length ? AYI[R[i + 1][0] + ':' + R[i + 1][1]] - 1 : AY.length - 1; if (e >= js && e <= ai) n++; if (e >= ai) break; }
  return n;
}
function manzilOfAi(ai) { let m = 1; M.meta.M.forEach((x, i) => { const k = AYI[x[0] + ':' + x[1]]; if (k !== undefined && k <= ai) m = i + 1; }); return m; }
function rukuFull(s, a) { /* ayat in this ruku, ruku number inside the para, ruku number inside the surah */
  const R = M.meta.R, ai = AYI[s + ':' + a]; let i = 0; for (let k = 0; k < R.length; k++) { const st = AYI[R[k][0] + ':' + R[k][1]]; if (st <= ai) i = k; else break; }
  const st0 = AYI[R[i][0] + ':' + R[i][1]]; let sr = 0; for (let k = 0; k <= i; k++) if (+R[k][0] === +s) sr++;
  return { ay: ai - st0 + 1, pr: rukuInfo(s, a), sr };
}
const PARA_N = ['الم', 'سیقول', 'تلک الرسل', 'لن تنالوا', 'والمحصنات', 'لا یحب اللہ', 'واذا سمعوا', 'ولو اننا', 'قال الملأ', 'واعلموا', 'یعتذرون', 'و ما من دابۃ', 'و ما ابرئ', 'ربما', 'سبحان الذی', 'قال الم', 'اقترب', 'قد افلح', 'و قال الذین', 'امن خلق', 'اتل ما اوحی', 'و من یقنت', 'و مالی', 'فمن اظلم', 'الیہ یرد', 'حم', 'قال فما خطبکم', 'قد سمع اللہ', 'تبارک الذی', 'عم'];
const PARA_H = ['الٓمّٓ','سَيَقُولُ','تِلْكَ الرُّسُلُ','لَنْ تَنَالُوا','وَالْمُحْصَنٰتُ','لَا يُحِبُّ اللّٰهُ','وَاِذَا سَمِعُوا','وَلَوْ اَنَّنَا','قَالَ الْمَلَاُ','وَاعْلَمُوا','يَعْتَذِرُوْنَ','وَمَا مِنْ دَآبَّةٍ','وَمَاۤ اُبَرِّئُ','رُبَمَا','سُبْحٰنَ الَّذِيْ','قَالَ اَلَمْ','اِقْتَرَبَ','قَدْ اَفْلَحَ','وَقَالَ الَّذِيْنَ','اَمَّنْ خَلَقَ','اُتْلُ مَاۤ اُوْحِيَ','وَمَنْ يَّقْنُتْ','وَمَا لِيَ','فَمَنْ اَظْلَمُ','اِلَيْهِ يُرَدُّ','حٰمٓ','قَالَ فَمَا خَطْبُكُمْ','قَدْ سَمِعَ اللّٰهُ','تَبٰرَكَ الَّذِيْ','عَمَّ'];
const snH = sn => ((M.n[sn] || '').replace(/^\s*سُورَةُ\s*/, '')) || snU(sn);
const snU = sn => ((window.FAHM_SN && FAHM_SN.u[sn - 1]) || (M.n[sn] || '').replace(/[ً-ْٰ]/g, '')).replace(/^\s*سورۃ\s*|^\s*سورة\s*/, '');
/* surah banner: ONE kit box, three zones — ayat count | number + سورۃ NAME + makki/madani | ruku count */
function bannerHtml(sn) {
  const S = M.meta.S[sn] || [0, 0, 1, 0], nm = (M.n[sn] || '').replace(/^\s*سُورَةُ\s*/, 'سُورَةُ ');
  return `<div class="ml h" data-sn="${sn}" role="button"><div class="bnr"><div class="hx bs"><div class="in"><div class="l">آیاتھا</div><div class="v">${adx(S[0])}</div></div></div><div class="hx bc"><div class="in"><bdi class="pn" dir="ltr">(${adx(sn)})</bdi><span class="nm">${esc(nm)}</span><span class="mk2">${S[2] ? 'مَکِّیَّۃٌ' : 'مَدَنِیَّۃٌ'}</span><bdi class="pn" dir="ltr">(${adx(S[3])})</bdi></div></div><div class="hx bs"><div class="in"><div class="l">${S[1] > 1 ? 'رُکُوعَاتُھَا' : 'رُکُوعُھَا'}</div><div class="v">${adx(S[1])}</div></div></div></div></div>`;
}
/* flourish beside the Bismillah: thin line that grows + small scroll with leaves + diamond (drawn here, original) */
const FLO = '<span class="flo"><i class="ln"></i><svg viewBox="0 0 64 24" class="sc" aria-hidden="true"><path d="M0 12H20" /><path d="M20 12C28 12 30 5 37 5C44 5 45 12 40 14C36 16 33 12 36 10" /><path d="M20 12C27 12 29 19 36 19" /><path d="M36 19C42 19 46 16 50 12" /><path d="M32 8.5C30 5 27 4 24 5" /><path d="M32 15.5C30 19 27 20 24 19" /><path class="f" d="M54 12L58 8L62 12L58 16Z" /><circle class="f" cx="51" cy="12" r="1.3" /></svg></span>';
const EORN = i => { const k = i % 3, g = k === 0 ? '<path d="M0 10H78M122 10H200"/><path class="f" d="M100 3L106 10L100 17L94 10Z"/><circle cx="86" cy="10" r="2.2"/><circle cx="114" cy="10" r="2.2"/>' : k === 1 ? '<path d="M0 10H64M136 10H200"/><path d="M72 10C78 2 90 2 100 10C110 18 122 18 128 10"/><circle class="f" cx="100" cy="10" r="2.6"/><circle class="f" cx="68" cy="10" r="1.8"/><circle class="f" cx="132" cy="10" r="1.8"/>' : '<path d="M0 10H60M140 10H200"/><path d="M66 10C74 3 82 3 88 10C94 17 106 17 112 10C118 3 126 3 134 10"/><path class="f" d="M100 6L104 10L100 14L96 10Z"/>'; return `<svg class="eo" viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">${g}</g></svg>`; };
const RING = n => `<svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><polygon points="20,2 31,6 38,15 38,26 31,35 20,38 9,35 2,26 2,15 9,6" /><text x="20" y="25.5" text-anchor="middle">${n}</text></svg>`;
const DUA = 'اَللّٰهُمَّ اٰنِسْ وَحْشَتِيْ فِيْ قَبْرِيْ، اَللّٰهُمَّ ارْحَمْنِيْ بِالْقُرْاٰنِ الْعَظِيْمِ وَاجْعَلْهُ لِيْ اِمَامًا وَّنُوْرًا وَّهُدًى وَّرَحْمَةً، اَللّٰهُمَّ ذَكِّرْنِيْ مِنْهُ مَا نَسِيْتُ وَعَلِّمْنِيْ مِنْهُ مَا جَهِلْتُ وَارْزُقْنِيْ تِلَاوَتَهُ اٰنَاءَ اللَّيْلِ وَاٰنَاءَ النَّهَارِ وَاجْعَلْهُ لِيْ حُجَّةً يَا رَبَّ الْعَالَمِيْنَ';
function duaHtml(n) { return `<div class="ml dua" style="flex-grow:${n}!important"><div class="kb dh"><div class="in">دعاءِ ختمِ القرآن</div></div><div class="dt">${DUA}</div></div>`; }
/* running header: para name + number | page number | every surah on the page — three kit boxes */
function headerHtml(lines) {
  const sns = []; lines.map(lineParts).forEach(x => { let n = 0; if (x.k[0] === 'h' && x.k.length > 1) n = +x.k.slice(1); else if (x.a) n = +x.a.split(':')[0]; if (n && sns.indexOf(n) < 0) sns.push(n); });
  const f = lines.map(lineParts).find(x => x.a); if (!sns.length || !f) return '';
  const [fs, fa] = f.a.split(':').map(Number), j = juzOfAi(AYI[fs + ':' + fa]);
  const sTxt = sns.map(n => snH(n) + ' ' + adx(n)).join(' · ');
  return `<div class="hq"><span class="hp">${esc(PARA_H[j - 1])} ${adx(j)}</span><span class="hg">${adx(PG[pi])}</span><span class="hs">${esc(sTxt)}</span></div>`;
}
const headerHtmlOld = headerHtml;
function wordHtml(x) {
  const loc = locOf(x.s, x.a, x.w), c = ['wd']; if (isMk(x.t)) c.push('mk');
  if (okSet.has(loc)) c.push('ok');
  if (isMk(x.t)) { ornSets(); const ak = x.s + ':' + x.a; if (SAJ.has(ak)) c.push('saj'); }
  return `<span class="${c.join(' ')}" data-loc="${loc}">${esc(x.t)}</span>`;
}

/* ---------- ornamental mushaf frame (olive arabesque band, mihrab arch on the first pages) + book cover ---------- */
function frameSvg(w, h, arch) {
  const a = Math.max(4, w * .013), bt = Math.max(14, w * .05), s = bt, m = s / 2, c = w / 2;
  const x0 = a + bt, y0 = a + bt, x1 = w - a - bt, y1 = h - a - bt;
  const outer = `M${a} ${a}H${w - a}V${h - a}H${a}Z`;
  let inner;
  if (arch) {
    const ys = h * .30, yt = y0 + h * .012, dy = ys - yt;
    inner = `M${x0} ${y1}V${ys}C${x0} ${ys - dy * .5} ${c - w * .13} ${yt + dy * .36} ${c} ${yt}C${c + w * .13} ${yt + dy * .36} ${x1} ${ys - dy * .5} ${x1} ${ys}V${y1}Z`;
  } else inner = `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
  const pat = `<pattern id="rfp" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><rect width="${s}" height="${s}" fill="currentColor" opacity=".10"/><g fill="none" stroke="currentColor" stroke-width="1.1"><path d="M0 ${m}C${s * .25} ${s * .04} ${s * .75} ${s * .04} ${s} ${m}C${s * .75} ${s * .96} ${s * .25} ${s * .96} 0 ${m}Z"/><circle cx="${m}" cy="${m}" r="${s * .12}"/><path id="rfl" d="M${m} ${s * .18}C${s * .37} ${s * .3} ${s * .37} ${s * .42} ${m} ${s * .5}C${s * .63} ${s * .42} ${s * .63} ${s * .3} ${m} ${s * .18}Z"/><path d="M${m} ${s * .18}C${s * .37} ${s * .3} ${s * .37} ${s * .42} ${m} ${s * .5}C${s * .63} ${s * .42} ${s * .63} ${s * .3} ${m} ${s * .18}Z" transform="rotate(90 ${m} ${m})"/><circle cx="0" cy="0" r="${s * .06}"/><circle cx="${s}" cy="0" r="${s * .06}"/><circle cx="0" cy="${s}" r="${s * .06}"/><circle cx="${s}" cy="${s}" r="${s * .06}"/></g></pattern>`;
  let orn = '';
  if (arch === 2) {
    const cy = h * .185, R = w * .082, pts = []; for (let i = 0; i < 16; i++) { const r = i % 2 ? R * .46 : R * .92, t = i * Math.PI / 8 - Math.PI / 2; pts.push((c + r * Math.cos(t)).toFixed(1) + ',' + (cy + r * Math.sin(t)).toFixed(1)); }
    const dts = Array.from({ length: 24 }, (_, i) => { const t = i * Math.PI / 12; return `<circle cx="${(c + R * 1.2 * Math.cos(t)).toFixed(1)}" cy="${(cy + R * 1.2 * Math.sin(t)).toFixed(1)}" r="${(w * .0035).toFixed(1)}" fill="currentColor"/>`; }).join('');
    const ln = d => `<path d="M${c + d * R * 1.55} ${cy}H${c + d * R * 2.6}" stroke="currentColor" stroke-width="1.2"/><path d="M${c + d * R * 2.6} ${cy - 5}L${c + d * R * 2.6 + d * 6} ${cy}L${c + d * R * 2.6} ${cy + 5}L${c + d * R * 2.6 - d * 6} ${cy}Z" fill="currentColor"/><circle cx="${c + d * R * 1.55}" cy="${cy}" r="${w * .006}" fill="currentColor"/>`;
    orn = `<g color="inherit"><circle cx="${c}" cy="${cy}" r="${R * 1.08}" fill="var(--pgbg)" stroke="currentColor" stroke-width="2"/><polygon points="${pts.join(' ')}" fill="currentColor" opacity=".9"/><circle cx="${c}" cy="${cy}" r="${R * .3}" fill="var(--pgbg)" stroke="currentColor" stroke-width="1.4"/><circle cx="${c}" cy="${cy}" r="${R * .12}" fill="currentColor"/>${dts}${ln(1)}${ln(-1)}</g>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs>${pat}</defs>` +
    `<path d="${outer} ${inner}" fill="url(#rfp)" fill-rule="evenodd"/>` +
    `<path d="${outer}" fill="none" stroke="currentColor" stroke-width="${Math.max(3, w * .008)}"/><path d="${outer}" fill="none" stroke="var(--pgbg)" stroke-width="${Math.max(1, w * .003)}"/>` +
    `<path d="M${a + 3.5} ${a + 3.5}H${w - a - 3.5}V${h - a - 3.5}H${a + 3.5}Z" fill="none" stroke="currentColor" stroke-width="1"/>` +
    `<path d="${inner}" fill="none" stroke="currentColor" stroke-width="${Math.max(3, w * .008)}"/><path d="${inner}" fill="none" stroke="var(--pgbg)" stroke-width="${Math.max(1, w * .003)}"/>` +
    (arch ? `<path d="${inner}" transform="translate(${c} ${h / 2}) scale(.975) translate(${-c} ${-h / 2})" fill="none" stroke="currentColor" stroke-width="1" opacity=".7"/>` : '') + orn + `</svg>`;
}
/* Royal Ottoman frame images (kit): variant a = 0.70 page, b = taller 0.58 page; geometry in the 740px-wide crop space */
function frameGeo(v) {
  const a = v === 'a', S = a ? 1.0608 : 1, E = a ? 0 : 280, H = a ? 1057 : 1276, Y = y => (a ? y * S : (y > 401 ? y + E : y));
  return { H, xL: 137, xR: 603, yt: Y(222), yb: Y(770), hy: Y(121), hh: Y(181) - Y(121), bpy: Y(834), bph: Y(873) - Y(834) };
}
function thinFrame(w, h) {
  /* fine, thin frame in the app's own colours: hairline double border, concave inner corners, small diamonds, three thin header compartments and a small manzil pill */
  const o1 = w * .012, o2 = w * .026, c = w * .04, x0 = o2, y0 = o2, x1 = w - o2, y1 = h - o2, f = n => n.toFixed(1);
  const pl = w * .118, T = w - 2 * pl, g = w * .014, rw = T * .25, cw = T - 2 * rw - 2 * g, hy = w * .05, hh = w * .082, bw = w * .2, bph = w * .058, bpy = h - o2 - w * .014 - bph;
  const inner = `M${f(x0 + c)} ${f(y0)}H${f(x1 - c)}A${f(c)} ${f(c)} 0 0 0 ${f(x1)} ${f(y0 + c)}V${f(y1 - c)}A${f(c)} ${f(c)} 0 0 0 ${f(x1 - c)} ${f(y1)}H${f(x0 + c)}A${f(c)} ${f(c)} 0 0 0 ${f(x0)} ${f(y1 - c)}V${f(y0 + c)}A${f(c)} ${f(c)} 0 0 0 ${f(x0 + c)} ${f(y0)}Z`;
  const ln = (sw, op) => `fill="none" stroke="currentColor" stroke-width="${sw}" stroke-opacity="${op}" vector-effect="non-scaling-stroke"`;
  const dia = (cx, cy, r) => `<path d="M${f(cx)} ${f(cy - r)}L${f(cx + r)} ${f(cy)}L${f(cx)} ${f(cy + r)}L${f(cx - r)} ${f(cy)}Z" fill="var(--pgbg)" ${ln(1, 1)}/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .28)}" fill="currentColor"/>`;
  const dr = w * .0085, corner = (cx, cy) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(w * .011)}" ${ln(1, .9)}/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(w * .0042)}" fill="currentColor"/>`;
  const box = (x, y, bw2, bh2) => `<rect x="${f(x)}" y="${f(y)}" width="${f(bw2)}" height="${f(bh2)}" rx="${f(bh2 * .34)}" ${ln(1, 1)}/><rect x="${f(x + 2.4)}" y="${f(y + 2.4)}" width="${f(bw2 - 4.8)}" height="${f(bh2 - 4.8)}" rx="${f(Math.max(1, bh2 * .34 - 2.4))}" ${ln(.6, .5)}/>`;
  const svg = `<svg width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block!important">` +
    `<rect x="${f(o1)}" y="${f(o1)}" width="${f(w - 2 * o1)}" height="${f(h - 2 * o1)}" rx="${f(w * .006)}" ${ln(1.2, 1)}/><path d="${inner}" ${ln(.8, .85)}/>` +
    corner(x0 + w * .004, y0 + w * .004) + corner(x1 - w * .004, y0 + w * .004) + corner(x0 + w * .004, y1 - w * .004) + corner(x1 - w * .004, y1 - w * .004) +
    dia(w / 2, y0, dr) + dia(w / 2, y1, dr) + dia(x0, h / 2, dr) + dia(x1, h / 2, dr) +
    box(w - pl - rw, hy, rw, hh) + box(pl + rw + g, hy, cw, hh) + box(pl, hy, rw, hh) + box((w - bw) / 2, bpy, bw, bph) + `</svg>`;
  return { svg, vars: { '--pt': f(hy + hh + w * .024) + 'px', '--pb': f(h - bpy + w * .012) + 'px', '--pl': f(pl) + 'px', '--pr': f(pl) + 'px', '--hy': f(hy) + 'px', '--hh': f(hh) + 'px', '--bpy': f(bpy) + 'px', '--bph': f(bph) + 'px', '--h1l': f(w - pl - rw) + 'px', '--h1w': f(rw) + 'px', '--h2l': f(pl + rw + g) + 'px', '--h2w': f(cw) + 'px', '--h3l': f(pl) + 'px', '--h3w': f(rw) + 'px' } };
}
/* Build 25 frame for the middle pages (modelled on the user's reference mushaf): thin gold lattice band, header OUTSIDE above the frame, marks in the side margins, manzil below. Every length is a fraction of the page width. */
function frameQ(w, h) {
  const f = n => n.toFixed(2), u = w, sm = .072 * u, ft = .07 * u, fb = h - .062 * u, t = .026 * u, x0 = sm, x1 = w - sm, y0 = ft, y1 = fb;
  const sw = .0019 * u, pad = .0056 * u;
  const zig = (xa, ya, len, vert) => { const n = Math.max(2, Math.round(len / (t * 2.7))), p = len / n; let d1 = '', d2 = ''; for (let i = 0; i <= n * 2; i++) { const a = xa + i * p / 2, odd = i % 2, u1 = odd ? t : 0, u2 = odd ? 0 : t; const P = (q, r) => vert ? `${f(ya + r)} ${f(a === undefined ? 0 : q)}` : ''; if (vert) { d1 += (i ? 'L' : 'M') + f(ya + u1) + ' ' + f(a) ; d2 += (i ? 'L' : 'M') + f(ya + u2) + ' ' + f(a); } else { d1 += (i ? 'L' : 'M') + f(a) + ' ' + f(ya + u1); d2 += (i ? 'L' : 'M') + f(a) + ' ' + f(ya + u2); } } return `<path d="${d1}" /><path d="${d2}" />`; };
  const corner = (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${f(t)}" height="${f(t)}"/><path d="M${f(x)} ${f(y)}L${f(x + t)} ${f(y + t)}M${f(x + t)} ${f(y)}L${f(x)} ${f(y + t)}"/>`;
  const g = zig(x0 + t, y0, x1 - x0 - 2 * t, 0) + zig(x0 + t, y1 - t, x1 - x0 - 2 * t, 0) + zig(y0 + t, x0, y1 - y0 - 2 * t, 1) + zig(y0 + t, x1 - t, y1 - y0 - 2 * t, 1) + corner(x0, y0) + corner(x1 - t, y0) + corner(x0, y1 - t) + corner(x1 - t, y1 - t);
  const svg = `<svg width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">` +
    `<g fill="none" stroke="var(--gd)" stroke-width="${f(sw)}" stroke-linejoin="round">` +
    `<rect x="${f(x0 - pad)}" y="${f(y0 - pad)}" width="${f(x1 - x0 + 2 * pad)}" height="${f(y1 - y0 + 2 * pad)}" stroke-width="${f(sw * .8)}"/>` +
    `<rect x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" stroke-width="${f(sw * 1.5)}"/>` +
    `<rect x="${f(x0 + t)}" y="${f(y0 + t)}" width="${f(x1 - x0 - 2 * t)}" height="${f(y1 - y0 - 2 * t)}" stroke-width="${f(sw * 1.5)}"/>` +
    `<rect x="${f(x0 + t + pad)}" y="${f(y0 + t + pad)}" width="${f(x1 - x0 - 2 * t - 2 * pad)}" height="${f(y1 - y0 - 2 * t - 2 * pad)}" stroke-width="${f(sw * .8)}"/>` +
    g + `</g></svg>`;
  return { svg, vars: { '--pt': f(y0 + t + pad + .006 * u) + 'px', '--pb': f(h - y1 + t + pad + .006 * u) + 'px', '--pl': f(sm + t + pad + .008 * u) + 'px', '--pr': f(sm + t + pad + .008 * u) + 'px', '--hy': f(.012 * u) + 'px', '--hh': f(.05 * u) + 'px', '--hl': f(sm) + 'px', '--bpy': f(y1 + pad + .004 * u) + 'px', '--bph': f(.046 * u) + 'px', '--sm': f(sm) + 'px' } };
}
function drawFrame(w, h) {
  const p = $('#rpage'); if (!p) return; let f = $('#rfr'); if (!f) { f = document.createElement('div'); f.id = 'rfr'; p.insertBefore(f, p.firstChild); }
  const cv = p.classList.contains('cover'), arch = p.classList.contains('arch'), mid = !cv && !arch; p.classList.toggle('sf', false); p.classList.toggle('sbq', false); p.classList.toggle('mq', !cv); p.classList.remove('thin');
  const v = (w / h) < 0.64 ? 'b' : 'a', g = frameGeo(v), k = Math.round(w) + 'x' + Math.round(h) + v + (cv ? 'c' : mid ? 's' : 'm'); if (f.dataset.k === k) return; f.dataset.k = k;
  const set = (n, val) => p.style.setProperty(n, val);
  if (mid) { const q = frameQ(w, h); f.className = 'fq'; f.innerHTML = q.svg; Object.keys(q.vars).forEach(n => set(n, q.vars[n])); p.style.removeProperty('--s'); return; }
  /* cover and the first two (arch) pages keep the Ottoman frame unchanged */
  f.className = 'v-' + v + (cv ? ' fc' : ' fm'); f.innerHTML = ''; p.style.removeProperty('--s');
  const X = x => (x / 740 * w) + 'px', Yp = y => (y / g.H * h) + 'px';
  set('--pt', Yp(g.yt)); set('--pb', ((g.H - g.yb) / g.H * h) + 'px'); set('--pl', X(g.xL)); set('--pr', X(740 - g.xR));
  set('--hy', Yp(g.hy)); set('--hh', Yp(g.hh)); set('--bpy', Yp(g.bpy)); set('--bph', Yp(g.bph)); set('--hl', (w * .15) + 'px');
}
function coverHtml() {
  const n = lay === '15' ? 15 : 13, nm = { '15': ['حافظی مصحف', 'Hafizi · IndoPak'], '13q': ['قدرت اللہ مصحف', 'Qudratullah'], '13t': ['تاج کمپنی مصحف', 'Taj Company'] }[lay] || ['', ''];
  const lobes = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const t = i * Math.PI / 4 + Math.PI / 8; return `<circle cx="${(100 + 60 * Math.cos(t)).toFixed(1)}" cy="${(100 + 60 * Math.sin(t)).toFixed(1)}" r="27" fill="none" stroke="currentColor" stroke-width="1.6"/>`; }).join('') + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const t = i * Math.PI / 4; return `<circle cx="${(100 + 60 * Math.cos(t)).toFixed(1)}" cy="${(100 + 60 * Math.sin(t)).toFixed(1)}" r="27" fill="var(--pgbg)" stroke="currentColor" stroke-width="2.2"/>`; }).join('');
  const dots = Array.from({ length: 48 }, (_, i) => { const t = i * Math.PI / 24; return `<circle cx="${(100 + 96 * Math.cos(t)).toFixed(1)}" cy="${(100 + 96 * Math.sin(t)).toFixed(1)}" r="1.5" fill="currentColor"/>`; }).join('');
  const med = `<svg viewBox="0 0 200 200" class="cv-svg" aria-hidden="true">${dots}${lobes}<circle cx="100" cy="100" r="62" fill="var(--pgbg)" stroke="currentColor" stroke-width="3"/><circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" stroke-width="1"/></svg><img class="cv-logo" src="icons/qs-logo.webp" alt="Quranic Science" draggable="false">`;
  const orn = `<svg viewBox="0 0 120 12" class="cv-or" aria-hidden="true"><path d="M0 6H46M74 6H120" stroke="currentColor" stroke-width="1"/><path d="M60 0l6 6-6 6-6-6z" fill="currentColor"/><circle cx="48" cy="6" r="2" fill="currentColor"/><circle cx="72" cy="6" r="2" fill="currentColor"/></svg>`;
  return `<div class="cv"><div class="cv-md"><img class="cv-app" src="icons/icon-512.png" alt="Fahmul Quraan by Quranic Science" draggable="false"></div>` +
    `<div class="cv-mid"><div class="cv-ln"><span class="cv-n">${n}</span><span class="cv-l"><b>LINES</b><i>سطری</i></span></div><div class="cv-sub">${nm[0]} · ${nm[1]}</div></div>` +
    `<div class="cv-by">${orn}<img class="cv-q" src="icons/qs-logo.webp" alt="" draggable="false"><b>by Quranic Science</b><span>قرآنک سائنس</span><em>quranicscience.info</em></div></div>`;
}
function renderCover() {
  const pg = $('#rpage'); pg.classList.add('arch', 'cover'); pg.classList.remove('mem'); archRows = 0;
  $('#rin').innerHTML = coverHtml(); $('#rhd').innerHTML = ''; $('#rpn').textContent = '';
  sizePage(); const ur = A.st().ui === 'ur';
  bmUpd(); $('#rTitle').textContent = 'Fahmul Quraan'; $('#rPg').textContent = (ur ? ad(0) + ' / ' + ad(PG.length) : '0 / ' + PG.length);
}
/* ---------- Build 27: two-page spread for square / foldable screens (open Mushaf: odd page right, even page left) ---------- */
function wantSpread() { const st = $('#rstage'); if (!st) return false; if (trvOn()) return false; const m = A && A.st().rsp || 'auto', w = st.clientWidth, h = st.clientHeight || 1; if (m === 'off') return false; if (m === 'on') return w >= 420; return w >= 600 && w / h >= 0.78 && w / h <= 1.75; }
function syncSpread() { const was = spread; spread = wantSpread(); if (spread && pi > 0) pi -= pi % 2; return was !== spread; }
function spDom(on) {
  const st = $('#rstage'); st.classList.toggle('sp', on); let c = st.querySelector('.spw2');
  if (on && !c) { c = document.createElement('div'); c.className = 'spw2'; c.innerHTML = '<div id="rpage"><div id="rhd"></div><div id="rin"></div><div id="rpn"></div></div>'; st.appendChild(c); const bk = document.createElement('div'); bk.id = 'rboard'; st.insertBefore(bk, st.firstChild); const sp = document.createElement('div'); sp.id = 'rspine'; st.appendChild(sp); }
  if (c) c.hidden = !on || pi + 1 >= PG.length; const b = st.querySelector('#rboard'), sp2 = st.querySelector('#rspine'); if (b) b.hidden = !on; if (sp2) sp2.hidden = !on;
}
function withComp(fn) { const c = $('#rstage').querySelector('.spw2'); if (!c || c.hidden) return; const sp = pi, sr = ROOT; ROOT = c; pi = sp + 1; try { fn(); } finally { pi = sp; ROOT = sr; } }
function layoutSpread() {
  const st = $('#rstage'), c = st.querySelector('.spw2'), m = st.querySelector(':scope > #rpage'), b = st.querySelector('#rboard'), sp = st.querySelector('#rspine'); if (!c || !m || !b) return;
  const cp = c.querySelector('#rpage'), one = c.hidden, L = one ? m.offsetLeft : cp.offsetLeft, W = m.offsetLeft + m.offsetWidth - L, T = m.offsetTop, H = m.offsetHeight, pad = Math.max(6, W * .018);
  Object.assign(b.style, { left: (L - pad) + 'px', top: (T - pad) + 'px', width: (W + pad * 2) + 'px', height: (H + pad * 1.6) + 'px', '--pp': pad + 'px' });
  const sw2 = Math.max(24, m.offsetWidth * .09);
  Object.assign(sp.style, { left: (one ? m.offsetLeft + m.offsetWidth - sw2 / 2 : m.offsetLeft - sw2 / 2) + 'px', top: T + 'px', width: sw2 + 'px', height: H + 'px' });
}
function stepPage(d) { if (!spread) { goPage(pi + d); return; } if (pi < 0) { if (d > 0) goPage(0); return; } if (pi === 0 && d < 0) { goPage(-1); return; } goPage(pi + 2 * d); }
function reflow() { if (!open || pi < 0) { if (open) sizePage(); return; } sizePage(); fit(); if (twoUp) { withComp(() => { sizePage(); fit(); }); layoutSpread(); } if (trkEl) trk(trkEl); }
function renderPage(anim) { renderPage0(anim); if (hz.on) forkMark(); try { trSync(); setTimeout(trSync, 650); } catch (e) { } }
function renderPage0(anim) {
  syncSpread();
  if (pi < 0) { twoUp = false; spDom(false); renderCover(); return; }
  twoUp = spread; spDom(twoUp);
  renderOne();
  if (twoUp) { withComp(renderOne); layoutSpread(); }
  renderTail(anim);
}
function renderOne() {
  const L = M.L[lay], lines = L.pages[PG[pi]];
  $('#rpage').classList.remove('trv');
  const arch = +PG[pi] <= 2; let nE = lines.filter(ln => lineParts(ln).k !== 'e').length; archRows = arch ? nE : 0;
  let ln2 = lines.slice(), duaN = 0; if (!arch) { let t = ln2.length; while (t > 0 && lineParts(ln2[t - 1]).k === 'e') t--; if (ln2.length - t >= 2) { duaN = ln2.length - t; ln2 = ln2.slice(0, t); } }
  rowX = lines.reduce((q, ln) => { const k = lineParts(ln).k; return q + (k[0] === 'h' && k.length > 1 ? .75 : k === 'b' ? .32 : 0); }, 0); const rows = rowsOf();
  { const p0 = $('#rpage'); p0.classList.remove('cover'); p0.classList.toggle('arch', arch); }
  let h = '', eIdx = (PG[pi] * 7) % 3;
  ln2.forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k === 'e') { if (!arch) h += `<div class="ml e">${EORN(eIdx++)}</div>`; }
    else if (k === 'b') h += `<div class="ml b"><div class="hx bw"><div class="in">${FLO}<span class="bt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>${FLO}</div></div></div>`;
    else if (k[0] === 'h') h += bannerHtml(+k.slice(1));
    else { const ws = rangeLocs(a, b); let rm = '', rb = '', sj = ''; ws.forEach(x => { if (x.w === 1 && window.FAHM_RUB) { rubSet(); const ri = RUBI[x.s + ':' + x.a]; if (ri !== undefined) rb = rubMark(ri); } if (isMk(x.t)) { ornSets(); const ak = x.s + ':' + x.a; if (RUKE.has(ak)) { const q = rukuFull(x.s, x.a); rm = `<i class="tg" data-sd="R" data-k="rq" data-ay="${adx(q.ay)}" data-pr="${adx(q.pr)}" data-sr="${adx(q.sr)}" data-tip="ruku · ayat ${q.ay} · para ${q.pr} · surah ${q.sr}"></i>`; } if (SAJ.has(ak)) sj = `<i class="tg" data-sd="R" data-k="sj" data-n="${adx(SAJ.get(ak))}"></i>`; } }); h += `<div class="ml ${k}">${ws.map(wordHtml).join('')}${rm}${sj}${rb}</div>`; }
  });
  if (duaN) h += duaHtml(duaN);
  { const pg0 = $('#rpage'); pg0.classList.toggle('mem', hz.on && A.st().hmode === 'mem'); }
  $('#rin').innerHTML = h; $('#rin').style.setProperty('--rows', rows);
  { ornSets(); const f0 = lines.map(lineParts).find(x => x.a); const mz = f0 ? manzilOfAi(AYI[f0.a.split(':').slice(0, 2).join(':')]) : 0; $('#rpn').innerHTML = mz ? `<div class="mzt">منزل ${adx(mz)}</div>` : ''; $('#rhd').innerHTML = headerHtml(lines); }
  sizePage(); fit(); bmUpd(); applyHl();
}
function renderTail(anim) {
  const pg = $('#rpage'), lines = M.L[lay].pages[PG[pi]];
  warm(pageSurah(pi));
  $('#rTitle').textContent = surahName(pageSurah(pi)) + ' · ' + R('pg') + ' ' + (A.st().ui === 'ur' ? ad(PG[pi]) : PG[pi]);
  $('#rPg').textContent = (A.st().ui === 'ur' ? ad(pi + 1) + (twoUp && pi + 1 < PG.length ? '–' + ad(pi + 2) : '') + ' / ' + ad(PG.length) : (pi + 1) + (twoUp && pi + 1 < PG.length ? '–' + (pi + 2) : '') + ' / ' + PG.length);
  if (anim && !twoUp) { pg.classList.remove('flip'); void pg.offsetWidth; pg.classList.add('flip'); }
  { const fl = lines.map(lineParts).find(x => x.a); if (fl) { const [s1, a1] = fl.a.split(':').map(Number); A.st().rlast = { s: s1, a: a1 }; A.save(); } }
  paintState();
}
const AD = '٠١٢٣٤٥٦٧٨٩', ad = n => String(n).replace(/\d/g, d => AD[d]);
const adx = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
function paintState() {
  if (curAy && (playing || hz.on)) qa(curAy.s, curAy.a).forEach(e => e.classList.add('cur'));
  if (hot) { const e = q(hot); if (e) { e.classList.add('hot'); if (!hz.on) { trk(e); trvScroll(e); } } }
  if (hz.on && hz.tr) markNext(); else if (!hot) trk(null);
}
/* ---------- real page turn: old page lifts around the spine (3D) + paper sound ---------- */
function pageSound() {
  try {
    if (A.st().sfx === 0) return;
    const a = new Audio('sfx/flip' + (Math.random() < .7 ? 1 : 2) + '.mp3'); a.volume = .9; const p = a.play(); if (p && p.catch) p.catch(() => { });
  } catch (e) { }
}
/* corner peel: the bottom-left corner lifts, the fold line sweeps across and the page turns over the spine (right) */
function clipPoly(poly, M, n, keepPos) {
  const out = [], f = p => ((p[0] - M[0]) * n[0] + (p[1] - M[1]) * n[1]) * (keepPos ? 1 : -1);
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
const polyCss = p => p.length < 3 ? 'polygon(0 0,0 0,0 0)' : 'polygon(' + p.map(q => q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px').join(',') + ')';
function flipFx(dir, run) {
  const pg = $('#rpage'), host = pg && pg.parentNode; if (!pg || !pg.offsetWidth || !$('#rin').children.length) { run(); return; }
  const hr = host.getBoundingClientRect(), r0 = pg.getBoundingClientRect(), W = r0.width, H = r0.height;
  let pbg = getComputedStyle(pg).backgroundColor; if (!pbg || /rgba\(.*,\s*0\)$/.test(pbg) || pbg === 'transparent') pbg = document.body.classList.contains('light') ? '#f6efdc' : '#0a1815';
  const mk = () => { const c = pg.cloneNode(true); c.classList.remove('flip'); c.setAttribute('data-clone', '1'); Object.assign(c.style, { willChange: 'clip-path, transform', contain: 'layout paint', position: 'absolute', margin: '0', left: (r0.left - hr.left) + 'px', top: (r0.top - hr.top) + 'px', width: W + 'px', height: H + 'px', pointerEvents: 'none', transform: 'none', animation: 'none', transformOrigin: '0 0', background: pbg, boxShadow: 'none' }); return c; };
  const wrap = (cls) => { const d = document.createElement('div'); d.className = cls; Object.assign(d.style, { position: 'absolute', left: (r0.left - hr.left) + 'px', top: (r0.top - hr.top) + 'px', width: W + 'px', height: H + 'px', pointerEvents: 'none' }); return d; };
  pageSound();
  const oldC = mk(); let turnEl, baseEl = null; run();
  if (dir === 'next') { turnEl = oldC; } else { baseEl = oldC; turnEl = mk(); pg.style.visibility = 'hidden'; }
  const shell = wrap('pt-shell'); shell.style.zIndex = 7;
  if (baseEl) { baseEl.style.left = '0'; baseEl.style.top = '0'; shell.appendChild(baseEl); }
  turnEl.style.left = '0'; turnEl.style.top = '0'; turnEl.style.zIndex = 2;
  const flapWrap = document.createElement('div'); Object.assign(flapWrap.style, { position: 'absolute', inset: '0', zIndex: 3, pointerEvents: 'none' });
  const flap = mk(); flap.style.left = '0'; flap.style.top = '0'; const back = document.createElement('div'); Object.assign(back.style, { position: 'absolute', inset: '0', pointerEvents: 'none' }); flap.appendChild(back);
  flapWrap.appendChild(flap); shell.appendChild(turnEl); shell.appendChild(flapWrap); host.appendChild(shell);
  const dark = document.body.classList.contains('light') ? '#ece3c8' : '#c9bf9e';
  const T = 720, t0 = performance.now(), fwd = dir === 'next';
  const rect = [[0, 0], [W, 0], [W, H], [0, H]];
  function draw(t) {
    const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const C = [e * 2.02 * W, H - Math.sin(Math.PI * Math.min(1, e * 1.15)) * H * .5 * (1 - e * .3)], A = [0, H];
    let dx = C[0] - A[0], dy = C[1] - A[1], L = Math.hypot(dx, dy) || 1; const n = [dx / L, dy / L], M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
    if (e < .004) { turnEl.style.clipPath = 'none'; flapWrap.style.display = 'none'; return; }
    flapWrap.style.display = '';
    turnEl.style.clipPath = polyCss(clipPoly(rect, M, n, true));
    flap.style.clipPath = polyCss(clipPoly(rect, M, n, false));
    const mn = M[0] * n[0] + M[1] * n[1];
    flap.style.transform = `matrix(${1 - 2 * n[0] * n[0]},${-2 * n[0] * n[1]},${-2 * n[0] * n[1]},${1 - 2 * n[1] * n[1]},${2 * mn * n[0]},${2 * mn * n[1]})`;
    const ang = Math.atan2(n[0], -n[1]) * 180 / Math.PI, Lg = Math.abs(W * n[0]) + Math.abs(H * n[1]), sx = W / 2 - n[0] * Lg / 2, sy = H / 2 - n[1] * Lg / 2, fp = (((M[0] - sx) * n[0] + (M[1] - sy) * n[1]) / Lg) * 100, sp = Math.max(8, 180 / Lg * 100);
    back.style.background = `linear-gradient(${ang}deg,${dark}f2 0%,${dark}f2 ${fp - sp * 2.2}%,rgba(60,45,20,.55) ${fp}%,rgba(60,45,20,.55) 100%),${dark}`;
    flap.style.opacity = e > .9 ? String(Math.max(0, (1 - e) * 10)) : '1';
  }
  function step(now) {
    let t = Math.min(1, (now - t0) / T); draw(fwd ? t : 1 - t);
    if (t < 1) requestAnimationFrame(step); else { shell.remove(); pg.style.visibility = ''; }
  }
  draw(fwd ? 0 : 1); requestAnimationFrame(step);
}
function goPage(i, anim) { i = Math.max(-1, Math.min(PG.length - 1, i)); if (open) syncSpread(); if (spread && i > 0) i -= i % 2; if (i === pi && $('#rin').children.length) return; const dir = i > pi ? 'next' : 'prev'; pi = i; if (spread && i >= 0 && anim !== false && open) { pageSound(); renderPage(false); const st = $('#rstage'); st.classList.remove('sfl'); void st.offsetWidth; st.classList.add('sfl'); setTimeout(() => st.classList.remove('sfl'), 520); return; } if (anim !== false && open) { const fm = A.st().rflip || 'curl'; if (fm === 'curl') flipFx(dir, () => renderPage(false)); else renderPage(fm === 'slide'); } else renderPage(anim !== false); }
function ensureLoc(loc) { const i = LP[loc]; if (i !== undefined && (spread && i > 0 ? i - i % 2 : i) !== pi) goPage(i); }

/* ---------- ayah audio + live word highlight ---------- */
function clearHl() { document.querySelectorAll('#rpage .cur,#rpage .hot').forEach(e => e.classList.remove('cur', 'hot')); if (!hz.on) trk(null); }
function setCur(s, a) {
  clearHl(); hot = null; curAy = { s, a }; mediaSess(); const key = s + ':' + a, ai = AYI[key];
  if (ai !== undefined) { const f = SC[AY[ai].first]; ensureLoc(f.loc); }
  qa(s, a).forEach(e => e.classList.add('cur')); try { trSync(); } catch (e) { }
}
function ayWords(s, a) { const ai = AYI[s + ':' + a]; return ai === undefined ? [] : SC.slice(AY[ai].first, AY[ai].last + 1); }
function startTick() {
  clearInterval(tickT);
  tickT = setInterval(() => {
    if (seqOn && !inBism && curAy && rau.duration && !rau.paused && !rau._fired && preEl) { const tt = wtGet(curAy.s, curAy.a); if (tt) { const endMs = tt[tt.length - 1]; if (endMs > 500 && rau.currentTime * 1000 >= endMs + 700 && rau.currentTime < rau.duration - .08) { rau._fired = 1; const f = rau.onended; if (f) f(); return; } } }
    if (inBism) return;
    if (!curAy || !rau.duration || rau.paused) return;
    const ws = ayWords(curAy.s, curAy.a); if (!ws.length) return;
    let pick = ws[ws.length - 1]; const tt = wtGet(curAy.s, curAy.a);
    if (tt) { const ms = rau.currentTime * 1000 + 30, n = tt.length - 1; let k = 0; for (let i = 0; i < n; i++) if (tt[i] <= ms) k = i; pick = ws[Math.min(ws.length - 1, n === ws.length ? k : Math.floor(k * ws.length / n))]; }
    else { const tot = ws.reduce((x, y) => x + y.wt, 0), lead = Math.min(.35, rau.duration * .06), tail = Math.min(.6, rau.duration * .1), t = Math.max(0, Math.min(1, (rau.currentTime - lead) / Math.max(.5, rau.duration - lead - tail))) * tot; let acc = 0; for (const w of ws) { acc += w.wt; if (t <= acc) { pick = w; break; } } }
    if (hot !== pick.loc) { const o = hot && q(hot); if (o) o.classList.remove('hot'); hot = pick.loc; ensureLoc(pick.loc); const e = q(pick.loc); if (e) { e.classList.add('hot', 'cur'); if (!hz.on) trk(e); } if (rev) { qa(curAy.s, curAy.a).forEach(x => x.classList.add('rev')); } }
  }, 50);
}
function setPlaying(p) { playing = p; if (p) wakeOn(); else if (!hz.on) wakeOff(); $('#rIcoP').style.display = p ? 'none' : ''; $('#rIcoS').style.display = p ? '' : 'none'; bgSync(p); if (p) mediaSess(); try { trSync(); } catch (e) { } }
function stopAudio() { inBism = false; document.querySelectorAll("#rpage .tl .tp.on").forEach(e => e.classList.remove("on")); try { if (trEl) { trEl.onended = null; trEl.pause(); trEl = null; } } catch (e) { } stopMine(); stopCorr(); try { stopWordAu(); } catch (e) { } try { speechSynthesis.cancel(); } catch (e) { } seqOn = false; rau.onended = null; rau.onerror = null; try { rau.pause(); } catch (e) { } clearInterval(tickT); setPlaying(false); clearHl(); document.querySelectorAll('#rpage .rev').forEach(e => e.classList.remove('rev')); hot = null; }
let seqEnd = -1, seqFrom = 0, seqLeft = 1;
function playRange(fi, ti, reps) { stopAudio(); seqEnd = ti; seqFrom = fi; seqLeft = Math.max(1, reps || 1); playSeq(fi, true); }
/* Build 30: pause keeps the exact spot. Resume within 60 s continues from that second; after a longer break the ayah starts again from its beginning */
let pausedSt = null; const RESUME_MS = 60000;
function pausePlay() { if (!seqOn || !curAy || !rau.src) { stopAudio(); return; } const ai = AYI[curAy.s + ':' + curAy.a]; pausedSt = ai == null ? null : { ai, t: rau.currentTime || 0, at: Date.now(), end: seqEnd, from: seqFrom, left: seqLeft }; stopAudio(); }
function takeResume(ai) { const p = pausedSt; pausedSt = null; if (!p || p.ai !== ai) return 0; if (Date.now() - p.at > RESUME_MS) return 0; seqEnd = p.end; seqFrom = p.from; seqLeft = p.left; return p.t > .3 ? Math.max(0, p.t - .15) : 0; }
/* Build 31: one unbroken flow like the original recording — each ayah's silent tail is measured (decoded once) and the next,
   already-downloaded ayah starts the moment the voice ends, keeping only a natural breath. A new surah begins with Bismillah. */
const SIL = {}; let inBism = false;
function ayaSil(url) {
  if (SIL[url]) return SIL[url];
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!Ctx || !window.fetch) return Promise.resolve(null);
  SIL[url] = fetch(url).then(r => r.ok ? r.arrayBuffer() : null).then(ab => ab ? new Ctx(1, 1, 22050).decodeAudioData(ab) : null).then(b => {
    if (!b) return null; const d = b.getChannelData(0), sr = b.sampleRate, win = Math.floor(sr * .02), th = .012;
    const rms = st => { let m = 0, n = 0; for (let k = st; k < st + win && k < d.length; k++) { m += d[k] * d[k]; n++; } return Math.sqrt(m / Math.max(1, n)); };
    let i0 = 0, i1 = d.length; for (let st = 0; st < d.length; st += win) if (rms(st) > th) { i0 = st; break; }
    for (let st = d.length - win; st > 0; st -= win) if (rms(st) > th) { i1 = st + win; break; }
    return { lead: i0 / sr, trail: Math.max(0, (d.length - i1) / sr), dur: d.length / sr };
  }).catch(() => null);
  const ks = Object.keys(SIL); if (ks.length > 40) delete SIL[ks[0]];
  return SIL[url];
}
const BISM_URL = () => auUrl(1, 1);
const needBism = y => y && y.a === 1 && y.s !== 1 && y.s !== 9;
function attachSil(el, url) { el._sil = null; el._fired = 0; ayaSil(url).then(sl => { if (sl && el.src && el.src.indexOf(url.split('/').pop()) >= 0) el._sil = sl; }); }
/* Build 32: translation voice after each ayah — the recorded translation audio the app already uses (EveryAyah: Urdu Shamshad Ali Khan, English Ibrahim Walk) */
const TRAU = { ur: 'translations/urdu_shamshad_ali_khan_46kbps', en: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps', fa: 'translations/Makarem_Kabiri_16Kbps' };
function trAuUrl(y) { const c = trCode(), k = (c.startsWith('ur') || c === 'rur') ? 'ur' : TRAU[c] ? c : null; return k ? `https://everyayah.com/data/${TRAU[k]}/${pad(y.s)}${pad(y.a)}.mp3` : null; }
let trEl = null;
function playTrAu(url, done) { try { if (trEl) trEl.pause(); } catch (e) { } trEl = new Audio(url); let fin = false; const go = () => { if (fin) return; fin = true; trEl = null; if (seqOn) done(); }; trEl.onended = go; trEl.onerror = go; const pr = trEl.play(); if (pr && pr.catch) pr.catch(go); }
function playSeq(ai, keep, resumeT, noBism) {
  if (!resumeT) pausedSt = null; if (!keep) seqEnd = -1;
  if (seqEnd >= 0 && ai > seqEnd) { if (seqLeft > 1) { seqLeft--; ai = seqFrom; } else { seqEnd = -1; stopAudio(); return; } }
  if (ai >= AY.length) { stopAudio(); return; }
  seqOn = true; const y = AY[ai]; setCur(y.s, y.a); setPlaying(true);
  if (needBism(y) && !noBism && !(resumeT > 0)) { playBism(ai); return; }
  inBism = false;
  /* Build 30: gapless — the NEXT ayah is already downloaded in a second audio element; at the end of an ayah we just switch to it, so the recitation never breaks off or stutters between ayahs */
  const url = auUrl(y.s, y.a), swap = preEl && preUrl === url && !(resumeT > 0);
  if (swap) { const old = rau; old.onended = null; old.onerror = null; try { old.pause(); } catch (e) { } rau = preEl; preEl = null; preUrl = ''; }
  rau.onerror = () => { stopAudio(); A.toast(R('audioErr')); };
  rau.onended = () => { if (!seqOn) return; rau.onended = null; const tu = trAuUrl(y); if (tu && A.st().trw && !hz.on) playTrAu(tu, () => playSeq(ai + 1, true)); else playSeq(ai + 1, true); };
  if (!swap) rau.src = url; setRate(rau, 1); rau._fired = 0; wtLoad(rec(), y.s);
  if (resumeT > 0) { let tr = 0; const seekTo = () => { if (Math.abs(rau.currentTime - resumeT) > .4 && tr++ < 6) { try { rau.currentTime = Math.min(resumeT, Math.max(0, (rau.duration || resumeT + 1) - .2)); } catch (e) { } } }; ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'progress'].forEach(ev => rau.addEventListener(ev, seekTo, { once: true })); }
  const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { stopAudio(); A.toast(R('audioErr')); });
  startTick(); preloadNext(ai);
}
let preEl = null, preUrl = '';
function preloadNext(ai) { try { const n = AY[ai + 1]; if (!n) return; const u = needBism(n) ? BISM_URL() : auUrl(n.s, n.a); wtLoad(rec(), n.s); if (preUrl === u) return; preEl = new Audio(); preEl.preload = 'auto'; preEl.src = u; preUrl = u; preEl.load(); } catch (e) { preEl = null; preUrl = ''; } }
function playBism(ai) {
  const url = BISM_URL(), swap = preEl && preUrl === url; inBism = true; clearHl();
  if (swap) { const old = rau; old.onended = null; old.onerror = null; try { old.pause(); } catch (e) { } rau = preEl; preEl = null; preUrl = ''; }
  rau.onerror = () => { inBism = false; if (seqOn) playSeq(ai, true, 0, true); };
  rau.onended = () => { if (!seqOn) return; rau.onended = null; inBism = false; playSeq(ai, true, 0, true); };
  if (!swap) rau.src = url; setRate(rau, 1); rau._fired = 0; wtLoad(rec(), 1);
  const pr = rau.play(); if (pr && pr.catch) pr.catch(() => { inBism = false; stopAudio(); A.toast(R('audioErr')); });
  startTick(); try { const y = AY[ai], u2 = auUrl(y.s, y.a); wtLoad(rec(), y.s); if (preUrl !== u2) { preEl = new Audio(); preEl.preload = 'auto'; preEl.src = u2; preUrl = u2; preEl.load(); } } catch (e) { }
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
/* Build 30: a light slip = ONE soft, round beep (not the loud double beep) — enough to notice, never a jolt in the middle of a rakat */
function chime() {
  unlockAc(); if (!ac) return; const t = ac.currentTime, c = ac.createDynamicsCompressor(); c.connect(ac.destination);
  [[740, 0, .9], [1480, 0, .18]].forEach(([f, d, v]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t + d); g.gain.exponentialRampToValueAtTime(.5 * v, t + d + .02); g.gain.setValueAtTime(.5 * v, t + d + .2); g.gain.exponentialRampToValueAtTime(.0001, t + d + .42); o.connect(g); g.connect(c); o.start(t + d); o.stop(t + d + .45); });
  try { if (navigator.vibrate) navigator.vibrate(70); } catch (e) { }
}
/* keep the screen awake while the Hafiz recites (a whole taraweeh): standard Wake Lock, plus the app shell's keep-awake hook when it exists */
let wLock = null;
async function wakeOn() { try { if (navigator.wakeLock && !wLock) { wLock = await navigator.wakeLock.request('screen'); wLock.addEventListener('release', () => { wLock = null; }); } } catch (e) { wLock = null; } try { window.FahmAndroid && window.FahmAndroid.keepAwake && window.FahmAndroid.keepAwake(true); } catch (e) { } }
function wakeOff() { try { wLock && wLock.release(); } catch (e) { } wLock = null; try { window.FahmAndroid && window.FahmAndroid.keepAwake && window.FahmAndroid.keepAwake(false); } catch (e) { } }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && (hz.on || playing)) wakeOn(); });
const flowOn = () => (A.st().hflow || 'flow') === 'flow';
const tickOn = () => (A.st().htick || 'off') === 'on';

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
  if (window.__fahmVS && window.__fahmVS.active()) return window.__fahmVS.cb(type, text);
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
const sensOf = () => A.st().hs || 'n';
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
/* Build 30: translation strip under the page (reading mode). Follows the playing / tapped ayah, else the first ayah on the page. */
const _trC = {};
/* ---------- Build 31: translation-Quran view — every ayah with its own one-line translation underneath (reader's choice of scholar) ---------- */
const TRC = ['ur', 'urj', 'urm', 'urh', 'urk', 'urq', 'urg', 'urn', 'urz', 'rur', 'en', 'hi', 'bn', 'fa', 'id', 'ms', 'tr', 'fr', 'de', 'es', 'ru', 'ta', 'so', 'sw'];
let LNG = null; fetch('q/langs.json').then(r => r.json()).then(j => { LNG = {}; j.forEach(o => LNG[o.c] = o.label || o.n); }).catch(() => { });
function trOpts() { const cur = trCode(); return TRC.map(c => `<option value="${c}" ${c === cur ? 'selected' : ''}>${esc((LNG && LNG[c]) || c)}</option>`).join(''); }
function trvOn() { try { return A.st().rtr === 'on' && !hz.on && pi >= 0; } catch (e) { return false; } }
function trvSize() { const p = $('#rpage'), st = $('#rstage'); if (!p || !st) return; p.style.height = Math.max(240, st.clientHeight - 16) + 'px'; const w = p.clientWidth || 360; p.style.setProperty('--fs', Math.max(24, Math.min(36, w / 12)).toFixed(1) + 'px'); p.style.setProperty('--rh', '46px'); p.style.setProperty('--hb', '42px'); }
function trvScroll(e) { if (!e) return; const P = $('#rpage'); if (P.classList.contains('trl')) { const l = e.closest('.ml'), st0 = $('#rstage'); if (!l || !st0) return; const r = l.getBoundingClientRect(), b = st0.getBoundingClientRect(); if (r.top < b.top + 10 || r.bottom + 60 > b.bottom) { try { l.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (er) { } } return; } if (!P.classList.contains('trv')) return; const g = e.closest('.tva'); if (!g) return; const box = $('#rin'), r = g.getBoundingClientRect(), b = box.getBoundingClientRect(); if (r.top < b.top + 8 || r.bottom > b.bottom - 8) { try { g.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (er) { } } }
function renderTrv(lines) {
  const p0 = $('#rpage'); p0.classList.remove('cover', 'arch'); archRows = 0; rowX = 0;
  let h = '', grp = [], gs = null; const code = trCode(), rtl = code.startsWith('ur') || code === 'fa';
  const close = fin => { if (!grp.length) return; h += `<div class="tva" data-ay="${gs}"><div class="tvx">${grp.join('')}</div>${fin ? `<div class="tvt" data-tr="${gs}" dir="${rtl ? 'rtl' : 'ltr'}"><span></span></div>` : `<div class="tvc">…</div>`}</div>`; grp = []; gs = null; };
  lines.forEach(ln => {
    const { k, a, b } = lineParts(ln);
    if (k === 'e') return;
    if (k === 'b') { close(false); h += `<div class="ml b tvb"><div class="hx bw"><div class="in"><span class="bt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span></div></div></div>`; return; }
    if (k[0] === 'h') { close(false); h += bannerHtml(+k.slice(1)); return; }
    rangeLocs(a, b).forEach(x => { const key = x.s + ':' + x.a; if (gs && gs !== key) close(false); gs = key; grp.push(wordHtml(x)); if (isMk(x.t)) close(true); });
  });
  close(false);
  $('#rin').innerHTML = `<div class="tvw">${h}</div>`; $('#rin').scrollTop = 0;
  { ornSets(); const f0 = lines.map(lineParts).find(x => x.a); const mz = f0 ? manzilOfAi(AYI[f0.a.split(':').slice(0, 2).join(':')]) : 0; $('#rpn').innerHTML = mz ? `<div class="mzt">منزل ${adx(mz)}</div>` : ''; $('#rhd').innerHTML = headerHtml(lines); }
  sizePage(); trvSize(); bmUpd(); applyHl();
  const ur = A.st().ui === 'ur';
  $('#rin').querySelectorAll('.tvt[data-tr]').forEach(el => { const [s1, a1] = el.dataset.tr.split(':').map(Number); trGet(s1, a1, code).then(t => { const sp = el.querySelector('span'); if (sp) sp.textContent = t || ''; }); });
}
/* touch & hold an ayah (about one second) → that ayah full screen with its translation */
function ayWordsText(s, a) {
  const ai = AYI[s + ':' + a]; if (ai == null) return ''; const y = AY[ai], p0 = LP[SC[y.first].loc], p1 = LP[SC[y.last].loc], out = [];
  for (let i = p0; i <= p1; i++) M.L[lay].pages[PG[i]].forEach(ln => { const { k, a: x0, b: x1 } = lineParts(ln); if (k === 't' || k === 'c' || /^[0-9a-zA-Z]$/.test(k)) { try { rangeLocs(x0, x1).forEach(x => { if (x.s === s && x.a === a) out.push(x.t); }); } catch (e) { } } });
  return out.join(' ');
}
let lpT = 0, lpFired = false, lpXY = null;
function ayFull(s, a) {
  let o = $('#rfs'); if (!o) { o = document.createElement('div'); o.id = 'rfs'; document.body.appendChild(o); o.addEventListener('click', e => { if (e.target.closest('[data-fsx]') || e.target === o) { o.classList.remove('on'); setTimeout(() => { o.hidden = true; }, 220); } else if (e.target.closest('[data-fsp]')) { const ai = AYI[o.dataset.ay]; o.classList.remove('on'); o.hidden = true; if (ai != null) { stopAudio(); playRange(ai, ai, 1); } } }); }
  const code = trCode(), rtl = code.startsWith('ur') || code === 'fa', ur = A.st().ui === 'ur';
  o.dataset.ay = s + ':' + a; o.hidden = false;
  o.innerHTML = `<div class="fs-in"><div class="fs-top"><b>${esc(surahName(s))} · ${ur ? ad(a) : a}</b><button class="ib" data-fsx="1" aria-label="close">✕</button></div><div class="fs-ar" dir="rtl">${esc(ayWordsText(s, a))}</div><div class="fs-tr" dir="${rtl ? 'rtl' : 'ltr'}"></div><small class="fs-by">${esc((LNG && LNG[code]) || '')}</small><button class="fs-play" data-fsp="1">▶ ${esc(R('fsPlay'))}</button></div>`;
  trGet(s, a, code).then(t => { const e = o.querySelector('.fs-tr'); if (e && o.dataset.ay === s + ':' + a) e.textContent = t || ''; });
  requestAnimationFrame(() => o.classList.add('on'));
}
function lpInit() {
  const st = $('#rstage'); if (!st || st._lp) return; st._lp = 1;
  const cancel = () => { clearTimeout(lpT); lpT = 0; };
  const start = (tg, x, y) => { if (hz.on) return; const w = tg && tg.closest && (tg.closest('.wd[data-loc]') || tg.closest('.tp[data-ay]')); if (!w) return; lpXY = [x, y]; cancel();
    lpT = setTimeout(() => { lpT = 0; lpFired = true; let s1, a1; if (w.dataset.loc) [s1, a1] = w.dataset.loc.split(':').map(Number); else [s1, a1] = w.dataset.ay.split(':').map(Number); try { navigator.vibrate && navigator.vibrate(18); } catch (er) { } ayFull(s1, a1); setTimeout(() => { lpFired = false; }, 900); }, 750); };
  /* touch (Android WebView / iPhone): touch events are reliable for a hold, pointer events get cancelled by the browser */
  st.addEventListener('touchstart', e => { if (e.touches.length !== 1) { cancel(); return; } const t = e.touches[0]; start(e.target, t.clientX, t.clientY); }, { passive: true });
  st.addEventListener('touchmove', e => { if (!lpT || !lpXY) return; const t = e.touches[0]; if (Math.hypot(t.clientX - lpXY[0], t.clientY - lpXY[1]) > 14) cancel(); }, { passive: true });
  st.addEventListener('touchend', e => { cancel(); if (lpFired) { e.preventDefault(); } }, { passive: false });
  st.addEventListener('touchcancel', cancel, { passive: true });
  /* mouse (PC) */
  st.addEventListener('mousedown', e => { if (e.button === 0) start(e.target, e.clientX, e.clientY); });
  st.addEventListener('mousemove', e => { if (lpT && lpXY && Math.hypot(e.clientX - lpXY[0], e.clientY - lpXY[1]) > 12) cancel(); });
  st.addEventListener('mouseup', cancel); st.addEventListener('mouseleave', cancel);
  st.addEventListener('click', e => { if (lpFired) { lpFired = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  st.addEventListener('contextmenu', e => { if (e.target.closest('.wd,.tp')) e.preventDefault(); });
  window.FahmOverlays = window.FahmOverlays || []; window.FahmOverlays.push({ isOpen: () => { const o = $('#rfs'); return !!(o && !o.hidden); }, close: () => { const o = $('#rfs'); o.classList.remove('on'); o.hidden = true; } });
}
/* Build 32: translation under every LINE of the real 15/13-line mushaf (like a printed translation Quran).
   Each ayah's translation is shared out over the lines it occupies in proportion to its Arabic words; the ayah number closes its piece. */
const MKW = {}; function ayN(s, a) { const k = s + ':' + a; if (MKW[k]) return MKW[k]; const w = (M.w && M.w[k]) || []; return (MKW[k] = w.filter(x => x[0] !== '۝').length || 1); }
function trlStrip() { const p = $('#rpage'); if (!p) return; p.querySelectorAll('#rin .tl').forEach(e => e.remove()); if (p.classList.contains('trl')) { p.classList.remove('trl'); if (p.dataset.h0) p.style.height = p.dataset.h0; try { if (!p.classList.contains('cover') && !p.classList.contains('arch')) drawFrame(p.offsetWidth, p.offsetHeight); } catch (e) { } } }
let trlTok = 0;
function trlApply() {
  const p = $('#rpage'), inner = $('#rin'); if (!p || !inner) return; trlStrip(); if (!trvOn() || twoUp || p.classList.contains('cover')) return;
  const code = trCode(), rtl = code.startsWith('ur') && code !== 'rur' || code === 'fa', tok = ++trlTok, need = new Set(), rows = [];
  inner.querySelectorAll('.ml').forEach(ml => {
    if (ml.matches('.e,.h,.b,.dua')) return; const g = []; let cur = null;
    ml.querySelectorAll('.wd[data-loc]').forEach(w => { const [s1, a1, w1] = w.dataset.loc.split(':').map(Number); const k = s1 + ':' + a1; if (!cur || cur.k !== k) { cur = { k, s: s1, a: a1, lo: w1, hi: w1 }; g.push(cur); } else { cur.lo = Math.min(cur.lo, w1); cur.hi = Math.max(cur.hi, w1); } });
    if (!g.length) return; g.forEach(x => need.add(x.k)); const tl = document.createElement('div'); tl.className = 'tl' + (rtl ? ' rt' : ''); tl.dir = rtl ? 'rtl' : 'ltr'; ml.after(tl); rows.push([tl, g]);
  });
  if (!rows.length) return; p.dataset.h0 = p.style.height; p.classList.add('trl'); p.style.height = 'auto';
  const reframe = () => { try { if (!p.classList.contains('arch')) drawFrame(p.offsetWidth, p.offsetHeight); placeTabs(); } catch (e) { } }; reframe();
  const fs = parseFloat(getComputedStyle(p).getPropertyValue('--fs')) || 24; p.style.setProperty('--tfs', Math.max(11.5, Math.min(17, fs * .5)).toFixed(1) + 'px');
  const ur = A.st().ui === 'ur';
  Promise.all([...need].map(k => { const [s1, a1] = k.split(':').map(Number); return trGet(s1, a1, code).then(t => [k, t || '']); })).then(list => {
    if (tok !== trlTok) return; const T = Object.fromEntries(list);
    rows.forEach(([tl, g]) => {
      tl.innerHTML = g.map(x => { const words = String(T[x.k] || '').split(/\s+/).filter(Boolean), n = ayN(x.s, x.a), L = words.length; if (!L) return ''; const i0 = x.lo <= 1 ? 0 : Math.round((x.lo - 1) / n * L), i1 = x.hi >= n ? L : Math.round(x.hi / n * L), piece = words.slice(i0, Math.max(i0, i1)).join(' '); const end = x.hi >= n; return `<span class="tp" data-ay="${x.k}">${esc(piece)}${end ? ` <i class="tn">${ur ? '﴿' + adx(x.a) + '﴾' : '(' + x.a + ')'}</i>` : ''}</span>`; }).join(' ');
    });
    reframe();
  });
}
function trCode() { if (A.st().rtrc) return A.st().rtrc; const tl = (A.st().tl || []).filter(c => c !== 'ar'); return tl[0] || (A.st().ui === 'en' ? 'en' : 'ur'); }
function trGet(sn, a, code) {
  const k = code + sn;
  if (!_trC[k]) _trC[k] = fetch('q/t/' + code + '/' + String(sn).padStart(3, '0') + '.json').then(r => r.json()).catch(() => { delete _trC[k]; return null; });
  return _trC[k].then(arr => arr && arr[a - 1] || '');
}
function trReflow() { setTimeout(() => { try { if (open) { if (wantSpread() !== spread) renderPage(false); else reflow(); } } catch (e) { } }, 30); }
function trSync(force) {
  const rd = $('#reader'); if (!rd) return; let el = $('#rtrn'); const want = false;
  if (!want) { if (el && !el.hidden) { el.hidden = true; trReflow(); } return; }
  if (!el) { el = document.createElement('div'); el.id = 'rtrn'; el.innerHTML = '<b class="tr-ref"></b><p class="tr-tx"></p>'; const stg = $('#rstage'); stg.parentNode.insertBefore(el, stg.nextSibling); }
  let ay = null;
  if (curAy && playing && qa(curAy.s, curAy.a).length) ay = curAy;
  else { const w = $('#rpage .wd[data-loc]'); if (w) { const [s2, a2] = w.dataset.loc.split(':').map(Number); ay = { s: s2, a: a2 }; } }
  if (!ay) { el.hidden = true; return; }
  const key = ay.s + ':' + ay.a + ':' + trCode(); if (!force && el.dataset.k === key && !el.hidden) return; el.dataset.k = key;
  const wasHidden = el.hidden; el.hidden = false;
  const ur = A.st().ui === 'ur'; el.dir = (trCode().startsWith('ur') || trCode() === 'fa') ? 'rtl' : 'ltr';
  el.querySelector('.tr-ref').textContent = surahName(ay.s) + ' · ' + (ur ? ad(ay.a) : ay.a);
  trGet(ay.s, ay.a, trCode()).then(t => { if (el.dataset.k === key) el.querySelector('.tr-tx').textContent = t || ''; });
  if (wasHidden) trReflow();
}
function ayTr(s, a) {
  const S = A.D().surahs.find(x => x.n === s); const Ay = S && S.ayat.find(x => x.v === a); if (!Ay) return '';
  const tl = A.st().tl || []; for (const c of tl) if (Ay.tr && Ay.tr[c]) return Ay.tr[c]; return (Ay.tr && (Ay.tr.ur || Ay.tr.en)) || '';
}
const ayRef = ai => { const y = AY[ai]; return surahName(y.s) + ' ' + (A.st().ui === 'ur' ? ad(y.a) : y.a); };
function hzStatus(k, cls) { const e = $('#rhSt'); e.textContent = R(k); e.className = cls || ''; }
/* glass tracking box: follows the word being recited (Hafiz) or played (audio) */
let trkEl = null;
function trk(e) {
  const st = $('#rstage'); let t = document.getElementById('rtrk');
  if (!e || !e.isConnected) { trkEl = null; if (t) t.classList.remove('on'); return; }
  trkEl = e; if (!t) { t = document.createElement('div'); t.id = 'rtrk'; t.innerHTML = '<i class="tk-s"></i><i class="tk-a"></i>'; st.appendChild(t); }
  /* Build 30: the box now spans the WHOLE line height (so zabar / zer / pesh / shadda above & below the letters are inside it), with a small even gap to the lines above and below */
  const sr = st.getBoundingClientRect(), r = e.getBoundingClientRect(), px = Math.max(4, r.width * .1), ml = e.closest && e.closest('.ml'), lr = ml ? ml.getBoundingClientRect() : null;
  let top = r.top, hgt = r.height;
  if (lr && lr.height > r.height * .9) { const gp = Math.max(1.5, lr.height * .05); top = Math.min(r.top - r.height * .06, lr.top + gp); const bot = Math.max(r.bottom + r.height * .06, lr.bottom - gp); hgt = bot - top; }
  else { top = r.top - Math.max(3, r.height * .12); hgt = r.height + Math.max(6, r.height * .24); }
  t.style.fontSize = Math.max(10, r.height * .5) + 'px'; t.style.width = (r.width + px * 2) + 'px'; t.style.height = hgt.toFixed(1) + 'px';
  t.style.transform = `translate(${(r.left - sr.left + st.scrollLeft - px).toFixed(1)}px,${(top - sr.top + st.scrollTop).toFixed(1)}px)`;
  t.classList.toggle('hz', !!hz.on); t.classList.add('on');
}
window.__trk = trk;
function markNext() {
  document.querySelectorAll('#rpage .nx').forEach(e => e.classList.remove('nx')); const w = SC[hz.tr.p];
  if (w) { const e = q(w.loc); if (e) { e.classList.add('nx'); trk(e); const st = $('#rstage'); if (st.scrollHeight > st.clientHeight + 4) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
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
function savePos(ai) { const y = AY[ai]; if (!y) return; const st = A.st(); if (!st.hlast || st.hlast.s !== y.s || st.hlast.a !== y.a) { st.hlast = { s: y.s, a: y.a }; A.save(); } if (hz.on) snapSave(ai); }
/* ----- Hafiz resume snapshot: survives closing / killing the app; offered again as a one-tap "continue from here" ----- */
const SNAPK = 'fahm.hzsnap'; let snapT = 0, snapAi = -1;
function snapSave(ai, force) {
  try {
    if (!hz.on || hz.finished || !hz.plan || ai == null || !AY[ai]) return;
    if (!force && ai === snapAi && Date.now() - snapT < 4000) return; snapAi = ai; snapT = Date.now();
    localStorage.setItem(SNAPK, JSON.stringify({ plan: hz.plan, ai, daur: hz.daur || 1, t: Date.now(), m: hz.cur ? hz.cur.mist.length : 0 }));
  } catch (e) { }
}
function snapGet() {
  try {
    const o = JSON.parse(localStorage.getItem(SNAPK) || 'null'); if (!o || !o.plan || o.ai == null || !AY[o.ai]) return null;
    if (Date.now() - o.t > 30 * 864e5) return null; const pl = o.plan; if (AYI[pl.fs + ':' + pl.fa] == null || AYI[pl.ts + ':' + pl.ta] == null) return null;
    if (o.ai < AYI[pl.fs + ':' + pl.fa] || o.ai > AYI[pl.ts + ':' + pl.ta]) return null; return o;
  } catch (e) { return null; }
}
function snapClear() { try { localStorage.removeItem(SNAPK); } catch (e) { } snapAi = -1; resHide(); }
function resShow() {
  const o = snapGet(); let b = $('#rres'); if (!o || hz.on || !open) { resHide(); return; }
  if (!b) { b = document.createElement('div'); b.id = 'rres'; $('#rhz').parentNode.insertBefore(b, $('#rhz')); b.addEventListener('click', e => { const t = e.target.closest('[data-rs]'); if (!t) return; if (t.dataset.rs === 'go') hzResumeSnap(); else snapClear(); }); }
  const y = AY[o.ai], ur = A.st().ui === 'ur';
  b.innerHTML = `<span class="rt">${esc(R('resBar'))}<b>${esc(surahName(y.s))} · ${ur ? ad(y.a) : y.a}</b></span><button class="po sm on" data-rs="go">${esc(R('resGo'))}</button><button class="po sm" data-rs="new">${esc(R('resNew'))}</button>`;
  b.hidden = false; requestAnimationFrame(() => { sizePage(); fit(); });
}
function resHide() { const b = $('#rres'); if (b && !b.hidden) { b.hidden = true; if (open) requestAnimationFrame(() => { sizePage(); fit(); }); } }
function hzResumeSnap() {
  const o = snapGet(); if (!o) { snapClear(); return; } resHide();
  const w = SC.find(x => x.ai === o.ai); if (w && LP[w.loc] !== undefined) goPage(LP[w.loc]);
  hzStart(o.ai, Object.assign({}, o.plan), o.daur || 1);
}
const posAi = () => Math.min(hz.tr.p, SC.length - 1);
function onHeard(idx, text, fin) {
  if (!hz.on || hz.busy || !hz.tr) return; hz.lastRes = Date.now();
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
      if (ev.t === 'ok') { setOk(ev.from, ev.to); rakatTick(ev.from, ev.to); hz.lastAct = Date.now(); hz.cur.words += ev.to - ev.from; if (hz.retry) for (const k in hz.retry) if (+k >= ev.from && +k < ev.to) delete hz.retry[k]; }
      else if (ev.t === 'soft') { const w = SC[ev.idx]; if (w) {
        /* substitution: a wrong word was said and the very next words were right again */
        if (ev.kind === 'skip' && ev.sub && ev.sub.length && (ev.n || 1) === 1) {
          if (realDiffer(ev.sub, w)) { const e2 = { t: 'mistake', idx: ev.idx, kind: 'wrong', heard: ev.sub.slice() }; if (classifyMist(e2) === 'alarm') { hz.proc[idx] = done + used; hzMistake(e2); return; } hzFlowMistake(e2, true); continue; }
          hz.cur.soft.push({ ai: w.ai, idx: ev.idx, kind: 'wrong', n: 0, heard: ev.sub.slice(), t: Date.now() - hz.cur.t0, abs: Date.now(), mic: 1 }); if (flowOn() && tickOn()) tick(); continue;
        }
        hz.cur.soft.push({ ai: w.ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, heard: ev.heard, letters: ev.letters, t: Date.now() - hz.cur.t0, abs: Date.now() }); if (flowOn() && tickOn()) tick(); }  }
      else if (ev.t === 'mistake') {
        const cl = classifyMist(ev);
        if (cl === 'alarm') {
          const need2 = !fin && ev.kind !== 'jump' && !(hz.sus && hz.sus.idx === ev.idx && Date.now() - hz.sus.t < 5000);
          if (need2) { /* not sure yet (interim text can still change / weak mic): wait for the next update before alarming */
            hz.sus = { idx: ev.idx, t: Date.now() }; const hl = (ev.heard || []).length; hz.tr.bad = (ev.heard || []).slice(0, Math.max(0, hl - 1)); hz.proc[idx] = Math.max(done, done + used - 1); return; }
          hz.sus = null; hz.proc[idx] = done + used; hzMistake(ev); return;
        }
        if (cl === 'doubt') hzFlowDoubt(ev); else hzFlowMistake(ev);
        if (hz.tr.done()) { hz.proc[idx] = done + used; hzDaurEnd(); return; } hard = true;
      }
      else if (ev.t === 'back') { for (let i = ev.to; i < ev.from; i++) { const w = SC[i]; if (!w) continue; okSet.delete(w.loc); const e = q(w.loc); if (e) e.classList.remove('ok', 'bad'); } hz.cur.backs = (hz.cur.backs || 0) + 1; hz.lastAct = Date.now(); hzStatus('backF', 'ok'); setTimeout(() => { if (hz.on && !hz.busy) hzStatus('listen'); }, 1400); }
      else if (ev.t === 'end') { hz.proc[idx] = done + used; hzDaurEnd(); return; }
    }
    if (!hard || r.used <= 0) break;
    rest = rest.slice(r.used);
  }
  hz.proc[idx] = fin ? toks.length : done + used;
  if (hz.tr.p !== p0) { const w = SC[posAi()]; if (w) ensureLoc(w.loc); markNext(); savePos(w.ai); if (hz.own && w) ownAdvance(w.ai); }
}

/* Build 30: MUTASHABIHAT hint. A word is a "fork" when the 4 words before it also occur somewhere else in the Quran but are followed by a DIFFERENT word. Such places are where a Hafiz slips into the wrong ayah — they get a small gold dot above the word (quiet, no sound). */
let FORK = null; const SCI = { src: null, m: null };
function forkBuild() {
  if (FORK && FORK.src === SC) return FORK;  FORK = new Set(); FORK.src = SC; const nx = new Map(), N = SC.length;
  for (let i = 4; i < N; i++) { const k = SC[i - 4].n + ' ' + SC[i - 3].n + ' ' + SC[i - 2].n + ' ' + SC[i - 1].n; let m = nx.get(k); if (!m) { m = new Set(); nx.set(k, m); } m.add(SC[i].n); }
  for (let i = 4; i < N; i++) { const k = SC[i - 4].n + ' ' + SC[i - 3].n + ' ' + SC[i - 2].n + ' ' + SC[i - 1].n, m = nx.get(k); if (m && m.size > 1 && SC[i].ai === SC[i - 1].ai) FORK.add(i); }
  return FORK;
}
function forkMark() {
  try {
    document.querySelectorAll('#rpage .fk').forEach(e => e.classList.remove('fk'));
    if (!hz.on || (A.st().hfork || 'on') !== 'on') return; const F = forkBuild(), a = AY[hz.fi].first, b = AY[hz.ti].last;
    if (SCI.src !== SC) { SCI.src = SC; SCI.m = new Map(); SC.forEach((w, i) => SCI.m.set(w.loc, i)); }
    document.querySelectorAll('#rpage .wd').forEach(e => { const i = SCI.m.get(e.dataset.loc); if (i !== undefined && i >= a && i <= b && F.has(i)) e.classList.add('fk'); });
  } catch (e) { }
}
function rakatTick(from, to) {
  try { ornSets(); for (let i = from; i < to; i++) { const w = SC[i]; if (w && AY[w.ai].last === i && RUKE.has(w.s + ':' + w.a)) { hz.rakat = (hz.rakat || 0) + 1; rakatShow(); } } } catch (e) { }
}
function rakatShow() { const e = $('#rhDaur'); if (e && hz.plan) e.textContent = R('daur') + ' ' + hz.daur + '/' + (hz.plan.reps || 1) + (hz.rakat ? ' · ' + R('rakat') + ' ' + hz.rakat : ''); }
function busyOn() { hz.busy = true; hz.busyAt = Date.now(); }
function busyOff() { hz.busy = false; if (hz.busyAt) { hz.cur.busyMs += Date.now() - hz.busyAt; hz.busyAt = 0; } }
function hzResume(ai, idx) {
  const y = AY[ai]; clearAyahMarks(ai); const p = idx != null && idx >= y.first && idx <= y.last ? idx : y.first;
  for (let i = y.first; i < p; i++) { setOk(i, i + 1); } hz.tr.setPos(p); markNext(); busyOff(); hz.lastAct = Date.now() + 600; hzStatus('listen'); recStart();
}
/* play only the faulty word (+ the next one) from the word-by-word audio; falls back to the whole ayah if that audio is not available */
let wAu = null;
function playWordsFrom(idx, count, cb) {
  const w0 = SC[idx]; if (!w0) { cb(false); return; }
  const list = []; for (let i = idx; i < Math.min(SC.length, idx + count); i++) { const w = SC[i]; if (w.ai !== w0.ai) break; const p3 = n => String(n).padStart(3, '0'); list.push({ i, url: 'https://audio.qurancdn.com/wbw/' + p3(w.s) + '_' + p3(w.a) + '_' + p3(w.w) + '.mp3', loc: w.loc }); }
  if (!list.length) { cb(false); return; }
  seqOn = false; stopCmp(); let k = 0, fin = false; wAu = wAu || new Audio();
  const end = ok => { if (fin) return; fin = true; wAu.onended = null; wAu.onerror = null; document.querySelectorAll('#rpage .rev').forEach(e => e.classList.remove('rev')); cb(ok); };
  const one = () => { if (fin || !hz.on) { end(false); return; } if (k >= list.length) { end(true); return; } const it = list[k++]; const e = q(it.loc); if (e) { ensureLoc(it.loc); e.classList.add('rev'); }
    wAu.onended = () => { if (e) e.classList.remove('rev'); setTimeout(one, 120); }; wAu.onerror = () => end(k > 1); wAu.src = it.url; setRate(wAu, fastRate()); const pr = wAu.play(); if (pr && pr.catch) pr.catch(() => end(k > 1)); };
  setTimeout(() => end(k > 0), 9000); one();
}
function stopWordAu() { if (wAu) { wAu.onended = null; wAu.onerror = null; try { wAu.pause(); } catch (e) { } } }
/* the ONLY thing that stops a Hafiz: the ayah itself changed (jumped to / skipped into another ayah). Everything else = beep + note, recitation continues. */
function ayahChange(ev) {
  const w = SC[ev.idx]; if (!w) return false;
  if (ev.kind === 'jump') { const t = SC[ev.to || 0]; return !!t && t.ai !== w.ai; }
  if (ev.kind === 'skip') { const t = SC[Math.min(SC.length - 1, ev.idx + (ev.n || 1))]; return !!t && t.ai !== w.ai; }
  return false;
}
/* Mic-tolerant judgement (Build 21): a real listener does not shout because the phone mic garbled a syllable.
   alarm = a REAL different Quran word was heard, or 3+ words skipped, or the ayah changed -> stop, warn, correct
   doubt = unknown/garbled sounds (recogniser noise) -> logged as a doubt, nothing interrupts
   flow  = 1-2 skipped words -> beeps + noted, recitation continues */
let RWS = null;
const isQWord = t => { if (!RWS) { RWS = new Set(); try { Object.keys(M.w).forEach(k => M.w[k].forEach(x => { const n = H.norm(x); if (n) RWS.add(n); })); } catch (e) { } } return RWS.has(t); };
const realDiffer = (heard, w) => (heard || []).some(t => t.length >= 3 && isQWord(t) && !H.eq(t, w.n, 'n'));
function classifyMist(ev) {
  if (ayahChange(ev)) return 'alarm';
  if (ev.kind === 'wrong') {
    /* Build 30: ONE odd word that happens to be a real Quran word is usually the phone mic / recogniser — it only becomes a serious alarm when TWO real different words were heard together, or the same spot is flagged twice within 12 s. Otherwise: one soft beep, no stopping. */
    const w = SC[ev.idx]; const real = (ev.heard || []).filter(t => t.length >= 3 && isQWord(t) && !H.eq(t, w.n, 'n'));
    if (!real.length) return 'doubt';
    const now = Date.now(), again = hz.sus2 && hz.sus2.idx === ev.idx && now - hz.sus2.t < 12000; hz.sus2 = { idx: ev.idx, t: now };
    return (real.length >= 2 || again) ? 'alarm' : 'flow';
  }
  if (ev.kind === 'skip') return (ev.n || 1) >= 3 ? 'alarm' : 'flow';
  return 'flow';
}
function hzFlowDoubt(ev) {
  const w = SC[ev.idx]; if (!w) return; const now = Date.now(), n = Math.max(1, (ev.heard || []).length);
  hz.cur.soft.push({ ai: w.ai, idx: ev.idx, kind: 'wrong', n: 0, heard: ev.heard, t: now - hz.cur.t0, abs: now, mic: 1 });
  setOk(ev.idx, Math.min(SC.length, ev.idx + n)); hz.tr.setPos(Math.min(ev.idx + n, hz.tr.lim)); hz.lastAct = now; if (tickOn()) tick();
  const c = hz.cur; if (!c.micWarned && c.soft.length >= 5 && c.soft.length * 5 > c.words) { c.micWarned = true; A.toast(R('micWeak'), 5000); }
}
/* flow mode: hard mistake = two beeps + note, but the recitation is never interrupted */
function hzFlowMistake(ev, keepPos) {
  const w = SC[ev.idx]; if (!w) return;
  const now = Date.now(), dup = hz.lastHard && now - hz.lastHard < 2000; hz.lastHard = now;
  let np = hz.tr.p, a = ev.idx, b = ev.idx + 1;
  if (ev.kind === 'skip') { b = ev.idx + (ev.n || 1); np = ev.idx + (ev.n || 1) + 1; }
  else if (ev.kind === 'wrong') { b = ev.idx + Math.max(1, (ev.heard || []).length); np = b; }
  else if (ev.kind === 'jump') { const to = ev.to || 0, ta = SC[to] && SC[to].ai; np = (ta != null && ta >= hz.fi && ta <= hz.ti) ? Math.min(hz.tr.lim, to + Math.max(2, (ev.heard || []).length)) : ev.idx; }
  if (!dup) {
    hz.cur.mist.push({ ai: w.ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, to: ev.to, heard: ev.heard, t: now - hz.cur.t0, abs: now });
    for (let i = a; i < Math.min(b, SC.length); i++) { const e = q(SC[i].loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(SC[i].loc); }
    chime(); hzStatus('wrongF', 'bad'); setTimeout(() => { if (hz.on && !hz.busy) hzStatus('listen'); }, 1200);
  }
  if (!keepPos) hz.tr.setPos(Math.min(np, hz.tr.lim)); hz.lastAct = now;
}
/* who announces the correct ayah after a mistake: the Qari (default) or the Hafiz's own saved voice (falls back to the Qari if that ayah was never saved) */
let corr = null, corrBuf = {};
function stopCorr() { if (!corr) return; corr.dead = true; try { corr.src.onended = null; corr.src.stop(); } catch (e) { } corr = null; }
async function ownSlice(ai) {
  let parts = []; try { parts = await DB.all(); } catch (e) { return null; }
  let best = null;
  parts.forEach(p => (p.marks || []).forEach(m => { if (m[0] === ai && m[2] - m[1] > 500 && (!best || p.t > best.p.t)) best = { p, m }; }));
  if (!best) return null;
  try {
    if (!corrBuf[best.p.id]) { const b = await DB.blob(best.p.id), Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext; corrBuf[best.p.id] = await new Ctx(1, 1, 16000).decodeAudioData(await b.arrayBuffer()); }
    return { buf: corrBuf[best.p.id], m: best.m };
  } catch (e) { return null; }
}
async function playCorrection(ai, cb) {
  const y = AY[ai];
  if ((A.st().hcor || 'qari') !== 'mine') { playOnce(y.s, y.a, true, cb); return; }
  unlockAc(); const sl = ac ? await ownSlice(ai) : null;
  if (!hz.on) return;
  if (!sl) { playOnce(y.s, y.a, true, cb); return; }
  seqOn = false; rev = true; setCur(y.s, y.a); qa(y.s, y.a).forEach(x => x.classList.add('rev'));
  const m = sl.m, off = Math.max(0, m[1] / 1000 - 0.05), dur = Math.max(0.3, (m[2] - m[1]) / 1000 + 0.12), src = ac.createBufferSource(), c = { src, dead: false }; corr = c;
  let fin = false; const done = () => { if (fin) return; fin = true; clearInterval(tickT); if (corr === c) corr = null; qa(y.s, y.a).forEach(x => x.classList.remove('rev')); rev = null; clearHl(); hot = null; if (!c.dead) cb && cb(); };
  src.buffer = sl.buf; src.connect(ac.destination); src.onended = done; const t0 = ac.currentTime; src.start(0, off, dur);
  clearInterval(tickT); tickT = setInterval(() => { if (!c.dead) hotAt(y, (ac.currentTime - t0) / dur); }, 70);
}
/* serious mistake: three quick beeps, then a FAST spoken warning ("Hafiz sahab, ruk jaiye - aap ne darmiyan ki aayat chhod di"). Native Android TTS first (works without voice packs in the WebView), then the browser voice. */
function beep3() {
  unlockAc(); if (!ac) return; const t0 = ac.currentTime, c = ac.createDynamicsCompressor(); c.connect(ac.destination);
  [0, 0.2, 0.4].forEach(d => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = 940; g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(1, t0 + d + 0.01); g.gain.setValueAtTime(1, t0 + d + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.14); o.connect(g); g.connect(c); o.start(t0 + d); o.stop(t0 + d + 0.16); });
  try { if (navigator.vibrate) navigator.vibrate([110, 60, 110, 60, 110]); } catch (e) { }
}
const WARN = {
  ur: { wrong: ['رکیے حافظ صاحب! آپ نے غلط پڑھا۔', 'ur-PK'], skip: ['رکیے حافظ صاحب! آپ نے درمیان کی آیت چھوڑ دی۔', 'ur-PK'], jump: ['رکیے حافظ صاحب! آپ آگے نکل گئے، درمیان کی آیت رہ گئی۔', 'ur-PK'] },
  hi: { wrong: ['रुकिए हाफ़िज़ साहब! आपने ग़लत पढ़ा।', 'hi-IN'], skip: ['रुकिए हाफ़िज़ साहब! आपने बीच की आयत छोड़ दी।', 'hi-IN'], jump: ['रुकिए हाफ़िज़ साहब! आप आगे निकल गए, बीच की आयत रह गई।', 'hi-IN'] },
  en: { wrong: ['Hafiz sahab, stop! You read it wrong.', 'en-US'], skip: ['Hafiz sahab, stop! You skipped an ayah in between.', 'en-US'], jump: ['Hafiz sahab, stop! You jumped ahead, an ayah was missed.', 'en-US'] },
  ar: { wrong: ['قف يا حافظ! أخطأت في القراءة.', 'ar-SA'], skip: ['قف يا حافظ! تركت آية في الوسط.', 'ar-SA'], jump: ['قف يا حافظ! تجاوزت آية في الوسط.', 'ar-SA'] }
};
function nativeSay(txt, lang, rate, cb) {
  try { if (!(window.FahmAndroid && window.FahmAndroid.speak)) return false; window.__fahmSpoke = ok => { window.__fahmSpoke = null; cb(ok !== false); }; const r = window.FahmAndroid.speak(txt, lang, rate); if (r === 'no') { window.__fahmSpoke = null; return false; } return true; } catch (e) { return false; }
}
let wAuW = null;
function warnClip(lg, kind, cb) {
  try {
    if (wAuW) { try { wAuW.pause(); } catch (e) { } } const u = new Audio('vo/warn/w_' + kind + '_' + lg + '.mp3'); wAuW = u; let g = false; const go = ok => { if (g) return; g = true; cb(ok); };
    u.onended = () => go(true); u.onerror = () => go(false); const pr = u.play(); if (pr && pr.catch) pr.catch(() => go(false)); return true;
  } catch (e) { return false; }
}
function speakWarn(done, kind) {
  const m0 = A.st().hwarn || 'ur', m = (A.st().xl && m0 === 'ur') ? 'en' : m0, k = kind === 'skip' || kind === 'jump' ? kind : 'wrong'; let fin = false, tm = null; const end = () => { if (fin) return; fin = true; clearTimeout(tm); try { window.__fahmSpoke = null; } catch (e) { } done && done(); };
  if (m === 'off') { end(); return; }
  const order = m === 'all' ? ['ur', 'en'] : m === 'ur' ? ['ur'] : [m]; tm = setTimeout(end, 9000); let i = 0, spoke = false;
  const nx = () => {
    if (fin || !hz.on) { end(); return; } if (i >= order.length) { end(); return; }
    const lg = order[i++], xb = window.FahmXL && FahmXL.bcp && FahmXL.bcp(); let tries = lg === 'ur' ? [WARN.ur[k], WARN.hi[k], WARN.en[k]] : [WARN[lg][k]]; if (xb && lg !== 'ur') tries = xb === 'ar' ? [WARN.ar[k]] : [[FahmXL.t(WARN.en[k][0]), xb], WARN.en[k]]; let j = 0;
    const one = () => {
      if (fin) return; if (j >= tries.length) { if (!spoke && i >= order.length) end(); else nx(); return; }
      const [txt, lang] = tries[j++];
      /* Build 27: ElevenLabs recorded voice first (ur / en / ar); the phone voice is only a fallback for other languages */
      { const lc = lang.slice(0, 2), cl = lc === 'hi' ? 'ur' : lc; if ((cl === 'ur' || cl === 'en' || cl === 'ar') && (lc !== 'hi' || tries[0] === WARN.ur[k])) { if (warnClip(cl, k, ok => { if (ok) { spoke = true; nx(); } else one(); })) return; } }
      if (nativeSay(txt, lang, 1.2, ok => { if (ok) { spoke = true; nx(); } else one(); })) return;
      let vs = []; try { vs = speechSynthesis.getVoices(); } catch (e) { }
      const v = vs.find(x => x.lang === lang) || vs.find(x => x.lang.slice(0, 2) === lang.slice(0, 2));
      if (!('speechSynthesis' in window) || (vs.length && !v)) { one(); return; }
      try { const u = new SpeechSynthesisUtterance(txt); u.lang = lang; if (v) u.voice = v; u.rate = 1.15; let g = false; const go = ok => { if (g) return; g = true; if (ok) spoke = true; ok ? nx() : one(); }; u.onend = () => go(true); u.onerror = () => go(false); setTimeout(() => go(false), 4500); speechSynthesis.speak(u); } catch (e) { one(); }
    };
    one();
  };
  try { speechSynthesis.cancel(); } catch (e) { } nx();
}
function hzMistake(ev) {
  busyOn(); recStop(); const w = SC[ev.idx], ai = w.ai, y = AY[ai];
  { const L = hz.cur.mist[hz.cur.mist.length - 1]; if (!(L && L.ai === ai && Date.now() - L.abs < 2500)) hz.cur.mist.push({ ai, idx: ev.idx, kind: ev.kind, n: ev.n || 0, to: ev.to, heard: ev.heard, t: Date.now() - hz.cur.t0, abs: Date.now() }); else { L.kind = ev.kind; L.abs = Date.now(); } }
  const e = q(w.loc); if (e) { e.classList.add('bad'); e.classList.remove('ok'); } okSet.delete(w.loc);
  hzStatus('wrong', 'bad'); beep3();
  hz.retry = hz.retry || {}; const tries = hz.retry[ev.idx] = (hz.retry[ev.idx] || 0) + 1;
  setTimeout(() => { if (!hz.on) return; speakWarn(() => {
    if (!hz.on) return;
    const whole = () => { delete hz.retry[ev.idx]; playCorrection(ai, () => { if (hz.on) hzResume(ai); }); };
    if (tries >= 3) { whole(); return; }                       /* third failed try at the same spot: now the whole ayah */
    const cnt = ev.kind === 'skip' && (ev.n || 1) >= 2 ? 2 : (ev.kind === 'wrong' && (ev.heard || []).length >= 2 ? 2 : 2);
    playWordsFrom(ev.idx, cnt, ok => { if (!hz.on) return; if (ok) hzResume(ai, ev.idx); else whole(); });
  }, ev.kind); }, 700);
}
function hzLukma() {
  if (hz.busy || !hz.tr || hz.tr.done()) return; busyOn(); recStop();
  const w = SC[hz.tr.p], ai = w.ai, y = AY[ai]; hzStatus('luq', 'warn');
  hz.cur.stalls.push({ ai, idx: hz.tr.p, t: Date.now() - hz.cur.t0, abs: Date.now(), wait: silOf() });
  ensureLoc(w.loc); playCorrection(ai, () => { if (hz.on) hzResume(ai); });
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

/* ruku based target: the rukus of a para (a ruku belongs to the para where it ends, like the printed mushaf) */
function rukuList(j) {
  const R0 = M.meta.R, [a, b] = juzRange(j), out = [];
  for (let i = 0; i < R0.length; i++) {
    const st0 = AYI[R0[i][0] + ':' + R0[i][1]]; if (st0 == null) continue;
    const e = i + 1 < R0.length ? AYI[R0[i + 1][0] + ':' + R0[i + 1][1]] - 1 : AY.length - 1;
    if (e >= a && e <= b) out.push({ fi: Math.max(st0, a), ti: e });
  }
  return out;
}
function rukuState() {
  const st = A.st(), pl = planDefault(), fi = AYI[pl.fs + ':' + pl.fa], ti = AYI[pl.ts + ':' + pl.ta], k = st.hrk;
  const j = k && k.j && fi != null && juzOfAi(fi) !== k.j && k.f != null && !(fi >= juzRange(k.j)[0] && fi <= juzRange(k.j)[1]) ? juzOfAi(fi) : (k && k.j && fi != null && fi >= juzRange(k.j)[0] && fi <= juzRange(k.j)[1] ? k.j : juzOfAi(fi == null ? 0 : fi));
  const L = rukuList(j), n = L.length || 1; let f = 1, t = n;
  if (fi != null && ti != null) { const f1 = L.findIndex(r => r.ti >= fi); f = f1 < 0 ? 1 : f1 + 1; let t1 = -1; L.forEach((r, i) => { if (r.fi <= ti) t1 = i; }); t = t1 < 0 ? n : Math.max(f, t1 + 1); }
  return { j, L, f, t };
}
function applyRuku(j, f, t) {
  const L = rukuList(j); if (!L.length) return; f = Math.max(1, Math.min(L.length, f)); t = Math.max(f, Math.min(L.length, t));
  const y = AY[L[f - 1].fi], z = AY[L[t - 1].ti], pl = Object.assign({}, planDefault());
  pl.fs = y.s; pl.fa = y.a; pl.ts = z.s; pl.ta = z.a; pl.amt = 0; A.st().hplan = pl; A.st().hrk = { j, f, t }; A.save();
}
function planSummaryR() { const k = rukuState(), ur = A.st().ui === 'ur', n = k.t - k.f + 1; return (ur ? ad(n) : n) + ' ' + R('rkN'); }
function popSetup() {
  const st = A.st(), pl = planDefault(), ur = st.ui === 'ur', last = st.hlast && AYI[st.hlast.s + ':' + st.hlast.a] != null ? st.hlast : null;
  const fi = AYI[pl.fs + ':' + pl.fa], ti = AYI[pl.ts + ':' + pl.ta];
  const sOpt = (sel) => surahsInScope().map(s => `<option value="${s}" ${s === sel ? 'selected' : ''}>${esc(surahName(s))}</option>`).join('');
  const aOpt = (s, sel) => AY.filter(y => y.s === s).map(y => `<option value="${y.a}" ${y.a === sel ? 'selected' : ''}>${ur ? ad(y.a) : y.a}</option>`).join('');
  const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  const am = AMTS.map(([k, v]) => `<button class="po sm ${pl.amt === v && endForAmt(fi, v) === ti ? 'on' : ''}" data-amt="${v}">${esc(R(k))}</button>`).join('');
  $('#rpop').dataset.pk = 's';
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))} · ${esc(R('target'))}</h4>` +
    (last ? `<button class="po on" data-hres="1">${esc(R('resume'))}: ${esc(surahName(last.s))} ${ur ? ad(last.a) : last.a}</button>` : '') +
    `<div class="sec">${esc(R('from'))}</div><div class="card"><div class="pr"><select id="tfS" class="sel">${sOpt(pl.fs)}</select><select id="tfA" class="sel">${aOpt(pl.fs, pl.fa)}</select></div>` +
    `<div class="pr"><select id="tJ" class="sel"><option value="">${esc(R('fromPara'))}…</option>${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}">${esc(R('paraW'))} ${ur ? ad(i + 1) : i + 1}</option>`).join('')}</select></div></div>` +
    (() => { const k = rukuState(), nr = k.L.length, ur2 = ur, nn = v => ur2 ? ad(v) : v, ro = (sel) => Array.from({ length: nr }, (_, i) => `<option value="${i + 1}" ${i + 1 === sel ? 'selected' : ''}>${esc(R('rkW'))} ${nn(i + 1)}</option>`).join('');
      return `<div class="sec">${esc(R('rkS'))}</div><div class="card"><div class="pr"><select id="rkJ" class="sel">${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}" ${i + 1 === k.j ? 'selected' : ''}>${esc(R('rkP'))} ${nn(i + 1)}</option>`).join('')}</select></div><div class="pr"><span>${esc(R('rkF'))}</span><select id="rkF" class="sel">${ro(k.f)}</select></div><div class="pr"><span>${esc(R('rkT'))}</span><select id="rkT" class="sel">${ro(k.t)}</select></div><div class="sum">${esc(planSummaryR())} / ${nn(nr)}</div></div>`; })() +
    `<div class="sec">${esc(R('amt'))}</div><div class="chips">${am}<button class="po sm" data-q="fat">${esc(R('qFat'))}</button><button class="po sm" data-q="all">${esc(R('qAll'))}</button></div>` +
    `<div class="sec">${esc(R('to'))}</div><div class="card"><div class="pr"><select id="ttS" class="sel">${sOpt(pl.ts)}</select><select id="ttA" class="sel">${aOpt(pl.ts, pl.ta)}</select></div></div>` +
    `<div class="sum">${esc(planSummary(Math.min(fi, ti), Math.max(fi, ti)))}</div>` +
    `<div class="sec">${esc(R('reps'))}</div><div class="chips">${[1, 2, 3, 5, 7, 10].map(v => sw('reps', v, String(v), (pl.reps || 1) === v)).join('')}</div>` +
    `<button class="po on" data-hgo="1">${esc(R('start'))}</button><div class="chips"><button class="po sm" data-hset="1">${esc(R('settings'))}</button><button class="po sm" data-hist="1">${esc(R('history'))}</button><button class="po sm" data-weak="1">⚠ ${esc(R('weak'))}</button><button class="po sm" data-mine="1">● ${esc(R('myBtn'))}</button></div>`;
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
function hzStart(fromAi, plan, daur0) {
  hz.own = !!hz.ownNext; hz.ownNext = false; hz.ownAi = null;
  stopAudio(); unlockAc(); popClose(); resHide();
  hz.native = nativeOk(); if (!hz.native && !webOk()) { A.toast(R('noRec'), 4500); return; }
  const st = A.st(); if (!st.v3h) { st.v3h = 1; st.hs = 'n'; st.htick = 'off'; st.hflow = 'flow'; A.save(); } if (!st.hs) st.hs = 'n'; if (!st.hsil) st.hsil = 4; if (!st.hmode) st.hmode = 'look';
  const pl = plan || planDefault(); st.hplan = pl; A.save();
  hz.plan = pl; hz.fi = AYI[pl.fs + ':' + pl.fa]; hz.ti = AYI[pl.ts + ':' + pl.ta]; hz.all = []; hz.daur = daur0 || 1; hz.finished = false; hz.startAi = fromAi != null ? Math.max(hz.fi, Math.min(hz.ti, fromAi)) : hz.fi;
  hz.on = true; hz.want = true; hz.started = Date.now(); wakeOn(); hz.rakat = 0;
  { const S0 = A.st(); if (S0.hzTr !== false && S0.trw) { S0.trwWas = 1; S0.trw = false; A.save(); } try { speechSynthesis.cancel(); } catch (e) { } }
  $('#rrep').hidden = true; $('#rhz').hidden = false; $('#rhHold').hidden = !hz.own; $('#rhHold').textContent = '⏸ ' + R('myHold'); $('#rhMode').textContent = R(st.hmode); $('#rMic').classList.add('on'); $('#rpage').classList.toggle('mem', st.hmode === 'mem');
  clearInterval(hz.sil); hz.sil = setInterval(() => { if (hz.on && !hz.busy && Date.now() - hz.lastAct > silOf() * 1000 && Date.now() - (hz.lastRes || 0) > 1800) hzLukma(); }, 250);
  recBegin();
  hzBeginDaur(hz.startAi);
}
function hzBeginDaur(ai) {
  try { for (let i = hz.fi; i <= hz.ti; i++) { const sn = AY[i].s; if (!hz._w || !hz._w[sn]) { (hz._w = hz._w || {})[sn] = 1; warm(sn); } } } catch (e) { }
  hz.finished = false; hz.cur = newDaur(hz.daur); hz.tr = new H.Tracker(SC, sensOf(), STARTS); hz.tr.lim = AY[hz.ti].last + 1; hz.tr.fi = AY[hz.fi].first; hz.tr.setPos(AY[ai].first);
  okSet = new Set(); clearHl(); curAy = null; hz.busy = false; hz.lastAct = Date.now() + 3000; hz.proc = {}; hz.prev = null;
  renderPage(false); ensureLoc(SC[hz.tr.p].loc); markNext(); savePos(ai); hzStatus('listen'); rakatShow(); forkMark();
  recStart();
}
function hzStop() {
  trk(null);
  if (hz.on && hz.tr && !hz.finished) { try { const w = SC[Math.min(hz.tr.p, SC.length - 1)]; if (w) snapSave(w.ai, true); } catch (e) { } }
  { const S0 = A.st(); if (S0.trwWas) { S0.trw = true; delete S0.trwWas; A.save(); } }
  recEnd(); hz.on = false; hz.want = false; hz.busy = false; recStop(); clearInterval(hz.sil); stopAudio(); wakeOff(); $('#rhz').hidden = true; $('#rMic').classList.remove('on');
  $('#rpage').classList.remove('mem'); document.querySelectorAll('#rpage .nx,#rpage .bad,#rpage .ok').forEach(e => e.classList.remove('nx', 'bad', 'ok')); okSet = new Set();
}
function hzDaurEnd() {
  if (hz.own) { ownAdvance(hz.ti + 1); recEnd(); }
  busyOn(); recStop(); const d = hz.cur; d.t1 = Date.now(); hz.all.push(d); try { logRound(d, { fi: hz.fi, ti: hz.ti }); } catch (e) { } hz.finished = true; snapClear(); hzStatus('done', 'ok'); hz.busyAt = 0; hz.busy = true;
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
function stopCmp() { if (cau) { cau.onended = null; try { cau.pause(); } catch (e) { } } if (msrc) { try { msrc.stop(); } catch (e) { } msrc = null; } }
function playQari(ai) { const y = AY[ai]; if (!y) return; stopCmp(); stopAudio(); cau = cau || new Audio(); cau.onended = null; cau.src = errUrl(y.s, y.a); setRate(cau, fastRate()); const pr = cau.play(); if (pr && pr.catch) pr.catch(() => A.toast(R('audioErr'))); }
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
/* ----- reports ----- */
const fmtT = ms => { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); };
const nu = v => (A.st().ui === 'ur' ? ad(v) : v);
const clk = ms => { try { return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const clk2 = ms => { try { return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch (e) { return ''; } };
const dstr = ms => { try { return new Date(ms).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
const wAr = (s, a, w) => { try { return M.w[s + ':' + a][w - 1].replace(/[۝].*/, ''); } catch (e) { return ''; } };
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
const kindTxt = k => ({ wrong: R('kWrong'), skip: R('kSkip'), jump: R('kJump'), stall: R('atka'), doubt: R('doubt'), makhraj: R('tjDoubt'), harakat: R('hkBad'), extra: R('doubt') }[k] || k);
const kindCls = k => ({ wrong: 'bad', skip: 'bad', jump: 'bad', stall: 'warn', doubt: 'dbt', extra: 'dbt', makhraj: 'tj', harakat: 'hk' }[k] || '');
function section(title, body, cls, icon) { return body ? `<div class="rs ${cls || ''}"><h5>${icon ? '<i>' + icon + '</i>' : ''}${esc(title)}</h5>${body}</div>` : ''; }
const tmB = m => m.abs ? `<span class="rtm">⏱ ${esc(clk2(m.abs))}${m.t != null ? ' · +' + esc(fmtT(m.t)) : ''}</span>` : '';
function mistakeList(list) {
  return list.map(m => { const w = SC[m.idx]; return `<div class="ri"><div class="rih"><b>${esc(ayRef(m.ai))}</b><span class="rk ${kindCls(m.kind)}">${esc(kindTxt(m.kind))}</span>${tmB(m)}</div><div class="rwd ar">${esc(wAr(w.s, w.a, w.w))}</div>${cmpBtns(m)}<small>${esc(impact(m))}</small></div>`; }).join('');
}
/* hero: ring + chips */
function hero(title, pct, sub, chips) {
  return `<div class="rhero"><div class="rring" style="--p:${pct}"><b>${nu(pct)}%</b><small>${esc(R('clean'))}</small></div><div class="rhm"><h4>${esc(title)}</h4><div class="rsub">${esc(sub)}</div></div></div>` +
    `<div class="rchips">${chips.map(c => `<span class="rch ${c[0]}"><b>${c[1]}</b><small>${esc(c[2])}</small></span>`).join('')}</div>`;
}
const flagSet = list => { const f = new Set(); list.forEach(d => { d.mist.forEach(m => f.add(m.ai)); d.stalls.forEach(m => f.add(m.ai)); d.soft.forEach(m => f.add(m.ai)); }); return f; };
/* ----- harakat / tajweed self-check (the phone mic cannot hear harakat; the Hafiz listens to the qari and marks honestly) ----- */
let HKM = {};
function hkMark(key, val) {
  const [s, a, w] = key.split(':').map(Number), day = new Date().setHours(0, 0, 0, 0), lg = hlLoad();
  lg.e = lg.e.filter(x => !(x.k === 'harakat' && x.hk === key && x.day === day)); if (val === 'bad') lg.e.push({ at: Date.now(), r: 0, k: 'harakat', s, a, w, hk: key, day });
  hlSave(lg); if (val) HKM[key] = val; else delete HKM[key];
}
function hkRows(flag, onlyFlag) {
  const out = [], seen = new Set();
  for (let ai = VM.fi; ai <= VM.ti; ai++) {
    const y = AY[ai], fl = flag.has(ai); if (onlyFlag && !fl) continue;
    for (let i = y.first; i <= y.last; i++) { const w = SC[i], k = w.s + ':' + w.a + ':' + w.w, n = hkNote(k); if (!n) continue; const st = HKM[k] || '';
      out.push({ fl, html: `<div class="ri"><div class="rih"><b>${esc(ayRef(ai))}</b>${fl ? '<span class="rk warn">⚠</span>' : ''}</div><div class="rwd ar">${esc(wAr(w.s, w.a, w.w))}</div><button class="po sm" data-hq="${ai}">▶ ${esc(R('cQari'))}</button><button class="po sm hkb ${st === 'ok' ? 'on' : ''}" data-hkm="ok" data-hkk="${k}">${esc(R('hkOk'))}</button><button class="po sm hkb bad ${st === 'bad' ? 'on' : ''}" data-hkm="bad" data-hkk="${k}">${esc(R('hkNo'))}</button><small>${esc(n)}</small></div>` }); }
  }
  out.sort((a, b) => (b.fl ? 1 : 0) - (a.fl ? 1 : 0)); return out.map(x => x.html).join('');
}
function daurHtml(d) {
  if (!DICT) dictBuild(); const s = dStats(d), mk = d.soft.filter(x => x.kind === 'makhraj'), ds = d.soft.filter(x => x.kind !== 'makhraj');
  const stalls = d.stalls.map(x => `<div class="ri"><div class="rih"><b>${esc(ayRef(x.ai))}</b><span class="rk warn">${esc(R('atka'))}</span>${tmB(x)}</div><div class="rwd ar">${esc(wAr(SC[x.idx].s, SC[x.idx].a, SC[x.idx].w))}</div>${cmpBtns(x)}</div>`).join('');
  const soft = ds.map(m => `<div class="ri"><div class="rih"><b>${esc(ayRef(m.ai))}</b>${tmB(m)}</div><div class="rwd ar">${esc(wAr(SC[m.idx].s, SC[m.idx].a, SC[m.idx].w))}</div>${m.heard && m.heard.length ? '<small class="hd">← ' + esc(heardTxt(m)) + '</small>' : ''}${cmpBtns(m)}</div>`).join('');
  const tj = mk.map(m => `<div class="ri"><div class="rih"><b>${esc(ayRef(m.ai))}</b>${tmB(m)}</div><div class="rwd ar">${esc(wAr(SC[m.idx].s, SC[m.idx].a, SC[m.idx].w))}</div><small class="hd">← ${esc(heardTxt(m))}${m.letters ? ' (' + esc(m.letters.join(' ، ')) + ')' : ''}</small>${cmpBtns(m)}</div>`).join('');
  const clean = s.clean.length ? `<div class="ri rcl">${s.clean.map(i => `<span>${esc(ayRef(i))}</span>`).join('')}</div>` : '';
  const hkh = hkRows(flagSet([d]), true);
  return hero(R('daurRep') + ' ' + nu(d.n), s.cleanPct, dstr(d.t0) + ' · ' + clk(d.t0) + ' → ' + clk(d.t1 || Date.now()), [['bad', nu(d.mist.length), R('hard')], ['warn', nu(d.stalls.length), R('stall')], ['dbt', nu(ds.length), R('doubt')], ['tj', nu(mk.length), R('tjDoubt')], ['neu', fmtT(d.t1 - d.t0), R('time')], ['neu', nu(s.wpm), R('wpm')]]) +
    section(R('secHard'), mistakeList(d.mist), 'bad', '⛔') + section(R('secStall'), stalls, 'warn', '⏸') + section(R('secDoubt'), soft && `<p class="pn">${esc(R('doubtNote'))}</p>` + soft, 'dbt', '❔') +
    section(R('secTj'), tj && `<p class="pn">${esc(R('tjNote'))}</p>` + tj, 'tj', '🎙') + section(R('secOk'), clean, 'ok', '✓') + (hkh ? section(R('secHk'), `<p class="pn">${esc(R('hkNote'))}</p><p class="pn">${esc(R('hkSelf'))}</p>` + hkh, 'hk', '☪') : '');
}
const SAVEBAR = () => `<div class="rsave"><button class="po on" data-rn="file">⬇ ${esc(R('saveFile'))}</button><button class="po" data-rn="share">📤 ${esc(R('share'))}</button><button class="po" data-rn="print">🖨 ${esc(R('print'))}</button><button class="po" data-rn="copy">📋 ${esc(R('copy'))}</button></div>`;
function showDaurReport(d) {
  VM = { fi: hz.fi, ti: hz.ti }; const last = hz.daur >= (hz.plan.reps || 1);
  $('#rrep').innerHTML = `<div class="rrin">${daurHtml(d)}<p class="rq">${esc(R('ask'))}</p>` +
    `<button class="po on" data-rn="${last ? 'final' : 'next'}">${esc(last ? R('noteFinal') : R('noteNext') + ' (' + (hz.daur + 1) + '/' + (hz.plan.reps || 1) + ')')}</button>` +
    `<button class="po" data-rn="again">${esc(R('again'))}</button><button class="po" data-rn="final">${esc(R('stopFinal'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; hz.busy = true;
}
function finalHtml(all, meta) {
  if (!DICT) dictBuild(); VM = { fi: meta.fi, ti: meta.ti }; const cnt = {}, st = {};
  all.forEach(d => { d.mist.forEach(m => { cnt[m.ai] = (cnt[m.ai] || 0) + 1; }); d.stalls.forEach(m => { st[m.ai] = (st[m.ai] || 0) + 1; }); });
  const rows = all.map(d => { const s = dStats(d); return `<div class="ri rrow"><b>${esc(R('daur'))} ${nu(d.n)}</b><span class="rtm">⏱ ${esc(clk(d.t0))} → ${esc(clk(d.t1))}</span><div class="rmini"><i class="pc" style="--p:${s.cleanPct}"></i><span>${nu(s.cleanPct)}%</span><span class="rk bad">${nu(d.mist.length)} ${esc(R('hard'))}</span><span class="rk warn">${nu(d.stalls.length)} ${esc(R('stall'))}</span><span class="rk dbt">${nu(d.soft.filter(x => x.kind !== 'makhraj').length)} ${esc(R('doubt'))}</span><span class="rk tj">${nu(d.soft.filter(x => x.kind === 'makhraj').length)}</span><small>${esc(fmtT(d.t1 - d.t0))} · ${nu(s.wpm)} ${esc(R('wpm'))}</small></div></div>`; }).join('');
  const rep = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${nu(cnt[i])} ${esc(R('times'))}${st[i] ? ' + ' + esc(R('atka')) + ' ' + nu(st[i]) : ''}</div>`).join('');
  const stl = Object.keys(st).filter(i => !cnt[i]).map(i => `<div class="ri"><b>${esc(ayRef(+i))}</b> — ${esc(R('atka'))} ${nu(st[i])} ${esc(R('times'))}</div>`).join('');
  const everClean = []; for (let i = meta.fi; i <= meta.ti; i++) if (!cnt[i] && !st[i]) everClean.push(i);
  const tot = all.reduce((a, d) => a + dStats(d).cleanPct, 0), avg = Math.round(tot / all.length);
  const allMist = all.flatMap(d => d.mist.map(m => Object.assign({ daur: d.n }, m)));
  const imp = allMist.map(m => `<div class="ri"><div class="rih"><b>${esc(R('daur'))} ${nu(m.daur)} · ${esc(ayRef(m.ai))}</b><span class="rk ${kindCls(m.kind)}">${esc(kindTxt(m.kind))}</span>${tmB(m)}</div><div class="rwd ar">${esc(wAr(SC[m.idx].s, SC[m.idx].a, SC[m.idx].w))}</div>${cmpBtns(m)}<small>${esc(impact(m))}</small></div>`).join('');
  const trend = all.length > 1 ? (() => { const a = dStats(all[0]).cleanPct, b = dStats(all[all.length - 1]).cleanPct; return `<p class="pn rtr">${esc(R('trend'))}: ${nu(a)}% → ${nu(b)}% ${b >= a ? '📈' : '📉'}</p>`; })() : '';
  const nS = all.reduce((a, d) => a + d.stalls.length, 0), nD = all.reduce((a, d) => a + d.soft.filter(x => x.kind !== 'makhraj').length, 0), nT = all.reduce((a, d) => a + d.soft.filter(x => x.kind === 'makhraj').length, 0), tm = all.reduce((a, d) => a + (d.t1 - d.t0), 0);
  const tjAll = all.flatMap(d => d.soft.filter(x => x.kind === 'makhraj').map(m => Object.assign({ daur: d.n }, m))).map(m => `<div class="ri"><div class="rih"><b>${esc(R('daur'))} ${nu(m.daur)} · ${esc(ayRef(m.ai))}</b>${tmB(m)}</div><div class="rwd ar">${esc(wAr(SC[m.idx].s, SC[m.idx].a, SC[m.idx].w))}</div><small class="hd">← ${esc(heardTxt(m))}${m.letters ? ' (' + esc(m.letters.join(' ، ')) + ')' : ''}</small>${cmpBtns(m)}</div>`).join('');
  const hkh = hkRows(flagSet(all), false);
  const t0 = all[0].t0;
  return hero(R('finalRep'), avg, dstr(t0) + ' · ' + ayRef(meta.fi) + ' → ' + ayRef(meta.ti), [['neu', nu(all.length), R('daurs')], ['bad', nu(allMist.length), R('hard')], ['warn', nu(nS), R('stall')], ['dbt', nu(nD), R('doubt')], ['tj', nu(nT), R('tjDoubt')], ['neu', fmtT(tm), R('time')]]) + trend +
    section(R('secPer'), rows, '', '🔁') + section(R('secRep'), rep + stl, 'bad', '⛔') + section(R('secImpact'), imp, 'bad', '📖') + section(R('secTj'), tjAll && `<p class="pn">${esc(R('tjNote'))}</p>` + tjAll, 'tj', '🎙') +
    section(R('secOkAll'), everClean.length ? `<div class="ri rcl">${everClean.map(i => `<span>${esc(ayRef(i))}</span>`).join('')}</div>` : '', 'ok', '✓') + (hkh ? section(R('secHk'), `<p class="pn">${esc(R('hkNote'))}</p><p class="pn">${esc(R('hkSelf'))}</p>` + hkh, 'hk', '☪') : '') + `<p class="pn">${esc(R('limits'))}</p>`;
}
const stripBtns = h => h.replace(/<button[\s\S]*?<\/button>/g, '').replace(/<span class="cmp"><\/span>/g, '');
function reportText(all, meta) {
  const tmp = document.createElement('div'); tmp.innerHTML = stripBtns(finalHtml(all, meta)).replace(/<\/(div|h5|p|small|h4)>/g, '\n$&').replace(/<br>/g, '\n'); return tmp.textContent.replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
}
const REPCSS = 'body{font-family:"Noto Nastaliq Urdu","Segoe UI",Arial,sans-serif;background:#fbf6e6;color:#1b1710;max-width:720px;margin:auto;padding:18px;line-height:1.7}h4{color:#7a1f2b;font-size:22px;margin:0}.rhero{display:flex;gap:14px;align-items:center}.rring{width:84px;height:84px;border-radius:50%;background:conic-gradient(#b9862b calc(var(--p)*1%),#e6dcc0 0);display:grid;place-items:center}.rring b{background:#fbf6e6;border-radius:50%;width:62px;height:62px;display:grid;place-items:center;font-size:18px}.rring small{display:none}.rchips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.rch{border:1px solid #c9b57a;border-radius:10px;padding:4px 10px;background:#fff8e1}.rch b{margin-inline-end:6px}.rs{margin:14px 0;padding:10px 12px;border-radius:12px;background:#fff;border-inline-start:5px solid #b9862b}.rs.bad{border-color:#a32a2a}.rs.warn{border-color:#e0a030}.rs.ok{border-color:#2f9e6a}.rs.tj{border-color:#1da7bb}.rs h5{margin:0 0 6px;font-size:16px;color:#7a1f2b}.ri{padding:6px 0;border-bottom:1px dashed #ddd}.rk{font-size:12px;border-radius:8px;padding:1px 8px;margin:0 6px;background:#eee}.rtm{font-size:12px;color:#777}.rwd{font-family:"Amiri",serif;font-size:22px}.pn,small{font-size:13px;color:#555}';
function reportDoc(all, meta) {
  return `<!doctype html><html lang="${A.st().ui === 'ur' ? 'ur' : 'en'}" dir="${A.st().ui === 'ur' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fahmul Quraan — ${esc(R('finalRep'))}</title><style>${REPCSS}</style></head><body>${stripBtns(finalHtml(all, meta))}<p class="pn">Fahmul Quraan · Quranic Science</p></body></html>`;
}
function reportAction(k) {
  const f = $('#rrep')._fin; if (!f) return; const nm = 'fahm-report-' + new Date(f.all[0].t0).toISOString().slice(0, 10);
  if (k === 'copy') { const t = reportText(f.all, f.meta); try { navigator.clipboard.writeText(t); A.toast('✓ ' + R('copy')); } catch (x) { A.toast(t.slice(0, 200)); } return; }
  if (k === 'print') { try { const fr = document.createElement('iframe'); fr.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0'; document.body.appendChild(fr); fr.srcdoc = reportDoc(f.all, f.meta); fr.onload = () => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (x) { } setTimeout(() => fr.remove(), 4000); }; } catch (x) { } return; }
  const html = reportDoc(f.all, f.meta), blob = new Blob([html], { type: 'text/html' }), file = (() => { try { return new File([blob], nm + '.html', { type: 'text/html' }); } catch (x) { return null; } })();
  if (k === 'share') { if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'Fahmul Quraan' }).catch(() => { }); return; } if (navigator.share) { navigator.share({ title: 'Fahmul Quraan', text: reportText(f.all, f.meta).slice(0, 6000) }).catch(() => { }); return; } reportAction('copy'); return; }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nm + '.html'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); A.toast('✓ ' + R('saveFile')); } catch (x) { reportAction('share'); }
}
function showFinal(all, meta, fromHist) {
  $('#rrep').innerHTML = `<div class="rrin">${finalHtml(all, meta)}${SAVEBAR()}` + (fromHist ? '' : `<button class="po on" data-rn="new">${esc(R('newPlan'))}</button>`) + `<button class="po" data-rn="close">${esc(R('close'))}</button></div>`;
  $('#rrep').hidden = false; $('#rrep').scrollTop = 0; $('#rrep')._fin = { all, meta };
}
/* ----- permanent log: every round and every mistake with its clock time -> day / week / month / year reports ----- */
const HLK = 'fahm.hlog';
function hlLoad() { try { const o = JSON.parse(localStorage.getItem(HLK) || 'null'); if (o && Array.isArray(o.r) && Array.isArray(o.e)) return o; } catch (e) { } return { r: [], e: [] }; }
function hlSave(o) { try { if (o.r.length > 3000) o.r = o.r.slice(-3000); if (o.e.length > 9000) o.e = o.e.slice(-9000); localStorage.setItem(HLK, JSON.stringify(o)); } catch (e) { } }
function logRound(d, meta) {
  if (!d || d._lg) return; d._lg = 1; const keep = VM; VM = { fi: meta.fi, ti: meta.ti }; const s = dStats(d); VM = keep; const lg = hlLoad(), y0 = AY[meta.fi], y1 = AY[meta.ti];
  if (lg.r.some(x => x.id === d.t0)) return;
  lg.r.push({ id: d.t0, at: d.t0, end: d.t1 || Date.now(), n: d.n, f: y0.s + ':' + y0.a, t: y1.s + ':' + y1.a, cp: s.cleanPct, h: d.mist.length, st: d.stalls.length, d: d.soft.filter(x => x.kind !== 'makhraj').length, tj: d.soft.filter(x => x.kind === 'makhraj').length, w: d.words, sec: Math.round(s.net / 1000), wpm: s.wpm });
  const ev = (list, k) => list.forEach(m => { const w = SC[m.idx]; if (!w) return; lg.e.push({ at: m.abs || d.t0 + (m.t || 0), r: d.t0, k: k || m.kind, s: w.s, a: w.a, w: w.w, h: heardTxt(m) }); });
  ev(d.mist); ev(d.stalls, 'stall'); ev(d.soft.filter(x => x.kind !== 'makhraj'), 'doubt'); ev(d.soft.filter(x => x.kind === 'makhraj'), 'makhraj'); hlSave(lg);
}
/* ----- "My progress": Day / Week / Month / Year ----- */
let STM = { m: 'week', o: 0 };
function periodRange(m, o) {
  const n = new Date(); let a, b;
  if (m === 'day') { a = new Date(n.getFullYear(), n.getMonth(), n.getDate() + o); b = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1); }
  else if (m === 'week') { const dow = (n.getDay() + 6) % 7; a = new Date(n.getFullYear(), n.getMonth(), n.getDate() - dow + 7 * o); b = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 7); }
  else if (m === 'month') { a = new Date(n.getFullYear(), n.getMonth() + o, 1); b = new Date(a.getFullYear(), a.getMonth() + 1, 1); }
  else { a = new Date(n.getFullYear() + o, 0, 1); b = new Date(a.getFullYear() + 1, 0, 1); }
  return [a.getTime(), b.getTime()];
}
function periodLabel(m, a, b) {
  try {
    if (m === 'day') return dstr(a); if (m === 'week') return dstr(a) + ' – ' + dstr(b - 1);
    if (m === 'month') return new Date(a).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); return String(new Date(a).getFullYear());
  } catch (e) { return ''; }
}
function bucketOf(m, a, t) { const d = new Date(t); if (m === 'day') return d.getHours(); if (m === 'week') return (d.getDay() + 6) % 7; if (m === 'month') return d.getDate() - 1; return d.getMonth(); }
function bucketN(m, a) { if (m === 'day') return 24; if (m === 'week') return 7; if (m === 'month') return new Date(new Date(a).getFullYear(), new Date(a).getMonth() + 1, 0).getDate(); return 12; }
function bucketLbl(m, a, i) { if (m === 'day') return i % 6 === 0 ? String(i) : ''; if (m === 'week') { try { return new Date(a + i * 864e5).toLocaleDateString(undefined, { weekday: 'narrow' }); } catch (e) { return ''; } } if (m === 'month') return (i + 1) % 5 === 0 || i === 0 ? String(i + 1) : ''; try { return new Date(new Date(a).getFullYear(), i, 1).toLocaleDateString(undefined, { month: 'narrow' }); } catch (e) { return ''; } }
function statsHtml() {
  const { m, o } = STM, [a, b] = periodRange(m, o), lg = hlLoad(), R0 = lg.r.filter(x => x.at >= a && x.at < b), E0 = lg.e.filter(x => x.at >= a && x.at < b);
  const nB = bucketN(m, a), bars = new Array(nB).fill(0), brd = new Array(nB).fill(0);
  E0.forEach(x => { if (x.k !== 'doubt' && x.k !== 'makhraj') bars[Math.min(nB - 1, bucketOf(m, a, x.at))]++; }); R0.forEach(x => { brd[Math.min(nB - 1, bucketOf(m, a, x.at))]++; });
  const mx = Math.max(1, ...bars), avg = R0.length ? Math.round(R0.reduce((s, x) => s + x.cp, 0) / R0.length) : 0, sum = k => R0.reduce((s, x) => s + (x[k] || 0), 0), mins = Math.round(sum('sec') / 60);
  const tab = (k, t) => `<button class="po sm ${m === k ? 'on' : ''}" data-sm="${k}">${esc(t)}</button>`;
  const chart = `<div class="hsbars">${bars.map((v, i) => `<div class="hsb"><i class="${brd[i] ? 'has' : ''}" style="height:${v ? Math.max(8, Math.round(v * 100 / mx)) : (brd[i] ? 4 : 0)}%" title="${v}"></i><u>${esc(bucketLbl(m, a, i))}</u></div>`).join('')}</div>`;
  const top = {}; E0.forEach(x => { if (x.k === 'doubt' || x.k === 'makhraj') return; const k = x.s + ':' + x.a; top[k] = (top[k] || 0) + 1; });
  const topH = Object.keys(top).sort((p, q) => top[q] - top[p]).slice(0, 8).map(k => { const [s, a2] = k.split(':').map(Number), ai = AYI[k]; return `<div class="ri"><b>${esc(surahName(s) + ' ' + nu(a2))}</b> — ${nu(top[k])} ${esc(R('times'))}${ai != null ? ` <button class="po sm" data-hq="${ai}">▶ ${esc(R('cQari'))}</button>` : ''}</div>`; }).join('');
  const evRow = x => `<div class="ri"><div class="rih"><span class="rtm">⏱ ${esc(clk2(x.at))}</span><b>${esc(surahName(x.s) + ' ' + nu(x.a))}</b><span class="rk ${kindCls(x.k)}">${esc(kindTxt(x.k))}</span></div><div class="rwd ar">${esc(wAr(x.s, x.a, x.w))}</div>${x.h ? `<small class="hd">← ${esc(x.h)}</small>` : ''}${AYI[x.s + ':' + x.a] != null ? ` <button class="po sm" data-hq="${AYI[x.s + ':' + x.a]}">▶ ${esc(R('cQari'))}</button>` : ''}</div>`;
  const days = {}; R0.slice().sort((p, q) => q.at - p.at).slice(0, 80).forEach(x => { const k = new Date(x.at).setHours(0, 0, 0, 0); (days[k] = days[k] || []).push(x); });
  const hkDays = {}; E0.filter(x => x.k === 'harakat').forEach(x => { (hkDays[x.day] = hkDays[x.day] || []).push(x); });
  const dk = [...new Set([...Object.keys(days), ...Object.keys(hkDays)])].map(Number).sort((p, q) => q - p);
  const line = dk.map(k => `<div class="sday"><h6>${esc(dstr(k))}</h6>` + (days[k] || []).map(r => { const evs = lg.e.filter(x => x.r === r.id).sort((p, q) => p.at - q.at);
    return `<details class="rd"><summary><span class="rtm">⏱ ${esc(clk(r.at))}</span> <b>${esc(R('daur'))} ${nu(r.n)}</b> · ${esc(surahName(+r.f.split(':')[0]) + ' ' + nu(+r.f.split(':')[1]))} → ${esc(surahName(+r.t.split(':')[0]) + ' ' + nu(+r.t.split(':')[1]))} · <b>${nu(r.cp)}%</b><span class="rk bad">${nu(r.h)}</span><span class="rk warn">${nu(r.st)}</span><span class="rk dbt">${nu(r.d)}</span><span class="rk tj">${nu(r.tj)}</span></summary>${evs.length ? evs.map(evRow).join('') : `<p class="pn">✓ ${esc(R('clean'))}</p>`}</details>`; }).join('') + (hkDays[k] ? `<details class="rd" open><summary>☪ ${esc(R('hkBad'))} · ${nu(hkDays[k].length)}</summary>${hkDays[k].map(evRow).join('')}</details>` : '') + '</div>').join('');
  const hist = (() => { let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (e) { } const nm = loc => { const [s, a2] = loc.split(':').map(Number); return surahName(s) + ' ' + nu(a2); };
    return h.length ? `<div class="rs"><h5><i>🗂</i>${esc(R('sReports'))}</h5>${h.map((x, i) => `<button class="po" data-hi="${i}">${esc(dstr(x.at))} ${esc(clk(x.at))} · ${esc(nm(x.names[0]))} → ${esc(nm(x.names[1]))} · ${nu(x.all.length)}×</button>`).join('')}</div>` : ''; })();
  return `<div class="rrin"><h4>📊 ${esc(R('sTitle'))}</h4><div class="rtabs">${tab('day', R('sDay'))}${tab('week', R('sWeek'))}${tab('month', R('sMonth'))}${tab('year', R('sYear'))}</div>` +
    `<div class="rnav"><button class="po sm" data-so="-1">‹</button><b>${esc(periodLabel(m, a, b))}</b><button class="po sm" data-so="1" ${o >= 0 ? 'disabled' : ''}>›</button></div>` +
    (R0.length ? `<div class="rchips">${[['neu', nu(R0.length), R('sRounds')], ['ok', nu(avg) + '%', R('avgClean')], ['bad', nu(sum('h')), R('hard')], ['warn', nu(sum('st')), R('stall')], ['dbt', nu(sum('d')), R('doubt')], ['tj', nu(sum('tj')), R('tjDoubt')], ['neu', (mins || '<1'), R('sMin')]].map(c => `<span class="rch ${c[0]}"><b>${c[1]}</b><small>${esc(c[2])}</small></span>`).join('')}</div>${chart}` + section(R('sTop'), topH, 'bad', '⛔') + section(R('sTimeline'), line, '', '🕒') : `<p class="pn">${esc(R('sNone'))}</p>${line ? section(R('sTimeline'), line, '', '🕒') : ''}`) + hist +
    `<button class="po" data-rn="close">${esc(R('close'))}</button></div>`;
}
function showStats() { const r = $('#rrep'), t = r.scrollTop; r.innerHTML = statsHtml(); r.hidden = false; r._fin = null; r.scrollTop = r._st === 1 ? t : 0; r._st = 1; }
function popHist() { popClose(); STM = { m: STM.m, o: 0 }; $('#rrep')._st = 0; showStats(); }
function hzFinishAll(partial) {
  hz.busy = true;
  const meta = { fi: hz.fi, ti: hz.ti, ps: hz.plan }; const all = hz.all.slice();
  if (partial && hz.cur && hz.cur.words >= 3 && !all.includes(hz.cur)) { hz.cur.t1 = Date.now(); hz.cur.reach = hz.tr ? SC[Math.min(hz.tr.p, SC.length - 1)].ai : hz.ti; all.push(hz.cur); }
  hzStop(); if (!all.length) return; try { all.forEach(d => logRound(d, meta)); } catch (e) { }
  try {
    const wk = weakGet(), cn = {}, now = Date.now(); const hiR = all.reduce((m, d) => Math.max(m, d.reach != null ? d.reach : meta.ti), meta.fi);
    all.forEach(d => { d.mist.forEach(m => { cn[m.ai] = (cn[m.ai] || 0) + 1; }); d.stalls.forEach(m => { cn[m.ai] = (cn[m.ai] || 0) + 1; }); (d.hints || []).forEach(i => { cn[i] = (cn[i] || 0) + 1; }); });
    for (let i = meta.fi; i <= Math.min(meta.ti, hiR); i++) {
      const k = AY[i].s + ':' + AY[i].a;
      if (cn[i]) { const o = wk[k] || { n: 0, ok: 0 }; o.n += cn[i]; o.ok = 0; o.t = now; wk[k] = o; }
      else if (wk[k]) { wk[k].ok = (wk[k].ok || 0) + all.length; if (wk[k].ok >= 3) delete wk[k]; }
    }
    weakSet(wk);
  } catch (e) { }
  try { const h =JSON.parse(localStorage.getItem('fahm.hist') || '[]'); h.unshift({ at: Date.now(), meta, all: all.map(d => Object.assign({}, d)), lay, names: [AY[meta.fi].s + ':' + AY[meta.fi].a, AY[meta.ti].s + ':' + AY[meta.ti].a] }); localStorage.setItem('fahm.hist', JSON.stringify(h.slice(0, 60))); } catch (e) { }
  showFinal(all, meta, false); try { A.toast('✓ ' + R('savedApp'), 3200); } catch (e) { }
}
function hzRepAction(act) {
  if (act === 'next') { hz.daur++; $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'again') { hz.all.pop(); $('#rrep').hidden = true; hzBeginDaur(hz.fi); }
  else if (act === 'final') { $('#rrep').hidden = true; hzFinishAll(); }
}
function weakGet() { try { const o = JSON.parse(localStorage.getItem('fahm.weak') || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
function weakSet(o) { try { localStorage.setItem('fahm.weak', JSON.stringify(o)); } catch (e) { } }
function popWeak() {
  const wk = weakGet(), ur = A.st().ui === 'ur', keys = Object.keys(wk).filter(k => AYI[k] != null).sort((a, b) => (wk[b].n || 0) - (wk[a].n || 0));
  $('#rpop').dataset.pk = 'weak';
  $('#rpop').innerHTML = `<h4>${esc(R('weak'))}${keys.length ? ' · ' + (ur ? ad(keys.length) : keys.length) : ''}</h4><p class="pn">${esc(R('weakNote'))}</p>` +
    (keys.length ? keys.map(k => { const ai = AYI[k], y = AY[ai], n = wk[k].n || 1;
      return `<div class="ri"><b>${esc(ayRef(ai))}</b> · ${ur ? ad(n) : n} ${esc(R('weakN'))}<br><button class="po sm" data-wq="${ai}">▶ ${esc(R('cQari'))}</button><button class="po sm" data-wgo="${ai}">${esc(R('weakGo'))}</button><button class="po sm" data-wpg="${ai}">${esc(R('weakPage'))}</button><button class="po sm" data-wok="${esc(k)}">✓ ${esc(R('weakOk'))}</button></div>`; }).join('') +
      `<button class="po on" data-wall="1">${esc(R('weakAll'))}</button><button class="po sm" data-wclr="1">${esc(R('weakClr'))}</button>` : `<p class="pn">${esc(R('weakEmpty'))}</p>`);
  $('#rpop').hidden = false;
}
/* ---------- UI ---------- */
function popClose() { $('#rpop').hidden = true; $('#rpop').dataset.pk = ''; }
/* ---------- bookmarks (page ribbon + list) ---------- */
function bmLoad() { try { const a = JSON.parse(localStorage.getItem('fahm.bm') || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function bmSave(a) { try { localStorage.setItem('fahm.bm', JSON.stringify(a)); } catch (e) { } }
function bmPage(b) { const ai = AYI[b.s + ':' + b.a]; return ai == null ? -2 : pageOfAi(ai); }
function bmHere() { return pi >= 0 ? bmLoad().filter(b => bmPage(b) === pi) : []; }
function bmFirstAy() { const x = SC.find(y => LP[y.loc] === pi); return x ? AY[x.ai] : null; }
function bmUpd() { const p = $('#rpage'); if (!p) return; let r = $('#rbmk'); const on = pi >= 0 && bmHere().length > 0; if (!r) { r = document.createElement('div'); r.id = 'rbmk'; r.innerHTML = '<svg viewBox="0 0 24 36" aria-hidden="true"><path d="M2 0h20v34l-10-8-10 8z" fill="#c8323e" stroke="#f1dca0" stroke-width="1.4"/></svg>'; p.appendChild(r); } r.hidden = !on; const b = $('#rBm'); if (b) b.classList.toggle('on', on); }
function popBm() {
  const st = A.st(), ur = st.ui === 'ur', nn = v => ur ? ad(v) : v, L = bmLoad(), here = pi >= 0 && bmHere().length > 0;
  const rows = L.map((b, i) => `<div class="bmr"><button class="po" data-bmgo="${i}">${esc(surahName(b.s))} · ${esc(R('bmP'))} ${nn(bmPage(b) >= 0 ? PG[bmPage(b)] : '')} · ${nn(b.a)}</button><button class="po sm" data-bmx="${i}" aria-label="Delete">✕</button></div>`).join('');
  $('#rpop').dataset.pk = 'b';
  $('#rpop').innerHTML = `<h4>🔖 ${esc(R('bmT'))}</h4>` + (pi >= 0 ? `<button class="po ${here ? 'on' : ''}" data-bmadd="1">${esc(here ? R('bmDel') : R('bmAdd'))}</button>` : '') + (rows || `<div class="pr"><span>${esc(R('bmNone'))}</span></div>`);
  $('#rpop').hidden = false;
}
function popLayout() {
  const st = A.st(), light = document.body.classList.contains('light'); const row = (k, t, on) => `<button class="po ${on ? 'on' : ''}" data-lay="${k}">${esc(t)}</button>`;
  const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-rk="${k}" data-rv="${v}">${esc(t)}</button>`;
  const recs = (window.FAHM_RECS || []).map(r => `<option value="${esc(r[0])}" ${r[0] === rec() ? 'selected' : ''}>${esc(st.ui === 'ur' ? r[2] : r[1])}</option>`).join('');
  $('#rpop').innerHTML = `<h4>${esc(R('layout'))}</h4>` + ['15', '13q', '13t'].map(k => row(k, R('lay' + k), lay === k)).join('') +
    `<div class="pr"><span>${esc(R('spL'))}</span>${sw('rsp', 'auto', R('spA'), !st.rsp || st.rsp === 'auto')}${sw('rsp', 'on', R('spOn'), st.rsp === 'on')}${sw('rsp', 'off', R('spOff'), st.rsp === 'off')}</div>` +
    `<div class="pr"><span>${esc(R('trL'))}</span>${sw('rtr', 'on', R('on'), st.rtr === 'on')}${sw('rtr', 'off', R('off'), st.rtr !== 'on')}</div>` + (st.rtr === 'on' ? `<div class="pr"><span>${esc(R('trW'))}</span><select id="rTrc" class="sel">${trOpts()}</select></div>` : '') + `<div class="pr"><span>${esc(R('trV'))}</span>${sw('trw', 'on', R('on'), st.trw !== false)}${sw('trw', 'off', R('off'), st.trw === false)}</div>` + `<div class="pr"><small>${esc(R('trN'))}</small></div>` +
    `<div class="pr"><span>${esc(R('dmL'))}</span>${sw('rflip', 'curl', R('dmC'), (st.rflip || 'curl') === 'curl')}${sw('rflip', 'slide', R('dmS'), st.rflip === 'slide')}${sw('rflip', 'off', R('dmI'), st.rflip === 'off')}</div>` +
    `<div class="pr"><span>${esc(R('thL'))}</span>${sw('rtheme', 'dark', R('thD'), !light)}${sw('rtheme', 'light', R('thLt'), light)}</div>` +
    `<div class="pr"><span>${esc(R('qrL'))}</span><select id="rQ" class="sel">${recs}</select></div>` +
    `<div class="pr"><span>${esc(R('hlL'))}</span>${sw('rhl', 'on', R('on'), (st.rhl || 'on') === 'on')}${sw('rhl', 'off', R('off'), st.rhl === 'off')}</div>` +
        `<div class="pr"><span>${esc(R('bgL'))}</span>${sw('rbg', 'on', R('on'), (st.rbg || 'on') === 'on')}${sw('rbg', 'off', R('off'), st.rbg === 'off')}</div><div class="pr"><small>${esc(R('bgN'))}</small></div>` +
    `<button class="po" data-rgopen="1">▶ ${esc(R('rgT'))}</button>`;
  $('#rpop').hidden = false;
}
function applyHl() { const p = $('#rpage'); if (p) p.classList.toggle('nohl', A.st().rhl === 'off'); }
function bgSync(p) { try { if (window.FahmAndroid && FahmAndroid.bg) FahmAndroid.bg(!!p && (A.st().rbg || 'on') === 'on'); } catch (e) { } }
function mediaSess() {
  try {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return; const y = curAy;
    navigator.mediaSession.metadata = new MediaMetadata({ title: y ? surahName(y.s) + ' · ' + y.a : 'Fahmul Quraan', artist: recName(rec()), album: 'Fahmul Quraan by Quranic Science', artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }] });
    navigator.mediaSession.setActionHandler('pause', () => pausePlay()); navigator.mediaSession.setActionHandler('play', () => { const b = $('#rPlay'); if (b) b.click(); });
  } catch (e) { }
}
function popRange() {
  const st = A.st(), ur = st.ui === 'ur', cur0 = curAy && AYI[curAy.s + ':' + curAy.a] != null ? AY[AYI[curAy.s + ':' + curAy.a]] : AY[0];
  let e0 = cur0; for (let i = AYI[cur0.s + ':' + cur0.a]; i < AY.length && AY[i].s === cur0.s; i++) e0 = AY[i];
  const sO = sel => surahsInScope().map(x => `<option value="${x}" ${x === sel ? 'selected' : ''}>${ur ? ad(x) : x}. ${esc(surahName(x))}</option>`).join('');
  const aO = (x, sel) => AY.filter(y => y.s === x).map(y => `<option value="${y.a}" ${y.a === sel ? 'selected' : ''}>${ur ? ad(y.a) : y.a}</option>`).join('');
  const reps = st.rgrep || 1, sw = (v) => `<button class="po sm ${reps === v ? 'on' : ''}" data-rgrep="${v}">${ur ? ad(v) : v}</button>`;
  $('#rpop').dataset.pk = 'rg';
  $('#rpop').innerHTML = `<h4>${esc(R('rgT'))}</h4><p class="pn">${esc(R('rgH'))}</p>` +
    `<div class="sec">${esc(R('rgS'))}</div><div class="pr"><select id="rgS1" class="sel">${sO(cur0.s)}</select><select id="rgA1" class="sel">${aO(cur0.s, cur0.a)}</select></div>` +
    `<div class="sec">${esc(R('rgE'))}</div><div class="pr"><select id="rgS2" class="sel">${sO(e0.s)}</select><select id="rgA2" class="sel">${aO(e0.s, e0.a)}</select></div>` +
    `<div class="pr"><span>${esc(R('rgRep'))}</span>${[1, 2, 3, 5, 10].map(sw).join('')}</div>` +
    `<div class="rowx"><button class="po" data-rgno="1">${esc(R('rgNo'))}</button><button class="po on" data-rggo="1">▶ ${esc(R('rgGo'))}</button></div>`;
  $('#rpop').hidden = false;
}
function popHafiz() {
  const st = A.st(); const sw = (k, v, t, on) => `<button class="po sm ${on ? 'on' : ''}" data-hk="${k}" data-hv="${v}">${esc(t)}</button>`;
  $('#rpop').innerHTML = `<h4>${esc(R('hafiz'))}</h4><div class="pr"><span>${esc(R('sens'))}</span>${sw('hs', 'h', R('sH'), (st.hs || 'h') === 'h')}${sw('hs', 'n', R('sN'), st.hs === 'n')}${sw('hs', 's', R('sS'), st.hs === 's')}</div>` +
    `<div class="pr"><span>${esc(R('sil'))}</span>${[3.5, 4, 5].map(v => sw('hsil', v, v + ' ' + R('sec'), (st.hsil || 4) === v)).join('')}</div>` +
    `<div class="pr"><span></span>${sw('hmode', 'look', R('look'), (st.hmode || 'look') === 'look')}${sw('hmode', 'mem', R('mem'), st.hmode === 'mem')}</div>` +
    `<div class="pr"><span>${esc(R('flowL'))}</span>${sw('hflow', 'flow', R('flowOn'), (st.hflow || 'flow') === 'flow')}${sw('hflow', 'ustad', R('flowOff'), st.hflow === 'ustad')}</div>` +
    `<div class="pr"><span>${esc(R('forkL'))}</span>${sw('hfork', 'on', R('forkOn'), (st.hfork || 'on') === 'on')}${sw('hfork', 'off', R('off'), st.hfork === 'off')}</div>` +
    `<div class="pr"><span>${esc(R('tickL'))}</span>${sw('htick', 'on', R('on'), st.htick === 'on')}${sw('htick', 'off', R('off'), (st.htick || 'off') === 'off')}</div>` +
    `<div class="pr"><span>${esc(R('recL'))}</span>${sw('hrec', 'on', R('on'), st.hrec === 'on')}${sw('hrec', 'off', R('off'), (st.hrec || 'off') === 'off')}</div><div class="pr"><span>${esc(R('corL'))}</span>${sw('hcor', 'qari', R('corQ'), (st.hcor || 'qari') === 'qari')}${sw('hcor', 'mine', R('corM'), st.hcor === 'mine')}</div><p class="pn">${esc(R('corN'))}</p><div class="pr"><span>${esc(R('wrL'))}</span>${[['all', 'wrAll'], ['ur', 'wrUr'], ['en', 'wrEn'], ['ar', 'wrAr'], ['off', 'wrOff']].map(([v, k]) => sw('hwarn', v, R(k), (st.hwarn || 'all') === v)).join('')}</div><div class="sec">${esc(R('fastL'))}</div><div class="chips">${sw('hfast', 'on', R('on'), fastOn())}${sw('hfast', 'off', R('off'), !fastOn())}</div>` +
    (fastOn() ? `<div class="chips">${FASTQ.map(f => sw('hfq', f, recName(f), (st.hfq || FASTQ[0]) === f)).join('')}</div><div class="pr"><span>${esc(R('rateL'))}</span>${[1, 1.25, 1.5].map(v => sw('hrate', v, v + '×', fastRate() === v)).join('')}</div><p class="pn">${esc(R('fastNote'))}</p>` : '') +
    `<p class="pn">${esc(R('info'))}</p>`;
  $('#rpop').hidden = false;
}
function applyZoom(d) { const st = A.st(); st.rz = Math.max(1, Math.min(1.8, Math.round(((st.rz || 1) + d) * 100) / 100)); A.save(); sizePage(); fit(); centerStage(); }
function centerStage() { const g = $('#rstage'); if (g) g.scrollLeft = Math.max(0, (g.scrollWidth - g.clientWidth) / 2); }
function openAt(s, a) {
  return load().then(() => {
    lay = A.st().lay || '15'; if (!M.L[lay]) lay = '15'; buildIndex();
    let i = 0; const f = LP[locOf(s, a, 1)]; if (f !== undefined) i = f; else { const w = SC.find(x => x.s === s); if (w) i = LP[w.loc]; }
    if (s === 1 && a === 1 && i === 0) i = -1;   /* the very first page of the book is its cover */
    pi = i; open = true; $('#reader').hidden = false; document.body.classList.add('noscroll'); $('#rhz').hidden = true; hz.on = false; applyRot();
    renderPage(false); if (AYI[s + ':' + a] != null) curAy = { s, a };
    requestAnimationFrame(() => { sizePage(); fit(); resShow(); });
  });
}
function applyRot() { sizePage(); }
function close() { try { const c0 = curAy || A.st().rlast; if (c0) { A.st().rcur = { s: c0.s, a: c0.a }; A.save(); } } catch (e) { } hzStop(); resHide(); stopAudio(); open = false; $('#reader').hidden = true; popClose(); A.onClose(); }
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
  if (hot !== pick.loc) { const o = hot && q(hot); if (o) o.classList.remove('hot'); hot = pick.loc; ensureLoc(pick.loc); const e = q(pick.loc); if (e) { e.classList.add('hot', 'cur'); if (!hz.on) trk(e); } }
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
  $('#rTheme').onclick = () => { const tb = document.getElementById('btnTheme'); if (tb) tb.click(); setTimeout(() => { try { renderPage(false); } catch (e) { } }, 120); };
  $('#rBm').onclick = () => { if (!$('#rpop').hidden && $('#rpop').dataset.pk === 'b') popClose(); else popBm(); };
  $('#rLay').onclick = () => { if ($('#rpop').hidden || !$('#rpop').dataset.pk || $('#rpop').dataset.pk !== 'l') { $('#rpop').dataset.pk = 'l'; popLayout(); } else popClose(); };
  $('#rMinus').onclick = () => applyZoom(-0.15); $('#rPlus').onclick = () => applyZoom(0.15);
  $('#rPrev').onclick = () => stepPage(-1); $('#rNext').onclick = () => stepPage(1);
  $('#rPlay').onclick = () => {
    if (hz.on) { hzStop(); return; }
    if (playing) { pausePlay(); return; }
    const st = curAy ? AYI[curAy.s + ':' + curAy.a] : null; let ai = st != null ? st : 0;
    if (st == null) { const w = SC.find(x => LP[x.loc] === pi); if (w) ai = w.ai; }
    const rt = takeResume(ai); playSeq(ai, rt > 0, rt);
  };
  $('#rMic').onclick = () => { if (hz.on) { hzStopAsk(); return; } if ($('#rpop').dataset.pk === 's' && !$('#rpop').hidden) popClose(); else popSetup(); };
  $('#rhHold').onclick = () => { hzStop(); };
  $('#rhHint').onclick = () => { if (!hz.on || hz.busy || !hz.tr || hz.tr.done()) return; const w = SC[hz.tr.p]; if (!w) return; const e = q(w.loc); if (!e) return; e.classList.add('rev'); hz.lastAct = Date.now() + 2500; (hz.cur.hints = hz.cur.hints || []).push(w.ai); setTimeout(() => e.classList.remove('rev'), 2600); };
  $('#rhStop').onclick = hzStopAsk; $('#rhSet').onclick = () => { if ($('#rpop').hidden || $('#rpop').dataset.pk !== 'h') { $('#rpop').dataset.pk = 'h'; popHafiz(); } else popClose(); };
  $('#rhMode').onclick = () => { const st = A.st(); st.hmode = st.hmode === 'mem' ? 'look' : 'mem'; A.save(); $('#rpage').classList.toggle('mem', st.hmode === 'mem'); $('#rhMode').textContent = R(st.hmode); };
  $('#rrep').addEventListener('click', e => {
    const q1 = e.target.closest('[data-hq]'); if (q1) { playQari(+q1.dataset.hq); return; }
    const m1 = e.target.closest('[data-hm]'); if (m1) { playMine(+m1.dataset.hm); return; }
    const hkm = e.target.closest('[data-hkm]'); if (hkm) { const k0 = hkm.dataset.hkk, v0 = hkm.dataset.hkm, on = HKM[k0] === v0; hkMark(k0, on ? '' : v0); const row = hkm.parentNode; row.querySelectorAll('.hkb').forEach(x => x.classList.toggle('on', !on && x.dataset.hkm === v0)); return; }
    const sm = e.target.closest('[data-sm]'); if (sm) { STM = { m: sm.dataset.sm, o: 0 }; showStats(); return; }
    const so = e.target.closest('[data-so]'); if (so) { if (!so.disabled) { STM.o = Math.min(0, STM.o + +so.dataset.so); showStats(); } return; }
    const hi2 = e.target.closest('[data-hi]'); if (hi2) { let h = []; try { h = JSON.parse(localStorage.getItem('fahm.hist') || '[]'); } catch (x) { } const x = h[+hi2.dataset.hi]; if (x) { if (x.lay && x.lay !== lay) relayout(x.lay); showFinal(x.all, x.meta, true); } return; }
    const b = e.target.closest('[data-rn]'); if (!b) return; const k = b.dataset.rn;
    if (k === 'copy' || k === 'file' || k === 'share' || k === 'print') { reportAction(k); return; }
    if (k === 'close') { $('#rrep').hidden = true; return; }
    if (k === 'new') { $('#rrep').hidden = true; popSetup(); return; }
    hzRepAction(k);
  });
  $('#rpop').addEventListener('click', e => {
    const l = e.target.closest('[data-lay]'); if (l) { relayout(l.dataset.lay); popClose(); return; }
    const hk = e.target.closest('[data-hk]');
    if (hk && hk.dataset.hk === 'mreps') { A.st().mreps = +hk.dataset.hv; A.save(); popMyList(); return; }
    if (hk && hk.dataset.hk === 'reps') { const pl = Object.assign({}, planDefault()); pl.reps = +hk.dataset.hv; A.st().hplan = pl; A.save(); popSetup(); return; }
    if (hk) { const st = A.st(), k = hk.dataset.hk; st[k] = (k === 'hsil' || k === 'hrate') ? +hk.dataset.hv : hk.dataset.hv; A.save(); if (hz.tr && k === 'hs') hz.tr.sens = st.hs; if (k === 'hfork') forkMark(); if (k === 'hmode') $('#rpage').classList.toggle('mem', st.hmode === 'mem'); popHafiz(); if (hz.on) $('#rhMode').textContent = R(st.hmode || 'look'); return; }
    if (e.target.closest('[data-hset]')) { $('#rpop').dataset.pk = 'h'; popHafiz(); return; }
    if (e.target.closest('[data-hist]')) { popHist(); return; }
    if (e.target.closest('[data-weak]')) { popWeak(); return; }
    const wq = e.target.closest('[data-wq]'); if (wq) { playQari(+wq.dataset.wq); return; }
    const wg = e.target.closest('[data-wgo]'); if (wg) { const ai = +wg.dataset.wgo, y = AY[ai], pl = Object.assign({}, planDefault()); let ti = AYI[pl.ts + ':' + pl.ta]; if (ti == null || ti < ai) { ti = ai; while (ti + 1 < AY.length && AY[ti + 1].s === y.s && ti - ai < 14) ti++; } const z = AY[ti]; hzStart(ai, { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1 }); return; }
    const wp = e.target.closest('[data-wpg]'); if (wp) { const ai = +wp.dataset.wpg, y = AY[ai]; popClose(); goPage(pageOfAi(ai)); curAy = { s: y.s, a: y.a }; return; }
    const wo = e.target.closest('[data-wok]'); if (wo) { const o = weakGet(); delete o[wo.dataset.wok]; weakSet(o); popWeak(); return; }
    if (e.target.closest('[data-wclr]')) { weakSet({}); popWeak(); return; }
    if (e.target.closest('[data-wall]')) { const o = weakGet(), q = Object.keys(o).filter(k => AYI[k] != null).map(k => AYI[k]).sort((a, b) => a - b); if (!q.length) return; popClose(); stopCmp(); stopAudio(); cau = cau || new Audio(); let qi = 0; const nx = () => { if (qi >= q.length || !open) return; const ai = q[qi++], y = AY[ai]; goPage(pageOfAi(ai)); cau.onended = () => setTimeout(nx, 500); cau.src = errUrl(y.s, y.a); setRate(cau, fastRate()); const pr = cau.play(); if (pr && pr.catch) pr.catch(() => { }); }; nx(); return; }
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
    if (e.target.closest('[data-hres]')) { if (snapGet()) { hzResumeSnap(); return; } const st = A.st(), la = st.hlast, pl = Object.assign({}, planDefault()); const fi = AYI[la.s + ':' + la.a]; let ti = AYI[pl.ts + ':' + pl.ta]; if (ti < fi) { let j = fi; while (j + 1 < AY.length && AY[j + 1].s === la.s) j++; ti = j; } const y = AY[fi], z = AY[ti]; hzStart(fi, { fs: y.s, fa: y.a, ts: z.s, ta: z.a, reps: pl.reps || 1 }); return; }
    if (e.target.closest('[data-hgo]')) { hzStart(null, readPlan2()); return; }
    if (e.target.closest('[data-rgopen]')) { popRange(); return; }
    const rkb = e.target.closest('[data-rk]'); if (rkb) { const st = A.st(), k2 = rkb.dataset.rk, v2 = rkb.dataset.rv; if (k2 === 'rtheme') { const tb = document.getElementById('btnTheme'); if (tb && (v2 === 'light') !== document.body.classList.contains('light')) tb.click(); setTimeout(popLayout, 150); return; } st[k2] = k2 === 'trw' ? v2 === 'on' : v2; A.save(); if (k2 === 'trw') { popLayout(); return; } if (k2 === 'rhl') applyHl(); if (k2 === 'rsp') { renderPage(false); } if (k2 === 'rtr') { renderPage(false); popLayout(); } if (k2 === 'rbg' && v2 === 'off') bgSync(false); else if (k2 === 'rbg' && playing) bgSync(true); popLayout(); return; }
    if (e.target.closest('[data-bmadd]')) { let L = bmLoad(); if (bmHere().length) L = L.filter(b => bmPage(b) !== pi); else { const y = bmFirstAy(); if (y) L.push({ s: y.s, a: y.a, t: Date.now() }); } bmSave(L); bmUpd(); popBm(); return; }
    const bg = e.target.closest('[data-bmgo]'); if (bg) { const b = bmLoad()[+bg.dataset.bmgo]; if (b) { popClose(); goPage(bmPage(b)); } return; }
    const bx = e.target.closest('[data-bmx]'); if (bx) { const L = bmLoad(); L.splice(+bx.dataset.bmx, 1); bmSave(L); bmUpd(); popBm(); return; }
    if (e.target.closest('[data-rgno]')) { popClose(); return; }
    const rr = e.target.closest('[data-rgrep]'); if (rr) { A.st().rgrep = +rr.dataset.rgrep; A.save(); [...document.querySelectorAll('#rpop [data-rgrep]')].forEach(b => b.classList.toggle('on', b === rr)); return; }
    if (e.target.closest('[data-rggo]')) {
      let f = AYI[$('#rgS1').value + ':' + $('#rgA1').value], t = AYI[$('#rgS2').value + ':' + $('#rgA2').value]; if (f == null || t == null) return; if (t < f) { const x = f; f = t; t = x; }
      popClose(); if (hz.on) hzStop(); const pa = pageOfAi(f); if (pa !== pi) goPage(pa, false); playRange(f, t, A.st().rgrep || 1); return;
    }
  });
  $('#rpop').addEventListener('change', e => {
    const id0 = e.target.id;
    if (id0 === 'rQ') { A.st().rec = $('#rQ').value; A.save(); A.toast(recName(A.st().rec)); return; }
    if (id0 === 'rTrc') { A.st().rtrc = $('#rTrc').value; A.save(); renderPage(false); return; }
    if (id0 === 'rkJ' || id0 === 'rkF' || id0 === 'rkT') { const j = +$('#rkJ').value, n = rukuList(j).length; let f = id0 === 'rkJ' ? 1 : +$('#rkF').value, t = id0 === 'rkJ' ? n : +$('#rkT').value; if (id0 === 'rkF' && t < f) t = f; if (id0 === 'rkT' && t < f) f = t; applyRuku(j, f, t); popSetup(); return; }
    if (id0 === 'tJ') { if (e.target.value) { const j = +e.target.value, pl = Object.assign({}, planDefault()), a = juzStartAi(j); pl.fs = AY[a].s; pl.fa = AY[a].a; const z = AY[pl.amt ? endForAmt(a, pl.amt) : juzRange(j)[1]]; pl.ts = z.s; pl.ta = z.a; A.st().hplan = pl; A.save(); popSetup(); } return; }
    if (id0 === 'rgS1' || id0 === 'rgS2') { const s0 = +e.target.value, sel = $(id0 === 'rgS1' ? '#rgA1' : '#rgA2'); sel.innerHTML = AY.filter(y => y.s === s0).map(y => `<option value="${y.a}">${A.st().ui === 'ur' ? ad(y.a) : y.a}</option>`).join(''); if (id0 === 'rgS2') sel.selectedIndex = sel.options.length - 1; return; }
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
  lpInit();
  $('#rstage').addEventListener('click', e => {
    if (!e.target.closest('#rin')) return;
    const rbx = e.target.closest('.rb'); if (rbx) { const [lb, no] = rbx.dataset.rb.split('|'), ur = A.st().ui === 'ur', nm = { 'جزء': ['پارے کا آغاز', 'Para ka aaghaz', 'Start of a Juz'], 'حزب': ['حزب کا آغاز', 'Hizb ka aaghaz', 'Start of a Hizb'], 'ربع': ['ربع الحزب (چوتھائی)', 'Rub-ul-Hizb (chauthaai)', 'Quarter of the Hizb'], 'نصف': ['نصف الحزب (آدھا)', 'Nisf-ul-Hizb (aadha)', 'Half of the Hizb'], 'ثلثة': ['ثلاثة أرباع الحزب (تین چوتھائی)', 'Salaasatu arbaa (teen chauthaai)', 'Three quarters of the Hizb'] }[lb], ix = ur ? 0 : (A.st().ui === 'ru' ? 1 : 2), q = +no - 1, hz2 = Math.floor(q / 4) + 1, jz2 = Math.floor(q / 8) + 1; A.toast(nm[ix] + ' · ' + (ix === 0 ? 'حزب ' : ix === 1 ? 'Hizb ' : 'Hizb ') + (ur ? ad(hz2) : hz2) + ' · ' + (ix === 0 ? 'پارہ ' : 'Juz ') + (ur ? ad(jz2) : jz2), 4200); return; }
    { const bn = e.target.closest('.ml.h[data-sn]'); if (bn && !hz.on) { popClose(); const ai0 = AYI[bn.dataset.sn + ':1']; if (ai0 != null) { stopAudio(); playSeq(ai0); } return; } }
    popClose(); const w = e.target.closest('.wd'); if (!w) return; const [s, a] = w.dataset.loc.split(':').map(Number); const ai = AYI[s + ':' + a]; if (ai == null) return;
    if (hz.on) { if (!hz.busy && ai >= hz.fi && ai <= hz.ti) { hz.tr.setPos(AY[ai].first); clearAyahMarks(ai); markNext(); savePos(ai); hz.lastAct = Date.now() + 1500; hzStatus('listen'); } return; }
    stopAudio(); playSeq(ai);
  });
  /* swipe + keys: RTL book — finger moving right = next page */
  let sx = null, sy = 0; const stg = $('#rstage');
  stg.addEventListener('touchstart', e => { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } else sx = null; }, { passive: true });
  stg.addEventListener('touchend', e => { if (sx == null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && (A.st().rz || 1) <= 1.01) stepPage(dx > 0 ? 1 : -1); }, { passive: true });
  document.addEventListener('keydown', e => { if (!open) return; if (e.key === 'ArrowLeft') stepPage(1); else if (e.key === 'ArrowRight') stepPage(-1); else if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (open) { if (wantSpread() !== spread) renderPage(false); else relayout(); } });
  window.addEventListener('orientationchange', () => { if (open) setTimeout(() => { if (wantSpread() !== spread) renderPage(false); else reflow(); }, 250); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && hz.on) hzStop(); });
  window.addEventListener('pagehide', () => { if (hz.on && hz.tr && !hz.finished) { try { const w = SC[Math.min(hz.tr.p, SC.length - 1)]; if (w) snapSave(w.ai, true); } catch (e) { } } });
}
window.FahmReader = {
  init, isOpen: () => open,
  open: (s, a) => openAt(s || 1, a || 1),
  /* open at an ayah and mark it (search results) */
  hafizRange: (s0, a0, s1, a1) => { openAt(s0, a0); setTimeout(() => { try { const f = AYI[s0 + ':' + a0], t = AYI[s1 + ':' + a1]; if (f != null && t != null) hzStart(f, { fs: s0, fa: a0, ts: s1, ta: a1, reps: 1 }); } catch (e) { } }, 900); },
  openHl: (s, a) => { openAt(s, a); const mark = () => { document.querySelectorAll('#rpage .wd.srhl').forEach(e => e.classList.remove('srhl')); qa(s, a).forEach(e => e.classList.add('srhl')); const f = qa(s, a)[0]; if (f) { try { f.scrollIntoView({ block: 'center' }); } catch (er) { } } }; [300, 900, 1800].forEach(t => setTimeout(mark, t)); setCur(s, a); },
  gotoSurah: s => { if (!open) return; stopAudio(); if (hz.on) hzStop(); const w = SC.find(x => x.s === s); if (w) { goPage(LP[w.loc]); } },
  back: () => { if (!$('#rpop').hidden) { popClose(); return true; } close(); return true; },
  /* test hooks */
  _RS: () => RS, _rep: d => showDaurReport(d || hz.cur), _hz: () => hz, _plan: () => hz.plan, _sc: () => SC, _heard: onHeard, _page: () => pi, _show: n => { pi = n; renderPage(false); }, _n: () => PG.length
};
})();

/* tap the translation strip of the full-screen animation to expand / collapse it */
document.addEventListener('click', e => { const c = e.target.closest && e.target.closest('#story.big #cx'); if (c) c.closest('#story').classList.toggle('open'); });

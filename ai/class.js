/* ================= Learn with Quranic Science AI — the full 1-hour class =================
   Every day's lesson is taught as a complete class (about 60 minutes), the way a qari sahab teaches:
   1 opening dua · 2 revision of yesterday · 3 today's lesson + takrar · 4 Noorani Qaida takhti (3 rounds)
   5 listening game · 6 record your reading · 7 three questions + homework.
   All Arabic audio is real qari word-by-word / ayah recitation (or the lesson's own native voice). */
const CX = {
  cls: { en: "Today's class", ur: "آج کی کلاس", hi: "आज की क्लास" },
  mins: { en: "min", ur: "منٹ", hi: "मिनट" },
  ph: {
    open: { en: "Opening dua", ur: "شروع کی دعا", hi: "शुरू की दुआ" },
    rev: { en: "Revision of yesterday", ur: "کل کے سبق کی دہرائی", hi: "कल के सबक़ की दोहराई" },
    learn: { en: "Today's lesson", ur: "آج کا سبق", hi: "आज का सबक़" },
    qaida: { en: "Noorani Qaida practice", ur: "نورانی قاعدہ کی مشق", hi: "नूरानी क़ायदा की मश्क़" },
    read: { en: "Reading practice", ur: "پڑھنے کی مشق", hi: "पढ़ने की मश्क़" },
    game: { en: "Listen & choose", ur: "سنیں اور پہچانیں", hi: "सुनें और पहचानें" },
    record: { en: "Record your reading", ur: "اپنی تلاوت ریکارڈ کریں", hi: "अपनी तिलावत रिकॉर्ड करें" },
    quiz: { en: "3 questions", ur: "تین سوال", hi: "तीन सवाल" } },
  start: { en: "Start the class", ur: "کلاس شروع کریں", hi: "क्लास शुरू करें" },
  next: { en: "Next part", ur: "اگلا حصہ", hi: "अगला हिस्सा" },
  wait: { en: "Keep practising", ur: "مشق جاری رکھیں", hi: "मश्क़ जारी रखें" },
  doFirst: { en: "Finish this part's practice first", ur: "پہلے اس حصے کی مشق مکمل کریں", hi: "पहले इस हिस्से की मश्क़ पूरी करें" },
  agenda: { en: "Your teacher will take you through these parts. Take your time — a real class is about one hour.", ur: "آپ کے استاد آپ کو یہ سب حصے کروائیں گے۔ آرام سے کریں — ایک پوری کلاس تقریباً ایک گھنٹے کی ہوتی ہے۔", hi: "आपके उस्ताद आपको ये सब हिस्से करवाएँगे। आराम से करें — एक पूरी क्लास तक़रीबन एक घंटे की होती है।" },
  duaT: { en: "Begin with Bismillah and this dua from the Qur'an: \"My Lord, increase me in knowledge\" (Ta-Ha 20:114). Listen, then say it with the qari.", ur: "بسم اللہ اور قرآن کی اس دعا سے شروع کریں: \"اے میرے رب، میرے علم میں اضافہ فرما\" (طٰہٰ ۲۰:۱۱۴)۔ سنیں، پھر قاری کے ساتھ پڑھیں۔", hi: "बिस्मिल्लाह और क़ुरआन की इस दुआ से शुरू करें: \"ऐ मेरे रब, मेरे इल्म में इज़ाफ़ा फ़रमा\" (ताहा 20:114)। सुनें, फिर क़ारी के साथ पढ़ें।" },
  r1: { en: "Round 1 · Listen, then repeat", ur: "پہلا دور · سنیں، پھر دہرائیں", hi: "पहला दौर · सुनें, फिर दोहराएँ" },
  r2: { en: "Round 2 · Read together with the qari", ur: "دوسرا دور · قاری کے ساتھ پڑھیں", hi: "दूसरा दौर · क़ारी के साथ पढ़ें" },
  r3: { en: "Round 3 · Read alone, then check with the qari", ur: "تیسرا دور · خود پڑھیں، پھر قاری سے ملائیں", hi: "तीसरा दौर · ख़ुद पढ़ें, फिर क़ारी से मिलाएँ" },
  you: { en: "Now you say it", ur: "اب آپ پڑھیں", hi: "अब आप पढ़ें" },
  youFirst: { en: "Read it yourself first…", ur: "پہلے خود پڑھیں…", hi: "पहले ख़ुद पढ़ें…" },
  stop: { en: "Pause", ur: "روکیں", hi: "रोकें" },
  tapHint: { en: "Tap any box to hear it again. Repeat aloud every time.", ur: "کسی بھی خانے کو چھوئیں اور دوبارہ سنیں۔ ہر بار بلند آواز سے دہرائیں۔", hi: "किसी भी ख़ाने को छुएँ और दोबारा सुनें। हर बार बुलंद आवाज़ से दोहराएँ।" },
  allRounds: { en: "All 3 rounds done — mashaAllah!", ur: "تینوں دور مکمل — ماشاءاللہ!", hi: "तीनों दौर पूरे — माशाअल्लाह!" },
  again: { en: "Do another round", ur: "ایک دور اور کریں", hi: "एक दौर और करें" },
  revNone: { en: "This is your first lesson, so there is nothing to revise yet. Warm up with the letters in the Makharij Lab, then continue.", ur: "یہ آپ کا پہلا سبق ہے، اس لیے ابھی دہرائی نہیں ہے۔ مخارج لیب میں حروف سے تیاری کریں، پھر آگے بڑھیں۔", hi: "यह आपका पहला सबक़ है, इसलिए अभी दोहराई नहीं है। मख़ारिज लैब में हुरूफ़ से तैयारी करें, फिर आगे बढ़ें।" },
  revP: { en: "Read yesterday's words again with the qari. Revision makes the lesson stay.", ur: "کل کے الفاظ قاری کے ساتھ دوبارہ پڑھیں۔ دہرائی سے سبق پکا ہوتا ہے۔", hi: "कल के अल्फ़ाज़ क़ारी के साथ दोबारा पढ़ें। दोहराई से सबक़ पक्का होता है।" },
  learnDrill: { en: "Now repeat today's Arabic again and again until it flows.", ur: "اب آج کی عربی بار بار دہرائیں، یہاں تک کہ روانی آ جائے۔", hi: "अब आज की अरबी बार-बार दोहराएँ, यहाँ तक कि रवानी आ जाए।" },
  qaidaP: { en: "Read today's takhti like in a madrasa: every box with the qari, three rounds. These are real words of the Qur'an.", ur: "آج کی تختی مدرسے کی طرح پڑھیں: ہر خانہ قاری کے ساتھ، تین دور۔ یہ قرآن کے اصل الفاظ ہیں۔", hi: "आज की तख़्ती मदरसे की तरह पढ़ें: हर ख़ाना क़ारी के साथ, तीन दौर। ये क़ुरआन के असल अल्फ़ाज़ हैं।" },
  gameP: { en: "Listen to the qari and tap the word you heard.", ur: "قاری کو سنیں اور جو لفظ سنا اسے چھوئیں۔", hi: "क़ारी को सुनें और जो लफ़्ज़ सुना उसे छुएँ।" },
  play: { en: "Play", ur: "سنیں", hi: "सुनें" },
  right: { en: "Right!", ur: "درست!", hi: "सही!" }, wrong: { en: "Not this one — listen again", ur: "یہ نہیں — دوبارہ سنیں", hi: "यह नहीं — दोबारा सुनें" },
  recP: { en: "Read these aloud and record yourself. Then play your voice and the qari one after the other and find the difference.", ur: "انہیں بلند آواز سے پڑھیں اور ریکارڈ کریں۔ پھر اپنی آواز اور قاری کی آواز باری باری سنیں اور فرق پہچانیں۔", hi: "इन्हें बुलंद आवाज़ से पढ़ें और रिकॉर्ड करें। फिर अपनी आवाज़ और क़ारी की आवाज़ बारी-बारी सुनें और फ़र्क़ पहचानें।" },
  chk: { en: "Practise more in the Tajweed Coach", ur: "ٹجوید کوچ میں مزید مشق کریں", hi: "तजवीद कोच में और मश्क़ करें" },
  lis: { en: "Listening… read now. It stops by itself when you are quiet.", ur: "سن رہا ہوں… اب پڑھیں۔ آپ کے خاموش ہوتے ہی رک جائے گا۔", hi: "सुन रहा हूँ… अब पढ़िए। आपके ख़ामोश होते ही रुक जाएगा।" },
  chking: { en: "AI Ustad is listening to your recording…", ur: "AI استاد آپ کی ریکارڈنگ سن رہا ہے…", hi: "AI उस्ताद आपकी रिकॉर्डिंग सुन रहा है…" },
  noSp: { en: "I could not hear any recitation. Come closer to the phone and try again.", ur: "مجھے کوئی تلاوت سنائی نہیں دی۔ فون کے قریب آ کر دوبارہ کوشش کریں۔", hi: "मुझे कोई तिलावत सुनाई नहीं दी। फ़ोन के क़रीब आकर दोबारा कोशिश कीजिए।" },
  aiNo: { en: "The AI could not check right now (internet?). Please try again.", ur: "AI ابھی چیک نہیں کر سکا (انٹرنیٹ؟)۔ دوبارہ کوشش کریں۔", hi: "AI अभी चेक नहीं कर सका (इंटरनेट?)। दोबारा कोशिश कीजिए।" },
  recAgain: { en: "Record again", ur: "دوبارہ ریکارڈ کریں", hi: "दोबारा रिकॉर्ड करें" },
  recB: { en: "Record my reading", ur: "میری تلاوت ریکارڈ کریں", hi: "मेरी तिलावत रिकॉर्ड करें" },
  mine: { en: "My voice", ur: "میری آواز", hi: "मेरी आवाज़" }, qari: { en: "Qari", ur: "قاری", hi: "क़ारी" },
  took: { en: "Class time", ur: "کلاس کا وقت", hi: "क्लास का वक़्त" },
  fromL: { en: "{n} → word", ur: "{n} سے لفظ", hi: "{n} से लफ़्ज़" },
  letterOf: { en: "as in", ur: "مثال", hi: "मिसाल" },
  kinds: {
    letters: { en: "Takhti 1 · The letters (huroof mufradat)", ur: "تختی ۱ · حروفِ مفردات", hi: "तख़्ती 1 · हुरूफ़-ए-मुफ़रदात" },
    harakat: { en: "Takhti · Harakat: zabar, zer, pesh", ur: "تختی · حرکات: زبر، زیر، پیش", hi: "तख़्ती · हरकात: ज़बर, ज़ेर, पेश" },
    tanween: { en: "Takhti · Tanween: do zabar, do zer, do pesh", ur: "تختی · تنوین: دو زبر، دو زیر، دو پیش", hi: "तख़्ती · तनवीन: दो ज़बर, दो ज़ेर, दो पेश" },
    khari: { en: "Takhti · Standing zabar, zer and ulta pesh", ur: "تختی · کھڑا زبر، کھڑا زیر، الٹا پیش", hi: "तख़्ती · खड़ा ज़बर, खड़ा ज़ेर, उल्टा पेश" },
    madd: { en: "Takhti · Huroof-e-madd (long vowels)", ur: "تختی · حروفِ مدہ", hi: "तख़्ती · हुरूफ़-ए-मद्दा" },
    leen: { en: "Takhti · Huroof-e-leen", ur: "تختی · حروفِ لین", hi: "तख़्ती · हुरूफ़-ए-लीन" },
    sukoon: { en: "Takhti · Sukoon / jazm", ur: "تختی · سکون / جزم", hi: "तख़्ती · सुकून / जज़्म" },
    tashdeed: { en: "Takhti · Tashdeed (shadda)", ur: "تختی · تشدید", hi: "तख़्ती · तशदीद" },
    tashdeed2: { en: "Takhti · Tashdeed with sukoon and madd", ur: "تختی · تشدید، سکون اور مد ساتھ", hi: "तख़्ती · तशदीद, सुकून और मद साथ" },
    muqattaat: { en: "Takhti · Huroof-e-muqatta'at", ur: "تختی · حروفِ مقطعات", hi: "तख़्ती · हुरूफ़-ए-मुक़त्तआत" },
    mixed: { en: "Takhti · Mixed words (all rules together)", ur: "تختی · ملے جلے الفاظ (سب قاعدے)", hi: "तख़्ती · मिले-जुले अल्फ़ाज़ (सब क़ायदे)" },
    ayat: { en: "Reading whole ayahs with the qari", ur: "قاری کے ساتھ پوری آیات پڑھنا", hi: "क़ारी के साथ पूरी आयतें पढ़ना" } }
};
const CL = { on: false, id: null, ph: 0, phases: [], t0: 0, pt0: 0, done: {}, tick: null, qd: null, prev: null };
const owner = () => { try { return isOwner(S.user); } catch (e) { return false; } };
const mmss = s => { s = Math.max(0, Math.round(s)); return num(Math.floor(s / 60)) + ":" + num(String(s % 60).padStart(2, "0")); };

async function qaidaDay(id) {
  if (!S.qaida) S.qaida = await fetch("data/qaida.json?v=" + (window.QAIDA_V || 1)).then(r => r.json()).catch(() => ({ days: {}, letters: [] }));
  return S.qaida.days[id.slice(2)] || null;
}
/* the Arabic of a lesson (tokens that have real audio) → drill items */
function lessonItems(data, max) {
  const out = [], seen = new Set();
  for (const m of (data && data.moments) || []) {
    for (const [tok, s, a, w] of m.wq || []) if (!seen.has(tok)) { seen.add(tok); out.push({ ar: tok, src: [{ s, a, w }] }); }
    for (const [tok, k] of Object.entries(m.aw || {})) if (!seen.has(tok) && tok.length < 40) { seen.add(tok); out.push({ ar: tok, src: [{ k }] }); }
    if (m.q && !m.wq && !m.aw) for (const q of [].concat(m.q)) if (q.s && q.a && !seen.has(q.s + ":" + q.a)) { seen.add(q.s + ":" + q.a); }
  }
  return out.slice(0, max || 40);
}
function qaidaItems(qd) {
  if (!qd) return [];
  if (qd.k === "letters") return qd.items.map(x => { const nm = LETNAME[x.L] ? [{ k: LETNAME[x.L] }] : [], exs = [{ s: x.x.s, a: x.x.a, w: x.x.w }];
    return { ip: 1, L: x.L, ar: x.L, sub: pick(x.n), nm, ex: x.x.t, exs, src: nm.concat(exs) }; });
  if (qd.k === "ayat") return qd.items.map(x => ({ ip: 1, ar: x.t, ay: 1, src: [{ s: x.ay[0], a: x.ay[1] }], sub: num(x.ay[0]) + ":" + num(x.ay[1]) }));
  return qd.items.map(x => ({ ip: 1, ar: x.t, src: [{ s: x.s, a: x.a, w: x.w }] }));
}
/* one smooth recitation (same engine as everywhere else); resolves with the seconds it took */
async function playSrc(list) {
  const t0 = performance.now(); await playQari(list, null, true); return (performance.now() - t0) / 1000;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- class plan ---------- */
async function startClass(id) {
  const { c, o, meta } = LESSON;
  const flat = o.weeks.flatMap(w => w.days), k = flat.findIndex(d => d.id === id);
  CL.prev = null; if (k > 0) try { CL.prev = await lessonData(flat[k - 1].id); } catch (e) {}
  CL.qd = await qaidaDay(id);
  const qk = c === "tajweed" ? "qaida" : "read";
  const P = [["open", 2]];
  if (CL.prev) P.push(["rev", 8]);
  P.push(["learn", 15], [qk, CL.prev ? 18 : 26], ["game", 6], ["record", 6], ["quiz", 5]);
  if (!CL.qd) P.splice(P.findIndex(p => p[0] === qk), 1);
  Object.assign(CL, { on: true, id, ph: 0, phases: P, t0: Date.now(), pt0: Date.now(), done: {}, late: lateMin(c, o, id) });
  try { const sv = JSON.parse(sessionStorage.getItem("qsai-cls-" + id) || "null"); if (sv && Date.now() - sv.t0 < 5 * 3600e3) Object.assign(CL, { ph: sv.ph, t0: sv.t0, pt0: Date.now(), done: sv.done || {}, late: sv.late != null ? sv.late : CL.late }); } catch (e) {}
  clearInterval(CL.tick); CL.tick = setInterval(clockTick, 1000); document.body.classList.add("incls");
  drawPhase();
}
const saveCL = () => { try { sessionStorage.setItem("qsai-cls-" + CL.id, JSON.stringify({ ph: CL.ph, t0: CL.t0, done: CL.done, late: CL.late })); } catch (e) {} };
const curK = () => CL.phases[CL.ph] && CL.phases[CL.ph][0];
function classBar() {
  if (!CL.on) return "";
  const tot = CL.phases.reduce((a, p) => a + p[1], 0);
  return `<div class="clsbar"><div class="clstop"><b>📖 ${pick(CX.cls)}</b><span class="clk" id="clk">⏱ ${mmss((Date.now() - CL.t0) / 1000)} / ${num(tot)}:${num("00")}</span></div>
    <ol class="clsph">${CL.phases.map((p, i) => `<li class="${i < CL.ph ? "ok" : i === CL.ph ? "on" : ""}"><i>${i < CL.ph ? "✓" : num(i + 1)}</i><span>${pick(CX.ph[p[0]])}</span></li>`).join("")}</ol></div>`;
}
function minLeft() { const p = CL.phases[CL.ph]; if (!p || owner()) return 0; return Math.max(0, p[1] * 60 * 0.7 - (Date.now() - CL.pt0) / 1000); }
function clockTick() {
  if (!CL.on || !document.getElementById("clk")) return;
  const tot = CL.phases.reduce((a, p) => a + p[1], 0);
  $("#clk").textContent = `⏱ ${mmss((Date.now() - CL.t0) / 1000)} / ${num(tot)}:${num("00")}`;
  updNext();
}
function updNext() {
  const b = $("#clsNx"); if (!b) return;
  const k = curK(), left = minLeft(), ok = !!CL.done[k] || owner();
  b.disabled = !(ok && left <= 0);
  b.innerHTML = ok && left <= 0 ? `${pick(CX.next)} →` : !ok ? `🔒 ${pick(CX.doFirst)}` : `⏳ ${pick(CX.wait)} · ${mmss(left)}`;
}
function nextPhase() {
  stopAll(); CL.ph++; CL.pt0 = Date.now(); saveCL();
  scrollTo({ top: 0, behavior: "smooth" }); drawPhase();
}
const navNext = () => `<div class="nav clsnav"><span></span><button class="btn pri big" id="clsNx" disabled>…</button></div>`;
function wireNext() { const b = $("#clsNx"); if (b) { b.onclick = () => { if (!b.disabled) nextPhase(); }; updNext(); } }
const ustBar = () => `<div class="vo uteach" id="vo"><div class="uface" id="uface"></div><div class="uinfo"><b>🎓 ${t("ustad")}</b><div class="uline"><span class="eq"><i></i><i></i><i></i></span><button class="btn sm" id="rv">↻ ${t("replay")}</button></div></div></div>`;
/* every class screen: lesson head, the visible Ustad (when the screen has a narrated intro), the content, the next button */
function shell(inner, intro) {
  LESSON.tour = LESSON.tourOff = null; CL.gid = (CL.gid || 0) + 1; CL.intro = intro || null;
  $("#app").innerHTML = lessonHead() + (intro ? ustBar() : "") + inner + navNext();
  if (intro && window.QSUstad && $("#uface")) QSUstad.mount($("#uface"));
  if ($("#rv")) $("#rv").onclick = () => narr(CL.intro, true);
  $("#vt") && ($("#vt").onclick = () => { S.voice = !S.voice; LS.set("qsai-voice", S.voice); if (!S.voice) stopAll(); else if (CL.intro) narr(CL.intro); $("#vt").textContent = S.voice ? "🔊 " + t("voiceOn") : "🔇 " + t("voiceOff"); });
  wireNext();
}

function drawPhase() {
  const k = curK();
  if (!k) return;
  if (k === "open") return phOpen();
  if (k === "rev") return phDrill("rev");
  if (k === "learn") { if (CL.done.learnM) return phDrill("learn"); LESSON.i = 0; return drawMoment(); }
  if (k === "qaida" || k === "read") return phDrill(k);
  if (k === "game") return phGame();
  if (k === "record") return phRecord();
  if (k === "quiz") return drawQuiz(0, []);
}
/* hook from drawMoment: after the last moment of today's lesson the class continues with its takrar */
function afterMoments() { CL.done.learnM = 1; saveCL(); phDrill("learn"); }

function phOpen() {
  const dua = [{ s: 20, a: 114, w: 15 }, { s: 20, a: 114, w: 16 }, { s: 20, a: 114, w: 17 }];
  shell(`<section class="stage"><h3 class="clsh">🤲 ${pick(CX.ph.open)}</h3><p class="say">${pick(CX.duaT)}</p>
    <div class="bigar ip">بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِيۡمِ</div><button class="btn cy big" id="d1">🔊 ${pick(CX.play)} · بسم الله</button>
    <div class="bigar ip">رَّبِّ زِدۡنِيۡ عِلۡمًا</div><button class="btn cy big" id="d2">🔊 ${pick(CX.play)} · رَبِّ زِدۡنِيۡ عِلۡمًا</button>
    <h3 class="clsh">🗓️ ${pick(CX.cls)}</h3><p class="mini">${pick(CX.agenda)}</p>
    <ol class="agenda">${CL.phases.map(p => `<li><span>${pick(CX.ph[p[0]])}</span><b>~${num(p[1])} ${pick(CX.mins)}</b></li>`).join("")}</ol></section>`, "p_open");
  const gid = CL.gid, alive = () => gid === CL.gid && curK() === "open", d1 = $("#d1"), d2 = $("#d2");
  let run = 0;   /* ONE token for both buttons: starting one of them stops the other (Bismillah and the dua never play on top of each other) */
  const idle = () => { d1.classList.remove("playing"); d2.classList.remove("playing"); };
  d1.onclick = async () => { const my = ++run; idle(); d1.classList.add("playing"); await playSrc([{ s: 1, a: 1 }]); if (my === run) d1.classList.remove("playing"); };
  d2.onclick = async () => {
    const my = ++run; idle(); d2.classList.add("playing");
    for (let r = 0; r < 3; r++) { if (my !== run || !alive()) return; await playSrc(dua); if (my !== run || !alive()) return; if (r < 2) await sleep(2600); }
    if (my !== run || !alive()) return; d2.classList.remove("playing"); CL.done.open = 1; saveCL(); updNext(); if (S.voice) narr("p_open2");
  };
  setTimeout(() => { CL.done.open = 1; updNext(); }, 30000);
  /* with the voice on, the Ustad guides it: greeting, then Bismillah, then the dua three times, then what comes next */
  if (S.voice) (async () => {
    const my = ++run; if (!(await narr("p_open")) || !alive() || my !== run) return;
    d1.classList.add("playing"); await playSrc([{ s: 1, a: 1 }]); if (my !== run || !alive()) return; d1.classList.remove("playing");
    await sleep(700); if (my !== run || !alive()) return; d2.click();
  })();
}

/* ---------- takrar drill (3 rounds), used for revision, lesson practice and the qaida takhti ---------- */
function phDrill(k) {
  let items, title, note, kindT = "";
  if (k === "rev") { items = lessonItems(CL.prev, 14); title = CX.ph.rev; note = CX.revP; }
  else if (k === "learn") { items = lessonItems(LESSON.data, 24); title = CX.ph.learn; note = CX.learnDrill; }
  else { items = qaidaItems(CL.qd); title = CX.ph[k]; note = CX.qaidaP; kindT = CL.qd ? pick(CX.kinds[CL.qd.k] || {}) : ""; }
  if (k !== "learn" && k !== "rev" && LESSON.c === "arabic") items = items.slice(0, 14);
  if (!items.length) { CL.done[k] = 1; saveCL(); return k === "rev" ? phRevNone() : nextPhase(); }
  const ay = items.some(x => x.ay), intro = k === "rev" ? "p_rev" : k === "learn" ? "p_learn" : "p_qaida", kindKey = k !== "rev" && k !== "learn" && CL.qd ? "k_" + CL.qd.k : null;
  shell(`<section class="stage"><h3 class="clsh">${k === "rev" ? "🔁" : k === "learn" ? "📘" : "📜"} ${pick(title)}</h3>${kindT ? `<p class="kindt">${esc(kindT)}</p>` : ""}<p class="say">${pick(note)}</p>
    <div class="tkctl"><button class="btn pri big" id="tkGo">▶ <span id="tkR">${pick(CX.r1)}</span></button><button class="btn big" id="tkStop" hidden>⏸ ${pick(CX.stop)}</button></div>
    <p class="tkst" id="tkst">${pick(CX.tapHint)}</p>
    <div class="tkg ${ay ? "ayg" : ""}">${items.map((x, i) => x.L
      ? `<div class="tkw"><button class="tki" data-i="${i}"><span class="ar ip">${esc(x.ar)}</span><small>${esc(x.sub)}</small><i class="tkd"><b></b><b></b><b></b></i></button><button class="tkx" data-i="${i}" aria-label="${esc(x.sub)}"><small>${pick(CX.fromL).replace("{n}", esc(x.sub))}</small><span class="ar ip">${esc(x.ex)}</span><i>🔊</i></button></div>`
      : `<button class="tki" data-i="${i}"><span class="ar ${x.ip ? "ip" : ""}">${esc(x.ar)}</span>${x.sub ? `<small>${esc(x.sub)}</small>` : ""}${x.ex ? `<small class="ar ip ex">${pick(CX.letterOf)} ${esc(x.ex)}</small>` : ""}<i class="tkd"><b></b><b></b><b></b></i></button>`).join("")}</div>
    <div class="labslot" id="labslot"></div></section>`, intro);
  const gid = CL.gid, alive = () => gid === CL.gid && curK() === k;
  const zs = new Set(); items.forEach(x => [...bare(x.ar)].forEach(ch => LAB_Z[ch] && zs.add(LAB_Z[ch])));
  const LBD = labMount($("#labslot"), zs.size ? zs : null), lettersOf = t => [...new Set([...bare(t)].filter(ch => LAB_Z[ch]))].slice(0, 6);
  const tiles = $$(".tki"), cnt = items.map(() => 0);
  const mark = i => { cnt[i]++; const d = $$(".tkd b", tiles[i]); d.forEach((b, j) => b.classList.toggle("on", j < cnt[i])); if (cnt.every(n => n >= 2) && !CL.done[k]) { CL.done[k] = 1; saveCL(); updNext(); } };
  let run = false, round = 0, auto = false;
  tiles.forEach((b, i) => b.onclick = async () => { if (run) return; tiles.forEach(x => x.classList.remove("cur")); b.classList.add("cur"); const it = items[i];
    if (it.L) { if (LBD && LAB_Z[it.L]) await LBD.say(it.L, null, null, it.nm); else await playSrc(it.nm); }   /* letter box: the letter's own name, with the 3D head showing where it comes from */
    else { LBD && LBD.tour(lettersOf(it.ar), 900); await playSrc(it.src); LBD && LBD.stop(); }
    mark(i); b.classList.remove("cur"); });
  $$(".tkx").forEach(b => b.onclick = async () => { if (run) return; const it = items[+b.dataset.i]; b.classList.add("cur"); LBD && LBD.tour(lettersOf(it.ex), 900); await playSrc(it.exs); LBD && LBD.stop(); b.classList.remove("cur"); });
  const st = $("#tkst"), go = $("#tkGo"), stp = $("#tkStop"), lbl = [CX.r1, CX.r2, CX.r3], RK = ["p_r1", "p_r2", "p_r3"];
  stp.onclick = () => { run = false; auto = false; stopAll(); if (S.voice) narr("p_tap"); };
  /* one round: the Ustad names the round, then every box is played; "now you say it" is spoken once at the first box */
  async function doRound() {
    run = true; go.hidden = true; stp.hidden = false;
    if (S.voice && alive()) { await narr(RK[round]); if (!run || !alive()) return false; }
    for (let i = 0; i < items.length && run && alive(); i++) {
      const b = tiles[i]; tiles.forEach(x => x.classList.remove("cur", "you")); b.classList.add("cur");
      b.scrollIntoView({ block: "nearest", behavior: "smooth" });
      if (round === 2) { b.classList.add("you"); st.textContent = "🗣️ " + pick(CX.youFirst); if (i === 0 && S.voice) await narr("p_youFirst"); await sleep(ay ? 7000 : 3200); if (!run) break; b.classList.remove("you"); }
      st.textContent = "🔊 " + pick(CX.qari) + " …"; if (LBD) { const L1 = items[i].L ? [items[i].L] : lettersOf(items[i].ar); if (L1.length) LBD.tour(L1, items[i].L ? 1500 : 900); }
      const dur = await playSrc(items[i].src); if (!run) break;
      if (round === 0) { b.classList.add("you"); st.textContent = "🗣️ " + pick(CX.you); if (i === 0 && S.voice) await narr("p_you"); await sleep(Math.max(1600, dur * 1300 + 900)); b.classList.remove("you"); }
      else await sleep(round === 1 ? 700 : 1200);
      mark(i);
    }
    if (!alive()) return false;
    tiles.forEach(x => x.classList.remove("cur", "you")); stp.hidden = true; go.hidden = false;
    if (!run) { st.textContent = pick(CX.tapHint); return false; }
    run = false; round++;
    if (round >= 3) { CL.done[k] = 1; saveCL(); updNext(); st.textContent = "🌟 " + pick(CX.allRounds); round = 0; $("#tkR").textContent = pick(CX.again); if (S.voice) narr("p_allRounds"); }
    else { $("#tkR").textContent = pick(lbl[round]); st.textContent = pick(CX.tapHint); }
    return true;
  }
  go.onclick = () => { auto = false; doRound(); };
  /* with the voice on, the Ustad guides the whole practice by himself: what this part is, which takhti it is, then round 1, 2 and 3 */
  if (S.voice) (async () => {
    if (!(await narr(intro)) || !alive()) return;
    if (kindKey && (!(await narr(kindKey)) || !alive())) return;
    auto = true;
    for (let n = 0; n < 3 && auto && alive(); n++) { if (!(await doRound())) break; }
  })();
}
function phRevNone() {
  shell(`<section class="stage"><h3 class="clsh">🔁 ${pick(CX.ph.rev)}</h3><p class="say">${pick(CX.revNone)}</p><p><a class="btn cy big" href="#lab" target="_blank">🗣️ Makharij Lab</a></p></section>`, "p_revNone");
  if (S.voice) narr("p_revNone");
}

/* ---------- listening game ---------- */
function phGame() {
  const pool = [...qaidaItems(CL.qd), ...lessonItems(LESSON.data, 30)].filter(x => !x.ay && x.ar.length < 30);
  const uniq = []; const seen = new Set(); for (const x of pool) if (!seen.has(x.ar)) { seen.add(x.ar); uniq.push(x); }
  if (uniq.length < 4) { CL.done.game = 1; return nextPhase(); }
  const N = Math.min(10, uniq.length); let r = 0, ok = 0, introDone = false;
  const order = uniq.slice().sort(() => Math.random() - .5).slice(0, N);
  const draw = () => {
    if (r >= N) { CL.done.game = 1; saveCL();
      shell(`<section class="stage res"><div style="font-size:42px">${ok >= N * .8 ? "🌟" : "👍"}</div><h3>${pick(CX.ph.game)}</h3><div class="big">${num(ok)}/${num(N)}</div><p><button class="btn big" id="ga">🔁 ${pick(CX.again)}</button></p></section>`, "p_gameEnd");
      $("#ga").onclick = () => { CL.done.game = 0; r = 0; ok = 0; introDone = true; phGame(); }; if (S.voice) narr("p_gameEnd"); return; }
    const ans = order[r], opts = [ans, ...uniq.filter(x => x !== ans).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
    shell(`<section class="stage"><h3 class="clsh">👂 ${pick(CX.ph.game)} · ${num(r + 1)}/${num(N)}</h3><p class="say">${pick(CX.gameP)}</p>
      <p style="text-align:center"><button class="btn cy big round" id="gp">🔊 ${pick(CX.play)}</button></p>
      <div class="gopts">${opts.map((x, i) => `<button class="gopt" data-i="${i}"><span class="ar ${x.ip ? "ip" : ""}">${esc(x.ar)}</span></button>`).join("")}</div><p class="tkst" id="gs"></p></section>`, "p_game");
    const gid = CL.gid, alive = () => gid === CL.gid && curK() === "game";
    const play = () => playSrc(ans.src); $("#gp").onclick = play;
    if (S.voice && r === 0 && !introDone) { introDone = true; narr("p_game").then(v => { if (v && alive()) play(); }); } else play();
    let tries = 0, lock = false;
    $$(".gopt").forEach(b => b.onclick = async () => {
      if (lock) return; lock = true;   /* while the Ustad is answering, further taps wait */
      const x = opts[+b.dataset.i];
      if (x === ans) { b.classList.add("ok"); if (!tries) ok++; $("#gs").textContent = "✓ " + pick(CX.right); if (S.voice) await narr("p_right"); else await sleep(900); if (!alive()) return; r++; draw(); }
      else { tries++; b.classList.add("no"); $("#gs").textContent = "✗ " + pick(CX.wrong); if (S.voice) await narr("p_wrong"); else await sleep(400); if (!alive()) return; lock = false; play(); }
    });
  };
  draw();
}

/* ---------- record & check: the AI Ustad listens to the recording, finds every mistake and tells it by voice ---------- */
function phRecord() {
  let items = qaidaItems(CL.qd); if (!items.length) items = lessonItems(LESSON.data, 6);
  items = items.map(x => x.L ? { ip: 1, ar: x.ex, src: x.exs } : x).filter(x => x.ar && x.ar.length < 140);
  const dd = new Set(); items = items.filter(x => !dd.has(x.ar) && dd.add(x.ar)).slice(0, items[0] && items[0].ay ? 3 : 8);
  if (!items.length) { CL.done.record = 1; return nextPhase(); }
  /* words in reading order, each pointing to the audio of the item it belongs to */
  const split = window.CoachCore ? window.CoachCore.splitWords : s => s.split(/\s+/), ws = [], wsrc = [];
  items.forEach(x => split(x.ar).forEach(w => { ws.push(w); wsrc.push(x.src); }));
  shell(`<section class="stage"><h3 class="clsh">🎙️ ${pick(CX.ph.record)}</h3><p class="say">${pick(CX.recP)}</p>
    <div class="bigar recar ${items[0].ip ? "ip" : ""}">${items.map(x => esc(x.ar)).join(" · ")}</div>
    <div class="tkctl"><button class="btn rec big" id="rr">🎙️ ${pick(CX.recB)}</button><button class="btn big" id="rm" disabled>▶ ${pick(CX.mine)}</button><button class="btn cy big" id="rq">🕋 ${pick(CX.qari)}</button></div>
    <div class="lv2"><i id="rlv"></i></div><p class="tkst" id="rs"></p><div id="rres"></div>
    <p><a class="btn" id="rk" href="#coach=h">🎯 ${pick(CX.chk)}</a></p></section>`, "p_record");
  const gid = CL.gid, alive = () => gid === CL.gid && curK() === "record", CC = window.CoachCheck;
  let url = null, busy = false;
  const say = n => S.voice ? narr(n) : Promise.resolve(true);
  const chain = async names => { for (const n of names) { if (!alive() || !S.voice) return; if (!(await narr(n))) return; } };
  $("#rr").onclick = async e => {
    const btn = e.currentTarget;
    if (busy) { CC && CC.stopListen(); return; }
    if (!CC) { toast(t("micNo")); return; }
    stopAll(); busy = true; btn.classList.add("on"); btn.textContent = "⏹ " + t("stop"); $("#rs").textContent = "🎙️ " + pick(CX.lis); $("#rres").innerHTML = "";
    const lv = $("#rlv"); let rec;
    try { rec = await CC.listen({ silenceMs: 2500, maxMs: 90000, waitMs: 12000, onLevel: r => lv && (lv.style.width = Math.min(100, r * 700) + "%") }); }
    catch (er) { busy = false; btn.classList.remove("on"); btn.textContent = "🎙️ " + pick(CX.recB); $("#rs").textContent = ""; toast(t("micNo")); if (S.voice && alive()) narr("micNo"); return; }
    busy = false; btn.classList.remove("on"); btn.textContent = "🎙️ " + pick(CX.recAgain); if (lv) lv.style.width = "0"; if (!alive()) return;
    if (rec.why === "cancel") { $("#rs").textContent = ""; return; }
    try { url = "data:audio/wav;base64," + await CC.toWav(rec.pcm, rec.sr, 0, rec.pcm.length / rec.sr); $("#rm").disabled = false; } catch (er) {}
    CL.done.record = 1; saveCL(); updNext();
    $("#rs").textContent = "🤔 " + pick(CX.chking); if (S.voice) narr("think");
    let res = null; try { res = await CC.evaluate(rec, { words: ws, refUrl: null }); } catch (er) { res = null; }
    if (!alive()) return;
    if (!res) { $("#rs").textContent = pick(CX.aiNo); say("aiNo"); return; }
    if (res.err) { $("#rs").textContent = pick(CX.noSp); say("nospeech"); return; }
    $("#rs").textContent = ""; $("#rres").innerHTML = CC.resultHTML(res);
    $$("#rres [data-qi]").forEach(b => b.onclick = () => playSrc(wsrc[+b.dataset.qi] || []));
    $$("#rres [data-lt],#rres [data-mt]").forEach(b => b.onclick = async () => { stopAll(); const n = []; if (b.dataset.mt) n.push("m_" + b.dataset.mt); if (b.dataset.lt) n.push("lt_" + b.dataset.lt.codePointAt(0).toString(16)); for (const x of n) if (!(await narr(x, true))) return; });
    $("#rres").scrollIntoView({ behavior: "smooth", block: "center" });
    if (res.pass) await say("p_recOk"); else { if (await say("p_recFix")) await chain(CC.issueNames(res)); }
  };
  $("#rm").onclick = () => { if (url) { stopAll(); voiceEl = new Audio(url); voiceEl.dataset.nolip = 1; voiceEl.play(); } };
  $("#rq").onclick = async e => { const b = e.currentTarget; b.classList.add("playing"); for (const x of items) { await playSrc(x.src); await sleep(500); } b.classList.remove("playing"); };
  $("#rk").onclick = () => { stopAll(); saveCL(); };
  if (S.voice) narr("p_record");
}

/* styles for the class (big, simple buttons) */
(() => { const st = document.createElement("style"); st.textContent = `
@font-face{font-family:"QS IndoPak";src:url(/assistant/indopak.woff2) format("woff2");font-display:swap}
.ip{font-family:"QS IndoPak","Amiri Quran","Noto Naskh Arabic",serif!important;direction:rtl}
[hidden]{display:none!important}body.incls .fab{bottom:calc(96px + env(safe-area-inset-bottom,0px));padding:4px;border-radius:50%}body.incls .fab>span:not(.uav){display:none}
.btn.big{min-height:56px;padding:14px 22px;font-size:18px;border-radius:16px}.btn.round{border-radius:999px;min-width:180px}
.clsbar{margin:12px 0 4px;padding:12px 14px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(227,170,60,.10),rgba(227,170,60,.02))}
.clstop{display:flex;justify-content:space-between;align-items:center;gap:10px}.clk{font:700 15px Outfit;color:var(--gold2);background:rgba(0,0,0,.3);padding:6px 10px;border-radius:10px;border:1px solid var(--line)}
.clsph{list-style:none;margin:10px 0 0;padding:0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.clsph::-webkit-scrollbar{display:none}
.clsph li{flex:none;display:flex;align-items:center;gap:6px;padding:6px 10px 6px 6px;border-radius:999px;background:var(--bg2);border:1px solid var(--line);font-size:13px;color:var(--mut)}
.clsph li i{font-style:normal;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--card2);font:700 12px Outfit}
.clsph li.on{border-color:var(--gold);color:var(--fg)}.clsph li.on i{background:var(--gold);color:#1a0f08}.clsph li.ok i{background:var(--ok);color:#06210f}
.clsh{margin:0;font:700 22px/1.3 Outfit}body.ur .clsh{font-family:"Noto Nastaliq Urdu";line-height:2}
.kindt{margin:0;color:var(--gold2);font-weight:700}
.agenda{margin:0;padding:0;list-style:none;display:grid;gap:6px}.agenda li{display:flex;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:12px;background:var(--bg2);border:1px solid var(--line)}
.agenda b{color:var(--gold2);white-space:nowrap}
.tkctl{display:flex;flex-wrap:wrap;gap:10px}.tkst{min-height:26px;margin:0;color:var(--cy);font-weight:600}
.tkg{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;direction:rtl}.tkg.ayg{grid-template-columns:1fr}
.tki{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 8px 18px;border-radius:16px;border:1px solid var(--line);background:var(--bg2);min-height:96px;transition:.2s}
.tki .ar{font-size:clamp(30px,7vw,40px);line-height:1.9;color:var(--gold2)}.ayg .tki .ar{font-size:clamp(24px,5.4vw,32px);line-height:2.2;text-align:center}
.tkw{display:flex;flex-direction:column;gap:6px;min-width:0}.tkw .tki{min-height:104px}.tkx{display:flex;flex-direction:column;align-items:center;gap:0;padding:8px 6px;border-radius:14px;border:1px dashed var(--gold);background:var(--card);color:var(--fg)}.tkx small{color:var(--mut);font-size:12px;direction:ltr}.tkx .ar{font-size:clamp(22px,5.5vw,28px);line-height:1.7;color:var(--gold2)}.tkx i{font-style:normal;font-size:12px}.tkx.cur{border-style:solid;border-color:var(--cy);box-shadow:0 0 0 3px rgba(44,196,242,.3)}
.tki small{color:var(--mut);font-size:13px;direction:ltr}.tki small.ex{font-size:18px;direction:rtl}
.tki.cur{border-color:var(--cy);box-shadow:0 0 0 3px rgba(44,196,242,.3);transform:scale(1.03)}.tki.you{border-color:var(--gold);box-shadow:0 0 0 3px rgba(227,170,60,.4);animation:pulse 1s ease-in-out infinite}
@keyframes pulse{50%{box-shadow:0 0 0 7px rgba(227,170,60,.15)}}
.tkd{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);display:flex;gap:4px}.tkd b{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.15)}.tkd b.on{background:var(--ok)}
.gopts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.gopt{padding:18px 10px;border-radius:16px;border:1px solid var(--line);background:var(--bg2);min-height:92px}.gopt .ar{font-size:clamp(28px,7vw,38px);line-height:1.8;color:var(--gold2)}
.gopt.ok{border-color:var(--ok);background:rgba(63,207,142,.14)}.gopt.no{border-color:var(--bad);background:rgba(255,107,107,.1)}
.recar{font-size:clamp(26px,6vw,36px);line-height:2.3}
.clsnav{position:sticky;bottom:0;padding:12px 0 calc(12px + env(safe-area-inset-bottom,0px));background:linear-gradient(0deg,var(--bg) 60%,transparent);z-index:5}
.clsnav .btn{flex:1;max-width:420px;margin-inline-start:auto}
`; document.head.appendChild(st); })();

/* ---------- one simple, big choice: AI Ustad · real teacher · both ---------- */
const WAYX = {
  h: { en: "How do you want to learn?", ur: "آپ کیسے سیکھنا چاہتے ہیں؟", hi: "आप कैसे सीखना चाहते हैं?" },
  ai: { en: "With the AI Ustad", ur: "اے آئی استاد کے ساتھ", hi: "ए आई उस्ताद के साथ" },
  aiS: { en: "At home, at your own time · 1-hour class every day · from ₹1,479", ur: "گھر بیٹھے، اپنے وقت پر · روز ایک گھنٹے کی کلاس · ₹1,479 سے", hi: "घर बैठे, अपने वक़्त पर · रोज़ एक घंटे की क्लास · ₹1,479 से" },
  live: { en: "With a real teacher", ur: "اصل استاد کے ساتھ", hi: "असल उस्ताद के साथ" },
  liveS: { en: "Live Zoom class, morning or evening batch · teacher corrects you", ur: "لائیو زوم کلاس، صبح یا شام کا بیچ · استاد غلطی درست کرتے ہیں", hi: "लाइव ज़ूम क्लास, सुबह या शाम का बैच · उस्ताद ग़लती दुरुस्त करते हैं" },
  both: { en: "Both together", ur: "دونوں ساتھ", hi: "दोनों साथ" },
  bothS: { en: "Live class with a teacher + the same lesson with the AI Ustad for daily practice", ur: "استاد کی لائیو کلاس + روز کی مشق کے لیے وہی سبق اے آئی استاد کے ساتھ", hi: "उस्ताद की लाइव क्लास + रोज़ की मश्क़ के लिए वही सबक़ ए आई उस्ताद के साथ" },
  bothN: { en: "First enroll in the live class. After that, the AI practice add-on opens here for you (about 25% off).", ur: "پہلے لائیو کلاس میں داخلہ لیں۔ اس کے بعد یہاں آپ کے لیے اے آئی مشق ایڈ آن کھل جائے گا (تقریباً ۲۵٪ کم قیمت)۔", hi: "पहले लाइव क्लास में दाख़िला लें। उसके बाद यहाँ आपके लिए ए आई मश्क़ ऐड-ऑन खुल जाएगा (तक़रीबन 25% कम क़ीमत)।" }
};
function wayHTML() {
  const sfx = LANG === "ur" ? "-ur" : LANG === "hi" ? "-hi" : "";
  return `<section class="sec way"><h2>${pick(WAYX.h)}</h2><div class="ways">
    <a class="wayb wai" href="#aic"><i>🤖</i><b>${pick(WAYX.ai)}</b><small>${pick(WAYX.aiS)}</small></a>
    <a class="wayb wlive" href="/course-tajweed-class${sfx}.html"><i>👨‍🏫</i><b>${pick(WAYX.live)}</b><small>${pick(WAYX.liveS)}</small></a>
    <a class="wayb wboth" href="/course-tajweed-class${sfx}.html#both"><i>👨‍🏫 + 🤖</i><b>${pick(WAYX.both)}</b><small>${pick(WAYX.bothS)}</small><em>${pick(WAYX.bothN)}</em></a></div></section>`;
}
(() => { const st = document.createElement("style"); st.textContent = `
@media(max-width:760px){.hero .orb{display:none}.hero{padding-top:8px}}.way{padding-top:22px}.way h2{font-size:clamp(24px,5vw,32px)!important;text-align:center}
.ways{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}@media(max-width:860px){.ways{grid-template-columns:1fr}}
.wayb{display:flex;flex-direction:column;gap:6px;padding:22px 20px;border-radius:24px;text-decoration:none;color:var(--fg);border:2px solid var(--line);background:linear-gradient(180deg,var(--card2),var(--card));min-height:150px;transition:transform .2s,border-color .2s}
.wayb:hover,.wayb:focus-visible{transform:translateY(-3px);border-color:var(--gold)}
.wayb i{font-style:normal;font-size:40px;line-height:1}.wayb b{font:800 24px/1.25 Outfit}body.ur .wayb b{font-family:"Noto Nastaliq Urdu";line-height:1.9}
.wayb small{color:var(--mut);font-size:15.5px}.wayb em{font-style:normal;font-size:13px;color:var(--gold2);border-top:1px dashed var(--line);padding-top:8px;margin-top:4px}
.wai{border-color:rgba(44,196,242,.55);background:linear-gradient(180deg,rgba(44,196,242,.16),var(--card))}
.wlive{border-color:rgba(227,170,60,.6);background:linear-gradient(180deg,rgba(227,170,60,.16),var(--card))}
.wboth{border-color:rgba(160,29,52,.7);background:linear-gradient(180deg,rgba(160,29,52,.22),var(--card))}
`; document.head.appendChild(st); })();

/* ---------- dark / light theme switch (remembered in this browser) ---------- */
(() => { const b = document.getElementById("thm"); if (!b) return;
  const cur = () => document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const show = () => { b.textContent = cur() === "light" ? "🌙" : "☀️"; };
  b.onclick = () => { const n = cur() === "light" ? "dark" : "light"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("qsai-theme", n); } catch (e) {} show(); };
  show(); })();

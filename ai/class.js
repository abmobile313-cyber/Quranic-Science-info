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
  recB: { en: "Record my reading", ur: "میری تلاوت ریکارڈ کریں", hi: "मेरी तिलावत रिकॉर्ड करें" },
  mine: { en: "My voice", ur: "میری آواز", hi: "मेरी आवाज़" }, qari: { en: "Qari", ur: "قاری", hi: "क़ारी" },
  took: { en: "Class time", ur: "کلاس کا وقت", hi: "क्लास का वक़्त" },
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
  if (qd.k === "letters") return qd.items.map(x => ({ ip: 1, ar: x.L, sub: pick(x.n), ex: x.x.t, src: [{ s: x.x.s, a: x.x.a, w: x.x.w }] }));
  if (qd.k === "ayat") return qd.items.map(x => ({ ip: 1, ar: x.t, ay: 1, src: [{ s: x.ay[0], a: x.ay[1] }], sub: num(x.ay[0]) + ":" + num(x.ay[1]) }));
  return qd.items.map(x => ({ ip: 1, ar: x.t, src: [{ s: x.s, a: x.a, w: x.w }] }));
}
function playSrc(list) {
  return new Promise(async res => {
    stopAll(); const t0 = performance.now();
    for (const q of list) {
      const src = q.k ? `arv/${q.k}.mp3` : q.w ? QARI_WORD(q.s, q.a, q.w) : QARI_AYAH(q.s, q.a);
      await new Promise(r => { qariEl = new Audio(src); qariEl.onended = qariEl.onerror = r; qariEl.play().catch(r); });
    }
    res((performance.now() - t0) / 1000);
  });
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
  Object.assign(CL, { on: true, id, ph: 0, phases: P, t0: Date.now(), pt0: Date.now(), done: {} });
  try { const sv = JSON.parse(sessionStorage.getItem("qsai-cls-" + id) || "null"); if (sv && Date.now() - sv.t0 < 5 * 3600e3) Object.assign(CL, { ph: sv.ph, t0: sv.t0, pt0: Date.now(), done: sv.done || {} }); } catch (e) {}
  clearInterval(CL.tick); CL.tick = setInterval(clockTick, 1000); document.body.classList.add("incls");
  drawPhase();
}
const saveCL = () => { try { sessionStorage.setItem("qsai-cls-" + CL.id, JSON.stringify({ ph: CL.ph, t0: CL.t0, done: CL.done })); } catch (e) {} };
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
function shell(inner) { $("#app").innerHTML = lessonHead() + inner + navNext(); $("#vt") && ($("#vt").onclick = () => { S.voice = !S.voice; LS.set("qsai-voice", S.voice); if (!S.voice) stopAll(); $("#vt").textContent = S.voice ? "🔊 " + t("voiceOn") : "🔇 " + t("voiceOff"); }); wireNext(); }

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
    <ol class="agenda">${CL.phases.map(p => `<li><span>${pick(CX.ph[p[0]])}</span><b>~${num(p[1])} ${pick(CX.mins)}</b></li>`).join("")}</ol></section>`);
  const d1 = $("#d1"), d2 = $("#d2");
  d1.onclick = async () => { d1.classList.add("playing"); await playSrc([{ s: 1, a: 1 }]); d1.classList.remove("playing"); };
  d2.onclick = async () => { d2.classList.add("playing"); for (let r = 0; r < 3; r++) { await playSrc(dua); await sleep(2600); } d2.classList.remove("playing"); CL.done.open = 1; saveCL(); updNext(); };
  setTimeout(() => { CL.done.open = 1; updNext(); }, 30000);
  if (S.voice) d2.click();
}

/* ---------- takrar drill (3 rounds), used for revision, lesson practice and the qaida takhti ---------- */
function phDrill(k) {
  let items, title, note, kindT = "";
  if (k === "rev") { items = lessonItems(CL.prev, 14); title = CX.ph.rev; note = CX.revP;
    const pq = CL.prev && CL.prev.id ? null : null; }
  else if (k === "learn") { items = lessonItems(LESSON.data, 24); title = CX.ph.learn; note = CX.learnDrill; }
  else { items = qaidaItems(CL.qd); title = CX.ph[k]; note = CX.qaidaP; kindT = CL.qd ? pick(CX.kinds[CL.qd.k] || {}) : ""; }
  if (k !== "learn" && k !== "rev" && LESSON.c === "arabic") items = items.slice(0, 14);
  if (!items.length) { CL.done[k] = 1; saveCL(); return k === "rev" ? phRevNone() : nextPhase(); }
  const ay = items.some(x => x.ay);
  shell(`<section class="stage"><h3 class="clsh">${k === "rev" ? "🔁" : k === "learn" ? "📘" : "📜"} ${pick(title)}</h3>${kindT ? `<p class="kindt">${esc(kindT)}</p>` : ""}<p class="say">${pick(note)}</p>
    <div class="tkctl"><button class="btn pri big" id="tkGo">▶ <span id="tkR">${pick(CX.r1)}</span></button><button class="btn big" id="tkStop" hidden>⏸ ${pick(CX.stop)}</button></div>
    <p class="tkst" id="tkst">${pick(CX.tapHint)}</p>
    <div class="tkg ${ay ? "ayg" : ""}">${items.map((x, i) => `<button class="tki" data-i="${i}"><span class="ar ${x.ip ? "ip" : ""}">${esc(x.ar)}</span>${x.sub ? `<small>${esc(x.sub)}</small>` : ""}${x.ex ? `<small class="ar ip ex">${pick(CX.letterOf)} ${esc(x.ex)}</small>` : ""}<i class="tkd"><b></b><b></b><b></b></i></button>`).join("")}</div></section>`);
  const tiles = $$(".tki"), cnt = items.map(() => 0);
  const mark = i => { cnt[i]++; const d = $$(".tkd b", tiles[i]); d.forEach((b, j) => b.classList.toggle("on", j < cnt[i])); if (cnt.every(n => n >= 2) && !CL.done[k]) { CL.done[k] = 1; saveCL(); updNext(); } };
  let run = false, round = 0;
  tiles.forEach((b, i) => b.onclick = async () => { if (run) return; tiles.forEach(x => x.classList.remove("cur")); b.classList.add("cur"); await playSrc(items[i].src); mark(i); b.classList.remove("cur"); });
  const st = $("#tkst"), go = $("#tkGo"), stp = $("#tkStop"), lbl = [CX.r1, CX.r2, CX.r3];
  stp.onclick = () => { run = false; stopAll(); };
  go.onclick = async () => {
    run = true; go.hidden = true; stp.hidden = false;
    for (let i = 0; i < items.length && run; i++) {
      const b = tiles[i]; tiles.forEach(x => x.classList.remove("cur", "you")); b.classList.add("cur");
      b.scrollIntoView({ block: "nearest", behavior: "smooth" });
      if (round === 2) { b.classList.add("you"); st.textContent = "🗣️ " + pick(CX.youFirst); await sleep(ay ? 7000 : 3200); if (!run) break; b.classList.remove("you"); }
      st.textContent = "🔊 " + pick(CX.qari) + " …";
      const dur = await playSrc(items[i].src); if (!run) break;
      if (round === 0) { b.classList.add("you"); st.textContent = "🗣️ " + pick(CX.you); await sleep(Math.max(1600, dur * 1300 + 900)); b.classList.remove("you"); }
      else await sleep(round === 1 ? 700 : 1200);
      mark(i);
    }
    tiles.forEach(x => x.classList.remove("cur", "you")); stp.hidden = true; go.hidden = false;
    if (!run) { st.textContent = pick(CX.tapHint); return; }
    run = false; round++;
    if (round >= 3) { CL.done[k] = 1; saveCL(); updNext(); st.textContent = "🌟 " + pick(CX.allRounds); round = 0; $("#tkR").textContent = pick(CX.again); }
    else { $("#tkR").textContent = pick(lbl[round]); st.textContent = pick(CX.tapHint); }
  };
}
function phRevNone() {
  shell(`<section class="stage"><h3 class="clsh">🔁 ${pick(CX.ph.rev)}</h3><p class="say">${pick(CX.revNone)}</p><p><a class="btn cy big" href="#lab" target="_blank">🗣️ Makharij Lab</a></p></section>`);
}

/* ---------- listening game ---------- */
function phGame() {
  const pool = [...qaidaItems(CL.qd), ...lessonItems(LESSON.data, 30)].filter(x => !x.ay && x.ar.length < 30);
  const uniq = []; const seen = new Set(); for (const x of pool) if (!seen.has(x.ar)) { seen.add(x.ar); uniq.push(x); }
  if (uniq.length < 4) { CL.done.game = 1; return nextPhase(); }
  const N = Math.min(10, uniq.length); let r = 0, ok = 0;
  const order = uniq.slice().sort(() => Math.random() - .5).slice(0, N);
  const draw = () => {
    if (r >= N) { CL.done.game = 1; saveCL();
      shell(`<section class="stage res"><div style="font-size:42px">${ok >= N * .8 ? "🌟" : "👍"}</div><h3>${pick(CX.ph.game)}</h3><div class="big">${num(ok)}/${num(N)}</div><p><button class="btn big" id="ga">🔁 ${pick(CX.again)}</button></p></section>`);
      $("#ga").onclick = () => { CL.done.game = 0; phGame(); }; return; }
    const ans = order[r], opts = [ans, ...uniq.filter(x => x !== ans).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
    shell(`<section class="stage"><h3 class="clsh">👂 ${pick(CX.ph.game)} · ${num(r + 1)}/${num(N)}</h3><p class="say">${pick(CX.gameP)}</p>
      <p style="text-align:center"><button class="btn cy big round" id="gp">🔊 ${pick(CX.play)}</button></p>
      <div class="gopts">${opts.map((x, i) => `<button class="gopt" data-i="${i}"><span class="ar ${x.ip ? "ip" : ""}">${esc(x.ar)}</span></button>`).join("")}</div><p class="tkst" id="gs"></p></section>`);
    const play = () => playSrc(ans.src); $("#gp").onclick = play; play();
    let tries = 0;
    $$(".gopt").forEach(b => b.onclick = async () => {
      const x = opts[+b.dataset.i];
      if (x === ans) { b.classList.add("ok"); if (!tries) ok++; $("#gs").textContent = "✓ " + pick(CX.right); await sleep(900); r++; draw(); }
      else { tries++; b.classList.add("no"); $("#gs").textContent = "✗ " + pick(CX.wrong); await sleep(400); play(); }
    });
  };
  draw();
}

/* ---------- record & compare ---------- */
function phRecord() {
  let items = qaidaItems(CL.qd); if (!items.length) items = lessonItems(LESSON.data, 6);
  items = items.filter(x => x.ar.length < 140).slice(0, items[0] && items[0].ay ? 3 : 8);
  if (!items.length) { CL.done.record = 1; return nextPhase(); }
  shell(`<section class="stage"><h3 class="clsh">🎙️ ${pick(CX.ph.record)}</h3><p class="say">${pick(CX.recP)}</p>
    <div class="bigar recar ${items[0].ip ? "ip" : ""}">${items.map(x => esc(x.ar)).join(" · ")}</div>
    <div class="tkctl"><button class="btn rec big" id="rr">🎙️ ${pick(CX.recB)}</button><button class="btn big" id="rm" disabled>▶ ${pick(CX.mine)}</button><button class="btn cy big" id="rq">🕋 ${pick(CX.qari)}</button></div><p class="tkst" id="rs"></p></section>`);
  let url = null;
  $("#rr").onclick = e => startRec(b => { if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(b); $("#rm").disabled = false; CL.done.record = 1; saveCL(); updNext(); $("#rs").textContent = "✓"; }, e.currentTarget, "🎙️ " + pick(CX.recB));
  $("#rm").onclick = () => { if (url) { stopAll(); voiceEl = new Audio(url); voiceEl.play(); } };
  $("#rq").onclick = async e => { const b = e.currentTarget; b.classList.add("playing"); for (const x of items) { await playSrc(x.src); await sleep(500); } b.classList.remove("playing"); };
}

/* styles for the class (big, simple buttons) */
(() => { const st = document.createElement("style"); st.textContent = `
@font-face{font-family:"QS IndoPak";src:url(/assistant/indopak.woff2) format("woff2");font-display:swap}
.ip{font-family:"QS IndoPak","Amiri Quran","Noto Naskh Arabic",serif!important;direction:rtl}
[hidden]{display:none!important}body.incls .fab{bottom:calc(96px + env(safe-area-inset-bottom,0px));padding:10px;border-radius:50%}body.incls .fab span{display:none}
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
  aiS: { en: "At home, at your own time · 1-hour class every day · from ₹1,499", ur: "گھر بیٹھے، اپنے وقت پر · روز ایک گھنٹے کی کلاس · ₹1,499 سے", hi: "घर बैठे, अपने वक़्त पर · रोज़ एक घंटे की क्लास · ₹1,499 से" },
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

/* ================= Learn with Quranic Science AI — Creator courses =================
   Loaded after app.js and class.js. Adds what the creator courses need on top of the shared engine:
   the editor screen pictures, revision of yesterday's questions, the hands-on practice, and creator wording.
   The syllabus is the same as the live classes (Teacher Guide), day by day. */

/* ---------- wording that differs from the Tajweed / Arabic app ---------- */
Object.assign(LIVEX.note, { en: "You are in our live class with AI practice. The same lesson as your class opens here on the same day: practise the steps, the quiz and homework.", ur: "آپ ہماری لائیو کلاس میں ہیں۔ آپ کی کلاس والا سبق اسی دن یہاں کھلتا ہے: قدم، سوال اور ہوم ورک کی مشق کریں۔", hi: "आप हमारी लाइव क्लास में हैं। आपकी क्लास वाला सबक़ उसी दिन यहाँ खुलता है: क़दम, सवाल और होमवर्क की मश्क़ करें।" });
Object.assign(ADDX.p, { en: "Add the AI Ustad to your live class: the same lesson as your class opens here on the same day, with step-by-step screens, practice, quizzes and homework that goes to your teacher.", ur: "اپنی لائیو کلاس کے ساتھ اے آئی استاد شامل کریں: آپ کی کلاس والا سبق اسی دن یہاں کھلے گا، قدم بہ قدم اسکرین، پریکٹس، سوال اور ہوم ورک جو آپ کے استاد تک جاتا ہے۔", hi: "अपनी लाइव क्लास के साथ ए आई उस्ताद जोड़ें: आपकी क्लास वाला सबक़ उसी दिन यहाँ खुलेगा, क़दम-ब-क़दम स्क्रीन, प्रैक्टिस, सवाल और होमवर्क जो आपके उस्ताद तक जाता है।" });
Object.assign(ADDX.both, { en: "All-in-One (all courses)", ur: "آل اِن ون (سب کورس)", hi: "ऑल-इन-वन (सब कोर्स)" });

/* ---------- AI Ustad knows the creator syllabus ---------- */
ustadKnowledge = async function () {
  const [oe, oc, od] = await Promise.all([outline("editing"), outline("content"), outline("design")]);
  const syl = (o, n) => n + ":\n" + o.weeks.map((w, i) => `Week ${i + 1} ${w.title.en}: ` + w.days.map(d => `${d.n ? "Day " + d.n + " " : ""}${d.title.en}`).join("; ")).join("\n");
  let cur = "";
  if (LESSON.data && /lesson=/.test(location.hash)) cur = "\nTHE STUDENT IS NOW ON THIS LESSON (" + LESSON.id + "):\n" + LESSON.data.moments.map(m => m.en + (m.v && m.v.steps ? " Steps: " + m.v.steps.map(x => x.en).join(" / ") : "")).join("\n") + (LESSON.data.task ? "\nPractice: " + LESSON.data.task.steps.map(x => x.en).join(" / ") : "");
  return `You are "AI Ustad", the teacher inside "Learn with Quranic Science AI – Creator courses" (quranicscience.info): Video Editing in CapCut (35 lessons), Content Creation for Instagram and YouTube (20 lessons) and Graphic Design in Canva with ChatGPT images (5 lessons, All-in-One students only). The same syllabus is taught in our live Zoom classes.
RULES (very important):
1. Answer ONLY about video editing (CapCut), content creation, graphic design (Canva, ChatGPT images) and this course (lessons, homework, time slot, certificate). For other topics, politely say you only help with this course.
2. Be practical and exact: name the CapCut or Canva button and the order of taps. CapCut and Canva change their menus sometimes; if a button may have moved, say so and suggest the search box. Mention when a feature may need the paid (Pro) version, and give the free way.
3. If you are not fully sure, say so honestly instead of guessing.
4. Keep the student halal and honest: no copied content, no music with instruments in Islamic videos, no fake reviews, label paid posts.
5. Reply in the student's language: Urdu script → Urdu, Devanagari → Hindi-Urdu, Roman Urdu → Roman Urdu, English → English. Keep answers short (under 120 words), kind and clear, with one example.
6. Plain text only; no markdown symbols. For a list start lines with •.
COURSE FACTS: daily mode opens one lesson a day at the student's own fixed time (6 days a week). Full Access opens all lessons at once. Certificate after every lesson and question is done. Prices (AI Ustad): Video Editing ₹4,189 ($52), Content Creation ₹4,179 ($53), All-in-One ₹9,799 ($122); Full Access extra: ₹1,999, ₹1,989, ₹4,499. Live teacher classes: Video Editing ₹5,989, Content Creation ₹5,979, All-in-One ₹13,999.
COURSE SYLLABUS:
${syl(oe, "VIDEO EDITING (35 lessons)")}
${syl(oc, "CONTENT CREATION (20 lessons)")}
${syl(od, "GRAPHIC DESIGN (5 lessons, All-in-One)")}${cur}`;
};

/* ---------- editor screen pictures ----------
   v = { ui: "desk" | "phone" | "canva" | "insta" | "zoom", hl: area to light up, btn: the button's name, steps: [{en,ur,hi}] }
   A clean, labelled map of the screen (not a copy of any app's design): where to look, which button, in which order. */
const UIA = {
  desk: { media: [8, 30, 112, 150], player: [126, 30, 168, 150], props: [300, 30, 112, 150], toolbar: [8, 188, 404, 18], timeline: [8, 210, 404, 82], export: [352, 6, 60, 18], top: [8, 6, 330, 18] },
  phone: { player: [70, 30, 120, 150], timeline: [20, 190, 220, 50], toolbar: [10, 250, 240, 30], export: [196, 6, 54, 18], top: [10, 6, 180, 18] },
  canva: { side: [8, 30, 70, 262], top: [8, 6, 404, 18], canvas: [92, 40, 236, 220], props: [340, 30, 72, 262], pages: [92, 266, 236, 26] },
  insta: { top: [70, 8, 120, 18], player: [70, 30, 120, 200], side: [196, 120, 30, 110], caption: [70, 236, 120, 40], bottom: [70, 280, 120, 14] },
  zoom: { video: [8, 8, 404, 210], bar: [8, 226, 404, 34], share: [168, 230, 84, 26], people: [92, 230, 70, 26], rec: [258, 230, 60, 26], chat: [324, 230, 54, 26] }
};
const UIN = {
  media: { en: "Media", ur: "میڈیا", hi: "मीडिया" }, player: { en: "Player", ur: "پلیئر", hi: "प्लेयर" }, props: { en: "Settings", ur: "سیٹنگز", hi: "सेटिंग्स" },
  toolbar: { en: "Tools", ur: "ٹولز", hi: "टूल्स" }, timeline: { en: "Timeline", ur: "ٹائم لائن", hi: "टाइमलाइन" }, export: { en: "Export", ur: "ایکسپورٹ", hi: "एक्सपोर्ट" },
  top: { en: "Top menu", ur: "اوپر کا مینو", hi: "ऊपर का मेनू" }, side: { en: "Side menu", ur: "سائیڈ مینو", hi: "साइड मेनू" }, canvas: { en: "Design", ur: "ڈیزائن", hi: "डिज़ाइन" },
  pages: { en: "Pages", ur: "پیجز", hi: "पेज" }, caption: { en: "Caption", ur: "کیپشن", hi: "कैप्शन" }, bottom: { en: "Bottom bar", ur: "نیچے کی پٹی", hi: "नीचे की पट्टी" },
  video: { en: "Class video", ur: "کلاس ویڈیو", hi: "क्लास वीडियो" }, bar: { en: "Control bar", ur: "کنٹرول بار", hi: "कंट्रोल बार" }, share: { en: "Share Screen", ur: "شیئر اسکرین", hi: "शेयर स्क्रीन" },
  people: { en: "Participants", ur: "شرکاء", hi: "शुरका" }, rec: { en: "Record", ur: "ریکارڈ", hi: "रिकॉर्ड" }, chat: { en: "Chat", ur: "چیٹ", hi: "चैट" }
};
const UIT = { desk: "CapCut · laptop", phone: "CapCut · phone", canva: "Canva", insta: "Instagram", zoom: "Zoom" };
function uiHTML(v) {
  const A = UIA[v.ui] || UIA.desk, W = 420, H = 300, hl = [].concat(v.hl || []);
  const box = (k, [x, y, w, h]) => { const on = hl.includes(k);
    return `<g class="uz${on ? " on" : ""}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>${w > 40 && h > 14 ? `<text x="${x + w / 2}" y="${y + Math.min(h / 2 + 4, 16)}">${esc(pick(UIN[k] || { en: k }))}</text>` : ""}</g>`; };
  const tl = v.ui === "desk" || v.ui === "phone" ? (() => { const [x, y, w, h] = A.timeline; return `<g class="utl"><rect x="${x + 6}" y="${y + h * .3}" width="${w * .55}" height="${h * .28}" rx="4"/><rect x="${x + 6 + w * .57}" y="${y + h * .3}" width="${w * .3}" height="${h * .28}" rx="4"/><rect class="aud" x="${x + 6}" y="${y + h * .66}" width="${w * .8}" height="${h * .18}" rx="3"/><line x1="${x + w * .42}" y1="${y + 4}" x2="${x + w * .42}" y2="${y + h - 4}"/></g>`; })() : "";
  const target = hl.length ? A[hl[0]] : null;
  const chip = v.btn && target ? (() => { const [x, y, w, h] = target, cx = Math.min(W - 70, Math.max(70, x + w / 2)), cy = y + h + 22 > H - 4 ? y - 14 : y + h + 16;
    return `<g class="ubtn"><rect x="${cx - 64}" y="${cy - 13}" width="128" height="24" rx="12"/><text x="${cx}" y="${cy + 4}">${esc(v.btn)}</text></g>`; })() : "";
  const steps = v.steps && v.steps.length ? `<ol class="usteps">${v.steps.map(s => `<li>${esc(pick(s))}</li>`).join("")}</ol>` : "";
  return `<figure class="viz uimap"><div class="uicap">🖥️ ${esc(UIT[v.ui] || "")}</div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(UIT[v.ui] || "screen")}">
    <rect class="ufr" x="2" y="2" width="${W - 4}" height="${H - 4}" rx="12"/>${Object.entries(A).map(([k, r]) => box(k, r)).join("")}${tl}${chip}</svg>${steps}</figure>`;
}
const _visualHTML = visualHTML;
visualHTML = function (v) { return v && v.ui ? uiHTML(v) : _visualHTML(v); };

/* ---------- class phases for the creator courses ---------- */
const CRX = {
  revP: { en: "Yesterday's 3 questions. Say the answer in your mind first, then tap to check.", ur: "کل کے تین سوال۔ پہلے دل میں جواب سوچیں، پھر دبا کر دیکھیں۔", hi: "कल के तीन सवाल। पहले दिल में जवाब सोचें, फिर दबाकर देखें।" },
  show: { en: "Show answer", ur: "جواب دیکھیں", hi: "जवाब देखें" },
  learnDone: { en: "Today's lesson is done. Now open CapCut (or Canva) and do it yourself, step by step.", ur: "آج کا سبق مکمل۔ اب کیپ کٹ (یا کینوا) کھولیں اور خود قدم بہ قدم کریں۔", hi: "आज का सबक़ पूरा। अब CapCut (या Canva) खोलें और ख़ुद क़दम-ब-क़दम करें।" },
  again: { en: "See the lesson again", ur: "سبق دوبارہ دیکھیں", hi: "सबक़ दोबारा देखें" },
  pracP: { en: "Do each step in the app, then tick it. Take your time: practice is where you really learn.", ur: "ہر قدم ایپ میں کریں، پھر نشان لگائیں۔ آرام سے کریں: اصل سیکھنا پریکٹس میں ہوتا ہے۔", hi: "हर क़दम ऐप में करें, फिर निशान लगाएँ। आराम से करें: असल सीखना प्रैक्टिस में होता है।" },
  goal: { en: "What you will make", ur: "آپ کیا بنائیں گے", hi: "आप क्या बनाएँगे" },
  allOk: { en: "All steps done — well done! Keep your file; you will send it as homework at the end.", ur: "سب قدم مکمل — شاباش! اپنی فائل سنبھال کر رکھیں؛ آخر میں ہوم ورک میں بھیجیں گے۔", hi: "सब क़दम पूरे — शाबाश! अपनी फ़ाइल संभाल कर रखें; आख़िर में होमवर्क में भेजेंगे।" },
  stuck: { en: "Stuck? Ask the AI Ustad (button at the bottom).", ur: "اٹک گئے؟ اے آئی استاد سے پوچھیں (نیچے کا بٹن)۔", hi: "अटक गए? ए आई उस्ताद से पूछें (नीचे का बटन)।" }
};
function phRev() {
  const Q = (CL.prev && CL.prev.quiz) || [];
  if (!Q.length) { CL.done.rev = 1; saveCL(); return nextPhase(); }
  shell(`<section class="stage"><h3 class="clsh">🔁 ${pick(CX.ph.rev)}</h3><p class="say">${pick(CRX.revP)}</p>
    <div class="revq">${Q.map((q, i) => `<div class="rq"><b>${num(i + 1)}. ${esc(pick(q.q))}</b><button class="btn sm" data-i="${i}">👁 ${pick(CRX.show)}</button><p class="ra" hidden>✓ ${esc(pick(q.o[q.a]))}<br><small>${esc(pick(q.why))}</small></p></div>`).join("")}</div></section>`);
  const seen = new Set();
  $$(".rq button").forEach(b => b.onclick = () => { b.nextElementSibling.hidden = false; b.remove(); seen.add(b.dataset.i); if (seen.size === Q.length) { CL.done.rev = 1; saveCL(); updNext(); } });
}
function phLearnDone() {
  shell(`<section class="stage res"><div style="font-size:42px">✅</div><h3 class="clsh">${pick(CX.ph.learn)}</h3><p class="say">${pick(CRX.learnDone)}</p>
    <div class="acts" style="justify-content:center"><button class="btn" id="lAgain">↺ ${pick(CRX.again)}</button></div></section>`);
  CL.done.learn = 1; saveCL(); updNext();
  $("#lAgain").onclick = () => { CL.done.learnM = 0; LESSON.i = 0; drawMoment(); };
}
function phPractice() {
  const T = LESSON.data.task;
  if (!T || !T.steps || !T.steps.length) { CL.done.practice = 1; saveCL(); return nextPhase(); }
  const key = "qscr-pr-" + LESSON.id; let got = []; try { got = JSON.parse(sessionStorage.getItem(key) || "[]"); } catch (e) {}
  shell(`<section class="stage"><h3 class="clsh">🛠️ ${pick(CX.ph.practice)}</h3><p class="say">${pick(CRX.pracP)}</p>
    ${T.goal ? `<p class="pgoal"><b>🎯 ${pick(CRX.goal)}:</b> ${esc(pick(T.goal))}</p>` : ""}${T.v ? visualHTML(T.v) : ""}
    <ol class="ptask">${T.steps.map((s, i) => `<li><label><input type="checkbox" data-i="${i}" ${got.includes(i) ? "checked" : ""}><span>${esc(pick(s))}</span></label></li>`).join("")}</ol>
    <p class="mini" id="pOk" ${got.length === T.steps.length ? "" : "hidden"}>🌟 ${pick(CRX.allOk)}</p><p class="mini">💬 ${pick(CRX.stuck)}</p></section>`);
  const upd = () => { const ok = got.length === T.steps.length; $("#pOk").hidden = !ok; if (ok) { CL.done.practice = 1; saveCL(); } updNext(); };
  $$(".ptask input").forEach(c => c.onchange = () => { const i = +c.dataset.i; got = c.checked ? [...new Set(got.concat(i))] : got.filter(x => x !== i); try { sessionStorage.setItem(key, JSON.stringify(got)); } catch (e) {} upd(); });
  upd();
}

(() => { const st = document.createElement("style"); st.textContent = `
.uimap{background:var(--card2);border:1px solid var(--line);border-radius:18px;padding:10px;margin:12px 0}
.uimap svg{width:100%;height:auto;display:block;max-width:560px;margin:0 auto}
.uicap{font:600 12px Outfit,sans-serif;color:var(--mut);margin:0 4px 6px;letter-spacing:.04em}
.uimap .ufr{fill:#0d141b;stroke:rgba(143,211,255,.25)}
.uimap .uz rect{fill:rgba(255,255,255,.04);stroke:rgba(143,211,255,.22)}
.uimap .uz text{fill:#9fb3c4;font:600 11px Outfit,sans-serif;text-anchor:middle}
.uimap .uz.on rect{fill:rgba(227,170,60,.16);stroke:#e3aa3c;stroke-width:2.5;animation:uzp 1.6s ease-in-out infinite}
.uimap .uz.on text{fill:#ffd56a}
@keyframes uzp{50%{stroke-opacity:.35}}
.uimap .utl rect{fill:rgba(44,196,242,.35)}.uimap .utl rect.aud{fill:rgba(63,207,142,.35)}.uimap .utl line{stroke:#fff;stroke-width:2}
.uimap .ubtn rect{fill:#e3aa3c}.uimap .ubtn text{fill:#1c1712;font:800 12px Outfit,sans-serif;text-anchor:middle}
.usteps{margin:10px 0 0;padding:0 0 0 22px;display:grid;gap:6px;font-size:15px}body.ur .usteps{padding:0 22px 0 0}
.usteps li::marker{color:var(--gold2);font-weight:800}
.revq{display:grid;gap:10px}.rq{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px;display:grid;gap:8px}.rq .ra{margin:0;color:var(--ok)}.rq .ra small{color:var(--mut)}
.ptask{list-style:none;padding:0;margin:10px 0;display:grid;gap:8px}.ptask label{display:flex;gap:10px;align-items:flex-start;background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px;cursor:pointer}
.ptask input{width:22px;height:22px;flex:none;accent-color:#e3aa3c;margin-top:2px}.ptask input:checked+span{color:var(--mut);text-decoration:line-through}
.pgoal{background:rgba(227,170,60,.1);border:1px solid rgba(227,170,60,.4);border-radius:14px;padding:10px 12px}
`; document.head.appendChild(st); })();

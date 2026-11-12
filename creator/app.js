"use strict";
/* ============ config ============ */
const FB = { apiKey: "AIzaSyCCoqjw2BzgWcal6OVBqONYOB7x--WP12g", authDomain: "quranicscience-682ff.firebaseapp.com", projectId: "quranicscience-682ff",
  storageBucket: "quranicscience-682ff.firebasestorage.app", messagingSenderId: "573259128290", appId: "1:573259128290:web:ac11b77238e1bd7354edbb" };
const W = "https://quranic-science-automation.quranicscience01.workers.dev";
const OWNERS = ["quranicscience01@gmail.com"];
const RECAPTCHA = "6Lf3gQsuAAAAACWh2Tym8DMJoLbh5RLxNjbokYDx", AI_MODEL = "gemini-3.5-flash-lite";
const WA = "919272527913";
const FREE = []; /* no free demo: every lesson needs enrolment */
const COURSES = {
  editing: { key: "ai-video-editing", full: "ai-video-editing-full", live: "video-editing-course", addon: "ai-video-editing-live", aInr: 3499, aUsd: 43, k: "v", ar: "🎬", inr: 4189, usd: 52, fInr: 1999, fUsd: 25, pay: "", payIntl: "", payFull: "", payFullIntl: "", aPay: "", aPayIntl: "" },
  content: { key: "ai-content-creation", full: "ai-content-creation-full", live: "content-creation-zero-to-pro", addon: "ai-content-creation-live", aInr: 3489, aUsd: 42, k: "n", ar: "📱", inr: 4179, usd: 53, fInr: 1989, fUsd: 24, pay: "", payIntl: "", payFull: "", payFullIntl: "", aPay: "", aPayIntl: "" },
  design: { key: "ai-creator", full: "ai-creator-full", live: "all-in-one-creator-course", addon: "ai-creator-live", aInr: 7499, aUsd: 92, k: "g", ar: "🎨", inr: 9799, usd: 122, fInr: 4499, fUsd: 55, pay: "", payIntl: "", payFull: "", payFullIntl: "", aPay: "", aPayIntl: "" },
  combo: { key: "ai-creator", full: "ai-creator-full", live: "all-in-one-creator-course", addon: "ai-creator-live", aInr: 7499, aUsd: 92, k: "x", ar: "🎬 📱 🎨", inr: 9799, usd: 122, fInr: 4499, fUsd: 55, pay: "", payIntl: "", payFull: "", payFullIntl: "", aPay: "", aPayIntl: "" }
};
const QARI_AYAH = (s, a) => `https://everyayah.com/data/Husary_128kbps/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3`;
const QARI_WORD = (s, a, w) => `https://audio.qurancdn.com/wbw/${String(s).padStart(3, "0")}_${String(a).padStart(3, "0")}_${String(w).padStart(3, "0")}.mp3`;
const DAYS = { en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ur: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"], hi: ["इतवार", "पीर", "मंगल", "बुध", "जुमेरात", "जुमा", "हफ़्ता"] };

/* ============ text ============ */
const TX = {
 en: { tag: "Tajweed · Arabic · AI Ustad", heroEy: "New · Self-paced", hero1: "Learn Tajweed & Arabic with your own", hero2: "AI Ustad",
  heroP: "Short voice lessons in your language, real qari recitation, practice with your own recording, homework checked by AI, 3 questions after every lesson, progress you can see, and a certificate at the end.",
  f1: "72 lessons per course", f2: "Voice in every step", f3: "Real qari audio", f4: "AI checks your homework", f5: "Certificate",
  courses: "Choose your course", editing: "Tajweed with AI", content: "Arabic Speaking with AI", combo: "Tajweed + Arabic with AI",
  dT: "Makharij, sifaat, every rule of recitation, Juz Amma — 12 weeks.", dA: "Understand the Qur'an word by word and speak simple Arabic — 12 weeks.", dC: "Both courses together at a lower price.",
  best: "BEST VALUE", start: "See lessons", open: "Open course", enroll: "Enroll", intl: "Outside India", progress: "Progress", score: "Score", lessons: "Lessons",
  week: "Week", day: "Day", soon: "Coming soon", locked: "Finish the previous lesson first", buyFirst: "Enroll to open all lessons", login: "Log in", logout: "Log out",
  loginWhy: "Log in with the same account you use on quranicscience.info. Your progress and certificate are saved there.", google: "Continue with Google",
  emailL: "Email", passL: "Password", emailBtn: "Log in with email", mobileHint: "Use mobile-number login? Log in on the main website first, then come back here.",
  next: "Next", back: "Back", listen: "Listen to qari", replay: "Replay voice", rec: "Record yourself", stop: "Stop", mine: "Play my voice", toQuiz: "Start the questions",
  q: "Question", of: "of", right: "Correct!", wrong: "Not quite.", cont: "Continue", done: "Lesson complete", saved: "Saved to your progress.", yourScore: "Your score",
  nextL: "Next lesson", toCourse: "Back to course", lowNote: "You can continue, but wrong answers lower your course score. Review this lesson if you like.",
  ask: "Ask AI Ustad", ustad: "AI Ustad", send: "Send", askPh: "Ask about this lesson, a Tajweed rule or an Arabic word…",
  aiNote: "AI Ustad answers from the course. For fatwa or personal issues, please ask a scholar.", aiHello: "Assalamu alaikum! I am your AI Ustad. Ask me anything about Tajweed or Arabic from this course.",
  aiFail: "The AI Ustad is not available right now. Please try again in a minute, or message us on WhatsApp.",
  cert: "Certificate", certNeed: "Complete all 72 lessons and score at least 70% in the final exam to get your certificate.", dl: "Download",
  free: "Free", voiceOff: "Voice off", voiceOn: "Voice on", micNo: "Microphone not allowed. Please allow it in your browser.", payNote: "After payment your course opens automatically on the same account (same mobile/email).",
  payWa: "Enroll on WhatsApp", owner: "Owner preview: all lessons open.",
  fullT: "Full Access", fullD: "All 72 lessons open at once + offline download inside the app. Learn at your own speed; the certificate opens when every lesson and question is done.",
  dailyT: "Daily lessons", dailyD: "One new lesson every day at your own fixed time (6 days a week).", addFull: "⚡ Full Access: all lessons today", fullWait: "Want to study ahead? Open every lesson today with Full Access.",
  slotH: "Choose your daily class time", slotP: "Your next lesson will open every day at this time, 6 days a week. Choose carefully — once saved, the time and the day off CANNOT be changed.",
  slotTime: "Daily time", slotOff: "Weekly day off", slotSave: "Save my time (final)", slotIs: "Your class time", offIs: "day off", nextAt: "Next lesson opens",
  waitSlot: "This lesson opens at your class time", needSlot: "Choose your daily class time first",
  hw: "Homework", hwP: "Send your homework: a voice recording, a photo of your writing, or a short video (max 10 MB). The AI Ustad checks it and gives you feedback.",
  hwVoice: "Record voice", hwPhoto: "Photo", hwVideo: "Short video", hwSending: "Uploading…", hwSent: "Homework sent ✓", hwChecking: "AI Ustad is checking…", hwMine: "My homework", hwNone: "No homework sent yet.", hwHint: "Send this homework at the end of the lesson, after the questions (📤 Homework box).",
  hwBig: "File is too big (max 10 MB).", fb: "Feedback", offline: "Offline", offH: "Offline lessons", offP: "Full Access students can save whole courses inside this app and study without internet. Saved lessons can only be opened here.",
  offDl: "Save for offline", offDone: "Saved for offline ✓", offNone: "Nothing saved yet.", offNeed: "Offline saving is for Full Access students.", saving: "Saving…",
  photoL: "Your photo (for the certificate)", photoBtn: "Choose photo", fullBadge: "Full Access", certReady: "Your certificate is ready", protect: "Lessons are protected and can only be played inside Quranic Science.", arVoice: "Arabic pronunciation", repeat: "Repeat", playAll: "Play all, step by step", tapLetter: "Tap a letter to hear the qari" },
 ur: { tag: "تجوید · عربی · اے آئی استاد", heroEy: "نیا · اپنی رفتار سے", hero1: "تجوید اور عربی سیکھیں اپنے", hero2: "اے آئی استاد کے ساتھ",
  heroP: "آپ کی زبان میں آواز والے چھوٹے اسباق، اصل قاری کی تلاوت، اپنی آواز ریکارڈ کر کے مشق، اے آئی سے ہوم ورک کی جانچ، ہر سبق کے بعد تین سوال، نظر آنے والی پروگریس، اور آخر میں سرٹیفکیٹ۔",
  f1: "ہر کورس میں ۷۲ اسباق", f2: "ہر قدم پر آواز", f3: "اصل قاری کی آواز", f4: "اے آئی ہوم ورک چیک کرتا ہے", f5: "سرٹیفکیٹ",
  courses: "اپنا کورس چنیں", editing: "اے آئی کے ساتھ تجوید", content: "اے آئی کے ساتھ عربی بول چال", combo: "اے آئی کے ساتھ تجوید + عربی",
  dT: "مخارج، صفات، تلاوت کے تمام قواعد، تیسواں پارہ — بارہ ہفتے۔", dA: "قرآن لفظ بہ لفظ سمجھیں اور آسان عربی بولیں — بارہ ہفتے۔", dC: "دونوں کورس ایک ساتھ کم قیمت میں۔",
  best: "بہترین", start: "اسباق دیکھیں", open: "کورس کھولیں", enroll: "داخلہ لیں", intl: "ہندوستان سے باہر", progress: "پروگریس", score: "نمبر", lessons: "اسباق",
  week: "ہفتہ", day: "دن", soon: "جلد آ رہا ہے", locked: "پہلے پچھلا سبق مکمل کریں", buyFirst: "تمام اسباق کھولنے کے لیے داخلہ لیں", login: "لاگ اِن", logout: "لاگ آؤٹ",
  loginWhy: "وہی اکاؤنٹ استعمال کریں جو quranicscience.info پر ہے۔ آپ کی پروگریس اور سرٹیفکیٹ وہیں محفوظ ہوتے ہیں۔", google: "گوگل سے جاری رکھیں",
  emailL: "ای میل", passL: "پاس ورڈ", emailBtn: "ای میل سے لاگ اِن", mobileHint: "موبائل نمبر سے لاگ اِن کرتے ہیں؟ پہلے مین ویب سائٹ پر لاگ اِن کریں، پھر یہاں واپس آئیں۔",
  next: "آگے", back: "پیچھے", listen: "قاری کی آواز سنیں", replay: "آواز دوبارہ", rec: "اپنی آواز ریکارڈ کریں", stop: "روکیں", mine: "اپنی آواز سنیں", toQuiz: "سوال شروع کریں",
  q: "سوال", of: "میں سے", right: "درست!", wrong: "صحیح نہیں۔", cont: "آگے بڑھیں", done: "سبق مکمل", saved: "آپ کی پروگریس میں محفوظ ہو گیا۔", yourScore: "آپ کا نمبر",
  nextL: "اگلا سبق", toCourse: "کورس پر واپس", lowNote: "آپ آگے بڑھ سکتے ہیں، لیکن غلط جواب آپ کے کورس کے نمبر کم کرتے ہیں۔ چاہیں تو یہ سبق دوبارہ دیکھیں۔",
  ask: "اے آئی استاد سے پوچھیں", ustad: "اے آئی استاد", send: "بھیجیں", askPh: "اس سبق، تجوید کے قاعدے یا عربی لفظ کے بارے میں پوچھیں…",
  aiNote: "اے آئی استاد کورس کی بنیاد پر جواب دیتا ہے۔ فتویٰ یا ذاتی مسائل کے لیے عالم سے پوچھیں۔", aiHello: "السلام علیکم! میں آپ کا اے آئی استاد ہوں۔ اس کورس سے تجوید یا عربی کے بارے میں کچھ بھی پوچھیں۔",
  aiFail: "اے آئی استاد ابھی دستیاب نہیں۔ ایک منٹ بعد دوبارہ کوشش کریں، یا واٹس ایپ پر پیغام بھیجیں۔",
  cert: "سرٹیفکیٹ", certNeed: "سرٹیفکیٹ کے لیے تمام ۷۲ اسباق مکمل کریں اور فائنل امتحان میں کم از کم ۷۰٪ نمبر لائیں۔", dl: "ڈاؤن لوڈ",
  free: "مفت", voiceOff: "آواز بند", voiceOn: "آواز چالو", micNo: "مائیک کی اجازت نہیں ملی۔ براؤزر میں اجازت دیں۔", payNote: "ادائیگی کے بعد آپ کا کورس اسی اکاؤنٹ (اسی موبائل/ای میل) پر خود کھل جائے گا۔",
  payWa: "واٹس ایپ پر داخلہ", owner: "مالک کا پیش نظارہ: تمام اسباق کھلے ہیں۔",
  fullT: "فل ایکسیس", fullD: "تمام ۷۲ اسباق ایک ساتھ کھل جائیں گے + ایپ کے اندر آف لائن ڈاؤن لوڈ۔ اپنی رفتار سے سیکھیں؛ سرٹیفکیٹ تب کھلے گا جب ہر سبق اور ہر سوال مکمل ہو جائے۔",
  dailyT: "روزانہ اسباق", dailyD: "ہر روز آپ کے مقرر وقت پر ایک نیا سبق (ہفتے میں چھ دن)۔", addFull: "⚡ فل ایکسیس: سب سبق آج ہی", fullWait: "آگے پڑھنا چاہتے ہیں؟ فل ایکسیس سے سارے سبق آج ہی کھولیں۔",
  slotH: "اپنی روزانہ کلاس کا وقت چنیں", slotP: "آپ کا اگلا سبق ہر روز اسی وقت کھلے گا، ہفتے میں چھ دن۔ سوچ کر چنیں — ایک بار محفوظ ہونے کے بعد وقت اور چھٹی کا دن بدلا نہیں جا سکے گا۔",
  slotTime: "روزانہ وقت", slotOff: "ہفتہ وار چھٹی", slotSave: "میرا وقت محفوظ کریں (آخری)", slotIs: "آپ کی کلاس کا وقت", offIs: "چھٹی", nextAt: "اگلا سبق کھلے گا",
  waitSlot: "یہ سبق آپ کی کلاس کے وقت کھلے گا", needSlot: "پہلے اپنی روزانہ کلاس کا وقت چنیں",
  hw: "ہوم ورک", hwP: "اپنا ہوم ورک بھیجیں: آواز کی ریکارڈنگ، لکھائی کی تصویر، یا چھوٹی ویڈیو (زیادہ سے زیادہ ۱۰ ایم بی)۔ اے آئی استاد چیک کر کے رائے دے گا۔",
  hwVoice: "آواز ریکارڈ کریں", hwPhoto: "تصویر", hwVideo: "چھوٹی ویڈیو", hwSending: "بھیجا جا رہا ہے…", hwSent: "ہوم ورک بھیج دیا ✓", hwChecking: "اے آئی استاد چیک کر رہا ہے…", hwMine: "میرا ہوم ورک", hwNone: "ابھی کوئی ہوم ورک نہیں بھیجا۔", hwHint: "یہ ہوم ورک سبق کے آخر میں، سوالوں کے بعد، 📤 ہوم ورک والے خانے سے بھیجیں۔",
  hwBig: "فائل بہت بڑی ہے (زیادہ سے زیادہ ۱۰ ایم بی)۔", fb: "رائے", offline: "آف لائن", offH: "آف لائن اسباق", offP: "فل ایکسیس والے طلبہ پورا کورس اسی ایپ میں محفوظ کر کے بغیر انٹرنیٹ پڑھ سکتے ہیں۔ محفوظ اسباق صرف یہیں کھلیں گے۔",
  offDl: "آف لائن محفوظ کریں", offDone: "آف لائن محفوظ ✓", offNone: "ابھی کچھ محفوظ نہیں۔", offNeed: "آف لائن محفوظ کرنا فل ایکسیس والوں کے لیے ہے۔", saving: "محفوظ ہو رہا ہے…",
  photoL: "آپ کی تصویر (سرٹیفکیٹ کے لیے)", photoBtn: "تصویر چنیں", fullBadge: "فل ایکسیس", certReady: "آپ کا سرٹیفکیٹ تیار ہے", protect: "اسباق محفوظ ہیں اور صرف قرآنک سائنس کے اندر چلتے ہیں۔", arVoice: "عربی تلفظ سنیں", repeat: "دہرائیں", playAll: "سب ترتیب سے سنیں", tapLetter: "حرف پر ٹیپ کریں، قاری کی آواز سنیں" },
 hi: { tag: "तजवीद · अरबी · ए आई उस्ताद", heroEy: "नया · अपनी रफ़्तार से", hero1: "तजवीद और अरबी सीखें अपने", hero2: "ए आई उस्ताद के साथ",
  heroP: "आपकी ज़बान में आवाज़ वाले छोटे सबक़, असली क़ारी की तिलावत, अपनी आवाज़ रिकॉर्ड करके मश्क़, ए आई से होमवर्क की जाँच, हर सबक़ के बाद तीन सवाल, नज़र आने वाली प्रोग्रेस, और आख़िर में सर्टिफ़िकेट।",
  f1: "हर कोर्स में 72 सबक़", f2: "हर क़दम पर आवाज़", f3: "असली क़ारी की आवाज़", f4: "ए आई होमवर्क चेक करता है", f5: "सर्टिफ़िकेट",
  courses: "अपना कोर्स चुनें", editing: "ए आई के साथ तजवीद", content: "ए आई के साथ अरबी बोलचाल", combo: "ए आई के साथ तजवीद + अरबी",
  dT: "मख़ारिज, सिफ़ात, तिलावत के तमाम क़वाइद, तीसवाँ पारा — बारह हफ़्ते।", dA: "क़ुरआन लफ़्ज़-ब-लफ़्ज़ समझें और आसान अरबी बोलें — बारह हफ़्ते।", dC: "दोनों कोर्स एक साथ कम क़ीमत में।",
  best: "बेहतरीन", start: "सबक़ देखें", open: "कोर्स खोलें", enroll: "दाख़िला लें", intl: "हिंदुस्तान से बाहर", progress: "प्रोग्रेस", score: "नंबर", lessons: "सबक़",
  week: "हफ़्ता", day: "दिन", soon: "जल्द आ रहा है", locked: "पहले पिछला सबक़ पूरा करें", buyFirst: "सारे सबक़ खोलने के लिए दाख़िला लें", login: "लॉग इन", logout: "लॉग आउट",
  loginWhy: "वही अकाउंट इस्तेमाल करें जो quranicscience.info पर है। आपकी प्रोग्रेस और सर्टिफ़िकेट वहीं महफ़ूज़ होते हैं।", google: "गूगल से जारी रखें",
  emailL: "ईमेल", passL: "पासवर्ड", emailBtn: "ईमेल से लॉग इन", mobileHint: "मोबाइल नंबर से लॉग इन करते हैं? पहले मेन वेबसाइट पर लॉग इन करें, फिर यहाँ वापस आएँ।",
  next: "आगे", back: "पीछे", listen: "क़ारी की आवाज़ सुनें", replay: "आवाज़ दोबारा", rec: "अपनी आवाज़ रिकॉर्ड करें", stop: "रोकें", mine: "अपनी आवाज़ सुनें", toQuiz: "सवाल शुरू करें",
  q: "सवाल", of: "में से", right: "सही!", wrong: "सही नहीं।", cont: "आगे बढ़ें", done: "सबक़ पूरा", saved: "आपकी प्रोग्रेस में महफ़ूज़ हो गया।", yourScore: "आपका नंबर",
  nextL: "अगला सबक़", toCourse: "कोर्स पर वापस", lowNote: "आप आगे बढ़ सकते हैं, लेकिन ग़लत जवाब आपके कोर्स के नंबर कम करते हैं। चाहें तो यह सबक़ दोबारा देखें।",
  ask: "ए आई उस्ताद से पूछें", ustad: "ए आई उस्ताद", send: "भेजें", askPh: "इस सबक़, तजवीद के क़ायदे या अरबी लफ़्ज़ के बारे में पूछें…",
  aiNote: "ए आई उस्ताद कोर्स की बुनियाद पर जवाब देता है। फ़तवा या ज़ाती मसाइल के लिए आलिम से पूछें।", aiHello: "अस्सलामु अलैकुम! मैं आपका ए आई उस्ताद हूँ। इस कोर्स से तजवीद या अरबी के बारे में कुछ भी पूछें।",
  aiFail: "ए आई उस्ताद अभी उपलब्ध नहीं। एक मिनट बाद दोबारा कोशिश करें, या व्हाट्सऐप पर मैसेज भेजें।",
  cert: "सर्टिफ़िकेट", certNeed: "सर्टिफ़िकेट के लिए सारे 72 सबक़ पूरे करें और फ़ाइनल इम्तिहान में कम से कम 70% नंबर लाएँ।", dl: "डाउनलोड",
  free: "मुफ़्त", voiceOff: "आवाज़ बंद", voiceOn: "आवाज़ चालू", micNo: "माइक की इजाज़त नहीं मिली। ब्राउज़र में इजाज़त दें।", payNote: "पेमेंट के बाद आपका कोर्स उसी अकाउंट (उसी मोबाइल/ईमेल) पर ख़ुद खुल जाएगा।",
  payWa: "व्हाट्सऐप पर दाख़िला", owner: "मालिक का प्रीव्यू: सारे सबक़ खुले हैं।",
  fullT: "फ़ुल ऐक्सेस", fullD: "सारे 72 सबक़ एक साथ खुल जाएँगे + ऐप के अंदर ऑफ़लाइन डाउनलोड। अपनी रफ़्तार से सीखें; सर्टिफ़िकेट तब खुलेगा जब हर सबक़ और हर सवाल पूरा हो जाए।",
  dailyT: "रोज़ाना सबक़", dailyD: "हर रोज़ आपके तय वक़्त पर एक नया सबक़ (हफ़्ते में छह दिन)।", addFull: "⚡ फ़ुल ऐक्सेस: सब सबक़ आज ही", fullWait: "आगे पढ़ना चाहते हैं? फ़ुल ऐक्सेस से सारे सबक़ आज ही खोलें।",
  slotH: "अपनी रोज़ाना क्लास का वक़्त चुनें", slotP: "आपका अगला सबक़ हर रोज़ इसी वक़्त खुलेगा, हफ़्ते में छह दिन। सोच कर चुनें — एक बार महफ़ूज़ होने के बाद वक़्त और छुट्टी का दिन बदला नहीं जा सकेगा।",
  slotTime: "रोज़ाना वक़्त", slotOff: "हफ़्तावार छुट्टी", slotSave: "मेरा वक़्त महफ़ूज़ करें (आख़िरी)", slotIs: "आपकी क्लास का वक़्त", offIs: "छुट्टी", nextAt: "अगला सबक़ खुलेगा",
  waitSlot: "यह सबक़ आपकी क्लास के वक़्त खुलेगा", needSlot: "पहले अपनी रोज़ाना क्लास का वक़्त चुनें",
  hw: "होमवर्क", hwP: "अपना होमवर्क भेजें: आवाज़ की रिकॉर्डिंग, लिखाई की फ़ोटो, या छोटी वीडियो (ज़्यादा से ज़्यादा 10 MB)। ए आई उस्ताद चेक करके राय देगा।",
  hwVoice: "आवाज़ रिकॉर्ड करें", hwPhoto: "फ़ोटो", hwVideo: "छोटी वीडियो", hwSending: "भेजा जा रहा है…", hwSent: "होमवर्क भेज दिया ✓", hwChecking: "ए आई उस्ताद चेक कर रहा है…", hwMine: "मेरा होमवर्क", hwNone: "अभी कोई होमवर्क नहीं भेजा।", hwHint: "यह होमवर्क सबक़ के आख़िर में, सवालों के बाद, 📤 होमवर्क वाले ख़ाने से भेजें।",
  hwBig: "फ़ाइल बहुत बड़ी है (ज़्यादा से ज़्यादा 10 MB)।", fb: "राय", offline: "ऑफ़लाइन", offH: "ऑफ़लाइन सबक़", offP: "फ़ुल ऐक्सेस वाले तलबा पूरा कोर्स इसी ऐप में महफ़ूज़ करके बिना इंटरनेट पढ़ सकते हैं। महफ़ूज़ सबक़ सिर्फ़ यहीं खुलेंगे।",
  offDl: "ऑफ़लाइन महफ़ूज़ करें", offDone: "ऑफ़लाइन महफ़ूज़ ✓", offNone: "अभी कुछ महफ़ूज़ नहीं।", offNeed: "ऑफ़लाइन महफ़ूज़ करना फ़ुल ऐक्सेस वालों के लिए है।", saving: "महफ़ूज़ हो रहा है…",
  photoL: "आपकी फ़ोटो (सर्टिफ़िकेट के लिए)", photoBtn: "फ़ोटो चुनें", fullBadge: "फ़ुल ऐक्सेस", certReady: "आपका सर्टिफ़िकेट तैयार है", protect: "सबक़ महफ़ूज़ हैं और सिर्फ़ क़ुरआनिक साइंस के अंदर चलते हैं।", arVoice: "अरबी तलफ़्फ़ुज़ सुनें", repeat: "दोहराएँ", playAll: "सब तरतीब से सुनें", tapLetter: "हर्फ़ पर टैप करें, क़ारी की आवाज़ सुनें" }
};
/* creator courses: same app, creator wording */
Object.assign(TX.en, { tag: "Video Editing · Content · Design · AI Ustad", heroEy: "New · Learn at your own pace", hero1: "Become a creator with your own", hero2: "AI Ustad",
  heroP: "Short voice lessons in your language, step-by-step CapCut and Canva screens, a practice task in every class, homework checked by AI, 3 questions after every lesson, and a certificate at the end. The same syllabus as our live classes.",
  f1: "Day-by-day syllabus", f2: "Voice in every step", f3: "Practice task every class", f4: "AI checks your homework", f5: "Certificate",
  editing: "Video Editing (CapCut) with AI", content: "Content Creation with AI", combo: "All-in-One Creator with AI", design: "Graphic Design with AI",
  dT: "Cuts, captions, sound, colour, motion and client work in CapCut — 40 lessons.", dA: "Niche, ideas, hooks, scripts, phone shooting, vlogs, growth and earning — 20 lessons.", dC: "Video Editing + Content Creation + Graphic Design (gift) + AI Masterclass — 70 lessons.", dD: "Canva and ChatGPT images: posts, thumbnails, posters, logo and brand kit — 10 lessons.",
  listen: "Watch the steps", askPh: "Ask about this lesson, CapCut, Canva or content…",
  aiNote: "AI Ustad answers from the course. For anything personal, ask your teacher on WhatsApp.", aiHello: "Assalamu alaikum! I am your AI Ustad. Ask me anything about editing, content or design from this course.",
  certNeed: "Complete every lesson and pass the questions to get your certificate.",
  fullD: "Every lesson of the course opens at once + offline saving inside the app. Learn at your own speed; the certificate opens when every lesson and question is done.",
  hwP: "Send your homework: your video, a screenshot or a photo (max 10 MB). The AI Ustad checks it and gives you feedback." });
Object.assign(TX.ur, { tag: "ویڈیو ایڈیٹنگ · کانٹینٹ · ڈیزائن · اے آئی استاد", heroEy: "نیا · اپنی رفتار سے", hero1: "کریئیٹر بنیں اپنے", hero2: "اے آئی استاد کے ساتھ",
  heroP: "آپ کی زبان میں آواز والے چھوٹے اسباق، کیپ کٹ اور کینوا کی قدم بہ قدم اسکرین، ہر کلاس میں پریکٹس، اے آئی سے چیک ہونے والا ہوم ورک، ہر سبق کے بعد تین سوال، اور آخر میں سرٹیفکیٹ۔ وہی سلیبس جو ہماری لائیو کلاس کا ہے۔",
  f1: "دن بہ دن سلیبس", f2: "ہر قدم پر آواز", f3: "ہر کلاس میں پریکٹس", f4: "اے آئی ہوم ورک چیک کرتا ہے", f5: "سرٹیفکیٹ",
  editing: "ویڈیو ایڈیٹنگ (کیپ کٹ) اے آئی کے ساتھ", content: "کانٹینٹ کریئیشن اے آئی کے ساتھ", combo: "آل اِن ون کریئیٹر اے آئی کے ساتھ", design: "گرافک ڈیزائن اے آئی کے ساتھ",
  dT: "کیپ کٹ میں کٹ، کیپشن، آواز، رنگ، موشن اور کلائنٹ کا کام — ۴۰ اسباق۔", dA: "نِیش، آئیڈیا، ہُک، اسکرپٹ، فون سے شوٹ، ولاگ، گروتھ اور کمائی — ۲۰ اسباق۔", dC: "ویڈیو ایڈیٹنگ + کانٹینٹ کریئیشن + گرافک ڈیزائن (تحفہ) + اے آئی ماسٹرکلاس — ۷۰ اسباق۔", dD: "کینوا اور چیٹ جی پی ٹی امیجز: پوسٹ، تھمب نیل، پوسٹر، لوگو اور برانڈ کٹ — ۱۰ اسباق۔",
  listen: "قدم دیکھیں", askPh: "اس سبق، کیپ کٹ، کینوا یا کانٹینٹ کے بارے میں پوچھیں…",
  aiNote: "اے آئی استاد کورس سے جواب دیتا ہے۔ ذاتی بات کے لیے واٹس ایپ پر استاد سے پوچھیں۔", aiHello: "السلام علیکم! میں آپ کا اے آئی استاد ہوں۔ اس کورس کی ایڈیٹنگ، کانٹینٹ یا ڈیزائن کے بارے میں کچھ بھی پوچھیں۔",
  certNeed: "سرٹیفکیٹ کے لیے ہر سبق مکمل کریں اور سوالوں میں پاس ہوں۔",
  fullD: "کورس کے سارے اسباق ایک ساتھ کھل جائیں گے + ایپ میں آف لائن محفوظ کرنا۔ اپنی رفتار سے سیکھیں؛ سرٹیفکیٹ ہر سبق اور سوال مکمل ہونے پر کھلے گا۔",
  hwP: "اپنا ہوم ورک بھیجیں: اپنی ویڈیو، اسکرین شاٹ یا فوٹو (زیادہ سے زیادہ ۱۰ ایم بی)۔ اے آئی استاد چیک کر کے رائے دے گا۔" });
Object.assign(TX.hi, { tag: "वीडियो एडिटिंग · कंटेंट · डिज़ाइन · ए आई उस्ताद", heroEy: "नया · अपनी रफ़्तार से", hero1: "क्रिएटर बनें अपने", hero2: "ए आई उस्ताद के साथ",
  heroP: "आपकी ज़बान में आवाज़ वाले छोटे सबक़, CapCut और Canva की क़दम-ब-क़दम स्क्रीन, हर क्लास में प्रैक्टिस, ए आई से चेक होने वाला होमवर्क, हर सबक़ के बाद तीन सवाल, और आख़िर में सर्टिफ़िकेट। वही सिलेबस जो हमारी लाइव क्लास का है।",
  f1: "दिन-ब-दिन सिलेबस", f2: "हर क़दम पर आवाज़", f3: "हर क्लास में प्रैक्टिस", f4: "ए आई होमवर्क चेक करता है", f5: "सर्टिफ़िकेट",
  editing: "वीडियो एडिटिंग (CapCut) ए आई के साथ", content: "कंटेंट क्रिएशन ए आई के साथ", combo: "ऑल-इन-वन क्रिएटर ए आई के साथ", design: "ग्राफ़िक डिज़ाइन ए आई के साथ",
  dT: "CapCut में कट, कैप्शन, आवाज़, रंग, मोशन और क्लाइंट का काम — 40 सबक़।", dA: "निश, आइडिया, हुक, स्क्रिप्ट, फ़ोन से शूट, व्लॉग, ग्रोथ और कमाई — 20 सबक़।", dC: "वीडियो एडिटिंग + कंटेंट क्रिएशन + ग्राफ़िक डिज़ाइन (तोहफ़ा) + ए आई मास्टरक्लास — 70 सबक़।", dD: "Canva और ChatGPT इमेज: पोस्ट, थंबनेल, पोस्टर, लोगो और ब्रांड किट — 10 सबक़।",
  listen: "क़दम देखें", askPh: "इस सबक़, CapCut, Canva या कंटेंट के बारे में पूछें…",
  aiNote: "ए आई उस्ताद कोर्स से जवाब देता है। निजी बात के लिए WhatsApp पर उस्ताद से पूछें।", aiHello: "अस्सलामु अलैकुम! मैं आपका ए आई उस्ताद हूँ। इस कोर्स की एडिटिंग, कंटेंट या डिज़ाइन के बारे में कुछ भी पूछें।",
  certNeed: "सर्टिफ़िकेट के लिए हर सबक़ पूरा करें और सवालों में पास हों।",
  fullD: "कोर्स के सारे सबक़ एक साथ खुल जाएँगे + ऐप में ऑफ़लाइन सेव। अपनी रफ़्तार से सीखें; सर्टिफ़िकेट हर सबक़ और सवाल पूरा होने पर खुलेगा।",
  hwP: "अपना होमवर्क भेजें: अपनी वीडियो, स्क्रीनशॉट या फ़ोटो (ज़्यादा से ज़्यादा 10 MB)। ए आई उस्ताद चेक करके राय देगा।" });

const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
let LANG = LS.get("qsai-lang", "ur");
const t = k => (TX[LANG] && TX[LANG][k]) || TX.en[k] || k;
const pick = o => o ? (o[LANG] || o.en || o.ur || "") : "";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const toast = m => { const e = $("#toast"); e.textContent = m; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("on"), 2800); };
const num = n => LANG === "ur" ? String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]) : String(n);
const rupee = n => `<bdi dir="ltr">₹${Number(n).toLocaleString("en-IN")}</bdi>`;

/* ============ small IndexedDB store (content keys + offline flags) ============ */
const IDB = (() => { let dbp; const open = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open("qsai", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (m, f) => { const db = await open(); return new Promise((res, rej) => { const s = db.transaction("kv", m).objectStore("kv"), q = f(s); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
  return { get: k => tx("readonly", s => s.get(k)).catch(() => null), set: (k, v) => tx("readwrite", s => s.put(v, k)).catch(() => null), del: k => tx("readwrite", s => s.delete(k)).catch(() => null) }; })();

/* ============ state ============ */
const S = { rep: LS.get("qsai-rep", 1), user: null, doc: {}, prog: LS.get("qsai-prog", {}), outline: {}, weeks: {}, voice: LS.get("qsai-voice", true), keys: {}, full: {}, tch: null, live: {} };
const isOwner = () => !!(S.user && OWNERS.includes((S.user.email || "").toLowerCase()));
const acc = () => S.doc.access || {};
/* bought the AI course itself */
const buyer = c => isOwner() || !!(acc()[COURSES[c].key] || acc()[COURSES.combo.key] || acc()[COURSES[c].full] || acc()[COURSES.combo.full]);
/* a live-class (teacher) student: the same lessons open together with their live classes */
const liveOf = c => c !== "combo" && !!(acc()[COURSES[c].live] || acc()[COURSES.combo.live]);
const isTeacherOf = c => !!(S.tch && (S.tch.course === (COURSES[c] || {}).live || S.tch.course === COURSES.combo.live));
/* a live student who paid the AI add-on: the AI lesson of each class day opens with that class */
const liveAI = c => c !== "combo" && liveOf(c) && !!(acc()[COURSES[c].addon] || acc()[COURSES.combo.addon]);
const has = c => c === "combo" ? buyer(c) || (liveAI("editing") && liveAI("content")) : buyer(c) || liveAI(c) || isTeacherOf(c);
const isFull = c => isOwner() || isTeacherOf(c) || !!(acc()[COURSES[c].full] || acc()[COURSES.combo.full] || S.full[c]);
const progOf = () => Object.assign({}, S.prog, (S.doc.ai || {}));
const slot = () => S.doc.aiSlot || null;

/* ============ firebase ============ */
let auth = null, db = null;
try { firebase.initializeApp(FB); auth = firebase.auth(); db = firebase.firestore(); } catch (e) {}
const token = async () => S.user ? S.user.getIdToken() : "";
async function loadDoc() {
  S.doc = {};
  if (!S.user || !db) return;
  try { const d = await db.collection("users").doc(S.user.uid).get(); S.doc = d.exists ? d.data() : {}; } catch (e) {}
  S.tch = null; S.live = {};
  if (S.user.email) try { const tdoc = await db.collection("teachers").doc(S.user.email.toLowerCase()).get(); if (tdoc.exists) S.tch = tdoc.data(); } catch (e) {}
  const local = LS.get("qsai-prog", {}), remote = S.doc.ai || {}, add = {};
  for (const k in local) if (!remote[k]) add[k] = local[k];
  if (Object.keys(add).length) { S.doc.ai = Object.assign({}, remote, add); try { await db.collection("users").doc(S.user.uid).set({ ai: add }, { merge: true }); } catch (e) {} }
}
async function saveUser(data) { Object.assign(S.doc, data); if (S.user && db) try { await db.collection("users").doc(S.user.uid).set(data, { merge: true }); } catch (e) {} }
async function saveProg(id, rec) {
  S.prog[id] = rec; LS.set("qsai-prog", S.prog);
  if (S.user && db) { S.doc.ai = Object.assign({}, S.doc.ai || {}, { [id]: rec }); try { await db.collection("users").doc(S.user.uid).set({ ai: { [id]: rec } }, { merge: true }); } catch (e) {} }
}
if (auth) auth.onAuthStateChanged(async u => { S.user = u; await loadDoc(); renderWho(); drawMark(); route(); });

/* ============ protected content: lessons and voices are stored encrypted; the key is given only to enrolled students ============ */
const hex2buf = h => new Uint8Array(h.match(/../g).map(x => parseInt(x, 16)));
async function courseKey(c) {
  if (S.keys[c]) return S.keys[c];
  const uid = S.user && S.user.uid; if (!uid) throw new Error("login");
  const saved = await IDB.get("key-" + c + "-" + uid);
  if (saved && saved.k) { S.keys[c] = saved.k; S.full[c] = !!saved.full; return saved.k; }
  const r = await fetch(`${W}/ai/key?course=${c}`, { headers: { authorization: "Bearer " + await token() } }).then(r => r.json());
  if (!r.key) throw new Error(r.error || "no key");
  const k = await crypto.subtle.importKey("raw", hex2buf(r.key), "AES-GCM", false, ["decrypt"]);
  await IDB.set("key-" + c + "-" + uid, { k, full: !!r.full }); S.keys[c] = k; S.full[c] = !!r.full; return k;
}
async function decryptBuf(buf, c) { const k = await courseKey(c), b = new Uint8Array(buf); return crypto.subtle.decrypt({ name: "AES-GCM", iv: b.slice(0, 12) }, k, b.slice(12)); }
const courseOf = id => id[0] === "v" ? "editing" : id[0] === "n" ? "content" : "design";

/* ============ data ============ */
async function outline(c) { if (!S.outline[c]) S.outline[c] = await fetch(`data/${c}.json`, { cache: "no-cache" }).then(r => r.json()); return S.outline[c]; }
async function lessonData(id) {
  if (FREE.includes(id)) { if (!S.free) S.free = await fetch(`data/free.json?v=${dv(id)}`).then(r => r.json()); return S.free.find(l => l.id === id); }
  const wk = id.slice(0, 5);
  if (!S.weeks[wk]) { const r = await getBin(`data/${wk}.bin?v=${dv(id)}`); if (!r.ok) return null; S.weeks[wk] = JSON.parse(new TextDecoder().decode(await decryptBuf(await r.arrayBuffer(), courseOf(id)))); }
  return S.weeks[wk].find(l => l.id === id);
}
const voiceUrls = {};
const dv = id => (S.outline[courseOf(id)] || {}).v || 0;
const getBin = async u => { let r = await fetch(u); if (!r.ok) r = await fetch(u, { cache: "reload" }); return r; };
async function voiceSrc(id, i) {
  if (FREE.includes(id)) return `vo/${id}-${i}.mp3?v=${dv(id)}`;
  const key = id + "-" + i; if (voiceUrls[key]) return voiceUrls[key];
  const r = await getBin(`vo/${key}.bin?v=${dv(id)}`); if (!r.ok) return null;
  const u = URL.createObjectURL(new Blob([await decryptBuf(await r.arrayBuffer(), courseOf(id))], { type: "audio/mpeg" }));
  return voiceUrls[key] = u;
}
const allIds = o => o.weeks.flatMap(w => w.days.map(d => d.id));
function stats(c, o) {
  const P = progOf(), ids = allIds(o); let done = 0, ok = 0, tot = 0;
  for (const id of ids) if (P[id]) { done++; ok += P[id].s || 0; tot += P[id].n || 0; }
  return { done, total: ids.length, pct: Math.round(done * 100 / ids.length), score: tot ? Math.round(ok * 100 / tot) : 0 };
}
/* daily mode: the next lesson opens at the student's own class time, the day after the last lesson was finished (6 days a week) */
function slotTimeAfter(ts) {
  const s = slot(); if (!s) return Infinity;
  const [h, m] = s.t.split(":").map(Number), d = new Date(ts); d.setHours(h, m, 0, 0);
  if (d.getTime() <= ts) d.setDate(d.getDate() + 1);
  while (d.getDay() === +s.off) d.setDate(d.getDate() + 1);
  return d.getTime();
}
/* which AI lessons are open for a live student: the lesson of every live class that has started */
async function liveOpen(c) {
  if (S.live[c] || !db || !liveAI(c)) return S.live[c] || new Set();
  const set = new Set(), o = await outline(c), ids = allIds(o), b = S.doc.batch, now = Date.now();
  try { const q = await db.collection("classes").where("course", "==", COURSES[c].live).get();
    q.docs.map(d => d.data()).filter(k => !b || !k.batch || k.batch === b || k.batch === "ALL").forEach(k => {
      const at = k.date ? new Date(String(k.date).replace(" ", "T")).getTime() : 0;
      if (at && at - 15 * 60000 <= now) { const id = k.ai || ids[(k.n || 0) - 1]; if (id) set.add(id); } }); } catch (e) {}
  return S.live[c] = set;
}
function lockInfo(c, o, id) {
  const ids = allIds(o), i = ids.indexOf(id), P = progOf();
  if (!has(c)) return { open: false, why: "buy" };
  if (i === 0) return { open: true };
  if (isFull(c) || P[id]) return { open: true };
  if (!buyer(c) && liveAI(c)) return (S.live[c] || new Set()).has(id) ? { open: true } : { open: false, why: "live" };
  const prev = P[ids[i - 1]]; if (!prev) return { open: false, why: "prev" };
  if (!slot()) return { open: false, why: "slot" };
  const at = slotTimeAfter(prev.ts || 0); return at <= Date.now() ? { open: true } : { open: false, why: "time", at };
}
const fmtAt = ms => new Date(ms).toLocaleString(LANG === "en" ? "en-IN" : LANG === "ur" ? "ur-IN" : "hi-IN", { weekday: "long", hour: "numeric", minute: "2-digit" });

/* ============ header, watermark, protection ============ */
function applyLang() {
  document.documentElement.lang = LANG; document.documentElement.dir = LANG === "ur" ? "rtl" : "ltr";
  document.body.className = LANG === "en" ? "" : LANG;
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === LANG));
  $$("[data-t]").forEach(e => e.textContent = t(e.dataset.t)); $$("[data-ph]").forEach(e => e.placeholder = t(e.dataset.ph));
}
$$("[data-lang]").forEach(b => b.onclick = () => { LANG = b.dataset.lang; LS.set("qsai-lang", LANG); applyLang(); renderWho(); route(); });
function renderWho() {
  const w = $("#who");
  if (S.user) { const n = (S.user.displayName || S.user.email || "?").trim();
    w.innerHTML = `<a class="btn sm" href="#offline" title="${t("offline")}">⬇</a><span class="av">${S.user.photoURL ? `<img src="${esc(S.user.photoURL)}" alt="">` : esc(n[0].toUpperCase())}</span><button class="btn sm" id="lo">${t("logout")}</button>`;
    $("#lo").onclick = () => auth.signOut(); }
  else { w.innerHTML = `<button class="btn sm pri" id="li">${t("login")}</button>`; $("#li").onclick = () => loginBox(); }
}
function drawMark() {
  const m = $("#mark"); if (!m) return;
  const who = S.user ? `${S.doc.code || ""} ${S.user.email || ""}`.trim() : "";
  m.innerHTML = who ? Array.from({ length: 18 }, () => `<span>${esc(who)}</span>`).join("") : "";
}
document.addEventListener("contextmenu", e => { if (e.target.closest(".stage,.bigar,audio,video,canvas")) e.preventDefault(); });
document.addEventListener("dragstart", e => e.preventDefault());
function modal(html) { const m = document.createElement("div"); m.className = "modal"; m.innerHTML = `<div class="box">${html}</div>`; m.onclick = e => { if (e.target === m) m.remove(); }; document.body.appendChild(m); return m; }
function loginBox(after) {
  const m = modal(`<h3>${t("login")}</h3><p class="mini">${t("loginWhy")}</p>
   <button class="btn pri" id="g" style="width:100%;margin:8px 0">${t("google")}</button>
   <form id="ef" style="display:grid;gap:8px;margin-top:8px"><input class="btn" style="text-align:start" type="email" name="e" placeholder="${t("emailL")}" required autocomplete="email">
   <input class="btn" style="text-align:start" type="password" name="p" placeholder="${t("passL")}" required autocomplete="current-password"><button class="btn">${t("emailBtn")}</button></form>
   <p class="mini" style="margin-top:12px">${t("mobileHint")} <a href="/#learn">quranicscience.info</a></p>`);
  $("#g", m).onclick = async () => { try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); m.remove(); after && after(); } catch (e) { toast(e.message || "Login failed"); } };
  $("#ef", m).onsubmit = async e => { e.preventDefault(); const f = e.target; try { await auth.signInWithEmailAndPassword(f.e.value.trim(), f.p.value); m.remove(); after && after(); } catch (er) { toast("Email or password is wrong."); } };
}

/* ============ views ============ */
function route() {
  stopAll(); if (typeof CL !== "undefined" && !/^#lesson=/.test(location.hash)) { CL.on = false; clearInterval(CL.tick); document.body.classList.remove("incls"); }
  const h = (location.hash || "#home").slice(1), [v, a] = h.split("=");
  if (v === "editing" || v === "content" || v === "design") return viewCourse(v);
  if (v === "lesson" && a) return viewLesson(a);
  if (v === "cert" && a) return viewCert(a);
  if (v === "offline") return viewOffline();
  if (v === "keys") return viewKeys();
  if (v === "lab") return viewLab();
  if (v === "plan") return viewPlan(a || "editing");
  return viewHome();
}
addEventListener("hashchange", route);
const priceHTML = c => `<div class="price"><b>${rupee(COURSES[c].inr)}</b><small>· <bdi dir="ltr">$${COURSES[c].usd}</bdi> ${t("intl")}</small></div>`;
async function viewHome() {
  const app = $("#app");
  const [ot, oa, og] = await Promise.all([outline("editing"), outline("content"), outline("design")]);
  const st = { editing: stats("editing", ot), content: stats("content", oa), design: stats("design", og) };
  const card = (c, desc) => {
    const s = st[c], own = c === "combo" ? (has("editing") && has("content")) : has(c), full = c === "combo" ? isFull("editing") && isFull("content") : isFull(c);
    return `<article class="cc">${c === "combo" ? `<span class="badge">${t("best")}</span>` : full && own ? `<span class="badge">${t("fullBadge")}</span>` : ""}<div class="arT">${COURSES[c].ar}</div><h3>${t(c)}</h3><p>${t(desc)}</p>${priceHTML(c)}
      ${c !== "combo" && liveOf(c) && !has(c) ? `<p class="mini">🎓 ${pick(ADDX.h)}: <b>${rupee(COURSES[c].aInr)}</b> · <bdi dir="ltr">$${COURSES[c].aUsd}</bdi> <button class="btn sm pri" data-addon="${c}">${pick(ADDX.b)}</button></p>` : ""}
      ${s && s.done ? `<div class="bar"><i style="width:${s.pct}%"></i></div><span class="mini">${t("progress")} ${num(s.pct)}% · ${t("score")} ${num(s.score)}%</span>` : ""}
      <div class="acts">${c !== "combo" ? `<a class="btn ${own || s.done ? "pri" : "cy"}" href="#${c}">${own || s.done ? t("open") : t("start")}</a>` : ""}${own ? "" : `<button class="btn ${c === "combo" ? "pri" : ""}" data-buy="${c}">${t("enroll")}</button>`}${full ? "" : `<button class="btn fullb" data-buy="${c}" data-full="1">${t("addFull")}</button>`}</div></article>`;
  };
  app.innerHTML = (typeof wayHTML === "function" ? wayHTML() : "") + `<section class="hero"><div><span class="eyebrow">✦ ${t("heroEy")}</span><h1>${t("hero1")} <em>${t("hero2")}</em></h1><p class="lead">${t("heroP")}</p>
    <div class="feat"><span>📚 ${t("f1")}</span><span>🔊 ${t("f2")}</span><span>🛠️ ${t("f3")}</span><span>🤖 ${t("f4")}</span><span>🎓 ${t("f5")}</span></div></div>
    <div class="orb"><img src="icon-512.png" alt="Quranic Science AI"></div></section>
    ${isOwner() ? `<p class="mini">⭐ ${t("owner")}</p>` : ""}
    <section class="sec" id="aic"><h2>${t("courses")}</h2><div class="cards">${card("editing", "dT")}${card("content", "dA")}${card("combo", "dC")}${has("design") ? card("design", "dD") : ""}</div></section>
    <section class="sec"><div class="cards two"><div class="cc"><h3>📅 ${t("dailyT")}</h3><p>${t("dailyD")}</p></div><div class="cc"><h3>⚡ ${t("fullT")}</h3><p>${t("fullD")}</p></div></div></section>`;
  wireBuy(app);
}
/* a locked lesson: say when it opens, and offer Full Access (the price shows only after tapping it) */
function lockedBox(c, msg) {
  if (isFull(c)) return toast(msg);
  const m = modal(`<h3>🔒 ${esc(msg)}</h3><p class="mini">${t("fullWait")}</p><p class="mini">⚡ ${t("fullD")}</p><div class="acts" style="margin-top:10px"><button class="btn fullb" id="lbF">${t("addFull")}</button><button class="btn" id="lbX">OK</button></div>`);
  $("#lbF", m).onclick = () => { m.remove(); buy(c, true); }; $("#lbX", m).onclick = () => m.remove();
}
function wireBuy(root) { $$("[data-buy]", root).forEach(b => b.onclick = () => buy(b.dataset.buy, !!b.dataset.full)); }
function buy(c, fullOnly) {
  const C = COURSES[c], go = () => {
    const owned = c === "combo" ? has("editing") && has("content") : has(c);
    const line = (label, inr, usd, link, linkI) => `<div class="opt"><b>${label}</b><span>${rupee(inr)} · <bdi dir="ltr">$${usd}</bdi></span>
      ${link ? `<a class="btn pri sm" href="${link}" target="_blank" rel="noopener">${t("enroll")} – India</a>` : ""}${linkI ? `<a class="btn sm" href="${linkI}" target="_blank" rel="noopener">${t("intl")}</a>` : ""}
      <a class="btn cy sm" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Assalamu Alaikum, I want "${TX.en[c]}" – ${label === t("fullT") ? "Full Access add-on" : "course"} (₹${inr} / $${usd}). My email: ${S.user ? S.user.email || "" : ""}`)}">${t("payWa")}</a></div>`;
    const m = modal(`<h3>${t(c)}</h3><p class="mini">${t("payNote")}</p><div style="display:grid;gap:10px;margin-top:10px">
      ${owned || fullOnly ? "" : line(t("dailyT"), C.inr, C.usd, C.pay, C.payIntl)}
      ${owned ? line(t("fullT"), C.fInr, C.fUsd, C.payFull, C.payFullIntl) : fullOnly ? `<p class="mini"><b>1.</b> ${t("dailyT")}</p>` + line(t("dailyT"), C.inr, C.usd, C.pay, C.payIntl) + `<p class="mini"><b>2.</b> ${t("fullT")} (+)</p>` + line(t("fullT"), C.fInr, C.fUsd, C.payFull, C.payFullIntl) + `<p class="mini">= ${rupee(C.inr + C.fInr)} · <bdi dir="ltr">$${C.usd + C.fUsd}</bdi></p>` : line(t("fullT") + " (" + t("dailyT") + " + " + t("fullT") + ")", C.inr + C.fInr, C.usd + C.fUsd, "", "")}
      <p class="mini">⚡ ${t("fullD")}</p></div>`);
    if (S.user && db) db.collection("users").doc(S.user.uid).set({ lastEnroll: { course: fullOnly ? C.full : C.key, ts: Date.now() } }, { merge: true }).catch(() => {});
  };
  S.user ? go() : loginBox(go);
}
function slotBox(after) {
  if (slot()) return after && after();
  const opts = Array.from({ length: 48 }, (_, i) => { const h = String(Math.floor(i / 2)).padStart(2, "0"), m = i % 2 ? "30" : "00"; return `<option value="${h}:${m}" ${h + ":" + m === "20:00" ? "selected" : ""}>${new Date(2000, 0, 1, +h, +m).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</option>`; }).join("");
  const m = modal(`<h3>⏰ ${t("slotH")}</h3><p class="mini" style="color:#ffd9a0">⚠️ ${t("slotP")}</p>
    <label class="mini">${t("slotTime")}</label><select class="btn" id="st" style="width:100%;margin:4px 0 10px">${opts}</select>
    <label class="mini">${t("slotOff")}</label><select class="btn" id="so" style="width:100%;margin:4px 0 14px">${DAYS[LANG].map((d, i) => `<option value="${i}" ${i === 0 ? "selected" : ""}>${d}</option>`).join("")}</select>
    <button class="btn pri" id="ss" style="width:100%">${t("slotSave")}</button>`);
  $("#ss", m).onclick = async () => { await saveUser({ aiSlot: { t: $("#st", m).value, off: +$("#so", m).value, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "", at: Date.now() } }); m.remove(); after && after(); };
}
async function viewCourse(c) {
  const app = $("#app"), o = await outline(c), P = progOf(), ids = allIds(o);
  if (has(c) && S.user) { try { await courseKey(c); } catch (e) {} }
  if (liveAI(c) && !buyer(c)) await liveOpen(c);
  if (buyer(c) && !isFull(c) && !isOwner() && !slot()) slotBox(() => route());
  const s = stats(c, o), cur = ids.find(id => !P[id]), sl = slot();
  app.innerHTML = (liveAI(c) && !buyer(c) ? `<p class="livenote">🎓 ${pick(LIVEX.note)}</p>` : liveOf(c) && !has(c) ? addonHTML(c) : "") + (isTeacherOf(c) || isOwner() ? `<p class="livenote"><a href="#plan=${c}">📘 ${pick(LIVEX.plan)}</a></p>` : "") + `<div class="chead"><div class="ring" style="--p:${s.pct}"><span>${num(s.pct)}%</span></div>
    <div style="flex:1;min-width:200px"><div class="arT ar" style="font-size:24px;color:var(--gold2)">${COURSES[c].ar}</div><h2 style="margin:0">${t(c)} ${isFull(c) && has(c) ? `<span class="tagf">${t("fullBadge")}</span>` : ""}</h2>
    <div class="stats" style="margin-top:8px"><div class="stat"><b>${num(s.done)}/${num(s.total)}</b><small>${t("lessons")}</small></div><div class="stat"><b>${num(s.score)}%</b><small>${t("score")}</small></div>
    <a class="stat" href="#cert=${c}" style="text-decoration:none;color:inherit"><b>🎓</b><small>${t("cert")}</small></a>
    ${sl && has(c) && !isFull(c) ? `<div class="stat"><b>⏰ ${esc(new Date(2000, 0, 1, ...sl.t.split(":").map(Number)).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }))}</b><small>${t("slotIs")} · ${DAYS[LANG][sl.off]} ${t("offIs")}</small></div>` : ""}</div></div>
    <div class="acts">${has(c) ? "" : `<button class="btn pri" data-buy="${c}">${t("enroll")} · ${rupee(COURSES[c].inr)}</button>`}${isFull(c) ? "" : `<button class="btn fullb" data-buy="${c}" data-full="1">${t("addFull")}</button>`}</div></div>
    ${has(c) ? "" : `<p class="mini">🔓 ${t("buyFirst")}</p>`}
    <div>${o.weeks.map((w, wi) => `<details class="week" ${w.days.some(d => d.id === cur) || (!cur && wi === 0) ? "open" : ""}><summary><span class="wkn">${t("week")} ${num(wi + 1)}</span>
      <span class="wkt"><b>${esc(pick(w.title))}</b><small>${esc(pick(w.goal))}</small></span><span class="mini">${num(w.days.filter(d => P[d.id]).length)}/${num(w.days.length)}</span></summary>
      <div class="days">${w.days.map((d, di) => { const done = P[d.id], L = d.ready ? lockInfo(c, o, d.id) : { open: false, why: "soon" };
        const cls = done ? "done" : !d.ready ? "soon" : !L.open ? "lock" : d.id === cur ? "cur" : "";
        const note = done ? `${t("score")} ${num(done.s)}/${num(done.n)}` : !d.ready ? t("soon") : L.why === "time" ? "⏰ " + fmtAt(L.at) : L.why === "live" ? "🎓 " + pick(LIVEX.short) : !L.open ? "🔒" : "";
        return `<button class="day ${cls}" data-l="${d.id}" data-why="${L.open ? "" : L.why}" data-at="${L.at || ""}"><small>${t("day")} ${num(d.n || di + 1)}</small><span>${esc(pick(d.title))}</span><em>${note}</em></button>`; }).join("")}</div></details>`).join("")}</div>
    <section class="sec" id="hwList"></section>`;
  wireBuy(app);
  $$(".day", app).forEach(b => b.onclick = () => {
    const w = b.dataset.why;
    if (w === "soon") return toast(t("soon"));
    if (w === "buy") { toast(t("buyFirst")); return buy(c); }
    if (w === "prev") return lockedBox(c, t("locked"));
    if (w === "slot") return slotBox(() => route());
    if (w === "time") return lockedBox(c, t("waitSlot") + ": " + fmtAt(+b.dataset.at));
    location.hash = "lesson=" + b.dataset.l;
  });
  if (S.user) myHomework(c);
}

/* ============ audio ============ */
let voiceEl = null, qariEl = null, rec = null, recUrl = null, recChunks = [];
function stopAll() { [voiceEl, qariEl].forEach(a => { try { a && a.pause(); } catch (e) {} }); if (rec && rec.state === "recording") try { rec.stop(); } catch (e) {} $$(".playing").forEach(e => e.classList.remove("playing")); }
async function playVoice() {
  stopAll(); const { id, i, data } = LESSON, m = data && data.moments[i]; if (!m) return;
  let src = null; try { src = await voiceSrc(id, i + 1); } catch (e) {}
  const box = $("#vo"), after = () => { box && box.classList.remove("playing"); };
  if (!src) return after();
  voiceEl = new Audio(src); box && box.classList.add("playing");
  voiceEl.onended = after; voiceEl.onerror = () => box && box.classList.remove("playing");
  voiceEl.play().catch(() => box && box.classList.remove("playing"));
}
/* the Arabic words of a moment, read by a native Arabic voice (ElevenLabs) */
async function playArabic(btn) {
  const { id, i } = LESSON; stopAll(); let src = null; try { src = await voiceSrc(id, (i + 1) + "a"); } catch (e) {}
  if (!src) return; btn = btn || $("#ab"); btn && btn.classList.add("playing");
  let left = S.rep || 1; voiceEl = new Audio(src);
  voiceEl.onended = () => { if (--left > 0 && btn && btn.classList.contains("playing")) setTimeout(() => voiceEl.play().catch(() => {}), 500); else btn && btn.classList.remove("playing"); };
  voiceEl.onerror = () => btn && btn.classList.remove("playing"); voiceEl.play().catch(() => btn && btn.classList.remove("playing"));
}
/* every letter has a real qari example word (word-by-word Qur'an audio) */
const LETTER = { "ء":[112,1,4],"ا":[1,4,1],"ب":[114,1,3],"ت":[1,7,3],"ث":[113,4,3],"ج":[110,1,2],"ح":[1,2,1],"خ":[114,4,4],"د":[112,3,2],"ذ":[1,7,2],"ر":[1,3,1],"ز":[99,1,2],"س":[1,5,4],"ش":[113,2,2],"ص":[112,2,2],"ض":[1,7,9],"ط":[105,3,3],"ظ":[94,3,3],"ع":[1,5,2],"غ":[1,7,5],"ف":[113,1,4],"ق":[112,1,1],"ك":[108,1,3],"ل":[112,3,1],"م":[1,4,1],"ن":[114,1,4],"ه":[112,1,2],"و":[112,4,1],"ي":[112,3,2] };
const ZONES = { jawf:[190,140,"ا و ي",{en:"Al-Jawf: empty space of mouth & throat",ur:"الجوف: منہ اور حلق کا خالی حصہ",hi:"अल-जौफ़: मुँह और हल्क़ का ख़ाली हिस्सा"}],
  h1:[98,226,"ء ه",{en:"Deepest throat",ur:"اقصیٰ حلق (سب سے گہرا)",hi:"अक़्सा-ए-हल्क़ (सबसे गहरा)"}], h2:[101,192,"ع ح",{en:"Middle of the throat",ur:"وسطِ حلق (درمیان)",hi:"वस्ते-हल्क़ (बीच)"}], h3:[106,160,"غ خ",{en:"Top of the throat",ur:"ادنیٰ حلق (منہ کے قریب)",hi:"अदना-ए-हल्क़ (मुँह के क़रीब)"}],
  l1:[132,150,"ق",{en:"Very back of the tongue + soft palate",ur:"زبان کی جڑ + نرم تالو",hi:"ज़बान की जड़ + नर्म तालू"}], l2:[152,145,"ك",{en:"Back of the tongue, a little forward",ur:"زبان کی جڑ، ق سے تھوڑا آگے",hi:"ज़बान की जड़, क़ाफ़ से थोड़ा आगे"}],
  l3:[200,140,"ج ش ي",{en:"Middle of the tongue + palate",ur:"زبان کا درمیان + تالو",hi:"ज़बान का बीच + तालू"}], l4:[228,156,"ض",{en:"Side of the tongue + upper back teeth",ur:"زبان کا کنارہ + اوپر کی داڑھیں",hi:"ज़बान का किनारा + ऊपर की दाढ़ें"}],
  l5:[252,145,"ل ن ر",{en:"Edge and tip of the tongue",ur:"زبان کا کنارہ اور نوک",hi:"ज़बान का किनारा और नोक"}], l6:[268,136,"ط د ت",{en:"Tip + gum of upper front teeth",ur:"نوک + اوپر کے دانتوں کی جڑ",hi:"नोक + ऊपर के दाँतों की जड़"}],
  l7:[272,158,"ص س ز",{en:"Tip near the lower front teeth (whistle)",ur:"نوک + نیچے کے دانت (صفیر)",hi:"नोक + नीचे के दाँत (सफ़ीर)"}], l8:[285,146,"ظ ذ ث",{en:"Tip + edges of upper front teeth",ur:"نوک + اوپر کے دانتوں کے کنارے",hi:"नोक + ऊपर के दाँतों के किनारे"}],
  s1:[300,160,"ف",{en:"Lower lip + upper front teeth",ur:"نچلا ہونٹ + اوپر کے دانت",hi:"नीचे का होंठ + ऊपर के दाँत"}], s2:[312,147,"ب م و",{en:"Both lips",ur:"دونوں ہونٹ",hi:"दोनों होंठ"}],
  kh:[230,92,"غُنَّة",{en:"Al-Khayshum: the nose (ghunnah)",ur:"الخیشوم: ناک (غنہ)",hi:"अल-ख़ैशूम: नाक (ग़ुन्ना)"}] };
const RL = { nose: { en: "nose", ur: "ناک", hi: "नाक" }, throat: { en: "throat", ur: "حلق", hi: "हल्क़" }, tongue: { en: "tongue", ur: "زبان", hi: "ज़बान" }, lips: { en: "lips", ur: "ہونٹ", hi: "होंठ" } };
/* zone positions on makharij.webp (1000×1000) and where their letter label sits */
const ZXY = { jawf:[560,432], h1:[352,765], h2:[305,640], h3:[332,505], l1:[420,505], l2:[485,478], l3:[590,458], l4:[690,478], l5:[742,500], l6:[790,468], l7:[786,535], l8:[818,496], s1:[842,512], s2:[872,488], kh:[680,268] };
const ZL = { h1:[160,770], h2:[130,640], h3:[150,505], l1:[420,610], l2:[470,380], l3:[590,370], l4:[640,600], l5:[700,620], l6:[870,340], l7:[890,620], l8:[905,420], s1:[905,650], s2:[905,420], kh:[680,140] };
const GCOL = ["#2cc4f2", "#f6a53c", "#3fcf8e", "#ff6b6b", "#b9a99b"];
function lettersQ(str) { return [...str].filter(ch => LETTER[ch]).map(ch => ({ s: LETTER[ch][0], a: LETTER[ch][1], w: LETTER[ch][2] })); }
function visualHTML(v) {
  if (!v) return "";
  if (v.t === "mouth") {
    const on = new Set(v.on), many = on.size > 4;
    const marks = Object.entries(ZONES).map(([k, z]) => { const [x, y] = ZXY[k];
      if (!on.has(k)) return `<g class="zon" data-z="${k}"><circle cx="${x}" cy="${y}" r="26" class="zhit"/><circle cx="${x}" cy="${y}" r="9" class="zd"/></g>`;
      if (k === "jawf") return `<g class="zon" data-z="${k}"><ellipse cx="${x}" cy="${y}" rx="190" ry="48" class="jawf"/>${many ? "" : `<g class="pill"><rect x="${x - 70}" y="${y - 40}" width="140" height="64" rx="32"/><text x="${x}" y="${y + 6}">${z[2]}</text></g>`}</g>`;
      const lx = ZL[k] ? ZL[k][0] : x, ly = ZL[k] ? ZL[k][1] : y - 90, w = Math.max(90, z[2].replace(/\s/g, "").length * 34 + 50);
      return `<g class="zon" data-z="${k}"><circle cx="${x}" cy="${y}" r="${many ? 16 : 24}" class="zg"/>${many ? "" : `<line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" class="ld"/><g class="pill"><rect x="${lx - w / 2}" y="${ly - 36}" width="${w}" height="64" rx="32"/><text x="${lx}" y="${ly + 10}">${z[2]}</text></g>`}</g>`; }).join("");
    return labHTML(on) + `<details class="mkimg"><summary>🖼️ ${pick(LABX.pic)}</summary><figure class="viz mouth"><div class="mk"><img src="makharij.webp" alt="" draggable="false"><svg viewBox="0 0 1000 1000" role="img" aria-label="makharij">${marks}</svg></div>
      <figcaption><button class="zchip zplay">▶ ${t("playAll")}</button>${[...on].map(k => `<button class="zchip" data-z="${k}"><b class="ar">${ZONES[k][2]}</b><span>${esc(pick(ZONES[k][3]))}</span> 🔊</button>`).join("")}</figcaption></figure></details>`;
  }
  if (v.t === "groups") return `<figure class="viz groups">${v.g.map(g => `<button class="grp" style="--gc:${GCOL[g[4] || 0]}" data-l="${esc(g[3])}"><span class="gl">${esc(pick({ en: g[0], ur: g[1], hi: g[2] }))}</span><b class="ar">${esc(g[3])}</b></button>`).join("")}</figure>`;
  if (v.t === "cards") return `<figure class="viz cards">${v.c.map(c => `<div class="vc"><span class="em">${c[0]}</span><b class="ar">${esc(c[1])}</b><small>${esc(pick({ en: c[2], ur: c[3], hi: c[4] }))}</small></div>`).join("")}</figure>`;
  return "";
}
function tilesHTML(ar, wq, aw) {
  const W = {}, A = aw || {}; (wq || []).forEach(x => W[x[0]] = x.slice(1));
  const one = w => W[w] ? { s: W[w][0], a: W[w][1], w: W[w][2] } : A[w] ? { k: A[w] } : null;
  const word = w => { if (W[w]) return `<button class="tile qw" data-q="${W[w].join(",")}">${esc(w)}</button>`;
    if (A[w]) return `<button class="tile qw aw" data-k="${A[w]}">${esc(w)}</button>`;
    const core = w.replace(/[\u064B-\u0652\u0670]/g, "");
    if (LETTER[core]) return `<button class="tile ltr" data-c="${core}">${esc(w)}</button>`;
    if (core.length === 2 && /^[اأإء]/.test(core) && LETTER[core[1]]) return `<button class="tile ltr" data-c="${core[1]}">${esc(w)}</button>`;
    return esc(w); };
  const phrase = p => { const t = p.trim(), toks = t.match(/[\u0621-\u0652\u0670\u0671]+/g) || [], key = t.replace(/\s+/g, " ");
    let seq = null;
    if (toks.length > 1) { if (A[key]) seq = [{ k: A[key] }]; else { const s = toks.map(one).filter(Boolean); if (s.length > 1) seq = s; } }
    const play = seq ? `<button class="tp" data-seq='${JSON.stringify(seq)}' aria-label="play">🔊</button>` : "";
    return `<span class="tile">${t.split(/(\s+)/).map(x => /\s/.test(x) ? x : word(x)).join("")}${play}</span>`; };
  return `<div class="bigar">${ar.split("\n").map(line => `<div class="trow">${line.split(/\s*·\s*/).map(phrase).join("")}</div>`).join("")}</div>`;
}
/* everything Arabic on the screen, in reading order (for the big listen button) */
function screenSeq(root) {
  const out = []; $$(".bigar .tile:not(.qw):not(.ltr)", root).forEach(t => { const tp = $(".tp", t);
    if (tp) out.push(...JSON.parse(tp.dataset.seq)); else $$(".qw", t).forEach(b => out.push(b.dataset.k ? { k: b.dataset.k } : (([s, a, w]) => ({ s, a, w }))(b.dataset.q.split(",").map(Number)))); });
  return out;
}
function wireVisuals(root) {
  $$(".zchip[data-z],.zon", root).forEach(b => b.onclick = async () => { const z = b.dataset.z, g = $(`.zon[data-z="${z}"]`, root);
    g && g.classList.add("hot"); await playQari(lettersQ(ZONES[z][2]).slice(0, 3), b.classList.contains("zchip") ? b : null); g && g.classList.remove("hot"); });
  $$(".zplay", root).forEach(b => b.onclick = async () => { b.classList.add("playing");
    for (const c of $$(".zchip[data-z]", root)) { if (!b.classList.contains("playing")) break; const z = c.dataset.z, g = $(`.zon[data-z="${z}"]`, root);
      g && g.classList.add("hot"); c.classList.add("on"); await playQari(lettersQ(ZONES[z][2]).slice(0, 2), null); g && g.classList.remove("hot"); c.classList.remove("on"); b.classList.add("playing"); }
    b.classList.remove("playing"); });
  $$(".grp", root).forEach(b => b.onclick = () => playQari(lettersQ(b.dataset.l).slice(0, 4), b));
  const LB = wireLab(root);
  $$(".tile.ltr", root).forEach(b => b.onclick = () => (LB && LB.say(b.dataset.c, b)) || playQari(lettersQ(b.dataset.c), b));
  $$(".tile.qw", root).forEach(b => b.onclick = () => { if (b.dataset.k) return playQari([{ k: b.dataset.k }], b); const [s, a, w] = b.dataset.q.split(",").map(Number); playQari([{ s, a, w }], b); });
  $$(".tp", root).forEach(b => b.onclick = () => playQari(JSON.parse(b.dataset.seq), b));
}

/* ============ live class ↔ AI course: same syllabus, same day ============ */
const LIVEX = {
  wait: { en: "This lesson opens on the day of your live class.", ur: "یہ سبق آپ کی لائیو کلاس کے دن کھلے گا۔", hi: "यह सबक़ आपकी लाइव क्लास के दिन खुलेगा।" },
  short: { en: "with live class", ur: "لائیو کلاس کے ساتھ", hi: "लाइव क्लास के साथ" },
  note: { en: "You are in our live class with AI practice. The same lesson as your class opens here on the same day: practise with the qari, the quiz and homework.", ur: "آپ ہماری لائیو کلاس میں ہیں۔ آپ کی کلاس والا سبق اسی دن یہاں کھلتا ہے: قاری صاحب کے ساتھ مشق، سوال اور ہوم ورک۔", hi: "आप हमारी लाइव क्लास में हैं। आपकी क्लास वाला सबक़ उसी दिन यहाँ खुलता है: क़ारी साहब के साथ मश्क़, सवाल और होमवर्क।" },
  plan: { en: "Teacher's lesson plan", ur: "استاد کا سبق پلان", hi: "उस्ताद का सबक़ प्लान" },
  planP: { en: "Teach each live class from the AI lesson of the same day, so live and AI students learn exactly the same thing. Open a day to see its points, Arabic, qari references, questions and homework.", ur: "ہر لائیو کلاس اسی دن کے AI سبق سے پڑھائیں، تاکہ لائیو اور AI دونوں طالب علم بالکل ایک ہی چیز سیکھیں۔ کوئی دن کھولیں: نکات، عربی، قاری کے حوالے، سوال اور ہوم ورک۔", hi: "हर लाइव क्लास उसी दिन के AI सबक़ से पढ़ाएँ, ताकि लाइव और AI दोनों तालिब-ए-इल्म बिल्कुल एक ही चीज़ सीखें। कोई दिन खोलें: नुक़्ते, अरबी, क़ारी के हवाले, सवाल और होमवर्क।" },
  cls: { en: "Live class", ur: "لائیو کلاس", hi: "लाइव क्लास" }, ans: { en: "Answer", ur: "جواب", hi: "जवाब" },
  only: { en: "This page is for teachers of the live course and the owner.", ur: "یہ صفحہ لائیو کورس کے استادوں اور مالک کے لیے ہے۔", hi: "यह पेज लाइव कोर्स के उस्तादों और मालिक के लिए है।" } };
async function viewPlan(c) {
  const app = $("#app"); if (!COURSES[c] || c === "combo") c = "editing";
  if (!S.user) return loginBox(() => route());
  if (!isOwner() && !isTeacherOf(c)) { app.innerHTML = `<section class="sec"><h2>📘 ${pick(LIVEX.plan)}</h2><p>${pick(LIVEX.only)}</p></section>`; return; }
  const o = await outline(c); let n = 0;
  app.innerHTML = `<section class="sec"><div class="seg" style="width:max-content;margin-bottom:10px">${["editing", "content"].filter(k => isOwner() || isTeacherOf(k)).map(k => `<button aria-pressed="${k === c}" onclick="location.hash='plan=${k}'">${t(k)}</button>`).join("")}</div>
    <h2>📘 ${pick(LIVEX.plan)} · ${t(c)}</h2><p class="lead">${pick(LIVEX.planP)}</p>
    ${o.weeks.map((w, wi) => `<div class="week"><div style="padding:12px 14px"><b>${t("week")} ${num(wi + 1)} · ${esc(pick(w.title))}</b><p class="mini">${esc(pick(w.goal))}</p></div>
      ${w.days.map(d => { n++; return `<details class="pday" data-id="${d.id}" ${d.ready ? "" : "disabled"}><summary><b>${pick(LIVEX.cls)} ${num(n)}</b> · ${esc(pick(d.title))} ${d.ready ? "" : "· " + t("soon")}</summary><div class="pbody mini">…</div></details>`; }).join("")}</div>`).join("")}</section>`;
  $$(".pday", app).forEach(dt => dt.ontoggle = async () => {
    if (!dt.open || dt.dataset.done) return; dt.dataset.done = 1; const body = $(".pbody", dt);
    let L = null; try { L = await lessonData(dt.dataset.id); } catch (e) {}
    if (!L) { body.textContent = t("soon"); return; }
    body.innerHTML = `<ol class="plist">${L.moments.map(m => `<li><p>${esc(pick(m))}</p>${m.ar ? `<p class="ar" style="font-size:24px;line-height:1.9">${esc(m.ar).replace(/\n/g, "<br>")}</p>` : ""}${m.q ? `<p>🕋 ${m.q.map(q => q.w ? `${q.s}:${q.a} (${q.w})` : `${q.s}:${q.a}`).join(" · ")}</p>` : ""}</li>`).join("")}</ol>
      ${(L.quiz || []).length ? `<h4>❓ ${pick({ en: "Questions", ur: "سوالات", hi: "सवालात" })}</h4><ol>${L.quiz.map(q => `<li>${esc(pick(q.q))}<br>✓ <b>${esc(pick(q.o[q.a]))}</b></li>`).join("")}</ol>` : ""}
      <p><a class="btn sm cy" href="#lesson=${L.id}">▶ ${t("open")}</a></p>`;
  });
}

const ADDX = {
  h: { en: "For our live-class students", ur: "ہماری لائیو کلاس کے طلبہ کے لیے", hi: "हमारी लाइव क्लास के तलबा के लिए" },
  p: { en: "Add AI practice to your live class: the same lesson as your class opens here on the same day, with the qari, the Makharij animation, quizzes and homework that goes to your teacher.", ur: "اپنی لائیو کلاس کے ساتھ AI مشق جوڑیں: آپ کی کلاس والا سبق اسی دن یہاں کھلے گا، قاری صاحب، مخارج اینیمیشن، سوالات اور ہوم ورک کے ساتھ جو آپ کے استاد کو جائے گا۔", hi: "अपनी लाइव क्लास के साथ AI मश्क़ जोड़ें: आपकी क्लास वाला सबक़ उसी दिन यहाँ खुलेगा, क़ारी साहब, मख़ारिज एनिमेशन, सवालात और होमवर्क के साथ जो आपके उस्ताद को जाएगा।" },
  b: { en: "Add AI practice", ur: "AI مشق شامل کریں", hi: "AI मश्क़ शामिल करें" },
  both: { en: "Both courses (Tajweed + Arabic)", ur: "دونوں کورس (تجوید + عربی)", hi: "दोनों कोर्स (तजवीद + अरबी)" } };
function addonHTML(c) { const C = COURSES[c];
  return `<div class="livenote"><b>🎓 ${pick(ADDX.h)}</b><p style="margin:6px 0">${pick(ADDX.p)}</p><p style="margin:0 0 8px"><b>${rupee(C.aInr)}</b> · <bdi dir="ltr">$${C.aUsd}</bdi></p><button class="btn pri sm" data-addon="${c}">${pick(ADDX.b)}</button></div>`; }
function buyAddon(c) {
  const go = () => { const both = liveOf("editing") && liveOf("content");
    const line = (k, label) => { const C = COURSES[k]; return `<div class="opt"><b>${label}</b><span>${rupee(C.aInr)} · <bdi dir="ltr">$${C.aUsd}</bdi></span>
      ${C.aPay ? `<a class="btn pri sm" href="${C.aPay}" target="_blank" rel="noopener">${t("enroll")} – India</a>` : ""}${C.aPayIntl ? `<a class="btn sm" href="${C.aPayIntl}" target="_blank" rel="noopener">${t("intl")}</a>` : ""}
      <a class="btn cy sm" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Assalamu Alaikum, I am a live-class student. I want the AI practice add-on: ${label} (₹${C.aInr} / $${C.aUsd}). My email: ${S.user ? S.user.email || "" : ""}`)}">${t("payWa")}</a></div>`; };
    modal(`<h3>🎓 ${pick(ADDX.b)}</h3><p class="mini">${pick(ADDX.p)}</p><div style="display:grid;gap:10px;margin-top:10px">${line(c, t(c))}${both ? line("combo", pick(ADDX.both)) : ""}</div>`);
    if (S.user && db) db.collection("users").doc(S.user.uid).set({ lastEnroll: { course: COURSES[c].addon, ts: Date.now() } }, { merge: true }).catch(() => {}); };
  S.user ? go() : loginBox(go);
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-addon]"); if (b) buyAddon(b.dataset.addon); });

/* ============ Makharij Lab: live animation of tongue, lips, jaw, throat and nose ============ */
const HOW = {
  jawf: { en: "Mouth open, tongue low. The sound comes from the empty space of mouth and throat; nothing touches.", ur: "منہ کھلا، زبان نیچے۔ آواز منہ اور حلق کے خالی حصے سے نکلتی ہے، کچھ نہیں ٹکراتا۔", hi: "मुँह खुला, ज़बान नीचे। आवाज़ मुँह और हल्क़ के ख़ाली हिस्से से निकलती है, कुछ नहीं टकराता।" },
  h1: { en: "Nothing moves in the mouth. The sound starts at the voice box, deepest in the throat.", ur: "منہ میں کچھ نہیں ہلتا۔ آواز سب سے گہرے حلق، آواز کی ڈوریوں سے شروع ہوتی ہے۔", hi: "मुँह में कुछ नहीं हिलता। आवाज़ सबसे गहरे हल्क़, आवाज़ की डोरियों से शुरू होती है।" },
  h2: { en: "Tighten the middle of the throat; the root of the tongue pulls back a little.", ur: "حلق کے درمیان کو تنگ کریں؛ زبان کی جڑ تھوڑی پیچھے جاتی ہے۔", hi: "हल्क़ के बीच को तंग करें; ज़बान की जड़ थोड़ी पीछे जाती है।" },
  h3: { en: "The back of the tongue rises towards the top of the throat and the air rubs there.", ur: "زبان کا پچھلا حصہ حلق کے اوپری حصے کی طرف اٹھتا ہے اور ہوا وہاں رگڑ کھاتی ہے۔", hi: "ज़बान का पिछला हिस्सा हल्क़ के ऊपरी हिस्से की तरफ़ उठता है और हवा वहाँ रगड़ खाती है।" },
  l1: { en: "The very back of the tongue presses the soft palate, then lets go.", ur: "زبان کی بالکل جڑ نرم تالو سے لگتی ہے، پھر چھوٹتی ہے۔", hi: "ज़बान की बिल्कुल जड़ नर्म तालू से लगती है, फिर छूटती है।" },
  l2: { en: "The back of the tongue, a little in front of qaaf, presses the palate.", ur: "زبان کی جڑ، ق سے تھوڑا آگے، تالو سے لگتی ہے۔", hi: "ज़बान की जड़, क़ाफ़ से थोड़ा आगे, तालू से लगती है।" },
  l3: { en: "The middle of the tongue rises to the middle of the palate.", ur: "زبان کا درمیانی حصہ تالو کے درمیان تک اٹھتا ہے۔", hi: "ज़बान का बीच वाला हिस्सा तालू के बीच तक उठता है।" },
  l4: { en: "The side of the tongue presses the upper back teeth (left, right or both), and the back of the tongue rises.", ur: "زبان کا کنارہ اوپر کی داڑھوں سے لگتا ہے (بائیں، دائیں یا دونوں)، اور زبان کی جڑ اٹھتی ہے۔", hi: "ज़बान का किनारा ऊपर की दाढ़ों से लगता है (बाएँ, दाएँ या दोनों), और ज़बान की जड़ उठती है।" },
  l5: { en: "The tip and edge of the tongue touch the gum just above the upper front teeth.", ur: "زبان کی نوک اور کنارہ اوپر کے سامنے والے دانتوں کے مسوڑھے سے لگتے ہیں۔", hi: "ज़बान की नोक और किनारा ऊपर के सामने वाले दाँतों के मसूड़े से लगते हैं।" },
  l6: { en: "The tip of the tongue presses the roots of the upper front teeth, then releases.", ur: "زبان کی نوک اوپر کے سامنے والے دانتوں کی جڑ سے لگتی ہے، پھر چھوٹتی ہے۔", hi: "ज़बान की नोक ऊपर के सामने वाले दाँतों की जड़ से लगती है, फिर छूटती है।" },
  l7: { en: "The tip of the tongue stays near the lower front teeth; the air whistles between the teeth.", ur: "زبان کی نوک نیچے کے سامنے والے دانتوں کے پاس، ہوا دانتوں کے بیچ سے سیٹی کی طرح نکلتی ہے۔", hi: "ज़बान की नोक नीचे के सामने वाले दाँतों के पास, हवा दाँतों के बीच से सीटी की तरह निकलती है।" },
  l8: { en: "The tip of the tongue touches the edges of the upper front teeth; the tongue comes slightly out.", ur: "زبان کی نوک اوپر کے سامنے والے دانتوں کے کناروں سے لگتی ہے؛ زبان تھوڑی باہر آتی ہے۔", hi: "ज़बान की नोक ऊपर के सामने वाले दाँतों के किनारों से लगती है; ज़बान थोड़ी बाहर आती है।" },
  s1: { en: "The inside of the lower lip touches the edges of the upper front teeth, and air passes.", ur: "نچلے ہونٹ کا اندرونی حصہ اوپر کے دانتوں کے کناروں سے لگتا ہے اور ہوا گزرتی ہے۔", hi: "नीचे वाले होंठ का अंदरूनी हिस्सा ऊपर के दाँतों के किनारों से लगता है और हवा गुज़रती है।" },
  s2: { en: "Both lips: firmly closed for baa and meem, rounded (not closed) for waw.", ur: "دونوں ہونٹ: ب اور م میں مضبوطی سے بند، و میں گول (بند نہیں)۔", hi: "दोनों होंठ: बा और मीम में मज़बूती से बंद, वाव में गोल (बंद नहीं)।" },
  kh: { en: "The air goes through the nose. Hold the ghunnah for two counts.", ur: "ہوا ناک سے نکلتی ہے۔ غنہ دو حرکت تک رکھیں۔", hi: "हवा नाक से निकलती है। ग़ुन्ना दो हरकत तक रखें।" } };
const LABX = {
  wordT: { en: "Learn a Qur'an word", ur: "قرآن کا لفظ سیکھیں", hi: "क़ुरआन का लफ़्ज़ सीखें" }, oneT: { en: "Or tap one letter", ur: "یا ایک حرف دبائیں", hi: "या एक हर्फ़ दबाएँ" },
  wordD: { en: "Tap a word: hear the qari, then see where each letter comes from.", ur: "لفظ دبائیں: قاری سے سنیں، پھر دیکھیں ہر حرف کہاں سے نکلتا ہے۔", hi: "लफ़्ज़ दबाएँ: क़ारी से सुनें, फिर देखें हर हर्फ़ कहाँ से निकलता है।" },
  s1: { en: "Where", ur: "کہاں سے", hi: "कहाँ से" }, s2: { en: "How", ur: "کیسے", hi: "कैसे" }, s3: { en: "Note", ur: "خاص بات", hi: "ख़ास बात" }, s4: { en: "Practice", ur: "مشق", hi: "मश्क़" },
  prac: { en: "Press Slow, watch the animation once, then say it with the qari 3 times. Check your mouth in a mirror.", ur: "آہستہ دبائیں، اینی میشن ایک بار دیکھیں، پھر قاری کے ساتھ تین بار بولیں۔ آئینے میں اپنا منہ دیکھیں۔", hi: "आहिस्ता दबाएँ, एनीमेशन एक बार देखें, फिर क़ारी के साथ तीन बार बोलें। आईने में अपना मुँह देखें।" },
  heavy: { en: " Heavy letter: the back of the tongue rises (isti'la).", ur: " پُر حرف: زبان کی جڑ اوپر اٹھتی ہے (استعلاء)۔", hi: " पुर हर्फ़: ज़बान की जड़ ऊपर उठती है (इस्तेअ़्ला)।" },
  ghunna: { en: " With ghunnah: the soft palate drops and air also flows through the nose.", ur: " غنہ کے ساتھ: نرم تالو نیچے آتا ہے اور ہوا ناک سے بھی نکلتی ہے۔", hi: " ग़ुन्ना के साथ: नर्म तालू नीचे आता है और हवा नाक से भी निकलती है।" },
  raa: { en: " For raa the tip curls slightly back.", ur: " را میں نوک تھوڑی پیچھے مڑتی ہے۔", hi: " रा में नोक थोड़ी पीछे मुड़ती है।" },
  tap: { en: "Tap a letter: watch the tongue, lips and throat move, and hear the qari.", ur: "کسی حرف کو دبائیں: زبان، ہونٹ اور حلق کو ہلتے دیکھیں اور قاری صاحب سے سنیں۔", hi: "किसी हर्फ़ को दबाएँ: ज़बान, होंठ और हल्क़ को हिलते देखें और क़ारी साहब से सुनें।" },
  slow: { en: "Slow", ur: "آہستہ", hi: "आहिस्ता" }, lbl: { en: "Labels", ur: "نام", hi: "नाम" },
  pic: { en: "Picture view", ur: "تصویر دیکھیں", hi: "तस्वीर देखें" },
  title: { en: "Makharij Lab", ur: "مخارج لیب", hi: "मख़ारिज लैब" },
  desc: { en: "A live animation: see where every Arabic letter comes from, how the tongue, lips and throat move, where they touch, and how the air flows. Free for everyone.", ur: "زندہ اینیمیشن: ہر عربی حرف کہاں سے نکلتا ہے، زبان، ہونٹ اور حلق کیسے ہلتے ہیں، کہاں لگتے ہیں اور ہوا کیسے بہتی ہے۔ سب کے لیے مفت۔", hi: "चलती हुई एनिमेशन: हर अरबी हर्फ़ कहाँ से निकलता है, ज़बान, होंठ और हल्क़ कैसे हिलते हैं, कहाँ लगते हैं और हवा कैसे बहती है। सबके लिए मुफ़्त।" } };
const LAB_ORDER = [["ء","h1"],["ه","h1"],["ع","h2"],["ح","h2"],["غ","h3"],["خ","h3"],["ق","l1"],["ك","l2"],["ج","l3"],["ش","l3"],["ي","l3"],["ض","l4"],["ل","l5"],["ن","l5"],["ر","l5"],["ط","l6"],["د","l6"],["ت","l6"],["ص","l7"],["س","l7"],["ز","l7"],["ظ","l8"],["ذ","l8"],["ث","l8"],["ف","s1"],["ب","s2"],["م","s2"],["و","s2"],["ا","jawf"],["غُنّة","kh"]];
const LAB_Z = Object.fromEntries(LAB_ORDER.filter(x => x[0].length === 1));
/* Lafz mode: a real Qur'an word, letter by letter (word audio from the word-by-word qari) */
const LAB_WORDS = [["بِسْمِ", 1, 1, 1, "بسم"], ["ٱلرَّحْمَٰنِ", 1, 1, 3, "رحمان"], ["ٱلْحَمْدُ", 1, 2, 1, "لحمد"], ["رَبِّ", 1, 2, 3, "رب"], ["نَعْبُدُ", 1, 5, 2, "نعبد"], ["قُلْ", 112, 1, 1, "قل"], ["أَحَدٌ", 112, 1, 4, "ءحد"]];
function labAudio(c) { return c === "غُنّة" ? [{ s: 108, a: 1, w: 1 }] : lettersQ(c); }
function labHTML(zones) {
  const items = LAB_ORDER.filter(([, z]) => !zones || zones.has(z));
  return `<figure class="viz mlab"><div class="mlwrap"><svg class="mlsvg" role="img" aria-label="makharij animation"></svg></div>
    <div class="mlside"><div class="mlcap"><b class="ar mlch"></b><span class="mlzt"></span><div class="mlhow"></div></div>
    <div class="mlctl"><button class="zchip mlall">▶ ${t("playAll")}</button><button class="zchip mlslow">🐢 ${pick(LABX.slow)}</button><button class="zchip mllbl on">🏷️ ${pick(LABX.lbl)}</button><button class="zchip mlrep">🔁 ×${S.rep || 1}</button></div>
    ${zones ? "" : `<div class="mlwords"><b>📖 ${pick(LABX.wordT)}</b><small>${pick(LABX.wordD)}</small><div class="mlwrow">${LAB_WORDS.map((w, i) => `<button class="mlw" data-i="${i}"><span class="ar">${w[0]}</span></button>`).join("")}</div></div>
    <b class="mlkh">🔤 ${pick(LABX.oneT)}</b>`}
    <div class="mlkeys">${items.map(([c, z]) => `<button class="mlk${c.length > 1 ? " wide" : ""}" data-c="${c}" data-z="${z}"><b class="ar">${c}</b></button>`).join("")}</div></div></figure>`;
}
function wireLab(root) {
  const fig = $(".mlab", root); if (!fig || !window.MLab) return null;
  const lab = (window.MLab3 && MLab3.ok() ? MLab3 : MLab).Lab($(".mlsvg", fig), LANG); let slow = false, lbl = true, busy = 0, all = false;
  const cap = (c, z) => { $(".mlch", fig).textContent = c || "";
    $(".mlzt", fig).textContent = z ? pick(ZONES[z][3]) : pick(LABX.tap);
    $(".mlhow", fig).innerHTML = z ? `<ol class="mlsteps">${[["📍", pick(LABX.s1), pick(ZONES[z][3])], ["👅", pick(LABX.s2), pick(HOW[z])]]
      .concat("خصضغطقظ".includes(c) && c.length === 1 ? [["⬆️", pick(LABX.s3), pick(LABX.heavy).trim()]] : [], "نم".includes(c) && c.length === 1 ? [["👃", pick(LABX.s3), pick(LABX.ghunna).trim()]] : [], c === "ر" ? [["↩️", pick(LABX.s3), pick(LABX.raa).trim()]] : [], [["🔁", pick(LABX.s4), pick(LABX.prac)]])
      .map(x => `<li><i>${x[0]}</i><span><b>${x[1]}</b> ${x[2]}</span></li>`).join("")}</ol>` : ""; };
  cap();
  async function say(c, z, b) {
    const my = ++busy; endWord(); $$(".mlk", fig).forEach(k => k.classList.toggle("on", k === b)); cap(c, z);
    await lab.to(c, z, slow ? 1500 : 650); if (my !== busy) return;
    const k = b || $(".mlch", fig); k.classList.add("playing");
    await playQari(labAudio(c), k); if (my !== busy) return;
    await new Promise(r => setTimeout(r, slow ? 800 : 350)); if (my !== busy) return;
    await lab.rest(slow ? 1100 : 500); b && b.classList.remove("on");
  }
  const box = $(".ml3", fig);
  if (box && lab.at) box.insertAdjacentHTML("beforeend", `<div class="mlwd ar" hidden></div><div class="mltag ar" hidden></div>`);
  const cam = (on, pt) => { if (!box || !lab.at) return; const s = on ? 1.75 : 1;
    const tx = on ? Math.min(0, Math.max(1 - s, .5 - pt[0] * s)) : 0, ty = on ? Math.min(0, Math.max(1 - s, .55 - pt[1] * s)) : 0;
    $$(".ml3c,.ml3o", box).forEach(e => e.style.transform = `translate(${tx * 100}%,${ty * 100}%) scale(${s})`);
    const tag = $(".mltag", box); if (on) { const x = pt[0] * s + tx, y = pt[1] * s + ty; tag.style.left = (x < .62 ? x * 100 + 7 : x * 100 - 7) + "%"; tag.style.top = y * 100 + "%"; tag.classList.toggle("lft", x >= .62); } };
  async function sayWord(i, btn) {
    const w = LAB_WORDS[i], my = ++busy; all = false; $(".mlall", fig).classList.remove("on");
    $$(".mlw", fig).forEach(k => k.classList.toggle("on", k === btn)); $$(".mlk", fig).forEach(k => k.classList.remove("on"));
    const wd = $(".mlwd", box), tag = $(".mltag", box); box.classList.add("wm"); lab.labels(false, LANG);
    wd.hidden = false; wd.innerHTML = `<span>${w[0]}</span><i>${[...w[4]].map(c => `<em>${c}</em>`).join("")}</i>`;
    await playQari([{ s: w[1], a: w[2], w: w[3] }], btn); if (my !== busy) return;
    const ems = $$("em", wd);
    for (let k = 0; k < ems.length; k++) {
      const c = w[4][k], z = LAB_Z[c]; if (!z) continue;
      ems.forEach((e, j) => { e.classList.toggle("on", j === k); e.classList.toggle("ok", j < k); });
      tag.hidden = true; cam(true, lab.at(c, z)); cap(c, z);
      await lab.to(c, z, slow ? 1500 : 900); if (my !== busy) return;
      tag.textContent = c; tag.hidden = false;
      await new Promise(r => setTimeout(r, slow ? 3200 : 2000)); if (my !== busy) return;
    }
    ems.forEach(e => { e.classList.remove("on"); e.classList.add("ok"); }); tag.hidden = true; cam(false);
    await lab.rest(600); if (my !== busy) return;
    await playQari([{ s: w[1], a: w[2], w: w[3] }], btn); if (my !== busy) return;
    endWord();
  }
  function endWord() { if (!box || !box.classList.contains("wm")) return; box.classList.remove("wm"); cam(false); $(".mlwd", box).hidden = true; $(".mltag", box).hidden = true; lab.labels(lbl, LANG); $$(".mlw", fig).forEach(k => k.classList.remove("on")); }
  $$(".mlw", fig).forEach(b => b.onclick = () => sayWord(+b.dataset.i, b));
  $$(".mlk", fig).forEach(b => b.onclick = () => { all = false; busy++; endWord(); $(".mlall", fig).classList.remove("on"); say(b.dataset.c, b.dataset.z, b); });
  $(".mlall", fig).onclick = async e => { const btn = e.currentTarget; if (all) { all = false; btn.classList.remove("on"); busy++; return; }
    all = true; btn.classList.add("on");
    for (const b of $$(".mlk", fig)) { if (!all) break; await say(b.dataset.c, b.dataset.z, b); }
    all = false; btn.classList.remove("on"); };
  $(".mlslow", fig).onclick = e => { slow = !slow; e.currentTarget.classList.toggle("on", slow); };
  $(".mllbl", fig).onclick = e => { lbl = !lbl; e.currentTarget.classList.toggle("on", lbl); lab.labels(lbl, LANG); };
  $(".mlrep", fig).onclick = e => { S.rep = S.rep === 1 ? 3 : S.rep === 3 ? 5 : 1; LS.set("qsai-rep", S.rep); e.currentTarget.textContent = "🔁 ×" + S.rep; };
  return { say: (c, b) => LAB_Z[c] ? say(c, LAB_Z[c], b) : null };
}
async function viewLab() {
  const app = $("#app");
  app.innerHTML = `<section class="sec"><p><a class="btn sm" href="#home">← ${t("back")}</a></p><h2>🗣️ ${pick(LABX.title)}</h2><p class="lead">${pick(LABX.desc)}</p>${labHTML(null)}</section>`;
  wireLab(app);
}
async function playQari(list, btn) {
  stopAll(); btn && btn.classList.add("playing");
  for (const q of [].concat(...Array(S.rep || 1).fill(list))) {
    const src = q.k ? `arv/${q.k}.mp3` : q.w ? QARI_WORD(q.s, q.a, q.w) : QARI_AYAH(q.s, q.a);
    await new Promise(r => { qariEl = new Audio(src); qariEl.onended = qariEl.onerror = r; qariEl.play().catch(r); });
    if (!btn || !btn.classList.contains("playing")) break;
    await new Promise(r => setTimeout(r, 250));
  }
  btn && btn.classList.remove("playing");
}
async function startRec(onDone, btn, labelIdle) {
  if (rec && rec.state === "recording") { rec.stop(); return; }
  try {
    const st = await navigator.mediaDevices.getUserMedia({ audio: true });
    recChunks = []; rec = new MediaRecorder(st);
    rec.ondataavailable = e => recChunks.push(e.data);
    rec.onstop = () => { st.getTracks().forEach(x => x.stop()); btn.classList.remove("on"); btn.textContent = labelIdle; onDone(new Blob(recChunks, { type: rec.mimeType || "audio/webm" })); };
    stopAll(); rec.start(); btn.classList.add("on"); btn.textContent = "⏹ " + t("stop");
  } catch (e) { toast(t("micNo")); }
}

/* ============ lesson ============ */
const LESSON = { id: null, data: null, i: 0, c: null };
async function viewLesson(id) {
  const c = courseOf(id), o = await outline(c);
  const meta = o.weeks.flatMap((w, wi) => w.days.map((d, di) => Object.assign({ wi, di }, d))).find(d => d.id === id);
  if (!meta || !meta.ready) { toast(t("soon")); location.hash = c; return; }
  if (liveAI(c) && !buyer(c)) await liveOpen(c);
  const L = lockInfo(c, o, id); if (!L.open) { toast(L.why === "time" ? t("waitSlot") + ": " + fmtAt(L.at) : L.why === "buy" ? t("buyFirst") : L.why === "live" ? pick(LIVEX.wait) : t("locked")); location.hash = c; return; }
  let data = null; try { data = await lessonData(id); } catch (e) { if (!S.user) return loginBox(() => route()); }
  if (!data) { toast(t("soon")); location.hash = c; return; }
  Object.assign(LESSON, { id, data, i: 0, c, meta, o }); typeof startClass === "function" ? startClass(id) : drawMoment();
}
/* wudu is required before every Tajweed / Arabic lesson (same rule as the live classes); asked again after 3 hours */
const WUDU = { ar: "هَلْ تَوَضَّأْتَ؟", arSub: "لَا يَمَسُّهُۥٓ إِلَّا ٱلْمُطَهَّرُونَ",
  q: { en: "Have you performed wudu?", ur: "کیا آپ نے وضو کیا ہے؟", hi: "क्या आपने वुज़ू किया है?" },
  sub: { en: "Wudu is required for the Qur'an and our classes. (Al-Waqi'ah 56:79)", ur: "قرآن اور ہماری کلاس کے لیے وضو ضروری ہے۔ (الواقعہ ۵۶:۷۹)", hi: "क़ुरआन और हमारी क्लास के लिए वुज़ू ज़रूरी है। (अल-वाक़िआ 56:79)" },
  no: { en: "Please make wudu first, then come back to your lesson.", ur: "براہِ کرم پہلے وضو کیجیے، پھر سبق میں واپس آئیے۔", hi: "मेहरबानी करके पहले वुज़ू कीजिए, फिर सबक़ में वापस आइए।" },
  yes: { en: "Yes, I have wudu", ur: "جی ہاں، وضو ہے", hi: "जी हाँ, वुज़ू है" }, nope: { en: "No", ur: "نہیں", hi: "नहीं" } };
function wuduGate(c, go) {
  let ok = false; try { ok = Date.now() - (+sessionStorage.getItem("qsai-wudu") || 0) < 3 * 3600e3; } catch (e) {}
  if (ok) return go();
  const vl = LANG === "en" ? "en" : "hu", say = n => { try { stopAll(); voiceEl = new Audio(`/v-${n}-${vl}.mp3`); voiceEl.play().catch(() => {}); } catch (e) {} };
  const d = document.createElement("div"); d.className = "wgate";
  d.innerHTML = `<div class="wbox"><div class="wdrop">💧</div><p class="war">${WUDU.ar}</p><h2>${pick(WUDU.q)}</h2><p class="wsub ar">${WUDU.arSub}</p><p class="mini">${pick(WUDU.sub)}</p>
    <div class="wbtns"><button class="btn pri" id="wY">✓ ${pick(WUDU.yes)}</button><button class="btn" id="wN">${pick(WUDU.nope)}</button></div></div>`;
  document.body.appendChild(d); if (S.voice) say("wudu");
  $("#wY", d).onclick = () => { try { sessionStorage.setItem("qsai-wudu", Date.now()); } catch (e) {} stopAll(); d.remove(); go(); };
  $("#wN", d).onclick = () => { say("wuduno"); $(".wbox", d).classList.add("warn"); $(".wbox", d).innerHTML = `<div class="wdrop">🚿</div><h2>${pick(WUDU.no)}</h2>`;
    try { navigator.vibrate && navigator.vibrate([120, 80, 240]); } catch (e) {}
    setTimeout(() => { d.remove(); location.hash = c; }, 3800); };
}
function lessonHead() {
  const { meta, c, data, i } = LESSON;
  return (typeof classBar === "function" ? classBar() : "") + `<div class="lhead"><a class="btn sm" href="#${c}">←</a><h2>${t("week")} ${num(meta.wi + 1)} · ${t("day")} ${num(meta.n || meta.di + 1)} — ${esc(pick(meta.title))}</h2>
    <button class="btn sm" id="vt">${S.voice ? "🔊 " + t("voiceOn") : "🔇 " + t("voiceOff")}</button></div>
    <div class="dots">${data.moments.map((m, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}<i class="${i >= data.moments.length ? "on" : ""}"></i></div>`;
}
function drawMoment() {
  const { data, i } = LESSON, m = data.moments[i], app = $("#app");
  if (!m) return typeof CL !== "undefined" && CL.on ? afterMoments() : drawQuiz(0, []);
  app.innerHTML = lessonHead() + `<section class="stage">
    <div class="vo" id="vo"><span class="eq"><i></i><i></i><i></i></span><button class="btn sm" id="rv">↻ ${t("replay")}</button></div>
    <div class="say">${esc(pick(m))}</div>
    ${visualHTML(m.v)}${m.ar ? tilesHTML(m.ar, m.wq, m.aw) : ""}
    ${/^(Homework|Weekly test|Test|Speaking test)\b/.test(m.en || "") ? `<p class="mini hwhint">📤 ${t("hwHint")}</p>` : ""}
    <div class="tools">${m.q ? `<button class="btn cy" id="qb">🕋 ${t("listen")}</button>` : m.wq || m.aw ? `<button class="btn cy" id="qb">🔊 ${t("arVoice")}</button>` : ""}${m.q || m.wq || m.v || m.ar ? `<button class="btn sm" id="rp" title="${t("repeat")}">🔁 ×${S.rep}</button>` : ""}${m.rec ? `<button class="btn rec" id="rb">🎙️ ${t("rec")}</button><button class="btn" id="pb" disabled>▶ ${t("mine")}</button>` : ""}</div>
  </section><div class="nav"><button class="btn big" id="bk" ${i === 0 ? "disabled" : ""}>${t("back")}</button><button class="btn pri big" id="nx">${i === data.moments.length - 1 ? (typeof CL !== "undefined" && CL.on ? t("next") : t("toQuiz")) : t("next")}</button></div>`;
  $("#vt").onclick = () => { S.voice = !S.voice; LS.set("qsai-voice", S.voice); S.voice ? playVoice() : stopAll(); $("#vt").textContent = S.voice ? "🔊 " + t("voiceOn") : "🔇 " + t("voiceOff"); };
  $("#rv").onclick = () => playVoice();
  if ($("#qb")) $("#qb").onclick = e => playQari(m.q || screenSeq(app), e.currentTarget);
  if ($("#rp")) $("#rp").onclick = e => { S.rep = S.rep === 1 ? 3 : S.rep === 3 ? 5 : 1; LS.set("qsai-rep", S.rep); e.currentTarget.textContent = "🔁 ×" + S.rep; toast(t("repeat") + ": ×" + S.rep); };
  wireVisuals(app);
  if (m.rec) { const pb = $("#pb"); recUrl = null;
    $("#rb").onclick = e => startRec(b => { if (recUrl) URL.revokeObjectURL(recUrl); recUrl = URL.createObjectURL(b); pb.disabled = false; }, e.currentTarget, "🎙️ " + t("rec"));
    pb.onclick = () => { if (recUrl) { stopAll(); voiceEl = new Audio(recUrl); voiceEl.play(); } }; }
  $("#bk").onclick = () => { LESSON.i--; drawMoment(); };
  $("#nx").onclick = () => { LESSON.i++; drawMoment(); scrollTo({ top: 0, behavior: "smooth" }); };
  if (S.voice) playVoice();
}
/* options appear in a fixed but mixed order, so the right answer is not always first */
function qorder(id, k, n) { let h = 2166136261; for (const ch of id + ":" + k) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const o = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { h = (Math.imul(h, 1103515245) + 12345) >>> 0; const j = h % (i + 1); [o[i], o[j]] = [o[j], o[i]]; } return o; }
function drawQuiz(k, ans) {
  stopAll();
  const { data } = LESSON, Q = data.quiz[k], app = $("#app");
  if (!Q) return finish(ans);
  app.innerHTML = lessonHead() + `<section class="stage"><span class="qn">${t("q")} ${num(k + 1)} ${t("of")} ${num(data.quiz.length)}</span>
    <div class="say"><b>${esc(pick(Q.q))}</b></div><div id="opts">${qorder(LESSON.id, k, Q.o.length).map(j => { const o = Q.o[j]; return `<button class="qopt" data-j="${j}"><span class="${/[؀-ۿ]/.test(pick(o)) ? "ar" : ""}">${esc(pick(o))}</span></button>`; }).join("")}</div><div id="fb"></div></section>`;
  $$(".qopt", app).forEach(b => b.onclick = () => {
    const j = +b.dataset.j, ok = j === Q.a;
    $$(".qopt", app).forEach(x => { x.disabled = true; if (+x.dataset.j === Q.a) x.classList.add("ok"); });
    if (!ok) b.classList.add("no");
    $("#fb").innerHTML = `<p class="why"><b>${ok ? "✓ " + t("right") : "✗ " + t("wrong")}</b> ${esc(pick(Q.why))}</p><div class="nav"><span></span><button class="btn pri" id="qc">${t("cont")}</button></div>`;
    $("#qc").onclick = () => drawQuiz(k + 1, ans.concat(ok));
  });
}
async function finish(ans) {
  const { id, c, o } = LESSON, s = ans.filter(Boolean).length, n = ans.length;
  await saveProg(id, { s, n, ts: Date.now() });
  const clsMin = typeof CL !== "undefined" && CL.on ? Math.round((Date.now() - CL.t0) / 60000) : null; if (typeof CL !== "undefined") { CL.on = false; clearInterval(CL.tick); document.body.classList.remove("incls"); try { sessionStorage.removeItem("qsai-cls-" + id); } catch (e) {} }
  const ids = allIds(o), flat = o.weeks.flatMap(w => w.days), nx = flat.find((d, i) => i > ids.indexOf(id) && d.ready);
  const L = nx ? lockInfo(c, o, nx.id) : null;
  $("#app").innerHTML = lessonHead() + `<section class="stage res"><div style="font-size:42px">${s === n ? "🌟" : s >= n / 2 ? "👍" : "📘"}</div><h2>${t("done")}</h2>
    <div class="big">${num(s)}/${num(n)}</div><p class="mini">${t("yourScore")} · ${t("saved")}</p>${clsMin != null ? `<p class="mini">⏱ ${pick(CX.took)}: ${num(clsMin)} ${pick(CX.mins)}</p>` : ""}${s < n ? `<p class="mini">${t("lowNote")}</p>` : ""}
    <div class="tools" style="justify-content:center">${nx && L && L.open ? `<a class="btn pri" href="#lesson=${nx.id}">${t("nextL")} →</a>` : ""}<a class="btn" href="#${c}">${t("toCourse")}</a>
    ${!S.user ? `<button class="btn cy" id="sv">${t("login")}</button>` : ""}</div>
    ${nx && L && L.why === "time" ? `<p class="mini">⏰ ${t("nextAt")}: ${fmtAt(L.at)}</p>` : ""}</section>
    ${S.user && has(c) ? hwBox() : ""}`;
  if (!S.user) $("#sv").onclick = () => loginBox(() => route());
  if (S.user && has(c)) wireHw(c, id);
  if (!S.user && !has(c) && ids.indexOf(id) === 0) setTimeout(() => buy(c), 1500);
  if (S.user && has(c) && !isFull(c) && !slot()) setTimeout(() => slotBox(), 900);
}

/* ============ homework (voice / photo / short video) checked by the AI Ustad ============ */
const hwBox = () => `<section class="stage hwb"><h3 style="margin:0">📤 ${t("hw")}</h3><p class="mini">${t("hwP")}</p>
  <div class="tools"><button class="btn rec" id="hv">🎙️ ${t("hwVoice")}</button><label class="btn">📷 ${t("hwPhoto")}<input type="file" accept="image/*" capture="environment" id="hp" hidden></label>
  <label class="btn">🎥 ${t("hwVideo")}<input type="file" accept="video/*" capture="environment" id="hd" hidden></label></div><div id="hws"></div></section>`;
const b64 = blob => new Promise(r => { const f = new FileReader(); f.onload = () => r(String(f.result).split(",")[1]); f.readAsDataURL(blob); });
async function shrinkImage(file, max = 1600) {
  const img = await createImageBitmap(file), sc = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
  cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
  return new Promise(r => cv.toBlob(r, "image/jpeg", .85));
}
function wireHw(c, lessonId) {
  const status = $("#hws"), send = async (blob, kind) => {
    if (blob.size > 10 * 1024 * 1024) return toast(t("hwBig"));
    status.innerHTML = `<p class="mini">⏳ ${t("hwSending")}</p>`;
    const data = await b64(blob), mime = blob.type || (kind === "voice" ? "audio/webm" : kind === "photo" ? "image/jpeg" : "video/mp4");
    const r = await fetch(`${W}/hw/upload`, { method: "POST", headers: { authorization: "Bearer " + await token(), "content-type": "application/json" },
      body: JSON.stringify({ course: !buyer(c) && liveAI(c) ? COURSES[c].live : COURSES[c].key, lesson: lessonId, kind, mime, data, note: "" }) }).then(r => r.json()).catch(() => ({ error: "network" }));
    if (!r.ok) { status.innerHTML = `<p class="mini" style="color:var(--bad)">${esc(r.error || "Error")}</p>`; return; }
    status.innerHTML = `<p class="mini">✓ ${t("hwSent")}</p><p class="why" id="hwfb">🤖 ${t("hwChecking")}</p>`;
    const fb = await aiCheckHomework(lessonId, kind, mime, data);
    $("#hwfb").textContent = "🤖 " + (fb || t("aiFail"));
    if (fb) fetch(`${W}/hw/review`, { method: "POST", headers: { authorization: "Bearer " + await token(), "content-type": "application/json" }, body: JSON.stringify({ id: r.id, feedback: fb }) }).catch(() => {});
  };
  $("#hv").onclick = e => startRec(b => send(b, "voice"), e.currentTarget, "🎙️ " + t("hwVoice"));
  $("#hp").onchange = async e => { const f = e.target.files[0]; if (f) send(await shrinkImage(f), "photo"); };
  $("#hd").onchange = e => { const f = e.target.files[0]; if (f) send(f, "video"); };
}
async function aiCheckHomework(lessonId, kind, mime, data) {
  const m = await aiModel(); if (!m) return "";
  const L = LESSON.data && LESSON.id === lessonId ? LESSON.data : null;
  const lessonText = L ? L.moments.map(x => x.en + (x.ar ? " [" + x.ar + "]" : "")).join("\n") : lessonId;
  const lang = LANG === "ur" ? "Urdu (Urdu script)" : LANG === "hi" ? "simple Hindi-Urdu in Devanagari" : "English";
  const ask = `This is a student's homework for lesson ${lessonId} of Learn with Quranic Science AI. The lesson:\n${lessonText}\n
The student sent a ${kind}. Check it kindly like a good teacher. If it is recitation, listen for makharij, harakat length, ghunnah, madd and the rules of this lesson; if it is writing, check the letters/words; if it is spoken Arabic, check pronunciation and grammar.
Give: 1) what was good, 2) up to 3 specific corrections with the correct form, 3) a mark out of 10. If the audio/image is unclear or not related to the lesson, say so politely and ask them to send again. Never invent mistakes you cannot hear or see. Reply in ${lang}, under 120 words, plain text.`;
  try { const r = await withTimeout(m.generateContent({ contents: [{ role: "user", parts: [{ inlineData: { mimeType: mime.split(";")[0], data } }, { text: ask }] }] }), 60000); return r.response.text().replace(/\*\*?|#+ |`/g, ""); } catch (e) { return ""; }
}
async function myHomework(c) {
  const box = $("#hwList"); if (!box) return;
  const r = await fetch(`${W}/hw/list`, { headers: { authorization: "Bearer " + await token() } }).then(r => r.json()).catch(() => ({ rows: [] }));
  const rows = (r.rows || []).filter(x => x.course === COURSES[c].key || x.course === COURSES.combo.key).slice(0, 30);
  box.innerHTML = `<h2>📤 ${t("hwMine")}</h2>${rows.length ? rows.map(x => `<div class="hwrow"><b>${esc(x.lesson)}</b> · ${x.kind === "voice" ? "🎙️" : x.kind === "photo" ? "📷" : "🎥"} · <span class="mini">${new Date(x.ts).toLocaleDateString()}</span>
    ${x.feedback ? `<p class="why">🤖 ${esc(x.feedback)}</p>` : `<p class="mini">⏳</p>`}</div>`).join("") : `<p class="mini">${t("hwNone")}</p>`}`;
}

/* ============ owner: save the lesson keys (pick the keys file once) ============ */
function viewKeys() {
  const app = $("#app");
  if (!isOwner()) { app.innerHTML = `<section class="stage res" style="margin-top:24px"><h2>Owner only</h2><button class="btn pri" id="kl">${t("login")}</button></section>`; $("#kl").onclick = () => loginBox(() => route()); return; }
  app.innerHTML = `<section class="stage res" style="margin-top:24px"><div style="font-size:42px">🔐</div><h2>Lesson keys</h2>
    <p>Choose the file <b>qs-ai-keys.json</b> that Claude sent you. It is saved safely on the server, then you can delete the file.</p>
    <label class="btn pri">📄 Choose qs-ai-keys.json<input type="file" accept=".json,application/json" id="kf" hidden></label><p id="ks" class="mini" style="margin-top:12px"></p></section>`;
  $("#kf").onchange = async e => { const f = e.target.files[0]; if (!f) return; const st = $("#ks"); st.textContent = "Saving…";
    try { if (f.size > 1000 || !/qs-ai-keys/i.test(f.name)) throw new Error("Wrong file. Please choose qs-ai-keys.json (from Downloads).");
      const body = await f.text(), j = JSON.parse(body); if (!/^[0-9a-f]{64}$/.test(j.editing || "") || Object.keys(j).length !== 2) throw new Error("Wrong file. Please choose qs-ai-keys.json.");
      const r = await fetch(`${W}/ai/setkeys`, { method: "POST", headers: { authorization: "Bearer " + await token(), "content-type": "application/json" }, body }).then(r => r.json());
      if (!r.ok) throw new Error(r.error || "failed"); S.keys = {};
      const k = await fetch(`${W}/ai/key?course=editing`, { headers: { authorization: "Bearer " + await token() } }).then(r => r.json());
      st.innerHTML = k.key ? "✅ Saved: " + r.saved.join(", ") + ". All lessons now open for enrolled students." : "⚠️ " + esc(k.error || "check again");
    } catch (er) { st.textContent = "❌ " + er.message; } };
}

/* ============ offline (Full Access): lessons saved encrypted inside the app only ============ */
async function viewOffline() {
  const app = $("#app"), saved = LS.get("qsai-off", {});
  app.innerHTML = `<section class="sec"><h2>⬇ ${t("offH")}</h2><p class="mini">${t("offP")}</p><div class="cards two" id="offc"></div><p class="mini">🔒 ${t("protect")}</p></section>`;
  const box = $("#offc");
  for (const c of ["editing", "content"]) {
    const ok = S.user && has(c) && isFull(c), sv = saved[c];
    box.insertAdjacentHTML("beforeend", `<div class="cc"><div class="arT">${COURSES[c].ar}</div><h3>${t(c)}</h3>
      ${sv ? `<p class="mini">✓ ${t("offDone")} · ${num(sv.n)} ${t("lessons")} · ${new Date(sv.at).toLocaleDateString()}</p><a class="btn pri" href="#${c}">${t("open")}</a>` : ""}
      ${ok ? `<button class="btn ${sv ? "" : "pri"}" data-off="${c}">⬇ ${t("offDl")}</button>` : `<p class="mini">${t("offNeed")}</p>`}<div class="bar" hidden><i style="width:0"></i></div></div>`);
  }
  $$("[data-off]", box).forEach(b => b.onclick = () => saveOffline(b.dataset.off, b));
}
async function saveOffline(c, btn) {
  if (!("caches" in window)) return toast("Offline storage is not supported on this browser.");
  await courseKey(c); const o = await outline(c), ready = o.weeks.flatMap(w => w.days).filter(d => d.ready), cache = await caches.open("qsai-off-" + c);
  const urls = new Set(["./", "index.html", `data/${c}.json`, "icon-192.png", "icon-512.png"]);
  for (const d of ready) { urls.add(`data/${d.id.slice(0, 5)}.bin?v=${o.v || 0}`); }
  const bar = btn.parentNode.querySelector(".bar"); bar.hidden = false; btn.disabled = true; btn.textContent = t("saving");
  const weeks = [...new Set(ready.map(d => d.id.slice(0, 5)))]; let done = 0, total = 0;
  for (const wk of weeks) { const L = await lessonDataWeek(wk); for (const l of L) { l.moments.forEach((m, i) => { const V = `?v=${o.v || 0}`; [String(i + 1)].concat(m.av ? [(i + 1) + "a"] : []).forEach(n => urls.add(FREE.includes(l.id) ? `vo/${l.id}-${n}.mp3${V}` : `vo/${l.id}-${n}.bin${V}`)); (m.q || []).forEach(q => urls.add(q.w ? QARI_WORD(q.s, q.a, q.w) : QARI_AYAH(q.s, q.a))); }); } }
  total = urls.size;
  for (const u of urls) { try { const req = new Request(u, /^https?:/.test(u) ? { mode: "no-cors" } : {}); const res = await fetch(req); await cache.put(req, res); } catch (e) {} done++; bar.firstChild.style.width = Math.round(done * 100 / total) + "%"; }
  const sv = LS.get("qsai-off", {}); sv[c] = { at: Date.now(), n: ready.length }; LS.set("qsai-off", sv);
  toast(t("offDone")); viewOffline();
}
async function lessonDataWeek(wk) { const any = wk + "d1"; await lessonData(FREE.includes(any) ? wk + "d2" : any).catch(() => {}); return (S.weeks[wk] || []).concat(S.free ? S.free.filter(l => l.id.startsWith(wk)) : []); }

/* ============ certificate: founder's photo + signature, student's photo ============ */
async function viewCert(c) {
  const o = await outline(c), s = stats(c, o), P = progOf(), fin = P[c[0] + "-w12d5"];
  const ok = s.done >= s.total && fin && fin.n && fin.s / fin.n >= .7;
  const app = $("#app");
  if (!ok && !isOwner()) { app.innerHTML = `<section class="stage res" style="margin-top:24px"><div style="font-size:46px">🎓</div><h2>${t("cert")}</h2><p>${t("certNeed")}</p>
     <div class="bar" style="max-width:360px;margin:12px auto"><i style="width:${s.pct}%"></i></div><p class="mini">${num(s.done)}/${num(s.total)} · ${t("score")} ${num(s.score)}%</p><a class="btn" href="#${c}">${t("toCourse")}</a></section>`; return; }
  const name = (S.doc.name || (S.user && S.user.displayName) || "").trim() || "Student";
  let photo = S.doc.aiPhoto || (S.user && S.user.photoURL) || "";
  app.innerHTML = `<section class="sec"><h2>🎓 ${t("certReady")}</h2><canvas id="cv"></canvas><div class="tools" style="margin-top:12px"><button class="btn pri" id="dl">${t("dl")} PNG</button>
    <label class="btn">🖼️ ${t("photoBtn")}<input type="file" accept="image/*" id="ph" hidden></label><a class="btn" href="#${c}">${t("toCourse")}</a></div><p class="mini">${t("photoL")}</p></section>`;
  const id = "QSCR-" + COURSES[c].k.toUpperCase() + "-" + (S.user ? S.user.uid.slice(0, 6).toUpperCase() : "PREVIEW");
  const draw = () => drawCert($("#cv"), { name, code: S.doc.code || "", course: TX.en[c], ar: COURSES[c].ar, score: s.score, id, date: new Date(fin && fin.ts || Date.now()), photo });
  await draw();
  $("#ph").onchange = async e => { const f = e.target.files[0]; if (!f) return; const b = await shrinkImage(f, 420); photo = "data:image/jpeg;base64," + await b64(b); await draw();
    if (b.size < 250000) saveUser({ aiPhoto: photo }); };
  $("#dl").onclick = () => { const a = document.createElement("a"); a.download = id + ".png"; a.href = $("#cv").toDataURL("image/png"); a.click(); };
  if (S.user && db && ok) db.collection("users").doc(S.user.uid).set({ aiCerts: { [c]: { id, score: s.score, ts: Date.now() } } }, { merge: true }).catch(() => {});
}
const img = src => new Promise(r => { if (!src) return r(null); const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
function circleImg(x, im, cx, cy, r, ring) {
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.closePath(); x.clip();
  if (im) { const s = Math.min(im.width, im.height); x.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, cx - r, cy - r, 2 * r, 2 * r); } else { x.fillStyle = "#efe2c4"; x.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
  x.restore(); x.strokeStyle = ring; x.lineWidth = 8; x.beginPath(); x.arc(cx, cy, r + 4, 0, 7); x.stroke();
}
async function drawCert(cv, d) {
  const W2 = 2000, H = 1414, x = cv.getContext("2d"); cv.width = W2; cv.height = H;
  try { await document.fonts.load("700 80px Outfit"); await document.fonts.load("60px 'Amiri Quran'"); } catch (e) {}
  const g = x.createLinearGradient(0, 0, W2, H); g.addColorStop(0, "#fffaf0"); g.addColorStop(1, "#f6ead2"); x.fillStyle = g; x.fillRect(0, 0, W2, H);
  x.strokeStyle = "#7a1424"; x.lineWidth = 26; x.strokeRect(30, 30, W2 - 60, H - 60);
  x.strokeStyle = "#c79a3c"; x.lineWidth = 4; x.strokeRect(70, 70, W2 - 140, H - 140); x.strokeRect(84, 84, W2 - 168, H - 168);
  for (const [cx, cy] of [[84, 84], [W2 - 84, 84], [84, H - 84], [W2 - 84, H - 84]]) { x.fillStyle = "#c79a3c"; x.beginPath(); x.arc(cx, cy, 16, 0, 7); x.fill(); }
  const [logo, sig, ic, founder, stu] = await Promise.all([img("/logo.png"), img("/a-sig.png?v=6"), img("icon-512.png"), img("/img-founder.webp"), img(d.photo)]);
  if (logo) x.drawImage(logo, W2 / 2 - 75, 115, 150, 150);
  x.textAlign = "center"; x.fillStyle = "#7a1424"; x.font = "700 30px Outfit"; x.fillText("QURANIC SCIENCE ACADEMY", W2 / 2, 318);
  x.fillStyle = "#1c1712"; x.font = "800 88px Outfit"; x.fillText("Certificate of Completion", W2 / 2, 430);
  x.fillStyle = "#b07d22"; x.font = "600 38px Outfit"; x.fillText("Learn with Quranic Science AI", W2 / 2, 492);
  circleImg(x, stu, 330, 640, 120, "#c79a3c");
  x.fillStyle = "#6b6256"; x.font = "400 32px Outfit"; x.fillText("This is to certify that", W2 / 2 + 60, 590);
  x.fillStyle = "#7a1424"; let fs = 90; x.font = `700 ${fs}px Outfit`; while (x.measureText(d.name).width > 1200 && fs > 48) { fs -= 4; x.font = `700 ${fs}px Outfit`; } x.fillText(d.name, W2 / 2 + 60, 690);
  if (d.code) { x.fillStyle = "#6b6256"; x.font = "500 28px Outfit"; x.fillText("Student ID: " + d.code, W2 / 2 + 60, 738); }
  x.strokeStyle = "#c79a3c"; x.lineWidth = 2; x.beginPath(); x.moveTo(W2 / 2 - 480, 760); x.lineTo(W2 / 2 + 600, 760); x.stroke();
  x.fillStyle = "#3a312a"; x.font = "400 34px Outfit";
  x.fillText(`has successfully completed the 12-week course "${d.course}" (72 lessons)`, W2 / 2, 840);
  x.fillText("through self-paced learning with Quranic Science AI, with an overall score of " + d.score + "%.", W2 / 2, 892);
  x.font = "52px 'Amiri Quran', serif"; x.fillStyle = "#b07d22"; x.fillText(d.ar, W2 / 2, 985);
  x.textAlign = "left"; x.fillStyle = "#6b6256"; x.font = "400 26px Outfit";
  x.fillText("Date: " + d.date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 170, 1200);
  x.fillText("Certificate ID: " + d.id, 170, 1242); x.fillText("Learned with Quranic Science AI · quranicscience.info/ai", 170, 1284);
  if (ic) x.drawImage(ic, W2 / 2 - 65, 1110, 130, 130);
  x.textAlign = "center"; x.fillStyle = "#7a1424"; x.font = "700 20px Outfit"; x.fillText("VERIFIED BY QURANIC SCIENCE AI", W2 / 2, 1268);
  circleImg(x, founder, W2 - 470, 1110, 62, "#7a1424");
  if (sig) x.drawImage(sig, W2 - 640, 1150, 300, 108);
  x.strokeStyle = "#1c1712"; x.lineWidth = 2; x.beginPath(); x.moveTo(W2 - 660, 1252); x.lineTo(W2 - 260, 1252); x.stroke();
  x.fillStyle = "#1c1712"; x.font = "700 28px Outfit"; x.fillText("Arsalan Ahmed Shaikh", W2 - 460, 1292); x.fillStyle = "#6b6256"; x.font = "400 22px Outfit"; x.fillText("Founder, Quranic Science", W2 - 460, 1324);
}

/* ============ AI Ustad ============ */
const AIX = { model: null, tried: false, hist: [] };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
async function ustadKnowledge() {
  const [ot, oa] = await Promise.all([outline("editing"), outline("content")]);
  const syl = (o, n) => n + ":\n" + o.weeks.map((w, i) => `Week ${i + 1} ${w.title.en}: ` + w.days.map((d, j) => `D${j + 1} ${d.title.en}`).join("; ")).join("\n");
  let cur = "";
  if (LESSON.data && /lesson=/.test(location.hash)) cur = "\nTHE STUDENT IS NOW ON THIS LESSON (" + LESSON.id + "):\n" + LESSON.data.moments.map(m => m.en + (m.ar ? " [" + m.ar + "]" : "")).join("\n");
  return `You are "AI Ustad", the complete teacher inside "Learn with Quranic Science AI" (quranicscience.info), a self-paced course for Tajweed (Hafs 'an 'Asim, Indo-Pak 15-line mushaf conventions) and beginner Arabic speaking/Qur'anic Arabic. There is no human teacher in this course: you explain, correct and guide.
RULES (very important):
1. Answer ONLY about Tajweed, Qur'an reading, Arabic language and this course (lessons, homework, time slot, certificate). For other topics, politely say you only help with this course.
2. Be accurate. Use the standard rules of Tajweed for Hafs 'an 'Asim via ash-Shatibiyyah (e.g. madd muttasil and munfasil 4-5 counts, madd lazim 6, ghunnah 2 counts, qalqalah letters قطب جد, isti'la letters خص ضغط قظ, izhar letters ء ه ع ح غ خ, idgham letters ينمو and ل ر, iqlab before ب, ikhfa 15 letters).
3. If you are not fully sure, say so honestly instead of guessing. Never invent rules, ayat, references or hadith.
4. Never give fatwas or rulings on halal/haram, fiqh disputes or personal matters; refer to a qualified scholar.
5. When quoting the Qur'an, quote exactly in Arabic with diacritics and give the surah:ayah. Do not paraphrase the Arabic.
6. Reply in the student's language: Urdu script → Urdu, Devanagari → Hindi-Urdu, Roman Urdu → Roman Urdu, English → English. Keep answers short (under 120 words), kind and clear, with one example.
7. Plain text only; no markdown symbols. For a list start lines with •.
COURSE FACTS: daily mode opens one lesson a day at the student's own fixed time (6 days a week; the time cannot be changed once chosen). Full Access opens all lessons at once with offline saving inside the app. Certificate after all 72 lessons and 70% in the final exam. Prices: Tajweed with AI ₹1,479 ($18), Arabic with AI ₹2,999 ($36), both ₹3,999 ($48); Full Access +₹999 ($12) for Tajweed, +₹1,009 ($11) for Arabic, +₹1,519 ($17) for both.
COURSE SYLLABUS:
${syl(ot, "TAJWEED (72 lessons)")}
${syl(oa, "ARABIC (72 lessons)")}${cur}`;
}
async function aiModel() {
  if (AIX.model || AIX.tried) return AIX.model; AIX.tried = true;
  try {
    const v = "12.4.0", { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`),
      ac = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app-check.js`),
      { getAI, getGenerativeModel, GoogleAIBackend } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-ai.js`);
    const app = initializeApp(FB, "qs-ai-ustad-" + Date.now());
    try { ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(RECAPTCHA), isTokenAutoRefreshEnabled: true }); } catch (e) {}
    AIX.model = getGenerativeModel(getAI(app, { backend: new GoogleAIBackend() }), { model: AI_MODEL, systemInstruction: await ustadKnowledge() });
  } catch (e) { AIX.model = null; }
  return AIX.model;
}
function addMsg(cls, text) { const e = document.createElement("div"); e.className = "msg " + cls; e.textContent = text; if (/[؀-ۿ]/.test(text)) e.dir = "rtl"; $("#log").appendChild(e); $("#log").scrollTop = 1e9; return e; }
$("#fab").onclick = () => { $("#drawer").classList.add("open"); if (!$("#log").children.length) addMsg("b", t("aiHello")); aiModel(); setTimeout(() => $("#dq").focus(), 300); };
$("#dx").onclick = () => $("#drawer").classList.remove("open");
$("#dq").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#dform").requestSubmit(); } });
$("#dform").onsubmit = async e => {
  e.preventDefault(); const q = $("#dq").value.trim(); if (!q) return; $("#dq").value = ""; addMsg("u", q);
  const out = addMsg("b", "…");
  if (/lesson=/.test(location.hash) && AIX.lessonCtx !== LESSON.id) { AIX.model = null; AIX.tried = false; AIX.lessonCtx = LESSON.id; }
  const m = await aiModel();
  if (!m) { out.textContent = t("aiFail"); return; }
  try {
    const res = await m.generateContentStream({ contents: [...AIX.hist.slice(-8), { role: "user", parts: [{ text: q }] }] }); let s = "";
    for await (const ch of res.stream) { let x = ""; try { x = ch.text(); } catch (er) {} s += x; out.textContent = s.replace(/\*\*?|#+ |`/g, ""); if (/[؀-ۿ]/.test(s)) out.dir = "rtl"; $("#log").scrollTop = 1e9; }
    if (!s) throw 0; AIX.hist.push({ role: "user", parts: [{ text: q }] }, { role: "model", parts: [{ text: s }] });
  } catch (er) { out.textContent = t("aiFail"); }
};

/* ============ start ============ */
applyLang(); renderWho();
if (!auth) route();
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

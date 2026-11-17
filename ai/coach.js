"use strict";
/* Quranic Science — Tajweed Coach
   Huroof takhti · Makharij map (touch a part → all its letters) · Ayah reading (tap a word / speaker for the whole ayah)
   · an AI Ustad that listens, compares with the qari, rates, explains each mistake simply and asks to repeat until fixed.
   Needs app.js (globals: $, $$, t, pick, LANG, ZONES, LAB_Z, labHTML, wireLab, playQari, stopAll, LETTER, QARI_WORD, QARI_AYAH, FB, RECAPTCHA, AI_MODEL) and coach-core.js. */
(function () {
  const L = (en, ur, hi) => ({ en, ur, hi }), P = o => (o && (o[LANG] || o.en)) || "";
  const fill = (s, m) => s.replace(/\{(\w+)\}/g, (_, k) => m[k] != null ? m[k] : "");
  const CORE = window.CoachCore;

  /* ================= texts ================= */
  const X = {
    title: L("Tajweed Coach", "تجوید کوچ", "तजवीद कोच"),
    sub: L("Touch, listen, speak. Your AI Ustad listens to your voice, compares it with the qari and corrects every mistake — until you get it right.", "چھوئیں، سنیں، پڑھیں۔ آپ کا AI استاد آپ کی آواز سنتا ہے، قاری سے ملاتا ہے اور ہر غلطی ٹھیک کراتا ہے — جب تک آپ درست نہ پڑھ لیں۔", "छुइए, सुनिए, पढ़िए। आपका AI उस्ताद आपकी आवाज़ सुनता है, क़ारी से मिलाता है और हर ग़लती तब तक सुधरवाता है जब तक आप सही न पढ़ लें।"),
    tabH: L("Huroof", "حروف", "हुरूफ़"), tabM: L("Mouth parts", "مخارج", "मख़ारिज"), tabA: L("Ayah", "آیت", "आयत"),
    hello: L("Assalamu alaikum! I am your Ustad. Touch a letter to hear it, then press the mic and say it. I will listen carefully. You can also touch any name on the 3D head (Lips, Teeth, Nose…) to hear all its letters.", "السلام علیکم! میں آپ کا استاد ہوں۔ کسی حرف کو چھو کر سنیں، پھر مائیک دبا کر پڑھیں۔ میں غور سے سنوں گا۔ 3D سر پر لکھے نام (ہونٹ، دانت، ناک…) چھو کر بھی ان کے سب حروف سن سکتے ہیں۔", "अस्सलामु अलैकुम! मैं आपका उस्ताद हूँ। किसी हर्फ़ को छूकर सुनिए, फिर माइक दबाकर पढ़िए। मैं ध्यान से सुनूँगा।"),
    helloM: L("Touch a part of the mouth — a button below or a name on the 3D head (Lips, Teeth, Nose…). I will show it in 3D and play every letter that comes from there.", "منہ کے کسی حصے کو چھوئیں — نیچے بٹن یا 3D سر پر لکھا نام (ہونٹ، دانت، ناک…)۔ میں 3D میں دکھاؤں گا اور وہاں سے نکلنے والے سب حروف سناؤں گا۔", "मुँह के किसी हिस्से को छूइए — नीचे का बटन या 3D सिर पर लिखा नाम (होंठ, दाँत, नाक…)। मैं 3D में दिखाऊँगा और वहाँ से निकलने वाले सब हुरूफ़ सुनाऊँगा।"),
    helloA: L("Tap a word to hear only that word. Tap the speaker to hear the whole ayah. Then press the mic and read.", "کسی لفظ پر ٹیپ کریں تو صرف وہی لفظ سنائی دے گا۔ اسپیکر دبائیں تو پوری آیت۔ پھر مائیک دبا کر پڑھیں۔", "किसी लफ़्ज़ पर टैप कीजिए तो सिर्फ़ वही लफ़्ज़ सुनाई देगा। स्पीकर दबाइए तो पूरी आयत। फिर माइक दबाकर पढ़िए।"),
    listen: L("I am listening… speak now.", "میں سن رہا ہوں… اب پڑھیں۔", "मैं सुन रहा हूँ… अब पढ़िए।"),
    think: L("Checking your recitation…", "آپ کی تلاوت جانچ رہا ہوں…", "आपकी तिलावत जाँच रहा हूँ…"),
    mic: L("Read", "پڑھیں", "पढ़िए"), stopMic: L("Done", "ہو گیا", "हो गया"),
    nospeech: L("I could not hear your voice. Hold the phone near your mouth and try again.", "آپ کی آواز سنائی نہیں دی۔ فون منہ کے قریب رکھ کر دوبارہ کوشش کریں۔", "आपकी आवाज़ सुनाई नहीं दी। फ़ोन मुँह के पास रखकर फिर कोशिश कीजिए।"),
    micNo: L("Please allow the microphone to continue.", "آگے بڑھنے کے لیے مائیکروفون کی اجازت دیں۔", "आगे बढ़ने के लिए माइक की इजाज़त दीजिए।"),
    aiNo: L("The AI is busy right now. Please try again in a moment.", "AI ابھی مصروف ہے۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔", "AI अभी व्यस्त है। थोड़ी देर बाद फिर कोशिश कीजिए।"),
    listenQ: L("Listen to the qari", "قاری کو سنیں", "क़ारी को सुनिए"), see3d: L("Show in 3D", "3D میں دیکھیں", "3D में देखिए"),
    again: L("Try again", "دوبارہ پڑھیں", "फिर पढ़िए"), next: L("Next", "اگلا", "अगला"), skip: L("Skip this word", "یہ لفظ چھوڑیں", "यह लफ़्ज़ छोड़िए"),
    auto: L("Auto-repeat", "خود دہرانا", "ख़ुद दोहराना"), voice: L("Ustad voice", "استاد کی آواز", "उस्ताद की आवाज़"),
    whole: L("Whole ayah", "پوری آیت", "पूरी आयत"), wbw: L("Word by word", "لفظ بہ لفظ", "लफ़्ज़ ब लफ़्ज़"), slow: L("Slow 3D", "آہستہ 3D", "धीमा 3D"),
    sura: L("Surah", "سورت", "सूरह"), ayah: L("Ayah", "آیت", "आयत"), quick: L("Quick picks", "فوری انتخاب", "जल्दी चुनें"),
    target: L("Say this:", "یہ پڑھیں:", "यह पढ़िए:"), onlyWord: L("Only this word:", "صرف یہ لفظ:", "सिर्फ़ यह लफ़्ज़:"),
    score: L("Your score", "آپ کا اسکور", "आपका स्कोर"),
    rate: [[97, L("Mashallah! Perfect ⭐⭐⭐⭐⭐", "ماشاء اللہ! بالکل درست ⭐⭐⭐⭐⭐", "माशा अल्लाह! बिल्कुल सही ⭐⭐⭐⭐⭐")], [88, L("Very good ⭐⭐⭐⭐", "بہت اچھا ⭐⭐⭐⭐", "बहुत अच्छा ⭐⭐⭐⭐")], [70, L("Good, a few mistakes ⭐⭐⭐", "اچھا، چند غلطیاں ⭐⭐⭐", "अच्छा, कुछ ग़लतियाँ ⭐⭐⭐")], [45, L("Keep trying ⭐⭐", "کوشش جاری رکھیں ⭐⭐", "कोशिश जारी रखिए ⭐⭐")], [0, L("Listen again and repeat ⭐", "پھر سنیں اور دہرائیں ⭐", "फिर सुनिए और दोहराइए ⭐")]],
    unsure: L("I could not hear this part clearly. Please say it again, slowly and clearly.", "مجھے یہ حصہ صاف سنائی نہیں دیا۔ آہستہ اور صاف دوبارہ پڑھیں۔", "मुझे यह हिस्सा साफ़ सुनाई नहीं दिया। धीरे और साफ़ फिर पढ़िए।"),
    okAll: L("Perfect! Every letter and every harakat was correct.", "شاباش! ہر حرف اور ہر حرکت درست تھی۔", "शाबाश! हर हर्फ़ और हर हरकत सही थी।"),
    wordOk: L("Well done! This word is correct. Now read the whole ayah.", "شاباش! یہ لفظ درست ہے۔ اب پوری آیت پڑھیں۔", "शाबाश! यह लफ़्ज़ सही है। अब पूरी आयत पढ़िए।"),
    drill: L("Let us fix this word first. Listen, then say only this word.", "پہلے اس لفظ کو ٹھیک کرتے ہیں۔ سنیں، پھر صرف یہی لفظ پڑھیں۔", "पहले इस लफ़्ज़ को ठीक करते हैं। सुनिए, फिर सिर्फ़ यही लफ़्ज़ पढ़िए।"),
    tries: L("Let us slow down: watch the 3D, listen to the qari twice, then try again. You can do it!", "آہستہ کرتے ہیں: 3D دیکھیں، قاری کو دو بار سنیں، پھر کوشش کریں۔ آپ کر لیں گے!", "धीमे चलते हैं: 3D देखिए, क़ारी को दो बार सुनिए, फिर कोशिश कीजिए। आप कर लेंगे!"),
    extra: L("You added extra words that are not in this ayah: ", "آپ نے ایسے الفاظ بڑھا دیے جو اس آیت میں نہیں ہیں: ", "आपने ऐसे लफ़्ज़ बढ़ा दिए जो इस आयत में नहीं हैं: "),
    fast: L("You read much faster than the qari. Slow down so every letter is clear.", "آپ قاری سے بہت تیز پڑھ رہے ہیں۔ آہستہ پڑھیں تاکہ ہر حرف صاف نکلے۔", "आप क़ारी से बहुत तेज़ पढ़ रहे हैं। धीरे पढ़िए ताकि हर हर्फ़ साफ़ निकले।"),
    honest: L("The AI checks your words, letters and harakat. For very fine rules (exact length of ghunnah etc.) listen to the qari again.", "AI آپ کے الفاظ، حروف اور حرکات جانچتا ہے۔ بہت باریک قواعد (جیسے غنہ کی ٹھیک مقدار) کے لیے قاری کو دوبارہ سنیں۔", "AI आपके लफ़्ज़, हुरूफ़ और हरकात जाँचता है। बहुत बारीक क़ायदों (जैसे ग़ुन्ना की सही मिक़दार) के लिए क़ारी को फिर सुनिए।"),
    ex: L("Example word:", "مثالی لفظ:", "मिसाली लफ़्ज़:"), from: L("Comes from:", "یہاں سے نکلتا ہے:", "यहाँ से निकलता है:"),
    playAll: L("Playing every letter of this part…", "اس حصے کے سب حروف سنا رہا ہوں…", "इस हिस्से के सब हुरूफ़ सुना रहा हूँ…"),
    stop: L("Stop", "روکیں", "रोकिए"), save: L("Saved", "محفوظ", "सहेजा")
  };
  const x = k => P(X[k]);
  const disp = w => String(w).replace(/[\u06D6-\u06DC\u06DE\u06E9\u08D6-\u08E1]/g, "");

  /* ---- mistake explanations (kid-friendly) ---- */
  const VN = { a: L("fatha (zabar) – open mouth, “a”", "زبر – منہ کھول کر «اَ»", "ज़बर – मुँह खोलकर «अ»"), u: L("damma (pesh) – round lips, “u”", "پیش – ہونٹ گول کر کے «اُ»", "पेश – होंठ गोल करके «उ»"), i: L("kasra (zer) – smile a little, “i”", "زیر – ہلکا سا مسکرا کر «اِ»", "ज़ेर – हल्का मुस्कुराकर «इ»") };
  /* each letter tip has a recorded Ustad voice (ustad/say/lt_<codepoint>.mp3) */
  const LTV = ["ص","س","ض","د","ط","ت","ظ","ذ","ز","ث","ح","ه","ع","ء","ق","ك","خ","غ","ش","ف","ا","ب","ج","ر","ل","م","ن","و","ي"];
  const mtBtn = (t, c) => ` <button class="btn sm" data-mt="${t}"${LTV.includes(c) && (t === "sub" || t === "del") ? ` data-lt="${c}"` : ""} aria-label="voice">🔊</button>`;
  const zBtn = c => { const z = LAB_Z[c]; return z && ZONES[z] ? ` <button class="btn sm" data-zs="${z}" aria-label="voice">🔊</button>` : ""; };
  const sayAudio = n => { const a = new Audio((LANG === "en" ? "ustad/say/en/" : "ustad/say/") + n + ".mp3"); if (LANG === "en") a.addEventListener("error", () => { if (a.__fb) return; a.__fb = 1; a.src = "ustad/say/" + n + ".mp3"; a.play().catch(() => {}); }); return a; };
  const ltBtn = c => LTV.includes(c) ? ` <button class="btn sm" data-lt="${c}" aria-label="voice">🔊</button>` : "";
  const LT = { /* what the correct letter feels like */
    "ص": L("Saad is HEAVY: lift the back of your tongue, round the lips, fill the mouth. Seen (س) is light.", "صاد موٹا ہے: زبان کا پچھلا حصہ اوپر اٹھائیں، ہونٹ گول، منہ بھرا ہوا۔ سین (س) باریک ہوتا ہے۔", "साद मोटा है: ज़बान का पिछला हिस्सा ऊपर उठाइए, होंठ गोल, मुँह भरा हुआ। सीन (स) बारीक होता है।"),
    "س": L("Seen is light: a thin whistle, tongue tip near the lower teeth.", "سین باریک ہے: پتلی سیٹی جیسی آواز، زبان کی نوک نیچے کے دانتوں کے پاس۔", "सीन बारीक है: पतली सीटी जैसी आवाज़, ज़बान की नोक नीचे के दाँतों के पास।"),
    "ض": L("Daad: the SIDE of the tongue presses the upper molars; heavy and a little slow. It is not a quick د.", "ضاد: زبان کا کنارہ اوپر کی داڑھوں سے لگتا ہے؛ موٹا اور ذرا آہستہ۔ یہ جلدی والا د نہیں ہے۔", "ज़ाद: ज़बान का किनारा ऊपर की दाढ़ों से लगता है; मोटा और ज़रा धीमा। यह जल्दी वाला द नहीं है।"),
    "د": L("Daal is light: tongue tip taps the base of the upper front teeth.", "دال باریک ہے: زبان کی نوک اوپر کے اگلے دانتوں کی جڑ کو چھوتی ہے۔", "दाल बारीक है: ज़बान की नोक ऊपर के अगले दाँतों की जड़ को छूती है।"),
    "ط": L("Taa (ط) is heavy and strong: tongue tip on the gum, mouth full, a small bounce. ت is light.", "طا موٹا اور مضبوط ہے: زبان کی نوک مسوڑھے پر، منہ بھرا ہوا، ہلکا سا ٹکراؤ۔ ت باریک ہے۔", "ता (ط) मोटा और मज़बूत है: ज़बान की नोक मसूड़े पर, मुँह भरा हुआ, हल्की-सी टक्कर। त बारीक है।"),
    "ت": L("Taa (ت) is light and soft: tongue tip at the base of the upper front teeth, no heaviness.", "تا (ت) باریک اور نرم ہے: زبان کی نوک اوپر کے اگلے دانتوں کی جڑ پر، بھاری پن نہیں۔", "ता (त) बारीक और नर्म है: ज़बान की नोक ऊपर के अगले दाँतों की जड़ पर, भारीपन नहीं।"),
    "ظ": L("Zhaa: tongue tip between the teeth like ذ, but HEAVY (mouth full).", "ظا: زبان کی نوک دانتوں کے بیچ جیسے ذ، مگر موٹا (منہ بھرا ہوا)۔", "ज़ा (ظ): ज़बान की नोक दाँतों के बीच जैसे ذ, मगर मोटा (मुँह भरा हुआ)।"),
    "ذ": L("Dhaal: tongue tip lightly between the teeth, with voice (buzz).", "ذال: زبان کی نوک ہلکی سی دانتوں کے بیچ، آواز کے ساتھ۔", "ज़ाल (ذ): ज़बान की नोक हल्की-सी दाँतों के बीच, आवाज़ के साथ।"),
    "ز": L("Zaay: a buzzing whistle, tongue near the lower teeth.", "زا: بھنبھناتی سیٹی، زبان نیچے کے دانتوں کے پاس۔", "ज़ा (ز): भनभनाती सीटी, ज़बान नीचे के दाँतों के पास।"),
    "ث": L("Thaa: tongue tip comes out a little between the teeth, soft air, no voice.", "ثا: زبان کی نوک ذرا سی دانتوں کے بیچ، نرم ہوا، آواز کے بغیر۔", "सा (ث): ज़बान की नोक ज़रा-सी दाँतों के बीच, नर्म हवा, बिना आवाज़ के।"),
    "ح": L("Haa (ح): from the MIDDLE of the throat, a soft rubbing of air. Not a light ه.", "حا (ح): حلق کے درمیان سے، ہوا کی نرم رگڑ۔ ہلکا ہ نہیں۔", "हा (ح): हल्क़ के बीच से, हवा की नर्म रगड़। हल्का ह नहीं।"),
    "ه": L("Haa (ه): a light breath from the DEEPEST part of the throat.", "ہا (ه): حلق کی سب سے گہری جگہ سے ہلکی سانس۔", "हा (ه): हल्क़ की सबसे गहरी जगह से हल्की साँस।"),
    "ع": L("Ayn (ع): squeeze the middle of the throat and use your voice. It is not ا.", "عین (ع): حلق کا درمیان دبا کر آواز کے ساتھ۔ یہ ا نہیں ہے۔", "ऐन (ع): हल्क़ के बीच को दबाकर आवाज़ के साथ। यह ا नहीं है।"),
    "ء": L("Hamza (ء): a tiny stop deep in the throat.", "ہمزہ (ء): حلق کی گہرائی میں ایک چھوٹا سا ٹھہراؤ۔", "हमज़ा (ء): हल्क़ की गहराई में एक छोटा-सा ठहराव।"),
    "ق": L("Qaaf (ق): from the very back of the tongue, deep and heavy. It is not ک.", "قاف (ق): زبان کی بالکل جڑ سے، گہرا اور موٹا۔ یہ ک نہیں ہے۔", "क़ाफ़ (ق): ज़बान की बिल्कुल जड़ से, गहरा और मोटा। यह क नहीं है।"),
    "ك": L("Kaaf (ك): a little more forward than ق, light.", "کاف (ك): ق سے ذرا آگے سے، باریک۔", "काफ़ (ك): क़ से ज़रा आगे से, बारीक।"),
    "خ": L("Khaa (خ): air rubs at the top of the throat, whispered.", "خا (خ): حلق کے اوپری حصے پر ہوا کی رگڑ، سرگوشی کی طرح۔", "ख़ा (خ): हल्क़ के ऊपरी हिस्से पर हवा की रगड़, सरगोशी की तरह।"),
    "غ": L("Ghayn (غ): like a gentle gargle at the top of the throat, with voice.", "غین (غ): حلق کے اوپری حصے میں ہلکے غرارے جیسی، آواز کے ساتھ۔", "ग़ैन (غ): हल्क़ के ऊपरी हिस्से में हल्के ग़रारे जैसी, आवाज़ के साथ।"),
    "ش": L("Sheen (ش): the middle of the tongue touches the palate, air spreads out.", "شین (ش): زبان کا درمیان تالو سے لگتا ہے، ہوا پھیلتی ہے۔", "शीन (ش): ज़बान का बीच तालू से लगता है, हवा फैलती है।"),
    "ف": L("Faa (ف): upper front teeth touch the inside of the lower lip.", "فا (ف): اوپر کے اگلے دانت نچلے ہونٹ کے اندرونی حصے کو چھوتے ہیں۔", "फ़ा (ف): ऊपर के अगले दाँत नीचे के होंठ के अंदरूनी हिस्से को छूते हैं।"),
    "ا": L("Alif: a long open sound from the empty space of the mouth (jauf); lips relaxed, no touching.", "الف: منہ کے خالی حصے (جوف) سے لمبی کھلی آواز؛ ہونٹ ڈھیلے، کہیں ٹکراؤ نہیں۔", "अलिफ़: मुँह की ख़ाली जगह (जौफ़) से लंबी खुली आवाज़; होंठ ढीले, कहीं टकराव नहीं।"),
    "ب": L("Baa: both lips close fully, then open with a small pop.", "با: دونوں ہونٹ پورے بند ہو کر ہلکی سی آواز کے ساتھ کھلتے ہیں۔", "बा: दोनों होंठ पूरे बंद होकर हल्की-सी आवाज़ के साथ खुलते हैं।"),
    "ج": L("Jeem: the middle of the tongue touches the palate, then releases softly with voice.", "جیم: زبان کا درمیان تالو سے لگ کر نرمی سے آواز کے ساتھ چھوٹتا ہے۔", "जीम: ज़बान का बीच तालू से लगकर नर्मी से आवाज़ के साथ छूटता है।"),
    "ر": L("Raa: the tongue tip taps the gum once or twice, quickly; full after fatha or damma, thin after kasra.", "را: زبان کی نوک مسوڑھے کو ایک دو بار جلدی سے چھوتی ہے؛ زبر اور پیش پر موٹا، زیر پر باریک۔", "रा: ज़बान की नोक मसूड़े को एक-दो बार जल्दी से छूती है; ज़बर और पेश पर मोटा, ज़ेर पर बारीक।"),
    "ل": L("Laam: the tongue tip rests on the gum behind the upper front teeth; the voice flows along both sides.", "لام: زبان کی نوک اوپر کے اگلے دانتوں کے پیچھے مسوڑھے پر، آواز دونوں کناروں سے نکلتی ہے۔", "लाम: ज़बान की नोक ऊपर के अगले दाँतों के पीछे मसूड़े पर, आवाज़ दोनों किनारों से निकलती है।"),
    "م": L("Meem: lips closed, the sound goes through the nose (ghunna).", "میم: ہونٹ بند، آواز ناک سے گزرتی ہے، یعنی غُنّہ۔", "मीम: होंठ बंद, आवाज़ नाक से गुज़रती है, यानी ग़ुन्ना।"),
    "ن": L("Noon: the tongue tip touches the base of the upper front teeth; sound also through the nose.", "نون: زبان کی نوک اوپر کے اگلے دانتوں کی جڑ سے لگتی ہے، آواز ناک سے بھی نکلتی ہے۔", "नून: ज़बान की नोक ऊपर के अगले दाँतों की जड़ से लगती है, आवाज़ नाक से भी निकलती है।"),
    "و": L("Waaw: lips in a small round circle, not touching; a long sound after damma.", "واؤ: ہونٹ چھوٹے گول گھیرے میں، آپس میں نہیں ملتے؛ پیش کے بعد لمبی آواز۔", "वाव: होंठ छोटे गोल घेरे में, आपस में नहीं मिलते; पेश के बाद लंबी आवाज़।"),
    "ي": L("Yaa: the middle of the tongue rises toward the palate, lips slightly spread; a long sound after kasra.", "یا: زبان کا درمیان تالو کی طرف اٹھتا ہے، ہونٹ ہلکے پھیلے ہوئے؛ زیر کے بعد لمبی آواز۔", "या: ज़बान का बीच तालू की तरफ़ उठता है, होंठ हल्के फैले हुए; ज़ेर के बाद लंबी आवाज़।")
  };
  const MSG = {
    sub: L("You read “{h}” instead of “{c}”.", "آپ نے «{c}» کی جگہ «{h}» پڑھا۔", "आपने «{c}» की जगह «{h}» पढ़ा।"),
    del: L("The letter “{c}” was missing or not clear.", "حرف «{c}» نہیں آیا یا صاف نہیں تھا۔", "हर्फ़ «{c}» नहीं आया या साफ़ नहीं था।"),
    madd: L("“{c}” is a long letter (madd). Stretch it for two counts, like “aaa”.", "«{c}» لمبا حرف (مد) ہے۔ اسے دو حرکت کے برابر کھینچیں، جیسے «آآ»۔", "«{c}» लंबा हर्फ़ (मद) है। इसे दो हरकत के बराबर खींचिए, जैसे «आआ»।"),
    vowel: L("On “{c}” you read a different vowel. It should be {v}.", "«{c}» پر آپ نے دوسری حرکت پڑھی۔ یہاں {v} ہے۔", "«{c}» पर आपने दूसरी हरकत पढ़ी। यहाँ {v} है।"),
    vextra: L("“{c}” must be still (sukun). Do not add a sound after it.", "«{c}» ساکن ہے۔ اس کے بعد کوئی آواز نہ بڑھائیں۔", "«{c}» साकिन है। इसके बाद कोई आवाज़ न बढ़ाइए।"),
    tmiss: L("“{c}” has a shadda: press it twice, as if it were two letters.", "«{c}» پر شدّ ہے: اسے دوہرا کر کے پڑھیں، جیسے دو حرف ہوں۔", "«{c}» पर शद्द है: इसे दोहरा करके पढ़िए, जैसे दो हर्फ़ हों।"),
    textra: L("“{c}” has no shadda. Read it once, lightly.", "«{c}» پر شدّ نہیں ہے۔ اسے ایک بار ہلکا پڑھیں۔", "«{c}» पर शद्द नहीं है। इसे एक बार हल्का पढ़िए।"),
    extra: L("An extra sound “{h}” came inside this word.", "اس لفظ کے اندر اضافی آواز «{h}» آ گئی۔", "इस लफ़्ज़ के अंदर अतिरिक्त आवाज़ «{h}» आ गई।"),
    missed: L("This word was not heard.", "یہ لفظ سنائی نہیں دیا۔", "यह लफ़्ज़ सुनाई नहीं दिया।"),
    fix: L("Listen to the qari, watch the 3D, then say it again.", "قاری کو سنیں، 3D دیکھیں، پھر دوبارہ پڑھیں۔", "क़ारी को सुनिए, 3D देखिए, फिर दोबारा पढ़िए।")
  };
  const zoneTxt = c => { const z = LAB_Z[c]; return z && ZONES[z] ? P(ZONES[z][3]) : ""; };
  function explain(w, iss) {
    const c = iss.c, h = iss.hc || iss.h, v = iss.e && iss.e.v ? P(VN[iss.e.v.replace(/^an$/, "a").replace(/^un$/, "u").replace(/^in$/, "i")] || L("", "", "")) : "";
    const m = { c, h, v };
    let lines = [];
    if (iss.type === "sub") lines = ["😮 " + fill(P(MSG.sub), m) + mtBtn("sub", c), LT[c] ? "👅 " + P(LT[c]) + ltBtn(c) : "", zoneTxt(c) ? "📍 " + fill(x("from"), m) + " " + zoneTxt(c) + zBtn(c) : ""];
    else if (iss.type === "del") lines = ["😮 " + fill(P(MSG.del), m) + mtBtn("del", c), LT[c] ? "👅 " + P(LT[c]) + ltBtn(c) : "", zoneTxt(c) ? "📍 " + zoneTxt(c) + zBtn(c) : ""];
    else if (iss.type === "madd-miss") lines = ["😮 " + fill(P(MSG.madd), m) + mtBtn("madd", c)];
    else if (iss.type === "vowel") lines = ["😮 " + fill(P(MSG.vowel), m) + mtBtn("vowel", c)];
    else if (iss.type === "vowel-extra") lines = ["😮 " + fill(P(MSG.vextra), m) + mtBtn("vextra", c)];
    else if (iss.type === "tashdeed-miss") lines = ["😮 " + fill(P(MSG.tmiss), m) + mtBtn("tmiss", c)];
    else if (iss.type === "tashdeed-extra") lines = ["😮 " + fill(P(MSG.textra), m) + mtBtn("textra", c)];
    else if (iss.type === "extra") lines = ["😮 " + fill(P(MSG.extra), m) + mtBtn("extra", c)];
    return lines.filter(Boolean);
  }

  /* ================= data ================= */
  const LET = [["ا", "Alif", "الف", "अलिफ़"], ["ب", "Baa", "با", "बा"], ["ت", "Taa", "تا", "ता"], ["ث", "Thaa", "ثا", "सा"], ["ج", "Jeem", "جیم", "जीम"], ["ح", "Haa", "حا", "हा"], ["خ", "Khaa", "خا", "ख़ा"], ["د", "Daal", "دال", "दाल"], ["ذ", "Dhaal", "ذال", "ज़ाल"], ["ر", "Raa", "را", "रा"], ["ز", "Zaay", "زا", "ज़ा"], ["س", "Seen", "سین", "सीन"], ["ش", "Sheen", "شین", "शीन"], ["ص", "Saad", "صاد", "साद"], ["ض", "Daad", "ضاد", "ज़ाद"], ["ط", "Taa", "طا", "ता"], ["ظ", "Zhaa", "ظا", "ज़ा"], ["ع", "Ayn", "عین", "ऐन"], ["غ", "Ghayn", "غین", "ग़ैन"], ["ف", "Faa", "فا", "फ़ा"], ["ق", "Qaaf", "قاف", "क़ाफ़"], ["ك", "Kaaf", "کاف", "काफ़"], ["ل", "Laam", "لام", "लाम"], ["م", "Meem", "میم", "मीम"], ["ن", "Noon", "نون", "नून"], ["ه", "Haa", "ہا", "हा"], ["و", "Waaw", "واؤ", "वाव"], ["ي", "Yaa", "یا", "या"], ["ء", "Hamza", "ہمزہ", "हमज़ा"]];
  const lname = a => LANG === "ur" ? a[2] : LANG === "hi" ? a[3] : a[1];
  /* body parts → letters (each with the 3D zone it is drawn at). Touching a part plays ALL of them. */
  const Z = (s, z) => [...s.replace(/ /g, "")].map(c => [c, z]);
  const REG = [
    { id: "jawf", ico: "🌬️", n: L("Jauf – empty space", "جوف – خالی جگہ", "जौफ़ – ख़ाली जगह"), d: L("The empty space of mouth and throat: the long vowels (madd).", "منہ اور حلق کی خالی جگہ: لمبے حروف (مد)۔", "मुँह और हल्क़ की ख़ाली जगह: लंबे हुरूफ़ (मद)।"), l: Z("او ي", "jawf") },
    { id: "halq", ico: "🫁", n: L("Halq – throat", "حلق", "हल्क़ – गला"), d: L("Three places in the throat: deepest, middle, top.", "حلق کی تین جگہیں: سب سے گہری، درمیان، اوپر۔", "हल्क़ की तीन जगहें: सबसे गहरी, बीच, ऊपर।"), l: [...Z("ءه", "h1"), ...Z("عح", "h2"), ...Z("غخ", "h3")] },
    { id: "zub", ico: "👅", n: L("Zubaan – tongue (all)", "زبان – سب حروف", "ज़बान – सब"), d: L("The tongue makes most of the letters: root, middle, sides and tip.", "زیادہ تر حروف زبان سے نکلتے ہیں: جڑ، درمیان، کنارہ اور نوک۔", "ज़्यादातर हुरूफ़ ज़बान से निकलते हैं: जड़, बीच, किनारा और नोक।"), l: [...Z("ق", "l1"), ...Z("ك", "l2"), ...Z("جشي", "l3"), ...Z("ض", "l4"), ...Z("لنر", "l5"), ...Z("طدت", "l6"), ...Z("صسز", "l7"), ...Z("ظذث", "l8")] },
    { id: "zr", ico: "🔙", n: L("Tongue root", "زبان کی جڑ", "ज़बान की जड़"), d: L("The back of the tongue touches the soft palate.", "زبان کی جڑ نرم تالو سے لگتی ہے۔", "ज़बान की जड़ नर्म तालू से लगती है।"), l: [...Z("ق", "l1"), ...Z("ك", "l2")] },
    { id: "zm", ico: "⬆️", n: L("Tongue middle", "زبان کا درمیان", "ज़बान का बीच"), d: L("The middle of the tongue meets the palate.", "زبان کا درمیان تالو سے ملتا ہے۔", "ज़बान का बीच तालू से मिलता है।"), l: Z("جشي", "l3") },
    { id: "zs", ico: "↔️", n: L("Tongue side", "زبان کا کنارہ", "ज़बान का किनारा"), d: L("The side of the tongue presses the upper molars.", "زبان کا کنارہ اوپر کی داڑھوں کو دباتا ہے۔", "ज़बान का किनारा ऊपर की दाढ़ों को दबाता है।"), l: Z("ض", "l4") },
    { id: "zt", ico: "👆", n: L("Tongue tip", "زبان کی نوک", "ज़बान की नोक"), d: L("The tip of the tongue: the most letters come from here.", "زبان کی نوک: سب سے زیادہ حروف یہاں سے نکلتے ہیں۔", "ज़बान की नोक: सबसे ज़्यादा हुरूफ़ यहाँ से निकलते हैं।"), l: [...Z("لنر", "l5"), ...Z("طدت", "l6"), ...Z("صسز", "l7"), ...Z("ظذث", "l8")] },
    { id: "dant", ico: "🦷", n: L("Dant – teeth", "دانت", "दाँत"), d: L("Letters made with the teeth: the tongue tip meets the upper or lower front teeth; ف uses the upper teeth.", "دانتوں سے بننے والے حروف: زبان کی نوک اوپر یا نیچے کے اگلے دانتوں سے ملتی ہے؛ ف اوپر کے دانتوں سے۔", "दाँतों से बनने वाले हुरूफ़: ज़बान की नोक ऊपर या नीचे के अगले दाँतों से मिलती है; ف ऊपर के दाँतों से।"), l: [...Z("طدت", "l6"), ...Z("صسز", "l7"), ...Z("ظذث", "l8"), ...Z("ف", "s1")] },
    { id: "hont", ico: "👄", n: L("Hont – lips", "ہونٹ", "होंठ"), d: L("Four letters come from the lips.", "چار حروف ہونٹوں سے نکلتے ہیں۔", "चार हुरूफ़ होंठों से निकलते हैं।"), l: [...Z("ف", "s1"), ...Z("بمو", "s2")] },
    { id: "h1", ico: "🎤", n: L("Voice box – deepest throat", "آواز کی ڈوریاں – حلق کی گہرائی", "आवाज़ की डोरियाँ – हल्क़ की गहराई"), d: L("The deepest part of the throat, next to the voice box: ء and ه.", "حلق کی سب سے گہری جگہ، آواز کی ڈوریوں کے پاس: ء اور ه۔", "हल्क़ की सबसे गहरी जगह, आवाज़ की डोरियों के पास: ء और ه।"), l: Z("ءه", "h1") },
    { id: "naak", ico: "👃", n: L("Naak – nose (ghunnah)", "ناک – غنہ", "नाक – ग़ुन्ना"), d: L("The nasal sound (ghunnah) of ن and م.", "ن اور م کی ناک والی آواز (غنہ)۔", "ن और م की नाक वाली आवाज़ (ग़ुन्ना)।"), l: [["ن", "kh"], ["م", "kh"], ["غُنّة", "kh"]] }
  ];
  /* the names written on the 3D head → which region plays when the student touches them */
  const PART = { lips: "hont", teeth: "dant", tongue: "zub", palate: "zm", soft: "zr", nose: "naak", throat: "halq", jaw: "jawf", folds: "h1" };
  const SUR = "Al-Fatihah|Al-Baqarah|Ali 'Imran|An-Nisa|Al-Ma'idah|Al-An'am|Al-A'raf|Al-Anfal|At-Tawbah|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra|Al-Kahf|Maryam|Ta-Ha|Al-Anbiya|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Ash-Shu'ara|An-Naml|Al-Qasas|Al-'Ankabut|Ar-Rum|Luqman|As-Sajdah|Al-Ahzab|Saba|Fatir|Ya-Sin|As-Saffat|Sad|Az-Zumar|Ghafir|Fussilat|Ash-Shura|Az-Zukhruf|Ad-Dukhan|Al-Jathiyah|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Adh-Dhariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'ah|Al-Hadid|Al-Mujadila|Al-Hashr|Al-Mumtahanah|As-Saff|Al-Jumu'ah|Al-Munafiqun|At-Taghabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqah|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyamah|Al-Insan|Al-Mursalat|An-Naba|An-Nazi'at|'Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Inshiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Ghashiyah|Al-Fajr|Al-Balad|Ash-Shams|Al-Layl|Ad-Duha|Ash-Sharh|At-Tin|Al-'Alaq|Al-Qadr|Al-Bayyinah|Az-Zalzalah|Al-'Adiyat|Al-Qari'ah|At-Takathur|Al-'Asr|Al-Humazah|Al-Fil|Quraysh|Al-Ma'un|Al-Kawthar|Al-Kafirun|An-Nasr|Al-Masad|Al-Ikhlas|Al-Falaq|An-Nas".split("|");
  const QUICK = [[1, 2, "الحمد"], [112, 1, "الإخلاص ١"], [102, 1, "التكاثر"], [108, 1, "الكوثر"], [103, 1, "العصر"], [113, 1, "الفلق"], [114, 1, "الناس"], [2, 143, "البقرة ١٤٣"], [2, 255, "آیۃ الکرسی"]];

  /* ================= data helpers ================= */
  let QTXT = null;
  async function quran() { if (!QTXT) { const r = await fetch("/assistant/q-indopak.json"); QTXT = await r.json(); } return QTXT; }
  const ayahWords = async (s, a) => { const q = await quran(); return CORE.splitWords((q[s - 1] || [])[a - 1] || ""); };
  const exampleOf = async c => { const l = LETTER[c]; if (!l) return null; const w = (await ayahWords(l[0], l[1]))[l[2] - 1]; return w ? { s: l[0], a: l[1], w: l[2], text: w } : null; };

  /* ================= audio: mic, speech stats, wav ================= */
  const MIC = { st: null, ctx: null, cancel: null };
  async function openMic() {
    if (MIC.st && MIC.st.active) return MIC.st;
    MIC.st = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
    if (!MIC.ctx || MIC.ctx.state === "closed") MIC.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (MIC.ctx.state === "suspended") await MIC.ctx.resume();
    return MIC.st;
  }
  function closeMic() { try { MIC.cancel && MIC.cancel("cancel"); } catch (e) {} try { MIC.st && MIC.st.getTracks().forEach(t => t.stop()); } catch (e) {} MIC.st = null; }
  const pct = (arr, p) => { const a = Float32Array.from(arr).sort(); return a[Math.min(a.length - 1, Math.floor(a.length * p))] || 0; };
  /* record one attempt; stops by itself after the student has spoken and then been quiet */
  async function listen(o) {
    const st = await openMic(), ctx = MIC.ctx, src = ctx.createMediaStreamSource(st), proc = ctx.createScriptProcessor(4096, 1, 1), mute = ctx.createGain(); mute.gain.value = 0;
    const chunks = [], t0 = performance.now(), lows = []; let voiced = false, lastV = 0, n = 0;
    return new Promise(res => {
      let ended = false;
      const done = why => { if (ended) return; ended = true; MIC.cancel = null; try { proc.onaudioprocess = null; src.disconnect(); proc.disconnect(); mute.disconnect(); } catch (e) {} const len = chunks.reduce((s, c) => s + c.length, 0), pcm = new Float32Array(len); let k = 0; chunks.forEach(c => { pcm.set(c, k); k += c.length; }); res({ pcm, sr: ctx.sampleRate, why }); };
      MIC.cancel = done;
      proc.onaudioprocess = e => {
        const d = e.inputBuffer.getChannelData(0); chunks.push(new Float32Array(d)); let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
        const rms = Math.sqrt(s / d.length), now = performance.now() - t0; n++; o.onLevel && o.onLevel(rms);
        if (n <= 6) lows.push(rms); const floor = Math.min(0.03, pct(lows, 0.3)), thr = Math.max(0.014, floor * 3);
        if (rms > thr) { voiced = true; lastV = now; }
        if (voiced && now - lastV > o.silenceMs) done("silence"); else if (!voiced && now > (o.waitMs || 9000)) done("nospeech"); else if (now > o.maxMs) done("max");
      };
      src.connect(proc); proc.connect(mute); mute.connect(ctx.destination);
    });
  }
  /* where speech starts/ends and how long it really lasts */
  function stats(pcm, sr) {
    const fl = Math.round(sr * 0.02), r = []; for (let i = 0; i + fl <= pcm.length; i += fl) { let s = 0; for (let j = i; j < i + fl; j++) s += pcm[j] * pcm[j]; r.push(Math.sqrt(s / fl)); }
    if (!r.length) return { dur: 0, start: 0, end: 0, peak: 0 };
    const peak = pct(r, 0.97), floor = pct(r, 0.15), thr = Math.max(0.01, floor * 2.5, peak * 0.12);
    let on = r.map(v => v > thr);
    for (let i = 0; i < on.length; i++) if (!on[i]) { let k = i; while (k < on.length && !on[k]) k++; if (k - i <= 8 && i > 0 && k < on.length) for (let j = i; j < k; j++) on[j] = true; i = k; } /* bridge gaps < 160 ms */
    const first = on.indexOf(true), last = on.lastIndexOf(true); if (first < 0) return { dur: 0, start: 0, end: 0, peak };
    return { dur: on.filter(Boolean).length * 0.02, start: first * 0.02, end: (last + 1) * 0.02, peak };
  }
  async function toWav(pcm, sr, from, to) {
    const a = Math.max(0, Math.floor(from * sr)), b = Math.min(pcm.length, Math.ceil(to * sr)), seg = pcm.slice(a, b);
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext, len = Math.max(1, Math.ceil(seg.length * 16000 / sr)), oc = new OC(1, len, 16000);
    const buf = oc.createBuffer(1, seg.length, sr); buf.copyToChannel(seg, 0); const s = oc.createBufferSource(); s.buffer = buf; s.connect(oc.destination); s.start();
    const out = (await oc.startRendering()).getChannelData(0), v = new DataView(new ArrayBuffer(44 + out.length * 2)), w = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + out.length * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 16000, true); v.setUint32(28, 32000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, out.length * 2, true);
    for (let i = 0; i < out.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, out[i])) * 32767, true);
    let bin = ""; const u = new Uint8Array(v.buffer); for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  /* how long the qari takes (speech only) — to compare speed */
  const REFD = new Map();
  async function refDur(url) {
    if (REFD.has(url)) return REFD.get(url);
    try { const ab = await (await fetch(url)).arrayBuffer(), ctx = MIC.ctx || new (window.AudioContext || window.webkitAudioContext)(), b = await ctx.decodeAudioData(ab); const d = stats(b.getChannelData(0), b.sampleRate).dur; REFD.set(url, d); return d; }
    catch (e) { REFD.set(url, 0); return 0; }
  }

  /* ================= AI: blind transcription ================= */
  const SYS = "You are a speech-to-text engine for Qur'an recitation, NOT a teacher. Transcribe EXACTLY the sounds you hear, word by word, in Arabic script WITH full diacritics (harakat, shadda, sukun, tanween).\nRules:\n1) Never correct the reciter. If a letter is pronounced wrongly (for example س instead of ص, ت instead of ط, د instead of ض, ه instead of ح, ا instead of ع, ك instead of ق) write the letter you actually hear.\n2) Never complete or continue the verse and never add words that were not spoken. If the reciter stops, stop.\n3) Do not use your memory of the Qur'an to guess unclear parts: write [?] for any word you cannot make out.\n4) Write long vowels with ا و ي exactly as heard; if a vowel is short, write it short.\n5) If there is no recitation (silence, noise, another language) return an empty list.\nReply ONLY with JSON: {\"words\":[\"...\"],\"notes\":\"one short sentence about audio quality, optional\"}";
  let AIM = null;
  const COACH_MODEL = "gemini-3.5-flash-lite"; /* switch to a stronger model once billing is on (see notes) */
  async function aiModel() {
    if (AIM) return AIM;
    try { const { app, getAI, getGenerativeModel, GoogleAIBackend } = await aiBoot();
      AIM = getGenerativeModel(getAI(app, { backend: new GoogleAIBackend() }), { model: COACH_MODEL, systemInstruction: SYS, generationConfig: { responseMimeType: "application/json", temperature: 0.1 } }); }
    catch (e) { AIM = null; }
    return AIM;
  }
  async function transcribe(b64, take) {
    if (window.__coachTranscribe) return window.__coachTranscribe(b64, take);
    const m = await aiModel(); if (!m) throw new Error("ai");
    const req = { contents: [{ role: "user", parts: [{ inlineData: { mimeType: "audio/wav", data: b64 } }, { text: ["Transcribe.", "Second independent take: write only what is literally pronounced, letter by letter.", "Third independent take: listen carefully to each consonant and each vowel, then write exactly what you hear."][take || 0] }] }] };
    if (take) req.generationConfig = { responseMimeType: "application/json", temperature: 0.3 + take * 0.1 };
    let last; for (let k = 0; k < 2; k++) { try { const r = await m.generateContent(req); const j = JSON.parse(r.response.text().replace(/^```json|```$/g, "").trim()); return { words: (j.words || []).map(String), notes: j.notes || "" }; } catch (e) { last = e; await new Promise(r => setTimeout(r, 700)); } }
    throw last;
  }

  /* ================= the checking pipeline ================= */
  async function evaluate(rec, tgt) {
    const st = stats(rec.pcm, rec.sr);
    if (st.dur < 0.25 || st.peak < 0.02) return { err: "nospeech" };
    const b64 = await toWav(rec.pcm, rec.sr, st.start - 0.25, st.end + 0.35);
    const rd = await refDur(tgt.refUrl), ratio = rd ? st.dur / rd : 1;
    const ex = tgt.words, strip = a => a.filter(w => !/\[\?\]/.test(w)), unclear = h => h.words.some(w => /\[\?\]/.test(w));
    const h1 = await transcribe(b64, 0), r1 = CORE.compare(ex, strip(h1.words), {});
    const lenient = ratio < 1.5; /* extra words at the very start/end while the length matches the qari = the AI imagined them */
    let res, heard = [h1.words];
    if (r1.pass && !unclear(h1)) res = Object.assign(r1, { unsure: false });
    else { /* two more independent listens, then a vote: only what most of them heard counts as a mistake */
      const hs = await Promise.all([transcribe(b64, 1).catch(() => null), transcribe(b64, 2).catch(() => null)]), got = hs.filter(Boolean);
      const all = [h1].concat(got), rs = all.map(h => CORE.compare(ex, strip(h.words), {}));
      res = rs.length < 2 ? Object.assign(r1, { unsure: true, pass: false }) : CORE.merge(rs, { ignoreExtras: lenient });
      if (all.filter(unclear).length * 2 > all.length) res.unsure = true, res.pass = false;
      heard = all.map(h => h.words);
    }
    if (res.extra && res.extra.length && lenient && res.extra.every(e => e.pos !== "mid")) { res.extra = []; res.pass = res.words.every(w => w.status === "ok") && !res.unsure; }
    res.ratio = ratio; res.st = st; res.heard = heard;
    return res;
  }

  /* ================= Ustad avatar ================= */
  const AVATAR = `<svg viewBox="0 0 200 230" class="ust" role="img" aria-label="Ustad"><defs><linearGradient id="ust-rb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a8f6e"/><stop offset="1" stop-color="#145d47"/></linearGradient><linearGradient id="ust-tb" x1="0" x2="1"><stop offset="0" stop-color="#fff9ec"/><stop offset="1" stop-color="#eadfc6"/></linearGradient><radialGradient id="ust-sk" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#f6d2ae"/><stop offset="1" stop-color="#e2ab80"/></radialGradient></defs>
  <path d="M18 230C18 176 62 152 100 152s82 24 82 78Z" fill="url(#ust-rb)"/><path d="M82 152l18 30 18-30z" fill="#fbf3e2"/><path d="M100 182v48" stroke="#0f4a39" stroke-width="2"/>
  <rect x="86" y="128" width="28" height="30" rx="10" fill="#d89d72"/>
  <ellipse cx="55" cy="98" rx="7" ry="11" fill="#e2ab80"/><ellipse cx="145" cy="98" rx="7" ry="11" fill="#e2ab80"/>
  <ellipse cx="100" cy="92" rx="45" ry="52" fill="url(#ust-sk)"/>
  <path d="M54 96c-2 42 20 66 46 66s48-24 46-66c-6 24-20 32-46 32S60 120 54 96Z" fill="#f5f2ec"/><path d="M60 116c8 12 24 16 40 16s32-4 40-16c-4 26-20 38-40 38s-36-12-40-38Z" fill="#ebe7df" opacity=".7"/>
  <path d="M74 118c10-6 18-6 26-2 8-4 16-4 26 2-6 8-14 10-26 8-12 2-20 0-26-8Z" fill="#f8f6f1"/>
  <g class="u-mouth"><path class="u-m0" d="M86 124q14 8 28 0" fill="none" stroke="#7a3b2e" stroke-width="3" stroke-linecap="round"/><ellipse class="u-mo" cx="100" cy="127" rx="9" ry="1" fill="#5a1f1f"/></g>
  <path d="M97 98q3 8 6 0" fill="none" stroke="#c98d63" stroke-width="2" stroke-linecap="round"/>
  <g class="u-eyes"><ellipse class="u-e" cx="82" cy="88" rx="6" ry="6.5" fill="#fff"/><ellipse class="u-e" cx="118" cy="88" rx="6" ry="6.5" fill="#fff"/><circle class="u-p" cx="82" cy="89" r="3.4" fill="#2b1a10"/><circle class="u-p" cx="118" cy="89" r="3.4" fill="#2b1a10"/><circle cx="83.2" cy="87.6" r="1.1" fill="#fff"/><circle cx="119.2" cy="87.6" r="1.1" fill="#fff"/></g>
  <path class="u-b" d="M72 77q10-7 20-2M108 75q10-5 20 2" fill="none" stroke="#d8d4cc" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M48 70C44 28 156 28 152 70c-10-12-34-18-52-18S58 58 48 70Z" fill="url(#ust-tb)"/><path d="M52 66c12-8 30-12 48-12s36 4 48 12" fill="none" stroke="#c8a24a" stroke-width="5" stroke-linecap="round"/>
  <path d="M60 52c14-16 66-16 80 0" fill="none" stroke="#d9cfb5" stroke-width="2.5"/><path d="M72 40c10-8 46-8 56 0" fill="none" stroke="#d9cfb5" stroke-width="2.5"/><path d="M88 30c8-5 16-5 24 0" fill="none" stroke="#d9cfb5" stroke-width="2.5"/>
  <g class="u-glow"><circle cx="100" cy="100" r="104" fill="none" stroke="#2cc4f2" stroke-width="3" opacity="0"/></g></svg>`;
  /* the same friendly Ustad face on the floating "Ask AI Ustad" button and in the chat drawer */
  const putFace = () => {}; /* the fab and drawer already show the real Ustad photo (ustad/thumb.webp) */

  /* ================= the page ================= */
  const CS = { tab: "h", sel: null, s: 112, a: 1, words: [], tgt: null, drill: null, tries: {}, auto: LS.get("qsai-coach-auto", true), tts: LS.get("qsai-coach-tts", false), run: 0, lab: null, busy: false, mood: "idle" };
  const css = `
.cch{--cg:#2cc4f2}.cch .chd{display:grid;grid-template-columns:112px minmax(0,1fr);gap:12px;align-items:center;margin:8px 0 12px}
.cch .ustw{width:112px;height:124px;position:relative;border-radius:22px;background:#d8c7a3;border:2px solid rgba(255,233,168,.7);overflow:hidden;box-shadow:0 10px 24px -12px rgba(0,0,0,.7)}
.cch .ust{width:100%;height:100%;display:block}.cch .u-mo{transition:ry .08s}.cch .talk .u-mo{animation:umo .32s infinite alternate}@keyframes umo{from{ry:1}to{ry:7}}
.cch .talk .ust{animation:ubob .6s infinite alternate ease-in-out}@keyframes ubob{to{transform:translateY(2px)}}
.cch .u-e{animation:ublink 5s infinite}@keyframes ublink{0%,94%,100%{ry:6.5}96%{ry:.6}}
.cch .listen{box-shadow:0 0 0 3px var(--cg),0 0 22px rgba(44,196,242,.6)!important;animation:ugl 1.2s infinite}@keyframes ugl{50%{box-shadow:0 0 0 3px rgba(44,196,242,.3)}}
.cch .think .u-p{transform:translateY(-3px)}.cch .happy .u-m0{d:path("M84 122q16 14 32 0")}.cch .sad .u-b{transform:translateY(-3px)}.cch .sad .u-m0{d:path("M88 130q12-8 24 0")}
.cch .bub{background:var(--card2);border:1px solid var(--line);border-radius:18px;padding:12px 14px;font-size:15px;line-height:1.7;position:relative;min-height:60px}
.cch .bub b{color:var(--gold2)}.cch .tabs{display:flex;gap:6px;margin:6px 0 12px;flex-wrap:wrap}.cch .tabs button{flex:1;min-width:92px;padding:10px 8px;border-radius:14px;border:1px solid var(--line);background:var(--card);font:700 15px Outfit,inherit}
.cch .tabs button[aria-selected=true]{background:linear-gradient(135deg,var(--gold),#c98a26);color:#1a0f08;border:0}
.cch .tog{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}.cch .tog button{font-size:13px;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--mut)}.cch .tog button.on{background:rgba(63,207,142,.16);color:var(--ok);border-color:rgba(63,207,142,.5)}
.cch .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin:10px 0}
.cch .cht{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:6px 4px 8px;display:grid;gap:0;justify-items:center;min-height:78px;transition:transform .15s}
.cch .cht b{font:400 36px/1.5 "Amiri Quran","Noto Naskh Arabic",serif;color:var(--gold2)}.cch .cht small{font-size:12px;color:var(--mut)}
.cch .cht.on{background:rgba(227,170,60,.2);border-color:var(--gold);box-shadow:0 0 0 3px rgba(227,170,60,.25)}.cch .cht.playing{box-shadow:0 0 0 3px var(--cg)}.cch .cht:active{transform:scale(.95)}
.cch .rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:10px 0}
.cch .rgt{text-align:start;background:linear-gradient(180deg,var(--card2),var(--card));border:1px solid var(--line);border-radius:18px;padding:12px;display:grid;gap:6px;min-height:104px}
.cch .rgt i{font-style:normal;font-size:28px}.cch .rgt b{font-size:15px}.cch .rgt span{font:400 20px/1.5 "Amiri Quran",serif;color:var(--gold2);direction:rtl;letter-spacing:.1em}.cch .rgt.on{border-color:var(--cg);box-shadow:0 0 0 3px rgba(44,196,242,.25)}
.cch .card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;margin:10px 0;display:grid;gap:8px}.cch .card h4{margin:0}.cch .mini{color:var(--mut);font-size:13px}
.cch .big{font:400 clamp(46px,14vw,80px)/1.4 "Amiri Quran","Noto Naskh Arabic",serif;color:var(--gold2);text-align:center;direction:rtl}
.cch .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.cch .row .btn{padding:9px 14px;font-size:14px}
.cch .ay{direction:rtl;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:12px;border:1px solid var(--line);border-radius:18px;background:rgba(0,0,0,.22)}
.cch .chw{font:400 clamp(26px,6.5vw,38px)/1.7 "Amiri Quran","Noto Naskh Arabic",serif;color:var(--gold2);background:var(--card);border:1px solid var(--line);border-radius:14px;padding:0 12px;min-height:52px}
.cch .chw.on{border-color:var(--cg);box-shadow:0 0 0 3px rgba(44,196,242,.3)}.cch .chw.playing{background:rgba(44,196,242,.18)}
.cch .chw.ok{border-color:var(--ok);background:rgba(63,207,142,.14)}.cch .chw.harakat{border-color:#f6a53c;background:rgba(246,165,60,.16)}.cch .chw.letter,.cch .chw.missed{border-color:var(--bad);background:rgba(255,107,107,.16)}.cch .chw.unsure{border-style:dashed;border-color:var(--mut)}
.cch select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:12px;padding:9px 10px;font:inherit;max-width:100%}
.cch .qk{display:flex;gap:6px;flex-wrap:wrap}.cch .qk button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 12px;font:400 17px "Amiri Quran",serif}
.cch .micw{display:grid;justify-items:center;gap:8px;padding:6px 0}.cch .mic{width:92px;height:92px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--mar2),var(--mar));color:#fff;font-size:34px;box-shadow:0 12px 30px -10px rgba(160,29,52,.9);position:relative}
.cch .mic.on{background:linear-gradient(135deg,#ff6b6b,#d62f4a);animation:mpulse 1.1s infinite}@keyframes mpulse{50%{box-shadow:0 0 0 18px rgba(255,107,107,.0),0 12px 30px -10px rgba(255,107,107,.9)}}
.cch .lv{width:min(260px,70%);height:8px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}.cch .lv i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ok),var(--gold));transition:width .06s}
.cch .rs{display:grid;gap:10px}.cch .sc{display:flex;gap:14px;align-items:center}.cch .ring{--p:0}.cch .rate{font-weight:800;font-size:18px}
.cch .iss{border-inline-start:4px solid var(--bad);background:rgba(255,107,107,.07);border-radius:12px;padding:10px 12px;display:grid;gap:4px;line-height:1.7}.cch .iss.h{border-color:#f6a53c;background:rgba(246,165,60,.08)}.cch .iss .ar{font-size:26px;color:var(--gold2)}
.cch .okb{border-inline-start:4px solid var(--ok);background:rgba(63,207,142,.08);border-radius:12px;padding:10px 12px}
.cch .mlab{margin-top:6px}.cch .mlall{display:none}
.cch .wd{display:flex;gap:6px;justify-content:center;direction:rtl;flex-wrap:wrap}.cch .wd button{font:400 30px/1.6 "Amiri Quran",serif;background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:0 10px;color:var(--gold2)}
@media (max-width:520px){.cch .chd{grid-template-columns:72px minmax(0,1fr)}.cch .ustw{width:72px;height:84px}}
@media (prefers-reduced-motion:reduce){.cch *{animation:none!important}}`;

  async function viewCoach(arg) {
    const app = $("#app"); stopAll(); CS.run++; const my = CS.run; CS.sel = null; CS.tgt = null; CS.drill = null; CS.tries = {};
    if (!$("#cch-css")) { const st = document.createElement("style"); st.id = "cch-css"; st.textContent = css; document.head.appendChild(st); }
    if (arg && /^[hma]$/.test(arg)) CS.tab = arg;
    app.innerHTML = `<section class="sec cch"><p><a class="btn sm" href="#home">← ${t("back")}</a></p><h2>🎓 ${x("title")}</h2><p class="lead">${x("sub")}</p>
      <div class="chd"><div class="ustw" id="chu"></div><div class="bub" id="chb"></div></div>
      <div class="tog"><button id="chAuto" class="${CS.auto ? "on" : ""}">🔁 ${x("auto")}</button><button id="chTts" class="${CS.tts ? "on" : ""}">🔊 ${x("voice")}</button></div>
      ${labHTML(new Set())}
      <div class="tabs" role="tablist"><button role="tab" data-t="h">🔤 ${x("tabH")}</button><button role="tab" data-t="m">🗺️ ${x("tabM")}</button><button role="tab" data-t="a">📖 ${x("tabA")}</button></div>
      <div id="chBody"></div><div id="chCheck"></div><p class="mini">ℹ️ ${x("honest")}</p></section>`;
    window.QSUstad && QSUstad.mount($("#chu"));
    const LB = wireLab(app); CS.lab = LB;
    $(".mlab", app).addEventListener("mlpart", e => { const r = REG.find(q => q.id === PART[e.detail]); if (!r) return; CS.tab = "m"; CS.run++; closeMic(); LB.stop(); tab(); playRegion(r, $(`.rgt[data-r="${r.id}"]`)); });
    const hash = () => { const stop = () => { CS.run++; closeMic(); LB && LB.stop(); stopSay(); removeEventListener("hashchange", stop); }; addEventListener("hashchange", stop, { once: false }); };
    hash();
    $("#chAuto").onclick = e => { CS.auto = !CS.auto; LS.set("qsai-coach-auto", CS.auto); e.currentTarget.classList.toggle("on", CS.auto); };
    $("#chTts").onclick = e => { CS.tts = !CS.tts; LS.set("qsai-coach-tts", CS.tts); e.currentTarget.classList.toggle("on", CS.tts); if (CS.tts) ust(x("hello"), "talk"); else stopSay(); };
    $$(".tabs button", app).forEach(b => b.onclick = () => { CS.tab = b.dataset.t; CS.run++; closeMic(); LB.stop(); tab(); });
    tab();

    /* ---- Ustad: face + speech bubble ---- */
    function mood(m) { const u = $("#chu"); if (!u) return; u.className = "ustw " + m; }
    function ust(msg, m) { const b = $("#chb"); if (!b) return; b.innerHTML = msg; mood(m || "talk"); if (window.QSUstad) { if (m === "happy") QSUstad.emote(); else if ((m || "talk") === "talk" && !CS.tts) QSUstad.say(msg.replace(/<[^>]+>/g, " ")); } if (m === "talk" || m === "happy" || m === "sad") setTimeout(() => $("#chu") && $("#chu").classList.contains(m) && mood("idle"), Math.min(9000, 1200 + msg.length * 55)); speak(msg); }
    /* the Ustad's own recorded voice (never the phone's voice): fixed phrases are pre-recorded; other lines are shown as text only */
    const SAYK = ["hello", "helloM", "helloA", "listen", "think", "nospeech", "micNo", "aiNo", "okAll", "wordOk", "drill", "tries", "fast", "unsure", "playAll"];
    let sayEl = null;
    app.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-lt],[data-mt],[data-zs]"); if (!b) return; stopSay(); const lt = () => { try { sayEl = sayAudio("lt_" + b.dataset.lt.codePointAt(0).toString(16)); sayEl.play().catch(() => {}); } catch (er) {} };
      if (b.dataset.zs) { try { sayEl = sayAudio("z_" + b.dataset.zs); sayEl.play().catch(() => {}); } catch (er) {} return; }
      if (b.dataset.mt) { try { sayEl = sayAudio("m_" + b.dataset.mt); if (b.dataset.lt) sayEl.onended = lt; sayEl.play().catch(() => {}); } catch (er) {} } else lt(); });
    const cleanT = t => String(t).replace(/<[^>]+>/g, " ").replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B50]/gu, " ").replace(/\s+/g, " ").trim();
    function stopSay() { try { sayEl && sayEl.pause(); } catch (e) {} sayEl = null; }
    function speak(msg) {
      if (!CS.tts) return; stopSay(); const t = cleanT(msg);
      let k = SAYK.find(key => X[key] && cleanT(x(key)) === t); if (!k && X.fix == null && cleanT(P(MSG.fix)) === t) k = "fix";
      if (!k) { const p = SAYK.find(key => X[key] && t.endsWith(cleanT(x(key)))); k = p || (t.endsWith(cleanT(P(MSG.fix))) ? "fix" : null); }
      if (!k) return;
      try { sayEl = sayAudio("" + k); sayEl.play().catch(() => {}); } catch (e) {}
    }
    const talking = ms => { mood("talk"); setTimeout(() => mood("idle"), ms); };

    /* ---- tabs ---- */
    function tab() {
      $$(".tabs button", app).forEach(b => b.setAttribute("aria-selected", b.dataset.t === CS.tab));
      $("#chCheck").innerHTML = ""; CS.tgt = null;
      if (CS.tab === "h") tabH(); else if (CS.tab === "m") tabM(); else tabA();
    }
    /* ---- Huroof takhti ---- */
    function tabH() {
      ust(x("hello"), "talk");
      $("#chBody").innerHTML = `<div class="grid" id="chG">${LET.map(a => `<button class="cht" data-c="${a[0]}"><b>${a[0]}</b><small>${lname(a)}</small></button>`).join("")}</div><div id="chInfo"></div>`;
      $$(".cht", app).forEach(b => b.onclick = () => pickLetter(b.dataset.c, b));
    }
    async function pickLetter(c, btn) {
      CS.run++; closeMic(); const my2 = CS.run; $$(".cht", app).forEach(k => k.classList.toggle("on", k === btn)); const a = LET.find(r => r[0] === c), z = LAB_Z[c], ex = await exampleOf(c);
      $("#chInfo").innerHTML = `<div class="card"><div class="big">${c}</div><div class="row"><b>${lname(a)}</b>${z ? `<span class="mini">📍 ${x("from")} ${esc(P(ZONES[z][3]))}${zBtn(c)}</span>` : ""}</div>${LT[c] ? `<p style="margin:0">👅 ${esc(P(LT[c]))}${ltBtn(c)}</p>` : ""}
        ${ex ? `<div class="row"><span class="mini">${x("ex")}</span><span class="ar" style="font-size:32px;color:var(--gold2)">${esc(disp(ex.text))}</span></div>` : ""}
        <div class="row"><button class="btn sm cy" id="chL1">🔊 ${x("listenQ")}</button><button class="btn sm" id="chL2">🎬 ${x("see3d")}</button></div></div>`;
      const play = () => LB.say(c, btn); $("#chL1").onclick = play; $("#chL2").onclick = () => LB.say(c, btn);
      play();
      if (ex) arm({ kind: "word", words: [ex.text], refUrl: QARI_WORD(ex.s, ex.a, ex.w), clip: [{ s: ex.s, a: ex.a, w: ex.w }], focus: c, label: ex.text });
    }
    /* ---- Makharij map ---- */
    function tabM() {
      ust(x("helloM"), "talk");
      $("#chBody").innerHTML = `<div class="rg">${REG.map(r => `<button class="rgt" data-r="${r.id}"><i>${r.ico}</i><b>${P(r.n)}</b><span>${r.l.map(p => p[0]).filter((v, i, a) => a.indexOf(v) === i).join(" ")}</span></button>`).join("")}</div><div id="chInfo"></div>`;
      $$(".rgt", app).forEach(b => b.onclick = () => playRegion(REG.find(r => r.id === b.dataset.r), b));
    }
    async function playRegion(r, btn) {
      CS.run++; closeMic(); LB.stop(); const my2 = CS.run; $$(".rgt", app).forEach(k => k.classList.toggle("on", k === btn));
      const lets = r.l.filter((p, i, a) => a.findIndex(q => q[0] === p[0] && q[1] === p[1]) === i);
      $("#chInfo").innerHTML = `<div class="card"><h4>${r.ico} ${P(r.n)}</h4><p style="margin:0">${P(r.d)}</p><div class="grid" id="chRG">${lets.map(p => `<button class="cht" data-c="${p[0]}" data-z="${p[1]}"><b>${p[0].length > 1 ? "ـنّ" : p[0]}</b><small>${p[0].length > 1 ? "ghunnah" : ""}</small></button>`).join("")}</div><div class="row"><button class="btn sm" id="chRS">⏹ ${x("stop")}</button><span class="mini">${x("playAll")}</span></div></div>`;
      $("#chRS").onclick = () => { CS.run++; LB.stop(); $$("#chRG .cht").forEach(k => k.classList.remove("on")); };
      $$("#chRG .cht").forEach(b => b.onclick = () => { CS.run++; LB.stop(); $$("#chRG .cht").forEach(k => k.classList.toggle("on", k === b)); LB.say(b.dataset.c, b, b.dataset.z); });
      ust(`${r.ico} <b>${P(r.n)}</b> — ${P(r.d)}`, "talk");
      for (const [c, z] of lets) { if (my2 !== CS.run) return; const b = $(`#chRG .cht[data-c="${c}"]`); $$("#chRG .cht").forEach(k => k.classList.toggle("on", k === b)); await LB.say(c, b, z); }
      $$("#chRG .cht").forEach(k => k.classList.remove("on"));
    }
    /* ---- Ayah reading ---- */
    async function tabA() {
      ust(x("helloA"), "talk");
      $("#chBody").innerHTML = `<div class="card"><div class="row"><label class="mini">${x("sura")}</label><select id="chS">${SUR.map((n, i) => `<option value="${i + 1}" ${i + 1 === CS.s ? "selected" : ""}>${i + 1} · ${n}</option>`).join("")}</select><label class="mini">${x("ayah")}</label><select id="chAy"></select></div>
        <div class="qk" id="chQ"><span class="mini">${x("quick")}:</span>${QUICK.map(q => `<button data-s="${q[0]}" data-a="${q[1]}">${q[2]}</button>`).join("")}</div></div><div id="chAyah"></div>`;
      $("#chS").onchange = async e => { CS.s = +e.target.value; CS.a = 1; await fillAy(); showAyah(); };
      $("#chAy").onchange = e => { CS.a = +e.target.value; showAyah(); };
      $$("#chQ button").forEach(b => b.onclick = async () => { CS.s = +b.dataset.s; CS.a = +b.dataset.a; $("#chS").value = CS.s; await fillAy(); showAyah(); });
      await fillAy(); showAyah();
    }
    async function fillAy() { const q = await quran(), n = (q[CS.s - 1] || []).length; $("#chAy").innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}" ${i + 1 === CS.a ? "selected" : ""}>${i + 1}</option>`).join(""); if (CS.a > n) CS.a = 1; $("#chAy").value = CS.a; }
    async function showAyah() {
      CS.run++; closeMic(); LB.stop(); const my2 = CS.run, s = CS.s, a = CS.a, words = await ayahWords(s, a); CS.words = words; CS.drill = null; $("#chCheck").innerHTML = "";
      $("#chAyah").innerHTML = `<div class="card"><div class="ay" id="chAW">${words.map((w, i) => `<button class="chw" data-i="${i}">${esc(disp(w))}</button>`).join("")}</div>
        <div class="row" style="justify-content:center"><button class="btn pri" id="chSp">🔊 ${x("whole")}</button><button class="btn" id="chWb">▶ ${x("wbw")}</button></div><div id="chWp"></div></div>`;
      $$(".chw", app).forEach(b => b.onclick = () => pickWord(+b.dataset.i, b));
      $("#chSp").onclick = e => { CS.run++; LB.stop(); const b = e.currentTarget; b.classList.contains("playing") ? stopAll() : playQari([{ s, a }], b); };
      $("#chWb").onclick = async e => { const b = e.currentTarget; CS.run++; const m3 = CS.run; for (let i = 0; i < words.length; i++) { if (m3 !== CS.run) return; const wb = $(`.chw[data-i="${i}"]`); wb.classList.add("playing"); await playQari([{ s, a, w: i + 1 }], wb); wb.classList.remove("playing"); } };
      armAyah();
    }
    function armAyah() { CS.drill = null; $$(".chw", app).forEach(b => b.classList.remove("on")); $("#chWp").innerHTML = ""; arm({ kind: "ayah", words: CS.words, refUrl: QARI_AYAH(CS.s, CS.a), clip: [{ s: CS.s, a: CS.a }], label: CS.words.join(" ") }); }
    function pickWord(i, btn) {
      CS.run++; closeMic(); LB.stop(); $$(".chw", app).forEach(k => k.classList.toggle("on", k === btn)); CS.drill = i; const w = CS.words[i], s = CS.s, a = CS.a;
      const letters = [...CORE.skeleton(w)];
      $("#chWp").innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><b>${x("onlyWord")}</b><button class="btn sm" id="chBack">↩ ${x("whole")}</button></div><div class="wd">${letters.map((c, k) => `<button data-c="${c}">${c}</button>`).join("")}</div><div class="row"><button class="btn sm cy" id="chW1">🔊 ${x("listenQ")}</button><button class="btn sm" id="chW3">🎬 ${x("slow")}</button></div></div>`;
      $("#chBack").onclick = armAyah; $$("#chWp .wd button").forEach(b => b.onclick = () => { CS.run++; LB.say(b.dataset.c, b); });
      $("#chW1").onclick = () => playQari([{ s, a, w: i + 1 }], $("#chW1")); $("#chW3").onclick = () => walkWord(i);
      playQari([{ s, a, w: i + 1 }], btn); arm({ kind: "word", words: [w], refUrl: QARI_WORD(s, a, i + 1), clip: [{ s, a, w: i + 1 }], label: w, wordIdx: i });
    }
    async function walkWord(i) { /* letter by letter in 3D, no chopped audio, then the whole word */
      CS.run++; const m2 = CS.run, w = CS.words[i]; const cs = [...CORE.skeleton(w)];
      for (const c of cs) { if (m2 !== CS.run) return; const z = LAB_Z[c]; if (!z) continue; await LB.lab.to(c, z, 800); await new Promise(r => setTimeout(r, 900)); }
      if (m2 !== CS.run) return; await LB.lab.rest(500); await playQari([{ s: CS.s, a: CS.a, w: i + 1 }], $("#chW1"));
    }

    /* ---- the check panel ---- */
    function arm(tgt) {
      CS.tgt = tgt; CS.busy = false;
      $("#chCheck").innerHTML = `<div class="card"><div class="mini">${tgt.kind === "ayah" ? x("target") : x("onlyWord")}</div>${tgt.kind === "ayah" ? "" : `<div class="ar" style="font-size:36px;text-align:center;color:var(--gold2)">${esc(disp(tgt.label))}</div>`}<div class="micw"><button class="mic" id="chMic" aria-label="mic">🎤</button><div class="lv"><i id="chLv"></i></div><div class="mini" id="chSt">${x("mic")}</div></div><div id="chRes"></div></div>`;
      $("#chMic").onclick = () => attempt();
    }
    async function attempt() {
      if (CS.busy) { MIC.cancel && MIC.cancel("manual"); return; }
      const tgt = CS.tgt, m = CS.run; if (!tgt) return; CS.busy = true; LB.stop(); stopAll(); stopSay();
      const mic = $("#chMic"), lv = $("#chLv"), stt = $("#chSt"), res = $("#chRes"); res.innerHTML = "";
      let rec;
      try { mic.classList.add("on"); stt.textContent = x("listen"); mood("listen"); rec = await listen({ silenceMs: tgt.kind === "ayah" ? 1500 : 1100, maxMs: tgt.kind === "ayah" ? 60000 : 12000, waitMs: 9000, onLevel: r => lv && (lv.style.width = Math.min(100, r * 700) + "%") }); }
      catch (e) { CS.busy = false; mic.classList.remove("on"); mood("idle"); ust(x("micNo"), "sad"); return; }
      mic.classList.remove("on"); lv.style.width = "0"; if (m !== CS.run) { CS.busy = false; return; }
      if (rec.why === "cancel") { CS.busy = false; mood("idle"); return; }
      stt.textContent = x("think"); mood("think"); ust(x("think"), "think");
      let r; try { r = await evaluate(rec, tgt); } catch (e) { CS.busy = false; stt.textContent = x("mic"); ust(x("aiNo"), "sad"); return; }
      CS.busy = false; if (m !== CS.run) return; stt.textContent = x("mic");
      if (r.err) { ust(x("nospeech"), "sad"); return; }
      show(r, tgt);
    }
    const rateOf = sc => P(X.rate.find(r => sc >= r[0])[1]);
    function show(r, tgt) {
      const m = CS.run, key = tgt.kind + ":" + CS.s + ":" + CS.a + ":" + (tgt.wordIdx != null ? tgt.wordIdx : tgt.label); CS.tries[key] = (CS.tries[key] || 0) + 1;
      /* colour the word tiles of the ayah */
      if (tgt.kind === "ayah") $$(".chw", app).forEach((b, i) => { const st = r.words[i] ? r.words[i].status : ""; b.classList.remove("ok", "harakat", "letter", "missed", "unsure"); st && b.classList.add(st); });
      else if (tgt.wordIdx != null) { const b = $(`.chw[data-i="${tgt.wordIdx}"]`); if (b) { b.classList.remove("ok", "harakat", "letter", "missed", "unsure"); b.classList.add(r.words[0].status); } }
      const bad = r.words.filter(w => w.status !== "ok"), sc = r.unsure && !bad.length ? null : r.score;
      let html = "";
      if (sc != null) html += `<div class="sc"><div class="ring" style="--p:${sc}"><span>${sc}%</span></div><div><div class="rate">${rateOf(sc)}</div><div class="mini">${x("score")}</div></div></div>`;
      if (r.pass) html += `<div class="okb">✅ ${x("okAll")}</div>`;
      bad.forEach(w => {
        const wt = esc(disp(w.text));
        if (w.status === "unsure") { html += `<div class="iss h"><span class="ar">${wt}</span>🤔 ${x("unsure")}</div>`; return; }
        const blocks = w.issues.map(iss => explain(w, iss).map(l => `<div>${esc(l)}</div>`).join("")).filter(Boolean), cs = [...new Set(w.issues.map(i => i.c).filter(Boolean))];
        html += `<div class="iss"><span class="ar">${wt}</span>${w.status === "missed" ? `<div>😮 ${P(MSG.missed)}${mtBtn("missed", "")}</div>` : blocks.join('<hr style="border:0;border-top:1px dashed var(--line);width:100%">')}<div>👉 ${P(MSG.fix)}</div><div class="row">${cs.map(c => `<button class="btn sm" data-3d="${c}">🎬 ${x("see3d")} «${c}»</button>`).join("")}<button class="btn sm cy" data-q="${w.i}">🔊 ${x("listenQ")}</button></div>${w.unsure ? `<div class="mini">🤔 ${x("unsure")}</div>` : ""}</div>`;
      });
      if (r.extra && r.extra.length) html += `<div class="iss h">➕ ${x("extra")}<span class="ar">${esc(r.extra.map(e => e.letters).join(" · "))}</span></div>`;
      if (r.unsure && !bad.length) html += `<div class="iss h">🤔 ${x("unsure")}</div>`;
      if (r.ratio && r.ratio < 0.5 && tgt.kind === "ayah" && !r.pass) html += `<div class="iss h">⏩ ${x("fast")}</div>`;
      html += `<div class="row"><button class="btn pri" id="chRe">🔁 ${x("again")}</button><button class="btn" id="chQ1">🔊 ${x("listenQ")}</button>${r.pass && tgt.kind === "ayah" ? `<button class="btn cy" id="chNx">➡ ${x("next")}</button>` : ""}${(CS.tries[key] >= 3 && !r.pass && tgt.wordIdx != null) ? `<button class="btn" id="chSk">${x("skip")}</button>` : ""}</div>`;
      $("#chRes").innerHTML = `<div class="rs">${html}</div>`;
      $$("#chRes [data-3d]").forEach(b => b.onclick = () => { LB.say(b.dataset["3d"]); $(".mlab", app).scrollIntoView({ behavior: "smooth", block: "center" }); });
      $$("#chRes [data-q]").forEach(b => b.onclick = () => playQari([{ s: CS.s, a: CS.a, w: +b.dataset.q + 1 }], b));
      $("#chRe").onclick = () => attempt(); $("#chQ1").onclick = e => playQari(tgt.clip, e.currentTarget);
      const nx = $("#chNx"); if (nx) nx.onclick = async () => { const q = await quran(); if (CS.a < q[CS.s - 1].length) CS.a++; else if (CS.s < 114) { CS.s++; CS.a = 1; } $("#chS").value = CS.s; await fillAy(); showAyah(); };
      const sk = $("#chSk"); if (sk) sk.onclick = armAyah;
      /* Ustad's reaction, then keep going by itself */
      if (r.pass) {
        mood("happy"); if (tgt.kind === "ayah") { ust("🌟 " + x("okAll"), "happy"); try { const bs = LS.get("qsai-coach-best", {}), k = CS.s + ":" + CS.a; bs[k] = Math.max(bs[k] || 0, r.score); LS.set("qsai-coach-best", bs); } catch (e) {} }
        else if (tgt.wordIdx != null) { ust("🌟 " + x("wordOk"), "happy"); if (CS.auto) setTimeout(() => { if (m === CS.run) { armAyah(); setTimeout(() => CS.auto && CS.run === m && attempt(), 900); } }, 1800); }
        else ust("🌟 " + x("okAll"), "happy");
      } else {
        const worst = r.words.findIndex(w => w.status !== "ok" && w.status !== "unsure");
        if (r.unsure && worst < 0) { ust(x("unsure"), "sad"); if (CS.auto) setTimeout(() => CS.run === m && attempt(), 1800); return; }
        const msg = tgt.kind === "ayah" && worst >= 0 ? x("drill") : (CS.tries[key] >= 3 ? x("tries") : P(MSG.fix));
        ust(`<b>${sc}%</b> — ${msg}`, "sad");
        if (CS.auto) {
          if (tgt.kind === "ayah" && worst >= 0) { /* fix the worst word first, on its own */
            setTimeout(async () => { if (m !== CS.run) return; const b = $(`.chw[data-i="${worst}"]`); pickWordSilent(worst, b); const m2 = CS.run; await playQari([{ s: CS.s, a: CS.a, w: worst + 1 }], b); if (m2 === CS.run && CS.auto) attempt(); }, 2600);
          } else setTimeout(async () => { if (m !== CS.run) return; await playQari(tgt.clip, $("#chQ1")); if (m === CS.run && CS.auto) attempt(); }, 2600);
        }
      }
    }
    function pickWordSilent(i, btn) { /* same as tapping a word but without playing it twice */
      CS.run++; closeMic(); LB.stop(); $$(".chw", app).forEach(k => k.classList.toggle("on", k === btn)); CS.drill = i; const w = CS.words[i], s = CS.s, a = CS.a, letters = [...CORE.skeleton(w)];
      $("#chWp").innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><b>${x("onlyWord")}</b><button class="btn sm" id="chBack">↩ ${x("whole")}</button></div><div class="wd">${letters.map(c => `<button data-c="${c}">${c}</button>`).join("")}</div><div class="row"><button class="btn sm cy" id="chW1">🔊 ${x("listenQ")}</button><button class="btn sm" id="chW3">🎬 ${x("slow")}</button></div></div>`;
      $("#chBack").onclick = armAyah; $$("#chWp .wd button").forEach(b => b.onclick = () => { CS.run++; LB.say(b.dataset.c, b); });
      $("#chW1").onclick = () => playQari([{ s, a, w: i + 1 }], $("#chW1")); $("#chW3").onclick = () => walkWord(i);
      arm({ kind: "word", words: [w], refUrl: QARI_WORD(s, a, i + 1), clip: [{ s, a, w: i + 1 }], label: w, wordIdx: i });
    }
  }

  /* ================= 3D dock: the Makharij 3D head, one tap away in EVERY lesson and class ================= */
  const DK = { el: null, fab: null, lb: null, lang: null, run: 0 };
  const DKX = { fab: L("3D Mouth", "3D مخارج", "3D मख़ारिज"), t: L("3D Makharij – where each letter comes from", "3D مخارج – ہر حرف کہاں سے نکلتا ہے", "3D मख़ारिज – हर हर्फ़ कहाँ से निकलता है"), hint: L("Touch a letter, a mouth part below, or a name on the head.", "کوئی حرف، نیچے منہ کا حصہ، یا سر پر لکھا نام چھوئیں۔", "कोई हर्फ़, नीचे मुँह का हिस्सा, या सिर पर लिखा नाम छूइए।") };
  const dockCss = `#mkfab{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:45;border:1px solid var(--line);background:linear-gradient(135deg,#0d2433,#10181f);color:#fff;border-radius:999px;padding:10px 16px;font:700 14px Outfit,inherit;box-shadow:0 10px 28px -10px rgba(44,196,242,.7);display:flex;gap:6px;align-items:center}
#mkdock{position:fixed;inset:auto 0 0 0;max-height:72vh;z-index:70;background:var(--bg2);border-top:2px solid var(--gold);border-radius:22px 22px 0 0;box-shadow:0 -20px 60px -20px rgba(0,0,0,.8);display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom,0px)}
#mkdock .dkh{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;gap:8px}#mkdock .dkh b{font-size:15px}#mkdock .dkx{width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--card);font-size:20px}
#mkdock .dkb{overflow:auto;padding:0 12px 14px;-webkit-overflow-scrolling:touch}#mkdock .dkk{display:grid;grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:6px;margin:10px 0}
#mkdock .dkk button{background:var(--card);border:1px solid var(--line);border-radius:12px;min-height:46px;font:400 26px/1.5 "Amiri Quran",serif;color:var(--gold2)}#mkdock .dkk button.on{background:rgba(227,170,60,.25);border-color:var(--gold)}
#mkdock .dkr{display:flex;gap:6px;flex-wrap:wrap}#mkdock .dkr button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;font-size:13px}#mkdock .mlall{display:none}`;
  function dockBuild() {
    if (!$("#mkd-css")) { const st = document.createElement("style"); st.id = "mkd-css"; st.textContent = dockCss; document.head.appendChild(st); }
    if (DK.el) DK.el.remove();
    DK.lang = LANG; const d = document.createElement("div"); d.id = "mkdock"; d.hidden = true;
    d.innerHTML = `<div class="dkh"><b>🧊 ${P(DKX.t)}</b><button class="dkx" aria-label="close">×</button></div><div class="dkb">${labHTML(new Set())}<p class="mini">${P(DKX.hint)}</p>
      <div class="dkk">${LET.map(a => `<button data-c="${a[0]}">${a[0]}</button>`).join("")}</div><div class="dkr">${REG.map(r => `<button data-r="${r.id}">${r.ico} ${P(r.n)}</button>`).join("")}</div></div>`;
    document.body.appendChild(d); DK.el = d; DK.lb = null;
    $(".dkx", d).onclick = dockClose;
  }
  function dockWire() {
    if (DK.lb) return; const d = DK.el; DK.lb = wireLab(d); const LBd = DK.lb; if (!LBd) return;
    $$(".dkk button", d).forEach(b => b.onclick = () => { DK.run++; LBd.stop(); $$(".dkk button", d).forEach(k => k.classList.toggle("on", k === b)); LBd.say(b.dataset.c, b); });
    const region = async r => { DK.run++; LBd.stop(); const m = DK.run, seen = new Set();
      for (const [c, z] of r.l) { if (m !== DK.run) return; const kk = c + z; if (seen.has(kk)) continue; seen.add(kk); const b = $(`.dkk button[data-c="${c}"]`, d); $$(".dkk button", d).forEach(k => k.classList.toggle("on", k === b)); await LBd.say(c, b, z); }
      $$(".dkk button", d).forEach(k => k.classList.remove("on")); };
    $$(".dkr button", d).forEach(b => b.onclick = () => region(REG.find(r => r.id === b.dataset.r)));
    $(".mlab", d).addEventListener("mlpart", e => { const r = REG.find(q => q.id === PART[e.detail]); r && region(r); });
  }
  function dockOpen() { if (!DK.el || DK.lang !== LANG) dockBuild(); DK.el.hidden = false; dockWire(); }
  function dockClose() { if (!DK.el) return; DK.run++; try { DK.lb && DK.lb.stop(); } catch (e) {} stopAll(); DK.el.hidden = true; }
  function dockSync() {
    const on = /^#lesson=/.test(location.hash);
    if (!DK.fab) { const st = document.createElement("style"); st.id = "mkd-css"; st.textContent = dockCss; document.head.appendChild(st); const b = document.createElement("button"); b.id = "mkfab"; b.hidden = true; document.body.appendChild(b); b.onclick = () => DK.el && !DK.el.hidden ? dockClose() : dockOpen(); DK.fab = b; }
    DK.fab.innerHTML = `🧊 ${P(DKX.fab)}`; DK.fab.hidden = !on || !!document.querySelector("#labslot .mlab"); if (!on) dockClose();
  }
  addEventListener("hashchange", dockSync); setTimeout(dockSync, 0); setInterval(dockSync, 900);
  window.MkDock = { say(c, btn) { if (!LAB_Z[c]) return null; dockOpen(); return DK.lb ? DK.lb.say(c, btn) : Promise.resolve(); } };
  window.viewCoach = viewCoach; window.CoachState = CS;
})();

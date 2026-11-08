'use strict';
/* Roz ki hadees — curated, Urdu / Hindi / English */
const H=[
[
"Actions are judged by intentions, and every person will get what they intended.",
"اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملتا ہے جس کی اس نے نیت کی۔",
"आमाल का दारोमदार नीयतों पर है, और हर शख़्स को वही मिलता है जिसकी उसने नीयत की।",
"Bukhari 1, Muslim 1907"
],
[
"Religion is sincere advice: for Allah, His Book, His Messenger, the leaders of the Muslims and the common Muslims.",
"دین خیر خواہی (نصیحت) کا نام ہے: اللہ کے لیے، اس کی کتاب کے لیے، اس کے رسول کے لیے، مسلمانوں کے رہنماؤں اور عام مسلمانوں کے لیے۔",
"दीन ख़ैर-ख़्वाही (नसीहत) का नाम है: अल्लाह के लिए, उसकी किताब के लिए, उसके रसूल के लिए, मुसलमानों के रहनुमाओं और आम मुसलमानों के लिए।",
"Muslim 55"
],
[
"None of you truly believes until he loves for his brother what he loves for himself.",
"تم میں سے کوئی اس وقت تک کامل مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
"तुम में से कोई उस वक़्त तक कामिल मोमिन नहीं हो सकता जब तक अपने भाई के लिए वही पसंद न करे जो अपने लिए पसंद करता है।",
"Bukhari 13, Muslim 45"
],
[
"Whoever believes in Allah and the Last Day should speak good or remain silent.",
"جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے وہ یا تو بھلائی کی بات کہے یا خاموش رہے۔",
"जो अल्लाह और आख़िरत के दिन पर ईमान रखता है वह या तो भलाई की बात कहे या ख़ामोश रहे।",
"Bukhari 6018, Muslim 47"
],
[
"The strong one is not the one who overpowers others in wrestling; the strong one is he who controls himself in anger.",
"طاقتور وہ نہیں جو کشتی میں پچھاڑ دے؛ طاقتور وہ ہے جو غصے کے وقت اپنے آپ پر قابو رکھے۔",
"ताक़तवर वह नहीं जो कुश्ती में पछाड़ दे; ताक़तवर वह है जो ग़ुस्से के वक़्त अपने आप पर क़ाबू रखे।",
"Bukhari 6114, Muslim 2609"
],
[
"A Muslim is one from whose tongue and hand other Muslims are safe.",
"مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
"मुसलमान वह है जिसकी ज़बान और हाथ से दूसरे मुसलमान महफ़ूज़ रहें।",
"Bukhari 10, Muslim 40"
],
[
"Make things easy, do not make them difficult; give good news, do not drive people away.",
"آسانی کرو، مشکل نہ بناؤ؛ خوشخبری دو، نفرت نہ پھیلاؤ۔",
"आसानी करो, मुश्किल न बनाओ; ख़ुशख़बरी दो, नफ़रत न फैलाओ।",
"Bukhari 69, Muslim 1734"
],
[
"The best among you is the one who learns the Quran and teaches it.",
"تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
"तुम में बेहतरीन वह है जो क़ुरआन सीखे और सिखाए।",
"Bukhari 5027"
],
[
"Two blessings are a source of deception for many people: health and free time.",
"دو نعمتوں کے بارے میں بہت سے لوگ دھوکے میں ہیں: صحت اور فراغت (خالی وقت)۔",
"दो नेमतों के बारे में बहुत से लोग धोखे में हैं: सेहत और फ़राग़त (ख़ाली वक़्त)।",
"Bukhari 6412"
],
[
"Your smiling in the face of your brother is charity.",
"اپنے بھائی کے سامنے مسکرانا بھی صدقہ ہے۔",
"अपने भाई के सामने मुस्कुराना भी सदक़ा है।",
"Tirmidhi 1956"
],
[
"Allah does not look at your appearance and wealth, but He looks at your hearts and deeds.",
"اللہ تمہاری شکلوں اور مال کو نہیں دیکھتا، بلکہ تمہارے دلوں اور عمل کو دیکھتا ہے۔",
"अल्लाह तुम्हारी शक्लों और माल को नहीं देखता, बल्कि तुम्हारे दिलों और अमल को देखता है।",
"Muslim 2564"
],
[
"The most beloved deeds to Allah are those done consistently, even if small.",
"اللہ کو سب سے پسندیدہ عمل وہ ہے جو مسلسل ہو، چاہے تھوڑا ہی ہو۔",
"अल्लाह को सबसे पसंदीदा अमल वह है जो मुसलसल हो, चाहे थोड़ा ही हो।",
"Bukhari 6464, Muslim 783"
],
[
"Two phrases are light on the tongue, heavy on the scale and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil Azeem.",
"دو کلمے زبان پر ہلکے، میزان میں بھاری اور رحمٰن کو پسند ہیں: سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ۔",
"दो कलिमे ज़बान पर हल्के, मीज़ान में भारी और रहमान को पसंद हैं: सुब्हानल्लाहि व बिहम्दिही, सुब्हानल्लाहिल अज़ीम।",
"Bukhari 6406, Muslim 2694"
],
[
"Whoever travels a path seeking knowledge, Allah makes easy for him the path to Paradise.",
"جو علم کی تلاش میں راستہ چلے، اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔",
"जो इल्म की तलाश में रास्ता चले, अल्लाह उसके लिए जन्नत का रास्ता आसान कर देता है।",
"Muslim 2699"
],
[
"Allah is gentle and loves gentleness in all matters.",
"اللہ نرم ہے اور ہر کام میں نرمی کو پسند کرتا ہے۔",
"अल्लाह नरम है और हर काम में नरमी को पसंद करता है।",
"Bukhari 6024, Muslim 2593"
],
[
"Whoever shows no mercy to people, Allah shows no mercy to him.",
"جو لوگوں پر رحم نہیں کرتا، اللہ اس پر رحم نہیں کرتا۔",
"जो लोगों पर रहम नहीं करता, अल्लाह उस पर रहम नहीं करता।",
"Bukhari 7376, Muslim 2319"
],
[
"Truthfulness leads to righteousness, and righteousness leads to Paradise.",
"سچ نیکی کی طرف لے جاتا ہے اور نیکی جنت کی طرف۔",
"सच नेकी की तरफ़ ले जाता है और नेकी जन्नत की तरफ़।",
"Bukhari 6094, Muslim 2607"
],
[
"Leave what makes you doubt for what does not make you doubt.",
"جو چیز تمہیں شک میں ڈالے اسے چھوڑ دو اور وہ اختیار کرو جو شک سے پاک ہو۔",
"जो चीज़ तुम्हें शक में डाले उसे छोड़ दो और वह इख़्तियार करो जो शक से पाक हो।",
"Tirmidhi 2518"
],
[
"Part of the excellence of a person's Islam is leaving what does not concern him.",
"انسان کے اچھے اسلام کی نشانی ہے کہ وہ بے مقصد باتوں کو چھوڑ دے۔",
"इंसान के अच्छे इस्लाम की निशानी है कि वह बे-मक़सद बातों को छोड़ दे।",
"Tirmidhi 2317"
],
[
"Be in this world as if you were a stranger or a traveller.",
"دنیا میں ایسے رہو جیسے کوئی مسافر یا پردیسی ہو۔",
"दुनिया में ऐसे रहो जैसे कोई मुसाफ़िर या परदेसी हो।",
"Bukhari 6416"
],
[
"Allah helps His servant as long as the servant helps his brother.",
"اللہ بندے کی مدد میں رہتا ہے جب تک بندہ اپنے بھائی کی مدد میں لگا رہے۔",
"अल्लाह बंदे की मदद में रहता है जब तक बंदा अपने भाई की मदद में लगा रहे।",
"Muslim 2699"
],
[
"Value five things before five: youth before old age, health before illness, wealth before poverty, free time before being busy, and life before death.",
"پانچ چیزوں کو پانچ سے پہلے غنیمت جانو: جوانی کو بڑھاپے سے پہلے، صحت کو بیماری سے پہلے، مالداری کو فقر سے پہلے، فراغت کو مصروفیت سے پہلے، اور زندگی کو موت سے پہلے۔",
"पाँच चीज़ों को पाँच से पहले ग़नीमत जानो: जवानी को बुढ़ापे से पहले, सेहत को बीमारी से पहले, मालदारी को फ़क़्र से पहले, फ़राग़त को मसरूफ़ियत से पहले, और ज़िंदगी को मौत से पहले।",
"Mustadrak Hakim"
],
[
"Whoever prays Fajr is under Allah's protection.",
"جو فجر کی نماز پڑھتا ہے وہ اللہ کی حفاظت میں ہوتا ہے۔",
"जो फ़ज्र की नमाज़ पढ़ता है वह अल्लाह की हिफ़ाज़त में होता है।",
"Muslim 657"
],
[
"Cleanliness is half of faith.",
"پاکیزگی آدھا ایمان ہے۔",
"पाकीज़गी आधा ईमान है।",
"Muslim 223"
],
[
"Dua is worship itself.",
"دعا ہی عبادت ہے۔",
"दुआ ही इबादत है।",
"Tirmidhi 3371, Abu Dawud 1479"
],
[
"Whoever sends one blessing upon me, Allah sends ten blessings upon him.",
"جو مجھ پر ایک بار درود بھیجے، اللہ اس پر دس رحمتیں نازل کرتا ہے۔",
"जो मुझ पर एक बार दुरूद भेजे, अल्लाह उस पर दस रहमतें नाज़िल करता है।",
"Muslim 408"
],
[
"The best among you are those with the best character.",
"تم میں بہترین وہ ہے جس کے اخلاق سب سے اچھے ہوں۔",
"तुम में बेहतरीन वह है जिसके अख़लाक़ सबसे अच्छे हों।",
"Bukhari 3559, Muslim 2321"
],
[
"A man asked for advice, so the Prophet (ﷺ) said: Do not get angry.",
"ایک شخص نے نصیحت مانگی تو نبی ﷺ نے فرمایا: غصہ مت کرو۔",
"एक शख़्स ने नसीहत माँगी तो नबी ﷺ ने फ़रमाया: ग़ुस्सा मत करो।",
"Bukhari 6116"
],
[
"Whoever does not thank people does not thank Allah.",
"جو لوگوں کا شکریہ ادا نہیں کرتا، وہ اللہ کا شکر بھی ادا نہیں کرتا۔",
"जो लोगों का शुक्रिया अदा नहीं करता, वह अल्लाह का शुक्र भी अदा नहीं करता।",
"Abu Dawud 4811, Tirmidhi 1954"
],
[
"Whoever conceals a Muslim's faults, Allah will conceal his faults on the Day of Resurrection.",
"جو کسی مسلمان کی پردہ پوشی کرے، اللہ قیامت کے دن اس کی پردہ پوشی کرے گا۔",
"जो किसी मुसलमान की पर्दापोशी करे, अल्लाह क़यामत के दिन उसकी पर्दापोशी करेगा।",
"Bukhari 2442, Muslim 2580"
],
[
"The affair of the believer is amazing: if good comes to him he is grateful, and if harm touches him he is patient — both are good for him.",
"مومن کا ہر معاملہ عجیب ہے: خوشی ملے تو شکر کرے، تکلیف پہنچے تو صبر کرے، اور دونوں اس کے لیے بہتر ہیں۔",
"मोमिन का हर मामला अजीब है: ख़ुशी मिले तो शुक्र करे, तकलीफ़ पहुँचे तो सब्र करे, और दोनों उसके लिए बेहतर हैं।",
"Muslim 2999"
],
[
"Whoever wishes for more provision and a longer life should maintain family ties.",
"جو چاہے کہ اس کے رزق میں کشادگی اور عمر میں برکت ہو، وہ صلہ رحمی (رشتہ داروں سے حسنِ سلوک) کرے۔",
"जो चाहे कि उसके रिज़्क़ में कुशादगी और उम्र में बरकत हो, वह सिला-रहमी (रिश्तेदारों से हुस्ने-सुलूक) करे।",
"Bukhari 5985, Muslim 2557"
],
[
"The most beloved deeds to Allah: prayer on time, then kindness to parents, then striving in the way of Allah.",
"اللہ کو سب سے پسندیدہ اعمال: وقت پر نماز، پھر والدین سے حسنِ سلوک، پھر اللہ کی راہ میں جہاد۔",
"अल्लाह को सबसे पसंदीदा आमाल: वक़्त पर नमाज़, फिर वालिदैन से हुस्ने-सुलूक, फिर अल्लाह की राह में जिहाद।",
"Bukhari 527, Muslim 85"
],
[
"Whoever builds a mosque for Allah, Allah builds for him a house in Paradise.",
"جو اللہ کے لیے مسجد بنائے، اللہ اس کے لیے جنت میں گھر بناتا ہے۔",
"जो अल्लाह के लिए मस्जिद बनाए, अल्लाह उसके लिए जन्नत में घर बनाता है।",
"Bukhari 450, Muslim 533"
]
];
const REFN={Bukhari:['بخاری','बुख़ारी'],Muslim:['مسلم','मुस्लिम'],Tirmidhi:['ترمذی','तिर्मिज़ी'],'Abu Dawud':['ابو داود','अबू दाऊद'],'Mustadrak Hakim':['مستدرک حاکم','मुस्तदरक हाकिम']};
const refT=r=>{if(isEnL()||S.lang==='ro')return r;const i=S.lang==='ur'?0:1;return r.replace(/Mustadrak Hakim|Abu Dawud|Bukhari|Muslim|Tirmidhi/g,m=>REFN[m][i])};
const dayOfYear=(d=new Date())=>Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
/* returns [text in app language, reference] */
const hadeesOfDay=()=>{const h=H[dayOfYear()%H.length];return [(S.lang==='ur'||S.lang==='ro')?h[1]:S.lang==='hi'?h[2]:h[0],refT(h[3])]};

/* Fahm — Quran search (Build 30).
   Type a TOPIC (hajj, nikah, sabr, zakat …), an Arabic phrase, a word from any translation (Urdu / Roman Urdu / English) or a reference like 2:255.
   Topics are expanded into many related words (English + Urdu + Roman Urdu + Arabic) and matched against the three translations that ship inside the app,
   so "haj" also finds the ayat on Kaaba, Safa-Marwa, Ihram and Umrah. Everything runs offline on the phone. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  /* topic = [ [names the user may type], [words that appear in the translations] ] */
  const TOPICS = [
    [['hajj', 'haj', 'hajj ke', 'umrah', 'umra', 'حج', 'عمرہ', 'pilgrimage', 'kaaba', 'kabah', 'kaba'], ['hajj', 'pilgrimage', 'umrah', 'kaaba', 'kabah', 'ka\'bah', 'safa', 'marwah', 'marwa', 'ihram', 'sacred house', 'sacred mosque', 'arafat', 'sacrificial', 'haj ', 'ka\'ba', 'khana kaba', 'khana-e-kaba', 'حج', 'عمرہ', 'کعبہ', 'صفا', 'مروہ', 'احرام', 'عرفات', 'قربانی', 'بیت اللہ', 'مسجد حرام']],
    [['nikah', 'nikaah', 'shadi', 'shaadi', 'marriage', 'marry', 'shaadi', 'نکاح', 'شادی', 'wives', 'biwi', 'bivi'], ['marry', 'marriage', 'wives', 'wife', 'spouse', 'dower', 'mahr', 'betroth', 'nikah', 'nikaah', 'shadi', 'biwi', 'biviyon', 'bivi', 'mehr', 'نکاح', 'شادی', 'بیوی', 'بیویوں', 'مہر', 'جوڑا', 'شوہر']],
    [['talaq', 'divorce', 'طلاق', 'iddat', 'iddah', 'khula'], ['divorce', 'talaq', 'waiting period', 'iddah', 'iddat', 'separation', 'طلاق', 'عدت', 'خلع', 'جدائی']],
    [['namaz', 'salah', 'salat', 'prayer', 'pray', 'نماز', 'صلاة', 'wudu', 'wuzu', 'وضو'], ['prayer', 'pray', 'salah', 'salat', 'namaz', 'establish the prayer', 'wudu', 'ablution', 'prostrat', 'bow down', 'qiblah', 'qibla', 'نماز', 'وضو', 'سجدہ', 'رکوع', 'قبلہ', 'اقامت']],
    [['roza', 'rozay', 'rozah', 'fasting', 'fast', 'ramadan', 'ramzan', 'روزہ', 'رمضان', 'siyam'], ['fast', 'fasting', 'ramadan', 'ramazan', 'ramzan', 'siyam', 'roza', 'rozay', 'rozah', 'روزہ', 'روزے', 'رمضان', 'صیام']],
    [['zakat', 'zakaat', 'charity', 'sadaqah', 'sadqa', 'sadaqa', 'infaq', 'زکوٰۃ', 'زکات', 'صدقہ', 'khairat'], ['zakat', 'zakah', 'charity', 'alms', 'spend in the cause', 'spend of what', 'poor', 'needy', 'sadaqah', 'sadqa', 'khairat', 'ghareeb', 'miskin', 'زکوٰۃ', 'زکات', 'صدقہ', 'صدقات', 'مسکین', 'محتاج', 'خرچ', 'غریب']],
    [['sabr', 'patience', 'patient', 'صبر', 'sabar'], ['patience', 'patient', 'patiently', 'persevere', 'endure', 'sabr', 'sabar', 'صبر', 'صابر', 'صابرین', 'ثابت قدم']],
    [['tawba', 'toba', 'tauba', 'repent', 'repentance', 'توبہ', 'forgiveness', 'maafi', 'maghfirat', 'istighfar'], ['repent', 'repentance', 'forgive', 'forgiveness', 'pardon', 'oft-forgiving', 'tauba', 'toba', 'tawba', 'maghfirat', 'maafi', 'توبہ', 'بخش', 'معاف', 'مغفرت', 'استغفار', 'غفور']],
    [['jannat', 'jannah', 'paradise', 'heaven', 'جنت', 'khuld'], ['paradise', 'garden', 'gardens', 'jannah', 'jannat', 'rivers flowing', 'eternal', 'heaven', 'جنت', 'جنتیں', 'باغات', 'باغ', 'نہریں', 'ہمیشہ', 'firdaus']],
    [['jahannam', 'jahanum', 'hell', 'dozakh', 'جہنم', 'fire', 'naar', 'azab', 'azaab', 'عذاب'], ['hell', 'hellfire', 'fire', 'jahannam', 'jahanam', 'dozakh', 'punishment', 'torment', 'azab', 'azaab', 'naar', 'جہنم', 'دوزخ', 'آگ', 'عذاب', 'سزا']],
    [['qiyamat', 'qayamat', 'qiyamah', 'judgment', 'judgement', 'قیامت', 'akhirat', 'akhirah', 'aakhirat', 'آخرت', 'hashr', 'resurrection'], ['day of judgment', 'day of resurrection', 'last day', 'hereafter', 'resurrect', 'the hour', 'raised up', 'qiyamat', 'qayamat', 'akhirat', 'aakhirat', 'hashr', 'قیامت', 'آخرت', 'حشر', 'روز جزا', 'روزِ قیامت', 'اٹھائے', 'گھڑی']],
    [['dua', 'duaa', 'دعا', 'supplication', 'pray to', 'maangna'], ['supplicat', 'call upon me', 'invoke', 'answer', 'dua', 'duaa', 'pukar', 'دعا', 'پکارو', 'پکارا', 'قبول', 'مانگ']],
    [['shirk', 'شرک', 'idol', 'idols', 'but', 'butt', 'polytheism', 'polytheist', 'mushrik'], ['associate partners', 'partners with allah', 'polytheist', 'idol', 'idols', 'shirk', 'mushrik', 'mushrikeen', 'شرک', 'مشرک', 'مشرکین', 'شریک', 'بتوں', 'بت ']],
    [['tawheed', 'tauheed', 'توحید', 'oneness', 'one god', 'ekeshwar'], ['no god but', 'no deity', 'one god', 'one allah', 'oneness', 'tawheed', 'tauheed', 'توحید', 'معبود نہیں', 'کوئی معبود', 'ایک ہی', 'احد']],
    [['riba', 'sood', 'sud', 'interest', 'usury', 'ربا', 'سود'], ['usury', 'riba', 'interest', 'sood', 'sud', 'ربا', 'سود', 'سودی']],
    [['wirasat', 'virasat', 'inheritance', 'warasat', 'وراثت', 'tarka', 'heir'], ['inherit', 'inheritance', 'heir', 'heirs', 'bequest', 'will', 'legacy', 'wirasat', 'virasat', 'tarka', 'وراثت', 'ترکہ', 'وارث', 'وصیت', 'حصہ']],
    [['yateem', 'yatim', 'orphan', 'orphans', 'یتیم', 'yateemon'], ['orphan', 'orphans', 'yateem', 'yatim', 'یتیم', 'یتیموں']],
    [['walidain', 'waldain', 'parents', 'maa baap', 'maan baap', 'والدین', 'mother', 'father', 'ماں', 'باپ'], ['parents', 'mother', 'father', 'kindness to parents', 'walidain', 'waldain', 'maa', 'baap', 'والدین', 'ماں', 'باپ', 'ماں باپ', 'والدہ']],
    [['padosi', 'neighbour', 'neighbor', 'neighbours', 'ہمسایہ', 'پڑوسی'], ['neighbour', 'neighbor', 'neighbours', 'padosi', 'hamsaya', 'ہمسایہ', 'پڑوسی', 'پڑوس']],
    [['adl', 'insaf', 'insaaf', 'justice', 'انصاف', 'عدل', 'just'], ['justice', 'justly', 'be just', 'equity', 'fair', 'adl', 'insaf', 'insaaf', 'انصاف', 'عدل', 'برابر']],
    [['jihad', 'جہاد', 'qital', 'fighting', 'war', 'jang'], ['strive', 'striving', 'jihad', 'fight in the cause', 'fight in the way', 'qital', 'jang', 'جہاد', 'جنگ', 'لڑو', 'قتال', 'راہ میں']],
    [['hijab', 'pardah', 'parda', 'حجاب', 'purdah', 'modesty', 'haya', 'حیا'], ['modest', 'modesty', 'veil', 'cover', 'hijab', 'khimar', 'jilbab', 'chastity', 'lower their gaze', 'pardah', 'parda', 'haya', 'حجاب', 'پردہ', 'چادر', 'نگاہیں', 'حیا', 'اوڑھنی', 'زینت']],
    [['sharab', 'alcohol', 'wine', 'khamr', 'شراب', 'intoxicant', 'nasha'], ['wine', 'intoxicant', 'intoxicants', 'gambling', 'khamr', 'sharab', 'jua', 'شراب', 'جوا', 'نشہ']],
    [['halal', 'haram', 'حلال', 'حرام', 'soor', 'pork', 'suwar', 'khinzeer'], ['lawful', 'forbidden', 'unlawful', 'pork', 'swine', 'carrion', 'blood', 'halal', 'haram', 'khinzeer', 'مردار', 'خنزیر', 'حلال', 'حرام', 'ناجائز', 'جائز']],
    [['shukr', 'shukar', 'gratitude', 'grateful', 'thankful', 'شکر', 'thanks'], ['grateful', 'gratitude', 'thank', 'thankful', 'shukr', 'shukar', 'شکر', 'شکرگزار', 'احسان مند']],
    [['rizq', 'rizk', 'rozi', 'provision', 'sustenance', 'رزق', 'rozgar', 'income', 'kamai'], ['provision', 'sustenance', 'provide', 'provider', 'livelihood', 'rizq', 'rozi', 'رزق', 'روزی', 'روزگار', 'کمائی']],
    [['barish', 'baarish', 'rain', 'بارش', 'pani', 'water', 'پانی', 'clouds', 'badal'], ['rain', 'water from the sky', 'sent down water', 'clouds', 'cloud', 'barish', 'baarish', 'بارش', 'پانی', 'بادل', 'آسمان سے پانی', 'مینہ']],
    [['chand', 'suraj', 'sun', 'moon', 'sitare', 'stars', 'astronomy', 'چاند', 'سورج', 'ستارے', 'aasman', 'sky', 'cosmos', 'universe', 'kainat', 'کائنات'], ['sun', 'moon', 'stars', 'heavens', 'orbit', 'planets', 'constellations', 'sky', 'earth', 'chand', 'suraj', 'sitare', 'aasman', 'سورج', 'چاند', 'ستارے', 'آسمان', 'مدار', 'برج']],
    [['insan', 'insaan', 'human', 'man', 'creation', 'embryo', 'khalq', 'انسان', 'paidaish', 'pedaish', 'nutfa', 'نطفہ', 'womb', 'rahm'], ['created man', 'created the human', 'sperm', 'drop', 'clinging', 'clot', 'lump', 'embryo', 'womb', 'creation of man', 'nutfah', 'alaq', 'نطفہ', 'علقہ', 'مضغہ', 'رحم', 'پیدا کیا', 'خون کے لوتھڑے', 'جمے ہوئے خون']],
    [['adam', 'aadam', 'آدم'], ['adam', 'آدم', 'aadam']],
    [['ibrahim', 'ibraheem', 'abraham', 'ابراہیم', 'khalil'], ['ibrahim', 'abraham', 'ibraheem', 'ابراہیم']],
    [['musa', 'moosa', 'moses', 'موسیٰ', 'firon', 'pharaoh', 'فرعون'], ['moses', 'musa', 'moosa', 'pharaoh', 'firon', 'aaron', 'موسیٰ', 'فرعون', 'ہارون', 'بنی اسرائیل', 'children of israel']],
    [['isa', 'eesa', 'jesus', 'maryam', 'mary', 'عیسیٰ', 'مریم', 'masih', 'messiah'], ['jesus', 'isa', 'eesa', 'mary', 'maryam', 'messiah', 'masih', 'عیسیٰ', 'مریم', 'مسیح']],
    [['yusuf', 'yousuf', 'joseph', 'یوسف', 'zulaikha'], ['joseph', 'yusuf', 'yousuf', 'یوسف', 'زلیخا', 'عزیز مصر']],
    [['nuh', 'noah', 'نوح', 'toofan', 'flood', 'طوفان'], ['noah', 'nuh', 'flood', 'ark', 'toofan', 'نوح', 'طوفان', 'کشتی']],
    [['farishte', 'farishta', 'angel', 'angels', 'فرشتے', 'jibril', 'jibreel', 'gabriel'], ['angel', 'angels', 'gabriel', 'jibril', 'jibreel', 'farishta', 'farishte', 'فرشتے', 'فرشتہ', 'جبریل', 'ملائکہ']],
    [['jinn', 'jin', 'jinnat', 'جن', 'جنات', 'iblis', 'shaitan', 'shaytan', 'satan', 'شیطان', 'devil'], ['jinn', 'jinns', 'satan', 'shaytan', 'shaitan', 'iblis', 'devil', 'whisper', 'jin ', 'جن', 'جنات', 'شیطان', 'ابلیس', 'وسوسہ']],
    [['maut', 'mout', 'death', 'die', 'موت', 'marna', 'janaza'], ['death', 'die', 'dies', 'taste death', 'soul', 'souls', 'maut', 'marna', 'موت', 'مرنا', 'جان', 'روح']],
    [['tijarat', 'business', 'trade', 'qarz', 'loan', 'debt', 'تجارت', 'قرض', 'len den', 'paisa', 'maal', 'wealth'], ['trade', 'trading', 'debt', 'loan', 'write it down', 'witness', 'measure', 'weigh', 'wealth', 'qarz', 'tijarat', 'maal', 'تجارت', 'قرض', 'ناپ تول', 'مال', 'دولت', 'لکھ لیا کرو']],
    [['jhoot', 'jhut', 'lie', 'lying', 'liar', 'جھوٹ', 'sach', 'truth', 'truthful', 'سچ', 'sadiq', 'amanat', 'amaanat', 'امانت'], ['lie', 'lies', 'liar', 'falsehood', 'truthful', 'truth', 'trust', 'trusts', 'honest', 'jhoot', 'sach', 'amanat', 'جھوٹ', 'سچ', 'سچے', 'امانت', 'وعدہ']],
    [['ghibat', 'gheebat', 'backbiting', 'gossip', 'غیبت', 'chugli', 'mazaq', 'mock', 'taunt', 'تمسخر'], ['backbite', 'backbiting', 'slander', 'mock', 'ridicule', 'defame', 'suspicion', 'spy', 'ghibat', 'gheebat', 'غیبت', 'عیب', 'مذاق', 'طعنہ', 'بدگمانی', 'تجسس']],
    [['ilm', 'ilm', 'knowledge', 'علم', 'padhna', 'read', 'iqra', 'education', 'parhna', 'pen', 'qalam', 'قلم'], ['knowledge', 'know', 'learn', 'teach', 'taught', 'pen', 'read', 'recite', 'scholars', 'ilm', 'qalam', 'علم', 'قلم', 'پڑھ', 'سکھایا', 'علماء', 'حکمت', 'wisdom']],
    [['gussa', 'ghussa', 'anger', 'غصہ', 'maaf', 'forgive', 'afw', 'عفو', 'rahm', 'mercy', 'رحمت', 'rehmat', 'rahmat'], ['anger', 'restrain', 'pardon', 'overlook', 'forbearing', 'mercy', 'merciful', 'compassion', 'gussa', 'ghussa', 'rahmat', 'rehmat', 'غصہ', 'رحمت', 'درگزر', 'معاف', 'نرمی']],
    [['dost', 'dosti', 'friend', 'friends', 'دوست', 'dushman', 'enemy', 'دشمن', 'wali', 'ولی', 'ally'], ['friend', 'friends', 'ally', 'allies', 'enemy', 'enemies', 'protector', 'guardian', 'dost', 'dushman', 'دوست', 'دشمن', 'ولی', 'مددگار', 'کارساز']],
    [['aulad', 'bachay', 'bache', 'children', 'child', 'son', 'sons', 'daughter', 'بچے', 'اولاد', 'beta', 'beti', 'بیٹا', 'بیٹی'], ['children', 'child', 'offspring', 'sons', 'daughters', 'progeny', 'aulad', 'bachay', 'اولاد', 'بچے', 'بیٹے', 'بیٹیاں', 'بیٹوں', 'لڑکے', 'لڑکیاں']],
    [['aurat', 'auratein', 'women', 'woman', 'عورت', 'عورتیں', 'khawateen', 'female'], ['women', 'woman', 'female', 'females', 'maidens', 'aurat', 'auratein', 'عورتوں', 'عورت', 'عورتیں', 'خواتین', 'نساء']],
    [['namaz e jumma', 'jumma', 'juma', 'friday', 'جمعہ'], ['friday', 'congregation', 'jumuah', 'jumma', 'juma', 'جمعہ', 'جمعے', 'اجتماع']],
    [['quran', 'qur\'an', 'قرآن', 'kitab', 'kitaab', 'book', 'revelation', 'wahi', 'وحی'], ['quran', 'qur\'an', 'recite', 'revelation', 'revealed', 'the book', 'scripture', 'kitab', 'wahi', 'قرآن', 'کتاب', 'وحی', 'نازل']],
    [['ghareeb', 'gareeb', 'poor', 'faqeer', 'مسکین', 'miskeen', 'needy', 'bhook', 'hunger', 'بھوکا', 'khana', 'food', 'khilana'], ['poor', 'needy', 'miskeen', 'feed', 'feeding', 'hungry', 'hunger', 'beggar', 'ghareeb', 'khana', 'bhook', 'مسکین', 'فقیر', 'بھوکے', 'کھانا کھلا', 'محتاج']],
    [['nafs', 'nafs', 'نفس', 'soul', 'dil', 'heart', 'دل', 'qalb', 'tazkiya', 'تزکیہ', 'purity', 'pak', 'پاک'], ['soul', 'self', 'heart', 'hearts', 'purify', 'purification', 'purity', 'clean', 'nafs', 'qalb', 'tazkiya', 'نفس', 'دل', 'دلوں', 'پاک', 'تزکیہ', 'سکون']],
    [['ahd', 'wada', 'waada', 'promise', 'covenant', 'oath', 'qasam', 'قسم', 'وعدہ', 'agreement', 'muahida', 'معاہدہ'], ['covenant', 'promise', 'oath', 'oaths', 'pledge', 'fulfil', 'treaty', 'ahd', 'wada', 'qasam', 'وعدہ', 'عہد', 'قسم', 'قسمیں', 'معاہدہ']],
    [['taqwa', 'taqwah', 'تقویٰ', 'fear allah', 'khauf', 'خوف', 'parhezgar', 'پرہیزگار', 'righteous', 'muttaqi'], ['fear allah', 'be mindful', 'righteous', 'god-fearing', 'piety', 'taqwa', 'muttaqi', 'parhezgar', 'تقویٰ', 'پرہیزگار', 'ڈرو', 'متقی', 'خوف']],
    [['hidayat', 'hidayah', 'guidance', 'راہ', 'sirat', 'sirat e mustaqeem', 'straight path', 'seedha raasta', 'صراط', 'hidaayat', 'ہدایت'], ['guidance', 'guide', 'guided', 'straight path', 'right path', 'path', 'astray', 'misguide', 'hidayat', 'hidayah', 'raasta', 'ہدایت', 'صراط مستقیم', 'سیدھی راہ', 'گمراہ', 'راہ']],
    [['munafiq', 'munafiqeen', 'منافق', 'hypocrite', 'hypocrites', 'nifaq', 'نفاق'], ['hypocrite', 'hypocrites', 'hypocrisy', 'munafiq', 'munafiqeen', 'nifaq', 'منافق', 'منافقین', 'نفاق', 'منافقوں']],
    [['kafir', 'kuffar', 'kafirun', 'کافر', 'disbeliever', 'disbelievers', 'kufr', 'کفر', 'unbeliever'], ['disbeliev', 'unbeliev', 'reject', 'kafir', 'kafirun', 'kufr', 'kuffar', 'کافر', 'کافروں', 'کفر', 'انکار']],
    [['momin', 'mumin', 'iman', 'imaan', 'ایمان', 'مومن', 'believer', 'believers', 'faith'], ['believer', 'believers', 'those who believe', 'faith', 'iman', 'imaan', 'momin', 'mumin', 'ایمان', 'مومن', 'مومنوں', 'ایمان والو', 'ایمان لائے']]
  ];
  const POP = ['Hajj', 'Nikah', 'Namaz', 'Roza', 'Zakat', 'Sabr', 'Tawba', 'Jannat', 'Jahannam', 'Qiyamat', 'Dua', 'Riba', 'Walidain', 'Yateem', 'Rizq', 'Shukr', 'Insaf', 'Hijab', 'Insan ki paidaish', 'Barish'];
  const TT = {
    ru: { t: 'Quran mein khoj', ph: 'Mauzu, lafz ya ayat likhein… (jaise: hajj, nikah, 2:255)', pop: 'Mashhoor mauzuaat', none: 'Kuch nahin mila. Doosra lafz try karein.', load: 'Tayyar ho raha hai…', more: 'Aur dikhayein', read: 'Padhein', wbw: 'Lafz ba lafz', found: 'ayaat mili', rel: 'Mauzu', tip: 'Chhota lafz bhi chalta hai: haj, nikah, sabr, zakat…' },
    ur: { t: 'قرآن میں تلاش', ph: 'موضوع، لفظ یا آیت لکھیں… (مثلاً: حج، نکاح، ۲:۲۵۵)', pop: 'مشہور موضوعات', none: 'کچھ نہیں ملا۔ کوئی دوسرا لفظ آزمائیں۔', load: 'تیار ہو رہا ہے…', more: 'مزید دکھائیں', read: 'پڑھیں', wbw: 'لفظ بہ لفظ', found: 'آیات ملیں', rel: 'موضوع', tip: 'مختصر لفظ بھی چلتا ہے: حج، نکاح، صبر، زکوٰۃ…' },
    en: { t: 'Search the Quran', ph: 'Type a topic, word or ayah… (e.g. hajj, marriage, 2:255)', pop: 'Popular topics', none: 'Nothing found. Try another word.', load: 'Getting ready…', more: 'Show more', read: 'Read', wbw: 'Word by word', found: 'ayat found', rel: 'Topic', tip: 'Short words work: hajj, nikah, patience, zakat…' }
  };
  const ui = () => { try { const f = window.__fahm; const st = typeof f.st === 'function' ? f.st() : f.st; return (st && st.ui) || 'ru'; } catch (e) { return 'ru'; } };
  Object.assign(TT.ru, { qir: 'Qirat sunein', trs: 'Tarjuma sunein', taf: 'Tafseer', stop: 'Rokein', tafL: 'Tafseer load ho rahi hai…', tafE: 'Tafseer ke liye internet zaroori hai', noTr: 'Is zubaan ki tarjuma aawaz maujood nahin' });
  Object.assign(TT.ur, { qir: 'قراءت سنیں', trs: 'ترجمہ سنیں', taf: 'تفسیر', stop: 'روکیں', tafL: 'تفسیر لوڈ ہو رہی ہے…', tafE: 'تفسیر کے لیے انٹرنیٹ درکار ہے', noTr: 'اس زبان کے ترجمے کی آواز موجود نہیں' });
  Object.assign(TT.en, { qir: 'Listen to qirat', trs: 'Listen to translation', taf: 'Tafseer', stop: 'Stop', tafL: 'Loading tafseer…', tafE: 'Tafseer needs internet', noTr: 'No translation audio for this language' });
  const T = () => TT[ui()] || TT.ru;
  /* Build 32: listen + tafseer inside search */
  let sau = null, sbtn = null;
  function sStop() { try { if (sau) { sau.onended = null; sau.pause(); } } catch (e) { } sau = null; if (sbtn) { sbtn.classList.remove('on'); sbtn.textContent = sbtn.dataset.lbl; } sbtn = null; }
  function sPlay(btn, url) { const same = sbtn === btn; sStop(); if (same || !url) { if (!url) toastS(T().noTr); return; } try { window.__fahmApp && __fahmApp.stopAll(); } catch (e) { } sau = new Audio(url); sbtn = btn; btn.dataset.lbl = btn.dataset.lbl || btn.textContent; btn.classList.add('on'); btn.textContent = '■ ' + T().stop; sau.onended = sStop; sau.onerror = sStop; const pr = sau.play(); if (pr && pr.catch) pr.catch(sStop); }
  function toastS(m) { try { window.__fahmApp.toast(m); } catch (e) { } }
  const TAFC = {};
  function sTaf(box, s, a) {
    if (box.dataset.open === '1') { box.dataset.open = '0'; box.innerHTML = ''; return; } box.dataset.open = '1';
    const u = ui(), id = u === 'en' ? 169 : 160, key = id + ':' + s + ':' + a, t = T(); box.innerHTML = `<p class="dim">${esc(t.tafL)}</p>`;
    (TAFC[key] ? Promise.resolve(TAFC[key]) : fetch(`https://api.quran.com/api/v4/tafsirs/${id}/by_ayah/${s}:${a}`).then(r => { if (!r.ok) throw 0; return r.json(); }).then(j => (TAFC[key] = { t: String(j.tafsir.text || '').replace(/<(?!\/?(p|br|b|i)\b)[^>]*>/gi, ''), n: j.tafsir.resource_name || '' })))
      .then(async v => { let tx = v.t; if (u === 'ru' && window.FahmConv) { try { await FahmConv.load(); tx = FahmConv.roman(tx); } catch (e) { } } box.innerHTML = `<div class="srtaf"${u === 'ur' ? ' dir="rtl"' : ''}>${tx}</div><small>${esc(v.n)} · Quran.com</small>`; })
      .catch(() => { box.innerHTML = `<p class="dim">${esc(t.tafE)}</p>`; });
  }
  const D = () => { try { const f = window.__fahm; return typeof f.D === 'function' ? f.D() : f.D; } catch (e) { return null; } };
  const nrm = s => String(s || '').toLowerCase().replace(/[’‘`´]/g, "'").replace(/[ˈ˹˺]/g, '').trim();
  const arn = s => (window.FahmHafiz ? window.FahmHafiz.norm(s) : s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const digits = s => String(s).replace(/[٠-٩]/g, d => d.charCodeAt(0) - 1632).replace(/[۰-۹]/g, d => d.charCodeAt(0) - 1776);
  const kwRe = {};
  function hit(text, kw) {
    if (!/^[a-z' -]+$/.test(kw)) return text.indexOf(kw) >= 0;
    let r = kwRe[kw]; if (!r) r = kwRe[kw] = new RegExp("(^|[^a-z])" + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); return r.test(text);
  }

  let DB = null, loading = null;     /* DB = [{s,a,en,ur,rur,ar,arn}] */
  function load() {
    if (DB) return Promise.resolve(DB); if (loading) return loading;
    const d = D(); if (!d) return Promise.resolve([]);
    const fetchJ = u => fetch(u).then(r => r.json()).catch(() => []);
    loading = fetch('q/arabic.json').then(r => r.json()).then(AR => Promise.all(d.surahs.map(async su => {
      const n = String(su.n).padStart(3, '0'); const [en, ur, rur] = await Promise.all([fetchJ('q/t/en/' + n + '.json'), fetchJ('q/t/ur/' + n + '.json'), fetchJ('q/t/rur/' + n + '.json')]);
      return (AR[su.n - 1] || []).map((ip, i) => ({ s: su.n, a: i + 1, en: nrm(en[i]), ur: ur[i] || '', rur: nrm(rur[i]), raw: { en: en[i] || '', ur: ur[i] || '', rur: rur[i] || '' }, arn: arn(ip), ar: ip }));
    }))).then(a => { DB = [].concat(...a); return DB; });
    return loading;
  }
  /* which topics does the query belong to? (prefix match on the typed words) */
  function topicsFor(q) {
    const ql = nrm(q), toks = ql.split(/\s+/).filter(Boolean), out = [];
    TOPICS.forEach(tp => { const hitT = tp[0].some(nm => { const n = nrm(nm); return ql === n || (n.length >= 3 && ql.length >= 3 && (n.indexOf(ql) === 0 || ql.indexOf(n) === 0)) || toks.some(t => t.length >= 3 && (t === n || (n.indexOf(t) === 0 && t.length >= 4))); }); if (hitT) out.push(tp); });
    return out;
  }
  function run(q) {
    q = String(q || '').trim(); if (!q || !DB) return { list: [], terms: [] };
    const dq = digits(q); const m = /^(\d{1,3})\s*[:.\- ]\s*(\d{1,3})$/.exec(dq);
    if (m) { const r = DB.filter(x => x.s === +m[1] && x.a === +m[2]); return { list: r.map(x => ({ x, sc: 99 })), terms: [] }; }
    const isAr = /[؀-ۿ]/.test(q) && !/[ٹپچڈڑژکگںھہے]/.test(q.replace(/[کگ]/g, ''));
    const qn = nrm(q), toks = qn.split(/\s+/).filter(t => t.length >= 2);
    const tps = topicsFor(q), kws = new Set(); tps.forEach(tp => tp[1].forEach(k => kws.add(nrm(k))));
    const res = [];
    const aq = arn(q);
    DB.forEach(x => {
      let sc = 0;
      if (aq.length >= 3 && x.arn.indexOf(aq) >= 0) sc += 12;       /* Arabic phrase of the ayah itself */
      let direct = 0; toks.forEach(t => { if (hit(x.en, t) || hit(x.rur, t) || x.ur.indexOf(t) >= 0) direct++; });
      if (toks.length && direct === toks.length) sc += 6 + direct * 2; else if (direct) sc += direct;
      if (qn.length >= 4 && (x.en.indexOf(qn) >= 0 || x.rur.indexOf(qn) >= 0 || x.ur.indexOf(qn) >= 0)) sc += 5;   /* exact phrase */
      if (kws.size) { let k = 0; kws.forEach(w => { if (hit(x.en, w) || hit(x.rur, w) || x.ur.indexOf(w) >= 0) k++; }); if (k) sc += Math.min(k, 6) * 1.5; }
      if (sc > 0) res.push({ x, sc });
    });
    res.sort((a, b) => b.sc - a.sc || a.x.s - b.x.s || a.x.a - b.x.a);
    return { list: res, terms: [...new Set([...toks, ...kws])].filter(t => t.length >= 3), topics: tps.map(t => t[0][0]) };
  }
  function hl(text, terms) {
    let h = esc(text); if (!terms.length) return h;
    const ts = terms.filter(t => /^[^\s]{3,}$/.test(t) || t.indexOf(' ') > 0).slice(0, 40).sort((a, b) => b.length - a.length);
    ts.forEach(t => { try { const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'); h = h.replace(re, '<mark>$1</mark>'); } catch (e) { } });
    return h;
  }

  /* ---------- voice search: recite an ayah, say a word, or say a topic ---------- */
  const VTT = {
    ru: { title: 'Bol kar dhoondein', ay: 'Ayat ya lafz padhein (Arabi)', ayS: 'Koi ayat ka hissa padhein — wahi ayat milegi. Sirf ek lafz bolein — us lafz wali saari ayaat.', tp: 'Mauzu bolein (Urdu / English)', tpS: 'Jaise: "sabr", "walidain", "jannat"', lis: 'Sun raha hoon… bolte rahein', stop: 'Bas', no: 'Aawaz samajh nahin aayi. Dobara koshish karein.', mic: 'Mic ki ijazat dein (Settings → Apps → Fahm → Permissions).', nos: 'Is phone par aawaz pehchanne ki suvidha nahin mili (Google app update karein).', here: 'Yahin se', ayF: 'milti julti ayaat — sabse upar wahi jo aap ne padhi', wF: 'is lafz wali ayaat' },
    ur: { title: 'بول کر تلاش', ay: 'آیت یا لفظ پڑھیں (عربی)', ayS: 'کسی آیت کا حصہ پڑھیں — وہی آیت ملے گی۔ صرف ایک لفظ بولیں — اس لفظ والی ساری آیات۔', tp: 'موضوع بولیں (اردو / انگریزی)', tpS: 'جیسے: "صبر"، "والدین"، "جنت"', lis: 'سن رہا ہوں… بولتے رہیں', stop: 'بس', no: 'آواز سمجھ نہیں آئی۔ دوبارہ کوشش کریں۔', mic: 'مائک کی اجازت دیں (Settings → Apps → Fahm → Permissions)۔', nos: 'اس فون پر آواز پہچاننے کی سہولت نہیں ملی (گوگل ایپ اپڈیٹ کریں)۔', here: 'یہیں سے', ayF: 'ملتی جلتی آیات — سب سے اوپر وہی جو آپ نے پڑھی', wF: 'اس لفظ والی آیات' },
    en: { title: 'Search by voice', ay: 'Recite an ayah or a word (Arabic)', ayS: 'Recite part of any ayah to find it. Say a single word to get every ayah with that word.', tp: 'Say a topic (Urdu / English)', tpS: 'e.g. "patience", "parents", "paradise"', lis: 'Listening… keep speaking', stop: 'Stop', no: "Couldn't catch that. Please try again.", mic: 'Allow the microphone (Settings → Apps → Fahm → Permissions).', nos: 'Speech recognition is not available on this phone (update the Google app).', here: 'From here', ayF: 'matching ayat — the closest one first', wF: 'ayat with this word' }
  };
  const VT = () => VTT[ui()] || VTT.ru;
  const vs = { on: false, mode: '', txt: '', web: null, tm: 0, done: false };
  const natOk = () => { try { return !!(window.FahmAndroid && FahmAndroid.speechAvailable && FahmAndroid.speechAvailable()); } catch (e) { return false; } };
  const webSR = () => window.SpeechRecognition || window.webkitSpeechRecognition;
  function vsPanel(force) {
    const P = ov.querySelector('.srv'); if (!force && !P.hidden && !vs.on) { P.hidden = true; return; } const t = VT(); P.hidden = false;
    P.innerHTML = `<div class="srvt">🎙 ${esc(t.title)}</div><button class="srvb" data-vs="ar"><b>🕌 ${esc(t.ay)}</b><small>${esc(t.ayS)}</small></button><button class="srvb" data-vs="tp"><b>💬 ${esc(t.tp)}</b><small>${esc(t.tpS)}</small></button>`;
  }
  function vsUI(txt) { const P = ov.querySelector('.srv'), t = VT(); P.hidden = false; P.innerHTML = `<div class="srvl"><span class="srvw"><i></i><i></i><i></i><i></i><i></i></span><b>${esc(t.lis)}</b></div><div class="srvx${vs.mode === 'ar' ? ' ar' : ''}">${esc(txt || '…')}</div><button class="po on" data-vstop="1">${esc(t.stop)}</button>`; }
  (window.FahmOverlays = window.FahmOverlays || []).push({ isOpen: () => !!(ov && !ov.hidden && !ov.querySelector('.srv').hidden), close: () => { vsStop(false); ov.querySelector('.srv').hidden = true; } });
  window.__fahmVS = { active: () => vs.on, cb(type, text) {
    if (!vs.on) return;
    if (type === 'partial') { vs.txt = text; vsUI(text); }
    else if (type === 'final') { vs.txt = text; vsDone(); }
    else if (type === 'permok') { try { FahmAndroid.startListen(vs.lang); } catch (e) { } }
    else if (type === 'permno') { vs.on = false; toastS(VT().mic); vsPanel(true); }
    else if (type === 'end') { if (!vs.done) vsDone(); }
    else if (type === 'error') { vs.on = false; toastS(/perm/i.test(text || '') ? VT().mic : VT().no); vsPanel(true); }
  } };
  function vsStart(mode) {
    vsStop(false); sStop(); try { window.__fahmApp && __fahmApp.stopAll(); } catch (e) { }
    const u = ui(); vs.mode = mode; vs.txt = ''; vs.done = false; vs.lang = mode === 'ar' ? 'ar-SA' : (u === 'en' ? 'en-IN' : 'ur-PK');
    if (natOk()) { vs.on = true; vsUI(''); try { FahmAndroid.startListen(vs.lang); } catch (e) { vs.on = false; toastS(VT().nos); } return; }
    const SR = webSR(); if (!SR) { toastS(VT().nos); return; }
    const r = new SR(); vs.web = r; vs.on = true; r.lang = vs.lang; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    r.onresult = e => { let f = '', fin = false; for (let i = 0; i < e.results.length; i++) { f += e.results[i][0].transcript + ' '; if (e.results[i].isFinal) fin = true; } vs.txt = f.trim(); vsUI(vs.txt); if (fin) vsDone(); };
    r.onerror = e => { vs.on = false; toastS(/not-allowed|service/.test(e.error) ? VT().mic : VT().no); vsPanel(true); };
    r.onend = () => { if (vs.on && !vs.done) vsDone(); };
    vsUI(''); try { r.start(); } catch (e) { vs.on = false; }
  }
  function vsStop(apply) {
    if (vs.web) { try { vs.web.onend = null; vs.web.abort(); } catch (e) { } vs.web = null; }
    if (vs.on) { try { window.FahmAndroid && FahmAndroid.stopListen && FahmAndroid.stopListen(); } catch (e) { } }
    const was = vs.on; vs.on = false; if (apply && was && vs.txt) vsDone(); else if (apply) vsPanel(true);
  }
  /* fuzzy ayah finder: in-order token overlap between what was heard and each ayah (plus the next one, for recitations that cross the ayah end) */
  function vsFind(heard) {
    const tok = v => String(v || '').split(/\s+/).map(arn).filter(w => w.length > 1); const H = tok(heard); if (!H.length) return [];
    const sim = (a, b) => a === b || (a.length >= 3 && b.length >= 3 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0));
    if (H.length === 1) { const w = H[0]; return DB.filter(x => (x._t || (x._t = tok(x.ar))).some(t => sim(t, w))).map(x => ({ x, sc: 1 })); }
    const out = [];
    DB.forEach((x, i) => {
      const T0 = x._t || (x._t = tok(x.ar)); let best = 0;
      for (let st = 0; st < T0.length; st++) { if (!sim(T0[st], H[0]) && !(H[1] && sim(T0[st], H[1]))) continue; let j = st, k = 0, m = 0; while (j < T0.length && k < H.length) { if (sim(T0[j], H[k])) { m++; j++; k++; } else if (k + 1 < H.length && sim(T0[j], H[k + 1])) { k++; } else j++; } if (m > best) best = m; }
      if (best >= Math.min(2, H.length)) out.push({ x, sc: best / H.length + (best / T0.length) * .25 });
    });
    out.sort((a, b) => b.sc - a.sc); return out.slice(0, 30);
  }
  function vsDone() {
    if (vs.done) return; vs.done = true; vs.on = false; if (vs.web) { try { vs.web.onend = null; vs.web.abort(); } catch (e) { } vs.web = null; }
    const txt = (vs.txt || '').trim(), t = VT(), P = ov.querySelector('.srv'); if (!txt) { toastS(t.no); vsPanel(true); return; }
    P.hidden = true; const inp = ov.querySelector('#srq'); inp.value = txt;
    if (vs.mode !== 'ar') { go(txt); return; }
    const finish = () => { const list = vsFind(txt), one = String(txt).split(/\s+/).map(arn).filter(w => w.length > 1).length === 1; ov.querySelector('.srp').hidden = true;
      cur = { list, terms: [], topics: [] }; shown = 0; ov.querySelector('.srl').innerHTML = '';
      ov.querySelector('.srt').innerHTML = list.length ? `<b>${list.length}</b> ${esc(one ? t.wF : t.ayF)} · <span class="ar">${esc(txt)}</span>` : esc(T().none); render(false); };
    if (!DB) load().then(finish); else finish();
  }
  let ov = null, shown = 0, cur = null;
  const surahName = n => { try { const s = D().surahs[n - 1]; return s.en; } catch (e) { return 'Surah ' + n; } };
  function build() {
    if (ov) return ov; ov = document.createElement('div'); ov.id = 'sr'; ov.hidden = true;
    ov.innerHTML = '<div class="srh"><button class="srx" aria-label="close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="srb"><svg viewBox="0 0 24 24" class="srm"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input id="srq" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="srmic" aria-label="mic"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg></button></div></div><div class="srv" hidden></div><div class="srt"></div><div class="srp"></div><div class="srl"></div>';
    document.body.appendChild(ov);
    ov.querySelector('.srx').onclick = close;
    const inp = ov.querySelector('#srq'); let tm = 0; inp.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => go(inp.value), 220); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(tm); go(inp.value); inp.blur(); } });
    ov.addEventListener('click', e => {
      if (e.target.closest('.srmic')) { vsPanel(); return; } const vk = e.target.closest('[data-vs]'); if (vk) { vsStart(vk.dataset.vs); return; } if (e.target.closest('[data-vstop]')) { vsStop(true); return; } const pl = e.target.closest('[data-play]'); if (pl) { const [s2, a2] = pl.dataset.play.split(':').map(Number); sStop(); hideKeep(); try { window.__fahm.goTo(s2 - 1, a2 - 1, 0, true); } catch (er) { } return; }
      const ch = e.target.closest('[data-q]'); if (ch) { inp.value = ch.dataset.q; go(ch.dataset.q); return; }
      const mo = e.target.closest('[data-more]'); if (mo) { render(true); return; }
      const rd = e.target.closest('[data-read]'); if (rd) { const [s, a] = rd.dataset.read.split(':').map(Number); sStop(); hideKeep(); try { window.__fahm.goTo(s - 1, a - 1, 0, false, true); } catch (er) { } try { window.FahmReader.openHl(s, a); } catch (er) { } return; }
      const wb = e.target.closest('[data-wbw]'); if (wb) { const [s, a] = wb.dataset.wbw.split(':').map(Number); sStop(); hideKeep(); try { window.__fahm.goTo(s - 1, a - 1, 0); } catch (er) { } return; }
      const qb = e.target.closest('[data-qir]'); if (qb) { const [s, a] = qb.dataset.qir.split(':').map(Number); const st = (window.__fahmApp && __fahmApp.st()) || {}; sPlay(qb, window.FahmWT ? FahmWT.url(st.rec || 'Alafasy_128kbps', s, a) : `https://everyayah.com/data/Alafasy_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`); return; }
      const tb = e.target.closest('[data-trs]'); if (tb) { const [s, a] = tb.dataset.trs.split(':').map(Number); sPlay(tb, window.FahmWT && FahmWT.trUrl ? FahmWT.trUrl(s, a, ui()) : null); return; }
      const fb = e.target.closest('[data-taf]'); if (fb) { const [s, a] = fb.dataset.taf.split(':').map(Number); sTaf(fb.closest('.sri').querySelector('.srtb'), s, a); return; }
    });
    return ov;
  }
  function chips() {
    const t = T(); ov.querySelector('.srp').innerHTML = `<div class="srpt">${esc(t.pop)}</div><div class="srcs">${POP.map(p => `<button class="po sm" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div><p class="srtip">${esc(t.tip)}</p>`;
  }
  function go(q) {
    q = String(q || '').trim(); const t = T(), L = ov.querySelector('.srl'), S = ov.querySelector('.srt');
    if (!q) { cur = null; L.innerHTML = ''; S.textContent = ''; ov.querySelector('.srp').hidden = false; return; }
    ov.querySelector('.srp').hidden = true;
    if (!DB) { S.textContent = t.load; load().then(() => { if (ov.querySelector('#srq').value.trim() === q) go(q); }); return; }
    cur = run(q); shown = 0; L.innerHTML = '';
    S.innerHTML = cur.list.length ? `<b>${cur.list.length}</b> ${esc(t.found)}${cur.topics && cur.topics.length ? ' · ' + esc(t.rel) + ': <i>' + esc(cur.topics.join(', ')) + '</i>' : ''}` : esc(t.none);
    render(false);
  }
  function render(more) {
    const L = ov.querySelector('.srl'), t = T(); if (!cur) return; const u = ui(), key = u === 'ur' ? 'ur' : u === 'en' ? 'en' : 'rur';
    const old = L.querySelector('.srmore'); if (old) old.remove();
    const end = Math.min(cur.list.length, shown + 40), parts = [];
    for (let i = shown; i < end; i++) {
      const { x } = cur.list[i]; const tr = x.raw[key] || x.raw.en;
      parts.push(`<article class="sri"><div class="srr"><b>${esc(surahName(x.s))} ${x.s}:${x.a}</b><span><button class="po sm on" data-play="${x.s}:${x.a}">▶ ${esc(VT().here)}</button><button class="po sm" data-read="${x.s}:${x.a}">${esc(t.read)}</button><button class="po sm" data-wbw="${x.s}:${x.a}">${esc(t.wbw)}</button></span></div><div class="sra ar" data-qir="${x.s}:${x.a}" role="button">${esc(x.ar)}</div><p class="srtx${key === 'ur' ? ' ur' : ''}">${hl(tr, cur.terms)}</p><div class="srac"><button class="po sm" data-qir="${x.s}:${x.a}">▶ ${esc(t.qir)}</button><button class="po sm" data-trs="${x.s}:${x.a}">▶ ${esc(t.trs)}</button><button class="po sm" data-taf="${x.s}:${x.a}">📖 ${esc(t.taf)}</button></div><div class="srtb"></div></article>`);
    }
    L.insertAdjacentHTML('beforeend', parts.join('')); shown = end;
    if (shown < cur.list.length) L.insertAdjacentHTML('beforeend', `<button class="po on srmore" data-more="1">${esc(t.more)} (${cur.list.length - shown})</button>`);
    if (!more) L.scrollTop = 0;
  }
  function open() {
    build(); const t = T(); ov.querySelector('.srh #srq').placeholder = t.ph; chips(); ov.hidden = false; ov.querySelector('.srp').hidden = false; ov.querySelector('#srq').value = ''; ov.querySelector('.srt').textContent = ''; ov.querySelector('.srl').innerHTML = '';
    load(); setTimeout(() => { try { ov.querySelector('#srq').focus(); } catch (e) { } }, 200);
    try { window.__sfx && window.__sfx.tap && window.__sfx.tap(); } catch (e) { }
  }
  function close() { sStop(); vsStop(false); if (ov) { ov.hidden = true; const P = ov.querySelector('.srv'); if (P) P.hidden = true; } }
  /* hide but keep the results, so Back from the reader / main screen returns to this exact search */
  function hideKeep() { if (!ov) return; ov.hidden = true; try { window.FahmNav && FahmNav.push(() => { ov.hidden = false; }); } catch (e) { } }
  /* header button, placed just before the language button */
  function mount() {
    const top = document.querySelector('header.top'); if (!top || document.getElementById('btnFind')) return;
    const b = document.createElement('button'); b.id = 'btnFind'; b.className = 'ib'; b.setAttribute('aria-label', 'Search');
    b.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><em class="hl" data-k="btnFind"></em>'; b.onclick = open;
    const lang = document.getElementById('btnLang'); top.insertBefore(b, lang || top.lastElementChild);
  }
  document.addEventListener('DOMContentLoaded', mount); if (document.readyState !== 'loading') mount();
  window.FahmSearch = { open, close, run: q => load().then(() => run(q)), _topicsFor: topicsFor };
})();

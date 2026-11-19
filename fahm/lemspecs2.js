/* Per-word overrides: every word that used to share a scene now has its own motif/mode, meaning-note and label. */
(function () {
  const LEM = window.FAHM_LEM; if (!LEM) return;
  const O = (ar, m, p, n, l) => { const old = LEM[ar] || {}; LEM[ar] = { m, p: Object.assign({}, p, l ? { l } : {}), n: { ur: n[0], ru: n[1], en: n[2] } }; };

  /* worship & prayer */
  O('اياك', 'worship', { mode: 'only' }, ['صرف تجھی کو: ساری بندگی کا رخ ایک ہی طرف', 'Sirf Tujhi ko: saari bandagi ka rukh ek hi taraf', 'You alone: all devotion aimed at the One'], ['صرف تجھی کو', 'SIRF TUJHI KO', 'YOU ALONE']);
  O('واياك', 'worship', { mode: 'help' }, ['اور صرف تجھ سے مدد: پکار اوپر جاتی ہے، مدد نیچے اترتی ہے', 'Aur sirf Tujh se madad: pukaar oopar jaati hai, madad neeche utarti hai', 'And from You alone we seek help: the call rises, help comes down'], ['مدد', 'MADAD', 'HELP']);
  O('فليعبدوا', 'worship', { mode: 'turn' }, ['پس وہ بندگی کریں: سب کا رخ ایک مرکز کی طرف مڑتا ہے', 'Pas woh bandagi karein: sab ka rukh ek markaz ki taraf mudta hai', 'So let them worship: every heart turns to one centre'], ['بندگی', 'BANDAGI', 'SERVE']);
  O('لايلف', 'worship', { mode: 'chain' }, ['الفت و اُنس: حلقے ایک دوسرے میں پروئے ہوئے', 'Ulfat o uns: halqe ek doosre mein piroye hue', 'Familiarity and affection: rings interlocked'], ['الفت', 'ULFAT', 'AFFINITY']);
  O('الفهم', 'worship', { mode: 'bond' }, ['ان کی وابستگی: دو گروہ ایک دھاگے سے بندھے ہوئے', 'Un ki wabastagi: do giroh ek dhaage se bandhe hue', 'Their bond: two groups tied by one thread'], ['وابستگی', 'WABASTAGI', 'BOND']);
  O('للمصلين', 'worship', { mode: 'saff' }, ['نمازیوں کے لیے: صف بہ صف، قبلے کی طرف', 'Namaziyon ke liye: saff ba saff, qibley ki taraf', 'For those who pray: row on row, facing the Qibla'], ['نمازی', 'NAMAZI', 'WORSHIPPERS']);
  O('صلاتهم', 'worship', { mode: 'heedless' }, ['اپنی نماز (سے غافل): صف سے ایک ایک ہو کر ہٹتے جانا', 'Apni namaz (se ghaafil): saff se ek ek ho kar hatte jaana', 'Their prayer (heedless): drifting out of the row one by one'], ['غفلت', 'GHAFLAT', 'HEEDLESS']);
  O('فصل', 'worship', { mode: 'cycle' }, ['پس نماز پڑھ: قیام، رکوع، سجدہ', 'Pas namaz padh: qiyaam, rukoo, sajda', 'So pray: stand, bow, prostrate'], ['نماز', 'NAMAZ', 'PRAY']);
  O('اعبد', 'worship', { mode: 'abd' }, ['میں بندگی کرتا ہوں: چھوٹا نور اپنے رب کی روشنی سے بندھا ہوا', 'Main bandagi karta hoon: chhota noor apne Rab ki roshni se bandha hua', 'I worship: a small light tethered to the Great Light'], ['بندگی', 'BANDAGI', 'I WORSHIP']);
  O('تعبدون', 'worship', { mode: 'idols' }, ['تم جن کی پوجا کرتے ہو: بے جان مورتیاں', 'Tum jin ki pooja karte ho: be-jaan moortiyaan', 'What you worship: lifeless idols'], ['پوجا', 'POOJA', 'YOU WORSHIP']);
  O('عبدون', 'worship', { mode: 'only1' }, ['(تم) بندگی کرنے والے (نہیں): ایک نور سامنے، باقی دور ہٹتے ہوئے', '(Tum) bandagi karne wale (nahin): ek noor saamne, baaqi door hatte hue', 'You are not worshippers (of what I worship): one light stands, others walk away'], ['عبادت کرنے والے', 'IBAADAT KARNE WALE', 'WORSHIPPERS']);
  O('عابد', 'worship', { mode: 'halo' }, ['بندگی کرنے والا: جھکا ہوا بندہ، گرد نور کا ہالہ', 'Bandagi karne wala: jhuka hua banda, gird noor ka haala', 'A worshipper: bowed, wrapped in a halo'], ['عابد', 'AABID', 'WORSHIPPER']);
  O('عبدتم', 'worship', { mode: 'past' }, ['جن کی تم نے پوجا کی: ماضی کی راہ پر چھوٹے نشان', 'Jin ki tum ne pooja ki: maazi ki raah par chhote nishaan', 'What you worshipped: a trail left on a path behind you'], ['ماضی', 'MAAZI', 'WORSHIPPED']);
  O('اله', 'worship', { mode: 'throne' }, ['معبود: بلندی پر نور کا ستون، سب اس کے نیچے', 'Maabood: bulandi par noor ka sutoon, sab us ke neeche', 'A deity: a pillar of light on high, all gathered beneath'], ['معبود', 'MAABOOD', 'GOD']);
  O('وانحر', 'worship', { mode: 'nahr', color: 'red' }, ['اور قربانی کر: سرخ قطرے، پھر سنہری عطا سب کے لیے', 'Aur qurbaani kar: surkh qatre, phir sunehri ata sab ke liye', 'And sacrifice: red drops, then golden giving spread to all'], ['قربانی', 'QURBAANI', 'SACRIFICE']);

  /* pronouns */
  O('هذا', 'pron2', { mode: 'this' }, ['یہ: ہاتھ کے قریب کی چیز کی طرف اشارہ', 'Yeh: haath ke qareeb ki cheez ki taraf ishaara', 'This: pointing at something near'], ['یہ', 'YEH', 'THIS']);
  O('الذي', 'pron2', { mode: 'rel' }, ['جو (وہ شخص): اپنے ساتھ ایک تعارف جوڑتا ہے', 'Jo (woh shakhs): apne saath ek taaruf jodta hai', 'The one who: linking a person to what describes him'], ['جو', 'JO', 'THE ONE WHO']);
  O('فذلك', 'pron2', { mode: 'that' }, ['وہ (دور والا): نگاہ دور تک جاتی ہے', 'Woh (door wala): nigaah door tak jaati hai', 'That one over there: the gaze reaches far'], ['وہ', 'WOH', 'THAT']);
  O('هو', 'pron2', { mode: 'he' }, ['وہ (غائب کے لیے): ایک ہستی، ایک طرف', 'Woh (ghaaib ke liye): ek hasti, ek taraf', 'He: one being, set apart from us'], ['وہ', 'WOH', 'HE']);
  O('ذات', 'pron2', { mode: 'zat' }, ['ذات: اصل جوہر، اس کے گرد تہیں', 'Zaat: asl jauhar, us ke gird tahein', 'Essence: the core, shells around it'], ['ذات', 'ZAAT', 'ESSENCE']);
  O('هم', 'pron2', { mode: 'they' }, ['وہ سب: دور کھڑا ایک چھوٹا گروہ', 'Woh sab: door khada ek chhota giroh', 'They: a small group, standing apart'], ['وہ سب', 'WOH SAB', 'THEY']);
  O('انا', 'pron2', { mode: 'we', color: 'gold' }, ['ہم (شانِ عظمت): ایک عظیم نور اور اس کے گرد مدار', 'Hum (shaan-e-azmat): ek azeem noor aur us ke gird madaar', 'We (the plural of majesty): a great light with orbits around it'], ['ہم', 'HUM', 'WE']);
  O('انتم', 'pron2', { mode: 'you' }, ['تم سب: قطار میں کھڑے، سیدھا مخاطب', 'Tum sab: qataar mein khade, seedha mukhaatab', 'You all: lined up, addressed directly'], ['تم سب', 'TUM SAB', 'YOU ALL']);
  O('انه', 'pron2', { mode: 'inna' }, ['بے شک وہ: بات پر مہر، یقین کا زور', 'Be-shak woh: baat par mohar, yaqeen ka zor', 'Indeed He: a seal of certainty'], ['بے شک', 'BE-SHAK', 'INDEED']);
  O('كان', 'pron2', { mode: 'kana' }, ['تھا: پیچھے ماضی کی ٹھوس لکیر', 'Tha: peechhe maazi ki thos lakeer', 'Was: a solid line trailing behind the present'], ['تھا', 'THA', 'WAS']);
  O('ابي', 'pron2', { mode: 'father' }, ['میرے والد: بڑا نور چھوٹے کو اپنی چھاؤں میں لیے', 'Mere walid: bada noor chhote ko apni chhaaon mein liye', 'My father: a great light sheltering a small one'], ['والد', 'WALID', 'FATHER']);
  O('وامراته', 'pron2', { mode: 'wife' }, ['اور اس کی بیوی: دو نور ایک دھاگے میں، ایک پر بوجھ', 'Aur us ki biwi: do noor ek dhaage mein, ek par bojh', 'And his wife: two lights bound together, one bearing a load'], ['بیوی', 'BIWI', 'HIS WIFE']);

  /* prepositions */
  O('عليهم', 'prep2', { mode: 'upon' }, ['ان پر: روشنی چھوٹے گروہ پر برستی ہوئی', 'Un par: roshni chhote giroh par barasti hui', 'Upon them: light falling on a small group'], ['ان پر', 'UN PAR', 'UPON THEM']);
  O('يجعل', 'prep2', { mode: 'make' }, ['بنا دیتا ہے: بکھرا ہوا مادہ شکل اختیار کرتا ہے', 'Bana deta hai: bikhra hua maada shakl ikhtiyaar karta hai', 'He makes: raw matter takes a shape'], ['بنانا', 'BANANA', 'MAKES']);
  O('لكم', 'prep2', { mode: 'for' }, ['تمہارے لیے: عطا ایک سے دوسرے تک', 'Tumhare liye: ata ek se doosre tak', 'For you: a gift passed from giver to receiver'], ['تمہارے لیے', 'TUMHARE LIYE', 'FOR YOU']);
  O('ولي', 'prep2', { mode: 'mine' }, ['اور میرے لیے: چھوٹے حلقے میں ملکیت', 'Aur mere liye: chhote halqe mein milkiyat', 'And for me: belonging inside a small ring'], ['میرے لیے', 'MERE LIYE', 'MINE']);
  O('له', 'prep2', { mode: 'his' }, ['اسی کے لیے: ہالہ ایک ہستی کو گھیرے ہوئے', 'Usi ke liye: haala ek hasti ko ghere hue', 'For Him: a halo claiming one being'], ['اسی کے لیے', 'USI KE LIYE', 'FOR HIM']);
  O('عن', 'prep2', { mode: 'away' }, ['سے (دور ہو کر): ایک روشنی دھیرے دھیرے ہٹتی ہوئی', 'Se (door ho kar): ek roshni dheere dheere hatti hui', 'Away from: a light drifting off and dimming'], ['سے دور', 'SE DOOR', 'AWAY FROM']);
  O('عنه', 'prep2', { mode: 'frm' }, ['اس سے: ڈور ٹوٹ کر الگ ہو جاتی ہے', 'Us se: dor toot kar alag ho jaati hai', 'From him: the thread snaps and parts'], ['اس سے', 'US SE', 'FROM HIM']);
  O('ومن', 'prep2', { mode: 'and-from' }, ['اور (ایک اور) سے: دو سرچشمے ایک منزل کی طرف', 'Aur (ek aur) se: do sarchashme ek manzil ki taraf', 'And from: two sources flowing toward one place'], ['اور سے', 'AUR SE', 'AND FROM']);

  /* calls & speech */
  O('كيف', 'call', { mode: 'how', color: 'cyan' }, ['کیسے: سوالیہ نشان، راستہ اور قدم', 'Kaise: sawaliya nishaan, raasta aur qadam', 'How: a question mark made of steps'], ['کیسے', 'KAISE', 'HOW']);
  O('يحض', 'call', { mode: 'urge', color: 'orange' }, ['ترغیب دیتا ہے: بار بار دھکیلنا منزل کی طرف', 'Targheeb deta hai: baar baar dhakelna manzil ki taraf', 'Urges: nudging again and again toward a goal'], ['ترغیب', 'TARGHEEB', 'URGES']);
  O('يكن', 'call', { mode: 'be' }, ['ہو جاتا ہے: عدم سے ایک دم وجود', 'Ho jaata hai: adam se ek dam wujood', 'Comes to be: from nothing, existence blooms'], ['ہونا', 'HONA', 'BE']);
  O('ان', 'call', { mode: 'seal' }, ['بے شک: حلقے مہر کی طرح بند ہوتے ہیں', 'Be-shak: halqe mohar ki tarah band hote hain', 'Indeed: rings lock like a seal'], ['بے شک', 'BE-SHAK', 'INDEED']);
  O('وما', 'call', { mode: 'andno' }, ['اور کیا (نہیں): دو حلقے ایک دھاگے میں', 'Aur kya (nahin): do halqe ek dhaage mein', 'And what / and not: two rings chained'], ['اور کیا', 'AUR KYA', 'AND WHAT']);
  O('ما', 'call', { mode: 'what' }, ['کیا: ایک گھومتی ہوئی تلاش', 'Kya: ek ghoomti hui talaash', 'What: a scanning search'], ['کیا', 'KYA', 'WHAT']);
  O('يايها', 'call', { mode: 'call' }, ['اے لوگو: پکار، اور لوگ مڑ کر متوجہ', 'Ae logo: pukaar, aur log mud kar mutawajjeh', 'O you who: a call, and heads turn toward it'], ['اے لوگو', 'AE LOGO', 'O YOU']);
  O('قل', 'call', { mode: 'say' }, ['کہہ دو: حکم کی آواز، لہریں آگے بڑھتی ہوئی', 'Keh do: hukm ki awaaz, lehrein aage badhti hui', 'Say: a voice issuing a command'], ['کہہ دو', 'KEH DO', 'SAY']);

  /* people */
  O('الذين', 'people', { mode: 'rel' }, ['وہ لوگ جو: ایک گروہ قوسین میں', 'Woh log jo: ek giroh qausain mein', 'Those who: a group set within brackets'], ['وہ لوگ جو', 'WOH LOG JO', 'THOSE WHO']);
  O('باصحب', 'people', { mode: 'army', color: 'orange' }, ['والوں کے ساتھ: ایک لشکر قطار در قطار', 'Waalon ke saath: ek lashkar qataar dar qataar', 'The people of: a column in ranks'], ['لشکر', 'LASHKAR', 'COMPANY']);
  O('قريش', 'people', { mode: 'quraysh', color: 'gold' }, ['قریش: قبیلہ اپنے مقدس گھر کے گرد', 'Quraysh: qabeela apne muqaddas ghar ke gird', 'Quraysh: a tribe gathered around its sacred house'], ['قریش', 'QURAYSH', 'QURAYSH']);
  O('الناس', 'people', { mode: 'all' }, ['لوگ: ہر رنگ، ہر قوم، زمین کے گرد', 'Log: har rang, har qaum, zameen ke gird', 'The people: every colour and nation around the earth'], ['لوگ', 'LOG', 'PEOPLE']);
  O('والناس', 'people', { mode: 'all2' }, ['اور لوگ: انسانیت گھومتے حلقوں میں', 'Aur log: insaaniyat ghoomte halqon mein', 'And mankind: humanity in turning rings'], ['انسان', 'INSAAN', 'MANKIND']);
  O('يدخلون', 'people', { mode: 'enter' }, ['داخل ہوتے ہیں: لوگ دروازے سے روشنی میں', 'Daakhil hote hain: log darwaze se roshni mein', 'Entering: people stream through the doorway into light'], ['داخل', 'DAAKHIL', 'ENTER']);
  O('افواجا', 'people', { mode: 'waves' }, ['فوج در فوج: گروہ کے بعد گروہ', 'Fauj dar fauj: giroh ke baad giroh', 'In multitudes: wave after wave arriving'], ['فوج در فوج', 'FAUJ DAR FAUJ', 'IN WAVES']);

  /* negation */
  O('غير', 'no', { mode: 'ghayr' }, ['کے سوا / ہٹ کر: ایک راہ دوسری سے الگ', 'Ke siwa / hat kar: ek raah doosri se alag', 'Other than: one path branching off another'], ['کے سوا', 'KE SIWA', 'OTHER THAN']);
  O('ولا', 'no', { mode: 'wala' }, ['اور نہ: دو بند حلقے، بیچ میں ”اور“', 'Aur na: do band halqe, beech mein “aur”', 'And not: two barred rings joined'], ['اور نہ', 'AUR NA', 'AND NOT']);
  O('لا', 'no', { mode: 'la' }, ['نہیں: کٹا ہوا دائرہ', 'Nahin: kata hua daayra', 'No / not: the barred circle'], ['نہیں', 'NAHIN', 'NOT']);
  O('لم', 'no', { mode: 'lam' }, ['نہ ہوا: راستہ منزل تک پہنچنے سے پہلے رک گیا', 'Na hua: raasta manzil tak pahunchne se pehle ruk gaya', 'Did not: a path that stops short of its goal'], ['نہ ہوا', 'NA HUA', 'DID NOT']);
  O('ولم', 'no', { mode: 'walam' }, ['اور نہ ہوا: دو کوششیں ایک ہی دیوار پر رکیں', 'Aur na hua: do koshishein ek hi deewar par rukin', 'And did not: two attempts, one wall'], ['اور نہ ہوا', 'AUR NA HUA', 'AND DID NOT']);
  O('الم', 'no', { mode: 'alam' }, ['کیا نہیں؟: سوال کا حلقہ، کٹی ہوئی روشنی', 'Kya nahin?: sawaal ka halqa, kati hui roshni', 'Did He not?: a ring of question around a barred light'], ['کیا نہیں', 'KYA NAHIN', 'DID HE NOT']);
  O('يكذب', 'no', { mode: 'deny', color: 'violet' }, ['جھٹلاتا ہے: نور کی طرف پیٹھ، سایہ پھیلتا ہوا', 'Jhutlata hai: noor ki taraf peeth, saaya phailta hua', 'Denies: turning the back to the light, a shadow spreading'], ['جھٹلانا', 'JHUTLANA', 'DENIES']);

  /* ruin */
  O('المغضوب', 'ruin', { mode: 'wrath' }, ['جن پر غضب ہوا: سرخ آندھی اور بجلی', 'Jin par ghazab hua: surkh aandhi aur bijli', 'Those with wrath upon them: a red storm and lightning'], ['غضب', 'GHAZAB', 'WRATH']);
  O('فجعلهم', 'ruin', { mode: 'made', color: 'orange' }, ['پھر انہیں کر دیا: جسم ریزہ ریزہ، بھوسے کی طرح', 'Phir unhein kar diya: jism reza reza, bhoose ki tarah', 'And made them: bodies broken into shreds'], ['ریزہ ریزہ', 'REZA REZA', 'SHREDDED']);
  O('فويل', 'ruin', { mode: 'woe' }, ['پس بربادی: اندھیرے گڑھے میں گرتا ہوا', 'Pas barbaadi: andhere gadhe mein girta hua', 'So woe: falling into a dark pit'], ['ہلاکت', 'HALAAKAT', 'WOE']);
  O('تبت', 'ruin', { mode: 'tabbat', color: 'orange' }, ['ٹوٹ گئیں: دو بازو بیچ سے ٹوٹتے ہوئے', 'Toot gayeen: do baazu beech se tootte hue', 'Perished: two arms snapping apart'], ['ٹوٹ گئیں', 'TOOT GAYEEN', 'PERISHED']);
  O('وتب', 'ruin', { mode: 'watab', color: 'orange' }, ['اور وہ خود بھی برباد: دراڑ پڑا گولا بکھر جاتا ہے', 'Aur woh khud bhi barbaad: daraar pada gola bikhar jaata hai', 'And he too is ruined: a cracked sphere falling apart'], ['برباد', 'BARBAAD', 'RUINED']);
  O('يدا', 'ruin', { mode: 'yada', color: 'orange' }, ['دونوں ہاتھ: کھلی ہتھیلیاں جو ریت کی طرح بکھر جائیں', 'Dono haath: khuli hatheliyan jo ret ki tarah bikhar jaayein', 'Two hands: open palms crumbling to dust'], ['دونوں ہاتھ', 'DONO HAATH', 'TWO HANDS']);
  O('شر', 'ruin', { mode: 'shar' }, ['برائی: کانٹے دار سیاہ ستارہ، پھیلتی سیاہی', 'Buraai: kaante-daar siyaah sitaara, phailti siyaahi', 'Evil: a spiked dark star, ink spreading'], ['برائی', 'BURAAI', 'EVIL']);

  /* mercy & gifts */
  O('الرحيم', 'gift', { mode: 'raheem' }, ['نہایت رحم والا: خاص رحمت چند ایمان والوں پر مرکوز', 'Nihayat raham wala: khaas rehmat chand imaan walon par markooz', 'Ar-Raheem: warm mercy focused on those who believe'], ['رحیم', 'RAHEEM', 'AR-RAHEEM']);
  O('انعمت', 'gift', { mode: 'favour' }, ['تو نے انعام کیا: برکت کے حلقے ایک چھوٹے نور پر اترتے ہیں', 'Tu ne inaam kiya: barkat ke halqe ek chhote noor par utarte hain', 'You favoured: rings of blessing landing on one small light'], ['انعام', 'INAAM', 'FAVOUR']);
  O('الماعون', 'gift', { mode: 'maun' }, ['چھوٹی چھوٹی مدد: ہاتھوں ہاتھ آگے پہنچتی ہوئی', 'Chhoti chhoti madad: haathon haath aage pahunchti hui', 'Small kindnesses: handed on from one to the next'], ['چھوٹی مدد', 'CHHOTI MADAD', 'SMALL KINDNESS']);
  O('اعطينك', 'gift', { mode: 'given' }, ['ہم نے تجھے عطا کیا: بڑا نور چھوٹے کو تحفہ دیتا ہوا', 'Hum ne tujhe ata kiya: bada noor chhote ko tohfa deta hua', 'We have given you: a great light handing a gift to a small one'], ['عطا', 'ATA', 'GIVEN']);

  /* ways */
  O('اهدنا', 'way', { mode: 'guide' }, ['ہمیں راہ دکھا: چراغ آگے آگے، چھوٹا نور پیچھے', 'Humein raah dikha: charaagh aage aage, chhota noor peechhe', 'Guide us: a lantern leads a small light along the road'], ['ہدایت', 'HIDAAYAT', 'GUIDE US']);
  O('الصرط', 'way', { mode: 'sirat' }, ['وہ راستہ: پل کی طرح لمبی راہ، کھمبے لگے ہوئے', 'Woh raasta: pul ki tarah lambi raah, khambe lage hue', 'The path: a long bridge with posts'], ['راستہ', 'RAASTA', 'THE PATH']);
  O('صرط', 'way', { mode: 'thread' }, ['ایک راہ: روشنی کا پتلا دھاگا، دور تک', 'Ek raah: roshni ka patla dhaaga, door tak', 'A path: a thread of light running to the distance'], ['راہ', 'RAAH', 'A PATH']);
  O('المستقيم', 'way', { mode: 'straight' }, ['سیدھی: ٹیڑھی لکیروں کے بیچ ایک سیدھی کرن', 'Seedhi: tedhi lakeeron ke beech ek seedhi kiran', 'Straight: one true ray among crooked lines'], ['سیدھی', 'SEEDHI', 'STRAIGHT']);
  O('دينكم', 'way', { mode: 'yours' }, ['تمہارا دین: ایک چوڑا راستہ، لوگوں کی بھیڑ', 'Tumhara deen: ek chauda raasta, logon ki bheed', 'Your religion: a wide road with its crowd'], ['تمہارا دین', 'TUMHARA DEEN', 'YOUR WAY']);
  O('دين', 'way', { mode: 'mine' }, ['میرا دین: تنگ راہ، ایک ہی نور', 'Mera deen: tang raah, ek hi noor', 'My religion: a narrow path, a single light'], ['میرا دین', 'MERA DEEN', 'MY WAY']);

  /* turning away / returning */
  O('تضليل', 'turn2', { mode: 'misled', color: 'orange' }, ['بھٹکانا: سیدھی راہ سے جھوٹی شاخ کی طرف', 'Bhatkana: seedhi raah se jhooti shaakh ki taraf', 'Misleading: a light drawn onto the false branch'], ['بھٹکانا', 'BHATKANA', 'MISLEAD']);
  O('كيدهم', 'turn2', { mode: 'plan', color: 'orange' }, ['ان کی چال: جال کی ڈوریاں ادھڑتی ہوئی', 'Un ki chaal: jaal ki dorian udharti hui', 'Their scheme: a net unravelling'], ['چال', 'CHAAL', 'SCHEME']);
  O('توابا', 'turn2', { mode: 'door' }, ['بہت توبہ قبول کرنے والا: کھلا دروازہ، لوٹنے والے اندر', 'Bohat tauba qabool karne wala: khula darwaza, lautne wale andar', 'Ever-Accepting: an open door that receives the returning'], ['توبہ', 'TAUBA', 'TAWWAAB']);

  /* fire */
  O('سيصلى', 'fire2', { mode: 'enter' }, ['وہ داخل ہوگا: ایک روشنی بھڑکتی آگ میں ڈوبتی ہوئی', 'Woh daakhil hoga: ek roshni bhadakti aag mein doobti hui', 'He will enter: a light sinking into the blaze'], ['داخل', 'DAAKHIL', 'ENTER']);
  O('نارا', 'fire2', { mode: 'blaze' }, ['آگ: اونچا شعلہ اور اڑتے انگارے', 'Aag: ooncha shola aur udte angaare', 'A fire: one tall blaze with rising embers'], ['آگ', 'AAG', 'FIRE']);
  O('الحطب', 'fire2', { mode: 'wood' }, ['ایندھن: لکڑیاں جنہیں آگ کھا رہی ہے', 'Eendhan: lakdiyaan jinhein aag kha rahi hai', 'The firewood: logs the flames are consuming'], ['ایندھن', 'EENDHAN', 'FIREWOOD']);

  /* cords */
  O('حمالة', 'cord', { mode: 'carrier', color: 'orange' }, ['اٹھانے والی: بوجھ تلے جھکا ہوا وجود', 'Uthane wali: bojh tale jhuka hua wujood', 'The carrier: a figure bent beneath its load'], ['اٹھانے والی', 'UTHANE WALI', 'CARRIER']);
  O('جيدها', 'cord', { mode: 'neck', color: 'orange' }, ['اس کی گردن: گرد لپٹی ہوئی رسی', 'Us ki gardan: gird lipti hui rassi', 'Her neck: a cord winding around it'], ['گردن', 'GARDAN', 'HER NECK']);
  O('حبل', 'cord', { mode: 'rope', color: 'orange' }, ['رسی: تین لڑیاں بٹی ہوئی', 'Rassi: teen ladiyaan bati hui', 'A rope: three strands plaited'], ['رسی', 'RASSI', 'ROPE']);
  O('مسد', 'cord', { mode: 'braid', color: 'orange' }, ['کھجور کے ریشے: ریشے آپس میں گندھتے ہوئے', 'Khajoor ke reshe: reshe aapas mein gundhte hue', 'Palm fibre: strands braiding together'], ['ریشے', 'RESHE', 'PALM FIBRE']);
  O('العقد', 'cord', { mode: 'knot', color: 'orange' }, ['گرہیں: ڈوری پر لگی گانٹھیں', 'Girhein: dori par lagi gaanthein', 'The knots: ties along a cord'], ['گرہیں', 'GIRHEIN', 'KNOTS']);

  /* whispers */
  O('النفثت', 'hush', { mode: 'blow' }, ['پھونکنے والیاں: گرہوں پر پھونکیں', 'Phoonkne waaliyan: girhon par phoonkein', 'Those who blow: puffs breathed onto knots'], ['پھونک', 'PHOONK', 'BLOWING']);
  O('الوسواس', 'hush', { mode: 'waswas' }, ['وسوسہ ڈالنے والا: سرگوشی کی لہریں کان کی طرف', 'Waswasa daalne wala: sargoshi ki lehrein kaan ki taraf', 'The whisperer: whisper waves creeping toward an ear'], ['وسوسہ', 'WASWASA', 'THE WHISPERER']);
  O('يوسوس', 'hush', { mode: 'verb' }, ['وسوسہ ڈالتا ہے: سیاہ دھاگا سینے میں اترتا ہوا', 'Waswasa daalta hai: siyaah dhaaga seene mein utarta hua', 'He whispers: a dark thread slipping into a chest'], ['وسوسہ', 'WASWASA', 'WHISPERS']);
  O('صدور', 'hush', { mode: 'chests' }, ['سینے: دلوں کے گرد لپٹتی سرگوشیاں', 'Seene: dilon ke gird lipatti sargoshiyaan', 'The chests: wisps winding around hearts'], ['سینے', 'SEENE', 'CHESTS']);

  /* lordship */
  O('ربك', 'lord', { mode: 'yours' }, ['تیرا رب: بڑے حلقے ایک چھوٹے نور کے گرد', 'Tera Rab: bade halqe ek chhote noor ke gird', 'Your Lord: great rings around one small light'], ['تیرا رب', 'TERA RAB', 'YOUR LORD']);
  O('لربك', 'lord', { mode: 'for' }, ['اپنے رب کے لیے: نذرانہ اوپر حلقوں تک', 'Apne Rab ke liye: nazraana oopar halqon tak', 'For your Lord: an offering rising to the rings'], ['رب کے لیے', 'RAB KE LIYE', 'FOR YOUR LORD']);
  O('برب', 'lord', { mode: 'within' }, ['رب کی پناہ میں: حلقوں کے اندر محفوظ نور', 'Rab ki panaah mein: halqon ke andar mehfooz noor', 'In the Lord’s care: a light kept safe within the rings'], ['رب کی پناہ', 'RAB KI PANAAH', 'IN HIS CARE']);

  /* need, loneliness */
  O('المسكين', 'alone', { mode: 'bowl' }, ['مسکین: خالی کٹورا اور چھوٹا سا نور', 'Miskeen: khaali katora aur chhota sa noor', 'The needy: an empty bowl beside a small light'], ['مسکین', 'MISKEEN', 'THE NEEDY']);
  O('ساهون', 'alone', { mode: 'flicker' }, ['غافل: شعلہ جو اپنے آپ کو بھول کر ٹمٹماتا ہے', 'Ghaafil: shola jo apne aap ko bhool kar timtimata hai', 'Heedless: a flame flickering, forgetting itself'], ['غافل', 'GHAAFIL', 'NEGLECT']);
  O('الابتر', 'alone', { mode: 'cut' }, ['جڑ سے کٹا ہوا: ڈور کٹ کر گر جاتی ہے', 'Jad se kata hua: dor kat kar gir jaati hai', 'Cut off: the line is severed and falls away'], ['کٹا ہوا', 'KATA HUA', 'CUT OFF']);

  /* aid */
  O('نستعين', 'aid', { mode: 'ask' }, ['ہم مدد مانگتے ہیں: پکار اوپر، مدد نیچے', 'Hum madad maangte hain: pukaar oopar, madad neeche', 'We seek help: the call goes up, help comes down'], ['مدد', 'MADAD', 'HELP']);
  O('وارسل', 'aid', { mode: 'sent' }, ['اور اس نے بھیجا: آسمان سے زمین تک پیغام کی لکیر', 'Aur us ne bheja: aasmaan se zameen tak paighaam ki lakeer', 'And He sent: a line of message from sky to earth'], ['بھیجا', 'BHEJA', 'SENT']);
  O('نصر', 'aid', { mode: 'victory' }, ['مدد اور فتح: روشنی اترتی ہے اور نور کو چوٹی تک پہنچاتی ہے', 'Madad aur fatah: roshni utarti hai aur noor ko choti tak pahunchati hai', 'Help and victory: light descends and carries a small one to the ridge'], ['نصرت', 'NUSRAT', 'VICTORY']);

  /* sight */
  O('ارءيت', 'look2', { mode: 'havesee' }, ['کیا تم نے دیکھا: آنکھ اور سوال کا حلقہ', 'Kya tum ne dekha: aankh aur sawaal ka halqa', 'Have you seen: an eye within a ring of question'], ['کیا دیکھا', 'KYA DEKHA', 'HAVE YOU SEEN']);
  O('ورايت', 'look2', { mode: 'saw' }, ['اور تو نے دیکھا: نظر کے سامنے منظر ابھرتا ہے', 'Aur tu ne dekha: nazar ke saamne manzar ubharta hai', 'And you saw: a scene appearing under the gaze'], ['دیکھا', 'DEKHA', 'YOU SAW']);

  /* force */
  O('يدع', 'force', { mode: 'repel' }, ['دھکیلتا ہے: چھوٹی روشنی کو دور ہٹاتا ہے', 'Dhakelta hai: chhoti roshni ko door hataata hai', 'Pushes away: driving a small light off'], ['دھکیلنا', 'DHAKELNA', 'PUSHES']);
  O('ويمنعون', 'force', { mode: 'withhold' }, ['اور روکتے ہیں: بہاؤ دیوار پر رکا ہوا', 'Aur rokte hain: bahaao deewar par ruka hua', 'And they withhold: a flow stopped at a wall'], ['روکنا', 'ROKNA', 'WITHHOLD']);

  /* fear & refuge */
  O('خوف', 'shelter', { mode: 'fear' }, ['خوف: کانپتی روشنیاں، دباؤ ڈالتے سائے', 'Khauf: kaanpti roshniyaan, dabaao daalte saaye', 'Fear: trembling lights under pressing shadows'], ['خوف', 'KHAUF', 'FEAR']);
  O('اعوذ', 'shelter', { mode: 'refuge' }, ['میں پناہ مانگتا ہوں: خطرے باہر، نور گنبد کے اندر', 'Main panaah maangta hoon: khatre baahar, noor gumbad ke andar', 'I seek refuge: dangers outside, a light inside the dome'], ['پناہ', 'PANAAH', 'REFUGE']);

  /* wealth, hatred, journey, food, nature, time */
  O('ماله', 'misc', { mode: 'pile' }, ['اس کا مال: سکوں کا ڈھیر، ایک مٹھی میں', 'Us ka maal: sikkon ka dheer, ek mutthi mein', 'His wealth: a pile of coins held close'], ['مال', 'MAAL', 'HIS WEALTH']);
  O('كسب', 'misc', { mode: 'earn' }, ['جو کمایا: محنت سے سکے بنتے ہوئے', 'Jo kamaya: mehnat se sikke bante hue', 'What he earned: coins made by effort'], ['کمائی', 'KAMAAI', 'EARNED']);
  O('شانيك', 'misc', { mode: 'hater', color: 'gold' }, ['تیرا دشمن: کانٹے دار سبز روشنی جو خود سکڑتی ہے', 'Tera dushman: kaante-daar sabz roshni jo khud sikadti hai', 'Your hater: a thorny green light that shrinks itself'], ['دشمن', 'DUSHMAN', 'YOUR HATER']);
  O('حسد', 'misc', { mode: 'burn' }, ['حسد: سبز آگ جو اپنے ہی اوپر جلتی ہے', 'Hasad: sabz aag jo apne hi oopar jalti hai', 'Envy: a green fire burning the envier himself'], ['حسد', 'HASAD', 'ENVY']);
  O('رحلة', 'misc', { mode: 'journey' }, ['سفر: دو سرزمینوں کے بیچ قافلے کی راہ', 'Safar: do sarzameenon ke beech qaafile ki raah', 'The journey: a caravan route between two lands'], ['سفر', 'SAFAR', 'JOURNEY']);
  O('طعام', 'misc', { mode: 'food' }, ['کھانا: گول روٹیاں اور اٹھتی بھاپ', 'Khaana: gol rotiyaan aur uthti bhaap', 'Food: round loaves with rising steam'], ['کھانا', 'KHAANA', 'FOOD']);
  O('ابابيل', 'nat2', { mode: 'ababil' }, ['جھنڈ کے جھنڈ پرندے: گھنی ٹولی آسمان کو چیرتی ہوئی', 'Jhund ke jhund parinde: ghani toli aasmaan ko cheerti hui', 'Flock after flock: a dense swarm sweeping the sky'], ['جھنڈ', 'JHUND', 'ABABEEL']);
  O('بحجارة', 'nat2', { mode: 'hijara' }, ['پتھروں سے: پھینکے ہوئے پتھر اور ان کا ڈھیر', 'Pattharon se: phenke hue patthar aur un ka dheer', 'With stones: thrown stones and their heap'], ['پتھر', 'PATTHAR', 'WITH STONES']);
  O('ماكول', 'nat2', { mode: 'eaten' }, ['کھایا ہوا: کترا ہوا بھوسا اڑتے ٹکڑے', 'Khaaya hua: katra hua bhoosa udte tukde', 'Eaten up: chewed straw, fragments scattering'], ['کھایا ہوا', 'KHAAYA HUA', 'EATEN']);
  O('والفتح', 'nat2', { mode: 'fath' }, ['اور فتح: تالا کھلتا ہے، روشنی بہہ نکلتی ہے', 'Aur fatah: taala khulta hai, roshni bah nikalti hai', 'And the conquest: a lock opens, light pours out'], ['فتح', 'FATAH', 'OPENING']);
  O('وقب', 'nat2', { mode: 'waqab' }, ['جب چھا جائے: اندھیرا ہر طرف اتر آتا ہے', 'Jab chha jaaye: andhera har taraf utar aata hai', 'When it settles: darkness covers everything'], ['چھا جانا', 'CHHA JAANA', 'SETTLES']);
  O('اذا', 'nat2', { mode: 'idha' }, ['جب: گھڑی کی سوئی مقررہ لمحے کی طرف', 'Jab: ghadi ki sui muqarrara lamhe ki taraf', 'When: the hand sweeping toward the appointed moment'], ['جب', 'JAB', 'WHEN']);
  O('بالدين', 'nat2', { mode: 'dyn' }, ['روزِ جزا کے ساتھ: ترازو اور اعمال کا دفتر', 'Roz-e-jazaa ke saath: taraazu aur amaal ka daftar', 'With the Judgement: a scale and the record of deeds'], ['حساب', 'HISAAB', 'JUDGEMENT']);
})();

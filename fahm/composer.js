/* Fahm story composer: builds a scene spec (sky, ground, items, caption) for ANY ayah from its word-by-word meanings.
   Output is the same format as FAHM_SCENES, so the 3D story engine renders it. Nothing here depicts a prophet or companion;
   people are shown only as faceless silhouettes. Items appear exactly when their word is reached. */
(function () {
'use strict';
const hs = (a, b) => { let x = (a * 73856093) ^ (b * 19349663); x = (x ^ (x >>> 13)) * 1274126177; return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
const SLOT = [200, 95, 305, 150, 255, 60, 340], UY = { sky: 112, gnd: 214 };

/* theme: id, pr = priority (higher first), re = English-gloss regex, rt = roots (Arabic), it = items builder, sky, caps = [ur, ru, en] */
const TH = [
  { id: 'hell', pr: 95, re: /\bfire\b|\bhell\b|blaz|flame|burn|scorch|roast|torment|chastis|painful (penalty|punishment)|punishment/, rtx: ['جهنم', 'سعر', 'حرق', 'صلي', 'لظي'], sky: 'fire',
    it: () => [['flames', { y: 272, wd: 230, h: 120, n: 60 }], ['smoke', { x: 60, y: 200, tx: 300, ty: 120, col: '#5a2a2a' }]],
    caps: ['آگ کے شعلے بھڑکتے ہیں؛ یہ نافرمانی کے انجام کی تنبیہ ہے۔', 'Aag ke shole bhadakte hain; yeh nafarmani ke anjaam ki tanbeeh hai.', 'Flames rise: a warning of where disobedience leads.'] },
  { id: 'judge', pr: 90, re: /last day|day of (judg|resurrec|reckon|religion|recompense|gathering|account)|\bthe hour\b|resurrect|reckon|account(ing)?\b|\bscales?\b|weigh|balance|\brecord\b|\bmeet/, rtx: ['ساع', 'بعث', 'وزن'], sky: 'dusk',
    it: () => [['scales', { x: 200, y: 112, tilt: -0.22 }]],
    caps: ['دن ڈھلتا ہے اور ترازو قائم ہوتا ہے؛ ہر عمل کا حساب ہوگا۔', 'Din dhalta hai aur taraazu qaaim hota hai; har amal ka hisaab hoga.', 'The day ends and the scales are set: every deed is weighed.'] },
  { id: 'jannah', pr: 85, re: /garden|paradise|\bbliss|rivers? (flow|beneath)|\brivers?\b|reclin|delight|\bfruits?\b|\bspouses\b|\bcomfort|\bjannah|abode of|reward/, rtx: ['جنن', 'نهر', 'ثمر', 'نعم', 'اجر'], sky: 'holy',
    it: () => [['tree', { x: 120, y: 214, s: 1.3 }], ['river', { y: 160 }]],
    caps: ['سرسبز باغ اور بہتی نہریں؛ نیک لوگوں کے انعام کی جھلک۔', 'Sarsabz baagh aur behti nehrein; nek logon ke inaam ki jhalak.', 'Green gardens and flowing rivers: a glimpse of the reward of the righteous.'] },
  { id: 'kaaba', pr: 80, re: /\bhouse\b|sacred mosque|\bmosque|sanctuary|pilgrim|\bhajj|kaaba|\bsafa\b|marwa|\bumrah|holy house/, rtx: ['حجج', 'حرم', 'عمر'], sky: 'dawn',
    it: () => [['kaaba', { x: 300, y: 214, s: 1.1 }], ['figures', { n: 5, x: 150, y: 232, mode: 'walk', gap: 22, s: 0.85 }]],
    caps: ['کعبہ اور اس کے گرد عبادت کرنے والوں کی بے چہرہ سائے۔', 'Kaaba aur uske gird ibaadat karne walon ke be-chehra saaye.', 'The Kaaba, with faceless silhouettes of worshippers around it.'] },
  { id: 'split', pr: 78, re: /\bsplit|cleav|cleft|\brent\b|\brend|shatter|burst|crush|cracked|break (up|apart)/, rtx: ['فطر', 'شقق', 'فتق', 'كسر', 'نفطر'], sky: 'void',
    it: () => [['split', {}]],
    caps: ['آسمان اور زمین کھلتے اور پھٹتے ہیں؛ قدرت کا عظیم منظر۔', 'Aasmaan aur zameen khulte aur phatte hain; qudrat ka azeem manzar.', 'The sky and earth split open: a grand scene of power.'] },
  { id: 'prayer', pr: 76, re: /\bpray|prostrat|\bbow(ed|ing)?\b|\bworship|\bsalah|kneel|\bsujud|\bzakah|remembr?(e|a)nce of allah/, rtx: ['صلو', 'سجد', 'ركع', 'عبد', 'قنت'], sky: 'dawn',
    it: () => [['dome', { x: 95, y: 214, s: 0.8 }], ['figures', { n: 5, x: 250, y: 214, mode: 'pray', gap: 26, s: 0.9 }]],
    caps: ['گنبد کے سائے میں صفیں سجدے میں جھکتی ہیں۔', 'Gumbad ke saaye mein saffein sajde mein jhukti hain.', 'Rows of worshippers bow in prostration beneath a dome.'] },
  { id: 'stone', pr: 70, re: /\bstones?\b|\brocks?\b|\bclay\b|\bmud\b|\bpebble|baked clay|\bmountains?\b/, rtx: ['حجر', 'صخر', 'طين', 'جبل'], sky: 'dusk',
    it: () => [['stones', { n: 12, tx: 150, ty: 210 }]],
    caps: ['پتھروں اور پہاڑوں کی مضبوطی؛ اللہ کی طاقت کی نشانی۔', 'Pattharon aur pahaadon ki mazbooti; Allah ki taaqat ki nishani.', 'Stones and mountains: signs of Allah’s power.'] },
  { id: 'birds', pr: 68, re: /\bbirds?\b|\bfly|\bflew|\bwings?\b|flock/, rtx: ['طير', 'جنح'], sky: 'day',
    it: () => [['birds', { n: 12, tx: 150, ty: 175 }]],
    caps: ['پرندوں کی ٹولیاں فضا میں اڑتی ہیں۔', 'Parindon ki toliyan fiza mein udti hain.', 'Flocks of birds sweep across the sky.'] },
  { id: 'elephant', pr: 67, re: /\belephant/, rtx: ['فيل'], sky: 'dawn',
    it: () => [['elephants', { n: 3, x: 40, gap: 70, mode: 'march' }]],
    caps: ['ہاتھیوں کا لشکر آگے بڑھتا ہے۔', 'Haathiyon ka lashkar aage badhta hai.', 'An army of elephants advances.'] },
  { id: 'camel', pr: 55, re: /camel|cattle|livestock|\bcows?\b|sheep|\banimals?\b|beasts?|\bherd/, rtx: ['ابل', 'نعم', 'بقر', 'غنم', 'دبب'], sky: 'day',
    it: () => [['camels', { n: 3, x: 40, gap: 85, dir: 1 }]],
    caps: ['اونٹوں اور مویشیوں کا قافلہ زمین پر چلتا ہے۔', 'Oonton aur maweshiyon ka qaafila zameen par chalta hai.', 'A caravan of camels and livestock crosses the land.'] },
  { id: 'crown', pr: 74, re: /\bking\b|kingdom|dominion|sovereign|\bowner\b|\bmaster\b|\bthrone|authority|\brules?\b|\bruler|\bseat\b/, rtx: ['عرش', 'سلط', 'حكم', 'ملك', 'كرس'], sky: 'night',
    it: () => [['crown', { x: 200, y: 62 }]],
    caps: ['بادشاہی کا تاج چمکتا ہے؛ حقیقی اختیار اللہ کے پاس ہے۔', 'Baadshaahi ka taaj chamakta hai; haqeeqi ikhtiyaar Allah ke paas hai.', 'The crown shines: true authority belongs to Allah.'] },
  { id: 'one', pr: 73, re: /\balone\b|\bunique|\beternal|besought|self-sufficient|\bpartners?\b|associate|\blike unto|\bsingle\b|^\s*the one\s*$|\bahad\b|\bsamad\b|\bone (god|ilah)/, rtx: ['صمد', 'وحد'], sky: 'void',
    it: () => [['core', { mode: 'one', x: 200, y: 130 }]],
    caps: ['ایک اکیلی روشنی؛ اس جیسا کوئی نہیں۔', 'Ek akeli roshni; us jaisa koi nahin.', 'A single unrepeatable light: nothing is like Him.'] },
  { id: 'heavens', pr: 66, re: /heavens?|\bsky\b|\bearth\b|creat|universe|\bworlds?\b|originat|fashion|\bstars?\b|planets?|orbit|\bspace\b|\bcosmos/, rtx: ['ارض', 'خلق', 'نجم', 'كون'], sky: 'void',
    it: () => [['orbits', { x: 200, y: 125, n: 5 }]],
    caps: ['آسمان، زمین اور ستارے اپنے مدار میں گھومتے ہیں۔', 'Aasmaan, zameen aur sitaare apne madaar mein ghoomte hain.', 'Heavens, earth and stars turn in their orbits.'] },
  { id: 'sun', pr: 64, re: /\bsun\b|daybreak|\bmorning|\bdawn|forenoon|\bdaylight|\bnoon/, rtx: ['شمس', 'صبح', 'فجر', 'ضحي'], sky: 'dawn',
    it: () => [['sun', { x: 120, y0: 190, y1: 85, d: 5 }]],
    caps: ['سورج افق سے طلوع ہوتا ہے اور روشنی پھیلتی ہے۔', 'Sooraj ufuq se tuloo hota hai aur roshni phailti hai.', 'The sun rises from the horizon and light spreads.'] },
  { id: 'night', pr: 63, re: /\bnight\b|\bmoon\b|evening|\bdusk|\bsunset|\bdarkness|overspread|\bsetting/, rtx: ['ليل', 'قمر', 'غسق', 'عشي'], sky: 'night', moon: [320, 56],
    it: () => [['dark', { d: 3, full: 0.55 }]],
    caps: ['رات کا اندھیرا چھا جاتا ہے اور چاند چمکتا ہے۔', 'Raat ka andhera chha jaata hai aur chaand chamakta hai.', 'Night falls and the moon shines.'] },
  { id: 'water', pr: 62, re: /\bwater|\brain|sent down|\bclouds?\b|\bdrops?\b|\bsea\b|\bseas\b|\bships?\b|\bsail|\bwaves?\b|\bsprings?\b|\bflood|\bdrown/, rtx: ['ماء', 'مطر', 'سحب', 'بحر', 'فلك', 'موج', 'غرق'], sky: 'day',
    it: () => [['rain', { col: '#35d0e6', n: 44 }], ['river', { y: 165 }]],
    caps: ['بادل برستے ہیں اور پانی زندگی بخش کر بہتا ہے۔', 'Baadal baraste hain aur paani zindagi bakhsh kar behta hai.', 'Clouds pour; life-giving water flows.'] },
  { id: 'plant', pr: 60, re: /\bplant|\bseeds?\b|sprout|\bgrain|vegetation|\bherbs?\b|\btrees?\b|\bgrow|\bgreen\b|\bharvest|\bcrops?\b|palm|olive|\bfig\b|\bvine/, rtx: ['نبت', 'زرع', 'شجر', 'حبب', 'نخل', 'خضر'], sky: 'day',
    it: () => [['tree', { x: 150, y: 214, s: 1.4 }]],
    caps: ['بیج سے پودا اور درخت اگتا ہے؛ زندگی کا کرشمہ۔', 'Beej se paudha aur darakht ugta hai; zindagi ka karishma.', 'A seed grows into a tree: the wonder of life.'] },
  { id: 'death', pr: 58, re: /\bdie[ds]?\b|\bdeath|\bdead\b|perish|destroy|\bwither|\bruin|\bdecay|\bend(ed)?\b|\bgrave|\btomb|\bburied/, rtx: ['موت', 'هلك', 'قبر', 'فني', 'ردي'], sky: 'dusk',
    it: () => [['tree', { x: 200, y: 214, wither: 1, s: 1.4 }]],
    caps: ['درخت مرجھا جاتا ہے؛ ہر جان کو موت کا ذائقہ چکھنا ہے۔', 'Darakht murjha jaata hai; har jaan ko maut ka zaayeqa chakhna hai.', 'A tree withers: every soul will taste death.'] },
  { id: 'money', pr: 57, re: /\bspend|charit|\bpoor\b|\bneedy\b|\bwealth|\bprovision|\balms|\bproperty|\bproperties|\briches\b|\bmoney|\busury|\bdebts?\b|\bgold\b|\bsilver\b|\btreasur|\bgenerous|\bmiser|\bpay\b|\bsustenance/, rtx: ['نفق', 'زكو', 'مول', 'رزق', 'صدق', 'ربو', 'دين', 'فقر', 'مسك'], sky: 'dawn',
    it: () => [['coins', { n: 20 }]],
    caps: ['سکے گرتے ہیں؛ مال اللہ کی راہ میں خرچ کرنے کا سبق۔', 'Sikke girte hain; maal Allah ki raah mein kharch karne ka sabq.', 'Coins fall: a lesson on spending wealth in Allah’s way.'] },
  { id: 'food', pr: 54, re: /\bfood\b|\beat\b|\beating|\bate\b|\bdrink|\bbread|\bmeal\b|\bhunger|\bfeed|\btable\b|\bsacrific|\bslaughter|\bmeat/, rtx: ['اكل', 'شرب', 'طعم', 'جوع', 'ذبح', 'مائد'], sky: 'dawn',
    it: () => [['food', { x: 150, y: 190 }]],
    caps: ['کھانے کی نعمت سامنے ہے؛ اللہ کا رزق اور اس کا شکر۔', 'Khaane ki naimat saamne hai; Allah ka rizq aur uska shukr.', 'Food is laid out: Allah’s provision, and thanks for it.'] },
  { id: 'child', pr: 53, re: /\bchild|children|\bsons?\b|\bdaughters?\b|\bbab(y|ies)|\binfant|\bmothers?\b|\bfathers?\b|\bparents?\b|\boffspring|\bprogeny|\borphans?\b|\bbirth/, rtx: ['ولد', 'ابن', 'بنت', 'ابو', 'امم', 'يتم'], sky: 'dawn',
    it: () => [['child', { x: 130, y: 222 }]],
    caps: ['ایک چھوٹا سایہ؛ والدین، اولاد اور یتیموں کے حقوق کا ذکر۔', 'Ek chhota saaya; waalidain, aulaad aur yateemon ke huqooq ka zikr.', 'A small silhouette: duties to parents, children and orphans.'] },
  { id: 'war', pr: 52, re: /\bfight|\bfought|\bkill|\bslain|\bbattle|\bstrive|\bstruggl|\bjihad|\bwar\b|\benem(y|ies)|\bdefen|\bhostil|\baggress|\btruce|\bpeace\b/, rtx: ['قتل', 'جهد', 'حرب', 'عدو'], sky: 'dusk',
    it: () => [['shield', { x: 290, y: 112 }]],
    caps: ['ڈھال حفاظت کی علامت ہے؛ ظلم کا دفاع اور امن کی ہدایت۔', 'Dhaal hifazat ki alaamat hai; zulm ka difaa aur aman ki hidayat.', 'A shield for protection: defence against wrong, guidance toward peace.'] },
  { id: 'fear', pr: 51, re: /\bfear|\bguard|\bprotect|\bpiety|\bbeware|\brefuge|\bsafe\b|\bsecurity|\bprotector|\bpious|\bgod-?fearing|\bwary|\bcautious|\bshelter/, rtx: ['وقي', 'خوف', 'تقو', 'عوذ', 'خشي'], sky: 'night',
    it: () => [['shield', { x: 200, y: 112 }]],
    caps: ['تقویٰ کی ڈھال؛ دل اللہ کی پناہ میں آتا ہے۔', 'Taqwa ki dhaal; dil Allah ki panaah mein aata hai.', 'The shield of taqwa: the heart takes refuge in Allah.'] },
  { id: 'rope', pr: 50, re: /\brope|hold fast|\bbond\b|\bcovenant|\bpromise|\bpledge|\boath|\bcontract|\btie[ds]?\b|\bbind|\bunited|\bunity|\bfirm(ly)?\b|\bbroke/, rtx: ['حبل', 'عهد', 'وثق', 'عقد', 'ميثق', 'وعد'], sky: 'night',
    it: () => [['rope', { x: 200, y: 140 }]],
    caps: ['مضبوط رسی؛ اللہ سے عہد اور آپس کی وحدت۔', 'Mazboot rassi; Allah se ahd aur aapas ki wahdat.', 'A firm rope: the covenant with Allah and unity among believers.'] },
  { id: 'knot', pr: 49, re: /\bmagic|\bsorcer|\bknots?\b|\bspell|\bplot|\bscheme|\bdeceiv|\bconspir|\btrick|\bdevise/, rtx: ['سحر', 'كيد', 'مكر', 'عقد'], sky: 'void',
    it: () => [['knots', { x: 200, y: 150 }]],
    caps: ['گرہیں اور سازشیں؛ اللہ کی تدبیر ہر چال پر غالب ہے۔', 'Girhein aur saazishein; Allah ki tadbeer har chaal par ghaalib hai.', 'Knots and schemes: Allah’s plan prevails over every plot.'] },
  { id: 'heart', pr: 48, re: /\bhearts?\b|\bbreasts?\b|\bchests?\b|\bsouls?\b|\bminds?\b|\bseal(ed)?\b|\bveil|\bears?\b|\beyes?\b|\bsight|\bhearing|\bsenses|\bconscien/, rtx: ['قلب', 'صدر', 'ختم', 'سمع', 'بصر', 'فاد', 'نفس'], sky: 'night',
    it: () => [['chest', { x: 200, y: 215 }]],
    caps: ['دل اور سینہ؛ سننے، دیکھنے اور سمجھنے کی صلاحیت امانت ہے۔', 'Dil aur seena; sunne, dekhne aur samajhne ki salaahiyat amaanat hai.', 'Heart and chest: hearing, sight and understanding are a trust.'] },
  { id: 'hand', pr: 47, re: /\bhands?\b|\bpalms?\b|\barms?\b|\bgrasp|\bstretch|\bgrip|\bright hand|\bleft hand|\btouch/, rtx: ['يدد', 'يمن', 'شمل', 'بسط'], sky: 'night',
    it: () => [['hand', { x: 200, y: 130, rot: 0.1 }]],
    caps: ['ہاتھ آگے بڑھتا ہے؛ اپنے ہاتھوں کی کمائی کا ذکر۔', 'Haath aage badhta hai; apne haathon ki kamaai ka zikr.', 'A hand reaches out: what hands have earned.'] },
  { id: 'wind', pr: 46, re: /\bwind|\bstorm|\bthunder|\blightning|\btempest|\bgale\b|\bcry\b|\bblast|\bearthquake|\bquak|\bshaking|\bshook|\boverwhelm|\bcalamit|\bdisaster/, rtx: ['ريح', 'رعد', 'برق', 'صيح', 'زلل', 'رجف', 'صرصر'], sky: 'dusk',
    it: () => [['haze', { x: 150, y: 200, col: '#7a5a8a' }], ['rain', { col: '#9fc8ff', n: 40 }]],
    caps: ['آندھی، گرج اور بجلی؛ سرکش قوموں کی پکڑ۔', 'Aandhi, garaj aur bijli; sarkash qaumon ki pakad.', 'Wind, thunder and lightning: the seizing of defiant peoples.'] },
  { id: 'satan', pr: 45, re: /\bsatan|\bdevil|\bwhisper|\bevil one|\bjinn|\bshaytan|\btemptat|\bseduc|\bdeceive|\bmislead/, rtx: ['شطن', 'وسس', 'غرر'], sky: 'void',
    it: () => [['smoke', { x: 60, y: 200, tx: 280, ty: 130, col: '#6a3aa0' }]],
    caps: ['وسوسے کا دھواں دل کی طرف بڑھتا ہے؛ اس سے اللہ کی پناہ مانگو۔', 'Waswase ka dhuaan dil ki taraf badhta hai; us se Allah ki panaah maango.', 'Whispers drift toward the heart: seek refuge in Allah.'] },
  { id: 'astray', pr: 44, re: /\bastray|\blost\b|\bmisguid|\bdeviat|\bwander|\bstray|\bperplex|\berr(ed|ing)?\b|\berror/, rtx: ['ضلل', 'غوي', 'تيه', 'عمه'], sky: 'dusk',
    it: () => [['path', { kind: 'maze' }], ['lost', { x: 330, y: 245, n: 5 }]],
    caps: ['بھٹکتے راستے اور کھوئے ہوئے لوگ۔', 'Bhatakte raaste aur khoye hue log.', 'Winding paths and people who lose their way.'] },
  { id: 'guide', pr: 43, re: /\bguid|\bstraight|\bpath\b|\bpaths\b|\bway\b|\bways\b|\broad\b|\bright (course|way)|\bdirect/, rtx: ['هدي', 'صرط', 'سبل', 'رشد', 'طرق'], sky: 'dawn',
    it: () => [['path', { kind: 'straight' }]],
    caps: ['سیدھا راستہ روشن ہوتا ہے؛ ہدایت کی راہ۔', 'Seedha raasta roshan hota hai; hidayat ki raah.', 'The straight path lights up: the way of guidance.'] },
  { id: 'disbelief', pr: 42, re: /disbeliev|\bdeny|\bdenied|\bdenial|\breject|\bhypocrit|\barrogan|\btransgress|\bwrongdo|\boppress|\bunjust|\bsinful|\bsinners?\b|\bevildoer|\bcorrupt|\bmischief|\bdisobe|\bturn(ed)? away|\bturn(ed)? back|\bignor|\bpolytheist|\bidolat/, rtx: ['كفر', 'كذب', 'ظلم', 'فسد', 'عصي', 'جرم'], sky: 'void',
    it: () => [['dark', { d: 3, full: 0.7 }], ['haze', { x: 300, y: 200, col: '#c4302b' }]],
    caps: ['اندھیرا اور دھند چھا جاتی ہے؛ انکار اور ظلم کا انجام۔', 'Andhera aur dhundh chha jaati hai; inkaar aur zulm ka anjaam.', 'Darkness and haze descend: the end of denial and injustice.'] },
  { id: 'believe', pr: 41, re: /\bbeliev|\bfaith|\bmuslims?\b|\bsubmit|\bsubmission|\bobey|\bobedien|\brighteous|\bpatient|\bpatience|\bgrateful|\bthank|\bsincere|\bsteadfast|\bsaints|\bsalvation|\bsuccess|\bsuccessful|\bwinners/, rtx: ['امن', 'سلم', 'صلح', 'صبر', 'شكر', 'فلح', 'خلص'], sky: 'dawn',
    it: () => [['figures', { n: 4, x: 230, y: 214, mode: 'stand', gap: 24, s: 0.9 }], ['beam', { x: 120, y: 205, col: '#35d0e6' }]],
    caps: ['ایمان والوں کی بے چہرہ صفیں روشنی کے ساتھ کھڑی ہیں۔', 'Imaan walon ki be-chehra saffein roshni ke saath khadi hain.', 'Faceless rows of believers stand together in the light.'] },
  { id: 'journey', pr: 40, re: /\bwalk|\btravel|\bjourney|\bmarch|\bgo\b|\bgoing|\bwent\b|\bcome\b|\bcame\b|\bcaravan|\bfollow|\bfled|\bmigrat|\bemigrat|\bwander/, rtx: ['سير', 'مشي', 'سفر', 'هجر'], sky: 'dawn',
    it: () => [['figures', { n: 4, x: 160, y: 250, mode: 'walk', gap: 22, s: 0.9 }]],
    caps: ['مسافروں کی بے چہرہ ٹولی راستے پر آگے بڑھتی ہے۔', 'Musaafiron ki be-chehra toli raaste par aage badhti hai.', 'A faceless group of travellers moves along the road.'] },
  { id: 'people', pr: 39, re: /\bpeople|\bmankind|\bmen\b|\bhumans?\b|\bnations?\b|\bcommunity|\bgenerations?\b|\bfolk\b|\bman\b|\bwomen\b|\bwomankind|\bcrowd|\ball of you|\bevery soul|\bchildren of adam|\bo mankind/, rtx: ['ناس', 'قوم', 'امم', 'انس', 'بشر', 'رجل', 'نسو'], sky: 'day',
    it: () => [['humans', { n: 30, y: 240 }]],
    caps: ['انسانوں کا بڑا مجمع؛ آیت سب لوگوں سے مخاطب ہے۔', 'Insaanon ka bada majma; ayat sab logon se mukhaatib hai.', 'A great crowd of people: the ayah addresses all of humanity.'] },
  { id: 'cold', pr: 38, re: /\bcold\b|\bwinter|\bchill|\bfrost|\bice\b|\bfreez/, rtx: ['برد', 'شتو', 'صقع'], sky: 'night',
    it: () => [['frost', {}]],
    caps: ['ٹھنڈک اور برف کی تہہ؛ موسموں کا نظام اللہ کے ہاتھ میں ہے۔', 'Thandak aur baraf ki teh; mausamon ka nizaam Allah ke haath mein hai.', 'A layer of frost: the seasons run by Allah’s order.'] },
  { id: 'angel', pr: 37, re: /\bangels?\b|\bspirit\b|\bgabriel|\bjibril|\bmessengers? (of|from) allah|\bsent down|\bsend down/, rtx: ['روح', 'سلك'], sky: 'holy',
    it: () => [['beam', { x: 200, y: 215, col: '#d8f2ff' }], ['orbits', { x: 200, y: 105, n: 3 }]],
    caps: ['آسمان سے روشنی کی کرن اترتی ہے؛ فرشتے حکمِ الٰہی لاتے ہیں۔', 'Aasmaan se roshni ki kiran utarti hai; farishte hukm-e-ilaahi laate hain.', 'A ray of light descends: angels carry the command of Allah.'] },
  { id: 'marriage', pr: 36, re: /\bwife|\bwives|\bhusband|\bmarr(y|iage|ied)|\bspouse|\bdivorc|\bdowry|\bbetroth|\bwidow/, rtx: ['زوج', 'نكح', 'طلق', 'مهر', 'بعل'], sky: 'dawn',
    it: () => [['bloom', { x: 200, y: 120, r: 48, col: '#e89ac0' }]],
    caps: ['رشتے کی نرمی اور ذمہ داری؛ نکاح اور خاندان کے احکام۔', 'Rishte ki narmi aur zimmedaari; nikaah aur khaandaan ke ahkaam.', 'The gentleness and duty of a bond: rules of marriage and family.'] },
  { id: 'light', pr: 35, re: /\blight\b|\billumin|\bradiance|\bshine|\bbright|\blamp\b|\bclear\b|\bmanifest|\bevident|\bproof\b|\bsigns?\b|\bverses\b|\bdemonstrat|\bwitness|\btestif/, rtx: ['نور', 'سرج', 'ضوء', 'برهن'], sky: 'holy',
    it: () => [['bloom', { x: 200, y: 115, r: 62, col: '#35d0e6' }]],
    caps: ['روشنی پھیلتی ہے؛ کھلی نشانیاں دل کو روشن کرتی ہیں۔', 'Roshni phailti hai; khuli nishaniyaan dil ko roshan karti hain.', 'Light spreads: clear signs illuminate the heart.'] },
  { id: 'mercy', pr: 34, re: /\bmerc|\bcompassion|\bgracious|\bforgiv|\bpardon|\brepent|\boft-?forgiving|\bkind|\bgentle|\bgrace\b|\bfavou?r|\bblessing|\bblessed|\bbounty|\bbountiful/, rtx: ['رحم', 'غفر', 'توب', 'عفو', 'فضل', 'برك', 'لطف'], sky: 'holy',
    it: () => [['rain', { col: '#e8b84a', n: 38 }], ['bloom', { x: 200, y: 105, r: 55 }]],
    caps: ['رحمت کی بارش روشنی کے ساتھ اترتی ہے۔', 'Rehmat ki baarish roshni ke saath utarti hai.', 'Mercy falls like gentle rain, with light.'] },
  { id: 'book', pr: 33, re: /\bbook\b|\bscripture|\brevelat|\bquran|\brecit|\bread\b|\breminder|\bremember|\breflect|\bponder|\bunderstand|\bknowledge|\bknow\b|\bknew\b|\bwisdom|\bteach|\bspeak|\bsay\b|\bsaid\b|\btell\b|\bannounce|\bwarn|\bwarner|\bglad tidings|\bmessenger/, rtx: ['كتب', 'قرء', 'ذكر', 'علم', 'عقل', 'فكر', 'قول', 'نذر', 'بشر', 'رسل'], sky: 'night',
    it: () => [['beam', { x: 200, y: 215, col: '#e8b84a' }]],
    caps: ['علم اور وحی کی سنہری کرن اترتی ہے۔', 'Ilm aur wahi ki sunehri kiran utarti hai.', 'A golden ray of knowledge and revelation descends.'] },
  { id: 'story', pr: 32, re: /\b(moses|musa|jesus|isa|abraham|ibrahim|noah|nuh|joseph|yusuf|david|dawud|solomon|sulaiman|jonah|yunus|job|ayyub|ishmael|ismail|isaac|ishaq|jacob|yaqub|zachariah|zakariya|john|yahya|lot|lut|hud|salih|shuaib|idris|harun|aaron|pharaoh|firaun|qarun|haman|adam|iblis|mary|maryam|muhammad|ahmad)\b|\bpeople of\b|\bbefore you\b|\bthose before|\bearlier|\bhistory|\bstory\b|\bstories\b|\bnarrat/, rtx: [], sky: 'dusk',
    it: () => [['beam', { x: 120, y: 205, col: '#e8b84a' }]],
    caps: ['پرانی قوموں کی ایک کہانی؛ سبق کی روشنی نیچے اترتی ہے (احترام میں کوئی شبیہ نہیں دکھائی جاتی)۔', 'Purani qaumon ki ek kahani; sabaq ki roshni neeche utarti hai (ehtiraam mein koi shabeeh nahin dikhayi jaati).', 'A tale of earlier peoples; the light of its lesson descends (no figures are shown, out of respect).'] },
  { id: 'allah', pr: 20, re: /\ballah\b|\blord\b|\bour lord\b|\byour lord\b|\bhis lord\b|\bgod\b|\bmost high|\bcreator|\bsustainer|\bcherisher/, rtx: ['اله', 'ربب'], sky: 'holy',
    it: () => [['bloom', { x: 200, y: 112, r: 58 }]],
    caps: ['اللہ، رب کی روشنی پورے منظر پر چھا جاتی ہے۔', 'Allah, Rab ki roshni poore manzar par chha jaati hai.', 'The light of Allah, the Lord, fills the scene.'] }
];
const SKIES = ['night', 'holy', 'dawn', 'dusk', 'day', 'void'];
const GRND = new Set(['tree', 'kaaba', 'dome', 'figures', 'camels', 'elephants', 'child', 'gate', 'humans', 'food', 'stones', 'chest', 'lost', 'path']);
const SKYX = new Set(['bloom', 'orbits', 'scales', 'crown', 'pulse', 'core', 'hand', 'shield', 'rope', 'knots', 'beads']);
const cache = new Map();

function words(A) { return A.words.map(w => ({ en: (w.en || '').toLowerCase(), tl: (w.tl || '').toLowerCase(), root: (w.root || '').replace(/[^ء-ي]/g, '') })); }

function compose(S, A) {
  const key = S.n + ':' + A.v; if (cache.has(key)) return cache.get(key);
  const W = words(A), nW = W.length, hit = [];
  TH.forEach(t => {
    let wi = -1;
    for (let i = 0; i < nW; i++) { if (t.re.test(W[i].en) || (t.id === 'one' && /^ahad|^samad/.test(W[i].tl)) || (t.rtx && t.rtx.some(r => W[i].root === r || (r.length === 3 && W[i].root.length === 3 && W[i].root === r)))) { wi = i; break; } }
    if (wi >= 0) hit.push({ t, wi });
  });
  hit.sort((a, b) => b.t.pr - a.t.pr || a.wi - b.wi);
  const pick = [], seenSky = new Set(); let nItems = 0;
  for (const h of hit) { if (pick.length >= 3) break; const its = h.t.it(); if (nItems + its.length > 5 && pick.length) continue; pick.push(h); nItems += its.length; }
  const r0 = hs(S.n, A.v);
  /* sky: strongest sky-bearing theme, else varied by place + hash */
  let sky = pick.length ? pick[0].t.sky : null, moon = null;
  pick.forEach(h => { if (h.t.moon) moon = h.t.moon; });
  if (!sky) sky = SKIES[Math.floor(r0 * SKIES.length)];
  if (sky === 'day' && !pick.some(h => h.t.id === 'sun' || h.t.id === 'water' || h.t.id === 'plant' || h.t.id === 'birds' || h.t.id === 'camel' || h.t.id === 'people')) sky = r0 < 0.5 ? 'dawn' : 'holy';
  const items = []; let slot = Math.floor(r0 * SLOT.length), need = false;
  pick.forEach(h => {
    h.t.it().forEach(([a, p0]) => {
      const p = Object.assign({}, p0);
      if ((SKYX.has(a) || GRND.has(a) || a === 'beam' || a === 'bloom') && p.x === undefined && a !== 'path' && a !== 'humans' && a !== 'lost') { p.x = SLOT[slot++ % SLOT.length]; }
      if (p.y === undefined && (a === 'bloom' || a === 'orbits' || a === 'scales' || a === 'crown' || a === 'pulse' || a === 'core' || a === 'hand' || a === 'shield')) p.y = UY.sky;
      if (GRND.has(a) && a !== 'path') need = true;
      items.push(Object.assign({ a, w: Math.min(nW - 1, h.wi) }, p));
    });
  });
  /* guarantee a lively scene: ambient pulse on the opening word and a light on the closing word */
  if (!items.length) { items.push({ a: 'bloom', w: 0, x: 200, y: UY.sky, r: 50 }); items.push({ a: 'pulse', w: Math.max(0, nW >> 1), x: 200, y: UY.sky, r: 80, col: r0 < 0.5 ? '#35d0e6' : '#e8b84a' }); }
  else if (items.length === 1) items.push({ a: 'pulse', w: Math.max(0, nW - 1), x: items[0].x || 200, y: UY.sky, r: 78, col: '#e8b84a' });
  let gr = need ? (sky === 'day' || sky === 'holy' ? 'flat' : (r0 < 0.6 ? 'dunes' : 'flat')) : 'none';
  if (pick.some(h => ['kaaba', 'camel', 'prayer', 'journey', 'elephant'].includes(h.t.id))) gr = 'dunes';
  const cx = pick.length ? { uru: pick.slice(0, 2).map(h => h.t.caps[0]).join(' '), ur: pick.slice(0, 2).map(h => h.t.caps[1]).join(' '), en: pick.slice(0, 2).map(h => h.t.caps[2]).join(' ') } : { uru: 'آیت کے الفاظ کے ساتھ روشنی ابھرتی ہے۔', ur: 'Ayat ke alfaaz ke saath roshni ubharti hai.', en: 'Light rises with the words of the ayah.' };
  const spec = { sky, gr, items, cx }; if (moon) spec.moon = moon;
  cache.set(key, spec); if (cache.size > 400) cache.delete(cache.keys().next().value);
  return spec;
}
window.FahmCompose = { spec: compose, themes: TH };
})();

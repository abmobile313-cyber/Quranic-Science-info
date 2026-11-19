/* Per-ayah scene specs. Each item appears when its word index (w, 0-based) is reached. cx = what the scene shows (a description, not a historical claim). */
(function () {
const I = (a, w, p) => Object.assign({ a, w }, p || {});
const S = {};
const add = (k, sky, gr, items, ur, en, extra) => { S[k] = Object.assign({ sky, gr, items, cx: { ur, en } }, extra || {}); };

/* ---- 1 Al-Fatihah ---- */
add('1:1', 'holy', 'none', [I('bloom', 0, { x: 200, y: 130, r: 62 }), I('bloom', 1, { x: 200, y: 130, r: 95, rays: 20 }), I('rain', 2, { col: '#e8b84a', n: 34 }), I('rain', 3, { col: '#35d0e6', n: 30 })],
  'Allah ke naam ki roshni phailti hai; Rahmaan o Raheem ki rehmat barish ban kar utarti hai.', 'The light of Allah’s name spreads, and His mercy falls like rain.');
add('1:2', 'night', 'none', [I('beam', 0, { x: 200, y: 230, col: '#e8b84a' }), I('bloom', 2, { x: 200, y: 120, r: 58 }), I('orbits', 3, { x: 200, y: 130, n: 5 })],
  'Hamd ki roshni upar uthti hai; Rab ke sab jahan (aalameen) us ke gird ghoomte hain.', 'Praise rises up; all the worlds revolve in His care as Lord.');
add('1:3', 'holy', 'none', [I('bloom', 0, { x: 200, y: 120, r: 70, col: '#35d0e6' }), I('rain', 0, { col: '#35d0e6', n: 36 }), I('pulse', 1, { x: 200, y: 120, r: 90, col: '#e8b84a' })],
  'Rehmat ka dayra badhta jata hai: Rahmaan aur Raheem.', 'The circle of mercy keeps widening.');
add('1:4', 'dusk', 'dunes', [I('crown', 0, { x: 200, y: 56 }), I('sun', 1, { x: 90, y0: 120, y1: 190, d: 6 }), I('scales', 2, { x: 250, y: 120, tilt: 0.15 })],
  'Maalik ka taaj, din dhalta hai, aur insaaf ka taraazu qaaim hota hai (Roz-e-Jazaa).', 'The Master’s crown, the day ends, and the scales of justice are set.');
add('1:5', 'dawn', 'dunes', [I('beam', 0, { x: 200, y: 210, col: '#e8b84a' }), I('dome', 1, { x: 90, y: 214, s: 0.8 }), I('figures', 1, { n: 5, x: 250, y: 214, mode: 'pray', gap: 26, s: 0.9 }), I('beam', 3, { x: 330, y: 200, col: '#35d0e6' })],
  'Sirf Tujhi ko sajda; sirf Tujhi se madad: bandagi aur dua ek hi roshni mein.', 'Worship and asking for help meet in one light.');
add('1:6', 'dusk', 'none', [I('path', 1, { kind: 'maze' }), I('path', 2, { kind: 'straight' })],
  'Bhatakte raste dikhte hain, aur dua par seedha raasta roshan ho jata hai.', 'Winding paths appear; then the straight path lights up.');
add('1:7', 'dusk', 'none', [I('path', 0, { kind: 'straight', x: 160 }), I('figures', 1, { n: 4, x: 160, y: 262, mode: 'walk', gap: 22, s: 0.9 }), I('bloom', 2, { x: 160, y: 80, r: 50 }), I('haze', 5, { x: 330, y: 200, col: '#c4302b' }), I('lost', 8, { x: 330, y: 245, n: 5 })],
  'Inaam wale log roshan raaste par; ghazab wale aur bhatke hue dhundh mein alag.', 'The blessed walk the lit path; the angered and the lost wander apart in haze.');

/* ---- 105 Al-Fil ---- */
add('105:1', 'dawn', 'dunes', [I('bloom', 4, { x: 200, y: 50, r: 55 }), I('kaaba', 5, { x: 300, y: 214, s: 1.1 }), I('elephants', 6, { n: 3, x: 40, gap: 70, v: 12 })],
  'Kaabe ki taraf haathiyon ka lashkar badhta hai: Abraha ka lashkar.', 'An army of elephants advances on the Kaaba.');
add('105:2', 'dusk', 'dunes', [I('kaaba', 0, { x: 320, y: 214, s: 1.1 }), I('elephants', 0, { n: 3, x: 40, gap: 70, mode: 'wander' }), I('haze', 3, { x: 150, y: 214, col: '#7a5a8a' })],
  'Un ki tadbeer nakaam: lashkar bhatak kar ulte pair phirta hai.', 'Their plan is turned to nothing; the army wanders in confusion.');
add('105:3', 'dusk', 'dunes', [I('kaaba', 0, { x: 320, y: 214, s: 1.1 }), I('elephants', 0, { n: 3, x: 40, gap: 70, mode: 'wander' }), I('birds', 2, { n: 12, tx: 150, ty: 175 }), I('birds', 3, { n: 14, tx: 120, ty: 160 })],
  'Ababeel parindon ke jhund aasmaan se utarte hain.', 'Flocks of birds descend from the sky.');
add('105:4', 'fire', 'dunes', [I('kaaba', 0, { x: 320, y: 214, s: 1.1 }), I('elephants', 0, { n: 3, x: 40, gap: 70, mode: 'wander' }), I('birds', 0, { n: 10, tx: 150, ty: 170 }), I('stones', 1, { tx: 120, ty: 210 }), I('stones', 3, { n: 14, tx: 150, ty: 210 })],
  'Parinde sijjeel (pakki mitti) ke kankar barsate hain.', 'The birds rain down stones of baked clay.');
add('105:5', 'dawn', 'dunes', [I('kaaba', 0, { x: 320, y: 214, s: 1.1 }), I('elephants', 0, { n: 3, x: 40, gap: 70, mode: 'crumble' }), I('straw', 1, { n: 70 }), I('straw', 2, { n: 40, eaten: true })],
  'Lashkar khaye hue bhoose ki tarah reza reza; Kaaba salamat.', 'The army is left like chewed straw; the Kaaba stands safe.');

/* ---- 106 Quraysh ---- */
add('106:1', 'dawn', 'dunes', [I('bloom', 0, { x: 200, y: 70, r: 50, col: '#35d0e6' }), I('kaaba', 1, { x: 230, y: 214, s: 1.2 }), I('figures', 1, { n: 5, x: 110, y: 214, mode: 'stand', gap: 24, s: 0.85 })],
  'Quraysh ek dusre se aur Haram se manoos aur jude hue.', 'Quraysh, bound together and to the Sacred House.');
add('106:2', 'dusk', 'dunes', [I('camels', 1, { n: 3, x: 40, gap: 85, dir: 1 }), I('frost', 2, {}), I('sun', 3, { x: 330, y0: 100, y1: 60, d: 2 })],
  'Sardiyon mein Yaman ka aur garmiyon mein Sham ka tijarati safar.', 'The winter caravan to Yemen and the summer caravan to Syria.');
add('106:3', 'dawn', 'dunes', [I('bloom', 1, { x: 200, y: 60, r: 55 }), I('kaaba', 3, { x: 260, y: 214, s: 1.3 }), I('figures', 0, { n: 4, x: 120, y: 214, mode: 'pray', gap: 26, s: 0.9 })],
  'Isi Ghar ke Rab ki ibadat karo.', 'So let them worship the Lord of this House.');
add('106:4', 'day', 'dunes', [I('food', 1, { x: 110, y: 190, empty: true }), I('food', 3, { x: 110, y: 190 }), I('shield', 5, { x: 290, y: 110 }), I('haze', 6, { x: 290, y: 170, col: '#3a3a5a', dissolve: true })],
  'Bhook mein khilaya aur khauf mein aman diya.', 'He fed them against hunger and secured them from fear.');

/* ---- 107 Al-Ma'un ---- */
add('107:1', 'dusk', 'flat', [I('bloom', 0, { x: 200, y: 70, r: 40 }), I('scales', 3, { x: 200, y: 110, tilt: -0.3 })],
  'Kya tu ne dekha jo jaza ko jhutlata hai? Taraazu us ke khilaf jhukta hai.', 'Have you seen the one who denies the Judgement?');
add('107:2', 'night', 'flat', [I('child', 3, { x: 150, y: 222, shove: true })],
  'Woh yateem ko dhakke deta hai.', 'He pushes the orphan away.');
add('107:3', 'night', 'flat', [I('child', 3, { x: 150, y: 222 }), I('food', 3, { x: 290, y: 190, away: true })],
  'Miskeen ko khana khilane ki targheeb nahi deta.', 'He urges no one to feed the poor.');
add('107:4', 'dusk', 'flat', [I('pulse', 0, { x: 200, y: 140, r: 80, col: '#ff7a2a' }), I('figures', 1, { n: 5, x: 200, y: 222, mode: 'pray', gap: 30 })],
  'Un namaziyon ke liye tabahi...', 'Woe to those who pray...');
add('107:5', 'dusk', 'flat', [I('figures', 0, { n: 6, x: 200, y: 222, mode: 'neglect', gap: 30 })],
  '...jo apni namaz se ghaafil hain.', '...who are heedless of their prayer.');
add('107:6', 'night', 'flat', [I('figures', 0, { n: 5, x: 200, y: 222, mode: 'spot', gap: 40, hero: 2 })],
  'Jo sirf dikhawa karte hain: roshni logon ki nazar par.', 'Who only make a show: the light is for onlookers.');
add('107:7', 'night', 'flat', [I('child', 0, { x: 130, y: 222 }), I('food', 1, { x: 290, y: 190, away: true })],
  'Aur chhoti si cheez (maa’oon) bhi rok lete hain.', 'And withhold even small kindnesses.');

/* ---- 108 Al-Kawthar ---- */
add('108:1', 'night', 'none', [I('rain', 1, { col: '#e8b84a', n: 30 }), I('river', 2, { y: 150 }), I('bloom', 0, { x: 200, y: 60, r: 42 })],
  'Hum ne tujhe Kausar diya: bhalaai ki bepanaah nahar.', 'We have given you Al-Kawthar: an overflowing river of good.');
add('108:2', 'dawn', 'dunes', [I('figures', 0, { n: 4, x: 100, y: 214, mode: 'pray', gap: 26 }), I('camels', 2, { n: 1, x: 260, still: true, aura: '#e8b84a', s: 0.9 })],
  'Apne Rab ke liye namaz aur qurbani.', 'So pray to your Lord and sacrifice.');
add('108:3', 'dusk', 'dunes', [I('tree', 1, { x: 200, y: 214, wither: 1, s: 1.5 }), I('tree', 3, { x: 200, y: 214, cut: true, s: 1.5 })],
  'Tera dushman hi jad kata hai: shajar murjha kar kat jata hai.', 'It is your enemy who is cut off.');

/* ---- 109 Al-Kafirun ---- */
add('109:1', 'dawn', 'none', [I('bloom', 0, { x: 200, y: 70, r: 50 }), I('figures', 2, { n: 6, x: 200, y: 262, mode: 'stand', gap: 40, s: 0.9 })],
  'Elaan: “Kaho, ae inkaar karne walo!”', 'Declaration: “Say, O disbelievers!”');
add('109:2', 'night', 'none', [I('split', 1, {}), I('beam', 1, { x: 120, y: 200, col: '#35d0e6' })],
  'Main us ki ibadat nahi karta jis ki tum karte ho.', 'I do not worship what you worship.');
add('109:3', 'night', 'none', [I('split', 0, {}), I('beam', 4, { x: 120, y: 200, col: '#35d0e6' }), I('beam', 1, { x: 290, y: 200, col: '#e8b84a' })],
  'Aur na tum us ki ibadat karne wale ho jis ki main karta hoon.', 'Nor do you worship what I worship.');
add('109:4', 'night', 'none', [I('split', 0, {}), I('beam', 1, { x: 120, y: 200, col: '#35d0e6' }), I('beam', 4, { x: 290, y: 200, col: '#e8b84a' })],
  'Aur na main ibadat karne wala hoon jis ki tum ne ibadat ki.', 'Nor shall I worship what you worship.');
add('109:5', 'night', 'none', [I('split', 0, {}), I('beam', 4, { x: 120, y: 200, col: '#35d0e6' }), I('beam', 1, { x: 290, y: 200, col: '#e8b84a' })],
  'Aur na tum us ki ibadat karoge jis ki main karta hoon.', 'Nor will you worship what I worship.');
add('109:6', 'dawn', 'none', [I('split', 0, {}), I('bloom', 1, { x: 300, y: 150, r: 45, col: '#e8b84a' }), I('bloom', 3, { x: 100, y: 150, r: 45, col: '#35d0e6' })],
  'Tumhara din tumhare liye, mera din mere liye.', 'To you your religion, and to me mine.');

/* ---- 110 An-Nasr ---- */
add('110:1', 'dawn', 'dunes', [I('beam', 2, { x: 200, y: 160, col: '#fff2c0', down: true }), I('gate', 4, { x: 200, y: 214, s: 1.1 })],
  'Allah ki madad aati hai aur fatah ka darwaza khul jata hai.', 'Allah’s help comes, and the gate of victory opens.');
add('110:2', 'day', 'dunes', [I('gate', 0, { x: 200, y: 214, s: 1.1, crowd: 14 }), I('gate', 6, { x: 200, y: 214, s: 1.1, crowd: 26 })],
  'Log fauj dar fauj Allah ke deen mein dakhil ho rahe hain.', 'You see people entering Allah’s religion in crowds.');
add('110:3', 'night', 'none', [I('beads', 0, { x: 200, y: 110 }), I('rain', 3, { col: '#e8b84a', n: 30 }), I('rain', 6, { col: '#35d0e6', n: 26, rev: true })],
  'Tasbeeh, hamd aur istighfaar: kyunki woh bahut touba qabool karne wala hai.', 'Glorify, praise and seek forgiveness: He is ever Accepting of repentance.', { moon: [330, 50] });

/* ---- 111 Al-Masad ---- */
add('111:1', 'fire', 'none', [I('hand', 1, { x: 150, y: 130, rot: 0.15 }), I('hand', 1, { x: 250, y: 130, rot: -0.15 }), I('flames', 3, { y: 270, wd: 150, h: 90 })],
  'Abu Lahab ke dono haath toot gaye; woh khud tabah hua.', 'Perish the hands of Abu Lahab, and he has perished.');
add('111:2', 'fire', 'none', [I('coins', 3, { n: 22 }), I('coins', 5, { n: 16, x: 170, wd: 100 }), I('flames', 0, { y: 275, wd: 120, h: 60, n: 30 })],
  'Na us ka maal kaam aaya, na jo us ne kamaya.', 'His wealth did not avail him, nor what he earned.');
add('111:3', 'fire', 'none', [I('flames', 1, { y: 280, wd: 200, h: 140, n: 70 }), I('flames', 3, { y: 280, wd: 280, h: 190, n: 70, seed: 3 })],
  'Woh bhadakti hui lau wali aag mein dakhil hoga.', 'He will burn in a Fire of blazing flame.');
add('111:4', 'fire', 'none', [I('firewood', 1, { x: 200, y: 215 }), I('flames', 0, { y: 285, wd: 120, h: 70, n: 30 })],
  'Aur us ki biwi: lakriyan (eendhan) uthane wali.', 'And his wife, the carrier of firewood.');
add('111:5', 'fire', 'none', [I('rope', 3, { x: 200, y: 140 }), I('firewood', 0, { x: 200, y: 235 })],
  'Us ki gardan mein khajoor ke reshon ki rassi hogi.', 'Around her neck will be a rope of palm fibre.');

/* ---- 112 Al-Ikhlas ---- */
add('112:1', 'void', 'none', [I('bloom', 1, { x: 200, y: 130, r: 60 }), I('core', 3, { mode: 'one', x: 200, y: 130 })],
  'Woh Allah ek hai: ek hi noor, koi doosra nahi.', 'He is Allah, One.');
add('112:2', 'void', 'none', [I('core', 1, { mode: 'samad', x: 200, y: 130 })],
  'Allah beniyaz hai: sab us ke mohtaaj, woh kisi ka mohtaaj nahi.', 'Allah, the Self-Sufficient: all depend on Him, He depends on none.');
add('112:3', 'void', 'none', [I('core', 1, { mode: 'lineage', x: 200, y: 130 })],
  'Na us ki aulad, na woh kisi ki aulad.', 'He begets not, nor is He begotten.');
add('112:4', 'void', 'none', [I('core', 3, { mode: 'equal', x: 200, y: 130 })],
  'Aur koi us ka humsar nahi.', 'And there is none comparable to Him.');

/* ---- 113 Al-Falaq ---- */
add('113:1', 'night', 'dunes', [I('dawnsplit', 2, { y: 205 }), I('bloom', 3, { x: 200, y: 205, r: 60 })],
  'Subah ke Rab ki panah: andhere ko cheerti roshni.', 'I seek refuge in the Lord of daybreak.');
add('113:2', 'dusk', 'dunes', [I('dark', 1, { d: 2.5, full: 0.6 }), I('orbits', 3, { x: 290, y: 90, n: 2 })],
  'Us ki makhlooq ke shar se.', 'From the evil of what He created.');
add('113:3', 'dusk', 'dunes', [I('dark', 2, { d: 3, full: 1 })],
  'Andhere ke shar se jab woh chha jaye.', 'From the evil of darkness when it settles.', { moon: [320, 56] });
add('113:4', 'night', 'dunes', [I('knots', 2, { x: 200, y: 150 }), I('smoke', 2, { x: 60, y: 200, tx: 200, ty: 150, col: '#6a3aa0' })],
  'Girahon mein phoonkne wali (jaadugar) ke shar se.', 'From the evil of those who blow on knots.');
add('113:5', 'night', 'dunes', [I('smoke', 2, { x: 60, y: 190, tx: 280, ty: 130, col: '#2a8a5a', orb: '#e8b84a' }), I('smoke', 4, { x: 60, y: 210, tx: 280, ty: 130, col: '#2a8a5a', n: 40 })],
  'Hasad karne wale ke shar se jab woh hasad kare.', 'From the evil of the envier when he envies.');

/* ---- 114 An-Nas ---- */
add('114:1', 'void', 'none', [I('bloom', 2, { x: 200, y: 90, r: 60 }), I('humans', 3, { n: 36, y: 240 })],
  'Logon ke Rab ki panah.', 'I seek refuge in the Lord of mankind.');
add('114:2', 'void', 'none', [I('humans', 0, { n: 36, y: 240 }), I('crown', 0, { x: 200, y: 80 })],
  'Logon ka Badshah.', 'The King of mankind.');
add('114:3', 'void', 'none', [I('humans', 0, { n: 36, y: 240 }), I('bloom', 0, { x: 200, y: 80, r: 85, rays: 22 })],
  'Logon ka Mabood.', 'The God of mankind.');
add('114:4', 'night', 'none', [I('chest', 0, { x: 200, y: 215 }), I('smoke', 2, { x: 40, y: 120, tx: 200, ty: 213, col: '#2a1a40', n: 30 }), I('smoke', 3, { x: 40, y: 120, tx: 200, ty: 213, col: '#e8b84a', n: 16, retreat: true })],
  'Pichhe hat jane wale waswasa daalne wale ke shar se.', 'From the evil of the whisperer who withdraws.');
add('114:5', 'night', 'none', [I('chest', 0, { x: 200, y: 215, dim: 1 }), I('smoke', 1, { x: 40, y: 120, tx: 200, ty: 213, col: '#2a1a40', n: 34 })],
  'Jo logon ke seenon mein waswasa daalta hai.', 'Who whispers into the hearts of mankind.');
add('114:6', 'night', 'dunes', [I('smoke', 1, { x: 60, y: 170, tx: 180, ty: 190, col: '#ff7a2a', n: 30 }), I('humans', 2, { n: 24, y: 232 })],
  'Jinnon mein se aur insaanon mein se.', 'From among jinn and among men.');

/* ---- Pas-e-manzar (context of revelation) per surah: conservative, widely reported ---- */
const NZ = {
  1: { ur: 'Makki surah. Har namaz ki har rakat mein padhi jati hai. Hadees-e-qudsi (Sahih Muslim) mein ise Allah aur bande ke darmiyan taqseem kaha gaya hai: bande ki hamd, Allah ka jawab.', en: 'A Makkan surah, recited in every rak‘ah of prayer. A hadith qudsi (Sahih Muslim) describes it as divided between Allah and His servant.' },
  105: { ur: 'Abraha (Yaman ka hakim) haathiyon ke lashkar ke saath Kaaba dhane aaya. Allah ne parindon ke jhund bheje jin ke kankar ne lashkar ko tabah kar diya. Yeh waqia Nabi ﷺ ki wiladat ke saal (Aam-ul-Fil) ka mana jata hai.', en: 'Abrahah, the ruler of Yemen, marched on the Kaaba with an army including elephants. Allah sent flocks of birds whose stones destroyed the army. The event is placed in the year of the Prophet’s ﷺ birth (the Year of the Elephant).' },
  106: { ur: 'Surah Fil se gehra talluq (kuch sahaba ke musahif mein dono ek surah likhi gayin). Quraysh sardiyon mein Yaman aur garmiyon mein Sham ka tijarati safar karte the; Haram ki wajah se un ka rasta mahfooz tha.', en: 'Closely tied to Surah al-Fil. Quraysh made winter and summer trade journeys, kept secure by their standing as keepers of the Sacred House.' },
  107: { ur: 'Surah ka pehla hissa un logon ke baare mein hai jo yateem ko dhakka dete aur jaza ko jhutlate the; aakhir mein namaz mein dikhawa karne walon ka zikr hai. Is ke Makki/Madani hone mein mufassireen ka ikhtilaf hai.', en: 'It describes those who push away orphans and deny the Judgement, and ends with those who pray for show. Scholars differ on whether it is Makkan or Madinan.' },
  108: { ur: 'Makki surah. Riwayat mein hai ke Nabi ﷺ ke beton ki wafat ke baad Makkah ke kuch mukhalifeen ne aap ko “abtar” (jad kata) kaha; is par Kausar ki khushkhabri aur dushman ke abtar hone ka elaan utra.', en: 'A Makkan surah. Reports say that after the death of the Prophet’s ﷺ sons, some opponents called him “abtar” (cut off); the surah answers with Al-Kawthar.' },
  109: { ur: 'Makki surah. Riwayat mein hai ke Quraysh ke sardaron ne Nabi ﷺ ko ek muddat apne mabudon aur ek muddat Allah ki ibadat ki pesh-kash ki; surah ne is se saaf bara’at ka elaan kiya.', en: 'A Makkan surah. Reports say Quraysh leaders proposed alternating worship; the surah declares clear disassociation.' },
  110: { ur: 'Fatah-e-Makkah ke mauqe ke aas paas ki surah. Sahaba ne ise Nabi ﷺ ki zindagi ke aakhri daur ka ishara samjha (Sahih Bukhari mein Ibn Abbas رضی اللہ عنہ se riwayat).', en: 'Revealed around the time of the Conquest of Makkah. Companions understood it as a sign that the Prophet’s ﷺ mission was nearing completion (reported by Ibn ‘Abbas in Sahih al-Bukhari).' },
  111: { ur: 'Riwayat (Bukhari o Muslim, Ibn Abbas رضی اللہ عنہ) ke mutabiq Nabi ﷺ ne Safa pahadi par Quraysh ko pukara; Abu Lahab ne kaha “tabban laka”, is par yeh surah utri.', en: 'According to Bukhari and Muslim (Ibn ‘Abbas), the Prophet ﷺ called Quraysh from Mount Safa; Abu Lahab cursed him, and this surah was revealed.' },
  112: { ur: 'Riwayat (Tirmidhi, Ubayy bin Kaab) mein hai ke mushrikeen ne Nabi ﷺ se poocha: apne Rab ka nasab bayan karo; is par Surah Ikhlas utri.', en: 'Reported (Tirmidhi, Ubayy ibn Ka‘b): the polytheists asked the Prophet ﷺ to describe his Lord’s lineage, and this surah was revealed.' },
  113: { ur: 'Surah Falaq aur Nas ko “Mu’awwidhatain” kaha jata hai. Bukhari o Muslim ki riwayat mein Nabi ﷺ par jadoo ke waqiye ke saath inka zikr aata hai; mufassireen mein is ke nuzool ke maqam par aqwal hain.', en: 'Al-Falaq and An-Nas are called the Mu‘awwidhatayn. Bukhari and Muslim mention them in the report about the attempt of sorcery against the Prophet ﷺ; scholars differ on details of their revelation.' },
  114: { ur: 'Surah Falaq ke saath Mu’awwidhatain: panah mangne ki do surahen. Nabi ﷺ sone se pehle inhein padh kar dam karte the (Sahih Bukhari).', en: 'With al-Falaq, the two surahs of seeking refuge. The Prophet ﷺ would recite them before sleep (Sahih al-Bukhari).' }
};
window.FAHM_SCENES = S; window.FAHM_NZ = NZ;
})();

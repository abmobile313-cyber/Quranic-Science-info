/* After the opening animation:
   first run  -> 3D-Earth language screen -> theme / maslak -> wuzu question
   every run  -> wuzu question (spoken, in the user's own language), and a guided, spoken wudu if "No". */
(function () {
'use strict';
const D = document;
const L = {
  ur: { pick: 'اپنی زبان چنیں', pick2: 'زمین کو گھمائیں، پھر اپنی زبان دبائیں', hi: 'فہم القرآن میں خوش آمدید', sub: 'اپنی ترجیحات چن لیں (بعد میں بھی بدل سکتے ہیں)', theme: 'تھیم', dark: 'ڈارک', light: 'لائٹ', mk: 'ترجمہ / مسلک', go: 'آگے چلیں',
    q: 'کیا آپ نے وضو کیا ہے؟', qs: 'قرآنِ مجید کو چھونے سے پہلے باوضو ہونا بہتر ہے۔', yes: 'جی ہاں، وضو ہے', no: 'نہیں', st: 'وضو کا آسان طریقہ', done: 'وضو کر لیا، شروع کریں', see: 'وضو کا طریقہ دیکھیں', look: 'ابھی صرف دیکھنا/سننا ہے', back: 'واپس', nx: 'اگلا قدم', rp: 'دوبارہ سنیں', stp: 'قدم',
    steps: ['نیت اور بسم اللہ پڑھیں', 'دونوں ہاتھ گٹوں تک تین بار دھوئیں', 'کلی کریں اور ناک میں پانی ڈالیں، تین بار', 'پورا چہرہ تین بار دھوئیں', 'دونوں بازو کہنیوں سمیت تین بار دھوئیں', 'پورے سر کا ایک بار مسح کریں', 'کانوں کا مسح کریں', 'دونوں پاؤں ٹخنوں سمیت تین بار دھوئیں'], mkl: { d: 'دیوبندی', b: 'بریلوی', a: 'اہلِ حدیث', j: 'جماعتِ اسلامی', s: 'شیعہ' }, hello: 'السلام علیکم، فہم القرآن میں خوش آمدید' },
  ru: { pick: 'Apni zubaan chunein', pick2: 'Zameen ko ghumayein, phir apni zubaan dabayein', hi: 'Fahmul Quraan mein khush aamdeed', sub: 'Apni tarjeehaat chun lein (baad mein bhi badal sakte hain)', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Tarjuma / Maslak', go: 'Aage chalein',
    q: 'Kya aapne wuzu kiya hai?', qs: 'Quran-e-Majeed ko chhoone se pehle baa-wuzu hona behtar hai.', yes: 'Ji haan, wuzu hai', no: 'Nahin', st: 'Wuzu ka aasaan tareeqa', done: 'Wuzu kar liya, shuru karein', see: 'Wuzu ka tareeqa dekhein', look: 'Abhi sirf dekhna/sunna hai', back: 'Wapas', nx: 'Agla qadam', rp: 'Dobara sunein', stp: 'Qadam',
    steps: ['Niyyat aur Bismillah padhein', 'Dono haath gattoN tak teen baar dhoyein', 'Kulli karein aur naak mein paani daalein, teen baar', 'Poora chehra teen baar dhoyein', 'Dono baazu kohniyon samet teen baar dhoyein', 'Poore sar ka ek baar masah karein', 'Kaanon ka masah karein', 'Dono paaon takhnon samet teen baar dhoyein'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' }, hello: 'Assalamu alaikum, Fahmul Quraan mein khush aamdeed' },
  en: { pick: 'Choose your language', pick2: 'Spin the Earth, then tap your language', hi: 'Welcome to Fahmul Quraan', sub: 'Pick your preferences first (you can change them later)', theme: 'Theme', dark: 'Dark', light: 'Light', mk: 'Translation / school', go: 'Continue',
    q: 'Have you made wudu (ablution)?', qs: 'It is best to be in wudu before touching the Quran.', yes: 'Yes, I have wudu', no: 'No', st: 'How to make wudu', done: 'Wudu done, start', see: 'See how to make wudu', look: 'Just viewing / listening for now', back: 'Back', nx: 'Next step', rp: 'Hear again', stp: 'Step',
    steps: ['Make the intention and say Bismillah', 'Wash both hands up to the wrists, 3 times', 'Rinse the mouth and nose, 3 times', 'Wash the whole face, 3 times', 'Wash both arms including the elbows, 3 times', 'Wipe the whole head once', 'Wipe the ears', 'Wash both feet including the ankles, 3 times'], mkl: { d: 'Deobandi', b: 'Barelvi', a: 'Ahl-e-Hadith', j: 'Jamaat-e-Islami', s: 'Shia' }, hello: 'Assalamu alaikum, welcome to Fahmul Quraan' }
};
const ICON = ['🤲', '🙌', '💧', '💦', '💪', '✋', '👂', '🦶', '☝️'];
/* Build 32: each step now carries its exact method (Hanafi / common Sunni practice), plus the dua after wudu as step 9. */
const DET = {
  ur: ['دل میں وضو کی نیت کریں اور «بِسْمِ اللہِ الرَّحْمٰنِ الرَّحِیْمِ» پڑھیں۔ مسواک کرنا سنت ہے۔', 'پہلے دایاں ہاتھ، پھر بایاں — گٹوں تک تین تین بار؛ انگلیوں کا خلال کریں، انگوٹھی ہو تو ہلائیں۔', 'دائیں ہاتھ سے تین بار کلی کریں، پھر تین بار ناک میں پانی ڈال کر بائیں ہاتھ سے صاف کریں۔ (روزہ نہ ہو تو غرغرہ اور ناک کی جڑ تک پانی۔)', 'پیشانی کے بالوں سے ٹھوڑی کے نیچے تک، اور ایک کان کی لو سے دوسرے کان کی لو تک پورا چہرہ تین بار؛ داڑھی ہو تو خلال کریں۔', 'پہلے دایاں بازو انگلیوں سے کہنی سمیت تین بار، پھر بایاں بازو اسی طرح۔', 'ہاتھ گیلے کر کے دونوں ہتھیلیاں پیشانی کے بالوں سے پیچھے گدی تک لے جائیں اور واپس آگے لائیں — ٹوپی یا عمامہ اتار کر، ایک بار۔', 'اسی تری سے شہادت کی انگلی سے کان کے اندر، اور انگوٹھے سے کان کے پیچھے مسح کریں۔ (بہت سے علما کے نزدیک ہاتھوں کی پشت سے گردن کا مسح مستحب ہے۔)', 'پہلے دایاں پاؤں، پھر بایاں — ٹخنوں سمیت تین تین بار؛ بائیں ہاتھ کی چھوٹی انگلی سے پاؤں کی انگلیوں کا خلال کریں۔', 'وضو کے بعد آسمان کی طرف دیکھ کر پڑھیں:'],
  ru: ["Dil mein wuzu ki niyyat karein aur 'Bismillahir Rahmanir Raheem' padhein. Miswak karna sunnat hai.", 'Pehle daayaan haath, phir baayaan — gatton tak teen teen baar; ungliyon ka khilal karein, angoothi ho to hilayein.', 'Daayein haath se teen baar kulli karein, phir teen baar naak mein paani daal kar baayein haath se saaf karein. (Roza na ho to gharara aur naak ki jad tak paani.)', 'Peshani ke baalon se thodi ke neeche tak, aur ek kaan ki lau se doosre kaan ki lau tak poora chehra teen baar; daadhi ho to khilal karein.', 'Pehle daayaan baazu ungliyon se kohni samet teen baar, phir baayaan baazu isi tarah.', 'Haath geele kar ke dono hatheliyan peshani ke baalon se peeche gaddi tak le jayein aur wapas aage layein — topi ya imama utaar kar, ek baar.', 'Isi tari se shahadat ki ungli se kaan ke andar, aur angoothe se kaan ke peeche masah karein. (Bahut se ulama ke nazdeek haathon ki pusht se gardan ka masah mustahab hai.)', 'Pehle daayaan paaon, phir baayaan — takhnon samet teen teen baar; baayein haath ki chhoti ungli se paaon ki ungliyon ka khilal karein.', 'Wuzu ke baad aasmaan ki taraf dekh kar padhein:'],
  en: ['Make the intention in your heart and say "Bismillahir Rahmanir Raheem". Using a miswak is sunnah.', 'Right hand first, then the left — up to the wrists, three times each; pass water between the fingers and move any ring.', 'Rinse the mouth three times with the right hand, then put water into the nose three times and clear it with the left hand. (If not fasting, gargle and draw water well into the nose.)', 'From the hairline to below the chin, and from one earlobe to the other, three times; run wet fingers through the beard.', 'Right arm first, from the fingertips up to and including the elbow, three times; then the left arm the same way.', 'With wet hands, pass both palms from the front hairline back to the nape and bring them forward again — once, with the cap or turban taken off.', 'With the same moisture, wipe inside the ears with the index fingers and behind the ears with the thumbs. (Many scholars also recommend wiping the neck with the backs of the hands.)', 'Right foot first, then the left — including the ankles, three times each; clean between the toes with the little finger of the left hand.', 'After wudu, look towards the sky and say:']
};
const DUA = { ar: 'اَشْهَدُ اَنْ لَّا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهٗ لَا شَرِيْكَ لَهٗ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهٗ وَرَسُوْلُهٗ — اَللّٰهُمَّ اجْعَلْنِيْ مِنَ التَّوَّابِيْنَ وَاجْعَلْنِيْ مِنَ الْمُتَطَهِّرِيْنَ', ur: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے توبہ کرنے والوں اور پاک رہنے والوں میں شامل فرما۔', ru: 'Main gawahi deta hoon ke Allah ke siwa koi mabood nahin, woh akela hai, us ka koi shareek nahin, aur Muhammad ﷺ us ke bande aur Rasool hain. Aey Allah! Mujhe tauba karne walon aur paak rehne walon mein shamil farma.', en: 'I bear witness that there is no god but Allah, alone without partner, and that Muhammad ﷺ is His servant and Messenger. O Allah, make me of those who repent and of those who purify themselves.', src: { ur: 'مسلم، ترمذی', ru: 'Muslim, Tirmizi', en: 'Muslim, Tirmidhi' } };
const STEP9 = { ur: 'وضو کے بعد کی دعا', ru: 'Wuzu ke baad ki dua', en: 'Dua after wudu' };
const SHIA = { ur: 'شیعہ فقہ میں وضو کا طریقہ کچھ مختلف ہے (بازو کہنی سے انگلیوں کی طرف دھوئے جاتے ہیں اور پاؤں کا مسح ہوتا ہے)؛ اپنے عالم سے رہنمائی لیں۔', ru: 'Shia fiqh mein wuzu ka tareeqa kuch mukhtalif hai (baazu kohni se ungliyon ki taraf dhoye jaate hain aur paaon ka masah hota hai); apne alim se rahnumai lein.', en: 'In Shia fiqh the method differs (arms are washed from the elbow down to the fingers, and the feet are wiped); please follow your own scholar.' };
const drop = '<svg viewBox="0 0 64 64"><path d="M32 6C22 20 12 30 12 41a20 20 0 0 0 40 0C52 30 42 20 32 6z" fill="url(#ob1)" stroke="#33cbe0" stroke-width="2"/><path d="M22 42a10 10 0 0 0 8 9" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/><defs><linearGradient id="ob1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe6f2"/><stop offset="1" stop-color="#1b8ba0"/></linearGradient></defs></svg>';
const bubbles = '<div class="ob-bub">' + Array.from({ length: 9 }, (_, i) => `<i style="left:${8 + i * 10.5}%;animation-delay:${(i * 0.7).toFixed(1)}s;width:${8 + (i * 7) % 14}px;height:${8 + (i * 7) % 14}px"></i>`).join('') + '</div>';
let box = null, step = '', globe = null, si = 0;
const A = () => window.__fahmApp, ST = () => A().st(), lg = () => L[ST().ui] || L.ru;

/* ---------- voice (free: phone's own speech engine). Urdu text is spoken for both Urdu and Roman-Urdu users. ---------- */
const voiceOn = () => ST().onv !== 0;
/* Build 27: no phone / Google voice any more. Only recorded ElevenLabs clips play (vo/ob/<key>.mp3 listed in OBV); anything without a clip stays silent. */
const OBV = {}; (() => { [['ur', 'hu'], ['en', 'en']].forEach(([k, l]) => { L[k].steps.forEach((t, i) => { OBV[t] = `vo/ob/s${i + 1}_${l}.mp3`; }); OBV[L[k].hello] = `vo/ob/hello_${l}.mp3`; }); })();
function say(text, done) {
  stopV();
  const f = OBV[text];
  if (voiceOn() && f) { try { const a = new Audio(f); au = a; a.onended = () => { au = null; if (done) done(); }; a.onerror = () => { au = null; if (done) done(); }; const p = a.play(); if (p && p.catch) p.catch(() => { if (done) done(); }); } catch (e) { if (done) done(); } return; }
  if (done) done(); return;
  try {
    const xb = ST().xl && window.FahmXL && FahmXL.bcp(); if (xb) { text = FahmXL.t(text); }
    const en = ST().ui === 'en', lang = xb || (en ? 'en-US' : 'ur-PK'), u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = .92;
    const vs = speechSynthesis.getVoices(), p = lang.slice(0, 2), v = vs.find(x => x.lang === lang) || vs.find(x => x.lang.slice(0, 2) === p) || (!en && !xb ? vs.find(x => x.lang.slice(0, 2) === 'hi') : null);
    if (xb && !v) { if (done) done(); return; }
    if (v) u.voice = v; if (done) { u.onend = done; u.onerror = done; } speechSynthesis.speak(u);
  } catch (e) { if (done) done(); }
}
let au = null;
function stopV() { try { speechSynthesis.cancel(); } catch (e) { } if (au) { try { au.pause(); } catch (e) { } au = null; } }
/* recorded voice-over made for the Quranic Science site (hu = Urdu/Hindustani, en = English) */
function clip(name, fb, done) {
  stopV(); if (!voiceOn()) { if (done) done(); return; }
  const l = ST().ui === 'en' ? 'en' : 'hu'; let fin = false; const end = () => { if (fin) return; fin = true; if (done) done(); };
  try { const a = new Audio('vo/v-' + name + '-' + l + '.mp3'); au = a; a.onended = end; a.onerror = () => { au = null; fin = true; say(fb, done); }; const p = a.play(); if (p && p.catch) p.catch(() => { au = null; if (!fin) { fin = true; say(fb, done); } }); }
  catch (e) { say(fb, done); }
}
const spoken = () => (ST().ui === 'en' ? L.en : L.ur);
const vbtn = () => `<button class="ob-vol" data-a="vol" aria-label="voice">${voiceOn() ? '🔊' : '🔇'}</button>`;
function killGlobe() { if (globe) { globe.stop(); globe = null; } }

/* ---------- 1. language on a 3D Earth ---------- */
function lang() {
  step = 'lang'; const s = ST();
  shell().innerHTML = `<div class="ob-in ob-lang">${bubbles}
    <img class="ob-ic" src="icons/icon-192.png" alt="Fahmul Quraan"><h2>${L.ur.pick} · ${L.ru.pick} · ${L.en.pick}</h2>
    <div class="ob-earth"><canvas id="obEarth"></canvas><div class="ob-fb"></div></div>
    <p class="ob-hint">${L.ur.pick2}<br>${L.en.pick2}</p>
    <div class="ob-lbtns">${[['ur', 'اردو', 'Urdu'], ['ru', 'Roman Urdu', 'Roman'], ['en', 'English', 'English']].map(([v, l, s2]) => `<button class="b3d" data-lang="${v}"><b>${l}</b><small>${s2}</small></button>`).join('')}</div></div>`;
  box.hidden = false; killGlobe();
  const cv = D.getElementById('obEarth'); globe = window.FahmGlobe ? FahmGlobe.mount(cv) : null; if (!globe) box.querySelector('.ob-earth').classList.add('nogl');
}

/* ---------- 2. theme + school ---------- */
function setup() {
  step = 'setup'; killGlobe(); const s = ST(), t = lg(), mk = A().MASLAK;
  const cur = (mk.find(([k, c]) => s.tl.includes(c)) || [0, ''])[1];
  shell().innerHTML = `<div class="ob-in">${bubbles}<img class="ob-ic" src="icons/icon-192.png" alt="Fahmul Quraan"><h2>${t.hi}</h2><p>${t.sub}</p>
  <h5>${t.theme}</h5><div class="ob-seg">${[['dark', t.dark], ['light', t.light]].map(([v, l]) => `<button data-p="theme" data-v="${v}" class="${s.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h5>${t.mk}</h5><div class="ob-seg wrap">${mk.map(([k, c]) => `<button data-p="mk" data-v="${c}" class="${cur === c ? 'on' : ''}">${t.mkl[k]}</button>`).join('')}</div>
  <button class="ob-go b3d gold" data-a="next">${t.go}</button></div>`;
  box.hidden = false;
}


/* ---------- water scene: falling drops, crown splash, ripples, rebound jet, bubbles and light shafts (canvas, loops while on screen) ---------- */
function waterScene(host, opt) {
  opt = opt || {}; if (!host) return; const cv = D.createElement('canvas'); cv.className = 'ob-wc'; host.insertBefore(cv, host.firstChild); const x = cv.getContext('2d'); if (!x) return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 300, H = 200, dpr = Math.min(2, window.devicePixelRatio || 1), SY = 130; const drops = [], rip = [], parts = [], bub = [], R = Math.random;
  const size = () => { const r = host.getBoundingClientRect(); W = Math.max(120, r.width || 300); H = Math.max(100, r.height || 200); cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); SY = H * (opt.pool || .7); };
  size(); try { new ResizeObserver(size).observe(host); } catch (e) { }
  const spawn = big => { const r = W * (big ? .034 : .024); drops.push({ x: W * (.5 + (R() - .5) * (opt.spread || .22)), y: (opt.startY || -r * 2) * 1, r, vy: 0, big }); };
  for (let i = 0; i < 14; i++) bub.push({ x: R() * W, y: SY + R() * (H - SY), r: 1 + R() * 2.4, v: 6 + R() * 14, ph: R() * 6.28 });
  let t = 0, last = 0, next = .35, k = 0;
  const burst = (px, big) => {
    rip.push({ x: px, r: 2, a: .9, v: W * .16 }); rip.push({ x: px, r: 0, a: .6, v: W * .11, d: .12 });
    const n = big ? 13 : 7; for (let i = 0; i < n; i++) { const an = -Math.PI * (.15 + .7 * R()), sp = W * (big ? .55 : .36) * (.5 + R() * .7); parts.push({ x: px, y: SY, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, r: (big ? 2.4 : 1.8) * (.5 + R()), life: 1 }); }
    if (big) parts.push({ x: px, y: SY, vx: 0, vy: -H * 1.25, r: W * .014, life: 1, jet: 1 });
  };
  const surf = px => { let y = SY + Math.sin(px * .035 + t * 1.6) * 1.6 + Math.sin(px * .08 - t * 2.3) * .9; rip.forEach(q => { const d = Math.abs(px - q.x) - q.r; if (d < 14 && d > -14) y += Math.cos(d * .45) * 3.2 * q.a * (1 - Math.abs(d) / 14); }); return y; };
  const frame = ts => {
    if (!host.isConnected) return; const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; if (!reduce) t += dt; else t = 1.2;
    x.clearRect(0, 0, W, H);
    /* light shafts */
    for (let i = 0; i < 3; i++) { const cx = W * (.2 + i * .3) + Math.sin(t * .5 + i * 2) * W * .05, g = x.createLinearGradient(0, 0, 0, SY); g.addColorStop(0, 'rgba(190,245,252,.20)'); g.addColorStop(1, 'rgba(190,245,252,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - W * .03, 0); x.lineTo(cx + W * .03, 0); x.lineTo(cx + W * .11, SY); x.lineTo(cx - W * .09, SY); x.closePath(); x.fill(); }
    /* pool */
    const pg = x.createLinearGradient(0, SY, 0, H); pg.addColorStop(0, 'rgba(70,214,236,.62)'); pg.addColorStop(.5, 'rgba(18,120,160,.78)'); pg.addColorStop(1, 'rgba(6,44,70,.92)');
    x.beginPath(); x.moveTo(0, H); for (let px = 0; px <= W; px += 4) x.lineTo(px, surf(px)); x.lineTo(W, H); x.closePath(); x.fillStyle = pg; x.fill();
    x.beginPath(); for (let px = 0; px <= W; px += 4) { const y = surf(px); px ? x.lineTo(px, y) : x.moveTo(px, y); } x.strokeStyle = 'rgba(214,250,255,.8)'; x.lineWidth = 1.6; x.stroke();
    /* caustic sparkles */
    for (let i = 0; i < 9; i++) { const cx = (i * 97.3 + t * 18) % W, cy = SY + 8 + ((i * 53.7) % (H - SY - 12)), a = .18 + .16 * Math.sin(t * 2 + i * 1.7); x.fillStyle = 'rgba(220,252,255,' + Math.max(0, a) + ')'; x.beginPath(); x.ellipse(cx, cy, 7 + (i % 3) * 3, 1.6, 0, 0, 6.28); x.fill(); }
    /* bubbles */
    bub.forEach(b => { b.y -= b.v * dt; b.x += Math.sin(t * 2 + b.ph) * .25; if (b.y < SY + 3) { b.y = H - 2; b.x = R() * W; } x.strokeStyle = 'rgba(214,250,255,.55)'; x.lineWidth = 1; x.beginPath(); x.arc(b.x, b.y, b.r, 0, 6.28); x.stroke(); x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.arc(b.x - b.r * .3, b.y - b.r * .3, b.r * .3, 0, 6.28); x.fill(); });
    /* spawn + falling drops */
    next -= dt; if (next <= 0 && !reduce) { k++; spawn(k % 3 !== 0); next = 1.9 + R() * .8; }
    if (reduce && !drops.length && !k) { k = 1; spawn(true); drops[0].y = SY * .55; }
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; if (!reduce) { d.vy += H * 1.7 * dt; d.y += d.vy * dt; }
      if (d.y + d.r >= SY - 1) { burst(d.x, d.big); drops.splice(i, 1); continue; }
      const st = 1 + Math.min(.55, d.vy / (H * 1.6)), w = d.r, hh = d.r * 1.35 * st; x.save(); x.translate(d.x, d.y);
      const gg = x.createRadialGradient(-w * .3, -hh * .1, w * .1, 0, 0, hh * 1.1); gg.addColorStop(0, 'rgba(240,255,255,.98)'); gg.addColorStop(.45, 'rgba(120,225,242,.95)'); gg.addColorStop(1, 'rgba(24,150,190,.95)');
      x.beginPath(); x.moveTo(0, -hh * 1.9); x.bezierCurveTo(w * .25, -hh * 1.1, w * 1.1, -hh * .2, w, hh * .35); x.arc(0, hh * .35, w, 0, Math.PI, false); x.bezierCurveTo(-w * 1.1, -hh * .2, -w * .25, -hh * 1.1, 0, -hh * 1.9); x.closePath(); x.fillStyle = gg; x.shadowColor = 'rgba(51,203,224,.7)'; x.shadowBlur = 10; x.fill(); x.shadowBlur = 0;
      x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1; x.stroke(); x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(-w * .38, hh * .05, w * .16, w * .36, .3, 0, 6.28); x.fill(); x.restore(); }
    /* splash particles + rebound jet */
    for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i]; q.vy += H * 3 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt * .5;
      if (q.y > SY && q.vy > 0) { if (q.jet) rip.push({ x: q.x, r: 1, a: .55, v: W * .1 }); parts.splice(i, 1); continue; }
      x.fillStyle = 'rgba(190,245,252,' + Math.max(.2, q.life) + ')'; x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.28); x.fill(); if (q.jet) { x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(q.x - q.r * .3, q.y - q.r * .3, q.r * .3, 0, 6.28); x.fill(); } }
    /* ripples (ellipses on the surface) */
    for (let i = rip.length - 1; i >= 0; i--) { const q = rip[i]; if (q.d) { q.d -= dt; continue; } q.r += q.v * dt; q.a -= dt * .42; if (q.a <= 0 || q.r > W * .6) { rip.splice(i, 1); continue; }
      x.strokeStyle = 'rgba(214,250,255,' + q.a + ')'; x.lineWidth = 1.6; x.beginPath(); x.ellipse(q.x, SY + 1, q.r, q.r * .22, 0, 0, 6.28); x.stroke(); }
    if (!reduce) requestAnimationFrame(frame); else if (k && !cv._once) { cv._once = 1; requestAnimationFrame(frame); }
  };
  requestAnimationFrame(frame);
}

/* ---------- 3. wuzu question (spoken) ---------- */
function wuzu() {
  step = 'wuzu'; killGlobe(); const t = lg();
  shell().innerHTML = `<div class="ob-in c">${bubbles}${vbtn()}<div class="ob-wv big"></div><h2>${t.q}</h2><p>${t.qs}</p>
  <button class="ob-go b3d gold" data-a="yes">${t.yes}</button><button class="ob-alt b3d" data-a="no">${t.no}</button><button class="ob-alt b3d sm" data-a="see">💧 ${t.see}</button></div>`;
  box.hidden = false; waterScene(box.querySelector('.ob-wv'), { pool: .72, spread: .2 }); setTimeout(() => { if (step === 'wuzu') clip('wudu', spoken().q + ' ' + spoken().qs); }, 450);
}

/* ---------- 4. guided, spoken wudu ---------- */
function steps(i, quiet) {
  step = 'steps'; si = Math.max(0, Math.min(8, i || 0)); const t = lg(), u = ST().ui, uk = DET[u] ? u : 'ru', rtl = u === 'ur', last = si === 8, N = 9;
  const title = si < 8 ? t.steps[si] : (STEP9[uk] || STEP9.ru), det = (DET[uk] || DET.ru)[si];
  const shia = (ST().tl || []).includes('urn');
  const dua = last ? `<div class="ob-dua"><p class="ar" dir="rtl">${DUA.ar}</p><p ${rtl ? 'dir="rtl" class="u"' : ''}>${DUA[uk] || DUA.ru}</p><small>${DUA.src[uk] || DUA.src.ru}</small></div>` : '';
  shell().innerHTML = `<div class="ob-in c">${bubbles}${vbtn()}<h5>${t.st}</h5>
  <div class="ob-prog">${Array.from({ length: N }, (_, k) => `<i class="${k < si ? 'd' : k === si ? 'n' : ''}"></i>`).join('')}</div>
  <div class="ob-step">${last ? '' : `<div class="ob-wv"><span class="ob-em">${ICON[si]}</span></div>`}
  <div class="ob-sn">${t.stp} ${si + 1} / ${N}</div><h2 ${rtl ? 'dir="rtl"' : ''}>${title}</h2><p class="ob-det" ${rtl ? 'dir="rtl"' : ''}>${det}</p>${dua}${shia && si === 0 ? `<p class="ob-note" ${rtl ? 'dir="rtl"' : ''}>${SHIA[uk] || SHIA.ru}</p>` : ''}</div>
  ${si < 8 ? `<div class="ob-row"><button class="ob-alt b3d sm" data-a="rp">🔊 ${t.rp}</button></div>` : ''}
  ${last ? `<button class="ob-go b3d gold" data-a="yes">${t.done}</button><button class="ob-alt b3d" data-a="yes">${t.look}</button>` : `<button class="ob-go b3d gold" data-a="nx">${t.nx}</button>`}
  <button class="ob-alt b3d" data-a="${si ? 'pv' : 'wuzu'}">${t.back}</button></div>`;
  box.hidden = false; if (last) return;
  waterScene(box.querySelector('.ob-wv'), { pool: .76, spread: .16, startY: 44 }); if (!quiet) say(spoken().steps[si]);
  /* real wudu clip (16:9): loaded straight away (a HEAD probe fails inside the Android app); the icon stays if it cannot load */
  { const n = si + 1, src = 'vo/wudu/w' + n + '.mp4', wv = box.querySelector('.ob-wv'); if (wv) { const v = D.createElement('video'); v.className = 'ob-vid'; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.oncanplay = () => { if (step !== 'steps' || si !== n - 1) return; wv.classList.add('vid'); const em = wv.querySelector('.ob-em'); if (em) em.remove(); }; v.onerror = () => v.remove(); v.src = src; wv.appendChild(v); const p = v.play(); if (p && p.catch) p.catch(() => { }); } }
}

function shell() { if (!box) { box = D.createElement('div'); box.id = 'onb'; D.body.appendChild(box); box.addEventListener('click', onClick); } return box; }
function close() { stopV(); killGlobe(); if (box) { box.classList.add('out'); setTimeout(() => { box && box.remove(); box = null; step = ''; }, 380); } }
function onClick(e) {
  const b = e.target.closest('button'); if (!b) return; const a = A(), s = ST();
  if (b.dataset.lang) { a.setPref('ui', b.dataset.lang); const h = (b.dataset.lang === 'en' ? L.en : L.ur).hello; setup(); say(h); return; }
  if (b.dataset.p === 'mk') { a.setMaslak(b.dataset.v); setup(); return; }
  if (b.dataset.p) { a.setPref(b.dataset.p, b.dataset.v); setup(); return; }
  const k = b.dataset.a; if (!k) return;
  if (k === 'vol') { s.onv = voiceOn() ? 0 : 1; a.save(); b.textContent = voiceOn() ? '🔊' : '🔇'; if (!voiceOn()) stopV(); else if (step === 'wuzu') clip('wudu', spoken().q); else if (step === 'steps') say(spoken().steps[si]); return; }
  if (k === 'rp') { say(spoken().steps[si]); return; }
  if (k === 'next') { s.onb = 1; a.save(); wuzu(); } else if (k === 'no') { steps(0, true); clip('wuduno', spoken().q, () => { if (step === 'steps' && si === 0) say(spoken().steps[0]); }); } else if (k === 'see') steps(0); else if (k === 'nx') steps(si + 1); else if (k === 'pv') steps(si - 1); else if (k === 'wuzu') wuzu(); else if (k === 'yes') close();
}
function start() { if (window.__fahmOnb) return; window.__fahmOnb = 1; if (!ST().onb) { shell(); lang(); } else { shell(); wuzu(); } }
let ready = false, splashGone = !D.documentElement.classList.contains('splashing') && !D.getElementById('splash');
const go = () => { if (ready && splashGone) start(); };
window.addEventListener('fahm-ready', () => { ready = !!window.__fahmApp; go(); });
window.addEventListener('fahm-splash-done', () => { splashGone = true; go(); });
if (window.__fahmApp) { ready = true; }
window.__fahmOnbOpen = () => !!box;
try { speechSynthesis.getVoices(); } catch (e) { }
})();

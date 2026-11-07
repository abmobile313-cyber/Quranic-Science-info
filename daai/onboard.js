'use strict';
/* ===== Deen Saathi — 3D opening, first-open setup wizard (voice + mandatory/optional), first-time tab guides ===== */

/* ---------- 1. Opening: 3D rotating logo + a soft Islamic shimmer (no music) ---------- */
function pubNoor(){ /* airy swell + an open sustained chord (D–A–D–A): atmosphere, not a tune */
  try{if(!S.sfx||!AU.running())return;const c=AU.ctx,t=c.currentTime,dst=AU.fx||AU.out;
    const n=c.createBufferSource();n.buffer=AU.nbuf;n.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=1.1;f.frequency.setValueAtTime(350,t);f.frequency.exponentialRampToValueAtTime(3400,t+1.5);
    const ng=c.createGain();ng.gain.setValueAtTime(.0001,t);ng.gain.exponentialRampToValueAtTime(.07,t+1);ng.gain.exponentialRampToValueAtTime(.0001,t+2.4);n.connect(f);f.connect(ng);ng.connect(dst);n.start(t);n.stop(t+2.6);
    [293.66,440,587.33,880,1174.66].forEach((fr,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=fr;const g=c.createGain(),s=t+i*.16;g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(i>2?.025:.045,s+.55);g.gain.exponentialRampToValueAtTime(.0001,s+3);o.connect(g);g.connect(dst);if(AU.conv)g.connect(AU.conv);o.start(s);o.stop(s+3.1)})}catch(e){}}
function stage3d(){
  const layers=Array.from({length:7},(_,i)=>`<img class="edge" src="logos/qs.webp" alt="" style="transform:translateZ(${(i-3)*2.4}px)">`).join('');
  const sparks=Array.from({length:22},()=>`<i style="left:${Math.random()*100}%;animation-duration:${3.5+Math.random()*4}s;animation-delay:${-Math.random()*6}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px"></i>`).join('');
  return`<div class="o3d"><div class="glow"></div><div class="sprk">${sparks}</div><div class="scene"><div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div><div class="coin">${layers}<img class="face f" src="logos/qs.webp" alt=""><img class="face b" src="logos/qs.webp" alt=""></div></div></div>`}
const SPL={n:store.get('sp_n',0)};
splash=async function(){
  const sp=$('#splash');if(!sp)return;const box=sp.firstElementChild,eye=$('.sp-eye',sp),tap=$('.sp-tap',sp),sub=$('#spSub');
  box.insertAdjacentHTML('afterbegin',stage3d());if(sub)sub.textContent='by Quranic Science';
  const full=SPL.n<3;store.set('sp_n',SPL.n+1);
  const text=S.lang==='ur'?'السلام علیکم':S.lang==='hi'?'अस्सलामु अलैकुम':'ASSALAMU ALAIKUM';
  let skip=false,started=false;const skipP=new Promise(r=>{sp.addEventListener('pointerdown',()=>{if(started){skip=true;r()}})});
  const play=id=>Promise.race([skipP,new Promise(res=>{if(!S.voice){res();return}VO.blob(id).then(u=>{const a=new Audio(u);a.onended=res;a.onerror=res;a.play().catch(res);setTimeout(res,4500)}).catch(res)})]);
  const run=async()=>{started=true;tap.hidden=true;sp.classList.add('go');pubNoor();
    (async()=>{eye.classList.add('typing');let ki=0;for(const ch of text){if(skip)break;eye.textContent+=ch;if(ch!==' '&&(ki++%3===0))sfx('key');await sleep(60+Math.random()*30)}eye.classList.remove('typing')})();
    const bar=$('.sp-bar i',sp);if(bar)setTimeout(()=>bar.style.width='100%',60);
    await sleep(500);await play('open_bism');if(full&&!skip)await play('open_salam');else await sleep(skip?0:600);
    sfx('chime');await sleep(skip?0:350);sfx('whoosh');sp.classList.add('out');setTimeout(()=>sp.remove(),800)};
  AU.unlock();await sleep(350);const go1=()=>{if(started)return;AU.unlock();run()};
  if(AU.running()||!S.sfx){go1();return}
  tap.hidden=false;tap.textContent=T('Shuru karne ke liye chhoo kar dekhein','Tap to begin','شروع کرنے کے لیے چھوئیں','शुरू करने के लिए छुएँ');sp.addEventListener('pointerdown',go1,{once:true});sp.addEventListener('keydown',go1,{once:true});setTimeout(go1,6000)};

/* ---------- 2. First-open setup wizard ---------- */
const OB={open:false,i:0,steps:null};
const MASLAK=[['hanafi','Hanafi'],['shafii','Shafi\'i'],['maliki','Maliki'],['hanbali','Hanbali'],['ahlehadees','Ahl-e-Hadees'],['other',null]];
const obChip=req=>req?`<span class="obchip req">⭐ ${T('Zaroori','Mandatory','ضروری','ज़रूरी')}</span>`:`<span class="obchip opt">${T('Ikhtiyari — chhod sakte hain','Optional — you may skip','اختیاری — چھوڑ سکتے ہیں','वैकल्पिक — छोड़ सकते हैं')}</span>`;
function obSteps(){return obFilt([
 {id:'welcome',voice:'ob_welcome',req:false,hideChip:true,
  title:T('Deen Saathi mein khush-aamdeed 🌙','Welcome to Deen Saathi 🌙','دین ساتھی میں خوش آمدید 🌙','दीन साथी में ख़ुश-आमदीद 🌙'),
  body:T('Yeh app aap ki namaz, Quran, azkar, sadqa aur rozmarra ke kaam ek hi jagah sambhalta hai — bilkul muft, bina login. Ab 6 chhote sawal poochhe jayenge (2 minute). ⭐ Zaroori wale bharna lazmi hai; baaki chhod sakte hain.','This app keeps your prayer, Quran, azkar, sadaqah and daily tasks in one place — completely free, no login. Next, 6 quick questions (2 minutes). ⭐ Mandatory ones must be filled; the rest you may skip.','یہ ایپ آپ کی نماز، قرآن، اذکار، صدقہ اور روزمرہ کے کام ایک ہی جگہ سنبھالتی ہے — بالکل مفت، بغیر لاگ ان۔ اب ۶ چھوٹے سوال پوچھے جائیں گے (۲ منٹ)۔ ⭐ ضروری والے بھرنا لازمی ہے؛ باقی چھوڑ سکتے ہیں۔','यह ऐप आपकी नमाज़, क़ुरआन, अज़कार, सदक़ा और रोज़मर्रा के काम एक ही जगह संभालता है — बिल्कुल मुफ़्त, बिना लॉगिन। अब 6 छोटे सवाल पूछे जाएँगे (2 मिनट)। ⭐ ज़रूरी वाले भरना लाज़मी है; बाक़ी छोड़ सकते हैं।'),
  box:()=>`<div class="c"><img src="logos/qs.webp" width="96" height="96" style="border-radius:26px;background:#fff" alt=""></div>`,ok:()=>true},
 {id:'lang',voice:'ob_lang',req:true,
  title:T('1. Zubaan chunein','1. Choose your language','۱۔ زبان چنیں','1. ज़बान चुनें'),
  body:T('App ki zubaan aur awaaz isi ke mutabiq hogi.','App text and voice will follow this.','ایپ کی زبان اور آواز اسی کے مطابق ہوگی۔','ऐप की ज़बान और आवाज़ इसी के मुताबिक़ होगी।'),
  box:()=>`<div class="grid2">${LANGS.map(l=>`<button class="btn ${l[0]===S.lang?'':'ghost'}" data-obl="${l[0]}">${l[1]}</button>`).join('')}</div>`,
  bind:b=>$$('[data-obl]',b).forEach(x=>x.onclick=()=>{const v=x.dataset.obl;if(v===S.lang){obNext();return}S.lang=v;saveS();store.set('ob_step',2);location.reload()}),ok:()=>true},
 {id:'loc',voice:'ob_loc',req:true,
  title:T('2. Aap kahan hain? (Location)','2. Where are you? (Location)','۲۔ آپ کہاں ہیں؟ (لوکیشن)','2. आप कहाँ हैं? (लोकेशन)'),
  body:T('Namaz ke sahi waqt aap ke apne shehar ke hisaab se nikalte hain. Neeche GPS dabayein — ya shehar ka naam likhein.','Prayer times are calculated for your own city. Tap GPS below — or type your city.','نماز کے صحیح اوقات آپ کے اپنے شہر کے حساب سے نکلتے ہیں۔ نیچے GPS دبائیں — یا شہر کا نام لکھیں۔','नमाज़ के सही वक़्त आपके अपने शहर के हिसाब से निकलते हैं। नीचे GPS दबाएँ — या शहर का नाम लिखें।'),
  box:()=>`<button class="btn full" id="obgps">📍 ${T('GPS se meri location','Use my GPS location','GPS سے میری لوکیشن','GPS से मेरी लोकेशन')}</button>
   <div class="muted sm c" style="margin:8px 0">— ${T('ya','or','یا','या')} —</div>
   <div class="grid2"><div><label for="obcity">${T('Shehar','City','شہر','शहर')}</label><input id="obcity" value="${esc(S.lat==null?S.city:'')}" autocomplete="off"></div><div><label for="obcountry">${T('Mulk','Country','ملک','देश')}</label><input id="obcountry" value="${esc(S.country||'India')}" autocomplete="off"></div></div>
   <button class="btn ghost full mt" id="obcityb">${T('Shehar se set karein','Set from city','شہر سے سیٹ کریں','शहर से सेट करें')}</button><div id="obls" class="mt"></div>`,
  bind:b=>{const st=()=>{const el=$('#obls',b);if(!el)return;el.innerHTML=(TM&&!TM.stale&&(S.lat!=null||S.city))?`<div class="okbox">✅ ${S.lat!=null?T('Location mil gayi','Location found','لوکیشن مل گئی','लोकेशन मिल गई'):esc(S.city)} • Fajr ${t12(TM.t.Fajr)} • Maghrib ${t12(TM.t.Maghrib)}</div>`:''};
    $('#obgps',b).onclick=()=>{if(!navigator.geolocation){toast(T('GPS support nahi — shehar likhein','No GPS — type your city'));return}$('#obls',b).innerHTML=`<div class="muted sm c">⏳ ${T('Location dhundh raha hoon…','Locating…','لوکیشن ڈھونڈ رہا ہوں…','लोकेशन ढूँढ रहा हूँ…')}</div>`;
      navigator.geolocation.getCurrentPosition(async p=>{S.lat=p.coords.latitude;S.lng=p.coords.longitude;S.autoLoc=true;saveS();try{await loadTimes(true)}catch(e){}st();if(!TM)$('#obls',b).innerHTML=`<div class="warnbox">${T('Internet nahi mila — namaz ke waqt load nahi hue. Internet on karke dobara dabayein.','No internet — prayer times not loaded. Turn on internet and try again.','انٹرنیٹ نہیں ملا — نماز کے اوقات لوڈ نہیں ہوئے۔ انٹرنیٹ آن کر کے دوبارہ دبائیں۔','इंटरनेट नहीं मिला — नमाज़ के वक़्त लोड नहीं हुए। इंटरनेट ऑन करके दोबारा दबाएँ।')}</div>`;obRefresh()},
        ()=>{$('#obls',b).innerHTML=`<div class="warnbox">${T('Location ki ijazat nahi mili — neeche shehar ka naam likh dein.','Location permission denied — type your city below.','لوکیشن کی اجازت نہیں ملی — نیچے شہر کا نام لکھ دیں۔','लोकेशन की इजाज़त नहीं मिली — नीचे शहर का नाम लिख दें।')}</div>`},{timeout:14000,enableHighAccuracy:true})};
    $('#obcityb',b).onclick=async()=>{const c=$('#obcity',b).value.trim();if(!c){toast(T('Shehar ka naam likhein','Enter a city'));return}S.city=c;S.country=$('#obcountry',b).value.trim()||'India';S.lat=null;S.lng=null;saveS();$('#obls',b).innerHTML=`<div class="muted sm c">⏳ …</div>`;try{await loadTimes(true)}catch(e){}st();if(!TM||TM.stale)$('#obls',b).innerHTML=`<div class="warnbox">${T('Yeh shehar nahi mila ya internet nahi hai.','City not found or no internet.','یہ شہر نہیں ملا یا انٹرنیٹ نہیں ہے۔','यह शहर नहीं मिला या इंटरनेट नहीं है।')}</div>`;obRefresh()};st()},
  ok:()=>!!(TM&&!TM.stale&&(S.lat!=null||S.city))},
 {id:'maslak',voice:'ob_maslak',req:true,
  title:T('3. Aap ka maslak','3. Your school of thought','۳۔ آپ کا مسلک','3. आपका मसलक'),
  body:T('Isi se Asr ka waqt aur masail ka andaaz tay hoga. (Hanafi mein Asr thodi der se shuru hoti hai.)','This decides the Asr time and the style of rulings. (In Hanafi, Asr starts later.)','اسی سے عصر کا وقت اور مسائل کا انداز طے ہوگا۔ (حنفی میں عصر ذرا دیر سے شروع ہوتی ہے۔)','इसी से अस्र का वक़्त और मसाइल का अंदाज़ तय होगा। (हनफ़ी में अस्र थोड़ी देर से शुरू होती है।)'),
  box:()=>`<div class="obopts">${MASLAK.map(m=>`<button class="obopt ${S.maslak===m[0]?'on':''}" data-m="${m[0]}">${({hanafi:T('Hanafi','Hanafi','حنفی','हनफ़ी'),shafii:T("Shafi'i","Shafi'i",'شافعی','शाफ़ई'),maliki:T('Maliki','Maliki','مالکی','मालिकी'),hanbali:T('Hanbali','Hanbali','حنبلی','हंबली'),ahlehadees:T('Ahl-e-Hadees','Ahl-e-Hadees','اہلِ حدیث','अहल-ए-हदीस')})[m[0]]||T('Aur / batana nahi chahta','Other / prefer not to say','دیگر / بتانا نہیں چاہتا','अन्य / बताना नहीं चाहता')}</button>`).join('')}</div>`,
  bind:b=>$$('[data-m]',b).forEach(x=>x.onclick=async()=>{S.maslak=x.dataset.m;S.school=S.maslak==='hanafi'?1:0;if(S.maslak!=='hanafi'&&S.maslak!=='other')S.firqa='any';saveS();$$('[data-m]',b).forEach(y=>y.classList.toggle('on',y===x));try{await loadTimes(true)}catch(e){}obRefresh()}),ok:()=>!!S.maslak},
 {id:'firqa',voice:'ob_firqa',req:true,skipIf:()=>S.maslak&&S.maslak!=='hanafi'&&S.maslak!=='other',
  title:T('4. Aap ka maktab-e-fikr','4. Your school (Deobandi / Barelvi)','۴۔ آپ کا مکتبِ فکر','4. आपका मकतब-ए-फ़िक्र'),
  body:T('Isi ke hisaab se kitabein aur amaal dikhenge. Quran, mashhoor hadees aur namaz sab ke liye ek jaise hain. Yeh sirf aap ke phone mein rehta hai, kabhi bhi Settings se badal sakte hain.','Books and practices are shown accordingly. Quran, the famous hadith books and prayer are the same for everyone. This stays only on your phone; change it anytime in Settings.','اسی کے حساب سے کتابیں اور اعمال دکھیں گے۔ قرآن، مشہور حدیثیں اور نماز سب کے لیے ایک جیسے ہیں۔ یہ صرف آپ کے فون میں رہتا ہے، کبھی بھی سیٹنگز سے بدل سکتے ہیں۔','इसी के हिसाब से किताबें और आमाल दिखेंगे। क़ुरआन, मशहूर हदीसें और नमाज़ सब के लिए एक जैसे हैं। यह सिर्फ़ आपके फ़ोन में रहता है, कभी भी सेटिंग्स से बदल सकते हैं।'),
  box:()=>`<div class="obopts">${FIRQA.map(m=>`<button class="obopt ${S.firqa===m[0]?'on':''}" data-fq="${m[0]}">${m[1]()}</button>`).join('')}</div>`,
  bind:b=>$$('[data-fq]',b).forEach(x=>x.onclick=()=>{S.firqa=x.dataset.fq;saveS();$$('[data-fq]',b).forEach(y=>y.classList.toggle('on',y===x));obRefresh()}),ok:()=>!!S.firqa},
 {id:'masjid',voice:'ob_masjid',req:false,
  title:T('5. Aap ki masjid','5. Your masjid','۵۔ آپ کی مسجد','5. आपकी मस्जिद'),
  body:T('Masjid ka naam aur jamaat ke waqt bharein — notification usi hisaab se aayegi, aur jamaat se pehle “kya masjid mein dakhil ho gaye?” poochha jayega. Baad mein Namaz tab se bhi bhar sakte hain.','Enter your masjid name and jamaat times — alerts will follow them, and before jamaat you will be asked “did you enter the masjid?”. You can also do this later from the Namaz tab.','مسجد کا نام اور جماعت کے اوقات بھریں — نوٹیفکیشن اسی حساب سے آئے گا، اور جماعت سے پہلے “کیا مسجد میں داخل ہو گئے؟” پوچھا جائے گا۔ بعد میں نماز ٹیب سے بھی بھر سکتے ہیں۔','मस्जिद का नाम और जमात के वक़्त भरें — नोटिफ़िकेशन उसी हिसाब से आएगा, और जमात से पहले “क्या मस्जिद में दाख़िल हो गए?” पूछा जाएगा। बाद में नमाज़ टैब से भी भर सकते हैं।'),
  box:()=>{const M=S.masjid;return`<label for="obmn">${T('Masjid ka naam','Masjid name','مسجد کا نام','मस्जिद का नाम')}</label><input id="obmn" value="${esc(M.name)}" autocomplete="off">
   <div class="mrow mh"><span></span><span>${T('Jamaat ka waqt','Jamaat time','جماعت کا وقت','जमात का वक़्त')}</span></div>${PRAY.map(p=>`<div class="mrow"><b>${pname(p)}</b><input type="time" id="obj_${p}" value="${M.jm[p]||''}"></div>`).join('')}<div class="mrow"><b>${T('Jumma','Jumma','جمعہ','जुमा')}</b><input type="time" id="obj_ju" value="${M.ju||''}"></div>`},
  save:()=>{const M=S.masjid;M.name=($('#obmn')||{}).value?$('#obmn').value.trim():M.name;PRAY.forEach(p=>{const e=$('#obj_'+p);if(e){if(hm(e.value))M.jm[p]=e.value;else delete M.jm[p]}});const j=$('#obj_ju');if(j)M.ju=hm(j.value)?j.value:'';saveS()},ok:()=>true},
 {id:'notif',voice:'ob_notif',req:true,
  title:T('6. Notification ki ijazat','6. Notification permission','۶۔ نوٹیفکیشن کی اجازت','6. नोटिफ़िकेशन की इजाज़त'),
  body:T('Namaz, azaan, sadqa aur duaon ki yaad-dahani ke liye. Ijazat dene wala button dabayein — phir phone jo poochhe usme “Allow” karein.','For prayer, adhan, sadaqah and dua reminders. Tap the button, then press “Allow” on the phone prompt.','نماز، اذان، صدقہ اور دعاؤں کی یاد دہانی کے لیے۔ اجازت والا بٹن دبائیں — پھر فون جو پوچھے اس میں “Allow” کریں۔','नमाज़, अज़ान, सदक़ा और दुआओं की याद-दिहानी के लिए। इजाज़त वाला बटन दबाएँ — फिर फ़ोन जो पूछे उसमें “Allow” करें।'),
  box:()=>`<button class="btn gold full" id="obnb">🔔 ${T('Ijazat dein','Allow notifications','اجازت دیں','इजाज़त दें')}</button><div id="obns" class="mt">${S.obNotif?`<div class="okbox">✅ ${T('Ijazat maangi ja chuki hai','Permission requested','اجازت مانگی جا چکی ہے','इजाज़त माँगी जा चुकी है')}</div>`:''}</div>
   <div class="fs mt"><span>${T('Waqt shuru hote hi notification','Notify when prayer time begins','وقت شروع ہوتے ہی نوٹیفکیشن','वक़्त शुरू होते ही नोटिफ़िकेशन')}</span><input type="checkbox" class="sw" id="obw" ${S.waqtNotif!==false?'checked':''}></div>
   <div class="fs"><span>${T('Azaan par notification + awaaz','Adhan notification + voice','اذان پر نوٹیفکیشن + آواز','अज़ान पर नोटिफ़िकेशन + आवाज़')}</span><input type="checkbox" class="sw" id="oba" ${S.azan?'checked':''}></div>`,
  bind:b=>{$('#obnb',b).onclick=async()=>{try{await askNotifPerm()}catch(e){}S.obNotif=1;saveS();$('#obns',b).innerHTML=`<div class="okbox">✅ ${T('Ijazat maangi ja chuki hai','Permission requested','اجازت مانگی جا چکی ہے','इजाज़त माँगी जा चुकी है')}</div>`;obRefresh()};
    $('#obw',b).onchange=e=>{S.waqtNotif=e.target.checked;saveS()};$('#oba',b).onchange=e=>{S.azan=e.target.checked;saveS()}},
  ok:()=>!!S.obNotif},
 {id:'target',voice:'ob_target',req:false,
  title:T('7. Roz ke target','7. Daily targets','۷۔ روز کے اہداف','7. रोज़ के लक्ष्य'),
  body:T('Chhote target rakhein, par roz poore karein. Baad mein kabhi bhi badal sakte hain.','Keep small targets, but meet them daily. You can change them any time.','چھوٹے اہداف رکھیں، مگر روز پورے کریں۔ بعد میں کبھی بھی بدل سکتے ہیں۔','छोटे लक्ष्य रखें, मगर रोज़ पूरे करें। बाद में कभी भी बदल सकते हैं।'),
  box:()=>`<label>🤲 ${T('Roz ka sadqa (₹)','Daily sadaqah (₹)','روز کا صدقہ (₹)','रोज़ का सदक़ा (₹)')}</label><input id="obsd" type="number" inputmode="decimal" value="${S.sadqaAmt||''}" placeholder="0">
   <div class="chips">${[10,20,50,100].map(v=>`<button class="chip btnchip" data-sd="${v}">₹${v}</button>`).join('')}</div>
   <label style="margin-top:12px">📖 ${T('Roz ki tilawat (ayaat)','Daily recitation (ayahs)','روز کی تلاوت (آیات)','रोज़ की तिलावत (आयात)')}</label><input id="obtl" type="number" inputmode="numeric" value="${S.tilTarget||20}">
   <div class="chips">${[5,10,20,50].map(v=>`<button class="chip btnchip" data-tl="${v}">${v}</button>`).join('')}</div>`,
  bind:b=>{$$('[data-sd]',b).forEach(x=>x.onclick=()=>{$('#obsd',b).value=x.dataset.sd});$$('[data-tl]',b).forEach(x=>x.onclick=()=>{$('#obtl',b).value=x.dataset.tl})},
  save:()=>{const a=+(($('#obsd')||{}).value||0),t=+(($('#obtl')||{}).value||0);S.sadqaAmt=Math.max(0,a||0);if(t>0)S.tilTarget=Math.round(t);saveS()},ok:()=>true},
 {id:'done',voice:'ob_done',req:false,hideChip:true,
  title:T('Mashaallah! Setup poora 🎉','Mashaallah! Setup complete 🎉','ماشاءاللہ! سیٹ اپ مکمل 🎉','माशाअल्लाह! सेटअप पूरा 🎉'),
  body:T('Ab aap ka Deen Saathi taiyaar hai. Home par aaj ka sadqa, tilawat aur namaz ke amaal dikhenge. Har tab par pehli baar ek chhota guide aayega.','Your Deen Saathi is ready. Home shows today\'s sadaqah, recitation and prayer deeds. A short guide will appear the first time you open each tab.','اب آپ کا دین ساتھی تیار ہے۔ ہوم پر آج کا صدقہ، تلاوت اور نماز کے اعمال دکھیں گے۔ ہر ٹیب پر پہلی بار ایک چھوٹی رہنمائی آئے گی۔','अब आपका दीन साथी तैयार है। होम पर आज का सदक़ा, तिलावत और नमाज़ के आमाल दिखेंगे। हर टैब पर पहली बार एक छोटी गाइड आएगी।'),
  box:()=>`<div class="obsum">${[['📍',S.lat!=null?T('GPS location','GPS location'):(S.city||'—')],['🕌',(MASLAK.find(m=>m[0]===S.maslak)||[0,'—'])[1]||T('Aur','Other')],['🏠',S.masjid.name||T('Masjid: baad mein','Masjid: later')],['🔔',S.obNotif?T('Notification: maangi','Notifications: requested'):'—'],['🤲',S.sadqaAmt>0?'₹'+S.sadqaAmt+' / '+T('din','day'):T('Sadqa target: baad mein','Sadaqah target: later')],['📖',S.tilTarget+' '+T('ayaat/din','ayahs/day')]].map(x=>`<div><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}</div>`,ok:()=>true}])}
const obFilt=a=>a.filter(x=>!(x.skipIf&&x.skipIf()));
function obRefresh(){const s=OB.steps[OB.i],n=$('#obnext'),ok=(s.ok?s.ok():true);if(n)n.disabled=!ok;const h=$('#obhint');if(h)h.hidden=ok}
function obDraw(){
  const ov=$('#ob')||(()=>{const d=document.createElement('div');d.id='ob';document.body.appendChild(d);return d})();OB.open=true;
  const s=OB.steps[OB.i],last=OB.i===OB.steps.length-1,tot=OB.steps.length;
  ov.innerHTML=`<div class="obwrap"><div class="obtop"><div class="obdots">${OB.steps.map((_,k)=>`<i class="${k<OB.i?'d':k===OB.i?'a':''}"></i>`).join('')}</div><button class="btn s ghost" id="obvo" aria-label="voice">🔊</button></div>
   <div class="obcard"><div class="row sp">${s.hideChip?'<span></span>':obChip(s.req)}<span class="muted sm">${OB.i>0&&!last?OB.i+'/'+(tot-2):''}</span></div>
   <h1 class="obh">${s.title}</h1><p class="obp">${esc(s.body)}</p>
   <div class="obbox ${s.req?'req':''}" id="obbox">${s.box()}</div><div id="obhint" class="obhint" hidden>⭐ ${T('Aage badhne ke liye yeh zaroori kaam poora karein.','Complete this mandatory step to continue.','آگے بڑھنے کے لیے یہ ضروری کام پورا کریں۔','आगे बढ़ने के लिए यह ज़रूरी काम पूरा करें।')}</div></div>
   <div class="obnav">${OB.i>0?`<button class="btn ghost" id="obprev">← ${T('Peeche','Back','پیچھے','पीछे')}</button>`:'<span></span>'}${!s.req&&!s.hideChip?`<button class="btn ghost" id="obskip">${T('Chhodein','Skip','چھوڑیں','छोड़ें')}</button>`:''}<button class="btn gold" id="obnext">${last?T('Shuru karein 🚀','Start 🚀','شروع کریں 🚀','शुरू करें 🚀'):T('Aage →','Next →','آگے →','आगे →')}</button></div></div>`;
  const box=$('#obbox');if(s.bind)s.bind(box);
  $('#obnext').onclick=()=>obNext();const p=$('#obprev');if(p)p.onclick=obPrev;const k=$('#obskip');if(k)k.onclick=()=>obNext(true);$('#obvo').onclick=()=>VO.say(s.voice);
  obRefresh();clearInterval(OB.t);OB.t=setInterval(()=>{if(OB.open)obRefresh()},900);ov.scrollTop=0;sfx('pop');setTimeout(()=>VO.say(s.voice),350);store.set('ob_step',OB.i)}
function obNext(skipped){const s=OB.steps[OB.i];if(!skipped&&s.save)s.save();if(skipped&&s.id==='masjid'){}
  if(!(s.ok?s.ok():true)){toast(T('Pehle yeh ⭐ zaroori kaam poora karein','Please complete this ⭐ mandatory step first'));return}
  if(OB.i>=OB.steps.length-1){obFinish();return}OB.i++;OB.steps=obSteps();obDraw()}
function obPrev(){if(OB.i>0){OB.i--;OB.steps=obSteps();obDraw()}}
function obFinish(){clearInterval(OB.t);VO.stop();S.obDone=true;S.setupDone=true;saveS();store.set('ob_step',0);OB.open=false;const ov=$('#ob');if(ov){ov.classList.add('out');setTimeout(()=>ov.remove(),500)}
  sfx('success');try{schedTick();nativeSync()}catch(e){}go('home');toast(T('Mashaallah! Deen Saathi taiyaar hai 🌙','Mashaallah! Deen Saathi is ready 🌙','ماشاءاللہ! دین ساتھی تیار ہے 🌙','माशा अल्लाह! दीन साथी तैयार है 🌙'));rerender()}
function obStart(step){OB.steps=obSteps();OB.i=Math.min(step||0,OB.steps.length-1);obDraw()}
function waitSplash(cb){const t=setInterval(()=>{const sp=document.getElementById('splash');if(sp)return;clearInterval(t);cb()},300)}
firstRun=function(){if(S.obDone)return;waitSplash(()=>{if(typeof LCK!=='undefined'&&LCK.locked){const t=setInterval(()=>{if(!LCK.locked){clearInterval(t);obStart(store.get('ob_step',0))}},500);return}obStart(store.get('ob_step',0))})};
AX.obredo=()=>{store.set('ob_step',0);obStart(0)};
function obPendingCard(){if(S.obDone)return'';return`<div class="card hero"><div class="row"><div class="grow"><b>🕌 ${T('Setup adhoora hai','Setup is incomplete','سیٹ اپ ادھورا ہے','सेटअप अधूरा है')}</b><div class="muted sm">${T('Location aur maslak bharein — phir namaz ke sahi waqt aur notification milenge.','Add location and maslak to get correct prayer times and alerts.','لوکیشن اور مسلک بھریں — پھر نماز کے صحیح اوقات اور نوٹیفکیشن ملیں گے۔','लोकेशन और मसलक भरें — फिर नमाज़ के सही वक़्त और नोटिफ़िकेशन मिलेंगे।')}</div></div><button class="btn s gold" data-a="obredo">${T('Shuru','Start','شروع','शुरू')}</button></div></div>`}
(function(){const _b=NAV.back;NAV.back=function(){if(OB.open){if(OB.i>0)obPrev();return true}return _b.call(NAV)}})();

/* ---------- 3. First-time guide on every tab ---------- */
const COACH={
 'home':null,
 'deen/namaz':0,'deen/quran':0,'deen/azkar':0,'deen/kutub':0,'kaam/tasks':0,'kaam/paisa':0,'more/tools':0,'more/noor':0,'more/support':0,'more/set':0,
 'kaam/calls':[T('Calls','Calls','کالز','कॉल्स'),T('Kisi se baat karni ho ya follow-up lena ho to yahan likhein; waqt par yaad dilayenge.','Note calls and follow-ups here; we will remind you on time.','کسی سے بات کرنی ہو یا فالو اپ لینا ہو تو یہاں لکھیں؛ وقت پر یاد دلائیں گے۔','किसी से बात करनी हो या फ़ॉलो-अप लेना हो तो यहाँ लिखें; वक़्त पर याद दिलाएँगे।')],
 'kaam/waqt':[T('Waqt aur routine','Time & routine','وقت اور معمول','वक़्त और रूटीन'),T('Timer, nafil aur roz ke mamool yahan sambhalein.','Manage timers and daily routines here.','ٹائمر اور روز کے معمولات یہاں سنبھالیں۔','टाइमर और रोज़ के मामूलात यहाँ संभालें।')]};
function coachFor(key){const c=COACH[key];if(Array.isArray(c))return c;const tab=key.split('/')[0],sub=key.split('/')[1];const st=TOUR_STEPS().find(x=>x.tab===tab&&(x.sub||'')===(sub||''));return st?[st.t,st.d]:null}
function coachInject(){
  if(!S.obDone||OB.open||(typeof TOUR!=='undefined'&&TOUR.on))return;const sub=SUBS[curTab]?subOf():'';const key=curTab==='home'?'home':curTab+'/'+sub;if(key==='home')return;
  const seen=store.get('coach',{});if(seen[key])return;const c=coachFor(key);if(!c)return;const el=$('#sub');if(!el||el.querySelector('.coach'))return;
  el.insertAdjacentHTML('afterbegin',`<div class="card coach"><div class="row"><div class="grow"><div class="eyebrow">💡 ${T('PEHLI BAAR — YEH KYA HAI','FIRST TIME — WHAT IS THIS','پہلی بار — یہ کیا ہے','पहली बार — यह क्या है')}</div><b>${c[0]}</b><div class="muted sm" style="margin-top:3px">${esc(c[1])}</div></div></div><button class="btn s mt" data-a="coachok" data-k="${key}">${T('Samajh gaya ✅','Got it ✅','سمجھ گیا ✅','समझ गया ✅')}</button></div>`)}
A.coachok=el=>{const seen=store.get('coach',{});seen[el.dataset.k]=1;store.set('coach',seen);const c=el.closest('.coach');if(c)c.remove();sfx('tick')};
(function(){const _rr=rerender;rerender=async function(a){const r=await _rr(a);try{coachInject()}catch(e){}return r}})();

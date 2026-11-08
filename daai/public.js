'use strict';
/* ===== Deen Saathi by Quranic Science — public edition layer =====
   Home, Tools (Zakat / Roza / Hijri / 99 Names / my business), Support, Brands card,
   website bar, Quran settings on top, masjid-entry reminder, native answer sync.
   Loaded after every other script, so it can safely re-define earlier functions. */

const QS_SITE='https://quranicscience.info';
const QS_UPI='7387618313@kotak811',QS_PN='ARSALANAHMED SHAIKH',QS_PH='919272527913',QS_PH_SHOW='+91 92725 27913';
const QS_LINKS=[['wb','Website',QS_SITE],['fb','Facebook','https://www.facebook.com/share/16J4k6RuE7n/'],['yt','YouTube','https://www.youtube.com/@quranicscienceofficial01'],['ig','Instagram','https://www.instagram.com/quranicscienceofficial/'],['wa','WhatsApp','https://wa.me/'+QS_PH]];
const ext=(u,cls,inner,attr='')=>`<a ${cls?`class="${cls}"`:''} href="${u}" target="_blank" rel="noopener" ${attr}>${inner}</a>`;

/* ---------- 0. make it a clean public app (no personal modules) ---------- */
(function neutralise(){
  ['tipEvents','dutyEvents','salEvents','jmaEvents','pexEvents'] /* cev/wk/report: Dawat (Deobandi) ke liye firqa.js gate karta hai */.forEach(n=>{window[n]=()=>[]});
  S.name='';S.job=Object.assign({},S.job,{on:false,co:''});S.fbOn=false;
  if(S.sadqaPct==null)S.sadqaPct=2.5;
  if(!S.pubInit){S.mamool='';S.pubInit=1} /* 'deeni mamool' reminder is opt-in for the public */
  try{saveS()}catch(e){}
})();
/* one optional business only: the user's own */
function pubBizSync(){try{BIZ.length=0;const b=S.myBiz;if(b&&b.on)BIZ.push({id:'mine',name:b.name||T('Mera Kaarobar','My business'),tag:T('Mera apna kaarobar','My own business'),icon:'logos/qs.webp',color:'#19c6f0',site:'',cur:'₹'})}catch(e){}}
pubBizSync();
(function(){const _fa=finAdd;finAdd=function(o){o=Object.assign({},o);o.biz=o.biz||'personal';return _fa(o)}})();
/* old first-run card is replaced by the new wizard */
setupCard=()=>'';

/* ---------- helpers ---------- */
function pubCopy(txt){const ok=()=>toast(T('Copy ho gaya ✅','Copied ✅','کاپی ہو گیا ✅','कॉपी हो गया ✅'));
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,()=>fb());return}}catch(e){}
  fb();function fb(){try{const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();ok()}catch(e){toast(txt)}}}
const rupee=n=>'₹'+num(n);
const logoBox=(src,sz=46)=>`<img src="${src}" alt="" width="${sz}" height="${sz}" style="width:${sz}px;height:${sz}px;border-radius:${Math.round(sz*.28)}px;object-fit:cover;background:#fff" loading="lazy">`;

/* ---------- 1. website bar: big button under the header on every tab ---------- */
(function siteBar(){
  const h=document.querySelector('header');if(!h||document.getElementById('siteBar'))return;
  const d=document.createElement('div');d.id='siteBar';
  d.innerHTML=ext(QS_SITE,'sitebtn',`<img src="logos/qs.webp" alt="" width="26" height="26"><span><b>${T('Quranic Science ki website kholein','Open the Quranic Science website','قرآنک سائنس کی ویب سائٹ کھولیں','Quranic Science की वेबसाइट खोलें')}</b><small>${T('Arabi aur Tajweed seekhne ke liye visit karein','Visit to learn Arabic and Tajweed','عربی اور تجوید سیکھنے کے لیے وزٹ کریں','अरबी और तजवीद सीखने के लिए विज़िट करें')} • quranicscience.info</small></span><i>↗</i>`);
  h.insertAdjacentElement('afterend',d);
})();

/* ---------- 2. Brands card (ONE button -> the website; explore from there) ---------- */
function brandsCard(){
  const item=(img,n,d)=>`<div class="brd">${logoBox('logos/'+img,48)}<b>${n}</b><small>${d}</small></div>`;
  return`<div class="card brands"><h2>🛍️ ${T('Hamare Brands','Our Brands','ہمارے برانڈز','हमारे ब्रांड्स')}</h2>
  <div class="brdrow">${item('aa.webp','Al Aswad Dubai',T('Dubai ke khushbu / perfume','Dubai perfumes','دبئی کے پرفیوم','दुबई के परफ़्यूम'))}${item('sk.webp','ScentKart',T('Attar aur perfume','Attar & perfumes','عطر اور پرفیوم','अत्तर और परफ़्यूम'))}${item('bn.webp','Bareerah Naturals',T('Sunnat wali natural cheezein','Natural Sunnah products','سنت والی قدرتی چیزیں','सुन्नत वाली नैचुरल चीज़ें'))}</div>
  ${ext(QS_SITE,'btn gold full mt',`🛒 ${T('Order / Explore karein','Order / Explore','آرڈر / دیکھیں','ऑर्डर / एक्सप्लोर करें')}`)}
  <div class="muted sm c mt">${T('Order sirf hamari official website se — wahin se sab kuch dekh lein.','Orders only through our official website — browse everything there.','آرڈر صرف ہماری آفیشل ویب سائٹ سے — وہیں سب کچھ دیکھ لیں۔','ऑर्डर सिर्फ़ हमारी आधिकारिक वेबसाइट से — वहीं सब कुछ देख लें।')}</div></div>`}

/* ---------- 3. Support card ---------- */
function supportMsg(){
  const p1=T(
   'Assalamu Alaikum! Yeh app Quranic Science ki taraf se aap ke liye bilkul muft hai — na koi fees, na ads, na subscription. Hamari koshish hai ke har Musalman ke haath mein namaz, Quran aur deen ki madad ek hi jagah ho.',
   'Assalamu Alaikum! This app is completely free for you from Quranic Science — no fees, no ads, no subscription. Our wish is that every Muslim has prayer, Quran and deeni help in one place.',
   'السلام علیکم! یہ ایپ قرآنک سائنس کی طرف سے آپ کے لیے بالکل مفت ہے — نہ کوئی فیس، نہ اشتہار، نہ سبسکرپشن۔ ہماری کوشش ہے کہ ہر مسلمان کے ہاتھ میں نماز، قرآن اور دین کی مدد ایک ہی جگہ ہو۔',
   'अस्सलामु अलैकुम! यह ऐप Quranic Science की तरफ़ से आपके लिए बिल्कुल मुफ़्त है — न कोई फ़ीस, न विज्ञापन, न सब्सक्रिप्शन। हमारी कोशिश है कि हर मुसलमान के हाथ में नमाज़, क़ुरआन और दीन की मदद एक ही जगह हो।');
  const p2=T(
   'Ise chalane, naye features banane aur awaaz / server ke kharch ke liye hamein aap ki duaon ke saath madad ki bhi zaroorat hai. Agar app pasand aaye to hadiya ke taur par jitna ho sake bhej dein — chhoti si raqam bhi hamare liye bohat badi hai, aur Allah ke yahan iska bada ajr insha-Allah.',
   'To keep it running, build new features and pay for voices and servers we need your duas — and your support. If you like the app, please send a hadiya as much as you can. Even a small amount means a lot to us, and its reward with Allah is great, insha-Allah.',
   'اسے چلانے، نئے فیچرز بنانے اور آواز/سرور کے خرچ کے لیے ہمیں آپ کی دعاؤں کے ساتھ تعاون کی بھی ضرورت ہے۔ اگر ایپ پسند آئے تو ہدیہ کے طور پر جتنا ہو سکے بھیج دیں — چھوٹی سی رقم بھی ہمارے لیے بہت بڑی ہے، اور اللہ کے ہاں اس کا بڑا اجر ان شاء اللہ۔',
   'इसे चलाने, नए फ़ीचर बनाने और आवाज़/सर्वर के ख़र्च के लिए हमें आपकी दुआओं के साथ सहयोग की भी ज़रूरत है। अगर ऐप पसंद आए तो हदिया के तौर पर जितना हो सके भेज दें — छोटी सी रक़म भी हमारे लिए बहुत बड़ी है, और अल्लाह के यहाँ इसका बड़ा अज्र इंशा-अल्लाह।');
  const p3=T(
   'Zaroori: hum app ke zariye sadqa ya zakat nahi lete. Sadqa / zakat ke liye humse WhatsApp par rabta karein, ya apne haath se kisi haqdaar ko dein.',
   'Important: we do not collect sadaqah or zakat through the app. For sadaqah / zakat, contact us on WhatsApp, or give it by your own hand to someone deserving.',
   'اہم: ہم ایپ کے ذریعے صدقہ یا زکوٰۃ وصول نہیں کرتے۔ صدقہ / زکوٰۃ کے لیے واٹس ایپ پر رابطہ کریں، یا خود اپنے ہاتھ سے کسی حقدار کو دیں۔',
   'ज़रूरी: हम ऐप के ज़रिए सदक़ा या ज़कात नहीं लेते। सदक़ा / ज़कात के लिए व्हाट्सऐप पर संपर्क करें, या ख़ुद अपने हाथ से किसी हक़दार को दें।');
  return{p1,p2,p3}}
function socialRow(sz=44){return`<div class="soc">${QS_LINKS.map(([k,n,u])=>ext(u,'socb',`<img src="${k==='wb'?'logos/qs.webp':'logos/ln_'+k+'.svg'}" alt="${n}" width="${sz}" height="${sz}" style="width:${sz}px;height:${sz}px;object-fit:cover">`,`aria-label="${n}"`)).join('')}</div>`}
function renderSupport(el){
  const m=supportMsg();
  el.innerHTML=`<div class="card hero sup"><div class="c">${logoBox('logos/qs.webp',72)}<h2 style="margin:10px 0 2px;font-size:19px;letter-spacing:0;text-transform:none;font-family:inherit">Deen Saathi <span class="muted">by</span> Quranic Science</h2><div class="chip ok">${T('100% muft','100% free','100% مفت','100% मुफ़्त')}</div></div>
    <p class="supt">${esc(m.p1)}</p><p class="supt">${esc(m.p2)}</p></div>
  <div class="card"><h2>❤️ ${T('Hadiya bhejein','Send a hadiya','ہدیہ بھیجیں','हदिया भेजें')}</h2>
    <div class="c"><img class="qrimg" src="qr.png" alt="UPI QR" width="190" height="190"><div class="qrn">${QS_PN}</div>
    <div class="muted sm">UPI: <b dir="ltr">${QS_UPI}</b></div></div>
    <div class="grid2 mt"><a class="btn gold" href="upi://pay?pa=${QS_UPI}&pn=${encodeURIComponent(QS_PN)}&cu=INR">📲 ${T('UPI app se bhejein','Pay with UPI app','UPI ایپ سے بھیجیں','UPI ऐप से भेजें')}</a><button class="btn ghost" data-a="pubcopy" data-v="${QS_UPI}">📋 ${T('UPI ID copy','Copy UPI ID','UPI ID کاپی','UPI ID कॉपी')}</button></div>
    <p class="muted sm mt">${T('QR ko kisi bhi UPI app (PhonePe, GPay, Paytm…) se scan karke bhi bhej sakte hain.','You can also scan this QR with any UPI app (PhonePe, GPay, Paytm…).','آپ اس QR کو کسی بھی UPI ایپ (PhonePe, GPay, Paytm…) سے اسکین بھی کر سکتے ہیں۔','आप इस QR को किसी भी UPI ऐप (PhonePe, GPay, Paytm…) से स्कैन भी कर सकते हैं।')}</p></div>
  <div class="card warnsd"><div class="supt" style="margin:0">⚠️ ${esc(m.p3)}</div>
    ${ext('https://wa.me/'+QS_PH+'?text='+encodeURIComponent('Assalamu Alaikum, Deen Saathi app ke baare mein / sadqa-zakat ke liye rabta kar raha hoon.'),'btn full mt',`💬 ${T('WhatsApp par rabta karein','Contact on WhatsApp','واٹس ایپ پر رابطہ کریں','व्हाट्सऐप पर संपर्क करें')} — ${QS_PH_SHOW}`)}</div>
  <div class="card"><h2>🌐 ${T('Hamse jude rahein','Stay connected','ہم سے جڑے رہیں','हमसे जुड़े रहें')}</h2>${socialRow(46)}
    ${ext(QS_SITE,'btn full mt',`🌐 ${T('Website kholein','Open website','ویب سائٹ کھولیں','वेबसाइट खोलें')} — quranicscience.info`)}</div>
  ${brandsCard()}
  <div class="muted sm c" style="padding:6px 8px 18px">Deen Saathi by Quranic Science • v1.0<br>${T('Jazakumullahu khairan 🤲','Jazakumullahu khairan 🤲','جزاکم اللہ خیراً 🤲','जज़ाकुमुल्लाहु ख़ैरन 🤲')}</div>`}
A.pubcopy=el=>pubCopy(el.dataset.v);
function supportMini(){return`<div class="card supmini"><div class="row"><div class="grow"><b>❤️ ${T('Yeh app muft hai','This app is free','یہ ایپ مفت ہے','यह ऐप मुफ़्त है')}</b><div class="muted sm">${T('Pasand aaye to hadiya se madad karein.','If you like it, support us with a hadiya.','پسند آئے تو ہدیہ سے مدد کریں۔','पसंद आए तो हदिया से मदद करें।')}</div></div><button class="btn s gold" data-a="tab" data-v="more" data-s="support">${T('Support','Support','سپورٹ','सपोर्ट')}</button></div></div>`}

/* ---------- 4. Home ---------- */
function weekReport(){
  const hs=hzStats(7);let tl=0,azd=0,sdd=0,perfect=0,streak=0;
  for(let i=0;i<7;i++){const k=dkey(addDays(new Date(),-i));tl+=TL.days[k]||0;const a=AZ[k]||{};if(Object.values(a).some(v=>v>=100))azd++;if(sdDone(k))sdd++;if(hzScore(k)===5)perfect++}
  for(let i=0;i<400;i++){const k=dkey(addDays(new Date(),-i));if(hzScore(k)===5)streak++;else if(i>0)break}
  return{hs,tl,azd,sdd,perfect,streak}}
function weekCard(){const r=weekReport(),done=r.hs.j+r.hs.a,pc=r.hs.tot?Math.round(done/r.hs.tot*100):0;
  const row=(ic,l,v,p)=>`<div class="wrow"><span>${ic} ${l}</span><b>${v}</b>${p!=null?meter(p):''}</div>`;
  return`<div class="card"><div class="row sp"><h2 style="margin:0">📊 ${T('Is hafte ke amaal','This week\'s deeds','اس ہفتے کے اعمال','इस हफ़्ते के आमाल')}</h2>${r.streak>1?`<span class="chip gold">🔥 ${r.streak} ${T('din','days','دن','दिन')}</span>`:''}</div>
  ${row('🕌',T('Namaz (7 din)','Prayers (7 days)','نماز (۷ دن)','नमाज़ (7 दिन)'),`${done}/${r.hs.tot}`,pc)}
  <div class="muted sm" style="margin:-2px 0 8px">${T(`Jamaat se ${r.hs.j} • akele ${r.hs.a} • qaza ${r.hs.q}`,`In jamaat ${r.hs.j} • alone ${r.hs.a} • missed ${r.hs.q}`,`جماعت سے ${r.hs.j} • اکیلے ${r.hs.a} • قضا ${r.hs.q}`,`जमात से ${r.hs.j} • अकेले ${r.hs.a} • क़ज़ा ${r.hs.q}`)}</div>
  ${row('📖',T('Tilawat (ayaat)','Recitation (ayahs)','تلاوت (آیات)','तिलावत (आयात)'),r.tl,Math.min(100,r.tl/Math.max(1,S.tilTarget*7)*100))}
  ${row('📿',T('Azkar (din)','Azkar (days)','اذکار (دن)','अज़कार (दिन)'),`${r.azd}/7`,r.azd/7*100)}
  ${row('🤲',T('Sadqa (din)','Sadaqah (days)','صدقہ (دن)','सदक़ा (दिन)'),`${r.sdd}/7`,r.sdd/7*100)}</div>`}
function sadqaCard(){const tgt=+S.sadqaAmt||0,given=sdList().reduce((a,x)=>a+(+x.amt||0),0),done=sdDone();
  return`<div class="card"><div class="row sp"><h2 style="margin:0">🤲 ${T('Aaj ka sadqa','Today\'s sadaqah','آج کا صدقہ','आज का सदक़ा')}</h2><span class="chip ${done?'ok':''}">${done?T('Ho gaya ✅','Done ✅','ہو گیا ✅','हो गया ✅'):T('Baaqi','Pending','باقی','बाक़ी')}</span></div>
  ${tgt>0?`<div class="row sp mt"><b style="font-size:20px">${rupee(given)} <span class="muted sm">/ ${rupee(tgt)}</span></b><span class="muted sm">${T('Roz ka target','Daily target','روز کا ہدف','रोज़ का लक्ष्य')}</span></div>${meter(given/tgt*100)}`
   :`<p class="muted sm mt">${T('Roz ka chhota sa sadqa tay kar lein — jaise ₹10 ya ₹50. Chhota sadqa bhi kaafi hai, bas rozana ho.','Set a small daily sadaqah — say ₹10 or ₹50. Even small is enough, just be regular.','روز کا چھوٹا سا صدقہ طے کر لیں — جیسے ₹10 یا ₹50۔ چھوٹا صدقہ بھی کافی ہے، بس روزانہ ہو۔','रोज़ का छोटा सा सदक़ा तय कर लें — जैसे ₹10 या ₹50। छोटा सदक़ा भी काफ़ी है, बस रोज़ाना हो।')}</p>`}
  <div class="grid2 mt"><button class="btn" data-a="sdadd">＋ ${T('Sadqa likhein','Log sadaqah','صدقہ لکھیں','सदक़ा लिखें')}</button><button class="btn ghost" data-a="pubsdt">🎯 ${T('Target badlein','Set target','ہدف بدلیں','लक्ष्य बदलें')}</button></div></div>`}
AX.pubsdt=()=>form(T('Roz ka sadqa target','Daily sadaqah target','روز کا صدقہ ہدف','रोज़ का सदक़ा लक्ष्य'),[{k:'a',l:T('Kitna rupaya roz? (0 = band)','Rupees per day? (0 = off)','روزانہ کتنے روپے؟ (0 = بند)','रोज़ कितने रुपये? (0 = बंद)'),t:'number',m:'decimal',v:S.sadqaAmt||''}],o=>{S.sadqaAmt=Math.max(0,+o.a||0);saveS();try{nativeSync()}catch(e){}toast(T('Target set ✅','Target set ✅'));rerender()});
AX.sdadd=()=>askSadqaAmt();
function homeHero(np,h,d){
  return`<div class="card hero"><div class="row">${logoBox('logos/qs.webp',54)}<div class="grow"><div class="hello">${T('Assalamu Alaikum 👋','Assalamu Alaikum 👋','السلام علیکم 👋','अस्सलामु अलैकुम 👋')}</div><div class="muted sm">${new Date().toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}${TM&&hijriTxt()?' • '+esc(hijriTxt()):''}</div></div></div>
  ${np?`<div class="hrow">${ringHTML(np,`<div class="eyebrow" style="font-size:9px">${T('AGLI','NEXT','اگلی','अगली')}</div><div class="pn" style="font-size:20px">${pname(np.k)}</div><div class="cd" style="font-size:15px" data-cd="${+np.at}">--:--:--</div>`)}<div class="grow"><div class="eyebrow">${T('NAMAZ AAJ','TODAY','آج کی نماز','आज की नमाज़')}</div><div class="dots mt">${PRAY.map(p=>`<i class="${h[p]||''}" title="${pname(p)}"></i>`).join('')}</div><div class="muted sm mt">${hzScore(d)}/5 ${T('ada','prayed','ادا','अदा')}</div><button class="btn s ghost mt" data-a="tab" data-v="deen" data-s="namaz">${T('Namaz kholein','Open','نماز کھولیں','नमाज़ खोलें')}</button></div></div>`
   :`<p class="muted mt">${S.lat==null&&!S.city?T('Pehle apni location set karein — phir namaz ke sahi waqt dikhenge.','Set your location first to see prayer times.','پہلے اپنی لوکیشن سیٹ کریں — پھر نماز کے صحیح اوقات دکھیں گے۔','पहले अपनी लोकेशन सेट करें — फिर नमाज़ के सही वक़्त दिखेंगे।'):T('Namaz ke waqt load ho rahe hain…','Loading prayer times…','نماز کے اوقات لوڈ ہو رہے ہیں…','नमाज़ के वक़्त लोड हो रहे हैं…')}</p>`}</div>`}
renderHome=function(el){
  const np=typeof nextPrayer==='function'?nextPrayer():null,h=hzToday(),d=dkey(),tl=tlToday(),tg=S.tilTarget;
  const open=(typeof TASKS!=='undefined'?TASKS:[]).filter(t=>!t.done).slice(0,4);
  const azOK=['k3','ist','dur'].map(i=>azGet(i+'m')>=100&&azGet(i+'e')>=100);
  const pq=PQ.length?`<div class="card"><h2>${T('Aap se sawal','Questions for you','آپ سے سوال','आपसे सवाल')} (${PQ.length})</h2>${PQ.map(q=>`<div class="pq"><b>${esc(q.title)}</b><div class="btns">${q.btns.map(b=>`<button class="btn s ${b[0]==='z'?'ghost':''}" data-a="qans" data-q="${q.id}" data-b="${b[0]}">${b[1]}</button>`).join('')}</div></div>`).join('')}</div>`:'';
  const hj=(()=>{try{return hijriNow()}catch(e){return null}})();
  const stats=`<div class="stats"><div class="stat tap" data-a="tab" data-v="deen" data-s="quran"><div class="ico b">📖</div><div class="sv">${tl}<span class="sm muted">/${tg}</span></div><div class="sl">${T('Tilawat (ayaat)','Recitation','تلاوت','तिलावत')}</div></div><div class="stat tap" data-a="tab" data-v="deen" data-s="azkar"><div class="ico e">📿</div><div class="sv">${azOK.filter(Boolean).length}<span class="sm muted">/3</span></div><div class="sl">${T('Azkar (100-100)','Azkar (100 each)','اذکار','अज़कार')}</div></div><div class="stat tap" data-a="tab" data-v="more" data-s="tools"><div class="ico d">🌙</div><div class="sv">${hj?hj.d:'—'}</div><div class="sl">${hj?hj.mn:'Hijri'}</div></div></div>`;
  const tasks=`<div class="card"><div class="row sp"><h2 style="margin:0">${T('Mere kaam','My tasks','میرے کام','मेरे काम')}</h2><button class="lnk" data-a="tab" data-v="kaam" data-s="tasks">${T('Sab dekhein','See all','سب دیکھیں','सब देखें')}</button></div>${open.map(t=>`<div class="item"><input type="checkbox" class="ck" data-a="ttog" data-id="${t.id}"><div class="t"><b>${PRI[t.pri||2]} ${esc(t.title)}</b>${t.due?`<div class="muted sm">${fmtDT(t.due)}</div>`:''}</div></div>`).join('')||`<p class="muted c">${T('Koi pending kaam nahi 🎉','No pending tasks 🎉','کوئی کام باقی نہیں 🎉','कोई काम बाक़ी नहीं 🎉')}</p>`}</div>`;
  const dh=hadeesOfDay();const had=`<div class="card"><div class="eyebrow">${T('AAJ KI HADEES','HADITH OF THE DAY','آج کی حدیث','आज की हदीस')}</div><div class="quote">“</div><div class="had">${esc(dh[0])}</div><div class="muted sm mt">${esc(dh[1])}</div></div>`;
  el.innerHTML=homeHero(np,h,d)+(typeof prayTable==='function'?prayTable():'')+(typeof yrHomeCard==='function'?yrHomeCard():'')+newAlertsCard()+(typeof obPendingCard==='function'?obPendingCard():'')+(typeof msjCard==='function'&&TM?msjCard():'')+(typeof tourCard==='function'?tourCard():'')+(typeof firqaHomeCard==='function'?firqaHomeCard():'')+(typeof nightCard==='function'?nightCard():'')+pq+(typeof isDeo==='function'&&isDeo()&&typeof kaamHomeCard==='function'?kaamHomeCard():'')+(typeof barHomeCard==='function'?barHomeCard():'')+sadqaCard()+stats+weekCard()+(typeof jumaCard==='function'?jumaCard(1):'')+had+(typeof tijCard==='function'?tijCard():'')+tasks+brandsCard()+supportMini()};

/* ---------- 5. Hijri helpers ---------- */
const HJM=[['Muharram','محرم','मुहर्रम'],['Safar','صفر','सफ़र'],['Rabi-ul-Awwal','ربیع الاول','रबी-उल-अव्वल'],['Rabi-ul-Aakhir','ربیع الآخر','रबी-उल-आख़िर'],['Jumada-ul-Awwal','جمادی الاول','जुमादल-ऊला'],['Jumada-ul-Aakhir','جمادی الآخر','जुमादल-आख़िरा'],['Rajab','رجب','रजब'],['Shaban','شعبان','शाबान'],['Ramadan','رمضان','रमज़ान'],['Shawwal','شوال','शव्वाल'],['Dhul-Qaada','ذوالقعدہ','ज़ुल-क़ादा'],['Dhul-Hijjah','ذوالحجہ','ज़ुल-हिज्जा']];
const hjName=m=>S.lang==='ur'?HJM[m-1][1]:S.lang==='hi'?HJM[m-1][2]:HJM[m-1][0];
let _hjF=null;
function hijriOf(date){ /* S.hjAdj shifts the date to match local moon sighting (India is often 1 day behind Saudi) */
  if(!_hjF)_hjF=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'});
  const x=new Date(date);x.setDate(x.getDate()+(+S.hjAdj||0));const o={};_hjF.formatToParts(x).forEach(p=>o[p.type]=p.value);
  return{d:+o.day,m:+o.month,y:+(o.year||o.relatedYear)}}
function hijriNow(){const h=hijriOf(new Date());return{...h,mn:hjName(h.m)}}
const HJ_EV=[
 [1,1,'Islamic New Year','Hijri Naya Saal','ہجری نیا سال','हिजरी नया साल'],
 [1,10,'Day of Ashura (fast 9th/10th)','Youm-e-Ashura (9-10 ka roza)','یومِ عاشورہ (۹-۱۰ کا روزہ)','यौम-ए-आशूरा (9-10 का रोज़ा)'],
 [3,12,'12 Rabi-ul-Awwal','12 Rabi-ul-Awwal','۱۲ ربیع الاول','12 रबी-उल-अव्वल'],
 [7,27,'27 Rajab (Shab-e-Meraj)','27 Rajab (Shab-e-Meraj)','۲۷ رجب (شبِ معراج)','27 रजब (शब-ए-मेराज)'],
 [8,15,'15 Shaban (Shab-e-Barat)','15 Shaban (Shab-e-Barat)','۱۵ شعبان (شبِ برأت)','15 शाबान (शब-ए-बरात)'],
 [9,1,'Ramadan begins','Ramadan shuru','رمضان شروع','रमज़ान शुरू'],
 [9,27,'27 Ramadan (Shab-e-Qadr sought)','27 Ramadan (Shab-e-Qadr ki talaash)','۲۷ رمضان (شبِ قدر کی تلاش)','27 रमज़ान (शब-ए-क़द्र की तलाश)'],
 [10,1,'Eid-ul-Fitr','Eid-ul-Fitr','عیدالفطر','ईद-उल-फ़ित्र'],
 [12,9,'Day of Arafah (fast)','Youm-e-Arafah (roza)','یومِ عرفہ (روزہ)','यौम-ए-अरफ़ा (रोज़ा)'],
 [12,10,'Eid-ul-Adha','Eid-ul-Adha','عیدالاضحیٰ','ईद-उल-अज़हा']];
function upcomingEvents(n=6){const out=[];const t0=new Date();t0.setHours(12,0,0,0);
  for(let i=0;i<400&&out.length<n;i++){const dt=addDays(t0,i),h=hijriOf(dt);const e=HJ_EV.find(x=>x[0]===h.m&&x[1]===h.d);if(e)out.push({days:i,dt,h,e,name:T(e[3],e[2],e[4],e[5])})}
  return out}

/* ---------- 6. Tools ---------- */
const TOOLV={v:''};
A.tv=el=>{TOOLV.v=el.dataset.v||'';sfx('tick');rerender(true);window.scrollTo(0,0)};
const _seg0=A.seg;A.seg=el=>{if(el.dataset.id==='tseg'){TOOLV.v=el.dataset.v;sfx('tick');rerender(true);return}return _seg0(el)};
const toolBack=()=>`<button class="btn s ghost" data-a="tv" data-v="">← ${T('Aala','Tools','اوزار','औज़ार')}</button>`;
function renderTools(el){
  const tiles=[['zakat','🧮',T('Zakat','Zakat','زکوٰۃ','ज़कात')],['roza','🌙',T('Roza • Sehri-Iftar','Roza • Sehri-Iftar','روزہ • سحری افطار','रोज़ा • सहरी-इफ़्तार')],['hijri','📅',T('Hijri tareekh','Hijri dates','ہجری تاریخ','हिजरी तारीख़')],['asma','✨',T('99 Naam','99 Names','۹۹ نام','99 नाम')],['qibla','🧭',T('Qibla • Masjid','Qibla • Masjid','قبلہ • مسجد','क़िबला • मस्जिद')],['biz','💼',T('Mera kaarobar','My business','میرا کاروبار','मेरा कारोबार')]];
  if(!TOOLV.v){el.innerHTML=`<div class="card"><h2>🧰 ${T('Deeni aur rozmarra ke aala','Deeni & everyday tools','دینی اور روزمرہ کے اوزار','दीनी और रोज़मर्रा के औज़ार')}</h2><div class="tgrid">${tiles.map(t=>`<button class="tile" data-a="tv" data-v="${t[0]}"><i>${t[1]}</i><span>${t[2]}</span></button>`).join('')}</div></div>`;return}
  const f={zakat:toolZakat,roza:toolRoza,hijri:toolHijri,asma:toolAsma,qibla:toolQibla,biz:toolBiz}[TOOLV.v];
  el.innerHTML=`<div style="margin-bottom:10px">${toolBack()}</div><div id="tool"></div>`;f($('#tool'))}

/* Zakat */
function toolZakat(el){
  const Z=Object.assign({cash:'',gold:'',gr:'',silver:'',sr:'',stock:'',recv:'',other:'',debt:'',basis:'silver'},store.get('zk',{}));
  const fld=(k,l,u)=>`<div><label for="zk_${k}">${l}</label><input id="zk_${k}" data-zk="${k}" type="number" inputmode="decimal" value="${esc(Z[k])}" placeholder="${u||'₹'}"></div>`;
  el.innerHTML=`<div class="card"><h2>🧮 ${T('Zakat calculator','Zakat calculator','زکوٰۃ کیلکولیٹر','ज़कात कैलकुलेटर')}</h2>
  <p class="muted sm">${T('Sirf us maal par zakat hai jis par poora ek Islami saal guzar chuka ho aur jo nisaab se zyada ho. Aaj ka sone-chandi ka bhav khud daalein.','Zakat is due on wealth held for one full lunar year that is above nisab. Enter today\'s gold/silver rates yourself.','زکوٰۃ اس مال پر ہے جس پر پورا اسلامی سال گزر چکا ہو اور جو نصاب سے زیادہ ہو۔ آج کا سونے چاندی کا بھاؤ خود لکھیں۔','ज़कात उस माल पर है जिस पर पूरा इस्लामी साल गुज़र चुका हो और जो निसाब से ज़्यादा हो। आज का सोने-चाँदी का भाव ख़ुद डालें।')}</p>
  <div class="grid2">${fld('cash',T('Naqd + bank (₹)','Cash + bank (₹)','نقد + بینک (₹)','नक़द + बैंक (₹)'))}${fld('stock',T('Tijarat ka maal (₹)','Business stock (₹)','تجارت کا مال (₹)','तिजारत का माल (₹)'))}
  ${fld('gold',T('Sona (gram)','Gold (grams)','سونا (گرام)','सोना (ग्राम)'),'g')}${fld('gr',T('Sone ka bhav ₹/gram','Gold rate ₹/gram','سونے کا بھاؤ ₹/گرام','सोने का भाव ₹/ग्राम'))}
  ${fld('silver',T('Chandi (gram)','Silver (grams)','چاندی (گرام)','चाँदी (ग्राम)'),'g')}${fld('sr',T('Chandi ka bhav ₹/gram','Silver rate ₹/gram','چاندی کا بھاؤ ₹/گرام','चाँदी का भाव ₹/ग्राम'))}
  ${fld('recv',T('Wapas milne wala qarz (₹)','Money owed to you (₹)','واپس ملنے والا قرض (₹)','वापस मिलने वाला क़र्ज़ (₹)'))}${fld('other',T('Aur qabil-e-zakat maal (₹)','Other zakatable assets (₹)','دیگر قابلِ زکوٰۃ مال (₹)','अन्य क़ाबिल-ए-ज़कात माल (₹)'))}</div>
  ${fld('debt',T('Aap par qarz jo abhi dena hai (₹)','Debts you must pay now (₹)','آپ پر قرض جو ابھی دینا ہے (₹)','आप पर क़र्ज़ जो अभी देना है (₹)'))}
  <label for="zk_basis">${T('Nisaab kis se?','Nisab based on','نصاب کس سے؟','निसाब किससे?')}</label><select id="zk_basis" data-zk="basis"><option value="silver" ${Z.basis==='silver'?'selected':''}>${T('Chandi (612.36 g) — ehtiyat, Hanafi','Silver (612.36 g) — safer, Hanafi','چاندی (۶۱۲.۳۶ گرام) — احتیاط، حنفی','चाँदी (612.36 ग्राम) — एहतियात, हनफ़ी')}</option><option value="gold" ${Z.basis==='gold'?'selected':''}>${T('Sona (87.48 g)','Gold (87.48 g)','سونا (۸۷.۴۸ گرام)','सोना (87.48 ग्राम)')}</option></select></div>
  <div class="card" id="zkres"></div>
  <p class="muted sm">${T('Yeh sirf andaza hai. Pakka masla aalim / mufti sahab se poochh lein. Zakat is app ke zariye nahi li jaati — khud ada karein ya hamse WhatsApp par rabta karein.','This is an estimate. Please confirm rulings with a scholar. Zakat is not collected via this app — pay it yourself or contact us on WhatsApp.','یہ صرف اندازہ ہے۔ پکا مسئلہ عالم/مفتی صاحب سے پوچھ لیں۔ زکوٰۃ اس ایپ کے ذریعے نہیں لی جاتی — خود ادا کریں یا واٹس ایپ پر رابطہ کریں۔','यह सिर्फ़ अंदाज़ा है। पक्का मसअला आलिम/मुफ़्ती साहब से पूछ लें। ज़कात इस ऐप के ज़रिए नहीं ली जाती — ख़ुद अदा करें या व्हाट्सऐप पर संपर्क करें।')}</p>`;
  const calc=()=>{const v=k=>+(Z[k]||0);const assets=v('cash')+v('stock')+v('recv')+v('other')+v('gold')*v('gr')+v('silver')*v('sr');const net=Math.max(0,assets-v('debt'));
    const nis=Z.basis==='gold'?87.48*v('gr'):612.36*v('sr');const need=nis<=0;const due=(!need&&net>=nis)?net*0.025:0;
    $('#zkres').innerHTML=`<div class="grid2"><div><div class="muted sm">${T('Kul qabil-e-zakat maal','Total zakatable','کل قابلِ زکوٰۃ مال','कुल क़ाबिल-ए-ज़कात माल')}</div><b style="font-size:20px">${rupee(net)}</b></div><div><div class="muted sm">${T('Nisaab','Nisab','نصاب','निसाब')}</div><b style="font-size:20px">${need?'—':rupee(nis)}</b></div></div>
    ${need?`<p class="warnbox mt">${T('Nisaab nikaalne ke liye '+(Z.basis==='gold'?'sone':'chandi')+' ka bhav (₹/gram) daalein.','Enter the '+(Z.basis==='gold'?'gold':'silver')+' rate (₹/gram) to get the nisab.','نصاب نکالنے کے لیے '+(Z.basis==='gold'?'سونے':'چاندی')+' کا بھاؤ (₹/گرام) لکھیں۔','निसाब निकालने के लिए '+(Z.basis==='gold'?'सोने':'चाँदी')+' का भाव (₹/ग्राम) डालें।')}</p>`
    :due>0?`<div class="zkdue mt"><div class="muted sm">${T('Aap par zakat (2.5%)','Zakat due (2.5%)','آپ پر زکوٰۃ (۲.۵٪)','आप पर ज़कात (2.5%)')}</div><b style="font-size:30px">${rupee(due)}</b></div>`
    :`<p class="mt">${T('Maal nisaab se kam hai — is saal zakat farz nahi (insha-Allah). Sadqa phir bhi kar sakte hain.','Below nisab — zakat is not obligatory this year. You may still give sadaqah.','مال نصاب سے کم ہے — اس سال زکوٰۃ فرض نہیں۔ صدقہ پھر بھی کر سکتے ہیں۔','माल निसाब से कम है — इस साल ज़कात फ़र्ज़ नहीं। सदक़ा फिर भी कर सकते हैं।')}</p>`}`};
  $$('[data-zk]',el).forEach(i=>i.addEventListener('input',()=>{Z[i.dataset.zk]=i.value;store.set('zk',Z);calc()}));calc()}

/* Roza */
function toolRoza(el){
  const t=TM&&TM.t,t2=TM_TMR&&TM_TMR.t,h=hijriNow(),ram=h.m===9;
  const iftar=t?atTime(t.Maghrib):null;
  const nextI=iftar&&iftar>new Date()?iftar:(t2?atTime(t2.Maghrib,addDays(new Date(),1)):null);
  const nb=(()=>{for(let i=0;i<40;i++){const dt=addDays(new Date(),i),x=hijriOf(dt);if([13,14,15].includes(x.d))return{dt,x}}return null})();
  el.innerHTML=`<div class="card hero"><h2>🌙 ${T('Sehri aur Iftar','Sehri & Iftar','سحری اور افطار','सहरी और इफ़्तार')}</h2>
  ${t?`<div class="grid2"><div class="rzb"><div class="muted sm">${T('Sehri ka aakhri waqt (Fajr)','Sehri ends (Fajr)','سحری کا آخری وقت (فجر)','सहरी का आख़िरी वक़्त (फ़ज्र)')}</div><b>${t12(t.Fajr)}</b></div><div class="rzb"><div class="muted sm">${T('Iftar (Maghrib)','Iftar (Maghrib)','افطار (مغرب)','इफ़्तार (मग़रिब)')}</div><b>${t12(t.Maghrib)}</b></div></div>
  ${nextI?`<div class="muted sm c mt">${T('Iftar mein','Until iftar','افطار میں','इफ़्तार में')}: <b data-cd="${+nextI}">--:--:--</b></div>`:''}`:`<p class="muted">${T('Pehle location set karein.','Set your location first.','پہلے لوکیشن سیٹ کریں۔','पहले लोकेशन सेट करें।')}</p>`}
  <div class="fs mt"><span>${T('Sehri / Iftar ki yaad dahani','Sehri / Iftar reminders','سحری / افطار کی یاد دہانی','सहरी / इफ़्तार की याद-दिहानी')}</span><input type="checkbox" class="sw" data-a="set" data-p="rozaOn" data-t="check" ${S.rozaOn?'checked':''}></div>
  <p class="muted sm">${ram?T('Ramadan chal raha hai 🌙 — Allah qabool farmaye.','It is Ramadan 🌙 — may Allah accept.','رمضان چل رہا ہے 🌙 — اللہ قبول فرمائے۔','रमज़ान चल रहा है 🌙 — अल्लाह क़बूल फ़रमाए।'):T('Reminder on karein to Ramadan / nafil roze mein sehri-iftar par notification aayegi.','Turn reminders on to get sehri / iftar notifications.','یاد دہانی آن کریں تو سحری/افطار پر نوٹیفکیشن آئے گا۔','रिमाइंडर ऑन करें तो सहरी/इफ़्तार पर नोटिफ़िकेशन आएगा।')}</p></div>
  <div class="card"><h2>🤲 ${T('Niyyat aur duain','Intention & duas','نیت اور دعائیں','नीयत और दुआएँ')}</h2>
  <div class="eyebrow">${T('SEHRI KI NIYYAT','SEHRI INTENTION','سحری کی نیت','सहरी की नीयत')}</div><div class="ar" dir="rtl" style="font-size:24px;line-height:2.1;text-align:center">وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ</div><div class="muted sm c">${T('Maine Ramadan ke kal ke roze ki niyyat ki.','I intend to fast tomorrow in Ramadan.','میں نے رمضان کے کل کے روزے کی نیت کی۔','मैंने रमज़ान के कल के रोज़े की नीयत की।')}</div>
  <div class="eyebrow mt">${T('IFTAR KI DUA','IFTAR DUA','افطار کی دعا','इफ़्तार की दुआ')}</div><div class="ar" dir="rtl" style="font-size:24px;line-height:2.1;text-align:center">اَللّٰهُمَّ اِنِّىْ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ</div>
  <div class="muted sm c">${T('Ya Allah! Maine tere liye roza rakha, tujh par imaan laya, tujh par bharosa kiya aur tere diye rizq se iftar kiya.','O Allah! I fasted for You, believed in You, trusted You and break my fast with Your provision.','اے اللہ! میں نے تیرے لیے روزہ رکھا، تجھ پر ایمان لایا، تجھ پر بھروسہ کیا اور تیرے رزق سے افطار کیا۔','ऐ अल्लाह! मैंने तेरे लिए रोज़ा रखा, तुझ पर ईमान लाया, तुझ पर भरोसा किया और तेरे रिज़्क़ से इफ़्तार किया।')}</div>
  <div class="ar mt" dir="rtl" style="font-size:22px;line-height:2.1;text-align:center">ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللّٰهُ</div>
  <div class="muted sm c">${T('Pyaas bujh gayi, rag-rag tar ho gayi aur insha-Allah ajr pakka ho gaya. (iftar ke baad)','The thirst is gone, the veins are moist and the reward is confirmed, insha-Allah. (after iftar)','پیاس بجھ گئی، رگیں تر ہو گئیں اور ان شاء اللہ اجر پکا ہو گیا۔ (افطار کے بعد)','प्यास बुझ गई, रगें तर हो गईं और इंशा-अल्लाह अज्र पक्का हो गया। (इफ़्तार के बाद)')}</div></div>
  <div class="card"><h2>🗓️ ${T('Nafil roze','Sunnah fasts','نفل روزے','नफ़्ल रोज़े')}</h2><p class="sm">${T('Peer aur Jumerat ke roze • Har Islami mahine ki 13-14-15 tareekh (Ayyam-e-Beez) • Arafah (9 Zul-Hijjah) • Ashura (9-10 Muharram) • Shawwal ke 6 roze.','Mondays & Thursdays • 13-14-15 of each Hijri month (Ayyam-e-Beed) • Arafah (9 Dhul-Hijjah) • Ashura (9-10 Muharram) • six days of Shawwal.','پیر اور جمعرات کے روزے • ہر اسلامی مہینے کی ۱۳-۱۴-۱۵ (ایامِ بیض) • عرفہ (۹ ذوالحجہ) • عاشورہ (۹-۱۰ محرم) • شوال کے ۶ روزے۔','सोमवार और जुमेरात के रोज़े • हर इस्लामी महीने की 13-14-15 (अय्याम-ए-बीज़) • अरफ़ा (9 ज़ुल-हिज्जा) • आशूरा (9-10 मुहर्रम) • शव्वाल के 6 रोज़े।')}</p>
  ${nb?`<div class="chip gold">${T('Agle Ayyam-e-Beez','Next Ayyam-e-Beed','اگلے ایامِ بیض','अगले अय्याम-ए-बीज़')}: ${nb.dt.toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'})} (${nb.x.d} ${hjName(nb.x.m)})</div>`:''}</div>`}

/* Hijri */
function toolHijri(el){
  const h=hijriNow(),ev=upcomingEvents(7),adj=+S.hjAdj||0;
  el.innerHTML=`<div class="card hero c"><div class="eyebrow">${T('AAJ KI HIJRI TAREEKH','TODAY\'S HIJRI DATE','آج کی ہجری تاریخ','आज की हिजरी तारीख़')}</div><div style="font-size:34px;font-weight:700;margin:6px 0">${h.d} ${h.mn}</div><div class="muted">${h.y} ${T('Hijri','AH','ہجری','हिजरी')} • ${new Date().toLocaleDateString(LOC(),{day:'numeric',month:'long',year:'numeric'})}</div></div>
  <div class="card"><h2>${T('Chaand ke hisaab se din ka farq','Moon-sighting day adjust','چاند کے حساب سے دن کا فرق','चाँद के हिसाब से दिन का फ़र्क़')}</h2>
  <div class="seg3">${[-1,0,1].map(v=>`<button class="btn s ${adj===v?'':'ghost'}" data-a="hjadj" data-v="${v}">${v>0?'+'+v:v} ${T('din','day','دن','दिन')}</button>`).join('')}</div>
  <p class="muted sm mt">${T('Tareekh Umm-ul-Qura calendar se hai. Aap ke yahan chaand ek din der se dikhe to “-1 din” chunein. Chaand dekhne ke elaan par hi roza/Eid ka faisla karein.','Dates follow the Umm al-Qura calendar. If the moon is sighted a day later where you live, choose “-1 day”. Decide fasting/Eid by the local moon-sighting announcement.','تاریخ ام القریٰ کیلنڈر سے ہے۔ آپ کے یہاں چاند ایک دن بعد دکھے تو “-1 دن” چنیں۔ روزہ/عید کا فیصلہ چاند کے اعلان پر ہی کریں۔','तारीख़ उम्मुल-क़ुरा कैलेंडर से है। आपके यहाँ चाँद एक दिन बाद दिखे तो “-1 दिन” चुनें। रोज़ा/ईद का फ़ैसला चाँद के ऐलान पर ही करें।')}</p></div>
  <div class="card"><h2>🗓️ ${T('Aane wale islami din','Upcoming Islamic days','آنے والے اسلامی دن','आने वाले इस्लामी दिन')}</h2>${ev.map(x=>`<div class="item"><div class="t"><b>${esc(x.name)}</b><div class="muted sm">${x.dt.toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'long',year:'numeric'})} • ${x.h.d} ${hjName(x.h.m)}</div></div><span class="chip ${x.days<=7?'gold':''}">${x.days===0?T('Aaj','Today','آج','आज'):x.days+' '+T('din','days','دن','दिन')}</span></div>`).join('')}</div>`}
A.hjadj=el=>{S.hjAdj=+el.dataset.v;saveS();rerender()};

/* 99 names */
const ASMA=[['الرحمن','Ar-Rahman','The Most Gracious','Bahut meharban'],['الرحيم','Ar-Raheem','The Most Merciful','Nihayat reham karne wala'],['الملك','Al-Malik','The King','Badshah'],['القدوس','Al-Quddus','The Most Holy','Har aib se paak'],['السلام','As-Salam','The Source of Peace','Salamati dene wala'],['المؤمن','Al-Mu\'min','The Granter of Security','Aman dene wala'],['المهيمن','Al-Muhaymin','The Guardian','Nigehbaan'],['العزيز','Al-Azeez','The Almighty','Zabardast, ghalib'],['الجبار','Al-Jabbar','The Compeller','Sab par ghalib, bigdi banane wala'],['المتكبر','Al-Mutakabbir','The Supreme','Badai wala'],
['الخالق','Al-Khaliq','The Creator','Paida karne wala'],['البارئ','Al-Bari\'','The Originator','Wajood dene wala'],['المصور','Al-Musawwir','The Fashioner','Soorat banane wala'],['الغفار','Al-Ghaffar','The Constant Forgiver','Bahut bakhshne wala'],['القهار','Al-Qahhar','The All-Subduer','Sab par qahir'],['الوهاب','Al-Wahhab','The Bestower','Bahut ata karne wala'],['الرزاق','Ar-Razzaq','The Provider','Rizq dene wala'],['الفتاح','Al-Fattah','The Opener','Darwaze kholne wala'],['العليم','Al-Aleem','The All-Knowing','Sab kuch jaanne wala'],['القابض','Al-Qabid','The Withholder','Rizq tang karne wala'],
['الباسط','Al-Basit','The Expander','Rizq kushada karne wala'],['الخافض','Al-Khafid','The Abaser','Past karne wala'],['الرافع','Ar-Rafi\'','The Exalter','Buland karne wala'],['المعز','Al-Mu\'izz','The Giver of Honour','Izzat dene wala'],['المذل','Al-Mudhill','The Giver of Dishonour','Zillat dene wala'],['السميع','As-Samee\'','The All-Hearing','Sab kuch sunne wala'],['البصير','Al-Baseer','The All-Seeing','Sab kuch dekhne wala'],['الحكم','Al-Hakam','The Judge','Faisla karne wala'],['العدل','Al-Adl','The Utterly Just','Poora insaaf karne wala'],['اللطيف','Al-Lateef','The Subtle, Gentle','Barik-been, meharban'],
['الخبير','Al-Khabeer','The All-Aware','Poori khabar rakhne wala'],['الحليم','Al-Haleem','The Forbearing','Burdbaar'],['العظيم','Al-Azeem','The Magnificent','Azmat wala'],['الغفور','Al-Ghafoor','The Oft-Forgiving','Bakhshne wala'],['الشكور','Ash-Shakoor','The Most Appreciative','Qadardaan'],['العلي','Al-Aliyy','The Most High','Buland'],['الكبير','Al-Kabeer','The Most Great','Sab se bada'],['الحفيظ','Al-Hafeez','The Preserver','Hifazat karne wala'],['المقيت','Al-Muqeet','The Sustainer','Rozi pahunchane wala'],['الحسيب','Al-Haseeb','The Reckoner','Hisaab lene wala, kaafi'],
['الجليل','Al-Jaleel','The Majestic','Jalal wala'],['الكريم','Al-Kareem','The Most Generous','Karam karne wala'],['الرقيب','Ar-Raqeeb','The Watchful','Nigraan'],['المجيب','Al-Mujeeb','The Responsive','Dua qabool karne wala'],['الواسع','Al-Wasi\'','The All-Encompassing','Wasee, kushadah'],['الحكيم','Al-Hakeem','The Wise','Hikmat wala'],['الودود','Al-Wadood','The Loving','Mohabbat karne wala'],['المجيد','Al-Majeed','The Glorious','Buzurgi wala'],['الباعث','Al-Ba\'ith','The Resurrector','Dobara zinda uthane wala'],['الشهيد','Ash-Shaheed','The Witness','Har cheez par gawah'],
['الحق','Al-Haqq','The Truth','Sach, barhaq'],['الوكيل','Al-Wakeel','The Trustee','Kaarsaaz'],['القوي','Al-Qawiyy','The Strong','Taqatwar'],['المتين','Al-Mateen','The Firm','Mazboot'],['الولي','Al-Waliyy','The Protecting Friend','Dost, madadgaar'],['الحميد','Al-Hameed','The Praiseworthy','Tareef ke laayaq'],['المحصي','Al-Muhsi','The Accounter','Sab kuch ginne wala'],['المبدئ','Al-Mubdi\'','The Originator','Pehli baar paida karne wala'],['المعيد','Al-Mu\'eed','The Restorer','Dobara lautane wala'],['المحيي','Al-Muhyi','The Giver of Life','Zindagi dene wala'],
['المميت','Al-Mumeet','The Giver of Death','Maut dene wala'],['الحي','Al-Hayy','The Ever-Living','Hamesha zinda'],['القيوم','Al-Qayyum','The Self-Subsisting','Sab ko thaamne wala'],['الواجد','Al-Wajid','The Finder','Sab kuch paane wala'],['الماجد','Al-Majid','The Noble','Buzurg'],['الواحد','Al-Wahid','The One','Ek'],['الأحد','Al-Ahad','The Unique','Akela, yakta'],['الصمد','As-Samad','The Eternal Refuge','Be-niyaz, sab uske mohtaj'],['القادر','Al-Qadir','The Able','Qudrat wala'],['المقتدر','Al-Muqtadir','The Powerful','Poora ikhtiyar rakhne wala'],
['المقدم','Al-Muqaddim','The Expediter','Aage karne wala'],['المؤخر','Al-Mu\'akhkhir','The Delayer','Peeche karne wala'],['الأول','Al-Awwal','The First','Sab se pehle'],['الآخر','Al-Akhir','The Last','Sab ke baad'],['الظاهر','Az-Zahir','The Manifest','Zaahir'],['الباطن','Al-Batin','The Hidden','Posheedah'],['الوالي','Al-Wali','The Governor','Haakim, mutawalli'],['المتعالي','Al-Muta\'ali','The Most Exalted','Bahut buland'],['البر','Al-Barr','The Source of Goodness','Neki, ehsaan karne wala'],['التواب','At-Tawwab','The Acceptor of Repentance','Tauba qabool karne wala'],
['المنتقم','Al-Muntaqim','The Avenger','Zaalimon se badla lene wala'],['العفو','Al-Afuww','The Pardoner','Maaf karne wala'],['الرؤوف','Ar-Ra\'uf','The Compassionate','Shafqat wala'],['مالك الملك','Malik-ul-Mulk','Owner of Sovereignty','Saltanat ka maalik'],['ذو الجلال والإكرام','Dhul-Jalali wal-Ikram','Lord of Majesty and Bounty','Jalal aur ikram wala'],['المقسط','Al-Muqsit','The Equitable','Insaaf karne wala'],['الجامع','Al-Jami\'','The Gatherer','Jama karne wala'],['الغني','Al-Ghaniyy','The Self-Sufficient','Be-niyaz, ghani'],['المغني','Al-Mughni','The Enricher','Ghani karne wala'],['المانع','Al-Mani\'','The Preventer','Rokne wala'],
['الضار','Ad-Darr','The Distresser','Nuqsaan ka ikhtiyar rakhne wala'],['النافع','An-Nafi\'','The Benefactor','Nafa dene wala'],['النور','An-Nur','The Light','Noor'],['الهادي','Al-Hadi','The Guide','Hidayat dene wala'],['البديع','Al-Badi\'','The Incomparable Originator','Anokha banane wala'],['الباقي','Al-Baqi','The Everlasting','Hamesha baaqi rehne wala'],['الوارث','Al-Warith','The Inheritor','Sab ka waaris'],['الرشيد','Ar-Rasheed','The Guide to the Right Path','Sahi raah dikhane wala'],['الصبور','As-Sabur','The Patient','Bahut sabr karne wala']];
const AS99={q:''};
function toolAsma(el){
  const q=(AS99.q||'').toLowerCase();
  const L=ASMA.map((a,i)=>({a,i:i+1})).filter(x=>!q||(x.a[1]+' '+x.a[2]+' '+x.a[3]+' '+x.a[0]).toLowerCase().includes(q)||String(x.i)===q);
  el.innerHTML=`<div class="card"><h2>✨ ${T('Allah ke 99 naam','The 99 Names of Allah','اللہ کے ۹۹ نام','अल्लाह के 99 नाम')}</h2>
  <p class="muted sm">${T('Hadees: “Allah ke 99 naam hain, jo inhein yaad kar le (aur unke taqaze par amal kare) jannat mein dakhil hoga.” (Bukhari, Muslim)','Hadith: “Allah has 99 names; whoever memorises them (and acts upon them) will enter Paradise.” (Bukhari, Muslim)','حدیث: “اللہ کے ۹۹ نام ہیں، جو انہیں یاد کر لے (اور ان کے تقاضے پر عمل کرے) جنت میں داخل ہوگا۔” (بخاری، مسلم)','हदीस: “अल्लाह के 99 नाम हैं, जो इन्हें याद कर ले (और इनके तक़ाज़े पर अमल करे) जन्नत में दाख़िल होगा।” (बुख़ारी, मुस्लिम)')}</p>
  <input id="asq" placeholder="${T('Naam ya matlab dhundein…','Search name or meaning…','نام یا مطلب تلاش کریں…','नाम या मतलब ढूँढें…')}" value="${esc(AS99.q||'')}" autocomplete="off"></div>
  <div class="asgrid" id="asg">${asmaList(L)}</div>`;
  const inp=$('#asq',el);inp.addEventListener('input',()=>{AS99.q=inp.value;const q2=inp.value.toLowerCase();$('#asg',el).innerHTML=asmaList(ASMA.map((a,i)=>({a,i:i+1})).filter(x=>!q2||(x.a[1]+' '+x.a[2]+' '+x.a[3]+' '+x.a[0]).toLowerCase().includes(q2)||String(x.i)===q2))})}
function asmaList(L){return L.map(x=>`<div class="asn"><span class="asi">${x.i}</span><div class="ar" dir="rtl">${x.a[0]}</div><b>${x.a[1]}</b><small>${S.lang==='en'?x.a[2]:x.a[3]}</small>${S.lang==='en'?'':`<small class="muted">${x.a[2]}</small>`}</div>`).join('')||`<p class="muted c">—</p>`}

/* Qibla + masjid */
function toolQibla(el){
  const ll=S.lat!=null?`${S.lat},${S.lng}`:'';
  el.innerHTML=`<div class="card"><h2>🧭 ${T('Qibla aur qareeb ki masjid','Qibla & nearby masjid','قبلہ اور قریب کی مسجد','क़िबला और क़रीब की मस्जिद')}</h2>
  <div class="grid2">${ext('https://qiblafinder.withgoogle.com/','btn',`🧭 ${T('Qibla dekhein','Find Qibla','قبلہ دیکھیں','क़िबला देखें')}`)}${ext(ll?`https://www.google.com/maps/search/masjid/@${ll},15z`:'https://www.google.com/maps/search/masjid+near+me','btn',`🕌 ${T('Qareeb ki masjid','Nearby masjid','قریب کی مسجد','क़रीब की मस्जिद')}`)}</div>
  <p class="muted sm mt">${T('Yeh dono Google ke zariye khulte hain. Apni masjid ke azan/jamaat ke waqt Namaz tab mein set karein.','Both open through Google. Set your masjid\'s azan/jamaat times in the Namaz tab.','یہ دونوں گوگل کے ذریعے کھلتے ہیں۔ اپنی مسجد کی اذان/جماعت کا وقت نماز ٹیب میں سیٹ کریں۔','ये दोनों गूगल के ज़रिए खुलते हैं। अपनी मस्जिद की अज़ान/जमात का वक़्त नमाज़ टैब में सेट करें।')}</p>
  <button class="btn ghost full mt" data-a="tab" data-v="deen" data-s="namaz">🕌 ${T('Masjid ke waqt set karein','Set masjid times','مسجد کے اوقات سیٹ کریں','मस्जिद के वक़्त सेट करें')}</button></div>`}

/* tiny optional business: the user's own */
function toolBiz(el){
  const B=S.myBiz||{on:false,name:''};
  if(!B.on){el.innerHTML=`<div class="card"><h2>💼 ${T('Mera kaarobar (zaroorat ho to)','My business (optional)','میرا کاروبار (اختیاری)','मेरा कारोबार (ज़रूरत हो तो)')}</h2><p class="muted sm">${T('Agar aap ka apna chhota kaarobar hai to uski kamai-kharcha alag likh sakte hain. Zaroorat na ho to chhod dein.','If you run a small business, you can track its income and expenses separately. Skip if you do not need it.','اگر آپ کا اپنا چھوٹا کاروبار ہے تو اس کی کمائی-خرچ الگ لکھ سکتے ہیں۔ ضرورت نہ ہو تو چھوڑ دیں۔','अगर आपका अपना छोटा कारोबार है तो उसकी कमाई-ख़र्च अलग लिख सकते हैं। ज़रूरत न हो तो छोड़ दें।')}</p><button class="btn full" data-a="bizon">＋ ${T('Kaarobar jodein','Add my business','کاروبار جوڑیں','कारोबार जोड़ें')}</button></div>`;return}
  const mo=dkey().slice(0,7);const rows=(typeof FIN!=='undefined'?FIN:[]).filter(x=>x.biz==='mine'&&x.date.slice(0,7)===mo);
  const I=rows.filter(x=>x.type==='in').reduce((a,x)=>a+x.amt,0),O=rows.filter(x=>x.type==='out').reduce((a,x)=>a+x.amt,0);
  el.innerHTML=`<div class="card hero"><div class="row sp"><h2 style="margin:0">💼 ${esc(B.name||T('Mera kaarobar','My business'))}</h2><button class="lnk" data-a="bizon">✏️</button></div>
  <div class="stats mt"><div class="stat"><div class="sv" style="color:#3fd49b">${rupee(I)}</div><div class="sl">${T('Is mahine kamai','Income this month','اس مہینے کمائی','इस महीने कमाई')}</div></div><div class="stat"><div class="sv" style="color:#ff7a59">${rupee(O)}</div><div class="sl">${T('Kharcha','Expenses','خرچ','ख़र्च')}</div></div><div class="stat"><div class="sv">${rupee(I-O)}</div><div class="sl">${T('Bachat','Net','بچت','बचत')}</div></div></div>
  <div class="grid2 mt"><button class="btn" data-a="bizadd" data-v="in">＋ ${T('Kamai','Income','کمائی','कमाई')}</button><button class="btn ghost" data-a="bizadd" data-v="out">－ ${T('Kharcha','Expense','خرچ','ख़र्च')}</button></div>
  <button class="btn s ghost full mt" data-a="tab" data-v="kaam" data-s="paisa">${T('Poora hisaab dekhein','See full ledger','پورا حساب دیکھیں','पूरा हिसाब देखें')}</button></div>`}
A.bizon=()=>form(T('Kaarobar ka naam','Business name','کاروبار کا نام','कारोबार का नाम'),[{k:'n',l:T('Naam','Name','نام','नाम'),v:(S.myBiz||{}).name||'',p:T('jaise: Ahmed Traders','e.g. Ahmed Traders')}],o=>{S.myBiz={on:true,name:o.n};saveS();pubBizSync();rerender()},{extra:S.myBiz&&S.myBiz.on?`<button class="btn bad s full" style="margin-top:8px" data-a="bizoff">${T('Kaarobar hata dein','Remove business','کاروبار ہٹا دیں','कारोबार हटा दें')}</button>`:''});
A.bizoff=()=>{S.myBiz={on:false,name:''};saveS();pubBizSync();closeDlg();rerender()};
A.bizadd=el=>{const type=el.dataset.v;form(type==='in'?T('Kamai likhein','Add income'):T('Kharcha likhein','Add expense'),[{k:'amt',l:T('Raqam (₹)','Amount (₹)'),t:'number',m:'decimal'},{k:'note',l:T('Note','Note')}],o=>{if(!(+o.amt>0)){toast(T('Raqam likhein','Enter amount'));return false}finAdd({type,amt:o.amt,biz:'mine',cat:'',note:o.note});sfx('save');rerender()})};

/* ---------- 7. Quran: settings clearly on top ---------- */
(function(){const _rq=renderQuran;renderQuran=async function(el){await _rq(el);
  const qv=el.querySelector('.qview');if(!qv||QS.view==='reader')return;
  const det=[...el.querySelectorAll('details.card')].find(d=>d.querySelector('.qopt'));
  const view=qv.outerHTML;qv.remove();if(det)det.remove();
  const card=`<div class="card hero qsettings"><div class="row sp"><h2 style="margin:0">⚙️ ${T('Quran settings','Quran settings','قرآن سیٹنگز','क़ुरआन सेटिंग्स')}</h2>${fsBar()}</div>
   <div class="eyebrow" style="margin:10px 0 4px">📖 ${T('Padhne ka andaaz','Reading style','پڑھنے کا انداز','पढ़ने का अंदाज़')}</div>${view}
   <p class="muted sm" style="margin:6px 0 0">${T('Tarjuma aap ki app-zubaan mein: Urdu / Hindi / English.','Translation follows your app language: Urdu / Hindi / English.','ترجمہ آپ کی ایپ کی زبان میں: اردو / ہندی / انگلش۔','तर्जुमा आपकी ऐप-ज़बान में: उर्दू / हिन्दी / इंग्लिश।')}</p>
   ${qOptsHTML()}</div>`;
  el.insertAdjacentHTML('afterbegin',card)}})();

/* ---------- 8. Settings: extra public cards ---------- */
(function(){const _rs=renderSettings;renderSettings=function(el){_rs(el);
  el.insertAdjacentHTML('afterbegin',`<div class="card hero"><div class="row">${logoBox('logos/qs.webp',44)}<div class="grow"><b>Deen Saathi by Quranic Science</b><div class="muted sm">${T('Muft • bina ads • bina login','Free • no ads • no login','مفت • بغیر اشتہار • بغیر لاگ ان','मुफ़्त • बिना विज्ञापन • बिना लॉगिन')}</div></div></div>
    <div class="grid2 mt"><button class="btn" data-a="obredo">🧭 ${T('Setup dobara','Run setup again','سیٹ اپ دوبارہ','सेटअप दोबारा')}</button><button class="btn ghost" data-a="tourstart">🎓 ${T('App tour','App tour','ایپ ٹور','ऐप टूर')}</button></div><button class="btn gold full mt" data-a="tutvid">🎬 ${T('Tutorial video dekhein','Watch tutorial video','ٹیوٹوریل ویڈیو دیکھیں','ट्यूटोरियल वीडियो देखें')}</button></div>`);
  el.insertAdjacentHTML('beforeend',`<div class="card"><h2>${T('Masjid aur yaad dahani','Masjid & reminders','مسجد اور یاد دہانی','मस्जिद और याद-दिहानी')}</h2><div class="fs"><span>${T('Jamaat se ~8 min pehle “kya masjid mein dakhil ho gaye?” aur dua','~8 min before jamaat: “did you enter the masjid?” + dua','جماعت سے ~۸ منٹ پہلے “کیا مسجد میں داخل ہو گئے؟” اور دعا','जमात से ~8 मिनट पहले “क्या मस्जिद में दाख़िल हो गए?” और दुआ')}</span><input type="checkbox" class="sw" data-a="set" data-p="msjAsk" data-t="check" ${S.msjAsk!==false?'checked':''}></div></div>`)}})();

/* ---------- 9. Masjid-entry reminder (web + native) ---------- */
const MSJ_AR='اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ';
(function(){
  const _mk=mkQ;mkQ=function(kind,o={}){
    if(kind==='masjid')return{kind,key:'ms-'+dkey()+o.p,p:o.p,title:T('Kya aap masjid mein dakhil ho gaye?','Have you entered the masjid?','کیا آپ مسجد میں داخل ہو گئے؟','क्या आप मस्जिद में दाख़िल हो गए?'),voice:'msj_ask',btns:[['y',T('✅ Haan, dakhil ho gaya','✅ Yes, I\'m in','✅ ہاں، داخل ہو گیا','✅ हाँ, दाख़िल हो गया')],['n',T('Abhi nahi','Not yet','ابھی نہیں','अभी नहीं')]]};
    return _mk(kind,o)};
  const _aq=answerQ;answerQ=function(id,b){const i=PQ.findIndex(x=>x.id===id);const q=PQ[i];
    if(q&&q.kind==='masjid'){PQ.splice(i,1);savePQ();closeDlg();if(b==='y')msjYes();else toast(T('Theek hai. Dakhil hon to dua: '+MSJ_AR,'OK. When you enter, say: '+MSJ_AR));try{nativeSync()}catch(e){}if(typeof rerender==='function')rerender();return}
    return _aq(id,b)};
  const _de=dayEvents;dayEvents=function(){const ev=_de();const d=dkey();
    if(TM&&!TM.stale&&S.msjAsk!==false)PRAY.forEach(p=>{const j=jamTime(p);if(!j)return;j.setMinutes(j.getMinutes()-8);ev.push({key:d+'|msq-'+p,at:j,win:8*60000,run:()=>{if(!inMsj(p)&&!hzToday()[p])addQ(mkQ('masjid',{p}))}})});
    if(TM&&!TM.stale&&S.rozaOn){const f=atTime(TM.t.Fajr),m=atTime(TM.t.Maghrib);
      if(f){f.setMinutes(f.getMinutes()-15);ev.push({key:d+'|rzs',at:f,win:15*60000,run:()=>notify(T('Sehri ka waqt khatam hone wala hai','Sehri is about to end','سحری کا وقت ختم ہونے والا ہے','सहरी का वक़्त ख़त्म होने वाला है'),T('15 minute baaqi hain.','15 minutes left.','۱۵ منٹ باقی ہیں۔','15 मिनट बाक़ी हैं।'),{k:'alert',tab:'more',sub:'tools',voice:'alert_event'})})}
      if(m)ev.push({key:d+'|rzi',at:m,win:15*60000,run:()=>notify(T('Iftar ka waqt ho gaya 🌙','It is iftar time 🌙','افطار کا وقت ہو گیا 🌙','इफ़्तार का वक़्त हो गया 🌙'),'',{k:'alert',tab:'more',sub:'tools',voice:'alert_event'})})}
    return ev};
  /* native (phone closed): same events pushed to the Android scheduler */
  window.pubEvents=function(base,az,jm){const out=[];const isToday=dkey(base)===dkey();
    if(S.msjAsk!==false)PRAY.forEach(p=>{const j=jm(p);if(!j)return;j.setMinutes(j.getMinutes()-8);if(inMsj(p,j))return;
      if(isToday&&hzToday()[p])return;
      out.push({at:j,title:mkQ('masjid',{p}).title,body:T('Dakhil hon to dua: '+MSJ_AR,'On entering say: '+MSJ_AR,'داخل ہوں تو دعا: '+MSJ_AR,'दाख़िल हों तो दुआ: '+MSJ_AR),voice:'msj_ask',tab:'home',qk:'masjid',qp:p})});
    if(S.rozaOn){const f=az('Fajr'),m=az('Maghrib');
      if(f){f.setMinutes(f.getMinutes()-15);out.push({at:f,title:T('Sehri ka waqt khatam hone wala hai','Sehri is about to end','سحری کا وقت ختم ہونے والا ہے','सहरी का वक़्त ख़त्म होने वाला है'),body:T('15 minute baaqi hain.','15 minutes left.'),voice:'alert_event',tab:'more',sub:'tools'})}
      if(m)out.push({at:m,title:T('Iftar ka waqt ho gaya 🌙','It is iftar time 🌙','افطار کا وقت ہو گیا 🌙','इफ़्तार का वक़्त हो गया 🌙'),body:'',voice:'alert_event',tab:'more',sub:'tools'})}
    return out};
})();
function msjYes(){if(!inMsj()&&typeof AX.msjtog==='function')AX.msjtog();else if(typeof AX.msjdua==='function')AX.msjdua()}

/* ---------- 10. Answers tapped on notification buttons while the app was closed ---------- */
function natAnswers(){
  if(!window.AndroidPA||!AndroidPA.takeAnswers)return;let arr=[];try{arr=JSON.parse(AndroidPA.takeAnswers()||'[]')}catch(e){return}
  if(!arr.length)return;let masjid=null;
  arr.forEach(a=>{const t=a.t||Date.now(),d=dkey(new Date(t));
    if(a.qk==='hazri'&&a.qp&&['j','a','q'].includes(a.qb))setHz(d,a.qp,a.qb);
    else if(a.qk==='sadqa'&&a.qb==='y'&&!sdDone(d))sdAdd(+S.sadqaAmt||0,'',d);
    else if(a.qk==='tilawat'&&a.qb==='y')tlAdd(Math.max(0,S.tilTarget-(TL.days[d]||0)),d);
    else if(a.qk==='masjid'&&a.qb==='y'&&Date.now()-t<25*60000)masjid=a.qp||true;
    PQ=PQ.filter(q=>!(q.kind===a.qk&&dkey(new Date(q.t))===d&&(a.qk!=='hazri'||q.p===a.qp)));});
  savePQ();try{nativeSync()}catch(e){}
  if(masjid)setTimeout(msjYes,500);
  if(typeof rerender==='function')rerender()}
if(window.AndroidPA){setTimeout(natAnswers,1800);document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(natAnswers,300)})}

/* ---------- 11. loads that make no sense in a public app ---------- */
try{FBX.init=async()=>{};syncBiz=async()=>{};loadInbox=async()=>{};fetchNews=async()=>{}}catch(e){}

/* headers that said Noor / Office etc. */
try{EYES.more=()=>T('TOOLS • SUPPORT • SETTINGS','TOOLS • SUPPORT • SETTINGS','ٹولز • سپورٹ • سیٹنگز','टूल्स • सपोर्ट • सेटिंग्स');EYES.home=()=>T('ASSALAMU ALAIKUM','ASSALAMU ALAIKUM','السلام علیکم','अस्सलामु अलैकुम');EYES.kaam=()=>T('KAAM • HISAAB • WAQT','TASKS • MONEY • TIME','کام • حساب • وقت','काम • हिसाब • वक़्त');TITLES.more=()=>T('Aur','More','مزید','और')}catch(e){}


/* ---------- Tutorial video (bundled, simple-language narration) ---------- */
A.tutvid=()=>{try{VO.stop()}catch(e){}dlg(`<div class="card" style="margin:0"><h2>🎬 ${T('Deen Saathi ka tutorial','Deen Saathi tutorial','دین ساتھی کا ٹیوٹوریل','दीन साथी का ट्यूटोरियल')}</h2><video id="tutv" src="tutorial.mp4" controls playsinline preload="metadata" style="width:100%;max-height:64vh;border-radius:12px;background:#000"></video><div class="muted sm mt">${T('Sirf 2 minute — awaaz ke saath poora app samjhein.','Just 2 minutes — learn the whole app with voice.','صرف ۲ منٹ — آواز کے ساتھ پورا ایپ سمجھیں۔','सिर्फ़ 2 मिनट — आवाज़ के साथ पूरा ऐप समझें।')}</div><button class="btn full mt" data-a="closedlg">${T('Band karein','Close','بند کریں','बंद करें')}</button></div>`,{onClose:()=>{const v=document.getElementById('tutv');if(v)v.pause()}});const v=document.getElementById('tutv');if(v){const p=v.play();if(p&&p.catch)p.catch(()=>{})}};
(function(){const _tc=tourCard;tourCard=function(){const h=_tc();if(!h)return h;return h.replace('<button class="btn s ghost" data-a="tourx">','<button class="btn s ghost" data-a="tutvid">🎬</button><button class="btn s ghost" data-a="tourx">')}})();

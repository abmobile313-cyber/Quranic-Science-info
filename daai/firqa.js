/* Firqa / maktab-e-fikr layer (Deen Saathi).
   Fiqh (Hanafi/Shafi'i/Maliki/Hanbali/Ahl-e-Hadees) stays in S.maslak and only decides Asr time & rulings.
   S.firqa: 'deo' = Deobandi (all features incl. Dawat-o-Tabligh, Tablighi nisab),
            'bar' = Barelvi (famous hadith books + Barelvi ulama's books; no Tablighi nisab / dawat work / 6 sifat),
            'any' = koi khaas nahi (only common books: Quran, famous hadith).
   Rule: nothing that one side objects to is shown to the other side. */
const FIRQA=[['deo',()=>T('Deobandi','Deobandi','دیوبندی','देवबंदी')],['bar',()=>T('Barelvi (Ahl-e-Sunnat)','Barelvi (Ahl-e-Sunnat)','بریلوی (اہلِ سنت)','बरेलवी (अहल-ए-सुन्नत)')],['any',()=>T('Koi khaas nahi — sirf aam cheezein','None in particular — common content only','کوئی خاص نہیں — صرف عام چیزیں','कोई ख़ास नहीं — सिर्फ़ आम चीज़ें')]];
const FQ=()=>S.firqa||'any';const isDeo=()=>FQ()==='deo';const isBar=()=>FQ()==='bar';
/* Books */
const FQ_DEO=['fa1','fa2','mu','hs','bz','ie','jm'];          /* Deobandi ulama / Tablighi nisab */
const FQ_COMMON=['hm','st','rs','bm','ad','mm','sn','ih'];    /* famous hadith / accepted by all */
const FQ_HIDE=['km'];                                          /* disputed among Ahl-e-Sunnat themselves → not shown to anyone */
function bookOK(b){if(!b||!b.id)return true;if(FQ_HIDE.includes(b.id))return false;if(b.fq)return b.fq===FQ();
  if(isDeo())return true;            /* Deobandi: everything */
  return FQ_COMMON.includes(b.id)}   /* Barelvi & aam: only famous hadith books (+ their own, via b.fq) */
const FQ_BOOKS=[
 {id:'b_ki',fq:'bar',c:'deen',n:'Kanzul Iman (Tarjuma-e-Quran)',u:'کنز الایمان',a:'Imam Ahmad Raza Khan',p:'pd',d:['Quran ka mashhoor Urdu tarjuma.','Well-known Urdu translation of the Quran.']},
 {id:'b_bs',fq:'bar',c:'deen',n:'Bahar-e-Shariat',u:'بہارِ شریعت',a:'Mufti Amjad Ali Azmi',p:'u',d:['Fiqh-e-Hanafi ke masail — namaz, roza, zakat, hajj, muamlaat.','Hanafi fiqh rulings — salah, fasting, zakat, hajj, dealings.']},
 {id:'b_mm',fq:'bar',c:'deen',n:'Mirat-ul-Manajih (Sharh Mishkat)',u:'مرآۃ المناجیح',a:'Mufti Ahmad Yar Khan Naeemi',p:'u',d:['Mishkat-ul-Masabih ki Urdu sharah.','Urdu commentary of Mishkat al-Masabih.']},
 {id:'b_ni',fq:'bar',c:'deen',n:'Noor-ul-Irfan (Hashiya Kanzul Iman)',u:'نور العرفان',a:'Mufti Ahmad Yar Khan Naeemi',p:'u',d:['Kanzul Iman ke saath mukhtasar tafseeri hashiya.','Short tafsir notes with Kanzul Iman.']},
 {id:'b_fr',fq:'bar',c:'deen',n:'Fatawa Razawiyya',u:'فتاویٰ رضویہ',a:'Imam Ahmad Raza Khan',p:'pd',d:['Fiqh-e-Hanafi ke fatawa ka bada majmua.','Large collection of Hanafi fatwas.']},
 {id:'b_hb',fq:'bar',c:'deen',n:'Hadaiq-e-Bakhshish',u:'حدائقِ بخشش',a:'Imam Ahmad Raza Khan',p:'pd',d:['Naat-e-Rasool ﷺ ka majmua.','Collection of naat poetry.']},
 {id:'b_dk',fq:'bar',c:'deen',n:'Dalail-ul-Khairat',u:'دلائل الخیرات',a:'Imam Muhammad bin Sulaiman al-Jazuli',p:'pd',d:['Durood shareef ka mashhoor wazifa.','Famous litany of salawat.']},
 {id:'b_qb',fq:'bar',c:'deen',n:'Qasida Burda Shareef',u:'قصیدہ بردہ شریف',a:'Imam Sharafuddin al-Busiri',p:'pd',d:['Nabi ﷺ ki shaan mein mashhoor qaseeda.','Famous ode in praise of the Prophet ﷺ.']},
 {id:'d_mq',fq:'deo',c:'deen',n:'Maariful Quran',u:'معارف القرآن',a:'Mufti Muhammad Shafi',p:'c',d:['Quran ki mashhoor Urdu tafseer.','Well-known Urdu tafsir.']},
 {id:'d_bq',fq:'deo',c:'deen',n:'Bayan-ul-Quran',u:'بیان القرآن',a:'Maulana Ashraf Ali Thanvi',p:'pd',d:['Tarjuma aur tafseer.','Translation and tafsir.']},
 {id:'d_ik',fq:'deo',c:'deen',n:'Islahi Khutbat',u:'اصلاحی خطبات',a:'Mufti Muhammad Taqi Usmani',p:'c',d:['Islah-e-nafs aur roz-marra ki zindagi par bayanaat.','Talks on self-reform and daily life.']},
 {id:'d_ti',fq:'deo',c:'deen',n:'Taleem-ul-Islam',u:'تعلیم الاسلام',a:'Mufti Kifayatullah Dehlvi',p:'pd',d:['Bachon aur bado ke liye deen ki buniyadi baatein (sawal-jawab).','Basics of deen in Q&A form.']},
 {id:'d_sm',fq:'deo',c:'deen',n:'Seerat-ul-Mustafa ﷺ',u:'سیرۃ المصطفیٰ',a:'Maulana Idris Kandhlawi',p:'c',d:['Nabi ﷺ ki seerat — tafseel se.','Detailed seerah.']},
];
try{FQ_BOOKS.forEach(b=>{if(!MKB.some(x=>x.id===b.id))MKB.push(b)})}catch(e){}
/* Kutub segments: Hayatus Sahaba & 6 Sifat are Tablighi-nisab → Deobandi only */
function fqSeg(id){if(id==='hayat'||id==='sifat')return isDeo();return true}
/* Deen sub-tabs: Dawat tab for Deobandi */
try{const base=SUBS.deen.slice();Object.defineProperty(SUBS,'deen',{configurable:true,get(){return isDeo()?base.concat([['dawat',()=>T('🤝 Dawat','🤝 Dawat','🤝 دعوت','🤝 दावत')]]):isBar()?base.concat([['amal',()=>T('🌹 Amaal','🌹 Amaal','🌹 اعمال','🌹 आमाल')]]):base}})}catch(e){}
/* Dawat-o-Tabligh hub (Deobandi) — kaam, events, reports, nisab books; no news here */
function renderDawat(el){renderKhabar(el);el.insertAdjacentHTML('afterbegin',`<div class="card hero"><h2 style="margin:0">🤝 ${T('Dawat-o-Tabligh','Dawat-o-Tabligh','دعوت و تبلیغ','दावत-ओ-तब्लीग़')}</h2><div class="muted sm" style="margin-top:4px">${T('Gasht, taleem, mashwara, shab-guzari aur 3 din — sab ek jagah. Har kaam par ✓ lagayein, hafte/mahine ki report khud banegi.','Gasht, taleem, mashwara, shab-guzari and 3 days — all in one place.','گشت، تعلیم، مشورہ، شب گزاری اور 3 دن — سب ایک جگہ۔ ہر کام پر ✓ لگائیں، ہفتے/مہینے کی رپورٹ خود بنے گی۔','गश्त, तालीम, मशवरा, शब-गुज़ारी और 3 दिन — सब एक जगह। हर काम पर ✓ लगाएँ, हफ़्ते/महीने की रिपोर्ट ख़ुद बनेगी।')}</div><div class="row wrap mt"><button class="btn s ghost" data-a="fqgo" data-v="sifat">✨ ${T('6 Sifat','6 Sifat','6 صفات','6 सिफ़ात')}</button><button class="btn s ghost" data-a="fqgo" data-v="hayat">📚 ${T('Hayatus Sahaba','Hayatus Sahaba','حیاۃ الصحابہ','हयातुस्सहाबा')}</button><button class="btn s ghost" data-a="fqgo" data-v="hadith">📖 ${T('Fazail-e-Amaal / Muntakhab','Fazail-e-Amaal / Muntakhab','فضائلِ اعمال / منتخب احادیث','फ़ज़ाइल-ए-आमाल / मुन्तख़ब')}</button></div></div>`)}
A.fqgo=b=>{KU.v=b.dataset.v;if(b.dataset.v==='hadith'&&typeof HD!=='undefined')HD.v='home';go('deen','kutub')};
/* Dawat events / home card only for Deobandi */
{const _g=gashtEvents,_r=reportEvents,_w=wkEvents,_c=cevEvents,_h=kaamHomeCard;
 gashtEvents=function(){return isDeo()?_g.apply(this,arguments):[]};
 reportEvents=function(){return isDeo()?_r.apply(this,arguments):[]};
 wkEvents=function(){return isDeo()?_w.apply(this,arguments):[]};
 cevEvents=function(){return isDeo()?_c.apply(this,arguments):[]};
 kaamHomeCard=function(){return isDeo()?_h.apply(this,arguments):''};}
/* Settings row */
/* existing users who already use dawat features → Deobandi; everyone else is asked once (card on Home + one dialog) */
if(!S.firqa){const n=k=>Object.keys(store.get(k,{})||{}).length;if(n('gasht2')||n('wk2')||(store.get('cev',[])||[]).length){S.firqa='deo';saveS()}}
/* Deobandi gets the daily 'deeni mamool' (taleem / dhai ghante) question ON like in the personal app */
function fqApply(){if(isDeo()){if(!S.mamool){S.mamool='21:00';S.mamoolByFq=1}}else if(S.mamoolByFq){S.mamool='';S.mamoolByFq=0}saveS()}
try{fqApply()}catch(e){}
const fqNeedAsk=()=>!S.firqa&&(!S.maslak||S.maslak==='hanafi'||S.maslak==='other');
function firqaAskHTML(){return`<div class="eyebrow">${T('EK ZAROORI SAWAL','ONE QUICK QUESTION','ایک ضروری سوال','एक ज़रूरी सवाल')}</div><h2 style="margin:6px 0 8px">${T('Aap ka maktab-e-fikr','Your school of thought','آپ کا مکتبِ فکر','आपका मकतब-ए-फ़िक्र')}</h2><p class="muted sm">${T('Isi ke hisaab se kitabein aur amaal dikhenge. Quran, mashhoor hadees aur namaz sab ke liye ek jaise hain.','Books and practices are shown accordingly. Quran, famous hadith and prayer are the same for everyone.','اسی کے حساب سے کتابیں اور اعمال دکھیں گے۔ قرآن، مشہور حدیثیں اور نماز سب کے لیے ایک جیسے ہیں۔','इसी के हिसाब से किताबें और आमाल दिखेंगे। क़ुरआन, मशहूर हदीसें और नमाज़ सब के लिए एक जैसे हैं।')}</p><div class="obopts" style="margin-top:10px">${FIRQA.map(m=>`<button class="obopt" data-a="fqpick" data-v="${m[0]}">${m[1]()}</button>`).join('')}</div>`}
A.fqpick=b=>{S.firqa=b.dataset.v;fqApply();saveS();try{nativeSync()}catch(e){}closeDlg();toast(T('Mahfooz ✅','Saved ✅','محفوظ ✅','महफ़ूज़ ✅'));setTimeout(()=>location.reload(),300)};
function firqaHomeCard(){if(!fqNeedAsk())return'';return`<div class="card" style="border:1px solid var(--gold,#d4a84b)">${firqaAskHTML()}</div>`}
setTimeout(()=>{try{if(fqNeedAsk()&&S.obDone&&!$('#dlg').open&&!document.getElementById('ob')){const n=+store.get('fq_asked',0);if(n<2){store.set('fq_asked',n+1);dlg(firqaAskHTML())}}}catch(e){}},3500);

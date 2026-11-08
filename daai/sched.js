'use strict';
/* ===== prayer times, hazri, daily trackers, pending questions, scheduler ===== */
let TM=null,TM_TMR=null; // today / tomorrow {t:{Fajr:'05:12',...},hijri:'...'}
let HZ=store.get('hazri',{});            // {date:{Fajr:'j'|'a'|'q'}}
let SD=store.get('sadqa',{});            // {date:[{amt,note,t}]}  or {date:{done:true}}
let TL=store.get('tilawat',{days:{},last:null}); // days:{date:ayahs}
let AZ=store.get('azkar',{});            // {date:{id:count}}
let MM=store.get('mamool',{});           // {date:{talim:1,gasht:1,minutes:n,...}}
let PQ=store.get('pq',[]);               // pending questions
let SNZ=store.get('snz',[]);
const savePQ=()=>store.set('pq',PQ);
const tuneQ=()=>{const t=S.tune||{};const v=['Imsak','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Sunset','Isha','Midnight'].map(k=>(k==='Sunset'?(+t.Maghrib||0):(+t[k]||0)));return v.some(x=>x)?'&tune='+v.join(','):''};
const locKey=()=>(S.lat!=null?`${S.lat.toFixed(2)},${S.lng.toFixed(2)}`:`${S.city},${S.country}`)+'|'+S.method+'|'+S.school+tuneQ();
const dmy=d=>pad(d.getDate())+'-'+pad(d.getMonth()+1)+'-'+d.getFullYear();
async function fetchTimes(d){
  const base=S.lat!=null?`https://api.aladhan.com/v1/timings/${dmy(d)}?latitude=${S.lat}&longitude=${S.lng}&method=${S.method}&school=${S.school}${tuneQ()}`
    :`https://api.aladhan.com/v1/timingsByCity/${dmy(d)}?city=${encodeURIComponent(S.city)}&country=${encodeURIComponent(S.country)}&method=${S.method}&school=${S.school}${tuneQ()}`;
  const c=new AbortController();const to=setTimeout(()=>c.abort(),9000);
  try{const r=await fetch(base,{signal:c.signal});const j=await r.json();const t=j.data.timings,o={};
    ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].forEach(k=>o[k]=(t[k]||'').slice(0,5));
    const h=j.data.date&&j.data.date.hijri;return{t:o,hijri:h?`${h.day} ${h.month.en} ${h.year}`:'',hijriAr:h?`${h.day} ${h.month.ar} ${h.year}`:''}}finally{clearTimeout(to)}}
async function loadTimes(force){
  const cache=store.get('times',{}),lk=locKey(),k=dkey(),k2=dkey(addDays(new Date(),1));
  if(cache.loc!==lk||force){for(const x of Object.keys(cache))if(x!=='loc')delete cache[x];cache.loc=lk}
  try{if(!cache[k])cache[k]=await fetchTimes(new Date());
    if(!cache[k2])try{cache[k2]=await fetchTimes(addDays(new Date(),1))}catch(e){}
  }catch(e){}
  for(const x of Object.keys(cache)){if(x!=='loc'&&x<k)delete cache[x]}
  store.set('times',cache);TM=cache[k]||null;TM_TMR=cache[k2]||null;
  if(!TM){const any=Object.keys(cache).filter(x=>x!=='loc').sort()[0];if(any){TM=Object.assign({},cache[any],{stale:true})}}
  return TM}
const HMON=[[/Muharram/i,'محرم','मुहर्रम'],[/Safar/i,'صفر','सफ़र'],[/Rabi.{0,4}(al|ul).{0,3}(Awwal|Aw)/i,'ربیع الاول','रबीउल अव्वल'],[/Rabi.{0,4}(al|ul|as).{0,3}(Th|Akh|Sani)/i,'ربیع الآخر','रबीउल आख़िर'],[/Jumad.{0,5}(Awwal|Ula|Aw)/i,'جمادی الاولیٰ','जमादिल अव्वल'],[/Jumad.{0,5}(Th|Akh|Sani)/i,'جمادی الآخرہ','जमादिल आख़िर'],[/Rajab/i,'رجب','रजब'],[/Sha.?ban/i,'شعبان','शाबान'],[/Rama/i,'رمضان','रमज़ान'],[/Shaw/i,'شوال','शव्वाल'],[/Qa.?d/i,'ذوالقعدہ','ज़ुल-क़ादा'],[/Hij/i,'ذوالحجہ','ज़ुल-हिज्जा']];
const hijriTxt=()=>{if(!TM)return'';const h=TM.hijri||'';if(S.lang==='ur'||S.lang==='hi'){const i=S.lang==='ur'?1:2;for(const m of HMON){const r=h.replace(/[A-Za-z][A-Za-z\-' ]*[A-Za-z]/,w=>m[0].test(w)?m[i]:w);if(r!==h)return r}}return h};
const tdate=(hhmm,add=0)=>{const d=atTime(hhmm);if(d&&add)d.setDate(d.getDate()+add);return d};
function nextPrayer(){if(!TM)return null;const now=new Date();let prev=null;
  for(const k of PRAY){const d=azanTime(k)||tdate(TM.t[k]);if(d>now){return{k,at:d,prev:prev||(TM_TMR&&tdate(TM.t.Isha,-1))||new Date(now-4*36e5)}}prev=d}
  const f=(TM_TMR||TM).t.Fajr;return{k:'Fajr',at:tdate(f,1),prev:tdate(TM.t.Isha),tomorrow:true}}
/* azan = masjid azan time if set, else calculated prayer start. jamaat = masjid jamaat time if set, else azan/start + offset */
const azanTime=(k,d=new Date())=>{if(k==='Dhuhr'&&d.getDay()===5&&S.masjid&&hm(S.masjid.jz))return atTime(S.masjid.jz,d);const m=S.masjid&&S.masjid.az&&S.masjid.az[k];if(m&&hm(m))return atTime(m,d);if(!TM)return null;return atTime(TM.t[k],d)};
let jamTime=(k,d=new Date())=>{if(k==='Dhuhr'&&d.getDay()===5&&S.masjid&&hm(S.masjid.ju))return atTime(S.masjid.ju,d);const m=S.masjid&&S.masjid.jm&&S.masjid.jm[k];if(m&&hm(m))return atTime(m,d);const x=azanTime(k,d);if(!x)return null;x.setMinutes(x.getMinutes()+(S.jam[k]||0));return x};
const hhmmOf=d=>d?pad(d.getHours())+':'+pad(d.getMinutes()):'';

/* ---------- hazri ---------- */
const hzToday=()=>HZ[dkey()]||{};
function setHz(date,p,v){HZ[date]=HZ[date]||{};if(v)HZ[date][p]=v;else delete HZ[date][p];store.set('hazri',HZ)}
function hzScore(date){const h=HZ[date]||{};return PRAY.filter(p=>h[p]==='j'||h[p]==='a').length}
function hzStreak(){let n=0;for(let i=0;i<400;i++){const sc=hzScore(dkey(addDays(new Date(),-i)));if(sc===5)n++;else if(i===0)continue;else break}return n}
function hzStats(days){let j=0,a=0,q=0,tot=0;for(let i=0;i<days;i++){const h=HZ[dkey(addDays(new Date(),-i))]||{};PRAY.forEach(p=>{if(h[p]==='j')j++;else if(h[p]==='a')a++;else if(h[p]==='q')q++;tot++})}return{j,a,q,tot}}

/* ---------- sadqa / tilawat / azkar / mamool ---------- */
const sdList=(d=dkey())=>{const v=SD[d];return Array.isArray(v)?v:(v&&v.done?[{amt:0,t:0}]:[])};
const sdDone=(d=dkey())=>sdList(d).length>0;
const sadqaSug=(d=dkey())=>S.sadqaAmt>0?Math.round(S.sadqaAmt):Math.round((typeof revSources==='function'?revSources().filter(x=>x.d===d).reduce((a,x)=>a+x.amt,0):0)*S.sadqaPct/100);
function sadqaBody(d=dkey()){const a=sadqaSug(d),how=S.sadqaAmt>0?T('roz ka tay sadqa','fixed daily amount'):T(`kamai ka ${S.sadqaPct}%`,`${S.sadqaPct}% of earnings`);
  return a>0?T(`Aaj ka sadqa ₹${a} (${how}). Nikaalna na bhoolein.`,`Today's sadaqah ₹${a} (${how}). Do not forget.`,`آج کا صدقہ ₹${a} (${how})۔ نکالنا نہ بھولیں۔`,`आज का सदक़ा ₹${a} (${how})। निकालना न भूलें।`):T(`Aaj ka sadqa nikaalna na bhoolein (${how}).`,`Do not forget today's sadaqah (${how}).`,`آج کا صدقہ نکالنا نہ بھولیں (${how})۔`,`आज का सदक़ा निकालना न भूलें (${how})।`)}
function sdAdd(amt,note,date=dkey()){const l=sdList(date).filter(x=>x.t);l.push({amt:+amt||0,note:note||'',t:Date.now()});SD[date]=l;store.set('sadqa',SD);if(+amt>0&&typeof finAdd==='function')finAdd({type:'out',amt:+amt,cat:'Sadqa',biz:'personal',note:note||'Sadqa',date})}
const tlToday=()=>TL.days[dkey()]||0;
function tlAdd(n,date=dkey()){TL.days[date]=Math.max(0,(TL.days[date]||0)+n);store.set('tilawat',TL)}
function azGet(id,date=dkey()){return(AZ[date]||{})[id]||0}
function azSet(id,v,date=dkey()){AZ[date]=AZ[date]||{};AZ[date][id]=v;store.set('azkar',AZ)}
const mmToday=()=>MM[dkey()]||{};
function mmSet(k,v,date=dkey()){MM[date]=MM[date]||{};MM[date][k]=v;store.set('mamool',MM)}

/* ---------- pending questions ---------- */
const VN=S=>S.name||'';
function mkQ(kind,o={}){const n=VN(S);
  switch(kind){
    case 'hazri':return{kind,key:'hz-'+dkey()+o.p,p:o.p,title:T(`Kya aapne ${pname(o.p)} ada kar li?`,`Did you pray ${pname(o.p)}?`,`کیا آپ نے ${pname(o.p)} ادا کر لی؟`,`क्या आपने ${pname(o.p)} अदा कर ली?`),
      voice:'hz_'+o.p,
      btns:[['j',T('✅ Jamaat se','✅ In jamaat')],['a',T('🕌 Akele ada ki','🕌 Alone')],['q',T('⏳ Qaza','⏳ Missed')],['z',T('Baad mein','Later')]]};
    case 'sadqa':return{kind,key:'sd-'+dkey(),title:T('Kya aaj ka sadqa nikaal diya?','Did you give sadaqah today?'),
      voice:'sadqa_ask',
      btns:[['y',T('✅ Haan, nikaal diya','✅ Yes, done')],['n',T('Abhi nahi','Not yet')],['z',T('1 ghante baad','In 1 hour')]]};
    case 'tilawat':return{kind,key:'tl-'+dkey(),title:T(`Aaj ki tilawat ho gayi? Target ${S.tilTarget} ayaat`,`Did you recite today? Target ${S.tilTarget} ayahs`,`آج کی تلاوت ہو گئی؟ ہدف ${S.tilTarget} آیات`,`आज की तिलावत हो गई? लक्ष्य ${S.tilTarget} आयात`),
      voice:'tilawat_ask',
      btns:[['y',T('✅ Poora target','✅ Target done')],['p',T('Kuch hissa likhein','Log some')],['q',T('📖 Abhi padhta hoon','📖 Reading now')],['z',T('Baad mein','Later')]]};
    case 'azkar':return{kind,key:'az-'+dkey()+o.w,w:o.w,title:o.w==='m'?T('Subah ke azkar (100-100)','Morning azkar (100 each)'):T('Shaam ke azkar (100-100)','Evening azkar (100 each)'),
      voice:(o.w==='m'?'azkar_m':'azkar_e'),
      btns:[['go',T('Azkar kholo','Open azkar')],['z',T('Baad mein','Later')]]};
    case 'gasht':return{kind,key:'gs-'+dkey()+o.w,w:o.w,title:T(`Kya aaj ka gasht (${GK.find(g=>g[0]===o.w)[1]()}) ho gaya?`,`Did you do today's gasht (${GK.find(g=>g[0]===o.w)[1]()})?`),voice:'gasht',
      btns:[['y',T('✅ Ho gaya','✅ Done')],['n',T('❌ Nahi hua','❌ Not done')],['z',T('Baad mein','Later')]]};
    case 'mamool':return{kind,key:'mm-'+dkey(),title:T('Aaj ka deeni mamool (ta\'leem / dhai ghante)?','Today\'s deeni routine (taleem / 2.5 hrs)?'),
      voice:'taleem',
      btns:[['y',T('✅ Ho gaya','✅ Done')],['go',T('Kholo','Open')],['z',T('Baad mein','Later')]]};
  }}
function addQ(q,{silent}={}){if(PQ.find(x=>x.key===q.key))return;q.id=uid();q.t=Date.now();PQ.push(q);savePQ();
  if(typeof refreshHome==='function')refreshHome();
  if(silent)return;
  notify(q.title,'',{k:'alert',tab:'home',q:q.id,voice:q.voice,silent:true,actions:q.btns.slice(0,2).map(b=>({action:q.id+':'+b[0],title:b[1].replace(/^[^\wऀ-ॿ]+/,'')}))});
  if(!document.hidden&&!$('#dlg').open)openQ(q.id)}
function openQ(id){const q=PQ.find(x=>x.id===id);if(!q)return;
  dlg(`<div class="eyebrow">${T('SAWAL','QUESTION')}</div><h2 style="margin:6px 0 12px;font-size:21px">${esc(q.title)}</h2><div class="grid2">${q.btns.map(b=>`<button class="btn ${b[0]==='z'?'ghost':''}" data-a="qans" data-q="${q.id}" data-b="${b[0]}">${b[1]}</button>`).join('')}</div>`);
  VO.say(q.voice);sfx('chime')}
function answerQ(id,b){const i=PQ.findIndex(x=>x.id===id);if(i<0)return;const q=PQ[i];const d=dkey();let done=true,after=null;
  if(b==='z'){done=true;SNZ.push({q:{...q,id:null},at:Date.now()+(q.kind==='sadqa'?60:q.kind==='hazri'?20:45)*60000});store.set('snz',SNZ);toast(T('Theek hai, baad mein poochunga','OK, will ask again later'))}
  else if(q.kind==='hazri'){setHz(d,q.p,b);toast(b==='q'?T('Qaza likh li. Jald ada kar lein.','Marked missed. Please make it up soon.'):T('Barakallah! Likh liya ✅','Recorded ✅'));sfx('success')}
  else if(q.kind==='sadqa'){if(b==='y'){after='sadqa';sfx('success')}else{done=true;toast(T('Koshish karein, chhota sa bhi sadqa kaafi hai','Try to give, even a little counts'))}}
  else if(q.kind==='tilawat'){if(b==='y'){tlAdd(Math.max(0,S.tilTarget-tlToday()));sfx('success');toast(T('Mashaallah! Target poora ✅','Target done ✅'))}else if(b==='p')after='tl';else if(b==='q'){after='quran'}}
  else if(q.kind==='azkar'){if(b==='go')after='azkar'}
  else if(q.kind==='gasht'){if(b==='y'){const dk=dkey();GS[dk]=GS[dk]||{};GS[dk][q.w]=1;saveGS();sfx('success');toast(T('Mashaallah! Gasht likh liya ✅','Gasht recorded ✅'))}else if(b==='n')toast(T('Koi baat nahi, agle hafte insha-Allah','No problem, next week insha-Allah'))}
  else if(q.kind==='mamool'){if(b==='y'){mmSet('talim',1);sfx('success')}else if(b==='go')after='mamool'}
  PQ.splice(i,1);savePQ();closeDlg();if(typeof refreshHome==='function')refreshHome();
  if(after==='sadqa')askSadqaAmt();else if(after==='tl')askTilAmt();else if(after==='quran'&&typeof go==='function')go('deen','quran');else if(after==='azkar'&&typeof go==='function')go('deen','azkar');else if(after==='mamool'&&typeof go==='function')go('deen','khabar');
  if(typeof rerender==='function')rerender()}
function askSadqaAmt(){form(T('Sadqa likh lein','Log sadaqah'),[{k:'amt',l:T('Kitna (₹)? Khali chhod sakte hain','Amount (₹)? optional'),t:'number',m:'decimal',v:sadqaSug()||''},{k:'note',l:T('Kis ko / note','To whom / note'),p:T('Masjid, madarsa, ghareeb…','Masjid, madrasa, needy…')}],o=>{sdAdd(o.amt,o.note);toast(T('Jazakallah! Sadqa likh liya ✅','Sadaqah recorded ✅'));if(typeof rerender==='function')rerender()})}
function askTilAmt(){form(T('Kitni ayaat parhi?','Ayahs recited?'),[{k:'n',l:T('Ayaat ki tadaad','Number of ayahs'),t:'number',m:'numeric',v:10}],o=>{tlAdd(+o.n||0);toast(T('Likh liya ✅','Recorded ✅'));if(typeof rerender==='function')rerender()})}

/* ---------- scheduler ---------- */
const fired=new Set(store.get('fired',[]));
const markF=k=>{fired.add(k);store.set('fired',[...fired].slice(-600))};
function dayEvents(){
  const ev=[],d=dkey(),dow=new Date().getDay(),n=VN(S);
  const E=(key,at,win,run,late)=>{if(at)ev.push({key:d+'|'+key,at,win,run,late})};
  if(TM&&!TM.stale&&!(typeof fmPaused==='function'&&fmPaused()))
  {
    PRAY.forEach(p=>{const t=TM.t[p];
      if(S.waqtNotif!==false){const st=atTime(t),az=azanTime(p),same=S.azan&&az&&st&&Math.abs(az-st)<60000;if(st&&!same)E('wq-'+p,st,15*60000,()=>notify(T(`${pname(p)} ka waqt shuru`,`${pname(p)} time has begun`,`${pname(p)} کا وقت شروع`,`${pname(p)} का वक़्त शुरू`),T('Namaz ka waqt shuru ho gaya.','Prayer time has begun.','نماز کا وقت شروع ہو گیا۔','नमाज़ का वक़्त शुरू हो गया।'),{k:'alert',tab:'deen',sub:'namaz',tag:'wq-'+p,voice:'wq_'+p}))}
      if(S.azan)E('azan-'+p,azanTime(p),15*60000,()=>{const jt=t12(hhmmOf(jamTime(p)));notify(T(`${pname(p)} ki azaan ka waqt ho chuka hai 🕌`,`it's time for ${pname(p)} adhan 🕌`,`${pname(p)} کی اذان کا وقت ہو چکا ہے 🕌`,`${pname(p)} की अज़ान का वक़्त हो चुका है 🕌`),(p==='Maghrib'?T('Fauran jamaat khadi ho jayegi.','The jamaat will stand right away.','فوراً جماعت کھڑی ہو جائے گی۔','फ़ौरन जमात खड़ी हो जाएगी।'):T(`Jamaat ${jt} par.`,`Jamaat at ${jt}.`,`جماعت ${jt} پر۔`,`जमात ${jt} पर।`))+(S.masjid.name?' · '+S.masjid.name:''),{k:'alert',tab:'deen',sub:'namaz',tag:'azan-'+p,voice:(p==='Dhuhr'&&isFriD()?'juma':'az_'+p)})});
      if(S.jm5!==false){const j5=jamTime(p);if(j5){j5.setMinutes(j5.getMinutes()-5);const fr=p==='Dhuhr'&&isFriD();E('j5-'+p,j5,5*60000,()=>inMsj(p)||notify(T(`${fr?'Juma':pname(p)} ki jamaat 5 minute mein 🏃`,`${fr?'Jumuah':pname(p)} jamaat in 5 minutes 🏃`,`${fr?'جمعہ':pname(p)} کی جماعت 5 منٹ میں 🏃`,`${fr?'जुमा':pname(p)} की जमात 5 मिनट में 🏃`),T('5 minute mein jamaat khadi hone wali hai, lehaza jaldi karein.','The jamaat stands in 5 minutes, please hurry.','5 منٹ میں جماعت کھڑی ہونے والی ہے، لہٰذا جلدی کریں۔','5 मिनट में जमात खड़ी होने वाली है, लिहाज़ा जल्दी करें।')+(S.masjid.name?' · '+S.masjid.name:''),{k:'alert',tab:'deen',sub:'namaz',tag:'j5-'+p,voice:'jm5_'+(fr?'Juma':p)}))}}
      if(S.masjid.pre){const pj=jamTime(p);if(pj){pj.setMinutes(pj.getMinutes()-10);E('pre-'+p,pj,10*60000,()=>inMsj(p)||notify(T(`${pname(p)} ki jamaat 10 min mein`,`${pname(p)} jamaat in 10 min`,`${pname(p)} کی جماعت 10 منٹ میں`,`${pname(p)} की जमात 10 मिनट में`),S.masjid.name||'',{k:'info',tab:'deen',sub:'namaz',tag:'pre-'+p,silent:true}))}}
      const aq=jamTime(p);if(aq){aq.setMinutes(aq.getMinutes()+S.askAfter);
        E('ask-'+p,aq,Infinity,(late)=>{if(!hzToday()[p]){const q=mkQ('hazri',{p});if(inMsj(p))q.voice=null;addQ(q,{silent:late>45*60000})}})}});}
  const dl=(k,hhmm,fn)=>E(k,atTime(hhmm),20*60000,fn);
  dl('sdn',S.sadqaNotif,()=>{if(!sdDone())notify(T('Sadqa ka waqt','Time for sadaqah'),sadqaBody(),{k:'alert',tab:'kaam',sub:'paisa',voice:'sadqa_remind'})});
  E('sda',atTime(S.sadqaAsk),Infinity,(late)=>{if(!sdDone())addQ(mkQ('sadqa'),{silent:late>60*60000})});
  dl('tln',S.tilNotif,()=>{if(tlToday()<S.tilTarget)notify(T('Tilawat ka waqt','Time for recitation'),T(`Aaj ka target ${S.tilTarget} ayaat.`,`Today's target ${S.tilTarget} ayahs.`,`آج کا ہدف ${S.tilTarget} آیات۔`,`आज का लक्ष्य ${S.tilTarget} आयात।`),{k:'alert',tab:'deen',sub:'quran',voice:'tilawat_remind'})});
  E('tla',atTime(S.tilAsk),Infinity,(late)=>{if(tlToday()<S.tilTarget)addQ(mkQ('tilawat'),{silent:late>60*60000})});
  dl('azm',S.azM,()=>{if(azGet('k3m')<100||azGet('istm')<100||azGet('durm')<100)addQ(mkQ('azkar',{w:'m'}))});
  dl('aze',S.azE,()=>{if(azGet('k3e')<100||azGet('iste')<100||azGet('dure')<100)addQ(mkQ('azkar',{w:'e'}))});
  E('mm',atTime(S.mamool),Infinity,(late)=>{if(!mmToday().talim)addQ(mkQ('mamool'),{silent:late>60*60000})});
  if(dow===5)dl('juma',(TM&&TM.t.Dhuhr)?pad(Math.max(0,(hm(TM.t.Dhuhr)||[12])[0]-3))+':00':'09:00',()=>notify(T('Juma Mubarak! 🌙','Jumuah Mubarak! 🌙'),((typeof fmJumaText==='function'&&fmJumaText())||T('Ghusl, saaf libaas, Surah Kahf, durood ki kasrat, jaldi masjid.','Ghusl, clean clothes, Surah Kahf, much durood, go early.')),{k:'alert',tab:'deen',sub:'quran',voice:'juma'}));
  if(typeof mkEvents==='function')mkEvents(new Date(),TM).forEach(e=>E(e.k,e.at,10*60000,()=>notify(e.title,e.body,{k:e.silent?'info':'alert',tab:'deen',sub:'namaz',voice:e.voice,silent:!!e.silent})));
  if(typeof jumaEvents==='function')jumaEvents(new Date(),p=>azanTime(p),p=>jamTime(p)).forEach(e=>E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof duaEvents==='function')duaEvents(new Date()).forEach(e=>E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof gashtEvents==='function')gashtEvents(new Date(),p=>azanTime(p),p=>jamTime(p)).forEach(e=>e.ask?E(e.k,e.at,Infinity,(late)=>{const dk=dkey();if(!(GS[dk]&&GS[dk][e.ask]))addQ(mkQ('gasht',{w:e.ask}),{silent:late>60*60000})}):E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof cevEvents==='function')cevEvents(new Date()).forEach(e=>E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof wkEvents==='function')wkEvents(new Date()).forEach(e=>E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof jmaEvents==='function')jmaEvents(new Date()).forEach(e=>E(e.k,e.at,6*3600000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof dutyEvents==='function')dutyEvents(new Date()).forEach(e=>E(e.k,e.at,20*60000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof salEvents==='function')salEvents(new Date()).forEach(e=>E(e.k,e.at,6*3600000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof almEvents==='function')almEvents(new Date()).forEach(e=>E(e.k,e.at,10*60000,()=>{if(e.vn){notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.vn});setTimeout(()=>{if(typeof almWeb==='function')almWeb(e)},8000)}else if(typeof almWeb==='function')almWeb(e)}));
  if(typeof pexEvents==='function')pexEvents(new Date()).forEach(e=>E(e.k,e.at,6*3600000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof tipEvents==='function')tipEvents(new Date()).forEach(e=>E(e.k,e.at,6*3600000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  if(typeof reportEvents==='function')reportEvents(new Date()).forEach(e=>E(e.k,e.at,6*3600000,()=>notify(e.title,e.body,{k:'alert',tab:e.tab,sub:e.sub,voice:e.voice})));
  const J=jobDay(new Date());if(J.on&&(J.days||[1,2,3,4,5,6]).includes(dow)){
    jobMode('login')==='n'&&dl('jl',J.login,()=>notify(T('Job ka waqt! ⏰','Job login time! ⏰'),T('Login karne ka waqt ho gaya.','Time to log in.'),{k:'alert',tab:'kaam',sub:'waqt',voice:'job_login'}));
    jobMode('brk')==='n'&&dl('jb',J.brk,()=>notify(T('Break ka waqt ☕','Break time ☕'),T('Thoda aaram karein, namaz/khana.','Take a rest, prayer/lunch.'),{k:'alert',voice:'break_start'}));
    jobMode('brkEnd')==='n'&&dl('jbe',J.brkEnd,()=>notify(T('Break khatam ▶️','Break over ▶️'),T('Wapas kaam par.','Back to work.'),{k:'alert',voice:'break_end'}));
    jobMode('leave')==='n'&&dl('jlv',J.leave,()=>notify(T('Chhutti ka waqt 🏁','Leave time 🏁'),T('Aaj ka kaam samet lein.','Wrap up for the day.'),{k:'alert',voice:'leave'}))}
  E('rev',typeof nightAt==='function'?nightAt():atTime(S.review),20*60000,()=>{const s=hzScore(dkey());notify(T('Aaj ka hisaab 🌙','Daily review 🌙'),T(`Namaz ${s}/5, tilawat ${tlToday()}/${S.tilTarget}, sadqa ${sdDone()?'✅':'❌'}.`,`Prayers ${s}/5, recitation ${tlToday()}/${S.tilTarget}, sadaqah ${sdDone()?'✅':'❌'}.`,`نماز ${s}/5، تلاوت ${tlToday()}/${S.tilTarget}، صدقہ ${sdDone()?'✅':'❌'}۔`,`नमाज़ ${s}/5, तिलावत ${tlToday()}/${S.tilTarget}, सदक़ा ${sdDone()?'✅':'❌'}।`),{k:'alert',tab:'home',sub:'night',voice:'review'});try{if(!document.hidden&&typeof nightOpen==='function')nightOpen(true)}catch(e){}});
  return ev}
function reminderTick(){const now=Date.now();
  if(typeof TASKS!=='undefined')TASKS.forEach(t=>{if(!t.done&&t.due&&!t.fired&&!t.ring){const at=new Date(t.due).getTime();if(at<=now&&now-at<6*3600000){t.fired=1;store.set('tasks',TASKS);notify(T('Kaam ka waqt','Task due'),t.title,{k:'alert',tab:'kaam',sub:'tasks',voice:'task'})}}});
  if(typeof ALERTS!=='undefined')ALERTS.forEach(a=>{if(!a.fired&&a.at&&!a.ring){const at=new Date(a.at).getTime();if(at<=now&&now-at<6*3600000){a.fired=1;store.set('alerts',ALERTS);notify(T('Yaad-dahani','Reminder'),a.title,{k:'alert',tab:'kaam',sub:'tasks',voice:'reminder'})}}});
  SNZ=SNZ.filter(s=>{if(s.at<=now){addQ(Object.assign({},s.q,{key:s.q.key+'~'+Math.floor(now/60000)}));return false}return true});store.set('snz',SNZ)}
let lastDayK=dkey();
function schedTick(){
  if(dkey()!==lastDayK){lastDayK=dkey();loadTimes().then(()=>{if(typeof rerender==='function')rerender()})}
  const now=new Date();for(const e of dayEvents()){if(fired.has(e.key)||e.at>now)continue;markF(e.key);const late=now-e.at;
    if(window.AndroidPA&&late>30000&&e.win!==Infinity)continue;
    try{if(late<=e.win)e.run(late);else if(e.win===Infinity)e.run(late)}catch(er){console.error(er)}}
  reminderTick();
  if(typeof bizTick==='function')bizTick();if(typeof timerTick==='function')timerTick()}

/* ===== Masjid mode: andar ho to jamaat wali notification/voice band ===== */
function inMsj(p,at){const m=S.inM;if(!m||!m.until)return false;const t=at?+at:Date.now();if(t>m.until||t<(m.from||0)-6e4)return false;return !p||!m.p||m.p===p}
const MSJ_IN={ar:'بِسْمِ اللّٰهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلٰى رَسُوْلِ اللّٰهِ، اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ',ro:'Bismillahi, was-salatu was-salamu ala Rasoolillah. Allahummaf-tah li abwaba rahmatik.',tr:['Allah ke naam se, aur durood-o-salaam ho Allah ke Rasool ﷺ par. Aye Allah! Mere liye apni rehmat ke darwaze khol de.','In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, open for me the doors of Your mercy.'],src:'Sahih Muslim 713, Ibn Majah 771'};
const MSJ_OUT={ar:'بِسْمِ اللّٰهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلٰى رَسُوْلِ اللّٰهِ، اَللّٰهُمَّ اِنِّيْ اَسْاَلُكَ مِنْ فَضْلِكَ',ro:'Bismillahi, was-salatu was-salamu ala Rasoolillah. Allahumma inni as-aluka min fadlik.',tr:['Allah ke naam se, aur durood-o-salaam ho Allah ke Rasool ﷺ par. Aye Allah! Main tujh se tera fazl maangta hoon.','In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, I ask You of Your bounty.'],src:'Sahih Muslim 713, Ibn Majah 773'};
function msjPrayer(){if(typeof PRAY==='undefined')return null;const now=Date.now();let best=null;PRAY.forEach(p=>{const j=jamTime(p);if(!j)return;const dt=+j-now;if(dt>-12*6e4&&(best===null||dt<best.dt))best={p,dt,j}});return best}
function msjDuaHTML(d,inn){return`<div class="card flat mt" style="text-align:center"><div class="eyebrow">${inn?T('MASJID MEIN DAAKHIL HONE KI DUA','DUA FOR ENTERING THE MASJID'):T('MASJID SE NIKALNE KI DUA','DUA FOR LEAVING THE MASJID')}</div><div class="ar" dir="rtl" style="font-size:24px;line-height:2;margin:8px 0">${d.ar}</div><div class="sm" style="font-style:italic">${esc(d.ro)}</div><div class="mt">${esc(T(d.tr[0],d.tr[1]))}</div><div class="muted sm mt">${esc(d.src)}${inn?' • '+T('Pehle daayan (right) qadam andar rakhein, aur nafl aitekaf ki niyyat kar lein.','Enter with the right foot first; make the intention of nafl i\'tikaf.'):' • '+T('Pehle baayan (left) qadam bahar rakhein.','Leave with the left foot first.')}</div></div>`}
function msjCard(){const on=inMsj();const b=msjPrayer();
  return`<div class="card msj ${on?'on':''}"><div><div><h2 style="margin:0">🕌 ${on?T('Aap masjid mein hain','You are in the masjid'):T('Masjid mein daakhil','Entering the masjid')}</h2><div class="muted sm">${on?T(`${pname(S.inM.p)} ki jamaat wali notification + awaaz band hai`,`${pname(S.inM.p)} jamaat alerts are muted`):T('Button dabayen — dua aayegi aur jamaat ki notification/awaaz band ho jayegi','Tap — dua appears and jamaat alerts get muted')}</div></div>
  <button class="btn ${on?'ghost':'gold'} mt" data-a="msjtog" style="width:100%">${on?T('🚶 Nikal gaya','🚶 Left'):T('🕌 Daakhil ho gaya','🕌 I\'m in')}</button></div>${on?'':(b?`<div class="muted sm mt">${T('Agli jamaat','Next jamaat')}: ${pname(b.p)} • ${t12(hhmmOf(b.j))}</div>`:'')}
  <button class="btn s ghost mt" data-a="msjdua">${T('📿 Daakhil hone ki dua dekhein','📿 See entering dua')}</button></div>`}
window.AX=window.AX||{};window.AX.msjdua=()=>dlg(`<h2 class="h2">🕌 ${T('Masjid ki duayen','Masjid duas')}</h2>${msjDuaHTML(MSJ_IN,1)}${msjDuaHTML(MSJ_OUT,0)}<button class="btn mt" style="width:100%" data-a="closedlg">OK</button>`);
window.AX.msjtog=()=>{if(inMsj()){S.inM=null;saveS();try{nativeSync()}catch(e){}dlg(`<h2 class="h2">🚶 ${T('Masjid se nikalte waqt','When leaving')}</h2>${msjDuaHTML(MSJ_OUT,0)}<button class="btn mt" style="width:100%" data-a="closedlg">OK</button>`);rerender();return}
  const b=msjPrayer(),now=Date.now();const until=b?Math.max(+b.j+(Math.max(30,(+S.askAfter||20)+10))*6e4,now+20*6e4):now+60*6e4;S.inM={p:b?b.p:null,from:now,until};saveS();try{nativeSync()}catch(e){}
  if(typeof sfx==='function')sfx('chime');
  dlg(`<h2 class="h2">🕌 ${T('Masjid mein khush-aamdeed','Welcome to the masjid')}</h2>${msjDuaHTML(MSJ_IN,1)}<p class="muted sm c mt">${b?T(`${pname(b.p)} ki jamaat (${t12(hhmmOf(b.j))}) tak jamaat wali notification aur awaaz band rahegi. Namaz ke baad sirf screen par ek chhota sawal aayega (bina awaaz ke) — wahan ✅ daba dein.`,`Jamaat alerts muted until ${pname(b.p)} jamaat (${t12(hhmmOf(b.j))}).`):T('Agle 1 ghante tak jamaat wali notification band rahegi.','Jamaat alerts muted for 1 hour.')}</p><button class="btn mt" style="width:100%" data-a="closedlg">${T('Jazakallah ✅','Done ✅')}</button>`);rerender()};

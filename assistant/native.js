'use strict';
/* ===== Android APK bridge: pushes the next 4 days of notifications to the phone so the ElevenLabs voice plays even when the app is closed ===== */
const NAT=window.AndroidPA||null;
window.__nativeOpen=function(tab,sub){try{if(typeof go==='function')go(tab||'home',sub||undefined)}catch(e){}};
function natItems(){
  const out=[],now=Date.now();
  const add=(at,title,body,voice,o)=>{if(at&&at.getTime()>now+3000)out.push(Object.assign({at:at.getTime(),title:title||'',body:body||'',voice:voice||'alert',tab:'home',sub:''},o||{}))};
  for(let i=0;i<6;i++){
    const base=addDays(new Date(),i),tm=(i===1&&TM_TMR)?TM_TMR:TM,dow=base.getDay(),td=i===0;PN_D=base;const fri=dow===5,vz=p=>(p==='Dhuhr'&&fri)?'juma':'az_'+p;
    const at=h=>atTime(h,base);
    const az=p=>{if(!tm)return null;if(p==='Dhuhr'&&fri&&S.masjid&&hm(S.masjid.jz))return at(S.masjid.jz);const m=S.masjid&&S.masjid.az&&S.masjid.az[p];return(m&&hm(m))?at(m):at(tm.t[p])};
    const jm=p=>{if(p==='Dhuhr'&&fri&&S.masjid&&hm(S.masjid.ju))return at(S.masjid.ju);const m=S.masjid&&S.masjid.jm&&S.masjid.jm[p];if(m&&hm(m))return at(m);const x=az(p);if(!x)return null;x.setMinutes(x.getMinutes()+(S.jam[p]||0));return x};
    if(tm)PRAY.forEach(p=>{
      if(S.waqtNotif!==false){const st=at(tm.t[p]),a0=az(p),same=S.azan&&a0&&st&&Math.abs(a0-st)<60000;if(st&&!same)add(st,T(`${pname(p)} ka waqt shuru`,`${pname(p)} time has begun`,`${pname(p)} کا وقت شروع`,`${pname(p)} का वक़्त शुरू`),T('Namaz ka waqt shuru ho gaya.','Prayer time has begun.','نماز کا وقت شروع ہو گیا۔','नमाज़ का वक़्त शुरू हो गया।'),'wq_'+p,{tab:'deen',sub:'namaz'})}
      if(S.azan){const j=jm(p),jt=j?t12(hhmmOf(j)):'';
        add(az(p),T(`${nm()}, ${pname(p)} ki azaan ka waqt ho chuka hai 🕌`,`${nm()}, it's time for ${pname(p)} adhan 🕌`,`${nm()}، ${pname(p)} کی اذان کا وقت ہو چکا ہے 🕌`,`${nm()}, ${pname(p)} की अज़ान का वक़्त हो चुका है 🕌`),(p==='Maghrib'?T('Fauran jamaat khadi ho jayegi.','The jamaat will stand right away.','فوراً جماعت کھڑی ہو جائے گی۔','फ़ौरन जमात खड़ी हो जाएगी।'):T(`Jamaat ${jt} par.`,`Jamaat at ${jt}.`,`جماعت ${jt} پر۔`,`जमात ${jt} पर।`))+(S.masjid.name?' · '+S.masjid.name:''),vz(p),{tab:'deen',sub:'namaz'})}
      if(S.jm5!==false){const j5=jm(p);if(j5&&!inMsj(p,j5)){j5.setMinutes(j5.getMinutes()-5);const fr=p==='Dhuhr'&&fri;add(j5,T(`${nm()}, ${fr?'Juma':pname(p)} ki jamaat 5 minute mein 🏃`,`${nm()}, ${fr?'Jumuah':pname(p)} jamaat in 5 minutes 🏃`,`${nm()}، ${fr?'جمعہ':pname(p)} کی جماعت 5 منٹ میں 🏃`,`${nm()}, ${fr?'जुमा':pname(p)} की जमात 5 मिनट में 🏃`),T('5 minute mein jamaat khadi hone wali hai, lehaza jaldi karein.','The jamaat stands in 5 minutes, please hurry.','5 منٹ میں جماعت کھڑی ہونے والی ہے، لہٰذا جلدی کریں۔','5 मिनट में जमात खड़ी होने वाली है, लिहाज़ा जल्दी करें।')+(S.masjid.name?' · '+S.masjid.name:''),'jm5_'+(fr?'Juma':p),{tab:'deen',sub:'namaz'})}}
      if(S.masjid.pre){const pj=jm(p);if(pj&&!inMsj(p,pj)){pj.setMinutes(pj.getMinutes()-10);add(pj,T(`${pname(p)} ki jamaat 10 min mein`,`${pname(p)} jamaat in 10 min`,`${pname(p)} کی جماعت 10 منٹ میں`,`${pname(p)} की जमात 10 मिनट में`),S.masjid.name||'','silent',{tab:'deen',sub:'namaz'})}}
      const aq=jm(p);if(aq&&!(td&&hzToday()[p])){aq.setMinutes(aq.getMinutes()+S.askAfter);add(aq,mkQ('hazri',{p}).title,'',inMsj(p,aq)?'silent':((p==='Dhuhr'&&fri)?'alert':'hz_'+p))}});
    if(!(td&&sdDone()))add(at(S.sadqaNotif),T('Sadqa ka waqt','Time for sadaqah'),sadqaBody(dkey(base)),'sadqa_remind',{tab:'kaam',sub:'paisa'});
    if(!(td&&sdDone()))add(at(S.sadqaAsk),mkQ('sadqa').title,'','sadqa_ask');
    if(!(td&&tlToday()>=S.tilTarget)){
      add(at(S.tilNotif),T('Tilawat ka waqt','Time for recitation'),T(`Aaj ka target ${S.tilTarget} ayaat.`,`Today's target ${S.tilTarget} ayahs.`,`آج کا ہدف ${S.tilTarget} آیات۔`,`आज का लक्ष्य ${S.tilTarget} आयात।`),'tilawat_remind',{tab:'deen',sub:'quran'});
      add(at(S.tilAsk),mkQ('tilawat').title,'','tilawat_ask')}
    add(at(S.azM),mkQ('azkar',{w:'m'}).title,'','azkar_m');
    add(at(S.azE),mkQ('azkar',{w:'e'}).title,'','azkar_e');
    try{add(at(S.mamool),mkQ('mamool').title,'','taleem')}catch(e){}
    if(dow===5&&tm&&tm.t.Dhuhr)add(at(pad(Math.max(0,(hm(tm.t.Dhuhr)||[12])[0]-3))+':00'),T('Juma Mubarak! 🌙','Jumuah Mubarak! 🌙'),T('Ghusl, saaf libaas, Surah Kahf, durood ki kasrat, jaldi masjid.','Ghusl, clean clothes, Surah Kahf, much durood, go early.'),'juma',{tab:'deen',sub:'quran'});
    const J=jobDay(base);if(J&&J.on&&(J.days||[1,2,3,4,5,6]).includes(dow)){
      jobMode('login')==='n'&&add(at(J.login),T('Job ka waqt! ⏰','Job login time! ⏰'),T('Login karne ka waqt ho gaya.','Time to log in.'),'job_login',{tab:'kaam',sub:'waqt'});
      jobMode('brk')==='n'&&add(at(J.brk),T('Break ka waqt ☕','Break time ☕'),T('Thoda aaram karein, namaz/khana.','Take a rest, prayer/lunch.'),'break_start');
      jobMode('brkEnd')==='n'&&add(at(J.brkEnd),T('Break khatam ▶️','Break over ▶️'),T('Wapas kaam par.','Back to work.'),'break_end');
      jobMode('leave')==='n'&&add(at(J.leave),T('Chhutti ka waqt 🏁','Leave time 🏁'),T('Aaj ka kaam samet lein.','Wrap up for the day.'),'leave')}
    if(typeof mkEvents==='function')mkEvents(base,tm).forEach(e=>add(e.at,e.title,e.body,e.silent?'silent':e.voice,{tab:'deen',sub:'namaz'}));
    if(typeof jumaEvents==='function')jumaEvents(base,az,jm).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof duaEvents==='function')duaEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof gashtEvents==='function')gashtEvents(base,az,jm).forEach(e=>add(e.at,e.title,e.body||'',e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof wkEvents==='function')wkEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof jmaEvents==='function')jmaEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof dutyEvents==='function')dutyEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof salEvents==='function')salEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof cevEvents==='function')cevEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof almEvents==='function')almEvents(base).forEach(e=>{let at=e.at;if(e.vn&&at){add(at,e.title,e.body,e.vn,{tab:e.tab,sub:e.sub});at=new Date(+at+8000)}add(at,e.title,e.body,e.voice||'alert_alarm',{tab:e.tab,sub:e.sub,alarm:1,aid:e.aid,snooze:e.snooze,duaRaw:e.duaRaw,duaText:e.duaText,duaLang:e.duaLang})});
    if(typeof pexEvents==='function')pexEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof tipEvents==='function')tipEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    if(typeof yrEvents==='function')yrEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice||'alert',{tab:e.tab,sub:e.sub}));
    if(typeof reportEvents==='function')reportEvents(base).forEach(e=>add(e.at,e.title,e.body,e.voice,{tab:e.tab,sub:e.sub}));
    add(typeof nightAt==='function'?nightAt(base):at(S.review),T('Sone se pehle ka hisaab 🌙','Before-sleep review 🌙','سونے سے پہلے کا حساب 🌙','सोने से पहले का हिसाब 🌙'),T('Aaj ki namaz aur amaal ka khulasa — jo likha nahi, update karein','Today\'s prayers & deeds — update what is missing','آج کی نماز اور اعمال کا خلاصہ — جو لکھا نہیں، اپڈیٹ کریں','आज की नमाज़ और आमाल का ख़ुलासा — जो लिखा नहीं, अपडेट करें'),'review',{tab:'home',sub:'night'});
  }
  try{if(typeof TASKS!=='undefined')TASKS.forEach(t=>{if(!t.done&&t.due&&!t.ring)add(new Date(t.due),T('Kaam ka waqt','Task due'),t.title,'task',{tab:'kaam',sub:'tasks'})});
    if(typeof ALERTS!=='undefined')ALERTS.forEach(a=>{if(a.at&&!a.ring)add(new Date(a.at),T('Yaad-dahani','Reminder'),a.title,'reminder',{tab:'kaam',sub:'tasks'})})}catch(e){}
  PN_D=null;out.sort((a,b)=>a.at-b.at);return out.slice(0,380)}
let _natLast='';
function nativeSync(){
  if(!NAT)return;
  try{const items=natItems(),js=JSON.stringify({lang:VL(),voice:!!S.voice,items});
    try{store.set('natq',items.filter(x=>x.at<Date.now()+2*864e5&&x.title&&x.voice!=='silent').slice(0,120).map(x=>({at:x.at,title:x.title,body:(x.body||'').slice(0,140),tab:x.tab,sub:x.sub})))}catch(e){}
    if(js===_natLast)return;_natLast=js;NAT.sync(js)}catch(e){console.error(e)}}
/* fired-while-closed native alerts -> home 'Naye alerts' card */
function natCatchUp(){try{const q=store.get('natq',[]),now=Date.now(),seen=store.get('natseen',now-6*36e5);let add=0;
  q.forEach(x=>{if(x.at>seen&&x.at<=now&&!NLOG.some(n=>n.title===x.title&&Math.abs(n.t-x.at)<45*6e4)){NLOG.unshift({id:uid(),t:x.at,title:x.title,body:x.body||'',tab:x.tab||null,sub:x.sub||null,r:false,k:'alert',imp:true});add++}});
  store.set('natseen',now);if(add){NLOG.sort((a,b)=>b.t-a.t);NLOG=NLOG.slice(0,150);store.set('nlog',NLOG);updBell();if(typeof curTab!=='undefined'&&curTab==='home'&&typeof rerender==='function')rerender()}}catch(e){}}
if(NAT){
  setInterval(nativeSync,30000);
  setTimeout(natCatchUp,1200);document.addEventListener('visibilitychange',()=>{if(!document.hidden)natCatchUp()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)nativeSync()});
  window.addEventListener('pagehide',nativeSync);
  setTimeout(()=>{try{const o=NAT.takeOpen&&NAT.takeOpen();if(o){const a=o.split('|');window.__nativeOpen(a[0],a[1])}}catch(e){}},1500);
}

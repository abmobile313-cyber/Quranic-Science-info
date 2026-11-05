'use strict';
/* ===== Android APK bridge: pushes the next 4 days of notifications to the phone so the ElevenLabs voice plays even when the app is closed ===== */
const NAT=window.AndroidPA||null;
window.__nativeOpen=function(tab,sub){try{if(typeof go==='function')go(tab||'home',sub||undefined)}catch(e){}};
function natItems(){
  const out=[],now=Date.now();
  const add=(at,title,body,voice,o)=>{if(at&&at.getTime()>now+3000)out.push(Object.assign({at:at.getTime(),title:title||'',body:body||'',voice:voice||'alert',tab:'home',sub:''},o||{}))};
  for(let i=0;i<4;i++){
    const base=addDays(new Date(),i),tm=(i===1&&TM_TMR)?TM_TMR:TM,dow=base.getDay(),td=i===0;
    const at=h=>atTime(h,base);
    const az=p=>{if(!tm)return null;const m=S.masjid&&S.masjid.az&&S.masjid.az[p];return(m&&hm(m))?at(m):at(tm.t[p])};
    const jm=p=>{const m=S.masjid&&S.masjid.jm&&S.masjid.jm[p];if(m&&hm(m))return at(m);const x=az(p);if(!x)return null;x.setMinutes(x.getMinutes()+(S.jam[p]||0));return x};
    if(tm)PRAY.forEach(p=>{
      if(S.azan){const j=jm(p),jt=j?t12(hhmmOf(j)):'';
        add(az(p),T(`${pname(p)} ka waqt ho gaya`,`${pname(p)} time`,`${pname(p)} کا وقت ہو گیا`,`${pname(p)} का वक़्त हो गया`),T(`Jamaat ${jt} par.`,`Jamaat at ${jt}.`,`جماعت ${jt} پر۔`,`जमात ${jt} पर।`)+(S.masjid.name?' · '+S.masjid.name:''),'az_'+p,{tab:'deen',sub:'namaz'})}
      if(S.masjid.pre){const pj=jm(p);if(pj){pj.setMinutes(pj.getMinutes()-10);add(pj,T(`${pname(p)} ki jamaat 10 min mein`,`${pname(p)} jamaat in 10 min`,`${pname(p)} کی جماعت 10 منٹ میں`,`${pname(p)} की जमात 10 मिनट में`),S.masjid.name||'','silent',{tab:'deen',sub:'namaz'})}}
      const aq=jm(p);if(aq&&!(td&&hzToday()[p])){aq.setMinutes(aq.getMinutes()+S.askAfter);add(aq,mkQ('hazri',{p}).title,'','hz_'+p)}});
    if(!(td&&sdDone()))add(at(S.sadqaNotif),T('Sadqa ka waqt','Time for sadaqah'),T('Aaj ka sadqa nikaalna na bhoolein.','Do not forget today\'s sadaqah.'),'sadqa_remind',{tab:'kaam',sub:'paisa'});
    if(!(td&&sdDone()))add(at(S.sadqaAsk),mkQ('sadqa').title,'','sadqa_ask');
    if(!(td&&tlToday()>=S.tilTarget)){
      add(at(S.tilNotif),T('Tilawat ka waqt','Time for recitation'),T(`Aaj ka target ${S.tilTarget} ayaat.`,`Today's target ${S.tilTarget} ayahs.`,`آج کا ہدف ${S.tilTarget} آیات۔`,`आज का लक्ष्य ${S.tilTarget} आयात।`),'tilawat_remind',{tab:'deen',sub:'quran'});
      add(at(S.tilAsk),mkQ('tilawat').title,'','tilawat_ask')}
    add(at(S.azM),mkQ('azkar',{w:'m'}).title,'','azkar_m');
    add(at(S.azE),mkQ('azkar',{w:'e'}).title,'','azkar_e');
    try{add(at(S.mamool),mkQ('mamool').title,'','taleem')}catch(e){}
    if(dow===5&&tm&&tm.t.Dhuhr)add(at(pad(Math.max(0,(hm(tm.t.Dhuhr)||[12])[0]-3))+':00'),T('Juma Mubarak! 🌙','Jumuah Mubarak! 🌙'),T('Ghusl, saaf libaas, Surah Kahf, durood ki kasrat, jaldi masjid.','Ghusl, clean clothes, Surah Kahf, much durood, go early.'),'juma',{tab:'deen',sub:'quran'});
    const J=S.job;if(J&&J.on&&(J.days||[1,2,3,4,5,6]).includes(dow)){
      add(at(J.login),T('Job ka waqt! ⏰','Job login time! ⏰'),T('Login karne ka waqt ho gaya.','Time to log in.'),'job_login',{tab:'kaam',sub:'waqt'});
      add(at(J.brk),T('Break ka waqt ☕','Break time ☕'),T('Thoda aaram karein, namaz/khana.','Take a rest, prayer/lunch.'),'break_start');
      add(at(J.brkEnd),T('Break khatam ▶️','Break over ▶️'),T('Wapas kaam par.','Back to work.'),'break_end');
      add(at(J.leave),T('Chhutti ka waqt 🏁','Leave time 🏁'),T('Aaj ka kaam samet lein.','Wrap up for the day.'),'leave')}
    add(at(S.review),T('Aaj ka hisaab 🌙','Daily review 🌙'),'','review');
  }
  try{if(typeof TASKS!=='undefined')TASKS.forEach(t=>{if(!t.done&&t.due)add(new Date(t.due),T('Kaam ka waqt','Task due'),t.title,'task',{tab:'kaam',sub:'tasks'})});
    if(typeof ALERTS!=='undefined')ALERTS.forEach(a=>{if(a.at)add(new Date(a.at),T('Yaad-dahani','Reminder'),a.title,'reminder',{tab:'kaam',sub:'tasks'})})}catch(e){}
  out.sort((a,b)=>a.at-b.at);return out.slice(0,180)}
let _natLast='';
function nativeSync(){
  if(!NAT)return;
  try{const items=natItems(),js=JSON.stringify({lang:VL(),voice:!!S.voice,items});
    if(js===_natLast)return;_natLast=js;NAT.sync(js)}catch(e){console.error(e)}}
if(NAT){
  setInterval(nativeSync,30000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)nativeSync()});
  window.addEventListener('pagehide',nativeSync);
  setTimeout(()=>{try{const o=NAT.takeOpen&&NAT.takeOpen();if(o){const a=o.split('|');window.__nativeOpen(a[0],a[1])}}catch(e){}},1500);
}

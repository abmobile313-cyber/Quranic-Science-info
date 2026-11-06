'use strict';
/* ===== Real alarms: wake / sleep / meal / medicine / your own. Rings with the phone's ringtone or your own file (APK);
   pressing Snooze or Dismiss makes the dua be recited aloud. In the browser (PWA) a full-screen alarm page is shown while the app is open. ===== */
let ALM=store.get('alm2',[]);
const saveALM=()=>store.set('alm2',ALM);
const ALK={
 wake:{i:'☀️',n:()=>T('Uthne ka alarm','Wake-up alarm'),t:'05:00',raw:'dua_wake'},
 sleep:{i:'🌙',n:()=>T('Sone ka alarm','Sleep alarm'),t:'22:30',raw:'dua_sleep'},
 meal:{i:'🍽',n:()=>T('Khane ka alarm','Meal alarm'),t:'13:30',raw:'dua_eat1'},
 med:{i:'💊',n:()=>T('Dawa ka alarm','Medicine alarm'),t:'09:00',raw:''},
 office:{i:'💼',n:()=>T('Office ka alarm','Office alarm'),t:'09:30',raw:''},
 work:{i:'📋',n:()=>T('Kaam ka alarm','Work alarm'),t:'10:00',raw:''},
 other:{i:'⏰',n:()=>T('Mera alarm','My alarm'),t:'07:00',raw:''}};
const almOn=(x,d)=>x.on!==false&&(x.rep==='daily'||(x.rep==='wd'&&d.getDay()>=1&&d.getDay()<=5)||(x.rep==='day'&&d.getDay()===+x.day)||(x.rep==='once'&&x.date===dkey(d)));
const almWhen=x=>x.rep==='daily'?T('Roz','Every day'):x.rep==='wd'?T('Peer–Jumma','Mon–Fri'):x.rep==='day'?dayName(+x.day):(x.date||'');
const almNat=()=>typeof NAT!=='undefined'&&NAT;
function almEventsBase(base){const out=[];ALM.forEach(x=>{if(!almOn(x,base)||!hm(x.t))return;const k=ALK[x.kind]||ALK.other;
  out.push({k:'alm_'+x.id,at:atTime(x.t,base),voice:'alert',title:`${k.i} ${x.label||k.n()}`,body:t12(x.t)+(k.raw||x.duaText?' • '+T('Snooze/Dismiss par dua padhi jayegi','Dua is recited on Snooze/Dismiss'):''),tab:'deen',sub:'duas',
    alarm:1,aid:x.id,snooze:+x.snooze||10,duaRaw:k.raw||'',duaText:k.raw?'':(x.duaText||''),duaLang:x.duaLang||'ar'})});return out}
function almCard(){const nat=almNat();
  const rows=ALM.map(x=>{const k=ALK[x.kind]||ALK.other;return`<div class="item"><div class="ic2">${k.i}</div><div class="t"><b>${esc(x.label||k.n())}</b><div class="muted sm">${t12(x.t)} • ${esc(almWhen(x))}${nat&&NAT.ringName?(NAT.ringName(x.id)?' • 🔔 '+esc(NAT.ringName(x.id)):''):''}</div></div><div class="row" style="gap:6px"><input type="checkbox" class="sw" data-a="almon" data-id="${x.id}" ${x.on!==false?'checked':''}><button class="btn s ghost" data-a="almedit" data-id="${x.id}">✎</button></div></div>`}).join('');
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">⏰ ${T('Mere alarm','My alarms','میرے الارم','मेरे अलार्म')}</h2></div>
   <p class="muted sm">${T('Uthna, sona, khana, dawa ya koi bhi apna alarm. Waqt par ringtone bajti hai (phone ki ya aapki apni file). Snooze ya Dismiss dabate hi dua zor se padh kar sunai jaati hai.','Wake, sleep, meals, medicine or your own. At the time the ringtone plays (phone\'s or your own file). Pressing Snooze or Dismiss recites the dua aloud.')}</p>
   <div class="row wrap">${Object.entries(ALK).map(([k,v])=>`<button class="btn s ghost" data-a="almadd" data-k="${k}">${v.i} ${v.n()}</button>`).join('')}</div>
   ${rows?`<div style="margin-top:10px">${rows}</div>`:`<p class="muted c" style="margin-top:10px">${T('Abhi koi alarm nahi. Upar se banayein.','No alarms yet. Create one above.')}</p>`}
   ${nat?'':`<p class="muted sm">${T('Note: browser mein alarm tabhi bajta hai jab app khula ho; band app mein bajane ke liye APK install karein.','Note: in the browser the alarm rings only while the app is open; install the APK for alarms with the app closed.')}</p>`}</div>`}
function almForm(kind,x){const isN=!x;const k0=ALK[kind||'other']||ALK.other;x=x||{id:uid(),kind:kind||'other',label:'',t:k0.t,rep:'daily',day:5,date:dkey(),snooze:10,duaText:'',duaLang:'ar',on:true};const nat=almNat();
  const ringBox=nat?`<div class="card flat" style="margin-top:10px"><b>🔔 ${T('Ringtone','Ringtone')}</b><div class="muted sm" id="almrn">${esc((NAT.ringName&&NAT.ringName(x.id))||T('Default alarm tone','Default alarm tone'))}</div><div class="row wrap mt"><button class="btn s ghost" id="almr1">🎵 ${T('Phone ki ringtone chunein','Pick phone ringtone')}</button><button class="btn s ghost" id="almr2">📁 ${T('Apni audio file','My audio file')}</button><button class="btn s ghost" id="almr3">▶ ${T('Suno','Preview')}</button><button class="btn s ghost" id="almr4">↺ ${T('Default','Default')}</button></div></div>`:`<p class="muted sm">${T('Ringtone chunna sirf APK mein hota hai.','Choosing a ringtone is available in the APK.')}</p>`;
  form(isN?T('Naya alarm','New alarm'):T('Alarm badlein','Edit alarm'),[
    {k:'label',l:T('Naam (optional)','Name (optional)'),v:x.label},
    {k:'kind',l:T('Qism (dua isi se tay hoti hai)','Type (decides the dua)'),t:'select',v:x.kind,o:Object.entries(ALK).map(([a,b])=>[a,b.i+' '+b.n()])},
    {k:'t',l:T('Waqt','Time'),t:'time',v:x.t},
    {k:'rep',l:T('Kab','When'),t:'select',v:x.rep,o:[['daily',T('Roz','Every day')],['wd',T('Peer se Jumma','Mon–Fri')],['day',T('Hafte ka ek din','One weekday')],['once',T('Sirf ek tareekh','One date')]]},
    {k:'day',l:T('Hafte ka din (agar "ek din")','Weekday (if "one weekday")'),t:'select',v:x.day,o:DAYN.map((d,i)=>[i,dayName(i)])},
    {k:'date',l:T('Tareekh (agar "ek tareekh")','Date (if "one date")'),t:'date',v:x.date||dkey()},
    {k:'snooze',l:T('Snooze (minute)','Snooze (minutes)'),t:'select',v:x.snooze,o:[5,10,15,20,30]},
    {k:'duaText',l:T('Apni dua/zikr (sirf "Mera alarm"/"Dawa" ke liye; jo likhenge wahi padha jayega)','Your own dua/dhikr (only for "My alarm"/"Medicine"; read exactly as written)'),t:'area',r:3,v:x.duaText||''},
    {k:'duaLang',l:T('Us text ki zubaan','Language of that text'),t:'select',v:x.duaLang||'ar',o:[['ar','العربية Arabic'],['ur','اردو Urdu'],['hi','हिन्दी Hindi'],['en','English']]}],
    o=>{if(!hm(o.t)){toast(T('Waqt chunein','Pick a time'));return false}const n={id:x.id,kind:o.kind,label:o.label.trim(),t:o.t,rep:o.rep,day:+o.day,date:o.date,snooze:+o.snooze||10,duaText:o.duaText.trim(),duaLang:o.duaLang,on:x.on!==false};
      const i=ALM.findIndex(y=>y.id===x.id);if(i>=0)ALM[i]=n;else ALM.push(n);saveALM();try{schedTick()}catch(e){}try{nativeSync()}catch(e){}toast(T('Alarm save ✅','Alarm saved ✅'));rerender()},
    {extra:ringBox+(isN?'':`<button class="btn bad s mt" id="almdel">${T('Ye alarm hatayein','Delete this alarm')}</button>`)});
  const $b=id=>document.getElementById(id);
  if(nat){const b1=$b('almr1'),b2=$b('almr2'),b3=$b('almr3'),b4=$b('almr4');
    if(b1)b1.onclick=()=>NAT.pickRing(x.id);if(b2)b2.onclick=()=>NAT.pickFile(x.id);if(b3)b3.onclick=()=>NAT.previewRing(x.id);if(b4)b4.onclick=()=>{NAT.clearRing(x.id);const r=$b('almrn');if(r)r.textContent=T('Default alarm tone','Default alarm tone')}}
  const dl=$b('almdel');if(dl)dl.onclick=()=>{ALM=ALM.filter(y=>y.id!==x.id);saveALM();try{NAT&&NAT.clearRing&&NAT.clearRing(x.id)}catch(e){}try{nativeSync()}catch(e){}closeDlg();rerender()}}
window.ringPicked=(id,name)=>{const r=document.getElementById('almrn');if(r)r.textContent=name||''};
AX.almadd=el=>almForm(el.dataset.k);
AX.almedit=el=>almForm(null,ALM.find(y=>y.id===el.dataset.id));
AX.almon=el=>{const x=ALM.find(y=>y.id===el.dataset.id);if(x){x.on=!!el.checked;saveALM();try{schedTick()}catch(e){}try{nativeSync()}catch(e){}}};

/* ---------- browser (PWA) fallback: full-screen alarm page while the app is open ---------- */
let ALW={a:null,au:null,tmr:null};
function almStopRing(){if(ALW.au){try{ALW.au.pause()}catch(e){}ALW.au=null}if(navigator.vibrate)navigator.vibrate(0);const o=document.getElementById('almov');if(o)o.remove()}
function almDua(e){try{if(e.duaRaw){const a=new Audio('dua/'+e.duaRaw+'.mp3');a.volume=1;a.play().catch(()=>{})}else if(e.duaText&&typeof TTS!=='undefined'){TTS.run([{t:e.duaText}],{lang:e.duaLang||'ar'})}}catch(x){}}
function almWeb(e){if(almNat())return;almStopRing();const o=document.createElement('div');o.id='almov';o.style.cssText='position:fixed;inset:0;z-index:99999;background:#0b1220;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center';
  o.innerHTML=`<div style="font-size:64px">⏰</div><div style="font-size:44px;font-weight:700">${esc(e.body.split(' • ')[0])}</div><div style="font-size:24px">${esc(e.title)}</div><div class="row" style="gap:14px"><button class="btn gold" id="almsn" style="min-width:140px">😴 ${T('Snooze','Snooze')} ${e.snooze}m</button><button class="btn" id="almdm" style="min-width:140px">✅ ${T('Dismiss','Dismiss')}</button></div>`;
  document.body.appendChild(o);try{const a=new Audio('voice/'+(typeof VL==='function'?VL():'ur')+'/alert.mp3');a.loop=true;a.play().catch(()=>{});ALW.au=a}catch(x){}if(navigator.vibrate)navigator.vibrate([500,300,500,300,500]);
  document.getElementById('almdm').onclick=()=>{almStopRing();almDua(e)};
  document.getElementById('almsn').onclick=()=>{almStopRing();almDua(e);clearTimeout(ALW.tmr);ALW.tmr=setTimeout(()=>almWeb(e),e.snooze*60000)}}

/* ---------- compact card for the Home screen: next alarms + quick add ---------- */
function almNext(x){const now=new Date();for(let i=0;i<8;i++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);if(!almOn(x,d)||!hm(x.t))continue;const at=atTime(x.t,d);if(at>now)return at}return null}
function almHomeCard(){const L=ALM.filter(x=>x.on!==false).map(x=>({x,at:almNext(x)})).filter(o=>o.at).sort((a,b)=>a.at-b.at).slice(0,3);
  const rows=L.map(({x,at})=>{const k=ALK[x.kind]||ALK.other;return`<div class="row sp" style="padding:6px 0;border-bottom:1px solid var(--stroke)"><span>${k.i} <b>${esc(x.label||k.n())}</b></span><span class="muted sm">${t12(x.t)} • ${esc(almWhen(x))}</span></div>`}).join('');
  return`<div class="card"><div class="row sp"><h2 style="margin:0">⏰ ${T('Alarm','Alarm','الارم','अलार्म')}</h2><button class="btn s ghost" data-a="almall">${T('Sab alarm','All alarms')} ›</button></div>
   ${rows||`<p class="muted sm" style="margin:6px 0">${T('Abhi koi alarm nahi. Neeche se ek tap mein banayein — waqt par ringtone bajti hai, Snooze/Dismiss par dua padhi jaati hai.','No alarms yet. Add one below — the ringtone plays at the time and the dua is recited on Snooze/Dismiss.')}</p>`}
   <div class="row wrap mt">${Object.entries(ALK).map(([k,v])=>`<button class="btn s ghost" data-a="almadd" data-k="${k}">${v.i} ${v.n()}</button>`).join('')}</div></div>`}
AX.almall=()=>{DM.t='alarm';go('deen','duas')};

/* ---------- Office / work time: choose notification or ringing alarm for each time; reminders & tasks can ring too ---------- */
const jobMode=k=>{const m=S.job&&S.job.m&&S.job.m[k];return m===undefined?'n':m};
const JROWS=()=>[['login','💼',T('Office / job shuru','Start / login')],['brk','☕',T('Break shuru','Break start')],['brkEnd','▶️',T('Break khatam','Break over')],['leave','🏁',T('Chhutti / office khatam','Leave / finish')]];
function almEvents(base){const out=almEventsBase(base),J=S.job,dk=dkey(base);
  if(J&&J.on&&(J.days||[1,2,3,4,5,6]).includes(base.getDay()))JROWS().forEach(([k,i,n])=>{if(jobMode(k)!=='a'||!hm(J[k]))return;
    out.push({k:'jobalm_'+k,vn:({login:'job_login',brk:'break_start',brkEnd:'break_end',leave:'leave'})[k]||'alert',at:atTime(J[k],base),voice:'alert',title:`${i} ${n}`,body:t12(J[k]),tab:'kaam',sub:'waqt',alarm:1,aid:'job_'+k,snooze:10,duaRaw:'',duaText:'',duaLang:'ar'})});
  const hh=d=>pad(d.getHours())+':'+pad(d.getMinutes());
  try{(typeof ALERTS!=='undefined'?ALERTS:[]).forEach(a=>{if(!a.ring||!a.at||a.done)return;const d=new Date(a.at);if(dkey(d)!==dk)return;
      out.push({k:'ralm_'+a.id,vn:'reminder',at:d,voice:'alert',title:'⏰ '+a.title,body:t12(hh(d)),tab:'kaam',sub:'tasks',alarm:1,aid:'r_'+a.id,snooze:10,duaRaw:'',duaText:'',duaLang:'ar'})});
    (typeof TASKS!=='undefined'?TASKS:[]).forEach(t=>{if(!t.ring||!t.due||t.done)return;const d=new Date(t.due);if(dkey(d)!==dk)return;
      out.push({k:'talm_'+t.id,vn:'task',at:d,voice:'alert',title:'📋 '+t.title,body:t12(hh(d)),tab:'kaam',sub:'tasks',alarm:1,aid:'t_'+t.id,snooze:10,duaRaw:'',duaText:'',duaLang:'ar'})})}catch(e){}
  return out}
const JDN=()=>[[1,T('Peer','Mon')],[2,T('Mangal','Tue')],[3,T('Budh','Wed')],[4,T('Jumerat','Thu')],[5,T('Jumma','Fri')],[6,T('Hafta','Sat')],[0,T('Itwaar','Sun')]];
function officeCard(){const J=S.job,days=J.days||[1,2,3,4,5,6];
  const body=J.on?`<div style="display:flex;flex-wrap:wrap;gap:6px;padding:8px 0">${JDN().map(([d,n])=>`<button class="btn s ${days.includes(d)?'':'ghost'}" data-a="jobday" data-d="${d}">${n}</button>`).join('')}</div>`+
   JROWS().map(([k,i,n])=>`<div style="padding:9px 0;border-bottom:1px solid var(--stroke)"><div style="margin-bottom:6px"><b>${i} ${n}</b></div><div style="display:flex;gap:8px"><input type="time" value="${esc(J[k]||'')}" data-a="jobt" data-chg="1" data-k="${k}" style="flex:1;min-width:0;direction:ltr"><select data-a="jobm" data-k="${k}" style="flex:1.5;min-width:0"><option value="n"${jobMode(k)==='n'?' selected':''}>🔔 ${T('Notification','Notification')}</option><option value="a"${jobMode(k)==='a'?' selected':''}>⏰ ${T('Alarm (bajta hai)','Alarm (rings)')}</option><option value=""${jobMode(k)===''?' selected':''}>🚫 ${T('Band','Off')}</option></select></div></div>`).join('')+`<p class="muted sm" style="margin:8px 0 0;line-height:1.6">🔔 <b>${T('Notification','Notification')}</b>: ${T('waqt par awaaz wali notification ("Arsalan, break ka waqt…"), ek baar.','a spoken notification once.')}<br>⏰ <b>${T('Alarm','Alarm')}</b>: ${T('pehle wahi awaaz wali notification, phir 8 second baad ringtone bajti rehti hai jab tak aap Band ya Snooze (10 min) na dabayein.','first the spoken notification, then 8 s later the ringtone keeps ringing until you Stop or Snooze (10 min).')}</p>`+
   `<p class="muted sm" style="margin-top:8px">${T('🔔 Notification = awaaz ke saath khabar. ⏰ Alarm = ringtone bajti hai, Snooze/Dismiss ke saath (APK mein band app/screen off par bhi).','🔔 Notification = a spoken heads-up. ⏰ Alarm = rings with Snooze/Dismiss (in the APK even with the app closed/screen off).')}</p>`:
   `<p class="muted sm">${T('On karein, phir office/job ke waqt, break aur chhutti ka time chunein — har ek ke liye notification ya alarm.','Turn on, then set your office/job start, break and leave times — each as a notification or an alarm.')}</p>`;
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">💼 ${T('Office / Kaam ka waqt','Office / work time')}</h2><input type="checkbox" class="sw" data-a="jobon" ${J.on?'checked':''}></div>${body}</div>`}
const jobSync=()=>{saveS();try{schedTick()}catch(e){}try{nativeSync()}catch(e){}};
AX.jobon=el=>{S.job.on=!!el.checked;if(S.job.on)toast(T('Office ka waqt on ✅','Office time on ✅'));jobSync();rerender()};
AX.jobday=el=>{const d=+el.dataset.d,a=(S.job.days||[1,2,3,4,5,6]).slice(),i=a.indexOf(d);if(i>=0)a.splice(i,1);else a.push(d);S.job.days=a;jobSync();rerender()};
AX.jobt=el=>{if(!hm(el.value))return;S.job[el.dataset.k]=el.value;jobSync();toast(T('Waqt save ✅','Time saved ✅'))};
AX.jobm=el=>{S.job.m=Object.assign({},S.job.m||{});S.job.m[el.dataset.k]=el.value;jobSync();toast(el.value==='a'?T('Alarm lag gaya ⏰','Alarm set ⏰'):el.value==='n'?T('Notification lag gayi 🔔','Notification set 🔔'):T('Band kar diya','Turned off'))};

/* ---------- Home dashboard (top): overall day summary + office status + work time + extra time ---------- */
function officeStatus(){const J=S.job,now=new Date();
  if(!J||!J.on)return{t:T('Office ka waqt set nahi — tap karke set karein','Office time not set — tap to set'),c:'muted',set:1};
  if(!(J.days||[1,2,3,4,5,6]).includes(now.getDay()))return{t:T('Aaj office off hai 🌿 (kaam karenge to "extra waqt" mein jama hoga)','Office is off today 🌿 (any work counts as extra time)'),c:'ok'};
  const P=k=>atTime(J[k],now),lo=P('login'),bs=P('brk'),be=P('brkEnd'),lv=P('leave'),L=(a,b)=>fmtDur(Math.max(1,(a-b)/6e4));
  if(lo&&now<lo)return{t:T(`Office shuru hone mein ${L(lo,now)} (${t12(J.login)})`,`Office starts in ${L(lo,now)} (${t12(J.login)})`),c:'gold'};
  if(bs&&be&&now>=bs&&now<be)return{t:T(`☕ Break chal raha hai — ${L(be,now)} baqi (${t12(J.brkEnd)} tak)`,`☕ On break — ${L(be,now)} left (till ${t12(J.brkEnd)})`),c:'gold'};
  if(lv&&now<lv)return{t:T(`💼 Office chal raha hai — chhutti mein ${L(lv,now)} (${t12(J.leave)})`,`💼 At work — leave in ${L(lv,now)} (${t12(J.leave)})`),c:'ok'};
  return{t:T(`🏁 Office ka waqt khatam (${t12(J.leave)}) — ab ka kaam "extra waqt" hai`,`🏁 Office hours over (${t12(J.leave)}) — work now counts as extra time`),c:'ok',over:1}}
function workToday(){const from=new Date().setHours(0,0,0,0),J=S.job,now=Date.now();let tot=0,extra=0;
  const leave=(J&&J.on&&hm(J.leave))?+atTime(J.leave,new Date()):null,off=J&&J.on&&!(J.days||[1,2,3,4,5,6]).includes(new Date().getDay());
  const seg=(st,en)=>{if(st<from)st=from;const m=Math.max(0,(en-st)/6e4);tot+=m;if(J&&J.on){if(off)extra+=m;else if(leave){const a=Math.max(st,leave);extra+=Math.max(0,(en-a)/6e4)}}};
  TT.log.forEach(x=>{if(x.cat==='work'&&x.end>from)seg(x.start,x.end)});if(TT.run&&TT.run.cat==='work')seg(TT.run.start,now);
  return{tot,extra}}
function todayDash(){const d=dkey(),os=officeStatus(),w=workToday(),nowDeen=typeof hzScore==='function'?hzScore(d):0;
  const R=(typeof revSources==='function'?revSources().filter(x=>x.d===d).reduce((a,x)=>a+x.amt,0):0);
  const open=TASKS.filter(t=>!t.done).length,azOK=['k3','ist','dur'].filter(i=>azGet(i+'m')>=100&&azGet(i+'e')>=100).length;
  const nx=ALM.filter(x=>x.on!==false).map(x=>({x,at:almNext(x)})).filter(o=>o.at).sort((a,b)=>a.at-b.at)[0];
  const run=TT.run,isExtra=run&&run.cat==='work'&&os.over||(run&&run.cat==='work'&&S.job&&S.job.on&&!(S.job.days||[1,2,3,4,5,6]).includes(new Date().getDay()));
  const tile=(i,v,l,a,s)=>`<div class="stat tap" data-a="tab" data-v="${a}" data-s="${s||''}"><div class="sv" style="font-size:19px">${i} ${v}</div><div class="sl">${l}</div></div>`;
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">📊 ${T('Aaj ka dashboard','Today\'s dashboard')}</h2><span class="chip gold">${new Date().toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</span></div>
   <div class="stats" style="margin:10px 0">${tile('🕌',nowDeen+'<span class="sm muted">/5</span>',T('Namaz','Prayers'),'deen','namaz')}${tile('📖',tlToday()+'<span class="sm muted">/'+S.tilTarget+'</span>',T('Tilawat','Recitation'),'deen','quran')}${tile('📿',azOK+'<span class="sm muted">/3</span>',T('Azkar','Azkar'),'deen','azkar')}
    ${tile('✅',open,T('Kaam baqi','Tasks open'),'kaam','tasks')}${tile('💰','₹'+num(R),T('Aaj kamai','Earned'),'kaam','paisa')}${tile('⏰',nx?t12(nx.x.t):'—',nx?esc(nx.x.label||(ALK[nx.x.kind]||ALK.other).n()):T('Agla alarm','Next alarm'),'deen','duas')}</div>
   <div class="item" data-a="tab" data-v="kaam" data-s="tasks" style="cursor:pointer"><div class="ic2">💼</div><div class="t"><b>${T('Office / Kaam','Office / Work')}</b><div class="sm ${os.c}">${os.t}</div></div></div>
   <div class="stats two mt" style="margin-bottom:0"><div class="stat tap" data-a="tab" data-v="kaam" data-s="waqt"><div class="sv" style="font-size:20px">${fmtDur(w.tot)}</div><div class="sl">⏱ ${T('Kaam ka waqt','Work time')}</div></div><div class="stat tap" data-a="tab" data-v="kaam" data-s="waqt"><div class="sv" style="font-size:20px">${S.job&&S.job.on?fmtDur(w.extra):'—'}</div><div class="sl">➕ ${T('Extra waqt','Extra time')}</div></div></div>
   ${run?`<div class="mt" style="display:flex;flex-direction:column;gap:6px"><div><div class="eyebrow">${isExtra?'➕ '+T('EXTRA WAQT CHAL RAHA HAI','EXTRA TIME RUNNING'):'⏱ '+T('TIMER CHAL RAHA HAI','TIMER RUNNING')}</div><div class="sm">${esc(typeof dn==='function'?dn(run.act):run.act)}</div></div><div class="row sp"><div class="timer" data-since="${run.start}" style="font-size:24px;direction:ltr">00:00:00</div><button class="btn bad s" data-a="tstop">⏹ ${T('Rokein','Stop')}</button></div></div>`:
   `<div class="row wrap mt"><button class="btn s gold" data-a="dstart" data-x="0">▶ ${T('Office / kaam shuru','Start work')}</button><button class="btn s ghost" data-a="dstart" data-x="1">➕ ${T('Extra waqt shuru','Start extra time')}</button></div>`}</div>`}
AX.dstart=el=>tStart('work',el.dataset.x==='1'?T('Extra kaam','Extra work'):'Job');

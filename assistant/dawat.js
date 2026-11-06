'use strict';
/* ===== Dawat-o-Tabligh: the 5 kaam, gasht schedule + voice reminders, weekly (Jumma→Jumeraat) and monthly reports ===== */
let GS=store.get('gasht2',{});                       // {date:{own:1,nbr:1}}
const saveGS=()=>store.set('gasht2',GS);
let WK=store.get('wk2',{});                            // {date:{shab:1,mash:1}} weekly shab-guzari + mashwara
const saveWK=()=>store.set('wk2',WK);
const wkCfg=()=>{S.wk=Object.assign({on:true},S.wk||{});S.wk.shab=Object.assign({d:4},S.wk.shab||{});S.wk.mash=Object.assign({d:3,t:'20:30'},S.wk.mash||{});return S.wk};
const WKK=[['shab','🌙',()=>T('Hafta-wari shab-guzari (markaz/masjid mein raat)','Weekly shab-guzari (night at markaz/masjid)','ہفتہ وار شب گزاری (مرکز/مسجد میں رات)','हफ़्तावार शब-गुज़ारी (मरकज़/मस्जिद में रात)')],['mash','🤝',()=>T('Hafta-wari mashwara','Weekly mashwara','ہفتہ وار مشورہ','हफ़्तावार मशवरा')]];
function wkHas(ws,k){for(let i=0;i<7;i++){const g=WK[dkey(addDays(ws,i))];if(g&&g[k])return true}return false}

const DAYN=[['Itwaar','Sun','اتوار','रविवार'],['Peer','Mon','پیر','सोमवार'],['Mangal','Tue','منگل','मंगलवार'],['Budh','Wed','بدھ','बुधवार'],['Jumeraat','Thu','جمعرات','जुमेरात'],['Jumma','Fri','جمعہ','जुमा'],['Hafta','Sat','ہفتہ','हफ़्ता']];
const dayName=i=>T(DAYN[i][0],DAYN[i][1],DAYN[i][2],DAYN[i][3]);
const wkStart=(d=new Date())=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+2)%7));return x};   // week = Friday → Thursday
const mmM=m=>m.masjid!==undefined?(m.masjid?1:0):(m.talim?1:0);
const GK=[['own',()=>T('Apni masjid ka gasht','Gasht of own masjid','اپنی مسجد کا گشت','अपनी मस्जिद का गश्त')],['nbr',()=>T('Padosi masjid ka gasht','Gasht of neighbouring masjid','پڑوس کی مسجد کا گشت','पड़ोस की मस्जिद का गश्त')]];
const gashtCfg=k=>(S.gasht&&S.gasht[k])||{d:k==='own'?2:4,p:'Asr'};
/* ---------- stats for any date range (inclusive) ---------- */
function kaamStats(from,to){
  const todayK=dkey(),days=[];for(let d=new Date(from);d<=to;d=addDays(d,1))days.push(new Date(d));
  const r={days,tm:0,tg:0,h25:0,min:0,own:0,nbr:0,ownD:[],nbrD:[],missTm:0,missTg:0,missH:0,nam:{j:0,a:0,q:0,none:0,tot:0},elapsed:0};
  days.forEach(d=>{const k=dkey(d);if(k>todayK)return;const m=MM[k]||{},g=GS[k]||{},mn=m.minutes||0,isT=k===todayK;
    r.elapsed++;
    if(mmM(m))r.tm++;else if(!isT)r.missTm++;
    if(m.ghar)r.tg++;else if(!isT)r.missTg++;
    r.min+=mn;if(mn>=150)r.h25++;else if(!isT)r.missH++;
    if(g.own){r.own++;r.ownD.push(k)}if(g.nbr){r.nbr++;r.nbrD.push(k)}
    const h=HZ[k]||{};PRAY.forEach(p=>{r.nam.tot++;if(h[p]==='j')r.nam.j++;else if(h[p]==='a')r.nam.a++;else if(h[p]==='q')r.nam.q++;else r.nam.none++})});
  r.shab=0;r.mash=0;r.shabD=[];r.mashD=[];days.forEach(x=>{const k=dkey(x),g=WK[k];if(g&&g.shab){r.shab++;r.shabD.push(k)}if(g&&g.mash){r.mash++;r.mashD.push(k)}});
  const f=dkey(from),t=dkey(to);r.log=DT.log.filter(x=>x.date>=f&&x.date<=t);r.tdays=r.log.reduce((a,x)=>a+(+x.days||0),0);
  return r}
/* gasht missed? scheduled weekday passed in that Fri→Thu week and not logged */
function gashtMissed(ws,k){const c=gashtCfg(k),idx=(c.d+2)%7,d=addDays(ws,idx),kk=dkey(d);if(kk>=dkey())return false;return !(GS[kk]&&GS[kk][k])&&!weekHasGasht(ws,k)}
function weekHasGasht(ws,k){for(let i=0;i<7;i++){const g=GS[dkey(addDays(ws,i))];if(g&&g[k])return true}return false}
/* ---------- today's checklist ---------- */
function kaamCard(){
  const mm=mmToday(),min=mm.minutes||0,ws=wkStart(),wk=k=>weekHasGasht(ws,k),today=dkey();
  const month=new Date(),ms=new Date(month.getFullYear(),month.getMonth(),1),me=new Date(month.getFullYear(),month.getMonth()+1,0);
  const ks=kaamStats(ms,me),done5=[!!mmM(mm),!!mm.ghar,min>=150,wk('own')&&wk('nbr'),ks.tdays>=3].filter(Boolean).length;
  const row=(ok,ico,title,sub,right)=>`<div class="item kk${ok?' done':''}"><div class="ic2">${ico}</div><div class="t"><b>${title}</b>${sub?`<div class="muted sm">${sub}</div>`:''}</div>${right}</div>`;
  const ck=(k,on)=>`<input type="checkbox" class="ck" data-a="kaamtog" data-k="${k}" ${on?'checked':''}>`;
  const gl=k=>{const c=gashtCfg(k);return `${dayName(c.d)} • ${pname(c.p)} ${T('ke baad','after')}`};
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">🌿 ${T('Dawat ke 5 kaam','The 5 daily works','دعوت کے 5 کام','दावत के 5 काम')}</h2><span class="chip ${done5===5?'ok':'gold'}">${done5}/5</span></div>
   <p class="muted sm">${T('Roz ki masjid ki taleem, ghar ki taleem, dhai ghante, hafte ke 2 gasht, aur mahine ke 3 din.','Daily masjid taleem, home taleem, 2.5 hours, 2 weekly gasht and 3 days a month.','روز مسجد کی تعلیم، گھر کی تعلیم، ڈھائی گھنٹے، ہفتے کے 2 گشت، اور مہینے کے 3 دن۔','रोज़ मस्जिद की तालीम, घर की तालीम, ढाई घंटे, हफ़्ते के 2 गश्त और महीने के 3 दिन।')}</p>
   ${row(mmM(mm),'🕌',T('Masjid ki taleem (aaj)','Masjid taleem (today)'),'',ck('masjid',mmM(mm)))}
   ${row(mm.ghar,'🏠',T('Ghar ki taleem (aaj)','Home taleem (today)'),'',ck('ghar',mm.ghar))}
   <div class="item kk${min>=150?' done':''}" style="flex-wrap:wrap"><div class="ic2">⏱</div><div class="t"><b>${T('Dhai ghante (aaj)','2.5 hours (today)')}</b><div class="muted sm">${fmtDur(min)} / 2h 30m</div></div><div class="row" style="gap:6px"><button class="btn s" data-a="mmmin" data-n="30">+30m</button><button class="btn s" data-a="mmmin" data-n="60">+1h</button><button class="btn s ghost" data-a="mmmin" data-n="-30">−</button></div><div style="flex-basis:100%">${meter(min/150*100,min>=150?'full':'gold')}</div></div>
   ${GK.map(([k,nm])=>row(wk(k),'🚶',nm(),`${T('Is hafte','This week')}: ${wk(k)?'✅':'⏳'} • ${gl(k)}`,`<button class="btn s ${GS[today]&&GS[today][k]?'rdon':'ghost'}" data-a="gashttog" data-w="${k}">${GS[today]&&GS[today][k]?T('✓ Aaj kiya','✓ Done today'):T('Aaj kiya','Done today')}</button>`)).join('')}
   ${WKK.map(([k,ic,nm])=>{const c=wkCfg()[k],ok=wkHas(ws,k),td=WK[today]&&WK[today][k];return row(ok,ic,nm(),`${T('Is hafte','This week')}: ${ok?'✅':'⏳'} • ${dayName(c.d)}${k==='mash'?' • '+t12(c.t):''}`,`<button class="btn s ${td?'rdon':'ghost'}" data-a="wktog" data-w="${k}">${td?T('✓ Aaj kiya','✓ Done today'):T('Aaj kiya','Done today')}</button>`)}).join('')}
   ${row(ks.tdays>=3,'📅',T('Mahine ke 3 din','3 days this month'),`${ks.tdays}/3 ${T('din','days')}${ks.log.length?' • '+ks.log.map(x=>x.date.slice(8)+'/'+x.date.slice(5,7)+' ('+x.days+')').join(', '):''}`,`<button class="btn s" data-a="dawatadd">＋</button>`)}
   <div class="row wrap mt"><button class="btn s ghost" data-a="gashtset">⏰ ${T('Gasht ka din / namaz aur yaad-dahani','Gasht day / prayer & reminders')}</button></div></div>`}
/* ---------- weekly / monthly report ---------- */
const KR={p:'w',off:0};
function periodRange(p,off){const base=new Date();if(p==='w'){const s=wkStart(base);s.setDate(s.getDate()+off*7);return[s,addDays(s,6)]}
  const s=new Date(base.getFullYear(),base.getMonth()+off,1);return[s,new Date(s.getFullYear(),s.getMonth()+1,0)]}
const fmtDM=d=>pad(d.getDate())+'/'+pad(d.getMonth()+1);
function missList(p,s,e,r){const m=[],todayK=dkey();
  if(r.missTm)m.push(T(`Masjid ki taleem ${r.missTm} din chhooti`,`Masjid taleem missed ${r.missTm} day(s)`));
  if(r.missTg)m.push(T(`Ghar ki taleem ${r.missTg} din chhooti`,`Home taleem missed ${r.missTg} day(s)`));
  if(r.missH)m.push(T(`Dhai ghante ${r.missH} din poore nahi hue`,`2.5 hours not reached on ${r.missH} day(s)`));
  if(p==='w'){GK.forEach(([k,nm])=>{if(!weekHasGasht(s,k)){const c=gashtCfg(k),due=addDays(s,(c.d+2)%7);if(dkey(due)<todayK||dkey(e)<todayK)m.push(T(`${nm()} nahi hua (${dayName(c.d)})`,`${nm()} missed (${dayName(c.d)})`))}})}
  else{const weeks=Math.ceil((Math.min(e,new Date())-s)/(7*864e5)+0.001);GK.forEach(([k,nm])=>{const done=r[k],miss=Math.max(0,Math.min(weeks,Math.ceil(e<new Date()?e.getDate()/7:Math.floor((new Date().getDate()-1)/7)))-done);if(miss>0)m.push(T(`${nm()} ${miss} hafte mein nahi hua`,`${nm()} missed in ${miss} week(s)`))});
    if(e<new Date()&&r.tdays<3)m.push(T(`Mahine ke 3 din mein se ${3-r.tdays} baaki rahe`,`${3-r.tdays} of the 3 days not given`))}
  WKK.forEach(([k,ic,nm])=>{const c=wkCfg()[k];if(p==='w'){const due=addDays(s,(c.d+2)%7);if(!wkHas(s,k)&&(dkey(due)<todayK||dkey(e)<todayK))m.push(T(`${nm()} nahi hua (${dayName(c.d)})`,`${nm()} missed (${dayName(c.d)})`))}else{const wks=Math.max(0,Math.min(Math.ceil((Math.min(e,new Date())-s)/(7*864e5)),e<new Date()?5:Math.floor((new Date().getDate()-1)/7)));const miss=wks-r[k];if(miss>0)m.push(T(`${nm()} ${miss} hafte mein nahi hua`,`${nm()} missed in ${miss} week(s)`))}});
  if(r.nam.q)m.push(T(`${r.nam.q} namaz qaza`,`${r.nam.q} prayer(s) missed (qaza)`));
  return m}
function kaamReportCard(){
  const[s,e]=periodRange(KR.p,KR.off),r=kaamStats(s,e),isW=KR.p==='w',todayK=dkey();
  const cell=(k,ok)=>k>todayK?'<i class="kc f">·</i>':ok?'<i class="kc y">✓</i>':k===todayK?'<i class="kc t">·</i>':'<i class="kc n">✗</i>';
  const dayRow=(label,fn)=>`<div class="kr"><span class="kl">${label}</span>${r.days.map(d=>{const k=dkey(d);return cell(k,fn(k))}).join('')}</div>`;
  const head=`<div class="kr kh"><span class="kl"></span>${r.days.map(d=>`<b>${isW?dayName(d.getDay()).slice(0,3):d.getDate()}</b>`).join('')}</div>`;
  const grid=isW?`<div class="kgrid">${head}
    ${dayRow('🕋 '+T('Namaz (5)','Prayers (5)'),k=>hzScore(k)===5)}
    ${dayRow('🕌 '+T('Masjid taleem','Masjid taleem'),k=>mmM(MM[k]||{}))}
    ${dayRow('🏠 '+T('Ghar taleem','Home taleem'),k=>(MM[k]||{}).ghar)}
    ${dayRow('⏱ '+T('Dhai ghante','2.5 hrs'),k=>((MM[k]||{}).minutes||0)>=150)}
    ${dayRow('🚶 '+T('Apni masjid gasht','Own gasht'),k=>(GS[k]||{}).own)}
    ${dayRow('🚶 '+T('Padosi gasht','Neighbour gasht'),k=>(GS[k]||{}).nbr)}
    ${dayRow('🌙 '+T('Shab-guzari','Shab-guzari'),k=>(WK[k]||{}).shab)}
    ${dayRow('🤝 '+T('Mashwara','Mashwara'),k=>(WK[k]||{}).mash)}</div>`:'';
  const bar=(l,a,b,cls)=>`<div class="mrow2"><div class="row sp"><span>${l}</span><b>${a} / ${b}</b></div>${meter(b?a/b*100:0,cls||'gold')}</div>`;
  const ex=r.elapsed||1,np=r.nam.tot||1;
  const wkN=Math.max(1,Math.ceil((Math.min(e,new Date())-s)/(7*864e5)));
  const wkBars=WKK.map(([k,ic,nm])=>bar(ic+' '+nm(),isW?(wkHas(s,k)?1:0):r[k],isW?1:wkN)).join('');
  const sums=`${typeof hsReportRow==='function'?hsReportRow(s,e):''}${wkBars}${bar('🕋 '+T('Namaz (jamaat+akele)','Prayers'),r.nam.j+r.nam.a,r.nam.tot)}<div class="muted sm" style="margin:-4px 0 8px">${T('Jamaat se','In jamaat')} ${r.nam.j} • ${T('Akele','Alone')} ${r.nam.a} • ${T('Qaza','Missed')} ${r.nam.q} • ${T('Likhi nahi','Not logged')} ${r.nam.none}</div>
    ${bar('🕌 '+T('Masjid ki taleem (din)','Masjid taleem (days)'),r.tm,ex)}${bar('🏠 '+T('Ghar ki taleem (din)','Home taleem (days)'),r.tg,ex)}${bar('⏱ '+T('Dhai ghante poore (din)','2.5 hrs reached (days)'),r.h25,ex)}
    ${bar('🚶 '+T('Apni masjid gasht','Own masjid gasht'),r.own,isW?1:Math.ceil(r.days.length/7))}${bar('🚶 '+T('Padosi masjid gasht','Neighbour masjid gasht'),r.nbr,isW?1:Math.ceil(r.days.length/7))}
    ${isW?'':bar('📅 '+T('Mahine ke 3 din','3 days of the month'),Math.min(r.tdays,3),3,r.tdays>=3?'full':'gold')}`;
  const gd=(isW||1)?`<div class="muted sm">${r.ownD.length?T('Apni masjid gasht:','Own gasht:')+' '+r.ownD.map(k=>k.slice(8)+'/'+k.slice(5,7)).join(', ')+'<br>':''}${r.nbrD.length?T('Padosi masjid gasht:','Neighbour gasht:')+' '+r.nbrD.map(k=>k.slice(8)+'/'+k.slice(5,7)).join(', ')+'<br>':''}${r.log.length?T('3 din / safar:','Given time:')+' '+r.log.map(x=>x.date.slice(8)+'/'+x.date.slice(5,7)+' ('+x.days+' '+T('din','d')+')').join(', '):''}</div>`:'';
  const miss=missList(KR.p,s,e,r);
  const title=isW?`${fmtDM(s)} → ${fmtDM(e)} (${dayName(5)}–${dayName(4)})`:s.toLocaleDateString(LOC(),{month:'long',year:'numeric'});
  return`<div class="card"><div class="row sp"><h2 style="margin:0">📊 ${T('Report','Report','رپورٹ','रिपोर्ट')}</h2><div class="fch" style="padding:0"><button data-a="krp" data-v="w" class="${isW?'on':''}">${T('Hafta (Jumma se)','Week (from Jumma)')}</button><button data-a="krp" data-v="m" class="${isW?'':'on'}">${T('Mahina','Month')}</button></div></div>
   <div class="row sp mt"><button class="btn s ghost" data-a="kroff" data-d="-1">←</button><b>${title}</b><button class="btn s ghost" data-a="kroff" data-d="1" ${KR.off>=0?'disabled':''}>→</button></div>
   ${grid}<div style="margin-top:10px">${sums}</div>${gd}
   <div class="warnbox" style="margin-top:10px;${miss.length?'':'background:rgba(60,200,120,.12);border-color:rgba(60,200,120,.35)'}"><b>${miss.length?T('Jo kaam chhoot gaye:','Missed:'):T('Mashaallah — koi kaam nahi chhoota ✅','Mashaallah — nothing missed ✅')}</b>${miss.length?'<ul style="margin:6px 0 0;padding-left:18px">'+miss.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}</div></div>`}
function kaamSummaryText(s,e){const r=kaamStats(s,e),x=r.elapsed||1;
  return T(`Namaz ${r.nam.j+r.nam.a}/${r.nam.tot} • Masjid taleem ${r.tm}/${x} • Ghar taleem ${r.tg}/${x} • Dhai ghante ${r.h25}/${x} • Gasht apni ${r.own>0?'✅':'❌'} padosi ${r.nbr>0?'✅':'❌'} • 3 din ${Math.min(3,r.tdays)}/3`,
    `Prayers ${r.nam.j+r.nam.a}/${r.nam.tot} • Masjid taleem ${r.tm}/${x} • Home taleem ${r.tg}/${x} • 2.5h ${r.h25}/${x} • Gasht own ${r.own>0?'✅':'❌'} nbr ${r.nbr>0?'✅':'❌'} • 3 days ${Math.min(3,r.tdays)}/3`)}
/* ---------- gasht settings ---------- */
function gashtSetForm(){const G=S.gasht,dayOpts=DAYN.map((d,i)=>[i,dayName(i)]),pOpts=PRAY.map(p=>[p,pname(p)]);
  form(T('Gasht ka din aur namaz','Gasht day & prayer'),[
    {k:'on',l:T('Gasht ki voice notification','Gasht voice reminders'),t:'select',v:G.on?1:0,o:[[1,T('Haan, yaad dilayein','Yes, remind me')],[0,T('Nahi','No')]]},
    {k:'od',l:T('Apni masjid ka gasht — din','Own masjid gasht — day'),t:'select',v:G.own.d,o:dayOpts},{k:'op',l:T('Kaun si namaz ke baad','After which prayer'),t:'select',v:G.own.p,o:pOpts},
    {k:'nd',l:T('Padosi masjid ka gasht — din','Neighbour masjid gasht — day'),t:'select',v:G.nbr.d,o:dayOpts},{k:'np',l:T('Kaun si namaz ke baad','After which prayer'),t:'select',v:G.nbr.p,o:pOpts},
    {k:'sd',l:T('Shab-guzari ka din','Shab-guzari day'),t:'select',v:wkCfg().shab.d,o:dayOpts},{k:'md',l:T('Hafta-wari mashwara ka din','Weekly mashwara day'),t:'select',v:wkCfg().mash.d,o:dayOpts},{k:'mt',l:T('Mashwara ka waqt','Mashwara time'),t:'time',v:wkCfg().mash.t}],
    o=>{S.gasht={on:+o.on===1,own:{d:+o.od,p:o.op},nbr:{d:+o.nd,p:o.np}};S.wk={on:true,shab:{d:+o.sd},mash:{d:+o.md,t:hm(o.mt)?o.mt:'20:30'}};saveS();if(typeof schedTick==='function')schedTick();if(typeof nativeSync==='function')nativeSync();toast(T('Gasht set ho gaya ✅','Gasht saved ✅'));rerender()})}
/* ---------- reminder events (shared by web scheduler and the APK plan) ---------- */
function gashtEvents(base,az,jm){const out=[],G=S.gasht;if(!G||!G.on)return out;const dow=base.getDay();
  GK.forEach(([k,nm])=>{const c=G[k];if(!c||c.d!==dow)return;const p=c.p,pn=pname(p),w=nm(),azd=az(p),jmd=jm(p);
    const m=atTime('08:00',base);out.push({k:'gm_'+k,at:m,voice:'gasht',title:T(`Aaj ${pn} ke baad gasht hai 🚶`,`Gasht today after ${pn} 🚶`),body:`${w} • ${dayName(dow)} • ${pn} ${T('ke baad','after')}`,tab:'deen',sub:'khabar'});
    if(azd)out.push({k:'ga_'+k,at:azd,voice:'gasht',title:T(`${pn} ka waqt — namaz ke baad gasht`,`${pn} time — gasht after prayer`),body:w+(jmd?' • '+T('Jamaat','Jamaat')+' '+t12(hhmmOf(jmd)):''),tab:'deen',sub:'khabar'});
    if(jmd){const q=new Date(jmd);q.setMinutes(q.getMinutes()+90);out.push({k:'gq_'+k,at:q,ask:k,title:T(`Kya aaj ka gasht (${w}) ho gaya?`,`Did you do today's gasht (${w})?`),body:'',voice:'gasht',tab:'deen',sub:'khabar'})}});
  return out}
function reportEvents(base){const out=[],dow=base.getDay();
  if(dow===5){const ws=wkStart(addDays(base,-1)),we=addDays(ws,6);out.push({k:'rpw',at:atTime('07:00',base),voice:'review',title:T('Hafte ki report 📊 (Jumma se Jumeraat)','Weekly report 📊 (Jumma → Thursday)'),body:kaamSummaryText(ws,we),tab:'deen',sub:'khabar'})}
  if(base.getDate()===1){const pe=addDays(base,-1),ps=new Date(pe.getFullYear(),pe.getMonth(),1);out.push({k:'rpm',at:atTime('08:00',base),voice:'review',title:T('Mahine ki report 📊','Monthly report 📊'),body:kaamSummaryText(ps,pe),tab:'deen',sub:'khabar'})}
  return out}
function wkEvents(base){const out=[],C=wkCfg();if(!C.on)return out;const dow=base.getDay();
  if(C.shab.d===dow)out.push({k:'wk_shab',at:atTime('16:30',base),voice:'gasht',title:T('Aaj shab-guzari ka din 🌙','Shab-guzari day today 🌙'),body:T('Markaz/masjid mein raat guzarne ki taiyaari — bistar, zaroori saaman, ghar walon ko itla.','Prepare to spend the night at the markaz/masjid — bedding, essentials, inform family.'),tab:'deen',sub:'khabar'});
  if(C.mash.d===dow&&hm(C.mash.t))out.push({k:'wk_mash',at:atTime(C.mash.t,base),voice:'taleem',title:T('Hafta-wari mashwara ka waqt 🤝','Weekly mashwara time 🤝'),body:T('Is hafte ke kaam, gasht aur agle hafte ka tartib.','This week\'s work, gasht and plan for next week.'),tab:'deen',sub:'khabar'});
  return out}

/* ---------- your own events: jod, ijtema, mashwara, class... any name, day(s) and time, with reminder ---------- */
let CEV=store.get('cev2',[]),CEVD=store.get('cev2d',{});
const saveCEV=()=>{store.set('cev2',CEV);store.set('cev2d',CEVD)};
const CEVK=[['jor',()=>T('Jod','Jod')],['ijtema',()=>T('Ijtema','Ijtema')],['event',()=>T('Event','Event')],['mashwara',()=>T('Mashwara','Mashwara')],['other',()=>T('Doosra','Other')]];
const cevOn=(x,d)=>x.rep==='daily'||(x.rep==='week'&&(x.days||[]).includes(d.getDay()))||(x.rep==='date'&&x.date===dkey(d));
function cevEvents(base){const out=[];CEV.forEach(x=>{if(!cevOn(x,base)||!hm(x.t))return;const at=atTime(x.t,base);at.setMinutes(at.getMinutes()-(+x.pre||0));
  out.push({k:'cev_'+x.id,at,voice:'alert_event',title:`📌 ${x.title}`,body:(+x.pre?T(`${x.pre} min baad`,`in ${x.pre} min`)+' • ':'')+t12(x.t)+(x.note?' • '+x.note:''),tab:'deen',sub:'khabar'})});return out}
function cevCard(){const today=new Date(),k=dkey();
  const when=x=>x.rep==='daily'?T('Roz','Daily'):x.rep==='week'?(x.days||[]).map(i=>dayName(i)).join(', '):(x.date||'');
  const rows=CEV.map(x=>{const td=cevOn(x,today),dn=CEVD[k]&&CEVD[k][x.id];return`<div class="item kk${dn?' done':''}"><div class="ic2">📌</div><div class="t"><b>${esc(x.title)}</b><div class="muted sm">${esc(when(x))} • ${t12(x.t)}${+x.pre?' • '+x.pre+' '+T('min pehle yaad','min reminder'):''}${td?' • '+T('aaj','today'):''}</div></div><div class="row" style="gap:6px">${td?`<button class="btn s ${dn?'rdon':'ghost'}" data-a="cevdone" data-id="${x.id}">${dn?'✓':T('Ho gaya','Done')}</button>`:''}<button class="btn s ghost" data-a="cevedit" data-id="${x.id}">✎</button></div></div>`}).join('');
  return`<div class="card"><div class="row sp"><h2 style="margin:0">📌 ${T('Mere ijtema / events','My events & gatherings','میرے اجتماع / پروگرام','मेरे इज्तिमा / प्रोग्राम')}</h2><button class="btn s" data-a="cevadd">＋</button></div>
  <p class="muted sm">${T('Jod, ijtema, mashwara ya koi bhi event — naam, din aur waqt likhein; yaad-dahani notification aayegi.','Jod, ijtema, mashwara or any event — add name, day and time; you get a reminder.')}</p>${rows||`<p class="muted c">${T('Abhi koi event nahi. ＋ dabayein.','No events yet. Tap ＋.')}</p>`}</div>`}
function cevForm(x){const isN=!x;x=x||{id:uid(),title:'',kind:'jor',rep:'week',days:[5],date:dkey(),t:'09:00',pre:30,note:''};
  const dayOpts=DAYN.map((d,i)=>[i,dayName(i)]);
  form(isN?T('Naya event','New event'):T('Event badlein','Edit event'),[
    {k:'title',l:T('Naam (jaise: Jod, Shehri ijtema)','Name (e.g. Jod, city ijtema)'),v:x.title},
    {k:'kind',l:T('Qism','Type'),t:'select',v:x.kind,o:CEVK.map(([a,b])=>[a,b()])},
    {k:'rep',l:T('Kab','When'),t:'select',v:x.rep,o:[['week',T('Hafte ke din','Weekly day')],['daily',T('Roz','Every day')],['date',T('Sirf ek tareekh','One date only')]]},
    {k:'day',l:T('Hafte ka din (weekly ke liye)','Weekday (for weekly)'),t:'select',v:(x.days||[5])[0],o:dayOpts},
    {k:'date',l:T('Tareekh (ek tareekh ke liye)','Date (for one date)'),t:'date',v:x.date||dkey()},
    {k:'t',l:T('Waqt','Time'),t:'time',v:x.t},
    {k:'pre',l:T('Kitne minute pehle yaad dilayein','Remind how many minutes before'),t:'select',v:x.pre,o:[[0,T('Theek waqt par','At the time')],[10,'10'],[30,'30'],[60,'60'],[180,'180'],[1440,T('1 din pehle','1 day before')]]},
    {k:'note',l:T('Note (jagah wagairah)','Note (place etc.)'),v:x.note||''}],
    o=>{if(!o.title){toast(T('Naam likhein','Enter a name'));return false}if(!hm(o.t)){toast(T('Waqt chunein','Pick a time'));return false}
      const n={id:x.id,title:o.title,kind:o.kind,rep:o.rep,days:[+o.day],date:o.date,t:o.t,pre:+o.pre,note:o.note};const i=CEV.findIndex(y=>y.id===x.id);if(i>=0)CEV[i]=n;else CEV.push(n);saveCEV();
      try{schedTick()}catch(e){}try{nativeSync()}catch(e){}toast(T('Event save ✅ — yaad dilaya jayega','Event saved ✅'));rerender()},
    {extra:isN?'':`<button class="btn bad s mt" id="cevdel">${T('Ye event hatayein','Delete this event')}</button>`});
  const dl=$('#cevdel');if(dl)dl.onclick=()=>{CEV=CEV.filter(y=>y.id!==x.id);saveCEV();try{nativeSync()}catch(e){}closeDlg();rerender()}}
/* ---------- actions ---------- */
const AX=window.AX=window.AX||{};
AX.kaamtog=el=>{const k=el.dataset.k,on=el.checked?1:0;mmSet(k,on);const m=mmToday();mmSet('talim',(mmM(m)||m.ghar)?1:0);sfx(on?'success':'tick');rerender()};
AX.cevadd=()=>cevForm();AX.cevedit=el=>cevForm(CEV.find(x=>x.id===el.dataset.id));AX.cevdone=el=>{const k=dkey();CEVD[k]=CEVD[k]||{};if(CEVD[k][el.dataset.id])delete CEVD[k][el.dataset.id];else CEVD[k][el.dataset.id]=1;saveCEV();sfx('success');rerender()};
AX.wktog=el=>{const k=el.dataset.w,d=dkey();WK[d]=WK[d]||{};if(WK[d][k])delete WK[d][k];else WK[d][k]=1;saveWK();sfx('success');rerender()};
AX.gashttog=el=>{const k=el.dataset.w,d=dkey();GS[d]=GS[d]||{};if(GS[d][k])delete GS[d][k];else GS[d][k]=1;saveGS();sfx('success');rerender()};
AX.gashtset=()=>gashtSetForm();
AX.krp=el=>{KR.p=el.dataset.v;KR.off=0;rerender()};
AX.kroff=el=>{KR.off=Math.min(0,KR.off+(+el.dataset.d));rerender()};
function kaamHomeCard(){const mm=mmToday(),ws=wkStart(),min=mm.minutes||0,ms=new Date(new Date().getFullYear(),new Date().getMonth(),1),ks=kaamStats(ms,new Date(new Date().getFullYear(),new Date().getMonth()+1,0));
  const d=[[mmM(mm),T('Masjid taleem','Masjid taleem')],[mm.ghar,T('Ghar taleem','Home taleem')],[min>=150,T('Dhai ghante','2.5 hrs')],[weekHasGasht(ws,'own')&&weekHasGasht(ws,'nbr'),T('2 gasht','2 gasht')],[ks.tdays>=3,T('3 din','3 days')]];
  return`<div class="card tap" data-a="tab" data-v="deen" data-s="khabar"><div class="row sp"><b>🌿 ${T('Dawat ke 5 kaam','Dawat — 5 works')}</b><span class="chip ${d.every(x=>x[0])?'ok':'gold'}">${d.filter(x=>x[0]).length}/5</span></div><div class="dots mt" style="gap:8px;flex-wrap:wrap">${d.map(x=>`<span class="chip ${x[0]?'ok':''}">${x[0]?'✓':'○'} ${x[1]}</span>`).join('')}</div></div>`}

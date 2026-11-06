'use strict';
/* ===== OFFICE tab: HachiFeel + Hachi Shears — duty, dashboard, aaj ka kaam/research, team, AI apps, mood fresh ===== */
let OFC=store.get('ofc',{log:[],team:[],water:{},brand:'hf',v:'home'});
const saveOFC=()=>store.set('ofc',OFC);
const OBR={hf:{n:'HachiFeel',c:'#e8650f',c2:'#1f7a3a',logo:'hachifeel.webp',d:()=>T('Main brand — supplements','Main brand — supplements')},hs:{n:'Hachi Shears',c:'#2b2f36',c2:'#c0c7d1',logo:'',d:()=>T('Kainchiyon (scissors) ka brand','Scissors brand')}};
const OLOGO2={get(){try{return localStorage.getItem('hs_logo')||''}catch(e){return''}},set(v){try{if(v)localStorage.setItem('hs_logo',v);else localStorage.removeItem('hs_logo')}catch(e){}}};
const OKIND=[['project',()=>T('🎬 Project','🎬 Project')],['research',()=>T('🔬 Research','🔬 Research')],['design',()=>T('🎨 Design','🎨 Design')],['video',()=>T('🎥 Video','🎥 Video')],['meeting',()=>T('🤝 Meeting','🤝 Meeting')],['other',()=>T('📌 Aur','📌 Other')]];
const okind=k=>(OKIND.find(x=>x[0]===k)||OKIND[5])[1]();
/* AI apps — app khulti hai agar phone mein install ho, warna website */
const OAPPS=[
  {k:'claude',n:'Claude',p:'com.anthropic.claude',u:'https://claude.ai/',g:['#d97757','#a3452c'],s:'C'},
  {k:'chatgpt',n:'ChatGPT',p:'com.openai.chatgpt',u:'https://chatgpt.com/',g:['#10a37f','#0b6b53'],s:'G'},
  {k:'gemini',n:'Gemini',p:'com.google.android.apps.bard',u:'https://gemini.google.com/',g:['#4f7cff','#a259ff'],s:'✦'},
  {k:'eleven',n:'ElevenLabs',p:'io.elevenlabs.app,com.elevenlabs.app,io.elevenlabs.readerapp',u:'https://elevenlabs.io/app/home',g:['#3a3a3a','#0d0d0d'],s:'II'},
  {k:'meta',n:'Meta AI',p:'com.facebook.stella,com.meta.ai',u:'https://www.meta.ai/',g:['#0866ff','#a43cff'],s:'◎'},
  {k:'flow',n:'Google Flow',p:'com.google.android.apps.labs.flow',u:'https://labs.google/fx/tools/flow',g:['#34a853','#1a73e8'],s:'▶'}];
const oAppUrl=a=>window.AndroidPA?`pa-open://pkg?p=${encodeURIComponent(a.p)}&u=${encodeURIComponent(a.u)}`:a.u;
const OQUOTES=[['Jo kaam Bismillah se shuru ho, usme barkat hoti hai.','Work begun with Bismillah carries barakah.'],['Allah usko pasand karta hai jo apna kaam itqaan (behtareen tareeqe) se kare. — Hadees','Allah loves that when one of you does a job, he perfects it. — Hadith'],['Chhota kaam roz karna, bade kaam ek din karne se behtar hai.','Small work daily beats big work once.'],['Pehle mushkil kaam — baad mein aasan. Subah ka waqt sona hai.','Hard task first — mornings are gold.'],['Har research ek nayi video ka beej hai. 🌱','Every research is a seed of a new video. 🌱'],['Rabbi zidni ilma — Aye Rabb, mere ilm mein izafa farma.','My Lord, increase me in knowledge.'],['Thoda aaram bhi ibaadat hai, agar niyyat taaza hone ki ho.','Rest is worship too, if the intention is to refresh.'],['Client khush, Rabb khush — imaandari sabse bada brand hai.','Honesty is the biggest brand.']];
const ODUA=[['اَللّٰهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا','Allahumma barik lana fima razaqtana','Aye Allah, jo rizq Tu ne diya usmein barkat de.'],['رَبِّ زِدْنِي عِلْمًا','Rabbi zidni ilma','Aye Rabb, mere ilm mein izafa farma.'],['رَبِّ يَسِّرْ وَلَا تُعَسِّرْ','Rabbi yassir wa la tu\'assir','Aye Rabb, aasani farma, mushkil na farma.'],['حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ','Hasbunallahu wa ni\'mal wakeel','Allah humein kaafi hai, aur woh behtareen kaarsaaz hai.']];
let OFCW=0;
function oToday(){const from=new Date().setHours(0,0,0,0);return OFC.log.filter(x=>x.ts>=from)}
function oRange(days){const from=new Date();from.setHours(0,0,0,0);from.setDate(from.getDate()-days+1);return OFC.log.filter(x=>x.ts>=+from)}
function oHero(){const J=jobDay(dkey()),st=typeof dState==='function'?dState():'off',lab={off:T('Duty OFF','Off duty'),on:T('Duty ON','On duty'),brk:T('Break par','On break'),done:T('Aaj ki duty mukammal','Done for today')}[st];
  const hs=OLOGO2.get();
  return`<div class="card ofhero"><div class="ofglow"></div>
   <div class="ofwel"><span class="ofw1">${T('WELCOME TO','WELCOME TO')}</span><span class="ofw2">${T('Office','Office')} ✨</span><span class="ofw3">${esc(nm())} • ${new Date().toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}</span></div>
   <div class="ofbrands"><div class="ofbr hf"><img src="hachifeel.webp" alt="HachiFeel"></div><div class="ofbr hs" data-a="ofhslogo">${hs?`<img src="${hs}" alt="Hachi Shears">`:`<b>✂️ Hachi Shears</b><small>${T('logo lagayein','add logo')}</small>`}</div></div>
   <div class="row sp mt" style="position:relative"><span class="chip ${st==='on'?'ok':st==='brk'?'gold':''}">● ${lab}</span><span class="muted sm">${T('Shift','Shift')} ${t12(J.login)} – ${t12(J.leave)}</span></div></div>`}
function oDash(){const td=dkey(),r=DL[td],c=r?dCalc(td,r):null,w=dReport('w',0).S,m=dReport('m',0).S,ws=oRange(7),tl=oToday();
  const dvd=typeof dvOfficeDay==='function'?dvOfficeDay(td):0;
  const tile=(v,l,ic)=>`<div class="ofst"><div class="ofsi">${ic}</div><div class="ofsv">${v}</div><div class="ofsl">${l}</div></div>`;
  return`<div class="card"><div class="row sp"><h2 style="margin:0">📊 ${T('Dashboard','Dashboard')}</h2><button class="btn s ghost" data-a="ofsum">📋 ${T('Aaj ki summary','Today summary')}</button></div>
   <div class="ofgrid">${tile(c?n2dur(c.duty):'—',T('Aaj duty','Duty today'),'⏱')}${tile(c&&c.ot?n2dur(c.ot):'0',T('Aaj overtime','OT today'),'➕')}${tile(tl.length,T('Aaj ke kaam','Tasks today'),'✅')}${tile(typeof dvd==='object'?Object.values(dvd).reduce((a,b)=>a+(+b||0),0):(+dvd||0),T('Aaj delivery','Delivered'),'📦')}
    ${tile(n2dur(w.duty),T('Is hafte duty','Week duty'),'📅')}${tile(n2dur(m.duty),T('Is mahine','Month duty'),'🗓')}${tile(n2dur(m.ot),T('Mahine ka OT','Month OT'),'🔥')}${tile(m.present+'/'+m.expected,T('Hazir din','Days present'),'🙋')}</div>
   <div class="ofbars">${['hf','hs'].map(b=>{const n=ws.filter(x=>x.brand===b).length,tot=Math.max(1,ws.length);return`<div class="ofbar"><span>${OBR[b].n}</span><i><b style="width:${Math.round(n/tot*100)}%;background:linear-gradient(90deg,${OBR[b].c},${OBR[b].c2})"></b></i><em>${n}</em></div>`}).join('')}<div class="muted sm">${T('Pichhle 7 din ke kaam — brand ke hisaab se','Last 7 days work by brand')}</div></div>
   <div class="row wrap mt" style="gap:6px"><button class="btn s ghost" data-a="tab" data-v="kaam" data-s="duty">📊 ${T('Poori duty report + PDF','Full duty report + PDF')}</button><button class="btn s ghost" data-a="dpast" data-m="0">🗓 ${T('Pichhle din bharein','Fill past days')}</button></div></div>`}
function oLogCard(){const L=oToday().sort((a,b)=>b.ts-a.ts);const all=OFC.log.slice().sort((a,b)=>b.ts-a.ts).slice(0,30);const v=OFC.lv||'today';const show=v==='today'?L:all;
  return`<div class="card"><div class="row sp"><h2 style="margin:0">🧠 ${T('Aaj kis project / research par kaam kiya','Today\'s projects & research')}</h2></div>
   <div class="row wrap" style="gap:6px;margin:8px 0">${['hf','hs'].map(b=>`<button class="btn s ofbb" style="--c:${OBR[b].c};--c2:${OBR[b].c2}" data-a="oflogadd" data-b="${b}">＋ ${OBR[b].n}</button>`).join('')}</div>
   <div class="fch" style="padding:0 0 6px"><button data-a="oflv" data-v="today" class="${v==='today'?'on':''}">${T('Aaj','Today')} (${L.length})</button><button data-a="oflv" data-v="all" class="${v==='all'?'on':''}">${T('Pichhle sab','Recent')}</button></div>
   ${show.length?show.map(x=>`<div class="item oflog" style="--c:${OBR[x.brand]?OBR[x.brand].c:'#888'}"><div class="t"><b>${esc(x.title)}</b><div class="muted sm">${okind(x.kind)} • ${OBR[x.brand]?OBR[x.brand].n:''}${x.mins?' • '+n2dur(x.mins):''} • ${v==='all'?new Date(x.ts).toLocaleDateString(LOC(),{day:'numeric',month:'short'})+' ':''}${t12(hhmmOf(new Date(x.ts)))}</div>${x.note?`<div class="sm" style="margin-top:3px;white-space:pre-wrap">${esc(x.note)}</div>`:''}</div><button class="btn s ghost" data-a="oflogedit" data-id="${x.id}">✏️</button></div>`).join(''):`<p class="muted c">${T('Abhi kuch nahi likha — upar brand chun kar likhein.','Nothing yet — pick a brand above.')}</p>`}</div>`}
function oLogForm(x,brand){x=x||{};form(x.id?T('Kaam badlein','Edit work'):T('Aaj ka kaam / research','Log work / research'),[
   {k:'brand',l:T('Brand','Brand'),t:'select',v:x.brand||brand||'hf',o:[['hf','HachiFeel'],['hs','Hachi Shears']]},
   {k:'kind',l:T('Kis tarah ka kaam','Type'),t:'select',v:x.kind||'project',o:OKIND.map(k=>[k[0],k[1]()])},
   {k:'title',l:T('Kya kiya? (project / topic)','What? (project / topic)'),v:x.title||'',p:T('jaise: Ashwagandha ad script, Shears product photos','e.g. Ashwagandha ad script')},
   {k:'mins',l:T('Kitna waqt laga (minute)','Time (minutes)'),t:'number',m:'numeric',v:x.mins||''},
   {k:'note',l:T('Note / link / natija','Note / link / result'),t:'area',v:x.note||''},
   ...(x.id?[{k:'del',l:T('Hatayein?','Delete?'),t:'select',v:'',o:[['',T('Nahi','No')],['1',T('Haan','Yes')]]}]:[])],o=>{
   if(o.del){OFC.log=OFC.log.filter(y=>y.id!==x.id);saveOFC();rerender();return}
   if(!o.title)return false;const e={id:x.id||uid(),ts:x.ts||Date.now(),brand:o.brand,kind:o.kind,title:o.title.trim(),mins:+o.mins||0,note:(o.note||'').trim()};
   if(x.id)OFC.log=OFC.log.map(y=>y.id===x.id?e:y);else OFC.log.push(e);saveOFC();toast(T('Likh liya ✅','Saved ✅'));rerender()})}
function oTeam(){const L=OFC.team;return`<div class="card"><div class="row sp"><h2 style="margin:0">👥 ${T('Company ke log','Team')}</h2><button class="btn s gold" data-a="ofteam">＋ ${T('Naya','Add')}</button></div>
  ${L.length?L.map(p=>`<div class="item"><div class="ofav" style="--c:${OBR[p.brand]?OBR[p.brand].c:'#e0b24a'}">${esc((p.n||'?').trim().slice(0,1).toUpperCase())}</div><div class="t"><b>${esc(p.n)}</b><div class="muted sm">${esc(p.role||'')}${p.brand&&OBR[p.brand]?' • '+OBR[p.brand].n:''}</div>${p.note?`<div class="muted sm">${esc(p.note)}</div>`:''}</div>
   ${p.ph?`<a class="btn s ghost" href="tel:${esc(p.ph)}">📞</a><a class="btn s ghost" href="https://wa.me/${esc(String(p.ph).replace(/\D/g,'').replace(/^0/,'91').replace(/^(\d{10})$/,'91$1'))}" target="_blank" rel="noopener">💬</a>`:''}${p.em?`<a class="btn s ghost" href="mailto:${esc(p.em)}">✉️</a>`:''}<button class="btn s ghost" data-a="ofteam" data-id="${p.id}">✏️</button></div>`).join(''):`<p class="muted c">${T('Boss, team members, designer, accounts… sab ke naam, kaam aur number yahan rakhein.','Add your boss, teammates and their numbers here.')}</p>`}</div>`}
function oTeamForm(id){const p=OFC.team.find(x=>x.id===id)||{};form(id?T('Badlein','Edit'):T('Naya shakhs','New person'),[{k:'n',l:T('Naam','Name'),v:p.n||''},{k:'role',l:T('Ohda / kaam','Role'),v:p.role||'',p:T('jaise: Manager, Designer, Accounts','e.g. Manager')},{k:'brand',l:T('Brand','Brand'),t:'select',v:p.brand||'hf',o:[['hf','HachiFeel'],['hs','Hachi Shears'],['both',T('Dono','Both')]]},{k:'ph',l:T('Phone / WhatsApp','Phone'),t:'tel',v:p.ph||''},{k:'em',l:'Email',t:'email',v:p.em||''},{k:'note',l:T('Note (birthday, kya pasand, kis cheez ka zimma)','Note'),t:'area',v:p.note||''},...(id?[{k:'del',l:T('Hatayein?','Delete?'),t:'select',v:'',o:[['',T('Nahi','No')],['1',T('Haan','Yes')]]}]:[])],o=>{
  if(o.del){OFC.team=OFC.team.filter(x=>x.id!==id);saveOFC();rerender();return}if(!o.n)return false;const e={id:id||uid(),n:o.n.trim(),role:(o.role||'').trim(),brand:o.brand,ph:(o.ph||'').trim(),em:(o.em||'').trim(),note:(o.note||'').trim()};
  if(id)OFC.team=OFC.team.map(x=>x.id===id?e:x);else OFC.team.push(e);saveOFC();rerender()})}
function oApps(){return`<div class="card"><h2 style="margin:0 0 10px">🚀 ${T('AI tools — ek tap mein','AI tools — one tap')}</h2><div class="ofapps">${OAPPS.map(a=>`<a class="ofapp" href="${esc(oAppUrl(a))}" ${window.AndroidPA?'':'target="_blank" rel="noopener"'}><span class="ofai" style="--g1:${a.g[0]};--g2:${a.g[1]}"><b>${a.s}</b></span><span class="ofan">${a.n}</span></a>`).join('')}</div><p class="muted sm" style="margin-top:8px">${T('Phone mein app install ho to seedha app khulegi, warna website.','Opens the installed app, else the website.')}</p></div>`}
function oMood(){const q=OQUOTES[(new Date().getDate()+new Date().getHours())%OQUOTES.length],d=ODUA[new Date().getDate()%ODUA.length],w=OFC.water[dkey()]||0;
  return`<div class="card ofmood"><h2 style="margin:0 0 8px">🌿 ${T('Mood fresh','Refresh')}</h2>
   <div class="ofq">“${esc(T(q[0],q[1]))}”</div>
   <div class="ofdua"><div class="ar" dir="rtl">${d[0]}</div><div class="sm"><i>${esc(d[1])}</i> — ${esc(d[2])}</div></div>
   <div class="row wrap mt" style="gap:6px"><button class="btn s gold" data-a="ofbreath">🫁 ${T('1 minute saans','1-min breathing')}</button><button class="btn s ghost" data-a="ofwater">💧 ${T('Paani','Water')} ${w}/8</button><button class="btn s ghost" data-a="ofstretch">🧘 ${T('Stretch','Stretch')}</button><button class="btn s ghost" data-a="ofnewq">🔄 ${T('Naya khayal','New thought')}</button></div></div>`}
async function renderOffice(el){if(OFCW!==1){OFCW=1;try{if(S.voice||S.sfx!==false){const u=await VO.blob('ofc_welcome');const a=new Audio(u);a.play().catch(()=>{})}}catch(e){}}
  document.body.classList.add('ofcbg');
  el.innerHTML=oHero()+(typeof dutyToday==='function'?dutyToday():'')+oDash()+oLogCard()+(typeof dvOfficeCard==='function'?dvOfficeCard():'')+oApps()+oMood()+oTeam()}
/* welcome awaaz har baar jab Office tab mein aayein */
{const _go=go;go=function(t,s){if(t==='office'&&curTab!=='office')OFCW=0;if(t!=='office')document.body.classList.remove('ofcbg');return _go(t,s)}}
A.oflogadd=el=>oLogForm(null,el.dataset.b);A.oflogedit=el=>oLogForm(OFC.log.find(x=>x.id===el.dataset.id));A.oflv=el=>{OFC.lv=el.dataset.v;saveOFC();rerender()};
A.ofteam=el=>oTeamForm(el.dataset.id);
A.ofhslogo=()=>{const old=LOGO.get();logoPick(()=>{const v=LOGO.get();if(v&&v!==old)OLOGO2.set(v);LOGO.set(old);rerender()})};
A.ofwater=()=>{const k=dkey();OFC.water[k]=Math.min(12,(OFC.water[k]||0)+1);saveOFC();sfx('ding');toast(T(`💧 ${OFC.water[k]} glass — shabash!`,`💧 ${OFC.water[k]} glasses`));rerender()};
A.ofnewq=()=>{OQUOTES.push(OQUOTES.shift());rerender()};
A.ofstretch=()=>dlg(`<h2 class="h2">🧘 ${T('2 minute stretch','2-min stretch')}</h2><ol style="line-height:1.9">${[T('Gardan dheere daayen-baayen — 5 baar','Neck left-right — 5x'),T('Kandhe upar kheench kar chhodein — 10 baar','Shoulder shrugs — 10x'),T('Haath jod kar upar kheenchein — 15 second','Arms up stretch — 15s'),T('Kalaiyan (wrist) gol ghumayein — 10 baar','Wrist circles — 10x'),T('Khade ho kar thoda chalein, paani piyein','Stand up, walk, drink water'),T('Aankhon ko 20 second door dekhein (20-20-20)','Look far for 20s (20-20-20)')].map(x=>`<li>${x}</li>`).join('')}</ol><button class="btn mt" style="width:100%" data-a="closedlg">✅ ${T('Ho gaya','Done')}</button>`);
A.ofbreath=()=>{dlg(`<h2 class="h2 c">🫁 ${T('Saans lein…','Breathe…')}</h2><div class="ofbr8"><div class="ofbrc" id="ofbrc"></div><div class="ofbrt" id="ofbrt">${T('Andar','In')}</div></div><p class="muted sm c">${T('4 second andar • 4 roko • 6 bahar — har saans ke saath "SubhanAllah"','In 4 • hold 4 • out 6')}</p><button class="btn ghost mt" style="width:100%" data-a="closedlg">${T('Bas','Stop')}</button>`);
  let i=0;const ph=[[T('Andar','In'),4000,1.35],[T('Roko','Hold'),4000,1.35],[T('Bahar','Out'),6000,.8]];const step=()=>{const d=$('#dlg');const c=$('#ofbrc'),t=$('#ofbrt');if(!d.open||!c)return;const p=ph[i%3];t.textContent=p[0];c.style.transition=`transform ${p[1]}ms ease-in-out`;c.style.transform=`scale(${p[2]})`;i++;if(i<15)setTimeout(step,p[1]);else t.textContent=T('Shabash ✨','Well done ✨')};setTimeout(step,200)};
A.ofsum=async()=>{const td=dkey(),r=DL[td],c=r?dCalc(td,r):null,L=oToday();
  const t=`*${T('Aaj ki office summary','Today\'s office summary')}* — ${new Date().toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'})}\n`+
   (r&&r.in?`⏱ Login ${dTs(r.in)}${r.out?' • Logout '+dTs(r.out):''} • Duty ${c?n2dur(c.duty):''}${c&&c.ot?' • OT '+n2dur(c.ot):''}\n`:'')+
   ['hf','hs'].map(b=>{const x=L.filter(y=>y.brand===b);return x.length?`\n*${OBR[b].n}*\n`+x.map(y=>`• ${okind(y.kind)}: ${y.title}${y.mins?' ('+n2dur(y.mins)+')':''}${y.note?' — '+y.note:''}`).join('\n'):''}).join('');
  try{await navigator.clipboard.writeText(t);toast(T('Summary copy ho gayi — WhatsApp mein paste karein ✅','Copied ✅'))}catch(e){dlg(`<h2 class="h2">📋 Summary</h2><textarea rows="12" style="width:100%">${esc(t)}</textarea><button class="btn mt" style="width:100%" data-a="closedlg">OK</button>`)}};
try{buildDock();layoutDock()}catch(e){}
if(curTab==='office')setTimeout(()=>rerender(),0);

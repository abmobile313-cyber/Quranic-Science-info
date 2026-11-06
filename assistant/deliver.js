'use strict';
/* ===== Delivery tracker: office (company) deliveries kept separate; Flow Studio + personal log client-wise ===== */
let DV=store.get('deliv',[]);
const saveDV=()=>store.set('deliv',DV);
const DVS={office:()=>'🏢 '+T('Office','Office'),fs:()=>'🎬 Flow Studio',personal:()=>'👤 '+T('Personal','Personal')};
const DVT={video:()=>'🎥 '+T('Video','Video'),image:()=>'🖼 '+T('Image','Image'),graphic:()=>'🎨 '+T('Graphic design','Graphic design'),other:()=>'📦 '+T('Aur kuch','Other')};
const DVV={scope:'office',off:0};
const dvDay=x=>dkey(new Date(x.ts));
function dvOfficeDay(dk){return DV.filter(x=>x.scope==='office'&&dvDay(x)===dk).reduce((a,x)=>a+(x.n||1),0)}
function dvOfficeTotals(a,b){const A=new Date(a);A.setHours(0,0,0,0);const B=new Date(b);B.setHours(23,59,59,999);const o={total:0,video:0,image:0,graphic:0,other:0};
  DV.filter(x=>x.scope==='office'&&x.ts>=+A&&x.ts<=+B).forEach(x=>{const n=x.n||1;o.total+=n;o[x.type]=(o[x.type]||0)+n});return o}
const dvRange=(per)=>{const t=new Date();t.setHours(0,0,0,0);if(per==='w'){const a=new Date(t);a.setDate(a.getDate()-((a.getDay()+6)%7));return[a,new Date(t)]}if(per==='m')return[new Date(t.getFullYear(),t.getMonth(),1),new Date(t)];return[t,t]};
function dvForm(scope,x){const clients=[...new Set(DV.filter(y=>y.scope===scope&&y.client).map(y=>y.client))];
  form(x?T('Delivery badlein','Edit delivery'):T('Nayi delivery','New delivery')+' — '+DVS[scope](),[
    {k:'title',l:T('Kya deliver kiya? (project / file ka naam)','What was delivered?'),v:x?x.title:'',p:T('jaise: Reel #12','e.g. Reel #12')},
    {k:'type',l:T('Qism','Type'),t:'select',v:x?x.type:'video',o:Object.keys(DVT).map(k=>[k,DVT[k]()])},
    ...(scope==='office'?[{k:'n',l:T('Kitne (count)','How many'),t:'number',m:'numeric',v:x?x.n||1:1}]:[{k:'client',l:T('Kis ko diya (client ka naam)','Delivered to (client)'),v:x?x.client:'',p:clients.slice(0,4).join(', ')||T('client ka naam','client name')}]),
    {k:'note',l:T('Note (optional)','Note (optional)'),v:x?x.note:''},
    {k:'when',l:T('Kab','When'),t:'datetime-local',v:toISO(new Date(x?x.ts:Date.now()))}],o=>{
    if(!o.title&&scope!=='office'){toast(T('Naam likhein','Enter a name'));return false}
    const ts=o.when?+new Date(o.when):Date.now(),r={id:x?x.id:uid(),ts,scope,type:o.type,title:o.title||DVT[o.type]().slice(2),client:scope==='office'?'':(o.client||''),n:scope==='office'?Math.max(1,Math.round(+o.n||1)):1,note:o.note||''};
    if(x)DV[DV.findIndex(y=>y.id===x.id)]=r;else DV.push(r);saveDV();toast(T('Delivery save ✅','Delivery saved ✅'));rerender()})}
AX.dvadd=el=>dvForm(el.dataset.s||DVV.scope);
AX.dvedit=el=>{const x=DV.find(y=>y.id===el.dataset.id);if(x)dvForm(x.scope,x)};
AX.dvdel=el=>{const x=DV.find(y=>y.id===el.dataset.id);if(x)confirmDlg(T('Yeh delivery hata dein?','Delete this delivery?'),()=>{DV=DV.filter(y=>y.id!==x.id);saveDV();rerender()})};
AX.dvq=el=>{const t=el.dataset.t;DV.push({id:uid(),ts:Date.now(),scope:'office',type:t,title:DVT[t]().slice(2),client:'',n:1,note:''});saveDV();toast(T('+1 delivery ✅','+1 delivered ✅'));rerender()};
AX.dvgo=el=>{DVV.scope=el.dataset.v;go('kaam','deliv')};
AX.dvscope=el=>{DVV.scope=el.dataset.v;rerender()};
const dvRow=x=>`<div class="item"><div class="ic2">${DVT[x.type]().slice(0,2)}</div><div class="t"><b>${esc(x.title)}</b>${x.scope==='office'&&(x.n||1)>1?` <span class="chip">×${x.n}</span>`:''}<div class="muted sm">${x.client?'→ '+esc(x.client)+' • ':''}${new Date(x.ts).toLocaleString(LOC(),{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}${x.note?' • '+esc(x.note):''}</div></div><div class="row" style="gap:4px"><button class="btn s ghost" data-a="dvedit" data-id="${x.id}">✏️</button><button class="btn s ghost" data-a="dvdel" data-id="${x.id}">🗑</button></div></div>`;
/* small card on the Duty page: today's office count + one-tap +1 */
function dvOfficeCard(){const dk=dkey(),n=dvOfficeDay(dk),[a,b]=dvRange('w'),w=dvOfficeTotals(a,b),[c,d]=dvRange('m'),m=dvOfficeTotals(c,d);
  return`<div class="card"><div class="row sp"><h3 style="margin:0">📦 ${T('Aaj office ke project deliver','Office deliveries today')}</h3><span class="chip gold" style="font-size:15px">${n}</span></div>
   <div class="row wrap mt" style="gap:6px">${['video','image','graphic','other'].map(t=>`<button class="btn s ghost" data-a="dvq" data-t="${t}">+1 ${DVT[t]()}</button>`).join('')}</div>
   <div class="muted sm mt">${T('Is hafte','This week')}: <b>${w.total}</b> • ${T('Is mahine','This month')}: <b>${m.total}</b> • <a data-a="tab" data-v="kaam" data-s="deliv" style="text-decoration:underline;cursor:pointer">${T('Poori list','Full list')}</a></div></div>`}
function renderDeliv(el){const sc=DVV.scope,L=DV.filter(x=>x.scope===sc).sort((a,b)=>b.ts-a.ts);
  const sum=(per)=>{const[a,b]=dvRange(per),A=+a,B=+b+864e5-1;return L.filter(x=>x.ts>=A&&x.ts<=B).reduce((s,x)=>s+(x.n||1),0)};
  const tiles=`<div class="stats">${[['d',T('Aaj','Today')],['w',T('Is hafte','This week')],['m',T('Is mahine','This month')]].map(([p,l])=>`<div class="stat"><div class="sv">${sum(p)}</div><div class="sl">${l}</div></div>`).join('')}</div>`;
  let body='';
  if(sc==='office'){const days={};L.forEach(x=>{const k=dvDay(x);(days[k]=days[k]||[]).push(x)});
    body=Object.keys(days).sort().reverse().slice(0,60).map(k=>{const tot=days[k].reduce((s,x)=>s+(x.n||1),0);return`<div class="card"><div class="row sp"><b>${new Date(k+'T00:00').toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'short'})}</b><span class="chip gold">${tot} ${T('project','delivered')}</span></div>${days[k].map(dvRow).join('')}</div>`}).join('')}
  else{const by={};L.forEach(x=>{const k=x.client||T('(naam nahi)','(no name)');(by[k]=by[k]||[]).push(x)});
    const names=Object.keys(by).sort((a,b)=>by[b].length-by[a].length);
    body=(names.length?`<div class="card"><h3 style="margin:0 0 8px">👥 ${T('Client-wise','By client')}</h3>${names.map(k=>{const v=by[k],c={video:0,image:0,graphic:0,other:0};v.forEach(x=>c[x.type]++);return`<div class="item"><div class="ic2">👤</div><div class="t"><b>${esc(k)}</b> <span class="chip">${v.length}</span><div class="muted sm">${c.video?'🎥'+c.video+' ':''}${c.image?'🖼'+c.image+' ':''}${c.graphic?'🎨'+c.graphic+' ':''}${c.other?'📦'+c.other:''}</div></div></div>`}).join('')}</div>`:'')+
      `<div class="card"><h3 style="margin:0 0 6px">🗂 ${T('Sab deliveries','All deliveries')}</h3>${L.slice(0,80).map(dvRow).join('')||`<p class="muted c">${T('Abhi koi delivery darj nahi.','No deliveries logged yet.')}</p>`}</div>`}
  el.innerHTML=`<div class="fch">${Object.keys(DVS).map(k=>`<button data-a="dvscope" data-v="${k}" class="${sc===k?'on':''}">${DVS[k]()}</button>`).join('')}</div>
   <div class="card hero"><div class="row sp"><h2 style="margin:0">📦 ${DVS[sc]()} — ${T('Deliveries','Deliveries')}</h2><button class="btn s gold" data-a="dvadd" data-s="${sc}">＋ ${T('Nayi','New')}</button></div>
   <p class="muted sm" style="margin:6px 0 8px">${sc==='office'?T('Company (HachiFeel) ke project alag gine jaate hain — roz kitne deliver hue.','Company deliveries are counted separately — per day.'):sc==='fs'?T('Flow Studio ke project — kis client ko kya diya. Flow Studio hub mein bhi dikhta hai.','Flow Studio projects — what went to which client. Also shown in the Flow Studio hub.'):T('Apne personal project — kis ko video / image / design diya.','Personal projects — who got which video / image / design.')}</p>${tiles}</div>${body}`}
/* shown inside the Flow Studio hub */
function dvHubCard(){const L=DV.filter(x=>x.scope==='fs').sort((a,b)=>b.ts-a.ts);
  return`<div class="card"><div class="row sp"><h3 style="margin:0">📦 ${T('Deliver hue project','Delivered projects')} <span class="chip">${L.length}</span></h3><button class="btn s gold" data-a="dvadd" data-s="fs">＋</button></div>${L.slice(0,8).map(dvRow).join('')||`<p class="muted sm">${T('Abhi koi nahi — ＋ se darj karein.','None yet — add with ＋.')}</p>`}${L.length>8?`<div class="c mt"><button class="btn s ghost" data-a="dvgo" data-v="fs">${T('Sab dekhein','See all')}</button></div>`:''}</div>`}

'use strict';
/* ===== Monthly salary tracker (HachiFeel $600, arrives between the 2nd and 5th) ===== */
let SAL=store.get('sal',{amt:600,cur:'$',from:2,to:5,hist:{}});
const saveSAL=()=>store.set('sal',SAL);
const salMK=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1);
function salSt(now=new Date()){const mk=salMK(now),p=SAL.hist[mk],day=now.getDate(),dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  if(p)return{k:'paid',mk,p,txt:T('Mil gayi ✅','Received ✅'),c:'ok'};
  if(day<SAL.from){const n=SAL.from-day;return{k:'wait',mk,n,txt:T(`${n} din mein window shuru (${SAL.from} tareekh)`,`Window opens in ${n}d (${SAL.from}th)`),c:'muted'}}
  if(day<=SAL.to){const n=SAL.to-day;return{k:'window',mk,n,txt:n?T(`Aaj aa sakti hai — ${SAL.to} tak (${n} din)`,`Due now — by the ${SAL.to}th (${n}d left)`):T(`Aakhri din — aaj tak aani chahiye`,`Last day of the window`),c:'warn'}}
  return{k:'late',mk,n:day-SAL.to,txt:T(`${day-SAL.to} din late ⚠️ — company se poochein`,`${day-SAL.to}d late ⚠️ — follow up`),c:'bad'}}
const salAmt=()=>(SAL.cur==='$'?'$':SAL.cur)+num(SAL.amt);
function salCard(compact){const s=salSt(),co=(S.job&&S.job.co)||'HachiFeel',hist=Object.keys(SAL.hist).sort().reverse().slice(0,6);
  const btn=s.k==='paid'?`<button class="btn s ghost" data-a="salundo">↩ ${T('Galti se tick','Undo')}</button>`:`<button class="btn s gold" data-a="salpaid">✅ ${T('Payment mil gayi','Mark received')}</button>`;
  if(compact)return`<div class="item" data-a="tab" data-v="kaam" data-s="paisa" style="cursor:pointer"><div class="ic2">💵</div><div class="t"><b>${esc(co)} — ${T('Mahine ki payment','Monthly payment')} ${salAmt()}</b><div class="sm ${s.c==='muted'?'muted':s.c}">${s.txt}</div></div>${s.k!=='paid'&&s.k!=='wait'?`<button class="btn s gold" data-a="salpaid">✅</button>`:''}</div>`;
  return`<div class="card"><div class="row sp"><h2 style="margin:0">💵 ${esc(co)} ${T('payment','salary')}</h2><button class="btn s ghost" data-a="saledit">✏️</button></div>
   <div class="stats two mt"><div class="stat"><div class="sv">${salAmt()}</div><div class="sl">${T('Har mahine','Every month')} • ${SAL.from}–${SAL.to} ${T('tareekh','date')}</div></div><div class="stat"><div class="sv ${s.k==='late'?'bad':s.k==='paid'?'ok':''}" style="font-size:16px">${s.k==='paid'?'✅':s.k==='late'?'⚠️':s.k==='window'?'⏳':'🗓'}</div><div class="sl">${s.txt}</div></div></div>
   <div class="row sp mt"><span class="muted sm">≈ ₹${num(toINR(SAL.amt,SAL.cur))}</span>${btn}</div>
   ${hist.length?`<details class="mt"><summary class="muted sm">${T('Pichli payments','Past payments')} (${Object.keys(SAL.hist).length})</summary>${hist.map(k=>`<div class="item"><div class="ic2">✅</div><div class="t"><b>${SAL.cur==='$'?'$':SAL.cur}${num(SAL.hist[k].amt)}</b><div class="muted sm">${new Date(k+'-01').toLocaleDateString(LOC(),{month:'long',year:'numeric'})} • ${T('mili','got on')} ${esc(SAL.hist[k].on)}</div></div></div>`).join('')}</details>`:''}</div>`}
AX.salpaid=()=>{const mk=salMK();if(SAL.hist[mk])return;form(T('Payment mil gayi','Payment received'),[{k:'amt',l:T('Kitni mili','Amount received')+' ('+SAL.cur+')',t:'number',m:'decimal',v:SAL.amt},{k:'on',l:T('Kis tareekh ko','Date'),t:'date',v:dkey()}],o=>{
  const a=+o.amt;if(!(a>0)){toast(T('Raqam likhein','Enter amount'));return false}const fid=uid();FIN.unshift({id:fid,date:o.on||dkey(),type:'in',amt:a,cur:SAL.cur,biz:'personal',cat:'Salary',note:((S.job&&S.job.co)||'HachiFeel')+' salary',salId:mk});saveFin();
  SAL.hist[mk]={amt:a,on:o.on||dkey()};saveSAL();try{nativeSync()}catch(e){}sfx('success');toast(T('Payment record ho gayi ✅ — kamai mein jud gayi','Saved ✅ — added to income'));rerender()},{ok:T('Mil gayi ✅','Received ✅')})};
AX.salundo=()=>{const mk=salMK();delete SAL.hist[mk];FIN=FIN.filter(f=>f.salId!==mk);saveFin();saveSAL();try{nativeSync()}catch(e){}rerender()};
AX.saledit=()=>form(T('Payment ki settings','Payment settings'),[{k:'amt',l:T('Raqam','Amount'),t:'number',m:'decimal',v:SAL.amt},{k:'cur',l:T('Currency','Currency'),t:'select',v:SAL.cur,o:['$','₹']},{k:'from',l:T('Kis tareekh se (window)','Window from (day)'),t:'number',m:'numeric',v:SAL.from},{k:'to',l:T('Kis tareekh tak','Window to (day)'),t:'number',m:'numeric',v:SAL.to}],o=>{
  const f=Math.min(28,Math.max(1,+o.from||2)),t=Math.min(28,Math.max(f,+o.to||5));SAL.amt=+o.amt||600;SAL.cur=o.cur;SAL.from=f;SAL.to=t;saveSAL();try{nativeSync()}catch(e){}rerender()});
function salEvents(base){const out=[],s=salSt(base),d=base.getDate();if(s.k==='paid'||dkey(base)!==dkey())return out;const co=(S.job&&S.job.co)||'HachiFeel';
  if(d===SAL.from)out.push({k:'sal_s',at:atTime('10:00',base),voice:'sal_start',title:T('💵 Payment ka window shuru','💵 Payment window opens'),body:T(`${co} ki ${salAmt()} payment ${SAL.from}–${SAL.to} tareekh mein aati hai.`,`${co} pays ${salAmt()} between the ${SAL.from}th and ${SAL.to}th.`),tab:'kaam',sub:'paisa'});
  if(d>SAL.to&&d<=SAL.to+3||d===SAL.to)out.push({k:'sal_l'+d,at:atTime('18:00',base),voice:'sal_late',title:d===SAL.to?T('💵 Aaj aakhri din hai','💵 Last day of window'):T('⚠️ Payment abhi tak nahi aayi','⚠️ Payment not received'),body:T(`${co} ki ${salAmt()} payment check karein. Mil gayi ho to app mein tick karein.`,`Check ${co} payment of ${salAmt()}. Tick it in the app once received.`),tab:'kaam',sub:'paisa'});
  return out}

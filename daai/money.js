'use strict';
/* ===== Money: per-business Invest vs Revenue (day by day) + monthly invest plan, expense-by-category, personal kharche to-do, glass calculator ===== */
let INV=store.get('inv2',[]),INVP=store.get('invplan',{}),INVPCT=store.get('invpct',30);
const saveINV=()=>{store.set('inv2',INV);store.set('invplan',INVP);store.set('invpct',INVPCT)};
const mBizName=id=>id==='personal'?T('Zaati','Personal'):(bdef(id)||{name:id}).name;
const mInr=n=>'₹'+num(Math.round(n||0));
const monthK=(d=new Date())=>dkey(d).slice(0,7);
function bizMoney(id){const mk=monthK(),pm=monthK(new Date(new Date().getFullYear(),new Date().getMonth()-1,1));
  const inv=INV.filter(x=>x.biz===id).map(x=>({d:x.date,a:toINR(x.amt,x.cur)})),rev=revSources().filter(x=>x.biz===id).map(x=>({d:x.d,a:x.amt})),exp=expSources().filter(x=>x.biz===id).map(x=>({d:x.d,a:x.amt,c:x.cat}));
  const sum=(L,f)=>L.filter(f).reduce((a,x)=>a+x.a,0);const all=()=>true,inM=x=>x.d.startsWith(mk);
  const R={inv:sum(inv,all),rev:sum(rev,all),exp:sum(exp,all),invM:sum(inv,inM),revM:sum(rev,inM),expM:sum(exp,inM),revPM:sum(rev,x=>x.d.startsWith(pm))};
  R.net=R.rev-R.exp-R.inv;R.back=R.inv>0?Math.round(R.rev/R.inv*100):null;R.plan=+INVP[id]||0;R.sug=Math.round(R.revPM*INVPCT/100);return{R,inv,rev,exp}}
function moneyStats(R){const c=(l,v,cl)=>`<div class="stat"><div class="sv t ${cl||''}" style="font-size:15px">${v}</div><div class="sl">${l}</div></div>`;
  return`<div class="stats" style="grid-template-columns:repeat(2,1fr)">${c(T('Invest','Invested'),mInr(R.inv))}${c(T('Revenue','Revenue'),mInr(R.rev))}${c(T('Kharcha','Expense'),mInr(R.exp))}${c(T('Net (Rev−Khr−Inv)','Net (Rev−Exp−Inv)'),(R.net<0?'−':'')+mInr(Math.abs(R.net)),R.net>=0?'pos':'neg')}</div>`}
function catBreak(exp,inv,rows=6){const m={};exp.forEach(x=>{const k=x.c||T('Doosra','Other');m[k]=(m[k]||0)+x.a});inv.forEach(x=>{const k='📥 '+(x.c||T('Invest','Invest'));m[k]=(m[k]||0)+x.a});
  const L=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,rows),mx=L.length?L[0][1]:1;
  return L.length?L.map(([k,v])=>`<div class="mrow2"><div class="row sp"><span>${esc(k)}</span><b>${mInr(v)}</b></div><div style="height:5px;border-radius:4px;background:rgba(127,127,127,.18);margin-top:4px"><div style="height:5px;border-radius:4px;width:${Math.max(4,v/mx*100)}%;background:var(--cyan,#19c6f0)"></div></div></div>`).join(''):`<p class="muted sm">${T('Abhi koi kharcha/invest nahi likha.','No expense/invest entries yet.')}</p>`}
function dayTable(id,n=10){const B=bizMoney(id);const days=Array.from({length:n},(_,i)=>dkey(addDays(new Date(),-i)));
  const rows=days.map(d=>{const i=B.inv.filter(x=>x.d===d).reduce((a,x)=>a+x.a,0),r=B.rev.filter(x=>x.d===d).reduce((a,x)=>a+x.a,0),e=B.exp.filter(x=>x.d===d).reduce((a,x)=>a+x.a,0);return(i||r||e)?`<tr><td>${d.slice(5)}</td><td>${i?mInr(i):'–'}</td><td>${e?mInr(e):'–'}</td><td>${r?mInr(r):'–'}</td></tr>`:''}).join('');
  return rows?`<div style="overflow-x:auto"><table class="mt2" style="width:100%;font-size:13px;border-collapse:collapse"><tr style="text-align:left;opacity:.7"><th>${T('Din','Day')}</th><th>${T('Invest','Invest')}</th><th>${T('Kharcha','Exp.')}</th><th>${T('Revenue','Rev.')}</th></tr>${rows}</table></div>`:`<p class="muted sm">${T('Pichle 10 din mein kuch nahi.','Nothing in the last 10 days.')}</p>`}
function planBox(id,B){const R=B.R;const pr=R.plan>0?Math.min(100,Math.round(R.invM/R.plan*100)):0;
  return`<div class="card flat" style="margin-top:8px"><div class="row sp"><b>🎯 ${T('Is mahine kitna invest karna hai','Invest plan this month')}</b><button class="btn s ghost" data-a="invplan" data-id="${id}">✎</button></div>
   <div class="muted sm">${R.plan>0?`${T('Plan','Plan')}: ${mInr(R.plan)} • ${T('Ho chuka','Done')}: ${mInr(R.invM)} (${pr}%) • ${T('Baaki','Left')}: ${mInr(Math.max(0,R.plan-R.invM))}`:T('Abhi plan nahi bana — ✎ dabakar mahine ka invest target likhein.','No plan yet — tap ✎ to set a monthly invest target.')}</div>
   ${R.plan>0?`<div style="height:6px;border-radius:4px;background:rgba(127,127,127,.2);margin-top:6px"><div style="height:6px;border-radius:4px;width:${pr}%;background:var(--ok,#3fd49b)"></div></div>`:''}
   <div class="muted sm" style="margin-top:6px">💡 ${T(`Mota andaza: pichle mahine ka revenue ${mInr(R.revPM)} ka ${INVPCT}% dobara lagayein = ${mInr(R.sug)}.`,`Rule of thumb: reinvest ${INVPCT}% of last month's revenue ${mInr(R.revPM)} = ${mInr(R.sug)}.`)} <button class="lnk" data-a="invpct">${T('% badlein','change %')}</button></div></div>`}
function hubMoney(id){const B=bizMoney(id),R=B.R;
  return`<details class="card" open><summary><b>💰 ${T('Invest aur Revenue','Invest & Revenue')}</b></summary>${moneyStats(R)}
   ${R.back!=null?`<div class="muted sm c">${T('Invest ka','Of invested')} ${R.back}% ${T('revenue ke roop mein wapas aaya','came back as revenue')}</div>`:''}
   <div class="row wrap mt"><button class="btn s gold" data-a="invadd" data-id="${id}">＋ ${T('Invest likhein','Add investment')}</button><button class="btn s ghost" data-a="finadd" data-t="out">－ ${T('Kharcha','Expense')}</button></div>
   ${planBox(id,B)}
   <h3 class="h3" style="margin:12px 0 4px">${T('Din-ba-din (10 din)','Day by day (10 days)')}</h3>${dayTable(id)}
   <h3 class="h3" style="margin:12px 0 4px">${T('Kharcha / invest kis cheez mein','Where the money went')}</h3>${catBreak(B.exp,INV.filter(x=>x.biz===id).map(x=>({a:toInr2(x),c:x.cat||x.note})))}
   ${INV.filter(x=>x.biz===id).slice(0,6).map(x=>`<div class="item"><div class="ic2">📥</div><div class="t"><b>${(x.cur||'₹')}${num(x.amt)} ${x.cat?'• '+esc(x.cat):''}</b><div class="muted sm">${x.date}${x.note?' • '+esc(x.note):''}</div></div><button class="btn s ghost" data-a="invdel" data-id="${x.id}">✕</button></div>`).join('')}</details>`}
const toInr2=x=>toINR(x.amt,x.cur);
function moneyCard(){const rows=BIZ.map(b=>{const R=bizMoney(b.id).R;return{b,R}});const T0=rows.reduce((a,x)=>({inv:a.inv+x.R.inv,rev:a.rev+x.R.rev,exp:a.exp+x.R.exp}),{inv:0,rev:0,exp:0});
  return`<details class="card"><summary><b>💰 ${T('Sab karobar: Invest vs Revenue','All businesses: Invest vs Revenue')}</b></summary>
   <div class="muted sm" style="margin:4px 0">${T('Total','Total')}: ${T('Invest','Invest')} ${mInr(T0.inv)} • ${T('Revenue','Revenue')} ${mInr(T0.rev)} • ${T('Kharcha','Exp.')} ${mInr(T0.exp)}</div>
   <div style="overflow-x:auto"><table style="width:100%;font-size:13px;border-collapse:collapse"><tr style="text-align:left;opacity:.7"><th>${T('Karobar','Business')}</th><th>${T('Invest','Inv.')}</th><th>${T('Revenue','Rev.')}</th><th>${T('Kharcha','Exp.')}</th><th>Net</th></tr>
   ${rows.map(({b,R})=>`<tr data-a="hub" data-id="${b.id}" style="cursor:pointer"><td><b>${esc(b.name)}</b></td><td>${mInr(R.inv)}</td><td>${mInr(R.rev)}</td><td>${mInr(R.exp)}</td><td style="color:${R.net>=0?'var(--ok,#3fd49b)':'var(--bad,#ff6b6b)'}">${R.net<0?'−':''}${mInr(Math.abs(R.net))}</td></tr>`).join('')}</table></div>
   <div class="row wrap mt"><button class="btn s gold" data-a="invadd">＋ ${T('Invest likhein','Add investment')}</button></div>
   <p class="muted sm">${T('Net = Revenue − Kharcha − Invest. Kisi karobar par dabayein to uska din-ba-din hisaab khulega.','Net = Revenue − Expense − Invest. Tap a business for its day-by-day view.')}</p></details>`}
AX.invadd=el=>{const id=el&&el.dataset&&el.dataset.id;form(T('Invest likhein','Add investment'),[{k:'amt',l:T('Raqam','Amount'),t:'number',m:'decimal'},{k:'cur',l:T('Currency','Currency'),t:'select',v:'₹',o:['₹','$']},{k:'biz',l:T('Kis karobar mein','Which business'),t:'select',v:id||'qs',o:BIZ.map(b=>[b.id,b.name])},{k:'cat',l:T('Kis cheez mein (stock, ads, tools, staff…)','On what (stock, ads, tools, staff…)'),v:''},{k:'note',l:T('Note','Note')},{k:'date',l:T('Tareekh','Date'),t:'date',v:dkey()}],
  o=>{if(!(+o.amt>0)){toast(T('Raqam likhein','Enter amount'));return false}INV.unshift({id:uid(),date:o.date||dkey(),biz:o.biz,amt:+o.amt,cur:o.cur,cat:o.cat.trim(),note:o.note.trim()});saveINV();sfx('save');rerender()})};
AX.invdel=el=>{INV=INV.filter(x=>x.id!==el.dataset.id);saveINV();rerender()};
AX.invplan=el=>{const id=el.dataset.id;form(T('Mahine ka invest target','Monthly invest target'),[{k:'a',l:T('Is karobar mein har mahine kitna invest karna hai (₹)','Monthly invest target for this business (₹)'),t:'number',m:'numeric',v:INVP[id]||''}],o=>{INVP[id]=+o.a||0;saveINV();rerender()})};
AX.invpct=()=>form(T('Dobara lagane ka %','Reinvest %'),[{k:'p',l:T('Pichle mahine ke revenue ka kitna % dobara lagayein','% of last month\'s revenue to reinvest'),t:'number',m:'numeric',v:INVPCT}],o=>{INVPCT=Math.min(100,Math.max(0,+o.p||0));saveINV();rerender()});

/* ---------- expense by category (Paisa tab) ---------- */
function expCatCard(r){const ex=FIN.filter(x=>x.type==='out'&&inR(x.date,r)).map(x=>({a:toINR(x.amt,x.cur),c:x.cat,b:x.biz}));const tot=ex.reduce((a,x)=>a+x.a,0);
  const byB={};ex.forEach(x=>{(byB[x.b]=byB[x.b]||[]).push(x)});
  return`<div class="card"><div class="row sp"><h2 style="margin:0">${T('Kharcha kis cheez mein','Spending by category')}</h2><span class="chip">${mInr(tot)}</span></div>${catBreak(ex.map(x=>({a:x.a,c:x.c})),[],8)}
   ${Object.keys(byB).length>1?`<details style="margin-top:8px"><summary class="muted sm">${T('Karobar ke hisaab se','By business')}</summary>${Object.entries(byB).map(([b,L])=>`<div class="muted sm" style="margin-top:8px"><b>${esc(mBizName(b))}</b> — ${mInr(L.reduce((a,x)=>a+x.a,0))}</div>${catBreak(L.map(x=>({a:x.a,c:x.c})),[],4)}`).join('')}</details>`:''}</div>`}

/* ---------- personal kharche: to-do list ---------- */
let PEX=store.get('pex2',[]);const savePEX=()=>store.set('pex2',PEX);
const PEXC=['Ghar','Khana','Bills','Sawari','Sehat','Bachche','Personal','Sadqa/Zakat','Doosra'];
function pexSync(x){FIN=FIN.filter(f=>f.pexId!==x.id);if(x.done){FIN.unshift({id:uid(),pexId:x.id,date:x.doneOn||dkey(),type:'out',amt:+x.amt||0,cur:'₹',biz:'personal',cat:x.cat||'Doosra',note:x.t})}saveFin()}
function pexCard(){const pend=PEX.filter(x=>!x.done),done=PEX.filter(x=>x.done&&(x.doneOn||'').startsWith(monthK()));const sp=pend.reduce((a,x)=>a+(+x.amt||0),0),sd=done.reduce((a,x)=>a+(+x.amt||0),0);
  const row=x=>`<div class="item kk${x.done?' done':''}"><div class="ic2"><input type="checkbox" class="sw" data-a="pextog" data-id="${x.id}" ${x.done?'checked':''}></div><div class="t"><b style="${x.done?'text-decoration:line-through;opacity:.6':''}">${esc(x.t)}</b><div class="muted sm">₹${num(x.amt)} • ${esc(x.cat||'')}${x.due?' • 📅 '+x.due:''}</div></div><button class="btn s ghost" data-a="pexdel" data-id="${x.id}">✕</button></div>`;
  return`<div class="card"><div class="row sp"><h2 style="margin:0">🧾 ${T('Zaati kharche — to-do','Personal expenses — to-do')}</h2><button class="btn s" data-a="pexadd">＋</button></div>
   <div class="muted sm">${T('Jo kharcha karna hai likh lein; kar dene par tick karein — woh apne aap hisaab (Zaati) mein chala jata hai.','Write what you need to spend; tick when paid — it goes to your accounts (Personal) automatically.')}</div>
   <div class="row" style="gap:8px;margin:8px 0"><span class="chip warn">${T('Baaki','To pay')}: ₹${num(sp)}</span><span class="chip ok">${T('Is mahine diya','Paid this month')}: ₹${num(sd)}</span></div>
   ${pend.map(row).join('')||`<p class="muted c">${T('Koi baaki kharcha nahi 🎉','Nothing pending 🎉')}</p>`}
   ${done.length?`<details><summary class="muted sm">${T('Ho chuke (is mahine)','Paid (this month)')} (${done.length})</summary>${done.map(row).join('')}</details>`:''}</div>`}
AX.pexadd=()=>form(T('Zaati kharcha jodein','Add personal expense'),[{k:'t',l:T('Kis cheez ka kharcha','What for'),v:''},{k:'amt',l:T('Anumani raqam (₹)','Amount (₹)'),t:'number',m:'decimal'},{k:'cat',l:T('Category','Category'),t:'select',v:'Ghar',o:PEXC},{k:'due',l:T('Kab tak (optional)','Due date (optional)'),t:'date',v:''}],
  o=>{if(!o.t.trim()){toast(T('Naam likhein','Enter a name'));return false}PEX.unshift({id:uid(),t:o.t.trim(),amt:+o.amt||0,cat:o.cat,due:o.due||'',done:false});savePEX();try{nativeSync()}catch(e){}rerender()});
AX.pextog=el=>{const x=PEX.find(y=>y.id===el.dataset.id);if(!x)return;x.done=!!el.checked;x.doneOn=x.done?dkey():'';savePEX();pexSync(x);sfx(x.done?'success':'tick');rerender()};
AX.pexdel=el=>{const x=PEX.find(y=>y.id===el.dataset.id);PEX=PEX.filter(y=>y.id!==el.dataset.id);if(x){FIN=FIN.filter(f=>f.pexId!==x.id);saveFin()}savePEX();rerender()};
function pexEvents(base){const out=[],k=dkey(base);PEX.forEach(x=>{if(!x.done&&x.due===k)out.push({k:'pex_'+x.id,at:atTime('09:30',base),voice:'reminder',title:T('Zaati kharcha: ','Personal expense: ')+x.t,body:'₹'+num(x.amt)+' • '+(x.cat||''),tab:'kaam',sub:'paisa'})});return out}

/* ---------- glass calculator ---------- */
const CALC={e:'',r:'',hist:store.get('calc_h',[])};
function calcEval(s){const t=String(s).replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\s+/g,'');const tk=t.match(/\d*\.?\d+|[-+*/()%]/g)||[];if(tk.join('')!==t)throw 0;let i=0;
  const prim=()=>{const x=tk[i++];if(x==='('){const v=expr();if(tk[i++]!==')')throw 0;return{v}}if(x&&/[\d.]/.test(x))return{v:parseFloat(x)};throw 0};
  const post=()=>{let p=prim();while(tk[i]==='%'){i++;p={v:p.v/100,pct:true}}return p};
  const un=()=>{if(tk[i]==='-'){i++;const u=un();return{v:-u.v}}if(tk[i]==='+'){i++;return un()}return post()};
  const term=()=>{let a=un();while(tk[i]==='*'||tk[i]==='/'){const o=tk[i++],b=un();a={v:o==='*'?a.v*b.v:a.v/b.v}}return a};
  const expr=()=>{let a=term();while(tk[i]==='+'||tk[i]==='-'){const o=tk[i++],b=term(),bv=b.pct?a.v*b.v:b.v;a={v:o==='+'?a.v+bv:a.v-bv}}return a.v};
  const v=expr();if(i!==tk.length||!isFinite(v))throw 0;return v}
const calcFmt=v=>{const r=Math.round(v*1e8)/1e8;return String(r)};
function calcShow(){document.querySelectorAll('.cexp').forEach(n=>n.textContent=CALC.e||'0');document.querySelectorAll('.cres').forEach(n=>n.textContent=CALC.r)}
function calcLive(){try{CALC.r=CALC.e?'= '+calcFmt(calcEval(CALC.e.replace(/[×÷−+.]$/,''))):''}catch(x){CALC.r=''}}
function calcPress(k){const ops='+−×÷';
  if(k==='C'){CALC.e='';CALC.r=''}
  else if(k==='⌫'){CALC.e=CALC.e.slice(0,-1)}
  else if(k==='='){try{const v=calcFmt(calcEval(CALC.e));CALC.hist.unshift(CALC.e+' = '+v);CALC.hist=CALC.hist.slice(0,8);store.set('calc_h',CALC.hist);CALC.e=v;CALC.r=''}catch(x){CALC.r=T('Galat expression','Invalid')}}
  else if(k==='→₹'||k==='→$'){try{const v=calcEval(CALC.e),rate=S.rate||88;CALC.e=calcFmt(k==='→₹'?v*rate:v/rate);CALC.r=k==='→₹'?'$→₹ @'+rate:'₹→$ @'+rate}catch(x){CALC.r=T('Pehle raqam likhein','Enter a number first')}}
  else if(ops.includes(k)){if(!CALC.e&&k!=='−')return;if(ops.includes(CALC.e.slice(-1)))CALC.e=CALC.e.slice(0,-1);CALC.e+=k}
  else if(k==='.'){const last=CALC.e.split(/[+−×÷()]/).pop();if(last.includes('.'))return;CALC.e+=k}
  else CALC.e+=k;
  if(k!=='='&&k!=='→₹'&&k!=='→$')calcLive();calcShow()}
function calcHTML(modal){const keys=[['C','fn'],['⌫','fn'],['%','fn'],['÷','op'],['7',''],['8',''],['9',''],['×','op'],['4',''],['5',''],['6',''],['−','op'],['1',''],['2',''],['3',''],['+','op'],['0','z'],['.',''],['=','eq']];
  return`<div class="glass-calc${modal?' modal':''}"><div class="cdisp"><div class="cres">${esc(CALC.r)}</div><div class="cexp">${esc(CALC.e||'0')}</div></div>
   <div class="cutil"><button data-a="cb" data-k="→₹" class="cu">$ → ₹</button><button data-a="cb" data-k="→$" class="cu">₹ → $</button><button data-a="cb" data-k="(" class="cu">(</button><button data-a="cb" data-k=")" class="cu">)</button></div>
   <div class="ckeys">${keys.map(([k,c])=>`<button data-a="cb" data-k="${k}" class="ck ${c}">${k}</button>`).join('')}</div>
   ${CALC.hist.length?`<details class="chist"><summary>${T('History','History')}</summary>${CALC.hist.map(h=>`<div>${esc(h)}</div>`).join('')}</details>`:''}</div>`}
function calcCard(){return`<div class="card calcwrap"><div class="row sp"><h2 style="margin:0">🧮 ${T('Calculator','Calculator')}</h2><span class="muted sm">$↔₹ ${S.rate||88}</span></div>${calcHTML(false)}</div>`}
AX.cb=el=>calcPress(el.dataset.k);
AX.calcopen=()=>{if(document.getElementById('calcov'))return AX.calcclose();const o=document.createElement('div');o.id='calcov';o.innerHTML=`<div class="calcsheet"><div class="chead"><b>🧮 ${T('Calculator','Calculator')}</b><span class="muted sm">$↔₹ ${S.rate||88}</span><button class="cx" data-a="calcclose" aria-label="Close">✕</button></div>${calcHTML(true)}</div>`;o.addEventListener('click',e=>{if(e.target===o)AX.calcclose()});document.body.appendChild(o)};
AX.calcclose=()=>{const o=document.getElementById('calcov');if(o)o.remove()};
(function(){const mk=()=>{if(document.getElementById('calcfab'))return;const b=document.createElement('button');b.id='calcfab';b.setAttribute('data-a','calcopen');b.setAttribute('aria-label','Calculator');b.textContent='🧮';document.body.appendChild(b)};if(document.body)mk();else document.addEventListener('DOMContentLoaded',mk)})();

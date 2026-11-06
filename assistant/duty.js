'use strict';
/* ===== Duty tracker: login / break / off, monitoring, daily-weekly-monthly report, PDF ===== */
let DL=store.get('duty_log',{});
const saveDL=()=>store.set('duty_log',DL);
(function(){const J=S.job;if(!J.v5){J.login='09:30';J.leave='17:30';J.brk='13:30';J.brkEnd='14:30';J.breakMin=60;J.grace=10;J.v5=1;J.co=J.co||'HachiFeel';if(!J.days)J.days=[1,2,3,4,5,6];saveS()}if(!J.co)J.co='HachiFeel'})();
const dJ=()=>S.job;
const dTs=ts=>ts?(d=>t12(pad(d.getHours())+':'+pad(d.getMinutes())))(new Date(ts)):'—';
const dHM=ts=>{const d=new Date(ts);return pad(d.getHours())+':'+pad(d.getMinutes())};
const dParse=dk=>{const [y,m,d]=dk.split('-').map(Number);return new Date(y,m-1,d)};
const dOnDay=(dk,hhmm)=>{const m=hm(hhmm);const d=dParse(dk);d.setHours(m?m[0]:0,m?m[1]:0,0,0);return+d};
const dIsWork=d=>(dJ().days||[1,2,3,4,5,6]).includes(d.getDay());
const dMin=m=>{m=Math.round(Math.abs(m));return m>=60?Math.floor(m/60)+'h '+pad(m%60)+'m':m+'m'};
function dState(dk){const r=DL[dk||dkey()];if(!r||!r.in)return'off';if(r.out)return'done';const b=(r.brks||[]);return b.length&&!b[b.length-1][1]?'brk':'on'}
function dCalc(dk,r,now){now=now||Date.now();if(!r||!r.in)return null;const J=dJ(),st=dOnDay(dk,J.login),en=dOnDay(dk,J.leave),end=r.out||now;
  let brk=0;(r.brks||[]).forEach(b=>{brk+=Math.max(0,((b[1]||end)-b[0])/6e4)});
  const span=Math.max(0,(end-r.in)/6e4),over=Math.max(0,brk-(J.breakMin||60)),duty=Math.max(0,span-over),target=Math.max(1,(en-st)/6e4),
    late=Math.max(0,(r.in-st)/6e4),early=r.out?Math.max(0,(en-r.out)/6e4):0,ot=r.out?Math.max(0,(r.out-en)/6e4):0,g=J.grace||0;
  return{span,brk,over,duty,target,late,early,ot,short:r.out?Math.max(0,target-duty):0,fLate:late>g,fOver:over>g,fEarly:early>g,open:!r.out}}
function dRec(dk){return DL[dk]||(DL[dk]={in:0,out:0,brks:[]})}
function dAlertsClear(){for(let i=ALERTS.length-1;i>=0;i--)if(String(ALERTS[i].id).startsWith('dty_'))ALERTS.splice(i,1);saveAlerts()}
function dAfter(msg){saveDL();try{nativeSync()}catch(e){}try{schedTick()}catch(e){}if(msg)toast(msg);if(typeof refreshHome==='function'&&curTab==='home')refreshHome();else rerender()}
AX.dyin=()=>{const dk=dkey(),r=dRec(dk);if(r.in&&!r.out)return;if(r.out){r.out=0;return dAfter(T('Duty dobara ON ✅','Duty back ON ✅'))}r.in=Date.now();r.brks=[];const c=dCalc(dk,r);dAfter(c&&c.fLate?T(`Duty ON ✅ — ${dMin(c.late)} late`,`Duty ON ✅ — ${dMin(c.late)} late`):T('Duty ON ✅ — on time','Duty ON ✅ — on time'))};
AX.dybs=()=>{const dk=dkey(),r=dRec(dk);if(!r.in||r.out)return;if(dState(dk)==='brk')return;r.brks.push([Date.now(),0]);const bm=dJ().breakMin||60,ring=jobMode('brkEnd')==='a'?1:0,now=Date.now();dAlertsClear();
  ALERTS.push({id:'dty_be',title:T('☕ Break khatam — wapas aayein','☕ Break over — back to work'),at:toISO(new Date(now+bm*6e4)),ring});
  ALERTS.push({id:'dty_bl',title:T('⚠️ Break late ho gaya! Abhi wapas aayein','⚠️ Break overrun! Come back now'),at:toISO(new Date(now+(bm+(dJ().grace||10))*6e4)),ring:1});saveAlerts();dAfter(T(`☕ Break shuru — ${bm} min ka, alert laga diya`,`☕ Break started — ${bm} min, alert set`))};
AX.dybe=()=>{const dk=dkey(),r=dRec(dk);if(dState(dk)!=='brk')return;const b=r.brks[r.brks.length-1];b[1]=Date.now();dAlertsClear();const m=(b[1]-b[0])/6e4,over=m-(dJ().breakMin||60);dAfter(over>(dJ().grace||10)?T(`Break khatam — ${dMin(over)} zyada ⚠️`,`Break over — ${dMin(over)} over ⚠️`):T('Break khatam ▶️ — time par','Break over ▶️ — on time'))};
AX.dyout=()=>{const dk=dkey(),r=dRec(dk);if(!r.in||r.out)return;const b=r.brks[r.brks.length-1];if(b&&!b[1])b[1]=Date.now();r.out=Date.now();dAlertsClear();const c=dCalc(dk,r);dAfter(T(`Duty OFF 🏁 — aaj ${dMin(c.duty)} duty`,`Duty OFF 🏁 — ${dMin(c.duty)} today`))};
/* reminders if one forgets to switch ON / OFF */
function dutyEvents(base){const J=dJ(),out=[];if(!J.on||dkey(base)!==dkey()||!dIsWork(base))return out;const r=DL[dkey(base)];
  if(!(r&&r.in))out.push({k:'dty_in',at:new Date(+atTime(J.login,base)+((J.grace||10)+5)*6e4),title:T('💼 Duty ON karna bhool gaye?','💼 Forgot to start duty?'),body:T('Abhi tak login nahi hua. Duty ON dabayein — ya asli login ka waqt daal dein.','Not logged in yet. Tap Duty ON, or enter your real login time.'),voice:'dty_in',tab:'kaam',sub:'duty'});
  if(!(r&&r.out))out.push({k:'dty_out',at:new Date(+atTime(J.leave,base)+10*6e4),title:T('🏁 Duty OFF karna na bhulein','🏁 Don\'t forget Duty OFF'),body:T('Chhutti ka waqt guzar gaya. Duty OFF dabayein.','Leave time has passed. Tap Duty OFF.'),voice:'dty_out',tab:'kaam',sub:'duty'});
  return out}
/* ---------- periods & reports ---------- */
const DR={per:'d',off:0};
function dtRange(per,off){const t=new Date();t.setHours(0,0,0,0);let a,b,label;const f=d=>d.toLocaleDateString(LOC(),{day:'numeric',month:'short'});
  if(per==='d'){a=new Date(t);a.setDate(a.getDate()+off);b=new Date(a);label=a.toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
  else if(per==='w'){a=new Date(t);a.setDate(a.getDate()-((a.getDay()+6)%7)+off*7);b=new Date(a);b.setDate(b.getDate()+6);label=f(a)+' – '+f(b)+' '+b.getFullYear()}
  else{a=new Date(t.getFullYear(),t.getMonth()+off,1);b=new Date(a.getFullYear(),a.getMonth()+1,0);label=a.toLocaleDateString(LOC(),{month:'long',year:'numeric'})}
  return{a,b,label}}
function dReport(per,off){const R=dtRange(per,off),J=dJ(),today=dkey(),rows=[];
  for(let d=new Date(R.a);d<=R.b;d.setDate(d.getDate()+1)){const dk=dkey(d),rec=DL[dk],wd=dIsWork(d);rows.push({d:new Date(d),dk,wd,rec,c:dCalc(dk,rec),fut:dk>today})}
  const S2={days:rows.length,expected:0,present:0,absent:0,duty:0,brk:0,late:0,lateN:0,over:0,overN:0,early:0,earlyN:0,ot:0,short:0,target:0,inSum:0,outSum:0,outN:0};
  rows.forEach(r=>{if(r.wd&&!r.fut)S2.expected++;if(r.c){S2.present++;S2.duty+=r.c.duty;S2.brk+=r.c.brk;S2.target+=r.c.target;S2.ot+=r.c.ot;S2.short+=r.c.short;if(r.c.fLate){S2.late+=r.c.late;S2.lateN++}if(r.c.fOver){S2.over+=r.c.over;S2.overN++}if(r.c.fEarly){S2.early+=r.c.early;S2.earlyN++}
    const m=new Date(r.rec.in);S2.inSum+=m.getHours()*60+m.getMinutes();if(r.rec.out){const o=new Date(r.rec.out);S2.outSum+=o.getHours()*60+o.getMinutes();S2.outN++}}
    else if(r.wd&&r.dk<today)S2.absent++});
  S2.avgIn=S2.present?S2.inSum/S2.present:0;S2.avgOut=S2.outN?S2.outSum/S2.outN:0;S2.avg=S2.present?S2.duty/S2.present:0;return{R,rows,S:S2,per}}
const dClk=m=>m?t12(pad(Math.floor(m/60))+':'+pad(Math.round(m%60))):'—';
const dFlags=c=>!c?'':[c.fLate?T('Late '+dMin(c.late),'Late '+dMin(c.late)):'',c.fOver?T('Break +'+dMin(c.over),'Break +'+dMin(c.over)):'',c.fEarly?T('Jaldi gaye '+dMin(c.early),'Left early '+dMin(c.early)):'',c.ot>15?T('Extra '+dMin(c.ot),'OT '+dMin(c.ot)):''].filter(Boolean).join(' • ');
const dBrkTxt=r=>(r&&r.brks&&r.brks.length)?r.brks.map(b=>dTs(b[0])+'-'+(b[1]?dTs(b[1]):'…')).join(', '):'—';
function dReportText(rp){const S3=rp.S,J=dJ(),L=[];L.push(`${J.co||'Office'} — ${T('Duty report','Duty report')} (${rp.per==='d'?T('Daily','Daily'):rp.per==='w'?T('Weekly','Weekly'):T('Monthly','Monthly')})`);L.push(rp.R.label);L.push(`${T('Shift','Shift')}: ${t12(J.login)} – ${t12(J.leave)} • ${dMin((dOnDay(dkey(),J.leave)-dOnDay(dkey(),J.login))/6e4)} (${T('break shamil','break included')} ${dMin(J.breakMin||60)})`);L.push('');
  L.push(`${T('Hazir','Present')}: ${S3.present}/${S3.expected}  ${T('Ghair-hazir','Absent')}: ${S3.absent}`);L.push(`${T('Kul duty','Total duty')}: ${dMin(S3.duty)}  (${T('avg','avg')} ${dMin(S3.avg)}/${T('din','day')})`);L.push(`${T('Late login','Late logins')}: ${S3.lateN} (${dMin(S3.late)})  ${T('Break zyada','Break overruns')}: ${S3.overN} (${dMin(S3.over)})`);L.push(`${T('Jaldi chhutti','Early leaves')}: ${S3.earlyN} (${dMin(S3.early)})  ${T('Overtime','Overtime')}: ${dMin(S3.ot)}`);L.push('');
  rp.rows.filter(r=>r.rec&&r.rec.in||r.wd&&!r.fut).forEach(r=>{const c=r.c;L.push(`${r.d.toLocaleDateString(LOC(),{day:'2-digit',month:'short',weekday:'short'})}: ${c?`${dTs(r.rec.in)} → ${r.rec.out?dTs(r.rec.out):'…'} | break ${dBrkTxt(r.rec)} | duty ${dMin(c.duty)}${dFlags(c)?' | '+dFlags(c):''}`:r.wd?T('Ghair-hazir','Absent'):T('Off','Off')}`)});return L.join('\n')}
/* ---------- PDF ---------- */
function dutyPDF(per,off){const rp=dReport(per,off),J=dJ(),S3=rp.S,D=new PDFW.Doc(),G='#0e7c66',GR='#555555';
  const head=()=>{D.rect(0,0,595,86,'#0b1f2a');const logo=LOGO.get();let x=40;if(logo){D.image(logo,36,18,50,50);x=100}D.text(x,20,(J.co||'Office').toUpperCase(),20,{b:1,c:'#ffffff'});D.text(x,46,(per==='d'?'Daily':per==='w'?'Weekly':'Monthly')+' Duty Report',12,{c:'#7ad7c2'});D.text(555,26,PDFW.clean(typeof nm==='function'?nm():'Employee'),12,{b:1,c:'#ffffff',align:'r'});D.text(555,46,PDFW.clean(rp.R.label),10,{c:'#cfe3ea',align:'r'})};
  head();let y=104;
  D.text(40,y,`Shift ${PDFW.clean(t12(J.login))} - ${PDFW.clean(t12(J.leave))}  |  ${dMin((dOnDay(dkey(),J.leave)-dOnDay(dkey(),J.login))/6e4)} duty incl. ${dMin(J.breakMin||60)} break  |  Grace ${J.grace||0} min`,9,{c:GR});y+=22;
  const tiles=[['Present',S3.present+' / '+S3.expected],['Absent',S3.absent],['Total duty',dMin(S3.duty)],['Avg / day',dMin(S3.avg)],['Late logins',S3.lateN+' ('+dMin(S3.late)+')'],['Break overrun',S3.overN+' ('+dMin(S3.over)+')'],['Early leaves',S3.earlyN+' ('+dMin(S3.early)+')'],['Overtime',dMin(S3.ot)],['Avg login',dClk(S3.avgIn)],['Avg off',dClk(S3.avgOut)]];
  const tw2=(515-4*8)/5;tiles.forEach((t,i)=>{const cx=40+(i%5)*(tw2+8),cy=y+Math.floor(i/5)*50;D.rect(cx,cy,tw2,42,'#f1f6f5','#d3e2df');D.text(cx+8,cy+7,t[1],11,{b:1,c:'#0b1f2a'});D.text(cx+8,cy+26,t[0],8,{c:GR})});y+=112;
  if(typeof dvOfficeTotals==='function'){const o=dvOfficeTotals(rp.R.a,rp.R.b);D.text(40,y,`Deliveries (office): ${o.total}  -  Videos ${o.video}, Images ${o.image}, Graphics ${o.graphic}, Other ${o.other}`,10,{b:1,c:G});y+=20}
  const cols=[[40,'Date'],[112,'In'],[166,'Break'],[290,'Out'],[344,'Duty'],[392,'Deliv.'],[428,'Notes']];
  const th=()=>{D.rect(36,y-3,523,18,'#0b1f2a');cols.forEach(c=>D.text(c[0],y+1,c[1],8.5,{b:1,c:'#ffffff'}));y+=19};th();
  rp.rows.forEach(r=>{if(y>780){D.add();y=40;th()}const c=r.c;if(!c&&!(r.wd&&!r.fut)&&!(r.rec&&r.rec.in)){return}
    const alt=r.d.getDay()%2;if(alt)D.rect(36,y-3,523,16,'#f6f9f8');
    D.text(40,y,r.d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',weekday:'short'}),8.5);
    if(c){D.text(112,y,dTs(r.rec.in),8.5);D.text(166,y,dBrkTxt(r.rec),7.5);D.text(290,y,r.rec.out?dTs(r.rec.out):'-',8.5);D.text(344,y,dMin(c.duty),8.5,{b:1});
      if(typeof dvOfficeDay==='function')D.text(398,y,String(dvOfficeDay(r.dk)),8.5);D.text(428,y,dFlags(c),7.5,{c:(c.fLate||c.fOver||c.fEarly)?'#b3261e':G})}
    else D.text(112,y,r.wd?'Absent':'Off',8.5,{c:r.wd?'#b3261e':'#888888'});y+=16});
  y+=12;if(y>790){D.add();y=40}D.text(40,y,'Duty = login to off; break up to '+dMin(J.breakMin||60)+' counts as duty, extra break is deducted. Overtime counted after '+PDFW.clean(t12(J.leave))+'.',7.5,{c:GR});
  D.text(40,812,'Generated by Arsalan PA - '+new Date().toLocaleString('en-GB'),7.5,{c:'#888888'});
  PDFW.save(`Duty-Report-${per==='d'?'Daily':per==='w'?'Weekly':'Monthly'}-${dkey(rp.R.a)}.pdf`,D)}
/* ---------- UI ---------- */
function dutyToday(){const dk=dkey(),r=DL[dk],st=dState(dk),J=dJ(),c=dCalc(dk,r);
  const btn=(a,i,l,cls)=>`<button class="btn ${cls}" data-a="${a}" style="flex:1;min-width:140px;padding:14px 8px;font-size:15px">${i} ${l}</button>`;
  const btns=st==='off'?btn('dyin','🟢',T('Duty ON (Login)','Duty ON (Login)'),'gold'):st==='on'?btn('dybs','☕',T('Break shuru','Start break'),'')+btn('dyout','🔴',T('Duty OFF (Chhutti)','Duty OFF (Leave)'),'bad'):st==='brk'?btn('dybe','▶️',T('Break khatam','End break'),'gold')+btn('dyout','🔴',T('Duty OFF','Duty OFF'),'bad'):btn('dyin','↩',T('Dobara ON (galti se OFF)','Re-open (OFF by mistake)'),'ghost');
  const lab={off:['⚪',T('Duty OFF — abhi login nahi','Not on duty yet')],on:['🟢',T('Duty ON — kaam chal raha hai','On duty')],brk:['☕',T('Break par','On break')],done:['🏁',T('Aaj ki duty mukammal','Duty complete for today')]}[st];
  const tiles=r&&r.in?`<div class="stats" style="margin-top:10px"><div class="stat"><div class="sv" style="font-size:17px">${dTs(r.in)}</div><div class="sl">${T('Login','Login')}${c&&c.fLate?` • <span style="color:var(--bad)">${dMin(c.late)} late</span>`:''}</div></div><div class="stat"><div class="sv" style="font-size:17px">${c?dMin(c.brk):'—'}</div><div class="sl">${T('Break','Break')} / ${dMin(J.breakMin||60)}${c&&c.fOver?` • <span style="color:var(--bad)">+${dMin(c.over)}</span>`:''}</div></div><div class="stat"><div class="sv" style="font-size:17px">${r.out?dTs(r.out):'—'}</div><div class="sl">${T('Chhutti','Off')}${c&&c.fEarly?` • <span style="color:var(--bad)">${dMin(c.early)} ${T('pehle','early')}</span>`:''}</div></div></div>
    <div class="row sp mt"><span class="chip gold">⏱ ${T('Duty','Duty')} ${c?dMin(c.duty):'—'} / ${c?dMin(c.target):'—'}</span>${c&&c.open&&c.span>0?`<span class="chip">${T('Baqi','Left')} ${dMin(Math.max(0,c.target-c.duty))}</span>`:''}${c&&c.ot>0?`<span class="chip ok">➕ ${T('Overtime','OT')} ${dMin(c.ot)}</span>`:''}</div>`:'';
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">🏢 ${esc(J.co||'Office')} — ${T('Duty','Duty')}</h2><span class="chip">${lab[0]} ${lab[1]}</span></div>
   <p class="muted sm" style="margin:6px 0 10px">${T('Shift','Shift')} ${t12(J.login)} – ${t12(J.leave)} • ${T('8 ghante duty, 1 ghanta break is mein shamil','8h duty incl. 1h break')}</p>
   <div style="display:flex;gap:10px;flex-wrap:wrap">${btns}</div>${tiles}
   ${r&&r.in?`<div class="row wrap mt"><button class="btn s ghost" data-a="dyedit" data-dk="${dk}">✏️ ${T('Aaj ka waqt theek karein','Edit today\'s times')}</button></div>`:`<div class="row wrap mt"><button class="btn s ghost" data-a="dyedit" data-dk="${dk}">⏰ ${T('Login karna bhool gaye? Asli waqt daalein','Forgot to log in? Enter the real time')}</button></div>`}</div>`}
function dutySettings(){const J=dJ(),logo=LOGO.get(),days=J.days||[1,2,3,4,5,6];
  return`<div class="card"><div class="row sp"><h3 style="margin:0">⚙️ ${T('Duty ki settings','Duty settings')}</h3></div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><label class="muted sm">${T('Company / job ka naam','Company')}<input id="dsco" value="${esc(J.co||'')}" data-a="dset" data-chg="1" data-k="co"></label><label class="muted sm">${T('Break (minute)','Break (min)')}<input type="number" inputmode="numeric" value="${J.breakMin||60}" data-a="dset" data-chg="1" data-k="breakMin"></label>
    <label class="muted sm">${T('Duty shuru','Shift start')}<input type="time" value="${J.login}" data-a="dset" data-chg="1" data-k="login" style="direction:ltr"></label><label class="muted sm">${T('Duty khatam','Shift end')}<input type="time" value="${J.leave}" data-a="dset" data-chg="1" data-k="leave" style="direction:ltr"></label>
    <label class="muted sm">${T('Break ka waqt (reminder)','Break time (reminder)')}<input type="time" value="${J.brk}" data-a="dset" data-chg="1" data-k="brk" style="direction:ltr"></label><label class="muted sm">${T('Grace (minute)','Grace (min)')}<input type="number" inputmode="numeric" value="${J.grace===undefined?10:J.grace}" data-a="dset" data-chg="1" data-k="grace"></label></div>
   <div style="display:flex;flex-wrap:wrap;gap:6px;padding:10px 0">${JDN().map(([d,n])=>`<button class="btn s ${days.includes(d)?'':'ghost'}" data-a="jobday" data-d="${d}">${n}</button>`).join('')}</div>
   <div class="row sp" style="gap:10px">${logo?`<img src="${logo}" alt="" style="height:44px;border-radius:8px;background:#fff">`:`<span class="muted sm">${T('Company ka logo abhi nahi lagaya','No company logo yet')}</span>`}<span class="row" style="gap:6px"><button class="btn s gold" data-a="dlogo">🖼 ${logo?T('Logo badlein','Change logo'):T('Logo lagayein (PDF ke liye)','Add logo (for PDF)')}</button>${logo?`<button class="btn s ghost" data-a="dlogoX">✕</button>`:''}</span></div>
   <p class="muted sm" style="margin-top:6px">${T('Shift ka time kabhi bhi badal sakte hain — report naye time se hisaab karegi (purane din bhi). Grace ke andar late/zyada break nahi ginta.','You can change the shift any time. Late/extra-break is only flagged beyond the grace.')}</p></div>`}
function dutyReportCard(){const rp=dReport(DR.per,DR.off),S3=rp.S,max=Math.max(1,...rp.rows.map(r=>r.c?r.c.duty:0),rp.rows[0]?rp.rows[0].c?rp.rows[0].c.target:480:480);
  const bars=rp.per!=='d'?`<div style="display:flex;align-items:flex-end;gap:${rp.rows.length>14?2:5}px;height:92px;margin:10px 0 4px;direction:ltr">${rp.rows.map(r=>{const v=r.c?r.c.duty:0,h=Math.round(v/max*80),bad=r.c&&(r.c.fLate||r.c.fOver||r.c.fEarly);return`<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;min-width:0"><div title="${dMin(v)}" style="width:100%;height:${Math.max(r.wd&&!r.fut&&!r.c?3:h,3)}px;border-radius:5px;background:${!r.c?(r.wd&&!r.fut?'rgba(255,90,106,.45)':'rgba(255,255,255,.10)'):bad?'#e8a23a':'#2fc4a0'}"></div>${rp.rows.length<=14?`<span class="muted" style="font-size:9px">${r.d.getDate()}</span>`:''}</div>`}).join('')}</div><div class="muted sm">🟢 ${T('theek','ok')} 🟠 ${T('late/zyada break/jaldi','flagged')} 🔴 ${T('ghair-hazir','absent')}</div>`:'';
  const tl=(v,l,cls)=>`<div class="stat"><div class="sv ${cls||''}" style="font-size:17px">${v}</div><div class="sl">${l}</div></div>`;
  const rows=rp.rows.filter(r=>r.c||(r.wd&&!r.fut)).map(r=>`<div class="item"><div class="ic2" style="font-size:13px">${r.d.getDate()}<br><span class="muted" style="font-size:9px">${r.d.toLocaleDateString(LOC(),{weekday:'short'})}</span></div><div class="t">${r.c?`<b>${dTs(r.rec.in)} → ${r.rec.out?dTs(r.rec.out):'…'}</b> <span class="muted sm">• ${T('Duty','Duty')} ${dMin(r.c.duty)}</span><div class="muted sm">☕ ${dBrkTxt(r.rec)}${typeof dvOfficeDay==='function'&&dvOfficeDay(r.dk)?` • 📦 ${dvOfficeDay(r.dk)}`:''}</div>${dFlags(r.c)?`<div class="sm" style="color:var(--bad)">⚠ ${dFlags(r.c)}</div>`:''}`:`<b style="color:var(--bad)">${T('Ghair-hazir','Absent')}</b>`}</div>${r.c?`<button class="btn s ghost" data-a="dyedit" data-dk="${r.dk}">✏️</button>`:`<button class="btn s ghost" data-a="dyedit" data-dk="${r.dk}">＋</button>`}</div>`).join('');
  return`<div class="card"><div class="row sp"><h3 style="margin:0">📊 ${T('Report','Report')}</h3><div class="row" style="gap:6px"><button class="btn s ghost" data-a="dpdf">📄 PDF</button><button class="btn s ghost" data-a="dcopy">📋 ${T('Copy','Copy')}</button></div></div>
   <div class="fch" style="padding:8px 0">${[['d',T('Daily','Daily')],['w',T('Weekly','Weekly')],['m',T('Monthly','Monthly')]].map(([k,l])=>`<button data-a="dper" data-v="${k}" class="${DR.per===k?'on':''}">${l}</button>`).join('')}</div>
   <div class="row sp"><button class="btn s ghost" data-a="doff" data-d="-1">←</button><b style="text-align:center">${esc(rp.R.label)}</b><button class="btn s ghost" data-a="doff" data-d="1" ${DR.off>=0?'disabled':''}>→</button></div>
   <div class="stats" style="margin-top:10px">${tl(S3.present+'<span class="sm muted">/'+S3.expected+'</span>',T('Hazir din','Days present'))}${tl(dMin(S3.duty),T('Kul duty','Total duty'))}${tl(dMin(S3.avg),T('Avg / din','Avg / day'))}${tl(S3.lateN+'<span class="sm muted"> • '+dMin(S3.late)+'</span>',T('Late login','Late logins'),S3.lateN?'bad':'')}${tl(S3.overN+'<span class="sm muted"> • '+dMin(S3.over)+'</span>',T('Break zyada','Break overruns'),S3.overN?'bad':'')}${tl(dMin(S3.ot),T('Overtime','Overtime'))}${tl(S3.earlyN+'<span class="sm muted"> • '+dMin(S3.early)+'</span>',T('Jaldi chhutti','Early leaves'))}${tl(S3.absent,T('Ghair-hazir','Absent'),S3.absent?'bad':'')}${tl(dClk(S3.avgIn),T('Avg login','Avg login'))}</div>
   ${bars}<div style="margin-top:8px">${rows||`<p class="muted c">${T('Is muddat mein koi record nahi.','No records in this period.')}</p>`}</div></div>`}
function renderDuty(el){el.innerHTML=dutyToday()+(typeof dvOfficeCard==='function'?dvOfficeCard():'')+dutyReportCard()+(typeof officeCard==='function'?officeCard():'')+dutySettings()}
AX.dper=el=>{DR.per=el.dataset.v;DR.off=0;rerender()};
AX.doff=el=>{DR.off=Math.min(0,DR.off+(+el.dataset.d));rerender()};
AX.dpdf=()=>{try{dutyPDF(DR.per,DR.off)}catch(e){toast('PDF error: '+e.message)}};
AX.dcopy=async()=>{try{await navigator.clipboard.writeText(dReportText(dReport(DR.per,DR.off)));toast(T('Report copy ho gayi ✅','Report copied ✅'))}catch(e){toast(T('Copy nahi hui','Copy failed'))}};
AX.dset=el=>{const k=el.dataset.k,J=dJ();if(el.type==='time'){if(!hm(el.value))return;J[k]=el.value}else if(el.type==='number')J[k]=Math.max(0,+el.value||0);else J[k]=el.value.trim();if(k==='leave'||k==='login'){const a=hm(J.login),b=hm(J.leave);if(a&&b&&b[0]*60+b[1]<=a[0]*60+a[1])toast(T('⚠️ Khatam ka waqt shuru se baad hona chahiye','⚠️ End must be after start'))}saveS();try{nativeSync()}catch(e){}toast(T('Save ✅','Saved ✅'))};
AX.dlogo=()=>logoPick(()=>rerender());AX.dlogoX=()=>{LOGO.set('');rerender()};
AX.dyedit=el=>{const dk=el.dataset.dk,r=DL[dk]||{in:0,out:0,brks:[]},b=(r.brks||[])[0]||[0,0],J=dJ();
  form(T('Waqt theek karein','Edit times')+' — '+dk,[{k:'in',l:T('Login (kitne baje kiya tha)','Login time'),t:'time',v:r.in?dHM(r.in):J.login},{k:'bs',l:T('Break shuru','Break start'),t:'time',v:b[0]?dHM(b[0]):''},{k:'be',l:T('Break khatam','Break end'),t:'time',v:b[1]?dHM(b[1]):''},{k:'out',l:T('Duty OFF','Off'),t:'time',v:r.out?dHM(r.out):''},{k:'del',l:T('Poora din hatayein?','Delete this day?'),t:'select',v:'',o:[['',T('Nahi','No')],['1',T('Haan, hata do','Yes, delete')]]}],o=>{
    if(o.del){delete DL[dk];dAfter(T('Hata diya','Deleted'));return}
    if(!hm(o.in))return false;const nr={in:dOnDay(dk,o.in),out:hm(o.out)?dOnDay(dk,o.out):0,brks:[]};if(hm(o.bs))nr.brks.push([dOnDay(dk,o.bs),hm(o.be)?dOnDay(dk,o.be):0]);DL[dk]=nr;dAfter(T('Waqt save ✅','Times saved ✅'))})};
/* mini card for the home dashboard */
function dutyHomeBits(){const st=dState(),J=dJ();const r=DL[dkey()],c=dCalc(dkey(),r);
  const b=st==='off'?`<button class="btn s gold" data-a="dyin">🟢 ${T('Duty ON','Duty ON')}</button><button class="btn s ghost" data-a="dyedit" data-dk="${dkey()}">⏰ ${T('Bhool gaye','Forgot')}</button>`:st==='on'?`<button class="btn s" data-a="dybs">☕ ${T('Break','Break')}</button><button class="btn s bad" data-a="dyout">🔴 ${T('Duty OFF','Duty OFF')}</button>`:st==='brk'?`<button class="btn s gold" data-a="dybe">▶️ ${T('Break khatam','End break')}</button><button class="btn s bad" data-a="dyout">🔴 OFF</button>`:`<button class="btn s ghost" data-a="dyin">↩ ${T('Dobara ON','Re-open')}</button>`;
  const info=r&&r.in?`${T('Login','In')} ${dTs(r.in)}${c&&c.fLate?` <span style="color:var(--bad)">(${dMin(c.late)} late)</span>`:''}${r.out?` • ${T('Off','Off')} ${dTs(r.out)}`:''} • ${T('Duty','Duty')} ${c?dMin(c.duty):'—'}${c&&c.brk?` • ☕ ${dMin(c.brk)}${c.fOver?` <span style="color:var(--bad)">(+${dMin(c.over)})</span>`:''}`:''}`:T('Aaj abhi login nahi hua','Not logged in yet');
  return`<div class="row sp mt" style="gap:8px;flex-wrap:wrap"><div style="min-width:0;flex:1"><div class="sm"><b>${esc(J.co||'Duty')}</b> • ${info}</div></div><div class="row" style="gap:6px">${b}</div></div>`}

/* ---------- home highlight: everything about work in one card ---------- */
function homeWork(){const J=dJ(),dk=dkey();let h='';
  h=dutyHomeBits();
  const n=typeof dvOfficeDay==='function'?dvOfficeDay(dk):0;
  const dl=typeof dvOfficeDay==='function'?`<div class="item" data-a="tab" data-v="kaam" data-s="deliv" style="cursor:pointer"><div class="ic2">📦</div><div class="t"><b>${T('Aaj office ke project deliver','Office deliveries today')}: ${n}</b><div class="sm muted">${T('Tap karke +1 ya poori list','Tap for +1 or the full list')}</div></div><button class="btn s gold" data-a="dvq" data-t="video">+1 🎥</button></div>`:'';
  const sl=typeof salCard==='function'?salCard(true):'';
  const op=typeof TASKS!=='undefined'?TASKS.filter(t=>!t.done&&t.due&&t.due.slice(0,10)<=dk).length:0;
  const od=op?`<div class="item" data-a="tab" data-v="kaam" data-s="tasks" style="cursor:pointer"><div class="ic2">⚠️</div><div class="t"><b>${op} ${T('kaam aaj / pehle ki tareekh ke','tasks due today or overdue')}</b></div></div>`:'';
  return`<div class="card"><div class="row sp"><h2 style="margin:0">⭐ ${T('Zaroori — Office aur kaam','Key — Work & office')}</h2><span class="chip">${esc(J.co||'')}</span></div>${h}${dl}${sl}${od}</div>`}

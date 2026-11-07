'use strict';
/* ===== My Assistant — sirf aap ke baare mein. Jawab sirf is app ke andar ke aap ke apne data se aate hain.
   Koi dusra AI model, koi key, koi internet nahi. ===== */
let AI=Object.assign({chat:[]},store.get('ai',{}));AI.chat=Array.isArray(AI.chat)?AI.chat:[];
const saveAI=()=>store.set('ai',{chat:AI.chat.slice(-40)});
const NL=n=>Math.round(n).toLocaleString(LOC());
const RS=n=>'₹'+NL(n);
const pd=k=>new Date(k+'T00:00:00');
const dRange=(a,b)=>{const o=[];for(let d=pd(a);dkey(d)<=b;d.setDate(d.getDate()+1))o.push(dkey(d));return o};
const norm=s=>String(s||'').toLowerCase().replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[०-९]/g,d=>'०१२३४५६७८९'.indexOf(d)).replace(/ي/g,'ی').replace(/ك/g,'ک').trim();

/* ---------- period ---------- */
function detectP(q,def){const t=new Date(),y=t.getFullYear(),m=t.getMonth();
  if(/pichh?le?\s*mahin|last\s*month|guzishta\s*mahin|پچھلے\s*مہین|گزشتہ\s*مہین|पिछले\s*महीन|बीते\s*महीन/.test(q))return{a:dkey(new Date(y,m-1,1)),b:dkey(new Date(y,m,0)),id:'lm'};
  if(/\b(saal|sal|year|yearly|annual)\b|سال|साल/.test(q))return{a:y+'-01-01',b:dkey(t),id:'yr'};
  if(/mahin|month|مہین|महीन/.test(q))return{a:dkey(new Date(y,m,1)),b:dkey(t),id:'mo'};
  if(/hafte|hafta|haftay|week|ہفت|सप्ताह|हफ़्त|हफ्त/.test(q))return{a:dkey(addDays(t,-6)),b:dkey(t),id:'wk'};
  if(/yesterday|beete\s*kal|guzra\s*hua\s*kal|گزشتہ\s*روز|बीते\s*कल|\bkal\b|کل\b|\bकल\b/.test(q))return{a:dkey(addDays(t,-1)),b:dkey(addDays(t,-1)),id:'yd'};
  if(/\baaj\b|today|آج|आज/.test(q))return{a:dkey(t),b:dkey(t),id:'td'};
  return def==='td'?{a:dkey(t),b:dkey(t),id:'td'}:{a:dkey(new Date(y,m,1)),b:dkey(t),id:'mo'}}
function pLabel(p){const t=new Date(p.a+'T00:00:00');const mon=t.toLocaleDateString(LOC(),{month:'long',year:'numeric'});
  return({td:T('Aaj','Today','آج','आज'),yd:T('Kal (guzra hua)','Yesterday','کل (گزرا ہوا)','कल (बीता हुआ)'),wk:T('Pichhle 7 din','Last 7 days','پچھلے 7 دن','पिछले 7 दिन'),
    mo:T('Is mahine','This month','اس مہینے','इस महीने')+' ('+mon+')',lm:T('Pichhla mahina','Last month','پچھلا مہینہ','पिछला महीना')+' ('+mon+')',yr:T('Is saal','This year','اس سال','इस साल')+' ('+t.getFullYear()+')'})[p.id]}
const inP=(d,p)=>d>=p.a&&d<=p.b;
const nDays=p=>dRange(p.a,p.b).length;
const bname=id=>{const b=typeof bdef==='function'&&bdef(id);return b?b.name:(id==='personal'?T('Zaati','Personal','ذاتی','निजी'):id||'—')};
const pct=(a,b)=>b?Math.round(a*100/b):0;

/* ---------- sections ---------- */
function namazSec(p){const days=dRange(p.a,p.b),now=new Date(),today=dkey();let j=0,a=0,q=0,u=0,full=0;const per={};PRAY.forEach(x=>per[x]={j:0,a:0,q:0,u:0});const dl=[];
  days.forEach(d=>{const h=HZ[d]||{};let sc=0;PRAY.forEach(x=>{const v=h[x];
    if(d===today&&!v){const at=azanTime(x);if(at&&at>now)return}
    if(v==='j'){j++;per[x].j++;sc++}else if(v==='a'){a++;per[x].a++;sc++}else if(v==='q'){q++;per[x].q++}else{u++;per[x].u++}});
    if(sc===5)full++;dl.push([d,sc])});
  const tot=j+a+q+u;let L=[`🕌 ${T('Namaz ki samri','Prayer summary','نماز کی سمری','नमाज़ की समरी')} — ${pLabel(p)} (${days.length} ${T('din','days','دن','दिन')})`];
  if(!tot)return L[0]+'\n'+T('Is muddat ka koi hazri record nahi.','No attendance record for this period.','اس مدت کا کوئی حاضری ریکارڈ نہیں۔','इस अवधि का कोई हाज़िरी रिकॉर्ड नहीं।');
  L.push(`✅ ${T('Jamaat se','In jamaat','جماعت سے','जमात से')}: ${j}`,`🕋 ${T('Akele ada ki','Prayed alone','اکیلے ادا کی','अकेले अदा की')}: ${a}`,`⏳ ${T('Qaza','Missed','قضا','क़ज़ा')}: ${q}`,`❔ ${T('Likha nahi','Not marked','لکھا نہیں','लिखा नहीं')}: ${u}`,
    `📊 ${T('Kul ada','Total prayed','کل ادا','कुल अदा')}: ${j+a}/${tot} (${pct(j+a,tot)}%) • ${T('Jamaat','Jamaat','جماعت','जमात')}: ${pct(j,tot)}%`,
    `🌟 ${T('Poore 5/5 wale din','Perfect 5/5 days','مکمل 5/5 والے دن','पूरे 5/5 वाले दिन')}: ${full} • ${T('Silsila (streak)','Streak','سلسلہ','सिलसिला')}: ${hzStreak()} ${T('din','days','دن','दिन')}`,'',T('Namaz-wise:','By prayer:','نماز وار:','नमाज़ अनुसार:'));
  let worst=null,wv=-1;PRAY.forEach(x=>{const r=per[x];L.push(` • ${pname(x)} — ${r.j} ${T('jamaat','jamaat','جماعت','जमात')}, ${r.a} ${T('akele','alone','اکیلے','अकेले')}, ${r.q} ${T('qaza','missed','قضا','क़ज़ा')}, ${r.u} ${T('baaki','unmarked','باقی','बाक़ी')}`);if(r.q+r.u>wv){wv=r.q+r.u;worst=x}});
  if(wv>0)L.push('',`⚠️ ${T('Sab se zyada chhoot','Most missed','سب سے زیادہ چھوٹی','सबसे ज़्यादा छूटी')}: ${pname(worst)} (${wv})`);
  if(days.length<=7){L.push('',T('Din-ba-din:','Day by day:','دن بہ دن:','दिन-ब-दिन:'));dl.forEach(([d,s])=>L.push(` • ${pd(d).toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'})}: ${s}/5`))}
  return L.join('\n')}
function incSec(p){const R=revSources().filter(x=>inP(x.d,p));const tot=R.reduce((s,x)=>s+x.amt,0);const by={},man=R.filter(x=>x.src==='m').reduce((s,x)=>s+x.amt,0);R.forEach(x=>by[x.biz]=(by[x.biz]||0)+x.amt);
  let L=[`💰 ${T('Kamai (income)','Income','کمائی (آمدنی)','कमाई (आमदनी)')} — ${pLabel(p)}`,`${T('Kul','Total','کل','कुल')}: ${RS(tot)} (${R.length} ${T('entries','entries','اندراج','प्रविष्टि')})`];
  if(!R.length)return L[0]+'\n'+T('Is muddat mein koi kamai darj nahi.','No income recorded for this period.','اس مدت میں کوئی کمائی درج نہیں۔','इस अवधि में कोई कमाई दर्ज नहीं।');
  L.push(`${T('Haath se likhi','Entered by hand','ہاتھ سے لکھی','हाथ से लिखी')}: ${RS(man)} • ${T('Orders/inquiries se','From orders','آرڈرز سے','ऑर्डर से')}: ${RS(tot-man)}`,'',T('Karobar-wise:','By business:','کاروبار وار:','कारोबार अनुसार:'));
  Object.keys(by).sort((a,b)=>by[b]-by[a]).forEach(k=>L.push(` • ${bname(k)}: ${RS(by[k])} (${pct(by[k],tot)}%)`));
  const days=nDays(p);if(days>1)L.push('',`${T('Roz ka ausat','Daily average','روز کا اوسط','रोज़ का औसत')}: ${RS(tot/days)}`);
  const rec=FIN.filter(x=>x.type==='in'&&inP(x.date,p)).slice(0,5);if(rec.length){L.push('',T('Haal ki entries:','Recent entries:','حالیہ اندراجات:','हाल की प्रविष्टियाँ:'));rec.forEach(x=>L.push(` • ${x.date} — ${x.cur==='$'?'$':'₹'}${NL(x.amt)} ${bname(x.biz)}${x.note?' — '+x.note:''}`))}
  return L.join('\n')}
function expSec(p){const E=expSources().filter(x=>inP(x.d,p));const tot=E.reduce((s,x)=>s+x.amt,0);const byC={},byB={};E.forEach(x=>{const c=x.cat||T('Aam','General','عام','सामान्य');byC[c]=(byC[c]||0)+x.amt;byB[x.biz]=(byB[x.biz]||0)+x.amt});
  let L=[`💸 ${T('Kharcha (expenses)','Expenses','خرچ','खर्च')} — ${pLabel(p)}`];
  if(!E.length)return L[0]+'\n'+T('Is muddat mein koi kharcha darj nahi.','No expenses recorded for this period.','اس مدت میں کوئی خرچ درج نہیں۔','इस अवधि में कोई खर्च दर्ज नहीं।');
  L.push(`${T('Kul','Total','کل','कुल')}: ${RS(tot)} (${E.length} ${T('entries','entries','اندراج','प्रविष्टि')})`,'',T('Category-wise:','By category:','زمرہ وار:','श्रेणी अनुसार:'));
  Object.keys(byC).sort((a,b)=>byC[b]-byC[a]).forEach(k=>L.push(` • ${k}: ${RS(byC[k])} (${pct(byC[k],tot)}%)`));
  L.push('',T('Karobar-wise:','By business:','کاروبار وار:','कारोबार अनुसार:'));Object.keys(byB).sort((a,b)=>byB[b]-byB[a]).forEach(k=>L.push(` • ${bname(k)}: ${RS(byB[k])}`));
  const days=nDays(p);if(days>1)L.push('',`${T('Roz ka ausat','Daily average','روز کا اوسط','रोज़ का औसत')}: ${RS(tot/days)}`);
  const rec=FIN.filter(x=>x.type==='out'&&inP(x.date,p)).slice(0,5);if(rec.length){L.push('',T('Haal ki entries:','Recent entries:','حالیہ اندراجات:','हाल की प्रविष्टियाँ:'));rec.forEach(x=>L.push(` • ${x.date} — ₹${NL(toINR(x.amt,x.cur))} ${x.cat||''}${x.note?' — '+x.note:''}`))}
  return L.join('\n')}
function netSec(p){const I=revSources().filter(x=>inP(x.d,p)).reduce((s,x)=>s+x.amt,0),E=expSources().filter(x=>inP(x.d,p)).reduce((s,x)=>s+x.amt,0),n=I-E;
  return `📈 ${T('Nafa / bachat','Profit / savings','نفع / بچت','मुनाफ़ा / बचत')} — ${pLabel(p)}\n${T('Kamai','Income','کمائی','कमाई')}: ${RS(I)}\n${T('Kharcha','Expenses','خرچ','खर्च')}: ${RS(E)}\n${n>=0?'✅':'⚠️'} ${T('Bachat','Net','بچت','बचत')}: ${n<0?'-':''}${RS(Math.abs(n))}${I?` (${pct(n,I)}%)`:''}`}
function sadqaSec(p){let tot=0,days=0,cnt=0;const L=[];dRange(p.a,p.b).forEach(d=>{const l=sdList(d);if(l.length){days++;cnt+=l.length;const s=l.reduce((a,x)=>a+(+x.amt||0),0);tot+=s;L.push(` • ${d}: ${s?RS(s):T('nikala (raqam nahi likhi)','given (no amount)','نکالا (رقم نہیں لکھی)','निकाला (राशि नहीं लिखी)')}${l[0]&&l[0].note?' — '+l[0].note:''}`)}});
  const n=nDays(p);return `🤲 ${T('Sadqa','Sadaqah','صدقہ','सदक़ा')} — ${pLabel(p)}\n${T('Kul','Total','کل','कुल')}: ${RS(tot)} • ${days}/${n} ${T('din','days','دن','दिन')} • ${cnt} ${T('baar','times','بار','बार')}`+(L.length&&n<=31?'\n'+L.slice(-8).join('\n'):'')}
function tilSec(p){let tot=0,days=0;dRange(p.a,p.b).forEach(d=>{const v=TL.days[d]||0;if(v){tot+=v;days++}});const n=nDays(p);
  return `📖 ${T('Tilawat','Recitation','تلاوت','तिलावत')} — ${pLabel(p)}\n${T('Kul ayaat','Total ayahs','کل آیات','कुल आयात')}: ${NL(tot)} • ${days}/${n} ${T('din','days','دن','दिन')}${n>1&&days?` • ${T('Roz ka ausat','Daily average','روز کا اوسط','रोज़ का औसत')}: ${NL(tot/n)}`:''}\n${T('Aaj','Today','آج','आज')}: ${tlToday()}/${S.tilTarget}`}
function azkSec(p){let tot=0,days=0;dRange(p.a,p.b).forEach(d=>{const o=AZ[d];if(o){const s=Object.values(o).reduce((a,x)=>a+(+x||0),0);if(s){tot+=s;days++}}});
  return `📿 ${T('Azkar / tasbeeh','Azkar / tasbeeh','اذکار / تسبیح','अज़कार / तस्बीह')} — ${pLabel(p)}\n${T('Kul ginti','Total count','کل گنتی','कुल गिनती')}: ${NL(tot)} • ${days}/${nDays(p)} ${T('din','days','دن','दिन')}`}
function tasksSec(){const open=TASKS.filter(t=>!t.done),now=Date.now();const od=open.filter(t=>t.due&&new Date(t.due).getTime()<now);
  let L=[`✅ ${T('Kaam (tasks)','Tasks','کام','काम')}: ${open.length} ${T('baaki','pending','باقی','बाक़ी')}${od.length?` • ⚠️ ${od.length} ${T('late','overdue','تاخیر','देर')}`:''}`];
  open.slice(0,10).forEach(t=>L.push(` • ${t.title}${t.due?' — '+fmtDT(t.due):''}`));if(open.length>10)L.push(' …');if(!open.length)L.push(T('Koi pending kaam nahi 👍','No pending tasks 👍','کوئی باقی کام نہیں 👍','कोई बाक़ी काम नहीं 👍'));
  const al=ALERTS.filter(a=>a.at&&new Date(a.at).getTime()>now).sort((a,b)=>a.at.localeCompare(b.at)).slice(0,5);if(al.length){L.push('',T('Aane wale reminders:','Upcoming reminders:','آنے والی یاد دہانیاں:','आने वाले रिमाइंडर:'));al.forEach(a=>L.push(` • ${fmtDT(a.at)} — ${a.title}`))}
  return L.join('\n')}
function pendSec(){const pend=pendingOf();const by={};pend.forEach(x=>by[x.hub]=(by[x.hub]||0)+1);
  return `🔔 ${T('Pending notifications / orders','Pending notifications / orders','باقی نوٹیفکیشن / آرڈرز','बाक़ी नोटिफ़िकेशन / ऑर्डर')}: ${pend.length}`+(pend.length?'\n'+Object.keys(by).map(k=>` • ${bname(k)}: ${by[k]}`).join('\n'):'')+`\n${T('Sawal (hazri/sadqa) jawab ke intezar mein','Questions waiting for your answer','جواب کے منتظر سوالات','जवाब के इंतज़ार में सवाल')}: ${PQ.length}`}
function callsSec(){const due=CALLS.filter(c=>c.follow&&!c.done);let L=[`📞 ${T('Call notes','Call notes','کال نوٹس','कॉल नोट्स')}: ${CALLS.length} • ${T('Follow-up baaki','Follow-ups due','فالو اپ باقی','फ़ॉलो-अप बाक़ी')}: ${due.length}`];
  due.slice(0,6).forEach(c=>L.push(` • ${c.who||'?'} — ${c.follow}`));CALLS.slice(0,4).forEach(c=>L.push(` ◦ ${c.who||'?'}${c.dir?' ('+c.dir+')':''}`));return L.join('\n')}
function timeSec(p){const from=pd(p.a).getTime(),to=pd(p.b).getTime()+864e5;const by={};let tot=0;TT.log.filter(x=>x.start>=from&&x.start<to).forEach(x=>{const m=((x.end||Date.now())-x.start)/6e4;by[x.cat+' · '+x.act]=(by[x.cat+' · '+x.act]||0)+m;tot+=m});
  const f=m=>Math.floor(m/60)+T(' ghanta ',' h ',' گھنٹہ ',' घंटा ')+Math.round(m%60)+T(' min',' min',' منٹ',' मिनट');
  return `⏱️ ${T('Waqt ka hisaab','Time tracked','وقت کا حساب','समय का हिसाब')} — ${pLabel(p)}\n${T('Kul','Total','کل','कुल')}: ${f(tot)}`+Object.keys(by).sort((a,b)=>by[b]-by[a]).slice(0,8).map(k=>`\n • ${k}: ${f(by[k])}`).join('')}
function fullSummary(p){const month=detectP('mahin','mo');return[namazSec(p),'',incSec(p),'',expSec(p),'',netSec(p),'',sadqaSec(p),'',tilSec(p),'',tasksSec(),'',pendSec(),'',callsSec()].join('\n')}

/* ---------- understanding ---------- */
const QWRE=/kitn|how much|how many|total|kya |kaise|batao|bata |dikhao|show|summary|samri|\?|کتن|بتاؤ|بتا |دکھاؤ|سمری|कितन|बताओ|बता |दिखाओ|समरी/;
const BIZRE=[['aa',/aswad|dubai|اسود|अस्वद|दुबई/],['sk',/scent|سینٹ|सेंट/],['bn',/bareerah|natural|بریرہ|बरीरा/],['fs',/flow|studio|فلو|फ्लो/],['qs',/quranic|\bqs\b|قرآنک|क़ुरानिक|कुरानिक/]];
const bizIn=(q,d)=>{for(const [id,re] of BIZRE)if(re.test(q))return id;return d};
const firstNum=q=>{const m=q.match(/(\d[\d,]*(?:\.\d+)?)/);return m?+m[1].replace(/,/g,''):null};
function stripWords(t,re){return t.replace(re,' ').replace(/\s+/g,' ').trim()}
function parseT(q){const m=/(\d{1,2})(?::(\d{2}))?\s*(baje|bje|am|pm|بجے|बजे)?/.exec(q);if(!m)return null;let h=+m[1],mi=+(m[2]||0);if(h>23)return null;
  if(/shaam|sham|raat|\bpm\b|شام|رات|शाम|रात|dopahar|dopehar|دوپہر|दोपहर/.test(q)&&h<12)h+=12;const d=new Date();d.setHours(h,mi,0,0);
  if(/\bkal\b|tomorrow|کل|\bकल\b/.test(q)||d<=new Date())d.setDate(d.getDate()+1);return d}
const OPENS=[[/namaz|نماز|नमाज़|नमाज|prayer/,['deen','namaz']],[/quran|قرآن|क़ुरआन|कुरआन|कुरान/,['deen','quran']],[/azkar|tasbeeh|اذکار|تسبیح|अज़कार|तस्बीह/,['deen','azkar']],[/hadees|hadith|حدیث|हदीस/,['deen','kutub']],[/paisa|kamai|kharcha|income|پیسہ|कमाई|खर्च/,['kaam','paisa']],[/task|kaam|کام|काम/,['kaam','tasks']],[/waqt|time|وقت|समय/,['kaam','waqt']],[/call|کال|कॉल/,['kaam','calls']],[/business|karobar|کاروبار|कारोबार/,['biz']]];
function noorParse(raw){const q=norm(raw);const isQ=QWRE.test(q);const n=firstNum(q);
  /* ---- actions (need a confirm tap) ---- */
  const wantOpen=/\b(kholo|khol|open|dikhao)\b|کھولو|کھول|खोलो|खोल/.test(q);
  if(wantOpen){for(const [re,[tab,sub]] of OPENS)if(re.test(q))return{act:{type:'open',tab,sub},text:T('Theek hai, page kholta hoon.','Okay, opening it.','ٹھیک ہے، پیج کھولتا ہوں۔','ठीक है, पेज खोलता हूँ।')}}
  if(/yaad\s*dila|remind|reminder|یاد\s*دلا|याद\s*दिला/.test(q)){const at=parseT(q);if(at){const title=stripWords(raw,/yaad\s*dila\w*|remind\w*|یاد\s*دلا\w*|याद\s*दिला\w*|\d{1,2}(:\d{2})?\s*(baje|bje|am|pm|بجے|बजे)?|kal|tomorrow|کل|कल|mujhe|مجھے|मुझे|please/gi)||T('Yaad-dahani','Reminder','یاد دہانی','याद-दिहानी');
    return{act:{type:'add_reminder',title,at:toISO(at)},text:T('Reminder tayyar hai — neeche button dabayein.','Reminder ready — tap the button below.','یاد دہانی تیار ہے — نیچے بٹن دبائیں۔','रिमाइंडर तैयार है — नीचे बटन दबाएँ।')}}}
  if(/(task|kaam|todo|کام|ٹاسک|काम|टास्क)\s*(jodo|jodna|add|likho|dalo|banao|جوڑ\w*|شامل|لکھ\w*|जोड़\w*|लिख\w*|डाल\w*)|(jodo|add|likho|dalo|جوڑو|लिखो|जोड़ो)\s*(task|kaam|کام|काम)/.test(q)){
    const title=stripWords(raw,/task|kaam|todo|jodo|jodna|add|likho|dalo|banao|ٹاسک|کام|جوڑو|شامل|لکھو|टास्क|काम|जोड़ो|लिखो|डालो/gi);
    if(title)return{act:{type:'add_task',title},text:T('Kaam tayyar hai — neeche button dabayein.','Task ready — tap the button below.','کام تیار ہے — نیچے بٹن دبائیں۔','काम तैयार है — नीचे बटन दबाएँ।')}}
  if(n!=null&&!isQ){
    if(/kharcha|kharch|expense|spent|spend|خرچ|खर्च|ख़र्च/.test(q))return{act:{type:'log_expense',amt:n,biz:bizIn(q,'personal'),note:stripWords(raw,/kharcha|kharch|expense|spent|spend|₹|rs\.?|rupee\w*|\d[\d,.]*|خرچ\w*|खर्च\w*|ख़र्च\w*/gi)},text:T(`Kharcha ₹${NL(n)} likhne ke liye tayyar — neeche button dabayein.`,`Expense ₹${NL(n)} ready — tap the button below.`,`خرچ ₹${NL(n)} لکھنے کے لیے تیار — نیچے بٹن دبائیں۔`,`खर्च ₹${NL(n)} लिखने के लिए तैयार — नीचे बटन दबाएँ।`)};
    if(/kamai|income|aamdani|amdani|received|mila|aaya|کمائی|آمدنی|कमाई|आमदनी/.test(q))return{act:{type:'log_income',amt:n,biz:bizIn(q,'qs'),note:stripWords(raw,/kamai|income|received|mila|aaya|₹|rs\.?|rupee\w*|\d[\d,.]*|کمائی|آمدنی|कमाई|आमदनी/gi)},text:T(`Kamai ₹${NL(n)} likhne ke liye tayyar — neeche button dabayein.`,`Income ₹${NL(n)} ready — tap the button below.`,`کمائی ₹${NL(n)} لکھنے کے لیے تیار — نیچے بٹن دبائیں۔`,`कमाई ₹${NL(n)} लिखने के लिए तैयार — नीचे बटन दबाएँ।`)};
    if(/sadqa|sadaqa|sadka|صدقہ|सदक़ा|सदका/.test(q))return{act:{type:'log_sadqa',amt:n},text:T(`Sadqa ₹${NL(n)} likhne ke liye tayyar — neeche button dabayein.`,`Sadaqah ₹${NL(n)} ready — tap the button below.`,`صدقہ ₹${NL(n)} لکھنے کے لیے تیار — نیچے بٹن دبائیں۔`,`सदक़ा ₹${NL(n)} लिखने के लिए तैयार — नीचे बटन दबाएँ।`)}}
  /* ---- questions about your own data ---- */
  const NAM=/namaz|namaaz|nmaz|salah|salat|prayer|hazri|jamaat|jamat|fajr|zuhr|dhuhr|\basr\b|maghrib|isha|نماز|حاضری|جماعت|नमाज़|नमाज|हाज़िरी|जमात/.test(q);
  const INC=/kamai|kamaai|income|aamdani|amdani|revenue|earning|\bearn|کمائی|آمدنی|कमाई|आमदनी/.test(q);
  const EXP=/kharcha|kharch|expense|spend|spent|spending|خرچ|खर्च|ख़र्च/.test(q);
  const PRO=/nafa|munafa|profit|bachat|saving|\bnet\b|balance|نفع|منافع|بچت|मुनाफ़ा|मुनाफा|बचत|नफ़ा|नफा/.test(q);
  const SAD=/sadqa|sadaqa|sadaqah|sadka|صدقہ|صدقے|सदक़ा|सदका|सदक़े/.test(q);
  const TIL=/tilawat|tilaawat|recit|quran\s*padh|تلاوت|तिलावत/.test(q);
  const AZK=/azkar|zikr|tasbeeh|tasbih|durood|istighfar|اذکار|ذکر|تسبیح|अज़कार|अज्कार|ज़िक्र|तस्बीह/.test(q);
  const TSK=/kaam|task|todo|to-do|کام|ٹاسک|काम|टास्क/.test(q);
  const PND=/notification|order|inquir|enquir|نوٹیفکیشن|آرڈر|ऑर्डर|नोटिफ/.test(q)||(/pending|پینڈنگ|پنڈنگ|पेंडिंग/.test(q)&&!TSK);
  const CAL=/\bcall|کال|कॉल/.test(q);
  const TIM=/time\s*track|kitna\s*(time|waqt)|hours|ghante|گھنٹ|घंट|waqt ka hisaab|وقت کا حساب|समय का हिसाब/.test(q);
  const SUM=/hisaab|hisab|khulasa|summary|samri|overview|plan|report|sab kuch|حساب|خلاصہ|سمری|हिसाब|ख़ुलासा|सारांश|समरी/.test(q);
  const any=NAM||INC||EXP||PRO||SAD||TIL||AZK||TSK||PND||CAL||TIM;
  if(!any&&!SUM)return{text:helpText()};
  const out=[];const dp=(def)=>detectP(q,def);
  if(SUM&&!any){return{text:fullSummary(dp('td'))}}
  if(NAM)out.push(namazSec(dp('mo')));if(INC)out.push(incSec(dp('mo')));if(EXP)out.push(expSec(dp('mo')));if(PRO)out.push(netSec(dp('mo')));
  if(SAD)out.push(sadqaSec(dp('mo')));if(TIL)out.push(tilSec(dp('td')));if(AZK)out.push(azkSec(dp('td')));if(TIM)out.push(timeSec(dp('td')));
  if(TSK)out.push(tasksSec());if(PND)out.push(pendSec());if(CAL)out.push(callsSec());
  return{text:out.join('\n\n━━━━━━━━\n\n')}}
function helpText(){return T('Main app ki har cheez se jawab deti hoon. Poochhiye:\n• "Aaj Fajr ka waqt kya hai?" • "Agli namaz kab hai?"\n• "Quran mein sabr wali ayat" • "Bukhari mein niyyat"\n• "Zakat kholo", "Quran kholo" (wahan le chalungi)\n• "Meri namaz ki samri is mahine"\n• "Is mahine ki kamai / kharcha / nafa"\n• "Sadqa, tilawat, azkar kitne hue?"\n• "Pending kaam / notifications / calls"\n• "Aaj ka poora hisaab"\nLikhne ke liye: "kharcha 500 chai", "kamai 2000 dukaan", "sadqa 100", "task jodo bank jana", "kal 5 baje Ahmed ko call yaad dilao".',
 'I only answer about your own data. Try:\n• "My prayer summary this month"\n• "This month income / expenses / profit"\n• "How much sadaqah, recitation, azkar?"\n• "Pending tasks / notifications / calls"\n• "Full summary for today"\nTo log: "expense 500 tea", "income 2000 shop", "sadaqah 100", "add task go to bank", "remind me tomorrow 5 pm to call Ahmed".',
 'میں صرف آپ کے اپنے ڈیٹا کے بارے میں جواب دیتا ہوں۔ پوچھیے:\n• "میری نماز کی سمری اس مہینے"\n• "اس مہینے کی کمائی / خرچ / نفع"\n• "صدقہ، تلاوت، اذکار کتنے ہوئے؟"\n• "پینڈنگ کام / نوٹیفکیشن / کالز"\n• "آج کا پورا حساب"\nلکھوانے کے لیے: "خرچ 500 چائے"، "کمائی 2000 دکان"، "صدقہ 100"۔',
 'मैं सिर्फ़ आपके अपने डेटा के बारे में जवाब देता हूँ। पूछिए:\n• "मेरी नमाज़ की समरी इस महीने"\n• "इस महीने की कमाई / खर्च / मुनाफ़ा"\n• "सदक़ा, तिलावत, अज़कार कितने हुए?"\n• "पेंडिंग काम / नोटिफ़िकेशन / कॉल"\n• "आज का पूरा हिसाब"\nलिखवाने के लिए: "खर्च 500 चाय", "कमाई 2000 दुकान", "सदक़ा 100"।')}

/* ---------- actions (after confirm) ---------- */
function actLabel(a){switch(a.type){case'add_task':return T('Kaam jodein: ','Add task: ','کام جوڑیں: ','काम जोड़ें: ')+a.title;case'add_reminder':return T('Reminder: ','Reminder: ','یاد دہانی: ','रिमाइंडर: ')+a.title+' — '+fmtDT(a.at);case'log_sadqa':return T('Sadqa likhein ₹','Log sadaqah ₹','صدقہ لکھیں ₹','सदक़ा लिखें ₹')+(a.amt||0);case'log_income':return T('Kamai likhein ₹','Log income ₹','کمائی لکھیں ₹','कमाई लिखें ₹')+a.amt+' · '+bname(a.biz);case'log_expense':return T('Kharcha likhein ₹','Log expense ₹','خرچ لکھیں ₹','खर्च लिखें ₹')+a.amt+(a.note?' · '+a.note:'');case'open':return T('Kholein','Open','کھولیں','खोलें')+': '+a.tab+(a.sub?'/'+a.sub:'')}return''}
function doAct(a){try{switch(a.type){
  case'add_task':TASKS.unshift({id:uid(),title:a.title,pri:2,due:a.due||'',done:false});saveTasks();break;
  case'add_reminder':addAlert(a.title,a.at);break;
  case'log_sadqa':sdAdd(a.amt||0,a.note||'My Assistant');break;
  case'log_income':finAdd({type:'in',amt:a.amt,biz:a.biz||'qs',note:a.note||'',cat:'My Assistant'});break;
  case'log_expense':finAdd({type:'out',amt:a.amt,biz:a.biz||'personal',note:a.note||'',cat:a.note?'':'My Assistant',});break;
  case'open':if(a.tab==='biz'){go('home')}else go(a.tab||'home',a.sub);break}
  sfx('success');toast(T('Ho gaya ✅','Done ✅','ہو گیا ✅','हो गया ✅'))}catch(e){toast('Error: '+e.message)}}

/* ---------- screen ---------- */
const NCHIPS=()=>[T('Agli namaz kab hai?','When is the next prayer?'),T('Aaj kitni namaz padhi?','How many prayers today?','آج کتنی نماز پڑھی؟','आज कितनी नमाज़ पढ़ी?'),T('Aaj ka hisaab','Today\'s review','آج کا حساب','आज का हिसाब'),T('Quran mein sabr wali ayat','Quran ayahs on patience'),...(typeof isDeo==='function'&&!isDeo()?[T('Hadees mein sabr','Hadith on patience','حدیث میں صبر','हदीस में सब्र')]:[T('Hayat-us-Sahaba mein Hazrat Umar ka waqia','Hayat-us-Sahaba: Umar')]),T('Meri namaz ki samri (is mahine)','My prayer summary (this month)','میری نماز کی سمری (اس مہینے)','मेरी नमाज़ की समरी (इस महीने)'),
  T('Is mahine ki kamai','This month income','اس مہینے کی کمائی','इस महीने की कमाई'),T('Is mahine ka kharcha','This month expenses','اس مہینے کا خرچ','इस महीने का खर्च'),
  T('Nafa / bachat (is mahine)','Profit / savings (this month)','نفع / بچت (اس مہینے)','मुनाफ़ा / बचत (इस महीने)'),T('Aaj ka poora hisaab','Full summary for today','آج کا پورا حساب','आज का पूरा हिसाब'),
  T('Pending kaam','Pending tasks','پینڈنگ کام','पेंडिंग काम'),T('Sadqa aur tilawat (is mahine)','Sadaqah and recitation (this month)','صدقہ اور تلاوت (اس مہینے)','सदक़ा और तिलावत (इस महीने)')];
function renderAI(el){
  const msgs=AI.chat.map((m,i)=>m.r==='u'?`<div class="bub me">${esc(m.t)}</div>`:`<div class="bub ai"><div style="white-space:pre-wrap">${esc(m.t)}</div>${m.act?`<button class="btn s gold mt" data-a="aiact" data-i="${i}">▶ ${esc(actLabel(m.act))}</button>`:''}${m.n2&&typeof n2Btn==='function'?n2Btn(m.n2):''}</div>`).join('');
  el.innerHTML=`<div class="card hero"><div class="row sp"><div class="row"><div class="bic" style="--c:#e0b24a;width:44px;height:44px;font-size:22px;border-radius:14px">✨</div><div><b style="font-size:19px;font-family:var(--f-head)">My Assistant</b><div class="muted sm">${T('Aapki AI saathi — namaz, Quran, kitabein, hisaab','Your assistant — prayer, Quran, books, money','صرف آپ کے اپنے حساب کتاب کی ساتھی','सिर्फ़ आपके अपने हिसाब-किताब की साथी')}</div></div></div></div></div>
  ${typeof hfCard==='function'?hfCard():''}<div class="aichat">${msgs||`<div class="card c muted" style="white-space:pre-wrap">${esc(helpText())}</div>`}</div>
  <div class="row wrap mb">${NCHIPS().map(q=>`<button class="chip" data-a="aiq" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
  <div class="card"><textarea id="aiIn" rows="2" placeholder="${T('Apne hisaab ke baare mein poochhein…','Ask about your own data…','اپنے حساب کے بارے میں پوچھیں…','अपने हिसाब के बारे में पूछें…')}"></textarea><div class="row wrap"><button class="btn grow" data-a="aisend" id="aiSend">${T('Bhejein','Send','بھیجیں','भेजें')}</button><button class="btn ghost" data-a="dictate" data-t="aiIn">🎙</button><button class="btn ghost" data-a="aiclear">🗑</button></div>
  <p class="muted sm" style="margin-top:8px">${T('Yeh sirf is phone ke andar ke aap ke data se jawab deta hai — koi dusra AI ya internet nahi.','Answers come only from the data on this phone — no other AI, no internet.','یہ صرف اس فون کے اندر آپ کے ڈیٹا سے جواب دیتا ہے — کوئی دوسرا AI یا انٹرنیٹ نہیں۔','यह सिर्फ़ इस फ़ोन के अंदर आपके डेटा से जवाब देता है — कोई दूसरा AI या इंटरनेट नहीं।')}</p></div>`;
  const box=$('.aichat');if(box)box.scrollTop=box.scrollHeight;window.scrollTo(0,document.body.scrollHeight)}
function aiSend(text){text=(text||'').trim();if(!text)return;AI.chat.push({r:'u',t:text});let r;try{r=noorParse(text)}catch(e){r={text:'Error: '+e.message}}
  AI.chat.push({r:'a',t:r.text,act:r.act||null});saveAI();rerender()}

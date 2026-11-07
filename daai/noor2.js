'use strict';
/* ===== My Assistant 2: sawal samajhna (Roman / Hindi / Urdu likhawat), app ke har hisse se jawab, aur "le chalo" ===== */
const N2DV={'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ऋ':'ri','क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'n','च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'n','ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n','त':'t','थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'f','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v','श':'sh','ष':'sh','स':'s','ह':'h','क़':'q','ख़':'kh','ग़':'gh','ज़':'z','फ़':'f','ड़':'d','ढ़':'rh','़':'','ा':'a','ि':'i','ी':'i','ु':'u','ू':'u','े':'e','ै':'ai','ो':'o','ौ':'au','ृ':'ri','ं':'n','ँ':'n','ः':'h','्':'','।':' ','ॉ':'o','ॅ':'e'};
const N2UR={'ا':'a','آ':'aa','ب':'b','پ':'p','ت':'t','ٹ':'t','ث':'s','ج':'j','چ':'ch','ح':'h','خ':'kh','د':'d','ڈ':'d','ذ':'z','ر':'r','ڑ':'r','ز':'z','ژ':'zh','س':'s','ش':'sh','ص':'s','ض':'z','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ک':'k','ك':'k','گ':'g','ل':'l','م':'m','ن':'n','ں':'n','و':'o','ہ':'h','ھ':'h','ة':'h','ء':'','ی':'i','ي':'i','ے':'e','ئ':'i','ؤ':'o','۔':' ','؟':' ','،':' '};
function n2Rom(s){s=String(s||'');let o='';const ch=[...s];for(let i=0;i<ch.length;i++){const c=ch[i];
  if(N2DV[c]!==undefined){let v=N2DV[c];const nx=ch[i+1];const isCons=/[क-ह]|क़|ख़|ग़|ज़|फ़|ड़|ढ़/.test(c);if(isCons&&nx&&nx!=='्'&&!/[ा-ौ़ंँः]/.test(nx)&&/[क-ह]/.test(nx))v+='a';o+=v;continue}
  if(N2UR[c]!==undefined){o+=N2UR[c];continue}if(/[ً-ٰٟ]/.test(c))continue;o+=c}
  return o.toLowerCase()}
/* spelling ko ek jaisa banana */
const N2CAN=[[/\b(fjr|fjar|fajar|fazar|fazr|fajir|fajr|fazir|fajer|subah ki namaz|sobah)\b/g,' fajr '],[/\b(zhr|zhar|zuhar|zohar|zohr|zuhr|johar|zuhur|dhuhr|zohor|duhar|zuhar|jahar|johr|dopahar ki namaz)\b/g,' zuhr '],[/\b(asar|asr|asir|aser|asur)\b/g,' asr '],
  [/\b(mghrb|mghrib|magrib|maghrib|magreb|maghreb|magarib|magrab|mugrib)\b/g,' maghrib '],[/\b(ashaa|asha|ishaa|isha|esha|isya|eesha|ishaa|isa)\b/g,' isha '],[/\b(juma|jumma|jummah|jumah|jumuah|friday)\b/g,' juma '],
  [/\b(namaj|namaaz|nmaz|namaz|salah|salat|prayer|nimaz)\b/g,' namaz '],[/\b(ajan|azan|azaan|ajaan|adhan|azzan)\b/g,' azan '],[/\b(jamat|jamaat|jamaa?t|jamaht|jammat|jamath)\b/g,' jamaat '],
  [/\b(oqt|wqt|vqt|vakt|waqt|wakt|vaqt|samay|time|timing|timings|baje|bje)\b/g,' waqt '],[/\b(dftr|dafatr|ofis|aafis|office|offis|daftar|dafter|ofice|ofc)\b/g,' office '],[/\b(ghnte|ghnta|ghante|ghanta|ghante|hours|hour|ghanto|ghanton)\b/g,' ghante '],
  [/\b(dyuti|duty|deuty|duti|dyuty)\b/g,' duty '],[/\b(aaj|aj|today|aja)\b/g,' aaj '],[/\b(kal|yesterday|kl)\b/g,' kal '],[/\b(kitne|kitna|kitni|kitany|how much|how many)\b/g,' kitna '],
  [/\b(kya|kia|what)\b/g,' kya '],[/\b(kab|when)\b/g,' kab '],[/\b(agli|agla|next|aane wali|aanewali)\b/g,' agli '],[/\b(tarikh|tareekh|tarik|date)\b/g,' tareekh '],
  [/\b(quran|kuran|kuraan|qur'an|koran|quraan)\b/g,' quran '],[/\b(hadees|hadis|hadith|hades|hadeeth)\b/g,' hadees '],[/\b(kitab|kitaab|book|books|kitabon|kitabein)\b/g,' kitab '],
  [/\b(kholo|kholiye|khol|open|dikhao|dikha|le chalo|lechalo|le chal|chalo|jao|ले चलो)\b/g,' kholo '],[/\b(overtime|over time|ot|extra time|zyada kaam)\b/g,' overtime '],
  [/\b(login|log in|lagin|logan)\b/g,' login '],[/\b(logout|log out|chhutti|chutti)\b/g,' logout '],[/\b(salary|tankhwah|tankha|pagar|payment)\b/g,' salary '],[/\b(delivery|deliver|delivered|dilivery)\b/g,' delivery ']];
function n2Canon(raw){let q=' '+n2Rom(raw).replace(/[?.,!،۔؟"'“”]/g,' ')+' ';for(const[re,v]of N2CAN)q=q.replace(re,v);return q.replace(/\s+/g,' ').trim()}
const N2P={fajr:'Fajr',zuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha',juma:'Dhuhr'};
const n2t=d=>d?t12(hhmmOf(d)):'—';
const n2dur=m=>{m=Math.round(m||0);const h=Math.floor(m/60),mi=m%60;return h?T(`${h} ghante ${mi} minute`,`${h} h ${mi} min`):T(`${mi} minute`,`${mi} min`)};
/* ---------- answers ---------- */
function n2Prayer(q){if(!/\b(namaz|fajr|zuhr|asr|maghrib|isha|juma|azan|jamaat)\b/.test(q))return null;
  if(/\b(padh|padhi|ada|hazri|qaza|samri|summary|hisab)\b/.test(q))return null; /* namaz ki hazri wale sawal purane system ke paas */
  if(!TM)return{text:T('Namaz ke auqaat abhi load nahi hue — internet ya location check karein.','Prayer times are not loaded yet.')};
  const tom=/\bkal\b/.test(q)&&!/\baaj\b/.test(q);const d=new Date();if(tom)d.setDate(d.getDate()+1);
  let k=null;for(const w in N2P)if(new RegExp('\\b'+w+'\\b').test(q)){k=N2P[w];break}
  const line=p=>{const az=azanTime(p,d),jm=jamTime(p,d),st=tdate(TM.t[p],tom?1:0);return T(`${pname(p,d)}: waqt ${n2t(st)}, azaan ${n2t(az)}, jamaat ${n2t(jm)}`,`${pname(p,d)}: starts ${n2t(st)}, azan ${n2t(az)}, jamaat ${n2t(jm)}`)};
  if(/\bagli\b/.test(q)||(!k&&!/\b(sab|saari|sare|tamam|all|auqat|auqaat)\b/.test(q)&&!/\bkal\b/.test(q))){const np=nextPrayer();if(np){const p=np.k,jm=jamTime(p,np.at);const mins=Math.max(0,Math.round((np.at-Date.now())/6e4));
      const t=T(`agli namaz ${pname(p,np.at)} hai — azaan ${n2t(np.at)} par (${n2dur(mins)} baad), jamaat ${n2t(jm)}.`,`next prayer is ${pname(p,np.at)} — azan at ${n2t(np.at)} (in ${n2dur(mins)}), jamaat ${n2t(jm)}.`);return{text:t,say:t,act:{type:'open',tab:'deen',sub:'namaz'}}}}
  if(k){const t=`${tom?T('kal','tomorrow'):T('aaj','today')} — `+line(k)+'.';return{text:t,say:t,act:{type:'open',tab:'deen',sub:'namaz'}}}
  const t=`${tom?T('Kal','Tomorrow'):T('Aaj','Today')} ${T('ki namaz','prayers')}:\n`+PRAY.map(line).join('\n');return{text:t,say:t.replace(/\n/g,'. '),act:{type:'open',tab:'deen',sub:'namaz'}}}
function n2Duty(q){if(!/\b(office|duty|login|logout|overtime|break)\b/.test(q)&&!(/\bghante\b/.test(q)&&/\b(kaam|kam|work)\b/.test(q)))return null;if(typeof dCalc!=='function')return null;
  if(/\b(hafte|hafta|week|weekly|mahine|mahina|month|monthly)\b/.test(q)){const per=/\b(hafte|hafta|week|weekly)\b/.test(q)?'w':'m';const rp=dReport(per,0),S3=rp.S;
    const t=T(`${per==='w'?'Is hafte':'Is mahine'}: ${S3.present} din hazir (${S3.expected} mein se), kul duty ${n2dur(S3.duty)}, overtime ${n2dur(S3.ot)}, late login ${S3.lateN} baar.`,`${per==='w'?'This week':'This month'}: present ${S3.present}/${S3.expected} days, total duty ${n2dur(S3.duty)}, overtime ${n2dur(S3.ot)}, late ${S3.lateN} times.`);
    return{text:t,say:t,act:{type:'open',tab:'kaam',sub:'duty'}}}
  const day=/\bkal\b/.test(q)?addDays(new Date(),-1):new Date();const dk=dkey(day),r=DL[dk],c=dCalc(dk,r),J=jobDay(dk);const lbl=/\bkal\b/.test(q)?T('Kal','Yesterday'):T('Aaj','Today');
  if(!r||!r.in){const t=J.work?T(`${lbl} abhi tak duty ON nahi hui. Shift ${t12(J.login)} se ${t12(J.leave)} tak hai.`,`${lbl} duty not started yet. Shift ${t12(J.login)}–${t12(J.leave)}.`):T(`${lbl} office ki chhutti hai.`,`${lbl} is an off day.`);return{text:t,say:t,act:{type:'open',tab:'kaam',sub:'duty'}}}
  let t=T(`${lbl.toLowerCase()} aapne ${dTs(r.in)} par login kiya`,`${lbl.toLowerCase()} you logged in at ${dTs(r.in)}`)+(r.out?T(` aur ${dTs(r.out)} par logout.`,` and logged out at ${dTs(r.out)}.`):'.')+' '+
    T(`Kul duty ${n2dur(c.duty)}${r.out?'':' (ab tak)'}, break ${n2dur(c.brk)}.`,`Duty ${n2dur(c.duty)}${r.out?'':' so far'}, break ${n2dur(c.brk)}.`)+(c.ot>0?T(` Overtime ${n2dur(c.ot)}.`,` Overtime ${n2dur(c.ot)}.`):'')+(c.fLate?T(` Login ${n2dur(c.late)} late tha.`,` Login was ${n2dur(c.late)} late.`):'')+
    (!r.out&&c.open?T(` Shift khatam hone mein ${n2dur(Math.max(0,c.target-c.duty))} baqi.`,` ${n2dur(Math.max(0,c.target-c.duty))} left in the shift.`):'');
  return{text:t,say:t,act:{type:'open',tab:'kaam',sub:'duty'}}}
function n2Date(q){if(/\b(tareekh|din|day)\b/.test(q)&&/\b(aaj|kya|kaun|konsa|kon sa)\b/.test(q)||/\b(islami|hijri|chand)\b/.test(q)){const d=new Date();const t=T(`Aaj ${d.toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})} hai`,`Today is ${d.toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})}`)+(TM&&TM.hijri?T(`, Islami tareekh ${hijriTxt()}.`,`, Hijri ${hijriTxt()}.`):'.');return{text:t,say:t}}
  if(/\b(kitne baje|kya baja|time kya|waqt kya hua|abhi waqt)\b/.test(q)||/^(waqt|kitna waqt)( kya)?( hua| hai)?$/.test(q)){const t=T(`Abhi ${t12(hhmmOf(new Date()))} baje hain.`,`It's ${t12(hhmmOf(new Date()))}.`);return{text:t,say:t}}return null}
function n2Deliv(q){if(!/\bdelivery\b/.test(q)||typeof DV==='undefined')return null;const from=new Date().setHours(0,0,0,0);const L=DV.filter(x=>x.ts>=from);const n=L.reduce((a,x)=>a+(x.n||1),0);
  const by={};L.forEach(x=>by[x.type]=(by[x.type]||0)+(x.n||1));const t=T(`Aaj ${n} delivery hui`,`Today ${n} deliveries`)+(n?': '+Object.entries(by).map(([k,v])=>`${v} ${DVT[k]?DVT[k]().slice(2):k}`).join(', '):'')+'.';return{text:t,say:t,act:{type:'open',tab:'kaam',sub:'deliv'}}}
function n2Salary(q){if(!/\bsalary\b/.test(q)||typeof salSt!=='function')return null;const s=salSt();const t=T('Salary: ','Salary: ')+s.txt;return{text:t,say:t,act:{type:'open',tab:'kaam',sub:'paisa'}}}
/* app ke kisi bhi hisse tak le chalna */
const N2NAV=[[/\b(quran|tilawat|surah|para)\b/,'deen','quran',()=>T('Quran','Quran')],[/\b(namaz)\b/,'deen','namaz',()=>T('Namaz','Prayer')],[/\b(azkar|tasbeeh|tasbih|zikr)\b/,'deen','azkar',()=>T('Azkar','Azkar')],[/\b(hadees|kitab|bukhari|muslim|fazail|muntakhab|hayat)\b/,'deen','kutub',()=>T('Kitabein','Books')],[/\b(dua|duayen|duain)\b/,'deen','duas',()=>T('Duayen','Duas')],[/\b(khabar|news|ijtema|bayan)\b/,'deen','khabar',()=>T('Khabar','News')],
  [/\b(office)\b/,'office','',()=>T('Office','Office')],[/\b(duty|attendance|hazri)\b/,'kaam','duty',()=>T('Duty','Duty')],[/\b(delivery)\b/,'kaam','deliv',()=>T('Delivery','Delivery')],[/\b(paisa|kharcha|kamai|hisab|salary)\b/,'kaam','paisa',()=>T('Paisa','Money')],[/\b(call|calls)\b/,'kaam','calls',()=>T('Calls','Calls')],[/\b(wallet|document|password|aadhar|pan)\b/,'kaam','wallet',()=>T('Wallet','Wallet')],[/\b(task|kaam|todo)\b/,'kaam','tasks',()=>T('Kaam','Tasks')],
  [/\b(business|karobar|order|flow studio|scentkart|aswad|bareerah)\b/,'biz','',()=>T('Karobar','Business')],[/\b(setting|settings)\b/,'more','set',()=>T('Settings','Settings')],[/\b(home|ghar|dashboard)\b/,'home','',()=>T('Home','Home')]];
function n2Nav(q){if(!/\bkholo\b/.test(q))return null;for(const[re,t,s,lb]of N2NAV)if(re.test(q)){if(t==='office'&&typeof TABS!=='undefined'&&!TABS.some(x=>x[0]==='office'))continue;const tx=T(`${lb()} khol raha hoon.`,`Opening ${lb()}.`);return{text:tx,say:tx,act:{type:'open',tab:t,sub:s||undefined},go:1}}return null}
/* Quran / hadees / Fazail mein dhoondhna */
function n2Words(raw,q){return q.replace(/\b(hayat\w*|sahaba\w*|sahab\w*|mujhe|muje|hamein|hume|nikal\w*|nikaal\w*|kar|karo|do|dena|dijiye|waqia|waqiya|vakya|vakia|waqya|wakya|qissa|kissa|kahani|riwayat|hazrat|hadhrat|quran|hadees|kitab|mein|me|main|se|ka|ki|ke|ko|kya|kahan|kaha|batao|bata|dhoondo|dhundo|search|talash|kholo|aayat|ayat|wali|wala|ke bare|bare|baare|about|hai|hain|par|pe|koi|ek|sabse|kaun|konsi|kon si|ki baat|ka zikr|zikr)\b/g,' ').replace(/\s+/g,' ').trim()}
function n2Search(raw,q){const inS=/\b(hayat\w*|sahaba\w*|hayatus\w*)\b/.test(q);const inQ=!inS&&(/\bquran\b/.test(q)||/\b(aayat|ayat)\b/.test(q)),inH=!inS&&/\b(hadees|bukhari|muslim|kitab)\b/.test(q);if(!inQ&&!inH&&!inS)return null;
  const w=n2Words(raw,q);if(w.length<2)return null;
  if(inS){const t=T(`Hayat-us-Sahaba mein "${w}" dhoondh raha hoon — nateeje khul rahe hain.`,`Searching Hayat-us-Sahaba for "${w}".`);return{text:t,say:t,act:{type:'ssearch',q:w},go:1}}
  if(inQ){if(typeof QD==='undefined'||!QD){loadQ().catch(()=>{});return{text:T('Quran load ho raha hai — ek second baad dobara poochhein.','Loading Quran — ask again in a second.'),act:{type:'qsearch',q:w}}}
    try{buildQX()}catch(e){}const SYN={sabr:['sabar','patien','صبر'],namaz:['namaz','prayer','نماز','salat'],jannat:['jannat','paradise','جنت'],rizq:['rizq','rizk','provision','رزق'],taqwa:['taqwa','taqwa','تقوی'],shukr:['shukr','shukar','grateful','شکر'],maa:['maa','mother','والدین','ماں'],tauba:['tauba','toba','repent','توبہ']};const words=w.split(' ').filter(x=>x.length>1);const hits=[];const alts=words.map(x=>{let a=[x].concat(SYN[x]||[]);try{if(typeof cands==='function'&&isLatin(x))a=a.concat(cands(x))}catch(e){}return a.map(y=>String(y).toLowerCase())});
    for(let s=0;s<114&&hits.length<200;s++)for(let a=0;a<QX.ro[s].length;a++){const ro=QX.ro[s][a],ur=QX.ur[s][a];if(alts.every(g=>g.some(x=>ro.includes(x)||ur.includes(x))))hits.push([s+1,a+1])}
    if(!hits.length){const t=T(`Quran ke tarjume mein "${w}" nahi mila. Search page kholta hoon, wahan Arabi ya Urdu lafz se bhi dhoondh sakte hain.`,`"${w}" not found in the translation.`);return{text:t,say:t,act:{type:'qsearch',q:w}}}
    const top=hits.slice(0,3).map(([s,a])=>`• ${SN[s-1][0]} ${s}:${a} — ${String((S.lang==='en'&&QD.en?QD.en:QD.ro)[s-1][a-1]).slice(0,140)}…`).join('\n');
    const t=T(`Quran mein "${w}" ${hits.length}${hits.length>=200?'+':''} jagah mila. Pehli ayat: ${SN[hits[0][0]-1][0]} ${hits[0][0]}:${hits[0][1]}.`,`Found "${w}" in ${hits.length} ayahs. First: ${SN[hits[0][0]-1][0]} ${hits[0][0]}:${hits[0][1]}.`);
    return{text:t+'\n'+top,say:t,act:{type:'qsearch',q:w,s:hits[0][0],a:hits[0][1]}}}
  const t=T(`Hadees ki kitabon mein "${w}" dhoondh raha hoon — search page khul raha hai.`,`Searching hadith for "${w}".`);return{text:t,say:t,act:{type:'hsearch',q:w},go:1}}
/* main */
function noor2(raw){const q=n2Canon(raw);if(!q)return null;let r=null;
  try{r=n2Nav(q)||n2Search(raw,q)||n2Prayer(q)||n2Duty(q)||n2Date(q)||n2Deliv(q)||n2Salary(q)}catch(e){console.error(e);r=null}
  if(r&&r.act&&/\bkholo\b/.test(q))r.go=1;return r}
function n2Do(a){if(!a)return;if(a.type==='qsearch'){QS.pg=false;QS.view='list';QS.tab='search';QS.q=a.q;try{saveQS()}catch(e){}go('deen','quran');return}
  if(a.type==='hsearch'){KU.v='hadith';HD.v='search';HD.q=a.q;go('deen','kutub');return}
  if(a.type==='ssearch'){KU.v='hayat';HS.v='search';HS.q=a.q;go('deen','kutub');return}
  if(a.type==='open'){go(a.tab||'home',a.sub);return}}
window.AX=window.AX||{};
AX.n2go=el=>{try{n2Do(JSON.parse(el.dataset.j))}catch(e){}};
/* hook: chat */
const n2NeedQ=t=>/quran|kuran|qur|قرآن|कुरान|क़ुरआन|ayat|aayat|آیت|आयत/i.test(t)&&(typeof QD==='undefined'||!QD);
{const _send=aiSend;aiSend=async function(text){text=(text||'').trim();if(!text)return;if(n2NeedQ(text)){try{await loadQ()}catch(e){}}try{if(typeof RM!=='undefined')await RM.load()}catch(e){}const r=noor2(text);if(!r)return _send(text);
  AI.chat.push({r:'u',t:text});AI.chat.push({r:'a',t:r.text,n2:r.act||null});saveAI();if(r.go&&r.act){n2Do(r.act);return}rerender()}}
/* show "le chalo" button under My Assistant answers */
document.addEventListener('DOMContentLoaded',()=>{});
function n2Btn(a){if(!a)return'';const lb=a.type==='ssearch'?T('📚 Hayat-us-Sahaba kholein','📚 Open Hayat-us-Sahaba'):a.type==='qsearch'?T('📖 Quran mein dekhein','📖 Open in Quran'):a.type==='hsearch'?T('📚 Kitab mein dekhein','📚 Open books'):T('➡️ Wahan le chalo','➡️ Take me there');return`<button class="btn s ghost mt" data-a="n2go" data-j='${esc(JSON.stringify(a))}'>${lb}</button>`}
/* hook: hands-free */
{const _run=hfRun;hfRun=async function(cmd){if(n2NeedQ(cmd)){try{await loadQ()}catch(e){}}try{if(typeof RM!=='undefined')await RM.load()}catch(e){}
  const r=noor2(cmd);if(!r)return _run(cmd);HF.txt='“'+cmd+'”';hfDot();
  AI.chat.push({r:'u',t:'🎙 '+cmd});AI.chat.push({r:'a',t:r.text,n2:r.act||null});saveAI();
  if(r.go&&r.act)n2Do(r.act);else toast('✨ '+r.text.split('\n')[0].slice(0,160),6000);
  hfSpeak(null,(r.say||r.text).split('\n').slice(0,4).join('. '))}}

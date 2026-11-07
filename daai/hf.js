'use strict';
/* ===== My Assistant hands-free: while the app is open, say "My Assistant …" and it works — no button needed ===== */
const HF={on:false,wakeAt:0,busy:false,web:null,txt:''};
const hfNat=()=>!!(window.AndroidPA&&AndroidPA.sttStart);
const hfLang=()=>S.hfLang||'en-IN';
const WAKE=/\b(assistant|my assistant|hey assistant|ok assistant|noor|nur|nuur|nour|noore|nooor|noor ji|hey noor|ok noor|नूर|نور)\b[\s,.!:]*/i;
function hfDot(){let d=document.getElementById('hfdot');if(!d){d=document.createElement('div');d.id='hfdot';d.innerHTML='<i></i><span class="hft"></span>';d.onclick=()=>{S.hf=false;saveS();hfApply();toast(T('My Assistant hands-free band','My Assistant hands-free off'))};document.body.appendChild(d)}
  d.classList.toggle('on',HF.on);d.classList.toggle('wake',Date.now()-HF.wakeAt<10000);d.querySelector('.hft').textContent=HF.txt||(Date.now()-HF.wakeAt<10000?T('Boliye… sun rahi hoon','Listening…'):T('"Assistant…" boliye','Say "Assistant…"'))}
function hfStart(){if(HF.busy||document.hidden)return;if(hfNat()){try{AndroidPA.sttStart(hfLang(),true)}catch(e){}return}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  if(!HF.web){const r=new SR();r.lang=hfLang();r.continuous=true;r.interimResults=true;r.maxAlternatives=3;
    r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const res=e.results[i];const alts=[...res].map(a=>a.transcript).join('\n');window.sttResult(alts,res.isFinal?1:0)}};
    r.onend=()=>{if(HF.on&&!HF.busy&&!document.hidden)setTimeout(()=>{try{r.start()}catch(e){}},300)};r.onerror=e=>{if(e.error==='not-allowed'){window.sttErr('perm')}};HF.web=r}
  try{HF.web.start()}catch(e){}}
function hfStop(){if(hfNat()){try{AndroidPA.sttStop()}catch(e){}}if(HF.web){try{HF.web.abort()}catch(e){}}}
function hfApply(){HF.on=!!S.hf;try{if(window.AndroidPA&&AndroidPA.keepOn)AndroidPA.keepOn(HF.on)}catch(e){}if(HF.on)hfStart();else hfStop();hfDot()}
window.hfPause=()=>{hfStop()};window.hfResume=()=>{if(HF.on)setTimeout(hfStart,500)};
document.addEventListener('visibilitychange',()=>{if(!HF.on)return;if(document.hidden)hfStop();else setTimeout(hfStart,400)});
window.sttState=s=>{};
window.sttErr=c=>{if(c==='perm'){S.hf=false;saveS();HF.on=false;hfDot();toast(T('Mic ki ijazat nahi mili — Settings mein Microphone allow karein','Microphone permission denied'))}else if(c==='na'){S.hf=false;saveS();HF.on=false;hfDot();toast(T('Is phone mein Google voice typing nahi hai','Speech recognition not available'))}};
/* play a reply while the mic is paused so My Assistant doesn't hear herself */
async function hfSpeak(clip,text){HF.busy=true;hfStop();const fin=()=>{HF.busy=false;if(HF.on)setTimeout(hfStart,250)};
  try{if(clip){const u=await VO.blob(clip);const a=new Audio(u);await new Promise(res=>{a.onended=res;a.onerror=res;a.play().catch(res)})}
    if(text&&typeof TTS!=='undefined'){await new Promise(res=>{const old=TTS.lang;TTS.lang=S.lang==='ur'?'ur':'en';TTS.prep(()=>TTS.say(text,()=>{TTS.lang=old;res()}));setTimeout(res,15000)})}}catch(e){}fin()}
const HFNAV=[[/namaz|salah|prayer/,'deen','namaz'],[/quran|tilawat/,'deen','quran'],[/azkar|tasbeeh|tasbih|zikr/,'deen','azkar'],[/kitab|book|hadees|hadith/,'deen','kutub'],[/khabar|news/,'deen','khabar'],[/dua|alarm/,'deen','duas'],
  [/paisa|money|hisab|kharch|kamai|salary|payment/,'kaam','paisa'],[/call/,'kaam','calls'],[/waqt|timer|time/,'kaam','waqt'],[/wallet|password/,'kaam','wallet'],[/kaam|task|to ?do/,'kaam','tasks'],
  [/karobar|business|flow studio|order/,'biz',''],[/setting/,'more','set'],[/noor|chat/,'more','noor'],[/home|ghar|dashboard/,'home','']];
function hfLocal(q){
  if(false&&/\b(duty|login|office)\b.*\b(on|shuru|start|chalu)\b|\b(login kar|duty on)\b/.test(q)){AX.dyin();return 1}
  if(/\bbreak\b.*\b(khatam|end|over|band|wapas)\b|\bwapas aa gaya\b/.test(q)){AX.dybe();return 1}
  if(/\bbreak\b.*\b(shuru|start|le|lena|on)\b/.test(q)){AX.dybs();return 1}
  if(false&&/\b(duty|office)\b.*\b(off|band|khatam|end)\b|\b(chhutti|chutti|logout|log out)\b/.test(q)){AX.dyout();return 1}
  const dv=/\b(video|image|photo|graphic|design)\b.*\bdeliver|\bdeliver\w*\b.*\b(video|image|photo|graphic|design)\b/.exec(q);
  if(dv){const t=/video/.test(q)?'video':/image|photo/.test(q)?'image':/graphic|design/.test(q)?'graphic':'other';const n=+((q.match(/\b(\d+)\b/)||[])[1])||1;DV.push({id:uid(),ts:Date.now(),scope:'office',type:t,title:DVT[t]().slice(2),client:'',n,note:''});saveDV();toast('+'+n+' delivery ✅');rerender();return 1}
  if(/\btour\b/.test(q)){tourStart();return 1}
  if(/\b(khol|kholo|khol do|open|dikha|dikhao|le chalo|chalo|jao|pe jao|par jao)\b/.test(q)){for(const[re,t,s]of HFNAV)if(re.test(q)){go(t,s||undefined);return 1}}
  return 0}
function hfRun(cmd){const q=cmd.toLowerCase().replace(/[.?!,]/g,' ').replace(/\s+/g,' ').trim();if(!q)return;HF.txt='“'+cmd+'”';hfDot();
  try{if(hfLocal(q)){hfSpeak('noor_ok');return}}catch(e){}
  let r;const c2=cmd.replace(/kamaya|kamaye|kamaai|kamayi/gi,'kamai').replace(/kharch kiya|kharcha kiya|kharche kiye/gi,'kharcha');try{r=noorParse(c2)}catch(e){r=null}
  if(!r||!r.text||(typeof helpText==='function'&&r.text===helpText())){hfSpeak('noor_na');return}
  AI.chat.push({r:'u',t:'🎙 '+cmd});AI.chat.push({r:'a',t:r.text,act:null});saveAI();
  if(r.act){try{doAct(r.act)}catch(e){}}
  if(curTab==='more'&&subOf()==='noor')rerender();else toast('✨ '+r.text.split('\n')[0].slice(0,140),5000);
  hfSpeak(r.act?'noor_ok':null,r.act?'':r.text.split('\n').slice(0,3).join('. '))}
window.sttResult=(alts,fin)=>{if(!HF.on||HF.busy)return;const L=String(alts||'').split('\n').filter(Boolean);if(!L.length)return;
  if(!fin){HF.txt=L[0].slice(0,60);hfDot();return}
  const woke=Date.now()-HF.wakeAt<10000;let hit=null;for(const a of L){const m=WAKE.exec(a);if(m){hit={a,rest:a.slice(m.index+m[0].length).trim()};break}}
  if(hit){if(hit.rest.length<2){HF.wakeAt=Date.now();HF.txt='';hfDot();hfSpeak('noor_ji');return}HF.wakeAt=0;hfRun(hit.rest);return}
  if(woke){HF.wakeAt=0;hfRun(L[0]);return}
  HF.txt='';hfDot()};
function hfCard(){return`<div class="card"><div class="row sp"><div><b>🎙 ${T('My Assistant hands-free','My Assistant hands-free')}</b><div class="muted sm">${T('App khuli ho to bina button: "Assistant, namaz kholo" • "Assistant, quran kholo" • "Assistant, aaj ka kharcha?"','With the app open, no button: "Assistant, open namaz" • "Assistant, open quran"')}</div></div><input type="checkbox" class="sw" data-a="set" data-p="hf" data-t="check" ${S.hf?'checked':''}></div></div>`}
setTimeout(()=>{if(S.hf)hfApply()},2500);

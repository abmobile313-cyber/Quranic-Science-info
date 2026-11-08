'use strict';
/* ===== Read-aloud (Urdu): the phone's own text-to-speech (Google Urdu voice in the APK; browser voice on the web). Free, no AI-narration clips. ===== */
const TTS={on:false,q:[],i:0,gen:0,info:'',cb:null,cid:'',errs:0,onEnd:null,onItem:null,lang:'ur'};
const ttsNative=()=>!!(window.AndroidPA&&typeof AndroidPA.speak==='function');
/* honorific signs are spoken out in full, so the voice does not skip them */
const TTS_MAP=[[/ﷺ/g,' صلی اللہ علیہ وسلم '],[/ؐ/g,' صلی اللہ علیہ وسلم '],[/ؓ/g,' رضی اللہ عنہ '],[/ؒ/g,' رحمۃ اللہ علیہ '],[/ؑ/g,' علیہ السلام '],[/[ؔ-ؚـ]/g,''],[/[«»"“”\[\]\(\)\*#_|\uFD3E\uFD3F]/g,' '],[/\s+/g,' ']];
const ttsClean=t=>TTS_MAP.reduce((s,[r,x])=>s.replace(r,x),String(t||'')).trim();
const ttsPitch=()=>S.ttsPitch||((S.ttsG||'m')==='m'?0.8:1);
function ttsCfgSync(){try{if(ttsNative()&&AndroidPA.ttsCfg)AndroidPA.ttsCfg(ttsPitch(),S.ttsVoice||'')}catch(e){}}
function ttsVoice(lang){const vs=(window.speechSynthesis&&speechSynthesis.getVoices())||[];const f=p=>vs.find(v=>v.lang&&v.lang.toLowerCase().startsWith(p));const male=p=>{if((S.ttsG||'m')!=='m')return null;const ml=vs.filter(v=>v.lang&&v.lang.toLowerCase().startsWith(p)&&/asad|male|madhur|hemant|prabhat|ravi|rishi|salman|omar|hamed/i.test(v.name)&&!/female/i.test(v.name));return ml[0]||null};
  return lang==='en'?(f('en-in')||f('en')):lang==='ar'?(male('ar')||f('ar')||null):lang==='hi'?(male('hi')||f('hi')||male('ur')||f('ur')||null):(male('ur')||f('ur')||male('hi')||f('hi')||null)}
TTS.prep=function(cb){if(!ttsNative()){cb();return}ttsCfgSync();if(this.info){cb();return}window.ttsReady=l=>{TTS.info=l||'none';cb()};try{AndroidPA.ttsPrep()}catch(e){this.info='none';cb()}};
TTS.say=function(text,done){const t=ttsClean(text);if(!t){done();return}const rate=S.ttsRate||0.95;if(this.lang==='ur'&&/[\u0900-\u097f]/.test(t)&&!/[\u0600-\u06ff]/.test(t))this.lang='hi'; /* Devanagari (Hindi script) text → Hindi voice reads the same Urdu words */
  if(ttsNative()){const id='t'+Date.now()+Math.random().toString(36).slice(2,5);this.cid=id;this.cb=done;try{AndroidPA.speak(t,this.lang,rate,id)}catch(e){this.cb=null;done()}return}
  if(!window.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined'){toast(T('Is device me awaaz (TTS) support nahi','No text-to-speech on this device'));this.stop();return}
  const u=new SpeechSynthesisUtterance(t);const v=ttsVoice(this.lang);if(v){u.voice=v;u.lang=v.lang}else u.lang=this.lang==='en'?'en-IN':this.lang==='ar'?'ar-SA':this.lang==='hi'?'hi-IN':({fa:'fa-IR',ps:'ps-AF',tr:'tr-TR',id:'id-ID',bn:'bn-BD'})[this.lang]||'ur-PK';u.rate=rate;u.pitch=ttsPitch();let fin=false;const f=()=>{if(fin)return;fin=true;done()};u.onend=f;u.onerror=f;speechSynthesis.speak(u)};
window.ttsDone=(id,err)=>{if(TTS.cid!==id)return;const c=TTS.cb;TTS.cb=null;if(err){TTS.errs++;if(TTS.errs>2){TTS.stop();toast(T('Awaaz nahi chali — phone ki Text-to-speech settings dekhein','Voice failed — check phone text-to-speech settings'),4500);return}}else TTS.errs=0;if(c)c()};
TTS.run=function(items,o={}){this.stop();items=items.filter(x=>ttsClean(x.t));if(!items.length){toast(T('Padhne ke liye text nahi mila','Nothing to read'));return}
  this.lang=o.lang||'ur';this.prep(()=>{if(ttsNative()&&this.info==='none'&&this.lang!=='ar'){ttsHelp();return}
    this.on=true;this.q=items;this.i=0;this.gen++;this.onEnd=o.onEnd||null;this.onItem=o.onItem||null;this.errs=0;this.step(this.gen);if(o.onStart)o.onStart()})};
TTS.step=function(g){if(g!==this.gen||!this.on)return;if(this.i>=this.q.length){this.on=false;const f=this.onEnd;this.onEnd=null;ttsUI(false);if(f)f();return}
  const it=this.q[this.i];if(this.onItem)this.onItem(it,this.i);this.say(it.t,()=>{if(g!==this.gen||!this.on)return;this.i++;this.step(g)})};
TTS.stop=function(){const was=this.on;this.on=false;this.gen++;this.cb=null;this.onEnd=null;try{if(ttsNative())AndroidPA.stopSpeak();else if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}$$('.hss.on,.hsh.on,.hd.speaking').forEach(e=>e.classList.remove('on','speaking'));if(was)ttsUI(false)};
function ttsUI(on){if(!on)$$('.dmsay').forEach(b=>{if(b.dataset.on){b.dataset.on='';b.firstChild&&(b.firstChild.nodeValue=b.dataset.t==='tr'?'🗣':'▶')}});const b=$('#hsPlay');if(b)b.innerHTML=(on?'⏸ '+T('Rokein','Stop'):'▶ '+T('Awaaz','Audio'));const h=$('#hdPlay');if(h)h.innerHTML=(on?'⏸ '+T('Rokein','Stop'):'🔊 '+T('Poora safha sunein','Listen to page'))}
function ttsHelp(){dlg(`<h2 class="h2">🔊 ${T('Urdu awaaz chahiye','Urdu voice needed','اردو آواز درکار ہے','उर्दू आवाज़ चाहिए')}</h2><p>${T('Is phone mein Urdu/Hindi text-to-speech awaaz install nahi hai. Settings → Text-to-speech → "Speech Services by Google" → Urdu (Pakistan) voice download kar lein. Phir yahan wapas aayein.','No Urdu/Hindi voice is installed. Open Text-to-speech settings and download the Urdu (Pakistan) voice of Google Speech Services.','اس فون میں اردو آواز انسٹال نہیں۔ ٹیکسٹ ٹو اسپیچ سیٹنگز میں گوگل کی اردو (پاکستان) آواز ڈاؤن لوڈ کریں۔','इस फ़ोन में उर्दू आवाज़ नहीं है। टेक्स्ट-टू-स्पीच सेटिंग्स में Google की उर्दू (पाकिस्तान) आवाज़ डाउनलोड करें।')}</p><div class="row mt"><button class="btn grow" data-a="ttsopen">⚙ ${T('Settings kholein','Open settings')}</button><button class="btn ghost grow" data-a="closedlg">OK</button></div>`)}
AX.ttsopen=()=>{closeDlg();try{AndroidPA.openSetting('tts')}catch(e){toast(T('Phone Settings → Text-to-speech kholein','Open phone Settings → Text-to-speech'))}};
function ttsSetForm(){const v=S.hsVoice||'tts',r=S.ttsRate||0.95;
  dlg(`<div class="row sp"><h2 class="h2" style="margin:0">🔊 ${T('Awaaz ki settings','Voice settings','آواز کی سیٹنگز','आवाज़ की सेटिंग्स')}</h2><button class="btn s ghost" data-a="closedlg">✕</button></div>
  <label>${T('Hayatus Sahaba ki awaaz','Hayatus Sahaba voice','حیاۃ الصحابہ کی آواز','हयातुस्सहाबा की आवाज़')}</label><div class="fch" style="padding:4px 0"><button data-a="ttsv" data-v="tts" class="${v==='tts'?'on':''}">📱 ${T('Phone ki Urdu awaaz (behtar)','Phone Urdu voice (better)')}</button><button data-a="ttsv" data-v="ai" class="${v==='ai'?'on':''}">🤖 ${T('Purani AI awaaz','Old AI narration')}</button></div>
  <label>${T('Raftaar','Speed','رفتار','रफ़्तार')}</label><div class="fch" style="padding:4px 0">${[[0.75,'0.75x'],[0.95,'1x'],[1.15,'1.15x'],[1.35,'1.35x']].map(x=>`<button data-a="ttsr" data-v="${x[0]}" class="${Math.abs(r-x[0])<.01?'on':''}">${x[1]}</button>`).join('')}</div>
  <label>${T('Awaaz: Mard ya Aurat','Voice: Male or Female','آواز: مرد یا عورت','आवाज़: मर्द या औरत')}</label><div class="fch" style="padding:4px 0"><button data-a="ttsg" data-v="m" class="${(S.ttsG||'m')==='m'?'on':''}">🧔 ${T('Mard (default)','Male (default)')}</button><button data-a="ttsg" data-v="f" class="${S.ttsG==='f'?'on':''}">👩 ${T('Aurat','Female')}</button></div>
  <label>${T('Awaaz ka bhaari-pan (pitch)','Voice depth (pitch)')}</label><div class="fch" style="padding:4px 0">${[[0.65,T('Bahut bhaari','Very deep')],[0.8,T('Bhaari','Deep')],[0.9,T('Halka','Medium')],[1,T('Normal','Normal')]].map(x=>`<button data-a="ttsp" data-v="${x[0]}" class="${Math.abs(ttsPitch()-x[0])<.01?'on':''}">${x[1]}</button>`).join('')}</div>
  <div id="ttsvl" class="mt"></div>
  <div class="row wrap mt"><button class="btn s" data-a="ttstest">▶ ${T('Test','Test')}</button><button class="btn s ghost" data-a="ttsopen">⚙ ${T('Phone ki awaaz settings (Urdu voice download)','Phone voice settings (download Urdu voice)')}</button></div>
  <p class="muted sm">${T('Awaaz ka maiyaar aap ke phone ki Google Urdu voice par hai. Behtar voice ke liye Speech Services by Google update rakhein.','Quality depends on the Google Urdu voice installed on your phone.')}</p>`)}
function ttsVoiceList(){const box=$('#ttsvl');if(!box||!ttsNative()||!AndroidPA.ttsVoices)return;TTS.prep(()=>{let vs=[];try{vs=JSON.parse(AndroidPA.ttsVoices()||'[]')}catch(e){}if(!vs.length){box.innerHTML='';return}
  box.innerHTML=`<label>${T('Phone mein maujood Urdu/Hindi awaazein (jo mard jaisi lage chunein)','Urdu/Hindi voices on this phone (pick one that sounds male)')}</label><div class="fch" style="padding:4px 0"><button data-a="ttsvn" data-v="" class="${!S.ttsVoice?'on':''}">${T('Default','Default')}</button>${vs.map((v,i)=>`<button data-a="ttsvn" data-v="${esc(v.n)}" class="${S.ttsVoice===v.n?'on':''}">${T('Awaaz','Voice')} ${i+1}${v.net?' ☁':''}</button>`).join('')}</div><p class="muted sm">${T('Har awaaz par dabakar Test suniye; jo pasand aaye wahi rakhein.','Tap a voice, then Test; keep the one you like.')}</p>`})}
AX.ttsset=()=>{ttsSetForm();ttsVoiceList()};
AX.ttsg=el=>{S.ttsG=el.dataset.v;S.ttsPitch=0;saveS();ttsCfgSync();TTS.stop();ttsSetForm();ttsVoiceList()};
AX.ttsp=el=>{S.ttsPitch=+el.dataset.v;saveS();ttsCfgSync();TTS.stop();ttsSetForm();ttsVoiceList()};
AX.ttsvn=el=>{S.ttsVoice=el.dataset.v;saveS();ttsCfgSync();TTS.stop();ttsSetForm();ttsVoiceList();setTimeout(()=>AX.ttstest(),150)};
AX.ttsv=el=>{S.hsVoice=el.dataset.v;saveS();TTS.stop();ttsSetForm()};
AX.ttsr=el=>{S.ttsRate=+el.dataset.v;saveS();ttsSetForm()};
AX.ttstest=()=>TTS.run([{t:'بسم اللہ الرحمٰن الرحیم۔ حضرت ابوبکر صدیق رضی اللہ عنہ نے فرمایا، اللہ کے رسول ﷺ پر درود بھیجیں۔'}],{lang:'ur'});
/* Hadith: listen to one hadith or the whole page */
AX.hdspeak=el=>{if(TTS.on){TTS.stop();return}const n=document.getElementById(`hdu_${el.dataset.b}_${el.dataset.n}`);if(!n)return;const card=n.closest('.hd');TTS.run([{t:n.textContent,el:card}],{lang:(typeof HDE!=='undefined'&&HDE)?'en':'ur',onItem:it=>it.el&&it.el.classList.add('speaking')})};
AX.hdspeakall=()=>{if(TTS.on){TTS.stop();return}const cards=$$('.card.hd');if(!cards.length)return;
  const go1=()=>{const cs=$$('.card.hd');TTS.run(cs.map(c=>({t:(c.querySelector('.hdt')||{}).textContent,el:c})),{lang:(typeof HDE!=='undefined'&&HDE)?'en':'ur',onStart:()=>ttsUI(true),
    onItem:it=>{$$('.hd.speaking').forEach(e=>e.classList.remove('speaking'));it.el.classList.add('speaking');try{it.el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},
    onEnd:()=>{const nx=$('[data-a="hdpg"][data-d="1"]');if(nx&&!nx.disabled){A.hdpg({dataset:{d:'1'}});setTimeout(go1,900)}}})};go1()};
/* Hayatus Sahaba: read the page (headings + text) */
const hsSpk={p:null};
function hsAuto(p){const k=p.dataset.wq;if(!HSM.wq[k]){hsMark('wq',k,true);const b=p.querySelector('.wqb');if(b){b.classList.add('on');b.textContent='✅'}}}
function hsSpeak(){hsSpk.p=null;if(TTS.on){stopHS();return}const els=$$('.hsh,.hss');if(!els.length){toast(T('Is safhe par text nahi','No text on this page'));return}const v=HS.vol,pg=HS.page[v]||0;
  TTS.run(els.map(e=>({t:e.textContent,el:e})),{lang:'ur',onStart:()=>ttsUI(true),onItem:it=>{$$('.hss.on,.hsh.on').forEach(x=>x.classList.remove('on'));const pp=hsSpk.p;const np=it.el.closest('p.hsp');if(pp&&pp!==np&&pp.dataset.wq)hsAuto(pp);if(it.el.classList.contains('hsh')){const b=it.el.previousElementSibling;if(b&&b.classList.contains('secb')){const kb=b.querySelector('[data-k]');if(kb&&!HSM.sec[kb.dataset.k])hsMark('sec',kb.dataset.k,true)}}hsSpk.p=np;it.el.classList.add('on');try{it.el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},
    onEnd:()=>{if(hsSpk.p&&hsSpk.p.dataset.wq)hsAuto(hsSpk.p);hsSpk.p=null;const D=HS.data[v];if(D&&pg+1<D.p.length){HS.page[v]=pg+1;store.set('hs_page',HS.page);Promise.resolve(rerender()).then(()=>setTimeout(hsSpeak,500))}}})}

/* ====== Hayatus Sahaba: dated "read" marks per section and per passage (waqia) — shown in the weekly / monthly report ====== */
const HSM=Object.assign({sec:{},wq:{}},store.get('hs_marks',{}));
const hsmSave=()=>store.set('hs_marks',HSM);
function hsPrevHead(D,pg,pi){for(let g=pg;g>=0;g--){const ps=D.p[g]||[];for(let i=(g===pg?pi-1:ps.length-1);i>=0;i--)if((ps[i]||'').startsWith('# '))return{pg:g,pi:i,t:ps[i].slice(2).trim()}}return null}
function hsSecClose(D,v,pg,pi){const pr=hsPrevHead(D,pg,pi);if(!pr)return'';const k=`${v}:${pr.pg}:${pr.pi}`,on=!!HSM.sec[k];
  return`<div class="secb${on?' on':''}"><button class="btn s ${on?'rdon':'gold'}" data-a="hssec" data-k="${k}">${on?'✅ '+T('Section padh liya (hatayein)','Section read (undo)'):'✅ '+T('Yeh section padh liya','Mark this section read')}</button><span class="muted sm">${esc(pr.t.slice(0,60))}</span></div>`}
function hsMark(kind,k,on){const M=HSM[kind];if(on===undefined)on=!M[k];if(on)M[k]=dkey();else delete M[k];hsmSave()}
AX.hswq=el=>{const k=el.dataset.k;hsMark('wq',k);const on=!!HSM.wq[k];el.classList.toggle('on',on);el.textContent=on?'✅':'○';sfx(on?'success':'tick')};
AX.hssec=el=>{const k=el.dataset.k;hsMark('sec',k);sfx(HSM.sec[k]?'success':'tick');rerender()};
function hsStats(from,to){const a=dkey(from),b=dkey(to);const c=o=>Object.values(o).filter(d=>d>=a&&d<=b).length;return{sec:c(HSM.sec),wq:c(HSM.wq)}}
function hsReportRow(from,to){const r=hsStats(from,to);return`<div class="mrow2"><div class="row sp"><span>📚 ${T('Hayatus Sahaba — padhe hue','Hayatus Sahaba — read')}</span><b>${r.sec} ${T('section','sections')} • ${r.wq} ${T('waqiat','passages')}</b></div></div>`}

/* Duas: read ONLY the written text (Arabic via phone voice, or the Urdu/English translation) */
AX.dmsay=el=>{if(TTS.on){const same=el.dataset.on;TTS.stop();if(same)return}
  const card=el.closest('.card');if(!card)return;const tr=el.dataset.t==='tr';const n=card.querySelector(tr?'.hdt':'.hda');if(!n)return;
  let txt=n.textContent;if(tr)txt=txt.replace(/^\s*(TARJUMA|TRANSLATION|ترجمہ|अनुवाद)\s*/i,'');
  TTS.run([{t:txt}],{lang:tr?(isNL()?S.lang:(S.lang==='en')?'en':'ur'):'ar',onStart:()=>{el.dataset.on='1';if(el.firstChild)el.firstChild.nodeValue='⏸'}})};

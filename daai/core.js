'use strict';
/* ===== Deen Saathi by Quranic Science — core: utils, storage, language, sound, voice, notifications, dialogs ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem('pa_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('pa_'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('pa_'+k)}catch(e){}}};
const RD={q:store.get('rd_q',{}),h:store.get('rd_h',{}),s:store.get('rd_s',{}),sv(){store.set('rd_q',this.q);store.set('rd_h',this.h);store.set('rd_s',this.s)},
 qHas(s,a){return(this.q[s]||[]).includes(a)},qCnt(s){return(this.q[s]||[]).length},
 qTog(s,a){const L=this.q[s]||(this.q[s]=[]);const i=L.indexOf(a);if(i>=0)L.splice(i,1);else L.push(a);if(!L.length)delete this.q[s];this.sv();return i<0},
 qAll(s,n,on){if(on)this.q[s]=Array.from({length:n},(_,i)=>i+1);else delete this.q[s];this.sv()},
 hTog(k){const on=!this.h[k];if(on)this.h[k]=1;else delete this.h[k];this.sv();return on},
 sTog(k){const on=!this.s[k];if(on)this.s[k]=1;else delete this.s[k];this.sv();return on},
 hCnt(b,ns){let c=0;for(const n of ns)if(this.h[b+':'+n])c++;return c},sCnt(v){let c=0;for(const k in this.s)if(k.startsWith(v+':'))c++;return c}};
const FS_DEF=26;
const fsBar=()=>`<span class="fsb"><button class="btn ghost s" data-a="qfont" data-d="-2" aria-label="smaller">A−</button><button class="btn ghost s fsv" data-a="qfont" data-d="0" title="reset">${S.qs||FS_DEF}</button><button class="btn ghost s" data-a="qfont" data-d="2" aria-label="bigger">A+</button></span>`;
const fsRow=()=>`<div class="fsrow"><span class="muted sm">${T('Likhai ka size (sab pages par ek jaisa)','Text size (same on every page)','لکھائی کا سائز (ہر صفحے پر ایک جیسا)','लिखाई का साइज़ (हर पेज पर एक जैसा)')}</span>${fsBar()}</div>`;

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const dkey=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const toISO=d=>dkey(d)+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const TZ=Intl.DateTimeFormat().resolvedOptions().timeZone;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const hm=(s)=>{const m=/(\d{1,2}):(\d{2})/.exec(s||'');return m?[+m[1],+m[2]]:null};
const atTime=(hhmm,base=new Date())=>{const m=hm(hhmm);if(!m)return null;const d=new Date(base);d.setHours(m[0],m[1],0,0);return d};
const t12=s=>{const m=hm(s);if(!m)return s||'';const pm=m[0]>=12,h=m[0];const ap=S.lang==='ur'?(h<4?'رات':h<12?'صبح':h<16?'دوپہر':h<19?'شام':'رات'):S.lang==='hi'?(h<4?'रात':h<12?'सुबह':h<16?'दोपहर':h<19?'शाम':'रात'):(pm?'PM':'AM');return ((m[0]%12)||12)+':'+pad(m[1])+' '+ap};
const fmtCount=ms=>{const s=Math.max(0,Math.floor(ms/1000));return pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60)};
const fmtDur=min=>{min=Math.round(min);const h=Math.floor(min/60),m=min%60;return h?h+'h '+pad(m)+'m':m+'m'};
const LOC=()=>S.lang==='ur'?'ur-IN':S.lang==='hi'?'hi-IN':({ar:'ar-SA',fa:'fa-IR',ps:'ps-AF',tr:'tr-TR',id:'id-ID',bn:'bn-BD'})[S.lang]||'en-IN';
const fmtDT=s=>{const d=new Date(s);return isNaN(d)?'':d.toLocaleString(LOC(),{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})};
const fmtD=s=>{const d=new Date(s);return isNaN(d)?'':d.toLocaleDateString(LOC(),{day:'numeric',month:'short',year:'numeric'})};
const num=n=>Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
const debounce=(f,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};
const toArDigits=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);

/* ---------- big storage (IndexedDB) ---------- */
const IDB={db:null,open(){return this.db||(this.db=new Promise((res,rej)=>{try{const r=indexedDB.open('pa4',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}}))},
  async get(k){try{const db=await this.open();return await new Promise((res,rej)=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}catch(e){return undefined}},
  async set(k,v){try{const db=await this.open();return await new Promise((res,rej)=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>res(true);t.onerror=()=>rej(t.error)})}catch(e){return false}},
  async del(k){try{const db=await this.open();return await new Promise(res=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').delete(k);t.oncomplete=()=>res(true)})}catch(e){return false}}};

/* ---------- settings ---------- */
const DEF_S={name:'',lang:'en',theme:'dark',city:'',country:'India',lat:null,lng:null,method:1,school:0,
  jam:{Fajr:25,Dhuhr:15,Asr:15,Maghrib:5,Isha:15},askAfter:10,azan:true,waqtNotif:true,autoLoc:true,hsVoice:'tts',ttsRate:0.95,setupDone:false,lock:{on:false,hash:'',salt:'',rc:'',len:4,mode:'all',after:1,bio:true,tries:0},
  voice:true,sfx:true,notif:false,
  masjid:{name:'',az:{},jm:{},pre:false,jz:'',ju:''},
  sadqaNotif:'10:00',sadqaAsk:'21:00',sadqaPct:2.5,sadqaAmt:0,
  tilNotif:'06:00',tilAsk:'21:30',tilTarget:20,
  azM:'06:30',azE:'17:30',
  job:{on:false,login:'09:30',brk:'13:00',brkEnd:'13:45',leave:'18:00'},
  review:'22:00',mamool:'21:00',hiTr:'taqi',firqa:'',rate:88,fbOn:false,qs:32,
  dua:{wakeOn:true,wake:'05:00',sleepOn:true,sleep:'22:30',mealOn:true,b:'08:30',l:'13:30',d:'20:30',after:20,dailyOn:true,daily:'19:00'},
  gasht:{on:false,own:{d:2,p:'Asr'},nbr:{d:4,p:'Asr'}},
  favs:[],favAct:0,
  mk:{on:true,rise:15,zawal:10,set:20},
  feeds:{}};
let S=Object.assign({},DEF_S,store.get('settings',{}));
if(!['ur','ro','hi','en','ar','fa','ps','tr','id','bn'].includes(S.lang))S.lang='en';
S.masjid=Object.assign({name:'',az:{},jm:{},pre:false,jz:'',ju:''},S.masjid||{});S.masjid.az=S.masjid.az||{};S.masjid.jm=S.masjid.jm||{};
S.jam=Object.assign({},DEF_S.jam,S.jam||{});S.job=Object.assign({},DEF_S.job,S.job||{});S.feeds=S.feeds||{};S.dua=Object.assign({},DEF_S.dua,S.dua||{});S.lock=Object.assign({},DEF_S.lock,S.lock||{});S.gasht=Object.assign({},DEF_S.gasht,S.gasht||{});S.gasht.own=Object.assign({},DEF_S.gasht.own,S.gasht.own||{});S.gasht.nbr=Object.assign({},DEF_S.gasht.nbr,S.gasht.nbr||{});S.favs=Array.isArray(S.favs)?S.favs:[];S.mk=Object.assign({},DEF_S.mk,S.mk||{});
const saveS=()=>store.set('settings',S);
if(!S.dua.m26){S.dua.wakeOn=S.dua.sleepOn=S.dua.mealOn=S.dua.dailyOn=true;S.dua.m26=1;saveS()}

/* ---------- language: T(roman, english, urdu?, hindi?) — Urdu (Nastaliq) / Hindi / English ---------- */
const LANGS=[['en','English'],['ur','اردو'],['ro','Roman Urdu'],['hi','हिन्दी'],['ar','العربية'],['fa','فارسی / دری'],['ps','پښتو'],['tr','Türkçe'],['id','Bahasa Indonesia'],['bn','বাংলা']];
const NEWL=['ar','fa','ps','tr','id','bn'];const isNL=()=>NEWL.includes(S.lang);const isEnL=()=>S.lang==='en'||NEWL.includes(S.lang);const RTLL=['ur','ar','fa','ps'];
/* nayi zabaanein: English jumle ka tarjuma XL_<lang> table se (xl-<lang>.js); na mile to English */
let XLTP=null;function XLT(b){const D=(typeof window!=='undefined'&&window['XL_'+S.lang])||null;if(!D||typeof b!=='string')return b;const x=D[b];if(x)return x;
  if(b.length<600){if(!XLTP){XLTP=[];for(const k in D){if(k.indexOf('${')<0)continue;const ph=[];const pat=k.split(/(\$\{[^}]*\})/).map(p=>{if(/^\$\{/.test(p)){ph.push(p);return'([\\s\\S]*?)'}return p.replace(/[.*+?^$()|[\]\\{}]/g,'\\$&')}).join('');try{XLTP.push({re:new RegExp('^'+pat+'$'),ph,u:D[k]})}catch(e){}}}
    for(const t of XLTP){const m=t.re.exec(b);if(m){let o=t.u;t.ph.forEach((p,i)=>{o=o.split(p).join(m[i+1])});return o}}}return b}
const LK=()=>(S.lang==='ro'||NEWL.includes(S.lang))?'en':S.lang; /* key for per-language data tables; Roman Urdu reuses the English tables */
const VL=()=>isEnL()?'en':'ur'; /* voice: Urdu for Roman/Urdu/Hindi (Hindi = Urdu in Devanagari script); English only for English */ /* voice clips: Roman Urdu uses the Urdu recordings */
const I18N=(typeof window!=='undefined'&&window.I18N_DATA)||{};
const I18N2=(typeof window!=='undefined'&&window.I18N_UR)||{};
const T=(r,e,u,h)=>{const l=S.lang;if(l==='en')return e!=null?e:r;if(NEWL.includes(l))return XLT(e!=null?e:r);
  if(l==='ro')return typeof SIMP==='function'?SIMP(r):r;
  if(l==='ur'){if(u)return u;const x=I18N[r]||I18N2[r];if(x&&x[0])return x[0];if(x&&typeof x==='string')return x;const tp=typeof tplLookup==='function'?tplLookup(r):null;return tp||(typeof SIMP==='function'?SIMP(r):r)}
  if(h)return h;const x=I18N[r];if(x&&x[1])return x[1];return typeof DVN==='function'?DVN(SIMP(r)):r};
const PN={Fajr:['فجر','फ़ज्र','Fajr'],Sunrise:['طلوعِ آفتاب','सूर्योदय','Sunrise'],Dhuhr:['ظہر','ज़ुहर','Dhuhr'],Asr:['عصر','अस्र','Asr'],Maghrib:['مغرب','मग़रिब','Maghrib'],Isha:['عشاء','इशा','Isha'],Jumma:['جمعہ','जुमा','Jumma']};
const nm=()=>'';
const dn=s=>T(s,s); /* display-translate known default data strings */
var PN_D=null;/* set while planning another day */
const isFriD=d=>(d||PN_D||new Date()).getDay()===5;
const PNX={ar:{Fajr:'الفجر',Sunrise:'الشروق',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء',Jumma:'الجمعة'},fa:{Fajr:'صبح',Sunrise:'طلوع آفتاب',Dhuhr:'ظهر',Asr:'عصر',Maghrib:'مغرب',Isha:'عشا',Jumma:'جمعه'},ps:{Fajr:'سهار',Sunrise:'لمر ختل',Dhuhr:'ماسپښین',Asr:'مازدیګر',Maghrib:'ماښام',Isha:'ماخستن',Jumma:'جمعه'},tr:{Fajr:'Sabah',Sunrise:'Güneş',Dhuhr:'Öğle',Asr:'İkindi',Maghrib:'Akşam',Isha:'Yatsı',Jumma:'Cuma'},id:{Fajr:'Subuh',Sunrise:'Terbit',Dhuhr:'Zuhur',Asr:'Asar',Maghrib:'Magrib',Isha:'Isya',Jumma:'Jumat'},bn:{Fajr:'ফজর',Sunrise:'সূর্যোদয়',Dhuhr:'যোহর',Asr:'আসর',Maghrib:'মাগরিব',Isha:'এশা',Jumma:'জুমা'}};
const pname=(k,d)=>{if(k==='Dhuhr'&&isFriD(d))k='Jumma';if(PNX[S.lang]&&PNX[S.lang][k])return PNX[S.lang][k];return(PN[k]||[k,k,k])[S.lang==='ur'?0:S.lang==='hi'?1:2]};
function applyLang(){const h=document.documentElement;h.lang=S.lang;h.dir=RTLL.includes(S.lang)?'rtl':'ltr';h.dataset.lang=S.lang;
  const a=$('#spSub'),b=$('#spTap');if(a)a.textContent=T('Namaz • Quran • Kaarobar • Kaam • My Assistant','Prayer • Quran • Business • Work • My Assistant');if(b)b.textContent=T('Tap karein — shuru','Tap to begin')}
const PRAY=['Fajr','Dhuhr','Asr','Maghrib','Isha'];

/* ---------- theme ---------- */
function applyTheme(){if(S.qsv!==2){S.qs=FS_DEF;S.qsv=2;try{saveS()}catch(e){}}document.documentElement.dataset.theme=S.theme;const m=$('meta[name=theme-color]');if(m)m.content=S.theme==='light'?'#efe9db':'#04090d';document.documentElement.style.setProperty('--qs',(S.qs||FS_DEF)+'px')}

/* ---------- toast / dialogs ---------- */
function toast(m,ms=2600){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),ms)}
function dlg(html,{onClose,cls}={}){const d=$('#dlg');d.className=cls||'';d.innerHTML=html;d._onClose=onClose||null;if(!d.open)d.showModal();return d}
function closeDlg(){const d=$('#dlg');if(d.open)d.close()}
document.addEventListener('DOMContentLoaded',()=>{const d=$('#dlg');if(!d)return;d.addEventListener('close',()=>{const f=d._onClose;d._onClose=null;if(f)try{f()}catch(e){}});d.addEventListener('click',e=>{if(e.target===d)d.close()})});
function form(title,fields,onOk,{ok=T('Save karein','Save'),extra=''}={}){
  const h=fields.map(f=>{const id='f_'+f.k;const v=f.v==null?'':f.v;
    if(f.t==='select')return `<label for="${id}">${esc(f.l)}</label><select id="${id}">${f.o.map(o=>{const ov=Array.isArray(o)?o[0]:o,ol=Array.isArray(o)?o[1]:o;return `<option value="${esc(ov)}"${String(ov)===String(v)?' selected':''}>${esc(ol)}</option>`}).join('')}</select>`;
    if(f.t==='area')return `<label for="${id}">${esc(f.l)}</label><textarea id="${id}" rows="${f.r||3}" placeholder="${esc(f.p||'')}">${esc(v)}</textarea>`;
    if(f.t==='file')return `<label for="${id}">${esc(f.l)}</label><input id="${id}" type="file" accept="${f.a||'image/*'}">`;
    return `<label for="${id}">${esc(f.l)}</label><input id="${id}" type="${f.t||'text'}" value="${esc(v)}" placeholder="${esc(f.p||'')}" ${f.m?`inputmode="${f.m}"`:''} autocomplete="off">`}).join('');
  dlg(`<h2 class="h2">${esc(title)}</h2>${h}${extra}<div class="row mt"><button class="btn ghost grow" id="fx">${T('Cancel','Cancel')}</button><button class="btn grow" id="fo">${esc(ok)}</button></div>`);
  $('#fx').onclick=closeDlg;
  $('#fo').onclick=async()=>{const o={};for(const f of fields){const el=$('#f_'+f.k);o[f.k]=f.t==='file'?(el.files&&el.files[0]||null):el.value.trim()}
    const r=await onOk(o);if(r!==false)closeDlg()}}
const confirmDlg=(msg,yes)=>{dlg(`<p>${esc(msg)}</p><div class="row mt"><button class="btn ghost grow" id="cn">${T('Nahi','No')}</button><button class="btn bad grow" id="cy">${T('Haan','Yes')}</button></div>`);$('#cn').onclick=closeDlg;$('#cy').onclick=()=>{closeDlg();yes()}};
async function fileToDataURL(file,max=1280,q=.78){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{if(!/^image\//.test(file.type))return res(r.result);const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.onerror=()=>res(r.result);im.src=r.result};r.readAsDataURL(file)})}

/* ---------- SOUND: effects only (no music) ---------- */
const AU={ctx:null,out:null,fx:null,conv:null,nbuf:null,
  init(){if(this.ctx)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;const c=this.ctx=new C();
    this.out=c.createGain();this.out.gain.value=.9;this.out.connect(c.destination);
    this.fx=c.createGain();this.fx.gain.value=.75;this.fx.connect(this.out);
    const len=Math.floor(c.sampleRate*1.6),ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
    this.conv=c.createConvolver();this.conv.buffer=ir;const w=c.createGain();w.gain.value=.45;this.conv.connect(w);w.connect(this.out);
    const nb=c.createBuffer(1,c.sampleRate,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;this.nbuf=nb;return true},
  unlock(){if(!this.init())return;if(this.ctx.state!=='running'){try{this.ctx.resume()}catch(e){}}},
  running(){return !!this.ctx&&this.ctx.state==='running'},
  play(n){
    if(!S.sfx||!this.running())return;const c=this.ctx,t=c.currentTime;
    const env=(g,a,pk,d,off)=>{const s=t+(off||0);g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(pk,s+a);g.gain.exponentialRampToValueAtTime(.0001,s+a+d)};
    const noise=(f,q,type,a,pk,d,f2,off)=>{const s0=t+(off||0);const s=c.createBufferSource();s.buffer=this.nbuf;s.loop=true;const b=c.createBiquadFilter();b.type=type;b.frequency.setValueAtTime(f,s0);if(f2)b.frequency.exponentialRampToValueAtTime(f2,s0+a+d);b.Q.value=q;const g=c.createGain();env(g,a,pk,d,off);s.connect(b);b.connect(g);g.connect(this.fx);s.start(s0);s.stop(s0+a+d+.05)};
    const tone=(fr,type,a,pk,d,fr2,send,off)=>{const s0=t+(off||0);const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(fr,s0);if(fr2)o.frequency.exponentialRampToValueAtTime(fr2,s0+a+d);const g=c.createGain();env(g,a,pk,d,off);o.connect(g);g.connect(this.fx);if(send)g.connect(this.conv);o.start(s0);o.stop(s0+a+d+.05)};
    switch(n){
      case 'key':{const P=[1046.5,1174.7,1318.5,1568,1760,2093];const f=P[Math.floor(Math.random()*P.length)];tone(f,'sine',.004,.07,.34,null,true);tone(f*2,'sine',.004,.018,.2,null,true,.01);break} // soft glass sparkle (replaces typing click)
      case 'tap':tone(1046.5,'sine',.003,.09,.16,1318.5,true);tone(2093,'sine',.002,.02,.08);break; // primary: glass pluck
      case 'tapg':tone(783.99,'sine',.004,.11,.32,null,true);tone(1174.7,'sine',.004,.08,.42,null,true,.06);break; // gold: soft bell pair
      case 'tapl':tone(1480,'sine',.002,.06,.07,880);break; // ghost/chip: water drop
      case 'tapd':tone(440,'sine',.004,.1,.18,330,true);break; // off / delete: low soft
      case 'tapn':noise(1800,.9,'bandpass',.01,.05,.12,4200);tone(659.25,'sine',.004,.07,.2,987.8,true);break; // dock: airy swish + note
      case 'tick':noise(2800+Math.random()*1200,1.4,'bandpass',.001,.35,.03);tone(190,'sine',.001,.09,.03);break;
      case 'bead':tone(880,'sine',.002,.12,.07,620);noise(4200,2,'bandpass',.001,.18,.025);break;
      case 'whoosh':noise(350,.8,'bandpass',.05,.3,.3,2600);break;
      case 'pop':tone(560,'sine',.005,.26,.1,300);break;
      case 'chime':tone(987.8,'sine',.005,.24,.9,null,true);tone(1480,'sine',.005,.18,1.1,null,true,.12);tone(1975.5,'sine',.005,.07,.8,null,true,.24);break;
      case 'ding':tone(1318.5,'sine',.004,.22,.55,null,true);tone(2637,'sine',.004,.05,.3,null,true);break;
      case 'soft':tone(700,'sine',.003,.09,.06,520);break;
      case 'success':tone(784,'sine',.005,.2,.3,null,true);tone(1175,'sine',.005,.2,.5,null,true,.1);break;
      case 'error':tone(220,'sawtooth',.005,.12,.25,140);break;
      case 'save':tone(660,'sine',.004,.16,.12);tone(990,'sine',.004,.14,.18,null,false,.07);break;
      case 'page': // Quran page-turn: paper rustle, sweep, soft thud
        noise(900,.6,'highpass',.02,.22,.14,3500);noise(2400,.9,'bandpass',.06,.3,.34,900,.05);noise(700,.7,'lowpass',.01,.2,.1,300,.3);break;
      case 'reveal':noise(200,.7,'bandpass',.12,.22,.55,3200);tone(220,'sine',.06,.1,.55,880);break;
    }},
  speakDone(){}};
['pointerdown','touchstart','keydown','click'].forEach(ev=>addEventListener(ev,()=>AU.unlock(),{passive:true}));
const sfx=n=>AU.play(n);

/* ---------- VOICE: recorded ElevenLabs clips (no TTS anywhere) ---------- */
const VO={a:null,blobs:{},
  IDS:['wq_Fajr','wq_Dhuhr','wq_Asr','wq_Maghrib','wq_Isha','alert_event','alert_dua','alert_alarm','az_Fajr','az_Dhuhr','az_Asr','az_Maghrib','az_Isha','hz_Fajr','hz_Dhuhr','hz_Asr','hz_Maghrib','hz_Isha','sadqa_ask','sadqa_remind','tilawat_ask','tilawat_remind','azkar_m','azkar_e','taleem','juma','review','task','reminder','call','timer_nudge','timer_start','test','voice_on','gasht','makruh','alert','open_salam','noor_ji','noor_ok','noor_na','jm5_Fajr','jm5_Dhuhr','jm5_Asr','jm5_Maghrib','jm5_Isha','jm5_Juma','open_bism','msj_ask','haiz_end','ob_gender','ob_welcome','ob_lang','ob_loc','ob_maslak','ob_firqa','ob_masjid','ob_notif','ob_target','ob_done'],
  url(id,l){if(String(id).startsWith('dua_'))return 'dua/'+id+'.mp3';return 'voice/'+(l||VL())+'/'+id+'.mp3'},
  /* clips are fetched as blobs (works offline through the service worker cache) */
  async blob(id){const k=S.lang+'/'+id;if(this.blobs[k])return this.blobs[k];const r=await fetch(this.url(id));if(!r.ok)throw new Error('clip');const b=await r.blob();if(b.size<2000)throw new Error('clip');return this.blobs[k]=URL.createObjectURL(b)},
  async say(id){if(!id||typeof id!=='string')return;if(!S.voice&&!id.startsWith('dua_'))return;
    try{this.stop();let u;try{u=await this.blob(id)}catch(e){if(id==='alert')return;u=await this.blob('alert')}
      const au=new Audio(u);this.a=au;let rep=id==='dua_wake'?2:0;au.onended=()=>{if(rep-->0&&this.a===au){setTimeout(()=>{if(this.a===au)au.play().catch(()=>{})},900)}};await au.play()}catch(e){}},
  warm(){if(!navigator.onLine)return;let i=0;const next=()=>{if(i>=this.IDS.length)return;this.blob(this.IDS[i++]).catch(()=>{}).finally(()=>setTimeout(next,150))};next()},
  stop(){try{if(this.a){this.a.pause();this.a=null}}catch(e){}}};

/* ---------- app-icon badge (pending count) ---------- */
function setBadge(n){try{if(navigator.setAppBadge){if(n>0)navigator.setAppBadge(n).catch(()=>{});else navigator.clearAppBadge().catch(()=>{})}}catch(e){}
  const base='Deen Saathi';document.title=n>0?'('+(n>99?'99+':n)+') '+base:base}
const pendingN=()=>unreadN()+(typeof PQ!=='undefined'?PQ.length:0);

/* ---------- notifications ---------- */
let NLOG=store.get('nlog',[]);
const unreadN=()=>NLOG.filter(n=>!n.r).length;
function updBell(){const n=unreadN(),tot=pendingN();const b=$('#bellN');if(b){b.textContent=n>99?'99+':n;b.hidden=!n}setBadge(tot);if(typeof updLogoBadges==='function')updLogoBadges()}
async function notify(title,body,o={}){
  /* o: tag, tab, sub, voice (string/obj, default title+body), silent, q (pending question id) */
  const rec={id:uid(),t:Date.now(),title,body:body||'',tab:o.tab||null,sub:o.sub||null,r:false,k:o.k||'info',imp:o.k==='alert'&&!o.silent};
  NLOG.unshift(rec);NLOG=NLOG.slice(0,150);store.set('nlog',NLOG);updBell();
  if(!document.hidden&&!(typeof LCK!=='undefined'&&LCK.locked)){toast('🔔 '+title+(body?' — '+body.slice(0,60):''),3600);sfx(o.k==='alert'?'chime':'ding')}
  if(S.notif&&'Notification' in window&&Notification.permission==='granted'){
    try{const opt={body:body||'',icon:'icon-192.png',badge:'badge-96.png',tag:o.tag||rec.id,renotify:true,data:{tab:o.tab,sub:o.sub,q:o.q||'',n:pendingN()},actions:o.actions||[]};
      const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();
      if(reg&&reg.showNotification)await reg.showNotification(title,opt);else new Notification(title,opt)}catch(e){}}
  if(!o.silent)VO.say(o.voice||'alert');
  return rec}
async function askNotifPerm(){if(window.AndroidPA){try{window.AndroidPA.requestPerms()}catch(e){}S.notif=false;saveS();return true}
  if(!('Notification' in window)){toast(T('Is browser mein notification support nahi','Notifications not supported here'));return false}
  let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();S.notif=p==='granted';saveS();return S.notif}

/* ---------- tiny helpers used by pages ---------- */
const meter=(p,cls='')=>`<div class="meter ${cls}"><i style="width:${Math.max(0,Math.min(100,p))}%"></i></div>`;
const segHTML=(id,items,cur)=>`<div class="seg" id="${id}" style="--i:${Math.max(0,items.findIndex(x=>x[0]===cur))};--n:${items.length}"><div class="pill"></div>${items.map(x=>`<button data-a="seg" data-id="${id}" data-v="${x[0]}" class="${x[0]===cur?'on':''}">${x[1]}</button>`).join('')}</div>`;
const ICO={office:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',bell:'<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 0 0 4 0"/>',sound:'<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',mute:'<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',theme:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  home:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',biz:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',deen:'<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/>',kaam:'<path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="3"/>',more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  play:'<path d="M7 4.5v15l12-7.5z"/>',pause:'<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',next:'<path d="M6 5v14l9-7zM17 5v14"/>',prev:'<path d="M18 5v14l-9-7zM7 5v14"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>'};
const svg=(n,c='ic')=>`<svg class="${c}" viewBox="0 0 24 24">${ICO[n]||''}</svg>`;

/* press ripple + per-type tap sound */
(function(){const SEL='.btn,.chip,.fch button,.ib,.tile,.stat.tap,.item[data-a],.seg button,.dock button,.hzb button,.keys button,.bmini,.tcat';
  addEventListener('pointerdown',e=>{const el=e.target.closest(SEL);if(!el||el.disabled)return;el.classList.add('pz');
    const off=()=>{el.classList.remove('pz');removeEventListener('pointerup',off);removeEventListener('pointercancel',off)};addEventListener('pointerup',off);addEventListener('pointercancel',off);setTimeout(off,900);
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    const r=el.getBoundingClientRect(),d=Math.max(r.width,r.height)*2.2,s=document.createElement('span');s.className='rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;el.appendChild(s);setTimeout(()=>s.remove(),650);
    const n=el.closest('.dock')?'tapn':el.classList.contains('gold')?'tapg':el.classList.contains('bad')?'tapd':(el.classList.contains('ghost')||el.classList.contains('chip')||el.closest('.fch,.seg,.hzb'))?'tapl':el.classList.contains('btn')?'tap':'tapl';
    try{sfx(n)}catch(_){}},{passive:true})})();

/* Noor / My Assistant — fixes (personal edition):
   • Urdu / Hindi words normalised before understanding (قرآن / क़ुरआन → quran, میں / में → mein …)
   • Tools (Zakat, Roza, Hijri, 99 Names, Qibla) can be opened by voice/typing
   • "aaj kitni namaz padhi" in any script → prayer summary
   • personal-only sections (office/duty/delivery/wallet/business) removed
   • Hayat-us-Sahaba search only for Deobandi; others get hadith search */
if(typeof isDeo!=='function')window.isDeo=()=>true; /* personal app: all Deobandi/dawat features */
const AIN_MAP=[[/قرآن(?:\s*پاک|\s*مجید)?|क़ुरआन|कुरआन|क़ुरान|कुरान/g,'quran'],[/\s(?:میں|में|मे)\s/g,' mein '],[/حدیث|حدیثوں|हदीस/g,'hadees'],
 [/صبر|सब्र/g,'sabr'],[/جنت|जन्नत/g,'jannat'],[/رزق|रिज़्क़|रिज़्क|रिज़क/g,'rizq'],[/تقویٰ|تقوی|तक़वा|तकवा/g,'taqwa'],[/شکر|शुक्र/g,'shukr'],[/توبہ|तौबा/g,'tauba'],[/نماز|नमाज़|नमाज/g,'namaz'],
 [/زکوٰۃ|زکوۃ|زکات|ज़कात|जकात/g,'zakat'],[/روزہ|روزے|रोज़ा|रोजा|रोज़े/g,'roza'],[/قبلہ|क़िबला|किबला/g,'qibla'],[/ہجری|हिजरी/g,'hijri'],[/کھولو|کھولیں|खोलो|खोलें/g,'kholo'],[/سونے سے پہلے|सोने से पहले/g,'sone se pehle'],[/حساب|हिसाब/g,'hisaab'],[/خلاصہ|ख़ुलासा|खुलासा/g,'khulasa'],[/کتنی|कितनी/g,'kitni'],[/پڑھی|پڑھیں|पढ़ी|पढ़ीं/g,'padhi']];
const aiNorm=t=>{let s=' '+String(t||'')+' ';for(const[re,v]of AIN_MAP)s=s.replace(re,v);return s.trim()};
const AI_TOOLS=[[/\b(zakat|zakaat|zakah)\b/,'zakat',()=>T('Zakat calculator','Zakat calculator','زکوٰۃ کیلکولیٹر','ज़कात कैलकुलेटर')],[/\b(roza|roze|sehri|iftar|ramzan)\b.*\b(kholo|calculator|tracker|hisab|hisaab)\b|\b(kholo)\b.*\b(roza|roze)\b/,'roza',()=>T('Roza tracker','Fasting tracker','روزہ ٹریکر','रोज़ा ट्रैकर')],[/\b(hijri|islami tareekh|islamic date)\b.*\b(kholo|calendar|converter)\b/,'hijri',()=>T('Hijri tareekh','Hijri date','ہجری تاریخ','हिजरी तारीख़')],[/\b(99|asma|asmaul|asma ul|allah ke naam)\b/,'asma',()=>T('Allah ke 99 naam','99 Names of Allah','اللہ کے 99 نام','अल्लाह के 99 नाम')],[/\b(qibla|qible|kibla)\b/,'qibla',()=>T('Qibla','Qibla','قبلہ','क़िबला')],[/\b(tools|aala)\b/,'',()=>T('Tools','Tools','ٹولز','टूल्स')]];
{const _n=noor2;noor2=function(raw){const nr=aiNorm(raw);const q=n2Canon(nr);
  for(const[re,v,lb]of (typeof TOOLV!=='undefined'?AI_TOOLS:[]))if(re.test(q)){const tx=T(`${lb()} khol raha hoon.`,`Opening ${lb()}.`,`${lb()} کھول رہا ہوں۔`,`${lb()} खोल रहा हूँ।`);return{text:tx,say:tx,act:{type:'tool',v},go:1}}
  if(/\b(kitni|kitne|kitna|how many)\b.*\bnamaz\b|\bnamaz\b.*\b(kitni|kitne|padhi|padhin|parhi|ada ki)\b/.test(q)&&!/\b(kab|waqt|time)\b/.test(q)){try{const r=noorParse('aaj namaz ki samri');if(r&&r.text)return{text:r.text}}catch(e){}}
  if(/\b(sone se pehle|raat ka hisab|raat ka hisaab|aaj ka hisab|aaj ka hisaab|din ka hisaab|khulasa)\b/.test(q)){return{text:typeof nightText==='function'?nightText():'',act:{type:'night'},go:1}}
  const r=_n(nr);if(r&&r.act&&r.act.type==='ssearch'&&typeof isDeo==='function'&&!isDeo()){r.act={type:'hsearch',q:r.act.q};r.text=T(`Hadees ki kitabon mein "${r.act.q}" dhoondh raha hoon.`,`Searching hadith books for "${r.act.q}".`,`حدیث کی کتابوں میں "${r.act.q}" ڈھونڈ رہا ہوں۔`,`हदीस की किताबों में "${r.act.q}" ढूँढ रहा हूँ।`);r.say=r.text}
  return r}}
{const _d=n2Do;n2Do=function(a){if(a&&a.type==='tool'){TOOLV.v=a.v||'';go('more','tools');return}if(a&&a.type==='night'){go('home','night');return}return _d(a)}}
try{const _w=n2Words;n2Words=function(raw,q){return _w(raw,q).replace(/\b(men|mai|mi|mein|mujhe)\b/g,' ').replace(/\s+/g,' ').trim()}}catch(e){}

/* 🌙 Sone se pehle ka hisaab — har din Isha ke baad (Settings: "Raat ka hisaab" waqt).
   Screen par: aaj ki 5 namazein (jamaat / akele / qaza / likhi nahi), tilawat, sadqa, azkar (+ Deobandi: taleem/gasht).
   Jo cheez likhi nahi gayi, wahin button se update. Awaaz: phone ki Urdu awaaz (TTS) se poora khulasa bola jata hai
   (ginti har din badalti hai, isliye pehle se record ki hui clip mumkin nahi). */
const NT={shown:store.get('night_shown','')};
function nightAt(base=new Date()){const r=atTime(S.review||'22:00',base);try{const t=(TM&&TM.t)||{};const isha=t.Isha?atTime(t.Isha,base):null;if(isha){const m=new Date(isha.getTime()+60*60000);if(m>r)return m}}catch(e){}return r}
function nightData(d=dkey()){const h=HZ[d]||{};const c={j:0,a:0,q:0,n:0};const rows=PRAY.map(p=>{const v=h[p]||'';c[v||'n']++;return[p,v]});
  const az=AZ[d]||{},azn=Object.values(az).reduce((a,b)=>a+(+b||0),0);
  const it=[];
  it.push({k:'tl',ok:tlToday()>=S.tilTarget,txt:T(`Tilawat ${tlToday()}/${S.tilTarget} ayaat`,`Recitation ${tlToday()}/${S.tilTarget} ayahs`,`تلاوت ${tlToday()}/${S.tilTarget} آیات`,`तिलावत ${tlToday()}/${S.tilTarget} आयात`)});
  it.push({k:'sd',ok:sdDone(d),txt:T('Aaj ka sadqa','Today\'s sadaqah','آج کا صدقہ','आज का सदक़ा')});
  it.push({k:'az',ok:azn>0,txt:T(`Azkar / tasbeeh (${azn})`,`Azkar / tasbih (${azn})`,`اذکار / تسبیح (${azn})`,`अज़कार / तस्बीह (${azn})`)});
  try{if(typeof isDeo==='function'&&isDeo()&&typeof mmToday==='function'){const m=mmToday()||{};it.push({k:'tm',ok:!!(m.tm||m.talim),txt:T('Masjid / ghar ki taleem','Taleem','مسجد / گھر کی تعلیم','मस्जिद / घर की तालीम')})}}catch(e){}
  return{rows,c,it}}
function nightSpeech(d=dkey()){const D=nightData(d),c=D.c,en=S.lang==='en';
  const left=D.it.filter(x=>!x.ok);
  if(en){let s=`Today's summary. Prayers: ${c.j} in congregation, ${c.a} alone, ${c.q} missed`+(c.n?`, and ${c.n} not recorded yet`:'')+'. ';
    s+=left.length?'Still remaining: '+left.map(x=>x.txt.replace(/\(.*\)/,'')).join(', ')+'. ':'All small deeds are done, masha Allah. ';
    if(c.n)s+='Please tell me about the prayers you have not recorded, before you sleep. ';
    return s+'Read the sleeping dua, and sleep with wudu if you can.'}
  const nm={Fajr:'فجر',Dhuhr:'ظہر',Asr:'عصر',Maghrib:'مغرب',Isha:'عشاء'};
  let s=`آج کا خلاصہ۔ نمازیں: ${c.j} جماعت سے، ${c.a} اکیلے، ${c.q} قضا`+(c.n?`، اور ${c.n} ابھی لکھی نہیں گئیں: ${D.rows.filter(r=>!r[1]).map(r=>nm[r[0]]).join('، ')}`:'')+'۔ ';
  const L=left.map(x=>({tl:'تلاوت',sd:'صدقہ',az:'اذکار',tm:'تعلیم'}[x.k]));
  s+=L.length?`ابھی باقی ہیں: ${L.join('، ')}۔ `:'ماشاءاللہ، آج کے سارے چھوٹے اعمال ہو گئے۔ ';
  if(c.n)s+='سونے سے پہلے جو نمازیں لکھی نہیں، انہیں اپڈیٹ کر دیں۔ ';
  if(c.q)s+='قضا نمازیں جلد ادا کر لیں۔ ';
  return s+'سونے کی دعا پڑھ لیں، اور ہو سکے تو وضو کر کے سوئیں۔'}
function nightHTML(d=dkey()){const D=nightData(d),c=D.c;
  const lab={j:['✅',T('Jamaat','Jamaat','جماعت','जमाअत')],a:['🕌',T('Akele','Alone','اکیلے','अकेले')],q:['⏳',T('Qaza','Missed','قضا','क़ज़ा')]};
  const rows=D.rows.map(([p,v])=>`<div class="ntr ${v?'':'nt-miss'}"><b>${pname(p)}</b>${v?`<span class="chip ${v==='q'?'warn':'ok'}">${lab[v][0]} ${lab[v][1]}</span><button class="btn s ghost" data-a="ntedit" data-p="${p}">✎</button>`:`<span class="nt-btns">${['j','a','q'].map(k=>`<button class="btn s ${k==='q'?'ghost':''}" data-a="ntset" data-p="${p}" data-v="${k}">${lab[k][0]} ${lab[k][1]}</button>`).join('')}</span>`}</div>`).join('');
  const its=D.it.map(x=>`<div class="ntr"><span>${x.ok?'✅':'⬜'} ${x.txt}</span>${x.ok?'':`<button class="btn s ghost" data-a="ntdo" data-k="${x.k}">${T('Update','Update','اپڈیٹ','अपडेट')}</button>`}</div>`).join('');
  return`<div class="eyebrow">🌙 ${T('SONE SE PEHLE KA HISAAB','BEFORE-SLEEP REVIEW','سونے سے پہلے کا حساب','सोने से पहले का हिसाब')}</div>
  <div class="stats" style="margin:10px 0"><div class="stat"><div class="sv">${c.j}</div><div class="sl">${lab.j[1]}</div></div><div class="stat"><div class="sv">${c.a}</div><div class="sl">${lab.a[1]}</div></div><div class="stat"><div class="sv">${c.q}</div><div class="sl">${lab.q[1]}</div></div><div class="stat"><div class="sv">${c.n}</div><div class="sl">${T('Likhi nahi','Not logged','لکھی نہیں','लिखी नहीं')}</div></div></div>
  ${c.n?`<div class="muted sm" style="margin-bottom:6px">⚠️ ${T('Jo namaz bataana bhool gaye, abhi bata dein — kaise padhi?','Tell us about the prayers you forgot to log — how did you pray?','جو نماز بتانا بھول گئے، ابھی بتا دیں — کیسے پڑھی؟','जो नमाज़ बताना भूल गए, अभी बता दें — कैसे पढ़ी?')}</div>`:''}
  <div class="ntbox">${rows}</div><h3 style="margin:14px 0 6px">${T('Chhote amaal','Small deeds','چھوٹے اعمال','छोटे आमाल')}</h3><div class="ntbox">${its}</div>
  <div class="row mt"><button class="btn gold" data-a="ntsay">🔊 ${T('Sunein','Listen','سنیں','सुनें')}</button><button class="btn ghost" data-a="ntdua">🤲 ${T('Sone ki dua','Sleeping dua','سونے کی دعا','सोने की दुआ')}</button><span class="grow"></span><button class="btn ghost" data-a="ntclose">${T('Band','Close','بند','बंद')}</button></div>`}
function nightOpen(auto){NT.shown=dkey();store.set('night_shown',NT.shown);dlg(nightHTML(),{cls:'ntdlg'});if(auto||S.voice!==false)setTimeout(()=>{try{nightSay()}catch(e){}},500)}
function nightSay(){if(typeof TTS==='undefined')return;if(TTS.on){TTS.stop();return}const t=nightSpeech();TTS.run([{t}],{lang:S.lang==='en'?'en':'ur'})}
A.ntset=b=>{setHz(dkey(),b.dataset.p,b.dataset.v);try{PQ=PQ.filter(q=>!(q.kind==='hazri'&&q.key==='hz-'+dkey()+b.dataset.p));savePQ()}catch(e){}sfx('success');dlg(nightHTML(),{cls:'ntdlg'});refreshHome()};
A.ntedit=b=>{setHz(dkey(),b.dataset.p,'');dlg(nightHTML(),{cls:'ntdlg'})};
A.ntdo=b=>{const k=b.dataset.k;if(typeof TTS!=='undefined')TTS.stop();closeDlg();
  if(k==='tl')askTilAmt();else if(k==='sd')askSadqaAmt();else if(k==='az')go('deen','azkar');else if(k==='tm')go('deen',typeof renderDawat==='function'?'dawat':'khabar')};
A.ntsay=()=>nightSay();A.ntclose=()=>{if(typeof TTS!=='undefined')TTS.stop();closeDlg()};
A.ntdua=()=>{try{VO.say('dua_sleep')}catch(e){}toast('اَللّٰهُمَّ بِاسْمِكَ أَمُوْتُ وَأَحْيَا',5000)};
A.ntopen=()=>nightOpen(false);
/* Home card after Isha (till 4am) */
function nightCard(){const now=new Date(),h=now.getHours();let at;try{at=nightAt()}catch(e){return''}
  if(!(now>=at||h<4))return'';const d=h<4?dkey(addDays(now,-1)):dkey();const c=nightData(d).c;
  return`<div class="card" data-a="ntopen" style="cursor:pointer"><div class="row sp"><b>🌙 ${T('Sone se pehle ka hisaab','Before-sleep review','سونے سے پہلے کا حساب','सोने से पहले का हिसाब')}</b><span class="chip ${c.n?'warn':'ok'}">${c.j+c.a}/5</span></div><div class="muted sm">${c.n?T(`${c.n} namaz likhi nahi — tap karke update karein`,`${c.n} prayers not logged — tap to update`,`${c.n} نماز لکھی نہیں — ٹیپ کر کے اپڈیٹ کریں`,`${c.n} नमाज़ लिखी नहीं — टैप करके अपडेट करें`):T('Aaj ka khulasa dekhein aur sunein','See & hear today\'s summary','آج کا خلاصہ دیکھیں اور سنیں','आज का ख़ुलासा देखें और सुनें')}</div></div>`}
{const _he=homeExtras;homeExtras=function(){return nightCard()+_he.apply(this,arguments)}}
/* open from notification: go('home','night') */
{const _go=go;go=function(t,s){if(t==='home'&&s==='night'){_go('home');setTimeout(()=>nightOpen(true),400);return}return _go.apply(this,arguments)}}
/* auto-open once a day when the app is opened after review time */
function nightAuto(){try{if(!S.obDone||NT.shown===dkey()||$('#dlg').open)return;const now=new Date();if(now>=nightAt()&&now.getHours()<=23)nightOpen(true)}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(nightAuto,1500)});setTimeout(nightAuto,4000);
/* text version for chat (in the chosen script) */
function nightText(d=dkey()){if(S.lang==='ur'||S.lang==='en')return nightSpeech(d);const D=nightData(d),c=D.c;const left=D.it.filter(x=>!x.ok);
  const ro=`Aaj ka khulasa: namaz — ${c.j} jamaat se, ${c.a} akele, ${c.q} qaza`+(c.n?`, ${c.n} abhi likhi nahi (${D.rows.filter(r=>!r[1]).map(r=>pname(r[0])).join(', ')})`:'')+'. '+(left.length?`Abhi baaki: ${left.map(x=>({tl:'tilawat',sd:'sadqa',az:'azkar',tm:'taleem'}[x.k])).join(', ')}. `:'Mashaallah, aaj ke saare chhote amaal ho gaye. ')+(c.n?'Sone se pehle jo namaz likhi nahi, unhe update kar dein.':'');
  return S.lang==='hi'&&typeof DVN==='function'?DVN(ro):ro}

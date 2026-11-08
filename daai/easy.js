/* 👆 AASAAN MODE — kam padhe-likhe bhai-behnon ke liye (mard aur khawateen dono).
   Bade akshar, bade button, home par sirf zaroori cheezein bade tiles mein (tasveer + naam),
   aur har screen par "🔊 Sunein" — jo screen par likha hai woh bol kar sunata hai. Setup mein poochha jata hai. */
const isEasy=()=>!!S.easy;
function ezApply(){document.body.classList.toggle('easy',isEasy())}
(function(){const st=document.createElement('style');st.textContent=`
.easy{font-size:18px}.easy .btn{min-height:50px;font-size:17px}.easy .btn.s{min-height:44px;font-size:15.5px}.easy .sm,.easy .muted.sm{font-size:14.5px!important}
.easy h2{font-size:21px}.easy .ptab .ptr{font-size:17px;padding:10px 4px}.easy .chip{font-size:14px}
.eztiles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.eztile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:118px;border-radius:22px;border:1px solid rgba(212,175,55,.35);background:linear-gradient(160deg,rgba(212,175,55,.14),rgba(0,180,200,.08));font-size:18px;font-weight:700;color:inherit;cursor:pointer;padding:10px;text-align:center}
.eztile .e{font-size:44px;line-height:1}.eztile:active{transform:scale(.97)}
#ezsay{position:fixed;left:14px;bottom:96px;z-index:60;border-radius:28px;padding:12px 16px;font-size:16px;font-weight:700;background:#d4af37;color:#1a1200;border:0;box-shadow:0 6px 18px rgba(0,0,0,.35);display:none}
.easy #ezsay{display:block}`;document.head.appendChild(st);
  const b=document.createElement('button');b.id='ezsay';b.type='button';b.textContent='🔊 '+T('Sunein','Listen','سنیں','सुनें');b.onclick=()=>ezSay();
  const init=()=>{document.body.appendChild(b);ezApply()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
function ezLang(){return S.lang==='en'?'en':S.lang==='ur'?'ur':'hi'}
function ezSay(){try{if(typeof TTS==='undefined')return;if(TTS.on){TTS.stop();return}
  const v=document.getElementById('dlg')&&document.getElementById('dlg').open?document.getElementById('dlg'):document.getElementById('view');if(!v)return;
  const parts=[];v.querySelectorAll('h1,h2,h3,.eyebrow,.pn,.cd,.ptr,.item b,p,.yrl li').forEach(e=>{if(!e.offsetParent)return;let t=(e.innerText||'').replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu,'').replace(/\s+/g,' ').trim();if(t&&t.length>1&&!parts.includes(t))parts.push(t)});
  const txt=parts.join('۔ ').slice(0,1400);if(txt)TTS.run([{t:txt}],{lang:ezLang()})}catch(e){}}
const EZT=()=>[['🕌',T('Namaz','Prayer','نماز','नमाज़'),'deen','namaz'],['📖',T('Quran','Quran','قرآن','क़ुरआन'),'deen','quran'],['📿',T('Tasbeeh aur dua','Tasbih & dua','تسبیح اور دعا','तस्बीह और दुआ'),'deen','azkar'],['🧭',T('Qibla','Qibla','قبلہ','क़िबला'),'tool','qibla'],
  ['🌙',T('Ramzan / Roza','Ramadan / Fasting','رمضان / روزہ','रमज़ान / रोज़ा'),'deen','ramzan'],['📅',T('Saal bhar ke masail','Yearly rulings','سال بھر کے مسائل','साल भर के मसाइल'),'deen','saal'],
  ...(typeof isFem==='function'&&isFem()?[['🧕',T('Khawateen','Women','خواتین','ख़वातीन'),'deen','khawateen']]:[]),['🎙️',T('Bol kar poochhein','Ask by voice','بول کر پوچھیں','बोलकर पूछें'),'more','noor']];
function ezHome(np,h,d){return`<div class="card"><div class="eztiles">${EZT().map(t=>`<button class="eztile" data-a="ezgo" data-t="${t[2]}" data-s="${t[3]}"><span class="e">${t[0]}</span>${t[1]}</button>`).join('')}</div>
  <button class="btn ghost full mt" data-a="ezfull">${T('Poora app dekhein','Show full app','پوری ایپ دیکھیں','पूरा ऐप देखें')}</button></div>`}
A.ezgo=b=>{const t=b.dataset.t,s=b.dataset.s;sfx('tick');if(t==='tool'){TOOLV.v=s;go('more','tools')}else go(t,s)};
A.ezfull=()=>{S.easy=false;saveS();ezApply();rerender();toast(T('Aasaan mode band — Settings se dobara chalu kar sakte hain.','Easy mode off — turn on again in Settings.','آسان موڈ بند — سیٹنگز سے دوبارہ چالو کر سکتے ہیں۔','आसान मोड बंद — सेटिंग्स से दोबारा चालू कर सकते हैं।'),4000)};
{const _rh=renderHome;renderHome=function(el){if(!isEasy())return _rh.apply(this,arguments);const np=typeof nextPrayer==='function'?nextPrayer():null,h=hzToday(),d=dkey();
  el.innerHTML=homeHero(np,h,d)+(typeof pqCard==='function'?pqCard():'')+(typeof prayTable==='function'?prayTable():'')+(typeof fmCard==='function'?fmCard():'')+(typeof yrHomeCard==='function'?yrHomeCard():'')+ezHome(np,h,d)+(typeof newAlertsCard==='function'?newAlertsCard():'');
  try{if(typeof bindHome==='function')bindHome(el)}catch(e){}}}
/* onboarding step */
if(typeof obSteps==='function'){const _os=obSteps;obSteps=function(){const a=_os.apply(this,arguments);
  const s={id:'easy',voice:'',req:false,title:T('App kaisa chahiye?','How should the app look?','ایپ کیسی چاہیے؟','ऐप कैसा चाहिए?'),
   body:T('Aasaan: bade akshar, bade button, sirf zaroori cheezein aur har screen bol kar sunane wala button. Poora: saare features.','Easy: big text, big buttons, only essentials and a read-aloud button. Full: all features.','آسان: بڑے حروف، بڑے بٹن، صرف ضروری چیزیں اور ہر اسکرین بول کر سنانے والا بٹن۔ پورا: سارے فیچر۔','आसान: बड़े अक्षर, बड़े बटन, सिर्फ़ ज़रूरी चीज़ें और हर स्क्रीन बोलकर सुनाने वाला बटन। पूरा: सारे फ़ीचर।'),
   box:()=>`<div class="obopts big2"><button class="obopt ${S.easy?'on':''}" data-ez="1"><span style="font-size:34px">👆</span><br>${T('Aasaan','Easy','آسان','आसान')}</button><button class="obopt ${S.easy===false?'on':''}" data-ez="0"><span style="font-size:34px">🧩</span><br>${T('Poora','Full','پورا','पूरा')}</button></div>`,
   bind:b=>$$('[data-ez]',b).forEach(x=>x.onclick=()=>{S.easy=x.dataset.ez==='1';saveS();ezApply();$$('[data-ez]',b).forEach(y=>y.classList.toggle('on',y===x));obRefresh()}),ok:()=>true};
  const i=a.findIndex(x=>x.id==='gender');a.splice(i>=0?i+1:2,0,s);return a}}
{const _set=A.set;A.set=function(el){const r=_set.apply(this,arguments);if(el&&el.dataset&&el.dataset.p==='easy'){ezApply();rerender()}return r}}

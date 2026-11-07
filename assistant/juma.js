'use strict';
/* ===== Juma ke khaas amaal aur azkar (Friday checklist + durood counter) ===== */
const JUMA=[
 {id:'ghusl',u:'غسل کرنا',i:'🚿',t:['Ghusl karna','Take a bath (ghusl)'],r:'Bukhari 877'},
 {id:'saaf',u:'مسواک، صاف/اچھے کپڑے، خوشبو',i:'👕',t:['Miswak, saaf/achhe kapde, khushbu','Miswak, clean clothes, perfume'],r:'Bukhari 880'},
 {id:'kahf',u:'سورۂ کہف پڑھنا (جمعرات مغرب سے جمعہ مغرب تک)',i:'📖',t:['Surah Kahf padhna (Jumerat Maghrib se Juma Maghrib tak)','Recite Surah Al-Kahf'],r:'Mustadrak Hakim 3392',kahf:1},
 {id:'jaldi',u:'جلدی مسجد جانا — پہلی گھڑی کا بڑا ثواب',i:'🕌',t:['Jaldi masjid jaana — pehli ghadi ka bada sawab','Go early to the masjid'],r:'Bukhari 881'},
 {id:'paidal',u:'پیدل جانا، امام کے قریب بیٹھنا',i:'🚶',t:['Paidal jaana, imam ke qareeb baithna','Walk, sit close to the imam'],r:'Abu Dawud 345'},
 {id:'khutba',u:'خطبہ خاموشی سے سننا، گردنیں نہ پھلانگنا',i:'🤫',t:['Khutba khamoshi se sunna, gardanein na phalaangna','Listen to the khutbah silently'],r:'Bukhari 934'},
 {id:'sunnat',u:'جمعہ کے بعد سنتیں (4 رکعت)',i:'🧎',t:['Juma ke baad sunnatein (4 rakat)','Sunnah prayers after Jumuah'],r:'Muslim 881'},
 {id:'durood',u:'درود کی کثرت',i:'🌹',t:['Durood ki kasrat','Abundant durood'],r:'Abu Dawud 1047',dur:1},
 {id:'dua',u:'عصر سے مغرب — قبولیت کی گھڑی میں دعا',i:'🤲',t:['Asr se Maghrib — qabooliyat ki ghadi mein dua','Dua between Asr and Maghrib'],r:'Abu Dawud 1048'},
 {id:'sadqa',u:'صدقہ / کسی کی مدد',i:'💝',t:['Sadqa / kisi ki madad','Charity / help someone'],r:''}];
const jmKey=()=>{const d=new Date();const day=d.getDay();const f=new Date(d);f.setDate(d.getDate()+((5-day+7)%7)-(day===6?7:0));return dkey(f)};
let JMK=store.get('juma_ck',{});const saveJMK=()=>store.set('juma_ck',JMK);
const jmCur=()=>JMK[jmKey()]||(JMK[jmKey()]={c:{},d:0});
function jumaCard(home){const C=jmCur(),done=JUMA.filter(x=>C.c[x.id]).length,isFri=new Date().getDay()===5;
  if(home&&!(isFri||(new Date().getDay()===4&&new Date().getHours()>=17)))return'';
  return`<div class="card hero"><div class="row sp"><h2 style="margin:0">🕌 ${T('Juma ke khaas amaal','Jumuah special deeds')}</h2><span class="chip ${done===JUMA.length?'ok':'gold'}">${done}/${JUMA.length}</span></div>
   <p class="muted sm" style="margin:6px 0 8px">${isFri?T('Aaj Juma hai — Juma Mubarak! 🌙','Jumuah Mubarak! 🌙'):T('Agla Juma: ','Next Jumuah: ')+new Date(jmKey()+'T00:00').toLocaleDateString(LOC(),{day:'numeric',month:'short'})}</p>
   ${JUMA.map(x=>`<div class="item"><input type="checkbox" class="ck" data-a="jmck" data-id="${x.id}" ${C.c[x.id]?'checked':''}><div class="t"><b style="${C.c[x.id]?'opacity:.6':''}">${x.i} ${T(x.t[0],x.t[1],x.u)}</b>${x.r?`<div class="muted sm">${refL(x.r)}</div>`:''}
     ${x.kahf?`<button class="btn s gold mt" data-a="jmkahf">📖 ${T('Surah Kahf kholein','Open Surah Kahf')}</button>`:''}
     ${x.dur?`<div class="q-ar one" style="font-size:22px;line-height:2.2;text-align:center">اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰۤى اٰلِ مُحَمَّدٍ</div><div class="row sp"><span class="chip gold" style="font-size:15px">${C.d} ${T('baar','times')}</span><span class="row" style="gap:6px"><button class="btn s" data-a="jmdur" data-n="1">+1</button><button class="btn s gold" data-a="jmdur" data-n="10">+10</button><button class="btn s ghost" data-a="jmdur" data-n="0">↺</button></span></div>`:''}</div></div>`).join('')}
   <p class="muted sm" style="margin-top:6px">${T('Hawale mashhoor kutub se hain; tafseel ke liye ulama se rujoo karein.','References are from well-known collections; consult scholars for details.')}</p></div>`}
AX.jmck=el=>{const C=jmCur();C.c[el.dataset.id]=!!el.checked;saveJMK();sfx(el.checked?'success':'tick');rerender()};
AX.jmdur=el=>{const C=jmCur(),n=+el.dataset.n;C.d=n?C.d+n:0;if(C.d>=100&&!C.c.durood){C.c.durood=true;toast(T('Masha\'Allah — 100 durood ✅','100 durood ✅'))}saveJMK();sfx('bead');rerender()};
AX.jmkahf=()=>{go('deen','quran');setTimeout(()=>{try{openSurah(18,1)}catch(e){}},300)};
function jmaEvents(base){const out=[],dw=base.getDay();
  if(dw===4)out.push({k:'jm_kahf',at:atTime('19:30',base),voice:'juma',title:T('🕌 Kal Juma hai','🕌 Jumuah tomorrow'),body:T('Surah Kahf aaj Maghrib ke baad se padh sakte hain. Durood ki kasrat karein.','You can recite Surah Kahf from tonight. Send abundant durood.'),tab:'deen',sub:'azkar'});
  if(dw===5){out.push({k:'jm_dua',at:atTime('16:45',base),voice:'juma',title:T('🤲 Qabooliyat ki ghadi','🤲 Hour of acceptance'),body:T('Juma ko Asr se Maghrib tak dua qubool hone ki ghadi hai — dua aur durood karein.','Between Asr and Maghrib on Friday — make dua.'),tab:'deen',sub:'azkar'});
    const C=JMK[dkey(base)];if(!(C&&C.c&&C.c.kahf))out.push({k:'jm_kahf2',at:atTime('14:30',base),voice:'juma',title:T('📖 Surah Kahf padhi?','📖 Read Surah Kahf?'),body:T('Aaj Juma hai — Surah Kahf Maghrib se pehle padh lein.','Read Surah Kahf before Maghrib.'),tab:'deen',sub:'azkar'})}
  return out}
/* show on Azkar page always; on Home on Thursday evening and Friday */
try{const _ra=renderAzkar;renderAzkar=function(el){_ra(el);el.insertAdjacentHTML(new Date().getDay()===5?'afterbegin':'beforeend',jumaCard())}}catch(e){}

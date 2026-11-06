'use strict';
/* ===== App lock: own PIN + phone fingerprint / screen-lock (APK). Hides the app on open and when you come back to it. ===== */
const LCK={locked:false,busy:false,secOk:false,hid:0,pin:'',until:0,after:null};
const lkOn=()=>!!(S.lock&&S.lock.on&&S.lock.hash);
async function lkHash(pin,salt){const s=salt+':'+pin;
  try{if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return'h'+[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}}catch(e){}
  let h=5381;for(let i=0;i<30000;i++){h=((h<<5)+h+s.charCodeAt(i%s.length)+i)|0}return'd'+(h>>>0).toString(16)}
const lkRand=n=>{let o='';const a=new Uint32Array(n);(window.crypto||{getRandomValues:x=>x.forEach((_,i)=>x[i]=Math.random()*4e9)}).getRandomValues(a);a.forEach(v=>o+=v%10);return o};
const lkConf=(tab,sub)=>tab==='biz'||(tab==='kaam'&&sub==='paisa')||(tab==='more'&&(sub==='set'||sub==='settings'));
/* screenshots allowed everywhere; only the PIN screen and confidential sections (wallet etc.) go black */
let _lkSec=null;function lkSecure(){try{const sub=curSub[curTab]||(SUBS[curTab]||[[0]])[0][0],on=!!(LCK.locked||(curTab==='kaam'&&sub==='wallet'));if(on===_lkSec)return;_lkSec=on;if(window.AndroidPA&&AndroidPA.setSecure)AndroidPA.setSecure(on)}catch(e){}}
function lkDots(){const n=S.lock.len||4;return Array.from({length:n},(_,i)=>`<i class="${i<LCK.pin.length?'on':''}"></i>`).join('')}
function lkShow(after){if(LCK.locked){LCK.after=after||LCK.after;return}LCK.locked=true;lkSecure();LCK.pin='';LCK.after=after||null;
  try{const d=$('#dlg');if(d&&d.open)d.close()}catch(e){}
  let el=document.getElementById('lockdlg');if(!el){el=document.createElement('dialog');el.id='lockdlg';el.addEventListener('cancel',e=>e.preventDefault());document.body.appendChild(el)}
  const native=!!window.AndroidPA;
  el.innerHTML=`<div class="lkw"><div class="lkic">🔒</div><h2>${T('Arsalan PA locked hai','Arsalan PA is locked','ارسلان پی اے لاک ہے','अरसलान PA लॉक है')}</h2><div class="muted sm" id="lkmsg">${T('PIN daalein','Enter your PIN','پن ڈالیں','PIN डालें')}</div><div class="lkd" id="lkdots">${lkDots()}</div>
  <div class="lkp">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}">${n}</button>`).join('')}<button data-k="bio" ${native&&S.lock.bio?'':'class="ghost" disabled'}>👆</button><button data-k="0">0</button><button data-k="del">⌫</button></div>
  <button class="btn s ghost" id="lkforgot">${T('PIN bhool gaye?','Forgot PIN?','پن بھول گئے؟','PIN भूल गए?')}</button></div>`;
  el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='lkforgot')return lkForgot();const k=b.dataset.k;if(!k)return;if(k==='del'){LCK.pin=LCK.pin.slice(0,-1)}else if(k==='bio'){lkBio();return}else if(LCK.pin.length<(S.lock.len||4)){LCK.pin+=k}
    $('#lkdots').innerHTML=lkDots();if(LCK.pin.length>=(S.lock.len||4))lkCheck()};
  if(!el.open)el.showModal();
  if(native&&S.lock.bio)setTimeout(lkBio,350)}
async function lkCheck(){const m=$('#lkmsg');if(Date.now()<LCK.until){m.textContent=T('Thoda ruk kar koshish karein','Wait a moment');LCK.pin='';$('#lkdots').innerHTML=lkDots();return}
  const h=await lkHash(LCK.pin,S.lock.salt);
  if(h===S.lock.hash){S.lock.tries=0;saveS();lkOk()}
  else{S.lock.tries=(S.lock.tries||0)+1;saveS();LCK.pin='';const d=$('#lkdots');d.classList.add('bad');setTimeout(()=>{d.classList.remove('bad');d.innerHTML=lkDots()},450);
    if(S.lock.tries%5===0){LCK.until=Date.now()+30000;m.textContent=T('5 galat PIN — 30 second ruko','5 wrong PINs — wait 30 s')}else m.textContent=T('Galat PIN','Wrong PIN');try{navigator.vibrate&&navigator.vibrate(120)}catch(e){}}}
function lkOk(){LCK.locked=false;lkSecure();LCK.secOk=true;LCK.pin='';LCK.hid=0;const el=document.getElementById('lockdlg');if(el&&el.open)el.close();const cb=LCK.after;LCK.after=null;if(typeof cb==='function')cb();else rerender()}
function lkBio(){if(!window.AndroidPA||!AndroidPA.unlock)return;LCK.busy=true;let r='';try{r=AndroidPA.unlock()}catch(e){r='err'}
  if(r==='nosecure'){LCK.busy=false;toast(T('Phone mein screen lock (PIN/fingerprint) laga hua nahi hai — phone Settings mein lagayein','Set a phone screen lock first'))}else if(r!=='ok'){LCK.busy=false}}
window.lkResult=ok=>{LCK.busy=false;LCK.hid=0;if(ok)lkOk()};
function lkForgot(){const el=document.getElementById('lockdlg');
  el.innerHTML=`<div class="lkw"><div class="lkic">🔑</div><h2>${T('Recovery code','Recovery code','ریکوری کوڈ','रिकवरी कोड')}</h2><p class="muted sm">${T('PIN lagate waqt jo 8 ank ka code dikhaya tha, woh daalein. Lock hat jayega, phir naya PIN laga sakte hain.','Enter the 8-digit code shown when you set the PIN. The lock will be removed; you can set a new PIN.','PIN لگاتے وقت جو ۸ ہندسوں کا کوڈ دکھایا گیا تھا وہ ڈالیں۔','PIN लगाते वक़्त जो 8 अंक का कोड दिखाया था वह डालें।')}</p><input id="lkrc" inputmode="numeric" autocomplete="off" placeholder="00000000" style="text-align:center;letter-spacing:4px"><div class="row mt"><button class="btn ghost grow" id="lkrb">←</button><button class="btn grow" id="lkro">OK</button></div></div>`;
  $('#lkrb').onclick=()=>{LCK.locked=false;el.close();lkShow(LCK.after)};
  $('#lkro').onclick=async()=>{const h=await lkHash($('#lkrc').value.trim(),S.lock.salt+'rc');if(h===S.lock.rc){S.lock.on=false;S.lock.hash='';S.lock.rc='';saveS();lkSecure();LCK.locked=false;LCK.secOk=true;el.close();toast(T('Lock hata diya ✅','Lock removed ✅'));rerender()}else toast(T('Code galat','Wrong code'))}}
/* leaving / returning to the app */
window.lkHide=()=>{if(!LCK.busy)LCK.hid=Date.now()};
window.lkBack=()=>{if(!lkOn()||LCK.busy||!LCK.hid)return;const away=Date.now()-LCK.hid;LCK.hid=0;if(away>=(S.lock.after||0)*60000){LCK.secOk=false;if(S.lock.mode!=='sec')lkShow();else if(lkConf(curTab,curSub[curTab]))lkShow()}};
document.addEventListener('visibilitychange',()=>{document.hidden?lkHide():lkBack()});
function lkGuard(tab,sub){if(!lkOn()||S.lock.mode!=='sec'||LCK.secOk||!lkConf(tab,sub||curSub[tab]))return false;lkShow(()=>go(tab,sub));return true}
function lkInit(){lkSecure();if(lkOn()&&S.lock.mode!=='sec')lkShow();else if(lkOn()&&lkConf(curTab,curSub[curTab]))lkShow(()=>rerender())}
/* ---------- settings UI ---------- */
function lockSetHTML(){const L=S.lock,on=lkOn();
  return(on?`<div class="fs"><span>🔒 ${T('Lock chalu hai','Lock is ON')}</span><button class="btn s ghost" data-a="lkoff">${T('Band karein','Turn off')}</button></div>
  <label>${T('Kya lock hoga','What is locked')}</label><select data-a="lkmode"><option value="all"${L.mode!=='sec'?' selected':''}>${T('Poori app','Whole app')}</option><option value="sec"${L.mode==='sec'?' selected':''}>${T('Sirf Kaarobar, Paisa aur Settings','Only Business, Money & Settings')}</option></select>
  <label>${T('Dobara kab poochhe (app chhodne ke baad)','Ask again after leaving the app')}</label><select data-a="lkafter">${[[0,T('Turant','Immediately')],[1,'1 min'],[5,'5 min'],[30,'30 min']].map(x=>`<option value="${x[0]}"${+L.after===x[0]?' selected':''}>${x[1]}</option>`).join('')}</select>
  ${window.AndroidPA?`<div class="fs"><span>👆 ${T('Fingerprint / phone ka screen-lock','Fingerprint / phone screen lock')}</span><input type="checkbox" class="sw" data-a="lkbio" ${L.bio?'checked':''}></div>`:''}
  <button class="btn s ghost" data-a="lkset">${T('PIN badlein','Change PIN')}</button>`:`<p class="muted sm">${T('4 se 6 ank ka PIN lagayein. Phir app kholne par PIN (ya fingerprint) poochhega, aur recent-apps mein screen chhupi rahegi.','Set a 4–6 digit PIN. The app will ask for it (or fingerprint) on open, and the recent-apps preview is hidden.')}</p><button class="btn gold" data-a="lkset">🔒 ${T('PIN lagayein','Set PIN')}</button>`)}
function lkSetForm(){const ask=(onOk)=>form(T('Naya PIN (4–6 ank)','New PIN (4–6 digits)'),[{k:'a',l:'PIN',t:'password',m:'numeric'},{k:'b',l:T('Dobara PIN','Repeat PIN'),t:'password',m:'numeric'}],async o=>{if(!/^\d{4,6}$/.test(o.a)){toast(T('4 se 6 ank hi','4–6 digits only'));return false}if(o.a!==o.b){toast(T('Dono PIN alag hain','PINs do not match'));return false}await onOk(o.a)},{ok:T('Lagayein','Set')});
  const apply=async pin=>{const salt=lkRand(8),rc=lkRand(8);S.lock.salt=salt;S.lock.len=pin.length;S.lock.hash=await lkHash(pin,salt);S.lock.rc=await lkHash(rc,salt+'rc');S.lock.on=true;S.lock.tries=0;saveS();lkSecure();LCK.secOk=true;
    setTimeout(()=>dlg(`<h2 class="h2">🔑 ${T('Recovery code — kaghaz par likh lein','Recovery code — write it down')}</h2><p style="font-size:30px;letter-spacing:6px;text-align:center;font-weight:700">${rc}</p><p class="muted sm">${T('PIN bhool gaye to sirf yahi code kaam aayega. Ye dobara nahi dikhega.','If you forget the PIN, only this code helps. It will not be shown again.')}</p><button class="btn mt" style="width:100%" data-a="closedlg">${T('Likh liya','I wrote it')}</button>`),200)};
  if(lkOn())form(T('Purana PIN','Current PIN'),[{k:'p',l:'PIN',t:'password',m:'numeric'}],async o=>{if(await lkHash(o.p,S.lock.salt)!==S.lock.hash){toast(T('Galat PIN','Wrong PIN'));return false}setTimeout(()=>ask(apply),150)},{ok:'OK'});else ask(apply)}
AX.lkset=()=>lkSetForm();
AX.lkoff=()=>form(T('Lock band karne ke liye PIN','PIN to turn the lock off'),[{k:'p',l:'PIN',t:'password',m:'numeric'}],async o=>{if(await lkHash(o.p,S.lock.salt)!==S.lock.hash){toast(T('Galat PIN','Wrong PIN'));return false}S.lock.on=false;S.lock.hash='';S.lock.rc='';saveS();lkSecure();toast(T('Lock band ✅','Lock off ✅'));rerender()},{ok:T('Band karein','Turn off')});
AX.lkmode=el=>{S.lock.mode=el.value;saveS();LCK.secOk=true};
AX.lkafter=el=>{S.lock.after=+el.value;saveS()};
AX.lkbio=el=>{S.lock.bio=el.checked;saveS()};

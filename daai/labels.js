/* 🏷️ Har button ka naam: jin buttons par sirf nishaan (✕ ↻ ＋ ← → ✓ 🗑 ✏️ …) ya icon hai, unke saath chhota sa naam
   apne aap lag jata hai — taaki har shakhs aasani se samajh sake. Header ke icons ke neeche bhi naam. */
const BL_A={ // data-a → naam
  tutvid:()=>T('Video','Video','ویڈیو','वीडियो'),tourx:()=>T('Band','Close','بند','बंद'),dictate:()=>T('Bolein','Speak','بولیں','बोलें'),aiclear:()=>T('Saaf','Clear','صاف','साफ़'),
  rdel:()=>T('Hatayein','Delete','ہٹائیں','हटाएँ'),favdel:()=>T('Hatayein','Delete','ہٹائیں','हटाएँ'),favedit:()=>T('Waqt','Time','وقت','वक़्त'),salpaid:()=>T('Mil gayi','Received','مل گئی','मिल गई'),saledit:()=>T('Badlein','Edit','بدلیں','बदलें'),
  newsr:()=>T('Taaza','Refresh','تازہ','ताज़ा'),inboxsync:()=>T('Taaza','Refresh','تازہ','ताज़ा'),tiprf:()=>T('Nayi tip','New tip','نئی ٹپ','नई टिप'),warngo:()=>T('Dekhein','Open','دیکھیں','देखें'),
  dawatadd:()=>T('Likhein','Add','لکھیں','लिखें'),cevadd:()=>T('Naya','Add','نیا','नया'),pexadd:()=>T('Naya kharch','Add','نیا خرچ','नया ख़र्च'),appadd:()=>T('Naya','Add','نیا','नया'),linkadd:()=>T('Naya link','Add link','نیا لنک','नया लिंक'),
  ntedit:()=>T('Badlein','Edit','بدلیں','बदलें'),yrback:()=>T('Wapas','Back','واپس','वापस')};
const BL_S=[[/^[✕✖×]$/,()=>T('Band','Close','بند','बंद')],[/^[↻⟳🔄]$/,()=>T('Taaza','Refresh','تازہ','ताज़ा')],[/^[↺]$/,()=>T('Dobara','Reset','دوبارہ','दोबारा')],[/^[＋+]$/,()=>T('Naya','Add','نیا','नया')],
  [/^[←‹◀]$/,()=>T('Pichla','Previous','پچھلا','पिछला')],[/^[→›▶]$/,()=>T('Agla','Next','اگلا','अगला')],[/^[✓✔]$/,()=>T('Ho gaya','Done','ہو گیا','हो गया')],[/^[−–-]$/,()=>T('Kam','Less','کم','कम')],
  [/^(✎|✏️?)$/,()=>T('Badlein','Edit','بدلیں','बदलें')],[/^🗑️?$/,()=>T('Hatayein','Delete','ہٹائیں','हटाएँ')],[/^🔊$/,()=>T('Sunein','Listen','سنیں','सुनें')],[/^⏸$/,()=>T('Roken','Pause','روکیں','रोकें')],[/^📋$/,()=>T('Copy','Copy','کاپی','कॉपी')],[/^📤$/,()=>T('Share','Share','شیئر','शेयर')]];
const BL_SKIP=new Set(['wkey','qfont','tlplus','dvq','hub','kroff','doff']);
function blLabel(b){const a=b.dataset.a||'';if(BL_SKIP.has(a))return'';const t=(b.innerText||'').trim();if(/\p{L}{2,}/u.test(t))return'';
  if(/\d/.test(t)&&!/^[−–-]$/.test(t))return''; // +1, +30m jaise number khud samajh aate hain
  if(BL_A[a])return BL_A[a]();for(const[r,f]of BL_S)if(r.test(t))return f();return''}
function blRun(root){try{(root||document).querySelectorAll('#view button,#view [data-a]:not(input):not(select):not(div):not(label),#dlg button').forEach(b=>{if(b.dataset.bl)return;const l=blLabel(b);b.dataset.bl=1;if(!l)return;
  const s=document.createElement('span');s.className='bln';s.textContent=l;b.appendChild(s);b.classList.add('blb');if(!b.title)b.title=l})}catch(e){}}
function blHead(){const M={bLang:()=>T('Zabaan','Language','زبان','ज़बान'),bSnd:()=>T('Awaaz','Sound','آواز','आवाज़'),bTheme:()=>T('Rang','Theme','رنگ','रंग'),bBell:()=>T('Alerts','Alerts','الرٹ','अलर्ट')};
  Object.keys(M).forEach(id=>{const b=document.getElementById(id);if(!b)return;b.classList.add('ibl');b.dataset.l=M[id]();b.title=M[id]()})}
(function(){const st=document.createElement('style');st.textContent=`.blb{gap:4px}.blb .bln{font-size:11px;font-weight:600;opacity:.9;margin-inline-start:3px;white-space:nowrap}
.ib.ibl{overflow:visible;margin-bottom:12px}.ib.ibl::after{content:attr(data-l);position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:2px;font:600 9.5px/1.1 var(--f-ui,system-ui);color:var(--muted,#aaa);white-space:nowrap;pointer-events:none}`;document.head.appendChild(st);
  const go1=()=>{blHead();blRun()};const mo=new MutationObserver(()=>{clearTimeout(go1.t);go1.t=setTimeout(go1,60)});
  const init=()=>{const v=document.getElementById('view');if(v)mo.observe(v,{childList:true,subtree:true});const d=document.getElementById('dlg');if(d)mo.observe(d,{childList:true,subtree:true});go1()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  {const _sl=window.setLang;if(typeof _sl==='function')window.setLang=function(){const r=_sl.apply(this,arguments);setTimeout(blHead,50);return r}}
  setInterval(blHead,5000)})();

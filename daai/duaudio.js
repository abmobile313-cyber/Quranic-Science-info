/* 🔊 Har Arabi dua / kalime ke saath "Sunein" button — awaaz ElevenLabs se pehle se bani hui (dua/ar/<id>.mp3), offline chalti hai. */
const DUA_IDS=new Set(['9f5ad4d1','e56125bf','791da391','a42f3ddb','d0608e08','3c16f04d','39fafe11','b509b113','d40e5243','744d0001','d6801a32','7e95f2d2','1eb1d2c1','177074a6','0973e66f','fed5fad3','16390e85','9df0e1ac','d9a6c145','6d728965','9c5a3527','f4a77785','ce6d03d8','bd15b49c','e1e21338','ccb49ce4','707bbab8','72ed08ea','0eaf7354','5e1203de','8eccc1b0','eb58a2f9','b4a7ee75','abf87842','51ec2ef5','a980fb18','79674274','16a251ca','f79998cc','0d330c33']);
function duaKey(t){const s=String(t||'').replace(/\s+/g,'');let x=5381;for(const ch of s){x=(Math.imul(x,33)^ch.codePointAt(0))>>>0}return x.toString(16).padStart(8,'0')}
const DA={a:null,btn:null};
function duaStop(){try{if(DA.a){DA.a.pause();DA.a=null}}catch(e){}if(DA.btn){DA.btn.classList.remove('on');DA.btn.innerHTML=duaBtnTxt(false);DA.btn=null}}
function duaBtnTxt(on){return on?'⏸ '+T('Rokein','Stop','روکیں','रोकें'):'🔊 '+T('Sunein','Listen','سنیں','सुनें')}
function duaPlay(k,b){if(DA.btn===b){duaStop();return}duaStop();try{if(typeof TTS!=='undefined'&&TTS.on)TTS.stop()}catch(e){}
  const a=new Audio('dua/ar/'+k+'.mp3');DA.a=a;DA.btn=b;b.classList.add('on');b.innerHTML=duaBtnTxt(true);a.onended=duaStop;a.onerror=()=>{duaStop();toast(T('Awaaz nahi chal saki','Could not play audio','آواز نہیں چل سکی','आवाज़ नहीं चल सकी'))};a.play().catch(()=>duaStop())}
function duaScan(root){(root||document).querySelectorAll('.yrar,.dua').forEach(el=>{if(el.dataset.dk)return;const k=duaKey(el.textContent);el.dataset.dk=k;if(!DUA_IDS.has(k))return;
  const b=document.createElement('button');b.type='button';b.className='btn s ghost duab';b.innerHTML=duaBtnTxt(false);b.onclick=e=>{e.stopPropagation();duaPlay(k,b)};el.insertAdjacentElement('afterend',b)})}
(function(){const st=document.createElement('style');st.textContent='.duab{display:flex;margin:6px auto 4px;min-height:36px;padding:0 16px;gap:6px;border-color:rgba(212,175,55,.5)!important}.duab.on{background:rgba(212,175,55,.25)!important}';document.head.appendChild(st);
  let t=null;const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>duaScan(document),60)});
  const init=()=>{mo.observe(document.body,{childList:true,subtree:true});duaScan(document)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
if(typeof go==='function'){const _g=go;go=function(){duaStop();return _g.apply(this,arguments)}}

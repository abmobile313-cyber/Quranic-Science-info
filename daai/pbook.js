'use strict';
/* ===== Original-page book reader (pdf.js) — Fazail-e-Amaal shown exactly as printed (Nastaleeq), page by page like Hayatus Sahaba ===== */
const PBK=[{id:'fa1',t:'Fazail-e-Amaal',u:'فضائلِ اعمال',src:'books/pdf/fazail-amaal.pdf',toc:[
  ['📑 فہرست','Fehrist',3],['حکایاتِ صحابہؓ','Hikayat-e-Sahaba',22],['فضائلِ قرآن','Fazail-e-Quran',264],['فضائلِ نماز','Fazail-e-Namaz',362],
  ['نماز کی فضیلت (فصل اول)','Namaz ki fazilat',366],['نماز چھوڑنے پر وعید (فصل دوم)','Namaz chhorne par waeed',391],['جماعت کے فضائل','Jamaat ke fazail',415],['جماعت چھوڑنے پر عتاب','Jamaat chhorne par itab',428],['خشوع و خضوع کا بیان','Khushu o khuzu',433],
  ['فضائلِ ذکر','Fazail-e-Zikr',474],['ذکر — باب اول','Zikr baab 1',477],['ذکر — باب دوم (کلمہ طیبہ)','Zikr baab 2',550],['ذکر — باب سوم (تسبیحات)','Zikr baab 3',626],
  ['فضائلِ تبلیغ','Fazail-e-Tabligh',711],['فضائلِ رمضان','Fazail-e-Ramazan',753],['رمضان کی فضیلت (فصل اول)','Ramazan ki fazilat',755],['شبِ قدر کا بیان','Shab-e-Qadr',795],['اعتکاف کا بیان','Etikaf',815],
  ['مسلمانوں کی موجودہ پستی کا واحد علاج','Musalmanon ki pasti ka ilaj',831],['تبلیغ کے آداب','Tabligh ke adaab',859],['مصادر و مآخذ','Masadir',880]]},
 {id:'fa2',t:'Fazail-e-Sadaqaat',u:'فضائلِ صدقات',src:'books/dl/fazail-sadaqat.pdf',dl:'https://archive.org/download/fazail-e-sadaqat/'+encodeURIComponent('فضائلِ صدقات — Fazail e Sadaqat-_text.pdf'),mb:26,cx:.02,cy:.02,ia:'fazail-e-sadaqat',toc:[]},
 {id:'mu',t:'Muntakhab Ahadees',u:'منتخب احادیث',src:'books/dl/muntakhab-ahadees.pdf',dl:'https://archive.org/download/muntakhab_ahadees_urdu/'+encodeURIComponent('Muntakhab Ahadees by Maulana Muhammad Yousuf Kandhlavi.pdf'),mb:21,cx:.02,cy:.02,ia:'muntakhab_ahadees_urdu',toc:[]}];
const PBDL={};
window.bkDlP=(id,p,got,st)=>{PBDL[id]={p,got,st};const bar=document.getElementById('pbdlb');if(bar&&PB.id===id){if(st==='ok'){toast(T('Kitab download ho gayi ✅ — ab internet ke bina bhi khulegi','Downloaded ✅ — works offline now'));PB.doc=null;rerender();return}if(st==='err'){rerender();return}bar.style.width=Math.max(2,p)+'%';const t=document.getElementById('pbdlt');if(t)t.textContent=(p>=0?p+'% • ':'')+(got/1048576).toFixed(1)+' MB'}};
const pbHave=b=>!b.dl||(window.AndroidPA&&AndroidPA.bookHas&&AndroidPA.bookHas(b.src.replace(/^books\/dl\//,'books/dl/')));
function pbDlCard(b){const d=PBDL[b.id];const busy=d&&d.st!=='err'&&d.st!=='ok'&&d.p!==-1;
  if(!window.AndroidPA||!AndroidPA.bookDl)return`<div class="card c"><h2>${b.u}</h2><p class="muted">${T('Website par yeh kitab archive.org ke viewer mein khulti hai.','On the website this book opens in the archive.org viewer.')}</p><button class="btn gold" data-a="pbia" data-v="${b.id}">📖 ${T('Kholein','Open')}</button></div>`;
  return`<div class="card c"><div style="font:700 26px/1.6 Mehr,Naskh,serif">${b.u}</div><p class="muted">${T(`Pehli baar ek dafa download karni hogi (${b.mb} MB). Uske baad internet ke bina bhi app mein page-by-page khulegi — Fazail-e-Amaal ki tarah.`,`Download once (${b.mb} MB), then read offline page by page.`)}</p>
   ${busy?`<div style="height:12px;border-radius:8px;background:rgba(255,255,255,.12);overflow:hidden;margin:10px 0"><div id="pbdlb" style="height:100%;width:${Math.max(2,d.p||2)}%;background:linear-gradient(90deg,#e0b24a,#06b6d4);transition:width .3s"></div></div><div class="muted sm" id="pbdlt">${T('Download ho rahi hai…','Downloading…')}</div>`
   :`${d&&d.st==='err'?`<div class="warnbox">${T('Download ruk gaya — internet check karke dobara dabayein.','Download failed — check internet and retry.')}</div>`:''}<button class="btn gold" data-a="pbdl" data-v="${b.id}">⬇️ ${T('Download karein','Download')} (${b.mb} MB)</button>`}
   <div class="mt"><button class="btn s ghost" data-a="pbia" data-v="${b.id}">🌐 ${T('Bina download online dekhein','View online')}</button></div></div>`}
AX.pbdl=el=>{const b=PBK.find(x=>x.id===el.dataset.v);if(!b)return;PBDL[b.id]={p:0,got:0};try{AndroidPA.bookDl(b.id,b.dl,b.src)}catch(e){toast('Error')}rerender()};
AX.pbia=el=>{const b=PBK.find(x=>x.id===el.dataset.v);if(!b||typeof KVW==='undefined')return;PB.id=null;KVW.id=b.ia;KVW.n=b.t;KVW.u=b.u;rerender()};
const PB={id:null,doc:null,docId:null,v:'read',busy:false};
let PBS=store.get('pb_st',{pos:{},rd:{},bm:{},z:1,dk:1});const savePBS=()=>store.set('pb_st',PBS);
const pbDef=()=>PBK.find(b=>b.id===PB.id);
function pbLib(){if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);return new Promise((res,rej)=>{const s=document.createElement('script');s.src='pdfjs/pdf.min.js';s.onload=()=>{try{pdfjsLib.GlobalWorkerOptions.workerSrc='pdfjs/pdf.worker.min.js'}catch(e){}res(window.pdfjsLib)};s.onerror=rej;document.head.appendChild(s)})}
async function pbDoc(){const b=pbDef();if(PB.doc&&PB.docId===b.id)return PB.doc;const L=await pbLib();const buf=await fetch(b.src).then(r=>{if(!r.ok)throw new Error('file');return r.arrayBuffer()});
  PB.doc=await L.getDocument({data:new Uint8Array(buf),disableFontFace:false,isEvalSupported:false}).promise;PB.docId=b.id;return PB.doc}
const pbPg=()=>PBS.pos[PB.id]||1;
function pbOpen(id){PB.id=id;PB.v='read';rerender()}
async function pbDraw(){const cv=$('#pbcv');if(!cv)return;const b=pbDef();const doc=await pbDoc();const n=Math.max(1,Math.min(pbPg(),doc.numPages));const page=await doc.getPage(n);
  const box=$('#pbbox');const cssW=((box?box.clientWidth:360)-12)*(PBS.z||1);const v0=page.getViewport({scale:1});const CX=b.cx!=null?b.cx:.075,CY=b.cy!=null?b.cy:.045;const sc=cssW/(v0.width*(1-2*CX)),dpr=Math.min(3,window.devicePixelRatio||1);const vp=page.getViewport({scale:sc*dpr});
  const off=document.createElement('canvas');off.width=vp.width;off.height=vp.height;await page.render({canvasContext:off.getContext('2d'),viewport:vp}).promise;
  const sx=Math.round(off.width*CX),sy=Math.round(off.height*CY),w=off.width-2*sx,h=off.height-2*sy;cv.width=w;cv.height=h;cv.style.width=cssW+'px';cv.getContext('2d').drawImage(off,sx,sy,w,h,0,0,w,h);const l=$('#pbload');if(l)l.remove();
  if(n<doc.numPages)doc.getPage(n+1).catch(()=>{})}
function renderPB(el){const b=pbDef();if(b&&b.dl&&!pbHave(b)){el.innerHTML=`<div class="card"><button class="btn ghost s" data-a="pbback">← ${T('Kitabein','Books')}</button></div>`+pbDlCard(b);return}const n=pbPg(),k=PB.id+':'+n,rd=!!(PBS.rd[PB.id]||{})[n],bm=(PBS.bm[PB.id]||[]).includes(n);
  const top=`<div class="card hero"><div class="row sp"><button class="btn ghost s" data-a="pbback">← ${T('Kitabein','Books')}</button><b style="font-family:Mehr,Naskh,serif;font-size:20px">${b.u}</b></div>
   <div class="fch" style="padding:8px 0 0">${[['read','📖 '+T('Padhein','Read')],['toc','🗂 '+T('Fehrist','Contents')],['marks','🔖 '+T('Bookmark','Marks')]].map(x=>`<button data-a="pbv" data-v="${x[0]}" class="${PB.v===x[0]?'on':''}">${x[1]}</button>`).join('')}</div></div>`;
  if(PB.v==='toc'){el.innerHTML=top+`<div class="card flat">${b.toc.map(t=>`<div class="sr" data-a="pbgo" data-p="${t[2]}"><div class="no"><b>${t[2]}</b></div><div class="nm"><b class="urdu" style="font-size:17px">${t[0]}</b><div class="muted sm">${t[1]} • ${T('Safha','Page')} ${t[2]}</div></div></div>`).join('')}</div>`;return}
  if(PB.v==='marks'){const L=PBS.bm[PB.id]||[];el.innerHTML=top+`<div class="card flat">${L.length?L.map(p=>`<div class="sr" data-a="pbgo" data-p="${p}"><div class="no"><b>${p}</b></div><div class="nm"><b>${T('Safha','Page')} ${p}</b><div class="muted sm">${esc(pbSec(p))}</div></div></div>`).join(''):`<p class="muted c">${T('Koi bookmark nahi. Padhte waqt 📑 dabayein.','No bookmarks yet.')}</p>`}</div>`;return}
  const tot=PB.doc&&PB.docId===PB.id?PB.doc.numPages:'…',rc=Object.keys(PBS.rd[PB.id]||{}).length;
  el.innerHTML=top+`<div class="q-top"><div class="row"><button class="btn ghost s" data-a="pbpg" data-d="-1">←</button><input id="pbn" type="number" min="1" value="${n}" style="width:80px;margin:0;text-align:center"><span class="muted sm">/ ${tot}</span><button class="btn ghost s" data-a="pbpg" data-d="1">→</button><span class="grow"></span><button class="btn s ghost" data-a="pbdark">${PBS.dk?'🌙':'☀️'}</button></div>
   <div class="row mt"><button class="btn s ghost" data-a="pbz" data-d="-1">A−</button><span class="chip">${Math.round((PBS.z||1)*100)}%</span><button class="btn s ghost" data-a="pbz" data-d="1">A+</button><button class="btn s ghost" data-a="pbbm">${bm?'🔖':'📑'}</button><span class="grow"></span><button class="btn s ${rd?'gold':'ghost'}" data-a="pbrd">${rd?T('✓ Padh liya','✓ Read'):T('✅ Padh liya','✅ Mark read')}</button></div></div>
   <div class="muted sm c" style="margin:4px 0">${esc(pbSec(n))}</div>
   <div class="card" id="pbbox" style="padding:6px;overflow-x:auto;overflow-y:hidden"><div id="pbload" class="c muted" style="padding:40px 0">${T('Safha khul raha hai…','Opening page…')}</div><canvas id="pbcv" class="pbcv${PBS.dk&&S.theme!=='light'?' dk':''}" style="display:block;margin:0 auto;border-radius:8px;touch-action:pan-y pinch-zoom"></canvas></div>
   <div class="card c"><div class="muted sm">${rc} / ${tot} ${T('safhe padh liye','pages read')}</div><button class="btn gold full mt" data-a="pbnext">✅ ${T('Page padh liya — agla page','Read — next page')}</button></div>
   <p class="muted sm c">${T('Asli chhapi hui kitab ke safhe (Jameel Noori Nastaleeq) — internet ke bina bhi khulti hai.','Original printed pages — works offline.')}</p>`;
  const i=$('#pbn');i.onchange=()=>{PBS.pos[PB.id]=Math.max(1,+i.value||1);savePBS();rerender()};
  pbDraw().then(()=>{const t=document.querySelector('.q-top .muted.sm');if(t&&PB.doc)t.textContent='/ '+PB.doc.numPages}).catch(e=>{const l=$('#pbload');if(l)l.innerHTML=`⚠️ ${T('Kitab ki file nahi khuli','Could not open the book file')}: ${esc(e.message)}`});
  pbSwipe(el)}
function pbSec(n){const b=pbDef();if(!b)return'';let s='';for(const t of b.toc){if(t[2]<=n&&!/فہرست/.test(t[0]))s=t[0]+' — '+t[1]}return s}
function pbFlip(d){const cv=$('#pbcv');const n=pbPg()+d;if(n<1||(PB.doc&&n>PB.doc.numPages))return;
  if(cv&&cv.width){const r=cv.getBoundingClientRect(),g=document.createElement('img');try{g.src=cv.toDataURL('image/jpeg',.6)}catch(e){}g.className='pgghost '+(d>0?'nx':'pv');g.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:40;${cv.classList.contains('dk')?'filter:invert(.93) hue-rotate(180deg);':''}`;document.body.appendChild(g);requestAnimationFrame(()=>requestAnimationFrame(()=>g.classList.add('go')));setTimeout(()=>g.remove(),700)}
  PBS.pos[PB.id]=n;savePBS();sfx('page');rerender()}
function pbSwipe(el){if(el._pbs)return;el._pbs=1;let x0=null,y0=0;el.addEventListener('touchstart',e=>{if(!PB.id||PB.v!=='read'||e.touches.length>1){x0=null;return}const t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
  el.addEventListener('touchend',e=>{if(x0==null||!PB.id||(PBS.z||1)>1)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6)pbFlip(dx>0?1:-1)},{passive:true})}
AX.pbopen=el=>pbOpen(el.dataset.v);AX.pbback=()=>{PB.id=null;rerender()};AX.pbv=el=>{PB.v=el.dataset.v;rerender()};
AX.pbgo=el=>{PBS.pos[PB.id]=+el.dataset.p;savePBS();PB.v='read';rerender()};AX.pbpg=el=>pbFlip(+el.dataset.d);
AX.pbz=el=>{PBS.z=Math.max(1,Math.min(2.5,Math.round(((PBS.z||1)+(+el.dataset.d)*.25)*100)/100));savePBS();rerender()};
AX.pbdark=()=>{PBS.dk=PBS.dk?0:1;savePBS();rerender()};
AX.pbbm=()=>{const L=PBS.bm[PB.id]=PBS.bm[PB.id]||[],n=pbPg(),i=L.indexOf(n);if(i>=0)L.splice(i,1);else L.push(n);L.sort((a,b)=>a-b);savePBS();rerender()};
AX.pbrd=()=>{const R=PBS.rd[PB.id]=PBS.rd[PB.id]||{},n=pbPg();if(R[n])delete R[n];else R[n]=1;savePBS();rerender()};
AX.pbnext=()=>{const R=PBS.rd[PB.id]=PBS.rd[PB.id]||{};R[pbPg()]=1;savePBS();pbFlip(1)};
try{const _rh2=renderHadith;renderHadith=async function(el){if(PB.id){renderPB(el);return}return _rh2(el)}}catch(e){}
try{const _mb=renderMoreBooks;renderMoreBooks=function(el){if(PB.id){renderPB(el);return}return _mb(el)}}catch(e){}

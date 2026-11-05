'use strict';
/* ===== In-app book reader (like Hayatus Sahaba): chapters, pages, search, bookmarks, read-aloud. Books live in books/<id>.json ===== */
const KBL=[
 {id:'rs',n:'Riyadus Saliheen',u:'ریاض الصالحین',a:'Imam Nawawi'},
 {id:'st',n:'Shamail Tirmizi',u:'شمائلِ ترمذی',a:'Imam Tirmizi'},
 {id:'bm',n:'Bulugh al-Maram',u:'بلوغ المرام',a:'Hafiz Ibn Hajar'},
 {id:'ad',n:'Al-Adab al-Mufrad',u:'الادب المفرد',a:'Imam Bukhari'},
 {id:'mm',n:'Muwatta Imam Malik',u:'موطا امام مالک',a:'Imam Malik'},
 {id:'sn',n:'Sunan an-Nasai',u:'سنن نسائی',a:'Imam Nasai'}];
const KB=Object.assign({id:null,v:'toc',ci:0,pg:0,q:'',data:{},pos:store.get('kb_pos',{}),bm:store.get('kb_bm',[]),rd:store.get('kb_rd',{})},{});
const KPER=10;
const kbSave=()=>{store.set('kb_pos',KB.pos);store.set('kb_bm',KB.bm);store.set('kb_rd',KB.rd)};
const kbMeta=id=>KBL.find(b=>b.id===id)||{};
async function kbLoad(id){if(KB.data[id])return KB.data[id];const j=await fetch('books/'+id+'.json').then(r=>{if(!r.ok)throw 0;return r.json()});
  j.ch.forEach(c=>{c.n=(c.n)||0});KB.data[id]=j;return j}
function kbIndex(D){if(D._ix)return D._ix;const ix=[];D.ch.forEach((c,ci)=>c.h.forEach((h,hi)=>ix.push({ci,hi,n:nrm((h[1]||'')+' '+(h[2]||'')+' '+(c.t||'')+' '+(c.e||'')).toLowerCase()})));return D._ix=ix}
const kbKey=(id,ci,hi)=>id+':'+ci+':'+hi;
function kbOpen(id){KB.id=id;const p=KB.pos[id];if(p){KB.v='read';KB.ci=p.ci;KB.pg=p.pg}else{KB.v='toc';KB.ci=0;KB.pg=0}KB.q='';rerender()}
function kbClose(){KB.id=null;if(typeof TTS!=='undefined')TTS.stop();rerender()}
function kbHead(D,m){return`<div class="card hero"><div class="row sp"><button class="btn ghost s" data-a="kbback">← ${T('Maktaba','Library')}</button><span class="chip gold">${D.ch.reduce((n,c)=>n+c.h.length,0)} ${T('hadees','hadith')}</span></div>
  <div style="text-align:center;margin-top:8px"><div class="urdu" style="font-size:24px;font-weight:700">${esc(D.t)}</div><div class="muted sm">${esc(D.te)} • ${esc(D.a)}</div></div>
  <div class="fch" style="padding:10px 0 0">${[['toc',T('🗂 Fehrist','🗂 Index')],['read',T('📖 Padhein','📖 Read')],['search',T('🔎 Dhundhein','🔎 Search')],['marks',T('🔖 Bookmark','🔖 Marks')]].map(x=>`<button data-a="kbv" data-v="${x[0]}" class="${KB.v===x[0]?'on':''}">${x[1]}</button>`).join('')}</div></div>`}
function kbItem(D,ci,hi,showCh){const c=D.ch[ci],h=c.h[hi],k=kbKey(D.id,ci,hi),bm=KB.bm.includes(k);const ur=D.tl==='ur';
  return`<div class="card hd" data-k="${k}"><div class="row sp"><span class="row" style="gap:6px"><span class="chip gold">#${h[0]}</span>${showCh?`<span class="chip">${esc(c.e||c.t)}</span>`:''}</span><span class="row" style="gap:6px"><button class="btn s gold kbsay" data-a="kbsay" data-k="${k}" data-w="ar" title="Arabic">▶</button><button class="btn s ghost kbsay" data-a="kbsay" data-k="${k}" data-w="tr" title="${T('Tarjuma','Translation')}">🗣</button><button class="btn s ghost" data-a="kbcopy" data-k="${k}">⧉</button><button class="btn s ghost" data-a="kbbm" data-k="${k}">${bm?'🔖':'🏷'}</button></span></div>
   ${h[1]?`<div class="q-ar one hda" style="margin-top:8px;font-family:AmiriQ,Naskh,serif;line-height:2.3">${esc(h[1])}</div>`:''}
   ${h[2]?`<div class="hdt ${ur?'urdu':'trx'}" style="margin-top:8px">${esc(h[2])}</div>`:''}</div>`}
async function renderKB(el){const m=kbMeta(KB.id);el.innerHTML=`<div class="card c muted">${T('Kitab load ho rahi hai…','Loading book…')}</div>`;
  let D;try{D=await kbLoad(KB.id)}catch(e){el.innerHTML=`<div class="card"><button class="btn ghost s" data-a="kbback">←</button><div class="warnbox" style="margin-top:8px">${T('Kitab ka data nahi mila. Internet check karein ya app update karein.','Book data missing. Check internet or update the app.')}</div></div>`;return}
  const head=kbHead(D,m);
  if(KB.v==='toc'){const rows=D.ch.map((c,ci)=>`<div class="sr${KB.rd[D.id+':'+ci]?' rd':''}" data-a="kbch" data-ci="${ci}"><div class="no"><b>${ci+1}</b></div><div class="nm"><b class="urdu" style="font-size:16px">${esc(c.t||c.e)}</b>${c.t&&c.e?`<div class="muted sm">${esc(c.e)}</div>`:''}<div class="muted sm">${c.h.length} ${T('hadees','hadith')}${KB.rd[D.id+':'+ci]?' • ✓':''}</div></div></div>`).join('');
    el.innerHTML=head+`<div class="card flat">${rows}</div>`;return}
  if(KB.v==='marks'){const L=KB.bm.filter(k=>k.startsWith(D.id+':'));el.innerHTML=head+(L.length?L.map(k=>{const[,ci,hi]=k.split(':');return D.ch[ci]&&D.ch[ci].h[hi]?kbItem(D,+ci,+hi,true):''}).join(''):`<div class="card c muted">${T('Koi bookmark nahi. Kisi hadees par 🏷 dabayein.','No bookmarks yet. Tap 🏷 on any hadith.')}</div>`);return}
  if(KB.v==='search'){el.innerHTML=head+`<div class="card"><input id="kbq" class="srch" placeholder="${T('Koi bhi lafz (Arabic, Urdu ya English)…','Any word (Arabic, Urdu or English)…')}" value="${esc(KB.q)}" autocomplete="off"><div class="muted sm">${T('Is poori kitab mein dhoondhta hai.','Searches this whole book.')}</div></div><div id="kbres"></div>`;
    const draw=()=>{const raw=(KB.q||'').trim();const box=$('#kbres');if(!box)return;if(raw.length<2){box.innerHTML='';return}const q=nrm(raw).toLowerCase().split(' ').filter(Boolean);const ix=kbIndex(D);const hits=[];for(const r of ix){if(q.every(w=>r.n.includes(w))){hits.push(r);if(hits.length>=40)break}}
      box.innerHTML=hits.length?`<div class="muted sm" style="margin:6px 4px">${hits.length>=40?'40+':hits.length} ${T('nataij','results')}</div>`+hits.map(r=>kbItem(D,r.ci,r.hi,true)).join(''):`<div class="card c muted">${T('Kuch nahi mila.','No results.')}</div>`};
    const i=$('#kbq');i.oninput=debounce(()=>{KB.q=i.value;draw()},250);draw();return}
  /* read */
  const ci=Math.max(0,Math.min(KB.ci,D.ch.length-1)),c=D.ch[ci],pages=Math.max(1,Math.ceil(c.h.length/KPER)),pg=Math.max(0,Math.min(KB.pg,pages-1));KB.ci=ci;KB.pg=pg;KB.pos[D.id]={ci,pg};kbSave();
  const from=pg*KPER,to=Math.min(c.h.length,from+KPER);const items=[];for(let i=from;i<to;i++)items.push(kbItem(D,ci,i,false));
  const rd=!!KB.rd[D.id+':'+ci];
  el.innerHTML=head+`<div class="card"><div class="row sp"><button class="btn ghost s" data-a="kbc" data-d="-1" ${ci<=0?'disabled':''}>←</button><div style="text-align:center;min-width:0"><b class="urdu" style="font-size:17px">${esc(c.t||c.e)}</b>${c.t&&c.e?`<div class="muted sm">${esc(c.e)}</div>`:''}<div class="muted sm">${T('Baab','Chapter')} ${ci+1} / ${D.ch.length}</div></div><button class="btn ghost s" data-a="kbc" data-d="1" ${ci>=D.ch.length-1?'disabled':''}>→</button></div></div>`+fsRow()+items.join('')+
   `<div class="pgbar"><button class="btn grow" data-a="kbpg" data-d="-1" ${pg<=0&&ci<=0?'disabled':''}>◀ ${T('Pichla','Previous')}</button><span class="pgn">${pg+1}/${pages}</span><button class="btn grow" data-a="kbpg" data-d="1" ${pg>=pages-1&&ci>=D.ch.length-1?'disabled':''}>${T('Agla','Next')} ▶</button></div>
   <div class="card c"><button class="btn rdb ${rd?'rdon':'gold'}" data-a="kbrd">${rd?T('✓ Baab padh liya (hatayein)','✓ Chapter read (undo)'):T('✅ Ye baab padh liya','✅ Mark chapter read')}</button></div>
   <p class="muted sm c">${T('Text jayaz open sources se hai; ▶ Arabic matn mard ki awaaz se padhta hai, 🗣 tarjuma.','Text from open sources; ▶ reads the Arabic in a male voice, 🗣 the translation.')}</p>`;
  window.scrollTo({top:0})}
function kbItemOf(k){const[id,ci,hi]=k.split(':');const D=KB.data[id];return D&&D.ch[ci]?{D,c:D.ch[ci],h:D.ch[ci].h[hi]}:null}
AX.kbopen=el=>kbOpen(el.dataset.v);
AX.kbback=()=>kbClose();
AX.kbv=el=>{KB.v=el.dataset.v;if(typeof TTS!=='undefined')TTS.stop();rerender()};
AX.kbch=el=>{KB.ci=+el.dataset.ci;KB.pg=0;KB.v='read';rerender()};
AX.kbc=el=>{KB.ci+=+el.dataset.d;KB.pg=0;if(typeof TTS!=='undefined')TTS.stop();rerender()};
AX.kbpg=async el=>{const D=KB.data[KB.id],d=+el.dataset.d;const c=D.ch[KB.ci],pages=Math.max(1,Math.ceil(c.h.length/KPER));let pg=KB.pg+d,ci=KB.ci;
  if(pg<0){if(ci<=0)return;ci--;pg=Math.max(0,Math.ceil(D.ch[ci].h.length/KPER)-1)}else if(pg>=pages){if(ci>=D.ch.length-1)return;ci++;pg=0}
  KB.ci=ci;KB.pg=pg;if(typeof TTS!=='undefined')TTS.stop();sfx&&sfx('page');rerender()};
AX.kbrd=()=>{const k=KB.id+':'+KB.ci;if(KB.rd[k])delete KB.rd[k];else KB.rd[k]=dkey();kbSave();sfx&&sfx(KB.rd[k]?'success':'tick');rerender()};
AX.kbbm=el=>{const k=el.dataset.k,i=KB.bm.indexOf(k);if(i>=0)KB.bm.splice(i,1);else KB.bm.push(k);kbSave();el.textContent=i>=0?'🏷':'🔖';toast(i>=0?T('Bookmark hata diya','Bookmark removed'):T('Bookmark ho gaya 🔖','Bookmarked 🔖'))};
AX.kbcopy=async el=>{const o=kbItemOf(el.dataset.k);if(!o)return;try{await navigator.clipboard.writeText((o.h[1]||'')+'\n'+(o.h[2]||''));toast(T('Copy ho gaya ✅','Copied ✅'))}catch(e){}};
AX.kbsay=el=>{if(TTS.on){const same=el.dataset.on;TTS.stop();if(same)return}const o=kbItemOf(el.dataset.k);if(!o)return;const ar=el.dataset.w==='ar';const txt=ar?o.h[1]:o.h[2];if(!txt)return;
  TTS.run([{t:txt}],{lang:ar?'ar':(o.D.tl==='ur'?'ur':'en'),onStart:()=>{el.dataset.on='1';el.textContent='⏸'},onEnd:()=>{el.dataset.on='';el.textContent=ar?'▶':'🗣'}})};

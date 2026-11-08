/* 📖 QURAN READING MODE — sirf Quran: upar ke saare tab, website banner, neeche ka menu band.
   • Asli mushaf jaise safhe, ungli se palatne wale (swipe) + ◀ ▶ button
   • Tarjuma ke saath ya bagair (ek button)
   • Sunein: sirf Quran / Quran + Tarjuma / sirf Tarjuma
   • Surah ya Para par seedha jaayein; "✕ Bahar niklein" se wapas
   • Sura Fatiha aur Baqarah ke pehle do safhe asli Quran ki tarah sajaye hue (beech mein, bade akshar, naqsh-o-nigaar wala frame) */

function rmApply(){document.body.classList.toggle('qread',!!QS.rm&&curTab==='deen'&&(typeof QV==='undefined'||true))}
function rmEnter(){QS.rm=1;QS.pg=true;QS.view='reader';if(QS.gp==null)QS.gp=0;saveQS();document.body.classList.add('qread');sfx('page');if(curTab!=='deen')go('deen','quran');else rerender();try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}}
function rmExit(){QS.rm=0;saveQS();document.body.classList.remove('qread');try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}rerender()}
A.rmon=()=>rmEnter();A.rmoff=()=>rmExit();
A.rmtr=()=>{QS.rmTr=!QS.rmTr;saveQS();sfx('tick');rmTrApply()};
A.rmam=()=>{const order=['q','qt','t'];const i=order.indexOf(QS.am||'qt');QS.am=order[(i+1)%3];saveQS();sfx('tick');rmBar();toast(qAmL()[1](),1500)};
A.rmjump=()=>{const opts=SN.map((n,i)=>`<option value="${i+1}">${i+1}. ${esc(snm(i))} — ${n[1]}</option>`).join('');
  dlg(`<h3>📑 ${T('Kahan jaana hai?','Go to','کہاں جانا ہے؟','कहाँ जाना है?')}</h3><label>${T('Surah','Surah','سورت','सूरह')}</label><select id="rmS">${opts}</select>
   <label class="mt">${T('Para','Juz','پارہ','पारा')}</label><select id="rmJ"><option value="">—</option>${JUZ.map((j,i)=>`<option value="${i+1}">${T('Para','Juz','پارہ','पारा')} ${i+1}</option>`).join('')}</select>
   <label class="mt">${T('Safha (1–610)','Page (1–610)','صفحہ (۱–۶۱۰)','पेज (1–610)')}</label><input id="rmP" type="number" inputmode="numeric" min="1" max="610" placeholder="${(QS.gp||0)+1}">
   <div class="row mt"><button class="btn ghost grow" data-a="ntclose">${T('Band','Close','بند','बंद')}</button><button class="btn gold grow" id="rmGo">${T('Kholein','Open','کھولیں','खोलें')}</button></div>`);
  const sel=$('#rmS');try{sel.value=String((QS.pos&&QS.pos.s)||1)}catch(e){}
  $('#rmGo').onclick=()=>{const p=+$('#rmP').value,j=+$('#rmJ').value,P=qpgBuild();
    if(p>=1)QS.gp=Math.min(P.length-1,p-1);else if(j){const x=JUZ[j-1];QS.gp=qpgOf(x[0],x[1])}else QS.gp=qpgOf(+sel.value,1);
    QPA.left=1;saveQS();closeDlg();renderMushaf($('#sub'))}};
function rmTrApply(){const d=document.querySelector('details.mtrd');if(d){d.open=!!QS.rmTr;d.classList.toggle('rmon',!!QS.rmTr)}rmBar()}
function rmBar(){let b=document.getElementById('rmbar');if(!QS.rm||curTab!=='deen'||!document.getElementById('mus')){if(b)b.remove();document.body.classList.remove('qread');return}
  document.body.classList.add('qread');
  if(!b){b=document.createElement('div');b.id='rmbar';document.body.appendChild(b)}
  const P=qpgBuild(),pg=P[QS.gp]||P[0],am=qAmL();
  b.innerHTML=`<button data-a="rmoff" class="rmx">✕ <span>${T('Bahar niklein','Exit','باہر نکلیں','बाहर निकलें')}</span></button>
   <button data-a="rmjump" class="rmpg"><b>${snm(pg.s0-1)}</b><small>${T('Safha','Page','صفحہ','पेज')} ${pg.n} • ${T('Para','Juz','پارہ','पारा')} ${pg.j}</small></button>
   <button data-a="rmtr" class="${QS.rmTr?'on':''}">${QS.rmTr?'✅':'⬜'} <span>${T('Tarjuma','Translation','ترجمہ','तर्जुमा')}</span></button>
   <button data-a="rmam">${am[2]} <span>${T('Awaaz','Audio','آواز','आवाज़')}</span></button>`}
/* hook into Quran renders */
{const _rm=renderMushaf;renderMushaf=async function(el){await _rm.apply(this,arguments);try{
  const top=el&&el.querySelector('.q-top .row');if(top&&!top.querySelector('[data-a="rmon"]'))top.insertAdjacentHTML('beforeend',`<button class="btn s gold" data-a="rmon">📖 <span>${T('Reading mode','Reading mode','ریڈنگ موڈ','रीडिंग मोड')}</span></button>`);
  q15Special(el);rmTrApply()}catch(e){}}}
if(typeof renderQuran==='function'){const _rq=renderQuran;renderQuran=async function(el){const r=await _rq.apply(this,arguments);try{
  if(!QS.pg){const top=el&&el.querySelector('.q-top .row');if(top&&!top.querySelector('[data-a="rmon"]'))top.insertAdjacentHTML('beforeend',`<button class="btn s gold" data-a="rmon">📖 <span>${T('Reading mode','Reading mode','ریڈنگ موڈ','रीडिंग मोड')}</span></button>`);
    const hub=el&&!el.querySelector('#mus')&&!el.querySelector('[data-a="rmon"]');if(hub)el.insertAdjacentHTML('afterbegin',`<button class="btn gold full" data-a="rmon" style="margin-bottom:10px;min-height:54px;font-size:17px">📖 ${T('Quran Reading mode — sirf Quran, safhe palatkar padhein','Quran reading mode — pages like a real mushaf','قرآن ریڈنگ موڈ — صفحے پلٹ کر پڑھیں','क़ुरआन रीडिंग मोड — पन्ने पलटकर पढ़ें')}</button>`)}
  rmBar()}catch(e){}return r}}
{const _go=go;go=function(t,s){const r=_go.apply(this,arguments);setTimeout(rmBar,60);return r}}
{const _rr=rerender;rerender=function(){const r=_rr.apply(this,arguments);setTimeout(rmBar,120);return r}}
document.addEventListener('keydown',e=>{if(!QS.rm||!document.getElementById('mus'))return;if(e.key==='ArrowLeft')A.pgn();else if(e.key==='ArrowRight')A.pgp();else if(e.key==='Escape')rmExit()});
/* Android back button / browser back = exit reading mode first */
window.addEventListener('popstate',()=>{if(QS.rm){rmExit()}});
/* ---------- Sura Fatiha & Baqarah opening pages: real-mushaf style ---------- */
function q15Special(el){const box=el&&el.querySelector('.mus-in.q15');if(!box)return;const first=(QS.gp||0)<=1;box.classList.toggle('fat',first);
  const mus=el.querySelector('#mus');if(mus)mus.classList.toggle('fatpg',first);
  if(first){box.querySelectorAll('.mbl15').forEach(x=>x.remove());box.querySelectorAll('.mtx').forEach(l=>l.classList.add('short'));
    const cw=box.clientWidth-60;let mx=0;const cx=q15Fit.cx||(q15Fit.cx=document.createElement('canvas').getContext('2d'));cx.font='24px IPQ';box.querySelectorAll('.mtx').forEach(l=>{mx=Math.max(mx,cx.measureText(l.innerText.replace(/\s+/g,' ')).width)});
    if(mx&&cw>0)box.style.setProperty('--q15',Math.max(18,Math.min(34,24*cw/(mx*1.12))).toFixed(1)+'px')}}
{const _fit=q15Fit;q15Fit=function(){_fit.apply(this,arguments);try{const el=$('#sub');if(el)q15Special(el)}catch(e){}}}
(function(){const st=document.createElement('style');st.textContent=`
body.qread header,body.qread #siteBar,body.qread #dock,body.qread #dseg,body.qread .seg,body.qread .q-top,body.qread #fab,body.qread #calcfab,body.qread #ezsay,body.qread #mp{display:none!important}
body.qread main{padding-top:calc(64px + env(safe-area-inset-top))!important;padding-bottom:110px!important}
body.qread .mpbar{bottom:calc(10px + env(safe-area-inset-bottom))!important}
body.qread .mus{margin-top:4px!important}
#rmbar{position:fixed;left:6px;right:6px;top:calc(6px + env(safe-area-inset-top));z-index:45;display:grid;grid-template-columns:auto 1fr auto auto;gap:6px;padding:6px;border-radius:18px;background:var(--sheet,#101826);border:1px solid var(--stroke);box-shadow:0 8px 24px rgba(0,0,0,.45);max-width:640px;margin:0 auto}
#rmbar button{border:0;border-radius:13px;padding:8px 10px;background:rgba(255,255,255,.07);color:inherit;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;white-space:nowrap}
#rmbar .rmx{background:#8b1c1c;color:#fff}#rmbar button.on{background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff}
#rmbar .rmpg{display:flex;flex-direction:column;align-items:center;line-height:1.15;min-width:0;overflow:hidden}#rmbar .rmpg b{font-size:14px;max-width:100%;overflow:hidden;text-overflow:ellipsis}#rmbar .rmpg small{font-size:11px;opacity:.75;font-weight:600}
@media(max-width:480px){#rmbar .rmx span,#rmbar [data-a=rmam] span{display:none}}body.qread #sub>.card:not(.mus){display:none!important}
details.mtrd.rmon{margin-top:8px}details.mtrd.rmon>summary{display:none}
.mus-in.q15.fat{min-height:56vh;display:flex;flex-direction:column;justify-content:center;padding:28px 34px!important;outline:6px double #b8952c!important;outline-offset:6px;border:3px solid #b8952c!important;border-radius:22px;
 background:radial-gradient(circle at 50% 50%,rgba(212,175,55,.10),transparent 70%),repeating-conic-gradient(from 0deg at 0 0,rgba(212,175,55,.08) 0 10deg,transparent 10deg 20deg) top left/90px 90px no-repeat,repeating-conic-gradient(from 90deg at 100% 0,rgba(212,175,55,.08) 0 10deg,transparent 10deg 20deg) top right/90px 90px no-repeat,repeating-conic-gradient(from 180deg at 100% 100%,rgba(212,175,55,.08) 0 10deg,transparent 10deg 20deg) bottom right/90px 90px no-repeat,repeating-conic-gradient(from 270deg at 0 100%,rgba(212,175,55,.08) 0 10deg,transparent 10deg 20deg) bottom left/90px 90px no-repeat}
.mus-in.q15.fat .ml15{border-bottom:0;height:2.35em}.mus-in.q15.fat .mtx{justify-content:center;gap:.45em}
.mus-in.q15.fat .mhd15{margin-bottom:.5em}.mus-in.q15.fat .msb15{border-radius:2em;height:2em;font-size:.82em}
.mus.fatpg{border-width:4px!important}`;document.head.appendChild(st)})();
setTimeout(rmBar,1500);
/* phone ka Back button: pehle Reading mode se bahar */
try{const _nb=NAV.back.bind(NAV);NAV.back=function(){if(QS.rm&&document.getElementById('rmbar')){rmExit();return true}return _nb()}}catch(e){}
/* ===== Tarjuma wala Quran (Reading mode + Tarjuma ON): har ayat ke neeche uska tarjuma, wahi safhe, wahi palatna ===== */
function rmTrPage(pg){let h='';for(let i=pg.i0;i<=pg.i1;i++){const[s,a]=QPF.flat[i];
    if(a===1){h+=`<div class="rmsh"><span>${toAr(s)}</span><b>سُوۡرَةُ ${SN[s-1][1]}</b><span>${toAr(QD.ar[s-1].length)}</span></div><div class="rmsn">${esc(snm(s-1))}</div>${s!==1&&s!==9?`<div class="rmbs">${(typeof Q15!=='undefined'&&Q15)?q15Bism():'بِسۡمِ اللّٰهِ الرَّحۡمٰنِ الرَّحِيۡمِ'}</div>`:''}`}
    const ar=(typeof Q15!=='undefined'&&Q15&&Q15.ayU[s-1])?q15AyahHTML(s,a):esc(QD.ar[s-1][a-1]);
    const tr=(QD.ur[s-1]&&QD.ur[s-1][a-1])||'';
    h+=`<div class="rmay ay${bmHas(s,a)?' bm':''}" data-a="qay" data-ay="${s}:${a}"><div class="rmar">${ar}${(typeof Q15!=='undefined'&&Q15)?'':` <span class="ayno">${toAr(a)}</span>`}</div><div class="rmtr ${TRC()}"><b>${a}.</b> ${esc(tr)}</div></div>`}
  return h}
function rmTrRender(el){if(!QS.rm||!QS.rmTr)return;const box=el&&el.querySelector('.mus-in');if(!box)return;const P=qpgBuild(),pg=P[QS.gp];if(!pg)return;
  box.className='mus-in rmtrpg';box.style.removeProperty('--q15');box.innerHTML=rmTrPage(pg);const m=el.querySelector('#mus');if(m)m.classList.remove('fatpg');
  const d=el.querySelector('details.mtrd');if(d)d.style.display='none';try{QA.hl()}catch(e){}}
/* page edges: tap to turn (left edge = agla, right edge = pichla — jaise Quran ke safhe) */
function rmEdges(el){const m=el&&el.querySelector('#mus');if(!m||!QS.rm||m.querySelector('.rmedge'))return;m.style.position='relative';
  m.insertAdjacentHTML('beforeend',`<button class="rmedge l" data-a="rmnext" aria-label="${T('Agla safha','Next page','اگلا صفحہ','अगला पेज')}">‹</button><button class="rmedge r" data-a="rmprev" aria-label="${T('Pichla safha','Previous page','پچھلا صفحہ','पिछला पेज')}">›</button>`)}
A.rmnext=()=>A.pgn();A.rmprev=()=>A.pgp();
/* swipe: dono taraf kaam kare; pehle safhe par koi bhi swipe aage le jaye */
(function(){let x0=null,y0=0,t0=0;document.addEventListener('touchstart',e=>{if(!QS.rm||!e.target.closest||!e.target.closest('#mus'))return;const t=e.touches[0];x0=t.clientX;y0=t.clientY;t0=Date.now()},{passive:true});
  document.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.4)return;
    /* qSwipe already handles dx>0 → next, dx<0 → prev. Sirf pehle safhe par ulta swipe bhi aage le jaye */
    if((QS.gp||0)===0&&dx<0)setTimeout(()=>{if((QS.gp||0)===0)A.pgn()},60)},{passive:true})})();
{const _rm2=renderMushaf;renderMushaf=async function(el){await _rm2.apply(this,arguments);try{rmTrRender(el);rmEdges(el)}catch(e){}}}
{const _tr=A.rmtr;A.rmtr=()=>{_tr();renderMushaf($('#sub'))}}
(function(){const st=document.createElement('style');st.textContent=`
.mus-in.rmtrpg{padding:12px 12px 14px!important;min-height:58vh}
.rmay{padding:10px 4px 12px;border-bottom:1px solid rgba(224,178,74,.22);border-radius:8px}.rmay:last-child{border-bottom:0}
.rmar{direction:rtl;text-align:right;font-family:IPQ,var(--qf,serif);font-size:24px;line-height:2.15;color:#f3ead2}
.rmar .qae{color:#d8b45a}
.rmtr{margin-top:6px;font-size:15.5px;line-height:1.75;color:#cfe3de}.rmtr b{color:#d8b45a;font-weight:700;margin-inline-end:4px}
.rmtr.urdu{direction:rtl;text-align:right;font-size:17px;line-height:2.1}
.rmsh{display:flex;justify-content:space-between;align-items:center;margin:8px 0 4px;padding:6px 14px;border:2px double #c9a24a;border-radius:2em;background:linear-gradient(90deg,#3d3510,#6b5a1a 30%,#6b5a1a 70%,#3d3510);color:#ffe9a8;direction:rtl;font-family:Naskh,serif}
.rmsh b{font-size:20px}.rmsn{text-align:center;font-size:12px;color:#c9b77a;margin-bottom:4px}
.rmbs{text-align:center;font-family:IPQ,serif;font-size:24px;color:#f3ead2;margin:6px 0 10px}
.rmedge{position:absolute;top:40%;width:34px;height:74px;border:0;border-radius:14px;background:rgba(212,175,55,.22);color:#ffe9a8;font-size:30px;font-weight:700;z-index:3;cursor:pointer;opacity:.75}
.rmedge.l{left:-2px}.rmedge.r{right:-2px}.rmedge:active{opacity:1;background:rgba(212,175,55,.45)}
html[data-mq=light] .rmar,html[data-mq=light] .rmbs{color:#14170c}html[data-mq=light] .rmtr{color:#2b3a36}`;document.head.appendChild(st)})();

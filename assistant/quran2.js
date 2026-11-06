'use strict';
/* ===== Quran v3: Indo-Pak fonts (sahi jazm/mad/harakat), reading & listening options, both views, page-turn animation, better search ===== */
const QFONTS=[['mu','Muhammadi',()=>T('Taj (Pakistani mushaf)','Taj (Pakistani mushaf)')],['nh','Noorehira',()=>T('Noore Hira (halka)','Noore Hira (light)')],['ip','IndoPak',()=>T('Purana (WBW)','Old (WBW)')]];
if(!QS.qf)QS.qf='mu';if(!QS.am)QS.am=QS.tv===false?'q':'qt';if(!QS.sf)QS.sf='all';
window.QFN=()=>(QFONTS.find(x=>x[0]===QS.qf)||QFONTS[0])[1];
function qfApply(){const f=QFONTS.find(x=>x[0]===QS.qf)||QFONTS[0];document.documentElement.style.setProperty('--qf',`${f[1]},IndoPak,Naskh,serif`);document.documentElement.dataset.qf=QS.qf}
qfApply();
if(!QS.mq)QS.mq='auto';
function mqApply(){const d=QS.mq==='auto'?(S.theme!=='light'):QS.mq==='dark';document.documentElement.dataset.mq=d?'dark':'light'}
mqApply();try{const _at=applyTheme;applyTheme=function(){_at.apply(this,arguments);mqApply()}}catch(e){}
A.qmq=el=>{QS.mq=el.dataset.v;saveQS();mqApply();rerender()};
/* reading modes: add "only translation" */
MODES[1][1]=()=>T('Quran + Tarjuma','Quran + Translation');
if(!MODES.some(m=>m[0]==='o'))MODES.splice(2,0,['o',()=>T('Sirf Tarjuma','Translation only')]);
/* listening modes */
const QAM=[['qt',()=>T('Quran + Tarjuma','Quran + Translation'),'🕋🗣'],['q',()=>T('Sirf Quran','Quran only'),'🕋'],['t',()=>T('Sirf Tarjuma','Translation only'),'🗣']];
const qAmL=()=>(QAM.find(x=>x[0]===QS.am)||QAM[0]);
QA.play=function(s,n){if(!QD)return;this.s=s;this.n=n;this.on=true;const tOnly=QS.am==='t';this.ph=tOnly?'tr':'ar';const a=this.a;a.src=tOnly?this.trUrl(s,n):this.url(s,n);a.defaultPlaybackRate=a.playbackRate=QS.spd||1;a.onended=()=>this.ended();
  a.onerror=()=>{if(this.ph==='tr'&&!tOnly){this.ph='ar';this.next();return}toast(T('Audio nahi chala — internet check karein','Audio failed — check internet'));this.on=false;this.upd()};
  a.play().then(()=>this.upd()).catch(e=>{if(e&&e.name==='AbortError')return;toast(T('Audio nahi chala — tap karke dobara try karein','Could not play — tap again'));this.on=false;this.upd()});this.hl();this.upd();this.meta()};
QA.ended=function(){if(QS.am==='qt'&&this.ph==='ar'){this.ph='tr';this.a.src=this.trUrl(this.s,this.n);this.a.play().catch(()=>{this.ph='ar';this.next()});this.upd();return}this.ph='ar';this.next()};
A.mpTv=()=>{const i=QAM.findIndex(x=>x[0]===QS.am);QS.am=QAM[(i+1)%QAM.length][0];QS.tv=QS.am!=='q';saveQS();toast('🔊 '+qAmL()[1]());QA.upd()};
A.qam=el=>{QS.am=el.dataset.v;QS.tv=QS.am!=='q';saveQS();toast('🔊 '+qAmL()[1]());rerender()};
A.qfont=el=>{QS.qf=el.dataset.v;saveQS();qfApply();rerender()};
A.qpgset=el=>{QS.pg=el.dataset.v==='1';if(QS.pg&&QS.pos&&QD)QS.gp=qpgOf(QS.pos.s,QS.pos.a);saveQS();rerender()};
A.qsf=el=>{QS.sf=el.dataset.v;saveQS();doQSearch()};
function qOptsHTML(){return`<div class="qopt"><div class="eyebrow" style="margin:8px 0 4px">🔊 ${T('Sunne ka tareeqa','Listening')}</div><div class="fch" style="padding:0">${QAM.map(m=>`<button data-a="qam" data-v="${m[0]}" class="${QS.am===m[0]?'on':''}">${m[2]} ${m[1]()}</button>`).join('')}</div>
  <div class="eyebrow" style="margin:10px 0 4px">🌙 ${T('Quran ke page ka rang','Page colour')}</div><div class="fch" style="padding:0">${[['auto',T('App jaisa (auto)','Same as app')],['dark',T('🌙 Dark','🌙 Dark')],['light',T('📜 Kaghaz (roshan)','📜 Paper (light)')]].map(([k,l])=>`<button data-a="qmq" data-v="${k}" class="${QS.mq===k?'on':''}">${l}</button>`).join('')}</div>
  <div class="eyebrow" style="margin:10px 0 4px">🔤 ${T('Quran ka font','Quran font')}</div><div class="fch" style="padding:0">${QFONTS.map(f=>`<button data-a="qfont" data-v="${f[0]}" class="${QS.qf===f[0]?'on':''}"><span style="font-family:${f[1]},IndoPak;font-size:17px">بِسۡمِ اللّٰهِ</span> ${f[2]()}</button>`).join('')}</div></div>`}
/* Quran home: both views clearly */
const _rq=renderQuran;
renderQuran=async function(el){await _rq(el);if(QS.view==='reader'){document.body.classList.toggle('qm-o',!QS.pg&&QS.mode==='o');qInjectReader(el);return}document.body.classList.remove('qm-o');
  const b=el.querySelector('[data-a="qpgpref"]');if(b){const row=b.parentElement;row.outerHTML=`<div class="qview"><button class="${QS.pg?'on':''}" data-a="qpgset" data-v="1"><span>📖</span><b>${T('Kitaab (Mushaf)','Book (Mushaf)')}</b><small>${T('Page palatne wala, asli Quran jaisa','Turn pages like a printed Quran')}</small></button><button class="${QS.pg?'':'on'}" data-a="qpgset" data-v="0"><span>📜</span><b>${T('Tarjume ke saath','With translation')}</b><small>${T('Ayat ke neeche tarjuma, scroll','Translation under each ayah')}</small></button></div><details class="card" style="padding:8px 12px"><summary class="sm">⚙ ${T('Sunne / font ke options','Listening / font options')}: ${qAmL()[2]} ${qAmL()[1]()}</summary>${qOptsHTML()}</details>`}
  if(QS.tab==='search')qSearchChips()};
function qInjectReader(el){const d=el.querySelector('.rdopt .fch:last-of-type');if(d&&!el.querySelector('.qopt'))d.insertAdjacentHTML('afterend',qOptsHTML());
  const md=el.querySelector('#mpdisp');if(md&&!md.querySelector('.qopt'))md.insertAdjacentHTML('beforeend',qOptsHTML()+`<div class="fch" style="padding:8px 0 0">${MODES.filter(m=>m[0]!=='w'&&m[0]!=='a').map(m=>`<button data-a="qmodep" data-v="${m[0]}">${m[1]()} 📜</button>`).join('')}</div>`)}
A.qmodep=el=>{QS.mode=el.dataset.v;QS.pg=false;saveQS();rerender()};
/* search: all / ayat / word / translation */
function qSearchChips(){const box=$('#qres');if(!box||$('#qsfc'))return;box.insertAdjacentHTML('beforebegin',`<div class="fch" id="qsfc">${[['all',T('Sab','All')],['ayat',T('Ayat (Arabi)','Ayah (Arabic)')],['lafz',T('Lafz (word)','Exact word')],['tr',T('Tarjuma','Translation')]].map(([k,l])=>`<button data-a="qsf" data-v="${k}" class="${QS.sf===k?'on':''}">${l}</button>`).join('')}</div>`)}
let QEN=null;const qEn=()=>QEN?Promise.resolve(QEN):fetch('tr-en.json').then(r=>r.json()).then(d=>QEN=d).catch(()=>null);
const _dqs=doQSearch;
const qBase=w=>nrm(w).replace(/[ًٌٍَُِّْٰۣۡۢۤۥۦ۪ۭٓٔ]/g,'').replace(/^ال/,'').replace(/^(و|ف|ب|ل)ال/,'');
doQSearch=function(){qSearchChips();$$('#qsfc button').forEach(b=>b.classList.toggle('on',b.dataset.v===QS.sf));const box=$('#qres');if(!box)return;const raw=(QS.q||'').trim();
  if(QS.sf==='all'||!raw||/^\d{1,3}\s*[:\-.]\s*\d{1,3}$/.test(raw))return _dqs();
  buildQX();const out=[];let total=0,occ=0;const latin=/[a-z]/i.test(raw)&&!/[؀-ۿ]/.test(raw);
  if(QS.sf==='ayat'||QS.sf==='lafz'){if(latin){box.innerHTML=`<p class="muted c">${T('Ayat / lafz ke liye Arabi mein likhein (jaise: رحمة ، صبر). Roman ke liye "Tarjuma" ya "Sab" chunein.','Type in Arabic for ayah/word search.')}</p>`;return}
    const q=nrm(raw),qb=qBase(raw);
    for(let s=0;s<114;s++)for(let a=0;a<QD.ar[s].length;a++){let n=0;if(QS.sf==='ayat'){if(QX.ar[s][a].includes(q))n=1}else{n=QX.ar[s][a].split(/\s+/).filter(w=>w===q||qBase(w)===qb).length}
      if(n){total++;occ+=n;if(out.length<150)out.push({s,a,hit:1})}}}
  else{const q=raw.toLowerCase();if(!QEN&&latin){qEn().then(()=>{if($('#qres'))doQSearch()})}
    for(let s=0;s<114;s++)for(let a=0;a<QD.ar[s].length;a++){let hit=0;if(QX.ur[s][a].includes(latin?q:nrm(raw)))hit=2;else if(latin&&QX.ro[s][a].includes(q))hit=3;else if(latin&&QEN&&QEN[s]&&String(QEN[s][a]||'').toLowerCase().includes(q))hit=4;
      if(hit){total++;if(out.length<150)out.push({s,a,hit})}}}
  const tx=r=>r.hit===4?`<div class="sm" style="direction:ltr;text-align:left">${hiTxt(QEN[r.s][r.a],raw)}</div>`:`<div class="${TRC()}" style="font-size:15px;line-height:2">${r.hit>=2?hiTxt(QD.ur[r.s][r.a],raw):esc(QD.ur[r.s][r.a])}</div>`;
  box.innerHTML=out.length?`<div class="muted sm" style="margin:2px 4px 8px">${QS.sf==='lafz'?T(`"${esc(raw)}" — ${occ} baar, ${total} ayaat mein`,`"${esc(raw)}" — ${occ} times in ${total} ayahs`):`${total} ${T('ayaat mili','ayahs found')}`}${total>150?' • '+T('pehli 150 dikha raha hoon','showing first 150'):''}</div><div class="card flat">${out.map(r=>`<div class="sr" data-a="qopen" data-s="${r.s+1}" data-n="${r.a+1}" style="align-items:flex-start"><div class="no"><b>${r.a+1}</b></div><div class="nm"><b>${snm(r.s)} ${r.s+1}:${r.a+1}</b><div class="q-ar one" style="font-size:24px;line-height:2.2">${QD.ar[r.s][r.a]}</div>${tx(r)}</div></div>`).join('')}</div>`:`<p class="muted c">${T('Kuch nahi mila. Doosra lafz try karein.','Nothing found. Try another word.')}</p>`};
/* realistic page turn: the old page lifts and folds away while the new one is underneath */
async function qFlip(dir,go){const old=$('#mus');let ghost=null;if(old&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const r=old.getBoundingClientRect();ghost=old.cloneNode(true);ghost.id='';ghost.classList.remove('mflip');ghost.classList.add('pgghost',dir>0?'nx':'pv');ghost.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;z-index:40`;ghost.insertAdjacentHTML('beforeend','<i class="pgshade"></i>');document.body.appendChild(ghost)}
  await go();const m=$('#mus');if(m)m.classList.remove('mflip');if(ghost){requestAnimationFrame(()=>ghost.classList.add('go'));setTimeout(()=>ghost.remove(),700)}}
A.pgn=()=>{const P=qpgBuild();if(QS.gp<P.length-1){qFlip(1,async()=>{QS.gp++;QPA.left=QS.rep===0?9e9:(QS.rep||1);saveQS();sfx('page');await renderMushaf($('#sub'))})}};
A.pgp=()=>{if(QS.gp>0){qFlip(-1,async()=>{QS.gp--;QPA.left=QS.rep===0?9e9:(QS.rep||1);saveQS();sfx('page');await renderMushaf($('#sub'))})}};
const _rm=renderMushaf;renderMushaf=async function(el){await _rm(el);qInjectReader(el)};
/* finger-follow page drag: the page tilts with your finger, then turns (or springs back) */
(function(){let x0=null,y0=0,drag=false;
  document.addEventListener('touchstart',e=>{const m=e.target.closest&&e.target.closest('#mus');if(!m||!QS.pg)return;const t=e.touches[0];x0=t.clientX;y0=t.clientY;drag=false},{passive:true});
  document.addEventListener('touchmove',e=>{if(x0==null)return;const m=$('#mus');if(!m)return;const t=e.touches[0],dx=t.clientX-x0,dy=t.clientY-y0;
    if(!drag&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3)drag=true;if(!drag)return;
    const w=m.offsetWidth||360,p=Math.max(-1,Math.min(1,dx/w));m.style.transition='none';m.style.transformOrigin=dx>0?'right center':'left center';
    m.style.transform=`perspective(1600px) rotateY(${dx>0?-p*55:-p*55}deg)`;m.style.boxShadow=`${dx>0?-1:1}*0px 0 0 transparent`},{passive:true});
  document.addEventListener('touchend',()=>{if(x0==null)return;x0=null;const m=$('#mus');if(m&&drag){m.style.transition='transform .25s ease';m.style.transform='';setTimeout(()=>{if(m){m.style.transition='';m.style.transformOrigin=''}},260)}drag=false},{passive:true});})();

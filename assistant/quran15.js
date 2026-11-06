'use strict';
/* ===== Quran v4: asli IndoPak 15-line Hafizi mushaf =====
   Text: IndoPak (QuranWBW / Quran.com) — har lafz aur har waqf King Fahad Complex ke Nastaleeq mushaf se milaya hua.
   Layout: Quran.com "IndoPak 15 lines" (610 safhe) — har line ke alfaz bilkul usi tarah jaise chhape hue hafizi Quran mein.
   Font: AlQuran IndoPak by QuranWBW (sirf isi text ke saath sahi chalta hai). */
let Q15=null,Q15P=null;
const Q15F='IPQ';
(function(){const st=document.createElement('style');st.textContent=`@font-face{font-family:IPQ;src:url(ip15.woff2) format('woff2');font-display:block}`;document.head.appendChild(st)})();
if(!QS.m35){QS.qf='ipq';QS.m35=1;try{saveQS()}catch(e){}}
try{if(!QFONTS.find(f=>f[0]==='ipq'))QFONTS.unshift(['ipq',Q15F,()=>T('IndoPak Hafizi ★ (sahi waqf)','IndoPak Hafizi ★ (exact waqf)')])}catch(e){}
{const _qa=qfApply;qfApply=function(){_qa();if(QS.qf==='ipq')document.documentElement.style.setProperty('--qf','Muhammadi,IndoPak,Naskh,serif')}}
try{qfApply()}catch(e){}
function q15Load(){if(Q15)return Promise.resolve(Q15);return Q15P||(Q15P=fetch('q15.json').then(r=>r.json()).then(j=>{Q15=q15Prep(j);return Q15}).catch(e=>{Q15P=null;throw e}))}
{const _lq=loadQ;loadQ=function(){return _lq.apply(this,arguments).then(d=>q15Load().then(()=>d,()=>d))}}
const Q15ON=()=>!!Q15&&QS.qf==='ipq';
/* units: har lafz + uske baad ke waqf/ayat-nishan */
function q15Prep(j){
  const units=[];const aOff=[];const ayU=[];
  j.t.forEach((sr,si)=>{ayU.push([]);sr.forEach((tx,ai)=>{const us=tx.split(' ');ayU[si].push([units.length,units.length+us.length-1]);us.forEach(u=>units.push([si+1,ai+1,u]))})});
  const rkSet={},rkNo={},rkCnt={},rkPara={};let prevEnd={},cntS={};
  const isJuzStart=(s,a)=>JUZ.some(x=>x[0]===s&&x[1]===a);
  /* ruku numbering: within surah + within para + ayat count */
  let lastS=0,lastA=0,inPara=0,pj=0;
  j.rk.forEach(k=>{const[s,a]=k.split(':').map(Number);const st=lastS===s?lastA+1:1;cntS[s]=(cntS[s]||0)+1;
    const jz=q15Juz(s,st);if(jz!==pj){pj=jz;inPara=0}inPara++;
    rkSet[k]=1;rkNo[k]=cntS[s];rkCnt[k]=a-st+1;rkPara[k]=inPara;lastS=s;lastA=a});
  const pg=j.pg,pages=[];let gp=0;
  for(let p=0;p<pg.length/15;p++){const lines=[];for(let l=0;l<15;l++){const c=pg[p*15+l];if(c==='-')lines.push({h:1});else{const n=parseInt(c,36);lines.push({u0:gp,u1:gp+n-1});gp+=n}}pages.push({lines})}
  /* header lines: surah of next word */
  for(let p=0;p<pages.length;p++){const L=pages[p].lines;let l=0;while(l<15){if(!L[l].h){l++;continue}let e=l;while(e<15&&L[e].h)e++;
      /* find next unit */let nu=null;for(let q=e;q<15;q++)if(!L[q].h){nu=L[q].u0;break}if(nu==null){const np=pages[p+1];if(np){const f=np.lines.find(x=>!x.h);nu=f?f.u0:null}}
      const s=nu!=null?units[nu][0]:0;const run=e-l;const withB=s!==1&&s!==9&&s!==0;if(!s){for(let q=l;q<e;q++)L[q].ht='blank';l=e;continue}
      const need=withB?2:1,off=run>2?run-need:0;for(let q=l;q<e;q++){const k=q-l-off;L[q].hs=s;L[q].ht=k<0?'blank':k===0?'name':(k===1&&withB?'bism':'blank')}
      if(run>2)for(let q=l;q<e;q++)L[q].tall=1;l=e}}
  pages.forEach((P,i)=>{const ws=P.lines.filter(x=>!x.h);if(!ws.length){P.s0=P.s1=1;P.a0=P.a1=1;return}const f=units[ws[0].u0],b=units[ws[ws.length-1].u1];P.s0=f[0];P.a0=f[1];P.s1=b[0];P.a1=b[1]});
  return{units,ayU,pages,rkSet,rkNo,rkCnt,rkPara,src:j.src}}
function q15Juz(s,a){let j=1;for(let i=0;i<JUZ.length;i++){const x=JUZ[i];if(s>x[0]||(s===x[0]&&a>=x[1]))j=i+1}return j}
/* render one unit (word + attached waqf / ayah-end) */
function q15Unit(u,s,a,cls){const ps=u.split(' ');let h=`<span class="qw">${ps[0].replace(/ /g,' ')}</span>`;
  for(let i=1;i<ps.length;i++){const x=ps[i];if(x.includes('۟'))h+=` <span class="qae" data-a="qno" data-ay="${s}:${a}">${x}</span>`;else h+=` <span class="qwq">${x}</span>`}
  return h}
function q15AyahHTML(s,a){const r=Q15.ayU[s-1][a-1];let h='';for(let i=r[0];i<=r[1];i++){const[,, u]=Q15.units[i];h+=q15Unit(u,s,a)+(i<r[1]?' ':'')}return `<span class="q15t">${h}</span>`}
const q15Bism=()=>{const r=Q15.ayU[0][0];let h='';for(let i=r[0];i<=r[1];i++){const ps=Q15.units[i][2].split(' ');h+=ps[0]+' '}return h.trim()};
/* ---- pages (replace old 20-per-para approximation) ---- */
const _qpgBuildOld=qpgBuild;
qpgBuild=function(){if(!Q15)return _qpgBuildOld();if(QPG&&QPG.q15)return QPG;
  const off=[0];for(let s=1;s<=114;s++)off.push(off[s-1]+QD.ar[s-1].length);const flat=[];for(let s=1;s<=114;s++)for(let a=1;a<=QD.ar[s-1].length;a++)flat.push([s,a,0]);QPF={off,flat};
  const idx=(s,a)=>off[s-1]+a-1;
  QPG=Q15.pages.map((P,i)=>({n:i+1,j:q15Juz(P.s0,P.a0),s0:P.s0,a0:P.a0,s1:P.s1,a1:P.a1,i0:idx(P.s0,P.a0),i1:idx(P.s1,P.a1),q15:1}));QPG.q15=1;return QPG};
const _qpgOfOld=qpgOf;
qpgOf=function(s,a){const P=qpgBuild();if(!P.q15)return _qpgOfOld(s,a);const r=Q15.ayU[s-1]&&Q15.ayU[s-1][a-1];if(!r)return 0;const u=r[0];
  for(let i=0;i<Q15.pages.length;i++){const L=Q15.pages[i].lines;for(const l of L)if(!l.h&&u>=l.u0&&u<=l.u1)return i}return 0};
function q15PageHTML(p){const P=Q15.pages[p];let h='';
  P.lines.forEach((L,li)=>{
    if(L.h){if(L.ht==='name'&&L.hs){const s=L.hs;h+=`<div class="ml15 mhd15"><div class="msb15"><span>${toAr(s)}</span><b>سُوۡرَةُ ${SN[s-1][1]}</b><span>${toAr(QD.ar[s-1].length)} ${T('آیات','آیات')}</span></div></div>`}
      else if(L.ht==='bism')h+=`<div class="ml15 mbs15">${q15Bism()}</div>`;else h+=`<div class="ml15 mbl15${L.tall?' tall':''}"></div>`;return}
    let row='',rk='';
    for(let i=L.u0;i<=L.u1;i++){const[s,a,u]=Q15.units[i];const k=s+':'+a;const end=u.includes('۟');
      row+=`<span class="mw ay${bmHas(s,a)?' bm':''}${RD.qHas(s,a)?' rd':''}" data-a="qay" data-ay="${k}">${q15Unit(u,s,a)}</span>`;
      if(end&&Q15.rkSet[k])rk=`<i class="rkm" title="${T('Ruku','Ruku')} ${Q15.rkNo[k]} • ${Q15.rkCnt[k]} ${T('ayaat','ayahs')}"><small>${toAr(Q15.rkNo[k])}</small>ع<small>${toAr(Q15.rkCnt[k])}</small></i>`}
    h+=`<div class="ml15 mtx" data-n="${L.u1-L.u0+1}">${row}${rk}</div>`});
  return h}
function q15Fit(){const box=document.querySelector('.mus-in.q15');if(!box)return;const cw=box.clientWidth-30;if(cw<=0)return;
  const cx=q15Fit.cx||(q15Fit.cx=document.createElement('canvas').getContext('2d'));cx.font='24px IPQ';let mx=0;
  box.querySelectorAll('.mtx').forEach(l=>{const w=cx.measureText(l.innerText.replace(/\s+/g,' ')).width;l.dataset.w=w;mx=Math.max(mx,w)});
  if(!mx)return;const fs=Math.max(13,Math.min(cw/17,24*cw/(mx*1.06)));box.style.setProperty('--q15',fs.toFixed(1)+'px');
  box.querySelectorAll('.mtx').forEach(l=>{l.classList.toggle('short',(+l.dataset.w||0)<mx*.72)})}
window.addEventListener('resize',()=>{try{q15Fit()}catch(e){}});
const _mpBuild=mpBuild;
mpBuild=async function(pg){if(!pg||!pg.q15||!Q15)return _mpBuild(pg);try{if(document.fonts&&document.fonts.load)await document.fonts.load('24px IPQ')}catch(e){}return q15PageHTML(pg.n-1)};
const _rm15=renderMushaf;
renderMushaf=async function(el){if(!Q15){try{await q15Load()}catch(e){}QPG=null}await _rm15(el);
  const box=el&&el.querySelector('.mus-in');if(box&&Q15){box.classList.add('q15');q15Fit();setTimeout(q15Fit,150);setTimeout(q15Fit,600)}
  const gi=el&&el.querySelector('#mpgn');if(gi&&Q15){const P=qpgBuild();gi.min=1;gi.max=P.length;const lab=gi.nextElementSibling;if(lab)lab.textContent='/ '+P.length;gi.onchange=()=>{const n=Math.max(1,Math.min(P.length,+gi.value||1));QS.gp=n-1;QPA.left=1;saveQS();renderMushaf(el)}}};
/* scroll view: same exact text when IndoPak Hafizi font is chosen */
const _rr15=renderReader;
renderReader=async function(el){if(QS.pg||!Q15ON())return _rr15(el);
  const s=QS.s,keep=QD.ar[s-1];QD.ar[s-1]=keep.map((_,i)=>q15AyahHTML(s,i+1));
  try{await _rr15(el)}finally{QD.ar[s-1]=keep}
  el.querySelectorAll('.ayno').forEach(x=>{x.remove()})};
/* source note */
window.Q15SRC=()=>Q15?Q15.src:'';

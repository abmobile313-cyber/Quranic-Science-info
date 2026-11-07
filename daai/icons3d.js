'use strict';
/* ===== 3D icons (Microsoft Fluent Emoji 3D, MIT license) — poore app ke emoji/icons 3D mein ===== */
const E3={map:null,on:()=>S.ic3d!==false};
fetch('e3d/map.json').then(r=>r.json()).then(m=>{E3.map=m;E3.keys=Object.keys(m).sort((a,b)=>b.length-a.length);E3.re=new RegExp('('+E3.keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\uFE0F?','gu');e3Scan(document.body)}).catch(()=>{});
const E3SKIP=/^(INPUT|TEXTAREA|SELECT|OPTION|SCRIPT|STYLE|SVG|CODE|NOSCRIPT)$/;
function e3Scan(root){if(!E3.map||!E3.on()||!root)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||E3SKIP.test(p.tagName)||p.closest('.mus-in,.q-ar,.qw,.ml15,textarea,select,[contenteditable],.noe3,svg,#splash'))return NodeFilter.FILTER_REJECT;E3.re.lastIndex=0;return E3.re.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});
  const L=[];let n;while((n=tw.nextNode()))L.push(n);
  L.forEach(t=>{const s=t.nodeValue;const f=document.createDocumentFragment();let i=0;E3.re.lastIndex=0;let m;
    while((m=E3.re.exec(s))){if(m.index>i)f.appendChild(document.createTextNode(s.slice(i,m.index)));const k=m[1];const im=document.createElement('img');im.className='e3';im.src='e3d/'+E3.map[k]+'.webp';im.alt=k;im.draggable=false;im.onerror=()=>{im.replaceWith(document.createTextNode(k))};f.appendChild(im);i=m.index+m[0].length}
    if(i<s.length)f.appendChild(document.createTextNode(s.slice(i)));t.replaceWith(f)})}
let e3T=0;const e3Obs=new MutationObserver(ms=>{if(e3T)return;e3T=requestAnimationFrame(()=>{e3T=0;const roots=new Set();ms.forEach(m=>{const r=m.target.nodeType===1?m.target:m.target.parentElement;if(r)roots.add(r)});roots.forEach(r=>{if(document.contains(r))e3Scan(r)})})});
function e3Start(){e3Obs.observe(document.body,{childList:true,subtree:true,characterData:true});e3Scan(document.body)}
if(document.body)e3Start();else document.addEventListener('DOMContentLoaded',e3Start);
/* ---- dock, header, floating buttons: 3D tiles ---- */
const UI3={home:'home',biz:'biz',deen:'deen',kaam:'kaam',office:'office',more:'more'};
const ui3=(k,c='ui3')=>`<img class="${c}" src="e3d/ui/${k}.webp" alt="" draggable="false">`;
{const _bd=buildDock;buildDock=function(){_bd();if(!E3.on())return;document.querySelectorAll('#dock button[data-a=tab]').forEach(b=>{const k=UI3[b.dataset.v];const sv=b.querySelector('svg');if(k&&sv)sv.outerHTML=ui3(k,'ui3 dk3')})}}
{const _uh=updHdr;updHdr=function(){_uh();if(!E3.on())return;const s=$('#bSnd');if(s)s.innerHTML=S.sfx?ui3('spk'):`<span style="position:relative;display:inline-flex">${ui3('spk')}<i class="mute3"></i></span>`;const t=$('#bTheme');if(t)t.innerHTML=ui3(S.theme==='light'?'moon':'sun')}}
function e3Hdr(){if(!E3.on())return;const l=$('#bLang');if(l&&!l.querySelector('.ui3'))l.innerHTML=ui3('globe');const b=$('#bBell');if(b&&!b.querySelector('.ui3')){const n=b.querySelector('#bellN');b.innerHTML=ui3('bell');if(n)b.appendChild(n)}
  const f=$('#fab');if(f&&!f.querySelector('.ai3'))f.innerHTML=`<span class="ai3"><img src="e3d/ui/ai.webp" alt="My Assistant" draggable="false"></span>`;
  const c=document.getElementById('calcfab');if(c&&!c.querySelector('.ui3'))c.innerHTML=ui3('calc')}
setTimeout(()=>{try{buildDock();updHdr();e3Hdr()}catch(e){}},50);setTimeout(()=>{try{e3Hdr()}catch(e){}},1500);

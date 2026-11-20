/* Build 17: in Urdu mode every number is shown in Urdu digits ۰۱۲۳۴۵۶۷۸۹ */
(function(){
  var U='۰۱۲۳۴۵۶۷۸۹', on=false, busy=false;
  var skip={SCRIPT:1,STYLE:1,TEXTAREA:1,INPUT:1,CODE:1,NOSCRIPT:1};
  function toU(s){ if(/@|https?:|www\./.test(s)) return s; return s.replace(/[0-9]/g,function(d){return U[d];});}
  function toL(s){return s.replace(/[۰-۹]/g,function(d){return String(U.indexOf(d));});}
  function walk(root,f){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,arr=[];
    while((n=w.nextNode())){ var p=n.parentNode; if(p&&skip[p.nodeName]) continue; if(p&&p.closest&&p.closest('[data-nodig]')) continue; arr.push(n); }
    arr.forEach(function(t){var v=t.nodeValue,r=f(v); if(r!==v) t.nodeValue=r;});
  }
  function run(root){ if(busy) return; busy=true; try{ walk(root||document.body,on?toU:toL); }finally{ busy=false; } }
  function sync(){ var now=document.body.classList.contains('l-ur'); if(now!==on){ on=now; run(); } }
  function boot(){
    var mo=new MutationObserver(function(ms){
      if(busy) return; sync();
      if(!on) return;
      busy=true; try{ ms.forEach(function(m){ if(m.type==='characterData'){ var t=m.target,v=t.nodeValue,r=toU(v); if(r!==v) t.nodeValue=r; } else m.addedNodes.forEach(function(n){ if(n.nodeType===3){ var v=n.nodeValue,r=toU(v); if(r!==v) n.nodeValue=r; } else if(n.nodeType===1) walk(n,toU); }); }); }finally{ busy=false; }
    });
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

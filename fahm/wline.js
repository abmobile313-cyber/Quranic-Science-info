/* Build 17: the word box shows ONE line of the ayah at a time and follows the active word line by line */
(function(){
  var busy=false;
  function fit(){
    var w=document.getElementById('words'); if(!w||!w.children.length||busy) return; busy=true;
    try{
      if(!w.classList.contains('line')) w.classList.add('line');
      var kids=[].slice.call(w.children), on=w.querySelector('.w.on')||kids[0], top=on.offsetTop;
      var row=kids.filter(function(k){return Math.abs(k.offsetTop-top)<6;}), h=0; row.forEach(function(k){h=Math.max(h,k.offsetHeight);});
      var cs=getComputedStyle(w), pt=parseFloat(cs.paddingTop)||0, pb=parseFloat(cs.paddingBottom)||0;
      var H=Math.round(h+pt+pb); if(w.style.height!==H+'px') w.style.height=H+'px';
      try{ var key=on.dataset.i+'|'+on.textContent; if(window.FahmWS&&fit.k!==key){ fit.k=key; var ii=+on.dataset.i; FahmWS.miniSet(ii); if(FahmWS.isOpen()) FahmWS.set(ii); } }catch(e){}
      var t=Math.max(0,top-pt); if(Math.abs(w.scrollTop-t)>2) w.scrollTop=t;
    }finally{ setTimeout(function(){busy=false;},0); }
  }
  function boot(){
    var w=document.getElementById('words'); if(!w) return;
    var tm; function later(){ clearTimeout(tm); tm=setTimeout(fit,30); }
    new MutationObserver(later).observe(w,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    window.addEventListener('resize',later); window.addEventListener('orientationchange',later);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(later);
    later();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

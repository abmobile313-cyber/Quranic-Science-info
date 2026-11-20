/* Build 17: social icons in a clean "icon pack" style (gradient disc + soft ring + white glyph) */
(function(){
  function disc(id,c1,c2,ring){return '<defs><linearGradient id="g'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient><linearGradient id="r'+id+'" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+ring+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#r'+id+')"/><circle cx="32" cy="32" r="26" fill="url(#g'+id+')"/><path d="M9 26a24 24 0 0 1 46 0c-8-7-38-7-46 0z" fill="#fff" opacity=".12"/>';}
  var I={
    yt:'<svg viewBox="0 0 64 64">'+disc('yt','#8a2040','#2a0912','#e8c470')+'<rect x="15" y="21" width="34" height="22" rx="7" fill="#f6e7b8"/><path d="M28 26.500v11l10-5.500z" fill="#4a1226"/></svg>',
    ig:'<svg viewBox="0 0 64 64"><defs><linearGradient id="gig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8a2040"/><stop offset="1" stop-color="#2a0912"/></linearGradient><linearGradient id="rig" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e8c470"/><stop offset="1" stop-color="#2a0912"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#rig)"/><circle cx="32" cy="32" r="26" fill="url(#gig)"/><path d="M9 26a24 24 0 0 1 46 0c-8-7-38-7-46 0z" fill="#fff" opacity=".12"/><rect x="18.500" y="18.500" width="27" height="27" rx="8" fill="none" stroke="#f6e7b8" stroke-width="3.200"/><circle cx="32" cy="32" r="6.500" fill="none" stroke="#f6e7b8" stroke-width="3.200"/><circle cx="39.500" cy="24.500" r="2" fill="#f6e7b8"/></svg>',
    fb:'<svg viewBox="0 0 64 64">'+disc('fb','#8a2040','#2a0912','#e8c470')+'<path d="M34.500 49V33.500h5.200l.9-6h-6.100v-3.800c0-1.700.6-2.900 3.100-2.900h3.200V15.600c-.6-.1-2.500-.3-4.700-.3-4.600 0-7.700 2.800-7.700 7.900v4.300h-5.200v6h5.200V49z" fill="#f6e7b8"/></svg>',
    wa:'<svg viewBox="0 0 64 64">'+disc('wa','#8a2040','#2a0912','#e8c470')+'<path d="M17.500 47.500l2.500-8.900A15 15 0 1 1 26.500 45z" fill="none" stroke="#f6e7b8" stroke-width="3.200" stroke-linejoin="round"/><path d="M26.300 24.500c-.9 1.600-.5 3.600 1.300 6.100 2.100 3 4.700 4.700 7 5.400 1.700.5 3.200-.4 3.900-1.900l-3.200-2.100-1.500 1c-1.500-.5-3.400-2.400-4.200-3.900l1.100-1.400-1.900-3.600z" fill="#f6e7b8"/></svg>',
    bmail:'<svg viewBox="0 0 64 64">'+disc('ml','#8a2040','#2a0912','#e8c470')+'<rect x="16" y="21" width="32" height="22" rx="4.500" fill="#f6e7b8"/><path d="M18 24.500l14 10.500 14-10.500" fill="none" stroke="#4a1226" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    web:'<svg viewBox="0 0 64 64">'+disc('wb','#8a2040','#2a0912','#e8c470')+'<image href="icons/qs-logo.webp" x="12" y="12" width="40" height="40" clip-path="circle(20px at 20px 20px)"/></svg>'
  };
  function apply(){
    document.querySelectorAll('.tile').forEach(function(t){
      var k=['yt','ig','fb','wa','bmail','web'].filter(function(c){return t.classList.contains(c);})[0], ti=t.querySelector('.ti'); if(!k||!ti||ti.dataset.s17) return; ti.innerHTML=I[k]; ti.dataset.s17=1;
    });
  }
  function boot(){ new MutationObserver(function(){clearTimeout(boot.t);boot.t=setTimeout(apply,40);}).observe(document.body,{childList:true,subtree:true}); apply(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

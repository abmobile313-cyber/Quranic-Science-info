/* Build 16: brand strip + button labels in header */
(function(){
  function go(){
    var top=document.querySelector('.top'), a=document.getElementById('tApp'); if(!top||!a) return;
    if(a.parentNode!==top){ a.textContent='Fahmul Quraan by Quranic Science'; top.insertBefore(a, top.firstChild); }
    top.classList.add('hdr16');
    ['btnMenu','btnLang','btnTheme','btnRead','btnSet'].forEach(function(id){var b=document.getElementById(id); if(b&&!b.querySelector('.hl')){var e=document.createElement('em'); e.className='hl'; e.setAttribute('data-k',id); b.appendChild(e);}});
  }
  function relabel(){ go(); }
  setInterval(function(){ var t=document.querySelector('.top'); if(!t) return; ['btnLang','btnTheme'].forEach(function(id){var b=document.getElementById(id); if(b&&!b.querySelector('.hl')){var e=document.createElement('em'); e.className='hl'; e.setAttribute('data-k',id); b.appendChild(e);}}); },700);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();

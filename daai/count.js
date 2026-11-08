/* Anonymous usage count (GoatCounter, no cookies, no personal data). Only: "new device" once, and "opened today" once a day. */
(function(){const GC='https://deensaathi.goatcounter.com/count';
 function hit(p,t,r){try{if(!navigator.onLine)return;const q='?p='+encodeURIComponent(p)+'&t='+encodeURIComponent(t||p)+(r?'&r='+encodeURIComponent(r):'')+'&rnd='+Math.random().toString(36).slice(2);const i=new Image();i.referrerPolicy='no-referrer';i.src=GC+q}catch(e){}}
 function plat(){return window.Android?'android-app':(matchMedia&&matchMedia('(display-mode: standalone)').matches?'installed-web':'browser')}
 function src(){try{const u=new URL(location.href);const s=u.searchParams.get('s')||u.searchParams.get('utm_source');if(s){localStorage.setItem('pa_src',s);return s}const o=localStorage.getItem('pa_src');if(o)return o;const r=document.referrer;if(r&&!r.includes(location.host)){const h=new URL(r).hostname;localStorage.setItem('pa_src',h);return h}}catch(e){}return window.Android?'apk':'direct'}
 function run(){try{const s=src(),pl=plat();
  if(!localStorage.getItem('pa_cnt_new')){localStorage.setItem('pa_cnt_new','1');hit('/new/'+pl,'New device ('+pl+')',s);hit('/source/'+s,'Came from: '+s)}
  const d=new Date().toISOString().slice(0,10);if(localStorage.getItem('pa_cnt_day')!==d){localStorage.setItem('pa_cnt_day',d);hit('/open/'+pl,'Opened today ('+pl+')')}
  const l=(window.S&&S.lang)||'';if(l&&localStorage.getItem('pa_cnt_lang')!==l){localStorage.setItem('pa_cnt_lang',l);hit('/lang/'+l,'Language: '+l)}}catch(e){}}
 window.addEventListener('load',()=>setTimeout(run,4000));
})();

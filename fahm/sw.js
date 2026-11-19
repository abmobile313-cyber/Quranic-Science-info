const V='fahm-v7';
const SHELL=['./','index.html','style.css','app.js','sfx.js','story3d.js','story3da.js','engine.js','scenes.js','three.min.js','lab.js','labmotifs.js','labm2a.js','labm2b.js','labm2c.js','labm2d.js','labv.js','labspecs.js','lemspecs.js','lemspecs2.js','i18n.js','reciters.js','hafiz.js','reader.js','mushaf.json','fonts/dkindopak.woff2','content_ur.js','data.json','video/manifest.json','manifest.webmanifest','fonts/amiri-quran.woff2','fonts/nastaliq.woff2','fonts/devanagari.woff2','fonts/scheherazade.woff2','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
e.respondWith(caches.match(e.request).then(r=>{const net=fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp))}return n}).catch(()=>r);return r||net}))});

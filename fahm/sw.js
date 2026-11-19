const V='fahm-v3';
const SHELL=['./','index.html','style.css','app.js','sfx.js','story3d.js','story3da.js','engine.js','scenes.js','three.min.js','lab.js','labmotifs.js','labv.js','labspecs.js','lemspecs.js','i18n.js','content_ur.js','data.json','manifest.webmanifest','fonts/amiri-quran.woff2','fonts/nastaliq.woff2','fonts/devanagari.woff2','fonts/scheherazade.woff2','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
e.respondWith(caches.match(e.request).then(r=>{const net=fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp))}return n}).catch(()=>r);return r||net}))});

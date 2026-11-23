const V='qaida-v3';
const CORE=['./','index.html','app.css','check.js','app.js','rec.js','upd.js','q/qaida.json','q/audio.json','q/qmatch.json','q/hid.json','fonts/dkindopak.woff2','fonts/nastaliq.woff2','fonts/naskh7.woff2','fonts/scheherazade.woff2','icons/icon-192.png','icons/icon-512.png','whatsnew.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x.startsWith('qaida')).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=e.request.url;if(e.request.method!=='GET')return;
 if(u.includes('audio.qurancdn.com')||u.includes('/a/')){e.respondWith(caches.open(V+'-au').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}))));return}
 if(new URL(u).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(n=>{if(n.ok){const cl=n.clone();caches.open(V).then(c=>c.put(e.request,cl))}return n}).catch(()=>caches.match(e.request)))});

/* Al Aswad Dubai app: installable, opens fast, main page works offline */
const C="aa-v6";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./"])).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin||!u.pathname.startsWith(new URL("./",self.registration.scope).pathname))return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("./"))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r)))});

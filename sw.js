/* Quranic Science app: works offline after the first visit and always shows the newest website when online. */
const C = "qs-app-v1", CORE = ["/", "/index.html", "/site.webmanifest", "/icon-192.png", "/logo.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return; /* Firebase, Drive, YouTube etc. always go to the network */
  if (r.mode === "navigate" || u.pathname === "/" || u.pathname.endsWith(".html")) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put("/", cp)); return res; }).catch(() => caches.match("/").then(m => m || caches.match("/index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })));
});

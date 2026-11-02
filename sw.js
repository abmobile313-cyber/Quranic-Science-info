/* Quranic Science app: works offline after the first visit and always shows the newest website when online. */
const C = "qs-app-v6", CORE = ["/", "/index.html", "/site.webmanifest", "/icon-192.png", "/logo.png", "/qs-pages.css"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return; /* Firebase, Drive, YouTube etc. always go to the network */
  if (r.mode === "navigate" || u.pathname === "/" || u.pathname.endsWith(".html")) {
    /* every page (home, course pages, articles) is cached under its own address, so an article never replaces the home page offline */
    const key = u.pathname === "/" || u.pathname === "/index.html" ? "/" : u.pathname;
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(key, cp)); } return res; })
      .catch(() => caches.match(key).then(m => m || caches.match("/")).then(m => m || caches.match("/index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })));
});
/* free class alerts (sent by the automation through Firebase Cloud Messaging) */
self.addEventListener("push", e => {
  let j = {}; try { j = e.data ? e.data.json() : {}; } catch (x) { j = { data: { body: e.data ? e.data.text() : "" } }; }
  const d = Object.assign({}, j.notification || {}, j.data || {});
  e.waitUntil(self.registration.showNotification(d.title || "Quranic Science", { body: d.body || "", icon: "/icon-192.png", badge: "/favicon-96.png", tag: d.tag || undefined, data: { url: d.url || "/" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close(); const url = (e.notification.data || {}).url || "/";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => { const w = ws.find(x => x.url.startsWith(self.location.origin)); if (w && url.startsWith(self.location.origin)) { return w.navigate(url).then(x => (x || w).focus()).catch(() => w.focus()); } return clients.openWindow(url); }));
});

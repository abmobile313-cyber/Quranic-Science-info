/* Quranic Science app: opens instantly from the saved copy, updates itself in the background, works offline. */
const C = "qs-app-v18", CORE = ["/", "/index.html", "/site.webmanifest", "/icon-192.png", "/logo-sm.webp", "/logo-intro.webp", "/qs-pages.css"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C && k !== "qs-x" && !/^(qsai|qscr)/.test(k)).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method === "GET" && (u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com" || (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/")))) { /* fonts + sign-in library: saved on first use, so the app opens fast and offline */
    e.respondWith((async () => { const c = await caches.open("qs-x"), hit = await c.match(r);
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) c.put(r, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; } return (await net) || Response.error(); })()); return; }
  if (r.method !== "GET" || u.origin !== location.origin) return; /* Firebase, Drive, YouTube etc. always go to the network */
  if (r.mode === "navigate" || u.pathname === "/" || u.pathname.endsWith(".html")) {
    /* every page (home, course pages, articles) is cached under its own address, so an article never replaces the home page offline */
    const key = u.pathname === "/" || u.pathname === "/index.html" ? "/" : u.pathname;
    /* the saved copy opens at once (no waiting on the network); the newest copy is fetched in the background, and if it changed the open page reloads itself once */
    const saved = () => caches.match(key).then(m => m || caches.match("/")).then(m => m || caches.match("/index.html"));
    const tag = x => x && (x.headers.get("etag") || x.headers.get("last-modified") || "");
    e.respondWith((async () => {
      const old = await caches.match(key);
      const net = fetch(r).then(async res => { if (res.ok) { const c = await caches.open(C); await c.put(key, res.clone()); if (old && tag(old) && tag(res) && tag(old) !== tag(res)) { const cs = await self.clients.matchAll({ type: "window" }); cs.forEach(w => w.postMessage({ qsUpdate: key })); } } return res; });
      e.waitUntil(net.then(() => {}, () => {}));
      if (old) return old;
      try { return await Promise.race([net, new Promise((_, no) => setTimeout(no, 4000))]); } catch (x) { return (await saved()) || net; }
    })());
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

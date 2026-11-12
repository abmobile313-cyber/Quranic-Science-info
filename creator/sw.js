/* Creator Courses · Quranic Science AI — offline shell. */
const V = "qscr-v1", SHELL = ["./", "index.html", "class.js?v=1", "app.js?v=1", "creator.js?v=1", "icon-192.png", "icon-512.png", "manifest.webmanifest", "data/editing.json", "data/content.json", "data/design.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("qscr-v") && k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.hostname.endsWith("workers.dev") || u.hostname.includes("googleapis") || u.hostname.includes("gstatic") && u.pathname.includes("firebase-ai")) return;
  const isData = u.origin === location.origin && /\/creator\/(data\/.*\.bin|vo\/)/.test(u.pathname);
  e.respondWith((async () => {
    if (isData || /everyayah|qurancdn/.test(u.hostname)) { const hit = await caches.match(r, { ignoreSearch: false }); if (hit) return hit; }
    try { const res = await fetch(r); if (res.ok && u.origin === location.origin && !isData) { const c = await caches.open(V); c.put(r, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(r) || (r.mode === "navigate" ? await caches.match("index.html") : null); if (hit) return hit; throw err; }
  })());
});

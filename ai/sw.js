/* Learn with Quranic Science AI — offline shell. Saved courses live in "qsai-off-<course>" caches (encrypted lessons). */
const V = "qsai-v29", SHELL = ["./", "index.html", "class.js?v=2", "app.js?v=26", "data/qaida.json?v=1", "mouth.js?v=2", "mouth3d.js?v=3", "mk/mkb.webp", "mk/mkp.webp", "mk/mkm.png", "makharij.webp", "icon-192.png", "icon-512.png", "manifest.webmanifest", "data/tajweed.json", "data/arabic.json", "data/free.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("qsai-v") && k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.hostname.endsWith("workers.dev") || u.hostname.includes("googleapis") || u.hostname.includes("gstatic") && u.pathname.includes("firebase-ai")) return;
  const isData = u.origin === location.origin && /\/ai\/(data\/.*\.bin|vo\/)/.test(u.pathname);
  e.respondWith((async () => {
    if (isData || /everyayah|qurancdn/.test(u.hostname)) { const hit = await caches.match(r, { ignoreSearch: false }); if (hit) return hit; }
    try { const res = await fetch(r); if (res.ok && u.origin === location.origin && !isData) { const c = await caches.open(V); c.put(r, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(r) || (r.mode === "navigate" ? await caches.match("index.html") : null); if (hit) return hit; throw err; }
  })());
});

/* Learn with Quranic Science AI — offline shell. Saved courses live in "qsai-off-<course>" caches (encrypted lessons). */
const V = "qsai-v63", SHELL = ["./", "index.html", "class.js?v=7", "ustad.js?v=7", "ustad/v_closed.webp?v=2", "ustad/thumb.webp?v=2", "apple-touch-icon.png", "app.js?v=50", "mouthclip.js?v=2", "mk/clips.json", "mk/lips.json", "livesync.js?v=1", "icons.js?v=1", "theme.css?v=4", "fonts/indopak.woff2", "fonts/inter-400.woff2", "fonts/inter-600.woff2", "fonts/inter-700.woff2", "coach.js?v=10", "coach-core.js?v=1", "data/qaida.json?v=1", "mouth.js?v=2", "mouth3d.js?v=7", "mk/mkb.webp", "mk/mkp.webp", "mk/mkm.png", "makharij.webp", "icon-192.png", "icon-512.png", "manifest.webmanifest", "data/tajweed.json", "data/arabic.json", "data/free.json"];
const XC = "qsai-x", FBJS = ["app", "auth", "firestore"].map(n => "https://www.gstatic.com/firebasejs/10.12.2/firebase-" + n + "-compat.js");
const isXO = u => u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com" || (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/"));
self.addEventListener("install", e => { e.waitUntil((async () => {
  const c = await caches.open(V); await Promise.all(SHELL.map(f => c.add(f).catch(() => {}))); /* one missing file must not stop the rest */
  const x = await caches.open(XC); await Promise.all(FBJS.map(f => fetch(f, { mode: "no-cors" }).then(r => x.put(f, r)).catch(() => {})));
})()); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("qsai-v") && k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (isXO(u)) { /* fonts + sign-in library: saved on first use so the app also opens with no internet */
    e.respondWith((async () => { const c = await caches.open(XC), hit = await c.match(r);
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) c.put(r, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; } return (await net) || Response.error(); })()); return; }
  if (u.hostname.endsWith("workers.dev") || u.hostname.includes("googleapis") || u.hostname.includes("gstatic")) return;
  if (r.headers.has("range") && /\.(mp4|webm)$/.test(u.pathname)) return; /* video range requests go straight to the network */
  const isData = u.origin === location.origin && /\/ai\/(data\/.*\.bin|vo\/)/.test(u.pathname);
  e.respondWith((async () => {
    if (isData || /everyayah|qurancdn/.test(u.hostname)) { const hit = await caches.match(r, { ignoreSearch: false }); if (hit) return hit; }
    if (u.origin === location.origin && !isData) {
      if (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith(".html")) { /* the page itself: always the newest (2 s at most), else the saved copy */
        try { const res = await Promise.race([fetch(r), new Promise((_, no) => setTimeout(no, 2000))]); if (res.ok) { const c = await caches.open(V); c.put(r, res.clone()); } return res; }
        catch (err) { const hit = await caches.match(r) || await caches.match("index.html"); if (hit) return hit; throw err; }
      }
      /* scripts, styles, pictures: the saved copy opens at once; files without a version number are also refreshed quietly */
      const hit = await caches.match(r);
      if (hit) { if (!u.search) e.waitUntil(fetch(r).then(async res => { if (res.ok) { const c = await caches.open(V); await c.put(r, res); } }).catch(() => {})); return hit; }
    }
    try { const res = await fetch(r); if (res.ok && u.origin === location.origin && !isData) { const c = await caches.open(V); c.put(r, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(r) || (r.mode === "navigate" ? await caches.match("index.html") : null); if (hit) return hit; throw err; }
  })());
});

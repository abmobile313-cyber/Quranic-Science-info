/* Creator Courses · Quranic Science AI — offline shell. */
const V = "qscr-v31", SHELL = ["./", "index.html", "class.js?v=4", "app.js?v=17", "icons.js?v=1", "theme.css?v=2", "ustad.js?v=8", "ustad/v_closed.webp?v=3", "ustad/thumb.webp?v=3", "apple-touch-icon.png", "creator.js?v=2", "board.js?v=1", "apps.js?v=7", "screens.js?v=5", "scene.js?v=10", "livesync.js?v=5", "icon-192.png", "icon-512.png", "manifest.webmanifest", "data/editing.json", "data/content.json", "data/design.json"];
const XC = "qscr-x", FBJS = ["app", "auth", "firestore"].map(n => "https://www.gstatic.com/firebasejs/10.12.2/firebase-" + n + "-compat.js");
const isXO = u => u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com" || (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/"));
self.addEventListener("install", e => { e.waitUntil((async () => {
  const c = await caches.open(V); await Promise.all(SHELL.map(f => c.add(f).catch(() => {}))); /* one missing file must not stop the rest */
  const x = await caches.open(XC); await Promise.all(FBJS.map(f => fetch(f, { mode: "no-cors" }).then(r => x.put(f, r)).catch(() => {})));
})()); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("qscr-v") && k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (isXO(u)) { /* fonts + sign-in library: saved on first use so the app also opens with no internet */
    e.respondWith((async () => { const c = await caches.open(XC), hit = await c.match(r);
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) c.put(r, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; } return (await net) || Response.error(); })()); return; }
  if (u.hostname.endsWith("workers.dev") || u.hostname.includes("googleapis") || u.hostname.includes("gstatic")) return;
  const isData = u.origin === location.origin && /\/creator\/(data\/.*\.bin|vo\/)/.test(u.pathname);
  e.respondWith((async () => {
    if (isData || /everyayah|qurancdn/.test(u.hostname)) { const hit = await caches.match(r, { ignoreSearch: false }); if (hit) return hit; }
    if (u.origin === location.origin && !isData) { /* app files: open the saved copy at once, refresh it quietly for next time */
      const hit = await caches.match(r);
      if (hit) { e.waitUntil(fetch(r).then(async res => { if (res.ok) { const c = await caches.open(V); await c.put(r, res); } }).catch(() => {})); return hit; }
    }
    try { const res = await fetch(r); if (res.ok && u.origin === location.origin && !isData) { const c = await caches.open(V); c.put(r, res.clone()); } return res; }
    catch (err) { const hit = await caches.match(r) || (r.mode === "navigate" ? await caches.match("index.html") : null); if (hit) return hit; throw err; }
  })());
});

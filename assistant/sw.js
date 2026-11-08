const V = 'pa-v45';
const SHELL = ['./','./index.html','./style.css','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./badge-96.png','./i18n.js','./deva-400.woff2','./deva-600.woff2','./deva-700.woff2','./logos/qs.webp','./logos/fs.webp','./logos/aa.webp','./logos/sk.webp','./logos/bn.webp',
  './core.js','./yearly.js','./labels.js','./rmode.js','./lang2.js','./i18n2.js','./dv-ur.json','./night.js','./aifix.js','./sched.js','./daily.js','./quran.js','./deen.js','./biz.js','./work.js','./kutub.js','./books.js','./dawat.js','./kbook.js','./pbook.js','./extras.js','./tips.js','./alarm.js','./pdf.js','./duty.js','./deliver.js','./salary.js','./tour.js','./money.js','./ai.js','./tts.js','./hf.js','./noor2.js','./lock.js','./native.js','./report.js','./main.js','./office.js','./hachifeel.webp','./quran2.js','./quran15.js','./ip15.woff2','./q15.json','./juma.js','./icons3d.js','./e3d/map.json','./muhammadi.woff2','./noorehira.woff2',
  './inter-400.woff2','./inter-600.woff2','./inter-700.woff2','./outfit-600.woff2','./outfit-700.woff2','./mono-500.woff2',
  './indopak.woff2','./amiriq.woff2','./naskh.woff2','./naskh-b.woff2','./mehr.woff2','./me.webp'];
const DATA = ['q-indopak.json','taqi.json','tr-hi.json','tr-en.json','tr-ur.json','hayat1.json','hayat2.json','hayat3.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(async c => {
    await Promise.all(SHELL.map(u => c.add(u).catch(() => {})));
    DATA.forEach(u => c.add(u).catch(() => {}));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const u = new URL(req.url);
  if (u.origin !== location.origin && !/gstatic\.com\/firebasejs/.test(u.href)) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); } return r; });
      if (hit) { net.catch(() => {}); return hit; }
      return net.catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : new Response('', { status: 504 })));
    })
  );
});
self.addEventListener('notificationclick', e => {
  const d = e.notification.data || {};
  e.notification.close();
  const url = e.action ? './?qa=' + encodeURIComponent(e.action) : (d.q ? './?qa=' + encodeURIComponent(d.q + ':open') : (d.tab ? './?tab=' + d.tab + (d.sub ? '&sub=' + d.sub : '') : './'));
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    if (l.length) {
      const c = l[0];
      if (e.action) { const [id, b] = e.action.split(':'); c.postMessage({ type: 'qans', id, b }); }
      else if (d.tab) c.postMessage({ type: 'go', tab: d.tab, sub: d.sub });
      return c.focus();
    }
    return clients.openWindow(url);
  }));
});

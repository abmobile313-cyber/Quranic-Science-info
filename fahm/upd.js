/* Fahm update system: until the Play Store listing, new builds are published at quranicscience.info/download.
   The app compares its own versionCode with download/fahm-version.json, shows a banner and an Android notification. */
(function () {
  'use strict';
  const URL = 'https://quranicscience.info/download/fahm-version.json';
  const L = {
    ru: { t: 'Naya update aa gaya', b: 'Fahmul Quraan ka naya version tayyar hai. Update karein — nayi cheezein aur sudhaar.', go: 'Update karein', later: 'Baad mein', ok: 'Aap sabse naye version par hain', chk: 'Update check karein', how: 'Download hone ke baad file kholein aur "Install / Update" dabayein. Aap ka data mehfooz rahega.' },
    ur: { t: 'نیا اپڈیٹ آ گیا', b: 'فہم القرآن کا نیا ورژن تیار ہے۔ اپڈیٹ کریں — نئی چیزیں اور بہتری۔', go: 'اپڈیٹ کریں', later: 'بعد میں', ok: 'آپ سب سے نئے ورژن پر ہیں', chk: 'اپڈیٹ چیک کریں', how: 'ڈاؤن لوڈ کے بعد فائل کھولیں اور "Install / Update" دبائیں۔ آپ کا ڈیٹا محفوظ رہے گا۔' },
    en: { t: 'New update available', b: 'A new version of Fahmul Quraan is ready. Update for new features and fixes.', go: 'Update now', later: 'Later', ok: 'You are on the latest version', chk: 'Check for update', how: 'When the download finishes, open the file and tap "Install / Update". Your data stays safe.' }
  };
  const ui = () => { try { return window.__fahmApp.st().ui || 'ru'; } catch (e) { return 'ru'; } };
  const T = () => L[ui()] || L.ru;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const mine = () => { try { return window.FahmAndroid && FahmAndroid.appVersion ? +FahmAndroid.appVersion() : 0; } catch (e) { return 0; } };
  const LS = 'fahm.upd';
  const rd = () => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } };
  const wr = o => { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) { } };
  function open(url) { try { if (window.FahmAndroid && FahmAndroid.openUrl) { FahmAndroid.openUrl(url); return; } } catch (e) { } try { window.open(url, '_blank'); } catch (e) { location.href = url; } }
  function banner(v) {
    const t = T(), n = v.notes && (v.notes[ui()] || v.notes.ru || v.notes.en);
    let b = document.getElementById('upd'); if (b) b.remove();
    b = document.createElement('div'); b.id = 'upd'; if (ui() === 'ur') b.dir = 'rtl';
    b.innerHTML = `<div class="upd-c"><b>🎉 ${esc(t.t)} · ${esc(v.name || '')}</b><p>${esc(n || t.b)}</p><small>${esc(t.how)}</small><div class="upd-b"><button data-u="later">${esc(t.later)}</button><button class="on" data-u="go">⬇ ${esc(t.go)}</button></div></div>`;
    b.addEventListener('click', e => { const k = e.target.closest('[data-u]'); if (!k) return; if (k.dataset.u === 'go') open(v.apk); const o = rd(); o.later = Date.now(); wr(o); b.remove(); try { window.FahmOverlays && FahmOverlays.remove && FahmOverlays.remove('upd'); } catch (er) { } });
    document.body.appendChild(b);
  }
  async function check(manual) {
    const me = mine();
    if (!me) { if (manual) toast(T().ok); return; } /* browser / PWA: the service worker updates itself */
    let v = null; try { v = await fetch(URL + '?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : null); } catch (e) { v = null; }
    if (!v || !v.code) { if (manual) toast('Internet check karein'); return; }
    if (+v.code <= me) { if (manual) toast(T().ok); return; }
    const o = rd();
    if (manual || !o.later || Date.now() - o.later > 12 * 3600e3) banner(v);
    if (o.noted !== v.code) { o.noted = v.code; wr(o); try { FahmAndroid.notifyUpdate && FahmAndroid.notifyUpdate('Fahmul Quraan — ' + T().t, (v.name || '') + ' · ' + T().go, v.apk); } catch (e) { } }
  }
  function toast(m) { try { window.__fahmApp.toast(m); } catch (e) { } }
  (window.FahmOverlays = window.FahmOverlays || []).push({ isOpen: () => !!document.getElementById('upd'), close: () => { const b = document.getElementById('upd'); if (b) b.remove(); const o = rd(); o.later = Date.now(); wr(o); } });
  window.FahmUpdate = { check, label: () => T().chk };
  document.addEventListener('click', e => { if (e.target.closest('[data-updchk]')) check(true); });
  function boot() { setTimeout(() => check(false), 8000); setInterval(() => check(false), 6 * 3600e3); }
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();

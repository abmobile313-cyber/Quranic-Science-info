/* Build 30: branding in the empty corners of the full-screen scenes, so every screenshot / screen-recording carries the app name + website.
   Reader: small line in the bottom bar. Word stage + story animation: top centre. Never above a control (pointer-events none). */
(function () {
  'use strict';
  const el = document.createElement('div'); el.id = 'fqb'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<img src="icons/icon-192.png" alt=""><span><b>FAHMUL QUR’AN</b><small>by Quranic Science · quranicscience.info</small></span>';
  function vis(n) { if (!n) return false; if (n.hidden) return false; const s = getComputedStyle(n); return s.display !== 'none' && s.visibility !== 'hidden' && n.getBoundingClientRect().height > 40; }
  function tick() {
    let slot = '';
    const ws = document.getElementById('ws'), st = document.querySelector('#story.big'), rd = document.getElementById('reader');
    if (vis(ws)) slot = 'ws'; else if (vis(rd)) slot = 'rd'; else if (st && vis(st)) slot = 'st';
    if (el.dataset.slot !== slot) { el.dataset.slot = slot; }
    if (!el.isConnected && document.body) document.body.appendChild(el);
  }
  setInterval(tick, 500); document.addEventListener('DOMContentLoaded', tick); tick();
})();
/* Build 30: cinematic overlay on the story animation (drifting light motes, slow light sweep, vignette, gold frame glow).
   Pure CSS layer above the canvas, below the controls; pointer-events none. */
(function () {
  'use strict';
  function ensure() {
    const box = document.querySelector('#story .story-box'); if (!box || box.querySelector('.cinfx')) return;
    const d = document.createElement('div'); d.className = 'cinfx'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<i class="m1"></i><i class="m2"></i><i class="m3"></i><i class="sw"></i><i class="vg"></i><i class="fr"></i>';
    box.appendChild(d);
  }
  setInterval(ensure, 800); document.addEventListener('DOMContentLoaded', ensure);
})();

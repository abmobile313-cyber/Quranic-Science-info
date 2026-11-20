/* Build 18: app interface in every translation language (plus Arabic). App logic stays English; this layer translates visible text. */
(function () {
  'use strict';
  var D = window.FAHM_XL; if (!D) return;
  var NAMES = { ur: 'اردو', ru: 'Roman Urdu', en: 'English', ar: 'العربية', hi: 'हिन्दी', bn: 'বাংলা', id: 'Indonesia', tr: 'Türkçe', fa: 'فارسی', fr: 'Français', es: 'Español', rs: 'Русский', ms: 'Melayu', ta: 'தமிழ்', sw: 'Kiswahili', de: 'Deutsch', so: 'Soomaali' };
  var TCODE = { ar: 'ar', hi: 'hi', bn: 'bn', id: 'id', tr: 'tr', fa: 'fa', fr: 'fr', es: 'es', rs: 'ru', ms: 'ms', ta: 'ta', sw: 'sw', de: 'de', so: 'so' };
  var DIG = { ar: '٠١٢٣٤٥٦٧٨٩', fa: '۰۱۲۳۴۵۶۷۸۹', hi: '०१२३४५६७८९', bn: '০১২৩৪৫৬৭৮৯' };
  var lang = '', map = null, keys = [], busy = false;
  function app() { return window.__fahmApp; }
  function build(c) {
    map = {}; keys = []; var t = D.T[c]; if (!t) return;
    D.K.forEach(function (k, i) { map[k] = t[i]; keys.push(k); }); keys.sort(function (a, b) { return b.length - a.length; });
  }
  function tr(s) {
    if (!map) return s; var t = s.trim(); if (!t) return s;
    var lead = s.slice(0, s.indexOf(t)), tail = s.slice(s.indexOf(t) + t.length);
    if (map[t] !== undefined) return lead + map[t] + tail;
    var m = /^(Word) (\d+) (of) (\d+)$/.exec(t); if (m) return lead + map.Word + ' ' + m[2] + ' ' + map.of + ' ' + m[4] + tail;
    for (var i = 0; i < keys.length; i++) { var k = keys[i]; if (k.length > 2 && t.indexOf(k + ' ') === 0 && /^[\d⁦]/.test(t.slice(k.length + 1))) return lead + map[k] + t.slice(k.length) + tail; }
    return s;
  }
  function dig(s) { var d = DIG[lang]; return d ? s.replace(/[0-9]/g, function (x) { return d[x]; }) : s; }
  function skip(n) { var p = n.parentNode; if (!p) return true; var tg = p.nodeName; if (tg === 'SCRIPT' || tg === 'STYLE' || tg === 'TEXTAREA' || tg === 'OPTION' && false) return true; return !!(p.closest && p.closest('#rin,#rhd,.ar,.ws-ar,[data-noxl]')); }
  function doNode(n) {
    if (n.nodeType === 3) {
      if (skip(n)) return; var cur = n.data;
      if (n._xl !== undefined && cur === n._xo) return;               // our own output
      var o = cur; var r = tr(o); if (DIG[lang] && !/@|https?:|www\./.test(r)) r = dig(r);
      if (r !== o) { n._xl = o; n.data = r; n._xo = r; } else { n._xl = undefined; }
    } else if (n.nodeType === 1) {
      if (n.closest && n.closest('[data-noxl]')) return;
      ['title', 'aria-label', 'placeholder'].forEach(function (a) { var v = n.getAttribute && n.getAttribute(a); if (v) { var r = tr(v); if (r !== v) { n.setAttribute(a, r); } } });
      for (var c = n.firstChild; c; c = c.nextSibling) doNode(c);
    }
  }
  function sweep(root) { if (!lang || busy) return; busy = true; try { doNode(root || document.body); } finally { busy = false; } }
  var mo = null, tm = 0;
  function obs() {
    if (mo) return; mo = new MutationObserver(function (ml) { if (!lang) return; clearTimeout(tm); tm = setTimeout(function () { sweep(document.body); }, 30); });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function headerLabels() {
    ['btnMenu:Surahs', 'btnLang:Language', 'btnTheme:Theme', 'btnRead:Reading', 'btnSet:Settings'].forEach(function (p) {
      var a = p.split(':'), b = document.getElementById(a[0]); var e = b && b.querySelector('.hl'); if (!e) return;
      if (lang && map) e.setAttribute('data-t', map[a[1]]); else e.removeAttribute('data-t');
    });
  }
  function apply(c) {
    lang = (c && D.T[c]) ? c : ''; build(lang); var B = document.body;
    B.classList.toggle('xl', !!lang); B.className = B.className.replace(/\bxl-\w+\b/g, '').trim(); if (lang) B.classList.add('xl-' + lang);
    if (lang) { document.documentElement.lang = TCODE[lang] || lang; }
    headerLabels(); if (lang) { obs(); sweep(document.body); }
  }
  function choose(c) {
    var a = app(); if (!a) return; var st = a.st();
    if (c === 'ur' || c === 'ru' || c === 'en') { st.xl = ''; a.save(); apply(''); a.setPref('ui', c); return; }
    st.xl = c; a.save(); a.setPref('ui', 'en');
    setTimeout(function () { st.tl = []; a.setMaslak(TCODE[c]); apply(c); }, 120);
  }
  function panel() {
    var o = document.getElementById('xlp'); if (!o) { o = document.createElement('div'); o.id = 'xlp'; o.setAttribute('data-noxl', '1'); document.body.appendChild(o); o.addEventListener('click', function (e) { var b = e.target.closest('[data-xc]'); if (b) { o.hidden = true; choose(b.dataset.xc); return; } if (e.target === o || e.target.closest('[data-xclose]')) o.hidden = true; }); }
    var st = app().st(), now = st.xl || st.ui;
    o.innerHTML = '<div class="xlb"><h4>🌐 Language · زبان · اللغة</h4><div class="xlg">' + Object.keys(NAMES).map(function (c) { return '<button data-xc="' + c + '" class="' + (c === now ? 'on' : '') + '">' + NAMES[c] + '</button>'; }).join('') + '</div><button class="xlc" data-xclose="1">✕</button></div>';
    o.hidden = false;
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#btnLang'); if (b && app()) { e.stopImmediatePropagation(); e.preventDefault(); panel(); } }, true);
  window.addEventListener('fahm-ready', function () { var st = app().st(); if (st.xl && D.T[st.xl]) { apply(st.xl); setTimeout(function () { apply(st.xl); }, 800); } });
  setInterval(function () { if (lang) headerLabels(); }, 900);
  window.FahmXL = { apply: apply, choose: choose };
})();

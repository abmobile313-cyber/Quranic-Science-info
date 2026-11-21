/* Makharij-ul-Huroof — reading only. 5 areas, 17 makharij, trilingual (ur / ru / en). */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const TXT = {
    ur: { t: 'مخارجِ حروف', sub: 'حروف کے نکلنے کی ۱۷ جگہیں — صرف پڑھنے کے لیے', tap: 'کسی حصے کو دبائیں', btn: 'مخارجِ حروف', bs: '۵ مقامات · ۱۷ مخارج · تصویر کے ساتھ', letters: 'حروف', back: 'واپس', n: 'نمبر', mx: 'استاد ایکس رے', m3: 'تھری ڈی سر' },
    ru: { t: 'Makharij-ul-Huroof', sub: 'Huroof nikalne ki 17 jagahein — sirf padhne ke liye', tap: 'Kisi hisse ko dabayein', btn: 'Makharij-ul-Huroof', bs: '5 maqamat · 17 makharij · tasveer ke saath', letters: 'Huroof', back: 'Wapas', n: 'No.', mx: 'Ustad X-Ray', m3: '3D Head' },
    en: { t: 'Makharij al-Huroof', sub: 'The 17 articulation points of the Arabic letters — for reading only', tap: 'Tap an area', btn: 'Makharij al-Huroof', bs: '5 areas · 17 points · with a picture', letters: 'Letters', back: 'Back', n: 'No.', mx: 'Ustad X-Ray', m3: '3D Head' }
  };
  /* areas: ar name + description. dots = [x,y] in 300x230 side-view (face looks left). */
  const AREAS = [
    {
      id: 'jawf', ar: 'الجوف', c: '#35d0e6',
      nm: { ur: 'جوف — منہ اور حلق کا خالی حصہ', ru: 'Jawf — mooh aur halq ka khaali hissa', en: 'Jawf — the empty space of mouth & throat' },
      pts: [{ L: 'ا و ي', xy: [150, 100], d: { ur: 'مد کے تین حروف: زبر کے بعد الف، پیش کے بعد ساکن واؤ، زیر کے بعد ساکن یاء۔ آواز منہ کے خالی حصے میں پوری ہوتی ہے، زبان یا ہونٹ کہیں نہیں ٹکتے۔', ru: 'Madd ke teen huroof: zabar ke baad Alif, pesh ke baad saakin Waw, zer ke baad saakin Ya. Awaaz mooh ke khaali hisse mein poori hoti hai, zabaan ya hont kahin nahin tikte.', en: 'The three madd letters: Alif after a fatha, silent Waw after a damma, silent Ya after a kasra. The sound completes in the empty space; tongue and lips touch nothing.' } }]
    },
    {
      id: 'halq', ar: 'الحلق', c: '#e8b84a',
      nm: { ur: 'حلق — گلا (۳ مخارج)', ru: 'Halq — gala (3 makharij)', en: 'Halq — the throat (3 points)' },
      pts: [
        { L: 'ء ه', xy: [212, 196], d: { ur: 'حلق کا آخری حصہ (سینے کے قریب سے)۔', ru: 'Halq ka aakhri hissa (seene ke qareeb se).', en: 'The deepest part of the throat (nearest the chest).' } },
        { L: 'ع ح', xy: [200, 170], d: { ur: 'حلق کا درمیانی حصہ۔', ru: 'Halq ka beech ka hissa.', en: 'The middle of the throat.' } },
        { L: 'غ خ', xy: [188, 145], d: { ur: 'حلق کا وہ حصہ جو منہ سے قریب ہے۔', ru: 'Halq ka woh hissa jo mooh ke qareeb hai.', en: 'The part of the throat closest to the mouth.' } }]
    },
    {
      id: 'lisan', ar: 'اللسان', c: '#ef6a7a',
      nm: { ur: 'لسان — زبان (۱۰ مخارج)', ru: 'Lisaan — zabaan (10 makharij)', en: 'Lisan — the tongue (10 points)' },
      pts: [
        { L: 'ق', xy: [172, 118], d: { ur: 'زبان کی جڑ اور اوپر کا نرم تالو (حلق کی طرف)۔', ru: 'Zabaan ki jad aur upar ka narm taalu (halq ki taraf).', en: 'Back of the tongue against the soft palate.' } },
        { L: 'ك', xy: [160, 112], d: { ur: 'ق سے ذرا آگے: زبان کی جڑ اور اوپر کا تالو۔', ru: 'Qaaf se zara aage: zabaan ki jad aur upar ka taalu.', en: 'A little ahead of Qaf: back of the tongue and the palate.' } },
        { L: 'ج ش ي', xy: [136, 104], d: { ur: 'زبان کا درمیانی حصہ اور اوپر کا تالو۔ (یاء غیرِ مدّہ)', ru: 'Zabaan ka beech ka hissa aur upar ka taalu. (Ya ghair-e-maddah)', en: 'Middle of the tongue against the palate. (non-madd Ya)' } },
        { L: 'ض', xy: [128, 118], d: { ur: 'زبان کا کنارہ اور اوپر کی داڑھیں۔', ru: 'Zabaan ka kinara aur upar ki daadhein.', en: 'Side edge of the tongue against the upper molars.' } },
        { L: 'ل', xy: [96, 112], d: { ur: 'زبان کا کنارہ اور اوپر کے سامنے والے دانتوں کے مسوڑھے۔', ru: 'Zabaan ka kinara aur upar ke saamne wale daanton ke masoodhe.', en: 'Tongue edge against the gums above the front teeth.' } },
        { L: 'ن', xy: [88, 116], d: { ur: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کے مسوڑھے (لام سے ذرا نیچے)۔', ru: 'Zabaan ki nok aur upar ke saamne wale daanton ke masoodhe (Laam se zara neeche).', en: 'Tongue tip against the gums of the upper front teeth (a little below Lam).' } },
        { L: 'ر', xy: [98, 124], d: { ur: 'نون کی جگہ سے ذرا پیچھے، زبان کی نوک کی پشت کی طرف۔', ru: 'Noon ki jagah se zara peeche, zabaan ki nok ki pusht ki taraf.', en: 'Just behind the Noon spot, towards the back of the tongue tip.' } },
        { L: 'ط د ت', xy: [76, 112], d: { ur: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کی جڑیں۔', ru: 'Zabaan ki nok aur upar ke saamne wale daanton ki jadein.', en: 'Tongue tip against the roots of the upper front teeth.' } },
        { L: 'ص س ز', xy: [74, 132], d: { ur: 'زبان کی نوک اور نیچے کے سامنے والے دانتوں کے کنارے (سیٹی جیسی آواز)۔', ru: 'Zabaan ki nok aur neeche ke saamne wale daanton ke kinaare (seeti jaisi awaaz).', en: 'Tongue tip near the edges of the lower front teeth (a whistling sound).' } },
        { L: 'ظ ذ ث', xy: [64, 120], d: { ur: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کے کنارے۔', ru: 'Zabaan ki nok aur upar ke saamne wale daanton ke kinaare.', en: 'Tongue tip against the edges of the upper front teeth.' } }]
    },
    {
      id: 'shaf', ar: 'الشفتان', c: '#7ad07a',
      nm: { ur: 'شفتان — ہونٹ (۲ مخارج)', ru: 'Shafataan — hont (2 makharij)', en: 'Shafatayn — the lips (2 points)' },
      pts: [
        { L: 'ف', xy: [46, 150], d: { ur: 'نچلے ہونٹ کا اندرونی پیٹ اور اوپر کے سامنے والے دانتوں کے کنارے۔', ru: 'Nichle hont ka andaruni pet aur upar ke saamne wale daanton ke kinaare.', en: 'Inner edge of the lower lip against the tips of the upper front teeth.' } },
        { L: 'ب م و', xy: [38, 138], d: { ur: 'دونوں ہونٹ: ب اور م میں ہونٹ بند، و میں گول اور کھلے۔', ru: 'Dono hont: Ba aur Meem mein hont band, Waw mein gol aur khule.', en: 'Both lips: closed for Ba and Meem, rounded and open for Waw.' } }]
    },
    {
      id: 'khay', ar: 'الخيشوم', c: '#b58cf0',
      nm: { ur: 'خیشوم — ناک کی بانسری (غنّہ)', ru: 'Khayshoom — naak ki baansuri (ghunna)', en: 'Khayshum — the nasal passage (ghunna)' },
      pts: [{ L: 'ن م', xy: [142, 62], d: { ur: 'غنّہ کی آواز: مشدّد ن اور م، اخفاء اور ادغام بغنّہ میں ناک سے نکلتی ہے۔', ru: 'Ghunna ki awaaz: mushaddad Noon aur Meem, ikhfa aur idgham bi-ghunna mein naak se nikalti hai.', en: 'The nasal “ghunna” sound: doubled Noon and Meem, and in ikhfa / idgham with ghunna.' } }]
    }
  ];

  let root, cur = 0, built = false;
  const lang = () => { try { return window.__fahmApp.st().ui || 'ru'; } catch (e) { return 'ru'; } };
  const tx = () => TXT[lang()] || TXT.ru;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };

  function diagram(area) {
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 300 230'); svg.setAttribute('class', 'mk-svg');
    const hl = area.c;
    let g = `<defs><radialGradient id="mkg" cx="40%" cy="30%"><stop offset="0" stop-color="#f4d9b8"/><stop offset="1" stop-color="#c99a72"/></radialGradient></defs>`;
    /* head side profile, face looks LEFT */
    g += `<path d="M232 20 C262 28 276 70 270 110 C266 140 252 156 240 176 L232 222 L170 222 C168 200 160 190 150 182 L96 172 C78 170 66 164 56 160 C42 158 34 152 36 144 C28 140 26 132 34 128 C32 120 36 112 44 108 C48 90 64 62 94 40 C128 18 190 8 232 20 Z" fill="url(#mkg)" stroke="#7a4a2a" stroke-width="1.4" opacity=".95"/>`;
    /* mouth cavity */
    g += `<path d="M44 134 C70 124 110 116 150 120 C176 124 190 140 196 170 L206 214 L186 214 C180 190 168 176 148 168 C112 160 70 156 44 148 Z" fill="#7a2a36" opacity=".9"/>`;
    /* upper + lower teeth */
    g += `<path d="M52 120 L72 118 L74 134 L56 134 Z" fill="#fffaf0" stroke="#bda98a" stroke-width=".8"/><path d="M52 150 L72 148 L72 162 L56 162 Z" fill="#fffaf0" stroke="#bda98a" stroke-width=".8"/>`;
    /* tongue */
    g += `<path d="M70 140 C100 126 140 124 164 134 C178 142 184 160 188 178 C160 168 120 160 92 158 C80 156 72 150 70 140 Z" fill="#e0707e" stroke="#a63a4c" stroke-width="1"/>`;
    /* lips */
    g += `<path d="M30 126 C34 118 44 116 50 120 L50 134 C42 134 34 134 30 126 Z" fill="#c24a5c"/><path d="M32 146 C38 142 48 146 54 148 L54 162 C44 162 34 158 32 146 Z" fill="#c24a5c"/>`;
    /* nose passage */
    g += `<path d="M46 100 C80 92 120 88 160 96 C176 100 186 108 192 124" fill="none" stroke="#7a2a36" stroke-width="5" stroke-linecap="round" opacity=".55" stroke-dasharray="1 8"/>`;
    /* throat tube */
    g += `<path d="M190 132 C196 160 202 190 206 222" fill="none" stroke="#7a2a36" stroke-width="3" opacity=".5"/>`;
    area.pts.forEach((p, i) => {
      g += `<g class="mk-dot" data-i="${i}"><circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="9" fill="${hl}" opacity=".35"><animate attributeName="r" values="7;12;7" dur="2s" repeatCount="indefinite"/></circle><circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="5.4" fill="${hl}" stroke="#1a0a10" stroke-width="1.4"/></g>`;
    });
    svg.innerHTML = g; return svg;
  }


  /* ---- the Ustad's own face (X-ray) / photo-real 3D head, same engines as the Quranic Science AI lab ---- */
  const ZONE = { jawf: ['jawf'], halq: ['h1', 'h2', 'h3'], lisan: ['l1', 'l2', 'l3', 'l4', 'l5', 'l5', 'l5', 'l6', 'l7', 'l8'], shaf: ['s1', 's2'], khay: ['kh'] };
  let lab = null, labMode = '3d', labHost = null, labLang = '';
  const gl3 = () => { try { return !!(window.MLab3 && MLab3.ok()); } catch (e) { return false; } };
  function mountLab(dg) {
    if (labHost !== dg) { labHost = dg; lab = null; dg.innerHTML = ''; }
    if (!dg.querySelector('.mk-modes')) {
      dg.innerHTML = '<div class="mk-stage"></div><div class="mk-modes" hidden></div>';
    }
    
    if (lab && labLang === lang()) return; killLab();
    const st = dg.querySelector('.mk-stage'); st.innerHTML = ''; const svg = document.createElementNS(NS, 'svg'); st.appendChild(svg); labLang = lang();
    try {
      const Eng = gl3() ? window.MLab3 : window.MLab;
      lab = Eng.Lab(svg, labLang === 'ur' ? 'ur' : labLang === 'en' ? 'en' : 'ur'); lab.labels && lab.labels(true, labLang === 'en' ? 'en' : 'ur');
    } catch (e) { lab = null; st.innerHTML = '<p class="mk-err">3D lab unavailable on this device.</p>'; }
  }
  function killLab() { try { lab && lab.destroy && lab.destroy(); } catch (e) { } lab = null; if (labHost) { const st = labHost.querySelector('.mk-stage'); if (st) st.innerHTML = ''; } }
  let sel = 0;
  function say(ch) {
    /* Build 27: no phone voice — plays a recorded clip vo/mk/<codepoint>.mp3 when one exists, otherwise stays silent */
    try { if (window.__mkAu) { window.__mkAu.pause(); } const a = new Audio('vo/mk/' + ch.codePointAt(0).toString(16) + '.mp3'); window.__mkAu = a; const p = a.play(); if (p && p.catch) p.catch(() => { }); } catch (e) { }
  }
  function labTo(i) {
    sel = i; if (!lab) return; const a = AREAS[cur], z = (ZONE[a.id] || [])[i]; if (!z) return; const ch = a.pts[i].L.split(' ')[0];
    try { lab.to(ch, z, 700, 'a'); } catch (e) { } say(ch);
  }

  function render() {
    const T = tx(), L = lang(), a = AREAS[cur];
    root.querySelector('.mk-t').textContent = T.t; root.querySelector('.mk-sub').textContent = T.sub;
    root.querySelector('.mk-bk').setAttribute('aria-label', T.back);
    const tabs = root.querySelector('.mk-tabs'); tabs.innerHTML = '';
    let num = 0; const starts = [];
    AREAS.forEach(x => { starts.push(num + 1); num += x.pts.length; });
    AREAS.forEach((x, i) => {
      const b = el('button', 'mk-tab' + (i === cur ? ' on' : ''), `<b>${x.ar}</b>`); b.style.setProperty('--c', x.c);
      b.onclick = () => { cur = i; render(); root.querySelector('.mk-body').scrollTo({ top: 0, behavior: 'smooth' }); }; tabs.appendChild(b);
    });
    const dg = root.querySelector('.mk-dg'); mountLab(dg);
    root.querySelector('.mk-an').textContent = a.nm[L] || a.nm.ru;
    const list = root.querySelector('.mk-list'); list.innerHTML = '';
    a.pts.forEach((p, i) => {
      const c = el('div', 'mk-card', `<div class="mk-no" style="background:${a.c}">${starts[cur] + i}</div><div class="mk-lt">${p.L.split(' ').map(x => `<span>${x}</span>`).join('')}</div><p>${p.d[L] || p.d.ru}</p>`);
      c.dataset.i = i; c.onclick = () => { hi(i); labTo(i); }; list.appendChild(c);
    });
  }
  function hi(i) {
    root.querySelectorAll('.mk-card').forEach(c => c.classList.toggle('on', +c.dataset.i === i));
    const c = root.querySelector('.mk-card[data-i="' + i + '"]'); if (c) c.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function build() {
    if (built) return; built = true;
    root = el('div'); root.id = 'mkh'; root.hidden = true;
    root.innerHTML = '<div class="mk-top"><button class="mk-bk ib" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><div class="mk-hd"><b class="mk-t"></b><small class="mk-sub"></small></div></div><div class="mk-tabs"></div><div class="mk-body"><div class="mk-dg"></div><h4 class="mk-an"></h4><div class="mk-list"></div></div>';
    document.body.appendChild(root);
    root.querySelector('.mk-bk').onclick = close;
  }
  function open() { build(); cur = 0; render(); root.hidden = false; }
  function close() { if (root) root.hidden = true; }
  function mount() {
    const old = document.getElementById('bMakh'); if (old) return;
    const m = document.getElementById('bMushaf'); if (!m) return;
    const b = el('button', 'mush mkb'); b.id = 'bMakh'; m.after(b); b.onclick = open; refresh();
  }
  function refresh() { const b = document.getElementById('bMakh'); if (!b) return; const T = tx(); b.innerHTML = `<b>${T.btn}</b><small>${T.bs}</small>`; if (root && !root.hidden) render(); }
  window.FahmMakh = { open, close, refresh, isOpen: () => !!root && !root.hidden };
  window.addEventListener('fahm-ready', mount);
  if (window.__fahmApp) mount();
  window.addEventListener('fahm-lang', refresh);
  setInterval(() => { const b = document.getElementById('bMakh'); if (b && b.dataset.l !== lang()) { b.dataset.l = lang(); refresh(); } }, 800);
})();

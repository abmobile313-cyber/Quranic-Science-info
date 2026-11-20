/* Fahm word counts: how many times this exact word / these letters / this root appear in the whole Quran (data: q/cnt.json, built from the word-by-word text). */
(function () {
'use strict';
let D = null, P = null;
const WQ = /[ۖ-ۜ۞۩؀-؅‌‍\s]/g, MK = /[ً-ٰٟۖ-ۭـ࣓-ࣿ]/g;
const norm = a => String(a || '').replace(/[۝].*/, '').replace(WQ, '');
function load() { return P || (P = fetch('q/cnt.json').then(r => r.json()).then(j => { D = j; return j; }).catch(() => { P = null; return null; })); }
function get(ar, root) {
  if (!D) return null; const k = norm(ar), e = D.e[k], s = D.s[k.replace(MK, '')], r = root ? D.r[root] : 0;
  return { exact: e ? e[0] : 0, same: s || 0, root: r || 0, refs: e ? e.slice(1) : [] };
}
const L = {
  ur: { t: 'قرآن میں کتنی بار', ex: 'یہی لفظ (اسی اعراب کے ساتھ)', sm: 'یہی حروف (کسی بھی اعراب میں)', rt: 'اس مادّے (روٹ) کے الفاظ', times: 'بار', where: 'کہاں کہاں آیا' },
  ru: { t: 'Quran mein kitni baar', ex: 'Yahi lafz (isi irab ke saath)', sm: 'Yahi huroof (kisi bhi irab mein)', rt: 'Is root ke alfaaz', times: 'baar', where: 'Kahan kahan aaya' },
  en: { t: 'How often in the Quran', ex: 'This exact word (same vowels)', sm: 'These letters (any vowels)', rt: 'Words from this root', times: 'times', where: 'Where it occurs' }
};
const nu = (n, ui) => ui === 'ur' ? String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(n);
/* html block; sn = surah-name function (n -> label) */
function html(ar, root, ui, sn) {
  const c = get(ar, root); if (!c) return ''; const l = L[ui] || L.en;
  const row = (lab, n) => `<div class="cn-r"><span>${lab}</span><b>${nu(n, ui)} <small>${l.times}</small></b></div>`;
  const refs = c.refs.length ? `<div class="cn-w">${l.where}:</div><div class="cn-l">${c.refs.map(x => { const s = Math.floor(x / 1000), v = x % 1000; return `<button data-go="${s - 1},${v - 1},0">${esc(sn ? sn(s) : s)} ${nu(v, ui)}</button>`; }).join('')}</div>` : '';
  return `<div class="cn"><div class="cn-t">${l.t}</div>${row(l.ex, c.exact)}${c.same !== c.exact ? row(l.sm, c.same) : ''}${root ? row(l.rt, c.root) : ''}${refs}</div>`;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
window.FahmCnt = { load, get, html };
load();
})();
(function () {
  const ui = () => { try { return window.__fahm.st().ui || 'en'; } catch (e) { return 'en'; } };
  const sn = n => { try { const S = FahmData.D.surahs[n - 1]; return ui() === 'ur' ? S.ur : S.en; } catch (e) { return n; } };
  function inject() {
    const wc = document.getElementById('wordcard'); if (!wc) return; const rt = wc.querySelector('.root'), ar = wc.querySelector('.wc-ar'); if (!ar) return;
    const key = ar.textContent + '|' + ui(); const old = wc.querySelector('.cn'); if (old && old.dataset.k === key) return; if (old) old.remove();
    const root = rt ? [...rt.querySelectorAll('.lt')].map(x => x.textContent).join('') : '';
    FahmCnt.load().then(() => { const h = FahmCnt.html(ar.textContent, root, ui(), sn); if (!h) return; const d = document.createElement('div'); d.innerHTML = h; const el = d.firstChild; el.dataset.k = key; const hint = wc.querySelector('.hint'); (rt || ar.parentElement).after(el); });
  }
  const start = () => { const wc = document.getElementById('wordcard'); if (!wc) return; new MutationObserver(() => { clearTimeout(start.t); start.t = setTimeout(inject, 60); }).observe(wc, { childList: true, subtree: true, characterData: true }); inject(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

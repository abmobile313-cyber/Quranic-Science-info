/* Build 21 rule: wherever Urdu words appear, they are shown in Nastaliq — never in a plain Arabic/system face.
   Quran text, Arabic words and Farsi UI are left alone. */
(function () {
  'use strict';
  var RX = /[ٹڈڑںےھہۃگچپژکیۓ]/, EX = '.ar,#rpage,#rin,#rhd,.ws-ar,#wsAy,[data-noxl],[data-qur],canvas,script,style,textarea,input,select,option,svg';
  var tm = 0, roots = [];
  function skipLang() { var b = document.body; return b.classList.contains('xl-fa') || b.classList.contains('xl-ar'); }
  function scan(root) {
    if (!root || skipLang()) return;
    var w; try { w = document.createTreeWalker(root.nodeType === 3 ? root.parentNode : root, NodeFilter.SHOW_TEXT, null); } catch (e) { return; }
    var n; while ((n = w.nextNode())) {
      var p = n.parentNode; if (!p || p.nodeType !== 1 || p.classList.contains('urf')) continue;
      if (!RX.test(n.data)) continue; if (p.closest && p.closest(EX)) continue; p.classList.add('urf');
    }
  }
  function flush() { var r = roots; roots = []; tm = 0; r.forEach(scan); }
  function queue(r) { roots.push(r); if (!tm) tm = setTimeout(flush, 60); }
  function init() { scan(document.body); new MutationObserver(function (ml) { ml.forEach(function (m) { if (m.type === 'characterData') queue(m.target); else m.addedNodes.forEach(function (a) { if (a.nodeType === 1 || a.nodeType === 3) queue(a); }); }); }).observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();

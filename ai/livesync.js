/* Live sync: while the AI Ustad speaks, the picture on the screen follows the words, like a video.
   The cards / groups of the moment light up one after another with the voice, and a progress bar runs. Nothing extra is drawn. */
(function () {
  "use strict";
  var raf = 0, cur = null, SEL = ".stage .viz.groups .grp, .stage .viz.cards .vc";
  var fmt = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); };
  function bar() { var b = document.querySelector(".stage .uprog"); if (b) return b; var s = document.querySelector(".stage .say"); if (!s) return null;
    b = document.createElement("div"); b.className = "uprog"; b.innerHTML = "<b><i></i></b><span></span>"; s.insertAdjacentElement("afterend", b); return b; }
  function reset() { [].forEach.call(document.querySelectorAll(SEL), function (e) { e.classList.remove("lv-on", "lv-past", "lv-wait"); }); var b = document.querySelector(".stage .uprog"); if (b) b.remove(); }
  function loop() {
    var a = cur; if (!a) return;
    var d = a.duration && isFinite(a.duration) ? a.duration : 0, ended = a.ended, p = ended ? 1 : d ? Math.min(1, a.currentTime / d) : 0;
    if (a.paused && !ended && a.currentTime === 0) { raf = requestAnimationFrame(loop); return; }
    var items = [].slice.call(document.querySelectorAll(SEL)), q = Math.min(.999, Math.max(0, (p - .06) / .9)), k = Math.floor(q * items.length);
    items.forEach(function (e, j) { e.classList.toggle("lv-past", j < k); e.classList.toggle("lv-on", j === k); e.classList.toggle("lv-wait", j > k); });
    var b = bar(); if (b) { b.firstChild.firstChild.style.width = Math.round(p * 100) + "%"; b.lastChild.textContent = fmt(p * (d || 20)) + " / " + fmt(d || 20); }
    if (ended || (a.paused && a.currentTime > 0 && !a.seeking)) { if (ended) setTimeout(function () { if (cur === a) reset(); }, 1600); else reset(); cur = null; return; }
    raf = requestAnimationFrame(loop);
  }
  function attach(a) { cancelAnimationFrame(raf); reset(); cur = a || null; if (a) raf = requestAnimationFrame(loop); }
  window.QSLiveSync = { attach: attach, stop: function () { attach(null); } };
  var _pv = window.playVoice, _sa = window.stopAll;
  if (typeof _pv === "function") window.playVoice = async function () { var r = await _pv.apply(this, arguments); try { if (typeof voiceEl !== "undefined" && voiceEl) attach(voiceEl); } catch (e) {} return r; };
  if (typeof _sa === "function") window.stopAll = function () { var r = _sa.apply(this, arguments); try { attach(null); } catch (e) {} return r; };
  var st = document.createElement("style"); st.textContent = [
    ".viz .grp,.viz .vc{transition:opacity .3s,transform .3s,box-shadow .3s}.lv-wait{opacity:.5}.lv-past{opacity:.75}",
    ".lv-on{transform:scale(1.05);box-shadow:0 0 0 3px rgba(255,196,60,.7),0 8px 22px rgba(255,196,60,.28)}",
    ".uprog{display:flex;align-items:center;gap:10px;margin:8px 2px 0;font:600 12px Outfit,inherit;color:var(--mut)}.uprog b{flex:1;height:5px;border-radius:3px;background:rgba(127,127,127,.25);overflow:hidden}.uprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),#31e8e0)}.uprog span{min-width:74px;text-align:right;direction:ltr}",
    "@media (prefers-reduced-motion:reduce){.viz .grp,.viz .vc{transition:none}.lv-on{transform:none}}"].join("\n");
  document.head.appendChild(st);
})();

/* Live sync: what the AI Teacher says moves on the real CapCut screen like a teacher sharing their screen.
   While the lesson voice plays, the screen zooms to the part being talked about, a cursor glides to the real button,
   clicks it (ripple + button flash + "Click: …" label), the next screen opens when it should, the step list ticks forward
   and a progress bar shows the time. Nothing extra is drawn on the lesson. */
(function () {
  "use strict";
  var raf = 0, cur = null, timers = [];
  var fmt = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function prog(pane) {
    var b = pane.querySelector(".uprog"); if (b) return b;
    b = document.createElement("div"); b.className = "uprog"; b.innerHTML = "<b><i></i></b><span></span>";
    pane.querySelector(".uscr").insertAdjacentElement("afterend", b); return b;
  }
  function zoomTo(pane, z, W, H) { /* zoom the real screenshot onto rectangle z (or back to full view) */
    var zm = pane.querySelector(".uzoom"); if (!zm) return;
    if (!z) { zm.style.setProperty("--z", 1); zm.style.transform = "translate(0,0) scale(1)"; return; }
    var mob = pane.getAttribute("data-p") === "mob", fw = z[2] / W, fh = z[3] / H;
    var s = clamp(.62 / Math.max(fw, fh * (mob ? .55 : .8)), 1, mob ? 1.9 : 2.1);
    if (s < 1.12) s = 1;
    var cx = (z[0] + z[2] / 2) / W, cy = (z[1] + z[3] / 2) / H;
    var tx = clamp(.5 - cx * s, 1 - s, 0), ty = clamp(.5 - cy * s, 1 - s, 0);
    zm.style.setProperty("--z", s.toFixed(3)); zm.style.transform = "translate(" + (tx * 100).toFixed(2) + "%," + (ty * 100).toFixed(2) + "%) scale(" + s.toFixed(3) + ")";
  }
  function showFrame(pane, f) {
    [].forEach.call(pane.querySelectorAll(".uimg"), function (im) { im.classList.toggle("on", +im.getAttribute("data-f") === f); });
    [].forEach.call(pane.querySelectorAll(".uhl"), function (r) { var on = +r.getAttribute("data-f") === f; r.classList.toggle("show", on); r.classList.toggle("hide", !on); });
  }
  function go(pane, ri, rings, W, H) { /* the cursor moves to ring ri, then clicks */
    var r = rings[ri], f = +r.getAttribute("data-f"), z = r.getAttribute("data-z").split(",").map(Number), cu = pane.querySelector(".ucur"), tip = pane.querySelector(".uclk");
    if (pane.__f !== f) { pane.__f = f; showFrame(pane, f); }
    rings.forEach(function (x, j) { x.style.opacity = j === ri ? 1 : (+x.getAttribute("data-f") === f ? .25 : 0); });
    zoomTo(pane, z, W, H);
    var x = z[0] + z[2] * .5, y = z[1] + z[3] * .5; if (z[2] > W * .12 || z[3] > H * .12) { x = z[0] + z[2] * .5; y = z[1] + z[3] * .42; }
    cu.style.left = (x / W * 100).toFixed(3) + "%"; cu.style.top = (y / H * 100).toFixed(3) + "%"; cu.style.opacity = 1; cu.classList.remove("click"); tip.classList.remove("on");
    var tk = pane.__t = (pane.__t || 0) + 1, lab = r.getAttribute("data-l") || "";
    timers.push(setTimeout(function () {
      if (pane.__t !== tk || pane.__k !== ri) return;
      cu.classList.remove("click"); void cu.getBoundingClientRect(); cu.classList.add("click");
      r.classList.remove("press"); void r.getBoundingClientRect(); r.classList.add("press");
      if (lab) { tip.textContent = "👆 " + lab; tip.classList.add("on"); }
    }, 1000));
  }
  function apply(pane, p, d, ticksOnly) {
    var rings = [].slice.call(pane.querySelectorAll(".uhl:not(.usr)")), lis = [].slice.call(pane.querySelectorAll(".usteps li")), k = 0, zm = pane.querySelector(".uzoom"); if (!zm || !rings.length) return;
    var W = +zm.getAttribute("data-w"), H = +zm.getAttribute("data-h");
    var n = lis.length || rings.length, w = lis.length ? lis.map(function (l) { return l.textContent.length + 14; }) : [], tot = w.reduce(function (x, y) { return x + y; }, 0), q = clamp((p - .05) / .9, 0, .999), acc = 0;
    if (lis.length) { for (k = 0; k < lis.length; k++) { acc += w[k] / tot; if (q < acc) break; } k = Math.min(k, lis.length - 1); } else k = Math.min(n - 1, Math.floor(q * n));
    var ri = lis.length ? Math.min(rings.length - 1, Math.floor(k * rings.length / lis.length)) : Math.min(rings.length - 1, k);
    lis.forEach(function (l, j) { l.className = j < k ? "done" : j === k ? "on" : "wait"; });
    if (!ticksOnly && pane.__k !== ri) { pane.__k = ri; go(pane, ri, rings, W, H); }
    var b = prog(pane); b.firstChild.firstChild.style.width = Math.round(p * 100) + "%"; b.lastChild.textContent = fmt(p * d) + " / " + fmt(d);
  }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    [].forEach.call(document.querySelectorAll(".uimap .upane"), function (pane) {
      if (pane.__sc) { try { pane.__sc.stop(); } catch (e) {} } pane.__sc = undefined; pane.__k = -1; pane.__f = 0; pane.__t = (pane.__t || 0) + 1;
      [].forEach.call(pane.querySelectorAll(".usteps li"), function (l) { l.className = ""; });
      [].forEach.call(pane.querySelectorAll(".uhl"), function (r) { r.style.opacity = ""; r.classList.remove("press", "show", "hide"); });
      var c = pane.querySelector(".ucur"); if (c) { c.style.opacity = 0; c.classList.remove("click"); }
      var t = pane.querySelector(".uclk"); if (t) { var iv = t.getAttribute("data-i") || ""; t.textContent = iv; t.classList.toggle("on", !!iv); }
      [].forEach.call(pane.querySelectorAll(".uimg"), function (im) { im.classList.toggle("on", im.getAttribute("data-f") === "0"); });
      var zm = pane.querySelector(".uzoom"); if (zm) { zm.style.setProperty("--z", 1); zm.style.transform = ""; }
      var b = pane.querySelector(".uprog"); if (b) b.remove();
    });
  }
  function narration() { var t = ""; try { var m = LESSON.data.moments[LESSON.i]; t = (m && (m.en || "")) || ""; } catch (e) {} return { text: t }; }
  function loop() {
    var a = cur; if (!a) return;
    var d = a.duration && isFinite(a.duration) ? a.duration : 0, ended = a.ended, p = ended ? 1 : d ? Math.min(1, a.currentTime / d) : 0;
    if (a.paused && !ended && a.currentTime === 0) { raf = requestAnimationFrame(loop); return; }
    var nar = null; [].forEach.call(document.querySelectorAll(".uimap .upane:not([hidden])"), function (pane) {
      if (pane.__sc === undefined && d > 0 && window.QSScene) { pane.__sc = null; try { if (!nar) nar = narration(); pane.__sc = QSScene.start(pane, nar.text, pane.__steps || [].map.call(pane.querySelectorAll(".usteps li"), function (li) { return li.getAttribute("data-en") || ""; }), d) || null; } catch (e) { pane.__sc = null; } }
      if (pane.__sc) { try { pane.__sc.update(a.currentTime); } catch (e) {} apply(pane, p, d || 20, true); } else apply(pane, p, d || 20);
    });
    if (ended || (a.paused && a.currentTime > 0 && !a.seeking)) { if (ended) setTimeout(function () { if (cur === a) reset(); }, 1800); else reset(); cur = null; return; }
    raf = requestAnimationFrame(loop);
  }
  function attach(a) { cancelAnimationFrame(raf); reset(); cur = a || null; if (a) raf = requestAnimationFrame(loop); }
  window.QSLiveSync = { attach: attach, stop: function () { cancelAnimationFrame(raf); cur = null; reset(); } };

  var _pv = window.playVoice, _sa = window.stopAll;
  if (typeof _pv === "function") window.playVoice = async function () { var r = await _pv.apply(this, arguments); try { if (typeof voiceEl !== "undefined" && voiceEl) attach(voiceEl); } catch (e) {} return r; };
  if (typeof _sa === "function") window.stopAll = function () { var r = _sa.apply(this, arguments); try { attach(null); } catch (e) {} return r; };

  var st = document.createElement("style"); st.textContent = [
    ".usteps li{transition:opacity .3s,background .3s}.usteps li.wait{opacity:.5}.usteps li.done{opacity:.72}.usteps li.done::marker{color:var(--ok,#3fcf8e)}",
    ".usteps li.on{background:rgba(255,196,60,.16);border-radius:10px;box-shadow:0 0 0 2px rgba(255,196,60,.55);padding:6px 10px;font-weight:700}",
    ".uprog{display:flex;align-items:center;gap:10px;margin:8px 2px 0;font:600 12px Outfit,inherit;color:var(--mut)}.uprog b{flex:1;height:5px;border-radius:3px;background:rgba(127,127,127,.25);overflow:hidden}.uprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),#31e8e0)}",
    ".uprog span{min-width:74px;text-align:right;direction:ltr}"].join("\n");
  document.head.appendChild(st);
})();

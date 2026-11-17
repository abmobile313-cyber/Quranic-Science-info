/* Live sync: what the AI Teacher says moves on the screen like a video.
   While the lesson voice plays, the cursor glides to the part of the CapCut screen being talked about, clicks it,
   the step list ticks forward, the timeline playhead runs and a progress bar shows the time. Nothing extra is drawn. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg", raf = 0, cur = null;
  var fmt = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); };

  function pointer(svg) {
    var g = svg.querySelector(".ucur"); if (g) return g;
    g = document.createElementNS(NS, "g"); g.setAttribute("class", "ucur");
    g.innerHTML = '<circle class="uclick" r="10" fill="none" stroke="#ffc43c" stroke-width="2.4"/><path d="M0 0v16l4.2-4 3.2 7.2 3.2-1.4-3.2-7H14z" fill="#fff" stroke="#111" stroke-width="1" stroke-linejoin="round"/>';
    svg.appendChild(g); return g;
  }
  function prog(pane) {
    var b = pane.querySelector(".uprog"); if (b) return b;
    b = document.createElement("div"); b.className = "uprog"; b.innerHTML = "<b><i></i></b><span></span>";
    var anchor = pane.querySelector("svg"); anchor.insertAdjacentElement("afterend", b); return b;
  }
  function apply(pane, p, d, a) {
    var svg = pane.querySelector("svg"); if (!svg) return;
    var rings = [].slice.call(svg.querySelectorAll(".uhl")), lis = [].slice.call(pane.querySelectorAll(".usteps li")), k = 0;
    var n = lis.length || rings.length || 1, w = lis.length ? lis.map(function (l) { return l.textContent.length + 14; }) : [], tot = w.reduce(function (x, y) { return x + y; }, 0), q = Math.min(.999, Math.max(0, (p - .06) / .9)), acc = 0;
    if (lis.length) { for (k = 0; k < lis.length; k++) { acc += w[k] / tot; if (q < acc) break; } k = Math.min(k, lis.length - 1); } else k = Math.min(n - 1, Math.floor(q * n));
    var ri = rings.length ? (lis.length ? Math.min(rings.length - 1, Math.floor(k * rings.length / lis.length)) : Math.min(rings.length - 1, k)) : -1;
    lis.forEach(function (l, j) { l.className = j < k ? "done" : j === k ? "on" : "wait"; });
    rings.forEach(function (r, j) { r.style.opacity = j === ri ? 1 : .22; });
    var cu = pointer(svg), moved = false;
    if (ri >= 0) {
      var z = rings[ri].getAttribute("data-z").split(",").map(Number), x = z[0] + z[2] * .5, y = z[1] + z[3] * .5;
      cu.style.transform = "translate(" + x + "px," + y + "px)"; cu.style.opacity = 1;
      if (pane.__k !== ri) { pane.__k = ri; cu.classList.remove("go"); void svg.getBoundingClientRect(); cu.classList.add("go"); }
    } else cu.style.opacity = 0;
    [].forEach.call(svg.querySelectorAll(".uph"), function (g) {
      var x0 = +g.getAttribute("data-x0"), x1 = +g.getAttribute("data-x1"), ln = g.querySelector("line"), bx = +ln.getAttribute("x1");
      g.style.transform = "translateX(" + (x0 + (x1 - x0) * p - bx) + "px)";
    });
    var b = prog(pane); b.firstChild.firstChild.style.width = Math.round(p * 100) + "%"; b.lastChild.textContent = fmt(p * d) + " / " + fmt(d);
  }
  function reset() {
    [].forEach.call(document.querySelectorAll(".uimap .upane"), function (pane) {
      pane.__k = -1; [].forEach.call(pane.querySelectorAll(".usteps li"), function (l) { l.className = ""; });
      [].forEach.call(pane.querySelectorAll(".uhl"), function (r) { r.style.opacity = ""; });
      var c = pane.querySelector(".ucur"); if (c) c.style.opacity = 0; var b = pane.querySelector(".uprog"); if (b) b.remove();
      [].forEach.call(pane.querySelectorAll(".uph"), function (g) { g.style.transform = ""; });
    });
  }
  function loop() {
    var a = cur; if (!a) return;
    var d = a.duration && isFinite(a.duration) ? a.duration : 0, ended = a.ended, p = ended ? 1 : d ? Math.min(1, a.currentTime / d) : 0;
    if (a.paused && !ended && a.currentTime === 0) { raf = requestAnimationFrame(loop); return; }
    [].forEach.call(document.querySelectorAll(".uimap .upane:not([hidden])"), function (pane) { apply(pane, p, d || 20, a); });
    if (ended || (a.paused && a.currentTime > 0 && !a.seeking)) { if (ended) setTimeout(function () { if (cur === a) reset(); }, 1600); else reset(); cur = null; return; }
    raf = requestAnimationFrame(loop);
  }
  function attach(a) { cancelAnimationFrame(raf); reset(); cur = a || null; if (a) raf = requestAnimationFrame(loop); }
  window.QSLiveSync = { attach: attach, stop: function () { cancelAnimationFrame(raf); cur = null; reset(); } };

  var _pv = window.playVoice, _sa = window.stopAll;
  if (typeof _pv === "function") window.playVoice = async function () { var r = await _pv.apply(this, arguments); try { if (typeof voiceEl !== "undefined" && voiceEl) attach(voiceEl); } catch (e) {} return r; };
  if (typeof _sa === "function") window.stopAll = function () { var r = _sa.apply(this, arguments); try { attach(null); } catch (e) {} return r; };

  var st = document.createElement("style"); st.textContent = [
    ".usvg .ucur{opacity:0;transition:transform .85s cubic-bezier(.45,.05,.2,1),opacity .3s;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))}",
    ".usvg .ucur .uclick{opacity:0;transform-box:fill-box;transform-origin:center}.usvg .ucur.go .uclick{animation:uclk .9s .8s ease-out 1}",
    "@keyframes uclk{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(2.1)}}",
    ".usvg .uph{transition:transform .25s linear}.usvg .uhl{transition:opacity .35s}",
    ".usteps li{transition:opacity .3s,background .3s}.usteps li.wait{opacity:.5}.usteps li.done{opacity:.72}.usteps li.done::marker{color:var(--ok,#3fcf8e)}",
    ".usteps li.on{background:rgba(255,196,60,.16);border-radius:10px;box-shadow:0 0 0 2px rgba(255,196,60,.55);padding:6px 10px;font-weight:700}",
    ".uprog{display:flex;align-items:center;gap:10px;margin:8px 2px 0;font:600 12px Outfit,inherit;color:var(--mut)}.uprog b{flex:1;height:5px;border-radius:3px;background:rgba(127,127,127,.25);overflow:hidden}.uprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),#31e8e0)}",
    ".uprog span{min-width:74px;text-align:right;direction:ltr}",
    "@media (prefers-reduced-motion:reduce){.usvg .ucur,.usvg .uph{transition:none}.usvg .ucur.go .uclick{animation:none}}"].join("\n");
  document.head.appendChild(st);
})();

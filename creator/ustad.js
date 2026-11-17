/* AI Teacher — a real, calm teacher face with lips that follow every word.
   5 mouth photos (closed / small / "oo" / "ee" / wide) are cross-faded on a canvas.
   What drives the lips:
     1. recorded voice from our own site  -> the real loudness of the clip (decoded once) + the vowels of the text
     2. other audio (qari, other sites)    -> the vowels of the text spread over the clip length
     3. phone voice (speechSynthesis)      -> the utterance text, re-synced on every word boundary
   Vowel shapes: a = wide, o/u/w = round, e/i/y = smile, m/b/p = lips closed.
   Works for English, Urdu/Arabic (with or without harakat) and Hindi text. */
(function () {
  "use strict";
  var BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^\/]*$/, "") + "ustad/";
  var FILES = { c: "v_closed.webp", s: "v_small.webp", o: "v_oo.webp", e: "v_ee.webp", a: "v_open.webp" }, ORDER = ["c", "s", "e", "o", "a"];
  var IMG = {}, ready = false, W = 448, H = 470;
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) {}
  function load() {
    if (ready === "loading" || ready === true) return; ready = "loading"; var n = 0;
    ORDER.forEach(function (k) { var im = new Image(); im.onload = function () { if (++n === ORDER.length) { ready = true; instances.forEach(draw); } }; im.src = BASE + FILES[k]; IMG[k] = im; });
  }

  /* ---------- text -> mouth shapes ---------- */
  /* each token: [shape, weight(length), openness 0..1]   shape: a wide, o round, e smile, c closed, s small, _ pause */
  var AR_V = { "َ": "a", "ُ": "o", "ِ": "e", "ً": "a", "ٌ": "o", "ٍ": "e", "ٰ": "a" };
  var CLOSE = /[مبپpbmMBP]/, SMALL = /[فvfFVشصسزثذظ]/;
  function tokens(text) {
    var s = String(text || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " "), out = [], last = "a", i, ch;
    function push(sh, w, op) { out.push([sh, w, op]); if (sh === "a" || sh === "o" || sh === "e") last = sh; }
    for (i = 0; i < s.length; i++) {
      ch = s[i];
      if (/[\s]/.test(ch)) { out.push(["_", ch === "\n" ? 3 : .5, 0.06]); continue; }
      if (/[.!?؟۔।…:;]/.test(ch)) { out.push(["_", 5, 0]); continue; }
      if (/[,،]/.test(ch)) { out.push(["_", 2.6, 0]); continue; }
      /* Arabic / Urdu script */
      if (/[؀-ۿ]/.test(ch)) {
        if (AR_V[ch]) { push(AR_V[ch], 1.1, .85); continue; }
        if (/[ً-ٰٟۖ-ۭـ]/.test(ch)) continue;                 /* shaddah, sukun, marks */
        if (/[اآأإع]/.test(ch)) { push("a", 1.3, .9); continue; }
        if (/[وؤ]/.test(ch)) { push("o", 1.2, .75); continue; }
        if (/[يیئےى]/.test(ch)) { push("e", 1.2, .7); continue; }
        if (/[مبپ]/.test(ch)) { push("c", .8, 0); continue; }
        if (/[فشصسزثذظ]/.test(ch)) { push("s", .7, .4); continue; }
        var nx = s[i + 1]; /* consonant: if no vowel mark follows, a short implied 'a' keeps the lips moving like speech */
        if (nx && AR_V[nx]) { out.push(["s", .35, .3]); continue; }
        push("a", .8, .55); continue;
      }
      /* Devanagari */
      if (/[ऀ-ॿ]/.test(ch)) {
        if (/[अआाऑऍ]/.test(ch)) { push("a", 1.3, .9); continue; }
        if (/[इईिीएऐेैऎ]/.test(ch)) { push("e", 1.2, .7); continue; }
        if (/[उऊुूओऔोौ]/.test(ch)) { push("o", 1.2, .8); continue; }
        if (/[मबपभ]/.test(ch)) { push("c", .8, 0); continue; }
        if (/[़्ंँःऽ]/.test(ch)) continue;
        if (/[फवशषसज़ज]/.test(ch)) { push("s", .7, .4); continue; }
        push("a", .7, .5); continue;
      }
      /* Latin */
      if (/[a-z]/i.test(ch)) {
        var c = ch.toLowerCase();
        if (c === "a") push("a", 1.2, .9); else if (c === "e" || c === "i" || c === "y") push("e", 1, .65); else if (c === "o" || c === "u") push("o", 1.1, .8); else if (c === "w") push("o", .7, .5);
        else if (CLOSE.test(c)) push("c", .7, 0); else if (SMALL.test(c)) push("s", .6, .35); else out.push([last === "a" ? "s" : last, .5, .35]);
        continue;
      }
      if (/\d/.test(ch)) { push("a", 1, .6); continue; }
    }
    return out;
  }
  function plan(text) {
    var tk = tokens(text), tot = 0; tk.forEach(function (t) { t.start = tot; tot += t[1]; }); return { tk: tk, total: Math.max(tot, 1) };
  }
  function at(pl, p) { /* p 0..1 -> token */
    var x = Math.max(0, Math.min(.9999, p)) * pl.total, lo = 0, hi = pl.tk.length - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (pl.tk[mid].start <= x) lo = mid; else hi = mid - 1; }
    return pl.tk[lo] || ["_", 1, 0];
  }

  /* ---------- state shared by every mounted face ---------- */
  var instances = [], S = { mode: "idle", pl: null, t0: 0, dur: 0, el: null, env: null, envDt: .03, start: 0, end: 1, shape: "c", open: 0, hintText: "", hintAt: 0, boundary: -1, emote: 0, raf: 0, lastT: 0, tts: null };
  var OPEN = 0, W5 = { c: 1, s: 0, e: 0, o: 0, a: 0 }, TG = { c: 1, s: 0, e: 0, o: 0, a: 0 };

  function targetFrom(shape, o) {
    var t = { c: 0, s: 0, e: 0, o: 0, a: 0 };
    if (shape === "_") { t.c = 1; return t; }
    if (shape === "c") { t.c = 1; return t; }
    if (shape === "a") { if (o < .5) { t.c = 1 - 2 * o; t.s = 2 * o; } else { t.s = 2 - 2 * o; t.a = 2 * o - 1; } }
    else if (shape === "s") { t.c = 1 - Math.min(1, o * 1.6); t.s = Math.min(1, o * 1.6); }
    else if (shape === "e") { var k = Math.min(1, o * 1.25); t.c = 1 - k; t.e = k * (o > .75 ? .75 : 1); t.s = k * (o > .75 ? .25 : 0); }
    else if (shape === "o") { var q = Math.min(1, o * 1.3); t.c = 1 - q; t.o = q; }
    return t;
  }

  function stateAt(now) { /* -> {shape, open} for the current moment of the active driver */
    if (S.mode === "idle") return { shape: "_", open: 0 };
    var el = S.el, p, tk, o = 0, shape, vz = -1;
    if (S.mode === "audio" && el) {
      if (el.paused && !el.ended && el.readyState < 3 && !el.currentTime) { return { shape: "_", open: 0 }; }
      var ct = el.currentTime || 0, dur = el.duration && isFinite(el.duration) ? el.duration : (S.dur || 6);
      if (S.env) { var fi = Math.min(S.env.length - 1, Math.max(0, Math.round(ct / S.envDt))), e = S.env[fi] || 0; p = (ct - S.start) / Math.max(.2, S.end - S.start); o = e; if (S.vis) { vz = S.vis[fi]; } }
      else { p = ct / dur; }
    } else if (S.mode === "tts") {
      var el2 = (now - S.t0) / 1000; p = S.boundary >= 0 ? S.boundary + Math.min(.07, ((now - S.tb) / 1000) / Math.max(.5, S.dur)) : el2 / Math.max(.5, S.dur);
    } else { p = (now - S.t0) / Math.max(1, S.dur); } /* "say": text only */
    if (vz >= 0) { shape = ["_", "s", "o", "e", "a"][vz]; o = Math.min(1, o * 1.15); if (vz === 0) o *= .2; if (vz === 1) o = Math.min(o, .5); }
    else if (S.pl) { tk = at(S.pl, p); shape = tk[0]; if (!(S.mode === "audio" && S.env)) o = tk[2] * (.86 + .14 * Math.sin(now / 70)); else { o = Math.min(1, o * 1.15); if (shape === "_") o *= .35; if (shape === "c" && o < .5) o *= .4; } }
    else { /* no text known: a natural-looking rhythm of vowels */
      var u = Math.floor(now / 190) % 7; shape = ["a", "o", "a", "e", "a", "s", "e"][u]; if (S.mode === "audio" && S.env) { o = Math.min(1, o * 1.15); } else o = .5 + .4 * Math.sin(now / 95);
    }
    if (p > 1.0 && S.mode !== "audio") return { shape: "_", open: 0 };
    return { shape: shape, open: Math.max(0, Math.min(1, o)) };
  }

  function frame(now) {
    S.raf = 0;
    instances = instances.filter(function (i) { return i.cv.isConnected; });
    if (!instances.length) return;
    var st = stateAt(now);
    if (S.emote > now) { st = { shape: "e", open: .8 }; }
    /* one smooth opening path closed -> small -> wide (these photos blend cleanly, no double lips); the vowel only tints it a little */
    var oo = st.shape === "_" || st.shape === "c" ? st.open * (st.shape === "c" ? .3 : .5) : st.open;
    OPEN += (oo - OPEN) * (oo > OPEN ? .38 : .2);                       /* quick to open, slower to close, like a real jaw */
    var tg = targetFrom("a", Math.max(0, Math.min(1, OPEN))), sp = S.mode === "idle" ? .22 : .45, sum = 0, k, mv;
    if (st.shape === "o") { mv = tg.a * .3 + tg.s * .25; tg.a *= .7; tg.s *= .75; tg.o = mv; }
    else if (st.shape === "e") { mv = tg.a * .35 + tg.s * .3; tg.a *= .65; tg.s *= .7; tg.e = mv; }
    for (k in W5) { W5[k] += (tg[k] - W5[k]) * sp; if (W5[k] < .005) W5[k] = 0; sum += W5[k]; }
    if (!sum) { W5.c = 1; sum = 1; }
    var dt = (now - S.lastT) / 1000; S.lastT = now;
    var talk = S.mode !== "idle", amp = talk ? st.open : 0;
    var tt = now / 1000, rot = Math.sin(tt * 1.1) * .45 + (talk ? Math.sin(tt * 3.1) * .7 * amp : 0), ty = Math.sin(tt * 1.7) * .8 - (talk ? amp * 1.4 : 0);
    instances.forEach(function (i) { draw(i); i.wrap.style.transform = reduce ? "" : "translateY(" + ty.toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg)"; i.root.classList.toggle("talk", talk); });
    var settled = S.mode === "idle" && Math.abs(W5.c - 1) < .01;
    if (!settled) S.raf = requestAnimationFrame(frame);
    else instances.forEach(draw);
  }
  function kick() { instances.forEach(draw); } /* photo only: no lip, head or idle movement */

  function draw(inst) {
    if (!ready || ready === "loading" || !inst.cv.isConnected) return;
    var g = inst.g, sum = 0, acc = 0, k, i, w;
    g.globalAlpha = 1; g.drawImage(IMG.c, 0, 0, W, H);
    sum = W5.c;
    for (i = 1; i < ORDER.length; i++) { k = ORDER[i]; w = W5[k]; if (w <= 0) continue; sum += w; g.globalAlpha = w / sum; g.drawImage(IMG[k], 0, 0, W, H); }
    g.globalAlpha = 1;
  }

  /* ---------- starting / stopping ---------- */
  function setMode(m) { S.mode = m; kick(); }
  function stop() { S.mode = "idle"; S.el = null; S.env = null; S.vis = null; S.pl = null; S.boundary = -1; kick(); }
  function say(text, ms) { /* text-only animation (no sound), e.g. when the Ustad "speaks" a bubble */
    if (!text) return; S.pl = plan(text); S.t0 = performance.now(); S.dur = ms || Math.min(14000, 900 + String(text).length * 62); S.el = null; S.env = null; setMode("say");
    var id = ++S.sayId || (S.sayId = 1); setTimeout(function () { if (S.sayId === id && S.mode === "say") stop(); }, S.dur + 150);
  }
  function hint(text) { S.hintText = String(text || ""); S.hintAt = Date.now(); }
  function emote() { S.emote = performance.now() + 1400; kick(); }

  /* real loudness of a clip from our own site (decoded once, cached) */
  var ENV = {}, AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  function envelope(src) {
    if (ENV[src] !== undefined) return Promise.resolve(ENV[src]);
    if (!AC || !src) return Promise.resolve(null);
    var u; try { u = new URL(src, location.href); } catch (e) { return Promise.resolve(null); }
    if (u.origin !== location.origin) { ENV[src] = null; return Promise.resolve(null); }
    return fetch(src).then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); }).then(function (b) {
      var ctx = new AC(1, 1, 22050); return new Promise(function (ok, no) { var p = ctx.decodeAudioData(b, ok, no); if (p && p.then) p.then(ok, no); });
    }).then(function (buf) {
      var d = buf.getChannelData(0), sr = buf.sampleRate, win = Math.round(sr * .03), n = Math.floor(d.length / win), a = new Float32Array(n), i, j, s, mx = 0, sorted;
      for (i = 0; i < n; i++) { s = 0; for (j = 0; j < win; j++) { var v = d[i * win + j]; s += v * v; } a[i] = Math.sqrt(s / win); }
      sorted = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; }); mx = sorted[Math.floor(sorted.length * .95)] || 1; if (mx < 1e-4) mx = 1;
      var sm = new Float32Array(n), st = -1, en = -1;
      for (i = 0; i < n; i++) { var v1 = Math.min(1, a[i] / mx); sm[i] = i ? sm[i - 1] * .35 + v1 * .65 : v1; sm[i] = sm[i] < .08 ? 0 : sm[i]; if (sm[i] > .15) { if (st < 0) st = i; en = i; } }
      var r = { a: sm, dt: win / sr, start: st < 0 ? 0 : st * win / sr, end: en < 0 ? n * win / sr : (en + 1) * win / sr, vis: visemes(d, sr, win, n, sm) }; ENV[src] = r; return r;
    }).catch(function () { ENV[src] = null; return null; });
  }
  /* mouth shape straight from the sound: a tiny FFT per 30 ms. Low "colour" (dark vowel) -> round lips, bright vowel -> smile,
     open vowel -> wide, hiss (s, sh, f) -> small gap, near-silence in speech -> lips closed. Thresholds adapt to this voice. */
  var FN = 1024, FW = null, FC = null, FS = null;
  function fft(re, im) {
    var n = re.length, i, j = 0, k, m, t;
    for (i = 1; i < n; i++) { var bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (var len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (i = 0; i < n; i += len) { var cr = 1, ci = 0; for (k = 0; k < len / 2; k++) { var a = i + k, b = a + len / 2, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr; re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi; m = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = m; } }
    }
  }
  function visemes(d, sr, win, n, sm) {
    if (!FW) { FW = new Float32Array(FN); for (var q = 0; q < FN; q++) FW[q] = .5 - .5 * Math.cos(2 * Math.PI * q / (FN - 1)); FC = new Float32Array(FN); FS = new Float32Array(FN); }
    var hz = sr / FN, b250 = Math.round(250 / hz), b900 = Math.round(900 / hz), b3k = Math.round(3000 / hz), b3k5 = Math.round(3500 / hz), bmax = Math.round(Math.min(9000, sr / 2 - 50) / hz);
    var cen = new Float32Array(n), hiss = new Float32Array(n), vc = [], i, k, j;
    for (i = 0; i < n; i++) {
      if (sm[i] < .1) continue;
      var c0 = i * win + (win >> 1) - (FN >> 1), re = FC, im = FS;
      for (j = 0; j < FN; j++) { var ix = c0 + j; re[j] = ix >= 0 && ix < d.length ? d[ix] * FW[j] : 0; im[j] = 0; }
      fft(re, im);
      var e1 = 0, e2 = 0, e3 = 0, num = 0, den = 0, m2;
      for (k = b250; k < bmax; k++) { m2 = re[k] * re[k] + im[k] * im[k]; if (k < b900) e1 += m2; else if (k < b3k5) e2 += m2; else e3 += m2; if (k < b3k) { var mg = Math.sqrt(m2); num += k * hz * mg; den += mg; } }
      var tot = e1 + e2 + e3 + 1e-12; hiss[i] = e3 / tot; cen[i] = den > 0 ? num / den : 0; vc.push(cen[i]);
    }
    vc.sort(function (x, y) { return x - y; });
    var lo = vc.length ? vc[Math.floor(vc.length * .3)] : 900, hi = vc.length ? vc[Math.floor(vc.length * .72)] : 1700, out = new Uint8Array(n);
    /* 0 closed, 1 small(s), 2 round(o), 3 smile(e), 4 wide(a) */
    for (i = 0; i < n; i++) {
      if (sm[i] < .1) { out[i] = 0; continue; }
      if (hiss[i] > .5) out[i] = 1; else if (cen[i] < lo) out[i] = 2; else if (cen[i] > hi) out[i] = 3; else out[i] = 4;
    }
    var sm2 = new Uint8Array(n); /* 3-frame majority so the lips do not flicker */
    for (i = 0; i < n; i++) { var a0 = out[Math.max(0, i - 1)], a1 = out[i], a2 = out[Math.min(n - 1, i + 1)]; sm2[i] = a0 === a2 ? a0 : a1; }
    return sm2;
  }
  function driveAudio(el) {
    var txt = S.hintText && Date.now() - S.hintAt < 4000 ? S.hintText : ""; S.hintText = "";
    S.pl = txt ? plan(txt) : null; S.el = el; S.env = null; S.vis = null; S.start = 0; S.end = el.duration && isFinite(el.duration) ? el.duration : 6; S.dur = S.end; S.sayId = (S.sayId || 0) + 1;
    setMode("audio");
    var tok = S.tokA = (S.tokA || 0) + 1, src = el.currentSrc || el.src;
    envelope(src).then(function (e) { if (e && S.tokA === tok && S.el === el) { S.env = e.a; S.vis = e.vis; S.envDt = e.dt; S.start = e.start; S.end = e.end; } });
    var done = function () { if (S.el === el) { el.removeEventListener("ended", done); el.removeEventListener("pause", done); el.removeEventListener("error", done); stop(); } };
    el.addEventListener("ended", done); el.addEventListener("pause", done); el.addEventListener("error", done);
  }
  function driveTTS(u) {
    var txt = u.text || ""; if (!txt) return;
    u.addEventListener("start", function () {
      u.__lip = 1; S.pl = plan(txt); S.el = null; S.env = null; S.t0 = performance.now(); S.boundary = -1; S.sayId = (S.sayId || 0) + 1;
      S.dur = Math.max(1, (txt.length * 62) / (u.rate || 1) / 1000 * 1.0); setMode("tts");
    });
    u.addEventListener("boundary", function (e) {
      if (S.mode !== "tts" || (e.name && e.name !== "word")) return;
      var cs = Math.min(txt.length, e.charIndex || 0), pre = tokens(txt.slice(0, cs)), tw = 0, k; for (k = 0; k < pre.length; k++) tw += pre[k][1];
      S.boundary = S.pl ? Math.min(.999, tw / S.pl.total) : 0; S.tb = performance.now();
    });
    setTimeout(function () { try { if (S.mode === "idle" && window.speechSynthesis.speaking && !u.__lip) { u.__lip = 1; S.pl = plan(txt); S.t0 = performance.now(); S.dur = Math.max(1, txt.length * 62 / (u.rate || 1) / 1000); S.boundary = -1; setMode("tts"); } } catch (e) {} }, 450);
    var end = function () { if (S.mode === "tts") stop(); };
    u.addEventListener("end", end); u.addEventListener("error", end);
  }

  /* ---------- hooks: every sound the app plays moves the lips ---------- */
  try {
    var HMP = HTMLMediaElement.prototype, origPlay = HMP.play;
    HMP.play = function () { var el = this, r = origPlay.apply(el, arguments); if (instances.length && el.tagName === "AUDIO" && !el.dataset.nolip) { try { var go = function () { driveAudio(el); }; if (r && r.then) r.then(go, function () {}); else go(); } catch (e) {} } return r; };
  } catch (e) {}
  try {
    if (window.speechSynthesis) {
      var ss = window.speechSynthesis, osp = ss.speak, ocn = ss.cancel;
      ss.speak = function (u) { try { if (instances.length) driveTTS(u); } catch (e) {} return osp.call(ss, u); };
      ss.cancel = function () { var r = ocn.call(ss); if (S.mode === "tts") stop(); return r; };
    }
  } catch (e) {}

  /* ---------- mounting a face ---------- */
  var CSS = ".ustd{position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit;background:radial-gradient(120% 90% at 50% 20%,#efe4cf,#d8c7a3)}" +
    ".ustd .uw{position:absolute;inset:-2% -4% -2% -4%;display:block;transform-origin:50% 100%;will-change:transform}" +
    ".ustd canvas{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block}" +
    ".ustd::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35),inset 0 -26px 28px -22px rgba(20,60,45,.55);pointer-events:none}" +
    "@keyframes ustidle{0%,100%{transform:translateY(0) rotate(-.35deg)}50%{transform:translateY(-1.5px) rotate(.35deg)}}" +
    "";
  function mount(el, opts) {
    if (!el) return null; load();
    if (!document.getElementById("ustd-css")) { var st = document.createElement("style"); st.id = "ustd-css"; st.textContent = CSS; document.head.appendChild(st); }
    el.innerHTML = ""; var root = document.createElement("div"); root.className = "ustd"; root.setAttribute("role", "img"); root.setAttribute("aria-label", (opts && opts.label) || "AI Teacher");
    var wrap = document.createElement("span"); wrap.className = "uw"; var cv = document.createElement("canvas"); cv.width = W; cv.height = H; wrap.appendChild(cv); root.appendChild(wrap); el.appendChild(root);
    var inst = { root: root, wrap: wrap, cv: cv, g: cv.getContext("2d") }; instances.push(inst); draw(inst); kick(); return inst;
  }

  window.QSUstad = { mount: mount, say: say, hint: hint, stop: stop, emote: emote, _tokens: tokens, _plan: plan, _state: S };
  load();
})();

/* Makharij Lab — REAL clips. Photoreal medical-section video of the mouth (lips, jaw, teeth, tongue, palate, throat), one pose per makhraj.
   All poses live in ONE short video (mk/sprite.mp4); the engine scrubs it frame by frame, so the picture moves exactly with the recording:
   the same interface as the 3D lab (to / speak / rest / labels / at / destroy), so every place that used the 3D lab now shows the real clips.
   On top: the letter, a glowing contact point, airflow and part names with the qari terms (الثنايا، أقصى اللسان، الحنك ...). */
(function () {
  "use strict";
  const SRC = (document.currentScript && document.currentScript.src) || "mouthclip.js";
  const BASE = SRC.replace(/mouthclip\.js.*$/, "mk/"), NS = "http://www.w3.org/2000/svg", V = 450;
  let IDX = null, IDXP = null, LIPS = null;
  const idx = () => IDXP || (IDXP = fetch(BASE + "clips.json").then(r => r.json()).then(j => (IDX = j)).catch(() => null));
  /* the clips come as ONE small video, fetched once and kept as a blob: scrubbing a blob is instant and works offline too */
  const blobs = {}, blobUrl = f => blobs[f] || (blobs[f] = fetch(BASE + f).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => URL.createObjectURL(b)).catch(() => { delete blobs[f]; return null; }));
  /* H.264 mp4 for iPhone / most phones, VP9 webm where mp4 is not available */
  const FMT = (() => { try { const v = document.createElement("video"), c = v.canPlayType ? v.canPlayType.bind(v) : () => ""; return c('video/mp4; codecs="avc1.42E01E"') ? "mp4" : c('video/webm; codecs="vp9"') ? "webm" : ""; } catch (e) { return ""; } })();
  function ok() { return !!FMT; }
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = t => t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);

  /* which clip shows which zone (zones are the app's makharij zones); ر has its own curling-tip clip; zones without a clip show the resting mouth */
  const ZCLIP = { jawf: "jawf", h1: "h1", h2: "h2", h3: "h3", l1: "l1", l2: "l2", l3: "l3", l4: "l4", l5: "l5", l6: "l6", l7: "l7", l8: "l8", s1: null, s2: null, kh: null };
  const clipFor = (ch, zone) => ch === "ر" ? "raa" : (ZCLIP[zone] || null);
  /* glowing contact point in the 450×450 frame of the clip, and the qari term of the makhraj */
  const CP = { jawf: [200, 268], h1: [290, 415], h2: [312, 340], h3: [306, 262], l1: [282, 232], l2: [252, 222], l3: [195, 214], l4: [228, 238], l5: [120, 222], l6: [112, 236], l7: [118, 282], l8: [90, 258], s1: [92, 268], s2: [80, 268], kh: [190, 120] };
  const ZT = { jawf: "الجوف", h1: "أقصى الحلق", h2: "وسط الحلق", h3: "أدنى الحلق", l1: "أقصى اللسان + الحنك اللين", l2: "أقصى اللسان + الحنك", l3: "وسط اللسان + الحنك الصلب", l4: "حافة اللسان + الأضراس", l5: "طرف اللسان + اللثة", l6: "طرف اللسان + أصول الثنايا العليا", l7: "طرف اللسان + الثنايا السفلى", l8: "طرف اللسان + أطراف الثنايا العليا", s1: "الشفة السفلى + الثنايا العليا", s2: "الشفتان", kh: "الخيشوم" };
  /* names of the visible parts, with the qari word; y/x = where the name sits, to = what it points at */
  const LBL = {
    lips: { en: "Lips · Shafatān", ur: "ہونٹ · الشفتان", hi: "होंठ · अश-शफ़तान", at: [52, 392], to: [82, 300] },
    teeth: { en: "Teeth · Asnān", ur: "دانت · الأسنان", hi: "दाँत · अल-अस्नान", at: [118, 120], to: [128, 236] },
    tongue: { en: "Tongue · Lisān", ur: "زبان · اللسان", hi: "ज़बान · अल-लिसान", at: [215, 372], to: [215, 292] },
    palate: { en: "Hard palate · Hanak", ur: "سخت تالو · الحنك", hi: "सख़्त तालू · अल-हनक", at: [255, 78], to: [215, 205] },
    soft: { en: "Soft palate · Lahāt", ur: "نرم تالو · اللهاة", hi: "नर्म तालू · अल-लहात", at: [352, 150], to: [272, 226] },
    nose: { en: "Nose · Khayshūm", ur: "ناک · الخیشوم", hi: "नाक · अल-ख़ैशूम", at: [140, 38], to: [160, 118] },
    throat: { en: "Throat · Halq", ur: "حلق · الحلق", hi: "हल्क़ · अल-हल्क़", at: [372, 296], to: [316, 300] },
    jaw: { en: "Lower jaw", ur: "نچلا جبڑا", hi: "निचला जबड़ा", at: [60, 432], to: [108, 352] },
    folds: { en: "Voice box", ur: "آواز کی ڈوریاں", hi: "आवाज़ की डोरियाँ", at: [345, 428], to: [292, 412] }
  };
  const AIR = {
    mouth: "M300,445 C305,380 312,320 300,270 C285,240 230,262 170,268 C120,272 80,266 20,262",
    teeth: "M300,445 C305,380 312,320 300,270 C285,240 230,258 170,262 C130,264 100,272 70,284 L20,290",
    lips: "M300,445 C305,380 312,320 300,270 C285,240 230,262 170,268 C120,272 80,270 20,268",
    nose: "M300,445 C305,380 306,320 296,250 C290,190 250,130 190,118 C130,108 70,120 20,138"
  };
  /* lip + vowel poses live in a small second clip (mk/lips.mp4), shown as a front-view inset when the lips decide the sound */
  /* every letter has its own lip shape in the front view: [pose, how far 0..1 from the resting lips] */
  const LIPMAP = { "ب": ["B", 1], "م": ["B", 1], "و": ["O", 1], "ف": ["F", 1], "ي": ["E", 1], "ى": ["E", 1],
    "ا": ["A", 1], "أ": ["A", 1], "إ": ["A", .9], "آ": ["A", 1], "ٱ": ["A", .9], "ء": ["A", .8], "ه": ["A", .9], "ع": ["A", 1], "ح": ["A", .8], "غ": ["A", .7], "خ": ["A", .7], "ق": ["Q", 1], "ك": ["Q", .7],
    "ج": ["SH", .6], "ش": ["SH", 1], "ض": ["T", .8], "ل": ["T", 1], "ن": ["T", .6], "ر": ["T", .7], "ت": ["T", .7], "د": ["T", .7], "ط": ["T", .8],
    "ث": ["TH", 1], "ذ": ["TH", 1], "ظ": ["TH", .9], "س": ["S", 1], "ص": ["S", .9], "ز": ["S", 1], "ة": ["A", .4], "ؤ": ["O", .8], "ئ": ["E", .8] };
  const LOCKL = "بمفو";

  function Lab(svgEl, lang, opt) {
    opt = opt || {}; const LO = !!opt.lipsOnly; /* lipsOnly: just the front-view lips window, driven next to the 3D head */
    const wrap = document.createElement("div"); wrap.className = LO ? "mllips" : "ml3"; if (LO) wrap.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:6";
    const vid = document.createElement("video"); vid.className = LO ? "" : "ml3c"; if (LO) vid.style.display = "none"; vid.muted = true; vid.playsInline = true; vid.preload = "auto"; vid.setAttribute("playsinline", ""); vid.setAttribute("muted", ""); vid.disablePictureInPicture = true; vid.style.objectFit = "cover"; vid.style.background = "#0a0f16";
    const ov = document.createElementNS(NS, "svg"); ov.setAttribute("viewBox", `0 0 ${V} ${V}`); ov.setAttribute("class", LO ? "" : "ml3o"); if (LO) ov.style.display = "none";
    ov.addEventListener("click", e => { const g = e.target.closest && e.target.closest("[data-part]"); if (g) wrap.dispatchEvent(new CustomEvent("mlpart", { detail: g.getAttribute("data-part"), bubbles: true })); });
    ov.innerHTML = `<defs><radialGradient id="m3g"><stop offset="0" stop-color="#fff7c2"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient>
      <filter id="m3b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="m3t" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ffb000" flood-opacity=".75"/></filter></defs>
      <g id="m3air" fill="none" stroke-linecap="round"></g><g id="m3glow"></g><g id="m3lbl" font-family="Outfit,'Noto Sans Devanagari','Noto Nastaliq Urdu',sans-serif" font-size="12" font-weight="600"></g>
      <g id="m3pt" opacity="0"><line id="m3ln" stroke="#ffd56a" stroke-width="1.6" opacity=".9"/><circle r="22" fill="url(#m3g)" class="mlPulse"/><circle r="6" fill="#ffe36a" stroke="#fff8d0" stroke-width="1.8"/><circle r="13" fill="none" stroke="#ffd23f" stroke-width="2" class="mlRing"/></g>
      <g id="m3tg" opacity="0"></g>
      <text id="m3ch" x="388" y="420" text-anchor="middle" font-size="64" fill="#ffe08a" filter="url(#m3t)" font-family="'Amiri Quran','Noto Naskh Arabic',serif"></text>`;
    /* front-view lips inset (appears only when the lips make the sound, once mk/lips.mp4 exists) */
    const inset = document.createElement("div"); inset.className = "mlip"; inset.style.cssText = "position:absolute;left:8px;bottom:8px;width:34%;aspect-ratio:1/1;border-radius:14px;overflow:hidden;border:2px solid #e3aa3c;box-shadow:0 6px 20px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s;background:#0a0f16";
    const lv = document.createElement("video"); lv.muted = true; lv.playsInline = true; lv.preload = "auto"; lv.setAttribute("playsinline", ""); lv.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
    const lcap = document.createElement("b"); lcap.style.cssText = "position:absolute;left:0;right:0;bottom:0;padding:3px 6px;font:700 11px Outfit,sans-serif;color:#ffe08a;background:linear-gradient(#0000,#000b);text-align:center"; lcap.textContent = "الشفتان";
    inset.append(lv, lcap); wrap.append(vid, ov, inset); svgEl.replaceWith(wrap);
    const q = id => ov.querySelector("#" + id);
    let L = lang, showLbl = true, raf = 0, ready = LO, dead = false, state = { id: null, w: 0, lip: null, lw: 0 }, lastSeek = -1, lastLip = -1, hold = null;

    const seekTo = (t) => { if (!ready) return; if (Math.abs(vid.currentTime - t) > 0.0005) { try { vid.currentTime = t; } catch (e) {} } };
    function frameOf(id, w) { const c = IDX && IDX.clips[id || "jawf"]; if (!c) return 0; if (!id) return c.start; return w <= 1 ? lerp(c.start, c.peak, clamp(w, 0, 1)) : lerp(c.peak, c.end, clamp((w - 1) / .5, 0, 1)); }
    function draw() {
      if (!IDX && !LO) return;
      if (!LO) { const fps = IDX.fps || 24, f = Math.round(frameOf(state.id, state.w)); if (f !== lastSeek) { lastSeek = f; seekTo((f + .5) / fps); } }
      if (LIPS && lv.readyState >= 1) { const lc = state.lip && LIPS.poses[state.lip]; const lf = lc ? Math.round(lerp(lc.start, lc.peak, clamp(state.lw, 0, 1))) : 0;
        if (lf !== lastLip) { lastLip = lf; try { lv.currentTime = (lf + .5) / (LIPS.fps || 24); } catch (e) {} }
        inset.style.opacity = lc && state.lw > .02 ? 1 : 0; }
    }
    /* overlay: contact point, airflow, glow, the qari term */
    function overlay(zone, ch, on) {
      const pt = q("m3pt"), tg = q("m3tg"), c = CP[zone];
      q("m3ch").textContent = on ? ch || "" : "";
      if (on && c) { pt.setAttribute("transform", `translate(${c[0]},${c[1]})`); pt.style.opacity = 1; const ln = q("m3ln"); ln.setAttribute("x1", 0); ln.setAttribute("y1", 0); ln.setAttribute("x2", 388 - c[0]); ln.setAttribute("y2", 392 - c[1]); ln.style.display = ch ? "" : "none";
        const term = ZT[zone] || "", wd = Math.max(80, term.length * 8 + 24), tx = c[0] < 200 ? c[0] + 18 : c[0] - 18 - wd, ty = clamp(c[1] - 34, 20, 410);
        tg.innerHTML = term ? `<rect x="${tx}" y="${ty - 13}" width="${wd}" height="26" rx="13" fill="#0d151d" fill-opacity=".86" stroke="#e3aa3c" stroke-width="1.2"/><text x="${tx + wd / 2}" y="${ty + 5}" text-anchor="middle" font-size="14" fill="#ffe08a" font-family="'Amiri Quran','Noto Naskh Arabic',serif">${term}</text>` : ""; tg.style.opacity = 1; }
      else { pt.style.opacity = 0; tg.style.opacity = 0; }
      q("m3glow").innerHTML = !on ? "" : zone === "jawf" ? `<ellipse cx="205" cy="268" rx="120" ry="32" fill="#7fe0ff" opacity=".28" filter="url(#m3b)"/>`
        : zone === "h1" || zone === "h2" || zone === "h3" ? `<ellipse cx="312" cy="${zone === "h1" ? 400 : zone === "h2" ? 340 : 275}" rx="20" ry="${zone === "h1" ? 40 : 55}" fill="#ffd23f" opacity=".28" filter="url(#m3b)"/>`
        : zone === "kh" ? `<ellipse cx="190" cy="118" rx="90" ry="26" fill="#7fe0ff" opacity=".3" filter="url(#m3b)"/>` : "";
      const air = !on ? null : zone === "kh" ? AIR.nose : zone === "l7" ? AIR.teeth : zone === "s1" || zone === "s2" ? AIR.lips : zone === "jawf" || /^l/.test(zone) ? null : AIR.mouth;
      q("m3air").innerHTML = air ? `<path d="${air}" stroke="#7fd8ff" stroke-width="8" opacity=".2" filter="url(#m3b)"/><path d="${air}" class="mlFlow" stroke="#a8ecff" stroke-width="3" stroke-dasharray="3 11" opacity=".9"/>` : "";
    }
    function labels() {
      q("m3lbl").innerHTML = showLbl ? Object.entries(LBL).map(([key, l]) => {
        const t = l[L] || l.en, wd = Math.max(64, t.length * (L === "en" ? 7.2 : 7.6) + 20), [x, y] = l.at;
        return `<g class="m3part" data-part="${key}" style="cursor:pointer"><rect x="${x - wd / 2 - 6}" y="${y - 22}" width="${wd + 12}" height="44" rx="14" fill="rgba(0,0,0,.01)"/><line x1="${x}" y1="${y}" x2="${l.to[0]}" y2="${l.to[1]}" stroke="#d9f1ff" stroke-width="1.1" opacity=".85"/><circle cx="${l.to[0]}" cy="${l.to[1]}" r="3" fill="#d9f1ff"/><rect x="${x - wd / 2}" y="${y - 10}" width="${wd}" height="20" rx="10" fill="#0d151d" fill-opacity=".84" stroke="#8fd3ff" stroke-width="1"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#eaf6ff"${L === "ur" ? ' direction="rtl"' : ""}>${t}</text></g>`;
      }).join("") : "";
    }
    labels();
    /* ----- motion: a pose is (clip id, w 0..1[..1.5]); changing clip always goes through the resting mouth, which every clip starts from ----- */
    const cl = o => ({ id: o.id, w: o.w, lip: o.lip || null, lw: o.lw || 0 });
    function mixp(a, b, k) { // a -> rest -> b when the clips differ
      let id, w; if (a.id === b.id) { id = a.id; w = lerp(a.w, b.w, k); } else if (k < .5) { id = a.id; w = a.w * (1 - k * 2); } else { id = b.id; w = b.w * (k * 2 - 1); }
      const lip = a.lip === b.lip ? a.lip : (k < .5 ? a.lip : b.lip), lw = a.lip === b.lip ? lerp(a.lw, b.lw, k) : (k < .5 ? a.lw * (1 - k * 2) : b.lw * (k * 2 - 1));
      return { id, w, lip, lw };
    }
    function apply(p) { state = cl(p); draw(); }
    function go(target, ms, then) {
      cancelAnimationFrame(raf); const from = cl(state), t0 = performance.now();
      return new Promise(res => { const step = now => { if (dead) return res(); const k = clamp((now - t0) / (ms || 1), 0, 1); apply(mixp(from, target, ease(k)));
        if (k < 1) raf = requestAnimationFrame(step); else { then && then(); res(); } }; raf = requestAnimationFrame(step); });
    }
    const target = (ch, zone, vowel) => { const id = LO ? null : clipFor(ch, zone), lm = LIPMAP[ch] || null, lock = LOCKL.includes(ch),
        vl = vowel === "u" ? ["O", 1] : vowel === "i" ? ["E", 1] : vowel === "a" ? ["A", .85] : null, lp = lock && !vowel ? lm : (vl || lm);
      if (vowel === "a" && id && !lock) return { id: "jawf", w: .6, lip: "A", lw: .85 }; return { id, w: id ? 1 : 0, lip: lp ? lp[0] : null, lw: lp ? lp[1] : 0 }; };
    /* a little life after the pose is reached: the air keeps flowing (س ص ز), the clip's own ending plays */
    function alive(id) { const c = IDX && IDX.clips[id]; if (!c || c.end <= c.peak + 1 || id !== "l7") return; const t0 = performance.now();
      const step = now => { if (dead || state.id !== id || state.w < 1) return; const k = clamp((now - t0) / 1600, 0, 1); state.w = 1 + .5 * ease(k); draw(); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
    if (!LO) Promise.all([idx(), blobUrl("sprite." + FMT)]).then(([j, u]) => { if (dead) return; if (!j || !u) { wrap.dispatchEvent(new CustomEvent("mlclipfail", { bubbles: true })); return; }
      vid.src = u; vid.load(); ready = true; draw(); });
    (LIPS ? Promise.resolve(LIPS) : fetch(BASE + "lips.json").then(r => r.ok ? r.json() : null).then(j => (j ? (LIPS = j) : null)).catch(() => null))
      .then(j => j && blobUrl("lips." + FMT).then(u => { if (u && !dead) { lv.src = u; lv.load(); draw(); } }));
    const onResize = () => draw(); window.addEventListener("resize", onResize);
    const waitReady = () => ready ? Promise.resolve() : new Promise(r => { const t = setInterval(() => { if (ready || dead) { clearInterval(t); r(); } }, 60); });

    function speak(segs, getP) {
      cancelAnimationFrame(raf);
      overlay(null, "", false);
      const K = [{ t: 0, p: cl(state), ch: "", z: null }]; let t = 0; const LOCK = LOCKL;
      segs.forEach(sg => {
        const V = target(sg.ch, sg.zone, sg.v || ""), C = target(sg.ch, sg.zone, ""); if (!LOCK.includes(sg.ch) && sg.v) { C.lip = V.lip; C.lw = V.lw * .6; }
        const cw = sg.dbl ? 1.7 : sg.ch === "ء" ? .7 : 1;
        t += cw * .7; K.push({ t, p: cl(C), ch: sg.ch, z: sg.zone }); t += cw * .3;
        if (sg.dbl) { t += .5; K.push({ t, p: cl(C), ch: sg.ch, z: sg.zone }); }
        if (sg.v) { const vw = sg.long ? 2.6 : 1.15; t += vw * .4; K.push({ t, p: cl(V), ch: sg.ch, z: sg.zone }); t += vw * .6; K.push({ t, p: cl(V), ch: sg.ch, z: sg.zone }); }
        else if (!sg.dbl) { t += .35; K.push({ t, p: cl(C), ch: sg.ch, z: sg.zone }); }
      });
      const END = t, R = { id: null, w: 0, lip: null, lw: 0 };
      return new Promise(res => { let done = 0, lp = null; const fin = () => { if (done++) return; if (lp) state = cl(lp); overlay(null, "", false); go(R, 380).then(res); };
        waitReady().then(() => { const step = () => { if (dead) return res(); const p = getP(); if (p >= 1.02) return fin();
          const e = clamp(p, 0, 1) * END; let i = 1; while (i < K.length - 1 && K[i].t < e) i++;
          const a = K[i - 1], b = K[i], k = clamp((e - a.t) / Math.max(1e-6, b.t - a.t), 0, 1); lp = mixp(a.p, b.p, ease(k)); apply(lp);
          const cur = k < .5 ? a : b; overlay(cur.z, cur.ch, !!cur.z && (lp.w > .6 || lp.lw > .6 || (!ZCLIP[cur.z] && cur.ch !== "ر" && k > .4))); raf = requestAnimationFrame(step); };
          raf = requestAnimationFrame(step); }); });
    }
    return {
      to(ch, zone, ms, vowel) { overlay(null, ch, false); const tg = target(ch, zone, vowel); return waitReady().then(() => go(tg, ms || 650, () => { overlay(zone, ch, true); alive(tg.id); })); },
      flow(segs, total) { let i = 0; const t0 = performance.now(); return speak(segs.map(s => Object.assign({}, s)), () => (performance.now() - t0) / (total || 1200)); },
      speak,
      rest(ms) { overlay(null, "", false); return waitReady().then(() => go({ id: null, w: 0, lip: null, lw: 0 }, ms || 500)); },
      labels(on, lg) { showLbl = on; if (lg) L = lg; labels(); },
      destroy() { dead = true; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); try { vid.removeAttribute("src"); vid.load(); lv.removeAttribute("src"); lv.load(); } catch (e) {} },
      at(ch, zone) { const c = CP[zone]; return c ? [c[0] / V, c[1] / V] : [.5, .5]; }
    };
  }
  window.MLabClip = { Lab, ok };
})();

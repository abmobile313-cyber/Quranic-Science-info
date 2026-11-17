"use strict";
/* Quranic Science — Tajweed Coach: the checking brain (pure functions, no DOM).
   expected Qur'an text (Indopak or Uthmani)  vs  what the AI blindly heard  →  letter-by-letter verdict.
   Exposed as window.CoachCore (and module.exports for tests). */
(function (root) {
  const FOLD = { "ٱ": "ا", "أ": "ا", "إ": "ا", "آ": "ا", "ٲ": "ا", "ٳ": "ا", "ٵ": "ا", "ى": "ي", "ی": "ي", "ې": "ي", "ۍ": "ي", "ئ": "ي", "ٸ": "ي", "ک": "ك", "گ": "ك", "ہ": "ه", "ھ": "ه", "ۃ": "ه", "ە": "ه", "ة": "ه", "ؤ": "و", "ٶ": "و", "ۇ": "و" };
  const isLetter = ch => /[ء-يٮ-ۓۺ-ۿٱ-ٳٵ-ٷ]/.test(ch) && !/[ً-ٟ]/.test(ch);
  const isWordTok = s => /[ء-يٱ-ۓ]/.test(s.replace(/[ً-ٰٟۖ-ۭ]/g, ""));
  const splitWords = ayah => String(ayah || "").replace(/ـ/g, "").split(/\s+/).filter(isWordTok);

  /* one word → list of letter items  {c: base letter, v: vowel a/u/i/an/un/in, S: shadda, sk: sukun, sup: dagger alef, wasl} */
  function parse(word) {
    const out = [];
    for (const ch of String(word).replace(/ـ/g, "")) {
      const o = out[out.length - 1], cc = ch.charCodeAt(0);
      if (ch === "ٰ") { out.push({ c: "ا", v: "", S: false, sk: false, sup: true }); continue; }
      if (cc >= 0x064B && cc <= 0x065F || cc >= 0x0656 && cc <= 0x0658 || cc === 0x06E1 || cc >= 0x08F0 && cc <= 0x08F2) {
        if (!o) continue;
        if (ch === "َ") o.v = "a"; else if (ch === "ُ" || ch === "ٗ") o.v = "u"; else if (ch === "ِ" || ch === "ٖ") o.v = "i";
        else if (ch === "ً" || ch === "ࣰ") o.v = "an"; else if (ch === "ٌ" || ch === "ࣱ") o.v = "un"; else if (ch === "ٍ" || ch === "ࣲ") o.v = "in";
        else if (ch === "ّ") o.S = true; else if (ch === "ْ" || ch === "ۡ") o.sk = true;
        continue;
      }
      if (cc >= 0x06D6 && cc <= 0x06ED || cc >= 0x0610 && cc <= 0x061A || cc >= 0x08D3 && cc <= 0x08FF) continue; /* waqf signs, small marks */
      const c = FOLD[ch] || ch; if (!/[ء-ي]/.test(c)) continue;
      out.push({ c, v: "", S: false, sk: false, sup: false });
    }
    /* dagger-alef quirks: Allah (للّٰه) and صلوٰة / زكوٰة style words differ between Indopak and Uthmani spelling */
    for (let i = out.length - 1; i >= 0; i--) {
      if (!out[i].sup) continue;
      const p = out[i - 1], n = out[i + 1], pp = out[i - 2];
      if (p && p.c === "ل" && pp && pp.c === "ل" && n && n.c === "ه") out.splice(i, 1);
      else if (p && p.c === "و" || n && n.c === "و") out.splice(i, 1);
    }
    /* a bare alef + sukun-less long-vowel letter keeps no vowel */
    return out;
  }
  const skeleton = w => parse(w).map(x => x.c).join("");

  /* flatten a list of words into letter items, remembering word index / position */
  function flat(words) {
    const items = [];
    words.forEach((w, wi) => {
      const ps = parse(w);
      ps.forEach((p, k) => {
        p.w = wi; p.k = k; p.last = k === ps.length - 1; p.first = k === 0;
        /* hamzat-wasl alef (no vowel) and the lam of "al" before a sun letter may be skipped when reading on */
        p.opt = false;
        if (p.first && p.c === "ا" && !p.v && !p.sup) p.opt = true;
        if (k === 1 && p.c === "ل" && ps[0].c === "ا" && !ps[0].v && ps[2] && ps[2].S) p.opt = true;
        items.push(p);
      });
    });
    return items;
  }

  /* letters a student mixes up (symmetric); value = how close the sounds are */
  const CONF = {};
  ["صس", "ضد", "طت", "ظذ", "ظز", "ذز", "حه", "عا", "عء", "ءا", "قك", "غخ", "ثس", "ثت", "شس", "صض", "ضظ", "طد", "ذد", "قغ", "قخ", "كخ", "حخ", "عغ", "زس", "ثف", "ءه", "ظض", "صز", "ثش", "طظ", "ذث", "ذط"].forEach(p => { CONF[p] = CONF[p[1] + p[0]] = 1; });
  const confusable = (a, b) => !!CONF[a + b];
  const MADD = { "ا": 1, "و": 1, "ي": 1 };

  /* Levenshtein alignment between expected items and heard items */
  function align(E, H) {
    const n = E.length, m = H.length, D = [], B = [];
    const sub = (e, h) => e.c === h.c ? 0 : (e.c === "ا" && h.c === "ء" || e.c === "ء" && h.c === "ا") ? 0.15 : confusable(e.c, h.c) ? 0.6 : 1;
    const del = e => e.opt ? 0 : (MADD[e.c] ? 0.9 : 1), ins = () => 0.8;
    for (let i = 0; i <= n; i++) { D[i] = new Float32Array(m + 1); B[i] = new Uint8Array(m + 1); }
    for (let i = 1; i <= n; i++) { D[i][0] = D[i - 1][0] + del(E[i - 1]); B[i][0] = 2; }
    for (let j = 1; j <= m; j++) { D[0][j] = D[0][j - 1] + ins(); B[0][j] = 3; }
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
      const a = D[i - 1][j - 1] + sub(E[i - 1], H[j - 1]), b = D[i - 1][j] + del(E[i - 1]), c = D[i][j - 1] + ins();
      if (a <= b && a <= c) { D[i][j] = a; B[i][j] = 1; } else if (b <= c) { D[i][j] = b; B[i][j] = 2; } else { D[i][j] = c; B[i][j] = 3; }
    }
    const ops = []; let i = n, j = m;
    while (i > 0 || j > 0) {
      const b = B[i][j];
      if (i > 0 && j > 0 && b === 1) { ops.push({ t: E[i - 1].c === H[j - 1].c ? "m" : "s", e: E[i - 1], h: H[j - 1] }); i--; j--; }
      else if (i > 0 && (j === 0 || b === 2)) { ops.push({ t: "d", e: E[i - 1] }); i--; }
      else { ops.push({ t: "i", h: H[j - 1], after: i }); j--; }
    }
    return ops.reverse();
  }

  const vNorm = v => v === "an" ? "a" : v === "un" ? "u" : v === "in" ? "i" : v;
  /* vowel / shadda comparison for two matched letters; returns null or an issue code */
  function vowelIssue(e, h, lastWordOfAyah) {
    const heardKnown = !!(h.v || h.sk || h.S);
    if (!heardKnown) return null; /* the AI wrote no mark: cannot judge, never blame the student */
    if (e.last) return null; /* word endings change when the student stops (waqf) or joins words */
    if (e.S && !h.S) return "tashdeed-miss";
    if (!e.S && h.S) return "tashdeed-extra";
    if (e.v && h.v && vNorm(e.v) !== vNorm(h.v)) return "vowel";
    if (!e.v && e.sk && h.v && !MADD[e.c] && !e.sup) return "vowel-extra";
    return null;
  }

  function statusOf(w) {
    const is = w.issues || [];
    if (!is.length) return w.unsure ? "unsure" : "ok";
    const real = is.filter(x => x.type === "del" || x.type === "madd-miss").length;
    if (real >= (w.total || 1)) return "missed";
    if (is.some(x => /^(sub|del|madd-miss|extra)$/.test(x.type))) return "letter";
    return "harakat";
  }
  const ikey = x => x.type + ":" + (x.c || "") + ":" + (x.hc || x.h || "") + ":" + (x.e && x.e.v || "") + ">" + (x.h && x.h.v || "");
  const penOf = x => x.type === "sub" ? (confusable(x.c, x.hc) ? 0.8 : 1) : x.type === "del" ? 1 : x.type === "madd-miss" ? 0.7 : 0.5;
  /* several independent listens: an error counts only when most passes heard it (2 of 2, or 2 of 3) — a lone one is noise and is dropped */
  function merge(rs, opt) {
    opt = opt || {}; const n = rs.length, need = n === 2 ? 2 : Math.floor(n / 2) + 1, r1 = rs[0];
    const words = r1.words.map((w, i) => {
      const cnt = new Map(), first = new Map();
      rs.forEach(r => new Set(r.words[i].issues.map(ikey)).forEach(k => cnt.set(k, (cnt.get(k) || 0) + 1)));
      rs.forEach(r => r.words[i].issues.forEach(x => { if (!first.has(ikey(x))) first.set(ikey(x), x); }));
      const sure = [...cnt].filter(([, v]) => v >= need).map(([k]) => first.get(k)), doubt = [...cnt].filter(([, v]) => v > 0 && v < need).length;
      const o = { i: w.i, text: w.text, total: w.total, issues: sure, unsure: n === 2 && doubt > 0 }; o.status = statusOf(o); return o;
    });
    const withEx = rs.filter(r => r.extra.length).length, extra = withEx >= need ? rs.find(r => r.extra.length).extra : [];
    let pen = 0; words.forEach(w => w.issues.forEach(x => pen += penOf(x))); extra.forEach(x => pen += Math.min(2, x.letters.length * 0.4));
    const score = Math.max(0, Math.min(100, Math.round(100 * (1 - pen / r1.N))));
    const unsure = words.some(w => w.unsure) || (n === 2 && !opt.ignoreExtras && withEx === 1);
    return { words, score, extra, N: r1.N, pen, unsure, pass: words.every(w => w.status === "ok") && (!extra.length || !!opt.ignoreExtras) && !unsure, passes: n };
  }

  /* main: expectedWords (array of strings), heardWords (array of strings) → verdict */
  function compare(expectedWords, heardWords, opt) {
    opt = opt || {};
    const E = flat(expectedWords), H = flat(heardWords), ops = align(E, H);
    const words = expectedWords.map((t, i) => ({ i, text: t, status: "ok", issues: [], n: 0 }));
    let pen = 0, extra = [];
    const lastW = expectedWords.length - 1;
    /* heard letters with no expected partner: group runs; a lone letter inside a word is a real slip, longer runs are extra words */
    const runs = []; { let cur = null;
      ops.forEach((o, idx) => { if (o.t === "i") { if (!cur) { cur = { from: idx, ls: "" }; runs.push(cur); } cur.ls += o.h.c; cur.to = idx; } else cur = null; }); }
    runs.forEach(r => {
      let pw = null, nw = null;
      for (let k = r.from - 1; k >= 0; k--) if (ops[k].e) { pw = ops[k]; break; }
      for (let k = r.to + 1; k < ops.length; k++) if (ops[k].e) { nw = ops[k]; break; }
      const inside = pw && nw && pw.e.w === nw.e.w && r.ls.length === 1;
      if (inside) { words[pw.e.w].issues.push({ type: "extra", h: r.ls, k: pw.e.k }); pen += 0.5; }
      else { extra.push({ pos: !pw ? "start" : !nw ? "end" : "mid", letters: r.ls, word: pw ? pw.e.w : -1 }); pen += Math.min(2, r.ls.length * 0.4); }
    });
    ops.forEach((o, idx) => {
      if (o.t === "i") return;
      const wd = words[o.e.w]; if (!o.e.opt || o.t !== "d") wd.n++;
      if (o.t === "m") {
        const v = vowelIssue(o.e, o.h, o.e.w === lastW);
        if (v) { wd.issues.push({ type: v, c: o.e.c, e: o.e, h: o.h, k: o.e.k }); pen += 0.5; }
      } else if (o.t === "s") { wd.issues.push({ type: "sub", c: o.e.c, hc: o.h.c, k: o.e.k }); pen += confusable(o.e.c, o.h.c) ? 0.8 : 1; }
      else if (o.t === "d" && !o.e.opt) { wd.issues.push({ type: MADD[o.e.c] ? "madd-miss" : "del", c: o.e.c, k: o.e.k }); pen += MADD[o.e.c] ? 0.7 : 1; }
    });
    words.forEach(w => { w.total = flat([w.text]).filter(x => !x.opt).length || 1; w.status = statusOf(w); });
    const N = E.filter(x => !x.opt).length || 1;
    const score = Math.max(0, Math.min(100, Math.round(100 * (1 - pen / N))));
    const bad = words.filter(w => w.status !== "ok");
    return { words, score, pass: bad.length === 0 && (!extra.length || !!opt.ignoreExtras), extra, ops, N, pen };
  }

  /* make a rough "same words?" test used to decide whether two AI transcripts agree */
  const sameHeard = (a, b) => a.map(skeleton).join(" ") === b.map(skeleton).join(" ");

  root.CoachCore = { parse, skeleton, flat, align, compare, merge, statusOf, splitWords, sameHeard, confusable, MADD };
  if (typeof module !== "undefined") module.exports = root.CoachCore;
})(typeof window !== "undefined" ? window : globalThis);

/* Fahm data layer: whole Quran, loaded per surah (q/s/NNN.json = words, q/t/<lang>/NNN.json = translations, q/i/NNN.json = surah introduction). */
(function () {
'use strict';
const p3 = n => String(n).padStart(3, '0');
const getJ = u => fetch(u).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); });
const F = window.FahmData = {
  D: { langs: [], surahs: [] }, juz: [], _w: {}, _t: {}, _i: {},
  async init() {
    const [meta, langs] = await Promise.all([getJ('q/meta.json'), getJ('q/langs.json')]);
    const SN = window.FAHM_SN || { r: [], u: [], c: [] };
    this.D.langs = langs; this.juz = meta.juz;
    this.D.surahs = meta.surahs.map(m => ({
      n: m.n, ar: m.ar, en: SN.r[m.n - 1] || m.en, ur: SN.u[m.n - 1] || m.ar, mean: m.mean.en, meanUr: m.mean.ur,
      place: m.place, order: m.order, count: m.count, bism: m.bism, pages: m.pages, ayat: [], loaded: false
    }));
    return this.D;
  },
  /* load words (+ translations for the given language codes) of surah index si */
  async load(si, codes) {
    const S = this.D.surahs[si], n = S.n;
    if (!S.loaded) {
      const d = this._w[n] || (this._w[n] = getJ('q/s/' + p3(n) + '.json'));
      let j; try { j = await d; } catch (e) { delete this._w[n]; throw e; }
      if (!S.loaded) {
        S.ayat = j.a.map(a => ({
          v: a.v, ip: a.ip, j: a.j, p: a.p, sj: a.sj, tr: {},
          ar: a.w.map(x => x[0]).join(' '),
          words: a.w.map(x => ({ ar: x[0], tl: x[1], en: x[2], ur: x[3], ru: x[4], hi: x[5], root: x[6], au: x[7], pos: x[8], form: x[9] }))
        }));
        S.loaded = true; this._roots(si);
      }
    }
    await this.tr(si, codes);
    return S;
  },
  async tr(si, codes) {
    const S = this.D.surahs[si], n = S.n; if (!S.loaded) return;
    const need = [...new Set(codes || [])].filter(c => c !== 'ar' && !(S.ayat[0] && S.ayat[0].tr[c] !== undefined));
    await Promise.all(need.map(async c => {
      const k = c + n; let arr;
      try { arr = await (this._t[k] || (this._t[k] = getJ('q/t/' + c + '/' + p3(n) + '.json'))); } catch (e) { delete this._t[k]; arr = null; }
      if (arr) S.ayat.forEach((A, i) => { A.tr[c] = arr[i] || ''; });
    }));
  },
  /* surah introduction (Tafheem-ul-Quran) in en / ur */
  intro(n) { return this._i[n] || (this._i[n] = getJ('q/i/' + p3(n) + '.json').catch(() => null)); },
  roots: {},
  _roots(si) {
    const S = this.D.surahs[si];
    S.ayat.forEach((A, ai) => A.words.forEach((w, wi) => { if (w.root) (this.roots[w.root] = this.roots[w.root] || []).push({ s: si, a: ai, w: wi }); }));
  },
  juzOf(n, v) { let j = 1; for (const [jj, s, a] of this.juz) { if (s < n || (s === n && a <= v)) j = jj; else break; } return j; }
};
})();

/* Build 27: tajweed guide per word — detects the main rules from the diacritised text (noon/meem sakinah, tanween, ghunnah, qalqalah, madd, lam).
   A learning aid, not a ruling: please confirm with a qualified teacher (ustaad). */
(function () {
  'use strict';
  const isMark = c => { const n = c.charCodeAt(0); return (n >= 0x64B && n <= 0x65F) || n === 0x670 || (n >= 0x6D6 && n <= 0x6ED) || n === 0x640; };
  const nl = c => ({ 'ٱ': 'ا', 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ى': 'ي', 'ی': 'ي', 'ک': 'ك', 'ة': 'ه', 'ؤ': 'ء', 'ئ': 'ء' }[c] || c);
  function parse(w) {
    const L = []; for (const ch of String(w || '')) { if (isMark(ch)) { if (L.length) L[L.length - 1].m += ch; } else L.push({ c: ch, b: nl(ch), m: '' }); } return L;
  }
  const has = (l, ...cs) => cs.some(c => l.m.includes(c));
  const SUK = 'ْ', SHD = 'ّ', FAT = 'َ', DAM = 'ُ', KAS = 'ِ', MAD = 'ٓ', TAN = /[ًٌٍ]/;
  const THROAT = 'ءهعحغخ', IDG_G = 'ينمو', IDG_N = 'لر', IKHFA = 'صذثكجشقسدطزفتضظ', QAL = 'قطبجد';
  const firstOf = w => { const L = parse(w); let i = 0; if (L[0] && L[0].b === 'ا' && L[1] && L[1].b === 'ل' && L.length > 3) i = 2; return L; };
  const hasSk = l => l.m.includes('\u0652') || l.m.includes('\u06E1');
  const hasVowel = l => has(l, FAT, DAM, KAS, 'ٰ') || TAN.test(l.m);
  const T = {
    ur: { h: 'تجوید رہنما', note: 'یہ سیکھنے کی رہنمائی ہے؛ فیصلہ نہیں۔ کسی ماہر استاد سے ضرور تصدیق کریں۔', r: {
      izhar: ['اظہار', 'صاف، بغیر غنہ کے پڑھیں۔'], idgM: ['ادغام بغنہ', 'اگلے حرف میں ملا کر غنہ کے ساتھ پڑھیں۔'], idgN: ['ادغام بلا غنہ', 'اگلے حرف میں ملا کر بغیر غنہ کے پڑھیں۔'], iqlab: ['اقلاب', 'ن/تنوین کو میم سے بدل کر غنہ کے ساتھ چھپا کر پڑھیں۔'], ikhfa: ['اخفاء', 'ن/تنوین کو ناک کی ہلکی آواز کے ساتھ چھپا کر پڑھیں۔'],
      shM: ['اخفائے شفوی', 'میم ساکن کو ب سے پہلے ہونٹوں کے قریب چھپا کر غنہ سے پڑھیں۔'], shI: ['ادغامِ شفوی', 'میم ساکن اگلے میم میں مل جاتا ہے، غنہ کے ساتھ۔'], shZ: ['اظہارِ شفوی', 'میم ساکن کو صاف ہونٹوں سے پڑھیں۔'],
      ghn: ['غنہ', 'ن یا م مشدد پر ناک میں تقریباً دو حرکت کا غنہ۔'], qal: ['قلقلہ', 'ق ط ب ج د ساکن ہوں تو آواز ہلکی سی اچھال کر نکلتی ہے۔'], qalW: ['قلقلہ (وقف پر)', 'وقف کرتے وقت آخری حرف پر قلقلہ ہوگا۔'],
      mdM: ['مدِ متصل', 'مد کے بعد اسی لفظ میں ہمزہ: واجب، 4 یا 5 حرکت۔'], mdF: ['مدِ منفصل', 'مد کے بعد اگلے لفظ کے شروع میں ہمزہ: جائز، 2 سے 5 حرکت۔'], mdL: ['مدِ لازم', 'مد کے بعد مستقل سکون یا تشدید: 6 حرکت۔'], mdS: ['مد', 'مد کی علامت: حرفِ مد کو کھینچ کر پڑھیں۔'],
      lSh: ['لامِ شمسی', 'ال کا ل پڑھا نہیں جاتا، اگلے حرف پر تشدید۔'], lQa: ['لامِ قمری', 'ال کا ل صاف پڑھا جاتا ہے۔'] } },
    ru: { h: 'Tajweed rehnuma', note: 'Yeh seekhne ki rehnumai hai; faisla nahi. Kisi maahir ustaad se zaroor tasdeeq karein.', r: {
      izhar: ['Izhaar', 'Saaf, bagair ghunna ke padhein.'], idgM: ['Idghaam ma\'a ghunna', 'Agle harf mein mila kar ghunna ke saath padhein.'], idgN: ['Idghaam bila ghunna', 'Agle harf mein mila kar bagair ghunna ke padhein.'], iqlab: ['Iqlaab', 'Noon/tanween ko meem se badal kar ghunna ke saath chhupa kar padhein.'], ikhfa: ['Ikhfaa', 'Noon/tanween ko naak ki halki awaaz ke saath chhupa kar padhein.'],
      shM: ['Ikhfa-e-shafawi', 'Meem saakin ko ba se pehle honton ke qareeb chhupa kar ghunna se padhein.'], shI: ['Idghaam-e-shafawi', 'Meem saakin agle meem mein mil jata hai, ghunna ke saath.'], shZ: ['Izhaar-e-shafawi', 'Meem saakin ko saaf honton se padhein.'],
      ghn: ['Ghunna', 'Noon ya meem mushaddad par naak mein taqriban do harkat ka ghunna.'], qal: ['Qalqala', 'Qaaf taa baa jeem daal saakin hon to awaaz halka sa uchhal kar nikalti hai.'], qalW: ['Qalqala (waqf par)', 'Waqf karte waqt aakhri harf par qalqala hoga.'],
      mdM: ['Madd muttasil', 'Madd ke baad usi lafz mein hamza: waajib, 4 ya 5 harkat.'], mdF: ['Madd munfasil', 'Madd ke baad agle lafz ke shuru mein hamza: jaaiz, 2 se 5 harkat.'], mdL: ['Madd laazim', 'Madd ke baad mustaqil sukoon ya tashdeed: 6 harkat.'], mdS: ['Madd', 'Madd ki alaamat: harf-e-madd ko kheench kar padhein.'],
      lSh: ['Laam shamsi', 'Al ka laam padha nahi jata, agle harf par tashdeed.'], lQa: ['Laam qamari', 'Al ka laam saaf padha jata hai.'] } },
    en: { h: 'Tajweed guide', note: 'This is a learning aid, not a ruling. Please confirm with a qualified teacher.', r: {
      izhar: ['Izhar', 'Pronounce clearly, without ghunnah.'], idgM: ['Idgham with ghunnah', 'Merge into the next letter with nasal sound.'], idgN: ['Idgham without ghunnah', 'Merge into the next letter without nasal sound.'], iqlab: ['Iqlab', 'Turn noon/tanween into a hidden meem with ghunnah.'], ikhfa: ['Ikhfa', 'Hide the noon/tanween with a light nasal sound.'],
      shM: ['Shafawi ikhfa', 'Meem sakinah before ba is hidden near the lips with ghunnah.'], shI: ['Shafawi idgham', 'Meem sakinah merges into the next meem with ghunnah.'], shZ: ['Shafawi izhar', 'Meem sakinah pronounced clearly at the lips.'],
      ghn: ['Ghunnah', 'A nasal sound of about two counts on a shaddah noon or meem.'], qal: ['Qalqalah', 'Q T B J D with sukun release with a light echo.'], qalW: ['Qalqalah (when stopping)', 'The last letter gets qalqalah when you stop.'],
      mdM: ['Madd muttasil', 'Madd followed by a hamza in the same word: obligatory, 4–5 counts.'], mdF: ['Madd munfasil', 'Madd followed by a hamza at the start of the next word: permitted, 2–5 counts.'], mdL: ['Madd lazim', 'Madd followed by a fixed sukun or shaddah: 6 counts.'], mdS: ['Madd', 'Prolongation sign: stretch the madd letter.'],
      lSh: ['Solar lam', 'The lam of "al" is not pronounced; the next letter is doubled.'], lQa: ['Lunar lam', 'The lam of "al" is pronounced clearly.'] } }
  };
  const COL = { izhar: '#7fe3f0', idgM: '#7fd36b', idgN: '#9be37f', iqlab: '#ff9bd0', ikhfa: '#ffb86b', shM: '#ffb86b', shI: '#7fd36b', shZ: '#7fe3f0', ghn: '#7fd36b', qal: '#ff7b7b', qalW: '#ff7b7b', mdM: '#c9a0ff', mdF: '#b78cf5', mdL: '#a070f0', mdS: '#c9a0ff', lSh: '#f1d27a', lQa: '#9fb4ff' };
  function rules(words, i) {
    const out = [], L = parse(words[i].ar), nx = words[i + 1] ? parse(words[i + 1].ar) : null, last = !nx, firstNext = nx && nx[0] ? (nx[0].b === 'ا' && nx[1] && nx[1].b === 'ل' ? 'ا' : nx[0].b) : '';
    const nextB = nx && nx[0] ? (nx[0].b === 'ء' || nx[0].b === 'ا' ? 'ء' : nx[0].b) : '';
    const noonRule = (b, same) => b ? (THROAT.includes(b) ? 'izhar' : same && IDG_G.includes(b) ? 'izhar' : IDG_G.includes(b) ? 'idgM' : IDG_N.includes(b) ? 'idgN' : b === 'ب' ? 'iqlab' : IKHFA.includes(b) ? 'ikhfa' : null) : null;
    if (L.length > 3 && L[0].b === 'ا' && L[1].b === 'ل') { out.push(has(L[1], SHD) || has(L[2], SHD) ? 'lSh' : 'lQa'); }
    L.forEach((l, k) => {
      const nb = L[k + 1] ? L[k + 1].b : null, nm = L[k + 1] ? L[k + 1].m : '';
      if ((l.b === 'ن' || l.b === 'م') && has(l, SHD)) out.push('ghn');
      if (QAL.includes(l.b) && hasSk(l)) out.push('qal');
      if (l.b === 'ن' && k > 0 && !has(l, SHD) && (hasSk(l) || !hasVowel(l))) { if (nb) { const r = noonRule(nb, true); if (r) out.push(r); } else if (nextB) { const r = noonRule(nextB, false); if (r) out.push(r); } }
      if ((TAN.test(l.m) || (l.b !== 'ن' && /[\u06E2\u06ED]/.test(l.m))) && k >= L.length - 2 && nextB) { const r = noonRule(nextB, false); if (r) out.push(r); }
      if (l.b === 'م' && !has(l, SHD) && hasSk(l) && !hasVowel(l)) { const t = nb || nextB; if (t) out.push(t === 'ب' ? 'shM' : t === 'م' ? 'shI' : 'shZ'); }
      if (l.m.includes(MAD)) { const t = L[k + 1]; const nmk = t ? t.b : null; if (t && (t.b === 'ء') ) out.push('mdM'); else if (!t && (nextB === 'ء')) out.push('mdF'); else if (t && (has(t, SHD) || (hasSk(t)))) out.push('mdL'); else if (k + 1 >= L.length - 1 && nextB === 'ء') out.push('mdF'); else out.push('mdS'); }
    });
    if (last && L.length) { const e = L[L.length - 1]; if (QAL.includes(e.b) && !hasSk(e)) out.push('qalW'); }
    return Array.from(new Set(out));
  }
  window.FahmTajweed = {
    rules,
    html(words, i, ui, esc) {
      let r; try { r = rules(words, i); } catch (e) { r = []; } if (!r.length) return ''; const D = T[ui] || T.en, rtl = ui === 'ur';
      return `<div class="sh-tj" data-noxl="1"><div class="sh-tjh"><i class="tj-dot"></i><b>${esc(D.h)}</b></div>${r.map(k => `<div class="tj-r" style="--tc:${COL[k] || '#fff'}"><span class="tj-n ${rtl ? 'u' : ''}" ${rtl ? 'dir="rtl"' : ''}>${esc(D.r[k][0])}</span><span class="tj-d ${rtl ? 'u urf' : ''}" ${rtl ? 'dir="rtl"' : ''}>${esc(D.r[k][1])}</span></div>`).join('')}<div class="sh-tjn">${esc(D.note)}</div></div>`;
    }
  };
})();

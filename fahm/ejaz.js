/* Build 31: "Lafz ka ejaz" — a marvel card for EVERY word inside "Lafz ki tafseel".
   Everything here is computed from the Quran text itself (root family, how rare the word is, where it first comes, Makki/Madani spread)
   or is a well-known point of Arabic grammar/balagha about the word's form. A few famous "word balance" counts are shown only as
   claims with their source and a clear note that scholars count differently. Scientific pointers stay in miracles.js (hedged). */
(function () {
  'use strict';
  let F = null; fetch('q/rfam.json').then(r => r.json()).then(j => { F = j; }).catch(() => { });
  const MK = /[ً-ٰٟۖ-ۭـ࣓-ࣿ]/g;
  const strip = s => String(s || '').replace(MK, '').replace(/[آأإٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  const T = {
    ur: { h: 'لفظ کا اعجاز', fam: (r, n, f, s) => `مادّہ «${r}» سے قرآن میں ${n} الفاظ آئے ہیں — ${f} الگ شکلوں میں، ${s} سورتوں میں پھیلے ہوئے۔ ایک ہی جڑ سے اتنے معنی نکلنا عربی اور قرآن کا کمال ہے۔`,
      first: (sn, a) => `یہ مادّہ قرآن میں پہلی بار سورۃ ${sn}، آیت ${a} میں آیا۔`, mk: p => `اس کے ${p}٪ استعمال مکی سورتوں میں ہیں، باقی مدنی میں۔`,
      once: 'یہ لفظ بالکل اسی شکل میں پورے قرآن میں صرف ایک بار آیا ہے — یہی جگہ۔', many: n => `یہ لفظ بالکل اسی شکل میں قرآن میں ${n} بار آیا ہے۔`, rare: 'اس مادّے کا یہ واحد استعمال ہے — پورے قرآن میں یہ جڑ صرف یہاں آئی۔',
      bal: 'مشہور گنتی (ڈاکٹر عبدالرزاق نوفل، «الاعجاز العددی»)', balN: 'گننے کے طریقے میں علما کا اختلاف ہے؛ اسے قطعی دعویٰ نہ سمجھیں۔', note: 'یہ باتیں قرآن کے متن سے گن کر اور عربی گرامر سے لی گئی ہیں۔' },
    ru: { h: 'Lafz ka ejaz', fam: (r, n, f, s) => `Root «${r}» se Quran mein ${n} alfaaz aaye hain — ${f} alag shaklon mein, ${s} surahon mein phaile hue. Ek hi jad se itne maani nikalna Arabi aur Quran ka kamaal hai.`,
      first: (sn, a) => `Yeh root Quran mein pehli baar Surah ${sn}, ayat ${a} mein aaya.`, mk: p => `Is ke ${p}% istemaal Makki surahon mein hain, baaqi Madani mein.`,
      once: 'Yeh lafz bilkul isi shakal mein poore Quran mein sirf ek baar aaya hai — yahi jagah.', many: n => `Yeh lafz bilkul isi shakal mein Quran mein ${n} baar aaya hai.`, rare: 'Is root ka yeh akela istemaal hai — poore Quran mein yeh jad sirf yahan aayi.',
      bal: 'Mashhoor ginti (Dr. Abdur Razzaq Naufal, "Al-I\'jaz al-Adadi")', balN: 'Ginne ke tareeqe mein ulama ka ikhtilaf hai; ise qatai da\'wa na samjhein.', note: 'Yeh baatein Quran ke matn se gin kar aur Arabi grammar se li gayi hain.' },
    en: { h: 'Marvel of this word', fam: (r, n, f, s) => `The root «${r}» gives ${n} words in the Quran, in ${f} different forms, spread over ${s} surahs. So many meanings from one root is part of the beauty of Arabic and the Quran.`,
      first: (sn, a) => `This root first appears in Surah ${sn}, ayah ${a}.`, mk: p => `${p}% of its uses are in Makki surahs, the rest in Madani ones.`,
      once: 'This exact word appears only once in the whole Quran — right here.', many: n => `This exact word appears ${n} times in the Quran.`, rare: 'This is the only use of this root in the whole Quran.',
      bal: 'Well-known count (Dr Abdur Razzaq Naufal, "Al-I\'jaz al-Adadi")', balN: 'Scholars count in different ways; do not treat this as a settled claim.', note: 'These points are counted from the Quran text itself and taken from Arabic grammar.' }
  };
  /* the form of the word and what Arabic rhetoric says it adds */
  const FORM = {
    ur: { PERF: 'ماضی کا صیغہ: کام ہو چکا۔ قرآن کئی جگہ آنے والی بات بھی ماضی میں کہتا ہے، تاکہ بتائے کہ وہ اتنی یقینی ہے گویا ہو چکی۔', IMPF: 'مضارع کا صیغہ: کام جاری ہے یا بار بار ہوتا ہے — ایک زندہ، چلتی ہوئی تصویر۔', IMPV: 'امر کا صیغہ: سیدھا حکم، جو سننے والے کو براہِ راست مخاطب کرتا ہے۔', PASS: 'مجہول: کرنے والے کا نام نہیں لیا گیا، تاکہ توجہ کام پر رہے — یا کرنے والا اتنا معلوم ہے کہ نام کی ضرورت نہیں۔', ACT: 'اسمِ فاعل: کام کرنے والا — یہ صفت ٹھہری ہوئی اور مستقل دکھاتی ہے۔', PPC: 'اسمِ مفعول: جس پر کام ہوا۔', VN: 'مصدر: کام کا نام، وقت سے آزاد — بات کو عام اور ہمیشہ کے لیے بنا دیتا ہے۔',
      II: 'باب تفعیل: کام میں زور اور بار بار کرنا۔', III: 'باب مفاعلہ: دوسرے کے ساتھ یا مقابلے میں کرنا۔', IV: 'باب افعال: کسی اور سے کروانا یا پہنچانا۔', V: 'باب تفعّل: آہستہ آہستہ خود پر اثر لینا۔', VI: 'باب تفاعل: آپس میں ایک دوسرے کے ساتھ۔', VII: 'باب انفعال: خود بخود ہو جانا۔', VIII: 'باب افتعال: کوشش اور اہتمام سے کرنا۔', X: 'باب استفعال: طلب کرنا، مانگنا۔' },
    ru: { PERF: 'Maazi ka seegha: kaam ho chuka. Quran kai jagah aane wali baat bhi maazi mein kehta hai, taake bataye ke woh itni yaqeeni hai goya ho chuki.', IMPF: 'Muzaare ka seegha: kaam jaari hai ya baar baar hota hai — ek zinda, chalti hui tasveer.', IMPV: 'Amr ka seegha: seedha hukm, jo sunne wale ko bila-wasta mukhatab karta hai.', PASS: 'Majhool: karne wale ka naam nahin liya gaya, taake tawajjuh kaam par rahe — ya karne wala itna maloom hai ke naam ki zaroorat nahin.', ACT: 'Ism-e-faail: kaam karne wala — yeh sifat thehri hui aur mustaqil dikhati hai.', PPC: 'Ism-e-maf\'ool: jis par kaam hua.', VN: 'Masdar: kaam ka naam, waqt se azaad — baat ko aam aur hamesha ke liye bana deta hai.',
      II: 'Baab taf\'eel: kaam mein zor aur baar baar karna.', III: 'Baab mufa\'ala: doosre ke saath ya muqable mein karna.', IV: 'Baab if\'aal: kisi aur se karwana ya pahunchana.', V: 'Baab tafa\'\'ul: aahista aahista khud par asar lena.', VI: 'Baab tafa\'ul: aapas mein ek doosre ke saath.', VII: 'Baab infi\'aal: khud ba khud ho jana.', VIII: 'Baab ifti\'aal: koshish aur ehtimam se karna.', X: 'Baab istif\'aal: talab karna, maangna.' },
    en: { PERF: 'Past form: the act is done. In many places the Quran tells of things still to come in the past tense, to show they are as certain as if already done.', IMPF: 'Present form: the act goes on or repeats — a living, moving picture.', IMPV: 'Command form: a direct order that speaks straight to the listener.', PASS: 'Passive: the doer is not named so the focus stays on the act — or the doer is so well known no name is needed.', ACT: 'Active participle: the doer — it shows the quality as settled and lasting.', PPC: 'Passive participle: the one the act was done to.', VN: 'Verbal noun: the act itself, free of time — it makes the statement general and timeless.',
      II: 'Form II: intensity and repetition.', III: 'Form III: doing it with or against someone.', IV: 'Form IV: making someone else do it, or bringing it about.', V: 'Form V: taking the effect on oneself step by step.', VI: 'Form VI: doing it with one another.', VII: 'Form VII: it happens by itself.', VIII: 'Form VIII: doing it with effort and care.', X: 'Form X: seeking or asking for it.' }
  };
  /* famous balance counts — shown only as hedged claims */
  const BAL = [
    [/^(ال)?دنيا$/, { ur: 'دنیا ۱۱۵ بار، آخرت ۱۱۵ بار', ru: 'Dunya 115 baar, Aakhirat 115 baar', en: 'Dunya 115 times, Akhirah 115 times' }],
    [/^(ال)?اخره$|^(لل|بال|و?ال)اخره$/, { ur: 'آخرت ۱۱۵ بار، دنیا ۱۱۵ بار', ru: 'Aakhirat 115 baar, Dunya 115 baar', en: 'Akhirah 115 times, Dunya 115 times' }],
    [/ملايكه|ملئكه|ملٰٓئكه/, { ur: 'فرشتے ۸۸ بار، شیاطین ۸۸ بار', ru: 'Farishte 88 baar, Shayateen 88 baar', en: 'Angels 88 times, devils 88 times' }],
    [/شياطين|شيطين/, { ur: 'شیاطین ۸۸ بار، فرشتے ۸۸ بار', ru: 'Shayateen 88 baar, Farishte 88 baar', en: 'Devils 88 times, angels 88 times' }],
    [/^(ال|و|ف|ب)*يوم$/, { ur: 'لفظ «یوم» (دن) واحد کی شکل میں ۳۶۵ بار — سال کے دن', ru: 'Lafz "yawm" (din) wahid ki shakal mein 365 baar — saal ke din', en: 'The word "yawm" (day), singular, 365 times — the days of a year' }],
    [/^(ال|و|ف|ب)*شهر$/, { ur: 'لفظ «شہر» (مہینہ) ۱۲ بار — سال کے مہینے', ru: 'Lafz "shahr" (mahina) 12 baar — saal ke mahine', en: 'The word "shahr" (month) 12 times — the months of a year' }]
  ];
  const nu = (n, ui) => ui === 'ur' ? String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(n);
  const sName = (n, ui) => { try { const S0 = FahmData.D.surahs[n - 1]; return ui === 'ur' ? S0.ur : S0.en; } catch (e) { return n; } };
  function html(sn, an, W, ui, esc) {
    const L = T[ui] || T.ru, FM = FORM[ui] || FORM.ru, out = [], r = String(W.root || '').replace(/[^ء-ي]/g, '');
    const fam = F && r ? F[r] : null;
    if (fam) { const [n, f, s, first, mk] = fam, rr = [...r].join('-');
      if (n <= 1) out.push(['★', L.rare]); else out.push(['❖', L.fam(rr, nu(n, ui), nu(f, ui), nu(s, ui))]);
      if (n > 1) { const fs = Math.floor(first / 1000), fa = first % 1000; out.push(['➊', L.first(sName(fs, ui), nu(fa, ui))]); out.push(['◐', L.mk(nu(Math.round(mk / n * 100), ui))]); } }
    const c = window.FahmCnt && FahmCnt.get ? FahmCnt.get(W.ar, W.root) : null;
    if (c && c.exact) out.push(['◉', c.exact === 1 ? L.once : L.many(nu(c.exact, ui))]);
    const f = String(W.form || ''); const add = k => { if (FM[k]) out.push(['✦', FM[k]]); };
    if (/PASS\|PCPL/.test(f)) add('PPC'); else if (/ACT\|PCPL/.test(f)) add('ACT'); else if (/\bVN\b/.test(f)) add('VN');
    if (/IMPV/.test(f)) add('IMPV'); else if (/PERF/.test(f)) add('PERF'); else if (/IMPF/.test(f)) add('IMPF');
    if (/PASS/.test(f) && !/PCPL/.test(f)) add('PASS');
    const fm = (f.match(/\((I{1,3}|IV|V|VI{1,3}|IX|X)\)/) || [])[1]; if (fm && FM[fm]) out.push(['✦', ({ ur: 'عموماً — ', ru: 'Aam taur par — ', en: 'Usually — ' }[ui] || '') + FM[fm]]);
    const sw = strip(W.ar); let bal = ''; for (const [re, t] of BAL) if (re.test(sw)) { bal = `<div class="ej-bal"><b>${esc(L.bal)}</b><span>${esc(t[ui] || t.ru)}</span><small>${esc(L.balN)}</small></div>`; break; }
    if (!out.length && !bal) return '';
    const rtl = ui === 'ur';
    return `<div class="sh-ej" ${rtl ? 'dir="rtl"' : ''}><div class="ej-h"><i class="ej-g"></i><b>${esc(L.h)}</b></div><ul class="ej-l ${rtl ? 'u urf' : ''}">${out.map(([i, t]) => `<li><em>${i}</em><span>${esc(t)}</span></li>`).join('')}</ul>${bal}<small class="ej-n">${esc(L.note)}</small></div>`;
  }
  window.FahmEjaz = { html, ready: () => !!F };
})();

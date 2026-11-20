/* Interface text in three languages. A language never leaks into another:
   ur = Urdu (script), ru = Roman Urdu, en = English. */
window.I18N = {
  ui: [['ur', 'اردو'], ['ru', 'Roman Urdu'], ['en', 'English']],
  STR: {
    ur: {
      prevL: 'پچھلی', nextL: 'اگلی', pick: 'آیت منتخب کریں', reader: 'مطالعہ', theme: 'تھیم', dark: 'ڈارک', light: 'لائٹ', autoOpt: 'خودکار اگلی آیت', size: 'حروف کا سائز', read: 'پڑھیں', exit: 'باہر نکلنے کے لیے دوبارہ بیک دبائیں', maslak: 'اپنے مسلک کے مطابق اردو ترجمہ', mk: {d:'دیوبندی',b:'بریلوی',a:'اہلِ حدیث',j:'جماعتِ اسلامی',s:'اہلِ تشیع'}, sfx: 'ہلکی آوازیں (ساؤنڈ ایفیکٹس)', sfxOff: 'بند', sfxLow: 'ہلکی', sfxMid: 'درمیانی', recCus: 'اپنا قاری: ایوری آیہ فولڈر کا نام لکھیں', trVoice: 'ہر آیت کے بعد ترجمہ آواز میں سنائیں',
      surahs: 'سورتیں', settings: 'ترتیبات', ayah: 'آیت', auto: 'خودکار اگلی آیت', root: 'مادہ (جڑ)', same: 'اسی مادے کے مزید الفاظ', listen: 'لفظ کی آواز',
      nzh: 'پس منظر (شانِ نزول)', nzn: 'یہ نوٹ مشہور روایات کا مختصر خلاصہ ہے۔ شائع کرنے سے پہلے کسی عالم سے تصدیق ضرور کروائیں۔',
      ui: 'ایپ کی زبان', tr: 'ترجمے (جتنے چاہیں منتخب کریں)', rec: 'قاری', audioErr: 'آواز کے لیے انٹرنیٹ درکار ہے۔ فی الحال صرف اینیمیشن چل رہی ہے۔',
      iosTip: 'آئی فون پر انسٹال کرنے کے لیے: شیئر ← “ہوم اسکرین میں شامل کریں”', install: 'انسٹال', close: 'ٹھیک ہے', installBar: 'فہم کو فون پر انسٹال کریں',
      credits: 'قرآن کا متن: تنزیل (عثمانی، حفص)۔ لفظ بہ لفظ: قرآن ڈاٹ کام، گرامر: Quranic Arabic Corpus۔ پس منظر: تفہیم القرآن (سید ابوالاعلیٰ مودودی)، تفسیر: ابنِ کثیر (قرآن ڈاٹ کام)۔ ترجمے: فواز احمد کی قرآن اے پی آئی (ہر ترجمے کے ساتھ مترجم کا نام)۔ آواز: ایوری آیت اور قرآن ڈاٹ کام۔ اینیمیشن اسی ایپ میں کوڈ سے بنی ہے (کسی چہرے کی تصویر نہیں)۔ الفاظ کے معنی اور پس منظر کی تصدیق کسی عالم سے کروائیں۔',
      replay: 'دوبارہ', word: 'لفظ', of: 'از', story: 'تفسیری کہانی', full: 'بڑی اسکرین', noVoice: 'اس ڈیوائس پر آواز دستیاب نہیں', drag: 'گھمانے کے لیے انگلی پھیریں', ayahWord: 'آیت'
    },
    ru: {
      prevL: 'Pichli', nextL: 'Agli', pick: 'Ayat chunein', reader: 'Mutaala', theme: 'Theme', dark: 'Dark', light: 'Light', autoOpt: 'Auto agli ayat', size: 'Harf ka size', read: 'Padhein', exit: 'Bahar nikalne ke liye dobara back dabayein', maslak: 'Apne maslak ke mutabiq Urdu tarjuma', mk: {d:'Deobandi',b:'Barelvi',a:'Ahl-e-Hadith',j:'Jamaat-e-Islami',s:'Shia'}, sfx: 'Halki awaazein (sound effects)', sfxOff: 'Band', sfxLow: 'Halki', sfxMid: 'Darmiyani', recCus: 'Apna qari: EveryAyah folder ka naam likhein', trVoice: 'Har ayat ke baad tarjuma awaaz mein sunayein',
      surahs: 'Surahs', settings: 'Settings', ayah: 'Ayat', auto: 'Auto agli ayat', root: 'Root (jad)', same: 'Isi root ke aur lafz', listen: 'Lafz ki awaaz',
      nzh: 'Pas-e-manzar (Shaan-e-nuzool)', nzn: 'Yeh note mashhoor riwayat ka mukhtasar hai. Publish karne se pehle kisi aalim se tasdeeq zaroori hai.',
      ui: 'App ki zubaan', tr: 'Tarjume (jitne chahein chun lein)', rec: 'Qari', audioErr: 'Awaaz ke liye internet chahiye. Abhi sirf animation chal rahi hai.',
      iosTip: 'iPhone par install: Share → “Add to Home Screen”', install: 'Install', close: 'Theek hai', installBar: 'Fahm ko phone par install karein',
      credits: 'Quran ka matan: Tanzil (Uthmani, Hafs). Lafz-ba-lafz: Quran.com, grammar: Quranic Arabic Corpus. Pas-e-manzar: Tafheem-ul-Quran (Syed Abul Ala Maududi), tafseer: Ibn Kathir (Quran.com). Tarjume: fawazahmed0/quran-api (har tarjume ke saath mutarjim ka naam). Awaaz: EveryAyah aur Quran.com. Animation: is app mein code se bani hai (kisi chehre ki tasveer nahi). Lafzi matlab aur pas-e-manzar ki tasdeeq kisi aalim se karwayein.',
      replay: 'Dobara', word: 'Lafz', of: 'mein se', story: 'Tafsiri kahani', full: 'Bari screen', noVoice: 'Is device par awaaz maujood nahi', drag: 'Ghumane ke liye ungli phiren', ayahWord: 'Ayat'
    },
    en: {
      prevL: 'Prev', nextL: 'Next', pick: 'Choose ayah', reader: 'Reading', theme: 'Theme', dark: 'Dark', light: 'Light', autoOpt: 'Auto next ayah', size: 'Text size', read: 'Read', exit: 'Press back again to exit', maslak: 'Urdu translation by school of thought', mk: {d:'Deobandi',b:'Barelvi',a:'Ahl-e-Hadith',j:'Jamaat-e-Islami',s:'Shia'}, sfx: 'Sound effects', sfxOff: 'Off', sfxLow: 'Soft', sfxMid: 'Medium', recCus: 'Your own reciter: type an EveryAyah folder name', trVoice: 'Read the translation aloud after each ayah',
      surahs: 'Surahs', settings: 'Settings', ayah: 'Ayah', auto: 'Auto next ayah', root: 'Root', same: 'More words from this root', listen: 'Hear the word',
      nzh: 'Background (Context of revelation)', nzn: 'A brief note from well-known reports. Please have a scholar verify before publishing.',
      ui: 'App language', tr: 'Translations (choose as many as you like)', rec: 'Reciter', audioErr: 'Audio needs an internet connection. Only the animation is playing.',
      iosTip: 'On iPhone: Share → “Add to Home Screen”', install: 'Install', close: 'OK', installBar: 'Install Fahm on your phone',
      credits: 'Quran text: Tanzil (Uthmani, Hafs). Word-by-word: Quran.com, grammar: Quranic Arabic Corpus. Background: Tafheem-ul-Quran (Syed Abul Ala Maududi), tafseer: Ibn Kathir (Quran.com). Translations: fawazahmed0/quran-api (translator named on each). Audio: EveryAyah and Quran.com. Animations are drawn by code in this app (no faces are depicted). Word meanings and context notes should be verified by a scholar.',
      replay: 'Replay', word: 'Word', of: 'of', story: 'Story of the ayah', full: 'Full screen', noVoice: 'Voice is not supported on this device', drag: 'Drag to rotate', ayahWord: 'Ayah'
    }
  },
  surah: {
    1: { ur: ['الفاتحہ', 'آغاز'], ru: ['Al-Fatihah', 'Aaghaaz'], en: ['Al-Fatihah', 'The Opening'] },
    105: { ur: ['الفیل', 'ہاتھی'], ru: ['Al-Feel', 'Haathi'], en: ['Al-Fil', 'The Elephant'] },
    106: { ur: ['قریش', 'قبیلۂ قریش'], ru: ['Quraish', 'Qabeela-e-Quraish'], en: ['Quraysh', 'The Quraysh'] },
    107: { ur: ['الماعون', 'معمولی مدد'], ru: ['Al-Maaoon', 'Maamooli madad'], en: ['Al-Maʿun', 'Small Kindnesses'] },
    108: { ur: ['الکوثر', 'بے شمار خیر'], ru: ['Al-Kausar', 'Be-shumaar khair'], en: ['Al-Kawthar', 'Abundance'] },
    109: { ur: ['الکافرون', 'انکار کرنے والے'], ru: ['Al-Kaafiroon', 'Inkaar karne wale'], en: ['Al-Kafirun', 'The Disbelievers'] },
    110: { ur: ['النصر', 'مدد'], ru: ['An-Nasr', 'Madad'], en: ['An-Nasr', 'The Help'] },
    111: { ur: ['المسد', 'کھجور کی رسی'], ru: ['Al-Masad', 'Khajoor ki rassi'], en: ['Al-Masad', 'The Palm Fibre'] },
    112: { ur: ['الاخلاص', 'خالص توحید'], ru: ['Al-Ikhlaas', 'Khaalis tauheed'], en: ['Al-Ikhlas', 'Sincerity'] },
    113: { ur: ['الفلق', 'صبح کی روشنی'], ru: ['Al-Falaq', 'Subah ki roshni'], en: ['Al-Falaq', 'The Daybreak'] },
    114: { ur: ['الناس', 'انسان'], ru: ['An-Naas', 'Insaan'], en: ['An-Nas', 'Mankind'] }
  },
  lang: {
    ur: { ar: 'عربی', rur: 'رومن اردو', ur: 'اردو', urj: 'اردو (دوسرا ترجمہ)', urm: 'اردو', urh: 'اردو', urk: 'اردو', urq: 'اردو', urg: 'اردو', urn: 'اردو', urz: 'اردو', en: 'انگریزی', hi: 'ہندی', bn: 'بنگالی', id: 'انڈونیشی', tr: 'ترکی', fa: 'فارسی', fr: 'فرانسیسی', es: 'ہسپانوی', ru: 'روسی', ms: 'ملے', ta: 'تامل', sw: 'سواحلی', de: 'جرمن', so: 'صومالی' },
    ru: { ar: 'Arabi', rur: 'Roman Urdu', ur: 'Urdu', urj: 'Urdu (doosra tarjuma)', urm: 'Urdu', urh: 'Urdu', urk: 'Urdu', urq: 'Urdu', urg: 'Urdu', urn: 'Urdu', urz: 'Urdu', en: 'Angrezi', hi: 'Hindi', bn: 'Bangla', id: 'Indonesian', tr: 'Turki', fa: 'Farsi', fr: 'French', es: 'Spanish', ru: 'Roosi', ms: 'Malay', ta: 'Tamil', sw: 'Swahili', de: 'German', so: 'Somali' },
    en: { ar: 'Arabic', rur: 'Roman Urdu', ur: 'Urdu', urj: 'Urdu (second translation)', urm: 'Urdu', urh: 'Urdu', urk: 'Urdu', urq: 'Urdu', urg: 'Urdu', urn: 'Urdu', urz: 'Urdu', en: 'English', hi: 'Hindi', bn: 'Bengali', id: 'Indonesian', tr: 'Turkish', fa: 'Persian', fr: 'French', es: 'Spanish', ru: 'Russian', ms: 'Malay', ta: 'Tamil', sw: 'Swahili', de: 'German', so: 'Somali' }
  },
  translator: {
    ur: { rur: 'مفتی محمد تقی عثمانی (رومن رسم الخط میں)', ur: 'مفتی محمد تقی عثمانی (دیوبندی)', urj: 'فتح محمد جالندھری', urm: 'مولانا ابوالاعلیٰ مودودی (تفہیم القرآن، جماعتِ اسلامی)', urh: 'شیخ الہند مولانا محمود الحسن (دیوبندی)', urk: 'پیر محمد کرم شاہ الازہری (ضیاء القرآن، بریلوی)', urq: 'ڈاکٹر محمد طاہر القادری (عرفان القرآن)', urg: 'مولانا محمد جوناگڑھی (اہلِ حدیث)', urn: 'محمد حسین نجفی (اہلِ تشیع)', urz: 'سید ذیشان حیدر جوادی (اہلِ تشیع)', en: 'مصطفیٰ خطاب (دی کلیئر قرآن)', hi: 'فاروق خان اور ندوی', bn: 'محی الدین خان', id: 'وزارتِ مذہبی امور (انڈونیشیا)', tr: 'دیانت وقف', fa: 'اسلام ہاؤس', fr: 'محمد حمید اللہ', es: 'اسلامک فاؤنڈیشن', ru: 'المیر قلییف', ms: 'عبداللہ باسمیح', ta: 'عبدالحمید باقوی', sw: 'عبداللہ محمد ابوبکر', de: 'فرینک بوبن ہائم اور ندیم الیاس', so: 'عبداللہ حسن جیکب' },
    ru: { rur: 'Mufti Muhammad Taqi Usmani (Roman rasm-ul-khat mein)', ur: 'Mufti Muhammad Taqi Usmani (Deobandi)', urj: 'Fateh Muhammad Jalandhry', urm: 'Maulana Abul A\'la Maududi (Tafheem-ul-Quran, Jamaat-e-Islami)', urh: 'Shaykh-ul-Hind Maulana Mahmood-ul-Hasan (Deobandi)', urk: 'Pir Muhammad Karam Shah Al-Azhari (Zia-ul-Quran, Barelvi)', urq: 'Dr Muhammad Tahir-ul-Qadri (Irfan-ul-Quran)', urg: 'Maulana Muhammad Junagarhi (Ahl-e-Hadith)', urn: 'Muhammad Hussain Najafi (Ahl-e-Tashayyo / Shia)', urz: 'Syed Zeeshan Haider Jawadi (Ahl-e-Tashayyo / Shia)', en: 'Mustafa Khattab (The Clear Quran)', hi: 'Farooq Khan & Nadwi', bn: 'Muhiuddin Khan', id: 'Wizarat-e-Mazhabi Umoor (Indonesia)', tr: 'Diyanet Vakfi', fa: 'IslamHouse', fr: 'Muhammad Hamidullah', es: 'Islamic Foundation', ru: 'Elmir Kuliev', ms: 'Abdullah Basmeih', ta: 'Abdulhameed Baqavi', sw: 'Abdullah Muhammad Abu Bakr', de: 'Frank Bubenheim & Nadeem Elyas', so: 'Abdullah Hasan Jacob' },
    en: { rur: 'Mufti Muhammad Taqi Usmani (in Roman script)', ur: 'Mufti Muhammad Taqi Usmani (Deobandi)', urj: 'Fateh Muhammad Jalandhry', urm: 'Abul A\'la Maududi (Tafheem-ul-Quran, Jamaat-e-Islami)', urh: 'Shaykh-ul-Hind Mahmood-ul-Hasan (Deobandi)', urk: 'Pir Muhammad Karam Shah Al-Azhari (Zia-ul-Quran, Barelvi)', urq: 'Dr Muhammad Tahir-ul-Qadri (Irfan-ul-Quran)', urg: 'Muhammad Junagarhi (Ahl-e-Hadith)', urn: 'Muhammad Hussain Najafi (Shia)', urz: 'Syed Zeeshan Haider Jawadi (Shia)', en: 'Mustafa Khattab (The Clear Quran)', hi: 'Farooq Khan & Nadwi', bn: 'Muhiuddin Khan', id: 'Ministry of Islamic Affairs (Indonesia)', tr: 'Diyanet Vakfi', fa: 'IslamHouse', fr: 'Muhammad Hamidullah', es: 'Islamic Foundation', ru: 'Elmir Kuliev', ms: 'Abdullah Basmeih', ta: 'Abdulhameed Baqavi', sw: 'Abdullah Muhammad Abu Bakr', de: 'Frank Bubenheim & Nadeem Elyas', so: 'Abdullah Hasan Jacob' }
  },
  reciter: {
    Alafasy_128kbps: { ur: 'مشاری العفاسی', ru: 'Mishary Alafasy', en: 'Mishary Alafasy' },
    Husary_128kbps: { ur: 'محمود خلیل الحصری', ru: 'Mahmoud Khalil Al-Husary', en: 'Mahmoud Khalil Al-Husary' },
    'Abdurrahmaan_As-Sudais_192kbps': { ur: 'عبدالرحمٰن السدیس', ru: 'Abdur-Rahman As-Sudais', en: 'Abdur-Rahman As-Sudais' },
    Minshawy_Murattal_128kbps: { ur: 'محمد صدیق المنشاوی', ru: 'Muhammad Siddiq Al-Minshawi', en: 'Muhammad Siddiq Al-Minshawi' },
    'Abdul_Basit_Murattal_192kbps': { ur: 'عبدالباسط (مرتل)', ru: 'Abdul Basit (Murattal)', en: 'Abdul Basit (Murattal)' }
  }
};

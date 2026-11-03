/* Quranic Science DEMO MODE: a full practice copy of the website that runs only in this browser.
   Nothing here touches the real student database. Open quranicscience.info/?demo=1 to start, ?demo=0 to leave. */
(() => {
  const DBK = "qs-demo-db2", UK = "qs-demo-users2", CK = "qs-demo-cur2";
  const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const S = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const clone = v => v === undefined ? v : JSON.parse(JSON.stringify(v));
  const val = v => (v && v.__ts) ? Date.now() : v;
  const merge = (a, b) => { for (const k in b) { const v = b[k]; if (v && typeof v === "object" && !Array.isArray(v) && !v.__ts) a[k] = merge(a[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? a[k] : {}, v); else a[k] = val(v); } return a; };
  const path = (o, p) => p.split(".").reduce((x, k) => x == null ? x : x[k], o);
  const snap = (col, id) => { const v = (J(DBK, {})[col] || {})[id]; return { id, exists: !!v, data: () => clone(v), get: f => v ? path(v, f) : undefined, ref: ref(col, id) }; };
  function ref(col, id) {
    return { id, path: col + "/" + id,
      get: async () => snap(col, id),
      set: async (v, o) => { const db = J(DBK, {}); db[col] = db[col] || {}; db[col][id] = o && o.merge ? merge(db[col][id] || {}, v) : merge({}, v); S(DBK, db); },
      update: async v => { const db = J(DBK, {}); db[col] = db[col] || {}; const cur = db[col][id] || {}; for (const k in v) { const ps = k.split("."); let o = cur; for (let i = 0; i < ps.length - 1; i++) o = o[ps[i]] = (o[ps[i]] && typeof o[ps[i]] === "object") ? o[ps[i]] : {}; o[ps[ps.length - 1]] = val(v[k]); } db[col][id] = cur; S(DBK, db); },
      delete: async () => { const db = J(DBK, {}); if (db[col]) delete db[col][id]; S(DBK, db); },
      collection: sub => coll(col + "/" + id + "/" + sub),
      onSnapshot: cb => { cb(snap(col, id)); return () => {}; } };
  }
  const nid = () => "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  function coll(col, F = [], O = null, L = 0) {
    const q = {
      id: col, doc: id => ref(col, id || nid()),
      add: async v => { const id = nid(); await ref(col, id).set(v); return ref(col, id); },
      where: (f, op, v) => coll(col, [...F, [f, op, v]], O, L), orderBy: (f, d) => coll(col, F, [f, d], L), limit: n => coll(col, F, O, n),
      get: async () => {
        let docs = Object.keys(J(DBK, {})[col] || {}).map(id => snap(col, id));
        docs = docs.filter(s => F.every(([f, op, v]) => { const x = path(s.data(), f); return op === "==" ? x === v : op === "!=" ? x !== v : op === "in" ? v.includes(x) : op === "array-contains" ? (x || []).includes(v) : op === ">=" ? x >= v : op === "<=" ? x <= v : op === ">" ? x > v : op === "<" ? x < v : true; }));
        if (O) docs.sort((a, b) => { const x = path(a.data(), O[0]), y = path(b.data(), O[0]); return (x > y ? 1 : x < y ? -1 : 0) * (O[1] === "desc" ? -1 : 1); });
        if (L) docs = docs.slice(0, L);
        return { docs, empty: !docs.length, size: docs.length, forEach: f => docs.forEach(f) };
      },
      onSnapshot: cb => { q.get().then(cb); return () => {}; } };
    return q;
  }
  const db = { collection: c => coll(c), doc: p => { const i = p.lastIndexOf("/"); return ref(p.slice(0, i), p.slice(i + 1)); }, batch: () => { const ops = []; return { set: (r, v, o) => ops.push(() => r.set(v, o)), update: (r, v) => ops.push(() => r.update(v)), delete: r => ops.push(() => r.delete()), commit: async () => { for (const f of ops) await f(); } }; }, enablePersistence: async () => {}, settings: () => {} };

  /* ---------- demo data: one owner, one teacher, two students, real-looking classes ---------- */
  const pad = n => String(n).padStart(2, "0"), at = (d, h, m) => { const t = new Date(Date.now() + d * 864e5); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(h)}:${pad(m)}`; };
  const T3 = (en, ur, ar) => ({ en, ur, ar });
  if (!localStorage.getItem(DBK)) {
    const now = Date.now(), CK2 = "tajweed-class";
    const qs1 = [{ q: T3("How many letters come from the throat?", "حلق سے کتنے حروف نکلتے ہیں؟", "كم حرفًا يخرج من الحلق؟"), o: [T3("6", "6", "٦"), T3("4", "4", "٤"), T3("10", "10", "١٠")], c: 0 },
      { q: T3("How many parts does the throat have?", "حلق کے کتنے حصے ہیں؟", "كم جزءًا للحلق؟"), o: [T3("3", "3", "٣"), T3("2", "2", "٢"), T3("5", "5", "٥")], c: 0 },
      { q: T3("From which part of the throat does “ع” come?", "”ع“ حلق کے کس حصے سے نکلتا ہے؟", "من أي جزء من الحلق يخرج حرف ”ع“؟"), o: [T3("Middle (wasat)", "درمیان (وسط)", "وسط الحلق"), T3("Deepest (aqsa)", "سب سے نیچے (اقصیٰ)", "أقصى الحلق"), T3("Top (adna)", "اوپر (ادنیٰ)", "أدنى الحلق")], c: 0 }];
    const qs2 = [{ q: T3("Which letters come from the tongue's tip?", "زبان کی نوک سے کون سے حروف نکلتے ہیں؟", "ما الحروف التي تخرج من طرف اللسان؟"), o: [T3("ت د ط", "ت د ط", "ت د ط"), T3("ق ك", "ق ك", "ق ك"), T3("م ب", "م ب", "م ب")], c: 0 },
      { q: T3("Ghunnah lasts how many counts?", "غنہ کتنی حرکت تک ہوتا ہے؟", "كم حركة مدة الغنة؟"), o: [T3("2", "2", "٢"), T3("4", "4", "٤"), T3("6", "6", "٦")], c: 0 },
      { q: T3("Ikhfa means…", "اخفاء کا مطلب…", "الإخفاء معناه…"), o: [T3("Hiding the noon sound", "نون کی آواز چھپانا", "إخفاء صوت النون"), T3("Stopping", "رکنا", "الوقف"), T3("Stretching", "کھینچنا", "المد")], c: 0 }];
    const db = {
      users: {
        owner1: { name: "Arsalan Ahmed Shaikh", email: "quranicscience01@gmail.com", phone: "+91 9272527913", phoneLast10: "9272527913", createdAt: now },
        tch1: { name: "Bilal Ahmed", email: "teacher@demo.quranicscience.info", phone: "+91 9876543210", phoneLast10: "9876543210", createdAt: now - 864e5 },
        stu1: { name: "Ayesha Khan", email: "student@demo.quranicscience.info", phone: "+91 9820012345", phoneLast10: "9820012345", code: "AYE345E", batch: "E", country: "IN", joinedAt: now - 3 * 864e5, createdAt: now - 3 * 864e5,
          access: { [CK2]: true }, paid: { [CK2]: now - 2 * 864e5 }, prog: { [CK2]: { qz: { demo_c1: { ok: true, a: [0, 0, 0], t: now - 864e5 } }, q: { demo_c1: { a: [0, 0, 0], t: now - 864e5 } } } } },
        stu2: { name: "Zaid Siddiqui", email: "zaid@demo.quranicscience.info", phone: "+91 9000011122", phoneLast10: "9000011122", code: "ZAI122M", batch: "M", country: "IN", joinedAt: now - 864e5, createdAt: now - 864e5 }
      },
      teachers: { "teacher@demo.quranicscience.info": { name: "Bilal Ahmed", phone: "+91 98765 43210", course: CK2, batch: "E", code: "T-BIL210-TAJ-E", createdAt: now - 864e5 } },
      classes: {
        demo_c1: { course: CK2, batch: "E", n: 1, date: at(-1, 19, 0), title: T3("Makharij: the throat letters", "مخارج: حلق کے حروف", "المخارج: حروف الحلق"), zoom: "https://zoom.us/j/1234567890", recording: "https://drive.google.com/", qs: qs1, teacher: "T-BIL210-TAJ-E", updatedAt: now },
        demo_c2: { course: CK2, batch: "E", n: 2, date: at(0, 19, 0), title: T3("Makharij: the tongue letters", "مخارج: زبان کے حروف", "المخارج: حروف اللسان"), zoom: "https://zoom.us/j/1234567891", recording: "", qs: qs2, teacher: "T-BIL210-TAJ-E", updatedAt: now },
        demo_c3: { course: CK2, batch: "E", n: 3, date: at(2, 19, 0), title: T3("Noon saakin & tanween", "نون ساکن اور تنوین", "النون الساكنة والتنوين"), zoom: "https://zoom.us/j/1234567892", recording: "", qs: qs2, teacher: "T-BIL210-TAJ-E", updatedAt: now }
      },
      activities: {
        act1: { uid: "stu2", name: "Zaid Siddiqui", phone: "+91 9000011122", email: "zaid@demo.quranicscience.info", city: "Pune", kind: "payment", section: "learn", sectionName: "Learn with Us", title: "Activate: Tajweed Class [tajweed-class]", message: "Assalamu Alaikum, I have paid for Tajweed Class. My student code is ZAI122M-TAJ. Please activate my classes.", status: "Sent on WhatsApp", ts: now - 3600e3 },
        act2: { uid: "stu1", name: "Ayesha Khan", phone: "+91 9820012345", kind: "payment", section: "learn", sectionName: "Learn with Us", title: "Paid (auto): tajweed-class [tajweed-class]", status: "Paid", ts: now - 2 * 864e5 }
      },
      receipts: { pay_Demo001: { uid: "stu1", name: "Ayesha Khan", code: "AYE345E-TAJ", course: CK2, courseName: "Tajweed Class", amount: 2100, currency: "INR", paymentId: "pay_Demo001", batch: "Evening batch · 1 hour classes, timing shared in your batch", ts: now - 2 * 864e5 } },
      config: { worker: { lastCron: now - 600e3, lastResult: "{\"demo\":true}" } }
    };
    S(DBK, db);
    S(UK, { "quranicscience01@gmail.com": { uid: "owner1", email: "quranicscience01@gmail.com", pw: "demo1234", displayName: "Arsalan Ahmed Shaikh" },
      "teacher@demo.quranicscience.info": { uid: "tch1", email: "teacher@demo.quranicscience.info", pw: "demo1234", displayName: "Bilal Ahmed" },
      "student@demo.quranicscience.info": { uid: "stu1", email: "student@demo.quranicscience.info", pw: "demo1234", displayName: "Ayesha Khan" },
      "zaid@demo.quranicscience.info": { uid: "stu2", email: "zaid@demo.quranicscience.info", pw: "demo1234", displayName: "Zaid Siddiqui" } });
  }
  const L = [];
  const mk = r => { if (!r) return null; const u = { uid: r.uid, email: r.email, displayName: r.displayName || "", phoneNumber: null, photoURL: "", emailVerified: true, isAnonymous: false, providerData: [{ providerId: "password" }],
    updateProfile: async p => { Object.assign(u, p); const us = J(UK, {}); Object.assign(us[r.email], p); S(UK, us); }, sendEmailVerification: async () => {}, getIdToken: async () => "demo", reload: async () => {} }; return u; };
  const auth = { currentUser: null,
    onAuthStateChanged: cb => { L.push(cb); setTimeout(() => cb(auth.currentUser), 30); return () => {}; },
    _set(r) { auth.currentUser = mk(r); S(CK, r ? r.email : null); L.forEach(cb => cb(auth.currentUser)); },
    createUserWithEmailAndPassword: async (em, pw) => { const us = J(UK, {}); if (us[em]) throw { code: "auth/email-already-in-use", message: "Email already in use" }; us[em] = { uid: "u" + Math.random().toString(36).slice(2, 10), email: em, pw }; S(UK, us); auth.currentUser = mk(us[em]); S(CK, em); setTimeout(() => L.forEach(cb => cb(auth.currentUser)), 600); return { user: auth.currentUser }; },
    signInWithEmailAndPassword: async (em, pw) => { const us = J(UK, {}); if (!us[em] || us[em].pw !== pw) throw { code: "auth/wrong-password", message: "Wrong password" }; auth._set(us[em]); return { user: auth.currentUser }; },
    signOut: async () => auth._set(null), signInWithPopup: async () => { throw { code: "auth/demo", message: "Demo mode: upar ke DEMO button se Student / Teacher / Owner chunein." }; },
    sendPasswordResetEmail: async () => {}, signInAnonymously: async () => { throw { code: "x" }; }, signInWithPhoneNumber: async () => { throw { code: "x" }; }, useDeviceLanguage: () => {}, setPersistence: async () => {} };
  { const em = J(CK, null), us = J(UK, {}); if (em && us[em]) auth.currentUser = mk(us[em]); }
  const fb = { apps: [], initializeApp: () => { fb.apps.push({}); return {}; }, auth: () => auth, firestore: () => db, analytics: () => ({ logEvent: () => {} }), appCheck: () => ({ activate: () => {} }), messaging: () => ({ getToken: async () => "", onMessage: () => {} }) };
  fb.auth.GoogleAuthProvider = function () { this.addScope = () => {}; }; fb.auth.FacebookAuthProvider = function () { this.addScope = () => {}; }; fb.auth.RecaptchaVerifier = function () {}; fb.auth.Auth = { Persistence: { LOCAL: "local" } };
  fb.firestore.FieldValue = { serverTimestamp: () => ({ __ts: 1 }), delete: () => undefined, increment: n => n, arrayUnion: (...a) => a };
  fb.appCheck.ReCaptchaEnterpriseProvider = function () {}; fb.appCheck.ReCaptchaV3Provider = function () {};
  window.firebase = fb; window.QS_DEMO_AUTH = auth;
})();

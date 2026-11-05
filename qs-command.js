/* Quranic Science – Command Center module (for the owner's personal assistant app)
   Usage in any page:
     <div id="qs-command"></div>
     <script src="https://quranicscience.info/qs-command.js" defer></script>
   It has NO theme of its own: it uses the host app's font and colours.
   Optional host CSS variables it will pick up: --accent, --card, --line, --muted, --radius, --good, --bad.
   Login: owner Google account only (quranicscience01@gmail.com). Data: read-only, from the free automation server. */
(function () {
  const FEED = "https://quranic-science-automation.quranicscience01.workers.dev/owner-feed";
  const CFG = { apiKey: "AIzaSyCCoqjw2BzgWcal6OVBqONYOB7x--WP12g", authDomain: "quranicscience-682ff.firebaseapp.com", projectId: "quranicscience-682ff", storageBucket: "quranicscience-682ff.firebasestorage.app", messagingSenderId: "573259128290", appId: "1:573259128290:web:ac11b77238e1bd7354edbb" };
  const VAPID = "BNln4vGcrD1LIqyN5KLOUIYWQePHt2kJ24g4VLc_8qZ8M0jUzCE3Rdiec3d7GKGVOJOP6EI5m1DX0aT6QUHX8dY";
  const OWNERS = ["quranicscience01@gmail.com"], FB = "https://www.gstatic.com/firebasejs/10.12.2/";
  const root = document.getElementById("qs-command"); if (!root) return;

  const css = `
#qs-command{font:inherit;color:inherit}
#qs-command .qc-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}
#qs-command .qc-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin:10px 0}
#qs-command .qc-tile,#qs-command .qc-box{background:var(--card,rgba(127,127,127,.08));border:1px solid var(--line,rgba(127,127,127,.22));border-radius:var(--radius,16px);padding:12px 14px;min-width:0}
#qs-command .qc-tile small{display:block;opacity:.7;font-size:.72em;text-transform:uppercase;letter-spacing:.08em}
#qs-command .qc-tile b{display:block;font-size:1.45em;font-variant-numeric:tabular-nums;line-height:1.2}
#qs-command .qc-tile em{font-style:normal;opacity:.65;font-size:.78em}
#qs-command .qc-tile.qc-money{grid-column:span 2}
#qs-command .qc-tile.qc-money b{color:var(--accent,currentColor)}
#qs-command .qc-tile.qc-alert{border-color:var(--bad,#e5484d)}
#qs-command .qc-tile.qc-alert b{color:var(--bad,#e5484d)}
#qs-command .qc-boxes{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
#qs-command h4{margin:0 0 6px;font-size:1em}
#qs-command .qc-item{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--line,rgba(127,127,127,.18))}
#qs-command .qc-item:first-of-type{border-top:0}
#qs-command .qc-item div{flex:1;min-width:0;overflow-wrap:anywhere}
#qs-command .qc-item p{margin:2px 0 0;opacity:.7;font-size:.86em}
#qs-command .qc-item time{opacity:.6;font-size:.75em;white-space:nowrap}
#qs-command .qc-pill{font-size:.7em;padding:2px 8px;border-radius:999px;border:1px solid var(--line,rgba(127,127,127,.3));white-space:nowrap}
#qs-command .qc-pill.ok{color:var(--good,#2fb170)}#qs-command .qc-pill.need{color:var(--bad,#e5484d)}
#qs-command button.qc-btn{font:inherit;font-size:.85em;color:inherit;background:transparent;border:1px solid var(--line,rgba(127,127,127,.35));border-radius:999px;padding:7px 13px;cursor:pointer}
#qs-command button.qc-btn.qc-main{background:var(--accent,currentColor);color:var(--accent-ink,#fff);border-color:transparent}
#qs-command .qc-empty,#qs-command .qc-sub{opacity:.65;font-size:.86em;margin:4px 0}
@media (max-width:420px){#qs-command .qc-tile.qc-money{grid-column:auto}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const H = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (v, c) => c === "USD" ? "$" + (+v || 0).toLocaleString("en-US", { maximumFractionDigits: 2 }) : "₹" + (+v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const ago = ts => { if (!ts) return ""; const s = (Date.now() - ts) / 1000; return s < 60 ? "now" : s < 3600 ? Math.floor(s / 60) + "m" : s < 86400 ? Math.floor(s / 3600) + "h" : s < 604800 ? Math.floor(s / 86400) + "d" : new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); };
  const item = (ic, t, sub, right) => `<div class="qc-item"><span aria-hidden="true">${ic}</span><div><b>${t}</b>${sub ? `<p>${sub}</p>` : ""}</div>${right || ""}</div>`;
  const load = src => new Promise((ok, no) => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  let seen = 0; try { seen = +localStorage.getItem("qc-seen") || 0; } catch (e) {}

  async function start() {
    root.innerHTML = `<p class="qc-sub">Loading Command Center…</p>`;
    try { if (!(window.firebase && firebase.SDK_VERSION)) await load(FB + "firebase-app-compat.js"); if (!firebase.auth) await load(FB + "firebase-auth-compat.js"); if (!firebase.firestore) await load(FB + "firebase-firestore-compat.js"); }
    catch (e) { root.innerHTML = `<p class="qc-empty">Command Center could not load. Check the internet.</p>`; return; }
    const app = firebase.apps.find(a => a.name === "qs-command") || firebase.initializeApp(CFG, "qs-command");
    const auth = app.auth();
    auth.onAuthStateChanged(u => {
      if (u && OWNERS.includes(String(u.email || "").toLowerCase())) return dash(app, auth);
      root.innerHTML = `<div class="qc-box"><h4>Command Center</h4><p class="qc-sub">${u ? "This account is not the owner account." : "Payments, students and WhatsApp in one place. Owner login only."}</p><button class="qc-btn qc-main" type="button" id="qcLogin">Sign in with Google</button></div>`;
      root.querySelector("#qcLogin").onclick = async () => { const p = new firebase.auth.GoogleAuthProvider(); try { await auth.signInWithPopup(p); } catch (e) { try { await auth.signInWithRedirect(p); } catch (e2) { alert("Sign-in did not open: " + e2.message); } } };
    });
  }

  function dash(app, auth) {
    root.innerHTML = `
      <div class="qc-row"><span class="qc-sub" id="qcUpd">Loading…</span><span class="qc-row"><button class="qc-btn" type="button" id="qcAlert">🔔 Alerts</button><button class="qc-btn" type="button" id="qcRef">↻</button><button class="qc-btn" type="button" id="qcOut">Sign out</button></span></div>
      <div class="qc-tiles">
        <div class="qc-tile qc-money"><small>Fees received</small><b id="qcMoney">–</b><em id="qcMoney30"></em></div>
        <div class="qc-tile"><small>Students</small><b id="qcStu">–</b><em id="qcUsers"></em></div>
        <div class="qc-tile"><small>Sign-ups 7d</small><b id="qcSign">–</b></div>
        <div class="qc-tile" id="qcNeedT"><small>Need you</small><b id="qcNeed">–</b><em>payments</em></div>
        <div class="qc-tile"><small>Open doubts</small><b id="qcDoubt">–</b></div>
        <div class="qc-tile"><small>WhatsApp 7d</small><b id="qcWa">–</b><em>chats</em></div>
        <div class="qc-tile" id="qcFailT"><small>WA failed 24h</small><b id="qcFail">–</b></div>
      </div>
      <div class="qc-boxes">
        <div class="qc-box"><h4>Live feed</h4><div id="qcFeed"></div></div>
        <div class="qc-box"><h4>Payments</h4><div id="qcPays"></div></div>
        <div class="qc-box"><h4>New students</h4><div id="qcSigns"></div></div>
        <div class="qc-box"><h4>WhatsApp & doubts</h4><div id="qcWaL"></div></div>
      </div>`;
    const $ = id => root.querySelector("#" + id);
    async function refresh() {
      try {
        const r = await fetch(FEED, { headers: { authorization: "Bearer " + await auth.currentUser.getIdToken() } });
        if (!r.ok) throw new Error(r.status === 401 ? "owner only" : "server " + r.status);
        const d = await r.json(), s = d.stats || {};
        $("qcUpd").textContent = "Updated " + new Date(d.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        $("qcMoney").textContent = money(s.inr, "INR") + (s.usd ? " + " + money(s.usd, "USD") : "");
        $("qcMoney30").textContent = "30 days: " + money(s.inr30, "INR") + (s.usd30 ? " + " + money(s.usd30, "USD") : "");
        $("qcStu").textContent = s.students || 0; $("qcUsers").textContent = (s.users || 0) + " accounts";
        $("qcSign").textContent = s.signups7 || 0; $("qcNeed").textContent = s.needs || 0; $("qcDoubt").textContent = s.openDoubts || 0;
        $("qcWa").textContent = s.waIn7 || 0; $("qcFail").textContent = s.waFailed24 || 0;
        $("qcNeedT").classList.toggle("qc-alert", (s.needs || 0) > 0); $("qcFailT").classList.toggle("qc-alert", (s.waFailed24 || 0) > 0);
        const ic = { pay: "💰", needs: "⚠️", signup: "🎓" }, none = t => `<p class="qc-empty">${t}</p>`;
        $("qcFeed").innerHTML = (d.feed || []).slice(0, 8).map(f => item(ic[f.kind] || "🔔", H(f.title), H(f.body), `<time>${ago(f.ts)}</time>`)).join("") || none("New payments and sign-ups appear here.");
        $("qcPays").innerHTML = (d.payments || []).slice(0, 8).map(p => item(p.status === "applied" ? "💰" : "⚠️", money(p.amount, p.currency) + " · " + H(p.course || "–"), H(p.name || p.reason || ""), `<span class="qc-pill ${p.status === "applied" ? "ok" : "need"}">${p.status === "applied" ? "done" : "needs you"}</span>`)).join("") || none("No payments yet.");
        $("qcSigns").innerHTML = (d.signups || []).slice(0, 8).map(u => item("🎓", H(u.name || "No name"), H([u.country, (u.courses || []).join(", ") || "no course yet"].filter(Boolean).join(" · ")), `<time>${ago(u.ts)}</time>`)).join("") || none("No sign-ups yet.");
        $("qcWaL").innerHTML = ((d.whatsapp || []).slice(0, 5).map(w => item("💬", H(w.who), H(w.role), `<time>${ago(w.ts)}</time>`)).join("") + (d.doubts || []).slice(0, 4).map(x => item("❓", H(x.course), H(x.text), `<time>${ago(x.ts)}</time>`)).join("")) || none("Nothing new.");
        const fresh = (d.feed || []).filter(f => f.ts > seen);
        if (seen && fresh.length && "Notification" in window && Notification.permission === "granted") fresh.slice(0, 3).forEach(f => { try { new Notification(f.title, { body: f.body }); } catch (e) {} });
        seen = Math.max(seen, ...(d.feed || []).map(f => f.ts || 0), Date.now() - 1); try { localStorage.setItem("qc-seen", seen); } catch (e) {}
        root.dispatchEvent(new CustomEvent("qs-command:update", { detail: d, bubbles: true }));
      } catch (e) { $("qcUpd").textContent = "Could not load: " + e.message; }
    }
    $("qcRef").onclick = refresh; $("qcOut").onclick = () => auth.signOut();
    $("qcAlert").onclick = async () => {
      try {
        if (await Notification.requestPermission() !== "granted") return;
        await load(FB + "firebase-messaging-compat.js");
        const reg = await navigator.serviceWorker.getRegistration() || await navigator.serviceWorker.register("/sw.js");
        const token = await app.messaging().getToken({ vapidKey: VAPID, serviceWorkerRegistration: reg });
        await app.firestore().collection("users").doc(auth.currentUser.uid).set({ push: { token, ts: Date.now() }, email: auth.currentUser.email.toLowerCase() }, { merge: true });
        $("qcAlert").textContent = "🔔 Alerts on ✓";
      } catch (e) { $("qcAlert").textContent = "🔔 Alerts: " + (e.message || e).slice(0, 40); }
    };
    refresh(); setInterval(refresh, 60000);
  }
  start();
})();

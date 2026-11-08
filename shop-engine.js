/* Shop engine – one cart / checkout / tracking / quote system for Flow Studio, ScentKart, Al Aswad Dubai, Bareerah Naturals.
   Include on a brand site:
     <script src="https://quranicscience.info/shop-engine.js" defer></script>
     <script>addEventListener("DOMContentLoaded",()=>Shop.init({brand:"scentkart", name:"ScentKart", whatsapp:"919272527913"}))</script>
   Optional hooks in the page:
     [data-shop-grid]            → product cards are drawn here (or render your own and call Shop.add(id))
     [data-shop-add="ITEM_ID"]   → any button that adds an item
     [data-shop-quote="Service"] → any button that opens the quote form
     [data-shop-cart] / [data-shop-orders] → buttons that open the cart / "My orders"
   Look: set --shp-accent, --shp-accent-ink, --shp-bg, --shp-ink, --shp-card, --shp-line on :root to match the brand. */
(function () {
  const API = "https://quranic-science-automation.quranicscience01.workers.dev/shop";
  const S = { cfg: {}, items: [], cart: [], ship: 0, freeShipAbove: 0, rzpKey: "", cur: "INR" };
  const H = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const rs = v => (S.cur === "USD" ? "$" : S.cur === "AED" ? "AED " : "₹") + (+v || 0).toLocaleString(S.cur === "INR" ? "en-IN" : "en-US", { maximumFractionDigits: 2 });
  const K = n => "shp-" + S.cfg.brand + "-" + n;
  const STEP = { awaiting_payment: "Order placed", paid: "Payment received", processing: "Being prepared", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", check_payment: "Payment being checked" };
  const FLOW = ["awaiting_payment", "paid", "processing", "shipped", "delivered"];

  const CSS = `
.shp-chat{display:grid;gap:8px;max-height:46vh;overflow:auto;margin:12px 0;padding:10px;border-radius:14px;background:rgba(127,127,127,.08)}
.shp-msg{max-width:85%;padding:10px 12px;border-radius:14px;background:var(--shp-card,rgba(127,127,127,.14));display:grid;gap:4px;white-space:pre-wrap;word-break:break-word}
.shp-msg.o{justify-self:end;background:color-mix(in srgb,var(--shp-accent,#e3aa3c) 22%,transparent)}.shp-msg small{opacity:.65;font-size:11px}
:root{--shp-accent:#e3aa3c;--shp-accent-ink:#1a1206;--shp-bg:#111014;--shp-ink:#f5f1ea;--shp-card:#1b1a20;--shp-line:rgba(255,255,255,.12);--shp-muted:rgba(245,241,234,.62)}
.shp-btn3d{--d:5px;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 20px;border-radius:14px;border:0;cursor:pointer;font:inherit;font-weight:700;
  color:var(--shp-accent-ink);background:linear-gradient(180deg,color-mix(in srgb,var(--shp-accent) 82%,#fff),var(--shp-accent));
  box-shadow:0 var(--d) 0 color-mix(in srgb,var(--shp-accent) 55%,#000),0 calc(var(--d) + 10px) 22px -8px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.55);
  transform:translateY(0);transition:transform .12s ease,box-shadow .12s ease;text-decoration:none;text-shadow:0 1px 0 rgba(255,255,255,.35)}
.shp-btn3d:hover{transform:translateY(-1px)}
.shp-btn3d:active{transform:translateY(var(--d));box-shadow:0 0 0 color-mix(in srgb,var(--shp-accent) 55%,#000),0 4px 10px -6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.4)}
.shp-btn3d.ghost{color:var(--shp-ink);background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.04));box-shadow:0 var(--d) 0 rgba(0,0,0,.45),0 12px 22px -10px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.18);text-shadow:none}
.shp-btn3d:focus-visible{outline:2px solid var(--shp-accent);outline-offset:4px}
.shp-btn3d[disabled]{opacity:.55;cursor:not-allowed}
.shp-fab{position:fixed;right:calc(18px + env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:9000;border-radius:18px;padding:14px 18px}
.shp-badge{min-width:22px;height:22px;border-radius:11px;background:var(--shp-ink);color:var(--shp-bg);font-size:.75rem;display:inline-grid;place-items:center;padding:0 6px}
.shp-ov{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;justify-content:flex-end}
.shp-ov.center{justify-content:center;align-items:center;padding:16px}
.shp-panel{width:min(460px,100%);height:100%;overflow:auto;background:var(--shp-bg);color:var(--shp-ink);padding:calc(18px + env(safe-area-inset-top,0px)) 20px calc(20px + env(safe-area-inset-bottom,0px));box-shadow:-30px 0 60px -20px rgba(0,0,0,.6);border-left:1px solid var(--shp-line);animation:shpIn .28s cubic-bezier(.2,.8,.2,1)}
.shp-ov.center .shp-panel{height:auto;max-height:92vh;border-radius:24px;border:1px solid var(--shp-line)}
@keyframes shpIn{from{transform:translateX(30px);opacity:.4}to{transform:none;opacity:1}}
.shp-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
.shp-head h3{margin:0;font-size:1.3rem}
.shp-x{background:none;border:1px solid var(--shp-line);color:var(--shp-ink);width:38px;height:38px;border-radius:12px;cursor:pointer;font-size:1rem}
.shp-line{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--shp-line)}
.shp-thumb{width:56px;height:56px;border-radius:14px;background:var(--shp-card) center/cover;box-shadow:inset 0 0 0 1px var(--shp-line)}
.shp-line b{display:block;font-size:.95rem}.shp-line small{color:var(--shp-muted)}
.shp-qty{display:inline-flex;align-items:center;border:1px solid var(--shp-line);border-radius:10px;overflow:hidden;margin-top:6px}
.shp-qty button{background:none;border:0;color:var(--shp-ink);width:30px;height:28px;cursor:pointer;font-size:1rem}
.shp-qty span{min-width:24px;text-align:center;font-variant-numeric:tabular-nums}
.shp-sum{display:grid;gap:6px;margin:16px 0;font-variant-numeric:tabular-nums}
.shp-sum div{display:flex;justify-content:space-between;color:var(--shp-muted)}
.shp-sum .tot{color:var(--shp-ink);font-weight:800;font-size:1.15rem;padding-top:8px;border-top:1px solid var(--shp-line)}
.shp-form{display:grid;gap:10px}
.shp-form label{display:grid;gap:4px;font-size:.82rem;color:var(--shp-muted)}
.shp-form input,.shp-form textarea,.shp-form select{font:inherit;font-size:.95rem;color:var(--shp-ink);background:var(--shp-card);border:1px solid var(--shp-line);border-radius:12px;padding:11px 12px;box-shadow:inset 0 2px 4px rgba(0,0,0,.35)}
.shp-form input:focus,.shp-form textarea:focus,.shp-form select:focus{outline:2px solid var(--shp-accent);outline-offset:1px}
.shp-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.shp-err{color:#ff7a7a;font-size:.88rem;min-height:1em}
.shp-note{color:var(--shp-muted);font-size:.85rem}
.shp-empty{color:var(--shp-muted);padding:20px 0;text-align:center}
.shp-tl{list-style:none;margin:14px 0;padding:0;display:grid;gap:0}
.shp-tl li{display:grid;grid-template-columns:22px 1fr;gap:12px;padding-bottom:16px;position:relative;color:var(--shp-muted)}
.shp-tl li::before{content:"";width:14px;height:14px;border-radius:50%;margin-top:3px;background:var(--shp-card);box-shadow:inset 0 0 0 2px var(--shp-line)}
.shp-tl li::after{content:"";position:absolute;left:6px;top:20px;bottom:0;width:2px;background:var(--shp-line)}
.shp-tl li:last-child::after{display:none}
.shp-tl li.done{color:var(--shp-ink)}
.shp-tl li.done::before{background:var(--shp-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--shp-accent) 25%,transparent)}
.shp-card{background:var(--shp-card);border:1px solid var(--shp-line);border-radius:18px;padding:14px;margin:10px 0}
.shp-pill{display:inline-block;font-size:.75rem;padding:3px 10px;border-radius:999px;background:color-mix(in srgb,var(--shp-accent) 18%,transparent);color:var(--shp-accent)}
.shp-toast{position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9800;background:var(--shp-ink);color:var(--shp-bg);padding:10px 16px;border-radius:999px;font-size:.9rem;box-shadow:0 12px 30px -10px rgba(0,0,0,.6)}
.shp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px}
.shp-item{position:relative;border-radius:24px;padding:14px;background:linear-gradient(160deg,color-mix(in srgb,var(--shp-card) 80%,#fff 6%),var(--shp-card));border:1px solid var(--shp-line);
  box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 28px 50px -28px rgba(0,0,0,.7);transform-style:preserve-3d;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s;display:flex;flex-direction:column;gap:10px}
.shp-item:hover{transform:perspective(900px) rotateX(4deg) rotateY(-5deg) translateY(-6px);box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 40px 60px -30px rgba(0,0,0,.8)}
.shp-img{aspect-ratio:4/5;max-width:100%;border-radius:18px;background:var(--shp-bg) center/cover;box-shadow:inset 0 0 0 1px var(--shp-line);transform:translateZ(30px)}
.shp-item h4{margin:0;font-size:1.05rem}
.shp-item p{margin:0;color:var(--shp-muted);font-size:.86rem}
.shp-price{font-weight:800;font-size:1.1rem;font-variant-numeric:tabular-nums}
.shp-price s{color:var(--shp-muted);font-weight:500;font-size:.85rem;margin-left:6px}
.shp-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto;flex-wrap:wrap}
@media (max-width:520px){.shp-two{grid-template-columns:1fr}.shp-panel{width:100%}}
@media (prefers-reduced-motion:reduce){.shp-item,.shp-btn3d,.shp-panel{transition:none;animation:none}.shp-item:hover{transform:none}}`;

  function toast(t) { const e = document.createElement("div"); e.className = "shp-toast"; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 2600); }
  function modal(html, center) {
    close(); const ov = document.createElement("div"); ov.className = "shp-ov" + (center ? " center" : ""); ov.id = "shpOv";
    ov.innerHTML = `<div class="shp-panel" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(ov);
    ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-shp-close]")) close(); });
    document.documentElement.style.overflow = "hidden"; return ov.querySelector(".shp-panel");
  }
  function close() { const o = document.getElementById("shpOv"); if (o) o.remove(); document.documentElement.style.overflow = ""; }
  const head = t => `<div class="shp-head"><h3>${t}</h3><button class="shp-x" type="button" data-shp-close aria-label="Close">✕</button></div>`;
  async function api(path, opt) { const r = await fetch(API + path, opt); const j = await r.json().catch(() => ({})); if (!r.ok || j.error) throw new Error(j.error || "Something went wrong (" + r.status + ")"); return j; }

  /* ---------- catalogue ---------- */
  async function loadItems() {
    try { const j = await api("/items?brand=" + S.cfg.brand); S.items = j.items || []; S.ship = j.ship || 0; S.freeShipAbove = j.freeShipAbove || 0; S.rzpKey = j.rzpKey || ""; S.cur = j.currency || S.cfg.currency || "INR"; }
    catch (e) { S.items = []; }
    if (!S.items.length && S.cfg.fallbackItems) S.items = S.cfg.fallbackItems.map(x => Object.assign({ demo: true }, x));
    drawGrids(); document.dispatchEvent(new CustomEvent("shop:items", { detail: S.items }));
  }
  function card(it) {
    const buy = it.kind === "quote" || !(+it.price > 0)
      ? `<button class="shp-btn3d" type="button" data-shop-quote="${H(it.name)}">Get a quote</button>`
      : `<button class="shp-btn3d" type="button" data-shop-add="${H(it.id)}" ${it.stock === 0 ? "disabled" : ""}>${it.stock === 0 ? "Sold out" : "Add to cart"}</button>`;
    return `<article class="shp-item"><div class="shp-img" style="${it.img ? `background-image:url('${H(it.img)}')` : ""}">${it.img ? "" : (S.cfg.placeholder ? S.cfg.placeholder(it) : "")}</div>
      ${it.tag ? `<span class="shp-pill">${H(it.tag)}</span>` : ""}<h4>${H(it.name)}</h4>${it.desc ? `<p>${H(it.desc)}</p>` : ""}
      <div class="shp-row"><span class="shp-price">${+it.price > 0 ? rs(it.price) + (it.mrp > it.price ? `<s>${rs(it.mrp)}</s>` : "") : (it.kind === "quote" ? "Custom price" : "Price on request")}${it.size ? ` <small class="shp-note">· ${H(it.size)}</small>` : ""}</span>${buy}</div></article>`;
  }
  function drawGrids() { document.querySelectorAll("[data-shop-grid]").forEach(g => { const cat = g.getAttribute("data-shop-grid"); const list = S.items.filter(i => !cat || i.cat === cat);
    g.classList.add("shp-grid"); g.innerHTML = list.length ? list.map(card).join("") : `<p class="shp-empty">New items are coming soon.</p>`; }); }

  /* ---------- cart ---------- */
  const saveCart = () => { ls.set(K("cart"), S.cart); badge(); };
  function badge() { const n = S.cart.reduce((t, l) => t + l.qty, 0); document.querySelectorAll("[data-shp-count]").forEach(b => { b.textContent = n; b.hidden = !n; }); }
  function add(id, qty = 1) {
    const it = S.items.find(i => i.id === id); if (!it) return toast("This item is not available.");
    if (it.demo) return toast("Online orders open very soon. Message us on WhatsApp.");
    const l = S.cart.find(x => x.id === id); if (l) l.qty = Math.min(50, l.qty + qty); else S.cart.push({ id, qty, name: it.name, price: +it.price, img: it.img || "" });
    saveCart(); toast("Added to cart ✓"); }
  function openCart() {
    S.cart.forEach(l => { const it = S.items.find(i => i.id === l.id); if (it) { l.price = +it.price; l.name = it.name; l.img = it.img || ""; } }); saveCart();
    const sub = S.cart.reduce((t, l) => t + l.price * l.qty, 0), ship = !S.cart.length ? 0 : (S.freeShipAbove && sub >= S.freeShipAbove ? 0 : S.ship);
    const p = modal(head("Your cart") + (S.cart.length ? S.cart.map((l, i) => `<div class="shp-line"><span class="shp-thumb" style="${l.img ? `background-image:url('${H(l.img)}')` : ""}"></span>
      <div><b>${H(l.name)}</b><small>${rs(l.price)} each</small><br><span class="shp-qty"><button type="button" data-q="${i}" data-d="-1" aria-label="Less">−</button><span>${l.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="More">+</button></span></div>
      <b>${rs(l.price * l.qty)}</b></div>`).join("") + `<div class="shp-sum"><div><span>Subtotal</span><span>${rs(sub)}</span></div><div><span>Delivery</span><span>${ship ? rs(ship) : "Free"}</span></div>${S.freeShipAbove && sub < S.freeShipAbove ? `<div><span>Free delivery above ${rs(S.freeShipAbove)}</span><span></span></div>` : ""}<div class="tot"><span>Total</span><span>${rs(sub + ship)}</span></div></div>
      <button class="shp-btn3d" type="button" id="shpGo" style="width:100%">Checkout · ${rs(sub + ship)}</button>` : `<p class="shp-empty">Your cart is empty.</p>`) +
      `<p style="text-align:center;margin-top:18px"><button class="shp-btn3d ghost" type="button" id="shpMine">📦 My orders & tracking</button></p>`);
    p.onclick = e => { const b = e.target.closest("[data-q]"); if (b) { const l = S.cart[+b.dataset.q]; l.qty += +b.dataset.d; if (l.qty < 1) S.cart.splice(+b.dataset.q, 1); saveCart(); openCart(); } };
    const g = p.querySelector("#shpGo"); if (g) g.onclick = () => checkout();
    p.querySelector("#shpMine").onclick = myOrders;
  }

  /* ---------- checkout (guest, address saved on this phone) ---------- */
  function addrForm(c) { const a = c.address || {}; return `
    <div class="shp-two"><label>Full name<input id="sN" autocomplete="name" value="${H(c.name)}" required></label><label>Mobile (WhatsApp)<input id="sP" type="tel" autocomplete="tel" value="${H(c.phone)}" required></label></div>
    <label>Email (for the receipt)<input id="sE" type="email" autocomplete="email" value="${H(c.email)}"></label>
    ${S.cfg.noAddress ? "" : `<label>House, building, street<input id="sA1" autocomplete="address-line1" value="${H(a.line1)}" required></label>
    <label>Area, landmark<input id="sA2" autocomplete="address-line2" value="${H(a.line2)}"></label>
    <div class="shp-two"><label>City<input id="sC" autocomplete="address-level2" value="${H(a.city)}" required></label><label>PIN code<input id="sZ" inputmode="numeric" autocomplete="postal-code" value="${H(a.pin)}" required></label></div>
    <div class="shp-two"><label>State<input id="sS" autocomplete="address-level1" value="${H(a.state)}"></label><label>Country<input id="sK" autocomplete="country-name" value="${H(a.country || "India")}"></label></div>`}`; }
  function readForm(p) { const v = id => (p.querySelector("#" + id) || {}).value || "";
    return { name: v("sN"), phone: v("sP"), email: v("sE"), address: { line1: v("sA1"), line2: v("sA2"), city: v("sC"), pin: v("sZ"), state: v("sS"), country: v("sK") || "India" } }; }
  function checkout(quote) {
    const c = ls.get("shp-customer", {}), total = quote ? quote.price : S.cart.reduce((t, l) => t + l.price * l.qty, 0);
    const p = modal(head(quote ? "Pay for your quote" : "Delivery details") + `<form class="shp-form" id="shpF">${addrForm(c)}
      <label>Note for us (optional)<textarea id="sNote" rows="2"></textarea></label><p class="shp-err" id="shpErr"></p>
      <button class="shp-btn3d" type="submit" id="shpPay" style="width:100%">${S.rzpKey ? "Pay securely" : "Place order"}</button>
      <p class="shp-note">🔒 Payments by Razorpay: UPI, cards, net banking and wallets. Your details stay private.</p></form>`);
    p.querySelector("#shpF").onsubmit = async e => {
      e.preventDefault(); const btn = p.querySelector("#shpPay"), err = p.querySelector("#shpErr"), cust = readForm(p);
      if (!S.cfg.noAddress && (!cust.address.line1 || !cust.address.city || !cust.address.pin)) { err.textContent = "Please fill your address, city and PIN code."; return; }
      ls.set("shp-customer", cust); btn.disabled = true; btn.textContent = "Please wait…"; err.textContent = "";
      try {
        const o = await api("/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brand: S.cfg.brand, items: quote ? [] : S.cart.map(l => ({ id: l.id, qty: l.qty, name: l.name })), customer: cust, note: p.querySelector("#sNote").value, quoteId: quote && quote.id, quoteKey: quote && quote.key }) });
        const mine = ls.get(K("orders"), []); mine.unshift({ id: o.id, key: o.key, ts: Date.now() }); ls.set(K("orders"), mine.slice(0, 50));
        if (!quote) { S.cart = []; saveCart(); }
        if (o.rzpKey) return pay(o, cust);
        waAfter(o, cust);
      } catch (x) { err.textContent = x.message; btn.disabled = false; btn.textContent = S.rzpKey ? "Pay securely" : "Place order"; }
    };
  }
  function loadRzp() { return window.Razorpay ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  async function pay(o, cust) {
    try { await loadRzp(); } catch (e) { return waAfter(o, cust); }
    const rz = new Razorpay({ key: o.rzpKey, amount: Math.round(o.total * 100), currency: o.currency, name: S.cfg.name, description: "Order " + o.id, image: S.cfg.logo || undefined,
      prefill: { name: cust.name, email: cust.email, contact: cust.phone }, notes: { shop_order: o.id, brand: S.cfg.brand }, theme: { color: S.cfg.color || "#e3aa3c" },
      handler: () => confirmPaid(o), modal: { ondismiss: () => track(o.id, o.key, "Payment not finished. You can pay again from here.") } });
    rz.open();
  }
  async function confirmPaid(o) {
    const p = modal(head("Thank you! 🎉") + `<p>Payment done. Confirming your order <b>${H(o.id)}</b>…</p>`, true);
    for (let i = 0; i < 8; i++) { try { const t = await api(`/track?id=${o.id}&key=${o.key}`); if (t.status !== "awaiting_payment") return track(o.id, o.key); } catch (e) {} await new Promise(r => setTimeout(r, 2500)); }
    track(o.id, o.key, "Your payment is received. The confirmation can take a minute to show here.");
  }
  function waAfter(o, cust) {
    const msg = `Assalamu Alaikum ${S.cfg.name}, I placed order ${o.id} (${rs(o.total)}). Please share how to pay.`;
    modal(head("Order placed ✓") + `<p>Your order number is <b>${H(o.id)}</b>. Online payment is opening very soon. Tap below to send the order to us on WhatsApp and we will share the payment details.</p>
      <p><a class="shp-btn3d" href="https://wa.me/${S.cfg.whatsapp}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Send on WhatsApp</a></p>
      <p><button class="shp-btn3d ghost" type="button" id="shpT">Track this order</button></p>`, true).querySelector("#shpT").onclick = () => track(o.id, o.key);
  }

  /* ---------- tracking ---------- */
  async function track(id, key, msg) {
    const p = modal(head("Order " + H(id)) + `<p class="shp-note">Loading…</p>`, true);
    try {
      const o = await api(`/track?id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`), at = FLOW.indexOf(o.status), seen = {};
      (o.timeline || []).forEach(t => seen[t.s] = t.ts);
      p.innerHTML = head("Order " + H(o.id)) + (msg ? `<p class="shp-note">${H(msg)}</p>` : "") +
        `<span class="shp-pill">${H(STEP[o.status] || o.status)}</span>
        <ol class="shp-tl">${(o.status === "cancelled" ? ["awaiting_payment", "cancelled"] : FLOW).map((s, i) => `<li class="${seen[s] || i <= at ? "done" : ""}"><div><b>${STEP[s]}</b>${seen[s] ? `<br><small>${new Date(seen[s]).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>` : ""}</div></li>`).join("")}</ol>
        ${o.tracking && (o.tracking.no || o.tracking.url) ? `<div class="shp-card"><b>Courier:</b> ${H(o.tracking.carrier || "")} ${H(o.tracking.no || "")}${o.tracking.url ? `<br><a class="shp-btn3d ghost" style="margin-top:10px" href="${H(o.tracking.url)}" target="_blank" rel="noopener">Track parcel</a>` : ""}</div>` : ""}
        <div class="shp-card">${(o.items || []).map(l => `<div style="display:flex;justify-content:space-between;gap:10px"><span>${H(l.name)} × ${l.qty}</span><span>${rs(l.price * l.qty)}</span></div>`).join("")}
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-weight:800"><span>Total</span><span>${rs(o.total)}</span></div></div>
        ${o.status === "awaiting_payment" && S.rzpKey ? `<button class="shp-btn3d" type="button" id="shpRepay" style="width:100%">Pay ${rs(o.total)}</button>` : ""}
        <p style="margin-top:12px"><a class="shp-btn3d ghost" href="https://wa.me/${S.cfg.whatsapp}?text=${encodeURIComponent("Hi " + S.cfg.name + ", about my order " + o.id)}" target="_blank" rel="noopener">Ask on WhatsApp</a></p>`;
      const rp = p.querySelector("#shpRepay"); if (rp) rp.onclick = () => pay({ id: o.id, key, total: o.total, currency: o.currency, rzpKey: S.rzpKey }, ls.get("shp-customer", {}));
    } catch (e) { p.innerHTML = head("Order") + `<p class="shp-err">${H(e.message)}</p>`; }
  }
  async function myOrders() {
    const mine = ls.get(K("orders"), []), quotes = ls.get(K("quotes"), []);
    const p = modal(head(S.cfg.quoteServices ? "My orders & quotes" : "My orders") + (mine.length || quotes.length ? "" : `<p class="shp-empty">Nothing on this phone yet.</p>`) + `<div id="shpList"></div>
      <form class="shp-form" id="shpFind" style="margin-top:16px"><label>Track with an order link or number + key<input id="shpCode" placeholder="Paste the tracking link from WhatsApp"></label><button class="shp-btn3d ghost" type="submit">Track</button></form>`);
    const list = p.querySelector("#shpList");
    for (const m of mine.slice(0, 15)) { try { const o = await api(`/track?id=${m.id}&key=${m.key}`); const row = document.createElement("div"); row.className = "shp-card"; row.style.cursor = "pointer";
      row.innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px"><b>${H(o.id)}</b><span class="shp-pill">${H(STEP[o.status] || o.status)}</span></div><small class="shp-note">${(o.items || []).map(l => H(l.name)).join(", ")} · ${rs(o.total)}</small>`;
      row.onclick = () => track(m.id, m.key); list.appendChild(row); } catch (e) {} }
    for (const q of quotes.slice(0, 10)) { try { const r = await api(`/quote?id=${q.id}&key=${q.key}`); const row = document.createElement("div"); row.className = "shp-card"; row.style.cursor = "pointer";
      const last = (r.msgs || []).slice(-1)[0] || {}, unread = last.f === "o";
      row.innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px"><b>Quote · ${H(r.service)}</b><span class="shp-pill">${r.status === "paid" ? "Paid" : r.status === "quoted" ? "Price ready" : unread ? "New reply" : "Waiting for reply"}</span></div>
        <small class="shp-note">${H(String(last.t || r.brief || "").slice(0, 90))}${r.price ? " · " + rs(r.price) : ""}</small>`;
      row.onclick = () => quoteView(q.id, q.key); list.appendChild(row); } catch (e) {} }
    p.querySelector("#shpFind").onsubmit = e => { e.preventDefault(); const v = p.querySelector("#shpCode").value, m = /([A-Z]{2}\d{6}-[A-Z0-9]{5})[.\s/=&key]*([a-z0-9]{16})/.exec(v); if (m) track(m[1], m[2]); else toast("Paste the full tracking link."); };
  }

  /* ---------- quote conversation: client and studio talk here; studio replies also go to WhatsApp ---------- */
  async function quoteView(id, key) {
    const p = modal(head("Quote " + H(id)) + `<p class="shp-note">Loading…</p>`, true);
    try {
      const r = await api(`/quote?id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`), msgs = r.msgs || [];
      p.innerHTML = head(H(r.service)) + `<span class="shp-pill">${r.status === "paid" ? "Paid ✓" : r.status === "quoted" ? "Price ready" : "In discussion"}</span> <small class="shp-note">${H(r.id)}</small>
        <div class="shp-chat">${msgs.map(m => `<div class="shp-msg ${m.f === "o" ? "o" : ""}"><span>${H(m.t)}</span>${m.price ? `<b>${rs(m.price)}</b>` : ""}<small>${m.f === "o" ? H(S.cfg.name) : "You"} · ${new Date(m.ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small></div>`).join("")}</div>
        ${r.status === "quoted" && r.price ? `<button class="shp-btn3d" type="button" id="shpAcc" style="width:100%;margin:6px 0 12px">Accept & pay ${rs(r.price)}</button>` : ""}
        ${r.status !== "paid" ? `<form class="shp-form" id="shpMsg"><label>Ask a question or reply<textarea id="shpMt" rows="3" placeholder="Type your message…" required></textarea></label><p class="shp-err" id="shpErr"></p><button class="shp-btn3d ghost" type="submit">Send message</button></form>` : ""}
        <p class="shp-note">Our replies come here and on your WhatsApp.</p>`;
      const ch = p.querySelector(".shp-chat"); ch.scrollTop = ch.scrollHeight;
      const acc = p.querySelector("#shpAcc"); if (acc) acc.onclick = () => checkout({ id, key, price: r.price });
      const f = p.querySelector("#shpMsg"); if (f) f.onsubmit = async e => { e.preventDefault(); const t = p.querySelector("#shpMt").value.trim(); if (!t) return;
        const b = f.querySelector("button"); b.disabled = true; b.textContent = "Sending…";
        try { await api("/quote/msg", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, key, text: t }) }); quoteView(id, key); }
        catch (x) { p.querySelector("#shpErr").textContent = x.message; b.disabled = false; b.textContent = "Send message"; } };
    } catch (e) { p.innerHTML = head("Quote") + `<p class="shp-err">${H(e.message)}</p>`; }
  }

  /* ---------- quotes ---------- */
  function quote(service) {
    const c = ls.get("shp-customer", {}), opts = (S.cfg.quoteServices || []).map(s => `<option ${s === service ? "selected" : ""}>${H(s)}</option>`).join("");
    const p = modal(head("Get a free quote") + `<form class="shp-form" id="shpQ">
      <div class="shp-two"><label>Your name<input id="sN" value="${H(c.name)}" required></label><label>WhatsApp number<input id="sP" type="tel" value="${H(c.phone)}" required></label></div>
      <label>Email<input id="sE" type="email" value="${H(c.email)}"></label>
      <label>Service${opts ? `<select id="qS">${opts}</select>` : `<input id="qS" value="${H(service || "")}">`}</label>
      <label>About the project<textarea id="qB" rows="4" placeholder="What do you need, for which brand, any reference links" required></textarea></label>
      <div class="shp-two"><label>Budget<select id="qBu"><option>Not sure yet</option><option>Under ₹5,000</option><option>₹5,000 – ₹15,000</option><option>₹15,000 – ₹50,000</option><option>₹50,000+</option><option>Monthly plan</option></select></label>
      <label>When do you need it?<select id="qD"><option>Flexible</option><option>This week</option><option>Within 2 weeks</option><option>This month</option></select></label></div>
      <p class="shp-err" id="shpErr"></p><button class="shp-btn3d" type="submit" style="width:100%">Send request</button>
      <p class="shp-note">You will see the price here under "My orders", and we also send it on WhatsApp. Then you can pay online in one tap.</p></form>`);
    p.querySelector("#shpQ").onsubmit = async e => {
      e.preventDefault(); const v = id => p.querySelector("#" + id).value, cust = { name: v("sN"), phone: v("sP"), email: v("sE") };
      try { const r = await api("/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brand: S.cfg.brand, customer: cust, service: v("qS"), brief: v("qB"), budget: v("qBu"), deadline: v("qD") }) });
        ls.set("shp-customer", Object.assign(ls.get("shp-customer", {}), cust)); const qs = ls.get(K("quotes"), []); qs.unshift({ id: r.id, key: r.key, ts: Date.now() }); ls.set(K("quotes"), qs.slice(0, 30));
        const msg = `Assalamu Alaikum ${S.cfg.name}, I requested a quote (${r.id}) for ${v("qS")}.\n${v("qB")}\nBudget: ${v("qBu")} · ${v("qD")}`;
        modal(head("Request sent ✓") + `<p>Your request number is <b>${H(r.id)}</b>. Our reply and price will come under <b>My orders & quotes</b>, and on WhatsApp.</p><p class="shp-note">Tap below once so our reply can reach your WhatsApp instantly.</p><p><a class="shp-btn3d" href="https://wa.me/${S.cfg.whatsapp}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Send on WhatsApp</a></p><p><button class="shp-btn3d ghost" type="button" id="shpQv">Open my quote chat</button></p>`, true).querySelector("#shpQv").onclick = () => quoteView(r.id, r.key);
      } catch (x) { p.querySelector("#shpErr").textContent = x.message; }
    };
  }

  /* ---------- start ---------- */
  function init(cfg) {
    S.cfg = Object.assign({ whatsapp: "919272527913", fab: true }, cfg); S.cur = S.cfg.currency || "INR"; S.cart = ls.get(K("cart"), []);
    const st = document.createElement("style"); st.textContent = CSS; document.head.prepend(st);
    if (S.cfg.fab) { const f = document.createElement("button"); f.type = "button"; f.className = "shp-btn3d shp-fab"; f.setAttribute("data-shop-cart", ""); f.setAttribute("aria-label", "Cart");
      f.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span class="shp-badge" data-shp-count hidden>0</span>`; document.body.appendChild(f); }
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-shop-add]"); if (a) { e.preventDefault(); return add(a.getAttribute("data-shop-add")); }
      const q = e.target.closest("[data-shop-quote]"); if (q) { e.preventDefault(); return quote(q.getAttribute("data-shop-quote")); }
      if (e.target.closest("[data-shop-cart]")) { e.preventDefault(); return openCart(); }
      if (e.target.closest("[data-shop-orders]")) { e.preventDefault(); return myOrders(); }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    const m = /#track=([A-Z0-9-]+)\.([a-z0-9]{16})/.exec(location.hash); if (m) setTimeout(() => track(m[1], m[2]), 300);
    const mq = /#quote=(Q[A-Z0-9-]+)\.([a-z0-9]{16})/.exec(location.hash); if (mq) { const qs = ls.get(K("quotes"), []); if (!qs.find(x => x.id === mq[1])) { qs.unshift({ id: mq[1], key: mq[2], ts: Date.now() }); ls.set(K("quotes"), qs); } setTimeout(() => quoteView(mq[1], mq[2]), 300); }
    badge(); loadItems();
  }
  window.Shop = { init, add, openCart, myOrders, quote, quoteView, track, get items() { return S.items; }, reload: loadItems };
})();

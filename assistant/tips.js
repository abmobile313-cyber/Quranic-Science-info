'use strict';
/* ===== Business tips: evergreen niche tips (offline) + fresh headlines fetched online per business niche + daily tip notification ===== */
const TIPN=[
 {id:'qs',q:'online Quran learning OR Islamic education OR YouTube creator growth',tips:[
  ['Har course ke liye 1 line ka waada likhein: "8 hafte mein aap ye seekh jayenge". Saaf natija = zyada enrolment.','Write one clear promise per course: "In 8 weeks you will learn X". A clear outcome sells.'],
  ['Purane students ki 2-3 line ki rai (naam ki ijazat ke saath) landing page par sab se upar rakhein.','Put 2-3 line testimonials (with permission) at the top of the landing page.'],
  ['YouTube video ke pehle 15 second mein sawal ya hairat-angez baat rakhein, phir intro.','Open every video with a question or surprising fact in the first 15 seconds, then the intro.'],
  ['Free mini-class/webinar mahine mein ek baar karein; end par seat-limited batch ka elaan.','Run one free mini-class a month; end with the limited-seat batch announcement.'],
  ['Payment ke 24 ghante ke andar WhatsApp par welcome + class ka link bhejein — refund/doubt kam hote hain.','Send a WhatsApp welcome + class link within 24h of payment — fewer refunds and doubts.'],
  ['Ek hi sawal baar-baar aaye to usse chhoti video/FAQ bana dein — support ka waqt bachta hai.','If the same doubt repeats, turn it into a short video/FAQ — saves support time.']]},
 {id:'fs',q:'social media marketing tips OR video editing agency OR Instagram reels growth',tips:[
  ['Har client ke liye pehle 3 din ka free sample reel na dein; 1 paid chhota pilot (₹ kam) dein — serious clients hi aate hain.','Don\'t give free samples; offer a small paid pilot — it filters serious clients.'],
  ['Portfolio mein "pehle/baad" aur natija (views, sales) likhein, sirf video nahi.','Show before/after and results (views, sales) in the portfolio, not just videos.'],
  ['Monthly retainer package banayein (jaise 12 reels + 4 posts); ek-ek kaam ki jagah.','Sell monthly retainers (e.g. 12 reels + 4 posts) rather than one-off jobs.'],
  ['Advance 50% lekar kaam shuru karein; baqi delivery par. Revisions ki hadd (2) likh dein.','Take 50% advance; balance on delivery. Cap revisions at 2 in writing.'],
  ['Templates aur preset banakar rakhein — turnaround tez, margin zyada.','Keep templates and presets — faster turnaround, higher margin.'],
  ['Mahine mein ek baar purane clients ko "kya naya chahiye?" ka message bhejein — repeat kaam sab se sasta hai.','Message past clients monthly — repeat work is the cheapest to win.']]},
 {id:'aa',q:'oud perfume market OR luxury fragrance trends OR Dubai perfume',tips:[
  ['Premium perfume mein kahani bechein: notes, origin, kab lagayein (shaadi/Jumma/raat). Sirf naam nahi.','Sell the story of premium perfume: notes, origin, when to wear it.'],
  ['Sample/decant (5-10 ml) rakhein — mehnge bottle ka bharosa banane ka sab se aasan tareeqa.','Offer 5-10 ml decants — the easiest way to build trust for costly bottles.'],
  ['Gift box aur Eid/shaadi season ke bundle pehle se (6 hafte pehle) tayyar karein.','Prepare gift boxes and Eid/wedding bundles 6 weeks ahead.'],
  ['Dollar-rate/shipping badalne par price list hafte mein ek baar update karein, margin na ghate.','Review USD-based prices weekly so FX/shipping changes don\'t eat margin.'],
  ['Asli hone ka saboot (batch number, original box ki photo) har order ke saath dikhayein.','Show proof of authenticity (batch no., box photos) with every order.'],
  ['Repeat customers ko naye launch ki pehle khabar dein — VIP list WhatsApp par.','Give repeat buyers early access to launches via a WhatsApp VIP list.']]},
 {id:'sk',q:'perfume attar market India OR ecommerce India seller tips',tips:[
  ['Budget perfume mein combo (2-3 bottles) se order ki keemat badhti hai — "2 lo, 1 par chhoot".','Combos (2-3 bottles) raise order value — "buy 2, save on the 3rd".'],
  ['COD order par confirmation call/WhatsApp zaroor karein — wapsi (RTO) 20-30% tak ghat sakti hai.','Confirm COD orders by call/WhatsApp — it can cut RTO noticeably.'],
  ['Product photo mein hath mein bottle + size ka muqabla (coin/hand) dikhayein.','Show the bottle in hand with a size reference in photos.'],
  ['Top 5 bikne wali khushbuon ka stock kabhi khatam na hone dein; baaki kam rakhein.','Never run out of your top 5 sellers; keep the rest lean.'],
  ['Review ke liye delivery ke 3 din baad message bhejein, photo review par chhota discount.','Ask for reviews 3 days after delivery; small discount for photo reviews.'],
  ['Attar ke saath chhota "kaise lagayein" card daalein — tohfa jaisa ehsaas, repeat order.','Add a small "how to apply" card with attar — feels like a gift, drives repeat orders.']]},
 {id:'bn',q:'honey kalonji black seed market OR organic food direct to consumer India OR olive oil',tips:[
  ['Shahad/kalonji mein lab report ya purity test ki photo dikhayein — bharosa sab se bada saaman hai.','Show lab/purity test reports for honey and kalonji — trust is the product.'],
  ['Sunnat foods (shahad, kalonji, zaitoon, khajoor) ka combo "Sunnat Box" banayein, Ramzan se pehle.','Create a "Sunnah foods" combo box ahead of Ramadan.'],
  ['Alag-alag size (250g/500g/1kg) rakhein; chhota size naye customer ko aasani se aazmane deta hai.','Offer several sizes; small packs make trying easy for new buyers.'],
  ['Subscription (har mahine shahad) ka option dein — baar-baar order ki zaroorat nahi.','Offer a monthly subscription for honey and staples.'],
  ['Packing leak-proof rakhein; toot-phoot ek baar bhi hui to review kharab. Shipping ka test khud karein.','Test packaging yourself; one leak ruins a review.'],
  ['Mausam ke hisab se bechein: sardi mein shahad/kalonji, garmi mein sharbat/sabza.','Sell seasonally: honey/kalonji in winter, cooling items in summer.']]},
 {id:'gen',q:'halal business OR Islamic finance OR zakat on business',tips:[
  ['Karobar mein sach bolna aur nuqs bata kar bechna barkat ki jad hai — maal ki khami pehle bata dein.','Be upfront about defects when selling — honesty is the root of barakah.'],
  ['Udhaar ka hisaab likh kar rakhein (Quran 2:282); lene-dene ki tareekh aur raqam dono.','Write down credit dealings (Quran 2:282) — date and amount.'],
  ['Saal ke ek tay din apne karobar ka maal + naqd + len-den jodkar Zakat ka hisaab karein.','Pick a fixed date yearly to total stock + cash + receivables for zakat.'],
  ['Jhooti qasam ya zyada tareef se bachein; waada kiya hua waqt par poora karein.','Avoid exaggerated claims; deliver on promised dates.'],
  ['Mulazimeen ki tankhwah waqt par dein — "pasina sukhne se pehle".','Pay employees on time — "before the sweat dries".'],
  ['Pehle sadqa/khair ka ek hissa nikaal kar phir munafa kharch karein — niyyat taazah rakhein.','Set aside a share for sadaqah first; keep the intention fresh.']]}];
let TIPS=store.get('tips2',{t:0,l:{}}),TV={f:store.get('tipf','all'),busy:false};
const tipDef=id=>TIPN.find(x=>x.id===id);
const tipBiz=id=>id==='gen'?T('Halal karobar','Halal business'):(typeof bdef==='function'&&bdef(id)?bdef(id).name:id);
function tipOfDay(n,d=new Date()){const day=Math.floor(d.getTime()/864e5);const L=n.tips;return L[(day+TIPN.indexOf(n))%L.length]}
async function fetchTips(force){if(TV.busy)return;if(!force&&Date.now()-TIPS.t<6*3600e3&&Object.keys(TIPS.l).length)return;TV.busy=true;const out={};
  await Promise.all(TIPN.map(async n=>{const u='https://news.google.com/rss/search?q='+encodeURIComponent(n.q)+'&hl=en-IN&gl=IN&ceid=IN:en';let items=[];
    try{const j=await fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(u)).then(r=>r.json());if(j.items)items=j.items.map(x=>({t:x.title,l:x.link,d:Date.parse(x.pubDate)||0}))}catch(e){}
    if(!items.length)try{const x=await fetchText('https://api.allorigins.win/raw?url='+encodeURIComponent(u),12000);const doc=new DOMParser().parseFromString(x,'text/xml');items=[...doc.querySelectorAll('item')].map(i=>({t:i.querySelector('title')?.textContent||'',l:i.querySelector('link')?.textContent||'',d:Date.parse(i.querySelector('pubDate')?.textContent)||0}))}catch(e){}
    out[n.id]=items.filter(x=>x.t&&x.l).sort((a,b)=>b.d-a.d).slice(0,12).map(x=>{const k=x.t.lastIndexOf(' - ');return{t:k>10?x.t.slice(0,k):x.t,s:k>10?x.t.slice(k+3):'',l:x.l,d:x.d}})}));
  if(Object.values(out).some(a=>a.length)){TIPS={t:Date.now(),l:out};store.set('tips2',TIPS)}TV.busy=false;if(typeof curTab!=='undefined'&&curTab==='biz'&&typeof rerender==='function'&&!(document.querySelector('#dlg')||{}).open)rerender()}
function tipsCard(){fetchTips();const f=TV.f,ids=f==='all'?TIPN.map(x=>x.id):[f];
  const chips=`<div class="fch" style="padding:6px 0"><button data-a="tipf" data-v="all" class="${f==='all'?'on':''}">${T('Sab','All')}</button>`+TIPN.map(n=>`<button data-a="tipf" data-v="${n.id}" class="${f===n.id?'on':''}">${esc(tipBiz(n.id))}</button>`).join('')+`</div>`;
  const tipsHtml=(f==='all'?TIPN.slice(0,1).concat([]):[tipDef(f)]).filter(Boolean).map(n=>{const t=tipOfDay(n);return`<div class="item"><div class="ic2">💡</div><div class="t"><b>${esc(tipBiz(n.id))}</b><div class="sm">${esc(T(t[0],t[1]))}</div></div></div>`}).join('')||'';
  const dayTip=f==='all'?TIPN.map(n=>{const t=tipOfDay(n);return`<div class="item"><div class="ic2">💡</div><div class="t"><b>${esc(tipBiz(n.id))}</b><div class="sm">${esc(T(t[0],t[1]))}</div></div></div>`}).join(''):tipsHtml;
  const heads=ids.flatMap(id=>(TIPS.l[id]||[]).slice(0,f==='all'?2:8).map(x=>({...x,id}))).sort((a,b)=>b.d-a.d);
  const hh=heads.length?heads.map(x=>`<a class="news" target="_blank" rel="noopener" href="${esc(x.l)}"><b>${esc(x.t)}</b><span class="muted sm">${esc(tipBiz(x.id))} • ${esc(x.s)}${x.d?' • '+whenTxt(x.d):''}</span></a>`).join(''):`<div class="muted sm">${TV.busy?T('Online tips dhundh raha hoon…','Fetching fresh tips…'):T('Online tips abhi nahi mile (internet?). ↻ dabayein.','No online tips yet (internet?). Tap ↻.')}</div>`;
  return`<details class="card" open><summary><b>💡 ${T('Business tips (aapke niche ke hisab se)','Business tips (for your niches)')}</b></summary>${chips}
   <div class="muted sm" style="margin:2px 0 6px">${T('Aaj ke tips','Today\'s tips')}</div>${dayTip}
   <div class="row sp" style="margin-top:10px"><b>${T('Taaza khabrein / trends (online)','Fresh trends (online)')}</b><button class="btn s ghost" data-a="tiprf">↻</button></div>${hh}
   <label class="row" style="gap:8px;margin-top:10px"><input type="checkbox" data-a="tiptog" ${S.tipsOn!==false?'checked':''}> <span class="sm">${T('Roz subah 10 baje "Aaj ka business tip" notification','Daily 10:00 "business tip of the day" notification')}</span></label>
   <div class="muted sm" style="margin-top:6px">${T('Online headlines Google News se aati hain; kaam ki baat apni samajh se parkhein.','Headlines come from Google News; judge them for your own business.')}</div></details>`}
AX.tipf=el=>{TV.f=el.dataset.v;store.set('tipf',TV.f);rerender()};
AX.tiprf=()=>{fetchTips(true);toast(T('Tips taaza kar raha hoon…','Refreshing tips…'));rerender()};
AX.tiptog=el=>{S.tipsOn=!!el.checked;saveS();try{nativeSync()}catch(e){}};
function tipEvents(base){const out=[];if(S.tipsOn===false)return out;const n=TIPN[(Math.floor(base.getTime()/864e5))%(TIPN.length)],t=tipOfDay(n,base),h=(TIPS.l[n.id]||[])[0];
  out.push({k:'tip_d',at:atTime('10:00',base),voice:'tip_'+n.id,title:`💡 ${tipBiz(n.id)} • ${T('Aaj ka tip','Tip of the day')}`,body:(T(t[0],t[1])+(h?' • '+h.t:'')).slice(0,220),tab:'biz',sub:n.id});return out}
setTimeout(()=>{try{fetchTips()}catch(e){}},5000);

/* Maktaba actions (books.js renders the page) */
AX.mkf=el=>{MK.f=el.dataset.v;mkSave();rerender()};
AX.mkst=el=>{const id=el.dataset.id;MK.st[id]=((MK.st[id]||0)+1)%3;mkSave();sfx(MK.st[id]===2?'success':'tick');rerender()};
AX.mkopen=el=>{const v=el.dataset.v;if(v==='duas'){DM.t='book';go('deen','duas')}else{KU.v=v;go('deen','kutub')}};
AX.mkdel=el=>{MK.cu=MK.cu.filter(x=>x.id!==el.dataset.id);delete MK.st[el.dataset.id];mkSave();rerender()};
AX.mkadd=()=>form(T('Apni kitab jodein','Add your own book'),[{k:'n',l:T('Kitab ka naam','Book name'),v:''},{k:'a',l:T('Mussanif (optional)','Author (optional)'),v:''},{k:'c',l:T('Qism','Category'),t:'select',v:'deen',o:Object.entries(MKC).map(([k,v])=>[k,v[1]()])},{k:'l',l:T('Padhne ka link (optional — https://…)','Reading link (optional — https://…)'),v:'',p:'https://'}],
  o=>{if(!o.n.trim()){toast(T('Naam likhein','Enter a name'));return false}const l=/^https?:\/\//i.test(o.l.trim())?o.l.trim():'';MK.cu.push({id:'c'+uid(),n:o.n.trim(),a:o.a.trim(),c:o.c,l});mkSave();toast(T('Kitab jod di ✅','Book added ✅'));rerender()});

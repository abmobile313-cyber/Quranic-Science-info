/* Urdu -> Roman Urdu / Hindi (Devanagari) text converters (dictionary + rules), loaded lazily. Used for Roman Urdu and Hindi modes. */
(function(){
'use strict';
const nrm=s=>s;
const RM={d:null,rev:null,p:null,
  load(){return this.p||(this.p=fetch('q/rdict.json').then(r=>r.json()).then(j=>{this.d=j;return j}).catch(e=>{this.p=null;throw e}))},
  C:{'ب':'b','پ':'p','ت':'t','ٹ':'t','ث':'s','ج':'j','چ':'ch','ح':'h','خ':'kh','د':'d','ڈ':'d','ذ':'z','ر':'r','ڑ':'r','ز':'z','ژ':'zh','س':'s','ش':'sh','ص':'s','ض':'z','ط':'t','ظ':'z','غ':'gh','ف':'f','ق':'q','ک':'k','گ':'g','ل':'l','م':'m','ن':'n','ں':'n'},
  ASP:{'ب':'bh','پ':'ph','ت':'th','ٹ':'th','ج':'jh','چ':'chh','د':'dh','ڈ':'dh','ڑ':'rh','ک':'kh','گ':'gh'},
  fb(w){const C=this.C,A=this.ASP;w=w.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'');let o=[],L=w.length;
    for(let i=0;i<L;i++){const c=w[i],nx=w[i+1]||'';
      if(A[c]&&nx==='ھ'){o.push(A[c]);i++;continue}
      if(c==='آ')o.push('aa');else if(c==='ا')o.push('a');else if(c==='و')o.push(i>0?'o':'w');else if(c==='ی'||c==='ئ')o.push(i>0&&i<L-1?'i':i===0?'y':'i');else if(c==='ے')o.push('e');else if(c==='ہ')o.push(i===L-1&&i>0?'a':'h');else if(c==='ع'||c==='ء')o.push('');else if(C[c])o.push(C[c]);else o.push(c.charCodeAt(0)<128?c:'')}
    {const r=o.filter(x=>x!==''),isV=x=>'aeiou'.includes(x[x.length-1]);let q='';for(let k=0;k<r.length;k++){q+=r[k];if(!isV(r[k])&&k+2<r.length&&!isV(r[k+1])&&(k===0||isV(r[k-1])))q+='a'}o=[q]}let s=o.join('');if(!/[aeiou]/.test(s)&&s.length>1)s=s.replace(/([^aeiou])(?=[^aeiou]|$)/g,(m,a,off)=>off<3?a+'a':a);return s},
  fix(s){return s.replace(/ك/g,'ک').replace(/[يى]/g,'ی').replace(/ه/g,'ہ').replace(/ة/g,'ہ').replace(/ھ/g,'ھ')},
  conv(text){if(!this.d)return text;const D=this.d;const PUN=/[،؛؟۔‌‍‎‏"“”‘’\[\]{}:;,.!?\-–—…()]/g;
    const out=text.split(/\s+/).filter(Boolean).map(tok=>{const core=this.fix(tok.replace(PUN,'').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,''));if(!core)return tok.replace(/،/g,',').replace(/۔/g,'.').replace(/؟/g,'?');
      let r=D[core];if(r==null)r=D[core.replace(/ہ$/,'ہ')]??this.fb(core);
      const suf=(tok.match(/[،؛؟۔!?.:;]+$/)||[''])[0].replace(/،/g,',').replace(/۔/g,'.').replace(/؟/g,'?').replace(/؛/g,';');return r+suf});
    let s=out.join(' ');return s.replace(/(^|[.?!]\s)([a-z])/g,(m,a,b)=>a+b.toUpperCase())},
  /* reverse index: roman word → urdu words (normalized) */
  reverse(){if(this.rev||!this.d)return this.rev||{};const r={};for(const u in this.d){const k=this.d[u].toLowerCase().replace(/[^a-z]/g,'');if(k)(r[k]=r[k]||[]).push(nrm(u))}this.rev=r;return r}};
const DVC=new Map();
/* Urdu script → Devanagari: dictionary (dv-ur.json, ~1500 most common words of Taqi Usmani's tarjuma + Hayatus Sahaba) + letter rules for the rest */
let DVU=null,DVUP=null;const dvuLoad=()=>DVU?Promise.resolve(DVU):(DVUP||(DVUP=fetch('q/dv-ur.json').then(r=>r.json()).then(d=>DVU=d).catch(()=>DVU={})));
const UL={'ب':'ब','پ':'प','ت':'त','ٹ':'ट','ث':'स','ج':'ज','چ':'च','ح':'ह','خ':'ख़','د':'द','ڈ':'ड','ذ':'ज़','ر':'र','ڑ':'ड़','ز':'ज़','ژ':'झ़','س':'स','ش':'श','ص':'स','ض':'ज़','ط':'त','ظ':'ज़','غ':'ग़','ف':'फ़','ق':'क़','ک':'क','ك':'क','گ':'ग','ل':'ल','م':'म','ن':'न','ں':'ँ','ہ':'ह','ھ':'ह','ه':'ह','ء':'','ع':'','ا':'','آ':'आ','ی':'ी','ي':'ी','ے':'े','و':'ो','ئ':'ई','ؤ':'ऊ','ة':'त','ى':'ा','ۂ':'-ए','ۓ':'ए','ٰ':'ा'};
const UMK={'ؓ':' रज़ि.','ؐ':' ﷺ','ؒ':' रह.','ؑ':' अलैहिस्सलाम','ؔ':''};
const UASP={'ب':'भ','پ':'फ','ت':'थ','ٹ':'ठ','ج':'झ','چ':'छ','د':'ध','ڈ':'ढ','ک':'ख','گ':'घ','ڑ':'ढ़'};
const UDIG={'۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
function dvUrWord(w){
  if(/[ً-ْٰٕٓٔ]/.test(w))return w; /* Arabic with harakat (ayat) stays Arabic */
  let mk='';w=w.replace(/[ؓ-ؔؐ-ؒؕ]/g,m=>{mk+=UMK[m]||'';return''});
  const base=w.replace(/[ؓؐؒؑؔ]/g,m=>{mk+=UMK[m]||'';return''});
  if(DVU&&DVU[base])return DVU[base]+mk;
  if(DVU){const v=[base.replace(/ھ/g,'ہ'),base.replace(/ئے$/,'ے'),base.replace(/ئیے$/,'یے'),base.replace(/یٰ$/,'ی'),base.replace(/[ٰ]/g,'')];for(const x of v){if(x!==base&&DVU[x])return DVU[x]+mk}
    const m=/^(.+?)(وں|یں|ے|ی|ا)$/.exec(base);if(m&&DVU[m[1]+'ہ']&&m[2]==='ے')return DVU[m[1]+'ہ'].replace(/ा$/,'े')+mk}
  if(DVU&&DVU[base+'ؓ']&&!mk)return DVU[base+'ؓ'];
  /* letter rules */
  const L=[...base];let o='';const isV=c=>'اآیيےوئؤى'.includes(c);
  for(let i=0;i<L.length;i++){const c=L[i],nx=L[i+1],pv=L[i-1];
    if(c==='ا'){if(i===0){o+=(nx==='ی'||nx==='ي')?'ई':(nx==='و')?'ऊ':(nx==='ے')?'ए':'अ';if(nx==='ی'||nx==='ي'||nx==='و'||nx==='ے')i++;}else if(/[\u0915-\u0939\u0958-\u095f\u093c]$/.test(o))o+='ा';else o+='अ';continue}
    if(c==='آ'){o+='आ';continue}
    if(c==='ھ'){const a=UASP[pv];if(a&&o.endsWith(UL[pv])){o=o.slice(0,-UL[pv].length)+a}else o+='ह';continue}
    if(c==='ی'||c==='ي'){if(i===0)o+='य';else if(i===L.length-1)o+='ी';else if(nx&&isV(nx))o+='य';else o+='ी';continue}
    if(c==='ے'){o+=i===0?'ए':'े';continue}
    if(c==='و'){if(i===0)o+='व';else if((pv&&isV(pv))||(nx&&isV(nx)))o+='व';else o+='ो';continue}
    if(c==='ہ'||c==='ه'){if(i===L.length-1&&i>0&&!isV(pv))o+='ा';else o+='ह';continue}
    if(c==='ع'){if(i===0){if(nx==='ا'){o+='आ';i++}else if(nx==='ی'||nx==='ے'||nx==='و'){}else o+='अ'}continue}
    if(c==='ئ'){if(nx==='ی'||nx==='ي'){o+='ई';i++}else if(nx==='ے'){o+='ए';i++}else if(nx==='و'){o+='ओ';i++}else o+='ई';continue}
    if(c==='ء'){o+='';continue}
    if(c==='ں'){o+='ँ';continue}
    const d=UL[c];if(d==null){o+=c;continue}
    o+=d;
    /* consonant followed by consonant in the middle: inherent 'a' (no halant) — readable approximation */
  }
  return o+mk}
function urToDv(t){if(!t)return t;let r=DVC.get(t);if(r!=null)return r;
  try{r=t.replace(/[؀-ۿ]+/g,w=>{let pre='',post='';const m=/^([،؛؟۔ـ\s]*)(.*?)([،؛؟۔ـ\s]*)$/.exec(w);if(m){pre=m[1];w=m[2];post=m[3]}
    const pn=s=>s.replace(/۔/g,'।').replace(/،/g,',').replace(/؟/g,'?').replace(/؛/g,';');
    if(!w)return pn(pre+post);if(/^[٠-٩۰-۹]+$/.test(w))return pn(pre)+[...w].map(c=>UDIG[c]||c).join('')+pn(post);
    return pn(pre)+dvUrWord(w)+pn(post)})}catch(e){r=t}
  if(DVC.size>4000)DVC.clear();DVC.set(t,r);return r}
if(typeof window!=='undefined')try{if((window.S||{}).lang==='hi')dvuLoad()}catch(e){}
window.FahmConv={
  ready:null,
  load(){return this.ready||(this.ready=Promise.all([RM.load(),dvuLoad()]).then(()=>true).catch(e=>{this.ready=null;return false}))},
  roman(t){if(!t)return t;if(!RM.d)return t;const r=RM.conv(t);return r},
  dev(t){if(!t)return t;return DVU?urToDv(t):t},
  ok(){return !!(RM.d&&DVU)}
};
})();

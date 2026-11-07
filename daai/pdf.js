'use strict';
/* ===== Tiny offline PDF writer (A4, Helvetica, text/rect/line/JPEG) + save/share ===== */
const PDFW=(()=>{
const HW=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const clean=s=>String(s==null?'':s).normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x20-\x7e]/g,'');
const esc=s=>clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
const tw=(s,sz,b)=>{let w=0;for(const ch of clean(s)){const c=ch.charCodeAt(0)-32;w+=(HW[c]||556)}return w*sz/1000*(b?1.06:1)};
const col=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||'#000000');const n=parseInt(m?m[1]:'000000',16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255].map(x=>x.toFixed(3)).join(' ')};
class Doc{
 constructor(){this.pages=[];this.imgs=[];this.W=595;this.H=842;this.add()}
 add(){this.cur=[];this.pages.push({c:this.cur,im:[]});return this}
 y(t){return this.H-t}
 text(x,top,s,sz=10,o={}){const w=tw(s,sz,o.b);if(o.align==='r')x-=w;else if(o.align==='c')x-=w/2;this.cur.push(`BT /${o.b?'F2':'F1'} ${sz} Tf ${col(o.c||'#111111')} rg ${x.toFixed(1)} ${this.y(top+sz*0.8).toFixed(1)} Td (${esc(s)}) Tj ET`);return w}
 rect(x,top,w,h,fill,stroke){let op='';if(fill)this.cur.push(`${col(fill)} rg`);if(stroke)this.cur.push(`${col(stroke)} RG 0.6 w`);this.cur.push(`${x.toFixed(1)} ${this.y(top+h).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re ${fill&&stroke?'B':fill?'f':'S'}`)}
 line(x1,t1,x2,t2,c,w=0.6){this.cur.push(`${col(c||'#cccccc')} RG ${w} w ${x1.toFixed(1)} ${this.y(t1).toFixed(1)} m ${x2.toFixed(1)} ${this.y(t2).toFixed(1)} l S`)}
 image(jpgDataUrl,x,top,w,h){const b=jpgDataUrl.split(',')[1];if(!b)return;const bin=atob(b),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  let pw=0,ph=0;for(let i=2;i<u.length-9;){if(u[i]!==255){i++;continue}const m=u[i+1];if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC){ph=u[i+5]<<8|u[i+6];pw=u[i+7]<<8|u[i+8];break}i+=2+(u[i+2]<<8|u[i+3])}
  if(!pw)return;const id=this.imgs.length;this.imgs.push({u,pw,ph});const pg=this.pages[this.pages.length-1];pg.im.push(id);
  this.cur.push(`q ${w.toFixed(1)} 0 0 ${h.toFixed(1)} ${x.toFixed(1)} ${this.y(top+h).toFixed(1)} cm /Im${id} Do Q`)}
 build(){const enc=s=>{const a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i)&255;return a};const parts=[],off=[];let len=0;
  const push=b=>{if(typeof b==='string')b=enc(b);parts.push(b);len+=b.length};
  const obj=(n,body)=>{off[n]=len;push(n+' 0 obj\n');if(body instanceof Uint8Array||typeof body==='string')push(body);else body.forEach(push);push('\nendobj\n')};
  push('%PDF-1.4\n');
  const np=this.pages.length,fontObj=3,imgBase=5+np*2;
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  obj(2,'<< /Type /Pages /Kids ['+this.pages.map((_,i)=>(5+i*2)+' 0 R').join(' ')+'] /Count '+np+' >>');
  obj(3,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  obj(4,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  this.pages.forEach((p,i)=>{const pn=5+i*2,cn=pn+1,st=p.c.join('\n');
   obj(pn,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << ${p.im.map(k=>`/Im${k} ${imgBase+k} 0 R`).join(' ')} >> >> /Contents ${cn} 0 R >>`);
   obj(cn,`<< /Length ${st.length} >>\nstream\n${st}\nendstream`)});
  this.imgs.forEach((im,k)=>{const n=imgBase+k;off[n]=len;push(`${n} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${im.pw} /Height ${im.ph} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.u.length} >>\nstream\n`);push(im.u);push('\nendstream\nendobj\n')});
  const total=imgBase+this.imgs.length,xr=len;let x=`xref\n0 ${total}\n0000000000 65535 f \n`;for(let i=1;i<total;i++)x+=String(off[i]).padStart(10,'0')+' 00000 n \n';
  push(x+`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);
  const out=new Uint8Array(len);let p=0;parts.forEach(b=>{out.set(b,p);p+=b.length});return out}
}
const b64=u=>{let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
function save(name,doc){const u=doc.build();
  if(window.AndroidPA&&AndroidPA.savePdf){window.pdfSaved=ok=>toast(ok?T('PDF save ho gayi ✅ — ab bhejne ka option khulega','PDF saved ✅ — share sheet opening'):T('PDF save nahi hui','PDF not saved'));AndroidPA.savePdf(name,b64(u));return}
  const blob=new Blob([u],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);toast(T('PDF download ho rahi hai ✅','PDF downloading ✅'))}
return{Doc,tw,save,clean}})();
/* company logo (picked once from the phone gallery, stored on the device) */
const LOGO={get(){try{return localStorage.getItem('co_logo')||''}catch(e){return''}},set(v){try{if(v)localStorage.setItem('co_logo',v);else localStorage.removeItem('co_logo')}catch(e){}}};
function logoPick(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,500/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));const x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);LOGO.set(c.toDataURL('image/jpeg',.9));toast(T('Logo lag gaya ✅','Logo set ✅'));cb&&cb()};im.src=r.result};r.readAsDataURL(f)};i.click()}

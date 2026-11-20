/* Real-time 3D Earth (WebGL, same shader as the Quranic Science website). window.FahmGlobe.mount(canvas) */
(function () {
'use strict';
const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;varying vec2 v;uniform sampler2D T,Cl,Nt;uniform float yaw,pitch,tm,R;uniform vec2 asp;uniform vec3 glow;
  void main(){vec2 p=(v*2.-1.)*asp;vec2 q=p/R;float d=length(q);
   if(d>1.){float g=exp(-(d-1.)*7.)*.9;gl_FragColor=vec4(glow*g,g);return;}
   float z=sqrt(max(0.,1.-d*d));vec3 n=vec3(q,z);
   float cp=cos(pitch),sp=sin(pitch),cy=cos(yaw),sy=sin(yaw);
   float wy=n.y*cp+n.z*sp,z1=-n.y*sp+n.z*cp,wx=n.x*cy-z1*sy,wz=n.x*sy+z1*cy;
   float lat=asin(clamp(wy,-1.,1.)),lon=atan(wx,wz);
   vec2 uv=vec2((lon+3.14159265)/6.2831853,(1.5707963-lat)/3.14159265);
   vec4 t=vec4(texture2D(T,uv).rgb,texture2D(Cl,uv).g);float c=texture2D(Cl,vec2(fract(uv.x+tm*.0035),uv.y)).r;
   vec3 L=normalize(vec3(-.5,.42,.76));float dif=max(dot(n,L),0.);float lit=.14+dif*1.05;
   vec3 col=t.rgb*lit;
   vec3 H=normalize(L+vec3(0.,0.,1.));col+=vec3(.85,.92,1.)*pow(max(dot(n,H),0.),40.)*t.a*.55;
   col=mix(col,vec3(1.)*(.2+dif*.95),c*.8);
   float night=smoothstep(.15,-.25,dot(n,L));col=mix(col,col*vec3(.35,.45,.65),night*.6);vec3 nl=texture2D(Nt,uv).rgb;col+=nl*nl*vec3(1.,.82,.55)*night*1.6*(1.-c*.75);
   float rim=pow(1.-z,2.5);col+=glow*rim*1.1+vec3(.5,.7,1.)*rim*.25;
   float a=smoothstep(1.,.985,d);gl_FragColor=vec4(col*a,a);}`;
function mount(cv) {
  let gl = null; try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true }); } catch (e) { }
  if (!gl) return null;
  const sh = (ty, src) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('sh'); return s; };
  let pr; try { pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null; } catch (e) { return null; }
  gl.useProgram(pr);
  const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const ap = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const tex = (unit, src) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    if (src instanceof Image) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); };
  tex(0, new Uint8Array([10, 40, 90])); tex(1, new Uint8Array([0, 0, 0])); tex(2, new Uint8Array([0, 0, 0]));
  gl.uniform1i(U('T'), 0); gl.uniform1i(U('Cl'), 1); gl.uniform1i(U('Nt'), 2);
  let ok = false; const im = (s) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = s; });
  Promise.all([im('icons/earth-tex.jpg'), im('icons/earth-aux.png')]).then(([a, b]) => { tex(0, a); tex(1, b); ok = true; }).catch(() => { });
  let yaw = 1.2, pitch = .32, vel = .22, raf = 0, last = performance.now(), drag = null, dead = false;
  const down = e => { drag = { x: e.clientX, y: e.clientY, yaw, pitch }; vel = 0; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); };
  const move = e => { if (!drag) return; yaw = drag.yaw - (e.clientX - drag.x) * .008; pitch = Math.max(-.7, Math.min(.9, drag.pitch + (e.clientY - drag.y) * .006)); };
  const up = () => { drag = null; vel = .22; };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  function frame(now) {
    if (dead) return; raf = requestAnimationFrame(frame); const dt = Math.min(.05, (now - last) / 1000); last = now; yaw += vel * dt;
    const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1), w = Math.round(r.width * d), h = Math.round(r.height * d); if (!w || !h) return;
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    if (!ok) return; const m = Math.min(w, h);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U('asp'), w / m, h / m); gl.uniform1f(U('R'), .8); gl.uniform1f(U('yaw'), yaw); gl.uniform1f(U('pitch'), pitch); gl.uniform1f(U('tm'), now / 1000); gl.uniform3f(U('glow'), .25, .75, .95);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  raf = requestAnimationFrame(frame);
  return { stop() { dead = true; cancelAnimationFrame(raf); }, spin(a) { yaw += a; } };
}
window.FahmGlobe = { mount };
})();

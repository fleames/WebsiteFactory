// GLSL fragment shaders — one per animated-bg effect
const FRAGS: Record<string, string> = {
  aurora: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.+.5;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.12;
  vec2 q=vec2(fbm(uv*2.+t),fbm(uv*2.+vec2(1.7,9.2)+t));
  float f=fbm(uv*3.+2.*q+t*.5);
  vec3 c=mix(vec3(.02,.02,.08),u_brand,clamp(f*f*2.2,0.,1.));
  c=mix(c,vec3(.03,.1,.22),f*.35);
  gl_FragColor=vec4(c,1.);}`,

  cyber_grid: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;uv.y=1.-uv.y;
  vec2 p=uv;p.y=p.y*p.y*1.4;float t=u_t*.35;
  vec2 gp=p*vec2(14.,24.)+vec2(0.,t);
  vec2 gf=fract(gp);
  float line=max(step(.93,gf.x),step(.93,gf.y));
  float glow=exp(-min(gf.x,1.-gf.x)*18.)+exp(-min(gf.y,1.-gf.y)*18.);
  vec3 col=vec3(.01,.01,.04);
  col+=u_brand*line*.75;col+=u_brand*glow*.12;
  col=mix(col,vec3(.005,.005,.015),smoothstep(.5,.1,uv.y)*.8);
  gl_FragColor=vec4(col,1.);}`,

  noise_flow: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.1;
  vec2 w=vec2(n(uv*3.+t),n(uv*3.+vec2(5.2,1.3)+t));
  float v=n(uv*2.+w*1.6+t*.6);
  vec3 c=mix(vec3(.03,.03,.09),u_brand*.55,smoothstep(.2,.65,v));
  c=mix(c,u_brand,smoothstep(.65,.95,v));
  gl_FragColor=vec4(c,1.);}`,

  geometric: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y);
  float t=u_t*.35,r=length(uv);float rings=0.;
  for(int i=0;i<6;i++){float fi=float(i);rings+=.005/(abs(r-fi*.15-.08-sin(t+fi*1.3)*.04)+.001);}
  vec3 col=vec3(.02,.02,.05)+u_brand*rings*(1.-smoothstep(.35,.75,r));
  gl_FragColor=vec4(col,1.);}`,

  wave_grid: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.5;
  float wx=uv.x+sin(uv.y*8.+t)*.05;
  float wy=uv.y+sin(uv.x*6.+t*.7)*.04;
  vec2 gf=fract(vec2(wx,wy)*15.);
  float line=max(smoothstep(.92,1.,gf.x),smoothstep(.92,1.,gf.y));
  vec3 col=vec3(.02,.02,.06)+u_brand*line*.45*(1.-uv.y*.55);
  gl_FragColor=vec4(col,1.);}`,

  starfield: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;vec3 col=vec3(.005,.005,.012);
  for(int i=0;i<3;i++){
    float fi=float(i)+1.;
    vec2 grid=floor(uv*u_res/fi/10.);
    vec2 cell=fract(uv*u_res/fi/10.);
    float sz=h21(grid+vec2(2.,0.))*.7+.2;
    float d=length(cell-vec2(h21(grid),h21(grid+vec2(1.,0.))));
    col+=vec3(sz*.0015/(d*d+.0003));
  }
  float cx=length(uv-vec2(.5,.38));
  col+=u_brand*.18*exp(-cx*cx*9.)+u_brand*.06*exp(-cx*cx*2.5);
  gl_FragColor=vec4(col,1.);}`,

  plasma: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.4;
  float v=sin(uv.x*10.+t)+sin(uv.y*8.+t*.8);
  v+=sin(sqrt(dot(uv-vec2(.5),uv-vec2(.5)))*12.-t*1.5);
  v+=cos(uv.x*6.+uv.y*7.+t*.6);
  v=v*.25+.5;
  vec3 col=mix(vec3(.02,.01,.08),u_brand,smoothstep(.3,.65,v));
  col=mix(col,vec3(.01,.0,.05),smoothstep(.65,.9,v));
  gl_FragColor=vec4(col,1.);}`,

  hex_grid: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
vec2 hexGv(vec2 p){vec2 s=vec2(1.,1.732);vec2 a=mod(p,s)-s*.5;vec2 b=mod(p+s*.5,s)-s*.5;return dot(a,a)<dot(b,b)?a:b;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.35;
  vec2 gv=hexGv(uv*14.);float d=length(gv);
  float wave=sin(length(uv-vec2(.5))*10.-t*2.)*.5+.5;
  float pulse=smoothstep(.46,.42,d);
  float glow=exp(-d*d*10.)*.5;
  vec3 col=vec3(.01,.01,.04)+u_brand*(pulse*(wave*.35+.55)+glow*.35);
  gl_FragColor=vec4(col,1.);}`,

  vortex: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y);
  float t=u_t*.5;float r=length(uv);
  float a=atan(uv.y,uv.x)+r*6.-t*2.;
  float arms=(sin(a*3.)*.5+.5)*exp(-r*r*2.5)*1.8;
  float swirl=(sin(r*18.-t*5.)*.5+.5)*exp(-r*r*4.)*.3;
  float core=exp(-r*r*15.)*.6;
  vec3 col=vec3(.01,.01,.04)+u_brand*clamp(arms+swirl+core,0.,1.);
  gl_FragColor=vec4(col,1.);}`,

  neon_pulse: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.7;
  float r=length(uv-vec2(.5));float rings=0.;
  for(int i=0;i<6;i++){
    float fi=float(i);float ph=mod(t*.65+fi*.22,1.4);
    rings+=exp(-abs(r-ph*.9)*60.)*(1.-ph*.55)*.85;
  }
  vec3 col=vec3(.01,.01,.04)+u_brand*min(rings,1.)*1.1;
  gl_FragColor=vec4(col,1.);}`,

  matrix_rain: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(float v){return fract(sin(v)*43758.5);}
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.9;
  float col=floor(uv.x*36.);float spd=h(col)*.6+.4;float off=h(col+.5);
  float y=fract(uv.y-t*spd-off);
  float trail=exp(-y*8.)*h2(vec2(col,floor(uv.y*3.+off*7.)));
  float head=(1.-smoothstep(0.,.03,y))*h2(vec2(col,floor(t*spd*2.+off*9.)));
  vec3 c=vec3(.01,.015,.02)+u_brand*(trail*.6+head*1.4);
  gl_FragColor=vec4(c,1.);}`,

  fire: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.9;
  vec2 q=uv+vec2(0.,t*.5);
  float fire=n(q*vec2(3.,4.))*.6+n(q*vec2(6.,8.))*.3+n(q*vec2(12.,16.))*.1;
  fire=max(0.,fire-pow(uv.y,1.1)*1.3);
  vec3 dark=vec3(.01,.005,.005);
  vec3 col=mix(dark,u_brand,smoothstep(.0,.3,fire));
  col=mix(col,min(u_brand*1.8+vec3(.25,.15,.0),vec3(1.)),smoothstep(.3,.75,fire));
  gl_FragColor=vec4(col,1.);}`,

  circuit: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t;
  vec2 p=uv*vec2(20.,15.);vec2 cell=floor(p);vec2 fv=fract(p)-.5;
  float rnd=h(cell);
  float seg=rnd>.5?max(0.,1.-abs(fv.y)*18.):max(0.,1.-abs(fv.x)*18.);
  float via=1.-smoothstep(.07,.12,length(fv));
  float signal=sin(dot(cell,vec2(.4,.3))-t*2.5)*.5+.5;
  vec3 col=vec3(.01,.015,.025)+u_brand*max(seg*.7,via)*(signal*.4+.55);
  gl_FragColor=vec4(col,1.);}`,

  galaxy: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
void main(){
  vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y);
  float t=u_t*.12;float r=length(uv);float a=atan(uv.y,uv.x);
  float arms=0.;
  for(int i=0;i<2;i++){float ai=a+float(i)*3.14159+t+r*7.;arms+=exp(-pow(mod(ai,6.283)-3.14159,2.)*2.);}
  arms*=exp(-r*r*3.5)*.9;float core=exp(-r*r*30.)*.7;
  float star=step(.975,h(floor(gl_FragCoord.xy/5.)))*h(floor(gl_FragCoord.xy/5.)+vec2(3.,7.))*.5;
  vec3 col=vec3(.005,.005,.01)+u_brand*(arms+core)+vec3(star);
  gl_FragColor=vec4(col,1.);}`,

  ripple: `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float rp(vec2 uv,vec2 o,float s,float f,float ph){float r=length(uv-o);return(sin(r*f-u_t*s+ph)*.5+.5)*exp(-r*r*7.);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float v=rp(uv,vec2(.5,.42),4.,30.,0.)+rp(uv,vec2(.25,.7),3.2,24.,1.2)+rp(uv,vec2(.75,.3),4.8,22.,2.5);
  v=clamp(v*.45,0.,.7);
  vec3 col=vec3(.01,.02,.04)+u_brand*v*.8;
  gl_FragColor=vec4(col,1.);}`,
};

// Canvas 2D effects (fallback for WebGL-free environments / simpler effects)
const CANVAS2D: Record<string, string> = {
  particles: `(function(cv){
var W=cv.width=cv.offsetWidth||1280,H=cv.height=cv.offsetHeight||700;
var ctx=cv.getContext('2d');
var brand=getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()||'#3B82F6';
var rgb=getComputedStyle(document.documentElement).getPropertyValue('--brand-rgb').trim()||'59,130,246';
var pts=[];for(var i=0;i<65;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4});
ctx.fillStyle='rgb(4,4,16)';ctx.fillRect(0,0,W,H);
!function draw(){
  ctx.fillStyle='rgba(4,4,16,.1)';ctx.fillRect(0,0,W,H);
  for(var i=0;i<pts.length;i++){
    pts[i].x+=pts[i].vx;pts[i].y+=pts[i].vy;
    if(pts[i].x<0||pts[i].x>W)pts[i].vx*=-1;
    if(pts[i].y<0||pts[i].y>H)pts[i].vy*=-1;
    ctx.beginPath();ctx.arc(pts[i].x,pts[i].y,1.5,0,6.283);ctx.fillStyle=brand;ctx.fill();
    for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
      ctx.strokeStyle='rgba('+rgb+','+(1-d/120)*.25+')';ctx.lineWidth=.5;ctx.stroke();}
    }
  }
  requestAnimationFrame(draw);
}();
})(canvas)`,
};

// WebGL vertex shader: fullscreen triangle trick (3 vertices covering entire viewport)
const VERT = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}';

export function animatedBgScript(): string {
  return `(function(){
var FRAGS=${JSON.stringify(FRAGS)};
var C2D=${JSON.stringify(CANVAS2D)};
var VERT=${JSON.stringify(VERT)};
function hexVec3(h){var c=h.replace('#','');return[parseInt(c.slice(0,2),16)/255,parseInt(c.slice(2,4),16)/255,parseInt(c.slice(4,6),16)/255];}
function initGL(cv,fx){
  var gl=cv.getContext('webgl',{antialias:false,alpha:false,depth:false});
  if(!gl||!FRAGS[fx])return false;
  var brand=getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()||'#3B82F6';
  var bv=hexVec3(brand);
  function mkS(t,s){var sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}
  var pr=gl.createProgram();
  gl.attachShader(pr,mkS(gl.VERTEX_SHADER,VERT));
  gl.attachShader(pr,mkS(gl.FRAGMENT_SHADER,FRAGS[fx]));
  gl.linkProgram(pr);gl.useProgram(pr);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var ap=gl.getAttribLocation(pr,'a_pos');
  gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
  var uT=gl.getUniformLocation(pr,'u_t'),uR=gl.getUniformLocation(pr,'u_res'),uB=gl.getUniformLocation(pr,'u_brand');
  var t0=performance.now();
  !function frame(){
    var w=cv.offsetWidth||1,h=cv.offsetHeight||1;
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    gl.viewport(0,0,w,h);
    gl.uniform1f(uT,(performance.now()-t0)/1000);
    gl.uniform2f(uR,w,h);gl.uniform3fv(uB,bv);
    gl.drawArrays(gl.TRIANGLES,0,3);
    requestAnimationFrame(frame);
  }();
  return true;
}
function initC2D(cv,fx){(new Function('canvas',C2D[fx]))(cv);}
document.querySelectorAll('canvas[data-animated-bg]').forEach(function(cv){
  var fx=cv.getAttribute('data-animated-bg');if(!fx)return;
  if(C2D[fx])initC2D(cv,fx);else initGL(cv,fx);
});
// Immersive fixed-bg canvas (page-level, position:fixed, never scrolls)
var _imm=document.querySelector('canvas[data-immersive-bg]');
if(_imm){var _immFx=_imm.getAttribute('data-immersive-bg');if(_immFx){if(C2D[_immFx])initC2D(_imm,_immFx);else if(FRAGS[_immFx])initGL(_imm,_immFx);}}
})();`;
}

// ── Mouse effects ────────────────────────────────────────────────────────────

import type { MouseEffects } from '../schema/types.js';

export function mouseDefaults(): Required<MouseEffects> {
  return {
    cursor: true,
    cursorDotSize: 7, cursorDotColor: '#ffffff', cursorDotBlend: 'difference',
    cursorRing: true, cursorRingSize: 36, cursorRingColor: '#ffffff', cursorRingOpacity: 0.45,
    cursorRingWidth: 1.5, cursorRingLag: 0.13,
    cursorGlow: true, cursorGlowSize: 700, cursorGlowOpacity: 0.06, cursorGlowColor: 'brand', cursorGlowLag: 0.055,
    cursorHoverExpand: true, cursorHoverScale: 2,
    trail: false, trailStyle: 'dots', trailCount: 12, trailSize: 4, trailColor: 'brand',
    trailOpacity: 0.7, trailLifetime: 600, trailBlend: 'screen',
    clickBurst: false, burstCount: 10, burstRadius: 70, burstColor: 'brand', burstGravity: 0.15, burstSize: 5,
    grain: true, grainOpacity: 0.03, grainFps: 12, grainScale: 1,
    scrollBar: true, scrollBarHeight: 3, scrollBarColor: 'brand', scrollBarGlow: true,
    magnetic: true, magneticStrength: 0.12, magneticSelector: '.btn-primary,.btn-lg',
  };
}

function hexToRgbTriplet(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '59,130,246';
}

export function landingPageScript(mouseCfg?: Partial<MouseEffects>): string {
  const D = mouseDefaults();
  const m: Required<MouseEffects> = { ...D, ...mouseCfg };

  // Emits either the JS variable _brand or a quoted hex string
  function col(v: string): string { return v === 'brand' ? '_brand' : JSON.stringify(v); }
  // CSS rgba value (for style.cssText) — brand uses CSS var, hex is inline
  function rgbaCss(v: string, a: number): string {
    return v === 'brand'
      ? `rgba(var(--brand-rgb,59,130,246),${a})`
      : `rgba(${hexToRgbTriplet(v)},${a})`;
  }

  const parts: string[] = [];
  parts.push(`(function(){`);
  parts.push(`var _brand=getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()||'#3B82F6';`);

  // ── Scroll progress bar ────────────────────────────────────────────────────
  if (m.scrollBar) {
    const bg = m.scrollBarColor === 'brand'
      ? `linear-gradient(90deg,var(--brand),var(--brand-dark,var(--brand)))`
      : m.scrollBarColor;
    const shadow = m.scrollBarGlow
      ? (m.scrollBarColor === 'brand' ? `box-shadow:0 0 10px var(--brand);` : `box-shadow:0 0 10px ${m.scrollBarColor};`)
      : '';
    parts.push(`
var _bar=document.createElement('div');
_bar.style.cssText='position:fixed;top:0;left:0;height:${m.scrollBarHeight}px;width:0;z-index:9999;background:${bg};pointer-events:none;${shadow}';
document.body.appendChild(_bar);
window.addEventListener('scroll',function(){var _s=document.documentElement.scrollTop,_h=document.documentElement.scrollHeight-window.innerHeight;_bar.style.width=(_h>0?Math.min(_s/_h*100,100):0)+'%';},{passive:true});`);
  }

  // ── Film grain ─────────────────────────────────────────────────────────────
  if (m.grain) {
    const iv = Math.round(1000 / m.grainFps);
    const scaled = m.grainScale > 1;
    const sizeCode = scaled
      ? `_gc.width=Math.ceil(innerWidth/${m.grainScale});_gc.height=Math.ceil(innerHeight/${m.grainScale});`
      : `_gc.width=innerWidth;_gc.height=innerHeight;`;
    const scaleStyle = scaled ? `width:100%;height:100%;image-rendering:pixelated;` : ``;
    parts.push(`
var _gc=document.createElement('canvas');
_gc.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;opacity:${m.grainOpacity};${scaleStyle}';
document.body.appendChild(_gc);
function _dg(){${sizeCode}var _gx=_gc.getContext('2d'),_gd=_gx.createImageData(_gc.width,_gc.height);for(var _gi=0;_gi<_gd.data.length;_gi+=4){var _v=Math.random()*255|0;_gd.data[_gi]=_gd.data[_gi+1]=_gd.data[_gi+2]=_v;_gd.data[_gi+3]=255;}_gx.putImageData(_gd,0,0);}
_dg();setInterval(_dg,${iv});window.addEventListener('resize',_dg,{passive:true});`);
  }

  // ── Mouse trail ────────────────────────────────────────────────────────────
  if (m.trail) {
    if (m.trailStyle === 'ribbon') {
      parts.push(`
var _rc=document.createElement('canvas');
_rc.style.cssText='position:fixed;inset:0;z-index:9997;pointer-events:none;';
document.body.appendChild(_rc);var _rx=_rc.getContext('2d'),_rpts=[];
document.addEventListener('mousemove',function(e){_rpts.push({x:e.clientX,y:e.clientY,t:Date.now()});if(_rpts.length>${m.trailCount * 4})_rpts.shift();});
!function _rDraw(){_rc.width=window.innerWidth;_rc.height=window.innerHeight;_rx.clearRect(0,0,_rc.width,_rc.height);
var _now=Date.now();_rpts=_rpts.filter(function(p){return _now-p.t<${m.trailLifetime};});
if(_rpts.length>=2){_rx.beginPath();_rx.moveTo(_rpts[0].x,_rpts[0].y);
for(var _ri=1;_ri<_rpts.length-1;_ri++){var _mx=(_rpts[_ri].x+_rpts[_ri+1].x)/2,_my=(_rpts[_ri].y+_rpts[_ri+1].y)/2;_rx.quadraticCurveTo(_rpts[_ri].x,_rpts[_ri].y,_mx,_my);}
_rx.strokeStyle=${col(m.trailColor)};_rx.globalAlpha=${m.trailOpacity};
_rx.globalCompositeOperation=${JSON.stringify(m.trailBlend === 'normal' ? 'source-over' : m.trailBlend)};
_rx.lineWidth=${m.trailSize};_rx.lineCap='round';_rx.lineJoin='round';_rx.stroke();}
requestAnimationFrame(_rDraw);}();`);
    } else if (m.trailStyle === 'sparks') {
      parts.push(`
document.addEventListener('mousemove',function(e){
if(Math.random()>.45)return;
var _p=document.createElement('div'),_ang=Math.random()*360;
_p.style.cssText='position:fixed;z-index:9997;pointer-events:none;border-radius:2px;width:2px;height:${m.trailSize}px;background:'+${col(m.trailColor)}+';opacity:${m.trailOpacity};mix-blend-mode:${m.trailBlend};left:'+e.clientX+'px;top:'+e.clientY+'px;transform-origin:center;transform:rotate('+_ang+'deg);transition:opacity ${m.trailLifetime}ms,transform ${m.trailLifetime}ms;';
document.body.appendChild(_p);
requestAnimationFrame(function(){_p.style.opacity='0';_p.style.transform='rotate('+_ang+'deg) translateY(-'+(20+Math.random()*40)+'px) scale(.1)';});
setTimeout(function(){_p.remove();},${m.trailLifetime});});`);
    } else {
      const isComet = m.trailStyle === 'comet';
      parts.push(`
document.addEventListener('mousemove',function(e){
if(Math.random()>.5)return;
var _p=document.createElement('div'),_sz=${m.trailSize}${isComet ? '*(Math.random()*.8+.2)' : ''};
_p.style.cssText='position:fixed;z-index:9997;pointer-events:none;border-radius:50%;width:'+_sz+'px;height:'+_sz+'px;background:'+${col(m.trailColor)}+';opacity:${m.trailOpacity};mix-blend-mode:${m.trailBlend};left:'+(e.clientX-_sz/2)+'px;top:'+(e.clientY-_sz/2)+'px;transition:opacity ${m.trailLifetime}ms ease,transform ${m.trailLifetime}ms ease;';
document.body.appendChild(_p);
requestAnimationFrame(function(){_p.style.opacity='0';_p.style.transform='scale(0)${isComet ? ' translateX(8px)' : ''}';});
setTimeout(function(){_p.remove();},${m.trailLifetime});});`);
    }
  }

  // ── Click burst ────────────────────────────────────────────────────────────
  if (m.clickBurst) {
    const grav = Math.round(m.burstGravity * 500);
    parts.push(`
document.addEventListener('click',function(e){
for(var _bi=0;_bi<${m.burstCount};_bi++){
var _ang=(Math.PI*2/${m.burstCount})*_bi+Math.random()*.6;
var _vx=Math.cos(_ang)*${m.burstRadius}*(Math.random()*.5+.7);
var _vy=Math.sin(_ang)*${m.burstRadius}*(Math.random()*.5+.7);
var _bp=document.createElement('div');
_bp.style.cssText='position:fixed;z-index:9996;pointer-events:none;border-radius:50%;width:${m.burstSize}px;height:${m.burstSize}px;background:'+${col(m.burstColor)}+';left:'+e.clientX+'px;top:'+e.clientY+'px;opacity:1;will-change:transform,opacity;';
document.body.appendChild(_bp);
(function(_el,_vx,_vy){var _s=null,_dur=520,_gv=${grav};
requestAnimationFrame(function _bs(ts){if(!_s)_s=ts;var _pg=Math.min((ts-_s)/_dur,1),_ease=1-Math.pow(1-_pg,2);
_el.style.transform='translate('+(_vx*_ease)+'px,'+(_vy*_ease+_gv*_pg*_pg)+'px) scale('+(1-_pg*.75)+')';
_el.style.opacity=''+(1-_ease);if(_pg<1)requestAnimationFrame(_bs);else _el.remove();});}(_bp,_vx,_vy));}});`);
  }

  // ── Magnetic buttons ───────────────────────────────────────────────────────
  if (m.magnetic) {
    parts.push(`
document.querySelectorAll(${JSON.stringify(m.magneticSelector)}).forEach(function(btn){
btn.addEventListener('mousemove',function(e){var _r=btn.getBoundingClientRect();btn.style.transform='translate('+(e.clientX-_r.left-_r.width/2)*${m.magneticStrength}+'px,'+(e.clientY-_r.top-_r.height/2)*${m.magneticStrength}+'px)';});
btn.addEventListener('mouseleave',function(){btn.style.transform='';});});`);
  }

  // ── Custom cursor ──────────────────────────────────────────────────────────
  if (m.cursor) {
    const hoverPx = Math.round(m.cursorDotSize * m.cursorHoverScale);
    const glowBg = rgbaCss(m.cursorGlowColor, m.cursorGlowOpacity);
    parts.push(`
if(window.matchMedia('(pointer:fine)').matches){
document.body.style.cursor='none';
var _cdot=document.createElement('div');
_cdot.style.cssText='position:fixed;z-index:10000;pointer-events:none;width:${m.cursorDotSize}px;height:${m.cursorDotSize}px;border-radius:50%;background:${m.cursorDotColor};transform:translate(-50%,-50%);mix-blend-mode:${m.cursorDotBlend};${m.cursorHoverExpand ? 'transition:width .15s,height .15s;' : ''}';
${m.cursorRing ? `var _cring=document.createElement('div');
_cring.style.cssText='position:fixed;z-index:9999;pointer-events:none;width:${m.cursorRingSize}px;height:${m.cursorRingSize}px;border-radius:50%;border:${m.cursorRingWidth}px solid ${m.cursorRingColor};opacity:${m.cursorRingOpacity};transform:translate(-50%,-50%);';` : ''}
${m.cursorGlow ? `var _cglow=document.createElement('div');
_cglow.style.cssText='position:fixed;z-index:1;pointer-events:none;width:${m.cursorGlowSize}px;height:${m.cursorGlowSize}px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,${glowBg} 0%,transparent 65%);';` : ''}
${m.cursorGlow ? `document.body.appendChild(_cglow);` : ''}${m.cursorRing ? `document.body.appendChild(_cring);` : ''}document.body.appendChild(_cdot);
var _cx=innerWidth/2,_cy=innerHeight/2${m.cursorRing ? ',_crx=_cx,_cry=_cy' : ''}${m.cursorGlow ? ',_cgx=_cx,_cgy=_cy' : ''};
window.addEventListener('mousemove',function(e){_cx=e.clientX;_cy=e.clientY;_cdot.style.left=_cx+'px';_cdot.style.top=_cy+'px';},{passive:true});
${m.cursorHoverExpand ? `document.addEventListener('mouseover',function(e){if(e.target.closest('a,button,[role=button]')){_cdot.style.width='${hoverPx}px';_cdot.style.height='${hoverPx}px';}else{_cdot.style.width='${m.cursorDotSize}px';_cdot.style.height='${m.cursorDotSize}px';}},{passive:true});` : ''}
!function _cl(){${m.cursorRing ? `_crx+=(_cx-_crx)*${m.cursorRingLag};_cry+=(_cy-_cry)*${m.cursorRingLag};_cring.style.left=_crx+'px';_cring.style.top=_cry+'px';` : ''}${m.cursorGlow ? `_cgx+=(_cx-_cgx)*${m.cursorGlowLag};_cgy+=(_cy-_cgy)*${m.cursorGlowLag};_cglow.style.left=_cgx+'px';_cglow.style.top=_cgy+'px';` : ''}requestAnimationFrame(_cl);}();
}`);
  }

  // ── Hero immersive effects (require animated-bg canvas) ───────────────────
  parts.push(`
if(!document.querySelector('canvas[data-animated-bg]'))return;
var _hcv=document.querySelector('canvas[data-animated-bg]');
if(_hcv){window.addEventListener('scroll',function(){_hcv.style.transform='translateY('+window.scrollY*.18+'px)';},{passive:true});}
var _h1=document.querySelector('section h1');
if(_h1&&!_h1.querySelector('[data-wr]')){
  var _dl={n:0};
  function _wn(node){if(node.nodeType===3){var words=node.textContent.split(/(\\s+)/);var frag=document.createDocumentFragment();words.forEach(function(w){if(!w||/^\\s+$/.test(w)){frag.appendChild(document.createTextNode(w));return;}var outer=document.createElement('span');outer.style.cssText='display:inline-block;overflow:hidden;';var inner=document.createElement('span');inner.setAttribute('data-wr','');inner.style.cssText='display:inline-block;transform:translateY(108%);transition:transform .8s cubic-bezier(.22,1,.36,1) '+(_dl.n++*65)+'ms;will-change:transform;';inner.textContent=w;outer.appendChild(inner);frag.appendChild(outer);});node.parentNode.replaceChild(frag,node);}else if(node.nodeType===1){Array.from(node.childNodes).forEach(_wn);}}
  _wn(_h1);setTimeout(function(){_h1.querySelectorAll('[data-wr]').forEach(function(el){el.style.transform='translateY(0)';});},100);
}
var _sub=document.querySelector('section p');
if(_sub){_sub.style.cssText+=';opacity:0;transform:translateY(24px);transition:opacity .9s ease .45s,transform .9s cubic-bezier(.22,1,.36,1) .45s;';setTimeout(function(){_sub.style.opacity='1';_sub.style.transform='translateY(0)';},100);}
`);

  parts.push(`})();`);
  return parts.join('\n');
}

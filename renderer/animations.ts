// Animated background generators — each returns self-contained HTML+JS/CSS

export type AnimatedBg =
  | 'particles' | 'aurora' | 'noise_flow' | 'geometric' | 'wave_grid' | 'cyber_grid' | 'starfield'
  | 'plasma' | 'hex_grid' | 'vortex' | 'neon_pulse' | 'matrix_rain' | 'fire' | 'circuit' | 'galaxy' | 'ripple'
  | 'fbm_warp';

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function hexToGlsl(hex: string): string {
  const r = (parseInt(hex.slice(1, 3), 16) / 255).toFixed(3);
  const g = (parseInt(hex.slice(3, 5), 16) / 255).toFixed(3);
  const b = (parseInt(hex.slice(5, 7), 16) / 255).toFixed(3);
  return `${r},${g},${b}`;
}

// Shared WebGL bootloader — fullscreen triangle trick, u_t/u_res/u_brand uniforms
// Optional mouse tracking: pass withMouse=true to add u_mouse uniform
function webglFx(id: string, frag: string, brandColor: string, withMouse = false): string {
  const [r, g, b] = [
    (parseInt(brandColor.slice(1, 3), 16) / 255).toFixed(3),
    (parseInt(brandColor.slice(3, 5), 16) / 255).toFixed(3),
    (parseInt(brandColor.slice(5, 7), 16) / 255).toFixed(3),
  ];
  const VERT = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}';
  return `
<canvas id="wgl_${id}" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;" aria-hidden="true"></canvas>
<script>
(function(){
  var cv=document.getElementById('wgl_${id}');
  if(!cv)return;
  var gl=cv.getContext('webgl',{antialias:false,alpha:false,depth:false})||cv.getContext('experimental-webgl');
  if(!gl){cv.style.display='none';return;}
  function mkS(t,s){var sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}
  var pr=gl.createProgram();
  gl.attachShader(pr,mkS(gl.VERTEX_SHADER,${JSON.stringify(VERT)}));
  gl.attachShader(pr,mkS(gl.FRAGMENT_SHADER,${JSON.stringify(frag)}));
  gl.linkProgram(pr);gl.useProgram(pr);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var ap=gl.getAttribLocation(pr,'a_pos');
  gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
  var uT=gl.getUniformLocation(pr,'u_t'),uR=gl.getUniformLocation(pr,'u_res'),uB=gl.getUniformLocation(pr,'u_brand');
  ${withMouse ? `var uM=gl.getUniformLocation(pr,'u_mouse');var mx=cv.offsetWidth/2,my=cv.offsetHeight/2;window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});` : ''}
  var t0=performance.now();
  !function frame(){
    var w=cv.offsetWidth||1,h=cv.offsetHeight||1;
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);}
    gl.uniform1f(uT,(performance.now()-t0)/1000);
    gl.uniform2f(uR,w,h);
    gl.uniform3f(uB,${r},${g},${b});
    ${withMouse ? 'gl.uniform2f(uM,mx,my);' : ''}
    gl.drawArrays(gl.TRIANGLES,0,3);
    requestAnimationFrame(frame);
  }();
})();
</script>`.trim();
}

// ── GLSL fragment shaders ─────────────────────────────────────────────────────

const FRAG_AURORA = `precision mediump float;
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
  gl_FragColor=vec4(c,1.);}`;

const FRAG_CYBER_GRID = `precision mediump float;
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
  gl_FragColor=vec4(col,1.);}`;

const FRAG_NOISE_FLOW = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.1;
  vec2 w=vec2(n(uv*3.+t),n(uv*3.+vec2(5.2,1.3)+t));
  float v=n(uv*2.+w*1.6+t*.6);
  vec3 c=mix(vec3(.03,.03,.09),u_brand*.55,smoothstep(.2,.65,v));
  c=mix(c,u_brand,smoothstep(.65,.95,v));
  gl_FragColor=vec4(c,1.);}`;

const FRAG_GEOMETRIC = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y);
  float t=u_t*.35,r=length(uv);float rings=0.;
  for(int i=0;i<6;i++){float fi=float(i);rings+=.005/(abs(r-fi*.15-.08-sin(t+fi*1.3)*.04)+.001);}
  vec3 col=vec3(.02,.02,.05)+u_brand*rings*(1.-smoothstep(.35,.75,r));
  gl_FragColor=vec4(col,1.);}`;

const FRAG_WAVE_GRID = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.5;
  float wx=uv.x+sin(uv.y*8.+t)*.05;
  float wy=uv.y+sin(uv.x*6.+t*.7)*.04;
  vec2 gf=fract(vec2(wx,wy)*15.);
  float line=max(smoothstep(.92,1.,gf.x),smoothstep(.92,1.,gf.y));
  vec3 col=vec3(.02,.02,.06)+u_brand*line*.45*(1.-uv.y*.55);
  gl_FragColor=vec4(col,1.);}`;

const FRAG_STARFIELD = `precision mediump float;
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
  gl_FragColor=vec4(col,1.);}`;

const FRAG_PLASMA = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.4;
  float v=sin(uv.x*10.+t)+sin(uv.y*8.+t*.8);
  v+=sin(sqrt(dot(uv-vec2(.5),uv-vec2(.5)))*12.-t*1.5);
  v+=cos(uv.x*6.+uv.y*7.+t*.6);
  v=v*.25+.5;
  vec3 col=mix(vec3(.02,.01,.08),u_brand,smoothstep(.3,.65,v));
  col=mix(col,vec3(.01,.0,.05),smoothstep(.65,.9,v));
  gl_FragColor=vec4(col,1.);}`;

const FRAG_HEX_GRID = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
vec2 hexGv(vec2 p){vec2 s=vec2(1.,1.732);vec2 a=mod(p,s)-s*.5;vec2 b=mod(p+s*.5,s)-s*.5;return dot(a,a)<dot(b,b)?a:b;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.35;
  vec2 gv=hexGv(uv*14.);float d=length(gv);
  float wave=sin(length(uv-vec2(.5))*10.-t*2.)*.5+.5;
  float pulse=smoothstep(.46,.42,d);
  float glow=exp(-d*d*10.)*.5;
  vec3 col=vec3(.01,.01,.04)+u_brand*(pulse*(wave*.35+.55)+glow*.35);
  gl_FragColor=vec4(col,1.);}`;

const FRAG_VORTEX = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y);
  float t=u_t*.5;float r=length(uv);
  float a=atan(uv.y,uv.x)+r*6.-t*2.;
  float arms=(sin(a*3.)*.5+.5)*exp(-r*r*2.5)*1.8;
  float swirl=(sin(r*18.-t*5.)*.5+.5)*exp(-r*r*4.)*.3;
  float core=exp(-r*r*15.)*.6;
  vec3 col=vec3(.01,.01,.04)+u_brand*clamp(arms+swirl+core,0.,1.);
  gl_FragColor=vec4(col,1.);}`;

const FRAG_NEON_PULSE = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float t=u_t*.7;
  float r=length(uv-vec2(.5));float rings=0.;
  for(int i=0;i<6;i++){
    float fi=float(i);float ph=mod(t*.65+fi*.22,1.4);
    rings+=exp(-abs(r-ph*.9)*60.)*(1.-ph*.55)*.85;
  }
  vec3 col=vec3(.01,.01,.04)+u_brand*min(rings,1.)*1.1;
  gl_FragColor=vec4(col,1.);}`;

const FRAG_MATRIX_RAIN = `precision mediump float;
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
  gl_FragColor=vec4(c,1.);}`;

const FRAG_FIRE = `precision mediump float;
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
  gl_FragColor=vec4(col,1.);}`;

const FRAG_CIRCUIT = `precision mediump float;
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
  gl_FragColor=vec4(col,1.);}`;

const FRAG_GALAXY = `precision mediump float;
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
  gl_FragColor=vec4(col,1.);}`;

const FRAG_RIPPLE = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec3 u_brand;
float rp(vec2 uv,vec2 o,float s,float f,float ph){float r=length(uv-o);return(sin(r*f-u_t*s+ph)*.5+.5)*exp(-r*r*7.);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float v=rp(uv,vec2(.5,.42),4.,30.,0.)+rp(uv,vec2(.25,.7),3.2,24.,1.2)+rp(uv,vec2(.75,.3),4.8,22.,2.5);
  v=clamp(v*.45,0.,.7);
  vec3 col=vec3(.01,.02,.04)+u_brand*v*.8;
  gl_FragColor=vec4(col,1.);}`;

// Double-FBM domain-warped noise with mouse-reactive highlight
const FRAG_FBM_WARP = `precision mediump float;
uniform float u_t;uniform vec2 u_res;uniform vec2 u_mouse;uniform vec3 u_brand;
float h(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+47.5);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.3+vec2(5.2,1.3);a*=.48;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float time=u_t*.14;
  vec2 q=vec2(fbm(uv*2.5+time*.08),fbm(uv*2.5+vec2(5.2,1.3)));
  vec2 r=vec2(fbm(uv*2.+q+vec2(1.7,9.2)+time*.13),fbm(uv*2.+q+vec2(8.3,2.8)));
  float f=fbm(uv*1.5+r+time*.04);
  vec3 dark=u_brand*.04;vec3 mid=u_brand*.55;vec3 bright=min(u_brand*1.6+vec3(.08,.04,.18),vec3(1.));
  vec3 c=mix(dark,mid,clamp(f*f*4.,0.,1.));
  c=mix(c,mid*1.1,clamp(f*f,0.,1.));
  c=mix(c,bright,clamp(pow(f,3.)*8.,0.,1.));
  c=mix(c,dark*1.4,clamp(f*.5,0.,.28));
  vec2 vp=uv-.5;c*=max(0.,1.-dot(vp,vp)*2.4);
  vec2 m=u_mouse/u_res;m.y=1.-m.y;
  c+=u_brand*max(0.,.45-length(uv-m))*.9;
  gl_FragColor=vec4(c,1.);}`;


// ─────────────────────────────────────────────────────────────────────────────

export function renderAnimatedBg(type: AnimatedBg | undefined, id: string, brandColor: string): string {
  if (!type || type === ('none' as AnimatedBg)) return '';
  const safeId = id.replace(/[^a-z0-9]/gi, '_');
  switch (type) {
    case 'particles':    return particles(safeId, brandColor);
    case 'aurora':       return webglFx(safeId, FRAG_AURORA, brandColor);
    case 'noise_flow':   return webglFx(safeId, FRAG_NOISE_FLOW, brandColor);
    case 'geometric':    return webglFx(safeId, FRAG_GEOMETRIC, brandColor);
    case 'wave_grid':    return webglFx(safeId, FRAG_WAVE_GRID, brandColor);
    case 'cyber_grid':   return webglFx(safeId, FRAG_CYBER_GRID, brandColor);
    case 'starfield':    return webglFx(safeId, FRAG_STARFIELD, brandColor);
    case 'plasma':       return webglFx(safeId, FRAG_PLASMA, brandColor);
    case 'hex_grid':     return webglFx(safeId, FRAG_HEX_GRID, brandColor);
    case 'vortex':       return webglFx(safeId, FRAG_VORTEX, brandColor);
    case 'neon_pulse':   return webglFx(safeId, FRAG_NEON_PULSE, brandColor);
    case 'matrix_rain':  return webglFx(safeId, FRAG_MATRIX_RAIN, brandColor);
    case 'fire':         return webglFx(safeId, FRAG_FIRE, brandColor);
    case 'circuit':      return webglFx(safeId, FRAG_CIRCUIT, brandColor);
    case 'galaxy':       return webglFx(safeId, FRAG_GALAXY, brandColor);
    case 'ripple':       return webglFx(safeId, FRAG_RIPPLE, brandColor);
    case 'fbm_warp':     return webglFx(safeId, FRAG_FBM_WARP, brandColor, true);
    default:             return '';
  }
}

// ── Canvas 2D: Particle Network (wrap-around, brand-colored) ─────────────────

function particles(id: string, brandColor: string): string {
  const rgb = hexToRgb(brandColor);
  return `
<canvas id="cv_${id}" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;" aria-hidden="true"></canvas>
<script>
(function(){
  var cv=document.getElementById('cv_${id}');
  if(!cv)return;
  var cx=cv.getContext('2d'),W=0,H=0,P=[];
  var RGB='${rgb}';
  var N=88,CONN=148,MCONN=CONN*1.7;
  var mx=-9999,my=-9999;
  window.addEventListener('mousemove',function(e){
    var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;
  },{passive:true});
  function sz(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;}
  function mk(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.27,vy:(Math.random()-.5)*.27,r:Math.random()*1.3+.3,a:Math.random()*.3+.06};}
  function draw(){
    cx.clearRect(0,0,W,H);
    for(var i=0;i<P.length;i++){
      P[i].x=(P[i].x+P[i].vx+W)%W;P[i].y=(P[i].y+P[i].vy+H)%H;
      cx.beginPath();cx.arc(P[i].x,P[i].y,P[i].r,0,6.283);
      cx.fillStyle='rgba('+RGB+','+P[i].a+')';cx.fill();
    }
    for(var i=0;i<P.length;i++){
      for(var j=i+1;j<P.length;j++){
        var d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);
        if(d<CONN){
          cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(P[j].x,P[j].y);
          cx.strokeStyle='rgba('+RGB+','+(0.13*(1-d/CONN)).toFixed(3)+')';
          cx.lineWidth=.65;cx.stroke();
        }
      }
      var md=Math.hypot(P[i].x-mx,P[i].y-my);
      if(md<MCONN){
        cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(mx,my);
        cx.strokeStyle='rgba('+RGB+','+(0.38*(1-md/MCONN)).toFixed(3)+')';
        cx.lineWidth=.8;cx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  sz();P=Array.from({length:N},mk);draw();
  window.addEventListener('resize',function(){sz();P=Array.from({length:N},mk);});
})();
</script>`.trim();
}

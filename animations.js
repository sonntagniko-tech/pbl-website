/* animations.js – PBL ConsultING */

/* 1. HERO BEAMS */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const hero = document.getElementById('hero');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = hero.clientWidth; canvas.height = hero.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  function beam(i) {
    const w = canvas.width, h = canvas.height, col = i % 4, sp = w / 4;
    return { x: col*sp+sp/2+(Math.random()-.5)*sp*.7, y: Math.random()*h*2-h, width: 40+Math.random()*60, length: h*3, angle: -35+Math.random()*10, speed: .15+Math.random()*.25, opacity: .04+Math.random()*.07, hue: Math.random()>.5?42:38, pulse: Math.random()*Math.PI*2, ps: .008+Math.random()*.012 };
  }
  let beams = Array.from({length:14}, (_,i) => beam(i));
  function reset(b,i) { const sp=canvas.width/4,col=i%4; b.y=canvas.height+100; b.x=col*sp+sp/2+(Math.random()-.5)*sp*.6; b.width=40+Math.random()*60; b.speed=.15+Math.random()*.25; b.hue=Math.random()>.5?42:38; b.opacity=.04+Math.random()*.07; }
  function draw(b) {
    ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.angle*Math.PI/180);
    const op=b.opacity*(.85+Math.sin(b.pulse)*.15);
    const g=ctx.createLinearGradient(0,0,0,b.length);
    g.addColorStop(0,`hsla(${b.hue},60%,55%,0)`); g.addColorStop(.1,`hsla(${b.hue},60%,55%,${op*.3})`);
    g.addColorStop(.4,`hsla(${b.hue},60%,55%,${op})`); g.addColorStop(.6,`hsla(${b.hue},60%,55%,${op})`);
    g.addColorStop(.9,`hsla(${b.hue},60%,55%,${op*.3})`); g.addColorStop(1,`hsla(${b.hue},60%,55%,0)`);
    ctx.fillStyle=g; ctx.fillRect(-b.width/2,0,b.width,b.length); ctx.restore();
  }
  function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); beams.forEach((b,i)=>{b.y-=b.speed;b.pulse+=b.ps;if(b.y+b.length<-100)reset(b,i);draw(b);}); requestAnimationFrame(animate); }
  animate();
})();

/* 2. PARTIKEL TEXT */
(function () {
  const canvas = document.getElementById('partikelCanvas');
  const section = document.getElementById('partikel-section');
  if (!canvas || !section) return;
  const ctx = canvas.getContext('2d');
  const words = ['HAUSKAUFBERATUNG','BAUSCHADENBEWERTUNG','ENERGIEBERATUNG','PLANUNGSMANAGEMENT','BIM PLANUNG','GEBÄUDEZERTIFIZIERUNG'];
  let cur=0, particles=[], phase='building', timer=0;
  const BUILD=2500, SHOW=4000, DISSOLVE=1500;
  function resize() { canvas.width=section.clientWidth; canvas.height=section.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  function pixels(word) {
    const off=document.createElement('canvas'); off.width=canvas.width; off.height=canvas.height;
    const o=off.getContext('2d'); const fs=Math.min(canvas.width/word.length*1.4,110);
    o.font=`bold ${fs}px Montserrat,Arial,sans-serif`; o.fillStyle='#c8a84b';
    o.textAlign='center'; o.textBaseline='middle'; o.fillText(word,canvas.width/2,canvas.height/2);
    const d=o.getImageData(0,0,canvas.width,canvas.height).data, px=[];
    for(let y=0;y<canvas.height;y+=4) for(let x=0;x<canvas.width;x+=4) if(d[(y*canvas.width+x)*4+3]>128) px.push({x,y});
    return px;
  }
  function init(word) { particles=pixels(word).map(p=>({tx:p.x,ty:p.y,x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*2+1,color:`hsl(${38+Math.random()*10},70%,${50+Math.random()*20}%)`,speed:.04+Math.random()*.06})); }
  let last=0;
  function animate(ts) {
    const dt=ts-last; last=ts;
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#0a0d11'; ctx.fillRect(0,0,canvas.width,canvas.height);
    timer+=dt;
    if(phase==='building'){const p=Math.min(timer/BUILD,1);particles.forEach(p2=>{p2.x+=(p2.tx-p2.x)*p2.speed*3;p2.y+=(p2.ty-p2.y)*p2.speed*3;ctx.fillStyle=p2.color;ctx.globalAlpha=p;ctx.beginPath();ctx.arc(p2.x,p2.y,p2.size,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;if(timer>=BUILD){phase='showing';timer=0;}}
    else if(phase==='showing'){particles.forEach(p=>{ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();});if(timer>=SHOW){phase='dissolving';timer=0;}}
    else if(phase==='dissolving'){const p=1-Math.min(timer/DISSOLVE,1);particles.forEach(p2=>{p2.x+=(Math.random()-.5)*4;p2.y+=(Math.random()-.5)*4;ctx.fillStyle=p2.color;ctx.globalAlpha=p;ctx.beginPath();ctx.arc(p2.x,p2.y,p2.size,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;if(timer>=DISSOLVE){cur=(cur+1)%words.length;init(words[cur]);phase='building';timer=0;}}
    requestAnimationFrame(animate);
  }
  init(words[0]); requestAnimationFrame(animate);
})();

/* 3. SHADER PROZESS */
(function () {
  const canvas = document.getElementById('shaderCanvas');
  const prozess = document.getElementById('prozess');
  if (!canvas || !prozess) return;
  const gl = canvas.getContext('webgl'); if (!gl) return;
  const vs = 'attribute vec4 aPos;void main(){gl_Position=aPos;}';
  const fs = `precision highp float;uniform vec2 iRes;uniform float iTime;const float spd=0.18,lFreq=0.2,lAmp=0.9,wSpd=0.18,wFreq=0.45,wAmp=0.85,offFreq=0.5,offSpd=0.24;const int LINES=14;float rnd(float t){return(cos(t)+cos(t*1.3+1.3)+cos(t*1.4+1.4))/3.;}void main(){vec2 uv=gl_FragCoord.xy/iRes.xy;vec2 sp=(gl_FragCoord.xy-iRes.xy/2.)/iRes.x*2.*4.5;float hf=1.-(cos(uv.x*6.28)*0.5+0.5);float vf=1.-(cos(uv.y*6.28)*0.5+0.5);sp.y+=rnd(sp.x*wFreq+iTime*wSpd)*wAmp*(0.5+hf);sp.x+=rnd(sp.y*wFreq+iTime*wSpd+2.)*wAmp*hf;vec4 lines=vec4(0.);vec4 lc=vec4(0.78,0.66,0.43,1.);for(int l=0;l<LINES;l++){float nl=float(l)/float(LINES);float op=float(l)+sp.x*offFreq;float r=rnd(op+iTime*offSpd)*0.5+0.5;float hw=mix(0.008,0.12,r*hf)/2.;float off=rnd(op+iTime*offSpd*(1.+nl))*mix(0.5,1.8,hf);float lp=rnd(sp.x*lFreq+iTime*spd)*hf*lAmp+off;float line=smoothstep(hw,0.,abs(lp-sp.y))/2.+smoothstep(hw*0.15+0.015,hw*0.15,abs(lp-sp.y));lines+=line*lc*r;}vec4 bg=mix(vec4(0.08,0.10,0.13,1.),vec4(0.14,0.11,0.09,1.),uv.x);bg*=vf;bg.a=1.;bg+=lines;gl_FragColor=bg;}`;
  function sh(t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;}
  const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const posL=gl.getAttribLocation(p,'aPos'),resL=gl.getUniformLocation(p,'iRes'),timeL=gl.getUniformLocation(p,'iTime');
  function resize(){canvas.width=prozess.clientWidth;canvas.height=prozess.clientHeight;gl.viewport(0,0,canvas.width,canvas.height);}
  resize();window.addEventListener('resize',resize);
  const t0=Date.now();
  function render(){const t=(Date.now()-t0)/1000;gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(p);gl.uniform2f(resL,canvas.width,canvas.height);gl.uniform1f(timeL,t);gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.vertexAttribPointer(posL,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(posL);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render);}
  render();
})();

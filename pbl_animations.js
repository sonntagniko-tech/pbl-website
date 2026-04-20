/* =============================================================
   PBL ConsultING – Animations Script
   Einbinden: <script src="pbl_animations.js"></script> vor </body>
   ============================================================= */

/* 1. HERO BEAMS – Goldene Lichtstrahlen im Hero-Bereich */
(function () {
  const hero = document.getElementById('hero');
  if (!hero || document.getElementById('hero-beams-canvas')) return;
  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';
  Array.from(hero.children).forEach(el => {
    el.style.position = 'relative';
    el.style.zIndex = '1';
  });
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-beams-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;filter:blur(40px);';
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = hero.clientWidth; canvas.height = hero.clientHeight; }
  resize();
  window.addEventListener('resize', resize);

  function createBeam(i) {
    const h = canvas.height, w = canvas.width, col = i % 4, sp = w / 4;
    return {
      x: col * sp + sp / 2 + (Math.random() - 0.5) * sp * 0.7,
      y: Math.random() * h * 2 - h,
      width: 40 + Math.random() * 60,
      length: h * 3,
      angle: -35 + Math.random() * 10,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.04 + Math.random() * 0.07,
      hue: Math.random() > 0.5 ? 42 : 38,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.012
    };
  }

  let beams = Array.from({ length: 14 }, (_, i) => createBeam(i));

  function resetBeam(b, i) {
    const sp = canvas.width / 4, col = i % 4;
    b.y = canvas.height + 100;
    b.x = col * sp + sp / 2 + (Math.random() - 0.5) * sp * 0.6;
    b.width = 40 + Math.random() * 60;
    b.speed = 0.15 + Math.random() * 0.25;
    b.hue = Math.random() > 0.5 ? 42 : 38;
    b.opacity = 0.04 + Math.random() * 0.07;
  }

  function drawBeam(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate((b.angle * Math.PI) / 180);
    const op = b.opacity * (0.85 + Math.sin(b.pulse) * 0.15);
    const g = ctx.createLinearGradient(0, 0, 0, b.length);
    g.addColorStop(0, `hsla(${b.hue},60%,55%,0)`);
    g.addColorStop(0.1, `hsla(${b.hue},60%,55%,${op * 0.3})`);
    g.addColorStop(0.4, `hsla(${b.hue},60%,55%,${op})`);
    g.addColorStop(0.6, `hsla(${b.hue},60%,55%,${op})`);
    g.addColorStop(0.9, `hsla(${b.hue},60%,55%,${op * 0.3})`);
    g.addColorStop(1, `hsla(${b.hue},60%,55%,0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-b.width / 2, 0, b.width, b.length);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beams.forEach((b, i) => {
      b.y -= b.speed;
      b.pulse += b.pulseSpeed;
      if (b.y + b.length < -100) resetBeam(b, i);
      drawBeam(b);
    });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* 2. PARTIKEL-TEXT – Leistungen als Partikel-Animation nach dem Hero */
(function () {
  const hero = document.getElementById('hero');
  if (!hero || document.getElementById('leistungen-animation')) return;

  const section = document.createElement('section');
  section.id = 'leistungen-animation';
  section.style.cssText = 'background:#0d1117;height:420px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;';

  const canvas = document.createElement('canvas');
  canvas.id = 'partikel-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  section.appendChild(canvas);
  hero.insertAdjacentElement('afterend', section);

  const ctx = canvas.getContext('2d');
  const woerter = [
    'HAUSKAUFBERATUNG',
    'BAUSCHADENBEWERTUNG',
    'ENERGIEBERATUNG',
    'PLANUNGSMANAGEMENT',
    'BIM PLANUNG',
    'GEBÄUDEZERTIFIZIERUNG'
  ];

  let currentWord = 0, particles = [], phase = 'building', phaseTimer = 0;
  const BUILD_TIME = 2500, SHOW_TIME = 4000, DISSOLVE_TIME = 1500;

  function resize() { canvas.width = section.clientWidth; canvas.height = section.clientHeight; }
  resize();
  window.addEventListener('resize', resize);

  function getTextPixels(word) {
    const off = document.createElement('canvas');
    off.width = canvas.width; off.height = canvas.height;
    const octx = off.getContext('2d');
    const fs = Math.min(canvas.width / word.length * 1.4, 110);
    octx.font = `bold ${fs}px 'Montserrat', Arial, sans-serif`;
    octx.fillStyle = '#c8a84b';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(word, canvas.width / 2, canvas.height / 2);
    const data = octx.getImageData(0, 0, canvas.width, canvas.height).data;
    const px = [];
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const idx = (y * canvas.width + x) * 4;
        if (data[idx + 3] > 128) px.push({ x, y });
      }
    }
    return px;
  }

  function initParticles(word) {
    const px = getTextPixels(word);
    particles = px.map(p => ({
      tx: p.x, ty: p.y,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      color: `hsl(${38 + Math.random() * 10}, 70%, ${50 + Math.random() * 20}%)`,
      speed: 0.04 + Math.random() * 0.06
    }));
  }

  let lastTime = 0;
  function animate(ts) {
    const dt = ts - lastTime; lastTime = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    phaseTimer += dt;

    if (phase === 'building') {
      const progress = Math.min(phaseTimer / BUILD_TIME, 1);
      particles.forEach(p => {
        p.x += (p.tx - p.x) * p.speed * 3;
        p.y += (p.ty - p.y) * p.speed * 3;
        ctx.fillStyle = p.color; ctx.globalAlpha = progress;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (phaseTimer >= BUILD_TIME) { phase = 'showing'; phaseTimer = 0; }
    } else if (phase === 'showing') {
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      if (phaseTimer >= SHOW_TIME) { phase = 'dissolving'; phaseTimer = 0; }
    } else if (phase === 'dissolving') {
      const progress = 1 - Math.min(phaseTimer / DISSOLVE_TIME, 1);
      particles.forEach(p => {
        p.x += (Math.random() - 0.5) * 4;
        p.y += (Math.random() - 0.5) * 4;
        ctx.fillStyle = p.color; ctx.globalAlpha = progress;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (phaseTimer >= DISSOLVE_TIME) {
        currentWord = (currentWord + 1) % woerter.length;
        initParticles(woerter[currentWord]);
        phase = 'building'; phaseTimer = 0;
      }
    }
    requestAnimationFrame(animate);
  }
  initParticles(woerter[0]);
  requestAnimationFrame(animate);
})();


/* 3. SHADER – Goldene WebGL-Wellenlinien in der Prozess-Sektion */
(function () {
  const prozess = document.getElementById('prozess');
  if (!prozess || document.getElementById('prozess-shader-canvas')) return;
  prozess.style.position = 'relative';
  prozess.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.id = 'prozess-shader-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.5;pointer-events:none;';
  prozess.insertBefore(canvas, prozess.firstChild);
  Array.from(prozess.children).forEach(el => {
    if (el !== canvas) { el.style.position = 'relative'; el.style.zIndex = '1'; }
  });

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vs = 'attribute vec4 aPos;void main(){gl_Position=aPos;}';
  const fs = `precision highp float;
    uniform vec2 iRes; uniform float iTime;
    const float spd=0.18,lFreq=0.2,lAmp=0.9,wSpd=0.18,wFreq=0.45,wAmp=0.85,offFreq=0.5,offSpd=0.24;
    const int LINES=14;
    float rnd(float t){return(cos(t)+cos(t*1.3+1.3)+cos(t*1.4+1.4))/3.;}
    void main(){
      vec2 uv=gl_FragCoord.xy/iRes.xy;
      vec2 sp=(gl_FragCoord.xy-iRes.xy/2.)/iRes.x*2.*4.5;
      float hf=1.-(cos(uv.x*6.28)*0.5+0.5);
      float vf=1.-(cos(uv.y*6.28)*0.5+0.5);
      sp.y+=rnd(sp.x*wFreq+iTime*wSpd)*wAmp*(0.5+hf);
      sp.x+=rnd(sp.y*wFreq+iTime*wSpd+2.)*wAmp*hf;
      vec4 lines=vec4(0.); vec4 lc=vec4(0.78,0.66,0.43,1.);
      for(int l=0;l<LINES;l++){
        float nl=float(l)/float(LINES);
        float op=float(l)+sp.x*offFreq;
        float r=rnd(op+iTime*offSpd)*0.5+0.5;
        float hw=mix(0.008,0.12,r*hf)/2.;
        float off=rnd(op+iTime*offSpd*(1.+nl))*mix(0.5,1.8,hf);
        float lp=rnd(sp.x*lFreq+iTime*spd)*hf*lAmp+off;
        float line=smoothstep(hw,0.,abs(lp-sp.y))/2.+smoothstep(hw*0.15+0.015,hw*0.15,abs(lp-sp.y));
        lines+=line*lc*r;
      }
      vec4 bg=mix(vec4(0.08,0.10,0.13,1.),vec4(0.14,0.11,0.09,1.),uv.x);
      bg*=vf; bg.a=1.; bg+=lines; gl_FragColor=bg;
    }`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const posL = gl.getAttribLocation(prog, 'aPos');
  const resL = gl.getUniformLocation(prog, 'iRes');
  const timeL = gl.getUniformLocation(prog, 'iTime');

  function resize() {
    canvas.width = prozess.clientWidth;
    canvas.height = prozess.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const t0 = Date.now();
  function render() {
    const t = (Date.now() - t0) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(resL, canvas.width, canvas.height);
    gl.uniform1f(timeL, t);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(posL, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posL);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  render();
})();

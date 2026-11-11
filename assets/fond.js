// Fond animé : points lumineux cyan / violet qui dérivent lentement
// (même principe que chaton-script.com, couleurs noozbar).
(function(){
  const cv = document.getElementById('bgfx');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let W=0, H=0, pts=[];
  const COULEURS = [[58,209,255],[164,107,255],[255,107,214]];
  function resize(){
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    const n = Math.round(W*H/22000);
    pts = [];
    for(let i=0;i<n;i++) pts.push({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*2+0.5,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      ph:Math.random()*6,
      c:COULEURS[Math.random()<.6?0:(Math.random()<.75?1:2)]
    });
  }
  resize();
  window.addEventListener('resize', resize);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#060912'; ctx.fillRect(0,0,W,H);
    const g=ctx.createRadialGradient(W*0.3,H*0.3,0,W*0.3,H*0.3,Math.max(W,H)*0.6);
    g.addColorStop(0,'rgba(30,70,140,.25)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    const g2=ctx.createRadialGradient(W*0.85,H*0.85,0,W*0.85,H*0.85,Math.max(W,H)*0.5);
    g2.addColorStop(0,'rgba(110,50,170,.16)'); g2.addColorStop(1,'transparent');
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);
    pts.forEach(p=>{
      if(!reduce){ p.x+=p.vx; p.y+=p.vy; p.ph+=0.03; }
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      const tw=0.5+0.5*Math.sin(p.ph);
      const [r,gg,b]=p.c;
      ctx.beginPath();
      ctx.fillStyle=`rgba(${r},${gg},${b},${0.22+tw*0.5})`;
      ctx.shadowColor=`rgba(${r},${gg},${b},.9)`; ctx.shadowBlur=8;
      ctx.arc(p.x,p.y,p.r*(0.7+tw*0.5),0,7); ctx.fill();
    });
    ctx.shadowBlur=0;
    if(!reduce) requestAnimationFrame(frame);
  }
  frame();
})();

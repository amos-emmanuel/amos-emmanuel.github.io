/* ============================================
   Theme toggle, page transition, starfield background.
   Include right before </body>: <script src="assets/main.js"></script>
   (or ../assets/main.js from /projects/)
   ============================================ */
(function(){
  var btn = document.getElementById('theme-toggle');
  function currentTheme(){ return document.documentElement.getAttribute('data-theme') || 'dark'; }
  function setIcon(){ if(btn) btn.textContent = currentTheme()==='light' ? '☀️' : '🌙'; }
  setIcon();
  if(btn){
    btn.addEventListener('click', function(){
      var next = currentTheme()==='light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try{ localStorage.setItem('theme', next); }catch(e){}
      setIcon();
    });
  }

  var burger = document.getElementById('nav-burger');
  var navLinks = document.getElementById('nav-links');
  if(burger && navLinks){
    burger.addEventListener('click', function(){
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
    });
    addEventListener('resize', function(){
      if(innerWidth > 800) navLinks.classList.remove('open');
    });
  }

  // window.addEventListener('DOMContentLoaded', function(){
  //   requestAnimationFrame(function(){ document.getElementById('page-fade').classList.add('loaded'); });
  // });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || a.hasAttribute('download') || a.target === '_blank') return;
    var isHtmlLink = href.endsWith('.html') || href.indexOf('.html#') !== -1;
    var isDirLink = href === './' || href === '../' || href.endsWith('/');
    if(!isHtmlLink && !isDirLink) return;
    e.preventDefault();
    document.getElementById('page-fade').classList.add('exiting');
    // document.getElementById('page-fade').classList.remove('loaded');
    setTimeout(function(){ window.location.href = href; }, 150);
  });
})();

/* ---------- starfield (fixed, whole-site background) ---------- */
(function(){
  var cv = document.getElementById('stars');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var stars = [], w, h;
  function readVars(){
    var s = getComputedStyle(document.documentElement);
    var rgb = s.getPropertyValue('--star-color').trim() || '244,237,228';
    var alpha = parseFloat(s.getPropertyValue('--star-alpha')) || .9;
    return {rgb: rgb, alpha: alpha};
  }
  function resize(){
    w = cv.width = innerWidth; h = cv.height = innerHeight;
    var n = Math.min(180, Math.floor(w*h/11000));
    stars = [];
    for(var i=0;i<n;i++) stars.push({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2+.3,
      a: Math.random()*.6+.25, s: Math.random()*.35+.05, tw: Math.random()*Math.PI*2
    });
  }
  function draw(t){
    ctx.clearRect(0,0,w,h);
    var v = readVars();
    for(var i=0;i<stars.length;i++){
      var st = stars[i];
      var tw = .5 + .5*Math.sin(st.tw + t*.001*st.s*10);
      ctx.globalAlpha = st.a * tw * v.alpha;
      ctx.fillStyle = 'rgb(' + v.rgb + ')';
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      st.y += st.s;
      if(st.y > h){ st.y = 0; st.x = Math.random()*w; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();

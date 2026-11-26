/* The globe from the 3D story (story.html), on its own for the About Us block of the website:
   the same land dots from the land mask, the ocean dots, the linked constellation shell and the company markers.
   It turns slowly and can be dragged. three.js and the land mask load only when the block comes near the screen. */
(function(){
  var box=document.querySelector('[data-globe]'); if(!box) return;
  var BASE=box.getAttribute('data-globe'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function gl(){ try{ var c=document.createElement('canvas'); return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl'))); }catch(e){ return false; } }
  if(!gl()||!('IntersectionObserver' in window)) return;
  function load(src){ return new Promise(function(ok,no){ var s=document.createElement('script'); s.src=src; s.async=true; s.onload=ok; s.onerror=no; document.head.appendChild(s); }); }
  var io=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; io.disconnect();
    (window.THREE?Promise.resolve():load(BASE+'three.min.js')).then(function(){ return window.LANDMASK?null:load(BASE+'landmask.js'); }).then(start).catch(function(){}); },{rootMargin:'400px 0px'});
  io.observe(box);

  function start(){
    var T=window.THREE, GR=70;
    var canvas=document.createElement('canvas'); canvas.className='globe-cv'; canvas.setAttribute('aria-hidden','true'); box.appendChild(canvas);
    var tagsEl=document.createElement('div'); tagsEl.className='globe-tags'; tagsEl.setAttribute('aria-hidden','true'); box.appendChild(tagsEl);
    var ren=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:true}); ren.setPixelRatio(Math.min(2,devicePixelRatio||1)); ren.setClearColor(0x000000,0);
    var scene=new T.Scene(), cam=new T.PerspectiveCamera(30,1,1,4000);
    var globe=new T.Group(), gTilt=new T.Group(), gSpin=new T.Group(); scene.add(globe); globe.add(gTilt); gTilt.add(gSpin);
    var LAT0=38*Math.PI/180, LON0=-8.2*Math.PI/180;
    function gv(lat,lon,r){ var la=lat*Math.PI/180, lo=lon*Math.PI/180; return new T.Vector3(r*Math.cos(la)*Math.sin(lo), r*Math.sin(la), r*Math.cos(la)*Math.cos(lo)); }

    /* land and ocean dots, the ocean sphere and the constellation shell: as in the story */
    var M=window.LANDMASK, bits=null; if(M){ var b=atob(M.b64); bits=new Uint8Array(b.length); for(var i=0;i<b.length;i++) bits[i]=b.charCodeAt(i); }
    function land(lat,lon){ if(!bits) return true; var x=Math.floor((lon+180)/360*M.w)%M.w, y=Math.min(M.h-1,Math.floor((90-lat)/180*M.h)), idx=y*M.w+x; return (bits[idx>>3]>>(7-(idx&7)))&1; }
    var n=14000, lp=[], fp=[], ga=Math.PI*(3-Math.sqrt(5));
    for(var k=0;k<n;k++){ var y=1-(k/(n-1))*2, rad=Math.sqrt(1-y*y), th=ga*k, x=Math.cos(th)*rad, z=Math.sin(th)*rad, lat=Math.asin(y)*180/Math.PI, lon=Math.atan2(x,z)*180/Math.PI;
      if(lat<-62) continue; (land(lat,lon)?lp:fp).push(x*GR,y*GR,z*GR); }
    function pts(a,col,size,op){ var g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(a,3)); return new T.Points(g,new T.PointsMaterial({color:col,size:size,transparent:true,opacity:op,depthWrite:false})); }
    gSpin.add(new T.Mesh(new T.SphereGeometry(GR*.985,48,48),new T.MeshBasicMaterial({color:0x17121f,transparent:true,opacity:.96})));
    gSpin.add(pts(lp,0xa99ff5,1.5,.95)); gSpin.add(pts(fp.filter(function(_,i){ return (Math.floor(i/3)%5)===0; }),0x6d64a8,.9,.35));
    var seed=7; function rnd(){ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }
    var shell=[], SR=GR*1.18; for(var j=0;j<64;j++){ var uu=rnd()*2-1, tt=rnd()*Math.PI*2, qq=Math.sqrt(1-uu*uu); shell.push(new T.Vector3(qq*Math.cos(tt)*SR,uu*SR,qq*Math.sin(tt)*SR)); }
    var ls=[]; shell.forEach(function(a,ai){ shell.map(function(b,bi){ return [a.distanceTo(b),bi]; }).filter(function(d){ return d[1]!==ai; }).sort(function(p,q){ return p[0]-q[0]; }).slice(0,3)
      .forEach(function(d){ if(d[1]>ai){ var b=shell[d[1]]; ls.push(a.x,a.y,a.z,b.x,b.y,b.z); } }); });
    var lg=new T.BufferGeometry(); lg.setAttribute('position',new T.Float32BufferAttribute(ls,3));
    gSpin.add(new T.LineSegments(lg,new T.LineBasicMaterial({color:0x8f86ec,transparent:true,opacity:.3,depthWrite:false})));
    var sp=[]; shell.forEach(function(v){ sp.push(v.x,v.y,v.z); }); gSpin.add(pts(sp,0xe9e5ff,2.6,.9));

    /* the company markers and their tags, with the story's offsets so the European tags do not overlap */
    var tags=[['Switzerland <b>HQ</b>',46.8,8.2,1,0,60],['<b>Czech Republic</b>',49.8,15.5,0,112,0],['<b>United Kingdom</b>',53.5,-2,0,-104,-24],['<b>Belgium</b>',50.6,4.6,0,-24,-56],['<b>Japan</b>',36.2,138.3,0,0,-30]].map(function(a){
      var m=new T.Mesh(new T.SphereGeometry(a[3]?1.9:1.5,20,14),new T.MeshBasicMaterial({color:a[3]?0xffffff:0xa49cf0})); m.position.copy(gv(a[1],a[2],GR*1.01)); gSpin.add(m);
      var el=document.createElement('span'); el.className='gtag'+(a[3]?' hq':''); el.innerHTML=a[0]; tagsEl.appendChild(el); return {m:m,el:el,dx:a[4],dy:a[5],hq:!!a[3]}; });

    /* size: the shell fits the frame */
    var W=1,H=1; function size(){ W=canvas.clientWidth; H=canvas.clientHeight; if(!W||!H) return; ren.setSize(W,H,false); cam.aspect=W/H;
      var fit=GR*1.2, v=fit/Math.tan(cam.fov*Math.PI/360), h=v/Math.min(1,cam.aspect); cam.position.set(0,0,Math.max(v,h)); cam.lookAt(0,0,0); cam.updateProjectionMatrix(); }
    size(); if('ResizeObserver' in window) new ResizeObserver(size).observe(box); else addEventListener('resize',size);

    /* drag to turn, with inertia; a slow idle spin when left alone */
    var yaw=0, yawV=0, pitch=0, dragging=false, lastX=0, lastY=0, idle=0;
    canvas.addEventListener('pointerdown',function(e){ dragging=true; lastX=e.clientX; lastY=e.clientY; yawV=0; box.classList.add('drag'); try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
    canvas.addEventListener('pointermove',function(e){ if(!dragging) return; var dx=e.clientX-lastX, dy=e.clientY-lastY; lastX=e.clientX; lastY=e.clientY; yawV=dx*.006; yaw+=yawV; pitch=Math.max(-.6,Math.min(.6,pitch+dy*.004)); idle=0; });
    function endDrag(){ dragging=false; box.classList.remove('drag'); } canvas.addEventListener('pointerup',endDrag); canvas.addEventListener('pointercancel',endDrag);

    var on=false, raf=0, last=0, tmp=new T.Vector3(), cpos=new T.Vector3();
    function frame(t){ raf=0; if(!on) return; var dt=Math.min(.05,last?(t-last)/1000:0); last=t;
      if(!dragging){ yaw+=yawV; yawV*=.94; idle+=dt; if(!reduce) yaw+=dt*.12*Math.min(1,idle/1.5); }
      gSpin.rotation.y=LON0+yaw; gTilt.rotation.x=LAT0+pitch; scene.updateMatrixWorld(true);
      cpos.copy(cam.position); var k=Math.min(1,Math.min(W,H)/440), few=W<560;
      tags.forEach(function(g){ g.m.getWorldPosition(tmp); var nrm=tmp.clone().normalize(), face=nrm.dot(cpos.clone().sub(tmp).normalize());
        tmp.project(cam); var x=(tmp.x*.5+.5)*W+g.dx*k, y=(-tmp.y*.5+.5)*H-10+g.dy*k;
        g.el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-100%)'; g.el.style.opacity=few&&!g.hq?0:Math.max(0,Math.min(1,(face-.2)*5)); });
      ren.render(scene,cam); raf=requestAnimationFrame(frame); }
    function run(v){ on=v&&!document.hidden; if(on&&!raf){ last=0; raf=requestAnimationFrame(frame); } }
    new IntersectionObserver(function(es){ run(es[0].isIntersecting); }).observe(box);
    document.addEventListener('visibilitychange',function(){ run(!document.hidden); });
    box.classList.add('live');
  }
})();

/* V2 motion: the scroll language of the reference site (polpharmabiologics.com), on our own layout.
   One easing for everything ("osmo": quick start, long soft landing), headlines that rise line by line from a mask,
   statements whose words fill with colour as they are read, photographs that settle from a slight zoom,
   rules that draw themselves, the product band that opens to the full width, cards that arrive in turn
   and a footer that slides out from under the page. Lenis smooth scrolling is on (html[data-lenis]).
   Built on corporate/motion.js. With reduced motion, or if GSAP is missing, nothing here runs and the page
   behaves like V1 (its CSS reveals stay in place). */
(function(){
  var M=window.Motion; if(!M||M.reduce) return;
  var g=M.gsap, ST=M.ScrollTrigger, Split=M.SplitText;
  M.CustomEase.create('osmo','0.625, 0.05, 0, 1');
  g.defaults({ease:'osmo',duration:.6});
  var $=function(s,r){ return [].slice.call((r||document).querySelectorAll(s)); };
  /* elements driven here leave the CSS reveal, so the two never animate the same thing */
  function own(el){ el.classList.remove('up'); el.style.opacity=''; el.style.transform=''; }
  document.documentElement.classList.add('gs');
  /* word pairs bound with a no-break space (short words, numbers) stay together once SplitText owns the text */
  function keep(el){ var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT), nodes=[]; while(tw.nextNode()) if(tw.currentNode.nodeValue.indexOf(' ')>-1) nodes.push(tw.currentNode);
    nodes.forEach(function(n){ var frag=document.createDocumentFragment(); n.nodeValue.split(/( +)/).forEach(function(t){ if(!t) return;
      if(t.indexOf(' ')>-1){ var s=document.createElement('span'); s.style.whiteSpace='nowrap'; s.textContent=t; frag.appendChild(s); } else frag.appendChild(document.createTextNode(t)); });
      n.parentNode.replaceChild(frag,n); }); return el; }

  /* 0. preloader (first visit only, decided in the page head): the two halves of the signifier meet,
        the captions close in, a purple disc grows over the screen and the page opens behind it */
  var root=document.documentElement, loader=document.querySelector('.loader'), pre=root.classList.contains('pre')&&loader;
  var intro=g.timeline({paused:true});
  function start(){ intro.play(0); }
  if(pre){
    try{ sessionStorage.setItem('as-pre','1'); }catch(e){}
    var cl=loader.querySelector('.cap.l'), cr=loader.querySelector('.cap.r'), ha=loader.querySelector('.half.a'), hb=loader.querySelector('.half.b'), cov=loader.querySelector('.cover');
    var cover=Math.ceil(Math.hypot(innerWidth,innerHeight)/40)+2;
    var lt=g.timeline({delay:.25,defaults:{ease:'expo.out',duration:1}});
    lt.from(ha,{xPercent:-140,autoAlpha:0},0).from(hb,{xPercent:140,autoAlpha:0},0)
      .to(cl,{top:'50%',yPercent:-50,y:-90},.1).to(cr,{bottom:'50%',yPercent:50,y:90},.1)
      .to(cov,{scale:cover,duration:.9,ease:'power3.in'},1.05)
      .add(function(){ start(); },1.75)
      .to(loader,{autoAlpha:0,duration:.6,ease:'power2.out',onComplete:function(){ root.classList.remove('pre'); loader.remove(); ST.refresh(); }},1.8);
  }

  /* 1. hero: the title rises line by line, the panel opens from the left; after the preloader if there is one */
  var h1=document.getElementById('t-hero');
  if(h1){ own(h1);
    Split.create(keep(h1),{type:'lines',mask:'lines',autoSplit:true,onSplit:function(s){ var tw=g.from(s.lines,{yPercent:110,stagger:.15,duration:1.25,ease:'expo.out',paused:true}); intro.add(tw.play(),.15); return tw; }}); }
  /* the panel spans the screen width; on load it opens to the grid width, then the scroll takes it to the edges */
  var panel=document.querySelector('.hero > .chm:not(.revealed)'); /* moved into the hero stage below (1c) */
  var bl=function(){ return panel?Math.max(0,(innerWidth-panel.parentNode.getBoundingClientRect().width)/2):0; };
  var gridClip=function(){ return 'inset(0px '+bl()+'px 0px '+bl()+'px round 10px)'; };
  if(panel){ panel.classList.add('bleed');
    g.set(panel,{clipPath:'inset(0px '+(innerWidth-bl())+'px 0px '+bl()+'px round 10px)'});
    intro.to(panel,{clipPath:gridClip,duration:1.3,ease:'expo.out'},.55); }
  $('.hero .meta,.hero .intro').forEach(function(el,i){ own(el); g.set(el,{autoAlpha:0,y:16}); intro.to(el,{autoAlpha:1,y:0,duration:.9,ease:'expo.out'},.5+i*.1); });
  intro.eventCallback('onComplete',function(){ if(!panel) return;
    g.fromTo(panel,{clipPath:gridClip},{clipPath:'inset(0px 0px 0px 0px round 0px)',ease:'none',immediateRender:false,
      scrollTrigger:{trigger:panel,start:'top 70%',end:'top 8%',scrub:true,invalidateOnRefresh:true}}); });
  if(!pre) start();

  /* 1c. the hero stage is pinned while the scroll plays the video. Then, as on the reference, a flat signifier shape rises
         from the bottom as a window onto the next block (the map of Switzerland) and grows until that block fills the screen;
         the page continues from there. The window is a CSS mask in the signifier's shape over the map panel. */
  var stage=document.querySelector('.hero .stage'), hv=stage&&stage.querySelector('.hv'), chm=document.querySelector('.hero .chm');
  if(stage&&hv&&chm){
    var sw=stage.querySelector('.sweep'); if(sw) sw.remove();
    var rv=document.createElement('div'); rv.className='reveal'; chm.classList.add('revealed'); rv.appendChild(chm); stage.appendChild(rv);
    hv.pause(); hv.muted=true;
    var prime=function(){ var pr=hv.play(); if(pr&&pr.then) pr.then(function(){ hv.pause(); hv.currentTime=0; }).catch(function(){}); else hv.pause(); };
    if(hv.readyState>=1) prime(); else hv.addEventListener('loadedmetadata',prime,{once:true});
    var vt={t:0}, want=0, seeking=false;
    function seek(){ var d=hv.duration; if(!d||!isFinite(d)) return; want=Math.min(d-.04,vt.t*d); if(!seeking&&Math.abs(hv.currentTime-want)>.02){ seeking=true; hv.currentTime=want; } }
    hv.addEventListener('seeked',function(){ seeking=false; if(Math.abs(hv.currentTime-want)>.02){ seeking=true; hv.currentTime=want; } });
    /* the window: size S, and the point (AX,AY) of the shape (inside its right stroke) placed at screen point P */
    var AR=53.6/60.1, AX=.727, AY=.616, m={a:0,b:0};
    function place(){ var W=stage.clientWidth, H=stage.clientHeight, S0=Math.min(W*.46,H*.62,640), S1=Math.hypot(W,H)*5.2;
      var ra=m.a, rb=m.b, S, px, py;
      /* a: rises from below the screen to just under the headline */
      var yA=H+S0*AY*AR*1.05, yB=H*.62+AY*S0*AR; /* its top settles at about 62% of the screen, under the headline */
      if(rb<=0){ S=S0; px=W/2; py=yA+(yB-yA)*ra; }
      /* b: grows around the screen centre until it covers the screen */
      else { S=S0*Math.exp(Math.log(S1/S0)*rb); px=W/2; py=yB+(H/2-yB)*Math.min(1,rb*1.4); }
      rv.style.setProperty('--rs',S.toFixed(1)+'px'); rv.style.setProperty('--rx',(px-AX*S).toFixed(1)+'px'); rv.style.setProperty('--ry',(py-AY*S*AR).toFixed(1)+'px');
      rv.classList.toggle('open',rb>=.999); rv.classList.toggle('on',ra>0||rb>0); }
    place(); addEventListener('resize',place);
    var words=$('.hero .stage h1,.hero .stage .meta,.hero .stage .intro');
    var tl=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:stage,start:'top top',end:'+=260%',pin:true,scrub:true,anticipatePin:1,invalidateOnRefresh:true}});
    tl.to(vt,{t:1,duration:.56,onUpdate:seek},0)
      .to(m,{a:1,duration:.2,ease:'power2.out',onUpdate:place},.5)
      .to(words,{autoAlpha:0,yPercent:-8,duration:.12,ease:'power1.in'},.7)
      .to(m,{b:1,duration:.28,ease:'power2.in',onUpdate:place},.72);
  }

  /* 2. section headlines: lines rise from a mask when the headline reaches 80% of the screen */
  $('main h2').forEach(function(h){ if(h.closest('.hero')) return; own(h);
    Split.create(keep(h),{type:'lines',mask:'lines',autoSplit:true,onSplit:function(s){
      return g.from(s.lines,{yPercent:110,duration:.8,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 80%',once:true}}); }}); });

  /* 3. statements: words fill with colour as they are read (scrubbed to the scroll) */
  function highlight(el,muted,active){ own(el);
    var s=Split.create(keep(el),{type:'words,lines',mask:'lines'}), w=s.words; if(!w.length) return;
    g.set(w,{color:muted});
    ST.create({trigger:el,start:'top 85%',end:'top 35%',scrub:true,onUpdate:function(self){ var head=self.progress*w.length;
      w.forEach(function(word,i){ g.set(word,{color:g.utils.interpolate(muted,active,g.utils.clamp(0,1,head-i))}); }); }}); }
  $('.ph-sec .lede').forEach(function(el){ highlight(el,'rgba(35,31,32,.18)','#231f20'); });
  $('.co .ttl .lede').forEach(function(el){ highlight(el,'rgba(255,255,255,.2)','rgba(255,255,255,.9)'); });
  $('.x3d-sec .txt').forEach(function(el){ highlight(el,'rgba(243,238,235,.18)','rgba(243,238,235,.86)'); });

  /* 4. photographs settle from a slight zoom as they come in */
  $('.co .ph img,.img-sec .ph img,.tg .ph img').forEach(function(img){
    g.fromTo(img,{scale:1.3},{scale:1,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:img.parentNode,start:'top 85%',once:true}}); });

  /* 5. the product band opens from the grid to the full width of the screen while it crosses the screen */
  var band=document.querySelector('.pr .band');
  if(band){ var inset=function(){ return Math.max(0,(innerWidth-band.parentNode.getBoundingClientRect().width)/2)+'px'; };
    band.classList.add('bleed');
    g.fromTo(band,{clipPath:function(){ return 'inset(0px '+inset()+' 0px '+inset()+' round 10px)'; }},
      {clipPath:'inset(0px 0px 0px 0px round 0px)',ease:'none',scrollTrigger:{trigger:band,start:'top 85%',end:'center 45%',scrub:true,invalidateOnRefresh:true}});
    var bimg=band.querySelector('img'); if(bimg) g.fromTo(bimg,{yPercent:-6,scale:1.12},{yPercent:6,scale:1.12,ease:'none',scrollTrigger:{trigger:band,start:'top bottom',end:'bottom top',scrub:true}}); }

  /* 6. rules draw themselves from the left */
  $('.fig dl>div,.steps li,.pr .list li,.nw li a').forEach(function(row){
    var cs=getComputedStyle(row), col=cs.borderTopColor, w=cs.borderTopWidth; if(parseFloat(w)===0) return;
    var ln=document.createElement('span'); ln.className='ln'; ln.setAttribute('aria-hidden','true'); ln.style.background=col; ln.style.height=w; ln.style.top='-'+w;
    row.classList.add('has-ln'); row.appendChild(ln);
    g.fromTo(ln,{scaleX:0},{scaleX:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 90%',once:true}}); });

  /* 7. cards and rows arrive one after another */
  [['#chain ol','li'],['.pr .list','li'],['.nw ol','li'],['.steps','li']].forEach(function(p){ var box=document.querySelector(p[0]); if(!box) return; own(box);
    g.from($(p[1],box).map(function(li){ own(li); return li; }),{autoAlpha:0,y:32,duration:.9,stagger:.08,ease:'expo.out',scrollTrigger:{trigger:box,start:'top 85%',once:true}}); });

  /* 8. the footer slides out from under the page */
  var ft=document.querySelector('.ft .grid');
  if(ft) g.from(ft,{yPercent:-25,ease:'none',scrollTrigger:{trigger:'.ft',start:'top bottom',end:'top 30%',scrub:true}});

  /* 9. the value chain: large cards wider than the screen; the section is pinned and the scroll moves the row sideways,
        each card filling with its gradient as it is reached */
  var chain=document.getElementById('chain'), crow=chain&&chain.querySelector('ol');
  if(chain&&crow&&window.__chainSet){ window.__chainScrub=true; window.__chainSet(0); chain.classList.add('hscroll');
    var dist=function(){ var l=crow.getBoundingClientRect().left-g.getProperty(crow,'x'); return Math.max(0,crow.scrollWidth-(innerWidth-2*l)); };
    g.to(crow,{x:function(){ return -dist(); },ease:'none',scrollTrigger:{trigger:chain,start:'top top',end:function(){ return '+='+(dist()+innerHeight*.35); },pin:true,scrub:true,invalidateOnRefresh:true,
      onUpdate:function(self){ window.__chainSet(Math.min(1,self.progress*1.12+.12)); }}}); }

  /* 10. the header turns dark over the dark About Us band */
  var hd=document.getElementById('hd');
  $('.x3d-sec,.co').forEach(function(dark){ ST.create({trigger:dark,start:'top 64px',end:'bottom 64px',toggleClass:{targets:hd,className:'dark'}}); });

  /* 11. a soft light follows the cursor across the violet cards */
  $('.pr .list li').forEach(function(card){
    card.addEventListener('pointermove',function(e){ var r=card.getBoundingClientRect(); card.style.setProperty('--mx',(e.clientX-r.left)+'px'); card.style.setProperty('--my',(e.clientY-r.top)+'px'); });
    card.addEventListener('pointerleave',function(){ card.style.removeProperty('--mx'); card.style.removeProperty('--my'); }); });

  /* 12. the bracket corners around the Companies statement open from the middle */
  $('.co .brk').forEach(function(b){ g.fromTo(b,{clipPath:'inset(50% 0% 50% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:b,start:'top 80%',once:true}}); });

  /* 13. photographs drift at their own pace while the page scrolls */
  [['.img-sec .ph',60,-60],['.tg .p1',70,-70],['.tg .p2',-20,110],['.co .ph',50,-50]].forEach(function(p){ $(p[0]).forEach(function(el){
    g.fromTo(el,{y:p[1]},{y:p[2],ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}); }); });

  /* 14. the news cards: the same soft light under the cursor */
  $('.nw li a').forEach(function(card){
    card.addEventListener('pointermove',function(e){ var r=card.getBoundingClientRect(); card.style.setProperty('--mx',(e.clientX-r.left)+'px'); card.style.setProperty('--my',(e.clientY-r.top)+'px'); }); });

  /* 15. How we work: the step at the middle of the screen lights its number and sets the counter and bar on the right */
  var hwBig=document.querySelector('.hw-big'), hwName=document.querySelector('.hw-name'), hwBars=$('.hw-bar i'), hwSteps=$('.hw-step');
  function hwSet(i){ if(!hwBig||!hwSteps[i]) return; hwBig.textContent=('0'+(i+1)).slice(-2); hwName.textContent=hwSteps[i].querySelector('h3').textContent.replace(/^\d+/,'');
    hwBars.forEach(function(b,k){ b.classList.toggle('on',k<=i); }); }
  hwSteps.forEach(function(st,i){
    ST.create({trigger:st,start:'top 55%',end:'bottom 55%',toggleClass:{targets:st,className:'on'},onToggle:function(self){ if(self.isActive) hwSet(i); }});
    g.from($('.hw-sub li',st),{autoAlpha:0,y:14,duration:.7,stagger:.06,ease:'expo.out',scrollTrigger:{trigger:st,start:'top 75%',once:true}}); });
  hwSet(0);

  /* layout settles after fonts and images; measure again */
  addEventListener('load',function(){ ST.refresh(); });
})();

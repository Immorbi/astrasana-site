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
    var logoEl=document.querySelector('.hd .logo'), lgW=logoEl&&logoEl.querySelector('.l-white');
    var rv=document.createElement('div'); rv.className='reveal'; chm.classList.add('revealed'); rv.appendChild(chm); stage.appendChild(rv);
    var isV=hv.tagName==='VIDEO', vt={t:0}, want=0, seeking=false;
    function seek(){ if(!isV) return; var d=hv.duration; if(!d||!isFinite(d)) return; want=Math.min(d-.04,vt.t*d); if(!seeking&&Math.abs(hv.currentTime-want)>.02){ seeking=true; hv.currentTime=want; }}
    if(isV){ hv.pause(); hv.muted=true;
      var prime=function(){ var pr=hv.play(); if(pr&&pr.then) pr.then(function(){ hv.pause(); hv.currentTime=0; }).catch(function(){}); else hv.pause(); };
      if(hv.readyState>=1) prime(); else hv.addEventListener('loadedmetadata',prime,{once:true});
      var unposter=function(){ hv.removeAttribute('poster'); }; if(hv.readyState>=2) unposter(); else hv.addEventListener('loadeddata',unposter,{once:true});
      hv.addEventListener('seeked',function(){ seeking=false; if(Math.abs(hv.currentTime-want)>.02){ seeking=true; hv.currentTime=want; } }); }
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
      rv.classList.toggle('open',rb>=.999); rv.classList.toggle('on',ra>0||rb>0);
      /* the header turns white once the dark map fills the screen */
      rv.classList.toggle('cover',rb>=.999); if(window.__hdTone) window.__hdTone();
      /* while the window grows, the white logo shows only inside it: the same signifier mask, placed relative to the logo */
      if(lgW){ var part=(ra>0||rb>0)&&rb<.999, st=lgW.style;
        if(part){ var lr=logoEl.getBoundingClientRect(), sr=stage.getBoundingClientRect(), mi=getComputedStyle(rv).webkitMaskImage||getComputedStyle(rv).maskImage;
          st.opacity='1'; st.webkitMaskImage=st.maskImage=mi; st.webkitMaskRepeat=st.maskRepeat='no-repeat';
          st.webkitMaskSize=st.maskSize=S.toFixed(1)+'px auto';
          st.webkitMaskPosition=st.maskPosition=(sr.left+px-AX*S-lr.left).toFixed(1)+'px '+(sr.top+py-AY*S*AR-lr.top).toFixed(1)+'px'; }
        else if(st.opacity){ st.opacity=''; st.webkitMaskImage=st.maskImage=''; } }
      /* the header is dark over the video and light once the white map has taken most of the screen */
      
      /* the map builds up as the window opens */
      if(window.__mapProgress) window.__mapProgress(Math.min(1,ra*.25+rb*1.05)); }
    place(); addEventListener('resize',place);
    var words=$('.hero .stage h1,.hero .stage .meta,.hero .stage .intro');
    var mlk={k:0}; if(window.__mapLabels) window.__mapLabels(0);
    var mtx=document.querySelector('.hero .mapt'); if(mtx) g.set(mtx,{autoAlpha:0,y:24});
    var tl=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:stage,start:'top top',end:'+=200%',pin:true,scrub:true,anticipatePin:1,invalidateOnRefresh:true}});
    tl.to(vt,{t:1,duration:.56,onUpdate:seek},0)
      .to(m,{a:1,duration:.2,ease:'power2.out',onUpdate:place},.5)
      .to(words,{autoAlpha:0,yPercent:-8,duration:.12,ease:'power1.in'},.7)
      .to(m,{b:1,duration:.28,ease:'power2.in',onUpdate:place},.72)
      /* once the map fills the screen, the town dots, lines and plates come in softly, stay a while, then leave before the hand-over */
      /* the caption waits until the map fills the screen, then rises in softly with the town labels */
      .to(mtx,{autoAlpha:1,y:0,duration:.14,ease:'power2.out'},1.02)
      .to(mlk,{k:1,duration:.16,ease:'power1.out',onUpdate:function(){ if(window.__mapLabels) window.__mapLabels(mlk.k); }},1.04)
      /* before the hand-over the labels go back the way they came (plates, then lines, then dots) and the caption fades;
         the labels are driven only through __mapLabels, never tweened directly, so scrolling back restores them */
      .to(mlk,{k:0,duration:.1,ease:'power1.in',onUpdate:function(){ if(window.__mapLabels) window.__mapLabels(mlk.k); }},1.34)
      .to(mtx,{autoAlpha:0,duration:.1,ease:'power1.in'},1.34)
      .to({},{duration:.04});
  }

  /* 2. section headlines: lines rise from a mask when the headline reaches 80% of the screen */
  $('main h2').forEach(function(h){ if(h.closest('.hero')||h.closest('.sg')||h.closest('.cu')||(h.closest('.fig')&&innerWidth>980)) return; own(h);
    Split.create(keep(h),{type:'lines',mask:'lines',autoSplit:true,onSplit:function(s){
      return g.from(s.lines,{yPercent:110,duration:.8,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 80%',once:true}}); }}); });

  /* 3. statements: words fill with colour as they are read (scrubbed to the scroll) */
  function highlight(el,muted,active){ own(el);
    var s=Split.create(keep(el),{type:'words,lines',mask:'lines'}), w=s.words; if(!w.length) return;
    g.set(w,{color:muted});
    ST.create({trigger:el,start:'top 85%',end:'top 35%',scrub:true,onUpdate:function(self){ var head=self.progress*w.length;
      w.forEach(function(word,i){ g.set(word,{color:g.utils.interpolate(muted,active,g.utils.clamp(0,1,head-i))}); }); }}); }
  $('.ph-sec .lede').forEach(function(el){ highlight(el,'rgba(35,31,32,.18)','#231f20'); });
  $('.co .ttl .lede').forEach(function(el){ highlight(el,'rgba(26,6,58,.2)','#1A063A'); });
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
  [['#chain ol','li'],['.pr .list','li'],['.nw ol','li'],['.steps','li']].forEach(function(p){ var box=document.querySelector(p[0]); if(!box) return; if(p[0]==='.pr .list'&&innerWidth>980) return; own(box);
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
  /* the header is dark exactly while a dark band is under it */
  /* the hero video is light: over the hero the header turns dark only once the dark map panel has opened over it */
  var darkEls=$('.x3d-sec,.ct,.cu'), hst=document.querySelector('.hero .stage'), hrv=document.querySelector('.hero .reveal');
  function hdTone(){ var on=darkEls.some(function(e){ var r=e.getBoundingClientRect(); if(!(r.top<=64&&r.bottom>64)) return false;
      /* the pinned About Us band counts only while the Pharmacies block has not yet slid over the header */
      if(e.classList.contains('x3d-sec')){ var ps=document.querySelector('.ph-sec'); if(ps&&ps.getBoundingClientRect().top<=72) return false; } return true; });
    if(!on){ var fz=document.querySelector('.fig.zoom.on.hd-dark'); if(fz){ var zr=fz.getBoundingClientRect(); on=zr.top<=64&&zr.bottom>64; } }
    if(!on&&hst&&hrv&&hrv.classList.contains('cover')){ var r=hst.getBoundingClientRect(); on=r.top<=64&&r.bottom>64; }
    hd.classList.toggle('dark',on); }
  window.__hdTone=hdTone;   addEventListener('scroll',hdTone,{passive:true}); addEventListener('resize',hdTone); hdTone();

  /* 12. the bracket corners around the Companies statement open from the middle */
  $('.co .brk').forEach(function(b){ g.fromTo(b,{clipPath:'inset(50% 0% 50% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:b,start:'top 80%',once:true}}); });

  /* 13. photographs drift at their own pace while the page scrolls */
  [['.img-sec .ph',60,-60],['.tg .p1',70,-70],['.tg .p2',-20,110],].forEach(function(p){ $(p[0]).forEach(function(el){
    g.fromTo(el,{y:p[1]},{y:p[2],ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}); }); });

  /* 15. How we work: the step at the middle of the screen lights its number and sets the counter and bar on the right */
  var hwBig=document.querySelector('.hw-big'), hwName=document.querySelector('.hw-name'), hwBars=$('.hw-bar i'), hwSteps=$('.hw-step');
  function hwSet(i){ if(!hwBig||!hwSteps[i]) return; hwBig.textContent=('0'+(i+1)).slice(-2); hwName.textContent=hwSteps[i].querySelector('h3').textContent.replace(/^\d+/,'');
    hwBars.forEach(function(b,k){ b.classList.toggle('on',k<=i); }); }
  hwSteps.forEach(function(st,i){
    ST.create({trigger:st,start:'top 55%',end:'bottom 55%',toggleClass:{targets:st,className:'on'},onToggle:function(self){ if(self.isActive) hwSet(i); }});
    g.from($('.hw-sub li',st),{autoAlpha:0,y:14,duration:.7,stagger:.06,ease:'expo.out',scrollTrigger:{trigger:st,start:'top 75%',once:true}}); });
  hwSet(0);

  /* 16. a thin progress line along the top of the page */
  var sp=document.querySelector('.sprog'); if(sp) g.to(sp,{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:.3}});
  /* 17. figures map. On desktop the camera pulls back from Switzerland to Europe: the section is pinned, the map card starts
         full-screen with only Switzerland in view (as the hero map leaves it), the view zooms out while the rest of the
         continent fades in around it and the card settles into its place; then the group's other countries drop onto the map
         (dot, leader line, plate) and the figures appear. On phones the map simply builds up when it arrives. */
  var pm=document.querySelector('.pmap'); if(pm){
    var land=$('.pm-land path',pm).sort(function(a,b){ return a.getAttribute('data-x')-b.getAttribute('data-x'); });
    var q=function(sel){ return pm.querySelector(sel); };
    /* the group's countries land one after another: dot pops, the leader line draws, the plate slides in */
    function drops(tl,list,t0){ list.forEach(function(c,i){ var at=t0+i*.26, hl=q('.hl[data-c="'+c+'"]'), dt=q('.dot[data-c="'+c+'"]'), ln=q('.ln[data-c="'+c+'"]'), lb=q('.lbl[data-c="'+c+'"]');
      if(hl&&c!=='ch') tl.from(hl,{y:-34,scale:1.3,autoAlpha:0,transformOrigin:'50% 50%',duration:.9,ease:'back.out(1.5)'},at);
      if(dt){ tl.from(dt,{autoAlpha:0,duration:.2},at+.45).from(dt.querySelector('.core'),{scale:0,transformOrigin:'50% 50%',duration:.5,ease:'back.out(3)'},at+.45); }
      if(ln){ var L=ln.getTotalLength(); ln.style.strokeDasharray=L; tl.fromTo(ln,{strokeDashoffset:L,autoAlpha:0},{strokeDashoffset:0,autoAlpha:1,duration:.45,ease:'power2.out'},at+.55); }
      if(lb) tl.from(lb,{autoAlpha:0,x:c==='uk'||c==='ch'?10:-10,duration:.6,ease:'expo.out'},at+.7); }); }
    var fig=pm.closest('.fig'), card=pm.closest('.pm'), zoom=fig&&card&&innerWidth>980;
    if(zoom){
      own(fig); $('.up',fig).forEach(own); fig.classList.add('zoom','hd-dark'); pm.setAttribute('preserveAspectRatio','xMidYMid slice');
      /* Switzerland as the hero map draws it (detailed), laid over the figures map in its place: the camera pulls back from
         this very shape, and only once the whole of Europe is in view does it give way to the map's own outline */
      var heroCn=document.querySelector('.hero .chmap .cn'), chHl=q('.hl[data-c="ch"]'), chd=null;
      if(heroCn&&chHl){ chd=document.createElementNS('http://www.w3.org/2000/svg','path'); chd.setAttribute('class','chd'); chd.setAttribute('d',heroCn.getAttribute('d')); chHl.parentNode.insertBefore(chd,chHl.nextSibling); }
      function fitChd(){ if(!chd) return; var hb=heroCn.getBBox(), fb=chHl.getBBox(), sx=fb.width/hb.width, sy=fb.height/hb.height;
        chd.setAttribute('transform','translate('+fb.x+' '+fb.y+') scale('+sx+' '+sy+') translate('+(-hb.x)+' '+(-hb.y)+')'); }
      /* where Switzerland sits on screen when the hero map fills it (its build-up scale undone) */
      function heroCH(){ var st=document.querySelector('.hero .stage'); if(!heroCn||!st) return null;
        var a=heroCn.getBoundingClientRect(), b=st.getBoundingClientRect(), m=/scale\(([\d.]+)/.exec(heroCn.style.transform||''), sc=m?+m[1]:1, w=a.width/sc, h=a.height/sc;
        return {cx:a.left-b.left-(w-a.width)*.5+w/2, cy:a.top-b.top-(h-a.height)*.6+h/2, w:w}; }
      var VW=1000, AR=.62, V0={x:0,y:0,w:VW}, V1={x:0,y:0,w:VW}, v={t:0};
      /* the end view fits on any screen: the group's part of the map (UK to Czechia, Japan's inset) sits whole in the left
         part of the screen, below the header, whatever the screen's proportions */
      var RC={x:30,y:150,w:620,h:452};
      function endView(){ var W=innerWidth, H=innerHeight, aw=W*.6, top=80, ah=H-top-24, sc=Math.min(aw/RC.w,ah/RC.h);
        V1.w=W/sc; V1.h=H/sc; V1.x=RC.x+RC.w/2-(W*.31)/sc; V1.y=RC.y+RC.h/2-(top+ah/2)/sc; }
      /* the start view: Switzerland on screen exactly where and as large as the hero map leaves it (viewBox with "slice") */
      function measure(){ fitChd(); var R=heroCH(), fb=chHl.getBBox(), vw=innerWidth, vh=innerHeight;
        if(!R){ R={cx:vw*.62,cy:vh*.52,w:vw*.4}; }
        var s=R.w/fb.width, cx=fb.x+fb.width/2, cy=fb.y+fb.height/2;
        /* viewBox with the screen's own proportions, so one map unit is the same size across and down */
        V0.w=vw/s; V0.h=vh/s; V0.x=cx-R.cx/s; V0.y=cy-R.cy/s; endView(); vb(); }
      function vb(){ var t=v.t, w=Math.exp(Math.log(V0.w)+(Math.log(V1.w)-Math.log(V0.w))*t), k=(w-V0.w)/(V1.w-V0.w||1), h=w*(V0.h/V0.w);
        pm.setAttribute('viewBox',(V0.x+(V1.x-V0.x)*k).toFixed(2)+' '+(V0.y+(V1.y-V0.y)*k).toFixed(2)+' '+w.toFixed(2)+' '+h.toFixed(2));
        var x=Math.max(0,Math.min(1,(t-.6)/.2)); if(chd) chd.style.opacity=1-x; chHl.style.opacity=x;
        fig.style.setProperty('--zk',Math.max(0,Math.min(1,(t-.55)/.4)).toFixed(3)); }
      ST.addEventListener('refresh',measure);
      var others=['uk','be','cz','jp'], jpBox=[q('.jp .box'),q('.jp .jt')].filter(Boolean);
      /* the title word by word, then each figure row: all scrubbed, so the map stands still while the text builds up */
      var h2=fig.querySelector('h2'); h2.innerHTML=h2.innerHTML.split(/(\s+|&nbsp;)/).map(function(t){ return !t||/^(\s+|&nbsp;)$/.test(t)?t:'<span class="fw">'+t+'</span>'; }).join('');
      var hw=$('.fw',h2), rows=$('dl>div',fig);
      g.set(land,{opacity:0}); measure();
      var zt=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:fig,start:'top top',end:'+=300%',pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
        onEnter:function(){ fig.classList.add('on'); }, onLeaveBack:function(){ fig.classList.remove('on'); }}});
      /* 0 to 1: the camera pulls back from Switzerland to Europe */
      zt.to(v,{t:1,duration:1,ease:'power2.inOut',onUpdate:vb},0)
        .to(land,{opacity:1,duration:.35,stagger:{amount:.35,from:'center'}},.25);
      /* 1 to 2.6: the group's countries land one after another, with dot, line and plate; Japan's inset comes in */
      zt.fromTo(jpBox,{autoAlpha:0},{autoAlpha:1,duration:.3},1.6);
      drops(zt,['ch'].concat(others),1.05);
      /* 2.6 to 3.8: the title word by word, then the figures one row at a time */
      zt.fromTo(hw,{autoAlpha:0,yPercent:40},{autoAlpha:1,yPercent:0,duration:.25,stagger:.12,ease:'power2.out'},2.6)
        .fromTo(rows,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.3,stagger:.28,ease:'power2.out'},3.0)
        .to({},{duration:.4});
    } else {
      var tl=g.timeline({scrollTrigger:{trigger:pm,start:'top 72%',once:true}});
      tl.from(land,{autoAlpha:0,duration:.5,stagger:{amount:.8},ease:'power1.out'},0)
        .from(q('.jp .box'),{autoAlpha:0,y:16,duration:.6,ease:'expo.out'},.5).from(q('.jp .jt'),{autoAlpha:0,duration:.4},.7);
      ['ch','uk','be','cz','jp'].forEach(function(c,i){ var hl=q('.hl[data-c="'+c+'"]'); if(hl&&c==='ch') tl.from(hl,{y:-34,scale:1.3,autoAlpha:0,transformOrigin:'50% 50%',duration:.9,ease:'back.out(1.5)'},.7); });
      drops(tl,['ch','uk','be','cz','jp'],.7); }
  }
  /* 18. team cards rise one after another; partner dots on the pharmacy map are already staggered in CSS */
  var tml=document.querySelector('.tm-list'); if(tml){ own(tml); g.from($('li',tml),{y:40,autoAlpha:0,duration:.9,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:tml,start:'top 80%',once:true}}); }

  /* 19. statement: the signifier grows from a small mark into a wide arc on the left, as on the reference; then the title
         rises and the words of the line fill in, all scrubbed while the section is pinned */
  var sg=document.querySelector('.sg'); if(sg){ var mk=sg.querySelector('.sg-mark'), big=sg.querySelector('.sg-big'), lede=sg.querySelector('.sg-lede');
    var ws=[]; lede.innerHTML=lede.innerHTML.split(/(\s+)/).map(function(t){ return /^\s+$/.test(t)||!t?t:'<span class="w">'+t+'</span>'; }).join(''); ws=$('.w',lede);
    g.set(mk,{xPercent:-50,yPercent:-50,transformOrigin:'50% 50%'});
    var st=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sg,start:'top top',end:'+=220%',pin:true,scrub:.6,anticipatePin:1}});
    st.fromTo(mk,{scale:.22,x:0},{scale:4.4,x:function(){ return -innerWidth*.52; },ease:'power2.inOut',duration:1},0)
      .fromTo(lede,{autoAlpha:0},{autoAlpha:1,duration:.05},.85)
      .fromTo(big,{autoAlpha:0,y:60},{autoAlpha:1,y:0,ease:'power3.out',duration:.3},.72)
      .fromTo(ws,{opacity:.12},{opacity:1,stagger:.035,duration:.12},.9)
      .to({},{duration:.25}); } ST.sort(); ST.refresh();

  /* 20. cultivation: the scene stands still while the scroll moves through it. The dropper bottle, centred and close, is
         scrubbed and the view travels down it from the dropper's bulb to the base of the bottle; the first text rises
         through the left side and leaves, then the second rises through the right side */
  var cu=document.querySelector('.cu'); if(cu){ var cv=cu.querySelector('.cu-v'), ca=cu.querySelector('.cu-a'), cb=cu.querySelector('.cu-b');
    cv.pause(); var cw=0, cs=false;
    function go(){ var d=cv.duration; if(!d||!isFinite(d)) return; if(!cs&&Math.abs(cv.currentTime-cw)>.03){ cs=true; cv.currentTime=cw; } }
    cv.addEventListener('seeked',function(){ cs=false; go(); });
    var cun=function(){ cv.removeAttribute('poster'); }; if(cv.readyState>=2) cun(); else cv.addEventListener('loadeddata',cun,{once:true});
    var ct=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:cu,start:'top top',end:'+=320%',pin:true,scrub:.5,anticipatePin:1,
      onUpdate:function(self){ var p=self.progress, d=cv.duration; if(d&&isFinite(d)){ cw=Math.min(d-.05,p*d); go(); }
        cv.style.objectPosition='50% '+(14+72*p).toFixed(2)+'%'; cu.style.setProperty('--side',p.toFixed(3)); }}});
    ct.fromTo(ca,{yPercent:60,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.18},0)
      .to(ca,{yPercent:-60,autoAlpha:0,duration:.2},.34)
      .fromTo(cb,{yPercent:60,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.2},.5)
      .to({},{duration:.3},.7); }

  /* 21. Companies, light: two large outlines of the signifier drift at their own speeds behind the statement, the title a
         little slower than the page and the corner brackets a little faster (parallax depth) */
  var co=document.querySelector('.co'); if(co){ var pr={trigger:co,start:'top bottom',end:'bottom top',scrub:true};
    g.fromTo(co.querySelector('.co-m1'),{yPercent:-18,rotate:-4},{yPercent:22,rotate:4,ease:'none',scrollTrigger:pr});
    g.fromTo(co.querySelector('.co-m2'),{yPercent:30,rotate:6},{yPercent:-30,rotate:-6,ease:'none',scrollTrigger:pr});
    g.fromTo(co.querySelector('.ttl h2'),{y:60},{y:-60,ease:'none',scrollTrigger:pr});
    g.fromTo(co.querySelector('.ttl .lede'),{y:30},{y:-30,ease:'none',scrollTrigger:pr});
    g.fromTo(co.querySelector('.brk'),{scale:.94},{scale:1.06,ease:'none',scrollTrigger:pr}); }

  /* 22. About Us stays pinned when its end is reached and the Pharmacies block slides up over it, while the band beneath
         sinks back (slight scale-down and darkening); the globe drifts slower than the page (parallax) */
  var ax=document.querySelector('.x3d-sec'), px=document.querySelector('.ph-sec');
  if(ax&&px){ var axi=ax.querySelector('.grid');
    ST.create({trigger:ax,start:'bottom bottom',end:function(){ return '+='+innerHeight; },pin:true,pinSpacing:false});
    g.to(axi,{scale:.92,opacity:.35,ease:'none',transformOrigin:'50% 100%',scrollTrigger:{trigger:px,start:'top bottom',end:'top top',scrub:true}});
    var gl=ax.querySelector('.pv'); if(gl) g.fromTo(gl,{y:90},{y:-90,ease:'none',scrollTrigger:{trigger:ax,start:'top bottom',end:'bottom top',scrub:true}}); }

  /* 23. hero picture: the dark version shows through a soft circle that follows the cursor (eased); the headline has a white
         twin inside the same circle, so it stays legible on the dark */
  var hp=document.querySelector('.hero .hpic'); if(hp){ var st2=hp.closest('.stage'), h1=st2.querySelector('h1'), tw=null;
    if(h1){ tw=h1.cloneNode(true); tw.removeAttribute('id'); tw.className='h1w'; tw.setAttribute('aria-hidden','true'); st2.appendChild(tw); }
    function fitTw(){ if(!tw) return; var a=h1.getBoundingClientRect(), b=st2.getBoundingClientRect(), cs=getComputedStyle(h1);
      tw.style.cssText='left:'+(a.left-b.left)+'px;top:'+(a.top-b.top)+'px;width:'+(a.width+2)+'px;max-width:none;font-size:'+cs.fontSize+';line-height:'+cs.lineHeight;
      /* correct for whatever box the twin is placed against: measure it and shift by the difference */
      var t2=tw.getBoundingClientRect(), dx=a.left-t2.left, dy=a.top-t2.top; tw.style.left=(a.left-b.left+dx)+'px'; tw.style.top=(a.top-b.top+dy)+'px';
      tw.style.setProperty('--ox',(a.left-b.left)+'px'); tw.style.setProperty('--oy',(a.top-b.top)+'px'); }
    var tgt={x:0,y:0,r:0}, cur={x:0,y:0,r:0}, R=Math.max(150,Math.min(innerWidth,innerHeight)*.27), raf=0;
    function tick(){ cur.x+=(tgt.x-cur.x)*.07; cur.y+=(tgt.y-cur.y)*.07; cur.r+=(tgt.r-cur.r)*.06;
      st2.style.setProperty('--mx',cur.x.toFixed(1)+'px'); st2.style.setProperty('--my',cur.y.toFixed(1)+'px'); st2.style.setProperty('--mr',cur.r.toFixed(1)+'px');
      raf=(Math.abs(tgt.x-cur.x)+Math.abs(tgt.y-cur.y)+Math.abs(tgt.r-cur.r)>.5)?requestAnimationFrame(tick):0; }
    function kick(){ if(!raf) raf=requestAnimationFrame(tick); }
    /* the lens belongs to the resting first screen: once the scroll starts the stage (headline fading, window opening) it closes
       quickly and the white twin is hidden, so nothing is left doubled over the moving headline */
    var still=function(){ return scrollY<24; };
    st2.addEventListener('pointermove',function(e){ if(!still()) return; var b=st2.getBoundingClientRect(); tgt.x=e.clientX-b.left; tgt.y=e.clientY-b.top; if(cur.r<1){ cur.x=tgt.x; cur.y=tgt.y; } tgt.r=R; kick(); });
    addEventListener('scroll',function(){ var on=still(); if(tw) tw.style.display=on?'':'none'; if(!on&&tgt.r){ tgt.r=0; cur.r=Math.min(cur.r,R*.4); kick(); } },{passive:true});
    st2.addEventListener('pointerleave',function(){ tgt.r=0; kick(); });
    fitTw(); addEventListener('resize',function(){ R=Math.max(150,Math.min(innerWidth,innerHeight)*.27); fitTw(); }); if(document.fonts) document.fonts.ready.then(fitTw); ST.addEventListener('refresh',fitTw); }

  /* 24. products: the six categories as a stack of large cards. The list is pinned and each card in turn slides up over the
         one before, which sinks back (smaller, darker); the count on the side follows. Desktop only; phones keep the grid */
  var pl=document.querySelector('.pr .list'); if(pl&&innerWidth>980){ own(pl); var cards=$('li',pl), n=cards.length;
    pl.classList.add('stack'); var cnt=document.createElement('p'); cnt.className='pr-count'; cnt.setAttribute('aria-hidden','true'); pl.closest('.pr').querySelector('.head').appendChild(cnt);
    cards.forEach(function(li,i){ own(li); var k=document.createElement('i'); k.className='pr-n'; k.textContent=String(i+1).padStart(2,'0'); li.insertBefore(k,li.firstChild); li.style.zIndex=i+1; });
    function count(i){ cnt.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b> / '+String(n).padStart(2,'0'); }
    count(0); g.set(cards.slice(1),{y:function(){ return innerHeight; }});
    var prs=pl.closest('.pr'); prs.classList.add('stacked');
    var pt=g.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:prs,start:'top top',end:'+='+(n-1)*55+'%',pin:true,scrub:.5,anticipatePin:1,
      onUpdate:function(self){ count(Math.min(n-1,Math.round(self.progress*(n-1)))); }}});
    cards.forEach(function(li,i){ if(!i) return; var at=i-1;
      pt.to(li,{y:0,duration:1,ease:'power2.out'},at);
      for(var j=0;j<i;j++) pt.to(cards[j],{scale:1-.05*(i-j),yPercent:-3.2*(i-j),duration:1,ease:'power2.out'},at); }); }

  /* layout settles after fonts and images; measure again */
  addEventListener('load',function(){ ST.refresh(); });
})();

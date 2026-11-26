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

  /* 1. hero: the title rises line by line, then the map panel opens from the left */
  var h1=document.getElementById('t-hero');
  if(h1){ own(h1);
    Split.create(keep(h1),{type:'lines',mask:'lines',autoSplit:true,onSplit:function(s){ return g.from(s.lines,{yPercent:110,stagger:.15,duration:1.25,ease:'expo.out',delay:.15}); }}); }
  var panel=document.querySelector('.hero .chm');
  if(panel) g.fromTo(panel,{clipPath:'inset(0% 100% 0% 0% round 10px)'},{clipPath:'inset(0% 0% 0% 0% round 10px)',duration:1.3,ease:'expo.out',delay:.55});
  $('.hero .meta,.hero .intro').forEach(function(el,i){ own(el); g.from(el,{autoAlpha:0,y:16,duration:.9,ease:'expo.out',delay:.5+i*.1}); });

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
  $('.co .ttl .lede,.ph-sec .lede').forEach(function(el){ highlight(el,'rgba(35,31,32,.18)','#231f20'); });
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

  /* layout settles after fonts and images; measure again */
  addEventListener('load',function(){ ST.refresh(); });
})();

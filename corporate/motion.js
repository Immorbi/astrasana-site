/* Motion environment for the second version of the site (v2.html).
   Tools, served from land/vendor/motion/ (fixed versions, no build step):
     GSAP 3.15.0 with ScrollTrigger, SplitText, CustomEase and Flip (GreenSock standard licence, free for commercial use)
     Lenis 1.3.27 smooth scrolling (MIT)
   This file only sets the tools up; the effects themselves are added on top of it, one prototype at a time.

   Switches:
     <html data-lenis>   turns on Lenis smooth scrolling (or add ?lenis=1 to the address while experimenting)
     prefers-reduced-motion: Lenis stays off and Motion.reduce is true, so effects should show their final state
     ?motion=on          overrides reduced motion for the rest of the visit (reviews); ?motion=off returns to the device setting

   What other code can use:
     window.Motion.gsap, .ScrollTrigger, .SplitText, .CustomEase, .Flip   the registered tools
     window.Motion.lenis       the Lenis instance, or null when smooth scrolling is off
     window.Motion.reduce      true when the visitor prefers reduced motion
     window.Motion.scrollTo(target, {offset})   scrolls with Lenis when it is on (Lenis honours the target's scroll-margin-top itself); returns false when it is off */
(function(){
  var g=window.gsap; if(!g){ console.warn('motion.js: GSAP did not load'); return; }
  var plugins=['ScrollTrigger','SplitText','CustomEase','Flip'].map(function(n){ return window[n]; }).filter(Boolean);
  g.registerPlugin.apply(g,plugins);

  /* ?motion=on shows the motion even when the device asks for reduced motion (for reviews); remembered for the visit, ?motion=off clears it */
  var force=false; try{ if(/[?&]motion=on\b/.test(location.search)) sessionStorage.setItem('as-motion','on'); if(/[?&]motion=off\b/.test(location.search)) sessionStorage.removeItem('as-motion'); force=sessionStorage.getItem('as-motion')==='on'; }catch(e){}
  var reduce=!force&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wantLenis=document.documentElement.hasAttribute('data-lenis')||/[?&]lenis=1\b/.test(location.search);
  var lenis=null;

  /* Lenis drives the scroll; GSAP's ticker drives Lenis, so ScrollTrigger and Lenis read the same position every frame */
  if(wantLenis&&!reduce&&window.Lenis){
    lenis=new window.Lenis({ autoRaf:false, anchors:false, lerp:.1, wheelMultiplier:1 });
    if(window.ScrollTrigger) lenis.on('scroll',window.ScrollTrigger.update);
    g.ticker.add(function(t){ lenis.raf(t*1000); });
    g.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis-on');
  }

  window.Motion={ gsap:g, ScrollTrigger:window.ScrollTrigger, SplitText:window.SplitText, CustomEase:window.CustomEase, Flip:window.Flip,
    lenis:lenis, reduce:reduce,
    scrollTo:function(target,opt){ opt=opt||{}; if(lenis){ lenis.scrollTo(target,{ offset:opt.offset||0, duration:opt.duration||1.1 }); return true; } return false; } };

  /* fonts change line lengths; recalculate trigger positions once they have loaded */
  if(document.fonts&&document.fonts.ready&&window.ScrollTrigger) document.fonts.ready.then(function(){ window.ScrollTrigger.refresh(); });
})();

/* V2 pages: header and phone menu, reveals, map label plates, hero title split; shared by the homepage and the subpages */
(function(){
  var hd=document.getElementById('hd'), btn=hd.querySelector('.menu-btn'), menu=document.getElementById('menu');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: a hairline once the page scrolls; the phone menu */
  function onScroll(){ hd.classList.toggle('scrolled',scrollY>8); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  function setMenu(open){ hd.classList.toggle('open',open); btn.setAttribute('aria-expanded',open); btn.setAttribute('aria-label',open?'Close menu':'Open menu'); document.body.style.overflow=open?'hidden':''; }
  btn.addEventListener('click',function(){ setMenu(!hd.classList.contains('open')); });
  menu.addEventListener('click',function(e){ if(e.target.closest('a')) setMenu(false); });
  addEventListener('keydown',function(e){ if(e.key==='Escape'&&hd.classList.contains('open')){ setMenu(false); btn.focus(); } });

  /* reveals: photographs open from the top, text rises a little */
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{rootMargin:'0px 0px -12% 0px'});
    document.querySelectorAll('.rv,.rv .up').forEach(function(el){ io.observe(el); });
  } else document.querySelectorAll('.rv,.up').forEach(function(el){ el.classList.add('in'); });

  /* map labels: a white plate fitted to each label's text */
  function plates(){ document.querySelectorAll('.chmap .lbl,.pmap .lbl,.phmap .lbl').forEach(function(g){ var r=g.querySelector('rect'), ts=g.querySelectorAll('text'), x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    ts.forEach(function(t){ var b=t.getBBox(); x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.width); y1=Math.max(y1,b.y+b.height); });
    if(x1<x0) return; var px=9, py=6, X0=x0-px, Y0=y0-py, X1=x1+px, Y1=y1+py; r.setAttribute('x',X0); r.setAttribute('y',Y0); r.setAttribute('width',X1-X0); r.setAttribute('height',Y1-Y0);
    }); }
  window.__plates=plates;   if(document.fonts&&document.fonts.ready) document.fonts.ready.then(plates); plates(); addEventListener('resize',plates);

  /* hero title: split into words that rise once */
  var h1=document.getElementById('t-hero');
  if(h1&&!reduce&&!document.documentElement.hasAttribute('data-lenis')){ /* V2 animates the title with SplitText (corporate/v2.js) */ var k=0; (function wrap(node){ [].slice.call(node.childNodes).forEach(function(c){
      if(c.nodeType===3){ var frag=document.createDocumentFragment(); c.textContent.split(/([ \t\n\r]+)/).forEach(function(t){ if(!t) return; if(/^[ \t\n\r]+$/.test(t)){ frag.appendChild(document.createTextNode(t)); return; }
          var w=document.createElement('span'); w.className='w'; var i=document.createElement('span'); i.textContent=t; i.style.setProperty('--k',k++); w.appendChild(i); frag.appendChild(w); }); c.parentNode.replaceChild(frag,c); }
      else if(c.nodeType===1) wrap(c); }); })(h1);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ h1.classList.add('go'); }); }); }

  /* figures: count up once when the section arrives; the width is set to the final number so nothing shifts */
  var figs=[].slice.call(document.querySelectorAll('.fig dd'));
  figs.forEach(function(dd){ var t=dd.firstChild; if(!t||t.nodeType!==3) return; var m=/^(\D*)(\d+)$/.exec(t.textContent.trim()); if(!m) return;
    var n=document.createElement('span'); n.className='n'; n.textContent=t.textContent.trim(); dd.replaceChild(n,t); dd._n={el:n,pre:m[1],to:+m[2]}; });
  function countUp(){ figs.forEach(function(dd,idx){ var d=dd._n; if(!d) return; d.el.style.minWidth=d.el.getBoundingClientRect().width+'px'; var t0=null, dur=1300+idx*150;
      function step(ts){ if(t0===null) t0=ts; var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3); d.el.textContent=d.pre+Math.round(d.to*e); if(p<1) requestAnimationFrame(step); }
      d.el.textContent=d.pre+'0'; requestAnimationFrame(step); }); }
  var figSec=document.querySelector('.fig');
  if(figSec&&!reduce&&'IntersectionObserver' in window){ var fo=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ fo.disconnect(); countUp(); } },{threshold:.35}); fo.observe(figSec); }

  /* partners: a second copy makes the band seamless */
  var mq=document.getElementById('mq');
  if(mq){ var ul=mq.querySelector('.logos'), dup=ul.cloneNode(true); dup.setAttribute('aria-hidden','true'); dup.removeAttribute('aria-label'); dup.querySelectorAll('img').forEach(function(i){ i.alt=''; }); ul.parentNode.appendChild(dup); }

  /* the chain: the line fills while the section crosses the screen; a stop lights when the fill reaches it */
  var chol=document.querySelector('.ch ol');
  if(chol){ var stops=[].slice.call(chol.querySelectorAll('li')), track=chol.querySelector('.track'), played=false;
    function vert(){ return innerWidth<=1100; }
    /* on phones the line runs from the first badge to the last one */
    function size(){ if(!vert()){ track.style.removeProperty('--trackh'); return; } var a=stops[0].getBoundingClientRect(), z=stops[stops.length-1].getBoundingClientRect(); track.style.setProperty('--trackh',Math.round(z.top-a.top)+'px'); }
    /* the parcel runs the line once when the row reaches the middle of the screen; each badge fills as the parcel reaches it */
    /* the cards light one after another as the run passes them */
    function setFill(f){ chol.style.setProperty('--fill',f.toFixed(3)); var n=stops.length; stops.forEach(function(li,i){ li.classList.toggle('lit',f>=(i+1)/n-.002); }); }
    function play(){ if(played) return; played=true; removeEventListener('scroll',check);
      if(reduce){ setFill(1); return; }
      var t0=null, dur=vert()?2400:1700; chol.classList.add('running');
      (function step(ts){ if(t0===null) t0=ts; var p=Math.min(1,(ts-t0)/dur), e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2; setFill(e);
        if(p<1) requestAnimationFrame(step); else setTimeout(function(){ chol.classList.remove('running'); },250); })(performance.now()); }
    function check(){ if(window.__chainScrub) return; var r=chol.getBoundingClientRect(), vh=innerHeight; if(r.top<=vh*.92&&r.bottom>0) play(); }
    window.__chainSet=function(f){ played=true; setFill(f); };
    size(); setFill(0); addEventListener('resize',function(){ size(); setFill(played?1:0); }); addEventListener('scroll',check,{passive:true}); check(); }

  /* entering the 3D story from About Us: settle into dark, then go (same tab) */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-3d]'); if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    e.preventDefault();
    var href=a.href;
    if(reduce){ location.href=href; return; }
    document.body.classList.add('leaving'); setTimeout(function(){ location.href=href; },380);
  });
  /* links to a section on this page glide there instead of jumping; the wheel or a touch takes over at any moment */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var id=a.getAttribute('href').slice(1); if(!id) return;
    var el=document.getElementById(id); if(!el) return;
    e.preventDefault();
    if(location.hash!=='#'+id) history.pushState(null,'','#'+id);
    var off=parseFloat(getComputedStyle(el).scrollMarginTop)||0;
    if(window.Motion&&Motion.scrollTo(el)){ el.setAttribute('tabindex','-1'); el.focus({preventScroll:true}); return; }
    var y0=scrollY, y1=Math.max(0,Math.min(el.getBoundingClientRect().top+scrollY-off,document.documentElement.scrollHeight-innerHeight)), dy=y1-y0;
    var done=function(){ el.setAttribute('tabindex','-1'); el.focus({preventScroll:true}); };
    if(reduce||Math.abs(dy)<2){ scrollTo(0,y1); done(); return; }
    var dur=Math.min(1100,Math.max(500,Math.abs(dy)*.35)), t0=null, stop=false;
    var halt=function(){ stop=true; };
    addEventListener('wheel',halt,{passive:true,once:true}); addEventListener('touchstart',halt,{passive:true,once:true});
    (function step(ts){ if(stop) return; if(t0===null) t0=ts; var p=Math.min(1,(ts-t0)/dur), k=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
      scrollTo(0,y0+dy*k); if(p<1) requestAnimationFrame(step); else { removeEventListener('wheel',halt); removeEventListener('touchstart',halt); done(); } })(performance.now());
  });
  /* back from the story (or the browser's back button): no veil left over */
  addEventListener('pageshow',function(){ document.body.classList.remove('leaving'); });

  /* contact form: opens the email app, as on the current site */
  var cform=document.getElementById('cform'); if(cform) cform.addEventListener('submit',function(e){ e.preventDefault(); var f=e.target;
    var body=f.msg.value+'\n\n'+f.name.value+(f.who.value?' ('+f.who.value+')':'')+'\n'+f.email.value;
    location.href='mailto:info@astrasana.com?subject='+encodeURIComponent('Enquiry from '+f.name.value)+'&body='+encodeURIComponent(body); });
})();

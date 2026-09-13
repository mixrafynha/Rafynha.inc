import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectModal from '../components/ProjectModal.jsx';
import CinematicGlobe from '../components/CinematicGlobe.jsx';
import CodeOrbit from '../components/CodeOrbit.jsx';
import { projects } from '../projectsData.js';

export default function Home(){
 const [active,setActive]=useState(null);
 const featured=projects.slice(0,7);
 useEffect(()=>{
   let raf=0;
   let lastCurrent=-1;
   const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
   const ease=(t)=>1-Math.pow(1-t,3);
   const reel=document.querySelector('.work-reel');
   const sticky=reel?.querySelector('.work-reel-sticky');
   const cards=reel?[...reel.querySelectorAll('.work-card')]:[];
   const nextButton=reel?.querySelector('.work-reel-next');
   if(!reel||!sticky||!cards.length) return;

   const setStates=(current)=>{
     if(current===lastCurrent) return;
     lastCurrent=current;
     cards.forEach((card,i)=>{
       const state=i===current?'current':i===current+1?'next':'hidden';
       card.dataset.state=state;
       card.style.zIndex=state==='next'?'4':state==='current'?'3':'1';
       card.style.visibility=state==='hidden'?'hidden':'visible';
       card.style.pointerEvents=state==='current'?'auto':'none';
     });
   };

   const update=()=>{
     raf=0;
     const r=reel.getBoundingClientRect();
     const travel=Math.max(1,reel.offsetHeight-window.innerHeight);
     const progress=clamp((-r.top)/travel);
     const scaled=progress*Math.max(0,cards.length-1);
     const current=Math.min(cards.length-1,Math.floor(scaled+1e-6));
     const frac=scaled-current;
     // Hold the project, then do one GPU-only handoff. No clip-path and no filters.
     const transitionStart=.62;
     const transitionEnd=.94;
     const t=ease(clamp((frac-transitionStart)/(transitionEnd-transitionStart)));
     setStates(current);
     sticky.style.setProperty('--reel-frac',frac.toFixed(4));
     sticky.style.setProperty('--reel-local',t.toFixed(4));
     sticky.style.setProperty('--reel-progress',progress.toFixed(4));
     if(nextButton) nextButton.disabled=current>=cards.length-1;
   };

   const onScroll=()=>{ if(!raf) raf=requestAnimationFrame(update); };

   // One wheel gesture = one project. Keep it native/lightweight and only
   // intercept the wheel while the sticky project reel is actually active.
   let wheelLocked=false;
   let wheelUnlock=0;
   const onWheel=(event)=>{
     const rect=reel.getBoundingClientRect();
     const reelActive=rect.top<=0 && rect.bottom>=window.innerHeight;
     if(!reelActive || Math.abs(event.deltaY)<6 || wheelLocked) return;

     const travel=Math.max(1,reel.offsetHeight-window.innerHeight);
     const progress=clamp((-rect.top)/travel);
     const raw=progress*Math.max(0,cards.length-1);
     const current=Math.round(raw);
     const direction=event.deltaY>0?1:-1;
     const target=Math.max(0,Math.min(cards.length-1,current+direction));

     // At the ends, release the page so the visitor can naturally continue.
     if(target===current && ((current===0 && direction<0) || (current===cards.length-1 && direction>0))) return;

     event.preventDefault();
     wheelLocked=true;
     const reelTop=window.scrollY+rect.top;
     const targetProgress=cards.length>1?target/(cards.length-1):0;
     const targetY=reelTop+(travel*targetProgress);
     window.scrollTo({top:targetY,behavior:'smooth'});
     clearTimeout(wheelUnlock);
     wheelUnlock=setTimeout(()=>{wheelLocked=false;},360);
   };

   const goNext=()=>{
     const rect=reel.getBoundingClientRect();
     const travel=Math.max(1,reel.offsetHeight-window.innerHeight);
     const progress=clamp((-rect.top)/travel);
     const raw=progress*Math.max(0,cards.length-1);
     const current=Math.min(cards.length-1,Math.round(raw));
     if(current>=cards.length-1) return;
     const reelTop=window.scrollY+rect.top;
     const targetProgress=(current+1)/Math.max(1,cards.length-1);
     window.scrollTo({top:reelTop+(travel*targetProgress),behavior:'smooth'});
   };

   update();
   addEventListener('scroll',onScroll,{passive:true});
   addEventListener('resize',onScroll,{passive:true});
   addEventListener('wheel',onWheel,{passive:false});
   nextButton?.addEventListener('click',goNext);
   return()=>{
     removeEventListener('scroll',onScroll);
     removeEventListener('resize',onScroll);
     removeEventListener('wheel',onWheel);
     nextButton?.removeEventListener('click',goNext);
     clearTimeout(wheelUnlock);
     if(raf)cancelAnimationFrame(raf)
   };
 },[]);
 return <main>
<section className="space-hero" data-stage="1" data-nav-theme="dark">
  <div className="space-sticky">
    <div className="space-nebula"/><div className="space-noise"/><CinematicGlobe/><CodeOrbit/><div className="space-vignette"/>
    <div className="space-story-stage stage-1">
      <div className="space-index"><b>01</b><span/>FIRST<br/>IMPRESSIONS<br/>MATTER</div>
      <div className="space-copy"><p className="space-kicker">CREATIVE DEVELOPER · FRANCE</p><h1><span>MAKE IT</span><strong>MEMORABLE.</strong></h1><p className="space-sub">FAST WEBSITES · SHARP INTERFACES · STRONGER BRANDS</p></div>
    </div>
    <div className="space-story-stage stage-2">
      <div className="space-index"><b>02</b><span/>DESIGN<br/>MEETS<br/>CODE</div>
      <div className="space-copy space-copy-right"><p className="space-kicker">ENGINEERED TO FEEL EFFORTLESS</p><h1><span>CODE THAT</span><strong>MOVES.</strong></h1><p className="space-sub">MOTION · PERFORMANCE · CLEAN ENGINEERING</p></div>
    </div>
    <div className="space-scroll"><i>↓</i><span>SCROLL<br/>TO CONTROL</span></div>
    <div className="space-meta">BASED IN FRANCE<br/>WORKING WORLDWIDE</div>
    <div className="space-progress"><b>01</b><span/><small>02</small></div>
    <div className="space-triad">DESIGN<br/>DEVELOP<br/>PERFORM</div>
    <div className="orbit-to-work"><span/><span/><span/></div>
  </div>
</section>

<section className="work-cinema" id="work" data-nav-theme="dark">
  <div className="work-heading" data-reveal><p>SELECTED WORK / 2026</p><h2>WORK THAT<br/><strong>FEELS ALIVE.</strong></h2><span>SEVEN DIGITAL EXPERIENCES · BUILT FOR REAL BUSINESSES</span></div>
  <div className="work-reel" style={{'--project-count':featured.length}}>
    <div className="work-reel-sticky">
      {featured.map((p,i)=><article className="work-card" key={p.id} onClick={()=>setActive(p)}>
        <div className="work-project-number" aria-hidden="true">0{i+1}</div>
        <div className="work-card-shell">
          <div className="work-browser-bar"><div><i/><i/><i/></div><span>{p.url ? p.url.replace(/^https?:\/\//,'').replace(/\/$/,'') : p.tag}</span><b>0{i+1}</b></div>
          <div className="work-screen">
            <picture><source media="(max-width: 800px)" srcSet={p.mobileImage || p.image}/><img src={p.image} alt={`${p.title} — aperçu du projet web réalisé par Rafynha`} loading="lazy" decoding="async" width="1400" height="900"/></picture>
            <div className="work-screen-shade"/>
            <div className="work-screen-copy"><small>{p.tag}</small><h3>{p.title}</h3><div className="work-marketing-title">{p.marketingTitle}</div><button type="button" aria-label={`Ouvrir ${p.title}`}>OPEN LIVE ↗</button></div>
          </div>
        </div>
        <div className="work-rail"><span>0{i+1}</span><b>{p.category}</b></div>
      </article>)}
    <div className="work-reel-progress" aria-hidden="true"><span/></div>
    <button className="work-reel-next" type="button" aria-label="Avançar para o próximo projeto"><span>NEXT PROJECT</span><b>↓</b></button>
    </div>
  </div>
  <div className="work-end"><p>DESIGN · CODE · IMPACT</p><h2>YOUR TURN.</h2><Link to="/contact">START A PROJECT ↗</Link></div>
</section>

<section className="statement section" data-nav-theme="light" data-reveal><p className="eyebrow dark">WHAT I BUILD</p><div className="statement-grid"><h2>Not another website.<br/><strong>A reason to choose you.</strong></h2><p>Strategy, design and code combined into one clear experience — fast, distinctive and built to turn attention into action.</p></div></section>
<section className="services-preview section compact-services" data-nav-theme="dark" data-reveal><div className="service-lines"><div><span>01</span><h3>Web experiences</h3><p>Distinctive websites that make the business feel established.</p></div><div><span>02</span><h3>Product & UI</h3><p>Interfaces that feel obvious, fast and polished.</p></div><div><span>03</span><h3>Motion & performance</h3><p>Movement with purpose. Speed without compromise.</p></div></div></section>
<section className="cta section minimal-cta" data-nav-theme="lime" data-reveal><p>READY WHEN YOU ARE</p><h2>LET'S MAKE<br/>YOURS STAND OUT.</h2><Link to="/contact" className="btn light">START A PROJECT ↗</Link></section>
<ProjectModal project={active} onClose={()=>setActive(null)}/>
</main>}

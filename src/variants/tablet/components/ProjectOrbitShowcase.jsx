import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../../data/projects.js';

const ProjectModal = lazy(() => import('./ProjectModal.jsx'));

export default function ProjectOrbitShowcase() {
  const [active,setActive]=useState(null);
  const [showcaseIndex,setShowcaseIndex]=useState(0);
  const [isMobile,setIsMobile]=useState(false);
  const [headingVisible,setHeadingVisible]=useState(false);
  const headingRef=useRef(null);
  const sectionRef=useRef(null);
  const wheelLockRef=useRef(0);
  const pageScrollRef=useRef({y:0,inside:false,ready:false});
  const dragRef=useRef({active:false,startX:0,lastX:0,dragged:false,cardIndex:null,cardActive:false});
  const featured=projects.slice(0,7);
  const showcaseProject=featured[showcaseIndex] || featured[0];

  useEffect(()=>{
    const query=window.matchMedia('(max-width: 900px)');
    const sync=()=>setIsMobile(query.matches);
    sync();
    query.addEventListener?.('change',sync);
    return()=>query.removeEventListener?.('change',sync);
  },[]);

  useEffect(()=>{
    const node=sectionRef.current;
    if(!node) return;
    const onScroll=()=>{
      const y=window.scrollY;
      const previous=pageScrollRef.current;
      const direction=y>=previous.y?1:-1;
      const rect=node.getBoundingClientRect();
      const visible=rect.top<window.innerHeight*.72 && rect.bottom>window.innerHeight*.28;
      if(previous.ready && !previous.inside && visible && direction>0) moveShowcase(1);
      pageScrollRef.current={y,inside:visible,ready:true};
    };
    pageScrollRef.current={y:window.scrollY,inside:false,ready:false};
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  useEffect(()=>{
    const node=headingRef.current;
    if(!node) return;
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        setHeadingVisible(true);
        observer.disconnect();
      }
    },{threshold:.25});
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);

  const moveShowcase=(direction)=>{
    setShowcaseIndex((current)=>(current + direction + featured.length) % featured.length);
  };
  const onShowcaseWheel=(event)=>{
    if(Math.abs(event.deltaY)<8 && Math.abs(event.deltaX)<8) return;
    const now=Date.now();
    if(now<wheelLockRef.current) return;
    wheelLockRef.current=now+140;
    moveShowcase((event.deltaY || event.deltaX)>0?1:-1);
  };
  const onShowcasePointerDown=(event)=>{
    if(event.button !== undefined && event.button !== 0) return;
    const card=event.target.closest?.('.project-orbit-card');
    dragRef.current={active:true,startX:event.clientX,lastX:event.clientX,dragged:false,cardIndex:card?Number(card.dataset.index):null,cardActive:card?.dataset.active==='true'};
    event.currentTarget.classList.add('is-dragging');
  };
  const onShowcasePointerMove=(event)=>{
    const drag=dragRef.current;
    if(!drag.active) return;
    drag.lastX=event.clientX;
    if(Math.abs(drag.lastX-drag.startX)>8) drag.dragged=true;
  };
  const finishShowcaseDrag=(event)=>{
    const drag=dragRef.current;
    if(!drag.active) return;
    const delta=drag.lastX-drag.startX;
    event.currentTarget.classList.remove('is-dragging');
    if(Math.abs(delta)>58) moveShowcase(delta<0?1:-1);
    else if(drag.cardIndex !== null && !drag.cardActive) setShowcaseIndex(drag.cardIndex);
    window.setTimeout(()=>{ dragRef.current.dragged=false; },0);
    dragRef.current={...dragRef.current,active:false,startX:0,lastX:0,cardIndex:null,cardActive:false};
  };
  const onShowcaseClick=(event)=>{
    if(dragRef.current.dragged) return;
    const card=event.target.closest?.('.project-orbit-card');
    if(!card) return;
    const index=Number(card.dataset.index);
    if(Number.isNaN(index)) return;
    if(card.dataset.active==='true') setActive(featured[index]);
    else setShowcaseIndex(index);
  };

  return <section ref={sectionRef} className="work-cinema project-orbit-showcase" id="work" data-nav-theme="dark" onWheel={onShowcaseWheel}>
    <div ref={headingRef} className={`project-orbit-heading${headingVisible?' is-visible':''}`}><h2>Featured Web Design Projects</h2><span>High-performance websites built with strategic web design, development and SEO to improve visibility, speed and conversions.</span></div>
    <div className="project-orbit-stage" onPointerDown={onShowcasePointerDown} onPointerMove={onShowcasePointerMove} onPointerUp={finishShowcaseDrag} onPointerCancel={finishShowcaseDrag} onClick={onShowcaseClick}>
      <button className="project-orbit-arrow project-orbit-prev" type="button" onPointerDown={(event)=>event.stopPropagation()} onClick={(event)=>{event.stopPropagation();moveShowcase(-1)}} aria-label="Previous project">‹</button>
      <div className="project-orbit-ring" aria-label="Featured project carousel">
        {featured.map((p,i)=>{
          const offset=((i-showcaseIndex+featured.length+Math.floor(featured.length/2))%featured.length)-Math.floor(featured.length/2);
          const visible=Math.abs(offset)<=3;
          if(isMobile && Math.abs(offset)>1) return null;
          return <article key={p.id} className="project-orbit-card" data-index={i} data-active={offset===0} data-visible={visible} data-pos={offset} style={{'--orbit-offset':offset}} onClick={()=>{if(dragRef.current.dragged) return; offset===0?setActive(p):setShowcaseIndex(i)}}>
            <div className="project-orbit-browser">
              <div className="project-orbit-bar"><strong>{p.title}</strong><span>{p.category}</span></div>
              <picture><source media="(max-width: 800px)" srcSet={p.mobileImage || p.image}/><img src={p.image} alt={`${p.title} project preview`} loading={offset===0?'eager':'lazy'} fetchPriority={offset===0?'high':'low'} decoding="async" width="1400" height="900"/></picture>
              <div className="project-orbit-shade"/>
              <div className="project-orbit-copy"><small>{p.tag}</small><h3>{p.marketingTitle}</h3></div>
              <button className="project-orbit-hit" type="button" aria-label={offset===0?`Open ${p.title}`:`Show ${p.title}`}/>
            </div>
          </article>;
        })}
      </div>
      <button className="project-orbit-arrow project-orbit-next" type="button" onPointerDown={(event)=>event.stopPropagation()} onClick={(event)=>{event.stopPropagation();moveShowcase(1)}} aria-label="Next project">›</button>
    </div>
    <div className="project-orbit-meta">
      <div className="project-orbit-count"><b>{String(showcaseIndex+1).padStart(2,'0')}</b><span>/ {String(featured.length).padStart(2,'0')}</span><i/></div>
      <div className="project-orbit-name"><h3>{showcaseProject.title}</h3><p>{showcaseProject.category}</p></div>
      <div className="project-orbit-dots">{featured.map((p,i)=><button key={p.id} type="button" className={i===showcaseIndex?'active':''} onClick={()=>setShowcaseIndex(i)} aria-label={`Show ${p.title}`}/>)}</div>
      <div className="project-orbit-tags"><span>Web Design</span><span>Development</span><span>SEO</span><span>Performance</span></div>
      <button className="project-orbit-view" type="button" onClick={()=>setActive(showcaseProject)}>View Project <b>→</b></button>
    </div>
    <div className="work-end"><p>DESIGN · CODE · IMPACT</p><h2>YOUR TURN.</h2><Link to="/contact">START A PROJECT ↗</Link></div>
    {active && <Suspense fallback={null}><ProjectModal project={active} onClose={()=>setActive(null)}/></Suspense>}
  </section>;
}

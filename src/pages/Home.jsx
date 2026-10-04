import { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroJourney from '../components/HeroJourney.jsx';
import { projects } from '../projectsData.js';

const ProjectModal = lazy(() => import('../components/ProjectModal.jsx'));

export default function Home(){
 const [active,setActive]=useState(null);
 const [showcaseIndex,setShowcaseIndex]=useState(0);
 const dragRef=useRef({active:false,startX:0,lastX:0,dragged:false,cardIndex:null,cardActive:false});
 const featured=projects.slice(0,7);
 const serviceVisuals=[
  {src:'/services/rafynha-orbit-brand.webp',alt:'Rafynha brand system in orbit',title:'Brand strategy',features:['Stand out','Build trust','Make an impact']},
  {src:'/services/web-experience-window.webp',alt:'Website interface concept in space',title:'Web design',features:['Built for your brand','Fast & responsive','Made to convert']},
  {src:'/services/seo-growth-search.webp',alt:'SEO growth search interface',title:'SEO & growth',features:['Get found','Rank higher','Reach more clients']},
  {src:'/services/mobile-dashboard.webp',alt:'Mobile dashboard concept',title:'Convert & scale',features:['Mobile-first','Turn clicks into clients','Grow your business']}
 ];
 const showcaseProject=featured[showcaseIndex] || featured[0];
 const moveShowcase=(direction)=>{
   setShowcaseIndex((current)=>(current + direction + featured.length) % featured.length);
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
 return <main>
<HeroJourney/>

<section className="services-preview services-fullscreen" data-nav-theme="light" data-reveal>
  <div className="services-section-title">
    <h2>Websites that get found.</h2>
    <span>SEO, design, speed and clean web experiences.</span>
  </div>
  <div className="services-visual-stack services-visual-desktop" aria-label="Visual direction for Rafynha services">
    {serviceVisuals.map((service,i)=><figure key={service.src} className="service-visual-panel" style={{'--service-i':i}}>
      <img src={service.src} alt={service.alt} loading="lazy" decoding="async" width="768" height="1344"/>
      <figcaption>
        <h3>{service.title}</h3>
        <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
      </figcaption>
    </figure>)}
  </div>
  <div className="services-mobile-list" aria-label="Mobile services">
    {serviceVisuals.map((service,i)=><article key={service.src} className="service-mobile-card" style={{'--service-i':i}}>
      <img src={service.src} alt={service.alt} loading="lazy" decoding="async" width="768" height="1344"/>
      <div>
        <span>0{i+1}</span>
        <h3>{service.title}</h3>
        <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
      </div>
    </article>)}
  </div>
</section>

<section className="work-cinema project-orbit-showcase" id="work" data-nav-theme="dark">
  <div className="project-orbit-heading"><h2>BUILT TO PERFORM.</h2><span>Real projects. Real results. Built for speed, visibility and growth.</span></div>
  <div className="project-orbit-stage" onPointerDown={onShowcasePointerDown} onPointerMove={onShowcasePointerMove} onPointerUp={finishShowcaseDrag} onPointerCancel={finishShowcaseDrag} onClick={onShowcaseClick}>
    <button className="project-orbit-arrow project-orbit-prev" type="button" onPointerDown={(event)=>event.stopPropagation()} onClick={(event)=>{event.stopPropagation();moveShowcase(-1)}} aria-label="Previous project">‹</button>
    <div className="project-orbit-ring" aria-label="Featured project carousel">
      {featured.map((p,i)=>{
        const offset=((i-showcaseIndex+featured.length+Math.floor(featured.length/2))%featured.length)-Math.floor(featured.length/2);
        const visible=Math.abs(offset)<=3;
        return <article key={p.id} className="project-orbit-card" data-index={i} data-active={offset===0} data-visible={visible} data-pos={offset} style={{'--orbit-offset':offset}} onClick={()=>{if(dragRef.current.dragged) return; offset===0?setActive(p):setShowcaseIndex(i)}}>
          <div className="project-orbit-browser">
            <div className="project-orbit-bar"><strong>{p.title}</strong><span>{p.category}</span></div>
            <picture><source media="(max-width: 800px)" srcSet={p.mobileImage || p.image}/><img src={p.image} alt={`${p.title} project preview`} loading={offset===0?'eager':'lazy'} decoding="async" width="1400" height="900"/></picture>
            <div className="project-orbit-shade"/>
            <div className="project-orbit-copy"><small>{p.tag}</small><h3>{p.marketingTitle}</h3></div>
            <button className="project-orbit-hit" type="button" aria-label={offset===0?`Open ${p.title}`:`Show ${p.title}`}/>
          </div>
        </article>
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
</section>

<section className="statement section" data-nav-theme="light" data-reveal><p className="eyebrow dark">WHAT I BUILD</p><div className="statement-grid"><h2>Not another website.<br/><strong>A reason to choose you.</strong></h2><p>Strategy, design and code combined into one clear experience — fast, distinctive and built to turn attention into action.</p></div></section>
<section className="cta section minimal-cta" data-nav-theme="lime" data-reveal><p>READY WHEN YOU ARE</p><h2>LET'S MAKE<br/>YOURS STAND OUT.</h2><Link to="/contact" className="btn light">START A PROJECT ↗</Link></section>
{active && <Suspense fallback={null}><ProjectModal project={active} onClose={()=>setActive(null)}/></Suspense>}
</main>}

import { useEffect, useState } from 'react';

const serviceVisuals = [
  {src:'/services/rafynha-orbit-brand.webp',alt:'Rafynha brand system in orbit',title:'Clear brand',features:['Look premium','Earn trust','Stand apart']},
  {src:'/services/web-experience-window.webp',alt:'Website interface concept in space',title:'Sharp website',features:['Fast pages','Clean design','Easy to use']},
  {src:'/services/seo-growth-search.webp',alt:'SEO growth search interface',title:'Get found',features:['SEO ready','Rank higher','More traffic']},
  {src:'/services/mobile-dashboard.webp',alt:'Mobile dashboard concept',title:'More leads',features:['Mobile-first','Better clicks','Real growth']}
];

export default function ServicesPreview() {
  const [isMobile,setIsMobile] = useState(false);

  useEffect(()=>{
    const query=window.matchMedia('(max-width: 900px)');
    const sync=()=>setIsMobile(query.matches);
    sync();
    query.addEventListener?.('change',sync);
    return()=>query.removeEventListener?.('change',sync);
  },[]);

  return <section className="services-preview services-fullscreen" data-nav-theme="light" data-reveal>
    <div className="services-section-title">
      <h2>Websites that get found.</h2>
      <span>SEO, design, speed and clean web experiences.</span>
    </div>
    {!isMobile && <div className="services-visual-stack services-visual-desktop" aria-label="Visual direction for Rafynha services">
      {serviceVisuals.map((service,i)=><figure key={service.src} className="service-visual-panel" style={{'--service-i':i}}>
        <img src={service.src} alt={service.alt} loading="lazy" decoding="async" width="768" height="1344"/>
        <figcaption>
          <h3>{service.title}</h3>
          <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </figcaption>
      </figure>)}
    </div>}
    {isMobile && <div className="services-mobile-list" aria-label="Mobile services">
      {serviceVisuals.map((service,i)=><article key={service.src} className="service-mobile-card" style={{'--service-i':i}}>
        <img src={service.src} alt={service.alt} loading="lazy" decoding="async" width="768" height="1344"/>
        <div>
          <span>0{i+1}</span>
          <h3>{service.title}</h3>
          <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </div>
      </article>)}
    </div>}
  </section>;
}

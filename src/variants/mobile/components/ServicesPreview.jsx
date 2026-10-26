import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import sharpWebsite from '../../../assets/services/sharp-website.webp';
import sharpWebsiteMobile from '../../../assets/services/sharp-website-mobile.webp';
import getFound from '../../../assets/services/get-found.webp';
import getFoundMobile from '../../../assets/services/get-found-mobile.webp';
import premiumWebsites from '../../../assets/services/premium-websites.webp';
import premiumWebsitesMobile from '../../../assets/services/premium-websites-mobile.webp';
import brandDirection from '../../../assets/services/brand-direction.webp';
import brandDirectionMobile from '../../../assets/services/brand-direction-mobile.webp';

const serviceVisuals = [
  {
    src:sharpWebsite,
    mobileSrc:sharpWebsiteMobile,
    alt:'Mobile-first responsive website design shown on smartphone screens, optimized for speed, usability, Core Web Vitals and conversions',
    title:'Mobile-first website design',
    features:['Responsive design','Core Web Vitals']
  },
  {
    src:getFound,
    mobileSrc:getFoundMobile,
    alt:'Google SEO and keyword strategy visual showing search rankings, search intent, organic visibility and website growth',
    title:'SEO, Google rankings & keywords',
    features:['Google SEO','Keyword strategy']
  },
  {
    src:premiumWebsites,
    mobileSrc:premiumWebsitesMobile,
    alt:'Premium custom website development with clean UX, performance optimization, schema markup and high-trust design',
    title:'Premium website development',
    features:['Custom development','Page speed']
  },
  {
    src:brandDirection,
    mobileSrc:brandDirectionMobile,
    alt:'Brand strategy, visual identity and UX direction for a premium website experience that builds trust and clarity',
    title:'Brand strategy, UX & direction',
    features:['Brand strategy','UX direction']
  }
];

function ServiceImage({ service, eager = false }) {
  return (
    <picture>
      <source media="(max-width: 900px)" srcSet={service.mobileSrc} type="image/webp" />
      <source srcSet={service.src} type="image/webp" />
      <img
        src={service.src}
        alt={service.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        width="768"
        height="1365"
      />
    </picture>
  );
}

export default function ServicesPreview() {
  const [isMobile,setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once:false, amount:0.35 });

  useEffect(()=>{
    const query=window.matchMedia('(max-width: 900px)');
    const sync=()=>setIsMobile(query.matches);
    sync();
    query.addEventListener?.('change',sync);
    return()=>query.removeEventListener?.('change',sync);
  },[]);

  useEffect(()=>{
    const el=document.querySelector('.services-preview.services-fullscreen');
    if(!el) return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){
      el.classList.add('services-in-view');
      return;
    }
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        el.classList.remove('services-replay');
        void el.offsetWidth;
        el.classList.add('services-in-view','services-replay');
      } else {
        el.classList.remove('services-in-view','services-replay');
      }
    },{threshold:.12,rootMargin:'-4% 0px -8% 0px'});
    observer.observe(el);
    return()=>observer.disconnect();
  },[]);

  return <section ref={sectionRef} className="services-preview services-fullscreen" aria-labelledby="services-preview-title" data-nav-theme="light" data-reveal>
    <div className="services-section-title">
      <motion.h2
        id="services-preview-title"
        initial={{ opacity: 0, y: 64, scale: 0.94 }}
        animate={isSectionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 64, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 90, damping: 17, mass: 0.8 }}
      >
        Websites built to rank, convert & grow.
      </motion.h2>
      <motion.span
        initial={{ opacity: 0, y: 34, scale: 0.97 }}
        animate={isSectionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 34, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 105, damping: 19, mass: 0.7, delay: 0.16 }}
      >
        Web design, SEO and development built for visibility, speed and growth.
      </motion.span>
    </div>

    <p className="seo-visually-hidden">
      Rafynha provides mobile-first web design, responsive website development, custom websites, Google SEO, technical SEO, local SEO, keyword research, on-page SEO, search-intent optimization, AI search optimization, landing pages, conversion-focused UX, Core Web Vitals, schema markup, analytics integration, page speed optimization, brand strategy, visual identity and UX direction for businesses that want to rank higher on Google, attract qualified traffic and convert more visitors into customers.
    </p>

    {!isMobile && <div className="services-visual-stack services-visual-desktop" aria-label="Web design, SEO, website development and brand direction services">
      {serviceVisuals.map((service,i)=><figure key={service.src} className="service-visual-panel" style={{'--service-i':i}}>
        <div className="service-visual-art">
          <ServiceImage service={service} eager />
        </div>
        <figcaption>
          <h3>{service.title}</h3>
          <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </figcaption>
      </figure>)}
    </div>}
    {isMobile && <div className="services-mobile-list" aria-label="Web design, SEO, website development and brand direction services">
      {serviceVisuals.map((service,i)=><article key={service.src} className="service-mobile-card" style={{'--service-i':i}}>
        <ServiceImage service={service} eager={i===0} />
        <div>
          <span>0{i+1}</span>
          <h3>{service.title}</h3>
          <ul>{service.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </div>
      </article>)}
    </div>}
  </section>;
}

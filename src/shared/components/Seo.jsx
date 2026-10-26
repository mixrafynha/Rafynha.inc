import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = {
  '/': {
    title: 'Rafynha | Web Design, Google SEO & Website Development',
    description: 'Web design, website development, Google SEO, keyword strategy, technical SEO, performance and brand direction for websites built to rank and convert.',
    type: 'website'
  },
  '/projets': {
    title: 'Projets web — Rafynha | Web Design & Development',
    description: 'Découvrez des projets de web design, website development, performance et expériences digitales conçus par Rafynha.',
    type: 'website'
  },
  '/services': {
    title: 'Services — Web Design, SEO & Website Development | Rafynha',
    description: 'Web design, website development, landing pages, technical SEO, local SEO, AI search optimization et website performance optimization.',
    type: 'website'
  },
  '/a-propos': {
    title: 'À propos — Rafynha, Web Design & SEO',
    description: 'Rafynha accompagne les entreprises avec du web design, du website development et des stratégies SEO orientées visibilité et conversion.',
    type: 'profile'
  },
  '/contact': {
    title: 'Contact — Démarrer un projet web avec Rafynha',
    description: 'Parlez à Rafynha de votre projet de web design, website development, landing page, SEO ou optimisation de performance.',
    type: 'website'
  }
};

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) { el = document.createElement('link'); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

export default function Seo(){
  const { pathname } = useLocation();
  useEffect(() => {
    const data = SEO[pathname] || SEO['/'];
    document.title = data.title;
    upsertMeta('meta[name="description"]', { name:'description', content:data.description });
    upsertMeta('meta[name="keywords"]', { name:'keywords', content:'web design, website development, custom websites, responsive web design, Google SEO, SEO services, technical SEO, local SEO, keyword research, search intent, AI search optimization, landing pages, Core Web Vitals, website speed optimization, conversion UX, UX design, brand identity, brand direction' });
    upsertMeta('meta[name="keywords"]', { name:'keywords', content:'web design, website development, Google SEO, SEO agency, keyword strategy, technical SEO, local SEO, mobile-first website, responsive web design, Core Web Vitals, website performance, landing pages, conversion optimization, brand identity, brand direction, AI search optimization' });
    upsertMeta('meta[name="robots"]', { name:'robots', content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
    upsertMeta('meta[property="og:title"]', { property:'og:title', content:data.title });
    upsertMeta('meta[property="og:description"]', { property:'og:description', content:data.description });
    upsertMeta('meta[property="og:type"]', { property:'og:type', content:data.type });
    upsertMeta('meta[property="og:locale"]', { property:'og:locale', content:'fr_FR' });
    upsertMeta('meta[property="og:site_name"]', { property:'og:site_name', content:'Rafynha' });
    upsertMeta('meta[property="og:url"]', { property:'og:url', content:`${window.location.origin}${pathname === '/' ? '/' : pathname}` });
    upsertMeta('meta[property="og:image"]', { property:'og:image', content:`${window.location.origin}/hero/process/01-brief.png` });
    upsertMeta('meta[name="twitter:card"]', { name:'twitter:card', content:'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name:'twitter:title', content:data.title });
    upsertMeta('meta[name="twitter:description"]', { name:'twitter:description', content:data.description });
    upsertMeta('meta[name="twitter:url"]', { name:'twitter:url', content:`${window.location.origin}${pathname === '/' ? '/' : pathname}` });
    upsertMeta('meta[name="twitter:image"]', { name:'twitter:image', content:`${window.location.origin}/hero/process/01-brief.png` });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${pathname === '/' ? '/' : pathname}`;

    let schema = document.head.querySelector('#rafynha-schema');
    if (!schema) { schema = document.createElement('script'); schema.type='application/ld+json'; schema.id='rafynha-schema'; document.head.appendChild(schema); }
    const pageUrl = `${window.location.origin}${pathname === '/' ? '/' : pathname}`;
    const graph = [
      {
        '@type':'ProfessionalService',
        '@id':`${window.location.origin}/#professional-service`,
        name:'Rafynha',
        description:'Web design, website development, Google SEO, keyword strategy, technical SEO, local SEO, performance optimization and brand direction for growing businesses.',
        url:window.location.origin,
        logo:`${window.location.origin}/brand/rafyhna-logo.svg`,
        areaServed:'France',
        serviceType:['Web Design','Responsive Web Design','Website Development','Google SEO','Keyword Strategy','Technical SEO','Local SEO','AI Search Optimization','Landing Pages','Core Web Vitals','Website Performance Optimization','Conversion Rate Optimization','Brand Identity','Brand Direction']
      },
      {
        '@type':'WebSite',
        '@id':`${window.location.origin}/#website`,
        name:'Rafynha',
        url:window.location.origin,
        publisher:{'@id':`${window.location.origin}/#professional-service`}
      }
    ];
    if (pathname === '/services') {
      graph.push({
        '@type':'ItemList',
        '@id':`${pageUrl}#services`,
        name:'Rafynha services',
        itemListElement:['Web Design','Responsive Web Design','Website Development','Custom Website Development','Google SEO','SEO','Technical SEO','Local SEO','Keyword Research','Search Intent Optimization','AI Search Optimization','Landing Pages','Conversion Rate Optimization','Core Web Vitals','Website Speed Optimization','Website Performance Optimization','UX Design','Brand Identity','Brand Direction'].map((name, index) => ({ '@type':'ListItem', position:index+1, name }))
      });
    }
    if (pathname !== '/') {
      const names = {'/projets':'Projets','/services':'Services','/a-propos':'À propos','/contact':'Contact'};
      graph.push({
        '@type':'BreadcrumbList',
        itemListElement:[
          {'@type':'ListItem', position:1, name:'Accueil', item:`${window.location.origin}/`},
          {'@type':'ListItem', position:2, name:names[pathname] || 'Rafynha', item:pageUrl}
        ]
      });
    }
    schema.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@graph':graph
    });
  }, [pathname]);
  return null;
}

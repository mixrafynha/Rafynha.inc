import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = {
  '/': {
    title: 'Rafynha — Développeur web freelance | Sites & expériences digitales',
    description: 'Rafynha conçoit des sites web rapides, modernes et immersifs pour entreprises, indépendants et produits digitaux en France.',
    type: 'website'
  },
  '/projets': {
    title: 'Projets web — Rafynha | Portfolio développeur freelance',
    description: 'Découvrez une sélection de sites, interfaces et produits digitaux réalisés par Rafynha : design, développement, responsive et performance.',
    type: 'website'
  },
  '/services': {
    title: 'Création de site web & refonte — Rafynha',
    description: 'Création de sites vitrines, refontes, landing pages, responsive, performance et intégrations web avec React, Next.js et Vite.',
    type: 'website'
  },
  '/a-propos': {
    title: 'À propos — Rafynha, développeur web freelance',
    description: 'Développeur web freelance orienté design, produit et expérience utilisateur. Interfaces rapides, responsives et soignées.',
    type: 'profile'
  },
  '/contact': {
    title: 'Contact — Démarrer un projet web avec Rafynha',
    description: 'Parlez de votre projet web à Rafynha : site vitrine, refonte, landing page ou application web.',
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

export default function Seo(){
  const { pathname } = useLocation();
  useEffect(() => {
    const data = SEO[pathname] || SEO['/'];
    document.title = data.title;
    upsertMeta('meta[name="description"]', { name:'description', content:data.description });
    upsertMeta('meta[name="robots"]', { name:'robots', content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
    upsertMeta('meta[property="og:title"]', { property:'og:title', content:data.title });
    upsertMeta('meta[property="og:description"]', { property:'og:description', content:data.description });
    upsertMeta('meta[property="og:type"]', { property:'og:type', content:data.type });
    upsertMeta('meta[property="og:locale"]', { property:'og:locale', content:'fr_FR' });
    upsertMeta('meta[name="twitter:card"]', { name:'twitter:card', content:'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name:'twitter:title', content:data.title });
    upsertMeta('meta[name="twitter:description"]', { name:'twitter:description', content:data.description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${pathname === '/' ? '/' : pathname}`;

    let schema = document.head.querySelector('#rafynha-schema');
    if (!schema) { schema = document.createElement('script'); schema.type='application/ld+json'; schema.id='rafynha-schema'; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@type':'ProfessionalService',
      name:'Rafynha',
      description:'Développement web, design d’interfaces et expériences digitales.',
      areaServed:'France',
      serviceType:['Création de site web','Refonte de site web','Landing page','Développement front-end','Performance web'],
      url: window.location.origin
    });
  }, [pathname]);
  return null;
}

import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import { projects } from '../projectsData.js';

export default function Projects(){
  const [active, setActive] = useState(null);

  useEffect(() => {
    const cards = [...document.querySelectorAll('.projects-page .portfolio-card')];
    const canHover = window.matchMedia('(pointer: fine)').matches;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-in-view');
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    cards.forEach((card) => {
      observer.observe(card);
      const onMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.setProperty('--mx', `${(x * 4).toFixed(2)}px`);
        card.style.setProperty('--my', `${(y * 3).toFixed(2)}px`);
        card.style.setProperty('--rx', `${(y * -1.25).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 1.5).toFixed(2)}deg`);
      };
      const onLeave = () => {
        card.style.setProperty('--mx', '0px');
        card.style.setProperty('--my', '0px');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      };
      if (canHover) {
        card.addEventListener('pointermove', onMove, { passive: true });
        card.addEventListener('pointerleave', onLeave);
      }
      card._cleanupMotion = () => {
        observer.unobserve(card);
        if (canHover) {
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
        }
      };
    });
    return () => cards.forEach((card) => card._cleanupMotion?.());
  }, []);

  return <main className="projects-page" data-nav-theme="light">
    <PageHero eyebrow="Portfolio" title="Des projets avec une identité claire." text="Une sélection de sites et produits digitaux conçus autour du design, de la lisibilité et de la performance."/>
    <section data-nav-theme="light" data-reveal className="section portfolio-cards">
      {projects.map((project, index) => (
        <article className={`portfolio-card ${project.accent}`} style={{ '--card-index': index }} key={project.id}>
          <div className="portfolio-preview">
            {project.url ? (
              <picture><source media="(max-width: 800px)" srcSet={project.mobileImage || project.image}/><img src={project.image} alt={`Aperçu du site ${project.title}`} loading="lazy" decoding="async" /></picture>
            ) : (
              <div className="local-preview"><span>RAFYNHA</span><strong>{project.title}</strong><small>DÉMO LOCALE</small></div>
            )}
            <div className="portfolio-number">{project.number}</div>
          </div>
          <div className="portfolio-meta">
            <div>
              <small>{project.tag}</small>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            {project.url ? (
              <button className="project-open" type="button" onClick={() => setActive(project)}>
                Voir le site <span>↗</span>
              </button>
            ) : (
              <span className="project-local">Démo locale</span>
            )}
          </div>
        </article>
      ))}
    </section>
    <ProjectModal project={active} onClose={() => setActive(null)} />
  </main>
}

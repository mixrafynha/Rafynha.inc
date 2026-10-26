import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project?.url) return;
    const scrollY = window.scrollY;
    const oldOverflow = document.body.style.overflow;
    const oldPosition = document.body.style.position;
    const oldTop = document.body.style.top;
    const oldWidth = document.body.style.width;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.position = oldPosition;
      document.body.style.top = oldTop;
      document.body.style.width = oldWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project?.url) return null;

  return createPortal((
    <div className="site-modal" role="dialog" aria-modal="true" aria-label={`Aperçu de ${project.title}`} onMouseDown={onClose}>
      <div className="site-modal-shell" onMouseDown={(e) => e.stopPropagation()}>
        <div className="site-modal-bar">
          <div className="site-modal-info">
            <span className="site-modal-dot" />
            <strong>{project.title}</strong>
            <span className="site-modal-url">{project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
          </div>
          <div className="site-modal-actions">
            <a href={project.url} target="_blank" rel="noreferrer" title="Ouvrir dans un nouvel onglet">↗</a>
            <button type="button" onClick={onClose} aria-label="Fermer">×</button>
          </div>
        </div>
        <iframe src={project.url} title={project.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="fullscreen" />
        <div className="iframe-fallback">Si le site bloque l’aperçu intégré, <a href={project.url} target="_blank" rel="noreferrer">ouvrez-le dans un nouvel onglet ↗</a></div>
      </div>
    </div>
  ), document.body);
}

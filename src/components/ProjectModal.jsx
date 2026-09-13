import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  if (!project?.url) return null;

  return (
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
        <iframe src={project.url} title={project.title} loading="eager" allow="fullscreen" />
        <div className="iframe-fallback">Si le site bloque l’aperçu intégré, <a href={project.url} target="_blank" rel="noreferrer">ouvrez-le dans un nouvel onglet ↗</a></div>
      </div>
    </div>
  );
}

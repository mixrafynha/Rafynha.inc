import { Link } from 'react-router-dom';

export default function Footer(){
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="rf-footer" data-nav-theme="dark">
      <div className="rf-footer-inner">
        <div className="rf-footer-head">
          <Link to="/" className="rf-footer-logo" aria-label="Rafynha — home">
            <img src="/brand/rafyhna-logo.svg" alt="RAFYHNA." />
          </Link>
          <button className="rf-footer-top" type="button" onClick={top} aria-label="Back to top">
            Back to top <span>↑</span>
          </button>
        </div>

        <div className="rf-footer-main">
          <div className="rf-footer-cta-wrap">
            <span className="rf-footer-kicker">HAVE A PROJECT?</span>
            <Link to="/contact" className="rf-footer-cta">
              <span>LET'S BUILD<br/>SOMETHING GREAT.</span>
              <i aria-hidden="true">↗</i>
            </Link>
          </div>

          <nav className="rf-footer-nav" aria-label="Footer navigation">
            <Link to="/projets">Work</Link>
            <Link to="/a-propos">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="rf-footer-socials" aria-label="Social networks">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.3H3.2V21h3.3V8.3ZM4.85 3A2 2 0 1 0 4.8 7a2 2 0 0 0 .05-4ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.8 2v-1.8H9.2V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21H21v-7.3Z"/></svg>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" className="social-dot"/></svg>
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.63c-2.65.58-3.21-1.28-3.21-1.28-.44-1.13-1.07-1.43-1.07-1.43-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.47 2.27 1.05 2.83.8.09-.62.34-1.05.62-1.3-2.12-.24-4.35-1.06-4.35-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.62.98a9.1 9.1 0 0 1 4.77 0c1.82-1.24 2.62-.98 2.62-.98.52 1.31.19 2.28.09 2.52.61.67.98 1.52.98 2.56 0 3.65-2.24 4.46-4.37 4.7.35.3.66.88.66 1.78v2.64c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z"/></svg>
            </a>
          </div>
        </div>

        <div className="rf-footer-bottom">
          <span>Creative developer · France</span>
          <span className="rf-footer-legal">
            <a href="#legal">Legal information</a>
            <a href="#privacy">Privacy</a>
            <a href="#cookies">Cookies</a>
            <span>© 2026 Rafynha</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

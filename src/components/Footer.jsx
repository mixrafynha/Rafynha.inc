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
        </div>

        <div className="rf-footer-bottom">
          <span>Creative developer · France</span>
          <span>© 2026 Rafynha</span>
        </div>
      </div>
    </footer>
  );
}

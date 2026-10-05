import { Link } from 'react-router-dom';

export default function HomeFinalSections() {
  return <>
    <section className="statement section" data-nav-theme="light" data-reveal>
      <p className="eyebrow dark">WHAT I BUILD</p>
      <div className="statement-grid">
        <h2>Not another website.<br/><strong>A reason to choose you.</strong></h2>
        <p>Strategy, design and code combined into one clear experience — fast, distinctive and built to turn attention into action.</p>
      </div>
    </section>
    <section className="cta section minimal-cta" data-nav-theme="lime" data-reveal>
      <p>READY WHEN YOU ARE</p>
      <h2>LET'S MAKE<br/>YOURS STAND OUT.</h2>
      <Link to="/contact" className="btn light">START A PROJECT ↗</Link>
    </section>
  </>;
}

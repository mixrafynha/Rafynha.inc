import { useEffect, useState } from 'react';

const LIVE_CODE = `const site = createWebsite({
  offer: 'clear',
  seo: 'structured',
  pages: ['home', 'work', 'contact'],
  performance: 98
})

deploy(site).toProduction()`;

export default function CodeOrbit(){
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let frame = 0;
    let lastLength = -1;
    const orbit = document.querySelector('.code-orbit');
    const hero = orbit?.closest('.space-hero');
    if (!hero) return;

    const update = () => {
      const progress = Number.parseFloat(hero.style.getPropertyValue('--story-progress')) || 0;
      const writeProgress = Math.max(0, Math.min(1, (progress - 0.03) / 0.32));
      const nextLength = Math.round(writeProgress * LIVE_CODE.length);
      if (nextLength !== lastLength) {
        lastLength = nextLength;
        setTyped(LIVE_CODE.slice(0, nextLength));
      }
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="code-orbit" aria-hidden="true">
    <div className="orbit-ui orbit-ui-a">
      <span className="orbit-label">CODE WRITER / 02</span>
      <code><b>&gt; GENERATING_SITE</b><br/><span className="typed-code">{typed}</span><span className="typed-caret"/></code>
      <span className="code-cursor"/>
    </div>

    <div className="orbit-ui orbit-ui-b site-preview-panel">
      <span className="orbit-label">SITE PREVIEW / BUILD</span>
      <div className="mini-browser">
        <div className="mini-browser-top"><i/><i/><i/><span>rafynha.dev</span></div>
        <div className="mini-hero-line"/>
        <div className="mini-title-line"/>
        <div className="mini-copy-line"/>
        <div className="mini-card-grid"><span/><span/><span/></div>
      </div>
    </div>

    <div className="orbit-ui orbit-ui-c deploy-panel">
      <span className="orbit-label">DEPLOY PIPELINE / 03</span>
      <div className="deploy-step"><i/><span>npm run build</span><b>PASS</b></div>
      <div className="deploy-step"><i/><span>optimize assets</span><b>DONE</b></div>
      <div className="deploy-step"><i/><span>push production</span><b>LIVE</b></div>
      <div className="live-url"><span/>https://rafynha.dev</div>
    </div>

    <div className="floating-tag tag-react">BRIEF</div>
    <div className="floating-tag tag-webgl">CODE</div>
    <div className="floating-tag tag-api">DEPLOY</div>
    <div className="floating-tag tag-motion">ONLINE</div>
    <div className="code-beam beam-a"/><div className="code-beam beam-b"/>
  </div>
}

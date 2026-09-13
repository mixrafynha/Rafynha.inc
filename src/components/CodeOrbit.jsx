import { useEffect, useState } from 'react';

const LIVE_CODE = "const experience = build({ design: 'sharp', motion: true, performance: 'fast' })";

export default function CodeOrbit(){
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    let timer;
    const tick = () => {
      setTyped(LIVE_CODE.slice(0, i));
      i = i >= LIVE_CODE.length ? 0 : i + 1;
      timer = window.setTimeout(tick, i === 0 ? 900 : 34);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return <div className="code-orbit" aria-hidden="true">
    <div className="orbit-ui orbit-ui-a">
      <span className="orbit-label">LIVE BUILD / 01</span>
      <code><b>&gt; LIVE_WRITE</b><br/><span className="typed-code">{typed}</span><span className="typed-caret"/></code>
      <span className="code-cursor"/>
    </div>

    <div className="orbit-ui orbit-ui-b">
      <span className="orbit-label">COMPONENT GRAPH</span>
      <div className="node-row"><i/><span>HeroScene.jsx</span><b>READY</b></div>
      <div className="node-row"><i/><span>EarthShader.glsl</span><b>LIVE</b></div>
      <div className="node-row"><i/><span>ScrollTimeline.ts</span><b>SYNC</b></div>
    </div>

    <div className="orbit-ui orbit-ui-c">
      <span className="orbit-label">BUILD PIPELINE</span>
      <div className="pipeline-line"><span style={{'--p':'96%'}}/><small>UI</small><b>96</b></div>
      <div className="pipeline-line"><span style={{'--p':'100%'}}/><small>MOTION</small><b>100</b></div>
      <div className="pipeline-line"><span style={{'--p':'99%'}}/><small>PERF</small><b>99</b></div>
    </div>

    <div className="floating-tag tag-react">REACT</div>
    <div className="floating-tag tag-webgl">WEBGL</div>
    <div className="floating-tag tag-api">API</div>
    <div className="floating-tag tag-motion">MOTION</div>
    <div className="code-beam beam-a"/><div className="code-beam beam-b"/>
  </div>
}

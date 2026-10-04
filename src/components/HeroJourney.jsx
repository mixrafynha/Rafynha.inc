import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const scenes = [
  {
    n:'01', eyebrow:'STRATEGY',
    title:<><span className="cp-title-line">MAKE YOUR BUSINESS</span><br/><em>LOOK BETTER.</em></>,
    text:'Turn your idea into a website people notice and trust',
    image:'/hero/process/01-brief.webp', alt:'Creative strategy meeting and website planning'
  },
  {
    n:'02', eyebrow:'DESIGN + DEVELOPMENT',
    title:<><span className="cp-title-line">MAKE YOUR WEBSITE</span><br/><em>WORK HARDER.</em></>,
    text:'Fast, responsive and built to turn attention into action.',
    image:'/hero/process/02-build.webp', alt:'Developer building and optimizing a website in a code editor'
  },
  {
    n:'03', eyebrow:'LAUNCH + GROW',
    title:<><span className="cp-title-line">MAKE YOUR BUSINESS</span><br/><em>GROW.</em></>,
    text:'Get found, win more customers and keep growing.',
    image:'/hero/process/03-launch.webp', alt:'Finished responsive website live across desktop, laptop and mobile'
  }
];

const code = [
  '<Hero value="clear" />',
  '<Services />',
  '<Proof />',
  '<ContactCTA />',
  'seo.optimize()',
  'performance.ship()'
];

const reviews = [
  {
    name:'Alex',
    avatar:'https://i.pravatar.cc/96?img=12',
    text:'I had an idea for my business and it became a website people trust.'
  },
  {
    name:'Maya',
    avatar:'https://i.pravatar.cc/96?img=47',
    text:'Clear design, fast delivery and the site finally looks professional.'
  },
  {
    name:'Noah',
    avatar:'https://i.pravatar.cc/96?img=32',
    text:'People understand what we do faster, and the brand feels premium now.'
  },
  {
    name:'Emma',
    avatar:'https://i.pravatar.cc/96?img=5',
    text:'The new website made our service easier to trust from the first visit.'
  }
];

export default function HeroJourney(){
  const root = useRef(null);
  const target = useRef(0);
  const smooth = useRef(0);
  const running = useRef(false);
  const [stage,setStage] = useState(0);
  const [phase,setPhase] = useState('reveal');
  const [typed,setTyped] = useState(0);
  const [reviewIndex,setReviewIndex] = useState(0);

  useLayoutEffect(()=>{
    const timer=window.setInterval(()=>{
      setReviewIndex((current)=>(current+1)%reviews.length);
    },3600);
    return()=>window.clearInterval(timer);
  },[]);

  useLayoutEffect(()=>{
    const el=root.current; if(!el) return;
    let raf=0, visible=true, lastStage=-1, lastPhase='', lastTyped=-1;
    let metrics={top:0,travel:1};
    let initialized=false;
    const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

    const measure=()=>{
      const rect=el.getBoundingClientRect();
      metrics.top=window.scrollY+rect.top;
      metrics.travel=Math.max(1,el.offsetHeight-window.innerHeight);
    };

    const paint=(p, snap=false)=>{
      if(snap || !initialized){smooth.current=p;initialized=true}
      const current=snap?p:smooth.current;
      const scaled=current*3;
      const s=Math.min(2,Math.floor(Math.min(scaled,2.9999)));
      const l=clamp(scaled-s);
      const ph=l<.18?'reveal':l<.76?'hold':'exit';
      const typeCount=s===1?Math.max(0,Math.min(code.length,Math.floor(clamp((l-.16)/.42)*(code.length+1)))):(s>1?code.length:0);
      el.dataset.navTheme=s===2?'lime':'light';

      el.style.setProperty('--hp',current.toFixed(4));
      el.style.setProperty('--hl',l.toFixed(4));
      el.style.setProperty('--scene-shift',`${((l-.5)*12).toFixed(2)}px`);

      // Scroll-driven handoff: slide/fade panels without rotating them.
      // CSS variables are used so this choreography wins over legacy responsive transforms.
      const imageHandoff=clamp((l-.58)/.34);
      const visualPos=Math.min(2,s+imageHandoff*imageHandoff*(3-2*imageHandoff));
      const figures=el.querySelectorAll('.cp-image');
      figures.forEach((figure,index)=>{
        const signed=visualPos-index;
        const d=Math.abs(signed);
        const opacity=clamp(1-d*1.15);
        const direction=index%2===0?-1:1;
        const sceneOffsetX=index===1?-90:index===2?-120:0;
        const x=Math.max(-150,Math.min(112,(signed*-70)+(d>.08?direction*24:0)+sceneOffsetX));
        const y=index===1?31:0;
        const extraScale=index===1?.04:index===2?.10:0;
        figure.style.setProperty('--image-opacity',opacity.toFixed(3));
        figure.style.setProperty('--image-transform',`translate3d(${x.toFixed(1)}px,${y}px,0) scale(${(1+extraScale-d*.035).toFixed(3)})`);
        figure.style.zIndex=String(20-Math.round(d*4));
      });
      if(s!==lastStage){lastStage=s;setStage(s)}
      if(ph!==lastPhase){lastPhase=ph;setPhase(ph)}
      if(typeCount!==lastTyped){lastTyped=typeCount;setTyped(typeCount)}
    };

    const getProgress=()=>clamp((window.scrollY-metrics.top)/metrics.travel);

    const tick=()=>{
      const delta=target.current-smooth.current;
      smooth.current += delta*.14;
      if(Math.abs(delta)<.00045) smooth.current=target.current;
      paint(smooth.current);
      if(Math.abs(target.current-smooth.current)>.00045 && visible) raf=requestAnimationFrame(tick);
      else running.current=false;
    };

    const read=()=>{
      target.current=getProgress();
      if(!initialized){paint(target.current,true);return}
      if(!visible) return;
      if(!running.current){running.current=true;raf=requestAnimationFrame(tick)}
    };

    const hardSync=()=>{
      measure();
      target.current=getProgress();
      if(raf) cancelAnimationFrame(raf);
      running.current=false;
      paint(target.current,true);
    };

    const io=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if(visible) hardSync();
      else{running.current=false;if(raf)cancelAnimationFrame(raf)}
    },{rootMargin:'15% 0px'});
    io.observe(el);

    const ro=new ResizeObserver(()=>hardSync());
    ro.observe(el);

    hardSync();
    requestAnimationFrame(hardSync);
    const onPageShow=()=>requestAnimationFrame(hardSync);
    const onLoad=()=>hardSync();
    const onResize=()=>hardSync();
    window.addEventListener('scroll',read,{passive:true});
    window.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('pageshow',onPageShow);
    window.addEventListener('load',onLoad,{once:true});
    if(document.fonts?.ready) document.fonts.ready.then(()=>hardSync()).catch(()=>{});
    Array.from(el.images||[]).forEach(img=>{if(!img.complete)img.addEventListener('load',hardSync,{once:true})});

    return()=>{
      io.disconnect();ro.disconnect();
      window.removeEventListener('scroll',read);
      window.removeEventListener('resize',onResize);
      window.removeEventListener('pageshow',onPageShow);
      window.removeEventListener('load',onLoad);
      if(raf)cancelAnimationFrame(raf);
    };
  },[]);

  const optimizing=stage===1 && typed>=5;

  return <section ref={root} className="cinematic-process cinematic-process--three motion-v7" data-stage={stage} data-phase={phase} data-nav-theme="light">
    <div className="cinematic-process__sticky">
      <div className="cp-ambient"/>

      <div className="cp-copy">
        {scenes.map((s,i)=><article key={s.n} className={`cp-copy__scene cp-copy__scene--${i} ${i===stage?'is-active':''}`}>
          <div className="cp-eyebrow"><b>{s.n}</b><span>{s.eyebrow}</span></div>
          <h1>{s.title}</h1>
          <div className="cp-copy__foot">
            <p>{s.text}</p>
            {i===2 && <Link className="cp-main-cta" to="/contact">Start creating <i>↗</i></Link>}
          </div>
          {i===0 && <div className="cp-google-review" aria-label="Google client review">
            <div className="cp-review-track">
              <div className="cp-review-slide" key={reviews[reviewIndex].name}>
                <img src={reviews[reviewIndex].avatar} alt={`${reviews[reviewIndex].name} avatar`} width="56" height="56" loading="lazy" decoding="async"/>
                <div className="cp-review-copy">
                  <div><strong>{reviews[reviewIndex].name}</strong><span>★★★★★</span></div>
                  <p>"{reviews[reviewIndex].text}"</p>
                </div>
              </div>
              <div className="cp-review-avatars" aria-hidden="true">
                {reviews.map((review,index)=><img key={review.name} src={review.avatar} alt="" width="28" height="28" className={index===reviewIndex?'active':''}/>)}
              </div>
            </div>
          </div>}
        </article>)}
      </div>

      <div className="cp-visual" aria-live="polite">
        {scenes.map((s,i)=><figure key={i} className={`cp-image cp-image--${i} ${i===stage?'is-active':''}`}>
          <img src={s.image} alt={s.alt} width="1536" height="1024" draggable="false" loading={i===0?'eager':'lazy'} decoding="async" fetchPriority={i===0?'high':'auto'}/>
        </figure>)}

        <div className={`cp-code ${stage===1&&!optimizing?'is-visible':''}`} aria-hidden="true">
          <div className="cp-code__bar"><span>src / Home.jsx</span><i/><i/><i/></div>
          {code.map((line,i)=><div className={`cp-code__line ${i<typed?'is-typed':''}`} key={line}><b>{String(i+1).padStart(2,'0')}</b><code>{line}</code>{i===typed-1&&stage===1&&!optimizing&&<em/>}</div>)}
        </div>

        <div className={`cp-audit ${optimizing?'is-visible':''}`} aria-hidden="true">
          <small>READY TO PERFORM</small>
          <div><span>Performance</span><b>98</b></div><div><span>SEO</span><b>100</b></div><div><span>Accessibility</span><b>100</b></div>
          <p>OPTIMIZED FOR LAUNCH <i>✓</i></p>
        </div>

        <div className={`cp-live ${stage===2&&phase!=='reveal'?'is-visible':''}`} aria-hidden="true"><i/> LIVE <span>rafynha.com</span></div>
        <div className={`cp-person-alert ${stage===0?'is-visible':''}`} aria-hidden="true">
          <span>New project</span>
          <strong>Alex wants a launch page</strong>
        </div>
      </div>

      <div className={`cp-mobile-review ${stage===0?'is-visible':''}`} aria-label="Client review">
        <img src={reviews[reviewIndex].avatar} alt={`${reviews[reviewIndex].name} avatar`} width="42" height="42" loading="lazy" decoding="async"/>
        <div>
          <strong>{reviews[reviewIndex].name}<span>★★★★★</span></strong>
          <p>“{reviews[reviewIndex].text}”</p>
        </div>
      </div>
    </div>
  </section>
}

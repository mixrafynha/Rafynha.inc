import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const scenes = [
  {
    n:'01', eyebrow:'STRATEGY',
    title:<><span className="cp-title-line">BUILD A WEBSITE</span><br/><em>PEOPLE FIND.</em></>,
    text:'SEO-ready websites that make your business easier to find, trust and choose.',
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
    image:'/hero/process/deploy-beige.png', alt:'Finished responsive website live across desktop, laptop and mobile'
  }
];

const code = [
  'search.intent()',
  'brand.entity()',
  'expert.content()',
  'answers.optimize()',
  'authority.grow()',
  'clients.discover()'
];

const reviews = [
  {
    name:'Maya',
    avatar:'https://randomuser.me/api/portraits/women/32.jpg',
    text:'Clear design, fast delivery and the site finally looks professional.'
  },
  {
    name:'Noah',
    avatar:'https://randomuser.me/api/portraits/men/68.jpg',
    text:'People understand what we do faster, and the brand feels premium now.'
  },
  {
    name:'Emma',
    avatar:'https://randomuser.me/api/portraits/women/46.jpg',
    text:'The new website made our service easier to trust from the first visit.'
  },
  {
    name:'Sofia',
    avatar:'https://randomuser.me/api/portraits/women/65.jpg',
    text:'The new site feels clear, polished and much easier for clients to navigate.'
  },
  {
    name:'Daniel',
    avatar:'https://randomuser.me/api/portraits/men/75.jpg',
    text:'We got better enquiries right after launch.'
  },
  {
    name:'Lena',
    avatar:'https://randomuser.me/api/portraits/women/32.jpg',
    text:'Fast, thoughtful and genuinely focused on making the business grow.'
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
  const [isMobile,setIsMobile] = useState(false);
  const totalCodeChars=code.join('').length;

  useEffect(()=>{
    if(stage!==1){
      setTyped(stage>1?totalCodeChars:0);
      return;
    }
    setTyped(0);
    const timer=window.setInterval(()=>{
      setTyped(current=>Math.min(totalCodeChars,current+1));
    },42);
    return()=>window.clearInterval(timer);
  },[stage,totalCodeChars]);

  useEffect(()=>{
    const query=window.matchMedia('(max-width: 699px)');
    const sync=()=>setIsMobile(query.matches);
    sync();
    query.addEventListener?.('change',sync);
    return()=>query.removeEventListener?.('change',sync);
  },[]);

  useLayoutEffect(()=>{
    const timer=window.setInterval(()=>{
      setReviewIndex((current)=>(current+1)%reviews.length);
    },3600);
    return()=>window.clearInterval(timer);
  },[]);

  useLayoutEffect(()=>{
    const el=root.current; if(!el) return;
    let raf=0, visible=true, lastStage=-1, lastPhase='', lastTyped=-1;
    let mobile=window.matchMedia('(max-width: 699px)').matches;
    let tablet=window.matchMedia('(min-width: 700px) and (max-width: 1180px)').matches;
    let compact=mobile||tablet;
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
      const s=mobile
        ? (current<.40?0:(current<.80?1:2))
        : Math.min(2,Math.floor(Math.min(scaled,2.9999)));
      if(mobile){
        el.style.setProperty('height','170svh','important');
      }
      const l=clamp(scaled-s);
      const ph=mobile?'hold':(l<.18?'reveal':l<.76?'hold':'exit');
      const typeCount=mobile?(s>=1?totalCodeChars:0):(s===1?Math.max(0,Math.min(totalCodeChars,Math.floor(clamp((l-.16)/.42)*(totalCodeChars+1)))):(s>1?totalCodeChars:0));
      el.dataset.navTheme=s===2?'lime':'light';

      // Mobile intentionally avoids per-frame DOM/style work. The active scene class
      // is enough for the lightweight crossfade and makes touch scrolling much cheaper.
      if(!mobile){
        el.style.setProperty('--hp',current.toFixed(4));
        el.style.setProperty('--hl',l.toFixed(4));
        el.style.setProperty('--scene-shift',`${((l-.5)*12).toFixed(2)}px`);

        // Keep the image, title and scroll stage aligned instead of handing the
        // image off after the copy has already changed.
        const visualPos=s;
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
          figure.style.setProperty('--image-transform',`translate3d(${x.toFixed(1)}px,${y}px,0) scale(${((1+extraScale-d*.035)*1.3).toFixed(3)})`);
          figure.style.zIndex=String(20-Math.round(d*4));
        });

        if(tablet){
          el.style.setProperty('height',s===2?'105vh':'125vh','important');
          const tabletCopy=el.querySelector('.cp-copy');
          tabletCopy?.style.setProperty('top','12.8vh','important');
          el.querySelectorAll('.cp-copy__scene').forEach((scene,index)=>{
            const sceneTitle=scene.querySelector('h1,h2');
            const titleLift=index===2?-90:index>0?-80:0;
            if(sceneTitle && index>0){
              sceneTitle.style.setProperty('transform',`translateY(${titleLift}px)`,'important');
            }
            const foot=scene.querySelector('.cp-copy__foot');
            if(foot){
              foot.style.setProperty('position','absolute','important');
              const titleBottom=sceneTitle ? sceneTitle.offsetTop+sceneTitle.offsetHeight+titleLift+(index===0?15:45) : 112;
              foot.style.setProperty('top',`${titleBottom}px`,'important');
              foot.style.setProperty('left','0','important');
              foot.style.setProperty('width','100%','important');
              foot.style.setProperty('margin','0','important');
              foot.style.setProperty('transform','none','important');
              foot.querySelector('p')?.style.setProperty('text-align','center','important');
              if(index===2){
                const cta=foot.querySelector('.cp-main-cta');
                cta?.style.setProperty('transform','translate(-50%, 530px)','important');
                cta?.style.setProperty('left','50%','important');
                cta?.style.setProperty('padding-top','20px','important');
                cta?.style.setProperty('padding-bottom','20px','important');
                cta?.style.setProperty('font-size','16px','important');
                cta?.style.setProperty('padding-left','156px','important');
                cta?.style.setProperty('padding-right','156px','important');
                cta?.style.setProperty('animation','cpCtaPulse 2.2s ease-in-out infinite','important');
              }
            }
          });
          el.querySelectorAll('.cp-scene-image').forEach((image,index)=>{
            image.style.setProperty('left','50%','important');
            image.style.setProperty('top',index===2?'226px':'286px','important');
            image.style.setProperty('right','auto','important');
            image.style.setProperty('bottom','auto','important');
            image.style.setProperty('transform','translateX(-50%)','important');
            const imageContent=image.querySelector('img');
            if(imageContent){
              imageContent.style.setProperty('transform',`translate(0, -240px) scale(${index===1?.84:index===2?.85:.99})`,'important');
              imageContent.style.setProperty('transform-origin','center center','important');
            }
          });
        }
        if(mobile){
          const mobileCopy=el.querySelector('.cp-copy');
          mobileCopy?.style.setProperty('top','44vh','important');
          const mobileImage=el.querySelector('.cp-scene-image--0');
          if(mobileImage){
            mobileImage.style.setProperty('transform','translateY(70vh)','important');
          }
        }
      }
      if(mobile){
        const mobileCopy=el.querySelector('.cp-copy');
        mobileCopy?.style.setProperty('top',s===2?'9vh':s===1?'7vh':'11vh','important');
        const firstTitle=el.querySelector('.cp-copy__scene--0 h1');
        if(firstTitle){
          const firstTitleStyle=getComputedStyle(firstTitle);
          el.querySelectorAll('.cp-copy__scene--1 h2,.cp-copy__scene--2 h2').forEach((title)=>{
            ['font-size','line-height','letter-spacing','font-weight','font-family'].forEach((property)=>{
              title.style.setProperty(property,firstTitleStyle.getPropertyValue(property),'important');
            });
          });
          const thirdTitle=el.querySelector('.cp-copy__scene--2 h2');
          const firstFontSize=parseFloat(firstTitleStyle.fontSize);
          if(thirdTitle && Number.isFinite(firstFontSize)){
            thirdTitle.style.setProperty('font-size',`${(firstFontSize*.95).toFixed(2)}px`,'important');
            thirdTitle.style.setProperty('line-height','.72','important');
            thirdTitle.style.setProperty('letter-spacing','-.08em','important');
            thirdTitle.style.setProperty('position','relative','important');
            thirdTitle.style.setProperty('top','15%','important');
          }
        }
        el.querySelectorAll('.cp-scene-image').forEach((mobileImage,index)=>{
          const mobileTransform=index===0
            ? 'translate(calc(-5px - 1vw), 10vh)'
            : index===1
              ? 'translate(-5px, 12vh)'
              : 'translate(-5px, 29vh)';
          mobileImage.style.setProperty('transform',mobileTransform,'important');
          mobileImage.style.setProperty('transform-origin','center center','important');
          const mobileImageContent=mobileImage.querySelector('img');
          if(mobileImageContent){
            const mobileImageSize=index===0?'160%':'155%';
            const mobileImageOffset=index===0?'-30%':'-27.5%';
            mobileImageContent.style.setProperty('width',mobileImageSize,'important');
            mobileImageContent.style.setProperty('height',mobileImageSize,'important');
            mobileImageContent.style.setProperty('margin-left',mobileImageOffset,'important');
            mobileImageContent.style.setProperty('margin-top',mobileImageOffset,'important');
          }
        });
        el.querySelectorAll('.cp-review-copy p').forEach((reviewText)=>{
          reviewText.style.setProperty('position','relative','important');
          reviewText.style.setProperty('left','-25px','important');
          reviewText.style.setProperty('top','30px','important');
          reviewText.style.setProperty('display','block','important');
          reviewText.style.setProperty('width','100%','important');
          reviewText.style.setProperty('max-width','100%','important');
          reviewText.style.setProperty('padding-right','0','important');
          reviewText.style.setProperty('text-align','center','important');
          reviewText.style.setProperty('font-size','13.8px','important');
          reviewText.style.setProperty('line-height','1.22','important');
          reviewText.style.setProperty('height','33px','important');
          reviewText.style.setProperty('min-height','33px','important');
          reviewText.style.setProperty('height','auto','important');
          reviewText.style.setProperty('max-height','none','important');
          reviewText.style.setProperty('overflow','hidden','important');
          reviewText.style.setProperty('-webkit-line-clamp','unset','important');
          reviewText.style.setProperty('white-space','normal','important');
        });
        const mobileReviewHeading=el.querySelector('.cp-copy__scene--0 .cp-review-copy div');
        if(mobileReviewHeading){
          mobileReviewHeading.style.setProperty('position','relative','important');
          mobileReviewHeading.style.setProperty('left','calc(30px - 3vw)','important');
          mobileReviewHeading.style.setProperty('top','8px','important');
          const mobileReviewStars=mobileReviewHeading.querySelector('span');
          if(mobileReviewStars){
            mobileReviewStars.style.setProperty('position','relative','important');
            mobileReviewStars.style.setProperty('left','6px','important');
          }
        }
      }
      if(s!==lastStage){lastStage=s;setStage(s)}
      if(ph!==lastPhase){lastPhase=ph;setPhase(ph)}
      if(s!==1 && typeCount!==lastTyped){lastTyped=typeCount;setTyped(typeCount)}
    };

    const getProgress=()=>{
      const activeTravel=mobile?Math.min(metrics.travel,(window.visualViewport?.height||window.innerHeight)*.52):metrics.travel;
      return clamp((window.scrollY-metrics.top)/activeTravel);
    };

    const tick=()=>{
      const delta=target.current-smooth.current;
      smooth.current += delta*(tablet?.42:mobile?.28:.14);
      if(Math.abs(delta)<.00045) smooth.current=target.current;
      paint(smooth.current);
      if(Math.abs(target.current-smooth.current)>.00045 && visible) raf=requestAnimationFrame(tick);
      else running.current=false;
    };

    const read=()=>{
      target.current=getProgress();
      if(!initialized){paint(target.current,true);return}
      if(!visible) return;
      if(mobile){
        if(running.current) return;
        running.current=true;
        raf=requestAnimationFrame(()=>{paint(target.current,true);running.current=false});
        return;
      }
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
    const onResize=()=>{
      mobile=window.matchMedia('(max-width: 699px)').matches;
      tablet=window.matchMedia('(min-width: 700px) and (max-width: 1180px)').matches;
      compact=mobile||tablet;
      hardSync();
    };
    window.addEventListener('scroll',read,{passive:true});
    window.addEventListener('resize',onResize,{passive:true});
    window.visualViewport?.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('pageshow',onPageShow);
    window.addEventListener('load',onLoad,{once:true});
    if(document.fonts?.ready) document.fonts.ready.then(()=>hardSync()).catch(()=>{});
    Array.from(el.images||[]).forEach(img=>{if(!img.complete)img.addEventListener('load',hardSync,{once:true})});

    return()=>{
      io.disconnect();ro.disconnect();
      window.removeEventListener('scroll',read);
      window.removeEventListener('resize',onResize);
      window.visualViewport?.removeEventListener('resize',onResize);
      window.removeEventListener('pageshow',onPageShow);
      window.removeEventListener('load',onLoad);
      if(raf)cancelAnimationFrame(raf);
    };
  },[]);

  const optimizing=stage===1 && typed>=code.join('').length;

  return <section ref={root} className="cinematic-process cinematic-process--three motion-v7" data-stage={stage} data-phase={phase} data-nav-theme="light">
    <div className="cinematic-process__sticky">
      <div className="cp-ambient"/>

      <div className="cp-copy">
        {scenes.map((s,i)=><article key={s.n} className={`cp-copy__scene cp-copy__scene--${i} ${i===stage?'is-active':''}`}>
          <div className="cp-eyebrow"><b>{s.n}</b><span>{s.eyebrow}</span></div>
          {i===0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
          <div className="cp-copy__foot">
            <p>{s.text}</p>
            {i===1 && <div className="cp-dev-times" aria-label="Development timeline">
              <span><img src="/services/rafynha-orbit-brand.webp" alt="" loading="lazy" decoding="async"/><b>Design</b></span>
              <span><img src="/services/web-experience-window.webp" alt="" loading="lazy" decoding="async"/><b>Build</b></span>
              <span><img src="/services/mobile-dashboard.webp" alt="" loading="lazy" decoding="async"/><b>Launch</b></span>
            </div>}
            {i===2 && <Link className="cp-main-cta" to="/contact">CREATE YOUR WEBSITE <i>↗</i></Link>}
          </div>
          <figure className={`cp-scene-image cp-scene-image--${i} tablet-scene-image--${i}`}>
            <img src={s.image} alt={s.alt} width="1122" height="1402" draggable="false" loading={i===0?'eager':'lazy'} decoding="async" fetchPriority={i===0?'high':'auto'}/>
          </figure>
          {i===0 && <div className="cp-google-review" aria-label="Google client review">
            <div className="cp-review-brand">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z"/>
                <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"/>
                <path fill="#FBBC05" d="M6.53 13.58A5.85 5.85 0 0 1 6.22 12c0-.55.1-1.08.31-1.58V7.9H3.29A9.5 9.5 0 0 0 2.25 12c0 1.48.35 2.88 1.04 4.1l3.24-2.52Z"/>
                <path fill="#EA4335" d="M12 6.39c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.5 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.4l3.24 2.52C7.3 8.11 9.46 6.39 12 6.39Z"/>
              </svg>
            </div>
            <div className="cp-review-track">
              <div className="cp-review-slide">
                <img src={reviews[reviewIndex].avatar} alt={`${reviews[reviewIndex].name} avatar`} width="56" height="56" loading="lazy" decoding="async"/>
                <div className="cp-review-copy">
                  <div><strong>{reviews[reviewIndex].name}</strong><span>★★★★★</span></div>
                <p style={{display:'block',width:'100%',maxWidth:'none',height:'auto',maxHeight:'none',overflow:'visible',whiteSpace:'normal',WebkitLineClamp:'unset'}}>“{reviews[reviewIndex].text}”</p>
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
        {!isMobile && <div className={`cp-code ${stage===1?'is-visible':''}`} aria-hidden="true">
          <div className="cp-code__bar"><span>src / Home.jsx</span><i/><i/><i/></div>
          {code.map((line,i)=>{
            const charsBefore=code.slice(0,i).reduce((total,item)=>total+item.length,0);
            const visibleChars=Math.max(0,Math.min(line.length,typed-charsBefore));
            const isTyping=stage===1 && typed>charsBefore && typed<charsBefore+line.length;
            return <div className={`cp-code__line ${visibleChars?'is-typed':''}`} key={line}><b>{String(i+1).padStart(2,'0')}</b><code>{line.slice(0,visibleChars)}</code>{isTyping&&<em/>}</div>;
          })}
        </div>}

        <div className={`cp-audit ${optimizing || (isMobile && stage===0)?'is-visible':''}`} aria-hidden="true">
          <small>READY TO PERFORM</small>
          <div><span>Performance</span><b>98</b></div><div><span>SEO</span><b>100</b></div><div><span>Accessibility</span><b>100</b></div>
          <p>OPTIMIZED FOR LAUNCH <i>✓</i></p>
        </div>

        <div className={`cp-live ${((stage===2&&phase!=='reveal') || (isMobile && stage===0))?'is-visible':''}`} aria-hidden="true"><i/> LIVE <span>rafynha.com</span></div>
        <div className={`cp-person-alert ${stage===0?'is-visible':''}`} aria-hidden="true">
          <span>New project</span>
          <strong>Alex wants a launch page</strong>
        </div>
      </div>

      {false && isMobile && <div className={`cp-mobile-review ${stage===0?'is-visible':''}`} aria-label="Client review">
        <img src={reviews[reviewIndex].avatar} alt={`${reviews[reviewIndex].name} avatar`} width="42" height="42" loading="lazy" decoding="async"/>
        <div>
          <strong>{reviews[reviewIndex].name}<span>★★★★★</span></strong>
          <p>“{reviews[reviewIndex].text}”</p>
        </div>
      </div>}
    </div>
  </section>
}

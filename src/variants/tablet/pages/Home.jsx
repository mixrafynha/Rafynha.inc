import { lazy, Suspense } from 'react';
import DeferredSection from '../../../shared/components/DeferredSection.jsx';
import HeroJourney from '../components/HeroJourney.jsx';

const ServicesPreview = lazy(() => import('../components/ServicesPreview.jsx'));
const ProjectOrbitShowcase = lazy(() => import('../components/ProjectOrbitShowcase.jsx'));
const HomeFinalSections = lazy(() => import('../components/HomeFinalSections.jsx'));

export default function Home(){
 return <main>
  <div className="home-device-page home-device-page--tablet"><HeroJourney/></div>
  <p className="seo-visually-hidden">Rafynha provides mobile-first web design, responsive website development, Google SEO, keyword strategy, technical SEO, local SEO, AI search optimization, landing pages, Core Web Vitals and website performance optimization, conversion-focused UX, brand identity and brand direction for growing businesses.</p>

  <Suspense fallback={null}><ServicesPreview/></Suspense>

  <DeferredSection minHeight={760}>
    <Suspense fallback={null}><ProjectOrbitShowcase/></Suspense>
  </DeferredSection>

  <DeferredSection minHeight={620}>
    <Suspense fallback={null}><HomeFinalSections/></Suspense>
  </DeferredSection>
 </main>
}

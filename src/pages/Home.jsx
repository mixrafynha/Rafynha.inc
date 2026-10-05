import { lazy, Suspense } from 'react';
import DeferredSection from '../components/DeferredSection.jsx';
import HeroJourney from '../components/HeroJourney.jsx';

const ServicesPreview = lazy(() => import('../components/ServicesPreview.jsx'));
const ProjectOrbitShowcase = lazy(() => import('../components/ProjectOrbitShowcase.jsx'));
const HomeFinalSections = lazy(() => import('../components/HomeFinalSections.jsx'));

export default function Home(){
 return <main>
  <HeroJourney/>

  <DeferredSection minHeight={620}>
    <Suspense fallback={null}><ServicesPreview/></Suspense>
  </DeferredSection>

  <DeferredSection minHeight={760}>
    <Suspense fallback={null}><ProjectOrbitShowcase/></Suspense>
  </DeferredSection>

  <DeferredSection minHeight={620}>
    <Suspense fallback={null}><HomeFinalSections/></Suspense>
  </DeferredSection>
 </main>
}

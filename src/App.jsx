import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Seo from './components/Seo.jsx';
import RevealOnScroll from './components/RevealOnScroll.jsx';
import Home from './pages/Home.jsx';

const Projects = lazy(() => import('./pages/Projects.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

export default function App(){
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }); }, [pathname]);
  return <>
    <Seo/>
    <Navbar/>
    <RevealOnScroll/>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/projets" element={<Projects/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/a-propos" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </Suspense>
    <Footer/>
  </>
}

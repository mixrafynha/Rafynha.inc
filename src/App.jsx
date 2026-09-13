import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Seo from './components/Seo.jsx';
import RevealOnScroll from './components/RevealOnScroll.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

export default function App(){
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }); }, [pathname]);
  return <>
    <Seo/>
    <Navbar/>
    <RevealOnScroll/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/projets" element={<Projects/>}/>
      <Route path="/services" element={<Services/>}/>
      <Route path="/a-propos" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
    </Routes>
    <Footer/>
  </>
}

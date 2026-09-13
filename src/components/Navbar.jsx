import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/projets', 'Work'],
  ['/a-propos', 'About'],
  ['/contact', 'Contact'],
];

export default function Navbar(){
  const [scrolled,setScrolled] = useState(false);
  const [theme,setTheme] = useState('dark');

  useEffect(()=>{
    let raf = 0;
    const update = ()=>{
      raf = 0;
      setScrolled(window.scrollY > 22);
      const sections = [...document.querySelectorAll('[data-nav-theme]')];
      let current = 'dark';
      for(const el of sections){
        const r = el.getBoundingClientRect();
        if(r.top <= 44 && r.bottom > 44){ current = el.dataset.navTheme || 'dark'; break; }
      }
      setTheme(current);
    };
    const onScroll = ()=>{ if(!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll,{passive:true});
    return ()=>{ cancelAnimationFrame(raf); removeEventListener('scroll',onScroll); removeEventListener('resize',onScroll); };
  },[]);

  const stateClass = `${scrolled?'is-scrolled':''} theme-${theme}`;

  return <>
    <header className={`rf-simple-desktop ${stateClass}`}>
      <NavLink to="/" className="rf-simple-brand rf-svg-brand" aria-label="Rafynha — home"><img src="/brand/rafyhna-logo.svg" alt="RAFYHNA." /></NavLink>
      <nav className="rf-simple-links" aria-label="Main navigation">
        {links.map(([to,label])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}
      </nav>
    </header>

    <header className={`rf-simple-mobile ${stateClass}`}>
      <NavLink to="/" className="rf-simple-brand rf-svg-brand" aria-label="Rafynha — home"><img src="/brand/rafyhna-logo.svg" alt="RAFYHNA." /></NavLink>
      <nav className="rf-mobile-inline-links" aria-label="Mobile navigation">
        {links.slice(1).map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}
      </nav>
    </header>
  </>;
}

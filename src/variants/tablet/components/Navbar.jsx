import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/projets', 'Work'],
  ['/a-propos', 'About'],
  ['/contact', 'Contact'],
];

export default function Navbar(){
  const [scrolled,setScrolled] = useState(false);
  const [theme,setTheme] = useState('dark');
  const [hidden,setHidden] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(()=>{
    setMenuOpen(false);
  },[pathname]);

  useEffect(()=>{
    const onKeyDown = (event)=>{
      if(event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[]);

  useEffect(()=>{
    let raf = 0;
    let lastY = window.scrollY;
    const update = ()=>{
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 22);
      setHidden(!menuOpen && y > lastY && y > 120);
      lastY = y;
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
    return ()=>{
      cancelAnimationFrame(raf);
      removeEventListener('scroll',onScroll);
      removeEventListener('resize',onScroll);
    };
  },[menuOpen]);

  const stateClass = `${scrolled?'is-scrolled':''} ${hidden?'is-hidden':''} theme-${theme}`;

  return <>
    <header className={`rf-simple-desktop ${stateClass}`}>
      <NavLink to="/" className="rf-simple-brand rf-svg-brand" aria-label="Rafynha — home">
        <img src="/brand/rafyhna-logo.svg" alt="RAFYHNA." />
      </NavLink>
      <nav className="rf-simple-links" aria-label="Main navigation">
        {links.map(([to,label])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}
      </nav>
    </header>

    <div className={`rf-mobile-nav-wrap ${menuOpen?'is-open':''}`}>
      <header className={`rf-simple-mobile ${stateClass} ${menuOpen?'menu-open':''}`}>
        <NavLink to="/" className="rf-simple-brand rf-svg-brand" aria-label="Rafynha — home">
          <img src="/brand/rafyhna-logo.svg" alt="RAFYHNA." />
        </NavLink>

        <button
          className="rf-mobile-burger"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="rf-mobile-menu"
          onClick={()=>setMenuOpen(open=>!open)}
        >
          <span />
          <span />
        </button>
      </header>

      <nav id="rf-mobile-menu" className="rf-mobile-menu" aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {links.map(([to,label],index)=><NavLink
          key={to}
          to={to}
          end={to==='/'}
          className={({isActive})=>isActive?'active':''}
          style={{'--menu-index':index}}
          tabIndex={menuOpen ? 0 : -1}
        >
          <span>{String(index+1).padStart(2,'0')}</span>
          <strong>{label}</strong>
          <i aria-hidden="true">↗</i>
        </NavLink>)}
      </nav>

      <button className="rf-mobile-menu-backdrop" type="button" aria-label="Close navigation" tabIndex={menuOpen?0:-1} onClick={()=>setMenuOpen(false)} />
    </div>
  </>;
}

import { useEffect } from 'react';

export default function RevealOnScroll(){
  useEffect(() => {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (!items.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
  return null;
}

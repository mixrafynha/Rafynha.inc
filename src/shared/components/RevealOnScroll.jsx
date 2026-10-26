import { useEffect } from 'react';

export default function RevealOnScroll(){
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const observed = new WeakSet();

    const revealImmediately = (root = document) => {
      const items = [];
      if (root instanceof Element && root.matches('[data-reveal]')) items.push(root);
      if (root.querySelectorAll) items.push(...root.querySelectorAll('[data-reveal]'));
      items.forEach(el => el.classList.add('is-visible'));
    };

    if (reducedMotion || mobile) {
      revealImmediately();
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node instanceof Element) revealImmediately(node);
          });
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });

    const observeRevealItems = (root = document) => {
      const items = [];
      if (root instanceof Element && root.matches('[data-reveal]')) items.push(root);
      if (root.querySelectorAll) items.push(...root.querySelectorAll('[data-reveal]'));

      items.forEach(el => {
        if (observed.has(el) || el.classList.contains('is-visible')) return;
        observed.add(el);
        observer.observe(el);
      });
    };

    observeRevealItems();

    // Lazy-loaded sections can mount after the first effect has already run.
    // Watch newly inserted DOM nodes so every data-reveal element is observed.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) observeRevealItems(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}

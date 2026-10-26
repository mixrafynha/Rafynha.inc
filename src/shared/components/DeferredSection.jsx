import { useEffect, useRef, useState } from 'react';

export default function DeferredSection({ children, minHeight = 600, rootMargin = '700px 0px' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || ready) return;
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    if (!mobile || !('IntersectionObserver' in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ready, rootMargin]);

  return <div ref={ref} style={ready ? undefined : { minHeight }}>{ready ? children : null}</div>;
}

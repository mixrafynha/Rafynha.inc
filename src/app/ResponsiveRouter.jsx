import { lazy, Suspense, useEffect, useRef } from 'react';

const MobileApp = lazy(() => import('../variants/mobile/App.jsx'));
const TabletApp = lazy(() => import('../variants/tablet/App.jsx'));
const DesktopApp = lazy(() => import('../variants/desktop/App.jsx'));

export function getLayout(width = window.innerWidth) {
  if (width <= 699) return 'mobile';
  if (width <= 1180) return 'tablet';
  return 'desktop';
}

export default function ResponsiveRouter() {
  const layout = getLayout();
  const initialLayout = useRef(layout);

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (getLayout() !== initialLayout.current) {
          // A hard reload deliberately unloads the previous variant's CSS chunk.
          // The current pathname/query/hash are preserved by location.reload().
          window.location.reload();
        }
      });
    };
    window.addEventListener('resize', sync, { passive: true });
    window.visualViewport?.addEventListener('resize', sync, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('resize', sync);
    };
  }, []);

  const App = layout === 'mobile' ? MobileApp : layout === 'tablet' ? TabletApp : DesktopApp;
  return <Suspense fallback={null}><App /></Suspense>;
}

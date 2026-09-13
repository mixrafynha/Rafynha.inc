# Rafynha — cinematic portfolio

## Run
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npm run preview
```

### Improvements in this version
- adaptive navbar that changes visual treatment by section without changing its original structure
- smoother hero and project transitions, reveal system, hover micro-interactions and reduced-motion support
- route-level SEO titles/descriptions, canonical tags, Open Graph, Twitter metadata and JSON-LD
- stronger accessibility (focus states, ARIA labels) and image loading/decoding hints
- preconnect/dns-prefetch for the external Three.js / texture / font resources

Before final deployment, replace the runtime canonical origin automatically with your final custom domain simply by deploying the site there. The SEO component uses `window.location.origin`.


## Project Orbit showcase
The homepage project reel uses a scroll-controlled 3D Y-axis orbit. Each project holds front-facing, rotates out, and the next rotates in. Clicking a project opens its live URL inside a near-fullscreen iframe modal; close it to return to the same scroll position.

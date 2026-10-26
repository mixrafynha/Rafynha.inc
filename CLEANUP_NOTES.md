# Cleanup notes

This package contains only the new responsive architecture.

- The old root `src/components`, `src/pages`, `src/App.jsx`, `src/styles.css`, and old project data were removed.
- Each variant now mounts only its own HeroJourney wrapper; the unused Desktop/Tablet/Mobile helper wrappers inside each variant were removed.
- Unreachable JS/JSX/CSS files inside each variant were removed using the import graph from that variant `App.jsx`.
- Each variant stylesheet was conservatively pruned to selectors referenced by that variant while preserving global element rules, keyframes, font faces, supports rules, and applicable media rules.
- Original breakpoints remain: mobile <=699px, tablet 700-1180px, desktop >=1181px, preserving the GitHub layout boundaries.

Before publishing, run `npm install` and `npm run build` on the target machine.

## Visual-safe deduplication pass

A final conservative pass was applied with **zero CSS changes**.

Shared because they were byte-for-byte identical across Mobile / Tablet / Desktop:
- `src/shared/components/Seo.jsx`
- `src/shared/components/RevealOnScroll.jsx`
- `src/shared/components/DeferredSection.jsx`

The three copies of each were removed from `src/variants/*/components` and imports were redirected to `src/shared/components`.

Intentionally kept separate even where current JSX is identical:
- Navbar / Footer
- HeroJourney
- PageHero
- ProjectModal
- ServicesPreview
- ProjectOrbitShowcase
- HomeFinalSections
- all variant pages

Reason: those are visual/layout surfaces and remain independently editable for Mobile / Tablet / Desktop.

Validation:
- all 3 variant CSS files are byte-for-byte unchanged from the previous clean package;
- 0 broken relative imports detected;
- all source files remain reachable from `src/main.jsx`;
- JS/JSX line count reduced from about 3,998 to 3,568 without changing visual CSS.

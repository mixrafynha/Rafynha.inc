# Visual-safe cleanup

This pass intentionally changes no CSS declarations, media queries, layout values, animation values, selector order, or variant-specific visual components.

Shared only because the files were byte-for-byte identical in Mobile, Tablet, and Desktop:
- `src/shared/components/Seo.jsx`
- `src/shared/components/RevealOnScroll.jsx`
- `src/shared/components/DeferredSection.jsx`

Variant-specific visual components and pages remain separate even where their current JSX happens to be identical. This preserves independent Mobile / Tablet / Desktop editing without changing rendering.

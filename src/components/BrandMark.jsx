export default function BrandMark({ compact = false }) {
  return (
    <span className={`brand-lockup ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <span className="brand-glyph">
        <span className="brand-glyph-r">R</span>
        <span className="brand-glyph-slash" />
        <span className="brand-glyph-dot" />
      </span>
      <span className="brand-wordmark">
        <span>RAFYHNA</span><b>.</b>
      </span>
    </span>
  );
}

export function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__card">
        <div className="loading-overlay__spinner" />
        <p className="loading-overlay__text">Loading panorama…</p>
      </div>
    </div>
  )
}

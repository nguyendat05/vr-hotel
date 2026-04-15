import { useEffect } from 'react'

export function HotspotOverlay({ hotspot, roomName, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!hotspot) return null

  return (
    <div className="hotspot-overlay" role="dialog" aria-modal="true" aria-labelledby="hotspot-title">
      <button type="button" className="hotspot-overlay__backdrop" aria-label="Close" onClick={onClose} />
      <div className="hotspot-overlay__panel">
        <p className="hotspot-overlay__eyebrow">{roomName}</p>
        <h2 id="hotspot-title" className="hotspot-overlay__title">
          {hotspot.label}
        </h2>
        <p className="hotspot-overlay__body">{hotspot.description}</p>
        <button type="button" className="hotspot-overlay__close" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}

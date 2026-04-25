import { useCallback, useState } from 'react'
import { hotelExperience } from '../../data/hotel'

/**
 * Thanh điều hướng kiểu landing (tham khảo VR360): CTA đặt phòng, tour web, neo về khu 360°.
 */
export function HotelLandingChrome({ activeRoomName }) {
  const [embedOpen, setEmbedOpen] = useState(false)

  const scrollToTour = useCallback(() => {
    document.getElementById('hotel-tour')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <header className="hotel-chrome" role="banner">
        <div className="hotel-chrome__inner">
          <div className="hotel-chrome__brand">
            <span className="hotel-chrome__badge">VR Hotel</span>
            <div className="hotel-chrome__titles">
              <h1 className="hotel-chrome__name">{hotelExperience.hotelName}</h1>
              <p className="hotel-chrome__meta">
                {hotelExperience.location}
                {activeRoomName ? (
                  <>
                    <span className="hotel-chrome__dot" aria-hidden="true">
                      ·
                    </span>
                    <span className="hotel-chrome__active">Đang xem: {activeRoomName}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <p className="hotel-chrome__tagline">{hotelExperience.tagline}</p>

          <nav className="hotel-chrome__nav" aria-label="Điều hướng chính">
            <button type="button" className="hotel-chrome__pill hotel-chrome__pill--primary" onClick={scrollToTour}>
              Tour 360°
            </button>
            <a
              className="hotel-chrome__pill"
              href={hotelExperience.agodaBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Đặt phòng — Agoda
            </a>
            <a
              className="hotel-chrome__pill hotel-chrome__pill--ghost"
              href={hotelExperience.inspirationVrLandingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tham khảo mẫu VR360
            </a>
            <button type="button" className="hotel-chrome__pill" onClick={() => setEmbedOpen(true)}>
              Mở tour web đầy đủ
            </button>
          </nav>

          <p className="hotel-chrome__hint">
            Gợi ý: kéo chuột để xoay không gian; chọn điểm (hotspot) hoặc thẻ bên dưới để chuyển cảnh.
          </p>
        </div>
      </header>

      {embedOpen ? (
        <div className="hotel-embed-modal" role="dialog" aria-modal="true" aria-labelledby="hotel-embed-title">
          <button type="button" className="hotel-embed-modal__backdrop" aria-label="Đóng" onClick={() => setEmbedOpen(false)} />
          <div className="hotel-embed-modal__panel">
            <div className="hotel-embed-modal__head">
              <h2 id="hotel-embed-title" className="hotel-embed-modal__title">
                Tour web — {hotelExperience.hotelName}
              </h2>
              <div className="hotel-embed-modal__actions">
                <a
                  className="hotel-embed-modal__link"
                  href={hotelExperience.fullTourPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mở tab mới
                </a>
                <button type="button" className="hotel-embed-modal__close" onClick={() => setEmbedOpen(false)}>
                  Đóng
                </button>
              </div>
            </div>
            <iframe
              className="hotel-embed-modal__frame"
              title="Tour web Regalia Gold"
              src={hotelExperience.fullTourPageUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="hotel-embed-modal__note">
              Nếu khung trống, trang nguồn có thể chặn nhúng iframe — dùng nút «Mở tab mới».
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}

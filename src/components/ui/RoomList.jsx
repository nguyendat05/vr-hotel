import { useRef } from 'react'

export function RoomList({ rooms, activeRoomId, onSelectRoom }) {
  const listRef = useRef(null)

  const handleScroll = (direction) => {
    if (!listRef.current) return
    const amount = Math.max(220, Math.floor(listRef.current.clientWidth * 0.55))
    listRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <nav className="room-sidebar__nav" aria-label="Rooms">
      <p className="room-sidebar__label">Điểm tham quan</p>
      <div className="room-sidebar__strip">
        <button
          type="button"
          className="room-sidebar__arrow room-sidebar__arrow--left"
          aria-label="Cuộn danh sách sang trái"
          onClick={() => handleScroll(-1)}
        >
          ‹
        </button>
        <ul ref={listRef} className="room-sidebar__list">
          {rooms.map((room) => {
            const active = room.id === activeRoomId
            const preview = room.image?.faces?.[0]
            return (
              <li key={room.id} className={`room-sidebar__entry${active ? ' room-sidebar__entry--active' : ''}`}>
                <button
                  type="button"
                  className={`room-sidebar__item${active ? ' room-sidebar__item--active' : ''}`}
                  onClick={() => onSelectRoom(room.id)}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className="room-sidebar__item-media"
                    style={preview ? { backgroundImage: `url(${preview})` } : undefined}
                  >
                    <span className="room-sidebar__item-chip">{active ? 'Đang xem' : 'Xem phòng'}</span>
                  </span>
                  <span className="room-sidebar__item-content">
                    <span className="room-sidebar__item-name">{room.name}</span>
                    <span className="room-sidebar__item-hint">{room.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          className="room-sidebar__arrow room-sidebar__arrow--right"
          aria-label="Cuộn danh sách sang phải"
          onClick={() => handleScroll(1)}
        >
          ›
        </button>
      </div>
    </nav>
  )
}

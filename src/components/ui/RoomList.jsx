export function RoomList({ onClose, rooms, groups = [], activeGroupId, onSelectGroup, activeRoomId, activeRoomName, onSelectRoom }) {
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0]
  const visibleRoomIds = new Set(activeGroup?.roomIds ?? rooms.map((room) => room.id))
  const visibleRooms = rooms.filter((room) => visibleRoomIds.has(room.id))
  const primaryRooms = []
  const seenNames = new Set()
  visibleRooms.forEach((room) => {
    const key = room.name.trim().toLowerCase()
    if (seenNames.has(key)) return
    seenNames.add(key)
    primaryRooms.push(room)
  })

  return (
    <nav className="room-menu" aria-label="Menu tham quan">
      <div className="room-menu__left">
        <div className="room-menu__logo-wrap" aria-hidden="true">
          <img className="room-menu__logo" src="/regalia-assets/Tour360data/pano/Images/Logo.png" alt="" />
        </div>
        <div className="room-menu__groups" role="tablist" aria-label="Nhóm chức năng">
          {groups.map((group) => {
            const active = group.id === activeGroup?.id
            return (
              <button
                key={group.id}
                type="button"
                className={`room-menu__group-btn${active ? ' room-menu__group-btn--active' : ''}`}
                role="tab"
                aria-selected={active ? 'true' : 'false'}
                onClick={() => onSelectGroup?.(group.id)}
              >
                {group.name}
              </button>
            )
          })}
        </div>
      </div>
      <section className="room-menu__views" aria-label="Danh sách view">
        <header className="room-menu__views-head">
          <p className="room-menu__title">{activeGroup ? activeGroup.name : 'Điểm tham quan'}</p>
          <div className="room-menu__views-actions">
            <span className="room-menu__count">{primaryRooms.length} viewpoints chính</span>
            <button type="button" className="room-menu__close" onClick={onClose}>
              Close
            </button>
          </div>
        </header>
        <ul className="room-menu__grid">
          {primaryRooms.map((room) => {
            const active = room.id === activeRoomId || room.name === activeRoomName
            const preview = room.image?.faces?.[0]
            return (
              <li key={room.id} className="room-menu__card-wrap">
                <button
                  type="button"
                  className={`room-menu__card${active ? ' room-menu__card--active' : ''}`}
                  onClick={() => onSelectRoom(room.id)}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="room-menu__thumb" style={preview ? { backgroundImage: `url(${preview})` } : undefined}>
                    <span className="room-menu__chip">{active ? 'Đang xem' : 'Mở view'}</span>
                  </span>
                  <span className="room-menu__name">{room.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </nav>
  )
}

export function RoomList({ rooms, activeRoomId, onSelectRoom }) {
  return (
    <nav className="room-sidebar__nav" aria-label="Rooms">
      <p className="room-sidebar__label">Rooms</p>
      <ul className="room-sidebar__list">
        {rooms.map((room) => {
          const active = room.id === activeRoomId
          return (
            <li key={room.id}>
              <button
                type="button"
                className={`room-sidebar__item${active ? ' room-sidebar__item--active' : ''}`}
                onClick={() => onSelectRoom(room.id)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="room-sidebar__item-name">{room.name}</span>
                <span className="room-sidebar__item-hint">{active ? 'Viewing' : 'Open'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

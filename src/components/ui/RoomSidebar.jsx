import { RoomList } from './RoomList'

export function RoomSidebar({ rooms, activeRoomId, onSelectRoom }) {
  return (
    <aside className="room-sidebar">
      <div className="room-sidebar__toolbar">
        <div className="room-sidebar__brand">
          <span className="room-sidebar__badge">VR Hotel</span>
          <p className="room-sidebar__tagline">Chọn điểm tham quan</p>
        </div>
        <span className="room-sidebar__count">{rooms.length} phòng</span>
      </div>

      <div className="room-sidebar__body">
        <RoomList rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={onSelectRoom} />
      </div>
    </aside>
  )
}

import { RoomList } from './RoomList'

export function RoomSidebar({ rooms, activeRoomId, onSelectRoom }) {
  return (
    <aside className="room-sidebar">
      <div className="room-sidebar__brand">
        <span className="room-sidebar__badge">VR Hotel</span>
        <p className="room-sidebar__tagline">Ảnh 360° nội thất (demo)</p>
      </div>

      <RoomList rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={onSelectRoom} />

      <div className="room-sidebar__meta">
        <p className="room-sidebar__hint">Kéo để xoay · Bấm chấm xanh để xem mô tả</p>
      </div>
    </aside>
  )
}
